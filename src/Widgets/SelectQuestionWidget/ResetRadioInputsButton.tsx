import * as React from "react";

interface ResetRadioInputsProps {
  text: string;
  parentRef: React.RefObject<HTMLDivElement>;
  onReset: () => void;
}

export const ResetRadioInputsButton: React.FC<ResetRadioInputsProps> = ({
  parentRef,
  text,
  onReset
}) => {
  const doReset = () => {
    console.log("reset")
    if (parentRef.current) {
      const inputs = parentRef.current.getElementsByTagName("input");
      const inputArray = Array.from(inputs);
      inputArray.forEach((input) => {
        if (input.type === "radio") {
          input.checked = false;
        }
      });
      onReset();
    }
  };

  return (
    <div className={`text-end  fade-in`}>
      <div className="reset-label" onClick={doReset}>
        <span>{text}</span>
      </div>
    </div>
  );
};
