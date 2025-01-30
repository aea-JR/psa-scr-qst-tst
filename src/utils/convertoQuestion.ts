import { Widget } from "scrivito";
import { Question } from "../types/questionnaire";

export const convertWidgetToQuestion = (
  widget: Widget,
): Question => {
  const externalId = widget.get("externalId") as string;
  const text = widget.get("title") as string;
  const type = widget.get("type") as string;
  const mandatory = widget.get("required") as boolean;
  const help = widget.get("helpText") as string;
  const defaultValue = widget.get("defaultValue") as string;
  const identifier = widget.get("identifier") as string;
  const position = widget.get("position") as number;

  return {
    externalId,
    text,
    type,
    mandatory,
    help,
    defaultValue,
    identifier,
    position
  };
};