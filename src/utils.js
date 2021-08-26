import Chess from "chess.js";

export const START_FEN =
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const getFensFromPgn = (chessObj) => {};

export const getMoveName = (index, move) => {
	if (index % 2 === 0) {
		return `${Math.floor(index / 2) + 1}. ${move}`;
	}

	return `${Math.floor(index / 2) + 1}... ${move}`;
};
