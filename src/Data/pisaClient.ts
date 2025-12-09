import { createRestApiClient } from "scrivito";
import { getJwtToken, getPisaUrl } from "../config/scrivitoConfig";
import { useWithToken } from "../utils/useWithToken";

export const clientConfig = async (subPath: string, useToken = false) => {
  // const language = await getCurrentLanguage();
  const token = getJwtToken();

  const headers: Record<string, string> = {
    "Accept-Language": "de",
  };
  // Fill token even if its invalid, real validation takes place elsewhere.
  // Token won`t be used if user is logged-in anyway
  if (token && useToken && useWithToken()) {
    headers.Authorization = token;
  }

  return {
    url: `${getPisaUrl()}/${subPath}`,
    headers: headers
  };
};

export const pisaClient = async (subPath: string) => {
  const config = await clientConfig(subPath);
  const { headers } = config;

  return createRestApiClient(config.url, { headers });
};
