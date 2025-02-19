import { Widget } from "scrivito";
import { Question } from "../types/questionnaire";
import { DEFAULT_VALUE, EXTERNAL_ID, HELP, IDENTIFIER, MANDATORY, POSITION, TEXT, TYPE } from "../constants/constants";

export const convertWidgetToQuestion = (
  widget: Widget,
): Question => {
  const externalId = widget.get(EXTERNAL_ID) as string;
  const text = widget.get(TEXT) as string;
  const type = widget.get(TYPE) as string;
  const mandatory = widget.get(MANDATORY) as boolean;
  const help = widget.get(HELP) as string;
  const defaultValue = widget.get(DEFAULT_VALUE) as string;
  const identifier = widget.get(IDENTIFIER) as string;
  const position = widget.get(POSITION) as number;

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