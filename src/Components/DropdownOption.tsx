import * as React from "react";
interface DropdownOptionProps {
  value: string;
  id: string;
  identifier: string;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({
  value,
  id,
  identifier,
}) => {
  return (
    <option value={value} id={id} data-identifier={identifier}>
      {value}
    </option>
  );
};