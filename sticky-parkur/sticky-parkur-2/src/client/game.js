// This file contains the JavaScript code for the game logic, including player controls, game mechanics, and rendering.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player1 = {
    x: 50,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 5,
    jumpPower: 10,
    isJumping: false,
    velocityY: 0,
};

let player2 = {
    x: 150,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: 'red',
    speed: 5,
    jumpPower: 10,
    isJumping: false,
    velocityY: 0,
};

let gravity = 0.5;
let keys = {};

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Player 1 movement
    if (keys['a'] && player1.x > 0) {
        player1.x -= player1.speed;
    }
    if (keys['d'] && player1.x < canvas.width - player1.width) {
        player1.x += player1.speed;
    }
    if (keys['w'] && !player1.isJumping) {
        player1.isJumping = true;
        player1.velocityY = -player1.jumpPower;
    }
    
    // Player 2 movement
    if (keys['ArrowLeft'] && player2.x > 0) {
        player2.x -= player2.speed;
    }
    if (keys['ArrowRight'] && player2.x < canvas.width - player2.width) {
        player2.x += player2.speed;
    }
    if (keys['ArrowUp'] && !player2.isJumping) {
        player2.isJumping = true;
        player2.velocityY = -player2.jumpPower;
    }

    // Apply gravity
    player1.velocityY += gravity;
    player1.y += player1.velocityY;
    if (player1.y + player1.height >= canvas.height) {
        player1.y = canvas.height - player1.height;
        player1.isJumping = false;
        player1.velocityY = 0;
    }

    player2.velocityY += gravity;
    player2.y += player2.velocityY;
    if (player2.y + player2.height >= canvas.height) {
        player2.y = canvas.height - player2.height;
        player2.isJumping = false;
        player2.velocityY = 0;
    }

    // Draw players
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

update();