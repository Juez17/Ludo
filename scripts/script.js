let pawns = document.querySelectorAll('svg');
[...pawns] = pawns;
const selectedPawns = [];
const rollBox = document.querySelector('.center-box');
let playersToChoose = document
  .querySelector('.modal-window')
  .querySelectorAll('button');
[...playersToChoose] = playersToChoose;
const modal = document.querySelector('.modal-window');
let hasMoved = true;
let hasRolled = false;
let index;
let movementSucessful = false;
const hitPlayerBase = [];
const [...gameboard] = initialGameBoard2;



let currentPlayer;
// 1 - green, 
// 2 - yellow, 
// 3 - red, 
// 4 - blue


const players = [];
const playersWhoWon = [];

const startBtn = playersToChoose.pop();
const chosenPlayers = [];

let diceNumber;
const diceImg = document.createElement('img');

// console.log(playersToChoose);

startBtn.addEventListener('click', () => {
  if (chosenPlayers.length > 1) {
    modal.classList.add('invisible');
    for (let pawn of pawns) {
      console.log(chosenPlayers.includes(`${pawn.classList[0].slice(0, -5)}`));
      if (!chosenPlayers.includes(`${pawn.classList[0].slice(0, -5)}`)) {
        pawn.classList.add('invisible');
      } else {
        selectedPawns.push(pawn);
      }
    }
    for (let i = 0; i < selectedPawns.length; i += 4) {
      // console.log(selectedPawns[i].classList);
      let player = selectedPawns[i].classList[0].includes('green')
        ? 1
        : selectedPawns[i].classList[0].includes('yellow')
        ? 2
        : selectedPawns[i].classList[0].includes('red')
        ? 3
        : 4;
      players.push(player);
    }
    for (let pawn of selectedPawns) {
      pawn.addEventListener('click', move);
    }
    currentPlayer = players[0];
  }
});

rollBox.addEventListener('click', roll);

function checkPlayer(piece) {
  let juxtaposed = piece.classList[0].includes('green')
    ? 1
    : piece.classList[0].includes('yellow')
    ? 2
    : piece.classList[0].includes('red')
    ? 3
    : 4;

  return currentPlayer === juxtaposed;
}


function roll() {
  // if(hasAllWon()) return;
  if(players.length === 0) {alert('game over'); return;}

  let color =currentPlayer === 1
  ? 'green'
  : currentPlayer === 2
  ? 'yellow'
  : currentPlayer === 3
  ? 'red'
  : 'blue';
  if(hasPlayerWon(color)) {
    console.log(players.indexOf(currentPlayer), 1)
    players.splice(players.indexOf(currentPlayer), 1);
    changeTurn();
  }

  if (hasMoved) {
    diceNumber = Math.floor(Math.random() * 6 + 1);
    console.log('rzucam kostka ', diceNumber);
    hasMoved = false;
    hasRolled = true;
  }

  console.log(currentPlayer);
  console.log(`./images/dice-${diceNumber}.png`);
  let diceBase =
    currentPlayer === 1
      ? 'green-base'
      : currentPlayer === 2
      ? 'yellow-base'
      : currentPlayer === 3
      ? 'red-base'
      : 'blue-base';
  let currentColor =
    currentPlayer === 1
      ? 'green-pawn'
      : currentPlayer === 2
      ? 'yellow-pawn'
      : currentPlayer === 3
      ? 'red-pawn'
      : 'blue-pawn';
  diceImg.src = `./images/dice-${diceNumber}.png`;
  diceImg.style.width = '50px';
  document.querySelector(`.${diceBase}`).appendChild(diceImg);

  if (!anyCanMove(document.querySelector(`.${currentColor}`))) {
    changeTurn();
  }
}

function hasPlayerWon(color) {
  console.log('color: ', color);
  let startIndex = color === 'red'? 84: color === 'blue'? 79: color === 'green'? 74: 69;
  let endIndex = color === 'red'? 87: color === 'blue'? 82: color === 'green'? 77: 72;
  for(let i = startIndex; i <= endIndex; i++) {
    if(isFieldEmpty(i)) return false;
  }
  return true;
}

function moveInRow(piece, newIndex) {
  console.log('move in row here');
  gameboard[newIndex].appendChild(piece);
}

