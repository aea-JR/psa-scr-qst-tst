import { DataClass, provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";

let AnswersDataClassInternal: DataClass;

export const registerAnswersDataClass = async () => {
	const config = await clientConfig("questionnaire-answer", true);

	AnswersDataClassInternal = provideDataClass("QuestionnaireAnswer", {
		restApi: config,
		attributes: {
			_id: "string",
			questionId: "string",
			updatedAt: "date",
			questionnaireId: "string",
			number: "number",
		},
	});
};

export const getAnswersDataClass = () => {
	if (AnswersDataClassInternal) {
		return AnswersDataClassInternal;
	}
	return null;
};


