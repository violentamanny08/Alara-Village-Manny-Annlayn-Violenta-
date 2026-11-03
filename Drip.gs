/**
 * DRIP.GS: ANG 30-ARAW NA EMAIL SERIES
 *
 * Isang email kada araw sa loob ng 30 araw, simula sa araw pagkatapos mag-submit ng lead.
 * Simpleng sulat ang itsura: isang maikling linya kada talata, walang banner at walang button.
 * Ito ang LAMAN ng bawat email. Ang pagpapadala at disenyo ay nasa Code.gs.
 *
 * Paano mag-edit:
 *  - s = subject
 *  - l = mga linya ng email. Bawat linya ay hiwalay na talata.
 *  - {name} = unang pangalan ng lead, {phone} = number mo, **ganito** = bold
 *  - Para sa listahan sa loob ng iisang talata, gamitin ang \n (bagong linya).
 *  - Iwasan ang tuwid na apostrophe ('). Gamitin ang ’ at ang “ ”.
 */

var DRIP_ = [

/* ===================== LINGGO 1: TIWALA AT MGA UNANG TANONG (Araw 1-7) ===================== */

// 1
{ s: '{name}, kumusta?', l: [
  'Hi {name}, si Manny ito.',
  'Kasama ko si Annalyn dito sa Homes Partners PH.',
  'Nag-inquire ka kahapon tungkol sa Alara Village, kaya naisip kong mag-hi.',
  'Alam kong baka busy ka. Okay lang yun.',
  'Sa susunod na 30 araw, magpapadala ako ng isang maikling email araw-araw.',
  'Walang kulit, promise.',
  'Puro kapaki-pakinabang lang: paano binabayaran ang bahay, ano ang mga papeles, at ano ang buhay sa Alara.',
  'Basahin mo lang kapag may oras ka.',
  'Pero kung gusto mong mauna...',
  'Reply ka lang ng buwanang budget mo, kahit approximate.',
  'Ako na ang bahala sa computation.',
  'At kung ayaw mo namang makatanggap ng mga email ko, reply ka lang ng “STOP” at ititigil ko agad.',
  'No hard feelings!',
  'Hoping to hear from you, {name}.'
]},

// 2
{ s: '{name}, magkano ba talaga ang kailangan?', l: [
  'Hi {name}, si Manny ulit.',
  'May tanong akong laging naririnig:',
  '“Magkano ba talaga ang kailangan ko para magkabahay?”',
  'Honest na sagot: depende.',
  'Pero karaniwang may tatlong bahagi:',
  '1. Reservation, pang-reserba ng bahay\n2. Downpayment, ang paunang bayad\n3. Monthly, ang buwanang hulog',
  'Iba-iba ang numero sa bawat bahay at bawat paraan ng pagbabayad.',
  'Kaya ayokong manghula dito sa email.',
  'Mas gusto kong ipakita ang computation na para sa budget MO.',
  'Libre yun, walang obligasyon.',
  'Kung gusto mo, reply ka lang ng:',
  '“Budget ko: ___ kada buwan.”',
  'Yun lang, super simple!',
  'Hihintayin ko ang reply mo, {name}.'
]},

// 3
{ s: '{name}, hanggang kailan pa magre-rent?', l: [
  'Hi {name}, si Manny.',
  'Tanong lang ito, hindi para pilitin ka.',
  'Hanggang kailan mo pa gustong magbayad ng rent?',
  'Hindi ko sinasabing masama ang magrenta. Valid yan, lalo na kung may dahilan.',
  'Pero naisip ko lang...',
  'Bawat buwan, may lumalabas na pera.',
  'Sa dulo ng taon, resibo lang ang hawak mo, hindi bahay.',
  'Hindi ko sinasabing bumili ka agad.',
  'Ang sinasabi ko lang, ikumpara mo ang numbers.',
  'Magkano ang rent mo ngayon?\nMagkano na ito sa loob ng 5 o 10 taon?\nMagkano ang hulog kung may sarili ka nang bahay?',
  'Kapag nakita mo ang dalawa, mas madali ang desisyon.',
  'Ako na ang gagawa ng paghahambing.',
  'Reply ka lang ng: “Rent ko: ___”',
  'Reply ka lang, {name}.'
]},

// 4
{ s: '{name}, paano ba binabayaran ang bahay?', l: [
  'Hi {name}, si Manny ulit.',
  'Alam mo ba, hindi lang iisa ang paraan ng pagbili ng bahay.',
  'Karaniwang ito ang mga pagpipilian:',
  'Pag-IBIG housing loan\nBank loan\nDeveloper financing, kung available\nCash',
  'Magkakaiba ang requirements at proseso ng bawat isa.',
  'Hindi mo kailangang pag-aralan lahat ngayon.',
  'Dyan na ako papasok.',
  'Sasabihin ko sa iyo kung alin ang pinakaswak sa sitwasyon mo.',
  'Para malaman ko, sagutin mo lang itong dalawa:',
  '1. May Pag-IBIG ka ba?\n2. Empleyado ka ba, may negosyo, o OFW?',
  'Reply ka lang ng dalawang sagot na yan.',
  'Super simple!',
  'Hihintayin ko ang reply mo, {name}.'
]},

// 5
{ s: '{name}, ang dami raw papeles?', l: [
  'Hi {name}, si Manny.',
  'Isa sa mga dahilan kung bakit umaatras ang marami: ang dami raw papeles.',
  'Totoo, nakakalito.',
  'Heto ang karaniwang hinihingi:',
  'Valid ID\nPatunay ng kita (payslip, certificate of employment, o ITR at business papers)\nTIN\nIba pang dokumento, depende sa uri ng loan',
  'Iba-iba ang eksaktong listahan depende sa trabaho mo at sa paraan ng pagbabayad.',
  'Kaya hindi ko ibibigay ang listahan ng lahat.',
  'Ibibigay ko lang ang listahan para sa IYO.',
  'Isang beses lang, nakasulat, malinaw.',
  'Hindi mo kailangang kumpletuhin lahat bago ka magtanong.',
  'Reply ka lang ng: “Empleyado ako,” “May negosyo ako,” o “OFW ako.”',
  'Ako na ang magsasabi ng susunod.',
  'Reply ka lang, {name}.'
]},

// 6
{ s: '{name}, paano kung ma-reject?', l: [
  'Hi {name}, si Manny.',
  'Aaminin ko, ito ang pinakamadalas kong marinig:',
  '“Paano kung hindi ako ma-approve?”',
  'Naiintindihan ko ang kabang yan.',
  'Karaniwang tinitingnan ng mga nagpapautang ang kita mo, ang mga kasalukuyang utang mo, at ang history ng pagbabayad mo.',
  'Pero hindi ibig sabihing “hindi” na habambuhay kapag hindi ka agad na-approve.',
  'Madalas, may paraan.',
  'Pwedeng ayusin ang isang bagay, magdagdag ng co-borrower, o pumili ng ibang paraan ng pagbabayad.',
  'Mas mabuting malaman ang sagot ngayon kaysa manghula habang nagre-rent.',
  'Walang commitment, silipin lang natin ang sitwasyon mo.',
  'Kung gusto mo, reply ka lang ng:',
  '“Silipin natin.”',
  'Walang samaan ng loob kung hindi pa.',
  'Hoping to see your reply, {name}.'
]},

// 7
{ s: '{name}, kilalanin ang Veta', l: [
  'Hi {name}, si Manny.',
  'Simula ngayon, ipapakilala ko sa iyo ang mga bahay, isa-isa.',
  'Una, ang Veta.',
  '“Where bonds blossom.”',
  'Ito ay 85 sqm na 2-storey single detached home.',
  'Ang laman:',
  'Living area, dining area at kitchen\nMain bedroom na may sariling toilet and bath, at lanai\nPowder room at 2 toilet and bath\n2-car park',
  'Para sa pamilyang gustong magkaroon ng sarili nilang bahay, mainit at komportable.',
  'Ang reservation fee ng Veta ay ₱40,000.',
  'Gusto mo bang makita ang floor plan at inclusions?',
  'Reply ka lang ng:',
  '“Floor plan ng Veta.”',
  'Ako na ang magpapadala.',
  'Hihintayin ko, {name}.'
]},

/* ===================== LINGGO 2: ANG MGA BAHAY AT ANG COMMUNITY (Araw 8-14) ===================== */

// 8
{ s: '{name}, kilalanin ang Zila', l: [
  'Hi {name}, si Manny.',
  'Ang susunod: ang Zila.',
  '“Where families flourish.”',
  'Ito ay 96 sqm na 2-storey partially attached home.',
  'Ang laman:',
  'Living area, dining area at kitchen\n1 guest room, 2 bedrooms, ang main bedroom ay may main toilet and bath\nLanai\n2 toilet and bath\n2-car park',
  'May guest room, kaya swak kung may bisita o kamag-anak na madalas dumadalaw.',
  'Ang reservation fee ng Zila ay ₱40,000.',
  'Gusto mo bang makita ang floor plan?',
  'Reply ka lang ng:',
  '“Floor plan ng Zila.”',
  'Hoping to hear from you, {name}.'
]},

// 9
{ s: '{name}, kilalanin ang Raya', l: [
  'Hi {name}, si Manny.',
  'Ngayon, ang Raya.',
  '“Space to gather.”',
  'Ito ay 110 sqm na 2-storey na tahanan.',
  'Para sa mga pamilyang mahilig magtipon.',
  'Yung tipong lahat ay gustong magkakasama sa iisang bubong, tuwing Pasko, birthday, o kahit simpleng Linggo lang.',
  'Maluwag at handa para sa dami ng tao.',
  'Available ang floor plan at inclusions kapag hiniling mo.',
  'Reply ka lang ng:',
  '“Floor plan ng Raya.”',
  'Ako na ang bahala.',
  'Reply ka lang, {name}.'
]},

// 10
{ s: '{name}, kilalanin ang Yana', l: [
  'Hi {name}, si Manny.',
  'At ang pinakamalaki sa buong village: ang Yana.',
  '“The grandest address.”',
  'May 130 sqm na floor area, 2-storey.',
  'Para sa pamilyang gustong lahat ay nasa kanila.',
  'Kung ito ang pangarap mong bahay, sabihin mo lang.',
  'Hindi masamang mangarap, at hindi rin masamang magtanong.',
  'Ipapadala ko ang floor plan at ang computation, para makita mo kung gaano ito kalapit sa budget mo.',
  'Reply ka lang ng:',
  '“Floor plan ng Yana.”',
  'Walang obligasyon, promise.',
  'Hihintayin ko, {name}.'
]},

// 11
{ s: '{name}, alin ang swak sa pamilya mo?', l: [
  'Hi {name}, si Manny.',
  'Nakilala mo na ang apat na bahay.',
  'Ngayon, tanong ko: alin kaya ang para sa iyo?',
  'Sagutin mo sa isip:',
  'Ilan kayo sa bahay?\nMay anak o magulang bang titira sa inyo?\nMay nagtatrabaho ba mula sa bahay?\nIlan ang sasakyan ninyo?',
  'Mula sa mga sagot na yan, madali na:',
  'Veta, 85 sqm: compact pero kumpleto\nZila, 96 sqm: may guest room\nRaya, 110 sqm: mas maluwag para sa pagtitipon\nYana, 130 sqm: ang pinakamalaki sa village',
  'Kung ayaw mong mag-isip, ako na ang pipili para sa iyo.',
  'Reply ka lang ng:',
  '“Kami ay ___ sa bahay.”',
  'Pipili ako ng top 2 na swak sa inyo.',
  'Reply ka lang, {name}.'
]},

// 12
{ s: '{name}, ligtas ba ang Alara?', l: [
  'Hi {name}, si Manny.',
  'Isang tanong na laging dumarating, lalo na mula sa mga magulang: ligtas ba?',
  'Ang Alara Village ay may iisang guarded gate at perimeter security para sa buong village.',
  'Isipin mo...',
  'Pag-uwi mo ng gabi, alam mong may nagbabantay.',
  'Iba ang tulog kapag ganun.',
  'Siyempre, ang seguridad ay hindi lang gate.',
  'Pero magandang simula yan para sa peace of mind ng buong pamilya.',
  'Mas maganda kung makita mo mismo.',
  'Libre ang viewing, walang obligasyon.',
  'Reply ka lang ng:',
  '“Gusto kong mag-viewing.”',
  'Ako na ang mag-aayos.',
  'Hoping to hear from you, {name}.'
]},

// 13
{ s: '{name}, pool, gym at clubhouse', l: [
  'Hi {name}, si Manny.',
  'Isipin mo ito:',
  'Hapon na. Tapos na ang trabaho.',
  'Ilang minuto lang ang layo ng pool para sa mga bata.',
  'May resort-style na clubhouse at swimming pool sa Alara Village.',
  'May gym din para sa iyo.',
  'Lahat sa loob ng community, hindi mo kailangang bumiyahe pa.',
  'Hindi lang ito luho.',
  'Ito ang paraan para maging bahagi ng araw-araw ninyo ang pag-eehersisyo at paglalaro.',
  'Gusto mo bang makita ito nang personal?',
  'Reply ka lang ng:',
  '“Gusto kong makita ang clubhouse.”',
  'Hihintayin ko, {name}.'
]},

// 14
{ s: '{name}, ang Forest Park', l: [
  'Hi {name}, si Manny.',
  'May bahagi ng Alara Village na sadyang iniwang luntian.',
  'Ang Forest Park, sa gilid ng Ylang-Ylang River.',
  'Para sa lakad tuwing umaga.',
  'Para sa pahinga tuwing hapon.',
  'Para sa lilim ng mga puno.',
  'Hindi mo kailangang lumayo para huminga.',
  'Sa totoo lang, yan ang isa sa mga paborito kong parte ng village.',
  'Gusto mo bang malaman kung nasaan ito sa site plan?',
  'Reply ka lang ng:',
  '“Site plan, please.”',
  'Ipapadala ko agad.',
  'Reply ka lang, {name}.'
]},

/* ===================== LINGGO 3: PARA SA PAMILYA, LOKASYON AT ANG GUSTO MO (Araw 15-21) ===================== */

// 15
{ s: '{name}, para sa mga bata', l: [
  'Hi {name}, si Manny.',
  'Mas masaya ang mga bata kapag may malapit na lugar para maglaro.',
  'Sa Alara Village:',
  'Play Area, isang playground para sa mga bata, malapit sa pangunahing park\nTri-Court, basketball, volleyball at tennis sa iisang lugar\nMga pocket park na pwedeng lakaran mula sa bahay',
  'Dahil malapit ang play area sa pangunahing park, madali silang tanawin habang naglalaro.',
  'Hindi mo na kailangang ihatid sa malayo para lang makapaglaro sila.',
  'Para sa akin, yan ang pinakamagandang regalo sa mga bata.',
  'Hindi gadgets. Hindi tablet.',
  'Isang lugar na pwede silang tumakbo.',
  'Gusto mo bang makita kung nasaan ang mga ito?',
  'Reply ka lang ng:',
  '“Site plan, please.”',
  'Hoping to hear from you, {name}.'
]},

// 16
{ s: '{name}, saan ba ang Alara Village?', l: [
  'Hi {name}, si Manny.',
  'Nasa Imus, Cavite ang Alara Village.',
  'Alam kong isa ito sa mga unang tanong:',
  '“Gaano ba kalayo sa trabaho ko?”',
  'Hindi ako magsasabi ng “malapit lang yan” kung hindi ako sigurado.',
  'Mas gusto kong ikaw mismo ang makakita at makasubok ng biyahe.',
  'Pero para matulungan kita, kailangan kong malaman:',
  'Saan ang trabaho mo?\nSaan nag-aaral ang mga anak mo?\nAnong oras ka karaniwang umaalis ng bahay?',
  'Kapag alam ko na yan, matutulungan kitang timbangin kung bagay sa araw-araw ninyo ang lokasyon.',
  'Reply ka lang ng:',
  '“Ang trabaho ko ay sa ___.”',
  'Hihintayin ko ang reply mo, {name}.'
]},

// 17
{ s: '{name}, isang araw sa Alara', l: [
  'Hi {name}, si Manny.',
  'Subukan mong isipin ito.',
  'Umaga: maglalakad ka sa Forest Park bago pumasok.',
  'Hapon: maglalaro ang mga bata sa play area.',
  'Gabi: hapunan ng buong pamilya, tapos langoy o pahinga.',
  'Hindi ito pangarap lang.',
  'Ito ang buhay na pwede mong simulan.',
  'Pero siyempre, hindi ako ang magsasabi kung para sa iyo ito.',
  'Ikaw ang makakaalam, kapag nakita mo na mismo.',
  'Kung gusto mong subukan, reply ka lang ng:',
  '“Gusto kong mag-viewing.”',
  'Libre ito, at walang obligasyong bumili.',
  'Hoping to see your reply, {name}.'
]},

// 18
{ s: '{name}, ano ang pinakamahalaga sa iyo?', l: [
  'Hi {name}, si Manny.',
  'Mahigit dalawang linggo na mula nang mag-inquire ka.',
  'Gusto kong tumpak ang maibigay ko sa iyo.',
  'Kaya isang tanong lang:',
  'Alin ang pinakamahalaga sa iyo sa isang bahay?',
  '1. Presyo at hulog\n2. Laki ng bahay\n3. Seguridad\n4. Amenities para sa mga bata\n5. Lokasyon',
  'Reply ka lang ng #1 at #2 mo.',
  'Halimbawa: “1 at 3.”',
  'Doon ako magbabase ng rekomendasyon.',
  'Dalawang numero lang yan.',
  'Super simple!',
  'Hihintayin ko ang reply mo, {name}.'
]},

// 19
{ s: '{name}, ano ba ang reservation fee?', l: [
  'Hi {name}, si Manny.',
  'Madalas itanong sa akin:',
  '“Ano ba yung reservation fee?”',
  'Ito ang paunang halaga para ireserba ang bahay na gusto mo.',
  'Para sa Veta at Zila, ang reservation fee ay ₱40,000.',
  'Pero bago ka mag-reserve, ipapaliwanag ko muna ang lahat ng terms.',
  'Para klaro sa iyo kung ano ang kasunduan.',
  'Walang dapat mag-reserve nang hindi naiintindihan ang pinipirmahan.',
  'Yan ang paninindigan ko.',
  'May tanong ka ba tungkol dito?',
  'Reply ka lang ng tanong mo.',
  'Ako mismo ang sasagot.',
  'Hoping to hear from you, {name}.'
]},

// 20
{ s: '{name}, paano maiiwasan ang hidden charges?', l: [
  'Hi {name}, si Manny.',
  'Alam kong isa sa mga kinakatakutan mo ay ang hidden charges.',
  'Ang pinakamagandang proteksyon: magtanong ng tama.',
  'Itanong mo ito, sa amin man o sa iba:',
  'Magkano ang reservation at downpayment?\nAno ang buwanang hulog, at hanggang kailan?\nMay ibang bayarin ba bukod sa presyo ng bahay?\nMay regular na bayarin ba sa community?\nAno ang kasama sa presyo, at ano ang hindi?',
  'Sa akin, sasagutin ko ang lahat ng yan, nakasulat, bago ka magdesisyon.',
  'Walang itatago.',
  'Reply ka lang ng:',
  '“Gusto ko ng listahan ng lahat ng bayarin.”',
  'Hihintayin ko, {name}.'
]},

// 21
{ s: '{name}, OFW ka ba o may negosyo?', l: [
  'Hi {name}, si Manny.',
  'Hindi lang empleyado ang pwedeng magkabahay.',
  'Kung ikaw ay:',
  'OFW\nSelf-employed o may negosyo\nFreelancer\nEmpleyado sa pribado o gobyerno',
  'May paraan, madalas.',
  'Iba-iba lang ang papeles at proseso para sa bawat isa.',
  'Hindi mo kailangang hulaan.',
  'Sabihin mo lang kung alin ka, at ipapaliwanag ko ang karaniwang kailangan.',
  'Reply ka lang ng:',
  '“OFW ako,” “May negosyo ako,” “Freelancer ako,” o “Empleyado ako.”',
  'Yun lang!',
  'Reply ka lang, {name}.'
]},

/* ===================== LINGGO 4: MGA TAKOT, PROSESO AT VIEWING (Araw 22-27) ===================== */

// 22
{ s: '{name}, paano kung hindi ako ma-approve?', l: [
  'Hi {name}, si Manny.',
  'Pag-usapan natin ang pinakamalaking takot.',
  'Paano kung hindi ka ma-approve sa unang subok?',
  'May mga pwedeng gawin:',
  'Bayaran o ayusin ang kasalukuyang mga utang\nMagdagdag ng co-borrower\nSumubok ng ibang paraan ng pagbabayad\nMag-ipon pa at subukan ulit mamaya',
  'Wala sa mga ito ang katapusan.',
  'Karaniwan, unang hakbang lang yan.',
  'At hindi ka mag-isa dito.',
  'Kasama mo kami sa bawat hakbang.',
  'Kung gusto mong silipin ang sitwasyon mo, reply ka lang ng:',
  '“Silipin natin.”',
  'Walang commitment.',
  'Hihintayin ko, {name}.'
]},

// 23
{ s: '{name}, mula reservation hanggang susi', l: [
  'Hi {name}, si Manny.',
  'Ito ang karaniwang daan, mula simula hanggang matanggap mo ang susi:',
  '1. Magtanong at kumuha ng computation. Libre, walang obligasyon.\n2. Bisitahin ang community.\n3. Mag-reserve at ayusin ang papeles. Kasama mo kami sa bawat dokumento.\n4. Pag-apruba at pirmahan. Ipapaliwanag namin bago ka pumirma.\n5. Ang susi ay sa iyo.',
  'Hindi mo kailangang tumalon sa dulo.',
  'Isang hakbang lang muna ang kailangan mo ngayon: ang una.',
  'Reply ka lang ng buwanang budget mo.',
  'Yun na ang simula.',
  'Hoping to see your reply, {name}.'
]},

// 24
{ s: '{name}, ano ang mangyayari sa viewing?', l: [
  'Hi {name}, si Manny.',
  'Maraming kinakabahan sa unang viewing.',
  'Kaya sasabihin ko na ngayon kung ano ang aasahan mo:',
  'Lilibutin natin ang community: gate, parks, pool at clubhouse\nMakikita mo ang mga bahay na pinagpipilian\nPag-uusapan natin ang computation, kung gusto mo\nSasagutin ko ang lahat ng tanong mo',
  'Libre ito at walang obligasyong bumili.',
  'Wala kang kailangang dalhin.',
  'Pwede kang sumama kasama ang pamilya.',
  'Mas maganda nga kung kasama sila.',
  'Reply ka lang ng:',
  '“Gusto kong mag-viewing.”',
  'Tapos sabihin mo kung anong araw ka libre.',
  'Hoping to hear from you, {name}.'
]},

// 25
{ s: '{name}, mga bagay na hindi namin gagawin', l: [
  'Hi {name}, si Manny.',
  'Gusto kong malaman mo ang pangako namin ni Annalyn.',
  'Hindi namin gagawin ang mga ito:',
  'Pilitin kang magdesisyon agad\nItago ang mga bayarin\nIbenta sa iyo ang bahay na hindi kaya ng budget mo\nBombahin ka ng tawag at text',
  'Ang gagawin namin:',
  'Pakinggan ka\nIpaliwanag ang lahat nang malinaw\nHayaang ikaw ang magdesisyon',
  'Sa totoo lang, mas gusto kong mawalan ng isang benta kaysa magkaroon ng pamilyang nahihirapan.',
  'Yan ang pinaniniwalaan ko.',
  'May tanong ka ba tungkol sa amin?',
  'Reply ka lang.',
  'Reply ka lang, {name}.'
]},

// 26
{ s: '{name}, isang maliit na hakbang lang', l: [
  'Hi {name}, si Manny.',
  'Isang bagay lang ang hihilingin ko ngayon.',
  'Hindi bahay.',
  'Hindi pirma.',
  'Hindi pera.',
  'Isa lang: ang buwanang budget mo.',
  'Pagkatapos, makikita mo kung kasya, kung ano ang kailangan, at kung ano ang susunod.',
  'Kahit approximate lang.',
  'Halimbawa: “Mga 20k kada buwan.”',
  'Yun lang, super simple!',
  'Ako na ang gagawa ng iba.',
  'Reply ka lang, {name}.'
]},

// 27
{ s: '{name}, nasaan ka na sa journey?', l: [
  'Hi {name}, si Manny.',
  'Halos isang buwan na mula nang mag-inquire ka.',
  'Gusto ko lang malaman kung nasaan ka na.',
  'Reply ka lang ng numero:',
  '1: Nagtitingin pa lang ako\n2: Naghahambing ako ng mga proyekto\n3: Nag-iipon o inaayos ko pa ang budget\n4: Gusto ko nang makita ang bahay',
  'Isang numero lang.',
  'Okay lang kahit alin diyan.',
  'Wala akong huhusgahan.',
  'Gusto ko lang malaman kung paano kita matutulungan.',
  'Hoping to see your reply, {name}.'
]},

/* ===================== HULING LINGGO: TAPAT NA USAPAN AT IMBITASYON (Araw 28-30) ===================== */

// 28
{ s: '{name}, baka hindi para sa iyo ang Alara', l: [
  'Hi {name}, si Manny.',
  'Gusto kong maging tapat sa iyo.',
  'Hindi para sa lahat ang Alara Village.',
  'Baka bagay ito sa iyo kung:',
  'Gusto mo ng gated community na may amenities\nMahalaga sa iyo ang seguridad at lugar para sa mga bata\nHanda kang bumiyahe papunta sa Imus, Cavite',
  'Baka hindi ito bagay kung:',
  'Kailangan mong nasa tapat ng trabaho mo sa Maynila\nMas gusto mo ng condo sa gitna ng siyudad',
  'Mas gusto kong malaman mo ito ngayon kaysa pagsisihan mo mamaya.',
  'Pero kung bagay naman sa iyo, simulan natin sa isang computation.',
  'Reply ka lang ng:',
  '“Bagay sa akin.”',
  'O kung hindi, sabihin mo rin.',
  'Okay lang, walang hard feelings.',
  'Hoping to hear from you, {name}.'
]},

// 29
{ s: '{name}, gusto mo bang makita nang personal?', l: [
  'Hi {name}, si Manny.',
  'Isang email na lang pagkatapos nito, at matatapos na ang seryeng ito.',
  'Bago iyon, isang imbitasyon lang.',
  'Halika, tingnan natin.',
  'Libre ang viewing.\nLibre ang computation.\nWalang obligasyong bumili.',
  'Maglakad ka sa mga kalye, tingnan ang pool, gym at clubhouse.',
  'Tapos isipin mo kung dito ba uuwi ang pamilya mo araw-araw.',
  'Kung oo, mas madali na ang susunod.',
  'Kung hindi, mas malinaw na rin sa iyo.',
  'Sabihin mo lang kung anong araw ka libre.',
  'Reply ka lang ng:',
  '“Libre ako sa ___.”',
  'Aayusin ko ang private viewing.',
  'Hoping to see your reply, {name}.'
]},

// 30
{ s: '{name}, gusto mo pa bang makarinig sa amin?', l: [
  'Hi {name}, si Manny.',
  'Ito na ang huling email sa seryeng ito.',
  'Salamat sa 30 araw, kahit minsan lang ang pagbabasa mo.',
  'Gusto ko lang itanong...',
  'Gusto mo pa bang makarinig sa amin tungkol sa Alara Village?',
  'Kung oo, reply ka lang ng:',
  '“Nandito pa ako.”',
  'Yun lang, super simple!',
  'At kung hindi pa ito ang tamang panahon, okay lang din yun.',
  'Baka busy sa trabaho, may ibang priorities, o nasa ibang season ka na ng buhay mo.',
  'No hard feelings!',
  'Hindi na kita ie-email pagkatapos nito, maliban kung ikaw mismo ang mag-reply.',
  'Gusto ko lang masiguro na ang mga kausap ko ay mga taong gusto pa talagang makarinig.',
  'Kapag handa ka na, nandito lang kami.',
  'Hoping to see your reply, {name}.'
]}

];

