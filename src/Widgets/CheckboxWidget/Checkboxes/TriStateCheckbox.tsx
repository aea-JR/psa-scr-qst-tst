
import { FC, useEffect, useState } from "react";
import { ContentTag, Widget } from "scrivito";
import { Mandatory } from "../../../Components/Mandatory/Mandatory";
import { HelpText } from "../../../Components/HelpText/HelpText";
import { useAnswer } from "../../../hooks/useAnswer";
import { TEXT } from "../../../constants/constants";
import { useValidationField } from "../../../hooks/useValidationField";

interface TriStateCheckboxProps {
	required: boolean;
	externalId: string;
	questionId: string;
	identifier: string;
	help: string;
	widget: Widget;
	defaultValue: string;
	alignment: string;
	validationText: string;
}

const TRUE = "true";
const FALSE = "false";
const UNSET = "unset";
type CheckboxState = typeof TRUE | typeof FALSE | typeof UNSET;

export const TriStateCheckbox: FC<TriStateCheckboxProps> = ({
	required,
	externalId,
	questionId,
	identifier,
	help,
	widget,
	defaultValue,
	alignment,
	validationText
}) => {
	const id = `form_checkbox_widget_${externalId}`;

	const { values, handleChange } = useAnswer(questionId, [defaultValue], [identifier]);

	const { isLocallyValid, setIsLocallyValid, ref } = useValidationField(externalId, required)!;
	const isInvalid = !isLocallyValid;


	const getInitialState = (): CheckboxState => {
		if (values[0] === TRUE) return TRUE;
		if (values[0] === FALSE) return FALSE;
		return UNSET;
	};

	const [checkboxState, setCheckboxState] = useState<CheckboxState>(getInitialState());

	useEffect(() => {
		setCheckboxState(getInitialState());
	}, [values]);

	const getNextState = (currentState: string): CheckboxState => {
		switch (currentState) {
			case UNSET:
				return TRUE;
			case TRUE:
				return FALSE;
			case FALSE:
				return UNSET;
			default:
				return UNSET;
		}
	};

	const onChangeCheckbox = () => {
		const newState = getNextState(checkboxState);
		setCheckboxState(newState);
		required && setIsLocallyValid(newState != UNSET);
		handleChange([newState]);
	};

	return (
		<div ref={ref} className={`mb-3 checkbox-container ${alignment}`}>
			<input
				className={`form-check-input ${checkboxState === UNSET ? "unset" : ""} ${isInvalid ? "is-invalid" : ""}`}
				id={id}
				type="checkbox"
				data-tristate={checkboxState}
				name={externalId}
				checked={checkboxState === TRUE}
				onChange={onChangeCheckbox}
			/>
			<label className="form-check-label" htmlFor={id}>
				<ContentTag attribute={TEXT} content={widget} tag="p" />
				{required && <Mandatory />}
				{help && <HelpText widget={widget} />}
			</label>
			{isInvalid && <div className={`invalid-feedback ${alignment}`}>
				{validationText}
			</div>}
		</div>
	);
};