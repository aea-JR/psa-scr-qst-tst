import * as React from "react";
interface DropdownOptionProps {
  value: string;
  externalId: string;
  identifier: string;
}

export const DropdownOption: React.FC<DropdownOptionProps> = ({
  value,
  externalId,
  identifier,
}) => {
  return (
    <option value={value} id={externalId} data-identifier={identifier}>
      {value}
    </option>
  );
};