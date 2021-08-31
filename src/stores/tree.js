import { writable, get } from "svelte/store";
import { START_FEN } from "../utils";

const tree = writable({
	currentNode: null,
	nodes: null,
});

export default {
	...tree,
	loadNodes(nodes) {
		tree.update((tree) => ({
			...tree,
			nodes,
			currentNode: nodes[START_FEN],
		}));
	},
	currentEdges() {
		const currentNode = get(tree).currentNode;
		const edges = currentNode ? Object.values(currentNode.edges) : [];

		return edges.sort((edge, edge2) => edge2.accum.total - edge.accum.total);
	},
	move(move) {
		if (get(tree).currentNode) {
			tree.update((tree) => ({
				...tree,
				currentNode: tree.currentNode.edges[move].to,
			}));
		}
	},
};
