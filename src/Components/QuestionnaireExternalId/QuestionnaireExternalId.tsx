import * as React from "react";
import * as Scrivito from "scrivito";

import generateId from "../../utils/idGenerator";
import "./QuestionnaireExternalId.scss";
import { ExternalIdInput } from "./ExternalIdInput";
import { EXTERNAL_ID } from "../../constants/constants";
interface QuestionnaireExternalIdComponentProps {
  widget: Scrivito.Widget;
}

export const QuestionnaireExternalIdComponent: React.FC<
  QuestionnaireExternalIdComponentProps
> = ({ widget }) => {
  const [currentId, setCurrentId] = React.useState<string>(
    widget.get(EXTERNAL_ID) as string,
  );
  const initialId = React.useRef<string>(widget.get(EXTERNAL_ID) as string);
  const uiContext = Scrivito.uiContext();
  if (!uiContext) return null;

  const onGenerateNewId = () => {
    const id = generateId();
    widget.update({ externalId: id });
    setCurrentId(id);
  };

  const onRestoreId = () => {
    widget.update({ externalId: initialId.current });
    setCurrentId(initialId.current);
  };

  const handleInputChange = (newValue: string) => {
    setCurrentId(newValue);
    widget.update({ externalId: newValue });
  };

  return (
    <div
      className={`questionnaire-external-id-tab-container scrivito-${uiContext.theme}`}
    >
      <div className="detail-content">
        <div className="detail-content-inner">
          <ExternalIdInput
            widget={widget}
            title="Questionnaire External ID"
            description="The reference ID to the Questionnaire GID."
            initialId={initialId.current}
            currentId={currentId}
            onGenerateNewId={onGenerateNewId}
            onRestoreId={onRestoreId}
            onInputChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

Scrivito.registerComponent(
  "QuestionnaireExternalIdComponent",
  QuestionnaireExternalIdComponent,
);
