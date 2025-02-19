import { Widget } from "scrivito";
import { QUESTIONNAIRE_ID } from "../constants/constants";

export const isSubmitDisabled = (formContainer: Widget): boolean => {
	const qstGid = formContainer.get(QUESTIONNAIRE_ID) as string;
	return !!!qstGid;
}