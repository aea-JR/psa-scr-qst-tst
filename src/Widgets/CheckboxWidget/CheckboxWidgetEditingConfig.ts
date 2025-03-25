import * as Scrivito from "scrivito";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { DEFAULT_VALUE, EXTERNAL_ID, IS_BEING_COPIED, QUESTION_ID, TYPE } from "../../constants/constants";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import checkboxThumbnail from "../../assets/images/crm-questionnaire-checkbox.svg";

Scrivito.provideEditingConfig("QuestionnaireCheckboxQuestionWidget", {

  initialize: (obj) => {
    if (!obj.get(EXTERNAL_ID)) {
      const id = generateId();
      obj.update({ externalId: id });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);

    // Skip updating externalId if the parent container is marked as being copied
    if (parent && parent.get(IS_BEING_COPIED)) {
      return;
    }
    const id = generateId();
    child.update({ externalId: id, questionId: null });
  },

  thumbnail: checkboxThumbnail,
  title: "PisaSales Checkbox Question",

  attributes: {
    ...defaultAttributes,
    type: {
      title: "Input Type",
      values: [
        { value: "logic", title: "Default" },
        { value: "logic_tristate", title: "Tri-State" }
      ]
    },
  },
  properties: (widget: Scrivito.Widget) =>
    [...defaultProperties,
      TYPE,
    [EXTERNAL_ID, { enabled: false }],
    [QUESTION_ID, { enabled: false }]],

  initialContent: {
    ...defaultInitialContent,
    type: "logic",
  },
  validations: [
    ...defaultValidations,
    [
      DEFAULT_VALUE,
      (defaultValue: string, { widget }: { widget: Scrivito.Widget }) => {
        const type = widget.get(TYPE);
        if (!defaultValue) {
          return null;
        }
        const validValues = type === "logic_tristate"
          ? ["true", "false", "unset"]
          : ["true", "false"];

        if (!validValues.includes(defaultValue)) {
          return `Specify a valid default value. Allowed values: ${validValues.join(", ")}`;
        }
        return null;;
      },
    ]

  ]
});
