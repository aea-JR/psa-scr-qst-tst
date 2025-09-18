import { createContext, useContext, useState, useCallback } from "react";
import { isInPlaceEditingActive, Widget } from "scrivito";
import { scrollIntoView } from "../utils/scrollIntoView";
import { EXTERNAL_ID, FORM_TYPE, STEPS } from "../constants/constants";
import { useValidationContext } from "./ValidationContext";

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
	const { validate } = useValidationContext()!;

	const validateCurrentStep = (): boolean => {
		return validate(externalId, currentStep);
	}

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
			value={{ currentStep, stepsLength, isLastStep, isSingleStep, getStepInfo, onPageChange }}
		>
			{children}
		</QuestionnaireStepsContext.Provider>
	);
};
