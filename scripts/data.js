'use strict';
let initialGameBoard = document
  .querySelector('.game-board')
  .querySelectorAll('div');
let initialGameBoard2 = [];

copyDown(2, 17);
copyRight(25, 30);
initialGameBoard2.push(initialGameBoard[42]);
copyLeft(54, 49);
copyDown(57, 72);
initialGameBoard2.push(initialGameBoard[71]);
copyUp(70, 55);
copyLeft(48, 43);
initialGameBoard2.push(initialGameBoard[31]);
copyRight(18, 23);
copyUp(15, 0);
initialGameBoard2.push(initialGameBoard[1]);
initialGameBoard2.push(
  initialGameBoard[74],
  initialGameBoard[75],
  initialGameBoard[76],
  initialGameBoard[77]
);
initialGameBoard2.push(
  initialGameBoard[79],
  initialGameBoard[80],
  initialGameBoard[81],
  initialGameBoard[82]
);
initialGameBoard2.push(
  initialGameBoard[84],
  initialGameBoard[85],
  initialGameBoard[86],
  initialGameBoard[87]
);
initialGameBoard2.push(
  initialGameBoard[89],
  initialGameBoard[90],
  initialGameBoard[91],
  initialGameBoard[92]
);
copyDown(4, 16);
copyRight(32, 36);
copyLeft(41, 37);
copyUp(68, 56);
//start 2, end 18

function copyRight(start, end) {
  for (let i = start; i <= end; i++) {
    initialGameBoard2.push(initialGameBoard[i]);
  }
}

function copyLeft(start, end) {
  for (let i = start; i >= end; i--) {
    initialGameBoard2.push(initialGameBoard[i]);
  }
}

function copyUp(start, end) {
  for (let i = start; i >= end; i -= 3) {
    initialGameBoard2.push(initialGameBoard[i]);
  }
}

function copyDown(start, end) {
  for (let i = start; i <= end; i += 3) {
    initialGameBoard2.push(initialGameBoard[i]);
  }
}

console.log(initialGameBoard2);

// const columns = [
//     [],
//     [],
//     [],
//     []
// ];

// let a = initialGameBoard;

// columns[0].push(a[32], a[33], a[34], a[35], a[36]);
// columns[1].push(a[4], a[7], a[10], a[13], a[16]);
// columns[2].push(a[68], a[65], a[62], a[59], a[56]);
// columns[3].push(a[41], a[40], a[39], a[38], a[37]);
