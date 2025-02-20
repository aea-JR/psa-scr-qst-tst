import * as Scrivito from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";
export const PisaQuestionnaireCheckboxWidget = Scrivito.provideWidgetClass(
  "PisaQuestionnaireCheckboxWidget",
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
