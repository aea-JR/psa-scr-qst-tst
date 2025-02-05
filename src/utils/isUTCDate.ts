export const isUTCDate = (dateString: string): boolean => {
	if (typeof dateString !== "string") {
		return false;
	}

	const isoUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

	if (!isoUtcRegex.test(dateString)) {
		return false;
	}
	const date = new Date(dateString);
	return !isNaN(date.getTime());
};