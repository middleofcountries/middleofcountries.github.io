# 🌍 GeoCenter - Geographic Centers of World Countries

208 ülkenin coğrafi merkezini hesaplayan, 15 dilde sunan, interaktif harita ve görselleştirme içeren web platformu.

---

## 🎯 Özellikler

### ✨ Ana Özellikler
- ✅ 208 ülke için coğrafi merkez hesaplama
- ✅ Her ülke için **vurgulu harita** (farklı renkte gösterim)
- ✅ **Animasyonlu merkez ikonu** (genişleyip daralan daireler)
- ✅ 4 farklı harita stili (Standard, Topographic, Satellite, Terrain)
- ✅ Canlı OSM haritaları (zoom/pan)
- ✅ 15 dil desteği
- ✅ Koordinat kopyalama
- ✅ Google Maps entegrasyonu
- ✅ Mesafe hesaplama (kullanıcı konumundan)
- ✅ Paylaşım butonları
- ✅ Responsive tasarım

### 📊 Hesaplama Detayları
- Gerçek OSM verilerinden hesaplama
- 100-10,000 nokta analizi
- Sınır uzunluğu hesaplama
- Alan hesaplama (km²)
- Karmaşıklık skoru (0-10)

---

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
# Python sanal ortamı oluştur
python -m venv venv

# Aktif et (Windows)
venv\Scripts\activate

# Aktif et (Linux/Mac)
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt
```

### 2. Gerekli Dosyalar

```
GeoCenter/
├── calculate_centers.py          # Coğrafi merkez hesaplama motoru
├── generate_pages.py              # Otomatik sayfa üretici
├── country_page_template.html     # Ülke sayfası şablonu
├── requirements.txt               # Python bağımlılıkları
├── PROJE_PLANI.md                # Detaylı proje planı
├── ORNEK_INDEX.html              # Örnek ana sayfa
├── GELISMIS_HARITA_ORNEGI.html   # Gelişmiş harita örneği
└── output/                        # Üretilen dosyalar
    └── countries/
        ├── *.json                 # Hesaplanan veriler
        └── en/                    # İngilizce sayfalar
            ├── tr.html            # Türkiye sayfası
            ├── us.html            # ABD sayfası
            └── ...
```

---

## 📖 Kullanım

### Adım 1: Coğrafi Merkezleri Hesapla

```bash
python calculate_centers.py
```

**Seçenekler:**
1. Sadece Türkiye'yi hesapla (TEST)
2. Tüm 208 ülkeyi hesapla (TAM ÜRETİM)

**Çıktı:**
- `output/countries/tr.json` - Türkiye verileri
- `output/countries/us.json` - ABD verileri
- ... (her ülke için)

**Örnek JSON Çıktısı:**
```json
{
  "country_code": "TR",
  "country_name": "Turkey",
  "center": {
    "lat": 39.242833,
    "lng": 35.467987
  },
  "statistics": {
    "points_analyzed": 5247,
    "boundary_length_km": 8432,
    "area_km2": 783562,
    "complexity_score": 8.5
  },
  "bounds": {
    "north": 42.1,
    "south": 36.0,
    "east": 44.8,
    "west": 26.0
  },
  "geojson": { ... }
}
```

---

### Adım 2: HTML Sayfalarını Üret

```bash
python generate_pages.py
```

**Seçenekler:**
1. Tek ülke için sayfa üret (TEST)
2. Tüm ülkeler için sayfa üret
3. Ana index sayfası oluştur
4. Hepsini yap (2 + 3)

**Dil Seçimi:**
```
Diller (virgülle ayırın): en,tr,es,fr,de
```

**Çıktı:**
```
output/countries/
├── index.html              # Ana liste sayfası
├── en/
│   ├── tr.html            # Türkiye (İngilizce)
│   ├── us.html            # ABD (İngilizce)
│   └── ...
├── tr/
│   ├── tr.html            # Türkiye (Türkçe)
│   ├── us.html            # ABD (Türkçe)
│   └── ...
└── ...
```

---

### Adım 3: Önizleme

```bash
# Basit HTTP sunucusu başlat
python -m http.server 8000

# Tarayıcıda aç
# http://localhost:8000/output/countries/index.html
```

---

## 🎨 Harita Özellikleri

### Ülke Vurgulaması
Her ülkenin kendi sayfasında:
- **Turuncu sınır** (#FF6B35) - Kalın çizgi (4px)
- **Sarı dolgu** (#FFD93D) - Yarı saydam (25%)
- Diğer ülkeler normal renkte

### Animasyonlu Merkez İkonu
```css
/* 3 halka genişleyip daralan */
.pulse-ring {
  animation: pulse 2s ease-out infinite;
}

