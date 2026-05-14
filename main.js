// Progressive enhancements: theme, search, reading time, sharing, scroll UI.
const posts = [
  { title: '\u6771\u4eac\u6848\u5185\u66f8', url: 'tokyo-guide.html', category: 'SEO Landing', excerpt: 'Tokyo Annai Sho: personal bicycle travel guide in Tokyo.' },
  { title: 'Tokyo bicycle journey', url: 'article.html', category: 'Travel Essay', excerpt: 'A slow bicycle journey from Yanaka Ginza to Edo-Tokyo Open Air Architectural Museum.' },
  { title: 'Tokyo route maps', url: 'routes.html', category: 'Routes', excerpt: 'Route map 1 and route map 2 for the Tokyo bicycle journey.' },
  { title: 'Tokyo places guide', url: 'places.html', category: 'Places', excerpt: 'Yanaka Ginza, Tokyo Dome, Koishikawa Korakuen, Science Museum, Tokyo Daijingu, and Edo-Tokyo Open Air Architectural Museum.' },
  { title: 'Travel Essay', url: 'category-travel.html', category: 'Category', excerpt: 'Travel essays from Tokyo Annai Sho.' },
  { title: 'Tag: \u6771\u4eac\u6848\u5185\u66f8', url: 'tag-tokyo-annai.html', category: 'Tag', excerpt: 'Pages related to the SEO keyword Tokyo Annai Sho.' },
  { title: 'About Tokyo Slow Notes', url: 'about.html', category: 'About', excerpt: 'About the Tokyo Annai Sho blog and editorial policy.' }
];
const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.dataset.theme = savedTheme;
function syncThemeButton() {
  if (!themeToggle) return;
  const dark = root.dataset.theme === 'dark';
  themeToggle.textContent = dark ? 'Light' : 'Dark';
  themeToggle.setAttribute('aria-pressed', String(dark));
}
syncThemeButton();
themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
  syncThemeButton();
});
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#siteMenu');
navToggle?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
const progress = document.querySelector('#scrollProgress');
const backTop = document.querySelector('[data-back-to-top]');
function updateScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progress) progress.style.width = `${pct}%`;
  backTop?.classList.toggle('is-visible', window.scrollY > 480);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const modal = document.querySelector('[data-search-modal]');
const searchInput = document.querySelector('#siteSearch');
const searchResults = document.querySelector('[data-search-results]');
function renderResults(query = '') {
  if (!searchResults) return;
  const q = query.trim().toLowerCase();
  const matched = posts.filter(post => [post.title, post.category, post.excerpt].join(' ').toLowerCase().includes(q));
  searchResults.innerHTML = matched.map(post => `<a class="search-result" href="${post.url}"><strong>${post.title}</strong><br><span>${post.category} - ${post.excerpt}</span></a>`).join('') || '<p class="meta">No posts found.</p>';
}
document.querySelector('[data-search-open]')?.addEventListener('click', () => {
  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden', 'false');
  renderResults();
  setTimeout(() => searchInput?.focus(), 30);
});
document.querySelector('[data-search-close]')?.addEventListener('click', () => {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
});
modal?.addEventListener('click', event => {
  if (event.target === modal) modal.classList.remove('is-open');
});
searchInput?.addEventListener('input', event => renderResults(event.target.value));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') modal?.classList.remove('is-open');
});
const article = document.querySelector('[data-article]');
if (article) {
  const words = article.textContent.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 420));
  document.querySelectorAll('[data-reading-time-output]').forEach(node => { node.textContent = `${minutes} min read`; });
}
document.querySelector('[data-copy-link]')?.addEventListener('click', async event => {
  await navigator.clipboard.writeText(location.href);
  event.currentTarget.textContent = 'Copied';
  setTimeout(() => { event.currentTarget.textContent = 'Copy link'; }, 1400);
});
document.querySelector('[data-native-share]')?.addEventListener('click', async () => {
  if (navigator.share) await navigator.share({ title: document.title, url: location.href });
});
// Temporary moved-site notice. Keep the old pages crawlable, but guide visitors to the new domain.
const NEW_SITE_URL = 'https://gogojapan.vercel.app/';
function initMovedSiteNotice() {
  if (location.hostname === 'gogojapan.vercel.app') return;
  document.body.classList.add('moved-lock');
  const notice = document.createElement('div');
  notice.className = 'moved-notice';
  notice.setAttribute('role', 'dialog');
  notice.setAttribute('aria-modal', 'true');
  notice.setAttribute('aria-labelledby', 'movedTitle');
  notice.innerHTML = `
    <section class="moved-card" aria-describedby="movedDescription">
      <p class="eyebrow">Website moved</p>
      <h2 id="movedTitle">サイトのURLが変更されました</h2>
      <p id="movedDescription">東京案内書は新しいサイトへ移転しました。最新版は下のリンクからご覧ください。</p>
      <a class="moved-link" href="${NEW_SITE_URL}" rel="noopener">新しいサイトを開く</a>
      <p class="moved-url"><span>新しいURL</span><strong>${NEW_SITE_URL}</strong></p>
    </section>`;
  document.body.appendChild(notice);
  setTimeout(() => notice.querySelector('.moved-link')?.focus(), 50);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMovedSiteNotice);
} else {
  initMovedSiteNotice();
}



