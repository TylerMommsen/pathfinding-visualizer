const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function prims(
	grid: any,
	setGrid: any,
	gridWidth: number,
	gridHeight: number
) {
	const frontier: any = [];
	const visited = new Set();

	const updateGrid = (yPos: number, xPos: number) => {
		let gridCopy = grid.map((gridRow: any, rowIndex: number) => {
			return gridRow.map((node: any, colIndex: number) => {
				return node;
			});
		});
		gridCopy[yPos][xPos].isWall = false;
		setGrid(gridCopy);
	};

	// add neighbors - directly adjacent neighbors are skipped so they can be walls if needed
	function getNeighbors(node: any) {
		const neighbors = [];
		const row = node.y;
		const col = node.x;

		if (row > 1) neighbors.push(grid[row - 2][col]); // up

		if (row < gridHeight - 2) neighbors.push(grid[row + 2][col]); // down

		if (col > 1) neighbors.push(grid[row][col - 2]); // left

		if (col < gridWidth - 2) neighbors.push(grid[row][col + 2]); // right

		return neighbors;
	}

	function getWallBetween(node: any, neighbor: any) {
		const row = node.y;
		const col = node.x;

		if (row > 1) {
			if (grid[row - 2][col] === neighbor) return grid[row - 1][col]; // up
		}
		if (row < gridHeight - 2) {
			if (grid[row + 2][col] === neighbor) return grid[row + 1][col]; // down
		}
		if (col > 1) {
			if (grid[row][col - 2] === neighbor) return grid[row][col - 1]; // left
		}
		if (col < gridWidth - 2) {
			if (grid[row][col + 2] === neighbor) return grid[row][col + 1]; // right
		}

		return null;
	}

	// fill grid
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			let gridCopy = grid.map((gridRow: any, rowIndex: number) => {
				return gridRow.map((node: any, colIndex: number) => {
					return node;
				});
			});
			gridCopy[row][col].isWall = true;
			setGrid(gridCopy);
		}
	}

	const connect = (node1: any, node2: any, wallBetween: any) => {
		updateGrid(node1.y, node1.x);
		updateGrid(node2.y, node2.x);
		updateGrid(wallBetween.y, wallBetween.x);
	};

	let randomFirstNode = null;
	while (randomFirstNode === null) {
		const randomRow = Math.floor(Math.random() * (gridHeight - 4)) + 2;
		const randomCol = Math.floor(Math.random() * (gridWidth - 4)) + 2;
		if (randomRow % 2 !== 0 && randomCol % 2 !== 0) {
			randomFirstNode = grid[randomRow][randomCol];
			updateGrid(randomFirstNode.y, randomFirstNode.x);
			visited.add(randomFirstNode);
		}
	}

	const startNodeNeighbors = getNeighbors(randomFirstNode);
	startNodeNeighbors.forEach((node) => {
		if (node) {
			frontier.push(node);
		}
	});

	while (frontier.length > 0) {
		const randomIndex = Math.floor(Math.random() * frontier.length);
		const randomFrontierNode = frontier[randomIndex];
		const frontierNeighbors = getNeighbors(randomFrontierNode);

		// find out which 'in' nodes (part of maze) are adjacent
		const adjacentIns = [];
		for (let i = 0; i < frontierNeighbors.length; i++) {
			if (visited.has(frontierNeighbors[i])) {
				adjacentIns.push(frontierNeighbors[i]);
			}
		}

		// choose a random adjacent node and connect that with the frontier node
		const randomAdjacentIn = adjacentIns[Math.floor(Math.random() * adjacentIns.length)];
		for (let i = 0; i < adjacentIns.length; i++) {
			if (adjacentIns[i] === randomAdjacentIn) {
				await sleep(0.1);
				const wallBetween = getWallBetween(randomFrontierNode, randomAdjacentIn);
				const indexToSplice = frontier.indexOf(randomFrontierNode);
				connect(randomFrontierNode, randomAdjacentIn, wallBetween);
				visited.add(randomFrontierNode);
				frontier.splice(indexToSplice, 1);
			}
		}

		// get the neighbors of the frontier node and add them to frontier list
		const neighborsToAdd = getNeighbors(randomFrontierNode);
		for (let i = 0; i < neighborsToAdd.length; i++) {
			if (neighborsToAdd[i]) {
				if (!visited.has(neighborsToAdd[i]) && !frontier.includes(neighborsToAdd[i])) {
					frontier.push(neighborsToAdd[i]);
				}
			}
		}
	}

	return true;
}
