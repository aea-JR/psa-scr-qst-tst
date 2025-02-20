import * as Scrivito from "scrivito";

import generateId from "../../utils/idGenerator";
import { isEmpty, some } from "lodash-es";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { InputQuestionWidget } from "../InputQuestionWidget/InputQuestionWidgetClass";
import { QuestionnaireManagementTab } from "../../Components/QuestionnaireManagementTab/QuestionnaireManagementTab";
import { defaultValidations } from "../defaultQuestionEditingConfig";
import { isUsageRestricted } from "../../utils/isRestricted";
import { QuestionnaireStepWidget } from "../QuestionnaireStepWidget/QuestionnaireStepWidgetClass";
import { ACTIVITY_ID, ACTIVITY_ID_DATA_ITEM_FIELD, ACTIVITY_ID_DATA_ITEM_FIELD_VALUE, ACTIVITY_ID_SOURCE, BACKWARD_BUTTON_TEXT, CONTACT_ID, CONTACT_ID_DATA_ITEM_FIELD, CONTACT_ID_DATA_ITEM_FIELD_VALUE, CONTACT_ID_SOURCE, CUSTOM_CLASS_NAMES, EXTERNAL_ID, FAILED_MESSAGE, FAILED_MESSAGE_TYPE, FAILED_MESSAGE_WIDGETS, FIXED_FORM_HEIGHT, FORM_HEIGHT, FORM_TYPE, FORWARD_BUTTON_TEXT, INCLUDE_EMPTY_ANSWERS, INPUT_TYPE, OVERSCROLL_BEHAVIOR, PREVIEW_FAILED_MESSAGE, PREVIEW_SUBBMITTED_MESSAGE, PREVIEW_SUBMITTING_MESSAGE, PROJECT_ID, PROJECT_ID_DATA_ITEM_FIELD, PROJECT_ID_DATA_ITEM_FIELD_VALUE, PROJECT_ID_SOURCE, QUESTIONNAIRE_ID, RETRY_BUTTON_ALIGNMENT, RETRY_BUTTON_TEXT, REVIEW_BUTTON_TEXT, REVIEW_CLOSE_BUTTON_TEXT, REVIEW_HEADER_TITLE, SCROLLBAR_WIDTH, SHOW_RETRY_BUTTON, SHOW_REVIEW, SHOW_REVIEW_FOOTER, SHOW_REVIEW_HEADER, SHOW_STEPS_IN_REVIEW, SINGLE_SUBMIT_BUTTON_ALIGNMENT, STEPS, SUBMIT_BUTTON_TEXT, SUBMITTED_MESSAGE, SUBMITTED_MESSAGE_TYPE, SUBMITTED_MESSAGE_WIDGETS, SUBMITTING_MESSAGE, SUBMITTING_MESSAGE_TYPE, SUBMITTING_MESSAGE_WIDGETS, TITLE } from "../../constants/constants";

