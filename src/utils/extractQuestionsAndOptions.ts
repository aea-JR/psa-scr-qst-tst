import { isEmpty, filter } from "lodash-es";
import { Widget } from "scrivito";
import { Question, AnswerOption } from "../types/questionnaire";
import { convertWidgetsToAnswerOptions } from "./convertoAnswerOptions";
import { convertWidgetToQuestion } from "./convertoQuestion";

export const extractQuestionsAndOptions = (widget: Widget) => {
	const questionsAndOptions: { questions: Question[], answerOptions: Map<string, AnswerOption[]>, questionWidgets: Widget[], optionWidgets: Widget[] } = {
		questions: [],
		answerOptions: new Map(),
		questionWidgets: [],
		optionWidgets: []
	}
	const allWidgets = widget.widgets();
	if (isEmpty(allWidgets)) {
		return questionsAndOptions;
	}

	//TODO: improve
	const questionWidgets = filter(
		allWidgets,
		(c) =>
			c.objClass() == "InputQuestionWidget" ||
			c.objClass() == "SelectQuestionWidget",
	);
	if (isEmpty(questionWidgets)) {
		return questionsAndOptions;
	}

	for (const questionWidget of questionWidgets) {

		const question = convertWidgetToQuestion(questionWidget);
		questionsAndOptions.questions.push(question);

		if (questionWidget.objClass() == "SelectQuestionWidget") {
			const optionWidgets = questionWidget.get("options") as Widget[];
			const options = convertWidgetsToAnswerOptions(optionWidgets)
			if (!isEmpty(options)) {
				questionsAndOptions.answerOptions.set(question.externalId, options)
			}
			questionsAndOptions.optionWidgets.push(...optionWidgets);
		}

	}
	return { ...questionsAndOptions, questionWidgets };

}