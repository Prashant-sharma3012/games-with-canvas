var ballX = 75;
var BallSpeedX = 5;
var ballY = 75;
var BallSpeedY = 5;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COL = 10;
const BRICK_ROW = 14;
const BRICK_GAP = 2;

var brickGrid = new Array(BRICK_COL * BRICK_ROW);

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE_FROM_EDGE = 60;
var paddleX = 400;
var mouseX;
var mouseY;

function brickReset() {
  for (let i = 0; i < BRICK_COL * BRICK_ROW; i++) {
    brickGrid[i] = true;
  }
}

function updateMousePos(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = event.clientX - rect.left - root.scrollLeft;
  mouseY = event.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - (PADDLE_WIDTH / 2);
}

window.onload = function onload() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesperSecond = 30;
  setInterval(updateAll, 1000 / framesperSecond);
  brickReset();
  //ballReset();
  canvas.addEventListener('mousemove', updateMousePos);
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function resetCanvas() {
  brickReset();
  ballReset();
}

function moveAll() {
  ballX += BallSpeedX;
  ballY += BallSpeedY;
  var paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeY = paddleLeftEdgeX + PADDLE_WIDTH;

  if (ballX < 0) {
    BallSpeedX *= -1
  }

  if (ballX > canvas.width) {
    BallSpeedX *= -1
  }

  if (ballY < 0) {
    BallSpeedY *= -1
  }

  if (ballY > canvas.height) {
    resetCanvas();
  }

  var ballBrickCol = Math.floor(ballX / BRICK_W);
  var ballBrickRow = Math.floor(ballY / BRICK_H);
  var brickNumber = colToArrayIndex(ballBrickCol, ballBrickRow);

  // we could have just checked if brick number is in the brick grid length
  // but for a mooment ball goes out of canvas bounds and that
  // will delete the brick on opposite side of grid
  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COL &&
    ballBrickRow >= 0 && ballBrickRow < BRICK_ROW) {
    if (brickGrid[brickNumber]) {
      brickGrid[brickNumber] = false;
      BallSpeedY *= -1
    }
  }

  if (ballY > paddleTopEdgeY &&
    ballY < paddleBottomEdgeY &&
    ballX > paddleLeftEdgeX &&
    ballX < paddleRightEdgeY) {
    BallSpeedY *= -1

    var centerOfPaddle = paddleX + PADDLE_WIDTH / 2;
    var ballDistanceFromPaddleCentreX = ballX - centerOfPaddle;
    BallSpeedX = ballDistanceFromPaddleCentreX * 0.35;
  }

}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeigth, fillcolor) {
  canvasContext.fillStyle = fillcolor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeigth);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colToArrayIndex(col, row) {
  return col + BRICK_COL * row;
}

function drawBricks() {
  for (j = 0; j < BRICK_ROW; j++) {
    for (let i = 0; i < BRICK_COL; i++) {
      let brickNumber = colToArrayIndex(i, j);
      if (brickGrid[brickNumber]) {
        colorRect(BRICK_W * i, BRICK_H * j, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue');
      }
    }
  }
}

function drawAll() {
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorCircle(ballX, ballY, 10, 'white');
  colorRect(paddleX, canvas.height - PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');

  drawBricks();
}

function updateAll() {
  moveAll();
  drawAll()
}

function colorText(showWords, textX, textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}