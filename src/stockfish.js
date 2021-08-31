import { getAlgebraicNames, getAlgebraicName, getPosition } from "./utils";
import { get } from "svelte/store";
import engine from "./stores/engine";
import { game } from "./stores/game";
import { getSimpleMoves } from "./utils";

const stockfish = new Worker("stockfish.js");
const waitingCommands = [];
const DEFAULT_DEPTH = 18;

const waitForIsReady = (...commands) => {
	waitingCommands.push(commands);
	stockfish.postMessage("stop");
	stockfish.postMessage("isready");
};

const setPosition = (game) => {
	waitForIsReady(
		`position startpos moves${getSimpleMoves(game)}`,
		`go depth ${DEFAULT_DEPTH}`
	);
};

const stockfishHandler = ({ data }) => {
	if (data === "readyok") {
		waitingCommands.shift().forEach((command) => {
			setTimeout(() => {
				stockfish.postMessage(command);
			}, 50);
		});
	}
	const start = data.indexOf("depth") + 6;
	const depth = data.slice(start, start + 2);
	const cpScoreMatch = data.match(/cp\s(\-?[1-9]+)\s/);
	let cp;

	if (cpScoreMatch) {
		cp = Number(cpScoreMatch[1]) / 100;
		if (get(game).turn() === "b") {
			cp = -cp;
		}
		// update advantage here
	}
	if (data.indexOf("bestmove") !== -1) {
		// $bestMove.html(`⭐ ${getAlgebraicName(data.slice(9, 13), game.fen())}`);
		//do best move logic here
		engine.setBestMove(getAlgebraicName(data.slice(9, 13), get(game).fen()));
	} else {
		const movesList = data.slice(getPosition(data, "pv", 2)).slice(3);
		const algebraicNames = getAlgebraicNames(
			get(game).fen(),
			movesList.split(" ")
		);
		if (algebraicNames[0]) {
			//have access to algebraic names
			engine.setLine(algebraicNames, cp);
		}
	}
};

export default () => {
	stockfish.onmessage = stockfishHandler;

	stockfish.postMessage("uci");
	stockfish.postMessage("setoption name Use NNUE value true");
};

export { setPosition };
