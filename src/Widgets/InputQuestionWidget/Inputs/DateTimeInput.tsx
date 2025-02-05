import { ChangeEvent, FC, useEffect, useState } from "react";
import { isPisaDate } from "../../../utils/isPisaDate";

interface DateTimeInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	defaultValue: string;
	required: boolean;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const DateTimeInput: FC<DateTimeInputProps> = ({ id, externalId, placeholder, value, defaultValue, required, onInputChange }) => {
	const [displayValue, setDisplayValue] = useState("");

	useEffect(() => {
		if (value == defaultValue) {
			setDisplayValue(isPisaDate(value) ? convertPisaDate(value) : formatUTCDate(value));
			return;
		}
		setDisplayValue(value);
	}, [value])

	const convertPisaDate = (pisaDate: string) => {
		const year = pisaDate.substring(0, 4);
		const month = pisaDate.substring(4, 6);
		const day = pisaDate.substring(6, 8);
		const hours = pisaDate.substring(8, 10) || "12";
		const minutes = pisaDate.substring(10, 12) || "00";
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};



	const formatUTCDate = (utcString: string) => {
		const date = new Date(utcString);
		if (isNaN(date.getTime())) return "";
		return date.toISOString().slice(0, 16);
	};


	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		setDisplayValue(inputValue);
		const date = new Date(inputValue);
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
			type="datetime-local"
		/>
	)

};
