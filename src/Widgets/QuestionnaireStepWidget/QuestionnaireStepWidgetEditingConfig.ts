import { provideEditingConfig } from "scrivito";
import { CONTENT, IS_SINGLE_STEP, QUESTIONNNAIRE_STEP_WIDGET, STEP_NUMBER } from "../../constants/constants";
import stepThumbnail from "../../assets/images/crm-questionnaire-step.svg";
import { insideQuestionnaireContainerValidation } from "../../utils/validations/insideQuestionnaireContainerValidation";

provideEditingConfig(QUESTIONNNAIRE_STEP_WIDGET, {
  thumbnail: stepThumbnail,
  title: "Questionnaire Step",
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
  properties: [CONTENT],
  validations: [
    insideQuestionnaireContainerValidation
  ]
});
