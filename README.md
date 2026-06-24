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

### 4. Media (video e foto reali — già integrati dal sito originale)
In `uploads/` ci sono i **media reali** presi dal sito originale:
- **Video**: `lido.mp4` (hero, compresso 46 MB → 3 MB), `mare.mp4`–`mare4.mp4` (sezioni e galleria). Poster: `assets/img/hero-poster.jpg`.
- **Foto stagioni**: `uploads/seasons/spring|summer|autumn.webp` (card stagioni + galleria).
- **Evento**: `uploads/events/boxe.webp` (ottimizzata 2,9 MB → 36 KB).
- Le icone-servizio del vecchio sito (1024² / ~100 KB l'una) NON sono state usate: sostituite con **SVG inline** (~1 KB).
- Gli SVG `lido/ristorante/g2/g4.svg` restano come **poster** dei video mentre caricano.

Da aggiungere quando disponibili (non presenti nell'originale): una **foto dedicata al ristorante** e una **`og-cover.jpg`** fotografica (ora è di brand col logo). 9 delle 10 immagini-evento del vecchio sito non esistevano più sul server (solo `boxe` era valida).

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
