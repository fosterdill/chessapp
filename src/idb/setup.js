import localForage from "localforage";

export const setup = () => {
  localForage.config({
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
    name: "Chessapp",
  });
};
