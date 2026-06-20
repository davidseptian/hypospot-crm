// ============================================================
//  CRM HYPOSPOT — Google Apps Script Backend
//  Paste kode ini di: Extensions > Apps Script > Deploy > Web App
//  Execute as: Me | Who has access: Anyone
// ============================================================

const SHEET_NAME = "CRM_Hypospot";
const HEADERS = [
  "Nama","WhatsApp","Platform","Status Prospek","Produk/Interest",
  "Cross-sell","Jadwal FU","Prioritas FU","Est. Value (Rp)",
  "Frekuensi Beli","Catatan Admin","Tgl Masuk","Terakhir Update","Status Update"
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupHeader(sheet);
  }
  return sheet;
}

function setupHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setBackground("#1A1A1A");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 180);  // Nama
  sheet.setColumnWidth(2, 140);  // WA
  sheet.setColumnWidth(3, 120);  // Platform
  sheet.setColumnWidth(4, 120);  // Status
  sheet.setColumnWidth(5, 180);  // Produk
  sheet.setColumnWidth(6, 200);  // Cross-sell
  sheet.setColumnWidth(7, 110);  // Jadwal FU
  sheet.setColumnWidth(8, 110);  // Prioritas FU
  sheet.setColumnWidth(9, 130);  // Est Value
  sheet.setColumnWidth(10, 100); // Frekuensi
  sheet.setColumnWidth(11, 260); // Catatan
  sheet.setColumnWidth(12, 100); // Tgl Masuk
  sheet.setColumnWidth(13, 130); // Updated
  sheet.setColumnWidth(14, 110); // Status Update
}

// ── GET ALL DATA ──────────────────────────────────────────────────────────
function getAllRows(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  return data.slice(1).map((row, i) => ({
    _row: i + 2,
    nama:         row[0]  || "",
    wa:           row[1]  || "",
    platform:     row[2]  || "",
    status:       row[3]  || "",
    produk:       row[4]  || "",
    cross:        row[5]  || "",
    jadwal_fu:    row[6]  ? Utilities.formatDate(new Date(row[6]), "Asia/Jakarta", "yyyy-MM-dd") : "",
    prioritas_fu: row[7]  || "",
    est_value:    row[8]  || "0",
    frekuensi:    row[9]  || "",
    catatan:      row[10] || "",
    tgl_masuk:    row[11] ? Utilities.formatDate(new Date(row[11]), "Asia/Jakarta", "yyyy-MM-dd") : "",
    updated_at:   row[12] || "",
    status_update:row[13] || "Aktif"
  })).filter(r => r.nama !== "");
}

// ── ADD ROW ───────────────────────────────────────────────────────────────
function addRow(sheet, d) {
  const today = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy");
  sheet.appendRow([
    d.nama, d.wa, d.platform, d.status, d.produk, d.cross,
    d.jadwal_fu || "", d.prioritas_fu, Number(d.est_value)||0,
    d.frekuensi, d.catatan, today, today, d.status_update||"Aktif"
  ]);
  applyRowFormatting(sheet, sheet.getLastRow(), d.status);
}

// ── UPDATE ROW ────────────────────────────────────────────────────────────
function updateRow(sheet, rowIndex, d) {
  const today = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy");
  sheet.getRange(rowIndex, 1, 1, 14).setValues([[
    d.nama, d.wa, d.platform, d.status, d.produk, d.cross,
    d.jadwal_fu || "", d.prioritas_fu, Number(d.est_value)||0,
    d.frekuensi, d.catatan,
    sheet.getRange(rowIndex, 12).getValue(), // preserve tgl_masuk
    today, d.status_update||"Aktif"
  ]]);
  applyRowFormatting(sheet, rowIndex, d.status);
}

// ── DELETE ROW ────────────────────────────────────────────────────────────
function deleteRow(sheet, rowIndex) {
  sheet.deleteRow(rowIndex);
}

// ── ROW FORMATTING BY STATUS ──────────────────────────────────────────────
function applyRowFormatting(sheet, rowIndex, status) {
  const colors = {
    "Hot":       "#FAECE7",
    "Warm":      "#FAEEDA",
    "Cold":      "#E6F1FB",
    "Follow-up": "#EEEDFE",
    "Cross-sell":"#EAF3DE",
    "Lost":      "#FCEBEB"
  };
  const bg = colors[status] || "#FFFFFF";
  sheet.getRange(rowIndex, 1, 1, 14).setBackground(bg);
}

// ── CORS HEADERS ──────────────────────────────────────────────────────────
function corsOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── GET HANDLER ───────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action || "getAll";
    const sheet = getSheet();
    if (action === "getAll") {
      return corsOutput({ success: true, rows: getAllRows(sheet) });
    }
    return corsOutput({ success: false, error: "Unknown action" });
  } catch(err) {
    return corsOutput({ success: false, error: err.message });
  }
}

// ── POST HANDLER ──────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    
    if (payload.action === "add") {
      addRow(sheet, payload.data);
      return corsOutput({ success: true, message: "Row added" });
    }
    
    if (payload.action === "update") {
      updateRow(sheet, payload.rowIndex, payload.data);
      return corsOutput({ success: true, message: "Row updated" });
    }
    
    if (payload.action === "delete") {
      deleteRow(sheet, payload.rowIndex);
      return corsOutput({ success: true, message: "Row deleted" });
    }
    
    return corsOutput({ success: false, error: "Unknown action" });
  } catch(err) {
    return corsOutput({ success: false, error: err.message });
  }
}
