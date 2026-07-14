function drawReportStageSnapshot(ctx, data, byKey, byAccessoryKey = new Map(), byMicStandKey = new Map()) {
  const { stage } = data;
  ctx.fillStyle = stage.color;
  ctx.strokeStyle = stage.borderColor;
  ctx.lineWidth = 2;
  roundRect(ctx, stage.x, stage.y, stage.width, stage.height, 9);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,.26)';
  ctx.fillRect(stage.x, stage.y + stage.height - 14, stage.width, 14);
  ctx.fillStyle = '#132033';
  ctx.font = '12px "Share Tech Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(stage.label, stage.x + stage.width / 2, stage.y + 18);
  ctx.font = '10px "Share Tech Mono", monospace';
  ctx.fillStyle = '#3b4e66';
  ctx.fillText(stage.dims, stage.x + stage.width / 2, stage.y + 30);

  data.parts.forEach(part => {
    ctx.fillStyle = part.color;
    ctx.strokeStyle = 'rgba(10,11,13,.45)';
    ctx.lineWidth = 2;
    if(part.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(part.x + part.width / 2, part.y + part.height / 2, Math.min(part.width, part.height) / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      roundRect(ctx, part.x, part.y, part.width, part.height, 8);
      ctx.fill();
      ctx.stroke();
      if(part.hasSteps) {
        ctx.save();
        roundRect(ctx, part.x, part.y, part.width, part.height, 8);
        ctx.clip();
        ctx.fillStyle = 'rgba(10,11,13,.22)';
        for(let y = part.y + 6; y <= (part.y + part.height - 4); y += 7) {
          ctx.fillRect(part.x + 2, y, Math.max(0, part.width - 4), 2);
        }
        ctx.restore();
      }
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    const partCenterX = part.x + (part.width / 2);
    const labelY = part.y + (part.height / 2) + 1;
    ctx.fillText(part.label, partCenterX, labelY);
    ctx.font = '8px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.fillText(part.dimsLabel || getReportStagePartDimsLabel(part), partCenterX, labelY + 10);
  });

  (data.connections || []).forEach(conn => {
    const points = [
      { x: conn.from.x, y: conn.from.y },
      { x: conn.routeX, y: conn.from.y },
      { x: conn.routeX, y: conn.to.y },
      { x: conn.to.x, y: conn.to.y },
    ];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = conn.color;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.92;
    ctx.shadowColor = conn.color;
    ctx.shadowBlur = 5;
    ctx.stroke();

    ctx.shadowBlur = 0;
    [points[0], points[points.length - 1]].forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = conn.color;
      ctx.fill();
    });
    ctx.restore();
  });

  const orderedItems = (data.items || []).slice().sort((a, b) => {
    const ao = Number.isFinite(a.renderOrder) ? a.renderOrder : 0;
    const bo = Number.isFinite(b.renderOrder) ? b.renderOrder : 0;
    return ao - bo;
  });

  orderedItems.forEach(item => {
    const cx = item.x + (item.width / 2);
    const cy = item.y + (item.height / 2);
    const angleRad = ((parseInt(item.angle || 0, 10) || 0) * Math.PI) / 180;
    const isExpandedConnbox = !!item.connectionBoxKind && !item.collapsed;
    const isCollapsedConnbox = !!item.connectionBoxKind && !!item.collapsed;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.translate(-cx, -cy);

    if(isExpandedConnbox) {
      drawReportExpandedConnboxPanel(ctx, item, byKey.get(item.id), data.connections || []);
    } else if(isCollapsedConnbox) {
      drawReportCollapsedConnboxPanel(ctx, item, byKey.get(item.id));
    } else {
      if(!item.isStand) {
        ctx.fillStyle = item.color;
        ctx.strokeStyle = item.stroke;
        ctx.lineWidth = 2.2;
        roundRect(ctx, item.x, item.y, item.width, item.height, 10);
        ctx.fill();
        ctx.stroke();
      }
      const img = byKey.get(item.id);
      if(img) {
        const targetW = Math.max(24, item.width * 0.82);
        const targetH = Math.max(24, item.height * 0.82);
        const ratio = Math.min(targetW / img.width, targetH / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const drawX = item.x + (item.width - w) / 2;
        const drawY = item.y + ((item.height - h) / 2);
        ctx.drawImage(img, drawX, drawY, w, h);
      } else {
        ctx.fillStyle = '#17324f';
        ctx.font = '18px serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon, item.x + item.width / 2, item.y + item.height / 2);
      }

      if(!item.isStand) {
        const labelY = item.y + item.height - 5;
        drawReportOutlinedLabelText(ctx, item.label, item.x + (item.width / 2), labelY, '600 8px Barlow, sans-serif', Math.max(22, item.width - 8));
      }
    }

    if(item.micStandCount > 0) {
      const micStandImg = byMicStandKey.get(item.id) || null;
      const standX = item.x - 12;
      const standY = item.y - 2;
      const standSize = 42;
      if(micStandImg) {
        const srcW = Math.max(1, Number(micStandImg.width) || 1);
        const srcH = Math.max(1, Number(micStandImg.height) || 1);
        const fitRatio = Math.min(standSize / srcW, standSize / srcH);
        const drawW = srcW * fitRatio;
        const drawH = srcH * fitRatio;
        const drawX = standX + ((standSize - drawW) / 2);
        const drawY = standY + ((standSize - drawH) / 2);
        ctx.drawImage(micStandImg, drawX, drawY, drawW, drawH);
      } else {
        ctx.fillStyle = '#17324f';
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ðŸŽ™', standX + (standSize / 2), standY + (standSize / 2));
      }
      if(item.micStandCount > 1) {
        const multiplierUnit = 1.6;
        const countX = standX + standSize + (((multiplierUnit / 3) - 1) * standSize);
        const countY = standY + (standSize / 2);
        ctx.save();
        ctx.font = '700 12px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#132033';
        ctx.shadowColor = 'rgba(255,255,255,.88)';
        ctx.shadowBlur = 2;
        ctx.fillText(`x${item.micStandCount}`, countX, countY);
        ctx.restore();
      }
    }

    if(item.hasAccessory) {
      const accessoryImg = byAccessoryKey.get(item.id) || null;
      // Match live editor CSS: .accessory-badge { right:-10px; top:-2px } and img { width:26px; height:26px; object-fit:contain }
      const badgeW = 26;
      const badgeH = 26;
      const bx = item.x + item.width - 16;
      const by = item.y - 2;
      ctx.save();
      if(accessoryImg) {
        const srcW = Math.max(1, Number(accessoryImg.width) || 1);
        const srcH = Math.max(1, Number(accessoryImg.height) || 1);
        const fitRatio = Math.min(badgeW / srcW, badgeH / srcH);
        const drawW = srcW * fitRatio;
        const drawH = srcH * fitRatio;
        const drawX = bx + ((badgeW - drawW) / 2);
        const drawY = by + ((badgeH - drawH) / 2);
        ctx.drawImage(accessoryImg, drawX, drawY, drawW, drawH);
      } else if(item.accessoryEmoji) {
        const emojiSize = 20;
        const ex = bx + ((badgeW - emojiSize) / 2);
        const ey = by + ((badgeH - emojiSize) / 2);
        ctx.fillStyle = 'rgba(7,13,25,.82)';
        ctx.strokeStyle = 'rgba(255,255,255,.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ex + (emojiSize / 2), ey + (emojiSize / 2), emojiSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(String(item.accessoryEmoji), ex + (emojiSize / 2), ey + (emojiSize / 2) + 0.2);
      }
      ctx.restore();
    }
    ctx.restore();
  });

  ctx.fillStyle = '#6c7c8f';
  ctx.font = '11px "Share Tech Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('â—€ AUDIENCE â–¶', stage.x + stage.width / 2, stage.y + stage.height + 24);
}

