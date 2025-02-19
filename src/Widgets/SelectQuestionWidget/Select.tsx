import * as React from "react";
import * as Scrivito from "scrivito";
import { EXTERNAL_ID, IDENTIFIER, TEXT } from "../../constants/constants";
interface SelectProps {
	type: string;
	required: boolean;
	externalId: string; // externalId of the question
	values: string[];
	options: Scrivito.Widget[];
	onChange: (externalIds: string[], newValues: string[], identifiers?: string[]) => void
}
interface SelectItemProps {
	value: string;
	identifier: string;
	externalQuestionId: string;
	required: boolean;
	type: string;
	externalId: string;
	onChange: () => void;
	isChecked: boolean;
}

export const Select: React.FC<SelectProps> = Scrivito.connect(
	({ type, options, values, required, externalId, onChange }) => {
		const ref = React.useRef<HTMLDivElement>(null);

		const onChangeSelect = () => {
			if (!ref.current) { return; }
			const inputs = ref.current.getElementsByTagName("input");
			const inputArray = Array.from(inputs);
			const selectedValues: string[] = [];
			const selectedIdentifiers: string[] = [];
			const selectedExternalIds: string[] = [];
			inputArray.forEach((input) => {
				if (input.checked) {
					selectedValues.push(input.value);
					selectedIdentifiers.push(input.dataset.identifier || "");
					selectedExternalIds.push(input.id);
				}
			});

			onChange(selectedExternalIds, selectedValues, selectedIdentifiers);
		}

		return (
			<div ref={ref} className={`row`}>
				{options.map((option, index) => (
					<SelectItem
						type={type}
						externalQuestionId={externalId}
						value={option.get(TEXT) as string}
						identifier={option.get(IDENTIFIER) as string}
						externalId={option.get(EXTERNAL_ID) as string}
						required={required}
						key={index}
						onChange={onChangeSelect}
						isChecked={values.includes(option.get(TEXT) as string)}

					/>
				))}
			</div>
		);
	}

);

const SelectItem: React.FC<SelectItemProps> = ({
	value,
	identifier,
	type,
	externalQuestionId,
	externalId,
	required,
	onChange,
	isChecked
}: SelectItemProps) => {
	return (
		<label className={`select-label ${type}`}>
			<input
				className="form-check-input"
				name={externalQuestionId}
				id={externalId}
				required={required}
				type={
					type == "string_radio"
						? "radio"
						: "checkbox"
				}
				value={value}
				checked={isChecked}
				onChange={onChange}

				data-identifier={identifier}
				data-group={type == "string_radio"
					? null
					: externalQuestionId}
			/>
			<span>{value}</span>
		</label>
	);
};
