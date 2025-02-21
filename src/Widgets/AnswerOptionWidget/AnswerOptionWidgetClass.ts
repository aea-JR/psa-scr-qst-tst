import { provideWidgetClass } from "scrivito";

export const QuestionnaireAnswerOptionWidget = provideWidgetClass("QuestionnaireAnswerOptionWidget", {
  attributes: {
    text: "string",
    identifier: "string",
    externalId: "string",
    answerOptionId: "string",
    position: "integer",
    type: ["enum", { values: ["dropdown", "radio", "checkbox"] }],
    content: "widgetlist",
    isCondition: "boolean",
  },
  onlyInside: ["QuestionnaireSelectQuestionWidget"],
});