Scrivito.provideEditingConfig("QuestionnaireContainerWidget", {
  initializeCopy: (container) => initializeQstContainerCopy(container),
  title: "PisaSales Questionnaire",

  attributes: {
    title: {
      title: "Title",
    },
    externalId: {
      title: "External ID",
      description: "The external id reference to the PisaSales Questionnaire GID.",
    },
    questionnaireId: {
      title: "Questionnaire ID (GID)",
    },

    inputType: {
      title: "Response Mode",
      description: "Defines how answers are handled. “Multiple Submissions” creates a new answer set for each submission, while “Single Submission with Edits” allows modifying a single answer set.",
      values: [
        { value: "PSA_QST_INP_TYP_REP", title: "Multiple Submissions" },
        { value: "PSA_QST_INP_TYP_ONC_UPD", title: "Single Submission with Edits" },
      ],
    },
    activityId: { title: "Activity ID" },
    projectId: { title: "Project ID" },
    contactId: { title: "Contact ID" },

    customClassNames: {
      title: "Additional CSS Classes",
      description:
        "Specify additional CSS class names to be added to the main container of the Questionnaire. Separate multiple class names with spaces.",
    },

    submittingMessage: {
      title: "Message shown while the form is being submitted",
    },
    submittedMessage: {
      title: "Message shown after the form was successfully submitted",
    },
    failedMessage: {
      title: "Message shown if the form submission failed",
    },
    failedMessageType: {
      title: "Submission failure message type",
      description:
        "Select the type of failure message displayed upon submission failure.",
      values: [
        { value: "default", title: "Default text" },
        { value: "widget-list", title: "Custom content" },
      ],
    },
    submittedMessageType: {
      title: "Submission success message type",
      description:
        "Select the type of message displayed after successful form submission.",
      values: [
        { value: "default", title: "Default text" },
        { value: "widget-list", title: "Custom content" },
      ],
    },
    submittingMessageType: {
      title: "Submitting message type",
      description:
        "Select the type of message displayed while the form is being submitted.",
      values: [
        { value: "default", title: "Default text" },
        { value: "widget-list", title: "Custom content" },
      ],
    },
    failedMessageWidgets: {
      title: "Submission failure content",
      description:
        "Customize the content to be displayed upon submission failure.",
    },
    submittedMessageWidgets: {
      title: "Submission success content",
      description:
        "Customize the content to be displayed after successful form submission.",
    },
    submittingMessageWidgets: {
      title: "Submitting content",
      description:
        "Customize the content to be displayed while the form is being submitted.",
    },
    previewFailedMessage: {
      title: "Preview failed message/content",
      description: "Preview the failure message or content in edit mode.",
    },
    previewSubmittedMessage: {
      title: "Preview success message/content",
      description: "Preview the success message or content in edit mode.",
    },
    previewSubmittingMessage: {
      title: "Preview submitting message/content",
      description:
        "Preview the message or content displayed while the form is being submitted in edit mode.",
    },
    showRetryButton: { title: "Show retry button" },
    retryButtonText: { title: "Retry button text" },
    retryButtonAlignment: {
      title: "Retry button alignment",
      values: [
        { value: "left", title: "Left" },
        { value: "text-center", title: "Center" },
        { value: "text-end", title: "Right" },
        { value: "block", title: "Full width" },
      ],
    },

    hiddenFields: {
      title: "Hidden fields",
    },
    forwardButtonText: {
      title: "Forward button text",
    },
    backwardButtonText: {
      title: "Backward button text",
    },
    submitButtonText: {
      title: "Submit button text",
    },

    singleSubmitButtonAlignment: {
      title: "Alignment",
      values: [
        { value: "left", title: "Left" },
        { value: "text-center", title: "Center" },
        { value: "text-end", title: "Right" },
        { value: "block", title: "Full width" },
      ],
    },
    fixedFormHeight: {
      title: "Enable fixed height",
      description: "Manually set the form height."

    },
    overscrollBehavior: {
      title: "Overscroll behavior",
      description: "Select how overscrolling should behave, i.e. it scrolls also the container.",
      values: [
        { value: "default", title: "Default" },
        { value: "none", title: "No scroll" }
      ]
    },
    formHeight: {
      title: "Form height",
      description: "Enter the height of the form content in em."
    },
    scrollbarWidth:
    {
      title: "Scrollbar width",
      description: 'The width of the scrollbar. "None" will hide the scrollbar.',
      values: [{ value: "default", title: "Default" }, { value: "thin", title: "Thin" }, { value: "none", title: "None" }]
    },
    activityIdDataItemField: {
      title: 'Name of the data attribute in question',
    },
    contactIdDataItemField: {
      title: 'Name of the data attribute in question',
    },
    projectIdDataItemField: {
      title: 'Name of the data attribute in question',
    },
    activityIdSource: {
      title: "Activity ID Source",
      description: "Select whether to manually enter the Activity ID or retrieve it from a DataItem attribute.",
      values: [
        { value: "manual", title: "Manual" },
        { value: "data-item", title: "DataItem" },
      ],
    },
    projectIdSource: {
      title: "Project ID Source",
      description: "Select whether to manually enter the Project ID or retrieve it from a DataItem attribute.",
      values: [
        { value: "manual", title: "Manual" },
        { value: "data-item", title: "DataItem" },
      ],
    },
    contactIdSource: {
      title: "Contact ID Source",
      description: "Select whether to manually enter the Contact ID or retrieve it from a DataItem attribute. ",
      values: [
        { value: "manual", title: "Manual" },
        { value: "data-item", title: "DataItem" },
      ],
    },
    activityIdDataItemFieldValue: {
      title: "Activity ID data attribute value"
    },
    contactIdDataItemFieldValue: {
      title: "Contact ID data attribute value"
    },
    projectIdDataItemFieldValue: {
      title: "Project ID data attribute value"
    },



  },
  properties: (widget) => {
    const fixedHeght = widget.get(FIXED_FORM_HEIGHT) as boolean || false;

    return [
      TITLE,
      INPUT_TYPE,
      CUSTOM_CLASS_NAMES,
      FIXED_FORM_HEIGHT,
      [FORM_HEIGHT, { enabled: fixedHeght }],
      [SCROLLBAR_WIDTH, { enabled: fixedHeght }],
      [OVERSCROLL_BEHAVIOR, { enabled: fixedHeght }]
    ];
  },
  propertiesGroups: (widget) => {
    const isCreated = !isEmpty(widget.get(QUESTIONNAIRE_ID));
    // const hasUpdates = compareQuestionnaireMeta(widget as unknown as Scrivito.Widget)
    const showSubmittingMessage = widget.get(SUBMITTING_MESSAGE_TYPE) !== "widget-list";
    const showSubmittedMessage = widget.get(SUBMITTED_MESSAGE_TYPE) !== "widget-list";
    const showFailedMessage = widget.get(FAILED_MESSAGE_TYPE) !== "widget-list";
    const showRetryButton = widget.get(SHOW_RETRY_BUTTON);
    const groups = [
      {
        title: "ID's",
        key: "QuestionnaireContainerIds",
        properties: [
          [EXTERNAL_ID, { enabled: false }],
          [QUESTIONNAIRE_ID, { enabled: false }],
        ],
      },
      {
        title: "Answer Context",
        key: "QuestionnaireAnswerContext",
        properties: getContextProperties(widget as any),
      },
      {
        title: "Submission Messages",
        key: "FormStepContainerWidgetSubmissionMessages",
        properties: [
          SUBMITTING_MESSAGE_TYPE,
          showSubmittingMessage ? SUBMITTING_MESSAGE : SUBMITTING_MESSAGE_WIDGETS,
          PREVIEW_SUBMITTING_MESSAGE,
          SUBMITTED_MESSAGE_TYPE,
          showSubmittedMessage ? SUBMITTED_MESSAGE : SUBMITTED_MESSAGE_WIDGETS,
          PREVIEW_SUBBMITTED_MESSAGE,
          FAILED_MESSAGE_TYPE,
          showFailedMessage ? FAILED_MESSAGE : FAILED_MESSAGE_WIDGETS,
          SHOW_RETRY_BUTTON,
          [RETRY_BUTTON_TEXT, { enabled: showRetryButton }],
          [RETRY_BUTTON_ALIGNMENT, { enabled: showRetryButton }],
          PREVIEW_FAILED_MESSAGE
        ]
      },
      {
        title: "Steps",
        key: "QuestionnaireSteps",
        properties: [STEPS]

      },
      {
        title: "Review",
        key: "FormReview",
        properties: getReviewProperties(widget as any)
      },
      {
        title: "Navigation area",
        key: "QuestionnaireNavigationButtons",
        properties: getNavigationProperties(widget as any)
      },
      {
        title: "PisaSales Questionnaire Management",
        key: "QuestionnaireBuilder",
        // properties: [EXTERNAL_ID],
        component: QuestionnaireManagementTab,
      },
    ];

    // if (isCreated && !hasUpdates) {
    //   groups.pop()
    // }
    return groups;
  },

  initialContent: {
    steps: [new QuestionnaireStepWidget({
      isSingleStep: true,
      content: [
        new InputQuestionWidget({})
      ]
    })],
    externalId: () => generateId(),
    questionnaireId: null,
    title: "Scrivito PisaSales Questionnaire",
    inputType: "PSA_QST_INP_TYP_REP",
    isBeingCopied: false,
    singleSubmitButtonAlignment: "text-center",
    forwardButtonText: "Forward",
    backwardButtonText: "Backward",
    submitButtonText: "Submit",
    // submitting stuff
    submittingMessage: "Submitting...",
    submittedMessage:
      "Your message has been successfully sent. Thank you for your request. We will get back to you as soon as possible.",
    failedMessage:
      "We are sorry, your request could not be completed. Please try again later.",
    submittingMessageType: "default",
    submittedMessageType: "default",
    failedMessageType: "default",
    previewSubmittingMessage: false,
    previewSubmittedMessage: false,
    previewFailedMessage: false,
    showRetryButton: false,
    retryButtonText: "Retry",
    retryButtonAlignment: "text-center",
    fixedFormHeight: false,
    formHeight: 35,
    scrollbarWidth: "default",
    overscrollBehavior: "default",
    showReview: false,
    includeEmptyAnswers: false,
    showStepsInReview: false,
    showReviewHeader: false,
    showReviewFooter: false,
    reviewButtonText: "Review",
    reviewHeaderTitle: "Review",
    reviewCloseButtonText: "Close",
    activityIdSource: "manual",
    contactIdSource: "manual",
    projectIdSource: "manual",
    questionnaireStatus: "void"
  },
  validations: [
    ...defaultValidations as any,
    (widget: Scrivito.Widget) => {
      if (getQuestionnaireContainerWidget(widget)) {
        return "Needs to be outside of a PisaSales form.";
      }
    },
    (widget: Scrivito.Widget) => {
      const allWidgets = widget.widgets();
      //TODO: improve
      if (allWidgets.length <= 0) {
        return "The questionnaie must include at least one question.";
      }
      const hasQuestion = some(
        allWidgets,
        (c) =>
          c.objClass() == "InputQuestionWidget" ||
          c.objClass() == "SelectQuestionWidget" ||
          c.objClass() == "PisaQuestionnaireCheckboxWidget"

      );
      if (!hasQuestion) {
        return "The questionnaie must include at least one question.";
      }
      if (isUsageRestricted(widget)) {
        return "This questionnaire can not be used on a public site. Please move it to a restricted sitee.";
      }

    },
    [
      SUBMITTING_MESSAGE,
      (submittingMessage) => {
        if (!submittingMessage) {
          return "Specify the message to be displayed during form submission.";
        }
      },
    ],
    [
      SUBMITTED_MESSAGE,
      (submittedMessage) => {
        if (!submittedMessage) {
          return "Specify the message to be displayed after successful form submission.";
        }
      },
    ],
    [
      FAILED_MESSAGE,
      (failedMessage) => {
        if (!failedMessage) {
          return "Specify the message to be displayed after form submission failed.";
        }
      },
    ],
    [
      EXTERNAL_ID,
      (externalId: string) => {
        if (!externalId) {
          return "Specify the External ID.";
        }

        if (externalId.match(/^[0-9a-zA-Z]{20}$/) === null) {
          return "Specify a valid external ID (20 characters).";
        }
      },
    ],
    [
      INPUT_TYPE,
      (inputType: string) => {
        if (!inputType) {
          return "Specify the Input type.";
        }

      },
    ],
  ],
});

