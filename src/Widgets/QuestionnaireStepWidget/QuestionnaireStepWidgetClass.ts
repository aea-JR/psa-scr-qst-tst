import { provideWidgetClass } from "scrivito";

export const QuestionnaireStepWidget = provideWidgetClass("QuestionnaireStepWidget", {
  onlyInside: "QuestionnaireContainerWidget",
  attributes: {
    content: "widgetlist",
    stepNumber: "integer",
    isSingleStep: "boolean"
  }
});
