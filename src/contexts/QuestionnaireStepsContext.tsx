import { createContext, useContext, useState, useCallback } from "react";
import { isInPlaceEditingActive, Widget } from "scrivito";
import { scrollIntoView } from "../utils/scrollIntoView";
import { InputElements } from "../types/review";
import { forEach, groupBy, some } from "lodash-es";
import { EXTERNAL_ID, FORM_TYPE, STEPS } from "../constants/constants";

interface QuestionnaireStepsContextProps {
	currentStep: number;
	stepsLength: number;
	isLastStep: boolean;
	isSingleStep: boolean;
	getStepInfo: (stepId: string) => {
		stepNumber: number;
		isActive: boolean;
		isSingleStep: boolean;
	};
	onPageChange: (nextPage: boolean) => void;
	validateCurrentStep: () => boolean;
}

const QuestionnaireStepsContext = createContext<QuestionnaireStepsContextProps | undefined>(undefined);

export const useQuestionnaireStepsContext = () => {
	const context = useContext(QuestionnaireStepsContext);
	if (!context) {
		throw new Error("useQuestionnaireStepsContext must be used within a QuestionnaireStepsProvider");
	}
	return context;
};

export const QuestionnaireStepsProvider: React.FC<{ children: React.ReactNode; qstContainerWidget: Widget }> = ({ children, qstContainerWidget }) => {
	const steps = qstContainerWidget.get(STEPS) as Widget[] || [];
	const isSingleStep = qstContainerWidget.get(FORM_TYPE) === "single-step";
	const [currentStep, setCurrentStep] = useState(1);
	const isLastStep = currentStep === steps.length;
	const stepsLength = steps.length;
	const externalId = qstContainerWidget.get(EXTERNAL_ID) as string;

	const validateCurrentStep = useCallback((): boolean => {
		return doValidate(externalId, currentStep);
	}, [currentStep]);

	const getStepInfo = (stepId: string) => {
		let isActive = false;
		let stepNumber = 0;

		steps.some((step: Widget, index: number) => {
			if (step.id() === stepId) {
				stepNumber = index + 1;
				isActive = stepNumber === currentStep;
				return true;
			}
			return false;
		});

		return { stepNumber, isActive, isSingleStep };
	};

	const onPageChange = (nextPage: boolean) => {
		if (isInPlaceEditingActive()) {
			console.log("Navigation buttons do not work in edit mode.");
			return;
		}
		if (nextPage && !validateCurrentStep()) return;

		const newStep = nextPage
			? Math.min(currentStep + 1, stepsLength)
			: Math.max(currentStep - 1, 1);

		setCurrentStep(newStep);

		setTimeout(() => {
			const formElement = document.getElementById(externalId) as HTMLFormElement;
			scrollIntoView(formElement);
		}, 0);
	};

	return (
		<QuestionnaireStepsContext.Provider
			value={{ currentStep, stepsLength, isLastStep, isSingleStep, getStepInfo, onPageChange, validateCurrentStep }}
		>
			{children}
		</QuestionnaireStepsContext.Provider>
	);
};

const doValidate = (externalId: string, currentStep: number): boolean => {
	let isValid = true;
	const form = document.getElementById(externalId);
	if (!form) return isValid;

	const step = form.querySelector(`[data-step-number='${currentStep}']`);
	if (!step) return isValid;


	const allInputs: InputElements[] = Array.from(step.querySelectorAll("input, select, textarea") || []);
	const processedGroups = new Set(); // to track validated checkbox groups

	// iterate in order & validate accordingly
	for (const input of allInputs) {
		if (input.type === "checkbox") {
			// handle grouped checkboxes
			if (input.hasAttribute("data-group")) {
				const group = input.getAttribute("data-group")!;
				if (processedGroups.has(group)) continue; // skip already validated groups

				const groupCheckboxes = allInputs.filter(el => el.getAttribute("data-group") === group) as HTMLInputElement[];
				if (!groupCheckboxes.some(cb => cb.checked)) {
					const message = getBrowserValidationMessage();
					groupCheckboxes[0].setCustomValidity(message);
					groupCheckboxes[0].reportValidity();
					return (isValid = false);
				} else {
					groupCheckboxes.forEach(cb => cb.setCustomValidity(""));
				}
				processedGroups.add(group);
			}
			// handle tri-state checkboxes
			else if (input.hasAttribute("data-tristate")) {
				if (input.getAttribute("data-tristate") === "unset") {
					input.reportValidity();
					return (isValid = false);
				}
			} else {
				// normal checkbox validation
				if (!input.checkValidity()) {
					input.reportValidity();
					return (isValid = false);
				}
			}
		} else {
			// validate other inputs normally
			if (!input.checkValidity()) {
				input.reportValidity();
				return (isValid = false);
			}
		}
	}
	return isValid;
};

const getBrowserValidationMessage = () => {
	const testInput = document.createElement("input");
	testInput.type = "radio";
	testInput.required = true;
	testInput.name = "fake-radio"
	testInput.value = "";
	document.body.appendChild(testInput)
	const message = testInput.validationMessage;
	document.body.removeChild(testInput);

	return message;
};