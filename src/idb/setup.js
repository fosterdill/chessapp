import localForage from "localforage";

export const setupStorage = () => {
  localForage.config({
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
    name: "Chessapp",
  });
};
