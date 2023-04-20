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
/* harmony export */   "placeShipDom": () => (/* binding */ placeShipDom),
/* harmony export */   "switchSection": () => (/* binding */ switchSection),
/* harmony export */   "transitionBackground": () => (/* binding */ transitionBackground)
/* harmony export */ });
function displayGameBoard(board, domElement) {
  for (let row of board) {
    for (let cellArr of row) {
      const cell = cellArr[0];
      const cellDom = document.createElement('div');
      cellDom.classList.add('board-cell');
      cellDom.setAttribute('data-x', cell.x);
      cellDom.setAttribute('data-y', cell.y);
      if (cell.heldShip !== null) {
        const shipLength = cell.heldShip.length
        cellDom.setAttribute('data-ship', shipLength)
      }
      domElement.appendChild(cellDom);
    }
  }
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

  if (axis === 'horizontal') {
    shipTailX = shipHead[0] + length - 1;
    shipTailY = shipHead[1];
  } else if (axis === 'vertical') {
    shipTailX = shipHead[0];
    shipTailY = shipHead[1] + length - 1;
  }

  const shipTail = [shipTailX, shipTailY];
  const restShipCells = [];
  const shipHeadDom = [findDomCellAtCoordinates(...shipHead)];
  const shipTailDom = [findDomCellAtCoordinates(...shipTail)];
  const restShipDom = [];
  const cellsObj = board.findMissingBoatCells(shipHead, length, axis);
  const missingCells = cellsObj.middleCells;
  restShipCells.push(...missingCells);

  if (!board.checkBoatPlacementValidity(shipHead, shipTail, restShipCells)) {
    markInvalidShipLocation(shipHeadDom[0]);
    return false;
  } else {
    restShipCells.forEach((cell) => {
      if (cell === undefined) return;
      restShipDom.push(findDomCellAtCoordinates(cell.x, cell.y));
    });

    const allDomShipCells = shipHeadDom.concat(shipTailDom).concat(restShipDom);
    markAttemptToPlaceShip(allDomShipCells)

    return { shipHead, shipTail, allDomShipCells };
  }
}

function markInvalidShipLocation(cell) {
  cell.classList.add('invalid-location');
  clearDomCellInvalidity(cell);
}

function markAttemptToPlaceShip(cells) {
  cells.forEach((cell) => {
    cell.classList.add('attempt-place-ship');
    cell.addEventListener('mouseleave', () => clearDomCellsCustomColor(cells));
  });
}

function switchSection(section) {
  const landingSection = document.querySelector('.landing');
  const shipPlacement = document.querySelector('.ship-placement');
  const battleSection = document.querySelector('.battle-section')

  if (section === 'ship-placement') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: flex';
  }

  if (section === 'battle-section') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: none';
    battleSection.style.cssText = 'display: flex'
  }
}

function transitionBackground() {
  const shipPlacement = document.querySelector('.ship-placement');
  const battleSection = document.querySelector('.battle-section');
  shipPlacement.classList.add('background-swap');
  battleSection.classList.add('background-swap');
}

function placeShipDom(cells) {
  cells.forEach((cell) => cell.classList.add('ship-placed'));
}

function clearDomCellInvalidity(cell) {
  cell.addEventListener('mouseleave', () => {
    cell.classList.remove('invalid-location');
  });
}

function clearDomCellsCustomColor(cells) {
  cells.forEach((cell) => cell.classList.remove('attempt-place-ship'));
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
      const cellsObj = findMissingBoatCells(head, shipLength, 'horizontal');
      const middleCells = cellsObj.middleCells
      shipCells.push(...middleCells);
    } else if (direction === 'vertical') {
      shipLength = Math.abs(head[1] - tail[1]) + 1;
      ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipLength);
      ships.push(ship);
      const cellsObj = findMissingBoatCells(head, shipLength, 'vertical');
      const middleCells = cellsObj.middleCells;
      shipCells.push(...middleCells);
    }

    const cellsObj = findMissingBoatCells(head, shipLength, direction);
    const middleCells = cellsObj.middleCells

    if (checkBoatPlacementValidity(head, tail, middleCells)) {
      shipCells.forEach((cell) => (cell.heldShip = ship));
      return true;
    }

    return false;
  };

  function findMissingBoatCells(head, length, direction) {
    const cellNumberNotFound = length - 1;
    const restOfCells = [];
    if (direction === 'horizontal') {
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[1];
        const varCoord = head[0];
        const cellInBetween = findCellAtCoordinates(varCoord + i, fixedCoord);
        restOfCells.push(cellInBetween);
      }
    } else if (direction === 'vertical') {
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[0];
        const varCoord = head[1];
        const cellInBetween = findCellAtCoordinates(fixedCoord, varCoord + i);
        restOfCells.push(cellInBetween);
      }
    }

    const middleCells = restOfCells.slice(0, restOfCells.length - 1)
    const tailCell = restOfCells[restOfCells.length - 1]

    return { middleCells, tailCell };
  }

  const checkBoatPlacementValidity = (head, tail, missingCells) => {
    let valid = true;

    if (
      head[0] < 1 ||
      head[0] > 10 ||
      head[1] < 1 ||
      head[1] > 10 ||
      tail[0] < 1 ||
      tail[0] > 10 ||
      tail[1] < 1 ||
      tail[1] > 10
    ) {
      return false;
    } else {
      if (missingCells !== undefined) {
        const headCell = findCellAtCoordinates(head[0], head[1]);
        const tailCell = findCellAtCoordinates(tail[0], tail[1]);
        const allBoatCells = [headCell, tailCell].concat(missingCells);

        allBoatCells.forEach((cell) => {
          if (cell.heldShip !== null) valid = false;
        });
      }
    }
    return valid;
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
    findMissingBoatCells,
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
 
  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const opponentBoard = handleAIShipPlacement();
    runShipPlacementSection((playerBoard) => {
      runBattleSection(playerBoard, opponentBoard);
    });
  });
})();

