import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { isPisaDate } from "../../utils/isPisaDate";
import { isUTCDate } from "../../utils/isUTCDate";
import { DEFAULT_VALUE, EXTERNAL_ID, IS_BEING_COPIED, PLACEHOLDER, QUESTION_ID, TYPE } from "../../constants/constants";
import inputThumbnail from "../../assets/images/crm-questionnaire-input.svg";
import { insideQuestionnaireContainerValidation } from "../../utils/validations/insideQuestionnaireContainerValidation";

Scrivito.provideEditingConfig("QuestionnaireInputQuestionWidget", {
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
  title: "PisaSales Input Field Question",
  attributes: {
    ...defaultAttributes,
    externalId: { title: "External ID" },
    questionId: { title: "Question ID (GID)" },
    placeholder: { title: "Placeholder" },
    type: {
      title: "Input type",
      values: [
        { value: "string_single_line", title: "Single-line (String)" },
        { value: "string_multi_line", title: "Multi-line (String)" },
        { value: "integer", title: "Integer (Number)" },
        { value: "floating_point", title: "Float (Number)" },
        { value: "date", title: "Date only (Date)" },
        { value: "date_time", title: "Date & Time (Date)" },
      ],
    },
  },
  initialContent: {
    ...defaultInitialContent,
    type: "string_single_line",

  },
  properties: (widget) => {
    return [
      ...defaultProperties,
      PLACEHOLDER,
      TYPE,
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
        if (type == "date" || type == "date_time") {
          if (isPisaDate(defaultValue)) {
            return null;
          }
          if (isUTCDate(defaultValue)) {
            return null;
          }
          return "Specify a valid date in UTC format (YYYY-MM-DDTHH:MM:SSZ) or ISO 8601 compact format (YYYYMMDDHHMMSS). Example: 2024-02-17T15:30:00Z or 20240217153000.";
        }
        if (type === "integer") {
          if (/^-?\d+$/.test(defaultValue)) {
            return null;
          }
          return "Specify a valid integer value. Must be a whole number (e.g., -10, 0, 42).";
        }
        if (type == "floating_point") {
          if (/^-?\d+(\.\d+)?$/.test(defaultValue)) {
            return null;
          }
          return "Specify a valid floating-point value. Must be a number with optional decimal places (e.g., -10.5, 0.0, 42.99).";
        }
      },
    ]

  ],
});
