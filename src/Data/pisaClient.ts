import { createRestApiClient } from "scrivito";
import { getPisaUrl } from "../config/scrivitoConfig";

export const clientConfig = async (subPath: string) => {
  // const language = await getCurrentLanguage()
  return {
    url: `${getPisaUrl()}/${subPath}`,
    //TODO: improve
    headers: {
      "Accept-Language": "de",
    },
  };
};

export const pisaClient = async (subPath: string) => {
  const config = await clientConfig(subPath);
  const { headers } = config;

  return createRestApiClient(config.url, { headers });
};
