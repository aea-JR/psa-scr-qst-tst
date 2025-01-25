import { Widget } from "scrivito";

export function getQuestionnaireContainerWidget(
  childWidget: Widget,
): Widget | null {
  let candidate = childWidget.container();
  while (candidate instanceof Widget) {
    const objClass = candidate.objClass();
    if (objClass === "QuestionnaireContainerWidget") {
      return candidate;
    }
    candidate = candidate.container();
  }

  return null;
}
