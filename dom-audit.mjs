import puppeteer from './node_modules/puppeteer/lib/puppeteer/puppeteer.js';

const URL = 'http://localhost:3000';
const findings = [];

function log(severity, category, message, detail = '') {
  findings.push({ severity, category, message, detail });
}

function pass(category, message) { log('PASS', category, message); }
function crit(category, message, detail = '') { log('CRIT', category, message, detail); }
function high(category, message, detail = '') { log('HIGH', category, message, detail); }
function med(category, message, detail = '') { log('MED', category, message, detail); }
function low(category, message, detail = '') { log('LOW', category, message, detail); }
function warn(category, message, detail = '') { log('WARN', category, message, detail); }
function info(category, message, detail = '') { log('INFO', category, message, detail); }

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(rgb1, rgb2) {
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(str) {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));

// Scroll to trigger IntersectionObserver
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < pageHeight; y += 600) {
  await page.evaluate(yPos => window.scrollTo(0, yPos), y);
  await new Promise(r => setTimeout(r, 80));
}
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 400));

// ── CATEGORY A: META & SEO HEAD ──────────────────────────────────────────────
const metaData = await page.evaluate(() => {
  const metas = [...document.querySelectorAll('meta')].map(m => ({
    name: m.getAttribute('name'),
    property: m.getAttribute('property'),
    content: m.getAttribute('content'),
    httpEquiv: m.getAttribute('http-equiv'),
  }));
  return {
    title: document.title,
    metas,
    hasDescription: !!document.querySelector('meta[name="description"]'),
    hasOgTitle: !!document.querySelector('meta[property="og:title"]'),
    hasOgDescription: !!document.querySelector('meta[property="og:description"]'),
    hasOgImage: !!document.querySelector('meta[property="og:image"]'),
    hasOgUrl: !!document.querySelector('meta[property="og:url"]'),
    hasTwitterCard: !!document.querySelector('meta[name="twitter:card"]'),
    hasCanonical: !!document.querySelector('link[rel="canonical"]'),
    hasJsonLd: !!document.querySelector('script[type="application/ld+json"]'),
    jsonLdContent: document.querySelector('script[type="application/ld+json"]')?.textContent || null,
    hasCharset: !!document.querySelector('meta[charset]'),
    hasViewport: !!document.querySelector('meta[name="viewport"]'),
    hasLang: document.documentElement.getAttribute('lang'),
    hasRobots: !!document.querySelector('meta[name="robots"]'),
    hasFavicon: !!document.querySelector('link[rel="icon"], link[rel="shortcut icon"]'),
  };
});

info('META', `Page title: "${metaData.title}"`);
metaData.hasCharset ? pass('META', 'charset meta tag present') : crit('META', 'Missing charset meta tag');
metaData.hasViewport ? pass('META', 'viewport meta tag present') : crit('META', 'Missing viewport meta tag');
metaData.hasLang ? pass('META', `html lang="${metaData.hasLang}" present`) : high('META', 'Missing lang attribute on <html>');
metaData.hasDescription ? pass('META', 'meta description present') : crit('META', 'MISSING meta description', '<meta name="description"> not found — Google will auto-generate SERP snippet from body text');
metaData.hasOgTitle ? pass('META', 'og:title present') : crit('META', 'MISSING og:title', 'Social shares (Reddit, LinkedIn, Twitter) will show blank or raw URL');
metaData.hasOgDescription ? pass('META', 'og:description present') : crit('META', 'MISSING og:description');
metaData.hasOgImage ? pass('META', 'og:image present') : crit('META', 'MISSING og:image', 'No preview image on social shares — especially bad for a Reddit marketing agency');
metaData.hasOgUrl ? pass('META', 'og:url present') : high('META', 'MISSING og:url');
metaData.hasTwitterCard ? pass('META', 'twitter:card present') : high('META', 'MISSING twitter:card meta tags');
metaData.hasCanonical ? pass('META', 'canonical link present') : high('META', 'MISSING canonical link', 'Risk of duplicate content if served on http+https or www+non-www');
metaData.hasJsonLd ? pass('META', 'JSON-LD structured data present') : high('META', 'MISSING JSON-LD structured data', 'No Schema.org markup — missing rich snippet eligibility');
metaData.hasRobots ? pass('META', 'robots meta present') : low('META', 'No robots meta tag (crawlers allowed by default — acceptable if no crawl directives needed)');
metaData.hasFavicon ? pass('META', 'favicon link present') : low('META', 'MISSING favicon link', 'Browser will 404 on /favicon.ico');

