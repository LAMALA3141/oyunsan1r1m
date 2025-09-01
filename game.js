// Canvas ve context ayarları
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Oyun için sanal çözünürlük (oyun fiziği ve çizimler bu boyuta göre)
const baseWidth = 800;
const baseHeight = 600;

// Oyun değişkenleri
const gravity = 0.5;
const friction = 0.8;
const jumpPower = -12;
// Mağaza ve ekonomi
const COIN_REWARD_PER_WIN = 10;
const DEFAULT_CHARACTER_PRICES = {
    'Abdulrezzak': 0,
    'Mahmut Abi': 0,
    'Karakter 3': 30,
    'Karakter 4': 40,
    'Karakter 5': 50,
    'Karakter 6': 60
};
let storeState = {
    p1Coins: 0,
    p2Coins: 0,
    p1Owned: { 'Abdulrezzak': true, 'Mahmut Abi': true, 'Karakter 3': false, 'Karakter 4': false, 'Karakter 5': false, 'Karakter 6': false },
    p2Owned: { 'Abdulrezzak': true, 'Mahmut Abi': true, 'Karakter 3': false, 'Karakter 4': false, 'Karakter 5': false, 'Karakter 6': false },
    p1Selected: 'Abdulrezzak',
    p2Selected: 'Mahmut Abi'
};
function loadStore() {
    try {
        const raw = localStorage.getItem('sticky_store_v1');
        if (raw) {
            const data = JSON.parse(raw);
            storeState = Object.assign({}, storeState, data);
        }
    } catch(e) {}
}
function saveStore() {
    try { localStorage.setItem('sticky_store_v1', JSON.stringify(storeState)); } catch(e) {}
}
window.initStore = function initStore() { loadStore(); updateCharactersUI(); };

// Bölümler
let currentLevel = 1;
let gameOver = false;
let winnerText = '';
const scores = { 'Abdulrezzak': 0, 'Mahmut Abi': 0, 'Karakter 3': 0, 'Karakter 4': 0, 'Karakter 5': 0, 'Karakter 6': 0 };
// Güçlü tekme durumu (Mahmut Abi)
let mahmutKickActive = false;
let mahmutKickEndTime = 0;
let mahmutKickHasHit = false;
let mahmutKickDirection = 1; // 1: sağa, -1: sola
let mahmutKickCooldownUntil = 0;
const MAHMUT_KICK_COOLDOWN_MS = 2000;

// Kol uzatma (Abdulrezzak)
let abdulPullActive = false;
let abdulPullEndTime = 0;
let abdulPullHasHit = false;
let abdulPullDirection = 1; // 1: sağa, -1: sola
let abdulPullCooldownUntil = 0;
const ABDUL_PULL_COOLDOWN_MS = 2000;
let abdulPullStartTime = 0;

// Admin/cheat modu: "ubdulrezzak 2014" (Abdul) ve "mahmut abi 2017" (Mahmut) yazılırsa aktif olur
let abdulCheatMode = false;
let cheatInputBuffer = '';
let mahmutCheatMode = false;
// Menü arkaplanında demo modu
let demoMode = false;
let demoLastKickTime = 0;
let demoLastPullTime = 0;
// Tek bir oyun döngüsü çalışsın
let animationHandle = null;

