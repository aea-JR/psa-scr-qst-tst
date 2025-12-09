import { provideWidgetClass } from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";
import { QUESTIONNNAIRE_ANSWER_OPTION_WIDGET, QUESTIONNNAIRE_SELECT_QUESTION_WIDGET, STRING_CHECKBOXES, STRING_DROPDOWN, STRING_RADIO } from "../../constants/constants";

export const QuestionnaireSelectQuestionWidget = provideWidgetClass(
  QUESTIONNNAIRE_SELECT_QUESTION_WIDGET,
  {
    attributes: {
      ...defaultQuestionAttributes,
      type: ["enum", { values: [STRING_DROPDOWN, STRING_RADIO, STRING_CHECKBOXES] }],
      options: ["widgetlist", { only: [QUESTIONNNAIRE_ANSWER_OPTION_WIDGET] }],
      enableConditionals: "boolean",
      clearSelectionButtonText: "string",
      showClearSelectionButton: "boolean",
      inlineView: "boolean",
    },
  },
);
