
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1.5;
let jumpForce = 18;
let groundHeight = 100;

let irys = {
  x: 100,
  y: canvas.height - groundHeight - 60,
  width: 60,
  height: 60,
  velocityY: 0,
  isJumping: false,
};

let ground = {
  y: canvas.height - groundHeight,
  height: groundHeight
};

let obstacles = [];
let coins = [];
let obstacleTimer = 0;
let coinTimer = 0;
let score = 0;
let lives = 3;

const irysImg = new Image();
irysImg.src = "irys.png";
const groundImg = new Image();
groundImg.src = "ground.png";
const obstacleImg = new Image();
obstacleImg.src = "obstacle.png";
const backgroundImg = new Image();
backgroundImg.src = "background.png";
const coinImg = new Image();
coinImg.src = "coin.png";

function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawGround() {
  ctx.drawImage(groundImg, 0, ground.y, canvas.width, ground.height);
}

function drawIRyS() {
  ctx.drawImage(irysImg, irys.x, irys.y, irys.width, irys.height);
}

function drawObstacles() {
  obstacles.forEach(ob => {
    ctx.drawImage(obstacleImg, ob.x, ob.y, ob.width, ob.height);
  });
}

function drawCoins() {
  coins.forEach(coin => {
    ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
  });
}

function drawUI() {
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("❤️ x" + lives, canvas.width - 120, 30);
}

function resetGame() {
  obstacles = [];
  coins = [];
  score = 0;
  lives = 3;
  irys.y = canvas.height - groundHeight - irys.height;
  irys.velocityY = 0;
  irys.isJumping = false;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawGround();

  irys.velocityY += gravity;
  irys.y += irys.velocityY;

  if (irys.y > canvas.height - groundHeight - irys.height) {
    irys.y = canvas.height - groundHeight - irys.height;
    irys.isJumping = false;
  }

  // Spawn obstacles
  obstacleTimer++;
  if (obstacleTimer > 100) {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - groundHeight - 40,
      width: 40,
      height: 40
    });
    obstacleTimer = 0;
  }

  // Spawn coins
  coinTimer++;
  if (coinTimer > 150) {
    coins.push({
      x: canvas.width,
      y: canvas.height - groundHeight - 100,
      width: 30,
      height: 30
    });
    coinTimer = 0;
  }

  // Update obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let ob = obstacles[i];
    ob.x -= 6;

    if (
      irys.x < ob.x + ob.width &&
      irys.x + irys.width > ob.x &&
      irys.y < ob.y + ob.height &&
      irys.y + irys.height > ob.y
    ) {
      obstacles.splice(i, 1);
      lives--;
      if (lives <= 0) {
        alert("Game Over!");
        resetGame();
        return;
      }
    }

    if (ob.x + ob.width < 0) {
      obstacles.splice(i, 1);
    }
  }

  // Update coins
  for (let i = 0; i < coins.length; i++) {
    let coin = coins[i];
    coin.x -= 5;

    if (
      irys.x < coin.x + coin.width &&
      irys.x + irys.width > coin.x &&
      irys.y < coin.y + coin.height &&
      irys.y + irys.height > coin.y
    ) {
      coins.splice(i, 1);
      score += 10;
    }

    if (coin.x + coin.width < 0) {
      coins.splice(i, 1);
    }
  }

  drawCoins();
  drawObstacles();
  drawIRyS();
  drawUI();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", function (e) {
  if ((e.code === "Space" || e.code === "ArrowUp") && !irys.isJumping) {
    irys.velocityY = -jumpForce;
    irys.isJumping = true;
  }
});

gameLoop();
