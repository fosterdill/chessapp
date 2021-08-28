import localForage from "localforage";
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

self.onmessage = ({ data: { username, color } }) => {
  main(username, color);
};

const main = async (username, color) => {
  const nodes = {};
  let allGames = await fetchAllGames(username);
  allGames = allGames.filter((game) => game[color].username === username);

  nodes[START_FEN] = createNode(START_FEN);

  for (let [index, game] of allGames.entries()) {
    addGame(game, nodes, username, color);

    const percentage = Math.round((100 * index) / allGames.length);
    if (percentage % 20 === 0) {
      self.postMessage({
        nodes,
        percentage: Math.round((100 * index) / allGames.length),
      });
    }
  }

  self.postMessage({
    nodes,
    done: true,
  });
};
