import { getMoveName, getFensFromPgn, START_FEN } from "../utils";
import Chess from "chess.js";

export const createNode = (name, data = {}) => {
  return {
    name,
    data,
    edges: {},
  };
};

export const addEdge = (name, from, to, accum = {}) => {
  const edge = {
    name,
    from,
    to,
    accum,
  };

  if (!(name in from.edges)) {
    from.edges[name] = edge;
  } else {
    for (let v in from.edges[name].accum) {
      from.edges[name].accum[v] += edge.accum[v];
    }
  }

  return edge;
};
