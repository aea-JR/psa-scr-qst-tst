import * as React from "react";
import * as Scrivito from "scrivito";
import "./AnswerOptionWidget.scss";
import { useFormContext } from "../../contexts/FormContext";
import { AnswerOptionWidget } from "./AnswerOptionWidgetClass";
import { isEmpty } from "lodash-es";
//import { useQuestionnaireCreation } from "../../contexts/QuestionnaireCreationContext";
import { useEffect } from "react";
import { useExternalId } from "../../hooks/useExternalId";
import { Question } from "../../types/questionnaire";
import { DropdownOption } from "../../Components/DropdownOption";

Scrivito.provideComponent(AnswerOptionWidget, ({ widget }) => {
	const id = `questionnaire_dropdown_widget_${widget.id()}`;

	const text = widget.get("text");
	const identifier = widget.get("identifier");
	const type = widget.get("type");
	const { onChange } = useFormContext();
	//const { registerOrUpdateQuestion, unregisterQuestion } = useQuestionnaireCreation();

	useExternalId(widget);



	if (type == "dropdown") {
		console.log("retruning dropdpwn")
		return (
			//	<span> An Answer Option of type:  </span>
			<DropdownOption value={text} id={identifier} key={identifier} identifier={identifier} />

		);
	}

	return (
		<p>
			<span> An Answer Option of type:  </span>
			{type}
		</p>
	);
});
