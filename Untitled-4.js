// Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game constants
const playerWidth = 50;
const playerHeight = 50;
const gravity = 0.5;
const jumpForce = -12;
const playerSpeed = 5;
const obstacleSpeed = 5;
const obstacleWidth = 50;
const obstacleHeight = 50;
const backgroundSpeed = 2;

// Game variables
let playerX = 100;
let playerY = canvas.height - playerHeight;
let playerVelocityY = 0;
let isJumping = false;
let obstacles = [];
let score = 0;
let lastObstacleTime = 0;
let backgroundOffsetX = 0;

// Initialize the game
function init() {
    document.addEventListener('keydown', handleKeydown);
    requestAnimationFrame(gameLoop);
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

// Draw the score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + Math.floor(score), 10, 30);
}

// Draw the background
function drawBackground() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(backgroundOffsetX, canvas.height - 50, canvas.width, 50); // Ground
    
    // Draw repeating background
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(backgroundOffsetX, 0, canvas.width, canvas.height - 50); // Background
}

// Update obstacles
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacleWidth > 0);
}

// Spawn new obstacles
function spawnObstacle() {
    const currentTime = Date.now();
    if (currentTime - lastObstacleTime > 2000) { // Spawn every 2 seconds
        lastObstacleTime = currentTime;
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight
        });
    }
}

// Check for collisions
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (
            playerX < obstacle.x + obstacleWidth &&
            playerX + playerWidth > obstacle.x &&
            playerY < obstacle.y + obstacleHeight &&
            playerY + playerHeight > obstacle.y
        ) {
            alert('Game Over! Your score was: ' + Math.floor(score));
            document.location.reload();
        }
    });
}

// Main update function
function update() {
    // Move the background
    backgroundOffsetX -= backgroundSpeed;
    if (backgroundOffsetX <= -canvas.width) {
        backgroundOffsetX = 0;
    }

    // Update player position
    if (isJumping) {
        playerVelocityY = jumpForce;
        isJumping = false;
    }

    playerVelocityY += gravity;
    playerY += playerVelocityY;

    if (playerY > canvas.height - playerHeight) {
        playerY = canvas.height - playerHeight;
        playerVelocityY = 0;
    }

    // Update obstacles
    updateObstacles();

    // Spawn new obstacles
    spawnObstacle();

    // Check for collisions
    checkCollisions();

    // Update score
    score += 0.1;  // Increase score over time

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the game elements
    drawBackground();
    drawPlayer();
    drawObstacles();
    drawScore();
}

// Handle keyboard input
function handleKeydown(event) {
    if (event.code === 'Space') {
        isJumping = true;
    }
}

// Main game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Start the game
init();
