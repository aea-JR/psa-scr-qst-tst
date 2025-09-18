import { ClientError, createRestApiClient, load } from "scrivito";
import { clientConfig } from "./pisaClient";

export const validateToken = () => {
	return load(async () => {
		try {
			const { url, ...options } = await clientConfig("whoami", true);
			const client = createRestApiClient(url, options);
			const response = await client.get('');
			return response ? true : false;
		} catch (e) {
			console.error(e);
			return false;
		}
	});
}