export const getFormClassNames = ({
	fixedFormHeight,
	formOverscrollBehavior,
	formScrollbarWidth,
}: {
	fixedFormHeight: boolean;
	formOverscrollBehavior: string;
	formScrollbarWidth: string;
}): string => {
	const classNames: string[] = [];

	if (fixedFormHeight) {
		classNames.push("fixed-container-height");
		if (formOverscrollBehavior === "none") {
			classNames.push("no-overscroll-y");
		}
		if (formScrollbarWidth === "thin") {
			classNames.push("thin-scrollbar");
		} else if (formScrollbarWidth === "none") {
			classNames.push("hidden-scrollbar");
		}
	}
	return classNames.join(" ");
};