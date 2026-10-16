import React, { useEffect, useRef, useState } from 'react';
import { contrastText } from '../utils/pageState';

// A marca é desenhada a partir do arquivo original; nenhuma imagem da referência é colada à interface.
export default function BrandAtmosphere({ logo = './assets/locytech.png', name = 'LocyTech', primaryColor = '#4d8dff', accentColor = '#f4cf46', backgroundColor = '#080f20' }) {
  const canvasRef = useRef(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) { setAvailable(false); return undefined; }
    let disposed = false;
    let frame;
    let width = 0;
    let height = 0;
    let points = [];
    let imageData;
    let symbolOnly = logo === './assets/locytech.png' || logo === '/assets/locytech.png';
    let lastFrame = 0;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: -1000, y: -1000 };
    const stars = Array.from({ length: 190 }, (_, index) => ({
      x: ((index * 0.61803398875) % 1),
      y: ((index * 0.41421356237 + 0.13) % 1),
      r: index % 9 === 0 ? 1.1 : index % 3 === 0 ? 0.7 : 0.4,
      a: 0.25 + (index % 7) / 11
    }));

    function seedPoints() {
      points = [];
      if (!imageData || !width || !height) return;
      const mobile = height < 500;
      const drawWidth = Math.min(width * (mobile ? 0.57 : 0.56), mobile ? height * 0.63 : 470, height * 0.38 * imageData.width / imageData.height);
      const drawHeight = drawWidth * imageData.height / imageData.width;
      const left = (width - drawWidth) / 2;
      const top = height * (mobile ? 0.18 : 0.25);
      const step = mobile ? 2.6 : 2.9;
      for (let y = 0; y < drawHeight; y += step) {
        for (let x = 0; x < drawWidth; x += step) {
          const sx = Math.min(imageData.width - 1, Math.floor(x / drawWidth * imageData.width));
          const sy = Math.min(imageData.height - 1, Math.floor(y / drawHeight * imageData.height));
          const index = (sy * imageData.width + sx) * 4;
          const [red, green, blue, alpha] = imageData.data.slice(index, index + 4);
          const saturation = Math.max(red, green, blue) - Math.min(red, green, blue);
          if (alpha < 80 || (symbolOnly && (saturation < 45 || (red > 225 && green > 225 && blue > 225)))) continue;
          points.push({ x: left + x, y: top + y, color: symbolOnly ? (blue > red ? primaryColor : accentColor) : `rgb(${red},${green},${blue})`, radius: 0.48 + ((sx * 7 + sy * 13) % 10) / 21, phase: (sx + sy) / 15 });
        }
      }
    }

    function draw(timestamp = 0) {
      if (disposed) return;
      if (timestamp - lastFrame < 40 && !motion.matches) { frame = requestAnimationFrame(draw); return; }
      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = 'rgba(91, 131, 193, 0.045)';
      context.lineWidth = 1;
      const grid = width < 600 ? 38 : 52;
      for (let x = 0; x < width; x += grid) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y < height; y += grid) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      for (const star of stars) {
        context.globalAlpha = star.a * (motion.matches ? 0.8 : 0.77 + Math.sin(timestamp * 0.00035 + star.x * 21) * 0.18);
        context.fillStyle = contrastText(backgroundColor) === '#ffffff' ? '#d8e5ff' : '#314867';
        context.beginPath(); context.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1;
      for (const point of points) {
        let offsetX = 0;
        let offsetY = 0;
        if (!motion.matches) {
          const dx = point.x - pointer.x;
          const dy = point.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const force = Math.max(0, 1 - distance / 90) * 7;
          offsetX = Math.sin(timestamp * 0.00065 + point.phase) * 0.65 + (distance ? dx / distance * force : 0);
          offsetY = Math.cos(timestamp * 0.00055 + point.phase) * 0.65 + (distance ? dy / distance * force : 0);
        }
        context.fillStyle = point.color;
        context.beginPath(); context.arc(point.x + offsetX, point.y + offsetY, point.radius, 0, Math.PI * 2); context.fill();
      }
      if (imageData) {
        const mobile = height < 500;
        const symbolWidth = Math.min(width * (mobile ? 0.57 : 0.56), mobile ? height * 0.63 : 470, height * 0.38 * imageData.width / imageData.height);
        const symbolHeight = symbolWidth * imageData.height / imageData.width;
        const y = height * (mobile ? 0.18 : 0.25) + symbolHeight + (mobile ? 26 : 52);
        const titleSize = Math.min(width * 0.071, mobile ? 29 : 64);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = `800 ${titleSize}px Manrope, sans-serif`;
        context.fillStyle = primaryColor;
        context.fillText(symbolOnly ? 'MONITOR' : name, width / 2, y);
        if (symbolOnly) {
          context.font = `700 ${titleSize * 0.61}px Manrope, sans-serif`;
          context.fillStyle = accentColor;
          const word = 'L O C Y T E C H';
          context.fillText(word, width / 2, y + titleSize * 0.97);
        }
      }
      if (!motion.matches) frame = requestAnimationFrame(draw);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedPoints();
      if (motion.matches) draw();
    }

    const source = new Image();
    source.onload = () => {
      if (disposed) return;
      try {
        const sample = document.createElement('canvas');
        const scale = Math.min(1, 400 / source.naturalWidth, 400 / source.naturalHeight);
        sample.width = symbolOnly ? 392 : Math.max(1, Math.round(source.naturalWidth * scale));
        sample.height = symbolOnly ? 250 : Math.max(1, Math.round(source.naturalHeight * scale));
        const sampleContext = sample.getContext('2d');
        if (symbolOnly) sampleContext.drawImage(source, 126, 110, 392, 250, 0, 0, 392, 250);
        else sampleContext.drawImage(source, 0, 0, sample.width, sample.height);
        imageData = sampleContext.getImageData(0, 0, sample.width, sample.height);
        setAvailable(true);
        seedPoints();
        if (motion.matches) draw();
      } catch { setAvailable(false); }
    };
    source.onerror = () => { if (!disposed) setAvailable(false); };
    if (logo) source.src = logo;
    else setAvailable(false);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const move = event => { const rect = canvas.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top; };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    const motionChange = () => { cancelAnimationFrame(frame); draw(); };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    motion.addEventListener('change', motionChange);
    resize();
    draw();
    document.fonts.ready.then(() => { if (!disposed && motion.matches) draw(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      motion.removeEventListener('change', motionChange);
    };
  }, [logo, name, primaryColor, accentColor, backgroundColor]);

  return <section className="hub-brand" aria-label={`Identidade ${name}`}>
    <div className="brand-topline"><span className="brand-topline-dot" /> MONITOR <span>LOCYTECH</span></div>
    <canvas ref={canvasRef} className="brand-canvas" aria-hidden="true" />
    {!available && <div className="brand-fallback"><span className="brand-monogram">{name.slice(0, 2).toUpperCase()}</span><strong>{name}</strong></div>}
    <div className="brand-caption"><p>Sites, landing pages e conexões.</p><span>Da primeira visita ao próximo projeto.</span></div>
  </section>;
}