const levels = {
    1: {
        platforms: [
            // Kırmızı ana zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            
            // Sol turuncu blok (büyük)
            { x: 0, y: 400, width: 120, height: 150, color: '#FF8800' },
            
            // Sağ turuncu blok (büyük)
            { x: 680, y: 420, width: 120, height: 130, color: '#FF8800' },
            
            // Orta platformlar
            { x: 200, y: 300, width: 80, height: 20, color: '#FF8800' },
            { x: 400, y: 300, width: 80, height: 20, color: '#FF8800' },
            { x: 600, y: 300, width: 80, height: 20, color: '#FF8800' },
        ],
        flag: { x: 750, y: 350, width: 30, height: 50 }
    },
    
    2: {
        platforms: [
            // Kırmızı ana zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            
            // Zorlu platformlar
            { x: 100, y: 450, width: 60, height: 20, color: '#FF8800' },
            { x: 250, y: 400, width: 60, height: 20, color: '#FF8800' },
            { x: 400, y: 350, width: 60, height: 20, color: '#FF8800' },
            { x: 550, y: 300, width: 60, height: 20, color: '#FF8800' },
            { x: 700, y: 250, width: 60, height: 20, color: '#FF8800' },
            
            // Üst platformlar
            { x: 150, y: 200, width: 60, height: 20, color: '#FF8800' },
            { x: 300, y: 150, width: 60, height: 20, color: '#FF8800' },
            { x: 450, y: 100, width: 60, height: 20, color: '#FF8800' },
            { x: 600, y: 50, width: 60, height: 20, color: '#FF8800' },
        ],
        flag: { x: 750, y: 0, width: 30, height: 50 }
    },
    
    3: {
        platforms: [
            // Kırmızı ana zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            
            // Çok zorlu platformlar
            { x: 50, y: 450, width: 40, height: 20, color: '#FF8800' },
            { x: 150, y: 400, width: 40, height: 20, color: '#FF8800' },
            { x: 250, y: 350, width: 40, height: 20, color: '#FF8800' },
            { x: 350, y: 300, width: 40, height: 20, color: '#FF8800' },
            { x: 450, y: 250, width: 40, height: 20, color: '#FF8800' },
            { x: 550, y: 200, width: 40, height: 20, color: '#FF8800' },
            { x: 650, y: 150, width: 40, height: 20, color: '#FF8800' },
            { x: 750, y: 100, width: 40, height: 20, color: '#FF8800' },
        ],
        flag: { x: 750, y: 0, width: 30, height: 50 }
    }
    ,
    4: {
        platforms: [
            // Zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            // Başlangıç güvenli platformu
            { x: 20, y: 480, width: 140, height: 20, color: '#FF8800' },
            // Basamaklar
            { x: 200, y: 430, width: 80, height: 20, color: '#FF8800' },
            { x: 320, y: 380, width: 80, height: 20, color: '#FF8800' },
            { x: 440, y: 330, width: 80, height: 20, color: '#FF8800' },
            { x: 560, y: 280, width: 80, height: 20, color: '#FF8800' },
            { x: 680, y: 230, width: 80, height: 20, color: '#FF8800' }
        ],
        flag: { x: 700, y: 0, width: 30, height: 50 }
    }
    ,
    5: {
        platforms: [
            // Zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            // Başlangıç güvenli platformu
            { x: 30, y: 500, width: 120, height: 20, color: '#FF8800' },
            // Orta yükseklikte aralıklı küçük adımlar
            { x: 220, y: 470, width: 50, height: 20, color: '#FF8800' },
            { x: 300, y: 430, width: 50, height: 20, color: '#FF8800' },
            { x: 380, y: 390, width: 50, height: 20, color: '#FF8800' },
            { x: 460, y: 350, width: 50, height: 20, color: '#FF8800' },
            { x: 540, y: 310, width: 50, height: 20, color: '#FF8800' },
            { x: 620, y: 270, width: 50, height: 20, color: '#FF8800' },
            { x: 700, y: 230, width: 50, height: 20, color: '#FF8800' }
        ],
        flag: { x: 710, y: 0, width: 30, height: 50 }
    }
    ,
    6: {
        platforms: [
            // Zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            // Başlangıç platformu
            { x: 40, y: 500, width: 120, height: 20, color: '#FF8800' },
            // Orta bölüm: geniş ve dar karışık
            { x: 200, y: 470, width: 90, height: 18, color: '#FF8800' },
            { x: 330, y: 420, width: 60, height: 18, color: '#FF8800' },
            { x: 420, y: 370, width: 120, height: 18, color: '#FF8800' },
            { x: 580, y: 330, width: 60, height: 18, color: '#FF8800' },
            { x: 680, y: 300, width: 90, height: 18, color: '#FF8800' }
        ],
        flag: { x: 700, y: 0, width: 30, height: 50 }
    }
    ,
    7: {
        platforms: [
            // Zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            // Başlangıç platformu
            { x: 20, y: 520, width: 100, height: 18, color: '#FF8800' },
            // Alt-üst zikzak
            { x: 160, y: 480, width: 60, height: 18, color: '#FF8800' },
            { x: 240, y: 430, width: 60, height: 18, color: '#FF8800' },
            { x: 320, y: 380, width: 60, height: 18, color: '#FF8800' },
            { x: 400, y: 330, width: 60, height: 18, color: '#FF8800' },
            { x: 480, y: 280, width: 60, height: 18, color: '#FF8800' },
            { x: 560, y: 240, width: 60, height: 18, color: '#FF8800' },
            { x: 640, y: 210, width: 80, height: 18, color: '#FF8800' },
            { x: 720, y: 190, width: 60, height: 18, color: '#FF8800' }
        ],
        flag: { x: 730, y: 0, width: 30, height: 50 }
    }
    ,
    8: {
        platforms: [
            // Zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            // Başlangıç platformu
            { x: 30, y: 520, width: 110, height: 18, color: '#FF8800' },
            // Uzak atlamalar
            { x: 230, y: 500, width: 50, height: 18, color: '#FF8800' },
            { x: 360, y: 470, width: 50, height: 18, color: '#FF8800' },
            { x: 500, y: 430, width: 50, height: 18, color: '#FF8800' },
            { x: 640, y: 380, width: 70, height: 18, color: '#FF8800' }
        ],
        flag: { x: 665, y: 0, width: 30, height: 50 }
    }
    ,
    9: {
        platforms: [
            // Zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            // Başlangıç platformu
            { x: 20, y: 500, width: 120, height: 18, color: '#FF8800' },
            // Orta yol iki geniş platform ve küçük boşluklar
            { x: 220, y: 480, width: 140, height: 18, color: '#FF8800' },
            { x: 420, y: 450, width: 140, height: 18, color: '#FF8800' },
            { x: 620, y: 420, width: 120, height: 18, color: '#FF8800' },
            // Üst kısımda son platform
            { x: 700, y: 320, width: 80, height: 18, color: '#FF8800' }
        ],
        flag: { x: 720, y: 0, width: 30, height: 50 }
    }
    ,
    10: {
        platforms: [
            // Zemin (tehlikeli)
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            // Başlangıç platformu
            { x: 30, y: 520, width: 120, height: 18, color: '#FF8800' },
            // Zorlu küçük platform serisi
            { x: 200, y: 500, width: 45, height: 16, color: '#FF8800' },
            { x: 280, y: 470, width: 45, height: 16, color: '#FF8800' },
            { x: 360, y: 440, width: 45, height: 16, color: '#FF8800' },
            { x: 440, y: 410, width: 45, height: 16, color: '#FF8800' },
            { x: 520, y: 380, width: 45, height: 16, color: '#FF8800' },
            { x: 600, y: 350, width: 45, height: 16, color: '#FF8800' },
            { x: 680, y: 320, width: 60, height: 16, color: '#FF8800' },
            { x: 740, y: 300, width: 40, height: 16, color: '#FF8800' }
        ],
        flag: { x: 745, y: 0, width: 30, height: 50 }
    }
    ,
    11: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            { x: 25, y: 510, width: 130, height: 20, color: '#FF8800' },
            { x: 220, y: 480, width: 80, height: 18, color: '#FF8800' },
            { x: 340, y: 440, width: 80, height: 18, color: '#FF8800' },
            { x: 460, y: 400, width: 80, height: 18, color: '#FF8800' },
            { x: 580, y: 360, width: 80, height: 18, color: '#FF8800' },
            { x: 700, y: 320, width: 80, height: 18, color: '#FF8800' }
        ],
        flag: { x: 720, y: 0, width: 30, height: 50 }
    }
    ,
    12: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            { x: 35, y: 520, width: 120, height: 20, color: '#FF8800' },
            { x: 210, y: 500, width: 50, height: 18, color: '#FF8800' },
            { x: 310, y: 470, width: 50, height: 18, color: '#FF8800' },
            { x: 410, y: 440, width: 60, height: 18, color: '#FF8800' },
            { x: 520, y: 410, width: 60, height: 18, color: '#FF8800' },
            { x: 630, y: 370, width: 60, height: 18, color: '#FF8800' },
            { x: 720, y: 330, width: 60, height: 18, color: '#FF8800' }
        ],
        flag: { x: 735, y: 0, width: 30, height: 50 }
    }
    ,
    13: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            { x: 30, y: 515, width: 110, height: 18, color: '#FF8800' },
            { x: 200, y: 500, width: 90, height: 18, color: '#FF8800' },
            { x: 350, y: 470, width: 70, height: 18, color: '#FF8800' },
            { x: 480, y: 430, width: 70, height: 18, color: '#FF8800' },
            { x: 600, y: 380, width: 90, height: 18, color: '#FF8800' },
            { x: 710, y: 330, width: 70, height: 18, color: '#FF8800' }
        ],
        flag: { x: 725, y: 0, width: 30, height: 50 }
    }
    ,
    14: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            { x: 20, y: 520, width: 140, height: 20, color: '#FF8800' },
            { x: 220, y: 500, width: 50, height: 18, color: '#FF8800' },
            { x: 280, y: 460, width: 50, height: 18, color: '#FF8800' },
            { x: 360, y: 420, width: 50, height: 18, color: '#FF8800' },
            { x: 440, y: 380, width: 50, height: 18, color: '#FF8800' },
            { x: 520, y: 340, width: 50, height: 18, color: '#FF8800' },
            { x: 600, y: 300, width: 50, height: 18, color: '#FF8800' },
            { x: 700, y: 260, width: 80, height: 18, color: '#FF8800' }
        ],
        flag: { x: 720, y: 0, width: 30, height: 50 }
    }
    ,
    15: {
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#FF4444', isDangerous: true },
            { x: 25, y: 520, width: 120, height: 20, color: '#FF8800' },
            { x: 220, y: 500, width: 45, height: 16, color: '#FF8800' },
            { x: 300, y: 470, width: 45, height: 16, color: '#FF8800' },
            { x: 380, y: 440, width: 45, height: 16, color: '#FF8800' },
            { x: 460, y: 410, width: 45, height: 16, color: '#FF8800' },
            { x: 540, y: 380, width: 45, height: 16, color: '#FF8800' },
            { x: 620, y: 350, width: 45, height: 16, color: '#FF8800' },
            { x: 700, y: 320, width: 70, height: 16, color: '#FF8800' }
        ],
        flag: { x: 715, y: 0, width: 30, height: 50 }
    }
};

