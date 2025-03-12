import { load } from "scrivito";
import { AnswerOptionDataClass } from "./AnswerOptionDataClass";

export const getOptionItem = (answerOptionId: string) => {
	return load(() => {
		return AnswerOptionDataClass.get(answerOptionId);
	});
}