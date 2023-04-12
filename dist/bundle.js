/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameBoard": () => (/* binding */ GameBoard),
/* harmony export */   "Ship": () => (/* binding */ Ship)
/* harmony export */ });
const Ship = (length) => {
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

const GameBoard = () => {
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7O1VBQUE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05PO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQSxzQkFBc0IsVUFBVTtBQUNoQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHlCQUF5QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxzQkFBc0IseUJBQXlCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYOztBQUVBOztBQUVBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgY29uc3QgU2hpcCA9IChsZW5ndGgpID0+IHtcbiAgbGV0IGhpdCA9IDA7XG5cbiAgZnVuY3Rpb24gZ2V0SGl0KCkge1xuICAgIGhpdCsrO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tJZlN1bmsoKSB7XG4gICAgaWYgKGhpdCA+PSBsZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHsgbGVuZ3RoLCBnZXRIaXQsIGNoZWNrSWZTdW5rIH07XG59O1xuXG5leHBvcnQgY29uc3QgR2FtZUJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHMgPSAxMDtcbiAgY29uc3QgaGl0cyA9IFtdO1xuICBjb25zdCBtaXNzZXMgPSBbXTtcblxuICBjb25zdCBnZW5lcmF0ZUJvYXJkID0gKCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XG4gICAgICBjb25zdCByb3cgPSBbXTtcbiAgICAgIGJvYXJkLnB1c2gocm93KTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IFtDZWxsKGksIGopXTtcbiAgICAgICAgcm93LnB1c2goY29sKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYm9hcmQ7XG4gIH07XG5cbiAgY29uc3QgZmluZENlbGxBdENvb3JkaW5hdGVzID0gKHgsIHkpID0+IHtcbiAgICBmb3IgKGxldCByb3cgb2YgZ2VuZXJhdGVCb2FyZCgpKSB7XG4gICAgICBmb3IgKGxldCBib2FyZENlbGwgb2Ygcm93KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZENlbGxbMF07XG4gICAgICAgIGlmICh4ID09PSBjZWxsLnggJiYgeSA9PT0gY2VsbC55KSByZXR1cm4gY2VsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKGhlYWQsIHRhaWwpID0+IHtcbiAgICBpZiAoIShoZWFkIGluc3RhbmNlb2YgQXJyYXkpIHx8ICEodGFpbCBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgIHRocm93IEVycm9yKCdoZWFkIGFuZCB0YWlsIG11c3QgYmUgYXJyYXlzIHJlcHJlc2VudGluZyBjb29yZGluYXRlcyEnKTtcblxuICAgIGNvbnN0IHNoaXBDZWxscyA9IFtdO1xuICAgIGxldCBkaXJlY3Rpb24gPSAnaW52YWxpZCc7XG4gICAgbGV0IHNoaXBMZW5ndGg7XG5cbiAgICBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSAmJiBoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnc2luZ2xlLWNlbGwnXG4gICAgZWxzZSBpZiAoaGVhZFswXSA9PT0gdGFpbFswXSkgZGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICBlbHNlIGlmIChoZWFkWzFdID09PSB0YWlsWzFdKSBkaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBjb25zdCBoZWFkQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhoZWFkWzBdLCBoZWFkWzFdKTtcbiAgICBjb25zdCB0YWlsQ2VsbCA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyh0YWlsWzBdLCB0YWlsWzFdKTtcbiAgICBzaGlwQ2VsbHMucHVzaChoZWFkQ2VsbCk7XG4gICAgc2hpcENlbGxzLnB1c2godGFpbENlbGwpO1xuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2ludmFsaWQnKSByZXR1cm4gZmFsc2U7XG4gICAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnc2luZ2xlLWNlbGwnKSB7XG4gICAgICAvLyBjYXNlIG9mIHNpbmdsZS1jZWxsIGJvYXQsIHJlbW92ZSB0aGUgZG91YmxlIGNvb3JkaW5hdGUgZnJvbSBhcnJcbiAgICAgIHNoaXBDZWxscy5zaGlmdCgpO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHNoaXBMZW5ndGggPSBNYXRoLmFicyhoZWFkWzBdIC0gdGFpbFswXSkgKyAxO1xuICAgICAgY29uc3QgY2VsbE51bWJlck5vdEZvdW5kID0gc2hpcExlbmd0aCAtIDI7XG4gICAgICAvLyBjYWxjdWxhdGUgdGhlIGNlbGxzIG1pc3NpbmcgdG8gY29tcGxldGUgdGhlIGJvYXRcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGNlbGxOdW1iZXJOb3RGb3VuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpeGVkQ29vcmQgPSBoZWFkWzFdO1xuICAgICAgICBjb25zdCB2YXJpYWJsZUNvb3JkID0gTWF0aC5tYXgoaGVhZFswXSwgdGFpbFswXSk7XG4gICAgICAgIGNvbnN0IGNlbGxJbkJldHdlZW4gPSBmaW5kQ2VsbEF0Q29vcmRpbmF0ZXModmFyaWFibGVDb29yZCAtIGksIGZpeGVkQ29vcmQpO1xuICAgICAgICBzaGlwQ2VsbHMucHVzaChjZWxsSW5CZXR3ZWVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgc2hpcExlbmd0aCA9IE1hdGguYWJzKGhlYWRbMV0gLSB0YWlsWzFdKSArIDE7XG4gICAgICBjb25zdCBjZWxsTnVtYmVyTm90Rm91bmQgPSBzaGlwTGVuZ3RoIC0gMjtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGNlbGxOdW1iZXJOb3RGb3VuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpeGVkQ29vcmQgPSBoZWFkWzBdO1xuICAgICAgICBjb25zdCB2YXJpYWJsZUNvb3JkID0gTWF0aC5tYXgodGFpbFsxXSwgdGFpbFswXSlcbiAgICAgICAgY29uc3QgY2VsbEluQmV0d2VlbiA9IGZpbmRDZWxsQXRDb29yZGluYXRlcyhmaXhlZENvb3JkLCB2YXJpYWJsZUNvb3JkICsgaSk7XG4gICAgICAgIHNoaXBDZWxscy5wdXNoKGNlbGxJbkJldHdlZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzaGlwQ2VsbHM7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh4LCB5KSA9PiB7fTtcblxuICBjb25zdCBnYW1lT3ZlciA9ICgpID0+IHt9O1xuXG4gIHJldHVybiB7IGdlbmVyYXRlQm9hcmQsIHBsYWNlU2hpcCwgcmVjZWl2ZUF0dGFjaywgZ2FtZU92ZXIgfTtcbn07XG5cbmZ1bmN0aW9uIENlbGwoeCwgeSkge1xuICBsZXQgaGVsZFNoaXAgPSBudWxsO1xuICBsZXQgaXNIaXQgPSBmYWxzZTtcblxuICByZXR1cm4geyB4LCB5LCBoZWxkU2hpcCwgaXNIaXQgfTtcbn1cblxuY29uc3QgYm9hcmQgPSBHYW1lQm9hcmQoKTtcblxuYm9hcmQuZ2VuZXJhdGVCb2FyZCgpO1xuXG5jb25zb2xlLmxvZyhib2FyZC5wbGFjZVNoaXAoWzEsIDFdLCBbNCwgMV0pKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==