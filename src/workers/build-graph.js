import { fetchAllGames } from "../fetches";
import { START_FEN, getMoveName } from "../utils";
import { addEdge, createNode } from "../data-structures/graph";
import Chess from "chess.js";

const addGame = (game, nodes, username, color) => {
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

    addEdge(getMoveName(i, moves[i]), nodes[fen], nodes[nextFen], {
      win:
        game[color].username === username && game[color].result === "win"
          ? 1
          : 0,
      total: 1,
    });
  }
};

const addAllGamesForColor = (games, nodes, username, color) => {
  for (let [index, game] of games.entries()) {
    addGame(game, nodes, username, color);

    const percentage = Math.round((100 * index) / games.length);
    if (percentage % 20 === 0) {
      self.postMessage({
        nodes,
        percentage: Math.round((100 * index) / games.length),
      });
    }
  }
};

self.onmessage = ({ data: { username, games } }) => {
  const whiteNodes = {};
  const blackNodes = {};

  const blackGames = games.filter(
    (game) => game.black.username === username && game.rated
  );
  const whiteGames = games.filter(
    (game) => game.white.username === username && game.rated
  );

  whiteNodes[START_FEN] = createNode(START_FEN);
  blackNodes[START_FEN] = createNode(START_FEN);

  addAllGamesForColor(whiteGames, whiteNodes, username, "white");
  addAllGamesForColor(blackGames, blackNodes, username, "black");

  self.postMessage({
    whiteNodes,
    blackNodes,
  });
};
