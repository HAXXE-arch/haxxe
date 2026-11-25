import { actions, getState } from '../state/store.js';
import { contentToEditableText, escapeHtml, renderSafeParagraphs } from '../utils/sanitize.js';

let activeCleanup = null;
let lastFocusedElement = null;

/**
 * Displays a non-blocking toast notification.
 * @param {string} message
 * @param {'default' | 'error'} variant
 */
export function showToast(message, variant = 'default') {
  const root = document.getElementById('toast-root');
  if (!root) return;

  const toast = document.createElement('div');
  toast.className = `toast-item ${variant === 'error' ? 'toast-item--error' : ''}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;

  root.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

export function closeActiveModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;
  modalRoot.innerHTML = '';

  if (typeof activeCleanup === 'function') {
    activeCleanup();
    activeCleanup = null;
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function mountModal({ titleId, narrow = false, bodyHtml, onMount }) {
  closeActiveModal();
  lastFocusedElement = document.activeElement;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="active-modal-backdrop">
      <div
        class="modal-dialog ${narrow ? 'modal-dialog--narrow' : ''}"
        role="dialog"
        aria-modal="true"
        aria-labelledby="${escapeHtml(titleId)}"
        tabindex="-1"
      >
        <button type="button" class="modal-close-btn" id="modal-close-x" aria-label="Tutup jendela">&times;</button>
        ${bodyHtml}
      </div>
    </div>
  `;

  const backdrop = document.getElementById('active-modal-backdrop');
  const dialog = backdrop?.querySelector('.modal-dialog');
  const closeBtn = document.getElementById('modal-close-x');

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeActiveModal();
    }
  };

  backdrop?.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      closeActiveModal();
    }
  });

  closeBtn?.addEventListener('click', closeActiveModal);
  document.addEventListener('keydown', onKeyDown);

  activeCleanup = () => {
    document.removeEventListener('keydown', onKeyDown);
  };

  if (typeof onMount === 'function') {
    onMount(dialog);
  }

  dialog?.focus();
}

export function openReaderModal(moduleId) {
  const { modules, bookmarks } = getState();
  const modul = modules.find((item) => item.id === moduleId);
  if (!modul) return;

  const isSaved = bookmarks.includes(modul.id);

  mountModal({
    titleId: 'reader-modal-title',
    bodyHtml: `
      <div class="meta-line">
        <span>${escapeHtml(modul.kategori)}</span>
        <span class="meta-sep" aria-hidden="true">&middot;</span>
        <span>${escapeHtml(modul.level)}</span>
        <span class="meta-sep" aria-hidden="true">&middot;</span>
        <span>Waktu baca ${escapeHtml(modul.durasi)}</span>
      </div>
      <h2 class="modal-title" id="reader-modal-title">${escapeHtml(modul.judul)}</h2>
      <hr class="modal-divider" />
      <div class="modal-prose">
        ${renderSafeParagraphs(modul.materiLengkap || modul.deskripsi)}
      </div>
      <hr class="modal-divider" />
      <div class="modal-footer-actions">
        <button type="button" class="btn ${isSaved ? 'btn-saved' : 'btn-primary'}" id="reader-toggle-save">
          ${isSaved ? 'Tersimpan di Bookmark' : 'Simpan ke Bookmark'}
        </button>
        <button type="button" class="btn btn-outline" id="reader-close-btn">Tutup</button>
      </div>
    `,
    onMount: () => {
      document.getElementById('reader-close-btn')?.addEventListener('click', closeActiveModal);
      const saveBtn = document.getElementById('reader-toggle-save');
      saveBtn?.addEventListener('click', () => {
        const added = actions.toggleBookmark(modul.id);
        saveBtn.textContent = added ? 'Tersimpan di Bookmark' : 'Simpan ke Bookmark';
        saveBtn.className = `btn ${added ? 'btn-saved' : 'btn-primary'}`;
        showToast(added ? 'Modul disimpan ke Bookmark.' : 'Modul dihapus dari Bookmark.');
      });
    },
  });
}

