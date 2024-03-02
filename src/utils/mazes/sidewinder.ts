const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function sidewinder(
	grid: any,
	setGrid: any,
	gridWidth: number,
	gridHeight: number
) {
	const updateGrid = (yPos: number, xPos: number) => {
		let gridCopy = grid.map((gridRow: any, rowIndex: number) => {
			return gridRow.map((node: any, colIndex: number) => {
				return node;
			});
		});
		gridCopy[yPos][xPos].isWall = false;
		setGrid(gridCopy);
	};

	// fill grid except for first row
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			if (row === 1) {
				if (col === 0 || col === gridWidth - 1) {
					let gridCopy = grid.map((gridRow: any, rowIndex: number) => {
						return gridRow.map((node: any, colIndex: number) => {
							return node;
						});
					});
					gridCopy[row][col].isWall = true;
					setGrid(gridCopy);
				}
			} else {
				let gridCopy = grid.map((gridRow: any, rowIndex: number) => {
					return gridRow.map((node: any, colIndex: number) => {
						return node;
					});
				});
				gridCopy[row][col].isWall = true;
				setGrid(gridCopy);
			}
		}
	}

	for (let row = 3; row < gridHeight; row += 2) {
		let run = [];
		for (let col = 1; col < gridWidth; col += 2) {
			const currentNode = grid[row][col];
			updateGrid(currentNode.y, currentNode.x);
			run.push(currentNode);
			console.log(currentNode);

			if (Math.random() < 0.6 && col !== gridWidth - 2) {
				await sleep(0.1);
				updateGrid(currentNode.y, currentNode.x + 1);
			} else if (run.length > 0 && row > 1) {
				const randomIndex = Math.floor(Math.random() * run.length);
				const randomNode = run[randomIndex];
				await sleep(0.1);
				updateGrid(randomNode.neighbors[0].y, randomNode.neighbors[0].x);
				run = [];
			}
		}
	}

	return true;
}
