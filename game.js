// select elements
const scoreEl = document.querySelector('.score');
const highScoreEl = document.querySelector('.high-score');
const gameOverEl = document.querySelector('.game-over');
const playAgainBtn = document.querySelector('.play-again');

// select canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// event listeners
// listen to user's key
document.addEventListener('keyup', setDirection);
// restart game
playAgainBtn.addEventListener('click', restartGame);
 
// add border to canvas 
canvas.style.border = '1px solid #FFF';

// dimensions
const width = canvas.width,height = canvas.height;

// Square
const squareSize = 20;
const horizontalSq = width / squareSize;
const verticalSq = height / squareSize;

// game colors
const snakeColor = '#009102',boardColor = '#000',foodColor = '#F95700FF';

// game 
let FPS = 1000 / 15;
let gameLoop;
let gameStarted = false;

// current direction
let directionsQueue = [];
let currentDirection = '';
const direction = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

// snake
let snake = [{ x: 0, y: 0 }];

// score
const initialSnakeLength = snake.length;
let score = 0;
let highScore = localStorage.getItem('high-score') || 0;

// food
let food = createFood();

function initializeSnake() {
    snake = [{ x: 0, y: 0 }];
}

function drawSnake() {
  snake.forEach((tile, i) => {
    drawSquare(tile.x, tile.y, snakeColor);
  });
}

function moveSnake() {
  // check if game not yet started
  if (!gameStarted) return;

  const head = { ...snake[0] };

  if (directionsQueue.length) {
    currentDirection = directionsQueue.shift();
  }

  switch (currentDirection) {
    case direction.LEFT:
      head.x -= 1;
      break;
    case direction.RIGHT:
      head.x += 1;
      break;
    case direction.UP:
      head.y -= 1;
      break;
    case direction.DOWN:
      head.y += 1;
      break;
  }

  if (hasEatenFood()) {
    food = createFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function hasEatenFood() {
  const head = snake[0];
  return food.x === head.x && food.y === head.y;
}

function hitWall() {
  const head = snake[0];
  return (
    head.x >= horizontalSq ||
    head.x < 0 ||
    head.y >= verticalSq ||
    head.y < 0
  );
}

function hitSelf() {
  const snakeBody = [...snake];
  const head = snakeBody.shift();

  return snakeBody.some(
    (tile) => tile.x === head.x && tile.y === head.y
  );
}

function setDirection(e) {
  const newDirection = e.key; 
  const oldDirection = currentDirection;

  if (
    (newDirection === direction.LEFT &&
      oldDirection !== direction.RIGHT) ||
    (newDirection === direction.RIGHT &&
      oldDirection !== direction.LEFT) ||
    (newDirection === direction.UP &&
      oldDirection !== direction.DOWN) ||
    (newDirection === direction.DOWN && oldDirection !== direction.UP)
  ) {
    if (!gameStarted) {
      gameLoop = setInterval(refreshFrame, FPS);
      gameStarted = true;
    }
    directionsQueue.push(newDirection);
  }
}

function renderScore() {
  score = snake.length - initialSnakeLength;
  scoreEl.innerHTML = `⭐ ${score}`;
  highScoreEl.innerHTML = `🏆 ${highScore}`;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createFood() {
  let food = {
    x: getRandomInt(0, horizontalSq),
    y: getRandomInt(0, verticalSq),
  };

  // loop until we find a food which is not overlaping with the snake
  while (
    snake.some((tile) => tile.x === food.x && tile.y === food.y)
  ) {
    food = {
      x: getRandomInt(0, horizontalSq),
      y: getRandomInt(0, verticalSq),
    };
  }

  return food;
}

function drawFood() {
  drawSquare(food.x, food.y, foodColor);
}

// draw square
function drawSquare(x, y, color) {
  const sq = squareSize;

  ctx.fillStyle = color;
  ctx.fillRect(x * sq, y * sq, sq, sq);

  ctx.strokeStyle = boardColor;
  ctx.strokeRect(x * sq, y * sq, sq, sq);
}

// draw board
function drawBoard() {
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, width, height);
}

// GAME OVER
function gameOver() {
  // select elements
  const scoreEl = gameOverEl.querySelector(
    '.game-over-score .current'
  );
  const highScoreEl = gameOverEl.querySelector(
    '.game-over-score .high'
  );

  // update score
  scoreEl.innerHTML = `⭐ ${score}`;

  // update high score
  highScore = Math.max(highScore, score);
  localStorage.setItem('high-score', highScore);
  highScoreEl.innerHTML = `🏆 ${highScore}`;

  // show game over screen
  gameOverEl.classList.remove('hide');
}

function restartGame() {
  // reset direction to no direction
  currentDirection = '';

  directionsQueue = [];

    initializeSnake();

  gameOverEl.classList.add('hide');

  gameStarted = false;

  refreshFrame();
}

// game loop
function refreshFrame() {
  drawBoard();
  drawFood();
  moveSnake();
  drawSnake();
  renderScore();

  // check for game over
  if (hitWall() || hitSelf()) {
    clearInterval(gameLoop);
    gameOver();
  }
}


function startGame()
{
refreshFrame();
}

startGame();

