import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { QuestionnaireStepWidget } from "./QuestionnaireStepWidgetClass";
import "./QuestionnaireStepWidget.scss";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";

provideComponent(QuestionnaireStepWidget, ({ widget }) => {
  const { getStepInfo } = useQuestionnaireStepsContext();
  const data = getStepInfo(widget.id());
  const isMultiStepsWithActiveEditing = isInPlaceEditingActive() && !data.isSingleStep;
  const titleBgColor = useDynamicBackground(".step-preview-count")
  //TODO: improve or remove step preview
  return (
    <>
      {isMultiStepsWithActiveEditing && (
        <span className="step-preview-count" style={{ backgroundColor: titleBgColor || "transparent" }}>{"Step " + data.stepNumber}</span>
      )}
      <div
        className={`step-container  ${isMultiStepsWithActiveEditing ? "step-border" : data.isActive || data.isSingleStep ? "" : "hide"}`}
        data-step-number={data.stepNumber}
      >
        <ContentTag
          content={widget}
          attribute="content"
        />
      </div>
    </>
  );
});
