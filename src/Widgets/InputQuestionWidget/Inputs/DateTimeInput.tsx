import { ChangeEvent, FC, useEffect, useState } from "react";
import { isPisaDate } from "../../../utils/isPisaDate";
import { convertPisaDate, formatUTCDate } from "./inputUtils";

interface DateTimeInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	defaultValue: string;
	isInvalid: boolean;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const DateTimeInput: FC<DateTimeInputProps> = ({
	id,
	externalId,
	placeholder,
	value,
	defaultValue,
	isInvalid,
	onInputChange,
}) => {
	const [displayValue, setDisplayValue] = useState("");

	useEffect(() => {
		if (value == defaultValue) {
			setDisplayValue(isPisaDate(value) ? convertPisaDate(value, "datetime") : formatUTCDate(value, "datetime"));
			return;
		}
		setDisplayValue(formatUTCDate(value, "datetime"));
	}, [value]);


	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		setDisplayValue(inputValue);
		if (!inputValue) {
			onInputChange([]);
			return;
		}
		const date = new Date(inputValue);
		if (isNaN(date.getTime())) {
			onInputChange([]);
			return;
		}
		onInputChange([date.toISOString()], [externalId]);
	};

	return (
		<input
			className={`form-control ${isInvalid ? "is-invalid" : ""}`}
			id={id}
			name={externalId}
			placeholder={placeholder}
			value={displayValue}
			onChange={onChange}
			type="datetime-local"
		/>
	);
};