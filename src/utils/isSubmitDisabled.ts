import { Widget } from "scrivito";

export const isSubmitDisabled = (formContainer: Widget): boolean => {
	const qstGid = formContainer.get("questionnaireId") as string;
	return !!!qstGid;
}