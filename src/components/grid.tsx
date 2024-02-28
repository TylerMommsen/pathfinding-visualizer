'use client';
import { createNode } from '@/models/createNode';
import { useState } from 'react';
import React from 'react';

const GRID_WIDTH = 90;
const GRID_HEIGHT = 40;
const START_NODE_IDX = 0;
const END_NODE_IDX = GRID_WIDTH * GRID_HEIGHT - 1;

export default function Grid() {
	const [grid, setGrid] = useState(
		Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, index) => {
			const node = createNode(index);
			node.isStart = index === START_NODE_IDX;
			node.isEnd = index === END_NODE_IDX;
			node.isWall = false;
			return node;
		})
	);
	const [isMouseDown, setIsMouseDown] = useState(false); // checks if user is clicking or dragging mouse
	const [mouseButton, setMouseButton] = useState<number>(1); // checks if left clicking or right clicking
	const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null); // checks if user is dragging start or end node
	const [temporaryNode, setTemporaryNode] = useState<number | null>(null); // used to visualize dragging start/end node

	const handleMouseDown = (nodeId: number, event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault(); // Prevent the default context menu
		setIsMouseDown(true);
		setMouseButton(event.button);

		const node = grid[nodeId];
		if (node.isStart || node.isEnd) {
			setDraggingNode(node.isStart ? 'start' : 'end');
			setTemporaryNode(nodeId);
		} else {
			// Regular node handling
			handleNodeClick(nodeId, event.button);
		}
	};

	const handleMouseEnter = (nodeId: number) => {
		if (!isMouseDown) return;

		if (!draggingNode) {
			handleNodeClick(nodeId, mouseButton);
		} else {
			if (grid[nodeId].isStart || grid[nodeId].isEnd) {
				return;
			} else {
				setTemporaryNode(nodeId);
			}
		}
	};

	const handleMouseUp = () => {
		if (draggingNode && temporaryNode !== null) {
			const newGrid = grid.map((node, index) => {
				if (index === temporaryNode) {
					return {
						...node,
						isStart: draggingNode === 'start',
						isEnd: draggingNode === 'end',
						isWall: false,
					};
				}
				if (draggingNode === 'start' && node.isStart) {
					return { ...node, isStart: false };
				}
				if (draggingNode === 'end' && node.isEnd) {
					return { ...node, isEnd: false };
				}
				return node;
			});
			setGrid(newGrid);
		}

		setIsMouseDown(false);
		setDraggingNode(null); // stop dragging the start/end node
		setTemporaryNode(null); // remove temp node visualization
	};

	// place or remove walls
	const handleNodeClick = (nodeId: number, clickType: number) => {
		const newGrid = grid.map((node) => {
			if (node.id === nodeId && !node.isStart && !node.isEnd) {
				return { ...node, isWall: clickType !== 2 }; // Toggle wall based on click type, except for start/end nodes
			}
			return node;
		});
		setGrid(newGrid);
	};

	// don't show context menu when user right clicks
	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault(); // Prevent the default context menu
	};

	return (
		<div
			id="grid"
			onMouseLeave={handleMouseUp}
			onMouseUp={handleMouseUp}
			onContextMenu={handleContextMenu}
		>
			{grid.map((node, index) => (
				<div
					key={node.id}
					className={`grid-node 
					${node.isEnd && draggingNode !== 'end' ? 'end-node' : null} 
					${node.isStart && draggingNode !== 'start' ? 'start-node' : null}
					${node.isWall ? 'wall-node' : ''} 
					${temporaryNode === index && draggingNode === 'start' ? 'temp-start-node' : null}
					${temporaryNode === index && draggingNode === 'end' ? 'temp-end-node' : null}`}
					onMouseDown={(event) => handleMouseDown(node.id, event)}
					onMouseEnter={() => handleMouseEnter(node.id)}
				></div>
			))}
		</div>
	);
}
