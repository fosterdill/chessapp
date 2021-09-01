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

    // If nodes were just loaded, set the current node to the root node
    if ($nodes && !$tree.currentNode) {
      return {
        ...$tree,
        currentNode: $nodes,
      };
    }

    if (!$tree.currentNode) return $tree;

    const moveHistory = $game.history().map(getMoveName);
    const lastMove = moveHistory[moveHistory.length - 1];

    // If there was a move made that is in the tree, traverse the tree and store the nod
    if (lastMove && lastMove in $tree.currentNode.edges) {
      return {
        currentNode: $tree.currentNode.edges[lastMove].to,
        previousNodes: $tree.previousNodes.concat([$tree.currentNode]),
      };
    }

    // If the game history has fewer moves than the previous nodes, then the user went back a move
    if (moveHistory.length < $tree.previousNodes.length) {
      return {
        currentNode: $tree.previousNodes.pop(),
        previousNodes: $tree.previousNodes,
      };
    }

    return $tree;
  },
  {
    currentNode: null,
    previousNodes: [],
  }
);

const currentEdges = ($tree) => {
  const currentNode = $tree.currentNode;
  const edges = currentNode ? Object.values(currentNode.edges) : [];

  return edges.sort((edge, edge2) => edge2.accum.total - edge.accum.total);
};

export { tree, currentEdges };
