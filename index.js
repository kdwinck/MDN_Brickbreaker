//-------------------------------------- variables --------------------------------------//

// create canvas element and context object
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

// create game paddle
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// paddle movement variables
let rightPressed = false;
let leftPressed = false;

// create ball starting point
let x = canvas.width / 2;
let y = canvas.height - 30;

// ball radius
let ballRadius = 10;

// create movement (direction) values
let dx = 3;
let dy = -3;

// create brick values
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// create the bricks 2d array
let bricks = [];
const colorsMap = ["#D85959", "#58E475", "#3A37CD"];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1, color: r};    
  }
}

// score
let score = 0;

// player lives
let lives = 3;

//-------------------------------------- draw elements --------------------------------------//

// draw the ball
let drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// draw the paddle
let drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// draw the bricks
let drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = colorsMap[bricks[c][r].color];
        ctx.fill();
        ctx.closePath();
      }
    }
    
  }
}

// draw the score
let drawScore = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// draw the player lives
let drawLives = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

let draw = () => {
  // clear the entire canvas every function call
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collissionDetection();

  // check if ball hits left or right wall
  hitLeftOrRightWall();
  
  // check if ball hits top or bottom wall
  hitTopOrBottomWall();

  // check for paddle movement
  didPaddleMove();

  // move ball
  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

//--------------------------------- Handle lost life reset --------------------------------//
let resetBall = () => {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 3;
  dy = -3;
  paddleX = (canvas.width - paddleWidth) / 2;
}


//-------------------------------- Handle border collission -------------------------------//
let hitLeftOrRightWall = () => {
  if (x + dx > (canvas.width - ballRadius) || x + dx < ballRadius) {
    dx = -dx;
  }
}

let hitTopOrBottomWall = () => {
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > (canvas.height - ballRadius)) {
    if (x > paddleX && x < (paddleX + paddleWidth)) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        gameEnd("Game Over");
      } else {
        resetBall();
      }
    }
  }
}

//-------------------------------- Handle brick collission --------------------------------//
let collissionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if ((x > b.x) && (x < b.x + brickWidth) && (y > b.y) && (y < b.y + brickHeight)) {
          dy = -dy;
          if (colorsMap[b.color] === "#3A37CD") {
            b.status = 0;
            score++;
          }
          b.color++;
          if (score === (brickColumnCount * brickRowCount)) {
            gameEnd("YOU WIN, CONGRATULATIONS!");
          }
        }
      }
    }
  }
}

//----------------------------- Handle paddle movement events -----------------------------//
let didPaddleMove = () => {
  if (rightPressed && paddleX < (canvas.width - paddleWidth)) {
    paddleX += 7;
  }

  if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

// start moving paddle
let keyDownHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

// stop moving paddle
let keyUpHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// mouse movements
let mouseMoveHandler = (e) => {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - (paddleWidth / 2);
  }
}

//----------------------------- Handle win/loss alerts -----------------------------//
let gameEnd = (message) => {
  alert(message);
  document.location.reload();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

draw();