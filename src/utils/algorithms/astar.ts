import manhattanDistance from '../manhattanDistance';
import createPriorityQueue from '../priorityQueue';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function aStar(startNode: any, endNode: any, grid: any, setGrid: any) {
	let trackedGrid = [...grid];

	const updateGrid = async (nodeToChange: any, type: string) => {
		const newGrid = trackedGrid.map((node: any, index: number) => {
			if (index === nodeToChange.id) {
				if (type === 'open') {
					return {
						...node,
						isOpenSet: true,
						isClosedSet: false,
					};
				} else if (type === 'closed') {
					return {
						...node,
						isClosedSet: true,
						isOpenSet: false,
					};
				} else if (type === 'path') {
					return {
						...node,
						isOpenSet: false,
						isClosedSet: false,
						isPath: true,
					};
				}
			}
			return node;
		});

		setGrid(newGrid);
		trackedGrid = [...newGrid];
	};

	// display final path
	async function reconstructPath(endNode: any) {
		const path = [];
		let currentNode = endNode;
		while (currentNode !== null) {
			path.unshift(currentNode);
			currentNode = currentNode.previousNode;
		}

		for (const node of path) {
			await sleep(1);
			await updateGrid(node, 'path');
		}
		return path;
	}

	const openSet = createPriorityQueue(); // priority queue to efficiently get lowest f score nodes
	const inOpenSet = new Set(); // used to track if nodes are in the openset or not
	startNode.gCost = 0;
	startNode.hCost = manhattanDistance(startNode, endNode);
	startNode.fCost = startNode.gCost + startNode.hCost;
	openSet.enqueue(startNode, startNode.fCost);
	inOpenSet.add(startNode.id);

	while (!openSet.isEmpty()) {
		await sleep(1);

		// get node in openSet with the lowest fCost
		let currentNode = openSet.dequeue();
		inOpenSet.delete(currentNode.id);

		// If we've reached the end, backtrack to find the path
		if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
			reconstructPath(endNode);
			return;
		}

		await updateGrid(currentNode, 'closed');

		for (const neighbor of currentNode.neighbors) {
			const tentativeGCost = currentNode.gCost + 1; // cost between neighbors
			if (tentativeGCost < neighbor.gCost || neighbor.gCost === null) {
				neighbor.previousNode = currentNode;
				neighbor.gCost = tentativeGCost;
				neighbor.hCost = manhattanDistance(neighbor, endNode);
				neighbor.fCost = neighbor.gCost + neighbor.hCost;

				// add neighbor to openset if it's not already in it and if it's not a wall
				if (!inOpenSet.has(neighbor.id) && !neighbor.isWall) {
					openSet.enqueue(neighbor, neighbor.fCost);
					inOpenSet.add(neighbor.id);
					await updateGrid(neighbor, 'open');
				}
			}
		}
	}
}
