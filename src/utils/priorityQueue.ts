// used to efficiently retrieve lowest f scores for A* pathfinding algorithm
export default function createPriorityQueue() {
	let items: any = [];

	function enqueue(item: any, priority: any) {
		const node = { item, priority };
		let contains = false;

		for (let i = 0; i < items.length; i++) {
			if (items[i].priority > node.priority) {
				items.splice(i, 0, node);
				contains = true;
				break;
			}
		}

		if (!contains) {
			items.push(node);
		}
	}

	function dequeue() {
		if (items.length === 0) return 'Underflow';
		return items.shift().item;
	}

	function isEmpty() {
		return items.length === 0;
	}

	// Expose only the public functions
	return { enqueue, dequeue, isEmpty };
}
