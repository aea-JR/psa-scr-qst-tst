import "./AnswerOptionWidget.scss";
import { AnswerOptionWidget } from "./AnswerOptionWidgetClass";
import { useConditionContext } from "../../contexts/ConditionContext";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { useEffect, useState } from "react";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import { useFormContext } from "../../contexts/FormContext";

provideComponent(AnswerOptionWidget, ({ widget }) => {

	const { getConditionData } = useConditionContext();
	const { onChange } = useFormContext();
	const data = getConditionData(widget.get("externalId"));
	const titleBgColor = useDynamicBackground(".condition-info");

	if (!data.isActive && !isInPlaceEditingActive()) {
		// reset all questios inside content attr. 
		// getall with widget.get("content").widgets()
		//or try extractQuestions with it. 
		//	onChange()
		return null;
	}
	//   const resetFieldsInConditions = (conditions: Scrivito.Widget[]) => {
	//     // const resetFields = conditions
	//     //   .flatMap(condition => condition.get("content") as Scrivito.Widget[])
	//     //   .map(widget => getFieldName(widget))
	//     //   .filter(fieldName => !isEmpty(fieldName))
	//     //   .reduce((acc, fieldName) => {
	//     //     acc[fieldName] = "";
	//     //     return acc;
	//     //   }, {} as StringMap<string>);

	//     // onInputChange(resetFields);
	//   };
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
