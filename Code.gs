/**
 * Homes Partners PH – Alara Village landing page
 * Lead capture + EMAIL AUTOMATION
 *
 * Ano ang ginagawa nito:
 *  1. Sine-save ang bawat lead sa Google Sheet ("Homes Partners PH – Leads").
 *  2. Nagpapadala ng NOTIFICATION sa iyo (OWNER_EMAIL) sa bawat bagong lead.
 *  3. Nagpapadala ng AUTO-REPLY sa lead (kumpirmasyon + summary ng bahay na gusto niya).
 *  4. Nagpapadala ng 30-ARAW NA EMAIL SERIES (simpleng personal na sulat): isang email kada araw,
 *     tuwing DRIP_HOUR, simula sa araw pagkatapos mag-submit. Nasa file na Drip.gs ang laman ng 30 emails.
 *
 * Setup (isang beses lang):
 *  - Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone)
 *  - Siguraduhing may file na Drip.gs (Script file) sa project, at Asia/Manila ang time zone
 *    (Project Settings > Time zone).
 *  - Piliin ang function  setupAutomation  at pindutin ang Run, tapos i-authorize.
 *  - (Optional) Piliin ang  sendTestEmails  at Run para makita ang itsura ng emails sa Gmail mo.
 *
 * Para ihinto ang email series sa isang lead: palitan ang Status sa Sheet ng
 * Contacted, Closed o Unsubscribed. Makikita sa column "Drip Day" kung nasaang araw na siya.
 */

var CONFIG = {
  OWNER_EMAIL: 'violentamanny@gmail.com',     // dito dadating ang notifications at dito mag-rereply ang leads
  BRAND: 'Homes Partners PH',
  TAGLINE: 'Real Partners',
  PHONE_DISPLAY: '0995 358 1519',
  PHONE_LINK: '+639953581519',
  FB_MANNY: 'https://facebook.com/manny.violenta',
  FB_ANNALYN: 'https://facebook.com/annalyn.violenta',
  SHEET_NAME: 'Leads',
  SEND_AUTOREPLY: true,        // kumpirmasyon sa lead pagka-submit
  SEND_DRIP: true,             // 30-araw na email series (isang email kada araw)
  DRIP_HOUR: 9,                // anong oras ipapadala araw-araw (9 = 9:00 AM, ayon sa time zone ng project)
  DRIP_DAYS: 30,               // ilang araw ang series (30 ang nasa Drip.gs)
  MIN_QUOTA_LEFT: 5            // titigil ang pagpapadala kapag ito na lang ang natitirang email quota sa araw
};

var HEADERS = ['Date', 'Name', 'Mobile', 'Email', 'Home of interest', 'Budget / Notes', 'Status', 'Drip Day', 'Last Email'];
var STATUSES = ['New', 'Contacted', 'Closed', 'Unsubscribed'];

// Detalye ng bahay para sa emails. Palitan kung may opisyal na detalye.
var MODELS = {
  'Veta': { sqm: 85,  type: '2-Storey Single Detached',    tag: 'Where bonds blossom',     reservation: '₱40,000' },
  'Zila': { sqm: 96,  type: '2-Storey Partially Attached', tag: 'Where families flourish', reservation: '₱40,000' },
  'Raya': { sqm: 110, type: '2-Storey Residence',          tag: 'Space to gather',         reservation: '' },
  'Yana': { sqm: 130, type: '2-Storey Residence',          tag: 'The grandest address',    reservation: '' }
};

/* ============================ WEB APP ============================ */

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Homes Partners PH · Alara Village')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Pinagsasama ang hiwa-hiwalay na file (Stylesheet, Images, JavaScript) sa Index. */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * MGA VIDEO NA NASA APPS SCRIPT MISMO.
 * Bawat video ay may sariling HTML file (base64 ng .mp4). Kinukuha lang ito kapag pinindot ng client ang bilog,
 * kaya hindi bumibigat ang page. Para magdagdag: gumawa ng bagong HTML file (hal. Vid_midpark2) at idagdag dito.
 */
