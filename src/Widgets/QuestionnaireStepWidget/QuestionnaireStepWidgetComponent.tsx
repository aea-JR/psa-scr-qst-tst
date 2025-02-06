import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { QuestionnaireStepWidget } from "./QuestionnaireStepWidgetClass";
import "./QuestionnaireStepWidget.scss";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";

provideComponent(QuestionnaireStepWidget, ({ widget }) => {
  const { getStepInfo } = useQuestionnaireStepsContext();
  const data = getStepInfo(widget.id());
  const isMultiStepsWithActiveEditing = isInPlaceEditingActive() && !data.isSingleStep;
  //TODO: improve or remove step preview
  return (
    <>
      {/* {isMultiStepsWithActiveEditing && (
        <span className="step-preview-count">{"Step " + data.stepNumber}</span>
      )} */}
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