// ── CATEGORY B: HEADING HIERARCHY ────────────────────────────────────────────
const headings = await page.evaluate(() => {
  return [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => {
    const cs = window.getComputedStyle(h);
    return {
      tag: h.tagName.toLowerCase(),
      text: h.textContent.trim().replace(/\s+/g, ' '),
      display: cs.display,
      visibility: cs.visibility,
      opacity: parseFloat(cs.opacity),
      offsetParent: h.offsetParent !== null,
      ariaHidden: h.getAttribute('aria-hidden'),
    };
  });
});

const h1s = headings.filter(h => h.tag === 'h1');
const visibleH1s = h1s.filter(h => h.display !== 'none' && h.visibility !== 'hidden' && h.opacity > 0);
const hiddenH1s = h1s.filter(h => h.display === 'none' || h.visibility === 'hidden' || h.opacity === 0);

info('HEADINGS', `Total H1 tags found: ${h1s.length}`);
info('HEADINGS', `Visible H1s: ${visibleH1s.length}`);
info('HEADINGS', `Hidden H1s: ${hiddenH1s.length}`);

if (h1s.length === 0) crit('HEADINGS', 'No H1 tag found on page');
else if (h1s.length === 1) pass('HEADINGS', `Single H1 found: "${h1s[0].text.substring(0, 80)}"`);
else crit('HEADINGS', `Multiple H1 tags found: ${h1s.length}`, h1s.map(h => `"${h.text.substring(0, 60)}"`).join(', '));

hiddenH1s.forEach(h => crit('HEADINGS', `HIDDEN H1 detected: "${h.text.substring(0, 80)}"`, `display:${h.display} visibility:${h.visibility} opacity:${h.opacity}`));

// Check hierarchy (no skipped levels)
let prevLevel = 0;
let hierarchyClean = true;
headings.forEach(h => {
  const level = parseInt(h.tag[1]);
  if (prevLevel > 0 && level > prevLevel + 1) {
    high('HEADINGS', `Heading level skipped: h${prevLevel} → h${level}`, `"${h.text.substring(0, 60)}"`);
    hierarchyClean = false;
  }
  prevLevel = level;
});
if (hierarchyClean) pass('HEADINGS', 'Heading hierarchy is clean — no skipped levels');

// Duplicate headings
const headingTexts = headings.map(h => h.text.toLowerCase().trim());
const dupes = headingTexts.filter((t, i) => headingTexts.indexOf(t) !== i);
if (dupes.length > 0) warn('HEADINGS', `Duplicate heading text found: ${[...new Set(dupes)].map(t => `"${t.substring(0, 40)}"`).join(', ')}`);
else pass('HEADINGS', 'No duplicate heading text found');

// Full heading tree
info('HEADINGS', '── Full heading tree ──');
headings.forEach(h => {
  const indent = '  '.repeat(parseInt(h.tag[1]) - 1);
  const hidden = (h.display === 'none' || h.visibility === 'hidden' || h.opacity === 0) ? ' [HIDDEN]' : '';
  info('HEADINGS', `${indent}<${h.tag}>${hidden} "${h.text.substring(0, 80)}"`);
});

// ── CATEGORY C: REVEAL ANIMATION STATE ───────────────────────────────────────
const revealData = await page.evaluate(() => {
  const els = [...document.querySelectorAll('.reveal')];
  return {
    total: els.length,
    withIn: els.filter(e => e.classList.contains('in')).length,
    withoutIn: els.filter(e => !e.classList.contains('in')).map(e => ({
      tag: e.tagName,
      text: e.textContent.trim().substring(0, 60),
      opacity: window.getComputedStyle(e).opacity,
    })),
  };
});

info('REVEAL', `Total .reveal elements: ${revealData.total}`);
if (revealData.withoutIn.length === 0) {
  pass('REVEAL', 'All .reveal elements have .in class — content visible to Googlebot after JS execution');
} else {
  warn('REVEAL', `${revealData.withoutIn.length} .reveal elements still at opacity:0 after scroll-trigger`, 'Googlebot renders JS but may not scroll — content could be invisible during indexing');
  revealData.withoutIn.forEach(e => warn('REVEAL', `  opacity:${e.opacity} — ${e.tag}: "${e.text}"`));
}

