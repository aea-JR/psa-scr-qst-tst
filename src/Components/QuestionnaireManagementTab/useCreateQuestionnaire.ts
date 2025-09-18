import { useState } from "react";
import * as Scrivito from "scrivito";

import { extractQuestionnaireMeta } from "../../utils/extractQuestionnaireMeta";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { QuestionnaireMetaSnapshot } from "../../types/questionnaire";
import { setQuestionnaireStatus } from "../../utils/questionnaireStatus";
import { EXTERNAL_ID } from "../../constants/constants";
import { getQuestionnaireDataClass } from "../../Data/Questionnaire/QuestionnaireDataClass";
import { getQuestionDataClass } from "../../Data/Question/QuestionDataClass";
import { getAnswerOptionDataClass } from "../../Data/AnswerOption/AnswerOptionDataClass";

export const useCreateQuestionnaire = (widget: Scrivito.Widget) => {
	const [isCreating, setIsCreating] = useState(false);

	const createQuestionnaire = async (): Promise<void> => {
		let hasFailures = false;
		const createdItems: QuestionnaireMetaSnapshot = {
			qstMeta: { title: "", inputType: "", origin: "", url: "" },
			questions: {},
			options: {},
		};

		try {
			const QuestionnaireDataClass = getQuestionnaireDataClass();
			const QuestionDataClass = getQuestionDataClass();
			const AnswerOptionDataClass = getAnswerOptionDataClass()
			setIsCreating(true);
			setQuestionnaireStatus("inCreation", widget);
			const { questions, answerOptions, questionWidgets, optionWidgets } =
				extractQuestionsAndOptions(widget);

			if (!questions.length) {
				console.warn("No questions found. Aborting questionnaire creation.");
				return;
			}

			console.log("Creating questionnaire...");
			const qstMeta = extractQuestionnaireMeta(widget);
			const qstDataItem = await QuestionnaireDataClass!.create(qstMeta);
			const qstId = qstDataItem.id();
			createdItems.qstMeta = qstMeta;

			for (const question of questions) {
				try {
					const questionItem = await QuestionDataClass!.create({
						...question,
						questionnaireId: qstId,
					});

					const questionId = questionItem.id();
					const questionWidget = questionWidgets.find(
						(w) => w.get(EXTERNAL_ID) === question.externalId
					);

					if (questionWidget) {
						questionWidget.update({ questionId });
						createdItems.questions[questionId] = question;
					}

					const options = answerOptions.get(question.externalId);
					if (options && options.length > 0) {
						for (const option of options) {
							try {
								const optionItem = await AnswerOptionDataClass!.create({
									...option,
									questionId,
								});

								const optionWidget = optionWidgets.find(
									(w) => w.get(EXTERNAL_ID) === option.externalId
								);

								if (optionWidget) {
									if (!createdItems.options[questionId]) {
										createdItems.options[questionId] = {};
									}
									createdItems.options[questionId][optionItem.id()] = option;
									optionWidget.update({ answerOptionId: optionItem.id() });
								}
							} catch (error) {
								hasFailures = true;
								console.error("Error creating option:", error);
							}
						}
					}
				} catch (error) {
					hasFailures = true;
					console.error("Error creating question:", error);
				}
			}

			await qstDataItem.update({ forms: true });
			widget.update({ questionnaireId: qstId, creationData: JSON.stringify(createdItems) });

		} catch (error) {
			console.error("Error creating questionnaire:", error);
		} finally {
			setIsCreating(false);
			setQuestionnaireStatus(hasFailures ? "pendingUpdate" : "void", widget);
			!hasFailures && console.log("Questionnaire created successfully.");
		}
	};

	return { createQuestionnaire, isCreating };
};