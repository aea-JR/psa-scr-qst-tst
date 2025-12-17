import { ContentTag, isInPlaceEditingActive } from "scrivito";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { CONTENT } from "../../constants/constants";
import { useFormContext } from "../../contexts/FormContext";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";

const QuestionnaireStepWidgetContent = ({ widget }: { widget: any }) => {
  const { getStepInfo } = useQuestionnaireStepsContext();
  const data = getStepInfo(widget.id());
  const isMultiStepsWithActiveEditing = isInPlaceEditingActive() && !data.isSingleStep;
  const titleBgColor = useDynamicBackground(".step-preview-count");

  const ctx = useFormContext();
  if (!ctx) {
    return <QuestionnaireMessageBlock status="noFormContext" />;
  }

  return (
    <>
      {isMultiStepsWithActiveEditing && (
        <span className="step-preview-count" style={{ backgroundColor: titleBgColor || "transparent" }}>
          {"Step " + data.stepNumber}
        </span>
      )}
      <div
        className={`step-container  ${
          isMultiStepsWithActiveEditing ? "step-border" : data.isActive || data.isSingleStep ? "" : "hide"
        }`}
        data-step-number={data.stepNumber}
      >
        <ContentTag content={widget} attribute={CONTENT} />
      </div>
    </>
  );
};

export default QuestionnaireStepWidgetContent;
