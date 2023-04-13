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

  return { placeShip, receiveAttack, returnBoard, findCellAtCoordinates };
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

  return { playerBoard, name };
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
/* harmony import */ var _models_game_board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/game-board */ "./src/js/models/game-board.js");



const playGame = (() => {
  const startForm = document.querySelector('.game-start');

  startForm.addEventListener('submit', startNewGame);
})();

function startNewGame(e) {
  e.preventDefault();
  switchSection('ship-placement');
  transitionBackground();

  const ships = {
    Galleon: 5,
    Frigate: 4,
    Brigantine: 3,
    Schooner: 2,
    Sloop: 1,
  };
  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');
  const shipSpan = document.querySelector('.ship-to-place .ship');
  nameSpan.textContent = nameInput.value;
  shipSpan.textContent = Object.keys(ships)[0];

  const firstCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)(nameInput.value);
  const secondCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)('chat-GPT');
  const boardObject = firstCaptain.playerBoard

  displayGameBoard(firstCaptain);
  placeShipDom(boardObject, ships)
}

function displayGameBoard(player) {
  const board = player.playerBoard.returnBoard();
  const gameBoardDom = document.querySelector('.ship-placement .game-board');

  for (let row of board) {
    for (let cellArr of row) {
      const cell = cellArr[0];
      const cellDom = document.createElement('div');
      cellDom.classList.add('board-cell');
      cellDom.setAttribute('data-x', cell.x);
      cellDom.setAttribute('data-y', cell.y);
      gameBoardDom.appendChild(cellDom);
    }
  }
}

function placeShipDom(boardObject, ships) {
  const cellsDom = document.querySelectorAll('.board-cell');
  let cellX;
  let cellY;

  console.log(cellsDom)
  cellsDom.forEach((cell) => {
    cell.addEventListener('mouseenter', () => {
      cellX = cell.getAttribute('data-x');
      cellY = cell.getAttribute('data-y');
      console.log(cellX, cellY)
    })
  })
}

function switchSection(section) {
  const landingSection = document.querySelector('.landing');
  const shipPlacement = document.querySelector('.ship-placement');

  if (section === 'ship-placement') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: flex';
  }
}

