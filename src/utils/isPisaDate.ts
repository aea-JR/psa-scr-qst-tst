export const isPisaDate = (date: string): boolean => {
	return /^\d{14}$/.test(date);
};