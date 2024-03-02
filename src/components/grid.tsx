'use client';
import { useSelections } from '@/contexts/SelectionsContext';
import createNode from '@/models/createNode';
import aStar from '@/utils/algorithms/astar';
import bidirectional from '@/utils/algorithms/bidirectional';
import dijkstra from '@/utils/algorithms/dijkstra';
import binarytree from '@/utils/mazes/binarytree';
import huntandkill from '@/utils/mazes/huntandkill';
import prims from '@/utils/mazes/prims';
import randommap from '@/utils/mazes/randommap';
import recursivedivision from '@/utils/mazes/recursivedivision';
import sidewinder from '@/utils/mazes/sidewinder';
import { useEffect, useState } from 'react';
import React from 'react';

const GRID_WIDTH = 81;
const GRID_HEIGHT = 35;
const defaultStartPos = {
	x: Math.floor(GRID_WIDTH / 2 - 10),
	y: Math.floor(GRID_HEIGHT / 2),
};
const defaultEndPos = {
	x: Math.floor(GRID_WIDTH / 2 + 10),
	y: Math.floor(GRID_HEIGHT / 2),
};

const getNeighbors = (x: any, y: any, grid: any) => {
	const neighbors = [];
	// Up
	if (y > 0) neighbors.push(grid[y - 1][x]);
	// Down
	if (y < GRID_HEIGHT - 1) neighbors.push(grid[y + 1][x]);
	// Left
	if (x > 0) neighbors.push(grid[y][x - 1]);
	// Right
	if (x < GRID_WIDTH - 1) neighbors.push(grid[y][x + 1]);

	return neighbors;
};

const initGrid = (startNodePos: any, endNodePos: any) => {
	const grid = Array.from({ length: GRID_HEIGHT }, (_, y) =>
		Array.from({ length: GRID_WIDTH }, (_, x) => {
			const index = y * GRID_WIDTH + x;
			const node = createNode(index, x, y);
			return node;
		})
	);

	grid[startNodePos.y][startNodePos.x].isStart = true;
	grid[endNodePos.y][endNodePos.x].isEnd = true;

	// Add neighbors
	grid.forEach((row, y) =>
		row.forEach((node, x) => {
			node.neighbors = getNeighbors(x, y, grid);
		})
	);

	return grid;
};

