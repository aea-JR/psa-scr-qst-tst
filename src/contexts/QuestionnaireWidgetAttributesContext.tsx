import React, { createContext, useContext, ReactNode } from "react";
import { Widget } from "scrivito";

export interface QuestionnaireWidgetAttributes {
	externalId: string,
	steps: Widget[],
	formType: string;
	submissionFailureText: string;
	retryButtonText: string;
	showRetryButton: boolean;
	retryButtonAlignment: string;
	isCreated: boolean;
	showSubmittedPreview: boolean;
	showSubmittingPreview: boolean;
	showFailedPreview: boolean;
	fixedFormHeight: boolean;
	formHeight: number;
	submittingMessageType: string;
	containerClassNames: string;
	formScrollbarWidth: string;
	formOverscrollBehavior: string;
	submittingMessage: string,
	submittedMessage: string,
	failedMessage: string,
	submittedMessageType: string,
	failedMessageType: string,
	failedMessageWidgets: Widget[],
	submittedMessageWidgets: Widget[],
	submittingMessageWidgets: Widget[],
	submitButtonText: string,
	forwardButtonText: string,
	backwardButtonText: string,
	singleSubmitButtonAlignment: string,
	showReview: boolean,
	includeEmptyAnswers: boolean,
	showStepsInReview: boolean,
	showReviewHeader: boolean,
	showReviewFooter: boolean,
	reviewButtonText: string,
	reviewHeaderTitle: string,
	reviewCloseButtonText: string,
}

const QuestionnaireWidgetAttributesContext = createContext<QuestionnaireWidgetAttributes | null>(
	null
);

export const QuestionnaireWidgetAttributesProvider: React.FC<{
	values: QuestionnaireWidgetAttributes;
	children: ReactNode;
}> = ({ values, children }) => {

	return (
		<QuestionnaireWidgetAttributesContext.Provider value={values}>
			{children}
		</QuestionnaireWidgetAttributesContext.Provider>
	);
};

export const useQuestionnaireWidgetAttributesContext = () => {
	const context = useContext(QuestionnaireWidgetAttributesContext);
	if (!context) {
		throw new Error(
			"useQuestionnaireWidgetAttributesContext must be used within a QuestionnaireWidgetAttributesProvider"
		);
	}
	return context;
};