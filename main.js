// Progressive enhancements: theme, search, reading time, sharing, scroll UI.
const posts = [
  { title: '東京案内書', url: 'tokyo-guide.html', category: 'SEO Landing', excerpt: '東京を自転車で巡る個人ガイドとサイト案内。' },
  { title: '自転車で巡る東京の静けさと記憶', url: 'article.html', category: 'Travel Essay', excerpt: '谷中銀座から江戸東京たてもの園まで、東京を自転車で巡る旅。' },
  { title: '東京案内書のルート', url: 'routes.html', category: 'Routes', excerpt: 'map1 と map2 を分けて紹介する東京自転車ルート。' },
  { title: '東京案内書のスポット', url: 'places.html', category: 'Places', excerpt: '谷中銀座、東京ドーム、庭園、科学技術館、東京大神宮、江戸東京たてもの園。' },
  { title: 'Travel Essay', url: 'category-travel.html', category: 'Category', excerpt: '東京案内書の旅行記カテゴリー。' },
  { title: 'タグ: 東京案内書', url: 'tag-tokyo-annai.html', category: 'Tag', excerpt: 'SEOキーワード東京案内書に関連するページ一覧。' },
  { title: 'About Tokyo Slow Notes', url: 'about.html', category: 'About', excerpt: '東京案内書とブログの編集方針。' }
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
  searchResults.innerHTML = matched.map(post => `<a class="search-result" href="${post.url}"><strong>${post.title}</strong><br><span>${post.category} · ${post.excerpt}</span></a>`).join('') || '<p class="meta">No posts found.</p>';
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
  const words = article.textContent.trim().split(/\s+|。|、/).filter(Boolean).length;
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
// Temporary client-side access gate. This is not real security; HTML remains crawlable for SEO.
const ACCESS_PASSWORD = 'tokyo2026';
const ACCESS_SESSION_KEY = 'tokyo-slow-notes-access';
function initAccessGate() {
  if (sessionStorage.getItem(ACCESS_SESSION_KEY) === 'granted') return;
  document.body.classList.add('auth-lock');
  const gate = document.createElement('div');
  gate.className = 'auth-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'authTitle');
  gate.innerHTML = `
    <div class="auth-card">
      <p class="eyebrow">Private Preview</p>
      <h2 id="authTitle">Enter password</h2>
      <p>この東京案内書サイトは一時的にプレビュー制限されています。</p>
      <form class="auth-form" data-auth-form>
        <label for="previewPassword">Password</label>
        <input id="previewPassword" type="password" autocomplete="current-password" required>
        <button type="submit">Open website</button>
        <p class="auth-error" data-auth-error aria-live="polite"></p>
      </form>
      <p class="auth-note">Search engines can still read the page source for indexing.</p>
    </div>`;
  document.body.appendChild(gate);
  const input = gate.querySelector('#previewPassword');
  const error = gate.querySelector('[data-auth-error]');
  gate.querySelector('[data-auth-form]').addEventListener('submit', event => {
    event.preventDefault();
    if (input.value === ACCESS_PASSWORD) {
      sessionStorage.setItem(ACCESS_SESSION_KEY, 'granted');
      document.body.classList.remove('auth-lock');
      gate.remove();
      return;
    }
    error.textContent = 'Password is incorrect.';
    input.select();
  });
  setTimeout(() => input.focus(), 50);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessGate);
} else {
  initAccessGate();
}