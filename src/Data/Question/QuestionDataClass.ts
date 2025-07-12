import { DataClass, provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";


let QuestionDataClassInternal: DataClass;

export const registerQuestionDataClass = async () => {
  const config = await clientConfig("question");

  QuestionDataClassInternal = provideDataClass("Question", {
    restApi: config,
    attributes: {
      questionnaireId: "string",
      externalId: "string",
      type: "string",
      help: "string",
      position: "number",
      identifier: "string",
      defaultValue: "string",
      mandatory: "boolean",
      text: "string",
    },
  });
};

export const getQuestionDataClass = () => {
  if (!QuestionDataClassInternal) {
    throw new Error("QuestionDataClass not initialized yet.");
  }
  return QuestionDataClassInternal;
};
