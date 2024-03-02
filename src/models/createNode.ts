interface Node {
	id: number;
	neighbors: Node[];

	isWall: boolean;
	isStart: boolean;
	isEnd: boolean;
	previousNode: Node | null;
	isOpenSet: boolean;
	isClosedSet: boolean;
	isPath: boolean;

	x: number;
	y: number;
	gCost: number;
	hCost: number;
	fCost: () => number;
}

export default function createNode(id: number, x: number, y: number, neighbors = []): Node {
	return {
		id,
		neighbors,

		isWall: false,
		isStart: false,
		isEnd: false,
		previousNode: null,
		isOpenSet: false,
		isClosedSet: false,
		isPath: false,

		x,
		y,
		gCost: Infinity,
		hCost: 0,
		fCost: function () {
			return this.gCost + this.hCost;
		},
	};
}
