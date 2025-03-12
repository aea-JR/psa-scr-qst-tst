import { provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";

export const QuestionDataClass = provideDataClass("Question", {
  restApi: clientConfig("question"),
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

