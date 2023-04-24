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
/* harmony export */   "showSection": () => (/* binding */ showSection)
/* harmony export */ });
function displayGameBoard(board, domElement, player) {
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
        // display the ships on the board only for human player
        if (player === 'player')
          cellDom.classList.add(`ship-placed-${shipLength}`);
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

function showSection(sectionIndex) {
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    if (index === sectionIndex) {
      section.classList.add('active-section');
      section.classList.remove('hidden-section');
    } else {
      section.classList.remove('active-section');
      section.addEventListener(
        'transitionend',
        () => {
          section.classList.add('hidden-section');
        },
        { once: true }
      );
    }
  });
}

function placeShipDom(cells) {
  cells.forEach((cell) => {
    if (cells.length === 5) cell.classList.add('ship-placed-5');
    if (cells.length === 4) cell.classList.add('ship-placed-4');
    if (cells.length === 3) cell.classList.add('ship-placed-3');
    if (cells.length === 2) cell.classList.add('ship-placed-2');
    if (cells.length === 1) cell.classList.add('ship-placed-1');
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
    if (shipDom === shipLength) {
      if (shipLength === 5) cell.classList.add('sunk-5');
      if (shipLength === 4) cell.classList.add('sunk-4');
      if (shipLength === 3) cell.classList.add('sunk-3');
      if (shipLength === 2) cell.classList.add('sunk-2');
      if (shipLength === 1) cell.classList.add('sunk-1');
    }
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
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.showSection)(0);

  stopAudioWaves();
  const intro = document.querySelector('body audio');
  const audioDomButton = document.querySelectorAll('.sound-start img');
  handleAudio(intro, 'on', audioDomButton);

  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const secondCaptain = handleAIShipPlacement();
    runShipPlacementSection((firstCaptain) => {
      runBattleSection(firstCaptain, secondCaptain);
    });
  });
};

function playSoundEffect(src) {
  const body = document.querySelector('body');
  if (body.getAttribute('class') === 'audio-on') {
    const audio = new Audio(src);
    audio.play();
  }
}

function handleAudio(audioFile, state, domButtons) {
  const body = document.querySelector('body');

  audioFile.pause();
  domButtons.forEach((button) => {
    if (state === 'on') {
      audioFile.play();
      audioFile.loop = true;
      button.src = 'assets/music/volume-off.svg';
    } else button.src = 'assets/music/volume-on.svg';
  });

  domButtons.forEach((button) =>
    button.addEventListener('click', () => {
      if (button.getAttribute('class') === 'audio-on') {
        domButtons.forEach((button) => {
          audioFile.pause();
          button.classList.remove('audio-on');
          button.classList.add('audio-off');
          body.classList.remove('audio-on');
          body.classList.add('audio-off');
          button.src = 'assets/music/volume-on.svg';
        });
      } else {
        domButtons.forEach((button) => {
          audioFile.play();
          button.classList.add('audio-on');
          button.classList.remove('audio-off');
          body.classList.add('audio-on');
          body.classList.remove('audio-off');
          button.src = 'assets/music/volume-off.svg';
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
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.showSection)(1);

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
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.showSection)(2);

  stopAudioIntro();
  const waveSound = document.querySelector('.battle-section audio');
  const domButtons = document.querySelectorAll('.sound img');
  handleAudio(waveSound, 'on', domButtons);

  const playerBoardObj = firstCaptain.playerBoard;
  const opponentBoardObj = secondCaptain.playerBoard;

  const playerBoard = playerBoardObj.returnBoard();
  const opponentBoard = opponentBoardObj.returnBoard();
  const playerBoardDom = document.querySelector('.player-board');
  const opponentBoardDom = document.querySelector('.ai-board');

  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.displayGameBoard)(playerBoard, playerBoardDom, 'player');
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
        while (!opponentAttack(secondCaptain, firstCaptain))
          opponentAttack(secondCaptain, firstCaptain);
        setTimeout(() => {
          awaitedTurn = true;
        }, 2500);
      }, 3000);
    });
  });
}

function typeWriter(domElement, text, index) {
  if (text && typeof text === 'string' && index < text.length) {
    domElement.innerHTML += text.charAt(index);
    index++;
    setTimeout(function () {
      typeWriter(domElement, text, index);
    }, 40);
  }
}

function playerAttack(firstCaptain, opponent, cell) {
  const prompt = document.querySelector('.prompt');
  const opponentBoardObj = opponent.playerBoard;
  const opponentName = opponent.name;
  const name = firstCaptain.name;

  const attack = opponentBoardObj.receiveAttack(cell.cellX, cell.cellY);
  const domCell = (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.findDomCellAtCoordinates)(cell.cellX, cell.cellY, 'enemy');

  playSoundEffect('assets/music/cannon.mp3');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    gameOver(name);
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.innerHTML = '';
      const text = `You fire a shot in enemy waters ... and hit!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('assets/music/hit.mp3');
        addMissHit(domCell, 'hit');
      }, 1000);
    }
    // attack returns the boat object in case of sunk
    if (typeof attack === 'object') {
      const shipLength = attack.length;
      const shipName = getShipName(shipLength);
      prompt.innerHTML = '';
      const text = `You managed to sink ${opponentName}'s ${shipName} fleet. Good job!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('assets/music/hit.mp3');
        addMissHit(domCell, 'hit');
        (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.markSunkShip)(shipLength, 'opponent');
      }, 1000);
    }
    if (attack === 'miss') {
      prompt.innerHTML = '';
      const text = `You fire a shot in enemy waters ... and miss!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('assets/music/miss.mp3');
        addMissHit(domCell, 'miss');
      }, 1200);
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

  playSoundEffect('assets/music/cannon.mp3');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    gameOver(opponentName);
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.innerHTML = '';
      const text = `${name} shoots a fire in your waters ... and hits!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('assets/music/hit.mp3');
        addMissHit(domCell, 'hit');
      }, 1000);
    }
    // attack returns the boat object in case of sunk
    if (typeof attack === 'object') {
      const shipLength = attack.length;
      const shipName = getShipName(shipLength);
      prompt.innerHTML = '';

      const text = `Oh no, your ${shipName} fleet has been sunk!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.markSunkShip)(shipLength, 'player');
    }
    if (attack === 'miss') {
      prompt.innerHTML = '';
      const text = `${name} shoots a fire in your waters ... and misses!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('assets/music/miss.mp3');
        addMissHit(domCell, 'miss');
      }, 1200);
    }
  }
  return { attack, randCell };
}

