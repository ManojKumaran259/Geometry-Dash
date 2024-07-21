const jumpSound = new Audio('jump.mp3'); // Add a jump sound file in the project directory
const gameOverSound = new Audio('gameOver.mp3'); // Add a game over sound file in the project directory

function handleKeydown(event) {
    if (event.code === 'Space') {
        isJumping = true;
        jumpSound.play();  // Play the jump sound
    }
}

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (
            playerX < obstacle.x + obstacleWidth &&
            playerX + playerWidth > obstacle.x &&
            playerY < obstacle.y + obstacleHeight &&
            playerY + playerHeight > obstacle.y
        ) {
            gameOverSound.play();  // Play the game over sound
            alert('Game Over! Your score was: ' + Math.floor(score));
            document.location.reload();
        }
    });
}
