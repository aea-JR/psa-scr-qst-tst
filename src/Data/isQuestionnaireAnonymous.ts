import { getQuestionnaireItem } from "./Questionnaire/QuestionnaireDataClassUtils";
import { ANONYMOUS } from "../constants/constants";

export const isQuestionnaireAnonymous = async (questionnaireId: string) => {
	const qst = await getQuestionnaireItem(questionnaireId)
	return qst?.get(ANONYMOUS) as boolean || false;
}