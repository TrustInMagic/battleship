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
/* harmony export */   "findDomCellAtCoordinates": () => (/* binding */ findDomCellAtCoordinates),
/* harmony export */   "markSunkShip": () => (/* binding */ markSunkShip),
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
        const shipLength = cell.heldShip.length;
        cellDom.setAttribute('data-ship', shipLength);
      }
      domElement.appendChild(cellDom);
    }
  }
}

function getShipDetails(shipType) {
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
  const shipData = getShipDetails(shipType);
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
    markAttemptToPlaceShip(allDomShipCells);

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
  const battleSection = document.querySelector('.battle-section');
  const gameOver = document.querySelector('.game-over');

  if (section === 'landing') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: none';
    battleSection.style.cssText = 'display: none';
    gameOver.style.cssText = 'display: none';
    landingSection.style.cssText = 'display: flex';
  }

  if (section === 'ship-placement') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: flex';
  }

  if (section === 'battle-section') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: none';
    battleSection.style.cssText = 'display: flex';
  }

  if (section === 'game-over') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: none';
    battleSection.style.cssText = 'display: none';
    gameOver.style.cssText = 'display: flex';
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

function findDomCellAtCoordinates(x, y, player) {
  let cellsDom = document.querySelectorAll('.board-cell');
  let searchedCell;
  if (player !== undefined) {
    if (player === 'player') {
      cellsDom = document.querySelectorAll('.player-board .board-cell');
    } else cellsDom = document.querySelectorAll('.ai-board .board-cell');
  }

  cellsDom.forEach((cell) => {
    const cellX = cell.getAttribute('data-x');
    const cellY = cell.getAttribute('data-y');
    if (Number(cellX) === x && Number(cellY) === y) searchedCell = cell;
  });

  return searchedCell;
}

function markSunkShip(shipLength, player) {
  let cellsDom;

  if (player === 'player') {
    cellsDom = document.querySelectorAll('.player-board .board-cell');
  } else cellsDom = document.querySelectorAll('.ai-board .board-cell');

  cellsDom.forEach((cell) => {
    const shipDom = Number(cell.getAttribute('data-ship'));
    if (shipDom === shipLength) cell.classList.add('sunk');
  });
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
      // case of single-cell boat, remove the double coordinate from arr
      shipCells.shift();
    } else if (direction === 'horizontal') {
      shipLength = Math.abs(head[0] - tail[0]) + 1;
      ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipLength);
      const cellsObj = findMissingBoatCells(head, shipLength, 'horizontal');
      const middleCells = cellsObj.middleCells;
      shipCells.push(...middleCells);
    } else if (direction === 'vertical') {
      shipLength = Math.abs(head[1] - tail[1]) + 1;
      ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__.Ship)(shipLength);
      const cellsObj = findMissingBoatCells(head, shipLength, 'vertical');
      const middleCells = cellsObj.middleCells;
      shipCells.push(...middleCells);
    }

    const cellsObj = findMissingBoatCells(head, shipLength, direction);
    const middleCells = cellsObj.middleCells;
    // if valid coords, add the ship both to the board and the ship array
    if (checkBoatPlacementValidity(head, tail, middleCells)) {
      shipCells.forEach((cell) => (cell.heldShip = ship));
      ships.push(ship);
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

    const middleCells = restOfCells.slice(0, restOfCells.length - 1);
    const tailCell = restOfCells[restOfCells.length - 1];

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
      return 'invalid';
    }

    const attackedCell = findCellAtCoordinates(x, y);
    attackedCell.isHit = true;

    if (attackedCell.heldShip !== null) {
      hits.push({ x, y });
      attackedCell.heldShip.getHit();
      if (checkGameOver()) return 'game-over';
      // if the ship has been sunk, return the ship
      if (attackedCell.heldShip.checkIfSunk()) return attackedCell.heldShip;
      return 'hit';
    } else {
      misses.push({ x, y });
      return 'miss';
    }
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

    console.log(hits.length, cellNumberHoldingBoats)

    if (hits.length === cellNumberHoldingBoats) return true;
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
  let hits = 0;

  const getHit = () => {
    hits++;
  }

  const checkIfSunk = () => {
    if (hits === length) return true;
    else return false;
  }

  return { length, getHit, checkIfSunk};
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



const startGame = () => {
  const startForm = document.querySelector('.game-start');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)('landing')

  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const secondCaptain = handleAIShipPlacement();
    runShipPlacementSection((firstCaptain) => {
      runBattleSection(firstCaptain, secondCaptain);
    });
  });
};

function runShipPlacementSection(callback) {
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.switchSection)('ship-placement');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)();

  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');
  const gameBoardDom = document.querySelector('.ship-placement .game-board');
  const ships = ['Galleon', 'Frigate', 'Brigantine', 'Schooner', 'Sloop'];

  nameSpan.textContent = nameInput.value;
  const firstCaptain = (0,_models_player__WEBPACK_IMPORTED_MODULE_0__.Player)(nameInput.value);
  const boardObj = firstCaptain.playerBoard;
  const board = boardObj.returnBoard();

  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(board, gameBoardDom);
  handleCellEvents(firstCaptain, ships, callback);
}

function handleCellEvents(firstCaptain, ships, callback) {
  const axisButton = document.querySelector('.ship-placement button');
  const axisDom = document.querySelector('.ship-placement .axis');
  const boardObj = firstCaptain.playerBoard;
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
    const boardCell = boardObj.findCellAtCoordinates(
      Number(cellX),
      Number(cellY)
    );

    domCell.addEventListener('mouseenter', () => {
      if (shipsPlacedIdx > 4) return;
      const shipToPlace = ships[shipsPlacedIdx];
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.attemptShipPlacementDom)(shipToPlace, axis, boardCell, boardObj);
    });

    domCell.addEventListener('click', () => {
      const shipToPlace = ships[shipsPlacedIdx];
      if (handleShipPlacement(shipToPlace, boardCell, boardObj, axis)) {
        shipsPlacedIdx++;
        if (shipsPlacedIdx === 5) return callback(firstCaptain);
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
  let shipsPlaced = 1;

  while (shipsPlaced < 6) {
    const shipCoords = generateValidRandomShipCoords(shipsPlaced, board);
    if (board.placeShip(shipCoords.shipHead, shipCoords.shipTail)) {
      shipsPlaced++;
    }
  }

  return secondCaptain;
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
      shipHead = shipHeadAttempt;
    }
    if (shipTailAttempt[0] !== undefined) {
      validShipCoordFound = true;
      shipHead = shipHeadAttempt;
      shipTail = shipTailAttempt;
    }
  }

  return { shipHead, shipTail };
}

