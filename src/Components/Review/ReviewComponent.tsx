import { FC, useEffect, useRef, useState } from "react";
import { ReviewContent, ReviewItemContent } from "../../types/review";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import "./review.scss";

interface ReviewProps {
  reviewContent: ReviewContent;
  onHide: () => void;
}
interface ReviewItemProps {
  item: ReviewItemContent;
}

export const Review: FC<ReviewProps> = ({
  reviewContent,
  onHide
}) => {
  const [show, setShow] = useState(false);
  const previousOverflowRef = useRef<string | null>(null);
  const { showReviewHeader, showStepsInReview, showReviewFooter, reviewHeaderTitle, reviewButtonText, reviewCloseButtonText } = useQuestionnaireWidgetAttributesContext();

  useEffect(() => {
    setShow(true);
    // save the current overflow value
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflowRef.current ?? "visible";
    };
  }, [reviewContent]);

  const handleClose = () => {
    setShow(false);
    onHide();
  };
  const handleOnClickContainer = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.currentTarget == event.target) {
      handleClose();
    }
  };
  return (
    <div
      onClick={(e) => handleOnClickContainer(e)}
      hidden={!show}
      className="questionnaire-review-form-modal"
    >
      <div className="review-modal-dialog">
        <div className="review-modal-content">
          {showReviewHeader && (
            <div className="review-modal-header">
              <h4>{reviewHeaderTitle}</h4>
            </div>
          )}
          <div className="review-modal-body form-review">
            {reviewContent.map((steps, i) => (
              <div
                className="step-review-container"
                key={"step-review-container-" + i}
              >
                {showStepsInReview && (
                  <h4 className="step-review">Step {i}</h4>
                )}
                {steps.map((d, i) => (
                  <ReviewItem key={"item-" + i} item={d} />
                ))}
              </div>
            ))}
          </div>
          {showReviewFooter && (
            <div className="review-modal-footer">
              <button className="" onClick={handleClose}>
                {reviewCloseButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewItem: React.FC<ReviewItemProps> = ({ item }) => {
  return (
    <div>
      <div className="review-item-title">
        <span>{item.title}</span>
      </div>
      <div className="review-item-value">{item.value}</div>
    </div>
  );
};
