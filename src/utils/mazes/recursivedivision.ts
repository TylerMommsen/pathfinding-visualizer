const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function recursivedivision(grid: any, setGrid: any) {
	let gridCopy = [...grid];

	const updateGrid = (yPos: number, xPos: number) => {
		const newGrid = gridCopy.map((node, index) => {
			if (node.x === xPos && node.y === yPos) {
				return {
					...node,
					isWall: true,
				};
			}
			return node;
		});
		setGrid(newGrid);
		gridCopy = [...newGrid];
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
	for (const node of grid) {
		if (node.x === 0 || node.y === 0 || node.x === 89 || node.y === 39) {
			updateGrid(node.y, node.x);
		}
	}

	// recursive function
	const divide = async (startRow: number, endRow: number, startCol: number, endCol: number) => {
		// base case if sub-maze is too small
		if (endCol - startCol < 1 || endRow - startRow < 1) {
			console.log('yup');
			return;
		}
		console.log('recurring');

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
					await sleep(1);
					updateGrid(wallRow, col);
				}
			}
		} else if (orientation === 'vertical') {
			// make a vertical wall
			for (let row = startRow; row <= endRow; row++) {
				if (row !== passageRow) {
					await sleep(1);
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

	await divide(1, 38, 1, 88);

	return true;
}
