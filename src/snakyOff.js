const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 25;
let snakeDeath = false; //设置初始蛇存活状态
let foodMultiple = []; // 生成food array
const foodNum = 15;
const foodColors = ['#b6dcb6', '#d2e9e1', '#fbedc9', '#f8dda9', '#fcb6d0', '#ffdee1', '#8ac6d1', '#d9d913'];//food color set
//加速feature的const
const ACC_Key = 'Shift';
let accFactor = 2;
//处理加速时候的const:
let originalDx = gridSize;//因为一开始设定的是向右走
let originalDy = 0;
// 蛇蛇初始移动方向，永远往右to do... randomly move
let dx = gridSize;
let dy = 0;

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
    for(let i = 0; i < foodNum; i++) {
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
    if(image.complete) {
        ctx.drawImage(image, snakePart.x, snakePart.y, gridSize, gridSize);
    }
    //to do ... 可以增加一个图片unloading情况
}
//retrieve蛇蛇组成一条大蛇
//后续增加对应的蛇头
function drawSnake() {
  snake.forEach((part, idx) => drawSnakePart(part, idx));
}

function drawFood() {
  foodMultiple.forEach(
    function(food){
        ctx.fillStyle = food.color;
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
    }
  )
}

//控制蛇蛇的移动
function advanceSnake() {
    if(snakeDeath) {
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

    checkDeath();
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

  //按左键，只要snake不是向右运动的，就方向往左改变
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -gridSize;
    dy = 0;
  } else if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -gridSize;
  } else if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = gridSize;
    dy = 0;
  } else if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = gridSize;
  }
}

function handleAcceleration(event) {
    if(event.type === 'keydown' && event.key === ACC_Key) {
        dx = Math.sign(dx) * gridSize * accFactor;
        dy = Math.sign(dy) * gridSize * accFactor;
    } else if (event.type === 'keyup' && event.key === ACC_Key) {
        dx = Math.sign(dx) * gridSize;
        dy = Math.sign(dy) * gridSize;
    } 
}


function moveDirection(event) {
    handleAcceleration(event);
    changeDirection(event);
}

function checkDeath() {
    const head = snake[0];
    //if snake's head is out of bound, die
    if(head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        snakeDeath = true; //蛇死了
    }
}

initializeFood();

function main() {
    
    if(snakeDeath) {
        alert("Game Over");
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        // initializeFood(); to do... 后续可以改成随着固定的时间额外增加一丢丢food
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 150);//延迟150ms
}

//键盘按下事件监听器
document.addEventListener('keyup', moveDirection);
document.addEventListener('keydown',moveDirection);


main();