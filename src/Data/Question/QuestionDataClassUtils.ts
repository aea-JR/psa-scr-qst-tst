import { load } from "scrivito";
import { getQuestionDataClass } from "./QuestionDataClass";

export const getQuestionItem = (questionId: string) => {
	return load(() => {
		return getQuestionDataClass()?.get(questionId) || null;
	});
}