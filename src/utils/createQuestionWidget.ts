import { Widget } from "scrivito";
import { Question } from "../types/questionnaire";
import { QuestionnaireInputQuestionWidget } from "../Widgets/InputQuestionWidget/InputQuestionWidgetClass";
import { QuestionnaireSelectQuestionWidget } from "../Widgets/SelectQuestionWidget/SelectQuestionWidgetClass";
import { DATE, DATE_TIME, FLOATING_POINT, INTEGER, STRING_DROPDOWN, STRING_MULTI_LINE, STRING_SINGLE_LINE } from "../constants/constants";

/**
 * NOT USED
 * INCOMPLETE
 * @param question 
 * @param questionId 
 * @returns 
 */
export const createNewQuestionWidget = (question: Question, questionId: string): Widget => {
	switch (question.type) {
		case STRING_SINGLE_LINE:
		case STRING_MULTI_LINE:
		case INTEGER:
		case FLOATING_POINT:
		case DATE:
		case DATE_TIME:
			return new QuestionnaireInputQuestionWidget({ ...question, questionId: questionId });
		case STRING_DROPDOWN:
			return new QuestionnaireSelectQuestionWidget({ ...question, questionId: questionId, options: [] });
		default:
			throw "Unable to create new question widget. Invalid type!";
	}
}