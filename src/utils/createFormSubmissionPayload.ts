import { Answer, AnswerContext } from "../types/questionnaire";


type AnswersMap = Map<string, Answer>;
//TODO improve and use
export const createFormSubmissionPayload = (context: AnswerContext, answers: AnswersMap) => {
	const { activityId, contactId, projectId } = context;

	const payload = {
		keys: {
			activityId,
			contactId,
			projectId,
		},
		data: Array.from(answers.entries()).map(([questionId, { value, valueIdentifier, updatedAt }]) => ({
			questionId,
			updatedAt,
			value,
			valueIdentifier,
		})),
	};

	return payload;
};