function move() {
  // console.log(checkColor(this));
  // console.log(this);
  if (hasRolled && checkPlayer(this)) {
    // if(canMove(this)) {
    console.log('I can move');
    if (checkIsLeavingBase(this)) {
      if (canLeaveBase(this)) {
        //check if it's in the base
        console.log('IS LEAVING BASE');
        leaveBase(this);
      } else {
        movementSucessful = false;
        if (!anyCanMove(this)) {
          movementSucessful = true;
        }
      }
    }
    else if(canGetIntoColumn(...getGetIntoColumnArgs(this))) {
      console.log('wchodzenie do kolumny if');
      getIntoColumn(...getGetIntoColumnArgs(this));
    }
    else if( (isInColumn(this)) && (willNotSkipCheckerInColumn(this, (checkIndex(this) + diceNumber))) && (willNotJumpToOtherColumn(this, (checkIndex(this) + diceNumber))) ) {
      //if it's already in some column
      moveInRow(this, (checkIndex(this) + diceNumber));
      movementSucessful = true;
      console.log('is in Column here')
    }
    else if (canMove(this)) {
        console.log('CanMove(this)')
      moveForward(this);
    } else if (anyCanMove(this)) {
        console.log('anyCanMove(this)')
        movementSucessful = false;
    }

    if (movementSucessful && diceNumber !== 6) {
      changeTurn();
    }
    if (movementSucessful && diceNumber === 6) {
      giveExtraMove();
    }
    
  }
}

function moveForward(piece) {
  console.log(piece);

  let nextPos;
  let nextInd;

  if (checkIndex(piece) + diceNumber < 52) {
    nextInd = checkIndex(piece) + diceNumber;
  } else {
    nextInd = diceNumber + checkIndex(piece) - 52;
  }
  nextPos = gameboard[nextInd];

  // if(nextInd < 51) {
  // let nextPos = gameboard[checkIndex(piece) + diceNumber];
  if (isFieldEmpty(nextInd)) {
    nextPos.appendChild(piece);
    console.log('FIELD IS EMPTY');
    movementSucessful = true;

    return;
  } else if (isEnemyThere(nextInd, piece)) {
    console.log('ENEMY THERE');
    console.log(findElementBase(nextPos.firstElementChild));
    gameboard[findElementBase(nextPos.firstElementChild)].appendChild(
      nextPos.firstElementChild
    );
    nextPos.appendChild(piece);
    movementSucessful = true;
    return;
  }
  movementSucessful = false;
  // }
  // else {
  console.log('illegal movement');
  movementSucessful = false;

  // }
}

function findElementBase(piece) {
  hitPlayerBase.length = 0;

  let start =
    checkColor(piece) === 'green'
      ? 52
      : checkColor(piece) === 'yellow'
      ? 56
      : checkColor(piece) === 'red'
      ? 60
      : 64;

  hitPlayerBase.push(start);
  hitPlayerBase.push(start + 1);
  hitPlayerBase.push(start + 2);
  hitPlayerBase.push(start + 3);

  for (let index of hitPlayerBase) {
    if (isFieldEmpty(index)) {
      return index;
    }
  }
}

function checkIfInBase(piece) {
  let start =
    checkColor(piece) === 'green'
      ? 52
      : checkColor(piece) === 'yellow'
      ? 56
      : checkColor(piece) === 'red'
      ? 60
      : 64;

  if (
    checkIndex(piece) === start ||
    checkIndex(piece) === start + 1 ||
    checkIndex(piece) === start + 2 ||
    checkIndex(piece) === start + 3
  ) {
    return true;
  }
  return false;
}

function giveExtraMove() {
  hasMoved = true;
  hasRolled = false;
  movementSucessful = true;
}

function changeTurn() {
  hasMoved = true;
  hasRolled = false;
  movementSucessful = true;
  console.log(currentPlayer);

  if (players.indexOf(currentPlayer) + 1 < players.length) {
    currentPlayer = players[players.indexOf(currentPlayer) + 1];
  } else {
    currentPlayer = players[0];
  }
  console.log(currentPlayer);
}

function canLeaveBase(piece) {
  // if(diceNumber !== 6 || diceNumber !== 1) {
  //     return false;
  // }
  index =
    currentPlayer === 1
      ? 40
      : currentPlayer === 2
      ? 1
      : currentPlayer === 3
      ? 27
      : 14;
  if (
    checkIsLeavingBase(piece) &&
    (diceNumber === 1 || diceNumber === 6) &&
    (gameboard[index].children.length < 1 || isEnemyThere(index, piece))
  ) {
    return true;
  } else {
    // changeTurn(); here you have to check if any piece of this color can move. If so, then
    // don't changeTurn
    return false;
  }
}

function checkIsPassingFinishLine(piece, add) {
    let color = checkColor(piece);
    let ind = checkIndex(piece);
    
    console.log('stoisz na indeksie ', ind, ' wyrzucona kostka', diceNumber, ' wiec teoretycznie (chyba ze przez mete)przejdziesz do indeksu: ', ind + add);


    let passing = color === 'green'? (ind <= 38 && (ind + add) > 38) : color === 'yellow'? ((ind <= 51) &&( ind + add) > 51): color === 'red'? (ind <= 25 && (ind + add) > 25): (ind <= 12 && (ind + add) > 12);
    console.log('czy przechodzisz przez mete?', passing)
    return passing;
};

