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
  const axisButton = document.querySelector('.ship-placement button');
  const axisDom = document.querySelector('.ship-placement .axis');

  nameSpan.textContent = nameInput.value;

  const firstCaptain = Player(nameInput.value);
  const board = firstCaptain.playerBoard;
  const ships = ['Galleon', 'Frigate', 'Brigantine', 'Schooner', 'Sloop'];

  displayGameBoard(firstCaptain);
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
  let shipIndex = 0;

  cellsDom.forEach((domCell) => {
    let cellX;
    let cellY;
    cellX = domCell.getAttribute('data-x');
    cellY = domCell.getAttribute('data-y');
    const boardCell = board.findCellAtCoordinates(Number(cellX), Number(cellY));

    domCell.addEventListener('mouseenter', () => {
      if (shipIndex > 4) return;
      const shipToPlace = ships[shipIndex];
      attemptShipPlacementDom(shipToPlace, axis, boardCell, board);
    });

    domCell.addEventListener('click', () => {
      if (shipIndex > 4) return;
      const shipToPlace = ships[shipIndex];
      if (handleShipPlacement(shipToPlace, boardCell, board, axis)) {
        shipIndex++;
      }
    });

    domCell.addEventListener('mouseup', () => {
      if (shipIndex > 3) {
        callback(board);
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
  const shipHead = [
    Math.floor(Math.random() * 10) + 1,
    Math.floor(Math.random() * 10) + 1,
  ];
  let direction;
  let shipsPlaced = 0;
  let shipsIndex = 0;

  if (Math.random() < 0.5) direction = 'horizontal';
  else direction = 'vertical';

  

  const shipCells = board.findMissingBoatCells(
    shipHead,
    ships[shipsIndex] + 1,
    direction
  );

  console.log(shipCells)

  return board;
}

function runBattleSection(playerBoard, opponentBoard) {
  // console.log(opponentBoard);
}
