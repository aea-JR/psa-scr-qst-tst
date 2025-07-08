import { Widget } from "scrivito";

export const getQuestionWidgets = (qstMainWidget: Widget): Widget[] => {
	const allWidgets = qstMainWidget.widgets();
	const questions = allWidgets.filter(
		(c) =>
			c.objClass() == "QuestionnaireInputQuestionWidget" ||
			c.objClass() == "QuestionnaireSelectQuestionWidget" ||
			c.objClass() == "QuestionnaireCheckboxQuestionWidget"
	);
	return questions;
}