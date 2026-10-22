document.getElementById('year').textContent = new Date().getFullYear();

// Código que se escribe solo en la ventana del hero
const lines = [
  '<span class="c">// quién soy</span>',
  '<span class="k">const</span> christian = {',
  '  edad: <span class="s">19</span>,',
  '  estudios: <span class="s">"Desarrollo de Aplicaciones Web"</span>,',
  '  aprendiendo: [<span class="s">"JavaScript"</span>, <span class="s">"PHP"</span>, <span class="s">"SQL"</span>],',
  '  objetivo: <span class="s">"crear webs que importen"</span>',
  '};'
];
const el = document.getElementById('code');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (calm) {
  el.innerHTML = lines.join('\n');
} else {
  const html = lines.join('\n');
  let i = 0, out = '';
  (function tick() {
    if (html[i] === '<') { const end = html.indexOf('>', i); out += html.slice(i, end + 1); i = end + 1; }
    else { out += html[i++]; }
    el.innerHTML = out + '<span class="caret"></span>';
    if (i < html.length) setTimeout(tick, html[i - 1] === '\n' ? 260 : 24);
  })();
}

// Mancha de color que sigue suavemente al ratón
const blob = document.getElementById('blob');
if (!calm && matchMedia('(pointer:fine)').matches) {
  addEventListener('pointermove', e => {
    blob.style.transform = `translate(${(e.clientX / innerWidth - .5) * 120}px, ${(e.clientY / innerHeight - .5) * 80}px)`;
  }, { passive: true });
}

const KW = {
  js: 'const let var function return if else class new async await for of in throw try catch static this null true false default',
  php: 'declare class final function public private return new echo foreach as if else',
  java: 'import class enum record public private final new return throw if else static void double int',
  sql: 'create table primary key auto_increment not null unique default foreign references select from join on where and group by order desc is interval',
  css: 'media grid-template-columns display gap border-radius padding background transition transform box-shadow'
};
for (const k in KW) KW[k] = new Set(KW[k].split(' '));
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const REST = /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b([A-Za-z_][\w-]*)\b(?=\()|\b([A-Za-z_][\w-]*)\b/.source;
function hl(code, lang) {
  const re = new RegExp('(' + (lang === 'sql' ? '--.*' : '\\/\\/.*') + '|\\/\\*[\\s\\S]*?\\*\\/)|' + REST, 'g');
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const t = m[0], isKw = KW[lang].has(t.toLowerCase());
    if (m[1]) out += `<span class="c">${esc(t)}</span>`;
    else if (m[2]) out += `<span class="s">${esc(t)}</span>`;
    else if (m[3]) out += `<span class="${isKw ? 'k' : 'f'}">${esc(t)}</span>`;
    else out += isKw ? `<span class="k">${esc(t)}</span>` : esc(t);
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}
const snip = document.getElementById('snip'), fname = document.getElementById('fname');
const tabs = document.querySelectorAll('.tab');
let cur = 0;
function showSnippet(i) {
  cur = i;
  snip.innerHTML = hl(snippets[i].code, snippets[i].lang);
  fname.textContent = snippets[i].file;
  tabs.forEach((t, n) => t.setAttribute('aria-selected', n === i));
}
tabs.forEach(t => t.addEventListener('click', () => showSnippet(+t.dataset.i)));
const copyBtn = document.getElementById('copy');
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(snippets[cur].code).then(() => {
    copyBtn.textContent = 'Copiado';
    setTimeout(() => copyBtn.textContent = 'Copiar', 1600);
  });
});
showSnippet(0);

// Barra de progreso de lectura (una actualización por fotograma)
const prog = document.getElementById('prog');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement;
    prog.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
    ticking = false;
  });
}, { passive: true });

// Modo claro y oscuro: se recuerda tu elección
const root = document.documentElement, themeBtn = document.getElementById('theme');
const setLabel = () => themeBtn.setAttribute('aria-label',
  root.dataset.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  setLabel();
});
setLabel();

// Repositorios reales desde la API de GitHub
const gh = document.getElementById('gh-list');
fetch('https://api.github.com/users/christiiangv/repos?sort=updated&per_page=30')
  .then(r => { if (!r.ok) throw 0; return r.json(); })
  .then(rs => {
    rs = rs.filter(r => !r.fork).slice(0, 6);
    if (!rs.length) throw 0;
    gh.innerHTML = rs.map(r => `<a class="repo" href="${r.html_url}" target="_blank" rel="noopener">
      <h3>${esc(r.name)}</h3><p>${esc(r.description || 'Sin descripción todavía.')}</p>
      <div class="meta"><span><i class="dot"></i>${esc(r.language || 'Varios')}</span><span>★ ${r.stargazers_count}</span></div></a>`).join('');
  })
  .catch(() => { gh.innerHTML = '<p class="sub">Mira todos mis repositorios en <a href="https://github.com/christiiangv?tab=repositories">github.com/christiiangv</a>.</p>'; });
