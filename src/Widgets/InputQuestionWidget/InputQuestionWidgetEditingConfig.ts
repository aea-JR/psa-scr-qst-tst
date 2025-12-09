import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { isPisaDate } from "../../utils/isPisaDate";
import { isUTCDate } from "../../utils/isUTCDate";
import { ALIGNMENT, DATE, DATE_TIME, DEFAULT_VALUE, EXTERNAL_ID, FLOATING_POINT, INTEGER, IS_BEING_COPIED, PLACEHOLDER, QUESTION_ID, QUESTIONNNAIRE_INPUT_QUESTION_WIDGET, STRING_MULTI_LINE, STRING_SINGLE_LINE, TYPE, VALIDATION_TEXT } from "../../constants/constants";
import inputThumbnail from "../../assets/images/crm-questionnaire-input.svg";
import { insideQuestionnaireContainerValidation } from "../../utils/validations/insideQuestionnaireContainerValidation";

Scrivito.provideEditingConfig(QUESTIONNNAIRE_INPUT_QUESTION_WIDGET, {
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
  thumbnail: inputThumbnail,
  title: "Questionnaire Input Field Question",
  attributes: {
    ...defaultAttributes,
    externalId: { title: "External ID" },
    questionId: { title: "Question ID (GID)" },
    placeholder: { title: "Placeholder" },
    type: {
      title: "Input type",
      values: [
        { value: STRING_SINGLE_LINE, title: "Single-line (String)" },
        { value: STRING_MULTI_LINE, title: "Multi-line (String)" },
        { value: INTEGER, title: "Integer (Number)" },
        { value: FLOATING_POINT, title: "Float (Number)" },
        { value: DATE, title: "Date only (Date)" },
        { value: DATE_TIME, title: "Date & Time (Date)" },
      ],
    },
    alignment: { title: "Alignment" },
  },
  initialContent: {
    ...defaultInitialContent,
    type: STRING_SINGLE_LINE,
    validationText: "Please fill out this field",
  },
  properties: (widget) => {
    return [
      ...defaultProperties,
      PLACEHOLDER,
      TYPE,
      ALIGNMENT,
      VALIDATION_TEXT,
      [EXTERNAL_ID, { enabled: false }],
      [QUESTION_ID, { enabled: false }],
    ];
  },
  validations: [
    ...defaultValidations,
    insideQuestionnaireContainerValidation,
    [
      DEFAULT_VALUE,
      (defaultValue: string, { widget }: { widget: Scrivito.Widget }) => {
        const type = widget.get(TYPE)
        if (!defaultValue) {
          return null;
        }
        if (type == DATE || type == DATE_TIME) {
          if (isPisaDate(defaultValue)) {
            return null;
          }
          if (isUTCDate(defaultValue)) {
            return null;
          }
          return "Specify a valid date in UTC format (YYYY-MM-DDTHH:MM:SSZ) or ISO 8601 compact format (YYYYMMDDHHMMSS). Example: 2024-02-17T15:30:00Z or 20240217153000.";
        }
        if (type === INTEGER) {
          if (/^-?\d+$/.test(defaultValue)) {
            return null;
          }
          return "Specify a valid integer value. Must be a whole number (e.g., -10, 0, 42).";
        }
        if (type == FLOATING_POINT) {
          if (/^-?\d+(\.\d+)?$/.test(defaultValue)) {
            return null;
          }
          return "Specify a valid floating-point value. Must be a number with optional decimal places (e.g., -10.5, 0.0, 42.99).";
        }
      },
    ]

  ],
});
