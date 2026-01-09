import { useEffect, useMemo, useState } from "react";
import { isInPlaceEditingActive, isUserLoggedIn, Widget } from "scrivito";
import { FormProvider } from "../../contexts/FormContext";
import {
  QuestionnaireWidgetAttributesProvider,
  useQuestionnaireWidgetAttributesContext
} from "../../contexts/QuestionnaireWidgetAttributesContext";
import { getFormClassNames } from "../../utils/getFormClassNames";
import { useQuestionnaireWidgetAttributes } from "../../hooks/useQuestionnaireWidgetAttributes";
import { Questionnaire } from "../../Components/Questionnaire/Questionnaire";
import {
  PisaConnectionStatusProvider,
  usePisaConnectionStatusContext
} from "../../contexts/PisaConnectionStatusContext";
import { QuestionnaireStepsProvider } from "../../contexts/QuestionnaireStepsContext";
import { useEditModeSync } from "./useEditModeSync";
import { isQuestionnaireStructureValid } from "../../utils/isQuestionnaireStructureValid";
import { compareQuestionnaireMeta } from "../../utils/compareQuestionnaireMeta";
import { setQuestionnaireStatus } from "../../utils/questionnaireStatus";
import { isNil } from "../../utils/lodashPolyfills";
import { PisaDataClassProvider } from "../../contexts/PisaDataClassContext";
import { QuestionnaireStatus } from "../../types/questionnaire";
import { isUsageRestricted } from "../../utils/isRestricted";
import { getJwtToken } from "../../config/scrivitoConfig";
import { isTokenAuthActive } from "../../utils/tokenValidation";
import { ValidationProvider } from "../../contexts/ValidationContext";

const QuestionnaireContainerContentInner: React.FC<{ widget: Widget }> = ({ widget }) => {
  const {
    questionnaireId,
    fixedFormHeight,
    formHeight,
    formOverscrollBehavior,
    formScrollbarWidth,
    containerClassNames
  } = useQuestionnaireWidgetAttributesContext();
  const isValid = isQuestionnaireStructureValid(widget);
  const hasChanges = compareQuestionnaireMeta(widget);
  const { isOnline } = usePisaConnectionStatusContext();
  const isCreated = !!questionnaireId;
  const [internalStatus, setInternalStatus] = useState<QuestionnaireStatus>("void");
  const editMode = isInPlaceEditingActive();

  const usageRestricted = isUsageRestricted(widget);
  const loggedIn = isUserLoggedIn();
  const jwt = getJwtToken();
  const tokenValid = isTokenAuthActive();

  const nextStatus: QuestionnaireStatus = useMemo(() => {
    // order is important
    if (isNil(isOnline)) return "unconfiguredUrl";
    if (!isOnline) return "offline";
    if (!isValid) return "invalid";
    if (!isCreated) return "creationPending";
    if (hasChanges) return "pendingUpdate";
    if (usageRestricted && editMode) return "publicSiteEditMode"; // info only in edit mode

    // public site runtime cases
    if (usageRestricted && !editMode && !loggedIn && !jwt) return "publicSiteNoContext"; // no token && no login
    if (usageRestricted && !editMode && !loggedIn && jwt && !tokenValid) return "invalidToken"; // token present but invalid

    if (isCreated) return "void";
    return "void";
  }, [widget, isOnline, isValid, isCreated, hasChanges, usageRestricted, editMode, loggedIn, jwt, tokenValid]);

  useEffect(() => {
    if (internalStatus === nextStatus) return;
    setQuestionnaireStatus(nextStatus, widget);
    setInternalStatus(nextStatus);
  }, [nextStatus, internalStatus, widget]);

  const formClassNames = getFormClassNames({
    fixedFormHeight,
    formOverscrollBehavior,
    formScrollbarWidth
  });
  const containerStyle = fixedFormHeight ? { height: `${formHeight}em` } : {};
  return (
    <QuestionnaireStepsProvider qstContainerWidget={widget}>
      <FormProvider qstContainerWidget={widget}>
        <div
          className={`pisa-questionnaire-widgets questionnaire-container-widget ${containerClassNames} ${formClassNames} ${editMode ? "edit-mode" : ""
            }`}
          style={containerStyle}
        >
          <Questionnaire widget={widget} status={internalStatus} />
        </div>
      </FormProvider>
    </QuestionnaireStepsProvider>
  );
};

const QuestionnaireContainerContent: React.FC<{ widget: Widget }> = ({ widget }) => {
  const values = useQuestionnaireWidgetAttributes(widget);
  useEditModeSync(widget);

  return (
    <PisaDataClassProvider>
      <QuestionnaireWidgetAttributesProvider values={values}>
        <PisaConnectionStatusProvider>
          <ValidationProvider>
            <QuestionnaireContainerContentInner widget={widget} />
          </ValidationProvider>
        </PisaConnectionStatusProvider>
      </QuestionnaireWidgetAttributesProvider>
    </PisaDataClassProvider>
  );
};

export { QuestionnaireContainerContent };
export default QuestionnaireContainerContent;
