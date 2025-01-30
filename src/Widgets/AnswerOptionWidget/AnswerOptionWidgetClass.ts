import { provideWidgetClass } from "scrivito";

export const AnswerOptionWidget = provideWidgetClass("AnswerOptionWidget", {
  attributes: {
    text: "string",
    identifier: "string",
    externalId: "string",
    answerOptionId: "string",
    position: "integer",
    type: ["enum", { values: ["dropdown", "radio", "checkbox"] }],
  },
  onlyInside: ["DropdownQuestionWidget"],
});
