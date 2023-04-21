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

  if (section === 'ship-placement') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: flex';
  }

  if (section === 'battle-section') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: none';
    battleSection.style.cssText = 'display: flex';
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
      // if the ship has been sunk, return the ship
      if (attackedCell.heldShip.checkIfSunk()) return attackedCell.heldShip;
      if (checkGameOver()) return 'game-over';
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

  function getHit() {
    this.hits++;
  }

  function checkIfSunk() {
    console.log(this.length, this.hits)
    if (this.hits === this.length) return true;
    else return false;
  }

  return { length, getHit, checkIfSunk, hits};
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



const startGame = (() => {
  const startForm = document.querySelector('.game-start');

  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const secondCaptain = handleAIShipPlacement();
    runShipPlacementSection((firstCaptain) => {
      runBattleSection(firstCaptain, secondCaptain);
    });
  });
})();

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
      }, 2000);
    });
  });
}

function playerAttack(attacker, opponent, cell) {
  const prompt = document.querySelector('.prompt');
  const opponentBoardObj = opponent.playerBoard;

  const attack = opponentBoardObj.receiveAttack(cell.cellX, cell.cellY);
  const domCell = (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.findDomCellAtCoordinates)(cell.cellX, cell.cellY, 'enemy');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    gameOver();
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.textContent = `You fire a shot in enemy waters ... and hit!`;
      domCell.classList.add('hit');
    }
    // attack returns the boat object in case of sunk
    if (typeof attack === 'object') {
      // WRITE HERE
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

  const randCell = generateRandomAttack();
  const attack = opponentBoardObj.receiveAttack(randCell.x, randCell.y);
  const domCell = (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.findDomCellAtCoordinates)(randCell.x, randCell.y, 'player');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    gameOver();
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.textContent = `${name} shoots a fire in your waters ... and hits!`;
      domCell.classList.add('hit');
    }
    // attack returns the boat object in case of sunk
    if (typeof attack === 'object') {
      // WRITE HERE
    }
    if (attack === 'miss') {
      prompt.textContent = `${name} shoots a fire in your waters ... and misses!`;
      domCell.classList.add('miss');
    }
  }
  return { attack, randCell };
}

function generateRandomAttack() {
  const x = Math.floor(Math.random() * 10) + 1;
  const y = Math.floor(Math.random() * 10) + 1;

  return { x, y };
}

