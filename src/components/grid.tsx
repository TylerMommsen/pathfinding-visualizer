'use client';
import { useSelections } from '@/contexts/SelectionsContext';
import { createNode } from '@/models/createNode';
import aStar from '@/utils/algorithms/astar';
import bidirectional from '@/utils/algorithms/bidirectional';
import dijkstra from '@/utils/algorithms/dijkstra';
import recursivedivision from '@/utils/mazes/recursivedivision';
import { useEffect, useState } from 'react';
import React from 'react';

const GRID_WIDTH = 90;
const GRID_HEIGHT = 40;

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
	const [startNodeIdx, setStartNodeIdx] = useState(
		Math.floor((GRID_WIDTH * GRID_HEIGHT - 1) / 2 - 70)
	);
	const [endNodeIdx, setEndNodeIdx] = useState(Math.floor((GRID_WIDTH * GRID_HEIGHT - 1) / 2 - 19));
	const [grid, setGrid] = useState(() => {
		const initialGrid = Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, index) => {
			const x = index % GRID_WIDTH;
			const y = Math.floor(index / GRID_WIDTH);
			const node = createNode(index, x, y);
			node.isStart = index === startNodeIdx;
			node.isEnd = index === endNodeIdx;
			return node;
		});
		addNeighbors(initialGrid, GRID_WIDTH, GRID_HEIGHT);
		return initialGrid;
	});
	const [isMouseDown, setIsMouseDown] = useState(false); // checks if user is clicking or dragging mouse
	const [mouseButton, setMouseButton] = useState<number>(1); // checks if left clicking or right clicking
	const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null); // checks if user is dragging start or end node
	const [temporaryNode, setTemporaryNode] = useState<number | null>(null); // used to visualize dragging start/end node

	const {
		start,
		setStart,
		selections,
		resetClicked,
		setResetClicked,
		clearPaths,
		setClearPaths,
		algorithmRunning,
		setAlgorithmRunning,
	} = useSelections();

	const resetFullGrid = () => {
		const newGrid = grid.map((node, index) => {
			return {
				...node,
				isPath: false,
				isOpenSet: false,
				isClosedSet: false,
				isWall: false,
				previousNode: null,
				gCost: Infinity,
				hCost: 0,
				neighbors: [],
			};
		});
		addNeighbors(newGrid, GRID_WIDTH, GRID_HEIGHT);
		setGrid(newGrid);
		setResetClicked(false);
	};

	const resetPaths = () => {
		const newGrid = grid.map((node, index) => {
			return {
				...node,
				isPath: false,
				isOpenSet: false,
				isClosedSet: false,
				previousNode: null,
				gCost: Infinity,
				hCost: 0,
				neighbors: [],
			};
		});
		addNeighbors(newGrid, GRID_WIDTH, GRID_HEIGHT);
		setGrid(newGrid);
		setClearPaths(false);
	};

	useEffect(() => {
		const runAlgorithm = async () => {
			if (start && selections.selectalgorithm) {
				let done = false;
				setAlgorithmRunning(true);

				if (selections.selectalgorithm === 'A*') {
					done = await aStar(grid[startNodeIdx], grid[endNodeIdx], grid, setGrid);
				} else if (selections.selectalgorithm === 'Dijkstra') {
					done = await dijkstra(grid[startNodeIdx], grid[endNodeIdx], grid, setGrid);
				} else if (selections.selectalgorithm === 'Bidirectional') {
					done = await bidirectional(grid[startNodeIdx], grid[endNodeIdx], grid, setGrid);
				}

				if (done) {
					console.log('finished');
					setAlgorithmRunning(false);
					setStart(false);
				}
			}
		};

		runAlgorithm();

		if (resetClicked) {
			resetFullGrid();
		}
		if (clearPaths) {
			resetPaths();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [start, resetClicked, clearPaths]);

	useEffect(() => {
		if (selections.selectmaze === 'Recursive Division') {
			recursivedivision(grid, setGrid);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selections.selectmaze]);

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
				// wherever the temp node is, make that the new start/end node
				if (index === temporaryNode) {
					draggingNode === 'start' ? setStartNodeIdx(index) : null;
					draggingNode === 'end' ? setEndNodeIdx(index) : null;

					return {
						...node,
						isStart: draggingNode === 'start',
						isEnd: draggingNode === 'end',
						isWall: false,
					};
				}
				// clear original position of start node to be empty
				if (draggingNode === 'start' && node.isStart) {
					return { ...node, isStart: false };
				}
				// clear original position of end node to be empty
				if (draggingNode === 'end' && node.isEnd) {
					return { ...node, isEnd: false };
				}
				return node;
			});
			addNeighbors(newGrid, GRID_WIDTH, GRID_HEIGHT);

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
		addNeighbors(newGrid, GRID_WIDTH, GRID_HEIGHT);

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
					${node.isWall ? 'wall-node' : ''} 
					${node.isOpenSet ? 'open-set-node' : ''} 
					${node.isClosedSet ? 'closed-set-node' : ''} 
					${node.isPath ? 'path-node' : ''} 
					${temporaryNode === index && draggingNode === 'start' ? 'temp-node' : ''}
					${temporaryNode === index && draggingNode === 'end' ? 'temp-node' : ''}`}
					onMouseDown={(event) => handleMouseDown(node.id, event)}
					onMouseEnter={() => handleMouseEnter(node.id)}
				>
					{(node.isStart && draggingNode !== 'start') ||
					(temporaryNode === index && draggingNode === 'start') ? (
						<>
							<svg
								fill="#000000"
								viewBox="0 0 1920 1920"
								xmlns="http://www.w3.org/2000/svg"
								transform="matrix(-1, 0, 0, 1, 0, 0)"
							>
								<g id="SVGRepo_bgCarrier" strokeWidth="1"></g>
								<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									{' '}
									<path
										d="m1394.006 0 92.299 92.168-867.636 867.767 867.636 867.636-92.299 92.429-959.935-960.065z"
										fillRule="evenodd"
									></path>{' '}
								</g>
							</svg>
						</>
					) : null}
					{(node.isEnd && draggingNode !== 'end') ||
					(temporaryNode === index && draggingNode === 'end') ? (
						<>
							<svg
								viewBox="0 0 20 20"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								fill="#000000"
							>
								<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
								<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									{' '}
									<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
										{' '}
										<g
											id="Dribbble-Light-Preview"
											transform="translate(-220.000000, -7759.000000)"
											fill="#000000"
										>
											{' '}
											<g id="icons" transform="translate(56.000000, 160.000000)">
												{' '}
												<path
													d="M174,7611 L178,7611 L178,7607 L174,7607 L174,7611 Z M170,7607 L174,7607 L174,7603 L170,7603 L170,7607 Z M174,7603 L178,7603 L178,7599 L174,7599 L174,7603 Z M182,7599 L182,7603 L178,7603 L178,7607 L182,7607 L182,7619 L184,7619 L184,7599 L182,7599 Z M166,7607 L170,7607 L170,7611 L166,7611 L166,7619 L164,7619 L164,7599 L170,7599 L170,7603 L166,7603 L166,7607 Z"
													id="finish_line-[#104]"
												>
													{' '}
												</path>{' '}
											</g>{' '}
										</g>{' '}
									</g>{' '}
								</g>
							</svg>
						</>
					) : null}
				</div>
			))}
		</div>
	);
}
