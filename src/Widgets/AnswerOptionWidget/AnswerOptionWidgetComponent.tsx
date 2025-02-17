import "./AnswerOptionWidget.scss";
import { AnswerOptionWidget } from "./AnswerOptionWidgetClass";
import { useConditionContext } from "../../contexts/ConditionContext";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { useEffect } from "react";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import { useFormContext } from "../../contexts/FormContext";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";

provideComponent(AnswerOptionWidget, ({ widget }) => {

	const { getConditionData } = useConditionContext();
	const { setExcludedFromSubmit } = useFormContext();
	const data = getConditionData(widget.get("externalId"));
	const titleBgColor = useDynamicBackground(".condition-info");

	useEffect(() => {
		const { questionWidgets } = extractQuestionsAndOptions(widget)
		questionWidgets.forEach((question) => {
			const questionId = question.get("questionId") as string;
			setExcludedFromSubmit(questionId, !data.isActive);
		});
	}, [data.isActive]);

	if (!data.isActive && !isInPlaceEditingActive()) {
		return null;
	}

	return (
		<>
			<div className="condition-container">
				{isInPlaceEditingActive() && (
					<>
						{/* <QuestionnaireMessageBlock status="updating" /> */}
						<span className="condition-info" style={{ backgroundColor: titleBgColor || "transparent" }}>
							{"Condition: " + widget.get("text")}
						</span>
					</>
				)}
				<ContentTag
					content={widget}
					attribute="content"
					className={"condition-content"}
				/>

			</div>
		</>
	);
});
