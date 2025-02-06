import { createContext, useContext, useState, useCallback } from "react";
import { Widget } from "scrivito";
import { scrollIntoView } from "../utils/scrollIntoView";

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
	const steps = qstContainerWidget.get("steps") as Widget[] || [];
	const isSingleStep = qstContainerWidget.get("formType") === "single-step";
	const [currentStep, setCurrentStep] = useState(1);
	const isLastStep = currentStep === steps.length;
	const stepsLength = steps.length;
	const externalId = qstContainerWidget.get("externalId") as string;

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
	if (form) {
		const step = form.querySelector(`[data-step-number='${currentStep}']`);
		if (step) {
			const allInputs: NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> =
				step.querySelectorAll("input, select, textarea") || [];
			for (const node of allInputs.values()) {
				if (!node.checkValidity()) {
					node.reportValidity();
					return (isValid = false);
				}
			}
		}
	}
	return isValid;
};