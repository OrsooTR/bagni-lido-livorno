/* =========================================================
   BAGNI LIDO LIVORNO — Tariffe (dati reali stagione 2026)
   Per aggiornare i prezzi, modifica questo file.
   Ogni gruppo: { it, en (titolo), per (it/en sottotitolo), items[] }
   ========================================================= */
window.LIDO_PRICING = [
  {
    it: 'Abbonamenti', en: 'Season passes', per: { it: 'a stagione', en: 'per season' },
    items: [
      { it: 'Adulto stagionale', en: 'Adult season', price: '€225' },
      { it: 'Ridotto A (6-8 anni)', en: 'Reduced A (ages 6-8)', price: '€150' },
      { it: 'Ridotto B (2-5 anni)', en: 'Reduced B (ages 2-5)', price: '€130' },
      { it: 'Mensile', en: 'Monthly', price: '€90' },
      { it: 'Mensile ridotto', en: 'Monthly reduced', price: '€60' },
      { it: 'Serale (dopo le 18:00)', en: 'Evening (after 6 PM)', price: '€70' },
      { it: '10 entrate', en: '10 entries', price: '€67,50' },
    ]
  },
  {
    it: 'Giornalieri', en: 'Daily', per: { it: 'al giorno', en: 'per day' },
    items: [
      { it: 'Biglietto', en: 'Day ticket', price: '€7,50' },
      { it: 'Ridotto (2-8 anni)', en: 'Reduced (ages 2-8)', price: '€4,50' },
      { it: 'Serale', en: 'Evening', price: '€3,00' },
      { it: 'Ombrellone + lettino + sdraio (mag·giu·set)', en: 'Umbrella + sunbed + deckchair (May·Jun·Sep)', price: '€20' },
      { it: 'Ombrellone + lettino + sdraio (lug·ago)', en: 'Umbrella + sunbed + deckchair (Jul·Aug)', price: '€25' },
      { it: 'Lettino singolo', en: 'Single sunbed', price: '€10' },
      { it: 'Stipetto · Spogliatoio', en: 'Locker · Changing room', price: '€10' },
    ]
  },
  {
    it: 'Cabine', en: 'Cabins', per: { it: 'a stagione', en: 'per season' },
    items: [
      { it: 'Tipologia A', en: 'Type A', price: '€3200', note: { it: 'Acqua ed energia · tavolo fisso 6 sedie · 2 poltroncine', en: 'Water & power · fixed table, 6 chairs · 2 armchairs' } },
      { it: 'Tipologia B', en: 'Type B', price: '€1500', note: { it: 'Tavolo fisso 6 sedie', en: 'Fixed table, 6 chairs' } },
      { it: 'Tipologia B1', en: 'Type B1', price: '€1200', note: { it: 'Tavolo pieghevole 6 sedie', en: 'Folding table, 6 chairs' } },
      { it: 'Tipologia C', en: 'Type C', price: '€1050', note: { it: 'Tavolo pieghevole 6 sedie', en: 'Folding table, 6 chairs' } },
    ]
  },
  {
    it: 'Ombrelloni e stipetti', en: 'Umbrellas & lockers', per: { it: 'a stagione', en: 'per season' },
    items: [
      { it: 'Ombrellone', en: 'Umbrella', price: '€1500', note: { it: 'Sdraio e lettino inclusi', en: 'Deckchair & sunbed included' } },
      { it: 'Stipetto', en: 'Locker', price: '€400', note: { it: 'Abbonamento incluso', en: 'Season pass included' } },
    ]
  },
];
