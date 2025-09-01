// This file manages the in-game store, allowing players to purchase items or upgrades using in-game currency.

const storeItems = [
    { id: 1, name: "Hız Artışı", price: 100, description: "Karakterinizin hızını artırır." },
    { id: 2, name: "Zıplama Gücü", price: 150, description: "Daha yüksek zıplama sağlar." },
    { id: 3, name: "Özel Kostüm", price: 200, description: "Karakterinize özel bir görünüm kazandırır." },
];

let playerCoins = 0;

function addCoins(amount) {
    playerCoins += amount;
    updateCoinsDisplay();
}

function updateCoinsDisplay() {
    const coinsDisplay = document.getElementById('playerCoins');
    if (coinsDisplay) {
        coinsDisplay.textContent = playerCoins;
    }
}

function purchaseItem(itemId) {
    const item = storeItems.find(i => i.id === itemId);
    if (item) {
        if (playerCoins >= item.price) {
            playerCoins -= item.price;
            updateCoinsDisplay();
            alert(`${item.name} satın alındı!`);
        } else {
            alert("Yetersiz para!");
        }
    }
}

function displayStore() {
    const storePanel = document.getElementById('storePanel');
    if (storePanel) {
        storePanel.innerHTML = storeItems.map(item => `
            <div class="store-item">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p>Fiyat: ${item.price} Altın</p>
                <button onclick="purchaseItem(${item.id})">Satın Al</button>
            </div>
        `).join('');
        storePanel.style.display = 'block';
    }
}

// Admin panel functionality
function checkAdminInput(input) {
    if (input === "3141") {
        displayAdminPanel();
    }
}

function displayAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
    }
}

// Event listeners for admin input
document.getElementById('adminInput').addEventListener('change', function() {
    checkAdminInput(this.value);
});