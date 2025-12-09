import { provideWidgetClass } from "scrivito";
import { QUESTIONNNAIRE_CONTAINER_WIDGET, QUESTIONNNAIRE_STEP_WIDGET } from "../../constants/constants";

export const QuestionnaireStepWidget = provideWidgetClass(QUESTIONNNAIRE_STEP_WIDGET, {
  onlyInside: QUESTIONNNAIRE_CONTAINER_WIDGET,
  attributes: {
    content: "widgetlist",
    stepNumber: "integer",
    isSingleStep: "boolean"
  }
});
