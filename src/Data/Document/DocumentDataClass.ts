import { DataClass, provideDataClass } from "scrivito";
import { clientConfig } from "../pisaClient";


let DocumentDataClassInternal: DataClass;
export const registerDocumentDataClass = async () => {
  const config = await clientConfig("questionnaire-document", true);
  DocumentDataClassInternal = provideDataClass("QuestionnaireDocument", {
    restApi: config,
    attributes: {

    },
  });
};

export const getDocumentDataClass = () => {
  if (!DocumentDataClassInternal) {
    return null;
  }
  return DocumentDataClassInternal;
};
