import { createPortal } from "react-dom";
import { Review } from "./ReviewComponent";
import { FC, useEffect, useState } from "react";
import { prepareReviewContent } from "../../utils/prepareReviewContent";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { ReviewContent } from "../../types/review";

interface ReviewPortalProps {
	onHide: () => void;
}

export const ReviewPortal: FC<ReviewPortalProps> = ({
	onHide
}) => {

	const [reviewContent, setReviewContent] = useState<ReviewContent>([]);
	const { externalId, includeEmptyAnswers, steps } = useQuestionnaireWidgetAttributesContext();
	useEffect(() => {
		const content = prepareReviewContent(externalId, steps, includeEmptyAnswers,);
		setReviewContent(content);
	}, []);
	return createPortal(
		<Review reviewContent={reviewContent} onHide={onHide} />,
		document.body
	);
};