/**
 * AUTOREPLY_: ang email na ipinapadala AGAD pagka-submit ng form (Araw 0).
 * Pareho ang format ng 30-araw na series. Ang linyang '{home}' ay napapalitan ng detalye ng bahay na pinili ng lead.
 */
var AUTOREPLY_ = { s: '{name}, natanggap ko na ang inquiry mo', l: [
  'Hi {name}, si Manny ito, kasama si Annalyn.',
  'Natanggap ko na ang inquiry mo sa Alara Village.',
  'Salamat, ha.',
  'Hindi madaling mag-fill up ng form para sa bahay.',
  'Alam kong may kasamang pag-asa yan, at may kasamang kaba.',
  '{home}',
  'Pero bago ang lahat, let me guess.',
  'Baka ito ang tumatakbo sa isip mo:',
  '“Hanggang kailan pa ba ako magre-rent?”\n“Kasya kaya sa sahod ko?”\n“Paano kung hindi ako ma-approve?”\n“Ang daming papeles, saan ba magsisimula?”\n“Baka may hidden charges.”',
  'Normal lang yan.',
  'Halos lahat ng nagtanong sa amin, yan din ang una nilang tanong.',
  'Kaya eto ang pangako namin:',
  'Walang pressure.\nWalang pilitan.\nWalang bayad para lang makakuha ng computation.',
  'Ang gagawin lang namin ay pakinggan ka muna, ihanda ang sample computation na swak sa sitwasyon mo, at ipaliwanag ang bawat numero sa simpleng salita.',
  'Ikaw ang magdedesisyon, sa sarili mong oras.',
  'Ang Alara Village ay gated community sa Imus, Cavite.',
  'May pool at gym, clubhouse, mga park, malalawak na kalsada, at riverside setting.',
  'Para mas mabilis, reply ka lang ng dalawang bagay:',
  '1. Magkano ang kaya mong hulog kada buwan?\n2. Kailan mo balak lumipat?',
  'Kahit approximate lang.',
  'Tatawagan o ite-text ka namin within 24 hours.',
  'Pero kung gusto mong mauna, reply ka lang dito.',
  'Kahit “hi” lang, sasagutin ko.',
  'Nandito kami.'
]};