// ── CATEGORY D: NAVIGATION ────────────────────────────────────────────────────
const navDesktop = await page.evaluate(() => {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  const navLinksDisplay = navLinks ? window.getComputedStyle(navLinks).display : 'not found';
  const anchors = nav ? [...nav.querySelectorAll('a')].map(a => ({
    href: a.getAttribute('href'),
    text: a.textContent.trim(),
    ariaLabel: a.getAttribute('aria-label'),
  })) : [];
  const themeToggle = nav?.querySelector('.theme-toggle');
  const hamburger = nav?.querySelector('[class*="hamburger"], [class*="menu-toggle"], [aria-label*="navigation"], [aria-label*="menu"]');
  return {
    navLinksDisplay,
    anchors,
    themeToggleAriaLabel: themeToggle?.getAttribute('aria-label') || null,
    hasHamburger: !!hamburger,
  };
});

info('NAV', `Desktop: .nav-links display = "${navDesktop.navLinksDisplay}"`);
navDesktop.navLinksDisplay !== 'none' ? pass('NAV', 'Navigation links visible on desktop') : crit('NAV', 'Navigation links hidden on desktop');
navDesktop.themeToggleAriaLabel ? pass('NAV', `Theme toggle has aria-label: "${navDesktop.themeToggleAriaLabel}"`) : high('NAV', 'Theme toggle missing aria-label');

navDesktop.anchors.forEach(a => {
  if (a.href === '#' || a.href === '') warn('NAV', `Nav link with empty/hash href: "${a.text || a.ariaLabel}"`, `href="${a.href}"`);
});

await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
await new Promise(r => setTimeout(r, 300));

const navMobile = await page.evaluate(() => {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  const navLinksDisplay = navLinks ? window.getComputedStyle(navLinks).display : 'not found';
  const hamburger = nav?.querySelector('[class*="hamburger"], [class*="menu-toggle"], button[aria-label*="navigation" i], button[aria-label*="menu" i], button[aria-label*="nav" i]');
  return {
    navLinksDisplay,
    hasHamburger: !!hamburger,
    hamburgerAriaLabel: hamburger?.getAttribute('aria-label') || null,
    hamburgerDisplay: hamburger ? window.getComputedStyle(hamburger).display : 'not found',
  };
});

info('NAV', `Mobile (375px): .nav-links display = "${navMobile.navLinksDisplay}"`);
if (navMobile.navLinksDisplay === 'none') {
  if (navMobile.hasHamburger && navMobile.hamburgerDisplay !== 'none') {
    pass('NAV', `Mobile nav hidden — hamburger button present (aria-label: "${navMobile.hamburgerAriaLabel}")`);
  } else {
    crit('NAV', 'Mobile nav links hidden with NO hamburger/menu button', 'Mobile users cannot access section navigation at all — complete UX failure on primary device class');
  }
} else {
  pass('NAV', 'Navigation links visible on mobile');
}

// Back to desktop
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await new Promise(r => setTimeout(r, 300));

// ── CATEGORY E: FORM & LABELING ───────────────────────────────────────────────
const formData = await page.evaluate(() => {
  const input = document.querySelector('#cta-email');
  const btn = document.querySelector('#cta-btn');
  const form = document.querySelector('#cta-form');
  const ariaLive = document.querySelector('[aria-live]');
  let labelsCount = 0;
  if (input) {
    try { labelsCount = input.labels?.length || 0; } catch(e) {}
  }
  return {
    inputFound: !!input,
    inputAriaLabel: input?.getAttribute('aria-label') || null,
    inputAriaLabelledBy: input?.getAttribute('aria-labelledby') || null,
    inputLabelsCount: labelsCount,
    inputPlaceholder: input?.getAttribute('placeholder') || null,
    inputType: input?.getAttribute('type') || null,
    inputRequired: input?.hasAttribute('required') || false,
    btnText: btn?.textContent?.trim() || null,
    formId: form?.id || null,
    hasAriaLive: !!ariaLive,
    ariaLiveValue: ariaLive?.getAttribute('aria-live') || null,
  };
});

