let _isTokenValid = false;

export const setIsTokenValid = (valid: boolean) => {
	_isTokenValid = valid;
}

export const isTokenValid = () => _isTokenValid;
