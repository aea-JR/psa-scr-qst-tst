import { lazy, Suspense } from "react";
import { provideComponent } from "scrivito";
import { QuestionnaireContainerWidget } from "./QuestionnaireContainerWidgetClass";
import "./QuestionnaireContainerWidget.scss";

const LazyQuestionnaireContainerContent = lazy(() => import("./QuestionnaireContainerContent"));

provideComponent(QuestionnaireContainerWidget, ({ widget }) => (
  <Suspense fallback={null}>
    <LazyQuestionnaireContainerContent widget={widget} />
  </Suspense>
));
