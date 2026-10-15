(() => {
  'use strict';

  const STORAGE_KEY = 'locytech-catalog:v2';
  const DEFAULT_LOGO = './assets/locytech.png';
  const MAX_LOGO_BYTES = 1.5 * 1024 * 1024;
  const icons = ['window', 'globe', 'store', 'briefcase', 'links'];
  const platformNames = { whatsapp: 'WhatsApp', instagram: 'Instagram', linkedin: 'LinkedIn', website: 'Site', email: 'E-mail', custom: 'Outro canal' };
  const defaults = {
    version: 2,
    name: 'LocyTech',
    eyebrow: 'SITES QUE CONECTAM',
    description: 'Sua marca merece um lugar de destaque na internet.\nEscolha a solução para o seu próximo passo.',
    slug: 'locytech',
    logo: DEFAULT_LOGO,
    primaryColor: '#2471e8',
    accentColor: '#f4cf54',
    backgroundColor: '#f2f7fd',
    showBrand: true,
    products: [
      { id: 'landing-page', icon: 'window', category: 'landing', title: 'Landing page', description: 'Uma página pensada para transformar visitas em oportunidades.', note: 'Campanhas e lançamentos', price: 'Sob consulta', features: ['Layout pensado para o seu objetivo', 'Apresentação da oferta e chamadas para ação', 'Experiência adaptada ao celular', 'Conexão com seus canais de contato'], enabled: true },
      { id: 'site-institucional', icon: 'globe', category: 'sites', title: 'Site institucional', description: 'A sua empresa na internet, com credibilidade e personalidade.', note: 'Presença digital profissional', price: 'Sob consulta', features: ['Apresentação da empresa e dos serviços', 'Identidade visual da sua marca', 'Navegação adaptada a diferentes telas', 'Canais de contato em destaque'], enabled: true },
      { id: 'loja-virtual', icon: 'store', category: 'sites', title: 'Loja virtual', description: 'Sua vitrine online, pronta para receber novos clientes.', note: 'Catálogo e vendas online', price: 'Sob consulta', features: ['Catálogo organizado por categorias', 'Apresentação dos produtos', 'Experiência de compra planejada para o negócio', 'Integrações definidas no orçamento'], enabled: true },
      { id: 'site-profissionais', icon: 'briefcase', category: 'sites', title: 'Site para profissionais', description: 'Mostre seu trabalho e conecte-se com quem precisa de você.', note: 'Portfólio e serviços', price: 'Sob consulta', features: ['Apresentação do seu trabalho', 'Portfólio e descrição dos serviços', 'Página adaptada ao celular', 'Atalhos para os seus canais'], enabled: true },
      { id: 'pagina-links', icon: 'links', category: 'landing', title: 'Página de links', description: 'Todos os seus canais em uma página simples e personalizada.', note: 'Feita para a bio do Instagram', price: 'Sob consulta', features: ['Logo, cores e textos da marca', 'Atalhos para site e redes sociais', 'Links organizados por prioridade', 'Experiência simples no celular'], enabled: true }
    ],
    links: [
      { id: 'whatsapp', platform: 'whatsapp', title: 'WhatsApp', url: '', enabled: true },
      { id: 'instagram', platform: 'instagram', title: 'Instagram', url: '', enabled: true },
      { id: 'linkedin', platform: 'linkedin', title: 'LinkedIn', url: '', enabled: true },
      { id: 'website', platform: 'website', title: 'Nosso site', url: '', enabled: true }
    ]
  };

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const clone = value => JSON.parse(JSON.stringify(value));
  const text = (value, fallback = '', max = 300) => typeof value === 'string' ? value.slice(0, max) : fallback;
  const uid = () => globalThis.crypto?.randomUUID?.() || `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const color = (value, fallback) => /^#[\da-f]{6}$/i.test(value || '') ? value : fallback;
  const safeLogo = value => value === DEFAULT_LOGO || /^data:image\/(?:png|jpeg|webp);base64,[a-z\d+/=]+$/i.test(value || '') && value.length < 3 * 1024 * 1024 ? value : '';

  function normalize(source) {
    source = source && typeof source === 'object' ? source : {};
    return {
      version: 2,
      name: text(source.name, defaults.name, 60),
      eyebrow: text(source.eyebrow, defaults.eyebrow, 70),
      description: text(source.description, defaults.description, 240),
      slug: text(source.slug, defaults.slug, 50),
      logo: source.logo === '' ? '' : safeLogo(source.logo) || DEFAULT_LOGO,
      primaryColor: color(source.primaryColor, defaults.primaryColor),
      accentColor: color(source.accentColor, defaults.accentColor),
      backgroundColor: color(source.backgroundColor, defaults.backgroundColor),
      showBrand: source.showBrand !== false,
      products: (Array.isArray(source.products) ? source.products : defaults.products).slice(0, 30).map(product => ({
        id: uid(),
        icon: icons.includes(product?.icon) ? product.icon : 'window',
        category: product?.category === 'sites' ? 'sites' : 'landing',
        title: text(product?.title, 'Nova solução', 70),
        description: text(product?.description, '', 240),
        note: text(product?.note, '', 80),
        price: text(product?.price, 'Sob consulta', 40) || 'Sob consulta',
        features: (Array.isArray(product?.features) ? product.features : []).filter(item => typeof item === 'string').slice(0, 8).map(item => item.slice(0, 130)),
        enabled: product?.enabled !== false
      })),
      links: (Array.isArray(source.links) ? source.links : defaults.links).slice(0, 20).map(link => ({
        id: uid(),
        platform: Object.hasOwn(platformNames, link?.platform) ? link.platform : 'custom',
        title: text(link?.title, 'Novo canal', 60),
        url: text(link?.url, '', 2048),
        enabled: link?.enabled !== false
      }))
    };
  }

  let state = clone(defaults);
  let activeFilter = 'all';
  let activeEditorTab = 'brand';
  let editingProductId = null;
  let detailProductId = null;
  let preparedQuote = '';
  let publicMode = false;
  let publicLoadError = '';
  let dirty = false;
  let savedAt = null;
  let toastTimer;
  let logoUploadVersion = 0;

  function node(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  }

  function svg(name, size = 22) {
    const paths = {
      window: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01m3 0h.01M7 13h5m-5 3h9"/>',
      globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
      store: '<path d="M4 10v11h16V10M3 7l2-4h14l2 4v3a3 3 0 0 1-4 0 3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-4 0V7Zm0 0h18M9 21v-7h6v7"/>',
      briefcase: '<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V3h8v4M3 12a21 21 0 0 0 18 0M10 13v3h4v-3"/>',
      links: '<path d="m10 13 4-4m-6 6-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 2 1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0" transform="translate(1 1)"/>',
      website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a16 16 0 0 1 0 18 16 16 0 0 1 0-18Z"/>',
      whatsapp: '<path d="M20 11.5a8.4 8.4 0 0 1-8.5 8.3 9 9 0 0 1-4-.9L3 20l1.2-4.3A8.2 8.2 0 0 1 3 11.5a8.5 8.5 0 0 1 17 0Z"/><path d="M8 7.4c-.8.6-.8 1.6-.1 2.9a10 10 0 0 0 4 4c1.3.7 2.2.7 2.9-.1l.5-.8-2.5-1.2-.8.8a7 7 0 0 1-2.7-2.7l.8-.8-1.2-2.5Z"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
      linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5v7m0-10v.1M11.5 17.5v-7m0 3a3 3 0 0 1 6 0v4"/>',
      email: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
      arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
      chevron: '<path d="m9 5 7 7-7 7"/>',
      up: '<path d="m6 14 6-6 6 6"/>',
      down: '<path d="m6 10 6 6 6-6"/>',
      edit: '<path d="m14 4 6 6M4 20l5-1L21 7a2.8 2.8 0 0 0-4-4L5 15l-1 5Z"/>',
      trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
      spark: '<path d="m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Z"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.links}</svg>`;
  }

  function symbol(name, className, size = 22) {
    const wrapper = node('span', className);
    wrapper.innerHTML = svg(name, size);
    return wrapper;
  }

  function toast(message) {
    const target = $('#toast');
    if (!target) return;
    clearTimeout(toastTimer);
    target.textContent = message;
    target.hidden = false;
    target.classList.add('is-visible');
    toastTimer = setTimeout(() => { target.classList.remove('is-visible'); target.hidden = true; }, 4500);
  }

  function safeUrl(raw) {
    const value = String(raw || '').trim();
    if (!value || /[\u0000-\u0020\u007f]/.test(value)) return '';
    if (/^https?:\/\//i.test(value)) {
      try { const url = new URL(value); return url.hostname && ['http:', 'https:'].includes(url.protocol) ? url.href : ''; }
      catch { return ''; }
    }
    if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+(?:\?[^\s]*)?$/i.test(value)) return value;
    if (/^tel:\+?[\d().-]{3,30}$/i.test(value)) return value;
    return '';
  }

  function applyTheme() {
    [document.documentElement, $('#site-shell')].filter(Boolean).forEach(element => {
      element.style.setProperty('--brand-primary', state.primaryColor);
      element.style.setProperty('--brand-accent', state.accentColor);
      element.style.setProperty('--page-background', state.backgroundColor);
    });
    document.body.style.backgroundColor = state.backgroundColor;
  }

  function setStatus(message) {
    const target = $('#editor-status');
    if (target) target.textContent = message || (dirty ? 'Alterações não salvas' : savedAt ? 'Salvo neste navegador' : 'Personalize sua página');
  }

  function changed() { dirty = true; setStatus(); renderPage(); }

  function categoryName(category) { return category === 'sites' ? 'Sites' : 'Landing pages'; }

  function quoteButton(label, className, productId = '') {
    const button = node('button', className, label);
    button.type = 'button';
    button.dataset.quote = productId;
    return button;
  }

  function productCard(product) {
    const card = node('button', 'product-card');
    card.type = 'button';
    card.dataset.product = product.id;
    card.setAttribute('aria-label', `Ver detalhes de ${product.title}`);
    const art = node('span', `product-art art-${product.icon}`);
    art.setAttribute('aria-hidden', 'true');
    const miniBrowser = node('span', 'product-art-browser');
    const dots = node('span', 'product-art-dots');
    dots.append(node('i'), node('i'), node('i'));
    miniBrowser.append(dots, symbol(product.icon, 'product-art-icon', 29));
    art.append(miniBrowser);
    const copy = node('span', 'product-copy');
    copy.append(node('h3', 'product-title', product.title), node('span', 'product-price', product.price), node('p', 'product-description', product.description));
    if (product.note) copy.append(node('span', 'product-note', product.note));
    card.append(art, copy, symbol('chevron', 'product-arrow', 18));
    return card;
  }

  function renderPage() {
    const page = $('#page-content');
    if (!page) return;
    applyTheme();
    page.replaceChildren();
    if (publicLoadError) {
      const warning = node('p', 'catalog-empty public-load-error', publicLoadError);
      warning.setAttribute('role', 'alert');
      page.append(warning);
    }
    const header = node('header', 'profile-header');
    if (state.logo) {
      const logo = node('img', 'profile-logo');
      logo.src = safeLogo(state.logo) || DEFAULT_LOGO;
      logo.alt = `Logo ${state.name || 'da marca'}`;
      logo.width = 104;
      logo.height = 104;
      header.append(logo);
    } else header.append(node('span', 'profile-logo profile-monogram', (state.name.trim().slice(0, 2) || 'LT').toUpperCase()));
    if (state.eyebrow) header.append(node('p', 'profile-eyebrow', state.eyebrow));
    header.append(node('h1', 'profile-name', state.name || 'Sua marca'));
    if (state.description) header.append(node('p', 'profile-description', state.description));
    const actions = node('div', 'profile-actions');
    const primary = quoteButton('Solicitar orçamento', 'profile-action-primary');
    primary.append(symbol('arrow', '', 17));
    const secondary = node('a', 'profile-action-secondary', 'Fale com a gente');
    secondary.href = '#contatos';
    secondary.dataset.scrollContacts = '';
    actions.append(primary, secondary);
    header.append(actions);

    const catalog = node('section', 'catalog-section');
    const heading = node('div', 'catalog-section-header');
    const activeProducts = state.products.filter(product => product.enabled);
    heading.append(symbol('spark', 'section-icon', 18), node('h2', 'catalog-heading', 'Soluções digitais'), node('span', 'catalog-count', String(activeProducts.length).padStart(2, '0')));
    catalog.append(heading, node('p', 'catalog-subtitle', 'Landing pages e sites feitos para o seu negócio.'));
    const filters = node('div', 'catalog-filters');
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filtrar soluções');
    [['all', 'Todos'], ['landing', 'Landing pages'], ['sites', 'Sites']].forEach(([value, label]) => {
      const button = node('button', activeFilter === value ? 'catalog-filter active' : 'catalog-filter', label);
      button.type = 'button';
      button.dataset.filter = value;
      button.setAttribute('aria-pressed', String(activeFilter === value));
      const count = activeProducts.filter(product => value === 'all' || product.category === value).length;
      button.append(node('span', 'filter-count', String(count)));
      filters.append(button);
    });
    const grid = node('div', 'product-grid');
    grid.id = 'product-grid';
    const visible = activeProducts.filter(product => activeFilter === 'all' || product.category === activeFilter);
    visible.forEach(product => grid.append(productCard(product)));
    if (!visible.length) grid.append(node('p', 'catalog-empty', 'Novas soluções estarão disponíveis em breve.'));
    catalog.append(filters, grid);

    const banner = node('section', 'quote-banner');
    const bannerCopy = node('div', 'quote-banner-copy');
    bannerCopy.append(node('h2', 'quote-banner-title', 'Sua ideia merece sair do papel.'), node('p', 'quote-banner-subtitle', 'Conte o que você precisa. Vamos encontrar o melhor caminho.'));
    const bannerButton = quoteButton('Vamos criar juntos', 'quote-banner-button');
    bannerButton.append(symbol('arrow', '', 17));
    banner.append(symbol('spark', 'quote-banner-icon', 25), bannerCopy, bannerButton);

    const contacts = node('section', 'channels-section');
    contacts.id = 'contatos';
    contacts.append(node('h2', 'channels-heading', 'Vamos conversar?'), node('p', 'channels-subtitle', 'Escolha o seu canal favorito para se conectar.'));
    const channelGrid = node('div', 'channel-grid');
    state.links.filter(link => link.enabled).forEach(link => {
      const destination = safeUrl(link.url);
      const channel = node(destination ? 'a' : 'button', `channel-card channel-${link.platform}`);
      if (destination) {
        channel.href = destination;
        channel.target = '_blank';
        channel.rel = 'noopener noreferrer';
      } else {
        channel.type = 'button';
        channel.dataset.channel = link.id;
        channel.setAttribute('aria-label', `${link.title}: canal ainda não disponível`);
      }
      channel.append(symbol(link.platform, 'channel-icon', 20), node('span', 'channel-title', link.title), symbol('chevron', 'channel-arrow', 16));
      channelGrid.append(channel);
    });
    if (!channelGrid.childElementCount) channelGrid.append(node('p', 'channels-empty', 'Prepare uma solicitação de orçamento pelo botão acima.'));
    contacts.append(channelGrid);
    page.append(header, catalog, banner, contacts);
    if (state.showBrand) {
      const footer = node('footer', 'site-footer');
      const mark = node('img', 'footer-logo');
      mark.src = DEFAULT_LOGO;
      mark.alt = '';
      mark.width = 26;
      mark.height = 26;
      footer.append(mark, node('p', '', 'Tecnologia que aproxima.'), node('strong', '', 'LocyTech'));
      page.append(footer);
    }
    document.title = `${state.name || 'Soluções digitais'} · Sites e landing pages`;
  }

  function openDialog(id, closeOthers = true) {
    const dialog = typeof id === 'string' ? $(id) : id;
    if (!dialog) return;
    if (closeOthers) $$('dialog[open]').forEach(item => { if (item !== dialog) closeDialog(item); });
    if (typeof dialog.showModal === 'function') { if (!dialog.open) dialog.showModal(); }
    else { dialog.hidden = false; dialog.setAttribute('open', ''); }
  }

  function closeDialog(id) {
    const dialog = typeof id === 'string' ? $(id) : id;
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else { dialog.removeAttribute('open'); dialog.hidden = true; }
  }

  function selectEditorTab(name, focus = false) {
    if (!['brand', 'products', 'links'].includes(name)) return;
    activeEditorTab = name;
    $$('[data-editor-tab]').forEach(button => {
      const selected = button.dataset.editorTab === name;
      button.classList.toggle('active', selected);
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });
    $$('[data-editor-panel]').forEach(panel => { panel.hidden = panel.dataset.editorPanel !== name; });
  }

  function syncBrandFields() {
    const fields = { '#brand-name': 'name', '#brand-eyebrow': 'eyebrow', '#brand-description': 'description', '#page-slug': 'slug', '#primary-color': 'primaryColor', '#accent-color': 'accentColor', '#background-color': 'backgroundColor' };
    Object.entries(fields).forEach(([selector, key]) => { if ($(selector)) $(selector).value = state[key]; });
    if ($('#brand-footer-checkbox')) $('#brand-footer-checkbox').checked = state.showBrand;
    const logo = $('#logo-preview');
    if (logo) { logo.src = state.logo || DEFAULT_LOGO; logo.hidden = !state.logo; }
    if ($('#remove-logo')) $('#remove-logo').disabled = !state.logo;
  }

  function actionButton(action, label, icon, disabled = false) {
    const button = node('button', 'icon-button');
    button.type = 'button';
    button.dataset.action = action;
    button.title = label;
    button.setAttribute('aria-label', label);
    button.disabled = disabled;
    button.innerHTML = svg(icon, 17);
    return button;
  }

  function toggleInput(enabled, label) {
    const wrapper = node('label', 'switch');
    const input = node('input');
    input.type = 'checkbox';
    input.checked = enabled;
    input.dataset.action = 'toggle';
    input.setAttribute('aria-label', label);
    wrapper.append(input, node('span', 'switch-track'));
    return wrapper;
  }

  function renderEditorProducts() {
    const list = $('#product-list');
    if (!list) return;
    list.replaceChildren();
    state.products.forEach((product, index) => {
      const card = node('article', `editor-product${product.enabled ? '' : ' is-disabled'}`);
      card.dataset.productId = product.id;
      const head = node('div', 'editor-product-head');
      const name = node('div', 'editor-product-name');
      name.append(symbol(product.icon, 'editor-product-icon', 20), node('strong', '', product.title), node('small', '', categoryName(product.category)));
      const actions = node('div', 'editor-product-actions');
      actions.append(actionButton('edit', `Editar ${product.title}`, 'edit'), actionButton('up', `Mover ${product.title} para cima`, 'up', index === 0), actionButton('down', `Mover ${product.title} para baixo`, 'down', index === state.products.length - 1), actionButton('delete', `Excluir ${product.title}`, 'trash'), toggleInput(product.enabled, `Mostrar ${product.title}`));
      head.append(name, actions);
      card.append(head, node('p', 'editor-product-description', product.description), node('span', 'editor-product-price', product.price));
      list.append(card);
    });
    if (!state.products.length) list.append(node('p', 'editor-empty', 'Adicione a primeira solução do seu catálogo.'));
  }

  function linkField(link, key, labelText) {
    const wrapper = node('div', 'field');
    const id = `contact-${link.id}-${key}`;
    const label = node('label', '', labelText);
    label.htmlFor = id;
    const input = node('input');
    input.id = id;
    input.type = 'text';
    input.value = link[key];
    input.dataset.linkField = key;
    input.maxLength = key === 'url' ? 2048 : 60;
    if (key === 'url') { input.placeholder = 'Adicione o link real deste canal'; input.inputMode = 'url'; }
    wrapper.append(label, input);
    return wrapper;
  }

  function renderEditorLinks() {
    const list = $('#contact-links-list');
    if (!list) return;
    list.replaceChildren();
    state.links.forEach(link => {
      const card = node('article', `editor-contact${link.enabled ? '' : ' is-disabled'}`);
      card.dataset.contactId = link.id;
      const head = node('div', 'editor-contact-head');
      const title = node('div', 'editor-contact-title');
      title.append(symbol(link.platform, '', 20), node('strong', '', platformNames[link.platform]));
      const actions = node('div', 'editor-contact-actions');
      actions.append(actionButton('delete', `Excluir ${link.title}`, 'trash'), toggleInput(link.enabled, `Mostrar ${link.title}`));
      head.append(title, actions);
      const fields = node('div', 'editor-contact-fields');
      fields.append(linkField(link, 'title', 'Nome do canal'), linkField(link, 'url', 'Link de destino'));
      card.append(head, fields);
      list.append(card);
    });
    if (!state.links.length) list.append(node('p', 'editor-empty', 'Adicione um canal para facilitar o contato.'));
  }

  function openEditor(tab = activeEditorTab) {
    syncBrandFields();
    renderEditorProducts();
    renderEditorLinks();
    selectEditorTab(tab);
    setStatus();
    openDialog('#editor-dialog');
  }

  function saveDraft() {
    try {
      const timestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, savedAt: timestamp }));
      savedAt = timestamp;
      dirty = false;
      setStatus();
      toast('Sua página foi salva neste navegador.');
      return true;
    } catch {
      setStatus('Não foi possível salvar neste navegador');
      toast('O navegador não conseguiu salvar. O conteúdo continua aberto; copie o link de prévia para guardar esta versão.');
      return false;
    }
  }

  function openProductEditor(id = null) {
    const product = state.products.find(item => item.id === id);
    if (!product && state.products.length >= 30) { toast('Seu catálogo pode ter até 30 soluções.'); return; }
    editingProductId = product?.id || null;
    $('#product-edit-form')?.reset();
    const fields = { '#product-title': 'title', '#product-description': 'description', '#product-category': 'category', '#product-note': 'note', '#product-price': 'price', '#product-icon': 'icon' };
    const empty = { title: '', description: '', category: 'landing', note: '', price: 'Sob consulta', icon: 'window' };
    Object.entries(fields).forEach(([selector, key]) => { if ($(selector)) $(selector).value = product ? product[key] : empty[key]; });
    if ($('#product-features')) $('#product-features').value = product?.features.join('\n') || '';
    if ($('#product-edit-heading')) $('#product-edit-heading').textContent = product ? 'Editar solução' : 'Adicionar solução';
    openDialog('#product-edit-dialog');
    $('#product-title')?.focus();
  }

  function showProduct(id) {
    const product = state.products.find(item => item.id === id && item.enabled);
    if (!product) return;
    detailProductId = id;
    const content = $('#product-detail-content');
    if (content) {
      content.replaceChildren();
      const title = node('h2', 'detail-title', product.title);
      title.id = 'detail-product-title';
      content.append(symbol(product.icon, `detail-icon art-${product.icon}`, 32), node('p', 'detail-category', categoryName(product.category)), title, node('p', 'detail-description', product.description));
      if (product.note) content.append(node('p', 'detail-note', product.note));
      if (product.features.length) {
        const list = node('ul', 'detail-features');
        product.features.forEach(feature => {
          list.append(node('li', '', feature));
        });
        content.append(list);
      }
      content.append(node('p', 'detail-price', product.price), node('p', 'detail-price-note', 'O escopo e o valor são definidos de acordo com o seu projeto.'));
    }
    openDialog('#product-dialog');
  }

  function quoteResultVisible(visible) {
    if ($('#quote-result')) $('#quote-result').hidden = !visible;
    if ($('#quote-result-actions')) $('#quote-result-actions').hidden = !visible;
    if ($('#quote-result-note')) $('#quote-result-note').hidden = !visible;
    if ($('#quote-submit')) $('#quote-submit').hidden = visible;
    $$('#quote-form .field').forEach(field => { field.hidden = visible; });
    if ($('#quote-fields')) $('#quote-fields').hidden = visible;
  }

  function fillQuoteProducts(selected = '') {
    const select = $('#quote-product');
    if (!select) return;
    select.replaceChildren();
    const first = node('option', '', 'Quero uma orientação');
    first.value = '';
    select.append(first);
    state.products.filter(product => product.enabled).forEach(product => {
      const option = node('option', '', product.title);
      option.value = product.id;
      select.append(option);
    });
    select.value = state.products.some(product => product.id === selected && product.enabled) ? selected : '';
  }

  function openQuote(productId = '') {
    preparedQuote = '';
    $('#quote-form')?.reset();
    fillQuoteProducts(productId);
    quoteResultVisible(false);
    if ($('#quote-title')) $('#quote-title').textContent = 'Conte sobre o seu projeto.';
    openDialog('#quote-dialog');
    $('#quote-name')?.focus();
  }

  function whatsappUrl(message) {
    for (const link of state.links.filter(item => item.enabled && item.platform === 'whatsapp')) {
      const destination = safeUrl(link.url);
      if (!/^https:\/\//i.test(destination)) continue;
      const url = new URL(destination);
      const isShort = url.hostname === 'wa.me' && /^\/\d{8,15}\/?$/.test(url.pathname);
      const isApi = url.hostname === 'api.whatsapp.com' && url.pathname.replace(/\/$/, '') === '/send' && /^\d{8,15}$/.test(url.searchParams.get('phone') || '');
      if (!isShort && !isApi) continue;
      url.searchParams.set('text', message);
      return url.href;
    }
    return '';
  }

  function emailUrl(message) {
    const link = state.links.find(item => item.enabled && /^mailto:/i.test(safeUrl(item.url)));
    if (!link) return '';
    const url = new URL(safeUrl(link.url));
    url.searchParams.set('subject', `Solicitação de orçamento — ${state.name}`);
    url.searchParams.set('body', message);
    return url.href;
  }

  function setQuoteDestinations() {
    [['#quote-whatsapp', whatsappUrl(preparedQuote)], ['#quote-email-link', emailUrl(preparedQuote)]].forEach(([selector, destination]) => {
      const anchor = $(selector);
      if (!anchor) return;
      anchor.hidden = !destination;
      if (destination) { anchor.href = destination; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
      else anchor.removeAttribute('href');
    });
  }

  function encode(snapshot) {
    const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
    let binary = '';
    for (let index = 0; index < bytes.length; index += 16384) binary += String.fromCharCode(...bytes.subarray(index, index + 16384));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function shareUrl() {
    const snapshot = {
      version: 2,
      name: state.name,
      eyebrow: state.eyebrow,
      description: state.description,
      logo: state.logo,
      primaryColor: state.primaryColor,
      accentColor: state.accentColor,
      backgroundColor: state.backgroundColor,
      showBrand: state.showBrand,
      products: state.products.filter(product => product.enabled).map(({ icon, category, title, description, note, price, features }) => ({ icon, category, title, description, note, price, features })),
      links: state.links.filter(link => link.enabled).map(({ platform, title, url }) => ({ platform, title, url: safeUrl(url) }))
    };
    const url = new URL(location.href);
    url.hash = `p=${encode(snapshot)}`;
    return url.href;
  }

  function decodeSnapshot(encoded) {
    if (encoded.length > 4 * 1024 * 1024 || !/^[\w-]+$/.test(encoded)) throw new Error('Link inválido');
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const result = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!result || typeof result !== 'object' || !Array.isArray(result.products) || !Array.isArray(result.links)) throw new Error('Página inválida');
    return normalize(result);
  }

  function openShare() {
    if (!state.name.trim()) { openEditor('brand'); $('#brand-name')?.focus(); toast('Preencha o nome da marca.'); return; }
    const invalid = state.links.find(link => link.enabled && link.url.trim() && !safeUrl(link.url));
    if (invalid) {
      openEditor('links');
      $(`[data-contact-id="${invalid.id}"] [data-link-field="url"]`)?.focus();
      toast('Confira o endereço do canal antes de gerar o link.');
      return;
    }
    const url = shareUrl();
    if ($('#share-url')) $('#share-url').value = url;
    if ($('#open-share')) { $('#open-share').href = url; $('#open-share').target = '_blank'; $('#open-share').rel = 'noopener noreferrer'; }
    if ($('#share-note')) $('#share-note').textContent = 'Este link guarda uma versão de demonstração da página. Alterações futuras geram um novo link. Para um endereço curto na bio, a publicação precisa ser conectada ao Monitor LocyTech.';
    openDialog('#share-dialog');
  }

  async function copyText(value, message) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível');
      await navigator.clipboard.writeText(value);
      toast(message || 'Copiado!');
      return true;
    } catch {
      const helper = node('textarea');
      helper.value = value;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      const modal = $('dialog[open]') || document.body;
      modal.append(helper);
      helper.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { /* Manual copy remains available. */ }
      helper.remove();
      if (copied) { toast(message || 'Copiado!'); return true; }
      if (value === preparedQuote && $('#quote-result')) {
        const result = $('#quote-result');
        if (typeof result.select === 'function') { result.focus(); result.select(); }
        else {
          const range = document.createRange();
          range.selectNodeContents(result);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else { $('#share-url')?.focus(); $('#share-url')?.select(); }
      toast('Selecione o texto e copie com Ctrl+C.');
      return false;
    }
  }

  function optimizeLogo(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => {
        try {
          if (!image.naturalWidth || !image.naturalHeight) throw new Error('Imagem inválida');
          const scale = Math.min(1, 400 / image.naturalWidth, 400 / image.naturalHeight);
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Imagem indisponível');
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const optimized = safeLogo(canvas.toDataURL('image/webp', 0.85));
          if (!optimized) throw new Error('Formato inválido');
          resolve(optimized);
        } catch (error) { reject(error); }
      }, { once: true });
      image.addEventListener('error', () => reject(new Error('Não foi possível abrir a imagem')), { once: true });
      image.src = dataUrl;
    });
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const contacts = event.target.closest('[data-scroll-contacts]');
      if (contacts) {
        event.preventDefault();
        $('#contatos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const quote = event.target.closest('[data-quote]');
      if (quote) { event.preventDefault(); openQuote(quote.dataset.quote); return; }
      const product = event.target.closest('[data-product]');
      if (product) { showProduct(product.dataset.product); return; }
      const filter = event.target.closest('[data-filter]');
      if (filter && ['all', 'landing', 'sites'].includes(filter.dataset.filter)) {
        activeFilter = filter.dataset.filter;
        renderPage();
        $(`[data-filter="${activeFilter}"]`)?.focus({ preventScroll: true });
        return;
      }
      const unavailable = event.target.closest('[data-channel]');
      if (unavailable) {
        const content = $('#contact-dialog-content');
        if (content) content.textContent = 'Este canal ainda não está disponível. Você pode preparar uma solicitação de orçamento.';
        openDialog('#contact-dialog');
      }
    });

    $('#editor-launch')?.addEventListener('click', () => openEditor());
    $('#editor-close')?.addEventListener('click', () => closeDialog('#editor-dialog'));
    $('#save-page')?.addEventListener('click', saveDraft);
    $('#share-launch')?.addEventListener('click', openShare);
    $('#publish-page')?.addEventListener('click', openShare);
    $('#close-share')?.addEventListener('click', () => closeDialog('#share-dialog'));
    $('#copy-share')?.addEventListener('click', () => copyText($('#share-url')?.value || shareUrl(), 'Link da página copiado!'));
    $('#contact-close')?.addEventListener('click', () => closeDialog('#contact-dialog'));

    $$('[data-editor-tab]').forEach(button => {
      button.addEventListener('click', () => selectEditorTab(button.dataset.editorTab));
      button.addEventListener('keydown', event => {
        const order = ['brand', 'products', 'links'];
        const index = order.indexOf(button.dataset.editorTab);
        const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
        if (next < 0) return;
        event.preventDefault();
        selectEditorTab(order[next], true);
      });
    });

    const brandFields = { '#brand-name': 'name', '#brand-eyebrow': 'eyebrow', '#brand-description': 'description', '#page-slug': 'slug', '#primary-color': 'primaryColor', '#accent-color': 'accentColor', '#background-color': 'backgroundColor' };
    Object.entries(brandFields).forEach(([selector, key]) => $(selector)?.addEventListener('input', event => { state[key] = event.target.value; changed(); }));
    $('#page-slug')?.addEventListener('blur', event => {
      const slug = event.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50).replace(/-$/, '');
      if (state.slug !== slug) { state.slug = slug; event.target.value = slug; changed(); }
    });
    $('#brand-footer-checkbox')?.addEventListener('change', event => { state.showBrand = event.target.checked; changed(); });
    $('#brand-logo')?.addEventListener('change', event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const version = ++logoUploadVersion;
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { event.target.value = ''; toast('Escolha uma imagem PNG, JPG ou WebP.'); return; }
      if (file.size > MAX_LOGO_BYTES) { event.target.value = ''; toast('Escolha uma imagem de até 1,5 MB.'); return; }
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        try {
          const source = safeLogo(reader.result);
          if (!source) throw new Error('Arquivo inválido');
          const optimized = await optimizeLogo(source);
          if (version !== logoUploadVersion) return;
          state.logo = optimized;
          syncBrandFields();
          changed();
          toast('Logo atualizada e otimizada para a página.');
        } catch {
          if (version !== logoUploadVersion) return;
          event.target.value = '';
          toast('Não foi possível abrir essa imagem. Tente outro arquivo.');
        }
      });
      reader.addEventListener('error', () => toast('Não foi possível ler a imagem.'));
      reader.readAsDataURL(file);
    });
    $('#remove-logo')?.addEventListener('click', () => { logoUploadVersion++; state.logo = ''; if ($('#brand-logo')) $('#brand-logo').value = ''; syncBrandFields(); changed(); });

    $('#add-product')?.addEventListener('click', () => openProductEditor());
    $('#product-cancel')?.addEventListener('click', () => openEditor('products'));
    $('#product-edit-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const title = $('#product-title')?.value.trim();
      if (!title) { $('#product-title')?.focus(); toast('Dê um nome para esta solução.'); return; }
      const existing = state.products.find(product => product.id === editingProductId);
      const product = {
        id: existing?.id || uid(),
        title: title.slice(0, 70),
        description: ($('#product-description')?.value.trim() || '').slice(0, 240),
        category: $('#product-category')?.value === 'sites' ? 'sites' : 'landing',
        note: ($('#product-note')?.value.trim() || '').slice(0, 80),
        price: ($('#product-price')?.value.trim() || 'Sob consulta').slice(0, 40),
        icon: icons.includes($('#product-icon')?.value) ? $('#product-icon').value : 'window',
        features: ($('#product-features')?.value || '').split(/\r?\n/).map(feature => feature.trim()).filter(Boolean).slice(0, 8).map(feature => feature.slice(0, 130)),
        enabled: existing?.enabled !== false
      };
      if (existing) state.products[state.products.indexOf(existing)] = product;
      else state.products.push(product);
      changed();
      openEditor('products');
      toast(existing ? 'Solução atualizada.' : 'Nova solução adicionada.');
    });
    $('#product-list')?.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      const card = button?.closest('[data-product-id]');
      const index = state.products.findIndex(product => product.id === card?.dataset.productId);
      if (!button || index < 0) return;
      const action = button.dataset.action;
      if (action === 'edit') { openProductEditor(state.products[index].id); return; }
      if (action === 'delete') { state.products.splice(index, 1); renderEditorProducts(); changed(); toast('Solução removida do catálogo.'); return; }
      const next = action === 'up' ? index - 1 : action === 'down' ? index + 1 : -1;
      if (next < 0 || next >= state.products.length) return;
      const id = state.products[index].id;
      [state.products[index], state.products[next]] = [state.products[next], state.products[index]];
      renderEditorProducts();
      changed();
      const target = $(`[data-product-id="${id}"] [data-action="${action}"]`);
      if (target && !target.disabled) target.focus();
      else $(`[data-product-id="${id}"] [data-action="edit"]`)?.focus();
    });
    $('#product-list')?.addEventListener('change', event => {
      if (event.target.dataset.action !== 'toggle') return;
      const card = event.target.closest('[data-product-id]');
      const product = state.products.find(item => item.id === card?.dataset.productId);
      if (!product) return;
      product.enabled = event.target.checked;
      card.classList.toggle('is-disabled', !product.enabled);
      changed();
    });
    $('#product-close')?.addEventListener('click', () => closeDialog('#product-dialog'));
    $('#product-interest')?.addEventListener('click', () => openQuote(detailProductId || ''));

    $('#contact-links-list')?.addEventListener('input', event => {
      const key = event.target.dataset.linkField;
      if (!['title', 'url'].includes(key)) return;
      const card = event.target.closest('[data-contact-id]');
      const link = state.links.find(item => item.id === card?.dataset.contactId);
      if (!link) return;
      link[key] = event.target.value;
      changed();
    });
    $('#contact-links-list')?.addEventListener('change', event => {
      if (event.target.dataset.action !== 'toggle') return;
      const card = event.target.closest('[data-contact-id]');
      const link = state.links.find(item => item.id === card?.dataset.contactId);
      if (!link) return;
      link.enabled = event.target.checked;
      card.classList.toggle('is-disabled', !link.enabled);
      changed();
    });
    $('#contact-links-list')?.addEventListener('click', event => {
      const button = event.target.closest('button[data-action="delete"]');
      const card = button?.closest('[data-contact-id]');
      const index = state.links.findIndex(link => link.id === card?.dataset.contactId);
      if (!button || index < 0) return;
      state.links.splice(index, 1);
      renderEditorLinks();
      changed();
      toast('Canal removido da página.');
    });
    $('#add-contact-link')?.addEventListener('click', () => {
      if (state.links.length >= 20) { toast('Você pode adicionar até 20 canais.'); return; }
      $('#contact-link-form')?.reset();
      $('#contact-url')?.setCustomValidity('');
      if ($('#contact-title')) $('#contact-title').value = platformNames[$('#contact-platform')?.value] || '';
      openDialog('#contact-link-dialog');
    });
    $('#contact-platform')?.addEventListener('change', event => { if ($('#contact-title')) $('#contact-title').value = platformNames[event.target.value] || ''; });
    $('#contact-url')?.addEventListener('input', event => event.target.setCustomValidity(''));
    $('#contact-link-cancel')?.addEventListener('click', () => openEditor('links'));
    $('#contact-link-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const title = $('#contact-title')?.value.trim();
      const rawUrl = $('#contact-url')?.value.trim() || '';
      if (!title) { $('#contact-title')?.focus(); toast('Preencha o nome do canal.'); return; }
      if (rawUrl && !safeUrl(rawUrl)) { $('#contact-url')?.setCustomValidity('Use um endereço com https://, http://, mailto: ou tel:.'); $('#contact-url')?.reportValidity(); return; }
      const platform = Object.hasOwn(platformNames, $('#contact-platform')?.value) ? $('#contact-platform').value : 'custom';
      state.links.push({ id: uid(), platform, title: title.slice(0, 60), url: safeUrl(rawUrl), enabled: true });
      changed();
      openEditor('links');
      toast('Canal adicionado.');
    });

    $('#quote-close')?.addEventListener('click', () => closeDialog('#quote-dialog'));
    $('#quote-form')?.addEventListener('submit', event => {
      event.preventDefault();
      if (!event.target.reportValidity()) return;
      const name = $('#quote-name')?.value.trim() || '';
      const email = $('#quote-email')?.value.trim() || '';
      if (!name) { $('#quote-name')?.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#quote-email')?.focus(); toast('Informe um e-mail válido para contato.'); return; }
      const product = state.products.find(item => item.enabled && item.id === $('#quote-product')?.value);
      const message = $('#quote-message')?.value.trim() || '';
      preparedQuote = `Olá, equipe ${state.name || 'LocyTech'}! Gostaria de solicitar um orçamento.\n\nSolução: ${product?.title || 'Quero orientação para o meu projeto'}\nNome: ${name}\nE-mail: ${email}${message ? `\n\nSobre o meu projeto:\n${message}` : ''}`;
      if ($('#quote-result')) { $('#quote-result').textContent = preparedQuote; if ($('#quote-result').tagName === 'TEXTAREA') $('#quote-result').value = preparedQuote; }
      if ($('#quote-result-note')) $('#quote-result-note').textContent = 'Sua solicitação está pronta para copiar. Nenhuma mensagem foi enviada.';
      if ($('#quote-title')) $('#quote-title').textContent = 'Sua solicitação está pronta.';
      setQuoteDestinations();
      quoteResultVisible(true);
      $('#copy-quote')?.focus();
    });
    $('#copy-quote')?.addEventListener('click', () => { if (preparedQuote) copyText(preparedQuote, 'Solicitação copiada!'); });
    $('#quote-reset')?.addEventListener('click', () => { quoteResultVisible(false); if ($('#quote-title')) $('#quote-title').textContent = 'Conte sobre o seu projeto.'; $('#quote-name')?.focus(); });
    $$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    }));
  }

  function initialize() {
    const publicIntent = location.hash.startsWith('#p=');
    if (publicIntent) {
      publicMode = true;
      try { state = decodeSnapshot(location.hash.slice(3)); }
      catch {
        state = clone(defaults);
        publicLoadError = 'Não foi possível carregar esta versão. Confira se o link foi copiado por completo. Abaixo está o catálogo de demonstração.';
        toast('Não foi possível abrir esta versão. Confira se o link foi copiado por completo.');
      }
    }
    if (!publicMode) {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (saved?.state) { state = normalize(saved.state); savedAt = typeof saved.savedAt === 'string' ? saved.savedAt : null; }
      } catch { /* Editing is available even when storage is disabled. */ }
    }
    if ($('#owner-tools')) $('#owner-tools').hidden = publicMode;
    document.body.classList.toggle('shared-page', publicMode);
    renderPage();
    syncBrandFields();
    renderEditorProducts();
    renderEditorLinks();
    setStatus();
    selectEditorTab('brand');
    bindEvents();
  }

  window.LocyCatalog = Object.freeze({ getState: () => clone(state), shareUrl, render: () => { renderPage(); syncBrandFields(); renderEditorProducts(); renderEditorLinks(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
