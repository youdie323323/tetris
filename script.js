const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const BLOCK_SIZE = 20;
const ROWS = 20;
const COLS = 10;
const KEY_LEFT = 65; // A
const KEY_RIGHT = 68; // D
const KEY_DOWN = 83; // S
const KEY_ROTATE = 32; // Space

let field = [];
let block = null;
let blockX = 0;
let blockY = 0;
let score = 0;

function init() {
  // フィールドの初期化
  field = [];
  for (let i = 0; i < ROWS; i++) {
    field[i] = [];
    for (let j = 0; j < COLS; j++) {
      field[i][j] = 0;
    }
  }

  // スコアの初期化
  score = 0;

  // ブロックの初期化
  block = getRandomBlock();
  blockX = Math.floor(COLS / 2) - Math.floor(block.shape[0].length / 2);
  blockY = 0;
}

function getRandomBlock() {
  const blocks = [
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "#f00",
    },
    {
      shape: [
        [0, 2, 0],
        [2, 2, 2],
      ],
      color: "#0f0",
    },
    {
      shape: [
        [0, 3, 3],
        [3, 3, 0],
      ],
      color: "#00f",
    },
    {
      shape: [
        [4, 4, 0],
        [0, 4, 4],
      ],
      color: "#ff0",
    },
    {
      shape: [
        [0, 5, 0],
        [5, 5, 5],
      ],
      color: "#f0f",
    },
    {
      shape: [
        [6, 6, 6, 6],
      ],
      color: "#0ff",
    },
    {
      shape: [
        [7, 7],
        [7, 7],
      ],
      color: "#f80",
    },
  ];

  const index = Math.floor(Math.random() * blocks.length);
  return blocks[index];
}

function drawBlock(x, y, block) {
  ctx.fillStyle = block.color;
  for (let i = 0; i < block.shape.length; i++) {
    for (let j = 0; j < block.shape[i].length; j++) {
      if (block.shape[i][j] !== 0) {
        ctx.fillRect(
          (j + x) * BLOCK_SIZE,
          (i + y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function drawField() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (field[i][j] !== 0) {
        ctx.fillStyle = field[i][j];
        ctx.fillRect(
          j * BLOCK_SIZE,
          i * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function isCollision(x, y, block) {
  for (let i = 0; i < block.shape.length; i++) {
    for (let j = 0; j < block.shape[i].length; j++) {
      if (
        block.shape[i][j] !== 0 &&
        (y + i >= ROWS ||
          x + j < 0 ||
          x + j >= COLS ||
          field[y + i][x + j] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
}

function addBlockToField(x, y, block) {
  for (let i = 0; i < block.shape.length; i++) {
    for (let j = 0; j < block.shape[i].length; j++) {
      if (block.shape[i][j] !== 0) {
        field[y + i][x + j] = block.color;
      }
    }
  }
}

function removeLine() {
  let numRemovedLines = 0;
  for (let i = ROWS - 1; i >= 0; i--) {
    if (field[i].every((cell) => cell !== 0)) {
      field.splice(i, 1);
      field.unshift(new Array(COLS).fill(0));
      numRemovedLines++;
    }
  }
  return numRemovedLines;
}

function update() {
  // ブロックを下に移動
  if (!isCollision(blockX, blockY + 1, block)) {
    blockY++;
  } else {
    addBlockToField(blockX, blockY, block);
    const numRemovedLines = removeLine();
    if (numRemovedLines > 0) {
      score += 100 * numRemovedLines;
    }
    block = getRandomBlock();
    blockX = Math.floor(COLS / 2) - Math.floor(block.shape[0].length / 2);
    blockY = 0;
    if (isCollision(blockX, blockY, block)) {
      alert("Game Over!");
      init();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawField();
  drawBlock(blockX, blockY, block);
}

function loop() {
  update();
  draw();
}

init();
setInterval(loop, 1000 / 60);

document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case KEY_LEFT:
      if (!isCollision(blockX - 1, blockY, block)) {
        blockX--;
      }
      break;
    case KEY_RIGHT:
      if (!isCollision(blockX + 1, blockY, block)) {
        blockX++;
      }
      break;
    case KEY_DOWN:
      if (!isCollision(blockX, blockY + 1, block)) {
        blockY++;
      }
      break;
    case KEY_ROTATE:
      const rotatedBlock = {
        shape: [],
        color: block.color,
      };
      for (let i = 0; i < block.shape[0].length; i++) {
        const newRow = [];
        for (let j = block.shape.length - 1; j >= 0; j--) {
          newRow.push(block.shape[j][i]);
        }
        rotatedBlock.shape.push(newRow);
      }
      if (!isCollision(blockX, blockY, rotatedBlock)) {
        block = rotatedBlock;
      }
      break;
  }
});