formData.inputFound ? pass('FORM', 'Email input #cta-email found') : crit('FORM', '#cta-email not found');
if (formData.inputFound) {
  if (formData.inputAriaLabel) pass('FORM', `Email input has aria-label: "${formData.inputAriaLabel}"`);
  else if (formData.inputAriaLabelledBy) pass('FORM', `Email input has aria-labelledby: "${formData.inputAriaLabelledBy}"`);
  else if (formData.inputLabelsCount > 0) pass('FORM', `Email input has ${formData.inputLabelsCount} associated <label> element(s)`);
  else high('FORM', 'Email input has NO label (no <label>, no aria-label, no aria-labelledby)', `Only has placeholder="${formData.inputPlaceholder}" — screen readers announce it as unlabeled field; fails WCAG 1.3.1 and 3.3.2`);

  formData.inputRequired ? pass('FORM', 'Email input has required attribute') : low('FORM', 'Email input missing required attribute');
}
formData.hasAriaLive ? pass('FORM', `aria-live region present (value: "${formData.ariaLiveValue}")`) : high('FORM', 'No aria-live region for form feedback', 'Screen reader users get no notification when form submits — success/error messages are purely visual');

// ── CATEGORY F: ARIA & SEMANTIC ELEMENTS ──────────────────────────────────────
const semanticData = await page.evaluate(() => {
  return {
    mainCount: document.querySelectorAll('main').length,
    navCount: document.querySelectorAll('nav').length,
    sectionCount: document.querySelectorAll('section').length,
    asideCount: document.querySelectorAll('aside').length,
    articleCount: document.querySelectorAll('article').length,
    headerCount: document.querySelectorAll('header').length,
    footerCount: document.querySelectorAll('footer').length,
    marqueeAriaHidden: document.querySelector('.marquee-wrap')?.getAttribute('aria-hidden') || null,
    logoAriaLabel: document.querySelector('nav svg[aria-label]')?.getAttribute('aria-label') || null,
    logoRole: document.querySelector('nav svg[role]')?.getAttribute('role') || null,
    footerLogoAriaLabel: document.querySelector('footer svg[aria-label]')?.getAttribute('aria-label') || null,
    sectionsWithIds: [...document.querySelectorAll('section')].map(s => s.id || '(no id)'),
    sectionsWithAriaLabel: [...document.querySelectorAll('section')].map(s => s.getAttribute('aria-label') || s.getAttribute('aria-labelledby') || null),
  };
});

info('SEMANTIC', `Semantic element counts: main:${semanticData.mainCount} nav:${semanticData.navCount} section:${semanticData.sectionCount} aside:${semanticData.asideCount} article:${semanticData.articleCount} header:${semanticData.headerCount} footer:${semanticData.footerCount}`);
semanticData.mainCount === 1 ? pass('SEMANTIC', '<main> landmark present') : (semanticData.mainCount === 0 ? high('SEMANTIC', 'MISSING <main> landmark', 'Screen reader users cannot jump to main content via landmark navigation') : warn('SEMANTIC', `Multiple <main> elements found: ${semanticData.mainCount}`));

semanticData.marqueeAriaHidden === 'true' ? pass('SEMANTIC', 'Marquee section has aria-hidden="true" (decorative scrolling content)') : warn('SEMANTIC', `Marquee .marquee-wrap aria-hidden="${semanticData.marqueeAriaHidden}" — expected "true"`);
semanticData.logoAriaLabel ? pass('SEMANTIC', `Nav logo SVG has aria-label="${semanticData.logoAriaLabel}"`) : high('SEMANTIC', 'Nav logo SVG missing aria-label');
semanticData.logoRole ? pass('SEMANTIC', `Nav logo SVG has role="${semanticData.logoRole}"`) : high('SEMANTIC', 'Nav logo SVG missing role="img"');
semanticData.footerLogoAriaLabel ? pass('SEMANTIC', `Footer logo SVG has aria-label="${semanticData.footerLogoAriaLabel}"`) : high('SEMANTIC', 'Footer logo SVG missing aria-label');

info('SEMANTIC', `Section IDs: ${semanticData.sectionsWithIds.join(', ')}`);
const sectionsWithoutId = semanticData.sectionsWithIds.filter(id => id === '(no id)');
if (sectionsWithoutId.length > 0) low('SEMANTIC', `${sectionsWithoutId.length} section(s) without an id attribute — cannot be deep-linked`);

