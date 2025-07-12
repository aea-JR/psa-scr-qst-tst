import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { QuestionnaireStepWidget } from "./QuestionnaireStepWidgetClass";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import { CONTENT } from "../../constants/constants";
import { useFormContext } from "../../contexts/FormContext";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import "./QuestionnaireStepWidget.scss";

provideComponent(QuestionnaireStepWidget, ({ widget }) => {
  const { getStepInfo } = useQuestionnaireStepsContext();
  const data = getStepInfo(widget.id());
  const isMultiStepsWithActiveEditing = isInPlaceEditingActive() && !data.isSingleStep;
  const titleBgColor = useDynamicBackground(".step-preview-count")

  const ctx = useFormContext();
  if (!ctx) {
    return <QuestionnaireMessageBlock status="noContext" />
  }

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
          attribute={CONTENT}
        />
      </div>
    </>
  );
});