export function openAssetModal(assetId) {
  const { assets } = getState();
  const asset = assets.find((item) => item.id === assetId);
  if (!asset) return;

  mountModal({
    titleId: 'asset-modal-title',
    bodyHtml: `
      <div class="meta-line">
        <span>Risiko: ${escapeHtml(asset.risiko)}</span>
        <span class="meta-sep" aria-hidden="true">&middot;</span>
        <span>Horison ${escapeHtml(asset.horison)}</span>
      </div>
      <h2 class="modal-title" id="asset-modal-title">${escapeHtml(asset.nama)}</h2>
      <p class="tabular-nums" style="color: var(--emerald); font-weight: 600; margin-bottom: 0.75rem;">
        Estimasi Imbal Hasil: ${escapeHtml(asset.potensi)} &middot; Likuiditas: ${escapeHtml(asset.likuiditas)}
      </p>
      <hr class="modal-divider" />
      <div class="modal-prose">
        ${renderSafeParagraphs(asset.detailLengkap || asset.deskripsi)}
      </div>
      <div class="modal-footer-actions">
        <button type="button" class="btn btn-outline" id="asset-close-btn">Tutup</button>
      </div>
    `,
    onMount: () => {
      document.getElementById('asset-close-btn')?.addEventListener('click', closeActiveModal);
    },
  });
}

