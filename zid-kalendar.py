import requests
import json
import os
from datetime import datetime, timedelta

# Nastavení cest
FILE_PATH = 'wa/zid-kalendar.json'

def update_api():
    now = datetime.now()
    # Tvoje Haifa logika: po 18:00 už je zítřek
    if now.hour >= 18:
        target_date = now + timedelta(days=1)
    else:
        target_date = now

    # Zdroj dat (Hebcal API slouží jen jako dodavatel surových dat)
    url = f"https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year={target_date.year}&month={target_date.month}&ss=on&mf=on&c=on&city=IL-Haifa&lg=s"
    conv_url = f"https://www.hebcal.com/converter?cfg=json&gy={target_date.year}&gm={target_date.month}&gd={target_date.day}&g2h=1"

    try:
        raw_data = requests.get(url).json()
        conv_data = requests.get(conv_url).json()

        # Tvoje struktura JSONu
        new_api_data = {
            "info": {
                "nazev": "Židovský kalendář - Haifa",
                "verze": "1.1",
                "posledni_aktualizace": now.strftime("%Y-%m-%d %H:%M")
            },
            "konstanty": {
                "dny_he_cz": ["Jom rišon (Neděle)", "Jom šeni (Pondělí)", "Jom šliši (Úterý)", "Jom revi'i (Středa)", "Jom chamiši (Čtvrtek)", "Jom šiši (Pátek)", "Šabat (Sobota / Šábes)"],
                "mesice_he_cz": {
                    "Shevat": "Švat", "Adar I": "Adar I", "Adar II": "Adar II", "Nisan": "Nisan", 
                    "Iyar": "Ijar", "Sivan": "Sivan", "Tamuz": "Tamuz", "Av": "Av", 
                    "Elul": "Elul", "Tishri": "Tišrej", "Cheshvan": "Chešvan", "Kislev": "Kislev", "Tevet": "Tevet"
                }
            },
            "data": {
                "dnes": {
                    "datum_he": f"{conv_data['hd']}. {conv_data['hm']} {conv_data['hy']}",
                    "script_he": conv_data['hebrew']
                },
                "parashot": {},
                "svatky": {}
            }
        }

        # Naplnění dat ze zdroje do tvého formátu
        for item in raw_data.get('items', []):
            # Převod data z 2026-02-14 na 14.2.2026
            d_obj = datetime.strptime(item['date'], '%Y-%m-%d')
            klic = f"{d_obj.day}.{d_obj.month}.{d_obj.year}"

            if item['category'] == 'parashat':
                new_api_data["data"]["parashot"][klic] = item['title']
            elif item['category'] == 'holiday':
                new_api_data["data"]["svatky"][klic] = item['title']

        # Uložení do souboru
        os.makedirs('wa', exist_ok=True)
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(new_api_data, f, ensure_ascii=False, indent=2)
        
        print(f"API úspěšně aktualizováno v {FILE_PATH}")

    except Exception as e:
        print(f"Chyba: {e}")

if __name__ == "__main__":
    update_api()
