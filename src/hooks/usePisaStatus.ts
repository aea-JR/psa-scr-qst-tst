import { useState, useCallback, useEffect, useRef } from "react";
import { isPisaConnected } from "../utils/isPisaConnected";

export const usePisaStatus = () => {
	const [isOnline, setIsOnline] = useState<boolean>(true);
	const hasFetched = useRef(false);

	const checkPisaStatus = useCallback(async () => {
		if (hasFetched.current) {
			return;
		}
		hasFetched.current = true;
		try {
			const online = await isPisaConnected();
			setIsOnline(online);
		} catch (err) {
			console.error("Failed to check Pisa status:", err);
			setIsOnline(false);
		}
	}, []);

	useEffect(() => {
		checkPisaStatus();
	}, [checkPisaStatus]);

	return { isOnline, refresh: checkPisaStatus };
};