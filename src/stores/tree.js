import { writable, get, derived } from "svelte/store";
import { START_FEN } from "../utils";
import { game } from "./game";
import { nodes } from "./nodes";

const getMoveName = (value, index) => {
	const moveNumber = Math.floor(index / 2) + 1;
	const dots = index % 2 === 0 ? ". " : "... ";

	return `${moveNumber}${dots}${value}`;
};

const tree = derived(
	[game, nodes],
	([$game, $nodes]) => {
		const $tree = get(tree);
		const moveHistory = $game.history().map(getMoveName);
		const lastMove = moveHistory[moveHistory.length - 1];
		let newTree = $tree;

		if ($nodes && !$tree.currentNode) {
			newTree.currentNode = $nodes;
		}

		if ($nodes && lastMove && lastMove in $tree.currentNode.edges) {
			newTree = {
				currentNode: $tree.currentNode.edges[lastMove].to,
				previousNodes: $tree.previousNodes.concat([$tree.currentNode]),
			};
		}

		return {
			currentNode: newTree.currentNode,
			previousNodes: newTree.previousNodes,
		};
	},
	{
		currentNode: null,
		previousNodes: [],
	}
);

export default {
	...tree,
	currentEdges() {
		const currentNode = get(tree).currentNode;
		const edges = currentNode ? Object.values(currentNode.edges) : [];

		return edges.sort((edge, edge2) => edge2.accum.total - edge.accum.total);
	},
	// undo() {
	// 	tree.update((tree) => {
	// 		return {
	// 			...tree,
	// 			previousNodes: tree.previousNodes.slice(
	// 				0,
	// 				tree.previousNodes.length - 1
	// 			),
	// 			currentNode: tree.previousNodes[tree.previousNodes.length - 1],
	// 		};
	// 	});
	// },
};
