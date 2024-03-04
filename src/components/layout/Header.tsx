'use client';
import React, { useState } from 'react';
import Selections from './Selections';
import HelpModal from '../modals/HelpModal';

export default function Header() {
	const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(true);

	const toggleHelpMenu = () => {
		setIsHelpMenuOpen(!isHelpMenuOpen);
	};

	return (
		<header id="header">
			<h1>Pathfinding Visualizer</h1>
			<Selections />
			<button id="help-btn" className="selection-item" onClick={() => toggleHelpMenu()}>
				Help!
			</button>
			{isHelpMenuOpen && <HelpModal onClose={toggleHelpMenu} />}
		</header>
	);
}
