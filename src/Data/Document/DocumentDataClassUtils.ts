import { load } from "scrivito";
import { getDocumentDataClass } from "./DocumentDataClass";

export const getDocument = (documentId: string) => {
	return load(() => {
		return getDocumentDataClass()?.get(documentId) || null;
	});
}