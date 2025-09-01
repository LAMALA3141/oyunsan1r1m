// This file handles the functionality of the main menu, including displaying the menu, starting the game, and opening other panels like settings and how to play.

document.addEventListener('DOMContentLoaded', function() {
    const adminCode = '3141';
    const adminInput = prompt("Enter admin code:");

    if (adminInput === adminCode) {
        openAdminPanel();
    }

    // Other menu functionalities
    document.getElementById('startGameButton').addEventListener('click', startGame);
    document.getElementById('settingsButton').addEventListener('click', openSettings);
    document.getElementById('howToPlayButton').addEventListener('click', openHowTo);
});

function openAdminPanel() {
    // Logic to display the admin panel
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
    }
}

function startGame() {
    // Logic to start the game
    const overlay = document.getElementById('menuOverlay');
    if (overlay) overlay.style.display = 'none';
    // Additional game start logic
}

function openSettings() {
    // Logic to open settings panel
    showPanel('settings');
}

function openHowTo() {
    // Logic to open how to play panel
    showPanel('how');
}

function showPanel(panelId) {
    const panels = ['mainMenuPanel', 'settingsPanel', 'howToPanel'];
    panels.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) {
            panel.style.display = (id === panelId) ? 'block' : 'none';
        }
    });
}