
import { ChangeEvent, FC, useEffect, useState } from "react";
import { ContentTag, Widget } from "scrivito";
import { Mandatory } from "../../../Components/Mandatory/Mandatory";
import { HelpText } from "../../../Components/HelpText/HelpText";
import { useAnswer } from "../../../hooks/useAnswer";
import { TEXT } from "../../../constants/constants";
import { useValidationField } from "../../../hooks/useValidationField";


interface SingleCheckboxProps {
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

export const SingleCheckbox: FC<SingleCheckboxProps> = ({
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
	const id = `form_checkbox_widget_${widget.id()}`;
	const { values, handleChange } = useAnswer(questionId, [defaultValue], [identifier]);
	const [isChecked, setIsChecked] = useState(values[0] === TRUE);
	const { isLocallyValid, setIsLocallyValid, ref } = useValidationField(externalId, required)!;
	const isInvalid = !isLocallyValid;

	useEffect(() => {
		setIsChecked(values[0] === TRUE);
	}, [values]);

	const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.checked ? TRUE : FALSE;
		setIsChecked(e.target.checked);
		required && setIsLocallyValid(e.target.checked);
		handleChange([newValue]);
	};

	return (
		<div ref={ref} className={`mb-3 checkbox-container ${alignment}`}>
			<input
				className={`form-check-input ${isInvalid ? "is-invalid" : ""}`}
				id={id}
				type="checkbox"
				name={externalId}
				checked={isChecked}
				onChange={onChangeCheckbox}
			/>
			<label className="form-check-label" htmlFor={id}>
				<ContentTag content={widget} attribute={TEXT} tag="p" />
				{required && <Mandatory />}
				{help && <HelpText widget={widget} />}
			</label>
			{isInvalid && <div className={`invalid-feedback ${alignment}`}>
				{validationText}
			</div>}
		</div>
	);
};