# Great Snake Battle HTML5 Game 
## Preview

This is a game made for compsigh hackathon @USFCA. This is an upgraded version of Snake Battle. Added snake acceleration function, allowing multiple players/NPCs to play together. Added different appearances of snakes.
 Player versus player mode may be added in the future...

## Tech Stack
* **Front-end**: 
JavaScript, HTML, and CSS. Create game's UI and front-end logic. Maybe use Phaser.js or other HTML5 game engines in the future.
* **Back-end**: 
Python. Use Python integrated with the OpenAI API. Flask or FastAPI can be used as a lightweight backend framework.
* **OpenAI API integration**: 
Call OpenAI’s API through Python.
* **Communication**: 
Use WebSocket or AJAX to achieve real-time communication between the front end and back end.
* **Demo**: 
Deploy this game using a cloud service. E.G.: AWS, Google Cloud

## Dev Process
* **Git**: 

  Always pull beta branch to local. Develop new features based on beta branch
* **Branch**:

  Create your onw branch based on beta. Naming format is: /Yourname/feature

## Iteration
* **Version 1**:
  
  实现单机游戏完整功能：
  
  蛇：蛇头+蛇身✅
  
  游戏结束：碰撞边界后死亡✅

  散架
  
  蛇头经过自己不会判定身亡
  
  resest游戏：死亡后询问是否restart

  food随机生成大量food，food总数固定

  单机时候显示当前分数/蛇蛇长度

  蛇加速功能*
  
* **Version 2**:

  双人玩家对战模式

  撞击对方后的判定

  身体==2*food

  加速：左/右shift

  Login界面

  后端python存数据？

  前端蛇身叠加效果
* **Version 2.5**:

  UI设计
* **Version 3**:
    
  增加npc蛇

  接OpenAI api

* **Version 3**:

  双人玩家对战模式

* **Version 4**:

  server

## Game Structure
to be continued...
