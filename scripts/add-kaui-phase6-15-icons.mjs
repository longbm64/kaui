import fs from 'node:fs';
import path from 'node:path';
const dir = path.join(process.cwd(), 'icons/source/kaui'); fs.mkdirSync(dir, { recursive: true });
const phases = {
  6: 'briefcase building calendar-plus calendar-check clipboard-check clipboard-x folder-check folder-x invoice file-spreadsheet user-settings users-plus badge-check approval workflow branch milestone task tasks filter-plus sort-asc sort-desc export import download-cloud'.split(' '),
  7: 'location location-plus navigation route map-search map-pin-plus warehouse delivery package-search package-x truck-fast truck-off car bike plane train ship fuel compass-navigation parking'.split(' '),
  8: 'bot sparkles brain ai-stars wand prompt terminal-square braces brackets git-commit git-merge git-pull-request git-branch bug bug-off test-tube rocket deployment pipeline api sdk function variable command code-review'.split(' '),
  9: 'money currency dollar euro credit-card-plus credit-card-off payment invoice-paid invoice-due refund receipt-text piggy-bank safe vault chart-candlestick wallet-cards tax fee commission billing'.split(' '),
  10: 'medical-cross hospital stethoscope pill health heart-pulse thermometer calendar-medical patient accessibility-sign emergency first-aid'.split(' '),
  11: 'lightbulb lightbulb-off thermostat air-conditioner door door-open lock-keyhole wifi-router smart-tv speaker camera-home plug power battery battery-low solar-panel'.split(' '),
  12: 'hotel bed room-service luggage passport ticket boarding-pass airport flight car-rental restaurant coffee map-route suitcase wifi-hotel'.split(' '),
  13: 'graduation-cap school classroom student teacher certificate presentation library research quiz question lesson notebook pencil calculator'.split(' '),
  14: 'article newspaper rss live broadcast comment comments quote hashtag mention share-2 bookmark-plus bookmark-check moderation content-calendar publish draft schedule-publish'.split(' '),
  15: 'gamepad trophy medal target joystick dice puzzle fire crown music-note volume-high movie tv radio'.split(' ')
};
const glyphs = [
  '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
  '<path d="M3 12h18M12 3v18M5 5l14 14M19 5 5 19"/>',
  '<path d="M4 18 10 6l4 8 3-5 3 9z"/>',
  '<path d="M5 5h14v14H5zM8 9h8M8 13h5"/>'
];
let created = 0;
for (const [phase, names] of Object.entries(phases)) names.forEach((name, index) => {
  const file = path.join(dir, `${name}.svg`);
  if (!fs.existsSync(file)) { fs.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyphs[(Number(phase) + index) % glyphs.length]}</svg>\n`); created++; }
});
console.log(`[icons:phase6-15:add] Ensured ${created} new icons across phases 6-15.`);
