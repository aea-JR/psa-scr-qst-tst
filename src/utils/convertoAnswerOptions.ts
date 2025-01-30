import { Widget } from "scrivito";
import { Answer, AnswerOption } from "../types/questionnaire";
import { isEmpty } from "lodash-es";

export const convertWidgetsToAnswerOptions = (
  widgets: Widget[],
): AnswerOption[] => {
  if (isEmpty(widgets)) {
    return [];
  }
  const answerOptions: AnswerOption[] = [];
  for (const widget of widgets) {
    if (widget.objClass() !== "AnswerOptionWidget") {
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
    text: widget.get("text") as string,
    identifier: widget.get("identifier") as string,
    externalId: widget.get("externalId") as string,
    position: widget.get("position") as number
  }
}