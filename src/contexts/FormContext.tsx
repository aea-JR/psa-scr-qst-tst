import * as React from "react";
import { AnswersDataClass } from "../config/scrivitoConfig";
import { DataItem, isInPlaceEditingActive, load, Widget } from "scrivito";
import { isEmpty } from "lodash-es";
import { usePisaStatusContext } from "./PisaStatusContext";

interface FormContextProps {
  answers: Map<string, { value: string[]; valueIdentifier: string[]; updatedAt: string }>;
  onChange: (questionId: string, value: string[], valueIdentifier?: string[]) => void;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  isSubmitting: boolean;
  successfullySent: boolean;
  submissionFailed: boolean;
  getAnswer: (questionId: string) => { value: string[]; valueIdentifier: string[]; updatedAt: string } | undefined;
}

const FormContext = React.createContext<FormContextProps | undefined>(undefined);

export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode, qstContainerWidget: Widget }> = ({ children, qstContainerWidget }) => {
  const activityId = qstContainerWidget.get("activityId") as string;
  const projectId = qstContainerWidget.get("projectId") as string;
  const contactId = qstContainerWidget.get("contactId") as string;
  const questionnaireId = qstContainerWidget.get("questionnaireId") as string;
  const showSubmittingPreview = qstContainerWidget.get("previewSubmittingMessage") || false;
  const showSubmittedPreview = qstContainerWidget.get("previewSubmittedMessage") || false;
  const showFailedPreview = qstContainerWidget.get("previewFailedMessage") || false;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successfullySent, setSuccessfullySent] = React.useState(false);
  const [submissionFailed, setSubmissionFailed] = React.useState(false);
  const [answers, setAnswers] = React.useState<Map<string, { value: string[]; valueIdentifier: string[]; updatedAt: string }>>(
    new Map()
  );
  const { isOnline } = usePisaStatusContext();
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
        console.log("not loading answers")
        return;
      }
      const answers = await load(() => {
        console.log("loading answers")

        return AnswersDataClass().all()
          // limit with question count + 1 ? 
          .transform({
            limit: 99,
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
  }, []);

  const extractAnswerData = (answerItem: DataItem) => {
    const questionId = answerItem.get("questionId");
    const value = answerItem.get("value") as string[] || [""];
    const valueIdentifier = answerItem.get("valueIdentifier") as string[] || [""];
    const updatedAt = answerItem.get("updatedAt") as string || new Date().toISOString();

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

    try {
      indicateProgress();
      //TODO: refactor
      const payload = {
        keys: {
          activityId,
          contactId,
          projectId,
        },
        data: Array.from(answers.entries()).map(([questionId, { value, valueIdentifier, updatedAt }]) => ({
          questionId,
          updatedAt,
          value,
          valueIdentifier,
        })),
      };

      console.log("Submitting payload:", payload);
      const answerItem = await AnswersDataClass().create(payload)
      console.log("answers created", answerItem.get("data"))
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
      getAnswer
    }}>
      {children}
    </FormContext.Provider>
  );
};