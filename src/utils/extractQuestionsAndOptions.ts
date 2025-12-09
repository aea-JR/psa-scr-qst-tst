import { Widget } from "scrivito";
import { isEmpty } from "./lodashPolyfills";
import { Question, AnswerOption } from "../types/questionnaire";
import { convertWidgetsToAnswerOptions } from "./convertoAnswerOptions";
import { convertWidgetToQuestion } from "./convertoQuestion";
import { OPTIONS, QUESTIONNNAIRE_SELECT_QUESTION_WIDGET } from "../constants/constants";
import { getQuestionWidgets } from "./getQuestionWidgets";

export const extractQuestionsAndOptions = (widget: Widget) => {
	const questionsAndOptions: { questions: Question[], answerOptions: Map<string, AnswerOption[]>, questionWidgets: Widget[], optionWidgets: Widget[] } = {
		questions: [],
		answerOptions: new Map(),
		questionWidgets: [],
		optionWidgets: []
	}

	const questionWidgets = getQuestionWidgets(widget);
	if (isEmpty(questionWidgets)) {
		return questionsAndOptions;
	}

	for (const questionWidget of questionWidgets) {

		const question = convertWidgetToQuestion(questionWidget);
		questionsAndOptions.questions.push(question);

		if (questionWidget.objClass() == QUESTIONNNAIRE_SELECT_QUESTION_WIDGET) {
			const optionWidgets = questionWidget.get(OPTIONS) as Widget[];
			const options = convertWidgetsToAnswerOptions(optionWidgets)
			if (!isEmpty(options)) {
				questionsAndOptions.answerOptions.set(question.externalId, options)
			}
			questionsAndOptions.optionWidgets.push(...optionWidgets);
		}

	}
	return { ...questionsAndOptions, questionWidgets };

}