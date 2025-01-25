import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { isIdentifierUnique } from "../../utils/isIdentifierUnique";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { isEmpty } from "lodash-es";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";

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
    child.update({ externalId: id });
  },

  title: "PisaSales Input Field Question",
  attributes: {
    ...defaultAttributes,
    placeholder: { title: "Placeholder" },
    type: {
      title: "Input type",
      values: [
        { value: "string_single_line", title: "Single-line (String)" },
        { value: "string_multi_line", title: "Multi-line (String)" },
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

  ],
});