function isInColumn(piece) {
  let isInColumn = checkIndex(piece) >= 68 &&  checkIndex(piece)  <= 87;
  console.log(checkIndex(piece))
  console.log(isInColumn)
  return isInColumn;
}

function willNotSkipCheckerInColumn(piece, newIndex, currentIndex) {

  if(!currentIndex) currentIndex = checkIndex(piece);
  for(let i = currentIndex + 1; i <= newIndex; i++) {
    console.log(gameboard[i]);
    if(!isFieldEmpty(i)) return false;
  }

  return true;
}

function checkColorOfIndex(index) {
  console.log(gameboard);
  console.log(index);
  let colorOfIndex = gameboard[index].classList.contains('yellow-end-column')? 'yellow': 
  gameboard[index].classList.contains('red-end-column')? 'red': gameboard[index].classList.contains('blue-end-column')? 'blue': 'green';

  return colorOfIndex;
}

function willNotJumpToOtherColumn(piece, newIndex) {
  let color = checkColor(piece);
  let colorOfField = checkColorOfIndex(newIndex);

  console.log('COLOR OF THE OLD FIELD: ', color);
  console.log('COLOR OF THE NEW FIELD: ', colorOfField);

  console.log('willNotJUMP? ', color === colorOfField)
  return color === colorOfField;
}

function canGetIntoColumn(columnZeroInd, borderLine, ind, piece) {
  let newIndex = columnZeroInd + Math.abs(borderLine - (ind - 1 + diceNumber));

  
  for(let i = columnZeroInd; i <= newIndex; i++) {
    if(!isFieldEmpty(i)) return false;
  }
  console.log(
    'color of the field is: ' +
      gameboard[
        newIndex
      ]?.classList[0].slice(0, -11)
  );

  if(!willNotSkipCheckerInColumn(piece, newIndex, columnZeroInd)) return false;
  

  console.log('new Index of the pawn is:',  columnZeroInd + Math.abs(borderLine - (ind - 1 + diceNumber)));
  console.log('color of pawn is: ' + checkColor(piece));
  if (
    (checkIsPassingFinishLine(piece, diceNumber) &&
    isFieldEmpty(columnZeroInd + Math.abs(borderLine - (ind - 1 + diceNumber))))
  ) {

    // let formula = (checkColor(piece) === 'red' || checkColor(piece) === 'blue') ? columnZeroInd - Math.abs(borderLine - (ind - 1 + diceNumber)) : columnZeroInd + Math.abs(borderLine - (ind - 1 + diceNumber));
    if (
      gameboard[
        columnZeroInd + Math.abs(borderLine - (ind - 1 + diceNumber))
      ]?.classList[0].slice(0, -11) === checkColor(piece)
    ) {

        
      return true;
    }
  }
  return false;
}

function getIntoColumn(columnZeroInd, borderLine, ind, piece) {
    console.log()
  console.log(
    'taki indeks w kolumnie bedzie' +
      (columnZeroInd +
      Math.abs(borderLine - (ind - 1 + diceNumber)))
  );
  gameboard[
    columnZeroInd + Math.abs(borderLine - (ind - 1 + diceNumber))
  ].appendChild(piece);
  // columns[currentPlayer-1][Math.abs(borderLine - (ind -1  + diceNumber))].appendChild(piece);
  // movementSucessful = true;
  // hasMoved = true;
//   changeTurn();
  movementSucessful = true;
}

function getGetIntoColumnArgs(piece) {
    let color = checkColor(piece);
  let borderLine =
    color === 'green' ? 38 : color === 'blue' ? 12 : color === 'red' ? 25 : 51;
  let ind = checkIndex(piece);
  let columnZeroInd =
    color === 'green' ? 73 : color === 'blue' ? 78 : color === 'red' ? 83 : 68;
  return [columnZeroInd, borderLine, ind, piece];
}

