import { ChangeEvent, FC, useEffect } from "react";
import { ContentTag, isInPlaceEditingActive, Widget } from "scrivito";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { DropdownOption } from "../../Components/DropdownOption";
import { QuestionnaireConditionWidget } from "../QuestionnaireConditionWidget/QuestionnaireConditionWidgetClass";

interface DropdownProps {
	widget: Widget;
	title: string;
	id: string;
	externalId: string;
	required: boolean;
	value: string;
	addEmptyOption: boolean;
	onChange: (newValues: string[], identifiers?: string[]) => void;
}

export const Dropdown: FC<DropdownProps> = ({ widget, value, title, id, externalId, required, onChange, addEmptyOption }) => {
	const helpText = widget.get("help");
	const options = widget.get("options") as Widget[];


	const onChangeDropdown = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedOption =
			event.target.options[event.target.selectedIndex];
		const value = selectedOption.value;
		const identifier = selectedOption.dataset.identifier || "";
		onChange([value], [identifier]);
		//	setSelectedConditionId(selectedOption.id);
	};

	return (
		<div className="dropdown-wrapper">
			{title && (
				<label htmlFor={id} className="dropdown-label">
					<ContentTag
						attribute="text"
						content={widget}
						tag="span"
					/>
					{required && <Mandatory />}
					{helpText && <HelpText widget={widget} />}
				</label>
			)}
			<select
				className="dropdown-select form-select form-control"
				name={externalId}
				id={id}
				required={required}
				onChange={onChangeDropdown}
				value={value}
			>
				{addEmptyOption && (
					<DropdownOption
						value=""
						externalId="empty-option"
						key="empty-option"
						identifier=""
					/>
				)}
				{options.map((option) => (
					<DropdownOption
						value={option.get("text") as string}
						externalId={option.get("externalId") as string}
						key={option.id()}
						identifier={option.get("identifier") as string}
					/>
				))}

			</select>

		</div>
	);
};