function gameOver() {
  console.log('Game Over');
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsOEJBQThCLE1BQU07QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsTUFBTTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL2RvbS9kb20tbWV0aG9kcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9jZWxsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL2dhbWUtYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlHYW1lQm9hcmQoYm9hcmQsIGRvbUVsZW1lbnQpIHtcbiAgZm9yIChsZXQgcm93IG9mIGJvYXJkKSB7XG4gICAgZm9yIChsZXQgY2VsbEFyciBvZiByb3cpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBjZWxsQXJyWzBdO1xuICAgICAgY29uc3QgY2VsbERvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2VsbERvbS5jbGFzc0xpc3QuYWRkKCdib2FyZC1jZWxsJyk7XG4gICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS14JywgY2VsbC54KTtcbiAgICAgIGNlbGxEb20uc2V0QXR0cmlidXRlKCdkYXRhLXknLCBjZWxsLnkpO1xuICAgICAgaWYgKGNlbGwuaGVsZFNoaXAgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IGNlbGwuaGVsZFNoaXAubGVuZ3RoO1xuICAgICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJywgc2hpcExlbmd0aCk7XG4gICAgICB9XG4gICAgICBkb21FbGVtZW50LmFwcGVuZENoaWxkKGNlbGxEb20pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTaGlwTmFtZShzaGlwVHlwZSkge1xuICBjb25zdCBzaGlwcyA9IHtcbiAgICBHYWxsZW9uOiA1LFxuICAgIEZyaWdhdGU6IDQsXG4gICAgQnJpZ2FudGluZTogMyxcbiAgICBTY2hvb25lcjogMixcbiAgICBTbG9vcDogMSxcbiAgfTtcbiAgbGV0IHNoaXA7XG4gIGxldCBsZW5ndGg7XG5cbiAgc3dpdGNoIChzaGlwVHlwZSkge1xuICAgIGNhc2UgJ0dhbGxlb24nOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVswXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnRnJpZ2F0ZSc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzFdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdCcmlnYW50aW5lJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbMl07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1NjaG9vbmVyJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbM107XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1Nsb29wJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbNF07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB7IHNoaXAsIGxlbmd0aCB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGF0dGVtcHRTaGlwUGxhY2VtZW50RG9tKHNoaXBUeXBlLCBheGlzLCBjZWxsLCBib2FyZCkge1xuICBjb25zdCBzaGlwRGF0YSA9IGdldFNoaXBOYW1lKHNoaXBUeXBlKTtcbiAgY29uc3Qgc2hpcFNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC10by1wbGFjZSAuc2hpcCcpO1xuICBzaGlwU3Bhbi50ZXh0Q29udGVudCA9IHNoaXBEYXRhLnNoaXA7XG4gIGNvbnN0IGxlbmd0aCA9IHNoaXBEYXRhLmxlbmd0aDtcblxuICBjb25zdCBzaGlwSGVhZCA9IFtjZWxsLngsIGNlbGwueV07XG4gIGxldCBzaGlwVGFpbFg7XG4gIGxldCBzaGlwVGFpbFk7XG5cbiAgaWYgKGF4aXMgPT09ICdob3Jpem9udGFsJykge1xuICAgIHNoaXBUYWlsWCA9IHNoaXBIZWFkWzBdICsgbGVuZ3RoIC0gMTtcbiAgICBzaGlwVGFpbFkgPSBzaGlwSGVhZFsxXTtcbiAgfSBlbHNlIGlmIChheGlzID09PSAndmVydGljYWwnKSB7XG4gICAgc2hpcFRhaWxYID0gc2hpcEhlYWRbMF07XG4gICAgc2hpcFRhaWxZID0gc2hpcEhlYWRbMV0gKyBsZW5ndGggLSAxO1xuICB9XG5cbiAgY29uc3Qgc2hpcFRhaWwgPSBbc2hpcFRhaWxYLCBzaGlwVGFpbFldO1xuICBjb25zdCByZXN0U2hpcENlbGxzID0gW107XG4gIGNvbnN0IHNoaXBIZWFkRG9tID0gW2ZpbmREb21DZWxsQXRDb29yZGluYXRlcyguLi5zaGlwSGVhZCldO1xuICBjb25zdCBzaGlwVGFpbERvbSA9IFtmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoLi4uc2hpcFRhaWwpXTtcbiAgY29uc3QgcmVzdFNoaXBEb20gPSBbXTtcbiAgY29uc3QgY2VsbHNPYmogPSBib2FyZC5maW5kTWlzc2luZ0JvYXRDZWxscyhzaGlwSGVhZCwgbGVuZ3RoLCBheGlzKTtcbiAgY29uc3QgbWlzc2luZ0NlbGxzID0gY2VsbHNPYmoubWlkZGxlQ2VsbHM7XG4gIHJlc3RTaGlwQ2VsbHMucHVzaCguLi5taXNzaW5nQ2VsbHMpO1xuXG4gIGlmICghYm9hcmQuY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoc2hpcEhlYWQsIHNoaXBUYWlsLCByZXN0U2hpcENlbGxzKSkge1xuICAgIG1hcmtJbnZhbGlkU2hpcExvY2F0aW9uKHNoaXBIZWFkRG9tWzBdKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmVzdFNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBpZiAoY2VsbCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICByZXN0U2hpcERvbS5wdXNoKGZpbmREb21DZWxsQXRDb29yZGluYXRlcyhjZWxsLngsIGNlbGwueSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWxsRG9tU2hpcENlbGxzID0gc2hpcEhlYWREb20uY29uY2F0KHNoaXBUYWlsRG9tKS5jb25jYXQocmVzdFNoaXBEb20pO1xuICAgIG1hcmtBdHRlbXB0VG9QbGFjZVNoaXAoYWxsRG9tU2hpcENlbGxzKTtcblxuICAgIHJldHVybiB7IHNoaXBIZWFkLCBzaGlwVGFpbCwgYWxsRG9tU2hpcENlbGxzIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFya0ludmFsaWRTaGlwTG9jYXRpb24oY2VsbCkge1xuICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQtbG9jYXRpb24nKTtcbiAgY2xlYXJEb21DZWxsSW52YWxpZGl0eShjZWxsKTtcbn1cblxuZnVuY3Rpb24gbWFya0F0dGVtcHRUb1BsYWNlU2hpcChjZWxscykge1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdhdHRlbXB0LXBsYWNlLXNoaXAnKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiBjbGVhckRvbUNlbGxzQ3VzdG9tQ29sb3IoY2VsbHMpKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hTZWN0aW9uKHNlY3Rpb24pIHtcbiAgY29uc3QgbGFuZGluZ1NlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGFuZGluZycpO1xuICBjb25zdCBzaGlwUGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50Jyk7XG4gIGNvbnN0IGJhdHRsZVNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmF0dGxlLXNlY3Rpb24nKTtcblxuICBpZiAoc2VjdGlvbiA9PT0gJ3NoaXAtcGxhY2VtZW50Jykge1xuICAgIGxhbmRpbmdTZWN0aW9uLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgc2hpcFBsYWNlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGZsZXgnO1xuICB9XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdiYXR0bGUtc2VjdGlvbicpIHtcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIHNoaXBQbGFjZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBiYXR0bGVTZWN0aW9uLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleCc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zaXRpb25CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzaGlwUGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50Jyk7XG4gIGNvbnN0IGJhdHRsZVNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmF0dGxlLXNlY3Rpb24nKTtcbiAgc2hpcFBsYWNlbWVudC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kLXN3YXAnKTtcbiAgYmF0dGxlU2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kLXN3YXAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYWNlU2hpcERvbShjZWxscykge1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAtcGxhY2VkJykpO1xufVxuXG5mdW5jdGlvbiBjbGVhckRvbUNlbGxJbnZhbGlkaXR5KGNlbGwpIHtcbiAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZC1sb2NhdGlvbicpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSB7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYXR0ZW1wdC1wbGFjZS1zaGlwJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKHgsIHksIHBsYXllcikge1xuICBsZXQgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICBsZXQgc2VhcmNoZWRDZWxsO1xuICBpZiAocGxheWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAocGxheWVyID09PSAncGxheWVyJykge1xuICAgICAgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gICAgfSBlbHNlIGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFpLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIH1cblxuICBjZWxsc0RvbS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgY2VsbFggPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS14Jyk7XG4gICAgY29uc3QgY2VsbFkgPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgaWYgKE51bWJlcihjZWxsWCkgPT09IHggJiYgTnVtYmVyKGNlbGxZKSA9PT0geSkgc2VhcmNoZWRDZWxsID0gY2VsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIHNlYXJjaGVkQ2VsbDtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBDZWxsKHgsIHkpIHtcbiAgbGV0IGhlbGRTaGlwID0gbnVsbDtcbiAgbGV0IGlzSGl0ID0gZmFsc2U7XG5cbiAgcmV0dXJuIHsgeCwgeSwgaGVsZFNoaXAsIGlzSGl0IH07XG59XG4iLCJpbXBvcnQgeyBTaGlwIH0gZnJvbSAnLi9zaGlwJztcbmltcG9ydCB7IENlbGwgfSBmcm9tICcuL2NlbGwnO1xuXG5leHBvcnQgY29uc3QgR2FtZUJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHMgPSAxMDtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgbGV0IGhpdHMgPSBbXTtcbiAgbGV0IG1pc3NlcyA9IFtdO1xuICBnZW5lcmF0ZUJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVCb2FyZCgpIHtcbiAgICBmb3IgKGxldCBpID0gcm93czsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3Qgcm93ID0gW107XG4gICAgICBib2FyZC5wdXNoKHJvdyk7XG4gICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBjb2xzOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sID0gW0NlbGwoaiwgaSldO1xuICAgICAgICByb3cucHVzaChjb2wpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJldHVybkJvYXJkID0gKCkgPT4gYm9hcmQ7XG5cbiAgY29uc3QgZmluZENlbGxBdENvb3JkaW5hdGVzID0gKHgsIHkpID0+IHtcbiAgICBmb3IgKGxldCByb3cgb2YgYm9hcmQpIHtcbiAgICAgIGZvciAobGV0IGJvYXJkQ2VsbCBvZiByb3cpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGJvYXJkQ2VsbFswXTtcbiAgICAgICAgaWYgKHggPT09IGNlbGwueCAmJiB5ID09PSBjZWxsLnkpIHJldHVybiBjZWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAoaGVhZCwgdGFpbCkgPT4ge1xuICAgIGlmICghKGhlYWQgaW5zdGFuY2VvZiBBcnJheSkgfHwgISh0YWlsIGluc3RhbmNlb2YgQXJyYXkpKVxuICAgICAgdGhyb3cgRXJyb3IoJ2hlYWQgYW5kIHRhaWwgbXVzdCBiZSBhcnJheXMgcmVwcmVzZW50aW5nIGNvb3JkaW5hdGVzIScpO1xuXG4gICAgbGV0IHNoaXA7XG4gICAgY29uc3Qgc2hpcENlbGxzID0gW107XG4gICAgbGV0IGRpcmVjdGlvbiA9ICdpbnZhbGlkJztcbiAgICBsZXQgc2hpcExlbmd0aDtcblxuICAgIGlmIChoZWFkWzBdID09PSB0YWlsWzBdICYmIGhlYWRbMV0gPT09IHRhaWxbMV0pIGRpcmVjdGlvbiA9ICdzaW5nbGUtY2VsbCc7XG4gICAgZWxzZSBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSkgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICBlbHNlIGlmIChoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBjb25zdCBoZWFkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhoZWFkWzBdLCBoZWFkWzFdKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh0YWlsWzBdLCB0YWlsWzFdKTtcbiAgICBzaGlwQ2VsbHMucHVzaChoZWFkQ2VsbCk7XG4gICAgc2hpcENlbGxzLnB1c2godGFpbENlbGwpO1xuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2ludmFsaWQnIHx8ICFjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eShoZWFkLCB0YWlsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnc2luZ2xlLWNlbGwnKSB7XG4gICAgICBzaGlwID0gU2hpcCgxKTtcbiAgICAgIC8vIGNhc2Ugb2Ygc2luZ2xlLWNlbGwgYm9hdCwgcmVtb3ZlIHRoZSBkb3VibGUgY29vcmRpbmF0ZSBmcm9tIGFyclxuICAgICAgc2hpcENlbGxzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc2hpcExlbmd0aCA9IE1hdGguYWJzKGhlYWRbMF0gLSB0YWlsWzBdKSArIDE7XG4gICAgICBzaGlwID0gU2hpcChzaGlwTGVuZ3RoKTtcbiAgICAgIGNvbnN0IGNlbGxzT2JqID0gZmluZE1pc3NpbmdCb2F0Q2VsbHMoaGVhZCwgc2hpcExlbmd0aCwgJ2hvcml6b250YWwnKTtcbiAgICAgIGNvbnN0IG1pZGRsZUNlbGxzID0gY2VsbHNPYmoubWlkZGxlQ2VsbHM7XG4gICAgICBzaGlwQ2VsbHMucHVzaCguLi5taWRkbGVDZWxscyk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHNoaXBMZW5ndGggPSBNYXRoLmFicyhoZWFkWzFdIC0gdGFpbFsxXSkgKyAxO1xuICAgICAgc2hpcCA9IFNoaXAoc2hpcExlbmd0aCk7XG4gICAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsICd2ZXJ0aWNhbCcpO1xuICAgICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAgIHNoaXBDZWxscy5wdXNoKC4uLm1pZGRsZUNlbGxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAvLyBpZiB2YWxpZCBjb29yZHMsIGFkZCB0aGUgc2hpcCBib3RoIHRvIHRoZSBib2FyZCBhbmQgdGhlIHNoaXAgYXJyYXlcbiAgICBpZiAoY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoaGVhZCwgdGFpbCwgbWlkZGxlQ2VsbHMpKSB7XG4gICAgICBzaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gKGNlbGwuaGVsZFNoaXAgPSBzaGlwKSk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgY2VsbE51bWJlck5vdEZvdW5kID0gbGVuZ3RoIC0gMTtcbiAgICBjb25zdCByZXN0T2ZDZWxscyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY2VsbE51bWJlck5vdEZvdW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgZml4ZWRDb29yZCA9IGhlYWRbMV07XG4gICAgICAgIGNvbnN0IHZhckNvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh2YXJDb29yZCArIGksIGZpeGVkQ29vcmQpO1xuICAgICAgICByZXN0T2ZDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgdmFyQ29vcmQgPSBoZWFkWzFdO1xuICAgICAgICBjb25zdCBjZWxsSW5CZXR3ZWVuID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGZpeGVkQ29vcmQsIHZhckNvb3JkICsgaSk7XG4gICAgICAgIHJlc3RPZkNlbGxzLnB1c2goY2VsbEluQmV0d2Vlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSByZXN0T2ZDZWxscy5zbGljZSgwLCByZXN0T2ZDZWxscy5sZW5ndGggLSAxKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IHJlc3RPZkNlbGxzW3Jlc3RPZkNlbGxzLmxlbmd0aCAtIDFdO1xuXG4gICAgcmV0dXJuIHsgbWlkZGxlQ2VsbHMsIHRhaWxDZWxsIH07XG4gIH1cblxuICBjb25zdCBjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eSA9IChoZWFkLCB0YWlsLCBtaXNzaW5nQ2VsbHMpID0+IHtcbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuXG4gICAgaWYgKFxuICAgICAgaGVhZFswXSA8IDEgfHxcbiAgICAgIGhlYWRbMF0gPiAxMCB8fFxuICAgICAgaGVhZFsxXSA8IDEgfHxcbiAgICAgIGhlYWRbMV0gPiAxMCB8fFxuICAgICAgdGFpbFswXSA8IDEgfHxcbiAgICAgIHRhaWxbMF0gPiAxMCB8fFxuICAgICAgdGFpbFsxXSA8IDEgfHxcbiAgICAgIHRhaWxbMV0gPiAxMFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobWlzc2luZ0NlbGxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgaGVhZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoaGVhZFswXSwgaGVhZFsxXSk7XG4gICAgICAgIGNvbnN0IHRhaWxDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHRhaWxbMF0sIHRhaWxbMV0pO1xuICAgICAgICBjb25zdCBhbGxCb2F0Q2VsbHMgPSBbaGVhZENlbGwsIHRhaWxDZWxsXS5jb25jYXQobWlzc2luZ0NlbGxzKTtcblxuICAgICAgICBhbGxCb2F0Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoeCwgeSkgPT4ge1xuICAgIGlmIChjaGVja0F0dGFja1ZhbGlkaXR5KHgsIHkpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2tlZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoeCwgeSk7XG4gICAgYXR0YWNrZWRDZWxsLmlzSGl0ID0gdHJ1ZTtcblxuICAgIGlmIChhdHRhY2tlZENlbGwuaGVsZFNoaXAgIT09IG51bGwpIHtcbiAgICAgIGhpdHMucHVzaCh7IHgsIHkgfSk7XG4gICAgICBhdHRhY2tlZENlbGwuaGVsZFNoaXAuZ2V0SGl0KCk7XG4gICAgICAvLyBpZiB0aGUgc2hpcCBoYXMgYmVlbiBzdW5rLCByZXR1cm4gdGhlIHNoaXBcbiAgICAgIGlmIChhdHRhY2tlZENlbGwuaGVsZFNoaXAuY2hlY2tJZlN1bmsoKSkgcmV0dXJuIGF0dGFja2VkQ2VsbC5oZWxkU2hpcDtcbiAgICAgIGlmIChjaGVja0dhbWVPdmVyKCkpIHJldHVybiAnZ2FtZS1vdmVyJztcbiAgICAgIHJldHVybiAnaGl0JztcbiAgICB9IGVsc2Uge1xuICAgICAgbWlzc2VzLnB1c2goeyB4LCB5IH0pO1xuICAgICAgcmV0dXJuICdtaXNzJztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tBdHRhY2tWYWxpZGl0eSA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKHggPCAxIHx8IHggPiAxMCB8fCB5IDwgMSB8fCB5ID4gMTApIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGFsbEF0dGFja3MgPSBoaXRzLmNvbmNhdChtaXNzZXMpO1xuICAgIGZvciAobGV0IGF0dGFjayBvZiBhbGxBdHRhY2tzKSB7XG4gICAgICBpZiAoYXR0YWNrLnggPT09IHggJiYgYXR0YWNrLnkgPT09IHkpIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBjaGVja0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNlbGxOdW1iZXJIb2xkaW5nQm9hdHMgPSBzaGlwcy5yZWR1Y2UoXG4gICAgICAodG90YWwsIHNoaXApID0+ICh0b3RhbCArPSBzaGlwLmxlbmd0aCksXG4gICAgICAwXG4gICAgKTtcblxuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gY2VsbE51bWJlckhvbGRpbmdCb2F0cykgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICByZXR1cm5Cb2FyZCxcbiAgICBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMsXG4gICAgY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHksXG4gICAgZmluZE1pc3NpbmdCb2F0Q2VsbHMsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgR2FtZUJvYXJkIH0gZnJvbSBcIi4vZ2FtZS1ib2FyZFwiO1xuXG5leHBvcnQgY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcblxuICByZXR1cm4geyBwbGF5ZXJCb2FyZCwgbmFtZSB9O1xufTtcbiIsImV4cG9ydCBjb25zdCBTaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgaGl0cyA9IDA7XG5cbiAgZnVuY3Rpb24gZ2V0SGl0KCkge1xuICAgIHRoaXMuaGl0cysrO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tJZlN1bmsoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5sZW5ndGgsIHRoaXMuaGl0cylcbiAgICBpZiAodGhpcy5oaXRzID09PSB0aGlzLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geyBsZW5ndGgsIGdldEhpdCwgY2hlY2tJZlN1bmssIGhpdHN9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9tb2RlbHMvcGxheWVyJztcbmltcG9ydCB7XG4gIGRpc3BsYXlHYW1lQm9hcmQsXG4gIHN3aXRjaFNlY3Rpb24sXG4gIHRyYW5zaXRpb25CYWNrZ3JvdW5kLFxuICBhdHRlbXB0U2hpcFBsYWNlbWVudERvbSxcbiAgcGxhY2VTaGlwRG9tLFxuICBmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMsXG59IGZyb20gJy4vZG9tL2RvbS1tZXRob2RzJztcblxuY29uc3Qgc3RhcnRHYW1lID0gKCgpID0+IHtcbiAgY29uc3Qgc3RhcnRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtc3RhcnQnKTtcblxuICBzdGFydEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qgc2Vjb25kQ2FwdGFpbiA9IGhhbmRsZUFJU2hpcFBsYWNlbWVudCgpO1xuICAgIHJ1blNoaXBQbGFjZW1lbnRTZWN0aW9uKChmaXJzdENhcHRhaW4pID0+IHtcbiAgICAgIHJ1bkJhdHRsZVNlY3Rpb24oZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluKTtcbiAgICB9KTtcbiAgfSk7XG59KSgpO1xuXG5mdW5jdGlvbiBydW5TaGlwUGxhY2VtZW50U2VjdGlvbihjYWxsYmFjaykge1xuICBzd2l0Y2hTZWN0aW9uKCdzaGlwLXBsYWNlbWVudCcpO1xuICB0cmFuc2l0aW9uQmFja2dyb3VuZCgpO1xuXG4gIGNvbnN0IG5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXN0YXJ0IGlucHV0Jyk7XG4gIGNvbnN0IG5hbWVTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdG8tcGxhY2UgLnBsYXllci1uYW1lJyk7XG4gIGNvbnN0IGdhbWVCb2FyZERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCAuZ2FtZS1ib2FyZCcpO1xuICBjb25zdCBzaGlwcyA9IFsnR2FsbGVvbicsICdGcmlnYXRlJywgJ0JyaWdhbnRpbmUnLCAnU2Nob29uZXInLCAnU2xvb3AnXTtcblxuICBuYW1lU3Bhbi50ZXh0Q29udGVudCA9IG5hbWVJbnB1dC52YWx1ZTtcbiAgY29uc3QgZmlyc3RDYXB0YWluID0gUGxheWVyKG5hbWVJbnB1dC52YWx1ZSk7XG4gIGNvbnN0IGJvYXJkT2JqID0gZmlyc3RDYXB0YWluLnBsYXllckJvYXJkO1xuICBjb25zdCBib2FyZCA9IGJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG5cbiAgZGlzcGxheUdhbWVCb2FyZChib2FyZCwgZ2FtZUJvYXJkRG9tKTtcbiAgaGFuZGxlQ2VsbEV2ZW50cyhmaXJzdENhcHRhaW4sIHNoaXBzLCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNlbGxFdmVudHMoZmlyc3RDYXB0YWluLCBzaGlwcywgY2FsbGJhY2spIHtcbiAgY29uc3QgYXhpc0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCBidXR0b24nKTtcbiAgY29uc3QgYXhpc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCAuYXhpcycpO1xuICBjb25zdCBib2FyZE9iaiA9IGZpcnN0Q2FwdGFpbi5wbGF5ZXJCb2FyZDtcbiAgbGV0IGF4aXMgPSAnaG9yaXpvbnRhbCc7XG5cbiAgYXhpc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAoYXhpcyA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBheGlzRG9tLnRleHRDb250ZW50ID0gJ1ZlcnRpY2FsJztcbiAgICAgIGF4aXMgPSAndmVydGljYWwnO1xuICAgIH0gZWxzZSB7XG4gICAgICBheGlzRG9tLnRleHRDb250ZW50ID0gJ0hvcml6b250YWwnO1xuICAgICAgYXhpcyA9ICdob3Jpem9udGFsJztcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgbGV0IHNoaXBzUGxhY2VkSWR4ID0gMDtcblxuICBjZWxsc0RvbS5mb3JFYWNoKChkb21DZWxsKSA9PiB7XG4gICAgbGV0IGNlbGxYO1xuICAgIGxldCBjZWxsWTtcbiAgICBjZWxsWCA9IGRvbUNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXgnKTtcbiAgICBjZWxsWSA9IGRvbUNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXknKTtcbiAgICBjb25zdCBib2FyZENlbGwgPSBib2FyZE9iai5maW5kQ2VsbEF0Q29vcmRpbmF0ZXMoXG4gICAgICBOdW1iZXIoY2VsbFgpLFxuICAgICAgTnVtYmVyKGNlbGxZKVxuICAgICk7XG5cbiAgICBkb21DZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBpZiAoc2hpcHNQbGFjZWRJZHggPiA0KSByZXR1cm47XG4gICAgICBjb25zdCBzaGlwVG9QbGFjZSA9IHNoaXBzW3NoaXBzUGxhY2VkSWR4XTtcbiAgICAgIGF0dGVtcHRTaGlwUGxhY2VtZW50RG9tKHNoaXBUb1BsYWNlLCBheGlzLCBib2FyZENlbGwsIGJvYXJkT2JqKTtcbiAgICB9KTtcblxuICAgIGRvbUNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBzaGlwVG9QbGFjZSA9IHNoaXBzW3NoaXBzUGxhY2VkSWR4XTtcbiAgICAgIGlmIChoYW5kbGVTaGlwUGxhY2VtZW50KHNoaXBUb1BsYWNlLCBib2FyZENlbGwsIGJvYXJkT2JqLCBheGlzKSkge1xuICAgICAgICBzaGlwc1BsYWNlZElkeCsrO1xuICAgICAgICBpZiAoc2hpcHNQbGFjZWRJZHggPT09IDUpIHJldHVybiBjYWxsYmFjayhmaXJzdENhcHRhaW4pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2hpcFBsYWNlbWVudChzaGlwVG9QbGFjZSwgYm9hcmRDZWxsLCBib2FyZCwgYXhpcykge1xuICBjb25zdCBzaGlwRGF0YSA9IGF0dGVtcHRTaGlwUGxhY2VtZW50RG9tKHNoaXBUb1BsYWNlLCBheGlzLCBib2FyZENlbGwsIGJvYXJkKTtcbiAgaWYgKHNoaXBEYXRhKSB7XG4gICAgaWYgKGJvYXJkLnBsYWNlU2hpcChzaGlwRGF0YS5zaGlwSGVhZCwgc2hpcERhdGEuc2hpcFRhaWwpKSB7XG4gICAgICBwbGFjZVNoaXBEb20oc2hpcERhdGEuYWxsRG9tU2hpcENlbGxzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVBSVNoaXBQbGFjZW1lbnQoKSB7XG4gIGNvbnN0IHNlY29uZENhcHRhaW4gPSBQbGF5ZXIoJ2NoYXQtR1BUJyk7XG4gIGNvbnN0IGJvYXJkID0gc2Vjb25kQ2FwdGFpbi5wbGF5ZXJCb2FyZDtcbiAgbGV0IHNoaXBzUGxhY2VkID0gMTtcblxuICB3aGlsZSAoc2hpcHNQbGFjZWQgPCA2KSB7XG4gICAgY29uc3Qgc2hpcENvb3JkcyA9IGdlbmVyYXRlVmFsaWRSYW5kb21TaGlwQ29vcmRzKHNoaXBzUGxhY2VkLCBib2FyZCk7XG4gICAgaWYgKGJvYXJkLnBsYWNlU2hpcChzaGlwQ29vcmRzLnNoaXBIZWFkLCBzaGlwQ29vcmRzLnNoaXBUYWlsKSkge1xuICAgICAgc2hpcHNQbGFjZWQrKztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2Vjb25kQ2FwdGFpbjtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21TaGlwQ29vcmRzKGxlbmd0aCwgYm9hcmQpIHtcbiAgY29uc3Qgc2hpcEhlYWQgPSBbXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMSxcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxLFxuICBdO1xuICBsZXQgZGlyZWN0aW9uO1xuXG4gIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gIGVsc2UgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcblxuICBjb25zdCBjZWxsc09iaiA9IGJvYXJkLmZpbmRNaXNzaW5nQm9hdENlbGxzKHNoaXBIZWFkLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIGNvbnN0IHNoaXBUYWlsT2JqID0gY2VsbHNPYmoudGFpbENlbGw7XG5cbiAgcmV0dXJuIHsgc2hpcEhlYWQsIHNoaXBUYWlsT2JqIH07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVmFsaWRSYW5kb21TaGlwQ29vcmRzKGxlbmd0aCwgYm9hcmQpIHtcbiAgbGV0IHZhbGlkU2hpcENvb3JkRm91bmQgPSBmYWxzZTtcbiAgbGV0IHNoaXBIZWFkO1xuICBsZXQgc2hpcFRhaWw7XG5cbiAgd2hpbGUgKCF2YWxpZFNoaXBDb29yZEZvdW5kKSB7XG4gICAgY29uc3QgY29vcmRPYmogPSBnZW5lcmF0ZVJhbmRvbVNoaXBDb29yZHMobGVuZ3RoLCBib2FyZCk7XG4gICAgY29uc3QgdGFpbE9iaiA9IGNvb3JkT2JqLnNoaXBUYWlsT2JqO1xuICAgIGxldCBzaGlwSGVhZEF0dGVtcHQgPSBjb29yZE9iai5zaGlwSGVhZDtcbiAgICBsZXQgc2hpcFRhaWxBdHRlbXB0ID0gW3RhaWxPYmo/LngsIHRhaWxPYmo/LnldO1xuICAgIC8vIGlmIGxlbmd0aCBpcyAxLCB3ZSBkb24ndCBuZWVkIHRvIGZpbmQgdGFpbCBjb29yZHNcbiAgICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgICB2YWxpZFNoaXBDb29yZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHNoaXBUYWlsID0gc2hpcEhlYWRBdHRlbXB0O1xuICAgICAgc2hpcEhlYWQgPSBzaGlwSGVhZEF0dGVtcHQ7XG4gICAgfVxuICAgIGlmIChzaGlwVGFpbEF0dGVtcHRbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsaWRTaGlwQ29vcmRGb3VuZCA9IHRydWU7XG4gICAgICBzaGlwSGVhZCA9IHNoaXBIZWFkQXR0ZW1wdDtcbiAgICAgIHNoaXBUYWlsID0gc2hpcFRhaWxBdHRlbXB0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IHNoaXBIZWFkLCBzaGlwVGFpbCB9O1xufVxuXG5mdW5jdGlvbiBydW5CYXR0bGVTZWN0aW9uKGZpcnN0Q2FwdGFpbiwgc2Vjb25kQ2FwdGFpbikge1xuICBzd2l0Y2hTZWN0aW9uKCdiYXR0bGUtc2VjdGlvbicpO1xuICB0cmFuc2l0aW9uQmFja2dyb3VuZCgpO1xuICBjb25zdCBwbGF5ZXJCb2FyZE9iaiA9IGZpcnN0Q2FwdGFpbi5wbGF5ZXJCb2FyZDtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZE9iaiA9IHNlY29uZENhcHRhaW4ucGxheWVyQm9hcmQ7XG5cbiAgY29uc3QgcGxheWVyQm9hcmQgPSBwbGF5ZXJCb2FyZE9iai5yZXR1cm5Cb2FyZCgpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkID0gb3Bwb25lbnRCb2FyZE9iai5yZXR1cm5Cb2FyZCgpO1xuICBjb25zdCBwbGF5ZXJCb2FyZERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItYm9hcmQnKTtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5haS1ib2FyZCcpO1xuXG4gIGRpc3BsYXlHYW1lQm9hcmQocGxheWVyQm9hcmQsIHBsYXllckJvYXJkRG9tKTtcbiAgZGlzcGxheUdhbWVCb2FyZChvcHBvbmVudEJvYXJkLCBvcHBvbmVudEJvYXJkRG9tKTtcblxuICBwbGF5R2FtZShmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pO1xufVxuXG5mdW5jdGlvbiBwbGF5R2FtZShmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pIHtcbiAgY29uc3Qgb3Bwb25lbnRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lbmVteS13YXRlcnMgLmJvYXJkLWNlbGwnKTtcbiAgY29uc3QgcHJvbXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb21wdCcpO1xuICBjb25zdCBwbGF5ZXJOYW1lID0gZmlyc3RDYXB0YWluLm5hbWU7XG4gIGxldCBhd2FpdGVkVHVybiA9IHRydWU7XG5cbiAgcHJvbXB0LnRleHRDb250ZW50ID0gYEF3YWl0aW5nIHllciBvcmRlcnMsIEFkbWlyYWwgJHtwbGF5ZXJOYW1lfSFgO1xuICBvcHBvbmVudENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGF3YWl0ZWRUdXJuID09PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgY29uc3QgY2VsbFggPSBOdW1iZXIoY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpKTtcbiAgICAgIGNvbnN0IGNlbGxZID0gTnVtYmVyKGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXknKSk7XG4gICAgICBjb25zdCBib2FyZENlbGwgPSB7IGNlbGxYLCBjZWxsWSB9O1xuXG4gICAgICBpZiAoIXBsYXllckF0dGFjayhmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4sIGJvYXJkQ2VsbCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXdhaXRlZFR1cm4gPSBmYWxzZTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghb3Bwb25lbnRBdHRhY2soc2Vjb25kQ2FwdGFpbiwgZmlyc3RDYXB0YWluKSlcbiAgICAgICAgICBvcHBvbmVudEF0dGFjayhzZWNvbmRDYXB0YWluLCBmaXJzdENhcHRhaW4pO1xuICAgICAgICBhd2FpdGVkVHVybiA9IHRydWU7XG4gICAgICB9LCAyMDAwKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBsYXllckF0dGFjayhhdHRhY2tlciwgb3Bwb25lbnQsIGNlbGwpIHtcbiAgY29uc3QgcHJvbXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb21wdCcpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkT2JqID0gb3Bwb25lbnQucGxheWVyQm9hcmQ7XG5cbiAgY29uc3QgYXR0YWNrID0gb3Bwb25lbnRCb2FyZE9iai5yZWNlaXZlQXR0YWNrKGNlbGwuY2VsbFgsIGNlbGwuY2VsbFkpO1xuICBjb25zdCBkb21DZWxsID0gZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKGNlbGwuY2VsbFgsIGNlbGwuY2VsbFksICdlbmVteScpO1xuXG4gIGlmIChhdHRhY2sgPT09ICdnYW1lLW92ZXInKSB7XG4gICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICBnYW1lT3ZlcigpO1xuICB9IGVsc2UgaWYgKGF0dGFjayA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChhdHRhY2sgPT09ICdoaXQnKSB7XG4gICAgICBwcm9tcHQudGV4dENvbnRlbnQgPSBgWW91IGZpcmUgYSBzaG90IGluIGVuZW15IHdhdGVycyAuLi4gYW5kIGhpdCFgO1xuICAgICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICB9XG4gICAgLy8gYXR0YWNrIHJldHVybnMgdGhlIGJvYXQgb2JqZWN0IGluIGNhc2Ugb2Ygc3Vua1xuICAgIGlmICh0eXBlb2YgYXR0YWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgLy8gV1JJVEUgSEVSRVxuICAgIH1cbiAgICBpZiAoYXR0YWNrID09PSAnbWlzcycpIHtcbiAgICAgIHByb21wdC50ZXh0Q29udGVudCA9IGBZb3UgZmlyZSBhIHNob3QgaW4gZW5lbXkgd2F0ZXJzIC4uLiBhbmQgbWlzcyFgO1xuICAgICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgYXR0YWNrLCBjZWxsIH07XG59XG5cbmZ1bmN0aW9uIG9wcG9uZW50QXR0YWNrKGF0dGFja2VyLCBvcHBvbmVudCkge1xuICBjb25zdCBwcm9tcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvbXB0Jyk7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmRPYmogPSBvcHBvbmVudC5wbGF5ZXJCb2FyZDtcbiAgY29uc3QgbmFtZSA9IGF0dGFja2VyLm5hbWU7XG5cbiAgY29uc3QgcmFuZENlbGwgPSBnZW5lcmF0ZVJhbmRvbUF0dGFjaygpO1xuICBjb25zdCBhdHRhY2sgPSBvcHBvbmVudEJvYXJkT2JqLnJlY2VpdmVBdHRhY2socmFuZENlbGwueCwgcmFuZENlbGwueSk7XG4gIGNvbnN0IGRvbUNlbGwgPSBmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMocmFuZENlbGwueCwgcmFuZENlbGwueSwgJ3BsYXllcicpO1xuXG4gIGlmIChhdHRhY2sgPT09ICdnYW1lLW92ZXInKSB7XG4gICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICBnYW1lT3ZlcigpO1xuICB9IGVsc2UgaWYgKGF0dGFjayA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChhdHRhY2sgPT09ICdoaXQnKSB7XG4gICAgICBwcm9tcHQudGV4dENvbnRlbnQgPSBgJHtuYW1lfSBzaG9vdHMgYSBmaXJlIGluIHlvdXIgd2F0ZXJzIC4uLiBhbmQgaGl0cyFgO1xuICAgICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICB9XG4gICAgLy8gYXR0YWNrIHJldHVybnMgdGhlIGJvYXQgb2JqZWN0IGluIGNhc2Ugb2Ygc3Vua1xuICAgIGlmICh0eXBlb2YgYXR0YWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgLy8gV1JJVEUgSEVSRVxuICAgIH1cbiAgICBpZiAoYXR0YWNrID09PSAnbWlzcycpIHtcbiAgICAgIHByb21wdC50ZXh0Q29udGVudCA9IGAke25hbWV9IHNob290cyBhIGZpcmUgaW4geW91ciB3YXRlcnMgLi4uIGFuZCBtaXNzZXMhYDtcbiAgICAgIGRvbUNlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBhdHRhY2ssIHJhbmRDZWxsIH07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tQXR0YWNrKCkge1xuICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE7XG5cbiAgcmV0dXJuIHsgeCwgeSB9O1xufVxuXG5mdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgY29uc29sZS5sb2coJ0dhbWUgT3ZlcicpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9