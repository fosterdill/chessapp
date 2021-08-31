import { writable, get } from "svelte/store";
import Chess from "chess.js";
import { setPosition } from "../stockfish";
import tree from "./tree";

const gameStore = writable(new Chess());

gameStore.subscribe((game) => {
  setPosition(game);
  const moveHistory = game.history().map((value, index) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const dots = index % 2 === 0 ? ". " : "... ";

    return `${moveNumber}${dots}${value}`;
  });
  const move = moveHistory[moveHistory.length - 1];
  if (get(tree).currentNode && move in get(tree).currentNode.edges) {
    tree.move(move);
  }
});

const handleGoBack = () => {
  get(gameStore).undo();
  gameStore.update((game) => game);
  if (get(gameStore).history().length === get(tree).previousNodes.length - 1) {
    tree.undo();
  }
};

export const game = { ...gameStore, handleGoBack };
