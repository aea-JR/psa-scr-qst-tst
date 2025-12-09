import * as React from "react";
import { DataItem, isInPlaceEditingActive, isUserLoggedIn, load, Widget } from "scrivito";
import { getAnswersDataClass } from "../Data/Answers/AnswersDataClass";
import { isEmpty } from "../utils/lodashPolyfills";
import { usePisaConnectionStatusContext } from "./PisaConnectionStatusContext";
import { useQuestionnaireStepsContext } from "./QuestionnaireStepsContext";
import { useQuestionnaireContextIds } from "../hooks/useQuestionnaireContextIds";
import { EXTERNAL_ID, INPUT_TYPE, PREVIEW_FAILED_MESSAGE, PREVIEW_SUBBMITTED_MESSAGE, PREVIEW_SUBMITTING_MESSAGE, QUESTION_ID, QUESTIONNAIRE_ID, REPEATABLE, UPDATED_AT, VALUE, VALUE_IDENTIFIER } from "../constants/constants";
import { useValidationContext } from "./ValidationContext";
import { isTokenAuthActive } from "../utils/tokenValidation";
import { isQuestionnaireAnonymous } from "../Data/isQuestionnaireAnonymous";

interface FormContextProps {
  answers: Map<string, { value: string[]; valueIdentifier: string[]; updatedAt: string }>;
  onChange: (questionId: string, value: string[], valueIdentifier?: string[]) => void;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  isSubmitting: boolean;
  successfullySent: boolean;
  submissionFailed: boolean;
  getAnswer: (questionId: string) => { value: string[]; valueIdentifier: string[]; updatedAt: string } | undefined;
  setExcludedFromSubmit: (questionId: string, isExcluded: boolean) => void;
  // Upload coordination
  beginUpload: (count?: number) => void;
  finishUpload: (count?: number) => void;
  hasPendingUploads: boolean;
}

const FormContext = React.createContext<FormContextProps | undefined>(undefined);

export const useFormContext = () => React.useContext(FormContext);