function canMove(piece) {
  if (canLeaveBase(piece)) {
    return true;
  }
  let color = checkColor(piece);
  let borderLine =
    color === 'green' ? 38 : color === 'blue' ? 12 : color === 'red' ? 25 : 51;
  let ind = checkIndex(piece);
  let columnZeroInd =
    color === 'green' ? 73 : color === 'blue' ? 78 : color === 'red' ? 83 : 68;
  console.log('index: ' + ind);
  console.log('color:', color);
  console.log('borderLine:', borderLine);
  console.log('columnZeroInd:', columnZeroInd);


  if (!isInColumn(piece) &&
    (ind > borderLine && ind < 52) ||
    (ind < borderLine && ind - 1 + diceNumber < borderLine)
  ) {
    console.log('wszedl  tutaj w ifa w CANMOVE()')
    return true;
  } else if (canGetIntoColumn(columnZeroInd, borderLine, ind, piece)) {
    console.log('wszedl  tutaj w else ifa w CANMOVE()')
    
    return true;
    // getIntoColumn(piece, columnZeroInd, borderLine, ind);
    console.log('Moge wejsc do kolumny, ' );
  }
  
  //TODO:
  else if((isInColumn(piece)) && (willNotSkipCheckerInColumn(piece, (checkIndex(piece) + diceNumber))) && (willNotJumpToOtherColumn(piece, (checkIndex(piece) + diceNumber))) ) {
    console.log('wszedl  tutaj w else ifa w CANMOVE()')
    return true;
  }

  // else if((ind - 1 + diceNumber) <= (borderLine + 5)) {
  //     console.log();
  //     console.log("taki indeks w kolumnie bedzie" + columnZeroInd + Math.abs(borderLine - (ind - 1  + diceNumber)));
  //     gameboard[columnZeroInd + Math.abs(borderLine - (ind - 1  + diceNumber))].appendChild(piece);

  //     // columns[currentPlayer-1][Math.abs(borderLine - (ind -1  + diceNumber))].appendChild(piece);
  //     // movementSucessful = true;
  // }
  // else if((ind < borderLine && () )) {
  console.log(Math.abs(73 + (borderLine - (ind - 1 + diceNumber))));
  // }

  console.log(piece,  ' nie moze sie ruszyc');
  return false;
}

function anyCanMove(piece) {
  let color = checkColor(piece);
  console.log(color + '   COOOOOOLOR');
  for (const pawn of selectedPawns) {
    // console.log(pawn);
    if (pawn.classList[0].includes(color) && canMove(pawn)) {
      console.log(pawn, ' can move');
      return true;
    }
  }
  console.log('zaden nie moze sie ruszyc');
  //TODO: trzeba zrobic tak, zeby po wyrzuceniu 6, a nie byciu mozliwym ruszeniu sie mozna bylo rzucic jeszcze raz
  return false;
}

function isEnemyThere(index, piece) {
  return checkColor(gameboard[index].firstElementChild) !== checkColor(piece);
}

function isFieldEmpty(index) {
  return gameboard[index]?.children.length === 0;
}

function checkIndex(piece) {
  return gameboard.indexOf(piece.closest('div'));
}

function checkIsLeavingBase(piece) {
  if (checkIndex(piece) >= 52 && checkIndex(piece) <= 67) {
    return true;
  } else {
    return false;
  }
}

function checkColor(piece) {
  console.log(piece);
  return piece.classList[0].slice(0, -5);
}

function leaveBase(piece) {
  let index =
    currentPlayer === 1
      ? 40
      : currentPlayer === 2
      ? 1
      : currentPlayer === 3
      ? 27
      : 14;

  if (gameboard[index].children.length > 0) {
    let nextPos = gameboard[index];
    console.log('ENEMY THERE');
    console.log(findElementBase(nextPos.firstElementChild));
    gameboard[findElementBase(nextPos.firstElementChild)].appendChild(
      nextPos.firstElementChild
    );
    nextPos.appendChild(piece);
    gameboard[index].removeChild(gameboard[index].firstElementChild);
  }
  // if(canLeaveBase(index)) {
  movementSucessful = true;
  gameboard[index].appendChild(piece);
  // } else {
  //     movementSucessful = false;
  // }
}


function selectPlayers() {
  console.log(this);
  if (
    chosenPlayers.includes(this.querySelector('h4').textContent.toLowerCase())
  ) {
    console.log('usuwam: ', this.querySelector('h4').textContent.toLowerCase());
    chosenPlayers.splice(
      chosenPlayers.indexOf(this.querySelector('h4').textContent.toLowerCase()),
      1
    );
  } else {
    chosenPlayers.push(this.querySelector('h4').textContent.toLowerCase());
    console.log('dodaje:', this.querySelector('h4').textContent.toLowerCase());
  }
}

function restart() {
  for (let pawn of pawns) {
    pawn.classList.remove('invisible');
  }
  modal.remove('invisible');
}

for (let i = 0; i < playersToChoose.length; i++) {
  playersToChoose[i].addEventListener('click', selectPlayers);
  playersToChoose[i].addEventListener('click', () => {
    playersToChoose[i].classList.toggle(
      `${playersToChoose[i].classList[0]}-toggled`
    );
  });
}

console.log(gameboard);

// document.addEventListener('contextmenu', (e)=> {
//     e.preventDefault();
// });