export function openModuleFormModal(moduleId = null) {
  const { modules } = getState();
  const existing = moduleId ? modules.find((item) => item.id === moduleId) : null;
  const materiText = existing
    ? contentToEditableText(existing.materiLengkap || existing.deskripsi)
    : '';

  mountModal({
    titleId: 'module-form-title',
    bodyHtml: `
      <h2 class="modal-title" id="module-form-title">
        ${existing ? 'Edit Modul Pembelajaran' : 'Tambah Modul Baru'}
      </h2>
      <p style="font-size: 0.9rem; color: var(--ink-muted);">
        Perubahan disimpan secara lokal pada browser Anda.
      </p>
      <form class="modal-form" id="module-crud-form" novalidate>
        <div class="field-group">
          <label class="field-label" for="form-judul">Judul Modul</label>
          <input
            type="text"
            id="form-judul"
            class="field-control"
            value="${escapeHtml(existing?.judul || '')}"
            placeholder="Contoh: Memahami Dividen Saham Bluechip"
            required
          />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
          <div class="field-group">
            <label class="field-label" for="form-kategori">Kategori</label>
            <select id="form-kategori" class="field-control">
              ${['Dasar Investasi', 'Pasar Modal', 'Pendapatan Tetap', 'Manajemen Risiko']
                .map(
                  (cat) =>
                    `<option value="${cat}" ${existing?.kategori === cat ? 'selected' : ''}>${cat}</option>`
                )
                .join('')}
            </select>
          </div>
          <div class="field-group">
            <label class="field-label" for="form-level">Tingkat Kesulitan</label>
            <select id="form-level" class="field-control">
              ${['Pemula', 'Menengah', 'Lanjutan']
                .map(
                  (lvl) =>
                    `<option value="${lvl}" ${existing?.level === lvl ? 'selected' : ''}>${lvl}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label" for="form-durasi">Estimasi Durasi Baca</label>
          <input
            type="text"
            id="form-durasi"
            class="field-control"
            value="${escapeHtml(existing?.durasi || '6 Menit')}"
            required
          />
        </div>
        <div class="field-group">
          <label class="field-label" for="form-deskripsi">Ringkasan Singkat</label>
          <textarea id="form-deskripsi" class="field-control" rows="2" required>${escapeHtml(
            existing?.deskripsi || ''
          )}</textarea>
        </div>
        <div class="field-group">
          <label class="field-label" for="form-materi">Isi Materi Lengkap (pisahkan paragraf dengan baris kosong)</label>
          <textarea id="form-materi" class="field-control" rows="5" required>${escapeHtml(
            materiText
          )}</textarea>
        </div>
        <p class="form-error" id="module-form-error" hidden></p>
        <div class="modal-footer-actions">
          <button type="button" class="btn btn-outline" id="module-form-cancel">Batal</button>
          <button type="submit" class="btn btn-primary">Simpan Modul</button>
        </div>
      </form>
    `,
    onMount: () => {
      document.getElementById('module-form-cancel')?.addEventListener('click', closeActiveModal);
      const form = document.getElementById('module-crud-form');
      const errEl = document.getElementById('module-form-error');

      form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const judul = document.getElementById('form-judul').value.trim();
        const kategori = document.getElementById('form-kategori').value;
        const level = document.getElementById('form-level').value;
        const durasi = document.getElementById('form-durasi').value.trim();
        const deskripsi = document.getElementById('form-deskripsi').value.trim();
        const materiRaw = document.getElementById('form-materi').value.trim();

        if (!judul || !durasi || !deskripsi || !materiRaw) {
          errEl.textContent = 'Semua kolom wajib diisi sebelum menyimpan modul.';
          errEl.hidden = false;
          return;
        }

        const materiLengkap = materiRaw
          .split(/\n{2,}|\r\n\r\n/)
          .map((p) => p.trim())
          .filter(Boolean);

        actions.saveModule({
          id: existing?.id || null,
          judul,
          kategori,
          level,
          durasi,
          deskripsi,
          materiLengkap,
        });

        closeActiveModal();
        showToast(existing ? 'Modul berhasil diperbarui.' : 'Modul baru berhasil ditambahkan.');
      });
    },
  });
}

export function openAssetFormModal(assetId = null) {
  const { assets } = getState();
  const existing = assetId ? assets.find((item) => item.id === assetId) : null;
  const detailText = existing
    ? contentToEditableText(existing.detailLengkap || existing.deskripsi)
    : '';

  mountModal({
    titleId: 'asset-form-title',
    bodyHtml: `
      <h2 class="modal-title" id="asset-form-title">
        ${existing ? 'Edit Aset Investasi' : 'Tambah Judul Aset Baru'}
      </h2>
      <p style="font-size: 0.9rem; color: var(--ink-muted);">
        Data aset akan tampil pada Katalog Instrumen Aset &amp; Risiko.
      </p>
      <form class="modal-form" id="asset-crud-form" novalidate>
        <div class="field-group">
          <label class="field-label" for="asset-form-nama">Judul / Nama Aset</label>
          <input
            type="text"
            id="asset-form-nama"
            class="field-control"
            value="${escapeHtml(existing?.nama || '')}"
            placeholder="Contoh: Reksadana Indeks IDX30"
            required
          />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
          <div class="field-group">
            <label class="field-label" for="asset-form-tier">Kategori Risiko</label>
            <select id="asset-form-tier" class="field-control">
              ${['Rendah', 'Sedang', 'Tinggi']
                .map(
                  (tier) =>
                    `<option value="${tier}" ${existing?.risikoTier === tier ? 'selected' : ''}>${tier}</option>`
                )
                .join('')}
            </select>
          </div>
          <div class="field-group">
            <label class="field-label" for="asset-form-risiko">Label Risiko</label>
            <input
              type="text"
              id="asset-form-risiko"
              class="field-control"
              value="${escapeHtml(existing?.risiko || 'Rendah - Sedang')}"
              placeholder="Contoh: Rendah - Sedang"
              required
            />
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
          <div class="field-group">
            <label class="field-label" for="asset-form-potensi">Potensi Imbal Hasil</label>
            <input
              type="text"
              id="asset-form-potensi"
              class="field-control"
              value="${escapeHtml(existing?.potensi || '8% - 11% / thn')}"
              placeholder="Contoh: 8% - 11% / thn"
              required
            />
          </div>
          <div class="field-group">
            <label class="field-label" for="asset-form-likuiditas">Likuiditas</label>
            <input
              type="text"
              id="asset-form-likuiditas"
              class="field-control"
              value="${escapeHtml(existing?.likuiditas || 'Tinggi (T+2)')}"
              placeholder="Contoh: Tinggi (1-2 hari kerja)"
              required
            />
          </div>
        </div>
        <div class="field-group">
          <label class="field-label" for="asset-form-horison">Horison Investasi Ideal</label>
          <input
            type="text"
            id="asset-form-horison"
            class="field-control"
            value="${escapeHtml(existing?.horison || '3 - 5 Tahun')}"
            placeholder="Contoh: 3 - 5 Tahun"
            required
          />
        </div>
        <div class="field-group">
          <label class="field-label" for="asset-form-deskripsi">Ringkasan Deskripsi Aset</label>
          <textarea id="asset-form-deskripsi" class="field-control" rows="2" required>${escapeHtml(
            existing?.deskripsi || ''
          )}</textarea>
        </div>
        <div class="field-group">
          <label class="field-label" for="asset-form-detail">Detail &amp; Analisis Risiko (pisahkan paragraf dengan baris kosong)</label>
          <textarea id="asset-form-detail" class="field-control" rows="4" required>${escapeHtml(
            detailText
          )}</textarea>
        </div>
        <p class="form-error" id="asset-form-error" hidden></p>
        <div class="modal-footer-actions">
          <button type="button" class="btn btn-outline" id="asset-form-cancel">Batal</button>
          <button type="submit" class="btn btn-primary">Simpan Aset</button>
        </div>
      </form>
    `,
    onMount: () => {
      document.getElementById('asset-form-cancel')?.addEventListener('click', closeActiveModal);
      const form = document.getElementById('asset-crud-form');
      const errEl = document.getElementById('asset-form-error');

      form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const nama = document.getElementById('asset-form-nama').value.trim();
        const risikoTier = document.getElementById('asset-form-tier').value;
        const risiko = document.getElementById('asset-form-risiko').value.trim();
        const potensi = document.getElementById('asset-form-potensi').value.trim();
        const likuiditas = document.getElementById('asset-form-likuiditas').value.trim();
        const horison = document.getElementById('asset-form-horison').value.trim();
        const deskripsi = document.getElementById('asset-form-deskripsi').value.trim();
        const detailRaw = document.getElementById('asset-form-detail').value.trim();

        if (!nama || !risiko || !potensi || !likuiditas || !horison || !deskripsi || !detailRaw) {
          errEl.textContent = 'Semua kolom aset wajib diisi sebelum menyimpan.';
          errEl.hidden = false;
          return;
        }

        const detailLengkap = detailRaw
          .split(/\n{2,}|\r\n\r\n/)
          .map((p) => p.trim())
          .filter(Boolean);

        actions.saveAsset({
          id: existing?.id || null,
          nama,
          risikoTier,
          risiko,
          potensi,
          likuiditas,
          horison,
          deskripsi,
          detailLengkap,
        });

        actions.setAdminTab('aset');
        closeActiveModal();
        showToast(existing ? 'Aset investasi berhasil diperbarui.' : 'Judul aset baru berhasil ditambahkan.');
      });
    },
  });
}

export function openAuthModal(initialMode = 'login') {
  let mode = initialMode;

  const renderAuth = () => {
    const isRegister = mode === 'register';
    mountModal({
      titleId: 'auth-modal-title',
      narrow: true,
      bodyHtml: `
        <h2 class="modal-title" id="auth-modal-title">
          ${isRegister ? 'Daftar Akun InvesGas' : 'Masuk ke InvesGas'}
        </h2>
        <p style="font-size: 0.9rem; color: var(--ink-muted);">
          ${
            isRegister
              ? 'Buat profil lokal untuk menyimpan progres belajar dan bookmark modul.'
              : 'Masuk sebagai pengguna atau gunakan akun Admin untuk mengakses Dashboard Admin.'
          }
        </p>
        <form class="modal-form" id="auth-modal-form" novalidate>
          ${
            isRegister
              ? `
                <div class="field-group">
                  <label class="field-label" for="auth-name">Nama Lengkap</label>
                  <input type="text" id="auth-name" class="field-control" placeholder="Nama Anda" required />
                </div>
              `
              : ''
          }
          <div class="field-group">
            <label class="field-label" for="auth-email">${isRegister ? 'Alamat Email' : 'Alamat Email'}</label>
            <input
              type="text"
              id="auth-email"
              class="field-control"
              autocomplete="username"
              placeholder="${isRegister ? 'nama@email.com' : 'nama@email.com atau admin'}"
              required
            />
          </div>
          <div class="field-group">
            <label class="field-label" for="auth-password">Kata Sandi</label>
            <input
              type="password"
              id="auth-password"
              class="field-control"
              autocomplete="current-password"
              placeholder="Masukkan kata sandi"
              required
            />
          </div>
          <p class="form-error" id="auth-form-error" hidden></p>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            ${isRegister ? 'Daftar Sekarang' : 'Masuk'}
          </button>
        </form>
        <p style="text-align: center; font-size: 0.88rem; color: var(--ink-muted); margin-top: 1rem;">
          ${isRegister ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
          <button type="button" id="auth-switch-mode" style="background: none; border: none; color: var(--cobalt); font-weight: 600; cursor: pointer; text-decoration: underline;">
            ${isRegister ? 'Masuk di sini' : 'Daftar Akun'}
          </button>
        </p>
      `,
      onMount: () => {
        document.getElementById('auth-switch-mode')?.addEventListener('click', () => {
          mode = isRegister ? 'login' : 'register';
          renderAuth();
        });

        const form = document.getElementById('auth-modal-form');
        const errEl = document.getElementById('auth-form-error');

        form?.addEventListener('submit', (event) => {
          event.preventDefault();
          const email = document.getElementById('auth-email').value.trim();
          const password = document.getElementById('auth-password').value;
          const nameInput = document.getElementById('auth-name');

          if (!isRegister && email.toLowerCase() === 'admin') {
            if (password !== 'admin123') {
              errEl.textContent = 'Kata sandi admin tidak sesuai.';
              errEl.hidden = false;
              return;
            }
            actions.loginUser({ name: 'Admin', email: 'admin', role: 'admin' });
            closeActiveModal();
            actions.setRoute('admin');
            showToast('Login berhasil. Fitur Dashboard Admin sekarang aktif.');
            return;
          }

          if (isRegister && email.toLowerCase() === 'admin') {
            errEl.textContent = 'Username admin tidak dapat didaftarkan sebagai akun baru.';
            errEl.hidden = false;
            return;
          }

          const name = nameInput ? nameInput.value.trim() : email.split('@')[0];

          if (!email || !email.includes('@')) {
            errEl.textContent = 'Masukkan alamat email yang valid (atau gunakan "admin" untuk login admin).';
            errEl.hidden = false;
            return;
          }
          if (password.length < 6) {
            errEl.textContent = 'Kata sandi minimal terdiri dari 6 karakter.';
            errEl.hidden = false;
            return;
          }
          if (isRegister && !name) {
            errEl.textContent = 'Nama lengkap wajib diisi.';
            errEl.hidden = false;
            return;
          }

          actions.loginUser({ name: name || 'Investor', email, role: 'user' });
          closeActiveModal();
          showToast(`Selamat datang, ${name || 'Investor'}.`);
        });
      },
    });
  };

  renderAuth();
}

export function openConfirmModal({ title, message, confirmLabel = 'Konfirmasi', danger = true, onConfirm }) {
  mountModal({
    titleId: 'confirm-modal-title',
    narrow: true,
    bodyHtml: `
      <h2 class="modal-title" id="confirm-modal-title">${escapeHtml(title)}</h2>
      <p style="color: var(--ink-secondary); margin: 0.75rem 0 1.5rem;">${escapeHtml(message)}</p>
      <div class="modal-footer-actions">
        <button type="button" class="btn btn-outline" id="confirm-cancel-btn">Batal</button>
        <button type="button" class="btn ${danger ? 'btn-danger-solid' : 'btn-primary'}" id="confirm-proceed-btn">
          ${escapeHtml(confirmLabel)}
        </button>
      </div>
    `,
    onMount: () => {
      document.getElementById('confirm-cancel-btn')?.addEventListener('click', closeActiveModal);
      document.getElementById('confirm-proceed-btn')?.addEventListener('click', () => {
        closeActiveModal();
        if (typeof onConfirm === 'function') onConfirm();
      });
    },
  });
}
