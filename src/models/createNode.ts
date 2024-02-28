export const createNode = (id: number) => ({
	id,
	neighbors: [],
	isWall: false,
	isStart: false,
	isEnd: false,
	previousNode: undefined,
});
