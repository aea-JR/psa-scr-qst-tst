import { isInPlaceEditingActive, Widget } from "scrivito";
import { QuestionnaireStatus } from "../types/questionnaire";

let _questionnaireStatus: QuestionnaireStatus = "void";

export const getQuestionnaireStatus = (qstMainWidget?: Widget) => {
	if (isInPlaceEditingActive() && qstMainWidget) {
		return qstMainWidget.get("questionnaireStatus") as QuestionnaireStatus || "void";
	}
	return _questionnaireStatus;
}

export const setQuestionnaireStatus = (status: QuestionnaireStatus, qstMainWidget?: Widget) => {
	if (isInPlaceEditingActive() && qstMainWidget) {
		qstMainWidget.update({ questionnaireStatus: status });
	}
	_questionnaireStatus = status;
};
