import manhattanDistance from '../manhattanDistance';
import createPriorityQueue from '../priorityQueue';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function aStar(startNode: any, endNode: any, grid: any, gridNodeRefs: any) {
	const updateGrid = async (nodeToChange: any, type: string) => {
		if ((nodeToChange.isStart || nodeToChange.isEnd) && type !== 'path') return;

		if (type === 'open') {
			grid[nodeToChange.y][nodeToChange.x].isOpenSet = true;
			grid[nodeToChange.y][nodeToChange.x].isClosedSet = false;
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.add('open-set-node');
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.remove(
				'closed-set-node'
			);
		} else if (type === 'closed') {
			grid[nodeToChange.y][nodeToChange.x].isOpenSet = false;
			grid[nodeToChange.y][nodeToChange.x].isClosedSet = true;
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.add(
				'closed-set-node'
			);
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.remove(
				'open-set-node'
			);
		} else if (type === 'path') {
			grid[nodeToChange.y][nodeToChange.x].isOpenSet = false;
			grid[nodeToChange.y][nodeToChange.x].isClosedSet = false;
			grid[nodeToChange.y][nodeToChange.x].isPath = true;
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.add('path-node');
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.remove(
				'closed-set-node'
			);
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.remove(
				'open-set-node'
			);
		}
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
			await sleep(30);
			await updateGrid(node, 'path');
		}
		return;
	}

	const openSet = createPriorityQueue(); // priority queue to efficiently get lowest f score nodes
	const inOpenSet = new Set(); // used to track if nodes are in the openset or not
	startNode.gCost = 0;
	startNode.hCost = manhattanDistance(startNode, endNode);
	startNode.fCost = startNode.gCost + startNode.hCost;
	openSet.enqueue(startNode, startNode.fCost);
	inOpenSet.add(startNode.id);

	while (!openSet.isEmpty()) {
		await sleep(10);

		// get node in openSet with the lowest fCost
		let currentNode = openSet.dequeue();
		inOpenSet.delete(currentNode.id);

		// If we've reached the end, backtrack to find the path
		if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
			await reconstructPath(endNode);
			return true;
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

	// path not found
	return true;
}
