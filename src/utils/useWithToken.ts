import { isUserLoggedIn } from "scrivito"
import { getJwtToken } from "../config/scrivitoConfig"
import { isEmpty } from "./lodashPolyfills"

export const useWithToken = () => {
	return !isEmpty(getJwtToken()) && !isUserLoggedIn();
}