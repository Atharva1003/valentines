// Get the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Load images
const playerImage = new Image();
playerImage.src = "D:/Softwares/Microsoft_VS_Code/Runner/assets/Atharva.png"; // Player character

const girlfriendImage = new Image();
girlfriendImage.src = "D:/Softwares/Microsoft_VS_Code/Runner/assets/Avanti.png"; // Girlfriend at the end

const obstacleImage = new Image();
obstacleImage.src = "D:/Softwares/Microsoft_VS_Code/Runner/assets/cactus.png"; // Obstacle (like the Dino game)

// Load sounds
const jumpSound = new Audio("D:/Softwares/Microsoft_VS_Code/Runner/assets/jump.mp3");
const bgMusic = new Audio("D:/Softwares/Microsoft_VS_Code/Runner/assets/music.mp3");
bgMusic.loop = true; // Loop background music

// Ensure music plays after user interaction
document.addEventListener("click", () => {
    bgMusic.play();
});

// Player object
let player = {
    x: 100,
    y: 350, // Lowered to align with obstacles
    width: 50,
    height: 50,
    velocityY: 0,
    jumping: false
};

// Gravity
const gravity = 0.5;
const jumpStrength = -10;

// Score & levels
let score = 0;
let currentLevel = 1;
const maxLevel = 5;
let distanceTraveled = 0; // Track distance for score

// Obstacles array
let obstacles = [];

// Generate obstacles at random intervals
function spawnObstacle() {
    let obstacle = {
        x: canvas.width,
        y: 350,
        width: 40,
        height: 50
    };
    obstacles.push(obstacle);
}

// Spawning obstacles every 1.5 - 3 seconds
setInterval(spawnObstacle, Math.random() * 2000 + 1500);

// Handle jumping
document.addEventListener("keydown", (event) => {
    if (event.key === " " && !player.jumping) { // Spacebar for jumping
        player.jumping = true;
        player.velocityY = jumpStrength;
        jumpSound.play(); // Play jump sound
    }
});

// Update game loop
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y >= 350) {
        player.y = 350;
        player.jumping = false;
    }

    // Move the game world left (simulating player running forward)
    distanceTraveled += 1.5; // Adjust speed of movement

    // Update score based on distance traveled
    if (distanceTraveled % 50 === 0) { // Slowed down scoring
        score++;
    }

    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Move & draw obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5 + currentLevel * 0.5; // Increase speed with level
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Collision detection
        if (
            player.x + player.width > obstacle.x &&
            player.x < obstacle.x + obstacle.width &&
            player.y + player.height > obstacle.y
        ) {
            alert("Oops! You hit an obstacle. Restarting game.");
            resetGame();
        }

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    // Score display
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Check level-up and show messages
    if (score >= 10 && currentLevel < 2) {
        levelUp(2, "Level 1: Run to your love! 💕");
    } else if (score >= 20 && currentLevel < 3) {
        levelUp(3, "Level 2: You're getting closer! 🏃‍♂️💨");
    } else if (score >= 30 && currentLevel < 4) {
        levelUp(4, "Level 3: Love is worth the chase! ❤️");
    } else if (score >= 40 && currentLevel < 5) {
        levelUp(5, "Level 4: Almost there! 💘");
    }

    // Final level: Show girlfriend and letter
    if (score >= 50) {
        ctx.drawImage(girlfriendImage, 650, 250, 100, 150);
        setTimeout(showLoveLetter, 1000);
    } else {
        requestAnimationFrame(updateGame);
    }
}

// Handle level-up messages
function levelUp(level, message) {
    currentLevel = level;
    alert(message);  // Show custom level-up message
}

// Show love letter at the end
function showLoveLetter() {
    const letterContainer = document.querySelector(".letter-container");
    letterContainer.style.display = "block";
}

// Reset game after collision
// Reset game after collision
function resetGame() {
    score = 0;
    currentLevel = 1;  // Reset level to 1 (beginning of the game)
    distanceTraveled = 0;  // Reset distance
    player.y = 350;
    player.velocityY = 0;  // Reset velocity to 0
    obstacles = [];
    bgMusic.currentTime = 0;  // Restart music from the beginning
    bgMusic.play();  // Play music after reset
    updateGame();  // Restart the game}

}

// Start game loop
updateGame();
