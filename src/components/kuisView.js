import { quizQuestions } from '../data/seedData.js';
import { actions, getState } from '../state/store.js';
import { escapeHtml } from '../utils/sanitize.js';
import { showToast } from './modals.js';

function evaluateRiskProfile(totalScore) {
  if (totalScore <= 4) {
    return {
      title: 'Konservatif',
      subtitle: 'Prioritas Utama: Keamanan Modal & Likuiditas',
      desc: 'Anda mengutamakan stabilitas nilai pokok dan menghindari fluktuasi tajam. Fokuskan alokasi pada instrumen pasar uang dan pendapatan tetap jangka pendek.',
      recommendedRate: 6,
      allocation: { moneyMarket: 65, bond: 30, equity: 5 },
    };
  }
  if (totalScore <= 7) {
    return {
      title: 'Moderat',
      subtitle: 'Prioritas Utama: Pertumbuhan Seimbang & Terkendali',
      desc: 'Anda bersedia menerima fluktuasi harga moderat demi imbal hasil yang melampaui inflasi dalam horison menengah. Kombinasikan obligasi negara dan porsi saham terukur.',
      recommendedRate: 10,
      allocation: { moneyMarket: 25, bond: 45, equity: 30 },
    };
  }
  return {
    title: 'Agresif',
    subtitle: 'Prioritas Utama: Maksimalisasi Pertumbuhan Jangka Panjang',
    desc: 'Anda memiliki horison panjang dan kesiapan mental menghadapi volatilitas pasar demi potensi imbal hasil optimal pada instrumen ekuitas.',
    recommendedRate: 14,
    allocation: { moneyMarket: 10, bond: 25, equity: 65 },
  };
}

export function renderKuisView(container) {
  const { quizAnswers, quizSubmitted } = getState();
  const answeredCount = quizAnswers.filter((val) => val !== null).length;
  const progressPct = Math.round((answeredCount / quizQuestions.length) * 100);

  if (quizSubmitted) {
    const score = quizAnswers.reduce((sum, val) => sum + (val || 0), 0);
    const result = evaluateRiskProfile(score);

    container.innerHTML = `
      <section aria-labelledby="kuis-heading" class="quiz-shell">
        <h2 id="kuis-heading" class="section-title">Hasil Pemetaan Profil Risiko</h2>
        <p class="section-subtitle" style="margin-bottom: 1.5rem;">
          Berdasarkan jawaban Anda atas ${quizQuestions.length} indikator horison, toleransi volatilitas, dan tujuan keuangan.
        </p>

        <article class="quiz-result-card">
          <div class="meta-line">
            <span>Skor Evaluasi: <strong class="tabular-nums">${score} / 9</strong></span>
            <span class="meta-sep" aria-hidden="true">&middot;</span>
            <span>${escapeHtml(result.subtitle)}</span>
          </div>
          <h3 style="font-size: 1.65rem; font-weight: 800; margin-bottom: 0.75rem;">
            Profil Risiko: <span style="color: var(--emerald);">${escapeHtml(result.title)}</span>
          </h3>
          <p style="color: var(--ink-secondary); margin-bottom: 1.25rem;">${escapeHtml(result.desc)}</p>

          <div>
            <strong style="font-size: 0.88rem; color: var(--ink);">Contoh Alokasi Portofolio Edukatif</strong>
            <div class="allocation-bar" role="img" aria-label="Alokasi pasar uang ${result.allocation.moneyMarket}%, obligasi ${result.allocation.bond}%, saham ${result.allocation.equity}%">
              <div class="alloc-seg-money" style="width: ${result.allocation.moneyMarket}%;"></div>
              <div class="alloc-seg-bond" style="width: ${result.allocation.bond}%;"></div>
              <div class="alloc-seg-equity" style="width: ${result.allocation.equity}%;"></div>
            </div>
            <div class="allocation-legend tabular-nums">
              <span>Pasar Uang: ${result.allocation.moneyMarket}%</span>
              <span>Obligasi / SBN: ${result.allocation.bond}%</span>
              <span>Saham / Indeks: ${result.allocation.equity}%</span>
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            <button type="button" class="btn btn-primary" id="btn-apply-to-sim">
              Simulasikan dengan Return ${result.recommendedRate}%
            </button>
            <button type="button" class="btn btn-outline" id="btn-retake-quiz">Ulangi Kuis</button>
          </div>
        </article>
      </section>
    `;

    container.querySelector('#btn-apply-to-sim')?.addEventListener('click', () => {
      actions.updateCalc({ annualRate: result.recommendedRate });
      actions.setRoute('simulasi');
      showToast(`Simulasi diatur ke estimasi return ${result.recommendedRate}% (${result.title}).`);
    });

    container.querySelector('#btn-retake-quiz')?.addEventListener('click', () => {
      actions.resetQuiz();
    });
    return;
  }

  container.innerHTML = `
    <section aria-labelledby="kuis-heading" class="quiz-shell">
      <div class="section-header">
        <div>
          <h2 id="kuis-heading" class="section-title">Kuis Profil Risiko Investor</h2>
          <p class="section-subtitle">
            Jawab seluruh pertanyaan berikut untuk mengidentifikasi toleransi risiko dan acuan alokasi aset Anda.
          </p>
        </div>
      </div>

      <div class="quiz-progress-bar">
        <span class="tabular-nums" style="font-size: 0.86rem; font-weight: 600; color: var(--ink-secondary);">
          ${answeredCount} dari ${quizQuestions.length} terjawab
        </span>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPct}%;"></div>
        </div>
      </div>

      ${quizQuestions
        .map(
          (qObj, qIndex) => `
            <fieldset class="quiz-card" style="border: 1px solid var(--border);">
              <legend class="quiz-q-title">${qIndex + 1}. ${escapeHtml(qObj.q)}</legend>
              <div class="quiz-options">
                ${qObj.options
                  .map((opt) => {
                    const selected = quizAnswers[qIndex] === opt.points;
                    return `
                      <button
                        type="button"
                        class="quiz-option-btn ${selected ? 'is-selected' : ''}"
                        aria-pressed="${selected}"
                        data-quiz-q="${qIndex}"
                        data-quiz-points="${opt.points}"
                      >
                        <span class="quiz-radio-dot" aria-hidden="true"></span>
                        <span>${escapeHtml(opt.text)}</span>
                      </button>
                    `;
                  })
                  .join('')}
              </div>
            </fieldset>
          `
        )
        .join('')}

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <button type="button" class="btn btn-outline" id="btn-reset-quiz-draft">Reset Jawaban</button>
        <button type="button" class="btn btn-primary" id="btn-submit-quiz">Lihat Hasil Profil Risiko</button>
      </div>
    </section>
  `;

  container.querySelectorAll('[data-quiz-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qIdx = Number(btn.getAttribute('data-quiz-q'));
      const pts = Number(btn.getAttribute('data-quiz-points'));
      actions.setQuizAnswer(qIdx, pts);
    });
  });

  container.querySelector('#btn-reset-quiz-draft')?.addEventListener('click', () => {
    actions.resetQuiz();
  });

  container.querySelector('#btn-submit-quiz')?.addEventListener('click', () => {
    const latest = getState().quizAnswers;
    if (latest.some((val) => val === null)) {
      showToast('Harap lengkapi seluruh 3 pertanyaan terlebih dahulu.', 'error');
      return;
    }
    actions.submitQuiz();
  });
}
