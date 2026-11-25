import { actions, getState } from '../state/store.js';
import { simulateCompoundInterest } from '../utils/calculator.js';
import { formatCompactIDR, formatIDR } from '../utils/formatters.js';

function buildChartSvg(yearlySeries) {
  const width = 680;
  const height = 280;
  const padLeft = 74;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 34;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxBalance = Math.max(...yearlySeries.map((d) => d.balance), 1);
  const maxYear = Math.max(yearlySeries[yearlySeries.length - 1].year, 1);

  const toX = (year) => padLeft + (year / maxYear) * plotW;
  const toY = (val) => padTop + plotH - (val / maxBalance) * plotH;

  const totalPoints = yearlySeries.map((d) => `${toX(d.year).toFixed(1)},${toY(d.balance).toFixed(1)}`);
  const depositPoints = yearlySeries.map((d) => `${toX(d.year).toFixed(1)},${toY(d.deposit).toFixed(1)}`);

  const totalArea = [
    `M ${toX(0).toFixed(1)},${toY(0).toFixed(1)}`,
    ...yearlySeries.map((d) => `L ${toX(d.year).toFixed(1)},${toY(d.balance).toFixed(1)}`),
    `L ${toX(maxYear).toFixed(1)},${toY(0).toFixed(1)}`,
    'Z',
  ].join(' ');

  const depositArea = [
    `M ${toX(0).toFixed(1)},${toY(0).toFixed(1)}`,
    ...yearlySeries.map((d) => `L ${toX(d.year).toFixed(1)},${toY(d.deposit).toFixed(1)}`),
    `L ${toX(maxYear).toFixed(1)},${toY(0).toFixed(1)}`,
    'Z',
  ].join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    val: maxBalance * ratio,
    y: padTop + plotH - ratio * plotH,
  }));

  const step = Math.max(1, Math.ceil(maxYear / 6));
  const xTicks = yearlySeries.filter((d) => d.year === 0 || d.year === maxYear || d.year % step === 0);

  return `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Grafik proyeksi compound interest">
      <defs>
        <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.01" />
        </linearGradient>
        <linearGradient id="gradDeposit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#059669" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#059669" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      ${yTicks
        .map(
          (tick) => `
            <line
              x1="${padLeft}"
              y1="${tick.y.toFixed(1)}"
              x2="${width - padRight}"
              y2="${tick.y.toFixed(1)}"
              stroke="#e2e8f0"
              stroke-dasharray="${tick.val === 0 ? 'none' : '3 3'}"
            />
            <text
              x="${padLeft - 8}"
              y="${(tick.y + 4).toFixed(1)}"
              text-anchor="end"
              font-size="11"
              font-family="IBM Plex Mono, monospace"
              fill="#64748b"
            >
              ${formatCompactIDR(tick.val)}
            </text>
          `
        )
        .join('')}

      ${xTicks
        .map(
          (tick) => `
            <text
              x="${toX(tick.year).toFixed(1)}"
              y="${height - 10}"
              text-anchor="middle"
              font-size="11"
              font-family="IBM Plex Mono, monospace"
              fill="#64748b"
            >
              Thn ${tick.year}
            </text>
          `
        )
        .join('')}

      <path d="${totalArea}" fill="url(#gradTotal)" />
      <path d="${depositArea}" fill="url(#gradDeposit)" />

      <polyline
        fill="none"
        stroke="#059669"
        stroke-width="2.2"
        stroke-linejoin="round"
        points="${depositPoints.join(' ')}"
      />
      <polyline
        fill="none"
        stroke="#1d4ed8"
        stroke-width="2.6"
        stroke-linejoin="round"
        points="${totalPoints.join(' ')}"
      />

      ${yearlySeries
        .map(
          (d) => `
            <circle
              cx="${toX(d.year).toFixed(1)}"
              cy="${toY(d.balance).toFixed(1)}"
              r="4.5"
              fill="#1d4ed8"
              stroke="#ffffff"
              stroke-width="1.5"
              class="chart-point"
              data-year-point="${d.year}"
              style="cursor: pointer;"
            />
          `
        )
        .join('')}
    </svg>
  `;
}

