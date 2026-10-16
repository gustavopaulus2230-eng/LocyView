import React, { useEffect } from 'react';
import '../styles/mobilePreview.css';

export default function MobilePreview() {
  const siteUrl = new URL(window.location.href);
  siteUrl.searchParams.delete('preview');

  useEffect(() => {
    document.title = 'Prévia para celular · LocyTech';
  }, []);

  return <main className="mobile-preview">
    <header className="mobile-preview-heading">
      <div><p className="mobile-preview-eyebrow">LOCYTECH</p><h1>Prévia para celular</h1><p>Navegue e role o site dentro da tela abaixo.</p></div>
      <a className="mobile-preview-normal" href={siteUrl.href}>Abrir site normal</a>
    </header>
    <div className="mobile-preview-device">
      <iframe className="mobile-preview-screen" title="Site LocyTech em tamanho de celular" src={siteUrl.href} />
    </div>
  </main>;
}
