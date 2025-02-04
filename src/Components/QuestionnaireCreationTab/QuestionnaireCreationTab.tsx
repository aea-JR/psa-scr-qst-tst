import * as React from "react";
import * as Scrivito from "scrivito";
import "./QuestionnaireCreationTab.scss";
import { isQuestionnaireCreationValid } from "../../utils/isQuestionnaireCreationValid";
import {
	AnswerOptionDataClass,
	QuestionDataClass,
	QuestionnaireDataClass
} from "../../config/scrivitoConfig";
import { isEmpty, isString } from "lodash-es";
import { Description } from "../QuestionnaireCreationDescription/QuestionnaireCreationDescription";
import { extractQuestionnaireMeta } from "../../utils/extractQuestionnaireMeta";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { QuestionnaireMetaSnapshot, QuestionnaireStatus } from "../../types/questionnaire";
import { convertWidgetToQuestion } from "../../utils/convertoQuestion";
import { convertWidgetToAnswerOption } from "../../utils/convertoAnswerOptions";
import { getQuestionnaireItem } from "../../Data/Questionnaire/QuestionnaireDataClassUtils";
import { getQuestionItem } from "../../Data/Question/QuestionDataClassUtils";
import { getOptionItem } from "../../Data/AnswerOption/AnswerOptionDataClassUtils";
import { compareQuestionnaireMeta } from "../../utils/compareQuestionnaireMeta";


interface QuestionnaireCreationTabProps {
	widget: Scrivito.Widget;
}
//TODO: refactor
export const QuestionnaireCreationTab: React.FC<
	QuestionnaireCreationTabProps