function runBattleSection(firstCaptain, secondCaptain) {
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.switchSection)('battle-section');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)();
  const playerBoardObj = firstCaptain.playerBoard;
  const opponentBoardObj = secondCaptain.playerBoard;

  const playerBoard = playerBoardObj.returnBoard();
  const opponentBoard = opponentBoardObj.returnBoard();
  const playerBoardDom = document.querySelector('.player-board');
  const opponentBoardDom = document.querySelector('.ai-board');

  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(playerBoard, playerBoardDom);
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(opponentBoard, opponentBoardDom);

  playGame(firstCaptain, secondCaptain);
}

function playGame(firstCaptain, secondCaptain) {
  const opponentCells = document.querySelectorAll('.enemy-waters .board-cell');
  const prompt = document.querySelector('.prompt');
  const playerName = firstCaptain.name;
  let awaitedTurn = true;

  prompt.textContent = `Awaiting yer orders, Admiral ${playerName}!`;
  opponentCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      if (awaitedTurn === false) return;
      const cellX = Number(cell.getAttribute('data-x'));
      const cellY = Number(cell.getAttribute('data-y'));
      const boardCell = { cellX, cellY };

      if (!playerAttack(firstCaptain, secondCaptain, boardCell)) {
        return;
      }
      awaitedTurn = false;

      setTimeout(() => {
        if (!opponentAttack(secondCaptain, firstCaptain))
          opponentAttack(secondCaptain, firstCaptain);
        awaitedTurn = true;
      }, 500);
    });
  });
}

function playerAttack(firstCaptain, opponent, cell) {
  const prompt = document.querySelector('.prompt');
  const opponentBoardObj = opponent.playerBoard;
  const opponentName = opponent.name
  const name = firstCaptain.name

  const attack = opponentBoardObj.receiveAttack(cell.cellX, cell.cellY);
  const domCell = (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.findDomCellAtCoordinates)(cell.cellX, cell.cellY, 'enemy');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    gameOver(name);
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.textContent = `You fire a shot in enemy waters ... and hit!`;
      domCell.classList.add('hit');
    }
    // attack returns the boat object in case of sunk
    if (typeof attack === 'object') {
      const shipLength = attack.length;
      const shipName = getShipName(shipLength);
      prompt.textContent = `You managed to sink ${opponentName}'s ${shipName} fleet. Good job!`;
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.markSunkShip)(shipLength, 'opponent')
    }
    if (attack === 'miss') {
      prompt.textContent = `You fire a shot in enemy waters ... and miss!`;
      domCell.classList.add('miss');
    }
  }

  return { attack, cell };
}

function opponentAttack(attacker, opponent) {
  const prompt = document.querySelector('.prompt');
  const opponentBoardObj = opponent.playerBoard;
  const name = attacker.name;
  const opponentName = opponent.name

  const randCell = generateRandomAttack();
  const attack = opponentBoardObj.receiveAttack(randCell.x, randCell.y);
  const domCell = (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.findDomCellAtCoordinates)(randCell.x, randCell.y, 'player');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    gameOver(opponentName);
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.textContent = `${name} shoots a fire in your waters ... and hits!`;
      domCell.classList.add('hit');
    }
    // attack returns the boat object in case of sunk
    if (typeof attack === 'object') {
      const shipLength = attack.length;
      const shipName = getShipName(shipLength);
      prompt.textContent = `Oh no, your ${shipName} fleet has been sunk!`;
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.markSunkShip)(shipLength, 'player');
    }
    if (attack === 'miss') {
      prompt.textContent = `${name} shoots a fire in your waters ... and misses!`;
      domCell.classList.add('miss');
    }
  }
  return { attack, randCell };
}

function getShipName(length) {
  switch (length) {
    case 1:
      return 'Sloop';
    case 2:
      return 'Schooner';
    case 3:
      return 'Brigantine';
    case 4:
      return 'Frigate';
    case 5:
      return 'Galleon';
  }
}

function generateRandomAttack() {
  const x = Math.floor(Math.random() * 10) + 1;
  const y = Math.floor(Math.random() * 10) + 1;

  return { x, y };
}

function gameOver(winner) {
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.switchSection)('game-over');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)();

  const winnerDom = document.querySelector('.game-over .winner');
  const playAgainButton = document.querySelector('.game-over button')
  winnerDom.textContent = winner;

  playAgainButton.addEventListener('click', startGame)
}

