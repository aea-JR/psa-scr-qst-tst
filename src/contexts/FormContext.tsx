import * as React from "react";
import { AnswersDataClass } from "../config/scrivitoConfig";
import { DataItem, isInPlaceEditingActive, load, Widget } from "scrivito";
import { isEmpty } from "lodash-es";
import { usePisaConnectionStatusContext } from "./PisaConnectionStatusContext";
import { useQuestionnaireStepsContext } from "./QuestionnaireStepsContext";
import { useQuestionnaireContextIds } from "../hooks/useQuestionnaireContextIds";
import { DATA, INPUT_TYPE, PREVIEW_FAILED_MESSAGE, PREVIEW_SUBBMITTED_MESSAGE, PREVIEW_SUBMITTING_MESSAGE, QUESTION_ID, QUESTIONNAIRE_ID, UPDATED_AT, VALUE, VALUE_IDENTIFIER } from "../constants/constants";

interface FormContextProps {
  answers: Map<string, { value: string[]; valueIdentifier: string[]; updatedAt: string }>;
  onChange: (questionId: string, value: string[], valueIdentifier?: string[]) => void;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  isSubmitting: boolean;
  successfullySent: boolean;
  submissionFailed: boolean;
  getAnswer: (questionId: string) => { value: string[]; valueIdentifier: string[]; updatedAt: string } | undefined;
  setExcludedFromSubmit: (questionId: string, isExcluded: boolean) => void;
}

const FormContext = React.createContext<FormContextProps | undefined>(undefined);
const REPEATABLE = "PSA_QST_INP_TYP_REP";

export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode, qstContainerWidget: Widget }> = ({ children, qstContainerWidget }) => {
  const questionnaireId = qstContainerWidget.get(QUESTIONNAIRE_ID) as string;
  const inputType = qstContainerWidget.get(INPUT_TYPE) as string;
  const showSubmittingPreview = qstContainerWidget.get(PREVIEW_SUBMITTING_MESSAGE) || false;
  const showSubmittedPreview = qstContainerWidget.get(PREVIEW_SUBBMITTED_MESSAGE) || false;
  const showFailedPreview = qstContainerWidget.get(PREVIEW_FAILED_MESSAGE) || false;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successfullySent, setSuccessfullySent] = React.useState(false);
  const [submissionFailed, setSubmissionFailed] = React.useState(false);
  const [answers, setAnswers] = React.useState<Map<string, { value: string[]; valueIdentifier: string[]; updatedAt: string }>>(
    new Map()
  );
  const [excludedAnswers, setExcludedAnswers] = React.useState<Record<string, boolean>>({});

  const { activityId, contactId, projectId } = useQuestionnaireContextIds(qstContainerWidget);
  const { isOnline } = usePisaConnectionStatusContext();
  const { validateCurrentStep } = useQuestionnaireStepsContext();
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

  React.useEffect(() => {
    const loadAnswers = async () => {
      if (isEmpty(questionnaireId)) {
        return;
      }
      if (!isOnline) {
        console.log("not loading answersm offline!")
        return;
      }
      if (inputType == REPEATABLE) {
        console.log("repeatable mode, not loading answers");
        return;
      }
      if (isEmpty(activityId) && isEmpty(contactId) && isEmpty(projectId)) {
        console.log("not loading answers, no context found!")
        return;
      }
      const answers = await load(() => {
        console.log("loading answers")

        return AnswersDataClass().all()
          // limit with question count + 1 ? 
          .transform({
            limit: 999,
            filters: {
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
            },
          }).take()

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

  React.useEffect(() => {
    console.log("EXCLUDED:", excludedAnswers)
  }, [excludedAnswers])

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
    const isValid = validateCurrentStep();
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

      const payload = {
        keys: {
          activityId,
          contactId,
          projectId,
        },
        data: preparedAnswers,
      };

      console.log("Submitting payload:", payload);
      const answerItem = await AnswersDataClass().create(payload);
      console.log("answers created", answerItem.get(DATA))
      indicateSuccess();
    } catch (error) {
      console.log(error)
      indicateFailure();
    }

  };

  return (
    <FormContext.Provider value={{
      answers, onChange, onSubmit, isSubmitting,
      successfullySent,
      submissionFailed,
      getAnswer,
      setExcludedFromSubmit
    }}>
      {children}
    </FormContext.Provider>
  );
};