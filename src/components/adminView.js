import { actions, getState, isAdminUser } from '../state/store.js';
import { escapeHtml } from '../utils/sanitize.js';
import {
  openAssetFormModal,
  openAssetModal,
  openAuthModal,
  openConfirmModal,
  openModuleFormModal,
  openReaderModal,
  showToast,
} from './modals.js';

function renderModuleRows(modules) {
  if (modules.length === 0) {
    return `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--ink-muted);">
          Tidak ada modul yang sesuai dengan kata kunci pencarian.
        </td>
      </tr>
    `;
  }

  return modules
    .map(
      (item) => `
        <tr>
          <td><strong>${escapeHtml(item.judul)}</strong></td>
          <td>${escapeHtml(item.kategori)}</td>
          <td>${escapeHtml(item.level)}</td>
          <td class="tabular-nums">${escapeHtml(item.durasi)}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn-outline btn-sm" data-admin-read="${escapeHtml(item.id)}">
                Lihat
              </button>
              <button type="button" class="btn btn-outline btn-sm" data-admin-edit="${escapeHtml(item.id)}">
                Edit
              </button>
              <button type="button" class="btn btn-danger btn-sm" data-admin-delete="${escapeHtml(item.id)}">
                Hapus
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function renderAssetRows(assets) {
  if (assets.length === 0) {
    return `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--ink-muted);">
          Tidak ada aset yang sesuai dengan kata kunci pencarian.
        </td>
      </tr>
    `;
  }

  return assets
    .map(
      (asset) => `
        <tr>
          <td><strong>${escapeHtml(asset.nama)}</strong></td>
          <td>${escapeHtml(asset.risiko)}</td>
          <td class="tabular-nums">${escapeHtml(asset.potensi)}</td>
          <td>${escapeHtml(asset.likuiditas)}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn-outline btn-sm" data-asset-read="${escapeHtml(asset.id)}">
                Lihat
              </button>
              <button type="button" class="btn btn-outline btn-sm" data-asset-edit="${escapeHtml(asset.id)}">
                Edit
              </button>
              <button type="button" class="btn btn-danger btn-sm" data-asset-delete="${escapeHtml(asset.id)}">
                Hapus
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function bindModuleTableEvents(tbody) {
  tbody.querySelectorAll('[data-admin-read]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openReaderModal(btn.getAttribute('data-admin-read'));
    });
  });

  tbody.querySelectorAll('[data-admin-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModuleFormModal(btn.getAttribute('data-admin-edit'));
    });
  });

  tbody.querySelectorAll('[data-admin-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-admin-delete');
      const target = getState().modules.find((m) => m.id === id);
      openConfirmModal({
        title: 'Hapus Modul Pembelajaran',
        message: `Modul "${target?.judul || 'ini'}" akan dihapus dari daftar secara permanen.`,
        confirmLabel: 'Hapus Modul',
        danger: true,
        onConfirm: () => {
          actions.deleteModule(id);
          showToast('Modul telah dihapus.');
        },
      });
    });
  });
}

function bindAssetTableEvents(tbody) {
  tbody.querySelectorAll('[data-asset-read]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openAssetModal(btn.getAttribute('data-asset-read'));
    });
  });

  tbody.querySelectorAll('[data-asset-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openAssetFormModal(btn.getAttribute('data-asset-edit'));
    });
  });

  tbody.querySelectorAll('[data-asset-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-asset-delete');
      const target = getState().assets.find((a) => a.id === id);
      openConfirmModal({
        title: 'Hapus Aset Investasi',
        message: `Aset "${target?.nama || 'ini'}" akan dihapus dari katalog secara permanen.`,
        confirmLabel: 'Hapus Aset',
        danger: true,
        onConfirm: () => {
          actions.deleteAsset(id);
          showToast('Aset investasi telah dihapus.');
        },
      });
    });
  });
}

