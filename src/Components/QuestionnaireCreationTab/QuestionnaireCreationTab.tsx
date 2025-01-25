import * as React from "react";
import * as Scrivito from "scrivito";
import "./QuestionnaireCreationTab.scss";
import { isQuestionnaireCreationValid } from "../../utils/isQuestionnaireCreationValid";
import {
	AnswerOptionDataClass,
	QuestionDataClass,
	QuestionnaireDataClass
} from "../../config/scrivitoConfig";
import { isEmpty } from "lodash-es";
import { Description } from "../QuestionnaireCreationDescription/QuestionnaireCreationDescription";
import { extractQuestionnaireMeta } from "../../utils/extractQuestionnaireMeta";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";

interface QuestionnaireCreationTabProps {
	widget: Scrivito.Widget;
}

export const QuestionnaireCreationTab: React.FC<
	QuestionnaireCreationTabProps
> = ({ widget }) => {
	const [isCreating, setIsCreating] = React.useState(false);
	const [failedItems, setFailedItems] = React.useState<any[]>([]);
	const uiContext = Scrivito.uiContext();


	if (!uiContext) return null;

	const isValid = isQuestionnaireCreationValid(widget);
	//TODO: test, improve & use
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
		try {
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
			const qst = await QuestionnaireDataClass().create(
				extractQuestionnaireMeta(widget)
			);
			const qstId = qst.id();

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
			await qst.update({ forms: true });
			widget.update({ questionnaireId: qstId });
		} catch (error) {
			console.error("Error creating questionnaire:", error);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div
			className={`questionnaire-creation-tab-container scrivito-${uiContext.theme}`}
		>
			<div className="detail-content">
				<div className="detail-content-inner">
					<button
						className="btn btn-primary"
						disabled={!isValid || isCreating}
						onClick={handleCreateQuestionnaire}
					>
						Create
					</button>
					{/* <button
						className="btn btn-secondary"
						disabled={failedItems.length === 0 || isCreating}
						onClick={handleRetryFailedItems}
					>
						Retry Failed Items
					</button> */}
					<Description isCreating={isCreating} isValid={isValid} />
				</div>
			</div>
		</div>
	);
};

Scrivito.registerComponent(
	"QuestionnaireCreationTab",
	QuestionnaireCreationTab
);