function drawReportCollapsedConnboxPanel(ctx, item, img) {
  const x = item.x;
  const y = item.y;
  const w = item.width;
  const h = item.height;
  const kind = String(item.connectionBoxKind || '');
  const radius = Math.max(4, Math.min(8, w * 0.1));
  const fill = kind === 'outlet'
    ? '#f3f4f6'
    : (kind === 'snake'
      ? '#f3ecff'
      : (kind === 'stagebox'
        ? '#eaf8f0'
        : '#e8f2ff'));
  const stroke = kind === 'outlet'
    ? '#9ca3af'
    : (kind === 'snake'
      ? '#ab79d8'
      : (kind === 'stagebox'
        ? '#4da97f'
        : '#7aaed9'));

  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.8;
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.stroke();

  if(img) {
    const topPad = Math.max(4, h * 0.12);
    const bottomPad = Math.max(12, h * 0.35);
    const sidePad = Math.max(6, w * 0.12);
    const targetW = Math.max(12, w - (sidePad * 2));
    const targetH = Math.max(12, h - topPad - bottomPad);
    const ratio = Math.min(targetW / img.width, targetH / img.height);
    const drawW = img.width * ratio;
    const drawH = img.height * ratio;
    const drawX = x + ((w - drawW) / 2);
    const drawY = y + topPad + ((targetH - drawH) / 2);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } else {
    ctx.fillStyle = '#6b4b95';
    ctx.font = `${Math.max(10, Math.min(15, w * 0.23))}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(item.icon || 'â€¢'), x + (w / 2), y + (h * 0.45));
  }

  const label = String(item.label || item.name || 'Item');
  ctx.font = '600 8px Barlow, sans-serif';
  const metrics = ctx.measureText(label);
  const pillW = Math.max(26, Math.min(w - 6, metrics.width + 10));
  const pillH = 11;
  const pillX = x + ((w - pillW) / 2);
  const pillY = y + h - pillH - 2;
  ctx.fillStyle = 'rgba(248,251,255,.96)';
  ctx.strokeStyle = 'rgba(122,174,217,.45)';
  ctx.lineWidth = 0.8;
  roundRect(ctx, pillX, pillY, pillW, pillH, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#17324f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, pillX + (pillW / 2), pillY + (pillH / 2) + 0.2);
}

function drawReportCollapsedSnakePanel(ctx, item, img) {
  const x = item.x;
  const y = item.y;
  const w = item.width;
  const h = item.height;
  const radius = Math.max(4, Math.min(8, w * 0.1));

  ctx.fillStyle = '#f3ecff';
  ctx.strokeStyle = '#ab79d8';
  ctx.lineWidth = 1.8;
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.stroke();

  if(img) {
    const topPad = Math.max(4, h * 0.12);
    const bottomPad = Math.max(12, h * 0.35);
    const sidePad = Math.max(6, w * 0.12);
    const targetW = Math.max(12, w - (sidePad * 2));
    const targetH = Math.max(12, h - topPad - bottomPad);
    const ratio = Math.min(targetW / img.width, targetH / img.height);
    const drawW = img.width * ratio;
    const drawH = img.height * ratio;
    const drawX = x + ((w - drawW) / 2);
    const drawY = y + topPad + ((targetH - drawH) / 2);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } else {
    ctx.fillStyle = '#6b4b95';
    ctx.font = `${Math.max(10, Math.min(15, w * 0.23))}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(item.icon || 'â€¢'), x + (w / 2), y + (h * 0.45));
  }

  const label = String(item.label || 'Snake');
  ctx.font = '600 8px Barlow, sans-serif';
  const metrics = ctx.measureText(label);
  const pillW = Math.max(26, Math.min(w - 6, metrics.width + 10));
  const pillH = 11;
  const pillX = x + ((w - pillW) / 2);
  const pillY = y + h - pillH - 2;
  ctx.fillStyle = 'rgba(248,251,255,.96)';
  ctx.strokeStyle = 'rgba(171,121,216,.45)';
  ctx.lineWidth = 0.8;
  roundRect(ctx, pillX, pillY, pillW, pillH, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#17324f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, pillX + (pillW / 2), pillY + (pillH / 2) + 0.2);
}

function drawReportOutlinedLabelText(ctx, text, x, y, font = '600 8px Barlow, sans-serif', maxWidth = 0) {
  const value = String(text || '');
  if(!value) return;
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';
  const pxMatch = String(font).match(/(\d+(?:\.\d+)?)px/i);
  const fontPx = pxMatch ? Math.max(6, parseFloat(pxMatch[1])) : 8;
  const textWidth = ctx.measureText(value).width;
  const naturalW = textWidth + 8;
  const pillW = Number.isFinite(maxWidth) && maxWidth > 0
    ? Math.max(18, Math.min(maxWidth, naturalW))
    : Math.max(18, naturalW);
  const pillH = Math.max(10, fontPx + 3);
  const pillX = x - (pillW / 2);
  const pillY = y - fontPx - 1;

  let stageLabelText = '#ffffff';
  let stageLabelBg = 'rgba(8,12,18,.74)';
  const hex = String(stageColor || '').replace('#', '');
  if(/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const isDark = luminance < 0.52;
    stageLabelText = isDark ? '#ffffff' : '#111111';
    stageLabelBg = isDark ? 'rgba(8,12,18,.74)' : 'rgba(255,255,255,.78)';
  }

  ctx.fillStyle = stageLabelBg;
  roundRect(ctx, pillX, pillY, pillW, pillH, 3);
  ctx.fill();

  ctx.fillStyle = stageLabelText;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(value, x, y);
  ctx.restore();
}

