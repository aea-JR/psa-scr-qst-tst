import { DateMode } from "../../../types/types";

/**
 * Pisa date → input-friendly string.
 * - "date":     YYYY-MM-DD
 * - "datetime": YYYY-MM-DDTHH:mm
 */
export const convertPisaDate = (pisa: string, mode: DateMode): string => {
	if (!pisa) return "";

	const year = pisa.substring(0, 4);
	const month = pisa.substring(4, 6);
	const day = pisa.substring(6, 8);

	if (mode === "date") {
		return `${year}-${month}-${day}`;
	}

	const hours = pisa.substring(8, 10) || "12";
	const minutes = pisa.substring(10, 12) || "00";
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * ISO-ish input → input-friendly string.
 * - "date":     YYYY-MM-DD   (keeps your original “UTC 12:00” approach)
 * - "datetime": YYYY-MM-DDTHH:mm (local time, no seconds, no Z)
 */
export const formatUTCDate = (input: string, mode: DateMode): string => {
	if (!input) return "";
	const d = new Date(input);
	if (isNaN(d.getTime())) return "";

	if (mode === "date") {
		// Match existing behavior: set to 12:00 UTC, then take the UTC date.
		const copy = new Date(d.getTime());
		copy.setUTCHours(12, 0, 0, 0);
		return copy.toISOString().split("T")[0]; // YYYY-MM-DD
	}

	// datetime: build LOCAL YYYY-MM-DDTHH:mm (what <input type="datetime-local"> expects)
	const pad = (n: number) => String(n).padStart(2, "0");
	const yyyy = d.getFullYear();
	const mm = pad(d.getMonth() + 1);
	const dd = pad(d.getDate());
	const hh = pad(d.getHours());
	const mi = pad(d.getMinutes());
	return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

/**
 * Helper: local "YYYY-MM-DDTHH:mm" → UTC ISO string (for saving).
 * Safe for values coming from <input type="datetime-local">.
 */
export const localDatetimeToUtcIso = (local: string): string => {
	if (!local) return "";
	const d = new Date(local);
	return isNaN(d.getTime()) ? "" : d.toISOString();
}

// keep one leading '-' only
export const normalizeMinus = (s: string) => {
	// remove all '-' then re-add one at start if the original started with '-'
	const startsNeg = s.startsWith("-");
	const noMinus = s.replace(/-/g, "");
	return startsNeg ? "-" + noMinus : noMinus;
};

export const sanitizeInteger = (s: string) => {
	let cleaned = s.replace(/[^\d-]/g, ""); // digits and '-'
	cleaned = normalizeMinus(cleaned);
	// if it's just '-', allow during typing, parent will validate later
	return cleaned;
};

export const sanitizeFloat = (s: string) => {
	// allow digits, comma, dot, minus
	let cleaned = s.replace(/[^0-9,.\-]/g, "");

	cleaned = normalizeMinus(cleaned);

	// keep only the first decimal separator of either '.' or ','
	const firstSepIndex = cleaned.search(/[.,]/);
	if (firstSepIndex !== -1) {
		const head = cleaned.slice(0, firstSepIndex + 1);
		const tail = cleaned.slice(firstSepIndex + 1).replace(/[.,]/g, ""); // remove later seps
		cleaned = head + tail;
	}

	// disallow a separator immediately after '-' (e.g., "-," -> "-")
	if (/^-[.,]$/.test(cleaned)) cleaned = "-";

	return cleaned;
};

// What we SEND to parent: always with dot as decimal, no trailing dot/comma
export const toParentFormat = (s: string, kind: string) => {
	if (!s) return "";
	let out = s;

	// unify decimal to dot
	if (kind === "floating_point") out = out.replace(",", ".");

	// strip any trailing dot (user half-typed)
	if (out.endsWith(".")) out = out.slice(0, -1);

	// allow lone '-' to pass through onChange (parent may decide validity)
	// but on blur we'll normalize further
	return out;
};