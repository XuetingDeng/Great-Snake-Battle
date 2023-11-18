const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 25;
let snakeDeath1 = false; //设置初始蛇存活状态
let snakeDeath2 = false; //设置初始蛇存活状态
let foodMultiple = []; // 生成food array
const foodNum = 15;
const foodColors = ['#b6dcb6', '#d2e9e1', '#fbedc9', '#f8dda9', '#fcb6d0', '#ffdee1', '#8ac6d1', '#d9d913'];//food color set
let snakePlayer1 = {}; // 第一条蛇
let snakePlayer2 = {}; // 第二条蛇
const shiftLeft = "Shift2";
const shiftRight = "Shift1";
const accFactor = 2;

// 蛇的初始位置随机
function createInitialSnake() {
  const startPosition = createRandomPosition();
  return [
    startPosition, { x: startPosition.x - gridSize, y: startPosition.y },
    { x: startPosition.x - gridSize, y: startPosition.y },
  ];
}
function initializeSnakes() {
  snakePlayer1 = {
    id:1,
    body: createInitialSnake(),
    dx: gridSize,
    dy: 0,
    speed: 500,
    isDead: false
  };

  snakePlayer2 = {
    id:2,
    body: createInitialSnake(),
    dx: gridSize,
    dy: 0,
    speed: 500,
    isDead: false
  };

  snakes = [snakePlayer1, snakePlayer2];
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
  if(!snake.isDead){
    snake.body.forEach((part, idx) => drawSnakePart(part, idx));
  }
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
function advanceSnake(snake) {
  if (snake.isDead) {
    return; //死了就结束游戏
  }
  const head = { x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy };
  snake.body.unshift(head); //inserts the given values to the beginning of an array-like object

  //check head位置是否与food一样
  let didEatFood = foodMultiple.findIndex(food => food.x === head.x && food.y === head.y);

  if (didEatFood != -1) {
    //create new random food
    foodMultiple.splice(didEatFood, 1);
    foodMultiple.push(createRandomFood());
  } else {
    //没吃到food, pop出snake[]最后一个元素
    snake.body.pop();
  }

  checkDeath();
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
  const goingUpPlayer2 = snakePlayer2.dy === -gridSize;
  const goingDownPlayer2 = snakePlayer2.dy === gridSize;
  const goingRightPlayer2 = snakePlayer2.dx === gridSize;
  const goingLeftPlayer2 = snakePlayer2.dx === -gridSize;

  const goingUpPlayer1 = snakePlayer1.dy === -gridSize;
  const goingDownPlayer1 = snakePlayer1.dy === gridSize;
  const goingRightPlayer1 = snakePlayer1.dx === gridSize;
  const goingLeftPlayer1 = snakePlayer1.dx === -gridSize;
  // 控制第一条蛇
  if (keyPressed === W_KEY && !goingDownPlayer1) {
    snakePlayer1.dx = 0;
    snakePlayer1.dy = -gridSize;
  } else if (keyPressed === A_KEY && !goingRightPlayer1) {
    snakePlayer1.dx = -gridSize;
    snakePlayer1.dy = 0;
  } else if (keyPressed === S_KEY && !goingUpPlayer1) {
    snakePlayer1.dx = 0;
    snakePlayer1.dy = gridSize;
  } else if (keyPressed === D_KEY && !goingLeftPlayer1) {
    snakePlayer1.dx = gridSize;
    snakePlayer1.dy = 0;
  }
  //按左键，只要snake不是向右运动的，就方向往左改变
  if (keyPressed === LEFT_KEY && !goingRightPlayer2) {
    snakePlayer2.dx = -gridSize;
    snakePlayer2.dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDownPlayer2) {
    snakePlayer2.dx = 0;
    snakePlayer2.dy = -gridSize;
  }
  if (keyPressed === RIGHT_KEY && !goingLeftPlayer2) {
    snakePlayer2.dx = gridSize;
    snakePlayer2.dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUpPlayer2) {
    snakePlayer2.dx = 0;
    snakePlayer2.dy = gridSize;
  }
}

function handleAcceleration (event) {
    if(event.type === 'keydown' && (event.key + event.location) === shiftLeft) {
        snakePlayer2.dx = Math.sign(snakePlayer2.dx) * gridSize * accFactor;
        snakePlayer2.dy = Math.sign(snakePlayer2.dy) * gridSize * accFactor;
    } else if (event.type === 'keyup' && (event.key + event.location) === shiftLeft) {
        snakePlayer2.dx = Math.sign(snakePlayer2.dx) * gridSize;
        snakePlayer2.dy = Math.sign(snakePlayer2.dy) * gridSize;
    } else if (event.type === 'keydown' && (event.key + event.location) === shiftRight){
        snakePlayer1.dx = Math.sign(snakePlayer1.dx) * gridSize * accFactor;
        snakePlayer1.dy = Math.sign(snakePlayer1.dy) * gridSize * accFactor;
    } else if (event.type === 'keyup' && (event.key + event.location) === shiftRight){
        snakePlayer1.dx = Math.sign(snakePlayer1.dx) * gridSize;
        snakePlayer1.dy = Math.sign(snakePlayer1.dy) * gridSize;
    }
}

function moveDirection(event){
    changeDirection(event);
    handleAcceleration(event);
}

function checkDeath() {
  for(let snake of snakes){
    const head = snake.body[0];
    //if snake's head is out of bound, die
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      markSnakeDead(snake);
    }
    checkSnakeCollision(snake);
  }

}
 // 检查蛇头是否与其他蛇的身体相撞
function checkSnakeCollision(snake){
  for (let otherSnake of snakes) {
    if (otherSnake !== snake) {
      const head = snake.body[0];
      for (let part of otherSnake.body) {
        if (head.x === part.x && head.y === part.y) {
          markSnakeDead(snake);
          return;
        }
      }
    }
  }
}
//标记蛇的死亡，在snakes中删去这个蛇，并转化为食物
function markSnakeDead(snake){
  snake.isDead = true;
  const index = snakes.indexOf(snake);
  if (index !== -1) {
    snakes.splice(index, 1);
  }
  for(let part of snake.body){
    const food ={x:part.x,y:part.y,color:'#b6dcb6'}
    foodMultiple.push(food)
  }
}


initializeFood();
initializeSnakes();
function main() {

  if (snakePlayer1.isDead && snakePlayer2.isDead) {
    alert("Game Over Snake1&2 dead");
    return;
  }

  setTimeout(function onTick() {
    clearCanvas();
    // initializeFood(); to do... 后续可以改成随着固定的时间额外增加一丢丢food
    drawFood();
    for(let snake of snakes){
      advanceSnake(snake);
      drawSnake(snake);
    }
    main();
  }, Math.min(300));//延迟150ms
  

}

//键盘按下事件监听器
document.addEventListener('keydown', moveDirection);
document.addEventListener('keyup', moveDirection)
// document.addEventListener('keydown', function (event) {
//   if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
//     // 如果按下的是右Shift键
//     snakeSpeed2 = 200; // 或者你想要的其他速度
//   }
// });

// document.addEventListener('keyup', function (event) {
//   if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
//     // 如果释放的是右Shift键
//     snakeSpeed2 =500; // 恢复初始速度
//   }
// });
// document.addEventListener('keydown', function (event) {
//   if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
//     // 如果按下的是左Shift键
//     snakeSpeed1 = 200; // 或者你想要的其他速度
//   }
// });

// document.addEventListener('keyup', function (event) {
//   if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
//     // 如果释放的是左Shift键
//     snakeSpeed1 = 500; // 恢复初始速度
//   }
// });
main();