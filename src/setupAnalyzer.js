import Chess from "chess.js";
import localForage from "localforage";
import { fetchAllGames } from "./fetches";
import { START_FEN, getMoveName } from "./utils";
import { createNode } from "./data-structures";
import { addGame } from "./data-structures";
import { setupStorage } from "./idb";

//Undo logic:

const game = new Chess();
let stockfish = new Worker("stockfish.js");
stockfish.postMessage("setoption name Use NNUE value true");
let waitingCommands = [];

let currentNode;
let moveCounter = 0;
let board = null;
const moveHistory = [];

function getPosition(string, subString, index) {
	return string.split(subString, index).join(subString).length;
}

const stockfishHandler = (handleStockfishUpdate, { data }) => {
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
		if (game.turn() === "b") {
			cp = -cp;
		}
		// update advantage here
	}
	if (data.indexOf("bestmove") !== -1) {
		// $bestMove.html(`⭐ ${getAlgebraicName(data.slice(9, 13), game.fen())}`);
		//do best move logic here
		handleStockfishUpdate({
			bestMove: `⭐ ${getAlgebraicName(data.slice(9, 13), game.fen())}`,
			cp,
			depth,
		});
	} else {
		const movesList = data.slice(getPosition(data, "pv", 2)).slice(3);
		const algebraicNames = getAlgebraicNames(game.fen(), movesList.split(" "));
		if (algebraicNames[0]) {
			//have access to algebraic names
			handleStockfishUpdate({ depth, bestMoves: algebraicNames, cp });
		}
	}
};

function getAlgebraicNames(fen, moves) {
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
}

function onDragStart(source, piece, position, orientation) {
	// do not pick up pieces if the game is over
	if (game.game_over()) return false;

	// only pick up pieces for the side to move
	if (
		(game.turn() === "w" && piece.search(/^b/) !== -1) ||
		(game.turn() === "b" && piece.search(/^w/) !== -1)
	) {
		return false;
	}
}

function onDrop(handleStockfishUpdate, handleNodeUpdate, source, target) {
	// see if the move is legal
	const move = game.move({
		from: source,
		to: target,
		promotion: "q", // NOTE: always promote to a queen for example simplicity
	});

	// illegal move
	if (move === null) return "snapback";

	updateStatus(handleStockfishUpdate, handleNodeUpdate, move);
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
	board.position(game.fen());
}

const getAlgebraicName = (engineName, fen) => {
	const game = new Chess(fen);
	const firstPos = engineName.slice(0, 2);
	const secondPos = engineName.slice(2);
	game.move({
		from: firstPos,
		to: secondPos,
	});
	return game.history().pop();
};
function get_moves() {
	var moves = "";
	var history = game.history({ verbose: true });

	for (var i = 0; i < history.length; ++i) {
		var move = history[i];
		moves += " " + move.from + move.to + (move.promotion ? move.promotion : "");
	}

	return moves;
}

const waitForIsReady = (...commands) => {
	waitingCommands.push(commands);
	stockfish.postMessage("stop");
	stockfish.postMessage("isready");
};

const evalFen = (fen) => {
	waitForIsReady(`position startpos moves${get_moves()}`, "go depth 18");
};
const sortByTotal = (edge1, edge2) => edge2.accum.total - edge1.accum.total;

function updateStatus(handleStockfishUpdate, handleNodeUpdate, move) {
	let status = "";
	let lastMoveName;
	if (move) {
		lastMoveName = getMoveName(moveCounter, move.san);
	}

	let moveColor = "White";
	if (game.turn() === "b") {
		moveColor = "Black";
	}

	// checkmate?
	if (game.in_checkmate()) {
		status = "Game over, " + moveColor + " is in checkmate.";
	}

	// draw?
	else if (game.in_draw()) {
		status = "Game over, drawn position";
	}

	// game still on
	else {
		status = moveColor + " to move";

		// check?
		if (game.in_check()) {
			status += ", " + moveColor + " is in check";
		}
	}

	if (move) {
		moveCounter++;

		if (lastMoveName in currentNode.edges) {
			moveHistory.push(currentNode);
			currentNode = currentNode.edges[lastMoveName].to;
			handleNodeUpdate(currentNode);
		} else {
			// no positions
		}
		evalFen(game.fen());
	} else if (game.fen() === currentNode.name) {
		// update next moves here too
		handleNodeUpdate(currentNode);
	}
}
const setupChessboard = (
	nodes,
	username,
	color,
	handleStockfishUpdate,
	handleNodeUpdate
) => {
	const root = nodes[START_FEN];

	const config = {
		pieceTheme: (piece) => {
			return require(`./images/${piece}.png`);
		},
		draggable: true,
		position: "start",
		onDragStart: onDragStart,
		onDrop: onDrop.bind(null, handleStockfishUpdate, handleNodeUpdate),
		onSnapEnd: onSnapEnd,
	};
	board = Chessboard("board", config);
	if (color === "black") {
		board.flip();
	}

	currentNode = root;

	updateStatus(handleStockfishUpdate, handleNodeUpdate);
};

const main = async (
	handleStockfishUpdate,
	handleNodeUpdate,
	color = "white"
) => {
	setupStorage();
	stockfish.onmessage = stockfishHandler.bind(null, handleStockfishUpdate);
	stockfish.postMessage("stop");

	waitForIsReady("position startpos", "go depth 18");

	const username = window.location.hash.slice(1);

	let allNodes = await localForage.getItem(`${username}_nodes_${color}`);

	const previousMove = () => {
		if (game.fen() === currentNode.name && moveCounter !== 0) {
			currentNode = moveHistory.pop();
		}
		if (moveCounter !== 0) moveCounter--;
		game.undo();
		board.position(game.fen());
		evalFen(game.fen());
		updateStatus(handleStockfishUpdate, handleNodeUpdate);
	};

	if (!allNodes) {
		const worker = new Worker(
			new URL("./workers/build-graph", import.meta.url)
		);
		worker.postMessage({ username });
		worker.onmessage = ({
			data: { whiteNodes, blackNodes, done, percentage },
		}) => {
			allNodes = color === "white" ? whiteNodes : blackNodes;
			if (done) {
				localForage.setItem(`${username}_nodes_black`, blackNodes);
				localForage.setItem(`${username}_nodes_white`, whiteNodes);
				setupChessboard(
					allNodes,
					username,
					color,
					handleStockfishUpdate,
					handleNodeUpdate
				);
				return { previousMove };
			} else {
				//loading update here
			}
		};
	} else {
		setupChessboard(
			allNodes,
			username,
			color,
			handleStockfishUpdate,
			handleNodeUpdate
		);
		return { previousMove };
	}
};

export default main;
