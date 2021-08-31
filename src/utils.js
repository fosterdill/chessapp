import Chess from "chess.js";

export const START_FEN =
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const getMoveName = (index, move) => {
	if (index % 2 === 0) {
		return `${Math.floor(index / 2) + 1}. ${move}`;
	}

	return `${Math.floor(index / 2) + 1}... ${move}`;
};

export const getPosition = (string, subString, index) => {
	return string.split(subString, index).join(subString).length;
};

export const getAlgebraicNames = (fen, moves) => {
	const game = new Chess(fen);
	const algebraicNames = [];

	for (let move of moves) {
		game.move({
			from: move.slice(0, 2),
			to: move.slice(2),
		});
		algebraicNames.push(game.history()[game.history().length - 1]);
	}

	return algebraicNames;
};

export const getAlgebraicName = (engineName, fen) => {
	const game = new Chess(fen);
	const firstPos = engineName.slice(0, 2);
	const secondPos = engineName.slice(2);
	game.move({
		from: firstPos,
		to: secondPos,
	});
	return game.history().pop();
};

export const getSimpleMoves = (game) => {
	var moves = "";
	var history = game.history({ verbose: true });

	for (var i = 0; i < history.length; ++i) {
		var move = history[i];
		moves += " " + move.from + move.to + (move.promotion ? move.promotion : "");
	}

	return moves;
};
