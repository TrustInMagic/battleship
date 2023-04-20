import { Player } from './models/player';
import {
  displayGameBoard,
  switchSection,
  transitionBackground,
  attemptShipPlacementDom,
  placeShipDom,
} from './dom/dom-methods';

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
  switchSection('ship-placement');
  transitionBackground();

  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');

  nameSpan.textContent = nameInput.value;

  const firstCaptain = Player(nameInput.value);
  const board = firstCaptain.playerBoard;
  const ships = ['Galleon', 'Frigate', 'Brigantine', 'Schooner', 'Sloop'];

  displayGameBoard(firstCaptain);
  handleCellEvents(board, ships, callback);
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
      attemptShipPlacementDom(shipToPlace, axis, boardCell, board);
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
  const shipData = attemptShipPlacementDom(shipToPlace, axis, boardCell, board);
  if (shipData) {
    if (board.placeShip(shipData.shipHead, shipData.shipTail)) {
      placeShipDom(shipData.allDomShipCells);
      return true;
    }
  }
}

function handleAIShipPlacement() {
  const secondCaptain = Player('chat-GPT');
  const board = secondCaptain.playerBoard;
  const ships = ['Sloop', 'Schooner', 'Brigantine', 'Frigate', 'Galleon'];
  
  let shipsPlaced = 0;

  do {
    const shipCoords = generateValidRandomShip(5, board)
    if (board.placeShip(shipCoords.shipHead, shipCoords.shipTail)) {
      shipsPlaced++
    }
  } while (shipsPlaced < 6)

  console.log(board.returnBoard());
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

function generateValidRandomShip(length, board) {
  let validShipCoordFound = false;

  do {
    const coordObj = generateRandomShipCoords(length, board);
    const tailObj = coordObj.shipTailObj;
    const shipHead = coordObj.shipHead;
    let shipTail = [tailObj?.x, tailObj?.y];
    if (shipTail[0] !== undefined) validShipCoordFound = true;
    // if length is 1, we don't need to find tail coords
    if (length === 1) {
      validShipCoordFound = true;
      shipTail = shipHead;
    }

    return { shipHead, shipTail };
  } while (!validShipCoordFound);
}

function runBattleSection(playerBoard, opponentBoard) {
  
}
