const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 25;
let snakeDeath1 = false; //设置初始蛇存活状态
let snakeDeath2 = false; //设置初始蛇存活状态
let foodMultiple = []; // 生成food array
const foodNum = 15;
const foodColors = ['#b6dcb6', '#d2e9e1', '#fbedc9', '#f8dda9', '#fcb6d0', '#ffdee1', '#8ac6d1', '#d9d913'];//food color set
let snakePlayer1 = createInitialSnake(); // 第一条蛇
let snakePlayer2 = createInitialSnake(); // 第二条蛇
let dxPlayer1 = gridSize; // 第一条蛇的移动方向
let dyPlayer1 = 0;
let dxPlayer2 = gridSize; // 第二条蛇的移动方向
let dyPlayer2 = 0;
let snakeSpeed1 = 500; // 初始蛇的移动速度
let snakeSpeed2 = 500; // 初始蛇的移动速度
// 蛇的初始位置随机
// let snake = createInitialSnake();
function createInitialSnake() {
  const startPosition = createRandomPosition();
  return [
    startPosition, { x: startPosition.x - gridSize, y: startPosition.y },
    { x: startPosition.x - gridSize, y: startPosition.y },
  ];
}

function createRandomPosition() {
  const maxX = (canvas.width / gridSize) - 10;
  const maxY = (canvas.height / gridSize) - 5;
  const x = Math.floor(Math.random() * maxX + 2) * gridSize;
  const y = Math.floor(Math.random() * maxY + 2) * gridSize;
  return { x, y };
}

//多个food随机分布
function createRandomFood() {
  const randomColor = () => {
    const idx = Math.floor(Math.random() * foodColors.length);
    return foodColors[idx];
  };

  return {
    x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
    y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
    color: randomColor()
  };
}

//initialize food
function initializeFood() {
  for (let i = 0; i < foodNum; i++) {
    foodMultiple.push(createRandomFood());
  }
}
// initializeFood();

// //food 随机颜色
// function randomColor() {
//     const idx = Math.floor(Math.random() * foodColors.length);
//     return foodColors[idx];
// }

// 蛇蛇初始移动方向，永远往右to do... randomly move
// let dx = gridSize;
// let dy = 0;


//画蛇蛇
const snakePartImage = new Image();
const snakeHeadImage = new Image();
snakePartImage.src = './public/appearance/moon.png';
snakeHeadImage.src = './public/appearance/dollarImage.png';
//蛇的一小块
function drawSnakePart(snakePart, idx) {
  //idx是0 第一个元素则用蛇头图片，否，则用part图片
  const image = idx === 0 ? snakeHeadImage : snakePartImage;
  if (image.complete) {
    ctx.drawImage(image, snakePart.x, snakePart.y, gridSize, gridSize);
  }
  //to do ... 可以增加一个图片unloading情况
}
//retrieve蛇蛇组成一条大蛇
//后续增加对应的蛇头
function drawSnake(snake) {
  snake.forEach((part, idx) => drawSnakePart(part, idx));
}

function drawFood() {
  foodMultiple.forEach(
    function (food) {
      ctx.fillStyle = food.color;
      ctx.fillRect(food.x, food.y, gridSize, gridSize);
    }
  )
}

