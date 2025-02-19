import { useCallback, useEffect, useMemo, useState } from "react";
import { each, find, isEmpty } from "lodash-es";
import { useAnswer } from "../../hooks/useAnswer";
import { useExternalId } from "../../hooks/useExternalId";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import { isInPlaceEditingActive, Widget } from "scrivito";
import { DEFAULT_VALUE, ENABLE_CONDITIONALS, EXTERNAL_ID, HELP, IDENTIFIER, MANDATORY, OPTIONS, POSITION, QUESTION_ID, TEXT, TYPE } from "../../constants/constants";

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
	const useAsConditionals = widget.get(ENABLE_CONDITIONALS);

	const [selectedConditionIds, setSelectedConditionIds] = useState<string[]>([]);
	const titleBgColor = useDynamicBackground(".header-info");

	useExternalId(widget);

	const getInitialValueAndIdentifiers = useCallback(() => {
		if (isEmpty(defaultValue)) {
			return { values: [""], identifiers: [""] };
		}
		if (isMultiSelect) {
			const selectedOptions = options.filter((option) =>
				defaultValue.includes(option.get(IDENTIFIER) as string)
			);
			return {
				values: selectedOptions.map((option) => option.get(TEXT) as string),
				identifiers: selectedOptions.map((option) => option.get(IDENTIFIER) as string),
			};
		} else {
			const defaultOption = find(options, (option) =>
				defaultValue.includes(option.get(IDENTIFIER) as string)
			);
			if (defaultOption) {
				return {
					values: [defaultOption.get(TEXT) as string],
					identifiers: [defaultOption.get(IDENTIFIER) as string],
				};
			}
		}
		return { values: [""], identifiers: [""] };
	}, [defaultValue, options, isMultiSelect]);

	const initialValues = useMemo(() => getInitialValueAndIdentifiers(), [getInitialValueAndIdentifiers]);
	const { values, handleChange } = useAnswer(questionId, initialValues.values, initialValues.identifiers);

	useEffect(() => {
		if (!isInPlaceEditingActive()) {
			return;
		}
		each(options, (option, index) => {
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
		each(options, (option) => option.update({ isCondition: useAsConditionals }));
	}, [useAsConditionals]);

	useEffect(() => {
		if (useAsConditionals) {
			const activeConditionIds: string[] = [];

			if (isMultiSelect) {
				each(options, (option) => {
					if (values.includes(option.get(TEXT) as string)) {
						activeConditionIds.push(option.get(EXTERNAL_ID) as string);
					}
				});
			} else {
				const selectedOption = find(options, (option) =>
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
		handleChange(newValues, identifiers);
	};

	const getConditionData = (externalId: string) => {
		return { isActive: selectedConditionIds.includes(externalId) };
	};

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
		onChangeSelect,
		getConditionData,
	};
};