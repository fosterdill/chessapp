/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/data-structures/game-graph.js":
/*!*******************************************!*\
  !*** ./src/data-structures/game-graph.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addGame": () => (/* binding */ addGame)
/* harmony export */ });
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph */ "./src/data-structures/graph.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/chess.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chess_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.js");




const addGame = (game, nodes, username, color) => {
	const chessObj = new (chess_js__WEBPACK_IMPORTED_MODULE_1___default())();
	chessObj.load_pgn(game.pgn);
	const moves = chessObj.history();
	const newGame = new (chess_js__WEBPACK_IMPORTED_MODULE_1___default())();
	const fens = [_utils__WEBPACK_IMPORTED_MODULE_2__.START_FEN];

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
			nodes[fen] = (0,_graph__WEBPACK_IMPORTED_MODULE_0__.createNode)(fen);
		}
	}

	// add Edges connecting every Fen
	for (let i = 0; i < moves.length; i++) {
		const fen = fens[i];
		const nextFen = fens[i + 1];

		(0,_graph__WEBPACK_IMPORTED_MODULE_0__.addEdge)((0,_utils__WEBPACK_IMPORTED_MODULE_2__.getMoveName)(i, moves[i]), nodes[fen], nodes[nextFen], {
			win:
				game[color].username === username && game[color].result === "win"
					? 1
					: 0,
			total: 1,
		});
	}
};


/***/ }),

/***/ "./src/data-structures/graph.js":
/*!**************************************!*\
  !*** ./src/data-structures/graph.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createNode": () => (/* binding */ createNode),
/* harmony export */   "addEdge": () => (/* binding */ addEdge)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/chess.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chess_js__WEBPACK_IMPORTED_MODULE_1__);



const createNode = (name, data = {}) => {
  return {
    name,
    data,
    edges: {},
  };
};

const addEdge = (name, from, to, accum = {}) => {
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


/***/ }),

/***/ "./src/data-structures/index.js":
/*!**************************************!*\
  !*** ./src/data-structures/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addGame": () => (/* reexport safe */ _game_graph__WEBPACK_IMPORTED_MODULE_0__.addGame),
/* harmony export */   "createNode": () => (/* reexport safe */ _graph__WEBPACK_IMPORTED_MODULE_1__.createNode),
/* harmony export */   "addEdge": () => (/* reexport safe */ _graph__WEBPACK_IMPORTED_MODULE_1__.addEdge)
/* harmony export */ });
/* harmony import */ var _game_graph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game-graph */ "./src/data-structures/game-graph.js");
/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./graph */ "./src/data-structures/graph.js");




/***/ }),

/***/ "./src/fetches/chesscom.js":
/*!*********************************!*\
  !*** ./src/fetches/chesscom.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllGames": () => (/* binding */ fetchAllGames)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/fetches/utils.js");


const fetchAllGames = async (username) => {
  const { archives } = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.fetchJson)(
    `https://api.chess.com/pub/player/${username}/games/archives`
  );

  const fetchArchives = async (index = 0) => {
    if (index === archives.length) return [];
    const { games } = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.throttledFetchJson)(archives[index]);

    return games.concat(await fetchArchives(index + 1));
  };

  return fetchArchives();
};


/***/ }),

/***/ "./src/fetches/index.js":
/*!******************************!*\
  !*** ./src/fetches/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllGames": () => (/* reexport safe */ _chesscom__WEBPACK_IMPORTED_MODULE_0__.fetchAllGames)
/* harmony export */ });
/* harmony import */ var _chesscom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chesscom */ "./src/fetches/chesscom.js");



/***/ }),

/***/ "./src/fetches/utils.js":
/*!******************************!*\
  !*** ./src/fetches/utils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchJson": () => (/* binding */ fetchJson),
/* harmony export */   "throttledFetchJson": () => (/* binding */ throttledFetchJson)
/* harmony export */ });
const THROTTLE_SPEED = 1000;

const delay = (interval) =>
	new Promise((resolve) => setTimeout(resolve, interval));

const fetchJson = (...args) =>
	fetch(...args).then((response) => response.json());

const throttledFetchJson = async (...args) => {
	const json = fetchJson(...args);

	await delay(THROTTLE_SPEED);
	return json;
};


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "START_FEN": () => (/* binding */ START_FEN),
/* harmony export */   "getFensFromPgn": () => (/* binding */ getFensFromPgn),
/* harmony export */   "getMoveName": () => (/* binding */ getMoveName)
/* harmony export */ });
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/chess.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chess_js__WEBPACK_IMPORTED_MODULE_0__);


