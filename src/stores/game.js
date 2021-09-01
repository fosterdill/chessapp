import { writable, get } from "svelte/store";
import Chess from "chess.js";
import { setPosition } from "../stockfish";

const game = writable(new Chess());

game.subscribe((game) => {
  setPosition(game);
});

export { game };
