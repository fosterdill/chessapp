import { writable, get } from "svelte/store";
import { START_FEN } from "../utils";

const tree = writable({
	currentNode: null,
	nodes: null,
	previousNodes: [],
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
				previousNodes: tree.previousNodes.concat([tree.currentNode]),
			}));
		}
	},
	undo() {
		tree.update((tree) => {
			return {
				...tree,
				previousNodes: tree.previousNodes.slice(
					0,
					tree.previousNodes.length - 1
				),
				currentNode: tree.previousNodes[tree.previousNodes.length - 1],
			};
		});
	},
};
