// settings.js
document.addEventListener('DOMContentLoaded', function() {
    const adminInput = prompt("Enter admin code:");
    if (adminInput === "3141") {
        showAdminPanel();
    }
});

function showAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.style.position = 'fixed';
    adminPanel.style.top = '50%';
    adminPanel.style.left = '50%';
    adminPanel.style.transform = 'translate(-50%, -50%)';
    adminPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    adminPanel.style.color = 'white';
    adminPanel.style.padding = '20px';
    adminPanel.style.borderRadius = '10px';
    adminPanel.style.zIndex = '9999';

    const title = document.createElement('h2');
    title.innerText = 'Admin Panel';
    adminPanel.appendChild(title);

    const startLevelLabel = document.createElement('label');
    startLevelLabel.innerText = 'Başlangıç Bölümü:';
    adminPanel.appendChild(startLevelLabel);

    const startLevelInput = document.createElement('input');
    startLevelInput.type = 'number';
    startLevelInput.min = '1';
    startLevelInput.max = '15';
    startLevelInput.value = '1';
    adminPanel.appendChild(startLevelInput);

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Kaydet';
    saveButton.onclick = function() {
        const startLevel = parseInt(startLevelInput.value, 10);
        if (Number.isFinite(startLevel) && startLevel >= 1 && startLevel <= 15) {
            window.gameSettings.startLevel = startLevel;
            alert('Ayarlar kaydedildi!');
            document.body.removeChild(adminPanel);
        } else {
            alert('Lütfen geçerli bir bölüm numarası girin.');
        }
    };
    adminPanel.appendChild(saveButton);

    document.body.appendChild(adminPanel);
}