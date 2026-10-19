import { cleanSlug, clone, defaults, normalize, safeUrl, shareUrl, socialDefaults, uid } from './pageState';

export const ADMIN_STORAGE_KEY = 'locyview-admin:v1';
const MAX_CLIENTS = 50;
const invalidStorageMessage = 'Os cadastros salvos neste navegador são inválidos. Nenhum dado foi substituído.';
const limitMessage = 'O limite de 50 páginas deste navegador foi atingido. Edite um cadastro existente.';
const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const trimmed = value => typeof value === 'string' ? value.trim() : '';

function blankPage() {
  return {
    ...clone(defaults),
    name: '',
    description: '',
    slug: '',
    logo: '',
    products: [],
    links: defaults.links.map(link => ({ ...link, url: '' }))
  };
}

export function createClientRecord() {
  return { id: uid(), clientName: '', page: blankPage(), updatedAt: null };
}

function cleanPage(source) {
  const page = normalize(source, { migrateDefaults: false });
  return {
    ...page,
    name: page.name.trim(),
    eyebrow: page.eyebrow.trim(),
    description: page.description.trim(),
    slug: cleanSlug(page.slug),
    products: page.products.map(product => ({
      ...product,
      title: product.title.trim(),
      description: product.description.trim(),
      note: product.note.trim(),
      price: product.price.trim(),
      features: product.features.map(feature => feature.trim()).filter(Boolean)
    })),
    links: page.links.map(link => ({ ...link, url: safeUrl(link.url) || link.url.trim() }))
  };
}

export function prepareClientRecord(record) {
  return {
    id: trimmed(record?.id).slice(0, 100) || uid(),
    clientName: trimmed(record?.clientName).slice(0, 120),
    page: cleanPage(record?.page),
    updatedAt: new Date().toISOString()
  };
}

export function validateClientRecord(record, records = []) {
  const identityError = (field, message) => ({ field, message, tab: 'identity' });
  if (!trimmed(record?.clientName)) return identityError('admin-client-name', 'Informe o nome do cliente.');
  if (!trimmed(record?.page?.name)) return identityError('admin-brand-name', 'Informe o nome da marca.');
  const slug = cleanSlug(trimmed(record?.page?.slug));
  if (!slug) return identityError('admin-page-slug', 'Informe um identificador com letras ou números.');
  if (records.some(item => item.id !== record.id && cleanSlug(trimmed(item.page?.slug)) === slug)) {
    return identityError('admin-page-slug', 'Este identificador já está sendo usado por outro cliente.');
  }
  if (records.length > MAX_CLIENTS || (records.length === MAX_CLIENTS && !records.some(item => item.id === record.id))) {
    return identityError('admin-client-name', limitMessage);
  }
  for (const social of socialDefaults) {
    const url = record?.page?.links?.find(link => link?.platform === social.platform)?.url;
    if (trimmed(url) && !safeUrl(url)) {
      return { field: `admin-contact-${social.platform}-url`, message: `Informe um link válido para ${social.title}, começando com https://, http://, mailto: ou tel:.`, tab: 'links' };
    }
  }
  return null;
}

function isStoredRecord(record) {
  if (!isObject(record) || !trimmed(record.id) || typeof record.clientName !== 'string' || !isObject(record.page)) return false;
  if (record.updatedAt !== null && (typeof record.updatedAt !== 'string' || !Number.isFinite(Date.parse(record.updatedAt)))) return false;
  const page = record.page;
  if (page.version !== 3 || typeof page.showBrand !== 'boolean') return false;
  if (!['name', 'eyebrow', 'description', 'slug', 'logo', 'primaryColor', 'accentColor', 'backgroundColor'].every(field => typeof page[field] === 'string')) return false;
  if (!Array.isArray(page.products) || page.products.length > 30 || !Array.isArray(page.links) || page.links.length !== socialDefaults.length) return false;
  if (!page.products.every(product => isObject(product) && ['id', 'icon', 'category', 'title', 'description', 'note', 'price'].every(field => typeof product[field] === 'string') && typeof product.enabled === 'boolean' && Array.isArray(product.features) && product.features.every(feature => typeof feature === 'string'))) return false;
  return socialDefaults.every(social => page.links.filter(link => isObject(link) && link.platform === social.platform && typeof link.url === 'string').length === 1);
}

function recordsAreValid(records) {
  if (!Array.isArray(records) || records.length > MAX_CLIENTS || !records.every(isStoredRecord)) return false;
  if (new Set(records.map(record => record.id)).size !== records.length) return false;
  return records.every(record => validateClientRecord(record, records) === null);
}

export function loadClientRecords() {
  let saved;
  try { saved = globalThis.localStorage.getItem(ADMIN_STORAGE_KEY); }
  catch { return { records: [], error: 'O armazenamento deste navegador está bloqueado. Não foi possível carregar os cadastros locais.' }; }
  if (saved === null) return { records: [{ id: 'locytech-example', clientName: 'LocyTech', page: clone(defaults), updatedAt: null }], error: '' };
  try {
    const parsed = JSON.parse(saved);
    if (!isObject(parsed) || parsed.version !== 1 || !recordsAreValid(parsed.records)) return { records: [], error: invalidStorageMessage };
    return {
      records: parsed.records.map(record => ({ id: record.id, clientName: record.clientName.trim(), page: cleanPage(record.page), updatedAt: record.updatedAt })),
      error: ''
    };
  } catch { return { records: [], error: invalidStorageMessage }; }
}

export function persistClientRecords(records) {
  if (Array.isArray(records) && records.length > MAX_CLIENTS) return { ok: false, error: limitMessage };
  if (!recordsAreValid(records)) return { ok: false, error: 'Revise os dados dos clientes antes de salvar. Nenhum cadastro foi substituído.' };
  try {
    const sanitizedRecords = records.map(record => ({ id: record.id, clientName: record.clientName.trim(), page: cleanPage(record.page), updatedAt: record.updatedAt }));
    globalThis.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ version: 1, records: sanitizedRecords }));
    return { ok: true, error: '' };
  } catch (error) {
    const quotaExceeded = error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED';
    return { ok: false, error: quotaExceeded ? 'O armazenamento deste navegador está cheio. Reduza as logos antes de tentar novamente.' : 'Não foi possível salvar neste navegador. Verifique se o armazenamento local está permitido e tente novamente.' };
  }
}

export function clientPreviewUrl(page, href = window.location.href) {
  const url = new URL(href);
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  return shareUrl(cleanPage(page), url.href);
}
