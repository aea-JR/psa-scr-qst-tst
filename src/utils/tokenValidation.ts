let _tokenAuthActive = false;

/**
 * Update the internal token-validity flag.
 * Call this from your token validation logic once a JWT has been verified
 * and only if no user login session is active.
 */
export const setTokenAuthActive = (active: boolean) => {
	_tokenAuthActive = active;
}

/**
 * Indicates whether the app is currently using a valid JWT token.
 *
 * Returns **true** only if a token exists, has been validated, and the user
 * is not logged in.
 */
export const isTokenAuthActive = () => _tokenAuthActive;

