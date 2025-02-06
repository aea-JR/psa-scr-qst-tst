import { provideEditingConfig } from "scrivito";

provideEditingConfig("QuestionnaireStepWidget", {
  title: "Questionnaire Step",
  titleForContent: widget => {
    if (widget.get("isSingleStep")) {
      return "Single Step";
    }
    return "Step " + widget.get("stepNumber");
  },
  attributes: {
    content: {
      title: "Content"
    }
  },
  properties: ["content"]
});
