import { GameBoard } from "./game-board";

export const Player = (name) => {
  const playerBoard = GameBoard();

  return { playerBoard };
};