startGame();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGFBQWEsS0FBSyxVQUFVO0FBQzlFLE1BQU0sOERBQVk7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsMEVBQXdCOztBQUUxQztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQSw4QkFBOEIsTUFBTTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsVUFBVTtBQUNwRCxNQUFNLDhEQUFZO0FBQ2xCO0FBQ0E7QUFDQSw4QkFBOEIsTUFBTTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOztBQUVBO0FBQ0EsRUFBRSwrREFBYTtBQUNmLEVBQUUsc0VBQW9COztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9kb20vZG9tLW1ldGhvZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvY2VsbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9nYW1lLWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5R2FtZUJvYXJkKGJvYXJkLCBkb21FbGVtZW50KSB7XG4gIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgIGZvciAobGV0IGNlbGxBcnIgb2Ygcm93KSB7XG4gICAgICBjb25zdCBjZWxsID0gY2VsbEFyclswXTtcbiAgICAgIGNvbnN0IGNlbGxEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNlbGxEb20uY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIGNlbGwueCk7XG4gICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgY2VsbC55KTtcbiAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBjZWxsLmhlbGRTaGlwLmxlbmd0aDtcbiAgICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsIHNoaXBMZW5ndGgpO1xuICAgICAgfVxuICAgICAgZG9tRWxlbWVudC5hcHBlbmRDaGlsZChjZWxsRG9tKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2hpcERldGFpbHMoc2hpcFR5cGUpIHtcbiAgY29uc3Qgc2hpcHMgPSB7XG4gICAgR2FsbGVvbjogNSxcbiAgICBGcmlnYXRlOiA0LFxuICAgIEJyaWdhbnRpbmU6IDMsXG4gICAgU2Nob29uZXI6IDIsXG4gICAgU2xvb3A6IDEsXG4gIH07XG4gIGxldCBzaGlwO1xuICBsZXQgbGVuZ3RoO1xuXG4gIHN3aXRjaCAoc2hpcFR5cGUpIHtcbiAgICBjYXNlICdHYWxsZW9uJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbMF07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ZyaWdhdGUnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVsxXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQnJpZ2FudGluZSc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzJdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTY2hvb25lcic6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzNdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTbG9vcCc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzRdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4geyBzaGlwLCBsZW5ndGggfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVHlwZSwgYXhpcywgY2VsbCwgYm9hcmQpIHtcbiAgY29uc3Qgc2hpcERhdGEgPSBnZXRTaGlwRGV0YWlscyhzaGlwVHlwZSk7XG4gIGNvbnN0IHNoaXBTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdG8tcGxhY2UgLnNoaXAnKTtcbiAgc2hpcFNwYW4udGV4dENvbnRlbnQgPSBzaGlwRGF0YS5zaGlwO1xuICBjb25zdCBsZW5ndGggPSBzaGlwRGF0YS5sZW5ndGg7XG5cbiAgY29uc3Qgc2hpcEhlYWQgPSBbY2VsbC54LCBjZWxsLnldO1xuICBsZXQgc2hpcFRhaWxYO1xuICBsZXQgc2hpcFRhaWxZO1xuXG4gIGlmIChheGlzID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBzaGlwVGFpbFggPSBzaGlwSGVhZFswXSArIGxlbmd0aCAtIDE7XG4gICAgc2hpcFRhaWxZID0gc2hpcEhlYWRbMV07XG4gIH0gZWxzZSBpZiAoYXhpcyA9PT0gJ3ZlcnRpY2FsJykge1xuICAgIHNoaXBUYWlsWCA9IHNoaXBIZWFkWzBdO1xuICAgIHNoaXBUYWlsWSA9IHNoaXBIZWFkWzFdICsgbGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGNvbnN0IHNoaXBUYWlsID0gW3NoaXBUYWlsWCwgc2hpcFRhaWxZXTtcbiAgY29uc3QgcmVzdFNoaXBDZWxscyA9IFtdO1xuICBjb25zdCBzaGlwSGVhZERvbSA9IFtmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoLi4uc2hpcEhlYWQpXTtcbiAgY29uc3Qgc2hpcFRhaWxEb20gPSBbZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKC4uLnNoaXBUYWlsKV07XG4gIGNvbnN0IHJlc3RTaGlwRG9tID0gW107XG4gIGNvbnN0IGNlbGxzT2JqID0gYm9hcmQuZmluZE1pc3NpbmdCb2F0Q2VsbHMoc2hpcEhlYWQsIGxlbmd0aCwgYXhpcyk7XG4gIGNvbnN0IG1pc3NpbmdDZWxscyA9IGNlbGxzT2JqLm1pZGRsZUNlbGxzO1xuICByZXN0U2hpcENlbGxzLnB1c2goLi4ubWlzc2luZ0NlbGxzKTtcblxuICBpZiAoIWJvYXJkLmNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KHNoaXBIZWFkLCBzaGlwVGFpbCwgcmVzdFNoaXBDZWxscykpIHtcbiAgICBtYXJrSW52YWxpZFNoaXBMb2NhdGlvbihzaGlwSGVhZERvbVswXSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJlc3RTaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgaWYgKGNlbGwgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgcmVzdFNoaXBEb20ucHVzaChmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoY2VsbC54LCBjZWxsLnkpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbERvbVNoaXBDZWxscyA9IHNoaXBIZWFkRG9tLmNvbmNhdChzaGlwVGFpbERvbSkuY29uY2F0KHJlc3RTaGlwRG9tKTtcbiAgICBtYXJrQXR0ZW1wdFRvUGxhY2VTaGlwKGFsbERvbVNoaXBDZWxscyk7XG5cbiAgICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWwsIGFsbERvbVNoaXBDZWxscyB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtJbnZhbGlkU2hpcExvY2F0aW9uKGNlbGwpIHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkLWxvY2F0aW9uJyk7XG4gIGNsZWFyRG9tQ2VsbEludmFsaWRpdHkoY2VsbCk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBdHRlbXB0VG9QbGFjZVNoaXAoY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnYXR0ZW1wdC1wbGFjZS1zaGlwJyk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoU2VjdGlvbihzZWN0aW9uKSB7XG4gIGNvbnN0IGxhbmRpbmdTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhbmRpbmcnKTtcbiAgY29uc3Qgc2hpcFBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCcpO1xuICBjb25zdCBiYXR0bGVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZS1zZWN0aW9uJyk7XG4gIGNvbnN0IGdhbWVPdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtb3ZlcicpO1xuXG4gIGlmIChzZWN0aW9uID09PSAnbGFuZGluZycpIHtcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIHNoaXBQbGFjZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBiYXR0bGVTZWN0aW9uLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgZ2FtZU92ZXIuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGZsZXgnO1xuICB9XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdzaGlwLXBsYWNlbWVudCcpIHtcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIHNoaXBQbGFjZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4JztcbiAgfVxuXG4gIGlmIChzZWN0aW9uID09PSAnYmF0dGxlLXNlY3Rpb24nKSB7XG4gICAgbGFuZGluZ1NlY3Rpb24uc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBzaGlwUGxhY2VtZW50LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgYmF0dGxlU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGZsZXgnO1xuICB9XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdnYW1lLW92ZXInKSB7XG4gICAgbGFuZGluZ1NlY3Rpb24uc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBzaGlwUGxhY2VtZW50LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgYmF0dGxlU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIGdhbWVPdmVyLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleCc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zaXRpb25CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzaGlwUGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50Jyk7XG4gIGNvbnN0IGJhdHRsZVNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmF0dGxlLXNlY3Rpb24nKTtcbiAgc2hpcFBsYWNlbWVudC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kLXN3YXAnKTtcbiAgYmF0dGxlU2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kLXN3YXAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYWNlU2hpcERvbShjZWxscykge1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcGxhY2VkJykpO1xufVxuXG5mdW5jdGlvbiBjbGVhckRvbUNlbGxJbnZhbGlkaXR5KGNlbGwpIHtcbiAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZC1sb2NhdGlvbicpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSB7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYXR0ZW1wdC1wbGFjZS1zaGlwJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKHgsIHksIHBsYXllcikge1xuICBsZXQgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICBsZXQgc2VhcmNoZWRDZWxsO1xuICBpZiAocGxheWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAocGxheWVyID09PSAncGxheWVyJykge1xuICAgICAgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gICAgfSBlbHNlIGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFpLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIH1cblxuICBjZWxsc0RvbS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgY2VsbFggPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS14Jyk7XG4gICAgY29uc3QgY2VsbFkgPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgaWYgKE51bWJlcihjZWxsWCkgPT09IHggJiYgTnVtYmVyKGNlbGxZKSA9PT0geSkgc2VhcmNoZWRDZWxsID0gY2VsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIHNlYXJjaGVkQ2VsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcmtTdW5rU2hpcChzaGlwTGVuZ3RoLCBwbGF5ZXIpIHtcbiAgbGV0IGNlbGxzRG9tO1xuXG4gIGlmIChwbGF5ZXIgPT09ICdwbGF5ZXInKSB7XG4gICAgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIH0gZWxzZSBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuXG4gIGNlbGxzRG9tLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCBzaGlwRG9tID0gTnVtYmVyKGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnKSk7XG4gICAgaWYgKHNoaXBEb20gPT09IHNoaXBMZW5ndGgpIGNlbGwuY2xhc3NMaXN0LmFkZCgnc3VuaycpO1xuICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBDZWxsKHgsIHkpIHtcbiAgbGV0IGhlbGRTaGlwID0gbnVsbDtcbiAgbGV0IGlzSGl0ID0gZmFsc2U7XG5cbiAgcmV0dXJuIHsgeCwgeSwgaGVsZFNoaXAsIGlzSGl0IH07XG59XG4iLCJpbXBvcnQgeyBTaGlwIH0gZnJvbSAnLi9zaGlwJztcbmltcG9ydCB7IENlbGwgfSBmcm9tICcuL2NlbGwnO1xuXG5leHBvcnQgY29uc3QgR2FtZUJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHMgPSAxMDtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgbGV0IGhpdHMgPSBbXTtcbiAgbGV0IG1pc3NlcyA9IFtdO1xuICBnZW5lcmF0ZUJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVCb2FyZCgpIHtcbiAgICBmb3IgKGxldCBpID0gcm93czsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3Qgcm93ID0gW107XG4gICAgICBib2FyZC5wdXNoKHJvdyk7XG4gICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBjb2xzOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sID0gW0NlbGwoaiwgaSldO1xuICAgICAgICByb3cucHVzaChjb2wpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJldHVybkJvYXJkID0gKCkgPT4gYm9hcmQ7XG5cbiAgY29uc3QgZmluZENlbGxBdENvb3JkaW5hdGVzID0gKHgsIHkpID0+IHtcbiAgICBmb3IgKGxldCByb3cgb2YgYm9hcmQpIHtcbiAgICAgIGZvciAobGV0IGJvYXJkQ2VsbCBvZiByb3cpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGJvYXJkQ2VsbFswXTtcbiAgICAgICAgaWYgKHggPT09IGNlbGwueCAmJiB5ID09PSBjZWxsLnkpIHJldHVybiBjZWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAoaGVhZCwgdGFpbCkgPT4ge1xuICAgIGlmICghKGhlYWQgaW5zdGFuY2VvZiBBcnJheSkgfHwgISh0YWlsIGluc3RhbmNlb2YgQXJyYXkpKVxuICAgICAgdGhyb3cgRXJyb3IoJ2hlYWQgYW5kIHRhaWwgbXVzdCBiZSBhcnJheXMgcmVwcmVzZW50aW5nIGNvb3JkaW5hdGVzIScpO1xuXG4gICAgbGV0IHNoaXA7XG4gICAgY29uc3Qgc2hpcENlbGxzID0gW107XG4gICAgbGV0IGRpcmVjdGlvbiA9ICdpbnZhbGlkJztcbiAgICBsZXQgc2hpcExlbmd0aDtcblxuICAgIGlmIChoZWFkWzBdID09PSB0YWlsWzBdICYmIGhlYWRbMV0gPT09IHRhaWxbMV0pIGRpcmVjdGlvbiA9ICdzaW5nbGUtY2VsbCc7XG4gICAgZWxzZSBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSkgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICBlbHNlIGlmIChoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBjb25zdCBoZWFkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhoZWFkWzBdLCBoZWFkWzFdKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh0YWlsWzBdLCB0YWlsWzFdKTtcbiAgICBzaGlwQ2VsbHMucHVzaChoZWFkQ2VsbCk7XG4gICAgc2hpcENlbGxzLnB1c2godGFpbENlbGwpO1xuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2ludmFsaWQnIHx8ICFjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eShoZWFkLCB0YWlsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnc2luZ2xlLWNlbGwnKSB7XG4gICAgICBzaGlwID0gU2hpcCgxKTtcbiAgICAgIC8vIGNhc2Ugb2Ygc2luZ2xlLWNlbGwgYm9hdCwgcmVtb3ZlIHRoZSBkb3VibGUgY29vcmRpbmF0ZSBmcm9tIGFyclxuICAgICAgc2hpcENlbGxzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc2hpcExlbmd0aCA9IE1hdGguYWJzKGhlYWRbMF0gLSB0YWlsWzBdKSArIDE7XG4gICAgICBzaGlwID0gU2hpcChzaGlwTGVuZ3RoKTtcbiAgICAgIGNvbnN0IGNlbGxzT2JqID0gZmluZE1pc3NpbmdCb2F0Q2VsbHMoaGVhZCwgc2hpcExlbmd0aCwgJ2hvcml6b250YWwnKTtcbiAgICAgIGNvbnN0IG1pZGRsZUNlbGxzID0gY2VsbHNPYmoubWlkZGxlQ2VsbHM7XG4gICAgICBzaGlwQ2VsbHMucHVzaCguLi5taWRkbGVDZWxscyk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHNoaXBMZW5ndGggPSBNYXRoLmFicyhoZWFkWzFdIC0gdGFpbFsxXSkgKyAxO1xuICAgICAgc2hpcCA9IFNoaXAoc2hpcExlbmd0aCk7XG4gICAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsICd2ZXJ0aWNhbCcpO1xuICAgICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAgIHNoaXBDZWxscy5wdXNoKC4uLm1pZGRsZUNlbGxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAvLyBpZiB2YWxpZCBjb29yZHMsIGFkZCB0aGUgc2hpcCBib3RoIHRvIHRoZSBib2FyZCBhbmQgdGhlIHNoaXAgYXJyYXlcbiAgICBpZiAoY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoaGVhZCwgdGFpbCwgbWlkZGxlQ2VsbHMpKSB7XG4gICAgICBzaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gKGNlbGwuaGVsZFNoaXAgPSBzaGlwKSk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgY2VsbE51bWJlck5vdEZvdW5kID0gbGVuZ3RoIC0gMTtcbiAgICBjb25zdCByZXN0T2ZDZWxscyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY2VsbE51bWJlck5vdEZvdW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgZml4ZWRDb29yZCA9IGhlYWRbMV07XG4gICAgICAgIGNvbnN0IHZhckNvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh2YXJDb29yZCArIGksIGZpeGVkQ29vcmQpO1xuICAgICAgICByZXN0T2ZDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgdmFyQ29vcmQgPSBoZWFkWzFdO1xuICAgICAgICBjb25zdCBjZWxsSW5CZXR3ZWVuID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGZpeGVkQ29vcmQsIHZhckNvb3JkICsgaSk7XG4gICAgICAgIHJlc3RPZkNlbGxzLnB1c2goY2VsbEluQmV0d2Vlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSByZXN0T2ZDZWxscy5zbGljZSgwLCByZXN0T2ZDZWxscy5sZW5ndGggLSAxKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IHJlc3RPZkNlbGxzW3Jlc3RPZkNlbGxzLmxlbmd0aCAtIDFdO1xuXG4gICAgcmV0dXJuIHsgbWlkZGxlQ2VsbHMsIHRhaWxDZWxsIH07XG4gIH1cblxuICBjb25zdCBjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eSA9IChoZWFkLCB0YWlsLCBtaXNzaW5nQ2VsbHMpID0+IHtcbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuXG4gICAgaWYgKFxuICAgICAgaGVhZFswXSA8IDEgfHxcbiAgICAgIGhlYWRbMF0gPiAxMCB8fFxuICAgICAgaGVhZFsxXSA8IDEgfHxcbiAgICAgIGhlYWRbMV0gPiAxMCB8fFxuICAgICAgdGFpbFswXSA8IDEgfHxcbiAgICAgIHRhaWxbMF0gPiAxMCB8fFxuICAgICAgdGFpbFsxXSA8IDEgfHxcbiAgICAgIHRhaWxbMV0gPiAxMFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobWlzc2luZ0NlbGxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgaGVhZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoaGVhZFswXSwgaGVhZFsxXSk7XG4gICAgICAgIGNvbnN0IHRhaWxDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHRhaWxbMF0sIHRhaWxbMV0pO1xuICAgICAgICBjb25zdCBhbGxCb2F0Q2VsbHMgPSBbaGVhZENlbGwsIHRhaWxDZWxsXS5jb25jYXQobWlzc2luZ0NlbGxzKTtcblxuICAgICAgICBhbGxCb2F0Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoeCwgeSkgPT4ge1xuICAgIGlmIChjaGVja0F0dGFja1ZhbGlkaXR5KHgsIHkpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2tlZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoeCwgeSk7XG4gICAgYXR0YWNrZWRDZWxsLmlzSGl0ID0gdHJ1ZTtcblxuICAgIGlmIChhdHRhY2tlZENlbGwuaGVsZFNoaXAgIT09IG51bGwpIHtcbiAgICAgIGhpdHMucHVzaCh7IHgsIHkgfSk7XG4gICAgICBhdHRhY2tlZENlbGwuaGVsZFNoaXAuZ2V0SGl0KCk7XG4gICAgICBpZiAoY2hlY2tHYW1lT3ZlcigpKSByZXR1cm4gJ2dhbWUtb3Zlcic7XG4gICAgICAvLyBpZiB0aGUgc2hpcCBoYXMgYmVlbiBzdW5rLCByZXR1cm4gdGhlIHNoaXBcbiAgICAgIGlmIChhdHRhY2tlZENlbGwuaGVsZFNoaXAuY2hlY2tJZlN1bmsoKSkgcmV0dXJuIGF0dGFja2VkQ2VsbC5oZWxkU2hpcDtcbiAgICAgIHJldHVybiAnaGl0JztcbiAgICB9IGVsc2Uge1xuICAgICAgbWlzc2VzLnB1c2goeyB4LCB5IH0pO1xuICAgICAgcmV0dXJuICdtaXNzJztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tBdHRhY2tWYWxpZGl0eSA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKHggPCAxIHx8IHggPiAxMCB8fCB5IDwgMSB8fCB5ID4gMTApIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGFsbEF0dGFja3MgPSBoaXRzLmNvbmNhdChtaXNzZXMpO1xuICAgIGZvciAobGV0IGF0dGFjayBvZiBhbGxBdHRhY2tzKSB7XG4gICAgICBpZiAoYXR0YWNrLnggPT09IHggJiYgYXR0YWNrLnkgPT09IHkpIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBjaGVja0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNlbGxOdW1iZXJIb2xkaW5nQm9hdHMgPSBzaGlwcy5yZWR1Y2UoXG4gICAgICAodG90YWwsIHNoaXApID0+ICh0b3RhbCArPSBzaGlwLmxlbmd0aCksXG4gICAgICAwXG4gICAgKTtcblxuICAgIGNvbnNvbGUubG9nKGhpdHMubGVuZ3RoLCBjZWxsTnVtYmVySG9sZGluZ0JvYXRzKVxuXG4gICAgaWYgKGhpdHMubGVuZ3RoID09PSBjZWxsTnVtYmVySG9sZGluZ0JvYXRzKSByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIHJldHVybkJvYXJkLFxuICAgIGZpbmRDZWxsQXRDb29yZGluYXRlcyxcbiAgICBjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eSxcbiAgICBmaW5kTWlzc2luZ0JvYXRDZWxscyxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBHYW1lQm9hcmQgfSBmcm9tIFwiLi9nYW1lLWJvYXJkXCI7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuXG4gIHJldHVybiB7IHBsYXllckJvYXJkLCBuYW1lIH07XG59O1xuIiwiZXhwb3J0IGNvbnN0IFNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGxldCBoaXRzID0gMDtcblxuICBjb25zdCBnZXRIaXQgPSAoKSA9PiB7XG4gICAgaGl0cysrO1xuICB9XG5cbiAgY29uc3QgY2hlY2tJZlN1bmsgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMgPT09IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geyBsZW5ndGgsIGdldEhpdCwgY2hlY2tJZlN1bmt9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9tb2RlbHMvcGxheWVyJztcbmltcG9ydCB7XG4gIGRpc3BsYXlHYW1lQm9hcmQsXG4gIHN3aXRjaFNlY3Rpb24sXG4gIHRyYW5zaXRpb25CYWNrZ3JvdW5kLFxuICBhdHRlbXB0U2hpcFBsYWNlbWVudERvbSxcbiAgcGxhY2VTaGlwRG9tLFxuICBmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMsXG4gIG1hcmtTdW5rU2hpcFxufSBmcm9tICcuL2RvbS9kb20tbWV0aG9kcyc7XG5cbmNvbnN0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgY29uc3Qgc3RhcnRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtc3RhcnQnKTtcbiAgdHJhbnNpdGlvbkJhY2tncm91bmQoJ2xhbmRpbmcnKVxuXG4gIHN0YXJ0Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBzZWNvbmRDYXB0YWluID0gaGFuZGxlQUlTaGlwUGxhY2VtZW50KCk7XG4gICAgcnVuU2hpcFBsYWNlbWVudFNlY3Rpb24oKGZpcnN0Q2FwdGFpbikgPT4ge1xuICAgICAgcnVuQmF0dGxlU2VjdGlvbihmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIHJ1blNoaXBQbGFjZW1lbnRTZWN0aW9uKGNhbGxiYWNrKSB7XG4gIHN3aXRjaFNlY3Rpb24oJ3NoaXAtcGxhY2VtZW50Jyk7XG4gIHRyYW5zaXRpb25CYWNrZ3JvdW5kKCk7XG5cbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtc3RhcnQgaW5wdXQnKTtcbiAgY29uc3QgbmFtZVNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC10by1wbGFjZSAucGxheWVyLW5hbWUnKTtcbiAgY29uc3QgZ2FtZUJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IC5nYW1lLWJvYXJkJyk7XG4gIGNvbnN0IHNoaXBzID0gWydHYWxsZW9uJywgJ0ZyaWdhdGUnLCAnQnJpZ2FudGluZScsICdTY2hvb25lcicsICdTbG9vcCddO1xuXG4gIG5hbWVTcGFuLnRleHRDb250ZW50ID0gbmFtZUlucHV0LnZhbHVlO1xuICBjb25zdCBmaXJzdENhcHRhaW4gPSBQbGF5ZXIobmFtZUlucHV0LnZhbHVlKTtcbiAgY29uc3QgYm9hcmRPYmogPSBmaXJzdENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGNvbnN0IGJvYXJkID0gYm9hcmRPYmoucmV0dXJuQm9hcmQoKTtcblxuICBkaXNwbGF5R2FtZUJvYXJkKGJvYXJkLCBnYW1lQm9hcmREb20pO1xuICBoYW5kbGVDZWxsRXZlbnRzKGZpcnN0Q2FwdGFpbiwgc2hpcHMsIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2VsbEV2ZW50cyhmaXJzdENhcHRhaW4sIHNoaXBzLCBjYWxsYmFjaykge1xuICBjb25zdCBheGlzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IGJ1dHRvbicpO1xuICBjb25zdCBheGlzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IC5heGlzJyk7XG4gIGNvbnN0IGJvYXJkT2JqID0gZmlyc3RDYXB0YWluLnBsYXllckJvYXJkO1xuICBsZXQgYXhpcyA9ICdob3Jpem9udGFsJztcblxuICBheGlzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChheGlzID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF4aXNEb20udGV4dENvbnRlbnQgPSAnVmVydGljYWwnO1xuICAgICAgYXhpcyA9ICd2ZXJ0aWNhbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF4aXNEb20udGV4dENvbnRlbnQgPSAnSG9yaXpvbnRhbCc7XG4gICAgICBheGlzID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICBsZXQgc2hpcHNQbGFjZWRJZHggPSAwO1xuXG4gIGNlbGxzRG9tLmZvckVhY2goKGRvbUNlbGwpID0+IHtcbiAgICBsZXQgY2VsbFg7XG4gICAgbGV0IGNlbGxZO1xuICAgIGNlbGxYID0gZG9tQ2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgIGNlbGxZID0gZG9tQ2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGJvYXJkT2JqLmZpbmRDZWxsQXRDb29yZGluYXRlcyhcbiAgICAgIE51bWJlcihjZWxsWCksXG4gICAgICBOdW1iZXIoY2VsbFkpXG4gICAgKTtcblxuICAgIGRvbUNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIGlmIChzaGlwc1BsYWNlZElkeCA+IDQpIHJldHVybjtcbiAgICAgIGNvbnN0IHNoaXBUb1BsYWNlID0gc2hpcHNbc2hpcHNQbGFjZWRJZHhdO1xuICAgICAgYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oc2hpcFRvUGxhY2UsIGF4aXMsIGJvYXJkQ2VsbCwgYm9hcmRPYmopO1xuICAgIH0pO1xuXG4gICAgZG9tQ2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNoaXBUb1BsYWNlID0gc2hpcHNbc2hpcHNQbGFjZWRJZHhdO1xuICAgICAgaWYgKGhhbmRsZVNoaXBQbGFjZW1lbnQoc2hpcFRvUGxhY2UsIGJvYXJkQ2VsbCwgYm9hcmRPYmosIGF4aXMpKSB7XG4gICAgICAgIHNoaXBzUGxhY2VkSWR4Kys7XG4gICAgICAgIGlmIChzaGlwc1BsYWNlZElkeCA9PT0gNSkgcmV0dXJuIGNhbGxiYWNrKGZpcnN0Q2FwdGFpbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTaGlwUGxhY2VtZW50KHNoaXBUb1BsYWNlLCBib2FyZENlbGwsIGJvYXJkLCBheGlzKSB7XG4gIGNvbnN0IHNoaXBEYXRhID0gYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oc2hpcFRvUGxhY2UsIGF4aXMsIGJvYXJkQ2VsbCwgYm9hcmQpO1xuICBpZiAoc2hpcERhdGEpIHtcbiAgICBpZiAoYm9hcmQucGxhY2VTaGlwKHNoaXBEYXRhLnNoaXBIZWFkLCBzaGlwRGF0YS5zaGlwVGFpbCkpIHtcbiAgICAgIHBsYWNlU2hpcERvbShzaGlwRGF0YS5hbGxEb21TaGlwQ2VsbHMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUFJU2hpcFBsYWNlbWVudCgpIHtcbiAgY29uc3Qgc2Vjb25kQ2FwdGFpbiA9IFBsYXllcignY2hhdC1HUFQnKTtcbiAgY29uc3QgYm9hcmQgPSBzZWNvbmRDYXB0YWluLnBsYXllckJvYXJkO1xuICBsZXQgc2hpcHNQbGFjZWQgPSAxO1xuXG4gIHdoaWxlIChzaGlwc1BsYWNlZCA8IDYpIHtcbiAgICBjb25zdCBzaGlwQ29vcmRzID0gZ2VuZXJhdGVWYWxpZFJhbmRvbVNoaXBDb29yZHMoc2hpcHNQbGFjZWQsIGJvYXJkKTtcbiAgICBpZiAoYm9hcmQucGxhY2VTaGlwKHNoaXBDb29yZHMuc2hpcEhlYWQsIHNoaXBDb29yZHMuc2hpcFRhaWwpKSB7XG4gICAgICBzaGlwc1BsYWNlZCsrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzZWNvbmRDYXB0YWluO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVNoaXBDb29yZHMobGVuZ3RoLCBib2FyZCkge1xuICBjb25zdCBzaGlwSGVhZCA9IFtcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxLFxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEsXG4gIF07XG4gIGxldCBkaXJlY3Rpb247XG5cbiAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjUpIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgZWxzZSBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuXG4gIGNvbnN0IGNlbGxzT2JqID0gYm9hcmQuZmluZE1pc3NpbmdCb2F0Q2VsbHMoc2hpcEhlYWQsIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgY29uc3Qgc2hpcFRhaWxPYmogPSBjZWxsc09iai50YWlsQ2VsbDtcblxuICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWxPYmogfTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVWYWxpZFJhbmRvbVNoaXBDb29yZHMobGVuZ3RoLCBib2FyZCkge1xuICBsZXQgdmFsaWRTaGlwQ29vcmRGb3VuZCA9IGZhbHNlO1xuICBsZXQgc2hpcEhlYWQ7XG4gIGxldCBzaGlwVGFpbDtcblxuICB3aGlsZSAoIXZhbGlkU2hpcENvb3JkRm91bmQpIHtcbiAgICBjb25zdCBjb29yZE9iaiA9IGdlbmVyYXRlUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKTtcbiAgICBjb25zdCB0YWlsT2JqID0gY29vcmRPYmouc2hpcFRhaWxPYmo7XG4gICAgbGV0IHNoaXBIZWFkQXR0ZW1wdCA9IGNvb3JkT2JqLnNoaXBIZWFkO1xuICAgIGxldCBzaGlwVGFpbEF0dGVtcHQgPSBbdGFpbE9iaj8ueCwgdGFpbE9iaj8ueV07XG4gICAgLy8gaWYgbGVuZ3RoIGlzIDEsIHdlIGRvbid0IG5lZWQgdG8gZmluZCB0YWlsIGNvb3Jkc1xuICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgIHZhbGlkU2hpcENvb3JkRm91bmQgPSB0cnVlO1xuICAgICAgc2hpcFRhaWwgPSBzaGlwSGVhZEF0dGVtcHQ7XG4gICAgICBzaGlwSGVhZCA9IHNoaXBIZWFkQXR0ZW1wdDtcbiAgICB9XG4gICAgaWYgKHNoaXBUYWlsQXR0ZW1wdFswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWxpZFNoaXBDb29yZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHNoaXBIZWFkID0gc2hpcEhlYWRBdHRlbXB0O1xuICAgICAgc2hpcFRhaWwgPSBzaGlwVGFpbEF0dGVtcHQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgc2hpcEhlYWQsIHNoaXBUYWlsIH07XG59XG5cbmZ1bmN0aW9uIHJ1bkJhdHRsZVNlY3Rpb24oZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluKSB7XG4gIHN3aXRjaFNlY3Rpb24oJ2JhdHRsZS1zZWN0aW9uJyk7XG4gIHRyYW5zaXRpb25CYWNrZ3JvdW5kKCk7XG4gIGNvbnN0IHBsYXllckJvYXJkT2JqID0gZmlyc3RDYXB0YWluLnBsYXllckJvYXJkO1xuICBjb25zdCBvcHBvbmVudEJvYXJkT2JqID0gc2Vjb25kQ2FwdGFpbi5wbGF5ZXJCb2FyZDtcblxuICBjb25zdCBwbGF5ZXJCb2FyZCA9IHBsYXllckJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmQgPSBvcHBvbmVudEJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG4gIGNvbnN0IHBsYXllckJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1ib2FyZCcpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFpLWJvYXJkJyk7XG5cbiAgZGlzcGxheUdhbWVCb2FyZChwbGF5ZXJCb2FyZCwgcGxheWVyQm9hcmREb20pO1xuICBkaXNwbGF5R2FtZUJvYXJkKG9wcG9uZW50Qm9hcmQsIG9wcG9uZW50Qm9hcmREb20pO1xuXG4gIHBsYXlHYW1lKGZpcnN0Q2FwdGFpbiwgc2Vjb25kQ2FwdGFpbik7XG59XG5cbmZ1bmN0aW9uIHBsYXlHYW1lKGZpcnN0Q2FwdGFpbiwgc2Vjb25kQ2FwdGFpbikge1xuICBjb25zdCBvcHBvbmVudENlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVuZW15LXdhdGVycyAuYm9hcmQtY2VsbCcpO1xuICBjb25zdCBwcm9tcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvbXB0Jyk7XG4gIGNvbnN0IHBsYXllck5hbWUgPSBmaXJzdENhcHRhaW4ubmFtZTtcbiAgbGV0IGF3YWl0ZWRUdXJuID0gdHJ1ZTtcblxuICBwcm9tcHQudGV4dENvbnRlbnQgPSBgQXdhaXRpbmcgeWVyIG9yZGVycywgQWRtaXJhbCAke3BsYXllck5hbWV9IWA7XG4gIG9wcG9uZW50Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoYXdhaXRlZFR1cm4gPT09IGZhbHNlKSByZXR1cm47XG4gICAgICBjb25zdCBjZWxsWCA9IE51bWJlcihjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS14JykpO1xuICAgICAgY29uc3QgY2VsbFkgPSBOdW1iZXIoY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpKTtcbiAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IHsgY2VsbFgsIGNlbGxZIH07XG5cbiAgICAgIGlmICghcGxheWVyQXR0YWNrKGZpcnN0Q2FwdGFpbiwgc2Vjb25kQ2FwdGFpbiwgYm9hcmRDZWxsKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhd2FpdGVkVHVybiA9IGZhbHNlO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKCFvcHBvbmVudEF0dGFjayhzZWNvbmRDYXB0YWluLCBmaXJzdENhcHRhaW4pKVxuICAgICAgICAgIG9wcG9uZW50QXR0YWNrKHNlY29uZENhcHRhaW4sIGZpcnN0Q2FwdGFpbik7XG4gICAgICAgIGF3YWl0ZWRUdXJuID0gdHJ1ZTtcbiAgICAgIH0sIDUwMCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwbGF5ZXJBdHRhY2soZmlyc3RDYXB0YWluLCBvcHBvbmVudCwgY2VsbCkge1xuICBjb25zdCBwcm9tcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvbXB0Jyk7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmRPYmogPSBvcHBvbmVudC5wbGF5ZXJCb2FyZDtcbiAgY29uc3Qgb3Bwb25lbnROYW1lID0gb3Bwb25lbnQubmFtZVxuICBjb25zdCBuYW1lID0gZmlyc3RDYXB0YWluLm5hbWVcblxuICBjb25zdCBhdHRhY2sgPSBvcHBvbmVudEJvYXJkT2JqLnJlY2VpdmVBdHRhY2soY2VsbC5jZWxsWCwgY2VsbC5jZWxsWSk7XG4gIGNvbnN0IGRvbUNlbGwgPSBmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoY2VsbC5jZWxsWCwgY2VsbC5jZWxsWSwgJ2VuZW15Jyk7XG5cbiAgaWYgKGF0dGFjayA9PT0gJ2dhbWUtb3ZlcicpIHtcbiAgICBkb21DZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgIGdhbWVPdmVyKG5hbWUpO1xuICB9IGVsc2UgaWYgKGF0dGFjayA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChhdHRhY2sgPT09ICdoaXQnKSB7XG4gICAgICBwcm9tcHQudGV4dENvbnRlbnQgPSBgWW91IGZpcmUgYSBzaG90IGluIGVuZW15IHdhdGVycyAuLi4gYW5kIGhpdCFgO1xuICAgICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICB9XG4gICAgLy8gYXR0YWNrIHJldHVybnMgdGhlIGJvYXQgb2JqZWN0IGluIGNhc2Ugb2Ygc3Vua1xuICAgIGlmICh0eXBlb2YgYXR0YWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IGF0dGFjay5sZW5ndGg7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IGdldFNoaXBOYW1lKHNoaXBMZW5ndGgpO1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYFlvdSBtYW5hZ2VkIHRvIHNpbmsgJHtvcHBvbmVudE5hbWV9J3MgJHtzaGlwTmFtZX0gZmxlZXQuIEdvb2Qgam9iIWA7XG4gICAgICBtYXJrU3Vua1NoaXAoc2hpcExlbmd0aCwgJ29wcG9uZW50JylcbiAgICB9XG4gICAgaWYgKGF0dGFjayA9PT0gJ21pc3MnKSB7XG4gICAgICBwcm9tcHQudGV4dENvbnRlbnQgPSBgWW91IGZpcmUgYSBzaG90IGluIGVuZW15IHdhdGVycyAuLi4gYW5kIG1pc3MhYDtcbiAgICAgIGRvbUNlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGF0dGFjaywgY2VsbCB9O1xufVxuXG5mdW5jdGlvbiBvcHBvbmVudEF0dGFjayhhdHRhY2tlciwgb3Bwb25lbnQpIHtcbiAgY29uc3QgcHJvbXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb21wdCcpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkT2JqID0gb3Bwb25lbnQucGxheWVyQm9hcmQ7XG4gIGNvbnN0IG5hbWUgPSBhdHRhY2tlci5uYW1lO1xuICBjb25zdCBvcHBvbmVudE5hbWUgPSBvcHBvbmVudC5uYW1lXG5cbiAgY29uc3QgcmFuZENlbGwgPSBnZW5lcmF0ZVJhbmRvbUF0dGFjaygpO1xuICBjb25zdCBhdHRhY2sgPSBvcHBvbmVudEJvYXJkT2JqLnJlY2VpdmVBdHRhY2socmFuZENlbGwueCwgcmFuZENlbGwueSk7XG4gIGNvbnN0IGRvbUNlbGwgPSBmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMocmFuZENlbGwueCwgcmFuZENlbGwueSwgJ3BsYXllcicpO1xuXG4gIGlmIChhdHRhY2sgPT09ICdnYW1lLW92ZXInKSB7XG4gICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICBnYW1lT3ZlcihvcHBvbmVudE5hbWUpO1xuICB9IGVsc2UgaWYgKGF0dGFjayA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChhdHRhY2sgPT09ICdoaXQnKSB7XG4gICAgICBwcm9tcHQudGV4dENvbnRlbnQgPSBgJHtuYW1lfSBzaG9vdHMgYSBmaXJlIGluIHlvdXIgd2F0ZXJzIC4uLiBhbmQgaGl0cyFgO1xuICAgICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICB9XG4gICAgLy8gYXR0YWNrIHJldHVybnMgdGhlIGJvYXQgb2JqZWN0IGluIGNhc2Ugb2Ygc3Vua1xuICAgIGlmICh0eXBlb2YgYXR0YWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IGF0dGFjay5sZW5ndGg7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IGdldFNoaXBOYW1lKHNoaXBMZW5ndGgpO1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYE9oIG5vLCB5b3VyICR7c2hpcE5hbWV9IGZsZWV0IGhhcyBiZWVuIHN1bmshYDtcbiAgICAgIG1hcmtTdW5rU2hpcChzaGlwTGVuZ3RoLCAncGxheWVyJyk7XG4gICAgfVxuICAgIGlmIChhdHRhY2sgPT09ICdtaXNzJykge1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYCR7bmFtZX0gc2hvb3RzIGEgZmlyZSBpbiB5b3VyIHdhdGVycyAuLi4gYW5kIG1pc3NlcyFgO1xuICAgICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IGF0dGFjaywgcmFuZENlbGwgfTtcbn1cblxuZnVuY3Rpb24gZ2V0U2hpcE5hbWUobGVuZ3RoKSB7XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuICdTbG9vcCc7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuICdTY2hvb25lcic7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuICdCcmlnYW50aW5lJztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gJ0ZyaWdhdGUnO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiAnR2FsbGVvbic7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21BdHRhY2soKSB7XG4gIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxO1xuICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMTtcblxuICByZXR1cm4geyB4LCB5IH07XG59XG5cbmZ1bmN0aW9uIGdhbWVPdmVyKHdpbm5lcikge1xuICBzd2l0Y2hTZWN0aW9uKCdnYW1lLW92ZXInKTtcbiAgdHJhbnNpdGlvbkJhY2tncm91bmQoKTtcblxuICBjb25zdCB3aW5uZXJEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1vdmVyIC53aW5uZXInKTtcbiAgY29uc3QgcGxheUFnYWluQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtb3ZlciBidXR0b24nKVxuICB3aW5uZXJEb20udGV4dENvbnRlbnQgPSB3aW5uZXI7XG5cbiAgcGxheUFnYWluQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3RhcnRHYW1lKVxufVxuXG5zdGFydEdhbWUoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=