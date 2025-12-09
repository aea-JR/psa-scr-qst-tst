import React, { useEffect, useState } from "react";
import { connect, uiContext } from "scrivito";
import { getPisaUrl, getPisaInitDispatched, getJwtToken } from "../config/scrivitoConfig";
import { Loading } from "../Components/Loading/Loading";
import { getAnswersDataClass, registerAnswersDataClass } from "../Data/Answers/AnswersDataClass";
import { getAnswerOptionDataClass, registerAnswerOptionDataClass } from "../Data/AnswerOption/AnswerOptionDataClass";
import { getQuestionDataClass, registerQuestionDataClass } from "../Data/Question/QuestionDataClass";
import { getQuestionnaireDataClass, registerQuestionnaireDataClass } from "../Data/Questionnaire/QuestionnaireDataClass";
import { getDocumentDataClass, registerDocumentDataClass } from "../Data/Document/DocumentDataClass";
import { isNil } from "../utils/lodashPolyfills";
import { validateToken } from "../Data/validateToken";
import { setTokenAuthActive } from "../utils/tokenValidation";

export const PisaDataClassProvider: React.FC<{ children: React.ReactNode }> = connect(({ children }) => {
	const [isReady, setIsReady] = useState<boolean | null>(null);
	const ctx = uiContext();

	const tryRegister = async () => {
		const url = getPisaUrl();

		try {
			if ((url) || !isNil(getPisaInitDispatched())) {
				!getAnswersDataClass() && await registerAnswersDataClass()
				!getAnswerOptionDataClass() && await registerAnswerOptionDataClass();
				!getQuestionDataClass() && await registerQuestionDataClass();
				!getQuestionnaireDataClass() && await registerQuestionnaireDataClass();
				!getDocumentDataClass() && await registerDocumentDataClass();

				if (getJwtToken()) {
					const isTokenValid = await validateToken();
					setTokenAuthActive(isTokenValid);
				}
				setIsReady(true);
			}
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

		if (typeof window !== "undefined") {
			window.addEventListener("pisaUrlChanged", handleUrlChange);
		}
		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("pisaUrlChanged", handleUrlChange);
			}
		};
	}, []);

	if (isNil(isReady)) return <Loading className={ctx ? `scrivito-${ctx?.theme}` : ""} />;

	return <>{children}</>;
})
