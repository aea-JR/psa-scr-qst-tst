import { load } from "scrivito";
import { getAnswerOptionDataClass } from "./AnswerOptionDataClass";

export const getOptionItem = (answerOptionId: string) => {
	return load(() => {
		return getAnswerOptionDataClass().get(answerOptionId);
	});
}