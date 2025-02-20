
import { ChangeEvent, FC, useEffect, useState } from "react";
import { ContentTag, Widget } from "scrivito";
import { Mandatory } from "../../../Components/Mandatory/Mandatory";
import { HelpText } from "../../../Components/HelpText/HelpText";
import { useAnswer } from "../../../hooks/useAnswer";
import { TEXT } from "../../../constants/constants";


interface SingleCheckboxProps {
	required: boolean;
	externalId: string;
	questionId: string;
	identifier: string;
	help: string;
	widget: Widget;
	defaultValue: string;
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
	defaultValue
}) => {
	const id = `form_checkbox_widget_${widget.id()}`;
	const { values, handleChange } = useAnswer(questionId, [defaultValue], [identifier]);
	const [isChecked, setIsChecked] = useState(values[0] === TRUE);

	useEffect(() => {
		setIsChecked(values[0] === TRUE);
	}, [values]);

	const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.checked ? TRUE : FALSE;
		setIsChecked(e.target.checked);
		handleChange([newValue]);
	};

	return (
		<div className="mb-3">
			<input
				className="form-check-input"
				id={id}
				type="checkbox"
				name={externalId}
				required={required}
				checked={isChecked}
				onChange={onChangeCheckbox}
			/>
			<label className="form-check-label" htmlFor={id}>
				<ContentTag content={widget} attribute={TEXT} tag="span" />
				{required && <Mandatory />}
				{help && <HelpText widget={widget} />}
			</label>
		</div>
	);
};