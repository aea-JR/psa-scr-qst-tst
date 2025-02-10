import React, { createContext, useContext, useMemo } from "react";
import { usePisaConnectionStatus } from "../hooks/usePisaConnectionStatus";

const PisaConnectionStatusContext = createContext<{ isOnline: boolean; refresh: () => void } | undefined>(undefined);

export const PisaConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pisaStatus = usePisaConnectionStatus();

	const value = useMemo(() => pisaStatus, [pisaStatus.isOnline]);

	return <PisaConnectionStatusContext.Provider value={value}>{children}</PisaConnectionStatusContext.Provider>;
};

export const usePisaConnectionStatusContext = () => {
	const context = useContext(PisaConnectionStatusContext);
	if (!context) {
		throw new Error("usePisaConnectionStatusContext must be used within a PisaStatusProvider");
	}
	return context;
};
