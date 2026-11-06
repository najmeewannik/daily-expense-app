/**
 * Daily Expense Tracker - Google Apps Script Backend (Database API)
 */
const SHEET_EXPENSES = "Expenses";
const SHEET_CONFIG = "Config";

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#ecfdf5");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet(ss, SHEET_EXPENSES, ["ID", "Date", "Category", "Amount", "Note", "CreatedAt"]);
  const configSheet = getOrCreateSheet(ss, SHEET_CONFIG, ["Key", "Value"]);
  
  const data = configSheet.getDataRange().getValues();
  const keys = data.map(r => r[0]);
  if (!keys.includes("dailyBudget")) {
    configSheet.appendRow(["dailyBudget", 500]);
  }
  if (!keys.includes("monthlyBudget")) {
    configSheet.appendRow(["monthlyBudget", 15000]);
  }
  if (!keys.includes("categoryBudgets")) {
    configSheet.appendRow(["categoryBudgets", JSON.stringify({
      "อาหาร & เครื่องดื่ม": 6000,
      "การเดินทาง": 2500,
      "ช้อปปิ้ง": 2000,
      "บิล & ค่าน้ำค่าไฟ": 3500,
      "ของใช้ส่วนตัว": 1000,
      "บันเทิง & พักผ่อน": 1000,
      "สุขภาพ & ยา": 1000,
      "อื่นๆ": 1000
    })]);
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    initSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const expSheet = ss.getSheetByName(SHEET_EXPENSES);
    const expData = expSheet.getDataRange().getValues();
    
    const expenses = [];
    if (expData.length > 1) {
      for (let i = 1; i < expData.length; i++) {
        const row = expData[i];
        if (!row[0]) continue;
        expenses.push({
          id: String(row[0]),
          date: String(row[1]).split("T")[0],
          category: String(row[2]),
          amount: Number(row[3]) || 0,
          note: String(row[4] || ""),
          createdAt: String(row[5] || "")
        });
      }
    }
    
    const cfgSheet = ss.getSheetByName(SHEET_CONFIG);
    const cfgData = cfgSheet.getDataRange().getValues();
    const config = { dailyBudget: 500, monthlyBudget: 15000, categoryBudgets: {} };
    for (let i = 1; i < cfgData.length; i++) {
      if (cfgData[i][0] === "dailyBudget") config.dailyBudget = Number(cfgData[i][1]) || 500;
      if (cfgData[i][0] === "monthlyBudget") config.monthlyBudget = Number(cfgData[i][1]) || 15000;
      if (cfgData[i][0] === "categoryBudgets") {
        try {
          config.categoryBudgets = JSON.parse(cfgData[i][1]);
        } catch (_) {
          config.categoryBudgets = {};
        }
      }
    }
    
    return jsonResponse({
      success: true,
      data: {
        expenses: expenses,
        budget: config
      }
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    initSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const expSheet = ss.getSheetByName(SHEET_EXPENSES);
    const cfgSheet = ss.getSheetByName(SHEET_CONFIG);
    
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      payload = e.parameter;
    }
    
    const action = payload.action;
    
    if (action === "add_expense") {
      const exp = payload.expense;
      expSheet.appendRow([
        exp.id || Utilities.getUuid(),
        exp.date,
        exp.category,
        exp.amount,
        exp.note || "",
        exp.createdAt || new Date().toISOString()
      ]);
      return jsonResponse({ success: true, message: "Expense added" });
    }
    
    if (action === "delete_expense") {
      const targetId = String(payload.id);
      const data = expSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === targetId) {
          expSheet.deleteRow(i + 1);
          return jsonResponse({ success: true, message: "Expense deleted" });
        }
      }
      return jsonResponse({ success: false, message: "ID not found" });
    }
    
    if (action === "set_budget") {
      const daily = Number(payload.dailyBudget);
      const monthly = Number(payload.monthlyBudget);
      const catBudgets = payload.categoryBudgets ? JSON.stringify(payload.categoryBudgets) : null;
      
      const cfgData = cfgSheet.getDataRange().getValues();
      let dailyFound = false;
      let monthlyFound = false;
      let catFound = false;
      
      for (let i = 1; i < cfgData.length; i++) {
        if (cfgData[i][0] === "dailyBudget") {
          cfgSheet.getRange(i + 1, 2).setValue(daily);
          dailyFound = true;
        }
        if (cfgData[i][0] === "monthlyBudget") {
          cfgSheet.getRange(i + 1, 2).setValue(monthly);
          monthlyFound = true;
        }
        if (cfgData[i][0] === "categoryBudgets" && catBudgets) {
          cfgSheet.getRange(i + 1, 2).setValue(catBudgets);
          catFound = true;
        }
      }
      if (!dailyFound) cfgSheet.appendRow(["dailyBudget", daily]);
      if (!monthlyFound) cfgSheet.appendRow(["monthlyBudget", monthly]);
      if (!catFound && catBudgets) cfgSheet.appendRow(["categoryBudgets", catBudgets]);
      
      return jsonResponse({ success: true, message: "Budget updated" });
    }
    
    if (action === "ping") {
      return jsonResponse({ success: true, message: "Connected successfully to Google Sheet!" });
    }
    
    return jsonResponse({ success: false, message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}
