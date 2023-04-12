import { Ship, GameBoard } from '..';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = Ship(3);
  });

  test('ship does not sink on hits < length', () => {
    expect(ship.getHit().checkIfSunk()).toBe(false)
  })

  test('ship sink correctly when hits = length', () => {
    expect(ship.getHit().getHit().getHit().checkIfSunk()).toBe(true)
  })
});

describe('GameBoard', () => {
  let board;

  beforeEach(() => {
    board = GameBoard();
  })

  test('board generated has 10 rows', () => {
    expect(board.generateBoard().length).toEqual(10)
  })

  test('board generated has 10 cols', () => {
    let boardLength = 0;

    for (let row of board.generateBoard()) {
      for (let _ of row) boardLength++
    }

    expect(boardLength).toEqual(100)
  })

  test('board generated contains Cell objects', () => {

    for (let row of board.generateBoard()) {
      for (let cell of row) {
        expect(typeof cell).toBe('object')
      }
    }
  });
})