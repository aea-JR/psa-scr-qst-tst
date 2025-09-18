import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { Widget } from "scrivito";

import { QuestionnaireAnswerOptionWidget } from "../AnswerOptionWidget/AnswerOptionWidgetClass";
import { compact, isEmpty } from "../../utils/lodashPolyfills";
import { defaultAttributes, defaultInitialContent, defaultProperties, defaultValidations } from "../defaultQuestionEditingConfig";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { ALIGNMENT, CLEAR_SELECTION_BUTTON_TEXT, DEFAULT_VALUE, ENABLE_CONDITIONALS, EXTERNAL_ID, IDENTIFIER, INLINE_VIEW, IS_BEING_COPIED, MANDATORY, OPTIONS, QUESTION_ID, SHOW_CLEAR_SELECTION_BUTTON, TYPE, VALIDATION_TEXT } from "../../constants/constants";
import { insideQuestionnaireContainerValidation } from "../../utils/validations/insideQuestionnaireContainerValidation";
import { isAlignmentEnabled } from "./isSelectAlignmentEnabled";
import selectThumbnail from "../../assets/images/crm-questionnaire-select.svg";

Scrivito.provideEditingConfig("QuestionnaireSelectQuestionWidget", {
  initialize: (obj) => {
    if (!obj.get(EXTERNAL_ID)) {
      obj.update({ externalId: generateId() });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);

    // Skip updating externalId if the parent container is marked as being copied
    if (parent && parent.get(IS_BEING_COPIED)) {
      return;
    }
    child.update({ externalId: generateId(), questionId: null });
  },
  thumbnail: selectThumbnail,
  title: "Questionnaire Select Question",
  titleForContent: (obj) => {
    if (obj.get(ENABLE_CONDITIONALS)) {
      return "Questionnaire Conditional Select Question";
    }
    return "Questionnaire Select Question";
  },

  attributes: {
    ...defaultAttributes,
    type: {
      title: "Input Type",
      values: [
        { title: "Dropdown", value: "string_dropdown" },
        { title: "Radio", value: "string_radio" },
        { title: "Checkboxes", value: "string_checkboxes" }
      ],
    },
    enableConditionals: {
      title: "Use as Conditional Container",
      description: "Enables this question to act as a conditional container. Each answer option will represent a condition, and associated content will only display if the condition is met. Disable this feature only after ensuring there are no nested questions or widgets under the conditions."
    },
    showClearSelectionButton: {
      title: "Show 'Clear selection' button",
      description: "Allows respondents to remove their choice. Available for Input Type 'Radio' and only when the question isn't mandatory."
    },
    clearSelectionButtonText: { title: "Label for 'Clear selection' button" },
    inlineView: {
      title: "Arrange Options horizontally",
      description: "When enabled, all answer options will be displayed horizontally. Not available for Input Type 'Dropdown'"
    },
    alignment: {
      title: "Alignment",
      description: "Available for 'Dropdown'. For 'Radio' and 'Checkboxes' only when 'Arrange Options horizontally' is enabled."
    },
  },
  initialContent: {
    ...defaultInitialContent,
    type: "string_dropdown",
    enableConditionals: false,
    options: [
      new QuestionnaireAnswerOptionWidget({ text: "First Option" }),
      new QuestionnaireAnswerOptionWidget({ text: "Second Option" })
    ],
    clearSelectionButtonText: "Clear selection",
    showClearSelectionButton: true,
    inlineView: false,
    validationText: "Please select an item"
  },
  properties: (widget) => {
    const isMandatory = widget.get(MANDATORY) as boolean;
    const type = widget.get(TYPE) as string;
    const showClearSelectionButton = widget.get(SHOW_CLEAR_SELECTION_BUTTON) as boolean;
    const enableClearSelectionButton = !isMandatory && type == "string_radio";
    const enableClearSelectionButtonText = enableClearSelectionButton && showClearSelectionButton;
    const enableInlineView = type != "string_dropdown";
    return [
      ...defaultProperties,
      TYPE,
      ENABLE_CONDITIONALS,
      [SHOW_CLEAR_SELECTION_BUTTON, { enabled: enableClearSelectionButton }],
      [CLEAR_SELECTION_BUTTON_TEXT, { enabled: enableClearSelectionButtonText }],
      [INLINE_VIEW, { enabled: enableInlineView }],
      [ALIGNMENT, { enabled: isAlignmentEnabled(widget) }],
      VALIDATION_TEXT,
      [EXTERNAL_ID, { enabled: false }],
      [QUESTION_ID, { enabled: false }]
    ];
  },
  propertiesGroups: (widget) => {
    const groups = [
      {
        title: "Options",
        key: "QuestionnaireDropdownOptions",
        properties: [OPTIONS]
      },
    ];

    return groups;

  },
  validations: [
    ...defaultValidations,
    insideQuestionnaireContainerValidation,
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
          options.map((option) => option.get(IDENTIFIER) as string),
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
          return "Question must include at least two answer options.";
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
    ]
  ],
});
