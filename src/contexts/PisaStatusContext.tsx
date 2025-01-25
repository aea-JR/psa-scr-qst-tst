import React, { createContext, useContext, useMemo } from "react";
import { usePisaStatus } from "../hooks/usePisaStatus";

const PisaStatusContext = createContext<{ isOnline: boolean | null; refresh: () => void } | undefined>(undefined);

export const PisaStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pisaStatus = usePisaStatus();

	const value = useMemo(() => pisaStatus, [pisaStatus.isOnline]);

	return <PisaStatusContext.Provider value={value}>{children}</PisaStatusContext.Provider>;
};

export const usePisaStatusContext = () => {
	const context = useContext(PisaStatusContext);
	if (!context) {
		throw new Error("usePisaStatusContext must be used within a PisaStatusProvider");
	}
	return context;
};
