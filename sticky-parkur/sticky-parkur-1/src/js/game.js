// This file contains the main game logic, including the game loop, player controls, and collision detection.

let adminCode = "3141";
let isAdmin = false;

// Function to check for admin input
function checkAdminInput(input) {
    if (input === adminCode) {
        isAdmin = true;
        displayAdminPanel();
    }
}

// Function to display the admin panel
function displayAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.id = 'adminPanel';
    adminPanel.style.position = 'fixed';
    adminPanel.style.top = '50%';
    adminPanel.style.left = '50%';
    adminPanel.style.transform = 'translate(-50%, -50%)';
    adminPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    adminPanel.style.color = 'white';
    adminPanel.style.padding = '20px';
    adminPanel.style.borderRadius = '10px';
    adminPanel.innerHTML = `
        <h2>Admin Panel</h2>
        <p>Welcome, Admin!</p>
        <label for="startLevel">Başlangıç Bölümü:</label>
        <input id="startLevel" type="number" min="1" max="15" value="1" />
        <button onclick="saveAdminSettings()">Kaydet</button>
        <button onclick="closeAdminPanel()">Kapat</button>
    `;
    document.body.appendChild(adminPanel);
}

// Function to save admin settings
function saveAdminSettings() {
    const startLevel = document.getElementById('startLevel').value;
    window.gameSettings.startLevel = Math.max(1, Math.min(15, startLevel));
    alert('Ayarlar kaydedildi!');
}

// Function to close the admin panel
function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        document.body.removeChild(adminPanel);
    }
}

// Example of how to check for input (this could be tied to a specific input field or event)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const userInput = prompt("Admin kodunu girin:");
        checkAdminInput(userInput);
    }
});

// Main game loop
function gameLoop() {
    // Game logic goes here
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();