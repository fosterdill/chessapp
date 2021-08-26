import { addEdge, createNode } from "./graph";
import Chess from "chess.js";
import { START_FEN, getMoveName } from "../utils";

export const addGame = (game, nodes) => {
	const chessObj = new Chess();
	chessObj.load_pgn(game.pgn);
	const moves = chessObj.history();
	const newGame = new Chess();
	const fens = [START_FEN];

	// Get a list of fens from the pgn
	for (let i = 0; i < moves.length; i++) {
		newGame.move(moves[i]);
		fens.push(newGame.fen());
	}

	// Create one node for each Fen
	for (let i = 0; i < moves.length; i++) {
		const fen = fens[i];
		const nextFen = fens[i + 1];

		if (!(fen in nodes)) {
			nodes[fen] = createNode(fen);
		}
	}

	// add Edges connecting every Fen
	for (let i = 0; i < moves.length; i++) {
		const fen = fens[i];
		const nextFen = fens[i + 1];

		addEdge(getMoveName(i, moves[i]), nodes[fen], nodes[nextFen]);
	}
};
