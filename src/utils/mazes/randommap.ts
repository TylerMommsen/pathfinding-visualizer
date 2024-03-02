const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function randommap(
	grid: any,
	setGrid: any,
	gridWidth: number,
	gridHeight: number
) {
	// fill grid
	for (let row = 0; row < gridHeight; row++) {
		for (let col = 0; col < gridWidth; col++) {
			if (Math.random() < 0.3) {
				await sleep(0.1);
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

	return true;
}
