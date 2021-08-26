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
const $progress = $("#progress");

let currentNode;
let moveCounter = 0;
let board = null;
const moveHistory = [];

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
    moveCounter++;

    if (lastMoveName in currentNode.edges) {
      moveHistory.push(currentNode);
      currentNode = currentNode.edges[lastMoveName].to;
    } else {
      $nextMoves.html("No positions found");
    }
  }
  $nextMoves.html(
    Object.keys(currentNode.edges).map((move) => {
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
const setupChessboard = (nodes, username) => {
  $progress.html("");
  localForage.setItem(`${username}_nodes`, nodes);

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

  currentNode = root;

  updateStatus();
};

const main = async () => {
  setupStorage();

  const username = window.location.hash.slice(1);

  let allNodes = await localForage.getItem(`${username}_nodes`);

  if (!allNodes) {
    $progress.html("Downloading...");
    const worker = new Worker(
      new URL("./workers/build-graph", import.meta.url)
    );
    worker.postMessage({ username, color: "white" });
    worker.onmessage = ({ data: { nodes, done, percentage } }) => {
      allNodes = nodes;
      if (done) {
        setupChessboard(nodes, username);
      } else {
        $progress.html(`Loading... ${percentage}% done.`);
      }
    };
  } else {
    setupChessboard(allNodes, username);
  }

  $(document).ready(() => {
    $("#previousmove").click((event) => {
      event.preventDefault();
      currentNode = moveHistory.pop();
      moveCounter--;
      game.undo();
      board.position(game.fen());
      updateStatus();
    });
  });
};

main();
