export const createNode = (id: number) => ({
	id,
	neighbors: [],
	isBarrier: false,
	isStart: false,
	isEnd: false,
	previousNode: undefined,
});
