import { useEffect, useState } from "react";

/**
 * Retrieves the computed background color of the nearest parent element
 * with a non-transparent background for a given DOM selector.
 *
 * @param selector - The CSS selector for the target element whose background color should be determined.
 *                   For example, ".my-class" or "#my-id".
 * 
 * @returns The background color as a string (e.g., "rgb(255, 255, 255)") or `null` if no valid background is found.
 *
 */
export const useDynamicBackground = (selector: string) => {
	const [backgroundColor, setBackgroundColor] = useState<string | null>(null);

	useEffect(() => {
		function getBackgroundColor(element: HTMLElement | null): string | null {
			if (!element) { return null; }

			const backgroundColor = window.getComputedStyle(element).backgroundColor;

			if (backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
				return backgroundColor;
			}
			return getBackgroundColor(element.parentElement as HTMLElement);
		}

		const element = document.querySelector(selector) as HTMLElement;
		if (element) {
			const bgColor = getBackgroundColor(element.parentElement);
			setBackgroundColor(bgColor);
		}
	}, [selector]);

	return backgroundColor;
};