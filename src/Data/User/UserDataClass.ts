import { DataClass, provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";


let UserDataClassInternal: DataClass;

export const registerUserDataClass = async () => {
  const config = await clientConfig("whoami", true);

  UserDataClassInternal = provideDataClass("User", {
    restApi: config,
    attributes: {},
  });
};

export const getUserDataClass = () => {
  if (!UserDataClassInternal) {
    return null;
  }
  return UserDataClassInternal;
};
