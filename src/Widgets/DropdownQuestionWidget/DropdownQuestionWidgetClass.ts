import { provideWidgetClass } from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";

export const DropdownQuestionWidget = provideWidgetClass(
  "DropdownQuestionWidget",
  {
    attributes: {
      ...defaultQuestionAttributes,
      emptyOption: "boolean",
      type: ["enum", { values: ["string_dropdown"] }],
      options: ["widgetlist", { only: ["AnswerOptionWidget"] }],
      //options2: ["referencelist", { only: ["AnswerOption"] }]

    },
  },
);
