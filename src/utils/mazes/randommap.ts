const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function randommap(
	grid: any,
	gridNodeRefs: any,
	gridWidth: number,
	gridHeight: number,
	speed: number
) {
	// fill grid
	for (let row = 0; row < gridHeight; row++) {
		for (let col = 0; col < gridWidth; col++) {
			if (grid[row][col].isStart || grid[row][col].isEnd) continue;

			if (Math.random() < 0.3) {
				if (speed !== 0) {
					await sleep(speed);
				}
				grid[row][col].isWall = true;
				gridNodeRefs.current[grid[row][col].id].classList.add('wall-node');
			}
		}
	}

	return true;
}
