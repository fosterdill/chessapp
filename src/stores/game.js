import { writable } from "svelte/store";
import Chess from "chess.js";
import { setPosition } from "../stockfish";
import tree from "./tree";

const game = writable(new Chess());

game.subscribe((game) => {
  setPosition(game);
  const moveHistory = game.history().map((value, index) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const dots = index % 2 === 0 ? ". " : "... ";

    return `${moveNumber}${dots}${value}`;
  });
  tree.move(moveHistory[moveHistory.length - 1]);
});

export { game };