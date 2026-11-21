/*
 * LOUDOUT · Beta Access box.
 * A discreet "BETA ACCESS" button over the Coming Soon picture opens a box that asks for a personal invite code.
 * The code is checked by the LOUDOUT beta service (Cloudflare), never in this page: this file holds no codes, no
 * keys and no secrets. A valid code returns download links that expire after a few minutes.
 * Until the service address is set below the box shows "the beta is not open yet" (add ?demo to the address to try
 * the screens with the code LDT-BETA-2345).
 */
(() => {
  'use strict';

  /** The beta service (Cloudflare Worker). Empty: not open yet. */
  const API = 'https://loudout-beta.loudout.workers.dev';
  /** Cloudflare Turnstile site key (a public value, made to be in pages). Empty: no check widget. */
  const TURNSTILE_SITEKEY = '0x4AAAAAAGL5gj2omrGhzRVy'; // public by design; its secret lives only in the beta service

  const DEMO = !API && /[?&]demo\b/.test(location.search);
  const ALPHABET = /[^ABCDEFGHJKLMNPQRSTUVWXYZ23456789]/g; // no O/0, I/1: they look alike
  const LANGS = [['en', 'English'], ['pt', 'Português'], ['es', 'Español'], ['fr', 'Français'], ['de', 'Deutsch'], ['it', 'Italiano'],
    ['ru', 'Русский'], ['tr', 'Türkçe'], ['zh', '中文'], ['ja', '日本語'], ['ko', '한국어']];

  const T = {
    en: { webT: "iPhone · Browser", webS: "No install — plays in Safari", play: "PLAY", w1: "Tap PLAY: the game opens in Safari.", w2: "Tap Share, then “Add to Home Screen”.", w3: "Open LOUDOUT from your home screen — you’re in.",
      kicker: 'CLOSED BETA', title: 'Enter your invite code', sub: 'Each code is personal and works on one device.', unlock: 'UNLOCK', checking: 'CHECKING…',
      prot: 'Protected by Cloudflare', privacy: 'Privacy', bad: 'This code is not valid.', used: 'This code is already in use on another device.',
      blocked: 'Too many attempts. Try again later.', closed: 'The beta is not open yet. Come back soon.', error: 'Something went wrong. Try again.',
      okK: 'ACCESS GRANTED', okT: 'Welcome to the beta', okS: 'Your code is now linked to this device. Updates arrive inside the game.', dl: 'DOWNLOAD',
      s1: 'Open the downloaded file.', s2: 'If asked, allow installing apps from this source.', s3: 'Open LOUDOUT — you’re in.', valid: 'LINKS VALID FOR 10 MINUTES',
      close: 'Close', lang: 'Language', code: 'Invite code' },
    pt: { webT: "iPhone · Navegador", webS: "Sem instalar — joga no Safari", play: "JOGAR", w1: "Toca em JOGAR: o jogo abre no Safari.", w2: "Toca em Partilhar e depois em “Adicionar ao ecrã principal”.", w3: "Abre o LOUDOUT a partir do ecrã principal — já estás dentro.",
      kicker: 'BETA FECHADA', title: 'Introduz o teu código de convite', sub: 'Cada código é pessoal e funciona num só dispositivo.', unlock: 'DESBLOQUEAR', checking: 'A VERIFICAR…',
      prot: 'Protegido pela Cloudflare', privacy: 'Privacidade', bad: 'Este código não é válido.', used: 'Este código já está a ser usado noutro dispositivo.',
      blocked: 'Demasiadas tentativas. Tenta mais tarde.', closed: 'A beta ainda não abriu. Volta em breve.', error: 'Algo correu mal. Tenta outra vez.',
      okK: 'ACESSO CONCEDIDO', okT: 'Bem-vindo à beta', okS: 'O teu código ficou ligado a este dispositivo. As atualizações chegam dentro do jogo.', dl: 'DESCARREGAR',
      s1: 'Abre o ficheiro descarregado.', s2: 'Se pedir, permite instalar apps desta origem.', s3: 'Abre o LOUDOUT — já estás dentro.', valid: 'LINKS VÁLIDOS DURANTE 10 MINUTOS',
      close: 'Fechar', lang: 'Idioma', code: 'Código de convite' },
    es: { webT: "iPhone · Navegador", webS: "Sin instalar: se juega en Safari", play: "JUGAR", w1: "Toca JUGAR: el juego se abre en Safari.", w2: "Toca Compartir y luego “Añadir a pantalla de inicio”.", w3: "Abre LOUDOUT desde la pantalla de inicio: ya estás dentro.",
      kicker: 'BETA CERRADA', title: 'Introduce tu código de invitación', sub: 'Cada código es personal y funciona en un solo dispositivo.', unlock: 'DESBLOQUEAR', checking: 'COMPROBANDO…',
      prot: 'Protegido por Cloudflare', privacy: 'Privacidad', bad: 'Este código no es válido.', used: 'Este código ya se está usando en otro dispositivo.',
      blocked: 'Demasiados intentos. Inténtalo más tarde.', closed: 'La beta aún no está abierta. Vuelve pronto.', error: 'Algo salió mal. Inténtalo de nuevo.',
      okK: 'ACCESO CONCEDIDO', okT: 'Bienvenido a la beta', okS: 'Tu código ya está vinculado a este dispositivo. Las actualizaciones llegan dentro del juego.', dl: 'DESCARGAR',
      s1: 'Abre el archivo descargado.', s2: 'Si te lo pide, permite instalar apps de este origen.', s3: 'Abre LOUDOUT: ya estás dentro.', valid: 'ENLACES VÁLIDOS DURANTE 10 MINUTOS',
      close: 'Cerrar', lang: 'Idioma', code: 'Código de invitación' },
    fr: { webT: "iPhone · Navigateur", webS: "Sans installation : on joue dans Safari", play: "JOUER", w1: "Touche JOUER : le jeu s’ouvre dans Safari.", w2: "Touche Partager, puis « Sur l’écran d’accueil ».", w3: "Ouvre LOUDOUT depuis l’écran d’accueil : tu es dedans.",
      kicker: 'BÊTA FERMÉE', title: 'Entre ton code d’invitation', sub: 'Chaque code est personnel et fonctionne sur un seul appareil.', unlock: 'DÉVERROUILLER', checking: 'VÉRIFICATION…',
      prot: 'Protégé par Cloudflare', privacy: 'Confidentialité', bad: 'Ce code n’est pas valide.', used: 'Ce code est déjà utilisé sur un autre appareil.',
      blocked: 'Trop de tentatives. Réessaie plus tard.', closed: 'La bêta n’est pas encore ouverte. Reviens bientôt.', error: 'Un problème est survenu. Réessaie.',
      okK: 'ACCÈS ACCORDÉ', okT: 'Bienvenue dans la bêta', okS: 'Ton code est maintenant lié à cet appareil. Les mises à jour arrivent dans le jeu.', dl: 'TÉLÉCHARGER',
      s1: 'Ouvre le fichier téléchargé.', s2: 'Si demandé, autorise l’installation d’apps depuis cette source.', s3: 'Ouvre LOUDOUT : tu es dedans.', valid: 'LIENS VALABLES 10 MINUTES',
      close: 'Fermer', lang: 'Langue', code: 'Code d’invitation' },
    de: { webT: "iPhone · Browser", webS: "Ohne Installation – spielt in Safari", play: "SPIELEN", w1: "Tippe auf SPIELEN: Das Spiel öffnet sich in Safari.", w2: "Tippe auf Teilen und dann auf „Zum Home-Bildschirm“.", w3: "Öffne LOUDOUT vom Home-Bildschirm – du bist drin.",
      kicker: 'GESCHLOSSENE BETA', title: 'Gib deinen Einladungscode ein', sub: 'Jeder Code ist persönlich und funktioniert auf einem Gerät.', unlock: 'FREISCHALTEN', checking: 'WIRD GEPRÜFT…',
      prot: 'Geschützt durch Cloudflare', privacy: 'Datenschutz', bad: 'Dieser Code ist ungültig.', used: 'Dieser Code wird bereits auf einem anderen Gerät verwendet.',
      blocked: 'Zu viele Versuche. Versuche es später erneut.', closed: 'Die Beta ist noch nicht geöffnet. Schau bald wieder vorbei.', error: 'Etwas ist schiefgelaufen. Versuche es erneut.',
      okK: 'ZUGANG GEWÄHRT', okT: 'Willkommen in der Beta', okS: 'Dein Code ist jetzt mit diesem Gerät verknüpft. Updates kommen direkt im Spiel.', dl: 'HERUNTERLADEN',
      s1: 'Öffne die heruntergeladene Datei.', s2: 'Falls gefragt, erlaube die Installation von Apps aus dieser Quelle.', s3: 'Öffne LOUDOUT – du bist drin.', valid: 'LINKS 10 MINUTEN GÜLTIG',
      close: 'Schließen', lang: 'Sprache', code: 'Einladungscode' },
    it: { webT: "iPhone · Browser", webS: "Senza installare: si gioca in Safari", play: "GIOCA", w1: "Tocca GIOCA: il gioco si apre in Safari.", w2: "Tocca Condividi, poi “Aggiungi alla schermata Home”.", w3: "Apri LOUDOUT dalla schermata Home: sei dentro.",
      kicker: 'BETA CHIUSA', title: 'Inserisci il tuo codice invito', sub: 'Ogni codice è personale e funziona su un solo dispositivo.', unlock: 'SBLOCCA', checking: 'VERIFICA IN CORSO…',
      prot: 'Protetto da Cloudflare', privacy: 'Privacy', bad: 'Questo codice non è valido.', used: 'Questo codice è già in uso su un altro dispositivo.',
      blocked: 'Troppi tentativi. Riprova più tardi.', closed: 'La beta non è ancora aperta. Torna presto.', error: 'Qualcosa è andato storto. Riprova.',
      okK: 'ACCESSO CONSENTITO', okT: 'Benvenuto nella beta', okS: 'Il tuo codice ora è collegato a questo dispositivo. Gli aggiornamenti arrivano nel gioco.', dl: 'SCARICA',
      s1: 'Apri il file scaricato.', s2: 'Se richiesto, consenti l’installazione di app da questa fonte.', s3: 'Apri LOUDOUT: sei dentro.', valid: 'LINK VALIDI PER 10 MINUTI',
      close: 'Chiudi', lang: 'Lingua', code: 'Codice invito' },
    ru: { webT: "iPhone · Браузер", webS: "Без установки — игра в Safari", play: "ИГРАТЬ", w1: "Нажмите «ИГРАТЬ»: игра откроется в Safari.", w2: "Нажмите «Поделиться», затем «На экран „Домой“».", w3: "Откройте LOUDOUT с экрана «Домой» — вы в игре.",
      kicker: 'ЗАКРЫТАЯ БЕТА', title: 'Введите код приглашения', sub: 'Каждый код личный и работает на одном устройстве.', unlock: 'ОТКРЫТЬ', checking: 'ПРОВЕРКА…',
      prot: 'Защищено Cloudflare', privacy: 'Конфиденциальность', bad: 'Этот код недействителен.', used: 'Этот код уже используется на другом устройстве.',
      blocked: 'Слишком много попыток. Попробуйте позже.', closed: 'Бета ещё не открыта. Загляните позже.', error: 'Что-то пошло не так. Попробуйте ещё раз.',
      okK: 'ДОСТУП ОТКРЫТ', okT: 'Добро пожаловать в бету', okS: 'Ваш код привязан к этому устройству. Обновления приходят прямо в игре.', dl: 'СКАЧАТЬ',
      s1: 'Откройте скачанный файл.', s2: 'Если потребуется, разрешите установку приложений из этого источника.', s3: 'Откройте LOUDOUT — вы в игре.', valid: 'ССЫЛКИ ДЕЙСТВУЮТ 10 МИНУТ',
      close: 'Закрыть', lang: 'Язык', code: 'Код приглашения' },
    tr: { webT: "iPhone · Tarayıcı", webS: "Kurulum yok — Safari’de oynanır", play: "OYNA", w1: "OYNA’ya dokun: oyun Safari’de açılır.", w2: "Paylaş’a, sonra “Ana Ekrana Ekle”ye dokun.", w3: "LOUDOUT’u ana ekrandan aç — artık içeridesin.",
      kicker: 'KAPALI BETA', title: 'Davet kodunu gir', sub: 'Her kod kişiseldir ve tek bir cihazda çalışır.', unlock: 'KİLİDİ AÇ', checking: 'KONTROL EDİLİYOR…',
      prot: 'Cloudflare ile korunuyor', privacy: 'Gizlilik', bad: 'Bu kod geçerli değil.', used: 'Bu kod zaten başka bir cihazda kullanılıyor.',
      blocked: 'Çok fazla deneme. Daha sonra tekrar dene.', closed: 'Beta henüz açılmadı. Yakında tekrar gel.', error: 'Bir şeyler ters gitti. Tekrar dene.',
      okK: 'ERİŞİM VERİLDİ', okT: 'Betaya hoş geldin', okS: 'Kodun artık bu cihaza bağlı. Güncellemeler oyunun içinden gelir.', dl: 'İNDİR',
      s1: 'İndirilen dosyayı aç.', s2: 'İstenirse bu kaynaktan uygulama yüklemeye izin ver.', s3: 'LOUDOUT’u aç — artık içeridesin.', valid: 'BAĞLANTILAR 10 DAKİKA GEÇERLİ',
      close: 'Kapat', lang: 'Dil', code: 'Davet kodu' },
    zh: { webT: "iPhone · 浏览器", webS: "无需安装，在 Safari 中游玩", play: "开始游戏", w1: "点按“开始游戏”，游戏会在 Safari 中打开。", w2: "点按“分享”，然后选择“添加到主屏幕”。", w3: "从主屏幕打开 LOUDOUT，开始游戏。",
      kicker: '封闭测试', title: '输入你的邀请码', sub: '每个邀请码仅限本人使用，只能在一台设备上使用。', unlock: '解锁', checking: '正在验证…',
      prot: '由 Cloudflare 保护', privacy: '隐私', bad: '此邀请码无效。', used: '此邀请码已在另一台设备上使用。',
      blocked: '尝试次数过多，请稍后再试。', closed: '测试尚未开放，请稍后再来。', error: '出了点问题，请重试。',
      okK: '已获得访问权限', okT: '欢迎加入测试', okS: '你的邀请码已绑定到此设备。更新将在游戏内推送。', dl: '下载',
      s1: '打开下载的文件。', s2: '如有提示，请允许安装来自此来源的应用。', s3: '打开 LOUDOUT，开始游戏。', valid: '链接 10 分钟内有效',
      close: '关闭', lang: '语言', code: '邀请码' },
    ja: { webT: "iPhone · ブラウザ", webS: "インストール不要、Safari でプレイ", play: "プレイ", w1: "「プレイ」をタップすると Safari でゲームが開きます。", w2: "共有をタップし、「ホーム画面に追加」を選びます。", w3: "ホーム画面から LOUDOUT を起動すれば準備完了です。",
      kicker: 'クローズドベータ', title: '招待コードを入力', sub: 'コードは個人専用で、1台の端末でのみ使えます。', unlock: 'ロック解除', checking: '確認中…',
      prot: 'Cloudflare で保護', privacy: 'プライバシー', bad: 'このコードは無効です。', used: 'このコードは別の端末で使用中です。',
      blocked: '試行回数が多すぎます。しばらくしてからもう一度お試しください。', closed: 'ベータはまだ開始していません。またお越しください。', error: '問題が発生しました。もう一度お試しください。',
      okK: 'アクセス許可', okT: 'ベータへようこそ', okS: 'コードはこの端末に紐付けられました。アップデートはゲーム内で届きます。', dl: 'ダウンロード',
      s1: 'ダウンロードしたファイルを開きます。', s2: '求められたら、この提供元からのアプリのインストールを許可します。', s3: 'LOUDOUT を起動すれば準備完了です。', valid: 'リンクの有効期限は10分',
      close: '閉じる', lang: '言語', code: '招待コード' },
    ko: { webT: "iPhone · 브라우저", webS: "설치 없이 Safari에서 플레이", play: "플레이", w1: "‘플레이’를 탭하면 Safari에서 게임이 열립니다.", w2: "공유를 탭한 다음 ‘홈 화면에 추가’를 선택하세요.", w3: "홈 화면에서 LOUDOUT을 실행하면 바로 시작됩니다.",
      kicker: '비공개 베타', title: '초대 코드를 입력하세요', sub: '코드는 개인용이며 한 대의 기기에서만 작동합니다.', unlock: '잠금 해제', checking: '확인 중…',
      prot: 'Cloudflare로 보호됨', privacy: '개인정보', bad: '유효하지 않은 코드입니다.', used: '이 코드는 이미 다른 기기에서 사용 중입니다.',
      blocked: '시도 횟수가 너무 많습니다. 나중에 다시 시도하세요.', closed: '베타가 아직 열리지 않았습니다. 곧 다시 방문해 주세요.', error: '문제가 발생했습니다. 다시 시도하세요.',
      okK: '접근 허용', okT: '베타에 오신 것을 환영합니다', okS: '코드가 이 기기에 연결되었습니다. 업데이트는 게임 안에서 받을 수 있습니다.', dl: '다운로드',
      s1: '다운로드한 파일을 여세요.', s2: '요청이 있으면 이 출처의 앱 설치를 허용하세요.', s3: 'LOUDOUT을 실행하면 바로 시작됩니다.', valid: '링크는 10분 동안 유효',
      close: '닫기', lang: '언어', code: '초대 코드' },
  };

  // ---- small helpers ----
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode: fine */ } },
  };
  const el = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (html) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9M12 3C9.4 5.6 8.2 8.6 8.2 12s1.2 6.4 3.8 9"/></svg>';
  const SHIELD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>';
  const ICON = {
    android: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9h12v8.5a1.5 1.5 0 0 1-1.5 1.5H16v2.5a1.5 1.5 0 0 1-3 0V19h-2v2.5a1.5 1.5 0 0 1-3 0V19h-.5A1.5 1.5 0 0 1 6 17.5zM3.5 9a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-3 0v-5A1.5 1.5 0 0 1 3.5 9zm17 0a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-3 0v-5A1.5 1.5 0 0 1 20.5 9zM6.2 8a6 6 0 0 1 3-4.6l-1-1.6.6-.4 1.1 1.7a6.6 6.6 0 0 1 4.2 0l1.1-1.7.6.4-1 1.6a6 6 0 0 1 3 4.6zM9.5 5.8a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4zm5 0a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4z"/></svg>',
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h8V5zm4 14.2a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z"/></svg>',
    windows: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5l7.5-1v7H3zM11.5 4.4L21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.4z"/></svg>',
  };

  // ---- language: the visitor's own, or the one picked before ----
  const pickLang = () => {
    const saved = store.get('loudout.lang');
    if (saved && T[saved]) return saved;
    for (const l of navigator.languages || [navigator.language || 'en']) { const k = String(l).slice(0, 2).toLowerCase(); if (T[k]) return k; }
    return 'en';
  };
  let lang = pickLang();
  const t = (k) => (T[lang] && T[lang][k]) || T.en[k];

  // ---- this device: a random key made once, so a code can be tied to the device that used it ----
  const deviceKey = () => {
    let k = store.get('loudout.dk');
    if (!k) {
      const b = new Uint8Array(16); crypto.getRandomValues(b);
      k = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
      store.set('loudout.dk', k);
    }
    return k;
  };
  const platform = () => (/android/i.test(navigator.userAgent) ? 'android' : /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios' : /windows/i.test(navigator.userAgent) ? 'windows' : /mac/i.test(navigator.userAgent) ? 'mac' : 'other');

  // ---- building the page parts ----
  const langMenu = (onPick) => {
    const m = el('div', { class: 'ldb-menu', role: 'menu', hidden: '' });
    for (const [k, name] of LANGS) {
      const b = el('button', { type: 'button', role: 'menuitem', 'data-l': k }, `${esc(name)}<b>${k.toUpperCase()}</b>`);
      b.addEventListener('click', () => { onPick(k); m.hidden = true; });
      m.appendChild(b);
    }
    return m;
  };
  const langBtn = () => el('button', { type: 'button', class: 'ldb-lang', 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, `${GLOBE}<span></span>`);
  const toggleMenu = (btn, menu, open) => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };

  const openBtn = el('button', { type: 'button', class: 'ldb-btn', 'aria-haspopup': 'dialog' }, '<i></i>BETA ACCESS');
  const pageLang = el('div', { class: 'ldb-pagelang' });
  const pageLangBtn = langBtn(); const pageMenu = langMenu((k) => setLang(k));
  pageLang.append(pageLangBtn, pageMenu);

  const veil = el('div', { class: 'ldb-veil', hidden: '' });
  const wrap = el('div', { class: 'ldb-wrap', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ldb-title' });
  const boxLangBtn = langBtn(); const boxMenu = langMenu((k) => setLang(k));
  const closeBtn = el('button', { type: 'button', class: 'ldb-x' }, '×');
  const card = el('div', { class: 'ldb-card' });
  // Turnstile lives outside the card: the card is redrawn on every change, and redrawing would throw its token away
  const tsHost = el('div', { class: 'ldb-ts' });
  wrap.append(boxLangBtn, boxMenu, closeBtn, card, tsHost); veil.appendChild(wrap);
  document.body.append(pageLang, openBtn, veil);

  let state = 'ask', granted = null, busy = false, codeValue = '', msgKey = '', msgInfo = false, tsToken = '', tsWidget = null;

  const render = () => {
    document.documentElement.lang = lang;
    tsHost.hidden = state === 'ok';
    for (const b of [pageLangBtn, boxLangBtn]) { b.querySelector('span').textContent = lang.toUpperCase(); b.setAttribute('aria-label', t('lang')); }
    for (const m of [pageMenu, boxMenu]) m.querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', String(b.dataset.l === lang)));
    closeBtn.setAttribute('aria-label', t('close'));
    if (state === 'ok') {
      const links = (granted && granted.links) || {};
      const pf = platform();
      // iPhone / Mac / others: the web game first (no install); Android and Windows: their download first
      const order = pf === 'windows' ? ['windows', 'android', 'web'] : pf === 'android' ? ['android', 'windows', 'web'] : pf === 'ios' ? ['web'] : ['web', 'android', 'windows']; // an iPhone can only use the web game
      const shown = order.filter((p) => links[p]), web = shown[0] === 'web';
      const steps = web ? ['w1', 'w2', 'w3'] : ['s1', 's2', 's3'];
      card.innerHTML = `<div class="ldb-k">${esc(t('okK'))}</div><h2 id="ldb-title">${esc(t('okT'))}</h2><p>${esc(t('okS'))}</p>
        <div class="ldb-plat">${shown.map((p, i) => p === 'web'
          ? `<a class="ldb-dl${i === 0 ? ' main' : ''}" href="${esc(links.web.url)}">${ICON.web}<div><b>${esc(t('webT'))}</b><small>${esc(t('webS'))}</small></div><em>${esc(t('play'))}</em></a>`
          : `<a class="ldb-dl${i === 0 ? ' main' : ''}" href="${esc(links[p].url)}" rel="noopener" download>
          ${ICON[p]}<div><b>${p === 'android' ? 'Android' : 'Windows'}</b><small>${esc(links[p].note || '')}</small></div><em>${esc(t('dl'))}</em></a>`).join('')}</div>
        <ol class="ldb-steps">${steps.map((k) => `<li>${esc(t(k))}</li>`).join('')}</ol>
        <div class="ldb-badge"><i></i>${esc(t('valid'))}</div>`;
      return;
    }
    card.innerHTML = `<div class="ldb-k">${esc(t('kicker'))}</div><h2 id="ldb-title">${esc(t('title'))}</h2><p>${esc(t('sub'))}</p>
      <form novalidate><label class="ldb-field"><span class="ldb-pre">LDT-</span><input name="code" inputmode="text" autocomplete="one-time-code" autocapitalize="characters"
        spellcheck="false" autocorrect="off" maxlength="16" placeholder="XXXX-XXXX" aria-label="${esc(t('code'))}"></label>
      <div class="ldb-msg${msgInfo ? ' info' : ''}" role="status" aria-live="polite">${msgKey ? esc(t(msgKey)) : ''}</div>
      <button class="ldb-go" type="submit">${busy ? `<span><i class="ldb-spin"></i>${esc(t('checking'))}</span>` : esc(t('unlock'))}</button>
</form>
      <div class="ldb-row"><span>${SHIELD}${esc(t('prot'))}</span><a href="privacy.html">${esc(t('privacy'))}</a></div>`;
    const field = card.querySelector('.ldb-field'), input = field.querySelector('input'), go = card.querySelector('.ldb-go');
    input.value = codeValue.slice(4);
    const sync = () => { go.disabled = busy || codeValue.length !== 13; };
    input.addEventListener('input', () => {
      // the LDT- part is printed: a pasted or typed "LDT" in front is dropped (no code starts with LDT after it)
      let raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (raw.startsWith('LDT')) raw = raw.slice(3);
      raw = raw.replace(ALPHABET, '').slice(0, 8);
      const shown = raw.slice(0, 4) + (raw.length > 4 ? '-' + raw.slice(4) : '');
      codeValue = raw ? 'LDT-' + shown : '';
      input.value = shown; field.classList.remove('bad');
      if (msgKey && !msgInfo) { msgKey = ''; card.querySelector('.ldb-msg').textContent = ''; }
      sync();
    });
    card.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); if (!go.disabled) redeem(); });
    sync();
    mountTurnstile();
    if (!veil.hidden && !busy) setTimeout(() => input.focus(), 30);
  };

  const fail = (key, info = false) => {
    busy = false; msgKey = key; msgInfo = info; render();
    const field = card.querySelector('.ldb-field');
    if (!info && field) { field.classList.add('bad'); }
  };

  // the check usually passes on its own in a second or two; give it time before sending
  const tokenReady = (ms) => new Promise((res) => { const t0 = Date.now(); (function poll() { if (tsToken || Date.now() - t0 > ms) res(); else setTimeout(poll, 150); })(); });
  async function redeem() {
    if (busy) return;
    busy = true; msgKey = ''; render();
    if (API && TURNSTILE_SITEKEY) await tokenReady(12000);
    if (!API) {
      if (DEMO && codeValue === 'LDT-BETA-2345') { busy = false; granted = { links: { android: { url: '#', note: 'Build 120 · 36 MB' }, windows: { url: '#', note: 'PC · 120 MB' }, web: { url: '#', note: '' } } }; state = 'ok'; render(); return; }
      setTimeout(() => (DEMO ? fail('bad') : fail('closed', true)), 600);
      return;
    }
    try {
      const r = await fetch(`${API}/v1/redeem`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'omit', referrerPolicy: 'no-referrer',
        body: JSON.stringify({ code: codeValue, device: deviceKey(), platform: platform(), lang, turnstile: tsToken }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { busy = false; granted = j; state = 'ok'; codeValue = ''; render(); return; }
      resetTurnstile();
      const e = j.error;
      fail(e === 'used' ? 'used' : e === 'blocked' || r.status === 429 ? 'blocked' : e === 'closed' || e === 'paused' || r.status === 503 ? 'closed' : e === 'invalid' ? 'bad' : 'error', e === 'closed' || e === 'paused');
    } catch (err) {
      resetTurnstile(); fail('error');
    }
  }

  // ---- Cloudflare Turnstile: a quiet "are you a person?" check, shown only when it needs the visitor ----
  let tsLoading = false;
  function mountTurnstile() {
    if (!API || !TURNSTILE_SITEKEY) return;
    if (tsWidget !== null) return; // drawn once, kept across redraws
    if (!window.turnstile) {
      if (!tsLoading) {
        tsLoading = true;
        const s = el('script', { src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', async: '', defer: '' });
        s.addEventListener('load', () => render());
        document.head.appendChild(s);
      }
      return;
    }
    tsToken = '';
    tsWidget = window.turnstile.render(tsHost, { sitekey: TURNSTILE_SITEKEY, appearance: 'interaction-only', theme: 'dark', language: lang,
      callback: (tok) => { tsToken = tok; }, 'expired-callback': () => { tsToken = ''; } });
  }
  function resetTurnstile() { tsToken = ''; if (window.turnstile && tsWidget !== null) { try { window.turnstile.reset(tsWidget); } catch (e) { /* re-rendered */ } } }

  // ---- open / close / language ----
  function setLang(k) { if (!T[k]) return; lang = k; store.set('loudout.lang', k); render(); }
  function open() { veil.hidden = false; openBtn.setAttribute('aria-expanded', 'true'); render(); }
  function close() { veil.hidden = true; openBtn.setAttribute('aria-expanded', 'false'); toggleMenu(boxLangBtn, boxMenu, false); if (state === 'ok') { state = 'ask'; granted = null; } msgKey = ''; openBtn.focus(); }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  veil.addEventListener('click', (e) => { if (e.target === veil) close(); });
  pageLangBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(pageLangBtn, pageMenu, pageMenu.hidden); });
  boxLangBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(boxLangBtn, boxMenu, boxMenu.hidden); });
  document.addEventListener('click', (e) => {
    if (!pageLang.contains(e.target)) toggleMenu(pageLangBtn, pageMenu, false);
    if (!boxMenu.contains(e.target) && e.target !== boxLangBtn) toggleMenu(boxLangBtn, boxMenu, false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!pageMenu.hidden || !boxMenu.hidden) { toggleMenu(pageLangBtn, pageMenu, false); toggleMenu(boxLangBtn, boxMenu, false); return; }
    if (!veil.hidden) close();
  });
  if (/[?&]beta\b/.test(location.search) || location.hash === '#beta') open(); // a link straight to the box
  render();
})();
