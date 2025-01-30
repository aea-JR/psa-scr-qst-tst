import { load } from "scrivito";
import { AnswerOptionDataClass } from "../../config/scrivitoConfig";

export const getOptionItem = (answerOptionId: string) => {
	return load(() => {
		return AnswerOptionDataClass().get(answerOptionId);
	})
}