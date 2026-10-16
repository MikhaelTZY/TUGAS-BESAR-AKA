// =====================================================================
// ==CORE== : algoritma inti (iteratif & rekursif). Dipakai juga untuk pengujian.
// =====================================================================

// Iteratif: dua loop bersarang. Loop luar = posisi awal i, loop dalam = pembandingan karakter j.
function iterativeCount(text, pat, st) {
  const n = text.length, m = pat.length;
  let count = 0, cmp = 0;
  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m) {
      cmp++;
      if (text.charCodeAt(i + j) !== pat.charCodeAt(j)) break;
      j++;
    }
    if (j === m) count++;
  }
  st.cmp += cmp;
  return count;
}

// Rekursif (1): cek kecocokan pada posisi i, karakter ke-j (kedalaman maksimum m).
function matchAt(text, pat, i, j, st) {
  if (j === pat.length) return true;
  st.cmp++;
  if (text.charCodeAt(i + j) !== pat.charCodeAt(j)) return false;
  return matchAt(text, pat, i, j + 1, st);
}

// Rekursif (2): divide & conquer atas rentang posisi awal [lo, hi].
// Kedalaman rekursi O(log n) sehingga aman dari stack overflow untuk n besar.
function recursiveCount(text, pat, lo, hi, st) {
  if (lo > hi) return 0;
  if (lo === hi) return matchAt(text, pat, lo, 0, st) ? 1 : 0;
  const mid = (lo + hi) >> 1;
  return recursiveCount(text, pat, lo, mid, st) + recursiveCount(text, pat, mid + 1, hi, st);
}

function runAlgo(kind, text, pat, st) {
  const n = text.length, m = pat.length;
  if (m === 0 || m > n) return 0;
  return kind === 'iter' ? iterativeCount(text, pat, st) : recursiveCount(text, pat, 0, n - m, st);
}

// Ukur waktu rata-rata (ms) untuk menjalankan semua pola pada teks.
function measure(kind, text, patterns) {
  const once = () => { const st = { cmp: 0 }; let total = 0; for (const p of patterns) total += runAlgo(kind, text, p, st); return { total, cmp: st.cmp }; };
  const first = once();                       // pemanasan sekaligus ambil hasil & jumlah operasi
  let reps = 0, elapsed = 0;
  const t0 = performance.now();
  do { once(); reps++; elapsed = performance.now() - t0; } while (elapsed < 30 && reps < 500);
  return { ms: elapsed / reps, count: first.total, cmp: first.cmp };
}
// ==END CORE==

