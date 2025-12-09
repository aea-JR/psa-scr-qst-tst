import { Widget } from "scrivito";
import { QUESTIONNNAIRE_CHECKBOX_QUESTION_WIDGET, QUESTIONNNAIRE_FILE_QUESTION_WIDGET, QUESTIONNNAIRE_INPUT_QUESTION_WIDGET, QUESTIONNNAIRE_SELECT_QUESTION_WIDGET } from "../constants/constants";

export const getQuestionWidgets = (qstMainWidget: Widget): Widget[] => {
	const allWidgets = qstMainWidget.widgets();
	const questions = allWidgets.filter(
		(c) =>
			c.objClass() == QUESTIONNNAIRE_INPUT_QUESTION_WIDGET ||
			c.objClass() == QUESTIONNNAIRE_SELECT_QUESTION_WIDGET ||
			c.objClass() == QUESTIONNNAIRE_CHECKBOX_QUESTION_WIDGET ||
			c.objClass() == QUESTIONNNAIRE_FILE_QUESTION_WIDGET
	);
	return questions;
}
