/* ============ 1) PALITAN DITO ANG MGA LARAWAN ============
   Ilagay ang direct image URL (naka-host sa Google Drive/Imgur/Cloudinary/etc.).
   Kapag walang laman, placeholder ang lalabas. */
var IMAGES = {
  hero: '',      // hero model house
  siteplan: '',  // site development plan
  step1: '/assets/how-it-works-1.jpg',     // How It Works 1: pag-uusap / computation
  step2: '/assets/how-it-works-2.jpg',     // How It Works 2: community visit
  step3: '/assets/how-it-works-3.jpg',     // How It Works 3: reserve at papeles
  step4: '/assets/how-it-works-4.jpg',     // How It Works 4: susi / bagong bahay
  amenitymap: '/assets/alara-site-plan.jpg',   // site plan ng Amenities section
  couple: '/assets/manny-annalyn.png',   // larawan nina Manny at Annalyn na magkasama
  manny: '',        // larawan ni Manny (para sa seksyong Your Partners)
  annalyn: '',      // larawan ni Annalyn
  veta: '/assets/home-veta.jpg', zila: '/assets/home-zila.jpg', raya: '/assets/home-raya.jpg',   // bawat model house
  yana: '/assets/home-yana.jpg'
};

/* Floor plan (blueprint) images – ilagay ang URL ng larawan ng floor plan ng bawat bahay */
var PLANS = { veta: '/assets/floorplan-veta.jpg', zila: '/assets/floorplan-zila.jpg', raya: '/assets/floorplan-raya.jpg', yana: '/assets/floorplan-yana.jpg' };

/* ============ LOADING SCREEN LOGOS ============
   Ilagay dito ang larawan (data:image/... base64 o direct image URL).
   Kapag walang laman, text na pangalan ang lalabas bilang kapalit. */
var LOGOS = {
  alara: '',     // logo ng Alara Village
  partners: ''   // logo / larawan ng Homes Partners (agent mo)
};
/* ============ VIDEO NG BAWAT AMENITY ============
   Ilagay dito ang link ng video ng bawat lugar sa site plan. Pwede ang:
   - YouTube (mas mainam ang "Unlisted"): https://youtu.be/XXXXXXXXXXX
   - Google Drive (i-share bilang "Anyone with the link"): https://drive.google.com/file/d/XXXX/view
   - Facebook (public na video): https://www.facebook.com/.../videos/XXXX
   - Direktang file na .mp4: https://.../video.mp4
   - 'local:gate' = video na inilagay sa Apps Script mismo (file na Vid_gateVid_gate), laging 720p. Tingnan ang VIDEO_FILES_ sa Code.gs.
   - 'local:gate|https://youtu.be/XXXX' = sariling video muna; kapag hindi ma-load, YouTube ang gagamitin.
   Kapag walang laman ('') ang isang lugar, lalabas ang "Video coming soon" kasama ang larawan at paliwanag. */
var VIDEOS = {
  midpark1: 'https://youtu.be/FwcEI_PAlwE',    // Midpark 1
  midpark2: 'https://youtu.be/UMELJAAddpA',    // Midpark 2
  forest: 'https://youtu.be/8Y4YRqQonXs',      // Forest Park
  play: 'https://youtu.be/hfYruXsIVd8',        // Play Area at Tri-Court
  clubhouse: 'https://youtu.be/N0FexJPXn2Y',   // Clubhouse at Pool
  gate: 'local:gate|https://youtu.be/vCs9ofxyaow'   // Gated Entrance (video na nasa Apps Script mismo: file na Vid_gateVid_gate)
};
