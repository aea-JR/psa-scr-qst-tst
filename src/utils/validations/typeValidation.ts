import { TYPE } from "../../constants/constants"

export const typeValidation = [
	TYPE,
	(type: string) => {
		if (!type) { return "Specify the Input type."; }
		return null;
	}

] as const;