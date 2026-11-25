import { defaultAssets, defaultHistory, defaultModules } from '../data/seedData.js';

const STORAGE_KEYS = {
  modules: 'invesgas_modules_v2',
  assets: 'invesgas_assets_v2',
  bookmarks: 'invesgas_bookmarks_v1',
  user: 'invesgas_user_v1',
  calc: 'invesgas_calc_v1',
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or private mode fallback: keep running in memory
  }
}

const initialCalc = loadJSON(STORAGE_KEYS.calc, {
  initial: 10000000,
  monthly: 1000000,
  annualRate: 12,
  years: 10,
});

const state = {
  activeRoute: 'edukasi', // 'edukasi' | 'aset' | 'simulasi' | 'kuis' | 'admin'
  edukasiSubView: 'modul', // 'modul' | 'bookmark' | 'sejarah'
  adminTab: 'modul', // 'modul' | 'aset'
  searchQuery: '',
  levelFilter: 'ALL',
  categoryFilter: 'ALL',
  assetRiskFilter: 'ALL',
  adminSearchQuery: '',
  modules: loadJSON(STORAGE_KEYS.modules, structuredClone(defaultModules)),
  assets: loadJSON(STORAGE_KEYS.assets, structuredClone(defaultAssets)),
  history: defaultHistory,
  bookmarks: loadJSON(STORAGE_KEYS.bookmarks, []),
  user: loadJSON(STORAGE_KEYS.user, null),
  calc: initialCalc,
  quizAnswers: [null, null, null],
  quizSubmitted: false,
  mobileMenuOpen: false,
};

const listeners = new Set();

export function isAdminUser() {
  return state.user?.role === 'admin';
}

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((fn) => fn(state));
}

