var width = 320;
var height = 450;
var keys = [false, false, false, false];
var aiMoveSpeed = 100;
var aiMoveLimit = 200;
var playerMoveSpeed = 100;
var mainBall;
var angleList = {100: 0.25, 200: 0.5, 300: 0.75, 400: 1};
var speedList = {100: 5, 200: 10, 300: 15, 400: 20};
// console.log(angleList[100]);

function Vector2(x, y) {
  this.X = x;
  this.Y = y;
}

function checkCollision(ball, paddle) {
  return (
    ball.xPos + ball.width >= paddle.xPos &&
    ball.xPos <= paddle.xPos + paddle.width &&
    ball.yPos + ball.height >= paddle.yPos &&
    ball.yPos <= paddle.yPos + paddle.height
  );
}

function createMiddleLine(count) {
  var boxWidth = (width-((count-1)*10))/count;
  var boxHeight = 2;
  var boxX = 0;
  for (var i = 0; i < count; i++) {
    image("middleLine" + i, "icon://fa-circle");
    setProperty("middleLine" + i, "fit", "none");
    setProperty("middleLine" + i, "icon-color", "white");
    setPosition("middleLine" + i, boxX, height/2 + boxHeight, boxWidth, boxHeight);
    boxX += boxWidth + 10;
  }
}

function checkSideCollision(ball, paddle) {
  return (
    (ball.xPos + ball.width >= paddle.xPos &&
    ball.xPos <= paddle.xPos &&
    ball.yPos >= paddle.yPos &&
    ball.yPos + ball.height <= paddle.yPos + paddle.height + ball.height/2) ||
    (ball.xPos + ball.width < paddle.xPos + paddle.width &&
    ball.xPos < paddle.xPos + paddle.width &&
    ball.yPos >= paddle.yPos &&
    ball.yPos + ball.height <= paddle.yPos + paddle.height + ball.height/2)
  ); 
  // return false;
  
}

/* Start Ball Class */
function Ball(id, x, y, width, height, move_speed, direction) {
  this.id = id;
  this.xPos = x;
  this.yPos = y;
  this.width = width;
  this.height = height;
  this.move_speed = move_speed;
  this.initialMoveSpeed = move_speed;
  this.direction = direction;
  this.inHalf = 1;
  
  image(id, "icon://fa-circle");
  setProperty(id, "icon-color", "white");
  setPosition(id, x, y, width, height);
  setProperty(id, "border-width", 0);
  setProperty(id, "fit", "none");
}

