const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function dijkstra(startNode: any, endNode: any, grid: any, setGrid: any) {
	let trackedGrid = [...grid];

	const updateGrid = async (nodeToChange: any, type: string) => {
		if (nodeToChange.isStart || nodeToChange.isEnd) return;

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

	const openSetQ = [];
	const closedSet = new Set();
	startNode.gCost = 0;
	openSetQ.push(startNode);

	while (openSetQ.length > 0) {
		await sleep(0.1);

		let currentNode = openSetQ.shift();
		closedSet.add(currentNode);
		await updateGrid(currentNode, 'closed');

		// If we've reached the end, backtrack to find the path
		if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
			await reconstructPath(endNode);
			return true;
		}

		for (const neighbor of currentNode.neighbors) {
			if (closedSet.has(neighbor)) continue;

			const tentativeGCost = currentNode.gCost + 1; // cost between neighbors
			if (tentativeGCost < neighbor.gCost || neighbor.gCost === null) {
				neighbor.previousNode = currentNode;
				neighbor.gCost = tentativeGCost;

				// add neighbor to queue if it's not already in it and if it's not a wall
				if (!openSetQ.includes(neighbor) && !neighbor.isWall) {
					openSetQ.push(neighbor);
					await updateGrid(neighbor, 'open');
				}
			}
		}
	}

	// path not found
	return true;
}