var VIDEO_FILES_ = {
  gate: 'Vid_gate'
  // midpark1: 'Vid_midpark1',
  // midpark2: 'Vid_midpark2',
};

function getVideoData(id) {
  var file = VIDEO_FILES_[id];
  if (!file) throw new Error('Walang video na ' + id);
  return HtmlService.createHtmlOutputFromFile(file).getContent().replace(/\s+/g, '');
}

/** Tinatawag mula sa page (google.script.run) */
function saveLead(data) {
  data = data || {};

  // honeypot: ang bots lang ang pumupuno nito
  if (String(data.website || '').trim()) return { ok: true };

  var name = clean_(data.name, 120);
  var mobile = clean_(data.mobile, 40);
  var email = clean_(data.email, 160).toLowerCase();
  var modelRaw = clean_(data.model, 60);
  var notes = clean_(data.notes, 500);
  var model = modelName_(modelRaw);

  if (!name || !mobile) throw new Error('Name and mobile number are required.');
  if (!isEmail_(email)) throw new Error('Please enter a valid email address.');

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  var sheetUrl = '';
  try {
    var sh = getSheet_();
    var map = headerMap_(sh);
    var row = new Array(sh.getLastColumn()).fill('');
    row[map['Date']] = new Date();
    row[map['Name']] = safeCell_(name);
    row[map['Mobile']] = mobile;
    row[map['Email']] = email;
    row[map['Home of interest']] = modelRaw;
    row[map['Budget / Notes']] = safeCell_(notes);
    row[map['Status']] = 'New';
    sh.appendRow(row);
    sheetUrl = sh.getParent().getUrl();
  } finally {
    lock.releaseLock();
  }

  // Ang lead ay naka-save na. Kahit mag-fail ang email, hindi mawawala ang lead.
  try { notifyOwner_({ name: name, mobile: mobile, email: email, model: modelRaw, notes: notes }, sheetUrl); }
  catch (e) { console.error('notifyOwner_ failed: ' + e); }

  if (CONFIG.SEND_AUTOREPLY) {
    try { sendAutoReply_(name, email, model); }
    catch (e) { console.error('sendAutoReply_ failed: ' + e); }
  }
  return { ok: true };
}

/* ====================== SHEET HELPERS ====================== */

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('LEADS_SHEET_ID');
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('Homes Partners PH – Leads');
    props.setProperty('LEADS_SHEET_ID', ss.getId());
  }
  var sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(CONFIG.SHEET_NAME);
  }
  ensureHeaders_(sh);
  return sh;
}

/** Dinadagdag ang mga kulang na column (ligtas kahit may luma nang Sheet). */
function ensureHeaders_(sh) {
  var lastCol = Math.max(sh.getLastColumn(), 1);
  var current = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  var isEmpty = current.every(function (c) { return c === ''; });
  if (isEmpty) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    HEADERS.forEach(function (h) {
      if (current.indexOf(h) === -1) {
        sh.getRange(1, sh.getLastColumn() + 1).setValue(h);
        current.push(h);
      }
    });
  }
  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold');
  sh.setFrozenRows(1);

  var map = headerMap_(sh);
  sh.getRange(2, map['Mobile'] + 1, Math.max(sh.getMaxRows() - 1, 1), 1).setNumberFormat('@');
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(true).build();
  sh.getRange(2, map['Status'] + 1, Math.max(sh.getMaxRows() - 1, 1), 1).setDataValidation(rule);
}

function headerMap_(sh) {
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var map = {};
  headers.forEach(function (h, i) { map[String(h)] = i; });
  return map;
}

/* ====================== AUTOMATION (30-ARAW NA SERIES) ====================== */