export const FormProvider: React.FC<{ children: React.ReactNode, qstContainerWidget: Widget }> = ({ children, qstContainerWidget }) => {
  const questionnaireId = qstContainerWidget.get(QUESTIONNAIRE_ID) as string;
  const inputType = qstContainerWidget.get(INPUT_TYPE) as string;
  const showSubmittingPreview = qstContainerWidget.get(PREVIEW_SUBMITTING_MESSAGE) || false;
  const showSubmittedPreview = qstContainerWidget.get(PREVIEW_SUBBMITTED_MESSAGE) || false;
  const showFailedPreview = qstContainerWidget.get(PREVIEW_FAILED_MESSAGE) || false;
  const exernalId = qstContainerWidget.get(EXTERNAL_ID) as string;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successfullySent, setSuccessfullySent] = React.useState(false);
  const [submissionFailed, setSubmissionFailed] = React.useState(false);
  const [answers, setAnswers] = React.useState<Map<string, { value: string[]; valueIdentifier: string[]; updatedAt: string }>>(
    new Map()
  );
  const [excludedAnswers, setExcludedAnswers] = React.useState<Record<string, boolean>>({});
  const [pendingUploads, setPendingUploads] = React.useState(0);

  const { activityId, contactId, projectId } = useQuestionnaireContextIds(qstContainerWidget);
  const { isOnline } = usePisaConnectionStatusContext();
  const { currentStep } = useQuestionnaireStepsContext();
  const { validate } = useValidationContext()!;
  const AnswersDataClass = getAnswersDataClass();

  React.useEffect(() => {
    if (!isInPlaceEditingActive()) {
      return;
    }
    if (showSubmittingPreview) {
      indicateProgress();
    } else if (showSubmittedPreview) {
      indicateSuccess();
    } else if (showFailedPreview) {
      indicateFailure();
    } else {
      setIsSubmitting(false);
      setSubmissionFailed(false);
      setSuccessfullySent(false);
    }
  }, [showFailedPreview, showSubmittedPreview, showSubmittingPreview]);

  const indicateProgress = React.useCallback(() => {
    setIsSubmitting(true);
    setSuccessfullySent(false);
    setSubmissionFailed(false);
  }, []);

  const indicateSuccess = React.useCallback(() => {
    setIsSubmitting(false);
    setSuccessfullySent(true);
    setSubmissionFailed(false);
  }, []);

  const indicateFailure = React.useCallback(() => {
    setIsSubmitting(false);
    setSuccessfullySent(false);
    setSubmissionFailed(true);
  }, []);

  const beginUpload = React.useCallback((count: number = 1) => {
    setPendingUploads((n) => n + Math.max(0, count));
  }, []);
  const finishUpload = React.useCallback((count: number = 1) => {
    setPendingUploads((n) => Math.max(0, n - Math.max(0, count)));
  }, []);
  const hasPendingUploads = pendingUploads > 0;

  React.useEffect(() => {
    const loadAnswers = async () => {
      if (isEmpty(questionnaireId)) {
        return;
      }
      if (!AnswersDataClass) {
        return;
      }
      if (!isOnline) {
        return;
      }
      if (inputType == REPEATABLE) {
        return;
      }
      // Load answers if token is valid, or if token is not valid
      // but the user is logged in and we have at least one context id
      const hasContext = !isEmpty(activityId) || !isEmpty(contactId) || !isEmpty(projectId);
      if (!isTokenAuthActive() && (!isUserLoggedIn() || !hasContext)) {
        return;
      }
      // respect anonymous flag!
      const isAnonym = await isQuestionnaireAnonymous(questionnaireId);
      if (isAnonym) {
        return;
      }

      const answers = await load(() => {
        const scope = AnswersDataClass.all();
        const transformParams: {
          limit: number;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filters?: any;
        } = { limit: 999 };

        // If token is valid, let the backend derive context entirely from the token
        // and do not apply any filters.
        if (!isTokenAuthActive()) {
          transformParams.filters = {
            questionnaireId: {
              operator: 'equals',
              value: questionnaireId,
            },
            activityId: {
              operator: 'equals',
              value: activityId,
            },
            projectId: {
              operator: 'equals',
              value: projectId,
            },
            contactId: {
              operator: 'equals',
              value: contactId,
            },
          };
        }

        return scope.transform(transformParams).take();
      })
      convertAndSetAnswers(answers);
    }
    loadAnswers();
  }, [isOnline, activityId, contactId, projectId]);

  const extractAnswerData = (answerItem: DataItem) => {
    const questionId = answerItem.get(QUESTION_ID);
    const value = answerItem.get(VALUE) as string[] || [""];
    const valueIdentifier = answerItem.get(VALUE_IDENTIFIER) as string[] || [""];
    const updatedAt = answerItem.get(UPDATED_AT) as string || new Date().toISOString();

    return { questionId, value, valueIdentifier, updatedAt };
  };

  const convertAndSetAnswers = (answerItems: DataItem[]) => {
    const newAnswers = new Map();

    for (const answerItem of answerItems) {
      const { questionId, value, valueIdentifier, updatedAt } = extractAnswerData(answerItem);
      if (questionId) {
        newAnswers.set(questionId, { value, valueIdentifier, updatedAt });
      }
    }
    setAnswers(newAnswers);
  };

  const onChange = (questionId: string, value: string[], valueIdentifier = [""]) => {
    validateAnswerInput(questionId, value, valueIdentifier);
    if (isEmpty(questionId)) {
      return;
    }
    const updatedAt = new Date().toISOString();
    setAnswers((prevData) => {
      const newData = new Map(prevData);
      newData.set(questionId, { value, valueIdentifier, updatedAt });
      return newData;
    });
  };

  const getAnswer = React.useCallback((questionId: string) => {
    return answers.get(questionId);
  }, [answers]);

  const setExcludedFromSubmit = (questionId: string, isExcluded: boolean) => {
    setExcludedAnswers((prev) => ({
      ...prev,
      [questionId]: isExcluded,
    }));
  };

  const validateAnswerInput = (questionId: string, value: string[], valueIdentifier: string[]) => {
    if (isInPlaceEditingActive()) {
      return;
    }
    if (isEmpty(questionId)) {
      throw new Error("Question ID cannot be empty.");
    }
    if (!Array.isArray(value) || !Array.isArray(valueIdentifier)) {
      throw new Error("Value and Value Identifier must be arrays.");
    }
  };

  const onSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (hasPendingUploads) {
      // Avoid submitting while uploads are in progress
      return;
    }
    const isValid = validate(exernalId as string, currentStep);
    if (!isValid) {
      return;
    }
    try {
      indicateProgress();

      const preparedAnswers = Array.from(answers.entries())
        .map(([questionId, { value, valueIdentifier, updatedAt }]) => ({
          questionId,
          updatedAt,
          value: excludedAnswers[questionId] ? [""] : value,
          valueIdentifier: excludedAnswers[questionId] ? [""] : valueIdentifier,
        }));

      const useContext = !isTokenAuthActive();
      const payload = useContext
        ? {
          keys: { activityId, contactId, projectId },
          data: preparedAnswers,
        }
        : {
          data: preparedAnswers,
        };
      await AnswersDataClass?.create(payload);
      indicateSuccess();
    } catch (error) {
      console.error(error)
      indicateFailure();
    }

  };

  return (
    <FormContext.Provider value={{
      answers, onChange, onSubmit, isSubmitting,
      successfullySent,
      submissionFailed,
      getAnswer,
      setExcludedFromSubmit,
      beginUpload,
      finishUpload,
      hasPendingUploads,
    }}>
      {children}
    </FormContext.Provider>
  );
};
