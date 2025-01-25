import { provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";

export const provideQuestionnaire = () => {
  return provideDataClass("Questionnaire", {
    restApi: clientConfig("questionnaire"),
    attributes: {
      title: "string",
      externalId: "string",
      inputType: "string",
      forms: "boolean"
    },
  });
};
