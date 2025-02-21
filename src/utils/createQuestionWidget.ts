import { Widget } from "scrivito";
import { Question } from "../types/questionnaire";
import { QuestionnaireInputQuestionWidget } from "../Widgets/InputQuestionWidget/InputQuestionWidgetClass";
import { QuestionnaireSelectQuestionWidget } from "../Widgets/SelectQuestionWidget/SelectQuestionWidgetClass";

/**
 * NOT USED
 * INCOMPLETE
 * @param question 
 * @param questionId 
 * @returns 
 */
export const createNewQuestionWidget = (question: Question, questionId: string): Widget => {
	switch (question.type) {
		case "string_single_line":
		case "string_multi_line":
		case "integer":
		case "floating_point":
		case "date":
		case "date_time":
			return new QuestionnaireInputQuestionWidget({ ...question, questionId: questionId });
		case "string_dropdown":
			return new QuestionnaireSelectQuestionWidget({ ...question, questionId: questionId, options: [] });
		default:
			throw "Unable to create new question widget. Invalid type!";
	}
}