function runShipPlacementSection(callback) {
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.switchSection)('ship-placement');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)();

  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');
  const gameBoardDom = document.querySelector('.ship-placement .game-board');

  nameSpan.textContent = nameInput.value;

  const firstCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)(nameInput.value);
  const boardObj = firstCaptain.playerBoard;
  const board = boardObj.returnBoard();
  const ships = ['Galleon', 'Frigate', 'Brigantine', 'Schooner', 'Sloop'];

  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(board, gameBoardDom);
  handleCellEvents(boardObj, ships, callback);
}

function handleCellEvents(board, ships, callback) {
  const axisButton = document.querySelector('.ship-placement button');
  const axisDom = document.querySelector('.ship-placement .axis');
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
  let shipsPlacedIdx = 0;

  cellsDom.forEach((domCell) => {
    let cellX;
    let cellY;
    cellX = domCell.getAttribute('data-x');
    cellY = domCell.getAttribute('data-y');
    const boardCell = board.findCellAtCoordinates(Number(cellX), Number(cellY));

    domCell.addEventListener('mouseenter', () => {
      if (shipsPlacedIdx > 4) return;
      const shipToPlace = ships[shipsPlacedIdx];
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.attemptShipPlacementDom)(shipToPlace, axis, boardCell, board);
    });

    domCell.addEventListener('click', () => {
      const shipToPlace = ships[shipsPlacedIdx];
      if (handleShipPlacement(shipToPlace, boardCell, board, axis)) {
        shipsPlacedIdx++;
        if (shipsPlacedIdx === 5) return callback(board);
      }
    });
  });
}

function handleShipPlacement(shipToPlace, boardCell, board, axis) {
  const shipData = (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.attemptShipPlacementDom)(shipToPlace, axis, boardCell, board);
  if (shipData) {
    if (board.placeShip(shipData.shipHead, shipData.shipTail)) {
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.placeShipDom)(shipData.allDomShipCells);
      return true;
    }
  }
}

function handleAIShipPlacement() {
  const secondCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)('chat-GPT');
  const board = secondCaptain.playerBoard;
  const ships = ['Sloop', 'Schooner', 'Brigantine', 'Frigate', 'Galleon'];

  let shipsPlaced = 0;

  while (shipsPlaced < 5) {
    const shipCoords = generateValidRandomShipCoords(5, board);
    if (board.placeShip(shipCoords.shipHead, shipCoords.shipTail)) {
      shipsPlaced++;
    }
  }

  return board;
}

function generateRandomShipCoords(length, board) {
  const shipHead = [
    Math.floor(Math.random() * 10) + 1,
    Math.floor(Math.random() * 10) + 1,
  ];
  let direction;

  if (Math.random() < 0.5) direction = 'horizontal';
  else direction = 'vertical';

  const cellsObj = board.findMissingBoatCells(shipHead, length, direction);
  const shipTailObj = cellsObj.tailCell;

  return { shipHead, shipTailObj };
}

function generateValidRandomShipCoords(length, board) {
  let validShipCoordFound = false;
  let shipHead;
  let shipTail;

  while (!validShipCoordFound) {
    const coordObj = generateRandomShipCoords(length, board);
    const tailObj = coordObj.shipTailObj;
    let shipHeadAttempt = coordObj.shipHead;
    let shipTailAttempt = [tailObj?.x, tailObj?.y];
    // if length is 1, we don't need to find tail coords
    if (length === 1) {
      validShipCoordFound = true;
      shipTail = shipHeadAttempt;
    }
    if (shipTailAttempt[0] !== undefined) {
      validShipCoordFound = true;
      shipHead = shipHeadAttempt;
      shipTail = shipTailAttempt;
    }
  }

  return { shipHead, shipTail };
}

