// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export const formatResistance = (ohms) => {
    if (ohms === 0) return '0 Ω';
    if (ohms >= 1e9) return `${(ohms / 1e9).toFixed(ohms % 1e9 === 0 ? 0 : 2)} GΩ`;
    if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(ohms % 1e6 === 0 ? 0 : 2)} MΩ`;
    if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(ohms % 1e3 === 0 ? 0 : 2)} kΩ`;
    if (ohms < 1) return `${ohms.toFixed(2)} Ω`;
    return `${ohms.toFixed(ohms % 1 === 0 ? 0 : 2)} Ω`;
}

export const formatMultiplier = (m) => {
    if (m >= 1e9) return `10⁹`;
    if (m >= 1e8) return `10⁸`;
    if (m >= 1e7) return `10⁷`;
    if (m >= 1e6) return `10⁶`;
    if (m >= 1e5) return `10⁵`;
    if (m >= 1e4) return `10⁴`;
    if (m >= 1e3) return `10³`;
    if (m >= 100) return `10²`;
    if (m >= 10) return `10¹`;
    if (m === 1) return `10⁰`;
    if (m === 0.1) return `10⁻¹`;
    if (m === 0.01) return `10⁻²`;
    return `${m}`;
}
