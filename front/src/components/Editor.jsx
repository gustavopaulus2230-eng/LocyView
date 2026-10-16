import React, { useRef, useState } from 'react';
import Icon from './Icon';
import Modal from './Modal';
import { categoryName, cleanSlug, MAX_LOGO_BYTES, optimizeLogo, PRODUCT_ICONS, safeLogo, uid } from '../utils/pageState';

const editorTabs = [['brand', 'Identidade'], ['products', 'Produtos'], ['links', 'Links e contatos']];

function ActionButton({ label, icon, disabled, onClick }) {
  return <button type="button" className="icon-button" title={label} aria-label={label} disabled={disabled} onClick={onClick}><Icon name={icon} size={17} /></button>;
}

export default function Editor({ state, activeTab, onTab, onChange, onClose, onSave, onShare, onEditProduct, onProductAction, status, toast }) {
  const tabsRef = useRef({});
  const logoVersion = useRef(0);
  const logoInput = useRef(null);
  const [uploading, setUploading] = useState(false);

  function handleTabKey(event, current) {
    const index = editorTabs.findIndex(([key]) => key === current);
    const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
    if (next < 0) return;
    event.preventDefault();
    const tab = editorTabs[next][0];
    onTab(tab);
    tabsRef.current[tab]?.focus();
  }

  function uploadLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const version = ++logoVersion.current;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { event.target.value = ''; toast('Escolha uma imagem PNG, JPG ou WebP.'); return; }
    if (file.size > MAX_LOGO_BYTES) { event.target.value = ''; toast('Escolha uma imagem de até 1,5 MB.'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const source = safeLogo(reader.result);
        if (!source) throw new Error('Arquivo inválido');
        const optimized = await optimizeLogo(source);
        if (version !== logoVersion.current) return;
        onChange({ logo: optimized });
        toast('Logo atualizada.');
      } catch {
        if (version !== logoVersion.current) return;
        if (logoInput.current) logoInput.current.value = '';
        toast('Não foi possível abrir essa imagem. Tente outro arquivo.');
      } finally { if (version === logoVersion.current) setUploading(false); }
    };
    reader.onerror = () => { if (version === logoVersion.current) { setUploading(false); toast('Não foi possível ler a imagem.'); } };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    logoVersion.current += 1;
    setUploading(false);
    if (logoInput.current) logoInput.current.value = '';
    onChange({ logo: '' });
  }

  return <Modal id="editor-dialog" className="editor-drawer" labelledBy="editor-heading" onClose={onClose}>
    <header className="drawer-header"><div><span className="drawer-eyebrow">LOCYTECH</span><h2 id="editor-heading">Personalizar página<span>.</span></h2><p>Edite a marca, os produtos e os links.</p></div><button type="button" id="editor-close" className="icon-button" aria-label="Fechar personalização" onClick={onClose}><Icon name="close" /></button></header>
    <div className="drawer-tabs" role="tablist" aria-label="Personalização">{editorTabs.map(([key, label]) => <button type="button" key={key} ref={element => { tabsRef.current[key] = element; }} role="tab" id={`editor-tab-${key}`} data-editor-tab={key} className={activeTab === key ? 'active is-active' : ''} aria-selected={activeTab === key} aria-controls={`editor-panel-${key}`} tabIndex={activeTab === key ? 0 : -1} onClick={() => onTab(key)} onKeyDown={event => handleTabKey(event, key)}>{label}</button>)}</div>
    <div className="drawer-body">
      <section id="editor-panel-brand" role="tabpanel" aria-labelledby="editor-tab-brand" hidden={activeTab !== 'brand'}>
        <div className="editor-section-heading"><h3>Identidade da marca</h3><p>As alterações aparecem na prévia da página.</p></div>
        <span className="field-label">Logo da marca</span><div className="logo-upload">{state.logo ? <img id="logo-preview" src={state.logo} alt="Logo atual" /> : <span className="logo-placeholder"><Icon name="brand" size={32} /></span>}<div><label className={`button button-secondary button-small${uploading ? ' is-loading' : ''}`} htmlFor="brand-logo"><Icon name="upload" />{uploading ? 'Processando imagem…' : 'Alterar logo'}</label><button type="button" id="remove-logo" className="text-button" disabled={!state.logo && !uploading} onClick={removeLogo}>Remover</button><p>PNG, JPG ou WebP · até 1,5 MB</p></div><input ref={logoInput} id="brand-logo" className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Enviar logo" onChange={uploadLogo} disabled={uploading} /></div>
        <div className="field"><label htmlFor="brand-name">Nome da marca <span>*</span></label><input id="brand-name" value={state.name} maxLength={60} required placeholder="Nome da marca" onChange={event => onChange({ name: event.target.value })} /></div>
        <div className="field"><label htmlFor="brand-eyebrow">Texto acima do nome</label><input id="brand-eyebrow" value={state.eyebrow} maxLength={70} placeholder="Ex.: Canais e produtos" onChange={event => onChange({ eyebrow: event.target.value })} /></div>
        <div className="field"><label htmlFor="brand-description">Apresentação</label><textarea id="brand-description" rows={3} value={state.description} maxLength={240} placeholder="Descreva sua marca" onChange={event => onChange({ description: event.target.value })} /></div>
        <div className="field"><label htmlFor="page-slug">Identificador da página</label><div className="input-prefix"><span>/</span><input id="page-slug" value={state.slug} maxLength={50} placeholder="sua-marca" onChange={event => onChange({ slug: event.target.value })} onBlur={event => { const slug = cleanSlug(event.target.value); if (slug !== state.slug) onChange({ slug }); }} /></div><small>Use letras, números e hífens. O identificador não cria uma rota nesta demonstração.</small></div>
        <div className="editor-divider" /><div className="editor-section-heading"><h3>Cores da página</h3><p>Escolha as cores principal, de destaque e de fundo.</p></div>
        <div className="color-grid">{[['primaryColor', 'primary-color', 'Principal', 'Botões e detalhes'], ['accentColor', 'accent-color', 'Destaque', 'Produtos e marca'], ['backgroundColor', 'background-color', 'Fundo', 'Fundo da página']].map(([key, id, label, hint]) => <label key={key} htmlFor={id} className="color-option"><input id={id} type="color" value={state[key]} onChange={event => onChange({ [key]: event.target.value })} /><strong>{label}</strong><small>{hint}</small></label>)}</div>
        <label className="checkbox-field"><input id="brand-footer-checkbox" type="checkbox" checked={state.showBrand} onChange={event => onChange({ showBrand: event.target.checked })} /><span>Mostrar assinatura LocyTech no rodapé</span></label>
      </section>
      <section id="editor-panel-products" role="tabpanel" aria-labelledby="editor-tab-products" hidden={activeTab !== 'products'}>
        <div className="editor-section-heading"><h3>Produtos do catálogo</h3><p>Cadastre landing pages, sites e produtos digitais.</p></div>
        <div id="product-list" className="editor-product-list">{state.products.map((product, index) => <article key={product.id} className={`editor-product${product.enabled ? '' : ' is-disabled'}`} data-product-id={product.id}>
          <div className="editor-product-head"><div className="editor-product-name"><Icon name={product.icon} className="editor-product-icon" size={20} /><strong>{product.title}</strong><small>{categoryName(product.category)}</small></div><div className="editor-product-actions"><ActionButton label={`Editar ${product.title}`} icon="edit" onClick={() => onEditProduct(product.id)} /><ActionButton label={`Mover ${product.title} para cima`} icon="up" disabled={index === 0} onClick={() => onProductAction('up', product.id)} /><ActionButton label={`Mover ${product.title} para baixo`} icon="down" disabled={index === state.products.length - 1} onClick={() => onProductAction('down', product.id)} /><ActionButton label={`Excluir ${product.title}`} icon="trash" onClick={() => onProductAction('delete', product.id)} /><label className="switch"><input type="checkbox" aria-label={`Mostrar ${product.title}`} checked={product.enabled} onChange={() => onProductAction('toggle', product.id)} /><span className="switch-track" /></label></div></div><p className="editor-product-description">{product.description}</p><span className="editor-product-price">{product.price}</span>
        </article>)}{!state.products.length && <p className="editor-empty">Nenhum produto cadastrado.</p>}</div>
        <button type="button" id="add-product" className="add-button" onClick={() => onEditProduct(null)} disabled={state.products.length >= 30}><Icon name="plus" />Adicionar produto</button><p className="editor-hint">Use as setas para ordenar. Desative um produto para ocultá-lo. Limite de 30 produtos.</p>
      </section>
      <section id="editor-panel-links" role="tabpanel" aria-labelledby="editor-tab-links" hidden={activeTab !== 'links'}>
        <div className="editor-section-heading"><h3>Links dos canais</h3><p>Configure Instagram, WhatsApp e LinkedIn. Nossos produtos abre o catálogo.</p></div>
        <div className="editor-note"><Icon name="info" /><span>Os links iniciais são exemplos. Substitua pelos perfis da empresa e pelo link de atendimento do WhatsApp.</span></div>
        <div id="contact-links-list" className="editor-contact-list">{state.links.map(link => <article key={link.id} className="editor-contact" data-contact-id={link.id}><div className="editor-contact-head"><div className="editor-contact-title"><Icon name={link.platform} size={20} /><strong>{link.title}</strong></div></div><div className="editor-contact-fields"><div className="field"><label htmlFor={`contact-${link.id}-url`}>Link de destino</label><input id={`contact-${link.id}-url`} type="text" inputMode="url" value={link.url} maxLength={2048} placeholder="https://..." onChange={event => onChange({ links: state.links.map(item => item.id === link.id ? { ...item, url: event.target.value } : item) })} /></div></div></article>)}</div>
      </section>
      <div className="drawer-demo-note"><Icon name="info" /><p>Demonstração apenas de front-end. O rascunho é salvo neste navegador. O cadastro centralizado depende da integração com a LocyTech.</p></div>
    </div>
    <footer className="drawer-footer"><span id="editor-status" role="status">{status}</span><div><button type="button" id="save-page" className="button button-secondary" onClick={onSave}>Salvar rascunho</button><button type="button" id="publish-page" className="button button-primary" onClick={onShare}>Gerar link<Icon name="arrow" /></button></div></footer>
  </Modal>;
}

