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
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Image from 'next/image';

const getNeighbors = (x: any, y: any, grid: any, gridHeight: number, gridWidth: number) => {
	const neighbors = [];
	// Up
	if (y > 0) neighbors.push(grid[y - 1][x]);
	// Down
	if (y < gridHeight - 1) neighbors.push(grid[y + 1][x]);
	// Left
	if (x > 0) neighbors.push(grid[y][x - 1]);
	// Right
	if (x < gridWidth - 1) neighbors.push(grid[y][x + 1]);

	return neighbors;
};

const createGrid = (width: number, height: number) => {
	const grid = Array.from({ length: height }, (_, y) =>
		Array.from({ length: width }, (_, x) => {
			const index = y * width + x;
			const node = createNode(index, x, y);
			return node;
		})
	);

	let start = {
		x: Math.floor(width / 2 - 10),
		y: Math.floor(height / 2),
	};
	let end = {
		x: Math.floor(width / 2 + 10),
		y: Math.floor(height / 2),
	};
	grid[start.y][start.x].isStart = true;
	grid[end.y][end.x].isEnd = true;

	// Add neighbors
	grid.forEach((row, y) =>
		row.forEach((node, x) => {
			node.neighbors = getNeighbors(x, y, grid, height, width);
		})
	);

	return grid;
};

