<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Židovský kalendář - Haifa Edition</title>
    <style>
        /* HLAVIČKA: Design (Fialová barva a styl) [cite: 2025-09-15] */
        :root {
            --bg: #0f0a1a;
            --card: #2e1a47; 
            --accent: #bb86fc;
            --text: #ffffff;
            --muted: #d1c4e9;
        }
        body {
            font-family: 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 15px;
        }
        #q-cont {
            width: 100%;
            max-width: 550px;
            background: var(--card);
            border: 3px solid var(--accent);
            border-radius: 35px;
            padding: 35px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.7);
            text-align: center;
        }
        .header { font-size: 0.9em; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
        .misto-label { font-size: 1.1em; color: var(--accent); margin-bottom: 15px; display: block; opacity: 0.8; }
        .jom-tyden { font-size: 1.7em; font-weight: 300; margin-bottom: 20px; opacity: 0.9; }
        .hebrew-date { font-size: clamp(2.2em, 8vw, 3em); font-weight: 800; margin: 10px 0; line-height: 1.1; }
        .hebrew-script { font-size: 2em; color: var(--accent); margin-bottom: 20px; font-family: 'Times New Roman', serif; }
        .section-label { font-size: 1.1em; color: var(--accent); font-weight: bold; margin-top: 25px; display: block; }
        .detail-text { font-size: 1.3em; line-height: 1.5; color: var(--muted); font-style: italic; margin-top: 5px; }
        .parasha-link { color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent); }
        .explanation { margin-top: 30px; padding: 20px; border: 1px solid rgba(187, 134, 252, 0.3); border-radius: 20px; color: var(--accent); font-size: 1.1em; line-height: 1.4; background: rgba(0,0,0,0.2); }
        #custom-msg { width: 100%; background: rgba(15, 10, 26, 0.5); border: 1px solid var(--accent); border-radius: 15px; color: white; padding: 12px; margin-top: 5px; resize: none; box-sizing: border-box; font-family: inherit; }
        .share-btn { margin-top: 25px; background: var(--accent); color: #0f0a1a; border: none; padding: 20px; border-radius: 50px; font-size: 1.2em; font-weight: bold; cursor: pointer; width: 100%; transition: 0.3s; }
        .share-btn:active { transform: scale(0.98); opacity: 0.8; }
    </style>
</head>
<body>

    <div id="q-cont">
        <div class="header">Židovský kalendář</div>
        <div class="misto-label" id="misto-txt">Načítám lokalitu...</div>
        <div class="jom-tyden" id="jom-txt">Načítám...</div>
        
        <div class="hebrew-date" id="h-date-txt">--. -- ----</div>
        <div class="hebrew-script" id="h-script-txt">-- בִּשְׁבָט --</div>
        
        <span class="section-label">📖 Parašat HaŠavua:</span>
        <div class="detail-text">
            <a href="https://www.sefaria.org.il/topics/torah-portions?sort=Relevance&tab=sources" target="_blank" class="parasha-link" id="parasha-txt">Načítám parašu...</a>
        </div>
        
        <span class="section-label">✨ Svátek / Událost:</span>
        <div class="detail-text" id="event-txt">Načítám...</div>
        
        <div class="explanation" id="expl-txt">
            Datum se mění s východem první hvězdy v dané lokalitě, což znamená že nový den začíná již večer.
        </div>

        <textarea id="custom-msg" rows="2">Posílám pozdravy! 🇮🇱</textarea>
        <button class="share-btn" onclick="shareJewishDay()">Sdílet datum 🇮🇱</button>
    </div>

    <script>
        /**
         * 1. KONFIGURACE LOKALIT [cite: 2026-01-13]
         * Obsahuje souřadnice a základní časový posun (v minutách).
         */
        const LOKALITY = {
            "Haifa":      { lat: 32.79, lng: 34.99, tz: 120, label: "Haifa, Izrael 🇮🇱" },
            "Jeruzalem":  { lat: 31.76, lng: 35.21, tz: 120, label: "Jeruzalém, Izrael 🇮🇱" },
            "Praha":      { lat: 50.07, lng: 14.43, tz: 60,  label: "Praha, Česko 🇨🇿" },
            "Bratislava": { lat: 48.14, lng: 17.10, tz: 60,  label: "Bratislava, Slovensko 🇸🇰" }
        };

        const dnyHeCz = ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"];
        const mesHeCz = {"Shevat":"Švat", "Adar I":"Adar I", "Adar II":"Adar II", "Nisan":"Nisan", "Iyar":"Ijar", "Sivan":"Sivan", "Tamuz":"Tamuz", "Av":"Av", "Elul":"Elul", "Tishri":"Tišrej", "Cheshvan":"Chešvan", "Kislev":"Kislev", "Tevet":"Tevet"};

        /**
         * 2. POMOCNÉ FUNKCE
         */

        // Získání nastavení z URL (Implicitně Haifa) [cite: 2025-09-11]
        function getActiveSettings() {
            const params = new URLSearchParams(window.location.search);
            const mistoParam = params.get('misto');
            return LOKALITY[mistoParam] || LOKALITY["Haifa"];
        }

        // Astronomický výpočet východu hvězd pro zvolenou lokalitu [cite: 2026-01-13]
        function getTzeitMinutes(date, conf) {
            const lat = conf.lat;
            const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
            const decl = 0.409 * Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);
            const sunsetH = 12 + (Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(decl)) * 180 / Math.PI) / 15;
            
            // Detekce letního času (zjednodušená pro EU/IL region)
            const isDST = date.getMonth() > 2 && date.getMonth() < 9 ? 60 : 0; 
            
            return (sunsetH * 60) + conf.tz + isDST + 35; // +35 min pro hvězdy [cite: 2026-01-13]
        }

        /**
         * 3. HLAVNÍ INICIALIZACE [cite: 2025-10-11]
         */
        async function init() {
            const conf = getActiveSettings();
            document.getElementById('misto-txt').innerText = conf.label;

            let d = new Date();
            const nyniMin = (d.getHours() * 60) + d.getMinutes();
            const tzeitMin = getTzeitMinutes(d, conf);

            // Posun dne podle hvězd [cite: 2026-01-13]
            if (nyniMin >= tzeitMin) d.setDate(d.getDate() + 1);

            document.getElementById('jom-txt').innerText = dnyHeCz[d.getDay()];

            // Hebrejské datum přes Intl engine (Doživotní funkčnost) [cite: 2025-12-27]
            const hFormat = new Intl.DateTimeFormat('en-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'});
            const hParts = hFormat.formatToParts(d);
            const hScript = new Intl.DateTimeFormat('he-u-ca-hebrew', {day:'numeric', month:'long', year:'numeric'}).format(d);
            
            let den, mesEn, rok;
            hParts.forEach(p => {
                if (p.type === 'day') den = p.value;
                if (p.type === 'month') mesEn = p.value;
                if (p.type === 'year') rok = p.value;
            });

            document.getElementById('h-date-txt').innerText = `${den}. ${mesHeCz[mesEn] || mesEn} ${rok}`;
            document.getElementById('h-script-txt').innerText = hScript;

            // Načtení dat z tvého vlastního API (JSON) [cite: 2025-09-15]
            try {
                const res = await fetch('zid-kalendar.json?v=' + Date.now());
                const api = await res.json();
                document.getElementById('parasha-txt').innerText = api.dnes.paraša;
                document.getElementById('event-txt').innerText = api.dnes.svatek;
            } catch (e) {
                document.getElementById('parasha-txt').innerText = "Data z API nedostupná";
                document.getElementById('event-txt').innerText = "Dnes není žádný významný svátek.";
            }
        }

        // FUNKCE: Bohaté sdílení [cite: 2025-12-29]
        function shareJewishDay() {
            const conf = getActiveSettings();
            const text = `🇮🇱 Židovský kalendář - ${conf.label}\n\n` +
                         `Dnes je ${document.getElementById('jom-txt').innerText}\n` +
                         `${document.getElementById('h-date-txt').innerText}\n` +
                         `${document.getElementById('h-script-txt').innerText}\n\n` +
                         `📖 Paraša: ${document.getElementById('parasha-txt').innerText}\n` +
                         `✨ Svátek: ${document.getElementById('event-txt').innerText}\n\n` +
                         `📌 ${document.getElementById('expl-txt').innerText}\n\n` +
                         `💬 ${document.getElementById('custom-msg').value}`;

            if (navigator.share) navigator.share({ text: text }); else alert(text);
        }

        window.onload = init;
    </script>
</body>
</html>
