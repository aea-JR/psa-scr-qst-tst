import { provideWidgetClass } from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";

export const SelectQuestionWidget = provideWidgetClass(
  "SelectQuestionWidget",
  {
    attributes: {
      ...defaultQuestionAttributes,
      type: ["enum", { values: ["string_dropdown", "string_radio", "string_checkboxes"] }],
      options: ["widgetlist", { only: ["AnswerOptionWidget"] }],
      enableConditionals: "boolean",
    },
  },
);
