import * as Scrivito from "scrivito";
import { isEmpty } from "lodash-es";
import generateId from "../../utils/idGenerator";
import { QUESTIONNAIRE_ID } from "../../constants/constants";
import { initialQuestionnaireContent } from "./editing/initialContent";
import { questionnaireContainerEditingValidations } from "./editing/validations";
import { questionnaireEditingAttributes } from "./editing/attributes";
import { questionnaieEditingProperties, questionnaireEditingPropertiesGroups } from "./editing/properties";

Scrivito.provideEditingConfig("QuestionnaireContainerWidget", {
  initializeCopy: (container) => initializeQstContainerCopy(container),
  title: "PisaSales Questionnaire",

  attributes: questionnaireEditingAttributes,
  properties: (widget) => questionnaieEditingProperties(widget) as any,
  propertiesGroups: (widget) => questionnaireEditingPropertiesGroups(widget) as any,

  initialContent: initialQuestionnaireContent,
  validations: questionnaireContainerEditingValidations
});

const initializeQstContainerCopy = (qstContainerWidget: Scrivito.Widget) => {
  console.log("Copying container");
  if (isEmpty(qstContainerWidget.get(QUESTIONNAIRE_ID))) {
    console.log("QST not yet created, will not mark as copied!")
    qstContainerWidget.update({ externalId: generateId() });
    return;
  }
  // Mark that the container is being copied
  qstContainerWidget.update({ isBeingCopied: true });
  setTimeout(() => {
    qstContainerWidget.update({ isBeingCopied: false });
  }, 0);

}