/* Kırmızı merkez noktası */
.center-dot {
  background: #ff0000;
  box-shadow: 0 0 15px rgba(255,0,0,0.6);
}
```

### Harita Stilleri
1. **Standard** - OpenStreetMap (sokak haritası)
2. **Topographic** - OpenTopoMap (arazi, yükseklik)
3. **Satellite** - Esri (uydu görüntüsü)
4. **Terrain** - Stamen (arazi yapısı)

---

## 🌐 Çok Dilli Destek

### Desteklenen Diller (15)
1. 🇬🇧 English
2. 🇹🇷 Türkçe
3. 🇪🇸 Español
4. 🇫🇷 Français
5. 🇩🇪 Deutsch
6. 🇷🇺 Русский
7. 🇨🇳 中文
8. 🇸🇦 العربية
9. 🇵🇹 Português
10. 🇮🇹 Italiano
11. 🇯🇵 日本語
12. 🇰🇷 한국어
13. 🇮🇳 हिन्दी
14. 🇳🇱 Nederlands
15. 🇵🇱 Polski

### Çeviri Ekleme
```json
// translations/tr.json
{
  "page_title": "{{country}}'nin Coğrafi Merkezi",
  "coordinates": "Koordinatlar",
  "latitude": "Enlem",
  "longitude": "Boylam",
  ...
}
```

---

## 📊 Teknik Detaylar

### Backend
- **Python 3.11+**
- **Kütüphaneler:**
  - `geopandas` - Coğrafi veri işleme
  - `shapely` - Geometri hesaplamaları
  - `pyproj` - Koordinat dönüşümleri
  - `requests` - API çağrıları

### Frontend
- **HTML5 + CSS3 + Vanilla JavaScript**
- **Leaflet.js** - İnteraktif haritalar
- **Font Awesome** - İkonlar
- **CSS Grid + Flexbox** - Responsive layout

### Veri Kaynakları
- **OpenStreetMap** (Overpass API)
- **Natural Earth** (yedek)
- **GeoJSON** formatı

---

## 🔧 Özelleştirme

### Harita Renklerini Değiştir

`country_page_template.html` içinde:

```javascript
boundaryLayer = L.geoJSON(countryData.geojson, {
    style: {
        color: '#FF6B35',           // Sınır rengi
        weight: 4,                   // Çizgi kalınlığı
        fillColor: '#FFD93D',        // Dolgu rengi
        fillOpacity: 0.25            // Saydamlık
    }
});
```

### Merkez İkonu Animasyonunu Değiştir

```css
@keyframes pulse {
    0% {
        transform: scale(0.5);
        opacity: 1;
    }
    100% {
        transform: scale(2.5);      /* Genişleme miktarı */
        opacity: 0;
    }
}

.pulse-ring {
    animation: pulse 2s ease-out infinite;  /* Hız */
}
```

---

## 📝 Örnek Kullanım

### Türkiye Sayfası Oluşturma

```python
from generate_pages import PageGenerator

generator = PageGenerator()

# Türkiye verilerini yükle
import json
with open('output/countries/tr.json', 'r') as f:
    turkey_data = json.load(f)

# Sayfa üret
html = generator.generate_page(turkey_data, language='en')

# Kaydet
generator.save_page(html, 'TR', 'en')
```

### Tüm Ülkeler İçin Toplu Üretim

```python
generator = PageGenerator()

# 15 dilde üret
languages = ['en', 'tr', 'es', 'fr', 'de', 'ru', 'zh', 'ar', 'pt', 'it', 'ja', 'ko', 'hi', 'nl', 'pl']

generator.generate_all_pages(
    data_dir='output/countries',
    languages=languages
)

# Ana index sayfası
generator.generate_index_page()
```

---

## 🐛 Sorun Giderme

### OSM API Hatası
```
❌ API Error: 429 (Too Many Requests)
```
**Çözüm:** API rate limiting. `calculate_centers.py` içinde `time.sleep(2)` süresini artırın.

### GeoJSON Yüklenmiyor
```
⚠️ Boundary data not loaded
```
**Çözüm:** İnternet bağlantınızı kontrol edin. Alternatif olarak yerel GeoJSON dosyası kullanın.

### Harita Görünmüyor
**Çözüm:** 
1. Tarayıcı konsolunu kontrol edin (F12)
2. Leaflet.js CDN'inin yüklendiğinden emin olun
3. CORS hatası varsa yerel sunucu kullanın

---

## 📄 Lisans

MIT License - Özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz.

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

---

## 📧 İletişim

Sorularınız için: [email@example.com](mailto:email@example.com)

---

## 🎉 Teşekkürler

- **OpenStreetMap** - Harita verileri
- **Leaflet.js** - Harita kütüphanesi
- **Font Awesome** - İkonlar
- **Natural Earth** - Yedek veri kaynağı

---

**Proje Durumu:** 🚧 Geliştirme Aşamasında

**Son Güncelleme:** 2025

**Versiyon:** 1.0.0
