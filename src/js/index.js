import { Player } from './models/player';
import { GameBoard } from './models/game-board';

const playGame = (() => {
  const startForm = document.querySelector('.game-start');

  startForm.addEventListener('submit', startNewGame);
})();

function startNewGame(e) {
  e.preventDefault();
  switchSection('ship-placement');
  transitionBackground();

  const ships = {
    Galleon: 5,
    Frigate: 4,
    Brigantine: 3,
    Schooner: 2,
    Sloop: 1,
  };
  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');
  const shipSpan = document.querySelector('.ship-to-place .ship');
  nameSpan.textContent = nameInput.value;
  shipSpan.textContent = Object.keys(ships)[0];

  const firstCaptain = Player(nameInput.value);
  const secondCaptain = Player('chat-GPT');
  const boardObject = firstCaptain.playerBoard

  displayGameBoard(firstCaptain);
  placeShipDom(boardObject, ships)
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

function placeShipDom(boardObject, ships) {
  const cellsDom = document.querySelectorAll('.board-cell');
  let cellX;
  let cellY;

  console.log(cellsDom)
  cellsDom.forEach((cell) => {
    cell.addEventListener('mouseenter', () => {
      cellX = cell.getAttribute('data-x');
      cellY = cell.getAttribute('data-y');
      console.log(cellX, cellY)
    })
  })
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
