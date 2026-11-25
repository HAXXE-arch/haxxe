/**
 * Escapes HTML special characters to prevent XSS when interpolating user-supplied data.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  const str = String(value ?? '');
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatLineWithOptionalLabel(line) {
  const colonIdx = line.indexOf(':');
  if (colonIdx > 0 && colonIdx <= 42) {
    const label = line.slice(0, colonIdx).trim();
    const rest = line.slice(colonIdx + 1).trim();
    if (label && rest) {
      return `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(rest)}`;
    }
  }
  return escapeHtml(line);
}

function renderPlainBlocks(blocks) {
  const htmlParts = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      htmlParts.push(`<ul>${listItems.join('')}</ul>`);
      listItems = [];
    }
  };

  blocks.forEach((block) => {
    const lines = String(block)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    lines.forEach((line) => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        listItems.push(`<li>${formatLineWithOptionalLabel(line.slice(2).trim())}</li>`);
      } else {
        flushList();
        htmlParts.push(`<p>${formatLineWithOptionalLabel(line)}</p>`);
      }
    });
    flushList();
  });

  return htmlParts.join('');
}

/**
 * Safely renders structured educational content or plain text/arrays into scannable HTML.
 * @param {string | string[] | Record<string, any>} content
 * @returns {string}
 */
export function renderSafeParagraphs(content) {
  if (!content) {
    return '<p>Materi belum tersedia.</p>';
  }

  if (typeof content === 'object' && !Array.isArray(content)) {
    const sections = [];

    if (content.konsepInti) {
      sections.push(`
        <div>
          <h4>Konsep Inti</h4>
          <p>${escapeHtml(content.konsepInti)}</p>
        </div>
      `);
    }

    if (content.caraKerja) {
      sections.push(`
        <div>
          <h4>Cara Kerja Instrumen</h4>
          <p>${escapeHtml(content.caraKerja)}</p>
        </div>
      `);
    }

    if (Array.isArray(content.poinKunci) && content.poinKunci.length > 0) {
      sections.push(`
        <div>
          <h4>Poin Penting untuk Dipahami</h4>
          <ul>
            ${content.poinKunci
              .map(
                (pt) =>
                  `<li><strong>${escapeHtml(pt.judul)}:</strong> ${escapeHtml(pt.isi)}</li>`
              )
              .join('')}
          </ul>
        </div>
      `);
    }

    if (content.contohNyata) {
      sections.push(`
        <div class="prose-callout">
          <h4>Contoh Praktis</h4>
          <p>${escapeHtml(content.contohNyata)}</p>
        </div>
      `);
    }

    if (content.halDiperhatikan) {
      sections.push(`
        <div>
          <h4>Risiko &amp; Hal yang Perlu Diperhatikan</h4>
          <p>${escapeHtml(content.halDiperhatikan)}</p>
        </div>
      `);
    }

    if (content.langkahPraktis) {
      sections.push(`
        <div class="prose-takeaway">
          <h4>Langkah Awal yang Bisa Dilakukan</h4>
          <p>${escapeHtml(content.langkahPraktis)}</p>
        </div>
      `);
    }

    if (sections.length > 0) {
      return sections.join('');
    }
  }

  const blocks = Array.isArray(content)
    ? content
    : String(content)
        .split(/\n{2,}|\r\n\r\n/)
        .map((part) => part.trim())
        .filter(Boolean);

  if (blocks.length === 0) {
    return '<p>Materi belum tersedia.</p>';
  }

  return renderPlainBlocks(blocks);
}

/**
 * Converts structured content or arrays into readable editable text for Admin forms.
 * @param {string | string[] | Record<string, any>} content
 * @returns {string}
 */
export function contentToEditableText(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.join('\n\n');

  const lines = [];
  if (content.konsepInti) lines.push(`Konsep Inti: ${content.konsepInti}`);
  if (content.caraKerja) lines.push(`Cara Kerja: ${content.caraKerja}`);
  if (Array.isArray(content.poinKunci) && content.poinKunci.length > 0) {
    lines.push(content.poinKunci.map((pt) => `- ${pt.judul}: ${pt.isi}`).join('\n'));
  }
  if (content.contohNyata) lines.push(`Contoh Praktis: ${content.contohNyata}`);
  if (content.halDiperhatikan) lines.push(`Hal yang Diperhatikan: ${content.halDiperhatikan}`);
  if (content.langkahPraktis) lines.push(`Langkah Praktis: ${content.langkahPraktis}`);

  return lines.join('\n\n');
}
