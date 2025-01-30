
import { isInPlaceEditingActive, load, provideComponent, Widget } from "scrivito";
import { QuestionnaireContainerWidget } from "./QuestionnaireContainerWidgetClass";
import { FormProvider } from "../../contexts/FormContext";
import { QuestionnaireWidgetAttributesProvider, useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { getFormClassNames } from "../../utils/getFormClassNames";
import { useQuestionnaireWidgetAttributes } from "../../hooks/useQuestionnaireWidgetAttributes";
import { Questionnaire } from "../../Components/Questionnaire/Questionnaire";
import "./QuestionnaireContainerWidget.scss";
import { PisaStatusProvider } from "../../contexts/PisaStatusContext";
import { useEffect } from "react";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { each } from "lodash-es";

provideComponent(QuestionnaireContainerWidget, ({ widget }) => {
  const values = useQuestionnaireWidgetAttributes(widget);

  const { questionWidgets } = extractQuestionsAndOptions(widget);
  useEffect(() => {
    if (!isInPlaceEditingActive()) {
      return;
    }
    each(questionWidgets, (question, index) => {
      const isDifferent = question.get("position") as number !== (index + 1) * 10;
      isDifferent && question.update({ position: (index + 1) * 10 })
    });
  }, [widget.get("content")]);

  return (
    <QuestionnaireWidgetAttributesProvider values={values}>
      <PisaStatusProvider>
        <QuestionnaireContainerContent
          widget={widget}
        />
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
