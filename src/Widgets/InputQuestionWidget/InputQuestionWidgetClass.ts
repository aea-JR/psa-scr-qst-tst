import { provideWidgetClass } from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";

export const QuestionnaireInputQuestionWidget = provideWidgetClass("QuestionnaireInputQuestionWidget", {
  attributes: {
    ...defaultQuestionAttributes,
    placeholder: "string",
    type: ["enum", { values: ["string_single_line", "string_multi_line", "integer", "floating_point", "date", "date_time"] }],
  },
});
