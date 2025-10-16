(function () {
  'use strict';

  /**
   * Busca um elemento pelo ID e lança um erro descritivo caso não exista.
   * Ajuda a detectar imediatamente mudanças no HTML que quebrem o JavaScript.
   * @param {string} id
   * @returns {HTMLElement}
   */
  function requireElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Elemento com id "${id}" não encontrado no DOM.`);
    }
    return element;
  }

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
    name: typography.sizes?.name ?? 58,
    role: typography.sizes?.role ?? 30,
    talkTitle: typography.sizes?.talkTitle ?? 32,
    info: typography.sizes?.info ?? 26,
    social: typography.sizes?.social ?? 24
  };

  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
  const canvas = requireElement('preview');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Contexto 2D não disponível. O navegador é incompatível com canvas.');
  }

  const inpNome = requireElement('inpNome');
  const inpCargo = requireElement('inpCargo');
  const inpEmpresa = requireElement('inpEmpresa');
  const inpTitulo = requireElement('inpTitulo');
  const inpData = requireElement('inpData');
  const inpHorario = requireElement('inpHorario');
  const inpSocial = requireElement('inpSocial');

  const inpFoto = requireElement('inpFoto');
  const cropImg = requireElement('cropImg');

  const rangeBrilho = requireElement('rangeBrilho');
  const rangeContraste = requireElement('rangeContraste');
  const rangeSaturacao = requireElement('rangeSaturacao');

  const btnZoomIn = requireElement('btnZoomIn');
  const btnZoomOut = requireElement('btnZoomOut');
  const btnRotate = requireElement('btnRotate');
  const btnReset = requireElement('btnReset');

  const btnExport = requireElement('btnExport');
  const btnShare = requireElement('btnShare');

  const outTexto = requireElement('outTexto');

  let cropper = null;

  /**
   * Configura o estilo da fonte no contexto do canvas de acordo com o peso e
   * o tamanho desejado, ajustando automaticamente para o devicePixelRatio.
   */
  function setFont(weight, sizePx) {
    ctx.font = `${weight} ${Math.round(sizePx * dpr)}px ${fontFamily}`;
  }

  /**
   * Faz a quebra manual de texto respeitando o limite de largura do canvas.
   * Retorna a coordenada Y da próxima linha disponível.
   */
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

  const lineSpacing = textLayout.linespace != null
    ? Math.round(textLayout.linespace * dpr)
    : 0;

  const lh = (px) => Math.round(px * 1.35 * dpr);

  const addTextGap = (value) => value + lineSpacing;

  /**
   * Lê o valor dos sliders de ajuste fotográfico garantindo número válido.
   */
  function readRangeValue(rangeEl, fallback = 100) {
    const value = Number.parseFloat(rangeEl?.value);
    return Number.isFinite(value) ? value : fallback;
  }

  /**
   * Constrói a string de filtros CSS aplicada às imagens do canvas.
   */
  function cssFilters() {
    const brilho = readRangeValue(rangeBrilho, 100);
    const contraste = readRangeValue(rangeContraste, 100);
    const saturacao = readRangeValue(rangeSaturacao, 100);
    return `brightness(${brilho}%) contrast(${contraste}%) saturate(${saturacao}%)`;
  }

  const canvasFilterSupported = (() => {
    const testCanvas = document.createElement('canvas');
    const testCtx = testCanvas.getContext('2d');
    return typeof testCtx?.filter === 'string';
  })();

  function parseFilterValue(filters, name, fallback) {
    const regex = new RegExp(`${name}\\(([^)]+)\\)`);
    const match = filters.match(regex);
    if (!match) return fallback;
    const numeric = Number.parseFloat(match[1]);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function applyManualFilters(canvasEl, filters) {
    if (!filters) return canvasEl;
    const brilho = parseFilterValue(filters, 'brightness', 100) / 100;
    const contraste = parseFilterValue(filters, 'contrast', 100) / 100;
    const saturacao = parseFilterValue(filters, 'saturate', 100) / 100;

    if (brilho === 1 && contraste === 1 && saturacao === 1) {
      return canvasEl;
    }

    const ctxManual = canvasEl.getContext('2d');
    if (!ctxManual) return canvasEl;

    const imageData = ctxManual.getImageData(0, 0, canvasEl.width, canvasEl.height);
    const { data } = imageData;
    const contrastFactor = contraste;
    const saturateFactor = saturacao;
    const rLum = 0.2126;
    const gLum = 0.7152;
    const bLum = 0.0722;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // brilho
      r *= brilho;
      g *= brilho;
      b *= brilho;

      // contraste
      r = (r - 128) * contrastFactor + 128;
      g = (g - 128) * contrastFactor + 128;
      b = (b - 128) * contrastFactor + 128;

      // saturação
      if (saturateFactor !== 1) {
        const lum = r * rLum + g * gLum + b * bLum;
        r = lum + (r - lum) * saturateFactor;
        g = lum + (g - lum) * saturateFactor;
        b = lum + (b - lum) * saturateFactor;
      }

      data[i] = Math.round(Math.max(0, Math.min(255, r)));
      data[i + 1] = Math.round(Math.max(0, Math.min(255, g)));
      data[i + 2] = Math.round(Math.max(0, Math.min(255, b)));
    }

    ctxManual.putImageData(imageData, 0, 0);
    return canvasEl;
  }

  /**
   * Recorta uma imagem quadrada temporária e aplica filtros para preservar a
   * qualidade antes de desenhá-la no canvas principal.
   */
  function drawSquareWithFilters(img, sizePx, filters) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sizePx;
    tempCanvas.height = sizePx;
    const g = tempCanvas.getContext('2d');
    if (!g) return tempCanvas;
    g.imageSmoothingQuality = 'high';
    if (filters && canvasFilterSupported) {
      g.filter = filters;
    }

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
    if (!canvasFilterSupported) {
      return applyManualFilters(tempCanvas, filters);
    }
    return tempCanvas;
  }

  function clipRoundedRectPath(ctxInstance, x, y, size, radius) {
    const safeRadius = Math.max(0, Math.min(radius, size / 2));
    if (safeRadius === 0) {
      ctxInstance.beginPath();
      ctxInstance.rect(x, y, size, size);
      ctxInstance.closePath();
      return;
    }

    ctxInstance.beginPath();
    ctxInstance.moveTo(x + safeRadius, y);
    ctxInstance.arcTo(x + size, y, x + size, y + size, safeRadius);
    ctxInstance.arcTo(x + size, y + size, x, y + size, safeRadius);
    ctxInstance.arcTo(x, y + size, x, y, safeRadius);
    ctxInstance.arcTo(x, y, x + size, y, safeRadius);
    ctxInstance.closePath();
  }

  /**
   * Carrega imagens garantindo suporte a CORS quando necessário.
   * Retorna uma instância de Image pronta para uso no canvas.
   */
  async function loadImage(url) {
    let finalUrl = url;
    let objectUrl = null;
    let shouldRequestCors = false;
    let shouldForceBlob = false;
    let shouldSetCrossOrigin = false;

    try {
      const resolvedUrl = new URL(url, window.location.href);
      finalUrl = resolvedUrl.href;
      const isDataUrl = resolvedUrl.protocol === 'data:';
      const isFileUrl = resolvedUrl.protocol === 'file:';
      const sameOrigin = resolvedUrl.origin === window.location.origin;
      const runningFromFile = window.location.protocol === 'file:';

      if (!isDataUrl) {
        if (isFileUrl) {
          // Imagens locais (file://) não podem ser buscadas via fetch/XMLHttpRequest.
          // Carregamos diretamente e confiamos na verificação de contaminação.
          shouldForceBlob = false;
        } else {
          // Convertemos para Blob sempre que houver risco de CORS ou quando
          // estivermos rodando via file:// e a origem for remota.
          shouldForceBlob = !sameOrigin || runningFromFile;
        }
      }

      shouldRequestCors = !isDataUrl && !isFileUrl && !sameOrigin;
      shouldSetCrossOrigin = shouldRequestCors;
    } catch (error) {
      // Mantém a URL original caso não seja possível resolvê-la (ex.: caminhos relativos não padrão).
      finalUrl = url;
    }

    if (shouldRequestCors) {
      try {
        const response = await fetch(finalUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        finalUrl = objectUrl;
      } catch (error) {
        if (shouldForceBlob && window.location.protocol === 'file:') {
          try {
            const blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('GET', finalUrl);
              xhr.responseType = 'blob';
              xhr.onload = () => {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                  resolve(xhr.response);
                } else {
                  reject(new Error(`XHR HTTP ${xhr.status}`));
                }
              };
              xhr.onerror = () => reject(new Error('XHR request failed'));
              xhr.send();
            });
            objectUrl = URL.createObjectURL(blob);
            finalUrl = objectUrl;
          } catch (xhrError) {
            console.warn('Falha ao carregar imagem local para exportação.', xhrError);
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
              objectUrl = null;
            }
            throw xhrError;
          }
        } else {
          console.warn('Falha ao buscar a imagem com CORS. O fundo será omitido para permitir a exportação.', error);
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            objectUrl = null;
          }
          throw error;
        }
      }
    } else if (shouldForceBlob) {
      try {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', finalUrl);
          xhr.responseType = 'blob';
          xhr.onload = () => {
            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
              resolve(xhr.response);
            } else {
              reject(new Error(`XHR HTTP ${xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error('XHR request failed'));
          xhr.send();
        });
        objectUrl = URL.createObjectURL(blob);
        finalUrl = objectUrl;
      } catch (xhrError) {
        console.warn('Falha ao carregar imagem local para exportação.', xhrError);
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
        throw xhrError;
      }
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      if (shouldSetCrossOrigin) {
        image.crossOrigin = 'anonymous';
      }

      image.onload = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        resolve(image);
      };
      image.onerror = (error) => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        reject(error);
      };

      image.src = finalUrl;
    });
  }

  /**
   * Aplica os valores dos campos ao template textual definido no tema.
   */
  function renderTemplate(tpl, data) {
    return tpl
      .replace(/{{evento}}/g, data.evento || '')
      .replace(/{{palestra}}/g, data.palestra || '')
      .replace(/{{data}}/g, data.data || '')
      .replace(/{{horário}}/g, data.horario || '')
      .replace(/{{site}}/g, data.site || '')
      .replace(/{{hashtags}}/g, data.hashtags || '');
  }

  /**
   * Gera o texto auxiliar para redes sociais com base nos campos do formulário.
   */
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

  /**
   * Define o formato padrão da arte (4:5 usado em redes sociais verticais).
   */
  function getFormatPx() {
    return { w: 1080, h: 1350 };
  }

  let cachedBgUrl = null;
  let cachedBgImage = null;

  const blockedBgUrls = new Set();

  /**
   * Busca e cacheia a imagem de fundo definida no tema, bloqueando URLs
   * problemáticas para evitar repetição de erros.
   */
  async function getBackgroundImage(url) {
    if (!url || blockedBgUrls.has(url)) {
      return null;
    }
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
      blockedBgUrls.add(url);
      return null;
    }
  }

  /**
   * Determina se o canvas está "contaminado" por operações sem CORS.
   * Caso esteja, o navegador impede exportação/compartilhamento da imagem.
   */
  function canvasIsExportable(context) {
    try {
      // A leitura de qualquer pixel dispara SecurityError quando o canvas está contaminado.
      context.getImageData(0, 0, 1, 1);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Renderiza todo o layout no canvas considerando DPI, filtros de imagem e
   * configurações do tema.
   */
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

    if (THEME.bgUrl) {
      const bg = await getBackgroundImage(THEME.bgUrl);
      if (bg) {
        const scale = Math.max(W / bg.width, H / bg.height);
        const bw = bg.width * scale;
        const bh = bg.height * scale;
        ctx.drawImage(bg, (W - bw) / 2, (H - bh) / 2, bw, bh);
        if (!canvasIsExportable(ctx)) {
          console.warn('Fundo removido para evitar contaminação do canvas e permitir exportação.');
          blockedBgUrls.add(THEME.bgUrl);
          cachedBgImage = null;
          cachedBgUrl = null;
          ctx.clearRect(0, 0, W, H);
        }
      }
    }

    const overlayOpacity =
      typeof THEME.overlayOpacity === 'number' ? THEME.overlayOpacity : 0.45;
    if (overlayOpacity > 0) {
      ctx.fillStyle = `rgba(0,0,0,${overlayOpacity})`;
      ctx.fillRect(0, 0, W, H);
    }

    const textColor = THEME.textOnDark || '#fff';
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    const pad = Math.round(48 * dpr);

    const colGap = Math.round(40 * dpr);
    const photoSize = photoLayout.size != null
      ? Math.round(photoLayout.size * dpr)
      : Math.round(W * 0.34);
    const photoShape = photoLayout.shape === 'circle' ? 'circle' : 'square';
    const photoX = photoLayout.x != null
      ? Math.round(photoLayout.x * dpr)
      : W - pad - photoSize;
    const photoY = photoLayout.y != null
      ? Math.round(photoLayout.y * dpr)
      : Math.round(H * 0.24);
    const photoMargin = photoLayout.margin != null
      ? Math.max(0, Math.round(photoLayout.margin * dpr))
      : Math.round(22 * dpr);
    const photoRadius = photoLayout.borderRadius != null
      ? Math.max(0, Math.round(photoLayout.borderRadius * dpr))
      : Math.round(24 * dpr);

    const textX = textLayout.x != null ? Math.round(textLayout.x * dpr) : pad;
    const textStartY = textLayout.y != null
      ? Math.round(textLayout.y * dpr)
      : pad + Math.round(12 * dpr);
    const textW = textLayout.width != null
      ? Math.round(textLayout.width * dpr)
      : W - pad * 2 - (photoSize + colGap);

    const nome = (inpNome.value || '').trim() || 'Seu Nome Aqui';
    const cargoValue = (inpCargo.value || '').trim();
    const empresaValue = (inpEmpresa.value || '').trim();
    const cargoEmpresaParts = [];
    if (cargoValue) cargoEmpresaParts.push(cargoValue);
    if (empresaValue) cargoEmpresaParts.push(empresaValue);
    const hasCargoEmpresa = cargoEmpresaParts.length > 0;
    const cargoEmpresa = hasCargoEmpresa
      ? cargoEmpresaParts.join(' - ')
      : 'Cargo - Empresa';
    const titulo = (inpTitulo.value || '').trim() || 'Título da Atividade';
    const info = [
      (inpData.value || '').trim(),
      (inpHorario.value || '').trim()
    ].filter(Boolean).join(' • ');
    const socialHandle = (inpSocial.value || '').trim();

    let y = textStartY;

    const nomeSize = fontSizes.name;
    setFont(800, nomeSize);
    y = wrapText(ctx, nome, textX, y, textW, lh(nomeSize), 4);
    y = addTextGap(y);

    if (hasCargoEmpresa || (!cargoValue && !empresaValue)) {
      const size = fontSizes.role;
      setFont(600, size);
      y = wrapText(ctx, cargoEmpresa, textX, y, textW, lh(size), 4);
      y = addTextGap(y);
    }

    if (titulo) {
      const size = fontSizes.talkTitle;
      setFont(700, size);
      y = wrapText(ctx, `“${titulo}”`, textX, y, textW, lh(size), 6);
      y = addTextGap(y);
    }

    if (info) {
      const size = fontSizes.info;
      setFont(600, size);
      y = wrapText(ctx, info, textX, y, textW, lh(size), 1);
      y = addTextGap(y);
    }

    if (socialHandle) {
      const size = fontSizes.social;
      y += Math.round(16 * dpr);
      setFont(600, size);
      y = wrapText(ctx, socialHandle, textX, y, textW, lh(size), 2);
      y = addTextGap(y);
    }

    if (cropper) {
      const cropped = cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' });
      if (cropped) {
        const filteredCanvas = drawSquareWithFilters(cropped, photoSize, cssFilters());
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'rgba(0,0,0,0.30)';
        if (photoShape === 'circle') {
          const centerX = photoX + photoSize / 2;
          const centerY = photoY + photoSize / 2;
          const haloRadius = photoSize / 2 + photoMargin / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            photoX - photoMargin / 2,
            photoY - photoMargin / 2,
            photoSize + photoMargin,
            photoSize + photoMargin
          );
        }
        ctx.restore();

        ctx.save();
        if (photoShape === 'circle') {
          const centerX = photoX + photoSize / 2;
          const centerY = photoY + photoSize / 2;
          const radius = photoSize / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.closePath();
        } else {
          clipRoundedRectPath(ctx, photoX, photoY, photoSize, photoRadius);
        }
        ctx.clip();
        ctx.drawImage(filteredCanvas, photoX, photoY, photoSize, photoSize);
        ctx.restore();
      }
    }

  }

  /**
   * Simples utilitário para evitar redesenhos constantes em sequência.
   * Mantém a UI responsiva mesmo com eventos de input intensos.
   */
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

  const requestRedraw = throttle(redraw, 33);

  let currentObjectUrl = null;

  // --- Interações com upload/crop da foto ---

  inpFoto.addEventListener('change', (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }

    const url = URL.createObjectURL(file);
    currentObjectUrl = url;

    cropImg.crossOrigin = 'anonymous';
    cropImg.onload = () => {
      if (cropper) cropper.destroy();
      const objectUrl = url;
      cropper = new Cropper(cropImg, {
        viewMode: 1,
        aspectRatio: 1,
        dragMode: 'move',
        background: false,
        autoCropArea: 0.95,
        ready() {
          if (currentObjectUrl === objectUrl) {
            URL.revokeObjectURL(objectUrl);
            currentObjectUrl = null;
          }
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
    cropImg.onerror = () => {
      if (currentObjectUrl === url) {
        URL.revokeObjectURL(url);
        currentObjectUrl = null;
      }
      alert('Não foi possível carregar esta imagem.');
    };
    cropImg.src = url;
  });

  // Ajustes finos da imagem (brilho/contraste/saturação) disparam redesenho.
  [rangeBrilho, rangeContraste, rangeSaturacao].forEach((el) => {
    el.addEventListener('input', requestRedraw);
  });

  // Controles de manipulação do Cropper.js.
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
    cropper?.reset();
    requestRedraw();
  });

  const textInputs = [inpNome, inpCargo, inpEmpresa, inpTitulo, inpData, inpHorario, inpSocial];
  textInputs.forEach((el) => {
    const handleUpdate = () => {
      atualizarTexto();
      requestRedraw();
    };
    el.addEventListener('input', handleUpdate);
    el.addEventListener('change', handleUpdate);
  });

  /**
   * Converte o canvas para Blob, validando se ele está elegível para exportação.
   */
  function canvasToBlob(c) {
    return new Promise((resolve, reject) => {
      if (!c) {
        reject(new Error('Canvas não encontrado.'));
        return;
      }
      try {
        const context = c.getContext('2d');
        if (!context || !canvasIsExportable(context)) {
          reject(new Error('Canvas contaminado.'));
          return;
        }
        c.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Falha ao gerar a imagem.'));
          }
        }, 'image/png', 0.98);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Exporta a imagem em PNG para download local.
  btnExport.addEventListener('click', async () => {
    try {
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
    } catch (error) {
      console.error('Erro ao exportar a imagem.', error);
      if (error && /contaminado/i.test(error.message)) {
        alert('O fundo utilizado não permite exportação. Ele foi desabilitado — tente novamente.');
        await redraw();
      } else {
        alert('Não foi possível gerar a imagem. Verifique se as imagens usadas permitem exportação.');
      }
    }
  });

  // Compartilha o post via Web Share API quando disponível.
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
      if (error && /contaminado/i.test(error.message)) {
        alert('O fundo utilizado não permite compartilhamento. Ele foi desabilitado — tente novamente.');
        await redraw();
      } else {
        alert('Não foi possível compartilhar. Baixe a imagem e poste manualmente.');
      }
    }
  });

  // Estado inicial da aplicação.
  atualizarTexto();
  redraw();
})();
