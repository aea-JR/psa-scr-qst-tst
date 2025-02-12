import * as React from "react";
import * as Scrivito from "scrivito";
interface SelectProps {
	type: string;
	required: boolean;
	widget: Scrivito.Widget;
	externalId: string;
	values: string[];
	options: Scrivito.Widget[];
	onChange: (newValues: string[], identifiers?: string[]) => void
}
interface SelectItemProps {

	value: string;
	identifier: string;
	externalId: string;
	required: boolean;
	type: string;
	onChange: () => void;
	isChecked: boolean

}

export const Select: React.FC<SelectProps> = Scrivito.connect(
	({ type, options, values, required, widget, externalId, onChange }) => {
		const ref = React.useRef<HTMLDivElement>(null);

		const onChangeSelect = () => {
			if (!ref.current) { return; }
			const inputs = ref.current.getElementsByTagName("input");
			const inputArray = Array.from(inputs);
			const selectedValues: string[] = [];
			const selectedIdentifiers: string[] = [];
			inputArray.forEach((input) => {
				if (input.checked) {
					selectedValues.push(input.value)
					selectedIdentifiers.push(input.dataset.identifier || "");
				}
			});

			onChange(selectedValues, selectedIdentifiers);
		}

		return (
			<div ref={ref} className={`row`}>
				{options.map((option, index) => (
					<SelectItem
						type={type}
						externalId={externalId}
						value={option.get("text") as string}
						identifier={option.get("identifier") as string}
						required={required}
						key={index}
						onChange={onChangeSelect}
						isChecked={values.includes(option.get("text") as string)}

					/>
				))}
			</div>
		);
	}

);

export const SelectItem: React.FC<SelectItemProps> = ({
	value,
	identifier,
	type,
	externalId,
	required,
	onChange,
	isChecked
}: SelectItemProps) => {
	return (
		<label className={`select-label ${type}`}>
			<input
				className="form-check-input"
				name={externalId}
				required={required}
				type={
					type == "string_radio"
						? "radio"
						: "checkbox"
				}
				value={value}
				defaultChecked={isChecked}
				onChange={onChange}

				data-identifier={identifier}
			/>
			<span>{value}</span>
		</label>
	);
};
