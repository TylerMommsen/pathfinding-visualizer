'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type SelectionsContextProvider = {
	children: React.ReactNode;
};

const SelectionsContext = createContext<any>(null);

export function SelectionsProvider({ children }: SelectionsContextProvider) {
	const [selections, setSelections] = useState<any>({
		selectalgorithm: 'A*',
		selectmaze: '',
		gridsize: 'Large',
		mazespeed: 'Normal',
		pathspeed: 'Normal',
	});

	const [resetClicked, setResetClicked] = useState(false);
	const [clearPaths, setClearPaths] = useState(false);
	const [start, setStart] = useState(false);
	const [algorithmRunning, setAlgorithmRunning] = useState(false);
	const [algorithmDone, setAlgorithmDone] = useState(false); // used for when user wants to drag start or end node to visualize other paths
	const [mazeGenerating, setMazeGenerating] = useState(false);

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
				algorithmRunning,
				setAlgorithmRunning,
				mazeGenerating,
				setMazeGenerating,
				algorithmDone,
				setAlgorithmDone,
			}}
		>
			{children}
		</SelectionsContext.Provider>
	);
}

export function useSelections() {
	return useContext(SelectionsContext);
}
