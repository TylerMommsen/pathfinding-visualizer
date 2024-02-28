'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type SelectionsContextProvider = {
	children: React.ReactNode;
};

const SelectionsContext = createContext<any>(null);

export function SelectionsProvider({ children }: SelectionsContextProvider) {
	const [selections, setSelections] = useState<any>({
		algorithm: null,
		maze: null,
		gridSize: null,
		mazeSpeed: null,
		pathSpeed: null,
	});

	const [resetClicked, setResetClicked] = useState(false);
	const [start, setStart] = useState(false);

	const value = { selections, setSelections, resetClicked, setResetClicked, start, setStart };

	return (
		<SelectionsContext.Provider value={{ start, setStart }}>{children}</SelectionsContext.Provider>
	);
}

export function useSelections() {
	return useContext(SelectionsContext);
}