function addMissHit(cell, attack) {
  if (attack === 'miss') cell?.classList.add('miss');
  if (attack === 'hit') cell?.classList.add('hit');
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
  (0,_dom_dom_methods__WEBPACK_IMPORTED_MODULE_1__.showSection)(3);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUEsa0NBQWtDLFVBQVU7QUFDNUM7QUFDQTtBQUNBLE1BQU0sOERBQVk7QUFDbEI7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLE1BQU07QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBLEVBQUUsNkRBQVc7QUFDYixFQUFFLG1FQUFpQjs7QUFFbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL2RvbS9kb20tbWV0aG9kcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2pzL21vZGVscy9jZWxsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL2dhbWUtYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9qcy9tb2RlbHMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvbW9kZWxzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlHYW1lQm9hcmQoYm9hcmQsIGRvbUVsZW1lbnQsIHBsYXllcikge1xuICBkb21FbGVtZW50LmlubmVySFRNTCA9ICcnO1xuXG4gIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgIGZvciAobGV0IGNlbGxBcnIgb2Ygcm93KSB7XG4gICAgICBjb25zdCBjZWxsID0gY2VsbEFyclswXTtcbiAgICAgIGNvbnN0IGNlbGxEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNlbGxEb20uY2xhc3NMaXN0LmFkZCgnYm9hcmQtY2VsbCcpO1xuICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEteCcsIGNlbGwueCk7XG4gICAgICBjZWxsRG9tLnNldEF0dHJpYnV0ZSgnZGF0YS15JywgY2VsbC55KTtcbiAgICAgIGlmIChjZWxsLmhlbGRTaGlwICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBjZWxsLmhlbGRTaGlwLmxlbmd0aDtcbiAgICAgICAgY2VsbERvbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hpcCcsIHNoaXBMZW5ndGgpO1xuICAgICAgICAvLyBkaXNwbGF5IHRoZSBzaGlwcyBvbiB0aGUgYm9hcmQgb25seSBmb3IgaHVtYW4gcGxheWVyXG4gICAgICAgIGlmIChwbGF5ZXIgPT09ICdwbGF5ZXInKVxuICAgICAgICAgIGNlbGxEb20uY2xhc3NMaXN0LmFkZChgc2hpcC1wbGFjZWQtJHtzaGlwTGVuZ3RofWApO1xuICAgICAgfVxuICAgICAgZG9tRWxlbWVudC5hcHBlbmRDaGlsZChjZWxsRG9tKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2hpcERldGFpbHMoc2hpcFR5cGUpIHtcbiAgY29uc3Qgc2hpcHMgPSB7XG4gICAgR2FsbGVvbjogNSxcbiAgICBGcmlnYXRlOiA0LFxuICAgIEJyaWdhbnRpbmU6IDMsXG4gICAgU2Nob29uZXI6IDIsXG4gICAgU2xvb3A6IDEsXG4gIH07XG4gIGxldCBzaGlwO1xuICBsZXQgbGVuZ3RoO1xuXG4gIHN3aXRjaCAoc2hpcFR5cGUpIHtcbiAgICBjYXNlICdHYWxsZW9uJzpcbiAgICAgIHNoaXAgPSBPYmplY3Qua2V5cyhzaGlwcylbMF07XG4gICAgICBsZW5ndGggPSBzaGlwc1tzaGlwXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ZyaWdhdGUnOlxuICAgICAgc2hpcCA9IE9iamVjdC5rZXlzKHNoaXBzKVsxXTtcbiAgICAgIGxlbmd0aCA9IHNoaXBzW3NoaXBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQnJpZ2FudGluZSc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzJdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTY2hvb25lcic6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzNdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTbG9vcCc6XG4gICAgICBzaGlwID0gT2JqZWN0LmtleXMoc2hpcHMpWzRdO1xuICAgICAgbGVuZ3RoID0gc2hpcHNbc2hpcF07XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4geyBzaGlwLCBsZW5ndGggfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhdHRlbXB0U2hpcFBsYWNlbWVudERvbShzaGlwVHlwZSwgYXhpcywgY2VsbCwgYm9hcmQpIHtcbiAgY29uc3Qgc2hpcERhdGEgPSBnZXRTaGlwRGV0YWlscyhzaGlwVHlwZSk7XG4gIGNvbnN0IHNoaXBTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdG8tcGxhY2UgLnNoaXAnKTtcbiAgc2hpcFNwYW4udGV4dENvbnRlbnQgPSBzaGlwRGF0YS5zaGlwO1xuICBjb25zdCBsZW5ndGggPSBzaGlwRGF0YS5sZW5ndGg7XG5cbiAgY29uc3Qgc2hpcEhlYWQgPSBbY2VsbC54LCBjZWxsLnldO1xuICBsZXQgc2hpcFRhaWxYO1xuICBsZXQgc2hpcFRhaWxZO1xuXG4gIGlmIChheGlzID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBzaGlwVGFpbFggPSBzaGlwSGVhZFswXSArIGxlbmd0aCAtIDE7XG4gICAgc2hpcFRhaWxZID0gc2hpcEhlYWRbMV07XG4gIH0gZWxzZSBpZiAoYXhpcyA9PT0gJ3ZlcnRpY2FsJykge1xuICAgIHNoaXBUYWlsWCA9IHNoaXBIZWFkWzBdO1xuICAgIHNoaXBUYWlsWSA9IHNoaXBIZWFkWzFdICsgbGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGNvbnN0IHNoaXBUYWlsID0gW3NoaXBUYWlsWCwgc2hpcFRhaWxZXTtcbiAgY29uc3QgcmVzdFNoaXBDZWxscyA9IFtdO1xuICBjb25zdCBzaGlwSGVhZERvbSA9IFtmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoLi4uc2hpcEhlYWQpXTtcbiAgY29uc3Qgc2hpcFRhaWxEb20gPSBbZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKC4uLnNoaXBUYWlsKV07XG4gIGNvbnN0IHJlc3RTaGlwRG9tID0gW107XG4gIGNvbnN0IGNlbGxzT2JqID0gYm9hcmQuZmluZE1pc3NpbmdCb2F0Q2VsbHMoc2hpcEhlYWQsIGxlbmd0aCwgYXhpcyk7XG4gIGNvbnN0IG1pc3NpbmdDZWxscyA9IGNlbGxzT2JqLm1pZGRsZUNlbGxzO1xuICByZXN0U2hpcENlbGxzLnB1c2goLi4ubWlzc2luZ0NlbGxzKTtcblxuICBpZiAoIWJvYXJkLmNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KHNoaXBIZWFkLCBzaGlwVGFpbCwgcmVzdFNoaXBDZWxscykpIHtcbiAgICBtYXJrSW52YWxpZFNoaXBMb2NhdGlvbihzaGlwSGVhZERvbVswXSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJlc3RTaGlwQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgaWYgKGNlbGwgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgcmVzdFNoaXBEb20ucHVzaChmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoY2VsbC54LCBjZWxsLnkpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbERvbVNoaXBDZWxscyA9IHNoaXBIZWFkRG9tLmNvbmNhdChzaGlwVGFpbERvbSkuY29uY2F0KHJlc3RTaGlwRG9tKTtcbiAgICBtYXJrQXR0ZW1wdFRvUGxhY2VTaGlwKGFsbERvbVNoaXBDZWxscyk7XG5cbiAgICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWwsIGFsbERvbVNoaXBDZWxscyB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtJbnZhbGlkU2hpcExvY2F0aW9uKGNlbGwpIHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkLWxvY2F0aW9uJyk7XG4gIGNsZWFyRG9tQ2VsbEludmFsaWRpdHkoY2VsbCk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBdHRlbXB0VG9QbGFjZVNoaXAoY2VsbHMpIHtcbiAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnYXR0ZW1wdC1wbGFjZS1zaGlwJyk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd1NlY3Rpb24oc2VjdGlvbkluZGV4KSB7XG4gIGNvbnN0IHNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKTtcbiAgc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbiwgaW5kZXgpID0+IHtcbiAgICBpZiAoaW5kZXggPT09IHNlY3Rpb25JbmRleCkge1xuICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUtc2VjdGlvbicpO1xuICAgICAgc2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tc2VjdGlvbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZS1zZWN0aW9uJyk7XG4gICAgICBzZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuLXNlY3Rpb24nKTtcbiAgICAgICAgfSxcbiAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYWNlU2hpcERvbShjZWxscykge1xuICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgaWYgKGNlbGxzLmxlbmd0aCA9PT0gNSkgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZC01Jyk7XG4gICAgaWYgKGNlbGxzLmxlbmd0aCA9PT0gNCkgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZC00Jyk7XG4gICAgaWYgKGNlbGxzLmxlbmd0aCA9PT0gMykgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZC0zJyk7XG4gICAgaWYgKGNlbGxzLmxlbmd0aCA9PT0gMikgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZC0yJyk7XG4gICAgaWYgKGNlbGxzLmxlbmd0aCA9PT0gMSkgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwLXBsYWNlZC0xJyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjbGVhckRvbUNlbGxJbnZhbGlkaXR5KGNlbGwpIHtcbiAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZC1sb2NhdGlvbicpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJEb21DZWxsc0N1c3RvbUNvbG9yKGNlbGxzKSB7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYXR0ZW1wdC1wbGFjZS1zaGlwJykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKHgsIHksIHBsYXllcikge1xuICBsZXQgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQtY2VsbCcpO1xuICBsZXQgc2VhcmNoZWRDZWxsO1xuICBpZiAocGxheWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAocGxheWVyID09PSAncGxheWVyJykge1xuICAgICAgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gICAgfSBlbHNlIGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFpLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIH1cblxuICBjZWxsc0RvbS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgY2VsbFggPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS14Jyk7XG4gICAgY29uc3QgY2VsbFkgPSBjZWxsLmdldEF0dHJpYnV0ZSgnZGF0YS15Jyk7XG4gICAgaWYgKE51bWJlcihjZWxsWCkgPT09IHggJiYgTnVtYmVyKGNlbGxZKSA9PT0geSkgc2VhcmNoZWRDZWxsID0gY2VsbDtcbiAgfSk7XG5cbiAgcmV0dXJuIHNlYXJjaGVkQ2VsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcmtTdW5rU2hpcChzaGlwTGVuZ3RoLCBwbGF5ZXIpIHtcbiAgbGV0IGNlbGxzRG9tO1xuXG4gIGlmIChwbGF5ZXIgPT09ICdwbGF5ZXInKSB7XG4gICAgY2VsbHNEb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLWJvYXJkIC5ib2FyZC1jZWxsJyk7XG4gIH0gZWxzZSBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haS1ib2FyZCAuYm9hcmQtY2VsbCcpO1xuXG4gIGNlbGxzRG9tLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCBzaGlwRG9tID0gTnVtYmVyKGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXNoaXAnKSk7XG4gICAgaWYgKHNoaXBEb20gPT09IHNoaXBMZW5ndGgpIHtcbiAgICAgIGlmIChzaGlwTGVuZ3RoID09PSA1KSBjZWxsLmNsYXNzTGlzdC5hZGQoJ3N1bmstNScpO1xuICAgICAgaWYgKHNoaXBMZW5ndGggPT09IDQpIGNlbGwuY2xhc3NMaXN0LmFkZCgnc3Vuay00Jyk7XG4gICAgICBpZiAoc2hpcExlbmd0aCA9PT0gMykgY2VsbC5jbGFzc0xpc3QuYWRkKCdzdW5rLTMnKTtcbiAgICAgIGlmIChzaGlwTGVuZ3RoID09PSAyKSBjZWxsLmNsYXNzTGlzdC5hZGQoJ3N1bmstMicpO1xuICAgICAgaWYgKHNoaXBMZW5ndGggPT09IDEpIGNlbGwuY2xhc3NMaXN0LmFkZCgnc3Vuay0xJyk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURvbU9sZEJvYXJkKCkge1xuICBjb25zdCBjZWxsc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZC1jZWxsJyk7XG5cbiAgY2VsbHNEb20uZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5yZW1vdmUoKSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gQ2VsbCh4LCB5KSB7XG4gIGxldCBoZWxkU2hpcCA9IG51bGw7XG4gIGxldCBpc0hpdCA9IGZhbHNlO1xuXG4gIHJldHVybiB7IHgsIHksIGhlbGRTaGlwLCBpc0hpdCB9O1xufVxuIiwiaW1wb3J0IHsgU2hpcCB9IGZyb20gJy4vc2hpcCc7XG5pbXBvcnQgeyBDZWxsIH0gZnJvbSAnLi9jZWxsJztcblxuZXhwb3J0IGNvbnN0IEdhbWVCb2FyZCA9ICgpID0+IHtcbiAgbGV0IGJvYXJkID0gW107XG4gIGNvbnN0IHJvd3MgPSAxMDtcbiAgY29uc3QgY29scyA9IDEwO1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICBsZXQgaGl0cyA9IFtdO1xuICBsZXQgbWlzc2VzID0gW107XG4gIGdlbmVyYXRlQm9hcmQoKTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJvYXJkKCkge1xuICAgIGZvciAobGV0IGkgPSByb3dzOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCByb3cgPSBbXTtcbiAgICAgIGJvYXJkLnB1c2gocm93KTtcbiAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IGNvbHM7IGorKykge1xuICAgICAgICBjb25zdCBjb2wgPSBbQ2VsbChqLCBpKV07XG4gICAgICAgIHJvdy5wdXNoKGNvbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmV0dXJuQm9hcmQgPSAoKSA9PiBib2FyZDtcblxuICBjb25zdCBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMgPSAoeCwgeSkgPT4ge1xuICAgIGZvciAobGV0IHJvdyBvZiBib2FyZCkge1xuICAgICAgZm9yIChsZXQgYm9hcmRDZWxsIG9mIHJvdykge1xuICAgICAgICBjb25zdCBjZWxsID0gYm9hcmRDZWxsWzBdO1xuICAgICAgICBpZiAoeCA9PT0gY2VsbC54ICYmIHkgPT09IGNlbGwueSkgcmV0dXJuIGNlbGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChoZWFkLCB0YWlsKSA9PiB7XG4gICAgaWYgKCEoaGVhZCBpbnN0YW5jZW9mIEFycmF5KSB8fCAhKHRhaWwgaW5zdGFuY2VvZiBBcnJheSkpXG4gICAgICB0aHJvdyBFcnJvcignaGVhZCBhbmQgdGFpbCBtdXN0IGJlIGFycmF5cyByZXByZXNlbnRpbmcgY29vcmRpbmF0ZXMhJyk7XG5cbiAgICBsZXQgc2hpcDtcbiAgICBjb25zdCBzaGlwQ2VsbHMgPSBbXTtcbiAgICBsZXQgZGlyZWN0aW9uID0gJ2ludmFsaWQnO1xuICAgIGxldCBzaGlwTGVuZ3RoO1xuXG4gICAgaWYgKGhlYWRbMF0gPT09IHRhaWxbMF0gJiYgaGVhZFsxXSA9PT0gdGFpbFsxXSkgZGlyZWN0aW9uID0gJ3NpbmdsZS1jZWxsJztcbiAgICBlbHNlIGlmIChoZWFkWzBdID09PSB0YWlsWzBdKSBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgIGVsc2UgaWYgKGhlYWRbMV0gPT09IHRhaWxbMV0pIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcblxuICAgIGNvbnN0IGhlYWRDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKGhlYWRbMF0sIGhlYWRbMV0pO1xuICAgIGNvbnN0IHRhaWxDZWxsID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHRhaWxbMF0sIHRhaWxbMV0pO1xuICAgIHNoaXBDZWxscy5wdXNoKGhlYWRDZWxsKTtcbiAgICBzaGlwQ2VsbHMucHVzaCh0YWlsQ2VsbCk7XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAnaW52YWxpZCcgfHwgIWNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5KGhlYWQsIHRhaWwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdzaW5nbGUtY2VsbCcpIHtcbiAgICAgIHNoaXAgPSBTaGlwKDEpO1xuICAgICAgLy8gY2FzZSBvZiBzaW5nbGUtY2VsbCBib2F0LCByZW1vdmUgdGhlIGRvdWJsZSBjb29yZGluYXRlIGZyb20gYXJyXG4gICAgICBzaGlwQ2VsbHMuc2hpZnQoKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBzaGlwTGVuZ3RoID0gTWF0aC5hYnMoaGVhZFswXSAtIHRhaWxbMF0pICsgMTtcbiAgICAgIHNoaXAgPSBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgY29uc3QgY2VsbHNPYmogPSBmaW5kTWlzc2luZ0JvYXRDZWxscyhoZWFkLCBzaGlwTGVuZ3RoLCAnaG9yaXpvbnRhbCcpO1xuICAgICAgY29uc3QgbWlkZGxlQ2VsbHMgPSBjZWxsc09iai5taWRkbGVDZWxscztcbiAgICAgIHNoaXBDZWxscy5wdXNoKC4uLm1pZGRsZUNlbGxzKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgc2hpcExlbmd0aCA9IE1hdGguYWJzKGhlYWRbMV0gLSB0YWlsWzFdKSArIDE7XG4gICAgICBzaGlwID0gU2hpcChzaGlwTGVuZ3RoKTtcbiAgICAgIGNvbnN0IGNlbGxzT2JqID0gZmluZE1pc3NpbmdCb2F0Q2VsbHMoaGVhZCwgc2hpcExlbmd0aCwgJ3ZlcnRpY2FsJyk7XG4gICAgICBjb25zdCBtaWRkbGVDZWxscyA9IGNlbGxzT2JqLm1pZGRsZUNlbGxzO1xuICAgICAgc2hpcENlbGxzLnB1c2goLi4ubWlkZGxlQ2VsbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IGNlbGxzT2JqID0gZmluZE1pc3NpbmdCb2F0Q2VsbHMoaGVhZCwgc2hpcExlbmd0aCwgZGlyZWN0aW9uKTtcbiAgICBjb25zdCBtaWRkbGVDZWxscyA9IGNlbGxzT2JqLm1pZGRsZUNlbGxzO1xuICAgIC8vIGlmIHZhbGlkIGNvb3JkcywgYWRkIHRoZSBzaGlwIGJvdGggdG8gdGhlIGJvYXJkIGFuZCB0aGUgc2hpcCBhcnJheVxuICAgIGlmIChjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eShoZWFkLCB0YWlsLCBtaWRkbGVDZWxscykpIHtcbiAgICAgIHNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiAoY2VsbC5oZWxkU2hpcCA9IHNoaXApKTtcbiAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgZnVuY3Rpb24gZmluZE1pc3NpbmdCb2F0Q2VsbHMoaGVhZCwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBjb25zdCBjZWxsTnVtYmVyTm90Rm91bmQgPSBsZW5ndGggLSAxO1xuICAgIGNvbnN0IHJlc3RPZkNlbGxzID0gW107XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBjZWxsTnVtYmVyTm90Rm91bmQ7IGkrKykge1xuICAgICAgICBjb25zdCBmaXhlZENvb3JkID0gaGVhZFsxXTtcbiAgICAgICAgY29uc3QgdmFyQ29vcmQgPSBoZWFkWzBdO1xuICAgICAgICBjb25zdCBjZWxsSW5CZXR3ZWVuID0gZmluZENlbGxBdENvb3JkaW5hdGVzKHZhckNvb3JkICsgaSwgZml4ZWRDb29yZCk7XG4gICAgICAgIHJlc3RPZkNlbGxzLnB1c2goY2VsbEluQmV0d2Vlbik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGNlbGxOdW1iZXJOb3RGb3VuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpeGVkQ29vcmQgPSBoZWFkWzBdO1xuICAgICAgICBjb25zdCB2YXJDb29yZCA9IGhlYWRbMV07XG4gICAgICAgIGNvbnN0IGNlbGxJbkJldHdlZW4gPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXMoZml4ZWRDb29yZCwgdmFyQ29vcmQgKyBpKTtcbiAgICAgICAgcmVzdE9mQ2VsbHMucHVzaChjZWxsSW5CZXR3ZWVuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtaWRkbGVDZWxscyA9IHJlc3RPZkNlbGxzLnNsaWNlKDAsIHJlc3RPZkNlbGxzLmxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IHRhaWxDZWxsID0gcmVzdE9mQ2VsbHNbcmVzdE9mQ2VsbHMubGVuZ3RoIC0gMV07XG5cbiAgICByZXR1cm4geyBtaWRkbGVDZWxscywgdGFpbENlbGwgfTtcbiAgfVxuXG4gIGNvbnN0IGNoZWNrQm9hdFBsYWNlbWVudFZhbGlkaXR5ID0gKGhlYWQsIHRhaWwsIG1pc3NpbmdDZWxscykgPT4ge1xuICAgIGxldCB2YWxpZCA9IHRydWU7XG5cbiAgICBpZiAoXG4gICAgICBoZWFkWzBdIDwgMSB8fFxuICAgICAgaGVhZFswXSA+IDEwIHx8XG4gICAgICBoZWFkWzFdIDwgMSB8fFxuICAgICAgaGVhZFsxXSA+IDEwIHx8XG4gICAgICB0YWlsWzBdIDwgMSB8fFxuICAgICAgdGFpbFswXSA+IDEwIHx8XG4gICAgICB0YWlsWzFdIDwgMSB8fFxuICAgICAgdGFpbFsxXSA+IDEwXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChtaXNzaW5nQ2VsbHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBoZWFkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhoZWFkWzBdLCBoZWFkWzFdKTtcbiAgICAgICAgY29uc3QgdGFpbENlbGwgPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXModGFpbFswXSwgdGFpbFsxXSk7XG4gICAgICAgIGNvbnN0IGFsbEJvYXRDZWxscyA9IFtoZWFkQ2VsbCwgdGFpbENlbGxdLmNvbmNhdChtaXNzaW5nQ2VsbHMpO1xuXG4gICAgICAgIGFsbEJvYXRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgICAgaWYgKGNlbGwuaGVsZFNoaXAgIT09IG51bGwpIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsaWQ7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKGNoZWNrQXR0YWNrVmFsaWRpdHkoeCwgeSkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgIH1cblxuICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh4LCB5KTtcbiAgICBhdHRhY2tlZENlbGwuaXNIaXQgPSB0cnVlO1xuXG4gICAgaWYgKGF0dGFja2VkQ2VsbC5oZWxkU2hpcCAhPT0gbnVsbCkge1xuICAgICAgaGl0cy5wdXNoKHsgeCwgeSB9KTtcbiAgICAgIGF0dGFja2VkQ2VsbC5oZWxkU2hpcC5nZXRIaXQoKTtcbiAgICAgIGlmIChjaGVja0dhbWVPdmVyKCkpIHJldHVybiAnZ2FtZS1vdmVyJztcbiAgICAgIC8vIGlmIHRoZSBzaGlwIGhhcyBiZWVuIHN1bmssIHJldHVybiB0aGUgc2hpcFxuICAgICAgaWYgKGF0dGFja2VkQ2VsbC5oZWxkU2hpcC5jaGVja0lmU3VuaygpKSByZXR1cm4gYXR0YWNrZWRDZWxsLmhlbGRTaGlwO1xuICAgICAgcmV0dXJuICdoaXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBtaXNzZXMucHVzaCh7IHgsIHkgfSk7XG4gICAgICByZXR1cm4gJ21pc3MnO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja0F0dGFja1ZhbGlkaXR5ID0gKHgsIHkpID0+IHtcbiAgICBpZiAoeCA8IDEgfHwgeCA+IDEwIHx8IHkgPCAxIHx8IHkgPiAxMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgYWxsQXR0YWNrcyA9IGhpdHMuY29uY2F0KG1pc3Nlcyk7XG4gICAgZm9yIChsZXQgYXR0YWNrIG9mIGFsbEF0dGFja3MpIHtcbiAgICAgIGlmIChhdHRhY2sueCA9PT0geCAmJiBhdHRhY2sueSA9PT0geSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGNoZWNrR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgY2VsbE51bWJlckhvbGRpbmdCb2F0cyA9IHNoaXBzLnJlZHVjZShcbiAgICAgICh0b3RhbCwgc2hpcCkgPT4gKHRvdGFsICs9IHNoaXAubGVuZ3RoKSxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgaWYgKGhpdHMubGVuZ3RoID09PSBjZWxsTnVtYmVySG9sZGluZ0JvYXRzKSB7XG4gICAgICByZXNldEJvYXJkKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVzZXRCb2FyZCA9ICgpID0+IHtcbiAgICBib2FyZCA9IFtdO1xuICAgIGdlbmVyYXRlQm9hcmQoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIHJldHVybkJvYXJkLFxuICAgIGZpbmRDZWxsQXRDb29yZGluYXRlcyxcbiAgICBjaGVja0JvYXRQbGFjZW1lbnRWYWxpZGl0eSxcbiAgICBmaW5kTWlzc2luZ0JvYXRDZWxscyxcbiAgfTtcbn07XG4iLCJpbXBvcnQgeyBHYW1lQm9hcmQgfSBmcm9tIFwiLi9nYW1lLWJvYXJkXCI7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBjb25zdCBwbGF5ZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuXG4gIHJldHVybiB7IHBsYXllckJvYXJkLCBuYW1lIH07XG59O1xuIiwiZXhwb3J0IGNvbnN0IFNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGxldCBoaXRzID0gMDtcblxuICBjb25zdCBnZXRIaXQgPSAoKSA9PiB7XG4gICAgaGl0cysrO1xuICB9XG5cbiAgY29uc3QgY2hlY2tJZlN1bmsgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMgPT09IGxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geyBsZW5ndGgsIGdldEhpdCwgY2hlY2tJZlN1bmt9O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9tb2RlbHMvcGxheWVyJztcbmltcG9ydCB7XG4gIGRpc3BsYXlHYW1lQm9hcmQsXG4gIGF0dGVtcHRTaGlwUGxhY2VtZW50RG9tLFxuICBwbGFjZVNoaXBEb20sXG4gIGZpbmREb21DZWxsQXRDb29yZGluYXRlcyxcbiAgbWFya1N1bmtTaGlwLFxuICByZW1vdmVEb21PbGRCb2FyZCxcbiAgc2hvd1NlY3Rpb24sXG59IGZyb20gJy4vZG9tL2RvbS1tZXRob2RzJztcblxuY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xuICBjb25zdCBzdGFydEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1zdGFydCcpO1xuICBzaG93U2VjdGlvbigwKTtcblxuICBzdG9wQXVkaW9XYXZlcygpO1xuICBjb25zdCBpbnRybyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgYXVkaW8nKTtcbiAgY29uc3QgYXVkaW9Eb21CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc291bmQtc3RhcnQgaW1nJyk7XG4gIGhhbmRsZUF1ZGlvKGludHJvLCAnb24nLCBhdWRpb0RvbUJ1dHRvbik7XG5cbiAgc3RhcnRGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHNlY29uZENhcHRhaW4gPSBoYW5kbGVBSVNoaXBQbGFjZW1lbnQoKTtcbiAgICBydW5TaGlwUGxhY2VtZW50U2VjdGlvbigoZmlyc3RDYXB0YWluKSA9PiB7XG4gICAgICBydW5CYXR0bGVTZWN0aW9uKGZpcnN0Q2FwdGFpbiwgc2Vjb25kQ2FwdGFpbik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gcGxheVNvdW5kRWZmZWN0KHNyYykge1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuICBpZiAoYm9keS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT09ICdhdWRpby1vbicpIHtcbiAgICBjb25zdCBhdWRpbyA9IG5ldyBBdWRpbyhzcmMpO1xuICAgIGF1ZGlvLnBsYXkoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVBdWRpbyhhdWRpb0ZpbGUsIHN0YXRlLCBkb21CdXR0b25zKSB7XG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgYXVkaW9GaWxlLnBhdXNlKCk7XG4gIGRvbUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgaWYgKHN0YXRlID09PSAnb24nKSB7XG4gICAgICBhdWRpb0ZpbGUucGxheSgpO1xuICAgICAgYXVkaW9GaWxlLmxvb3AgPSB0cnVlO1xuICAgICAgYnV0dG9uLnNyYyA9ICdhc3NldHMvbXVzaWMvdm9sdW1lLW9mZi5zdmcnO1xuICAgIH0gZWxzZSBidXR0b24uc3JjID0gJ2Fzc2V0cy9tdXNpYy92b2x1bWUtb24uc3ZnJztcbiAgfSk7XG5cbiAgZG9tQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT09ICdhdWRpby1vbicpIHtcbiAgICAgICAgZG9tQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICBhdWRpb0ZpbGUucGF1c2UoKTtcbiAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYXVkaW8tb24nKTtcbiAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYXVkaW8tb2ZmJyk7XG4gICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdhdWRpby1vbicpO1xuICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnYXVkaW8tb2ZmJyk7XG4gICAgICAgICAgYnV0dG9uLnNyYyA9ICdhc3NldHMvbXVzaWMvdm9sdW1lLW9uLnN2Zyc7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9tQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICBhdWRpb0ZpbGUucGxheSgpO1xuICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhdWRpby1vbicpO1xuICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhdWRpby1vZmYnKTtcbiAgICAgICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ2F1ZGlvLW9uJyk7XG4gICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdhdWRpby1vZmYnKTtcbiAgICAgICAgICBidXR0b24uc3JjID0gJ2Fzc2V0cy9tdXNpYy92b2x1bWUtb2ZmLnN2Zyc7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG59XG5cbmZ1bmN0aW9uIHN0b3BBdWRpb0ludHJvKCkge1xuICBjb25zdCBhdWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgYXVkaW8nKTtcbiAgYXVkaW8ucGF1c2UoKTtcbn1cblxuZnVuY3Rpb24gc3RvcEF1ZGlvV2F2ZXMoKSB7XG4gIGNvbnN0IGF1ZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZS1zZWN0aW9uIGF1ZGlvJyk7XG4gIGF1ZGlvLnBhdXNlKCk7XG59XG5cbmZ1bmN0aW9uIHJ1blNoaXBQbGFjZW1lbnRTZWN0aW9uKGNhbGxiYWNrKSB7XG4gIHNob3dTZWN0aW9uKDEpO1xuXG4gIGNvbnN0IG5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLXN0YXJ0IGlucHV0Jyk7XG4gIGNvbnN0IG5hbWVTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXAtdG8tcGxhY2UgLnBsYXllci1uYW1lJyk7XG4gIGNvbnN0IGdhbWVCb2FyZERvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCAuZ2FtZS1ib2FyZCcpO1xuICBjb25zdCBzaGlwcyA9IFsnR2FsbGVvbicsICdGcmlnYXRlJywgJ0JyaWdhbnRpbmUnLCAnU2Nob29uZXInLCAnU2xvb3AnXTtcblxuICBuYW1lU3Bhbi50ZXh0Q29udGVudCA9IG5hbWVJbnB1dC52YWx1ZTtcbiAgY29uc3QgZmlyc3RDYXB0YWluID0gUGxheWVyKG5hbWVJbnB1dC52YWx1ZSk7XG4gIGNvbnN0IGJvYXJkT2JqID0gZmlyc3RDYXB0YWluLnBsYXllckJvYXJkO1xuICBjb25zdCBib2FyZCA9IGJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG5cbiAgZGlzcGxheUdhbWVCb2FyZChib2FyZCwgZ2FtZUJvYXJkRG9tKTtcbiAgaGFuZGxlQ2VsbEV2ZW50cyhmaXJzdENhcHRhaW4sIHNoaXBzLCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUNlbGxFdmVudHMoZmlyc3RDYXB0YWluLCBzaGlwcywgY2FsbGJhY2spIHtcbiAgY29uc3QgYXhpc0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCBidXR0b24nKTtcbiAgY29uc3QgYXhpc0RvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGlwLXBsYWNlbWVudCAuYXhpcycpO1xuICBjb25zdCBib2FyZE9iaiA9IGZpcnN0Q2FwdGFpbi5wbGF5ZXJCb2FyZDtcbiAgbGV0IGF4aXMgPSAnaG9yaXpvbnRhbCc7XG5cbiAgYXhpc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAoYXhpcyA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBheGlzRG9tLnRleHRDb250ZW50ID0gJ1ZlcnRpY2FsJztcbiAgICAgIGF4aXMgPSAndmVydGljYWwnO1xuICAgIH0gZWxzZSB7XG4gICAgICBheGlzRG9tLnRleHRDb250ZW50ID0gJ0hvcml6b250YWwnO1xuICAgICAgYXhpcyA9ICdob3Jpem9udGFsJztcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGNlbGxzRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkLWNlbGwnKTtcbiAgbGV0IHNoaXBzUGxhY2VkSWR4ID0gMDtcblxuICBjZWxsc0RvbS5mb3JFYWNoKChkb21DZWxsKSA9PiB7XG4gICAgbGV0IGNlbGxYO1xuICAgIGxldCBjZWxsWTtcbiAgICBjZWxsWCA9IGRvbUNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXgnKTtcbiAgICBjZWxsWSA9IGRvbUNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXknKTtcbiAgICBjb25zdCBib2FyZENlbGwgPSBib2FyZE9iai5maW5kQ2VsbEF0Q29vcmRpbmF0ZXMoXG4gICAgICBOdW1iZXIoY2VsbFgpLFxuICAgICAgTnVtYmVyKGNlbGxZKVxuICAgICk7XG5cbiAgICBkb21DZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgIGlmIChzaGlwc1BsYWNlZElkeCA+IDQpIHJldHVybjtcbiAgICAgIGNvbnN0IHNoaXBUb1BsYWNlID0gc2hpcHNbc2hpcHNQbGFjZWRJZHhdO1xuICAgICAgYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oc2hpcFRvUGxhY2UsIGF4aXMsIGJvYXJkQ2VsbCwgYm9hcmRPYmopO1xuICAgIH0pO1xuXG4gICAgZG9tQ2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNoaXBUb1BsYWNlID0gc2hpcHNbc2hpcHNQbGFjZWRJZHhdO1xuICAgICAgaWYgKGhhbmRsZVNoaXBQbGFjZW1lbnQoc2hpcFRvUGxhY2UsIGJvYXJkQ2VsbCwgYm9hcmRPYmosIGF4aXMpKSB7XG4gICAgICAgIHNoaXBzUGxhY2VkSWR4Kys7XG4gICAgICAgIGlmIChzaGlwc1BsYWNlZElkeCA9PT0gNSkgcmV0dXJuIGNhbGxiYWNrKGZpcnN0Q2FwdGFpbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTaGlwUGxhY2VtZW50KHNoaXBUb1BsYWNlLCBib2FyZENlbGwsIGJvYXJkLCBheGlzKSB7XG4gIGNvbnN0IHNoaXBEYXRhID0gYXR0ZW1wdFNoaXBQbGFjZW1lbnREb20oc2hpcFRvUGxhY2UsIGF4aXMsIGJvYXJkQ2VsbCwgYm9hcmQpO1xuICBpZiAoc2hpcERhdGEpIHtcbiAgICBpZiAoYm9hcmQucGxhY2VTaGlwKHNoaXBEYXRhLnNoaXBIZWFkLCBzaGlwRGF0YS5zaGlwVGFpbCkpIHtcbiAgICAgIHBsYWNlU2hpcERvbShzaGlwRGF0YS5hbGxEb21TaGlwQ2VsbHMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUFJU2hpcFBsYWNlbWVudCgpIHtcbiAgY29uc3Qgc2Vjb25kQ2FwdGFpbiA9IFBsYXllcignY2hhdC1HUFQnKTtcbiAgY29uc3QgYm9hcmQgPSBzZWNvbmRDYXB0YWluLnBsYXllckJvYXJkO1xuICBsZXQgc2hpcHNQbGFjZWQgPSAxO1xuXG4gIHdoaWxlIChzaGlwc1BsYWNlZCA8IDYpIHtcbiAgICBjb25zdCBzaGlwQ29vcmRzID0gZ2VuZXJhdGVWYWxpZFJhbmRvbVNoaXBDb29yZHMoc2hpcHNQbGFjZWQsIGJvYXJkKTtcbiAgICBpZiAoYm9hcmQucGxhY2VTaGlwKHNoaXBDb29yZHMuc2hpcEhlYWQsIHNoaXBDb29yZHMuc2hpcFRhaWwpKSB7XG4gICAgICBzaGlwc1BsYWNlZCsrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzZWNvbmRDYXB0YWluO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbVNoaXBDb29yZHMobGVuZ3RoLCBib2FyZCkge1xuICBjb25zdCBzaGlwSGVhZCA9IFtcbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxLFxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEsXG4gIF07XG4gIGxldCBkaXJlY3Rpb247XG5cbiAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjUpIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgZWxzZSBkaXJlY3Rpb24gPSAndmVydGljYWwnO1xuXG4gIGNvbnN0IGNlbGxzT2JqID0gYm9hcmQuZmluZE1pc3NpbmdCb2F0Q2VsbHMoc2hpcEhlYWQsIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgY29uc3Qgc2hpcFRhaWxPYmogPSBjZWxsc09iai50YWlsQ2VsbDtcblxuICByZXR1cm4geyBzaGlwSGVhZCwgc2hpcFRhaWxPYmogfTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVWYWxpZFJhbmRvbVNoaXBDb29yZHMobGVuZ3RoLCBib2FyZCkge1xuICBsZXQgdmFsaWRTaGlwQ29vcmRGb3VuZCA9IGZhbHNlO1xuICBsZXQgc2hpcEhlYWQ7XG4gIGxldCBzaGlwVGFpbDtcblxuICB3aGlsZSAoIXZhbGlkU2hpcENvb3JkRm91bmQpIHtcbiAgICBjb25zdCBjb29yZE9iaiA9IGdlbmVyYXRlUmFuZG9tU2hpcENvb3JkcyhsZW5ndGgsIGJvYXJkKTtcbiAgICBjb25zdCB0YWlsT2JqID0gY29vcmRPYmouc2hpcFRhaWxPYmo7XG4gICAgbGV0IHNoaXBIZWFkQXR0ZW1wdCA9IGNvb3JkT2JqLnNoaXBIZWFkO1xuICAgIGxldCBzaGlwVGFpbEF0dGVtcHQgPSBbdGFpbE9iaj8ueCwgdGFpbE9iaj8ueV07XG4gICAgLy8gaWYgbGVuZ3RoIGlzIDEsIHdlIGRvbid0IG5lZWQgdG8gZmluZCB0YWlsIGNvb3Jkc1xuICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgIHZhbGlkU2hpcENvb3JkRm91bmQgPSB0cnVlO1xuICAgICAgc2hpcFRhaWwgPSBzaGlwSGVhZEF0dGVtcHQ7XG4gICAgICBzaGlwSGVhZCA9IHNoaXBIZWFkQXR0ZW1wdDtcbiAgICB9XG4gICAgaWYgKHNoaXBUYWlsQXR0ZW1wdFswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWxpZFNoaXBDb29yZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHNoaXBIZWFkID0gc2hpcEhlYWRBdHRlbXB0O1xuICAgICAgc2hpcFRhaWwgPSBzaGlwVGFpbEF0dGVtcHQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgc2hpcEhlYWQsIHNoaXBUYWlsIH07XG59XG5cbmZ1bmN0aW9uIHJ1bkJhdHRsZVNlY3Rpb24oZmlyc3RDYXB0YWluLCBzZWNvbmRDYXB0YWluKSB7XG4gIHNob3dTZWN0aW9uKDIpO1xuXG4gIHN0b3BBdWRpb0ludHJvKCk7XG4gIGNvbnN0IHdhdmVTb3VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iYXR0bGUtc2VjdGlvbiBhdWRpbycpO1xuICBjb25zdCBkb21CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNvdW5kIGltZycpO1xuICBoYW5kbGVBdWRpbyh3YXZlU291bmQsICdvbicsIGRvbUJ1dHRvbnMpO1xuXG4gIGNvbnN0IHBsYXllckJvYXJkT2JqID0gZmlyc3RDYXB0YWluLnBsYXllckJvYXJkO1xuICBjb25zdCBvcHBvbmVudEJvYXJkT2JqID0gc2Vjb25kQ2FwdGFpbi5wbGF5ZXJCb2FyZDtcblxuICBjb25zdCBwbGF5ZXJCb2FyZCA9IHBsYXllckJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG4gIGNvbnN0IG9wcG9uZW50Qm9hcmQgPSBvcHBvbmVudEJvYXJkT2JqLnJldHVybkJvYXJkKCk7XG4gIGNvbnN0IHBsYXllckJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1ib2FyZCcpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkRG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFpLWJvYXJkJyk7XG5cbiAgZGlzcGxheUdhbWVCb2FyZChwbGF5ZXJCb2FyZCwgcGxheWVyQm9hcmREb20sICdwbGF5ZXInKTtcbiAgZGlzcGxheUdhbWVCb2FyZChvcHBvbmVudEJvYXJkLCBvcHBvbmVudEJvYXJkRG9tKTtcblxuICBwbGF5R2FtZShmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pO1xufVxuXG5mdW5jdGlvbiBwbGF5R2FtZShmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4pIHtcbiAgY29uc3Qgb3Bwb25lbnRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lbmVteS13YXRlcnMgLmJvYXJkLWNlbGwnKTtcbiAgY29uc3QgcHJvbXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb21wdCcpO1xuICBjb25zdCBwbGF5ZXJOYW1lID0gZmlyc3RDYXB0YWluLm5hbWU7XG4gIGxldCBhd2FpdGVkVHVybiA9IHRydWU7XG5cbiAgcHJvbXB0LnRleHRDb250ZW50ID0gYEF3YWl0aW5nIHllciBvcmRlcnMsIEFkbWlyYWwgJHtwbGF5ZXJOYW1lfSFgO1xuICBvcHBvbmVudENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGF3YWl0ZWRUdXJuID09PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgY29uc3QgY2VsbFggPSBOdW1iZXIoY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpKTtcbiAgICAgIGNvbnN0IGNlbGxZID0gTnVtYmVyKGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLXknKSk7XG4gICAgICBjb25zdCBib2FyZENlbGwgPSB7IGNlbGxYLCBjZWxsWSB9O1xuXG4gICAgICBpZiAoIXBsYXllckF0dGFjayhmaXJzdENhcHRhaW4sIHNlY29uZENhcHRhaW4sIGJvYXJkQ2VsbCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXdhaXRlZFR1cm4gPSBmYWxzZTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHdoaWxlICghb3Bwb25lbnRBdHRhY2soc2Vjb25kQ2FwdGFpbiwgZmlyc3RDYXB0YWluKSlcbiAgICAgICAgICBvcHBvbmVudEF0dGFjayhzZWNvbmRDYXB0YWluLCBmaXJzdENhcHRhaW4pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBhd2FpdGVkVHVybiA9IHRydWU7XG4gICAgICAgIH0sIDI1MDApO1xuICAgICAgfSwgMzAwMCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0eXBlV3JpdGVyKGRvbUVsZW1lbnQsIHRleHQsIGluZGV4KSB7XG4gIGlmICh0ZXh0ICYmIHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJyAmJiBpbmRleCA8IHRleHQubGVuZ3RoKSB7XG4gICAgZG9tRWxlbWVudC5pbm5lckhUTUwgKz0gdGV4dC5jaGFyQXQoaW5kZXgpO1xuICAgIGluZGV4Kys7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0eXBlV3JpdGVyKGRvbUVsZW1lbnQsIHRleHQsIGluZGV4KTtcbiAgICB9LCA0MCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGxheWVyQXR0YWNrKGZpcnN0Q2FwdGFpbiwgb3Bwb25lbnQsIGNlbGwpIHtcbiAgY29uc3QgcHJvbXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb21wdCcpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkT2JqID0gb3Bwb25lbnQucGxheWVyQm9hcmQ7XG4gIGNvbnN0IG9wcG9uZW50TmFtZSA9IG9wcG9uZW50Lm5hbWU7XG4gIGNvbnN0IG5hbWUgPSBmaXJzdENhcHRhaW4ubmFtZTtcblxuICBjb25zdCBhdHRhY2sgPSBvcHBvbmVudEJvYXJkT2JqLnJlY2VpdmVBdHRhY2soY2VsbC5jZWxsWCwgY2VsbC5jZWxsWSk7XG4gIGNvbnN0IGRvbUNlbGwgPSBmaW5kRG9tQ2VsbEF0Q29vcmRpbmF0ZXMoY2VsbC5jZWxsWCwgY2VsbC5jZWxsWSwgJ2VuZW15Jyk7XG5cbiAgcGxheVNvdW5kRWZmZWN0KCdhc3NldHMvbXVzaWMvY2Fubm9uLm1wMycpO1xuXG4gIGlmIChhdHRhY2sgPT09ICdnYW1lLW92ZXInKSB7XG4gICAgZG9tQ2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgICBnYW1lT3ZlcihuYW1lKTtcbiAgfSBlbHNlIGlmIChhdHRhY2sgPT09ICdpbnZhbGlkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoYXR0YWNrID09PSAnaGl0Jykge1xuICAgICAgcHJvbXB0LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgdGV4dCA9IGBZb3UgZmlyZSBhIHNob3QgaW4gZW5lbXkgd2F0ZXJzIC4uLiBhbmQgaGl0IWA7XG4gICAgICBjb25zdCB0eXBlV3JpdGVySW5kZXggPSAwO1xuICAgICAgdHlwZVdyaXRlcihwcm9tcHQsIHRleHQsIHR5cGVXcml0ZXJJbmRleCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcGxheVNvdW5kRWZmZWN0KCdhc3NldHMvbXVzaWMvaGl0Lm1wMycpO1xuICAgICAgICBhZGRNaXNzSGl0KGRvbUNlbGwsICdoaXQnKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgICAvLyBhdHRhY2sgcmV0dXJucyB0aGUgYm9hdCBvYmplY3QgaW4gY2FzZSBvZiBzdW5rXG4gICAgaWYgKHR5cGVvZiBhdHRhY2sgPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBzaGlwTGVuZ3RoID0gYXR0YWNrLmxlbmd0aDtcbiAgICAgIGNvbnN0IHNoaXBOYW1lID0gZ2V0U2hpcE5hbWUoc2hpcExlbmd0aCk7XG4gICAgICBwcm9tcHQuaW5uZXJIVE1MID0gJyc7XG4gICAgICBjb25zdCB0ZXh0ID0gYFlvdSBtYW5hZ2VkIHRvIHNpbmsgJHtvcHBvbmVudE5hbWV9J3MgJHtzaGlwTmFtZX0gZmxlZXQuIEdvb2Qgam9iIWA7XG4gICAgICBjb25zdCB0eXBlV3JpdGVySW5kZXggPSAwO1xuICAgICAgdHlwZVdyaXRlcihwcm9tcHQsIHRleHQsIHR5cGVXcml0ZXJJbmRleCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcGxheVNvdW5kRWZmZWN0KCdhc3NldHMvbXVzaWMvaGl0Lm1wMycpO1xuICAgICAgICBhZGRNaXNzSGl0KGRvbUNlbGwsICdoaXQnKTtcbiAgICAgICAgbWFya1N1bmtTaGlwKHNoaXBMZW5ndGgsICdvcHBvbmVudCcpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICAgIGlmIChhdHRhY2sgPT09ICdtaXNzJykge1xuICAgICAgcHJvbXB0LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgdGV4dCA9IGBZb3UgZmlyZSBhIHNob3QgaW4gZW5lbXkgd2F0ZXJzIC4uLiBhbmQgbWlzcyFgO1xuICAgICAgY29uc3QgdHlwZVdyaXRlckluZGV4ID0gMDtcbiAgICAgIHR5cGVXcml0ZXIocHJvbXB0LCB0ZXh0LCB0eXBlV3JpdGVySW5kZXgpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHBsYXlTb3VuZEVmZmVjdCgnYXNzZXRzL211c2ljL21pc3MubXAzJyk7XG4gICAgICAgIGFkZE1pc3NIaXQoZG9tQ2VsbCwgJ21pc3MnKTtcbiAgICAgIH0sIDEyMDApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGF0dGFjaywgY2VsbCB9O1xufVxuXG5mdW5jdGlvbiBvcHBvbmVudEF0dGFjayhhdHRhY2tlciwgb3Bwb25lbnQpIHtcbiAgY29uc3QgcHJvbXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb21wdCcpO1xuICBjb25zdCBvcHBvbmVudEJvYXJkT2JqID0gb3Bwb25lbnQucGxheWVyQm9hcmQ7XG4gIGNvbnN0IG5hbWUgPSBhdHRhY2tlci5uYW1lO1xuICBjb25zdCBvcHBvbmVudE5hbWUgPSBvcHBvbmVudC5uYW1lO1xuXG4gIGNvbnN0IHJhbmRDZWxsID0gZ2VuZXJhdGVSYW5kb21BdHRhY2soKTtcbiAgY29uc3QgYXR0YWNrID0gb3Bwb25lbnRCb2FyZE9iai5yZWNlaXZlQXR0YWNrKHJhbmRDZWxsLngsIHJhbmRDZWxsLnkpO1xuICBjb25zdCBkb21DZWxsID0gZmluZERvbUNlbGxBdENvb3JkaW5hdGVzKHJhbmRDZWxsLngsIHJhbmRDZWxsLnksICdwbGF5ZXInKTtcblxuICBwbGF5U291bmRFZmZlY3QoJ2Fzc2V0cy9tdXNpYy9jYW5ub24ubXAzJyk7XG5cbiAgaWYgKGF0dGFjayA9PT0gJ2dhbWUtb3ZlcicpIHtcbiAgICBkb21DZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgIGdhbWVPdmVyKG9wcG9uZW50TmFtZSk7XG4gIH0gZWxzZSBpZiAoYXR0YWNrID09PSAnaW52YWxpZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGF0dGFjayA9PT0gJ2hpdCcpIHtcbiAgICAgIHByb21wdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbnN0IHRleHQgPSBgJHtuYW1lfSBzaG9vdHMgYSBmaXJlIGluIHlvdXIgd2F0ZXJzIC4uLiBhbmQgaGl0cyFgO1xuICAgICAgY29uc3QgdHlwZVdyaXRlckluZGV4ID0gMDtcbiAgICAgIHR5cGVXcml0ZXIocHJvbXB0LCB0ZXh0LCB0eXBlV3JpdGVySW5kZXgpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHBsYXlTb3VuZEVmZmVjdCgnYXNzZXRzL211c2ljL2hpdC5tcDMnKTtcbiAgICAgICAgYWRkTWlzc0hpdChkb21DZWxsLCAnaGl0Jyk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gICAgLy8gYXR0YWNrIHJldHVybnMgdGhlIGJvYXQgb2JqZWN0IGluIGNhc2Ugb2Ygc3Vua1xuICAgIGlmICh0eXBlb2YgYXR0YWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IGF0dGFjay5sZW5ndGg7XG4gICAgICBjb25zdCBzaGlwTmFtZSA9IGdldFNoaXBOYW1lKHNoaXBMZW5ndGgpO1xuICAgICAgcHJvbXB0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgICBjb25zdCB0ZXh0ID0gYE9oIG5vLCB5b3VyICR7c2hpcE5hbWV9IGZsZWV0IGhhcyBiZWVuIHN1bmshYDtcbiAgICAgIGNvbnN0IHR5cGVXcml0ZXJJbmRleCA9IDA7XG4gICAgICB0eXBlV3JpdGVyKHByb21wdCwgdGV4dCwgdHlwZVdyaXRlckluZGV4KTtcbiAgICAgIG1hcmtTdW5rU2hpcChzaGlwTGVuZ3RoLCAncGxheWVyJyk7XG4gICAgfVxuICAgIGlmIChhdHRhY2sgPT09ICdtaXNzJykge1xuICAgICAgcHJvbXB0LmlubmVySFRNTCA9ICcnO1xuICAgICAgY29uc3QgdGV4dCA9IGAke25hbWV9IHNob290cyBhIGZpcmUgaW4geW91ciB3YXRlcnMgLi4uIGFuZCBtaXNzZXMhYDtcbiAgICAgIGNvbnN0IHR5cGVXcml0ZXJJbmRleCA9IDA7XG4gICAgICB0eXBlV3JpdGVyKHByb21wdCwgdGV4dCwgdHlwZVdyaXRlckluZGV4KTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBwbGF5U291bmRFZmZlY3QoJ2Fzc2V0cy9tdXNpYy9taXNzLm1wMycpO1xuICAgICAgICBhZGRNaXNzSGl0KGRvbUNlbGwsICdtaXNzJyk7XG4gICAgICB9LCAxMjAwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgYXR0YWNrLCByYW5kQ2VsbCB9O1xufVxuXG5mdW5jdGlvbiBhZGRNaXNzSGl0KGNlbGwsIGF0dGFjaykge1xuICBpZiAoYXR0YWNrID09PSAnbWlzcycpIGNlbGw/LmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgaWYgKGF0dGFjayA9PT0gJ2hpdCcpIGNlbGw/LmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xufVxuXG5mdW5jdGlvbiBnZXRTaGlwTmFtZShsZW5ndGgpIHtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gJ1Nsb29wJztcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gJ1NjaG9vbmVyJztcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gJ0JyaWdhbnRpbmUnO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiAnRnJpZ2F0ZSc7XG4gICAgY2FzZSA1OlxuICAgICAgcmV0dXJuICdHYWxsZW9uJztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUF0dGFjaygpIHtcbiAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDE7XG4gIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxO1xuXG4gIHJldHVybiB7IHgsIHkgfTtcbn1cblxuZnVuY3Rpb24gZ2FtZU92ZXIod2lubmVyKSB7XG4gIHNob3dTZWN0aW9uKDMpO1xuICByZW1vdmVEb21PbGRCb2FyZCgpO1xuXG4gIGNvbnN0IHdpbm5lckRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLW92ZXIgLndpbm5lcicpO1xuICBjb25zdCBwbGF5QWdhaW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1vdmVyIGJ1dHRvbicpO1xuICB3aW5uZXJEb20udGV4dENvbnRlbnQgPSB3aW5uZXI7XG5cbiAgcGxheUFnYWluQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3RhcnRHYW1lKTtcbn1cblxuc3RhcnRHYW1lKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=