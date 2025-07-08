import { Widget } from "scrivito";
import { isEmpty } from "./lodashPolyfills";
import { getIdentifier } from "./getIdentifier";
import { getQuestionnaireContainerWidget } from "./getQuestionnaireContainerWidget";
import { CONTENT, STEPS } from "../constants/constants";
type WidgetType = "option" | "question";
export function isIdentifierUnique(widget: Widget, type: WidgetType) {
  const identifier = getIdentifier(widget);
  if (isEmpty(identifier)) {
    return true;
  }
  return type === "option"
    ? isOptionIdentifierUnique(identifier, widget)
    : isQuestionIdentifierUnique(identifier, widget);
}

const isOptionIdentifierUnique = (identifier: string, widget: Widget) => {
  const container = widget.container();
  if (!container) {
    return true;
  }
  return !container.widgets().some(
    (child) => getIdentifier(child) === identifier && child.id() !== widget.id()
  );
};

const isQuestionIdentifierUnique = (identifier: string, widget: Widget) => {
  const container = getQuestionnaireContainerWidget(widget);
  if (!container) {
    return true;
  }
  const steps = container.get(STEPS) as Widget[];
  if (isEmpty(steps)) {
    return true;
  }
  const questions = steps.flatMap((step) => step.get(CONTENT) as Widget[]);

  return !questions.some(
    (child) => getIdentifier(child) === identifier && child.id() !== widget.id()
  );
};