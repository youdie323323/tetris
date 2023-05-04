const boardWidth = 10;
const boardHeight = 20;
const board = [];
let currentBlock;
let currentBlockType;
let currentBlockOrientation;
let currentBlockX;
let currentBlockY;
let score = 0;
let gameInterval;

function createBoard() {
  for (let i = 0; i < boardHeight; i++) {
    board[i] = [];
    for (let j = 0; j < boardWidth; j++) {
      board[i][j] = null;
    }
  }
}

function createBlock() {
  const blockTypes = ['i', 'o', 't', 's', 'z', 'j', 'l'];
  const blockOrientations = [0, 90, 180, 270];
  const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
  const randomOrientation = blockOrientations[Math.floor(Math.random() * blockOrientations.length)];
  currentBlockType = randomType;
  currentBlockOrientation = randomOrientation;
  currentBlockX = Math.floor(boardWidth / 2) - 1;
  currentBlockY = 0;
  switch (currentBlockType) {
    case 'i':
      currentBlock = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      break;
    case 'o':
      currentBlock = [
        [2, 2],
        [2, 2]
      ];
      break;
    case 't':
      currentBlock = [
        [0, 3, 0],
        [3, 3, 3],
        [0, 0, 0]
      ];
      break;
    case 's':
      currentBlock = [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0]
      ];
      break;
    case 'z':
      currentBlock = [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
      ];
      break;
    case 'j':
      currentBlock = [
        [6, 0, 0],
        [6, 6, 6],
        [0, 0, 0]
      ];
      break;
    case 'l':
      currentBlock = [
        [0, 0, 7],
        [7, 7, 7],
        [0, 0, 0]
      ];
      break;
  }
}

function drawBlock() {
  for (let i = 0; i < currentBlock.length; i++) {
    for (let j = 0; j < currentBlock[i].length; j++) {
      if (currentBlock[i][j] !== 0) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.classList.add(`block-${currentBlockType}`);
        block.style.left = `${(currentBlockX + j) * 30}px`;
        block.style.top = `${(currentBlockY + i) * 30}px`;
        document.getElementById('game-board').appendChild(block);
      }
    }
  }
}

function clearBoard() {
  const blocks = document.getElementsByClassName('block');
  while (blocks.length > 0) {
    blocks[0].parentNode.removeChild(blocks[0]);
  }
}

function checkCollision(x, y, block) {
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[i].length; j++) {
      if (block[i][j] !== 0) {
        const boardX = x + j;
        const boardY = y + i;
        if (boardX < 0 || boardX >= boardWidth || boardY >= boardHeight || (boardY >= 0 && board[boardY][boardX] !== null)) {
          return true;
        }
      }
    }
  }
  return false;
}

function rotateBlock() {
  const newBlock = [];
  for (let i = 0; i < currentBlock[0].length; i++) {
    newBlock[i] = [];
    for (let j = 0; j < currentBlock.length; j++) {
      newBlock[i][j] = currentBlock[currentBlock.length - 1 - j][i];
    }
  }
  if (!checkCollision(currentBlockX, currentBlockY, newBlock)) {
    currentBlock = newBlock;
    currentBlockOrientation = (currentBlockOrientation + 90) % 360;
    clearBoard();
    drawBlock();
  }
}

function moveBlockLeft() {
  if (!checkCollision(currentBlockX - 1, currentBlockY, currentBlock)) {
    currentBlockX--;
    clearBoard();
    drawBlock();
  }
}

function moveBlockRight() {
  if (!checkCollision(currentBlockX + 1, currentBlockY, currentBlock)) {
    currentBlockX++;
    clearBoard();
    drawBlock();
  }
}

function moveBlockDown() {
  if (!checkCollision(currentBlockX, currentBlockY + 1, currentBlock)) {
    currentBlockY++;
    clearBoard();
    drawBlock();
  } else {
    addBlockToBoard();
    checkRows();
    createBlock();
    clearBoard();
    drawBoard();
    drawBlock();
  }
}

function addBlockToBoard() {
  for (let i = 0; i < currentBlock.length; i++) {
    for (let j = 0; j < currentBlock[i].length; j++) {
      if (currentBlock[i][j] !== 0) {
        board[currentBlockY + i][currentBlockX + j] = currentBlockType;
      }
    }
  }
}

function checkRows() {
  let rowsCleared = 0;
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i].every(block => block !== null)) {
      board.splice(i, 1);
      board.unshift(new Array(boardWidth).fill(null));
      rowsCleared++;
      i++;
    }
  }
  if (rowsCleared > 0) {
    score += rowsCleared * 100;
    document.getElementById('score').innerHTML = `Score: ${score}`;
  }
}

function drawBoard() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== null) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.classList.add(`block-${board[i][j]}`);
        block.style.left = `${j * 30}px`;
        block.style.top = `${i * 30}px`;
        document.getElementById('game-board').appendChild(block);
      }
    }
  }
}

function startGame() {
  createBoard();
  createBlock();
  drawBoard();
  drawBlock();
  gameInterval = setInterval(moveBlockDown, 500);
}

document.addEventListener('keydown', event => {
  switch (event.keyCode) {
    case 65: // A
      moveBlockLeft();
      break;
    case 68: // D
      moveBlockRight();
      break;
    case 83: // S
      moveBlockDown();
      break;
    case 87: // W
      rotateBlock();
      break;
  }
});

startGame();