> = ({ widget }) => {
	const [isCreating, setIsCreating] = React.useState(false);
	const [failedItems, setFailedItems] = React.useState<any[]>([]);
	const [status, setStatus] = React.useState<QuestionnaireStatus>("void");
	const isCreated = !isEmpty(widget.get("questionnaireId") as string);
	const uiContext = Scrivito.uiContext();
	const isValid = isQuestionnaireCreationValid(widget);
	const hasChanges = compareQuestionnaireMeta(widget);

	React.useEffect(() => {
		if (!isValid) {
			setStatus("invalid");
			return;
		}
		if (hasChanges) {
			setStatus("pendingUpdate")
			return;
		}
		if (isCreated) {
			setStatus("void");
		}

	}, [isValid, hasChanges])
	console.log(status)
	if (!uiContext) return null;


	//TODO: test, improve & use
	//TODO: remove retry, if the qst itself got created, 
	// show error to user that some items failed (maybe list them)
	// and let user simply retry whith the update functionality instead 
	// as the json is only updated for succeeded items
	const handleRetryFailedItems = async () => {
		if (failedItems.length === 0) return;

		const retryResults = [];
		for (const failedItem of failedItems) {
			try {
				if (failedItem.type === "question") {
					const questionItem = await QuestionDataClass().create({
						...failedItem.data,
					});
					failedItem.widget.update({ questionId: questionItem.id() });
				} else if (failedItem.type === "option") {
					const optionItem = await AnswerOptionDataClass().create({
						...failedItem.data,
					});
					failedItem.widget.update({ answerOptionId: optionItem.id() });
				}
				console.log(`Retried ${failedItem.type} successfully`);
			} catch (error) {
				console.error(`Retry failed for ${failedItem.type}:`, error);
				retryResults.push(failedItem);
			}
		}
		setFailedItems(retryResults);
	};

	//TODO: refactor && move to hook
	const handleCreateQuestionnaire = async () => {
		const createdItems: QuestionnaireMetaSnapshot = {
			qstMeta: {
				title: "",
				inputType: ""
			},
			questions: {},
			options: {}
		};
		try {
			setStatus("inCreation")
			setIsCreating(true);
			setFailedItems([]);

			const { questions, answerOptions, questionWidgets, optionWidgets } =
				extractQuestionsAndOptions(widget);
			if (isEmpty(questions)) {
				console.log(
					"Unable to create PisaSales questionnaire. No questions found!"
				);
				return;
			}

			console.log("Creating questionnaire...");
			const qstMeta = extractQuestionnaireMeta(widget);
			const qstDataItem = await QuestionnaireDataClass().create(qstMeta);
			const qstId = qstDataItem.id();
			createdItems.qstMeta = qstMeta;
			const newFailedItems = [];
			for (const question of questions) {
				try {
					const questionItem = await QuestionDataClass().create({
						...question,
						questionnaireId: qstId,
					});
					const questionId = questionItem.id();
					const questionWidget = questionWidgets.find(
						(w) => w.get("externalId") === question.externalId
					);
					if (questionWidget) {
						questionWidget.update({ questionId });
						createdItems.questions[questionId] = question;
						console.log(
							"Updated question " + question.externalId + " with: " + questionId
						);
					}

					const options = answerOptions.get(question.externalId);
					if (options && options.length > 0) {
						for (const option of options) {
							try {
								const optionItem = await AnswerOptionDataClass().create({
									...option,
									questionId,
								});
								const optionWidget = optionWidgets.find(
									(w) => w.get("externalId") === option.externalId
								);
								if (optionWidget) {
									console.log(
										"Updated option " +
										option.externalId +
										" with: " +
										optionItem.id()
									);
									if (!createdItems.options[questionId]) {
										createdItems.options[questionId] = {};
									}
									createdItems.options[questionId][optionItem.id()] = option;
									optionWidget.update({ answerOptionId: optionItem.id() });
								}
							} catch (error) {
								console.error(
									"Error creating option " + option.externalId + ":",
									error
								);
								const optionWidget = optionWidgets.find(
									(w) => w.get("externalId") === option.externalId
								);
								newFailedItems.push({
									type: "option",
									data: option,
									widget: optionWidget,
								});
							}
						}
					}
				} catch (error) {
					console.error(
						"Error creating question " + question.externalId + ":",
						error
					);
					const questionWidget = questionWidgets.find(
						(w) => w.get("externalId") === question.externalId
					);
					newFailedItems.push({
						type: "question",
						data: question,
						widget: questionWidget,
					});
				}
			}

			setFailedItems(newFailedItems);
			await qstDataItem.update({ forms: true });
			//TODO: handle/add failed items
			widget.update({ questionnaireId: qstId, creationData: JSON.stringify(createdItems) });
			setStatus("void")
		} catch (error) {
			console.error("Error creating questionnaire:", error);
			// add error/retry status
			//setStatus("")
		} finally {
			//setIsCreating(false);
		}
	};


	const updateQuestionnaire = async () => {
		const updates = {
			deleteQuestions: [] as string[],
			deleteOptions: [] as string[],
			createQuestions: [] as Scrivito.Widget[],
			createOptions: new Map<string, Scrivito.Widget[]>(), // questionExternalId → optionWidgets[]
			updateQuestions: new Map<string, Scrivito.Widget>(), // questionId → widget
			updateOptions: new Map<string, Scrivito.Widget>(),   // optionId → widget
		};

		const updatedQstMeta: QuestionnaireMetaSnapshot = {
			options: {},
			qstMeta: { title: "", inputType: "" },
			questions: {}
		};

		const qstId = widget.get("questionnaireId") as string;
		if (isEmpty(qstId)) {
			console.log("Unable to trigger update! Questionnaire id not found.");
			return;
		}

		const storedQstMetaJson = widget.get("creationData") as string;
		if (isEmpty(storedQstMetaJson) || !isString(storedQstMetaJson)) {
			console.error("Unable to trigger update.");
			return;
		}

		setStatus("updating");

		const storedQstMeta: QuestionnaireMetaSnapshot = JSON.parse(storedQstMetaJson);
		const { questionWidgets, optionWidgets } = extractQuestionsAndOptions(widget);

		// 1. Update questionnaire metadata
		const qstItem = await getQuestionnaireItem(qstId);
		const qstMeta = extractQuestionnaireMeta(widget);
		if (qstItem) {
			await qstItem.update(qstMeta);
			updatedQstMeta.qstMeta = qstMeta;
		}

		// 2. Identify deleted questions
		for (const questionId in storedQstMeta.questions) {
			if (!questionWidgets.some((w) => w.get("questionId") === questionId)) {
				updates.deleteQuestions.push(questionId);
			}
		}

		// 3. Identify new questions
		for (const widget of questionWidgets) {
			const questionId = widget.get("questionId") as string;
			if (!questionId) {
				updates.createQuestions.push(widget);
			}
		}

		// 4. Identify updated questions
		for (const questionId in storedQstMeta.questions) {
			if (!updates.deleteQuestions.includes(questionId) &&
				!updates.createQuestions.some((q) => q.get("questionId") === questionId)) {
				const questionWidget = questionWidgets.find(q => q.get("questionId") == questionId);
				if (questionWidget) {
					updates.updateQuestions.set(questionId, questionWidget);
				} else {
					console.log(`Unable to patch question with id [${questionId}]. No corresponding widget found.`);
				}
			}
		}

		// 5. Identify deleted options
		for (const questionId in storedQstMeta.options) {
			if (updates.deleteQuestions.includes(questionId)) continue; // Skip deleted questions

			for (const optionId in storedQstMeta.options[questionId]) {
				if (!optionWidgets.some((w) => w.get("answerOptionId") === optionId)) {
					updates.deleteOptions.push(optionId); // Only delete orphaned options
				}
			}
		}

		// 6. Identify new options per question
		const newOptionsByQuestion = new Map<string, Scrivito.Widget[]>();
		for (const questionWidget of questionWidgets) {
			const questionExternalId = questionWidget.get("externalId") as string;
			const options = questionWidget.get("options") as Scrivito.Widget[];

			if (!options || options.length === 0) continue;

			for (const optionWidget of options) {
				const optionId = optionWidget.get("answerOptionId") as string;

				if (!optionId) {
					if (!newOptionsByQuestion.has(questionExternalId)) {
						newOptionsByQuestion.set(questionExternalId, []);
					}
					newOptionsByQuestion.get(questionExternalId)?.push(optionWidget);
				}
			}
		}

		// 7. Identify updated options
		for (const questionId in storedQstMeta.options) {
			for (const optionId in storedQstMeta.options[questionId]) {
				if (!updates.deleteOptions.includes(optionId) &&
					!Array.from(updates.createOptions.values()).some((optionWidgets) =>
						optionWidgets.some((o) => o.get("answerOptionId") === optionId)
					)) {
					const optionWidget = optionWidgets.find(o => o.get("answerOptionId") == optionId);
					if (optionWidget) {
						updates.updateOptions.set(optionId, optionWidget);
					} else {
						console.log(`Unable to patch option with id [${optionId}]. No corresponding widget found.`);
					}
				}
			}
		}

		console.log(updates);

		// 1. Delete questions
		for (const questionId of updates.deleteQuestions) {
			const questionItem = await getQuestionItem(questionId);
			console.log("Deleting question:", questionId);
			if (questionItem) await questionItem.delete();
		}

		// 2. Delete options
		for (const optionId of updates.deleteOptions) {
			const optionItem = await getOptionItem(optionId);
			console.log("Deleting option:", optionId);
			if (optionItem) await optionItem.delete();
		}

		// 3. Create new questions and store their IDs
		const newQuestionIdMap = new Map<string, string>(); // externalId → questionId
		for (const widget of updates.createQuestions) {
			console.log("Creating question...");
			const question = convertWidgetToQuestion(widget);

			const questionItem = await QuestionDataClass().create({
				...question,
				questionnaireId: qstId,
			});

			const newQuestionId = questionItem.id();
			console.log("Created question:", newQuestionId);

			widget.update({ questionId: newQuestionId });
			updatedQstMeta.questions[newQuestionId] = question;
			newQuestionIdMap.set(widget.get("externalId") as string, newQuestionId);
		}

		// 4. Create new options
		for (const [questionExternalId, optionWidgets] of newOptionsByQuestion.entries()) {
			const parentQuestionWidget = questionWidgets.find(q => q.get("externalId") === questionExternalId);
			const questionId = newQuestionIdMap.get(questionExternalId) as string || parentQuestionWidget?.get("questionId") as string;

			if (!questionId) {
				console.error(`No valid questionId found for externalId: ${questionExternalId}`);
				continue;
			}

			for (const widget of optionWidgets) {
				console.log("Creating option for question:", questionId);
				const option = convertWidgetToAnswerOption(widget);
				const optionItem = await AnswerOptionDataClass().create({
					...option,
					questionId,
				});

				console.log("Created option:", optionItem.id());
				widget.update({ answerOptionId: optionItem.id() });
				if (!updatedQstMeta.options[questionId]) {
					updatedQstMeta.options[questionId] = {};
				}
				updatedQstMeta.options[questionId][optionItem.id()] = option;
			}
		}

		// 5. Update existing questions
		for (const [questionId, widget] of updates.updateQuestions) {
			const questionItem = await getQuestionItem(questionId);
			if (questionItem) {
				console.log("Updating question:", questionId);
				const question = convertWidgetToQuestion(widget);

				await questionItem.update({ ...question });
				updatedQstMeta.questions[questionId] = question;

			}
		}

		// 6. Update existing options
		for (const [optionId, widget] of updates.updateOptions) {
			const optionItem = await getOptionItem(optionId);
			if (optionItem) {
				console.log("Updating option:", optionId);
				const option = convertWidgetToAnswerOption(widget);
				await optionItem.update({ ...option });
				const questionId = optionItem.get("questionId") as string
				if (!updatedQstMeta.options[questionId]) {
					updatedQstMeta.options[questionId] = {};
				}
				updatedQstMeta.options[questionId][optionId] = option;
			}
		}
		widget.update({ creationData: JSON.stringify(updatedQstMeta) });
		setStatus("void");
		console.log("Update process completed.");
	};

	return (
		<div
			className={`questionnaire-creation-tab-container scrivito-${uiContext.theme}`}
		>
			<div className="detail-content">
				<div className="detail-content-inner">
					<Description status={status} isValid={isValid} />
					{!isCreated && <button
						className="btn btn-primary"
						disabled={!isValid || isCreating}
						onClick={handleCreateQuestionnaire}
					>
						Create
					</button>}
					{(isCreated && status == "pendingUpdate") &&
						<>
							<button
								className="btn btn-primary"
								onClick={updateQuestionnaire}
							>
								PUSH CHANGES TO PISASALES
							</button>
							<div className="notice-body note">

							</div>

						</>
					}
				</div>
			</div>
		</div>
	);
};

Scrivito.registerComponent(
	"QuestionnaireCreationTab",
	QuestionnaireCreationTab
);