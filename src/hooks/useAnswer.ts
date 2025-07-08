import { useState, useEffect, useCallback } from "react";
import { isEmpty } from "../utils/lodashPolyfills";
import { useFormContext } from "../contexts/FormContext";

export const useAnswer = (
	questionId: string,
	defaultValues: string[],
	identifiers?: string[]
) => {
	const ctx = useFormContext();
	const [values, setValues] = useState<string[]>(defaultValues);

	const initializeAnswer = useCallback(() => {
		const existingAnswer = ctx?.getAnswer(questionId);

		if (existingAnswer) {
			setValues(existingAnswer.value);
		} else if (!isEmpty(defaultValues)) {
			ctx?.onChange(questionId, defaultValues, identifiers);
		}
	}, [ctx?.getAnswer, questionId, defaultValues, ctx?.onChange]);

	useEffect(() => {
		if (!isEmpty(questionId)) {
			initializeAnswer();
		}
	}, [initializeAnswer, questionId]);

	const handleChange = (newValues: string[], identifiers: string[] = [""]) => {
		setValues(newValues);
		ctx?.onChange(questionId, newValues, identifiers);
	};

	return { values, handleChange };
};