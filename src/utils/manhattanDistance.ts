// used to calculate distance from 2 nodes - used for A*
export default function manhattanDistance(nodeA: any, nodeB: any) {
	const dx = Math.abs(nodeA.x - nodeB.x);
	const dy = Math.abs(nodeA.y - nodeB.y);
	return dx + dy;
}
