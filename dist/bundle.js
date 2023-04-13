/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/models/cell.js":
/*!*******************************!*\
  !*** ./src/js/models/cell.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cell": () => (/* binding */ Cell)
/* harmony export */ });
function Cell(x, y) {
  let heldShip = null;
  let isHit = false;

  return { x, y, heldShip, isHit };
}


/***/ }),

/***/ "./src/js/models/game-board.js":
/*!*************************************!*\
  !*** ./src/js/models/game-board.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameBoard": () => (/* binding */ GameBoard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/js/models/ship.js");
/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cell */ "./src/js/models/cell.js");



const GameBoard = () => {
  const board = [];
  const rows = 10;
  const cols = 10;
  const ships = [];
  let hits = [];
  let misses = [];
  generateBoard();

  function generateBoard() {
    for (let i = 0; i < rows; i++) {
      const row = [];
      board.push(row);
      for (let j = 0; j < cols; j++) {
        const col = [(0,_cell__WEBPACK_IMPORTED_MODULE_1__.Cell)(i, j)];
        row.push(col);
      }
    }
  }

  const returnBoard = () => board;

  const findCellAtCoordinates = (x, y) => {
    for (let row of board) {
      for (let boardCell of row) {
        const cell = boardCell[0];
        if (x === cell.x && y === cell.y) return cell;
      }
    }
  };

  const placeShip = (head, tail) => {
    if (!(head instanceof Array) || !(tail instanceof Array))
      throw Error('head and tail must be arrays representing coordinates!');

    let ship;
    const shipCells = [];
    let direction = 'invalid';
    let shipLength;

    if (head[0] === tail[0] && head[1] === tail[1]) direction = 'single-cell';
    else if (head[0] === tail[0]) direction = 'vertical';
    else if (head[1] === tail[1]) direction = 'horizontal';

    const headCell = findCellAtCoordinates(head[0], head[1]);
    const tailCell = findCellAtCoordinates(tail[0], tail[1]);
    shipCells.push(headCell);
    shipCells.push(tailCell);

    if (direction === 'invalid' || !checkBoatPlacementValidity(head, tail)) {
      return false;
    } else if (direction === 'single-cell') {
      ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(1);
      ships.push(ship);
      // case of single-cell boat, remove the double coordinate from arr
      shipCells.shift();
    } else if (direction === 'horizontal') {
      shipLength = Math.abs(head[0] - tail[0]) + 1;
      ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipLength);
      ships.push(ship);
      const cellNumberNotFound = shipLength - 2;
      // calculate the cells missing to complete the boat
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[1];
        const variableCoord = Math.max(head[0], tail[0]);
        const cellInBetween = findCellAtCoordinates(
          variableCoord - i,
          fixedCoord
        );
        shipCells.push(cellInBetween);
      }
    } else if (direction === 'vertical') {
      shipLength = Math.abs(head[1] - tail[1]) + 1;
      ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipLength);
      ships.push(ship);
      const cellNumberNotFound = shipLength - 2;
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[0];
        const variableCoord = Math.max(tail[1], tail[0]);
        const cellInBetween = findCellAtCoordinates(
          fixedCoord,
          variableCoord + i
        );
        shipCells.push(cellInBetween);
      }
    }

    shipCells.forEach((cell) => (cell.heldShip = ship));
    return ship;
  };

  const checkBoatPlacementValidity = (head, tail) => {
    if (
      head[0] < 0 ||
      head[0] > 8 ||
      head[1] < 0 ||
      head[1] > 8 ||
      tail[0] < 0 ||
      tail[0] > 8 ||
      tail[1] < 0 ||
      tail[1] > 8
    )
      return false;
    return true;
  };

  const receiveAttack = (x, y) => {
    if (checkAttackValidity(x, y) === false) {
      console.log('invalid attack');
      return;
    }

    const attackedCell = findCellAtCoordinates(x, y);
    attackedCell.isHit = true;

    if (attackedCell.heldShip !== null) {
      hits.push({ x, y });
      attackedCell.heldShip.getHit();
      checkGameOver();
    } else misses.push({ x, y });
  };

  const checkAttackValidity = (x, y) => {
    if (x < 0 || x > 8 || y < 0 || y > 8) return false;

    const allAttacks = hits.concat(misses);
    for (let attack of allAttacks) {
      if (attack.x === x && attack.y === y) return false;
    }

    return true;
  };

  const checkGameOver = () => {
    const cellNumberHoldingBoats = ships.reduce(
      (total, ship) => (total += ship.length),
      0
    );

    if (hits.length >= cellNumberHoldingBoats) console.log('Game Over');
    else console.log('Game Continues');
  };

  return { placeShip, receiveAttack, returnBoard };
};