export function renderAdminView(container) {
  if (!isAdminUser()) {
    container.innerHTML = `
      <section aria-labelledby="admin-locked-heading">
        <div class="empty-state">
          <h2 id="admin-locked-heading" style="margin-bottom: 0.5rem;">Akses Khusus Admin</h2>
          <p>Silakan masuk menggunakan akun Admin untuk membuka Dashboard Admin dan mengelola modul maupun judul aset.</p>
          <button type="button" class="btn btn-primary" id="btn-admin-login-prompt">Masuk sebagai Admin</button>
        </div>
      </section>
    `;
    container.querySelector('#btn-admin-login-prompt')?.addEventListener('click', () => {
      openAuthModal('login');
    });
    return;
  }

  const state = getState();
  const { adminTab, modules, assets, bookmarks } = state;
  const isAssetTab = adminTab === 'aset';

  container.innerHTML = `
    <section aria-labelledby="admin-heading">
      <div class="section-header">
        <div>
          <h2 id="admin-heading" class="section-title">Dashboard Admin InvesGas</h2>
          <p class="section-subtitle">
            Kelola daftar modul pembelajaran dan katalog judul aset investasi beserta analisis risikonya.
          </p>
        </div>

        <div class="segmented-bar" role="tablist" aria-label="Kategori Pengelolaan Admin">
          <button
            type="button"
            role="tab"
            class="segmented-btn ${!isAssetTab ? 'is-active' : ''}"
            aria-selected="${!isAssetTab}"
            data-admin-tab="modul"
          >
            Kelola Modul (${modules.length})
          </button>
          <button
            type="button"
            role="tab"
            class="segmented-btn ${isAssetTab ? 'is-active' : ''}"
            aria-selected="${isAssetTab}"
            data-admin-tab="aset"
          >
            Kelola Aset (${assets.length})
          </button>
        </div>
      </div>

      <div class="sim-stage-panel" style="margin-bottom: 1.5rem; padding: 1.25rem 1.5rem;">
        <div class="kpi-strip" style="padding-bottom: 0; border-bottom: none;">
          <div class="kpi-item">
            <span class="kpi-label">Total Modul Edukasi</span>
            <span class="kpi-value tabular-nums">${modules.length} Modul</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">Total Judul Aset</span>
            <span class="kpi-value kpi-value--emerald tabular-nums">${assets.length} Aset</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-label">Bookmark Tersimpan</span>
            <span class="kpi-value kpi-value--cobalt tabular-nums">${bookmarks.length} Materi</span>
          </div>
        </div>
      </div>

      <div class="admin-toolbar">
        <div class="admin-search-wrap">
          <label class="sr-only" for="admin-search-input">Cari data admin</label>
          <input
            type="search"
            id="admin-search-input"
            class="field-control"
            placeholder="${isAssetTab ? 'Cari judul aset atau tingkat risiko...' : 'Cari judul atau kategori modul...'}"
            value="${escapeHtml(state.adminSearchQuery)}"
          />
        </div>
        <div class="admin-action-group">
          <button type="button" class="btn btn-outline" id="btn-admin-reset">
            ${isAssetTab ? 'Reset Aset Default' : 'Reset Modul Default'}
          </button>
          <button type="button" class="btn btn-primary" id="btn-admin-add-aset">
            + Tambah Judul Aset
          </button>
          <button type="button" class="btn btn-cobalt" id="btn-admin-add-modul">
            + Tambah Modul
          </button>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            ${
              isAssetTab
                ? `
                  <tr>
                    <th>Judul Aset</th>
                    <th>Tingkat Risiko</th>
                    <th>Potensi Return</th>
                    <th>Likuiditas</th>
                    <th>Aksi</th>
                  </tr>
                `
                : `
                  <tr>
                    <th>Judul Modul</th>
                    <th>Kategori</th>
                    <th>Tingkat</th>
                    <th>Durasi Baca</th>
                    <th>Aksi</th>
                  </tr>
                `
            }
          </thead>
          <tbody id="admin-tbody"></tbody>
        </table>
      </div>
    </section>
  `;

  container.querySelectorAll('[data-admin-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      actions.setAdminTab(btn.getAttribute('data-admin-tab'));
    });
  });

  const tbody = container.querySelector('#admin-tbody');

  const updateRows = () => {
    const latest = getState();
    const q = latest.adminSearchQuery.trim().toLowerCase();

    if (isAssetTab) {
      const filteredAssets = latest.assets.filter(
        (asset) =>
          !q ||
          asset.nama.toLowerCase().includes(q) ||
          asset.risiko.toLowerCase().includes(q) ||
          asset.likuiditas.toLowerCase().includes(q)
      );
      tbody.innerHTML = renderAssetRows(filteredAssets);
      bindAssetTableEvents(tbody);
    } else {
      const filteredModules = latest.modules.filter(
        (item) =>
          !q ||
          item.judul.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q) ||
          item.level.toLowerCase().includes(q)
      );
      tbody.innerHTML = renderModuleRows(filteredModules);
      bindModuleTableEvents(tbody);
    }
  };

  updateRows();

  container.querySelector('#admin-search-input')?.addEventListener('input', (event) => {
    state.adminSearchQuery = event.target.value;
    updateRows();
  });

  container.querySelector('#btn-admin-add-modul')?.addEventListener('click', () => {
    openModuleFormModal(null);
  });

  container.querySelector('#btn-admin-add-aset')?.addEventListener('click', () => {
    openAssetFormModal(null);
  });

  container.querySelector('#btn-admin-reset')?.addEventListener('click', () => {
    if (isAssetTab) {
      openConfirmModal({
        title: 'Pulihkan Aset Default',
        message: 'Semua perubahan dan judul aset tambahan Anda akan dikembalikan ke daftar bawaan.',
        confirmLabel: 'Pulihkan Default',
        danger: true,
        onConfirm: () => {
          actions.resetAssetsToDefault();
          showToast('Daftar aset berhasil dikembalikan ke default.');
        },
      });
    } else {
      openConfirmModal({
        title: 'Pulihkan Modul Default',
        message: 'Semua perubahan dan modul tambahan Anda akan dikembalikan ke daftar materi bawaan.',
        confirmLabel: 'Pulihkan Default',
        danger: true,
        onConfirm: () => {
          actions.resetModulesToDefault();
          showToast('Daftar modul berhasil dikembalikan ke default.');
        },
      });
    }
  });
}
