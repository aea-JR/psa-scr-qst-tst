import { Widget } from "scrivito";
import { AnswerOption } from "../types/questionnaire";
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
    const option: AnswerOption = {
      text: widget.get("text") as string,
      identifier: widget.get("identifier") as string,
      externalId: widget.get("externalId") as string,
    };
    answerOptions.push(option);
  }
  return answerOptions;
};
