import { useEffect, useRef, useState } from "react";
import { useValidationContext } from "../contexts/ValidationContext";

export const useValidationField = (externalId: string, mandatory: boolean) => {
	const ref = useRef<HTMLDivElement>(null);
	const validationContext = useValidationContext();
	const [isLocallyValid, setIsLocallyValid] = useState(true);

	if (!validationContext) { return }

	useEffect(() => {
		validationContext.updateValidationState(externalId, isLocallyValid);
	}, [isLocallyValid]);


	useEffect(() => {
		validationContext.registerField(externalId, mandatory);
	}, [externalId, mandatory]);

	useEffect(() => {
		if (validationContext.invalidFields[externalId] !== undefined) {
			setIsLocallyValid(!validationContext.invalidFields[externalId]);
		}
	}, [validationContext.invalidFields, externalId]);

	useEffect(() => {
		if (validationContext.firstInvalidField === externalId && ref.current) {
			requestAnimationFrame(() => {
				ref.current!.scrollIntoView({
					behavior: "smooth",
					block: "center",
					inline: "nearest"
				});
				validationContext.setFirstInvalidField(null);
			});
		}
	}, [validationContext.firstInvalidField]);

	return { isLocallyValid, setIsLocallyValid, ref };
};
