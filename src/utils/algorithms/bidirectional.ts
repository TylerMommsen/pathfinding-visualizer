const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function bidirectional(startNode: any, endNode: any, grid: any, setGrid: any) {
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
	async function reconstructPath(node1: any, node2: any) {
		const pathForward = [];
		let currentNode = node1;
		while (currentNode !== null) {
			pathForward.unshift(currentNode);
			currentNode = currentNode.previousNode;
		}

		let pathBackward = [];
		currentNode = node2;
		while (currentNode !== null) {
			pathBackward.unshift(currentNode);
			currentNode = currentNode.previousNode;
		}

		pathBackward.reverse();
		const fullPath = pathForward.concat(pathBackward);

		for (const node of fullPath) {
			await sleep(1);
			await updateGrid(node, 'path');
		}
		return;
	}

	// nodes that have already been visited
	const visitedForwards = new Set();
	const visitedBackwards = new Set();

	// list of nodes that are yet to be checked
	const forwardsQ: any[] = [];
	const backwardsQ: any[] = [];

	startNode.gCost = 0;
	endNode.gCost = 0;
	forwardsQ.push(startNode);
	backwardsQ.push(endNode);

	while (forwardsQ.length > 0 && backwardsQ.length > 0) {
		await sleep(0.1);

		// forwards

		let currentNode = forwardsQ.shift();
		visitedForwards.add(currentNode);
		await updateGrid(currentNode, 'closed');

		const neighborsForward = currentNode.neighbors;

		for (const neighbor of neighborsForward) {
			if (visitedForwards.has(neighbor)) continue;

			if (visitedBackwards.has(neighbor) || backwardsQ.includes(neighbor)) {
				await reconstructPath(currentNode, neighbor);
				return true;
			}

			const tentativeGCost = currentNode.gCost + 1; // cost between neighbors
			if (tentativeGCost < neighbor.gCost || neighbor.gCost === null) {
				neighbor.previousNode = currentNode;
				neighbor.gCost = tentativeGCost;

				// add neighbor to openset if it's not already in it and if it's not a wall
				if (!forwardsQ.includes(neighbor) && !neighbor.isWall) {
					forwardsQ.push(neighbor);
					await updateGrid(neighbor, 'open');
				}
			}
		}

		// backwards

		currentNode = backwardsQ.shift();
		visitedBackwards.add(currentNode);
		await updateGrid(currentNode, 'closed');

		const neighborsBackward = currentNode.neighbors;

		for (const neighbor of neighborsBackward) {
			if (visitedBackwards.has(neighbor)) continue;

			const tentativeGCost = currentNode.gCost + 1; // cost between neighbors
			if (tentativeGCost < neighbor.gCost || neighbor.gCost === null) {
				neighbor.previousNode = currentNode;
				neighbor.gCost = tentativeGCost;

				// add neighbor to openset if it's not already in it and if it's not a wall
				if (!backwardsQ.includes(neighbor) && !neighbor.isWall) {
					backwardsQ.push(neighbor);
					await updateGrid(neighbor, 'open');
				}
			}
		}
	}

	// path not found
	return true;
}
