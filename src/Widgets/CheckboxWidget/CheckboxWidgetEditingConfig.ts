import * as Scrivito from "scrivito";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { ALIGNMENT, DEFAULT_VALUE, EXTERNAL_ID, IS_BEING_COPIED, LOGIC, LOGIC_TRISTATE, QUESTION_ID, QUESTIONNNAIRE_CHECKBOX_QUESTION_WIDGET, TYPE, VALIDATION_TEXT } from "../../constants/constants";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import checkboxThumbnail from "../../assets/images/crm-questionnaire-checkbox.svg";
import { insideQuestionnaireContainerValidation } from "../../utils/validations/insideQuestionnaireContainerValidation";

Scrivito.provideEditingConfig(QUESTIONNNAIRE_CHECKBOX_QUESTION_WIDGET, {

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
  title: "Questionnaire Checkbox Question",

  attributes: {
    ...defaultAttributes,
    type: {
      title: "Input Type",
      values: [
        { value: LOGIC, title: "Default" },
        { value: LOGIC_TRISTATE, title: "Tri-State" }
      ],
    },
    alignment: { title: "Alignment" },
  },
  properties: (widget: Scrivito.Widget) =>
    [...defaultProperties,
      TYPE,
      ALIGNMENT,
      VALIDATION_TEXT,
    [EXTERNAL_ID, { enabled: false }],
    [QUESTION_ID, { enabled: false }]],

  initialContent: {
    ...defaultInitialContent,
    type: LOGIC,
    validationText: "Please tick the box",
  },
  validations: [
    ...defaultValidations,
    insideQuestionnaireContainerValidation,
    [
      DEFAULT_VALUE,
      (defaultValue: string, { widget }: { widget: Scrivito.Widget }) => {
        const type = widget.get(TYPE);
        if (!defaultValue) {
          return null;
        }
        const validValues = type === LOGIC_TRISTATE
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
