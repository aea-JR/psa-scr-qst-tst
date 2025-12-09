import { load } from "scrivito";
import { getQuestionnaireDataClass } from "./QuestionnaireDataClass";
import { isTokenAuthActive } from "../../utils/tokenValidation";

export const getQuestionnaireItem = (questionnaireId: string) => {
	return load(() => {
		if (isTokenAuthActive()) {
			const qst = getQuestionnaireDataClass()?.all().take().pop();
			return qst || null;
		} else
			return getQuestionnaireDataClass()?.get(questionnaireId) || null;
	});
}