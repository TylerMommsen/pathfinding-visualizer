'use client';
import React from 'react';
import Selections from './selections';
import { useSelections } from '@/contexts/SelectionsContext';

export default function Header() {
	const { start, setStart } = useSelections();

	return (
		<header id="header">
			<h1>Pathfinding Visualizer</h1>
			<Selections start={start} setStart={setStart} />
			<p id="help-btn">Help!</p>
		</header>
	);
}
