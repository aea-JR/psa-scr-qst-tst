import React, { useEffect, useState } from "react";
import { getPisaUrl } from "../config/scrivitoConfig";
import { Loading } from "../Components/Loading/Loading";
import { registerAnswersDataClass } from "../Data/Answers/AnswersDataClass";
import { registerAnswerOptionDataClass } from "../Data/AnswerOption/AnswerOptionDataClass";
import { registerQuestionDataClass } from "../Data/Question/QuestionDataClass";
import { registerQuestionnaireDataClass } from "../Data/Questionnaire/QuestionnaireDataClass";
import { connect, uiContext } from "scrivito";

export const PisaDataClassProvider: React.FC<{ children: React.ReactNode }> = connect(({ children }) => {
	const [isReady, setIsReady] = useState(false);
	const ctx = uiContext();

	const tryRegister = async () => {
		const url = getPisaUrl();

		if (!url) return;

		try {
			await registerAnswersDataClass()
			await registerAnswerOptionDataClass();
			await registerQuestionDataClass();
			await registerQuestionnaireDataClass();
			setIsReady(true);
		} catch (e) {
			console.error("Data class registration failed", e);
		}
	};

	useEffect(() => {
		tryRegister();

		const handleUrlChange = () => {
			setIsReady(false); // reset to force loading again
			tryRegister();
		};

		window.addEventListener("pisaUrlChanged", handleUrlChange);
		return () => window.removeEventListener("pisaUrlChanged", handleUrlChange);
	}, []);

	if (!isReady) return <Loading className={ctx ? `scrivito-${ctx?.theme}` : ""} />;

	return <>{children}</>;
})