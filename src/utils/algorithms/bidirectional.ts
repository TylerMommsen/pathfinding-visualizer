const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function bidirectional(
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
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.remove(
				'closed-set-node'
			);
			gridNodeRefs.current[grid[nodeToChange.y][nodeToChange.x].id].classList.remove(
				'open-set-node'
			);
		}
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
			if (speed !== 0) {
				await sleep(50);
			}
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
		if (speed !== 0) {
			await sleep(speed);
		}

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
