
import { isInPlaceEditingActive, provideComponent, Widget } from "scrivito";
import { QuestionnaireContainerWidget } from "./QuestionnaireContainerWidgetClass";
import { FormProvider } from "../../contexts/FormContext";
import { QuestionnaireWidgetAttributesProvider, useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { getFormClassNames } from "../../utils/getFormClassNames";
import { useQuestionnaireWidgetAttributes } from "../../hooks/useQuestionnaireWidgetAttributes";
import { Questionnaire } from "../../Components/Questionnaire/Questionnaire";
import "./QuestionnaireContainerWidget.scss";
import { PisaConnectionStatusProvider, usePisaConnectionStatusContext } from "../../contexts/PisaConnectionStatusContext";
import { QuestionnaireStepsProvider } from "../../contexts/QuestionnaireStepsContext";
import { useEditModeSync } from "./useEditModeSync";
import { useEffect, useState } from "react";
import { isQuestionnaireStructureValid } from "../../utils/isQuestionnaireStructureValid";
import { compareQuestionnaireMeta } from "../../utils/compareQuestionnaireMeta";
import { setQuestionnaireStatus } from "../../utils/questionnaireStatus";
import { isNil } from "../../utils/lodashPolyfills";
import { PisaDataClassProvider } from "../../contexts/PisaDataClassContext";
import { QuestionnaireStatus } from "../../types/questionnaire";

provideComponent(QuestionnaireContainerWidget, ({ widget }) => {
  const values = useQuestionnaireWidgetAttributes(widget);
  useEditModeSync(widget);

  return (
    <PisaDataClassProvider>
      <QuestionnaireWidgetAttributesProvider values={values}>
        <PisaConnectionStatusProvider>
          <QuestionnaireStepsProvider qstContainerWidget={widget}>
            <QuestionnaireContainerContent
              widget={widget}
            />
          </QuestionnaireStepsProvider>
        </PisaConnectionStatusProvider>
      </QuestionnaireWidgetAttributesProvider>
    </PisaDataClassProvider>
  );
});

const QuestionnaireContainerContent: React.FC<{
  widget: Widget;
}> = ({ widget }) => {
  const { questionnaireId, fixedFormHeight, formHeight, formOverscrollBehavior, formScrollbarWidth, containerClassNames } = useQuestionnaireWidgetAttributesContext();
  const isValid = isQuestionnaireStructureValid(widget);
  const hasChanges = compareQuestionnaireMeta(widget);
  const { isOnline } = usePisaConnectionStatusContext();
  const isCreated = !!questionnaireId;
  const [internalStatus, setInternalStatus] = useState<QuestionnaireStatus>("void");

  useEffect(() => {
    if (isNil(isOnline)) {
      setQuestionnaireStatus("unconfiguredUrl", widget);
      setInternalStatus("unconfiguredUrl");
      return;
    }
    if (!isOnline) {
      setQuestionnaireStatus("offline", widget);
      setInternalStatus("offline");
      return;
    }
    if (!isValid) {
      setQuestionnaireStatus("invalid", widget);
      setInternalStatus("invalid");
      return;
    }
    if (!isCreated) {
      setQuestionnaireStatus("creationPending", widget);
      setInternalStatus("creationPending");
      return;
    }
    if (hasChanges) {
      setQuestionnaireStatus("pendingUpdate", widget);
      setInternalStatus("pendingUpdate");
      return;
    }
    if (isCreated) {
      setQuestionnaireStatus("void", widget);
      setInternalStatus("void");
      return;
    }
  }, [isValid, hasChanges, isCreated, isOnline]);


  const formClassNames = getFormClassNames({
    fixedFormHeight,
    formOverscrollBehavior,
    formScrollbarWidth,
  });
  const containerStyle = fixedFormHeight ? { height: `${formHeight}em` } : {};

  return (
    <FormProvider qstContainerWidget={widget}>
      <div
        className={`pisa-questionnaire-widgets questionnaire-container-widget ${containerClassNames} ${formClassNames} ${isInPlaceEditingActive() ? "edit-mode" : ""
          }`}
        style={containerStyle}
      >
        <Questionnaire
          widget={widget}
          status={internalStatus}
        />
      </div>
    </FormProvider>
  );
};
