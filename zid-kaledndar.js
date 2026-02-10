const fs = require('fs');

/**
 * KONFIGURACE DAT PRO ROK 2026
 *
 */
const svatky = {
    "2.2.2026": "Tu Bi-švat (Svátek stromů) 🌳",
    "3.3.2026": "Půst Ester",
    "4.3.2026": "Purim 🎭",
    "1.4.2026": "Erev Pesach 🍷"
};

const parashot = {
    "7.2.2026": "Be-šalach (בְּשַׁלַּח)",
    "14.2.2026": "Jitro (יִתְרוֹ)",
    "21.2.2026": "Mišpatim (מִשְׁפָּטִים)",
    "28.2.2026": "Teruma (תְּרוּמָה)",
    "7.3.2026": "Teca-ve (תְּצַוֶּה)",
    "14.3.2026": "Ki tisa (כִּי תִשָּׂא)",
    "21.3.2026": "Vajakhel-Pekudej (וַיַּקְהֵל-פְקוּדֵי)",
    "28.3.2026": "Vajikra (וַיִּקְרָא)"
};

const dnyHeCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

/**
 * POMOCNÉ FUNKCE
 */

// Výpočet Tzeit HaKochavim (východ hvězd) pro Haifu
function getTzeitMinutes(date) {
    const lat = 32.79, dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const decl = 0.409 * Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);
    const sunsetH = 12 + (Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(decl)) * 180 / Math.PI) / 15
