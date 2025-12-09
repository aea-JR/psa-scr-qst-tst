import { provideWidgetClass } from "scrivito";
import { QUESTIONNNAIRE_ANSWER_OPTION_WIDGET, QUESTIONNNAIRE_SELECT_QUESTION_WIDGET } from "../../constants/constants";

export const QuestionnaireAnswerOptionWidget = provideWidgetClass(QUESTIONNNAIRE_ANSWER_OPTION_WIDGET, {
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
  onlyInside: [QUESTIONNNAIRE_SELECT_QUESTION_WIDGET],
});
