import { ChangeEvent, FC } from "react";

interface StringMultiLineInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	required: boolean;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const StringMultiLineInput: FC<StringMultiLineInputProps> = ({ id, externalId, placeholder, value, required, onInputChange }) => {

	const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onInputChange([e.target.value]);
	}

	return (
		<textarea
			className="form-control"
			id={id}
			name={externalId}
			maxLength={2000}
			placeholder={placeholder}
			value={value}
			required={required}
			onChange={onChange}
			rows={3}
		/>
	)

};
