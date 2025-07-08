import { Widget } from "scrivito";
import { AnswerOption } from "../types/questionnaire";
import { isEmpty } from "./lodashPolyfills";
import { EXTERNAL_ID, IDENTIFIER, POSITION, TEXT } from "../constants/constants";

export const convertWidgetsToAnswerOptions = (
  widgets: Widget[],
): AnswerOption[] => {
  if (isEmpty(widgets)) {
    return [];
  }
  const answerOptions: AnswerOption[] = [];
  for (const widget of widgets) {
    if (widget.objClass() !== "QuestionnaireAnswerOptionWidget") {
      console.warn(
        `${widget.objClass()} with ID ${widget.id()} can not be converted to an AnswerOption.`,
      );
      continue;
    }
    const option = convertWidgetToAnswerOption(widget);
    answerOptions.push(option);
  }
  return answerOptions;
};

export const convertWidgetToAnswerOption = (widget: Widget): AnswerOption => {
  return {
    text: widget.get(TEXT) as string,
    identifier: widget.get(IDENTIFIER) as string,
    externalId: widget.get(EXTERNAL_ID) as string,
    position: widget.get(POSITION) as number
  }
}