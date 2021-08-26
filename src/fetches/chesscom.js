import { throttledFetchJson, fetchJson } from "./utils";

export const fetchAllGames = async (username) => {
  const { archives } = await fetchJson(
    `https://api.chess.com/pub/player/${username}/games/archives`
  );

  const fetchArchives = async (index = 0) => {
    if (index === archives.length) return [];
    const { games } = await throttledFetchJson(archives[index]);

    return games.concat(await fetchArchives(index + 1));
  };

  return fetchArchives();
};
