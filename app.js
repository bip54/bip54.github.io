const feed = document.getElementById('feed');
const root = document.documentElement;

const palette = ['#f7931a','#e0245e','#1da1f2','#794bc4','#17bf63','#f45d22','#495057','#0f766e'];
function colorFor(str){
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
function initials(name){
  return name.replace(/[^a-zA-Z ]/g,'').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}
function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

const BIRD = '<svg class="bird" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.2-.8.5-1.6.8-2.5 1a3.9 3.9 0 0 0-6.7 3.6A11 11 0 0 1 4 4.9a3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.8-.6.2-1.2.2-1.8.1.5 1.6 2 2.7 3.7 2.7A7.8 7.8 0 0 1 2 18.6 11 11 0 0 0 8 20c7.2 0 11.1-6 11.1-11.1v-.5c.8-.6 1.4-1.3 1.9-2.1z"/></svg>';
const NOSTR_BADGE = '<span class="src-badge src-badge--nostr">nostr</span>';

function card(t){
  const nostr = t.platform === 'nostr';
  const av = nostr ? '#8e30eb' : colorFor(t.handle);
  const handle = nostr ? esc(t.handle) : '@' + esc(t.handle);
  const icon = nostr ? NOSTR_BADGE : BIRD;
  const linkText = nostr ? 'view on nostr &#8599;' : 'view original &#8599;';
  const avatar = t.avatar
    ? `<img class="avatar" src="${esc(t.avatar)}" alt="${esc(t.name)}" width="44" height="44" loading="lazy">`
    : `<div class="avatar" style="--av:${av}">${initials(t.name)}</div>`;
  return `
  <article class="tweet${nostr ? ' tweet--nostr' : ''}">
    <header class="tweet-head">
      ${avatar}
      <div class="who">
        <span class="name">${esc(t.name)}</span>
        <span class="handle">${handle}</span>
      </div>
      ${icon}
    </header>
    <p class="tweet-text">${esc(t.text)}</p>
    <footer class="tweet-foot">
      <span class="date">${esc(t.date)}</span>
      <a class="src" href="${esc(t.url)}" target="_blank" rel="noopener">${linkText}</a>
    </footer>
  </article>`;
}

async function load(){
  try{
    const res = await fetch('tweets.json');
    const data = await res.json();
    feed.innerHTML = data.map(card).join('');
  }catch(e){
    feed.innerHTML = '<p class="err">Could not load tweets.json — serve this folder over HTTP.</p>';
  }
}

const modeBtn = document.getElementById('mode-toggle');
modeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-mode', next);
  try{ localStorage.setItem('bip54-mode', next); }catch(e){}
});

load();
