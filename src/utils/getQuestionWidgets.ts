import { filter } from "lodash-es";
import { Widget } from "scrivito";

export const getQuestionWidgets = (qstMainWidget: Widget): Widget[] => {
	const allWidgets = qstMainWidget.widgets();
	const questions = filter(
		allWidgets,
		(c) =>
			c.objClass() == "InputQuestionWidget" ||
			c.objClass() == "SelectQuestionWidget" ||
			c.objClass() == "PisaQuestionnaireCheckboxWidget"
	);
	return questions;
}