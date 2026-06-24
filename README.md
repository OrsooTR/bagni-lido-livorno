# Bagni Lido Livorno — Sito web

Sito statico (HTML/CSS/JS) bilingue **IT/EN**, senza build né dipendenze.
Si pubblica copiando i file sull'hosting Apache esistente.

## Struttura
```
/
├── index.html              Pagina unica (tutte le sezioni)
├── .htaccess               HTTPS, header sicurezza, cache, compressione
├── robots.txt · sitemap.xml
├── site.webmanifest · favicon.svg
└── assets/
    ├── css/style.css       Design system completo
    ├── js/i18n.js          Traduzioni IT/EN
    ├── js/main.js          Nav, animazioni, filtri, form, meteo
    └── img/                ← QUI vanno le foto reali (vedi sotto)
```

## Deploy
1. Carica tutti i file nella cartella pubblica del server (es. `public_html/`), mantenendo i percorsi.
2. Verifica che Apache abbia attivi i moduli `headers`, `expires`, `deflate`, `rewrite` (di norma sì).
3. Fatto. Il sito è online.

## Cosa personalizzare prima della pubblicazione

### 1. Form contatti e newsletter — CONFIGURAZIONE RICHIESTA
I form sono **funzionanti** e inviano i dati a `contact.php` (PHP, incluso).
Apri `contact.php` e imposta in cima al file:
- `MAIL_TO` → l'indirizzo dove ricevere le richieste.
- `MAIL_FROM` → un indirizzo **del tuo dominio** (es. `no-reply@bagnilidolivorno.com`).
- (opzionale) `BREVO_API_KEY` + `BREVO_LIST_ID` → se vuoi che gli iscritti alla newsletter
  finiscano in una lista Brevo. Se lasci la chiave vuota, le iscrizioni arrivano via email.

Richiede un hosting con **PHP** (praticamente tutti gli hosting Apache lo hanno).
Protezioni incluse: honeypot anti-spam, validazione, anti header-injection.

### 2. Eventi — un solo file da aggiornare
Tutto il calendario è in **`assets/js/events.js`**: modifica l'array `LIDO_EVENTS`
(giorno, mese, categoria, orario, testo IT/EN). Il sito aggiorna automaticamente
le card, i filtri e i dati strutturati `Event` per Google. `LIDO_YEAR` imposta l'anno.

### 3. Brand ufficiale (già impostato — NON sostituire)
Sono i file ufficiali presi dal sito originale:
- `assets/img/logo-blu.webp` / `assets/img/logo-bianco.webp` — logo ufficiale (usato in header e footer).
- `favicon.png` (512×512) e le icone PWA derivate — icona ufficiale.
- Palette ufficiale: **blu `#0054a4`** + bianco (definita in `:root` di `style.css`).
- `og-cover.jpg` — generata componendo il logo ufficiale su sfondo blu brand.

### 4. Foto reali (priorità alta)
Le immagini-foto in `assets/img/` sono **segnaposto SVG** (~1–1,6 KB l'uno) già collegati.
Sostituiscili con foto reali mantenendo gli stessi nomi (o aggiorna i `src` in `index.html`):
- `og-cover.jpg` (1200×630) — anteprima social. Ne ho generata una di brand: **sostituiscila con una foto reale**.
- `lido.svg`, `ristorante.svg`, `g1`–`g5.svg` → foto. Consigliato **WebP**, max ~150 KB, larghezza ~1600px.
- Icone PWA già generate: `apple-touch-icon.png`, `icon-192/512.png`, `favicon.png`.

Per rigenerare i segnaposto: `node tools/gen-placeholders.cjs`.

> Nota: le icone dei servizi del vecchio sito erano 1024×1024 / ~100 KB. Qui sono **SVG inline** (~1 KB totali).

### 5. Contenuti vari
- **Sponsor**: sezione `#sponsor`, sostituisci i nomi testuali con i loghi `<img>` reali (ottimizzati).
- **P.IVA, social, regolamento PDF**: aggiorna i link reali in footer e `<head>`.

### 6. Traduzioni EN
Generate e **da rivedere** da un madrelingua prima della pubblicazione definitiva.

## Funzionalità incluse
- SEO completa: title/description, Open Graph, Twitter Card, **JSON-LD** (BeachResort + eventi), canonical, hreflang IT/EN, sitemap.
- Switch lingua IT/EN con memoria (`localStorage`) e parametro `?lang=en`.
- Animazioni allo scroll, contatori, menu mobile, barra azioni mobile (Prenota/Chiama/Mappa).
- Filtro eventi per categoria.
- Meteo in tempo reale (Open-Meteo, senza chiave API).
- Mappa Google integrata, prenotazione verso il widget spiagge.it.
- Accessibilità: skip-link, `alt`, focus, `aria`, rispetto di `prefers-reduced-motion`.
- Performance: zero framework, icone SVG, font con `display=swap`, lazy-load.
```
```
