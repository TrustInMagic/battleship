import { Player } from './models/player';
import {
  displayGameBoard,
  switchSection,
  transitionBackground,
  attemptShipPlacementDom,
} from './dom/dom-methods';

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
      axisDom.textContent = 'Vertical';
      axis = 'vertical';
    } else {
      axisDom.textContent = 'Horizontal';
      axis = 'horizontal';
    }
  });

  const cellsDom = document.querySelectorAll('.board-cell');
  let cellX;
  let cellY;

  cellsDom.forEach((cell) => {
    cell.addEventListener('mouseenter', () => {
      cellX = cell.getAttribute('data-x');
      cellY = cell.getAttribute('data-y');
      const targetCell = boardObject.findCellAtCoordinates(
        Number(cellX),
        Number(cellY)
      );
      attemptShipPlacementDom('Frigate', axis, targetCell, boardObject);
    });
  });
}
