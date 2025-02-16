import { ChangeEvent, FC } from "react";
import { ContentTag, Widget } from "scrivito";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { DropdownOption } from "../../Components/DropdownOption";

interface DropdownProps {
	widget: Widget;
	title: string;
	externalId: string;
	required: boolean;
	value: string;
	onChange: (externalIds: string[], newValues: string[], identifiers?: string[]) => void;
}

export const Dropdown: FC<DropdownProps> = ({ widget, value, title, externalId, required, onChange }) => {
	const helpText = widget.get("help");
	const options = widget.get("options") as Widget[];


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