function getReportConnectionBoxPinSets(item, reportConnections) {
  const kind = String(item.connectionBoxKind || '');
  const inputPins = [];
  const outputPins = [];

  if(kind === 'snake') {
    const channels = Math.max(1, Math.min(64, parseInt(item.snakeChannels, 10) || 16));
    const outputs = Math.max(0, Math.min(16, parseInt(item.snakeOutputs, 10) || 0));
    const stageMode = item.snakeStageMode !== false;
    const topFamily = stageMode ? 'STAGE-IN' : 'CABLE-OUT';
    const bottomFamily = stageMode ? 'STAGE-OUT' : 'CABLE-IN';
    for(let i = 1; i <= channels; i++) {
      const key = `${topFamily}-${i}`;
      inputPins.push({ key, label: String(i), used: isPinUsed(item.id, key) });
    }
    for(let i = 1; i <= outputs; i++) {
      const key = `${bottomFamily}-${i}`;
      outputPins.push({ key, label: indexToLetters(i), used: isPinUsed(item.id, key) });
    }
    return { inputPins, outputPins };
  }

  if(kind === 'outlet') {
    const ports = normalizeOutletPortCount(item.outletPorts, item);
    for(let i = 1; i <= ports; i++) {
      const key = getOutletPortVisibleKey(item, i);
      const pin = { key, label: getOutletPortName(item, i), used: isPinUsed(item.id, key) };
      if(isOutputPin(key)) outputPins.push(pin);
      else inputPins.push(pin);
    }
    if(!inputPins.length && !outputPins.length) {
      for(let i = 1; i <= ports; i++) {
        const key = getOutletPortVisibleKey(item, i);
        inputPins.push({ key, label: getOutletPortName(item, i), used: isPinUsed(item.id, key) });
      }
    }
    return { inputPins, outputPins };
  }

  if(kind === 'mixer' || kind === 'stagebox') {
    const breakdown = getMixerInputBreakdown(item);
    const xlrInputCount = Math.max(0, breakdown.xlrOnly);
    const comboInputCount = Math.max(0, breakdown.combo);
    const auxInputCount = Math.max(0, breakdown.auxInputs);
    let inputIndex = 1;
    for(let i = 0; i < xlrInputCount; i++) {
      const key = `MX-IN-${inputIndex}`;
      inputPins.push({ key, label: String(inputIndex), used: isPinUsed(item.id, key) });
      inputIndex += 1;
    }
    for(let i = 0; i < comboInputCount; i++) {
      const key = `MX-IN-${inputIndex}`;
      inputPins.push({ key, label: String(inputIndex), used: isPinUsed(item.id, key) });
      inputIndex += 1;
    }
    for(let i = 1; i <= auxInputCount; i++) {
      const key = `MX-AUX-IN-${i}`;
      inputPins.push({ key, label: getMixerAuxInputShortLabel(item, i), used: isPinUsed(item.id, key) });
    }
    if(!inputPins.length) {
      const fallbackInputs = Math.max(0, Number(item.mixerInputs) || 18);
      for(let i = 1; i <= fallbackInputs; i++) {
        const key = `MX-IN-${i}`;
        inputPins.push({ key, label: String(i), used: isPinUsed(item.id, key) });
      }
    }

    const auxCount = Math.max(0, Number(item.mixerAux) || 0);
    const noMainFamilies = new Set(['x32', 'x32compact', 'x32rack', 'wing', 'wingcompact', 'wingrack']);
    const mainCount = item.cat === 'stageboxes' || noMainFamilies.has(item.type)
      ? 0
      : Math.max(0, Number(item.mixerMain) || 0);
    const jackCount = Math.max(0, Number(item.mixerJackOut) || 0);
    const p16Count = Math.max(0, Number(item.mixerP16) || 0);
    const aes50Count = Math.max(0, Number(item.mixerAes50) || 0);
    for(let i = 1; i <= auxCount; i++) {
      const key = `MX-AUX-${i}`;
      outputPins.push({ key, label: item.cat === 'stageboxes' ? `O${i}` : String(i), used: isPinUsed(item.id, key) });
    }
    for(let i = 1; i <= mainCount; i++) {
      const key = `MX-MAIN-${i}`;
      outputPins.push({ key, label: i === 1 ? 'ML' : 'MR', used: isPinUsed(item.id, key) });
    }
    for(let i = 1; i <= jackCount; i++) {
      const key = `MX-JACK-OUT-${i}`;
      outputPins.push({ key, label: `A${i}`, used: isPinUsed(item.id, key) });
    }
    for(let i = 1; i <= p16Count; i++) {
      const key = `MX-P16-${i}`;
      outputPins.push({ key, label: `PM${i}`, used: isPinUsed(item.id, key) });
    }
    for(let i = 1; i <= aes50Count; i++) {
      const key = `MX-AES50-${i}`;
      outputPins.push({ key, label: `A5${i}`, used: isPinUsed(item.id, key) });
    }
    if(hasMixerHeadphonePort(item)) {
      const key = 'MX-HP-1';
      outputPins.push({ key, label: 'HP', used: isPinUsed(item.id, key) });
    }
    if(hasMixerUsbPort(item)) {
      const key = 'MX-USB-1';
      outputPins.push({ key, label: 'USB', used: isPinUsed(item.id, key) });
    }
    return { inputPins, outputPins };
  }

  // Fallback for future connection-box types: infer pin groups from live connections.
  (reportConnections || []).forEach(conn => {
    if(!conn) return;
    const candidates = [];
    if(conn.fromId === item.id) candidates.push(pinKey(conn.fromPin));
    if(conn.toId === item.id) candidates.push(pinKey(conn.toPin));
    candidates.forEach(key => {
      if(!key) return;
      if(inputPins.some(pin => pin.key === key) || outputPins.some(pin => pin.key === key)) return;
      const label = pinForReport(key);
      const pin = { key, label, used: true };
      if(isInputPin(key)) inputPins.push(pin);
      else outputPins.push(pin);
    });
  });
  return { inputPins, outputPins };
}

