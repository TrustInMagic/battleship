import { Ship, GameBoard } from '..';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = Ship(3);
  });

  test('ship does not sink on hits < length', () => {
    expect(ship.getHit().checkIfSunk()).toBe(false);
  });

  test('ship sink correctly when hits = length', () => {
    expect(ship.getHit().getHit().getHit().checkIfSunk()).toBe(true);
  });
});

describe('GameBoard.returnBoard', () => {
  let board;

  beforeEach(() => {
    board = GameBoard();
  });

  test('board generated has 10 rows', () => {
    expect(board.returnBoard().length).toEqual(10);
  });

  test('board generated has 10 cols', () => {
    let boardLength = 0;

    for (let row of board.returnBoard()) {
      for (let _ of row) boardLength++;
    }

    expect(boardLength).toEqual(100);
  });

  test('board generated contains Cell objects', () => {
    for (let row of board.returnBoard()) {
      for (let cell of row) {
        expect(typeof cell).toBe('object');
      }
    }
  });
});

describe('GameBoard.placeShip', () => {
  let board;

  beforeEach(() => {
    board = GameBoard();
  });

  test('placeShip places ships correctly on horizontal', () => {
    expect(board.placeShip([1, 1], [6, 1]).length).toEqual(6);
  });

  test('placeShip places ships correctly on vertical', () => {
    expect(board.placeShip([1, 4], [1, 1]).length).toEqual(4);
  });

  test('placeShip places ships correctly in case of single-cell ship', () => {
    expect(board.placeShip([1, 1], [1, 1]).length).toEqual(1);
  });
});

describe('GameBoard.receiveAttack', () => {
  let board;

  beforeEach(() => {
    board = GameBoard();
  });

  test('correctly signals game over when all ships have been sunk', () => {
    board.placeShip([1, 1], [5, 1])
    board.receiveAttack(1, 1);
    board.receiveAttack(2, 1);
    board.receiveAttack(3, 1);
    board.receiveAttack(4, 1);
    expect(board.receiveAttack(5, 1)).toBe(true);
  });
});