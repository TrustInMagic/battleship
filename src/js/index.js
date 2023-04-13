import { Player } from './models/player';
import { GameBoard } from './models/game-board';

const playGame = (() => {
  const startForm = document.querySelector('.game-start');

  startForm.addEventListener('submit', runShipPlacement);
})();

function runShipPlacement(e) {
  e.preventDefault();
  switchSection('ship-placement');
  transitionBackground();

  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');
  const axisButton = document.querySelector('.ship-placement button');
  const axisDom = document.querySelector('.ship-placement .axis');

  nameSpan.textContent = nameInput.value;

  const firstCaptain = Player(nameInput.value);
  const secondCaptain = Player('chat-GPT');
  const boardObject = firstCaptain.playerBoard;
  displayGameBoard(firstCaptain);
  
  let axis = 'horizontal';

  axisButton.addEventListener('click', () => {
    if (axis === 'horizontal') {
      (axisDom.textContent = 'Vertical');
      axis = 'vertical'
    } else {
      axisDom.textContent = 'Horizontal';
      axis = 'horizontal'
    }
  });

  const cellsDom = document.querySelectorAll('.board-cell');
  let cellX;
  let cellY;

  cellsDom.forEach((cell) => {
    cell.addEventListener('click', () => {
      cellX = cell.getAttribute('data-x');
      cellY = cell.getAttribute('data-y');
      attemptShipPlacementDom('Galleon', axis)
    });
  });
  
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

function findDomCellAtCoordinates(x, y) {

}

function attemptShipPlacementDom(shipType, axis) {
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

  const cellsDom = document.querySelectorAll('.board-cell');
  let cellX;
  let cellY;

  cellsDom.forEach((cell) => {
    cell.addEventListener('mouseenter', () => {
      cellX = cell.getAttribute('data-x');
      cellY = cell.getAttribute('data-y');

      console.log(axis, length)
    });
  });

  const shipSpan = document.querySelector('.ship-to-place .ship');
  shipSpan.textContent = ship;
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
