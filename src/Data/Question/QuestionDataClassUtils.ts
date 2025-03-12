import { load } from "scrivito";
import { QuestionDataClass } from "./QuestionDataClass";

export const getQuestionItem = (questionId: string) => {
	return load(() => {
		return QuestionDataClass.get(questionId);
	});
}