import { Widget } from "scrivito";
import { QUESTIONNNAIRE_CONTAINER_WIDGET } from "../constants/constants";

export function getQuestionnaireContainerWidget(
  childWidget: Widget,
): Widget | null {
  let candidate = childWidget.container();
  while (candidate instanceof Widget) {
    const objClass = candidate.objClass();
    if (objClass === QUESTIONNNAIRE_CONTAINER_WIDGET) {
      return candidate;
    }
    candidate = candidate.container();
  }

  return null;
}