function drawReportExpandedConnboxPanel(ctx, item, img, reportConnections) {
  const x = item.x;
  const y = item.y;
  const w = item.width;
  const h = item.height;
  const kind = String(item.connectionBoxKind || '');
  if(kind === 'mixer' || kind === 'stagebox') {
    drawReportExpandedMixerPanel(ctx, item, img, reportConnections);
    return;
  }
  if(kind === 'snake') {
    drawReportExpandedSnakePanel(ctx, item, img, reportConnections);
    return;
  }
  if(kind === 'outlet') {
    drawReportExpandedOutletPanel(ctx, item, reportConnections);
    return;
  }
  const radius = Math.max(5, Math.min(9, w * 0.1));
  const pad = Math.max(4, Math.min(10, Math.round(w * 0.055)));
  const titleY = y + Math.max(10, Math.round(h * 0.14));
  const { inputPins, outputPins } = getReportConnectionBoxPinSets(item, reportConnections);
  const fill = kind === 'outlet'
    ? '#f3f4f6'
    : (kind === 'snake'
      ? '#f3ecff'
      : (kind === 'stagebox'
        ? '#eaf8f0'
        : '#e8f2ff'));
  const stroke = kind === 'outlet'
    ? '#9ca3af'
    : (kind === 'snake'
      ? '#ab79d8'
      : (kind === 'stagebox'
        ? '#4da97f'
        : '#7aaed9'));
  const inputLabelColor = kind === 'snake'
    ? '#9470c4'
    : (kind === 'outlet' ? '#5c6a79' : '#5d6b7d');
  const inputStrokeColor = kind === 'snake'
    ? '#7a4bb2'
    : (kind === 'outlet' ? '#7f8fa0' : '#1f6fa0');
  const inputFillColor = kind === 'snake'
    ? '#f7f2ff'
    : (kind === 'outlet' ? '#eef3f8' : '#ffffff');
  const inputUsedFillColor = kind === 'snake'
    ? '#d8c2ef'
    : (kind === 'outlet' ? '#d6dfeb' : '#b9ddf5');
  const inputTextColor = kind === 'snake'
    ? '#5d3f88'
    : (kind === 'outlet' ? '#344454' : '#163b55');
  const inputUsedTextColor = kind === 'snake'
    ? '#2d1649'
    : (kind === 'outlet' ? '#344454' : '#0f2c40');

  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.6;
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#102033';
  ctx.font = `600 ${Math.max(7, Math.min(11, Math.round(w * 0.11)))}px Barlow, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(String(item.label || item.name || 'Connection Box'), x + (w / 2), titleY);

  const hasOutputs = outputPins.length > 0;
  const outputsBandHeight = hasOutputs ? Math.max(18, Math.round(h * 0.24)) : 0;
  const inputsLabelY = titleY + Math.max(8, Math.round(h * 0.1));
  const inputsTop = inputsLabelY + Math.max(4, Math.round(h * 0.04));
  const inputsBottom = y + h - (hasOutputs ? outputsBandHeight : Math.max(8, Math.round(h * 0.08)));
  const inputAreaH = Math.max(14, inputsBottom - inputsTop);
  const inputCols = Math.max(1, Math.min(4, inputPins.length || 1));
  const inputRows = Math.max(1, Math.ceil((inputPins.length || 1) / inputCols));
  const inputCellW = Math.max(10, (w - (pad * 2)) / inputCols);
  const inputCellH = Math.max(10, inputAreaH / inputRows);
  const inputRadius = Math.max(3.2, Math.min(inputCellW, inputCellH) * 0.32);

  ctx.fillStyle = inputLabelColor;
  ctx.font = `600 ${Math.max(6, Math.min(9, Math.round(w * 0.078)))}px "Share Tech Mono", monospace`;
  ctx.fillText('INPUTS', x + (w / 2), inputsLabelY);

  inputPins.forEach((pin, idx) => {
    const col = idx % inputCols;
    const row = Math.floor(idx / inputCols);
    const cx = x + pad + (inputCellW * col) + (inputCellW / 2);
    const cy = inputsTop + (inputCellH * row) + (inputCellH / 2);
    ctx.strokeStyle = inputStrokeColor;
    ctx.lineWidth = 1.2;
    ctx.fillStyle = pin.used ? inputUsedFillColor : inputFillColor;
    ctx.beginPath();
    ctx.arc(cx, cy, inputRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = pin.used ? inputUsedTextColor : inputTextColor;
    ctx.font = `700 ${Math.max(5, inputRadius * 0.92)}px "Share Tech Mono", monospace`;
    ctx.fillText(String(pin.label || ''), cx, cy + 2);
  });

  if(hasOutputs) {
    const outputsLabelY = y + h - outputsBandHeight + Math.max(8, Math.round(outputsBandHeight * 0.32));
    const outputsY = y + h - Math.max(7, Math.round(outputsBandHeight * 0.3));
    const outCols = Math.max(1, Math.min(6, outputPins.length));
    const outRows = Math.max(1, Math.ceil(outputPins.length / outCols));
    const outCellW = Math.max(10, (w - (pad * 2)) / outCols);
    const outRowGap = outRows <= 1 ? 0 : Math.max(8, Math.round(outputsBandHeight * 0.4));
    const outRadius = Math.max(3.2, Math.min(inputRadius, outCellW * 0.28));

    ctx.fillStyle = '#37926b';
    ctx.font = `600 ${Math.max(6, Math.min(9, Math.round(w * 0.078)))}px "Share Tech Mono", monospace`;
    ctx.fillText('OUTPUTS', x + (w / 2), outputsLabelY);

    outputPins.forEach((pin, idx) => {
      const col = idx % outCols;
      const row = Math.floor(idx / outCols);
      const cx = x + pad + (outCellW * col) + (outCellW / 2);
      const cy = outputsY - ((outRows - 1 - row) * outRowGap);
      ctx.strokeStyle = '#1f8a5a';
      ctx.fillStyle = pin.used ? '#a9e6c8' : '#e7fff2';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, outRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = pin.used ? '#0c4c30' : '#1f8a5a';
      ctx.font = `700 ${Math.max(5, outRadius * 0.9)}px "Share Tech Mono", monospace`;
      ctx.fillText(String(pin.label || ''), cx, cy + 2);
    });
  }
}

function drawReportExpandedOutletPanel(ctx, item, reportConnections) {
  const bodyW = Math.max(34, item.width - 6);
  const bodyH = Math.max(24, item.height - 6);
  const x = item.x + 3;
  const y = item.y + 3;
  const ports = normalizeOutletPortCount(item.outletPorts, item);

  ctx.fillStyle = '#f3f4f6';
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1.6;
  roundRect(ctx, x, y, bodyW, bodyH, 5);
  ctx.fill();
  ctx.stroke();

  const horizontalPad = Math.max(3, Math.round(bodyW * 0.04));
  const topPad = Math.max(3, Math.round(bodyH * 0.12));
  const labelGap = 12;
  const usableW = Math.max(8, bodyW - (horizontalPad * 2));
  const usableH = Math.max(8, bodyH - topPad - labelGap);
  const gap = ports > 1 ? Math.max(2, Math.min(6, usableW * 0.02)) : 0;
  const pinSize = Math.max(7, Math.min(16, Math.min(usableH, (usableW - (gap * (ports - 1))) / ports)));
  const totalPinsW = (pinSize * ports) + (gap * (ports - 1));
  const startX = x + ((bodyW - totalPinsW) / 2);
  const pinY = y + topPad + ((usableH - pinSize) / 2);

  for(let i = 1; i <= ports; i++) {
    const key = getOutletPortVisibleKey(item, i);
    const typeId = getOutletPortCableTypeForPin(item, key);
    const base = getCableTypeColor(typeId);
    const border = shadeHexColor(base, 0.78);
    const used = shadeHexColor(base, 0.88);
    const usedFlag = isPinUsed(item.id, key);
    const fill = usedFlag ? used : base;
    const text = getContrastTextColor(fill);
    const px = startX + ((i - 1) * (pinSize + gap));

    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.1;
    roundRect(ctx, px, pinY, pinSize, pinSize, 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = text;
    ctx.font = `700 ${Math.max(6, pinSize * 0.6)}px "Share Tech Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(getOutletPortName(item, i), px + (pinSize / 2), pinY + (pinSize * 0.7));
  }

  const labelY = y + bodyH - 4;
  drawReportOutlinedLabelText(ctx, item.label, x + (bodyW / 2), labelY, '600 8px Barlow, sans-serif');
}