Ball.prototype.move = function(dt, paddleList) {
  var paddleHit = false;
  var sideCollision = false;
  var new_x;
  var new_y;
  
  // var rightCollision = false;
  if (this.yPos <= height/2) {
    this.inHalf = 1;
  } else {
    this.inHalf = -1;
  }
  
  // Left side wall
  if (this.xPos < 0) {
    this.xPos = 0;
    this.direction.X *= -1;
  } 
  
  // Right side wall
  if (this.xPos + this.width > width) {
    this.xPos = width - this.width;
    this.direction.X *= -1;
  }
  
  
  for (var i = 0; i < paddleList.length; i++) {
    if (paddleHit != true) {
      paddleHit = checkCollision(this, paddleList[i]);
    }
    if (paddleHit) {
      // sideCollision = checkSideCollision(this, paddleList[i]);
      // rightCollision = checkRightCollision(this, paddleList[i]);
      sideCollision = false;
      
      
      if (sideCollision) {
        console.log("Side");
        this.direction.X *= -1;
        this.direction.Y *= -1;
        // console.log("Side");
      } else {
        // console.log("Hit");
        // console.log(paddleList[i].lastPoint.X);
        // console.log(paddleList[i].xPos);
        if (paddleList[i].lastPoint.X != paddleList[i].xPos) {
          // console.log("HI");
          // console.log("Switch directions");
          // console.log(paddleList[i].move_speed);
          if (paddleList[i].moveDirection < 0) {
            // console.log("Moving left");
            
            this.direction.X = angleList[paddleList[i].move_speed] * -1;
            // console.log("============");
            // console.log(this.direction.X);
            // console.log("============");
            this.direction.Y *= -1;
            if (this.move_speed < 700) {
              this.move_speed += speedList[paddleList[i].move_speed];
            }
            
          } else {
            // console.log("Moving right");
            
            this.direction.X = angleList[paddleList[i].move_speed];
            this.direction.Y *= -1;
            if (this.move_speed < 700) {
              this.move_speed += speedList[paddleList[i].move_speed];
            }
            
          }
        } else {
          console.log(paddleList[i].move_speed);
          this.direction.Y *= -1;
          if (this.direction.X < 0) {
            this.direction.X = angleList[paddleList[i].move_speed] * -1;
          } else {
            this.direction.X = angleList[paddleList[i].move_speed];
          }
          
          // this.direction.X *= -1;
          // console.log("Continue same direction");
          // console.log(this.direction.X);
        }
      }
      
      // playSound("sound://category_hits/retro_game_simple_impact_3.mp3");
      paddleHit = false;
      // sideCollision = false;
      // rightCollision = false;
    }
    paddleList[i].lastPoint.X = paddleList[i].xPos;
  }
  
  // new_x = this.xPos + (this.move_speed * this.direction.X) * dt;
  // new_y = this.yPos + (this.move_speed * this.direction.Y) * dt;
  // setProperty(this.id, "x", new_x);
  // setProperty(this.id, "y", new_y);

  // this.xPos = new_x;
  // this.yPos = new_y;
  
  
    // Side wall detection

  // console.log("Move SpEEEEEED " + this.move_speed * this.direction.X);
  new_x = this.xPos + (this.move_speed * this.direction.X) * dt;
  new_y = this.yPos + (this.move_speed * this.direction.Y) * dt;
  setProperty(this.id, "x", new_x);
  setProperty(this.id, "y", new_y);

  this.xPos = new_x;
  this.yPos = new_y;
  
  
  if (this.yPos <= 0) {
    // console.log(this.yPos);
    this.xPos = width/2;
    this.yPos = height/2;
    setProperty(this.id, "x", this.xPos);
    setProperty(this.id, "y", this.yPos);

    paddleList[1].score += 1;
    setProperty("bottomPlayerScore", "text",paddleList[1].score);
    
    this.direction.Y = 1;
    this.direction.X = 1;
    this.move_speed = this.initialMoveSpeed;
    // console.log("HI");
  }
  if (this.yPos + this.height >= height) {
    this.xPos = width/2;
    this.yPos = height/2;
    setProperty(this.id, "x", this.xPos);
    setProperty(this.id, "y", this.yPos);

    paddleList[0].score += 1;
    setProperty("topPlayerScore", "text",paddleList[0].score);

    this.direction.Y = -1;
    this.direction.X = -1;
    this.move_speed = this.initialMoveSpeed;
    // console.log("BYE");
  }
};

Ball.prototype.getDetails = function() {
  return this.xPos + " " + this.yPos;
};

/* End Ball Class */

/* Start Paddle Class */

function Paddle(id, x, y, width, height, move_speed, aiMoveSpeed, aiMoveLimit, moveDirection, score, lastBallPoint, left, right, topOrBottom) {
  this.id = id;
  
  this.xPos = x;
  this.yPos = y;
  
  this.width = width;
  this.height = height;
  
  this.move_speed = move_speed;
  this.initialMoveSpeed = move_speed;
  
  this.speedLimit = aiMoveLimit;
  // this.aiMoveSpeed = aiMoveSpeed;
  this.initialAiMoveSpeed = aiMoveSpeed;
  // console.log(this.initialAiMoveSpeed);
  
  this.moveDirection = moveDirection;
  this.score = score;
  this.lastBallPoint = lastBallPoint;
  this.lastPoint = new Vector2(0,0);
  this.leftKey = left;
  this.rightKey = right;
  this.ballSpawn = y + (height * topOrBottom);
  this.half = topOrBottom;
  
  image(id, "icon://fa-circle");
  setProperty(id, "icon-color", "white");
  setPosition(id, x, y, width, height);
  setProperty(id, "border-width", 0);
  setProperty(id, "fit", "none");
}

