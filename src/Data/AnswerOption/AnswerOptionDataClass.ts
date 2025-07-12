import { DataClass, provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";

let AnswerOptionDataClassInternal: DataClass;

export const registerAnswerOptionDataClass = async () => {
  const config = await clientConfig("question-option");

  AnswerOptionDataClassInternal = provideDataClass("AnswerOption", {
    restApi: config,
    attributes: {
      questionId: "string",
      text: "string",
      externalId: "string",
      position: "number",
      identifier: "string",
    },
  });
};

export const getAnswerOptionDataClass = () => {
  if (!AnswerOptionDataClassInternal) {
    throw new Error("AnswersDataClass not initialized yet.");
  }
  return AnswerOptionDataClassInternal;
};

