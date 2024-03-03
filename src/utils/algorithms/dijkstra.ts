const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function dijkstra(
	startNode: any,
	endNode: any,
	grid: any,
	gridNodeRefs: any,
	speed: number
) {
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
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.add('animated');
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
			if (speed !== 0) {
				await sleep(50);
			}
			await updateGrid(node, 'path');
		}
		return path;
	}

	const openSetQ = [];
	const closedSet = new Set();
	startNode.gCost = 0;
	openSetQ.push(startNode);

	while (openSetQ.length > 0) {
		if (speed !== 0) {
			await sleep(speed);
		}

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
