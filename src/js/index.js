import { Player } from './models/player';
import {
  displayGameBoard,
  attemptShipPlacementDom,
  placeShipDom,
  findDomCellAtCoordinates,
  markSunkShip,
  removeDomOldBoard,
  showSection,
} from './dom/dom-methods';

const startGame = () => {
  const startForm = document.querySelector('.game-start');
  showSection(0);

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
      button.src = './assets/music/volume-off.svg';
    } else button.src = './assets/music/volume-on.svg';
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
          button.src = './assets/music/volume-on.svg';
        });
      } else {
        domButtons.forEach((button) => {
          audioFile.play();
          button.classList.add('audio-on');
          button.classList.remove('audio-off');
          body.classList.add('audio-on');
          body.classList.remove('audio-off');
          button.src = './assets/music/volume-off.svg';
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
  showSection(1);

  const nameInput = document.querySelector('.game-start input');
  const nameSpan = document.querySelector('.ship-to-place .player-name');
  const gameBoardDom = document.querySelector('.ship-placement .game-board');
  const ships = ['Galleon', 'Frigate', 'Brigantine', 'Schooner', 'Sloop'];

  nameSpan.textContent = nameInput.value;
  const firstCaptain = Player(nameInput.value);
  const boardObj = firstCaptain.playerBoard;
  const board = boardObj.returnBoard();

  displayGameBoard(board, gameBoardDom);
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
      attemptShipPlacementDom(shipToPlace, axis, boardCell, boardObj);
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
  showSection(2);

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

  displayGameBoard(playerBoard, playerBoardDom, 'player');
  displayGameBoard(opponentBoard, opponentBoardDom);

  playGame(firstCaptain, secondCaptain);
}

function playGame(firstCaptain, secondCaptain) {
  const opponentCells = document.querySelectorAll('.enemy-waters .board-cell');
  const prompt = document.querySelector('.prompt');
  const playerName = firstCaptain.name;
  let awaitedTurn = true;

  prompt.textContent = `Awaiting yer orders, capt'n ${playerName}!`;
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

      function computerTurn() {
        const attacker = secondCaptain;
        const opponent = firstCaptain;
        const result = opponentAttack(attacker, opponent);

        if (!result) {
          setTimeout(() => {
            computerTurn();
          }, 200);
        } else {
          setTimeout(() => {
            awaitedTurn = true;
          }, 2500);
        }
      }

      setTimeout(() => {
        computerTurn();
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
  const domCell = findDomCellAtCoordinates(cell.cellX, cell.cellY, 'enemy');

  playSoundEffect('./assets/music/cannon.mp3');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    setTimeout(() => {
      gameOver(name);
    }, 2000);
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.innerHTML = '';
      const text = `You fire a shot in enemy waters ... and hit!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('./assets/music/hit.mp3');
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
        playSoundEffect('./assets/music/hit.mp3');
        addMissHit(domCell, 'hit');
        markSunkShip(shipLength, 'opponent');
      }, 1000);
    }
    if (attack === 'miss') {
      prompt.innerHTML = '';
      const text = `You fire a shot in enemy waters ... and miss!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('./assets/music/miss.mp3');
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
  const domCell = findDomCellAtCoordinates(randCell.x, randCell.y, 'player');

  playSoundEffect('./assets/music/cannon.mp3');

  if (attack === 'game-over') {
    domCell.classList.add('hit');
    setTimeout(() => {
      gameOver(opponentName);
    }, 2000);
  } else if (attack === 'invalid') {
    return false;
  } else {
    if (attack === 'hit') {
      prompt.innerHTML = '';
      const text = `${name} shoots a fire in your waters ... and hits!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('./assets/music/hit.mp3');
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
      setTimeout(() => {
        playSoundEffect('./assets/music/hit.mp3');
        addMissHit(domCell, 'hit');
        markSunkShip(shipLength, 'player');
      }, 1000);
    }
    if (attack === 'miss') {
      prompt.innerHTML = '';
      const text = `${name} shoots a fire in your waters ... and misses!`;
      const typeWriterIndex = 0;
      typeWriter(prompt, text, typeWriterIndex);
      setTimeout(() => {
        playSoundEffect('./assets/music/miss.mp3');
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
  showSection(3);
  removeDomOldBoard();

  const winnerDom = document.querySelector('.game-over .winner');
  const playAgainButton = document.querySelector('.game-over button');
  winnerDom.textContent = winner;

  playAgainButton.addEventListener('click', startGame);
}

startGame();
