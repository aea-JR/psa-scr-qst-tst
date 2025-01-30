import { load } from "scrivito";
import { QuestionnaireDataClass } from "../../config/scrivitoConfig";

export const getQuestionnaireItem = (questionnaireId: string) => {
	return load(() => {
		return QuestionnaireDataClass().get(questionnaireId);
	})
}