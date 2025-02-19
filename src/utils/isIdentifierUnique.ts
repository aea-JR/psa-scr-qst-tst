import { Widget } from "scrivito";
import { isEmpty } from "lodash-es";
import { getIdentifier } from "./getIdentifier";
import { getQuestionnaireContainerWidget } from "./getQuestionnaireContainerWidget";
import { CONTENT } from "../constants/constants";

export function isIdentifierUnique(widget: Widget, type: string) {
  const identifier = getIdentifier(widget);
  if (isEmpty(identifier)) {
    return true;
  }

  const container =
    type == "AnswerOptionWidget"
      ? widget.container()
      : getQuestionnaireContainerWidget(widget);
  if (!container) {
    return true;
  }

  const otherWidget = (
    type == "AnswerOptionWidget"
      ? container.widgets()
      : (container.get(CONTENT) as Widget[])
  ).find(
    (child) =>
      getIdentifier(child) === identifier && child.id() !== widget.id(),
  );

  return !otherWidget;
}
