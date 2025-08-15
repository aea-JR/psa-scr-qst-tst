import { load } from "scrivito";
import { getUserDataClass } from "./UserDataClass";

export const validateToken = () => {
	return load(() => {
		try {
			//TODO: improve
			getUserDataClass()?.get("name");
			return true;
		} catch (error) {
			console.error(error)
			return false;
		}
	});
}