/** Patakbuhin ito ISANG BESES para i-set up ang daily trigger. */
function setupAutomation() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var h = t.getHandlerFunction();
    if (h === 'processFollowUps' || h === 'processDrip') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('processDrip').timeBased().everyDays(1).atHour(CONFIG.DRIP_HOUR).create();
  getSheet_(); // gagawa/aayos ng Sheet at i-a-authorize ang Sheets access
  Logger.log('Tapos na. Magpapadala ng email series araw-araw mga ' + CONFIG.DRIP_HOUR + ':00 (time zone: ' + Session.getScriptTimeZone() + ').');
  Logger.log('Kung hindi Asia/Manila ang time zone, palitan sa Project Settings.');
}

/** Ilang araw ang series (ang mas maliit sa CONFIG.DRIP_DAYS at sa dami ng emails sa Drip.gs) */
function dripTotal_() { return Math.min(CONFIG.DRIP_DAYS, DRIP_.length); }

/** Bilang ng kalendaryong araw sa pagitan ng dalawang petsa (ayon sa time zone ng project) */
function dayDiff_(from, to) {
  var tz = Session.getScriptTimeZone();
  var a = Utilities.formatDate(from, tz, 'yyyy-MM-dd').split('-');
  var b = Utilities.formatDate(to, tz, 'yyyy-MM-dd').split('-');
  return Math.round((Date.UTC(+b[0], +b[1] - 1, +b[2]) - Date.UTC(+a[0], +a[1] - 1, +a[2])) / 864e5);
}

/**
 * Tumatakbo isang beses kada araw (time-driven trigger).
 * Para sa bawat lead na "New" pa ang Status: kung dumating na ang araw ng susunod na email, ipapadala ito.
 * Isang email lang kada lead kada takbo, kaya kahit may na-miss na araw, tuloy-tuloy pa rin ang pagkakasunod-sunod.
 */
