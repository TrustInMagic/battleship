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
/* harmony export */   "removeDomOldBoard": () => (/* binding */ removeDomOldBoard),
/* harmony export */   "switchSection": () => (/* binding */ switchSection),
/* harmony export */   "transitionBackground": () => (/* binding */ transitionBackground)
/* harmony export */ });
function displayGameBoard(board, domElement) {
  domElement.innerHTML = '';

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
    shipPlacement.style.cssText = 'display: none';
    battleSection.style.cssText = 'display: none';
    gameOver.style.cssText = 'display: none';
    landingSection.style.cssText = 'display: flex';
  }

  if (section === 'ship-placement') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: flex';
    battleSection.style.cssText = 'display: none';
    gameOver.style.cssText = 'display: none';
  }

  if (section === 'battle-section') {
    landingSection.style.cssText = 'display: none';
    shipPlacement.style.cssText = 'display: none';
    battleSection.style.cssText = 'display: flex';
    gameOver.style.cssText = 'display: none';
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
  cells.forEach((cell) => {
    cell.classList.add('ship-placed');
  });
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

function removeDomOldBoard() {
  const cellsDom = document.querySelectorAll('.board-cell');

  cellsDom.forEach((cell) => cell.remove());
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
  let board = [];
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

    if (hits.length === cellNumberHoldingBoats) {
      resetBoard();
      return true;
    }
  };

  const resetBoard = () => {
    board = [];
    generateBoard();
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
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.switchSection)('landing');
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.transitionBackground)('landing');

  stopAudioWaves();
  const intro = document.querySelector('body audio');
  const audioDomButton = document.querySelectorAll('.sound-start img');
  handleAudio(intro,'on', audioDomButton);

  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const secondCaptain = handleAIShipPlacement();
    runShipPlacementSection((firstCaptain) => {
      runBattleSection(firstCaptain, secondCaptain);
    });
  });
};

function handleAudio(audioFile, state, domButtons) {
  audioFile.pause();
  domButtons.forEach((button) => {
    if (state === 'on') {
      audioFile.play()
      button.src = '../src/assets/music/volume-off.svg';
    } else button.src = '../src/assets/music/volume-on.svg';
  });

  domButtons.forEach((button) =>
    button.addEventListener('click', () => {
      if (button.getAttribute('class') === 'audio-on') {
        domButtons.forEach((button) => {
          audioFile.pause();
          button.classList.remove('audio-on');
          button.classList.add('audio-off');
          button.src = '../src/assets/music/volume-on.svg';
        });
      } else {
        domButtons.forEach((button) => {
          audioFile.play();
          button.classList.add('audio-on');
          button.classList.remove('audio-off');
          button.src = '../src/assets/music/volume-off.svg';
        });
      }
    })
  );
}

function stopAudioIntro() {
  const audio = document.querySelector('body audio');
  audio.pause();
}

function stopAudioWaves() {
  const audio = document.querySelector('.battle-section audio');
  audio.pause();
}

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

    domCell.addEventListener('mousemove', () => {
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

  stopAudioIntro();
  const waveSound = document.querySelector('.battle-section audio');
  const domButtons = document.querySelectorAll('.sound img')
  handleAudio(waveSound, 'on', domButtons)

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
      }, 100);
    });
  });
}

function playerAttack(firstCaptain, opponent, cell) {
  const prompt = document.querySelector('.prompt');
  const opponentBoardObj = opponent.playerBoard;
  const opponentName = opponent.name;
  const name = firstCaptain.name;

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
      domCell?.classList.add('hit');
    }
    // attack returns the boat object in case of sunk
    if (typeof attack === 'object') {
      const shipLength = attack.length;
      const shipName = getShipName(shipLength);
      prompt.textContent = `You managed to sink ${opponentName}'s ${shipName} fleet. Good job!`;
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.markSunkShip)(shipLength, 'opponent');
    }
    if (attack === 'miss') {
      prompt.textContent = `You fire a shot in enemy waters ... and miss!`;
      domCell?.classList.add('miss');
    }
  }

  return { attack, cell };
}

function opponentAttack(attacker, opponent) {
  const prompt = document.querySelector('.prompt');
  const opponentBoardObj = opponent.playerBoard;
  const name = attacker.name;
  const opponentName = opponent.name;

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
      domCell?.classList.add('hit');
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
      domCell?.classList.add('miss');
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
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.removeDomOldBoard)();

  const winnerDom = document.querySelector('.game-over .winner');
  const playAgainButton = document.querySelector('.game-over button');
  winnerDom.textContent = winner;

  playAgainButton.addEventListener('click', startGame);
}

startGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvZG9tL2RvbS1tZXRob2RzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL2NlbGwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvZ2FtZS1ib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZGlzcGxheUdhbWVCb2FyZChib2FyZCwgZG9tRWxlbWVudCkge1xuICBkb21FbGVtZW50LmlubmVySFRNTCA9ICcnO1xuXG4gIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgIGZvciAobGV0IGNlbGxBcnIgb2Ygcm93KSB7XG4gICAgICBjb25zdCBjZWxsID0gY2VsbEFyclswXTtcbiAgICAgIGNvbnN0IGNlbGxEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNlbGxEb20uY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIGNlbGwueCk7XG4gICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgY2VsbC55KTtcbiAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBjZWxsLmhlbGRTaGlwLmxlbmd0aDtcbiAgICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsIHNoaXBMZW5ndGgpO1xuICAgICAgfVxuICAgICAgZG9tRWxlbWVudC5hcHBlbmRDaGlsZChjZWxsRG9tKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2hpcERldGFpbHMoc2hpcFR5cGUpIHtcbiAgY29uc3Qgc2hpcHMgPSB7XG4gICAgR2FsbGVvbjogNSxcbiAgICBGcmlnYXRlOiA0LFxuICAgIEJyaWdhbnRpbmU6IDMsXG4gICAgU2Nob29uZXI6IDIsXG4gICAgU2xvb3A6IDEsXG4gIH07XG4gIGxldCBzaGlwO1xuICBsZXQgbGVuZ3RoO1xuXG4gIHN3aXRjaCAoc2hpcFR5cGUpIHtcbiAgICBjYXNlICdHYWxsZW9uJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbMF07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ZyaWdhdGUnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVsxXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQnJpZ2FudGluZSc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzJdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTY2hvb25lcic6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzNdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTbG9vcCc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzRdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4geyBzaGlwLCBsZW5ndGggfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVHlwZSwgYXhpcywgY2VsbCwgYm9hcmQpIHtcbiAgY29uc3Qgc2hpcERhdGEgPSBnZXRTaGlwRGV0YWlscyhzaGlwVHlwZSk7XG4gIGNvbnN0IHNoaXBTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdG8tcGxhY2UgLnNoaXAnKTtcbiAgc2hpcFNwYW4udGV4dENvbnRlbnQgPSBzaGlwRGF0YS5zaGlwO1xuICBjb25zdCBsZW5ndGggPSBzaGlwRGF0YS5sZW5ndGg7XG5cbiAgY29uc3Qgc2hpcEhlYWQgPSBbY2VsbC54LCBjZWxsLnldO1xuICBsZXQgc2hpcFRhaWxYO1xuICBsZXQgc2hpcFRhaWxZO1xuXG4gIGlmIChheGlzID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBzaGlwVGFpbFggPSBzaGlwSGVhZFswXSArIGxlbmd0aCAtIDE7XG4gICAgc2hpcFRhaWxZID0gc2hpcEhlYWRbMV07XG4gIH0gZWxzZSBpZiAoYXhpcyA9PT0gJ3ZlcnRpY2FsJykge1xuICAgIHNoaXBUYWlsWCA9IHNoaXBIZWFkWzBdO1xuICAgIHNoaXBUYWlsWSA9IHNoaXBIZWFkWzFdICsgbGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGNvbnN0IHNoaXBUYWlsID0gW3NoaXBUYWlsWCwgc2hpcFRhaWxZXTtcbiAgY29uc3QgcmVzdFNoaXBDZWxscyA9IFtdO1xuICBjb25zdCBzaGlwSGVhZERvbSA9IFtmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoLi4uc2hpcEhlYWQpXTtcbiAgY29uc3Qgc2hpcFRhaWxEb20gPSBbZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKC4uLnNoaXBUYWlsKV07XG4gIGNvbnN0IHJlc3RTaGlwRG9tID0gW107XG4gIGNvbnN0IGNlbGxzT2JqID0gYm9hcmQuZmluZE1pc3NpbmdCb2F0Q2VsbHMoc2hpcEhlYWQsIGxlbmd0aCwgYXhpcyk7XG4gIGNvbnN0IG1pc3NpbmdDZWxscyA9IGNlbGxzT2JqLm1pZGRsZUNlbGxzO1xuICByZXN0U2hpcENlbGxzLnB1c2goLi4ubWlzc2luZ0NlbGxzKTtcblxuICBpZiAoIWJvYXJkLmNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KHNoaXBIZWFkLCBzaGlwVGFpbCwgcmVzdFNoaXBDZWxscykpIHtcbiAgICBtYXJrSW52YWxpZFNoaXBMb2NhdGlvbihzaGlwSGVhZERvbVswXSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJlc3RTaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgaWYgKGNlbGwgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgcmVzdFNoaXBEb20ucHVzaChmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoY2VsbC54LCBjZWxsLnkpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbERvbVNoaXBDZWxscyA9IHNoaXBIZWFkRG9tLmNvbmNhdChzaGlwVGFpbERvbSkuY29uY2F0KHJlc3RTaGlwRG9tKTtcbiAgICBtYXJrQXR0ZW1wdFRvUGxhY2VTaGlwKGFsbERvbVNoaXBDZWxscyk7XG5cbiAgICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWwsIGFsbERvbVNoaXBDZWxscyB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtJbnZhbGlkU2hpcExvY2F0aW9uKGNlbGwpIHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkLWxvY2F0aW9uJyk7XG4gIGNsZWFyRG9tQ2VsbEludmFsaWRpdHkoY2VsbCk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBdHRlbXB0VG9QbGFjZVNoaXAoY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnYXR0ZW1wdC1wbGFjZS1zaGlwJyk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoU2VjdGlvbihzZWN0aW9uKSB7XG4gIGNvbnN0IGxhbmRpbmdTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhbmRpbmcnKTtcbiAgY29uc3Qgc2hpcFBsYWNlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCcpO1xuICBjb25zdCBiYXR0bGVTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZS1zZWN0aW9uJyk7XG4gIGNvbnN0IGdhbWVPdmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtb3ZlcicpO1xuXG4gIGlmIChzZWN0aW9uID09PSAnbGFuZGluZycpIHtcbiAgICBzaGlwUGxhY2VtZW50LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgYmF0dGxlU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIGdhbWVPdmVyLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgbGFuZGluZ1NlY3Rpb24uc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4JztcbiAgfVxuXG4gIGlmIChzZWN0aW9uID09PSAnc2hpcC1wbGFjZW1lbnQnKSB7XG4gICAgbGFuZGluZ1NlY3Rpb24uc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBzaGlwUGxhY2VtZW50LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleCc7XG4gICAgYmF0dGxlU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIGdhbWVPdmVyLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gIH1cblxuICBpZiAoc2VjdGlvbiA9PT0gJ2JhdHRsZS1zZWN0aW9uJykge1xuICAgIGxhbmRpbmdTZWN0aW9uLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgc2hpcFBsYWNlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIGJhdHRsZVNlY3Rpb24uc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4JztcbiAgICBnYW1lT3Zlci5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICB9XG5cbiAgaWYgKHNlY3Rpb24gPT09ICdnYW1lLW92ZXInKSB7XG4gICAgbGFuZGluZ1NlY3Rpb24uc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lJztcbiAgICBzaGlwUGxhY2VtZW50LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZSc7XG4gICAgYmF0dGxlU2VjdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmUnO1xuICAgIGdhbWVPdmVyLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleCc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zaXRpb25CYWNrZ3JvdW5kKCkge1xuICBjb25zdCBzaGlwUGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50Jyk7XG4gIGNvbnN0IGJhdHRsZVNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmF0dGxlLXNlY3Rpb24nKTtcbiAgc2hpcFBsYWNlbWVudC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kLXN3YXAnKTtcbiAgYmF0dGxlU2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kLXN3YXAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYWNlU2hpcERvbShjZWxscykge1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZCcpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJEb21DZWxsSW52YWxpZGl0eShjZWxsKSB7XG4gIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQtbG9jYXRpb24nKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tQ2VsbHNDdXN0b21Db2xvcihjZWxscykge1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2F0dGVtcHQtcGxhY2Utc2hpcCcpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmREb21DZWxsQXRDb29yZGluYXRlcyh4LCB5LCBwbGF5ZXIpIHtcbiAgbGV0IGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgbGV0IHNlYXJjaGVkQ2VsbDtcbiAgaWYgKHBsYXllciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHBsYXllciA9PT0gJ3BsYXllcicpIHtcbiAgICAgIGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllci1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICAgIH0gZWxzZSBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICB9XG5cbiAgY2VsbHNEb20uZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNvbnN0IGNlbGxYID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgIGNvbnN0IGNlbGxZID0gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgIGlmIChOdW1iZXIoY2VsbFgpID09PSB4ICYmIE51bWJlcihjZWxsWSkgPT09IHkpIHNlYXJjaGVkQ2VsbCA9IGNlbGw7XG4gIH0pO1xuXG4gIHJldHVybiBzZWFyY2hlZENlbGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrU3Vua1NoaXAoc2hpcExlbmd0aCwgcGxheWVyKSB7XG4gIGxldCBjZWxsc0RvbTtcblxuICBpZiAocGxheWVyID09PSAncGxheWVyJykge1xuICAgIGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllci1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuICB9IGVsc2UgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWktYm9hcmQgLmJvYXJkLWNlbGwnKTtcblxuICBjZWxsc0RvbS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3Qgc2hpcERvbSA9IE51bWJlcihjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS1zaGlwJykpO1xuICAgIGlmIChzaGlwRG9tID09PSBzaGlwTGVuZ3RoKSBjZWxsLmNsYXNzTGlzdC5hZGQoJ3N1bmsnKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEb21PbGRCb2FyZCgpIHtcbiAgY29uc3QgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuXG4gIGNlbGxzRG9tLmZvckVhY2goKGNlbGwpID0+IGNlbGwucmVtb3ZlKCkpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIENlbGwoeCwgeSkge1xuICBsZXQgaGVsZFNoaXAgPSBudWxsO1xuICBsZXQgaXNIaXQgPSBmYWxzZTtcblxuICByZXR1cm4geyB4LCB5LCBoZWxkU2hpcCwgaXNIaXQgfTtcbn1cbiIsImltcG9ydCB7IFNoaXAgfSBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IHsgQ2VsbCB9IGZyb20gJy4vY2VsbCc7XG5cbmV4cG9ydCBjb25zdCBHYW1lQm9hcmQgPSAoKSA9PiB7XG4gIGxldCBib2FyZCA9IFtdO1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHMgPSAxMDtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgbGV0IGhpdHMgPSBbXTtcbiAgbGV0IG1pc3NlcyA9IFtdO1xuICBnZW5lcmF0ZUJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVCb2FyZCgpIHtcbiAgICBmb3IgKGxldCBpID0gcm93czsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3Qgcm93ID0gW107XG4gICAgICBib2FyZC5wdXNoKHJvdyk7XG4gICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBjb2xzOyBqKyspIHtcbiAgICAgICAgY29uc3QgY29sID0gW0NlbGwoaiwgaSldO1xuICAgICAgICByb3cucHVzaChjb2wpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJldHVybkJvYXJkID0gKCkgPT4gYm9hcmQ7XG5cbiAgY29uc3QgZmluZENlbGxBdENvb3JkaW5hdGVzID0gKHgsIHkpID0+IHtcbiAgICBmb3IgKGxldCByb3cgb2YgYm9hcmQpIHtcbiAgICAgIGZvciAobGV0IGJvYXJkQ2VsbCBvZiByb3cpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGJvYXJkQ2VsbFswXTtcbiAgICAgICAgaWYgKHggPT09IGNlbGwueCAmJiB5ID09PSBjZWxsLnkpIHJldHVybiBjZWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAoaGVhZCwgdGFpbCkgPT4ge1xuICAgIGlmICghKGhlYWQgaW5zdGFuY2VvZiBBcnJheSkgfHwgISh0YWlsIGluc3RhbmNlb2YgQXJyYXkpKVxuICAgICAgdGhyb3cgRXJyb3IoJ2hlYWQgYW5kIHRhaWwgbXVzdCBiZSBhcnJheXMgcmVwcmVzZW50aW5nIGNvb3JkaW5hdGVzIScpO1xuXG4gICAgbGV0IHNoaXA7XG4gICAgY29uc3Qgc2hpcENlbGxzID0gW107XG4gICAgbGV0IGRpcmVjdGlvbiA9ICdpbnZhbGlkJztcbiAgICBsZXQgc2hpcExlbmd0aDtcblxuICAgIGlmIChoZWFkWzBdID09PSB0YWlsWzBdICYmIGhlYWRbMV0gPT09IHRhaWxbMV0pIGRpcmVjdGlvbiA9ICdzaW5nbGUtY2VsbCc7XG4gICAgZWxzZSBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSkgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICBlbHNlIGlmIChoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBjb25zdCBoZWFkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhoZWFkWzBdLCBoZWFkWzFdKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh0YWlsWzBdLCB0YWlsWzFdKTtcbiAgICBzaGlwQ2VsbHMucHVzaChoZWFkQ2VsbCk7XG4gICAgc2hpcENlbGxzLnB1c2godGFpbENlbGwpO1xuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2ludmFsaWQnIHx8ICFjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eShoZWFkLCB0YWlsKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnc2luZ2xlLWNlbGwnKSB7XG4gICAgICBzaGlwID0gU2hpcCgxKTtcbiAgICAgIC8vIGNhc2Ugb2Ygc2luZ2xlLWNlbGwgYm9hdCwgcmVtb3ZlIHRoZSBkb3VibGUgY29vcmRpbmF0ZSBmcm9tIGFyclxuICAgICAgc2hpcENlbGxzLnNoaWZ0KCk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgc2hpcExlbmd0aCA9IE1hdGguYWJzKGhlYWRbMF0gLSB0YWlsWzBdKSArIDE7XG4gICAgICBzaGlwID0gU2hpcChzaGlwTGVuZ3RoKTtcbiAgICAgIGNvbnN0IGNlbGxzT2JqID0gZmluZE1pc3NpbmdCb2F0Q2VsbHMoaGVhZCwgc2hpcExlbmd0aCwgJ2hvcml6b250YWwnKTtcbiAgICAgIGNvbnN0IG1pZGRsZUNlbGxzID0gY2VsbHNPYmoubWlkZGxlQ2VsbHM7XG4gICAgICBzaGlwQ2VsbHMucHVzaCguLi5taWRkbGVDZWxscyk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHNoaXBMZW5ndGggPSBNYXRoLmFicyhoZWFkWzFdIC0gdGFpbFsxXSkgKyAxO1xuICAgICAgc2hpcCA9IFNoaXAoc2hpcExlbmd0aCk7XG4gICAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsICd2ZXJ0aWNhbCcpO1xuICAgICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAgIHNoaXBDZWxscy5wdXNoKC4uLm1pZGRsZUNlbGxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBjZWxsc09iaiA9IGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIHNoaXBMZW5ndGgsIGRpcmVjdGlvbik7XG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAvLyBpZiB2YWxpZCBjb29yZHMsIGFkZCB0aGUgc2hpcCBib3RoIHRvIHRoZSBib2FyZCBhbmQgdGhlIHNoaXAgYXJyYXlcbiAgICBpZiAoY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHkoaGVhZCwgdGFpbCwgbWlkZGxlQ2VsbHMpKSB7XG4gICAgICBzaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4gKGNlbGwuaGVsZFNoaXAgPSBzaGlwKSk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZpbmRNaXNzaW5nQm9hdENlbGxzKGhlYWQsIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgY2VsbE51bWJlck5vdEZvdW5kID0gbGVuZ3RoIC0gMTtcbiAgICBjb25zdCByZXN0T2ZDZWxscyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY2VsbE51bWJlck5vdEZvdW5kOyBpKyspIHtcbiAgICAgICAgY29uc3QgZml4ZWRDb29yZCA9IGhlYWRbMV07XG4gICAgICAgIGNvbnN0IHZhckNvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh2YXJDb29yZCArIGksIGZpeGVkQ29vcmQpO1xuICAgICAgICByZXN0T2ZDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFswXTtcbiAgICAgICAgY29uc3QgdmFyQ29vcmQgPSBoZWFkWzFdO1xuICAgICAgICBjb25zdCBjZWxsSW5CZXR3ZWVuID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGZpeGVkQ29vcmQsIHZhckNvb3JkICsgaSk7XG4gICAgICAgIHJlc3RPZkNlbGxzLnB1c2goY2VsbEluQmV0d2Vlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbWlkZGxlQ2VsbHMgPSByZXN0T2ZDZWxscy5zbGljZSgwLCByZXN0T2ZDZWxscy5sZW5ndGggLSAxKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IHJlc3RPZkNlbGxzW3Jlc3RPZkNlbGxzLmxlbmd0aCAtIDFdO1xuXG4gICAgcmV0dXJuIHsgbWlkZGxlQ2VsbHMsIHRhaWxDZWxsIH07XG4gIH1cblxuICBjb25zdCBjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eSA9IChoZWFkLCB0YWlsLCBtaXNzaW5nQ2VsbHMpID0+IHtcbiAgICBsZXQgdmFsaWQgPSB0cnVlO1xuXG4gICAgaWYgKFxuICAgICAgaGVhZFswXSA8IDEgfHxcbiAgICAgIGhlYWRbMF0gPiAxMCB8fFxuICAgICAgaGVhZFsxXSA8IDEgfHxcbiAgICAgIGhlYWRbMV0gPiAxMCB8fFxuICAgICAgdGFpbFswXSA8IDEgfHxcbiAgICAgIHRhaWxbMF0gPiAxMCB8fFxuICAgICAgdGFpbFsxXSA8IDEgfHxcbiAgICAgIHRhaWxbMV0gPiAxMFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobWlzc2luZ0NlbGxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgaGVhZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoaGVhZFswXSwgaGVhZFsxXSk7XG4gICAgICAgIGNvbnN0IHRhaWxDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHRhaWxbMF0sIHRhaWxbMV0pO1xuICAgICAgICBjb25zdCBhbGxCb2F0Q2VsbHMgPSBbaGVhZENlbGwsIHRhaWxDZWxsXS5jb25jYXQobWlzc2luZ0NlbGxzKTtcblxuICAgICAgICBhbGxCb2F0Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoeCwgeSkgPT4ge1xuICAgIGlmIChjaGVja0F0dGFja1ZhbGlkaXR5KHgsIHkpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9XG5cbiAgICBjb25zdCBhdHRhY2tlZENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoeCwgeSk7XG4gICAgYXR0YWNrZWRDZWxsLmlzSGl0ID0gdHJ1ZTtcblxuICAgIGlmIChhdHRhY2tlZENlbGwuaGVsZFNoaXAgIT09IG51bGwpIHtcbiAgICAgIGhpdHMucHVzaCh7IHgsIHkgfSk7XG4gICAgICBhdHRhY2tlZENlbGwuaGVsZFNoaXAuZ2V0SGl0KCk7XG4gICAgICBpZiAoY2hlY2tHYW1lT3ZlcigpKSByZXR1cm4gJ2dhbWUtb3Zlcic7XG4gICAgICAvLyBpZiB0aGUgc2hpcCBoYXMgYmVlbiBzdW5rLCByZXR1cm4gdGhlIHNoaXBcbiAgICAgIGlmIChhdHRhY2tlZENlbGwuaGVsZFNoaXAuY2hlY2tJZlN1bmsoKSkgcmV0dXJuIGF0dGFja2VkQ2VsbC5oZWxkU2hpcDtcbiAgICAgIHJldHVybiAnaGl0JztcbiAgICB9IGVsc2Uge1xuICAgICAgbWlzc2VzLnB1c2goeyB4LCB5IH0pO1xuICAgICAgcmV0dXJuICdtaXNzJztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tBdHRhY2tWYWxpZGl0eSA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKHggPCAxIHx8IHggPiAxMCB8fCB5IDwgMSB8fCB5ID4gMTApIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGFsbEF0dGFja3MgPSBoaXRzLmNvbmNhdChtaXNzZXMpO1xuICAgIGZvciAobGV0IGF0dGFjayBvZiBhbGxBdHRhY2tzKSB7XG4gICAgICBpZiAoYXR0YWNrLnggPT09IHggJiYgYXR0YWNrLnkgPT09IHkpIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBjaGVja0dhbWVPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNlbGxOdW1iZXJIb2xkaW5nQm9hdHMgPSBzaGlwcy5yZWR1Y2UoXG4gICAgICAodG90YWwsIHNoaXApID0+ICh0b3RhbCArPSBzaGlwLmxlbmd0aCksXG4gICAgICAwXG4gICAgKTtcblxuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gY2VsbE51bWJlckhvbGRpbmdCb2F0cykge1xuICAgICAgcmVzZXRCb2FyZCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlc2V0Qm9hcmQgPSAoKSA9PiB7XG4gICAgYm9hcmQgPSBbXTtcbiAgICBnZW5lcmF0ZUJvYXJkKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICByZXR1cm5Cb2FyZCxcbiAgICBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMsXG4gICAgY2hlY2tCb2F0UGxhY2VtZW50VmFsaWRpdHksXG4gICAgZmluZE1pc3NpbmdCb2F0Q2VsbHMsXG4gIH07XG59O1xuIiwiaW1wb3J0IHsgR2FtZUJvYXJkIH0gZnJvbSBcIi4vZ2FtZS1ib2FyZFwiO1xuXG5leHBvcnQgY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcblxuICByZXR1cm4geyBwbGF5ZXJCb2FyZCwgbmFtZSB9O1xufTtcbiIsImV4cG9ydCBjb25zdCBTaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgaGl0cyA9IDA7XG5cbiAgY29uc3QgZ2V0SGl0ID0gKCkgPT4ge1xuICAgIGhpdHMrKztcbiAgfVxuXG4gIGNvbnN0IGNoZWNrSWZTdW5rID0gKCkgPT4ge1xuICAgIGlmIChoaXRzID09PSBsZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHsgbGVuZ3RoLCBnZXRIaXQsIGNoZWNrSWZTdW5rfTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vbW9kZWxzL3BsYXllcic7XG5pbXBvcnQge1xuICBkaXNwbGF5R2FtZUJvYXJkLFxuICBzd2l0Y2hTZWN0aW9uLFxuICB0cmFuc2l0aW9uQmFja2dyb3VuZCxcbiAgYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20sXG4gIHBsYWNlU2hpcERvbSxcbiAgZmluZERvbUNlbGxBdENvb3JkaW5hdGVzLFxuICBtYXJrU3Vua1NoaXAsXG4gIHJlbW92ZURvbU9sZEJvYXJkLFxufSBmcm9tICcuL2RvbS9kb20tbWV0aG9kcyc7XG5cbmNvbnN0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgY29uc3Qgc3RhcnRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtc3RhcnQnKTtcbiAgc3dpdGNoU2VjdGlvbignbGFuZGluZycpO1xuICB0cmFuc2l0aW9uQmFja2dyb3VuZCgnbGFuZGluZycpO1xuXG4gIHN0b3BBdWRpb1dhdmVzKCk7XG4gIGNvbnN0IGludHJvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keSBhdWRpbycpO1xuICBjb25zdCBhdWRpb0RvbUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zb3VuZC1zdGFydCBpbWcnKTtcbiAgaGFuZGxlQXVkaW8oaW50cm8sJ29uJywgYXVkaW9Eb21CdXR0b24pO1xuXG4gIHN0YXJ0Rm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBzZWNvbmRDYXB0YWluID0gaGFuZGxlQUlTaGlwUGxhY2VtZW50KCk7XG4gICAgcnVuU2hpcFBsYWNlbWVudFNlY3Rpb24oKGZpcnN0Q2FwdGFpbikgPT4ge1xuICAgICAgcnVuQmF0dGxlU2VjdGlvbihmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGhhbmRsZUF1ZGlvKGF1ZGlvRmlsZSwgc3RhdGUsIGRvbUJ1dHRvbnMpIHtcbiAgYXVkaW9GaWxlLnBhdXNlKCk7XG4gIGRvbUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgaWYgKHN0YXRlID09PSAnb24nKSB7XG4gICAgICBhdWRpb0ZpbGUucGxheSgpXG4gICAgICBidXR0b24uc3JjID0gJy4uL3NyYy9hc3NldHMvbXVzaWMvdm9sdW1lLW9mZi5zdmcnO1xuICAgIH0gZWxzZSBidXR0b24uc3JjID0gJy4uL3NyYy9hc3NldHMvbXVzaWMvdm9sdW1lLW9uLnN2Zyc7XG4gIH0pO1xuXG4gIGRvbUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PlxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKCdjbGFzcycpID09PSAnYXVkaW8tb24nKSB7XG4gICAgICAgIGRvbUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgYXVkaW9GaWxlLnBhdXNlKCk7XG4gICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2F1ZGlvLW9uJyk7XG4gICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2F1ZGlvLW9mZicpO1xuICAgICAgICAgIGJ1dHRvbi5zcmMgPSAnLi4vc3JjL2Fzc2V0cy9tdXNpYy92b2x1bWUtb24uc3ZnJztcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb21CdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgIGF1ZGlvRmlsZS5wbGF5KCk7XG4gICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2F1ZGlvLW9uJyk7XG4gICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2F1ZGlvLW9mZicpO1xuICAgICAgICAgIGJ1dHRvbi5zcmMgPSAnLi4vc3JjL2Fzc2V0cy9tdXNpYy92b2x1bWUtb2ZmLnN2Zyc7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG59XG5cbmZ1bmN0aW9uIHN0b3BBdWRpb0ludHJvKCkge1xuICBjb25zdCBhdWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgYXVkaW8nKTtcbiAgYXVkaW8ucGF1c2UoKTtcbn1cblxuZnVuY3Rpb24gc3RvcEF1ZGlvV2F2ZXMoKSB7XG4gIGNvbnN0IGF1ZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZS1zZWN0aW9uIGF1ZGlvJyk7XG4gIGF1ZGlvLnBhdXNlKCk7XG59XG5cbmZ1bmN0aW9uIHJ1blNoaXBQbGFjZW1lbnRTZWN0aW9uKGNhbGxiYWNrKSB7XG4gIHN3aXRjaFNlY3Rpb24oJ3NoaXAtcGxhY2VtZW50Jyk7XG4gIHRyYW5zaXRpb25CYWNrZ3JvdW5kKCk7XG5cbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtc3RhcnQgaW5wdXQnKTtcbiAgY29uc3QgbmFtZVNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcC10by1wbGFjZSAucGxheWVyLW5hbWUnKTtcbiAgY29uc3QgZ2FtZUJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IC5nYW1lLWJvYXJkJyk7XG4gIGNvbnN0IHNoaXBzID0gWydHYWxsZW9uJywgJ0ZyaWdhdGUnLCAnQnJpZ2FudGluZScsICdTY2hvb25lcicsICdTbG9vcCddO1xuXG4gIG5hbWVTcGFuLnRleHRDb250ZW50ID0gbmFtZUlucHV0LnZhbHVlO1xuICBjb25zdCBmaXJzdENhcHRhaW4gPSBQbGF5ZXIobmFtZUlucHV0LnZhbHVlKTtcbiAgY29uc3QgYm9hcmRPYmogPSBmaXJzdENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGNvbnN0IGJvYXJkID0gYm9hcmRPYmoucmV0dXJuQm9hcmQoKTtcblxuICBkaXNwbGF5R2FtZUJvYXJkKGJvYXJkLCBnYW1lQm9hcmREb20pO1xuICBoYW5kbGVDZWxsRXZlbnRzKGZpcnN0Q2FwdGFpbiwgc2hpcHMsIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2VsbEV2ZW50cyhmaXJzdENhcHRhaW4sIHNoaXBzLCBjYWxsYmFjaykge1xuICBjb25zdCBheGlzQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IGJ1dHRvbicpO1xuICBjb25zdCBheGlzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtcGxhY2VtZW50IC5heGlzJyk7XG4gIGNvbnN0IGJvYXJkT2JqID0gZmlyc3RDYXB0YWluLnBsYXllckJvYXJkO1xuICBsZXQgYXhpcyA9ICdob3Jpem9udGFsJztcblxuICBheGlzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChheGlzID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF4aXNEb20udGV4dENvbnRlbnQgPSAnVmVydGljYWwnO1xuICAgICAgYXhpcyA9ICd2ZXJ0aWNhbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF4aXNEb20udGV4dENvbnRlbnQgPSAnSG9yaXpvbnRhbCc7XG4gICAgICBheGlzID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICBsZXQgc2hpcHNQbGFjZWRJZHggPSAwO1xuXG4gIGNlbGxzRG9tLmZvckVhY2goKGRvbUNlbGwpID0+IHtcbiAgICBsZXQgY2VsbFg7XG4gICAgbGV0IGNlbGxZO1xuICAgIGNlbGxYID0gZG9tQ2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpO1xuICAgIGNlbGxZID0gZG9tQ2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpO1xuICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGJvYXJkT2JqLmZpbmRDZWxsQXRDb29yZGluYXRlcyhcbiAgICAgIE51bWJlcihjZWxsWCksXG4gICAgICBOdW1iZXIoY2VsbFkpXG4gICAgKTtcblxuICAgIGRvbUNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgaWYgKHNoaXBzUGxhY2VkSWR4ID4gNCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2hpcFRvUGxhY2UgPSBzaGlwc1tzaGlwc1BsYWNlZElkeF07XG4gICAgICBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVG9QbGFjZSwgYXhpcywgYm9hcmRDZWxsLCBib2FyZE9iaik7XG4gICAgfSk7XG5cbiAgICBkb21DZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2hpcFRvUGxhY2UgPSBzaGlwc1tzaGlwc1BsYWNlZElkeF07XG4gICAgICBpZiAoaGFuZGxlU2hpcFBsYWNlbWVudChzaGlwVG9QbGFjZSwgYm9hcmRDZWxsLCBib2FyZE9iaiwgYXhpcykpIHtcbiAgICAgICAgc2hpcHNQbGFjZWRJZHgrKztcbiAgICAgICAgaWYgKHNoaXBzUGxhY2VkSWR4ID09PSA1KSByZXR1cm4gY2FsbGJhY2soZmlyc3RDYXB0YWluKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNoaXBQbGFjZW1lbnQoc2hpcFRvUGxhY2UsIGJvYXJkQ2VsbCwgYm9hcmQsIGF4aXMpIHtcbiAgY29uc3Qgc2hpcERhdGEgPSBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVG9QbGFjZSwgYXhpcywgYm9hcmRDZWxsLCBib2FyZCk7XG4gIGlmIChzaGlwRGF0YSkge1xuICAgIGlmIChib2FyZC5wbGFjZVNoaXAoc2hpcERhdGEuc2hpcEhlYWQsIHNoaXBEYXRhLnNoaXBUYWlsKSkge1xuICAgICAgcGxhY2VTaGlwRG9tKHNoaXBEYXRhLmFsbERvbVNoaXBDZWxscyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQUlTaGlwUGxhY2VtZW50KCkge1xuICBjb25zdCBzZWNvbmRDYXB0YWluID0gUGxheWVyKCdjaGF0LUdQVCcpO1xuICBjb25zdCBib2FyZCA9IHNlY29uZENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGxldCBzaGlwc1BsYWNlZCA9IDE7XG5cbiAgd2hpbGUgKHNoaXBzUGxhY2VkIDwgNikge1xuICAgIGNvbnN0IHNoaXBDb29yZHMgPSBnZW5lcmF0ZVZhbGlkUmFuZG9tU2hpcENvb3JkcyhzaGlwc1BsYWNlZCwgYm9hcmQpO1xuICAgIGlmIChib2FyZC5wbGFjZVNoaXAoc2hpcENvb3Jkcy5zaGlwSGVhZCwgc2hpcENvb3Jkcy5zaGlwVGFpbCkpIHtcbiAgICAgIHNoaXBzUGxhY2VkKys7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNlY29uZENhcHRhaW47XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKSB7XG4gIGNvbnN0IHNoaXBIZWFkID0gW1xuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEsXG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMSxcbiAgXTtcbiAgbGV0IGRpcmVjdGlvbjtcblxuICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICBlbHNlIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG5cbiAgY29uc3QgY2VsbHNPYmogPSBib2FyZC5maW5kTWlzc2luZ0JvYXRDZWxscyhzaGlwSGVhZCwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuICBjb25zdCBzaGlwVGFpbE9iaiA9IGNlbGxzT2JqLnRhaWxDZWxsO1xuXG4gIHJldHVybiB7IHNoaXBIZWFkLCBzaGlwVGFpbE9iaiB9O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVZhbGlkUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKSB7XG4gIGxldCB2YWxpZFNoaXBDb29yZEZvdW5kID0gZmFsc2U7XG4gIGxldCBzaGlwSGVhZDtcbiAgbGV0IHNoaXBUYWlsO1xuXG4gIHdoaWxlICghdmFsaWRTaGlwQ29vcmRGb3VuZCkge1xuICAgIGNvbnN0IGNvb3JkT2JqID0gZ2VuZXJhdGVSYW5kb21TaGlwQ29vcmRzKGxlbmd0aCwgYm9hcmQpO1xuICAgIGNvbnN0IHRhaWxPYmogPSBjb29yZE9iai5zaGlwVGFpbE9iajtcbiAgICBsZXQgc2hpcEhlYWRBdHRlbXB0ID0gY29vcmRPYmouc2hpcEhlYWQ7XG4gICAgbGV0IHNoaXBUYWlsQXR0ZW1wdCA9IFt0YWlsT2JqPy54LCB0YWlsT2JqPy55XTtcbiAgICAvLyBpZiBsZW5ndGggaXMgMSwgd2UgZG9uJ3QgbmVlZCB0byBmaW5kIHRhaWwgY29vcmRzXG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFsaWRTaGlwQ29vcmRGb3VuZCA9IHRydWU7XG4gICAgICBzaGlwVGFpbCA9IHNoaXBIZWFkQXR0ZW1wdDtcbiAgICAgIHNoaXBIZWFkID0gc2hpcEhlYWRBdHRlbXB0O1xuICAgIH1cbiAgICBpZiAoc2hpcFRhaWxBdHRlbXB0WzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbGlkU2hpcENvb3JkRm91bmQgPSB0cnVlO1xuICAgICAgc2hpcEhlYWQgPSBzaGlwSGVhZEF0dGVtcHQ7XG4gICAgICBzaGlwVGFpbCA9IHNoaXBUYWlsQXR0ZW1wdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWwgfTtcbn1cblxuZnVuY3Rpb24gcnVuQmF0dGxlU2VjdGlvbihmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pIHtcbiAgc3dpdGNoU2VjdGlvbignYmF0dGxlLXNlY3Rpb24nKTtcbiAgdHJhbnNpdGlvbkJhY2tncm91bmQoKTtcblxuICBzdG9wQXVkaW9JbnRybygpO1xuICBjb25zdCB3YXZlU291bmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmF0dGxlLXNlY3Rpb24gYXVkaW8nKTtcbiAgY29uc3QgZG9tQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zb3VuZCBpbWcnKVxuICBoYW5kbGVBdWRpbyh3YXZlU291bmQsICdvbicsIGRvbUJ1dHRvbnMpXG5cbiAgY29uc3QgcGxheWVyQm9hcmRPYmogPSBmaXJzdENhcHRhaW4ucGxheWVyQm9hcmQ7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmRPYmogPSBzZWNvbmRDYXB0YWluLnBsYXllckJvYXJkO1xuXG4gIGNvbnN0IHBsYXllckJvYXJkID0gcGxheWVyQm9hcmRPYmoucmV0dXJuQm9hcmQoKTtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZCA9IG9wcG9uZW50Qm9hcmRPYmoucmV0dXJuQm9hcmQoKTtcbiAgY29uc3QgcGxheWVyQm9hcmREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmREb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWktYm9hcmQnKTtcblxuICBkaXNwbGF5R2FtZUJvYXJkKHBsYXllckJvYXJkLCBwbGF5ZXJCb2FyZERvbSk7XG4gIGRpc3BsYXlHYW1lQm9hcmQob3Bwb25lbnRCb2FyZCwgb3Bwb25lbnRCb2FyZERvbSk7XG5cbiAgcGxheUdhbWUoZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluKTtcbn1cblxuZnVuY3Rpb24gcGxheUdhbWUoZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluKSB7XG4gIGNvbnN0IG9wcG9uZW50Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZW5lbXktd2F0ZXJzIC5ib2FyZC1jZWxsJyk7XG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tcHQnKTtcbiAgY29uc3QgcGxheWVyTmFtZSA9IGZpcnN0Q2FwdGFpbi5uYW1lO1xuICBsZXQgYXdhaXRlZFR1cm4gPSB0cnVlO1xuXG4gIHByb21wdC50ZXh0Q29udGVudCA9IGBBd2FpdGluZyB5ZXIgb3JkZXJzLCBBZG1pcmFsICR7cGxheWVyTmFtZX0hYDtcbiAgb3Bwb25lbnRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChhd2FpdGVkVHVybiA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGNvbnN0IGNlbGxYID0gTnVtYmVyKGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXgnKSk7XG4gICAgICBjb25zdCBjZWxsWSA9IE51bWJlcihjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15JykpO1xuICAgICAgY29uc3QgYm9hcmRDZWxsID0geyBjZWxsWCwgY2VsbFkgfTtcblxuICAgICAgaWYgKCFwbGF5ZXJBdHRhY2soZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluLCBib2FyZENlbGwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF3YWl0ZWRUdXJuID0gZmFsc2U7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIW9wcG9uZW50QXR0YWNrKHNlY29uZENhcHRhaW4sIGZpcnN0Q2FwdGFpbikpXG4gICAgICAgICAgb3Bwb25lbnRBdHRhY2soc2Vjb25kQ2FwdGFpbiwgZmlyc3RDYXB0YWluKTtcbiAgICAgICAgYXdhaXRlZFR1cm4gPSB0cnVlO1xuICAgICAgfSwgMTAwKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBsYXllckF0dGFjayhmaXJzdENhcHRhaW4sIG9wcG9uZW50LCBjZWxsKSB7XG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tcHQnKTtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZE9iaiA9IG9wcG9uZW50LnBsYXllckJvYXJkO1xuICBjb25zdCBvcHBvbmVudE5hbWUgPSBvcHBvbmVudC5uYW1lO1xuICBjb25zdCBuYW1lID0gZmlyc3RDYXB0YWluLm5hbWU7XG5cbiAgY29uc3QgYXR0YWNrID0gb3Bwb25lbnRCb2FyZE9iai5yZWNlaXZlQXR0YWNrKGNlbGwuY2VsbFgsIGNlbGwuY2VsbFkpO1xuICBjb25zdCBkb21DZWxsID0gZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKGNlbGwuY2VsbFgsIGNlbGwuY2VsbFksICdlbmVteScpO1xuXG4gIGlmIChhdHRhY2sgPT09ICdnYW1lLW92ZXInKSB7XG4gICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICBnYW1lT3ZlcihuYW1lKTtcbiAgfSBlbHNlIGlmIChhdHRhY2sgPT09ICdpbnZhbGlkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoYXR0YWNrID09PSAnaGl0Jykge1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYFlvdSBmaXJlIGEgc2hvdCBpbiBlbmVteSB3YXRlcnMgLi4uIGFuZCBoaXQhYDtcbiAgICAgIGRvbUNlbGw/LmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgIH1cbiAgICAvLyBhdHRhY2sgcmV0dXJucyB0aGUgYm9hdCBvYmplY3QgaW4gY2FzZSBvZiBzdW5rXG4gICAgaWYgKHR5cGVvZiBhdHRhY2sgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBzaGlwTGVuZ3RoID0gYXR0YWNrLmxlbmd0aDtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gZ2V0U2hpcE5hbWUoc2hpcExlbmd0aCk7XG4gICAgICBwcm9tcHQudGV4dENvbnRlbnQgPSBgWW91IG1hbmFnZWQgdG8gc2luayAke29wcG9uZW50TmFtZX0ncyAke3NoaXBOYW1lfSBmbGVldC4gR29vZCBqb2IhYDtcbiAgICAgIG1hcmtTdW5rU2hpcChzaGlwTGVuZ3RoLCAnb3Bwb25lbnQnKTtcbiAgICB9XG4gICAgaWYgKGF0dGFjayA9PT0gJ21pc3MnKSB7XG4gICAgICBwcm9tcHQudGV4dENvbnRlbnQgPSBgWW91IGZpcmUgYSBzaG90IGluIGVuZW15IHdhdGVycyAuLi4gYW5kIG1pc3MhYDtcbiAgICAgIGRvbUNlbGw/LmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBhdHRhY2ssIGNlbGwgfTtcbn1cblxuZnVuY3Rpb24gb3Bwb25lbnRBdHRhY2soYXR0YWNrZXIsIG9wcG9uZW50KSB7XG4gIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tcHQnKTtcbiAgY29uc3Qgb3Bwb25lbnRCb2FyZE9iaiA9IG9wcG9uZW50LnBsYXllckJvYXJkO1xuICBjb25zdCBuYW1lID0gYXR0YWNrZXIubmFtZTtcbiAgY29uc3Qgb3Bwb25lbnROYW1lID0gb3Bwb25lbnQubmFtZTtcblxuICBjb25zdCByYW5kQ2VsbCA9IGdlbmVyYXRlUmFuZG9tQXR0YWNrKCk7XG4gIGNvbnN0IGF0dGFjayA9IG9wcG9uZW50Qm9hcmRPYmoucmVjZWl2ZUF0dGFjayhyYW5kQ2VsbC54LCByYW5kQ2VsbC55KTtcbiAgY29uc3QgZG9tQ2VsbCA9IGZpbmREb21DZWxsQXRDb29yZGluYXRlcyhyYW5kQ2VsbC54LCByYW5kQ2VsbC55LCAncGxheWVyJyk7XG5cbiAgaWYgKGF0dGFjayA9PT0gJ2dhbWUtb3ZlcicpIHtcbiAgICBkb21DZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgIGdhbWVPdmVyKG9wcG9uZW50TmFtZSk7XG4gIH0gZWxzZSBpZiAoYXR0YWNrID09PSAnaW52YWxpZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGF0dGFjayA9PT0gJ2hpdCcpIHtcbiAgICAgIHByb21wdC50ZXh0Q29udGVudCA9IGAke25hbWV9IHNob290cyBhIGZpcmUgaW4geW91ciB3YXRlcnMgLi4uIGFuZCBoaXRzIWA7XG4gICAgICBkb21DZWxsPy5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICB9XG4gICAgLy8gYXR0YWNrIHJldHVybnMgdGhlIGJvYXQgb2JqZWN0IGluIGNhc2Ugb2Ygc3Vua1xuICAgIGlmICh0eXBlb2YgYXR0YWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IGF0dGFjay5sZW5ndGg7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IGdldFNoaXBOYW1lKHNoaXBMZW5ndGgpO1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYE9oIG5vLCB5b3VyICR7c2hpcE5hbWV9IGZsZWV0IGhhcyBiZWVuIHN1bmshYDtcbiAgICAgIG1hcmtTdW5rU2hpcChzaGlwTGVuZ3RoLCAncGxheWVyJyk7XG4gICAgfVxuICAgIGlmIChhdHRhY2sgPT09ICdtaXNzJykge1xuICAgICAgcHJvbXB0LnRleHRDb250ZW50ID0gYCR7bmFtZX0gc2hvb3RzIGEgZmlyZSBpbiB5b3VyIHdhdGVycyAuLi4gYW5kIG1pc3NlcyFgO1xuICAgICAgZG9tQ2VsbD8uY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBhdHRhY2ssIHJhbmRDZWxsIH07XG59XG5cbmZ1bmN0aW9uIGdldFNoaXBOYW1lKGxlbmd0aCkge1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiAnU2xvb3AnO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiAnU2Nob29uZXInO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiAnQnJpZ2FudGluZSc7XG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuICdGcmlnYXRlJztcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gJ0dhbGxlb24nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tQXR0YWNrKCkge1xuICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMTtcbiAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE7XG5cbiAgcmV0dXJuIHsgeCwgeSB9O1xufVxuXG5mdW5jdGlvbiBnYW1lT3Zlcih3aW5uZXIpIHtcbiAgc3dpdGNoU2VjdGlvbignZ2FtZS1vdmVyJyk7XG4gIHJlbW92ZURvbU9sZEJvYXJkKCk7XG5cbiAgY29uc3Qgd2lubmVyRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtb3ZlciAud2lubmVyJyk7XG4gIGNvbnN0IHBsYXlBZ2FpbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLW92ZXIgYnV0dG9uJyk7XG4gIHdpbm5lckRvbS50ZXh0Q29udGVudCA9IHdpbm5lcjtcblxuICBwbGF5QWdhaW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdGFydEdhbWUpO1xufVxuXG5zdGFydEdhbWUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==