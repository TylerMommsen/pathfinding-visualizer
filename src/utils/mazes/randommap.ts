const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function randommap(
	grid: any,
	gridNodeRefs: any,
	gridWidth: number,
	gridHeight: number
) {
	// fill grid
	for (let row = 0; row < gridHeight; row++) {
		for (let col = 0; col < gridWidth; col++) {
			if (Math.random() < 0.3) {
				await sleep(0.1);
				grid[row][col].isWall = true;
				gridNodeRefs.current[grid[row][col].id].classList.add('wall-node');
			}
		}
	}

	return true;
}
