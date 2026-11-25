import { actions, getState, isAdminUser } from '../state/store.js';
import { escapeHtml } from '../utils/sanitize.js';
import { openAuthModal, openConfirmModal, showToast } from './modals.js';

export function initHeader() {
  const navButtons = document.querySelectorAll('[data-nav]');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.getAttribute('data-nav');
      if (route) {
        actions.setRoute(route);
        document.getElementById('main-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const brandLink = document.querySelector('.brand-mark');
  brandLink?.addEventListener('click', (event) => {
    event.preventDefault();
    actions.setRoute('edukasi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  mobileToggle?.addEventListener('click', () => {
    actions.toggleMobileMenu();
  });

  document.getElementById('hero-start-sim')?.addEventListener('click', () => {
    actions.setRoute('simulasi');
    document.getElementById('main-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('hero-start-quiz')?.addEventListener('click', () => {
    actions.setRoute('kuis');
    document.getElementById('main-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export function renderHeader() {
  const { activeRoute, user, mobileMenuOpen } = getState();
  const isAdmin = isAdminUser();

  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((el) => {
    const route = el.getAttribute('data-nav');
    if (route === 'admin') {
      el.hidden = !isAdmin;
    }
    el.classList.toggle('is-active', route === activeRoute);
  });

  const drawer = document.getElementById('mobile-nav-drawer');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (drawer && mobileToggle) {
    drawer.hidden = !mobileMenuOpen;
    mobileToggle.setAttribute('aria-expanded', String(mobileMenuOpen));
  }

  const authSlot = document.getElementById('auth-action-slot');
  if (!authSlot) return;

  if (user) {
    authSlot.innerHTML = `
      <button type="button" class="account-trigger" id="btn-account-menu" title="Keluar dari akun ${escapeHtml(user.name)}">
        <span class="account-name-label">${escapeHtml(user.name)}</span>
        <span style="opacity: 0.72; font-weight: 500;">Keluar</span>
      </button>
    `;
    document.getElementById('btn-account-menu')?.addEventListener('click', () => {
      openConfirmModal({
        title: 'Keluar dari Akun',
        message: `Apakah Anda yakin ingin keluar dari sesi ${user.name}?`,
        confirmLabel: 'Keluar',
        danger: true,
        onConfirm: () => {
          actions.logoutUser();
          showToast('Anda telah keluar dari akun.');
        },
      });
    });
  } else {
    authSlot.innerHTML = `
      <button type="button" class="btn btn-primary btn-sm" id="btn-open-login">Masuk</button>
    `;
    document.getElementById('btn-open-login')?.addEventListener('click', () => {
      openAuthModal('login');
    });
  }
}
