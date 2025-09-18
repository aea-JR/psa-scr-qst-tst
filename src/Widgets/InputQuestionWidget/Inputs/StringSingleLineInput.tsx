import { ChangeEvent, ChangeEventHandler, FC } from "react";

interface StringSingleLineInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	isInvalid: boolean;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const StringSingleLineInput: FC<StringSingleLineInputProps> = ({ id, externalId, placeholder, value, isInvalid, onInputChange }) => {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		onInputChange([e.target.value]);
	}
	return (
		<input
			className={`form-control ${isInvalid ? "is-invalid" : ""}`}
			id={id}
			name={externalId}
			maxLength={2000}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			type={"text"}
		/>
	)

};
