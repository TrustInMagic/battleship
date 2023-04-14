/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/dom/dom-methods.js":
/*!***********************************!*\
  !*** ./src/js/dom/dom-methods.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attemptShipPlacementDom": () => (/* binding */ attemptShipPlacementDom),
/* harmony export */   "displayGameBoard": () => (/* binding */ displayGameBoard),
/* harmony export */   "switchSection": () => (/* binding */ switchSection),
/* harmony export */   "transitionBackground": () => (/* binding */ transitionBackground)
/* harmony export */ });
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

function clearDomCellInvalidity(cell) {
  cell.addEventListener('mouseleave', () => {
    cell.classList.remove('invalid-location');
  });
}

function clearDomCellsCustomColor(cells) {
  cells.forEach((cell) => cell.classList.remove('place-ship'));
}

function findDomCellAtCoordinates(x, y) {
  const cellsDom = document.querySelectorAll('.board-cell');
  let searchedCell;

  cellsDom.forEach((cell) => {
    const cellX = cell.getAttribute('data-x');
    const cellY = cell.getAttribute('data-y');
    if (Number(cellX) === x && Number(cellY) === y) searchedCell = cell;
  });

  return searchedCell;
}

function getShipName(shipType) {
  const ships = {
    Galleon: 5,
    Frigate: 4,
    Brigantine: 3,
    Schooner: 2,
    Sloop: 1,
  };
  let ship;
  let length;

  switch (shipType) {
    case 'Galleon':
      ship = Object.keys(ships)[0];
      length = ships[ship];
      break;
    case 'Frigate':
      ship = Object.keys(ships)[1];
      length = ships[ship];
      break;
    case 'Brigantine':
      ship = Object.keys(ships)[2];
      length = ships[ship];
      break;
    case 'Schooner':
      ship = Object.keys(ships)[3];
      length = ships[ship];
      break;
    case 'Sloop':
      ship = Object.keys(ships)[4];
      length = ships[ship];
      break;
  }
  return { ship, length };
}
function attemptShipPlacementDom(shipType, axis, cell, board) {
  const shipData = getShipName(shipType);
  const shipSpan = document.querySelector('.ship-to-place .ship');
  shipSpan.textContent = shipData.ship;
  const length = shipData.length;

  const shipHead = [cell.x, cell.y];
  let shipTailX;
  let shipTailY;
  let direction;

  if (axis === 'horizontal') {
    shipTailX = shipHead[0] + length - 1;
    shipTailY = shipHead[1];
    direction = 'horizontal';
  } else if (axis === 'vertical') {
    shipTailX = shipHead[0];
    shipTailY = shipHead[1] + length - 1;
    direction = 'vertical';
  }

  const shipTail = [shipTailX, shipTailY];
  const restShipCells = [];
  const shipHeadDom = [findDomCellAtCoordinates(...shipHead)];
  const shipTailDom = [findDomCellAtCoordinates(...shipTail)];
  const restShipDom = [];

  if (!board.checkBoatPlacementValidity(shipHead, shipTail)) {
    shipHeadDom[0].classList.add('invalid-location');
    clearDomCellInvalidity(shipHeadDom[0]);
  } else {
    const missingCells = board.findMissingBoatCells(
      shipHead,
      shipTail,
      length,
      direction
    );
    restShipCells.push(...missingCells);

    restShipCells.forEach((cell) => {
      if (cell === undefined) return;
      restShipDom.push(findDomCellAtCoordinates(cell.x, cell.y));
    });

    const allDomShipCells = shipHeadDom.concat(shipTailDom).concat(restShipDom);
    allDomShipCells.forEach((cell) => {
      cell.classList.add('place-ship');
      cell.addEventListener('mouseleave', () =>
        clearDomCellsCustomColor(allDomShipCells)
      );
    });
  }
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


/***/ }),

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
    for (let i = rows; i > 0; i--) {
      const row = [];
      board.push(row);
      for (let j = 1; j <= cols; j++) {
        const col = [(0,_cell__WEBPACK_IMPORTED_MODULE_1__.Cell)(j, i)];
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
      const restOfCells = findMissingBoatCells(
        head,
        tail,
        shipLength,
        'horizontal'
      );
      shipCells.push(...restOfCells);
    } else if (direction === 'vertical') {
      shipLength = Math.abs(head[1] - tail[1]) + 1;
      ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipLength);
      ships.push(ship);
      const restOfCells = findMissingBoatCells(
        head,
        tail,
        shipLength,
        'vertical'
      );
      shipCells.push(...restOfCells)
    }

    shipCells.forEach((cell) => (cell.heldShip = ship));
    return shipCells;
  };

  function findMissingBoatCells(head, tail, length, direction) {
    const cellNumberNotFound = length - 2;
    const restOfCells = [];
    if (direction === 'horizontal') {
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[1];
        const variableCoord = head[0];
        const cellInBetween = findCellAtCoordinates(
          variableCoord + i,
          fixedCoord,
        );
        restOfCells.push(cellInBetween);
      }
    } else if (direction === 'vertical') {
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[0];
        const variableCoord = head[1];
        const cellInBetween = findCellAtCoordinates(
          fixedCoord,
          variableCoord + i
        );
        restOfCells.push(cellInBetween);
      }
    }
    return restOfCells;
  }

  const checkBoatPlacementValidity = (head, tail) => {
    if (
      head[0] < 1 ||
      head[0] > 10 ||
      head[1] < 1 ||
      head[1] > 10 ||
      tail[0] < 1 ||
      tail[0] > 10 ||
      tail[1] < 1 ||
      tail[1] > 10
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
    if (x < 1 || x > 10 || y < 1 || y > 10) return false;

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

  return {
    placeShip,
    receiveAttack,
    returnBoard,
    findCellAtCoordinates,
    checkBoatPlacementValidity,
    findMissingBoatCells
  };
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
/* harmony import */ var _dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom/dom-methods */ "./src/js/dom/dom-methods.js");



const playGame = (() => {
  const startForm = document.querySelector('.game-start');

  startForm.addEventListener('submit', runShipPlacement);
})();

function runShipPlacement(e) {
  e.preventDefault();
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.switchSection)('ship-placement');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)();

  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');
  const axisButton = document.querySelector('.ship-placement button');
  const axisDom = document.querySelector('.ship-placement .axis');

  nameSpan.textContent = nameInput.value;

  const firstCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)(nameInput.value);
  const secondCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)('chat-GPT');
  const boardObject = firstCaptain.playerBoard;
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(firstCaptain);

  let axis = 'horizontal';

  axisButton.addEventListener('click', () => {
    if (axis === 'horizontal') {
      axisDom.textContent = 'Vertical';
      axis = 'vertical';
    } else {
      axisDom.textContent = 'Horizontal';
      axis = 'horizontal';
    }
  });

  const cellsDom = document.querySelectorAll('.board-cell');
  let cellX;
  let cellY;

  cellsDom.forEach((cell) => {
    cell.addEventListener('mouseenter', () => {
      cellX = cell.getAttribute('data-x');
      cellY = cell.getAttribute('data-y');
      const targetCell = boardObject.findCellAtCoordinates(
        Number(cellX),
        Number(cellY)
      );
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.attemptShipPlacementDom)('Frigate', axis, targetCell, boardObject);
    });
  });
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RS9CLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7O0FDTk87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7VUNkQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ055QztBQU1kOztBQUUzQjtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsRUFBRSwrREFBYTtBQUNmLEVBQUUsc0VBQW9COztBQUV0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx1QkFBdUIsc0RBQU07QUFDN0Isd0JBQXdCLHNEQUFNO0FBQzlCO0FBQ0EsRUFBRSxrRUFBZ0I7O0FBRWxCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLHlFQUF1QjtBQUM3QixLQUFLO0FBQ0wsR0FBRztBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9kb20vZG9tLW1ldGhvZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvY2VsbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9nYW1lLWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5R2FtZUJvYXJkKHBsYXllcikge1xuICBjb25zdCBib2FyZCA9IHBsYXllci5wbGF5ZXJCb2FyZC5yZXR1cm5Cb2FyZCgpO1xuICBjb25zdCBnYW1lQm9hcmREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC1wbGFjZW1lbnQgLmdhbWUtYm9hcmQnKTtcblxuICBmb3IgKGxldCByb3cgb2YgYm9hcmQpIHtcbiAgICBmb3IgKGxldCBjZWxsQXJyIG9mIHJvdykge1xuICAgICAgY29uc3QgY2VsbCA9IGNlbGxBcnJbMF07XG4gICAgICBjb25zdCBjZWxsRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjZWxsRG9tLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLWNlbGwnKTtcbiAgICAgIGNlbGxEb20uc2V0QXR0cmlidXRlKCdkYXRhLXgnLCBjZWxsLngpO1xuICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIGNlbGwueSk7XG4gICAgICBnYW1lQm9hcmREb20uYXBwZW5kQ2hpbGQoY2VsbERvbSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tQ2VsbEludmFsaWRpdHkoY2VsbCkge1xuICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkLWxvY2F0aW9uJyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhckRvbUNlbGxzQ3VzdG9tQ29sb3IoY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdwbGFjZS1zaGlwJykpO1xufVxuXG5mdW5jdGlvbiBmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoeCwgeSkge1xuICBjb25zdCBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gIGxldCBzZWFyY2hlZENlbGw7XG5cbiAgY2VsbHNEb20uZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNvbnN0IGNlbGxYID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgIGNvbnN0IGNlbGxZID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgIGlmIChOdW1iZXIoY2VsbFgpID09PSB4ICYmIE51bWJlcihjZWxsWSkgPT09IHkpIHNlYXJjaGVkQ2VsbCA9IGNlbGw7XG4gIH0pO1xuXG4gIHJldHVybiBzZWFyY2hlZENlbGw7XG59XG5cbmZ1bmN0aW9uIGdldFNoaXBOYW1lKHNoaXBUeXBlKSB7XG4gIGNvbnN0IHNoaXBzID0ge1xuICAgIEdhbGxlb246IDUsXG4gICAgRnJpZ2F0ZTogNCxcbiAgICBCcmlnYW50aW5lOiAzLFxuICAgIFNjaG9vbmVyOiAyLFxuICAgIFNsb29wOiAxLFxuICB9O1xuICBsZXQgc2hpcDtcbiAgbGV0IGxlbmd0aDtcblxuICBzd2l0Y2ggKHNoaXBUeXBlKSB7XG4gICAgY2FzZSAnR2FsbGVvbic6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzBdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdGcmlnYXRlJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbMV07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0JyaWdhbnRpbmUnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVsyXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnU2Nob29uZXInOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVszXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnU2xvb3AnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVs0XTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHsgc2hpcCwgbGVuZ3RoIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oc2hpcFR5cGUsIGF4aXMsIGNlbGwsIGJvYXJkKSB7XG4gIGNvbnN0IHNoaXBEYXRhID0gZ2V0U2hpcE5hbWUoc2hpcFR5cGUpO1xuICBjb25zdCBzaGlwU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRvLXBsYWNlIC5zaGlwJyk7XG4gIHNoaXBTcGFuLnRleHRDb250ZW50ID0gc2hpcERhdGEuc2hpcDtcbiAgY29uc3QgbGVuZ3RoID0gc2hpcERhdGEubGVuZ3RoO1xuXG4gIGNvbnN0IHNoaXBIZWFkID0gW2NlbGwueCwgY2VsbC55XTtcbiAgbGV0IHNoaXBUYWlsWDtcbiAgbGV0IHNoaXBUYWlsWTtcbiAgbGV0IGRpcmVjdGlvbjtcblxuICBpZiAoYXhpcyA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgc2hpcFRhaWxYID0gc2hpcEhlYWRbMF0gKyBsZW5ndGggLSAxO1xuICAgIHNoaXBUYWlsWSA9IHNoaXBIZWFkWzFdO1xuICAgIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgfSBlbHNlIGlmIChheGlzID09PSAndmVydGljYWwnKSB7XG4gICAgc2hpcFRhaWxYID0gc2hpcEhlYWRbMF07XG4gICAgc2hpcFRhaWxZID0gc2hpcEhlYWRbMV0gKyBsZW5ndGggLSAxO1xuICAgIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gIH1cblxuICBjb25zdCBzaGlwVGFpbCA9IFtzaGlwVGFpbFgsIHNoaXBUYWlsWV07XG4gIGNvbnN0IHJlc3RTaGlwQ2VsbHMgPSBbXTtcbiAgY29uc3Qgc2hpcEhlYWREb20gPSBbZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKC4uLnNoaXBIZWFkKV07XG4gIGNvbnN0IHNoaXBUYWlsRG9tID0gW2ZpbmREb21DZWxsQXRDb29yZGluYXRlcyguLi5zaGlwVGFpbCldO1xuICBjb25zdCByZXN0U2hpcERvbSA9IFtdO1xuXG4gIGlmICghYm9hcmQuY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoc2hpcEhlYWQsIHNoaXBUYWlsKSkge1xuICAgIHNoaXBIZWFkRG9tWzBdLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQtbG9jYXRpb24nKTtcbiAgICBjbGVhckRvbUNlbGxJbnZhbGlkaXR5KHNoaXBIZWFkRG9tWzBdKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBtaXNzaW5nQ2VsbHMgPSBib2FyZC5maW5kTWlzc2luZ0JvYXRDZWxscyhcbiAgICAgIHNoaXBIZWFkLFxuICAgICAgc2hpcFRhaWwsXG4gICAgICBsZW5ndGgsXG4gICAgICBkaXJlY3Rpb25cbiAgICApO1xuICAgIHJlc3RTaGlwQ2VsbHMucHVzaCguLi5taXNzaW5nQ2VsbHMpO1xuXG4gICAgcmVzdFNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBpZiAoY2VsbCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICByZXN0U2hpcERvbS5wdXNoKGZpbmREb21DZWxsQXRDb29yZGluYXRlcyhjZWxsLngsIGNlbGwueSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWxsRG9tU2hpcENlbGxzID0gc2hpcEhlYWREb20uY29uY2F0KHNoaXBUYWlsRG9tKS5jb25jYXQocmVzdFNoaXBEb20pO1xuICAgIGFsbERvbVNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ3BsYWNlLXNoaXAnKTtcbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+XG4gICAgICAgIGNsZWFyRG9tQ2VsbHNDdXN0b21Db2xvcihhbGxEb21TaGlwQ2VsbHMpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hTZWN0aW9uKHNlY3Rpb24pIHtcbiAgY29uc3QgbGFuZGluZ1NlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGFuZGluZycpO1xuICBjb25zdCBzaGlwUGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50Jyk7XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdzaGlwLXBsYWNlbWVudCcpIHtcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIHNoaXBQbGFjZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4JztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNpdGlvbkJhY2tncm91bmQoKSB7XG4gIGNvbnN0IHNoaXBQbGFjZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC1wbGFjZW1lbnQnKTtcbiAgc2hpcFBsYWNlbWVudC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kLXN3YXAnKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBDZWxsKHgsIHkpIHtcbiAgbGV0IGhlbGRTaGlwID0gbnVsbDtcbiAgbGV0IGlzSGl0ID0gZmFsc2U7XG5cbiAgcmV0dXJuIHsgeCwgeSwgaGVsZFNoaXAsIGlzSGl0IH07XG59XG4iLCJpbXBvcnQgeyBTaGlwIH0gZnJvbSAnLi9zaGlwJztcbmltcG9ydCB7IENlbGwgfSBmcm9tICcuL2NlbGwnO1xuXG5leHBvcnQgY29uc3QgR2FtZUJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHMgPSAxMDtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgbGV0IGhpdHMgPSBbXTtcbiAgbGV0IG1pc3NlcyA9IFtdO1xuICBnZW5lcmF0ZUJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVCb2FyZCgpIHtcbiAgICBmb3IgKGxldCBpID0gcm93czsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3Qgcm93ID0gW107XG4gICAgICBib2FyZC5wdXNoKHJvdyk7XG4gICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBjb2xzOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sID0gW0NlbGwoaiwgaSldO1xuICAgICAgICByb3cucHVzaChjb2wpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJldHVybkJvYXJkID0gKCkgPT4gYm9hcmQ7XG5cbiAgY29uc3QgZmluZENlbGxBdENvb3JkaW5hdGVzID0gKHgsIHkpID0+IHtcbiAgICBmb3IgKGxldCByb3cgb2YgYm9hcmQpIHtcbiAgICAgIGZvciAobGV0IGJvYXJkQ2VsbCBvZiByb3cpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGJvYXJkQ2VsbFswXTtcbiAgICAgICAgaWYgKHggPT09IGNlbGwueCAmJiB5ID09PSBjZWxsLnkpIHJldHVybiBjZWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAoaGVhZCwgdGFpbCkgPT4ge1xuICAgIGlmICghKGhlYWQgaW5zdGFuY2VvZiBBcnJheSkgfHwgISh0YWlsIGluc3RhbmNlb2YgQXJyYXkpKVxuICAgICAgdGhyb3cgRXJyb3IoJ2hlYWQgYW5kIHRhaWwgbXVzdCBiZSBhcnJheXMgcmVwcmVzZW50aW5nIGNvb3JkaW5hdGVzIScpO1xuXG4gICAgbGV0IHNoaXA7XG4gICAgY29uc3Qgc2hpcENlbGxzID0gW107XG4gICAgbGV0IGRpcmVjdGlvbiA9ICdpbnZhbGlkJztcbiAgICBsZXQgc2hpcExlbmd0aDtcblxuICAgIGlmIChoZWFkWzBdID09PSB0YWlsWzBdICYmIGhlYWRbMV0gPT09IHRhaWxbMV0pIGRpcmVjdGlvbiA9ICdzaW5nbGUtY2VsbCc7XG4gICAgZWxzZSBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSkgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICBlbHNlIGlmIChoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBjb25zdCBoZWFkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhoZWFkWzBdLCBoZWFkWzFdKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh0YWlsWzBdLCB0YWlsWzFdKTtcbiAgICBzaGlwQ2VsbHMucHVzaChoZWFkQ2VsbCk7XG4gICAgc2hpcENlbGxzLnB1c2godGFpbENlbGwpO1xuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2ludmFsaWQnIHx8ICFjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eShoZWFkLCB0YWlsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnc2luZ2xlLWNlbGwnKSB7XG4gICAgICBzaGlwID0gU2hpcCgxKTtcbiAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgICAvLyBjYXNlIG9mIHNpbmdsZS1jZWxsIGJvYXQsIHJlbW92ZSB0aGUgZG91YmxlIGNvb3JkaW5hdGUgZnJvbSBhcnJcbiAgICAgIHNoaXBDZWxscy5zaGlmdCgpO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHNoaXBMZW5ndGggPSBNYXRoLmFicyhoZWFkWzBdIC0gdGFpbFswXSkgKyAxO1xuICAgICAgc2hpcCA9IFNoaXAoc2hpcExlbmd0aCk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgY29uc3QgcmVzdE9mQ2VsbHMgPSBmaW5kTWlzc2luZ0JvYXRDZWxscyhcbiAgICAgICAgaGVhZCxcbiAgICAgICAgdGFpbCxcbiAgICAgICAgc2hpcExlbmd0aCxcbiAgICAgICAgJ2hvcml6b250YWwnXG4gICAgICApO1xuICAgICAgc2hpcENlbGxzLnB1c2goLi4ucmVzdE9mQ2VsbHMpO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBzaGlwTGVuZ3RoID0gTWF0aC5hYnMoaGVhZFsxXSAtIHRhaWxbMV0pICsgMTtcbiAgICAgIHNoaXAgPSBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIGNvbnN0IHJlc3RPZkNlbGxzID0gZmluZE1pc3NpbmdCb2F0Q2VsbHMoXG4gICAgICAgIGhlYWQsXG4gICAgICAgIHRhaWwsXG4gICAgICAgIHNoaXBMZW5ndGgsXG4gICAgICAgICd2ZXJ0aWNhbCdcbiAgICAgICk7XG4gICAgICBzaGlwQ2VsbHMucHVzaCguLi5yZXN0T2ZDZWxscylcbiAgICB9XG5cbiAgICBzaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gKGNlbGwuaGVsZFNoaXAgPSBzaGlwKSk7XG4gICAgcmV0dXJuIHNoaXBDZWxscztcbiAgfTtcblxuICBmdW5jdGlvbiBmaW5kTWlzc2luZ0JvYXRDZWxscyhoZWFkLCB0YWlsLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGNvbnN0IGNlbGxOdW1iZXJOb3RGb3VuZCA9IGxlbmd0aCAtIDI7XG4gICAgY29uc3QgcmVzdE9mQ2VsbHMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGNlbGxOdW1iZXJOb3RGb3VuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpeGVkQ29vcmQgPSBoZWFkWzFdO1xuICAgICAgICBjb25zdCB2YXJpYWJsZUNvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhcbiAgICAgICAgICB2YXJpYWJsZUNvb3JkICsgaSxcbiAgICAgICAgICBmaXhlZENvb3JkLFxuICAgICAgICApO1xuICAgICAgICByZXN0T2ZDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgdmFyaWFibGVDb29yZCA9IGhlYWRbMV07XG4gICAgICAgIGNvbnN0IGNlbGxJbkJldHdlZW4gPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoXG4gICAgICAgICAgZml4ZWRDb29yZCxcbiAgICAgICAgICB2YXJpYWJsZUNvb3JkICsgaVxuICAgICAgICApO1xuICAgICAgICByZXN0T2ZDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdE9mQ2VsbHM7XG4gIH1cblxuICBjb25zdCBjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eSA9IChoZWFkLCB0YWlsKSA9PiB7XG4gICAgaWYgKFxuICAgICAgaGVhZFswXSA8IDEgfHxcbiAgICAgIGhlYWRbMF0gPiAxMCB8fFxuICAgICAgaGVhZFsxXSA8IDEgfHxcbiAgICAgIGhlYWRbMV0gPiAxMCB8fFxuICAgICAgdGFpbFswXSA8IDEgfHxcbiAgICAgIHRhaWxbMF0gPiAxMCB8fFxuICAgICAgdGFpbFsxXSA8IDEgfHxcbiAgICAgIHRhaWxbMV0gPiAxMFxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHgsIHkpID0+IHtcbiAgICBpZiAoY2hlY2tBdHRhY2tWYWxpZGl0eSh4LCB5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGF0dGFjaycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh4LCB5KTtcbiAgICBhdHRhY2tlZENlbGwuaXNIaXQgPSB0cnVlO1xuXG4gICAgaWYgKGF0dGFja2VkQ2VsbC5oZWxkU2hpcCAhPT0gbnVsbCkge1xuICAgICAgaGl0cy5wdXNoKHsgeCwgeSB9KTtcbiAgICAgIGF0dGFja2VkQ2VsbC5oZWxkU2hpcC5nZXRIaXQoKTtcbiAgICAgIGNoZWNrR2FtZU92ZXIoKTtcbiAgICB9IGVsc2UgbWlzc2VzLnB1c2goeyB4LCB5IH0pO1xuICB9O1xuXG4gIGNvbnN0IGNoZWNrQXR0YWNrVmFsaWRpdHkgPSAoeCwgeSkgPT4ge1xuICAgIGlmICh4IDwgMSB8fCB4ID4gMTAgfHwgeSA8IDEgfHwgeSA+IDEwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhbGxBdHRhY2tzID0gaGl0cy5jb25jYXQobWlzc2VzKTtcbiAgICBmb3IgKGxldCBhdHRhY2sgb2YgYWxsQXR0YWNrcykge1xuICAgICAgaWYgKGF0dGFjay54ID09PSB4ICYmIGF0dGFjay55ID09PSB5KSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgY2hlY2tHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjZWxsTnVtYmVySG9sZGluZ0JvYXRzID0gc2hpcHMucmVkdWNlKFxuICAgICAgKHRvdGFsLCBzaGlwKSA9PiAodG90YWwgKz0gc2hpcC5sZW5ndGgpLFxuICAgICAgMFxuICAgICk7XG5cbiAgICBpZiAoaGl0cy5sZW5ndGggPj0gY2VsbE51bWJlckhvbGRpbmdCb2F0cykgY29uc29sZS5sb2coJ0dhbWUgT3ZlcicpO1xuICAgIGVsc2UgY29uc29sZS5sb2coJ0dhbWUgQ29udGludWVzJyk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICByZXR1cm5Cb2FyZCxcbiAgICBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMsXG4gICAgY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHksXG4gICAgZmluZE1pc3NpbmdCb2F0Q2VsbHNcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBHYW1lQm9hcmQgfSBmcm9tIFwiLi9nYW1lLWJvYXJkXCI7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuXG4gIHJldHVybiB7IHBsYXllckJvYXJkLCBuYW1lIH07XG59O1xuIiwiZXhwb3J0IGNvbnN0IFNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGxldCBoaXQgPSAwO1xuXG4gIGZ1bmN0aW9uIGdldEhpdCgpIHtcbiAgICBoaXQrKztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSWZTdW5rKCkge1xuICAgIGlmIChoaXQgPj0gbGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7IGxlbmd0aCwgZ2V0SGl0LCBjaGVja0lmU3VuayB9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9tb2RlbHMvcGxheWVyJztcbmltcG9ydCB7XG4gIGRpc3BsYXlHYW1lQm9hcmQsXG4gIHN3aXRjaFNlY3Rpb24sXG4gIHRyYW5zaXRpb25CYWNrZ3JvdW5kLFxuICBhdHRlbXB0U2hpcFBsYWNlbWVudERvbSxcbn0gZnJvbSAnLi9kb20vZG9tLW1ldGhvZHMnO1xuXG5jb25zdCBwbGF5R2FtZSA9ICgoKSA9PiB7XG4gIGNvbnN0IHN0YXJ0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXN0YXJ0Jyk7XG5cbiAgc3RhcnRGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHJ1blNoaXBQbGFjZW1lbnQpO1xufSkoKTtcblxuZnVuY3Rpb24gcnVuU2hpcFBsYWNlbWVudChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgc3dpdGNoU2VjdGlvbignc2hpcC1wbGFjZW1lbnQnKTtcbiAgdHJhbnNpdGlvbkJhY2tncm91bmQoKTtcblxuICBjb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1zdGFydCBpbnB1dCcpO1xuICBjb25zdCBuYW1lU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRvLXBsYWNlIC5wbGF5ZXItbmFtZScpO1xuICBjb25zdCBheGlzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IGJ1dHRvbicpO1xuICBjb25zdCBheGlzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IC5heGlzJyk7XG5cbiAgbmFtZVNwYW4udGV4dENvbnRlbnQgPSBuYW1lSW5wdXQudmFsdWU7XG5cbiAgY29uc3QgZmlyc3RDYXB0YWluID0gUGxheWVyKG5hbWVJbnB1dC52YWx1ZSk7XG4gIGNvbnN0IHNlY29uZENhcHRhaW4gPSBQbGF5ZXIoJ2NoYXQtR1BUJyk7XG4gIGNvbnN0IGJvYXJkT2JqZWN0ID0gZmlyc3RDYXB0YWluLnBsYXllckJvYXJkO1xuICBkaXNwbGF5R2FtZUJvYXJkKGZpcnN0Q2FwdGFpbik7XG5cbiAgbGV0IGF4aXMgPSAnaG9yaXpvbnRhbCc7XG5cbiAgYXhpc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAoYXhpcyA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBheGlzRG9tLnRleHRDb250ZW50ID0gJ1ZlcnRpY2FsJztcbiAgICAgIGF4aXMgPSAndmVydGljYWwnO1xuICAgIH0gZWxzZSB7XG4gICAgICBheGlzRG9tLnRleHRDb250ZW50ID0gJ0hvcml6b250YWwnO1xuICAgICAgYXhpcyA9ICdob3Jpem9udGFsJztcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgbGV0IGNlbGxYO1xuICBsZXQgY2VsbFk7XG5cbiAgY2VsbHNEb20uZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGNlbGxYID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgICAgY2VsbFkgPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgICBjb25zdCB0YXJnZXRDZWxsID0gYm9hcmRPYmplY3QuZmluZENlbGxBdENvb3JkaW5hdGVzKFxuICAgICAgICBOdW1iZXIoY2VsbFgpLFxuICAgICAgICBOdW1iZXIoY2VsbFkpXG4gICAgICApO1xuICAgICAgYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oJ0ZyaWdhdGUnLCBheGlzLCB0YXJnZXRDZWxsLCBib2FyZE9iamVjdCk7XG4gICAgfSk7XG4gIH0pO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9