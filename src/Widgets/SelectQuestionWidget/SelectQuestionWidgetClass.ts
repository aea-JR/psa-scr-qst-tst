import { provideWidgetClass } from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";

export const QuestionnaireSelectQuestionWidget = provideWidgetClass(
  "QuestionnaireSelectQuestionWidget",
  {
    attributes: {
      ...defaultQuestionAttributes,
      type: ["enum", { values: ["string_dropdown", "string_radio", "string_checkboxes"] }],
      options: ["widgetlist", { only: ["QuestionnaireAnswerOptionWidget"] }],
      enableConditionals: "boolean",
      clearSelectionButtonText: "string",
      showClearSelectionButton: "boolean",
      inlineView: "boolean",
    },
  },
);
