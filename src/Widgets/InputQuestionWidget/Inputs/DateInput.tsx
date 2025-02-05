import { ChangeEvent, FC, useEffect, useState } from "react";
import { isPisaDate } from "../../../utils/isPisaDate";

interface DateInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	defaultValue: string;
	required: boolean;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const DateInput: FC<DateInputProps> = ({ id, externalId, placeholder, value, defaultValue, required, onInputChange }) => {
	const [displayValue, setDisplayValue] = useState("");

	useEffect(() => {
		if (value == defaultValue) {
			if (isPisaDate(value)) {
				setDisplayValue(convertPisaDate(value));
			} else {
				setDisplayValue(formatUTCDate(value));
			}
			return;
		}
		const dateValue = value.slice(0, 10);
		setDisplayValue(dateValue);
	}, [value])

	const convertPisaDate = (pisaDate: string) => {
		const year = pisaDate.substring(0, 4);
		const month = pisaDate.substring(4, 6);
		const day = pisaDate.substring(6, 8);
		return `${year}-${month}-${day}`;
	};



	const formatUTCDate = (utcString: string) => {
		const date = new Date(utcString);
		if (isNaN(date.getTime())) { return ""; }
		date.setUTCHours(12, 0, 0, 0);

		return date.toISOString().split("T")[0];
	};


	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		setDisplayValue(inputValue);
		const date = new Date(inputValue);
		date.setUTCHours(12, 0, 0, 0);
		const utc = date.toISOString();
		onInputChange([utc]);
	}

	return (

		<input
			className="form-control"
			id={id}
			name={externalId}
			placeholder={placeholder}
			value={displayValue}
			required={required}
			onChange={onChange}
			type={"date"}
		/>
	)

};
