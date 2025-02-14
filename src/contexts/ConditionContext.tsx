import { createContext, FC, ReactNode, useContext } from "react";

interface ConditionContextProps {
	getConditionData: (externalId: string) => { isActive: boolean };
}
interface ConditionProviderProps {
	children: ReactNode;
	value: ConditionContextProps;
}

const ConditionContext = createContext<ConditionContextProps | undefined>(undefined);

export const useConditionContext = () => {
	const context = useContext(ConditionContext);
	if (!context) {
		throw new Error("useConditionContext must be used within a ConditionProvider");
	}
	return context;
};

export const ConditionProvider: FC<ConditionProviderProps> = ({ children, value }) => {
	return <ConditionContext.Provider value={value}>{children}</ConditionContext.Provider>;
};
