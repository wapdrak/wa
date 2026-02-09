import requests
import json
from datetime import datetime

def generate_json():
    rok = datetime.now().year
    url = f"https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year={rok}&month=x&ss=on&mf=on&c=on&city=IL-Haifa&lg=s"
    
    try:
        res = requests.get(url)
        data = res.json()
        vystup = {"parashot": {}, "svatky": {}}

        for item in data.get('items', []):
            d_obj = datetime.strptime(item['date'], '%Y-%m-%d')
            klic = f"{d_obj.day}.{d_obj.month}.{d_obj.year}"
            
            if item['category'] == 'parashat':
                vystup["parashot"][klic] = item['title']
            elif item['category'] == 'holiday':
                vystup["svatky"][klic] = item['title']

        with open('zid-kalendar.json', 'w', encoding='utf-8') as f:
            json.dump(vystup, f, ensure_ascii=False, indent=2)
        print("Soubor zid-kalendar.json byl úspěšně vytvořen.")
    except Exception as e:
        print(f"Chyba: {e}")

if __name__ == "__main__":
    generate_json()