export default function Grid() {
	const [gridState, setGridState] = useState({
		grid: createGrid(85, 35),
		width: 85,
		height: 35,
		nodeSize: '1.1vw',
	});
	const [startNodePos, setStartNodePos] = useState({
		x: Math.floor(gridState.width / 2 - 10),
		y: Math.floor(gridState.height / 2),
	});
	const [endNodePos, setEndNodePos] = useState({
		x: Math.floor(gridState.width / 2 + 10),
		y: Math.floor(gridState.height / 2),
	});
	const [mazeSpeed, setMazeSpeed] = useState(20);
	const [pathSpeed, setPathSpeed] = useState(20);
	const gridNodeRefs = useRef<any>({}); // using refs to improve performance

	const [isMouseDown, setIsMouseDown] = useState(false); // checks if user is clicking or dragging mouse
	const [mouseButton, setMouseButton] = useState<number>(1); // checks if left clicking or right clicking
	const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null); // checks if user is dragging start or end node
	const [temporaryNode, setTemporaryNode] = useState<any>({ x: null, y: null }); // used to visualize dragging start/end node

	const {
		start,
		setStart,
		selections,
		setSelections,
		resetClicked,
		setResetClicked,
		clearPaths,
		setClearPaths,
		mazeGenerating,
		algorithmRunning,
		setMazeGenerating,
		setAlgorithmRunning,
		algorithmDone,
		setAlgorithmDone,
	} = useSelections();

	// remove any paths/visualization from previous algorithms or reset will walls too
	const resetGrid = (full?: boolean) => {
		for (let row = 0; row < gridState.height; row++) {
			for (let col = 0; col < gridState.width; col++) {
				const node = gridState.grid[row][col];
				if (!gridNodeRefs.current[node.id]) return;

				node.isPath = false;
				node.isOpenSet = false;
				node.isClosedSet = false;
				node.previousNode = null;
				node.gCost = Infinity;
				node.hCost = 0;
				if (full) node.isWall = false;

				gridNodeRefs.current[node.id].classList.remove('open-set-node');
				gridNodeRefs.current[node.id].classList.remove('closed-set-node');
				gridNodeRefs.current[node.id].classList.remove('open-set-node');
				gridNodeRefs.current[node.id].classList.remove('path-node');
				gridNodeRefs.current[node.id].classList.remove('animated');
				if (full) gridNodeRefs.current[node.id].classList.remove('wall-node');
			}
		}

		if (!draggingNode) {
			setAlgorithmDone(false);
		}
		if (!full) setClearPaths(false); // if only reset paths is clicked
		// if a full grid reset is clicked
		if (full) {
			if (resetClicked) setSelections({ ...selections, selectmaze: '' });
			setResetClicked(false);
		}
	};

	// if an algorithm has been run and the user moves start/end, then visualize the new potential paths
	const reRunAlgorithm = async (row: number, col: number) => {
		resetGrid(false);

		if (draggingNode === 'start') {
			if (selections.selectalgorithm === 'A*') {
				let path = await aStar(
					gridState.grid[row][col],
					gridState.grid[endNodePos.y][endNodePos.x],
					gridState.grid,
					gridNodeRefs,
					0
				);
			} else if (selections.selectalgorithm === 'Dijkstra') {
				await dijkstra(
					gridState.grid[row][col],
					gridState.grid[endNodePos.y][endNodePos.x],
					gridState.grid,
					gridNodeRefs,
					0
				);
			} else if (selections.selectalgorithm === 'Bidirectional') {
				await bidirectional(
					gridState.grid[row][col],
					gridState.grid[endNodePos.y][endNodePos.x],
					gridState.grid,
					gridNodeRefs,
					0
				);
			}
		} else if (draggingNode === 'end') {
			if (selections.selectalgorithm === 'A*') {
				await aStar(
					gridState.grid[startNodePos.y][startNodePos.x],
					gridState.grid[row][col],
					gridState.grid,
					gridNodeRefs,
					0
				);
			} else if (selections.selectalgorithm === 'Dijkstra') {
				await dijkstra(
					gridState.grid[startNodePos.y][startNodePos.x],
					gridState.grid[row][col],
					gridState.grid,
					gridNodeRefs,
					0
				);
			} else if (selections.selectalgorithm === 'Bidirectional') {
				await bidirectional(
					gridState.grid[startNodePos.y][startNodePos.x],
					gridState.grid[row][col],
					gridState.grid,
					gridNodeRefs,
					0
				);
			}
		}
	};

	useEffect(() => {
		const runAlgorithm = async () => {
			if (start && selections.selectalgorithm) {
				resetGrid(false);
				let done = false;
				setAlgorithmRunning(true);
				setAlgorithmDone(false);

				if (selections.selectalgorithm === 'A*') {
					done = await aStar(
						gridState.grid[startNodePos.y][startNodePos.x],
						gridState.grid[endNodePos.y][endNodePos.x],
						gridState.grid,
						gridNodeRefs,
						pathSpeed
					);
				} else if (selections.selectalgorithm === 'Dijkstra') {
					done = await dijkstra(
						gridState.grid[startNodePos.y][startNodePos.x],
						gridState.grid[endNodePos.y][endNodePos.x],
						gridState.grid,
						gridNodeRefs,
						pathSpeed
					);
				} else if (selections.selectalgorithm === 'Bidirectional') {
					done = await bidirectional(
						gridState.grid[startNodePos.y][startNodePos.x],
						gridState.grid[endNodePos.y][endNodePos.x],
						gridState.grid,
						gridNodeRefs,
						pathSpeed
					);
				}

				if (done) {
					setAlgorithmRunning(false);
					setAlgorithmDone(true);
					setStart(false);
				}
			}
		};

		runAlgorithm();

		if (resetClicked) {
			resetGrid(true);
		}
		if (clearPaths) {
			resetGrid(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [start, resetClicked, clearPaths]);

	useEffect(() => {
		const generateMaze = async () => {
			if (!mazeGenerating && selections.selectmaze) {
				resetGrid(true);
				let done = false;
				setMazeGenerating(true);
				if (selections.selectmaze === 'Recursive Division') {
					done = await recursivedivision(
						gridState.grid,
						gridNodeRefs,
						gridState.width,
						gridState.height,
						mazeSpeed
					);
				} else if (selections.selectmaze === 'Binary Tree') {
					done = await binarytree(
						gridState.grid,
						gridNodeRefs,
						gridState.width,
						gridState.height,
						mazeSpeed
					);
				} else if (selections.selectmaze === 'Sidewinder') {
					done = await sidewinder(
						gridState.grid,
						gridNodeRefs,
						gridState.width,
						gridState.height,
						mazeSpeed
					);
				} else if (selections.selectmaze === "Prim's") {
					done = await prims(
						gridState.grid,
						gridNodeRefs,
						gridState.width,
						gridState.height,
						mazeSpeed
					);
				} else if (selections.selectmaze === 'Hunt And Kill') {
					done = await huntandkill(
						gridState.grid,
						gridNodeRefs,
						gridState.width,
						gridState.height,
						mazeSpeed
					);
				} else if (selections.selectmaze === 'Random Map') {
					done = await randommap(
						gridState.grid,
						gridNodeRefs,
						gridState.width,
						gridState.height,
						mazeSpeed
					);
				}

				if (done) setMazeGenerating(false);
			}
		};

		generateMaze();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selections.selectmaze]);

	// update grid size
	useEffect(() => {
		resetGrid(true);
		let newSize = '';
		let newWidth = 0;
		let newHeight = 0;
		if (selections.gridsize === 'Small') {
			newWidth = 49;
			newHeight = 19;
			newSize = '1.9vw';
		} else if (selections.gridsize === 'Large') {
			newWidth = 85;
			newHeight = 35;
			newSize = '1.1vw';
		}

		gridNodeRefs.current = {};
		const newGrid = createGrid(newWidth, newHeight);
		setGridState({
			grid: newGrid,
			width: newWidth,
			height: newHeight,
			nodeSize: newSize,
		});
		setStartNodePos({ x: Math.floor(newWidth / 2 - 10), y: Math.floor(newHeight / 2) });
		setEndNodePos({
			x: Math.floor(newWidth / 2 + 10),
			y: Math.floor(newHeight / 2),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selections.gridsize]);

	// update pathfinding speed or maze generation speed
	useEffect(() => {
		if (selections.pathspeed === 'Fast') {
			setPathSpeed(1);
		}
		if (selections.pathspeed === 'Normal') {
			setPathSpeed(20);
		}
		if (selections.pathspeed === 'Slow') {
			setPathSpeed(100);
		}
		if (selections.pathspeed === 'Instant') {
			setPathSpeed(0);
		}

		if (selections.mazespeed === 'Fast') {
			setMazeSpeed(1);
		}
		if (selections.mazespeed === 'Normal') {
			setMazeSpeed(20);
		}
		if (selections.mazespeed === 'Slow') {
			setMazeSpeed(100);
		}
		if (selections.mazespeed === 'Instant') {
			setMazeSpeed(0);
		}
	}, [selections.mazespeed, selections.pathspeed]);

	const handleMouseDown = (row: number, col: number, event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault(); // Prevent the default context menu
		setIsMouseDown(true);
		setMouseButton(event.button);

		if (algorithmRunning || mazeGenerating) return;

		const node = gridState.grid[row][col];
		if (node.isStart || node.isEnd) {
			setDraggingNode(node.isStart ? 'start' : 'end');
			setTemporaryNode({ x: col, y: row });
		} else {
			// Regular node handling
			handleNodeClick(row, col, event.button);
		}
	};

	const handleMouseLeave = (row: number, col: number) => {
		if (draggingNode && gridState.grid[row][col].isWall) {
			gridNodeRefs.current[gridState.grid[row][col].id].className = 'grid-node wall-node';
		}
	};

	const handleMouseEnter = async (row: number, col: number) => {
		if (!isMouseDown) return;

		if (!draggingNode) {
			handleNodeClick(row, col, mouseButton);
		} else {
			if (
				(gridState.grid[row][col].isStart && draggingNode === 'end') ||
				(gridState.grid[row][col].isEnd && draggingNode === 'start')
			) {
				return;
			} else {
				setTemporaryNode({ x: col, y: row });

				if (gridState.grid[row][col].isWall) {
					gridNodeRefs.current[gridState.grid[row][col].id].className = 'grid-node temp-node';
				}

				if (draggingNode === 'start') {
					gridState.grid[startNodePos.y][startNodePos.x].isStart = false;
				}
				if (draggingNode === 'end') {
					gridState.grid[endNodePos.y][endNodePos.x].isEnd = false;
				}

				// if an algorithm has been run and the user moves start/end, then visualize the new potential paths
				if (algorithmDone) {
					reRunAlgorithm(row, col);
				}
			}
		}
	};

	const handleMouseUp = () => {
		if (draggingNode && temporaryNode.x !== null && temporaryNode.y !== null) {
			if (draggingNode === 'start') {
				gridState.grid[startNodePos.y][startNodePos.x].isStart = false; // clear original start node

				// set new start node location
				setStartNodePos({ x: temporaryNode.x, y: temporaryNode.y });
				gridState.grid[temporaryNode.y][temporaryNode.x].isStart = true;
			} else if (draggingNode === 'end') {
				gridState.grid[endNodePos.y][endNodePos.x].isEnd = false; // clear original end node

				// set new end node location
				setEndNodePos({ x: temporaryNode.x, y: temporaryNode.y });
				gridState.grid[temporaryNode.y][temporaryNode.x].isEnd = true;
			}

			gridNodeRefs.current[gridState.grid[startNodePos.y][startNodePos.x].id].classList.remove(
				'temp-node'
			);
			gridNodeRefs.current[gridState.grid[temporaryNode.y][temporaryNode.x].id].classList.remove(
				'temp-node'
			);

			// if new start/end is on a wall, then remove that wall
			if (gridState.grid[temporaryNode.y][temporaryNode.x].isWall) {
				gridState.grid[temporaryNode.y][temporaryNode.x].isWall = false;
				gridNodeRefs.current[gridState.grid[temporaryNode.y][temporaryNode.x].id].classList.remove(
					'wall-node'
				);
			}
		}

		setIsMouseDown(false);
		setDraggingNode(null); // stop dragging the start/end node
		setTemporaryNode({ x: null, y: null }); // remove temp node visualization
	};

	// place or remove walls (left/right click)
	const handleNodeClick = (row: number, col: number, clickType: number) => {
		if (mazeGenerating || algorithmRunning) return;
		if (gridState.grid[row][col].isStart || gridState.grid[row][col].isEnd) return;

		const nodeRef = gridNodeRefs.current[gridState.grid[row][col].id];
		if (nodeRef) {
			if (clickType == 0) {
				gridState.grid[row][col].isWall = true;
				nodeRef.classList.add('wall-node');
				nodeRef.classList.add('animated');
			} else if (clickType == 2) {
				gridState.grid[row][col].isWall = false;
				nodeRef.classList.remove('wall-node');
				nodeRef.classList.remove('animated');
			}
		}
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
			style={{ gridTemplateColumns: `repeat(${gridState.width}, 1fr)` }}
		>
			{gridState.grid.map((row, rowIndex) =>
				row.map((node, colIndex) => (
					<div
						key={node.id}
						ref={(el) => (gridNodeRefs.current[node.id] = el)}
						className={`grid-node`}
						onMouseDown={(event) => handleMouseDown(rowIndex, colIndex, event)}
						onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
						onMouseLeave={() => handleMouseLeave(rowIndex, colIndex)}
						style={{
							width: gridState.nodeSize,
							height: gridState.nodeSize,
						}}
					>
						{(node.isStart && draggingNode !== 'start') ||
						(temporaryNode.x === node.x &&
							temporaryNode.y === node.y &&
							draggingNode === 'start') ? (
							// SVG for start node
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									{' '}
									<path
										d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V3.6L8.22067 3.25587C9.8712 2.92576 11.5821 3.08284 13.1449 3.70797L13.3486 3.78943C14.9097 4.41389 16.628 4.53051 18.2592 4.1227C19.0165 3.93339 19.75 4.50613 19.75 5.28669V12.6537C19.75 13.298 19.3115 13.8596 18.6864 14.0159L18.472 14.0695C16.7024 14.5119 14.8385 14.3854 13.1449 13.708C11.5821 13.0828 9.8712 12.9258 8.22067 13.2559L6.5 13.6V21.75C6.5 22.1642 6.16421 22.5 5.75 22.5C5.33579 22.5 5 22.1642 5 21.75V1.75C5 1.33579 5.33579 1 5.75 1Z"
										fill="#292929"
									></path>{' '}
								</g>
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