Paddle.prototype.move = function (dt, left, right) {
  var x = this.xPos;
  if (left) {
    if (this.xPos <= 0) {
        x = 0;
        this.moveDirection = 1;
    } else {
        x = this.xPos - this.move_speed * dt;
        this.moveDirection = -1;
        if (this.move_speed < 400) {
          this.move_speed += 100;
        }
        // console.log(this.move_speed);
    }
    
  }
  if (!left & !right) {
    this.move_speed = this.initialMoveSpeed;
  }
  if (right) {  
    if (this.xPos + this.width >= width) {
        x = width - this.width;
        this.moveDirection = -1;
    } else {    
        x = this.xPos + this.move_speed * dt;
        this.moveDirection = 1;
        if (this.move_speed < 400) {
          this.move_speed += 100;
        }
        // console.log(this.move_speed);
    }
  }
  if (!right && !left) {
    this.move_speed = this.initialMoveSpeed;
  }
  setProperty(this.id, "x", x);
  this.xPos = x;
};

Paddle.prototype.aiMove = function(dt, ball) {
  var new_x;
  var slope;
  var yIntercept;
  var xIntercept;
  // var moveDirection;
  if (ball.inHalf == this.half) {
    slope = (this.lastBallPoint.Y - ball.yPos) / (this.lastBallPoint.X - ball.xPos);
  
    yIntercept = ((-1 * slope) * ball.xPos) + ball.yPos;
    
    xIntercept = ((-1 * yIntercept) + this.ballSpawn) / slope;
  
    if (xIntercept <= this.xPos + this.width/2) {
      this.moveDirection = -1;
      
    } else {
      this.moveDirection = 1;
    }
    

  
    this.lastBallPoint.X = ball.xPos;
    this.lastBallPoint.Y = ball.yPos;
  
    if (this.xPos + this.width/2 != xIntercept) {
      if (this.xPos + this.width > width) {
        this.xPos = width - this.width;
      } else if (this.xPos < 0){
        this.xPos = 0;
      }
      if ((this.xPos + this.width/2 >= xIntercept - 5  && this.xPos + this.width/2 <= xIntercept + 5) || this.xPos + this.width/2 == xIntercept) {
        // console.log("Inside MOE: " + (this.xPos + this.width/2) + " " + xIntercept);
        this.xPos = xIntercept - this.width/2;
        this.moveDirection = ball.direction.X;
        this.move_speed = this.initialAiMoveSpeed;
        console.log(this.move_speed);
      } else {
        if (this.move_speed < this.speedLimit) {
          this.move_speed += 100;
        }
        new_x = Math.round(this.xPos + (this.move_speed * this.moveDirection) * dt);
        this.xPos = new_x;
      }
      setProperty(this.id, "x", this.xPos);
      
    }
  } else {
    if (this.xPos + this.width/2 != width/2) {
      if (this.xPos + this.width/2 < width/2) {
        this.moveDirection = 1;
      } else {
        this.moveDirection = -1;
      }
      if ((this.xPos + this.width/2 >= width/2 - 5 && this.xPos + this.width/2 <= width/2 + 5) || this.xPos + this.width/2 == width/2) {
        this.xPos = width/2 - this.width/2;
        // console.log(this.move_speed);
        this.move_speed = this.initialAiMoveSpeed;
        // console.log(this.move_speed);
      } else {
        new_x = this.xPos + (this.move_speed * this.moveDirection) * dt;
        this.xPos = new_x;
      }
      setProperty(this.id, "x", this.xPos);
      
    }
  }
  
};

/* End Paddle Class */

var randomDirectionList = [-1,1];
var paddleList = [];


// console.log(mainBall.yPos);

