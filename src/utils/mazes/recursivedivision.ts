const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function recursivedivision(
	grid: any,
	gridNodeRefs: any,
	gridWidth: number,
	gridHeight: number,
	speed: number
) {
	const updateGrid = (yPos: number, xPos: number) => {
		grid[yPos][xPos].isWall = true;
		gridNodeRefs.current[grid[yPos][xPos].id].classList.add('wall-node');
	};

	const randomEven = (a: number, b: number) => {
		const random = Math.floor(Math.random() * (b - a + 1)) + a;
		return random % 2 === 0 ? random : random + 1;
	};
	const randomOdd = (a: number, b: number) => {
		const random = Math.floor(Math.random() * (b - a + 1)) + a;
		return random % 2 !== 0 ? random : random + 1;
	};

	// choose to place wall horizontally or vertically
	const chooseOrientation = (
		startRow: number,
		endRow: number,
		startCol: number,
		endCol: number
	) => {
		const width = endCol - startCol;
		const height = endRow - startRow;
		if (width > height) return 'vertical';
		if (width < height) return 'horizontal';
		if (width === height) {
			const random = Math.floor(Math.random() * 2);
			return random === 0 ? 'horizontal' : 'vertical';
		}
		return null;
	};

	// create walls around edges of grid
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			if (row === 0 || col === 0 || row === grid.length - 1 || col === grid[0].length - 1) {
				updateGrid(row, col);
			}
		}
	}

	// recursive function
	const divide = async (startRow: number, endRow: number, startCol: number, endCol: number) => {
		// base case if sub-maze is too small
		if (endCol - startCol <= 1 || endRow - startRow <= 1) {
			return;
		}

		// define a spot in between two points of where a wall or col can be made
		const wallRow = randomEven(startRow + 1, endRow - 1);
		const wallCol = randomEven(startCol + 1, endCol - 1);

		// define a position for a hole in the wall
		const passageRow = randomOdd(startRow, endRow);
		const passageCol = randomOdd(startCol, endCol);

		// choose a vertical or horizontal wall
		const orientation = chooseOrientation(startRow, endRow, startCol, endCol);

		if (orientation === 'horizontal') {
			// make a horizontal wall
			for (let col = startCol; col <= endCol; col++) {
				if (col !== passageCol) {
					if (speed !== 0) {
						await sleep(speed);
					}
					updateGrid(wallRow, col);
				}
			}
		} else if (orientation === 'vertical') {
			// make a vertical wall
			for (let row = startRow; row <= endRow; row++) {
				if (row !== passageRow) {
					if (speed !== 0) {
						await sleep(speed);
					}
					updateGrid(row, wallCol);
				}
			}
		}

		// recursively call this function again to place new walls depending on orientation
		if (orientation === 'horizontal') {
			await divide(startRow, wallRow - 1, startCol, endCol);
			await divide(wallRow + 1, endRow, startCol, endCol);
		} else if (orientation === 'vertical') {
			await divide(startRow, endRow, wallCol + 1, endCol);
			await divide(startRow, endRow, startCol, wallCol - 1);
		}

		// check if this is the last recursive call
		if (startRow === 1 && endRow === 88 && startCol === 1 && endCol === 38) {
			return;
		}
	};

	await divide(1, gridHeight - 2, 1, gridWidth - 2);

	return true;
}
