var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 200;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 8;
var brickColumnCount = 6;
var brickWidth = 76;
var brickHeight = 20;
var brickPadding = 15;
var brickOffsetTop = 40;
var brickOffsetLeft = 40;
var score = 0;
let level = 1;
let fire = false;
var bullets = [];
var bricks = [];

//Function to initialize and reset elements with start and restart button
function init() {
  var bullets = [];
  dx = 2;
  dy = -2;
  score = 0;;
  level = 1;
  y = canvas.height-20;
  ballRadius = 10;
  bricks = [];
  for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

//Event listeners for game controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Keyboard left right controls
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" ) { 
      rightPressed = true;
      console.log('right key')
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
      console.log('left key')
    }
    else if(e.which == 32|| e.code == "Space") {
      fire = true;
      bullets.push(new Bullet(paddleX + paddleWidth/2, canvas.height-paddleHeight));
  }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.which == 32|| e.code == "Space") {
      fire = false;
    }
}


//Mouse Control Movement Functions
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

//Collision Detection with Bricks and Ball
function collisionDetectionBall() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          BRICK_HIT.play();
          b.status = 0;
          score += 2;
        }
      } 
    }
  }
  if(score == brickColumnCount* brickRowCount) {
    WIN.play();
    level ++;
    alert("NEXT LEVEL! " + level);
    score = 0;
    dx = 2;
    dy = -2;
     y = canvas.height-20;
    cancelAnimationFrame(animationId);
    brickColumnCount++;
    for(var c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    draw();
    //clearInterval(interval); // Needed for Chrome to end game
  }
}

//Bullet Class and Animation Drawing
class Bullet {
  constructor(x,y) {
    this.x =x;
    this.y =y;
    this.width = 10;
    this.height = 10;
  }
  drawBullet(){
    // if(fire === true) {
      //ctx.beginPath();
      ctx.fillStyle = 'red'
      ctx.fillRect(this.x, this.y -= 5, this.width, this.height);
      //ctx.closePath();
    // }
    // bullets.push.bullet;
  };
}

//Collision Detection with Bricks and Ball
function collisionDetectionBullet() {
  //console.log("made it to function")
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r]; // Isolating / checking one brick at a time
      for (let i=0; i < bullets.length; i++) {
        //console.log("made it to bullets loop") 
        /*if(bullets[i].y + bullets[i].height <= 0){
          bullets.splice(i, 1)
        } */
      if(b.status == 1) {
        if (bullets[i].x < b.x + brickWidth&&   // if hte left side of the bullet 
          bullets[i].x + bullets[i].width > b.x &&
          bullets[i].y < b.y + brickHeight &&
          bullets[i].y + bullets[i].height > b.y)  {
            console.log("bullet hit")
          BRICK_HIT.play();
          b.status = 0; 
          score += 2;
          bullets.splice(i, 1);
        }
      } 
      // if(b.status == 1) {
      //   console.log(`bullet y: ${bullets[i].y} brick bottom: ${b.height}`)
      //   if(bullets[i].y <= b.y + brickHeight)  {
      //     console.log("bullet hit")
      //     BRICK_HIT.play();
      //     b.status = 0; 
      //     score += 2;
      //   }
      // } 
    }
    }
  }
  if(score == brickColumnCount* brickRowCount) {
    WIN.play();
    level ++;
    alert("NEXT LEVEL! " + level);
    score = 0;
    dx = 2;
    dy = -2;
     y = canvas.height-20;
    cancelAnimationFrame(animationId);
    brickColumnCount++;
    for(var c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    // setTimeout 
    draw();
    //clearInterval(interval); // Needed for Chrome to end game
  }
}



//Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#eeee";
  ctx.fill();
  var gradient = ctx.createLinearGradient(0, 0, 170, 0);
  gradient.addColorStop("0", "magenta");
  gradient.addColorStop("0.5" ,"#ffffff");
  gradient.addColorStop("1.0", "magenta");
  ctx.strokeStyle = gradient;
  ctx.stroke();
  ctx.closePath();
}

//Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#C0C0C0";
  ctx.fill();
  ctx.closePath();
}

//Bricks
//loop through all the bricks in the array and draw them on the screen
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//Score
function drawScore() {
  ctx.font = "18px Serif";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 30, 20);
}

//Winning Score
function drawWinningScore() {
  ctx.font = "18px Serif";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Winning Score: "+ (brickColumnCount* brickRowCount),300, canvas.height-520);
}

//Current Game Level
function drawCurrentLevel() {
  ctx.font = "18px Serif";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Game Level: "+ level,650, canvas.height-520);
}
let animateId;


//Game Animation!
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  if(bullets.length !== 0){
    bullets.forEach(b=>b.drawBullet());
  }
  drawScore();
  drawWinningScore();
  drawCurrentLevel();
  collisionDetectionBall();
  if(bullets.length !== 0){
    for(let i=0; i < bullets.length; i++) {
      //console.log("made it to bullets loop")
      if(bullets[i].y + bullets[i].height <= 0){
        bullets.splice(i, 1)
      }
    }
  }
  collisionDetectionBullet();
  // console.log(x,y)

  // this is ball collision for right and left wall 
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
    WALL_HIT.play();
  }
  // ball collision for top wall
  if(y + dy < ballRadius) {
    dy = -dy;
    WALL_HIT.play();
  }
  // if the ball passes the floor
  else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      PADDLE_HIT.play();
    }
    else {
      window.cancelAnimationFrame(animationId);
      y = 0;
      LIFE_LOST.play();
      alert("GAME OVER! TRY AGAIN!");
      document.location.reload();
      //clearInterval(interval); // Clear game
      //cancel animtation
    }
  }

  //Move paddle speed with left and right key press
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 10;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 10;
  }

  // change the direction of the ball
  if(level > 1){
    x += dx;
    y += dy;
  } else {
    x += dx*1.5;
    y += dy*1.5;
  }
  // x += dx*2;
  // y += dy*2;
  animationId = requestAnimationFrame(draw);
}
let animationId = null;

//Start Button Event Listener
document.getElementById("start-button").addEventListener("click", function(){
  document.getElementById("start-button").disabled = true;
  document.getElementById("start-button").disabled = false;
  if(animationId) cancelAnimationFrame(animationId);
  init();
  draw();
});



//Restart Button Event Listener
document.getElementById("restart-button").addEventListener("click", function(){
  document.getElementById("restart-button").disabled = true;
  document.getElementById("restart-button").disabled = false;
  cancelAnimationFrame(animationId);
  init();
  draw();
});


//Game Sound Effects
const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";

const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

var toggleSound = true

function audioManager(){
  // let imgSrc = soundElement.getAttribute("src");
  
  let SOUND_IMG = toggleSound ? "./images/SOUND_ON.png" : "./images/SOUND_OFF.png";
  toggleSound = !toggleSound
    
    soundElement.setAttribute("src", SOUND_IMG);
    

    // MUTE AND UNMUTE SOUNDS
    WALL_HIT.muted = toggleSound;
    PADDLE_HIT.muted = toggleSound;
    BRICK_HIT.muted = toggleSound;
    WIN.muted = toggleSound;
    LIFE_LOST.muted = toggleSound;


    //Old Code
    // WALL_HIT.muted = WALL_HIT.muted ? false : true;
    // PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    // BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    // WIN.muted = WIN.muted ? false : true;
    // LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}