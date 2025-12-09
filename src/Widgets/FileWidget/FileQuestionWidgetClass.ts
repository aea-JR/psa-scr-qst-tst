import { provideWidgetClass } from "scrivito";
import { defaultQuestionAttributes } from "../defaultQuestionAttributes";
import { DOCUMENT_MULTI, DOCUMENT_SINGLE, QUESTIONNNAIRE_FILE_QUESTION_WIDGET } from "../../constants/constants";

export const QuestionnaireFileQuestionWidget = provideWidgetClass(
  QUESTIONNNAIRE_FILE_QUESTION_WIDGET,
  {
    attributes: {
      ...defaultQuestionAttributes,
      type: ["enum", { values: [DOCUMENT_SINGLE, DOCUMENT_MULTI] }],
      selectButtonText: "string",
      fileAccept: "string",
      fileTooLargeTextSingle: "string",
      fileTooLargeTextMulti: "string",
      fileTypeRejectTextSingle: "string",
      fileTypeRejectTextMulti: "string"
    },
  }
);
