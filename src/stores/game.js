import { writable, get } from "svelte/store";
import Chess from "chess.js";

const game = writable(new Chess());

export { game };
