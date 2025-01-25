import { provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";

export const provideAnswers = () => {
	return provideDataClass("QuestionnaireAnswer", {
		restApi: clientConfig("questionnaire-answer"),
		attributes: {
			_id: "string",
			//	value: "Array",
			// valueIdentifier: "Array",
			questionId: "string",
			updatedAt: "date",
			questionnaireId: "string",
			number: "number",

		},
	});
};