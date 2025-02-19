import { ChangeEvent, FC } from "react";
import { ContentTag, Widget } from "scrivito";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { DropdownOption } from "../../Components/DropdownOption";
import { EXTERNAL_ID, HELP, IDENTIFIER, OPTIONS, TEXT } from "../../constants/constants";

interface DropdownProps {
	widget: Widget;
	title: string;
	externalId: string;
	required: boolean;
	value: string;
	onChange: (externalIds: string[], newValues: string[], identifiers?: string[]) => void;
}

export const Dropdown: FC<DropdownProps> = ({ widget, value, title, externalId, required, onChange }) => {
	const helpText = widget.get(HELP);
	const options = widget.get(OPTIONS) as Widget[];


	const onChangeDropdown = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedOption =
			event.target.options[event.target.selectedIndex];
		const value = selectedOption.value;
		const identifier = selectedOption.dataset.identifier || "";
		onChange([selectedOption.id], [value], [identifier]);
	};

	return (
		<div className="dropdown-wrapper">
			{title && (
				<label htmlFor={externalId} className="dropdown-label">
					<ContentTag
						attribute={TEXT}
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
				id={externalId}
				required={required}
				onChange={onChangeDropdown}
				value={value}
			>
				<DropdownOption
					value=""
					externalId="empty-option"
					key="empty-option"
					identifier=""
				/>

				{options.map((option) => (
					<DropdownOption
						value={option.get(TEXT) as string}
						externalId={option.get(EXTERNAL_ID) as string}
						key={option.id()}
						identifier={option.get(IDENTIFIER) as string}
					/>
				))}

			</select>

		</div>
	);
};
