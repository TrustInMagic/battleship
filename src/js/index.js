export const Ship = (length) => {
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

export const GameBoard = () => {
  const board = [];
  const rows = 10;
  const cols = 10;
  const hits = [];
  const misses = [];

  const generateBoard = () => {
    for (let i = 0; i < rows; i++) {
      const row = [];
      board.push(row);
      for (let j = 0; j < cols; j++) {
        const col = [Cell(i, j)];
        row.push(col);
      }
    }

    return board;
  };

  const findCellAtCoordinates = (x, y) => {
    for (let row of generateBoard()) {
      for (let boardCell of row) {
        const cell = boardCell[0];
        if (x === cell.x && y === cell.y) return cell;
      }
    }
  };

  const placeShip = (head, tail) => {
    if (!(head instanceof Array) || !(tail instanceof Array))
      throw Error('head and tail must be arrays representing coordinates!');

    const shipCells = [];
    let direction = 'invalid';
    let shipLength;

    if (head[0] === tail[0] && head[1] === tail[1]) direction = 'single-cell'
    else if (head[0] === tail[0]) direction = 'vertical';
    else if (head[1] === tail[1]) direction = 'horizontal';

    const headCell = findCellAtCoordinates(head[0], head[1]);
    const tailCell = findCellAtCoordinates(tail[0], tail[1]);
    shipCells.push(headCell);
    shipCells.push(tailCell);

    if (direction === 'invalid') return false;
    else if (direction === 'single-cell') {
      // case of single-cell boat, remove the double coordinate from arr
      shipCells.shift();
    } else if (direction === 'horizontal') {
      shipLength = Math.abs(head[0] - tail[0]) + 1;
      const cellNumberNotFound = shipLength - 2;
      // calculate the cells missing to complete the boat
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[1];
        const variableCoord = Math.max(head[0], tail[0]);
        const cellInBetween = findCellAtCoordinates(variableCoord - i, fixedCoord);
        shipCells.push(cellInBetween);
      }
    } else if (direction === 'vertical') {
      shipLength = Math.abs(head[1] - tail[1]) + 1;
      const cellNumberNotFound = shipLength - 2;
      for (let i = 1; i <= cellNumberNotFound; i++) {
        const fixedCoord = head[0];
        const variableCoord = Math.max(tail[1], tail[0])
        const cellInBetween = findCellAtCoordinates(fixedCoord, variableCoord + i);
        shipCells.push(cellInBetween);
      }
    }

    return shipCells;
  };

  const receiveAttack = (x, y) => {};

  const gameOver = () => {};

  return { generateBoard, placeShip, receiveAttack, gameOver };
};

function Cell(x, y) {
  let heldShip = null;
  let isHit = false;

  return { x, y, heldShip, isHit };
}

const board = GameBoard();

board.generateBoard();

console.log(board.placeShip([1, 1], [4, 1]));
