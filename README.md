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


## Iteration
* **Version 1**:
  
  实现单机游戏完整功能：
  
  蛇：蛇头+蛇身
  
  游戏结束：碰撞边界后散架
  
  蛇头经过自己不会判定身亡
  
  resest游戏：死亡后询问是否restart
  蛇加速功能
* **Version 2**:
  思考：是否需要修改蛇的方向控制
    
  增加npc蛇
  
  碰到其他蛇身死亡
  
  npc死亡后散架身体变food
  
  身体==2*food
* **Version 3**:

  双人玩家对战模式

* **Version 4**:

  server

## Game Structure
to be continued...
