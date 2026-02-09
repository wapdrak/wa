import requests
import json
from datetime import datetime, timedelta

def update_api():
    now = datetime.now()
    # Haifa logika: po 18:00 už je zítřek
    target_date = now + timedelta(days=1) if now.hour >= 18 else now

    url = f"https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year={target_date.year}&month={target_date.month}&ss=on&mf=on&c=on&city=IL-Haifa&lg=s"
    conv_url = f"https://www.hebcal.com/converter?cfg=json&gy={target_date.year}&gm={target_date.month}&gd={target_date.day}&g2h=1"

    try:
        raw_data = requests.get(url).json()
        conv_data = requests.get(conv_url).json()

        api_output = {
            "info": {"nazev": "Židovský kalendář Haifa", "aktualizace": now.strftime("%d.%m.%Y %H:%M")},
            "konstanty": {
                "dny_cz": ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
                "mesice_he_cz": {"Shevat": "Švat", "Adar I": "Adar I", "Adar II": "Adar II", "Nisan": "Nisan", "Iyar": "Ijar", "Sivan": "Sivan", "Tamuz": "Tamuz", "Av": "Av", "Elul": "Elul", "Tishri": "Tišrej", "Cheshvan": "Chešvan", "Kislev": "Kislev", "Tevet": "Tevet"}
            },
            "data": {
                "dnes": {"datum_he": f"{conv_data['hd']}. {conv_data['hm']} {conv_data['hy']}", "script_he": conv_data['hebrew']},
                "parashot": {},
                "svatky": {}
            }
        }

        for item in raw_data.get('items', []):
            d_obj = datetime.strptime(item['date'], '%Y-%m-%d')
            klic = f"{d_obj.day}.{d_obj.month}.{d_obj.year}"
            if item['category'] == 'parashat': api_output["data"]["parashot"][klic] = item['title']
            elif item['category'] == 'holiday': api_output["data"]["svatky"][klic] = item['title']

        with open('zid-kalendar.json', 'w', encoding='utf-8') as f:
            json.dump(api_output, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Chyba: {e}")

if __name__ == "__main__":
    update_api()
