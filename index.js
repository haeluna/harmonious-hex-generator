const cols = document.querySelectorAll('.color-box');
const generateBtn = document.getElementById('generate-btn');

document.addEventListener('keydown', (e) => {
    if (e.code.toLowerCase() === 'space') {
        e.preventDefault();
        setRandomColors();
    }
});

generateBtn.addEventListener('click', setRandomColors);

function setRandomColors() {
    // Randomize hue start
    const baseHue = Math.floor(Math.random() * 360);
    // Randomize saturation (keep it generally high for vibrancy)
    const baseSat = Math.floor(Math.random() * (100 - 50) + 50);
    // Randomize lightness (avoid too dark/light)
    const baseLig = Math.floor(Math.random() * (90 - 20) + 20);

    // Color Harmony Strategy: Analogous + Complementary mix
    // We'll generate 5 colors. 
    // Let's create an array of HSL values
    const colors = [];

    // Strategy: Uniform distribution of hues or monochromatic variables
    // Let's go with a pleasant step strategy
    const step = 30; // 30 degree shift for analogous

    for (let i = 0; i < 5; i++) {
        // Simple Analogous variation
        const h = (baseHue + (i * step)) % 360;
        const s = baseSat;
        // Vary lightness slightly to add depth if saturation is high, or keep constant
        const l = baseLig + (i % 2 === 0 ? 0 : 10);

        colors.push([h, s, Math.min(95, Math.max(10, l))]);
    }

    cols.forEach((col, index) => {
        const [h, s, l] = colors[index];
        const hex = hslToHex(h, s, l);
        const text = col.querySelector('.hex-code');
        const button = col.querySelector('.copy-btn');

        col.style.background = hex;
        text.textContent = hex;

        // WCAG Contrast Check
        const contrastColor = getContrastColor(hex);
        col.style.color = contrastColor;
        button.style.color = contrastColor;

        // Copy Event
        button.onclick = () => copyToClipboard(hex);
        text.onclick = () => copyToClipboard(hex);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied ' + text + ' to clipboard');
    });
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Utils
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Logic to determine black or white text based on background luminance
function getContrastColor(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1e1e1e' : '#ffffff';
}

// Initialize on load
setRandomColors();
