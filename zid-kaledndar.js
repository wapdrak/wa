/**
 * ŽIDOVSKÝ KALENDÁŘ - MULTI-CITY API (VĚČNÁ VERZE)
 * Tento skript generuje JSON se strukturou: {"Haifa": {...}, "Praha": {...}, ...}
 * [cite: 2025-09-15]
 */

const fs = require('fs');

// 1. DEFINICE LOKALIT [cite: 2026-01-13]
const LOKALITY = {
    "Haifa":      { lat: 32.79, lng: 34.99, tz: 120 },
    "Jeruzalem":  { lat: 31.76, lng: 35.21, tz: 120 },
    "Praha":      { lat: 50.07, lng: 14.43, tz: 60  },
    "Bratislava": { lat: 48.14, lng: 17.10, tz: 60  }
};

// 2. DATA (Parašot a překlady) [cite: 2025-09-14, 2026-01-13]
const vsechnyParashot = [
    "Berešit (בְּרֵאשִׁית)", "Noach (נֹחַ)", "Lech Lecha (לֶךְ-לְךָ)", "Vajera (וַיֵּרָא)", "Chajej Sára (חַיֵּי שָׂרָה)", "Toledot (תּוֹלְדֹת)", "Vajece (וַיֵּצֵא)", "Vajišlach (וַיִּשְׁלַח)", "Vaješev (וַיֵּשֶׁב)", "Mikec (מִקֵּץ)", "Vajigaš (וַיִּגַּשׁ)", "Vajechi (וַיְחִי)",
    "Šemot (שְׁמוֹת)", "Va'era (וָאֵרָא)", "Bo (בֹּא)", "Bešalach (בְּשַׁלַּח)", "Jitro (יִתְרוֹ)", "Mišpatim (מִשְׁפָּטִים)", "Teruma (תְּרוּמָה)", "Tecave (תְּצַוֶּה)", "Ki tisa (כִּi תִשָּׂא)", "Vajakhel (וַיַּקְהֵל)", "Pekudej (פְקוּדֵי)",
    "Vajikra (וַיִּקְרָא)", "Caw (צַו)", "Šmini (שְּׁמִינִי)", "Tazria (תַזְרִיעַ)", "Mecora (מְּצֹרָע)", "Acharej Mot (אַחֲרֵי מוֹת)", "Kedošim (קְדֹשִׁים)", "Emor (אֱמֹר)", "Behar (בְּהַר)", "Bechukotaj (בְּחֻקֹּתַי)",
    "Bemidbar (בְּמִדְבַּר)", "Naso (נָשֹׂא)", "Beha'alotecha (בְּהַעֲלֹתְךָ)", "Šlach Lecha (שְׁלַח-לְךָ)", "Korach (קֹרַח)", "Chukat (חֻקַּת)", "Balak (בָּלָק)", "Pinchas (פִּינְחָס)", "Matot (מַטּוֹת)", "Masej (מַסְעֵי)",
    "Devarim (דְּבָרִים)", "Va'etchanan (וָאֶתְחַנัּן)", "Ekev (עֵקֶב)", "Re'e (רְאֵה)", "Shoftim (שֹׁפְטִים)", "Ki tece (כִּi-תֵצֵא)", "Ki tavo (כִּi-תָבוֹא)", "Nicavim (נִצָּבִים)", "Vajelech (וַיֵּלֶךְ)", "Ha'azinu (הַאֲזִינוּ)", "Ve-zot ha-beracha (וְזֹאת הַבְּרָכָה)"
];

const dnyCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

// 3. ASTRONOMICKÁ LOGIKA [cite: 2026-01-13]
function getTzeitMinutes(date, lat, tz) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const decl = 0.409 * Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);
    const sunsetH = 12 + (Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(decl)) * 180 / Math.PI) / 15;
    const isDST = date.getMonth() > 2 && date.getMonth() < 9 ? 60 : 0;
    return (sunsetH * 60) + tz + isDST + 35; // +35 min pro hvězdy
}

// 4. GENERACE VÝSTUPU
function generate() {
    let apiVystup = {};

    for (const [misto, conf] of Object.entries(LOKALITY)) {
        let d = new Date();
        const nyniMin = (d.getHours() * 60) + d.getMinutes();
        const tzeitMin = getTzeitMinutes(d, conf.lat, conf.tz);

        // Posun na židovský den podle východu hvězd v daném městě [cite: 2026-01-13]
        if (nyniMin >= tzeitMin) d.setDate(d.getDate() + 1);

        const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
        const hParts = hFormat.formatToParts(d);
        const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
        
        let hDen, hMesEn, hRok;
        hParts.forEach(p => {
            if (p.type === 'day') hDen = parseInt(p.value);
            if (p.type === 'month') hMesEn = p.value;
            if (p.type === 'year') hRok = p.value;
        });

        // Svátek
        let svatek = "Dnes není žádný významný svátek.";
        if (hMesEn === "Tishri") {
            if (hDen === 1 || hDen === 2) svatek = "Roš ha-šana 🍎";
            if (hDen === 10) svatek = "Jom kipur 🕯️";
        } else if (hMesEn === "Shevat" && hDen === 15) svatek = "Tu bi-švat 🌳";
        else if ((hMesEn === "Adar" || hMesEn === "Adar II") && hDen === 14) svatek = "Purim 🎭";
        else if (hMesEn === "Nisan" && hDen >= 15 && hDen <= 22) svatek = "Pesach 🍷";

        // Paraša k nejbližší sobotě [cite: 2025-12-27]
        let sabat = new Date(d);
        while (sabat.getDay() !== 6) sabat.setDate(sabat.getDate() + 1);
        const startRoku = new Date(d.getFullYear(), 0, 1);
        const tydenRoku = Math.ceil((((sabat - startRoku) / 86400000) + startRoku.getDay() + 1) / 7);
        const indexPar = (tydenRoku + 13) % vsechnyParashot.length;

        // Vložení do větve města (místo "dnes") [cite: 2025-12-29]
        apiVystup[misto] = {
            "jom_tyden": dnyCz[d.getDay()],
            "datum_he": `${hDen}. ${mesHeCz[hMesEn] || hMesEn} ${hRok}`,
            "script_he": hScript,
            "paraša": vsechnyParashot[indexPar],
            "svatek": svatek,
            "tzeit": Math.floor(tzeitMin / 60) + ":" + (Math.floor(tzeitMin % 60)).toString().padStart(2, '0')
        };
    }

    // Zápis finálního JSONu [cite: 2025-09-15]
    fs.writeFileSync('zid-kalendar.json', JSON.stringify(apiVystup, null, 2));
    console.log("Multi-API JSON úspěšně vygenerován.");
}

generate();
