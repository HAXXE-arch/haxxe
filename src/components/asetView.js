import { actions, getState } from '../state/store.js';
import { escapeHtml } from '../utils/sanitize.js';
import { openAssetModal } from './modals.js';

function getRiskTextClass(tier) {
  if (tier === 'Rendah') return 'risk-text-low';
  if (tier === 'Tinggi') return 'risk-text-high';
  return 'risk-text-medium';
}

export function renderAsetView(container) {
  const { assets, assetRiskFilter } = getState();

  const filtered =
    assetRiskFilter === 'ALL'
      ? assets
      : assets.filter((item) => item.risikoTier === assetRiskFilter);

  container.innerHTML = `
    <section aria-labelledby="aset-heading">
      <div class="section-header">
        <div>
          <h2 id="aset-heading" class="section-title">Katalog Instrumen Aset &amp; Risiko</h2>
          <p class="section-subtitle">
            Bandingkan profil risiko, ekspektasi imbal hasil historis, likuiditas, serta horison ideal tiap instrumen.
          </p>
        </div>

        <div class="segmented-bar" role="group" aria-label="Filter Tingkat Risiko Aset">
          ${[
            { key: 'ALL', label: 'Semua' },
            { key: 'Rendah', label: 'Risiko Rendah' },
            { key: 'Sedang', label: 'Sedang' },
            { key: 'Tinggi', label: 'Risiko Tinggi' },
          ]
            .map(
              (opt) => `
                <button
                  type="button"
                  class="segmented-btn ${assetRiskFilter === opt.key ? 'is-active' : ''}"
                  data-risk-filter="${opt.key}"
                >
                  ${opt.label}
                </button>
              `
            )
            .join('')}
        </div>
      </div>

      <div class="card-grid">
        ${filtered
          .map(
            (asset) => `
              <article class="content-card">
                <div class="card-media">
                  <img
                    src="${escapeHtml(asset.imageUrl)}"
                    alt="${escapeHtml(asset.nama)}"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
                  />
                  <div class="card-media-fallback" hidden>
                    <strong>${escapeHtml(asset.nama)}</strong>
                    <span>Risiko ${escapeHtml(asset.risiko)}</span>
                  </div>
                </div>
                <div class="card-body">
                  <div class="meta-line">
                    <span class="${getRiskTextClass(asset.risikoTier)}">Risiko ${escapeHtml(asset.risiko)}</span>
                    <span class="meta-sep" aria-hidden="true">&middot;</span>
                    <span>Horison ${escapeHtml(asset.horison)}</span>
                  </div>
                  <h3 class="card-title">${escapeHtml(asset.nama)}</h3>
                  <p class="card-desc">${escapeHtml(asset.deskripsi)}</p>

                  <div class="asset-metrics-row">
                    <div>
                      <span class="asset-metric-label">Potensi Imbal Hasil</span>
                      <span class="asset-metric-val tabular-nums" style="color: var(--emerald);">${escapeHtml(
                        asset.potensi
                      )}</span>
                    </div>
                    <div>
                      <span class="asset-metric-label">Likuiditas</span>
                      <span class="asset-metric-val">${escapeHtml(asset.likuiditas)}</span>
                    </div>
                  </div>

                  <div class="card-footer">
                    <button
                      type="button"
                      class="btn btn-cobalt"
                      style="width: 100%;"
                      data-open-asset="${escapeHtml(asset.id)}"
                    >
                      Detail &amp; Analisis Risiko
                    </button>
                  </div>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;

  container.querySelectorAll('[data-risk-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      actions.setAssetRiskFilter(btn.getAttribute('data-risk-filter'));
    });
  });

  container.querySelectorAll('[data-open-asset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openAssetModal(btn.getAttribute('data-open-asset'));
    });
  });
}
