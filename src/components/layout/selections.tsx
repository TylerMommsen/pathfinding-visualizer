'use client';
import React, { useState } from 'react';
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
	'Select Maze': ['Recursive Division', 'Binary Tree', 'Sidewinder', "Prim's", 'Hunt And Kill'],
	'Grid Size': ['Small', 'Large'],
	'Maze Speed': ['Slow', 'Normal', 'Fast'],
	'Path Speed': ['Slow', 'Normal', 'Fast'],
};

type SelectionName = keyof SelectionContentsType;

export default function Selections({ start, setStart }: any) {
	const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
	const { selections, setSelections, setResetClicked, setClearPaths } = useSelections();

	const toggleDropdown = (selection: string | null) => {
		setVisibleDropdown(visibleDropdown === selection ? null : selection);
	};

	const updateSelectionsContext = (selectionName: string, selection: string) => {
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
				<div key={index} onClick={() => toggleDropdown(selection)}>
					<span className="down-arrow">&#9660;</span>
					<button className="selection-item">{selection}</button>
					{visibleDropdown === selection && (
						<DropdownContent selectionName={selection as SelectionName} />
					)}
				</div>
			))}

			<div onClick={() => setResetClicked(true)}>
				<button className="selection-item">Reset</button>
			</div>

			<div onClick={() => setClearPaths(true)}>
				<button className="selection-item">Clear Paths</button>
			</div>

			<button id="visualize-btn" onClick={() => setStart(true)}>
				Start!
			</button>
		</div>
	);
}
