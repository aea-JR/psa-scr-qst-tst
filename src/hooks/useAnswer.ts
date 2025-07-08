import { useState, useEffect, useCallback } from "react";
import { isEmpty } from "../utils/lodashPolyfills";
import { useFormContext } from "../contexts/FormContext";

export const useAnswer = (
	questionId: string,
	defaultValues: string[],
	identifiers?: string[]
) => {
	const { getAnswer, onChange } = useFormContext();
	const [values, setValues] = useState<string[]>(defaultValues);

	const initializeAnswer = useCallback(() => {
		const existingAnswer = getAnswer(questionId);

		if (existingAnswer) {
			setValues(existingAnswer.value);
		} else if (!isEmpty(defaultValues)) {
			onChange(questionId, defaultValues, identifiers);
		}
	}, [getAnswer, questionId, defaultValues, onChange]);

	useEffect(() => {
		if (!isEmpty(questionId)) {
			initializeAnswer();
		}
	}, [initializeAnswer, questionId]);

	const handleChange = (newValues: string[], identifiers: string[] = [""]) => {
		setValues(newValues);
		onChange(questionId, newValues, identifiers);
	};

	return { values, handleChange };
};