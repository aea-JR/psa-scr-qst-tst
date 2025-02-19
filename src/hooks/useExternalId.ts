import { useEffect } from "react";
import * as Scrivito from "scrivito";
import generateId from "../utils/idGenerator";
import { EXTERNAL_ID } from "../constants/constants";

export const useExternalId = (widget: Scrivito.Widget) => {
  useEffect(() => {
    try {
      if (!widget.get(EXTERNAL_ID) && Scrivito.isInPlaceEditingActive()) {
        console.log("useExternalId setting externalIsd from useExternalId");
        widget.update({ externalId: generateId() });
        console.log(" useExternalId Generated new externalId for widget:", widget.id());
      }
    } catch (error) {
      console.error("Error generating externalId:", error);
    }
  }, []);
};
