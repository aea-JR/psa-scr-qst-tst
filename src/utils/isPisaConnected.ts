import { getPisaUrl } from "../config/scrivitoConfig"

export const isPisaConnected = async (): Promise<boolean> => {
	try {
		const response = await fetch(getPisaUrl() + "/version")
		if (response.ok) {
			return true
		} else {
			return false
		}
	} catch (error) {
		return false
	}
}