/**
 * Retrieves the properties for the navigation tab
 * @param {*} widget
 * @returns an array of strings containing the properties to be shown
 */
const getNavigationProperties = (widget: Scrivito.Widget): string[] => {
  const singleStepNavigationProps = [
    SUBMIT_BUTTON_TEXT,
    SINGLE_SUBMIT_BUTTON_ALIGNMENT
  ];
  const MultiStepNavigationProps = [
    FORWARD_BUTTON_TEXT,
    BACKWARD_BUTTON_TEXT,
    SUBMIT_BUTTON_TEXT
  ];
  if (widget.get(FORM_TYPE) == "single-step") {
    return singleStepNavigationProps;
  } else {
    return MultiStepNavigationProps;
  }
}

/**
 * Retrieves the properties for the review tab
 * @param {*} widget
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getReviewProperties(widget: Scrivito.Widget): string[] | any[] {
  const reviewPropsDisabled = [SHOW_REVIEW];
  const reviewPropsEnabled = [
    SHOW_REVIEW,
    REVIEW_BUTTON_TEXT,
    SHOW_STEPS_IN_REVIEW,
    INCLUDE_EMPTY_ANSWERS,
    SHOW_REVIEW_HEADER,
    [REVIEW_HEADER_TITLE, { enabled: widget.get(SHOW_REVIEW_HEADER) }],
    SHOW_REVIEW_FOOTER,
    [REVIEW_CLOSE_BUTTON_TEXT, { enabled: widget.get(SHOW_REVIEW_FOOTER) }]
  ];
  return widget.get(SHOW_REVIEW) ? reviewPropsEnabled : reviewPropsDisabled;
}

const getContextProperties = (widget: Scrivito.Widget) => {
  const activityIdSource = widget.get(ACTIVITY_ID_SOURCE);
  const projectIdSource = widget.get(PROJECT_ID_SOURCE);
  const contactIdSource = widget.get(CONTACT_ID_SOURCE);
  const activityIdProps = [ACTIVITY_ID_SOURCE];
  const projectIdProps = [PROJECT_ID_SOURCE];
  const contactIdProps = [CONTACT_ID_SOURCE];
  if (activityIdSource == "manual") {
    activityIdProps.push(ACTIVITY_ID);
  } else {
    activityIdProps.push(ACTIVITY_ID_DATA_ITEM_FIELD, [ACTIVITY_ID_DATA_ITEM_FIELD_VALUE, { enabled: false }] as any);
  }
  if (projectIdSource == "manual") {
    projectIdProps.push(PROJECT_ID);
  } else {
    projectIdProps.push(PROJECT_ID_DATA_ITEM_FIELD, [PROJECT_ID_DATA_ITEM_FIELD_VALUE, { enabled: false }] as any);
  }
  if (contactIdSource == "manual") {
    contactIdProps.push(CONTACT_ID);
  } else {
    contactIdProps.push(CONTACT_ID_DATA_ITEM_FIELD, [CONTACT_ID_DATA_ITEM_FIELD_VALUE, { enabled: false }] as any);
  }

  const props = [...activityIdProps, ...contactIdProps, ...projectIdProps]
  return props;
}

const initializeQstContainerCopy = (qstContainerWidget: Scrivito.Obj) => {
  console.log("Copying container");
  if (isEmpty(qstContainerWidget.get(QUESTIONNAIRE_ID))) {
    console.log("QST not yet created, will not mark as copied!")
    qstContainerWidget.update({ externalId: generateId() });
    return;
  }
  // Mark that the container is being copied
  qstContainerWidget.update({ isBeingCopied: true });
  setTimeout(() => {
    qstContainerWidget.update({ isBeingCopied: false });
  }, 0);

}