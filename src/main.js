import './styles/tokens.css';
import './styles/main.css';

import { renderAdminView } from './components/adminView.js';
import { renderAsetView } from './components/asetView.js';
import { renderEdukasiView } from './components/edukasiView.js';
import { initHeader, renderHeader } from './components/header.js';
import { renderKuisView } from './components/kuisView.js';
import { renderSimulasiView } from './components/simulasiView.js';
import { actions, getState, isAdminUser, subscribe } from './state/store.js';

function renderActiveRoute() {
  const { activeRoute } = getState();
  const container = document.getElementById('view-container');
  if (!container) return;

  renderHeader();

  switch (activeRoute) {
    case 'aset':
      renderAsetView(container);
      break;
    case 'simulasi':
      renderSimulasiView(container);
      break;
    case 'kuis':
      renderKuisView(container);
      break;
    case 'admin':
      renderAdminView(container);
      break;
    case 'edukasi':
    default:
      renderEdukasiView(container);
      break;
  }
}

function syncRouteFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'admin' && !isAdminUser()) {
    actions.setRoute('edukasi');
    return;
  }
  if (['edukasi', 'aset', 'simulasi', 'kuis', 'admin'].includes(hash)) {
    actions.setRoute(hash);
  }
}

function bootstrap() {
  initHeader();
  subscribe(renderActiveRoute);
  syncRouteFromHash();
  renderActiveRoute();

  window.addEventListener('hashchange', syncRouteFromHash);
}

bootstrap();
