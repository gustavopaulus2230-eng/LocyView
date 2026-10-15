(() => {
  'use strict';

  const STORAGE_KEY = 'locytech-bio:draft:v1';
  const DEFAULT_LOGO = './assets/locytech.png';
  const MAX_LOGO_BYTES = 1.5 * 1024 * 1024;
  const platforms = {
    whatsapp: { name: 'WhatsApp', title: 'WhatsApp', subtitle: 'Fale com a nossa equipe', placeholder: 'https://wa.me/55…', color: '#e8f8ee', ink: '#169653' },
    website: { name: 'Site', title: 'Nosso site', subtitle: 'Conheça a LocyTech', placeholder: 'https://seusite.com.br', color: '#edf2ff', ink: '#4269d7' },
    linkedin: { name: 'LinkedIn', title: 'LinkedIn', subtitle: 'Conecte-se com a gente', placeholder: 'https://www.linkedin.com/company/…', color: '#e8f3fc', ink: '#1976be' },
    instagram: { name: 'Instagram', title: 'Instagram', subtitle: 'Acompanhe as novidades', placeholder: 'https://www.instagram.com/…', color: '#fcecf5', ink: '#ca4b89' },
    calendar: { name: 'Agendamento', title: 'Agende uma conversa', subtitle: 'Escolha o melhor horário', placeholder: 'https://seusite.com.br/agendar', color: '#fff5df', ink: '#b78416' },
    email: { name: 'E-mail', title: 'Envie um e-mail', subtitle: 'Vamos conversar', placeholder: 'mailto:contato@seusite.com.br', color: '#f0ecfb', ink: '#7957ba' },
    custom: { name: 'Outro link', title: 'Novo link', subtitle: '', placeholder: 'https://…', color: '#eef2f6', ink: '#526277' }
  };
  const defaults = {
    version: 1,
    name: 'LocyTech',
    client: 'LocyTech',
    slug: 'locytech',
    description: 'Tecnologia que aproxima.\nEncontre tudo o que precisa em um só lugar.',
    logo: DEFAULT_LOGO,
    primaryColor: '#2463eb',
    accentColor: '#f9da57',
    backgroundColor: '#f2f6ff',
    shape: 'rounded',
    font: 'modern',
    showBrand: true,
    links: [
      { id: 'whatsapp-example', platform: 'whatsapp', title: 'WhatsApp', subtitle: 'Fale com a nossa equipe', url: 'https://www.whatsapp.com/', enabled: true, example: true },
      { id: 'website-example', platform: 'website', title: 'Nosso site', subtitle: 'Conheça a LocyTech', url: 'https://example.com/', enabled: true, example: true },
      { id: 'linkedin-example', platform: 'linkedin', title: 'LinkedIn', subtitle: 'Conecte-se com a gente', url: 'https://www.linkedin.com/', enabled: true, example: true },
      { id: 'calendar-example', platform: 'calendar', title: 'Agende uma conversa', subtitle: 'Escolha o melhor horário', url: 'https://gestorlash.com.br/agendar/NICOL302', enabled: true, example: true }
    ]
  };

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const clone = value => JSON.parse(JSON.stringify(value));
  const shortText = (value, fallback = '', max = 300) => typeof value === 'string' ? value.slice(0, max) : fallback;
  const color = (value, fallback) => /^#[\da-f]{6}$/i.test(value || '') ? value : fallback;
  const uid = () => globalThis.crypto?.randomUUID?.() || `link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const safeLogo = value => value === DEFAULT_LOGO || /^data:image\/(?:png|jpeg|webp|gif);base64,[a-z\d+/=]+$/i.test(value || '') && value.length < 3 * 1024 * 1024 ? value : '';

  function normalize(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
      version: 1,
      name: shortText(source.name, defaults.name, 60),
      client: shortText(source.client, defaults.client, 80),
      slug: shortText(source.slug, defaults.slug, 50),
      description: shortText(source.description, defaults.description, 180),
      logo: source.logo === '' ? '' : safeLogo(source.logo) || DEFAULT_LOGO,
      primaryColor: color(source.primaryColor, defaults.primaryColor),
      accentColor: color(source.accentColor, defaults.accentColor),
      backgroundColor: color(source.backgroundColor, defaults.backgroundColor),
      shape: source.shape === 'square' ? 'square' : 'rounded',
      font: source.font === 'classic' ? 'classic' : 'modern',
      showBrand: source.showBrand !== false,
      links: (Array.isArray(source.links) ? source.links : defaults.links).slice(0, 30).map(link => ({
        id: uid(),
        platform: Object.hasOwn(platforms, link?.platform) ? link.platform : 'custom',
        title: shortText(link?.title, 'Novo link', 60),
        subtitle: shortText(link?.subtitle, '', 140),
        url: link?.example === true && /^https:\/\/locytech\.com\.br\/?$/.test(link?.url || '') ? 'https://example.com/' : shortText(link?.url, '', 2048),
        enabled: link?.enabled !== false,
        example: link?.example === true
      }))
    };
  }

  let state = clone(defaults);
  let savedAt = null;
  let dirty = false;
  let toastTimer;
  let publicMode = false;
  let logoUploadVersion = 0;

  function icon(name, size = 20) {
    const paths = {
      whatsapp: '<path d="M20 11.5a8.4 8.4 0 0 1-8.5 8.3 9 9 0 0 1-4-.9L3 20l1.2-4.3A8.2 8.2 0 0 1 3 11.5a8.5 8.5 0 0 1 17 0Z"/><path d="M8 7.4c-.8.6-.8 1.6-.1 2.9a10 10 0 0 0 4 4c1.3.7 2.2.7 2.9-.1l.5-.8-2.5-1.2-.8.8a7 7 0 0 1-2.7-2.7l.8-.8-1.2-2.5Z"/>',
      website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a16 16 0 0 1 0 18 16 16 0 0 1 0-18Z"/>',
      linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5v7m0-10v.1M11.5 17.5v-7m0 3a3 3 0 0 1 6 0v4"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 4h2m4 0h2m-8 3h2"/>',
      email: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
      custom: '<path d="m10 13 4-4m-6 6-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 2 1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0" transform="translate(1 1)"/>',
      arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
      up: '<path d="m6 14 6-6 6 6"/>',
      down: '<path d="m6 10 6 6 6-6"/>',
      trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
      grip: '<circle cx="9" cy="5" r=".8"/><circle cx="15" cy="5" r=".8"/><circle cx="9" cy="12" r=".8"/><circle cx="15" cy="12" r=".8"/><circle cx="9" cy="19" r=".8"/><circle cx="15" cy="19" r=".8"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      check: '<path d="m5 12 4 4L19 6"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.custom}</svg>`;
  }

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function toast(message) {
    const target = $('#toast');
    if (!target) return;
    clearTimeout(toastTimer);
    target.textContent = message;
    target.hidden = false;
    target.classList.add('is-visible');
    toastTimer = setTimeout(() => {
      target.classList.remove('is-visible');
      target.hidden = true;
    }, 4500);
  }

  function validUrl(raw) {
    const value = String(raw || '').trim();
    if (!value || /[\u0000-\u0020\u007f]/.test(value)) return '';
    if (/^https?:\/\//i.test(value)) {
      try {
        const parsed = new URL(value);
        return parsed.hostname && ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
      } catch { return ''; }
    }
    if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+(?:\?[^\s]*)?$/i.test(value)) return value;
    if (/^tel:\+?[\d().-]{3,30}$/i.test(value)) return value;
    return '';
  }

  function setStatus() {
    const target = $('#save-status');
    if (!target) return;
    target.textContent = dirty ? 'Alterações não salvas' : savedAt ? 'Rascunho salvo' : 'Rascunho';
    target.dataset.status = dirty ? 'unsaved' : 'saved';
  }

  function changed() {
    dirty = true;
    setStatus();
    renderPreview();
    updateCounts();
  }

  function updateCounts() {
    const active = state.links.filter(link => link.enabled).length;
    if ($('#active-links-count')) $('#active-links-count').textContent = String(active);
    if ($('#links-count')) $('#links-count').textContent = String(state.links.length);
    if ($('#slug-preview')) $('#slug-preview').textContent = state.slug || 'seu-cliente';
    if ($('#preview-heading')) $('#preview-heading').textContent = state.name || 'Sua página';
    const description = $('#page-description');
    const count = $('#description-count');
    if (description && count) count.textContent = `${state.description.length}/${description.maxLength > 0 ? description.maxLength : 180}`;
  }

  function applyTheme(container) {
    container.style.setProperty('--bio-primary', state.primaryColor);
    container.style.setProperty('--bio-accent', state.accentColor);
    container.style.setProperty('--bio-background', state.backgroundColor);
    container.style.setProperty('--bio-radius', state.shape === 'square' ? '6px' : '16px');
    const fontFamily = state.font === 'classic' ? 'Georgia, "Times New Roman", serif' : '"DM Sans", "Segoe UI", sans-serif';
    container.style.setProperty('--bio-font', fontFamily);
    container.style.backgroundColor = state.backgroundColor;
    container.style.fontFamily = fontFamily;
    container.dataset.shape = state.shape;
    container.dataset.font = state.font;
  }

  function renderBio(container) {
    if (!container) return;
    container.replaceChildren();
    applyTheme(container);
    if (state.logo) {
      const logo = node('img', 'bio-logo');
      logo.src = safeLogo(state.logo) || DEFAULT_LOGO;
      logo.alt = `Logo ${state.client || state.name || 'do cliente'}`;
      logo.width = 88;
      logo.height = 88;
      container.append(logo);
    } else {
      const monogram = node('div', 'bio-logo bio-monogram', (state.name.trim().slice(0, 2) || 'LT').toUpperCase());
      monogram.setAttribute('aria-hidden', 'true');
      container.append(monogram);
    }
    container.append(node(container.id === 'public-content' ? 'h1' : 'h2', 'bio-name', state.name || 'Nome da sua página'));
    if (state.description.trim()) container.append(node('p', 'bio-description', state.description));
    const links = node('div', 'bio-links');
    for (const link of state.links.filter(item => item.enabled)) {
      const href = validUrl(link.url);
      const button = node('a', 'bio-link');
      if (href) {
        button.href = href;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
      } else {
        button.setAttribute('aria-disabled', 'true');
        button.title = 'Adicione um endereço válido para este link';
      }
      const platformIcon = node('span', 'bio-link-icon');
      platformIcon.innerHTML = icon(link.platform, 22);
      const copy = node('span', 'bio-link-copy');
      copy.append(node('span', 'bio-link-title', link.title || platforms[link.platform].title));
      if (link.subtitle) copy.append(node('span', 'bio-link-subtitle', link.subtitle));
      const arrow = node('span', 'bio-link-arrow');
      arrow.innerHTML = icon('arrow', 17);
      button.append(platformIcon, copy, arrow);
      links.append(button);
    }
    if (!links.childElementCount) links.append(node('p', 'bio-empty', 'Seus links aparecerão aqui.'));
    container.append(links);
    if (state.showBrand) {
      const brand = node('div', 'bio-brand');
      brand.append(node('span', '', 'Feito com '));
      const name = node('strong', '', 'Locy');
      name.append(node('span', 'bio-brand-accent', 'Tech'));
      brand.append(name);
      container.append(brand);
    }
  }

  function renderPreview() {
    renderBio($('#phone-content'));
    if ($('#device-preview')) $('#device-preview').style.backgroundColor = state.backgroundColor;
    if (publicMode) renderBio($('#public-content'));
    const uploadedPreview = $('#uploaded-logo') || $('#uploaded-logo-preview') || $('#logo-preview');
    if (uploadedPreview) {
      if (uploadedPreview.tagName === 'IMG') {
        uploadedPreview.src = state.logo || DEFAULT_LOGO;
        uploadedPreview.hidden = !state.logo;
      }
    }
    const remove = $('#remove-logo');
    if (remove) remove.disabled = !state.logo;
    updateCounts();
  }

  function editorField(link, name, labelText, type = 'text') {
    const wrapper = node('div', `field link-field-${name}`);
    const id = `${link.id}-${name}`;
    const label = node('label', '', labelText);
    label.htmlFor = id;
    const input = node('input', name === 'url' ? 'link-target' : '');
    input.id = id;
    input.type = type;
    input.value = link[name];
    input.dataset.field = name;
    input.maxLength = name === 'url' ? 2048 : name === 'subtitle' ? 140 : 60;
    if (name === 'url') {
      input.placeholder = platforms[link.platform].placeholder;
      input.setAttribute('inputmode', 'url');
      input.setAttribute('autocomplete', 'url');
      input.setAttribute('aria-describedby', `${link.id}-hint`);
    }
    wrapper.append(label, input);
    return wrapper;
  }

  function actionButton(action, title, iconName, disabled = false) {
    const button = node('button', 'icon-button');
    button.type = 'button';
    button.dataset.action = action;
    button.title = title;
    button.setAttribute('aria-label', title);
    button.disabled = disabled;
    button.innerHTML = icon(iconName, 17);
    return button;
  }

  function renderLinks() {
    const list = $('#links-list');
    if (!list) return;
    list.replaceChildren();
    if (!state.links.length) {
      const empty = node('div', 'empty-links');
      const symbol = node('span', 'empty-links-icon');
      symbol.innerHTML = icon('custom', 28);
      empty.append(symbol, node('strong', '', 'Sua página começa com um link'), node('p', '', 'Adicione WhatsApp, site, redes sociais ou uma página de agendamento.'));
      list.append(empty);
    }
    state.links.forEach((link, index) => {
      const platform = platforms[link.platform];
      const card = node('article', 'link-editor');
      card.dataset.linkId = link.id;
      card.classList.toggle('is-disabled', !link.enabled);
      const top = node('div', 'link-editor-top');
      const heading = node('div', 'link-editor-heading');
      const number = node('span', 'link-order', String(index + 1).padStart(2, '0'));
      const platformIcon = node('span', `platform-icon platform-${link.platform}`);
      platformIcon.style.backgroundColor = platform.color;
      platformIcon.style.color = platform.ink;
      platformIcon.innerHTML = icon(link.platform, 20);
      const titleWrap = node('div', 'link-editor-title');
      const title = node('strong', '', platform.name);
      title.id = `${link.id}-label`;
      const hint = node('span', 'link-editor-subtitle', link.example ? 'Exemplo — substitua pelo link do cliente' : 'Personalize este atalho');
      hint.id = `${link.id}-hint`;
      titleWrap.append(title, hint);
      heading.append(number, platformIcon, titleWrap);
      const actions = node('div', 'link-editor-actions');
      actions.append(actionButton('up', `Mover ${platform.name} para cima`, 'up', index === 0));
      actions.append(actionButton('down', `Mover ${platform.name} para baixo`, 'down', index === state.links.length - 1));
      actions.append(actionButton('delete', `Remover ${platform.name}`, 'trash'));
      const toggle = node('label', 'switch');
      const checkbox = node('input');
      checkbox.type = 'checkbox';
      checkbox.checked = link.enabled;
      checkbox.dataset.action = 'toggle';
      checkbox.setAttribute('aria-label', `Exibir ${platform.name} na página`);
      const track = node('span', 'switch-track');
      track.setAttribute('aria-hidden', 'true');
      toggle.append(checkbox, track);
      actions.append(toggle);
      top.append(heading, actions);
      const fields = node('div', 'link-fields');
      fields.append(editorField(link, 'title', 'Título do botão'), editorField(link, 'subtitle', 'Descrição curta'), editorField(link, 'url', 'Link de destino', 'url'));
      card.append(top, fields);
      list.append(card);
    });
    updateCounts();
  }

  function syncFields() {
    const fields = {
      '#page-name': 'name', '#client-name': 'client', '#page-slug': 'slug', '#page-description': 'description',
      '#primary-color': 'primaryColor', '#accent-color': 'accentColor', '#background-color': 'backgroundColor', '#font-choice': 'font'
    };
    Object.entries(fields).forEach(([selector, key]) => { if ($(selector)) $(selector).value = state[key]; });
    if ($('#show-brand')) $('#show-brand').checked = state.showBrand;
    ['rounded', 'square'].forEach(shape => {
      const target = $(`#shape-${shape}`);
      if (target) {
        target.setAttribute('aria-pressed', String(state.shape === shape));
        target.classList.toggle('is-selected', state.shape === shape);
        target.classList.toggle('active', state.shape === shape);
      }
    });
    updateColorLabels();
  }

  function updateColorLabels() {
    [['primary-color', 'primaryColor'], ['accent-color', 'accentColor'], ['background-color', 'backgroundColor']].forEach(([id, key]) => {
      const label = $(`[data-color-value="${id}"]`) || $(`#${id}-value`);
      if (label) label.textContent = state[key].toUpperCase();
    });
  }

  function selectTab(name, focus = false) {
    if (!['info', 'links', 'appearance'].includes(name)) return;
    $$('[data-tab]').forEach(tab => {
      const selected = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.classList.toggle('is-active', selected);
      tab.classList.toggle('active', selected);
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    ['info', 'links', 'appearance'].forEach(panel => {
      const element = $(`#panel-${panel}`);
      if (element) element.hidden = panel !== name;
    });
  }

  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.hidden = false;
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.hidden = true;
      dialog.removeAttribute('open');
    }
  }

  function saveDraft(showToast = true) {
    try {
      savedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, savedAt }));
      dirty = false;
      setStatus();
      if (showToast) toast('Rascunho salvo neste navegador.');
      return true;
    } catch {
      savedAt = null;
      setStatus();
      if (showToast) toast('O navegador não conseguiu salvar. Seu conteúdo continua aberto; você pode copiar o link de prévia.');
      return false;
    }
  }

  function encodeSnapshot(snapshot) {
    const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
    let binary = '';
    for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeSnapshot(encoded) {
    if (encoded.length > 4 * 1024 * 1024 || !/^[\w-]+$/.test(encoded)) throw new Error('Snapshot inválido');
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const snapshot = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!snapshot || typeof snapshot !== 'object' || !Array.isArray(snapshot.links)) throw new Error('Página inválida');
    return normalize(snapshot);
  }

  function shareUrl() {
    const url = new URL(location.href);
    const snapshot = {
      version: 1,
      name: state.name,
      slug: state.slug,
      description: state.description,
      logo: state.logo,
      primaryColor: state.primaryColor,
      accentColor: state.accentColor,
      backgroundColor: state.backgroundColor,
      shape: state.shape,
      font: state.font,
      showBrand: state.showBrand,
      links: state.links.filter(link => link.enabled).map(({ platform, title, subtitle, url: destination }) => ({ platform, title, subtitle, url: destination }))
    };
    url.hash = `p=${encodeSnapshot(snapshot)}`;
    return url.href;
  }

  function optimizeLogo(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => {
        try {
          if (!image.naturalWidth || !image.naturalHeight) throw new Error('Imagem sem dimensões');
          const scale = Math.min(1, 400 / image.naturalWidth, 400 / image.naturalHeight);
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Canvas indisponível');
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const optimized = safeLogo(canvas.toDataURL('image/webp', 0.85));
          if (!optimized) throw new Error('Imagem inválida');
          resolve(optimized);
        } catch (error) { reject(error); }
      }, { once: true });
      image.addEventListener('error', () => reject(new Error('Não foi possível decodificar a imagem')), { once: true });
      image.src = dataUrl;
    });
  }

  async function copyText(value, successMessage) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível');
      await navigator.clipboard.writeText(value);
      toast(successMessage || 'Link copiado!');
      return true;
    } catch {
      const helper = node('textarea');
      helper.value = value;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.append(helper);
      helper.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { /* Offer manual copy below. */ }
      helper.remove();
      if (copied) {
        toast(successMessage || 'Link copiado!');
        return true;
      }
      const input = $('#published-url');
      if (input) {
        input.value = value;
        openDialog($('#publish-dialog'));
        input.focus();
        input.select();
      }
      toast('Selecione o link e copie manualmente com Ctrl+C.');
      return false;
    }
  }

  function publish() {
    if (!state.name.trim()) {
      selectTab('info');
      $('#page-name')?.focus();
      toast('Preencha o nome da página para continuar.');
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(state.slug) || state.slug.length < 3) {
      selectTab('info');
      $('#page-slug')?.focus();
      toast('Use ao menos 3 letras ou números no identificador, com hífens entre palavras.');
      return;
    }
    const active = state.links.filter(link => link.enabled);
    if (!active.length) {
      selectTab('links');
      toast('Ative pelo menos um link antes de gerar a página.');
      return;
    }
    const invalid = active.find(link => !link.title.trim() || !validUrl(link.url));
    if (invalid) {
      selectTab('links');
      const field = $(`[data-link-id="${invalid.id}"] [data-field="${invalid.title.trim() ? 'url' : 'title'}"]`);
      field?.focus();
      field?.setAttribute('aria-invalid', 'true');
      toast('Preencha o título e um endereço válido em todos os links ativos.');
      return;
    }
    saveDraft(false);
    const url = shareUrl();
    if ($('#published-url')) $('#published-url').value = url;
    const open = $('#open-published-link');
    if (open) {
      open.href = url;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
    }
    const note = $('#published-note');
    if (note) note.textContent = state.logo.startsWith('data:')
      ? 'Esta demonstração guarda a página no próprio link. A logo anexada torna o link longo; para usar na bio, será necessário conectar a publicação ao servidor do Monitor LocyTech.'
      : 'Esta demonstração guarda a página no próprio link. Para um endereço curto na bio e atualizações em tempo real, conecte a publicação ao servidor do Monitor LocyTech.';
    openDialog($('#publish-dialog'));
  }

  function bindEvents() {
    $$('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => selectTab(tab.dataset.tab));
      tab.addEventListener('keydown', event => {
        const order = ['info', 'links', 'appearance'];
        const current = order.indexOf(tab.dataset.tab);
        const next = event.key === 'ArrowRight' ? (current + 1) % 3 : event.key === 'ArrowLeft' ? (current + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
        if (next < 0) return;
        event.preventDefault();
        selectTab(order[next], true);
      });
    });
    $$('[data-go-links]').forEach(button => button.addEventListener('click', () => {
      selectTab('links', true);
    }));

    const fieldMap = {
      '#page-name': 'name', '#client-name': 'client', '#page-slug': 'slug', '#page-description': 'description',
      '#primary-color': 'primaryColor', '#accent-color': 'accentColor', '#background-color': 'backgroundColor', '#font-choice': 'font'
    };
    Object.entries(fieldMap).forEach(([selector, key]) => {
      $(selector)?.addEventListener('input', event => {
        state[key] = event.target.value;
        event.target.removeAttribute('aria-invalid');
        updateColorLabels();
        changed();
      });
    });
    $('#page-slug')?.addEventListener('blur', event => {
      const sanitized = event.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50).replace(/-$/, '');
      if (state.slug !== sanitized) {
        state.slug = sanitized;
        event.target.value = sanitized;
        changed();
      }
    });
    $('#show-brand')?.addEventListener('change', event => { state.showBrand = event.target.checked; changed(); });
    ['rounded', 'square'].forEach(shape => $(`#shape-${shape}`)?.addEventListener('click', () => {
      state.shape = shape;
      syncFields();
      changed();
    }));
    $('#logo-upload')?.addEventListener('change', event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const uploadVersion = ++logoUploadVersion;
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        event.target.value = '';
        toast('Escolha uma imagem PNG, JPG ou WebP.');
        return;
      }
      if (file.size > MAX_LOGO_BYTES) {
        event.target.value = '';
        toast('Escolha uma logo de até 1,5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const result = safeLogo(reader.result);
        if (!result) { toast('Não foi possível ler essa imagem.'); return; }
        try {
          const optimized = await optimizeLogo(result);
          if (uploadVersion !== logoUploadVersion) return;
          state.logo = optimized;
          changed();
          toast('Logo atualizada e otimizada para a página.');
        } catch {
          if (uploadVersion !== logoUploadVersion) return;
          event.target.value = '';
          toast('Não foi possível abrir essa imagem. Escolha outro arquivo PNG, JPG ou WebP.');
        }
      });
      reader.addEventListener('error', () => toast('Não foi possível abrir a imagem. Tente outra logo.'));
      reader.readAsDataURL(file);
    });
    $('#remove-logo')?.addEventListener('click', () => {
      logoUploadVersion++;
      state.logo = '';
      if ($('#logo-upload')) $('#logo-upload').value = '';
      changed();
      toast('Logo removida da página.');
    });

    $('#links-list')?.addEventListener('input', event => {
      const field = event.target.dataset.field;
      const card = event.target.closest('[data-link-id]');
      if (!card || !['title', 'subtitle', 'url'].includes(field)) return;
      const link = state.links.find(item => item.id === card.dataset.linkId);
      if (!link) return;
      link[field] = event.target.value;
      event.target.removeAttribute('aria-invalid');
      if (field === 'url') {
        link.example = false;
        const hint = $('.link-editor-subtitle', card);
        if (hint) hint.textContent = 'Personalize este atalho';
      }
      changed();
    });
    $('#links-list')?.addEventListener('change', event => {
      if (event.target.dataset.action !== 'toggle') return;
      const card = event.target.closest('[data-link-id]');
      const link = state.links.find(item => item.id === card?.dataset.linkId);
      if (!link) return;
      link.enabled = event.target.checked;
      card.classList.toggle('is-disabled', !link.enabled);
      changed();
    });
    $('#links-list')?.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const id = button.closest('[data-link-id]')?.dataset.linkId;
      const index = state.links.findIndex(link => link.id === id);
      if (index < 0) return;
      const action = button.dataset.action;
      if (action === 'delete') {
        const name = platforms[state.links[index].platform].name;
        state.links.splice(index, 1);
        renderLinks();
        changed();
        const next = $$('[data-link-id]')[Math.min(index, state.links.length - 1)];
        (next?.querySelector('button') || $('#add-link'))?.focus();
        toast(`${name} removido. Salve para manter a alteração.`);
        return;
      }
      const nextIndex = action === 'up' ? index - 1 : action === 'down' ? index + 1 : -1;
      if (nextIndex < 0 || nextIndex >= state.links.length) return;
      [state.links[index], state.links[nextIndex]] = [state.links[nextIndex], state.links[index]];
      renderLinks();
      changed();
      const moved = $(`[data-link-id="${id}"] button[data-action="${action}"]`);
      if (moved && !moved.disabled) moved.focus();
      else $(`[data-link-id="${id}"] [data-field="title"]`)?.focus();
    });

    const updateModalPlatform = () => {
      const platform = platforms[$('#link-platform')?.value] || platforms.custom;
      if ($('#link-title')) $('#link-title').value = platform.title;
      if ($('#link-url')) $('#link-url').placeholder = platform.placeholder;
    };
    $('#add-link')?.addEventListener('click', () => {
      if (state.links.length >= 30) { toast('Você pode adicionar até 30 links por página.'); return; }
      $('#link-form')?.reset();
      updateModalPlatform();
      $('#link-url')?.setCustomValidity('');
      openDialog($('#link-dialog'));
      $('#link-platform')?.focus();
    });
    $('#link-platform')?.addEventListener('change', updateModalPlatform);
    $('#link-url')?.addEventListener('input', event => event.target.setCustomValidity(''));
    $('#cancel-link')?.addEventListener('click', () => closeDialog($('#link-dialog')));
    $('#link-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const platform = $('#link-platform')?.value || 'custom';
      const title = $('#link-title')?.value.trim();
      const urlField = $('#link-url');
      const url = validUrl(urlField?.value);
      if (!title) {
        $('#link-title')?.focus();
        toast('Dê um título para este botão.');
        return;
      }
      if (!url) {
        urlField?.setCustomValidity('Informe um link com https://, http://, mailto: ou tel:.');
        urlField?.reportValidity();
        return;
      }
      const link = { id: uid(), platform: Object.hasOwn(platforms, platform) ? platform : 'custom', title, subtitle: platforms[platform]?.subtitle || '', url, enabled: true, example: false };
      state.links.push(link);
      closeDialog($('#link-dialog'));
      selectTab('links');
      renderLinks();
      changed();
      $(`[data-link-id="${link.id}"] [data-field="title"]`)?.focus();
      toast('Novo link adicionado à página.');
    });

    $('#save-draft')?.addEventListener('click', () => saveDraft());
    $('#publish-page')?.addEventListener('click', publish);
    $('#close-publish')?.addEventListener('click', () => closeDialog($('#publish-dialog')));
    $('#copy-published-link')?.addEventListener('click', () => copyText($('#published-url')?.value || shareUrl(), 'Link da página copiado!'));
    $('#copy-link')?.addEventListener('click', () => copyText(shareUrl(), 'Link da prévia copiado!'));
    $('#preview-page')?.addEventListener('click', () => {
      window.open(shareUrl(), '_blank', 'noopener,noreferrer');
      if (state.logo.startsWith('data:')) toast('A prévia inclui sua logo; o link desta demonstração pode ficar longo.');
    });

    const selectDevice = desktop => {
      $('#device-preview')?.classList.toggle('desktop-preview', desktop);
      [['#preview-desktop', desktop], ['#preview-mobile', !desktop]].forEach(([selector, active]) => {
        const button = $(selector);
        if (!button) return;
        button.setAttribute('aria-pressed', String(active));
        button.classList.toggle('is-active', active);
        button.classList.toggle('active', active);
        button.classList.toggle('selected', active);
      });
    };
    $('#preview-desktop')?.addEventListener('click', () => selectDevice(true));
    $('#preview-mobile')?.addEventListener('click', () => selectDevice(false));
    $('#help-button')?.addEventListener('click', () => openDialog($('#help-dialog')));
    $('#close-help')?.addEventListener('click', () => closeDialog($('#help-dialog')));
    const sections = {
      overview: ['Visão geral', 'A visão geral reunirá as informações do Monitor LocyTech. Nesta demonstração, você pode criar e testar o produto Link na bio pelo editor.'],
      clients: ['Clientes', 'O cadastro e a seleção de clientes serão conectados ao Monitor LocyTech. Nesta demonstração, informe o nome do cliente no editor para personalizar sua página.'],
      reports: ['Relatórios', 'As métricas de acesso dependem da publicação integrada ao Monitor LocyTech. Esta demonstração permite montar e testar a página, sem coletar estatísticas de visitantes.'],
      settings: ['Configurações', 'As configurações da conta serão conectadas ao Monitor LocyTech. As cores, a tipografia e a assinatura deste produto já podem ser ajustadas na aba Aparência.']
    };
    $$('[data-section]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault();
      const section = sections[button.dataset.section];
      if (!section) return;
      if ($('#section-title')) $('#section-title').textContent = section[0];
      if ($('#section-description')) $('#section-description').textContent = section[1];
      openDialog($('#section-dialog'));
    }));
    $('#close-section')?.addEventListener('click', () => {
      closeDialog($('#section-dialog'));
      $('#editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ['#nav-products', '#back-products'].forEach(selector => $(selector)?.addEventListener('click', event => {
      event.preventDefault();
      selectTab('info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('Você está no cadastro do produto Link na bio.');
    }));
    $$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    }));
  }

  function setPublicMode(snapshot) {
    publicMode = true;
    state = snapshot;
    state.client = state.name;
    if ($('#admin-app')) $('#admin-app').hidden = true;
    if ($('#public-view')) $('#public-view').hidden = false;
    document.body.classList.add('public-mode');
    document.title = `${state.name || 'Links'} · LocyTech`;
    renderBio($('#public-content'));
    document.body.style.backgroundColor = state.backgroundColor;
    if ($('#public-view')) $('#public-view').style.backgroundColor = state.backgroundColor;
  }

  function initialize() {
    const snapshot = location.hash.startsWith('#p=') ? location.hash.slice(3) : '';
    if (snapshot) {
      try {
        setPublicMode(decodeSnapshot(snapshot));
        return;
      } catch {
        toast('Não foi possível abrir este link. Confira se ele foi copiado por completo.');
      }
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved?.state) {
        state = normalize(saved.state);
        savedAt = typeof saved.savedAt === 'string' ? saved.savedAt : null;
      }
    } catch { /* The editor remains usable when browser storage is unavailable. */ }
    if ($('#admin-app')) $('#admin-app').hidden = false;
    if ($('#public-view')) $('#public-view').hidden = true;
    syncFields();
    renderLinks();
    renderPreview();
    setStatus();
    bindEvents();
    selectTab('info');
  }

  window.LocyBio = Object.freeze({ getState: () => clone(state), shareUrl, render: () => { syncFields(); renderLinks(); renderPreview(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
