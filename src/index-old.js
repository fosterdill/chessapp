const Chess = require("chess.js");
import pgnGames from "./games.pgn";
let board = null;
const game = new Chess();
const $status = $("#status");
const $fen = $("#fen");
const $pgn = $("#pgn");
const $nextMoves = $("#nextMoves");
const $lastMove = $("#lastMove");
let allPgns = getPgns(pgnGames);
allPgns = allPgns.filter((pgn) => pgn.indexOf('[White "fosterdill"]') !== -1);
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let currentNode;
let moveCounter = 0;

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

class Node {
  constructor(data = {}) {
    this.data = data;
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }
}

class Edge {
  constructor(value, data = {}) {
    this.value = value;
    this.data = data;
  }
}
class Graph {
  constructor() {
    this.nodes = {};
    this.nodeChildren = {};
    this.nodeParents = {};
    this.childEdgeToNodes = {};
    this.childEdges = {};
    this.leafNodes = {};
  }

  getNode(label) {
    return this.nodes[label];
  }

  getEdges(label) {
    return this.childEdgeToNodes[label];
  }

  getChildEdges(parentValue) {
    return Object.values(this.childEdges[parentValue]);
  }

  addEdge(parentValue, childValue, edge) {
    if (!(parentValue in this.nodes)) {
      this.nodes[parentValue] = new Node({ name: parentValue });
    }
    if (!(childValue in this.nodes)) {
      this.nodes[childValue] = new Node({ name: childValue });
    }

    if (!(parentValue in this.nodeChildren)) {
      this.nodeChildren[parentValue] = [this.nodes[childValue]];
    } else {
      this.nodeChildren[parentValue].push(this.nodes[childValue]);
    }

    if (!(childValue in this.nodeParents)) {
      this.nodeParents[childValue] = [this.nodes[parentValue]];
    } else {
      this.nodeParents[childValue].push(this.nodes[parentValue]);
    }

    if (!(parentValue in this.childEdgeToNodes)) {
      this.childEdgeToNodes[parentValue] = {
        [edge.value]: this.nodes[childValue],
      };
    } else {
      this.childEdgeToNodes[parentValue][edge.value] = this.nodes[childValue];
    }

    if (!(parentValue in this.childEdges)) {
      this.childEdges[parentValue] = { [childValue]: edge };
    } else if (!(childValue in this.childEdges[parentValue])) {
      this.childEdges[parentValue][childValue] = edge;
    } else {
      this.childEdges[parentValue][childValue].data.won += edge.data.won;
      this.childEdges[parentValue][childValue].data.lost += edge.data.lost;
      this.childEdges[parentValue][childValue].data.total += edge.data.total;
    }

    if (!(childValue in this.nodeChildren)) {
      this.leafNodes[childValue] = this.nodes[childValue];
    }

    if (parentValue in this.leafNodes) {
      delete this.leafNodes[parentValue];
    }
  }
}

const chessObj = new Chess();

const graph = new Graph();

for (let pgn of allPgns) {
  chessObj.load_pgn(pgn);
  chessObj.won = pgn.indexOf("fosterdill won") !== -1;
  chessObj.lost = pgn.indexOf("fosterdill won") === -1;
  chessObj.drawn = pgn.indexOf("drawn") === -1;
  addEdgesFromPgn(chessObj, graph);
}

// chessObj.load_pgn(allPgns[0]);
// addEdgesFromPgn(chessObj, graph);
// console.log(graph);

function getPgns(pgnGames) {
  const splitPgns = pgnGames.split("\n\n");
  const pgns = [];
  for (let i = 0; i < splitPgns.length / 2; i++) {
    pgns.push([splitPgns[i * 2], splitPgns[i * 2 + 1]].join("\n\n"));
  }
  return pgns;
}

function getMoveName(index, move) {
  if (index % 2 === 0) {
    return `${Math.floor(index / 2) + 1}. ${move}`;
  }

  return `${Math.floor(index / 2) + 1}... ${move}`;
}

function addEdgesFromPgn(chessObj, graphRef) {
  var moves = chessObj.history();
  var newGame = new Chess();
  var fens = [START_FEN];
  for (var i = 0; i < moves.length; i++) {
    newGame.move(moves[i]);
    fens.push(newGame.fen());
  }
  for (var i = 0; i < moves.length; i++) {
    graphRef.addEdge(
      fens[i],
      fens[i + 1],
      new Edge(getMoveName(i, moves[i]), {
        won: chessObj.won ? 1 : 0,
        lost: chessObj.lost ? 1 : 0,
        drawn: chessObj.drawn ? 1 : 0,
        total: 1,
      })
    );
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
    currentNode = graph.getEdges(currentNode.data.name)[lastMoveName];
    $nextMoves.html(
      graph
        .getChildEdges(currentNode.data.name)
        .map(
          (edge) =>
            edge.value +
            " (W: " +
            Math.round((100 * edge.data.won) / edge.data.total) +
            "%) (L: " +
            Math.round((100 * edge.data.lost) / edge.data.total) +
            "%) (T: " +
            edge.data.total +
            ") <br />"
        )
    );
  }
}

const config = {
  pieceTheme: "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png",
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};
board = Chessboard("board", config);

currentNode = graph.getNode(START_FEN);

updateStatus();