// Mevcut bölümün platformları
let platforms = levels[currentLevel].platforms;

// Karakter 1 (Mavi) - düşük yükseklik
const character1 = {
    x: 50,
    y: 350,
    width: 35,
    height: 25,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    color: '#3498db',
    name: 'Abdulrezzak',
    animationFrame: 0,
    isMoving: false,
    stunnedUntil: 0
    ,
    facing: 1
};

// Karakter 2 (Kırmızı) - çok uzun
const character2 = {
    x: 100,
    y: 350,
    width: 40,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    color: '#e74c3c',
    name: 'Mahmut Abi',
    animationFrame: 0,
    isMoving: false,
    stunnedUntil: 0
    ,
    facing: 1
};

// Ek çubuk adamlar (3-6) - basit bot AI ile
const extraCharacters = [
    {
        x: 140, y: 350, width: 36, height: 36,
        velocityX: 0, velocityY: 0, onGround: false,
        color: '#2ecc71', name: 'Karakter 3', animationFrame: 0, isMoving: false, stunnedUntil: 0, facing: 1,
        ai: { left: 'j', right: 'l', jump: 'i', phaseOffset: 0 }
    },
    {
        x: 180, y: 350, width: 36, height: 36,
        velocityX: 0, velocityY: 0, onGround: false,
        color: '#9b59b6', name: 'Karakter 4', animationFrame: 0, isMoving: false, stunnedUntil: 0, facing: 1,
        ai: { left: 'f', right: 'h', jump: 't', phaseOffset: 250 }
    },
    {
        x: 220, y: 350, width: 36, height: 36,
        velocityX: 0, velocityY: 0, onGround: false,
        color: '#f39c12', name: 'Karakter 5', animationFrame: 0, isMoving: false, stunnedUntil: 0, facing: 1,
        ai: { left: 'v', right: 'n', jump: 'g', phaseOffset: 500 }
    },
    {
        x: 260, y: 350, width: 36, height: 36,
        velocityX: 0, velocityY: 0, onGround: false,
        color: '#1abc9c', name: 'Karakter 6', animationFrame: 0, isMoving: false, stunnedUntil: 0, facing: 1,
        ai: { left: 'u', right: 'o', jump: 'y', phaseOffset: 750 }
    }
];

// Güvenli doğuş: Tehlikeli olmayan ilk platformun üstüne yerleştir
function respawnCharactersOnSafePlatform() {
	const safePlatform = platforms.find(p => !p.isDangerous) || platforms[0];
	if (!safePlatform) return;

    // Tüm karakterleri platform boyunca eşit aralıklarla diz
    const list = getRoster();
	const step = safePlatform.width / (list.length + 1);
	for (let i = 0; i < list.length; i++) {
		const c = list[i];
		const centerX = safePlatform.x + step * (i + 1);
		c.x = Math.max(safePlatform.x + 2, Math.min(centerX - c.width / 2, safePlatform.x + safePlatform.width - c.width - 2));
		c.y = safePlatform.y - c.height;
		c.velocityX = 0;
		c.velocityY = 0;
		c.onGround = true;
	}
}

// Tek karakteri güvenli bir platformun üstüne yerleştir
function respawnCharacterOnSafePlatform(character) {
	const safePlatform = platforms.find(p => !p.isDangerous) || platforms[0];
	if (!safePlatform) return;
	// Yakın boş bir konum bul (merkeze yakın)
	const candidates = [];
    const total = Math.max(3, getRoster().length + 2);
	for (let i = 1; i <= total; i++) {
		const centerX = safePlatform.x + (safePlatform.width / (total + 1)) * i;
		candidates.push(centerX);
	}
	let bestX = candidates[0] - character.width / 2;
	let bestDist = Infinity;
	for (const cx of candidates) {
		const x = Math.max(safePlatform.x + 2, Math.min(cx - character.width / 2, safePlatform.x + safePlatform.width - character.width - 2));
		let minOverlap = 99999;
        for (const other of getRoster()) {
			if (other === character) continue;
			const overlap = Math.max(0, Math.min(x + character.width, other.x + other.width) - Math.max(x, other.x));
			minOverlap = Math.min(minOverlap, overlap);
		}
		const dist = Math.abs(cx - (character.x + character.width / 2)) + (minOverlap > 0 ? 1000 : 0);
		if (dist < bestDist) { bestDist = dist; bestX = x; }
	}
	character.x = bestX;
	character.y = safePlatform.y - character.height;
	character.velocityX = 0;
	character.velocityY = 0;
	character.onGround = true;
}

// Tuş kontrolleri
const keys = {};
// Tüm karakter listesi (insan + botlar)
const allCharacters = [character1, character2, ...extraCharacters];
function getRoster() {
    return [character1, character2];
}

