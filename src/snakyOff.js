const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 25;
let snakeDeath1 = false; //设置初始蛇存活状态
let snakeDeath2 = false; //设置初始蛇存活状态
let foodMultiple = []; // 生成food array
const foodNum = 30;
const foodImages = ['./public/food/food1.png', './public/food/food2.png', './public/food/food3.png', './public/food/food4.png', './public/food/food5.png', './public/food/food6.png', './public/food/food7.png', './public/food/food8.png'];
let foodImagesObjects = {};
let snakePlayer1 = {}; // 第一条蛇
let snakePlayer2 = {}; // 第二条蛇
const shiftLeft = "Shift2";
const shiftRight = "Shift1";
const accFactor = 2;
//NPC蛇数量
const snakesNPCNum = 4;

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
    id: 1,
    body: createInitialSnake(),
    dx: gridSize,
    dy: 0,
    speed: 500,
    isDead: false,
    score: 0,
    killEnemies: 0,
    snakeHeadImage: "./public/appearance/head-user1.png",
    snakePartImage: localStorage.getItem('player1SelectedSkin'),
  };

  snakePlayer2 = {
    id: 2,
    body: createInitialSnake(),
    dx: gridSize,
    dy: 0,
    speed: 500,
    isDead: false,
    score: 0,
    killEnemies: 0,
    snakeHeadImage: "./public/appearance/head-user2.png",
    snakePartImage: localStorage.getItem('player2SelectedSkin'),
  };

  snakes = [snakePlayer1, snakePlayer2];
}

initializeSnakes();

function createRandomPosition() {
  const maxX = (canvas.width / gridSize) - 10;
  const maxY = (canvas.height / gridSize) - 5;
  const x = Math.floor(Math.random() * maxX + 2) * gridSize;
  const y = Math.floor(Math.random() * maxY + 2) * gridSize;
  return { x, y };
}

function randomImage() {
  const idx = Math.floor(Math.random() * foodImages.length);
  return foodImages[idx];
}

//多个food随机分布
function createRandomFood() {
  return {
    x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
    y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
    image: randomImage()
  };
}

//initialize food
function initializeFood() {
  for (let i = 0; i < foodNum; i++) {
    foodMultiple.push(createRandomFood());
  }
}
// initializeFood();
// function increaseFood() {
//   foodMultiple.push(createRandomFood());
// }

//画蛇蛇
const snakeNPCPart = new Image();
const snakeNPCHead = new Image();
snakeNPCPart.src = './public/appearance/love.png';
snakeNPCHead.src = './public/appearance/star.png';
//蛇的一小块
function drawSnakePart(snakePart, idx,snakeId) {
  const snakePartImage = new Image();
  const snakeHeadImage = new Image();
  if(snakeId==1){
    snakePartImage.src = snakePlayer1.snakePartImage;
    snakeHeadImage.src = snakePlayer1.snakeHeadImage;
  }else if(snakeId==2){
    snakePartImage.src = snakePlayer2.snakePartImage;
    snakeHeadImage.src = snakePlayer2.snakeHeadImage;
  }

  //idx是0 第一个元素则用蛇头图片，否，则用part图片
  const image = idx === 0 ? snakeHeadImage : snakePartImage;
  // const image = idx === 0 ? snakeHeadImage : snakePartImage;
  if (image.complete) {
    ctx.drawImage(image, snakePart.x, snakePart.y, gridSize, gridSize);
  }
  //to do ... 可以增加一个图片unloading情况
}
//retrieve蛇蛇组成一条大蛇
//后续增加对应的蛇头
function drawSnake(snake) {
  // if(!snake.isDead){
  //   snake.body.forEach((part, idx) => drawSnakePart(part, idx));
  // }
  let snakeId = snake.id;
  if (!isSnakeNPC(snake)) {
    if (!snake.isDead) {
      for(let i=0;i<snake.body.length;++i){
        drawSnakePart(snake.body[i], i,snakeId);
      }
      // snake.body.forEach((part, idx) => drawSnakePart(part, idx,snakeId));
    }
  } else {
    if (!snake.isDead) {
      snake.body.forEach((part, idx) => drawSnakePartNPC(part, idx));
    }
  }
}

