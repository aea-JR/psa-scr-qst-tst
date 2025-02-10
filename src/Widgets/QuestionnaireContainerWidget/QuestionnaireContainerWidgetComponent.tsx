
import { isInPlaceEditingActive, provideComponent, Widget } from "scrivito";
import { QuestionnaireContainerWidget } from "./QuestionnaireContainerWidgetClass";
import { FormProvider } from "../../contexts/FormContext";
import { QuestionnaireWidgetAttributesProvider, useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { getFormClassNames } from "../../utils/getFormClassNames";
import { useQuestionnaireWidgetAttributes } from "../../hooks/useQuestionnaireWidgetAttributes";
import { Questionnaire } from "../../Components/Questionnaire/Questionnaire";
import "./QuestionnaireContainerWidget.scss";
import { PisaStatusProvider, usePisaStatusContext } from "../../contexts/PisaStatusContext";
import { QuestionnaireStepsProvider } from "../../contexts/QuestionnaireStepsContext";
import { useEditModeSync } from "./useEditModeSync";
import { useEffect } from "react";
import { isQuestionnaireStructureValid } from "../../utils/isQuestionnaireStructureValid";
import { compareQuestionnaireMeta } from "../../utils/compareQuestionnaireMeta";
import { setQuestionnaireStatus } from "../../utils/questionnaireStatus";

provideComponent(QuestionnaireContainerWidget, ({ widget }) => {
  const values = useQuestionnaireWidgetAttributes(widget);
  useEditModeSync(widget);

  return (
    <QuestionnaireWidgetAttributesProvider values={values}>
      <PisaStatusProvider>
        <QuestionnaireStepsProvider qstContainerWidget={widget}>
          <QuestionnaireContainerContent
            widget={widget}
          />
        </QuestionnaireStepsProvider>
      </PisaStatusProvider>
    </QuestionnaireWidgetAttributesProvider>
  );
});

const QuestionnaireContainerContent: React.FC<{
  widget: Widget;
}> = ({ widget }) => {
  const { questionnaireId, fixedFormHeight, formHeight, formOverscrollBehavior, formScrollbarWidth, containerClassNames } = useQuestionnaireWidgetAttributesContext();
  const isValid = isQuestionnaireStructureValid(widget);
  const hasChanges = compareQuestionnaireMeta(widget);
  const { isOnline } = usePisaStatusContext();
  const isCreated = !!questionnaireId;

  useEffect(() => {
    if (!isOnline) {
      setQuestionnaireStatus("offline", widget);
      return;
    }
    if (!isValid) {
      setQuestionnaireStatus("invalid", widget);
      return;
    }
    if (!isCreated) {
      setQuestionnaireStatus("creationPending", widget);
      return;
    }
    if (hasChanges) {
      setQuestionnaireStatus("pendingUpdate", widget);
      return;
    }
    if (isCreated) {
      setQuestionnaireStatus("void", widget);
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
        />
      </div>
    </FormProvider>
  );
};