export function ProductEditor({ product, onClose, onSave }) {
  const [draft, setDraft] = useState(() => product ? { ...product, features: product.features.join('\n') } : { title: '', description: '', category: 'landing', note: '', price: 'Sob consulta', icon: 'window', features: '' });
  const update = event => setDraft(previous => ({ ...previous, [event.target.name]: event.target.value }));
  function submit(event) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onSave({ id: product?.id || uid(), title: draft.title.trim().slice(0, 70), description: draft.description.trim().slice(0, 240), category: draft.category === 'sites' ? 'sites' : 'landing', note: draft.note.trim().slice(0, 80), price: (draft.price.trim() || 'Sob consulta').slice(0, 40), icon: PRODUCT_ICONS.includes(draft.icon) ? draft.icon : 'window', features: draft.features.split(/\r?\n/).map(item => item.trim()).filter(Boolean).slice(0, 8).map(item => item.slice(0, 130)), enabled: product?.enabled !== false });
  }
  return <Modal id="product-edit-dialog" className="modal" labelledBy="product-edit-heading" onClose={onClose}><form id="product-edit-form" onSubmit={submit}>
    <div className="modal-topline"><span className="modal-eyebrow">CATÁLOGO DIGITAL</span><button type="button" className="icon-button" aria-label="Cancelar edição de produto" onClick={onClose}><Icon name="close" /></button></div><h2 id="product-edit-heading">{product ? 'Editar produto' : 'Adicionar produto'}</h2><p className="modal-description">Defina os dados que aparecem no catálogo.</p>
    <div className="field"><label htmlFor="product-title">Nome do produto <span>*</span></label><input autoFocus id="product-title" name="title" value={draft.title} onChange={update} required maxLength={70} placeholder="Ex.: Landing page" /></div>
    <div className="field"><label htmlFor="product-description">Descrição</label><textarea id="product-description" name="description" value={draft.description} onChange={update} rows={3} maxLength={240} placeholder="Descreva o produto" /></div>
    <div className="form-grid"><div className="field"><label htmlFor="product-category">Categoria</label><select id="product-category" name="category" value={draft.category} onChange={update}><option value="landing">Landing pages</option><option value="sites">Sites</option></select></div><div className="field"><label htmlFor="product-icon">Ícone</label><select id="product-icon" name="icon" value={draft.icon} onChange={update}><option value="window">Landing page</option><option value="globe">Site</option><option value="store">Loja virtual</option><option value="briefcase">Portfólio</option><option value="links">Página de links</option></select></div></div>
    <div className="form-grid"><div className="field"><label htmlFor="product-price">Valor ou condição</label><input id="product-price" name="price" value={draft.price} onChange={update} maxLength={40} placeholder="Ex.: R$ 790,00" /></div><div className="field"><label htmlFor="product-note">Texto complementar</label><input id="product-note" name="note" value={draft.note} onChange={update} maxLength={80} placeholder="Ex.: Campanhas e lançamentos" /></div></div>
    <div className="field"><label htmlFor="product-features">O que está incluído</label><textarea id="product-features" name="features" value={draft.features} onChange={update} rows={4} maxLength={1050} placeholder="Um item por linha" /><small>Até 8 itens. Eles aparecem nos detalhes do produto.</small></div>
    <div className="modal-actions"><button id="product-save" className="button button-primary" type="submit">Salvar produto<Icon name="check" /></button></div>
  </form></Modal>;
}