function updateStageDOM(stageContainer, calcParams) {
  const sim = simulateCompoundInterest(calcParams);

  const kpiDeposit = stageContainer.querySelector('#kpi-deposit');
  const kpiInterest = stageContainer.querySelector('#kpi-interest');
  const kpiTotal = stageContainer.querySelector('#kpi-total');
  const chartBox = stageContainer.querySelector('#sim-chart-box');
  const readoutEl = stageContainer.querySelector('#sim-hover-readout');
  const tableBody = stageContainer.querySelector('#sim-table-body');

  if (kpiDeposit) kpiDeposit.textContent = formatIDR(sim.totalDeposit);
  if (kpiInterest) kpiInterest.textContent = formatIDR(sim.totalInterest);
  if (kpiTotal) kpiTotal.textContent = formatIDR(sim.finalBalance);

  if (chartBox) {
    chartBox.innerHTML = buildChartSvg(sim.yearlySeries);
    const setReadout = (point) => {
      if (!readoutEl || !point) return;
      readoutEl.innerHTML = `
        <span><strong>Tahun ke-${point.year}</strong></span>
        <span class="tabular-nums">Modal Disetor: ${formatIDR(point.deposit)}</span>
        <span class="tabular-nums" style="color: var(--emerald);">Bunga: ${formatIDR(point.interest)}</span>
        <span class="tabular-nums" style="color: var(--cobalt); font-weight: 600;">Total: ${formatIDR(point.balance)}</span>
      `;
    };

    setReadout(sim.yearlySeries[sim.yearlySeries.length - 1]);

    chartBox.querySelectorAll('[data-year-point]').forEach((circle) => {
      const year = Number(circle.getAttribute('data-year-point'));
      const point = sim.yearlySeries.find((p) => p.year === year);
      circle.addEventListener('mouseenter', () => setReadout(point));
      circle.addEventListener('click', () => setReadout(point));
    });
  }

  if (tableBody) {
    tableBody.innerHTML = sim.yearlySeries
      .slice(1)
      .map(
        (row) => `
          <tr>
            <td class="tabular-nums">Tahun ${row.year}</td>
            <td class="tabular-nums">${formatIDR(row.deposit)}</td>
            <td class="tabular-nums" style="color: var(--emerald);">${formatIDR(row.interest)}</td>
            <td class="tabular-nums" style="font-weight: 600;">${formatIDR(row.balance)}</td>
          </tr>
        `
      )
      .join('');
  }
}

