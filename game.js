var ballX = 75;
var BallSpeedX = 5;
var ballY = 75;
var BallSpeedY = 5;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
var paddleX = 400;

function updateMousePos(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;


  var mouseX = event.clientX - rect.left - root.scrollLeft;
  //var mouseY = event.clientY - rect.top - root.scrollTop;

  paddleX = mouseX;
}

window.onload = function onload() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesperSecond = 30;
  setInterval(updateAll, 1000 / framesperSecond);

  canvas.addEventListener('mousemove', updateMousePos);
}

function resetCanvas() {
  ballX = 0;
  ballY = 0;
}

function moveAll() {
  ballX += BallSpeedX;
  ballY += BallSpeedY;

  // if ball y is 0 and x is not in range of paddle restart
  if (ballY === canvas.height && (ballX < paddleX || ballX > paddleX + 100)) {
    return resetCanvas();
  }

  if (ballX > canvas.width || ballX < 0) {
    BallSpeedX *= -1
  }

  if (ballY > canvas.height || ballY < 0) {
    BallSpeedY *= -1
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

function drawAll() {
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorCircle(ballX, ballY, 10, 'white');
  colorRect(paddleX, canvas.height - PADDLE_THICKNESS, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
}

function updateAll() {
  moveAll();
  drawAll()
}