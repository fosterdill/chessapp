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
/* harmony export */   "getMoveName": () => (/* binding */ getMoveName)
/* harmony export */ });
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chess.js */ "./node_modules/chess.js/chess.js");
/* harmony import */ var chess_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chess_js__WEBPACK_IMPORTED_MODULE_0__);


const START_FEN =
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfYnVpbGQtZ3JhcGhfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFrRTtBQUNyQzs7QUFFdEIsbUNBQW1DO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVPLDJDQUEyQztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUJ3RDs7QUFFakQ7QUFDUCxVQUFVLFdBQVcsUUFBUSxpREFBUztBQUN0Qyx3Q0FBd0MsU0FBUztBQUNqRDs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxRQUFRLFFBQVEsMERBQWtCOztBQUU5QztBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmMkM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBM0M7O0FBRUE7QUFDQTs7QUFFTztBQUNQOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiNkI7O0FBRXRCO0FBQ1A7O0FBRU87QUFDUDtBQUNBLFlBQVksMEJBQTBCLElBQUksS0FBSztBQUMvQzs7QUFFQSxXQUFXLDBCQUEwQixNQUFNLEtBQUs7QUFDaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYc0M7QUFDSztBQUNPO0FBQ2E7QUFDbEM7O0FBRTdCO0FBQ0EsdUJBQXVCLGlEQUFLO0FBQzVCO0FBQ0E7QUFDQSxzQkFBc0IsaURBQUs7QUFDM0IsZ0JBQWdCLDZDQUFTOztBQUV6QjtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQztBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGtFQUFVO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7O0FBRUEsSUFBSSwrREFBTyxDQUFDLG1EQUFXO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUSxtQkFBbUI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHVEQUFhO0FBQ3BDOztBQUVBLFFBQVEsNkNBQVMsSUFBSSxrRUFBVSxDQUFDLDZDQUFTOztBQUV6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7VUN2RUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7Ozs7O1dDbENBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7Ozs7O1dDUkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDZkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGFBQWE7V0FDYjtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7Ozs7O1dDcENBO1dBQ0E7V0FDQTtXQUNBOzs7OztVRUhBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGVzc2FwcC8uL3NyYy9kYXRhLXN0cnVjdHVyZXMvZ3JhcGguanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvZmV0Y2hlcy9jaGVzc2NvbS5qcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC8uL3NyYy9mZXRjaGVzL2luZGV4LmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL2ZldGNoZXMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvd29ya2Vycy9idWlsZC1ncmFwaC5qcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvaW1wb3J0U2NyaXB0cyBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9zdGFydHVwIGNodW5rIGRlcGVuZGVuY2llcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0TW92ZU5hbWUsIGdldEZlbnNGcm9tUGduLCBTVEFSVF9GRU4gfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCBDaGVzcyBmcm9tIFwiY2hlc3MuanNcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU5vZGUgPSAobmFtZSwgZGF0YSA9IHt9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBkYXRhLFxuICAgIGVkZ2VzOiB7fSxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGRFZGdlID0gKG5hbWUsIGZyb20sIHRvLCBhY2N1bSA9IHt9KSA9PiB7XG4gIGNvbnN0IGVkZ2UgPSB7XG4gICAgbmFtZSxcbiAgICBmcm9tLFxuICAgIHRvLFxuICAgIGFjY3VtLFxuICB9O1xuXG4gIGlmICghKG5hbWUgaW4gZnJvbS5lZGdlcykpIHtcbiAgICBmcm9tLmVkZ2VzW25hbWVdID0gZWRnZTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCB2IGluIGZyb20uZWRnZXNbbmFtZV0uYWNjdW0pIHtcbiAgICAgIGZyb20uZWRnZXNbbmFtZV0uYWNjdW1bdl0gKz0gZWRnZS5hY2N1bVt2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWRnZTtcbn07XG4iLCJpbXBvcnQgeyB0aHJvdHRsZWRGZXRjaEpzb24sIGZldGNoSnNvbiB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBjb25zdCBmZXRjaEFsbEdhbWVzID0gYXN5bmMgKHVzZXJuYW1lKSA9PiB7XG4gIGNvbnN0IHsgYXJjaGl2ZXMgfSA9IGF3YWl0IGZldGNoSnNvbihcbiAgICBgaHR0cHM6Ly9hcGkuY2hlc3MuY29tL3B1Yi9wbGF5ZXIvJHt1c2VybmFtZX0vZ2FtZXMvYXJjaGl2ZXNgXG4gICk7XG5cbiAgY29uc3QgZmV0Y2hBcmNoaXZlcyA9IGFzeW5jIChpbmRleCA9IDApID0+IHtcbiAgICBpZiAoaW5kZXggPT09IGFyY2hpdmVzLmxlbmd0aCkgcmV0dXJuIFtdO1xuICAgIGNvbnN0IHsgZ2FtZXMgfSA9IGF3YWl0IHRocm90dGxlZEZldGNoSnNvbihhcmNoaXZlc1tpbmRleF0pO1xuXG4gICAgcmV0dXJuIGdhbWVzLmNvbmNhdChhd2FpdCBmZXRjaEFyY2hpdmVzKGluZGV4ICsgMSkpO1xuICB9O1xuXG4gIHJldHVybiBmZXRjaEFyY2hpdmVzKCk7XG59O1xuIiwiZXhwb3J0IHsgZmV0Y2hBbGxHYW1lcyB9IGZyb20gXCIuL2NoZXNzY29tXCI7XG4iLCJjb25zdCBUSFJPVFRMRV9TUEVFRCA9IDEwMDA7XG5cbmNvbnN0IGRlbGF5ID0gKGludGVydmFsKSA9PlxuXHRuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbCkpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hKc29uID0gKC4uLmFyZ3MpID0+XG5cdGZldGNoKC4uLmFyZ3MpLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpO1xuXG5leHBvcnQgY29uc3QgdGhyb3R0bGVkRmV0Y2hKc29uID0gYXN5bmMgKC4uLmFyZ3MpID0+IHtcblx0Y29uc3QganNvbiA9IGZldGNoSnNvbiguLi5hcmdzKTtcblxuXHRhd2FpdCBkZWxheShUSFJPVFRMRV9TUEVFRCk7XG5cdHJldHVybiBqc29uO1xufTtcbiIsImltcG9ydCBDaGVzcyBmcm9tIFwiY2hlc3MuanNcIjtcblxuZXhwb3J0IGNvbnN0IFNUQVJUX0ZFTiA9XG5cdFwicm5icWtibnIvcHBwcHBwcHAvOC84LzgvOC9QUFBQUFBQUC9STkJRS0JOUiB3IEtRa3EgLSAwIDFcIjtcblxuZXhwb3J0IGNvbnN0IGdldE1vdmVOYW1lID0gKGluZGV4LCBtb3ZlKSA9PiB7XG5cdGlmIChpbmRleCAlIDIgPT09IDApIHtcblx0XHRyZXR1cm4gYCR7TWF0aC5mbG9vcihpbmRleCAvIDIpICsgMX0uICR7bW92ZX1gO1xuXHR9XG5cblx0cmV0dXJuIGAke01hdGguZmxvb3IoaW5kZXggLyAyKSArIDF9Li4uICR7bW92ZX1gO1xufTtcbiIsImltcG9ydCBsb2NhbEZvcmFnZSBmcm9tIFwibG9jYWxmb3JhZ2VcIjtcbmltcG9ydCB7IGZldGNoQWxsR2FtZXMgfSBmcm9tIFwiLi4vZmV0Y2hlc1wiO1xuaW1wb3J0IHsgU1RBUlRfRkVOLCBnZXRNb3ZlTmFtZSB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IHsgYWRkRWRnZSwgY3JlYXRlTm9kZSB9IGZyb20gXCIuLi9kYXRhLXN0cnVjdHVyZXMvZ3JhcGhcIjtcbmltcG9ydCBDaGVzcyBmcm9tIFwiY2hlc3MuanNcIjtcblxuY29uc3QgYWRkR2FtZSA9IChnYW1lLCBub2RlcywgdXNlcm5hbWUsIGNvbG9yKSA9PiB7XG4gIGNvbnN0IGNoZXNzT2JqID0gbmV3IENoZXNzKCk7XG4gIGNoZXNzT2JqLmxvYWRfcGduKGdhbWUucGduKTtcbiAgY29uc3QgbW92ZXMgPSBjaGVzc09iai5oaXN0b3J5KCk7XG4gIGNvbnN0IG5ld0dhbWUgPSBuZXcgQ2hlc3MoKTtcbiAgY29uc3QgZmVucyA9IFtTVEFSVF9GRU5dO1xuXG4gIC8vIEdldCBhIGxpc3Qgb2YgZmVucyBmcm9tIHRoZSBwZ25cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIG5ld0dhbWUubW92ZShtb3Zlc1tpXSk7XG4gICAgZmVucy5wdXNoKG5ld0dhbWUuZmVuKCkpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIG9uZSBub2RlIGZvciBlYWNoIEZlblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZmVuID0gZmVuc1tpXTtcbiAgICBjb25zdCBuZXh0RmVuID0gZmVuc1tpICsgMV07XG5cbiAgICBpZiAoIShmZW4gaW4gbm9kZXMpKSB7XG4gICAgICBub2Rlc1tmZW5dID0gY3JlYXRlTm9kZShmZW4pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFkZCBFZGdlcyBjb25uZWN0aW5nIGV2ZXJ5IEZlblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZmVuID0gZmVuc1tpXTtcbiAgICBjb25zdCBuZXh0RmVuID0gZmVuc1tpICsgMV07XG5cbiAgICBhZGRFZGdlKGdldE1vdmVOYW1lKGksIG1vdmVzW2ldKSwgbm9kZXNbZmVuXSwgbm9kZXNbbmV4dEZlbl0sIHtcbiAgICAgIHdpbjpcbiAgICAgICAgZ2FtZVtjb2xvcl0udXNlcm5hbWUgPT09IHVzZXJuYW1lICYmIGdhbWVbY29sb3JdLnJlc3VsdCA9PT0gXCJ3aW5cIlxuICAgICAgICAgID8gMVxuICAgICAgICAgIDogMCxcbiAgICAgIHRvdGFsOiAxLFxuICAgIH0pO1xuICB9XG59O1xuXG5zZWxmLm9ubWVzc2FnZSA9ICh7IGRhdGE6IHsgdXNlcm5hbWUsIGNvbG9yIH0gfSkgPT4ge1xuICBtYWluKHVzZXJuYW1lLCBjb2xvcik7XG59O1xuXG5jb25zdCBtYWluID0gYXN5bmMgKHVzZXJuYW1lLCBjb2xvcikgPT4ge1xuICBjb25zdCBub2RlcyA9IHt9O1xuICBsZXQgYWxsR2FtZXMgPSBhd2FpdCBmZXRjaEFsbEdhbWVzKHVzZXJuYW1lKTtcbiAgYWxsR2FtZXMgPSBhbGxHYW1lcy5maWx0ZXIoKGdhbWUpID0+IGdhbWUud2hpdGUudXNlcm5hbWUgPT09IHVzZXJuYW1lKTtcblxuICBub2Rlc1tTVEFSVF9GRU5dID0gY3JlYXRlTm9kZShTVEFSVF9GRU4pO1xuXG4gIGZvciAobGV0IFtpbmRleCwgZ2FtZV0gb2YgYWxsR2FtZXMuZW50cmllcygpKSB7XG4gICAgYWRkR2FtZShnYW1lLCBub2RlcywgdXNlcm5hbWUsIGNvbG9yKTtcblxuICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKCgxMDAgKiBpbmRleCkgLyBhbGxHYW1lcy5sZW5ndGgpO1xuICAgIGlmIChwZXJjZW50YWdlICUgMjAgPT09IDApIHtcbiAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBub2RlcyxcbiAgICAgICAgcGVyY2VudGFnZTogTWF0aC5yb3VuZCgoMTAwICogaW5kZXgpIC8gYWxsR2FtZXMubGVuZ3RoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgIG5vZGVzLFxuICAgIGRvbmU6IHRydWUsXG4gIH0pO1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gdGhlIHN0YXJ0dXAgZnVuY3Rpb25cbl9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5cdC8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuXHR2YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2NoZXNzX2pzX2NoZXNzX2pzLW5vZGVfbW9kdWxlc19sb2NhbGZvcmFnZV9kaXN0X2xvY2FsZm9yYWdlX2pzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dvcmtlcnMvYnVpbGQtZ3JhcGguanNcIikpKVxuXHRfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuXHRyZXR1cm4gX193ZWJwYWNrX2V4cG9ydHNfXztcbn07XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5mID0ge307XG4vLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4vLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uZSA9IChjaHVua0lkKSA9PiB7XG5cdHJldHVybiBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmYpLnJlZHVjZSgocHJvbWlzZXMsIGtleSkgPT4ge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uZltrZXldKGNodW5rSWQsIHByb21pc2VzKTtcblx0XHRyZXR1cm4gcHJvbWlzZXM7XG5cdH0sIFtdKSk7XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rcyBhbmQgc2libGluZyBjaHVua3MgZm9yIHRoZSBlbnRyeXBvaW50XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuYnVuZGxlLmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcInNyY193b3JrZXJzX2J1aWxkLWdyYXBoX2pzXCI6IDFcbn07XG5cbi8vIGltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZ1xudmFyIGluc3RhbGxDaHVuayA9IChkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0d2hpbGUoY2h1bmtJZHMubGVuZ3RoKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkcy5wb3AoKV0gPSAxO1xuXHRwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcbn07XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYuaSA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHQvLyBcIjFcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcblx0aWYoIWluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRpbXBvcnRTY3JpcHRzKF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKSk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NoZXNzYXBwXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NoZXNzYXBwXCJdIHx8IFtdO1xudmFyIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uID0gY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSBpbnN0YWxsQ2h1bms7XG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3QiLCJ2YXIgbmV4dCA9IF9fd2VicGFja19yZXF1aXJlX18ueDtcbl9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2NoZXNzX2pzX2NoZXNzX2pzLW5vZGVfbW9kdWxlc19sb2NhbGZvcmFnZV9kaXN0X2xvY2FsZm9yYWdlX2pzXCIpLnRoZW4obmV4dCk7XG59OyIsIiIsIi8vIHJ1biBzdGFydHVwXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9