import { ChangeEvent, FC } from "react";

interface StringMultiLineInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	isInvalid: boolean;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const StringMultiLineInput: FC<StringMultiLineInputProps> = ({ id, externalId, placeholder, value, isInvalid, onInputChange }) => {

	const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onInputChange([e.target.value]);
	}

	return (
		<textarea
			className={`form-control ${isInvalid ? "is-invalid" : ""}`}
			id={id}
			name={externalId}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			rows={3}
		/>
	)

};
