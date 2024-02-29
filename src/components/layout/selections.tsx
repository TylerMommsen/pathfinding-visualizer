'use client';
import React, { useState } from 'react';

const selections = ['Select Algorithm', 'Select Maze', 'Grid Size', 'Maze Speed', 'Path Speed'];

const SelectAlgorithmContent = ['A*', 'Dijkstra', 'Bidirectional'];
const SelectMazeContent = [
	'Recursive Division',
	'Binary Tree',
	'Sidewinder',
	"Prim's",
	'Hunt And Kill',
];
const GridSizeContent = ['Small', 'Large'];
const MazeSpeedContent = ['Slow', 'Normal', 'Fast'];
const PathSpeedContent = ['Slow', 'Normal', 'Fast'];

export default function Selections({ start, setStart }: any) {
	const [visibleDropdown, setVisibleDropdown] = useState<number | null>(null);

	const toggleDropdown = (index: number) => {
		setVisibleDropdown(visibleDropdown === index ? null : index);
	};

	const dropdownContent = (selection: string) => {
		let content = null;
		if (selection === 'Select Algorithm') content = SelectAlgorithmContent;
		if (selection === 'Select Maze') content = SelectMazeContent;
		if (selection === 'Grid Size') content = GridSizeContent;
		if (selection === 'Maze Speed') content = MazeSpeedContent;
		if (selection === 'Path Speed') content = PathSpeedContent;
		return (
			<div className="drop-down-content">
				{content?.map((selection, index) => (
					<button key={index}>{selection}</button>
				))}
			</div>
		);
	};

	return (
		<div id="selections">
			{selections.map((selection, index) => (
				<div key={index} onClick={() => toggleDropdown(index)}>
					<span className="down-arrow">&#9660;</span>
					<button className="selection-item">{selection}</button>
					{visibleDropdown === index && dropdownContent(selection)}
				</div>
			))}

			<div>
				<button className="selection-item">Reset</button>
			</div>

			<button id="visualize-btn" onClick={() => setStart(!start)}>
				Start!
			</button>
		</div>
	);
}
