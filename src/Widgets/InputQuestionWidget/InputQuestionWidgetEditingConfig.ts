import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { isIdentifierUnique } from "../../utils/isIdentifierUnique";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { isPisaDate } from "../../utils/isPisaDate";
import { isUTCDate } from "../../utils/isUTCDate";

Scrivito.provideEditingConfig("InputQuestionWidget", {
  initialize: (obj) => {
    if (!obj.get("externalId")) {
      const id = generateId();
      console.log("setting externalId for InputQuestionWidget fron initialize: " + id);
      obj.update({ externalId: id });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);

    // Skip updating externalId if the parent container is marked as being copied
    if (parent && parent.get("isBeingCopied")) {
      console.log(
        "Child widget copied as part of container. No change to externalId.",
      );
      return;
    }
    const id = generateId();
    console.log("Copying child widget for InputQuestionWidget w: " + id);
    child.update({ externalId: id, questionId: null });
  },

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
      "placeholder",
      "type",
      ["externalId", { enabled: false }],
      ["questionId", { enabled: false }],
    ];
  },
  validations: [
    ...defaultValidations as any,
    [
      "identifier",
      (identifier: string, { widget }: { widget: Scrivito.Widget }) => {
        if (!isIdentifierUnique(widget, "InputQuestionWidget")) {
          return "Specify a unique Identifier. There is at least one other question with the same Identfier.";
        }

        if (identifier && !/^[A-Z0-9_]+$/.test(identifier)) {
          return "Specifiy a valid identifier! Follow the PisaSales Schema (A-Z0-9_)";
        }
        if (identifier.length > 32) {
          return "Maximum identifier character length of 32 exceeded!";
        }
      },
    ],
    [
      "defaultValue",
      (defaultValue: string, { widget }: { widget: Scrivito.Widget }) => {
        const type = widget.get("type")
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
