import manhattanDistance from '../manhattanDistance';

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
		await sleep(1);

		setGrid(newGrid);
		trackedGrid = [...newGrid];
	};

	async function reconstructPath(endNode: any) {
		const path = [];
		let currentNode = endNode;
		while (currentNode !== undefined && currentNode !== null) {
			await updateGrid(currentNode, 'path');
			path.unshift(currentNode);
			currentNode = currentNode.previousNode;
		}
		console.log(path);
		return path;
	}

	const openSet: any = []; // Consider using a priority queue for performance
	openSet.push(startNode);
	startNode.gCost = 0;
	startNode.hCost = manhattanDistance(startNode, endNode);

	while (openSet.length > 0) {
		// Find the node in openSet with the lowest fCost
		let currentNode = openSet.reduce((prev: any, curr: any) =>
			prev.fCost() < curr.fCost() ? prev : curr
		);

		// If we've reached the end, backtrack to find the path
		if (currentNode === endNode) {
			console.log('found end node');
			reconstructPath(endNode);
			return;
		}

		openSet.splice(openSet.indexOf(currentNode), 1); // Remove currentNode from openSet
		await updateGrid(currentNode, 'closed');
		for (const neighbor of currentNode.neighbors) {
			if (neighbor.isWall) return; // Skip walls

			const tentativeGCost = currentNode.gCost + 1; // Assume cost between neighbors is 1
			if (tentativeGCost < neighbor.gCost) {
				neighbor.previousNode = currentNode;
				neighbor.gCost = tentativeGCost;
				neighbor.hCost = manhattanDistance(neighbor, endNode);
				if (!openSet.includes(neighbor)) {
					openSet.push(neighbor);
					await updateGrid(neighbor, 'open');
				}
			}
		}
	}
}