function transitionBackground() {
  const shipPlacement = document.querySelector('.ship-placement');
  shipPlacement.classList.add('background-swap');
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQU87QUFDUDtBQUNBOztBQUVBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMOEI7QUFDRDs7QUFFdEI7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQyxxQkFBcUIsMkNBQUk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sYUFBYSwyQ0FBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxhQUFhLDJDQUFJO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQix5QkFBeUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLGFBQWEsMkNBQUk7QUFDakI7QUFDQTtBQUNBLHNCQUFzQix5QkFBeUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixNQUFNO0FBQ3hCO0FBQ0E7QUFDQSxNQUFNLG1CQUFtQixNQUFNO0FBQy9COztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25KeUM7O0FBRWxDO0FBQ1Asc0JBQXNCLHNEQUFTOztBQUUvQixXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQ05PO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOzs7Ozs7O1VDZEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOeUM7QUFDTzs7QUFFaEQ7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixzREFBTTtBQUM3Qix3QkFBd0Isc0RBQU07QUFDOUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9jZWxsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL2dhbWUtYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIENlbGwoeCwgeSkge1xuICBsZXQgaGVsZFNoaXAgPSBudWxsO1xuICBsZXQgaXNIaXQgPSBmYWxzZTtcblxuICByZXR1cm4geyB4LCB5LCBoZWxkU2hpcCwgaXNIaXQgfTtcbn1cbiIsImltcG9ydCB7IFNoaXAgfSBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQgeyBDZWxsIH0gZnJvbSBcIi4vY2VsbFwiXG5cbmV4cG9ydCBjb25zdCBHYW1lQm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gW107XG4gIGNvbnN0IHJvd3MgPSAxMDtcbiAgY29uc3QgY29scyA9IDEwO1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICBsZXQgaGl0cyA9IFtdO1xuICBsZXQgbWlzc2VzID0gW107XG4gIGdlbmVyYXRlQm9hcmQoKTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJvYXJkKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XG4gICAgICBjb25zdCByb3cgPSBbXTtcbiAgICAgIGJvYXJkLnB1c2gocm93KTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IFtDZWxsKGksIGopXTtcbiAgICAgICAgcm93LnB1c2goY29sKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCByZXR1cm5Cb2FyZCA9ICgpID0+IGJvYXJkO1xuXG4gIGNvbnN0IGZpbmRDZWxsQXRDb29yZGluYXRlcyA9ICh4LCB5KSA9PiB7XG4gICAgZm9yIChsZXQgcm93IG9mIGJvYXJkKSB7XG4gICAgICBmb3IgKGxldCBib2FyZENlbGwgb2Ygcm93KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZENlbGxbMF07XG4gICAgICAgIGlmICh4ID09PSBjZWxsLnggJiYgeSA9PT0gY2VsbC55KSByZXR1cm4gY2VsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGhlYWQsIHRhaWwpID0+IHtcbiAgICBpZiAoIShoZWFkIGluc3RhbmNlb2YgQXJyYXkpIHx8ICEodGFpbCBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgIHRocm93IEVycm9yKCdoZWFkIGFuZCB0YWlsIG11c3QgYmUgYXJyYXlzIHJlcHJlc2VudGluZyBjb29yZGluYXRlcyEnKTtcblxuICAgIGxldCBzaGlwO1xuICAgIGNvbnN0IHNoaXBDZWxscyA9IFtdO1xuICAgIGxldCBkaXJlY3Rpb24gPSAnaW52YWxpZCc7XG4gICAgbGV0IHNoaXBMZW5ndGg7XG5cbiAgICBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSAmJiBoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnc2luZ2xlLWNlbGwnO1xuICAgIGVsc2UgaWYgKGhlYWRbMF0gPT09IHRhaWxbMF0pIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgZWxzZSBpZiAoaGVhZFsxXSA9PT0gdGFpbFsxXSkgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuXG4gICAgY29uc3QgaGVhZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoaGVhZFswXSwgaGVhZFsxXSk7XG4gICAgY29uc3QgdGFpbENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXModGFpbFswXSwgdGFpbFsxXSk7XG4gICAgc2hpcENlbGxzLnB1c2goaGVhZENlbGwpO1xuICAgIHNoaXBDZWxscy5wdXNoKHRhaWxDZWxsKTtcblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdpbnZhbGlkJyB8fCAhY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoaGVhZCwgdGFpbCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3NpbmdsZS1jZWxsJykge1xuICAgICAgc2hpcCA9IFNoaXAoMSk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgLy8gY2FzZSBvZiBzaW5nbGUtY2VsbCBib2F0LCByZW1vdmUgdGhlIGRvdWJsZSBjb29yZGluYXRlIGZyb20gYXJyXG4gICAgICBzaGlwQ2VsbHMuc2hpZnQoKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBzaGlwTGVuZ3RoID0gTWF0aC5hYnMoaGVhZFswXSAtIHRhaWxbMF0pICsgMTtcbiAgICAgIHNoaXAgPSBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIGNvbnN0IGNlbGxOdW1iZXJOb3RGb3VuZCA9IHNoaXBMZW5ndGggLSAyO1xuICAgICAgLy8gY2FsY3VsYXRlIHRoZSBjZWxscyBtaXNzaW5nIHRvIGNvbXBsZXRlIHRoZSBib2F0XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFsxXTtcbiAgICAgICAgY29uc3QgdmFyaWFibGVDb29yZCA9IE1hdGgubWF4KGhlYWRbMF0sIHRhaWxbMF0pO1xuICAgICAgICBjb25zdCBjZWxsSW5CZXR3ZWVuID0gZmluZENlbGxBdENvb3JkaW5hdGVzKFxuICAgICAgICAgIHZhcmlhYmxlQ29vcmQgLSBpLFxuICAgICAgICAgIGZpeGVkQ29vcmRcbiAgICAgICAgKTtcbiAgICAgICAgc2hpcENlbGxzLnB1c2goY2VsbEluQmV0d2Vlbik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHNoaXBMZW5ndGggPSBNYXRoLmFicyhoZWFkWzFdIC0gdGFpbFsxXSkgKyAxO1xuICAgICAgc2hpcCA9IFNoaXAoc2hpcExlbmd0aCk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgY29uc3QgY2VsbE51bWJlck5vdEZvdW5kID0gc2hpcExlbmd0aCAtIDI7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgdmFyaWFibGVDb29yZCA9IE1hdGgubWF4KHRhaWxbMV0sIHRhaWxbMF0pO1xuICAgICAgICBjb25zdCBjZWxsSW5CZXR3ZWVuID0gZmluZENlbGxBdENvb3JkaW5hdGVzKFxuICAgICAgICAgIGZpeGVkQ29vcmQsXG4gICAgICAgICAgdmFyaWFibGVDb29yZCArIGlcbiAgICAgICAgKTtcbiAgICAgICAgc2hpcENlbGxzLnB1c2goY2VsbEluQmV0d2Vlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hpcENlbGxzLmZvckVhY2goKGNlbGwpID0+IChjZWxsLmhlbGRTaGlwID0gc2hpcCkpO1xuICAgIHJldHVybiBzaGlwO1xuICB9O1xuXG4gIGNvbnN0IGNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5ID0gKGhlYWQsIHRhaWwpID0+IHtcbiAgICBpZiAoXG4gICAgICBoZWFkWzBdIDwgMCB8fFxuICAgICAgaGVhZFswXSA+IDggfHxcbiAgICAgIGhlYWRbMV0gPCAwIHx8XG4gICAgICBoZWFkWzFdID4gOCB8fFxuICAgICAgdGFpbFswXSA8IDAgfHxcbiAgICAgIHRhaWxbMF0gPiA4IHx8XG4gICAgICB0YWlsWzFdIDwgMCB8fFxuICAgICAgdGFpbFsxXSA+IDhcbiAgICApXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKGNoZWNrQXR0YWNrVmFsaWRpdHkoeCwgeSkgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBhdHRhY2snKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2tlZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoeCwgeSk7XG4gICAgYXR0YWNrZWRDZWxsLmlzSGl0ID0gdHJ1ZTtcblxuICAgIGlmIChhdHRhY2tlZENlbGwuaGVsZFNoaXAgIT09IG51bGwpIHtcbiAgICAgIGhpdHMucHVzaCh7IHgsIHkgfSk7XG4gICAgICBhdHRhY2tlZENlbGwuaGVsZFNoaXAuZ2V0SGl0KCk7XG4gICAgICBjaGVja0dhbWVPdmVyKCk7XG4gICAgfSBlbHNlIG1pc3Nlcy5wdXNoKHsgeCwgeSB9KTtcbiAgfTtcblxuICBjb25zdCBjaGVja0F0dGFja1ZhbGlkaXR5ID0gKHgsIHkpID0+IHtcbiAgICBpZiAoeCA8IDAgfHwgeCA+IDggfHwgeSA8IDAgfHwgeSA+IDgpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGFsbEF0dGFja3MgPSBoaXRzLmNvbmNhdChtaXNzZXMpO1xuICAgIGZvciAobGV0IGF0dGFjayBvZiBhbGxBdHRhY2tzKSB7XG4gICAgICBpZiAoYXR0YWNrLnggPT09IHggJiYgYXR0YWNrLnkgPT09IHkpIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBjaGVja0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNlbGxOdW1iZXJIb2xkaW5nQm9hdHMgPSBzaGlwcy5yZWR1Y2UoXG4gICAgICAodG90YWwsIHNoaXApID0+ICh0b3RhbCArPSBzaGlwLmxlbmd0aCksXG4gICAgICAwXG4gICAgKTtcblxuICAgIGlmIChoaXRzLmxlbmd0aCA+PSBjZWxsTnVtYmVySG9sZGluZ0JvYXRzKSBjb25zb2xlLmxvZygnR2FtZSBPdmVyJyk7XG4gICAgZWxzZSBjb25zb2xlLmxvZygnR2FtZSBDb250aW51ZXMnKTtcbiAgfTtcblxuICByZXR1cm4geyBwbGFjZVNoaXAsIHJlY2VpdmVBdHRhY2ssIHJldHVybkJvYXJkLCBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMgfTtcbn07XG5cblxuIiwiaW1wb3J0IHsgR2FtZUJvYXJkIH0gZnJvbSBcIi4vZ2FtZS1ib2FyZFwiO1xuXG5leHBvcnQgY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcblxuICByZXR1cm4geyBwbGF5ZXJCb2FyZCwgbmFtZSB9O1xufTtcbiIsImV4cG9ydCBjb25zdCBTaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgaGl0ID0gMDtcblxuICBmdW5jdGlvbiBnZXRIaXQoKSB7XG4gICAgaGl0Kys7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0lmU3VuaygpIHtcbiAgICBpZiAoaGl0ID49IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geyBsZW5ndGgsIGdldEhpdCwgY2hlY2tJZlN1bmsgfTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vbW9kZWxzL3BsYXllcic7XG5pbXBvcnQgeyBHYW1lQm9hcmQgfSBmcm9tICcuL21vZGVscy9nYW1lLWJvYXJkJztcblxuY29uc3QgcGxheUdhbWUgPSAoKCkgPT4ge1xuICBjb25zdCBzdGFydEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1zdGFydCcpO1xuXG4gIHN0YXJ0Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBzdGFydE5ld0dhbWUpO1xufSkoKTtcblxuZnVuY3Rpb24gc3RhcnROZXdHYW1lKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzd2l0Y2hTZWN0aW9uKCdzaGlwLXBsYWNlbWVudCcpO1xuICB0cmFuc2l0aW9uQmFja2dyb3VuZCgpO1xuXG4gIGNvbnN0IHNoaXBzID0ge1xuICAgIEdhbGxlb246IDUsXG4gICAgRnJpZ2F0ZTogNCxcbiAgICBCcmlnYW50aW5lOiAzLFxuICAgIFNjaG9vbmVyOiAyLFxuICAgIFNsb29wOiAxLFxuICB9O1xuICBjb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1zdGFydCBpbnB1dCcpO1xuICBjb25zdCBuYW1lU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRvLXBsYWNlIC5wbGF5ZXItbmFtZScpO1xuICBjb25zdCBzaGlwU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRvLXBsYWNlIC5zaGlwJyk7XG4gIG5hbWVTcGFuLnRleHRDb250ZW50ID0gbmFtZUlucHV0LnZhbHVlO1xuICBzaGlwU3Bhbi50ZXh0Q29udGVudCA9IE9iamVjdC5rZXlzKHNoaXBzKVswXTtcblxuICBjb25zdCBmaXJzdENhcHRhaW4gPSBQbGF5ZXIobmFtZUlucHV0LnZhbHVlKTtcbiAgY29uc3Qgc2Vjb25kQ2FwdGFpbiA9IFBsYXllcignY2hhdC1HUFQnKTtcbiAgY29uc3QgYm9hcmRPYmplY3QgPSBmaXJzdENhcHRhaW4ucGxheWVyQm9hcmRcblxuICBkaXNwbGF5R2FtZUJvYXJkKGZpcnN0Q2FwdGFpbik7XG4gIHBsYWNlU2hpcERvbShib2FyZE9iamVjdCwgc2hpcHMpXG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlHYW1lQm9hcmQocGxheWVyKSB7XG4gIGNvbnN0IGJvYXJkID0gcGxheWVyLnBsYXllckJvYXJkLnJldHVybkJvYXJkKCk7XG4gIGNvbnN0IGdhbWVCb2FyZERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCAuZ2FtZS1ib2FyZCcpO1xuXG4gIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgIGZvciAobGV0IGNlbGxBcnIgb2Ygcm93KSB7XG4gICAgICBjb25zdCBjZWxsID0gY2VsbEFyclswXTtcbiAgICAgIGNvbnN0IGNlbGxEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNlbGxEb20uY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIGNlbGwueCk7XG4gICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgY2VsbC55KTtcbiAgICAgIGdhbWVCb2FyZERvbS5hcHBlbmRDaGlsZChjZWxsRG9tKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcGxhY2VTaGlwRG9tKGJvYXJkT2JqZWN0LCBzaGlwcykge1xuICBjb25zdCBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gIGxldCBjZWxsWDtcbiAgbGV0IGNlbGxZO1xuXG4gIGNvbnNvbGUubG9nKGNlbGxzRG9tKVxuICBjZWxsc0RvbS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgY2VsbFggPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS14Jyk7XG4gICAgICBjZWxsWSA9IGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXknKTtcbiAgICAgIGNvbnNvbGUubG9nKGNlbGxYLCBjZWxsWSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hTZWN0aW9uKHNlY3Rpb24pIHtcbiAgY29uc3QgbGFuZGluZ1NlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGFuZGluZycpO1xuICBjb25zdCBzaGlwUGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50Jyk7XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdzaGlwLXBsYWNlbWVudCcpIHtcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIHNoaXBQbGFjZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4JztcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uQmFja2dyb3VuZCgpIHtcbiAgY29uc3Qgc2hpcFBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCcpO1xuICBzaGlwUGxhY2VtZW50LmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQtc3dhcCcpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9