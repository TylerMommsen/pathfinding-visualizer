import { createNode } from '@/models/createNode';
import React from 'react';

export default function Grid() {
	const grid = Array.from({ length: 90 * 40 }, (_, index) => createNode(index)); // create the grid

	return (
		<div id="grid">
			{grid.map((node, index) => (
				<div key={node.id} className="grid-node"></div>
			))}
		</div>
	);
}
