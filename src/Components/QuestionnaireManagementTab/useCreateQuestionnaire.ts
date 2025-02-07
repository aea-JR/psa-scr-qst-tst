import { useState } from "react";
import * as Scrivito from "scrivito";
import {
	QuestionnaireDataClass,
	QuestionDataClass,
	AnswerOptionDataClass,
} from "../../config/scrivitoConfig";
import { extractQuestionnaireMeta } from "../../utils/extractQuestionnaireMeta";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { QuestionnaireMetaSnapshot } from "../../types/questionnaire";

export const useCreateQuestionnaire = (widget: Scrivito.Widget) => {
	const [isCreating, setIsCreating] = useState(false);

	const createQuestionnaire = async (): Promise<boolean> => {
		const createdItems: QuestionnaireMetaSnapshot = {
			qstMeta: { title: "", inputType: "" },
			questions: {},
			options: {},
		};

		try {
			setIsCreating(true);

			const { questions, answerOptions, questionWidgets, optionWidgets } =
				extractQuestionsAndOptions(widget);

			if (!questions.length) {
				console.warn("No questions found. Aborting questionnaire creation.");
				return false;
			}

			console.log("Creating questionnaire...");
			const qstMeta = extractQuestionnaireMeta(widget);
			const qstDataItem = await QuestionnaireDataClass().create(qstMeta);
			const qstId = qstDataItem.id();
			createdItems.qstMeta = qstMeta;

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
									if (!createdItems.options[questionId]) {
										createdItems.options[questionId] = {};
									}
									createdItems.options[questionId][optionItem.id()] = option;
									optionWidget.update({ answerOptionId: optionItem.id() });
								}
							} catch (error) {
								console.error("Error creating option:", error);
							}
						}
					}
				} catch (error) {
					console.error("Error creating question:", error);
				}
			}

			await qstDataItem.update({ forms: true });
			widget.update({ questionnaireId: qstId, creationData: JSON.stringify(createdItems) });

		} catch (error) {
			console.error("Error creating questionnaire:", error);
			return false;
		} finally {
			setIsCreating(false);
			return true;
		}
	};

	return { createQuestionnaire, isCreating };
};