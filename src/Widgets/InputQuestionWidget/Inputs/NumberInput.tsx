import { ChangeEvent, FC, useEffect, useState } from "react";

interface NumberInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	defaultValue: string;
	required: boolean;
	type: string;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const NumberInput: FC<NumberInputProps> = ({ id, externalId, placeholder, value, required, type, onInputChange }) => {

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		onInputChange([newValue]);

	};

	const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;
		if (type === "integer") {
			value = value.split(/[.,]/)[0];
			onInputChange([value]);
		}
	};

	return (

		<input
			className="form-control"
			id={id}
			name={externalId}
			placeholder={placeholder}
			value={value}
			required={required}
			onChange={handleChange}
			onBlur={handleBlur}
			type={"number"}
			inputMode="decimal"
			pattern={type === "integer" ? "[0-9]*" : "[0-9]*[.,]?[0-9]*"}
		/>
	)

};
