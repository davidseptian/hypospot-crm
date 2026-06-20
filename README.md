# CRM Hypospot Shoes Care

Tools CRM berbasis web untuk manajemen prospek dan follow-up customer Hypospot.
Data tersimpan real-time di Google Sheets.

---

## 🚀 Cara Setup (5 menit)

### 1. Upload ke GitHub Pages
- Buat repo baru di GitHub (contoh: `hypospot-crm`)
- Upload semua file di folder ini
- Aktifkan GitHub Pages: **Settings → Pages → Branch: main → Save**
- Akses via: `https://[username].github.io/hypospot-crm`

### 2. Setup Google Apps Script (backend)
1. Buka Google Sheets yang sudah dibuat
2. Klik menu **Extensions → Apps Script**
3. Hapus semua kode yang ada
4. **Copy-paste seluruh isi file `apps-script.gs`**
5. Klik **Deploy → New Deployment**
6. Pilih type: **Web App**
7. Isi:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
8. Klik **Deploy** → izinkan akses → copy URL yang muncul

### 3. Hubungkan CRM ke Sheets
- Buka URL GitHub Pages kamu
- Paste URL Apps Script di kotak setup → klik **Hubungkan**
- Selesai! Data langsung tersinkron dua arah.

---

## ✨ Fitur

| Fitur | Keterangan |
|---|---|
| Status Prospek | Hot / Warm / Cold / Follow-up / Cross-sell / Lost |
| Jadwal FU | Hari ini, besok, minggu ini, bulan ini, atau tanggal custom |
| Filter cepat | Satu klik filter berdasarkan status atau urgensi FU |
| Auto-refresh | Data reload otomatis setiap 60 detik |
| WA Link | Klik nomor WA → langsung buka WhatsApp |
| Export CSV | Backup data ke file CSV kapan saja |
| Stats realtime | Total pipeline, hot prospect, FU hari ini, dll |
| Tanda Overdue | Baris merah otomatis jika jadwal FU sudah lewat |

---

## 📁 Struktur File

```
crm-hypospot/
├── index.html          ← Aplikasi CRM (buka ini di browser)
├── apps-script.gs      ← Backend Google Sheets (paste ke Apps Script)
├── CRM_Hypospot_Template.xlsx  ← Template Excel dengan dropdown & format
└── README.md           ← Panduan ini
```

---

## 🔧 Konfigurasi

URL Apps Script tersimpan di localStorage browser. Jika ganti browser/device, paste ulang URL-nya di kotak setup.

---

*Hypospot Shoes Care — PT Hypospot Amerta Sejahtera*
