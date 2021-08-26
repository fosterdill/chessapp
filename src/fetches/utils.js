const THROTTLE_SPEED = 1000;

const delay = (interval) =>
	new Promise((resolve) => setTimeout(resolve, interval));

export const fetchJson = (...args) =>
	fetch(...args).then((response) => response.json());

export const throttledFetchJson = async (...args) => {
	const json = fetchJson(...args);

	await delay(THROTTLE_SPEED);
	return json;
};
