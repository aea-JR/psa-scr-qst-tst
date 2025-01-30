import { provideWidgetClass } from "scrivito";

export const QuestionnaireContainerWidget = provideWidgetClass(
  "QuestionnaireContainerWidget",
  {
    attributes: {
      title: "string",
      content: "widgetlist",
      externalId: "string",
      questionnaireId: "string",
      inputType: [
        "enum",
        {
          values: ["repeatable", "once_only", "once_updatable"],
        },
      ],
      activityId: "string",
      projectId: "string",
      contactId: "string",
      customClassNames: "string",
      isBeingCopied: "boolean",

      failedMessage: "string",
      submittedMessage: "string",
      submittingMessage: "string",
      failedMessageType: [
        "enum",
        {
          values: ["default", "widget-list"]
        }
      ],
      submittedMessageType: [
        "enum",
        {
          values: ["default", "widget-list"]
        }
      ],
      submittingMessageType: [
        "enum",
        {
          values: ["default", "widget-list"]
        }
      ],
      failedMessageWidgets: "widgetlist",
      submittedMessageWidgets: "widgetlist",
      submittingMessageWidgets: "widgetlist",
      previewFailedMessage: "boolean",
      previewSubmittedMessage: "boolean",
      previewSubmittingMessage: "boolean",
      showRetryButton: "boolean",
      retryButtonText: "string",
      retryButtonAlignment: [
        "enum",
        {
          values: ["left", "text-center", "text-end", "block"]
        }
      ],
      hiddenFields: ["widgetlist", { only: "FormHiddenFieldWidget" }],
      formType: [
        "enum",
        {
          values: ["single-step", "multi-step"],
        },
      ],
      forwardButtonText: "string",
      backwardButtonText: "string",
      submitButtonText: "string",
      singleSubmitButtonAlignment: [
        "enum",
        {
          values: ["left", "text-center", "text-end", "block"],
        },
      ],
      overscrollBehavior: ["enum",
        {
          values: ["default", "none"]
        }
      ],

      fixedFormHeight: "boolean",
      formHeight: "integer",
      scrollbarWidth: ["enum",
        {
          values: ["default", "thin", "none"]
        }
      ],
      creationData: "string",

    },
    extractTextAttributes: ["content"],
  },
);