/***/ }),

/***/ "./src/js/models/player.js":
/*!*********************************!*\
  !*** ./src/js/models/player.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _game_board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game-board */ "./src/js/models/game-board.js");


const Player = (name) => {
  const playerBoard = (0,_game_board__WEBPACK_IMPORTED_MODULE_0__.GameBoard)();

  return { playerBoard };
};


/***/ }),

/***/ "./src/js/models/ship.js":
/*!*******************************!*\
  !*** ./src/js/models/ship.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ship": () => (/* binding */ Ship)
/* harmony export */ });
const Ship = (length) => {
  let hit = 0;

  function getHit() {
    hit++;
    return this;
  }

  function checkIfSunk() {
    if (hit >= length) return true;
    else return false;
  }

  return { length, getHit, checkIfSunk };
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
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/player */ "./src/js/models/player.js");


const playGame = () => {
  const newGame = () => {
    const firstCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)('Bob Marley');
    const secondCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)('chat-GPT');
  }
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQU87QUFDUDtBQUNBOztBQUVBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMOEI7QUFDRDs7QUFFdEI7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQyxxQkFBcUIsMkNBQUk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sYUFBYSwyQ0FBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxhQUFhLDJDQUFJO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQix5QkFBeUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLGFBQWEsMkNBQUk7QUFDakI7QUFDQTtBQUNBLHNCQUFzQix5QkFBeUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixNQUFNO0FBQ3hCO0FBQ0E7QUFDQSxNQUFNLG1CQUFtQixNQUFNO0FBQy9COztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25KeUM7O0FBRWxDO0FBQ1Asc0JBQXNCLHNEQUFTOztBQUUvQixXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQ05PO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOzs7Ozs7O1VDZEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ053Qzs7QUFFeEM7QUFDQTtBQUNBLHlCQUF5QixzREFBTTtBQUMvQiwwQkFBMEIsc0RBQU07QUFDaEM7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvY2VsbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9nYW1lLWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBDZWxsKHgsIHkpIHtcbiAgbGV0IGhlbGRTaGlwID0gbnVsbDtcbiAgbGV0IGlzSGl0ID0gZmFsc2U7XG5cbiAgcmV0dXJuIHsgeCwgeSwgaGVsZFNoaXAsIGlzSGl0IH07XG59XG4iLCJpbXBvcnQgeyBTaGlwIH0gZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IHsgQ2VsbCB9IGZyb20gXCIuL2NlbGxcIlxuXG5leHBvcnQgY29uc3QgR2FtZUJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHMgPSAxMDtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgbGV0IGhpdHMgPSBbXTtcbiAgbGV0IG1pc3NlcyA9IFtdO1xuICBnZW5lcmF0ZUJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVCb2FyZCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgICAgY29uc3Qgcm93ID0gW107XG4gICAgICBib2FyZC5wdXNoKHJvdyk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKykge1xuICAgICAgICBjb25zdCBjb2wgPSBbQ2VsbChpLCBqKV07XG4gICAgICAgIHJvdy5wdXNoKGNvbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmV0dXJuQm9hcmQgPSAoKSA9PiBib2FyZDtcblxuICBjb25zdCBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMgPSAoeCwgeSkgPT4ge1xuICAgIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgICAgZm9yIChsZXQgYm9hcmRDZWxsIG9mIHJvdykge1xuICAgICAgICBjb25zdCBjZWxsID0gYm9hcmRDZWxsWzBdO1xuICAgICAgICBpZiAoeCA9PT0gY2VsbC54ICYmIHkgPT09IGNlbGwueSkgcmV0dXJuIGNlbGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChoZWFkLCB0YWlsKSA9PiB7XG4gICAgaWYgKCEoaGVhZCBpbnN0YW5jZW9mIEFycmF5KSB8fCAhKHRhaWwgaW5zdGFuY2VvZiBBcnJheSkpXG4gICAgICB0aHJvdyBFcnJvcignaGVhZCBhbmQgdGFpbCBtdXN0IGJlIGFycmF5cyByZXByZXNlbnRpbmcgY29vcmRpbmF0ZXMhJyk7XG5cbiAgICBsZXQgc2hpcDtcbiAgICBjb25zdCBzaGlwQ2VsbHMgPSBbXTtcbiAgICBsZXQgZGlyZWN0aW9uID0gJ2ludmFsaWQnO1xuICAgIGxldCBzaGlwTGVuZ3RoO1xuXG4gICAgaWYgKGhlYWRbMF0gPT09IHRhaWxbMF0gJiYgaGVhZFsxXSA9PT0gdGFpbFsxXSkgZGlyZWN0aW9uID0gJ3NpbmdsZS1jZWxsJztcbiAgICBlbHNlIGlmIChoZWFkWzBdID09PSB0YWlsWzBdKSBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgIGVsc2UgaWYgKGhlYWRbMV0gPT09IHRhaWxbMV0pIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcblxuICAgIGNvbnN0IGhlYWRDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGhlYWRbMF0sIGhlYWRbMV0pO1xuICAgIGNvbnN0IHRhaWxDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHRhaWxbMF0sIHRhaWxbMV0pO1xuICAgIHNoaXBDZWxscy5wdXNoKGhlYWRDZWxsKTtcbiAgICBzaGlwQ2VsbHMucHVzaCh0YWlsQ2VsbCk7XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAnaW52YWxpZCcgfHwgIWNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KGhlYWQsIHRhaWwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdzaW5nbGUtY2VsbCcpIHtcbiAgICAgIHNoaXAgPSBTaGlwKDEpO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIC8vIGNhc2Ugb2Ygc2luZ2xlLWNlbGwgYm9hdCwgcmVtb3ZlIHRoZSBkb3VibGUgY29vcmRpbmF0ZSBmcm9tIGFyclxuICAgICAgc2hpcENlbGxzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc2hpcExlbmd0aCA9IE1hdGguYWJzKGhlYWRbMF0gLSB0YWlsWzBdKSArIDE7XG4gICAgICBzaGlwID0gU2hpcChzaGlwTGVuZ3RoKTtcbiAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgICBjb25zdCBjZWxsTnVtYmVyTm90Rm91bmQgPSBzaGlwTGVuZ3RoIC0gMjtcbiAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgY2VsbHMgbWlzc2luZyB0byBjb21wbGV0ZSB0aGUgYm9hdFxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY2VsbE51bWJlck5vdEZvdW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgZml4ZWRDb29yZCA9IGhlYWRbMV07XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlQ29vcmQgPSBNYXRoLm1heChoZWFkWzBdLCB0YWlsWzBdKTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhcbiAgICAgICAgICB2YXJpYWJsZUNvb3JkIC0gaSxcbiAgICAgICAgICBmaXhlZENvb3JkXG4gICAgICAgICk7XG4gICAgICAgIHNoaXBDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBzaGlwTGVuZ3RoID0gTWF0aC5hYnMoaGVhZFsxXSAtIHRhaWxbMV0pICsgMTtcbiAgICAgIHNoaXAgPSBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIGNvbnN0IGNlbGxOdW1iZXJOb3RGb3VuZCA9IHNoaXBMZW5ndGggLSAyO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY2VsbE51bWJlck5vdEZvdW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgZml4ZWRDb29yZCA9IGhlYWRbMF07XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlQ29vcmQgPSBNYXRoLm1heCh0YWlsWzFdLCB0YWlsWzBdKTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhcbiAgICAgICAgICBmaXhlZENvb3JkLFxuICAgICAgICAgIHZhcmlhYmxlQ29vcmQgKyBpXG4gICAgICAgICk7XG4gICAgICAgIHNoaXBDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiAoY2VsbC5oZWxkU2hpcCA9IHNoaXApKTtcbiAgICByZXR1cm4gc2hpcDtcbiAgfTtcblxuICBjb25zdCBjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eSA9IChoZWFkLCB0YWlsKSA9PiB7XG4gICAgaWYgKFxuICAgICAgaGVhZFswXSA8IDAgfHxcbiAgICAgIGhlYWRbMF0gPiA4IHx8XG4gICAgICBoZWFkWzFdIDwgMCB8fFxuICAgICAgaGVhZFsxXSA+IDggfHxcbiAgICAgIHRhaWxbMF0gPCAwIHx8XG4gICAgICB0YWlsWzBdID4gOCB8fFxuICAgICAgdGFpbFsxXSA8IDAgfHxcbiAgICAgIHRhaWxbMV0gPiA4XG4gICAgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoeCwgeSkgPT4ge1xuICAgIGlmIChjaGVja0F0dGFja1ZhbGlkaXR5KHgsIHkpID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgYXR0YWNrJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXR0YWNrZWRDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHgsIHkpO1xuICAgIGF0dGFja2VkQ2VsbC5pc0hpdCA9IHRydWU7XG5cbiAgICBpZiAoYXR0YWNrZWRDZWxsLmhlbGRTaGlwICE9PSBudWxsKSB7XG4gICAgICBoaXRzLnB1c2goeyB4LCB5IH0pO1xuICAgICAgYXR0YWNrZWRDZWxsLmhlbGRTaGlwLmdldEhpdCgpO1xuICAgICAgY2hlY2tHYW1lT3ZlcigpO1xuICAgIH0gZWxzZSBtaXNzZXMucHVzaCh7IHgsIHkgfSk7XG4gIH07XG5cbiAgY29uc3QgY2hlY2tBdHRhY2tWYWxpZGl0eSA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKHggPCAwIHx8IHggPiA4IHx8IHkgPCAwIHx8IHkgPiA4KSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhbGxBdHRhY2tzID0gaGl0cy5jb25jYXQobWlzc2VzKTtcbiAgICBmb3IgKGxldCBhdHRhY2sgb2YgYWxsQXR0YWNrcykge1xuICAgICAgaWYgKGF0dGFjay54ID09PSB4ICYmIGF0dGFjay55ID09PSB5KSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgY2hlY2tHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjZWxsTnVtYmVySG9sZGluZ0JvYXRzID0gc2hpcHMucmVkdWNlKFxuICAgICAgKHRvdGFsLCBzaGlwKSA9PiAodG90YWwgKz0gc2hpcC5sZW5ndGgpLFxuICAgICAgMFxuICAgICk7XG5cbiAgICBpZiAoaGl0cy5sZW5ndGggPj0gY2VsbE51bWJlckhvbGRpbmdCb2F0cykgY29uc29sZS5sb2coJ0dhbWUgT3ZlcicpO1xuICAgIGVsc2UgY29uc29sZS5sb2coJ0dhbWUgQ29udGludWVzJyk7XG4gIH07XG5cbiAgcmV0dXJuIHsgcGxhY2VTaGlwLCByZWNlaXZlQXR0YWNrLCByZXR1cm5Cb2FyZCB9O1xufTtcblxuXG4iLCJpbXBvcnQgeyBHYW1lQm9hcmQgfSBmcm9tIFwiLi9nYW1lLWJvYXJkXCI7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuXG4gIHJldHVybiB7IHBsYXllckJvYXJkIH07XG59O1xuIiwiZXhwb3J0IGNvbnN0IFNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGxldCBoaXQgPSAwO1xuXG4gIGZ1bmN0aW9uIGdldEhpdCgpIHtcbiAgICBoaXQrKztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSWZTdW5rKCkge1xuICAgIGlmIChoaXQgPj0gbGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7IGxlbmd0aCwgZ2V0SGl0LCBjaGVja0lmU3VuayB9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vbW9kZWxzL3BsYXllclwiXG5cbmNvbnN0IHBsYXlHYW1lID0gKCkgPT4ge1xuICBjb25zdCBuZXdHYW1lID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpcnN0Q2FwdGFpbiA9IFBsYXllcignQm9iIE1hcmxleScpO1xuICAgIGNvbnN0IHNlY29uZENhcHRhaW4gPSBQbGF5ZXIoJ2NoYXQtR1BUJyk7XG4gIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=