//控制蛇蛇的移动
function advanceSnake(snake, dx, dy, snakeDeath) {
  if (snakeDeath) {
    return; //死了就结束游戏
  }
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head); //inserts the given values to the beginning of an array-like object

  //check head位置是否与food一样
  let didEatFood = foodMultiple.findIndex(food => food.x === head.x && food.y === head.y);

  if (didEatFood != -1) {
    //create new random food
    foodMultiple.splice(didEatFood, 1);
    foodMultiple.push(createRandomFood());
  } else {
    //没吃到food, pop出snake[]最后一个元素
    snake.pop();
  }

  checkDeath(snake);
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function changeDirection(event) {
  const W_KEY = 87;
  const A_KEY = 65;
  const S_KEY = 83;
  const D_KEY = 68;

  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUpPlayer2 = dyPlayer2 === -gridSize;
  const goingDownPlayer2 = dyPlayer2 === gridSize;
  const goingRightPlayer2 = dxPlayer2 === gridSize;
  const goingLeftPlayer2 = dxPlayer2 === -gridSize;

  const goingUpPlayer1 = dyPlayer1 === -gridSize;
  const goingDownPlayer1 = dyPlayer1 === gridSize;
  const goingRightPlayer1 = dxPlayer1 === gridSize;
  const goingLeftPlayer1 = dxPlayer1 === -gridSize;
  // 控制第一条蛇
  if (keyPressed === W_KEY && !goingDownPlayer1) {
    dxPlayer1 = 0;
    dyPlayer1 = -gridSize;
  } else if (keyPressed === A_KEY && !goingRightPlayer1) {
    dxPlayer1 = -gridSize;
    dyPlayer1 = 0;
  } else if (keyPressed === S_KEY && !goingUpPlayer1) {
    dxPlayer1 = 0;
    dyPlayer1 = gridSize;
  } else if (keyPressed === D_KEY && !goingLeftPlayer1) {
    dxPlayer1 = gridSize;
    dyPlayer1 = 0;
  }
  //按左键，只要snake不是向右运动的，就方向往左改变
  if (keyPressed === LEFT_KEY && !goingRightPlayer2) {
    dxPlayer2 = -gridSize;
    dyPlayer2 = 0;
  }
  if (keyPressed === UP_KEY && !goingDownPlayer2) {
    dxPlayer2 = 0;
    dyPlayer2 = -gridSize;
  }
  if (keyPressed === RIGHT_KEY && !goingLeftPlayer2) {
    dxPlayer2 = gridSize;
    dyPlayer2 = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUpPlayer2) {
    dxPlayer2 = 0;
    dyPlayer2 = gridSize;
  }
}

function checkDeath(snake) {
  const head = snake[0];
  //if snake's head is out of bound, die
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    if (snake == snakePlayer1) { snakeDeath1 = true }else if(snake==snakePlayer2){snakeDeath2 = true}
    // snakeDeath = true; //蛇死了
  }
  console.log("checkDeath ", snake)
  console.log("checkDeath1 ", snakePlayer1, snakeDeath1)
  console.log("checkDeath2 ", snakePlayer2, snakeDeath2)
}

initializeFood();

function main() {

  if (snakeDeath1 && snakeDeath2) {
    alert("Game Over Snake1&2 dead");
    return;
  }
  // if (snakeDeath2) {
  //   alert("Game Over Snake2 dead");
  //   return;
  // }

  setTimeout(function onTick() {
    clearCanvas();
    // initializeFood(); to do... 后续可以改成随着固定的时间额外增加一丢丢food
    drawFood();
    // advanceSnake();
    // drawSnake();
    advanceSnake(snakePlayer1, dxPlayer1, dyPlayer1, snakeDeath1);
    drawSnake(snakePlayer1);
    advanceSnake(snakePlayer2, dxPlayer2, dyPlayer2, snakeDeath2);
    drawSnake(snakePlayer2);
    main();
  }, Math.min(snakeSpeed1, snakeSpeed2));//延迟150ms

}

//键盘按下事件监听器
document.addEventListener('keydown', changeDirection);
document.addEventListener('keydown', function (event) {
  if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
    // 如果按下的是右Shift键
    snakeSpeed2 = 200; // 或者你想要的其他速度
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
    // 如果释放的是右Shift键
    snakeSpeed2 =500; // 恢复初始速度
  }
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
    // 如果按下的是左Shift键
    snakeSpeed1 = 200; // 或者你想要的其他速度
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
    // 如果释放的是左Shift键
    snakeSpeed1 = 500; // 恢复初始速度
  }
});
main();