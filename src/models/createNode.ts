export const createNode = (id: number, x: number, y: number, neighbors = []) => ({
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
});
