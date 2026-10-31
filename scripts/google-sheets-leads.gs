/**
 * Leads Boutique Forever -> Google Sheets
 *
 * Installation (5 minutes) :
 * 1. Créez un Google Sheet, puis Extensions > Apps Script, et collez ce fichier.
 * 2. Paramètres du projet > Propriétés du script > ajoutez LEADS_SECRET = une longue chaîne aléatoire
 *    (la même valeur que LEADS_WEBHOOK_SECRET dans .env.local).
 * 3. Exécutez setupSheet() une fois et autorisez l'accès.
 * 4. Déployer > Nouveau déploiement > Application Web : exécuter en tant que « Moi », accès « Tout le monde ».
 *    Copiez l'URL dans GOOGLE_SHEETS_WEBHOOK_URL.
 * 5. Après chaque modification du script : Déployer > Gérer les déploiements > nouvelle version.
 */
const SHEET_NAME = "Leads";
const TIMEZONE = "Africa/Brazzaville";
const STATUSES = ["Nouveau", "Contacté", "Intéressé", "Client", "Perdu"];
const HEADERS = [
  "Date", "Prénom", "WhatsApp", "Besoin principal", "Comment on le sait", "Autres besoins",
  "Produits consultés", "Panier (F)", "Campagne", "Source", "Site d'origine",
  "Page d'arrivée", "Page du pop-up", "Statut", "Dernière demande", "Nb de demandes",
];
const COL = {
  DATE: 1, NAME: 2, PHONE: 3, NEED: 4, ORIGIN: 5, OTHERS: 6, VIEWED: 7, CART: 8, CAMPAIGN: 9,
  SOURCE: 10, REFERRER: 11, LANDING: 12, PAGE: 13, STATUS: 14, LAST: 15, COUNT: 16,
};

function getSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
}

/** À exécuter une fois : en-têtes, colonne Statut en liste déroulante, cellules en texte (aucune formule possible). */
function setupSheet() {
  const sheet = getSheet_();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold").setBackground("#ECFDF5");
  sheet.setFrozenRows(1);
  sheet.getRange(2, 1, 998, HEADERS.length).setNumberFormat("@");
  sheet.getRange(2, COL.CART, 998, 1).setNumberFormat("#,##0");
  sheet.getRange(2, COL.STATUS, 998, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
  );
  sheet.setColumnWidths(1, HEADERS.length, 150);
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, service: "leads" });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty("LEADS_SECRET");
    if (!secret || body.token !== secret) return json_({ ok: false, error: "unauthorized" });

    const phone = String(body.phone || "").replace(/\D/g, "");
    if (!phone) return json_({ ok: false, error: "phone" });

    const sheet = getSheet_();
    if (sheet.getLastRow() < 1) setupSheet();
    const now = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm");
    const join = (list) => (Array.isArray(list) ? list.join(", ") : "");

    // Même numéro = même fiche : on met à jour le besoin et on compte la demande.
    const lastRow = sheet.getLastRow();
    const phones = lastRow > 1 ? sheet.getRange(2, COL.PHONE, lastRow - 1, 1).getDisplayValues().flat() : [];
    const index = phones.indexOf(phone);

    if (index >= 0) {
      const row = index + 2;
      const count = Number(sheet.getRange(row, COL.COUNT).getValue()) || 1;
      if (body.need) {
        sheet.getRange(row, COL.NEED, 1, 4).setValues([[body.need, body.needOrigin || "", join(body.otherNeeds), join(body.viewedProducts)]]);
      }
      sheet.getRange(row, COL.CART).setValue(Number(body.cartTotal) || 0);
      sheet.getRange(row, COL.PAGE).setValue(body.pagePath || "");
      sheet.getRange(row, COL.LAST).setValue(now);
      sheet.getRange(row, COL.COUNT).setValue(count + 1);
    } else {
      const row = lastRow + 1;
      sheet.getRange(row, 1, 1, HEADERS.length).setNumberFormat("@");
      sheet.getRange(row, COL.CART).setNumberFormat("#,##0");
      sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
        now, body.firstName || "", phone, body.need || "À préciser", body.needOrigin || "", join(body.otherNeeds),
        join(body.viewedProducts), Number(body.cartTotal) || 0, body.campaign || "", body.source || "",
        body.referrer || "", body.landingPath || "", body.pagePath || "", "Nouveau", now, 1,
      ]]);
      sheet.getRange(row, COL.STATUS).setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
      );
    }
    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}