export default function Grid() {
	const [startNodePos, setStartNodePos] = useState(defaultStartPos);
	const [endNodePos, setEndNodePos] = useState(defaultEndPos);
	const [grid, setGrid] = useState(initGrid(startNodePos, endNodePos));

	const [isMouseDown, setIsMouseDown] = useState(false); // checks if user is clicking or dragging mouse
	const [mouseButton, setMouseButton] = useState<number>(1); // checks if left clicking or right clicking
	const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null); // checks if user is dragging start or end node
	const [temporaryNode, setTemporaryNode] = useState<any>({ x: null, y: null }); // used to visualize dragging start/end node

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
		let newGrid = grid.map((gridRow: any, rowIndex: number) => {
			return gridRow.map((node: any, colIndex: number) => {
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
		});

		// Add neighbors
		newGrid.forEach((row, y) => {
			row.forEach((node: any, x: number) => {
				node.neighbors = getNeighbors(x, y, newGrid);
			});
		});

		setGrid(newGrid);
		setResetClicked(false);
	};

	const resetPaths = () => {
		let newGrid = grid.map((gridRow: any, rowIndex: number) => {
			return gridRow.map((node: any, colIndex: number) => {
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
		});

		// Add neighbors
		newGrid.forEach((row, y) => {
			row.forEach((node: any, x: number) => {
				node.neighbors = getNeighbors(x, y, newGrid);
			});
		});

		setGrid(newGrid);
		setClearPaths(false);
	};

	useEffect(() => {
		const runAlgorithm = async () => {
			if (start && selections.selectalgorithm) {
				let done = false;
				setAlgorithmRunning(true);

				if (selections.selectalgorithm === 'A*') {
					done = await aStar(
						grid[startNodePos.y][startNodePos.x],
						grid[endNodePos.y][endNodePos.x],
						grid,
						setGrid
					);
				} else if (selections.selectalgorithm === 'Dijkstra') {
					done = await dijkstra(
						grid[startNodePos.y][startNodePos.x],
						grid[endNodePos.y][endNodePos.x],
						grid,
						setGrid
					);
				} else if (selections.selectalgorithm === 'Bidirectional') {
					done = await bidirectional(
						grid[startNodePos.y][startNodePos.x],
						grid[endNodePos.y][endNodePos.x],
						grid,
						setGrid
					);
				}

				if (done) {
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
			recursivedivision(grid, setGrid, GRID_WIDTH, GRID_HEIGHT);
		}
		if (selections.selectmaze === 'Binary Tree') {
			binarytree(grid, setGrid, GRID_WIDTH, GRID_HEIGHT);
		}
		if (selections.selectmaze === 'Sidewinder') {
			sidewinder(grid, setGrid, GRID_WIDTH, GRID_HEIGHT);
		}
		if (selections.selectmaze === "Prim's") {
			prims(grid, setGrid, GRID_WIDTH, GRID_HEIGHT);
		}
		if (selections.selectmaze === 'Hunt And Kill') {
			huntandkill(grid, setGrid, GRID_WIDTH, GRID_HEIGHT);
		}
		if (selections.selectmaze === 'Random Map') {
			randommap(grid, setGrid, GRID_WIDTH, GRID_HEIGHT);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selections.selectmaze]);

	const handleMouseDown = (row: number, col: number, event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault(); // Prevent the default context menu
		setIsMouseDown(true);
		setMouseButton(event.button);

		const node = grid[row][col];
		if (node.isStart || node.isEnd) {
			setDraggingNode(node.isStart ? 'start' : 'end');
			setTemporaryNode({ x: col, y: row });
		} else {
			// Regular node handling
			handleNodeClick(row, col, event.button);
		}
	};

	const handleMouseEnter = (row: number, col: number) => {
		if (!isMouseDown) return;

		if (!draggingNode) {
			handleNodeClick(row, col, mouseButton);
		} else {
			if (grid[row][col].isStart || grid[row][col].isEnd) {
				return;
			} else {
				setTemporaryNode({ x: col, y: row });
			}
		}
	};

	const handleMouseUp = () => {
		if (draggingNode && temporaryNode.x !== null && temporaryNode.y !== null) {
			// create a deep copy of the grid
			const newGrid = grid.map((gridRow, rowIndex) => {
				return gridRow.map((node, colIndex) => {
					return node;
				});
			});

			// clear original start/end node
			if (draggingNode === 'start') {
				newGrid[startNodePos.y][startNodePos.x].isStart = false;
			} else if (draggingNode === 'end') {
				newGrid[endNodePos.y][endNodePos.x].isEnd = false;
			}

			// wherever the temp node is, make that the new start/end node
			if (draggingNode === 'start') setStartNodePos({ x: temporaryNode.x, y: temporaryNode.y });
			if (draggingNode === 'end') setEndNodePos({ x: temporaryNode.x, y: temporaryNode.y });
			newGrid[temporaryNode.y][temporaryNode.x].isStart = draggingNode === 'start';
			newGrid[temporaryNode.y][temporaryNode.x].isEnd = draggingNode === 'end';

			setGrid(newGrid);
		}

		setIsMouseDown(false);
		setDraggingNode(null); // stop dragging the start/end node
		setTemporaryNode({ x: null, y: null }); // remove temp node visualization
	};

	// place or remove walls
	const handleNodeClick = (row: number, col: number, clickType: number) => {
		let newGrid = grid.map((gridRow: any, rowIndex: number) => {
			return gridRow.map((node: any, colIndex: number) => {
				return node;
			});
		});

		newGrid[row][col].isWall = clickType !== 2;

		setGrid(newGrid);
	};

	// don't show context menu when user right clicks
	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	return (
		<div
			id="grid"
			onMouseLeave={handleMouseUp}
			onMouseUp={handleMouseUp}
			onContextMenu={handleContextMenu}
		>
			{grid.map((row, rowIndex) =>
				row.map((node, colIndex) => (
					<div
						key={node.id}
						className={`grid-node 
                ${node.isWall ? 'wall-node' : ''} 
                ${node.isOpenSet ? 'open-set-node' : ''} 
                ${node.isClosedSet ? 'closed-set-node' : ''} 
                ${node.isPath ? 'path-node' : ''} 
                ${
									temporaryNode.x === node.x &&
									temporaryNode.y === node.y &&
									draggingNode === 'start'
										? 'temp-node'
										: ''
								}
                ${
									temporaryNode.x === node.x && temporaryNode.y === node.y && draggingNode === 'end'
										? 'temp-node'
										: ''
								}`}
						onMouseDown={(event) => handleMouseDown(rowIndex, colIndex, event)}
						onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
					>
						{(node.isStart && draggingNode !== 'start') ||
						(temporaryNode.x === node.x &&
							temporaryNode.y === node.y &&
							draggingNode === 'start') ? (
							// SVG for start node
							<svg
								fill="#000000"
								viewBox="0 0 1920 1920"
								xmlns="http://www.w3.org/2000/svg"
								transform="matrix(-1, 0, 0, 1, 0, 0)"
							>
								<path
									d="m1394.006 0 92.299 92.168-867.636 867.767 867.636 867.636-92.299 92.429-959.935-960.065z"
									fillRule="evenodd"
								></path>
							</svg>
						) : null}
						{(node.isEnd && draggingNode !== 'end') ||
						(temporaryNode.x === node.x && temporaryNode.y === node.y && draggingNode === 'end') ? (
							// SVG for end node
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
									<title>finish_line [#104]</title> <desc>Created with Sketch.</desc> <defs> </defs>{' '}
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
						) : null}
					</div>
				))
			)}
		</div>
	);
}
