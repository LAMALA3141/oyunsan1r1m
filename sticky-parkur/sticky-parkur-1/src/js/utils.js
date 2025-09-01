// This file contains utility functions for the Sticky Parkur game.

function checkAdminCode(input) {
    if (input === "3141") {
        return true;
    }
    return false;
}

function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
    }
}

function handleAdminInput(input) {
    if (checkAdminCode(input)) {
        showAdminPanel();
    }
}

function setStartLevel(level) {
    if (level >= 1 && level <= 15) {
        window.gameSettings.startLevel = level;
    }
}

// Exporting functions for use in other modules
export { handleAdminInput, setStartLevel };