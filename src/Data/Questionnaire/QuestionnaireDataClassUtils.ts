import { load } from "scrivito";
import { QuestionnaireDataClass } from "./QuestionnaireDataClass";

export const getQuestionnaireItem = (questionnaireId: string) => {
	return load(() => {
		return QuestionnaireDataClass.get(questionnaireId);
	});
}