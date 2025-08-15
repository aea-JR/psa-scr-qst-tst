import { createRestApiClient } from "scrivito";
import { getJwtToken, getPisaUrl } from "../config/scrivitoConfig";

export const clientConfig = async (subPath: string, useToken = false) => {
  // const language = await getCurrentLanguage();
  const token = getJwtToken();

  const headers: Record<string, string> = {
    "Accept-Language": "de",
  };

  if (useToken && token) {
    headers.Authorization = token;
  }

  return {
    url: `${getPisaUrl()}/${subPath}`,
    //TODO: improve
    headers: headers
  };
};

export const pisaClient = async (subPath: string) => {
  const config = await clientConfig(subPath);
  const { headers } = config;

  return createRestApiClient(config.url, { headers });
};
