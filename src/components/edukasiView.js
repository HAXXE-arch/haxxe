import { actions, getState } from '../state/store.js';
import { escapeHtml } from '../utils/sanitize.js';
import { openReaderModal, showToast } from './modals.js';

function renderModuleCardsMarkup(modules, bookmarks) {
  if (modules.length === 0) {
    return `
      <div class="empty-state">
        <h3>Tidak ada modul yang cocok</h3>
        <p>Ubah kata kunci pencarian atau atur ulang filter tingkat kesulitan dan kategori.</p>
        <button type="button" class="btn btn-outline" id="btn-reset-modul-filters">Reset Filter</button>
      </div>
    `;
  }

  return `
    <div class="card-grid">
      ${modules
        .map((item) => {
          const isSaved = bookmarks.includes(item.id);
          return `
            <article class="content-card">
              <div class="card-media">
                <img
                  src="${escapeHtml(item.imageUrl)}"
                  alt="${escapeHtml(item.judul)}"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
                />
                <div class="card-media-fallback" hidden>
                  <strong>${escapeHtml(item.kategori)}</strong>
                  <span>${escapeHtml(item.level)}</span>
                </div>
              </div>
              <div class="card-body">
                <div class="meta-line">
                  <span>${escapeHtml(item.kategori)}</span>
                  <span class="meta-sep" aria-hidden="true">&middot;</span>
                  <span>${escapeHtml(item.level)}</span>
                  <span class="meta-sep" aria-hidden="true">&middot;</span>
                  <span>${escapeHtml(item.durasi)}</span>
                </div>
                <h3 class="card-title">${escapeHtml(item.judul)}</h3>
                <p class="card-desc">${escapeHtml(item.deskripsi)}</p>
                <div class="card-footer">
                  <button type="button" class="btn btn-outline btn-sm" data-read-modul="${escapeHtml(item.id)}">
                    Baca Materi
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm ${isSaved ? 'btn-saved' : 'btn-primary'}"
                    data-save-modul="${escapeHtml(item.id)}"
                  >
                    ${isSaved ? 'Tersimpan' : 'Simpan'}
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function bindCardEvents(container) {
  container.querySelectorAll('[data-read-modul]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openReaderModal(btn.getAttribute('data-read-modul'));
    });
  });

  container.querySelectorAll('[data-save-modul]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-save-modul');
      const added = actions.toggleBookmark(id);
      showToast(added ? 'Modul disimpan ke Bookmark.' : 'Modul dihapus dari Bookmark.');
    });
  });

  container.querySelector('#btn-reset-modul-filters')?.addEventListener('click', () => {
    actions.resetModuleFilters();
  });
}

function getFilteredModules(state) {
  const query = state.searchQuery.trim().toLowerCase();
  return state.modules.filter((item) => {
    const matchesSearch =
      !query ||
      item.judul.toLowerCase().includes(query) ||
      item.deskripsi.toLowerCase().includes(query);
    const matchesLevel = state.levelFilter === 'ALL' || item.level === state.levelFilter;
    const matchesCat = state.categoryFilter === 'ALL' || item.kategori === state.categoryFilter;
    return matchesSearch && matchesLevel && matchesCat;
  });
}

