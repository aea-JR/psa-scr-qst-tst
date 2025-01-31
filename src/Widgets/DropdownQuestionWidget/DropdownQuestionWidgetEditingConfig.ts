import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { isIdentifierUnique } from "../../utils/isIdentifierUnique";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { Widget } from "scrivito";

import { AnswerOptionWidget } from "../AnswerOptionWidget/AnswerOptionWidgetClass";
//import { OptionsComponent } from "../../Components/AnswerOptionsTab/OptionsComponent";
import { compact, isEmpty, map, some } from "lodash-es";
import { defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";

Scrivito.provideEditingConfig("DropdownQuestionWidget", {
  initialize: (obj) => {
    if (!obj.get("externalId")) {
      console.log("setting externalId fron initialize");
      obj.update({ externalId: generateId() });
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
    console.log("Copying child widget");
    child.update({ externalId: generateId() });
  },
  title: "PisaSales Dropdown Question",
  attributes: {
    text: { title: "Question title" },
    mandatory: { title: "Mandatory" },

    identifier: { title: "Identifier" },
    help: { title: "Help text" },
    defaultValue: { title: "Default value" },
    emptyOption: {
      title: "Use empty option",
      description: "Adds an empty option to the top of the options.",
    },
  },
  initialContent: {
    ...defaultInitialContent,
    type: "string_dropdown",
    mandatory: false,
    emptyOption: true,
    options: [
      new AnswerOptionWidget({ text: "First Option" }),
      new AnswerOptionWidget({ text: "Second Option" })
    ]
  },
  properties: (widget) => {
    return [
      ...defaultProperties,
      "placeholder",
      "emptyOption",
      ["externalId", { enabled: false }],
      ["questionId", { enabled: false }]
    ];
  },
  propertiesGroups: (widget) => {
    return [
      {
        title: "Options",
        key: "QuestionnaireDropdownOptions",
        properties: ["options"],
        //  component: OptionsComponent
      },


    ];
  },
  validations: [
    ...defaultValidations as any,
    [
      "identifier",
      (identifier: string, { widget }: { widget: Scrivito.Widget }) => {
        if (!isIdentifierUnique(widget, "DropdownQuestionWidget")) {
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
        if (isEmpty(defaultValue)) {
          return;
        }
        if (!defaultValue.startsWith("#")) {
          return "Default value must start with #.";
        }
        const options = widget.get("options") as Widget[];
        const allowedValues = compact(
          map(options, (option) => option.get("identifier") as string),
        ); //(widget.get("options2") as Widget[]).map((option) => option.get("identifier") as string)

        if (!some(allowedValues, (value) => defaultValue.includes(value))) {
          return "Default value must start with # and match identifier.";
        }
      },
    ],
    [
      "options",
      (options: Widget[]) => {
        if (options.length < 2) {
          return "Question must include at least two options.";
        }
      },
    ],
  ],
});
