const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function binarytree(
	grid: any,
	gridNodeRefs: any,
	gridWidth: number,
	gridHeight: number
) {
	const updateGrid = (yPos: number, xPos: number) => {
		grid[yPos][xPos].isWall = false;
		gridNodeRefs.current[grid[yPos][xPos].id].classList.remove('wall-node');
	};

	// fill grid
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			grid[row][col].isWall = true;
			gridNodeRefs.current[grid[row][col].id].classList.add('wall-node');
		}
	}

	const connect = (node1: any, node2: any, wallBetween: any) => {
		updateGrid(node1.y, node1.x);
		updateGrid(node2.y, node2.x);
		updateGrid(wallBetween.y, wallBetween.x);
	};

	for (let row = 1; row < gridHeight; row += 2) {
		for (let col = 1; col < gridWidth; col += 2) {
			const currentNode = grid[row][col];
			let northNeighbor;
			let westNeighbor;

			if (row > 1) {
				northNeighbor = grid[row - 2][col]; // up
			} else {
				northNeighbor = null;
			}

			if (col > 1) {
				westNeighbor = grid[row][col - 2]; // left
			} else {
				westNeighbor = null;
			}

			if (northNeighbor && westNeighbor) {
				await sleep(1);

				// if both paths are available
				const random = Math.floor(Math.random() * 2);
				if (random === 0) {
					connect(currentNode, northNeighbor, grid[row - 1][col]);
				} else {
					connect(currentNode, westNeighbor, grid[row][col - 1]);
				}
			} else {
				// if one of the paths go beyond the grid
				if (row === 1 && col > 1) {
					connect(currentNode, westNeighbor, grid[row][col - 1]);
				}
				if (col === 1 && row > 1) {
					connect(currentNode, northNeighbor, grid[row - 1][col]);
				}
			}
		}
	}

	return true;
}
