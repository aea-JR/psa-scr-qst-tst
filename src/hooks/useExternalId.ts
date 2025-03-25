import { useEffect } from "react";
import * as Scrivito from "scrivito";
import generateId from "../utils/idGenerator";
import { EXTERNAL_ID } from "../constants/constants";

export const useExternalId = (widget: Scrivito.Widget) => {
  useEffect(() => {
    try {
      if (!widget.get(EXTERNAL_ID) && Scrivito.isInPlaceEditingActive()) {
        widget.update({ externalId: generateId() });
      }
    } catch (error) {
      console.error("Error generating externalId:", error);
    }
  }, []);
};
