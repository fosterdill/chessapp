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
  allGames = allGames.filter(
    (game) => game[color].username === username && game.rated
  );

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfYnVpbGQtZ3JhcGhfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFrRTtBQUNyQzs7QUFFdEIsbUNBQW1DO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVPLDJDQUEyQztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUJ3RDs7QUFFakQ7QUFDUCxVQUFVLFdBQVcsUUFBUSxpREFBUztBQUN0Qyx3Q0FBd0MsU0FBUztBQUNqRDs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxRQUFRLFFBQVEsMERBQWtCOztBQUU5QztBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmMkM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBM0M7O0FBRUE7QUFDQTs7QUFFTztBQUNQOztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiNkI7O0FBRXRCO0FBQ1A7O0FBRU87QUFDUDtBQUNBLFlBQVksMEJBQTBCLElBQUksS0FBSztBQUMvQzs7QUFFQSxXQUFXLDBCQUEwQixNQUFNLEtBQUs7QUFDaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYc0M7QUFDSztBQUNPO0FBQ2E7QUFDbEM7O0FBRTdCO0FBQ0EsdUJBQXVCLGlEQUFLO0FBQzVCO0FBQ0E7QUFDQSxzQkFBc0IsaURBQUs7QUFDM0IsZ0JBQWdCLDZDQUFTOztBQUV6QjtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGtCQUFrQjtBQUNwQztBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGtFQUFVO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7O0FBRUEsSUFBSSwrREFBTyxDQUFDLG1EQUFXO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUSxtQkFBbUI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHVEQUFhO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLDZDQUFTLElBQUksa0VBQVUsQ0FBQyw2Q0FBUzs7QUFFekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7O1VDekVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOzs7OztXQ2xDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGOzs7OztXQ1JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2ZBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxhQUFhO1dBQ2I7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOztXQUVBOztXQUVBOzs7OztXQ3BDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7VUVIQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvZGF0YS1zdHJ1Y3R1cmVzL2dyYXBoLmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL2ZldGNoZXMvY2hlc3Njb20uanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvLi9zcmMvZmV0Y2hlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9jaGVzc2FwcC8uL3NyYy9mZXRjaGVzL3V0aWxzLmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2NoZXNzYXBwLy4vc3JjL3dvcmtlcnMvYnVpbGQtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NoZXNzYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9ydW50aW1lL2ltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3J1bnRpbWUvc3RhcnR1cCBjaHVuayBkZXBlbmRlbmNpZXMiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jaGVzc2FwcC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2hlc3NhcHAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldE1vdmVOYW1lLCBnZXRGZW5zRnJvbVBnbiwgU1RBUlRfRkVOIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgQ2hlc3MgZnJvbSBcImNoZXNzLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlID0gKG5hbWUsIGRhdGEgPSB7fSkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgZGF0YSxcbiAgICBlZGdlczoge30sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgYWRkRWRnZSA9IChuYW1lLCBmcm9tLCB0bywgYWNjdW0gPSB7fSkgPT4ge1xuICBjb25zdCBlZGdlID0ge1xuICAgIG5hbWUsXG4gICAgZnJvbSxcbiAgICB0byxcbiAgICBhY2N1bSxcbiAgfTtcblxuICBpZiAoIShuYW1lIGluIGZyb20uZWRnZXMpKSB7XG4gICAgZnJvbS5lZGdlc1tuYW1lXSA9IGVkZ2U7XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgdiBpbiBmcm9tLmVkZ2VzW25hbWVdLmFjY3VtKSB7XG4gICAgICBmcm9tLmVkZ2VzW25hbWVdLmFjY3VtW3ZdICs9IGVkZ2UuYWNjdW1bdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVkZ2U7XG59O1xuIiwiaW1wb3J0IHsgdGhyb3R0bGVkRmV0Y2hKc29uLCBmZXRjaEpzb24gfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hBbGxHYW1lcyA9IGFzeW5jICh1c2VybmFtZSkgPT4ge1xuICBjb25zdCB7IGFyY2hpdmVzIH0gPSBhd2FpdCBmZXRjaEpzb24oXG4gICAgYGh0dHBzOi8vYXBpLmNoZXNzLmNvbS9wdWIvcGxheWVyLyR7dXNlcm5hbWV9L2dhbWVzL2FyY2hpdmVzYFxuICApO1xuXG4gIGNvbnN0IGZldGNoQXJjaGl2ZXMgPSBhc3luYyAoaW5kZXggPSAwKSA9PiB7XG4gICAgaWYgKGluZGV4ID09PSBhcmNoaXZlcy5sZW5ndGgpIHJldHVybiBbXTtcbiAgICBjb25zdCB7IGdhbWVzIH0gPSBhd2FpdCB0aHJvdHRsZWRGZXRjaEpzb24oYXJjaGl2ZXNbaW5kZXhdKTtcblxuICAgIHJldHVybiBnYW1lcy5jb25jYXQoYXdhaXQgZmV0Y2hBcmNoaXZlcyhpbmRleCArIDEpKTtcbiAgfTtcblxuICByZXR1cm4gZmV0Y2hBcmNoaXZlcygpO1xufTtcbiIsImV4cG9ydCB7IGZldGNoQWxsR2FtZXMgfSBmcm9tIFwiLi9jaGVzc2NvbVwiO1xuIiwiY29uc3QgVEhST1RUTEVfU1BFRUQgPSAxMDAwO1xuXG5jb25zdCBkZWxheSA9IChpbnRlcnZhbCkgPT5cblx0bmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgaW50ZXJ2YWwpKTtcblxuZXhwb3J0IGNvbnN0IGZldGNoSnNvbiA9ICguLi5hcmdzKSA9PlxuXHRmZXRjaCguLi5hcmdzKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKTtcblxuZXhwb3J0IGNvbnN0IHRocm90dGxlZEZldGNoSnNvbiA9IGFzeW5jICguLi5hcmdzKSA9PiB7XG5cdGNvbnN0IGpzb24gPSBmZXRjaEpzb24oLi4uYXJncyk7XG5cblx0YXdhaXQgZGVsYXkoVEhST1RUTEVfU1BFRUQpO1xuXHRyZXR1cm4ganNvbjtcbn07XG4iLCJpbXBvcnQgQ2hlc3MgZnJvbSBcImNoZXNzLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBTVEFSVF9GRU4gPVxuXHRcInJuYnFrYm5yL3BwcHBwcHBwLzgvOC84LzgvUFBQUFBQUFAvUk5CUUtCTlIgdyBLUWtxIC0gMCAxXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRNb3ZlTmFtZSA9IChpbmRleCwgbW92ZSkgPT4ge1xuXHRpZiAoaW5kZXggJSAyID09PSAwKSB7XG5cdFx0cmV0dXJuIGAke01hdGguZmxvb3IoaW5kZXggLyAyKSArIDF9LiAke21vdmV9YDtcblx0fVxuXG5cdHJldHVybiBgJHtNYXRoLmZsb29yKGluZGV4IC8gMikgKyAxfS4uLiAke21vdmV9YDtcbn07XG4iLCJpbXBvcnQgbG9jYWxGb3JhZ2UgZnJvbSBcImxvY2FsZm9yYWdlXCI7XG5pbXBvcnQgeyBmZXRjaEFsbEdhbWVzIH0gZnJvbSBcIi4uL2ZldGNoZXNcIjtcbmltcG9ydCB7IFNUQVJUX0ZFTiwgZ2V0TW92ZU5hbWUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IGFkZEVkZ2UsIGNyZWF0ZU5vZGUgfSBmcm9tIFwiLi4vZGF0YS1zdHJ1Y3R1cmVzL2dyYXBoXCI7XG5pbXBvcnQgQ2hlc3MgZnJvbSBcImNoZXNzLmpzXCI7XG5cbmNvbnN0IGFkZEdhbWUgPSAoZ2FtZSwgbm9kZXMsIHVzZXJuYW1lLCBjb2xvcikgPT4ge1xuICBjb25zdCBjaGVzc09iaiA9IG5ldyBDaGVzcygpO1xuICBjaGVzc09iai5sb2FkX3BnbihnYW1lLnBnbik7XG4gIGNvbnN0IG1vdmVzID0gY2hlc3NPYmouaGlzdG9yeSgpO1xuICBjb25zdCBuZXdHYW1lID0gbmV3IENoZXNzKCk7XG4gIGNvbnN0IGZlbnMgPSBbU1RBUlRfRkVOXTtcblxuICAvLyBHZXQgYSBsaXN0IG9mIGZlbnMgZnJvbSB0aGUgcGduXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBuZXdHYW1lLm1vdmUobW92ZXNbaV0pO1xuICAgIGZlbnMucHVzaChuZXdHYW1lLmZlbigpKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBvbmUgbm9kZSBmb3IgZWFjaCBGZW5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGZlbiA9IGZlbnNbaV07XG4gICAgY29uc3QgbmV4dEZlbiA9IGZlbnNbaSArIDFdO1xuXG4gICAgaWYgKCEoZmVuIGluIG5vZGVzKSkge1xuICAgICAgbm9kZXNbZmVuXSA9IGNyZWF0ZU5vZGUoZmVuKTtcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgRWRnZXMgY29ubmVjdGluZyBldmVyeSBGZW5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGZlbiA9IGZlbnNbaV07XG4gICAgY29uc3QgbmV4dEZlbiA9IGZlbnNbaSArIDFdO1xuXG4gICAgYWRkRWRnZShnZXRNb3ZlTmFtZShpLCBtb3Zlc1tpXSksIG5vZGVzW2Zlbl0sIG5vZGVzW25leHRGZW5dLCB7XG4gICAgICB3aW46XG4gICAgICAgIGdhbWVbY29sb3JdLnVzZXJuYW1lID09PSB1c2VybmFtZSAmJiBnYW1lW2NvbG9yXS5yZXN1bHQgPT09IFwid2luXCJcbiAgICAgICAgICA/IDFcbiAgICAgICAgICA6IDAsXG4gICAgICB0b3RhbDogMSxcbiAgICB9KTtcbiAgfVxufTtcblxuc2VsZi5vbm1lc3NhZ2UgPSAoeyBkYXRhOiB7IHVzZXJuYW1lLCBjb2xvciB9IH0pID0+IHtcbiAgbWFpbih1c2VybmFtZSwgY29sb3IpO1xufTtcblxuY29uc3QgbWFpbiA9IGFzeW5jICh1c2VybmFtZSwgY29sb3IpID0+IHtcbiAgY29uc3Qgbm9kZXMgPSB7fTtcbiAgbGV0IGFsbEdhbWVzID0gYXdhaXQgZmV0Y2hBbGxHYW1lcyh1c2VybmFtZSk7XG4gIGFsbEdhbWVzID0gYWxsR2FtZXMuZmlsdGVyKFxuICAgIChnYW1lKSA9PiBnYW1lW2NvbG9yXS51c2VybmFtZSA9PT0gdXNlcm5hbWUgJiYgZ2FtZS5yYXRlZFxuICApO1xuXG4gIG5vZGVzW1NUQVJUX0ZFTl0gPSBjcmVhdGVOb2RlKFNUQVJUX0ZFTik7XG5cbiAgZm9yIChsZXQgW2luZGV4LCBnYW1lXSBvZiBhbGxHYW1lcy5lbnRyaWVzKCkpIHtcbiAgICBhZGRHYW1lKGdhbWUsIG5vZGVzLCB1c2VybmFtZSwgY29sb3IpO1xuXG4gICAgY29uc3QgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoKDEwMCAqIGluZGV4KSAvIGFsbEdhbWVzLmxlbmd0aCk7XG4gICAgaWYgKHBlcmNlbnRhZ2UgJSAyMCA9PT0gMCkge1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIG5vZGVzLFxuICAgICAgICBwZXJjZW50YWdlOiBNYXRoLnJvdW5kKCgxMDAgKiBpbmRleCkgLyBhbGxHYW1lcy5sZW5ndGgpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgbm9kZXMsXG4gICAgZG9uZTogdHJ1ZSxcbiAgfSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4vLyB0aGUgc3RhcnR1cCBmdW5jdGlvblxuX193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcblx0Ly8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG5cdHZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2hlc3NfanNfY2hlc3NfanMtbm9kZV9tb2R1bGVzX2xvY2FsZm9yYWdlX2Rpc3RfbG9jYWxmb3JhZ2VfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvd29ya2Vycy9idWlsZC1ncmFwaC5qc1wiKSkpXG5cdF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG5cdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xufTtcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzIGFuZCBzaWJsaW5nIGNodW5rcyBmb3IgdGhlIGVudHJ5cG9pbnRcbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi5idW5kbGUuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4vLyBcIjFcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwic3JjX3dvcmtlcnNfYnVpbGQtZ3JhcGhfanNcIjogMVxufTtcblxuLy8gaW1wb3J0U2NyaXB0cyBjaHVuayBsb2FkaW5nXG52YXIgaW5zdGFsbENodW5rID0gKGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR3aGlsZShjaHVua0lkcy5sZW5ndGgpXG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzLnBvcCgpXSA9IDE7XG5cdHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xufTtcbl9fd2VicGFja19yZXF1aXJlX18uZi5pID0gKGNodW5rSWQsIHByb21pc2VzKSA9PiB7XG5cdC8vIFwiMVwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuXHRpZighaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0aWYodHJ1ZSkgeyAvLyBhbGwgY2h1bmtzIGhhdmUgSlNcblx0XHRcdGltcG9ydFNjcmlwdHMoX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpKTtcblx0XHR9XG5cdH1cbn07XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2hlc3NhcHBcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2hlc3NhcHBcIl0gfHwgW107XG52YXIgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24gPSBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IGluc3RhbGxDaHVuaztcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdCIsInZhciBuZXh0ID0gX193ZWJwYWNrX3JlcXVpcmVfXy54O1xuX193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKFwidmVuZG9ycy1ub2RlX21vZHVsZXNfY2hlc3NfanNfY2hlc3NfanMtbm9kZV9tb2R1bGVzX2xvY2FsZm9yYWdlX2Rpc3RfbG9jYWxmb3JhZ2VfanNcIikudGhlbihuZXh0KTtcbn07IiwiIiwiLy8gcnVuIHN0YXJ0dXBcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy54KCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=