// ── CATEGORY G: STATS SEMANTIC ────────────────────────────────────────────────
const statsData = await page.evaluate(() => {
  const statsContainer = document.querySelector('.about-stats');
  const statItems = document.querySelectorAll('.stat');
  const statNums = document.querySelectorAll('.stat-num');
  const statLbls = document.querySelectorAll('.stat-lbl');
  return {
    containerTag: statsContainer?.tagName?.toLowerCase() || 'not found',
    statCount: statItems.length,
    statNumTags: [...statNums].map(e => e.tagName.toLowerCase()),
    statLblTags: [...statLbls].map(e => e.tagName.toLowerCase()),
  };
});

info('SEMANTIC', `Stats container tag: <${statsData.containerTag}>, ${statsData.statCount} stat items`);
if (statsData.containerTag === 'dl') pass('SEMANTIC', 'Stats container uses semantic <dl>');
else med('SEMANTIC', `Stats container is <${statsData.containerTag}> not <dl>`, 'Numbers and their labels have implicit key-value relationship — a description list conveys this to screen readers and crawlers');

const nonSemanticNums = statsData.statNumTags.filter(t => t !== 'dt');
if (nonSemanticNums.length === 0) pass('SEMANTIC', 'Stat numbers use <dt>');
else med('SEMANTIC', `Stat numbers use <${statsData.statNumTags[0]}> instead of <dt>`);

const nonSemanticLbls = statsData.statLblTags.filter(t => t !== 'dd');
if (nonSemanticLbls.length === 0) pass('SEMANTIC', 'Stat labels use <dd>');
else med('SEMANTIC', `Stat labels use <${statsData.statLblTags[0]}> instead of <dd>`);

// ── CATEGORY H: COLOR CONTRAST ────────────────────────────────────────────────
const colorLight = await page.evaluate(() => {
  const h1 = document.querySelector('.hero h1');
  const sub = document.querySelector('.hero-sub');
  const navLink = document.querySelector('.nav-links a');
  const body = document.body;
  const cs = el => el ? window.getComputedStyle(el) : null;
  return {
    h1Color: cs(h1)?.color,
    h1Bg: cs(h1)?.backgroundColor || window.getComputedStyle(body).backgroundColor,
    subColor: cs(sub)?.color,
    navLinkColor: cs(navLink)?.color,
    heroBg: window.getComputedStyle(document.querySelector('.hero') || body).backgroundColor,
  };
});

const pairs = [
  ['H1 text', colorLight.h1Color, colorLight.heroBg],
  ['Hero subtitle', colorLight.subColor, colorLight.heroBg],
  ['Nav links', colorLight.navLinkColor, 'rgb(250, 248, 244)'],
];

pairs.forEach(([label, fgStr, bgStr]) => {
  if (!fgStr || !bgStr) { info('CONTRAST', `${label}: could not compute colors`); return; }
  const fg = parseRgb(fgStr);
  const bg = parseRgb(bgStr);
  if (!fg || !bg) { info('CONTRAST', `${label}: fg=${fgStr} bg=${bgStr} (could not parse)`); return; }
  const ratio = contrastRatio(fg, bg);
  const pass4 = ratio >= 4.5;
  const pass3 = ratio >= 3.0;
  const msg = `${label}: ${ratio.toFixed(2)}:1 — WCAG AA ${pass4 ? 'PASS' : pass3 ? 'LARGE-TEXT-PASS' : 'FAIL'}`;
  pass4 ? pass('CONTRAST', msg) : (pass3 ? warn('CONTRAST', msg) : high('CONTRAST', msg));
});

// ── CATEGORY I: LINKS AUDIT ───────────────────────────────────────────────────
const linksData = await page.evaluate(() => {
  return [...document.querySelectorAll('a')].map(a => ({
    href: a.getAttribute('href'),
    text: a.textContent.trim().replace(/\s+/g, ' ').substring(0, 60),
    ariaLabel: a.getAttribute('aria-label'),
    target: a.getAttribute('target'),
    rel: a.getAttribute('rel'),
    hasAccessibleName: !!(a.textContent.trim() || a.getAttribute('aria-label') || a.getAttribute('aria-labelledby')),
  }));
});

const hashLinks = linksData.filter(a => a.href === '#');
const emptyLinks = linksData.filter(a => a.href === '' || a.href === null);
const noNameLinks = linksData.filter(a => !a.hasAccessibleName);
const blankNoRel = linksData.filter(a => a.target === '_blank' && (!a.rel || !a.rel.includes('noopener')));
const mailtoLinks = linksData.filter(a => a.href?.startsWith('mailto:'));

