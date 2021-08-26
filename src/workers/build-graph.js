import localForage from "localforage";
import { addGame, createNode } from "../data-structures";
import { fetchAllGames } from "../fetches";
import { START_FEN } from "../utils";
self.onmessage = ({ data: { username } }) => {
	main(username);
};

const main = async (username) => {
	const nodes = {};
	const allGames = await fetchAllGames(username);

	nodes[START_FEN] = createNode(START_FEN);

	for (let [index, game] of allGames.entries()) {
		addGame(game, nodes);

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
