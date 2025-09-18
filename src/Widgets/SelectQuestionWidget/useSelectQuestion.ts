import { useCallback, useEffect, useMemo, useState } from "react";

import { isEmpty } from "../../utils/lodashPolyfills";
import { useAnswer } from "../../hooks/useAnswer";
import { useExternalId } from "../../hooks/useExternalId";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import { isInPlaceEditingActive, Widget } from "scrivito";
import { ALIGNMENT, CLEAR_SELECTION_BUTTON_TEXT, DEFAULT_VALUE, ENABLE_CONDITIONALS, EXTERNAL_ID, HELP, IDENTIFIER, INLINE_VIEW, MANDATORY, OPTIONS, POSITION, QUESTION_ID, SHOW_CLEAR_SELECTION_BUTTON, TEXT, TYPE, VALIDATION_TEXT } from "../../constants/constants";
import { isAlignmentEnabled } from "./isSelectAlignmentEnabled";
import { useValidationField } from "../../hooks/useValidationField";

export const useSelectQuestion = (widget: Widget) => {
	const externalId = widget.get(EXTERNAL_ID) as string;
	const required = widget.get(MANDATORY) as boolean;
	const text = widget.get(TEXT) as string;
	const helpText = widget.get(HELP);
	const defaultValue = widget.get(DEFAULT_VALUE) as string;
	const options = widget.get(OPTIONS) as Widget[];
	const questionId = widget.get(QUESTION_ID) as string;
	const type = widget.get(TYPE) as string || "string_dropdown";
	const isMultiSelect = type === "string_checkboxes";
	const useAsConditionals = widget.get(ENABLE_CONDITIONALS) as boolean;
	const showClearButton = widget.get(SHOW_CLEAR_SELECTION_BUTTON) as boolean;
	const clearSelectionButtonText = widget.get(CLEAR_SELECTION_BUTTON_TEXT) as string || "Clear selection";
	const inlineView = widget.get(INLINE_VIEW) as boolean;
	const alignment = isAlignmentEnabled(widget) ? widget.get(ALIGNMENT) as string || "left" : "left";
	const validationText = widget.get(VALIDATION_TEXT) as string || "Please select an item";
	const [selectedConditionIds, setSelectedConditionIds] = useState<string[]>([]);
	const titleBgColor = useDynamicBackground(".header-info");
	const validator = useValidationField(externalId, required);

	useExternalId(widget);

	const getInitialValueAndIdentifiers = useCallback(() => {
		if (isEmpty(defaultValue)) {
			return { values: [], identifiers: [] };
		}
		if (isMultiSelect) {
			const selectedOptions = options.filter((option) => {
				const identifier = option.get(IDENTIFIER) as string;
				return identifier && defaultValue.includes(identifier);
			});
			return {
				values: selectedOptions.map((option) => option.get(TEXT) as string),
				identifiers: selectedOptions.map((option) => option.get(IDENTIFIER) as string),
			};
		} else {
			const defaultOption = options.find((option) => {
				const identifier = option.get(IDENTIFIER) as string;
				return !isEmpty(identifier) && defaultValue.includes(identifier);
			});
			if (defaultOption) {
				return {
					values: [defaultOption.get(TEXT) as string],
					identifiers: [defaultOption.get(IDENTIFIER) as string],
				};
			}
		}
		return { values: [], identifiers: [] };
	}, [defaultValue, options, isMultiSelect]);

	const initialValues = useMemo(() => getInitialValueAndIdentifiers(), [getInitialValueAndIdentifiers]);
	const { values, handleChange } = useAnswer(questionId, initialValues.values, initialValues.identifiers);

	useEffect(() => {
		if (!isInPlaceEditingActive()) {
			return;
		}
		options.forEach((option, index) => {
			if (!option.get(TYPE)) {
				const realType = type === "string_dropdown" ? "dropdown" : isMultiSelect ? "checkbox" : "radio";
				option.update({ type: realType });
			}
			if (option.get(POSITION) !== (index + 1) * 10) {
				option.update({ position: (index + 1) * 10 });
			}
		});
	}, [options]);

	useEffect(() => {
		if (!isInPlaceEditingActive()) {
			return;
		}
		options.forEach((option) => option.update({ isCondition: useAsConditionals }));
	}, [useAsConditionals]);

	useEffect(() => {
		if (useAsConditionals) {
			const activeConditionIds: string[] = [];

			if (isMultiSelect) {
				options.forEach((option) => {
					if (values.includes(option.get(TEXT) as string)) {
						activeConditionIds.push(option.get(EXTERNAL_ID) as string);
					}
				});
			} else {
				const selectedOption = options.find((option) =>
					values.includes(option.get(TEXT) as string)
				);
				if (selectedOption) {
					activeConditionIds.push(selectedOption.get(EXTERNAL_ID) as string);
				}
			}

			setSelectedConditionIds(activeConditionIds);
		}
	}, [values]);

	const onChangeSelect = (externalIds: string[], newValues: string[], identifiers?: string[]) => {
		setSelectedConditionIds(externalIds);
		validator?.setIsLocallyValid(!isEmpty(newValues[0]));
		handleChange(newValues, identifiers);
	};

	const getConditionData = (externalId: string) => {
		return { isActive: selectedConditionIds.includes(externalId) };
	};

	const showReset = (): boolean => {
		return (
			showClearButton &&
			!isEmpty(values) &&
			!required &&
			type == "string_radio"
		);
	}

	const onReset = () => {
		onChangeSelect([], []);
	}

	return {
		externalId,
		required,
		text,
		helpText,
		options,
		type,
		useAsConditionals,
		values,
		titleBgColor,
		clearSelectionButtonText,
		inlineView,
		alignment,
		validationText,
		validator,
		onChangeSelect,
		getConditionData,
		showReset,
		onReset
	};
};