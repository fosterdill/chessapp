import localForage from "localforage";

import { fetchAllGames } from "./fetches";
import { START_FEN, getMoveName } from "./utils";
import { addEdge, createNode } from "./data-structures/graph";

export default async (username) => {
  const lastUpdatedDate = await localForage.getItem(
    `${username}_lastUpdatedDate`
  );

  if (lastUpdatedDate) {
    const whiteNodes = await localForage.getItem(`${username}_nodes_white`);
    const blackNodes = await localForage.getItem(`${username}_nodes_black`);

    return Promise.resolve({ whiteNodes, blackNodes });
  } else {
    const games = await fetchAllGames(username);

    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("./workers/build-graph", import.meta.url)
      );

      worker.postMessage({ username, games });
      worker.onmessage = ({ data: { whiteNodes, blackNodes } }) => {
        localForage.setItem(`${username}_nodes_black`, blackNodes);
        localForage.setItem(`${username}_nodes_white`, whiteNodes);
        localForage.setItem(
          `${username}_lastUpdatedDate`,
          new Date().toString()
        );

        resolve({ whiteNodes, blackNodes });
      };
    });
  }
};
