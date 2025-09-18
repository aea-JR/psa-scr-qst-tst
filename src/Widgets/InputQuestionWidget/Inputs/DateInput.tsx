import { ChangeEvent, FC, useEffect, useState } from "react";
import { isPisaDate } from "../../../utils/isPisaDate";
import { convertPisaDate, formatUTCDate } from "./inputUtils";

interface DateInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	defaultValue: string;
	isInvalid: boolean;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const DateInput: FC<DateInputProps> = ({ id, externalId, placeholder, value, defaultValue, isInvalid, onInputChange }) => {
	const [displayValue, setDisplayValue] = useState("");

	useEffect(() => {
		if (value == defaultValue) {
			if (isPisaDate(value)) {
				setDisplayValue(convertPisaDate(value, "date"));
			} else {
				setDisplayValue(formatUTCDate(value, "date"));
			}
			return;
		}
		const dateValue = value ? value.slice(0, 10) : "";
		setDisplayValue(dateValue);
	}, [value])


	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		setDisplayValue(inputValue);
		if (!inputValue) {
			onInputChange([]);
			return;
		}
		const date = new Date(inputValue);
		date.setUTCHours(12, 0, 0, 0);
		const utc = date.toISOString();
		onInputChange([utc]);
	}

	return (

		<input
			className={`form-control ${isInvalid ? "is-invalid" : ""}`}
			id={id}
			name={externalId}
			placeholder={placeholder}
			value={displayValue}
			onChange={onChange}
			type={"date"}
		/>
	)

};
