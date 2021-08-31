import { get, writable } from "svelte/store";

const engine = writable({
	bestMove: null,
	line: null,
	adv: 0,
	isWorking: false,
});

export default {
	...engine,
	setBestMove(bestMove) {
		engine.update((engine) => ({ ...engine, bestMove, isWorking: false }));
	},
	setLine(line, adv) {
		engine.update((engine) => ({ ...engine, line, adv, isWorking: true }));
	},
};
