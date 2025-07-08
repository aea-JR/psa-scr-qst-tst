import { isEmpty } from "./lodashPolyfills";
import { getPisaUrl } from "../config/scrivitoConfig"

export const isPisaConnected = async (): Promise<boolean | null> => {
	const url = getPisaUrl();
	if (isEmpty(url)) {
		return null;
	}
	try {
		const response = await fetch(url + "/version")
		if (response.ok) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}
