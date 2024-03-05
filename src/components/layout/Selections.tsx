'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelections } from '@/contexts/SelectionsContext';

type SelectionContentsType = {
	'Select Algorithm': string[];
	'Select Maze': string[];
	'Grid Size': string[];
	'Maze Speed': string[];
	'Path Speed': string[];
};

const selectionContents: SelectionContentsType = {
	'Select Algorithm': ['A*', 'Dijkstra', 'Bidirectional'],
	'Select Maze': [
		'Recursive Division',
		'Binary Tree',
		'Sidewinder',
		"Prim's",
		'Hunt And Kill',
		'Random Map',
	],
	'Grid Size': ['Small', 'Large'],
	'Maze Speed': ['Slow', 'Normal', 'Fast', 'Instant'],
	'Path Speed': ['Slow', 'Normal', 'Fast', 'Instant'],
};

type SelectionName = keyof SelectionContentsType;

export default function Selections() {
	const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
	const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	const {
		selections,
		setSelections,
		setResetClicked,
		setClearPaths,
		algorithmRunning,
		mazeGenerating,
		setStart,
	} = useSelections();

	const toggleDropdown = (selection: string | null) => {
		setVisibleDropdown(visibleDropdown === selection ? null : selection);
	};

	// close dropdown when user clicks elsewhere
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			let shouldCloseDropdown = true;
			Object.values(dropdownRefs.current).forEach((ref) => {
				if (ref && ref.contains(event.target as Node)) {
					shouldCloseDropdown = false;
				}
			});
			if (shouldCloseDropdown) {
				setVisibleDropdown(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// update selection
	const updateSelectionsContext = (selectionName: string, selection: string) => {
		if (mazeGenerating || algorithmRunning) return;
		// Convert selection name to state key format
		const stateKey = selectionName.toLowerCase().replace(' ', '');
		setSelections({ ...selections, [stateKey]: selection });
		toggleDropdown(null); // Close dropdown after selection
	};

	const DropdownContent = ({ selectionName }: { selectionName: SelectionName }) => {
		const content: string[] = selectionContents[selectionName];
		return (
			<div className="drop-down-content">
				{content.map((option: string, index: number) => (
					<button
						key={index}
						onClick={() => updateSelectionsContext(selectionName, option)}
						className={
							selections[selectionName.toLowerCase().replace(' ', '')] === option
								? 'currently-selected'
								: ''
						}
					>
						{option}
					</button>
				))}
			</div>
		);
	};

	return (
		<div id="selections">
			{Object.keys(selectionContents).map((selection, index) => (
				<div
					key={index}
					ref={(el) => (dropdownRefs.current[selection] = el)}
					onClick={() => toggleDropdown(selection)}
				>
					<span className="down-arrow">&#9660;</span>
					<button
						className={`selection-item ${
							visibleDropdown === selection ? 'currently-opened-menu' : 'null'
						}`}
					>
						{selection}
					</button>
					{visibleDropdown === selection && (
						<DropdownContent selectionName={selection as SelectionName} />
					)}
				</div>
			))}

			<div
				onClick={() => {
					if (!algorithmRunning && !mazeGenerating) setResetClicked(true);
				}}
			>
				<button className="selection-item">Reset</button>
			</div>

			<div
				onClick={() => {
					if (!algorithmRunning && !mazeGenerating) setClearPaths(true);
				}}
			>
				<button className="selection-item">Clear Paths</button>
			</div>

			<button
				id="start-btn"
				onClick={() => {
					if (!algorithmRunning && !mazeGenerating && selections.selectalgorithm) setStart(true);
				}}
				style={algorithmRunning || mazeGenerating ? { opacity: '0.8' } : {}}
			>
				{algorithmRunning ? 'Running...' : <>{mazeGenerating ? 'Generating...' : 'Start!'}</>}
			</button>
		</div>
	);
}