const START_FEN =
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const getFensFromPgn = (chessObj) => {};

const getMoveName = (index, move) => {
	if (index % 2 === 0) {
		return `${Math.floor(index / 2) + 1}. ${move}`;
	}

	return `${Math.floor(index / 2) + 1}... ${move}`;
};


/***/ }),

/***/ "./src/workers/build-graph.js":
/*!************************************!*\
  !*** ./src/workers/build-graph.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var localforage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! localforage */ "./node_modules/localforage/dist/localforage.js");
/* harmony import */ var localforage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(localforage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _data_structures__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data-structures */ "./src/data-structures/index.js");
/* harmony import */ var _fetches__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetches */ "./src/fetches/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/utils.js");




self.onmessage = ({ data: { username } }) => {
	main(username);
};

const main = async (username) => {
	const nodes = {};
	const color = "white";
	let allGames = await (0,_fetches__WEBPACK_IMPORTED_MODULE_2__.fetchAllGames)(username);
	allGames = allGames.filter((game) => game.white.username === username);

	nodes[_utils__WEBPACK_IMPORTED_MODULE_3__.START_FEN] = (0,_data_structures__WEBPACK_IMPORTED_MODULE_1__.createNode)(_utils__WEBPACK_IMPORTED_MODULE_3__.START_FEN);

	for (let [index, game] of allGames.entries()) {
		(0,_data_structures__WEBPACK_IMPORTED_MODULE_1__.addGame)(game, nodes, username, color);

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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_chess_js_chess_js-node_modules_localforage_dist_localforage_js"], () => (__webpack_require__("./src/workers/build-graph.js")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_workers_build-graph_js": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkchessapp"] = self["webpackChunkchessapp"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_chess_js_chess_js-node_modules_localforage_dist_localforage_js").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfYnVpbGQtZ3JhcGhfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUE4QztBQUNqQjtBQUNxQjs7QUFFM0M7QUFDUCxzQkFBc0IsaURBQUs7QUFDM0I7QUFDQTtBQUNBLHFCQUFxQixpREFBSztBQUMxQixlQUFlLDZDQUFTOztBQUV4QjtBQUNBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLGtEQUFVO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsa0JBQWtCO0FBQ25DO0FBQ0E7O0FBRUEsRUFBRSwrQ0FBTyxDQUFDLG1EQUFXO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hDa0U7QUFDckM7O0FBRXRCLG1DQUFtQztBQUMxQztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFTywyQ0FBMkM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCdUM7QUFDTzs7Ozs7Ozs7Ozs7Ozs7OztBQ0RVOztBQUVqRDtBQUNQLFVBQVUsV0FBVyxRQUFRLGlEQUFTO0FBQ3RDLHdDQUF3QyxTQUFTO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQSxZQUFZLFFBQVEsUUFBUSwwREFBa0I7O0FBRTlDO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2YyQzs7Ozs7Ozs7Ozs7Ozs7OztBQ0EzQzs7QUFFQTtBQUNBOztBQUVPO0FBQ1A7O0FBRU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiNkI7O0FBRXRCO0FBQ1A7O0FBRU87O0FBRUE7QUFDUDtBQUNBLFlBQVksMEJBQTBCLElBQUksS0FBSztBQUMvQzs7QUFFQSxXQUFXLDBCQUEwQixNQUFNLEtBQUs7QUFDaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYnNDO0FBQ21CO0FBQ2Q7QUFDTjtBQUNyQyxvQkFBb0IsUUFBUSxZQUFZO0FBQ3hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHVEQUFhO0FBQ25DOztBQUVBLE9BQU8sNkNBQVMsSUFBSSw0REFBVSxDQUFDLDZDQUFTOztBQUV4QztBQUNBLEVBQUUseURBQU87O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7Ozs7OztVQ2hDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7Ozs7V0NsQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjs7Ozs7V0NSQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsYUFBYTtXQUNiO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7Ozs7V0NwQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFSEE7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL2RhdGEtc3RydWN0dXJlcy9nYW1lLWdyYXBoLmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL2RhdGEtc3RydWN0dXJlcy9ncmFwaC5qcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC8uL3NyYy9kYXRhLXN0cnVjdHVyZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvZmV0Y2hlcy9jaGVzc2NvbS5qcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC8uL3NyYy9mZXRjaGVzL2luZGV4LmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL2ZldGNoZXMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvd29ya2Vycy9idWlsZC1ncmFwaC5qcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvaW1wb3J0U2NyaXB0cyBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9zdGFydHVwIGNodW5rIGRlcGVuZGVuY2llcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYWRkRWRnZSwgY3JlYXRlTm9kZSB9IGZyb20gXCIuL2dyYXBoXCI7XG5pbXBvcnQgQ2hlc3MgZnJvbSBcImNoZXNzLmpzXCI7XG5pbXBvcnQgeyBTVEFSVF9GRU4sIGdldE1vdmVOYW1lIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmV4cG9ydCBjb25zdCBhZGRHYW1lID0gKGdhbWUsIG5vZGVzLCB1c2VybmFtZSwgY29sb3IpID0+IHtcblx0Y29uc3QgY2hlc3NPYmogPSBuZXcgQ2hlc3MoKTtcblx0Y2hlc3NPYmoubG9hZF9wZ24oZ2FtZS5wZ24pO1xuXHRjb25zdCBtb3ZlcyA9IGNoZXNzT2JqLmhpc3RvcnkoKTtcblx0Y29uc3QgbmV3R2FtZSA9IG5ldyBDaGVzcygpO1xuXHRjb25zdCBmZW5zID0gW1NUQVJUX0ZFTl07XG5cblx0Ly8gR2V0IGEgbGlzdCBvZiBmZW5zIGZyb20gdGhlIHBnblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bmV3R2FtZS5tb3ZlKG1vdmVzW2ldKTtcblx0XHRmZW5zLnB1c2gobmV3R2FtZS5mZW4oKSk7XG5cdH1cblxuXHQvLyBDcmVhdGUgb25lIG5vZGUgZm9yIGVhY2ggRmVuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBmZW4gPSBmZW5zW2ldO1xuXHRcdGNvbnN0IG5leHRGZW4gPSBmZW5zW2kgKyAxXTtcblxuXHRcdGlmICghKGZlbiBpbiBub2RlcykpIHtcblx0XHRcdG5vZGVzW2Zlbl0gPSBjcmVhdGVOb2RlKGZlbik7XG5cdFx0fVxuXHR9XG5cblx0Ly8gYWRkIEVkZ2VzIGNvbm5lY3RpbmcgZXZlcnkgRmVuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBmZW4gPSBmZW5zW2ldO1xuXHRcdGNvbnN0IG5leHRGZW4gPSBmZW5zW2kgKyAxXTtcblxuXHRcdGFkZEVkZ2UoZ2V0TW92ZU5hbWUoaSwgbW92ZXNbaV0pLCBub2Rlc1tmZW5dLCBub2Rlc1tuZXh0RmVuXSwge1xuXHRcdFx0d2luOlxuXHRcdFx0XHRnYW1lW2NvbG9yXS51c2VybmFtZSA9PT0gdXNlcm5hbWUgJiYgZ2FtZVtjb2xvcl0ucmVzdWx0ID09PSBcIndpblwiXG5cdFx0XHRcdFx0PyAxXG5cdFx0XHRcdFx0OiAwLFxuXHRcdFx0dG90YWw6IDEsXG5cdFx0fSk7XG5cdH1cbn07XG4iLCJpbXBvcnQgeyBnZXRNb3ZlTmFtZSwgZ2V0RmVuc0Zyb21QZ24sIFNUQVJUX0ZFTiB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IENoZXNzIGZyb20gXCJjaGVzcy5qc1wiO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTm9kZSA9IChuYW1lLCBkYXRhID0ge30pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIGRhdGEsXG4gICAgZWRnZXM6IHt9LFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZEVkZ2UgPSAobmFtZSwgZnJvbSwgdG8sIGFjY3VtID0ge30pID0+IHtcbiAgY29uc3QgZWRnZSA9IHtcbiAgICBuYW1lLFxuICAgIGZyb20sXG4gICAgdG8sXG4gICAgYWNjdW0sXG4gIH07XG5cbiAgaWYgKCEobmFtZSBpbiBmcm9tLmVkZ2VzKSkge1xuICAgIGZyb20uZWRnZXNbbmFtZV0gPSBlZGdlO1xuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IHYgaW4gZnJvbS5lZGdlc1tuYW1lXS5hY2N1bSkge1xuICAgICAgZnJvbS5lZGdlc1tuYW1lXS5hY2N1bVt2XSArPSBlZGdlLmFjY3VtW3ZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlZGdlO1xufTtcbiIsImV4cG9ydCB7IGFkZEdhbWUgfSBmcm9tIFwiLi9nYW1lLWdyYXBoXCI7XG5leHBvcnQgeyBjcmVhdGVOb2RlLCBhZGRFZGdlIH0gZnJvbSBcIi4vZ3JhcGhcIjtcbiIsImltcG9ydCB7IHRocm90dGxlZEZldGNoSnNvbiwgZmV0Y2hKc29uIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNvbnN0IGZldGNoQWxsR2FtZXMgPSBhc3luYyAodXNlcm5hbWUpID0+IHtcbiAgY29uc3QgeyBhcmNoaXZlcyB9ID0gYXdhaXQgZmV0Y2hKc29uKFxuICAgIGBodHRwczovL2FwaS5jaGVzcy5jb20vcHViL3BsYXllci8ke3VzZXJuYW1lfS9nYW1lcy9hcmNoaXZlc2BcbiAgKTtcblxuICBjb25zdCBmZXRjaEFyY2hpdmVzID0gYXN5bmMgKGluZGV4ID0gMCkgPT4ge1xuICAgIGlmIChpbmRleCA9PT0gYXJjaGl2ZXMubGVuZ3RoKSByZXR1cm4gW107XG4gICAgY29uc3QgeyBnYW1lcyB9ID0gYXdhaXQgdGhyb3R0bGVkRmV0Y2hKc29uKGFyY2hpdmVzW2luZGV4XSk7XG5cbiAgICByZXR1cm4gZ2FtZXMuY29uY2F0KGF3YWl0IGZldGNoQXJjaGl2ZXMoaW5kZXggKyAxKSk7XG4gIH07XG5cbiAgcmV0dXJuIGZldGNoQXJjaGl2ZXMoKTtcbn07XG4iLCJleHBvcnQgeyBmZXRjaEFsbEdhbWVzIH0gZnJvbSBcIi4vY2hlc3Njb21cIjtcbiIsImNvbnN0IFRIUk9UVExFX1NQRUVEID0gMTAwMDtcblxuY29uc3QgZGVsYXkgPSAoaW50ZXJ2YWwpID0+XG5cdG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsKSk7XG5cbmV4cG9ydCBjb25zdCBmZXRjaEpzb24gPSAoLi4uYXJncykgPT5cblx0ZmV0Y2goLi4uYXJncykudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSk7XG5cbmV4cG9ydCBjb25zdCB0aHJvdHRsZWRGZXRjaEpzb24gPSBhc3luYyAoLi4uYXJncykgPT4ge1xuXHRjb25zdCBqc29uID0gZmV0Y2hKc29uKC4uLmFyZ3MpO1xuXG5cdGF3YWl0IGRlbGF5KFRIUk9UVExFX1NQRUVEKTtcblx0cmV0dXJuIGpzb247XG59O1xuIiwiaW1wb3J0IENoZXNzIGZyb20gXCJjaGVzcy5qc1wiO1xuXG5leHBvcnQgY29uc3QgU1RBUlRfRkVOID1cblx0XCJybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMVwiO1xuXG5leHBvcnQgY29uc3QgZ2V0RmVuc0Zyb21QZ24gPSAoY2hlc3NPYmopID0+IHt9O1xuXG5leHBvcnQgY29uc3QgZ2V0TW92ZU5hbWUgPSAoaW5kZXgsIG1vdmUpID0+IHtcblx0aWYgKGluZGV4ICUgMiA9PT0gMCkge1xuXHRcdHJldHVybiBgJHtNYXRoLmZsb29yKGluZGV4IC8gMikgKyAxfS4gJHttb3ZlfWA7XG5cdH1cblxuXHRyZXR1cm4gYCR7TWF0aC5mbG9vcihpbmRleCAvIDIpICsgMX0uLi4gJHttb3ZlfWA7XG59O1xuIiwiaW1wb3J0IGxvY2FsRm9yYWdlIGZyb20gXCJsb2NhbGZvcmFnZVwiO1xuaW1wb3J0IHsgYWRkR2FtZSwgY3JlYXRlTm9kZSB9IGZyb20gXCIuLi9kYXRhLXN0cnVjdHVyZXNcIjtcbmltcG9ydCB7IGZldGNoQWxsR2FtZXMgfSBmcm9tIFwiLi4vZmV0Y2hlc1wiO1xuaW1wb3J0IHsgU1RBUlRfRkVOIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5zZWxmLm9ubWVzc2FnZSA9ICh7IGRhdGE6IHsgdXNlcm5hbWUgfSB9KSA9PiB7XG5cdG1haW4odXNlcm5hbWUpO1xufTtcblxuY29uc3QgbWFpbiA9IGFzeW5jICh1c2VybmFtZSkgPT4ge1xuXHRjb25zdCBub2RlcyA9IHt9O1xuXHRjb25zdCBjb2xvciA9IFwid2hpdGVcIjtcblx0bGV0IGFsbEdhbWVzID0gYXdhaXQgZmV0Y2hBbGxHYW1lcyh1c2VybmFtZSk7XG5cdGFsbEdhbWVzID0gYWxsR2FtZXMuZmlsdGVyKChnYW1lKSA9PiBnYW1lLndoaXRlLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG5cblx0bm9kZXNbU1RBUlRfRkVOXSA9IGNyZWF0ZU5vZGUoU1RBUlRfRkVOKTtcblxuXHRmb3IgKGxldCBbaW5kZXgsIGdhbWVdIG9mIGFsbEdhbWVzLmVudHJpZXMoKSkge1xuXHRcdGFkZEdhbWUoZ2FtZSwgbm9kZXMsIHVzZXJuYW1lLCBjb2xvcik7XG5cblx0XHRjb25zdCBwZXJjZW50YWdlID0gTWF0aC5yb3VuZCgoMTAwICogaW5kZXgpIC8gYWxsR2FtZXMubGVuZ3RoKTtcblx0XHRpZiAocGVyY2VudGFnZSAlIDIwID09PSAwKSB7XG5cdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0bm9kZXMsXG5cdFx0XHRcdHBlcmNlbnRhZ2U6IE1hdGgucm91bmQoKDEwMCAqIGluZGV4KSAvIGFsbEdhbWVzLmxlbmd0aCksXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRub2Rlcyxcblx0XHRkb25lOiB0cnVlLFxuXHR9KTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbi8vIHRoZSBzdGFydHVwIGZ1bmN0aW9uXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuXHQvLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcblx0dmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jaGVzc19qc19jaGVzc19qcy1ub2RlX21vZHVsZXNfbG9jYWxmb3JhZ2VfZGlzdF9sb2NhbGZvcmFnZV9qc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93b3JrZXJzL2J1aWxkLWdyYXBoLmpzXCIpKSlcblx0X193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcblx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG59O1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3MgYW5kIHNpYmxpbmcgY2h1bmtzIGZvciB0aGUgZW50cnlwb2ludFxuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmJ1bmRsZS5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBjaHVua3Ncbi8vIFwiMVwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJzcmNfd29ya2Vyc19idWlsZC1ncmFwaF9qc1wiOiAxXG59O1xuXG4vLyBpbXBvcnRTY3JpcHRzIGNodW5rIGxvYWRpbmdcbnZhciBpbnN0YWxsQ2h1bmsgPSAoZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdHdoaWxlKGNodW5rSWRzLmxlbmd0aClcblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHMucG9wKCldID0gMTtcblx0cGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG59O1xuX193ZWJwYWNrX3JlcXVpcmVfXy5mLmkgPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcblx0Ly8gXCIxXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG5cdGlmKCFpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRpZih0cnVlKSB7IC8vIGFsbCBjaHVua3MgaGF2ZSBKU1xuXHRcdFx0aW1wb3J0U2NyaXB0cyhfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLnUoY2h1bmtJZCkpO1xuXHRcdH1cblx0fVxufTtcblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjaGVzc2FwcFwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjaGVzc2FwcFwiXSB8fCBbXTtcbnZhciBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiA9IGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gaW5zdGFsbENodW5rO1xuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0IiwidmFyIG5leHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLng7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jaGVzc19qc19jaGVzc19qcy1ub2RlX21vZHVsZXNfbG9jYWxmb3JhZ2VfZGlzdF9sb2NhbGZvcmFnZV9qc1wiKS50aGVuKG5leHQpO1xufTsiLCIiLCIvLyBydW4gc3RhcnR1cFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLngoKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==