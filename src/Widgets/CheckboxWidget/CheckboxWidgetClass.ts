import * as Scrivito from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";
import { LOGIC, LOGIC_TRISTATE, QUESTIONNNAIRE_CHECKBOX_QUESTION_WIDGET } from "../../constants/constants";
export const QuestionnaireCheckboxQuestionWidget = Scrivito.provideWidgetClass(
  QUESTIONNNAIRE_CHECKBOX_QUESTION_WIDGET,
  {
    attributes: {
      ...defaultQuestionAttributes,
      type: [
        "enum",
        {
          values: [LOGIC, LOGIC_TRISTATE]
        }
      ],
    }
  }
);