export const actions = {
  setRoute(route) {
    const allowed = ['edukasi', 'aset', 'simulasi', 'kuis', 'admin'];
    if (!allowed.includes(route)) return;
    if (route === 'admin' && !isAdminUser()) {
      state.activeRoute = 'edukasi';
      window.history.replaceState(null, '', '#edukasi');
      notify();
      return;
    }
    state.activeRoute = route;
    state.mobileMenuOpen = false;
    if (window.location.hash !== `#${route}`) {
      window.history.replaceState(null, '', `#${route}`);
    }
    notify();
  },

  setEdukasiSubView(subView) {
    state.edukasiSubView = subView;
    notify();
  },

  setAdminTab(tab) {
    state.adminTab = tab === 'aset' ? 'aset' : 'modul';
    state.adminSearchQuery = '';
    notify();
  },

  toggleMobileMenu(force) {
    state.mobileMenuOpen = typeof force === 'boolean' ? force : !state.mobileMenuOpen;
    notify();
  },

  setModuleFilters({ searchQuery, levelFilter, categoryFilter }) {
    if (typeof searchQuery === 'string') state.searchQuery = searchQuery;
    if (typeof levelFilter === 'string') state.levelFilter = levelFilter;
    if (typeof categoryFilter === 'string') state.categoryFilter = categoryFilter;
    notify();
  },

  resetModuleFilters() {
    state.searchQuery = '';
    state.levelFilter = 'ALL';
    state.categoryFilter = 'ALL';
    notify();
  },

  setAssetRiskFilter(risk) {
    state.assetRiskFilter = risk;
    notify();
  },

  setAdminSearch(query) {
    state.adminSearchQuery = query;
    notify();
  },

  toggleBookmark(moduleId) {
    const exists = state.bookmarks.includes(moduleId);
    state.bookmarks = exists
      ? state.bookmarks.filter((id) => id !== moduleId)
      : [...state.bookmarks, moduleId];
    saveJSON(STORAGE_KEYS.bookmarks, state.bookmarks);
    notify();
    return !exists;
  },

  saveModule(payload) {
    if (payload.id) {
      state.modules = state.modules.map((item) =>
        item.id === payload.id
          ? {
              ...item,
              judul: payload.judul,
              kategori: payload.kategori,
              level: payload.level,
              durasi: payload.durasi,
              deskripsi: payload.deskripsi,
              materiLengkap: payload.materiLengkap,
            }
          : item
      );
    } else {
      const categoryImageMap = {
        'Dasar Investasi': '/src/assets/images/modul_compounding_1795589923723.jpg',
        'Pasar Modal': '/src/assets/images/modul_capital_market_1795589923898.jpg',
        'Pendapatan Tetap': '/src/assets/images/aset_fixed_income_1795589924769.jpg',
        'Manajemen Risiko': '/src/assets/images/aset_gold_reserve_1795589925176.jpg',
      };
      const newItem = {
        id: `m-${Date.now()}`,
        judul: payload.judul,
        kategori: payload.kategori,
        level: payload.level,
        durasi: payload.durasi,
        deskripsi: payload.deskripsi,
        materiLengkap: payload.materiLengkap,
        imageUrl:
          categoryImageMap[payload.kategori] ||
          '/src/assets/images/modul_compounding_1795589923723.jpg',
      };
      state.modules = [newItem, ...state.modules];
    }
    saveJSON(STORAGE_KEYS.modules, state.modules);
    notify();
  },

  deleteModule(moduleId) {
    state.modules = state.modules.filter((item) => item.id !== moduleId);
    state.bookmarks = state.bookmarks.filter((id) => id !== moduleId);
    saveJSON(STORAGE_KEYS.modules, state.modules);
    saveJSON(STORAGE_KEYS.bookmarks, state.bookmarks);
    notify();
  },

  resetModulesToDefault() {
    state.modules = structuredClone(defaultModules);
    saveJSON(STORAGE_KEYS.modules, state.modules);
    notify();
  },

  saveAsset(payload) {
    if (payload.id) {
      state.assets = state.assets.map((item) =>
        item.id === payload.id
          ? {
              ...item,
              nama: payload.nama,
              risiko: payload.risiko,
              risikoTier: payload.risikoTier,
              potensi: payload.potensi,
              likuiditas: payload.likuiditas,
              horison: payload.horison,
              deskripsi: payload.deskripsi,
              detailLengkap: payload.detailLengkap,
            }
          : item
      );
    } else {
      const riskImageMap = {
        Rendah: '/src/assets/images/modul_compounding_1795589923723.jpg',
        Sedang: '/src/assets/images/aset_fixed_income_1795589924769.jpg',
        Tinggi: '/src/assets/images/modul_capital_market_1795589923898.jpg',
      };
      const newAsset = {
        id: `a-${Date.now()}`,
        nama: payload.nama,
        risiko: payload.risiko,
        risikoTier: payload.risikoTier,
        potensi: payload.potensi,
        likuiditas: payload.likuiditas,
        horison: payload.horison,
        deskripsi: payload.deskripsi,
        detailLengkap: payload.detailLengkap,
        imageUrl:
          riskImageMap[payload.risikoTier] ||
          '/src/assets/images/aset_gold_reserve_1795589925176.jpg',
      };
      state.assets = [newAsset, ...state.assets];
    }
    saveJSON(STORAGE_KEYS.assets, state.assets);
    notify();
  },

  deleteAsset(assetId) {
    state.assets = state.assets.filter((item) => item.id !== assetId);
    saveJSON(STORAGE_KEYS.assets, state.assets);
    notify();
  },

  resetAssetsToDefault() {
    state.assets = structuredClone(defaultAssets);
    saveJSON(STORAGE_KEYS.assets, state.assets);
    notify();
  },

  updateCalc(partial) {
    state.calc = { ...state.calc, ...partial };
    saveJSON(STORAGE_KEYS.calc, state.calc);
    notify();
  },

  setQuizAnswer(index, points) {
    const updated = [...state.quizAnswers];
    updated[index] = points;
    state.quizAnswers = updated;
    notify();
  },

  submitQuiz() {
    state.quizSubmitted = true;
    notify();
  },

  resetQuiz() {
    state.quizAnswers = [null, null, null];
    state.quizSubmitted = false;
    notify();
  },

  loginUser({ name, email, role = 'user' }) {
    state.user = { name, email, role };
    saveJSON(STORAGE_KEYS.user, state.user);
    notify();
  },

  logoutUser() {
    state.user = null;
    saveJSON(STORAGE_KEYS.user, null);
    if (state.activeRoute === 'admin') {
      state.activeRoute = 'edukasi';
      window.history.replaceState(null, '', '#edukasi');
    }
    notify();
  },
};