export function renderEdukasiView(container) {
  const state = getState();
  const { edukasiSubView, modules, bookmarks, history, searchQuery, levelFilter, categoryFilter } =
    state;

  const headerMap = {
    modul: {
      title: 'Modul Pembelajaran Finansial',
      subtitle:
        'Pelajari prinsip dasar pengelolaan uang, instrumen pasar modal, dan analisis fundamental secara bertahap.',
    },
    bookmark: {
      title: 'Materi Tersimpan',
      subtitle: 'Kumpulan modul edukasi yang telah Anda tandai untuk dipelajari kembali.',
    },
    sejarah: {
      title: 'Sejarah & Evolusi Pasar Keuangan',
      subtitle:
        'Jejak lahirnya bursa efek modern dan pelajaran penting dari berbagai siklus krisis keuangan dunia.',
    },
  };

  const currentHeading = headerMap[edukasiSubView] || headerMap.modul;

  container.innerHTML = `
    <section aria-labelledby="edukasi-heading">
      <div class="section-header">
        <div>
          <h2 id="edukasi-heading" class="section-title">${currentHeading.title}</h2>
          <p class="section-subtitle">${currentHeading.subtitle}</p>
        </div>
        <div class="segmented-bar" role="tablist" aria-label="Sub-halaman Edukasi">
          <button
            type="button"
            role="tab"
            class="segmented-btn ${edukasiSubView === 'modul' ? 'is-active' : ''}"
            aria-selected="${edukasiSubView === 'modul'}"
            data-subview="modul"
          >
            Semua Modul (${modules.length})
          </button>
          <button
            type="button"
            role="tab"
            class="segmented-btn ${edukasiSubView === 'bookmark' ? 'is-active' : ''}"
            aria-selected="${edukasiSubView === 'bookmark'}"
            data-subview="bookmark"
          >
            Tersimpan (${bookmarks.length})
          </button>
          <button
            type="button"
            role="tab"
            class="segmented-btn ${edukasiSubView === 'sejarah' ? 'is-active' : ''}"
            aria-selected="${edukasiSubView === 'sejarah'}"
            data-subview="sejarah"
          >
            Sejarah Pasar
          </button>
        </div>
      </div>

      <div id="edukasi-subview-body"></div>
    </section>
  `;

  container.querySelectorAll('[data-subview]').forEach((btn) => {
    btn.addEventListener('click', () => {
      actions.setEdukasiSubView(btn.getAttribute('data-subview'));
    });
  });

  const subBody = container.querySelector('#edukasi-subview-body');
  if (!subBody) return;

  if (edukasiSubView === 'modul') {
    subBody.innerHTML = `
      <div class="filter-panel">
        <div class="field-group">
          <label class="field-label" for="modul-search-input">Cari Topik atau Kata Kunci</label>
          <input
            type="search"
            id="modul-search-input"
            class="field-control"
            placeholder="Ketik judul atau topik..."
            value="${escapeHtml(searchQuery)}"
          />
        </div>
        <div class="field-group">
          <label class="field-label" for="modul-level-select">Tingkat Kesulitan</label>
          <select id="modul-level-select" class="field-control">
            <option value="ALL" ${levelFilter === 'ALL' ? 'selected' : ''}>Semua Tingkat</option>
            <option value="Pemula" ${levelFilter === 'Pemula' ? 'selected' : ''}>Pemula</option>
            <option value="Menengah" ${levelFilter === 'Menengah' ? 'selected' : ''}>Menengah</option>
            <option value="Lanjutan" ${levelFilter === 'Lanjutan' ? 'selected' : ''}>Lanjutan</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label" for="modul-category-select">Kategori Materi</label>
          <select id="modul-category-select" class="field-control">
            <option value="ALL" ${categoryFilter === 'ALL' ? 'selected' : ''}>Semua Kategori</option>
            <option value="Dasar Investasi" ${categoryFilter === 'Dasar Investasi' ? 'selected' : ''}>Dasar Investasi</option>
            <option value="Pasar Modal" ${categoryFilter === 'Pasar Modal' ? 'selected' : ''}>Pasar Modal</option>
            <option value="Pendapatan Tetap" ${categoryFilter === 'Pendapatan Tetap' ? 'selected' : ''}>Pendapatan Tetap</option>
            <option value="Manajemen Risiko" ${categoryFilter === 'Manajemen Risiko' ? 'selected' : ''}>Manajemen Risiko</option>
          </select>
        </div>
      </div>
      <div id="modul-results-slot"></div>
    `;

    const resultsSlot = subBody.querySelector('#modul-results-slot');
    const updateResultsOnly = () => {
      const latest = getState();
      const filtered = getFilteredModules(latest);
      resultsSlot.innerHTML = renderModuleCardsMarkup(filtered, latest.bookmarks);
      bindCardEvents(resultsSlot);
    };

    updateResultsOnly();

    subBody.querySelector('#modul-search-input')?.addEventListener('input', (event) => {
      state.searchQuery = event.target.value;
      updateResultsOnly();
    });

    subBody.querySelector('#modul-level-select')?.addEventListener('change', (event) => {
      actions.setModuleFilters({ levelFilter: event.target.value });
    });

    subBody.querySelector('#modul-category-select')?.addEventListener('change', (event) => {
      actions.setModuleFilters({ categoryFilter: event.target.value });
    });
  } else if (edukasiSubView === 'bookmark') {
    const savedList = modules.filter((item) => bookmarks.includes(item.id));
    if (savedList.length === 0) {
      subBody.innerHTML = `
        <div class="empty-state">
          <h3>Belum ada materi tersimpan</h3>
          <p>Simpan modul dari katalog pembelajaran untuk mengaksesnya dengan cepat di sini.</p>
          <button type="button" class="btn btn-primary" id="btn-go-all-modules">Jelajahi Modul</button>
        </div>
      `;
      subBody.querySelector('#btn-go-all-modules')?.addEventListener('click', () => {
        actions.setEdukasiSubView('modul');
      });
    } else {
      subBody.innerHTML = renderModuleCardsMarkup(savedList, bookmarks);
      bindCardEvents(subBody);
    }
  } else if (edukasiSubView === 'sejarah') {
    subBody.innerHTML = `
      <div class="timeline-list">
        ${history
          .map(
            (item) => `
              <article class="timeline-item">
                <div class="timeline-era">${escapeHtml(item.era)}</div>
                <div>
                  <h3 class="timeline-title">${escapeHtml(item.judul)}</h3>
                  <p class="timeline-body">${escapeHtml(item.deskripsi)}</p>
                  <div class="timeline-takeaway">
                    <strong>Pelajaran Finansial:</strong> ${escapeHtml(item.pelajaran)}
                  </div>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    `;
  }
}
