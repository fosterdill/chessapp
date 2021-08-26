/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/* harmony import */ var _fetches__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fetches */ "./src/fetches/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
/* harmony import */ var _data_structures_graph__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../data-structures/graph */ "./src/data-structures/graph.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/chess.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(chess_js__WEBPACK_IMPORTED_MODULE_4__);






const addGame = (game, nodes, username, color) => {
  const chessObj = new (chess_js__WEBPACK_IMPORTED_MODULE_4___default())();
  chessObj.load_pgn(game.pgn);
  const moves = chessObj.history();
  const newGame = new (chess_js__WEBPACK_IMPORTED_MODULE_4___default())();
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
      nodes[fen] = (0,_data_structures_graph__WEBPACK_IMPORTED_MODULE_3__.createNode)(fen);
    }
  }

  // add Edges connecting every Fen
  for (let i = 0; i < moves.length; i++) {
    const fen = fens[i];
    const nextFen = fens[i + 1];

    (0,_data_structures_graph__WEBPACK_IMPORTED_MODULE_3__.addEdge)((0,_utils__WEBPACK_IMPORTED_MODULE_2__.getMoveName)(i, moves[i]), nodes[fen], nodes[nextFen], {
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
  let allGames = await (0,_fetches__WEBPACK_IMPORTED_MODULE_1__.fetchAllGames)(username);
  allGames = allGames.filter((game) => game.white.username === username);

  nodes[_utils__WEBPACK_IMPORTED_MODULE_2__.START_FEN] = (0,_data_structures_graph__WEBPACK_IMPORTED_MODULE_3__.createNode)(_utils__WEBPACK_IMPORTED_MODULE_2__.START_FEN);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfYnVpbGQtZ3JhcGhfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFrRTtBQUNyQzs7QUFFdEIsbUNBQW1DO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVPLDJDQUEyQztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUJ3RDs7QUFFakQ7QUFDUCxVQUFVLFdBQVcsUUFBUSxpREFBUztBQUN0Qyx3Q0FBd0MsU0FBUztBQUNqRDs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxRQUFRLFFBQVEsMERBQWtCOztBQUU5QztBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmMkM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBM0M7O0FBRUE7QUFDQTs7QUFFTztBQUNQOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYjZCOztBQUV0QjtBQUNQOztBQUVPOztBQUVBO0FBQ1A7QUFDQSxZQUFZLDBCQUEwQixJQUFJLEtBQUs7QUFDL0M7O0FBRUEsV0FBVywwQkFBMEIsTUFBTSxLQUFLO0FBQ2hEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYnNDO0FBQ0s7QUFDTztBQUNhO0FBQ2xDOztBQUU3QjtBQUNBLHVCQUF1QixpREFBSztBQUM1QjtBQUNBO0FBQ0Esc0JBQXNCLGlEQUFLO0FBQzNCLGdCQUFnQiw2Q0FBUzs7QUFFekI7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixrRUFBVTtBQUM3QjtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQztBQUNBOztBQUVBLElBQUksK0RBQU8sQ0FBQyxtREFBVztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVEsbUJBQW1CO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1Qix1REFBYTtBQUNwQzs7QUFFQSxRQUFRLDZDQUFTLElBQUksa0VBQVUsQ0FBQyw2Q0FBUzs7QUFFekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7O1VDdkVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOzs7OztXQ2xDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGOzs7OztXQ1JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2ZBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxhQUFhO1dBQ2I7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOztXQUVBOztXQUVBOzs7OztXQ3BDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7VUVIQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvZGF0YS1zdHJ1Y3R1cmVzL2dyYXBoLmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL2ZldGNoZXMvY2hlc3Njb20uanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvZmV0Y2hlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC8uL3NyYy9mZXRjaGVzL3V0aWxzLmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL3dvcmtlcnMvYnVpbGQtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2ltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvc3RhcnR1cCBjaHVuayBkZXBlbmRlbmNpZXMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldE1vdmVOYW1lLCBnZXRGZW5zRnJvbVBnbiwgU1RBUlRfRkVOIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgQ2hlc3MgZnJvbSBcImNoZXNzLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlID0gKG5hbWUsIGRhdGEgPSB7fSkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgZGF0YSxcbiAgICBlZGdlczoge30sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgYWRkRWRnZSA9IChuYW1lLCBmcm9tLCB0bywgYWNjdW0gPSB7fSkgPT4ge1xuICBjb25zdCBlZGdlID0ge1xuICAgIG5hbWUsXG4gICAgZnJvbSxcbiAgICB0byxcbiAgICBhY2N1bSxcbiAgfTtcblxuICBpZiAoIShuYW1lIGluIGZyb20uZWRnZXMpKSB7XG4gICAgZnJvbS5lZGdlc1tuYW1lXSA9IGVkZ2U7XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgdiBpbiBmcm9tLmVkZ2VzW25hbWVdLmFjY3VtKSB7XG4gICAgICBmcm9tLmVkZ2VzW25hbWVdLmFjY3VtW3ZdICs9IGVkZ2UuYWNjdW1bdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVkZ2U7XG59O1xuIiwiaW1wb3J0IHsgdGhyb3R0bGVkRmV0Y2hKc29uLCBmZXRjaEpzb24gfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hBbGxHYW1lcyA9IGFzeW5jICh1c2VybmFtZSkgPT4ge1xuICBjb25zdCB7IGFyY2hpdmVzIH0gPSBhd2FpdCBmZXRjaEpzb24oXG4gICAgYGh0dHBzOi8vYXBpLmNoZXNzLmNvbS9wdWIvcGxheWVyLyR7dXNlcm5hbWV9L2dhbWVzL2FyY2hpdmVzYFxuICApO1xuXG4gIGNvbnN0IGZldGNoQXJjaGl2ZXMgPSBhc3luYyAoaW5kZXggPSAwKSA9PiB7XG4gICAgaWYgKGluZGV4ID09PSBhcmNoaXZlcy5sZW5ndGgpIHJldHVybiBbXTtcbiAgICBjb25zdCB7IGdhbWVzIH0gPSBhd2FpdCB0aHJvdHRsZWRGZXRjaEpzb24oYXJjaGl2ZXNbaW5kZXhdKTtcblxuICAgIHJldHVybiBnYW1lcy5jb25jYXQoYXdhaXQgZmV0Y2hBcmNoaXZlcyhpbmRleCArIDEpKTtcbiAgfTtcblxuICByZXR1cm4gZmV0Y2hBcmNoaXZlcygpO1xufTtcbiIsImV4cG9ydCB7IGZldGNoQWxsR2FtZXMgfSBmcm9tIFwiLi9jaGVzc2NvbVwiO1xuIiwiY29uc3QgVEhST1RUTEVfU1BFRUQgPSAxMDAwO1xuXG5jb25zdCBkZWxheSA9IChpbnRlcnZhbCkgPT5cblx0bmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgaW50ZXJ2YWwpKTtcblxuZXhwb3J0IGNvbnN0IGZldGNoSnNvbiA9ICguLi5hcmdzKSA9PlxuXHRmZXRjaCguLi5hcmdzKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKTtcblxuZXhwb3J0IGNvbnN0IHRocm90dGxlZEZldGNoSnNvbiA9IGFzeW5jICguLi5hcmdzKSA9PiB7XG5cdGNvbnN0IGpzb24gPSBmZXRjaEpzb24oLi4uYXJncyk7XG5cblx0YXdhaXQgZGVsYXkoVEhST1RUTEVfU1BFRUQpO1xuXHRyZXR1cm4ganNvbjtcbn07XG4iLCJpbXBvcnQgQ2hlc3MgZnJvbSBcImNoZXNzLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBTVEFSVF9GRU4gPVxuXHRcInJuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAxXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRGZW5zRnJvbVBnbiA9IChjaGVzc09iaikgPT4ge307XG5cbmV4cG9ydCBjb25zdCBnZXRNb3ZlTmFtZSA9IChpbmRleCwgbW92ZSkgPT4ge1xuXHRpZiAoaW5kZXggJSAyID09PSAwKSB7XG5cdFx0cmV0dXJuIGAke01hdGguZmxvb3IoaW5kZXggLyAyKSArIDF9LiAke21vdmV9YDtcblx0fVxuXG5cdHJldHVybiBgJHtNYXRoLmZsb29yKGluZGV4IC8gMikgKyAxfS4uLiAke21vdmV9YDtcbn07XG4iLCJpbXBvcnQgbG9jYWxGb3JhZ2UgZnJvbSBcImxvY2FsZm9yYWdlXCI7XG5pbXBvcnQgeyBmZXRjaEFsbEdhbWVzIH0gZnJvbSBcIi4uL2ZldGNoZXNcIjtcbmltcG9ydCB7IFNUQVJUX0ZFTiwgZ2V0TW92ZU5hbWUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IGFkZEVkZ2UsIGNyZWF0ZU5vZGUgfSBmcm9tIFwiLi4vZGF0YS1zdHJ1Y3R1cmVzL2dyYXBoXCI7XG5pbXBvcnQgQ2hlc3MgZnJvbSBcImNoZXNzLmpzXCI7XG5cbmNvbnN0IGFkZEdhbWUgPSAoZ2FtZSwgbm9kZXMsIHVzZXJuYW1lLCBjb2xvcikgPT4ge1xuICBjb25zdCBjaGVzc09iaiA9IG5ldyBDaGVzcygpO1xuICBjaGVzc09iai5sb2FkX3BnbihnYW1lLnBnbik7XG4gIGNvbnN0IG1vdmVzID0gY2hlc3NPYmouaGlzdG9yeSgpO1xuICBjb25zdCBuZXdHYW1lID0gbmV3IENoZXNzKCk7XG4gIGNvbnN0IGZlbnMgPSBbU1RBUlRfRkVOXTtcblxuICAvLyBHZXQgYSBsaXN0IG9mIGZlbnMgZnJvbSB0aGUgcGduXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBuZXdHYW1lLm1vdmUobW92ZXNbaV0pO1xuICAgIGZlbnMucHVzaChuZXdHYW1lLmZlbigpKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBvbmUgbm9kZSBmb3IgZWFjaCBGZW5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGZlbiA9IGZlbnNbaV07XG4gICAgY29uc3QgbmV4dEZlbiA9IGZlbnNbaSArIDFdO1xuXG4gICAgaWYgKCEoZmVuIGluIG5vZGVzKSkge1xuICAgICAgbm9kZXNbZmVuXSA9IGNyZWF0ZU5vZGUoZmVuKTtcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgRWRnZXMgY29ubmVjdGluZyBldmVyeSBGZW5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGZlbiA9IGZlbnNbaV07XG4gICAgY29uc3QgbmV4dEZlbiA9IGZlbnNbaSArIDFdO1xuXG4gICAgYWRkRWRnZShnZXRNb3ZlTmFtZShpLCBtb3Zlc1tpXSksIG5vZGVzW2Zlbl0sIG5vZGVzW25leHRGZW5dLCB7XG4gICAgICB3aW46XG4gICAgICAgIGdhbWVbY29sb3JdLnVzZXJuYW1lID09PSB1c2VybmFtZSAmJiBnYW1lW2NvbG9yXS5yZXN1bHQgPT09IFwid2luXCJcbiAgICAgICAgICA/IDFcbiAgICAgICAgICA6IDAsXG4gICAgICB0b3RhbDogMSxcbiAgICB9KTtcbiAgfVxufTtcblxuc2VsZi5vbm1lc3NhZ2UgPSAoeyBkYXRhOiB7IHVzZXJuYW1lLCBjb2xvciB9IH0pID0+IHtcbiAgbWFpbih1c2VybmFtZSwgY29sb3IpO1xufTtcblxuY29uc3QgbWFpbiA9IGFzeW5jICh1c2VybmFtZSwgY29sb3IpID0+IHtcbiAgY29uc3Qgbm9kZXMgPSB7fTtcbiAgbGV0IGFsbEdhbWVzID0gYXdhaXQgZmV0Y2hBbGxHYW1lcyh1c2VybmFtZSk7XG4gIGFsbEdhbWVzID0gYWxsR2FtZXMuZmlsdGVyKChnYW1lKSA9PiBnYW1lLndoaXRlLnVzZXJuYW1lID09PSB1c2VybmFtZSk7XG5cbiAgbm9kZXNbU1RBUlRfRkVOXSA9IGNyZWF0ZU5vZGUoU1RBUlRfRkVOKTtcblxuICBmb3IgKGxldCBbaW5kZXgsIGdhbWVdIG9mIGFsbEdhbWVzLmVudHJpZXMoKSkge1xuICAgIGFkZEdhbWUoZ2FtZSwgbm9kZXMsIHVzZXJuYW1lLCBjb2xvcik7XG5cbiAgICBjb25zdCBwZXJjZW50YWdlID0gTWF0aC5yb3VuZCgoMTAwICogaW5kZXgpIC8gYWxsR2FtZXMubGVuZ3RoKTtcbiAgICBpZiAocGVyY2VudGFnZSAlIDIwID09PSAwKSB7XG4gICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgbm9kZXMsXG4gICAgICAgIHBlcmNlbnRhZ2U6IE1hdGgucm91bmQoKDEwMCAqIGluZGV4KSAvIGFsbEdhbWVzLmxlbmd0aCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICBub2RlcyxcbiAgICBkb25lOiB0cnVlLFxuICB9KTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbi8vIHRoZSBzdGFydHVwIGZ1bmN0aW9uXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuXHQvLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcblx0dmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jaGVzc19qc19jaGVzc19qcy1ub2RlX21vZHVsZXNfbG9jYWxmb3JhZ2VfZGlzdF9sb2NhbGZvcmFnZV9qc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93b3JrZXJzL2J1aWxkLWdyYXBoLmpzXCIpKSlcblx0X193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcblx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG59O1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3MgYW5kIHNpYmxpbmcgY2h1bmtzIGZvciB0aGUgZW50cnlwb2ludFxuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmJ1bmRsZS5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBjaHVua3Ncbi8vIFwiMVwiIG1lYW5zIFwiYWxyZWFkeSBsb2FkZWRcIlxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJzcmNfd29ya2Vyc19idWlsZC1ncmFwaF9qc1wiOiAxXG59O1xuXG4vLyBpbXBvcnRTY3JpcHRzIGNodW5rIGxvYWRpbmdcbnZhciBpbnN0YWxsQ2h1bmsgPSAoZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdHdoaWxlKGNodW5rSWRzLmxlbmd0aClcblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHMucG9wKCldID0gMTtcblx0cGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG59O1xuX193ZWJwYWNrX3JlcXVpcmVfXy5mLmkgPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcblx0Ly8gXCIxXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG5cdGlmKCFpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRpZih0cnVlKSB7IC8vIGFsbCBjaHVua3MgaGF2ZSBKU1xuXHRcdFx0aW1wb3J0U2NyaXB0cyhfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLnUoY2h1bmtJZCkpO1xuXHRcdH1cblx0fVxufTtcblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjaGVzc2FwcFwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjaGVzc2FwcFwiXSB8fCBbXTtcbnZhciBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiA9IGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gaW5zdGFsbENodW5rO1xuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0IiwidmFyIG5leHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLng7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jaGVzc19qc19jaGVzc19qcy1ub2RlX21vZHVsZXNfbG9jYWxmb3JhZ2VfZGlzdF9sb2NhbGZvcmFnZV9qc1wiKS50aGVuKG5leHQpO1xufTsiLCIiLCIvLyBydW4gc3RhcnR1cFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLngoKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==