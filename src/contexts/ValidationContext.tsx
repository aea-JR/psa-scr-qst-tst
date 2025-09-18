import React, { createContext, useContext, useEffect, useState } from "react";
import { InputElements } from "../types/review";

type StringMap<T> = { [key: string]: T };

interface ValidationContextProps {
	invalidFields: StringMap<boolean>;
	mandatoryFields: StringMap<boolean>;
	firstInvalidField: string | null;
	setFirstInvalidField: React.Dispatch<React.SetStateAction<string | null>>
	updateValidationState: (externalId: string, isValid: boolean) => void;
	registerField: (externalId: string, isMandatory: boolean) => void;
	validate: (formId: string, currentStep: number) => boolean;
}

const ValidationContext = createContext<ValidationContextProps | undefined>(undefined);

export const useValidationContext = () => {
	const context = useContext(ValidationContext);
	return context;
};

export const ValidationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [invalidFields, setInvalidFields] = useState<StringMap<boolean>>({});
	const [mandatoryFields, setMandatoryFields] = useState<StringMap<boolean>>({});
	const [firstInvalidField, setFirstInvalidField] = useState<string | null>(null);


	const updateValidationState = (externalId: string, isValid: boolean) => {
		setInvalidFields(prev => {
			return { ...prev, [externalId]: !isValid };
		});
	};

	const registerField = (externalId: string, isMandatory: boolean) => {
		setMandatoryFields(prev => ({
			...prev,
			[externalId]: isMandatory
		}));
	};


	const validate = (formId: string, currentStep: number): boolean => {
		let isValid = true;
		let firstInvalidFound = false;

		const form = document.getElementById(formId);
		if (!form) return isValid;

		const step = form.querySelector(`[data-step-number='${currentStep}']`);
		if (!step) return isValid;

		const allInputs: InputElements[] = Array.from(step.querySelectorAll("input, select, textarea") || []);
		const processedGroups = new Set<string>();

		for (const input of allInputs) {
			const externalId = (input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).name || "";
			const isMandatory = mandatoryFields[externalId] || false;

			if (!isMandatory) {
				updateValidationState(externalId, true);
				continue;
			}

			// GROUPED CHECKBOXES (data-group)
			if (input instanceof HTMLInputElement && input.type === "checkbox" && input.hasAttribute("data-group")) {
				const group = input.getAttribute("data-group")!;
				if (processedGroups.has(group)) continue;

				const groupCheckboxes = allInputs.filter(el => el instanceof HTMLInputElement && el.getAttribute("data-group") === group) as HTMLInputElement[];
				const someChecked = groupCheckboxes.some(cb => cb.checked);
				if (!someChecked) {
					updateValidationState(externalId, false);
					isValid = false;
				}
				processedGroups.add(group);

			} else if (input instanceof HTMLInputElement && input.type === "checkbox" && input.hasAttribute("data-tristate")) {
				// TRI-STATE CHECKBOX (data-tristate)
				if (input.getAttribute("data-tristate") === "unset") {
					updateValidationState(externalId, false);
					isValid = false;
				}

			} else if (input instanceof HTMLInputElement && (input.type === "checkbox" || input.type == "radio")) {
				// NORMAL CHECKBOX OR RADIO
				const checkedInputs = step.querySelectorAll(`input[name='${externalId}']:checked`);
				if (checkedInputs.length === 0) {
					updateValidationState(externalId, false);
					isValid = false;
				}

			} else {
				// OTHER INPUTS ( textarea, text, etc.)
				const el = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
				if (!el.value.trim()) {
					updateValidationState(externalId, false);
					isValid = false;
				}
			}

			if (!firstInvalidFound && !isValid) {
				setFirstInvalidField(externalId);
				firstInvalidFound = true;
			}

		}

		if (isValid) {
			setFirstInvalidField(null);
		}
		return isValid;
	};

	return (
		<ValidationContext.Provider value={{ invalidFields, mandatoryFields, firstInvalidField, setFirstInvalidField, updateValidationState, registerField, validate }}>
			{children}
		</ValidationContext.Provider>
	);
};
