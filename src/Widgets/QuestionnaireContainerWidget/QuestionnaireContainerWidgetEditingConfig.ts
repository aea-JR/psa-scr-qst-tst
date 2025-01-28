import * as Scrivito from "scrivito";

import generateId from "../../utils/idGenerator";
import { QuestionnaireExternalIdComponent } from "../../Components/QuestionnaireExternalId/QuestionnaireExternalId";
import { isEmpty, some } from "lodash-es";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { InputQuestionWidget } from "../InputQuestionWidget/InputQuestionWidgetClass";
import { QuestionnaireCreationTab } from "../../Components/QuestionnaireCreationTab/QuestionnaireCreationTab";
import { defaultValidations } from "../defaultQuestionEditingConfig";
import { isUsageRestricted } from "../../utils/isRestricted";

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

    inputType: {
      title: "Input Type",
      values: [
        { value: "repeatable", title: "Repeatable" },
        { value: "once_only", title: "Once only" },
        { value: "once_updatable", title: "Once but updatable" },
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
    }
  },
  properties: (widget) => {
    const fixedHeght = widget.get("fixedFormHeight") as boolean || false;

    return ["title",
      "inputType",
      "customClassNames",
      "fixedFormHeight",
      ["formHeight", { enabled: fixedHeght }],
      ["scrollbarWidth", { enabled: fixedHeght }],
      ["overscrollBehavior", { enabled: fixedHeght }]
    ];
  },
  propertiesGroups: (widget): any[] => {
    const isCreated = !isEmpty(widget.get("questionnaireId"));
    const showSubmittingMessage = widget.get("submittingMessageType") !== "widget-list";
    const showSubmittedMessage = widget.get("submittedMessageType") !== "widget-list";
    const showFailedMessage = widget.get("failedMessageType") !== "widget-list";
    const showRetryButton = widget.get("showRetryButton");
    const groups = [
      {
        title: "ID's",
        key: "QuestionnaireContainerIds",
        properties: [
          ["externalId", { enabled: false }],
          ["questionnaireId", { enabled: false }],
        ],
      },
      {
        title: "Answer Context",

        key: "QuestionnaireAnswerContext",
        properties: ["activityId", "contactId", "projectId"],
      },

      {
        title: "Submission Messages",
        key: "FormStepContainerWidgetSubmissionMessages",
        properties: [
          "submittingMessageType",
          showSubmittingMessage ? "submittingMessage" : "submittingMessageWidgets",
          "previewSubmittingMessage",
          "submittedMessageType",
          showSubmittedMessage ? "submittedMessage" : "submittedMessageWidgets",
          "previewSubmittedMessage",
          "failedMessageType",
          showFailedMessage ? "failedMessage" : "failedMessageWidgets",
          "showRetryButton",
          ["retryButtonText", { enabled: showRetryButton }],
          ["retryButtonAlignment", { enabled: showRetryButton }],
          "previewFailedMessage"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any
      },
      {
        title: "Navigation area",
        key: "FormNavigationButtons",
        properties: ["submitButtonText", "singleSubmitButtonAlignment"]
      },
      {
        title: "Create PisaSales Questionnaire",
        key: "QuestionnaireBuilder",
        // properties: ["externalId"],
        component: QuestionnaireCreationTab,
      },
    ];

    if (isCreated) {
      groups.pop()
    }
    return groups;
  },

  initialContent: {
    content: [new InputQuestionWidget({})],
    externalId: () => generateId(),
    questionnaireId: null,
    title: "Scrivito PisaSales Questionnaire",
    inputType: "once_updatable",
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
  },
  validations: [
    ...defaultValidations as any,
    (widget: Scrivito.Widget) => {
      if (getQuestionnaireContainerWidget(widget)) {
        return "Needs to be outside of a PisaSales form.";
      }
    },
    (widget: Scrivito.Widget) => {
      const content = widget.get("content") as Scrivito.Widget[];
      const title = widget.get("title");
      //TODO: improve
      if (content.length <= 0) {
        return "The questionnaie must include at least one question.";
      }
      const hasQuestion = some(
        content,
        (c) =>
          c.objClass() == "InputQuestionWidget" ||
          c.objClass() == "DropdownQuestionWidget",
      );
      if (!hasQuestion) {
        return "The questionnaie must include at least one question.";
      }
      if (isUsageRestricted(widget)) {
        return "This questionnaire can not be used on a public site. Please move it to a restricted sitee.";
      }

    },

    [
      "submittingMessage",
      (submittingMessage) => {
        if (!submittingMessage) {
          return "Specify the message to be displayed during form submission.";
        }
      },
    ],

    [
      "submittedMessage",
      (submittedMessage) => {
        if (!submittedMessage) {
          return "Specify the message to be displayed after successful form submission.";
        }
      },
    ],

    [
      "failedMessage",
      (failedMessage) => {
        if (!failedMessage) {
          return "Specify the message to be displayed after form submission failed.";
        }
      },
    ],

    [
      "externalId",
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
      "inputType",
      (inputType: string) => {
        if (inputType == "once_only") {
          return "This Input type is not supported yet.";
        }
        if (isEmpty(inputType)) {
          return "Specify an Input type."
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
// function getNavigationProperties(widget: Scrivito.Widget): string[] {
//   const singleStepNavigationProps = [
//     "submitButtonText",
//     "singleSubmitButtonAlignment"
//   ];
//   const MultiStepNavigationProps = [
//     "forwardButtonText",
//     "backwardButtonText",
//     "submitButtonText"
//   ];
//   if (widget.get("formType") == "single-step") {
//     return singleStepNavigationProps;
//   } else {
//     return MultiStepNavigationProps;
//   }
// }


const initializeQstContainerCopy = (qstContainerWidget: Scrivito.Obj) => {
  console.log("Copying container");
  if (isEmpty(qstContainerWidget.get("questionnaireId"))) {
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