function preloadFoodImages() {
  for (let src of foodImages) {
    let img = new Image();
    img.src = src;
    foodImagesObjects[src] = img;
  }
}

function drawFood() {
  foodMultiple.forEach(food => {
    let foodImage = foodImagesObjects[food.image];
    if (foodImage && foodImage.complete) {
      ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);
    }
  });
}

preloadFoodImages();

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
    snake.score++;
  } else {
    //没吃到food, pop出snake[]最后一个元素
    snake.body.pop();
  }

  checkDeath();
}

function clearCanvas() {
  ctx.fillStyle = "rgb(47, 43, 72)";
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

function handleAcceleration(event) {
  if (event.type === 'keydown' && (event.key + event.location) === shiftLeft) {
    snakePlayer2.dx = Math.sign(snakePlayer2.dx) * gridSize * accFactor;
    snakePlayer2.dy = Math.sign(snakePlayer2.dy) * gridSize * accFactor;
  } else if (event.type === 'keyup' && (event.key + event.location) === shiftLeft) {
    snakePlayer2.dx = Math.sign(snakePlayer2.dx) * gridSize;
    snakePlayer2.dy = Math.sign(snakePlayer2.dy) * gridSize;
  } else if (event.type === 'keydown' && (event.key + event.location) === shiftRight) {
    snakePlayer1.dx = Math.sign(snakePlayer1.dx) * gridSize * accFactor;
    snakePlayer1.dy = Math.sign(snakePlayer1.dy) * gridSize * accFactor;
  } else if (event.type === 'keyup' && (event.key + event.location) === shiftRight) {
    snakePlayer1.dx = Math.sign(snakePlayer1.dx) * gridSize;
    snakePlayer1.dy = Math.sign(snakePlayer1.dy) * gridSize;
  }
}

function moveDirection(event) {
  changeDirection(event);
  handleAcceleration(event);
}

function checkDeath() {
  for (let snake of snakes) {
    const head = snake.body[0];
    //if snake's head is out of bound, die
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      markSnakeDead(snake);
    }
    checkSnakeCollision(snake);
  }

}
// 检查蛇头是否与其他蛇的身体相撞
function checkSnakeCollision(snake) {
  for (let otherSnake of snakes) {
    if (otherSnake !== snake) {
      const head = snake.body[0];
      for (let part of otherSnake.body) {
        if (head.x === part.x && head.y === part.y) {
          markSnakeDead(snake);
          if (!isSnakeNPC(otherSnake)) {
            otherSnake.score += 5;
            otherSnake.killEnemies++;
          }
          return;
        }
      }
    }
  }
}
//标记蛇的死亡，在snakes中删去这个蛇，并转化为食物
function markSnakeDead(snake) {
  snake.isDead = true;
  const index = snakes.indexOf(snake);
  if (index !== -1) {
    snakes.splice(index, 1);
  }
  for (let part of snake.body) {
    const food = {
      x: part.x,
      y: part.y,
      image: randomImage()
    };
    foodMultiple.push(food);
  }
  if (isSnakeNPC(snake)) {
    let id = snake.id;
    createSnakesNPC(id - 10);
  }
}

function drawSnakePartNPC(snakePart, idx) {
  //idx是0 第一个元素则用蛇头图片，否，则用part图片
  const image = idx === 0 ? snakeNPCHead : snakeNPCPart;
  if (image.complete) {
    ctx.drawImage(image, snakePart.x, snakePart.y, gridSize, gridSize);
  }
  //to do ... 可以增加一个图片unloading情况
}

function createSnakesNPC(num) {
  const snakeNPC = {
    id: 10 + num,
    body: createInitialSnake(),
    dx: gridSize,
    dy: 0,
    isDead: false
  }
  snakes.push(snakeNPC);
}

function isSnakeNPC(snake) {
  if (snake.id == 1 || snake.id == 2) {
    return false;
  }
  return true;
}

