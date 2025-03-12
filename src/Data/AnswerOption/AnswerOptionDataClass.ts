import { provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";

export const AnswerOptionDataClass = provideDataClass("AnswerOption", {
  restApi: clientConfig("question-option"),
  attributes: {
    questionId: "string",
    text: "string",
    externalId: "string",
    position: "number",
    identifier: "string",
  },
});

