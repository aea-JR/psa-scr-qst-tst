import { Widget } from "scrivito";
import { getQuestionnaireContainerWidget } from "../getQuestionnaireContainerWidget";

export const insideQuestionnaireContainerValidation = (widget: Widget): string => {
  if (!getQuestionnaireContainerWidget(widget)) {
    return "Needs to be inside a Questionnaire.";
  }
  return "";
}
