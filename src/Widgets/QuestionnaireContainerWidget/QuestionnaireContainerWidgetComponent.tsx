
import { useEffect } from "react";
import { isInPlaceEditingActive, provideComponent, Widget } from "scrivito";
import { QuestionnaireContainerWidget } from "./QuestionnaireContainerWidgetClass";
import { FormProvider } from "../../contexts/FormContext";
import { QuestionnaireWidgetAttributesProvider, useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { getFormClassNames } from "../../utils/getFormClassNames";
import { useQuestionnaireWidgetAttributes } from "../../hooks/useQuestionnaireWidgetAttributes";
import { Questionnaire } from "../../Components/Questionnaire/Questionnaire";
import "./QuestionnaireContainerWidget.scss";
import { PisaStatusProvider } from "../../contexts/PisaStatusContext";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { each } from "lodash-es";
import { QuestionnaireStepsProvider } from "../../contexts/QuestionnaireStepsContext";

provideComponent(QuestionnaireContainerWidget, ({ widget }) => {
  const values = useQuestionnaireWidgetAttributes(widget);
  const isSingleStep = values.formType == "single-step";
  const stepsLength = widget.get("steps").length
  const { questionWidgets } = extractQuestionsAndOptions(widget);

  useEffect(() => {
    if (!isInPlaceEditingActive()) {
      return;
    }
    each(questionWidgets, (question, index) => {
      const isDifferent = question.get("position") as number !== (index + 1) * 10;
      isDifferent && question.update({ position: (index + 1) * 10 })
    });
  }, [widget.get("steps")]);

  useEffect(() => {
    if (!isInPlaceEditingActive()) {
      return;
    }
    const steps = widget.get("steps") as Widget[];
    steps.forEach((step, i) => {
      const stepNumber = i + 1;
      step.update({
        stepNumber: stepNumber,
        isSingleStep: isSingleStep
      });
    });
    if (stepsLength > 1 && isSingleStep) {
      widget.update({ formType: "multi-step" });
    } else if (stepsLength == 1 && !isSingleStep) {
      widget.update({ formType: "single-step" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget.get("steps")]);

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
  const { fixedFormHeight, formHeight, formOverscrollBehavior, formScrollbarWidth, containerClassNames } = useQuestionnaireWidgetAttributesContext();

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
