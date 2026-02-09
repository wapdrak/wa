// Konfigurace českých názvů pro tvůj kalendář
const dny_cz = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
const mesice_he_cz = {
    "Shevat": "Švat", "Adar I": "Adar I", "Adar II": "Adar II", "Nisan": "Nisan", 
    "Iyar": "Ijar", "Sivan": "Sivan", "Tamuz": "Tamuz", "Av": "Av", 
    "Elul": "Elul", "Tishri": "Tišrej", "Cheshvan": "Chešvan", "Kislev": "Kislev", "Tevet": "Tevet"
};

async function init() {
    try {
        let d = new Date();
        // Haifa logika: Po 18:00 už je z hlediska kalendáře zítřek [cite: 2026-01-13]
        if (d.getHours() >= 18) d.setDate(d.getDate() + 1);

        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        const day = d.getDate();

        // 1. Načtení hebrejského data a písma
        const convRes = await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${y}&gm=${m}&gd=${day}&g2h=1`);
        const convData = await convRes.json();

        // 2. Načtení svátků a paraši pro Haifu
        const calRes = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${y}&month=${m}&ss=on&mf=on&c=on&city=IL-Haifa&lg=s`);
        const calData = await calRes.json();

        // --- PLNĚNÍ TVÝCH HTML ELEMENTŮ ---

        // Den v týdnu (jom-txt)
        document.getElementById('jom-txt').innerText = dny_cz[d.getDay()];

        // Hebrejské datum v češtině (h-date-txt)
        const czechMonth = mesice_he_cz[convData.hm] || convData.hm;
        document.getElementById('h-date-txt').innerText = `${convData.hd}. ${czechMonth} ${convData.hy}`;
        
        // Hebrejské písmo (h-script-txt)
        document.getElementById('h-script-txt').innerText = convData.hebrew;

        // Hledání Paraši a Svátku v datech
        const dateKey = d.toISOString().split('T')[0];
        let parasha = "Paraša bude doplněna.";
        let svatek = "Dnes není žádný významný svátek.";

        calData.items.forEach(item => {
            if (item.date === dateKey) {
                if (item.category === "parashat") parasha = item.title;
                if (item.category === "holiday") svatek = item.title;
            }
        });

        document.getElementById('parasha-txt').innerText = parasha;
        document.getElementById('event-txt').innerText = svatek;

    } catch (error) {
        console.error("Chyba při načítání dat:", error);
        document.getElementById('jom-txt').innerText = "Chyba připojení";
    }
}

// Funkce pro tlačítko "Sdílet datum"
function shareJewishDay() {
    const jom = document.getElementById('jom-txt').innerText;
    const datum = document.getElementById('h-date-txt').innerText;
    const pismo = document.getElementById('h-script-txt').innerText;
    const parasha = document.getElementById('parasha-txt').innerText;
    const svatek = document.getElementById('event-txt').innerText;
    const vzkaz = document.getElementById('custom-msg').value;

    const msg = `🇮🇱 Židovský kalendář - Haifa Edition\n\n${jom}\n${datum}\n${pismo}\n\n📖 Paraša: ${parasha}\n✨ Svátek: ${svatek}\n\n💬 ${vzkaz}`;

    if (navigator.share) {
        navigator.share({ text: msg });
    } else {
        alert(msg);
    }
}

// Spuštění po načtení stránky
window.onload = init;