// Tuş dinleyicileri
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    // L tuşu ile güçlü tekme
    if (e.key.toLowerCase() === 'l') {
        triggerMahmutKick();
    }
    // E tuşu ile kol uzatma
    if (e.key.toLowerCase() === 'e') {
        triggerAbdulPull();
    }

    // Cheat buffer: yazılan harf, rakam ve boşlukları dinle (küçük harfe çevir)
    if (typeof e.key === 'string' && e.key.length === 1) {
        const ch = e.key.toLowerCase();
        cheatInputBuffer = (cheatInputBuffer + ch).slice(-40);
        if (cheatInputBuffer.includes('ubdulrezzak 2014')) {
            abdulCheatMode = true;
        }
        if (cheatInputBuffer.includes('mahmut abi 2017')) {
            mahmutCheatMode = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Tekme tetikleyici
function triggerMahmutKick() {
    if (gameOver) return;
    const now = performance.now();
    if (!mahmutCheatMode && now < mahmutKickCooldownUntil) return; // cooldown (cheat modda yok)
    if (mahmutKickActive && now < mahmutKickEndTime) return; // devam eden tekme
    mahmutKickActive = true;
    mahmutKickHasHit = false;
    mahmutKickEndTime = now + (mahmutCheatMode ? 500 : 400); // animasyon süresi
    // Yön: son hareket veya yüzü çevrili yön
    if (Math.abs(character2.velocityX) > 0.1) {
        mahmutKickDirection = character2.velocityX > 0 ? 1 : -1;
    } else {
        mahmutKickDirection = character2.facing;
    }
    if (!mahmutCheatMode) {
        mahmutKickCooldownUntil = now + MAHMUT_KICK_COOLDOWN_MS;
    }
}

// Kol uzatma tetikleyici (Abdulrezzak -> Mahmut Abi'yi hafifçe geri çeker)
function triggerAbdulPull() {
    if (gameOver) return;
    const now = performance.now();
    if (!abdulCheatMode && now < abdulPullCooldownUntil) return; // cooldown (cheat modda yok)
    if (abdulPullActive && now < abdulPullEndTime) return; // devam eden aksiyon
    abdulPullActive = true;
    abdulPullHasHit = false;
    abdulPullStartTime = now;
    abdulPullEndTime = now + 350; // 0.35s animasyon (ileri+geri)
    // Yön: son hareket veya yüzü çevrili yön
    // Yönü, Mahmut Abi'nin konumuna göre belirle (ona doğru uzasın)
    const abdCenter = character1.x + character1.width / 2;
    const mahCenter = character2.x + character2.width / 2;
    abdulPullDirection = mahCenter >= abdCenter ? 1 : -1;
    if (!abdulCheatMode) {
        abdulPullCooldownUntil = now + ABDUL_PULL_COOLDOWN_MS;
    }
}

// Canvas tıklama ile oyun sonu butonuna basma
canvas.addEventListener('click', (e) => {
    if (!gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);
    const btn = getRestartButtonRect();
    if (clickX >= btn.x && clickX <= btn.x + btn.w && clickY >= btn.y && clickY <= btn.y + btn.h) {
        restartGame();
    }
});

// Çarpışma kontrolü
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Platform çarpışma kontrolü
function checkPlatformCollision(character, platform) {
    if (checkCollision(character, platform)) {
        // Karakter platformun üstünde mi?
        if (character.velocityY > 0 && character.y < platform.y) {
            character.y = platform.y - character.height;
            character.velocityY = 0;
            character.onGround = true;
            return true;
        }
        // Karakter platformun altında mı?
        else if (character.velocityY < 0 && character.y + character.height > platform.y + platform.height) {
            character.y = platform.y + platform.height;
            character.velocityY = 0;
        }
        // Karakter platformun solunda mı?
        else if (character.velocityX > 0 && character.x < platform.x) {
            character.x = platform.x - character.width;
            character.velocityX = 0;
        }
        // Karakter platformun sağında mı?
        else if (character.velocityX < 0 && character.x + character.width > platform.x + platform.width) {
            character.x = platform.x + platform.width;
            character.velocityX = 0;
        }
    }
    return false;
}

// Karakter güncelleme
function updateCharacter(character, leftKey, rightKey, jumpKey) {
    // Stun kontrolü: hareket edemesin
    const now = performance.now();
    if (character.stunnedUntil && now < character.stunnedUntil) {
        character.velocityX *= friction;
        character.velocityY += gravity;
        character.x += character.velocityX;
        character.y += character.velocityY;
        
        // Platform çarpışmaları (yine de yerle temas etsin)
        character.onGround = false;
        for (let platform of platforms) {
            if (platform.isDangerous && checkCollision(character, platform)) {
                respawnCharacterOnSafePlatform(character);
                return;
            }
            checkPlatformCollision(character, platform);
        }
        return;
    }
    // Hareket durumunu kontrol et
    character.isMoving = keys[leftKey] || keys[rightKey];
    
    // Yatay hareket
    // Abdulrezzak hızlı, Mahmut Abi orta hız
    let horizontalAccel = character.name === 'Abdulrezzak' ? 0.85 : 0.50;
    if (character.name === 'Abdulrezzak' && abdulCheatMode) {
        horizontalAccel = 1.15;
    } else if (character.name === 'Mahmut Abi' && mahmutCheatMode) {
        horizontalAccel = 0.80;
    }
    if (keys[leftKey]) {
        character.velocityX -= horizontalAccel;
        character.facing = -1;
    }
    if (keys[rightKey]) {
        character.velocityX += horizontalAccel;
        character.facing = 1;
    }
    
    // Sürtünme
    character.velocityX *= friction;
    
    // Animasyon frame'ini güncelle
    if (character.isMoving && character.onGround) {
        character.animationFrame += 0.2;
        if (character.animationFrame >= 4) {
            character.animationFrame = 0;
        }
    } else {
        character.animationFrame = 0;
    }
    
    // Zıplama
    if (keys[jumpKey] && character.onGround) {
        let effectiveJump;
        if (character.name === 'Abdulrezzak') {
            effectiveJump = abdulCheatMode ? jumpPower * 2.0 : jumpPower * 0.75; // daha az zıplama
        } else {
            effectiveJump = mahmutCheatMode ? jumpPower * 1.6 : jumpPower; // Mahmut cheat modda daha yükseğe
        }
        character.velocityY = effectiveJump;
        character.onGround = false;
    }
    
    // Yerçekimi
    character.velocityY += gravity;
    
    // Pozisyon güncelleme
    character.x += character.velocityX;
    character.y += character.velocityY;
    
    // Platform çarpışmaları
    character.onGround = false;
    for (let platform of platforms) {
        // Kırmızı zemine değince en geriye ışınlan
        if (platform.isDangerous && checkCollision(character, platform)) {
            respawnCharacterOnSafePlatform(character);
            return; // Diğer platformları kontrol etme
        }
        
        checkPlatformCollision(character, platform);
    }
    
    // Bayrak çarpışma kontrolü
    const currentFlag = levels[currentLevel].flag;
    if (checkCollision(character, currentFlag)) {
        // Demo modunda 3. bölümü tekrar döngüye al
        if (demoMode) {
            currentLevel = 3;
            platforms = levels[currentLevel].platforms;
            respawnCharactersOnSafePlatform();
        } else {
            // Puanlama: bayrağa dokunan karakter 1 puan alır
            scores[character.name] = (scores[character.name] || 0) + 1;
            // Sonraki bölüme geç
            if (currentLevel < Object.keys(levels).length) {
                currentLevel++;
                platforms = levels[currentLevel].platforms;
                // Karakterleri güvenli bir platformun üstüne doğur
                respawnCharactersOnSafePlatform();
            } else {
                // Son bölüm sonrası oyun biter ve kazanan belirlenir
                gameOver = true;
                const entries = Object.entries(scores);
                let best = entries[0];
                let tie = false;
                for (let i = 1; i < entries.length; i++) {
                    const cur = entries[i];
                    if (cur[1] > best[1]) { best = cur; tie = false; }
                    else if (cur[1] === best[1]) { tie = true; }
                }
                if (tie) {
                    winnerText = 'Berabere';
                } else {
                    // best is [name, score]
                    winnerText = `Kazanan: ${best[0]} (${best[1]} puan)`;
                }
                // Ekonomi: kazanana coin
                if (!tie) {
                    const winnerName = best[0];
                    // İnsan oyuncuların seçili karakterleri kazandıysa ödül ver
                    if (storeState.p1Selected === winnerName) { storeState.p1Coins = (storeState.p1Coins || 0) + COIN_REWARD_PER_WIN; }
                    if (storeState.p2Selected === winnerName) { storeState.p2Coins = (storeState.p2Coins || 0) + COIN_REWARD_PER_WIN; }
                    saveStore();
                    updateCharactersUI();
                }
            }
        }
    }
    
    // Ekran sınırları
    if (character.x < 0) character.x = 0;
    if (character.x + character.width > baseWidth) character.x = baseWidth - character.width;
    
    // Yere düşünce en başa ışınlanma
    if (character.y + character.height > baseHeight) {
        // Güvenli platformun üstüne ışınla (yalnızca düşen karakter)
        respawnCharacterOnSafePlatform(character);
    }
}

// Çizim fonksiyonları
function drawPlatform(platform) {
    // Platform rengi (varsayılan kahverengi, özel renk varsa onu kullan)
    const platformColor = platform.color || '#8B4513';
    const borderColor = platform.color ? platform.color : '#654321';
    
    // Platform gölgesi
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(platform.x + 2, platform.y + 2, platform.width, platform.height);
    
    // Ana platform rengi
    ctx.fillStyle = platformColor;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Platform kenarlığı
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    
    // Platform dokusu (sadece kahverengi platformlar için)
    if (!platform.color) {
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 1;
        for (let i = 0; i < platform.width; i += 15) {
            ctx.beginPath();
            ctx.moveTo(platform.x + i, platform.y);
            ctx.lineTo(platform.x + i, platform.y + platform.height);
            ctx.stroke();
        }
    }
}

function drawFlag(flag) {
    // Bayrak direği
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(flag.x + flag.width/2, flag.y + flag.height);
    ctx.lineTo(flag.x + flag.width/2, flag.y);
    ctx.stroke();
    
    // Yeşil bayrak
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(flag.x + flag.width/2, flag.y, flag.width/2, flag.height/2);
    
    // Bayrak kenarlığı
    ctx.strokeStyle = '#008000';
    ctx.lineWidth = 1;
    ctx.strokeRect(flag.x + flag.width/2, flag.y, flag.width/2, flag.height/2);
    
    // Bayrak dalgalanma efekti
    ctx.strokeStyle = '#00CC00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(flag.x + flag.width/2, flag.y + 5);
    ctx.lineTo(flag.x + flag.width, flag.y + 5);
    ctx.moveTo(flag.x + flag.width/2, flag.y + 15);
    ctx.lineTo(flag.x + flag.width, flag.y + 15);
    ctx.stroke();
}

// Bayrağı (varsa) tehlikeli olmayan ve altına denk gelen bir platformun üstüne sabitle
function anchorFlagToNearestPlatform() {
    const flag = levels[currentLevel].flag;
    if (!flag) return;
    const flagLeft = flag.x;
    const flagRight = flag.x + flag.width;
    // Yatay çakışma: [flagLeft, flagRight] ile [p.x, p.x+p.width] aralıklarının kesişmesi
    const candidates = platforms.filter(p => {
        if (p.isDangerous) return false;
        const platformLeft = p.x;
        const platformRight = p.x + p.width;
        return Math.max(flagLeft, platformLeft) <= Math.min(flagRight, platformRight);
    });
    if (candidates.length === 0) return;
    // En alttaki (y değeri en büyük) uygun platformu seç
    let support = candidates[0];
    for (const p of candidates) {
        if (p.y > support.y) support = p;
    }
    flag.y = support.y - flag.height;
}

// Oyun sonu: Tekrar Oyna butonunun dikdörtgeni
function getRestartButtonRect() {
    const w = 220;
    const h = 60;
    return {
        x: (canvas.width - w) / 2,
        y: (canvas.height) / 2 + 70,
        w,
        h
    };
}

// Oyunu baştan başlat
function restartGame() {
    const totalLevels = Object.keys(levels).length;
    const startLevelFromSettings = (window.gameSettings && Number(window.gameSettings.startLevel)) || 1;
    const clampedStartLevel = Math.max(1, Math.min(totalLevels, startLevelFromSettings));
    currentLevel = clampedStartLevel;
    platforms = levels[currentLevel].platforms;
    for (const k of Object.keys(scores)) scores[k] = 0;
    gameOver = false;
    winnerText = '';
    respawnCharactersOnSafePlatform();
}

function drawCharacter(character) {
    // Çubuk adam çizimi
    ctx.strokeStyle = character.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    const centerX = character.x + character.width / 2;
    
    // Animasyon değerleri
    const animFrame = Math.floor(character.animationFrame);
    const armSwing = Math.sin(character.animationFrame * Math.PI) * 3;
    const legSwing = Math.sin(character.animationFrame * Math.PI) * 4;
    
    // Mavi karakter için oval kafa ve bacaklar
    if (character.color === '#3498db') {
        const headY = character.y + 6;
        const legY = character.y + 22;
        
        // Yuvarlak kafa - küçültülmüş
        ctx.beginPath();
        ctx.arc(centerX, headY, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Bacaklar: E eyleminde sağ bacak sağa doğru yatay uzar, sol bacak normal
        const isPulling = (character.name === 'Abdulrezzak') && abdulPullActive && performance.now() < abdulPullEndTime;
        if (isPulling) {
            const now = performance.now();
            const t = Math.max(0, Math.min(1, (now - abdulPullStartTime) / (abdulPullEndTime - abdulPullStartTime)));
            const forward = t <= 0.5 ? (t / 0.5) : (1 - (t - 0.5) / 0.5);
            const maxExtend = abdulCheatMode ? 200 : 40;
            const dynamicExtend = maxExtend * forward;

            // Sol bacak: normal aşağı
            ctx.beginPath();
            ctx.moveTo(centerX, headY + 6);
            ctx.quadraticCurveTo(centerX - 2, headY + 4, centerX - 2.5, legY);
            ctx.stroke();

            // Sağ bacak: yukarı kaldırılmış ve Mahmut'a doğru yatay uzatılmış
            ctx.beginPath();
            const hipY = headY + 8;
            ctx.moveTo(centerX, hipY);
            const extendX = abdulPullDirection === 1 ? dynamicExtend : -dynamicExtend;
            ctx.lineTo(centerX + extendX, hipY);
            ctx.stroke();
        } else {
            // Normal bacak animasyonu
            if (character.isMoving && character.onGround) {
                ctx.beginPath();
                ctx.moveTo(centerX, headY + 6);
                ctx.quadraticCurveTo(centerX - 2 + legSwing * 0.15, headY + 4, centerX - 2.5 + legSwing * 0.15, legY);
                ctx.moveTo(centerX, headY + 6);
                ctx.quadraticCurveTo(centerX + 2 - legSwing * 0.15, headY + 4, centerX + 2.5 - legSwing * 0.15, legY);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(centerX, headY + 6);
                ctx.quadraticCurveTo(centerX - 2, headY + 4, centerX - 2.5, legY);
                ctx.moveTo(centerX, headY + 6);
                ctx.quadraticCurveTo(centerX + 2, headY + 4, centerX + 2.5, legY);
                ctx.stroke();
            }
        }
        
        // Kollar: Görsel karışıklığı önlemek için mavi karakterde çizme

        // İki nokta (gözler) - mavi renkte
        ctx.fillStyle = character.color;
        ctx.beginPath();
        ctx.arc(centerX - 4, headY - 3, 2, 0, Math.PI * 2);
        ctx.arc(centerX + 4, headY - 3, 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Kırmızı karakter için yuvarlak kafa ve gövde
        const headY = character.y + 5;
        const bodyY = character.y + 20;
        const legY = character.y + 38;
        
        // Yuvarlak kafa - küçültülmüş
        ctx.beginPath();
        ctx.arc(centerX, headY, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Gövde (dikey çizgi)
        ctx.beginPath();
        ctx.moveTo(centerX, headY + 10);
        ctx.lineTo(centerX, bodyY);
        ctx.stroke();
        
        // Bacaklar (kavisli) - küçültülmüş
        const isKicking = (character.name === 'Mahmut Abi') && mahmutKickActive && performance.now() < mahmutKickEndTime;
        if (isKicking) {
            // Tekme pozisyonu: bir bacak ileri, diğeri dengede
            ctx.beginPath();
            ctx.moveTo(centerX, bodyY);
            // tekme bacağı ileri
            const kickOffset = 10 * mahmutKickDirection;
            ctx.quadraticCurveTo(centerX + 6 * mahmutKickDirection, bodyY + 0, centerX + kickOffset, legY - 6);
            // diğer bacak sabitçe geride
            ctx.moveTo(centerX, bodyY);
            ctx.quadraticCurveTo(centerX - 2.5, bodyY + 3, centerX - 3, legY);
            ctx.stroke();
        } else if (character.isMoving && character.onGround) {
            // Hareket ederken bacaklar sallanır
            ctx.beginPath();
            ctx.moveTo(centerX, bodyY);
            ctx.quadraticCurveTo(centerX - 2.5 + legSwing * 0.25, bodyY + 3, centerX - 3 + legSwing * 0.25, legY);
            ctx.moveTo(centerX, bodyY);
            ctx.quadraticCurveTo(centerX + 2.5 - legSwing * 0.25, bodyY + 3, centerX + 3 - legSwing * 0.25, legY);
            ctx.stroke();
        } else {
            // Dururken normal bacaklar
            ctx.beginPath();
            ctx.moveTo(centerX, bodyY);
            ctx.quadraticCurveTo(centerX - 2.5, bodyY + 3, centerX - 3, legY);
            ctx.moveTo(centerX, bodyY);
            ctx.quadraticCurveTo(centerX + 2.5, bodyY + 3, centerX + 3, legY);
            ctx.stroke();
        }
        
        // İki nokta (gözler) - kırmızı renkte
        ctx.fillStyle = character.color;
        ctx.beginPath();
        ctx.arc(centerX - 4, headY - 3, 2, 0, Math.PI * 2);
        ctx.arc(centerX + 4, headY - 3, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Karakter mağazası UI güncelle
function updateCharactersUI() {
    try {
        const p1CoinsEl = document.getElementById('p1Coins');
        const p2CoinsEl = document.getElementById('p2Coins');
        const p1SelEl = document.getElementById('p1Selection');
        const p2SelEl = document.getElementById('p2Selection');
        if (p1CoinsEl) p1CoinsEl.textContent = String(storeState.p1Coins || 0);
        if (p2CoinsEl) p2CoinsEl.textContent = String(storeState.p2Coins || 0);
        if (p1SelEl) p1SelEl.textContent = String(storeState.p1Selected || 'Abdulrezzak');
        if (p2SelEl) p2SelEl.textContent = String(storeState.p2Selected || 'Mahmut Abi');
            // Ayrıca ana menüdeki özet para alanlarını güncelle
            try {
                const menuP1 = document.getElementById('menuP1Coins');
                const menuP2 = document.getElementById('menuP2Coins');
                if (menuP1) menuP1.textContent = String(storeState.p1Coins || 0);
                if (menuP2) menuP2.textContent = String(storeState.p2Coins || 0);
            } catch(e) {}

        const listEl = document.getElementById('charactersList');
        if (!listEl) return;
        const names = ['Abdulrezzak','Mahmut Abi','Karakter 3','Karakter 4','Karakter 5','Karakter 6'];
        listEl.innerHTML = '';
        for (const name of names) {
            const price = DEFAULT_CHARACTER_PRICES[name] || 0;
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'space-between';
            row.style.gap = '10px';
            row.style.padding = '8px 10px';
            row.style.background = 'rgba(0,0,0,0.25)';
            row.style.borderRadius = '10px';
            row.style.marginBottom = '8px';

            const left = document.createElement('div');
            const spec = getCharacterByName(name);
            const sw = document.createElement('span');
            sw.style.display = 'inline-block';
            sw.style.width = '16px';
            sw.style.height = '16px';
            sw.style.borderRadius = '50%';
            sw.style.verticalAlign = 'middle';
            sw.style.marginRight = '8px';
            sw.style.background = spec ? spec.color : '#fff';
            const txt = document.createElement('span');
            txt.textContent = `${name} — Fiyat: ${price}`;
            left.appendChild(sw);
            left.appendChild(txt);
            const right = document.createElement('div');
            right.style.display = 'flex';
            right.style.gap = '8px';

            // Oyuncu 1 için buton
            const btn1 = document.createElement('button');
            btn1.className = 'menu-btn';
            btn1.style.padding = '10px 14px';
            btn1.textContent = storeState.p1Owned[name] ? (storeState.p1Selected === name ? 'P1 Seçili' : 'P1 Seç') : `P1 Satın Al (${price})`;
            btn1.disabled = !storeState.p1Owned[name] && (storeState.p1Coins || 0) < price;
            btn1.onclick = function(e) {
                if (e && e.stopPropagation) e.stopPropagation();
                if (!storeState.p1Owned[name]) {
                    if ((storeState.p1Coins || 0) >= price) {
                        storeState.p1Coins -= price;
                        storeState.p1Owned[name] = true;
                    } else return;
                }
                storeState.p1Selected = name;
                saveStore();
                updateCharactersUI();
            };

            // Oyuncu 2 için buton
            const btn2 = document.createElement('button');
            btn2.className = 'menu-btn';
            btn2.style.padding = '10px 14px';
            btn2.textContent = storeState.p2Owned[name] ? (storeState.p2Selected === name ? 'P2 Seçili' : 'P2 Seç') : `P2 Satın Al (${price})`;
            btn2.disabled = !storeState.p2Owned[name] && (storeState.p2Coins || 0) < price;
            btn2.onclick = function(e) {
                if (e && e.stopPropagation) e.stopPropagation();
                if (!storeState.p2Owned[name]) {
                    if ((storeState.p2Coins || 0) >= price) {
                        storeState.p2Coins -= price;
                        storeState.p2Owned[name] = true;
                    } else return;
                }
                storeState.p2Selected = name;
                saveStore();
                updateCharactersUI();
            };

            right.appendChild(btn1);
            right.appendChild(btn2);
            row.appendChild(left);
            row.appendChild(right);
            listEl.appendChild(row);

            // Satır tıklaması detay panelini günceller
            row.style.cursor = 'pointer';
            row.onclick = function() { setDetail(name); };
        }

        // Varsayılan detay: P1 seçimi
        setDetail(storeState.p1Selected || 'Abdulrezzak');

        function setDetail(name) {
            const price = DEFAULT_CHARACTER_PRICES[name] || 0;
            const spec = getCharacterByName(name);
            const nameEl = document.getElementById('charName');
            const colorEl = document.getElementById('charColor');
            const priceEl = document.getElementById('charPrice');
            const btnP1 = document.getElementById('btnP1Action');
            const btnP2 = document.getElementById('btnP2Action');
            if (nameEl) nameEl.textContent = name;
            if (colorEl) colorEl.style.background = spec ? spec.color : '#fff';
            if (priceEl) priceEl.textContent = 'Fiyat: ' + price;

            if (btnP1) {
                btnP1.textContent = storeState.p1Owned[name] ? (storeState.p1Selected === name ? 'P1 Seçili' : 'P1 Seç') : `P1 Satın Al (${price})`;
                btnP1.disabled = !storeState.p1Owned[name] && (storeState.p1Coins || 0) < price;
                btnP1.onclick = function() {
                    if (!storeState.p1Owned[name]) {
                        if ((storeState.p1Coins || 0) >= price) {
                            storeState.p1Coins -= price;
                            storeState.p1Owned[name] = true;
                        } else return;
                    }
                    storeState.p1Selected = name;
                    saveStore();
                    updateCharactersUI();
                    setDetail(name);
                };
            }
            if (btnP2) {
                btnP2.textContent = storeState.p2Owned[name] ? (storeState.p2Selected === name ? 'P2 Seçili' : 'P2 Seç') : `P2 Satın Al (${price})`;
                btnP2.disabled = !storeState.p2Owned[name] && (storeState.p2Coins || 0) < price;
                btnP2.onclick = function() {
                    if (!storeState.p2Owned[name]) {
                        if ((storeState.p2Coins || 0) >= price) {
                            storeState.p2Coins -= price;
                            storeState.p2Owned[name] = true;
                        } else return;
                    }
                    storeState.p2Selected = name;
                    saveStore();
                    updateCharactersUI();
                    setDetail(name);
                };
            }
        }
    } catch(e) {}
}

// Ana oyun döngüsü
function gameLoop() {
    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Oyun bitti ise sonuç ekranını çiz ve döngüyü sürdür (animasyonlu arkaplan devam edebilir)
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Oyun Bitti', canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = 'bold 28px Arial';
        ctx.fillText(winnerText, canvas.width / 2, canvas.height / 2);

        ctx.font = '20px Arial';
        try {
            if (winnerText === 'Berabere') {
                const abd = scores['Abdulrezzak'] || 0;
                const mah = scores['Mahmut Abi'] || 0;
                ctx.fillText(`Abdulrezzak: ${abd}  |  Mahmut Abi: ${mah}`, canvas.width / 2, canvas.height / 2 + 40);
            } else {
                // show only the final winner and their score
                const entries = Object.entries(scores);
                let best = entries[0];
                for (let i = 1; i < entries.length; i++) {
                    if (entries[i][1] > best[1]) best = entries[i];
                }
                ctx.fillText(`${best[0]}: ${best[1]} puan`, canvas.width / 2, canvas.height / 2 + 40);
            }
        } catch (e) { }

        // Tekrar Oyna butonu
        const btn = getRestartButtonRect();
        ctx.fillStyle = '#4ECDC4';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
        ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Tekrar Oyna', btn.x + btn.w / 2, btn.y + btn.h / 2 + 8);

        ctx.textAlign = 'left';
        requestAnimationFrame(gameLoop);
        return;
    }

    // Fullscreen'de genişliğe sığdır (yanlara değsin), dikeyde gerekirse taşır.
    // Normal modda oranı koruyarak sığdır.
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
    let scale;
    let offsetX;
    let offsetY;
    if (isFullscreen) {
        scale = canvas.width / baseWidth; // genişliğe tam sığdır
        offsetX = 0;
        offsetY = (canvas.height - baseHeight * scale) / 2; // dikey merkezle (gerekirse kırpılır)
    } else {
        scale = Math.min(canvas.width / baseWidth, canvas.height / baseHeight);
        offsetX = (canvas.width - baseWidth * scale) / 2;
        offsetY = (canvas.height - baseHeight * scale) / 2;
    }
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // Demo modu girişlerini uygula
    if (demoMode) {
        applyDemoInputs();
    }

    // Platformları çiz
    for (let platform of platforms) {
        drawPlatform(platform);
    }
    
    // Bayrağı uygun platformun üstüne sabitle
    anchorFlagToNearestPlatform();

    // Bayrağı çiz
    drawFlag(levels[currentLevel].flag);
    
    // Karakterleri güncelle
    updateCharacter(character1, 'a', 'd', 'w');
    updateCharacter(character2, 'arrowleft', 'arrowright', 'arrowup');
    // Bot karakterler için basit AI girişleri ve güncelleme (demo modda botlar gizli)
    if (!demoMode) {
        applyBotsInputs();
        for (const bot of extraCharacters) {
            updateCharacter(bot, bot.ai.left, bot.ai.right, bot.ai.jump);
        }
    }

    // Tekme aktifken hitbox kontrolü (Mahmut Abi -> Abdulrezzak)
    if (mahmutKickActive) {
        const now = performance.now();
        if (now >= mahmutKickEndTime) {
            mahmutKickActive = false;
        } else if (!mahmutKickHasHit) {
            // Basit bir tekme hitbox'ı: karakter2'nin vücudunun önünde küçük bir dikdörtgen
            const kickWidth = mahmutCheatMode ? 45 : 20;
            const kickHeight = mahmutCheatMode ? 28 : 20;
            const kickX = mahmutKickDirection === 1
                ? character2.x + character2.width
                : character2.x - kickWidth;
            const kickY = character2.y + character2.height - 24;
            const kickBox = { x: kickX, y: kickY, width: kickWidth, height: kickHeight };
            
            if (checkCollision(kickBox, character1)) {
                mahmutKickHasHit = true;
                // Abdulrezzak'ı ileri doğru ittir ve 3 saniye sersemlet
                const impulse = (mahmutCheatMode ? 30 : 12) * mahmutKickDirection;
                character1.velocityX = impulse;
                character1.velocityY = mahmutCheatMode ? -10 : -4; // daha çok havalandır
                character1.stunnedUntil = now + (mahmutCheatMode ? 7000 : 3000);
            }
        }
    }

    // Kol uzatma aktifken hitbox kontrolü (Abdulrezzak -> Mahmut Abi'yi hafif geri çek)
    if (abdulPullActive) {
        const now = performance.now();
        if (now >= abdulPullEndTime) {
            abdulPullActive = false;
        } else if (!abdulPullHasHit) {
            // Kol uzatma hitbox'ı: animasyondaki dinamik kol uzunluğu ile eşleştir
            const total = abdulPullEndTime - abdulPullStartTime;
            const t = Math.max(0, Math.min(1, (now - abdulPullStartTime) / total));
            const forward = t <= 0.5 ? (t / 0.5) : (1 - (t - 0.5) / 0.5);
            // Sağ bacak yatay uzaması ile hizalı hitbox (Mahmut'a doğru yönlü)
            const legBaseY = character1.y + 6 + 8; // headY + 8 ile uyumlu
            const armLength = (abdulCheatMode ? 200 : 40) * forward; // bacak uzaması
            const armHeight = 8;
            let armX = character1.x + character1.width / 2; // centerX
            const armY = legBaseY - 2;
            const width = armLength;
            if (abdulPullDirection === -1) {
                armX = armX - armLength; // sola uzuyorsa kutuyu sola kaydır
            }
            const armBox = { x: armX, y: armY, width, height: armHeight };

            if (checkCollision(armBox, character2)) {
                abdulPullHasHit = true;
                // Mahmut Abi'yi geri çok daha güçlü it (cheat modda daha da fazla) ve uzun sersemlet
                const baseImpulse = 12;
                const impulse = (abdulCheatMode ? baseImpulse * 3 : baseImpulse) * -abdulPullDirection;
                character2.velocityX = impulse;
                character2.velocityY = abdulCheatMode ? -6 : -3;
                character2.stunnedUntil = now + (abdulCheatMode ? 10000 : 1500);
            }
        }
    }
    
    // Karakterleri çiz
    for (const c of getRoster()) drawCharacter(c);
    
    // Ölçeği sıfırla, HUD'i ekran koordinatlarında çiz
    ctx.restore();
    
    // Bölüm bilgisini çiz
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Bölüm ${currentLevel}`, 20, 40);

    // Sağ üstte sadece seçili oyuncuların skorlarını göster
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px Arial';
    const selNames = [];
    try {
        // Oyuncuların seçtiği karakterler menüden alınır
        if (storeState && storeState.p1Selected) selNames.push(storeState.p1Selected);
        if (storeState && storeState.p2Selected && storeState.p2Selected !== storeState.p1Selected) selNames.push(storeState.p2Selected);
    } catch(e) {}
    let sy = 26;
    for (const name of selNames) {
        ctx.fillText(`${name}: ${scores[name] || 0}`, canvas.width - 20, sy);
        sy += 22;
    }
    ctx.textAlign = 'left';

    // Sağ altta Güçlü Tekme yuvarlak ikon (siyah-beyaz)
    const nowHud = performance.now();
    const cdLeft = Math.max(0, mahmutKickCooldownUntil - nowHud);
    drawKickCooldownIcon(cdLeft, MAHMUT_KICK_COOLDOWN_MS);

    // Sol altta Kol Uzatma ikonu (siyah-beyaz)
    const abdCdLeft = Math.max(0, abdulPullCooldownUntil - nowHud);
    drawPullCooldownIcon(abdCdLeft, ABDUL_PULL_COOLDOWN_MS);
    
    // Bir sonraki frame'i iste (tekil döngü)
    animationHandle = requestAnimationFrame(gameLoop);
}

// Oyunu başlat (menüden çağrılır)
function startGame() {
    // Demo modunu kapat
    demoMode = false;
    // Tüm tuşları bırak
    clearAllKeys();
    // Hileleri sıfırla (oyuncu isterse tekrar açar)
    abdulCheatMode = false;
    mahmutCheatMode = false;
    demoLastKickTime = 0;
    demoLastPullTime = 0;
    // Seçili karakterlere renk/isim uygula (P1, P2)
    try {
        if (storeState && storeState.p1Selected) {
            const map = getCharacterByName(storeState.p1Selected);
            if (map) {
                character1.name = map.name;
                character1.color = map.color;
            }
        }
        if (storeState && storeState.p2Selected) {
            const map2 = getCharacterByName(storeState.p2Selected);
            if (map2) {
                character2.name = map2.name;
                character2.color = map2.color;
            }
        }
    } catch(e) {}
    restartGame();
    ensureLoopRunning();
}

function clearAllKeys() {
    const names = ['a','d','w','arrowleft','arrowright','arrowup','j','l','i','f','h','t','v','n','g','u','o','y'];
    for (const n of names) keys[n] = false;
}

// Menüde arkaplan demosu: 3. bölüm + basit otomatik hareket
function startDemo() {
    demoMode = true;
    // Hile KAPALI: normal zıplama ve hız
    abdulCheatMode = false;
    mahmutCheatMode = false;
    currentLevel = 3;
    platforms = levels[currentLevel].platforms;
    gameOver = false;
    winnerText = '';
    respawnCharactersOnSafePlatform();
    demoLastKickTime = 0;
    demoLastPullTime = 0;
    ensureLoopRunning();
}

function applyDemoInputs() {
    // Sürekli sağa ilerle
    keys['d'] = true;
    keys['arrowright'] = true;
    keys['a'] = false;
    keys['arrowleft'] = false;
    // Periyodik zıpla
    const t = performance.now();
    const period = 900; // ms
    const phase = t % period;
    const jumping = phase < 140 || (phase > 420 && phase < 560);
    keys['w'] = jumping;
    keys['arrowup'] = jumping;

    // Özellikleri periyodik tetikle (cooldown'a uygun aralıklarla)
    if (t - demoLastKickTime > MAHMUT_KICK_COOLDOWN_MS + 200) {
        triggerMahmutKick();
        demoLastKickTime = t;
    }
    if (t - demoLastPullTime > ABDUL_PULL_COOLDOWN_MS + 200) {
        triggerAbdulPull();
        demoLastPullTime = t;
    }
    // Botlar için döngüsel girişler
    for (const bot of extraCharacters) {
        const phase = (t + (bot.ai.phaseOffset || 0)) % 1200;
        const moveRight = phase < 600;
        keys[bot.ai.left] = !moveRight;
        keys[bot.ai.right] = moveRight;
        keys[bot.ai.jump] = phase % 400 < 120; // aralıklı zıpla
    }
}

function ensureLoopRunning() {
    if (animationHandle == null) {
        animationHandle = requestAnimationFrame(gameLoop);
    }
}

// Bot AI girişleri: basit ileri-geri ve periyodik zıplama
function applyBotsInputs() {
	const t = performance.now();
	for (const bot of extraCharacters) {
		const period = 1400;
		const phase = (t + (bot.ai.phaseOffset || 0)) % period;
		const moveRight = phase < period / 2;
		keys[bot.ai.left] = !moveRight;
		keys[bot.ai.right] = moveRight;
		keys[bot.ai.jump] = (phase % 450) < 130 && bot.onGround;
	}
}

// Global erişim için
window.startGame = startGame;
window.startDemo = startDemo;
window.renderCharactersUI = updateCharactersUI;

// HUD: Güçlü tekme cooldown ikonu (sağ altta siyah-beyaz yuvarlak, üzerinde küçük 'L')
function drawKickCooldownIcon(cdLeft, cdTotal) {
    const radius = 24;
    const margin = 16;
    const cx = canvas.width - margin - radius;
    const cy = canvas.height - margin - radius;
    
    // Dış daire (siyah kenarlık)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#111';
    ctx.stroke();

    // Cooldown dolum (pizza dilimi) - siyah yarı saydam
    if (cdLeft > 0) {
        const frac = Math.max(0, Math.min(1, cdLeft / cdTotal));
        const startAngle = -Math.PI / 2; // üstten başla
        const endAngle = startAngle + Math.PI * 2 * frac;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fill();
    }

    // İkon içinde metin (iki satır): "Güçlü" / "Tekme"
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('Güçlü', cx, cy - 5);
    ctx.fillText('Tekme', cx, cy + 8);

    // Küçük 'L' harfi (dairenin hemen dışında, sağ-alt)
    ctx.font = 'bold 12px Arial';
    ctx.fillText('L', cx + radius + 4, cy + radius + 4);

    ctx.restore();
}

// HUD: Kol uzatma cooldown ikonu (sol altta, üzerinde küçük 'E')
function drawPullCooldownIcon(cdLeft, cdTotal) {
    const radius = 24;
    const margin = 16;
    const cx = margin + radius;
    const cy = canvas.height - margin - radius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#111';
    ctx.stroke();

    if (cdLeft > 0) {
        const frac = Math.max(0, Math.min(1, cdLeft / cdTotal));
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + Math.PI * 2 * frac;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fill();
    }

    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('Kol', cx, cy - 5);
    ctx.fillText('Uzat', cx, cy + 8);

    ctx.font = 'bold 12px Arial';
    ctx.fillText('E', cx - radius - 4, cy + radius + 4);

    ctx.restore();
}

// İsimden karakter renk ve varsayılan boyutları döndür (UI için)
function getCharacterByName(name) {
    const lookup = {
        'Abdulrezzak': { name: 'Abdulrezzak', color: '#3498db' },
        'Mahmut Abi': { name: 'Mahmut Abi', color: '#e74c3c' },
        'Karakter 3': { name: 'Karakter 3', color: '#2ecc71' },
        'Karakter 4': { name: 'Karakter 4', color: '#9b59b6' },
        'Karakter 5': { name: 'Karakter 5', color: '#f39c12' },
        'Karakter 6': { name: 'Karakter 6', color: '#1abc9c' }
    };
    return lookup[name] || null;
}