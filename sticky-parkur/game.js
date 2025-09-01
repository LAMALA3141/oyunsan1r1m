// File: /sticky-parkur/sticky-parkur/game.js

let gameSettings = {
    startLevel: 1,
    startFullscreen: false,
    volumePercent: 60
};

let adminPanelVisible = false;

function startGame() {
    // Game starting logic here
}

function showAdminPanel() {
    // Logic to display the admin panel
    adminPanelVisible = true;
    console.log("Admin panel is now visible.");
}

function checkInput(input) {
    if (input === "3141") {
        showAdminPanel();
    } else {
        startGame();
    }
}

// Event listener for user input
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const userInput = prompt("Enter code:");
        checkInput(userInput);
    }
});

// Other game logic functions here...