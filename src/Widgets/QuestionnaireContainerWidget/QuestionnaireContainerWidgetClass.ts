import { provideWidgetClass } from "scrivito";
import { ONCE_UPDATABLE, QUESTIONNNAIRE_CONTAINER_WIDGET, QUESTIONNNAIRE_STEP_WIDGET, REPEATABLE } from "../../constants/constants";

export const QuestionnaireContainerWidget = provideWidgetClass(
  QUESTIONNNAIRE_CONTAINER_WIDGET,
  {
    attributes: {
      title: "string",
      steps: ["widgetlist", { only: QUESTIONNNAIRE_STEP_WIDGET }],
      externalId: "string",
      questionnaireId: "string",
      inputType: [
        "enum",
        {
          values: [REPEATABLE, ONCE_UPDATABLE],
        },
      ],
      activityIdSource: [
        "enum",
        {
          values: ["manual", "data-item",],
        },
      ],
      activityIdDataItemField: "string",
      activityIdDataItemFieldValue: "string",
      activityId: "string",
      projectIdSource: [
        "enum",
        {
          values: ["manual", "data-item",],
        },
      ],
      projectIdDataItemField: "string",
      projectIdDataItemFieldValue: "string",
      projectId: "string",
      contactIdSource: [
        "enum",
        {
          values: ["manual", "data-item"],
        },
      ],
      contactIdDataItemField: "string",
      contactIdDataItemFieldValue: "string",
      contactId: "string",
      customClassNames: "string",
      isBeingCopied: "boolean",
      showReview: "boolean",
      includeEmptyAnswers: "boolean",
      showStepsInReview: "boolean",
      showReviewHeader: "boolean",
      showReviewFooter: "boolean",
      reviewButtonText: "string",
      reviewHeaderTitle: "string",
      reviewCloseButtonText: "string",
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
      questionnaireStatus: "string",
      location: "string",

      buttonsSize: [
        "enum",
        {
          values: ["btn-sm", "btn-md", "btn-lg"]
        }
      ],
      buttonsStyle: [
        "enum",
        {
          values: ["btn-primary", "btn-secondary"]
        }
      ],
    },
    extractTextAttributes: ["steps"],
  },
);
