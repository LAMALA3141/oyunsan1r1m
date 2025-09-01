document.addEventListener('DOMContentLoaded', function() {
    const accessCodeInput = document.getElementById('accessCodeInput');
    const accessCodeButton = document.getElementById('accessCodeButton');
    const levelAccessInput = document.getElementById('levelAccessInput');
    const infiniteMoneyCheckbox = document.getElementById('infiniteMoneyCheckbox');
    const messageBox = document.getElementById('messageBox');

    accessCodeButton.addEventListener('click', function() {
        const accessCode = accessCodeInput.value;
        validateAccessCode(accessCode);
    });

    function validateAccessCode(code) {
        // Simulated access code validation
        const validCodes = {
            'LEVEL_ACCESS': 'granted',
            'INFINITE_MONEY': 'granted'
        };

        if (validCodes[code]) {
            messageBox.textContent = `Access granted for: ${code}`;
            if (code === 'LEVEL_ACCESS') {
                levelAccessInput.disabled = false;
            }
            if (code === 'INFINITE_MONEY') {
                infiniteMoneyCheckbox.checked = true;
            }
        } else {
            messageBox.textContent = 'Access denied. Invalid code.';
        }
    }

    levelAccessInput.addEventListener('change', function() {
        const level = levelAccessInput.value;
        // Logic to set the game level
        console.log(`Game level set to: ${level}`);
    });

    infiniteMoneyCheckbox.addEventListener('change', function() {
        const isInfiniteMoney = infiniteMoneyCheckbox.checked;
        // Logic to enable/disable infinite money
        console.log(`Infinite money: ${isInfiniteMoney}`);
    });
});