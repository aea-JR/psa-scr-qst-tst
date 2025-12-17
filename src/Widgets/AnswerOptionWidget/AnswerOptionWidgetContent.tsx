import { useEffect } from "react";
import { ContentTag, isInPlaceEditingActive } from "scrivito";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { CONTENT, EXTERNAL_ID, QUESTION_ID, TEXT } from "../../constants/constants";
import { useConditionContext } from "../../contexts/ConditionContext";
import { useFormContext } from "../../contexts/FormContext";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";

const AnswerOptionWidgetContent = ({ widget }: { widget: any }) => {
  const { getConditionData } = useConditionContext();
  const context = useFormContext();
  const data = getConditionData(widget.get(EXTERNAL_ID));
  const titleBgColor = useDynamicBackground(".condition-info");

  useEffect(() => {
    const { questionWidgets } = extractQuestionsAndOptions(widget);
    questionWidgets.forEach((question) => {
      const questionId = question.get(QUESTION_ID) as string;
      context?.setExcludedFromSubmit(questionId, !data.isActive);
    });
  }, [data.isActive]);

  if (!context) {
    return <QuestionnaireMessageBlock status="noFormContext" />;
  }
  if (!data.isActive && !isInPlaceEditingActive()) {
    return null;
  }

  return (
    <div className="condition-container">
      {isInPlaceEditingActive() && (
        <span className="condition-info" style={{ backgroundColor: titleBgColor || "transparent" }}>
          {"Condition: " + widget.get(TEXT)}
        </span>
      )}
      <ContentTag content={widget} attribute={CONTENT} className={"condition-content"} />
    </div>
  );
};

export default AnswerOptionWidgetContent;
