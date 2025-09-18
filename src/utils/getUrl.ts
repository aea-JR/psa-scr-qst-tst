/**
 * Split-based URL extraction for Scrivito edit-mode URLs.
 * Example:
 *   https://edit.scrivito.com/<...>~https://site.tld/en/page?jwt=abc&x=1
 * → https://site.tld/en/page   (query string stripped)
 */

/** Remove query string from a URL string. */
const stripQueryParams = (urlString: string): string => {
	const index = urlString.indexOf("?");
	if (index === -1) return urlString;
	return urlString.substring(0, index);
}

/**
 * Core extractor working on any href string.
 * - Split by '~' and take part[1] if exists, else part[0]
 * - Trim result
 * - Strip query string
 */
const getEffectiveUrlFromHref = (href: string): string => {
	if (!href) return "";
	const parts = href.split("~");
	const candidate = (parts[1] ?? parts[0] ?? "").trim();
	if (!candidate) return "";

	return stripQueryParams(candidate);
}

export const getEffectiveUrl = (): string => {

	if (typeof window !== "undefined" && window.location) {
		return getEffectiveUrlFromHref(window.location.href);
	}
	return "";
}