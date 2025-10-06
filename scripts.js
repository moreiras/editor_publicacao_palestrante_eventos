(function () {
  'use strict';

  const { THEME, TEXT_TEMPLATE } = window;
  if (!THEME || !TEXT_TEMPLATE) {
    throw new Error('Tema ou template de texto não definidos. Verifique theme.js.');
  }

  const layout = THEME.layout || {};
  const photoLayout = layout.photo || {};
  const textLayout = layout.text || {};
  const typography = THEME.typography || {};
  const fontFamily = typography.family || 'InterVar, system-ui, sans-serif';
  const fontSizes = {
    eventName: typography.sizes?.eventName ?? 36,
    name: typography.sizes?.name ?? 58,
    role: typography.sizes?.role ?? 30,
    company: typography.sizes?.company ?? 28,
    talkTitle: typography.sizes?.talkTitle ?? 32,
    info: typography.sizes?.info ?? 26,
    social: typography.sizes?.social ?? 24
  };

  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
  const canvas = document.getElementById('preview');
  const ctx = canvas.getContext('2d');

  const inpNome = document.getElementById('inpNome');
  const inpCargo = document.getElementById('inpCargo');
  const inpEmpresa = document.getElementById('inpEmpresa');
  const inpTitulo = document.getElementById('inpTitulo');
  const inpData = document.getElementById('inpData');
  const inpHorario = document.getElementById('inpHorario');
  const inpSocial = document.getElementById('inpSocial');

  const inpFoto = document.getElementById('inpFoto');
  const cropImg = document.getElementById('cropImg');

  const rangeBrilho = document.getElementById('rangeBrilho');
  const rangeContraste = document.getElementById('rangeContraste');
  const rangeSaturacao = document.getElementById('rangeSaturacao');
  const rangeHue = document.getElementById('rangeHue');

  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnRotate = document.getElementById('btnRotate');
  const btnReset = document.getElementById('btnReset');

  const btnExport = document.getElementById('btnExport');
  const btnShare = document.getElementById('btnShare');

  const outTexto = document.getElementById('outTexto');

  let cropper = null;

  function setFont(weight, sizePx) {
    ctx.font = `${weight} ${Math.round(sizePx * dpr)}px ${fontFamily}`;
  }

  function fitFont(basePx, text, maxWidth, weight = 800, minPx = 28) {
    let size = basePx;
    setFont(weight, size);
    while (ctx.measureText(text).width > maxWidth && size > minPx) {
      size -= 2;
      setFont(weight, size);
    }
    return size;
  }

  function wrapText(ctxInstance, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = (text || '').split(/\s+/);
    let line = '';
    let lines = 0;
    for (let n = 0; n < words.length; n += 1) {
      const testLine = line + words[n] + ' ';
      if (ctxInstance.measureText(testLine).width > maxWidth && n > 0) {
        ctxInstance.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
        lines += 1;
        if (lines >= maxLines - 1) break;
      } else {
        line = testLine;
      }
    }
    ctxInstance.fillText(line.trim(), x, y);
    return y + lineHeight;
  }

  const lh = (px) => Math.round(px * 1.35 * dpr);

  function cssFilters() {
    const brilho = Number(rangeBrilho.value) || 100;
    const contraste = Number(rangeContraste.value) || 100;
    const saturacao = Number(rangeSaturacao.value) || 100;
    const hue = Number(rangeHue.value) || 0;
    return `brightness(${brilho}%) contrast(${contraste}%) saturate(${saturacao}%) hue-rotate(${hue}deg)`;
  }

  function drawSquareWithFilters(img, sizePx, filters) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sizePx;
    tempCanvas.height = sizePx;
    const g = tempCanvas.getContext('2d');
    g.imageSmoothingQuality = 'high';
    if (filters) g.filter = filters;

    const imageRatio = img.width / img.height;
    let sx;
    let sy;
    let sw;
    let sh;

    if (imageRatio > 1) {
      sh = img.height;
      sw = sh;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    g.drawImage(img, sx, sy, sw, sh, 0, 0, sizePx, sizePx);
    return tempCanvas;
  }

  async function loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }

  function renderTemplate(tpl, data) {
    return tpl
      .replace(/{{evento}}/g, data.evento || '')
      .replace(/{{palestra}}/g, data.palestra || '')
      .replace(/{{data}}/g, data.data || '')
      .replace(/{{horário}}/g, data.horario || '')
      .replace(/{{site}}/g, data.site || '')
      .replace(/{{hashtags}}/g, data.hashtags || '');
  }

  function atualizarTexto() {
    const payload = {
      evento: THEME.name,
      palestra: (inpTitulo.value || '').trim(),
      data: (inpData.value || '').trim(),
      horario: (inpHorario.value || '').trim(),
      site: THEME.site,
      hashtags: THEME.hashtags
    };
    outTexto.value = renderTemplate(TEXT_TEMPLATE, payload);
  }

  function getFormatPx() {
    return { w: 1080, h: 1350 };
  }

  let cachedBgUrl = null;
  let cachedBgImage = null;

  async function getBackgroundImage(url) {
    if (!url) return null;
    if (cachedBgImage && cachedBgUrl === url) {
      return cachedBgImage;
    }
    try {
      const image = await loadImage(url);
      cachedBgImage = image;
      cachedBgUrl = url;
      return image;
    } catch (error) {
      console.warn('Não foi possível carregar a imagem de fundo definida no tema.', error);
      cachedBgImage = null;
      cachedBgUrl = null;
      return null;
    }
  }

  async function redraw() {
    const { w, h } = getFormatPx();
    const W = Math.round(w * dpr);
    const H = Math.round(h * dpr);
    canvas.width = W;
    canvas.height = H;

    const maxPreview = Math.min(window.innerWidth * 0.38, 420);
    const uiScale = Math.min(1, maxPreview / w);
    canvas.style.width = `${w * uiScale}px`;
    canvas.style.height = `${h * uiScale}px`;

    ctx.clearRect(0, 0, W, H);

    let backgroundDrawn = false;
    if (THEME.bgUrl) {
      const bg = await getBackgroundImage(THEME.bgUrl);
      if (bg) {
        const scale = Math.max(W / bg.width, H / bg.height);
        const bw = bg.width * scale;
        const bh = bg.height * scale;
        ctx.drawImage(bg, (W - bw) / 2, (H - bh) / 2, bw, bh);
        backgroundDrawn = true;
      }
    }

    if (!backgroundDrawn) {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, THEME.accent);
      grad.addColorStop(1, THEME.accent2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, W, H);

    const textColor = THEME.textOnDark || '#fff';
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    const pad = Math.round(48 * dpr);

    const colGap = Math.round(40 * dpr);
    const photoSize = photoLayout.size != null
      ? Math.round(photoLayout.size * dpr)
      : Math.round(W * 0.34);
    const photoX = photoLayout.x != null
      ? Math.round(photoLayout.x * dpr)
      : W - pad - photoSize;
    const photoY = photoLayout.y != null
      ? Math.round(photoLayout.y * dpr)
      : Math.round(H * 0.24);

    const textX = textLayout.x != null ? Math.round(textLayout.x * dpr) : pad;
    const eventNameY = textLayout.y != null
      ? Math.round(textLayout.y * dpr)
      : pad + Math.round(12 * dpr);
    const textW = textLayout.width != null
      ? Math.round(textLayout.width * dpr)
      : W - pad * 2 - (photoSize + colGap);
    const gapAfterEvent = textLayout.gapAfterEvent != null
      ? Math.round(textLayout.gapAfterEvent * dpr)
      : Math.round(42 * dpr);

    setFont(800, fontSizes.eventName);
    ctx.fillText(THEME.name, textX, eventNameY);

    const nome = (inpNome.value || '').trim() || 'José da Silva';
    const cargo = (inpCargo.value || '').trim() || '';
    const empresa = (inpEmpresa.value || '').trim() || '';
    const titulo = (inpTitulo.value || '').trim() || '';
    const info = [
      (inpData.value || '').trim(),
      (inpHorario.value || '').trim()
    ].filter(Boolean).join(' • ');
    const social = (inpSocial.value || '').trim();

    let y = eventNameY + gapAfterEvent;

    const nomeSize = fitFont(fontSizes.name, nome, textW, 800, 30);
    setFont(800, nomeSize);
    y = wrapText(ctx, nome, textX, y, textW, lh(nomeSize), 2);

    if (cargo) {
      const size = fontSizes.role;
      setFont(600, size);
      y = wrapText(ctx, cargo, textX, y, textW, lh(size), 2);
    }

    if (empresa) {
      const size = fontSizes.company;
      setFont(500, size);
      y = wrapText(ctx, empresa, textX, y, textW, lh(size), 2);
    }

    if (titulo) {
      const size = fontSizes.talkTitle;
      setFont(700, size);
      y = wrapText(ctx, `“${titulo}”`, textX, y, textW, lh(size), 3);
    }

    if (info) {
      const size = fontSizes.info;
      setFont(600, size);
      y = wrapText(ctx, info, textX, y, textW, lh(size), 1);
    }

    if (social) {
      const size = fontSizes.social;
      y += Math.round(16 * dpr);
      setFont(600, size);
      y = wrapText(ctx, social, textX, y, textW, lh(size), 2);
    }

    if (cropper) {
      const cropped = cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' });
      if (cropped) {
        const filteredCanvas = drawSquareWithFilters(cropped, photoSize, cssFilters());
        const margin = Math.round(22 * dpr);
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'rgba(0,0,0,0.30)';
        ctx.fillRect(photoX - margin / 2, photoY - margin / 2, photoSize + margin, photoSize + margin);
        ctx.restore();

        const radius = Math.round(24 * dpr);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(photoX + radius, photoY);
        ctx.arcTo(photoX + photoSize, photoY, photoX + photoSize, photoY + photoSize, radius);
        ctx.arcTo(photoX + photoSize, photoY + photoSize, photoX, photoY + photoSize, radius);
        ctx.arcTo(photoX, photoY + photoSize, photoX, photoY, radius);
        ctx.arcTo(photoX, photoY, photoX + photoSize, photoY, radius);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(filteredCanvas, photoX, photoY, photoSize, photoSize);
        ctx.restore();
      }
    }

  }

  function throttle(fn, limit = 33) {
    let ticking = false;
    let lastArgs = null;
    return function throttled(...args) {
      lastArgs = args;
      if (!ticking) {
        fn.apply(null, lastArgs);
        ticking = true;
        setTimeout(() => {
          ticking = false;
          if (lastArgs) {
            fn.apply(null, lastArgs);
            lastArgs = null;
          }
        }, limit);
      }
    };
  }

  const requestRedraw = throttle(() => {
    redraw();
  }, 33);

  inpFoto.addEventListener('change', (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    cropImg.src = url;
    cropImg.onload = () => {
      if (cropper) cropper.destroy();
      cropper = new Cropper(cropImg, {
        viewMode: 1,
        aspectRatio: 1,
        dragMode: 'move',
        background: false,
        autoCropArea: 0.95,
        ready() {
          requestRedraw();
        },
        crop() {
          requestRedraw();
        },
        cropend() {
          requestRedraw();
        }
      });
    };
  });

  [rangeBrilho, rangeContraste, rangeSaturacao, rangeHue].forEach((el) => {
    el.addEventListener('input', requestRedraw);
  });

  btnZoomIn.addEventListener('click', () => {
    cropper?.zoom(0.1);
    requestRedraw();
  });
  btnZoomOut.addEventListener('click', () => {
    cropper?.zoom(-0.1);
    requestRedraw();
  });
  btnRotate.addEventListener('click', () => {
    cropper?.rotate(90);
    requestRedraw();
  });
  btnReset.addEventListener('click', () => {
    rangeBrilho.value = 100;
    rangeContraste.value = 100;
    rangeSaturacao.value = 100;
    rangeHue.value = 0;
    cropper?.reset();
    requestRedraw();
  });

  [inpNome, inpCargo, inpEmpresa, inpTitulo, inpData, inpHorario, inpSocial].forEach((el) => {
    el.addEventListener('input', () => {
      atualizarTexto();
      requestRedraw();
    });
    el.addEventListener('change', () => {
      atualizarTexto();
      requestRedraw();
    });
  });

  function canvasToBlob(c) {
    return new Promise((resolve) => c.toBlob(resolve, 'image/png', 0.98));
  }

  btnExport.addEventListener('click', async () => {
    const blob = await canvasToBlob(canvas);
    const nome = (inpNome.value || 'palestrante').trim().replace(/\s+/g, '-');
    const fileName = `post-${THEME.name.replace(/\s+/g, '-')}-${nome}.png`;
    if (window.saveAs) {
      window.saveAs(blob, fileName);
    } else {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    }
  });

  btnShare.addEventListener('click', async () => {
    try {
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], 'post.png', { type: 'image/png' });
      const text = outTexto.value;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text });
      } else if (navigator.share) {
        await navigator.share({ text });
        alert('Seu navegador não compartilha imagem direto. Use “Baixar imagem”.');
      } else {
        alert('Web Share API não suportada. Use “Baixar imagem”.');
      }
    } catch (error) {
      console.error('Não foi possível compartilhar a imagem.', error);
      alert('Não foi possível compartilhar. Baixe a imagem e poste manualmente.');
    }
  });

  atualizarTexto();
  redraw();
})();