info('LINKS', `Total <a> elements: ${linksData.length}`);
hashLinks.length > 0 ? med('LINKS', `${hashLinks.length} link(s) with href="#"`, hashLinks.map(a => `"${a.text || '(no text)'}"`).join(', ')) : pass('LINKS', 'No href="#" placeholder links');
emptyLinks.length > 0 ? high('LINKS', `${emptyLinks.length} link(s) with empty href`, emptyLinks.map(a => `"${a.text}"`).join(', ')) : pass('LINKS', 'No empty href links');
noNameLinks.length > 0 ? high('LINKS', `${noNameLinks.length} link(s) with no accessible name`, noNameLinks.map(a => `href="${a.href}"`).join(', ')) : pass('LINKS', 'All links have accessible names');
blankNoRel.length > 0 ? med('LINKS', `${blankNoRel.length} target="_blank" link(s) missing rel="noopener"`) : pass('LINKS', 'No unsafe target=_blank links');
mailtoLinks.length > 0 ? pass('LINKS', `mailto link(s) present: ${mailtoLinks.map(a => a.href).join(', ')}`) : info('LINKS', 'No mailto links');

// ── CATEGORY J: IMAGES & SVG ──────────────────────────────────────────────────
const imgData = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(i => ({
    src: i.getAttribute('src'),
    alt: i.getAttribute('alt'),
    hasAlt: i.hasAttribute('alt'),
  }));
  const svgsWithRole = [...document.querySelectorAll('svg[role="img"]')].map(s => ({
    ariaLabel: s.getAttribute('aria-label'),
    hasLabel: !!s.getAttribute('aria-label'),
  }));
  const svgsAriaHidden = document.querySelectorAll('svg[aria-hidden="true"]').length;
  const svgsTotal = document.querySelectorAll('svg').length;
  const svgsNoAttr = [...document.querySelectorAll('svg:not([aria-hidden]):not([role])')].length;
  return { imgs, svgsWithRole, svgsAriaHidden, svgsTotal, svgsNoAttr };
});

info('IMAGES', `<img> tags: ${imgData.imgs.length}, SVGs total: ${imgData.svgsTotal}`);
imgData.imgs.length === 0 ? pass('IMAGES', 'No <img> tags (all graphics are inline SVGs)') : imgData.imgs.filter(i => !i.hasAlt).length > 0 ? crit('IMAGES', 'Some <img> tags missing alt attribute') : pass('IMAGES', 'All <img> tags have alt attributes');
info('IMAGES', `SVGs with role="img": ${imgData.svgsWithRole.length} | aria-hidden: ${imgData.svgsAriaHidden} | no accessibility attr: ${imgData.svgsNoAttr}`);
const missingLabel = imgData.svgsWithRole.filter(s => !s.hasLabel);
missingLabel.length > 0 ? high('IMAGES', `${missingLabel.length} SVG(s) with role="img" missing aria-label`) : pass('IMAGES', 'All role="img" SVGs have aria-label');
if (imgData.svgsNoAttr > 0) low('IMAGES', `${imgData.svgsNoAttr} SVG(s) have neither aria-hidden nor role — likely decorative; add aria-hidden="true" for clarity`);

// ── CATEGORY K: HIDDEN CONTENT AUDIT ─────────────────────────────────────────
const hiddenContent = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = window.getComputedStyle(el);
    const tag = el.tagName.toLowerCase();
    const text = el.textContent.trim().substring(0, 80);
    if (!text || ['script', 'style', 'head', 'meta', 'link', 'title'].includes(tag)) return;
    if (cs.display === 'none' && text.length > 5) {
      results.push({ type: 'display:none', tag, text, ariaHidden: el.getAttribute('aria-hidden'), classes: el.className.substring(0, 60) });
    } else if (cs.visibility === 'hidden' && text.length > 5) {
      results.push({ type: 'visibility:hidden', tag, text, ariaHidden: el.getAttribute('aria-hidden'), classes: el.className.substring(0, 60) });
    } else if (parseFloat(cs.opacity) === 0 && text.length > 5) {
      results.push({ type: 'opacity:0', tag, text, ariaHidden: el.getAttribute('aria-hidden'), classes: el.className.substring(0, 60) });
    }
  });
  return results;
});

