import { load } from "scrivito";
import { getQuestionnaireDataClass } from "./QuestionnaireDataClass";

export const getQuestionnaireItem = (questionnaireId: string) => {
	return load(() => {
		return getQuestionnaireDataClass()?.get(questionnaireId) || null;
	});
}