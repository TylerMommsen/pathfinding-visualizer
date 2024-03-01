'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type SelectionsContextProvider = {
	children: React.ReactNode;
};

const SelectionsContext = createContext<any>(null);

export function SelectionsProvider({ children }: SelectionsContextProvider) {
	const [selections, setSelections] = useState<any>({
		selectalgorithm: '',
		selectmaze: '',
		gridsize: 'Large',
		mazespeed: 'Normal',
		pathspeed: 'Normal',
	});

	const [resetClicked, setResetClicked] = useState(false);
	const [clearPaths, setClearPaths] = useState(false);
	const [start, setStart] = useState(false);

	return (
		<SelectionsContext.Provider
			value={{
				start,
				setStart,
				selections,
				setSelections,
				resetClicked,
				setResetClicked,
				clearPaths,
				setClearPaths,
			}}
		>
			{children}
		</SelectionsContext.Provider>
	);
}

export function useSelections() {
	return useContext(SelectionsContext);
}