const filterParents = (items) => {
  // Remove items whose text is a substring of another item's text (child deduplication)
  return items.filter((item, i) => !items.some((other, j) => j !== i && other.text.includes(item.text) && item.text.length < other.text.length));
};

const dedupedHidden = filterParents(hiddenContent);
info('HIDDEN', `Hidden elements found (deduped): ${dedupedHidden.length}`);
dedupedHidden.forEach(el => {
  const isAriaHidden = el.ariaHidden === 'true';
  if (el.classes.includes('icon-sun') || el.classes.includes('icon-moon')) {
    info('HIDDEN', `[THEME TOGGLE] ${el.type} — class="${el.classes}" "${el.text.substring(0, 40)}" — ACCEPTABLE: theme icon toggle`);
  } else if (el.classes.includes('nav-links')) {
    warn('HIDDEN', `[MOBILE NAV] ${el.type} — class="${el.classes}" — ISSUE: navigation hidden on mobile with no fallback`);
  } else if (isAriaHidden) {
    info('HIDDEN', `[ARIA-HIDDEN] ${el.type} — "${el.text.substring(0, 60)}" — ACCEPTABLE: explicitly hidden from AT`);
  } else {
    warn('HIDDEN', `[UNKNOWN] ${el.type} — class="${el.classes}" text="${el.text.substring(0, 60)}" — INVESTIGATE`);
  }
});

// ── PRINT REPORT ──────────────────────────────────────────────────────────────
await browser.close();

const line = '═'.repeat(72);
const thin = '─'.repeat(72);

console.log(`\n${line}`);
console.log(`  GROUNDWAVE DOM AUDIT REPORT`);
console.log(`  Generated: ${new Date().toISOString()}`);
console.log(`  URL: ${URL}`);
console.log(line);

const categories = [...new Set(findings.map(f => f.category))];

for (const cat of categories) {
  const catFindings = findings.filter(f => f.category === cat);
  console.log(`\n${thin}`);
  console.log(`  ${cat}`);
  console.log(thin);
  for (const f of catFindings) {
    const prefix = f.severity === 'PASS' ? '✓' : f.severity === 'INFO' ? 'ℹ' : f.severity === 'WARN' ? '⚠' : '✗';
    const sev = f.severity === 'PASS' || f.severity === 'INFO' ? f.severity : `[${f.severity}]`;
    console.log(`  ${prefix} ${sev.padEnd(7)} ${f.message}`);
    if (f.detail) console.log(`           ↳ ${f.detail}`);
  }
}

const crits = findings.filter(f => f.severity === 'CRIT');
const highs = findings.filter(f => f.severity === 'HIGH');
const meds  = findings.filter(f => f.severity === 'MED');
const lows  = findings.filter(f => f.severity === 'LOW');
const warns = findings.filter(f => f.severity === 'WARN');
const passes = findings.filter(f => f.severity === 'PASS');

console.log(`\n${line}`);
console.log(`  SUMMARY`);
console.log(line);
console.log(`  ✗ CRITICAL : ${crits.length}`);
console.log(`  ✗ HIGH     : ${highs.length}`);
console.log(`  ⚠ MEDIUM   : ${meds.length}`);
console.log(`  ⚠ LOW      : ${lows.length}`);
console.log(`  ⚠ WARN     : ${warns.length}`);
console.log(`  ✓ PASS     : ${passes.length}`);
console.log(`\n  SEO Quality Score     : ${crits.length === 0 && highs.filter(f=>['META','NAV'].includes(f.category)).length===0 ? 'A' : crits.length <= 2 ? 'C' : 'F'}/10 (pre-fix)`);
console.log(`  Semantic HTML Score   : ${semanticData.mainCount === 1 ? 'B' : 'C'}/10 (pre-fix)`);
console.log(`  Accessibility Score   : ${highs.filter(f=>['FORM','NAV','SEMANTIC'].includes(f.category)).length === 0 ? 'A' : 'D'}/10 (pre-fix)`);

console.log(`\n${line}`);
console.log(`  PRIORITIZED FIX LIST`);
console.log(line);
let fixN = 1;
[...crits, ...highs, ...meds, ...lows, ...warns].forEach(f => {
  console.log(`  ${fixN++}. [${f.severity}] [${f.category}] ${f.message}`);
});
console.log(`\n${line}\n`);
