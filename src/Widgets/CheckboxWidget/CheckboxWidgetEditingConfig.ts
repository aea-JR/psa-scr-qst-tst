import * as Scrivito from "scrivito";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { DEFAULT_VALUE, EXTERNAL_ID, IDENTIFIER, IS_BEING_COPIED, PLACEHOLDER, QUESTION_ID, TYPE } from "../../constants/constants";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { isIdentifierUnique } from "../../utils/isIdentifierUnique";
import { isEmpty } from "lodash-es";


Scrivito.provideEditingConfig("PisaQuestionnaireCheckboxWidget", {

  initialize: (obj) => {
    if (!obj.get(EXTERNAL_ID)) {
      const id = generateId();
      console.log("setting externalId for PisaQuestionnaireCheckboxWidget fron initialize: " + id);
      obj.update({ externalId: id });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);

    // Skip updating externalId if the parent container is marked as being copied
    if (parent && parent.get(IS_BEING_COPIED)) {
      console.log(
        "Child widget copied as part of container. No change to externalId.",
      );
      return;
    }
    const id = generateId();
    console.log("Copying child widget for PisaQuestionnaireCheckboxWidget w: " + id);
    child.update({ externalId: id, questionId: null });
  },

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
    ...defaultValidations as any,
    [
      IDENTIFIER,
      (identifier: string, { widget }: { widget: Scrivito.Widget }) => {
        if (!isIdentifierUnique(widget, "PisaQuestionnaireCheckboxWidget")) {
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
    ],
    [
      TYPE,
      (type: string) => {
        if (isEmpty(type)) {
          return "Specify the Input type."
        }
      }
    ]

  ]
});