function runBattleSection(playerBoardObj, opponentBoardObj) {
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.switchSection)('battle-section');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)();

  const playerBoard = playerBoardObj.returnBoard();
  const opponentBoard = opponentBoardObj.returnBoard();
  const playerBoardDom = document.querySelector('.player-board');
  const opponentBoardDom = document.querySelector('.ai-board');

  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(playerBoard, playerBoardDom);
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(opponentBoard, opponentBoardDom);

  console.log(playerBoard);
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUEsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUpPO0FBQ1A7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTDhCO0FBQ0E7O0FBRXZCO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0Esc0JBQXNCLFdBQVc7QUFDakMscUJBQXFCLDJDQUFJO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLGFBQWEsMkNBQUk7QUFDakI7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsYUFBYSwyQ0FBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLGFBQWEsMkNBQUk7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IseUJBQXlCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sc0JBQXNCLHlCQUF5QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLE1BQU07QUFDeEI7QUFDQTtBQUNBLE1BQU0sbUJBQW1CLE1BQU07QUFDL0I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3hMeUM7O0FBRWxDO0FBQ1Asc0JBQXNCLHNEQUFTOztBQUUvQixXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQ05PO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOzs7Ozs7O1VDZEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOeUM7QUFPZDs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBLEVBQUUsK0RBQWE7QUFDZixFQUFFLHNFQUFvQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBOztBQUVBLHVCQUF1QixzREFBTTtBQUM3QjtBQUNBO0FBQ0E7O0FBRUEsRUFBRSxrRUFBZ0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU0seUVBQXVCO0FBQzdCLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBLG1CQUFtQix5RUFBdUI7QUFDMUM7QUFDQTtBQUNBLE1BQU0sOERBQVk7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0Isc0RBQU07QUFDOUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQSxFQUFFLCtEQUFhO0FBQ2YsRUFBRSxzRUFBb0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUUsa0VBQWdCO0FBQ2xCLEVBQUUsa0VBQWdCOztBQUVsQjtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9kb20vZG9tLW1ldGhvZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvY2VsbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9nYW1lLWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5R2FtZUJvYXJkKGJvYXJkLCBkb21FbGVtZW50KSB7XG4gIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgIGZvciAobGV0IGNlbGxBcnIgb2Ygcm93KSB7XG4gICAgICBjb25zdCBjZWxsID0gY2VsbEFyclswXTtcbiAgICAgIGNvbnN0IGNlbGxEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNlbGxEb20uY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIGNlbGwueCk7XG4gICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgY2VsbC55KTtcbiAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBjZWxsLmhlbGRTaGlwLmxlbmd0aFxuICAgICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJywgc2hpcExlbmd0aClcbiAgICAgIH1cbiAgICAgIGRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoY2VsbERvbSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNoaXBOYW1lKHNoaXBUeXBlKSB7XG4gIGNvbnN0IHNoaXBzID0ge1xuICAgIEdhbGxlb246IDUsXG4gICAgRnJpZ2F0ZTogNCxcbiAgICBCcmlnYW50aW5lOiAzLFxuICAgIFNjaG9vbmVyOiAyLFxuICAgIFNsb29wOiAxLFxuICB9O1xuICBsZXQgc2hpcDtcbiAgbGV0IGxlbmd0aDtcblxuICBzd2l0Y2ggKHNoaXBUeXBlKSB7XG4gICAgY2FzZSAnR2FsbGVvbic6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzBdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdGcmlnYXRlJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbMV07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0JyaWdhbnRpbmUnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVsyXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnU2Nob29uZXInOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVszXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnU2xvb3AnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVs0XTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHsgc2hpcCwgbGVuZ3RoIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oc2hpcFR5cGUsIGF4aXMsIGNlbGwsIGJvYXJkKSB7XG4gIGNvbnN0IHNoaXBEYXRhID0gZ2V0U2hpcE5hbWUoc2hpcFR5cGUpO1xuICBjb25zdCBzaGlwU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRvLXBsYWNlIC5zaGlwJyk7XG4gIHNoaXBTcGFuLnRleHRDb250ZW50ID0gc2hpcERhdGEuc2hpcDtcbiAgY29uc3QgbGVuZ3RoID0gc2hpcERhdGEubGVuZ3RoO1xuXG4gIGNvbnN0IHNoaXBIZWFkID0gW2NlbGwueCwgY2VsbC55XTtcbiAgbGV0IHNoaXBUYWlsWDtcbiAgbGV0IHNoaXBUYWlsWTtcblxuICBpZiAoYXhpcyA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgc2hpcFRhaWxYID0gc2hpcEhlYWRbMF0gKyBsZW5ndGggLSAxO1xuICAgIHNoaXBUYWlsWSA9IHNoaXBIZWFkWzFdO1xuICB9IGVsc2UgaWYgKGF4aXMgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICBzaGlwVGFpbFggPSBzaGlwSGVhZFswXTtcbiAgICBzaGlwVGFpbFkgPSBzaGlwSGVhZFsxXSArIGxlbmd0aCAtIDE7XG4gIH1cblxuICBjb25zdCBzaGlwVGFpbCA9IFtzaGlwVGFpbFgsIHNoaXBUYWlsWV07XG4gIGNvbnN0IHJlc3RTaGlwQ2VsbHMgPSBbXTtcbiAgY29uc3Qgc2hpcEhlYWREb20gPSBbZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKC4uLnNoaXBIZWFkKV07XG4gIGNvbnN0IHNoaXBUYWlsRG9tID0gW2ZpbmREb21DZWxsQXRDb29yZGluYXRlcyguLi5zaGlwVGFpbCldO1xuICBjb25zdCByZXN0U2hpcERvbSA9IFtdO1xuICBjb25zdCBjZWxsc09iaiA9IGJvYXJkLmZpbmRNaXNzaW5nQm9hdENlbGxzKHNoaXBIZWFkLCBsZW5ndGgsIGF4aXMpO1xuICBjb25zdCBtaXNzaW5nQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgcmVzdFNoaXBDZWxscy5wdXNoKC4uLm1pc3NpbmdDZWxscyk7XG5cbiAgaWYgKCFib2FyZC5jaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eShzaGlwSGVhZCwgc2hpcFRhaWwsIHJlc3RTaGlwQ2VsbHMpKSB7XG4gICAgbWFya0ludmFsaWRTaGlwTG9jYXRpb24oc2hpcEhlYWREb21bMF0pO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXN0U2hpcENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGlmIChjZWxsID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgIHJlc3RTaGlwRG9tLnB1c2goZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKGNlbGwueCwgY2VsbC55KSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGxEb21TaGlwQ2VsbHMgPSBzaGlwSGVhZERvbS5jb25jYXQoc2hpcFRhaWxEb20pLmNvbmNhdChyZXN0U2hpcERvbSk7XG4gICAgbWFya0F0dGVtcHRUb1BsYWNlU2hpcChhbGxEb21TaGlwQ2VsbHMpXG5cbiAgICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWwsIGFsbERvbVNoaXBDZWxscyB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtJbnZhbGlkU2hpcExvY2F0aW9uKGNlbGwpIHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkLWxvY2F0aW9uJyk7XG4gIGNsZWFyRG9tQ2VsbEludmFsaWRpdHkoY2VsbCk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBdHRlbXB0VG9QbGFjZVNoaXAoY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnYXR0ZW1wdC1wbGFjZS1zaGlwJyk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoU2VjdGlvbihzZWN0aW9uKSB7XG4gIGNvbnN0IGxhbmRpbmdTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhbmRpbmcnKTtcbiAgY29uc3Qgc2hpcFBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCcpO1xuICBjb25zdCBiYXR0bGVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZS1zZWN0aW9uJylcblxuICBpZiAoc2VjdGlvbiA9PT0gJ3NoaXAtcGxhY2VtZW50Jykge1xuICAgIGxhbmRpbmdTZWN0aW9uLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgc2hpcFBsYWNlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGZsZXgnO1xuICB9XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdiYXR0bGUtc2VjdGlvbicpIHtcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIHNoaXBQbGFjZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBiYXR0bGVTZWN0aW9uLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleCdcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNpdGlvbkJhY2tncm91bmQoKSB7XG4gIGNvbnN0IHNoaXBQbGFjZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC1wbGFjZW1lbnQnKTtcbiAgY29uc3QgYmF0dGxlU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iYXR0bGUtc2VjdGlvbicpO1xuICBzaGlwUGxhY2VtZW50LmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQtc3dhcCcpO1xuICBiYXR0bGVTZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQtc3dhcCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGxhY2VTaGlwRG9tKGNlbGxzKSB7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcC1wbGFjZWQnKSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tQ2VsbEludmFsaWRpdHkoY2VsbCkge1xuICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkLWxvY2F0aW9uJyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhckRvbUNlbGxzQ3VzdG9tQ29sb3IoY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdhdHRlbXB0LXBsYWNlLXNoaXAnKSk7XG59XG5cbmZ1bmN0aW9uIGZpbmREb21DZWxsQXRDb29yZGluYXRlcyh4LCB5KSB7XG4gIGNvbnN0IGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgbGV0IHNlYXJjaGVkQ2VsbDtcblxuICBjZWxsc0RvbS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgY2VsbFggPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS14Jyk7XG4gICAgY29uc3QgY2VsbFkgPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgaWYgKE51bWJlcihjZWxsWCkgPT09IHggJiYgTnVtYmVyKGNlbGxZKSA9PT0geSkgc2VhcmNoZWRDZWxsID0gY2VsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIHNlYXJjaGVkQ2VsbDtcbn1cblxuXG4iLCJleHBvcnQgZnVuY3Rpb24gQ2VsbCh4LCB5KSB7XG4gIGxldCBoZWxkU2hpcCA9IG51bGw7XG4gIGxldCBpc0hpdCA9IGZhbHNlO1xuXG4gIHJldHVybiB7IHgsIHksIGhlbGRTaGlwLCBpc0hpdCB9O1xufVxuIiwiaW1wb3J0IHsgU2hpcCB9IGZyb20gJy4vc2hpcCc7XG5pbXBvcnQgeyBDZWxsIH0gZnJvbSAnLi9jZWxsJztcblxuZXhwb3J0IGNvbnN0IEdhbWVCb2FyZCA9ICgpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3Qgcm93cyA9IDEwO1xuICBjb25zdCBjb2xzID0gMTA7XG4gIGNvbnN0IHNoaXBzID0gW107XG4gIGxldCBoaXRzID0gW107XG4gIGxldCBtaXNzZXMgPSBbXTtcbiAgZ2VuZXJhdGVCb2FyZCgpO1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQm9hcmQoKSB7XG4gICAgZm9yIChsZXQgaSA9IHJvd3M7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IHJvdyA9IFtdO1xuICAgICAgYm9hcmQucHVzaChyb3cpO1xuICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gY29sczsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IFtDZWxsKGosIGkpXTtcbiAgICAgICAgcm93LnB1c2goY29sKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCByZXR1cm5Cb2FyZCA9ICgpID0+IGJvYXJkO1xuXG4gIGNvbnN0IGZpbmRDZWxsQXRDb29yZGluYXRlcyA9ICh4LCB5KSA9PiB7XG4gICAgZm9yIChsZXQgcm93IG9mIGJvYXJkKSB7XG4gICAgICBmb3IgKGxldCBib2FyZENlbGwgb2Ygcm93KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZENlbGxbMF07XG4gICAgICAgIGlmICh4ID09PSBjZWxsLnggJiYgeSA9PT0gY2VsbC55KSByZXR1cm4gY2VsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGhlYWQsIHRhaWwpID0+IHtcbiAgICBpZiAoIShoZWFkIGluc3RhbmNlb2YgQXJyYXkpIHx8ICEodGFpbCBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgIHRocm93IEVycm9yKCdoZWFkIGFuZCB0YWlsIG11c3QgYmUgYXJyYXlzIHJlcHJlc2VudGluZyBjb29yZGluYXRlcyEnKTtcblxuICAgIGxldCBzaGlwO1xuICAgIGNvbnN0IHNoaXBDZWxscyA9IFtdO1xuICAgIGxldCBkaXJlY3Rpb24gPSAnaW52YWxpZCc7XG4gICAgbGV0IHNoaXBMZW5ndGg7XG5cbiAgICBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSAmJiBoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnc2luZ2xlLWNlbGwnO1xuICAgIGVsc2UgaWYgKGhlYWRbMF0gPT09IHRhaWxbMF0pIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgZWxzZSBpZiAoaGVhZFsxXSA9PT0gdGFpbFsxXSkgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuXG4gICAgY29uc3QgaGVhZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoaGVhZFswXSwgaGVhZFsxXSk7XG4gICAgY29uc3QgdGFpbENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXModGFpbFswXSwgdGFpbFsxXSk7XG4gICAgc2hpcENlbGxzLnB1c2goaGVhZENlbGwpO1xuICAgIHNoaXBDZWxscy5wdXNoKHRhaWxDZWxsKTtcblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdpbnZhbGlkJyB8fCAhY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoaGVhZCwgdGFpbCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3NpbmdsZS1jZWxsJykge1xuICAgICAgc2hpcCA9IFNoaXAoMSk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgLy8gY2FzZSBvZiBzaW5nbGUtY2VsbCBib2F0LCByZW1vdmUgdGhlIGRvdWJsZSBjb29yZGluYXRlIGZyb20gYXJyXG4gICAgICBzaGlwQ2VsbHMuc2hpZnQoKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBzaGlwTGVuZ3RoID0gTWF0aC5hYnMoaGVhZFswXSAtIHRhaWxbMF0pICsgMTtcbiAgICAgIHNoaXAgPSBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIGNvbnN0IGNlbGxzT2JqID0gZmluZE1pc3NpbmdCb2F0Q2VsbHMoaGVhZCwgc2hpcExlbmd0aCwgJ2hvcml6b250YWwnKTtcbiAgICAgIGNvbnN0IG1pZGRsZUNlbGxzID0gY2VsbHNPYmoubWlkZGxlQ2VsbHNcbiAgICAgIHNoaXBDZWxscy5wdXNoKC4uLm1pZGRsZUNlbGxzKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgc2hpcExlbmd0aCA9IE1hdGguYWJzKGhlYWRbMV0gLSB0YWlsWzFdKSArIDE7XG4gICAgICBzaGlwID0gU2hpcChzaGlwTGVuZ3RoKTtcbiAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsICd2ZXJ0aWNhbCcpO1xuICAgICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAgIHNoaXBDZWxscy5wdXNoKC4uLm1pZGRsZUNlbGxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxsc1xuXG4gICAgaWYgKGNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KGhlYWQsIHRhaWwsIG1pZGRsZUNlbGxzKSkge1xuICAgICAgc2hpcENlbGxzLmZvckVhY2goKGNlbGwpID0+IChjZWxsLmhlbGRTaGlwID0gc2hpcCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgY2VsbE51bWJlck5vdEZvdW5kID0gbGVuZ3RoIC0gMTtcbiAgICBjb25zdCByZXN0T2ZDZWxscyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY2VsbE51bWJlck5vdEZvdW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgZml4ZWRDb29yZCA9IGhlYWRbMV07XG4gICAgICAgIGNvbnN0IHZhckNvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh2YXJDb29yZCArIGksIGZpeGVkQ29vcmQpO1xuICAgICAgICByZXN0T2ZDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgdmFyQ29vcmQgPSBoZWFkWzFdO1xuICAgICAgICBjb25zdCBjZWxsSW5CZXR3ZWVuID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGZpeGVkQ29vcmQsIHZhckNvb3JkICsgaSk7XG4gICAgICAgIHJlc3RPZkNlbGxzLnB1c2goY2VsbEluQmV0d2Vlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSByZXN0T2ZDZWxscy5zbGljZSgwLCByZXN0T2ZDZWxscy5sZW5ndGggLSAxKVxuICAgIGNvbnN0IHRhaWxDZWxsID0gcmVzdE9mQ2VsbHNbcmVzdE9mQ2VsbHMubGVuZ3RoIC0gMV1cblxuICAgIHJldHVybiB7IG1pZGRsZUNlbGxzLCB0YWlsQ2VsbCB9O1xuICB9XG5cbiAgY29uc3QgY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkgPSAoaGVhZCwgdGFpbCwgbWlzc2luZ0NlbGxzKSA9PiB7XG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcblxuICAgIGlmIChcbiAgICAgIGhlYWRbMF0gPCAxIHx8XG4gICAgICBoZWFkWzBdID4gMTAgfHxcbiAgICAgIGhlYWRbMV0gPCAxIHx8XG4gICAgICBoZWFkWzFdID4gMTAgfHxcbiAgICAgIHRhaWxbMF0gPCAxIHx8XG4gICAgICB0YWlsWzBdID4gMTAgfHxcbiAgICAgIHRhaWxbMV0gPCAxIHx8XG4gICAgICB0YWlsWzFdID4gMTBcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1pc3NpbmdDZWxscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGhlYWRDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGhlYWRbMF0sIGhlYWRbMV0pO1xuICAgICAgICBjb25zdCB0YWlsQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh0YWlsWzBdLCB0YWlsWzFdKTtcbiAgICAgICAgY29uc3QgYWxsQm9hdENlbGxzID0gW2hlYWRDZWxsLCB0YWlsQ2VsbF0uY29uY2F0KG1pc3NpbmdDZWxscyk7XG5cbiAgICAgICAgYWxsQm9hdENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgICBpZiAoY2VsbC5oZWxkU2hpcCAhPT0gbnVsbCkgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZDtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHgsIHkpID0+IHtcbiAgICBpZiAoY2hlY2tBdHRhY2tWYWxpZGl0eSh4LCB5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGF0dGFjaycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh4LCB5KTtcbiAgICBhdHRhY2tlZENlbGwuaXNIaXQgPSB0cnVlO1xuXG4gICAgaWYgKGF0dGFja2VkQ2VsbC5oZWxkU2hpcCAhPT0gbnVsbCkge1xuICAgICAgaGl0cy5wdXNoKHsgeCwgeSB9KTtcbiAgICAgIGF0dGFja2VkQ2VsbC5oZWxkU2hpcC5nZXRIaXQoKTtcbiAgICAgIGNoZWNrR2FtZU92ZXIoKTtcbiAgICB9IGVsc2UgbWlzc2VzLnB1c2goeyB4LCB5IH0pO1xuICB9O1xuXG4gIGNvbnN0IGNoZWNrQXR0YWNrVmFsaWRpdHkgPSAoeCwgeSkgPT4ge1xuICAgIGlmICh4IDwgMSB8fCB4ID4gMTAgfHwgeSA8IDEgfHwgeSA+IDEwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhbGxBdHRhY2tzID0gaGl0cy5jb25jYXQobWlzc2VzKTtcbiAgICBmb3IgKGxldCBhdHRhY2sgb2YgYWxsQXR0YWNrcykge1xuICAgICAgaWYgKGF0dGFjay54ID09PSB4ICYmIGF0dGFjay55ID09PSB5KSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgY2hlY2tHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjZWxsTnVtYmVySG9sZGluZ0JvYXRzID0gc2hpcHMucmVkdWNlKFxuICAgICAgKHRvdGFsLCBzaGlwKSA9PiAodG90YWwgKz0gc2hpcC5sZW5ndGgpLFxuICAgICAgMFxuICAgICk7XG5cbiAgICBpZiAoaGl0cy5sZW5ndGggPj0gY2VsbE51bWJlckhvbGRpbmdCb2F0cykgY29uc29sZS5sb2coJ0dhbWUgT3ZlcicpO1xuICAgIGVsc2UgY29uc29sZS5sb2coJ0dhbWUgQ29udGludWVzJyk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICByZXR1cm5Cb2FyZCxcbiAgICBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMsXG4gICAgY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHksXG4gICAgZmluZE1pc3NpbmdCb2F0Q2VsbHMsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgR2FtZUJvYXJkIH0gZnJvbSBcIi4vZ2FtZS1ib2FyZFwiO1xuXG5leHBvcnQgY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcblxuICByZXR1cm4geyBwbGF5ZXJCb2FyZCwgbmFtZSB9O1xufTtcbiIsImV4cG9ydCBjb25zdCBTaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgaGl0ID0gMDtcblxuICBmdW5jdGlvbiBnZXRIaXQoKSB7XG4gICAgaGl0Kys7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0lmU3VuaygpIHtcbiAgICBpZiAoaGl0ID49IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geyBsZW5ndGgsIGdldEhpdCwgY2hlY2tJZlN1bmsgfTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vbW9kZWxzL3BsYXllcic7XG5pbXBvcnQge1xuICBkaXNwbGF5R2FtZUJvYXJkLFxuICBzd2l0Y2hTZWN0aW9uLFxuICB0cmFuc2l0aW9uQmFja2dyb3VuZCxcbiAgYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20sXG4gIHBsYWNlU2hpcERvbSxcbn0gZnJvbSAnLi9kb20vZG9tLW1ldGhvZHMnO1xuXG5jb25zdCBwbGF5R2FtZSA9ICgoKSA9PiB7XG4gIGNvbnN0IHN0YXJ0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXN0YXJ0Jyk7XG4gXG4gIHN0YXJ0Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBvcHBvbmVudEJvYXJkID0gaGFuZGxlQUlTaGlwUGxhY2VtZW50KCk7XG4gICAgcnVuU2hpcFBsYWNlbWVudFNlY3Rpb24oKHBsYXllckJvYXJkKSA9PiB7XG4gICAgICBydW5CYXR0bGVTZWN0aW9uKHBsYXllckJvYXJkLCBvcHBvbmVudEJvYXJkKTtcbiAgICB9KTtcbiAgfSk7XG59KSgpO1xuXG5mdW5jdGlvbiBydW5TaGlwUGxhY2VtZW50U2VjdGlvbihjYWxsYmFjaykge1xuICBzd2l0Y2hTZWN0aW9uKCdzaGlwLXBsYWNlbWVudCcpO1xuICB0cmFuc2l0aW9uQmFja2dyb3VuZCgpO1xuXG4gIGNvbnN0IG5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXN0YXJ0IGlucHV0Jyk7XG4gIGNvbnN0IG5hbWVTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdG8tcGxhY2UgLnBsYXllci1uYW1lJyk7XG4gIGNvbnN0IGdhbWVCb2FyZERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCAuZ2FtZS1ib2FyZCcpO1xuXG4gIG5hbWVTcGFuLnRleHRDb250ZW50ID0gbmFtZUlucHV0LnZhbHVlO1xuXG4gIGNvbnN0IGZpcnN0Q2FwdGFpbiA9IFBsYXllcihuYW1lSW5wdXQudmFsdWUpO1xuICBjb25zdCBib2FyZE9iaiA9IGZpcnN0Q2FwdGFpbi5wbGF5ZXJCb2FyZDtcbiAgY29uc3QgYm9hcmQgPSBib2FyZE9iai5yZXR1cm5Cb2FyZCgpO1xuICBjb25zdCBzaGlwcyA9IFsnR2FsbGVvbicsICdGcmlnYXRlJywgJ0JyaWdhbnRpbmUnLCAnU2Nob29uZXInLCAnU2xvb3AnXTtcblxuICBkaXNwbGF5R2FtZUJvYXJkKGJvYXJkLCBnYW1lQm9hcmREb20pO1xuICBoYW5kbGVDZWxsRXZlbnRzKGJvYXJkT2JqLCBzaGlwcywgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDZWxsRXZlbnRzKGJvYXJkLCBzaGlwcywgY2FsbGJhY2spIHtcbiAgY29uc3QgYXhpc0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCBidXR0b24nKTtcbiAgY29uc3QgYXhpc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCAuYXhpcycpO1xuICBsZXQgYXhpcyA9ICdob3Jpem9udGFsJztcblxuICBheGlzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChheGlzID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF4aXNEb20udGV4dENvbnRlbnQgPSAnVmVydGljYWwnO1xuICAgICAgYXhpcyA9ICd2ZXJ0aWNhbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF4aXNEb20udGV4dENvbnRlbnQgPSAnSG9yaXpvbnRhbCc7XG4gICAgICBheGlzID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICBsZXQgc2hpcHNQbGFjZWRJZHggPSAwO1xuXG4gIGNlbGxzRG9tLmZvckVhY2goKGRvbUNlbGwpID0+IHtcbiAgICBsZXQgY2VsbFg7XG4gICAgbGV0IGNlbGxZO1xuICAgIGNlbGxYID0gZG9tQ2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgIGNlbGxZID0gZG9tQ2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGJvYXJkLmZpbmRDZWxsQXRDb29yZGluYXRlcyhOdW1iZXIoY2VsbFgpLCBOdW1iZXIoY2VsbFkpKTtcblxuICAgIGRvbUNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGlmIChzaGlwc1BsYWNlZElkeCA+IDQpIHJldHVybjtcbiAgICAgIGNvbnN0IHNoaXBUb1BsYWNlID0gc2hpcHNbc2hpcHNQbGFjZWRJZHhdO1xuICAgICAgYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oc2hpcFRvUGxhY2UsIGF4aXMsIGJvYXJkQ2VsbCwgYm9hcmQpO1xuICAgIH0pO1xuXG4gICAgZG9tQ2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNoaXBUb1BsYWNlID0gc2hpcHNbc2hpcHNQbGFjZWRJZHhdO1xuICAgICAgaWYgKGhhbmRsZVNoaXBQbGFjZW1lbnQoc2hpcFRvUGxhY2UsIGJvYXJkQ2VsbCwgYm9hcmQsIGF4aXMpKSB7XG4gICAgICAgIHNoaXBzUGxhY2VkSWR4Kys7XG4gICAgICAgIGlmIChzaGlwc1BsYWNlZElkeCA9PT0gNSkgcmV0dXJuIGNhbGxiYWNrKGJvYXJkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNoaXBQbGFjZW1lbnQoc2hpcFRvUGxhY2UsIGJvYXJkQ2VsbCwgYm9hcmQsIGF4aXMpIHtcbiAgY29uc3Qgc2hpcERhdGEgPSBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVG9QbGFjZSwgYXhpcywgYm9hcmRDZWxsLCBib2FyZCk7XG4gIGlmIChzaGlwRGF0YSkge1xuICAgIGlmIChib2FyZC5wbGFjZVNoaXAoc2hpcERhdGEuc2hpcEhlYWQsIHNoaXBEYXRhLnNoaXBUYWlsKSkge1xuICAgICAgcGxhY2VTaGlwRG9tKHNoaXBEYXRhLmFsbERvbVNoaXBDZWxscyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQUlTaGlwUGxhY2VtZW50KCkge1xuICBjb25zdCBzZWNvbmRDYXB0YWluID0gUGxheWVyKCdjaGF0LUdQVCcpO1xuICBjb25zdCBib2FyZCA9IHNlY29uZENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGNvbnN0IHNoaXBzID0gWydTbG9vcCcsICdTY2hvb25lcicsICdCcmlnYW50aW5lJywgJ0ZyaWdhdGUnLCAnR2FsbGVvbiddO1xuXG4gIGxldCBzaGlwc1BsYWNlZCA9IDA7XG5cbiAgd2hpbGUgKHNoaXBzUGxhY2VkIDwgNSkge1xuICAgIGNvbnN0IHNoaXBDb29yZHMgPSBnZW5lcmF0ZVZhbGlkUmFuZG9tU2hpcENvb3Jkcyg1LCBib2FyZCk7XG4gICAgaWYgKGJvYXJkLnBsYWNlU2hpcChzaGlwQ29vcmRzLnNoaXBIZWFkLCBzaGlwQ29vcmRzLnNoaXBUYWlsKSkge1xuICAgICAgc2hpcHNQbGFjZWQrKztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYm9hcmQ7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKSB7XG4gIGNvbnN0IHNoaXBIZWFkID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEsXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMSxcbiAgXTtcbiAgbGV0IGRpcmVjdGlvbjtcblxuICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICBlbHNlIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG5cbiAgY29uc3QgY2VsbHNPYmogPSBib2FyZC5maW5kTWlzc2luZ0JvYXRDZWxscyhzaGlwSGVhZCwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICBjb25zdCBzaGlwVGFpbE9iaiA9IGNlbGxzT2JqLnRhaWxDZWxsO1xuXG4gIHJldHVybiB7IHNoaXBIZWFkLCBzaGlwVGFpbE9iaiB9O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVZhbGlkUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKSB7XG4gIGxldCB2YWxpZFNoaXBDb29yZEZvdW5kID0gZmFsc2U7XG4gIGxldCBzaGlwSGVhZDtcbiAgbGV0IHNoaXBUYWlsO1xuXG4gIHdoaWxlICghdmFsaWRTaGlwQ29vcmRGb3VuZCkge1xuICAgIGNvbnN0IGNvb3JkT2JqID0gZ2VuZXJhdGVSYW5kb21TaGlwQ29vcmRzKGxlbmd0aCwgYm9hcmQpO1xuICAgIGNvbnN0IHRhaWxPYmogPSBjb29yZE9iai5zaGlwVGFpbE9iajtcbiAgICBsZXQgc2hpcEhlYWRBdHRlbXB0ID0gY29vcmRPYmouc2hpcEhlYWQ7XG4gICAgbGV0IHNoaXBUYWlsQXR0ZW1wdCA9IFt0YWlsT2JqPy54LCB0YWlsT2JqPy55XTtcbiAgICAvLyBpZiBsZW5ndGggaXMgMSwgd2UgZG9uJ3QgbmVlZCB0byBmaW5kIHRhaWwgY29vcmRzXG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFsaWRTaGlwQ29vcmRGb3VuZCA9IHRydWU7XG4gICAgICBzaGlwVGFpbCA9IHNoaXBIZWFkQXR0ZW1wdDtcbiAgICB9XG4gICAgaWYgKHNoaXBUYWlsQXR0ZW1wdFswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWxpZFNoaXBDb29yZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHNoaXBIZWFkID0gc2hpcEhlYWRBdHRlbXB0O1xuICAgICAgc2hpcFRhaWwgPSBzaGlwVGFpbEF0dGVtcHQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgc2hpcEhlYWQsIHNoaXBUYWlsIH07XG59XG5cbmZ1bmN0aW9uIHJ1bkJhdHRsZVNlY3Rpb24ocGxheWVyQm9hcmRPYmosIG9wcG9uZW50Qm9hcmRPYmopIHtcbiAgc3dpdGNoU2VjdGlvbignYmF0dGxlLXNlY3Rpb24nKTtcbiAgdHJhbnNpdGlvbkJhY2tncm91bmQoKTtcblxuICBjb25zdCBwbGF5ZXJCb2FyZCA9IHBsYXllckJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmQgPSBvcHBvbmVudEJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG4gIGNvbnN0IHBsYXllckJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1ib2FyZCcpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFpLWJvYXJkJyk7XG5cbiAgZGlzcGxheUdhbWVCb2FyZChwbGF5ZXJCb2FyZCwgcGxheWVyQm9hcmREb20pO1xuICBkaXNwbGF5R2FtZUJvYXJkKG9wcG9uZW50Qm9hcmQsIG9wcG9uZW50Qm9hcmREb20pO1xuXG4gIGNvbnNvbGUubG9nKHBsYXllckJvYXJkKTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==