export type InputElements =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;

export type ReviewContent = Array<Array<ReviewItemContent>>;

export type ReviewItemContent = {
	title: string;
	value: string;
};
