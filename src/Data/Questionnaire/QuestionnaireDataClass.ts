import { DataClass, load, provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";

let QuestionnaireDataClassInternal: DataClass;

export const registerQuestionnaireDataClass = async () => {
  const config = await clientConfig("questionnaire");

  QuestionnaireDataClassInternal = provideDataClass("Questionnaire", {
    restApi: config,
    attributes: {
      title: "string",
      externalId: "string",
      inputType: "string",
      forms: "boolean"
    },
  });
};

export const getQuestionnaireDataClass = () => {

  if (!QuestionnaireDataClassInternal) {
    throw new Error("QuestionnaireDataClass not initialized yet.");
  }
  return QuestionnaireDataClassInternal;


};
