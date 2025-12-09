import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { defaultAttributes, defaultInitialContent, defaultValidations } from "../defaultQuestionEditingConfig";
import { ALIGNMENT, FILE_ACCEPT, FILE_TOO_LARGE_TEXT_MULTI, FILE_TOO_LARGE_TEXT_SINGLE, FILE_TYPE_REJECT_TEXT_MULTI, FILE_TYPE_REJECT_TEXT_SINGLE, EXTERNAL_ID, HELP, IDENTIFIER, IS_BEING_COPIED, MANDATORY, POSITION, QUESTION_ID, SELECT_BUTTON_TEXT, TEXT, TYPE, VALIDATION_TEXT, DOCUMENT_SINGLE, DOCUMENT_MULTI, QUESTIONNNAIRE_FILE_QUESTION_WIDGET } from "../../constants/constants";
import fileThumbnail from "../../assets/images/crm-questionnaire-upload.svg";
import { insideQuestionnaireContainerValidation } from "../../utils/validations/insideQuestionnaireContainerValidation";

Scrivito.provideEditingConfig(QUESTIONNNAIRE_FILE_QUESTION_WIDGET, {
  initialize: (obj) => {
    if (!obj.get(EXTERNAL_ID)) {
      obj.update({ externalId: generateId() });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);
    if (parent && parent.get(IS_BEING_COPIED)) {
      return;
    }
    child.update({ externalId: generateId(), questionId: null });
  },
  thumbnail: fileThumbnail,
  title: "Questionnaire File Upload Question",
  attributes: {
    ...defaultAttributes,
    type: {
      title: "Upload Type",
      values: [
        { value: DOCUMENT_SINGLE, title: "Single file" },
        { value: DOCUMENT_MULTI, title: "Multiple files" },
      ],
    },
    selectButtonText: { title: "Select Button text" },
    fileAccept: {
      title: "Allowed file types",
      description: "Comma-separated list of extensions and/or MIME patterns to restrict the file picker. Examples: '.png,.jpg,.pdf' or 'image/*,.pdf'. Leave empty to allow all types.",
    },
    fileTooLargeTextSingle: {
      title: "Message for oversized file (Maximum 8 MB)",
      description: "Shown when the selected file exceeds the maximum size.",
    },
    fileTooLargeTextMulti: {
      title: "Message for oversized files (Maximum 8 MB)",
      description: "Shown when one or more selected files exceed the maximum size; the failed filenames will be listed after this text. Example: 'The following files exceed 8 MB and were skipped: sample. mp3, image. png'",
    },
    fileTypeRejectTextSingle: {
      title: "Message for disallowed type",
      description: "Shown when the selected file type isn't allowed by 'Allowed file types'. Example: 'Selected file type is not allowed.'",
    },
    fileTypeRejectTextMulti: {
      title: "Message for disallowed types",
      description: "Shown when one or more selected files are not allowed by 'Allowed file types'; the failed filenames will be listed after this text. Example: 'The following files are not allowed and were skipped:'",
    },
    alignment: { title: "Alignment" },
  },
  initialContent: {
    ...defaultInitialContent,
    type: DOCUMENT_SINGLE,
    selectButtonText: "Choose file",
    validationText: "Please select a file",
    fileAccept: "",
    fileTooLargeTextMulti: "The following files exceed 8 MB and were skipped:",
    fileTooLargeTextSingle: "Selected file exceeds 8 MB and was skipped.",
    fileTypeRejectTextMulti: "The following files are not allowed and were skipped:",
    fileTypeRejectTextSingle: "Selected file type is not allowed."
  },
  properties: (widget) => [
    TEXT,
    HELP,
    IDENTIFIER,
    MANDATORY,
    [POSITION, { enabled: false }],
    TYPE,
    SELECT_BUTTON_TEXT,
    FILE_ACCEPT,
    getTypeRejectMessageProp(widget),
    getTooLargeMessageProp(widget),
    ALIGNMENT,
    VALIDATION_TEXT,
    [EXTERNAL_ID, { enabled: false }],
    [QUESTION_ID, { enabled: false }],
  ],
  validations: [
    ...defaultValidations,
    insideQuestionnaireContainerValidation,
  ],
});
const getTooLargeMessageProp = ((widget: Scrivito.Widget) => {
  return widget.get(TYPE) === DOCUMENT_SINGLE ? FILE_TOO_LARGE_TEXT_SINGLE : FILE_TOO_LARGE_TEXT_MULTI
})

const getTypeRejectMessageProp = ((widget: Scrivito.Widget) => {
  return widget.get(TYPE) === DOCUMENT_SINGLE ? FILE_TYPE_REJECT_TEXT_SINGLE : FILE_TYPE_REJECT_TEXT_MULTI
})
