import { useState } from "react";
import { Widget } from "scrivito";
import {
	QuestionDataClass,
	AnswerOptionDataClass,
} from "../../config/scrivitoConfig";
import { extractQuestionnaireMeta } from "../../utils/extractQuestionnaireMeta";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { QuestionnaireMetaSnapshot } from "../../types/questionnaire";
import { convertWidgetToQuestion } from "../../utils/convertoQuestion";
import { convertWidgetToAnswerOption } from "../../utils/convertoAnswerOptions";
import { getQuestionnaireItem } from "../../Data/Questionnaire/QuestionnaireDataClassUtils";
import { getQuestionItem } from "../../Data/Question/QuestionDataClassUtils";
import { getOptionItem } from "../../Data/AnswerOption/AnswerOptionDataClassUtils";

export const useUpdateQuestionnaire = (widget: Widget) => {
	const [isUpdating, setIsUpdating] = useState(false);

	const updateQuestionnaire = async (): Promise<boolean> => {
		const updates = {
			deleteQuestions: [] as string[],
			deleteOptions: [] as string[],
			createQuestions: [] as Widget[],
			createOptions: new Map<string, Widget[]>(), // questionExternalId → optionWidgets[]
			updateQuestions: new Map<string, Widget>(), // questionId → widget
			updateOptions: new Map<string, Widget>(),   // optionId → widget
		};

		const updatedQstMeta: QuestionnaireMetaSnapshot = {
			options: {},
			qstMeta: { title: "", inputType: "" },
			questions: {},
		};

		try {
			setIsUpdating(true);

			const qstId = widget.get("questionnaireId") as string;
			if (!qstId) throw new Error("Unable to update. Questionnaire ID not found.");

			const storedQstMetaJson = widget.get("creationData") as string;
			if (!storedQstMetaJson) throw new Error("Unable to update. No stored metadata found.");

			const storedQstMeta: QuestionnaireMetaSnapshot = JSON.parse(storedQstMetaJson);
			const { questionWidgets, optionWidgets } = extractQuestionsAndOptions(widget);
			// 1. Update questionnaire metadata
			const qstItem = await getQuestionnaireItem(qstId);
			if (qstItem) {
				await qstItem.update(extractQuestionnaireMeta(widget));
				updatedQstMeta.qstMeta = extractQuestionnaireMeta(widget);
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
				if (!questionId) updates.createQuestions.push(widget);
			}

			// 4. Identify updated questions
			for (const questionId in storedQstMeta.questions) {
				if (!updates.deleteQuestions.includes(questionId) &&
					!updates.createQuestions.some((q) => q.get("questionId") === questionId)) {
					const questionWidget = questionWidgets.find((q) => q.get("questionId") === questionId);
					if (questionWidget) updates.updateQuestions.set(questionId, questionWidget);
				}
			}

			// 5. Identify deleted options
			for (const questionId in storedQstMeta.options) {
				if (updates.deleteQuestions.includes(questionId)) continue;
				for (const optionId in storedQstMeta.options[questionId]) {
					if (!optionWidgets.some((w) => w.get("answerOptionId") === optionId)) {
						updates.deleteOptions.push(optionId);
					}
				}
			}

			// 6. Identify new options per question
			const newOptionsByQuestion = new Map<string, Widget[]>();
			for (const questionWidget of questionWidgets) {
				const questionExternalId = questionWidget.get("externalId") as string;
				const options = questionWidget.get("options") as Widget[];
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
						const optionWidget = optionWidgets.find((o) => o.get("answerOptionId") === optionId);
						if (optionWidget) updates.updateOptions.set(optionId, optionWidget);
					}
				}
			}

			// 1. Delete questions
			for (const questionId of updates.deleteQuestions) {
				try {
					const questionItem = await getQuestionItem(questionId);
					if (questionItem) await questionItem.delete();
				} catch (error) {
					console.error(`Failed to delete question ${questionId}:`, error);
				}
			}

			// 2. Delete options
			for (const optionId of updates.deleteOptions) {
				try {
					const optionItem = await getOptionItem(optionId);
					if (optionItem) await optionItem.delete();
				} catch (error) {
					console.error(`Failed to delete option ${optionId}:`, error);
				}
			}

			// 3. Create new questions and store their IDs
			const newQuestionIdMap = new Map<string, string>();
			for (const widget of updates.createQuestions) {
				try {
					const question = convertWidgetToQuestion(widget);
					const questionItem = await QuestionDataClass().create({
						...question,
						questionnaireId: qstId,
					});

					const newQuestionId = questionItem.id();
					widget.update({ questionId: newQuestionId });
					updatedQstMeta.questions[newQuestionId] = question;
					newQuestionIdMap.set(widget.get("externalId") as string, newQuestionId);
				} catch (error) {
					console.error("Failed to create question:", error);
				}
			}
			// 4. Create new options
			for (const [questionExternalId, optionWidgets] of newOptionsByQuestion.entries()) {
				const parentQuestionWidget = questionWidgets.find((q) => q.get("externalId") === questionExternalId);
				const questionId = newQuestionIdMap.get(questionExternalId) as string || parentQuestionWidget?.get("questionId") as string;

				if (!questionId) {
					console.error(`No valid questionId found for externalId: ${questionExternalId}`);
					continue;
				}

				for (const widget of optionWidgets) {
					try {
						const option = convertWidgetToAnswerOption(widget);
						const optionItem = await AnswerOptionDataClass().create({
							...option,
							questionId,
						});

						widget.update({ answerOptionId: optionItem.id() });
						if (!updatedQstMeta.options[questionId]) {
							updatedQstMeta.options[questionId] = {};
						}
						updatedQstMeta.options[questionId][optionItem.id()] = option;
					} catch (error) {
						console.error("Failed to create option:", error);
					}
				}
			}

			// 5. Update existing questions
			for (const [questionId, widget] of updates.updateQuestions) {
				try {
					const questionItem = await getQuestionItem(questionId);
					if (questionItem) {
						console.log("Updating question:", questionId);
						const question = convertWidgetToQuestion(widget);

						await questionItem.update({ ...question });
						updatedQstMeta.questions[questionId] = question;
					}
				} catch (error) {
					console.error(`Failed to update question ${questionId}:`, error);
				}
			}

			// 6. Update existing options
			for (const [optionId, widget] of updates.updateOptions) {
				try {
					const optionItem = await getOptionItem(optionId);
					if (optionItem) {
						console.log("Updating option:", optionId);
						const option = convertWidgetToAnswerOption(widget);
						await optionItem.update({ ...option });

						const questionId = optionItem.get("questionId") as string;
						if (!updatedQstMeta.options[questionId]) {
							updatedQstMeta.options[questionId] = {};
						}
						updatedQstMeta.options[questionId][optionId] = option;
					}
				} catch (error) {
					console.error(`Failed to update option ${optionId}:`, error);
				}
			}

			widget.update({ creationData: JSON.stringify(updatedQstMeta) });
		} catch (error) {
			console.error("Error updating questionnaire:", error);
			return false;
		} finally {
			setIsUpdating(false);
			return true;
		}
	};

	return { updateQuestionnaire, isUpdating };
};