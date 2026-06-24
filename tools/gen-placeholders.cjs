/* =========================================================
   Genera i segnaposto SVG in assets/img/.
   Uso:  node tools/gen-placeholders.cjs
   Sostituisci poi questi file con le foto reali (stesso nome).
   ========================================================= */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'img');
fs.mkdirSync(OUT, { recursive: true });

const PAL = {
  day:    { sky1:'#bfe9f0', sky2:'#7fd0dd', sea1:'#1aa6b8', sea2:'#0c6e84', sun:'#ffd66b' },
  sunset: { sky1:'#ffd9a8', sky2:'#ff9e6d', sea1:'#d2683f', sea2:'#7a3b53', sun:'#ffb14d' },
  pool:   { sky1:'#d6f3f7', sky2:'#a7e6ee', sea1:'#37bcd0', sea2:'#1690a6', sun:'#ffe08a' },
  dusk:   { sky1:'#cfe0f2', sky2:'#9bb6dd', sea1:'#3f7ab0', sea2:'#244a73', sun:'#ffd0a0' },
};

function waves(y, c, o){
  return `<path d="M0 ${y} q150 -28 300 0 t300 0 t300 0 t300 0 t300 0 V600 H0 Z" fill="${c}" opacity="${o}"/>`;
}

function scene({ w, h, pal, umbrella=false, plate=false, sunHigh=false, label }){
  const p = PAL[pal];
  const sunY = sunHigh ? h*0.22 : h*0.34;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky1}"/><stop offset="1" stop-color="${p.sky2}"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sea1}"/><stop offset="1" stop-color="${p.sea2}"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${w*0.74}" cy="${sunY}" r="${Math.min(w,h)*0.11}" fill="${p.sun}" opacity=".95"/>
  <g transform="translate(0 ${h*0.52})" preserveAspectRatio="none">
    <rect y="0" width="${w}" height="${h*0.48}" fill="url(#sea)"/>
    ${waves(40,'#ffffff',.12)}${waves(80,'#ffffff',.10)}${waves(130,'#ffffff',.08)}
  </g>
  ${umbrella ? `<g transform="translate(${w*0.22} ${h*0.5})">
    <rect x="-3" y="0" width="6" height="${h*0.34}" rx="3" fill="#003f7a" opacity=".85"/>
    <path d="M-90 4 A90 90 0 0 1 90 4 Z" fill="#0054a4"/>
    <path d="M-90 4 A90 90 0 0 1 90 4" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/>
    <path d="M-45 4 q45 26 0 0 M45 4 q-45 26 0 0" fill="#003f7a"/>
  </g>` : ''}
  ${plate ? `<g transform="translate(${w*0.5} ${h*0.72})">
    <ellipse cx="0" cy="0" rx="120" ry="34" fill="#ffffff" opacity=".95"/>
    <ellipse cx="0" cy="-4" rx="78" ry="20" fill="none" stroke="#cfe0f2" stroke-width="3"/>
    <circle cx="0" cy="-6" r="12" fill="#0054a4"/>
  </g>` : ''}
  <rect x="14" y="${h-40}" width="${(label.length*7)+26}" height="26" rx="13" fill="#0a2a43" opacity=".55"/>
  <text x="28" y="${h-22}" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="13" fill="#fff" opacity=".95">${label}</text>
</svg>`;
}

const files = {
  'lido.svg':       scene({ w:800, h:600, pal:'day',    umbrella:true, sunHigh:true, label:'Foto: vista del Lido' }),
  'ristorante.svg': scene({ w:800, h:600, pal:'sunset', plate:true,    label:'Foto: ristorante' }),
  'g1.svg':         scene({ w:800, h:600, pal:'day',    sunHigh:true,  label:'Spiaggia' }),
  'g2.svg':         scene({ w:600, h:400, pal:'pool',                  label:'Piscina' }),
  'g3.svg':         scene({ w:600, h:400, pal:'sunset',                label:'Tramonto' }),
  'g4.svg':         scene({ w:600, h:400, pal:'day',    umbrella:true, label:'Ombrelloni' }),
  'g5.svg':         scene({ w:600, h:400, pal:'dusk',                  label:'Solarium' }),
};

// Nota: og-cover.jpg viene generato a parte componendo il logo ufficiale
// su sfondo blu brand (vedi README). Qui produciamo solo i segnaposto foto.

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content.trim());
  console.log('scritto', name, content.length, 'B');
}
console.log('Fatto.');
