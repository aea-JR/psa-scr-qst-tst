import { useCallback, useEffect, useMemo, useState } from "react";
import { each, find, isEmpty } from "lodash-es";
import { useAnswer } from "../../hooks/useAnswer";
import { useExternalId } from "../../hooks/useExternalId";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import { isInPlaceEditingActive, Widget } from "scrivito";

export const useSelectQuestion = (widget: Widget) => {
	const externalId = widget.get("externalId") as string;
	const required = widget.get("mandatory") as boolean;
	const text = widget.get("text") as string;
	const helpText = widget.get("help");
	const defaultValue = widget.get("defaultValue") as string;
	const options = widget.get("options") as Widget[];
	const questionId = widget.get("questionId") as string;
	const type = widget.get("type") as string || "string_dropdown";
	const isMultiSelect = type === "string_checkboxes";
	const useAsConditionals = widget.get("enableConditionals");

	const [selectedConditionIds, setSelectedConditionIds] = useState<string[]>([]);
	const titleBgColor = useDynamicBackground(".header-info");

	useExternalId(widget);

	const getInitialValueAndIdentifiers = useCallback(() => {
		if (isEmpty(defaultValue)) {
			return { values: [""], identifiers: [""] };
		}
		if (isMultiSelect) {
			const selectedOptions = options.filter((option) =>
				defaultValue.includes(option.get("identifier") as string)
			);
			return {
				values: selectedOptions.map((option) => option.get("text") as string),
				identifiers: selectedOptions.map((option) => option.get("identifier") as string),
			};
		} else {
			const defaultOption = find(options, (option) =>
				defaultValue.includes(option.get("identifier") as string)
			);
			if (defaultOption) {
				return {
					values: [defaultOption.get("text") as string],
					identifiers: [defaultOption.get("identifier") as string],
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
			if (!option.get("type")) {
				const realType = type === "string_dropdown" ? "dropdown" : isMultiSelect ? "checkbox" : "radio";
				option.update({ type: realType });
			}
			if (option.get("position") !== (index + 1) * 10) {
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
					if (values.includes(option.get("text") as string)) {
						activeConditionIds.push(option.get("externalId") as string);
					}
				});
			} else {
				const selectedOption = find(options, (option) =>
					values.includes(option.get("text") as string)
				);
				if (selectedOption) {
					activeConditionIds.push(selectedOption.get("externalId") as string);
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