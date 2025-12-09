import { ChangeEvent, FC } from "react";
import { sanitizeFloat, sanitizeInteger, toParentFormat } from "./inputUtils";
import { INTEGER } from "../../../constants/constants";

interface NumberInputProps {
	id: string;
	externalId: string;
	placeholder: string;
	value: string;
	defaultValue: string;
	isInvalid: boolean;
	type: string;
	onInputChange: (newValues: string[], identifiers?: string[]) => void;
}

export const NumberInput: FC<NumberInputProps> = ({
	id,
	externalId,
	placeholder,
	value,
	isInvalid,
	type,
	onInputChange,
}) => {

	const isInteger = type === INTEGER;

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const raw = event.target.value;
		const cleaned =
			isInteger ? sanitizeInteger(raw) : sanitizeFloat(raw);
		// Always send dot to parent
		const parentValue = toParentFormat(cleaned, type);
		onInputChange([parentValue], [externalId]);

	};

	const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
		let v = event.target.value;

		if (!v) {
			onInputChange([""], [externalId]);
			return;
		}

		if (type === INTEGER) {
			v = sanitizeInteger(v);
			// If it's just '-', clear it on blur
			if (v === "-") {
				onInputChange([""], [externalId]);
				return;
			}
			onInputChange([v], [externalId]);
		} else {
			v = sanitizeFloat(v).replace(",", ".");
			// remove trailing dot or lone '-'
			if (v === "-" || v.endsWith(".")) v = v.replace(/\.$/, "");
			if (!v || v === "-") {
				onInputChange([""], [externalId]);
				return;
			}
			onInputChange([v], [externalId]);
		}
	};

	const inputMode = isInteger ? "numeric" : "decimal";
	const pattern = isInteger ? "-?[0-9]*" : "-?[0-9]*[.,]?[0-9]*";

	return (
		<input
			className={`form-control ${isInvalid ? "is-invalid" : ""}`}
			id={id}
			name={externalId}
			placeholder={placeholder}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			type="number"
			inputMode={inputMode}
			pattern={pattern}
		/>
	);
};