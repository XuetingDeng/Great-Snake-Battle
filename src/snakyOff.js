const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 25;

// 蛇的初始位置随机
let snake  = createInitialSnake();
function createInitialSnake() {
    const startPosition = createRandomPosition();
    return [
        startPosition, {x: startPosition.x - gridSize, y: startPosition.y},
        {x: startPosition.x - gridSize, y: startPosition.y},
    ];
}

function createRandomPosition() {
    const maxX = (canvas.width / gridSize) - 10;
    const maxY = (canvas.height / gridSize) - 5;
    const x = Math.floor(Math.random() * maxX) * gridSize;
    const y = Math.floor(Math.random() * maxY) * gridSize;
    return {x, y};
}

// 后续改成多个food随机分布
let food = { x: 300, y: 300 };
// 控制蛇蛇移动方向
let dx = gridSize;
let dy = 0;


//画蛇蛇
const snakePartImage = new Image();
snakePartImage.src = './public/appearance/donut.png';
//蛇的一小块
function drawSnakePart(snakePart) {
    ctx.drawImage(snakePartImage, snakePart.x, snakePart.y, gridSize, gridSize);
}
//retrieve蛇蛇组成一条大蛇
function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
  ctx.fillStyle = 'pink';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

//控制蛇蛇的移动
function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
  if (didEatFood) {
    food.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
    food.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
  } else {
    snake.pop();
  }
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -gridSize;
  const goingDown = dy === gridSize;
  const goingRight = dx === gridSize;
  const goingLeft = dx === -gridSize;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -gridSize;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -gridSize;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = gridSize;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = gridSize;
  }
}

function main() {
    setTimeout(function onTick() {
      clearCanvas();
      drawFood();
      advanceSnake();
      drawSnake();
      main();
    }, 100);
  }

document.addEventListener('keydown', changeDirection);
main();