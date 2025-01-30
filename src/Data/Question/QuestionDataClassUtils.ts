import { load } from "scrivito";
import { QuestionDataClass } from "../../config/scrivitoConfig";

export const getQuestionItem = (questionId: string) => {
	return load(() => {
		return QuestionDataClass().get(questionId);
	})
}