function processDrip() {
  if (!CONFIG.SEND_DRIP) return;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  var sent = 0, total = dripTotal_(), started = new Date().getTime();
  try {
    var sh = getSheet_();
    var last = sh.getLastRow();
    if (last < 2) return;
    var map = headerMap_(sh);
    var width = sh.getLastColumn();
    var values = sh.getRange(2, 1, last - 1, width).getValues();
    var today = new Date();

    for (var i = 0; i < values.length; i++) {
      if (new Date().getTime() - started > 5 * 60 * 1000) break;               // iwas sa 6-minutong limit ng Apps Script
      if (MailApp.getRemainingDailyQuota() <= CONFIG.MIN_QUOTA_LEFT) break;    // protektahan ang email quota

      var r = values[i];
      var status = String(r[map['Status']] || 'New').trim() || 'New';
      if (status !== 'New') continue;

      var email = String(r[map['Email']] || '').trim().toLowerCase();
      if (!isEmail_(email)) continue;

      var created = r[map['Date']];
      if (!(created instanceof Date)) continue;

      var done = Number(r[map['Drip Day']]) || 0;
      if (done >= total) continue;
      var next = done + 1;
      if (dayDiff_(created, today) < next) continue;                           // hindi pa araw ng susunod na email

      var lastSent = r[map['Last Email']];
      if (lastSent instanceof Date && dayDiff_(lastSent, today) < 1) continue; // may naipadala na ngayong araw

      var name = String(r[map['Name']] || '').replace(/^'/, '');
      var model = modelName_(String(r[map['Home of interest']] || ''));
      var rowNum = i + 2;
      try {
        sendDrip_(next, name, email, model);
        sh.getRange(rowNum, map['Drip Day'] + 1, 1, 2).setValues([[next, new Date()]]);
        sent++;
      } catch (e) { console.error('Drip day ' + next + ' failed row ' + rowNum + ': ' + e); }
    }
  } finally {
    lock.releaseLock();
  }
  Logger.log('Email series: ' + sent + ' email(s) ang naipadala.');
}

/** Para makita ang itsura ng mga email: ipapadala sa OWNER_EMAIL mo (6 na email). */
function sendTestEmails() {
  var me = CONFIG.OWNER_EMAIL, total = dripTotal_();
  notifyOwner_({ name: 'Juan Dela Cruz', mobile: '+63 917 123 4567', email: me, model: 'Veta · 85 sqm', notes: 'Budget around 25k/month' }, 'https://docs.google.com/spreadsheets');
  sendAutoReply_('Juan Dela Cruz', me, 'Veta');
  [1, 7, 19, total].forEach(function (d) { sendDrip_(d, 'Juan Dela Cruz', me, 'Veta'); });
  Logger.log('6 test emails ang ipinadala sa ' + me + ' (notification, auto-reply, at Araw 1, 7, 19 at ' + total + ' ng series).');
}

/** Ipapadala sa iyo ang LAHAT ng emails ng series (isa-isa) para mabasa mo. Gagamit ito ng 30 email sa quota mo ngayong araw. */
function sendAllDripTests() {
  var me = CONFIG.OWNER_EMAIL, total = dripTotal_();
  for (var d = 1; d <= total; d++) {
    sendDrip_(d, 'Juan Dela Cruz', me, 'Veta');
    Utilities.sleep(400);
  }
  Logger.log(total + ' emails ng series ang ipinadala sa ' + me);
}

/* ====================== EMAILS ====================== */
/*
 * Dalawang uri ng email:
 *  1. Para sa CLIENT (auto-reply at 30-araw na series): simpleng personal na sulat. Tingnan ang "PLAIN, PERSONAL NA EMAILS" sa ibaba.
 *  2. Para sa IYO (notification ng bagong lead): may disenyo (madilim na berde at ginto), gamit ang layout_.
 */

var C_ = { INK: '#0C1310', GREEN: '#14201A', GOLD: '#CDAE6F', GOLD_D: '#7A5C24', IVORY: '#F5F0E6', CREAM: '#EFE9DB', CARD: '#FBF8F1', TEXT: '#2A332D', MUTE: '#8A948C', SOFT: '#F2ECDC' };
var SERIF_ = "Georgia,'Times New Roman',serif";
var SANS_ = "Arial,Helvetica,sans-serif";

function stripHtml_(h) {
  return String(h).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

/** mailto link na may nakahandang subject at laman, para isang pindot lang ang reply ng lead */
function replyLink_(subject, body) {
  return 'mailto:' + CONFIG.OWNER_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

/* ---- PAGE LAYOUT ---- */

function layout_(preheader, bodyHtml, footNote, withSign, opts) {
  opts = opts || {};
  var sign = withSign ? (
    '<p style="margin:34px 0 4px;font-family:' + SERIF_ + ';font-size:17px;color:' + C_.TEXT + '">Hanggang sa muli,</p>' +
    '<p style="margin:0;font-family:' + SERIF_ + ';font-style:italic;font-size:34px;line-height:1.15;color:' + C_.GOLD_D + '">Manny &amp; Annalyn</p>' +
    '<p style="margin:8px 0 0;font-family:' + SANS_ + ';font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:' + C_.MUTE + '">' + esc_(CONFIG.BRAND) + ' &nbsp;·&nbsp; ' + esc_(CONFIG.TAGLINE) + '</p>' +
    '<p style="margin:22px 0 0;line-height:2.6">' +
    ['<a href="tel:' + CONFIG.PHONE_LINK + '" style="display:inline-block;margin:0 8px 0 0;padding:11px 18px;border:1px solid ' + C_.GOLD_D + ';font-family:' + SANS_ + ';font-size:11px;font-weight:bold;letter-spacing:.16em;text-transform:uppercase;color:' + C_.GOLD_D + ';text-decoration:none">Call / Text ' + esc_(CONFIG.PHONE_DISPLAY) + '</a>',
     '<a href="' + CONFIG.FB_MANNY + '" style="display:inline-block;margin:0 8px 0 0;padding:11px 18px;border:1px solid #D9CDAE;font-family:' + SANS_ + ';font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:' + C_.TEXT + ';text-decoration:none">Manny</a>',
     '<a href="' + CONFIG.FB_ANNALYN + '" style="display:inline-block;margin:0;padding:11px 18px;border:1px solid #D9CDAE;font-family:' + SANS_ + ';font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:' + C_.TEXT + ';text-decoration:none">Annalyn</a>'].join('') + '</p>'
  ) : '';
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">' +
    '<style>@media only screen and (max-width:620px){.px{padding-left:22px!important;padding-right:22px!important}.hd{font-size:36px!important}}</style></head>' +
    '<body style="margin:0;padding:0;background:' + C_.CREAM + '">' +
    '<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:' + C_.CREAM + '">' + esc_(preheader) + '</span>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="' + C_.CREAM + '" style="background:' + C_.CREAM + '"><tr><td align="center" style="padding:28px 10px">' +
    '<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px">' +
    // header
    '<tr><td align="center" bgcolor="#0F1A15" class="px" style="background:#0F1A15;padding:46px 28px 38px">' +
    '<div class="hd" style="font-family:' + SERIF_ + ';font-size:46px;line-height:1;letter-spacing:.26em;padding-left:.26em;color:' + C_.IVORY + '">ALARA</div>' +
    '<div style="margin-top:14px;font-family:' + SANS_ + ';font-size:10px;letter-spacing:.5em;padding-left:.5em;text-transform:uppercase;color:' + C_.GOLD + '">Village &nbsp;·&nbsp; Imus, Cavite</div>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 0"><tr><td width="56" height="1" style="width:56px;height:1px;background:' + C_.GOLD + ';line-height:1px;font-size:0">&nbsp;</td></tr></table>' +
    '<div style="margin-top:18px;font-family:' + SANS_ + ';font-size:10px;letter-spacing:.34em;padding-left:.34em;text-transform:uppercase;color:#98A59B">Presented by ' + esc_(CONFIG.BRAND) + '</div>' +
    '</td></tr>' +
    '<tr><td height="4" style="height:4px;background:' + C_.GOLD + ';line-height:4px;font-size:0">&nbsp;</td></tr>' +
    // body
    '<tr><td class="px" bgcolor="' + C_.CARD + '" style="background:' + C_.CARD + ';padding:46px 52px 40px">' + (opts.progress ? progressHtml_(opts.progress.day, opts.progress.total) : '') + bodyHtml + sign + '</td></tr>' +
    // footer
    '<tr><td align="center" class="px" bgcolor="' + C_.GREEN + '" style="background:' + C_.GREEN + ';padding:28px 40px;font-family:' + SANS_ + ';font-size:11px;line-height:1.8;color:#8C9A90">' +
    '<div style="letter-spacing:.2em;text-transform:uppercase;color:' + C_.GOLD + '">Alara Village · Imus, Cavite</div>' +
    '<div style="margin-top:6px">By LandOne Concept Inc.</div>' +
    '<div style="margin-top:12px">Images are artist’s perspectives and for illustration purposes only. Prices and inclusions are subject to change.</div>' +
    (footNote ? '<div style="margin-top:12px;color:#B5C0B8">' + esc_(footNote) + '</div>' : '') +
    (opts.unsub ? '<div style="margin-top:12px"><a href="' + esc_(replyLink_('STOP', 'STOP')) + '" style="color:' + C_.GOLD + ';text-decoration:underline">Mag-unsubscribe</a></div>' : '') +
    '</td></tr></table></td></tr></table></body></html>';
}

/** Progress bar sa taas ng email: "Ang Daan Pauwi · Araw 12 / 30" */
function progressHtml_(day, total) {
  var pct = Math.max(4, Math.min(100, Math.round(day / total * 100)));
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px"><tr>' +
    '<td style="padding-bottom:9px;font-family:' + SANS_ + ';font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:' + C_.GOLD_D + ';font-weight:bold">Ang Daan Pauwi</td>' +
    '<td align="right" style="padding-bottom:9px;font-family:' + SANS_ + ';font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:' + C_.MUTE + '">Araw ' + day + ' / ' + total + '</td></tr>' +
    '<tr><td colspan="2"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td width="' + pct + '%" height="3" style="width:' + pct + '%;height:3px;background:' + C_.GOLD + ';line-height:3px;font-size:0">&nbsp;</td>' +
    '<td height="3" style="height:3px;background:#E7DEC8;line-height:3px;font-size:0">&nbsp;</td></tr></table></td></tr></table>';
}

/* ---- PLAIN, PERSONAL NA EMAILS ----
 * Parang sulat mismo ni Manny: simpleng text, maiikling linya, walang banner o button.
 * Ang LAMAN ay nasa Drip.gs (AUTOREPLY_ at DRIP_). Dito lang ang pagbuo at pagpapadala.
 */

function para_(html) {
  return { t: stripHtml_(html), h: '<p style="margin:0 0 18px">' + html + '</p>' };
}

/** Detalye ng bahay na pinili ng lead (para sa linyang '{home}' sa auto-reply) */
function homePara_(model) {
  var m = MODELS[model];
  if (!m) return para_('Hindi mo pa nasasabi kung aling bahay ang gusto mo.<br>Okay lang yan. Tutulungan kitang pumili.');
  return para_('Napansin kong <b>' + esc_(model) + '</b> ang napili mo.<br>' + m.sqm + ' sqm · ' + esc_(m.type) +
               '<br><i>' + esc_(m.tag) + '</i>' + (m.reservation ? '<br>Reservation fee: <b>' + esc_(m.reservation) + '</b>' : ''));
}

/** Bawat linya sa `l` ng Drip.gs ay isang talata. Ang \n sa loob ng linya ay bagong linya sa loob ng talata. */
function plainParas_(item, ctx) {
  function raw(s) { return String(s).replace(/\{name\}/g, ctx.first).replace(/\{phone\}/g, CONFIG.PHONE_DISPLAY); }
  return item.l.map(function (line) {
    if (line === '{home}') return homePara_(ctx.model);
    return para_(esc_(raw(line)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'));
  });
}

/** Ipinapadala ang simpleng personal na email */
/** Mga bilog na larawan nina Manny at Annalyn (galing sa Photos.gs) bilang inline images ng email */
function teamPhotos_() {
  var inline = {}, cells = '';
  var ph = (typeof PHOTOS_ !== 'undefined') ? PHOTOS_ : {};
  function add(key, cid, alt, w, h, round) {
    var b64 = ph[key];
    if (!b64) return false;
    try { inline[cid] = Utilities.newBlob(Utilities.base64Decode(b64), 'image/jpeg', key + '.jpg'); } catch (e) { return false; }
    cells += '<td valign="middle" style="padding:0 14px 0 0"><img src="cid:' + cid + '" width="' + w + '" height="' + h + '" alt="' + alt + '" style="display:block;width:' + w + 'px;height:' + h + 'px;border-radius:' + (round ? '50%' : '8px') + ';border:2px solid #CDAE6F"></td>';
    return true;
  }
  if (!add('couple', 'couplePhoto', 'Manny at Annalyn', 132, 88, false)) {   // larawan nilang dalawa na magkasama
    add('manny', 'mannyPhoto', 'Manny', 64, 64, true);
    add('annalyn', 'annalynPhoto', 'Annalyn', 64, 64, true);
  }
  return { cells: cells, inline: inline, has: cells !== '' };
}

function sendPlain_(to, subject, preheader, paras, footNote) {
  var team = teamPhotos_();
  var html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="margin:0;padding:18px;background:#ffffff">' +
    '<span style="display:none;max-height:0;overflow:hidden;opacity:0">' + esc_(preheader) + '</span>' +
    '<div style="max-width:560px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#222222">' +
    paras.map(function (p) { return p.h; }).join('') +
    (team.has
      ? '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0"><tr>' + team.cells +
        '<td valign="middle" style="font-size:15px;line-height:1.6;color:#222222">Manny &amp; Annalyn<br><span style="color:#666666">' + esc_(CONFIG.BRAND) + ' · ' + esc_(CONFIG.TAGLINE) + '</span><br>' +
        '<a href="tel:' + CONFIG.PHONE_LINK + '" style="color:#666666">' + esc_(CONFIG.PHONE_DISPLAY) + '</a></td></tr></table>'
      : '<p style="margin:26px 0 0">Manny &amp; Annalyn<br><span style="color:#666666">' + esc_(CONFIG.BRAND) + ' · ' + esc_(CONFIG.TAGLINE) + '</span><br>' +
        '<a href="tel:' + CONFIG.PHONE_LINK + '" style="color:#666666">' + esc_(CONFIG.PHONE_DISPLAY) + '</a></p>') +
    '<p style="margin:30px 0 0;font-size:12px;line-height:1.6;color:#999999">' + esc_(footNote) + ' ' +
    '<a href="' + esc_(replyLink_('STOP', 'STOP')) + '" style="color:#999999">Mag-unsubscribe</a></p>' +
    '</div></body></html>';
  var plain = paras.map(function (p) { return p.t; }).join('\n\n') +
    '\n\nManny & Annalyn\n' + CONFIG.BRAND + ' · ' + CONFIG.TAGLINE + '\n' + CONFIG.PHONE_DISPLAY + '\n\n' + footNote;
  var mail = { to: to, replyTo: CONFIG.OWNER_EMAIL, name: 'Manny & Annalyn · ' + CONFIG.BRAND, subject: subject, body: plain, htmlBody: html };
  if (team.has) mail.inlineImages = team.inline;
  MailApp.sendEmail(mail);
}

function previewText_(item, first) {
  var line = String(item.l[1] || item.l[0] || '').replace(/\{name\}/g, first).replace(/\\n/g, ' ');
  return line.length > 90 ? line.slice(0, 87) + '...' : line;
}

/** Ang email na ipinapadala agad pagka-submit ng form */
function sendAutoReply_(name, email, model) {
  var first = firstName_(name);
  var item = AUTOREPLY_;
  sendPlain_(email, String(item.s).replace(/\{name\}/g, first), previewText_(item, first), plainParas_(item, { first: first, model: model }),
    'Natanggap mo ang email na ito dahil nag-fill up ka ng form sa website namin. Ayaw mo na bang makatanggap? I-reply mo lang ang STOP.');
}

/** Ang email ng Araw `day` (1 hanggang 30) sa series */
function sendDrip_(day, name, email, model) {
  var item = DRIP_[day - 1];
  if (!item) return false;
  var first = firstName_(name);
  sendPlain_(email, String(item.s).replace(/\{name\}/g, first), previewText_(item, first), plainParas_(item, { first: first, model: model }),
    'Natanggap mo ang email na ito dahil nag-inquire ka sa Alara Village. Ayaw mo na bang makatanggap? I-reply mo lang ang STOP.');
  return true;
}

/** Notification sa iyo kapag may bagong lead */
function notifyOwner_(lead, sheetUrl) {
  var tel = String(lead.mobile || '').replace(/[^\d+]/g, '');
  function row(label, valueHtml) {
    return '<tr><td width="130" valign="top" style="width:130px;padding:13px 0;border-top:1px solid #E7DEC8;font-family:' + SANS_ + ';font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:' + C_.GOLD_D + ';font-weight:bold">' + label + '</td>' +
           '<td style="padding:13px 0;border-top:1px solid #E7DEC8;font-family:' + SERIF_ + ';font-size:17px;line-height:1.5;color:' + C_.INK + '">' + valueHtml + '</td></tr>';
  }
  function btn(label, href, dark) {
    return '<td style="padding:0 10px 10px 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="' + (dark ? C_.INK : '#FFFFFF') + '" style="background:' + (dark ? C_.INK : '#FFFFFF') + ';border:1px solid ' + (dark ? C_.INK : C_.GOLD_D) + '">' +
           '<a href="' + esc_(href) + '" style="display:inline-block;padding:14px 22px;font-family:' + SANS_ + ';font-size:11px;font-weight:bold;letter-spacing:.2em;text-transform:uppercase;color:' + (dark ? C_.GOLD : C_.GOLD_D) + ';text-decoration:none">' + label + '</a></td></tr></table></td>';
  }
  var body =
    '<div style="font-family:' + SANS_ + ';font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:' + C_.GOLD_D + ';font-weight:bold">May bagong lead</div>' +
    '<p style="margin:10px 0 6px;font-family:' + SERIF_ + ';font-size:36px;line-height:1.15;color:' + C_.INK + '">' + esc_(lead.name) + '</p>' +
    (lead.model ? '<p style="margin:0 0 24px"><span style="display:inline-block;padding:6px 14px;background:' + C_.GREEN + ';font-family:' + SANS_ + ';font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:' + C_.GOLD + '">' + esc_(lead.model) + '</span></p>' : '<div style="height:18px"></div>') +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">' +
    row('Mobile', '<a href="tel:' + esc_(tel) + '" style="color:' + C_.GOLD_D + ';font-weight:bold;text-decoration:none">' + esc_(lead.mobile) + '</a>') +
    row('Email', '<a href="mailto:' + esc_(lead.email) + '" style="color:' + C_.GOLD_D + ';text-decoration:none">' + esc_(lead.email) + '</a>') +
    row('Bahay', esc_(lead.model || '-')) +
    row('Budget / Notes', esc_(lead.notes || '-')) +
    '<tr><td colspan="2" style="border-top:1px solid #E7DEC8;font-size:0;line-height:0">&nbsp;</td></tr></table>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr>' +
    btn('Tawagan ngayon', 'tel:' + tel, true) + btn('Mag-email', 'mailto:' + lead.email + '?subject=' + encodeURIComponent('Alara Village: ' + firstName_(lead.name)), false) +
    '</tr></table>' +
    (sheetUrl ? '<p style="margin:6px 0 0;font-family:' + SANS_ + ';font-size:13px"><a href="' + esc_(sheetUrl) + '" style="color:' + C_.GOLD_D + '">Buksan ang Leads Sheet →</a></p>' : '') +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px"><tr><td style="padding:18px 22px;background:' + C_.SOFT + ';border-left:3px solid ' + C_.GOLD + ';font-family:' + SANS_ + ';font-size:13px;line-height:1.7;color:#4A5A50">' +
    'Naka-save na ito sa Google Sheet, at nakapadala na ang auto-reply sa lead. Kapag na-contact mo na siya, palitan ang <b>Status</b> sa Sheet ng <i>Contacted</i> para huminto ang mga automatic follow-up.</td></tr></table>';
  var team = teamPhotos_();
  if (team.has) {
    body += '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:30px"><tr>' + team.cells +
      '<td valign="middle" style="font-family:' + SANS_ + ';font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:' + C_.MUTE + '">Manny &amp; Annalyn<br><span style="letter-spacing:.1em;color:' + C_.GOLD_D + '">' + esc_(CONFIG.BRAND) + '</span></td></tr></table>';
  }
  var text = 'May bagong lead:\n\nName: ' + lead.name + '\nMobile: ' + lead.mobile + '\nEmail: ' + lead.email +
             '\nHome: ' + (lead.model || '-') + '\nNotes: ' + (lead.notes || '-') + '\n\nSheet: ' + sheetUrl;
  var mail = {
    to: CONFIG.OWNER_EMAIL,
    replyTo: lead.email,
    name: CONFIG.BRAND + ' Leads',
    subject: 'New Alara Village lead: ' + lead.name + (lead.model ? ' (' + lead.model + ')' : ''),
    body: text,
    htmlBody: layout_('New lead: ' + lead.name, body, '', false)
  };
  if (team.has) mail.inlineImages = team.inline;
  MailApp.sendEmail(mail);
}

/* ====================== UTILITIES ====================== */

function clean_(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max); }
function isEmail_(e) { return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(String(e || '')); }
function firstName_(n) { var f = String(n || '').trim().split(/\s+/)[0]; return f || 'Kaibigan'; }
function modelName_(raw) { var n = String(raw || '').split('·')[0].trim(); return MODELS[n] ? n : ''; }
/** Iwas formula injection sa Sheets */
function safeCell_(v) { v = String(v || ''); return /^[=+\-@]/.test(v) ? "'" + v : v; }
function esc_(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