function changeDirectionNPC() {
  for (let snake of snakes) {
    if (isSnakeNPC(snake)) {
      const randomNumber = Math.floor(Math.random() * 4);
      if (randomNumber == 0 && !(snake.dx == gridSize)) {
        snake.dx = -gridSize;
        snake.dy = 0;
      } else if (randomNumber == 1 && !(snake.dy == gridSize)) {
        snake.dx = 0;
        snake.dy = -gridSize;
      }
      else if (randomNumber == 2 && !(snake.dx == -gridSize)) {
        snake.dx = gridSize;
        snake.dy = 0;
      }
      else if (randomNumber == 3 && !(snake.dy == -gridSize)) {
        snake.dx = 0;
        snake.dy = gridSize;
      }
    }
  }
}

initializeFood();

for (let i = 0; i < snakesNPCNum; i++) {
  createSnakesNPC(i);
}

function fetchScoresAndDisplay() {
  fetch('https://snake-game-405604.ue.r.appspot.com/get_scores')
    .then(response => response.json())
    .then(data => {
      console.log("fetchScoresAndDisplay", data)
      // 仅获取前五名
      //排序
      let sortedScores = data.scores.sort((a, b) => b.score - a.score);
      const topScores = sortedScores.slice(0, 5);
      displayScores(topScores);
    })
    .catch(error => console.error('Error fetching scores:', error));
}
function sendScoreToServer(snake) {
  const scoreData = {
    player_name: 'Player1',
    score: snake.score,
  };
  fetch('https://snake-game-405604.ue.r.appspot.com/save_score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 声明发送的数据是 JSON 格式
    },
    body: JSON.stringify(scoreData), // 将数据转换为 JSON 字符串
  })
    .then(response => response.json())
    .then(data => {
      console.log('Score successfully sent:', data);
      // 如果有需要，可以在成功发送后执行其他操作
    })
    .catch(error => console.error('Error sending score:', error));
}
function displayScores(scores) {
  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = ''; // 清空现有内容

  scores.forEach(score => {
    const scoreItem = document.createElement('li');
    scoreItem.innerHTML = `Username: ${score.player_name} <br> Score: ${score.score}`;
    scoreList.appendChild(scoreItem);
  });
}
function updateScore() {
  // 获取显示分数的元素
  let score1 = document.getElementById('score1');
  let score2 = document.getElementById('score2');
  let player1 = document.getElementById('player1');
  let player2 = document.getElementById('player2');
  let kill1 = document.getElementById('kill1');
  let kill2 = document.getElementById('kill2');

  // 更新分数
  score1.textContent = 'Score: ' + snakePlayer1.score;
  score2.textContent = 'Score: ' + snakePlayer2.score;
  player1.textContent = 'Player1: ' + snakePlayer1.id;
  player2.textContent = 'Player2: ' + snakePlayer2.id;
  kill1.textContent = 'Kill enemies: ' + snakePlayer1.killEnemies;
  kill2.textContent = 'Kill enemies: ' + snakePlayer2.killEnemies;
}

function main() {
  if (snakePlayer1.isDead && snakePlayer2.isDead) {
    // alert("Game Over Snake1&2 dead");
    // document.getElementById('game-over-container').classList.remove('hidden');
    const div = document.getElementById('game-over-container');


    div.style.display = 'block';
    updateScore();
    sendScoreToServer(snakePlayer1);
    sendScoreToServer(snakePlayer2);
    return;
  }

  setTimeout(function onTick() {
    clearCanvas();
    // initializeFood(); to do... 后续可以改成随着固定的时间额外增加一丢丢food
    drawFood();
    for (let snake of snakes) {
      advanceSnake(snake);
      drawSnake(snake);
    }
    changeDirectionNPC();
    main();
  }, Math.min(300));//延迟150ms

}

//键盘按下事件监听器
document.addEventListener('keydown', moveDirection);
document.addEventListener('keyup', moveDirection);
document.addEventListener('DOMContentLoaded', fetchScoresAndDisplay);


main();