import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { isIdentifierUnique } from "../../utils/isIdentifierUnique";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { Widget } from "scrivito";

import { AnswerOptionWidget } from "../AnswerOptionWidget/AnswerOptionWidgetClass";
//import { OptionsComponent } from "../../Components/AnswerOptionsTab/OptionsComponent";
import { compact, isEmpty, map, some } from "lodash-es";
import { defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { DEFAULT_VALUE, ENABLE_CONDITIONALS, EXTERNAL_ID, IDENTIFIER, IS_BEING_COPIED, OPTIONS, PLACEHOLDER, QUESTION_ID, TYPE } from "../../constants/constants";

Scrivito.provideEditingConfig("SelectQuestionWidget", {
  initialize: (obj) => {
    if (!obj.get(EXTERNAL_ID)) {
      console.log("setting externalId fron initialize");
      obj.update({ externalId: generateId() });
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
    console.log("Copying child widget");
    child.update({ externalId: generateId(), questionId: null });
  },
  title: "PisaSales Select Question",
  titleForContent: (obj) => {
    if (obj.get(ENABLE_CONDITIONALS)) {
      return "PisaSales Conditional Select Question";
    }
    return "PisaSales Select Question";
  },

  attributes: {
    text: { title: "Question title" },
    mandatory: { title: "Mandatory" },
    type: {
      title: "Input Type",
      values: [
        { title: "Dropdown", value: "string_dropdown" },
        { title: "Radio", value: "string_radio" },
        { title: "Checkboxes", value: "string_checkboxes" }
      ],
    },
    identifier: { title: "Identifier" },
    help: { title: "Help text" },
    defaultValue: {
      title: "Default value",
      description: "Specify the default value for the question. For single selection types, use a value starting with # matching one of the option identifiers. For multiple selection (checkboxes), provide a comma-separated list of values, each starting with # (e.g., #A,#B)."
    },
    enableConditionals: {
      title: "Use as Conditional Container",
      description: "Enables this question to act as a conditional container. Each answer option will represent a condition, and associated content will only display if the condition is met. Disable this feature only after ensuring there are no nested questions or widgets under the conditions."
    },
    externalId: { title: "External ID" },
    questionId: { title: "Question ID (GID)" },
  },
  initialContent: {
    ...defaultInitialContent,
    type: "string_dropdown",
    mandatory: false,
    enableConditionals: false,
    options: [
      new AnswerOptionWidget({ text: "First Option" }),
      new AnswerOptionWidget({ text: "Second Option" })
    ]
  },
  properties: (widget) => {
    return [
      ...defaultProperties,
      TYPE,
      PLACEHOLDER,
      ENABLE_CONDITIONALS,
      [EXTERNAL_ID, { enabled: false }],
      [QUESTION_ID, { enabled: false }]
    ];
  },
  propertiesGroups: (widget) => {
    const groups = [
      {
        title: "Options",
        key: "QuestionnaireDropdownOptions",
        properties: [OPTIONS],
        //  component: OptionsComponent
      },
    ];

    return groups;

  },
  validations: [
    ...defaultValidations as any,
    [
      IDENTIFIER,
      (identifier: string, { widget }: { widget: Scrivito.Widget }) => {
        if (!isIdentifierUnique(widget, "SelectQuestionWidget")) {
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
        if (isEmpty(defaultValue)) {
          return;
        }
        if (!defaultValue.startsWith("#")) {
          return "Default value must start with #.";
        }
        const type = widget.get(TYPE);
        const isMultiCheckboxes = type == "string_checkboxes";
        const options = widget.get(OPTIONS) as Widget[];
        const allowedValues = compact(
          map(options, (option) => option.get(IDENTIFIER) as string),
        );

        if (isMultiCheckboxes) {
          const defaultValues = defaultValue.split(",").map((v) => v.trim().slice(1)); // Split and remove `#`
          const invalidValues = defaultValues.filter(
            (val) => !allowedValues.includes(val)
          );
          if (invalidValues.length > 0) {
            return `Invalid default values: ${invalidValues.join(", ")}. Provide a comma-separated list of identifiers, each starting with # (e.g., #A,#B).`;
          }
          return;
        }
        const realDefaultValue = defaultValue.slice(1);
        if (!allowedValues.includes(realDefaultValue)) {
          return "Default value must match one of the option identifiers (after #).";
        }
      },
    ],
    [
      OPTIONS,
      (options: Widget[]) => {
        if (options.length < 2) {
          return "Question must include at least two options.";
        }
      },
    ],
    [
      ENABLE_CONDITIONALS,
      (enableConditionals: boolean, { widget }: { widget: Scrivito.Widget }) => {
        const { questions } = extractQuestionsAndOptions(widget);

        if (!enableConditionals && !isEmpty(questions)) {
          return "This question was used as a conditional container and has nested questions. Disable this feature only after removing or relocating the nested questions to prevent submission inconsistencies."
        }
      },
    ],
  ],
});