function start() {
  mainBall = new Ball("0", width/2 - 5, height/2 - 2.5, 10, 10, 300, new Vector2(randomDirectionList[randomNumber(0,1)], randomDirectionList[randomNumber(0,1)]));
  paddleList.push(new Paddle("paddle1", width/2 - 40, 40, 80, 20, playerMoveSpeed, aiMoveSpeed, aiMoveLimit, 1, 0, new Vector2(0,0), 0, 1, 1));
  paddleList.push(new Paddle("paddle2", width/2 - 40, height - 40, 80, 20, playerMoveSpeed, aiMoveSpeed, aiMoveLimit, 1, 0, new Vector2(0,0), 2, 3, -1));
  createMiddleLine(20);
  var startTime = new Date().getTime();
  // console.log(startTime);
  var currentTime = 0;
  var text = "";
  showElement("countDownText");
  setProperty("countDownText", "x", width/2 - getProperty("countDownText", "width")/2);
  while (currentTime < startTime + 4000) {
    currentTime = new Date().getTime();
    if (currentTime < startTime + 1000) {
      text = "3";
    } else if (currentTime < startTime + 2000) {
      text = "2";
    } else if (currentTime < startTime + 3000) {
      text = "1";
    } else {
      text = "GO!";
      setProperty("countDownText", "x", width/2 - getProperty("countDownText", "width")/2);
    }
    setProperty("countDownText", "text", text);
  }
  endFrameTime = new Date().getTime() / 1000;
  var interval = setInterval(run, 16.6666666667);
  setProperty("countDownText", "text", "");
  hideElement("countDownText");
  showElement("topPlayerScore");
  showElement("bottomPlayerScore");
  
}

var startFrameTime;
var endFrameTime = new Date().getTime() / 1000;
var dt;
var botNum;
var bot2Num;

function run() {
  // console.log(mainBall.yPos);
  startFrameTime = new Date().getTime() / 1000;


  dt = startFrameTime - endFrameTime;
  // topPaddle.aiMove(dt, mainBall);
  // topPaddle.move(dt, keys[0], keys[1]);
  // // bottomPaddle.aiMove(dt, mainBall);
  // bottomPaddle.move(dt, keys[2], keys[3]);
  
  mainBall.move(dt, paddleList);
  for (var i = 0; i < paddleList.length; i++) {
    // console.log(i);
    
    // paddleList[i].aiMove(dt, mainBall);
    if (i == botNum || i == bot2Num) {
      paddleList[i].move(dt, keys[paddleList[i].leftKey], keys[paddleList[i].rightKey]);
    } else {
      paddleList[i].aiMove(dt, mainBall);
    }
    
  }
  
  

  endFrameTime = new Date().getTime() / 1000;
}


function checkBots() {
  if (getProperty("0BotButton", "checked")) {
    botNum = 0;
    bot2Num = 1;
  } else if (getProperty("1BotButton", "checked")) {
    botNum = 3;
    bot2Num = 1;
  } else if (getProperty("2BotButton", "checked")) {
    botNum = 3;
    bot2Num = 4;
  }
}

onEvent("0BotButton", "click", function () {
  playerMoveSpeed = 400;
  hideElement("botDifficultyLabel");
  hideElement("easyButton");
  hideElement("mediumButton");
  hideElement("hardButton");
});
onEvent("1BotButton", "click", function () {
  showElement("botDifficultyLabel");
  showElement("easyButton");
  showElement("mediumButton");
  showElement("hardButton");
});
onEvent("2BotButton", "click", function () {
  showElement("botDifficultyLabel");
  showElement("easyButton");
  showElement("mediumButton");
  showElement("hardButton");
});

onEvent("easyButton", "click", function () {
  // aiMoveSpeed = 200;
  aiMoveLimit = 200;
});
onEvent("mediumButton", "click", function () {
  // aiMoveSpeed = 300;
  aiMoveLimit = 300;
});
onEvent("hardButton", "click", function () {
  // aiMoveSpeed = 400;
  aiMoveLimit = 400;
});

onEvent("startButton", "click", function () {
  setScreen("screen1");
  checkBots();
  start();
});

onEvent("screen1", "keydown", function(event) {
  if ((event.key == "Left")) {
    keys[0] = true;
  } if ((event.key == "Right")) {
    keys[1] = true;
  }
  if ((event.key == "a")) {
    keys[2] = true;
  } 
  if ((event.key == "d")) {
    keys[3] = true;
  }
});

onEvent("screen1", "keyup", function(event) {
  if ((event.key == "Left")) {
    keys[0] = false;
  } 
  if ((event.key == "Right")) {
    keys[1] = false;
  }
  if ((event.key == "a")) {
    keys[2] = false;
  } 
  if ((event.key == "d")) {
    keys[3] = false;
  }
});