// =====================================================================
// Data & UI
// =====================================================================
const SAMPLE = [
 "Pantai berpasir putih dengan ombak tenang, cocok untuk berenang dan menikmati matahari terbenam. Di sekitar pantai tersedia warung makan seafood.",
 "Gunung berapi aktif dengan kawah yang menakjubkan. Pendaki biasanya memulai perjalanan dini hari untuk menikmati matahari terbit dari puncak gunung.",
 "Candi bersejarah peninggalan kerajaan kuno, kaya akan relief dan nilai budaya. Wisatawan dapat mempelajari sejarah dan budaya Jawa di kompleks ini.",
 "Taman kota yang luas dengan danau buatan, area bermain anak, dan jalur lari. Cocok untuk wisata keluarga di akhir pekan.",
 "Air terjun bertingkat di tengah hutan tropis, dengan kolam alami yang jernih. Perjalanan menuju lokasi melewati kebun teh dan sungai kecil.",
 "Museum yang menyimpan koleksi benda pusaka, kain tradisional, dan karya seni. Pengunjung bisa mengenal budaya lokal melalui pameran tetap.",
 "Pulau kecil dengan terumbu karang indah untuk snorkeling dan menyelam. Pantai di pulau ini masih sangat bersih dan sepi.",
 "Danau vulkanik di kaki gunung dengan udara sejuk. Pengunjung dapat menyewa perahu dan menikmati panorama pegunungan sekitar.",
 "Kebun raya dengan ribuan koleksi tanaman langka. Taman bunga dan jalur pejalan kaki membuat tempat ini nyaman untuk bersantai.",
 "Desa wisata yang melestarikan budaya tradisional, seperti tari, musik gamelan, dan kerajinan tangan. Wisatawan bisa menginap di rumah warga.",
 "Pantai dengan tebing karang tinggi dan pasir kuning keemasan. Banyak peselancar datang untuk menikmati ombak yang besar.",
 "Gunung dengan padang savana luas dan lautan awan. Jalur pendakian terbagi beberapa pos dengan pemandangan indah di setiap pos.",
 "Pusat perbelanjaan modern dengan restoran, bioskop, dan area hiburan. Tempat favorit untuk berbelanja oleh-oleh khas daerah.",
 "Masjid bersejarah dengan arsitektur unik yang memadukan unsur budaya lokal dan Timur Tengah. Terbuka untuk kunjungan wisata religi.",
 "Candi Buddha terbesar dengan stupa dan relief yang memukau. Waktu terbaik berkunjung adalah saat matahari terbit.",
 "Taman nasional dengan hutan hujan, satwa langka, dan jalur trekking. Pengunjung dapat melihat burung endemik dan air terjun tersembunyi.",
 "Pulau dengan pantai berpasir merah muda, air laut jernih, dan hewan komodo. Wisatawan datang untuk snorkeling dan trekking.",
 "Kampung adat dengan rumah panggung tradisional. Budaya gotong royong dan upacara adat masih dijaga hingga sekarang.",
 "Danau besar dengan pulau di tengahnya, dikelilingi perbukitan hijau. Pengunjung dapat menikmati kuliner ikan segar di tepi danau.",
 "Kebun teh yang membentang di lereng gunung. Udara sejuk dan hamparan hijau membuatnya populer untuk foto dan jalan santai.",
 "Pantai di teluk yang tenang dengan hutan bakau. Wisata perahu menyusuri bakau menjadi atraksi utama.",
 "Museum sejarah perjuangan dengan diorama dan arsip foto. Cocok untuk wisata edukasi pelajar dan keluarga.",
 "Taman bermain dengan wahana air dan kolam renang. Banyak pengunjung datang bersama keluarga saat liburan sekolah.",
 "Gunung kapur dengan gua-gua indah dan sungai bawah tanah. Wisata susur gua cocok bagi pencinta petualangan."
];

let docs = SAMPLE.slice();
let corpus = '';
let lastBench = null;

function buildCorpus() { corpus = docs.join(' ').toLowerCase(); }
function textOfSize(n) {
  if (n <= corpus.length) return corpus.slice(0, n);
  let parts = [], len = 0;
  while (len < n) { parts.push(corpus); len += corpus.length + 1; }
  return parts.join(' ').slice(0, n);
}
function updateInfo() {
  buildCorpus();
  document.getElementById('dataInfo').textContent = docs.length + ' deskripsi dimuat, total ' + corpus.length.toLocaleString('id-ID') + ' karakter. Jika input size lebih besar dari ini, teks diulang (digabung) sampai ukuran tercapai.';
}

// Parser CSV sederhana (menangani tanda kutip & baris baru di dalam kutip)
function parseCSV(s) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows;
}
document.getElementById('csvFile').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const rd = new FileReader();
  rd.onload = () => {
    const rows = parseCSV(String(rd.result));
    const col = rows[0].findIndex(h => h.trim().toLowerCase() === 'description');
    if (col < 0) { setMsg('Kolom "Description" tidak ditemukan di CSV.'); return; }
    docs = rows.slice(1).map(r => r[col]).filter(Boolean);
    setMsg(''); updateInfo();
  };
  rd.readAsText(file);
});

