var ballX = 75;
var BallSpeedX = 5;
var ballY = 75;
var BallSpeedY = 5;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COL = 10;
const BRICK_ROW = 14;
const BRICK_GAP = 2;
var bricksLeft = 0;

var brickGrid = new Array(BRICK_COL * BRICK_ROW);

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE_FROM_EDGE = 60;
var paddleX = 400;
var mouseX;
var mouseY;

function brickReset() {
  bricksLeft = 0;
  for (let i = 0; i < BRICK_COL * BRICK_ROW; i++) {
    brickGrid[i] = true;
    bricksLeft++;
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

function ballMove() {
  ballX += BallSpeedX;
  ballY += BallSpeedY;

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
}

function ballBrickHandle() {
  var ballBrickCol = Math.floor(ballX / BRICK_W);
  var ballBrickRow = Math.floor(ballY / BRICK_H);
  var brickNumber = colToArrayIndex(ballBrickCol, ballBrickRow);

  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COL &&
    ballBrickRow >= 0 && ballBrickRow < BRICK_ROW) {
    if (brickGrid[brickNumber]) {
      brickGrid[brickNumber] = false;
      bricksLeft--;

      var prevBallX = ballX - BallSpeedX;
      var prevBallY = ballY - BallSpeedY;

      var prevBrickCol = Math.floor(prevBallX / BRICK_W);
      var prevBrickRow = Math.floor(prevBallY / BRICK_H);

      var ballHitThreeBrickCorner = true;

      if (prevBrickCol != ballBrickCol) {
        var adjacentBrickSide = colToArrayIndex(prevBrickCol, ballBrickRow);

        if (brickGrid[adjacentBrickSide]) {
          BallSpeedX *= -1;
          ballHitThreeBrickCorner = false;
        }
      }

      if (prevBrickRow != ballBrickRow) {
        var adjacentBrickSide = colToArrayIndex(ballBrickCol, prevBrickRow);

        if (brickGrid[adjacentBrickSide]) {
          BallSpeedY *= -1;
          ballHitThreeBrickCorner = false;
        }
      }

      if (ballHitThreeBrickCorner) {
        BallSpeedY *= -1;
        BallSpeedX *= -1;
      }
    }
  }
}

function ballPaddleHandle() {
  var paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeY = paddleLeftEdgeX + PADDLE_WIDTH;

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

function moveAll() {
  ballMove();
  ballBrickHandle();
  ballPaddleHandle();
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

  // when all briscks are gone reset;
  if (bricksLeft === 0) {
    resetCanvas();
  }
}

function updateAll() {
  moveAll();
  drawAll()
}

function colorText(showWords, textX, textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}