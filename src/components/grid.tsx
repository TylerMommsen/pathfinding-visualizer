'use client';
import { useSelections } from '@/contexts/SelectionsContext';
import { createNode } from '@/models/createNode';
import aStar from '@/utils/algorithms/astar';
import { useEffect, useState } from 'react';
import React from 'react';

const GRID_WIDTH = 90;
const GRID_HEIGHT = 40;
const START_NODE_IDX = Math.floor((GRID_WIDTH * GRID_HEIGHT - 1) / 2 - 70);
const END_NODE_IDX = Math.floor((GRID_WIDTH * GRID_HEIGHT - 1) / 2);

const addNeighbors = (grid: any, gridWidth: any, gridHeight: any) => {
	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			const node = grid[y * gridWidth + x];
			node.neighbors = getNeighbors(x, y, gridWidth, gridHeight, grid);
		}
	}
};

const getNeighbors = (x: any, y: any, gridWidth: any, gridHeight: any, grid: any) => {
	const neighbors = [];
	// Up
	if (y > 0) neighbors.push(grid[(y - 1) * gridWidth + x]);
	// Down
	if (y < gridHeight - 1) neighbors.push(grid[(y + 1) * gridWidth + x]);
	// Left
	if (x > 0) neighbors.push(grid[y * gridWidth + (x - 1)]);
	// Right
	if (x < gridWidth - 1) neighbors.push(grid[y * gridWidth + (x + 1)]);
	return neighbors;
};

export default function Grid() {
	const [grid, setGrid] = useState(() => {
		const initialGrid = Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, index) => {
			const x = index % GRID_WIDTH;
			const y = Math.floor(index / GRID_HEIGHT);
			const node = createNode(index, x, y);
			node.isStart = index === START_NODE_IDX;
			node.isEnd = index === END_NODE_IDX;
			node.isWall = false;
			node.isOpenSet = false;
			node.isClosedSet = false;
			node.isPath = false;
			return node;
		});
		addNeighbors(initialGrid, GRID_WIDTH, GRID_HEIGHT);
		return initialGrid;
	});
	const [isMouseDown, setIsMouseDown] = useState(false); // checks if user is clicking or dragging mouse
	const [mouseButton, setMouseButton] = useState<number>(1); // checks if left clicking or right clicking
	const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null); // checks if user is dragging start or end node
	const [temporaryNode, setTemporaryNode] = useState<number | null>(null); // used to visualize dragging start/end node

	const { start } = useSelections();

	useEffect(() => {
		if (start) {
			aStar(grid[START_NODE_IDX], grid[END_NODE_IDX], grid, setGrid);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [start]);

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
					${node.isEnd && draggingNode !== 'end' ? 'end-node' : ''} 
					${node.isStart && draggingNode !== 'start' ? 'start-node' : ''}
					${node.isWall ? 'wall-node' : ''} 
					${node.isOpenSet ? 'open-set-node' : ''} 
					${node.isClosedSet ? 'closed-set-node' : ''} 
					${node.isPath ? 'path-node' : ''} 
					${temporaryNode === index && draggingNode === 'start' ? 'temp-start-node' : ''}
					${temporaryNode === index && draggingNode === 'end' ? 'temp-end-node' : ''}`}
					onMouseDown={(event) => handleMouseDown(node.id, event)}
					onMouseEnter={() => handleMouseEnter(node.id)}
				></div>
			))}
		</div>
	);
}
