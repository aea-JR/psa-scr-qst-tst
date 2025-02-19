import { provideEditingConfig } from "scrivito";
import { CONTENT, IS_SINGLE_STEP, STEP_NUMBER } from "../../constants/constants";

provideEditingConfig("QuestionnaireStepWidget", {
  title: "PisaSales Questionnaire Step",
  titleForContent: widget => {
    if (widget.get(IS_SINGLE_STEP)) {
      return "Single Step";
    }
    return "Step " + widget.get(STEP_NUMBER);
  },
  attributes: {
    content: {
      title: "Content"
    }
  },
  properties: [CONTENT]
});
