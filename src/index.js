import Chess from "chess.js";
import localForage from "localforage";
import { fetchAllGames } from "./fetches";
import { START_FEN, getMoveName } from "./utils";
import { createNode } from "./data-structures";
import { addGame } from "./data-structures";
import { setupStorage } from "./idb";

const game = new Chess();
const $status = $("#status");
const $fen = $("#fen");
const $pgn = $("#pgn");
const $nextMoves = $("#nextMoves");
const $lastMove = $("#lastMove");
const $bestMove = $("#bestMove");
const $progress = $("#progress");
let stockfish = new Worker("stockfish.js");

let currentNode;
let moveCounter = 0;
let board = null;
const moveHistory = [];

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}
const stockfishHandler = ({ data }) => {
  const start = data.indexOf("depth") + 6;
  const depth = data.slice(start, start + 2);
  console.log(data.match(/cp\s([1-9]+)\s/)[1]);
  if (data.indexOf("bestmove") !== -1) {
    $bestMove.html(
      `Best move: ${getAlgebraicName(data.slice(9, 13), game.fen())}`
    );
  } else {
    const movesList = data.slice(getPosition(data, "pv", 2)).slice(3);
    const algebraicNames = getAlgebraicNames(game.fen(), movesList.split(" "));
    $bestMove.html(`${depth} - ${algebraicNames}`);
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

function onDrop(source, target) {
  console.log(source, target);
  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";

  updateStatus(move);
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

const evalFen = (fen) => {
  $bestMove.html("...");
  // stockfish.postMessage("setoption name MultiPV value 1");

  stockfish.postMessage("stop");
  stockfish.postMessage(`position fen ${fen}`);
  stockfish.postMessage("go depth 20");
};
const sortByWins = (edge1, edge2) => edge2.accum.total - edge1.accum.total;

function updateStatus(move) {
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

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());

  if (move) {
    console.log(game.fen());
    moveCounter++;

    if (lastMoveName in currentNode.edges) {
      moveHistory.push(currentNode);
      currentNode = currentNode.edges[lastMoveName].to;
    } else {
      $nextMoves.html("No positions found");
    }
    evalFen(game.fen());
  }
  $nextMoves.html(
    Object.values(currentNode.edges)
      .sort(sortByWins)
      .map((edge) => {
        const move = edge.name;
        const { win, total } = currentNode.edges[move].accum;
        const winPercentage = Math.round((100 * win) / total);
        return `
        ${move} (won ${winPercentage}% of ${total}) 
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: ${winPercentage}%" aria-valuenow="${winPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      `;
      })
  );
}
const setupChessboard = (nodes, username, color) => {
  $progress.html("");
  localForage.setItem(`${username}_nodes_${color}`, nodes);

  const root = nodes[START_FEN];

  const config = {
    pieceTheme:
      "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png",
    draggable: true,
    position: "start",
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
  };
  board = Chessboard("board", config);
  board.flip();

  currentNode = root;

  updateStatus();
};

const main = async () => {
  const color = "black";
  setupStorage();
  stockfish.onmessage = stockfishHandler;
  // stockfish1.postMessage("setoption name MultiPV value 1");

  stockfish.postMessage(`position startposition`);
  stockfish.postMessage("go depth 20");

  const username = window.location.hash.slice(1);

  let allNodes = await localForage.getItem(`${username}_nodes_${color}`);

  if (!allNodes) {
    $progress.html("Downloading...");
    const worker = new Worker(
      new URL("./workers/build-graph", import.meta.url)
    );
    worker.postMessage({ username, color });
    worker.onmessage = ({ data: { nodes, done, percentage } }) => {
      allNodes = nodes;
      if (done) {
        setupChessboard(nodes, username, color);
      } else {
        $progress.html(`Loading... ${percentage}% done.`);
      }
    };
  } else {
    setupChessboard(allNodes, username, color);
  }

  $(document).ready(() => {
    $("#previousmove").click((event) => {
      event.preventDefault();
      currentNode = moveHistory.pop();
      moveCounter--;
      game.undo();
      board.position(game.fen());
      evalFen(game.fen());
      updateStatus();
    });
  });
};

main();