const $ = id => document.getElementById(id);
function setMsg(t) { $('msg').textContent = t; }
function getAlgos() {
  const v = document.querySelector('input[name=algo]:checked').value;
  return v === 'both' ? ['iter', 'rec'] : [v];
}
const LABEL = { iter: 'Iteratif', rec: 'Rekursif' };
function getPatterns() {
  if ($('scenario').value === 'worst') {
    const m = Math.max(1, Math.min(200, parseInt($('mLen').value) || 10));
    return ['a'.repeat(m - 1) + 'b'];
  }
  return $('keywords').value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}
function getText(n) {
  return $('scenario').value === 'worst' ? 'a'.repeat(n) : textOfSize(n);
}
function fmt(x) { return x < 0.01 ? x.toExponential(2) : x.toLocaleString('id-ID', { maximumFractionDigits: 3 }); }

// ---- Hitung frekuensi ----
$('btnFreq').addEventListener('click', () => {
  setMsg('');
  const pats = getPatterns(); if (!pats.length) { setMsg('Isi minimal satu kata kunci.'); return; }
  let n = parseInt($('singleN').value);
  if (!n || n < 1) n = $('scenario').value === 'worst' ? 100000 : corpus.length;
  const text = getText(n);
  const algos = getAlgos();
  const th = $('freqTable').tHead, tb = $('freqTable').tBodies[0];
  th.innerHTML = '<tr><th>Kata kunci</th><th>Panjang m</th>' + algos.map(a => `<th>Frekuensi (${LABEL[a]})</th><th>Waktu ${LABEL[a]} (ms)</th>`).join('') + '</tr>';
  tb.innerHTML = '';
  for (const p of pats) {
    let tr = `<tr><td>${p}</td><td>${p.length}</td>`;
    for (const a of algos) {
      const r = measure(a, text, [p]);
      tr += `<td>${r.count.toLocaleString('id-ID')}</td><td>${fmt(r.ms)}</td>`;
    }
    tb.insertAdjacentHTML('beforeend', tr + '</tr>');
  }
  $('freqTag').style.display = 'inline-block';
  $('freqTag').textContent = 'n = ' + text.length.toLocaleString('id-ID') + ' karakter';
});

// ---- Benchmark ----
$('btnBench').addEventListener('click', async () => {
  setMsg('');
  const pats = getPatterns(); if (!pats.length) { setMsg('Isi minimal satu kata kunci.'); return; }
  const sizes = $('sizes').value.split(',').map(s => parseInt(s.trim())).filter(x => x > 0).sort((a, b) => a - b);
  if (!sizes.length) { setMsg('Isi daftar input size yang valid.'); return; }
  const algos = getAlgos();
  const res = { sizes, algos, ms: {}, cmp: {}, count: {} };
  algos.forEach(a => { res.ms[a] = []; res.cmp[a] = []; res.count[a] = []; });
  const bar = $('progress'), inner = bar.firstElementChild;
  bar.style.display = 'block'; $('btnBench').disabled = $('btnFreq').disabled = true;
  for (let k = 0; k < sizes.length; k++) {
    const text = getText(sizes[k]);
    for (const a of algos) {
      const r = measure(a, text, pats);
      res.ms[a].push(r.ms); res.cmp[a].push(r.cmp); res.count[a].push(r.count);
    }
    inner.style.width = ((k + 1) / sizes.length * 100) + '%';
    await new Promise(r => setTimeout(r, 0));
  }
  bar.style.display = 'none'; $('btnBench').disabled = $('btnFreq').disabled = false;
  lastBench = res; renderBench(); drawChart();
});

