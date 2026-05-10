// Progressive enhancements: theme, search, reading time, sharing, scroll UI.
const posts = [
  { title: '自転車で巡る東京の静けさと記憶', url: 'article.html', category: 'Travel Essay', excerpt: '谷中銀座から江戸東京たてもの園まで、東京を自転車で巡る旅。' },
  { title: '都心で呼吸できる庭園', url: 'article.html#garden', category: 'Garden', excerpt: '小石川後楽園と皇居のお濠の静けさ。' },
  { title: '保存された過去を歩く', url: 'article.html#edo', category: 'Culture', excerpt: '江戸東京たてもの園で感じた記憶。' },
  { title: '好奇心が知性を動かす', url: 'article.html#science', category: 'Museum', excerpt: '科学技術館で見た学びの入口。' }
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