export function renderSimulasiView(container) {
  const { calc } = getState();

  container.innerHTML = `
    <section aria-labelledby="simulasi-heading">
      <div class="section-header">
        <div>
          <h2 id="simulasi-heading" class="section-title">Kalkulator Simulasi Compound Interest</h2>
          <p class="section-subtitle">
            Ubah modal awal, setoran rutin bulanan, estimasi imbal hasil tahunan, dan durasi investasi secara interaktif.
          </p>
        </div>
      </div>

      <div class="sim-layout">
        <div class="sim-controls-panel">
          <div>
            <h3 class="panel-heading" style="margin-bottom: 0.5rem;">Preset Imbal Hasil</h3>
            <div class="preset-row">
              <button type="button" class="btn btn-outline btn-sm" data-preset-rate="6">Konservatif (6%)</button>
              <button type="button" class="btn btn-outline btn-sm" data-preset-rate="10">Moderat (10%)</button>
              <button type="button" class="btn btn-outline btn-sm" data-preset-rate="14">Agresif (14%)</button>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label" for="calc-initial-num">
              <span>Modal Awal</span>
              <span class="tabular-nums" id="lbl-initial">${formatCompactIDR(calc.initial)}</span>
            </label>
            <input type="number" id="calc-initial-num" class="field-control tabular-nums" min="0" max="500000000" step="500000" value="${calc.initial}" />
            <input type="range" id="calc-initial-range" class="range-slider" min="0" max="100000000" step="500000" value="${Math.min(100000000, calc.initial)}" aria-label="Slider Modal Awal" />
          </div>

          <div class="field-group">
            <label class="field-label" for="calc-monthly-num">
              <span>Investasi Rutin / Bulan</span>
              <span class="tabular-nums" id="lbl-monthly">${formatCompactIDR(calc.monthly)}</span>
            </label>
            <input type="number" id="calc-monthly-num" class="field-control tabular-nums" min="0" max="100000000" step="100000" value="${calc.monthly}" />
            <input type="range" id="calc-monthly-range" class="range-slider" min="0" max="20000000" step="100000" value="${Math.min(20000000, calc.monthly)}" aria-label="Slider Investasi Bulanan" />
          </div>

          <div class="field-group">
            <label class="field-label" for="calc-return-num">
              <span>Estimasi Return / Tahun (%)</span>
              <span class="tabular-nums" id="lbl-return">${calc.annualRate}%</span>
            </label>
            <input type="number" id="calc-return-num" class="field-control tabular-nums" min="0" max="40" step="0.5" value="${calc.annualRate}" />
            <input type="range" id="calc-return-range" class="range-slider" min="1" max="25" step="0.5" value="${Math.min(25, calc.annualRate)}" aria-label="Slider Return Tahunan" />
          </div>

          <div class="field-group">
            <label class="field-label" for="calc-years-num">
              <span>Jangka Waktu (Tahun)</span>
              <span class="tabular-nums" id="lbl-years">${calc.years} Tahun</span>
            </label>
            <input type="number" id="calc-years-num" class="field-control tabular-nums" min="1" max="40" step="1" value="${calc.years}" />
            <input type="range" id="calc-years-range" class="range-slider" min="1" max="35" step="1" value="${Math.min(35, calc.years)}" aria-label="Slider Jangka Waktu" />
          </div>
        </div>

        <div class="sim-stage-panel" id="sim-stage-panel">
          <div class="kpi-strip">
            <div class="kpi-item">
              <span class="kpi-label">Total Modal Disetor</span>
              <span class="kpi-value tabular-nums" id="kpi-deposit">-</span>
            </div>
            <div class="kpi-item">
              <span class="kpi-label">Estimasi Bunga (Compound)</span>
              <span class="kpi-value kpi-value--emerald tabular-nums" id="kpi-interest">-</span>
            </div>
            <div class="kpi-item">
              <span class="kpi-label">Total Portofolio Akhir</span>
              <span class="kpi-value kpi-value--cobalt tabular-nums" id="kpi-total">-</span>
            </div>
          </div>

          <div>
            <div class="chart-header" style="margin-bottom: 0.75rem;">
              <h3 class="panel-heading">Kurva Pertumbuhan Portofolio</h3>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-swatch legend-swatch--total" aria-hidden="true"></span>
                  Total Portofolio
                </span>
                <span class="legend-item">
                  <span class="legend-swatch legend-swatch--principal" aria-hidden="true"></span>
                  Modal Disetor
                </span>
              </div>
            </div>
            <div class="chart-container" id="sim-chart-box"></div>
            <div class="chart-hover-readout" id="sim-hover-readout" aria-live="polite"></div>
          </div>

          <details>
            <summary style="cursor: pointer; font-weight: 600; color: var(--cobalt); font-size: 0.92rem;">
              Lihat Rincian Proyeksi Tahunan
            </summary>
            <div class="table-wrap" style="margin-top: 0.9rem; max-height: 280px; overflow-y: auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Periode</th>
                    <th>Modal Disetor</th>
                    <th>Akumulasi Bunga</th>
                    <th>Total Portofolio</th>
                  </tr>
                </thead>
                <tbody id="sim-table-body"></tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </section>
  `;

  const stagePanel = container.querySelector('#sim-stage-panel');
  const localCalc = { ...calc };

  const syncAll = () => {
    container.querySelector('#lbl-initial').textContent = formatCompactIDR(localCalc.initial);
    container.querySelector('#lbl-monthly').textContent = formatCompactIDR(localCalc.monthly);
    container.querySelector('#lbl-return').textContent = `${localCalc.annualRate}%`;
    container.querySelector('#lbl-years').textContent = `${localCalc.years} Tahun`;
    updateStageDOM(stagePanel, localCalc);
    try {
      localStorage.setItem('invesgas_calc_v1', JSON.stringify(localCalc));
      getState().calc = { ...localCalc };
    } catch {
      // ignore storage errors
    }
  };

  const bindPair = (numId, rangeId, key, maxRange, parseFn) => {
    const numEl = container.querySelector(numId);
    const rangeEl = container.querySelector(rangeId);

    numEl?.addEventListener('input', () => {
      const val = Math.max(0, parseFn(numEl.value) || 0);
      localCalc[key] = val;
      if (rangeEl) rangeEl.value = String(Math.min(maxRange, val));
      syncAll();
    });

    rangeEl?.addEventListener('input', () => {
      const val = parseFn(rangeEl.value) || 0;
      localCalc[key] = val;
      if (numEl) numEl.value = String(val);
      syncAll();
    });
  };

  bindPair('#calc-initial-num', '#calc-initial-range', 'initial', 100000000, parseFloat);
  bindPair('#calc-monthly-num', '#calc-monthly-range', 'monthly', 20000000, parseFloat);
  bindPair('#calc-return-num', '#calc-return-range', 'annualRate', 25, parseFloat);
  bindPair('#calc-years-num', '#calc-years-range', 'years', 35, (v) => parseInt(v, 10));

  container.querySelectorAll('[data-preset-rate]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rate = parseFloat(btn.getAttribute('data-preset-rate'));
      actions.updateCalc({ annualRate: rate });
    });
  });

  syncAll();
}
