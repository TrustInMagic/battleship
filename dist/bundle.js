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
      if (checkGameOver()) return 'game-over';
      return 'hit';
    } else {
      misses.push({ x, y });
      return 'miss'
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
    if (attack === 'miss') {
      prompt.textContent = `You fire a shot in enemy waters ... and miss!`;
      domCell.classList.add('miss');
    }
  }

  return true;
}

function opponentAttack(attacker, opponent) {
  const prompt = document.querySelector('.prompt');
  const opponentBoardObj = opponent.playerBoard;
  const name = attacker.name;

  const randomAttack = generateRandomAttack();
  const enemyAttack = opponentBoardObj.receiveAttack(
    randomAttack.x,
    randomAttack.y
  );
  const domCell = (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.findDomCellAtCoordinates)(
    randomAttack.x,
    randomAttack.y,
    'player'
  );

  if (enemyAttack === 'game-over') {
    domCell.classList.add('hit');
    gameOver();
  } else if (enemyAttack === 'invalid') {
    return false;
  } else {
    if (enemyAttack === 'hit') {
      prompt.textContent = `${name} shoots a fire in your waters ... and hits!`;
      domCell.classList.add('hit');
    }
    if (enemyAttack === 'miss') {
      prompt.textContent = `${name} shoots a fire in your waters ... and misses!`;
      domCell.classList.add('miss');
    }
  }
  return true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNqS087QUFDUDtBQUNBOztBQUVBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMOEI7QUFDQTs7QUFFdkI7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQSxzQkFBc0IsV0FBVztBQUNqQyxxQkFBcUIsMkNBQUk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sYUFBYSwyQ0FBSTtBQUNqQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsYUFBYSwyQ0FBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxhQUFhLDJDQUFJO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQix5QkFBeUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IseUJBQXlCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sb0JBQW9CLE1BQU07QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDM0x5Qzs7QUFFbEM7QUFDUCxzQkFBc0Isc0RBQVM7O0FBRS9CLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7O0FDTk87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7VUNkQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ055QztBQVFkOztBQUUzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQSxFQUFFLCtEQUFhO0FBQ2YsRUFBRSxzRUFBb0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLHNEQUFNO0FBQzdCO0FBQ0E7O0FBRUEsRUFBRSxrRUFBZ0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTSx5RUFBdUI7QUFDN0IsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0EsbUJBQW1CLHlFQUF1QjtBQUMxQztBQUNBO0FBQ0EsTUFBTSw4REFBWTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QixzREFBTTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOztBQUVBO0FBQ0EsRUFBRSwrREFBYTtBQUNmLEVBQUUsc0VBQW9CO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRSxrRUFBZ0I7QUFDbEIsRUFBRSxrRUFBZ0I7O0FBRWxCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1REFBdUQsV0FBVztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQiwwRUFBd0I7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDBFQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQSw4QkFBOEIsTUFBTTtBQUNwQztBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsTUFBTTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9kb20vZG9tLW1ldGhvZHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvY2VsbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9nYW1lLWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5R2FtZUJvYXJkKGJvYXJkLCBkb21FbGVtZW50KSB7XG4gIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgIGZvciAobGV0IGNlbGxBcnIgb2Ygcm93KSB7XG4gICAgICBjb25zdCBjZWxsID0gY2VsbEFyclswXTtcbiAgICAgIGNvbnN0IGNlbGxEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNlbGxEb20uY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIGNlbGwueCk7XG4gICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgY2VsbC55KTtcbiAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBjZWxsLmhlbGRTaGlwLmxlbmd0aDtcbiAgICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsIHNoaXBMZW5ndGgpO1xuICAgICAgfVxuICAgICAgZG9tRWxlbWVudC5hcHBlbmRDaGlsZChjZWxsRG9tKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2hpcE5hbWUoc2hpcFR5cGUpIHtcbiAgY29uc3Qgc2hpcHMgPSB7XG4gICAgR2FsbGVvbjogNSxcbiAgICBGcmlnYXRlOiA0LFxuICAgIEJyaWdhbnRpbmU6IDMsXG4gICAgU2Nob29uZXI6IDIsXG4gICAgU2xvb3A6IDEsXG4gIH07XG4gIGxldCBzaGlwO1xuICBsZXQgbGVuZ3RoO1xuXG4gIHN3aXRjaCAoc2hpcFR5cGUpIHtcbiAgICBjYXNlICdHYWxsZW9uJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbMF07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ZyaWdhdGUnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVsxXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQnJpZ2FudGluZSc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzJdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTY2hvb25lcic6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzNdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTbG9vcCc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzRdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4geyBzaGlwLCBsZW5ndGggfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVHlwZSwgYXhpcywgY2VsbCwgYm9hcmQpIHtcbiAgY29uc3Qgc2hpcERhdGEgPSBnZXRTaGlwTmFtZShzaGlwVHlwZSk7XG4gIGNvbnN0IHNoaXBTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdG8tcGxhY2UgLnNoaXAnKTtcbiAgc2hpcFNwYW4udGV4dENvbnRlbnQgPSBzaGlwRGF0YS5zaGlwO1xuICBjb25zdCBsZW5ndGggPSBzaGlwRGF0YS5sZW5ndGg7XG5cbiAgY29uc3Qgc2hpcEhlYWQgPSBbY2VsbC54LCBjZWxsLnldO1xuICBsZXQgc2hpcFRhaWxYO1xuICBsZXQgc2hpcFRhaWxZO1xuXG4gIGlmIChheGlzID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBzaGlwVGFpbFggPSBzaGlwSGVhZFswXSArIGxlbmd0aCAtIDE7XG4gICAgc2hpcFRhaWxZID0gc2hpcEhlYWRbMV07XG4gIH0gZWxzZSBpZiAoYXhpcyA9PT0gJ3ZlcnRpY2FsJykge1xuICAgIHNoaXBUYWlsWCA9IHNoaXBIZWFkWzBdO1xuICAgIHNoaXBUYWlsWSA9IHNoaXBIZWFkWzFdICsgbGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGNvbnN0IHNoaXBUYWlsID0gW3NoaXBUYWlsWCwgc2hpcFRhaWxZXTtcbiAgY29uc3QgcmVzdFNoaXBDZWxscyA9IFtdO1xuICBjb25zdCBzaGlwSGVhZERvbSA9IFtmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoLi4uc2hpcEhlYWQpXTtcbiAgY29uc3Qgc2hpcFRhaWxEb20gPSBbZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKC4uLnNoaXBUYWlsKV07XG4gIGNvbnN0IHJlc3RTaGlwRG9tID0gW107XG4gIGNvbnN0IGNlbGxzT2JqID0gYm9hcmQuZmluZE1pc3NpbmdCb2F0Q2VsbHMoc2hpcEhlYWQsIGxlbmd0aCwgYXhpcyk7XG4gIGNvbnN0IG1pc3NpbmdDZWxscyA9IGNlbGxzT2JqLm1pZGRsZUNlbGxzO1xuICByZXN0U2hpcENlbGxzLnB1c2goLi4ubWlzc2luZ0NlbGxzKTtcblxuICBpZiAoIWJvYXJkLmNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KHNoaXBIZWFkLCBzaGlwVGFpbCwgcmVzdFNoaXBDZWxscykpIHtcbiAgICBtYXJrSW52YWxpZFNoaXBMb2NhdGlvbihzaGlwSGVhZERvbVswXSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJlc3RTaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgaWYgKGNlbGwgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgcmVzdFNoaXBEb20ucHVzaChmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoY2VsbC54LCBjZWxsLnkpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbERvbVNoaXBDZWxscyA9IHNoaXBIZWFkRG9tLmNvbmNhdChzaGlwVGFpbERvbSkuY29uY2F0KHJlc3RTaGlwRG9tKTtcbiAgICBtYXJrQXR0ZW1wdFRvUGxhY2VTaGlwKGFsbERvbVNoaXBDZWxscyk7XG5cbiAgICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWwsIGFsbERvbVNoaXBDZWxscyB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtJbnZhbGlkU2hpcExvY2F0aW9uKGNlbGwpIHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkLWxvY2F0aW9uJyk7XG4gIGNsZWFyRG9tQ2VsbEludmFsaWRpdHkoY2VsbCk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBdHRlbXB0VG9QbGFjZVNoaXAoY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnYXR0ZW1wdC1wbGFjZS1zaGlwJyk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoU2VjdGlvbihzZWN0aW9uKSB7XG4gIGNvbnN0IGxhbmRpbmdTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhbmRpbmcnKTtcbiAgY29uc3Qgc2hpcFBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCcpO1xuICBjb25zdCBiYXR0bGVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZS1zZWN0aW9uJyk7XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdzaGlwLXBsYWNlbWVudCcpIHtcbiAgICBsYW5kaW5nU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIHNoaXBQbGFjZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4JztcbiAgfVxuXG4gIGlmIChzZWN0aW9uID09PSAnYmF0dGxlLXNlY3Rpb24nKSB7XG4gICAgbGFuZGluZ1NlY3Rpb24uc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBzaGlwUGxhY2VtZW50LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgYmF0dGxlU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGZsZXgnO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2l0aW9uQmFja2dyb3VuZCgpIHtcbiAgY29uc3Qgc2hpcFBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCcpO1xuICBjb25zdCBiYXR0bGVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZS1zZWN0aW9uJyk7XG4gIHNoaXBQbGFjZW1lbnQuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZC1zd2FwJyk7XG4gIGJhdHRsZVNlY3Rpb24uY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZC1zd2FwJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFjZVNoaXBEb20oY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZCcpKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJEb21DZWxsSW52YWxpZGl0eShjZWxsKSB7XG4gIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQtbG9jYXRpb24nKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tQ2VsbHNDdXN0b21Db2xvcihjZWxscykge1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2F0dGVtcHQtcGxhY2Utc2hpcCcpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmREb21DZWxsQXRDb29yZGluYXRlcyh4LCB5LCBwbGF5ZXIpIHtcbiAgbGV0IGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgbGV0IHNlYXJjaGVkQ2VsbDtcbiAgaWYgKHBsYXllciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHBsYXllciA9PT0gJ3BsYXllcicpIHtcbiAgICAgIGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllci1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICAgIH0gZWxzZSBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICB9XG5cbiAgY2VsbHNEb20uZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNvbnN0IGNlbGxYID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgIGNvbnN0IGNlbGxZID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgIGlmIChOdW1iZXIoY2VsbFgpID09PSB4ICYmIE51bWJlcihjZWxsWSkgPT09IHkpIHNlYXJjaGVkQ2VsbCA9IGNlbGw7XG4gIH0pO1xuXG4gIHJldHVybiBzZWFyY2hlZENlbGw7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gQ2VsbCh4LCB5KSB7XG4gIGxldCBoZWxkU2hpcCA9IG51bGw7XG4gIGxldCBpc0hpdCA9IGZhbHNlO1xuXG4gIHJldHVybiB7IHgsIHksIGhlbGRTaGlwLCBpc0hpdCB9O1xufVxuIiwiaW1wb3J0IHsgU2hpcCB9IGZyb20gJy4vc2hpcCc7XG5pbXBvcnQgeyBDZWxsIH0gZnJvbSAnLi9jZWxsJztcblxuZXhwb3J0IGNvbnN0IEdhbWVCb2FyZCA9ICgpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3Qgcm93cyA9IDEwO1xuICBjb25zdCBjb2xzID0gMTA7XG4gIGNvbnN0IHNoaXBzID0gW107XG4gIGxldCBoaXRzID0gW107XG4gIGxldCBtaXNzZXMgPSBbXTtcbiAgZ2VuZXJhdGVCb2FyZCgpO1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQm9hcmQoKSB7XG4gICAgZm9yIChsZXQgaSA9IHJvd3M7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IHJvdyA9IFtdO1xuICAgICAgYm9hcmQucHVzaChyb3cpO1xuICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gY29sczsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IFtDZWxsKGosIGkpXTtcbiAgICAgICAgcm93LnB1c2goY29sKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCByZXR1cm5Cb2FyZCA9ICgpID0+IGJvYXJkO1xuXG4gIGNvbnN0IGZpbmRDZWxsQXRDb29yZGluYXRlcyA9ICh4LCB5KSA9PiB7XG4gICAgZm9yIChsZXQgcm93IG9mIGJvYXJkKSB7XG4gICAgICBmb3IgKGxldCBib2FyZENlbGwgb2Ygcm93KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZENlbGxbMF07XG4gICAgICAgIGlmICh4ID09PSBjZWxsLnggJiYgeSA9PT0gY2VsbC55KSByZXR1cm4gY2VsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGhlYWQsIHRhaWwpID0+IHtcbiAgICBpZiAoIShoZWFkIGluc3RhbmNlb2YgQXJyYXkpIHx8ICEodGFpbCBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgIHRocm93IEVycm9yKCdoZWFkIGFuZCB0YWlsIG11c3QgYmUgYXJyYXlzIHJlcHJlc2VudGluZyBjb29yZGluYXRlcyEnKTtcblxuICAgIGxldCBzaGlwO1xuICAgIGNvbnN0IHNoaXBDZWxscyA9IFtdO1xuICAgIGxldCBkaXJlY3Rpb24gPSAnaW52YWxpZCc7XG4gICAgbGV0IHNoaXBMZW5ndGg7XG5cbiAgICBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSAmJiBoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnc2luZ2xlLWNlbGwnO1xuICAgIGVsc2UgaWYgKGhlYWRbMF0gPT09IHRhaWxbMF0pIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgZWxzZSBpZiAoaGVhZFsxXSA9PT0gdGFpbFsxXSkgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuXG4gICAgY29uc3QgaGVhZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoaGVhZFswXSwgaGVhZFsxXSk7XG4gICAgY29uc3QgdGFpbENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXModGFpbFswXSwgdGFpbFsxXSk7XG4gICAgc2hpcENlbGxzLnB1c2goaGVhZENlbGwpO1xuICAgIHNoaXBDZWxscy5wdXNoKHRhaWxDZWxsKTtcblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdpbnZhbGlkJyB8fCAhY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoaGVhZCwgdGFpbCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3NpbmdsZS1jZWxsJykge1xuICAgICAgc2hpcCA9IFNoaXAoMSk7XG4gICAgICAvLyBjYXNlIG9mIHNpbmdsZS1jZWxsIGJvYXQsIHJlbW92ZSB0aGUgZG91YmxlIGNvb3JkaW5hdGUgZnJvbSBhcnJcbiAgICAgIHNoaXBDZWxscy5zaGlmdCgpO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHNoaXBMZW5ndGggPSBNYXRoLmFicyhoZWFkWzBdIC0gdGFpbFswXSkgKyAxO1xuICAgICAgc2hpcCA9IFNoaXAoc2hpcExlbmd0aCk7XG4gICAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsICdob3Jpem9udGFsJyk7XG4gICAgICBjb25zdCBtaWRkbGVDZWxscyA9IGNlbGxzT2JqLm1pZGRsZUNlbGxzO1xuICAgICAgc2hpcENlbGxzLnB1c2goLi4ubWlkZGxlQ2VsbHMpO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBzaGlwTGVuZ3RoID0gTWF0aC5hYnMoaGVhZFsxXSAtIHRhaWxbMV0pICsgMTtcbiAgICAgIHNoaXAgPSBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgY29uc3QgY2VsbHNPYmogPSBmaW5kTWlzc2luZ0JvYXRDZWxscyhoZWFkLCBzaGlwTGVuZ3RoLCAndmVydGljYWwnKTtcbiAgICAgIGNvbnN0IG1pZGRsZUNlbGxzID0gY2VsbHNPYmoubWlkZGxlQ2VsbHM7XG4gICAgICBzaGlwQ2VsbHMucHVzaCguLi5taWRkbGVDZWxscyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2VsbHNPYmogPSBmaW5kTWlzc2luZ0JvYXRDZWxscyhoZWFkLCBzaGlwTGVuZ3RoLCBkaXJlY3Rpb24pO1xuICAgIGNvbnN0IG1pZGRsZUNlbGxzID0gY2VsbHNPYmoubWlkZGxlQ2VsbHM7XG4gICAgLy8gaWYgdmFsaWQgY29vcmRzLCBhZGQgdGhlIHNoaXAgYm90aCB0byB0aGUgYm9hcmQgYW5kIHRoZSBzaGlwIGFycmF5XG4gICAgaWYgKGNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KGhlYWQsIHRhaWwsIG1pZGRsZUNlbGxzKSkge1xuICAgICAgc2hpcENlbGxzLmZvckVhY2goKGNlbGwpID0+IChjZWxsLmhlbGRTaGlwID0gc2hpcCkpO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBmdW5jdGlvbiBmaW5kTWlzc2luZ0JvYXRDZWxscyhoZWFkLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGNvbnN0IGNlbGxOdW1iZXJOb3RGb3VuZCA9IGxlbmd0aCAtIDE7XG4gICAgY29uc3QgcmVzdE9mQ2VsbHMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGNlbGxOdW1iZXJOb3RGb3VuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpeGVkQ29vcmQgPSBoZWFkWzFdO1xuICAgICAgICBjb25zdCB2YXJDb29yZCA9IGhlYWRbMF07XG4gICAgICAgIGNvbnN0IGNlbGxJbkJldHdlZW4gPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXModmFyQ29vcmQgKyBpLCBmaXhlZENvb3JkKTtcbiAgICAgICAgcmVzdE9mQ2VsbHMucHVzaChjZWxsSW5CZXR3ZWVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY2VsbE51bWJlck5vdEZvdW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgZml4ZWRDb29yZCA9IGhlYWRbMF07XG4gICAgICAgIGNvbnN0IHZhckNvb3JkID0gaGVhZFsxXTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhmaXhlZENvb3JkLCB2YXJDb29yZCArIGkpO1xuICAgICAgICByZXN0T2ZDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1pZGRsZUNlbGxzID0gcmVzdE9mQ2VsbHMuc2xpY2UoMCwgcmVzdE9mQ2VsbHMubGVuZ3RoIC0gMSk7XG4gICAgY29uc3QgdGFpbENlbGwgPSByZXN0T2ZDZWxsc1tyZXN0T2ZDZWxscy5sZW5ndGggLSAxXTtcblxuICAgIHJldHVybiB7IG1pZGRsZUNlbGxzLCB0YWlsQ2VsbCB9O1xuICB9XG5cbiAgY29uc3QgY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkgPSAoaGVhZCwgdGFpbCwgbWlzc2luZ0NlbGxzKSA9PiB7XG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcblxuICAgIGlmIChcbiAgICAgIGhlYWRbMF0gPCAxIHx8XG4gICAgICBoZWFkWzBdID4gMTAgfHxcbiAgICAgIGhlYWRbMV0gPCAxIHx8XG4gICAgICBoZWFkWzFdID4gMTAgfHxcbiAgICAgIHRhaWxbMF0gPCAxIHx8XG4gICAgICB0YWlsWzBdID4gMTAgfHxcbiAgICAgIHRhaWxbMV0gPCAxIHx8XG4gICAgICB0YWlsWzFdID4gMTBcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1pc3NpbmdDZWxscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGhlYWRDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGhlYWRbMF0sIGhlYWRbMV0pO1xuICAgICAgICBjb25zdCB0YWlsQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh0YWlsWzBdLCB0YWlsWzFdKTtcbiAgICAgICAgY29uc3QgYWxsQm9hdENlbGxzID0gW2hlYWRDZWxsLCB0YWlsQ2VsbF0uY29uY2F0KG1pc3NpbmdDZWxscyk7XG5cbiAgICAgICAgYWxsQm9hdENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgICBpZiAoY2VsbC5oZWxkU2hpcCAhPT0gbnVsbCkgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZDtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHgsIHkpID0+IHtcbiAgICBpZiAoY2hlY2tBdHRhY2tWYWxpZGl0eSh4LCB5KSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgfVxuXG4gICAgY29uc3QgYXR0YWNrZWRDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHgsIHkpO1xuICAgIGF0dGFja2VkQ2VsbC5pc0hpdCA9IHRydWU7XG5cbiAgICBcbiAgICBpZiAoYXR0YWNrZWRDZWxsLmhlbGRTaGlwICE9PSBudWxsKSB7XG4gICAgICBoaXRzLnB1c2goeyB4LCB5IH0pO1xuICAgICAgYXR0YWNrZWRDZWxsLmhlbGRTaGlwLmdldEhpdCgpO1xuICAgICAgaWYgKGNoZWNrR2FtZU92ZXIoKSkgcmV0dXJuICdnYW1lLW92ZXInO1xuICAgICAgcmV0dXJuICdoaXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBtaXNzZXMucHVzaCh7IHgsIHkgfSk7XG4gICAgICByZXR1cm4gJ21pc3MnXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNoZWNrQXR0YWNrVmFsaWRpdHkgPSAoeCwgeSkgPT4ge1xuICAgIGlmICh4IDwgMSB8fCB4ID4gMTAgfHwgeSA8IDEgfHwgeSA+IDEwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhbGxBdHRhY2tzID0gaGl0cy5jb25jYXQobWlzc2VzKTtcbiAgICBmb3IgKGxldCBhdHRhY2sgb2YgYWxsQXR0YWNrcykge1xuICAgICAgaWYgKGF0dGFjay54ID09PSB4ICYmIGF0dGFjay55ID09PSB5KSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgY2hlY2tHYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjZWxsTnVtYmVySG9sZGluZ0JvYXRzID0gc2hpcHMucmVkdWNlKFxuICAgICAgKHRvdGFsLCBzaGlwKSA9PiAodG90YWwgKz0gc2hpcC5sZW5ndGgpLFxuICAgICAgMFxuICAgICk7XG5cbiAgICBjb25zb2xlLmxvZyhoaXRzLmxlbmd0aCwgY2VsbE51bWJlckhvbGRpbmdCb2F0cylcblxuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gY2VsbE51bWJlckhvbGRpbmdCb2F0cykgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICByZXR1cm5Cb2FyZCxcbiAgICBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMsXG4gICAgY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHksXG4gICAgZmluZE1pc3NpbmdCb2F0Q2VsbHMsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgR2FtZUJvYXJkIH0gZnJvbSBcIi4vZ2FtZS1ib2FyZFwiO1xuXG5leHBvcnQgY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcblxuICByZXR1cm4geyBwbGF5ZXJCb2FyZCwgbmFtZSB9O1xufTtcbiIsImV4cG9ydCBjb25zdCBTaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgaGl0ID0gMDtcblxuICBmdW5jdGlvbiBnZXRIaXQoKSB7XG4gICAgaGl0Kys7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0lmU3VuaygpIHtcbiAgICBpZiAoaGl0ID49IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geyBsZW5ndGgsIGdldEhpdCwgY2hlY2tJZlN1bmsgfTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vbW9kZWxzL3BsYXllcic7XG5pbXBvcnQge1xuICBkaXNwbGF5R2FtZUJvYXJkLFxuICBzd2l0Y2hTZWN0aW9uLFxuICB0cmFuc2l0aW9uQmFja2dyb3VuZCxcbiAgYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20sXG4gIHBsYWNlU2hpcERvbSxcbiAgZmluZERvbUNlbGxBdENvb3JkaW5hdGVzLFxufSBmcm9tICcuL2RvbS9kb20tbWV0aG9kcyc7XG5cbmNvbnN0IHN0YXJ0R2FtZSA9ICgoKSA9PiB7XG4gIGNvbnN0IHN0YXJ0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXN0YXJ0Jyk7XG5cbiAgc3RhcnRGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHNlY29uZENhcHRhaW4gPSBoYW5kbGVBSVNoaXBQbGFjZW1lbnQoKTtcbiAgICBydW5TaGlwUGxhY2VtZW50U2VjdGlvbigoZmlyc3RDYXB0YWluKSA9PiB7XG4gICAgICBydW5CYXR0bGVTZWN0aW9uKGZpcnN0Q2FwdGFpbiwgc2Vjb25kQ2FwdGFpbik7XG4gICAgfSk7XG4gIH0pO1xufSkoKTtcblxuZnVuY3Rpb24gcnVuU2hpcFBsYWNlbWVudFNlY3Rpb24oY2FsbGJhY2spIHtcbiAgc3dpdGNoU2VjdGlvbignc2hpcC1wbGFjZW1lbnQnKTtcbiAgdHJhbnNpdGlvbkJhY2tncm91bmQoKTtcblxuICBjb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1zdGFydCBpbnB1dCcpO1xuICBjb25zdCBuYW1lU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXRvLXBsYWNlIC5wbGF5ZXItbmFtZScpO1xuICBjb25zdCBnYW1lQm9hcmREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC1wbGFjZW1lbnQgLmdhbWUtYm9hcmQnKTtcbiAgY29uc3Qgc2hpcHMgPSBbJ0dhbGxlb24nLCAnRnJpZ2F0ZScsICdCcmlnYW50aW5lJywgJ1NjaG9vbmVyJywgJ1Nsb29wJ107XG5cbiAgbmFtZVNwYW4udGV4dENvbnRlbnQgPSBuYW1lSW5wdXQudmFsdWU7XG4gIGNvbnN0IGZpcnN0Q2FwdGFpbiA9IFBsYXllcihuYW1lSW5wdXQudmFsdWUpO1xuICBjb25zdCBib2FyZE9iaiA9IGZpcnN0Q2FwdGFpbi5wbGF5ZXJCb2FyZDtcbiAgY29uc3QgYm9hcmQgPSBib2FyZE9iai5yZXR1cm5Cb2FyZCgpO1xuXG4gIGRpc3BsYXlHYW1lQm9hcmQoYm9hcmQsIGdhbWVCb2FyZERvbSk7XG4gIGhhbmRsZUNlbGxFdmVudHMoZmlyc3RDYXB0YWluLCBzaGlwcywgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVDZWxsRXZlbnRzKGZpcnN0Q2FwdGFpbiwgc2hpcHMsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IGF4aXNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC1wbGFjZW1lbnQgYnV0dG9uJyk7XG4gIGNvbnN0IGF4aXNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC1wbGFjZW1lbnQgLmF4aXMnKTtcbiAgY29uc3QgYm9hcmRPYmogPSBmaXJzdENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGxldCBheGlzID0gJ2hvcml6b250YWwnO1xuXG4gIGF4aXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYgKGF4aXMgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgYXhpc0RvbS50ZXh0Q29udGVudCA9ICdWZXJ0aWNhbCc7XG4gICAgICBheGlzID0gJ3ZlcnRpY2FsJztcbiAgICB9IGVsc2Uge1xuICAgICAgYXhpc0RvbS50ZXh0Q29udGVudCA9ICdIb3Jpem9udGFsJztcbiAgICAgIGF4aXMgPSAnaG9yaXpvbnRhbCc7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG4gIGxldCBzaGlwc1BsYWNlZElkeCA9IDA7XG5cbiAgY2VsbHNEb20uZm9yRWFjaCgoZG9tQ2VsbCkgPT4ge1xuICAgIGxldCBjZWxsWDtcbiAgICBsZXQgY2VsbFk7XG4gICAgY2VsbFggPSBkb21DZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS14Jyk7XG4gICAgY2VsbFkgPSBkb21DZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgY29uc3QgYm9hcmRDZWxsID0gYm9hcmRPYmouZmluZENlbGxBdENvb3JkaW5hdGVzKFxuICAgICAgTnVtYmVyKGNlbGxYKSxcbiAgICAgIE51bWJlcihjZWxsWSlcbiAgICApO1xuXG4gICAgZG9tQ2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgaWYgKHNoaXBzUGxhY2VkSWR4ID4gNCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2hpcFRvUGxhY2UgPSBzaGlwc1tzaGlwc1BsYWNlZElkeF07XG4gICAgICBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVG9QbGFjZSwgYXhpcywgYm9hcmRDZWxsLCBib2FyZE9iaik7XG4gICAgfSk7XG5cbiAgICBkb21DZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2hpcFRvUGxhY2UgPSBzaGlwc1tzaGlwc1BsYWNlZElkeF07XG4gICAgICBpZiAoaGFuZGxlU2hpcFBsYWNlbWVudChzaGlwVG9QbGFjZSwgYm9hcmRDZWxsLCBib2FyZE9iaiwgYXhpcykpIHtcbiAgICAgICAgc2hpcHNQbGFjZWRJZHgrKztcbiAgICAgICAgaWYgKHNoaXBzUGxhY2VkSWR4ID09PSA1KSByZXR1cm4gY2FsbGJhY2soZmlyc3RDYXB0YWluKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNoaXBQbGFjZW1lbnQoc2hpcFRvUGxhY2UsIGJvYXJkQ2VsbCwgYm9hcmQsIGF4aXMpIHtcbiAgY29uc3Qgc2hpcERhdGEgPSBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVG9QbGFjZSwgYXhpcywgYm9hcmRDZWxsLCBib2FyZCk7XG4gIGlmIChzaGlwRGF0YSkge1xuICAgIGlmIChib2FyZC5wbGFjZVNoaXAoc2hpcERhdGEuc2hpcEhlYWQsIHNoaXBEYXRhLnNoaXBUYWlsKSkge1xuICAgICAgcGxhY2VTaGlwRG9tKHNoaXBEYXRhLmFsbERvbVNoaXBDZWxscyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQUlTaGlwUGxhY2VtZW50KCkge1xuICBjb25zdCBzZWNvbmRDYXB0YWluID0gUGxheWVyKCdjaGF0LUdQVCcpO1xuICBjb25zdCBib2FyZCA9IHNlY29uZENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGxldCBzaGlwc1BsYWNlZCA9IDE7XG5cbiAgd2hpbGUgKHNoaXBzUGxhY2VkIDwgNikge1xuICAgIGNvbnN0IHNoaXBDb29yZHMgPSBnZW5lcmF0ZVZhbGlkUmFuZG9tU2hpcENvb3JkcyhzaGlwc1BsYWNlZCwgYm9hcmQpO1xuICAgIGlmIChib2FyZC5wbGFjZVNoaXAoc2hpcENvb3Jkcy5zaGlwSGVhZCwgc2hpcENvb3Jkcy5zaGlwVGFpbCkpIHtcbiAgICAgIHNoaXBzUGxhY2VkKys7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNlY29uZENhcHRhaW47XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKSB7XG4gIGNvbnN0IHNoaXBIZWFkID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEsXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMSxcbiAgXTtcbiAgbGV0IGRpcmVjdGlvbjtcblxuICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICBlbHNlIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG5cbiAgY29uc3QgY2VsbHNPYmogPSBib2FyZC5maW5kTWlzc2luZ0JvYXRDZWxscyhzaGlwSGVhZCwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICBjb25zdCBzaGlwVGFpbE9iaiA9IGNlbGxzT2JqLnRhaWxDZWxsO1xuXG4gIHJldHVybiB7IHNoaXBIZWFkLCBzaGlwVGFpbE9iaiB9O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVZhbGlkUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKSB7XG4gIGxldCB2YWxpZFNoaXBDb29yZEZvdW5kID0gZmFsc2U7XG4gIGxldCBzaGlwSGVhZDtcbiAgbGV0IHNoaXBUYWlsO1xuXG4gIHdoaWxlICghdmFsaWRTaGlwQ29vcmRGb3VuZCkge1xuICAgIGNvbnN0IGNvb3JkT2JqID0gZ2VuZXJhdGVSYW5kb21TaGlwQ29vcmRzKGxlbmd0aCwgYm9hcmQpO1xuICAgIGNvbnN0IHRhaWxPYmogPSBjb29yZE9iai5zaGlwVGFpbE9iajtcbiAgICBsZXQgc2hpcEhlYWRBdHRlbXB0ID0gY29vcmRPYmouc2hpcEhlYWQ7XG4gICAgbGV0IHNoaXBUYWlsQXR0ZW1wdCA9IFt0YWlsT2JqPy54LCB0YWlsT2JqPy55XTtcbiAgICAvLyBpZiBsZW5ndGggaXMgMSwgd2UgZG9uJ3QgbmVlZCB0byBmaW5kIHRhaWwgY29vcmRzXG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFsaWRTaGlwQ29vcmRGb3VuZCA9IHRydWU7XG4gICAgICBzaGlwVGFpbCA9IHNoaXBIZWFkQXR0ZW1wdDtcbiAgICAgIHNoaXBIZWFkID0gc2hpcEhlYWRBdHRlbXB0O1xuICAgIH1cbiAgICBpZiAoc2hpcFRhaWxBdHRlbXB0WzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbGlkU2hpcENvb3JkRm91bmQgPSB0cnVlO1xuICAgICAgc2hpcEhlYWQgPSBzaGlwSGVhZEF0dGVtcHQ7XG4gICAgICBzaGlwVGFpbCA9IHNoaXBUYWlsQXR0ZW1wdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWwgfTtcbn1cblxuZnVuY3Rpb24gcnVuQmF0dGxlU2VjdGlvbihmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pIHtcbiAgc3dpdGNoU2VjdGlvbignYmF0dGxlLXNlY3Rpb24nKTtcbiAgdHJhbnNpdGlvbkJhY2tncm91bmQoKTtcbiAgY29uc3QgcGxheWVyQm9hcmRPYmogPSBmaXJzdENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmRPYmogPSBzZWNvbmRDYXB0YWluLnBsYXllckJvYXJkO1xuXG4gIGNvbnN0IHBsYXllckJvYXJkID0gcGxheWVyQm9hcmRPYmoucmV0dXJuQm9hcmQoKTtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZCA9IG9wcG9uZW50Qm9hcmRPYmoucmV0dXJuQm9hcmQoKTtcbiAgY29uc3QgcGxheWVyQm9hcmREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWktYm9hcmQnKTtcblxuICBkaXNwbGF5R2FtZUJvYXJkKHBsYXllckJvYXJkLCBwbGF5ZXJCb2FyZERvbSk7XG4gIGRpc3BsYXlHYW1lQm9hcmQob3Bwb25lbnRCb2FyZCwgb3Bwb25lbnRCb2FyZERvbSk7XG5cbiAgcGxheUdhbWUoZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluKTtcbn1cblxuZnVuY3Rpb24gcGxheUdhbWUoZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluKSB7XG4gIGNvbnN0IG9wcG9uZW50Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZW5lbXktd2F0ZXJzIC5ib2FyZC1jZWxsJyk7XG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tcHQnKTtcbiAgY29uc3QgcGxheWVyTmFtZSA9IGZpcnN0Q2FwdGFpbi5uYW1lO1xuICBsZXQgYXdhaXRlZFR1cm4gPSB0cnVlO1xuXG4gIHByb21wdC50ZXh0Q29udGVudCA9IGBBd2FpdGluZyB5ZXIgb3JkZXJzLCBBZG1pcmFsICR7cGxheWVyTmFtZX0hYDtcbiAgb3Bwb25lbnRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChhd2FpdGVkVHVybiA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGNvbnN0IGNlbGxYID0gTnVtYmVyKGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXgnKSk7XG4gICAgICBjb25zdCBjZWxsWSA9IE51bWJlcihjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15JykpO1xuICAgICAgY29uc3QgYm9hcmRDZWxsID0geyBjZWxsWCwgY2VsbFkgfTtcblxuICAgICAgaWYgKCFwbGF5ZXJBdHRhY2soZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluLCBib2FyZENlbGwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF3YWl0ZWRUdXJuID0gZmFsc2U7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIW9wcG9uZW50QXR0YWNrKHNlY29uZENhcHRhaW4sIGZpcnN0Q2FwdGFpbikpXG4gICAgICAgICAgb3Bwb25lbnRBdHRhY2soc2Vjb25kQ2FwdGFpbiwgZmlyc3RDYXB0YWluKTtcbiAgICAgICAgYXdhaXRlZFR1cm4gPSB0cnVlO1xuICAgICAgfSwgMjAwMCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwbGF5ZXJBdHRhY2soYXR0YWNrZXIsIG9wcG9uZW50LCBjZWxsKSB7XG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tcHQnKTtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZE9iaiA9IG9wcG9uZW50LnBsYXllckJvYXJkO1xuXG4gIGNvbnN0IGF0dGFjayA9IG9wcG9uZW50Qm9hcmRPYmoucmVjZWl2ZUF0dGFjayhjZWxsLmNlbGxYLCBjZWxsLmNlbGxZKTtcbiAgY29uc3QgZG9tQ2VsbCA9IGZpbmREb21DZWxsQXRDb29yZGluYXRlcyhjZWxsLmNlbGxYLCBjZWxsLmNlbGxZLCAnZW5lbXknKTtcblxuICBpZiAoYXR0YWNrID09PSAnZ2FtZS1vdmVyJykge1xuICAgIGRvbUNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgZ2FtZU92ZXIoKTtcbiAgfSBlbHNlIGlmIChhdHRhY2sgPT09ICdpbnZhbGlkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoYXR0YWNrID09PSAnaGl0Jykge1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYFlvdSBmaXJlIGEgc2hvdCBpbiBlbmVteSB3YXRlcnMgLi4uIGFuZCBoaXQhYDtcbiAgICAgIGRvbUNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgfVxuICAgIGlmIChhdHRhY2sgPT09ICdtaXNzJykge1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYFlvdSBmaXJlIGEgc2hvdCBpbiBlbmVteSB3YXRlcnMgLi4uIGFuZCBtaXNzIWA7XG4gICAgICBkb21DZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gb3Bwb25lbnRBdHRhY2soYXR0YWNrZXIsIG9wcG9uZW50KSB7XG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tcHQnKTtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZE9iaiA9IG9wcG9uZW50LnBsYXllckJvYXJkO1xuICBjb25zdCBuYW1lID0gYXR0YWNrZXIubmFtZTtcblxuICBjb25zdCByYW5kb21BdHRhY2sgPSBnZW5lcmF0ZVJhbmRvbUF0dGFjaygpO1xuICBjb25zdCBlbmVteUF0dGFjayA9IG9wcG9uZW50Qm9hcmRPYmoucmVjZWl2ZUF0dGFjayhcbiAgICByYW5kb21BdHRhY2sueCxcbiAgICByYW5kb21BdHRhY2sueVxuICApO1xuICBjb25zdCBkb21DZWxsID0gZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKFxuICAgIHJhbmRvbUF0dGFjay54LFxuICAgIHJhbmRvbUF0dGFjay55LFxuICAgICdwbGF5ZXInXG4gICk7XG5cbiAgaWYgKGVuZW15QXR0YWNrID09PSAnZ2FtZS1vdmVyJykge1xuICAgIGRvbUNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgZ2FtZU92ZXIoKTtcbiAgfSBlbHNlIGlmIChlbmVteUF0dGFjayA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChlbmVteUF0dGFjayA9PT0gJ2hpdCcpIHtcbiAgICAgIHByb21wdC50ZXh0Q29udGVudCA9IGAke25hbWV9IHNob290cyBhIGZpcmUgaW4geW91ciB3YXRlcnMgLi4uIGFuZCBoaXRzIWA7XG4gICAgICBkb21DZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgIH1cbiAgICBpZiAoZW5lbXlBdHRhY2sgPT09ICdtaXNzJykge1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYCR7bmFtZX0gc2hvb3RzIGEgZmlyZSBpbiB5b3VyIHdhdGVycyAuLi4gYW5kIG1pc3NlcyFgO1xuICAgICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUF0dGFjaygpIHtcbiAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE7XG4gIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxO1xuXG4gIHJldHVybiB7IHgsIHkgfTtcbn1cblxuZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gIGNvbnNvbGUubG9nKCdHYW1lIE92ZXInKTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==