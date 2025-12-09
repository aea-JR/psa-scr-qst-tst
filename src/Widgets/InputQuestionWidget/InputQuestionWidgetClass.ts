import { provideWidgetClass } from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";
import { DATE, DATE_TIME, FLOATING_POINT, INTEGER, QUESTIONNNAIRE_INPUT_QUESTION_WIDGET, STRING_MULTI_LINE, STRING_SINGLE_LINE } from "../../constants/constants";

export const QuestionnaireInputQuestionWidget = provideWidgetClass(QUESTIONNNAIRE_INPUT_QUESTION_WIDGET, {
  attributes: {
    ...defaultQuestionAttributes,
    placeholder: "string",
    type: ["enum", { values: [STRING_SINGLE_LINE, STRING_MULTI_LINE, INTEGER, FLOATING_POINT, DATE, DATE_TIME] }],
  },
});