function drawReportExpandedSnakePanel(ctx, item, img, reportConnections) {
  const pad = Math.max(2, Math.round(item.width * 0.025));
  const x = item.x + pad;
  const y = item.y + pad;
  const w = Math.max(44, item.width - (pad * 2));
  const h = Math.max(44, item.height - (pad * 2));
  const uiScale = getRackUIScale(w, 80);
  const tabH = Math.max(10, Math.round(12 * uiScale));
  const channels = Math.max(1, Math.min(64, parseInt(item.snakeChannels, 10) || 16));
  const outputs = Math.max(0, Math.min(16, parseInt(item.snakeOutputs, 10) || 0));
  const stageMode = item.snakeStageMode !== false;
  const titleFont = Math.max(7, w * 0.1);
  const monoFont = Math.max(6, w * 0.072);
  const topFamily = stageMode ? 'STAGE-IN' : 'CABLE-OUT';
  const bottomFamily = stageMode ? 'STAGE-OUT' : 'CABLE-IN';
  const topLabel = stageMode ? 'INPUTS' : 'OUTPUTS';
  const bottomLabel = stageMode ? 'OUTPUTS' : 'INPUTS';
  const ioTypeLabel = stageMode ? 'STAGE' : 'CABLE';
  const usedTop = new Set();
  const usedBottom = new Set();

  (reportConnections || []).forEach(conn => {
    if(!conn) return;
    if(conn.fromId === item.id) {
      const topMatch = String(conn.fromPin || '').match(new RegExp(`^${topFamily}-(\\d+)$`));
      const bottomMatch = String(conn.fromPin || '').match(new RegExp(`^${bottomFamily}-(\\d+)$`));
      if(topMatch) usedTop.add(parseInt(topMatch[1], 10));
      if(bottomMatch) usedBottom.add(parseInt(bottomMatch[1], 10));
    }
    if(conn.toId === item.id) {
      const topMatch = String(conn.toPin || '').match(new RegExp(`^${topFamily}-(\\d+)$`));
      const bottomMatch = String(conn.toPin || '').match(new RegExp(`^${bottomFamily}-(\\d+)$`));
      if(topMatch) usedTop.add(parseInt(topMatch[1], 10));
      if(bottomMatch) usedBottom.add(parseInt(bottomMatch[1], 10));
    }
  });

  ctx.fillStyle = '#f3ecff';
  ctx.strokeStyle = '#ab79d8';
  ctx.lineWidth = 1.6;
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#101722';
  ctx.font = `600 ${titleFont}px Barlow, sans-serif`;
  ctx.textAlign = 'center';
  const titleY = y + Math.max(11, h * 0.1);
  ctx.fillText(item.label, x + (w / 2), titleY);

  const tabY = titleY + Math.max(8, h * 0.065);
  const tabGap = Math.max(3, Math.round(4 * uiScale));
  const tabMinW = Math.max(24, 34 * uiScale);
  const tabMaxW = Math.max(tabMinW, 64 * uiScale);
  const tabW = Math.min(tabMaxW, Math.max(tabMinW, (w - (tabGap * 3)) / 2));
  const tabsTotalW = (tabW * 2) + tabGap;
  const tabsStartX = x + ((w - tabsTotalW) / 2);
  ctx.fillStyle = stageMode ? '#d7bdf2' : '#e8ecef';
  roundRect(ctx, tabsStartX, tabY, tabW, tabH, 4);
  ctx.fill();
  ctx.strokeStyle = stageMode ? '#7a4bb2' : '#aab4bc';
  ctx.lineWidth = 0.9;
  roundRect(ctx, tabsStartX, tabY, tabW, tabH, 4);
  ctx.stroke();
  ctx.fillStyle = stageMode ? '#e8ecef' : '#d7bdf2';
  roundRect(ctx, tabsStartX + tabW + tabGap, tabY, tabW, tabH, 4);
  ctx.fill();
  ctx.strokeStyle = stageMode ? '#aab4bc' : '#7a4bb2';
  ctx.lineWidth = 0.8;
  roundRect(ctx, tabsStartX + tabW + tabGap, tabY, tabW, tabH, 4);
  ctx.stroke();
  const tabFont = Math.max(6, Math.min(10, 8 * uiScale));
  const tabTextY = tabY + (tabH * 0.67);
  ctx.fillStyle = stageMode ? '#6b4b95' : '#6e7580';
  ctx.font = `600 ${tabFont}px "Share Tech Mono", monospace`;
  ctx.fillText('STAGE', tabsStartX + (tabW / 2), tabTextY);
  ctx.fillStyle = stageMode ? '#6e7580' : '#6b4b95';
  ctx.fillText('CABLE', tabsStartX + tabW + tabGap + (tabW / 2), tabTextY);

  const outSectionH = outputs > 0 ? Math.max(18, h * 0.16) : 0;
  const inputsLabelY = tabY + tabH + Math.max(8, h * 0.05);
  ctx.fillStyle = '#9470c4';
  ctx.font = `600 ${monoFont}px "Share Tech Mono", monospace`;
  const typeFont = Math.max(5, monoFont * 0.76);
  ctx.fillText(topLabel, x + (w / 2) - Math.max(12, w * 0.045), inputsLabelY);
  ctx.fillStyle = '#ad95cd';
  ctx.font = `500 ${typeFont}px "Share Tech Mono", monospace`;
  ctx.fillText(ioTypeLabel, x + (w / 2) + Math.max(15, w * 0.07), inputsLabelY);

  const cols = Math.min(4, channels);
  const rows = Math.ceil(channels / cols);
  const gridTop = inputsLabelY + Math.max(4, h * 0.03);
  const gridBottom = y + h - outSectionH - Math.max(4, h * 0.02);
  const availableGridH = Math.max(14, gridBottom - gridTop);
  const availableW = Math.max(24, w - (pad * 2));
  const basePinSize = 16;
  const baseGap = 7;
  const gridNaturalW = (basePinSize * cols) + (baseGap * (cols - 1));
  const widthScale = gridNaturalW > availableW ? (availableW / gridNaturalW) : 1;
  const rowNaturalH = (basePinSize * rows) + (baseGap * Math.max(0, rows - 1));
  const heightScale = rowNaturalH > availableGridH ? (availableGridH / rowNaturalH) : 1;
  const pinScale = Math.max(0.62, Math.min(1, widthScale, heightScale));
  const pinSize = basePinSize * pinScale;
  const gap = baseGap * pinScale;
  const rowStep = pinSize + gap;
  const gridW = (pinSize * cols) + (gap * Math.max(0, cols - 1));
  const gridLeft = x + ((w - gridW) / 2);
  const pinRadius = pinSize / 2;
  const gridTextFont = Math.max(5, 8 * pinScale);
  for(let i = 0; i < channels; i++) {
    const idx = i + 1;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = gridLeft + pinRadius + (col * rowStep);
    const cy = gridTop + pinRadius + (row * rowStep);
    const isUsed = usedTop.has(idx);
    const topIsOutput = !stageMode;
    ctx.strokeStyle = topIsOutput ? '#1f8a5a' : '#7a4bb2';
    ctx.lineWidth = 1.2;
    ctx.fillStyle = topIsOutput
      ? (isUsed ? '#a9e6c8' : '#ffffff')
      : (isUsed ? '#d8c2ef' : '#ffffff');
    ctx.beginPath();
    ctx.arc(cx, cy, pinRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = topIsOutput
      ? (isUsed ? '#0c4c30' : '#1f8a5a')
      : (isUsed ? '#2d1649' : '#5d3f88');
    ctx.font = `700 ${gridTextFont}px "Share Tech Mono", monospace`;
    ctx.fillText(String(idx), cx, cy + 2);
  }

  const outY = y + h - Math.max(7, h * 0.055);
  if(outputs > 0) {
    ctx.fillStyle = '#37926b';
    ctx.font = `600 ${monoFont}px "Share Tech Mono", monospace`;
    const bottomLabelY = outY - Math.max(9, h * 0.085);
    ctx.fillText(bottomLabel, x + (w / 2) - Math.max(12, w * 0.045), bottomLabelY);
    ctx.fillStyle = '#6aab88';
    ctx.font = `500 ${typeFont}px "Share Tech Mono", monospace`;
    ctx.fillText(ioTypeLabel, x + (w / 2) + Math.max(15, w * 0.07), bottomLabelY);
  }

  if(outputs > 0) {
    const outCols = Math.min(4, outputs);
    const outRows = Math.ceil(outputs / outCols);
    const outGridW = (pinSize * outCols) + (gap * Math.max(0, outCols - 1));
    const outGridLeft = x + ((w - outGridW) / 2);
    const outRowGap = Math.max(8, pinSize + (gap * 0.2));
    const outRadius = pinRadius;
    const bottomIsOutput = stageMode;
    for(let i = 0; i < outputs; i++) {
      const idx = i + 1;
      const col = i % outCols;
      const row = Math.floor(i / outCols);
      const cx = outGridLeft + outRadius + (col * (pinSize + gap));
      const cy = outY - ((outRows - 1 - row) * outRowGap);
      const isUsed = usedBottom.has(idx);
      ctx.strokeStyle = bottomIsOutput ? '#1f8a5a' : '#7a4bb2';
      ctx.fillStyle = bottomIsOutput
        ? (isUsed ? '#a9e6c8' : '#ffffff')
        : (isUsed ? '#d8c2ef' : '#ffffff');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, outRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = bottomIsOutput
        ? (isUsed ? '#0c4c30' : '#1f8a5a')
        : (isUsed ? '#2d1649' : '#5d3f88');
      ctx.font = `700 ${gridTextFont}px "Share Tech Mono", monospace`;
      ctx.fillText(String.fromCharCode(65 + i), cx, cy + 2);
    }
  }
}

function drawReportExpandedMixerPanel(ctx, item, img, reportConnections) {
  const bodyW = Math.max(48, item.width - 6);
  const bodyH = Math.max(52, item.height - 6);
  const x = item.x + 3;
  const y = item.y + 3;
  const pad = Math.max(4, Math.round(bodyW * 0.03));
  const uiScale = getRackUIScale(bodyW, 80);
  const isStagebox = item.cat === 'stageboxes';
  const auxCount = Math.max(0, Number(item.mixerAux) || 0);
  const mainCount = isStagebox || ['x32', 'x32compact', 'x32rack', 'wing', 'wingcompact', 'wingrack'].includes(item.type) ? 0 : Math.max(0, Number(item.mixerMain) || 0);
  const jackCount = Math.max(0, Number(item.mixerJackOut) || 0);
  const p16Count = Math.max(0, Number(item.mixerP16) || 0);
  const aes50Count = Math.max(0, Number(item.mixerAes50) || 0);
  const inputs = Math.max(0, Number(item.mixerInputs) || 18);
  const breakdown = getMixerInputBreakdown(item);

  const xlrInputCount = Math.max(0, breakdown.xlrOnly);
  const comboInputCount = Math.max(0, breakdown.combo);
  const auxInputCount = Math.max(0, breakdown.auxInputs);

  const inputPins = [];
  let inputIndex = 1;
  if(xlrInputCount > 0) {
    for(let i = 0; i < xlrInputCount; i++) inputPins.push({ key:`MX-IN-${inputIndex++}`, label:String(inputIndex - 1), used:isPinUsed(item.id, `MX-IN-${inputIndex - 1}`) });
  }
  if(comboInputCount > 0) {
    for(let i = 0; i < comboInputCount; i++) inputPins.push({ key:`MX-IN-${inputIndex++}`, label:String(inputIndex - 1), used:isPinUsed(item.id, `MX-IN-${inputIndex - 1}`) });
  }
  if(auxInputCount > 0) {
    for(let i = 0; i < auxInputCount; i++) inputPins.push({ key:`MX-AUX-IN-${i + 1}`, label:getMixerAuxInputShortLabel(item, i + 1), used:isPinUsed(item.id, `MX-AUX-IN-${i + 1}`) });
  }
  if(inputPins.length === 0) {
    for(let i = 0; i < inputs; i++) inputPins.push({ key:`MX-IN-${i + 1}`, label:String(i + 1), used:isPinUsed(item.id, `MX-IN-${i + 1}`) });
  }

  const outputPins = [];
  for(let i = 0; i < auxCount; i++) outputPins.push({ key:`MX-AUX-${i + 1}`, label:isStagebox ? `O${i + 1}` : String(i + 1), used:isPinUsed(item.id, `MX-AUX-${i + 1}`) });
  for(let i = 0; i < mainCount; i++) outputPins.push({ key:`MX-MAIN-${i + 1}`, label:`M${i === 0 ? 'L' : 'R'}`, used:isPinUsed(item.id, `MX-MAIN-${i + 1}`) });
  for(let i = 0; i < jackCount; i++) outputPins.push({ key:`MX-JACK-OUT-${i + 1}`, label:`A${i + 1}`, used:isPinUsed(item.id, `MX-JACK-OUT-${i + 1}`) });

  const otherPins = [];
  for(let i = 0; i < p16Count; i++) otherPins.push({ key:`MX-P16-${i + 1}`, label:`PM${i + 1}`, used:isPinUsed(item.id, `MX-P16-${i + 1}`) });
  for(let i = 0; i < aes50Count; i++) otherPins.push({ key:`MX-AES50-${i + 1}`, label:`A5${i + 1}`, used:isPinUsed(item.id, `MX-AES50-${i + 1}`) });
  if(hasMixerHeadphonePort(item)) otherPins.push({ key:'MX-HP-1', label:'HP', used:isPinUsed(item.id, 'MX-HP-1') });
  if(hasMixerUsbPort(item)) otherPins.push({ key:'MX-USB-1', label:'USB', used:isPinUsed(item.id, 'MX-USB-1') });

  ctx.fillStyle = isStagebox ? '#eaf8f0' : '#edf5fb';
  ctx.strokeStyle = isStagebox ? '#4da97f' : '#7aaed9';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, bodyW, bodyH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#102033';
  ctx.font = `600 ${Math.max(7, 10 * uiScale)}px Barlow, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(item.label, x + (bodyW / 2), y + Math.max(10, 9 * uiScale));

  const imageY = y + Math.max(12, 10 * uiScale);
  let imageHUsed = 0;
  if(img) {
    const imageW = Math.max(18, 34 * uiScale);
    const imageH = Math.max(14, 34 * uiScale);
    const ratio = Math.min(imageW / img.width, imageH / img.height);
    const drawW = img.width * ratio;
    const drawH = img.height * ratio;
    ctx.drawImage(img, x + (bodyW - drawW) / 2, imageY, drawW, drawH);
    imageHUsed = drawH;
  }

  const availableW = Math.min(bodyW - (pad * 2), 194 * uiScale);
  const basePinSize = 16;
  const baseGap = 7;
  const gridCols = 8;
  const gridNaturalW = (basePinSize * gridCols) + (baseGap * (gridCols - 1));
  const gridScale = gridNaturalW > availableW ? (availableW / gridNaturalW) : 1;
  let pinSize = basePinSize * gridScale;
  let gap = baseGap * gridScale;
  const baseGridW = (pinSize * gridCols) + (gap * (gridCols - 1));
  let rowLabelFont = Math.max(6, 8 * uiScale);
  let pinFont = Math.max(5, 8 * gridScale);
  let rowStep = pinSize + gap;
  const sectionStartGap = isStagebox ? Math.max(3, 1.5 * uiScale) : Math.max(1, 0.9 * uiScale);
  let titleToGridGap = isStagebox ? Math.max(7, 4.2 * uiScale) : Math.max(3, 2.1 * uiScale);
  let sectionPad = Math.max(1, 1.2 * uiScale);
  let yCursor = imageY + imageHUsed + sectionStartGap;

  const xlrPinsForSection = inputPins.filter(pin => pin.key.startsWith('MX-IN-') && Number(pin.label) <= xlrInputCount);
  const comboPins = inputPins.filter(pin => pin.key.startsWith('MX-IN-') && Number(pin.label) > xlrInputCount && Number(pin.label) <= (xlrInputCount + comboInputCount));
  const auxInputPins = inputPins.filter(pin => pin.key.startsWith('MX-AUX-IN-'));
  const xlrOutputPins = outputPins.filter(pin => pin.key.startsWith('MX-AUX-'));
  const mainOutputPins = outputPins.filter(pin => pin.key.startsWith('MX-MAIN-'));
  const jackOutputPins = outputPins.filter(pin => pin.key.startsWith('MX-JACK-OUT-'));
  const otherLabelParts = [];
  if(p16Count) otherLabelParts.push('Ultranet');
  if(aes50Count) otherLabelParts.push('AES50');
  if(hasMixerHeadphonePort(item)) otherLabelParts.push('HP');
  if(hasMixerUsbPort(item)) otherLabelParts.push('USB');
  const otherText = otherLabelParts.join(' Â· ');

  const sections = [];
  if(xlrPinsForSection.length) sections.push({ title: 'INPUTS', pins: xlrPinsForSection, labelColor: '#54697f', usedFill: '#b9ddf5', usedText: '#0f2c40', pinStroke: '#1f6fa0', isOutput: false, typeText: 'XLR' });
  if(comboPins.length) sections.push({ title: 'INPUTS', pins: comboPins, labelColor: '#54697f', usedFill: '#b9ddf5', usedText: '#0f2c40', pinStroke: '#1f6fa0', isOutput: false, typeText: 'COMBO' });
  if(auxInputPins.length) sections.push({ title: 'INPUTS', pins: auxInputPins, labelColor: '#54697f', usedFill: '#b9ddf5', usedText: '#0f2c40', pinStroke: '#1f6fa0', isOutput: false, typeText: 'AUX JACK' });
  if(!xlrInputCount && !comboInputCount && !auxInputCount) sections.push({ title: 'INPUTS', pins: inputPins, labelColor: '#54697f', usedFill: '#b9ddf5', usedText: '#0f2c40', pinStroke: '#1f6fa0', isOutput: false, typeText: '' });
  if(xlrOutputPins.length) sections.push({ title: 'OUTPUTS', pins: xlrOutputPins, labelColor: '#54697f', usedFill: '#b6e8cb', usedText: '#0d4f33', pinStroke: '#1f8a5a', isOutput: true, typeText: 'XLR' });
  if(mainOutputPins.length) sections.push({ title: 'OUTPUTS', pins: mainOutputPins, labelColor: '#54697f', usedFill: '#b6e8cb', usedText: '#0d4f33', pinStroke: '#1f8a5a', isOutput: true, typeText: 'MAIN' });
  if(jackOutputPins.length) sections.push({ title: 'OUTPUTS', pins: jackOutputPins, labelColor: '#54697f', usedFill: '#b6e8cb', usedText: '#0d4f33', pinStroke: '#1f8a5a', isOutput: true, typeText: 'AUX JACK' });
  if(otherPins.length) sections.push({ title: 'OTHERS', pins: otherPins, labelColor: '#54697f', usedFill: '#d7e7f5', usedText: '#0f2c40', pinStroke: '#54697f', isOutput: false, typeText: otherText });

  const estimateSectionHeight = (pinsCount) => {
    const rowsNeeded = Math.ceil(pinsCount / gridCols);
    return rowLabelFont + titleToGridGap + (rowsNeeded * rowStep) + sectionPad;
  };
  const estimatedHeight = sections.reduce((sum, section) => sum + estimateSectionHeight(section.pins.length), 0);
  const availableHeight = Math.max(24, (y + bodyH) - yCursor - 3);
  const fitByHeight = Math.min(1, availableHeight / Math.max(1, estimatedHeight));
  if(fitByHeight < 1) {
    const factor = Math.max(0.62, fitByHeight);
    pinSize = Math.max(6.4, pinSize * factor);
    gap = Math.max(2.2, gap * factor);
    rowLabelFont = Math.max(5.6, rowLabelFont * factor);
    pinFont = Math.max(4.7, pinFont * factor);
    titleToGridGap = Math.max(1.8, titleToGridGap * factor);
    sectionPad = Math.max(0.9, sectionPad * factor);
    rowStep = pinSize + gap;
  }

  const gridW = (pinSize * gridCols) + (gap * (gridCols - 1));
  const pinRadius = pinSize / 2;
  const gridLeftFitted = x + ((bodyW - gridW) / 2);

  const drawSection = (title, pins, labelColor, usedFill, usedText, pinStroke, isOutput = false, typeText = '') => {
    if(!pins.length) return;
    const titleY = yCursor + rowLabelFont;
    const detailFont = Math.max(6, rowLabelFont * 0.84);
    ctx.textAlign = 'left';
    ctx.font = `600 ${rowLabelFont}px "Share Tech Mono", monospace`;
    const mainW = ctx.measureText(title).width;
    let detailW = 0;
    if(typeText) {
      ctx.font = `500 ${detailFont}px "Share Tech Mono", monospace`;
      detailW = ctx.measureText(` ${typeText}`).width;
    }
    const totalW = mainW + detailW;
    const startX = (x + (bodyW / 2)) - (totalW / 2);
    ctx.fillStyle = labelColor;
    ctx.font = `600 ${rowLabelFont}px "Share Tech Mono", monospace`;
    ctx.fillText(title, startX, titleY);
    if(typeText) {
      ctx.fillStyle = '#74879b';
      ctx.font = `500 ${detailFont}px "Share Tech Mono", monospace`;
      ctx.fillText(` ${typeText}`, startX + mainW, titleY);
    }
    ctx.textAlign = 'center';
    yCursor += rowLabelFont + titleToGridGap;

    const rowsNeeded = Math.ceil(pins.length / gridCols);
    for(let i = 0; i < pins.length; i++) {
      const pin = pins[i];
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      const cx = gridLeftFitted + pinRadius + (col * rowStep);
      const cy = yCursor + pinRadius + (row * rowStep);
      ctx.strokeStyle = pinStroke;
      ctx.fillStyle = pin.used ? usedFill : (isOutput ? '#effaf2' : '#ffffff');
      ctx.lineWidth = Math.max(1, 1.5 * gridScale);
      ctx.beginPath();
      ctx.arc(cx, cy, pinRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = pin.used ? usedText : pinStroke;
      ctx.font = `700 ${pinFont}px "Share Tech Mono", monospace`;
      ctx.textBaseline = 'middle';
      ctx.fillText(pin.label, cx, cy);
      ctx.textBaseline = 'alphabetic';
    }
    yCursor += (rowsNeeded * rowStep) + sectionPad;
  };
  sections.forEach(section => {
    drawSection(section.title, section.pins, section.labelColor, section.usedFill, section.usedText, section.pinStroke, section.isOutput, section.typeText);
  });
}

function wrapReportText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if(!words.length) return [''];
  const lines = [];
  let line = words[0];
  for(let i = 1; i < words.length; i++) {
    const testLine = `${line} ${words[i]}`;
    if(ctx.measureText(testLine).width <= maxWidth) {
      line = testLine;
    } else {
      lines.push(line);
      line = words[i];
    }
  }
  lines.push(line);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
