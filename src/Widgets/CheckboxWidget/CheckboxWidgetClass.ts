import * as Scrivito from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";
export const QuestionnaireCheckboxQuestionWidget = Scrivito.provideWidgetClass(
  "QuestionnaireCheckboxQuestionWidget",
  {
    attributes: {
      ...defaultQuestionAttributes,
      type: [
        "enum",
        {
          values: ["logic", "logic_tristate"]
        }
      ],
    }
  }
);
