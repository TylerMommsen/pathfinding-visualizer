const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function huntandkill(
	grid: any,
	gridNodeRefs: any,
	gridWidth: number,
	gridHeight: number
) {
	const visited: any = [];

	const updateGrid = (yPos: number, xPos: number) => {
		grid[yPos][xPos].isWall = false;
		gridNodeRefs.current[grid[yPos][xPos].id].classList.remove('wall-node');
	};

	// add neighbors - directly adjacent neighbors are skipped so they can be walls if needed
	function getUnvisitedNeighbors(node: any) {
		const neighbors = [];
		const row = node.y;
		const col = node.x;

		if (row > 1) {
			if (!visited.includes(grid[row - 2][col])) {
				neighbors.push(grid[row - 2][col]); // up
			}
		}

		if (row < gridHeight - 2) {
			if (!visited.includes(grid[row + 2][col])) {
				neighbors.push(grid[row + 2][col]); // down
			}
		}

		if (col > 1) {
			if (!visited.includes(grid[row][col - 2])) {
				neighbors.push(grid[row][col - 2]); // left
			}
		}

		if (col < gridWidth - 2) {
			if (!visited.includes(grid[row][col + 2])) {
				neighbors.push(grid[row][col + 2]); // right
			}
		}

		return neighbors;
	}

	function getVisitedNeighbors(node: any) {
		const neighbors = [];
		const row = node.y;
		const col = node.x;

		if (row > 1) {
			if (visited.includes(grid[row - 2][col])) {
				neighbors.push(grid[row - 2][col]); // up
			}
		}

		if (row < gridHeight - 2) {
			if (visited.includes(grid[row + 2][col])) {
				neighbors.push(grid[row + 2][col]); // down
			}
		}

		if (col > 1) {
			if (visited.includes(grid[row][col - 2])) {
				neighbors.push(grid[row][col - 2]); // left
			}
		}

		if (col < gridWidth - 2) {
			if (visited.includes(grid[row][col + 2])) {
				neighbors.push(grid[row][col + 2]); // right
			}
		}

		return neighbors;
	}

	function randomlySelectNeighbor(neighbors: any) {
		const index = Math.floor(Math.random() * neighbors.length);
		return neighbors[index];
	}

	function generateStartPoint() {
		// choose a random point on the grid to start with
		let randomNodeFound = false;
		let randomFirstNode = null;
		while (!randomNodeFound) {
			const randomRow = Math.floor(Math.random() * (gridHeight - 4)) + 2;
			const randomCol = Math.floor(Math.random() * (gridWidth - 4)) + 2;
			if (randomRow % 2 !== 0 && randomCol % 2 !== 0) {
				randomFirstNode = grid[randomRow][randomCol];
				updateGrid(randomFirstNode.y, randomFirstNode.x);
				randomNodeFound = true;
			}
		}
		return randomFirstNode;
	}

	function removeWallBetween(currNode: any, nextNode: any) {
		const row = currNode.y;
		const col = currNode.x;

		if (row > 1) {
			if (grid[row - 2][col] === nextNode) {
				const wallBetween = grid[row - 1][col];
				updateGrid(wallBetween.y, wallBetween.x);
			}
		}
		if (row < gridHeight - 2) {
			if (grid[row + 2][col] === nextNode) {
				const wallBetween = grid[row + 1][col];
				updateGrid(wallBetween.y, wallBetween.x);
			}
		}
		if (col > 1) {
			if (grid[row][col - 2] === nextNode) {
				const wallBetween = grid[row][col - 1];
				updateGrid(wallBetween.y, wallBetween.x);
			}
		}
		if (col < gridWidth - 2) {
			if (grid[row][col + 2] === nextNode) {
				const wallBetween = grid[row][col + 1];
				updateGrid(wallBetween.y, wallBetween.x);
			}
		}

		updateGrid(currNode.y, currNode.x);
		updateGrid(nextNode.y, nextNode.x);
	}

	// fill grid
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			grid[row][col].isWall = true;
			gridNodeRefs.current[grid[row][col].id].classList.add('wall-node');
		}
	}

	let currentNode = generateStartPoint();
	while (currentNode) {
		await sleep(1);
		visited.push(currentNode);
		const neighbors = getUnvisitedNeighbors(currentNode);

		if (neighbors.length > 0) {
			const nextNode = randomlySelectNeighbor(neighbors);
			removeWallBetween(currentNode, nextNode);
			currentNode = nextNode;
		} else {
			currentNode = null;

			for (let row = 1; row < gridHeight - 1; row += 2) {
				for (let col = 1; col < gridWidth - 1; col += 2) {
					const node = grid[row][col];
					const visitedNodeNeighbors = getVisitedNeighbors(node);
					if (!visited.includes(node) && visitedNodeNeighbors.length > 0) {
						currentNode = node;
						const randomlySelectedNeighbor = randomlySelectNeighbor(visitedNodeNeighbors);
						removeWallBetween(currentNode, randomlySelectedNeighbor);
						break;
					}
				}
				if (currentNode) {
					break;
				}
			}
		}
	}

	return true;
}