function renderBench() {
  const r = lastBench, th = $('benchTable').tHead, tb = $('benchTable').tBodies[0];
  let h = '<tr><th>Input size n</th>';
  r.algos.forEach(a => h += `<th>${LABEL[a]} (ms)</th><th>Perbandingan karakter ${LABEL[a]}</th>`);
  if (r.algos.length === 2) h += '<th>Rasio waktu Rek/Iter</th><th>Hasil sama?</th>';
  th.innerHTML = h + '</tr>';
  tb.innerHTML = '';
  r.sizes.forEach((n, i) => {
    let t = `<tr><td>${n.toLocaleString('id-ID')}</td>`;
    r.algos.forEach(a => t += `<td>${fmt(r.ms[a][i])}</td><td>${r.cmp[a][i].toLocaleString('id-ID')}</td>`);
    if (r.algos.length === 2) {
      t += `<td>${(r.ms.rec[i] / r.ms.iter[i]).toFixed(2)}×</td><td>${r.count.iter[i] === r.count.rec[i] ? '✓' : '✗'}</td>`;
    }
    tb.insertAdjacentHTML('beforeend', t + '</tr>');
  });
}

// ---- Grafik (canvas, tanpa library) ----
function drawChart() {
  const cv = $('chart'), ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  if (!lastBench) { ctx.fillStyle = '#667085'; ctx.font = '16px sans-serif'; ctx.fillText('Jalankan benchmark untuk melihat grafik.', 30, 50); return; }
  const r = lastBench, log = $('logScale').checked;
  const L = 80, R = 30, T = 30, B = 70, pw = W - L - R, ph = H - T - B;
  const colors = { iter: '#1f77b4', rec: '#e4572e' };
  const xs = r.sizes.map(n => log ? Math.log10(n) : n);
  let allY = []; r.algos.forEach(a => r.ms[a].forEach(v => allY.push(log ? Math.log10(Math.max(v, 1e-5)) : v)));
  let xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = log ? Math.floor(Math.min(...allY)) : 0, ymax = log ? Math.ceil(Math.max(...allY)) : Math.max(...allY) * 1.1;
  if (xmin === xmax) { xmin -= 1; xmax += 1; } if (ymin === ymax) ymax = ymin + 1;
  const X = v => L + (v - xmin) / (xmax - xmin) * pw, Y = v => T + ph - (v - ymin) / (ymax - ymin) * ph;
  ctx.font = '12px sans-serif'; ctx.fillStyle = '#475467'; ctx.strokeStyle = '#e4e7ec'; ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const yv = ymin + (ymax - ymin) * i / 5, y = Y(yv);
    ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - R, y); ctx.stroke();
    ctx.textAlign = 'right'; ctx.fillText(log ? '10^' + yv.toFixed(1) : yv.toFixed(yv < 10 ? 2 : 0), L - 6, y + 4);
    const xv = xmin + (xmax - xmin) * i / 5, x = X(xv);
    ctx.textAlign = 'center'; ctx.fillText(log ? '10^' + xv.toFixed(1) : Math.round(xv).toLocaleString('id-ID'), x, H - B + 18);
  }
  ctx.strokeStyle = '#98a2b3'; ctx.strokeRect(L, T, pw, ph);
  ctx.fillStyle = '#1d2433'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Input size n (jumlah karakter)' + (log ? ' – log10' : ''), L + pw / 2, H - 22);
  ctx.save(); ctx.translate(20, T + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Running time (ms)' + (log ? ' – log10' : ''), 0, 0); ctx.restore();
  r.algos.forEach((a, k) => {
    ctx.strokeStyle = colors[a]; ctx.fillStyle = colors[a]; ctx.lineWidth = 2; ctx.beginPath();
    r.sizes.forEach((n, i) => { const v = log ? Math.log10(Math.max(r.ms[a][i], 1e-5)) : r.ms[a][i]; const x = X(xs[i]), y = Y(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke();
    r.sizes.forEach((n, i) => { const v = log ? Math.log10(Math.max(r.ms[a][i], 1e-5)) : r.ms[a][i]; ctx.beginPath(); ctx.arc(X(xs[i]), Y(v), 3.5, 0, 7); ctx.fill(); });
    ctx.fillRect(L + 12 + k * 120, T + 10, 14, 14); ctx.fillStyle = '#1d2433'; ctx.textAlign = 'left'; ctx.fillText(LABEL[a], L + 32 + k * 120, T + 22);
  });
}
$('logScale').addEventListener('change', drawChart);

updateInfo(); drawChart();
