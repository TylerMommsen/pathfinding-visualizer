import React from 'react';
import Selections from './selections';

export default function Header() {
	return (
		<header id="header">
			<h1>Pathfinding Visualizer</h1>
			<Selections />
			<p id="help-btn">Help!</p>
		</header>
	);
}
