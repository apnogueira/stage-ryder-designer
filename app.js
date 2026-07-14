
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DATA
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

let customMicOptions = [];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STATE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

let instruments = [];   // {id, type, cat, icon, label, channel, notes, x, y, size, wide, isSnake, snakeChannels}
let connections = [];   // {id, fromId, toId, fromPin, toPin, cableType, color, label}
let stageParts = [];    // {id, shape, x, y, stageNX, stageNY, widthM, depthM, color, hasSteps}
let selectedId = null;
let selectedStagePartId = null;
let connectingFrom = null; // {id, pin} pin=null for regular, pin=number for snake
let isDraggingNew = false, newDragData = null;
let selectedCable = 'xlr';
let idCounter = 0;
let stagePartIdCounter = 0;
let drawingLine = null;
let stageW = 7.5, stageD = 4.4;
let stagePx = {left:0,top:0,width:0,height:0};
let pxPerM = 1;
let showStageStairs = false;
let showMainStage = true;
let showStageGrid = true;
let suppressBuiltInStairsPart = false;
const DEFAULT_THEME_MODE = 'light';
const DEFAULT_STAGE_COLOR = '#fdca72';
let themeMode = DEFAULT_THEME_MODE;
let stageColor = DEFAULT_STAGE_COLOR;
let zoomLevel = 1;
let gestureStartZoom = 1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.2;
const TOUCH_DRAG_START_THRESHOLD_PX = 10;
const TOUCH_PIN_TAP_MAX_TRAVEL_PX = 10;
const TOUCH_PALETTE_DRAG_START_THRESHOLD_PX = 10;
const TOUCH_PALETTE_DRAG_AXIS_RATIO = 1.15;
const PHONE_BREAKPOINT_PX = 860;
const LEGACY_SIZE_PX_PER_M = 61;
let panX = 0;
let panY = 0;
let suppressCanvasClick = false;
let hasUnsavedChanges = false;
let hasInitialized = false;
let projectName = 'untitled-project';
let copiedSelection = null;
let copiedSelectionPasteCount = 0;
let copiedSelectionSceneId = null;
const RIDER_FILE_EXTENSION = '.rider.json';
const PANEL_PREF_STORAGE_KEY = 'stageDesigner.panelPrefs.v1';
const GOOGLE_DRIVE_SETTINGS_STORAGE_KEY = 'stageDesigner.googleDrive.v1';
const RECENT_RIDER_STORAGE_KEY = 'stageDesigner.recentRiders.v1';
const RECENT_RIDER_LIMIT = 10;
const RECENT_LOCAL_HANDLE_DB_NAME = 'stageDesigner.localRecentHandles.v1';
const RECENT_LOCAL_HANDLE_STORE = 'handles';
const GOOGLE_DRIVE_CLIENT_ID_DEFAULT = '1093130700852-86h3m2vltnqu9v4rqfhucsstggekufdc.apps.googleusercontent.com';
const GOOGLE_PICKER_API_KEY_DEFAULT = '';
const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const HISTORY_LIMIT = 120;
const MAX_RIDER_FILE_BYTES = 5 * 1024 * 1024;
const MAX_RIDER_INSTRUMENTS = 400;
const MAX_RIDER_CONNECTIONS = 2000;
const MAX_RIDER_STAGE_PARTS = 200;
const MAX_RIDER_SCENES = 60;
let historyStack = [];
let redoStack = [];
let isRestoringHistory = false;
const PROJECT_NAME_HISTORY_IDLE_MS = 900;
let projectNameHistorySessionActive = false;
let projectNameHistorySessionTimer = null;
let pendingHardLoadUndoSnapshot = null;
let connectionHandleCache = [];
let connectionGeometryCache = new Map();
let hoveredConnectionId = null;
let pendingHoverPoint = null;
let hoverConnectionFrameId = 0;
let touchPaletteDragData = null;
let touchPaletteGhost = null;
let isLeftPanelCollapsed = false;
let isRightPanelCollapsed = false;
let riderFileHandle = null;
let riderSaveDirHandle = null;
let riderLastSavedFileName = '';
let riderSaveLocation = 'local';
let hasRiderSavePreference = false;
let googleDriveClientId = '';
let googleDriveAccessToken = '';
let googleDriveTokenExpiryTs = 0;
let googleDriveTokenClient = null;
let googleIdentityScriptPromise = null;
let googleApiScriptPromise = null;
let googlePickerReadyPromise = null;
let googleDriveCurrentFileId = '';
let googleDriveCurrentFileName = '';
let googlePickerApiKey = '';
let googleDriveKnownFiles = [];
let recentRiderFiles = [];
let recentLocalHandleDbPromise = null;
let scenes = [];
let activeSceneId = null;
let sceneIdCounter = 0;
let sceneTabDragId = null;
let isLoadRiderPickerOpen = false;
let isLoadScenesPickerOpen = false;
let isStageBuilderMode = false;

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// INIT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function init() {
  loadPanelPrefs();
  loadGoogleDriveSettings();
  loadRecentRiderFiles();
  loadCustomMicOptions();
  buildCatTabs(); buildPalette('all'); buildSnakePalette(); buildMixerPalette(); buildStageboxPalette(); buildMonitoringPalette(); buildAccessoryPalette(); buildStandPalette();
  buildCableColors();
  applyThemeMode();
  applyStageColor();
  syncRackVisualScale();
  ensureDefaultMainStagePart(stagePx);
  ensureDefaultStageStairsPart(stagePx);
  resizeCanvas(); updateStage(true);
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      if(window.innerWidth > 860) closeMobileMenu();
      syncRackVisualScale();
      resizeCanvas();
      updateStage(true);
    });
  });
  canvasWrap.addEventListener('wheel', handleStageZoomWheel, { passive: false });
  canvasWrap.addEventListener('gesturestart', handleStageGestureStart, { passive: false });
  canvasWrap.addEventListener('gesturechange', handleStageGestureChange, { passive: false });
  canvasWrap.addEventListener('touchstart', startPanTouch, { passive: false });
  const stagePlatformEl = document.getElementById('stage-platform');
  if(stagePlatformEl) {
    stagePlatformEl.addEventListener('click', e => {
      if(!isStageBuilderMode) return;
      const primary = getPrimaryStagePart();
      if(!primary) return;
      e.stopPropagation();
      selectStagePart(primary.id);
    });
    stagePlatformEl.addEventListener('touchstart', e => {
      if(!isStageBuilderMode) return;
      const primary = getPrimaryStagePart();
      if(!primary) return;
      e.stopPropagation();
      selectStagePart(primary.id);
    }, { passive: true });
  }
  document.getElementById('rider-file').addEventListener('change', handleLoadRiderFile);
  document.getElementById('scenes-file').addEventListener('change', handleLoadScenesFile);
  document.getElementById('conn-canvas').addEventListener('mousedown', handleCableHandleMouseDown);
  document.getElementById('conn-canvas').addEventListener('touchstart', handleCableHandleTouchStart, { passive: false });
  document.getElementById('conn-canvas').addEventListener('mousemove', handleCanvasConnectionHover);
  document.getElementById('conn-canvas').addEventListener('mouseleave', () => setHoveredConnection(null));
  document.addEventListener('touchmove', moveTouchPaletteDrag, { passive: false });
  document.addEventListener('touchend', endTouchPaletteDrag, { passive: false });
  document.addEventListener('touchcancel', endTouchPaletteDrag, { passive: false });
  document.addEventListener('click', handleDocumentClickForMobileMenu);
  const recentList = document.getElementById('file-open-recent-list');
  if(recentList) recentList.addEventListener('click', onRecentMenuClick);
  const scenesRecentList = document.getElementById('scenes-load-recent-list');
  if(scenesRecentList) scenesRecentList.addEventListener('click', onScenesRecentMenuClick);
  window.addEventListener('beforeunload', e => {
    if(!hasUnsavedChanges) return;
    e.preventDefault();
    e.returnValue = '';
  });
  document.addEventListener('keydown', handleKeyboardShortcuts);
  hasInitialized = true;
  markClean();
  updateProjectNameUI();
  updateMobileMenuButton();
  applyModeUI();
  applyPanelVisibility();
  applyZoom();
  ensureDefaultMainStagePart(stagePx);
  updateStage(true);
  ensureSceneSystemInitialized();
  pushHistoryState();
  updateSnakeViewToggleUI();
  refreshCategoryCollapseButtons();
  renderRecentMenuItems();
  renderSceneImportRecentMenuItems();
  render();
}

function savePanelPrefs() {
  try {
    localStorage.setItem(PANEL_PREF_STORAGE_KEY, JSON.stringify({
      left: !!isLeftPanelCollapsed,
    }));
  } catch(_err) {
    // Ignore storage failures.
  }
}

function loadPanelPrefs() {
  try {
    const raw = localStorage.getItem(PANEL_PREF_STORAGE_KEY);
    if(!raw) return;
    const parsed = JSON.parse(raw);
    isLeftPanelCollapsed = !!parsed.left;
    isRightPanelCollapsed = false;
  } catch(_err) {
    isLeftPanelCollapsed = false;
    isRightPanelCollapsed = false;
  }
}

function saveGoogleDriveSettings() {
  try {
    localStorage.setItem(GOOGLE_DRIVE_SETTINGS_STORAGE_KEY, JSON.stringify({
      clientId: String(googleDriveClientId || '').trim(),
      pickerApiKey: String(googlePickerApiKey || '').trim(),
      currentFileId: String(googleDriveCurrentFileId || '').trim(),
      currentFileName: String(googleDriveCurrentFileName || '').trim(),
    }));
  } catch(_err) {
    // Ignore storage failures.
  }
}

function loadGoogleDriveSettings() {
  try {
    const raw = localStorage.getItem(GOOGLE_DRIVE_SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const fromStorage = String((parsed && parsed.clientId) || '').trim();
    googleDriveClientId = fromStorage || String(GOOGLE_DRIVE_CLIENT_ID_DEFAULT || '').trim();
    googlePickerApiKey = String((parsed && parsed.pickerApiKey) || '').trim() || String(GOOGLE_PICKER_API_KEY_DEFAULT || '').trim();
    googleDriveCurrentFileId = String((parsed && parsed.currentFileId) || '').trim();
    googleDriveCurrentFileName = normalizeRiderFileName((parsed && parsed.currentFileName) || '');
  } catch(_err) {
    googleDriveClientId = String(GOOGLE_DRIVE_CLIENT_ID_DEFAULT || '').trim();
    googlePickerApiKey = String(GOOGLE_PICKER_API_KEY_DEFAULT || '').trim();
    googleDriveCurrentFileId = '';
    googleDriveCurrentFileName = '';
  }
}

function normalizeRecentRiderEntry(raw) {
  if(!raw || typeof raw !== 'object') return null;
  const source = raw.source === 'google-drive' ? 'google-drive' : 'local';
  const fileId = String(raw.fileId || '').trim();
  const baseName = String(raw.fileName || raw.name || '').trim();
  const fileName = source === 'google-drive'
    ? normalizeRiderFileName(baseName || 'untitled')
    : (baseName || 'Local file');
  if(source === 'google-drive' && !fileId) return null;
  return {
    id: String(raw.id || `${source}:${fileId || fileName}:${Date.now()}`),
    source,
    fileId,
    fileName,
    localHandleId: source === 'local' ? String(raw.localHandleId || raw.id || '').trim() : '',
    updatedAt: Number(raw.updatedAt) || Date.now(),
  };
}

function getRecentRiderEntryKey(entry) {
  if(!entry) return '';
  if(entry.source === 'google-drive') {
    return `google-drive:${String(entry.fileId || '').trim()}`;
  }
  const handleKey = String(entry.localHandleId || '').trim();
  if(handleKey) return `local:${handleKey}`;
  return `local:${String(entry.fileName || '').trim().toLowerCase()}`;
}

function supportsRecentLocalHandleStore() {
  return typeof indexedDB !== 'undefined';
}

function getRecentLocalHandleDb() {
  if(!supportsRecentLocalHandleStore()) return Promise.resolve(null);
  if(recentLocalHandleDbPromise) return recentLocalHandleDbPromise;
  recentLocalHandleDbPromise = new Promise(resolve => {
    try {
      const req = indexedDB.open(RECENT_LOCAL_HANDLE_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if(!db.objectStoreNames.contains(RECENT_LOCAL_HANDLE_STORE)) {
          db.createObjectStore(RECENT_LOCAL_HANDLE_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch(_err) {
      resolve(null);
    }
  });
  return recentLocalHandleDbPromise;
}

async function setRecentLocalHandle(handleId, fileHandle) {
  const key = String(handleId || '').trim();
  if(!key || !fileHandle) return;
  const db = await getRecentLocalHandleDb();
  if(!db) return;
  await new Promise(resolve => {
    try {
      const tx = db.transaction(RECENT_LOCAL_HANDLE_STORE, 'readwrite');
      tx.objectStore(RECENT_LOCAL_HANDLE_STORE).put(fileHandle, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch(_err) {
      resolve();
    }
  });
}

async function getRecentLocalHandle(handleId) {
  const key = String(handleId || '').trim();
  if(!key) return null;
  const db = await getRecentLocalHandleDb();
  if(!db) return null;
  return await new Promise(resolve => {
    try {
      const tx = db.transaction(RECENT_LOCAL_HANDLE_STORE, 'readonly');
      const req = tx.objectStore(RECENT_LOCAL_HANDLE_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch(_err) {
      resolve(null);
    }
  });
}

async function removeRecentLocalHandle(handleId) {
  const key = String(handleId || '').trim();
  if(!key) return;
  const db = await getRecentLocalHandleDb();
  if(!db) return;
  await new Promise(resolve => {
    try {
      const tx = db.transaction(RECENT_LOCAL_HANDLE_STORE, 'readwrite');
      tx.objectStore(RECENT_LOCAL_HANDLE_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch(_err) {
      resolve();
    }
  });
}

function persistRecentLocalHandleAsync(handleId, fileHandle) {
  setRecentLocalHandle(handleId, fileHandle).catch(() => {
    // Ignore persistence failures and keep recent metadata.
  });
}

function removeRecentLocalHandleAsync(handleId) {
  removeRecentLocalHandle(handleId).catch(() => {
    // Ignore cleanup failures.
  });
}

function saveRecentRiderFiles() {
  try {
    localStorage.setItem(RECENT_RIDER_STORAGE_KEY, JSON.stringify(recentRiderFiles));
  } catch(_err) {
    // Ignore storage failures.
  }
}

function loadRecentRiderFiles() {
  try {
    const raw = localStorage.getItem(RECENT_RIDER_STORAGE_KEY);
    if(!raw) {
      recentRiderFiles = [];
      return;
    }
    const parsed = JSON.parse(raw);
    if(!Array.isArray(parsed)) {
      recentRiderFiles = [];
      return;
    }
    recentRiderFiles = parsed
      .map(normalizeRecentRiderEntry)
      .filter(Boolean)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, RECENT_RIDER_LIMIT);
  } catch(_err) {
    recentRiderFiles = [];
  }
}

function addRecentRiderFile(entry) {
  const normalized = normalizeRecentRiderEntry(entry);
  if(!normalized) return;
  const key = getRecentRiderEntryKey(normalized);
  const removedLocals = [];
  recentRiderFiles = recentRiderFiles.filter(item => {
    const itemKey = getRecentRiderEntryKey(item);
    if(itemKey === key && item.source === 'local' && item.localHandleId) {
      removedLocals.push(item.localHandleId);
    }
    return itemKey !== key;
  });
  removedLocals.forEach(removeRecentLocalHandleAsync);
  normalized.updatedAt = Date.now();
  if(normalized.source === 'local' && !normalized.localHandleId) {
    normalized.localHandleId = normalized.id;
  }
  recentRiderFiles.unshift(normalized);
  if(recentRiderFiles.length > RECENT_RIDER_LIMIT) recentRiderFiles = recentRiderFiles.slice(0, RECENT_RIDER_LIMIT);
  saveRecentRiderFiles();
  renderRecentMenuItems();
  renderSceneImportRecentMenuItems();
  if(normalized.source === 'local' && entry && entry.localFileHandle) {
    persistRecentLocalHandleAsync(normalized.localHandleId || normalized.id, entry.localFileHandle);
  }
}

function clearRecentRiderFiles() {
  recentRiderFiles.forEach(item => {
    if(item && item.source === 'local' && item.localHandleId) removeRecentLocalHandleAsync(item.localHandleId);
  });
  recentRiderFiles = [];
  saveRecentRiderFiles();
  renderRecentMenuItems();
  renderSceneImportRecentMenuItems();
}

function removeRecentRiderById(entryId) {
  const targetId = String(entryId || '').trim();
  if(!targetId) return;
  const removed = recentRiderFiles.find(item => String(item.id || '') === targetId) || null;
  const next = recentRiderFiles.filter(item => String(item.id || '') !== targetId);
  if(next.length === recentRiderFiles.length) return;
  if(removed && removed.source === 'local' && removed.localHandleId) {
    removeRecentLocalHandleAsync(removed.localHandleId);
  }
  recentRiderFiles = next;
  saveRecentRiderFiles();
  renderRecentMenuItems();
  renderSceneImportRecentMenuItems();
}

function renderRecentMenuItems() {
  const list = document.getElementById('file-open-recent-list');
  if(!list) return;
  if(!recentRiderFiles.length) {
    list.innerHTML = '<div style="padding:6px 8px;font-size:11px;color:#7b8693;">No recent files</div>';
    return;
  }
  list.innerHTML = recentRiderFiles.map(item => {
    const sourceLabel = item.source === 'google-drive' ? 'Google Drive' : 'Local';
    const sourceBadgeStyle = item.source === 'google-drive'
      ? 'background:#e6f4ff;color:#0b5c93;border-color:#b6dfff;'
      : 'background:#f3f4f6;color:#475467;border-color:#d9dde3;';
    const title = escapeHtml(String(item.fileName || 'Untitled'));
    return `
      <button class="btn btn-ghost" type="button" data-recent-id="${escapeHtml(item.id)}" style="display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;text-align:left;padding:6px 8px;">
        <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title}</span>
        <span style="font-size:10px;border:1px solid #d0d5dd;border-radius:999px;padding:1px 6px;${sourceBadgeStyle}">${sourceLabel}</span>
      </button>
    `;
  }).join('');
}

function renderSceneImportRecentMenuItems() {
  const list = document.getElementById('scenes-load-recent-list');
  if(!list) return;
  if(!recentRiderFiles.length) {
    list.innerHTML = '<div style="padding:6px 8px;font-size:11px;color:#7b8693;">No recent files</div>';
    return;
  }
  list.innerHTML = recentRiderFiles.map(item => {
    const sourceLabel = item.source === 'google-drive' ? 'Google Drive' : 'Local';
    const sourceBadgeStyle = item.source === 'google-drive'
      ? 'background:#e6f4ff;color:#0b5c93;border-color:#b6dfff;'
      : 'background:#f3f4f6;color:#475467;border-color:#d9dde3;';
    const title = escapeHtml(String(item.fileName || 'Untitled'));
    return `
      <button class="btn btn-ghost" type="button" data-scenes-recent-id="${escapeHtml(item.id)}" style="display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;text-align:left;padding:6px 8px;">
        <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title}</span>
        <span style="font-size:10px;border:1px solid #d0d5dd;border-radius:999px;padding:1px 6px;${sourceBadgeStyle}">${sourceLabel}</span>
      </button>
    `;
  }).join('');
}

async function openRecentRiderById(entryId) {
  const targetId = String(entryId || '').trim();
  if(!targetId) return;
  const entry = recentRiderFiles.find(item => String(item.id || '') === targetId);
  if(!entry) {
    alert('That recent file is no longer available in this list.');
    return;
  }

  if(hasUnsavedChanges && !confirm('You have unsaved changes. Opening a recent file will replace the current layout. Continue?')) return;

  if(entry.source === 'google-drive') {
    try {
      const token = await ensureGoogleDriveAccess(true);
      if(!token) return;
      const loaded = await readRiderFromGoogleDrive(entry.fileId);
      pendingHardLoadUndoSnapshot = captureSnapshot();
      loadRiderFromData(loaded.data);
      setProjectNameFromFileName(loaded.fileName);
      riderSaveLocation = 'google-drive';
      hasRiderSavePreference = true;
      riderSaveDirHandle = null;
      riderFileHandle = null;
      riderLastSavedFileName = normalizeRiderFileName(loaded.fileName || getRiderSaveFileName());
      googleDriveCurrentFileId = String(loaded.fileId || '');
      googleDriveCurrentFileName = riderLastSavedFileName;
      saveGoogleDriveSettings();
      markClean();
      addRecentRiderFile({
        source: 'google-drive',
        fileId: googleDriveCurrentFileId,
        fileName: riderLastSavedFileName,
      });
      return;
    } catch(err) {
      const message = String((err && err.message) || 'Could not open Google Drive file.');
      if(/not\s*found|insufficient|permission|forbidden/i.test(message)) {
        removeRecentRiderById(targetId);
        alert('This Drive file could not be opened (moved, deleted, or no access). It was removed from Recent.');
      } else {
        alert(message);
      }
      return;
    }
  }

  const localHandleId = String(entry.localHandleId || entry.id || '').trim();
  if(localHandleId) {
    try {
      const handle = await getRecentLocalHandle(localHandleId);
      if(handle) {
        if(typeof handle.queryPermission === 'function') {
          const state = await handle.queryPermission({ mode: 'read' });
          if(state !== 'granted') {
            if(typeof handle.requestPermission === 'function') {
              const requestState = await handle.requestPermission({ mode: 'read' });
              if(requestState !== 'granted') throw new Error('Permission to read this local file was denied.');
            } else {
              throw new Error('Permission to read this local file was denied.');
            }
          }
        }

        const file = await handle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        pendingHardLoadUndoSnapshot = captureSnapshot();
        loadRiderFromData(data);
        setProjectNameFromFileName(file.name || entry.fileName || 'untitled');
        riderSaveDirHandle = null;
        riderFileHandle = handle;
        riderLastSavedFileName = normalizeRiderFileName(file.name || entry.fileName || getRiderSaveFileName());
        riderSaveLocation = 'local';
        hasRiderSavePreference = true;
        markClean();
        addRecentRiderFile({
          id: entry.id,
          source: 'local',
          fileName: riderLastSavedFileName,
          localHandleId,
          localFileHandle: handle,
        });
        return;
      }
    } catch(err) {
      const msg = String((err && err.message) || '');
      if(/not\s*found|deleted|permission|denied|gone|unavailable/i.test(msg)) {
        removeRecentRiderById(targetId);
        alert('That local file is no longer available (moved/deleted/no permission). It was removed from Recent.');
        return;
      }
    }
  }

  alert('This local recent entry has no reusable file handle yet. Select it once, and it will open directly from Recent next time.');
  triggerLoadRider({ skipUnsavedPrompt: true });
}

function isGoogleDriveConfigured() {
  return !!String(googleDriveClientId || '').trim();
}

function resetGoogleDriveSession() {
  googleDriveAccessToken = '';
  googleDriveTokenExpiryTs = 0;
  googleDriveTokenClient = null;
}

async function openGoogleDriveSettingsDialog() {
  return await new Promise(resolve => {
    let overlay = document.getElementById('gdrive-settings-modal');
    if(!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'gdrive-settings-modal';
      overlay.className = 'report-modal';
      overlay.innerHTML = `
        <div class="report-dialog" role="dialog" aria-modal="true" aria-labelledby="gdrive-settings-title" style="max-width:620px;">
          <div class="report-dialog-header">
            <h2 id="gdrive-settings-title">Google Drive Settings</h2>
            <p>Set your OAuth Web Client ID once for this app/session environment.</p>
          </div>
          <div class="report-dialog-body">
            <label style="display:grid;gap:6px;">
              <span style="font-size:12px;color:#4f5f73;font-weight:600;">OAuth Client ID</span>
              <input id="gdrive-client-id" class="pselect" type="text" placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com" style="background:#fff;color:#17324f;">
            </label>
            <label style="display:grid;gap:6px;">
              <span style="font-size:12px;color:#4f5f73;font-weight:600;">Google Picker API Key (optional but recommended)</span>
              <input id="gdrive-picker-api-key" class="pselect" type="text" placeholder="AIza..." style="background:#fff;color:#17324f;">
            </label>
            <div style="font-size:12px;color:#4f5f73;line-height:1.45;">
              This value is public-safe in browser apps. Do not paste a client secret here.
            </div>
          </div>
          <div class="report-dialog-actions" style="justify-content:space-between;">
            <button id="gdrive-settings-clear" class="report-btn" type="button">Clear Drive Link</button>
            <div style="display:flex;gap:8px;">
              <button id="gdrive-settings-cancel" class="report-btn" type="button">Cancel</button>
              <button id="gdrive-settings-save" class="report-btn primary" type="button">Save</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const input = document.getElementById('gdrive-client-id');
    const pickerKeyInput = document.getElementById('gdrive-picker-api-key');
    const clearBtn = document.getElementById('gdrive-settings-clear');
    const cancelBtn = document.getElementById('gdrive-settings-cancel');
    const saveBtn = document.getElementById('gdrive-settings-save');
    if(!input || !pickerKeyInput || !clearBtn || !cancelBtn || !saveBtn) {
      resolve(false);
      return;
    }

    const done = result => {
      overlay.classList.remove('open');
      clearBtn.removeEventListener('click', onClear);
      cancelBtn.removeEventListener('click', onCancel);
      saveBtn.removeEventListener('click', onSave);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeyDown);
      resolve(result);
    };

    const onClear = () => {
      googleDriveCurrentFileId = '';
      googleDriveCurrentFileName = '';
      googlePickerApiKey = '';
      riderSaveLocation = 'local';
      hasRiderSavePreference = true;
      saveGoogleDriveSettings();
      done(true);
    };
    const onCancel = () => done(false);
    const onSave = () => {
      const next = String(input.value || '').trim();
      if(!next) {
        alert('Enter a valid OAuth Client ID.');
        return;
      }
      const nextPickerKey = String(pickerKeyInput.value || '').trim();
      googleDriveClientId = next;
      googlePickerApiKey = nextPickerKey;
      resetGoogleDriveSession();
      googlePickerReadyPromise = null;
      saveGoogleDriveSettings();
      done(true);
    };
    const onOverlayClick = e => {
      if(e.target === overlay) done(false);
    };
    const onKeyDown = e => {
      if(!overlay.classList.contains('open')) return;
      if(e.key === 'Escape') {
        e.preventDefault();
        done(false);
      }
    };

    input.value = String(googleDriveClientId || '').trim();
    pickerKeyInput.value = String(googlePickerApiKey || '').trim();
    clearBtn.addEventListener('click', onClear);
    cancelBtn.addEventListener('click', onCancel);
    saveBtn.addEventListener('click', onSave);
    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeyDown);
    overlay.classList.add('open');
    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
  });
}

async function ensureGoogleIdentityScript() {
  if(window.google && window.google.accounts && window.google.accounts.oauth2) return;
  if(googleIdentityScriptPromise) {
    await googleIdentityScriptPromise;
    return;
  }
  googleIdentityScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Google Identity Services script.'));
    document.head.appendChild(script);
  });
  await googleIdentityScriptPromise;
}

async function requestGoogleDriveToken(interactive = true) {
  if(!isGoogleDriveConfigured()) {
    if(!interactive) return null;
    const ok = await openGoogleDriveSettingsDialog();
    if(!ok) return null;
  }

  await ensureGoogleIdentityScript();
  if(!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
    throw new Error('Google Identity Services is unavailable.');
  }

  if(!googleDriveTokenClient) {
    googleDriveTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: googleDriveClientId,
      scope: GOOGLE_DRIVE_SCOPE,
      callback: () => {},
      error_callback: () => {},
    });
  }

  return await new Promise((resolve, reject) => {
    googleDriveTokenClient.callback = response => {
      if(response && response.error) {
        reject(new Error(response.error_description || response.error || 'Google auth failed.'));
        return;
      }
      googleDriveAccessToken = String(response.access_token || '').trim();
      const expiresIn = Math.max(60, parseInt(response.expires_in, 10) || 3600);
      googleDriveTokenExpiryTs = Date.now() + (expiresIn * 1000);
      resolve(googleDriveAccessToken || null);
    };
    googleDriveTokenClient.error_callback = error => {
      reject(new Error((error && (error.message || error.type)) || 'Google auth request failed.'));
    };
    googleDriveTokenClient.requestAccessToken({ prompt: interactive ? 'consent' : '' });
  });
}

async function ensureGoogleDriveAccess(interactive = true) {
  const safetyWindowMs = 60 * 1000;
  if(googleDriveAccessToken && Date.now() < (googleDriveTokenExpiryTs - safetyWindowMs)) {
    return googleDriveAccessToken;
  }
  return await requestGoogleDriveToken(interactive);
}

async function googleDriveApiRequest(url, options = {}) {
  const interactive = options.interactive !== false;
  const token = await ensureGoogleDriveAccess(interactive);
  if(!token) return null;

  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${token}`,
  });
  const requestInit = Object.assign({}, options, { headers });
  let res = await fetch(url, requestInit);

  if((res.status === 401 || res.status === 403) && interactive) {
    googleDriveAccessToken = '';
    googleDriveTokenExpiryTs = 0;
    const refreshed = await ensureGoogleDriveAccess(true);
    if(!refreshed) return null;
    const retryHeaders = Object.assign({}, options.headers || {}, {
      Authorization: `Bearer ${refreshed}`,
    });
    res = await fetch(url, Object.assign({}, options, { headers: retryHeaders }));
  }

  if(!res.ok) {
    let message = `Google Drive request failed (${res.status}).`;
    try {
      const payload = await res.json();
      const apiMessage = payload && payload.error && payload.error.message;
      if(apiMessage) message = apiMessage;
    } catch(_err) {
      // Keep default message.
    }
    throw new Error(message);
  }

  if(res.status === 204) return null;
  const contentType = String(res.headers.get('content-type') || '').toLowerCase();
  if(contentType.includes('application/json')) return await res.json();
  return await res.text();
}

async function listGoogleDriveRiderFiles(searchTerm = '') {
  const baseQuery = [
    `trashed = false`,
    `mimeType = 'application/json'`,
    `name contains '${RIDER_FILE_EXTENSION}'`,
  ];
  const cleanedSearch = String(searchTerm || '').trim().replace(/'/g, "\\'");
  if(cleanedSearch) {
    baseQuery.push(`name contains '${cleanedSearch}'`);
  }
  const q = encodeURIComponent(baseQuery.join(' and '));
  const fields = encodeURIComponent('files(id,name,modifiedTime,size,webViewLink)');
  const orderBy = encodeURIComponent('modifiedTime desc');
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=50&q=${q}&fields=${fields}&orderBy=${orderBy}`;
  const payload = await googleDriveApiRequest(url, { method: 'GET' });
  const files = Array.isArray(payload && payload.files) ? payload.files : [];
  googleDriveKnownFiles = files.map(file => ({
    id: String(file.id || ''),
    name: normalizeRiderFileName(file.name || ''),
    modifiedTime: String(file.modifiedTime || ''),
    size: String(file.size || ''),
    webViewLink: String(file.webViewLink || ''),
  })).filter(file => !!file.id);
  return googleDriveKnownFiles;
}

function escapeGoogleDriveQueryValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function listGoogleDriveFolderEntries(folderId = 'root', searchTerm = '') {
  const safeFolderId = String(folderId || 'root').trim() || 'root';
  const escapedFolderId = escapeGoogleDriveQueryValue(safeFolderId);
  const baseQuery = [
    `trashed = false`,
    `'${escapedFolderId}' in parents`,
    `(mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/json')`,
  ];
  const cleanedSearch = String(searchTerm || '').trim();
  if(cleanedSearch) {
    baseQuery.push(`name contains '${escapeGoogleDriveQueryValue(cleanedSearch)}'`);
  }
  const q = encodeURIComponent(baseQuery.join(' and '));
  const fields = encodeURIComponent('files(id,name,mimeType,modifiedTime,size)');
  const orderBy = encodeURIComponent('folder,name_natural');
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=200&q=${q}&fields=${fields}&orderBy=${orderBy}`;
  const payload = await googleDriveApiRequest(url, { method: 'GET' });
  const files = Array.isArray(payload && payload.files) ? payload.files : [];

  googleDriveKnownFiles = files.map(file => {
    const mimeType = String(file.mimeType || '');
    const name = String(file.name || '');
    const isFolder = mimeType === 'application/vnd.google-apps.folder';
    const isJson = mimeType === 'application/json' || /\.json$/i.test(name);
    return {
      id: String(file.id || ''),
      name: isFolder ? name : normalizeRiderFileName(name),
      modifiedTime: String(file.modifiedTime || ''),
      size: String(file.size || ''),
      mimeType,
      kind: isFolder ? 'folder' : (isJson ? 'file' : 'skip'),
    };
  }).filter(item => !!item.id && item.kind !== 'skip');

  return googleDriveKnownFiles;
}

function formatGoogleDriveFileTimestamp(value) {
  if(!value) return '';
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

function formatGoogleDriveFileSize(value) {
  const num = Number(value);
  if(!Number.isFinite(num) || num <= 0) return '';
  if(num < 1024) return `${num} B`;
  if(num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

async function ensureGoogleApiScript() {
  if(window.gapi && typeof window.gapi.load === 'function') return;
  if(googleApiScriptPromise) {
    await googleApiScriptPromise;
    return;
  }
  googleApiScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Google APIs script.'));
    document.head.appendChild(script);
  });
  await googleApiScriptPromise;
}

function getGoogleCloudProjectNumberFromClientId() {
  const raw = String(googleDriveClientId || '').trim();
  const match = raw.match(/^(\d+)-/);
  return match ? match[1] : '';
}

async function ensureGooglePickerApi() {
  await ensureGoogleApiScript();
  if(window.google && window.google.picker && typeof window.google.picker.PickerBuilder === 'function') return;
  if(googlePickerReadyPromise) {
    await googlePickerReadyPromise;
    return;
  }
  googlePickerReadyPromise = new Promise((resolve, reject) => {
    if(!window.gapi || typeof window.gapi.load !== 'function') {
      reject(new Error('Google API loader is unavailable.'));
      return;
    }
    window.gapi.load('picker', {
      callback: () => resolve(),
      onerror: () => reject(new Error('Could not load Google Picker API.')),
      timeout: 10000,
      ontimeout: () => reject(new Error('Google Picker API load timed out.')),
    });
  });
  await googlePickerReadyPromise;
}

async function openGoogleDrivePickerDialog(options = {}) {
  const mode = options.mode === 'save-as' ? 'save-as' : 'open';
  const folderOnly = !!options.folderOnly;
  const defaultFileName = normalizeRiderFileName(options.defaultFileName || getRiderSaveFileName());
  const token = await ensureGoogleDriveAccess(true);
  if(!token) return null;
  await ensureGooglePickerApi();
  if(!window.google || !window.google.picker || typeof window.google.picker.PickerBuilder !== 'function') {
    throw new Error('Google Picker is unavailable.');
  }

  const picker = window.google.picker;
  const docsView = new picker.DocsView(picker.ViewId.DOCS)
    .setIncludeFolders(true)
    .setSelectFolderEnabled(false)
    .setMimeTypes('application/json');
  const foldersView = new picker.DocsView(picker.ViewId.FOLDERS)
    .setIncludeFolders(true)
    .setSelectFolderEnabled(true);

  let builder = new picker.PickerBuilder()
    .setOAuthToken(token)
    .setOrigin(window.location.origin)
    .setCallback(data => {
      const action = data && data[picker.Response.ACTION];
      if(action === picker.Action.CANCEL) {
        resolver(null);
        return;
      }
      if(action !== picker.Action.PICKED) return;
      const docs = data[picker.Response.DOCUMENTS] || [];
      const first = docs[0] || null;
      if(!first) {
        resolver(null);
        return;
      }

      const docId = String(first[picker.Document.ID] || first.id || '').trim();
      const name = normalizeRiderFileName(String(first[picker.Document.NAME] || first.name || defaultFileName));
      const mimeType = String(first[picker.Document.MIME_TYPE] || first.mimeType || '').trim();
      const isFolder = mimeType === 'application/vnd.google-apps.folder';
      if(folderOnly) {
        if(!docId || !isFolder) {
          resolver(null);
          return;
        }
        resolver({ action: 'select-folder', folderId: docId, folderName: String(first[picker.Document.NAME] || first.name || 'Folder') });
        return;
      }
      if(mode === 'open') {
        if(!docId) {
          resolver(null);
          return;
        }
        resolver({ action: 'open', fileId: docId, fileName: name });
        return;
      }

      if(isFolder) {
        resolver({ action: 'new', fileId: '', fileName: defaultFileName, folderId: docId || 'root' });
      } else {
        resolver({ action: 'overwrite', fileId: docId, fileName: name, folderId: '' });
      }
    });

  const appId = getGoogleCloudProjectNumberFromClientId();
  if(appId) builder = builder.setAppId(appId);
  const apiKey = String(googlePickerApiKey || '').trim();
  if(apiKey) builder = builder.setDeveloperKey(apiKey);

  if(folderOnly) {
    builder = builder.addView(foldersView);
  } else {
    builder = builder.addView(docsView);
    if(mode === 'save-as') {
      builder = builder.addView(foldersView);
    }
  }

  let done = false;
  let resolver = () => {};
  return await new Promise(resolve => {
    resolver = result => {
      if(done) return;
      done = true;
      resolve(result);
    };
    builder.build().setVisible(true);
  });
}

async function openGoogleDriveFolderPickerDialog(options = {}) {
  return await openGoogleDrivePickerDialog(Object.assign({}, options, { mode: 'save-as', folderOnly: true }));
}

async function openGoogleDriveFileDialog(options = {}) {
  return await openGoogleDriveFileDialogLegacy(options);
}

async function openGoogleDriveFileDialogLegacy(options = {}) {
  const mode = options.mode === 'save-as' ? 'save-as' : 'open';
  const defaultFileName = normalizeRiderFileName(options.defaultFileName || getRiderSaveFileName());

  let overlay = document.getElementById('gdrive-file-modal');
  if(!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'gdrive-file-modal';
    overlay.className = 'report-modal';
    overlay.innerHTML = `
      <div class="report-dialog" role="dialog" aria-modal="true" aria-labelledby="gdrive-file-title" style="max-width:760px;">
        <div class="report-dialog-header">
          <h2 id="gdrive-file-title">Google Drive</h2>
          <p id="gdrive-file-subtitle">Choose a Drive file.</p>
        </div>
        <div class="report-dialog-body" style="gap:10px;">
          <div style="display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;">
            <input id="gdrive-file-search" class="pselect" type="text" placeholder="Search current folder" style="background:#fff;color:#17324f;">
            <button id="gdrive-file-browse" class="report-btn" type="button">Browse</button>
            <button id="gdrive-file-refresh" class="report-btn" type="button">Refresh</button>
          </div>
          <div id="gdrive-file-breadcrumb" style="display:flex;flex-wrap:wrap;gap:6px;min-height:20px;align-items:center;"></div>
          <div id="gdrive-file-status" style="font-size:12px;color:#4f5f73;min-height:18px;"></div>
          <div id="gdrive-file-list" style="max-height:45vh;overflow:auto;border:1px solid #d3dbe6;border-radius:10px;background:#fff;"></div>
        </div>
        <div class="report-dialog-actions" style="display:flex;justify-content:space-between;align-items:center;">
          <button id="gdrive-file-new" class="report-btn" type="button">Save New</button>
          <div style="display:flex;gap:8px;">
            <button id="gdrive-file-cancel" class="report-btn" type="button">Cancel</button>
            <button id="gdrive-file-confirm" class="report-btn primary" type="button">Open</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const title = document.getElementById('gdrive-file-title');
  const subtitle = document.getElementById('gdrive-file-subtitle');
  const searchInput = document.getElementById('gdrive-file-search');
  const browseBtn = document.getElementById('gdrive-file-browse');
  const refreshBtn = document.getElementById('gdrive-file-refresh');
  const breadcrumbEl = document.getElementById('gdrive-file-breadcrumb');
  const statusEl = document.getElementById('gdrive-file-status');
  const listEl = document.getElementById('gdrive-file-list');
  const newBtn = document.getElementById('gdrive-file-new');
  const cancelBtn = document.getElementById('gdrive-file-cancel');
  const confirmBtn = document.getElementById('gdrive-file-confirm');
  if(!title || !subtitle || !searchInput || !browseBtn || !refreshBtn || !breadcrumbEl || !statusEl || !listEl || !newBtn || !cancelBtn || !confirmBtn) {
    return null;
  }

  const selection = { fileId: '', fileName: '' };
  const path = [{ id: 'root', name: 'My Drive' }];
  let currentFolderId = 'root';
  let active = true;

  const renderBreadcrumb = () => {
    breadcrumbEl.innerHTML = path.map((item, index) => {
      const isLast = index === (path.length - 1);
      if(isLast) {
        return `<span style="font-size:12px;color:#17324f;font-weight:700;">${escapeHtml(item.name)}</span>`;
      }
      return `<button type="button" data-gdrive-path-index="${index}" style="padding:2px 6px;border:1px solid #c9d7e6;border-radius:999px;background:#fff;color:#245a86;font-size:11px;cursor:pointer;">${escapeHtml(item.name)}</button>`;
    }).join('<span style="color:#8ea1b4;">â€º</span>');
  };

  const renderRows = entries => {
    if(!entries.length) {
      listEl.innerHTML = '<div style="padding:12px;font-size:12px;color:#6b7280;">This folder is empty.</div>';
      return;
    }
    listEl.innerHTML = entries.map(entry => {
      const id = String(entry.id || '');
      const isFolder = entry.kind === 'folder';
      const checked = selection.fileId && selection.fileId === id ? 'border-color:#0f72a8;background:#eaf6ff;' : '';
      const when = formatGoogleDriveFileTimestamp(entry.modifiedTime);
      const size = formatGoogleDriveFileSize(entry.size);
      if(isFolder) {
        return `
          <button type="button" data-gdrive-folder-id="${id}" style="display:block;width:100%;text-align:left;padding:10px 12px;border:0;border-bottom:1px solid #ecf0f5;background:#fff;color:#17324f;cursor:pointer;">
            <div style="font-weight:700;font-size:12px;line-height:1.35;">ðŸ“ ${escapeHtml(entry.name || 'Folder')}</div>
            <div style="font-size:11px;color:#5f6b77;line-height:1.35;">Open folder</div>
          </button>
        `;
      }
      return `
        <button type="button" data-gdrive-file-id="${id}" style="display:block;width:100%;text-align:left;padding:10px 12px;border:0;border-bottom:1px solid #ecf0f5;background:#fff;color:#17324f;cursor:pointer;${checked}">
          <div style="font-weight:700;font-size:12px;line-height:1.35;">${escapeHtml(entry.name || '')}</div>
          <div style="font-size:11px;color:#5f6b77;line-height:1.35;">${escapeHtml(when)}${when && size ? ' Â· ' : ''}${escapeHtml(size)}</div>
        </button>
      `;
    }).join('');
  };

  const setCurrentFolder = (folderId, folderName) => {
    currentFolderId = String(folderId || 'root').trim() || 'root';
    const existingIndex = path.findIndex(item => item.id === currentFolderId);
    if(existingIndex >= 0) {
      path.splice(existingIndex + 1);
    } else {
      path.push({ id: currentFolderId, name: String(folderName || 'Folder') });
    }
    selection.fileId = '';
    selection.fileName = '';
  };

  const loadFiles = async () => {
    statusEl.textContent = 'Loading Drive folder...';
    try {
      const entries = await listGoogleDriveFolderEntries(currentFolderId, searchInput.value || '');
      if(!active) return;
      renderBreadcrumb();
      renderRows(entries);
      const folderCount = entries.filter(item => item.kind === 'folder').length;
      const fileCount = entries.filter(item => item.kind === 'file').length;
      statusEl.textContent = `${folderCount} folder(s), ${fileCount} file(s)`;
    } catch(err) {
      if(!active) return;
      listEl.innerHTML = '<div style="padding:12px;font-size:12px;color:#b24b2d;">Could not load this Drive folder.</div>';
      statusEl.textContent = (err && err.message) ? err.message : 'Could not load Drive folder.';
    }
  };

  return await new Promise(resolve => {
    const done = result => {
      active = false;
      overlay.classList.remove('open');
      searchInput.removeEventListener('input', onSearchInput);
      browseBtn.removeEventListener('click', onBrowseClick);
      refreshBtn.removeEventListener('click', onRefreshClick);
      breadcrumbEl.removeEventListener('click', onBreadcrumbClick);
      listEl.removeEventListener('click', onListClick);
      confirmBtn.removeEventListener('click', onConfirmClick);
      newBtn.removeEventListener('click', onNewClick);
      cancelBtn.removeEventListener('click', onCancelClick);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeyDown);
      resolve(result);
    };

    const onSearchInput = () => {
      loadFiles();
    };
    const onBrowseClick = async () => {
      try {
        const picked = await openGoogleDrivePickerDialog({ mode, defaultFileName });
        if(!picked) return;
        done(picked);
      } catch(err) {
        alert((err && err.message) ? err.message : 'Could not open Google Drive picker.');
      }
    };
    const onRefreshClick = () => {
      loadFiles();
    };
    const onBreadcrumbClick = event => {
      const btn = event.target && event.target.closest && event.target.closest('[data-gdrive-path-index]');
      if(!btn) return;
      const idx = parseInt(btn.getAttribute('data-gdrive-path-index') || '-1', 10);
      if(Number.isNaN(idx) || idx < 0 || idx >= path.length) return;
      path.splice(idx + 1);
      currentFolderId = path[path.length - 1].id;
      selection.fileId = '';
      selection.fileName = '';
      loadFiles();
    };
    const onListClick = event => {
      const folderBtn = event.target && event.target.closest && event.target.closest('[data-gdrive-folder-id]');
      if(folderBtn) {
        const folderId = String(folderBtn.getAttribute('data-gdrive-folder-id') || '');
        const foundFolder = googleDriveKnownFiles.find(item => item.id === folderId && item.kind === 'folder');
        setCurrentFolder(folderId, (foundFolder && foundFolder.name) || 'Folder');
        loadFiles();
        return;
      }
      const btn = event.target && event.target.closest && event.target.closest('[data-gdrive-file-id]');
      if(!btn) return;
      selection.fileId = String(btn.getAttribute('data-gdrive-file-id') || '');
      const found = googleDriveKnownFiles.find(file => file.id === selection.fileId && file.kind === 'file');
      selection.fileName = normalizeRiderFileName((found && found.name) || defaultFileName);
      renderRows(googleDriveKnownFiles);
    };
    const onConfirmClick = () => {
      if(!selection.fileId) {
        alert(mode === 'open' ? 'Select a Google Drive file to open.' : 'Select a file to overwrite, or choose Save New.');
        return;
      }
      done({
        action: mode === 'open' ? 'open' : 'overwrite',
        fileId: selection.fileId,
        fileName: normalizeRiderFileName(selection.fileName || defaultFileName),
        folderId: currentFolderId,
      });
    };
    const onNewClick = () => {
      done({ action: 'new', fileId: '', fileName: defaultFileName, folderId: currentFolderId });
    };
    const onCancelClick = () => done(null);
    const onOverlayClick = event => {
      if(event.target === overlay) done(null);
    };
    const onKeyDown = event => {
      if(!overlay.classList.contains('open')) return;
      if(event.key === 'Escape') {
        event.preventDefault();
        done(null);
      }
    };

    title.textContent = mode === 'open' ? 'Open from Google Drive' : 'Save As to Google Drive';
    subtitle.textContent = mode === 'open'
      ? 'Navigate folders and select a Stage Rider JSON file from Drive.'
      : `Navigate folders, select a file to overwrite, or save a new file named ${defaultFileName}.`;
    confirmBtn.textContent = mode === 'open' ? 'Open' : 'Overwrite Selected';
    newBtn.style.display = mode === 'save-as' ? 'inline-flex' : 'none';
    searchInput.value = '';
    statusEl.textContent = '';
    renderBreadcrumb();
    listEl.innerHTML = '';

    searchInput.addEventListener('input', onSearchInput);
    browseBtn.addEventListener('click', onBrowseClick);
    refreshBtn.addEventListener('click', onRefreshClick);
    breadcrumbEl.addEventListener('click', onBreadcrumbClick);
    listEl.addEventListener('click', onListClick);
    confirmBtn.addEventListener('click', onConfirmClick);
    newBtn.addEventListener('click', onNewClick);
    cancelBtn.addEventListener('click', onCancelClick);
    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeyDown);
    overlay.classList.add('open');
    setTimeout(() => {
      searchInput.focus();
    }, 0);
    loadFiles();
  });
}

async function uploadRiderToGoogleDrive(fileName, data, options = {}) {
  const normalizedName = normalizeRiderFileName(fileName);
  const fileId = String(options.fileId || '').trim();
  const parentFolderId = String(options.parentFolderId || '').trim();
  const metadata = { name: normalizedName, mimeType: 'application/json' };
  if(!fileId && parentFolderId && parentFolderId !== 'root') {
    metadata.parents = [parentFolderId];
  }
  const boundary = `stageDesignerBoundary${Date.now()}`;
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(data, null, 2),
    `--${boundary}--`,
  ].join('\r\n');

  const uploadUrl = fileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(fileId)}?uploadType=multipart&fields=id,name,modifiedTime`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime';
  const method = fileId ? 'PATCH' : 'POST';

  const payload = await googleDriveApiRequest(uploadUrl, {
    method,
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  return {
    id: String((payload && payload.id) || fileId || ''),
    name: normalizeRiderFileName((payload && payload.name) || normalizedName),
  };
}

async function readRiderFromGoogleDrive(fileId) {
  const safeId = String(fileId || '').trim();
  if(!safeId) throw new Error('Missing Google Drive file id.');
  const metadataUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(safeId)}?fields=id,name,modifiedTime,mimeType`;
  const metadata = await googleDriveApiRequest(metadataUrl, { method: 'GET' });
  const contentUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(safeId)}?alt=media`;
  const payload = await googleDriveApiRequest(contentUrl, { method: 'GET' });
  let parsed;
  if(payload && typeof payload === 'object') {
    parsed = payload;
  } else {
    const text = String(payload || '').trim();
    parsed = text ? JSON.parse(text) : {};
  }
  return {
    data: parsed,
    fileId: String((metadata && metadata.id) || safeId),
    fileName: normalizeRiderFileName((metadata && metadata.name) || getRiderSaveFileName()),
  };
}

function applyPanelVisibility() {
  const workspace = document.getElementById('workspace-root');
  isRightPanelCollapsed = false;
  if(workspace) {
    workspace.classList.toggle('left-collapsed', !!isLeftPanelCollapsed);
    workspace.classList.remove('right-collapsed');
  }

  const leftBtn = document.getElementById('toggle-left-panel');
  if(leftBtn) {
    leftBtn.textContent = isLeftPanelCollapsed ? 'â¯' : 'â®';
    leftBtn.setAttribute('aria-label', isLeftPanelCollapsed ? 'Expand left sidebar' : 'Collapse left sidebar');
    leftBtn.setAttribute('title', isLeftPanelCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
  }

  resizeCanvas();
  updateStage(true);
  render();
}

function togglePanel(side) {
  if(side === 'left') {
    isLeftPanelCollapsed = !isLeftPanelCollapsed;
  } else {
    return;
  }
  savePanelPrefs();
  applyPanelVisibility();
}

function updateMobileMenuButton() {
  const btn = document.getElementById('mobile-menu-btn');
  if(!btn) return;
  const isOpen = document.body.classList.contains('mobile-menu-open');
  btn.textContent = isOpen ? 'Ã—' : 'â˜°';
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

function toggleMobileMenu() {
  document.body.classList.toggle('mobile-menu-open');
  updateMobileMenuButton();
}

function closeMobileMenu() {
  if(!document.body.classList.contains('mobile-menu-open')) return;
  document.body.classList.remove('mobile-menu-open');
  updateMobileMenuButton();
}

function closeExportMenu() {
  const menu = document.getElementById('export-menu');
  if(menu) menu.open = false;
}

function closeRiderSaveMenu() {
  const menu = document.getElementById('file-menu');
  if(menu) menu.open = false;
  closeFileOpenFromMenu();
  closeFileOpenRecentMenu();
}

function closeFileOpenFromMenu() {
  const menu = document.getElementById('file-open-from-menu');
  if(menu) menu.open = false;
}

function closeFileOpenRecentMenu() {
  const menu = document.getElementById('file-open-recent-menu');
  if(menu) menu.open = false;
}

function closeLayersMenu() {
  const menu = document.getElementById('layers-menu');
  if(menu) menu.open = false;
}

function closeScenesMenu() {
  const menu = document.getElementById('scenes-menu');
  if(menu) menu.open = false;
  closeScenesLoadFromMenu();
  closeScenesLoadRecentMenu();
}

function closeScenesLoadFromMenu() {
  const menu = document.getElementById('scenes-load-from-menu');
  if(menu) menu.open = false;
}

function closeScenesLoadRecentMenu() {
  const menu = document.getElementById('scenes-load-recent-menu');
  if(menu) menu.open = false;
}

function closeHelpMenu() {
  const menu = document.getElementById('help-menu');
  if(menu) menu.open = false;
}

function updateHeaderMenuPlacement() {
  const viewportPad = 8;
  const submenus = Array.from(document.querySelectorAll('.header-menu-group[open] > .header-submenu'));
  submenus.forEach(menu => {
    menu.classList.remove('open-left');
    const rect = menu.getBoundingClientRect();
    if(rect.right > (window.innerWidth - viewportPad)) {
      menu.classList.add('open-left');
    }
  });

  const nestedMenus = Array.from(document.querySelectorAll('.header-submenu-details[open] > .header-submenu-nested'));
  nestedMenus.forEach(menu => {
    menu.classList.remove('open-left');
    const rect = menu.getBoundingClientRect();
    if(rect.right > (window.innerWidth - viewportPad)) {
      menu.classList.add('open-left');
    }
    const nextRect = menu.getBoundingClientRect();
    if(nextRect.left < viewportPad) {
      menu.classList.remove('open-left');
    }
  });
}

function syncHeaderMenuState(openMenuId) {
  const layersMenu = document.getElementById('layers-menu');
  const riderMenu = document.getElementById('file-menu');
  const scenesMenu = document.getElementById('scenes-menu');
  const helpMenu = document.getElementById('help-menu');
  if(openMenuId === 'layers-menu' && layersMenu && layersMenu.open) closeRiderSaveMenu();
  if(openMenuId === 'file-menu' && riderMenu && riderMenu.open) {
    closeLayersMenu();
    closeScenesMenu();
    closeHelpMenu();
  }
  if(openMenuId === 'scenes-menu' && scenesMenu && scenesMenu.open) {
    closeLayersMenu();
    closeRiderSaveMenu();
    closeHelpMenu();
  }
  if(openMenuId === 'help-menu' && helpMenu && helpMenu.open) {
    closeLayersMenu();
    closeRiderSaveMenu();
    closeScenesMenu();
  }
  if(openMenuId === 'file-open-from-menu') closeFileOpenRecentMenu();
  if(openMenuId === 'file-open-recent-menu') {
    closeFileOpenFromMenu();
    renderRecentMenuItems();
  }
  if(openMenuId === 'scenes-load-from-menu') closeScenesLoadRecentMenu();
  if(openMenuId === 'scenes-load-recent-menu') {
    closeScenesLoadFromMenu();
    renderSceneImportRecentMenuItems();
  }
  requestAnimationFrame(updateHeaderMenuPlacement);
}

function runRiderMenuAction(action) {
  if(action === 'load') return runFileMenuAction('open-local');
  if(action === 'save-as') return runFileMenuAction('save-as');
  return runFileMenuAction('save');
}

async function runSceneMenuAction(action) {
  closeScenesMenu();
  if(action === 'create') {
    createSceneFromCurrent();
    return;
  }
  if(action === 'delete') {
    deleteCurrentScene();
    return;
  }
  if(action === 'clear-scene') {
    clearCurrentScene();
    return;
  }
  if(action === 'clear-load-recent') {
    if(!recentRiderFiles.length) return;
    if(!confirm('Clear all recent files?')) return;
    clearRecentRiderFiles();
    return;
  }
  if(action === 'load-as-scenes-local') {
    triggerLoadScenesFromFile();
    return;
  }
  if(action === 'load-as-scenes-google-drive') {
    await loadScenesFromGoogleDrive();
  }
}

function runHelpMenuAction(topic) {
  closeHelpMenu();
  openHelpTopicDialog(topic);
}

async function runFileMenuAction(action) {
  closeRiderSaveMenu();
  if(action === 'open-local') {
    triggerLoadRider();
    return;
  }
  if(action === 'clear-recent') {
    if(!recentRiderFiles.length) return;
    if(!confirm('Clear all recent files?')) return;
    clearRecentRiderFiles();
    return;
  }
  if(action === 'open-google-drive') {
    if(hasUnsavedChanges && !confirm('You have unsaved changes. Opening from Google Drive will replace the current layout. Continue?')) return;
    try {
      const token = await ensureGoogleDriveAccess(true);
      if(!token) return;
      const choice = await openGoogleDriveFileDialog({ mode: 'open' });
      if(!choice || choice.action !== 'open' || !choice.fileId) return;
      const loaded = await readRiderFromGoogleDrive(choice.fileId);
      pendingHardLoadUndoSnapshot = captureSnapshot();
      loadRiderFromData(loaded.data);
      setProjectNameFromFileName(loaded.fileName);
      riderSaveLocation = 'google-drive';
      hasRiderSavePreference = true;
      riderSaveDirHandle = null;
      riderFileHandle = null;
      riderLastSavedFileName = normalizeRiderFileName(loaded.fileName || getRiderSaveFileName());
      googleDriveCurrentFileId = String(loaded.fileId || '');
      googleDriveCurrentFileName = riderLastSavedFileName;
      saveGoogleDriveSettings();
      markClean();
      addRecentRiderFile({
        source: 'google-drive',
        fileId: googleDriveCurrentFileId,
        fileName: riderLastSavedFileName,
      });
    } catch(err) {
      alert((err && err.message) ? err.message : 'Could not open file from Google Drive.');
    }
    return;
  }
  if(action === 'save') {
    saveRiderFromFileMenu(false);
    return;
  }
  if(action === 'save-as') {
    saveRiderFromFileMenu(true);
    return;
  }
  if(action === 'google-drive-settings') {
    await openGoogleDriveSettingsDialog();
    return;
  }
  if(action === 'undo') {
    undoAction();
    return;
  }
  if(action === 'clear') {
    clearAll();
    return;
  }
  if(action === 'export-png') {
    runExportAction('png');
    return;
  }
  if(action === 'export-pdf') {
    runExportAction('pdf');
    return;
  }
}

function onRecentMenuClick(event) {
  const btn = event && event.target && event.target.closest ? event.target.closest('[data-recent-id]') : null;
  if(!btn) return;
  const entryId = String(btn.getAttribute('data-recent-id') || '').trim();
  if(!entryId) return;
  openRecentRiderById(entryId);
}

function onScenesRecentMenuClick(event) {
  const btn = event && event.target && event.target.closest ? event.target.closest('[data-scenes-recent-id]') : null;
  if(!btn) return;
  const entryId = String(btn.getAttribute('data-scenes-recent-id') || '').trim();
  if(!entryId) return;
  openRecentRiderScenesById(entryId);
}

function handleDocumentClickForMobileMenu(e) {
  const t = e.target;
  if(document.body.classList.contains('mobile-menu-open')) {
    const btn = document.getElementById('mobile-menu-btn');
    const pop = document.getElementById('header-menu-popover');
    if((btn && btn.contains(t)) || (pop && pop.contains(t))) return;
    closeMobileMenu();
  }
  const exportMenu = document.getElementById('export-menu');
  if(exportMenu && exportMenu.open && !exportMenu.contains(t)) closeExportMenu();
  const riderMenu = document.getElementById('file-menu');
  if(riderMenu && riderMenu.open && !riderMenu.contains(t)) closeRiderSaveMenu();
  const scenesMenu = document.getElementById('scenes-menu');
  if(scenesMenu && scenesMenu.open && !scenesMenu.contains(t)) closeScenesMenu();
  const helpMenu = document.getElementById('help-menu');
  if(helpMenu && helpMenu.open && !helpMenu.contains(t)) closeHelpMenu();
}

window.addEventListener('resize', () => {
  requestAnimationFrame(updateHeaderMenuPlacement);
});

function cloneSceneState(state) {
  const raw = state && typeof state === 'object' ? state : {};
  return {
    ...raw,
    instruments: cloneInstruments(Array.isArray(raw.instruments) ? raw.instruments : []),
    connections: cloneConnections(Array.isArray(raw.connections) ? raw.connections : []),
    stageParts: cloneStageParts(Array.isArray(raw.stageParts) ? raw.stageParts : []),
  };
}

function captureSceneState() {
  const snapshot = captureSnapshot();
  delete snapshot.projectName;
  return cloneSceneState(snapshot);
}

function getActiveSceneIndex() {
  return scenes.findIndex(scene => scene.id === activeSceneId);
}

function getActiveScene() {
  const idx = getActiveSceneIndex();
  return idx >= 0 ? scenes[idx] : null;
}

function ensureSceneSystemInitialized() {
  if(Array.isArray(scenes) && scenes.length > 0 && getActiveScene()) {
    renderSceneTabs();
    return;
  }
  const firstId = 1;
  sceneIdCounter = Math.max(sceneIdCounter || 0, firstId);
  scenes = [{
    id: firstId,
    name: `Scene ${indexToLetters(1)}`,
    state: captureSceneState(),
  }];
  activeSceneId = firstId;
  renderSceneTabs();
}

function getNextDefaultSceneName() {
  const existing = new Set(scenes.map(scene => String(scene.name || '').trim().toLowerCase()));
  let idx = 1;
  while(idx < 5000) {
    const candidate = `Scene ${indexToLetters(idx)}`;
    if(!existing.has(candidate.toLowerCase())) return candidate;
    idx += 1;
  }
  return `Scene ${Date.now()}`;
}

function saveCurrentSceneState() {
  const current = getActiveScene();
  if(!current) return;
  current.state = captureSceneState();
}

function resetHistoryForCurrentScene() {
  historyStack = [captureSnapshot()];
  redoStack = [];
}

function applySceneById(sceneId, options) {
  const target = scenes.find(scene => scene.id === sceneId);
  if(!target) return;
  const shouldResetHistory = !(options && options.resetHistory === false);
  const snapshot = {
    ...cloneSceneState(target.state),
    projectName,
  };
  applySnapshot(snapshot, false, true);
  if(shouldResetHistory) resetHistoryForCurrentScene();
  renderSceneTabs();
}

function switchToScene(sceneId) {
  const nextId = Number(sceneId) || 0;
  if(!nextId || nextId === activeSceneId) return;
  saveCurrentSceneState();
  activeSceneId = nextId;
  applySceneById(nextId);
}

function moveSceneTab(sceneId, targetSceneId, placeAfter) {
  const fromId = Number(sceneId) || 0;
  const targetId = Number(targetSceneId) || 0;
  if(!fromId || !targetId || fromId === targetId) return;
  const fromIndex = scenes.findIndex(scene => scene.id === fromId);
  const targetIndex = scenes.findIndex(scene => scene.id === targetId);
  if(fromIndex < 0 || targetIndex < 0) return;

  const snapshot = captureSnapshot();
  saveCurrentSceneState();
  const [moving] = scenes.splice(fromIndex, 1);
  let insertIndex = scenes.findIndex(scene => scene.id === targetId);
  if(insertIndex < 0) insertIndex = scenes.length;
  if(placeAfter) insertIndex += 1;
  if(insertIndex < 0) insertIndex = 0;
  if(insertIndex > scenes.length) insertIndex = scenes.length;
  scenes.splice(insertIndex, 0, moving);
  commitSnapshotBeforeChange(snapshot);
  renderSceneTabs();
  markDirty();
}

function renderSceneTabs() {
  const bar = document.getElementById('scene-tabs-bar');
  if(!bar) return;
  if(!Array.isArray(scenes) || scenes.length <= 1) {
    bar.classList.remove('visible');
    bar.innerHTML = '';
    return;
  }

  bar.classList.add('visible');
  bar.innerHTML = '';
  scenes.forEach((scene, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `scene-tab${scene.id === activeSceneId ? ' active' : ''}`;
    tab.textContent = `${index + 1}. ${String(scene.name || `Scene ${indexToLetters(index + 1)}`)}`;
    tab.dataset.sceneId = String(scene.id);
    tab.draggable = true;
    tab.addEventListener('click', () => switchToScene(scene.id));
    tab.addEventListener('dblclick', () => {
      const next = prompt('Rename scene', String(scene.name || ''));
      if(next == null) return;
      const cleaned = String(next).trim();
      if(!cleaned) return;
      const snapshot = captureSnapshot();
      if(cleaned === String(scene.name || '')) return;
      scene.name = cleaned;
      commitSnapshotBeforeChange(snapshot);
      renderSceneTabs();
      markDirty();
    });
    tab.addEventListener('dragstart', e => {
      sceneTabDragId = scene.id;
      tab.classList.add('dragging');
      if(e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(scene.id));
      }
    });
    tab.addEventListener('dragend', () => {
      sceneTabDragId = null;
      tab.classList.remove('dragging');
    });
    tab.addEventListener('dragover', e => {
      e.preventDefault();
      if(e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    });
    tab.addEventListener('drop', e => {
      e.preventDefault();
      const draggingId = Number(sceneTabDragId || 0);
      if(!draggingId || draggingId === scene.id) return;
      const rect = tab.getBoundingClientRect();
      const placeAfter = e.clientX > (rect.left + (rect.width / 2));
      moveSceneTab(draggingId, scene.id, placeAfter);
    });
    bar.appendChild(tab);
  });
}

function createSceneFromCurrent() {
  ensureSceneSystemInitialized();
  const snapshot = captureSnapshot();
  saveCurrentSceneState();
  const source = getActiveScene();
  const sourceState = source ? cloneSceneState(source.state) : captureSceneState();
  sceneIdCounter = Math.max(sceneIdCounter, ...scenes.map(scene => scene.id || 0)) + 1;
  const newScene = {
    id: sceneIdCounter,
    name: getNextDefaultSceneName(),
    state: sourceState,
  };
  const currentIndex = Math.max(0, getActiveSceneIndex());
  scenes.splice(currentIndex + 1, 0, newScene);
  activeSceneId = newScene.id;
  applySceneById(newScene.id, { resetHistory: false });
  commitSnapshotBeforeChange(snapshot);
  markDirty();
}

function deleteCurrentScene() {
  ensureSceneSystemInitialized();
  if(scenes.length <= 1) {
    alert('At least one scene is required.');
    return;
  }
  const currentIndex = getActiveSceneIndex();
  if(currentIndex < 0) return;
  const current = scenes[currentIndex];
  const sceneNumber = currentIndex + 1;
  const sceneName = String(current.name || `Scene ${indexToLetters(sceneNumber)}`);
  const ok = confirm(`Are you sure you want to delete scene ${sceneNumber}: ${sceneName}?`);
  if(!ok) return;

  const snapshot = captureSnapshot();
  saveCurrentSceneState();
  scenes.splice(currentIndex, 1);
  const nextIndex = Math.max(0, Math.min(currentIndex, scenes.length - 1));
  activeSceneId = scenes[nextIndex].id;
  applySceneById(activeSceneId, { resetHistory: false });
  commitSnapshotBeforeChange(snapshot);
  markDirty();
}

function getModeHintText() {
  if(isStageBuilderMode) return 'Stage Builder: add shapes, drag to position, and edit size/color on the right panel';
  return 'Drag from palette Â· Click source pin then destination pin Â· Drop on left sidebar to delete';
}

function getPrimaryStagePart() {
  return stageParts.find(p => !!p.isPrimary) || null;
}

function ensureDefaultMainStagePart(frame = stagePx) {
  if(!showMainStage) return null;
  const existing = getPrimaryStagePart();
  if(existing) return existing;
  const f = normalizeStageFrame(frame);
  if(!f) return null;
  const part = {
    id: ++stagePartIdCounter,
    shape: 'rect',
    isPrimary: true,
    label: 'WORK STAGE',
    x: f.left,
    y: f.top,
    stageNX: 0,
    stageNY: 0,
    widthM: Math.max(2, Math.min(80, Number(stageW) || 7.5)),
    depthM: Math.max(2, Math.min(50, Number(stageD) || 4.4)),
    color: /^#[0-9a-fA-F]{6}$/.test(String(stageColor || '')) ? stageColor : DEFAULT_STAGE_COLOR,
    hasSteps: false,
  };
  stageParts.unshift(part);
  return part;
}

function ensureDefaultStageStairsPart(frame = stagePx) {
  if(suppressBuiltInStairsPart) return null;
  if(!showMainStage) return null;
  const f = normalizeStageFrame(frame);
  if(!f) return null;
  let part = stageParts.find(p => String(p.label || '').trim().toUpperCase() === 'STAIRS' && p.shape === 'rect');
  const stairsWidthM = 2;
  const stairsDepthM = 0.75;
  const widthPx = Math.min(f.width, stairsWidthM * pxPerM);
  const depthPx = Math.min(f.height, stairsDepthM * pxPerM);
  const x = f.left + ((f.width - widthPx) / 2);
  const y = f.top + f.height - depthPx;
  if(!part) {
    part = {
      id: ++stagePartIdCounter,
      shape: 'rect',
      isPrimary: false,
      label: 'STAIRS',
      x,
      y,
      stageNX: (x - f.left) / f.width,
      stageNY: (y - f.top) / f.height,
      widthM: stairsWidthM,
      depthM: stairsDepthM,
      color: '#d8a35a',
      hasSteps: true,
    };
    const primaryIndex = stageParts.findIndex(p => !!p.isPrimary);
    if(primaryIndex >= 0) stageParts.splice(primaryIndex + 1, 0, part);
    else stageParts.unshift(part);
    return part;
  }
  part.x = x;
  part.y = y;
  part.stageNX = (x - f.left) / f.width;
  part.stageNY = (y - f.top) / f.height;
  part.widthM = stairsWidthM;
  part.depthM = stairsDepthM;
  part.color = '#d8a35a';
  part.hasSteps = true;
  return part;
}

function syncPrimaryPartFromStageSettings(part, frame = stagePx) {
  if(!part) return;
  const f = normalizeStageFrame(frame);
  if(!f) return;
  part.isPrimary = true;
  part.shape = 'rect';
  part.label = String(part.label || 'WORK STAGE');
  part.widthM = Math.max(2, Math.min(80, Number(stageW) || 7.5));
  part.depthM = Math.max(2, Math.min(50, Number(stageD) || 4.4));
  part.color = /^#[0-9a-fA-F]{6}$/.test(String(stageColor || '')) ? stageColor : DEFAULT_STAGE_COLOR;
  part.hasSteps = false;
  part.x = f.left;
  part.y = f.top;
  part.stageNX = 0;
  part.stageNY = 0;
}

function syncStageSettingsFromPrimaryPart(part) {
  if(!part) return;
  stageW = Math.max(2, Math.min(80, parseFloat(part.widthM) || stageW || 7.5));
  stageD = Math.max(2, Math.min(50, parseFloat(part.depthM) || stageD || 4.4));
  if(/^#[0-9a-fA-F]{6}$/.test(String(part.color || ''))) stageColor = part.color;
  showStageStairs = false;
}

function updateModeToggleButton() {
  const labels = isStageBuilderMode ? 'Stage Builder: ON' : 'Stage Builder: OFF';
  const ids = ['mode-toggle-sidebar', 'mode-toggle-mobile'];
  ids.forEach(id => {
    const btn = document.getElementById(id);
    if(!btn) return;
    btn.textContent = labels;
    btn.classList.add('btn-ghost');
    btn.classList.remove('btn-primary');
    btn.classList.toggle('mode-toggle-active', isStageBuilderMode);
  });
}

function updateSelectionPanels() {
  const noSel = document.getElementById('no-sel');
  const propFields = document.getElementById('prop-fields');
  const stagePartFields = document.getElementById('stage-part-fields');
  if(!noSel || !propFields || !stagePartFields) return;

  if(isStageBuilderMode) {
    propFields.style.display = 'none';
    if(selectedStagePartId) {
      noSel.style.display = 'none';
      stagePartFields.style.display = 'block';
    } else {
      noSel.style.display = '';
      noSel.textContent = 'Select a stage shape';
      stagePartFields.style.display = 'none';
    }
    return;
  }

  stagePartFields.style.display = 'none';
  noSel.textContent = 'Select an item';
  if(selectedId) {
    noSel.style.display = 'none';
    propFields.style.display = 'block';
  } else {
    noSel.style.display = '';
    propFields.style.display = 'none';
  }
}

function applyModeUI() {
  document.body.classList.toggle('stage-builder-mode', !!isStageBuilderMode);
  updateModeToggleButton();
  const hint = document.getElementById('stage-hint');
  if(hint) hint.textContent = getModeHintText();
  if(isStageBuilderMode) {
    selectedId = null;
    connectingFrom = null;
    drawingLine = null;
    hoveredConnectionId = null;
  } else {
    selectedStagePartId = null;
  }
  updateSelectionPanels();
  updateClasses();
  render();
}

function toggleStageBuilderMode() {
  pushHistoryState();
  isStageBuilderMode = !isStageBuilderMode;
  markDirty();
  applyModeUI();
}

function addStagePart(shape) {
  const nextShape = shape === 'circle' ? 'circle' : 'rect';
  pushHistoryState();
  const baseWidth = nextShape === 'circle' ? 2.2 : 3.4;
  const baseDepth = nextShape === 'circle' ? 2.2 : 2.2;
  const id = ++stagePartIdCounter;
  const part = {
    id,
    shape: nextShape,
    x: stagePx.left + (stagePx.width * 0.5) - ((baseWidth * pxPerM) / 2),
    y: stagePx.top + (stagePx.height * 0.5) - ((baseDepth * pxPerM) / 2),
    stageNX: null,
    stageNY: null,
    widthM: baseWidth,
    depthM: baseDepth,
    label: nextShape === 'circle' ? 'ROOM CIRCLE' : 'ROOM',
    color: '#7da7c8',
    hasSteps: false,
    isPrimary: false,
  };
  syncStagePartNormFromWorld(part, stagePx);
  stageParts.push(part);
  renderStagePart(part);
  selectStagePart(id);
  markDirty();
  render();
}

function renderStagePart(part) {
  if(!part || part.isPrimary) {
    const oldPrimaryEl = part ? getStagePartEl(part.id) : null;
    if(oldPrimaryEl) oldPrimaryEl.remove();
    return;
  }
  const wrap = document.getElementById('canvas-wrap');
  const old = getStagePartEl(part.id);
  if(old) old.remove();
  const el = document.createElement('div');
  el.className = `stage-part shape-${part.shape}`;
  el.id = `stage-part-${part.id}`;
  el.dataset.id = String(part.id);
  const widthPx = Math.max(16, (Math.max(0.5, Number(part.widthM) || 1) * pxPerM));
  const depthPx = Math.max(16, (Math.max(0.5, Number(part.depthM) || 1) * pxPerM));
  el.style.width = `${widthPx}px`;
  el.style.height = `${depthPx}px`;
  el.style.setProperty('--part-color', String(part.color || '#7da7c8'));
  el.classList.toggle('has-steps', !!part.hasSteps);
  positionWorldElement(el, part.x, part.y);
  const label = String(part.label || (part.shape === 'circle' ? 'ROOM CIRCLE' : 'ROOM'));
  const labelEl = document.createElement('div');
  labelEl.className = 'part-label';
  labelEl.textContent = label;
  el.textContent = '';
  el.appendChild(labelEl);

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    startStagePartDrag(e, part.id, el);
  });
  el.addEventListener('touchstart', e => {
    if(e.cancelable) e.preventDefault();
    e.stopPropagation();
    startStagePartDrag(e, part.id, el);
  }, { passive: false });

  wrap.appendChild(el);
}

function reorderSelectedItem(step) {
  const isStageItem = isStageBuilderMode && selectedStagePartId !== null;
  const isInstrumentItem = !isStageBuilderMode && selectedId !== null;
  const list = isStageItem ? stageParts : (isInstrumentItem ? instruments : null);
  const selected = isStageItem ? selectedStagePartId : (isInstrumentItem ? selectedId : null);
  if(!list || selected === null) return;

  let changed = false;
  if(isInstrumentItem) {
    const selectedIds = new Set(getWirelessSelectionIds(selected));
    const selectedItems = list.filter(item => selectedIds.has(item.id));
    if(!selectedItems.length) return;

    if(step === 'front') {
      const rest = list.filter(item => !selectedIds.has(item.id));
      if(rest.length !== list.length) {
        list.splice(0, list.length, ...rest, ...selectedItems);
        changed = true;
      }
    } else if(step === 'back') {
      const rest = list.filter(item => !selectedIds.has(item.id));
      if(rest.length !== list.length) {
        list.splice(0, list.length, ...selectedItems, ...rest);
        changed = true;
      }
    } else if(step === 'forward') {
      for(let i = list.length - 2; i >= 0; i--) {
        const a = list[i];
        const b = list[i + 1];
        if(selectedIds.has(a.id) && !selectedIds.has(b.id)) {
          list[i] = b;
          list[i + 1] = a;
          changed = true;
        }
      }
    } else if(step === 'backward') {
      for(let i = 1; i < list.length; i++) {
        const a = list[i - 1];
        const b = list[i];
        if(!selectedIds.has(a.id) && selectedIds.has(b.id)) {
          list[i - 1] = b;
          list[i] = a;
          changed = true;
        }
      }
    }
  } else {
    const idx = list.findIndex(item => item.id === selected);
    if(idx < 0) return;

    let targetIdx = idx;
    if(step === 'front') targetIdx = list.length - 1;
    else if(step === 'back') targetIdx = 0;
    else if(step === 'forward') targetIdx = Math.min(list.length - 1, idx + 1);
    else if(step === 'backward') targetIdx = Math.max(0, idx - 1);
    if(targetIdx === idx) return;

    const [item] = list.splice(idx, 1);
    list.splice(targetIdx, 0, item);
    changed = true;
  }

  if(!changed) return;

  pushHistoryState();
  markDirty();
  instruments.forEach(renderInstrument);
  stageParts.forEach(renderStagePart);
  updateClasses();
  render();
}

function layerAction(action) {
  closeLayersMenu();
  reorderSelectedItem(action);
}

function populateStagePartFields(part) {
  const label = document.getElementById('sp-label');
  const shape = document.getElementById('sp-shape');
  const width = document.getElementById('sp-width');
  const depth = document.getElementById('sp-depth');
  const color = document.getElementById('sp-color');
  const steps = document.getElementById('sp-steps');
  const stepsWrap = document.getElementById('sp-steps-wrap');
  if(!label || !shape || !width || !depth || !color || !steps || !stepsWrap) return;
  label.value = String(part.label || '');
  shape.value = part.shape === 'circle' ? 'Circle' : 'Rectangle';
  width.value = Number(part.widthM || 1).toFixed(2);
  depth.value = Number(part.depthM || 1).toFixed(2);
  color.value = /^#[0-9a-fA-F]{6}$/.test(String(part.color || '')) ? part.color : '#7da7c8';
  steps.checked = !!part.hasSteps;
  stepsWrap.style.display = part.shape === 'rect' ? '' : 'none';
}

function selectStagePart(id) {
  selectedStagePartId = id;
  selectedId = null;
  const part = stageParts.find(p => p.id === id);
  if(!part) {
    updateSelectionPanels();
    updateClasses();
    return;
  }
  populateStagePartFields(part);
  updateSelectionPanels();
  updateClasses();
}

function updStagePartDimension(field, value) {
  if(!selectedStagePartId) return;
  const part = stageParts.find(p => p.id === selectedStagePartId);
  if(!part) return;
  const next = Math.max(0.5, Math.min(120, parseFloat(value) || 0));
  if(!Number.isFinite(next)) return;
  if(Math.abs((Number(part[field]) || 0) - next) < 0.001) return;
  pushHistoryState();
  part[field] = next;
  if(part.isPrimary) {
    syncStageSettingsFromPrimaryPart(part);
    const dimW = document.getElementById('dim-w');
    const dimD = document.getElementById('dim-d');
    if(dimW) dimW.value = String(stageW);
    if(dimD) dimD.value = String(stageD);
    updateStage(true);
    return;
  }
  markDirty();
  renderStagePart(part);
  updateClasses();
}

function updStagePartColor(value) {
  if(!selectedStagePartId) return;
  const part = stageParts.find(p => p.id === selectedStagePartId);
  if(!part) return;
  const next = /^#[0-9a-fA-F]{6}$/.test(String(value || '')) ? String(value) : '#7da7c8';
  if(part.color === next) return;
  pushHistoryState();
  part.color = next;
  if(part.isPrimary) {
    stageColor = next;
    applyStageColor();
    updateStage(true);
    markDirty();
    return;
  }
  markDirty();
  renderStagePart(part);
  updateClasses();
}

function updStagePartSteps(enabled) {
  if(!selectedStagePartId) return;
  const part = stageParts.find(p => p.id === selectedStagePartId);
  if(!part || part.shape !== 'rect') return;
  const next = !!enabled;
  if(!!part.hasSteps === next) return;
  pushHistoryState();
  part.hasSteps = next;
  if(part.isPrimary) {
    showStageStairs = next;
    applyStageStairs();
    updateStage(true);
    markDirty();
    return;
  }
  markDirty();
  renderStagePart(part);
  updateClasses();
}

function updStagePartLabel(value) {
  if(!selectedStagePartId) return;
  const part = stageParts.find(p => p.id === selectedStagePartId);
  if(!part) return;
  const next = String(value || '').trim() || (part.isPrimary ? 'WORK STAGE' : (part.shape === 'circle' ? 'ROOM CIRCLE' : 'ROOM'));
  if(String(part.label || '') === next) return;
  pushHistoryState();
  part.label = next;
  if(part.isPrimary) {
    const stageName = document.getElementById('stage-name');
    if(stageName) stageName.textContent = next;
    markDirty();
    return;
  }
  markDirty();
  renderStagePart(part);
  updateClasses();
}

function deleteStagePart(id) {
  const targetId = Number(id);
  const target = stageParts.find(p => p.id === targetId);
  if(target && target.isPrimary) {
    showMainStage = false;
  }
  if(target && String(target.label || '').trim().toUpperCase() === 'STAIRS') {
    suppressBuiltInStairsPart = true;
  }
  const el = getStagePartEl(targetId);
  if(el) el.remove();
  stageParts = stageParts.filter(p => p.id !== targetId);
  if(selectedStagePartId === targetId) selectedStagePartId = null;
  updateSelectionPanels();
  updateClasses();
  updateStage(true);
  markDirty();
}

function startStagePartDrag(ev, id, el) {
  if(!isStageBuilderMode) return;
  const part = stageParts.find(p => p.id === id);
  if(!part) return;
  const dragSnapshot = captureSnapshot();
  const wr = document.getElementById('canvas-wrap').getBoundingClientRect();
  const p0 = getClientPointFromEvent(ev);
  if(!p0) return;
  const pointerWorldStartX = (p0.clientX - wr.left - panX) / zoomLevel;
  const pointerWorldStartY = (p0.clientY - wr.top - panY) / zoomLevel;
  const offsetWorldX = pointerWorldStartX - part.x;
  const offsetWorldY = pointerWorldStartY - part.y;
  const isTouchStart = String((ev && ev.type) || '').startsWith('touch');
  const startClientX = p0.clientX;
  const startClientY = p0.clientY;
  let dragStarted = !isTouchStart;
  let moved = false;

  function onMove(e) {
    const p = getClientPointFromEvent(e);
    if(!p) return;
    if(isTouchStart && !dragStarted) {
      const travel = Math.hypot(p.clientX - startClientX, p.clientY - startClientY);
      if(travel < TOUCH_DRAG_START_THRESHOLD_PX) return;
      dragStarted = true;
    }
    if(e.cancelable) e.preventDefault();
    part.x = ((p.clientX - wr.left - panX) / zoomLevel) - offsetWorldX;
    part.y = ((p.clientY - wr.top - panY) / zoomLevel) - offsetWorldY;
    syncStagePartNormFromWorld(part, stagePx);
    positionWorldElement(el, part.x, part.y);
    moved = true;
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
    document.removeEventListener('touchcancel', onUp);
    if(moved) {
      commitSnapshotBeforeChange(dragSnapshot);
      markDirty();
    }
    selectStagePart(id);
    render();
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onUp, { passive: false });
  document.addEventListener('touchcancel', onUp, { passive: false });
}

function runExportAction(action) {
  closeExportMenu();
  if(action === 'png') {
    exportPNG();
    return;
  }
  if(action === 'report') {
    openReportOptionsDialog(false);
    return;
  }
  if(action === 'pdf') {
    openReportOptionsDialog(true);
  }
}

const HELP_TOPIC_ORDER = ['files', 'arrange', 'scenes', 'report', 'snakes-stageboxes-mixers', 'outlets'];

const HELP_TOPICS = {
  'files': {
    title: 'Files',
    intro: 'How to load and save projects, and where files can be stored.',
    bullets: [
      'Open local file: File > Open from > Local opens a project from your computer.',
      'Open from Google Drive: File > Open from > Google Drive loads a project from Drive.',
      'Open Recent: File > Open Recent shows your latest local/Drive projects.',
      'Save writes changes back to the current target when available.',
      'Save As lets you choose a new file target and name.',
      'Export PNG creates a stage image snapshot.',
      'Export PDF opens the report setup flow and generates the full PDF report.',
      'Clear Recent removes recent-file shortcuts only, not the actual files.',
    ],
    note: 'Tip: Project name in the header is used to build default save/export names.'
  },
  'arrange': {
    title: 'Arrange',
    intro: 'How layer ordering buttons affect selected items.',
    bullets: [
      'Bring Forward moves the selected item up by one layer.',
      'Bring to Front moves the selected item to the topmost layer.',
      'Send Backward moves the selected item down by one layer.',
      'Send to Back moves the selected item to the bottom layer.',
      'Use Arrange after selecting an item on stage.',
      'Layer order affects visibility when items overlap.',
    ],
    note: 'These controls work on selected stage items and help keep crowded layouts readable.'
  },
  'scenes': {
    title: 'Scenes',
    intro: 'Scenes store alternate snapshots of the same project layout.',
    bullets: [
      'Create Scene captures the current stage state as a new scene tab.',
      'Delete Scene removes the active scene from the project.',
      'Load scenes imports scenes from another rider file and adds them to your project.',
      'Imported scenes are added to the current workspace; your existing scenes stay in place.',
      'Imported scene names are preserved.',
      'Each scene can represent a song, service segment, or stage variation.',
      'Drag scene tabs to change scene order in the project.',
      'Scene order matters: report output follows the scene order you set.',
      'Switching scenes lets you compare setups without building separate files.',
      'Scene tabs are included in report generation and can be selected in Report Setup.',
    ],
    note: 'Scene selection is managed in the scene tabs bar and in the report setup dialog.'
  },
  'report': {
    title: 'Report',
    intro: 'What the report includes when you export.',
    bullets: [
      'A stage image section that visually shows item placement.',
      'Connection sections that summarize links and endpoint details.',
      'Device and cable context grouped for practical setup reference.',
      'Selected scenes can be included as report pages and comparison sections.',
      'Use Report Setup to choose exactly what gets included before export.',
    ],
    note: 'For details on scene behavior in reports, open Help > Scenes.'
  },
  'snakes-stageboxes-mixers': {
    title: 'Snakes, Stageboxes and Mixers',
    intro: 'How these connection-box devices are used in routing workflows.',
    bullets: [
      'Snakes support stage/cable view modes and channel-based pin mapping.',
      'Stageboxes and mixers expose multiple input/output pin groups for routing.',
      'Use pin-to-pin clicks to create explicit cable paths between devices.',
      'Collapse/expand controls can reduce visual clutter in dense rigs.',
      'Connection rows and pin labels help identify connector families quickly.',
    ],
    note: 'When routing gets dense, zoom in and use scene snapshots to validate variations safely.'
  },
  'outlets': {
    title: 'Outlets',
    intro: 'How outlet blocks work for patch and cable endpoint planning.',
    bullets: [
      'Outlets can be configured with port count and placement mode.',
      'Each outlet port can be named for clear field labeling.',
      'Outlet view and cable view help map logical and physical usage.',
      'Ports can be linked into broader connection paths like other endpoints.',
      'Outlet details appear in report output to support patching workflows.',
    ],
    note: 'Use consistent port names so report tables are easier for technicians to follow.'
  }
};

function ensureHelpDialog() {
  let overlay = document.getElementById('help-modal');
  if(overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'help-modal';
  overlay.className = 'report-modal';
  overlay.innerHTML = `
    <div class="report-dialog" role="dialog" aria-modal="true" aria-labelledby="help-dialog-title" style="max-width:840px;">
      <div class="report-dialog-header">
        <h2 id="help-dialog-title">Help</h2>
        <p id="help-dialog-subtitle">In-app documentation by topic.</p>
      </div>
      <div class="report-dialog-body" style="gap:12px;">
        <div id="help-topic-buttons" class="report-inline-row" style="gap:8px;"></div>
        <div id="help-topic-content" style="display:grid;gap:10px;"></div>
      </div>
      <div class="report-dialog-actions">
        <button id="help-close-btn" class="report-btn primary" type="button">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if(e.target === overlay) closeHelpTopicDialog();
  });
  const closeBtn = overlay.querySelector('#help-close-btn');
  if(closeBtn) closeBtn.addEventListener('click', closeHelpTopicDialog);

  return overlay;
}

function closeHelpTopicDialog() {
  const overlay = document.getElementById('help-modal');
  if(!overlay) return;
  overlay.classList.remove('open');
}

function renderHelpTopic(topicKey) {
  const overlay = ensureHelpDialog();
  const topicsRow = overlay.querySelector('#help-topic-buttons');
  const content = overlay.querySelector('#help-topic-content');
  const subtitle = overlay.querySelector('#help-dialog-subtitle');
  if(!topicsRow || !content || !subtitle) return;

  const resolvedKey = HELP_TOPICS[topicKey] ? topicKey : HELP_TOPIC_ORDER[0];
  const topic = HELP_TOPICS[resolvedKey];

  topicsRow.innerHTML = '';
  HELP_TOPIC_ORDER.forEach(key => {
    const item = HELP_TOPICS[key];
    if(!item) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'report-btn';
    if(key === resolvedKey) btn.classList.add('primary');
    btn.textContent = item.title;
    btn.addEventListener('click', () => renderHelpTopic(key));
    topicsRow.appendChild(btn);
  });

  subtitle.textContent = topic.intro;
  content.innerHTML = '';

  const title = document.createElement('div');
  title.className = 'help-doc-title';
  title.textContent = topic.title;
  content.appendChild(title);

  const list = document.createElement('ul');
  list.className = 'help-doc-list';
  (topic.bullets || []).forEach(line => {
    const li = document.createElement('li');
    li.textContent = line;
    list.appendChild(li);
  });
  content.appendChild(list);

  if(topic.note) {
    const note = document.createElement('div');
    note.className = 'help-doc-note';
    note.textContent = topic.note;
    content.appendChild(note);
  }
}

function openHelpTopicDialog(topicKey) {
  const overlay = ensureHelpDialog();
  renderHelpTopic(topicKey);
  overlay.classList.add('open');
}

function normalizeSnakeViewMode(mode) {
  return mode === 'output' ? 'output' : 'input';
}

function inferConnectionBoxKind(item) {
  if(!item) return null;
  if(item.type === 'router') return null;
  if(item.connectionBoxKind === 'snake' || item.connectionBoxKind === 'mixer' || item.connectionBoxKind === 'stagebox' || item.connectionBoxKind === 'outlet') {
    return item.connectionBoxKind;
  }
  if(item.type === 'outlet') return 'outlet';
  if(item.isSnake) return 'snake';
  if(item.cat === 'stageboxes' || item.type === 's32' || item.type === 's16') return 'stagebox';
  if(item.isMixer || item.cat === 'mixers') return 'mixer';
  return null;
}

function getConnectionBoxKind(item) {
  return inferConnectionBoxKind(item);
}

function isConnectionBoxInstrument(item) {
  return !!getConnectionBoxKind(item);
}

function isSnakeBox(item) {
  return getConnectionBoxKind(item) === 'snake';
}

function isOutletBox(item) {
  return getConnectionBoxKind(item) === 'outlet';
}

function isMixerBox(item) {
  const kind = getConnectionBoxKind(item);
  return kind === 'mixer' || kind === 'stagebox';
}

function isStageboxBox(item) {
  return getConnectionBoxKind(item) === 'stagebox';
}

function normalizeConnectionBoxFlags(item) {
  if(!item) return null;
  const kind = getConnectionBoxKind(item);
  item.connectionBoxKind = kind || '';
  item.isSnake = kind === 'snake';
  item.isMixer = kind === 'mixer' || kind === 'stagebox';
  if(kind === 'snake') item.cat = 'snake';
  if(kind === 'mixer' && !item.cat) item.cat = 'mixers';
  if(kind === 'stagebox') item.cat = 'stageboxes';
  return kind;
}

function getSnakeViewMode(instr) {
  if(!instr || !isSnakeBox(instr)) return 'input';
  return normalizeSnakeViewMode(instr.snakeViewMode);
}

function updateSnakeViewToggleUI() {
  const btns = document.querySelectorAll('.snake-view-btn');
  if(!btns.length) return;
  const snakes = instruments.filter(i => i && isSnakeBox(i));
  let activeMode = null;
  if(snakes.length) {
    const firstMode = getSnakeViewMode(snakes[0]);
    const allSame = snakes.every(i => getSnakeViewMode(i) === firstMode);
    activeMode = allSame ? firstMode : null;
  }
  btns.forEach(btn => {
    btn.classList.toggle('active', !!activeMode && btn.dataset.mode === activeMode);
  });
}

function setSnakeViewMode(mode) {
  const next = normalizeSnakeViewMode(mode);
  normalizeAllSnakeConnectionPins();
  const snakes = instruments.filter(i => i && isSnakeBox(i));
  if(!snakes.length) {
    updateSnakeViewToggleUI();
    return;
  }
  const changed = snakes.some(i => getSnakeViewMode(i) !== next);
  if(!changed) {
    updateSnakeViewToggleUI();
    return;
  }
  pushHistoryState();
  snakes.forEach(i => {
    i.snakeViewMode = next;
    renderInstrument(i);
  });
  markDirty();
  updateSnakeViewToggleUI();
  render();
}

function setSnakeViewModeForSnake(id, mode) {
  const instr = instruments.find(i => i.id === id);
  if(!instr || !isSnakeBox(instr)) return;
  const next = normalizeSnakeViewMode(mode);
  normalizeAllSnakeConnectionPins();
  if(getSnakeViewMode(instr) === next) return;
  pushHistoryState();
  instr.snakeViewMode = next;
  markDirty();
  renderInstrument(instr);
  updateSnakeViewToggleUI();
  render();
}

function copySelectedItemToClipboard() {
  if(selectedId) {
    const instr = instruments.find(i => i.id === selectedId);
    if(!instr) return false;
    copiedSelection = {
      kind: 'instrument',
      item: cloneInstruments([instr])[0],
    };
    copiedSelectionPasteCount = 0;
    copiedSelectionSceneId = activeSceneId;
    return true;
  }
  if(selectedStagePartId) {
    const part = stageParts.find(p => p.id === selectedStagePartId);
    if(!part) return false;
    copiedSelection = {
      kind: 'stagePart',
      item: cloneStageParts([part])[0],
    };
    copiedSelectionPasteCount = 0;
    copiedSelectionSceneId = activeSceneId;
    return true;
  }
  return false;
}

function pasteCopiedItemFromClipboard() {
  if(!copiedSelection || !copiedSelection.item) return false;

  let offset = 0;
  if(copiedSelectionSceneId != null && copiedSelectionSceneId !== activeSceneId) {
    copiedSelectionPasteCount = 0;
    copiedSelectionSceneId = activeSceneId;
    offset = 0;
  } else {
    const pasteStep = copiedSelectionPasteCount + 1;
    copiedSelectionPasteCount = pasteStep;
    offset = 24 * pasteStep;
  }

  pushHistoryState();

  if(copiedSelection.kind === 'instrument') {
    const source = cloneInstruments([copiedSelection.item])[0];
    if(!source) return false;
    const sourceId = Number(source.id) || 0;
    const canReuseIdAcrossScenes = copiedSelectionSceneId != null && copiedSelectionSceneId !== activeSceneId && sourceId > 0 && !instruments.some(i => i && i.id === sourceId);
    const pasted = {
      ...source,
      id: canReuseIdAcrossScenes ? sourceId : ++idCounter,
      x: (Number(source.x) || 0) + offset,
      y: (Number(source.y) || 0) + offset,
      stageNX: null,
      stageNY: null,
    };
    if(canReuseIdAcrossScenes) idCounter = Math.max(idCounter, pasted.id);
    normalizeConnectionBoxFlags(pasted);
    pasted.micStandCount = clampMicStandCountForInstrument(pasted, pasted.micStandCount);
    syncInstrumentStageNormFromWorld(pasted, stagePx);
    if(!supportsMicPickup(pasted)) pasted.pinMicAssignments = {};
    if(!supportsMicStandOption(pasted)) {
      pasted.micStandCount = 0;
      pasted.drumMicStandAssignments = {};
    }
    instruments.push(pasted);
    renderInstrument(pasted);
    updateSnakeViewToggleUI();
    refreshCategoryCollapseButtons();
    selectInstrument(pasted.id);
    markDirty();
    render();
    return true;
  }

  if(copiedSelection.kind === 'stagePart') {
    const source = cloneStageParts([copiedSelection.item])[0];
    if(!source) return false;
    const sourceId = Number(source.id) || 0;
    const canReuseIdAcrossScenes = copiedSelectionSceneId != null && copiedSelectionSceneId !== activeSceneId && sourceId > 0 && !stageParts.some(p => p && p.id === sourceId);
    const pasted = {
      ...source,
      id: canReuseIdAcrossScenes ? sourceId : ++stagePartIdCounter,
      x: (Number(source.x) || 0) + offset,
      y: (Number(source.y) || 0) + offset,
      stageNX: null,
      stageNY: null,
    };
    if(canReuseIdAcrossScenes) stagePartIdCounter = Math.max(stagePartIdCounter, pasted.id);
    syncStagePartNormFromWorld(pasted, stagePx);
    stageParts.push(pasted);
    renderStagePart(pasted);
    selectStagePart(pasted.id);
    markDirty();
    render();
    return true;
  }

  return false;
}

function handleKeyboardShortcuts(e) {
  const key = (e.key || '').toLowerCase();

  if(key === 'escape') {
    const helpModal = document.getElementById('help-modal');
    if(helpModal && helpModal.classList.contains('open')) {
      e.preventDefault();
      closeHelpTopicDialog();
      return;
    }
  }

  const ae = document.activeElement;
  const isEditable = !!(ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable));

  if(key === 'delete' || (key === 'backspace' && !isEditable)) {
    if(!selectedId && !selectedStagePartId) return;
    e.preventDefault();
    deleteSelected();
    return;
  }

  const ctrlOrMeta = e.ctrlKey || e.metaKey;
  if(!ctrlOrMeta) return;

  if(key === 's') {
    e.preventDefault();
    runFileMenuAction('save');
    return;
  }

  if(key === 'c') {
    if(isEditable) return;
    if(!selectedId && !selectedStagePartId) return;
    e.preventDefault();
    copySelectedItemToClipboard();
    return;
  }

  if(key === 'v') {
    if(isEditable) return;
    if(!copiedSelection) return;
    e.preventDefault();
    pasteCopiedItemFromClipboard();
    return;
  }

  if(key === 'z' && !e.shiftKey) {
    if(isEditable) return;
    e.preventDefault();
    undoAction();
    return;
  }

  if(key === 'z' && e.shiftKey) {
    if(isEditable) return;
    e.preventDefault();
    redoAction();
    return;
  }

  if(key === '=' || key === '+') {
    e.preventDefault();
    changeZoom(0.1);
    return;
  }

  if(key === '-' || key === '_') {
    e.preventDefault();
    changeZoom(-0.1);
    return;
  }

  if(key === '0') {
    e.preventDefault();
    resetZoom();
  }
}

function positionWorldElement(el, x, y) {
  if(!el) return;
  el.style.left = `${panX + (x * zoomLevel)}px`;
  el.style.top = `${panY + (y * zoomLevel)}px`;
  el.style.transformOrigin = 'top left';
  el.style.transform = `scale(${zoomLevel})`;
}

function normalizeStageFrame(frame) {
  const src = frame || stagePx;
  if(!src) return null;
  const width = Number(src.width);
  const height = Number(src.height);
  if(!(width > 0) || !(height > 0)) return null;
  return {
    left: Number(src.left) || 0,
    top: Number(src.top) || 0,
    width,
    height,
  };
}

function syncInstrumentStageNormFromWorld(instr, frame) {
  if(!instr) return;
  const f = normalizeStageFrame(frame);
  if(!f) return;
  instr.stageNX = (Number(instr.x) - f.left) / f.width;
  instr.stageNY = (Number(instr.y) - f.top) / f.height;
}

function ensureInstrumentStageNorm(instr, frame) {
  if(!instr) return;
  if(Number.isFinite(instr.stageNX) && Number.isFinite(instr.stageNY)) return;
  syncInstrumentStageNormFromWorld(instr, frame);
}

function syncInstrumentWorldFromStageNorm(instr, frame) {
  if(!instr) return;
  const f = normalizeStageFrame(frame);
  if(!f) return;
  if(!Number.isFinite(instr.stageNX) || !Number.isFinite(instr.stageNY)) return;
  instr.x = f.left + (instr.stageNX * f.width);
  instr.y = f.top + (instr.stageNY * f.height);
}

function ensureAllInstrumentsStageNorm(frame) {
  instruments.forEach(instr => ensureInstrumentStageNorm(instr, frame));
}

function syncAllInstrumentsWorldFromStageNorm(frame) {
  instruments.forEach(instr => syncInstrumentWorldFromStageNorm(instr, frame));
}

function getStagePartEl(id) {
  return document.getElementById(`stage-part-${id}`);
}

function syncStagePartNormFromWorld(part, frame) {
  if(!part) return;
  const f = normalizeStageFrame(frame);
  if(!f) return;
  part.stageNX = (Number(part.x) - f.left) / f.width;
  part.stageNY = (Number(part.y) - f.top) / f.height;
}

function ensureStagePartNorm(part, frame) {
  if(!part) return;
  if(Number.isFinite(part.stageNX) && Number.isFinite(part.stageNY)) return;
  syncStagePartNormFromWorld(part, frame);
}

function syncStagePartWorldFromNorm(part, frame) {
  if(!part) return;
  const f = normalizeStageFrame(frame);
  if(!f) return;
  if(!Number.isFinite(part.stageNX) || !Number.isFinite(part.stageNY)) return;
  part.x = f.left + (part.stageNX * f.width);
  part.y = f.top + (part.stageNY * f.height);
}

function ensureAllStagePartsNorm(frame) {
  stageParts.forEach(part => ensureStagePartNorm(part, frame));
}

function syncAllStagePartsWorldFromNorm(frame) {
  stageParts.forEach(part => syncStagePartWorldFromNorm(part, frame));
}

function syncConnectionRouteNormFromWorld(conn, frame) {
  if(!conn || !Number.isFinite(conn.routeX)) return;
  const f = normalizeStageFrame(frame);
  if(!f) return;
  conn.routeNX = (Number(conn.routeX) - f.left) / f.width;
}

function ensureConnectionRouteNorm(conn, frame) {
  if(!conn) return;
  if(Number.isFinite(conn.routeNX)) return;
  syncConnectionRouteNormFromWorld(conn, frame);
}

function syncConnectionRouteWorldFromNorm(conn, frame) {
  if(!conn || !Number.isFinite(conn.routeNX)) return;
  const f = normalizeStageFrame(frame);
  if(!f) return;
  conn.routeX = f.left + (conn.routeNX * f.width);
}

function ensureAllConnectionsRouteNorm(frame) {
  connections.forEach(conn => ensureConnectionRouteNorm(conn, frame));
}

function syncAllConnectionsRouteWorldFromNorm(frame) {
  connections.forEach(conn => syncConnectionRouteWorldFromNorm(conn, frame));
}

function getClientPointFromEvent(ev) {
  if(!ev) return null;
  if(Number.isFinite(ev.clientX) && Number.isFinite(ev.clientY)) {
    return { clientX: ev.clientX, clientY: ev.clientY };
  }
  const t = (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]);
  if(t && Number.isFinite(t.clientX) && Number.isFinite(t.clientY)) {
    return { clientX: t.clientX, clientY: t.clientY };
  }
  return null;
}

function isCoarsePointerInput() {
  try {
    return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  } catch(_err) {
    return false;
  }
}

function removeTouchPaletteGhost() {
  if(touchPaletteGhost && touchPaletteGhost.parentNode) touchPaletteGhost.parentNode.removeChild(touchPaletteGhost);
  touchPaletteGhost = null;
}

function updateTouchPaletteGhost(clientX, clientY) {
  if(!touchPaletteGhost) return;
  touchPaletteGhost.style.left = `${clientX + 10}px`;
  touchPaletteGhost.style.top = `${clientY + 10}px`;
}

function beginTouchPaletteDrag(data, clientX, clientY) {
  touchPaletteDragData = { ...data };
  removeTouchPaletteGhost();
  const ghost = document.createElement('div');
  ghost.style.position = 'fixed';
  ghost.style.zIndex = '9999';
  ghost.style.pointerEvents = 'none';
  ghost.style.background = 'rgba(20,24,32,.9)';
  ghost.style.border = '1px solid rgba(255,255,255,.3)';
  ghost.style.color = '#ffffff';
  ghost.style.borderRadius = '8px';
  ghost.style.padding = '6px 8px';
  ghost.style.fontFamily = "'Share Tech Mono',monospace";
  ghost.style.fontSize = '10px';
  ghost.textContent = String(data.name || data.type || 'item');
  document.body.appendChild(ghost);
  touchPaletteGhost = ghost;
  updateTouchPaletteGhost(clientX, clientY);
  const hint = document.getElementById('stage-hint');
  if(hint) hint.textContent = 'Drag on stage and release to place item';
}

function startTouchPaletteDrag(ev, data) {
  const p = getClientPointFromEvent(ev);
  if(!p) return;

  if(!isCoarsePointerInput()) {
    if(ev.cancelable) ev.preventDefault();
    beginTouchPaletteDrag(data, p.clientX, p.clientY);
    return;
  }

  const startX = p.clientX;
  const startY = p.clientY;
  let dragStarted = false;

  function cleanupIntentListeners() {
    document.removeEventListener('touchmove', onIntentMove);
    document.removeEventListener('touchend', onIntentEnd);
    document.removeEventListener('touchcancel', onIntentEnd);
  }

  function onIntentMove(moveEv) {
    const point = getClientPointFromEvent(moveEv);
    if(!point) return;
    const dx = point.clientX - startX;
    const dy = point.clientY - startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const travel = Math.hypot(dx, dy);

    if(!dragStarted) {
      if(travel < TOUCH_PALETTE_DRAG_START_THRESHOLD_PX) return;
      // Favor native sidebar scrolling for mostly-vertical gestures.
      if(absY > (absX * TOUCH_PALETTE_DRAG_AXIS_RATIO)) {
        cleanupIntentListeners();
        return;
      }
      dragStarted = true;
      cleanupIntentListeners();
      if(moveEv.cancelable) moveEv.preventDefault();
      beginTouchPaletteDrag(data, point.clientX, point.clientY);
      moveTouchPaletteDrag(moveEv);
      return;
    }
  }

  function onIntentEnd() {
    cleanupIntentListeners();
  }

  document.addEventListener('touchmove', onIntentMove, { passive: false });
  document.addEventListener('touchend', onIntentEnd, { passive: false });
  document.addEventListener('touchcancel', onIntentEnd, { passive: false });
}

function moveTouchPaletteDrag(ev) {
  if(!touchPaletteDragData) return;
  const p = getClientPointFromEvent(ev);
  if(!p) return;
  if(ev.cancelable) ev.preventDefault();
  updateTouchPaletteGhost(p.clientX, p.clientY);
}

function endTouchPaletteDrag(ev) {
  if(!touchPaletteDragData) return;
  const p = getClientPointFromEvent(ev);
  if(p) {
    const wr = canvasWrap.getBoundingClientRect();
    if(p.clientX>=wr.left && p.clientX<=wr.right && p.clientY>=wr.top && p.clientY<=wr.bottom) {
      const body = getInstrumentBodyDimensionsPx(touchPaletteDragData);
      const worldX = ((p.clientX - wr.left - panX) / zoomLevel) - (body.width / 2);
      const worldY = ((p.clientY - wr.top - panY) / zoomLevel) - (body.height / 2);
      addInstrument(touchPaletteDragData, worldX, worldY);
    }
  }
  touchPaletteDragData = null;
  removeTouchPaletteGhost();
  const hint = document.getElementById('stage-hint');
  if(hint) hint.textContent = getModeHintText();
}

function applyZoom() {
  positionWorldElement(document.getElementById('stage-platform'), stagePx.left, stagePx.top);
  positionWorldElement(document.getElementById('ruler-h'), stagePx.left, stagePx.top - 22);
  positionWorldElement(document.getElementById('ruler-v'), stagePx.left - 22, stagePx.top);
  positionWorldElement(document.getElementById('audience-label'), stagePx.left, stagePx.top + stagePx.height + 24);

  instruments.forEach(instr => {
    const el = getEl(instr.id);
    if(el) positionWorldElement(el, instr.x, instr.y);
  });
  stageParts.forEach(part => {
    const el = getStagePartEl(part.id);
    if(el) positionWorldElement(el, part.x, part.y);
  });

  const zr = document.getElementById('zoom-range');
  if(zr) zr.value = Math.round(zoomLevel * 100);
  const zv = document.getElementById('zoom-value');
  if(zv) zv.textContent = `${Math.round(zoomLevel * 100)}%`;
  render();
}

function setZoom(nextZoom, anchorX, anchorY) {
  const oldZoom = zoomLevel;
  const z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(nextZoom) || 1));
  if(Math.abs(z - zoomLevel) < 0.001) return;
  if(Number.isFinite(anchorX) && Number.isFinite(anchorY)) {
    const worldX = (anchorX - panX) / oldZoom;
    const worldY = (anchorY - panY) / oldZoom;
    panX = anchorX - (worldX * z);
    panY = anchorY - (worldY * z);
  }
  zoomLevel = z;
  applyZoom();
}

function changeZoom(delta) {
  const wr = canvasWrap.getBoundingClientRect();
  const anchorX = (wr.width || 0) / 2;
  const anchorY = (wr.height || 0) / 2;
  setZoom(zoomLevel + delta, anchorX, anchorY);
}

function resetZoom() {
  setZoom(1);
  setPan(0, 0);
}

function setPan(nextX, nextY) {
  panX = Number(nextX) || 0;
  panY = Number(nextY) || 0;
  applyZoom();
}

function handleStageZoomWheel(e) {
  // Pinch zoom on trackpads is exposed as Ctrl/Meta-modified wheel in most browsers.
  if(e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0022);
    const nextZoom = zoomLevel * factor;
    const wr = canvasWrap.getBoundingClientRect();
    setZoom(nextZoom, e.clientX - wr.left, e.clientY - wr.top);
    return;
  }

  // Shift + wheel performs horizontal side scroll.
  if(e.shiftKey) {
    e.preventDefault();
    const horizontalDelta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
    setPan(panX - horizontalDelta, panY);
    return;
  }

  // Two-finger trackpad scroll pans the stage viewport.
  e.preventDefault();
  setPan(panX - e.deltaX, panY - e.deltaY);
}

function handleStageGestureStart(e) {
  e.preventDefault();
  gestureStartZoom = zoomLevel;
}

function handleStageGestureChange(e) {
  // Safari exposes pinch as gesture events with a relative scale.
  e.preventDefault();
  const nextZoom = gestureStartZoom * (e.scale || 1);
  const wr = canvasWrap.getBoundingClientRect();
  setZoom(nextZoom, (wr.width || 0) / 2, (wr.height || 0) / 2);
}

function startPanDrag(e) {
  if(e.button !== 0) return;
  if(e.target.closest('.si, .stage-part')) return;
  const startX = e.clientX;
  const startY = e.clientY;
  const startPanX = panX;
  const startPanY = panY;
  let moved = false;
  canvasWrap.classList.add('is-panning');

  function onMove(ev) {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    if(Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
    setPan(startPanX + dx, startPanY + dy);
  }

  function onUp() {
    canvasWrap.classList.remove('is-panning');
    if(moved) suppressCanvasClick = true;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

function getTouchDistance(t1, t2) {
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return Math.hypot(dx, dy);
}

function getTouchMidpoint(t1, t2) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  };
}

function startPanTouch(e) {
  if(!e.touches || !e.touches.length) return;

  if(e.touches.length === 2) {
    const wrapRect = canvasWrap.getBoundingClientRect();
    const startDistance = getTouchDistance(e.touches[0], e.touches[1]);
    if(startDistance < 4) return;
    const startZoom = zoomLevel;
    if(e.cancelable) e.preventDefault();

    function onMove(ev) {
      if(!ev.touches || ev.touches.length < 2) return;
      const d = getTouchDistance(ev.touches[0], ev.touches[1]);
      const factor = d / startDistance;
      const mid = getTouchMidpoint(ev.touches[0], ev.touches[1]);
      if(ev.cancelable) ev.preventDefault();
      setZoom(startZoom * factor, mid.x - wrapRect.left, mid.y - wrapRect.top);
    }

    function onEnd(ev) {
      if(ev.touches && ev.touches.length >= 2) return;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    }

    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd, { passive: false });
    document.addEventListener('touchcancel', onEnd, { passive: false });
    return;
  }

  if(e.touches.length !== 1) return;
  if(e.target.closest('.si, .stage-part, .iconn, .connbox-pin')) return;

  const t = e.touches[0];
  const startX = t.clientX;
  const startY = t.clientY;
  const startPanX = panX;
  const startPanY = panY;
  let moved = false;
  canvasWrap.classList.add('is-panning');

  function onMove(ev) {
    if(!ev.touches || ev.touches.length !== 1) return;
    const mt = ev.touches[0];
    const dx = mt.clientX - startX;
    const dy = mt.clientY - startY;
    if(Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
    if(ev.cancelable) ev.preventDefault();
    setPan(startPanX + dx, startPanY + dy);
  }

  function onEnd() {
    canvasWrap.classList.remove('is-panning');
    if(moved) suppressCanvasClick = true;
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    document.removeEventListener('touchcancel', onEnd);
  }

  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd, { passive: false });
  document.addEventListener('touchcancel', onEnd, { passive: false });
}

function markDirty() {
  if(!hasInitialized) return;
  hasUnsavedChanges = true;
  document.title = '* Stage Designer';
}

function markClean() {
  hasUnsavedChanges = false;
  document.title = 'Stage Designer';
}

function sanitizeProjectName(name) {
  const base = (name || '').trim() || 'untitled-project';
  return base.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '') || 'untitled-project';
}

function updateProjectName(name) {
  const normalized = (name || '').trim();
  const next = normalized || 'untitled-project';
  if(projectName === next) return;
  if(!projectNameHistorySessionActive) {
    pushHistoryState();
    projectNameHistorySessionActive = true;
  }
  if(projectNameHistorySessionTimer) clearTimeout(projectNameHistorySessionTimer);
  projectNameHistorySessionTimer = setTimeout(() => {
    projectNameHistorySessionActive = false;
    projectNameHistorySessionTimer = null;
  }, PROJECT_NAME_HISTORY_IDLE_MS);
  projectName = next;
  markDirty();
}

function updateProjectNameUI() {
  const input = document.getElementById('project-name');
  if(input) input.value = projectName;
}

function setProjectNameFromFileName(fileName) {
  if(!fileName) return;
  let withoutExt = fileName;
  if(withoutExt.toLowerCase().endsWith(RIDER_FILE_EXTENSION.toLowerCase())) {
    withoutExt = withoutExt.slice(0, -RIDER_FILE_EXTENSION.length);
  } else {
    withoutExt = withoutExt.replace(/\.[^.]+$/, '');
  }
  projectName = withoutExt || 'untitled-project';
  updateProjectNameUI();
}

function getRiderSaveFileName() {
  return sanitizeProjectName(projectName) + RIDER_FILE_EXTENSION;
}

function getProjectNameFromRiderFileName(fileName) {
  let withoutExt = normalizeRiderFileName(fileName || getRiderSaveFileName());
  if(withoutExt.toLowerCase().endsWith(RIDER_FILE_EXTENSION.toLowerCase())) {
    withoutExt = withoutExt.slice(0, -RIDER_FILE_EXTENSION.length);
  } else {
    withoutExt = withoutExt.replace(/\.[^.]+$/, '');
  }
  return withoutExt || 'untitled-project';
}

function normalizeSnakeChannels(value) {
  const n = Math.max(4, Math.min(64, parseInt(value, 10) || 16));
  return Math.round(n / 4) * 4;
}

function normalizeSnakeOutputs(value) {
  return Math.max(0, Math.min(16, parseInt(value, 10) || 0));
}

function getDeviceVisualScaleCompensation() {
  // Keep visual sizing aligned across desktop and mobile while allowing separate tuning per device class.
  return window.matchMedia(`(max-width: ${PHONE_BREAKPOINT_PX}px)`).matches ? 0.98 : 1;
}

function syncRackVisualScale() {
  const root = document.documentElement;
  if(!root) return;
  const base = getDeviceVisualScaleCompensation();
  const safe = Math.max(0.94, Math.min(1.06, base));
  root.style.setProperty('--rack-ui-scale', safe.toFixed(3));
}

function legacySizePxToMeters(sizePx, fallbackPx) {
  const px = Math.max(12, Number(sizePx) || Number(fallbackPx) || 52);
  return px / LEGACY_SIZE_PX_PER_M;
}

function getInstrumentDefinitionByType(type) {
  return INSTRUMENTS.find(i => i.type === type) || null;
}

function getInstrumentFootprintAspect(item) {
  const ownAspect = Number(item && item.footprintAspect);
  if(Number.isFinite(ownAspect) && ownAspect > 0) return ownAspect;

  const def = getInstrumentDefinitionByType(item && item.type);
  const defAspect = Number(def && def.footprintAspect);
  if(Number.isFinite(defAspect) && defAspect > 0) return defAspect;

  return (item && item.wide) ? 1.62 : 1;
}

function isWideFootprintInstrument(item) {
  return getInstrumentFootprintAspect(item) > 1.02;
}

function getFootprintScaleForType(type) {
  if(type === 'drumkit' || type === 'piano') return 1;
  if(type === 'keys') return 0.86;
  if(type === 'di') return 0.34;

  const compactTypes = new Set([
    'acguitar', 'elguitar', 'bass', 'violin', 'viola', 'vox', 'bgvox', 'talkback',
    'trumpet', 'trombone', 'sax', 'iem', 'headphones', 'p16', 'pm1', 'pedals',
    'laptop', 'midipad'
  ]);
  if(compactTypes.has(type)) return 0.64;

  const mediumTypes = new Set(['cello', 'harp', 'monitor', 'mainspk', 'subwoofer', 'amp', 'poweramp', 'ha8000']);
  if(mediumTypes.has(type)) return 0.74;

  return 0.7;
}

function getRenderedWorldSizePx(sizePx, fallbackPx, minPx, footprintScale = 1) {
  const meters = legacySizePxToMeters(sizePx, fallbackPx);
  const px = meters * pxPerM * getDeviceVisualScaleCompensation() * (Number(footprintScale) || 1);
  return Math.max(Number(minPx) || 24, px);
}

function getRackUIScale(widthPx, referencePx, minScale = 0.72, maxScale = 1.6) {
  const scale = (Number(widthPx) || referencePx || 1) / (Number(referencePx) || 1);
  return Math.max(minScale, Math.min(maxScale, scale));
}

function getConnectionBoxViewportScaleCompensation() {
  const wrap = document.getElementById('canvas-wrap');
  const viewportWidth = Math.max(320, Number((wrap && wrap.clientWidth) || window.innerWidth) || 1200);
  if(viewportWidth >= 1100) return 1;
  const ratio = 1100 / viewportWidth;
  return Math.max(1, Math.min(1.26, Math.pow(ratio, 0.24)));
}

function getInstrumentBodyDimensionsPx(item) {
  const fallback = isWideFootprintInstrument(item) ? 82 : 52;
  const baseSize = Number(item && item.size) || getDefaultSizeForType(item && item.type, fallback);
  const boxKind = getConnectionBoxKind(item);
  const boxViewportScale = getConnectionBoxViewportScaleCompensation();
  
  if(boxKind === 'snake') {
    const normalizedRackSize = Math.max(48, Math.min(66, baseSize * 0.9));
    const stableWidth = getRenderedWorldSizePx(normalizedRackSize, 72, 56) * boxViewportScale;
    const uiScale = getRackUIScale(stableWidth, 108, 0.86, 1.6);
    return {
      width: stableWidth,
      height: Math.max(40, 58 * uiScale),
      uiScale,
    };
  }

  if(boxKind === 'mixer' || boxKind === 'stagebox') {
    const normalizedRackSize = Math.max(68, Math.min(102, baseSize * 0.78));
    const stableWidth = getRenderedWorldSizePx(normalizedRackSize, 104, 82) * boxViewportScale;
    const uiScale = getRackUIScale(stableWidth, 194, 0.84, 1.6);
    return {
      width: stableWidth,
      height: Math.max(52, 66 * uiScale),
      uiScale,
    };
  }

  if(boxKind === 'outlet') {
    const ports = normalizeOutletPortCount(item && item.outletPorts, item);
    const normalizedOutletSize = Math.max(24, Math.min(52, baseSize * 0.92));
    const baseWidth = getRenderedWorldSizePx(normalizedOutletSize, 44, 34) * boxViewportScale;
    const uiScale = getRackUIScale(baseWidth, 84, 0.7, 1.26);
    const pinSize = 18 * uiScale * 1.08;
    const pinGap = 2 * uiScale;
    const horizontalPad = 8 * uiScale;
    const minGridWidth = (ports * pinSize) + (Math.max(0, ports - 1) * pinGap) + horizontalPad;
    const stableWidth = Math.max(baseWidth, minGridWidth);
    return {
      width: stableWidth,
      height: Math.max(24, 32 * uiScale),
      uiScale,
    };
  }

  const typeScale = getFootprintScaleForType(item && item.type);
  const aspect = Math.max(0.25, Math.min(4, getInstrumentFootprintAspect(item)));
  const base = getRenderedWorldSizePx(baseSize, fallback, 28, typeScale);

  let width = base;
  let height = base;
  if(aspect > 1) {
    height = Math.max(22, base / aspect);
  } else if(aspect < 1) {
    width = Math.max(22, base * aspect);
  }

  return { width, height };
}

function supportsStereoToggle(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return !!type && type !== 'drumkit';
}

function isSpeakerWithThru(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return type === 'monitor' || type === 'mainspk' || type === 'subwoofer' || type === 'passivespk';
}

function normalizeSpeakerConnectorMode(value, fallback = 'xlr') {
  const allowed = new Set(['xlr', 'jack', 'speakon']);
  return allowed.has(value) ? value : fallback;
}

function normalizeOutletConnectorType(value, fallback = 'ethernet') {
  const allowed = new Set(['xlr', 'speakon', 'ethernet']);
  return allowed.has(value) ? value : fallback;
}

function normalizeOutletViewMode(value, fallback = 'outlet') {
  return value === 'cable' ? 'cable' : (fallback === 'cable' ? 'cable' : 'outlet');
}

function normalizeOutletPortMode(value, fallback = 'ethernet') {
  const allowed = new Set(['xlr-input', 'xlr-output', 'speakon-input', 'speakon-output', 'ethernet']);
  return allowed.has(value) ? value : (allowed.has(fallback) ? fallback : 'ethernet');
}

function isRouterOutletType(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return type === 'router';
}

function getOutletPortLimit(instrOrType) {
  return isRouterOutletType(instrOrType) ? 8 : 32;
}

function normalizeOutletPortCount(value, instrOrType = null, fallback = 2) {
  const min = 1;
  const max = getOutletPortLimit(instrOrType);
  const normalizedFallback = Math.max(min, Math.min(max, parseInt(fallback, 10) || 2));
  return Math.max(min, Math.min(max, parseInt(value, 10) || normalizedFallback));
}

function getDefaultOutletPortName(instrOrType, index) {
  const n = Math.max(1, parseInt(index, 10) || 1);
  return isRouterOutletType(instrOrType) ? `L${n}` : `Port ${n}`;
}

function normalizeOutletPortModes(raw, ports = 2, fallbackMode = 'ethernet') {
  const count = normalizeOutletPortCount(ports);
  const source = (raw && typeof raw === 'object') ? raw : {};
  const out = {};
  for(let i=1;i<=count;i++) {
    const v = String(source[i] || source[String(i)] || '').trim();
    out[i] = normalizeOutletPortMode(v || fallbackMode, fallbackMode);
  }
  return out;
}

function normalizeOutletPortNames(raw, ports = 2, instrOrType = null) {
  const count = normalizeOutletPortCount(ports, instrOrType);
  const source = (raw && typeof raw === 'object') ? raw : {};
  const out = {};
  for(let i=1;i<=count;i++) {
    const v = String(source[i] || source[String(i)] || '').trim();
    out[i] = v || getDefaultOutletPortName(instrOrType, i);
  }
  return out;
}

function getOutletPortModes(instr) {
  const ports = normalizeOutletPortCount(instr && instr.outletPorts, instr);
  const fallback = getOutletPortModeFallback(instr);
  return normalizeOutletPortModes(instr && instr.outletPortModes, ports, fallback);
}

function getOutletPortModeFallback(instr) {
  const legacyFallback = normalizeOutletPortMode(instr && instr.outletConnectorType, 'ethernet');
  const source = (instr && instr.outletPortModes && typeof instr.outletPortModes === 'object') ? instr.outletPortModes : null;
  if(source) {
    const firstMode = Object.values(source).find(Boolean);
    if(firstMode) return normalizeOutletPortMode(firstMode, legacyFallback);
  }
  return legacyFallback;
}

function getOutletPortMode(instr, index) {
  const modes = getOutletPortModes(instr);
  return modes[index] || 'ethernet';
}

function outletModeToCableType(mode) {
  const normalized = normalizeOutletPortMode(mode, 'ethernet');
  if(normalized.startsWith('xlr')) return 'xlr';
  if(normalized.startsWith('speakon')) return 'speakon';
  return 'ethernet';
}

function outletModeToVisibleSide(mode, viewMode = 'outlet') {
  const normalized = normalizeOutletPortMode(mode, 'ethernet');
  const isInputMode = normalized.endsWith('input');
  const outputSide = normalized === 'ethernet' || !isInputMode;
  const outletSide = outputSide ? 'output' : 'input';
  return normalizeOutletViewMode(viewMode) === 'cable' ? (outletSide === 'input' ? 'output' : 'input') : outletSide;
}

function outletModeToReverseSide(mode, viewMode = 'outlet') {
  return outletModeToVisibleSide(mode, viewMode) === 'input' ? 'output' : 'input';
}

function getOutletPortVisibleKey(instr, index) {
  const mode = getOutletPortMode(instr, index);
  const side = outletModeToVisibleSide(mode, instr && instr.outletViewMode);
  return `OUTLET-${side === 'input' ? 'IN' : 'OUT'}-${index}`;
}

function getOutletPortVisibleLabel(instr, index) {
  const mode = getOutletPortMode(instr, index);
  const side = outletModeToVisibleSide(mode, instr && instr.outletViewMode);
  const cableType = outletModeToCableType(mode);
  if(cableType === 'ethernet') return side === 'input' ? 'Ethernet In' : 'Ethernet';
  const label = cableType === 'speakon' ? 'Speakon' : 'XLR';
  return `${label} ${side === 'input' ? 'In' : 'Out'}`;
}

function getOutletPortModeLabel(mode) {
  const normalized = normalizeOutletPortMode(mode, 'ethernet');
  if(normalized === 'ethernet') return 'Ethernet';
  const label = normalized.startsWith('speakon') ? 'Speakon' : 'XLR';
  return `${label} ${normalized.endsWith('input') ? 'Input' : 'Output'}`;
}

function getOutletPortModeOptions() {
  return [
    { value:'xlr-input', label:'XLR Input' },
    { value:'xlr-output', label:'XLR Output' },
    { value:'speakon-input', label:'Speakon Input' },
    { value:'speakon-output', label:'Speakon Output' },
    { value:'ethernet', label:'Ethernet' },
  ];
}

function getOutletViewMode(instr) {
  return normalizeOutletViewMode(instr && instr.outletViewMode, 'outlet');
}

function updateOutletViewModeUI(activeMode) {
  document.querySelectorAll('.snake-mode-btn[data-mode]').forEach(btn => {
    const isOutletToggle = btn.closest('#outlet-extra');
    if(!isOutletToggle) return;
    btn.classList.toggle('active', btn.dataset.mode === activeMode);
  });
}

function setOutletViewMode(mode) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isOutletBox(instr)) return;
  const next = normalizeOutletViewMode(mode, 'outlet');
  if(getOutletViewMode(instr) === next) return;
  pushHistoryState();
  instr.outletViewMode = next;
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function getOutletPortHoverText(instr, index) {
  const name = getOutletPortName(instr, index);
  const mode = getOutletPortMode(instr, index);
  const side = outletModeToVisibleSide(mode, instr && instr.outletViewMode);
  const cableType = outletModeToCableType(mode);
  if(outletPortNameIncludesType(name)) return name;
  if(cableType === 'ethernet') return `${name} - Ethernet ${side === 'input' ? 'Input' : 'Output'}`;
  const label = cableType === 'speakon' ? 'Speakon' : 'XLR';
  return `${name} - ${label} ${side === 'input' ? 'Input' : 'Output'}`;
}

function getOutletPortTitle(instr, index) {
  return getOutletPortHoverText(instr, index);
}

function getOutletPortIndexFromKey(pin) {
  const key = pinKey(pin);
  const match = key.match(/^OUTLET-(?:IN|OUT)-(\d+)$/);
  return match ? (parseInt(match[1], 10) || null) : null;
}

function getOutletPortCableTypeForPin(instr, pin) {
  const index = getOutletPortIndexFromKey(pin);
  if(!instr || !index) return 'ethernet';
  return outletModeToCableType(getOutletPortMode(instr, index));
}

function getOutletPortName(instr, index) {
  if(!instr) return getDefaultOutletPortName(null, index);
  const map = normalizeOutletPortNames(instr.outletPortNames, instr.outletPorts, instr);
  return map[index] || getDefaultOutletPortName(instr, index);
}

function outletPortNameIncludesType(name) {
  const text = String(name || '').toLowerCase();
  return text.includes('xlr') || text.includes('speakon') || text.includes('ethernet');
}

function outletConnectorToCableTypes(type) {
  const normalized = normalizeOutletConnectorType(type, 'ethernet');
  if(normalized === 'speakon') return ['speakon'];
  if(normalized === 'ethernet') return ['ethernet'];
  return ['xlr'];
}

function hasMixerUsbPort(instr) {
  return !!(instr && instr.cat === 'mixers');
}

function hasMixerHeadphonePort(instr) {
  return !!(instr && instr.cat === 'mixers');
}

function speakerConnectorModeToCableTypes(mode) {
  if(mode === 'jack') return ['ts'];
  if(mode === 'speakon') return ['speakon'];
  return ['xlr'];
}

function isPedalsType(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return type === 'pedals' || type === 'pedal';
}

function isCustomIOInstrument(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return type === 'di' || isPedalsType(type) || type === 'ha8000' || type === 'ha400' || type === 'amp' || type === 'poweramp' || type === 'p16' || type === 'p16d' || type === 'router' || type === 'scarlet2i2' || type === 'laptop' || isSpeakerWithThru(type);
}

function supportsInputModeToggle(instr) {
  return !!instr && isPedalsType(instr);
}

function supportsOutputModeToggle(instr) {
  return !!instr && isPedalsType(instr);
}

function getInstrumentInputPins(instr) {
  if(!instr) return [];
  if(instr.type === 'router') {
    const count = normalizeOutletPortCount(instr.outletPorts, instr, 4);
    return Array.from({ length: count }, (_v, idx) => {
      const n = idx + 1;
      return { key:`ROUTER-LAN-${n}`, label:`L${n}` };
    });
  }
  if(instr.type === 'p16d') {
    return [{ key:'P16D-IN', label:'IN' }];
  }
  if(instr.type === 'p16') {
    return [{ key:'P16-IN', label:'IN' }];
  }
  if(instr.type === 'scarlet2i2') {
    return [{ key:'IO-IN-1', label:'I1' }, { key:'IO-IN-2', label:'I2' }, { key:'IO-USB', label:'USB' }];
  }
  if(isSpeakerWithThru(instr)) {
    return [{ key:'SPK-IN', label:'IN' }];
  }
  if(instr.type === 'di') {
    const isStereo = !!(instr.stereo || instr.inputStereo || instr.outputStereo);
    if(isStereo) return [{ key:'IO-IN-L', label:'I1' }, { key:'IO-IN-R', label:'I2' }];
    return [{ key:'IO-IN-MONO', label:'IN' }];
  }
  if(isPedalsType(instr)) {
    if(instr.inputStereo) return [{ key:'IO-IN-L', label:'I.L' }, { key:'IO-IN-R', label:'I.R' }];
    return [{ key:'IO-IN-MONO', label:'IN' }];
  }
  if(instr.type === 'ha8000') {
    const main = [{ key:'HA-IN-L', label:'M.L' }, { key:'HA-IN-R', label:'M.R' }];
    const channels = Array.from({ length: 8 }, (_v, idx) => {
      const n = idx + 1;
      return [
        { key:`HA-IN-${n}-L`, label:`${n}L` },
        { key:`HA-IN-${n}-R`, label:`${n}R` },
      ];
    }).flat();
    return !!instr.haUseMainInputs ? main : channels;
  }
  if(instr.type === 'ha400') {
    return [{ key:'IO-IN-TRS', label:'IN' }];
  }
  if(instr.type === 'laptop') {
    return [{ key:'IO-IN-TRS', label:'TRS' }];
  }
  if(instr.type === 'amp') {
    const isStereo = !!(instr.stereo || instr.inputStereo || instr.outputStereo);
    if(isStereo) return [{ key:'AMP-IN-L', label:'I.L' }, { key:'AMP-IN-R', label:'I.R' }];
    return [{ key:'AMP-IN', label:'IN' }];
  }
  if(instr.type === 'poweramp') {
    return [{ key:'PAMP-IN-L', label:'I.L' }, { key:'PAMP-IN-R', label:'I.R' }];
  }
  return [];
}

function getInstrumentOutputPins(instr) {
  if(!instr) return [];
  if(instr.type === 'p16d') {
    const outCount = Math.max(1, Math.min(16, parseInt(instr.p16dOutCount, 10) || 8));
    return Array.from({ length: outCount }, (_v, idx) => ({ key:`P16D-OUT-${idx + 1}`, label:String(idx + 1) }));
  }
  if(instr.type === 'p16') {
    return [{ key:'P16-THRU', label:'THRU' }, { key:'P16-HP', label:'HP' }];
  }
  if(instr.type === 'scarlet2i2') {
    return [
      { key:'IO-OUT-1', label:'O1' },
      { key:'IO-OUT-2', label:'O2' },
      { key:'IO-OUT-HP', label:'HP' },
    ];
  }
  if(isSpeakerWithThru(instr)) {
    return [{ key:'SPK-OUT', label:'OUT' }];
  }
  if(instr.type === 'di' || isPedalsType(instr)) {
    const isStereo = instr.type === 'di'
      ? !!(instr.stereo || instr.inputStereo || instr.outputStereo)
      : !!instr.outputStereo;
    if(isStereo) {
      if(instr.type === 'di') return [{ key:'IO-OUT-L', label:'O1' }, { key:'IO-OUT-R', label:'O2' }];
      return [{ key:'IO-OUT-L', label:'O.L' }, { key:'IO-OUT-R', label:'O.R' }];
    }
    return [{ key:'IO-OUT-MONO', label:'OUT' }];
  }
  if(instr.type === 'ha8000') {
    return Array.from({ length: 8 }, (_v, idx) => ({ key:`HA-OUT-${idx + 1}`, label:String(idx + 1) }));
  }
  if(instr.type === 'ha400') {
    return Array.from({ length: 4 }, (_v, idx) => ({ key:`IO-OUT-${idx + 1}`, label:String(idx + 1) }));
  }
  if(instr.type === 'laptop') {
    return [{ key:'IO-USB', label:'USB' }];
  }
  if(instr.type === 'amp') {
    const isStereo = !!(instr.stereo || instr.inputStereo || instr.outputStereo);
    if(isStereo) return [{ key:'AMP-OUT-L', label:'O.L' }, { key:'AMP-OUT-R', label:'O.R' }];
    return [{ key:'AMP-OUT', label:'OUT' }];
  }
  if(instr.type === 'poweramp') {
    const total = Math.max(1, Math.min(16, Number(instr.ampOutputs) || 4));
    return Array.from({ length: total }, (_v, idx) => ({ key:`PAMP-OUT-${idx + 1}`, label:`SPK-${idx + 1}` }));
  }
  return [];
}

function getValidPinsForInstrument(instr) {
  if(!instr) return new Set();
  if(isWirelessMicNode(instr)) return new Set();
  if(isConnectionBoxInstrument(instr)) return null;
  if(isNonConnectableInstrument(instr)) return new Set();
  if(instr.type === 'drumkit') return new Set(getDrumMicPins(instr).map(p => p.key));
  if(isCustomIOInstrument(instr)) {
    return new Set([...getInstrumentInputPins(instr), ...getInstrumentOutputPins(instr)].map(p => p.key));
  }
  const useAccessoryOutputs = hasAttachedAccessory(instr);
  const showStereo = useAccessoryOutputs ? !!instr.attachedAccessoryStereo : !!instr.stereo;
  if(showStereo) return new Set(['L', 'R']);
  return new Set(['MONO']);
}

function abbreviateStereoPinLabel(label) {
  const text = String(label || '').trim();
  const match = text.match(/^([A-Z]+)-([LR])$/);
  if(!match) return text;
  return `${match[1].slice(0, 1)}.${match[2]}`;
}

function pruneInvalidInstrumentPins(instr) {
  const validPins = getValidPinsForInstrument(instr);
  if(!validPins) return;
  const map = normalizePinMicAssignments(instr.pinMicAssignments);
  Object.keys(map).forEach(pin => {
    if(!validPins.has(pin)) delete map[pin];
  });
  instr.pinMicAssignments = map;
  const before = connections.length;
  connections = connections.filter(c => {
    if(c.fromId === instr.id && !validPins.has(pinKey(c.fromPin))) return false;
    if(c.toId === instr.id && !validPins.has(pinKey(c.toPin))) return false;
    return true;
  });
  if(connections.length !== before) {
    connectingFrom = null;
    drawingLine = null;
  }
}

function getStageBorderColor(color) {
  const hex = String(color || '').replace('#', '');
  if(!/^[0-9a-fA-F]{6}$/.test(hex)) return '#2d3340';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const shade = v => Math.max(0, Math.min(255, Math.round(v * 0.62)));
  return `rgb(${shade(r)}, ${shade(g)}, ${shade(b)})`;
}

function applyThemeMode() {
  document.body.dataset.theme = themeMode === 'dark' ? 'dark' : 'light';
  const select = document.getElementById('theme-mode');
  if(select) select.value = themeMode;
}

function applyStageColor() {
  const borderColor = getStageBorderColor(stageColor);
  document.documentElement.style.setProperty('--stage-bg', stageColor);
  document.documentElement.style.setProperty('--stage-border', borderColor);
  const platform = document.getElementById('stage-platform');
  if(platform) {
    platform.style.background = stageColor;
    platform.style.borderColor = borderColor;
  }
  const stairs = document.getElementById('stage-stairs');
  if(stairs) {
    stairs.style.background = borderColor;
    stairs.style.borderColor = borderColor;
  }
  const hex = String(stageColor || '').replace('#', '');
  if(/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const isDark = luminance < 0.52;
    document.documentElement.style.setProperty('--stage-label-text', isDark ? '#ffffff' : '#111111');
    document.documentElement.style.setProperty('--stage-label-bg', isDark ? 'rgba(8,12,18,.74)' : 'rgba(255,255,255,.78)');
  }
  const input = document.getElementById('stage-color');
  if(input) input.value = stageColor;
}

function setThemeMode(value) {
  const next = value === 'dark' ? 'dark' : 'light';
  if(themeMode === next) return;
  pushHistoryState();
  themeMode = next;
  applyThemeMode();
  markDirty();
  render();
}

function setStageColor(value) {
  const next = /^#[0-9a-fA-F]{6}$/.test(String(value || '')) ? value : DEFAULT_STAGE_COLOR;
  if(stageColor === next) return;
  pushHistoryState();
  stageColor = next;
  const primary = getPrimaryStagePart();
  if(primary) primary.color = next;
  applyStageColor();
  markDirty();
  render();
}

function setStageGridVisible(enabled) {
  const next = !!enabled;
  if(showStageGrid === next) return;
  pushHistoryState();
  showStageGrid = next;
  updateStage(true);
  markDirty();
}

function getDefaultConnectorMode(type) {
  const jackDefaults = new Set(['acguitar', 'elguitar', 'bass', 'iem', 'headphones', 'ha8000']);
  if(jackDefaults.has(type)) return 'jack';
  return 'xlr';
}

function supportsMicPickup(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  if(!type) return false;
  const disallowed = new Set([
    'elguitar', 'bass', 'keys',
    'monitor', 'mainspk', 'subwoofer', 'passivespk', 'iem', 'headphones', 'pm1', 'p16', 'p16d', 'router', 'ha8000', 'ha400', 'di', 'amp', 'pedals', 'laptop', 'midipad', 'scarlet2i2',
    'snake8', 'snake16', 'snake24', 'snake32', 'xr18', 'x32', 'x32compact', 'x32rack', 'wing', 'wingcompact', 'wingrack'
  ]);
  return !disallowed.has(type);
}

function allowsMicPickupWithAccessory(instr) {
  if(!instr) return false;
  return instr.cat === 'vocals';
}

const MIC_STAND_IMAGE_PATH = 'images/mic_stand.png';

function normalizeAttachedAccessoryType(value) {
  const next = String(value || '').trim().toLowerCase();
  if(next === 'di' || next === 'amp' || next === 'pedals') return next;
  return 'none';
}

function normalizeAttachedAccessoryCableType(value) {
  const next = normalizeCableType(value || 'xlr');
  return isKnownCableType(next) ? next : 'xlr';
}

function getDefaultAttachedAccessoryCableType(type) {
  const key = normalizeAttachedAccessoryType(type);
  if(key === 'pedals') return 'xlr';
  if(key === 'amp') return 'xlr';
  if(key === 'di') return 'xlr';
  return 'xlr';
}

function isPrimarySignalModeStereo(instr) {
  if(!instr) return false;
  if(supportsInputModeToggle(instr) || supportsOutputModeToggle(instr)) {
    return !!instr.inputStereo || !!instr.outputStereo;
  }
  if(!supportsStereoToggle(instr) || isPedalsType(instr)) return false;
  if(instr.type === 'di') return !!(instr.stereo || instr.inputStereo || instr.outputStereo);
  return !!instr.stereo;
}

function isDiAccessoryLinked(instr) {
  return !!(instr && normalizeAttachedAccessoryType(instr.attachedAccessoryType) === 'di');
}

function setInstrumentPrimarySignalModeStereo(instr, enabled) {
  if(!instr) return;
  const next = !!enabled;
  if(supportsInputModeToggle(instr)) instr.inputStereo = next;
  if(supportsOutputModeToggle(instr)) instr.outputStereo = next;
  if(supportsStereoToggle(instr) && !isPedalsType(instr)) instr.stereo = next;
  if(instr.type === 'di') {
    instr.stereo = next;
    instr.inputStereo = next;
    instr.outputStereo = next;
  }
}

function syncDiAccessoryStereoFromInstrument(instr) {
  if(!isDiAccessoryLinked(instr)) return;
  instr.attachedAccessoryStereo = isPrimarySignalModeStereo(instr);
}

function shouldUseAccessoryStereoPins(instr) {
  if(!instr || !hasAttachedAccessory(instr) || !instr.attachedAccessoryStereo) return false;
  if(isConnectionBoxInstrument(instr) || isNonConnectableInstrument(instr)) return false;
  if(instr.type === 'drumkit') return false;
  if(isCustomIOInstrument(instr)) return false;
  return true;
}

function syncInstrumentSignalLabels(instr) {
  const hasAccessory = !!(instr && hasAttachedAccessory(instr));
  ['conn-type-wrap', 'stereo-wrap', 'io-mode-wrap'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('instrument-linked', hasAccessory);
  });
  const connTypeLabel = document.querySelector('#conn-type-wrap > .plbl');
  if(connTypeLabel) connTypeLabel.textContent = hasAccessory ? 'Instrument Connection Type' : 'Connection Type';
  const stereoLabel = document.querySelector('#stereo-wrap > .plbl');
  if(stereoLabel) stereoLabel.textContent = hasAccessory ? 'Instrument Signal Mode' : 'Signal Mode';
  const ioLabel = document.querySelector('#io-mode-wrap > .plbl');
  if(ioLabel) ioLabel.textContent = hasAccessory ? 'Instrument I/O Layout' : 'I/O Layout';
  const ioModeLabels = document.querySelectorAll('#io-mode-wrap .mode-row .plbl');
  if(ioModeLabels && ioModeLabels.length >= 2) {
    ioModeLabels[0].textContent = hasAccessory ? 'Instrument Input' : 'Input';
    ioModeLabels[1].textContent = hasAccessory ? 'Instrument Output' : 'Output';
  }
}

function syncSignalModeConflictUI(instr) {
  syncInstrumentSignalLabels(instr);
  const stereoToggle = document.getElementById('p-stereo-mode');
  if(stereoToggle) stereoToggle.disabled = false;
  const inputSelect = document.getElementById('p-input-mode');
  if(inputSelect) inputSelect.disabled = !supportsInputModeToggle(instr);
  const outputSelect = document.getElementById('p-output-mode');
  if(outputSelect) outputSelect.disabled = !supportsOutputModeToggle(instr);
}

function normalizeAttachedAccessoryForInstrument(instr) {
  if(!instr) return;
  instr.attachedAccessoryType = normalizeAttachedAccessoryType(instr.attachedAccessoryType);
  const cableFallback = getDefaultAttachedAccessoryCableType(instr.attachedAccessoryType);
  const legacyCable = normalizeAttachedAccessoryCableType(instr.attachedAccessoryCableType || cableFallback);
  instr.attachedAccessoryInputCableType = normalizeAttachedAccessoryCableType(instr.attachedAccessoryInputCableType || legacyCable);
  instr.attachedAccessoryOutputCableType = normalizeAttachedAccessoryCableType(instr.attachedAccessoryOutputCableType || legacyCable);
  // Keep legacy field in sync for backward compatibility with older saved riders.
  instr.attachedAccessoryCableType = instr.attachedAccessoryInputCableType;
  instr.attachedAccessoryStereo = !!instr.attachedAccessoryStereo;
  if(instr.attachedAccessoryType === 'none') instr.attachedAccessoryStereo = false;
}

function hasAttachedAccessory(instr) {
  return !!(instr && normalizeAttachedAccessoryType(instr.attachedAccessoryType) !== 'none');
}

function getAttachedAccessoryLabel(type) {
  const key = normalizeAttachedAccessoryType(type);
  if(key === 'di') return 'DI';
  if(key === 'amp') return 'Speaker Amp';
  if(key === 'poweramp') return 'Power Amp';
  if(key === 'pedals') return 'Pedals';
  return 'None';
}

function getAttachedAccessoryIcon(instr) {
  const type = normalizeAttachedAccessoryType(instr && instr.attachedAccessoryType);
  if(type === 'none') return null;
  if(isWirelessMicNode(instr)) return null;
  const image = getInstrumentImage(type);
  if(image) return { image, emoji: '' };
  if(type === 'di') return { image: '', emoji: 'ðŸ“¦' };
  if(type === 'amp') return { image: '', emoji: 'ðŸ”Œ' };
  if(type === 'poweramp') return { image: '', emoji: 'ðŸ”Œ' };
  if(type === 'pedals') return { image: '', emoji: 'ðŸŽ›' };
  return null;
}
function isStandType(instrOrType) {
  if(!instrOrType) return false;
  const instr = typeof instrOrType === 'string'
    ? getInstrumentDefinitionByType(instrOrType)
    : instrOrType;
  if(instr && instr.cat === 'stands') return true;
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return type === 'micstand' || type === 'sheetstand' || type === 'micstandmulti';
}

function isWirelessMicType(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return type === 'wirelessmic';
}

function isWirelessReceiverType(instrOrType) {
  const type = typeof instrOrType === 'string' ? instrOrType : (instrOrType && instrOrType.type);
  return type === 'wirelessreceiver';
}

function isWirelessLinkedInstrument(instr) {
  if(!instr) return false;
  const pairId = Number(instr.wirelessPairId);
  if(!Number.isFinite(pairId) || pairId < 1) return false;
  return isWirelessMicNode(instr) || isWirelessReceiverNode(instr);
}

function normalizeWirelessPairMeta(instr) {
  if(!instr) return;
  const type = String(instr.type || '').trim().toLowerCase();
  const explicitRole = String(instr.wirelessRole || '').trim().toLowerCase();
  let role = explicitRole === 'mic' || explicitRole === 'receiver' ? explicitRole : '';
  const isWirelessType = type === 'wirelessmic' || type === 'wirelessreceiver';

  if(!isWirelessType) {
    instr.wirelessPairId = null;
    instr.wirelessRole = '';
    instr.hideWirelessReceiver = !!instr.hideWirelessReceiver;
    return;
  }

  if(type === 'wirelessmic' && !role) role = 'mic';
  if(type === 'wirelessreceiver' && !role) role = 'receiver';

  const pairId = Number(instr.wirelessPairId);
  const validPair = Number.isFinite(pairId) && pairId > 0;

  instr.wirelessPairId = validPair ? pairId : null;
  instr.wirelessRole = role;
  if(instr.wirelessPairId == null) instr.wirelessRole = '';
  instr.hideWirelessReceiver = !!instr.hideWirelessReceiver;
}

function getWirelessHideReceiver(instr) {
  if(!instr || !isWirelessLinkedInstrument(instr)) return false;
  const peer = getWirelessPeer(instr);
  return !!(instr.hideWirelessReceiver || (peer && peer.hideWirelessReceiver));
}

function shouldHideWirelessReceiver(instr) {
  return !!(isWirelessReceiverNode(instr) && getWirelessHideReceiver(instr));
}

function isWirelessMicNode(instr) {
  if(!instr) return false;
  if(instr.wirelessRole) return instr.wirelessRole === 'mic';
  return isWirelessMicType(instr);
}

function isWirelessReceiverNode(instr) {
  if(!instr) return false;
  if(instr.wirelessRole) return instr.wirelessRole === 'receiver';
  return isWirelessReceiverType(instr);
}

function getWirelessPeer(instr) {
  if(!isWirelessLinkedInstrument(instr)) return null;
  return instruments.find(i => i && i.id !== instr.id && isWirelessLinkedInstrument(i) && Number(i.wirelessPairId) === Number(instr.wirelessPairId)) || null;
}

function getWirelessMicNode(instr) {
  if(!isWirelessLinkedInstrument(instr)) return null;
  if(isWirelessMicNode(instr)) return instr;
  const peer = getWirelessPeer(instr);
  return isWirelessMicNode(peer) ? peer : null;
}

function getWirelessSelectionIds(idOrInstr) {
  const instr = (idOrInstr && typeof idOrInstr === 'object') ? idOrInstr : instruments.find(i => i.id === idOrInstr);
  if(!instr) return [];
  if(!isWirelessLinkedInstrument(instr)) return [instr.id];
  const peer = getWirelessPeer(instr);
  return peer ? [instr.id, peer.id] : [instr.id];
}

function getVisibleInstrumentLabel(instr) {
  if(!instr) return '';
  const base = String(instr.label || instr.name || instr.type || 'Item');
  if(isWirelessReceiverNode(instr)) return `${base} Rx`;
  return base;
}

function syncWirelessPairSharedProps(source) {
  if(!source || !isWirelessLinkedInstrument(source)) return;
  const peer = getWirelessPeer(source);
  if(!peer) return;
  const excluded = new Set([
    'id', 'type', 'cat', 'icon', 'image', 'x', 'y', 'stageNX', 'stageNY', 'size', 'wide', 'angle', 'connSide',
    'wirelessPairId', 'wirelessRole', 'noConnect', 'micStandCount', 'drumMicStandAssignments', 'drumMics',
  ]);
  Object.keys(source).forEach(key => {
    if(excluded.has(key)) return;
    const value = source[key];
    if(Array.isArray(value)) peer[key] = [...value];
    else if(value && typeof value === 'object') peer[key] = { ...value };
    else peer[key] = value;
  });
}

function applyWirelessPairEdit(source) {
  if(!source || !isWirelessLinkedInstrument(source)) return null;
  const peer = getWirelessPeer(source);
  if(!peer) return null;
  syncWirelessPairSharedProps(source);
  if(isWirelessReceiverNode(source)) source.micStandCount = 0;
  if(isWirelessReceiverNode(peer)) peer.micStandCount = 0;
  normalizeAttachedAccessoryForInstrument(peer);
  pruneInvalidInstrumentPins(peer);
  return peer;
}

function isNonConnectableInstrument(instrOrType) {
  const instr = (instrOrType && typeof instrOrType === 'object') ? instrOrType : getInstrumentDefinitionByType(instrOrType);
  if(!instr) return false;
  return !!instr.noConnect;
}

function supportsMicStandOption(instrOrType) {
  if(!instrOrType) return false;
  const instr = (typeof instrOrType === 'string') ? getInstrumentDefinitionByType(instrOrType) : instrOrType;
  const type = instr && instr.type;
  if(type === 'router' || type === 'p16d') return false;
  if(isConnectionBoxInstrument(instr) || isStandType(instr) || isNonConnectableInstrument(instr)) return false;
  return true;
}

function normalizeDrumMicStandAssignments(raw) {
  if(!raw || typeof raw !== 'object') return {};
  const out = {};
  Object.keys(raw).forEach(k => {
    out[String(k)] = !!raw[k];
  });
  return out;
}

function getDrumMicStandUnitCount(label) {
  return String(label || '').toLowerCase() === 'overheads stereo' ? 2 : 1;
}

function getMicStandMaxForInstrument(instr) {
  if(!instr || !supportsMicStandOption(instr)) return 0;
  if(instr.type === 'drumkit') {
    const mics = Array.isArray(instr.drumMics) ? instr.drumMics : [];
    return mics.reduce((sum, m) => sum + getDrumMicStandUnitCount(m), 0);
  }
  const stereoLike = !!(instr.stereo || instr.inputStereo || instr.outputStereo);
  return stereoLike ? 2 : 1;
}

function getMicStandCount(instr) {
  if(!instr || !supportsMicStandOption(instr)) return 0;
  if(isWirelessReceiverNode(instr)) {
    const micNode = getWirelessMicNode(instr);
    if(micNode) return Math.max(0, parseInt(micNode.micStandCount, 10) || 0);
  }
  if(instr.type === 'drumkit') {
    const selected = new Set(Array.isArray(instr.drumMics) ? instr.drumMics : []);
    const map = normalizeDrumMicStandAssignments(instr.drumMicStandAssignments);
    let total = 0;
    Object.keys(map).forEach(label => {
      if(!map[label] || !selected.has(label)) return;
      total += getDrumMicStandUnitCount(label);
    });
    return total;
  }
  const max = getMicStandMaxForInstrument(instr);
  const count = Math.max(0, parseInt(instr.micStandCount, 10) || 0);
  return Math.max(0, Math.min(max, count));
}

function clampMicStandCountForInstrument(instr, value) {
  const max = getMicStandMaxForInstrument(instr);
  const next = Math.max(0, parseInt(value, 10) || 0);
  return Math.max(0, Math.min(max, next));
}

function getEffectiveInstrumentImage(instr) {
  if(!instr) return null;
  return instr.image || getInstrumentImage(instr.type);
}

function connectorModeToCableTypes(mode) {
  if(mode === 'jack') return ['ts'];
  return ['xlr'];
}

function normalizeMicModels(raw) {
  if(Array.isArray(raw)) return raw.filter(Boolean).map(v => String(v).trim()).filter(Boolean);
  if(typeof raw === 'string' && raw.trim()) return [raw.trim()];
  return [];
}

function normalizePinMicAssignments(raw) {
  if(!raw || typeof raw !== 'object') return {};
  const out = {};
  Object.keys(raw).forEach(k => {
    const v = String(raw[k] || '').trim();
    if(v) out[k] = v;
  });
  return out;
}

function normalizeMicOptionName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function getAllMicOptions() {
  return [...new Set([...MIC_OPTIONS_BASE, ...customMicOptions])];
}

function loadCustomMicOptions() {
  try {
    const raw = localStorage.getItem(CUSTOM_MIC_STORAGE_KEY);
    if(!raw) {
      customMicOptions = [];
      return;
    }
    const parsed = JSON.parse(raw);
    customMicOptions = Array.isArray(parsed)
      ? [...new Set(parsed.map(normalizeMicOptionName).filter(Boolean))]
      : [];
  } catch(_err) {
    customMicOptions = [];
  }
}

function saveCustomMicOptions() {
  try {
    localStorage.setItem(CUSTOM_MIC_STORAGE_KEY, JSON.stringify(customMicOptions));
  } catch(_err) {
    // Ignore storage write failures (private mode/quota)
  }
}

function renderCustomMicOptionsUI() {
  const select = document.getElementById('mic-custom-list');
  if(!select) return;
  if(!customMicOptions.length) {
    select.innerHTML = '<option value="">No custom mics yet</option>';
    select.disabled = true;
    return;
  }
  select.disabled = false;
  select.innerHTML = customMicOptions.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
}

function addCustomMicOption() {
  const input = document.getElementById('mic-custom-input');
  if(!input) return;
  const name = normalizeMicOptionName(input.value);
  if(!name) return;
  if(getAllMicOptions().includes(name)) {
    input.value = '';
    return;
  }
  customMicOptions.push(name);
  customMicOptions = [...new Set(customMicOptions.map(normalizeMicOptionName).filter(Boolean))];
  saveCustomMicOptions();
  renderCustomMicOptionsUI();
  input.value = '';
  if(selectedId) {
    const instr = instruments.find(i => i.id === selectedId);
    if(instr && supportsMicPickup(instr)) renderMicAssignmentsUI(instr);
  }
}

function removeSelectedCustomMicOption() {
  const select = document.getElementById('mic-custom-list');
  if(!select || !select.value) return;
  const victim = normalizeMicOptionName(select.value);
  customMicOptions = customMicOptions.filter(v => v !== victim);
  saveCustomMicOptions();
  renderCustomMicOptionsUI();
  if(selectedId) {
    const instr = instruments.find(i => i.id === selectedId);
    if(instr && supportsMicPickup(instr)) renderMicAssignmentsUI(instr);
  }
}

function getMicTargetsForInstrument(instr) {
  if(!instr) return [];
  if(instr.type === 'drumkit') {
    return getDrumMicPins(instr).map(p => ({ pin: p.key, label: p.label }));
  }
  if(instr.stereo) {
    return [
      { pin: 'L', label: 'Left' },
      { pin: 'R', label: 'Right' },
    ];
  }
  return [{ pin: 'MONO', label: 'Input' }];
}

function hasAnyAssignedMic(instr) {
  return !!(instr && instr.pinMicAssignments && Object.keys(instr.pinMicAssignments).some(k => instr.pinMicAssignments[k]));
}

function derivePinMicAssignments(raw, instr) {
  const explicit = normalizePinMicAssignments(raw && raw.pinMicAssignments);
  if(Object.keys(explicit).length) return explicit;
  const legacy = normalizeMicModels(raw && (raw.micModels ?? raw.micModel));
  if(!legacy.length) return {};
  const targets = getMicTargetsForInstrument(instr);
  if(!targets.length) return {};
  const out = {};
  targets.forEach((t, idx) => {
    out[t.pin] = legacy[Math.min(idx, legacy.length - 1)];
  });
  return out;
}

function getPinMicNote(instr, pin) {
  const map = normalizePinMicAssignments(instr && instr.pinMicAssignments);
  return map[pinKey(pin)] || '';
}

function getMixerInputBreakdown(instr) {
  const xlrOnly = Math.max(0, Number(instr && instr.mixerInputXlrOnly) || 0);
  const combo = Math.max(0, Number(instr && instr.mixerInputCombo) || 0);
  const auxInputs = Math.max(0, Number(instr && instr.mixerInputJackOnly) || 0);
  const taggedTotal = xlrOnly + combo + auxInputs;
  const mixerInputs = Math.max(0, Number(instr && instr.mixerInputs) || 0);
  if(taggedTotal > 0) {
    return { xlrOnly, combo, auxInputs, totalStandard: xlrOnly + combo };
  }
  const fallbackStandard = Math.max(0, mixerInputs - auxInputs);
  return { xlrOnly: fallbackStandard, combo: 0, auxInputs, totalStandard: fallbackStandard };
}

function getMixerAuxInputDisplayNumber(instr, auxIdx) {
  const idx = Math.max(1, Number(auxIdx) || 1);
  if(instr && instr.type === 'xr18') {
    const breakdown = getMixerInputBreakdown(instr);
    return Math.max(1, breakdown.totalStandard + idx);
  }
  return idx;
}

function getMixerAuxInputShortLabel(instr, auxIdx) {
  const idx = Math.max(1, Number(auxIdx) || 1);
  if(instr && instr.type === 'xr18') return String(getMixerAuxInputDisplayNumber(instr, idx));
  return `A${idx}`;
}

function getMixerAuxInputLongLabel(instr, auxIdx) {
  const idx = Math.max(1, Number(auxIdx) || 1);
  if(instr && instr.type === 'xr18') return `Input ${getMixerAuxInputDisplayNumber(instr, idx)} (Jack TS)`;
  return `Aux Input A${idx} (Jack TS)`;
}

function mapLegacyMixerPin(instr, pin) {
  const key = pinKey(pin);
  if(!instr || !isMixerBox(instr) || !key) return key;

  const noMainFamilies = new Set(['x32', 'x32compact', 'x32rack', 'wing', 'wingcompact', 'wingrack', 'm32', 'm32r']);

  const inputMatch = key.match(/^MX-IN-(\d+)$/);
  if(inputMatch) {
    const idx = parseInt(inputMatch[1], 10) || 1;
    const breakdown = getMixerInputBreakdown(instr);
    if(breakdown.auxInputs > 0 && idx > breakdown.totalStandard) {
      const auxIdx = idx - breakdown.totalStandard;
      if(auxIdx >= 1 && auxIdx <= breakdown.auxInputs) return `MX-AUX-IN-${auxIdx}`;
    }
  }

  if(key.startsWith('MX-MAIN-') && (Number(instr.mixerMain) === 0 || noMainFamilies.has(instr.type))) {
    const mainIdx = parseInt(key.replace('MX-MAIN-', ''), 10) || 1;
    const xlrOutCount = Math.max(0, Number(instr.mixerAux) || 0);
    if(xlrOutCount > 0) {
      if(instr.type === 'x32compact' || instr.type === 'x32rack') {
        const mapped = 6 + mainIdx;
        if(mapped <= xlrOutCount) return `MX-AUX-${mapped}`;
      }
      if(instr.type === 'x32') {
        const mapped = 14 + mainIdx;
        if(mapped <= xlrOutCount) return `MX-AUX-${mapped}`;
      }
      const fallback = Math.min(xlrOutCount, mainIdx);
      if(fallback >= 1) return `MX-AUX-${fallback}`;
    }
  }

  return key;
}

function normalizeAllMixerConnectionPins() {
  connections.forEach(conn => {
    const fromInstr = instruments.find(i => i.id === conn.fromId);
    const toInstr = instruments.find(i => i.id === conn.toId);
    conn.fromPin = mapLegacyMixerPin(fromInstr, conn.fromPin);
    conn.toPin = mapLegacyMixerPin(toInstr, conn.toPin);
  });
}

function getPinAllowedCableTypes(instr, pin) {
  const p = pinKey(pin);
  if(!instr) return ['xlr', 'ts', 'trs', 'ethernet', 'usb'];

  if(isSpeakerWithThru(instr)) {
    if(p === 'SPK-IN') return speakerConnectorModeToCableTypes(normalizeSpeakerConnectorMode(instr.spkInputMode, 'xlr'));
    if(p === 'SPK-OUT') return speakerConnectorModeToCableTypes(normalizeSpeakerConnectorMode(instr.spkOutputMode, 'xlr'));
  }

  if(instr.type === 'amp') {
    if(p === 'AMP-IN' || p.startsWith('AMP-IN-')) return ['xlr'];
    if(p === 'AMP-OUT' || p.startsWith('AMP-OUT-')) return ['speakon'];
  }

  if(instr.type === 'poweramp') {
    if(p.startsWith('PAMP-IN-')) return ['xlr'];
    if(p.startsWith('PAMP-OUT-')) return ['speakon'];
  }

  if(instr.type === 'di' || instr.type === 'pedals') {
    if(p.startsWith('IO-IN-')) return ['xlr', 'ts'];
    if(p.startsWith('IO-OUT-')) return ['xlr'];
  }

  if(instr.type === 'scarlet2i2') {
    if(p === 'IO-IN-1' || p === 'IO-IN-2') return ['xlr', 'ts'];
    if(p === 'IO-USB') return ['usb'];
    if(p === 'IO-OUT-1' || p === 'IO-OUT-2') return ['ts'];
    if(p === 'IO-OUT-HP') return ['trs'];
  }

  if(instr.type === 'ha8000') {
    if(p.startsWith('HA-IN-')) return ['ts'];
    if(p.startsWith('HA-OUT-')) return ['trs'];
  }

  if(instr.type === 'ha400') {
    if(p === 'IO-IN-TRS') return ['trs'];
    if(p.startsWith('IO-OUT-')) return ['trs'];
  }

  if(instr.type === 'laptop') {
    if(p === 'IO-IN-TRS') return ['trs'];
    if(p === 'IO-USB') return ['usb'];
  }

  if(instr.type === 'router') {
    if(p.startsWith('ROUTER-LAN-')) return ['ethernet'];
  }

  if(instr.type === 'p16d') {
    if(p === 'P16D-IN' || p.startsWith('P16D-OUT-')) return ['ethernet'];
  }

  if(isSnakeBox(instr)) {
    if(isSnakeInputPinKey(p)) return instr.snakeAllowJackInputs ? ['xlr', 'ts', 'trs'] : ['xlr'];
    if(isSnakeOutputPinKey(p)) return ['xlr'];
  }

  if(isOutletBox(instr)) {
    if(p.startsWith('OUTLET-IN-') || p.startsWith('OUTLET-OUT-')) {
      return [getOutletPortCableTypeForPin(instr, p)];
    }
  }

  if(isMixerBox(instr)) {
    if(p.startsWith('MX-IN-')) {
      const idx = parseInt(p.replace('MX-IN-', ''), 10) || 1;
      const breakdown = getMixerInputBreakdown(instr);
      if((breakdown.xlrOnly + breakdown.combo + breakdown.auxInputs) > 0) {
        const xlrOnly = breakdown.xlrOnly;
        const combo = breakdown.combo;
        if(idx <= xlrOnly) return ['xlr'];
        if(idx <= (xlrOnly + combo)) return ['xlr', 'ts'];
        return ['xlr'];
      }
      return idx <= 16 ? ['xlr', 'ts'] : ['ts'];
    }
    if(p.startsWith('MX-AUX-IN-')) return ['ts'];
    if(p.startsWith('MX-AUX-') || p.startsWith('MX-MAIN-')) return ['xlr'];
    if(p.startsWith('MX-JACK-OUT-')) return ['ts'];
    if(p.startsWith('MX-HP-')) return ['trs'];
    if(p.startsWith('MX-P16-')) return ['ethernet'];
    if(p.startsWith('MX-AES50-')) return ['ethernet'];
    if(p.startsWith('MX-USB-')) return ['usb'];
  }

  if(instr.type === 'p16') {
    if(p === 'P16-IN' || p === 'P16-THRU' || p === 'MONO' || p === 'L' || p === 'R') return ['ethernet'];
    if(p === 'P16-HP') return ['trs'];
  }
  if((instr.type === 'iem' || instr.type === 'headphones') && (p === 'MONO' || p === 'L' || p === 'R')) return ['trs'];
  if(instr.type === 'keys' && (p === 'MONO' || p === 'L' || p === 'R')) return ['xlr', 'ts'];

  if(p.startsWith('DM-')) return ['xlr'];
  if(p === 'L' || p === 'R' || p === 'MONO') {
    if(hasAttachedAccessory(instr)) {
      const accessoryOutType = normalizeAttachedAccessoryCableType(instr.attachedAccessoryOutputCableType || instr.attachedAccessoryCableType);
      return [accessoryOutType];
    }
    return connectorModeToCableTypes(instr.connectorMode || getDefaultConnectorMode(instr.type));
  }
  return ['xlr', 'ts', 'trs', 'usb'];
}

function getCableTypeLabel(typeId) {
  const hit = CABLE_TYPES.find(c => c.id === typeId);
  return hit ? hit.label : String(typeId || '').toUpperCase();
}

function getCableTypeColor(typeId) {
  const hit = CABLE_TYPES.find(c => c.id === typeId);
  return hit ? hit.color : '#47c4ff';
}

function shadeHexColor(hexColor, multiplier = 1) {
  const hex = String(hexColor || '').trim().replace('#', '');
  if(!/^[0-9a-fA-F]{6}$/.test(hex)) return '#47c4ff';
  const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(parseInt(hex.slice(0, 2), 16) * multiplier);
  const g = clamp(parseInt(hex.slice(2, 4), 16) * multiplier);
  const b = clamp(parseInt(hex.slice(4, 6), 16) * multiplier);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getContrastTextColor(hexColor) {
  const hex = String(hexColor || '').trim().replace('#', '');
  if(!/^[0-9a-fA-F]{6}$/.test(hex)) return '#ffffff';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = ((0.2126 * r) + (0.7152 * g) + (0.0722 * b)) / 255;
  return luminance > 0.6 ? '#0a0b0d' : '#ffffff';
}

function getOutletPortVisualStyle(instr, index) {
  const base = getCableTypeColor(outletModeToCableType(getOutletPortMode(instr, index)));
  const border = shadeHexColor(base, 0.78);
  const used = shadeHexColor(base, 0.88);
  const text = getContrastTextColor(base);
  const usedText = getContrastTextColor(used);
  return `--outlet-pin-bg:${base};--outlet-pin-border:${border};--outlet-pin-text:${text};--outlet-pin-used-bg:${used};--outlet-pin-used-border:${border};--outlet-pin-used-text:${usedText};`;
}

function getPinConnectionTypeLabel(instr, pin) {
  const types = getPinAllowedCableTypes(instr, pin);
  if(!Array.isArray(types) || !types.length) return 'Unknown';
  return types.map(getCableTypeLabel).join(' / ');
}

function getPinBaseLabel(instr, pin, baseLabel) {
  const key = pinKey(pin);
  if(key === 'P16-HP' || key === 'IO-OUT-HP' || key.startsWith('MX-HP-')) return 'Headphones';
  return baseLabel;
}

function buildPinTitle(instr, pin, baseLabel) {
  return `${getPinBaseLabel(instr, pin, baseLabel)} - ${getPinConnectionTypeLabel(instr, pin)}`;
}

function getInstrumentImage(type) {
  return ICON_ASSET_BY_TYPE[type] || null;
}

function buildTileIconHTML(instr) {
  const imagePath = instr.image || getInstrumentImage(instr.type);
  if(imagePath) return `<img class="icon-img" src="${imagePath}" alt="${instr.name}" draggable="false">`;
  return `<span class="icon-emoji">${instr.icon}</span>`;
}

function buildStageIconHTML(instr, iconFontSize) {
  const imagePath = getEffectiveInstrumentImage(instr);
  if(imagePath) return `<img class="icon-img" src="${imagePath}" alt="${getVisibleInstrumentLabel(instr)}" draggable="false">`;
  return `<span class="icon-emoji" style="font-size:${iconFontSize}px;">${instr.icon}</span>`;
}

function getPinSlotPercent(slot = 0, count = 1, edgePadding = 14) {
  if(count <= 1) return 50;
  if(count === 2) return slot === 0 ? 38 : 62;
  const edgePad = Math.max(0, Math.min(25, Number(edgePadding) || 14));
  const span = 100 - (edgePad * 2);
  return edgePad + ((slot + 1) * (span / (count + 1)));
}

function getMainPinStyle(side, slot = 0, count = 1, edgePadding = 14) {
  const pct = getPinSlotPercent(slot, count, edgePadding);
  const edgeNudge = 'var(--pin-edge-nudge, 0%)';
  if(side === 'top') return `top:0;bottom:auto;left:${pct}%;right:auto;transform:translateX(-50%) translateY(calc(-50% - ${edgeNudge}));`;
  if(side === 'right') return `left:100%;right:auto;top:${pct}%;bottom:auto;transform:translateY(-50%) translateX(calc(-50% + ${edgeNudge}));`;
  if(side === 'left') return `left:0;right:auto;top:${pct}%;bottom:auto;transform:translateY(-50%) translateX(calc(-50% - ${edgeNudge}));`;
  return `top:100%;bottom:auto;left:${pct}%;right:auto;transform:translateX(-50%) translateY(calc(-50% + ${edgeNudge}));`;
}

function getPinTagStyle(side, slot = 0, count = 1, edgePadding = 14) {
  const pct = getPinSlotPercent(slot, count, edgePadding);
  if(side === 'top') return `top:-16px;bottom:auto;left:${pct}%;right:auto;transform:translateX(-50%);`;
  if(side === 'right') return `right:-17px;left:auto;top:${pct}%;bottom:auto;transform:translateY(-50%);`;
  if(side === 'left') return `left:-17px;right:auto;top:${pct}%;bottom:auto;transform:translateY(-50%);`;
  return `bottom:-16px;top:auto;left:${pct}%;right:auto;transform:translateX(-50%);`;
}

function oppositeSide(side) {
  if(side === 'top') return 'bottom';
  if(side === 'bottom') return 'top';
  if(side === 'left') return 'right';
  return 'left';
}

function getDefaultSizeForType(type, fallback = 52) {
  const def = INSTRUMENTS.find(i => i.type === type);
  if(!def && type === 'wirelessreceiver') {
    const micDef = INSTRUMENTS.find(i => i.type === 'wirelessmic');
    return micDef ? (Number(micDef.size) || fallback) : fallback;
  }
  return def ? (Number(def.size) || fallback) : fallback;
}

function cloneInstruments(list) {
  return list.map(i => ({
    ...i,
    outletPortModes: i && i.outletPortModes && typeof i.outletPortModes === 'object'
      ? { ...i.outletPortModes }
      : i.outletPortModes,
    outletPortNames: i && i.outletPortNames && typeof i.outletPortNames === 'object'
      ? { ...i.outletPortNames }
      : i.outletPortNames,
    drumMics: Array.isArray(i.drumMics) ? [...i.drumMics] : i.drumMics,
    drumMicStandAssignments: i && i.drumMicStandAssignments && typeof i.drumMicStandAssignments === 'object'
      ? { ...i.drumMicStandAssignments }
      : i.drumMicStandAssignments,
    attachedAccessoryType: normalizeAttachedAccessoryType(i && i.attachedAccessoryType),
    attachedAccessoryCableType: normalizeAttachedAccessoryCableType(i && i.attachedAccessoryCableType),
    attachedAccessoryInputCableType: normalizeAttachedAccessoryCableType(i && i.attachedAccessoryInputCableType),
    attachedAccessoryOutputCableType: normalizeAttachedAccessoryCableType(i && i.attachedAccessoryOutputCableType),
    attachedAccessoryStereo: !!(i && i.attachedAccessoryStereo),
  }));
}

function cloneConnections(list) {
  return list.map(c => {
    const normalizedCableType = normalizeCableType(c.cableType || 'xlr');
    const cable = CABLE_TYPES.find(t => t.id === normalizedCableType) || CABLE_TYPES[0];
    return {
      ...c,
      cableType: normalizedCableType,
      color: cable.color,
      label: cable.label,
    };
  });
}

function cloneStageParts(list) {
  return list.map(p => ({ ...p }));
}

function captureSnapshot() {
  return {
    projectName,
    stageW,
    stageD,
    showStageStairs,
    showMainStage: !!showMainStage,
    showStageGrid: !!showStageGrid,
    suppressBuiltInStairsPart: !!suppressBuiltInStairsPart,
    themeMode,
    stageColor,
    isStageBuilderMode: !!isStageBuilderMode,
    instruments: cloneInstruments(instruments),
    connections: cloneConnections(connections),
    stageParts: cloneStageParts(stageParts),
    selectedId,
    selectedStagePartId,
    idCounter,
    stagePartIdCounter,
    selectedCable,
  };
}

function applySnapshot(snapshot, keepCleanState, preserveDirtyState = false) {
  isRestoringHistory = true;
  const wasDirty = !!hasUnsavedChanges;
  instruments.forEach(i => { const el = getEl(i.id); if(el) el.remove(); });
  stageParts.forEach(p => { const el = getStagePartEl(p.id); if(el) el.remove(); });

  projectName = snapshot.projectName || 'untitled-project';
  stageW = snapshot.stageW;
  stageD = snapshot.stageD;
  showStageStairs = !!snapshot.showStageStairs;
  showMainStage = snapshot.showMainStage !== false;
  showStageGrid = snapshot.showStageGrid !== false;
  suppressBuiltInStairsPart = !!snapshot.suppressBuiltInStairsPart;
  themeMode = snapshot.themeMode === 'dark' ? 'dark' : DEFAULT_THEME_MODE;
  stageColor = /^#[0-9a-fA-F]{6}$/.test(String(snapshot.stageColor || '')) ? snapshot.stageColor : DEFAULT_STAGE_COLOR;
  isStageBuilderMode = !!snapshot.isStageBuilderMode;
  instruments = cloneInstruments(snapshot.instruments || []);
  instruments.forEach(i => normalizeConnectionBoxFlags(i));
  connections = cloneConnections(snapshot.connections || []);
  stageParts = cloneStageParts(snapshot.stageParts || []);
  if(showMainStage && !stageParts.some(p => p.isPrimary)) {
    const fallbackPrimary = ensureDefaultMainStagePart(stagePx);
    if(fallbackPrimary) fallbackPrimary.label = 'WORK STAGE';
  }
  ensureDefaultStageStairsPart(stagePx);
  normalizeAllSnakeConnectionPins();
  selectedId = snapshot.selectedId || null;
  selectedStagePartId = snapshot.selectedStagePartId || null;
  idCounter = snapshot.idCounter || 0;
  stagePartIdCounter = snapshot.stagePartIdCounter || 0;
  selectedCable = normalizeCableType(snapshot.selectedCable || 'xlr');
  connectingFrom = null;
  drawingLine = null;

  document.getElementById('dim-w').value = stageW;
  document.getElementById('dim-d').value = stageD;
  const stairsToggle = document.getElementById('stage-stairs-toggle');
  if(stairsToggle) stairsToggle.checked = showStageStairs;
  applyThemeMode();
  applyStageColor();
  updateProjectNameUI();
  updateSnakeViewToggleUI();
  refreshCategoryCollapseButtons();
  applyModeUI();
  updateStage(true);

  if(!isStageBuilderMode && selectedId && instruments.some(i => i.id === selectedId)) {
    selectInstrument(selectedId);
  } else if(isStageBuilderMode && selectedStagePartId && stageParts.some(p => p.id === selectedStagePartId)) {
    selectStagePart(selectedStagePartId);
  } else {
    selectedId = null;
    selectedStagePartId = null;
    updateSelectionPanels();
  }

  if(preserveDirtyState) {
    if(wasDirty) markDirty();
    else markClean();
  } else if(keepCleanState) markClean();
  else markDirty();
  isRestoringHistory = false;
}

function pushHistoryState() {
  if(isRestoringHistory) return;
  historyStack.push(captureSnapshot());
  if(historyStack.length > HISTORY_LIMIT) historyStack.shift();
  redoStack = [];
}

function getSnapshotSignature(snapshot) {
  if(!snapshot || typeof snapshot !== 'object') return '';
  const instrSig = (snapshot.instruments || []).map(i => [
    i.id, i.type, i.label, i.channel, i.notes, i.x, i.y, i.size, i.angle,
    i.stereo, i.inputStereo, i.outputStereo, i.connectorMode, i.connSide,
    i.attachedAccessoryType, i.attachedAccessoryStereo, i.micStandCount,
    i.wirelessPairId, i.wirelessRole, i.hideWirelessReceiver,
  ].join('|')).join('||');
  const connSig = (snapshot.connections || []).map(c => [
    c.id, c.fromId, c.fromPin, c.toId, c.toPin, c.cableType, c.routeX,
  ].join('|')).join('||');
  const stagePartSig = (snapshot.stageParts || []).map(p => [
    p.id, p.shape, p.label, p.x, p.y, p.widthM, p.depthM, p.color,
  ].join('|')).join('||');
  return [
    snapshot.stageW,
    snapshot.stageD,
    snapshot.showStageStairs,
    snapshot.showMainStage,
    snapshot.showStageGrid,
    snapshot.suppressBuiltInStairsPart,
    snapshot.themeMode,
    snapshot.stageColor,
    snapshot.isStageBuilderMode,
    snapshot.selectedId,
    snapshot.selectedStagePartId,
    snapshot.idCounter,
    snapshot.stagePartIdCounter,
    snapshot.selectedCable,
    instrSig,
    connSig,
    stagePartSig,
  ].join('###');
}

function commitSnapshotBeforeChange(snapshotBefore) {
  if(isRestoringHistory || !snapshotBefore) return false;
  const snapshotAfter = captureSnapshot();
  const changed = getSnapshotSignature(snapshotBefore) !== getSnapshotSignature(snapshotAfter);
  if(!changed) return false;
  historyStack.push(snapshotBefore);
  if(historyStack.length > HISTORY_LIMIT) historyStack.shift();
  redoStack = [];
  return true;
}

function undoAction() {
  if(historyStack.length <= 1) return;
  const previous = historyStack.pop();
  if(!previous) return;
  redoStack.push(captureSnapshot());
  if(redoStack.length > HISTORY_LIMIT) redoStack.shift();
  applySnapshot(previous, false);
}

function redoAction() {
  if(redoStack.length < 1) return;
  const next = redoStack.pop();
  if(!next) return;
  historyStack.push(captureSnapshot());
  if(historyStack.length > HISTORY_LIMIT) historyStack.shift();
  applySnapshot(next, false);
}

function serializeLayout() {
  ensureSceneSystemInitialized();
  saveCurrentSceneState();
  ensureAllConnectionsRouteNorm(stagePx);
  ensureAllStagePartsNorm(stagePx);
  const serializedScenes = scenes.map((scene, index) => ({
    id: scene.id,
    order: index + 1,
    name: String(scene.name || `Scene ${indexToLetters(index + 1)}`),
    state: cloneSceneState(scene.state),
  }));
  return {
    version:4,
    created:new Date().toISOString(),
    projectName,
    showMainStage: !!showMainStage,
    showStageGrid: !!showStageGrid,
    isStageBuilderMode: !!isStageBuilderMode,
    stage:{widthM:stageW, depthM:stageD, showStairs:showStageStairs, suppressBuiltInStairsPart:!!suppressBuiltInStairsPart, themeMode, color:stageColor},
    instruments:instruments.map(({id,type,cat,icon,image,label,channel,notes,x,y,stageNX,stageNY,size,wide,angle,stereo,inputStereo,outputStereo,ampOutputs,haUseMainInputs,spkInputMode,spkOutputMode,connectorMode,pinMicAssignments,connSide,connectionBoxKind,isMixer,mixerInputs,mixerInputXlrOnly,mixerInputCombo,mixerInputJackOnly,mixerAux,mixerMain,mixerJackOut,mixerP16,mixerAes50,outletConnectorType,outletPorts,outletViewMode,outletPortModes,outletPortNames,outletPlacement,isSnake,snakeViewMode,snakeChannels,snakeAllowJackInputs,snakeOutputs,requiresOutput,drumMics,drumMicStandAssignments,micStandCount,attachedAccessoryType,attachedAccessoryCableType,attachedAccessoryInputCableType,attachedAccessoryOutputCableType,attachedAccessoryStereo,collapsed,noConnect,wirelessPairId,wirelessRole,hideWirelessReceiver})=>({
      id,type,cat,icon,image,label,channel,notes,x,y,stageNX,stageNY,size,wide,angle,stereo,inputStereo,outputStereo,ampOutputs,
      haUseMainInputs:!!haUseMainInputs,spkInputMode,spkOutputMode,connectorMode,pinMicAssignments,
      micModels:Object.values(pinMicAssignments||{}),micModel:Object.values(pinMicAssignments||{})[0]||'',
      connSide,connectionBoxKind: inferConnectionBoxKind({ connectionBoxKind, isSnake, isMixer, cat, type }) || '',
      isMixer,mixerInputs,mixerInputXlrOnly,mixerInputCombo,mixerInputJackOnly,mixerAux,mixerMain,mixerJackOut,mixerP16,mixerAes50,
      outletConnectorType,outletPorts,outletViewMode,outletPortModes,outletPortNames,outletPlacement,
      isSnake,snakeViewMode:normalizeSnakeViewMode(snakeViewMode),snakeChannels,snakeAllowJackInputs,snakeOutputs,requiresOutput,
      drumMics,drumMicStandAssignments,micStandCount,
      attachedAccessoryType: normalizeAttachedAccessoryType(attachedAccessoryType),
      attachedAccessoryCableType: normalizeAttachedAccessoryCableType(attachedAccessoryCableType),
      attachedAccessoryInputCableType: normalizeAttachedAccessoryCableType(attachedAccessoryInputCableType || attachedAccessoryCableType),
      attachedAccessoryOutputCableType: normalizeAttachedAccessoryCableType(attachedAccessoryOutputCableType || attachedAccessoryCableType),
      attachedAccessoryStereo: !!attachedAccessoryStereo,
      noConnect:!!noConnect,collapsed:!!collapsed,wirelessPairId:Number.isFinite(Number(wirelessPairId)) ? Number(wirelessPairId) : null,wirelessRole:wirelessRole || '',hideWirelessReceiver:!!hideWirelessReceiver
    })),
    connections:connections.map(({id,fromId,toId,fromPin,toPin,cableType,color,label,routeX,routeNX})=>({id,fromId,toId,fromPin,toPin,cableType,color,label,routeX,routeNX})),
    stageParts:stageParts.map(({id,shape,isPrimary,label,x,y,stageNX,stageNY,widthM,depthM,color,hasSteps})=>({id,shape,isPrimary:!!isPrimary,label,x,y,stageNX,stageNY,widthM,depthM,color,hasSteps:!!hasSteps})),
    scenes: serializedScenes,
    activeSceneId,
    sceneIdCounter,
  };
}

function buildCatTabs() {
  const w = document.getElementById('cat-tabs'); w.innerHTML = '';
  CATS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'cat-tab' + (c.id==='all'?' active':'');
    b.textContent = c.label;
    b.onclick = () => {
      document.querySelectorAll('.cat-tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); buildPalette(c.id);
    };
    w.appendChild(b);
  });
}

function buildPalette(cat) {
  const grid = document.getElementById('pal'); grid.innerHTML = '';
  const dedicatedCats = new Set(['mixers', 'stageboxes', 'monitoring', 'accessories', 'stands']);
  const baseList = INSTRUMENTS.filter(i => !dedicatedCats.has(i.cat));
  const list = cat==='all' ? baseList : baseList.filter(i=>i.cat===cat);
  list.forEach(instr => {
    const t = makeTile(buildTileIconHTML(instr), instr.name, false, instr.size);
    t.addEventListener('dragstart', e => { isDraggingNew=true; newDragData={...instr}; e.dataTransfer.effectAllowed='copy'; });
    t.addEventListener('dragend', () => { isDraggingNew=false; newDragData=null; });
    t.addEventListener('touchstart', e => { startTouchPaletteDrag(e, {...instr}); }, { passive: false });
    grid.appendChild(t);
  });
}

function buildSnakePalette() {
  const grid = document.getElementById('snake-pal'); grid.innerHTML = '';
  SNAKES.forEach(s => {
    const snakeImage = getInstrumentImage(s.type) || 'images/snake8.png';
    const snakeIcon = `<img class="icon-img" src="${snakeImage}" alt="${s.name}" draggable="false">`;
    const t = makeTile(snakeIcon, s.name, true, null, 'snake-tile');
    t.addEventListener('dragstart', e => {
      isDraggingNew=true;
      newDragData={
		type:s.type,
		cat:'snake',
		icon:'ðŸ',
		image:snakeImage,
		name:s.name,
    connectionBoxKind:'snake',
		snakeChannels:s.channels,
		outputs:s.outputs,
		wide:false
	  };
      e.dataTransfer.effectAllowed='copy';
    });
    t.addEventListener('dragend', () => { isDraggingNew=false; newDragData=null; });
    t.addEventListener('touchstart', e => {
      startTouchPaletteDrag(e, {
        type:s.type,
        cat:'snake',
        icon:'ðŸ',
        image:snakeImage,
        name:s.name,
        connectionBoxKind:'snake',
        snakeChannels:s.channels,
        outputs:s.outputs,
        wide:false
      });
    }, { passive: false });
    grid.appendChild(t);
  });
}

function buildMixerPalette() {
  const grid = document.getElementById('mixer-pal');
  if(!grid) return;
  grid.innerHTML = '';
  const list = INSTRUMENTS.filter(i => i.cat === 'mixers');
  list.forEach(instr => {
    const t = makeTile(buildTileIconHTML(instr), instr.name, false, instr.size, 'mixer-tile');
    t.addEventListener('dragstart', e => { isDraggingNew=true; newDragData={...instr, connectionBoxKind:'mixer'}; e.dataTransfer.effectAllowed='copy'; });
    t.addEventListener('dragend', () => { isDraggingNew=false; newDragData=null; });
    t.addEventListener('touchstart', e => { startTouchPaletteDrag(e, {...instr, connectionBoxKind:'mixer'}); }, { passive: false });
    grid.appendChild(t);
  });
}

function buildStageboxPalette() {
  const grid = document.getElementById('stagebox-pal');
  if(!grid) return;
  grid.innerHTML = '';
  const list = INSTRUMENTS.filter(i => i.cat === 'stageboxes');
  list.forEach(instr => {
    const t = makeTile(buildTileIconHTML(instr), instr.name, false, instr.size, 'stagebox-tile');
    t.addEventListener('dragstart', e => { isDraggingNew=true; newDragData={...instr, connectionBoxKind:'stagebox'}; e.dataTransfer.effectAllowed='copy'; });
    t.addEventListener('dragend', () => { isDraggingNew=false; newDragData=null; });
    t.addEventListener('touchstart', e => { startTouchPaletteDrag(e, {...instr, connectionBoxKind:'stagebox'}); }, { passive: false });
    grid.appendChild(t);
  });
}

function getCategoryInstruments(category) {
  if(category === 'snake') return instruments.filter(i => i && isSnakeBox(i));
  if(category === 'mixers') return instruments.filter(i => i && i.cat === 'mixers');
  if(category === 'stageboxes') return instruments.filter(i => i && i.cat === 'stageboxes');
  return [];
}

function isCategoryFullyCollapsed(category) {
  const items = getCategoryInstruments(category);
  if(!items.length) return false;
  return items.every(i => !!i.collapsed);
}

function refreshCategoryCollapseButtons() {
  const mapping = [
    { category:'snake', id:'snake-collapse-all-btn', label:'Snakes' },
    { category:'mixers', id:'mixer-collapse-all-btn', label:'Mixers' },
    { category:'stageboxes', id:'stagebox-collapse-all-btn', label:'Stageboxes' },
  ];
  mapping.forEach(cfg => {
    const btn = document.getElementById(cfg.id);
    if(!btn) return;
    const items = getCategoryInstruments(cfg.category);
    const allCollapsed = items.length > 0 && items.every(i => !!i.collapsed);
    btn.disabled = !items.length;
    btn.classList.toggle('active', allCollapsed);
    btn.textContent = items.length
      ? (allCollapsed ? `Expand ${cfg.label}` : `Collapse ${cfg.label}`)
      : `No ${cfg.label}`;
  });
}

function toggleCategoryCollapse(category) {
  const items = getCategoryInstruments(category);
  if(!items.length) return;
  const next = !isCategoryFullyCollapsed(category);
  const changed = items.some(i => !!i.collapsed !== next);
  if(!changed) return;
  pushHistoryState();
  items.forEach(i => {
    i.collapsed = next;
    renderInstrument(i);
  });
  markDirty();
  refreshCategoryCollapseButtons();
  render();
}

function toggleInstrumentCollapsed(id) {
  const instr = instruments.find(i => i.id === id);
  if(!instr || !isConnectionBoxInstrument(instr)) return;
  pushHistoryState();
  instr.collapsed = !instr.collapsed;
  markDirty();
  renderInstrument(instr);
  refreshCategoryCollapseButtons();
  render();
}

function buildMonitoringPalette() {
  const grid = document.getElementById('monitor-pal');
  if(!grid) return;
  grid.innerHTML = '';
  const list = INSTRUMENTS.filter(i => i.cat === 'monitoring');
  list.forEach(instr => {
    const t = makeTile(buildTileIconHTML(instr), instr.name, false, instr.size, 'monitor-pa-tile');
    t.addEventListener('dragstart', e => { isDraggingNew=true; newDragData={...instr}; e.dataTransfer.effectAllowed='copy'; });
    t.addEventListener('dragend', () => { isDraggingNew=false; newDragData=null; });
    t.addEventListener('touchstart', e => { startTouchPaletteDrag(e, {...instr}); }, { passive: false });
    grid.appendChild(t);
  });
}

function buildAccessoryPalette() {
  const grid = document.getElementById('accessory-pal');
  if(!grid) return;
  grid.innerHTML = '';
  const list = INSTRUMENTS.filter(i => i.cat === 'accessories');
  list.forEach(instr => {
    const t = makeTile(buildTileIconHTML(instr), instr.name, false, instr.size, 'accessory-tile');
    t.addEventListener('dragstart', e => { isDraggingNew=true; newDragData={...instr}; e.dataTransfer.effectAllowed='copy'; });
    t.addEventListener('dragend', () => { isDraggingNew=false; newDragData=null; });
    t.addEventListener('touchstart', e => { startTouchPaletteDrag(e, {...instr}); }, { passive: false });
    grid.appendChild(t);
  });
}

function buildStandPalette() {
  const grid = document.getElementById('stand-pal');
  if(!grid) return;
  grid.innerHTML = '';
  const list = INSTRUMENTS.filter(i => i.cat === 'stands');
  list.forEach(instr => {
    const t = makeTile(buildTileIconHTML(instr), instr.name, false, instr.size, 'stand-tile');
    t.addEventListener('dragstart', e => { isDraggingNew=true; newDragData={...instr}; e.dataTransfer.effectAllowed='copy'; });
    t.addEventListener('dragend', () => { isDraggingNew=false; newDragData=null; });
    t.addEventListener('touchstart', e => { startTouchPaletteDrag(e, {...instr}); }, { passive: false });
    grid.appendChild(t);
  });
}

function makeTile(icon, name, isSnake, instrumentSize, variantClass = '') {
  const t = document.createElement('div');
  t.className = 'pal-tile' + (isSnake ? ' snake-tile' : '') + (variantClass ? ` ${variantClass}` : '');
  t.draggable = true;
  const isRackTile = variantClass === 'mixer-tile';
  const base = isRackTile ? 52 : (Number(instrumentSize) || 52);
  const previewSize = Math.max(14, Math.min(34, Math.round(base * 0.33)));
  t.style.setProperty('--ti-size', `${previewSize}px`);
  t.innerHTML = `<div class="ti">${icon}</div><div class="tn">${name}</div>`;
  return t;
}

function buildCableColors() {
  const c = document.getElementById('cable-colors'); c.innerHTML = '';
  CABLE_TYPES.forEach(ct => {
    const r = document.createElement('div');
    r.className = 'ccrow' + (ct.id===selectedCable?' selected':'');
    r.id = 'cr-'+ct.id;
    r.innerHTML = `<div class="cswatch" style="background:${ct.color}"></div><span class="clabel">${ct.label}</span>`;
    r.onclick = () => { selectedCable=ct.id; document.querySelectorAll('.ccrow').forEach(x=>x.classList.remove('selected')); r.classList.add('selected'); };
    c.appendChild(r);
  });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// STAGE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function updateStage(skipDirty) {
  const prevStageFrame = normalizeStageFrame(stagePx);
  if(prevStageFrame) {
    ensureAllInstrumentsStageNorm(prevStageFrame);
    ensureAllStagePartsNorm(prevStageFrame);
    ensureAllConnectionsRouteNorm(prevStageFrame);
  }
  normalizeAllMixerConnectionPins();
  const primaryBefore = getPrimaryStagePart();
  if(primaryBefore) syncStageSettingsFromPrimaryPart(primaryBefore);
  const prevW = stageW;
  const prevD = stageD;
  if(!primaryBefore) {
    const dimWEl = document.getElementById('dim-w');
    const dimDEl = document.getElementById('dim-d');
    stageW = Math.max(2, Math.min(80, parseFloat(dimWEl ? dimWEl.value : stageW) || 7.5));
    stageD = Math.max(2, Math.min(50, parseFloat(dimDEl ? dimDEl.value : stageD) || 4.4));
  }
  const wrap = document.getElementById('canvas-wrap');
  const ww = wrap.clientWidth||800, wh = wrap.clientHeight||600;
  pxPerM = Math.min(ww*.78/stageW, wh*.60/stageD);
  const sw = stageW*pxPerM, sh = stageD*pxPerM;
  const sl = (ww-sw)/2, st2 = (wh-sh)/2-18;
  const p = document.getElementById('stage-platform');
  p.style.width = `${sw}px`;
  p.style.height = `${sh}px`;
  p.style.bottom = 'unset';
  p.style.display = showMainStage ? 'block' : 'none';
  stagePx = {left:sl,top:st2,width:sw,height:sh};
  const primaryPart = ensureDefaultMainStagePart(stagePx);
  if(primaryPart) {
    syncPrimaryPartFromStageSettings(primaryPart, stagePx);
  }
  ensureDefaultStageStairsPart(stagePx);
  syncAllInstrumentsWorldFromStageNorm(stagePx);
  syncAllStagePartsWorldFromNorm(stagePx);
  syncAllConnectionsRouteWorldFromNorm(stagePx);
  // Instrument body dimensions depend on pxPerM, so refresh DOM on every stage rescale.
  instruments.forEach(renderInstrument);
  stageParts.forEach(renderStagePart);
  if(selectedId !== null) {
    getWirelessSelectionIds(selectedId).forEach(id => {
      const selEl = getEl(id);
      if(selEl) selEl.classList.add('selected');
    });
  }
  if(selectedStagePartId !== null) {
    const selPart = getStagePartEl(selectedStagePartId);
    if(selPart) selPart.classList.add('selected');
  }
  applyStageColor();
  applyStageStairs();
  const a = document.getElementById('audience-label');
  a.style.width = `${sw}px`;
  const stageName = document.getElementById('stage-name');
  if(stageName) stageName.textContent = String((primaryPart && primaryPart.label) || 'WORK STAGE');
  document.getElementById('stage-dims').textContent = `${stageW} m Ã— ${stageD} m`;
  const scaleInfo = document.getElementById('scale-d');
  if(scaleInfo) {
    scaleInfo.textContent = `${pxPerM.toFixed(1)} px/m Â· 1px=${(1/pxPerM).toFixed(3)}m`;
    scaleInfo.style.display = showStageGrid ? '' : 'none';
  }
  const dimWEl = document.getElementById('dim-w');
  const dimDEl = document.getElementById('dim-d');
  if(dimWEl) dimWEl.value = String(stageW);
  if(dimDEl) dimDEl.value = String(stageD);
  const stairsToggle = document.getElementById('stage-stairs-toggle');
  if(stairsToggle) stairsToggle.checked = !!showStageStairs;
  const stageGridToggle = document.getElementById('stage-grid-toggle');
  if(stageGridToggle) stageGridToggle.checked = !!showStageGrid;
  if(!skipDirty) {
    if(prevW !== stageW || prevD !== stageD) pushHistoryState();
    markDirty();
  }
  drawRulers(); applyZoom(); render();
}

function applyStageStairs() {
  const stairs = document.getElementById('stage-stairs');
  if(!stairs) return;
  if(!showMainStage || !showStageStairs) {
    stairs.style.display = 'none';
    return;
  }
  const stairsWidth = Math.min(stagePx.width, 2 * pxPerM);
  const stairsDepth = 0.75 * pxPerM;
  stairs.style.display = 'block';
  stairs.style.width = `${stairsWidth}px`;
  stairs.style.height = `${stairsDepth}px`;
  stairs.style.left = `${(stagePx.width - stairsWidth) / 2}px`;
  stairs.style.bottom = '-2px';
}

function toggleStageStairs(enabled) {
  const next = !!enabled;
  if(showStageStairs === next) return;
  pushHistoryState();
  if(next) suppressBuiltInStairsPart = false;
  showStageStairs = next;
  applyStageStairs();
  markDirty();
  render();
}

function drawRulers() {
  const {left,top,width,height} = stagePx;
  const rh = document.getElementById('ruler-h');
  const rv = document.getElementById('ruler-v');
  if(!rh || !rv) return;
  if(!showStageGrid) {
    rh.style.display = 'none';
    rv.style.display = 'none';
    return;
  }
  rh.style.display = 'block';
  rv.style.display = 'block';
  // H ruler
  rh.width = Math.ceil(width); rh.height = 20;
  Object.assign(rh.style, {width:width+'px', height:'20px'});
  const chx = rh.getContext('2d'); chx.clearRect(0,0,rh.width,20);
  chx.font='8px Share Tech Mono,monospace';
  for(let m=0;m<=stageW;m++){
    const x=Math.round(m*pxPerM), maj=m%2===0;
    chx.beginPath(); chx.moveTo(x,maj?7:11); chx.lineTo(x,20);
    chx.strokeStyle=maj?'#4a5060':'#282e3a'; chx.stroke();
    if(maj){ chx.fillStyle=m===0||m===stageW?'#47c4ff':'#6b7280'; chx.textAlign=m===0?'left':m===stageW?'right':'center'; chx.fillText(m+'m',x,6); }
  }
  // V ruler
  rv.width=20; rv.height=Math.ceil(height);
  Object.assign(rv.style,{width:'20px',height:height+'px'});
  const cvx=rv.getContext('2d'); cvx.clearRect(0,0,20,rv.height);
  cvx.font='8px Share Tech Mono,monospace';
  for(let m=0;m<=stageD;m++){
    const y=Math.round(m*pxPerM), maj=m%2===0;
    cvx.beginPath(); cvx.moveTo(maj?7:11,y); cvx.lineTo(20,y);
    cvx.strokeStyle=maj?'#4a5060':'#282e3a'; cvx.stroke();
    if(maj&&m>0&&m<stageD){ cvx.save(); cvx.translate(7,y); cvx.rotate(-Math.PI/2); cvx.fillStyle='#6b7280'; cvx.textAlign='center'; cvx.fillText(m+'m',0,0); cvx.restore(); }
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CANVAS / RENDER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function resizeCanvas() {
  const wrap = document.getElementById('canvas-wrap');
  const cv = document.getElementById('conn-canvas');
  cv.width=wrap.clientWidth; cv.height=wrap.clientHeight;
}

function getEl(id){ return document.getElementById('instr-'+id); }

function getCenterOf(id, pin) {
  if(pin !== undefined && pin !== null) {
    const instrEl = getEl(id);
    const useCompactAnchor = !!(instrEl && (
      instrEl.classList.contains('is-snake') ||
      instrEl.classList.contains('is-mixer') ||
      instrEl.dataset.cat === 'stageboxes'
    ));
    if(useCompactAnchor) {
      return getCenterOfEl(id);
    }

    // Handle regular instrument pin keys (L/R/MONO)
    if(pin === 'L' || pin === 'R' || pin === 'MONO') {
      const selector = `.iconn[data-pin="${pin}"]`;
      const el = instrEl ? instrEl.querySelector(selector) : null;
      if(!el) return getCenterOfEl(id);
      const wr = document.getElementById('canvas-wrap').getBoundingClientRect();
      const er = el.getBoundingClientRect();
      return {x: er.left-wr.left+er.width/2, y: er.top-wr.top+er.height/2};
    }

    // Get snake or dynamic pin position
    let el = document.getElementById(`pin-${id}-${pin}`);
    if(!el) {
      const instrEl = getEl(id);
      if(instrEl) {
        el = instrEl.querySelector(`.iconn[data-pin="${pin}"]`);
      }
    }
    if(!el) return getCenterOfEl(id);
    const wr = document.getElementById('canvas-wrap').getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {x: er.left-wr.left+er.width/2, y: er.top-wr.top+er.height/2};
  }
  return getCenterOfEl(id);
}

function getCenterOfEl(id) {
  const el = getEl(id); if(!el) return null;
  const wr = document.getElementById('canvas-wrap').getBoundingClientRect();
  const er = el.getBoundingClientRect();
  return {x:er.left-wr.left+er.width/2, y:er.top-wr.top+er.height/2};
}

function pinKey(pin) {
  return pin == null ? 'MONO' : String(pin);
}

function pinForReport(pin) {
  const key = pinKey(pin);
  const drumMap = {
    'DM-KICK':'Kick',
    'DM-HH':'HiHat',
    'DM-SN':'Snare',
    'DM-T1':'Tom1',
    'DM-T2':'Tom2',
    'DM-T3':'Tom3',
    'DM-RD':'Ride',
    'DM-CR':'Crash',
    'DM-OH':'Overhead',
    'DM-OHL':'Overhead-L',
    'DM-OHR':'Overhead-R',
  };
  if(drumMap[key]) return drumMap[key];
  const ioMap = {
    'IO-IN-MONO':'IN',
    'IO-IN-1':'IN-1',
    'IO-IN-2':'IN-2',
    'IO-IN-L':abbreviateStereoPinLabel('IN-L'),
    'IO-IN-R':abbreviateStereoPinLabel('IN-R'),
    'IO-IN-TRS':'TRS',
    'IO-OUT-MONO':'OUT',
    'IO-OUT-1':'OUT-1',
    'IO-OUT-2':'OUT-2',
    'IO-OUT-L':abbreviateStereoPinLabel('OUT-L'),
    'IO-OUT-R':abbreviateStereoPinLabel('OUT-R'),
    'IO-OUT-HP':'Headphones',
    'IO-USB':'USB',
    'P16-IN':'IN',
    'P16-THRU':'THRU',
    'P16-HP':'Headphones',
    'P16D-IN':'IN',
    'HA-IN-L':abbreviateStereoPinLabel('MAIN-L'),
    'HA-IN-R':abbreviateStereoPinLabel('MAIN-R'),
    'AMP-IN':'IN',
    'AMP-IN-L':abbreviateStereoPinLabel('IN-L'),
    'AMP-IN-R':abbreviateStereoPinLabel('IN-R'),
    'AMP-OUT':'OUT',
    'AMP-OUT-L':abbreviateStereoPinLabel('OUT-L'),
    'AMP-OUT-R':abbreviateStereoPinLabel('OUT-R'),
    'PAMP-IN-L':abbreviateStereoPinLabel('IN-L'),
    'PAMP-IN-R':abbreviateStereoPinLabel('IN-R'),
    'SPK-IN':'IN',
    'SPK-OUT':'OUT',
  };
  if(ioMap[key]) return ioMap[key];
  const ioOutMatch = key.match(/^IO-OUT-(\d+)$/);
  if(ioOutMatch) return `OUT-${parseInt(ioOutMatch[1], 10)}`;
  const routerLanMatch = key.match(/^ROUTER-LAN-(\d+)$/);
  if(routerLanMatch) return `L${parseInt(routerLanMatch[1], 10)}`;
  const p16dOutMatch = key.match(/^P16D-OUT-(\d+)$/);
  if(p16dOutMatch) return `OUT-${parseInt(p16dOutMatch[1], 10)}`;
  const haInMatch = key.match(/^HA-IN-(\d+)-(L|R)$/);
  if(haInMatch) return `IN-${parseInt(haInMatch[1], 10)}-${haInMatch[2]}`;
  const haOutMatch = key.match(/^HA-OUT-(\d+)$/);
  if(haOutMatch) return `HP-${parseInt(haOutMatch[1], 10)}`;
  const ampOutMatch = key.match(/^AMP-OUT-(\d+)$/);
  if(ampOutMatch) return `SPK-${parseInt(ampOutMatch[1], 10)}`;
  const powerAmpOutMatch = key.match(/^PAMP-OUT-(\d+)$/);
  if(powerAmpOutMatch) return `SPK-${parseInt(powerAmpOutMatch[1], 10)}`;
  const stageInMatch = key.match(/^STAGE-IN-(\d+)$/);
  if(stageInMatch) return `STAGE-IN-${parseInt(stageInMatch[1], 10)}`;
  const cableOutMatch = key.match(/^CABLE-OUT-(\d+)$/);
  if(cableOutMatch) return `CABLE-OUT-${parseInt(cableOutMatch[1], 10)}`;
  const stageOutMatch = key.match(/^STAGE-OUT-(\d+)$/);
  if(stageOutMatch) {
    const idx = parseInt(stageOutMatch[1], 10);
    const letter = indexToLetters(idx);
    return `STAGE-OUT-${letter} (${idx})`;
  }
  const cableInMatch = key.match(/^CABLE-IN-(\d+)$/);
  if(cableInMatch) {
    const idx = parseInt(cableInMatch[1], 10);
    const letter = indexToLetters(idx);
    return `CABLE-IN-${letter} (${idx})`;
  }
  const outletMatch = key.match(/^OUTLET-(?:IN|OUT)-(\d+)$/);
  if(outletMatch) {
    const idx = parseInt(outletMatch[1], 10);
    return `OUTLET-${idx}`;
  }
  const outMatch = key.match(/^OUT-(\d+)$/);
  if(outMatch) {
    const idx = parseInt(outMatch[1], 10);
    const letter = indexToLetters(idx);
    return `OUT-${letter} (${idx})`;
  }
  const inMatch = key.match(/^IN-(\d+)$/);
  if(inMatch) {
    return `IN-${parseInt(inMatch[1], 10)}`;
  }
  return key;
}

function getDisplayPinLabelForInstrument(instr, pin) {
  const key = pinKey(pin);
  if(instr && instr.type === 'di') {
    if(key === 'IO-IN-L') return 'I1';
    if(key === 'IO-IN-R') return 'I2';
    if(key === 'IO-OUT-L') return 'O1';
    if(key === 'IO-OUT-R') return 'O2';
  }
  return pinForReport(key);
}

function indexToLetters(index) {
  let n = Math.max(1, parseInt(index, 10) || 1);
  let out = '';
  while(n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out || 'A';
}

function isSnakeInputPinKey(key) {
  return typeof key === 'string' && (key.startsWith('IN-') || key.startsWith('STAGE-IN-') || key.startsWith('CABLE-IN-'));
}

function isSnakeOutputPinKey(key) {
  return typeof key === 'string' && (key.startsWith('OUT-') || key.startsWith('STAGE-OUT-') || key.startsWith('CABLE-OUT-'));
}

function isSnakeStageReturnOutputPin(pin) {
  const key = pinKey(pin);
  return key.startsWith('STAGE-OUT-') || key.startsWith('OUT-');
}

function normalizeSnakeEndpointPinForInstrument(instr, pin) {
  const key = pinKey(pin);
  if(!instr || !isSnakeBox(instr)) return key;
  const legacyIn = key.match(/^IN-(\d+)$/);
  if(legacyIn) return `STAGE-IN-${parseInt(legacyIn[1], 10)}`;
  const legacyOut = key.match(/^OUT-(\d+)$/);
  if(legacyOut) return `STAGE-OUT-${parseInt(legacyOut[1], 10)}`;
  return key;
}

function normalizeAllSnakeConnectionPins() {
  if(!Array.isArray(connections) || !connections.length) return false;
  const byId = new Map(instruments.map(i => [i.id, i]));
  let changed = false;
  connections.forEach(c => {
    const fromInstr = byId.get(c.fromId);
    const toInstr = byId.get(c.toId);
    const fromCurrent = pinKey(c.fromPin);
    const toCurrent = pinKey(c.toPin);
    const fromNext = normalizeSnakeEndpointPinForInstrument(fromInstr, c.fromPin);
    const toNext = normalizeSnakeEndpointPinForInstrument(toInstr, c.toPin);
    if(fromNext !== fromCurrent) {
      c.fromPin = fromNext;
      changed = true;
    }
    if(toNext !== toCurrent) {
      c.toPin = toNext;
      changed = true;
    }
  });
  return changed;
}

function isPinUsed(id, pin) {
  const key = pinKey(pin);
  return connections.some(c => {
    const fromKey = pinKey(c.fromPin);
    const toKey = pinKey(c.toPin);
    return (c.fromId === id && fromKey === key) || (c.toId === id && toKey === key);
  });
}

function getConnectionsForPin(id, pin) {
  const key = pinKey(pin);
  return connections.filter(c => {
    const fromKey = pinKey(c.fromPin);
    const toKey = pinKey(c.toPin);
    return (c.fromId === id && fromKey === key) || (c.toId === id && toKey === key);
  });
}

function getPinConnectionCount(id, pin) {
  return getConnectionsForPin(id, pin).length;
}

function getStereoPinSide(pin) {
  const key = pinKey(pin);
  if(key === 'L' || /-L$/.test(key)) return 'L';
  if(key === 'R' || /-R$/.test(key)) return 'R';
  return null;
}

function getOppositeStereoPin(pin) {
  const key = pinKey(pin);
  const side = getStereoPinSide(key);
  if(!side) return null;
  if(key === 'L') return 'R';
  if(key === 'R') return 'L';
  return key.slice(0, -1) + (side === 'L' ? 'R' : 'L');
}

function getNumericCompanionPin(pin, stereoSideUsed) {
  const key = pinKey(pin);
  const m = key.match(/^(.*?)(\d+)$/);
  if(!m) return null;
  const prefix = m[1];
  const idx = parseInt(m[2], 10);
  if(!Number.isFinite(idx)) return null;
  const step = stereoSideUsed === 'R' ? -1 : 1;
  const next = idx + step;
  if(next < 1) return null;
  return `${prefix}${next}`;
}

function getCompanionPin(instr, pin, stereoSideUsed) {
  const key = pinKey(pin);
  const opposite = getOppositeStereoPin(key);
  if(instr && opposite) {
    const validPins = getValidPinsForInstrument(instr);
    if(!validPins || validPins.has(opposite)) return opposite;
  }
  if(instr && instr.type === 'drumkit' && key.startsWith('DM-')) {
    const drumPins = getDrumMicPins(instr).map(p => p.key);
    const idx = drumPins.indexOf(key);
    if(idx >= 0) {
      const step = stereoSideUsed === 'R' ? -1 : 1;
      const nextIdx = idx + step;
      if(nextIdx >= 0 && nextIdx < drumPins.length) return drumPins[nextIdx];
    }
  }
  if(key === 'MONO') return null;
  return getNumericCompanionPin(key, stereoSideUsed);
}

function findTsPairCompanionPin(instr, pin) {
  const candidates = [
    getCompanionPin(instr, pin, 'L'),
    getCompanionPin(instr, pin, 'R'),
  ].filter((candidate, index, arr) => candidate && candidate !== pinKey(pin) && arr.indexOf(candidate) === index);

  return candidates.find(candidate => {
    if(!isEffectiveInputPin(instr, candidate)) return false;
    const allowed = getPinAllowedCableTypes(instr, candidate);
    return Array.isArray(allowed) && allowed.includes('ts');
  }) || null;
}

function isTrsSplitCapableOutput(instr, pin) {
  if(!instr || !isEffectiveOutputPin(instr, pin)) return false;
  const allowed = getPinAllowedCableTypes(instr, pin);
  return Array.isArray(allowed) && allowed.length === 1 && allowed[0] === 'trs';
}

function canSourcePinAcceptAnotherConnection(instr, id, pin) {
  if(isTrsSplitCapableOutput(instr, pin)) return getPinConnectionCount(id, pin) < 2;
  return !isPinUsed(id, pin);
}

function resolveTrsSplitCableForPins(fromInstr, fromPin, toInstr, toPin, preferredCable = selectedCable) {
  if(!isTrsSplitCapableOutput(fromInstr, fromPin)) return null;
  if(!isEffectiveInputPin(toInstr, toPin)) return null;

  const targetAllowed = getPinAllowedCableTypes(toInstr, toPin);
  if(!Array.isArray(targetAllowed) || !targetAllowed.includes('ts')) return null;

  const companionPin = findTsPairCompanionPin(toInstr, toPin);
  if(!companionPin) {
    return {
      valid:false,
      message:`${toInstr.label} ${pinKey(toPin)} needs a matched Jack TS pair for a TRS split.`
    };
  }

  const sourceConnections = getConnectionsForPin(fromInstr.id, fromPin);
  if(sourceConnections.length === 0) {
    if(isPinUsed(toInstr.id, companionPin)) {
      return {
        valid:false,
        message:`${toInstr.label} ${pinKey(companionPin)} is already in use, so the TRS split pair is unavailable.`
      };
    }
  } else if(sourceConnections.length === 1) {
    const existing = sourceConnections[0];
    if(existing.fromId !== fromInstr.id || pinKey(existing.fromPin) !== pinKey(fromPin) || existing.toId !== toInstr.id || pinKey(existing.toPin) !== companionPin) {
      return {
        valid:false,
        message:`${fromInstr.label} ${pinKey(fromPin)} can only split to the paired Jack TS inputs on one destination.`
      };
    }
  } else {
    return {
      valid:false,
      message:`${fromInstr.label} ${pinKey(fromPin)} already uses both sides of its TRS split.`
    };
  }

  const cable = CABLE_TYPES.find(c => c.id === 'ts') || CABLE_TYPES[0];
  return {
    valid:true,
    cableType:cable.id,
    color:cable.color,
    label:cable.label,
    wasAutoChosen: preferredCable !== 'ts',
  };
}

function buildStereoSuggestion(baseConn) {
  const fromInstr = instruments.find(i => i.id === baseConn.fromId);
  const toInstr = instruments.find(i => i.id === baseConn.toId);
  if(!fromInstr || !toInstr) return null;

  const fromSide = pinKey(baseConn.fromPin);
  const toSide = pinKey(baseConn.toPin);
  const fromStereoSide = getStereoPinSide(fromSide);
  const toStereoSide = getStereoPinSide(toSide);

  const sourceIsStereo = fromInstr.stereo && !!fromStereoSide;
  const targetIsStereo = toInstr.stereo && !!toStereoSide;
  if(!sourceIsStereo && !targetIsStereo) return null;

  const stereoSideUsed = sourceIsStereo ? fromStereoSide : toStereoSide;
  const suggestion = {
    fromId: baseConn.fromId,
    toId: baseConn.toId,
    fromPin: baseConn.fromPin,
    toPin: baseConn.toPin,
  };

  if(sourceIsStereo) {
    suggestion.fromPin = getOppositeStereoPin(fromSide);
    if(!suggestion.fromPin) return null;
    suggestion.toPin = getCompanionPin(toInstr, baseConn.toPin, stereoSideUsed);
  } else {
    suggestion.toPin = getOppositeStereoPin(toSide);
    if(!suggestion.toPin) return null;
    suggestion.fromPin = getCompanionPin(fromInstr, baseConn.fromPin, stereoSideUsed);
  }

  if(!suggestion.fromPin || !suggestion.toPin) return null;
  if(isPinUsed(suggestion.fromId, suggestion.fromPin) || isPinUsed(suggestion.toId, suggestion.toPin)) return null;

  const validation = validateConnection(
    { id: suggestion.fromId, pin: suggestion.fromPin },
    { id: suggestion.toId, pin: suggestion.toPin }
  );
  if(!validation.valid) return null;

  suggestion.cableType = validation.cableType;
  suggestion.color = validation.color;
  suggestion.label = validation.label;

  return suggestion;
}

function maybeSuggestStereoCompanion(baseConn) {
  const suggestion = buildStereoSuggestion(baseConn);
  if(!suggestion) return;

  const fromInstr = instruments.find(i => i.id === suggestion.fromId);
  const toInstr = instruments.find(i => i.id === suggestion.toId);
  if(!fromInstr || !toInstr) return;

  const msg = `Stereo detected. Add second connection?\n\n${fromInstr.label} ${getDisplayPinLabelForInstrument(fromInstr, suggestion.fromPin)} -> ${toInstr.label} ${getDisplayPinLabelForInstrument(toInstr, suggestion.toPin)}`;
  if(!confirm(msg)) return;

  connections.push({
    id: ++idCounter,
    fromId: suggestion.fromId,
    fromPin: suggestion.fromPin,
    toId: suggestion.toId,
    toPin: suggestion.toPin,
    cableType: suggestion.cableType || baseConn.cableType,
    color: suggestion.color || baseConn.color,
    label: suggestion.label || baseConn.label,
    routeX: null,
  });

  markDirty();
  refreshConnectorStates(suggestion.fromId);
  refreshConnectorStates(suggestion.toId);
}

function buildTrsSplitSuggestion(baseConn) {
  const fromInstr = instruments.find(i => i.id === baseConn.fromId);
  const toInstr = instruments.find(i => i.id === baseConn.toId);
  if(!fromInstr || !toInstr) return null;
  if(normalizeCableType(baseConn.cableType) !== 'ts') return null;
  if(!isTrsSplitCapableOutput(fromInstr, baseConn.fromPin)) return null;

  const companionPin = findTsPairCompanionPin(toInstr, baseConn.toPin);
  if(!companionPin || isPinUsed(toInstr.id, companionPin)) return null;

  const validation = validateConnection(
    { id: baseConn.fromId, pin: baseConn.fromPin },
    { id: baseConn.toId, pin: companionPin }
  );
  if(!validation.valid) return null;

  return {
    fromId: baseConn.fromId,
    fromPin: baseConn.fromPin,
    toId: baseConn.toId,
    toPin: companionPin,
    cableType: validation.cableType,
    color: validation.color,
    label: validation.label,
  };
}

function maybeAutoAddTrsSplitCompanion(baseConn) {
  const suggestion = buildTrsSplitSuggestion(baseConn);
  if(!suggestion) return;

  connections.push({
    id: ++idCounter,
    fromId: suggestion.fromId,
    fromPin: suggestion.fromPin,
    toId: suggestion.toId,
    toPin: suggestion.toPin,
    cableType: suggestion.cableType || baseConn.cableType,
    color: suggestion.color || baseConn.color,
    label: suggestion.label || baseConn.label,
    routeX: null,
  });

  markDirty();
  refreshConnectorStates(suggestion.fromId);
  refreshConnectorStates(suggestion.toId);
}

function parseSnakeNumberedPin(pin) {
  const key = pinKey(pin);
  const m = key.match(/^(STAGE-IN|CABLE-OUT|IN)-(\d+)$/);
  if(!m) return null;
  return {
    family: m[1] === 'IN' ? 'STAGE-IN' : m[1],
    index: parseInt(m[2], 10),
  };
}

function parseSnakeInputPin(pin) {
  const key = pinKey(pin);
  const m = key.match(/^(STAGE-IN|CABLE-IN|IN)-(\d+)$/);
  if(!m) return null;
  return {
    family: m[1] === 'IN' ? 'STAGE-IN' : m[1],
    index: parseInt(m[2], 10),
  };
}

function parseMixerInputPin(pin) {
  const key = pinKey(pin);
  const standardMatch = key.match(/^MX-IN-(\d+)$/);
  if(standardMatch) return { family: 'MX-IN', index: parseInt(standardMatch[1], 10) };
  const auxMatch = key.match(/^MX-AUX-IN-(\d+)$/);
  if(auxMatch) return { family: 'MX-AUX-IN', index: parseInt(auxMatch[1], 10) };
  return null;
}

function maybeAutoRouteSnakeMixer(baseConn) {
  const fromInstr = instruments.find(i => i.id === baseConn.fromId);
  const toInstr = instruments.find(i => i.id === baseConn.toId);
  if(!fromInstr || !toInstr) return;

  const fromSnake = isSnakeBox(fromInstr) ? parseSnakeNumberedPin(baseConn.fromPin) : null;
  const toSnake = isSnakeBox(toInstr) ? parseSnakeNumberedPin(baseConn.toPin) : null;
  const fromMixerIn = isMixerBox(fromInstr) ? parseMixerInputPin(baseConn.fromPin) : null;
  const toMixerIn = isMixerBox(toInstr) ? parseMixerInputPin(baseConn.toPin) : null;

  let snakeInstr = null;
  let mixerInstr = null;
  let snakePinFamily = '';
  let snakeStartIdx = 0;
  let mixerStartIdx = 0;
  let mixerPinFamily = 'MX-IN';
  let direction = 'snake-to-mixer';

  if(fromSnake && toMixerIn) {
    snakeInstr = fromInstr;
    mixerInstr = toInstr;
    snakePinFamily = fromSnake.family;
    snakeStartIdx = fromSnake.index;
    mixerStartIdx = toMixerIn.index;
    mixerPinFamily = toMixerIn.family || 'MX-IN';
    direction = 'snake-to-mixer';
  } else if(fromMixerIn && toSnake) {
    snakeInstr = toInstr;
    mixerInstr = fromInstr;
    snakePinFamily = toSnake.family;
    snakeStartIdx = toSnake.index;
    mixerStartIdx = fromMixerIn.index;
    mixerPinFamily = fromMixerIn.family || 'MX-IN';
    direction = 'mixer-to-snake';
  } else {
    return;
  }

  const snakeMax = Math.max(1, Number(snakeInstr.snakeChannels) || 16);
  const breakdown = getMixerInputBreakdown(mixerInstr);
  const mixerMax = mixerPinFamily === 'MX-AUX-IN'
    ? Math.max(0, breakdown.auxInputs)
    : Math.max(0, breakdown.totalStandard || Number(mixerInstr.mixerInputs) || 0);
  let maxAdditional = 0;
  while((snakeStartIdx + maxAdditional + 1) <= snakeMax && (mixerStartIdx + maxAdditional + 1) <= mixerMax) {
    maxAdditional += 1;
  }
  if(maxAdditional <= 0) return;

  const maxTotal = 1 + maxAdditional;
  const mixerStartLabel = mixerPinFamily === 'MX-AUX-IN' ? `A${mixerStartIdx}` : `${mixerStartIdx}`;
  const ask = prompt(`Snake to mixer auto-route\n\nHow many consecutive connections do you want to make?\nStart mapping: snake ${snakeStartIdx} -> mixer IN ${mixerStartLabel}\nEnter a number from 1 to ${maxTotal}.`, String(Math.min(8, maxTotal)));
  if(ask == null) return;
  const requestedTotal = parseInt(String(ask).trim(), 10);
  if(!Number.isFinite(requestedTotal) || requestedTotal < 1) {
    alert('Auto-route cancelled: please enter a valid number.');
    return;
  }
  const total = Math.min(maxTotal, requestedTotal);
  const additionalNeeded = total - 1;
  if(additionalNeeded <= 0) return;

  let added = 0;
  for(let step = 1; step <= additionalNeeded; step += 1) {
    const snakeIdx = snakeStartIdx + step;
    const mixerIdx = mixerStartIdx + step;
    const snakePin = `${snakePinFamily}-${snakeIdx}`;
    const mixerPin = mixerPinFamily === 'MX-AUX-IN' ? `MX-AUX-IN-${mixerIdx}` : `MX-IN-${mixerIdx}`;

    const fromObj = direction === 'snake-to-mixer'
      ? { id: snakeInstr.id, pin: snakePin }
      : { id: mixerInstr.id, pin: mixerPin };
    const toObj = direction === 'snake-to-mixer'
      ? { id: mixerInstr.id, pin: mixerPin }
      : { id: snakeInstr.id, pin: snakePin };

    const validation = validateConnection(fromObj, toObj);
    if(!validation.valid) break;

    connections.push({
      id: ++idCounter,
      fromId: fromObj.id,
      fromPin: fromObj.pin,
      toId: toObj.id,
      toPin: toObj.pin,
      cableType: validation.cableType,
      color: validation.color,
      label: validation.label,
      routeX: null,
    });
    added += 1;
  }

  if(added > 0) {
    markDirty();
    refreshConnectorStates(baseConn.fromId);
    refreshConnectorStates(baseConn.toId);
  }

  if(added < additionalNeeded) {
    alert(`Auto-route added ${added + 1} of ${total} requested connections. Remaining channels were not available.`);
  }
}

function maybeAutoRouteDrumkitSnake(baseConn) {
  const fromInstr = instruments.find(i => i.id === baseConn.fromId);
  const toInstr = instruments.find(i => i.id === baseConn.toId);
  if(!fromInstr || !toInstr) return;

  const fromSnakeIn = isSnakeBox(fromInstr) ? parseSnakeInputPin(baseConn.fromPin) : null;
  const toSnakeIn = isSnakeBox(toInstr) ? parseSnakeInputPin(baseConn.toPin) : null;
  const fromDrumPin = fromInstr.type === 'drumkit' ? pinKey(baseConn.fromPin) : '';
  const toDrumPin = toInstr.type === 'drumkit' ? pinKey(baseConn.toPin) : '';

  let drumInstr = null;
  let snakeInstr = null;
  let drumStartPin = '';
  let snakePinFamily = '';
  let snakeStartIdx = 0;
  let direction = 'drum-to-snake';

  if(fromDrumPin.startsWith('DM-') && toSnakeIn) {
    drumInstr = fromInstr;
    snakeInstr = toInstr;
    drumStartPin = fromDrumPin;
    snakePinFamily = toSnakeIn.family;
    snakeStartIdx = toSnakeIn.index;
    direction = 'drum-to-snake';
  } else if(toDrumPin.startsWith('DM-') && fromSnakeIn) {
    drumInstr = toInstr;
    snakeInstr = fromInstr;
    drumStartPin = toDrumPin;
    snakePinFamily = fromSnakeIn.family;
    snakeStartIdx = fromSnakeIn.index;
    direction = 'snake-to-drum';
  } else {
    return;
  }

  const drumPins = getDrumMicPins(drumInstr).map(p => ({ key: p.key, label: p.label }));
  const startPos = drumPins.findIndex(p => p.key === drumStartPin);
  if(startPos < 0) return;

  const snakeMax = Math.max(1, Number(snakeInstr.snakeChannels) || 16);
  let maxAdditional = 0;
  while(
    (startPos + maxAdditional + 1) < drumPins.length &&
    (snakeStartIdx + maxAdditional + 1) <= snakeMax
  ) {
    maxAdditional += 1;
  }
  if(maxAdditional <= 0) return;

  const maxTotal = 1 + maxAdditional;
  const startLabel = drumPins[startPos].label;
  const ask = prompt(`Drum kit to snake auto-route\n\nHow many consecutive connections do you want to make?\nStart mapping: drum ${startLabel} -> snake ${snakeStartIdx}\nEnter a number from 1 to ${maxTotal}.`, String(Math.min(8, maxTotal)));
  if(ask == null) return;
  const requestedTotal = parseInt(String(ask).trim(), 10);
  if(!Number.isFinite(requestedTotal) || requestedTotal < 1) {
    alert('Auto-route cancelled: please enter a valid number.');
    return;
  }

  const total = Math.min(maxTotal, requestedTotal);
  const additionalNeeded = total - 1;
  if(additionalNeeded <= 0) return;

  let added = 0;
  for(let step = 1; step <= additionalNeeded; step += 1) {
    const drumPin = drumPins[startPos + step].key;
    const snakePin = `${snakePinFamily}-${snakeStartIdx + step}`;

    const fromObj = direction === 'drum-to-snake'
      ? { id: drumInstr.id, pin: drumPin }
      : { id: snakeInstr.id, pin: snakePin };
    const toObj = direction === 'drum-to-snake'
      ? { id: snakeInstr.id, pin: snakePin }
      : { id: drumInstr.id, pin: drumPin };

    const validation = validateConnection(fromObj, toObj);
    if(!validation.valid) break;

    connections.push({
      id: ++idCounter,
      fromId: fromObj.id,
      fromPin: fromObj.pin,
      toId: toObj.id,
      toPin: toObj.pin,
      cableType: validation.cableType,
      color: validation.color,
      label: validation.label,
      routeX: null,
    });
    added += 1;
  }

  if(added > 0) {
    markDirty();
    refreshConnectorStates(baseConn.fromId);
    refreshConnectorStates(baseConn.toId);
  }

  if(added < additionalNeeded) {
    alert(`Auto-route added ${added + 1} of ${total} requested connections. Remaining channels were not available.`);
  }
}

function getAutoRouteSourcePinsForMixer(instr) {
  if(!instr || isSnakeBox(instr) || isOutletBox(instr)) return [];
  if(instr.type === 'drumkit') return getDrumMicPins(instr).map(p => p.key);
  if(isConnectionBoxInstrument(instr) || isNonConnectableInstrument(instr)) return [];

  if(isCustomIOInstrument(instr)) {
    const outputPins = getInstrumentOutputPins(instr).map(p => p.key);
    return outputPins.length > 1 ? outputPins : [];
  }

  const hasStereoOut = hasAttachedAccessory(instr) ? !!instr.attachedAccessoryStereo : !!instr.stereo;
  if(hasStereoOut) return ['L', 'R'];

  return [];
}

function maybeAutoRouteMultiPortToMixer(baseConn) {
  const fromInstr = instruments.find(i => i.id === baseConn.fromId);
  const toInstr = instruments.find(i => i.id === baseConn.toId);
  if(!fromInstr || !toInstr) return;

  const fromMixerIn = isMixerBox(fromInstr) ? parseMixerInputPin(baseConn.fromPin) : null;
  const toMixerIn = isMixerBox(toInstr) ? parseMixerInputPin(baseConn.toPin) : null;

  let sourceInstr = null;
  let sourceStartPin = '';
  let mixerInstr = null;
  let mixerStartIdx = 0;
  let mixerPinFamily = 'MX-IN';
  let direction = 'source-to-mixer';

  if(toMixerIn) {
    sourceInstr = fromInstr;
    sourceStartPin = pinKey(baseConn.fromPin);
    mixerInstr = toInstr;
    mixerStartIdx = toMixerIn.index;
    mixerPinFamily = toMixerIn.family || 'MX-IN';
    direction = 'source-to-mixer';
  } else if(fromMixerIn) {
    sourceInstr = toInstr;
    sourceStartPin = pinKey(baseConn.toPin);
    mixerInstr = fromInstr;
    mixerStartIdx = fromMixerIn.index;
    mixerPinFamily = fromMixerIn.family || 'MX-IN';
    direction = 'mixer-to-source';
  } else {
    return;
  }

  const sourcePins = getAutoRouteSourcePinsForMixer(sourceInstr);
  const startPos = sourcePins.findIndex(pin => pin === sourceStartPin);
  if(startPos < 0) return;

  const breakdown = getMixerInputBreakdown(mixerInstr);
  const mixerMax = mixerPinFamily === 'MX-AUX-IN'
    ? Math.max(0, breakdown.auxInputs)
    : Math.max(0, breakdown.totalStandard || Number(mixerInstr.mixerInputs) || 0);

  let maxAdditional = 0;
  while(
    (startPos + maxAdditional + 1) < sourcePins.length &&
    (mixerStartIdx + maxAdditional + 1) <= mixerMax
  ) {
    maxAdditional += 1;
  }
  if(maxAdditional <= 0) return;

  const maxTotal = 1 + maxAdditional;
  const mixerStartLabel = mixerPinFamily === 'MX-AUX-IN' ? `A${mixerStartIdx}` : `${mixerStartIdx}`;
  const ask = prompt(`Multi-port to mixer auto-route\n\nHow many consecutive connections do you want to make?\nStart mapping: ${sourceInstr.label} ${sourceStartPin} -> ${mixerInstr.label} IN ${mixerStartLabel}\nEnter a number from 1 to ${maxTotal}.`, String(Math.min(8, maxTotal)));
  if(ask == null) return;
  const requestedTotal = parseInt(String(ask).trim(), 10);
  if(!Number.isFinite(requestedTotal) || requestedTotal < 1) {
    alert('Auto-route cancelled: please enter a valid number.');
    return;
  }

  const total = Math.min(maxTotal, requestedTotal);
  const additionalNeeded = total - 1;
  if(additionalNeeded <= 0) return;

  let added = 0;
  for(let step = 1; step <= additionalNeeded; step += 1) {
    const sourcePin = sourcePins[startPos + step];
    const mixerIdx = mixerStartIdx + step;
    const mixerPin = mixerPinFamily === 'MX-AUX-IN' ? `MX-AUX-IN-${mixerIdx}` : `MX-IN-${mixerIdx}`;

    const fromObj = direction === 'source-to-mixer'
      ? { id: sourceInstr.id, pin: sourcePin }
      : { id: mixerInstr.id, pin: mixerPin };
    const toObj = direction === 'source-to-mixer'
      ? { id: mixerInstr.id, pin: mixerPin }
      : { id: sourceInstr.id, pin: sourcePin };

    const validation = validateConnection(fromObj, toObj);
    if(!validation.valid) break;

    connections.push({
      id: ++idCounter,
      fromId: fromObj.id,
      fromPin: fromObj.pin,
      toId: toObj.id,
      toPin: toObj.pin,
      cableType: validation.cableType,
      color: validation.color,
      label: validation.label,
      routeX: null,
    });
    added += 1;
  }

  if(added > 0) {
    markDirty();
    refreshConnectorStates(baseConn.fromId);
    refreshConnectorStates(baseConn.toId);
  }

  if(added < additionalNeeded) {
    alert(`Auto-route added ${added + 1} of ${total} requested connections. Remaining channels were not available.`);
  }
}

function render(refreshConnectionList = true) {
  const cv = document.getElementById('conn-canvas');
  const ctx = cv.getContext('2d');
  ctx.clearRect(0,0,cv.width,cv.height);
  connectionHandleCache = [];
  connectionGeometryCache = new Map();
  if(isStageBuilderMode) {
    if(refreshConnectionList) updateConnList();
    return;
  }
  const busState = buildCableBusState();
  const selectedNodeIds = selectedId ? new Set(getWirelessSelectionIds(selectedId)) : null;
  const selectedConnIds = selectedNodeIds
    ? connections.filter(c => selectedNodeIds.has(c.fromId) || selectedNodeIds.has(c.toId)).map(c => c.id)
    : [];
  const focusedConnIds = selectedConnIds.length ? new Set(selectedConnIds) : null;

  drawCableBusTrunks(ctx, busState, focusedConnIds);

  connections.forEach(conn => {
    const a = getCenterOf(conn.fromId, conn.fromPin);
    const b = getCenterOf(conn.toId, conn.toPin);
    if(a&&b) {
      const hasFocus = focusedConnIds ? focusedConnIds.has(conn.id) : false;
      const isHovered = hoveredConnectionId === conn.id;
      const isHighlighted = hasFocus || isHovered;
      const isMuted = focusedConnIds ? !hasFocus : !isHovered;
      const busMeta = busState.byConnId.get(conn.id) || null;
      const routeX = getEffectiveRouteXForConnection(conn, busMeta);
      const drawConn = Number.isFinite(routeX) ? { ...conn, routeX } : conn;
      drawCable(ctx, drawConn, a, b, false, isMuted, isHighlighted, isHovered, !busMeta);
    }
  });

  drawCableBusBadgesAndHandles(ctx, busState, focusedConnIds);

  if(drawingLine){
    const col = (CABLE_TYPES.find(c=>c.id===selectedCable)||CABLE_TYPES[0]).color;
    drawPreviewCable(ctx, drawingLine.x1, drawingLine.y1, drawingLine.x2, drawingLine.y2, col);
  }
  if(refreshConnectionList) updateConnList();
}

let renderFrameId = 0;
let renderFrameNeedsConnectionList = false;

function scheduleRender(refreshConnectionList = true) {
  renderFrameNeedsConnectionList = renderFrameNeedsConnectionList || refreshConnectionList;
  if(renderFrameId) return;
  renderFrameId = requestAnimationFrame(() => {
    renderFrameId = 0;
    const refreshList = renderFrameNeedsConnectionList;
    renderFrameNeedsConnectionList = false;
    render(refreshList);
  });
}

function getDirectedBusGroupKey(conn) {
  if(!conn) return null;
  const a = Number(conn.fromId);
  const b = Number(conn.toId);
  if(!Number.isFinite(a) || !Number.isFinite(b)) return null;
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  const type = normalizeCableType(conn.cableType || 'xlr');
  return `${low}<->${high}:${type}`;
}

function buildCableBusState() {
  const groups = new Map();
  connections.forEach(conn => {
    const key = getDirectedBusGroupKey(conn);
    if(!key) return;
    if(!groups.has(key)) groups.set(key, []);
    groups.get(key).push(conn);
  });

  const byConnId = new Map();
  const buses = [];

  groups.forEach(group => {
    if(group.length < 2) return;

    const ordered = [...group].sort((a, b) => a.id - b.id);
    const anchor = ordered[0];
    const fromCenter = getCenterOfEl(anchor.fromId);
    const toCenter = getCenterOfEl(anchor.toId);
    if(!fromCenter || !toCenter) return;

    const allPts = [];
    group.forEach(conn => {
      const a = getCenterOf(conn.fromId, conn.fromPin);
      const b = getCenterOf(conn.toId, conn.toPin);
      if(a && Number.isFinite(a.x)) allPts.push(a);
      if(b && Number.isFinite(b.x)) allPts.push(b);
    });

    let routeXWorld = Number(anchor.routeX);
    const anchorMidX = (fromCenter.x + toCenter.x) / 2;

    if(Number.isFinite(routeXWorld) && allPts.length) {
      const xs = allPts.map(p => p.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const span = Math.max(12, maxX - minX);
      const allowedPad = Math.max(30, Math.min(120, span * 0.85));
      const routeXScreen = panX + (routeXWorld * zoomLevel);
      const minAllowed = minX - allowedPad;
      const maxAllowed = maxX + allowedPad;
      if(routeXScreen < minAllowed || routeXScreen > maxAllowed) {
        routeXWorld = NaN;
      }
    }

    let yMin = Infinity;
    let yMax = -Infinity;
    group.forEach(conn => {
      const a = getCenterOf(conn.fromId, conn.fromPin);
      const b = getCenterOf(conn.toId, conn.toPin);
      if(!a || !b) return;
      yMin = Math.min(yMin, a.y, b.y);
      yMax = Math.max(yMax, a.y, b.y);
    });
    if(!Number.isFinite(yMin) || !Number.isFinite(yMax)) return;

    if(!Number.isFinite(routeXWorld)) {
      routeXWorld = (anchorMidX - panX) / zoomLevel;
    }

    const routeXScreen = panX + (routeXWorld * zoomLevel);

    const busMeta = {
      key: getDirectedBusGroupKey(group[0]),
      connIds: group.map(c => c.id),
      count: group.length,
      routeXWorld,
      routeXScreen,
      yMin,
      yMax,
      color: group[0].color,
      sourceCenter: fromCenter,
      targetCenter: toCenter,
    };
    buses.push(busMeta);
    group.forEach(conn => byConnId.set(conn.id, busMeta));
  });

  return { byConnId, buses };
}

function getEffectiveRouteXForConnection(conn, busMeta) {
  if(!conn) return null;
  if(busMeta && Number.isFinite(busMeta.routeXWorld)) return busMeta.routeXWorld;
  if(!Number.isFinite(conn.routeX) && Number.isFinite(conn.routeNX)) syncConnectionRouteWorldFromNorm(conn, stagePx);
  if(Number.isFinite(conn.routeX)) return conn.routeX;
  const fromCenterEl = getCenterOfEl(conn.fromId);
  const toCenterEl = getCenterOfEl(conn.toId);
  if(fromCenterEl && toCenterEl) {
    return (((fromCenterEl.x + toCenterEl.x) / 2) - panX) / zoomLevel;
  }
  const fromPinCenter = getCenterOf(conn.fromId, conn.fromPin);
  const toPinCenter = getCenterOf(conn.toId, conn.toPin);
  if(fromPinCenter && toPinCenter) {
    return (((fromPinCenter.x + toPinCenter.x) / 2) - panX) / zoomLevel;
  }
  return null;
}

function drawCableBusTrunks(ctx, busState, focusedConnIds) {
  if(!busState || !Array.isArray(busState.buses)) return;
  busState.buses.forEach(bus => {
    const anyFocused = focusedConnIds ? bus.connIds.some(id => focusedConnIds.has(id)) : false;
    const isMuted = focusedConnIds ? !anyFocused : false;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bus.routeXScreen, bus.yMin);
    ctx.lineTo(bus.routeXScreen, bus.yMax);
    ctx.lineWidth = 5.2;
    ctx.strokeStyle = bus.color;
    ctx.globalAlpha = isMuted ? 0.2 : 0.36;
    ctx.shadowColor = bus.color;
    ctx.shadowBlur = isMuted ? 0 : 5;
    ctx.stroke();
    ctx.restore();
  });
}

function drawCableBusBadgesAndHandles(ctx, busState, focusedConnIds) {
  if(!busState || !Array.isArray(busState.buses)) return;
  busState.buses.forEach(bus => {
    const anyFocused = focusedConnIds ? bus.connIds.some(id => focusedConnIds.has(id)) : false;
    const isMuted = focusedConnIds ? !anyFocused : false;

    const handle = { x: bus.routeXScreen, y: (bus.yMin + bus.yMax) / 2 };
    connectionHandleCache.push({
      busKey: bus.key,
      connIds: bus.connIds,
      x: handle.x,
      y: handle.y,
    });

    ctx.save();
    ctx.fillStyle = isMuted ? 'rgba(10,11,13,0.62)' : 'rgba(10,11,13,0.9)';
    ctx.strokeStyle = isMuted ? 'rgba(212,216,226,0.38)' : brightenHex(bus.color, 0.4);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(handle.x - 6, handle.y - 6, 12, 12);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    if(!bus.sourceCenter || !bus.targetCenter) return;
    const dir = bus.targetCenter.x >= bus.sourceCenter.x ? 1 : -1;
    const sx = bus.sourceCenter.x + (dir * 14);
    const sy = bus.sourceCenter.y - 12;
    const ex = sx + (dir * 9);
    const ey = sy + 9;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = brightenHex(bus.color, 0.45);
    ctx.lineWidth = 2;
    ctx.globalAlpha = isMuted ? 0.45 : 0.95;
    ctx.stroke();

    ctx.font = '10px Share Tech Mono, monospace';
    ctx.fillStyle = brightenHex(bus.color, 0.45);
    ctx.textAlign = dir > 0 ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(bus.count), ex + (dir * 5), ey + 1);
    ctx.restore();
  });
}

function buildOrthogonalPoints(a, b, routeX) {
  const midX = Number.isFinite(routeX) ? (panX + (routeX * zoomLevel)) : ((a.x + b.x) / 2);
  return [
    {x:a.x, y:a.y},
    {x:midX, y:a.y},
    {x:midX, y:b.y},
    {x:b.x, y:b.y},
  ];
}

function drawPolyline(ctx, points, color, dashed, muted, highlighted, hovered) {
  if(points.length < 2) return;
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(dashed ? [7,5] : []);
  ctx.globalAlpha = dashed ? 0.55 : muted ? 0.55 : highlighted ? 1 : 0.92;
  ctx.moveTo(points[0].x, points[0].y);
  for(let i=1;i<points.length;i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.strokeStyle = color;
  ctx.lineWidth = dashed ? 2.2 : hovered ? 4.4 : highlighted ? 3.4 : muted ? 2.4 : 2.8;
  ctx.shadowColor = color;
  ctx.shadowBlur = dashed ? 3 : muted ? 0 : hovered ? 12 : 6;
  ctx.stroke();
  ctx.restore();
}

function brightenHex(hex, amount = 0.45) {
  if(typeof hex !== 'string') return '#ffffff';
  const m = hex.trim().match(/^#([0-9a-fA-F]{6})$/);
  if(!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = v => Math.round(v + ((255 - v) * amount));
  const out = (mix(r) << 16) | (mix(g) << 8) | mix(b);
  return `#${out.toString(16).padStart(6, '0')}`;
}

function drawCable(ctx, conn, a, b, dashed, muted = false, highlighted = false, hovered = false, showHandle = true) {
  const points = buildOrthogonalPoints(a, b, conn.routeX);
  connectionGeometryCache.set(conn.id, points);
  const cableColor = hovered ? '#ffffff' : (highlighted ? brightenHex(conn.color, 0.4) : conn.color);
  drawPolyline(ctx, points, cableColor, dashed, muted, highlighted, hovered);

  if(!dashed && !muted) {
    const ends = [points[0], points[points.length-1]];
    ctx.save();
    ends.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, hovered ? 4.2 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = cableColor;
      ctx.shadowColor = cableColor;
      ctx.shadowBlur = hovered ? 12 : 7;
      ctx.fill();
    });
    ctx.restore();

    if(!dashed && showHandle) {
      const handle = { x: points[1].x, y: (points[1].y + points[2].y) / 2 };
      connectionHandleCache.push({ id: conn.id, x: handle.x, y: handle.y });
      ctx.save();
      ctx.fillStyle = muted ? 'rgba(10,11,13,0.76)' : 'rgba(10,11,13,0.92)';
      ctx.strokeStyle = hovered ? '#ffffff' : (highlighted ? cableColor : 'rgba(212,216,226,0.55)');
      ctx.lineWidth = hovered ? 2 : 1.3;
      ctx.beginPath();
      ctx.rect(handle.x - 5, handle.y - 5, 10, 10);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawPreviewCable(ctx, x1, y1, x2, y2, color) {
  const points = buildOrthogonalPoints({x:x1,y:y1}, {x:x2,y:y2}, null);
  drawPolyline(ctx, points, color, true, false, false, false);
}

function findCableHandleAt(x, y) {
  const radius = 8;
  for(let i=connectionHandleCache.length-1;i>=0;i--) {
    const h = connectionHandleCache[i];
    if(Math.abs(h.x - x) <= radius && Math.abs(h.y - y) <= radius) return h;
  }
  return null;
}

function findCableHandleAtWithRadius(x, y, radius) {
  for(let i=connectionHandleCache.length-1;i>=0;i--) {
    const h = connectionHandleCache[i];
    if(Math.abs(h.x - x) <= radius && Math.abs(h.y - y) <= radius) return h;
  }
  return null;
}

function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  if(dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / ((dx * dx) + (dy * dy))));
  const cx = ax + (t * dx);
  const cy = ay + (t * dy);
  return Math.hypot(px - cx, py - cy);
}

function findConnectionAtPoint(x, y) {
  let closest = null;
  let bestDist = Infinity;
  for(let i=connections.length-1; i>=0; i--) {
    const conn = connections[i];
    let pts = connectionGeometryCache.get(conn.id);
    if(!pts || pts.length < 2) {
      const a = getCenterOf(conn.fromId, conn.fromPin);
      const b = getCenterOf(conn.toId, conn.toPin);
      if(!a || !b) continue;
      pts = buildOrthogonalPoints(a, b, conn.routeX);
    }
    for(let s=0; s<pts.length-1; s++) {
      const d = pointToSegmentDistance(x, y, pts[s].x, pts[s].y, pts[s+1].x, pts[s+1].y);
      if(d < bestDist) {
        bestDist = d;
        closest = conn.id;
      }
    }
  }
  return bestDist <= 8 ? closest : null;
}

function handleCanvasConnectionHover(e) {
    scheduleRender(false);
  pendingHoverPoint = { x: e.clientX - wr.left, y: e.clientY - wr.top };
  if(hoverConnectionFrameId) return;
  hoverConnectionFrameId = requestAnimationFrame(() => {
    hoverConnectionFrameId = 0;
    if(!pendingHoverPoint) return;
    const id = findConnectionAtPoint(pendingHoverPoint.x, pendingHoverPoint.y);
    pendingHoverPoint = null;
    setHoveredConnection(id);
  });
}

function handleCableHandleMouseDown(e) {
  const wr = canvasWrap.getBoundingClientRect();
  const x = e.clientX - wr.left;
  const y = e.clientY - wr.top;
  startCableHandleDrag(e, x, y, false);
}

function handleCableHandleTouchStart(e) {
  const point = getClientPointFromEvent(e);
  if(!point) return;
  const wr = canvasWrap.getBoundingClientRect();
  const x = point.clientX - wr.left;
  const y = point.clientY - wr.top;
  startCableHandleDrag(e, x, y, true);
}

function startCableHandleDrag(e, x, y, isTouch) {
  const wr = canvasWrap.getBoundingClientRect();
  const hit = isTouch ? findCableHandleAtWithRadius(x, y, 14) : findCableHandleAt(x, y);
  if(!hit) return;

  e.preventDefault();
  e.stopPropagation();

  const isBusHandle = Array.isArray(hit.connIds) && hit.connIds.length > 1;
  const conn = isBusHandle ? null : connections.find(c => c.id === hit.id);
  const connById = isBusHandle ? new Map(connections.map(item => [item.id, item])) : null;
  if(!isBusHandle && !conn) return;
  const snapshot = captureSnapshot();
  let changed = false;

  function onMove(ev) {
    const point = isTouch ? getClientPointFromEvent(ev) : ev;
    if(!point) return;
    if(isTouch && ev.cancelable) ev.preventDefault();
    const nx = point.clientX - wr.left;
    let routeX = (nx - panX) / zoomLevel;
    if(isBusHandle) {
      hit.connIds.forEach(id => {
        const c = connById ? connById.get(id) : null;
        if(c) {
          if(c.routeX !== routeX) changed = true;
          c.routeX = routeX;
          syncConnectionRouteNormFromWorld(c, stagePx);
        }
      });
    } else {
      if(conn.routeX !== routeX) changed = true;
      conn.routeX = routeX;
      syncConnectionRouteNormFromWorld(conn, stagePx);
    }
    markDirty();
    scheduleRender(false);
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
    document.removeEventListener('touchcancel', onUp);
    if(changed) commitSnapshotBeforeChange(snapshot);
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onUp, { passive: false });
  document.addEventListener('touchcancel', onUp, { passive: false });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DROP
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const canvasWrap = document.getElementById('canvas-wrap');
canvasWrap.addEventListener('mousedown', startPanDrag);
canvasWrap.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.effectAllowed='copy';});
canvasWrap.addEventListener('drop',e=>{
  e.preventDefault();
  if(!isDraggingNew||!newDragData) return;
  const wr=canvasWrap.getBoundingClientRect();
  const body = getInstrumentBodyDimensionsPx(newDragData);
  const worldX = ((e.clientX - wr.left - panX) / zoomLevel) - (body.width / 2);
  const worldY = ((e.clientY - wr.top - panY) / zoomLevel) - (body.height / 2);
  addInstrument(newDragData, worldX, worldY);
  isDraggingNew=false; newDragData=null;
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// INSTRUMENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function addInstrument(data, x, y) {
  pushHistoryState();
  const id = ++idCounter;
  const size = Number(data.size) || (data.wide ? 82 : 52);
  const isDi = data.type === 'di';
  const isPedals = isPedalsType(data.type);
  const diStereo = isDi ? !!(data.stereo || data.inputStereo || data.outputStereo) : false;
  const pedalsInputStereo = isPedals ? !!(data.inputStereo || data.stereo) : false;
  const pedalsOutputStereo = isPedals ? !!(data.outputStereo || data.stereo) : false;
  const ioStereo = isDi ? diStereo : (isPedals ? pedalsOutputStereo : !!data.stereo);
  const boxKind = inferConnectionBoxKind(data);
  const outletPorts = normalizeOutletPortCount(data.outletPorts, data, isRouterOutletType(data) ? 4 : 2);
  instruments.push({
    id,
    type: data.type,
    cat: data.cat || 'infra',
    icon: data.icon,
    image: data.image || getInstrumentImage(data.type),
    label: data.name,
    channel: '',
    notes: '',
    x,
    y,
    stageNX: null,
    stageNY: null,
    size,
    wide: !!data.wide,
    angle: 0,
    stereo: ioStereo,
    inputStereo: isDi ? ioStereo : (isPedals ? pedalsInputStereo : false),
    outputStereo: isDi ? ioStereo : (isPedals ? pedalsOutputStereo : false),
    haUseMainInputs: data.type === 'ha8000' ? !!data.haUseMainInputs : false,
    ampOutputs: (data.type === 'amp' || data.type === 'poweramp') ? Math.max(1, Math.min(16, Number(data.ampOutputs) || 4)) : 0,
    spkInputMode: isSpeakerWithThru(data.type) ? normalizeSpeakerConnectorMode(data.spkInputMode, 'xlr') : '',
    spkOutputMode: isSpeakerWithThru(data.type) ? normalizeSpeakerConnectorMode(data.spkOutputMode, 'xlr') : '',
    connectorMode: data.connectorMode || getDefaultConnectorMode(data.type),
    pinMicAssignments: normalizePinMicAssignments(data.pinMicAssignments),
    micStandCount: Math.max(0, parseInt(data.micStandCount, 10) || 0),
    drumMicStandAssignments: normalizeDrumMicStandAssignments(data.drumMicStandAssignments),
    attachedAccessoryType: normalizeAttachedAccessoryType(data.attachedAccessoryType),
    attachedAccessoryCableType: normalizeAttachedAccessoryCableType(data.attachedAccessoryCableType),
    attachedAccessoryInputCableType: normalizeAttachedAccessoryCableType(data.attachedAccessoryInputCableType || data.attachedAccessoryCableType),
    attachedAccessoryOutputCableType: normalizeAttachedAccessoryCableType(data.attachedAccessoryOutputCableType || data.attachedAccessoryCableType),
    attachedAccessoryStereo: !!data.attachedAccessoryStereo,
    hideWirelessReceiver: !!data.hideWirelessReceiver,
    wirelessPairId: Number.isFinite(Number(data.wirelessPairId)) ? Number(data.wirelessPairId) : null,
    wirelessRole: String(data.wirelessRole || '').trim().toLowerCase(),
    noConnect: !!data.noConnect || isStandType(data.type),
    connSide: data.connSide || 'bottom',
    connectionBoxKind: boxKind || '',
    isMixer: boxKind === 'mixer' || boxKind === 'stagebox',
    mixerInputs: Number(data.mixerInputs) || 0,
    mixerInputXlrOnly: Number(data.mixerInputXlrOnly) || 0,
    mixerInputCombo: Number(data.mixerInputCombo) || 0,
    mixerInputJackOnly: Number(data.mixerInputJackOnly) || 0,
    mixerAux: Number(data.mixerAux) || 0,
    mixerMain: Number(data.mixerMain) || 0,
    mixerJackOut: Number(data.mixerJackOut) || 0,
    mixerP16: Number(data.mixerP16) || 0,
    mixerAes50: Number(data.mixerAes50) || 0,
    outletConnectorType: normalizeOutletConnectorType(data.outletConnectorType, 'ethernet'),
    outletPorts,
    outletViewMode: normalizeOutletViewMode(data.outletViewMode, 'outlet'),
    outletPortModes: normalizeOutletPortModes(data.outletPortModes, outletPorts, normalizeOutletConnectorType(data.outletConnectorType, 'ethernet')),
    outletPortNames: normalizeOutletPortNames(data.outletPortNames, outletPorts, data),
    outletPlacement: data.outletPlacement === 'stage' ? 'stage' : 'wall',
    isSnake: boxKind === 'snake',
    snakeViewMode: normalizeSnakeViewMode(data.snakeViewMode),
    snakeChannels: normalizeSnakeChannels(data.snakeChannels || 16),
    snakeAllowJackInputs: !!data.snakeAllowJackInputs,
    snakeOutputs: normalizeSnakeOutputs(data.snakeOutputs != null ? data.snakeOutputs : data.outputs),
    requiresOutput: !!data.requiresOutput,
    drumMics: data.type === 'drumkit' ? [] : null,
    collapsed: !!data.collapsed,
  });
  const created = instruments[instruments.length-1];
  normalizeWirelessPairMeta(created);
  normalizeConnectionBoxFlags(created);
  normalizeAttachedAccessoryForInstrument(created);
  created.micStandCount = clampMicStandCountForInstrument(created, created.micStandCount);
  syncInstrumentStageNormFromWorld(created, stagePx);
  if(!supportsMicPickup(created)) created.pinMicAssignments = {};
  if(!supportsMicStandOption(created)) {
    created.micStandCount = 0;
    created.drumMicStandAssignments = {};
  }
  if(isWirelessMicType(created)) {
    const pairId = created.id;
    created.wirelessPairId = pairId;
    created.wirelessRole = 'mic';
    created.type = 'wirelessmic';
    created.image = getInstrumentImage('wirelessmic') || created.image;

    const receiverId = ++idCounter;
    const receiver = cloneInstruments([created])[0];
    receiver.id = receiverId;
    receiver.type = 'wirelessreceiver';
    receiver.image = getInstrumentImage('wirelessreceiver') || receiver.image;
    receiver.icon = 'ðŸ“¶';
    receiver.noConnect = false;
    receiver.wirelessPairId = pairId;
    receiver.wirelessRole = 'receiver';
    receiver.micStandCount = 0;
    receiver.drumMicStandAssignments = {};
    receiver.x = created.x + 72;
    receiver.y = created.y;
    normalizeWirelessPairMeta(receiver);
    syncInstrumentStageNormFromWorld(receiver, stagePx);
    instruments.push(receiver);
    renderInstrument(receiver);
  }
  renderInstrument(created);
  updateSnakeViewToggleUI();
  refreshCategoryCollapseButtons();
  const newInstr = created;

  if(newInstr.stereo){
	newInstr.notes = 'Stereo Output (L/R)';
  }
  markDirty();
  document.getElementById('stage-hint').textContent='Click item for properties Â· Drag to arrange Â· Click source pin then destination pin';
  render();
}

function getCollapseButtonHTML(instr) {
  if(!instr || !isConnectionBoxInstrument(instr) || isOutletBox(instr)) return '';
  const title = instr.collapsed ? 'Expand' : 'Collapse';
  const glyph = instr.collapsed ? '+' : '-';
  return `<button class="elem-collapse-btn" type="button" title="${title}" onclick="event.stopPropagation();toggleInstrumentCollapsed(${instr.id})">${glyph}</button>`;
}

function buildConnSideControlsHTML(currentSide) {
  const side = currentSide || 'bottom';
  return `
    <button class="conn-side-handle side-top${side==='top' ? ' active' : ''}" data-side="top" type="button" title="Connector side: top" aria-label="Connector side top"></button>
    <button class="conn-side-handle side-right${side==='right' ? ' active' : ''}" data-side="right" type="button" title="Connector side: right" aria-label="Connector side right"></button>
    <button class="conn-side-handle side-bottom${side==='bottom' ? ' active' : ''}" data-side="bottom" type="button" title="Connector side: bottom" aria-label="Connector side bottom"></button>
    <button class="conn-side-handle side-left${side==='left' ? ' active' : ''}" data-side="left" type="button" title="Connector side: left" aria-label="Connector side left"></button>
  `;
}

function buildRotationHandleHTML() {
  return `<button class="rot-handle rot-corner" type="button" title="Rotate instrument" aria-label="Rotate instrument">&#8635;</button>`;
}

function renderInstrument(instr) {
  const wrap = document.getElementById('canvas-wrap');
  // remove old if exists
  const old = getEl(instr.id); if(old) old.remove();
  if(shouldHideWirelessReceiver(instr)) return;

  const el = document.createElement('div');
  const boxKind = getConnectionBoxKind(instr);
  const visibleLabel = getVisibleInstrumentLabel(instr);
  const safeVisibleLabel = escapeHtml(visibleLabel);
  const safeChannel = escapeHtml(instr.channel || '');
  el.className = 'si';
  if(instr.cat === 'monitoring') el.classList.add('is-monitoring');
  if(boxKind) {
    el.classList.add('is-connbox', `connbox-${boxKind}`);
    // Keep legacy classes for compatibility in non-render paths.
    if(boxKind === 'snake') el.classList.add('is-snake');
    if(boxKind === 'outlet') el.classList.add('is-outlet');
    if(boxKind === 'mixer' || boxKind === 'stagebox') el.classList.add('is-mixer');
  }
  el.id = 'instr-'+instr.id;
  el.dataset.cat = instr.cat||'';
  positionWorldElement(el, instr.x, instr.y);

  const angle = parseInt(instr.angle || 0, 10);
  const isCollapsed = !!instr.collapsed;

  if(boxKind) {
    const body = getInstrumentBodyDimensionsPx(instr);
    const bw = body.width;
    const bh = body.height;
    const fallbackRef = boxKind === 'snake' ? 108 : (boxKind === 'outlet' ? 120 : 194);
    const uiScale = body.uiScale || getRackUIScale(bw, fallbackRef);
    const collapsedHeightFactor = boxKind === 'snake' ? 0.46 : (boxKind === 'outlet' ? 0.62 : 0.42);
    const collapsedMin = boxKind === 'snake' ? 28 : (boxKind === 'outlet' ? 26 : 30);
    const attachedAccessory = getAttachedAccessoryIcon(instr);
    const accessoryBadgeHTML = attachedAccessory
      ? `<div class="accessory-badge" title="Attached accessory: ${getAttachedAccessoryLabel(instr.attachedAccessoryType)}${instr.attachedAccessoryStereo ? ' (Stereo)' : ' (Mono)'}">${attachedAccessory.image ? `<img src="${attachedAccessory.image}" alt="${getAttachedAccessoryLabel(instr.attachedAccessoryType)}" draggable="false">` : `<span class="acc-emoji" aria-hidden="true">${attachedAccessory.emoji}</span>`}</div>`
      : '';
    if(isCollapsed) {
      const boxImage = instr.image || getInstrumentImage(instr.type) || (boxKind === 'snake' ? 'images/snake8.png' : '');
      el.innerHTML = `
        ${getCollapseButtonHTML(instr)}
        <div class="iface" style="transform:rotate(${angle}deg);transform-origin:center center;">
          ${buildRotationHandleHTML()}
          <div class="ib" style="width:${bw}px;min-height:${Math.round(Math.max(collapsedMin, bh * collapsedHeightFactor))}px;padding:${Math.round(5 * uiScale)}px;--ui-scale:${uiScale};">
            ${boxImage ? `<img class="icon-img" src="${boxImage}" alt="${safeVisibleLabel}" draggable="false">` : buildStageIconHTML(instr, Math.round(14 * uiScale))}
            <div class="ib-label${boxKind === 'snake' ? '' : ' inside-top'}">${safeVisibleLabel}</div>
          </div>
          ${accessoryBadgeHTML}
        </div>
      `;
    } else {
      el.innerHTML = `
        ${getCollapseButtonHTML(instr)}
        <div class="iface" style="transform:rotate(${angle}deg);transform-origin:center center;">
          ${buildRotationHandleHTML()}
          ${buildConnectionBoxHTML(instr, bw)}
          ${accessoryBadgeHTML}
        </div>
      `;
    }
  } else {
    const body = getInstrumentBodyDimensionsPx(instr);
    const bw = body.width;
    const bh = body.height;
    const fontSize = Math.round(Math.min(bw, bh) * 0.52);
    const facingMarkerCats = new Set(['drums', 'strings', 'keys', 'vocals', 'brass']);
    const showFacingMarker = facingMarkerCats.has(instr.cat);
    const isStandItem = isStandType(instr);
    if(isStandItem) el.classList.add('is-stand');
    const isNonConnectable = isNonConnectableInstrument(instr);
    const hidePinsForWirelessMic = isWirelessMicNode(instr);
    const suppressPins = isNonConnectable || hidePinsForWirelessMic;
    const isDrumKit = instr.type === 'drumkit';
    const hasCustomIO = isCustomIOInstrument(instr);
    const useAccessoryOutputs = hasAttachedAccessory(instr);
    const isStereo = useAccessoryOutputs ? !!instr.attachedAccessoryStereo : !!instr.stereo;
    const side = instr.connSide || 'bottom';
    const renderP16SidePins = !suppressPins && instr.type === 'p16';
    const drumPins = isDrumKit ? getDrumMicPins(instr) : [];
    const drumPinCols = (side === 'left' || side === 'right')
      ? Math.min(2, Math.max(1, drumPins.length))
      : Math.min(4, Math.max(1, drumPins.length));
    const inputPins = hasCustomIO ? getInstrumentInputPins(instr) : [];
    const outputPins = hasCustomIO ? getInstrumentOutputPins(instr) : [];
    const monoUsed = !isStereo && isPinUsed(instr.id, 'MONO');
    const leftUsed = isStereo && isPinUsed(instr.id, 'L');
    const rightUsed = isStereo && isPinUsed(instr.id, 'R');
    const p16InUsed = isPinUsed(instr.id, 'P16-IN');
    const p16ThruUsed = isPinUsed(instr.id, 'P16-THRU');
    const p16HpUsed = isPinUsed(instr.id, 'P16-HP');
    const drumPinsHTML = drumPins.map(p => `
      <div class="drum-pin-wrap">
        <div class="iconn drum-pin${isPinUsed(instr.id, p.key)?' used':''}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.name)}"></div>
        <div class="pin-tag drum-pin-tag">${p.label}</div>
      </div>
    `).join('');
    const inputPinsHTML = inputPins.map(p => `
      <div class="io-pin-wrap">
        <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
        <div class="pin-tag io-pin-tag">${p.label}</div>
      </div>
    `).join('');
    const outputPinsHTML = outputPins.map(p => `
      <div class="io-pin-wrap">
        <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
        <div class="pin-tag io-pin-tag">${p.label}</div>
      </div>
    `).join('');
    const swapCustomIORows = instr.type === 'di' || instr.type === 'pedals';
    const renderCustomIOSidePins = instr.type === 'laptop';
    const customTopPinsHTML = hasCustomIO ? (swapCustomIORows ? outputPinsHTML : inputPinsHTML) : '';
    const customTopCount = hasCustomIO ? (swapCustomIORows ? outputPins.length : inputPins.length) : 0;
    const customBottomPinsHTML = hasCustomIO ? (swapCustomIORows ? inputPinsHTML : outputPinsHTML) : '';
    const customBottomCount = hasCustomIO ? (swapCustomIORows ? inputPins.length : outputPins.length) : 0;
    const customSidePins = renderCustomIOSidePins ? [...inputPins, ...outputPins] : [];
    const keepCustomPinsSameSide = hasCustomIO && (isSpeakerWithThru(instr) || instr.type === 'amp' || instr.type === 'router' || instr.type === 'p16d');
    const useDualSideCustomIO = hasCustomIO && !renderCustomIOSidePins && !keepCustomPinsSameSide;
    const inputSide = side;
    const outputSide = oppositeSide(side);
    const dualSideTopPins = useDualSideCustomIO
      ? ((inputSide === 'top') ? inputPins : (outputSide === 'top' ? outputPins : []))
      : [];
    const dualSideBottomPins = useDualSideCustomIO
      ? ((inputSide === 'bottom') ? inputPins : (outputSide === 'bottom' ? outputPins : []))
      : [];
    const dualTopPinsHTML = dualSideTopPins.map(p => `
      <div class="io-pin-wrap">
        <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
        <div class="pin-tag io-pin-tag">${p.label}</div>
      </div>
    `).join('');
    const dualBottomPinsHTML = dualSideBottomPins.map(p => `
      <div class="io-pin-wrap">
        <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
        <div class="pin-tag io-pin-tag">${p.label}</div>
      </div>
    `).join('');
    const dualInputSidePinsHTML = useDualSideCustomIO ? inputPins.map((p, idx) => `
      <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" style="${getMainPinStyle(inputSide, idx, inputPins.length)}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
      <div class="pin-tag" style="${getPinTagStyle(inputSide, idx, inputPins.length)}">${p.label}</div>
    `).join('') : '';
    const dualOutputSidePinsHTML = useDualSideCustomIO ? outputPins.map((p, idx) => `
      <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" style="${getMainPinStyle(outputSide, idx, outputPins.length)}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
      <div class="pin-tag" style="${getPinTagStyle(outputSide, idx, outputPins.length)}">${p.label}</div>
    `).join('') : '';
    const sameSidePins = (renderCustomIOSidePins || keepCustomPinsSameSide)
      ? [...inputPins, ...outputPins]
      : [];
    const sidePinEdgePadding = (instr.type === 'p16d' && (side === 'left' || side === 'right')) ? 6 : 14;
    const sameSidePinsHTML = sameSidePins.map((p, idx) => `
      <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" style="${getMainPinStyle(side, idx, sameSidePins.length, sidePinEdgePadding)}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
      <div class="pin-tag" style="${getPinTagStyle(side, idx, sameSidePins.length, sidePinEdgePadding)}">${p.label}</div>
    `).join('');
    const customSidePinsHTML = customSidePins.map((p, idx) => `
      <div class="iconn${isPinUsed(instr.id, p.key)?' used':''}" style="${getMainPinStyle(side, idx, customSidePins.length)}" data-pin="${p.key}" title="${buildPinTitle(instr, p.key, p.label)}"></div>
      <div class="pin-tag" style="${getPinTagStyle(side, idx, customSidePins.length)}">${p.label}</div>
    `).join('');
    const customTopClass = 'inputs';
    const customBottomClass = 'outputs';
    const connSideControlsHTML = suppressPins ? '' : buildConnSideControlsHTML(side);
    const micStandCount = getMicStandCount(instr);
    const showStandBadge = micStandCount > 0 && !isWirelessReceiverNode(instr);
    const standBadgeHTML = showStandBadge
      ? `<div class="mic-stand-badge"><img src="${MIC_STAND_IMAGE_PATH}" alt="mic stand" draggable="false">${micStandCount > 1 ? `<span class="count">x${micStandCount}</span>` : ''}</div>`
      : '';
    const attachedAccessory = getAttachedAccessoryIcon(instr);
    const accessoryBadgeHTML = attachedAccessory
      ? `<div class="accessory-badge" title="Attached accessory: ${getAttachedAccessoryLabel(instr.attachedAccessoryType)}${instr.attachedAccessoryStereo ? ' (Stereo)' : ' (Mono)'}">${attachedAccessory.image ? `<img src="${attachedAccessory.image}" alt="${getAttachedAccessoryLabel(instr.attachedAccessoryType)}" draggable="false">` : `<span class="acc-emoji" aria-hidden="true">${attachedAccessory.emoji}</span>`}</div>`
      : '';
    el.innerHTML = `
      <div class="iface" style="transform:rotate(${angle}deg);transform-origin:center center;">
        ${buildRotationHandleHTML()}
        ${!renderP16SidePins && !isNonConnectable && hasCustomIO && !renderCustomIOSidePins && !keepCustomPinsSameSide && !useDualSideCustomIO && customTopCount ? `<div class="io-pin-row ${customTopClass}" style="grid-template-columns:repeat(${Math.min(customTopCount, 4)},minmax(0,1fr));">${customTopPinsHTML}</div>` : ''}
        ${!renderP16SidePins && !isNonConnectable && useDualSideCustomIO && (inputSide === 'top' || outputSide === 'top') && dualSideTopPins.length ? `<div class="io-pin-row inputs" style="grid-template-columns:repeat(${Math.min(dualSideTopPins.length, 4)},minmax(0,1fr));">${dualTopPinsHTML}</div>` : ''}
        <div class="ib" style="width:${bw}px;height:${bh}px;font-size:${fontSize}px;">
          ${connSideControlsHTML}
          ${buildStageIconHTML(instr, fontSize)}
          ${standBadgeHTML}
          ${accessoryBadgeHTML}
          ${showFacingMarker ? `<div class="front-edge" aria-hidden="true"></div>` : ''}
          <div class="ib-label">${safeVisibleLabel}</div>
          ${instr.channel?`<div class="ich">${safeChannel}</div>`:''}
        </div>
        ${!suppressPins && isDrumKit ? `
          <div class="drum-pin-row side-${side}" style="--drum-pin-cols:${drumPinCols};">${drumPinsHTML}</div>
        ` : (!renderP16SidePins && !suppressPins && (renderCustomIOSidePins || keepCustomPinsSameSide)) ? `
          ${sameSidePinsHTML}
        ` : (!renderP16SidePins && !suppressPins && useDualSideCustomIO && (inputSide === 'left' || inputSide === 'right' || outputSide === 'left' || outputSide === 'right')) ? `
          ${dualInputSidePinsHTML}
          ${dualOutputSidePinsHTML}
        ` : (!renderP16SidePins && !suppressPins && useDualSideCustomIO) ? `
          ${dualSideBottomPins.length ? `<div class="io-pin-row outputs" style="grid-template-columns:repeat(${Math.min(dualSideBottomPins.length, 4)},minmax(0,1fr));">${dualBottomPinsHTML}</div>` : ''}
        ` : (!renderP16SidePins && !suppressPins && hasCustomIO) ? `
          ${customBottomCount ? `<div class="io-pin-row ${customBottomClass}" style="grid-template-columns:repeat(${Math.min(customBottomCount, 4)},minmax(0,1fr));">${customBottomPinsHTML}</div>` : ''}
        ` : renderP16SidePins ? `
          <div class="iconn${p16InUsed?' used':''}" style="${getMainPinStyle(side, 0, 3)}" data-pin="P16-IN" title="${buildPinTitle(instr, 'P16-IN', 'IN')}"></div>
          <div class="iconn${p16ThruUsed?' used':''}" style="${getMainPinStyle(side, 1, 3)}" data-pin="P16-THRU" title="${buildPinTitle(instr, 'P16-THRU', 'THRU')}"></div>
          <div class="iconn${p16HpUsed?' used':''}" style="${getMainPinStyle(side, 2, 3)}" data-pin="P16-HP" title="${buildPinTitle(instr, 'P16-HP', 'HP')}"></div>
          <div class="pin-tag" style="${getPinTagStyle(side, 0, 3)}">I</div>
          <div class="pin-tag" style="${getPinTagStyle(side, 1, 3)}">T</div>
          <div class="pin-tag" style="${getPinTagStyle(side, 2, 3)}">H</div>
        ` : (!suppressPins && isStereo) ? `
          <div class="iconn${leftUsed?' used':''}" style="${getMainPinStyle(side, 0, 2)}" data-pin="L" title="${buildPinTitle(instr, 'L', 'Left Output')}"></div>
          <div class="iconn${rightUsed?' used':''}" style="${getMainPinStyle(side, 1, 2)}" data-pin="R" title="${buildPinTitle(instr, 'R', 'Right Output')}"></div>
          <div class="pin-tag" style="${getPinTagStyle(side, 0, 2)}">L</div>
          <div class="pin-tag" style="${getPinTagStyle(side, 1, 2)}">R</div>
        ` : (!suppressPins ? `<div class="iconn${monoUsed?' used':''}" style="${getMainPinStyle(side, 0, 1)}" data-pin="MONO" title="${buildPinTitle(instr, 'MONO', 'Output')}"></div>` : '')}
      </div>
    `;
  }

  el.querySelectorAll('.rot-handle').forEach(handle => {
    handle.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      startInstrumentRotation(e, instr.id);
    });
    handle.addEventListener('touchstart', e => {
      if(e.cancelable) e.preventDefault();
      e.stopPropagation();
      startInstrumentRotation(e, instr.id);
    }, { passive: false });
  });

  el.querySelectorAll('.conn-side-handle').forEach(btn => {
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      setInstrumentConnSide(instr.id, btn.dataset.side, true);
    });
    btn.addEventListener('touchstart', e => {
      if(e.cancelable) e.preventDefault();
      e.stopPropagation();
      setInstrumentConnSide(instr.id, btn.dataset.side, true);
    }, { passive: false });
  });

  // Drag to move
  el.addEventListener('mousedown', e => {
    if(e.target.classList.contains('iconn') || e.target.classList.contains('connbox-pin') || e.target.classList.contains('rot-handle') || e.target.classList.contains('conn-side-handle') || e.target.closest('.snake-mode-btn') || e.target.closest('.elem-collapse-btn') || e.target.closest('.rot-handle') || e.target.closest('.conn-side-handle')) return;
    e.preventDefault();
    e.stopPropagation();
    startDrag(e, instr.id, el);
  });
  el.addEventListener('touchstart', e => {
    if(e.target.classList.contains('iconn') || e.target.classList.contains('connbox-pin') || e.target.classList.contains('rot-handle') || e.target.classList.contains('conn-side-handle') || e.target.closest('.snake-mode-btn') || e.target.closest('.elem-collapse-btn') || e.target.closest('.rot-handle') || e.target.closest('.conn-side-handle')) return;
    if(e.cancelable) e.preventDefault();
    e.stopPropagation();
    startDragTouch(e, instr.id, el);
  }, { passive: false });

  // Regular connector dot
  const conn = el.querySelector('.iconn');
  if(conn) {
    const handleRegularPin = e => {
      e.stopPropagation();
      const pin = e.currentTarget.dataset.pin || 'MONO';
      startConnectionFromPin(instr.id, pin, e);
    };
    el.querySelectorAll('.iconn').forEach(pinEl => {
      pinEl.addEventListener('mousedown', handleRegularPin);
      pinEl.addEventListener('touchstart', e => {
        if(e.cancelable) e.preventDefault();
        e.stopPropagation();
        const pin = e.currentTarget.dataset.pin || 'MONO';
        startConnectionFromPin(instr.id, pin, e);
      }, { passive: false });
    });
  }

  if(boxKind) {
    el.querySelectorAll('.connbox-pin').forEach(pin => {
      pin.addEventListener('mousedown', e => {
        e.stopPropagation();
        startConnectionFromPin(instr.id, pin.dataset.pin, e);
      });
      pin.addEventListener('touchstart', e => {
        e.stopPropagation();
        if(!isCoarsePointerInput()) {
          if(e.cancelable) e.preventDefault();
          startConnectionFromPin(instr.id, pin.dataset.pin, e);
          return;
        }
        const startPoint = getClientPointFromEvent(e);
        if(!startPoint) {
          if(e.cancelable) e.preventDefault();
          startConnectionFromPin(instr.id, pin.dataset.pin, e);
          return;
        }
        let dragStarted = false;

        function cleanupPinIntent() {
          document.removeEventListener('touchmove', onPinMove);
          document.removeEventListener('touchend', onPinEnd);
          document.removeEventListener('touchcancel', onPinEnd);
        }

        function onPinMove(moveEv) {
          const point = getClientPointFromEvent(moveEv);
          if(!point) return;
          const travel = Math.hypot(point.clientX - startPoint.clientX, point.clientY - startPoint.clientY);
          if(travel < TOUCH_PIN_TAP_MAX_TRAVEL_PX) return;
          dragStarted = true;
          cleanupPinIntent();
          if(moveEv.cancelable) moveEv.preventDefault();
          startDragTouch(moveEv, instr.id, el);
        }

        function onPinEnd(endEv) {
          cleanupPinIntent();
          if(dragStarted) return;
          if(endEv.cancelable) endEv.preventDefault();
          startConnectionFromPin(instr.id, pin.dataset.pin, endEv);
        }

        document.addEventListener('touchmove', onPinMove, { passive: false });
        document.addEventListener('touchend', onPinEnd, { passive: false });
        document.addEventListener('touchcancel', onPinEnd, { passive: false });
      }, { passive: false });
    });
  }

  wrap.appendChild(el);
}

function buildConnectionBoxPin(instr, key, label, baseLabel, extraClass = '', inlineStyle = '') {
  const used = isPinUsed(instr.id, key);
  const styleAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  return `<div id="pin-${instr.id}-${key}" class="connbox-pin${extraClass}${used?' used':''}" data-pin="${escapeHtml(String(key))}" title="${escapeHtml(buildPinTitle(instr, key, baseLabel))}"${styleAttr}>${escapeHtml(String(label))}</div>`;
}

function buildConnectionBoxHTML(instr, widthPx) {
  const kind = getConnectionBoxKind(instr);
  if(!kind) return '';
  const visibleLabel = getVisibleInstrumentLabel(instr);
  const refWidth = kind === 'snake' ? 108 : (kind === 'outlet' ? 84 : 194);
  const body = getInstrumentBodyDimensionsPx(instr);
  const resolvedWidth = Number(widthPx) || body.width;
  const uiScale = body.uiScale || getRackUIScale(resolvedWidth, refWidth);
  const rackScale = uiScale;
  const rackPinScale = uiScale;
  const rackSectionScale = uiScale;
  const innerPad = Math.round(5 * uiScale);

  if(kind === 'outlet') {
    const ports = normalizeOutletPortCount(instr.outletPorts, instr);
    const cols = ports;
    const bh = Math.max(24, body.height);
    let pins = '';
    for(let i=1;i<=ports;i++) {
      const visibleKey = getOutletPortVisibleKey(instr, i);
      pins += buildConnectionBoxPin(instr, visibleKey, getOutletPortName(instr, i), getOutletPortTitle(instr, i), ' outlet-pin', getOutletPortVisualStyle(instr, i));
    }
    return `
      <div class="ib outlet-mode" style="width:${resolvedWidth}px;min-height:${Math.round(bh)}px;padding:${Math.round(4 * uiScale)}px;flex-direction:column;font-size:0;--ui-scale:${uiScale};--rack-ui-scale:${rackScale};--rack-pin-scale:${rackPinScale};--port-label-scale:${rackPinScale};--rack-section-scale:${rackSectionScale};--connbox-ui-scale:${uiScale};">
        <div class="connbox-pin-grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${Math.max(2, Math.round(2 * uiScale))}px;max-width:none;margin:0;">${pins}</div>
      </div>
    `;
  }

  if(kind === 'snake') {
    const ch = instr.snakeChannels || 16;
    const outputs = Math.max(0, Number(instr.snakeOutputs) || 0);
    const bh = body.height;
    const stageMode = getSnakeViewMode(instr) !== 'output';

    let inputPins = '';
    for(let i=1;i<=ch;i++){
      const topPinKey = stageMode ? `STAGE-IN-${i}` : `CABLE-OUT-${i}`;
      const roleLabel = stageMode ? `Input ${i}` : `Output ${i}`;
      const pinClass = stageMode ? '' : ' out-pin';
      inputPins += buildConnectionBoxPin(instr, topPinKey, `${i}`, `${roleLabel} (paired with channel ${i})`, pinClass);
    }

    let outputPins = '';
    for(let i=1;i<=outputs;i++){
      const bottomPinKey = stageMode ? `STAGE-OUT-${i}` : `CABLE-IN-${i}`;
      const label = indexToLetters(i);
      const pinClass = stageMode ? ' out-pin' : '';
      const roleLabel = stageMode ? `Output ${label}` : `Input ${label}`;
      outputPins += buildConnectionBoxPin(instr, bottomPinKey, label, `${roleLabel} (paired with channel ${label})`, pinClass);
    }

    const topLabel = stageMode ? 'INPUTS' : 'OUTPUTS';
    const bottomLabel = stageMode ? 'OUTPUTS' : 'INPUTS';
    const ioTypeLabel = stageMode ? 'STAGE' : 'CABLE';

    return `
      <div class="ib" style="width:${resolvedWidth}px;min-height:${Math.round(bh)}px;padding:${Math.round(14 * uiScale)}px ${Math.round(4 * uiScale)}px ${Math.round(4 * uiScale)}px;flex-direction:column;font-size:0;--ui-scale:${uiScale};--rack-ui-scale:${rackScale};--rack-pin-scale:${rackPinScale};--port-label-scale:${rackPinScale};--rack-section-scale:${rackSectionScale};--connbox-ui-scale:${uiScale};">
        <div class="ib-label snake-inside">${instr.label}</div>
        <div class="snake-mode-row">
          <button class="snake-mode-btn${stageMode?' active':''}" data-mode="input" type="button" onclick="event.stopPropagation();setSnakeViewModeForSnake(${instr.id}, 'input')">STAGE</button>
          <button class="snake-mode-btn${!stageMode?' active':''}" data-mode="output" type="button" onclick="event.stopPropagation();setSnakeViewModeForSnake(${instr.id}, 'output')">CABLE</button>
        </div>
        <div class="rack-section-label" style="color:#c47fff;margin-top:${Math.round(2 * uiScale)}px;">${topLabel} <span class="rack-section-type">${ioTypeLabel}</span></div>
        <div class="connbox-pin-grid snake-channels">${inputPins}</div>
        ${outputs > 0 ? `<div class="rack-section-label" style="color:#1f8a5a;margin-top:${Math.round(6 * uiScale)}px;">${bottomLabel} <span class="rack-section-type">${ioTypeLabel}</span></div><div class="connbox-pin-grid snake-channels">${outputPins}</div>` : ''}
      </div>
    `;
  }

  const minHeight = Math.max(44, 62 * uiScale);
  const inputs = Math.max(0, Number(instr.mixerInputs) || 18);
  const breakdown = getMixerInputBreakdown(instr);
  const xlrInputCount = Math.max(0, breakdown.xlrOnly);
  const comboInputCount = Math.max(0, breakdown.combo);
  const auxInputCount = Math.max(0, breakdown.auxInputs);
  const auxCount = Math.max(0, Number(instr.mixerAux) || 6);
  const noMainFamilies = new Set(['x32', 'x32compact', 'x32rack', 'wing', 'wingcompact', 'wingrack', 'm32', 'm32r', 's32', 's16']);
  const mainCount = noMainFamilies.has(instr.type) ? 0 : Math.max(0, Number(instr.mixerMain) || 2);
  const jackOutCount = Math.max(0, Number(instr.mixerJackOut) || 0);
  const pmCount = Math.max(0, Number(instr.mixerP16) || 0);
  const aes50Count = Math.max(0, Number(instr.mixerAes50) || 0);
  const hpCount = hasMixerHeadphonePort(instr) ? 1 : 0;
  const usbCount = hasMixerUsbPort(instr) ? 1 : 0;
  const xlrOutCount = auxCount + mainCount;
  const isStagebox = instr.type === 's32' || instr.type === 's16';
  const genericInputCount = (xlrInputCount + comboInputCount + auxInputCount) > 0 ? 0 : inputs;

  const mixerImage = instr.image
    ? `<img class="icon-img" src="${instr.image}" alt="${visibleLabel}" draggable="false" style="width:${Math.round(34 * uiScale)}px;height:${Math.round(34 * uiScale)}px;object-fit:contain;">`
    : `<span class="icon-emoji" style="font-size:${Math.round(18 * uiScale)}px;line-height:1;">${instr.icon || 'ðŸŽš'}</span>`;

  let inputSections = '';
  let inputIndex = 1;

  if(xlrInputCount > 0) {
    let pins = '';
    for(let i=1;i<=xlrInputCount;i++) {
      const key = `MX-IN-${inputIndex}`;
      pins += buildConnectionBoxPin(instr, key, `${inputIndex}`, `Input ${inputIndex} (XLR)`);
      inputIndex += 1;
    }
    inputSections += `<div class="mixer-row-label">INPUTS <span class="mixer-row-type">XLR</span></div><div class="connbox-pin-grid mixer-pin-grid">${pins}</div>`;
  }

  if(comboInputCount > 0) {
    let pins = '';
    for(let i=1;i<=comboInputCount;i++) {
      const key = `MX-IN-${inputIndex}`;
      pins += buildConnectionBoxPin(instr, key, `${inputIndex}`, `Input ${inputIndex} (Combo)`);
      inputIndex += 1;
    }
    inputSections += `<div class="mixer-row-label">INPUTS <span class="mixer-row-type">COMBO</span></div><div class="connbox-pin-grid mixer-pin-grid">${pins}</div>`;
  }

  if(auxInputCount > 0) {
    let pins = '';
    for(let i=1;i<=auxInputCount;i++) {
      const key = `MX-AUX-IN-${i}`;
      const lbl = getMixerAuxInputShortLabel(instr, i);
      pins += buildConnectionBoxPin(instr, key, lbl, getMixerAuxInputLongLabel(instr, i));
    }
    inputSections += `<div class="mixer-row-label">INPUTS <span class="mixer-row-type">AUX JACK</span></div><div class="connbox-pin-grid mixer-pin-grid">${pins}</div>`;
  }

  if(genericInputCount > 0) {
    let pins = '';
    for(let i=1;i<=genericInputCount;i++) {
      const key = `MX-IN-${i}`;
      pins += buildConnectionBoxPin(instr, key, `${i}`, `Input ${i}`);
    }
    inputSections += `<div class="mixer-row-label">INPUTS</div><div class="connbox-pin-grid mixer-pin-grid">${pins}</div>`;
  }

  let outputSections = '';
  let xlrOutputPins = '';
  for(let i=1;i<=auxCount;i++) {
    const key = `MX-AUX-${i}`;
    const outTitle = `XLR Out ${i}`;
    const outLabel = `${i}`;
    xlrOutputPins += buildConnectionBoxPin(instr, key, outLabel, outTitle, ' out-pin');
  }
  if(xlrOutputPins) outputSections += `<div class="mixer-row-label">OUTPUTS <span class="mixer-row-type">XLR</span></div><div class="connbox-pin-grid mixer-pin-grid">${xlrOutputPins}</div>`;

  const mainLabels = ['L', 'R'];
  let mainOutputPins = '';
  for(let i=1;i<=mainCount;i++) {
    const key = `MX-MAIN-${i}`;
    const lbl = mainLabels[i-1] || String(i);
    mainOutputPins += buildConnectionBoxPin(instr, key, `M${lbl}`, `Main Out ${lbl}`, ' out-pin');
  }
  if(mainOutputPins) outputSections += `<div class="mixer-row-label">OUTPUTS <span class="mixer-row-type">MAIN</span></div><div class="connbox-pin-grid mixer-pin-grid">${mainOutputPins}</div>`;

  let auxJackOutputPins = '';
  for(let i=1;i<=jackOutCount;i++) {
    const key = `MX-JACK-OUT-${i}`;
    const lbl = `A${i}`;
    auxJackOutputPins += buildConnectionBoxPin(instr, key, lbl, `Aux Output ${lbl} (Jack TS)`, ' out-pin');
  }
  if(auxJackOutputPins) outputSections += `<div class="mixer-row-label">OUTPUTS <span class="mixer-row-type">AUX JACK</span></div><div class="connbox-pin-grid mixer-pin-grid">${auxJackOutputPins}</div>`;

  let otherPins = '';

  for(let i=1;i<=pmCount;i++) {
    const key = `MX-P16-${i}`;
    otherPins += buildConnectionBoxPin(instr, key, `PM${i}`, `Ultranet ${i}`, ' other-pin');
  }

  for(let i=1;i<=aes50Count;i++) {
    const key = `MX-AES50-${i}`;
    otherPins += buildConnectionBoxPin(instr, key, `A5${i}`, `AES50 ${i}`, ' other-pin');
  }

  for(let i=1;i<=hpCount;i++) {
    const key = `MX-HP-${i}`;
    otherPins += buildConnectionBoxPin(instr, key, 'HP', `Headphones ${i} (Jack TRS)`, ' out-pin other-pin');
  }

  for(let i=1;i<=usbCount;i++) {
    const key = `MX-USB-${i}`;
    otherPins += buildConnectionBoxPin(instr, key, 'USB', `USB ${i}`, ' other-pin');
  }

  const otherLabelParts = [];
  if(pmCount) otherLabelParts.push('ULTRANET');
  if(aes50Count) otherLabelParts.push('AES50');
  if(hpCount) otherLabelParts.push('HP');
  if(usbCount) otherLabelParts.push('USB');
  const otherLabel = otherLabelParts.length ? otherLabelParts.join(' Â· ') : 'NONE';

  return `
    <div class="ib" style="width:${resolvedWidth}px;min-height:${Math.round(minHeight)}px;padding:${innerPad}px;flex-direction:column;font-size:0;--ui-scale:${uiScale};--rack-ui-scale:${rackScale};--rack-pin-scale:${rackPinScale};--port-label-scale:${rackPinScale};--rack-section-scale:${rackSectionScale};--connbox-ui-scale:${uiScale};">
      <div class="ib-label inside-top">${visibleLabel}</div>
      <div style="display:flex;justify-content:center;align-items:center;margin-top:${Math.round(2 * uiScale)}px;">${mixerImage}</div>
      ${inputSections}
      ${outputSections}
      ${otherPins ? `<div class="mixer-row-label">OTHERS <span class="mixer-row-type">${otherLabel}</span></div><div class="connbox-pin-grid mixer-pin-grid">${otherPins}</div>` : ''}
    </div>
  `;
}

function buildCollapsedConnectionBoxHTML(instr, widthPx) {
  const boxKind = getConnectionBoxKind(instr);
  if(!boxKind) return '';
  const body = getInstrumentBodyDimensionsPx(instr);
  const resolvedWidth = Math.max(1, Number(widthPx) || body.width);
  const uiScale = body.uiScale || getRackUIScale(resolvedWidth, boxKind === 'snake' ? 108 : (boxKind === 'outlet' ? 120 : 194));
  const collapsedHeightFactor = boxKind === 'snake' ? 0.46 : (boxKind === 'outlet' ? 0.62 : 0.42);
  const collapsedMin = boxKind === 'snake' ? 28 : (boxKind === 'outlet' ? 26 : 30);
  const minHeight = Math.round(Math.max(collapsedMin, body.height * collapsedHeightFactor));
  const visibleLabel = escapeHtml(getVisibleInstrumentLabel(instr));
  const boxImage = instr.image || getInstrumentImage(instr.type) || (boxKind === 'snake' ? 'images/snake8.png' : '');
  const attachedAccessory = getAttachedAccessoryIcon(instr);
  const accessoryBadgeHTML = attachedAccessory
    ? `<div class="accessory-badge" title="Attached accessory: ${getAttachedAccessoryLabel(instr.attachedAccessoryType)}${instr.attachedAccessoryStereo ? ' (Stereo)' : ' (Mono)'}">${attachedAccessory.image ? `<img src="${attachedAccessory.image}" alt="${getAttachedAccessoryLabel(instr.attachedAccessoryType)}" draggable="false">` : `<span class="acc-emoji" aria-hidden="true">${attachedAccessory.emoji}</span>`}</div>`
    : '';
  const imageHTML = boxImage ? `<img class="icon-img" src="${boxImage}" alt="${visibleLabel}" draggable="false">` : buildStageIconHTML(instr, Math.round(14 * uiScale));
  const labelClass = boxKind === 'snake' ? '' : ' inside-top';

  return `
    <div class="ib" style="width:${resolvedWidth}px;min-height:${minHeight}px;padding:${Math.round(5 * uiScale)}px;--ui-scale:${uiScale};">
      ${imageHTML}
      <div class="ib-label${labelClass}">${visibleLabel}</div>
    </div>
    ${accessoryBadgeHTML}
  `;
}

function buildSnakeHTML(instr, includeLabel = true) {
  return buildConnectionBoxHTML(instr);
}

function buildMixerHTML(instr, widthPx) {
  return buildConnectionBoxHTML(instr, widthPx);
}

function refreshSnakePins(id) {
  const instr = instruments.find(i=>i.id===id); if(!instr || !isConnectionBoxInstrument(instr)) return;
  const el = getEl(id); if(!el) return;
  el.querySelectorAll('.connbox-pin, .mixer-pin, .snake-ch-pin').forEach(pin => {
    const p = pin.dataset.pin;
    if(!p) return;
    const used = isPinUsed(id, p);
    pin.classList.toggle('used', used);
  });
}

function refreshConnectorStates(id) {
  const instr = instruments.find(i => i.id === id);
  if(!instr) return;
  if(isConnectionBoxInstrument(instr)) {
    renderInstrument(instr);
    getWirelessSelectionIds(selectedId).forEach(selId => {
      const el = getEl(selId);
      if(el) el.classList.add('selected');
    });
    return;
  }
  renderInstrument(instr);
}

function startDrag(e, id, el) {
  const dragSnapshot = captureSnapshot();
  const wr = document.getElementById('canvas-wrap').getBoundingClientRect();
  const instr = instruments.find(i=>i.id===id);
  if(!instr) return;
  const pointerWorldStartX = (e.clientX - wr.left - panX) / zoomLevel;
  const pointerWorldStartY = (e.clientY - wr.top - panY) / zoomLevel;
  const offsetWorldX = pointerWorldStartX - instr.x;
  const offsetWorldY = pointerWorldStartY - instr.y;
  let moved = false;
  el.classList.add('dragging');
  const dz = document.getElementById('dz');
  const dropZone = document.getElementById('delete-sidebar-zone');
  const hint = document.getElementById('stage-hint');
  if(dz) dz.classList.add('visible');
  if(dropZone) dropZone.classList.add('delete-target-active');
  document.body.classList.add('delete-dragging');
  if(hint) hint.textContent = 'DROP ON LEFT SIDEBAR TO DELETE';

  function isOverDeleteZone(evt) {
    if(dropZone) {
      const zr = dropZone.getBoundingClientRect();
      if(evt.clientX>=zr.left&&evt.clientX<=zr.right&&evt.clientY>=zr.top&&evt.clientY<=zr.bottom) return true;
    }
    if(dz) {
      const dzr = dz.getBoundingClientRect();
      if(evt.clientX>=dzr.left&&evt.clientX<=dzr.right&&evt.clientY>=dzr.top&&evt.clientY<=dzr.bottom) return true;
    }
    return false;
  }

  function onMove(e){
    const x = ((e.clientX - wr.left - panX) / zoomLevel) - offsetWorldX;
    const y = ((e.clientY - wr.top - panY) / zoomLevel) - offsetWorldY;
    moved = true;
    instr.x=x; instr.y=y;
    syncInstrumentStageNormFromWorld(instr, stagePx);
    positionWorldElement(el, instr.x, instr.y);
    scheduleRender();
    const overDeleteZone = isOverDeleteZone(e);
    if(dz) dz.style.background = overDeleteZone ? 'rgba(255,107,71,.28)' : 'rgba(255,107,71,.1)';
    if(dropZone) dropZone.classList.toggle('delete-target-hot', overDeleteZone);
    document.body.classList.toggle('delete-dragging-hot', overDeleteZone);
  }
  function onUp(e){
    el.classList.remove('dragging');
    if(dz) {
      dz.classList.remove('visible');
      dz.style.background='rgba(255,107,71,.1)';
    }
    if(dropZone) {
      dropZone.classList.remove('delete-target-hot');
      dropZone.classList.remove('delete-target-active');
    }
    document.body.classList.remove('delete-dragging-hot');
    document.body.classList.remove('delete-dragging');
    if(hint) hint.textContent = getModeHintText();
    if(isOverDeleteZone(e)) deleteInstrument(id);
    else if(moved) {
      commitSnapshotBeforeChange(dragSnapshot);
      markDirty();
      selectInstrument(id);
    } else {
      selectInstrument(id);
    }
    document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); scheduleRender();
  }
  document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
}

function startDragTouch(e, id, el) {
  const p0 = getClientPointFromEvent(e);
  if(!p0) return;
  const dragSnapshot = captureSnapshot();
  const wr = document.getElementById('canvas-wrap').getBoundingClientRect();
  const instr = instruments.find(i=>i.id===id);
  if(!instr) return;
  const pointerWorldStartX = (p0.clientX - wr.left - panX) / zoomLevel;
  const pointerWorldStartY = (p0.clientY - wr.top - panY) / zoomLevel;
  const offsetWorldX = pointerWorldStartX - instr.x;
  const offsetWorldY = pointerWorldStartY - instr.y;
  const startClientX = p0.clientX;
  const startClientY = p0.clientY;
  let dragStarted = false;
  let moved = false;
  el.classList.add('dragging');
  const dz = document.getElementById('dz');
  const dropZone = document.getElementById('delete-sidebar-zone');
  const hint = document.getElementById('stage-hint');
  if(dz) dz.classList.add('visible');
  if(dropZone) dropZone.classList.add('delete-target-active');
  document.body.classList.add('delete-dragging');
  if(hint) hint.textContent = 'DROP ON LEFT SIDEBAR TO DELETE';

  function isOverDeleteZone(clientX, clientY) {
    if(dropZone) {
      const zr = dropZone.getBoundingClientRect();
      if(clientX>=zr.left&&clientX<=zr.right&&clientY>=zr.top&&clientY<=zr.bottom) return true;
    }
    if(dz) {
      const dzr = dz.getBoundingClientRect();
      if(clientX>=dzr.left&&clientX<=dzr.right&&clientY>=dzr.top&&clientY<=dzr.bottom) return true;
    }
    return false;
  }

  function onMove(ev){
    const p = getClientPointFromEvent(ev);
    if(!p) return;
    if(!dragStarted) {
      const travel = Math.hypot(p.clientX - startClientX, p.clientY - startClientY);
      if(travel < TOUCH_DRAG_START_THRESHOLD_PX) return;
      dragStarted = true;
    }
    if(ev.cancelable) ev.preventDefault();
    const x = ((p.clientX - wr.left - panX) / zoomLevel) - offsetWorldX;
    const y = ((p.clientY - wr.top - panY) / zoomLevel) - offsetWorldY;
    moved = true;
    instr.x=x; instr.y=y;
    syncInstrumentStageNormFromWorld(instr, stagePx);
    positionWorldElement(el, instr.x, instr.y);
    scheduleRender();
    const overDeleteZone = isOverDeleteZone(p.clientX, p.clientY);
    if(dz) dz.style.background = overDeleteZone ? 'rgba(255,107,71,.28)' : 'rgba(255,107,71,.1)';
    if(dropZone) dropZone.classList.toggle('delete-target-hot', overDeleteZone);
    document.body.classList.toggle('delete-dragging-hot', overDeleteZone);
  }
  function onUp(ev){
    const p = getClientPointFromEvent(ev);
    el.classList.remove('dragging');
    if(dz) {
      dz.classList.remove('visible');
      dz.style.background='rgba(255,107,71,.1)';
    }
    if(dropZone) {
      dropZone.classList.remove('delete-target-hot');
      dropZone.classList.remove('delete-target-active');
    }
    document.body.classList.remove('delete-dragging-hot');
    document.body.classList.remove('delete-dragging');
    if(hint) hint.textContent = getModeHintText();

    if(p && isOverDeleteZone(p.clientX, p.clientY)) deleteInstrument(id);
    else if(moved) {
      commitSnapshotBeforeChange(dragSnapshot);
      markDirty();
      selectInstrument(id);
    } else {
      selectInstrument(id);
    }
    document.removeEventListener('touchmove',onMove);
    document.removeEventListener('touchend',onUp);
    document.removeEventListener('touchcancel',onUp);
    scheduleRender();
  }
  document.addEventListener('touchmove',onMove, { passive: false });
  document.addEventListener('touchend',onUp, { passive: false });
  document.addEventListener('touchcancel',onUp, { passive: false });
}

function startInstrumentRotation(ev, id) {
  const instr = instruments.find(i => i.id === id);
  if(!instr) return;
  const rotateSnapshot = captureSnapshot();
  let changed = false;

  selectedId = id;
  updateClasses();
  updateAngleKnobUI(parseInt(instr.angle || 0, 10));

  const seedEl = getEl(id);
  if(seedEl) seedEl.classList.add('rotating');

  function clientToAngle(clientX, clientY) {
    const liveEl = getEl(id);
    if(!liveEl) return parseInt(instr.angle || 0, 10);
    const anchor = liveEl.querySelector('.ib') || liveEl;
    const r = anchor.getBoundingClientRect();
    const cx = r.left + (r.width / 2);
    const cy = r.top + (r.height / 2);
    let deg = Math.round((Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI) + 90);
    if(deg > 180) deg -= 360;
    if(deg < -180) deg += 360;
    return Math.max(-180, Math.min(180, deg));
  }

  function applyAngle(clientX, clientY) {
    const next = snapAngleToCommonIncrement(clientToAngle(clientX, clientY));
    if((instr.angle || 0) === next) return;
    instr.angle = next;
    changed = true;
    markDirty();
    renderInstrument(instr);
    updateClasses();
    updateAngleKnobUI(next);
    const liveEl = getEl(id);
    if(liveEl) liveEl.classList.add('rotating');
    scheduleRender();
  }

  function onMouseMove(e) {
    applyAngle(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    const p = getClientPointFromEvent(e);
    if(!p) return;
    if(e.cancelable) e.preventDefault();
    applyAngle(p.clientX, p.clientY);
  }

  function finishRotation() {
    const liveEl = getEl(id);
    if(liveEl) liveEl.classList.remove('rotating');
    if(changed) {
      commitSnapshotBeforeChange(rotateSnapshot);
      markDirty();
    }
    selectInstrument(id);
    scheduleRender();
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    finishRotation();
  }

  function onTouchEnd() {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('touchcancel', onTouchEnd);
    finishRotation();
  }

  const p = getClientPointFromEvent(ev);
  if(p) applyAngle(p.clientX, p.clientY);

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd, { passive: false });
  document.addEventListener('touchcancel', onTouchEnd, { passive: false });
}

function selectInstrument(id) {
  if(isStageBuilderMode) return;
  selectedStagePartId = null;
  selectedId=id;
  updateClasses();
  hoveredConnectionId = null;
  const instr=instruments.find(i=>i.id===id); if(!instr) return;
  normalizeAttachedAccessoryForInstrument(instr);
  document.getElementById('no-sel').style.display='none';
  document.getElementById('prop-fields').style.display='block';
  document.getElementById('p-label').value=instr.label;
  document.getElementById('p-ch').value=instr.channel;
  document.getElementById('p-notes').value=instr.notes;
  const sz = instr.size||52;
  document.getElementById('p-size').value=sz;
  document.getElementById('p-size-val').textContent=sz;
  const defSz = getDefaultSizeForType(instr.type, instr.wide ? 82 : 52);
  const defEl = document.getElementById('p-size-def');
  if(defEl) defEl.textContent = `Def:${defSz}`;
  const ang = parseInt(instr.angle || 0, 10);
  updateAngleKnobUI(ang);
  const connTypeWrap = document.getElementById('conn-type-wrap');
  const micWrap = document.getElementById('mic-wrap');
  const micStandWrap = document.getElementById('mic-stand-wrap');
  const accessoryWrap = document.getElementById('accessory-wrap');
  const wirelessLinkWrap = document.getElementById('wireless-link-wrap');
  const sideWrap = document.getElementById('conn-side-wrap');
  const stereoWrap = document.getElementById('stereo-wrap');
  const ioModeWrap = document.getElementById('io-mode-wrap');
  const speakerIOWrap = document.getElementById('speaker-io-wrap');
  const ampExtra = document.getElementById('amp-extra');
  const haExtra = document.getElementById('ha-extra');
  const outletExtra = document.getElementById('outlet-extra');
  const routerExtra = document.getElementById('router-extra');
  if(isConnectionBoxInstrument(instr)) {
    connTypeWrap.style.display = 'none';
    micWrap.style.display = 'none';
    micStandWrap.style.display = 'none';
    accessoryWrap.style.display = '';
    sideWrap.style.display = 'none';
    stereoWrap.style.display = 'none';
    ioModeWrap.style.display = 'none';
    speakerIOWrap.style.display = 'none';
    ampExtra.style.display = 'none';
    haExtra.style.display = 'none';
    outletExtra.style.display = 'none';
    if(routerExtra) routerExtra.style.display = 'none';
    if(wirelessLinkWrap) wirelessLinkWrap.style.display = 'none';
    renderAttachedAccessoryUI(instr);
  } else {
    const isNonConnectable = isNonConnectableInstrument(instr);
    const hideConnTypeSelector = isCustomIOInstrument(instr) || instr.type === 'p16' || isNonConnectable;
    connTypeWrap.style.display = hideConnTypeSelector ? 'none' : '';
    const canShowMicPickup = !isNonConnectable && supportsMicPickup(instr) && (!hasAttachedAccessory(instr) || allowsMicPickupWithAccessory(instr));
    micWrap.style.display = canShowMicPickup ? '' : 'none';
    micStandWrap.style.display = (supportsMicStandOption(instr) && instr.type !== 'drumkit') ? '' : 'none';
    accessoryWrap.style.display = '';
    if(wirelessLinkWrap) wirelessLinkWrap.style.display = isWirelessLinkedInstrument(instr) ? '' : 'none';
    const hideReceiverToggle = document.getElementById('p-wireless-hide-receiver');
    if(hideReceiverToggle) hideReceiverToggle.checked = getWirelessHideReceiver(instr);
    document.getElementById('p-conn-type').value = instr.connectorMode || getDefaultConnectorMode(instr.type);
    const allowStereoCheckbox = !isNonConnectable && supportsStereoToggle(instr) && !isPedalsType(instr);
    stereoWrap.style.display = allowStereoCheckbox ? '' : 'none';
    if(supportsStereoToggle(instr)) {
      const stereoVal = instr.type === 'di'
        ? !!(instr.stereo || instr.inputStereo || instr.outputStereo)
        : (isPedalsType(instr) ? !!(instr.stereo || instr.outputStereo) : !!instr.stereo);
      document.getElementById('p-stereo-mode').checked = stereoVal;
    }
    const showIOModeWrap = !isNonConnectable && (supportsInputModeToggle(instr) || supportsOutputModeToggle(instr));
    ioModeWrap.style.display = showIOModeWrap ? '' : 'none';
    if(showIOModeWrap) stereoWrap.style.display = 'none';
    if(showIOModeWrap) {
      const inputSelect = document.getElementById('p-input-mode');
      const outputSelect = document.getElementById('p-output-mode');
      const canInputToggle = supportsInputModeToggle(instr);
      const canOutputToggle = supportsOutputModeToggle(instr);
      inputSelect.disabled = !canInputToggle;
      outputSelect.disabled = !canOutputToggle;
      if(canInputToggle) inputSelect.removeAttribute('disabled');
      if(canOutputToggle) outputSelect.removeAttribute('disabled');
      inputSelect.value = instr.inputStereo ? 'stereo' : 'mono';
      outputSelect.value = instr.outputStereo ? 'stereo' : 'mono';
    }
    const showSpeakerIOWrap = !isNonConnectable && isSpeakerWithThru(instr);
    speakerIOWrap.style.display = showSpeakerIOWrap ? '' : 'none';
    if(showSpeakerIOWrap) {
      const inSelect = document.getElementById('p-spk-in-mode');
      const outSelect = document.getElementById('p-spk-out-mode');
      inSelect.value = normalizeSpeakerConnectorMode(instr.spkInputMode, 'xlr');
      outSelect.value = normalizeSpeakerConnectorMode(instr.spkOutputMode, 'xlr');
    }
    renderCustomMicOptionsUI();
    renderMicAssignmentsUI(instr);
    updateMicSummary(instr);
    renderMicStandUI(instr);
    const showConnSideWrap = !isNonConnectable;
    sideWrap.style.display = showConnSideWrap ? '' : 'none';
    updateConnSideButtons(instr.connSide || 'bottom');
    ampExtra.style.display = instr.type === 'poweramp' ? 'block' : 'none';
    haExtra.style.display = instr.type === 'ha8000' ? 'block' : 'none';
    if(instr.type === 'poweramp') {
      const ampOutsInput = document.getElementById('p-amp-outs');
      if(ampOutsInput) ampOutsInput.value = Math.max(1, Math.min(16, Number(instr.ampOutputs) || 4));
    }
    if(instr.type === 'ha8000') {
      const haMainToggle = document.getElementById('p-ha-main');
      if(haMainToggle) haMainToggle.checked = !!instr.haUseMainInputs;
    }
    outletExtra.style.display = 'none';
    if(routerExtra) routerExtra.style.display = 'none';
    renderAttachedAccessoryUI(instr);
  }
  // snake extras
  const se = document.getElementById('snake-extra');
  if(isSnakeBox(instr)){
    se.style.display='block';
    document.getElementById('p-snake-ch').value=instr.snakeChannels||16;
    const snakeOutputsWrap = document.getElementById('snake-outputs-wrap');
    const snakeOutputsInput = document.getElementById('p-snake-outs');
    const isSnake8 = instr.type === 'snake8';
    if(snakeOutputsWrap) snakeOutputsWrap.style.display = isSnake8 ? 'block' : 'none';
    if(snakeOutputsInput) snakeOutputsInput.value = Math.max(0, Math.min(16, Number(instr.snakeOutputs) || 0));
    document.getElementById('p-snake-jack').checked = !!instr.snakeAllowJackInputs;
  }
  else { se.style.display='none'; }

  if(isOutletBox(instr)) {
    outletExtra.style.display = 'block';
    const outletPortsInput = document.getElementById('p-outlet-ports');
    const currentPorts = normalizeOutletPortCount(instr.outletPorts, instr, isRouterOutletType(instr) ? 4 : 2);
    if(outletPortsInput) {
      outletPortsInput.max = String(getOutletPortLimit(instr));
      outletPortsInput.value = currentPorts;
    }
    const outletPortsLabel = document.getElementById('p-outlet-ports-label');
    if(outletPortsLabel) outletPortsLabel.textContent = isRouterOutletType(instr) ? 'LAN Ports' : 'Port Count';
    document.getElementById('p-outlet-placement').value = instr.outletPlacement === 'stage' ? 'stage' : 'wall';
    updateOutletViewModeUI(getOutletViewMode(instr));
    renderOutletPortNamesUI(instr);
  } else {
    outletExtra.style.display = 'none';
  }

  if(routerExtra) {
    if(instr.type === 'router') {
      routerExtra.style.display = 'block';
      const routerPortsInput = document.getElementById('p-router-ports');
      if(routerPortsInput) routerPortsInput.value = normalizeOutletPortCount(instr.outletPorts, instr, 4);
    } else {
      routerExtra.style.display = 'none';
    }
  }

  // drumkit extras
  const drumExtra = document.getElementById('drum-extra');
  if(instr.type === 'drumkit'){
    drumExtra.style.display='block';
    syncDrumMicUI(instr);
    renderMicStandUI(instr);
  } else {
    drumExtra.style.display='none';
  }
  syncSignalModeConflictUI(instr);
}

function updProp(field, value) {
  if(!selectedId) return;
  const instr=instruments.find(i=>i.id===selectedId); if(!instr) return;
  if(instr[field] === value) return;
  pushHistoryState();
  instr[field]=value;
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  refreshInstrEl(instr); render();
}

function updSize(value) {
  const sz=parseInt(value);
  document.getElementById('p-size-val').textContent=sz;
  const instrCurrent = selectedId ? instruments.find(i=>i.id===selectedId) : null;
  const currentDef = instrCurrent ? getDefaultSizeForType(instrCurrent.type, instrCurrent.wide ? 82 : 52) : 52;
  const deltaEl = document.getElementById('p-size-delta');
  if(deltaEl) {
    const delta = sz - currentDef;
    deltaEl.textContent = delta === 0 ? '0' : (delta > 0 ? `+${delta}` : `${delta}`);
  }
  if(!selectedId) return;
  const instr=instruments.find(i=>i.id===selectedId); if(!instr) return;
  if((instr.size||52) === sz) return;
  pushHistoryState();
  instr.size=sz;
  markDirty();
  renderInstrument(instr); render();
  // re-attach after re-render
}

function resetSize() {
  if(!selectedId) return;
  const instr=instruments.find(i=>i.id===selectedId); if(!instr) return;
  const defSz = getDefaultSizeForType(instr.type, instr.wide ? 82 : 52);
  const sizeInput = document.getElementById('p-size');
  if(sizeInput) sizeInput.value = defSz;
  updSize(defSz);
}

function updAngle(value) {
  setSelectedAngle(value);
}

function setSelectedAngle(value) {
  const angle = snapAngleToCommonIncrement(value);
  updateAngleKnobUI(angle);
  if(!selectedId) return;
  const instr = instruments.find(i=>i.id===selectedId); if(!instr) return;
  if((instr.angle||0) === angle) return;
  pushHistoryState();
  instr.angle = angle;
  markDirty();
  renderInstrument(instr); render();
}

function nudgeAngle(delta) {
  if(!selectedId) return;
  const instr = instruments.find(i=>i.id===selectedId); if(!instr) return;
  const base = parseInt(instr.angle || 0, 10);
  setSelectedAngle(base + (parseInt(delta, 10) || 0));
}

function snapAngleToCommonIncrement(value) {
  let angle = Math.max(-180, Math.min(180, parseInt(value, 10) || 0));
  const normalized = ((angle % 360) + 360) % 360;
  const snapTargets = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  let nearest = angle;
  let bestDelta = 999;
  for(const target of snapTargets) {
    const delta = Math.abs(((normalized - target + 540) % 360) - 180);
    if(delta < bestDelta) {
      bestDelta = delta;
      nearest = target === 360 ? 0 : target;
    }
  }
  return bestDelta <= 4 ? nearest : angle;
}

function updateAngleKnobUI(angle) {
  const v = Math.max(-180, Math.min(180, parseInt(angle, 10) || 0));
  const readout = document.getElementById('p-angle-val');
  if(readout) readout.textContent = `${v}Â°`;
  const handle = document.getElementById('angle-knob-handle');
  if(handle) handle.style.transform = `translate(-50%,-50%) rotate(${v}deg) translateY(-25px)`;
  const knob = document.getElementById('angle-knob');
  if(knob) {
    const sweep = v + 180;
    knob.style.background = `conic-gradient(#47c4ff ${sweep}deg, #2a2e3a ${sweep}deg 360deg)`;
  }
}

function angleFromKnobPointer(clientX, clientY) {
  const knob = document.getElementById('angle-knob');
  if(!knob) return 0;
  const r = knob.getBoundingClientRect();
  const cx = r.left + (r.width / 2);
  const cy = r.top + (r.height / 2);
  const dx = clientX - cx;
  const dy = clientY - cy;
  let deg = Math.round((Math.atan2(dy, dx) * 180 / Math.PI) + 90);
  if(deg > 180) deg -= 360;
  if(deg < -180) deg += 360;
  return deg;
}

function startAngleKnobDrag(e) {
  if(!selectedId) return;
  if(e.cancelable) e.preventDefault();
  const instr = instruments.find(i=>i.id===selectedId);
  if(!instr) return;
  const snapshot = captureSnapshot();

  function onMove(ev) {
    const point = getClientPointFromEvent(ev);
    if(!point) return;
    if(ev.cancelable) ev.preventDefault();
    const angle = snapAngleToCommonIncrement(angleFromKnobPointer(point.clientX, point.clientY));
    const prev = instr.angle || 0;
    if(prev === angle) return;
    instr.angle = angle;
    updateAngleKnobUI(angle);
    markDirty();
    renderInstrument(instr);
    updateClasses();
    render();
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
    document.removeEventListener('touchcancel', onUp);
    if((instr.angle || 0) !== (snapshot.instruments.find(i => i.id === instr.id)?.angle || 0)) {
      commitSnapshotBeforeChange(snapshot);
    }
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onUp, { passive: false });
  document.addEventListener('touchcancel', onUp, { passive: false });
  onMove(e);
}

function setInstrumentConnSide(id, value, shouldSelect) {
  const instr = instruments.find(i=>i.id===id); if(!instr || isConnectionBoxInstrument(instr) || isNonConnectableInstrument(instr)) return;
  const allowed = new Set(['bottom','right','top','left']);
  const next = allowed.has(value) ? value : 'bottom';
  if((instr.connSide || 'bottom') === next) return;
  pushHistoryState();
  instr.connSide = next;
  markDirty();
  renderInstrument(instr);
  if(shouldSelect) {
    selectedId = id;
    updateConnSideButtons(next);
    selectInstrument(id);
  }
  updateClasses();
  render();
}

function updConnSide(value) {
  if(!selectedId) return;
  setInstrumentConnSide(selectedId, value, true);
}

function updStereoMode(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !supportsStereoToggle(instr)) return;
  if(isPedalsType(instr)) return;
  const next = value === true || value === 'stereo';
  const current = instr.type === 'di'
    ? !!(instr.stereo || instr.inputStereo || instr.outputStereo)
    : (isPedalsType(instr) ? !!(instr.stereo || instr.outputStereo) : !!instr.stereo);
  if(current === next) return;
  pushHistoryState();
  instr.stereo = next;
  if(instr.type === 'di') {
    instr.inputStereo = next;
    instr.outputStereo = next;
  } else if(isPedalsType(instr)) {
    instr.outputStereo = next;
  }
  syncDiAccessoryStereoFromInstrument(instr);
  instr.micStandCount = clampMicStandCountForInstrument(instr, instr.micStandCount);
  pruneInvalidInstrumentPins(instr);
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  selectInstrument(instr.id);
  renderMicStandUI(instr);
  updateClasses();
  render();
}

function updInputMode(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !supportsInputModeToggle(instr)) return;
  const next = value === 'stereo';
  if(!!instr.inputStereo === next) return;
  pushHistoryState();
  instr.inputStereo = next;
  if(isPedalsType(instr)) instr.stereo = !!instr.outputStereo;
  syncDiAccessoryStereoFromInstrument(instr);
  pruneInvalidInstrumentPins(instr);
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updOutputMode(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !supportsOutputModeToggle(instr)) return;
  const next = value === 'stereo';
  if(!!instr.outputStereo === next) return;
  pushHistoryState();
  instr.outputStereo = next;
  if(isPedalsType(instr)) instr.stereo = !!instr.outputStereo;
  syncDiAccessoryStereoFromInstrument(instr);
  pruneInvalidInstrumentPins(instr);
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updSpeakerInputMode(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isSpeakerWithThru(instr)) return;
  const next = normalizeSpeakerConnectorMode(value, 'xlr');
  const input = document.getElementById('p-spk-in-mode');
  if(input) input.value = next;
  if(normalizeSpeakerConnectorMode(instr.spkInputMode, 'xlr') === next) return;
  pushHistoryState();
  instr.spkInputMode = next;
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updSpeakerOutputMode(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isSpeakerWithThru(instr)) return;
  const next = normalizeSpeakerConnectorMode(value, 'xlr');
  const input = document.getElementById('p-spk-out-mode');
  if(input) input.value = next;
  if(normalizeSpeakerConnectorMode(instr.spkOutputMode, 'xlr') === next) return;
  pushHistoryState();
  instr.spkOutputMode = next;
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updAmpOutputs(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || instr.type !== 'poweramp') return;
  const next = Math.max(1, Math.min(16, parseInt(value, 10) || 4));
  const input = document.getElementById('p-amp-outs');
  if(input) input.value = next;
  if((Number(instr.ampOutputs) || 4) === next) return;
  pushHistoryState();
  instr.ampOutputs = next;
  pruneInvalidInstrumentPins(instr);
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updHaUseMainInputs(enabled) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || instr.type !== 'ha8000') return;
  const next = !!enabled;
  const input = document.getElementById('p-ha-main');
  if(input) input.checked = next;
  if(!!instr.haUseMainInputs === next) return;
  pushHistoryState();
  instr.haUseMainInputs = next;
  pruneInvalidInstrumentPins(instr);
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updateConnSideButtons(side) {
  document.querySelectorAll('#prop-side-pad .prop-side-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.side === side);
  });
}

function updSnakeChannels(value) {
  if(!selectedId) return;
  const instr=instruments.find(i=>i.id===selectedId); if(!instr || !isSnakeBox(instr)) return;
  const nextVal = normalizeSnakeChannels(value);
  document.getElementById('p-snake-ch').value = nextVal;
  if((instr.snakeChannels||16) === nextVal) return;
  pushHistoryState();
  instr.snakeChannels=nextVal;
  markDirty();
  renderInstrument(instr);
  render();
}

function updSnakeOutputs(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isSnakeBox(instr) || instr.type !== 'snake8') return;
  const nextVal = normalizeSnakeOutputs(value);
  const input = document.getElementById('p-snake-outs');
  if(input) input.value = nextVal;
  if((Number(instr.snakeOutputs) || 0) === nextVal) return;
  pushHistoryState();
  instr.snakeOutputs = nextVal;
  markDirty();
  renderInstrument(instr);
  render();
}

function updSnakeAllowJack(enabled) {
  if(!selectedId) return;
  const instr = instruments.find(i=>i.id===selectedId); if(!instr || !isSnakeBox(instr)) return;
  const next = !!enabled;
  if(!!instr.snakeAllowJackInputs === next) return;
  pushHistoryState();
  instr.snakeAllowJackInputs = next;
  if(!next) {
    const before = connections.length;
    connections = connections.filter(c => {
      const touchesSnakeInput = (c.fromId === instr.id && isSnakeInputPinKey(pinKey(c.fromPin))) || (c.toId === instr.id && isSnakeInputPinKey(pinKey(c.toPin)));
      if(!touchesSnakeInput) return true;
      return c.cableType !== 'ts' && c.cableType !== 'trs';
    });
    if(connections.length !== before) {
      connectingFrom = null;
      drawingLine = null;
    }
  }
  markDirty();
  renderInstrument(instr);
  updateClasses();
  render();
}

function updOutletConnectorType(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isOutletBox(instr)) return;
  const next = normalizeOutletConnectorType(value, 'ethernet');
  const input = document.getElementById('p-outlet-connector');
  if(input) input.value = next;
  if(normalizeOutletConnectorType(instr.outletConnectorType, 'ethernet') === next) return;
  pushHistoryState();
  instr.outletConnectorType = next;
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function renderOutletPortNamesUI(instr) {
  const list = document.getElementById('outlet-port-names-list');
  if(!list) return;
  if(!instr || !isOutletBox(instr)) {
    list.innerHTML = '';
    return;
  }
  const ports = normalizeOutletPortCount(instr.outletPorts, instr);
  const fallbackMode = getOutletPortModeFallback(instr);
  instr.outletPortNames = normalizeOutletPortNames(instr.outletPortNames, ports, instr);
  instr.outletPortModes = normalizeOutletPortModes(instr.outletPortModes, ports, fallbackMode);
  list.innerHTML = Array.from({ length: ports }, (_v, idx) => {
    const port = idx + 1;
    const val = escapeHtml(instr.outletPortNames[port] || getDefaultOutletPortName(instr, port));
    const mode = normalizeOutletPortMode(instr.outletPortModes[port], fallbackMode);
    const modeOptions = getOutletPortModeOptions().map(option => `<option value="${option.value}"${option.value === mode ? ' selected' : ''}>${option.label}</option>`).join('');
    return `<div class="mic-assign-row" style="align-items:flex-start;">
      <label class="mic-assign-label" style="padding-top:8px;">${port}</label>
      <div style="display:grid;gap:5px;flex:1;">
        <input class="pselect" type="text" value="${val}" oninput="updOutletPortName(${port}, this.value)">
        <select class="pselect" onchange="updOutletPortMode(${port}, this.value)">${modeOptions}</select>
      </div>
    </div>`;
  }).join('');
}

function updOutletPortName(index, value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isOutletBox(instr)) return;
  const port = normalizeOutletPortCount(index, instr, 1);
  const next = String(value || '').trim() || getDefaultOutletPortName(instr, port);
  const names = normalizeOutletPortNames(instr.outletPortNames, instr.outletPorts, instr);
  if((names[port] || getDefaultOutletPortName(instr, port)) === next) return;
  pushHistoryState();
  names[port] = next;
  instr.outletPortNames = names;
  markDirty();
  renderInstrument(instr);
  updateClasses();
  render();
}

function updOutletPortMode(index, value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isOutletBox(instr)) return;
  const port = normalizeOutletPortCount(index, instr, 1);
  const next = normalizeOutletPortMode(value, getOutletPortModeFallback(instr));
  const modes = normalizeOutletPortModes(instr.outletPortModes, instr.outletPorts, getOutletPortModeFallback(instr));
  if((modes[port] || 'ethernet') === next) return;
  pushHistoryState();
  modes[port] = next;
  instr.outletPortModes = modes;
  markDirty();
  renderInstrument(instr);
  updateClasses();
  render();
}

function updOutletPorts(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isOutletBox(instr)) return;
  const next = normalizeOutletPortCount(value, instr, isRouterOutletType(instr) ? 4 : 2);
  const input = document.getElementById('p-outlet-ports');
  if(input) input.value = next;
  if(normalizeOutletPortCount(instr.outletPorts, instr, isRouterOutletType(instr) ? 4 : 2) === next) return;
  pushHistoryState();
  instr.outletPorts = next;
  instr.outletPortNames = normalizeOutletPortNames(instr.outletPortNames, next, instr);
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updRouterPorts(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || instr.type !== 'router') return;
  const next = normalizeOutletPortCount(value, instr, 4);
  const input = document.getElementById('p-router-ports');
  if(input) input.value = next;
  if(normalizeOutletPortCount(instr.outletPorts, instr, 4) === next) return;
  pushHistoryState();
  instr.outletPorts = next;
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updOutletPlacement(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isOutletBox(instr)) return;
  const next = value === 'stage' ? 'stage' : 'wall';
  const input = document.getElementById('p-outlet-placement');
  if(input) input.value = next;
  if((instr.outletPlacement === 'stage' ? 'stage' : 'wall') === next) return;
  pushHistoryState();
  instr.outletPlacement = next;
  markDirty();
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}

function updConnectorMode(value) {
  if(!selectedId) return;
  const instr = instruments.find(i=>i.id===selectedId); if(!instr || isConnectionBoxInstrument(instr)) return;
  if(instr.type === 'p16' || isCustomIOInstrument(instr)) return;
  const allowed = new Set(['xlr','jack']);
  let next = allowed.has(value) ? value : 'xlr';
  if(hasAnyAssignedMic(instr) && next !== 'xlr') {
    alert('Mic pickups are XLR only. Connector type set to XLR.');
    next = 'xlr';
    document.getElementById('p-conn-type').value = 'xlr';
  }
  if((instr.connectorMode || getDefaultConnectorMode(instr.type)) === next) return;
  pushHistoryState();
  instr.connectorMode = next;
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  updateClasses();
  render();
}

function setPinMicAssignment(pin, value) {
  if(!selectedId) return;
  const instr = instruments.find(i=>i.id===selectedId); if(!instr || isConnectionBoxInstrument(instr)) return;
  if(!supportsMicPickup(instr)) return;
  const cleanPin = pinKey(pin);
  const nextVal = String(value || '').trim();
  const current = normalizePinMicAssignments(instr.pinMicAssignments);
  const prevVal = current[cleanPin] || '';
  if(prevVal === nextVal) return;
  pushHistoryState();
  if(nextVal) current[cleanPin] = nextVal;
  else delete current[cleanPin];
  instr.pinMicAssignments = current;
  if(hasAnyAssignedMic(instr)) {
    instr.connectorMode = 'xlr';
    const connType = document.getElementById('p-conn-type');
    if(connType) connType.value = 'xlr';
  }
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderMicAssignmentsUI(instr);
  updateMicSummary(instr);
  renderInstrument(instr);
  updateClasses();
  render();
}

function updWirelessHideReceiver(enabled) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr || !isWirelessLinkedInstrument(instr)) return;
  const next = !!enabled;
  if(getWirelessHideReceiver(instr) === next) return;
  pushHistoryState();
  instr.hideWirelessReceiver = next;
  const peer = applyWirelessPairEdit(instr);
  if(peer) peer.hideWirelessReceiver = next;
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  const focusInstr = (next && isWirelessReceiverNode(instr)) ? (getWirelessMicNode(instr) || peer || instr) : instr;
  selectInstrument(focusInstr.id);
  updateClasses();
  render();
}

function renderMicAssignmentsUI(instr) {
  const box = document.getElementById('mic-assignment-list');
  if(!box) return;
  if(!supportsMicPickup(instr)) {
    box.innerHTML = '';
    return;
  }
  const targets = getMicTargetsForInstrument(instr);
  if(!targets.length) {
    box.innerHTML = '<div style="font-size:10px;color:var(--muted);font-style:italic;">No mic targets available.</div>';
    return;
  }
  const map = normalizePinMicAssignments(instr.pinMicAssignments);
  const allMicOptions = getAllMicOptions();
  box.innerHTML = targets.map(t => {
    const current = map[t.pin] || '';
    const choices = allMicOptions.includes(current) || !current ? allMicOptions : [current, ...allMicOptions];
    const options = ['<option value="">None</option>', ...choices.map(m => `<option value="${escapeHtml(m)}"${m===current?' selected':''}>${escapeHtml(m)}</option>`)].join('');
    return `<div class="mic-assignment-row"><label>${escapeHtml(t.label)}</label><select onchange="setPinMicAssignment('${t.pin}', this.value)">${options}</select></div>`;
  }).join('');
}

function updateMicSummary(instr) {
  return;
}

function updateMicStandSummary(instr) {
  return;
}

function setMicStandCount(value) {
  if(!selectedId) return;
  const instr = instruments.find(i=>i.id===selectedId);
  if(!instr || !supportsMicStandOption(instr) || instr.type === 'drumkit') return;
  const standTarget = getWirelessMicNode(instr) || instr;
  const next = clampMicStandCountForInstrument(standTarget, value);
  const prev = clampMicStandCountForInstrument(standTarget, standTarget.micStandCount);
  if(prev === next) return;
  pushHistoryState();
  standTarget.micStandCount = next;
  if(isWirelessLinkedInstrument(instr) && isWirelessReceiverNode(instr)) instr.micStandCount = 0;
  markDirty();
  renderInstrument(standTarget);
  if(instr.id !== standTarget.id) renderInstrument(instr);
  renderMicStandUI(instr);
  updateClasses();
  render();
}

function setDrumMicStandAssignment(label, enabled) {
  if(!selectedId) return;
  const instr = instruments.find(i=>i.id===selectedId);
  if(!instr || instr.type !== 'drumkit') return;
  const selectedMics = new Set(Array.isArray(instr.drumMics) ? instr.drumMics : []);
  if(!selectedMics.has(label)) return;
  const nextMap = normalizeDrumMicStandAssignments(instr.drumMicStandAssignments);
  const prev = !!nextMap[label];
  const next = !!enabled;
  if(prev === next) return;
  pushHistoryState();
  nextMap[label] = next;
  instr.drumMicStandAssignments = nextMap;
  markDirty();
  renderInstrument(instr);
  renderDrumMicStandColumn(instr);
  renderMicStandUI(instr);
  updateClasses();
  render();
}

function renderDrumMicStandColumn(instr) {
  const list = document.getElementById('drum-mic-stand-list');
  if(!list) return;
  if(!instr || instr.type !== 'drumkit') {
    list.innerHTML = '<div class="empty">Select drum inputs to assign stands.</div>';
    return;
  }
  const selected = Array.isArray(instr.drumMics) ? instr.drumMics : [];
  const map = normalizeDrumMicStandAssignments(instr.drumMicStandAssignments);
  if(!selected.length) {
    list.innerHTML = '<div class="empty">Select drum inputs to assign stands.</div>';
    return;
  }
  list.innerHTML = selected.map(label => {
    const checked = !!map[label];
    const units = getDrumMicStandUnitCount(label);
    const suffix = units > 1 ? ` (x${units})` : '';
    const safeLabel = String(label).replace(/'/g, "\\'");
    return `<label><span>${label}${suffix}</span><input type="checkbox" ${checked ? 'checked' : ''} onchange="setDrumMicStandAssignment('${safeLabel}', this.checked)"></label>`;
  }).join('');
}

function renderMicStandUI(instr) {
  const controls = document.getElementById('mic-stand-controls');
  if(!controls) return;
  if(!supportsMicStandOption(instr)) {
    controls.innerHTML = '';
    updateMicStandSummary(instr);
    return;
  }

  if(instr.type === 'drumkit') {
    const selected = Array.isArray(instr.drumMics) ? instr.drumMics : [];
    const map = normalizeDrumMicStandAssignments(instr.drumMicStandAssignments);
    if(!selected.length) {
      controls.innerHTML = '<div style="font-size:10px;color:var(--muted);font-style:italic;">Select drum mics first to assign stands.</div>';
      updateMicStandSummary(instr);
      return;
    }
    controls.innerHTML = selected.map(label => {
      const checked = !!map[label];
      const units = getDrumMicStandUnitCount(label);
      const suffix = units > 1 ? ` (x${units})` : '';
      const safeLabel = String(label).replace(/'/g, "\\'");
      return `<label class="stand-row"><span class="stand-label">${label}${suffix}</span><input type="checkbox" ${checked ? 'checked' : ''} onchange="setDrumMicStandAssignment('${safeLabel}', this.checked)"></label>`;
    }).join('');
    updateMicStandSummary(instr);
    return;
  }

  const max = getMicStandMaxForInstrument(instr);
  const count = getMicStandCount(instr);
  if(max <= 1) {
    controls.innerHTML = `<label class="stand-row"><span class="stand-label">Use mic stand</span><input type="checkbox" ${count > 0 ? 'checked' : ''} onchange="setMicStandCount(this.checked ? 1 : 0)"></label>`;
  } else {
    const opts = Array.from({ length: max + 1 }, (_v, idx) => `<option value="${idx}"${idx===count?' selected':''}>${idx}</option>`).join('');
    controls.innerHTML = `<div class="stand-row"><span class="stand-label">Mic stands (max ${max})</span><select onchange="setMicStandCount(parseInt(this.value, 10) || 0)">${opts}</select></div>`;
  }
  updateMicStandSummary(instr);
}

function renderAttachedAccessoryUI(instr) {
  const controls = document.getElementById('accessory-controls');
  if(!controls) return;
  if(!instr) {
    controls.innerHTML = '';
    return;
  }
  normalizeAttachedAccessoryForInstrument(instr);
  const selectedType = normalizeAttachedAccessoryType(instr.attachedAccessoryType);
  const options = [
    { value: 'none', label: 'None' },
    { value: 'amp', label: 'Amp' },
    { value: 'di', label: 'DI' },
    { value: 'pedals', label: 'Pedals' },
  ].map(opt => `<option value="${opt.value}"${opt.value === selectedType ? ' selected' : ''}>${opt.label}</option>`).join('');

  const outputCableOptions = CABLE_TYPES.map(type => `<option value="${type.id}"${type.id === normalizeAttachedAccessoryCableType(instr.attachedAccessoryOutputCableType || instr.attachedAccessoryCableType) ? ' selected' : ''}>${type.label}</option>`).join('');

  controls.innerHTML = `
    <div class="stand-row">
      <span class="stand-label">Add accessory</span>
      <select onchange="updAttachedAccessoryType(this.value)">${options}</select>
    </div>
    ${selectedType !== 'none' ? `
      <div class="stand-row">
        <span class="stand-label">Accessory output type</span>
        <select onchange="updAttachedAccessoryOutputCableType(this.value)">${outputCableOptions}</select>
      </div>
      <label class="stand-row">
        <span class="stand-label">Output signal mode (Stereo)</span>
        <input type="checkbox" ${instr.attachedAccessoryStereo ? 'checked' : ''} onchange="updAttachedAccessoryStereo(this.checked)">
      </label>
    ` : ''}
  `;
  syncSignalModeConflictUI(instr);
}

function updAttachedAccessoryType(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr) return;
  const next = normalizeAttachedAccessoryType(value);
  const prev = normalizeAttachedAccessoryType(instr.attachedAccessoryType);
  if(prev === next) return;
  pushHistoryState();
  instr.attachedAccessoryType = next;
  if(next === 'none') instr.attachedAccessoryStereo = false;
  else {
    const defaultCable = getDefaultAttachedAccessoryCableType(next);
    instr.attachedAccessoryCableType = defaultCable;
    instr.attachedAccessoryInputCableType = defaultCable;
    instr.attachedAccessoryOutputCableType = defaultCable;
    if(next === 'di') instr.attachedAccessoryStereo = isPrimarySignalModeStereo(instr);
  }
  normalizeAttachedAccessoryForInstrument(instr);
  const micWrap = document.getElementById('mic-wrap');
  if(micWrap) {
    const showMicPickup = !isConnectionBoxInstrument(instr) && !isNonConnectableInstrument(instr) && supportsMicPickup(instr) && (!hasAttachedAccessory(instr) || allowsMicPickupWithAccessory(instr));
    micWrap.style.display = showMicPickup ? '' : 'none';
  }
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  renderAttachedAccessoryUI(instr);
  updateClasses();
  render();
}

function updAttachedAccessoryCableType(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr) return;
  if(normalizeAttachedAccessoryType(instr.attachedAccessoryType) === 'none') return;
  const next = normalizeAttachedAccessoryCableType(value);
  const currentIn = normalizeAttachedAccessoryCableType(instr.attachedAccessoryInputCableType || instr.attachedAccessoryCableType);
  const currentOut = normalizeAttachedAccessoryCableType(instr.attachedAccessoryOutputCableType || instr.attachedAccessoryCableType);
  if(currentIn === next && currentOut === next) return;
  pushHistoryState();
  instr.attachedAccessoryCableType = next;
  instr.attachedAccessoryInputCableType = next;
  instr.attachedAccessoryOutputCableType = next;
  normalizeAttachedAccessoryForInstrument(instr);
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  renderAttachedAccessoryUI(instr);
  updateClasses();
  render();
}

function updAttachedAccessoryInputCableType(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr) return;
  if(normalizeAttachedAccessoryType(instr.attachedAccessoryType) === 'none') return;
  const next = normalizeAttachedAccessoryCableType(value);
  const prev = normalizeAttachedAccessoryCableType(instr.attachedAccessoryInputCableType || instr.attachedAccessoryCableType);
  if(prev === next) return;
  pushHistoryState();
  instr.attachedAccessoryInputCableType = next;
  normalizeAttachedAccessoryForInstrument(instr);
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  renderAttachedAccessoryUI(instr);
  updateClasses();
  render();
}

function updAttachedAccessoryOutputCableType(value) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr) return;
  if(normalizeAttachedAccessoryType(instr.attachedAccessoryType) === 'none') return;
  const next = normalizeAttachedAccessoryCableType(value);
  const prev = normalizeAttachedAccessoryCableType(instr.attachedAccessoryOutputCableType || instr.attachedAccessoryCableType);
  if(prev === next) return;
  pushHistoryState();
  instr.attachedAccessoryOutputCableType = next;
  normalizeAttachedAccessoryForInstrument(instr);
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  renderAttachedAccessoryUI(instr);
  updateClasses();
  render();
}

function updAttachedAccessoryStereo(enabled) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId); if(!instr) return;
  if(normalizeAttachedAccessoryType(instr.attachedAccessoryType) === 'none') return;
  const next = !!enabled;
  if(!!instr.attachedAccessoryStereo === next) return;
  pushHistoryState();
  instr.attachedAccessoryStereo = next;
  if(isDiAccessoryLinked(instr)) setInstrumentPrimarySignalModeStereo(instr, next);
  normalizeAttachedAccessoryForInstrument(instr);
  if(isDiAccessoryLinked(instr)) syncDiAccessoryStereoFromInstrument(instr);
  pruneInvalidInstrumentPins(instr);
  const peer = applyWirelessPairEdit(instr);
  markDirty();
  if(peer) renderInstrument(peer);
  renderInstrument(instr);
  selectInstrument(instr.id);
  updateClasses();
  render();
}


function toggleDrumMic(checkbox) {
  if(!selectedId) return;
  const instr = instruments.find(i => i.id === selectedId);
  if(!instr || instr.type !== 'drumkit') return;

  if(!instr.drumMics) instr.drumMics = [];
  const snapshot = captureSnapshot();
  let changed = false;

  if(checkbox.checked && checkbox.value === 'Overheads Stereo') {
    const next = instr.drumMics.filter(m => m !== 'Overhead Mono');
    if(next.length !== instr.drumMics.length) changed = true;
    instr.drumMics = next;
    const monoToggle = document.querySelector('#drum-extra .drum-mic-select input[type=checkbox][value="Overhead Mono"]');
    if(monoToggle) monoToggle.checked = false;
  }

  if(checkbox.checked && checkbox.value === 'Overhead Mono') {
    const next = instr.drumMics.filter(m => m !== 'Overheads Stereo');
    if(next.length !== instr.drumMics.length) changed = true;
    instr.drumMics = next;
    const stereoToggle = document.querySelector('#drum-extra .drum-mic-select input[type=checkbox][value="Overheads Stereo"]');
    if(stereoToggle) stereoToggle.checked = false;
  }

  const hadMic = instr.drumMics.includes(checkbox.value);
  if(checkbox.checked) {
    if(!instr.drumMics.includes(checkbox.value)) {
      instr.drumMics.push(checkbox.value);
      changed = true;
    }
  } else {
    if(hadMic) changed = true;
    instr.drumMics = instr.drumMics.filter(m => m !== checkbox.value);
    if(instr.drumMicStandAssignments && typeof instr.drumMicStandAssignments === 'object') {
      if(Object.prototype.hasOwnProperty.call(instr.drumMicStandAssignments, checkbox.value)) changed = true;
      delete instr.drumMicStandAssignments[checkbox.value];
    }
  }

  if(changed) {
    commitSnapshotBeforeChange(snapshot);
    markDirty();
  }
  updateDrumMicSummary(instr);
  pruneInvalidDrumConnections(instr);
  renderMicAssignmentsUI(instr);
  updateMicSummary(instr);
  renderDrumMicStandColumn(instr);
  renderMicStandUI(instr);
  renderInstrument(instr);
  updateClasses();
  render();
}

function syncDrumMicUI(instr) {
  const selected = instr.drumMics || [];
  document.querySelectorAll('#drum-extra .drum-mic-select input[type=checkbox]').forEach(cb => {
    cb.checked = selected.includes(cb.value);
  });
  renderDrumMicStandColumn(instr);
  updateDrumMicSummary(instr);
}

function updateDrumMicSummary(instr) {
  const mics = instr.drumMics || [];
  if(instr.type === 'drumkit') {
    instr.notes = mics.join(', ');
    document.getElementById('p-notes').value = instr.notes;
  }
}

function getDrumMicPins(instr) {
  if(!instr || instr.type !== 'drumkit' || !Array.isArray(instr.drumMics)) return [];

  const mapping = {
    'Kick': [{key:'DM-KICK', label:'K', name:'Kick'}],
    'Hi-Hat': [{key:'DM-HH', label:'HH', name:'Hi-Hat'}],
    'Snare': [{key:'DM-SN', label:'SN', name:'Snare'}],
    'Tom 1': [{key:'DM-T1', label:'T1', name:'Tom 1'}],
    'Tom 2': [{key:'DM-T2', label:'T2', name:'Tom 2'}],
    'Tom 3': [{key:'DM-T3', label:'T3', name:'Tom 3'}],
    'Ride': [{key:'DM-RD', label:'RD', name:'Ride'}],
    'Crash': [{key:'DM-CR', label:'CR', name:'Crash'}],
    'Overhead Mono': [{key:'DM-OH', label:'OH', name:'Overhead Mono'}],
    'Overheads Stereo': [
      {key:'DM-OHL', label:'OH-L', name:'Overhead Left'},
      {key:'DM-OHR', label:'OH-R', name:'Overhead Right'},
    ],
  };

  const preferredOrder = [
    'Kick',
    'Snare',
    'Hi-Hat',
    'Tom 1',
    'Tom 2',
    'Tom 3',
    'Ride',
    'Crash',
    'Overhead Mono',
    'Overheads Stereo',
  ];
  const selected = new Set(instr.drumMics || []);
  return preferredOrder.filter(label => selected.has(label)).flatMap(label => mapping[label] || []);
}

function pruneInvalidDrumConnections(instr) {
  if(!instr || instr.type !== 'drumkit') return;
  const validPins = new Set(getDrumMicPins(instr).map(p => p.key));
  const map = normalizePinMicAssignments(instr.pinMicAssignments);
  Object.keys(map).forEach(pin => {
    if(pin.startsWith('DM-') && !validPins.has(pin)) delete map[pin];
  });
  instr.pinMicAssignments = map;
  const before = connections.length;
  connections = connections.filter(c => {
    if(c.fromId === instr.id && typeof c.fromPin === 'string' && c.fromPin.startsWith('DM-')) {
      return validPins.has(c.fromPin);
    }
    if(c.toId === instr.id && typeof c.toPin === 'string' && c.toPin.startsWith('DM-')) {
      return validPins.has(c.toPin);
    }
    return true;
  });
  if(connections.length !== before) {
    connectingFrom = null;
    drawingLine = null;
  }
}

function refreshInstrEl(instr) {
  const el=getEl(instr.id); if(!el) return;
  const visibleLabel = getVisibleInstrumentLabel(instr);
  const lbl=el.querySelector('.ilabel'); if(lbl) lbl.textContent=visibleLabel;
  el.querySelectorAll('.ib-label').forEach(labelEl => {
    labelEl.textContent = visibleLabel;
  });
  if(isConnectionBoxInstrument(instr)){ renderInstrument(instr); return; }
  const body=el.querySelector('.ib');
  const ex=body.querySelector('.ich'); if(ex) ex.remove();
  if(instr.channel){ const b=document.createElement('div'); b.className='ich'; b.textContent=instr.channel; body.appendChild(b); }
}

function updateClasses() {
  const selectedIds = new Set(getWirelessSelectionIds(selectedId));
  instruments.forEach((instr, index)=>{
    const el=getEl(instr.id); if(!el) return;
    el.style.zIndex = String(30 + index);
    el.classList.toggle('selected', selectedIds.has(instr.id));
    el.classList.toggle('connecting-source', connectingFrom&&connectingFrom.id===instr.id);
  });
  stageParts.forEach((part, index) => {
    const el = getStagePartEl(part.id); if(!el) return;
    el.style.zIndex = String(20 + index);
    el.classList.toggle('selected', part.id === selectedStagePartId);
  });
}

function deleteSelected() {
  if(isStageBuilderMode) {
    if(!selectedStagePartId) return;
    pushHistoryState();
    deleteStagePart(selectedStagePartId);
    selectedStagePartId = null;
    updateSelectionPanels();
    render();
    return;
  }
  if(!selectedId) return;
  deleteInstrument(selectedId); selectedId=null;
  updateSelectionPanels();
}

function deleteInstrument(id) {
  pushHistoryState();
  const target = instruments.find(i => i && i.id === id) || null;
  const idsToDelete = target ? getWirelessSelectionIds(target) : [id];
  const idSet = new Set(idsToDelete);
  idsToDelete.forEach(removeId => {
    const el=getEl(removeId); if(el) el.remove();
  });
  instruments=instruments.filter(i=>!idSet.has(i.id));
  connections=connections.filter(c=>!idSet.has(c.fromId)&&!idSet.has(c.toId));
  if(selectedId && idSet.has(selectedId)){ selectedId=null; updateSelectionPanels(); }
  updateSnakeViewToggleUI();
  refreshCategoryCollapseButtons();
  markDirty();
  render();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CONNECTIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•


function isOutputPin(pin) {
  return typeof pin === 'string' && (pin === 'MONO' || pin === 'L' || pin === 'R' || pin.startsWith('DM-') || pin.startsWith('OUT-') || pin.startsWith('STAGE-OUT-') || pin.startsWith('CABLE-OUT-') || pin.startsWith('OUTLET-OUT-') || (pin.startsWith('MX-AUX-') && !pin.startsWith('MX-AUX-IN-')) || pin.startsWith('MX-MAIN-') || pin.startsWith('MX-JACK-OUT-') || pin.startsWith('MX-HP-') || pin.startsWith('MX-P16-') || pin.startsWith('MX-AES50-') || pin.startsWith('IO-OUT-') || pin.startsWith('HA-OUT-') || pin === 'AMP-OUT' || pin.startsWith('AMP-OUT-') || pin.startsWith('PAMP-OUT-') || pin === 'SPK-OUT' || pin === 'P16-THRU' || pin === 'P16-HP' || pin.startsWith('P16D-OUT-'));
}

function isInputPin(pin) {
  return typeof pin === 'string' && (pin.startsWith('IN-') || pin.startsWith('STAGE-IN-') || pin.startsWith('CABLE-IN-') || pin.startsWith('OUTLET-IN-') || pin.startsWith('MX-IN-') || pin.startsWith('MX-AUX-IN-') || pin.startsWith('IO-IN-') || pin.startsWith('HA-IN-') || pin === 'AMP-IN' || pin.startsWith('AMP-IN-') || pin.startsWith('PAMP-IN-') || pin === 'SPK-IN' || pin === 'P16-IN' || pin === 'P16D-IN' || pin.startsWith('ROUTER-LAN-'));
}

function isEndpointOnlyOutput(instr, pin) {
  const key = pinKey(pin);
  if(!instr) return false;
  if(isSnakeBox(instr) && (key.startsWith('STAGE-OUT-') || key.startsWith('OUT-'))) return true;
  if(isOutletBox(instr) && key.startsWith('OUTLET-OUT-')) return true;
  if(isMixerBox(instr) && ((key.startsWith('MX-AUX-') && !key.startsWith('MX-AUX-IN-')) || key.startsWith('MX-MAIN-') || key.startsWith('MX-JACK-OUT-') || key.startsWith('MX-HP-') || key.startsWith('MX-P16-') || key.startsWith('MX-AES50-'))) return true;
  if(instr.type === 'ha8000' && key.startsWith('HA-OUT-')) return true;
  if(instr.type === 'p16' && key === 'P16-HP') return true;
  if(instr.type === 'p16d' && key.startsWith('P16D-OUT-')) return true;
  if(isSpeakerWithThru(instr) && key === 'SPK-OUT') return true;
  return false;
}

function isHeadphoneOutputPin(instr, pin) {
  const key = pinKey(pin);
  if(!instr) return false;
  if(instr.type === 'p16' && key === 'P16-HP') return true;
  if(instr.type === 'scarlet2i2' && key === 'IO-OUT-HP') return true;
  if(isMixerBox(instr) && key.startsWith('MX-HP-')) return true;
  if(instr.type === 'ha400' && key.startsWith('IO-OUT-')) return true;
  if(instr.type === 'ha8000' && key.startsWith('HA-OUT-')) return true;
  return false;
}

function isHA400MonitoringInput(instr, pin) {
  return !!(instr && instr.type === 'ha400' && pinKey(pin) === 'IO-IN-TRS');
}

function isDrumMicPin(pin) {
  return typeof pin === 'string' && pin.startsWith('DM-');
}

function isSnakeInPin(instr, pin) {
  const key = pinKey(pin);
  return !!(instr && isSnakeBox(instr) && isSnakeInputPinKey(key));
}

function isSnakeOutPin(instr, pin) {
  const key = pinKey(pin);
  return !!(instr && isSnakeBox(instr) && isSnakeOutputPinKey(key));
}

function isEffectiveOutputPin(instr, pin) {
  if(instr && isSnakeBox(instr)) return isSnakeOutPin(instr, pin);
  if(instr && isOutletBox(instr)) return pinKey(pin).startsWith('OUTLET-OUT-');
  return isOutputPin(pin);
}

function isEffectiveInputPin(instr, pin) {
  if(instr && isSnakeBox(instr)) return isSnakeInPin(instr, pin);
  if(instr && isOutletBox(instr)) return pinKey(pin).startsWith('OUTLET-IN-');
  return isInputPin(pin);
}

function getPinTargetAtClientPoint(clientX, clientY) {
  const target = document.elementFromPoint(clientX, clientY);
  if(!target) return null;

  const pinEl = target.closest('.iconn, .connbox-pin');
  if(!pinEl) return null;

  const instrEl = pinEl.closest('.si');
  if(!instrEl || !instrEl.id || !instrEl.id.startsWith('instr-')) return null;

  const id = parseInt(instrEl.id.replace('instr-', ''), 10);
  if(!Number.isFinite(id)) return null;

  const pin = pinEl.dataset.pin || 'MONO';
  return { id, pin };
}

function startConnectionFromPin(id, pin, e) {
  if(isStageBuilderMode) return;
  const clickedPin = pinKey(pin);

  if(!connectingFrom) {
    const sourceInstr = instruments.find(i => i.id === id);
    if(sourceInstr && sourceInstr.stereo && clickedPin === 'MONO') {
      alert(`${sourceInstr.label} is stereo. Start from L or R pin.`);
      return;
    }
    if(!canSourcePinAcceptAnotherConnection(sourceInstr, id, clickedPin)) {
      alert('This pin is already connected. Remove that cable first.');
      return;
    }
    connectingFrom = { id, pin: clickedPin };
    updateClasses();
  }

  const wr = document.getElementById('canvas-wrap').getBoundingClientRect();
  let moved = false;

  function onMove(ev) {
    const p = getClientPointFromEvent(ev);
    if(!p) return;
    if(ev.cancelable) ev.preventDefault();
    const a = getCenterOf(connectingFrom.id, connectingFrom.pin);
    if(!a) return;
    moved = true;
    drawingLine = { x1: a.x, y1: a.y, x2: p.clientX - wr.left, y2: p.clientY - wr.top };
    render();
  }

  function onUp(ev) {
    const p = getClientPointFromEvent(ev);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
    document.removeEventListener('touchcancel', onUp);

    const target = p ? getPinTargetAtClientPoint(p.clientX, p.clientY) : null;
    if(target && connectingFrom) {
      handleConnectClick(target.id, target.pin, ev);
      return;
    }

    if(moved) {
      connectingFrom = null;
      drawingLine = null;
      updateClasses();
      render();
      return;
    }

    if(connectingFrom) {
      const a = getCenterOf(connectingFrom.id, connectingFrom.pin);
      if(a) {
        drawingLine = { x1: a.x, y1: a.y, x2: a.x, y2: a.y };
        render();
      }
    }
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onUp, { passive: false });
  document.addEventListener('touchcancel', onUp, { passive: false });
}

function resolveCableForPins(fromInstr, fromPin, toInstr, toPin, preferredCable = selectedCable) {
  const fromAllowed = getPinAllowedCableTypes(fromInstr, fromPin);
  const toAllowed = getPinAllowedCableTypes(toInstr, toPin);
  const common = fromAllowed.filter(typeId => toAllowed.includes(typeId));

  if(!common.length) {
    const trsSplitResolution = resolveTrsSplitCableForPins(fromInstr, fromPin, toInstr, toPin, preferredCable);
    if(trsSplitResolution) return trsSplitResolution;
    return {
      valid:false,
      message:`${fromInstr.label} ${pinKey(fromPin)} and ${toInstr.label} ${pinKey(toPin)} have no compatible cable type.`
    };
  }

  let chosenCable = null;
  if(common.includes(preferredCable)) {
    chosenCable = preferredCable;
  } else if(common.length === 1) {
    chosenCable = common[0];
  } else {
    return {
      valid:false,
      message:`Selected ${preferredCable.toUpperCase()} cable is not valid here. Choose: ${common.map(getCableTypeLabel).join(' / ')}.`
    };
  }

  const cable = CABLE_TYPES.find(c => c.id === chosenCable) || CABLE_TYPES[0];
  return {
    valid:true,
    cableType:cable.id,
    color:cable.color,
    label:cable.label,
    wasAutoChosen: chosenCable !== preferredCable,
  };
}

function validateConnection(fromObj, toObj) {
  const fromInstr = instruments.find(i => i.id === fromObj.id);
  const toInstr = instruments.find(i => i.id === toObj.id);

  if(!fromInstr || !toInstr) return { valid:true };

  const fromKey = pinKey(fromObj.pin);
  const toKey = pinKey(toObj.pin);
  const fromAllowedTypes = getPinAllowedCableTypes(fromInstr, fromObj.pin);
  const toAllowedTypes = getPinAllowedCableTypes(toInstr, toObj.pin);
  const isEthernetPair = Array.isArray(fromAllowedTypes)
    && Array.isArray(toAllowedTypes)
    && fromAllowedTypes.includes('ethernet')
    && toAllowedTypes.includes('ethernet');

  if(!canSourcePinAcceptAnotherConnection(fromInstr, fromObj.id, fromKey)) {
    return {
      valid:false,
      message:`${fromInstr.label} pin ${fromKey} is already connected.`
    };
  }

  if(isPinUsed(toObj.id, toKey)) {
    return {
      valid:false,
      message:`${toInstr.label} pin ${toKey} is already connected.`
    };
  }

  if(fromInstr.stereo && fromKey === 'MONO') {
    return {
      valid:false,
      message:`${fromInstr.label} is stereo. Use L or R pin.`
    };
  }

  const monitoringAllowedSource = (isSpeakerWithThru(fromInstr) && fromKey === 'SPK-OUT') || (fromInstr.type === 'p16' && (fromKey === 'P16-THRU' || fromKey === 'P16-HP'));
  if(fromInstr.requiresOutput && !monitoringAllowedSource) {
    return {
      valid:false,
      message:`${fromInstr.label} is a monitoring destination and cannot send signal.`
    };
  }

  // Snake stage-return outputs are for output-destination devices only (monitors/PM1/etc).
  if(isSnakeBox(fromInstr) && isSnakeStageReturnOutputPin(fromObj.pin) && !toInstr.requiresOutput) {
    return {
      valid:false,
      message:`${fromInstr.label} output ${fromKey} can only connect to output devices.`
    };
  }

  const allowsHA400MonitoringFeed = isHeadphoneOutputPin(fromInstr, fromObj.pin) && isHA400MonitoringInput(toInstr, toObj.pin);
  if(!isSnakeBox(fromInstr) && isEndpointOnlyOutput(fromInstr, fromObj.pin) && !toInstr.requiresOutput && !allowsHA400MonitoringFeed && !isEthernetPair) {
    return {
      valid:false,
      message:`${fromInstr.label} output ${fromKey} can only connect to output devices.`
    };
  }

  // Input pins cannot be source points.
  if(isEffectiveInputPin(fromInstr, fromObj.pin)) {
    return {
      valid:false,
      message:`${fromInstr.label} ${fromKey} is an input and cannot send signal.`
    };
  }

  const fromPersonalMixerPort = isMixerBox(fromInstr) && fromKey.startsWith('MX-P16-');
  const fromOutletEthernetPort = isOutletBox(fromInstr) && getOutletPortCableTypeForPin(fromInstr, fromObj.pin) === 'ethernet';
  const fromP16ThruPort = fromInstr.type === 'p16' && fromKey === 'P16-THRU';
  const fromP16DOutPort = fromInstr.type === 'p16d' && fromKey.startsWith('P16D-OUT-');
  if(toInstr.type === 'p16' && !fromPersonalMixerPort && !fromOutletEthernetPort && !fromP16ThruPort && !fromP16DOutPort) {
    return {
      valid:false,
      message:'P16 accepts Personal Monitoring Ethernet from mixer PM outputs, outlet ethernet ports, P16-D OUT ports, or another P16 THRU.'
    };
  }

  // Output pins cannot be destination points.
  if(isEffectiveOutputPin(toInstr, toObj.pin)) {
    const canReceiveOnMonitoringPin = !!toInstr.requiresOutput && (toKey === 'MONO' || toKey === 'L' || toKey === 'R');
    if(canReceiveOnMonitoringPin || isEthernetPair) {
      // Allowed: monitoring destinations use the regular MONO/L/R dot as a receive pin.
    } else {
    return {
      valid:false,
      message:'Output pins cannot receive signal.'
    };
    }
  }

  // Drum mic pins are input sources and cannot be patched to snake outputs.
  if(isDrumMicPin(fromObj.pin) && isEffectiveOutputPin(toInstr, toObj.pin)) {
    return {
      valid:false,
      message:'Drum mic channels cannot connect to snake outputs.'
    };
  }

  // PM1 and monitors must connect to outputs
  if(toInstr.requiresOutput) {
    if(!isEffectiveOutputPin(fromInstr, fromObj.pin)) {
      return {
        valid:false,
        message:`${toInstr.label} must connect to a snake OUTPUT, not an input.`
      };
    }
  }

  const cableResolution = resolveCableForPins(fromInstr, fromObj.pin, toInstr, toObj.pin, selectedCable);
  if(!cableResolution.valid) {
    return cableResolution;
  }

  return {
    valid:true,
    cableType:cableResolution.cableType,
    color:cableResolution.color,
    label:cableResolution.label,
    wasAutoChosen:cableResolution.wasAutoChosen,
  };
}

function handleConnectClick(id, pin, e) {
  const clickedPin = pinKey(pin);
  if(!connectingFrom) {
    const sourceInstr = instruments.find(i => i.id === id);
    if(sourceInstr && sourceInstr.stereo && clickedPin === 'MONO') {
      alert(`${sourceInstr.label} is stereo. Start from L or R pin.`);
      return;
    }
    if(!canSourcePinAcceptAnotherConnection(sourceInstr, id, clickedPin)) {
      alert('This pin is already connected. Remove that cable first.');
      return;
    }
    connectingFrom={id, pin:clickedPin};
    updateClasses();
    function onMove(e){
      const wr=document.getElementById('canvas-wrap').getBoundingClientRect();
      const a=getCenterOf(connectingFrom.id, connectingFrom.pin); if(!a) return;
      drawingLine={x1:a.x,y1:a.y,x2:e.clientX-wr.left,y2:e.clientY-wr.top};
      render(false);
    }
    function onUp(){ document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); }
    document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
  } else {
    if(id!==connectingFrom.id || clickedPin!==connectingFrom.pin) {

      let resolvedFrom = { id: connectingFrom.id, pin: connectingFrom.pin };
      let resolvedTo = { id, pin: clickedPin };
      let validation = validateConnection(resolvedFrom, resolvedTo);
      if(!validation.valid) {
        const reverseValidation = validateConnection(resolvedTo, resolvedFrom);
        if(reverseValidation.valid) {
          const tmp = resolvedFrom;
          resolvedFrom = resolvedTo;
          resolvedTo = tmp;
          validation = reverseValidation;
        }
      }

      if(!validation.valid){
        alert(validation.message);
        connectingFrom=null; drawingLine=null;
        updateClasses(); render();
        return;
      }

      const ct = {
        id: validation.cableType,
        color: validation.color,
        label: validation.label,
      };
      pushHistoryState();
      const firstConn = {
        id:++idCounter,
        fromId:resolvedFrom.id, fromPin:resolvedFrom.pin,
        toId:resolvedTo.id, toPin:resolvedTo.pin,
        cableType:ct.id, color:ct.color, label:ct.label,
        routeX:null,
      };
      connections.push(firstConn);
      markDirty();
      // mark snake pins as used
      refreshConnectorStates(resolvedFrom.id);
      refreshConnectorStates(resolvedTo.id);
      maybeAutoRouteSnakeMixer(firstConn);
      maybeAutoRouteDrumkitSnake(firstConn);
      maybeAutoRouteMultiPortToMixer(firstConn);
      maybeAutoAddTrsSplitCompanion(firstConn);
      maybeSuggestStereoCompanion(firstConn);
    }
    connectingFrom=null; drawingLine=null;
    updateClasses(); render();
  }
}

canvasWrap.addEventListener('click', e=>{
  if(suppressCanvasClick) {
    suppressCanvasClick = false;
    return;
  }
  if(!e.target.closest('.si, .stage-part')){
    const prevSelectedId = selectedId;
    selectedId=null;
    selectedStagePartId = null;
    if(prevSelectedId) {
      const prev = instruments.find(i=>i.id===prevSelectedId);
      if(prev) renderInstrument(prev);
    }
    updateClasses();
    updateSelectionPanels();
    hoveredConnectionId = null;
    connectingFrom=null;
    drawingLine=null;
    render();
    updateClasses();
  }
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CONNECTIONS LIST (right panel)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function updateConnList() {
  const list = document.getElementById('conn-list');
  if(isStageBuilderMode) {
    list.innerHTML = '<div class="no-conn">Stage Builder mode: connections hidden</div>';
    hoveredConnectionId = null;
    return;
  }
  const instrumentsById = new Map(instruments.map(instr => [instr.id, instr]));
  if(!connections.length) {
    list.innerHTML = '<div class="no-conn">No connections yet</div>';
    hoveredConnectionId = null;
    return;
  }

  const focusedInstr = selectedId ? (instrumentsById.get(selectedId) || null) : null;
  const viewConnections = focusedInstr
    ? connections.filter(c => c.fromId === focusedInstr.id || c.toId === focusedInstr.id)
    : connections;

  if(focusedInstr && !viewConnections.length) {
    list.innerHTML = `<div class="conn-focus-meta">Selected: ${escapeHtml(focusedInstr.label)}</div><div class="no-conn">No connections for this item</div>`;
    hoveredConnectionId = null;
    return;
  }

  const meta = focusedInstr
    ? `<div class="conn-focus-meta">Selected: ${escapeHtml(focusedInstr.label)}${isSnakeBox(focusedInstr)?' (snake pin map)':''}</div>`
    : '';

  list.innerHTML = meta + viewConnections.map(conn => {
    const from = instrumentsById.get(conn.fromId);
    const to = instrumentsById.get(conn.toId);
    if(!from || !to) return '';

    let fromLabel = conn.fromPin != null ? `${from.label} ${getDisplayPinLabelForInstrument(from, conn.fromPin)}` : from.label;
    let toLabel = conn.toPin != null ? `${to.label} ${getDisplayPinLabelForInstrument(to, conn.toPin)}` : to.label;

    if(focusedInstr && isSnakeBox(focusedInstr)) {
      const focusedIsFrom = conn.fromId === focusedInstr.id;
      const snakePin = focusedIsFrom ? getDisplayPinLabelForInstrument(focusedInstr, conn.fromPin) : getDisplayPinLabelForInstrument(focusedInstr, conn.toPin);
      const other = focusedIsFrom ? to : from;
      const otherPin = focusedIsFrom ? getDisplayPinLabelForInstrument(other, conn.toPin) : getDisplayPinLabelForInstrument(other, conn.fromPin);
      fromLabel = focusedIsFrom ? snakePin : `${other.label} ${otherPin}`;
      toLabel = focusedIsFrom ? `${other.label} ${otherPin}` : snakePin;
    }

    const activeClass = (hoveredConnectionId === conn.id) ? ' active' : '';
    return `<div class="ci${activeClass}" data-conn-id="${conn.id}">
      <div class="cdot" style="background:${conn.color}"></div>
      <div class="ctext">${escapeHtml(fromLabel)} â†’ ${escapeHtml(toLabel)}<br><span style="color:var(--muted)">${escapeHtml(conn.label)}</span></div>
      <button class="cdel" onclick="deleteConn(${conn.id})">Ã—</button>
    </div>`;
  }).join('');

  list.querySelectorAll('.ci').forEach((row, idx) => {
    const conn = viewConnections[idx];
    if(!conn) return;
    row.addEventListener('mouseenter', () => setHoveredConnection(conn.id));
    row.addEventListener('mouseleave', () => setHoveredConnection(null));
  });
}

function setHoveredConnection(id) {
  if(hoveredConnectionId === id) return;
  hoveredConnectionId = id;
  render(false);
}

function deleteConn(id) {
  const conn=connections.find(c=>c.id===id);
  pushHistoryState();
  connections=connections.filter(c=>c.id!==id);
  if(hoveredConnectionId === id) hoveredConnectionId = null;
  markDirty();
  if(conn){ refreshConnectorStates(conn.fromId); refreshConnectorStates(conn.toId); }
  updateSelectionPanels();
  render();
}

function autoRouteStereoSuggestion() {
  const snakes = instruments.filter(i => i.isSnake);
  if(!snakes.length) {
    alert('Add at least one snake first for auto-route.');
    return;
  }

  const freeInputs = [];
  snakes.forEach(snake => {
    const total = snake.snakeChannels || 0;
    for(let i=1;i<=total;i++) {
      const pin = `IN-${i}`;
      if(!isPinUsed(snake.id, pin)) freeInputs.push({ snakeId: snake.id, pin, snakeLabel: snake.label });
    }
  });

  if(!freeInputs.length) {
    alert('No free snake inputs available for auto-route.');
    return;
  }

  const stereoSources = instruments
    .filter(i => {
      if(!i || i.isSnake || isConnectionBoxInstrument(i) || isNonConnectableInstrument(i)) return false;
      const hasAccessoryStereoOut = hasAttachedAccessory(i) && !!i.attachedAccessoryStereo;
      return !!i.stereo || hasAccessoryStereoOut;
    })
    .sort((a,b) => a.id - b.id);

  const plan = [];
  const reserved = new Set();
  for(const src of stereoSources) {
    const sourcePins = ['L', 'R'];
    sourcePins.forEach(pin => {
      if(isPinUsed(src.id, pin)) return;
      const next = freeInputs.find(f => !reserved.has(`${f.snakeId}:${f.pin}`));
      if(!next) return;
      reserved.add(`${next.snakeId}:${next.pin}`);
      plan.push({ fromId: src.id, fromPin: pin, toId: next.snakeId, toPin: next.pin, toLabel: next.snakeLabel });
    });
  }

  if(!plan.length) {
    alert('No stereo pins are currently available to auto-route.');
    return;
  }

  const preview = plan.slice(0, 14).map(p => {
    const src = instruments.find(i => i.id === p.fromId);
    return `${src ? src.label : 'Source'} ${p.fromPin} â†’ ${p.toLabel} ${p.toPin}`;
  }).join('\n');
  const extra = plan.length > 14 ? `\n...and ${plan.length - 14} more` : '';
  const ok = confirm(`Auto-route suggestion:\n\n${preview}${extra}\n\nApply these connections?`);
  if(!ok) return;

  pushHistoryState();
  const touched = new Set();
  plan.forEach(p => {
    const check = validateConnection({id:p.fromId, pin:p.fromPin}, {id:p.toId, pin:p.toPin});
    if(!check.valid) return;
    connections.push({
      id: ++idCounter,
      fromId: p.fromId,
      fromPin: p.fromPin,
      toId: p.toId,
      toPin: p.toPin,
      cableType: check.cableType,
      color: check.color,
      label: check.label,
      routeX: null,
    });
    touched.add(p.fromId);
    touched.add(p.toId);
  });
  touched.forEach(id => refreshConnectorStates(id));
  markDirty();
  render(false);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CLEAR
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function resetLayoutToDefaults() {
  instruments.forEach(i=>{ const el=getEl(i.id); if(el) el.remove(); });
  stageParts.forEach(p=>{ const el=getStagePartEl(p.id); if(el) el.remove(); });
  instruments=[]; connections=[]; stageParts=[]; selectedId=null; selectedStagePartId=null; connectingFrom=null; drawingLine=null;
  isStageBuilderMode = false;
  themeMode = DEFAULT_THEME_MODE;
  stageColor = DEFAULT_STAGE_COLOR;
  applyThemeMode();
  applyStageColor();
  document.getElementById('dim-w').value = 7.5;
  document.getElementById('dim-d').value = 4.4;
  stageW = 7.5;
  stageD = 4.4;
  showStageStairs = false;
  showMainStage = true;
  showStageGrid = true;
  suppressBuiltInStairsPart = false;
  const stairsToggle = document.getElementById('stage-stairs-toggle');
  if(stairsToggle) stairsToggle.checked = false;
  applyStageStairs();
  ensureDefaultMainStagePart(stagePx);
  ensureDefaultStageStairsPart(stagePx);
  updateSelectionPanels();
  updateSnakeViewToggleUI();
  refreshCategoryCollapseButtons();
  applyModeUI();
  updateStage(true);
}

function clearCurrentScene() {
  if(!confirm('Clear the current scene layout?')) return;
  pushHistoryState();
  resetLayoutToDefaults();
  saveCurrentSceneState();
  renderSceneTabs();
  markDirty();
  render(false);
}

function clearAll() {
  if(!confirm('Clear all scenes and reset to a new empty project?')) return;
  pushHistoryState();
  resetLayoutToDefaults();
  scenes = [{
    id: 1,
    name: `Scene ${indexToLetters(1)}`,
    state: captureSceneState(),
  }];
  activeSceneId = 1;
  sceneIdCounter = 1;
  renderSceneTabs();
  markDirty();
  render(false);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EXPORT JSON
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function supportsFileSystemSave() {
  return typeof window.showSaveFilePicker === 'function';
}

function supportsFileSystemDirectory() {
  return typeof window.showDirectoryPicker === 'function';
}

function supportsFileSystemLoad() {
  return typeof window.showOpenFilePicker === 'function';
}

async function ensureRiderSaveHandle() {
  if(riderFileHandle) return riderFileHandle;
  if(!supportsFileSystemSave()) return null;
  const pickerOpts = {
    suggestedName: getRiderSaveFileName(),
    types: [{
      description: 'Stage Rider JSON',
      accept: { 'application/json': ['.json'] },
    }],
  };
  riderFileHandle = await window.showSaveFilePicker(pickerOpts);
  return riderFileHandle;
}

function normalizeRiderFileName(name) {
  const trimmed = String(name || '').trim();
  if(!trimmed) return getRiderSaveFileName();
  if(trimmed.toLowerCase().endsWith(RIDER_FILE_EXTENSION.toLowerCase())) return trimmed;
  return `${trimmed}${RIDER_FILE_EXTENSION}`;
}

function splitRiderFileName(name) {
  const normalized = normalizeRiderFileName(name);
  if(normalized.toLowerCase().endsWith(RIDER_FILE_EXTENSION.toLowerCase())) {
    return {
      base: normalized.slice(0, -RIDER_FILE_EXTENSION.length) || 'untitled-project',
      ext: RIDER_FILE_EXTENSION,
    };
  }
  const idx = normalized.lastIndexOf('.');
  if(idx > 0) {
    return { base: normalized.slice(0, idx), ext: normalized.slice(idx) };
  }
  return { base: normalized, ext: '' };
}

async function getUniqueRiderFileNameInDirectory(dirHandle, preferredName) {
  const normalized = normalizeRiderFileName(preferredName);
  try {
    await dirHandle.getFileHandle(normalized, { create: false });
  } catch(_err) {
    return normalized;
  }

  const parts = splitRiderFileName(normalized);
  for(let i = 2; i < 1000; i++) {
    const candidate = `${parts.base}-${i}${parts.ext}`;
    try {
      await dirHandle.getFileHandle(candidate, { create: false });
    } catch(_err) {
      return candidate;
    }
  }
  return `${parts.base}-${Date.now()}${parts.ext}`;
}

async function writeRiderToDirectory(dirHandle, data, preferredName, options = {}) {
  const overwrite = !!options.overwrite;
  const normalized = normalizeRiderFileName(preferredName);
  const targetName = overwrite ? normalized : await getUniqueRiderFileNameInDirectory(dirHandle, normalized);
  const fileHandle = await dirHandle.getFileHandle(targetName, { create: true });
  await writeRiderToHandle(fileHandle, data);
  riderFileHandle = fileHandle;
  riderLastSavedFileName = targetName;
  return { fileHandle, fileName: targetName };
}

async function writeRiderToHandle(handle, data) {
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(data, null, 2));
  await writable.close();
}

function openSaveTargetDialog(options = {}) {
  const mode = options.mode === 'save-as' ? 'save-as' : 'save';
  const defaultName = normalizeRiderFileName(options.fileName || getRiderSaveFileName());
  const defaultLocation = options.location === 'google-drive' ? 'google-drive' : 'local';

  return new Promise(resolve => {
    let overlay = document.getElementById('save-target-modal');
    if(!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'save-target-modal';
      overlay.className = 'report-modal';
      overlay.innerHTML = `
        <div class="report-dialog" role="dialog" aria-modal="true" aria-labelledby="save-target-title" style="max-width:520px;">
          <div class="report-dialog-header">
            <h2 id="save-target-title">Save Project</h2>
            <p>Confirm file name and where to save.</p>
          </div>
          <div class="report-dialog-body">
            <div style="display:grid;gap:12px;">
              <label style="display:grid;gap:6px;">
                <span style="font-size:12px;color:#4f5f73;font-weight:600;">File name</span>
                <input id="save-target-name" class="pselect" type="text" style="background:#fff;color:#17324f;">
              </label>
              <label style="display:grid;gap:6px;">
                <span style="font-size:12px;color:#4f5f73;font-weight:600;">Location</span>
                <select id="save-target-location" class="pselect" style="background:#fff;color:#17324f;">
                  <option value="local">Local</option>
                  <option value="google-drive">Google Drive</option>
                </select>
              </label>
              <div id="save-target-destination" style="font-size:12px;color:#4f5f73;min-height:18px;">No destination selected yet.</div>
            </div>
          </div>
          <div class="report-dialog-actions" style="justify-content:space-between;">
            <button id="save-target-browse" class="report-btn" type="button">Browse...</button>
            <button id="save-target-cancel" class="report-btn" type="button">Cancel</button>
            <button id="save-target-confirm" class="report-btn primary" type="button">Save</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const title = document.getElementById('save-target-title');
    const nameInput = document.getElementById('save-target-name');
    const locationSelect = document.getElementById('save-target-location');
    const destinationEl = document.getElementById('save-target-destination');
    const browseBtn = document.getElementById('save-target-browse');
    const cancelBtn = document.getElementById('save-target-cancel');
    const confirmBtn = document.getElementById('save-target-confirm');
    if(!title || !nameInput || !locationSelect || !destinationEl || !browseBtn || !cancelBtn || !confirmBtn) {
      resolve(null);
      return;
    }

    let localBrowseSelection = null;
    let driveBrowseSelection = null;

    const updateDestinationLabel = () => {
      const location = locationSelect.value === 'google-drive' ? 'google-drive' : 'local';
      if(location === 'google-drive') {
        if(driveBrowseSelection && driveBrowseSelection.folderName) {
          destinationEl.textContent = `Destination folder: Google Drive / ${driveBrowseSelection.folderName}`;
        } else {
          destinationEl.textContent = 'No Google Drive folder selected yet.';
        }
        return;
      }
      if(localBrowseSelection && localBrowseSelection.label) {
        destinationEl.textContent = `Destination: ${localBrowseSelection.label}`;
      } else {
        destinationEl.textContent = 'No local destination selected yet.';
      }
    };

    const done = result => {
      overlay.classList.remove('open');
      browseBtn.removeEventListener('click', onBrowse);
      cancelBtn.removeEventListener('click', onCancel);
      confirmBtn.removeEventListener('click', onConfirm);
      locationSelect.removeEventListener('change', onLocationChange);
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onKeyDown);
      resolve(result);
    };

    const onCancel = () => done(null);
    const onConfirm = () => {
      const fileName = normalizeRiderFileName(nameInput.value || defaultName);
      const location = locationSelect.value === 'google-drive' ? 'google-drive' : 'local';
      done({
        mode,
        fileName,
        location,
        driveFolderSelection: location === 'google-drive' ? driveBrowseSelection : null,
        localBrowseSelection: location === 'local' ? localBrowseSelection : null,
      });
    };
    const onBrowse = async () => {
      const location = locationSelect.value === 'google-drive' ? 'google-drive' : 'local';
      const fileName = normalizeRiderFileName(nameInput.value || defaultName);
      if(location === 'google-drive') {
        try {
          const selection = await openGoogleDriveFolderPickerDialog({ defaultFileName: fileName });
          if(!selection) return;
          driveBrowseSelection = {
            folderId: String(selection.folderId || '').trim(),
            folderName: String(selection.folderName || 'Folder').trim() || 'Folder',
          };
          updateDestinationLabel();
        } catch(err) {
          alert((err && err.message) ? err.message : 'Could not open Google Drive browser.');
        }
        return;
      }

      try {
        if(supportsFileSystemDirectory()) {
          const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
          if(!dirHandle) return;
          localBrowseSelection = {
            directoryHandle: dirHandle,
            label: String(dirHandle.name || 'Selected folder'),
          };
          updateDestinationLabel();
          return;
        }
        if(supportsFileSystemSave()) {
          const handle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: 'Stage Rider JSON',
              accept: { 'application/json': ['.json'] },
            }],
          });
          if(!handle) return;
          const nextName = normalizeRiderFileName(handle.name || fileName);
          nameInput.value = nextName;
          localBrowseSelection = {
            fileHandle: handle,
            label: `Local file: ${nextName}`,
          };
          updateDestinationLabel();
          return;
        }
      } catch(err) {
        if(err && err.name === 'AbortError') return;
      }

      alert('Local browse is not available in this browser. Use Save to download instead.');
    };
    const onLocationChange = () => {
      browseBtn.textContent = locationSelect.value === 'google-drive' ? 'Browse Drive...' : 'Browse Local...';
      updateDestinationLabel();
    };
    const onOverlayClick = e => {
      if(e.target === overlay) done(null);
    };
    const onKeyDown = e => {
      if(!overlay.classList.contains('open')) return;
      if(e.key === 'Escape') {
        e.preventDefault();
        done(null);
        return;
      }
      if(e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };

    title.textContent = mode === 'save-as' ? 'Save Project As' : 'Save Project';
    confirmBtn.textContent = mode === 'save-as' ? 'Save As' : 'Save';
    nameInput.value = defaultName;
    locationSelect.value = defaultLocation;
    onLocationChange();
    browseBtn.style.display = mode === 'save-as' ? 'inline-flex' : 'none';
    browseBtn.addEventListener('click', onBrowse);
    locationSelect.addEventListener('change', onLocationChange);
    cancelBtn.addEventListener('click', onCancel);
    confirmBtn.addEventListener('click', onConfirm);
    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeyDown);
    overlay.classList.add('open');
    setTimeout(() => {
      nameInput.focus();
      nameInput.select();
    }, 0);
  });
}

async function saveRiderToGoogleDrive(fileName, mode = 'save', options = {}) {
  const token = await ensureGoogleDriveAccess(true);
  if(!token) return;

  const data = serializeLayout();
  const targetName = normalizeRiderFileName(fileName || googleDriveCurrentFileName || getRiderSaveFileName());
  const preselected = options && options.driveSelection ? options.driveSelection : null;
  const preselectedFolder = options && options.driveFolderSelection ? options.driveFolderSelection : null;
  let targetFileId = '';
  let targetFileName = targetName;
  let targetParentFolderId = '';

  if(mode === 'save' && googleDriveCurrentFileId) {
    targetFileId = googleDriveCurrentFileId;
    targetFileName = normalizeRiderFileName(googleDriveCurrentFileName || targetName);
  }

  if(mode === 'save' && !googleDriveCurrentFileId) {
    mode = 'save-as';
  }

  if(mode === 'save-as') {
    const selection = preselected || (preselectedFolder ? {
      action: 'new',
      fileId: '',
      fileName: targetName,
      folderId: String(preselectedFolder.folderId || '').trim(),
    } : await openGoogleDriveFileDialog({ mode: 'save-as', defaultFileName: targetName }));
    if(!selection) return;
    if(selection.action === 'overwrite' && selection.fileId) {
      targetFileId = String(selection.fileId || '');
      targetFileName = normalizeRiderFileName(selection.fileName || targetName);
      targetParentFolderId = '';
    } else {
      targetFileId = '';
      targetFileName = targetName;
      targetParentFolderId = String(selection.folderId || '').trim();
    }
  }

  const uploaded = await uploadRiderToGoogleDrive(targetFileName, data, {
    fileId: targetFileId,
    parentFolderId: targetParentFolderId,
  });

  riderSaveLocation = 'google-drive';
  hasRiderSavePreference = true;
  riderSaveDirHandle = null;
  riderFileHandle = null;
  riderLastSavedFileName = normalizeRiderFileName(uploaded.name || targetFileName);
  googleDriveCurrentFileId = String(uploaded.id || targetFileId || '');
  googleDriveCurrentFileName = riderLastSavedFileName;
  saveGoogleDriveSettings();
  markClean();
  addRecentRiderFile({
    source: 'google-drive',
    fileId: googleDriveCurrentFileId,
    fileName: riderLastSavedFileName,
  });
}

async function saveRiderToLocalTarget(fileName, mode = 'save', options = {}) {
  const data = serializeLayout();
  const targetName = normalizeRiderFileName(fileName || getRiderSaveFileName());
  const browseSelection = options && options.localBrowseSelection ? options.localBrowseSelection : null;
  const directFileHandle = (options && options.localFileHandle ? options.localFileHandle : null) || (browseSelection && browseSelection.fileHandle ? browseSelection.fileHandle : null);
  const directDirectoryHandle = (options && options.localDirectoryHandle ? options.localDirectoryHandle : null) || (browseSelection && browseSelection.directoryHandle ? browseSelection.directoryHandle : null);
  try {
    if(mode === 'save-as' && directFileHandle) {
      riderFileHandle = directFileHandle;
      riderSaveDirHandle = null;
      await writeRiderToHandle(directFileHandle, data);
      riderLastSavedFileName = normalizeRiderFileName(directFileHandle.name || targetName);
      markClean();
      addRecentRiderFile({ source: 'local', fileName: riderLastSavedFileName, localFileHandle: directFileHandle });
      return;
    }

    if(mode === 'save-as' && directDirectoryHandle) {
      riderSaveDirHandle = directDirectoryHandle;
      const saved = await writeRiderToDirectory(directDirectoryHandle, data, targetName, { overwrite: true });
      riderLastSavedFileName = normalizeRiderFileName(saved.fileName || targetName);
      markClean();
      addRecentRiderFile({ source: 'local', fileName: riderLastSavedFileName, localFileHandle: saved.fileHandle || riderFileHandle });
      return;
    }

    if(mode === 'save' && riderSaveDirHandle && supportsFileSystemDirectory()) {
      const overwrite = !!riderLastSavedFileName && normalizeRiderFileName(riderLastSavedFileName) === targetName;
      await writeRiderToDirectory(riderSaveDirHandle, data, targetName, { overwrite });
      markClean();
      addRecentRiderFile({ source: 'local', fileName: targetName, localFileHandle: riderFileHandle });
      return;
    }

    if(mode === 'save' && riderFileHandle && normalizeRiderFileName(riderFileHandle.name || '') === targetName) {
      await writeRiderToHandle(riderFileHandle, data);
      riderLastSavedFileName = targetName;
      markClean();
      addRecentRiderFile({ source: 'local', fileName: riderLastSavedFileName, localFileHandle: riderFileHandle });
      return;
    }

    if(supportsFileSystemDirectory()) {
      const directoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      if(!directoryHandle) return;
      riderSaveDirHandle = directoryHandle;
      await writeRiderToDirectory(directoryHandle, data, targetName, { overwrite: true });
      markClean();
      addRecentRiderFile({ source: 'local', fileName: targetName, localFileHandle: riderFileHandle });
      return;
    }

    const pickerOpts = {
      suggestedName: targetName,
      types: [{
        description: 'Stage Rider JSON',
        accept: { 'application/json': ['.json'] },
      }],
    };
    if(supportsFileSystemSave()) {
      const handle = await window.showSaveFilePicker(pickerOpts);
      if(!handle) return;
      riderFileHandle = handle;
      riderSaveDirHandle = null;
      await writeRiderToHandle(handle, data);
      riderLastSavedFileName = normalizeRiderFileName(handle.name || targetName);
      markClean();
      addRecentRiderFile({ source: 'local', fileName: riderLastSavedFileName, localFileHandle: handle });
      return;
    }
  } catch(err) {
    if(err && err.name === 'AbortError') return;
  }

  saveRiderByDownload(data, targetName);
  markClean();
  addRecentRiderFile({ source: 'local', fileName: targetName, localFileHandle: riderFileHandle });
}

async function saveRiderFromFileMenu(forcePrompt) {
  const drivePreferred = riderSaveLocation === 'google-drive' ? googleDriveCurrentFileName : '';
  const preferredName = riderLastSavedFileName || drivePreferred || getRiderSaveFileName();
  try {
    if(!forcePrompt && hasRiderSavePreference) {
      projectName = getProjectNameFromRiderFileName(preferredName);
      updateProjectNameUI();
      if(riderSaveLocation === 'google-drive') {
        await saveRiderToGoogleDrive(preferredName, 'save');
        return;
      }
      await saveRiderToLocalTarget(preferredName, 'save');
      return;
    }

    const choice = await openSaveTargetDialog({
      mode: forcePrompt ? 'save-as' : 'save',
      fileName: preferredName,
      location: riderSaveLocation,
    });
    if(!choice) return;

    projectName = getProjectNameFromRiderFileName(choice.fileName);
    updateProjectNameUI();
    riderSaveLocation = choice.location;
    hasRiderSavePreference = true;

    if(choice.location === 'google-drive') {
      await saveRiderToGoogleDrive(choice.fileName, choice.mode, {
        driveSelection: choice.driveSelection || null,
        driveFolderSelection: choice.driveFolderSelection || null,
      });
      return;
    }
    await saveRiderToLocalTarget(choice.fileName, choice.mode, {
      localFileHandle: choice.localFileHandle || null,
      localDirectoryHandle: choice.localDirectoryHandle || null,
      localBrowseSelection: choice.localBrowseSelection || null,
    });
  } catch(err) {
    alert((err && err.message) ? err.message : 'Could not save rider file.');
  }
}

function saveRiderByDownload(data, fileName = getRiderSaveFileName()) {
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = normalizeRiderFileName(fileName);
  a.click();
  URL.revokeObjectURL(url);
}

function assertImportFileSize(file, contextLabel = 'file') {
  if(!file) return;
  const size = Number(file.size) || 0;
  if(size <= 0) return;
  if(size > MAX_RIDER_FILE_BYTES) {
    const mb = (MAX_RIDER_FILE_BYTES / (1024 * 1024)).toFixed(1);
    throw new Error(`The selected ${contextLabel} is too large. Maximum allowed size is ${mb} MB.`);
  }
}

function assertRiderDataLimits(data) {
  if(!data || typeof data !== 'object') throw new Error('Invalid rider data.');
  const instrumentsCount = Array.isArray(data.instruments) ? data.instruments.length : 0;
  const connectionsCount = Array.isArray(data.connections) ? data.connections.length : 0;
  const stagePartsCount = Array.isArray(data.stageParts) ? data.stageParts.length : 0;
  const scenesCount = Array.isArray(data.scenes) ? data.scenes.length : 0;
  if(instrumentsCount > MAX_RIDER_INSTRUMENTS) throw new Error(`Rider exceeds instrument limit (${MAX_RIDER_INSTRUMENTS}).`);
  if(connectionsCount > MAX_RIDER_CONNECTIONS) throw new Error(`Rider exceeds connection limit (${MAX_RIDER_CONNECTIONS}).`);
  if(stagePartsCount > MAX_RIDER_STAGE_PARTS) throw new Error(`Rider exceeds stage-part limit (${MAX_RIDER_STAGE_PARTS}).`);
  if(scenesCount > MAX_RIDER_SCENES) throw new Error(`Rider exceeds scene limit (${MAX_RIDER_SCENES}).`);
}

async function saveRider() {
  await saveRiderFromFileMenu(false);
}

async function saveRiderAs() {
  await saveRiderFromFileMenu(true);
}

function extractScenesFromRiderData(data) {
  if(!data || typeof data !== 'object') return [];
  if(!Array.isArray(data.scenes) || !data.scenes.length) return [];
  if(data.scenes.length > MAX_RIDER_SCENES) {
    throw new Error(`This rider has too many scenes (${data.scenes.length}). Limit is ${MAX_RIDER_SCENES}.`);
  }
  return data.scenes.map((raw, index) => {
    const stateRaw = raw && raw.state && typeof raw.state === 'object' ? raw.state : null;
    if(!stateRaw) return null;
    const sceneInstrCount = Array.isArray(stateRaw.instruments) ? stateRaw.instruments.length : 0;
    const sceneConnCount = Array.isArray(stateRaw.connections) ? stateRaw.connections.length : 0;
    const scenePartsCount = Array.isArray(stateRaw.stageParts) ? stateRaw.stageParts.length : 0;
    if(sceneInstrCount > MAX_RIDER_INSTRUMENTS) throw new Error(`Scene \"${String(raw.name || `Scene ${indexToLetters(index + 1)}`)}\" exceeds instrument limit (${MAX_RIDER_INSTRUMENTS}).`);
    if(sceneConnCount > MAX_RIDER_CONNECTIONS) throw new Error(`Scene \"${String(raw.name || `Scene ${indexToLetters(index + 1)}`)}\" exceeds connection limit (${MAX_RIDER_CONNECTIONS}).`);
    if(scenePartsCount > MAX_RIDER_STAGE_PARTS) throw new Error(`Scene \"${String(raw.name || `Scene ${indexToLetters(index + 1)}`)}\" exceeds stage-part limit (${MAX_RIDER_STAGE_PARTS}).`);
    return {
      name: String(raw.name || `Scene ${indexToLetters(index + 1)}`),
      state: cloneSceneState(stateRaw),
    };
  }).filter(Boolean);
}

function importScenesFromRiderData(data, sourceLabel = 'file') {
  const importedScenes = extractScenesFromRiderData(data);
  if(!importedScenes.length) {
    alert('No scenes were found in this file.');
    return 0;
  }

  ensureSceneSystemInitialized();
  saveCurrentSceneState();
  pushHistoryState();

  let nextSceneId = Math.max(sceneIdCounter || 0, ...scenes.map(scene => scene && scene.id ? scene.id : 0));
  importedScenes.forEach(scene => {
    scenes.push({
      id: ++nextSceneId,
      name: String(scene.name || getNextDefaultSceneName()),
      state: cloneSceneState(scene.state),
    });
  });

  sceneIdCounter = nextSceneId;
  renderSceneTabs();
  markDirty();

  const count = importedScenes.length;
  const suffix = count === 1 ? '' : 's';
  alert(`Imported ${count} scene${suffix} from ${sourceLabel}.`);
  return count;
}

async function loadScenesFromGoogleDrive() {
  try {
    const token = await ensureGoogleDriveAccess(true);
    if(!token) return;
    const choice = await openGoogleDriveFileDialog({ mode: 'open' });
    if(!choice || choice.action !== 'open' || !choice.fileId) return;
    const loaded = await readRiderFromGoogleDrive(choice.fileId);
    const importedCount = importScenesFromRiderData(loaded.data, 'Google Drive');
    if(!importedCount) return;
    addRecentRiderFile({
      source: 'google-drive',
      fileId: String(loaded.fileId || ''),
      fileName: normalizeRiderFileName(loaded.fileName || 'untitled'),
    });
  } catch(err) {
    alert((err && err.message) ? err.message : 'Could not load scenes from Google Drive.');
  }
}

function triggerLoadScenesFromFile() {
  if(isLoadScenesPickerOpen) return;

  if(supportsFileSystemLoad()) {
    (async () => {
      try {
        const picked = await window.showOpenFilePicker({
          multiple: false,
          types: [{
            description: 'Stage Rider JSON',
            accept: { 'application/json': ['.json'] },
          }],
        });
        if(!picked || !picked.length) return;
        const handle = picked[0];
        const file = await handle.getFile();
        assertImportFileSize(file, 'scenes file');
        const text = await file.text();
        const data = JSON.parse(text);
        assertRiderDataLimits(data);
        const importedCount = importScenesFromRiderData(data, file.name || 'local file');
        if(!importedCount) return;
        addRecentRiderFile({ source: 'local', fileName: normalizeRiderFileName(file.name), localFileHandle: handle });
      } catch(err) {
        if(err && err.name === 'AbortError') return;
        alert('Could not load scenes from this file. Please select a valid JSON rider containing scenes.');
      }
    })();
    return;
  }

  const input = document.getElementById('scenes-file');
  if(!input) return;
  isLoadScenesPickerOpen = true;
  input.value = '';
  const releaseGuard = () => {
    setTimeout(() => {
      isLoadScenesPickerOpen = false;
    }, 50);
  };
  window.addEventListener('focus', releaseGuard, { once: true });
  input.click();
}

function handleLoadScenesFile(e) {
  isLoadScenesPickerOpen = false;
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  try {
    assertImportFileSize(file, 'scenes file');
  } catch(err) {
    alert((err && err.message) ? err.message : 'Scenes file is too large.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      assertRiderDataLimits(data);
      const importedCount = importScenesFromRiderData(data, file.name || 'local file');
      if(!importedCount) return;
      addRecentRiderFile({ source: 'local', fileName: normalizeRiderFileName(file.name) });
    } catch(_err) {
      alert('Could not load scenes from this file. Please select a valid JSON rider containing scenes.');
    }
  };
  reader.readAsText(file);
}

async function openRecentRiderScenesById(entryId) {
  const targetId = String(entryId || '').trim();
  if(!targetId) return;
  const entry = recentRiderFiles.find(item => String(item.id || '') === targetId);
  if(!entry) {
    alert('That recent file is no longer available in this list.');
    return;
  }

  if(entry.source === 'google-drive') {
    try {
      const token = await ensureGoogleDriveAccess(true);
      if(!token) return;
      const loaded = await readRiderFromGoogleDrive(entry.fileId);
      const importedCount = importScenesFromRiderData(loaded.data, normalizeRiderFileName(loaded.fileName || 'Google Drive file'));
      if(!importedCount) return;
      addRecentRiderFile({
        source: 'google-drive',
        fileId: String(loaded.fileId || ''),
        fileName: normalizeRiderFileName(loaded.fileName || 'untitled'),
      });
      return;
    } catch(err) {
      const message = String((err && err.message) || 'Could not open Google Drive file.');
      if(/not\s*found|insufficient|permission|forbidden/i.test(message)) {
        removeRecentRiderById(targetId);
        alert('This Drive file could not be opened (moved, deleted, or no access). It was removed from Recent.');
      } else {
        alert(message);
      }
      return;
    }
  }

  const localHandleId = String(entry.localHandleId || entry.id || '').trim();
  if(localHandleId) {
    try {
      const handle = await getRecentLocalHandle(localHandleId);
      if(handle) {
        if(typeof handle.queryPermission === 'function') {
          const state = await handle.queryPermission({ mode: 'read' });
          if(state !== 'granted') {
            if(typeof handle.requestPermission === 'function') {
              const requestState = await handle.requestPermission({ mode: 'read' });
              if(requestState !== 'granted') throw new Error('Permission to read this local file was denied.');
            } else {
              throw new Error('Permission to read this local file was denied.');
            }
          }
        }

        const file = await handle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        const importedCount = importScenesFromRiderData(data, file.name || entry.fileName || 'local file');
        if(!importedCount) return;
        addRecentRiderFile({
          id: entry.id,
          source: 'local',
          fileName: normalizeRiderFileName(file.name || entry.fileName || 'untitled'),
          localHandleId,
          localFileHandle: handle,
        });
        return;
      }
    } catch(err) {
      const msg = String((err && err.message) || '');
      if(/not\s*found|deleted|permission|denied|gone|unavailable/i.test(msg)) {
        removeRecentRiderById(targetId);
        alert('That local file is no longer available (moved/deleted/no permission). It was removed from Recent.');
        return;
      }
      alert(msg || 'Could not load scenes from recent local file.');
      return;
    }
  }

  alert('This local recent entry has no reusable file handle yet. Select it once and it will open directly next time.');
  triggerLoadScenesFromFile();
}

function triggerLoadRider(options = {}) {
  const skipUnsavedPrompt = !!(options && options.skipUnsavedPrompt);
  if(isLoadRiderPickerOpen) return;
  if(!skipUnsavedPrompt && hasUnsavedChanges && !confirm('You have unsaved changes. Loading a rider will replace the current layout. Continue?')) return;

  if(supportsFileSystemLoad()) {
    (async () => {
      try {
        const picked = await window.showOpenFilePicker({
          multiple: false,
          types: [{
            description: 'Stage Rider JSON',
            accept: { 'application/json': ['.json'] },
          }],
        });
        if(!picked || !picked.length) return;
        const handle = picked[0];
        const file = await handle.getFile();
        assertImportFileSize(file, 'rider file');
        const text = await file.text();
        const data = JSON.parse(text);
        assertRiderDataLimits(data);
        pendingHardLoadUndoSnapshot = captureSnapshot();
        loadRiderFromData(data);
        setProjectNameFromFileName(file.name);
        riderSaveDirHandle = null;
        riderFileHandle = handle;
        riderLastSavedFileName = normalizeRiderFileName(file.name);
        riderSaveLocation = 'local';
        hasRiderSavePreference = true;
        markClean();
        addRecentRiderFile({ source: 'local', fileName: riderLastSavedFileName, localFileHandle: handle });
      } catch(err) {
        if(err && err.name === 'AbortError') return;
        alert('Could not load rider file. Please select a valid JSON rider.');
      }
    })();
    return;
  }

  const input = document.getElementById('rider-file');
  isLoadRiderPickerOpen = true;
  input.value = '';

  const releaseGuard = () => {
    setTimeout(() => {
      isLoadRiderPickerOpen = false;
    }, 50);
  };
  window.addEventListener('focus', releaseGuard, { once: true });

  input.click();
}

function handleLoadRiderFile(e) {
  isLoadRiderPickerOpen = false;
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  try {
    assertImportFileSize(file, 'rider file');
  } catch(err) {
    alert((err && err.message) ? err.message : 'Rider file is too large.');
    return;
  }
  riderSaveDirHandle = null;
  riderFileHandle = null;
  riderLastSavedFileName = '';
  riderSaveLocation = 'local';
  hasRiderSavePreference = true;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      assertRiderDataLimits(data);
      pendingHardLoadUndoSnapshot = captureSnapshot();
      loadRiderFromData(data);
      setProjectNameFromFileName(file.name);
      markClean();
      addRecentRiderFile({ source: 'local', fileName: normalizeRiderFileName(file.name) });
    } catch (err) {
      alert('Could not load rider file. Please select a valid JSON rider.');
    }
  };
  reader.readAsText(file);
}

function loadRiderFromData(data) {
  const hardLoadUndoSnapshot = pendingHardLoadUndoSnapshot;
  pendingHardLoadUndoSnapshot = null;
  assertRiderDataLimits(data);
  if(typeof data.projectName === 'string' && data.projectName.trim()) {
    projectName = data.projectName.trim();
    updateProjectNameUI();
  }

  if(Array.isArray(data.scenes) && data.scenes.length) {
    const loadedScenes = data.scenes.map((raw, index) => {
      const stateRaw = raw && raw.state && typeof raw.state === 'object' ? raw.state : null;
      if(!stateRaw) return null;
      const id = parseInt(raw.id, 10) || (index + 1);
      return {
        id,
        name: String(raw.name || `Scene ${indexToLetters(index + 1)}`),
        state: cloneSceneState(stateRaw),
      };
    }).filter(Boolean);

    if(loadedScenes.length) {
      scenes = loadedScenes;
      sceneIdCounter = Math.max(parseInt(data.sceneIdCounter, 10) || 0, ...loadedScenes.map(scene => scene.id || 0));
      const requestedSceneId = parseInt(data.activeSceneId, 10) || loadedScenes[0].id;
      activeSceneId = loadedScenes.some(scene => scene.id === requestedSceneId) ? requestedSceneId : loadedScenes[0].id;
      const activeScene = getActiveScene() || loadedScenes[0];
      const sceneSnapshot = {
        ...cloneSceneState(activeScene.state),
        projectName,
      };
      applySnapshot(sceneSnapshot, true);
      renderSceneTabs();
      resetHistoryForCurrentScene();
      if(hardLoadUndoSnapshot) commitSnapshotBeforeChange(hardLoadUndoSnapshot);
      return;
    }
  }

  const newInstruments = Array.isArray(data.instruments) ? data.instruments : [];
  const newConnections = Array.isArray(data.connections) ? data.connections : [];
  const stage = data.stage || {};

  instruments.forEach(i => { const el = getEl(i.id); if(el) el.remove(); });
  stageParts.forEach(p => { const el = getStagePartEl(p.id); if(el) el.remove(); });
  instruments = [];
  connections = [];
  stageParts = [];
  stagePartIdCounter = 0;
  selectedId = null;
  selectedStagePartId = null;
  connectingFrom = null;
  drawingLine = null;
  showMainStage = data.showMainStage !== false;
  showStageGrid = data.showStageGrid !== false;
  isStageBuilderMode = !!data.isStageBuilderMode;

  stageW = Math.max(2, Math.min(80, parseFloat(stage.widthM) || 7.5));
  stageD = Math.max(2, Math.min(50, parseFloat(stage.depthM) || 4.4));
  showStageStairs = !!stage.showStairs;
  suppressBuiltInStairsPart = !!(stage && stage.suppressBuiltInStairsPart);
  themeMode = stage.themeMode === 'dark' ? 'dark' : DEFAULT_THEME_MODE;
  stageColor = /^#[0-9a-fA-F]{6}$/.test(String(stage.color || '')) ? stage.color : DEFAULT_STAGE_COLOR;
  document.getElementById('dim-w').value = stageW;
  document.getElementById('dim-d').value = stageD;
  const stairsToggle = document.getElementById('stage-stairs-toggle');
  if(stairsToggle) stairsToggle.checked = showStageStairs;
  applyThemeMode();
  applyStageColor();

  newInstruments.forEach(raw => {
    const isDi = raw.type === 'di';
    const isPedals = isPedalsType(raw.type);
    const diStereo = isDi ? !!(raw.stereo || raw.inputStereo || raw.outputStereo) : false;
    const pedalsInputStereo = isPedals ? !!(raw.inputStereo || raw.stereo) : false;
    const pedalsOutputStereo = isPedals ? !!(raw.outputStereo || raw.stereo) : false;
    const ioStereo = isDi ? diStereo : (isPedals ? pedalsOutputStereo : !!raw.stereo);
    const instr = {
      id: parseInt(raw.id, 10) || ++idCounter,
      type: raw.type || 'custom',
      cat: raw.cat || 'infra',
      icon: raw.icon || 'ðŸŽ›',
      image: raw.image || getInstrumentImage(raw.type),
      label: raw.label || raw.type || 'Instrument',
      channel: raw.channel || '',
      notes: raw.notes || '',
      x: parseFloat(raw.x) || 0,
      y: parseFloat(raw.y) || 0,
      stageNX: Number.isFinite(parseFloat(raw.stageNX)) ? parseFloat(raw.stageNX) : null,
      stageNY: Number.isFinite(parseFloat(raw.stageNY)) ? parseFloat(raw.stageNY) : null,
      size: parseInt(raw.size, 10) || 52,
      wide: !!raw.wide,
      angle: parseInt(raw.angle, 10) || 0,
      stereo: ioStereo,
      inputStereo: isDi ? ioStereo : (isPedals ? pedalsInputStereo : !!raw.inputStereo),
      outputStereo: isDi ? ioStereo : (isPedals ? pedalsOutputStereo : !!raw.outputStereo),
      haUseMainInputs: !!raw.haUseMainInputs,
      ampOutputs: (raw.type === 'amp' || raw.type === 'poweramp') ? Math.max(1, Math.min(16, Number(raw.ampOutputs) || 4)) : 0,
      spkInputMode: isSpeakerWithThru(raw.type) ? normalizeSpeakerConnectorMode(raw.spkInputMode, 'xlr') : '',
      spkOutputMode: isSpeakerWithThru(raw.type) ? normalizeSpeakerConnectorMode(raw.spkOutputMode, 'xlr') : '',
      connectorMode: raw.connectorMode || getDefaultConnectorMode(raw.type),
      pinMicAssignments: {},
      micStandCount: Math.max(0, parseInt(raw.micStandCount, 10) || 0),
      drumMicStandAssignments: normalizeDrumMicStandAssignments(raw.drumMicStandAssignments),
      attachedAccessoryType: normalizeAttachedAccessoryType(raw.attachedAccessoryType),
      attachedAccessoryCableType: normalizeAttachedAccessoryCableType(raw.attachedAccessoryCableType),
      attachedAccessoryInputCableType: normalizeAttachedAccessoryCableType(raw.attachedAccessoryInputCableType || raw.attachedAccessoryCableType),
      attachedAccessoryOutputCableType: normalizeAttachedAccessoryCableType(raw.attachedAccessoryOutputCableType || raw.attachedAccessoryCableType),
      attachedAccessoryStereo: !!raw.attachedAccessoryStereo,
      hideWirelessReceiver: !!raw.hideWirelessReceiver,
      wirelessPairId: Number.isFinite(parseInt(raw.wirelessPairId, 10)) ? parseInt(raw.wirelessPairId, 10) : null,
      wirelessRole: String(raw.wirelessRole || '').trim().toLowerCase(),
      noConnect: !!raw.noConnect || isStandType(raw.type),
      connSide: raw.connSide || 'bottom',
      connectionBoxKind: inferConnectionBoxKind(raw) || '',
      isMixer: !!raw.isMixer,
      mixerInputs: Number(raw.mixerInputs) || (raw.type === 'xr18' ? 18 : (raw.type === 'x32' ? 38 : ((raw.type === 'x32compact' || raw.type === 'x32rack') ? 22 : ((raw.type === 'wingcompact' || raw.type === 'wingrack') ? 24 : (raw.type === 'wing' ? 16 : 0))))),
      mixerInputXlrOnly: Number(raw.mixerInputXlrOnly) || (raw.type === 's32' ? 32 : (raw.type === 's16' ? 16 : (raw.type === 'x32' ? 32 : ((raw.type === 'x32compact' || raw.type === 'x32rack') ? 16 : 0)))),
      mixerInputCombo: Number(raw.mixerInputCombo) || (raw.type === 'xr18' ? 16 : ((raw.type === 'wingcompact' || raw.type === 'wingrack') ? 24 : (raw.type === 'wing' ? 8 : 0))),
      mixerInputJackOnly: Number(raw.mixerInputJackOnly) || (raw.type === 'xr18' ? 2 : (raw.type === 'wing' ? 8 : ((raw.type === 'x32' || raw.type === 'x32compact' || raw.type === 'x32rack') ? 6 : 0))),
      mixerAux: Number(raw.mixerAux) || (
        raw.type === 's32' ? 16 :
        raw.type === 's16' ? 8 :
        raw.type === 'x32' ? 16 :
        raw.type === 'xr18' ? 6 :
        ((raw.type === 'x32compact' || raw.type === 'x32rack') ? 8 :
        ((raw.type === 'wing' || raw.type === 'wingcompact' || raw.type === 'wingrack') ? 8 : 0))
      ),
      mixerMain: Number(raw.mixerMain) || (raw.type === 'xr18' ? 2 : 0),
      mixerJackOut: Number(raw.mixerJackOut) || (raw.type === 'x32' ? 6 : ((raw.type === 'x32compact' || raw.type === 'x32rack') ? 6 : (raw.type === 'wing' ? 8 : 0))),
      mixerP16: Number(raw.mixerP16) || ((raw.type === 's32' || raw.type === 's16' || raw.type === 'xr18' || raw.type === 'x32' || raw.type === 'x32compact' || raw.type === 'x32rack') ? 1 : 0),
      mixerAes50: Number(raw.mixerAes50) || ((raw.type === 's32' || raw.type === 's16' || raw.type === 'x32' || raw.type === 'x32compact' || raw.type === 'x32rack') ? 2 : ((raw.type === 'wing' || raw.type === 'wingcompact' || raw.type === 'wingrack') ? 3 : 0)),
      outletConnectorType: normalizeOutletConnectorType(raw.outletConnectorType, 'ethernet'),
      outletPorts: normalizeOutletPortCount(raw.outletPorts, raw, isRouterOutletType(raw) ? 4 : 2),
      outletViewMode: normalizeOutletViewMode(raw.outletViewMode, 'outlet'),
      outletPortModes: normalizeOutletPortModes(raw.outletPortModes, normalizeOutletPortCount(raw.outletPorts, raw, isRouterOutletType(raw) ? 4 : 2), normalizeOutletConnectorType(raw.outletConnectorType, 'ethernet')),
      outletPortNames: normalizeOutletPortNames(raw.outletPortNames, normalizeOutletPortCount(raw.outletPorts, raw, isRouterOutletType(raw) ? 4 : 2), raw),
      outletPlacement: raw.outletPlacement === 'stage' ? 'stage' : 'wall',
      isSnake: !!raw.isSnake,
      snakeViewMode: normalizeSnakeViewMode(raw.snakeViewMode),
      snakeChannels: normalizeSnakeChannels(raw.snakeChannels),
      snakeAllowJackInputs: !!raw.snakeAllowJackInputs,
      snakeOutputs: normalizeSnakeOutputs(raw.snakeOutputs != null ? raw.snakeOutputs : raw.outputs),
      requiresOutput: !!raw.requiresOutput,
      drumMics: Array.isArray(raw.drumMics) ? raw.drumMics : (raw.type === 'drumkit' ? [] : null),
      collapsed: !!raw.collapsed,
    };
    normalizeConnectionBoxFlags(instr);
    normalizeWirelessPairMeta(instr);
    normalizeAttachedAccessoryForInstrument(instr);
    if(instr.type === 'x32' || instr.type === 'x32compact' || instr.type === 'x32rack' || instr.type === 'wing' || instr.type === 'wingcompact' || instr.type === 'wingrack') {
      instr.mixerMain = 0;
    }
    instr.pinMicAssignments = derivePinMicAssignments(raw, instr);
    if(!supportsMicPickup(instr)) instr.pinMicAssignments = {};
    if(!supportsMicStandOption(instr)) {
      instr.micStandCount = 0;
      instr.drumMicStandAssignments = {};
    } else {
      instr.micStandCount = clampMicStandCountForInstrument(instr, instr.micStandCount);
      if(instr.type === 'drumkit') {
        const selectedMics = new Set(Array.isArray(instr.drumMics) ? instr.drumMics : []);
        const standMap = normalizeDrumMicStandAssignments(instr.drumMicStandAssignments);
        Object.keys(standMap).forEach(key => {
          if(!selectedMics.has(key)) delete standMap[key];
        });
        instr.drumMicStandAssignments = standMap;
      }
    }
    pruneInvalidInstrumentPins(instr);
    instruments.push(instr);
  });

  syncAllInstrumentsWorldFromStageNorm(stagePx);

  const validIds = new Set(instruments.map(i => i.id));
  connections = newConnections
    .filter(c => validIds.has(c.fromId) && validIds.has(c.toId))
    .map(c => ({
      id: parseInt(c.id, 10) || ++idCounter,
      fromId: c.fromId,
      toId: c.toId,
      fromPin: c.fromPin ?? null,
      toPin: c.toPin ?? null,
      cableType: normalizeCableType(c.cableType || 'xlr'),
      color: c.color || (CABLE_TYPES.find(t => t.id === normalizeCableType(c.cableType || 'xlr')) || CABLE_TYPES[0]).color,
      label: c.label || (CABLE_TYPES.find(t => t.id === normalizeCableType(c.cableType || 'xlr')) || CABLE_TYPES[0]).label,
      routeX: Number.isFinite(c.routeX) ? c.routeX : (Number.isFinite(parseFloat(c.routeX)) ? parseFloat(c.routeX) : null),
      routeNX: Number.isFinite(c.routeNX) ? c.routeNX : (Number.isFinite(parseFloat(c.routeNX)) ? parseFloat(c.routeNX) : null),
    }));
  normalizeAllSnakeConnectionPins();

  const newStageParts = Array.isArray(data.stageParts) ? data.stageParts : [];
  stageParts = newStageParts.map(raw => ({
    id: parseInt(raw.id, 10) || ++stagePartIdCounter,
    shape: raw.shape === 'circle' ? 'circle' : 'rect',
    isPrimary: !!raw.isPrimary,
    label: String(raw.label || ''),
    x: Number.isFinite(parseFloat(raw.x)) ? parseFloat(raw.x) : stagePx.left,
    y: Number.isFinite(parseFloat(raw.y)) ? parseFloat(raw.y) : stagePx.top,
    stageNX: Number.isFinite(parseFloat(raw.stageNX)) ? parseFloat(raw.stageNX) : null,
    stageNY: Number.isFinite(parseFloat(raw.stageNY)) ? parseFloat(raw.stageNY) : null,
    widthM: Math.max(0.5, Math.min(120, parseFloat(raw.widthM) || 2.5)),
    depthM: Math.max(0.5, Math.min(120, parseFloat(raw.depthM) || 2.0)),
    color: /^#[0-9a-fA-F]{6}$/.test(String(raw.color || '')) ? raw.color : '#7da7c8',
    hasSteps: !!raw.hasSteps,
  }));
  if(showMainStage && !stageParts.some(p => p.isPrimary)) {
    const defaultPrimary = ensureDefaultMainStagePart(stagePx);
    if(defaultPrimary) {
      defaultPrimary.label = 'WORK STAGE';
      defaultPrimary.widthM = stageW;
      defaultPrimary.depthM = stageD;
      defaultPrimary.color = stageColor;
      defaultPrimary.hasSteps = false;
    }
  }
  ensureDefaultStageStairsPart(stagePx);

  const maxInstrId = instruments.reduce((m, i) => Math.max(m, i.id), 0);
  const maxConnId = connections.reduce((m, c) => Math.max(m, c.id), 0);
  const maxPartId = stageParts.reduce((m, p) => Math.max(m, p.id), 0);
  idCounter = Math.max(idCounter, maxInstrId, maxConnId);
  stagePartIdCounter = Math.max(stagePartIdCounter, maxPartId);

  updateSnakeViewToggleUI();
  refreshCategoryCollapseButtons();
  updateSelectionPanels();
  applyModeUI();
  updateStage(true);
  scenes = [{
    id: 1,
    name: `Scene ${indexToLetters(1)}`,
    state: captureSceneState(),
  }];
  activeSceneId = 1;
  sceneIdCounter = 1;
  renderSceneTabs();
  resetHistoryForCurrentScene();
  if(hardLoadUndoSnapshot) commitSnapshotBeforeChange(hardLoadUndoSnapshot);
  render();
}

function exportJSON() {
  const data = serializeLayout();
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='stage-layout.json'; a.click();
  URL.revokeObjectURL(url);
  markClean();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// REPORT (VIEW / PDF)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

let reportDialogDefaultAutoPrint = false;
let currentReportDrumKitCount = 0;
let reportPreviewWindow = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]|'/g, ch => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  })[ch]);
}

function getReportBaseName() {
  return `${sanitizeProjectName(projectName)}_report`;
}

function isReportAccessory(instr) {
  return !!instr && (instr.type === 'di' || instr.type === 'pedals');
}

function getReportTargetGroups() {
  return [
    { key:'snakes', label:'Snakes', items: instruments.filter(i => i && isSnakeBox(i)) },
    { key:'outlets', label:'Outlets', items: instruments.filter(i => i && isOutletBox(i)) },
    { key:'stageboxes', label:'Stageboxes', items: instruments.filter(i => i && isStageboxBox(i)) },
    { key:'mixers', label:'Mixers', items: instruments.filter(i => i && getConnectionBoxKind(i) === 'mixer') },
  ].filter(group => group.items.length > 0);
}

function ensureReportOptionsDialog() {
  let overlay = document.getElementById('report-modal');
  if(overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'report-modal';
  overlay.className = 'report-modal';
  overlay.innerHTML = `
    <div class="report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-dialog-title">
      <div class="report-dialog-header">
        <h2 id="report-dialog-title">Report Setup</h2>
        <p>Select scenes and report targets. PDF export can include scene-to-scene diffs, while PNG remains the current scene only.</p>
      </div>
      <div class="report-dialog-body">
        <div id="report-scene-panel" class="report-option-panel" style="display:none;">
          <h3>Scenes</h3>
          <div class="report-option-list" id="report-scene-list"></div>
        </div>
        <div class="report-option-grid" id="report-option-grid"></div>
        <div class="report-option-panel">
          <h3>Stage Image</h3>
          <div class="report-inline-row">
            <label><input id="report-include-stage-image" type="checkbox" checked> Include stage image</label>
            <label>Orientation
              <select id="report-stage-orientation" class="pselect" style="width:auto;min-width:140px;background:#fff;color:#17324f;">
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div class="report-dialog-actions">
        <button id="report-cancel-btn" class="report-btn" type="button">Cancel</button>
        <button id="report-view-btn" class="report-btn" type="button">View Report</button>
        <button id="report-pdf-btn" class="report-btn primary" type="button">Export PDF</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if(e.target === overlay) closeReportOptionsDialog();
  });
  overlay.querySelector('#report-cancel-btn').addEventListener('click', closeReportOptionsDialog);
  overlay.querySelector('#report-view-btn').addEventListener('click', () => submitReportOptions(false));
  overlay.querySelector('#report-pdf-btn').addEventListener('click', () => submitReportOptions(true));
  return overlay;
}

function closeReportOptionsDialog() {
  const overlay = document.getElementById('report-modal');
  if(overlay) overlay.classList.remove('open');
}

function buildReportOptionsMarkup() {
  const groups = getReportTargetGroups();
  if(!groups.length) {
    return '<div class="report-option-panel"><h3>No report items</h3><div style="font-size:12px;color:#4f5f73;line-height:1.4;">Add snakes, outlets, stageboxes, or mixers first.</div></div>';
  }
  return groups.map(group => `
    <div class="report-option-panel">
      <h3>${escapeHtml(group.label)}</h3>
      <div class="report-option-list">
        ${group.items.map(item => `
          <label class="report-option-item">
            <input type="checkbox" data-report-item-id="${item.id}" checked>
            <span>${escapeHtml(item.label || item.name || item.type)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function openReportOptionsDialog(autoPrint) {
  reportDialogDefaultAutoPrint = !!autoPrint;
  saveCurrentSceneState();
  const overlay = ensureReportOptionsDialog();
  const grid = overlay.querySelector('#report-option-grid');
  const scenePanel = overlay.querySelector('#report-scene-panel');
  const sceneList = overlay.querySelector('#report-scene-list');
  grid.innerHTML = buildReportOptionsMarkup();
  const orientation = overlay.querySelector('#report-stage-orientation');
  const pdfBtn = overlay.querySelector('#report-pdf-btn');
  const viewBtn = overlay.querySelector('#report-view-btn');
  if(orientation) orientation.value = 'horizontal';
  if(scenePanel && sceneList) {
    if(Array.isArray(scenes) && scenes.length > 1) {
      scenePanel.style.display = 'block';
      sceneList.innerHTML = scenes.map((scene, index) => {
        const checked = reportDialogDefaultAutoPrint ? 'checked' : (scene.id === activeSceneId ? 'checked' : '');
        return `
          <label class="report-option-item">
            <input type="checkbox" data-report-scene-id="${scene.id}" ${checked}>
            <span>${index + 1}. ${escapeHtml(scene.name || `Scene ${indexToLetters(index + 1)}`)}</span>
          </label>
        `;
      }).join('');
    } else {
      scenePanel.style.display = 'none';
      sceneList.innerHTML = '';
    }
  }
  if(viewBtn && pdfBtn) {
    viewBtn.classList.toggle('primary', !reportDialogDefaultAutoPrint);
    pdfBtn.classList.toggle('primary', !!reportDialogDefaultAutoPrint);
  }
  overlay.classList.add('open');
  const firstFocusable = overlay.querySelector('#report-cancel-btn') || overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if(firstFocusable && typeof firstFocusable.focus === 'function') firstFocusable.focus();
}

function submitReportOptions(autoPrint) {
  const overlay = document.getElementById('report-modal');
  if(!overlay) return;
  saveCurrentSceneState();
  const selectedIds = [...overlay.querySelectorAll('[data-report-item-id]:checked')].map(el => parseInt(el.getAttribute('data-report-item-id'), 10)).filter(Number.isFinite);
  const sceneCheckboxes = [...overlay.querySelectorAll('[data-report-scene-id]')];
  let selectedSceneIds = sceneCheckboxes
    .filter(el => el.checked)
    .map(el => parseInt(el.getAttribute('data-report-scene-id'), 10))
    .filter(Number.isFinite);
  if(autoPrint) {
    // PDF exports should default to all scenes when nothing is explicitly selected.
    if(!selectedSceneIds.length) {
      selectedSceneIds = (sceneCheckboxes.length
        ? sceneCheckboxes.map(el => parseInt(el.getAttribute('data-report-scene-id'), 10))
        : (Array.isArray(scenes) ? scenes.map(scene => scene && scene.id) : []))
        .filter(Number.isFinite);
    }
  } else if(!selectedSceneIds.length) {
    selectedSceneIds = (Array.isArray(scenes) && scenes.length > 1)
      ? scenes.map(scene => scene && scene.id).filter(Number.isFinite)
      : [activeSceneId].filter(Number.isFinite);
  }
  const includeStageImage = !!overlay.querySelector('#report-include-stage-image')?.checked;
  const stageOrientation = overlay.querySelector('#report-stage-orientation')?.value === 'vertical' ? 'vertical' : 'horizontal';
  closeReportOptionsDialog();
  openReportWindow({ selectedIds, selectedSceneIds, includeStageImage, stageOrientation }, autoPrint);
}

function getReportItemById(id) {
  return instruments.find(i => i && i.id === id) || null;
}

function getReportPinLabel(instr, pin) {
  const key = pinKey(pin);
  if(!instr) return key;
  if(instr.type === 'di') {
    if(key === 'IO-IN-L') return 'I1';
    if(key === 'IO-IN-R') return 'I2';
    if(key === 'IO-OUT-L') return 'O1';
    if(key === 'IO-OUT-R') return 'O2';
  }
  if(isOutletBox(instr)) {
    const compactMatch = key.match(/^OUTLET-(?:IN|OUT)-(\d+)$/);
    if(compactMatch) {
      const idx = parseInt(compactMatch[1], 10);
      return getOutletPortName(instr, idx);
    }
  }
  if(isSnakeBox(instr)) {
    const canonicalIn = key.match(/^SNAKE-IN-(\d+)$/);
    if(canonicalIn) return String(parseInt(canonicalIn[1], 10));
    const canonicalOut = key.match(/^SNAKE-OUT-(\d+)$/);
    if(canonicalOut) return indexToLetters(parseInt(canonicalOut[1], 10));
    const inMatch = key.match(/^(STAGE-IN|CABLE-OUT)-(\d+)$/);
    if(inMatch) return String(parseInt(inMatch[2], 10));
    const outMatch = key.match(/^(STAGE-OUT|CABLE-IN)-(\d+)$/);
    if(outMatch) return indexToLetters(parseInt(outMatch[2], 10));
  }
  if(isMixerBox(instr)) {
    const mixerIn = key.match(/^MX-IN-(\d+)$/);
    if(mixerIn) return `Input ${parseInt(mixerIn[1], 10)}`;
    const auxIn = key.match(/^MX-AUX-IN-(\d+)$/);
    if(auxIn) return `Input ${getMixerAuxInputDisplayNumber(instr, parseInt(auxIn[1], 10))}`;
    const auxOut = key.match(/^MX-AUX-(\d+)$/);
    if(auxOut) return `Out ${parseInt(auxOut[1], 10)}`;
    const mainOut = key.match(/^MX-MAIN-(\d+)$/);
    if(mainOut) return `Main ${parseInt(mainOut[1], 10) === 1 ? 'L' : 'R'}`;
    const jackOut = key.match(/^MX-JACK-OUT-(\d+)$/);
    if(jackOut) return `Jack Out ${parseInt(jackOut[1], 10)}`;
    const hpOut = key.match(/^MX-HP-(\d+)$/);
    if(hpOut) return `Headphones ${parseInt(hpOut[1], 10)}`;
    const p16 = key.match(/^MX-P16-(\d+)$/);
    if(p16) return `P16 ${parseInt(p16[1], 10)}`;
    const aes50 = key.match(/^MX-AES50-(\d+)$/);
    if(aes50) return `AES50 ${parseInt(aes50[1], 10)}`;
    const usb = key.match(/^MX-USB-(\d+)$/);
    if(usb) return `USB ${parseInt(usb[1], 10)}`;
  }
  return pinForReport(key);
}

function getReportConnectionsForPin(instrId, pin) {
  const key = pinKey(pin);
  const instr = getReportItemById(instrId);
  const matchSnakeAlias = connKey => {
    if(!instr || !isSnakeBox(instr)) return connKey === key;
    const inMatch = key.match(/^SNAKE-IN-(\d+)$/);
    if(inMatch) {
      const idx = parseInt(inMatch[1], 10);
      return connKey === `STAGE-IN-${idx}` || connKey === `CABLE-OUT-${idx}` || connKey === `IN-${idx}`;
    }
    const outMatch = key.match(/^SNAKE-OUT-(\d+)$/);
    if(outMatch) {
      const idx = parseInt(outMatch[1], 10);
      return connKey === `STAGE-OUT-${idx}` || connKey === `CABLE-IN-${idx}` || connKey === `OUT-${idx}`;
    }
    return connKey === key;
  };
  return connections.filter(conn => {
    const fromMatch = conn.fromId === instrId && matchSnakeAlias(pinKey(conn.fromPin));
    const toMatch = conn.toId === instrId && matchSnakeAlias(pinKey(conn.toPin));
    return fromMatch || toMatch;
  });
}

function getReportConnectionForPin(instrId, pin) {
  const matches = getReportConnectionsForPin(instrId, pin);
  return matches.length ? matches[0] : null;
}

function getReportOtherEndpoint(conn, instrId) {
  if(!conn) return null;
  const fromSelf = conn.fromId === instrId;
  const otherId = fromSelf ? conn.toId : conn.fromId;
  const otherPin = fromSelf ? conn.toPin : conn.fromPin;
  const otherInstr = getReportItemById(otherId);
  return otherInstr ? { instr: otherInstr, pin: otherPin, fromSelf } : null;
}

function describeAccessoryChain(instr, sourceConnId, visited = new Set()) {
  if(!instr) return 'Unknown';
  const pinParts = [];
  if(visited.has(instr.id)) return instr.label || instr.name || instr.type || 'Unknown';
  visited.add(instr.id);
  const nextConn = connections.find(conn => conn.id !== sourceConnId && (conn.fromId === instr.id || conn.toId === instr.id));
  if(!nextConn || !isReportAccessory(instr)) {
    return instr.label || instr.name || instr.type || 'Unknown';
  }
  const next = getReportOtherEndpoint(nextConn, instr.id);
  if(!next || !next.instr) return instr.label || instr.name || instr.type || 'Unknown';
  const thisPin = getReportPinLabel(instr, next.fromSelf ? nextConn.fromPin : nextConn.toPin);
  const nextLabel = describeAccessoryChain(next.instr, nextConn.id, visited);
  pinParts.push(instr.label || instr.name || instr.type || 'Unknown');
  if(thisPin) pinParts.push(thisPin);
  if(nextLabel) pinParts.push(nextLabel);
  return pinParts.join(' -> ');
}

function describeReportEndpoint(instr, pin, sourceConnId, visited = new Set()) {
  if(!instr) return 'Unknown';
  const visitKey = `${instr.id}:${pinKey(pin)}`;
  if(visited.has(visitKey)) {
    const fallbackLabel = getReportPinLabel(instr, pin);
    if(!fallbackLabel || fallbackLabel === 'MONO') return instr.label;
    return `${instr.label} ${fallbackLabel}`;
  }
  visited.add(visitKey);

  const pinLabel = getReportPinLabel(instr, pin);
  if(isReportAccessory(instr)) {
    const chain = describeAccessoryChain(instr, sourceConnId, new Set());
    return pinLabel ? `${chain}` : chain;
  }
  if(instr.type === 'drumkit') {
    if(!pinLabel) return instr.label;
    return currentReportDrumKitCount > 1 ? `${instr.label} ${pinLabel}` : pinLabel;
  }

  const base = (!pinLabel || pinLabel === 'MONO') ? instr.label : `${instr.label} ${pinLabel}`;
  if(instr.type !== 'p16' || pinKey(pin) !== 'P16-IN') return base;

  const downstreamPins = ['P16-THRU', 'P16-HP'];
  const downstreamConnections = downstreamPins.map(outputPin => {
    const conn = connections.find(conn => {
      if(conn.id === sourceConnId) return false;
      return (conn.fromId === instr.id && pinKey(conn.fromPin) === outputPin) || (conn.toId === instr.id && pinKey(conn.toPin) === outputPin);
    });
    if(!conn) return null;
    const next = getReportOtherEndpoint(conn, instr.id);
    if(!next || !next.instr) return null;
    const nextLabel = describeReportEndpoint(next.instr, next.pin, conn.id, visited);
    if(!nextLabel) return null;
    return outputPin === 'P16-HP' ? `Headphones -> ${nextLabel}` : nextLabel;
  }).filter(Boolean);

  if(!downstreamConnections.length) return base;
  return `${base} -> ${downstreamConnections.join(' + ')}`;
}

function formatInlineConnectorLabel(label) {
  const text = String(label || 'XLR').trim();
  if(/^jack\b/i.test(text)) return 'Jack';
  return text;
}

function getReportCableHopClass(label) {
  const text = String(label || '').toLowerCase();
  if(text.includes('ethernet')) return 'ethernet';
  if(text.includes('jack') || text.includes('trs') || text.includes('ts')) return 'jack';
  if(text.includes('speakon')) return 'speakon';
  if(text.includes('xlr')) return 'xlr';
  return 'default';
}

function buildConnectionBoxInputConnectorBadgeHTML(instr, pinTone, conn, endpointHTML = '') {
  if(!instr || isSnakeBox(instr)) return '';
  const connectorLabel = (pinTone === 'input' && conn && conn.label)
    ? formatInlineConnectorLabel(conn.label)
    : '';
  if(!connectorLabel) return '';
  if(/report-cable-hop/.test(String(endpointHTML || ''))) return '';
  return ` <span class="report-cable-hop report-cable-hop-${getReportCableHopClass(connectorLabel)}">${escapeHtml(connectorLabel)}</span>`;
}

function getCompactSnakeEndpointLabel(instr, pin, omitMono = false) {
  if(!instr) return 'Unknown';
  const pinLabel = getReportPinLabel(instr, pin);
  if(instr.type === 'drumkit') {
    if(!pinLabel) return instr.label || instr.name || instr.type || 'Unknown';
    return currentReportDrumKitCount > 1
      ? `${instr.label || instr.name || instr.type || 'Unknown'} ${pinLabel}`
      : pinLabel;
  }
  if(!pinLabel || pinLabel === 'MONO' || (omitMono && pinLabel === 'MONO')) return instr.label || instr.name || instr.type || 'Unknown';
  return `${instr.label || instr.name || instr.type || 'Unknown'} ${pinLabel}`;
}

function describeInlineAccessoryRouteHTML(instr, inboundConn, pin, visited = new Set()) {
  if(!instr || !inboundConn) return escapeHtml('Unknown');
  if(visited.has(instr.id)) return escapeHtml(getCompactSnakeEndpointLabel(instr, pin, true));
  visited.add(instr.id);

  const inboundHopClass = getReportCableHopClass(inboundConn.label);
  const parts = [`<span class="report-cable-hop report-cable-hop-${inboundHopClass}">${escapeHtml(formatInlineConnectorLabel(inboundConn.label))}</span> ${escapeHtml(instr.label || instr.name || instr.type || 'Unknown')}`];
  const nextConn = connections.find(conn => conn.id !== inboundConn.id && (conn.fromId === instr.id || conn.toId === instr.id));
  if(!nextConn) return parts.join(' -> ');

  const next = getReportOtherEndpoint(nextConn, instr.id);
  if(!next || !next.instr) return parts.join(' -> ');
  if(isReportAccessory(next.instr)) {
    parts.push(describeInlineAccessoryRouteHTML(next.instr, nextConn, next.pin, visited));
    return parts.join(' -> ');
  }

  const nextHopClass = getReportCableHopClass(nextConn.label);
  parts.push(`<span class="report-cable-hop report-cable-hop-${nextHopClass}">${escapeHtml(formatInlineConnectorLabel(nextConn.label))}</span> ${escapeHtml(getCompactSnakeEndpointLabel(next.instr, next.pin, true))}`);
  return parts.join(' -> ');
}

function describeAttachedAccessoryChain(instr, pin) {
  if(!instr || !hasAttachedAccessory(instr)) return '';
  const label = getAttachedAccessoryLabel(instr.attachedAccessoryType);
  const pinLabel = getReportPinLabel(instr, pin);
  const endpoint = (!pinLabel || pinLabel === 'MONO')
    ? (instr.label || instr.name || instr.type || 'Unknown')
    : `${instr.label || instr.name || instr.type || 'Unknown'} ${pinLabel}`;
  return `${label} -> ${endpoint}`;
}

function buildAttachedAccessoryRouteHTML(instr, pin, endpointHTML) {
  if(!instr || !hasAttachedAccessory(instr)) return endpointHTML;
  const typeLabel = getAttachedAccessoryLabel(instr.attachedAccessoryType);
  const pinId = pinKey(pin);
  const outputCableLabel = formatInlineConnectorLabel(getCableTypeLabel(normalizeAttachedAccessoryCableType(instr.attachedAccessoryOutputCableType || instr.attachedAccessoryCableType)));
  const outputHopClass = getReportCableHopClass(outputCableLabel);
  if(normalizeAttachedAccessoryType(instr.attachedAccessoryType) === 'di') {
    const diPort = instr.attachedAccessoryStereo ? (pinId === 'R' ? '2' : '1') : '';
    const diLabel = diPort ? `${typeLabel} ${diPort}` : typeLabel;
    return `${escapeHtml(diLabel)} -> <span class="report-cable-hop report-cable-hop-${outputHopClass}">${escapeHtml(outputCableLabel)}</span> ${endpointHTML}`;
  }
  return `${escapeHtml(typeLabel)} -> <span class="report-cable-hop report-cable-hop-${outputHopClass}">${escapeHtml(outputCableLabel)}</span> ${endpointHTML}`;
}

function getReportRelevantConnections(selectedIds, hasSelection) {
  if(!hasSelection) return [...connections];
  const byId = new Map(instruments.map(instr => [instr.id, instr]));
  const included = new Map();
  const queuedAccessoryIds = new Set();
  const accessoryQueue = [];

  const includeConnection = conn => {
    if(!conn || included.has(conn.id)) return;
    included.set(conn.id, conn);
    [conn.fromId, conn.toId].forEach(id => {
      const instr = byId.get(id);
      if(instr && isReportAccessory(instr) && !queuedAccessoryIds.has(id)) {
        queuedAccessoryIds.add(id);
        accessoryQueue.push(id);
      }
    });
  };

  connections.forEach(conn => {
    if(selectedIds.has(conn.fromId) || selectedIds.has(conn.toId)) includeConnection(conn);
  });

  while(accessoryQueue.length) {
    const accessoryId = accessoryQueue.shift();
    connections.forEach(conn => {
      if(conn.fromId === accessoryId || conn.toId === accessoryId) includeConnection(conn);
    });
  }

  return [...included.values()];
}

function getSnakeReportPinGroups(instr) {
  const channelCount = Math.max(0, Number(instr.snakeChannels) || 0);
  const outputCount = Math.max(0, Number(instr.snakeOutputs) || 0);
  return [
    {
      title: 'Inputs',
      pins: Array.from({ length: channelCount }, (_v, idx) => ({ key: `SNAKE-IN-${idx + 1}` })),
    },
    {
      title: 'Outputs',
      pins: Array.from({ length: outputCount }, (_v, idx) => ({ key: `SNAKE-OUT-${idx + 1}` })),
    },
  ];
}

function getMixerReportPinGroups(instr) {
  const groups = [];
  const breakdown = getMixerInputBreakdown(instr);
  let inputIndex = 1;
  if(breakdown.xlrOnly > 0) {
    groups.push({
      title: 'Inputs (XLR)',
      pins: Array.from({ length: breakdown.xlrOnly }, (_v, idx) => ({ key: `MX-IN-${inputIndex + idx}` })),
    });
    inputIndex += breakdown.xlrOnly;
  }
  if(breakdown.combo > 0) {
    groups.push({
      title: 'Inputs (Combo)',
      pins: Array.from({ length: breakdown.combo }, (_v, idx) => ({ key: `MX-IN-${inputIndex + idx}` })),
    });
    inputIndex += breakdown.combo;
  }
  if(breakdown.auxInputs > 0) {
    groups.push({
      title: 'Inputs (Aux Jack)',
      pins: Array.from({ length: breakdown.auxInputs }, (_v, idx) => ({ key: `MX-AUX-IN-${idx + 1}` })),
    });
  }

  const outputGroups = [];
  const auxCount = Math.max(0, Number(instr.mixerAux) || 0);
  if(auxCount > 0) {
    outputGroups.push({
      title: instr.cat === 'stageboxes' ? 'Stage Outputs' : 'Outputs (XLR)',
      pins: Array.from({ length: auxCount }, (_v, idx) => ({ key: `MX-AUX-${idx + 1}` })),
    });
  }
  const mainCount = ['x32', 'x32compact', 'x32rack', 'wing', 'wingcompact', 'wingrack', 's32', 's16'].includes(instr.type) ? 0 : Math.max(0, Number(instr.mixerMain) || 0);
  if(mainCount > 0) {
    outputGroups.push({
      title: 'Main Outputs',
      pins: Array.from({ length: mainCount }, (_v, idx) => ({ key: `MX-MAIN-${idx + 1}` })),
    });
  }
  const jackCount = Math.max(0, Number(instr.mixerJackOut) || 0);
  if(jackCount > 0) {
    outputGroups.push({
      title: 'Outputs (Jack)',
      pins: Array.from({ length: jackCount }, (_v, idx) => ({ key: `MX-JACK-OUT-${idx + 1}` })),
    });
  }

  const systemPins = [];
  const p16Count = Math.max(0, Number(instr.mixerP16) || 0);
  const aes50Count = Math.max(0, Number(instr.mixerAes50) || 0);
  const hpCount = hasMixerHeadphonePort(instr) ? 1 : 0;
  const usbCount = hasMixerUsbPort(instr) ? 1 : 0;
  if(p16Count > 0) {
    systemPins.push(...Array.from({ length: p16Count }, (_v, idx) => ({ key: `MX-P16-${idx + 1}` })));
  }
  if(aes50Count > 0) {
    systemPins.push(...Array.from({ length: aes50Count }, (_v, idx) => ({ key: `MX-AES50-${idx + 1}` })));
  }
  if(hpCount > 0) {
    systemPins.push(...Array.from({ length: hpCount }, (_v, idx) => ({ key: `MX-HP-${idx + 1}` })));
  }
  if(usbCount > 0) {
    systemPins.push(...Array.from({ length: usbCount }, (_v, idx) => ({ key: `MX-USB-${idx + 1}` })));
  }
  if(systemPins.length > 0) {
    outputGroups.push({ title: 'System', pins: systemPins });
  }

  return [...groups, ...outputGroups];
}

function getReportPinGroups(instr) {
  if(!instr) return [];
  if(isOutletBox(instr)) {
    const ports = normalizeOutletPortCount(instr.outletPorts, instr);
    return [{ title: 'Connected Ports', pins: Array.from({ length: ports }, (_v, idx) => ({ key: getOutletPortVisibleKey(instr, idx + 1) })) }];
  }
  if(isSnakeBox(instr)) return getSnakeReportPinGroups(instr);
  if(isMixerBox(instr)) return getMixerReportPinGroups(instr);
  const validPins = getValidPinsForInstrument(instr);
  if(!validPins) return [];
  return [{ title: 'Pins', pins: [...validPins].map(key => ({ key })) }];
}

function getOutletPortConnection(instr, portIndex) {
  if(!instr || !isOutletBox(instr)) return null;
  const key = getOutletPortVisibleKey(instr, portIndex);
  return connections.find(conn => (
    (conn.fromId === instr.id && pinKey(conn.fromPin) === key) ||
    (conn.toId === instr.id && pinKey(conn.toPin) === key)
  )) || null;
}

function buildOutletReportLines(instr) {
  if(!instr || !isOutletBox(instr)) return '';
  const ports = normalizeOutletPortCount(instr.outletPorts, instr);
  const groups = new Map();
  const preferredOrder = ['ethernet', 'xlr', 'speakon', 'ts', 'trs'];

  for(let i=1;i<=ports;i++) {
    const conn = getOutletPortConnection(instr, i);
    if(!conn) continue;
    const visibleKey = getOutletPortVisibleKey(instr, i);
    const cableType = getOutletPortCableTypeForPin(instr, visibleKey);
    const other = getReportOtherEndpoint(conn, instr.id);
    const otherText = other && other.instr
      ? describeReportEndpoint(other.instr, other.pin, conn.id)
      : 'Not connected';
    const rawName = getOutletPortName(instr, i);
    const name = escapeHtml(rawName);
    const modeLabel = escapeHtml(getOutletPortVisibleLabel(instr, i));
    const showModeLabel = !outletPortNameIncludesType(rawName);
    const pinTone = visibleKey.startsWith('OUTLET-IN-') ? 'input' : 'output';
    const line = `<div class="report-pin-line compact">
      <div class="report-pin-main"><span class="report-inline-key report-pin-tone-input">${name}</span>${showModeLabel ? ` - ${modeLabel}` : ''}: ${buildReportEndpointLabelHTML(other && other.instr, other && other.pin, otherText)}</div>
    </div>`;
    if(!groups.has(cableType)) groups.set(cableType, []);
    groups.get(cableType).push(line.replace('report-pin-tone-input', `report-pin-tone-${pinTone}`));
  }
  if(!groups.size) return '';

  const sortedTypes = [...groups.keys()].sort((a, b) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);
    if(ai === -1 && bi === -1) return a.localeCompare(b);
    if(ai === -1) return 1;
    if(bi === -1) return -1;
    return ai - bi;
  });

  return sortedTypes.map(type => {
    const title = `${escapeHtml(getCableTypeLabel(type))} Ports`;
    const lines = groups.get(type) || [];
    return `<div class="report-pin-group"><div class="report-pin-group-title">${title}</div><div class="report-pin-list">${lines.join('')}</div></div>`;
  }).join('');
}

function getOutletPortIndexFromPin(pin) {
  const match = String(pinKey(pin) || '').match(/^OUTLET-(?:IN|OUT)-(\d+)$/);
  return match ? (parseInt(match[1], 10) || 0) : 0;
}

function buildBundledOutletReportCards(reportConnections) {
  const grouped = new Map();

  (reportConnections || []).forEach(conn => {
    const sides = [
      { id: conn.fromId, pin: conn.fromPin },
      { id: conn.toId, pin: conn.toPin },
    ];

    sides.forEach(side => {
      const outletInstr = instruments.find(i => i && i.id === side.id);
      if(!outletInstr || !isOutletBox(outletInstr)) return;

      const outletPin = pinKey(side.pin);
      const cableType = getOutletPortCableTypeForPin(outletInstr, outletPin);
      const portIndex = getOutletPortIndexFromPin(outletPin);
      const rawPortName = getOutletPortName(outletInstr, portIndex || 1);
      const modeLabel = getOutletPortVisibleLabel(outletInstr, portIndex || 1);
      const modeLabelLower = String(modeLabel || '').toLowerCase();
      const hideImplicitEthernetLabel = modeLabelLower === 'ethernet' || modeLabelLower === 'ethernet in';
      const showModeLabel = !outletPortNameIncludesType(rawPortName) && !hideImplicitEthernetLabel;
      const pinTone = outletPin.startsWith('OUTLET-IN-') ? 'input' : 'output';
      const outletLabel = outletInstr.label || outletInstr.name || outletInstr.type || 'Outlet';

      const other = getReportOtherEndpoint(conn, outletInstr.id);
      const otherText = other && other.instr
        ? describeReportEndpoint(other.instr, other.pin, conn.id)
        : 'Not connected';
      const endpointHTML = buildReportEndpointLabelHTML(other && other.instr, other && other.pin, otherText);

      const line = `<div class="report-pin-line compact">
        <div class="report-pin-main"><span class="report-inline-key report-pin-tone-${pinTone}">${escapeHtml(rawPortName)}</span>${showModeLabel ? ` - ${escapeHtml(modeLabel)}` : ''} ${endpointHTML}</div>
      </div>`;

      if(!grouped.has(cableType)) grouped.set(cableType, []);
      grouped.get(cableType).push({
        html: line,
        sortKey: `${String(rawPortName || '').toLowerCase()}|${String(outletLabel || '').toLowerCase()}|${String(otherText || '').toLowerCase()}`,
      });
    });
  });

  if(!grouped.size) return '';

  const sortedTypes = [...grouped.keys()].sort((a, b) => getCableTypeLabel(a).localeCompare(getCableTypeLabel(b), undefined, { sensitivity: 'base' }));
  return sortedTypes.map(type => {
    const entries = (grouped.get(type) || [])
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey, undefined, { sensitivity: 'base', numeric: true }));

    const columnCount = Math.min(3, Math.max(1, entries.length));
    const baseSize = Math.floor(entries.length / columnCount);
    const remainder = entries.length % columnCount;
    let start = 0;
    const columns = [];

    for(let index = 0; index < columnCount; index++) {
      const size = baseSize + (index < remainder ? 1 : 0);
      const columnEntries = entries.slice(start, start + size);
      columns.push(`<div class="report-pin-column">${columnEntries.map(entry => entry.html).join('')}</div>`);
      start += size;
    }

    return `
      <article class="report-item-card outlet-card">
        <div class="report-item-head">
          <div>
            <h3>${escapeHtml(getCableTypeLabel(type))} Outlets</h3>
            <div class="report-item-sub">Bundled outlet connections by connector type</div>
          </div>
          <div class="report-item-pill">accessories</div>
        </div>
        <div class="report-pin-group">
          <div class="report-pin-group-title">${escapeHtml(getCableTypeLabel(type))} Ports</div>
          <div class="report-pin-columns" style="grid-template-columns:repeat(${columnCount},minmax(0,1fr));">
            ${columns.join('')}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function buildReportPinLine(instr, pin, notePrefix = '') {
  const pinConnections = getReportConnectionsForPin(instr.id, pin);
  const pinLabel = getReportPinLabel(instr, pin);
  const pinTone = getReportPinTone(instr, pin);
  if(!pinConnections.length) return '';

  if(instr && (isSnakeBox(instr) || isMixerBox(instr) || isStageboxBox(instr))) {
    return pinConnections.map(conn => {
      const other = getReportOtherEndpoint(conn, instr.id);
      const otherText = other && other.instr ? describeReportEndpoint(other.instr, other.pin, conn.id) : 'Unknown';
      const hasVirtualAccessory = !!(other && other.instr && hasAttachedAccessory(other.instr) && !isReportAccessory(other.instr));
      const directMicModel = other && other.instr ? getPinMicNote(other.instr, other.pin) : '';
      let destinationHTML = other && other.instr && isReportAccessory(other.instr)
        ? describeInlineAccessoryRouteHTML(other.instr, conn, other.pin, new Set())
        : buildReportEndpointLabelHTML(other && other.instr, other && other.pin, otherText);
      if(!isReportAccessory(other && other.instr) && hasVirtualAccessory) {
        destinationHTML = buildAttachedAccessoryRouteHTML(other.instr, other.pin, destinationHTML);
      }
      const endpointParts = splitReportEndpointMicHTML(destinationHTML);
      const micModel = directMicModel || endpointParts.micLabel;
      const connectorBadge = buildConnectionBoxInputConnectorBadgeHTML(instr, pinTone, conn, endpointParts.cleanHTML);
      const keyMarkup = `<span class="report-inline-key report-pin-tone-${pinTone}">${escapeHtml(pinLabel)}</span>`;
      const hasMic = !!micModel;
      const micLine = hasMic
        ? `<div class="report-pin-mic-line">Mic: ${escapeHtml(micModel)}</div>`
        : '';
      const lineClass = hasMic ? 'report-pin-line compact report-pin-line-split' : 'report-pin-line compact report-pin-line-split report-pin-no-mic';
      const routePrefix = connectorBadge ? `${connectorBadge} -> ` : '';
      return `<div class="${lineClass}"><div class="report-pin-key-slot">${keyMarkup}</div><div class="report-pin-main">${routePrefix}${endpointParts.cleanHTML}</div>${micLine}</div>`;
    }).join('');
  }

  const micNote = getPinMicNote(instr, pin);
  const extraNote = [notePrefix, micNote ? `Mic: ${micNote}` : ''].filter(Boolean).join(' | ');
  return pinConnections.map(conn => {
    const other = getReportOtherEndpoint(conn, instr.id);
    const otherText = other && other.instr ? describeReportEndpoint(other.instr, other.pin, conn.id) : 'Unknown';
    const hasVirtualAccessory = !!(other && other.instr && hasAttachedAccessory(other.instr) && !isReportAccessory(other.instr));
    const accessoryHint = other && other.instr && isReportAccessory(other.instr)
      ? `<div class="report-pin-note">Middle accessory path: ${escapeHtml(describeAccessoryChain(other.instr, conn.id, new Set()))}</div>`
      : (hasVirtualAccessory
        ? `<div class="report-pin-note">Middle accessory path: ${escapeHtml(describeAttachedAccessoryChain(other.instr, other.pin))}</div>`
        : '');
    let endpointHTML = buildReportEndpointLabelHTML(other && other.instr, other && other.pin, otherText);
    if(hasVirtualAccessory) endpointHTML = buildAttachedAccessoryRouteHTML(other.instr, other.pin, endpointHTML);
    return `<div class="report-pin-line">
      <div class="report-pin-key report-pin-tone-${pinTone}">${escapeHtml(pinLabel)}</div>
      <div class="report-pin-main">${endpointHTML}</div>
      <div class="report-pin-meta">${escapeHtml(conn.label || 'Cable')}${extraNote ? ` | ${escapeHtml(extraNote)}` : ''}</div>
      ${accessoryHint}
    </div>`;
  }).join('');
}

function buildReportEndpointLabelHTML(instr, pin, baseText) {
  const labelHTML = escapeHtml(String(baseText || 'Unknown'));
  if(!instr) return labelHTML;
  const micModel = getPinMicNote(instr, pin);
  if(!micModel) return labelHTML;
  return `${labelHTML} <span class="report-mic-inline">(${escapeHtml(micModel)})</span>`;
}

function splitReportEndpointMicHTML(html) {
  const source = String(html || '');
  if(!source) return { cleanHTML: '', micLabel: '' };
  let micLabel = '';
  const cleanHTML = source.replace(/\s*<span class="report-mic-inline">\(([^<]+)\)<\/span>/i, (_all, rawMic) => {
    micLabel = String(rawMic || '').trim();
    return '';
  });
  return { cleanHTML, micLabel };
}

function getReportPinTone(instr, pin) {
  const key = pinKey(pin);
  if(!key) return 'default';

  if(instr && isOutletBox(instr)) {
    return key.startsWith('OUTLET-IN-') ? 'input' : 'output';
  }

  if(instr && isSnakeBox(instr)) {
    if(key.startsWith('SNAKE-IN-') || key.startsWith('STAGE-IN-') || key.startsWith('CABLE-IN-')) return 'input';
    if(key.startsWith('SNAKE-OUT-') || key.startsWith('STAGE-OUT-') || key.startsWith('CABLE-OUT-')) return 'output';
    return 'default';
  }

  if(key.startsWith('MX-IN-') || key.startsWith('MX-AUX-IN-')) return 'input';
  if(key === 'P16-IN') return 'input';
  if(key === 'P16D-IN' || key.startsWith('ROUTER-LAN-')) return 'input';
  if(key.startsWith('P16D-OUT-')) return 'output';
  if(key === 'P16-THRU' || key === 'P16-HP') return 'output';
  if(key.startsWith('MX-AUX-') || key.startsWith('MX-MAIN-') || key.startsWith('MX-JACK-OUT-') || key.startsWith('MX-HP-')) return 'output';
  if(key.startsWith('MX-P16-') || key.startsWith('MX-AES50-') || key.startsWith('MX-USB-')) return 'other';
  return 'default';
}

function getReportStageBounds() {
  const reportItems = instruments.filter(instr => !shouldHideWirelessReceiver(instr)).map(getReportSnapshotInstrument);
  const points = [
    { left: stagePx.left, top: stagePx.top, right: stagePx.left + stagePx.width, bottom: stagePx.top + stagePx.height },
  ];
  stageParts.forEach(part => {
    const partWidth = Math.max(24, Math.max(0.5, Number(part.widthM) || 1) * pxPerM);
    const partDepth = Math.max(24, Math.max(0.5, Number(part.depthM) || 1) * pxPerM);
    points.push({ left: part.x, top: part.y, right: part.x + partWidth, bottom: part.y + partDepth });
  });
  reportItems.forEach(item => {
    points.push({ left: item.worldX, top: item.worldY, right: item.worldX + item.width + 8, bottom: item.worldY + item.height + 12 });
  });
  const left = Math.max(0, Math.min(...points.map(p => p.left)) - 24);
  const top = Math.max(0, Math.min(...points.map(p => p.top)) - 24);
  const right = Math.max(...points.map(p => p.right)) + 24;
  const bottom = Math.max(...points.map(p => p.bottom)) + 24;
  return { left, top, right, bottom };
}

function getReportSnapshotInstrument(instr) {
  const liveEl = getEl(instr.id);
  const liveBody = liveEl ? liveEl.querySelector('.ib') : null;
  const fallback = getInstrumentBodyDimensionsPx(instr);
  const boxKind = getConnectionBoxKind(instr);
  const collapsedHeightFactor = boxKind === 'snake' ? 0.46 : (boxKind === 'outlet' ? 0.62 : 0.42);
  const collapsedMin = boxKind === 'snake' ? 28 : (boxKind === 'outlet' ? 26 : 30);
  const fallbackHeight = (boxKind && instr && instr.collapsed)
    ? Math.round(Math.max(collapsedMin, fallback.height * collapsedHeightFactor))
    : fallback.height;
  const width = (liveBody && liveBody.offsetWidth > 0)
    ? liveBody.offsetWidth
    : fallback.width;
  const height = (liveBody && liveBody.offsetHeight > 0)
    ? liveBody.offsetHeight
    : fallbackHeight;
  const attachedAccessory = getAttachedAccessoryIcon(instr);
  const micStandCount = getMicStandCount(instr);
  return {
    id: instr.id,
    worldX: instr.x,
    worldY: instr.y,
    width,
    height,
    angle: parseInt(instr.angle || 0, 10) || 0,
    label: getVisibleInstrumentLabel(instr) || instr.name || instr.type,
    name: instr.name || instr.type,
    type: instr.type,
    cat: instr.cat,
    image: getEffectiveInstrumentImage(instr) || '',
    icon: instr.icon || 'â€¢',
    micStandCount,
    micStandImage: micStandCount > 0 ? MIC_STAND_IMAGE_PATH : '',
    hasAccessory: !!attachedAccessory,
    accessoryImage: attachedAccessory && attachedAccessory.image ? attachedAccessory.image : '',
    accessoryEmoji: attachedAccessory && !attachedAccessory.image ? attachedAccessory.emoji : '',
    isStand: isStandType(instr),
    isSnake: !!isSnakeBox(instr),
    isMixer: !!isMixerBox(instr),
    collapsed: !!instr.collapsed,
    mixerInputs: Math.max(0, Number(instr.mixerInputs) || 0),
    mixerInputXlrOnly: Math.max(0, Number(instr.mixerInputXlrOnly) || 0),
    mixerInputCombo: Math.max(0, Number(instr.mixerInputCombo) || 0),
    mixerInputJackOnly: Math.max(0, Number(instr.mixerInputJackOnly) || 0),
    mixerAux: Math.max(0, Number(instr.mixerAux) || 0),
    mixerMain: Math.max(0, Number(instr.mixerMain) || 0),
    mixerJackOut: Math.max(0, Number(instr.mixerJackOut) || 0),
    mixerP16: Math.max(0, Number(instr.mixerP16) || 0),
    mixerAes50: Math.max(0, Number(instr.mixerAes50) || 0),
    connectionBoxKind: inferConnectionBoxKind(instr) || '',
    outletPorts: normalizeOutletPortCount(instr.outletPorts, instr, isRouterOutletType(instr) ? 4 : 2),
    outletViewMode: normalizeOutletViewMode(instr.outletViewMode, 'outlet'),
    outletPortModes: normalizeOutletPortModes(instr.outletPortModes, normalizeOutletPortCount(instr.outletPorts, instr, isRouterOutletType(instr) ? 4 : 2)),
    outletPortNames: normalizeOutletPortNames(instr.outletPortNames, normalizeOutletPortCount(instr.outletPorts, instr, isRouterOutletType(instr) ? 4 : 2), instr),
    outletConnectorType: normalizeOutletConnectorType(instr.outletConnectorType || 'ethernet'),
    snakeStageMode: getSnakeViewMode(instr) !== 'output',
    snakeChannels: Math.max(1, parseInt(instr.snakeChannels, 10) || 16),
    snakeOutputs: Math.max(0, parseInt(instr.snakeOutputs, 10) || 0),
    color: isOutletBox(instr)
      ? '#f3f4f6'
      : (isSnakeBox(instr)
      ? '#f3ecff'
      : (isStageboxBox(instr)
        ? '#eaf8f0'
        : (getConnectionBoxKind(instr) === 'mixer'
          ? '#e8f2ff'
          : (instr.cat === 'monitoring' ? '#fff5e8' : '#ffffff')))),
    stroke: isOutletBox(instr)
      ? '#9ca3af'
      : (isSnakeBox(instr)
      ? '#ab79d8'
      : (isStageboxBox(instr)
        ? '#4da97f'
        : (getConnectionBoxKind(instr) === 'mixer'
          ? '#7aaed9'
          : (instr.cat === 'monitoring' ? '#c98b3f' : '#c7d0db')))),
    labelColor: '#102033',
  };
}

function getReportSnapshotConnectionPoint(instr, reportItem, pin) {
  if(!instr || !reportItem) return null;
  // For regular instruments, keep report cables anchored to item center.
  if(!isConnectionBoxInstrument(instr) && !isOutletBox(instr)) {
    return {
      x: reportItem.worldX + (reportItem.width / 2),
      y: reportItem.worldY + (reportItem.height / 2),
    };
  }
  const livePoint = getReportWorldCenterForPin(instr.id, pin || null);
  if(livePoint) return livePoint;
  return {
    x: reportItem.worldX + (reportItem.width / 2),
    y: reportItem.worldY + (reportItem.height / 2),
  };
}

function resolveReportAssetUrl(src) {
  const value = String(src || '').trim();
  if(!value) return '';
  if(/^(data:|blob:|https?:|file:)/i.test(value)) return value;
  try {
    return new URL(value, window.location.href).href;
  } catch(_err) {
    return value;
  }
}

function absolutizeImageSourcesInHTML(html) {
  const source = String(html || '');
  if(!source) return source;
  return source.replace(/src\s*=\s*"([^"]+)"/gi, (_m, rawSrc) => {
    const abs = resolveReportAssetUrl(rawSrc);
    const safe = String(abs || '').replace(/"/g, '%22');
    return `src="${safe}"`;
  });
}

function formatReportDistanceMeters(value) {
  const num = Number(value);
  if(!Number.isFinite(num)) return '0';
  return Number.isInteger(num) ? String(num) : num.toFixed(2).replace(/\.?0+$/, '');
}

function getReportStagePartDimsLabel(part) {
  if(!part) return '';
  return `${formatReportDistanceMeters(part.widthM)}m Ã— ${formatReportDistanceMeters(part.depthM)}m`;
}

function buildReportStageSvg(orientation) {
  const bounds = getReportStageBounds();
  const width = Math.max(1, bounds.right - bounds.left);
  const height = Math.max(1, bounds.bottom - bounds.top);
  const viewBox = `0 0 ${width} ${height}`;
  const stageX = stagePx.left - bounds.left;
  const stageY = stagePx.top - bounds.top;
  const stageWpx = stagePx.width;
  const stageHpx = stagePx.height;
  const stageBorder = getStageBorderColor(stageColor);
  const stageLabelX = stageX + (stageWpx / 2);
  const stageLabelY = stageY + 18;

  const stagePartSvg = stageParts.map(part => {
    const partW = Math.max(24, Math.max(0.5, Number(part.widthM) || 1) * pxPerM);
    const partD = Math.max(24, Math.max(0.5, Number(part.depthM) || 1) * pxPerM);
    const partX = part.x - bounds.left;
    const partY = part.y - bounds.top;
    const x = partX.toFixed(2);
    const y = partY.toFixed(2);
    const fill = /^#[0-9a-fA-F]{6}$/.test(String(part.color || '')) ? part.color : '#7da7c8';
    const label = escapeHtml(part.label || 'Stage');
    const dimsLabel = escapeHtml(getReportStagePartDimsLabel(part));
    const hasSteps = part.shape === 'rect' && (!!part.hasSteps || String(part.label || '').trim().toUpperCase() === 'STAIRS');
    const stepLines = hasSteps
      ? (() => {
        const lines = [];
        const startY = partY + 6;
        const endY = partY + partD - 4;
        for(let lineY = startY; lineY <= endY; lineY += 7) {
          lines.push(`<line x1="${(partX + 2).toFixed(2)}" y1="${lineY.toFixed(2)}" x2="${(partX + partW - 2).toFixed(2)}" y2="${lineY.toFixed(2)}" stroke="rgba(10,11,13,.22)" stroke-width="2" />`);
        }
        return lines.join('');
      })()
      : '';
    const partShape = part.shape === 'circle'
      ? `<circle cx="${(partX + partW / 2).toFixed(2)}" cy="${(partY + partD / 2).toFixed(2)}" r="${Math.min(partW, partD) / 2}" fill="${fill}" stroke="rgba(10,11,13,.45)" stroke-width="2" />`
      : `<rect x="${x}" y="${y}" width="${partW.toFixed(2)}" height="${partD.toFixed(2)}" rx="8" ry="8" fill="${fill}" stroke="rgba(10,11,13,.45)" stroke-width="2" />`;
    const labelX = partX + (partW / 2);
    const labelY = partY + (partD / 2) + 1;
    const dimsY = labelY + 10;
    const clipId = `report-part-steps-${part.id}`;
    const stepOverlay = hasSteps
      ? `<clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${partW.toFixed(2)}" height="${partD.toFixed(2)}" rx="8" ry="8" /></clipPath><g clip-path="url(#${clipId})">${stepLines}</g>`
      : '';
    return `<g>${partShape}${stepOverlay}<text x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}" text-anchor="middle" font-family="Share Tech Mono, monospace" font-size="10" fill="#ffffff" opacity=".94">${label}</text><text x="${labelX.toFixed(2)}" y="${dimsY.toFixed(2)}" text-anchor="middle" font-family="Share Tech Mono, monospace" font-size="8" fill="#ffffff" opacity=".9">${dimsLabel}</text></g>`;
  }).join('');

  const instrumentSvg = instruments.map(instr => {
    const body = getInstrumentBodyDimensionsPx(instr);
    const angle = parseInt(instr.angle || 0, 10) || 0;
    const cx = instr.x - bounds.left + (body.width / 2);
    const cy = instr.y - bounds.top + (body.height / 2);
    const openGroup = angle ? `<g transform="rotate(${angle} ${cx.toFixed(2)} ${cy.toFixed(2)})">` : '<g>';
    const x = (instr.x - bounds.left).toFixed(2);
    const y = (instr.y - bounds.top).toFixed(2);
    const w = body.width.toFixed(2);
    const h = body.height.toFixed(2);
    const title = escapeHtml(instr.label || instr.name || instr.type);
    const fill = isOutletBox(instr)
      ? '#f3f4f6'
      : (isSnakeBox(instr)
      ? '#f3ecff'
      : (isStageboxBox(instr)
        ? '#eaf8f0'
        : (getConnectionBoxKind(instr) === 'mixer'
          ? '#e8f2ff'
          : (instr.cat === 'monitoring' ? '#fff5e8' : '#ffffff'))));
    const stroke = isOutletBox(instr)
      ? '#9ca3af'
      : (isSnakeBox(instr)
      ? '#ab79d8'
      : (isStageboxBox(instr)
        ? '#4da97f'
        : (getConnectionBoxKind(instr) === 'mixer'
          ? '#7aaed9'
          : (instr.cat === 'monitoring' ? '#c98b3f' : '#c7d0db'))));
    const image = getEffectiveInstrumentImage(instr);
    const standOnly = isStandType(instr);

    if(isConnectionBoxInstrument(instr)) {
      const liveScale = getRackUIScale(Math.max(1, Math.round(body.width)), 80);
      const liveMarkup = absolutizeImageSourcesInHTML(instr.collapsed
        ? buildCollapsedConnectionBoxHTML(instr, Math.max(1, Math.round(body.width)))
        : buildConnectionBoxHTML(instr, Math.max(1, Math.round(body.width))));
      return `${openGroup}<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">
        <div xmlns="http://www.w3.org/1999/xhtml" class="report-stage-live report-stage-live-connbox" style="--rack-ui-scale:${liveScale};">${liveMarkup}</div>
      </foreignObject></g>`;
    }

    const resolvedImage = resolveReportAssetUrl(image);
    const imageSvg = resolvedImage ? `<image href="${escapeHtml(resolvedImage)}" x="${(instr.x - bounds.left + 8).toFixed(2)}" y="${(instr.y - bounds.top + 8).toFixed(2)}" width="${Math.max(24, body.width - 16).toFixed(2)}" height="${Math.max(24, body.height - 24).toFixed(2)}" preserveAspectRatio="xMidYMid meet" />` : `<text x="${(instr.x - bounds.left + body.width / 2).toFixed(2)}" y="${(instr.y - bounds.top + body.height / 2).toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-family="Share Tech Mono, monospace" font-size="18" fill="#17324f">${escapeHtml(instr.icon || 'â€¢')}</text>`;
    const labelTextY = (instr.y - bounds.top + body.height - 6).toFixed(2);
    const labelX = (instr.x - bounds.left + body.width / 2).toFixed(2);
    const insideLabelSvg = `
      <text x="${labelX}" y="${labelTextY}" text-anchor="middle" font-family="Barlow, sans-serif" font-size="8" font-weight="600" fill="#0a0b0d" stroke="#ffffff" stroke-width="2.1" paint-order="stroke fill">${title}</text>
    `;
    if(standOnly) {
      return `${openGroup}
        ${imageSvg}
      </g>`;
    }
    return `${openGroup}
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="2.2" />
      ${imageSvg}
      ${insideLabelSvg}
    </g>`;
  }).join('');

  const foreignObjectStyle = `
    .report-stage-live{width:100%;height:100%;overflow:visible;}
    .report-stage-live .ib{background:#edf5fb;border:1.5px solid #7aaed9;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:none;position:relative;flex-shrink:0;overflow:visible;}
    .report-stage-live .ib.outlet-mode{background:#f3f4f6;border-color:#9ca3af;border-radius:5px;}
    .report-stage-live .ib.is-snake{background:#f3ecff;border-color:#ab79d8;}
    .report-stage-live .ib.is-stagebox,.report-stage-live .ib.stagebox-mode{background:#eaf8f0;border-color:#4da97f;}
    .report-stage-live .ib.monitoring-mode{background:#ffe9e9;border-color:#cf6f6f;}
    .report-stage-live .ib-label{position:absolute;left:50%;bottom:2px;transform:translateX(-50%);max-width:calc(100% - 8px);font-size:8px;color:#ffffff;font-weight:600;text-align:center;white-space:nowrap;background:rgba(7,13,25,.9);padding:1px 4px;border-radius:3px;overflow:hidden;text-overflow:ellipsis;z-index:3;pointer-events:none;}
    .report-stage-live .ib-label.inside-top{top:2px;bottom:auto;}
    .report-stage-live .icon-img{width:82%;height:82%;object-fit:contain;display:block;filter:drop-shadow(0 1px 1px rgba(0,0,0,.3));pointer-events:none;user-select:none;-webkit-user-drag:none;}
    .report-stage-live .mixer-row-label{font-size:8px;font-family:'Share Tech Mono',monospace;line-height:1;color:#5d6b7d;margin-top:2px;text-align:center;}
    .report-stage-live .connbox-pin-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:7px;width:100%;max-width:194px;margin:5px auto 0;justify-items:center;}
    .report-stage-live .connbox-pin{width:16px;height:16px;border-radius:50%;border:1.5px solid #1f6fa0;cursor:default;display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;font-size:8px;line-height:1;color:#163b55;font-weight:700;transition:none;background:#ffffff;}
    .report-stage-live .connbox-pin.used{background:#b9ddf5;color:#0f2c40;}
    .report-stage-live .connbox-pin.out-pin{border-color:#1f8a5a;color:#0f5e3b;background:#effaf2;}
    .report-stage-live .connbox-pin.out-pin.used{background:#b6e8cb;color:#0d4f33;}
    .report-stage-live .connbox-pin.other-pin{border-color:#54697f;color:#54697f;background:#eef3f8;}
    .report-stage-live .connbox-pin.other-pin.used{background:#d7e7f5;color:#0f2c40;}
    .report-stage-live .connbox-pin:hover{transform:none;}
    .report-stage-live .ib.outlet-mode .connbox-pin{border-radius:2px;border-color:var(--outlet-pin-border, #4ea8ff);color:var(--outlet-pin-text, #ffffff);background:var(--outlet-pin-bg, #8cc7ff);}
    .report-stage-live .ib.outlet-mode .connbox-pin.used{background:var(--outlet-pin-used-bg, #2f90f7);border-color:var(--outlet-pin-used-border, #2f90f7);color:var(--outlet-pin-used-text, var(--outlet-pin-text, #ffffff));}
    .report-stage-live .ib.outlet-mode .connbox-pin.outlet-pin{width:calc(var(--rack-pin-size-base) * var(--rack-pin-scale) * 1.08);height:calc(var(--rack-pin-size-base) * var(--rack-pin-scale) * 1.08);font-size:calc(var(--rack-pin-font-base) * var(--port-label-scale, var(--rack-pin-scale, 1)) * 1.35);line-height:1;}
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">
      <style><![CDATA[
        ${foreignObjectStyle}
      ]]></style>
      <rect width="100%" height="100%" fill="#ffffff" />
      <rect x="${stageX}" y="${stageY}" width="${stageWpx}" height="${stageHpx}" rx="9" ry="9" fill="${stageColor}" stroke="${stageBorder}" stroke-width="2" />
      <rect x="${stageX}" y="${stageY + stageHpx - 14}" width="${stageWpx}" height="14" rx="0" ry="0" fill="${stageBorder}" opacity=".25" />
      <text x="${stageLabelX}" y="${stageLabelY}" text-anchor="middle" font-family="Share Tech Mono, monospace" font-size="12" fill="#132034" opacity=".78">STAGE</text>
      <text x="${stageLabelX}" y="${stageLabelY + 12}" text-anchor="middle" font-family="Share Tech Mono, monospace" font-size="10" fill="#3b4e66" opacity=".82">${stageW}m Ã— ${stageD}m</text>
      ${stagePartSvg}
      ${instrumentSvg}
      <text x="${stageLabelX}" y="${stageY + stageHpx + 24}" text-anchor="middle" font-family="Share Tech Mono, monospace" font-size="11" fill="#6c7c8f">â—€ AUDIENCE â–¶</text>
    </svg>
  `)}`;
}

function buildReportItemCard(instr) {
  const groupHtml = isOutletBox(instr)
    ? buildOutletReportLines(instr)
    : getReportPinGroups(instr).map(group => buildReportPinGroupHTML(instr, group)).filter(Boolean).join('');

  if(!groupHtml) return '';

  const headerBits = [
    isSnakeBox(instr) ? null : instr.type,
    isMixerBox(instr) ? 'Connection Box' : null,
  ].filter(Boolean).join(' Â· ');

  const title = isSnakeBox(instr)
    ? `${escapeHtml(instr.label || instr.name || instr.type)} <span class="report-item-type-meta">(${escapeHtml(instr.type || '')})</span>`
    : escapeHtml(instr.label || instr.name || instr.type);
  const familyClass = isSnakeBox(instr)
    ? ' snake-card'
    : (isOutletBox(instr)
      ? ' outlet-card'
      : (isStageboxBox(instr) ? ' stagebox-card' : (getConnectionBoxKind(instr) === 'mixer' ? ' mixer-card' : (instr.cat === 'monitoring' ? ' monitor-card' : ''))));

  return `
    <article class="report-item-card${familyClass}">
      <div class="report-item-head">
        <div>
          <h3>${title}</h3>
          ${headerBits ? `<div class="report-item-sub">${escapeHtml(headerBits)}</div>` : ''}
        </div>
        <div class="report-item-pill">${escapeHtml(instr.cat || 'item')}</div>
      </div>
      ${groupHtml || ''}
    </article>
  `;
}

function getConnectionBoxReportPinIndex(key) {
  const text = String(key || '');
  const snakeMatch = text.match(/^SNAKE-(IN|OUT)-(\d+)$/);
  if(snakeMatch) return { family: `SNAKE-${snakeMatch[1]}`, index: parseInt(snakeMatch[2], 10) || 0 };

  const mixerMatch = text.match(/^MX-(IN|AUX-IN|AUX|MAIN|JACK-OUT|HP|P16|AES50|USB)-(\d+)$/);
  if(mixerMatch) return { family: `MX-${mixerMatch[1]}`, index: parseInt(mixerMatch[2], 10) || 0 };

  return null;
}

function shouldShowConnectionBoxGapIndicator(prevKey, nextKey) {
  const prev = getConnectionBoxReportPinIndex(prevKey);
  const next = getConnectionBoxReportPinIndex(nextKey);
  if(!prev || !next) return false;
  if(prev.family !== next.family) return false;
  return (next.index - prev.index) > 1;
}

function addReportPinLineClass(html, className) {
  const text = String(html || '');
  if(!text || !className) return text;
  return text.replace(/class="report-pin-line([^\"]*)"/, (all, rest) => {
    if(String(rest || '').includes(className)) return all;
    return `class="report-pin-line${rest} ${className}"`;
  });
}

function buildReportPinGroupHTML(instr, group) {
  const lineEntries = (group.pins || []).map(pin => ({ key: pin.key, html: buildReportPinLine(instr, pin.key) })).filter(entry => !!entry.html);
  if(!lineEntries.length) return '';
  if(instr && (isSnakeBox(instr) || isMixerBox(instr) || isStageboxBox(instr))) {
    let columnCount = 1;
    if(isSnakeBox(instr)) {
      columnCount = Math.min(3, Math.max(1, lineEntries.length));
    } else {
      if(lineEntries.length >= 28) columnCount = 4;
      else if(lineEntries.length >= 14) columnCount = 3;
      else if(lineEntries.length >= 7) columnCount = 2;
    }
    const baseSize = Math.floor(lineEntries.length / columnCount);
    const remainder = lineEntries.length % columnCount;
    let start = 0;
    const columns = [];
    for(let index = 0; index < columnCount; index++) {
      const size = baseSize + (index < remainder ? 1 : 0);
      const entries = lineEntries.slice(start, start + size);
      const decorated = entries.map(entry => entry.html);
      if(isSnakeBox(instr) || isMixerBox(instr) || isStageboxBox(instr)) {
        for(let i = 1; i < entries.length; i++) {
          const prev = entries[i - 1];
          const curr = entries[i];
          if(shouldShowConnectionBoxGapIndicator(prev.key, curr.key)) {
            decorated[i] = addReportPinLineClass(decorated[i], 'report-gap-before');
          }
        }
      }
      const html = decorated.join('');
      columns.push(html);
      start += size;
    }
    return `
      <div class="report-pin-group">
        <div class="report-pin-group-title">${escapeHtml(group.title)}</div>
        <div class="report-pin-columns" style="grid-template-columns:repeat(${columnCount},minmax(0,1fr));">
          ${columns.map(column => `<div class="report-pin-column">${column}</div>`).join('')}
        </div>
      </div>
    `;
  }
  return `
    <div class="report-pin-group">
      <div class="report-pin-group-title">${escapeHtml(group.title)}</div>
      <div class="report-pin-list">
        ${lineEntries.map(entry => entry.html).join('')}
      </div>
    </div>
  `;
}

function getReportStageSnapshotData(stageOrientation) {
  const bounds = getReportStageBounds();
  const stage = {
    x: stagePx.left - bounds.left,
    y: stagePx.top - bounds.top,
    width: stagePx.width,
    height: stagePx.height,
    color: stageColor,
    borderColor: getStageBorderColor(stageColor),
    label: 'STAGE',
    dims: `${stageW}m Ã— ${stageD}m`,
  };
  const reportItems = instruments.filter(instr => !shouldHideWirelessReceiver(instr)).map((instr, index) => ({
    ...getReportSnapshotInstrument(instr),
    renderOrder: index,
  }));
  const itemById = new Map(reportItems.map(item => [item.id, item]));
  const items = reportItems.map(item => ({
    ...item,
    x: item.worldX - bounds.left,
    y: item.worldY - bounds.top,
  }));
  const parts = stageParts.map(part => {
    const partW = Math.max(24, Math.max(0.5, Number(part.widthM) || 1) * pxPerM);
    const partH = Math.max(24, Math.max(0.5, Number(part.depthM) || 1) * pxPerM);
    const widthM = Math.max(0.5, Number(part.widthM) || 1);
    const depthM = Math.max(0.5, Number(part.depthM) || 1);
    return {
      x: part.x - bounds.left,
      y: part.y - bounds.top,
      width: partW,
      height: partH,
      widthM,
      depthM,
      hasSteps: !!part.hasSteps || String(part.label || '').trim().toUpperCase() === 'STAIRS',
      shape: part.shape,
      color: /^#[0-9a-fA-F]{6}$/.test(String(part.color || '')) ? part.color : '#7da7c8',
      label: part.label || 'Stage',
      dimsLabel: getReportStagePartDimsLabel({ widthM, depthM }),
    };
  });

  const connectionLines = connections.map(conn => {
    const fromInstr = instruments.find(instr => instr && instr.id === conn.fromId) || null;
    const toInstr = instruments.find(instr => instr && instr.id === conn.toId) || null;
    const fromItem = itemById.get(conn.fromId) || null;
    const toItem = itemById.get(conn.toId) || null;
    const liveFrom = getReportWorldCenterForPin(conn.fromId, conn.fromPin);
    const liveTo = getReportWorldCenterForPin(conn.toId, conn.toPin);
    const from = getReportSnapshotConnectionPoint(fromInstr, fromItem, conn.fromPin);
    const to = getReportSnapshotConnectionPoint(toInstr, toItem, conn.toPin);
    if(!from || !to) return null;
    const routeXWorld = getEffectiveRouteXForConnection(conn, null);
    const routeX = Number.isFinite(routeXWorld)
      ? routeXWorld - bounds.left
      : ((from.x + to.x) / 2) - bounds.left;
    return {
      id: conn.id,
      color: conn.color || '#47c4ff',
      fromId: conn.fromId,
      toId: conn.toId,
      fromPin: pinKey(conn.fromPin),
      toPin: pinKey(conn.toPin),
      from: { x: from.x - bounds.left, y: from.y - bounds.top },
      to: { x: to.x - bounds.left, y: to.y - bounds.top },
      routeX,
    };
  }).filter(Boolean);

  return { orientation: stageOrientation, bounds, stage, items, parts, connections: connectionLines };
}

function getReportWorldCenterForPin(id, pin) {
  const instr = instruments.find(i => i && i.id === id) || null;
  const point = getCenterOf(id, pin);
  if(point) {
    return {
      x: (point.x - panX) / zoomLevel,
      y: (point.y - panY) / zoomLevel,
    };
  }

  // Fallback for report contexts where a pin DOM node is not currently available.
  if(instr && instr.type === 'drumkit') {
    const key = pinKey(pin);
    const drumAnchorMap = {
      'DM-KICK': { x: 0.50, y: 0.76 },
      'DM-HH': { x: 0.24, y: 0.50 },
      'DM-SN': { x: 0.38, y: 0.58 },
      'DM-T1': { x: 0.44, y: 0.43 },
      'DM-T2': { x: 0.56, y: 0.43 },
      'DM-T3': { x: 0.70, y: 0.56 },
      'DM-RD': { x: 0.77, y: 0.40 },
      'DM-CR': { x: 0.24, y: 0.34 },
      'DM-OH': { x: 0.50, y: 0.14 },
      'DM-OHL': { x: 0.30, y: 0.18 },
      'DM-OHR': { x: 0.70, y: 0.18 },
    };
    const anchor = drumAnchorMap[key];
    if(anchor) {
      const body = getInstrumentBodyDimensionsPx(instr);
      const w = Math.max(1, Number(body.width) || 1);
      const h = Math.max(1, Number(body.height) || 1);
      const angle = ((parseInt(instr.angle || 0, 10) || 0) * Math.PI) / 180;
      const cx = (Number(instr.x) || 0) + (w / 2);
      const cy = (Number(instr.y) || 0) + (h / 2);
      const dx = (anchor.x - 0.5) * w;
      const dy = (anchor.y - 0.5) * h;
      const rx = (dx * Math.cos(angle)) - (dy * Math.sin(angle));
      const ry = (dx * Math.sin(angle)) + (dy * Math.cos(angle));
      return { x: cx + rx, y: cy + ry };
    }
  }

  return null;
}

function getReportPinExtraSlackMeters(instr, pin) {
  if(!instr) return 0;
  const key = pinKey(pin);
  if(instr.type !== 'drumkit') return 0;
  if(key === 'DM-OH') return 0.9;
  if(key === 'DM-OHL' || key === 'DM-OHR') return 0.85;
  if(key === 'DM-KICK') return 0.1;
  if(key.startsWith('DM-')) return 0.2;
  return 0;
}

function getReportCableStockFamily(conn) {
  const type = normalizeCableType(conn?.cableType || 'xlr');
  if(type === 'ethernet') return { label: 'Ethernet', sizes: [3, 5], overflowLabel: '>5m' };
  if(type === 'xlr') return { label: 'XLR', sizes: [1, 3, 6, 10], overflowLabel: '>10m' };
  if(type === 'ts' || type === 'trs') return { label: 'Jack', sizes: [1, 3, 6, 10], overflowLabel: '>10m' };
  return null;
}

function getReportInstrumentSlackMeters(instr) {
  if(!instr) return 0.3;
  const body = getInstrumentBodyDimensionsPx(instr);
  const widthM = Math.max(0, Number(body.width) || 0) / Math.max(pxPerM, 1);
  const heightM = Math.max(0, Number(body.height) || 0) / Math.max(pxPerM, 1);
  return Math.max(0.3, Math.max(widthM, heightM) * 0.25);
}

function getReportConnectionEstimatedMeters(conn) {
  if(!conn) return null;
  const from = getReportWorldCenterForPin(conn.fromId, conn.fromPin);
  const to = getReportWorldCenterForPin(conn.toId, conn.toPin);
  if(!from || !to) return null;
  const routeXWorld = getEffectiveRouteXForConnection(conn, null);
  const midX = Number.isFinite(routeXWorld) ? routeXWorld : ((from.x + to.x) / 2);
  const points = [
    { x: from.x, y: from.y },
    { x: midX, y: from.y },
    { x: midX, y: to.y },
    { x: to.x, y: to.y },
  ];
  let lengthPx = 0;
  for(let i = 1; i < points.length; i++) {
    lengthPx += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  const fromInstr = instruments.find(i => i && i.id === conn.fromId) || null;
  const toInstr = instruments.find(i => i && i.id === conn.toId) || null;
  const pinSlackMeters = getReportPinExtraSlackMeters(fromInstr, conn.fromPin) + getReportPinExtraSlackMeters(toInstr, conn.toPin);
  const slackMeters = getReportInstrumentSlackMeters(fromInstr) + getReportInstrumentSlackMeters(toInstr) + pinSlackMeters + 0.25;
  return (lengthPx / Math.max(pxPerM, 1)) + slackMeters;
}

function bucketReportConnectionByCableLength(connectionsForReport) {
  const summary = new Map();
  (connectionsForReport || []).forEach(conn => {
    const family = getReportCableStockFamily(conn);
    if(!family) return;
    const estimate = getReportConnectionEstimatedMeters(conn);
    if(!Number.isFinite(estimate)) return;
    const key = family.label;
    if(!summary.has(key)) {
      const counts = {};
      family.sizes.forEach(size => { counts[`${size}m`] = 0; });
      counts[family.overflowLabel] = 0;
      summary.set(key, { family, counts });
    }
    const entry = summary.get(key);
    const bucket = family.sizes.find(size => estimate <= size);
    if(bucket) entry.counts[`${bucket}m`] += 1;
    else entry.counts[family.overflowLabel] += 1;
  });
  return [...summary.values()];
}

function getSceneReportState(sceneId) {
  if(!Array.isArray(scenes)) return null;
  const scene = scenes.find(s => s && s.id === sceneId);
  if(!scene || !scene.state) return null;
  return {
    id: scene.id,
    name: scene.name || `Scene ${indexToLetters((scenes.indexOf(scene) || 0) + 1)}`,
    state: cloneSceneState(scene.state),
  };
}

function getSelectedScenesForReport(selectedSceneIds) {
  saveCurrentSceneState();
  const selected = new Set((Array.isArray(selectedSceneIds) ? selectedSceneIds : []).map(id => parseInt(id, 10)).filter(Number.isFinite));
  const ordered = (Array.isArray(scenes) ? scenes : []).filter(scene => scene && (!selected.size || selected.has(scene.id)));
  if(!ordered.length && Number.isFinite(activeSceneId)) {
    const fallback = getSceneReportState(activeSceneId);
    return fallback ? [fallback] : [];
  }
  return ordered.map(scene => ({
    id: scene.id,
    name: scene.name || `Scene ${indexToLetters((scenes.indexOf(scene) || 0) + 1)}`,
    state: cloneSceneState(scene.state || captureSceneState()),
  }));
}

function withTemporarySceneState(sceneState, workFn) {
  const restoreSnapshot = captureSnapshot();
  const tempSnapshot = {
    ...restoreSnapshot,
    ...cloneSceneState(sceneState || {}),
    projectName,
  };
  applySnapshot(tempSnapshot, false, true);
  try {
    return workFn();
  } finally {
    applySnapshot(restoreSnapshot, false, true);
  }
}

async function withTemporarySceneStateAsync(sceneState, workFn) {
  const restoreSnapshot = captureSnapshot();
  const tempSnapshot = {
    ...restoreSnapshot,
    ...cloneSceneState(sceneState || {}),
    projectName,
  };
  applySnapshot(tempSnapshot, false, true);
  try {
    return await workFn();
  } finally {
    applySnapshot(restoreSnapshot, false, true);
  }
}

function getSceneStageRect(state) {
  const centerX = stagePx.left + (stagePx.width / 2);
  const centerY = stagePx.top + (stagePx.height / 2);
  const width = Math.max(1, (Math.max(1, Number(state?.stageW) || 12) * pxPerM));
  const height = Math.max(1, (Math.max(1, Number(state?.stageD) || 8) * pxPerM));
  return {
    x: centerX - (width / 2),
    y: centerY - (height / 2),
    width,
    height,
    color: state?.stageColor || '#2f6fa0',
  };
}

function getSceneReportItems(state) {
  return (state?.instruments || []).map(instr => {
    const body = getInstrumentBodyDimensionsPx(instr || {});
    return {
      id: instr.id,
      x: Number(instr.x) || 0,
      y: Number(instr.y) || 0,
      width: Math.max(20, Number(body.width) || 56),
      height: Math.max(20, Number(body.height) || 44),
      angle: parseInt(instr.angle || 0, 10) || 0,
      label: instr.label || instr.name || instr.type || 'Item',
      type: instr.type || '',
      cat: instr.cat || '',
    };
  });
}

function getSceneReportParts(state) {
  return (state?.stageParts || []).map(part => ({
    id: part.id,
    x: Number(part.x) || 0,
    y: Number(part.y) || 0,
    width: Math.max(24, Math.max(0.5, Number(part.widthM) || 1) * pxPerM),
    height: Math.max(24, Math.max(0.5, Number(part.depthM) || 1) * pxPerM),
    shape: part.shape || 'rect',
    label: part.label || 'Stage',
    color: /^#[0-9a-fA-F]{6}$/.test(String(part.color || '')) ? part.color : '#7da7c8',
  }));
}

function getSceneReportBounds(state) {
  const stage = getSceneStageRect(state);
  const items = getSceneReportItems(state);
  const parts = getSceneReportParts(state);
  const points = [
    { left: stage.x, top: stage.y, right: stage.x + stage.width, bottom: stage.y + stage.height },
  ];
  items.forEach(item => points.push({ left: item.x, top: item.y, right: item.x + item.width, bottom: item.y + item.height }));
  parts.forEach(part => points.push({ left: part.x, top: part.y, right: part.x + part.width, bottom: part.y + part.height }));
  return {
    left: Math.max(0, Math.min(...points.map(p => p.left)) - 24),
    top: Math.max(0, Math.min(...points.map(p => p.top)) - 24),
    right: Math.max(...points.map(p => p.right)) + 24,
    bottom: Math.max(...points.map(p => p.bottom)) + 24,
  };
}

function isSceneConnectionRelevant(conn, selectedIds) {
  if(!conn) return false;
  if(!selectedIds || !selectedIds.size) return true;
  return selectedIds.has(conn.fromId) || selectedIds.has(conn.toId);
}

function getSceneSnakePortKey(instr, pin) {
  if(!instr || !isSnakeBox(instr)) return null;
  const match = String(pinKey(pin) || '').match(/^(?:SNAKE|STAGE|CABLE)-(IN|OUT)-(\d+)$/);
  if(!match) return null;
  return `${instr.id}:${match[1]}:${parseInt(match[2], 10) || 0}`;
}

function getSceneConnectionIdentity(conn, byId) {
  const fromInstr = byId.get(conn.fromId) || null;
  const toInstr = byId.get(conn.toId) || null;
  const fromSnake = getSceneSnakePortKey(fromInstr, conn.fromPin);
  const toSnake = getSceneSnakePortKey(toInstr, conn.toPin);
  if(fromSnake || toSnake) return fromSnake || toSnake;
  const a = `${conn.fromId}:${pinKey(conn.fromPin)}`;
  const b = `${conn.toId}:${pinKey(conn.toPin)}`;
  return [a, b].sort().join('|');
}

function getSceneConnectionSignature(conn, byId) {
  const fromInstr = byId.get(conn.fromId) || null;
  const toInstr = byId.get(conn.toId) || null;
  const fromSnake = getSceneSnakePortKey(fromInstr, conn.fromPin);
  const toSnake = getSceneSnakePortKey(toInstr, conn.toPin);
  if(fromSnake) return `${conn.toId}:${pinKey(conn.toPin)}`;
  if(toSnake) return `${conn.fromId}:${pinKey(conn.fromPin)}`;
  const a = `${conn.fromId}:${pinKey(conn.fromPin)}`;
  const b = `${conn.toId}:${pinKey(conn.toPin)}`;
  return [a, b].sort().join('|');
}

function getScenePinLabel(instr, pin) {
  if(!instr) return pinKey(pin) || 'Pin';
  if(isOutletBox(instr)) {
    const idx = getOutletPortIndexFromPin(pin);
    if(idx > 0) return getOutletPortName(instr, idx);
  }
  // Reuse the report pin label resolver (already handles snakes/mixers/outlets).
  if(typeof getReportPinLabel === 'function') {
    return getReportPinLabel(instr, pin);
  }
  return pinForReport(pinKey(pin));
}

function describeSceneEndpoint(state, id, pin) {
  const instr = (state?.instruments || []).find(item => item && item.id === id) || null;
  if(!instr) return `Unknown (${escapeHtml(pinKey(pin) || 'Pin')})`;
  const label = instr.label || instr.name || instr.type || 'Item';
  const pinLabel = getScenePinLabel(instr, pin);
  return `${escapeHtml(label)} (${escapeHtml(pinLabel)})`;
}

function buildSceneConnectionDiff(prevState, nextState, selectedIds) {
  const prevById = new Map((prevState?.instruments || []).map(item => [item.id, item]));
  const nextById = new Map((nextState?.instruments || []).map(item => [item.id, item]));
  const prevMap = new Map();
  const nextMap = new Map();

  (prevState?.connections || []).forEach(conn => {
    if(!isSceneConnectionRelevant(conn, selectedIds)) return;
    const key = getSceneConnectionIdentity(conn, prevById);
    prevMap.set(key, { conn, signature: getSceneConnectionSignature(conn, prevById) });
  });
  (nextState?.connections || []).forEach(conn => {
    if(!isSceneConnectionRelevant(conn, selectedIds)) return;
    const key = getSceneConnectionIdentity(conn, nextById);
    nextMap.set(key, { conn, signature: getSceneConnectionSignature(conn, nextById) });
  });

  const added = [];
  const removed = [];
  const changed = [];

  nextMap.forEach((nextEntry, key) => {
    const prevEntry = prevMap.get(key);
    if(!prevEntry) {
      added.push(nextEntry.conn);
      return;
    }
    if(prevEntry.signature !== nextEntry.signature) changed.push({ before: prevEntry.conn, after: nextEntry.conn });
  });
  prevMap.forEach((prevEntry, key) => {
    if(!nextMap.has(key)) removed.push(prevEntry.conn);
  });

  // Reclassify compatible removed+added pairs as changed so the same logical reroute
  // does not appear in both lists.
  const endpointKey = conn => {
    if(!conn) return '';
    const a = `${conn.fromId}:${pinKey(conn.fromPin)}`;
    const b = `${conn.toId}:${pinKey(conn.toPin)}`;
    return [a, b].sort().join('|');
  };
  const sharesEndpoint = (a, b) => {
    if(!a || !b) return false;
    const setA = new Set([`${a.fromId}:${pinKey(a.fromPin)}`, `${a.toId}:${pinKey(a.toPin)}`]);
    return setA.has(`${b.fromId}:${pinKey(b.fromPin)}`) || setA.has(`${b.toId}:${pinKey(b.toPin)}`);
  };

  const nextAdded = [...added];
  const nextRemoved = [...removed];
  const pairedAdded = new Set();
  const pairedRemoved = new Set();
  nextRemoved.forEach((removedConn, rIdx) => {
    let candidateIndex = -1;
    for(let aIdx = 0; aIdx < nextAdded.length; aIdx++) {
      if(pairedAdded.has(aIdx)) continue;
      const addedConn = nextAdded[aIdx];
      if(sharesEndpoint(removedConn, addedConn)) {
        candidateIndex = aIdx;
        break;
      }
    }
    if(candidateIndex >= 0) {
      pairedRemoved.add(rIdx);
      pairedAdded.add(candidateIndex);
      changed.push({ before: removedConn, after: nextAdded[candidateIndex] });
    }
  });

  const dedupedAdded = nextAdded.filter((_conn, idx) => !pairedAdded.has(idx));
  const dedupedRemoved = nextRemoved.filter((_conn, idx) => !pairedRemoved.has(idx));
  const seenChange = new Set();
  const dedupedChanged = changed.filter(entry => {
    const key = `${endpointKey(entry.before)}=>${endpointKey(entry.after)}`;
    if(seenChange.has(key)) return false;
    seenChange.add(key);
    return true;
  });

  return { added: dedupedAdded, removed: dedupedRemoved, changed: dedupedChanged };
}

function buildSceneEquipmentSummaryRows(sceneStates) {
  const byType = new Map();
  const seenIds = new Set();
  const stagePartIds = new Set();

  (sceneStates || []).forEach(scene => {
    (scene?.state?.instruments || []).forEach(instr => {
      if(!instr || seenIds.has(instr.id)) return;
      seenIds.add(instr.id);
      const def = getInstrumentDefinitionByType(instr.type);
      const label = (def && (def.name || def.label)) || instr.name || instr.type || 'Item';
      const key = `${instr.cat || 'other'}|${instr.type || 'unknown'}`;
      const entry = byType.get(key) || { category: instr.cat || 'other', label, count: 0 };
      entry.count += 1;
      byType.set(key, entry);
    });
    (scene?.state?.stageParts || []).forEach(part => {
      if(!part || stagePartIds.has(part.id)) return;
      stagePartIds.add(part.id);
    });
  });

  const rows = [...byType.values()].sort((a, b) => {
    const catCmp = String(a.category).localeCompare(String(b.category), undefined, { sensitivity: 'base' });
    if(catCmp !== 0) return catCmp;
    return String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' });
  });

  if(stagePartIds.size > 0) rows.push({ category: 'stage', label: 'Stage Parts', count: stagePartIds.size });
  return rows;
}

function buildGlobalUtilityCountRows(sceneStates) {
  const standDefinitions = INSTRUMENTS
    .filter(def => def && def.cat === 'stands')
    .map(def => ({
      type: def.type,
      label: def.name || def.label || def.type || 'Stand',
    }));
  const seenInstrumentIds = new Set();
  const standUsage = new Map();
  let diCount = 0;

  (sceneStates || []).forEach(scene => {
    (scene?.state?.instruments || []).forEach(instr => {
      if(!instr || seenInstrumentIds.has(instr.id)) return;
      seenInstrumentIds.add(instr.id);
      if(instr.type === 'di') diCount += 1;
      if(instr.cat === 'stands') {
        const key = instr.type || 'stand';
        standUsage.set(key, (standUsage.get(key) || 0) + 1);
      }
    });
  });

  standUsage.forEach((_count, type) => {
    if(standDefinitions.some(def => def.type === type)) return;
    const fallbackDef = getInstrumentDefinitionByType(type);
    standDefinitions.push({
      type,
      label: (fallbackDef && (fallbackDef.name || fallbackDef.label)) || String(type || 'Stand'),
    });
  });
  standDefinitions.sort((a, b) => String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' }));

  const rows = [
    { label: 'DI', count: diCount },
    ...standDefinitions.map(def => ({
      label: def.label,
      count: standUsage.get(def.type) || 0,
    })),
  ].filter(row => Number(row.count) > 0);

  return rows.map(row => `
    <tr>
      <td>${escapeHtml(row.label)}</td>
      <td>${row.count}</td>
    </tr>
  `).join('');
}

function buildSceneItemDiff(prevState, nextState) {
  const prevById = new Map((prevState?.instruments || []).map(item => [item.id, item]));
  const nextById = new Map((nextState?.instruments || []).map(item => [item.id, item]));
  const added = [];
  const removed = [];
  const moved = [];
  const changed = [];
  const unchanged = [];

  nextById.forEach((nextItem, id) => {
    const prevItem = prevById.get(id);
    if(!prevItem) {
      added.push(nextItem);
      return;
    }
    const prevNX = Number(prevItem.stageNX);
    const prevNY = Number(prevItem.stageNY);
    const nextNX = Number(nextItem.stageNX);
    const nextNY = Number(nextItem.stageNY);
    const hasNormalized = Number.isFinite(prevNX) && Number.isFinite(prevNY) && Number.isFinite(nextNX) && Number.isFinite(nextNY);
    const normalizedThreshold = 0.006;
    const pixelThreshold = 8;
    const movedFlag = hasNormalized
      ? (Math.abs(nextNX - prevNX) > normalizedThreshold || Math.abs(nextNY - prevNY) > normalizedThreshold)
      : (Math.abs((Number(nextItem.x) || 0) - (Number(prevItem.x) || 0)) > pixelThreshold
        || Math.abs((Number(nextItem.y) || 0) - (Number(prevItem.y) || 0)) > pixelThreshold);
    const changedFlag = String(nextItem.type || '') !== String(prevItem.type || '')
      || String(nextItem.cat || '') !== String(prevItem.cat || '')
      || String(nextItem.label || '') !== String(prevItem.label || '');
    if(movedFlag) moved.push({ before: prevItem, after: nextItem });
    if(changedFlag) changed.push({ before: prevItem, after: nextItem });
    if(!movedFlag && !changedFlag) unchanged.push(nextItem);
  });

  prevById.forEach((prevItem, id) => {
    if(!nextById.has(id)) removed.push(prevItem);
  });

  return { added, removed, moved, changed, unchanged };
}

function getSceneItemDisplayLabel(item) {
  if(!item) return 'Unknown';
  return String(item.label || item.name || item.type || 'Item');
}

function buildSceneDiffWordListHtml(items, tone, formatter) {
  const toneClass = tone === 'add'
    ? 'scene-diff-word-add'
    : (tone === 'remove'
      ? 'scene-diff-word-remove'
      : (tone === 'change' ? 'scene-diff-word-change' : 'scene-diff-word-move'));
  const names = Array.from(new Set((items || []).map(entry => {
    if(typeof formatter === 'function') return formatter(entry);
    return getSceneItemDisplayLabel(entry);
  }).filter(Boolean)));
  if(!names.length) return '<span class="scene-diff-none">none</span>';
  return names.map(name => `<span class="scene-diff-word ${toneClass}">${escapeHtml(name)}</span>`).join(', ');
}

function buildSceneConnectionListHtml(title, list, state) {
  if(!list.length) return '';
  return `
    <section class="scene-diff-block">
      <h4>${escapeHtml(title)} (${list.length})</h4>
      <ul>
        ${list.map(conn => `<li>${describeSceneEndpoint(state, conn.fromId, conn.fromPin)} -> ${describeSceneEndpoint(state, conn.toId, conn.toPin)}</li>`).join('')}
      </ul>
    </section>
  `;
}

function buildSceneDiffChangedConnectionHtml(list, prevState, nextState) {
  if(!list.length) return '';
  return `
    <section class="scene-diff-block">
      <h4>Changed Connections (${list.length})</h4>
      <ul>
        ${list.map(entry => `<li>${describeSceneEndpoint(prevState, entry.before.fromId, entry.before.fromPin)} -> ${describeSceneEndpoint(prevState, entry.before.toId, entry.before.toPin)}<br>Now: ${describeSceneEndpoint(nextState, entry.after.fromId, entry.after.fromPin)} -> ${describeSceneEndpoint(nextState, entry.after.toId, entry.after.toPin)}</li>`).join('')}
      </ul>
    </section>
  `;
}

function buildSceneDiffReportPayload(reportOptions = {}) {
  const selectedIds = new Set(Array.isArray(reportOptions.selectedIds) ? reportOptions.selectedIds.map(id => parseInt(id, 10)).filter(Number.isFinite) : []);
  let selectedScenes = getSelectedScenesForReport(reportOptions.selectedSceneIds);
  // If PDF scene selection unexpectedly resolves to a single scene while multiple scenes exist,
  // fall back to all scenes in tab order to avoid losing scene diffs.
  if(selectedScenes.length <= 1 && Array.isArray(scenes) && scenes.length > 1) {
    selectedScenes = getSelectedScenesForReport(scenes.map(scene => scene && scene.id).filter(Number.isFinite));
  }
  if(!selectedScenes.length) return { html: buildReportHTML(reportOptions, true), renderData: [], appendHtml: '', firstScene: null, firstSceneOptions: reportOptions };

  const first = selectedScenes[0];
  const firstReportHtml = withTemporarySceneState(first.state, () => buildReportHTML({
    selectedIds: [...selectedIds],
    includeStageImage: reportOptions.includeStageImage !== false,
    stageOrientation: reportOptions.stageOrientation === 'vertical' ? 'vertical' : 'horizontal',
  }, true));

  const renderData = [];
  const sections = [];

  for(let i = 1; i < selectedScenes.length; i++) {
    const prev = selectedScenes[i - 1];
    const curr = selectedScenes[i];
    const itemDiff = buildSceneItemDiff(prev.state, curr.state);
    const connectionDiff = buildSceneConnectionDiff(prev.state, curr.state, selectedIds);
    const canvasId = `scene-report-canvas-${curr.id}`;
    renderData.push({ canvasId, mode: 'diff', prevScene: prev.state, nextScene: curr.state, diff: itemDiff });
    sections.push(`
      <section class="scene-report-section scene-report-break">
        <h2>${escapeHtml(prev.name)} -> ${escapeHtml(curr.name)}</h2>
        <p class="scene-meta">Added: ${itemDiff.added.length} | Removed: ${itemDiff.removed.length} | Moved: ${itemDiff.moved.length} | Changed: ${itemDiff.changed.length}</p>
        <figure class="scene-figure"><canvas id="${canvasId}"></canvas></figure>
        <div class="scene-diff-grid">
          <section class="scene-diff-block">
            <h4>Item Summary</h4>
            <ul>
              <li><strong>Added:</strong> ${buildSceneDiffWordListHtml(itemDiff.added, 'add')}</li>
              <li><strong>Removed:</strong> ${buildSceneDiffWordListHtml(itemDiff.removed, 'remove')}</li>
              <li><strong>Moved:</strong> ${buildSceneDiffWordListHtml(itemDiff.moved, 'move', entry => getSceneItemDisplayLabel(entry && entry.after))}</li>
              <li><strong>Changed:</strong> ${buildSceneDiffWordListHtml(itemDiff.changed, 'change', entry => {
                const before = getSceneItemDisplayLabel(entry && entry.before);
                const after = getSceneItemDisplayLabel(entry && entry.after);
                return before === after ? after : `${before} -> ${after}`;
              })} <span class="scene-diff-inline-note">(same item identity, but label/type/category changed)</span></li>
            </ul>
          </section>
          ${buildSceneConnectionListHtml('Added Connections', connectionDiff.added, curr.state)}
          ${buildSceneConnectionListHtml('Removed Connections', connectionDiff.removed, prev.state)}
          ${buildSceneDiffChangedConnectionHtml(connectionDiff.changed, prev.state, curr.state)}
        </div>
      </section>
    `);
  }

  const utilityRows = buildGlobalUtilityCountRows(selectedScenes);
  const showGlobalUtilitySection = selectedScenes.length > 1 && !!String(utilityRows || '').trim();
  const appendHtml = `
    <style>
      .scene-report-append{margin-top:18px;}
      .scene-report-section{margin-top:18px;break-inside:avoid;page-break-inside:avoid;}
      .scene-report-break{break-before:page;page-break-before:always;}
      .scene-report-section h2{font-family:'Share Tech Mono',monospace;font-size:14px;letter-spacing:1px;color:#1f4c78;text-transform:uppercase;margin-bottom:6px;}
      .scene-meta{margin:5px 0 10px 0;font-size:12px;color:#5a6d83;}
      .scene-figure{border:1px solid #d5deea;border-radius:10px;padding:8px;background:#f8fbff;}
      .scene-figure canvas{width:100%;height:auto;display:block;}
      .scene-diff-grid{display:grid;gap:10px;margin-top:10px;}
      .scene-diff-block{border:1px solid #dce5ef;border-radius:10px;padding:10px;background:#ffffff;}
      .scene-diff-block h4{font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5b7089;margin-bottom:8px;}
      .scene-diff-block ul{margin:0;padding-left:18px;font-size:12px;color:#243447;line-height:1.45;}
      .scene-diff-word{display:inline-block;padding:1px 6px;border-radius:999px;border:1px solid transparent;font-size:11px;line-height:1.3;}
      .scene-diff-word-add{background:#e6f7ee;border-color:#b7e6cb;color:#1a7d48;}
      .scene-diff-word-remove{background:#fdebec;border-color:#f2bec2;color:#b73745;}
      .scene-diff-word-change{background:#fff5db;border-color:#efd08a;color:#9f6a00;}
      .scene-diff-word-move{background:#fff5db;border-color:#efd08a;color:#9f6a00;}
      .scene-diff-inline-note{font-size:10px;color:#7b8898;}
      .scene-diff-none{color:#7a8798;font-style:italic;}
      .scene-diff-block table{width:100%;border-collapse:collapse;font-size:12px;}
      .scene-diff-block th,.scene-diff-block td{border:1px solid #dce5ef;padding:6px 8px;text-align:left;}
      .scene-diff-block th{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.6px;text-transform:uppercase;color:#1f4c78;background:#f4f9ff;}
    </style>
    <section class="scene-report-append">
      ${sections.join('')}
      ${showGlobalUtilitySection ? `
        <section class="scene-report-section scene-report-break">
          <h2>Global Utility Count (Selected Scenes)</h2>
          <p class="scene-meta">Uses the same utility categories as the standard report table (DI + stand types).</p>
          <section class="scene-diff-block">
            <table>
              <thead><tr><th>Utility</th><th>Count</th></tr></thead>
              <tbody>${utilityRows}</tbody>
            </table>
          </section>
        </section>
      ` : ''}
    </section>
  `;

  return {
    html: firstReportHtml,
    renderData,
    appendHtml,
    firstScene: first.state,
    firstSceneOptions: {
      stageOrientation: reportOptions.stageOrientation === 'vertical' ? 'vertical' : 'horizontal',
    },
  };
}

function computeFittedSceneTransform(data, canvasWidth, canvasHeight) {
  const srcW = Math.max(1, Math.round(data.bounds.right - data.bounds.left));
  const srcH = Math.max(1, Math.round(data.bounds.bottom - data.bounds.top));
  const scale = Math.max(0.1, Math.min(canvasWidth / srcW, canvasHeight / srcH) * 0.96);
  const ox = (canvasWidth - (srcW * scale)) / 2;
  const oy = (canvasHeight - (srcH * scale)) / 2;
  return {
    srcW,
    srcH,
    scale,
    ox,
    oy,
    toX: x => ox + (x * scale),
    toY: y => oy + (y * scale),
    toL: v => v * scale,
  };
}

function loadReportImagesForData(win, data) {
  return Promise.all((data.items || []).map(item => new Promise(resolve => {
    const hasPrimary = !!item.image;
    const hasAccessory = !!item.accessoryImage;
    const hasMicStand = !!item.micStandImage;
    let primaryLoaded = !hasPrimary;
    let accessoryLoaded = !hasAccessory;
    let micStandLoaded = !hasMicStand;
    let primaryImg = null;
    let accessoryImg = null;
    let micStandImg = null;

    const done = () => {
      if(primaryLoaded && accessoryLoaded && micStandLoaded) resolve({ item, img: primaryImg, accessoryImg, micStandImg });
    };

    if(hasPrimary) {
      const img = new win.Image();
      img.onload = () => {
        primaryImg = img;
        primaryLoaded = true;
        done();
      };
      img.onerror = () => {
        primaryLoaded = true;
        done();
      };
      img.src = resolveReportAssetUrl(item.image);
    }

    if(hasAccessory) {
      const accImg = new win.Image();
      accImg.onload = () => {
        accessoryImg = accImg;
        accessoryLoaded = true;
        done();
      };
      accImg.onerror = () => {
        accessoryLoaded = true;
        done();
      };
      accImg.src = resolveReportAssetUrl(item.accessoryImage);
    }

    if(hasMicStand) {
      const standImg = new win.Image();
      standImg.onload = () => {
        micStandImg = standImg;
        micStandLoaded = true;
        done();
      };
      standImg.onerror = () => {
        micStandLoaded = true;
        done();
      };
      standImg.src = resolveReportAssetUrl(item.micStandImage);
    }

    done();
  })));
}

function drawSceneDiffOverlay(ctx, nextData, prevData, diff, fit, prevImageMap, nextImageMap, baseSnapshotCanvas) {
  const nextById = new Map((nextData.items || []).map(item => [item.id, item]));
  const prevById = new Map((prevData.items || []).map(item => [item.id, item]));
  const nextOrder = new Map((nextData.items || []).map((item, index) => [item.id, Number.isFinite(item.renderOrder) ? item.renderOrder : index]));
  const prevOrder = new Map((prevData.items || []).map((item, index) => [item.id, Number.isFinite(item.renderOrder) ? item.renderOrder : index]));

  // Fade the entire baseline snapshot first.
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(fit.ox, fit.oy, fit.srcW * fit.scale, fit.srcH * fit.scale);
  ctx.restore();

  const drawOnItem = (item, color, alpha, strokeOnly = false) => {
    if(!item) return;
    if(item.isStand) strokeOnly = true;
    ctx.save();
    const x = fit.toX(item.x);
    const y = fit.toY(item.y);
    const w = fit.toL(item.width);
    const h = fit.toL(item.height);
    roundRect(ctx, x, y, w, h, Math.max(3, fit.toL(6)));
    if(!strokeOnly) {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
    }
    ctx.strokeStyle = color;
    ctx.globalAlpha = Math.max(0.5, Math.min(1, alpha + 0.45));
    ctx.lineWidth = Math.max(1.2, fit.toL(2));
    ctx.stroke();
    ctx.restore();
  };

  const drawRemovedGhost = item => {
    if(!item) return;
    const x = fit.toX(item.x);
    const y = fit.toY(item.y);
    const w = fit.toL(item.width);
    const h = fit.toL(item.height);
    const img = prevImageMap ? prevImageMap.get(item.id) : null;

    ctx.save();
    ctx.globalAlpha = 0.92;
    if(!item.isStand) {
      ctx.fillStyle = item.color;
      ctx.strokeStyle = '#d64545';
      ctx.lineWidth = Math.max(1.2, fit.toL(2));
      roundRect(ctx, x, y, w, h, Math.max(3, fit.toL(6)));
      ctx.fill();
      ctx.stroke();
    }

    if(img) {
      const isDi = item.type === 'di';
      const targetW = Math.max(16, w - (isDi ? 8 : 12));
      const targetH = Math.max(16, h - (isDi ? 8 : 16));
      const ratio = Math.min(targetW / img.width, targetH / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      const dx = x + ((w - dw) / 2);
      const dy = isDi ? (y + ((h - dh) / 2)) : (y + 6 + ((targetH - dh) / 2));
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = '#17324f';
      ctx.font = `${Math.max(10, fit.toL(18))}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(item.icon || 'â€¢'), x + (w / 2), y + (h / 2));
    }

    // Red tint so removed items are clearly identified while preserving icon/shape.
    ctx.fillStyle = '#d64545';
    ctx.globalAlpha = 0.2;
    roundRect(ctx, x, y, w, h, Math.max(3, fit.toL(6)));
    ctx.fill();
    ctx.restore();
  };

  const drawDiffCard = (item, img, borderColor, opts = {}) => {
    if(!item) return;
    const x = fit.toX(item.x);
    const y = fit.toY(item.y);
    const w = fit.toL(item.width);
    const h = fit.toL(item.height);
    const bgAlpha = Number.isFinite(opts.bgAlpha) ? opts.bgAlpha : 0.94;
    const iconAlpha = Number.isFinite(opts.iconAlpha) ? opts.iconAlpha : 1;
    const labelAlpha = Number.isFinite(opts.labelAlpha) ? opts.labelAlpha : 0.96;
    const tintColor = opts.tintColor || '';
    const tintAlpha = Number.isFinite(opts.tintAlpha) ? opts.tintAlpha : 0;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = bgAlpha;
    roundRect(ctx, x, y, w, h, Math.max(3, fit.toL(6)));
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = Math.max(1.2, fit.toL(2));
    roundRect(ctx, x, y, w, h, Math.max(3, fit.toL(6)));
    ctx.stroke();

    ctx.globalAlpha = Math.max(0.2, Math.min(1, iconAlpha));
    if(img) {
      const pad = Math.max(6, fit.toL(8));
      const targetW = Math.max(14, w - (pad * 2));
      const targetH = Math.max(14, h - (pad * 2));
      const ratio = Math.min(targetW / img.width, targetH / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      const dx = x + ((w - dw) / 2);
      const dy = y + ((h - dh) / 2);
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = '#17324f';
      ctx.font = `${Math.max(9, fit.toL(16))}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(item.icon || 'â€¢'), x + (w / 2), y + (h / 2));
    }

    if(tintColor && tintAlpha > 0) {
      ctx.fillStyle = tintColor;
      ctx.globalAlpha = tintAlpha;
      roundRect(ctx, x, y, w, h, Math.max(3, fit.toL(6)));
      ctx.fill();
    }

    const label = item.isStand ? '' : String(item.label || item.name || item.type || '').trim();
    if(label) {
      const labelFont = `${Math.max(7, Math.min(10, fit.toL(10)))}px Barlow, sans-serif`;
      ctx.font = `700 ${labelFont}`;
      const maxTextWidth = Math.max(16, w - Math.max(8, fit.toL(10)));
      const measured = Math.min(maxTextWidth, ctx.measureText(label).width);
      const chipH = Math.max(10, fit.toL(12));
      const chipW = Math.max(Math.min(w - 4, measured + Math.max(8, fit.toL(10))), Math.min(w - 4, fit.toL(20)));
      const chipX = x + ((w - chipW) / 2);
      const chipY = y + h - chipH - Math.max(2, fit.toL(2));

      ctx.globalAlpha = Math.max(0.35, Math.min(1, labelAlpha));
      ctx.fillStyle = 'rgba(255,255,255,0.98)';
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = Math.max(0.8, fit.toL(1));
      roundRect(ctx, chipX, chipY, chipW, chipH, Math.max(2, fit.toL(3)));
      ctx.fill();
      ctx.stroke();

      ctx.globalAlpha = Math.max(0.45, Math.min(1, labelAlpha));
      ctx.fillStyle = '#10243a';
      ctx.font = `700 ${labelFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, chipX + (chipW / 2), chipY + (chipH / 2));
    }
    ctx.restore();
  };

  // Diff overlay stack order (back -> front): removed, moved/changed, added.
  // This entire overlay sits above the unchanged baseline snapshot.
  (diff.removed || []).slice().sort((a, b) => {
    const ao = prevOrder.get(a.id) || 0;
    const bo = prevOrder.get(b.id) || 0;
    return ao - bo;
  }).forEach(item => {
    const prevItem = prevById.get(item.id);
    if(!prevItem) return;
    drawDiffCard(prevItem, prevImageMap ? prevImageMap.get(prevItem.id) : null, '#d64545', {
      iconAlpha: prevItem.isStand ? 0.45 : 0.6,
      labelAlpha: 0.86,
      bgAlpha: 0.94,
      tintColor: '#d64545',
      tintAlpha: 0.18,
    });
  });

  (diff.moved || []).slice().sort((a, b) => {
    const ao = nextOrder.get(a.after && a.after.id) || 0;
    const bo = nextOrder.get(b.after && b.after.id) || 0;
    return ao - bo;
  }).forEach(entry => {
    const before = prevById.get(entry.before.id);
    const after = nextById.get(entry.after.id);
    if(before) {
      drawDiffCard(before, prevImageMap ? prevImageMap.get(before.id) : null, '#e0a31e', {
        iconAlpha: before.isStand ? 0.45 : 0.58,
        labelAlpha: 0.82,
        bgAlpha: 0.94,
        tintColor: '#e0a31e',
        tintAlpha: 0.1,
      });
    }
    if(after) {
      drawDiffCard(after, nextImageMap ? nextImageMap.get(after.id) : null, '#e0a31e', {
        iconAlpha: 1,
        labelAlpha: 0.96,
        bgAlpha: 0.94,
        tintColor: '#e0a31e',
        tintAlpha: 0.14,
      });
    }
    if(!before || !after) return;
    const from = { x: before.x + (before.width / 2), y: before.y + (before.height / 2) };
    const to = { x: after.x + (after.width / 2), y: after.y + (after.height / 2) };
    ctx.save();
    ctx.strokeStyle = '#e0a31e';
    ctx.fillStyle = '#e0a31e';
    ctx.lineWidth = Math.max(1, fit.toL(1.6));
    ctx.beginPath();
    ctx.moveTo(fit.toX(from.x), fit.toY(from.y));
    ctx.lineTo(fit.toX(to.x), fit.toY(to.y));
    ctx.stroke();
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const head = Math.max(5, fit.toL(7));
    ctx.beginPath();
    ctx.moveTo(fit.toX(to.x), fit.toY(to.y));
    ctx.lineTo(fit.toX(to.x) - (Math.cos(angle - Math.PI / 6) * head), fit.toY(to.y) - (Math.sin(angle - Math.PI / 6) * head));
    ctx.lineTo(fit.toX(to.x) - (Math.cos(angle + Math.PI / 6) * head), fit.toY(to.y) - (Math.sin(angle + Math.PI / 6) * head));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  (diff.changed || []).slice().sort((a, b) => {
    const ao = nextOrder.get(a.after && a.after.id) || 0;
    const bo = nextOrder.get(b.after && b.after.id) || 0;
    return ao - bo;
  }).forEach(entry => {
    const after = nextById.get(entry.after.id);
    if(!after) return;
    drawDiffCard(after, nextImageMap ? nextImageMap.get(after.id) : null, '#e0a31e', {
      iconAlpha: 1,
      labelAlpha: 0.96,
      bgAlpha: 0.94,
      tintColor: '#e0a31e',
      tintAlpha: 0.12,
    });
  });

  (diff.added || []).slice().sort((a, b) => {
    const ao = nextOrder.get(a.id) || 0;
    const bo = nextOrder.get(b.id) || 0;
    return ao - bo;
  }).forEach(item => {
    const target = nextById.get(item.id);
    if(!target) return;
    drawDiffCard(target, nextImageMap ? nextImageMap.get(target.id) : null, '#37b26c', {
      iconAlpha: 1,
      labelAlpha: 0.98,
      bgAlpha: 0.94,
      tintColor: '#37b26c',
      tintAlpha: 0.12,
    });
  });
}

async function renderSceneDiffCanvasToContext(win, ctx, prevState, nextState, diff, canvasWidth, canvasHeight) {
  const nextData = withTemporarySceneState(nextState, () => getReportStageSnapshotData('horizontal'));
  const prevData = withTemporarySceneState(prevState, () => getReportStageSnapshotData('horizontal'));
  const images = await loadReportImagesForData(win, nextData);
  const prevImages = await loadReportImagesForData(win, prevData);
  const byKey = new Map(images.map(entry => [entry.item.id, entry.img]));
  const byAccessoryKey = new Map(images.filter(entry => entry && entry.accessoryImg).map(entry => [entry.item.id, entry.accessoryImg]));
  const byMicStandKey = new Map(images.filter(entry => entry && entry.micStandImg).map(entry => [entry.item.id, entry.micStandImg]));
  const prevByKey = new Map(prevImages.map(entry => [entry.item.id, entry.img]));

  const fit = computeFittedSceneTransform(nextData, canvasWidth, canvasHeight);
  const tx = (ctx && typeof ctx.getTransform === 'function') ? ctx.getTransform() : null;
  const renderScale = Math.max(1, (tx && Number.isFinite(tx.a) ? Math.abs(tx.a) : (win.devicePixelRatio || 1)));
  const baseSnapshotCanvas = win.document.createElement('canvas');
  baseSnapshotCanvas.width = Math.max(1, Math.round(canvasWidth * renderScale));
  baseSnapshotCanvas.height = Math.max(1, Math.round(canvasHeight * renderScale));
  const baseCtx = baseSnapshotCanvas.getContext('2d');
  baseCtx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  baseCtx.imageSmoothingEnabled = true;
  baseCtx.imageSmoothingQuality = 'high';
  baseCtx.fillStyle = '#ffffff';
  baseCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  baseCtx.save();
  baseCtx.translate(fit.ox, fit.oy);
  baseCtx.scale(fit.scale, fit.scale);
  drawReportStageSnapshot(baseCtx, nextData, byKey, byAccessoryKey, byMicStandKey);
  baseCtx.restore();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(baseSnapshotCanvas, 0, 0, canvasWidth, canvasHeight);

  drawSceneDiffOverlay(ctx, nextData, prevData, diff, fit, prevByKey, byKey, baseSnapshotCanvas);
}

async function renderSceneDiffCanvases(win, payload = {}, autoPrint = false) {
  if(!win || !win.document) return;
  const renderData = Array.isArray(payload.renderData) ? payload.renderData : [];

  if(payload.appendHtml) {
    const main = win.document.querySelector('main.connections-page') || win.document.body;
    const host = win.document.createElement('div');
    host.innerHTML = payload.appendHtml;
    main.appendChild(host);
  }

  if(payload.firstScene) {
    await withTemporarySceneStateAsync(payload.firstScene, async () => {
      await renderReportStageCanvas(win, payload.firstSceneOptions || {}, false);
    });
  }

  const dpr = win.devicePixelRatio || 1;
  for(const entry of (renderData || [])) {
    const canvas = win.document.getElementById(entry.canvasId);
    if(!canvas) continue;
    const width = 1200;
    const height = 700;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if(entry.mode === 'diff') {
      await renderSceneDiffCanvasToContext(win, ctx, entry.prevScene, entry.nextScene, entry.diff, width, height);
    }
  }

  if(autoPrint) {
    setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch(_err) {
        // Ignore print failures.
      }
    }, 180);
  }
}

function buildReportHTML(reportOptions = {}, autoPrint = false) {
  const now = new Date().toLocaleString();
  const safeProjectName = projectName || 'untitled-project';
  const reportBaseName = getReportBaseName();
  const selectedIds = new Set(Array.isArray(reportOptions.selectedIds) ? reportOptions.selectedIds.map(id => parseInt(id, 10)).filter(Number.isFinite) : []);
  const includeStageImage = reportOptions.includeStageImage !== false;
  const stageOrientation = reportOptions.stageOrientation === 'vertical' ? 'vertical' : 'horizontal';
  const hasSelection = selectedIds.size > 0;
  const itemFilter = instr => !hasSelection || selectedIds.has(instr.id);
  const reportGroups = [
    { key:'snakes', title:'Snakes' },
    { key:'stageboxes', title:'Stageboxes' },
    { key:'mixers', title:'Mixers' },
  ].map(group => {
    let items = [];
    if(group.key === 'snakes') items = instruments.filter(i => i && i.isSnake && itemFilter(i));
    if(group.key === 'stageboxes') items = instruments.filter(i => i && i.cat === 'stageboxes' && itemFilter(i));
    if(group.key === 'mixers') items = instruments.filter(i => i && i.isMixer && i.cat === 'mixers' && itemFilter(i));
    return { ...group, items };
  }).filter(group => group.items.length > 0);
  currentReportDrumKitCount = instruments.filter(i => i && i.type === 'drumkit' && itemFilter(i)).length;
  const reportConnections = getReportRelevantConnections(selectedIds, hasSelection);

  const stageSnapshotData = includeStageImage ? getReportStageSnapshotData(stageOrientation) : null;
  const stageSnapshotWidth = includeStageImage ? Math.max(1, Math.round(stageSnapshotData.bounds.right - stageSnapshotData.bounds.left)) : 1;
  const stageSnapshotHeight = includeStageImage ? Math.max(1, Math.round(stageSnapshotData.bounds.bottom - stageSnapshotData.bounds.top)) : 1;
  const stageCanvasWidth = stageOrientation === 'vertical' ? stageSnapshotHeight : stageSnapshotWidth;
  const stageCanvasHeight = stageOrientation === 'vertical' ? stageSnapshotWidth : stageSnapshotHeight;
  const stageImageSection = includeStageImage ? `
      <figure class="report-stage-shot ${stageOrientation}">
        <canvas id="report-stage-canvas" width="${stageCanvasWidth}" height="${stageCanvasHeight}"></canvas>
      </figure>
  ` : '';

  const cableLengthRows = bucketReportConnectionByCableLength(reportConnections).map(entry => {
    const counts = entry.counts;
    const total = Object.values(counts).reduce((sum, value) => sum + (Number(value) || 0), 0);
    return `
      <tr>
        <td>${escapeHtml(entry.family.label)}</td>
        <td>${counts['1m'] || ''}</td>
        <td>${counts['3m'] || ''}</td>
        <td>${counts['5m'] || ''}</td>
        <td>${counts['6m'] || ''}</td>
        <td>${counts['10m'] || ''}</td>
        <td>${counts[entry.family.overflowLabel] || ''}</td>
        <td>${total || ''}</td>
      </tr>
    `;
  }).join('');

  const diCount = instruments.filter(i => i && i.type === 'di' && itemFilter(i)).length;
  const standDefinitions = INSTRUMENTS
    .filter(def => def && def.cat === 'stands')
    .map(def => ({
      type: def.type,
      label: def.name || def.label || def.type || 'Stand',
    }));
  const standUsage = new Map();
  instruments.forEach(instr => {
    if(!instr || instr.cat !== 'stands' || !itemFilter(instr)) return;
    const key = instr.type || 'stand';
    standUsage.set(key, (standUsage.get(key) || 0) + 1);
  });
  standUsage.forEach((_count, type) => {
    if(standDefinitions.some(def => def.type === type)) return;
    const fallbackDef = getInstrumentDefinitionByType(type);
    standDefinitions.push({
      type,
      label: (fallbackDef && (fallbackDef.name || fallbackDef.label)) || String(type || 'Stand'),
    });
  });
  standDefinitions.sort((a, b) => String(a.label).localeCompare(String(b.label)));
  const utilityCountEntries = [
    { label: 'DI', count: diCount },
    ...standDefinitions.map(def => ({
      label: def.label,
      count: standUsage.get(def.type) || 0,
    })),
  ].filter(row => Number(row.count) > 0);
  const utilityCountRows = utilityCountEntries.map(row => `
      <tr>
        <td>${escapeHtml(row.label)}</td>
        <td>${row.count}</td>
      </tr>
    `).join('');

  const outletCardsHtml = buildBundledOutletReportCards(reportConnections);

  const reportSections = [
    outletCardsHtml ? `
    <section class="report-section">
      <h2>Outlets</h2>
      <div class="report-item-list">
        ${outletCardsHtml}
      </div>
    </section>
    ` : '',
    ...reportGroups.map(group => `
    <section class="report-section">
      <h2>${escapeHtml(group.title)} (${group.items.length})</h2>
      <div class="report-item-list">
        ${group.items.map(instr => buildReportItemCard(instr)).join('')}
      </div>
    </section>
  `)
  ].join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(reportBaseName)}.pdf</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow:wght@400;600;700&display=swap');
  :root{--bg:#ffffff;--surface:#f6f8fb;--panel:#eef3f8;--border:#cfd8e3;--accent:#0f4c7d;--accent2:#2b6ea6;--text:#172332;--muted:#5d6b7d;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Barlow',sans-serif;background:#fff;color:var(--text);padding:28px;min-height:100vh;}
  .report-cover{display:grid;gap:18px;align-content:start;margin-bottom:28px;}
  .report-header{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;border-bottom:1px solid var(--border);padding-bottom:18px;}
  .report-header h1{font-family:'Share Tech Mono',monospace;font-size:22px;color:var(--accent);letter-spacing:3px;text-transform:uppercase;line-height:1.1;}
  .report-header .meta{font-size:12px;color:var(--muted);font-family:'Share Tech Mono',monospace;white-space:nowrap;}
  .report-section{margin-bottom:24px;break-inside:avoid;}
  .report-section h2{font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:3px;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--border);}
  .report-stage-shot{border:1px solid var(--border);border-radius:14px;background:linear-gradient(180deg,#ffffff,#f8fbff);padding:10px;overflow:hidden;}
  .report-stage-shot.horizontal{aspect-ratio:16 / 9;}
  .report-stage-shot.vertical{aspect-ratio:3 / 4;max-width:520px;}
  .report-stage-shot canvas,.report-stage-shot img{display:block;width:100% !important;height:auto !important;max-width:100%;object-fit:contain;}
  .connections-page{break-before:auto;}
  .report-item-list{display:grid;gap:12px;}
  .report-item-card{border:1px solid var(--border);border-radius:14px;background:#fff;box-shadow:0 1px 0 rgba(15,76,125,.05);padding:14px;break-inside:avoid;}
  .report-item-card.snake-card{--report-key-color:#8b4fd6;}
  .report-item-card.outlet-card{--report-key-color:#6b7280;}
  .report-item-card.stagebox-card{--report-key-color:#1f8a5a;}
  .report-item-card.mixer-card{--report-key-color:#1d6fb8;}
  .report-item-card.monitor-card{--report-key-color:#c76868;}
  .report-item-card.snake-card{border-color:#ab79d8;box-shadow:inset 0 0 0 1px rgba(171,121,216,.35);}
  .report-item-card.outlet-card{border-color:#9ca3af;box-shadow:inset 0 0 0 1px rgba(156,163,175,.28);}
  .report-item-card.stagebox-card{border-color:#1f8a5a;box-shadow:inset 0 0 0 1px rgba(31,138,90,.24);}
  .report-item-card.mixer-card{border-color:#1d6fb8;box-shadow:inset 0 0 0 1px rgba(29,111,184,.24);}
  .report-item-card.monitor-card{border-color:#cf6f6f;box-shadow:inset 0 0 0 1px rgba(207,111,111,.24);}
  .report-item-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px;}
  .report-item-head h3{font-family:'Share Tech Mono',monospace;font-size:15px;color:#102033;letter-spacing:1px;text-transform:uppercase;}
  .report-item-type-meta{font-size:.8em;font-weight:400;letter-spacing:.6px;color:#73859a;opacity:.9;}
  .report-item-sub{font-size:11px;color:var(--muted);margin-top:4px;}
  .report-item-pill{font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--accent);background:#eef5fb;border:1px solid #d6e4ef;border-radius:999px;padding:3px 8px;white-space:nowrap;}
  .report-pin-group{margin-top:10px;border-top:1px solid #e7edf3;padding-top:10px;}
  .report-pin-group-title{font-family:'Share Tech Mono',monospace;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;}
  .report-pin-list{display:grid;gap:8px;}
  .report-pin-columns{display:grid;gap:10px;align-items:start;}
  .report-item-card.mixer-card .report-pin-columns,.report-item-card.stagebox-card .report-pin-columns{gap:8px;}
  .report-pin-column{display:grid;gap:8px;align-content:start;}
  .report-item-card.mixer-card .report-pin-column,.report-item-card.stagebox-card .report-pin-column{gap:6px;}
  .report-pin-line{display:grid;grid-template-columns:120px 1fr;gap:4px 12px;align-items:start;background:#fbfdff;border:1px solid #e3eaf2;border-radius:12px;padding:10px 12px;}
  .report-pin-line.compact{grid-template-columns:1fr;padding:8px 10px;}
  .report-pin-line.compact.report-pin-line-split{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:8px;row-gap:1px;min-height:34px;padding:6px 10px;align-items:center;}
  .report-pin-line.compact.report-gap-before{position:relative;}
  .report-pin-line.compact.report-gap-before::before{content:'...';position:absolute;left:25px;top:-12px;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;color:#8ea2b8;line-height:1;pointer-events:none;user-select:none;}
  .report-pin-line.compact .report-pin-main{font-size:12px;font-weight:600;}
  .report-pin-line.compact.report-pin-line-split .report-pin-key-slot{grid-column:1;grid-row:1 / span 2;display:flex;align-items:center;justify-content:center;align-self:stretch;}
  .report-pin-line.compact.report-pin-line-split .report-pin-key-slot .report-inline-key{margin-right:0;}
  .report-pin-line.compact.report-pin-line-split .report-pin-main{grid-column:2;grid-row:1;display:flex;align-items:flex-end;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.08;}
  .report-pin-mic-line{grid-column:2;grid-row:2;display:flex;align-items:flex-start;font-size:10px;line-height:1.05;color:#5f7084;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:2px;}
  .report-pin-line.compact.report-pin-line-split.report-pin-no-mic{grid-template-rows:1fr;}
  .report-pin-line.compact.report-pin-line-split.report-pin-no-mic .report-pin-key-slot{grid-row:1;align-self:center;}
  .report-pin-line.compact.report-pin-line-split.report-pin-no-mic .report-pin-main{grid-row:1;align-items:center;}
  .report-pin-line.empty{opacity:.82;}
  .report-pin-key{display:inline-flex;align-items:center;justify-content:center;min-width:56px;padding:4px 9px;border-radius:999px;background:#edf2f7;border:1px solid #c8d6e6;font-family:'Share Tech Mono',monospace;font-size:11px;color:#16304a;text-transform:uppercase;letter-spacing:1px;font-weight:700;box-shadow:0 1px 5px rgba(15,76,125,.08);}
  .report-inline-key{display:inline-flex;align-items:center;justify-content:center;min-width:30px;padding:2px 8px;margin-right:5px;border-radius:999px;background:#edf2f7;border:1px solid #c8d6e6;font-family:'Share Tech Mono',monospace;color:#16304a;text-transform:uppercase;letter-spacing:1px;font-weight:700;box-shadow:0 1px 5px rgba(15,76,125,.08);}
  .report-pin-key.report-pin-tone-input,.report-inline-key.report-pin-tone-input{background:#dbeefe;border-color:#9bc6e8;color:#124367;}
  .report-pin-key.report-pin-tone-output,.report-inline-key.report-pin-tone-output{background:#def4e8;border-color:#9dd8bd;color:#18583a;}
  .report-pin-key.report-pin-tone-other,.report-inline-key.report-pin-tone-other{background:#ebe7f6;border-color:#c2b6df;color:#463a72;}
  .report-pin-key.report-pin-tone-default,.report-inline-key.report-pin-tone-default{background:#eceff7;border-color:#cfd8e7;color:#2f4861;}
  .report-cable-hop{display:inline-flex;align-items:center;justify-content:center;min-width:34px;padding:1px 6px;margin-right:4px;border-radius:999px;font-family:'Share Tech Mono',monospace;font-size:.72em;letter-spacing:.5px;vertical-align:baseline;border:1px solid #d4dce6;background:#f3f6fa;color:#5e6d7d;opacity:.95;}
  .report-cable-hop.report-cable-hop-xlr{background:#e8f2ff;border-color:#bfd6f5;color:#2f5f96;}
  .report-cable-hop.report-cable-hop-jack{background:#efe5dd;border-color:#b39073;color:#5a3a22;}
  .report-cable-hop.report-cable-hop-ethernet{background:#e8fff2;border-color:#bce7cd;color:#26724a;}
  .report-cable-hop.report-cable-hop-speakon{background:#efe8ff;border-color:#cec0ef;color:#5b4790;}
  .report-pin-main{font-size:13px;color:#132033;font-weight:600;}
  .report-mic-inline{font-size:.86em;font-style:italic;font-weight:500;color:#5f7084;letter-spacing:.15px;}
  .report-pin-meta{grid-column:2;font-size:11px;color:var(--muted);line-height:1.4;}
  .report-pin-note{grid-column:2;font-size:11px;color:#355977;line-height:1.4;background:#eef5fb;border-left:3px solid #b9d3ea;padding:6px 8px;border-radius:6px;}
  .report-cable-totals{margin-top:6px;padding:8px 10px;border:1px solid var(--border);border-radius:10px;background:#f8fbff;font-size:11px;color:#30465d;line-height:1.4;}
  .report-cable-totals strong{font-family:'Share Tech Mono',monospace;color:var(--accent);font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-right:6px;}
  .report-cable-size-table{width:100%;border-collapse:collapse;margin-top:8px;font-size:11px;color:#30465d;}
  .report-cable-size-table{break-inside:avoid;page-break-inside:avoid;}
  .report-cable-size-table-primary{background:#f3f9ff;border:1px solid #bcd2e8;border-radius:10px;overflow:hidden;box-shadow:0 1px 0 rgba(15,76,125,.08);}
  .report-cable-size-table-primary tbody tr:nth-child(even){background:#eef6ff;}
  .report-cable-size-table-primary td:last-child,.report-cable-size-table-primary th:last-child{font-weight:700;background:#e6f1fd;}
  .report-cable-size-table th,.report-cable-size-table td{border:1px solid var(--border);padding:6px 8px;text-align:center;}
  .report-cable-size-table th:first-child,.report-cable-size-table td:first-child{text-align:left;white-space:nowrap;}
  .report-cable-size-table thead th{background:#f3f8fd;font-family:'Share Tech Mono',monospace;font-size:10px;color:var(--accent);letter-spacing:.6px;text-transform:uppercase;}
  .report-cable-size-note{margin-top:6px;font-size:10px;color:var(--muted);line-height:1.4;}
  @page{margin:10mm;}
  @media print{
    body{padding:0;}
    .report-cover{break-after:auto;page-break-after:auto;margin-bottom:14px;}
    .report-cover.with-stage-image{break-after:page;page-break-after:always;}
    .report-section{break-inside:auto;page-break-inside:auto;}
    .report-section h2{break-after:avoid;page-break-after:avoid;}
    .report-item-list{display:block;break-before:avoid;page-break-before:avoid;}
    .report-stage-shot{break-inside:avoid;page-break-inside:avoid;max-height:220mm;}
    .report-item-card{break-inside:avoid;page-break-inside:avoid;box-shadow:none;margin:0 0 12px 0;}
    .report-item-list .report-item-card:last-child{margin-bottom:0;}
    .report-item-pill{border-color:#d9e3ec;}
    .connections-page{break-before:auto;page-break-before:auto;}
  }
</style>
</head>
<body>
<section class="report-cover ${includeStageImage ? 'with-stage-image' : ''}">
  <div class="report-header">
    <h1>Project: ${escapeHtml(safeProjectName)}</h1>
    <div class="meta">Generated: ${escapeHtml(now)}</div>
  </div>
  ${stageImageSection || '<section class="report-section"><div style="color:var(--muted);font-size:13px;">Stage image not included in this report.</div></section>'}
</section>

<main class="connections-page">
  ${reportSections || '<section class="report-section"><h2>No selected items</h2><div style="color:var(--muted);font-size:13px;">Nothing selected for this report.</div></section>'}

  <section class="report-section">
    <h2>Cable Count</h2>
    ${cableLengthRows ? `
      <table class="report-cable-size-table report-cable-size-table-primary">
        <thead>
          <tr><th>Type</th><th>1m</th><th>3m</th><th>5m</th><th>6m</th><th>10m</th><th>Over</th><th>Total</th></tr>
        </thead>
        <tbody>${cableLengthRows}</tbody>
      </table>
      <div class="report-cable-size-note">Estimated from routed stage distance plus endpoint slack, then rounded up to the next stocked cable size.</div>
    ` : ''}
    ${utilityCountRows ? `
      <table class="report-cable-size-table">
        <thead>
          <tr><th>Utility</th><th>Count</th></tr>
        </thead>
        <tbody>${utilityCountRows}</tbody>
      </table>
      <div class="report-cable-size-note">Includes DI and stand types that are used in this report.</div>
    ` : ''}
  </section>
</main>

</body>
</html>`;
}

function openReportWindow(reportOptions = {}, autoPrint = false) {
  const selectedSceneIds = Array.isArray(reportOptions.selectedSceneIds)
    ? reportOptions.selectedSceneIds.map(id => parseInt(id, 10)).filter(Number.isFinite)
    : [];
  const useSceneDiffReport = !!autoPrint;
  let sceneDiffPayload = null;
  if(useSceneDiffReport) {
    try {
      sceneDiffPayload = buildSceneDiffReportPayload(reportOptions);
    } catch(err) {
      console.error('Scene diff PDF generation failed.', err);
      const sceneSummary = (Array.isArray(scenes) ? scenes : []).map((scene, index) => {
        const name = String((scene && scene.name) || `Scene ${indexToLetters(index + 1)}`);
        const id = Number(scene && scene.id) || 0;
        return `${index + 1}. ${name} (id:${id})`;
      }).join('<br>');
      const selectedSummary = (selectedSceneIds || []).join(', ');
      sceneDiffPayload = {
        html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PDF Export Error</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#1b2733;}h1{font-size:18px;margin:0 0 10px 0;}pre{white-space:pre-wrap;background:#f6f8fb;border:1px solid #d6dce5;padding:10px;border-radius:8px;}code{background:#f3f6fa;padding:2px 4px;border-radius:4px;}</style></head><body><h1>PDF export failed before rendering scene diffs</h1><p>The exporter hit a runtime error. Details are below so we can fix it directly.</p><p><strong>Selected scene IDs from dialog:</strong> ${escapeHtml(selectedSummary || '(none)')}</p><p><strong>Scenes in memory:</strong><br>${sceneSummary || '(none)'}</p><pre>${escapeHtml(String((err && err.stack) || err || 'Unknown error'))}</pre></body></html>`,
        renderData: [],
      };
    }
  }
  const html = sceneDiffPayload ? sceneDiffPayload.html : buildReportHTML(reportOptions, autoPrint);
  let win = null;
  if(reportPreviewWindow && !reportPreviewWindow.closed) {
    win = reportPreviewWindow;
  } else {
    // Reuse a named window to avoid spawning locked popups and keep main editor interactive.
    win = window.open('', 'stage_rider_report_window');
    reportPreviewWindow = win || null;
  }
  if(!win) {
    alert('Popup blocked. Please allow popups to view/export the report.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  if(sceneDiffPayload) {
    renderSceneDiffCanvases(win, sceneDiffPayload, autoPrint);
  } else {
    renderReportStageCanvas(win, reportOptions, autoPrint);
  }
  if(!autoPrint) {
    setTimeout(() => {
      try {
        window.focus();
      } catch(_err) {
        // Ignore focus failures; editing remains possible by clicking the main window.
      }
    }, 30);
  }
}

async function renderReportStageCanvas(win, reportOptions = {}, autoPrint = false) {
  if(!win || !win.document) return;
  const canvas = win.document.getElementById('report-stage-canvas');
  if(!canvas) {
    if(autoPrint) win.print();
    return;
  }
  const data = getReportStageSnapshotData(reportOptions.stageOrientation === 'vertical' ? 'vertical' : 'horizontal');
  const sourceWidth = Math.max(1, Math.round(data.bounds.right - data.bounds.left));
  const sourceHeight = Math.max(1, Math.round(data.bounds.bottom - data.bounds.top));
  const isVertical = data.orientation === 'vertical';
  const ctx = canvas.getContext('2d');
  const dpr = win.devicePixelRatio || 1;
  const supersample = 2;
  const renderScale = dpr * supersample;
  const cssWidth = isVertical ? sourceHeight : sourceWidth;
  const cssHeight = isVertical ? sourceWidth : sourceHeight;
  canvas.width = Math.max(1, Math.round(cssWidth * renderScale));
  canvas.height = Math.max(1, Math.round(cssHeight * renderScale));
  canvas.style.width = '100%';
  canvas.style.maxWidth = '100%';
  canvas.style.height = 'auto';
  ctx.scale(renderScale, renderScale);
  ctx.imageSmoothingEnabled = true;
  if('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cssWidth, cssHeight);
  const allowLegacyFallback = reportOptions.allowLegacyCanvasFallback !== false;
  const strictSharedEngine = !!reportOptions.strictSharedEngine;
  const preferSharedEngine = reportOptions.preferSharedEngine === true;

  const loadImage = async (src) => new Promise(resolve => {
    const img = new win.Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  const hasNonWhitePixels = (targetCtx, width, height) => {
    try {
      const samplePoints = [
        [Math.floor(width * 0.1), Math.floor(height * 0.1)],
        [Math.floor(width * 0.5), Math.floor(height * 0.1)],
        [Math.floor(width * 0.9), Math.floor(height * 0.1)],
        [Math.floor(width * 0.1), Math.floor(height * 0.5)],
        [Math.floor(width * 0.5), Math.floor(height * 0.5)],
        [Math.floor(width * 0.9), Math.floor(height * 0.5)],
        [Math.floor(width * 0.1), Math.floor(height * 0.9)],
        [Math.floor(width * 0.5), Math.floor(height * 0.9)],
        [Math.floor(width * 0.9), Math.floor(height * 0.9)],
      ];
      for(const [sx, sy] of samplePoints) {
        const px = targetCtx.getImageData(Math.max(0, sx), Math.max(0, sy), 1, 1).data;
        const r = px[0], g = px[1], b = px[2], a = px[3];
        // Treat near-white opaque pixels as background.
        const isNearWhite = a > 245 && r > 245 && g > 245 && b > 245;
        if(!isNearWhite) return true;
      }
      return false;
    } catch(_err) {
      // If pixel reads are unavailable, do not block rendering.
      return true;
    }
  };

  // Shared SVG engine is opt-in; default to canvas renderer for stable asset loading.
  let renderedWithSharedEngine = false;
  if(preferSharedEngine) {
    try {
      const svgUrl = buildReportStageSvg(data.orientation);
      let svgImg = await loadImage(svgUrl);
      if(!svgImg) {
        try {
          const svgBlob = await (await fetch(svgUrl)).blob();
          const blobUrl = URL.createObjectURL(svgBlob);
          svgImg = await loadImage(blobUrl);
          URL.revokeObjectURL(blobUrl);
        } catch(_err) {
          svgImg = null;
        }
      }
      if(svgImg) {
        const fit = computeFittedSceneTransform(data, cssWidth, cssHeight);
        ctx.save();
        ctx.translate(fit.ox, fit.oy);
        ctx.scale(fit.scale, fit.scale);
        ctx.drawImage(svgImg, 0, 0, sourceWidth, sourceHeight);
        ctx.restore();
        renderedWithSharedEngine = hasNonWhitePixels(ctx, cssWidth, cssHeight);
        if(!renderedWithSharedEngine) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, cssWidth, cssHeight);
        }
      }
    } catch(_err) {
      renderedWithSharedEngine = false;
    }
  }

  // Fallback path: legacy canvas renderer is enabled by default unless explicitly disabled.
  if(!renderedWithSharedEngine && allowLegacyFallback && !strictSharedEngine) {
    const images = await Promise.all(data.items.filter(item => item.image).map(item => new Promise(resolve => {
      const img = new win.Image();
      img.onload = () => resolve({ item, img });
      img.onerror = () => resolve({ item, img: null });
      img.src = resolveReportAssetUrl(item.image);
    })));
    const byKey = new Map(images.map(entry => [entry.item.id, entry.img]));
    const accessoryImages = await Promise.all(data.items.filter(item => item.accessoryImage).map(item => new Promise(resolve => {
      const img = new win.Image();
      img.onload = () => resolve({ item, img });
      img.onerror = () => resolve({ item, img: null });
      img.src = resolveReportAssetUrl(item.accessoryImage);
    })));
    const byAccessoryKey = new Map(accessoryImages.filter(entry => entry && entry.img).map(entry => [entry.item.id, entry.img]));
    const micStandImages = await Promise.all(data.items.filter(item => item.micStandImage).map(item => new Promise(resolve => {
      const img = new win.Image();
      img.onload = () => resolve({ item, img });
      img.onerror = () => resolve({ item, img: null });
      img.src = resolveReportAssetUrl(item.micStandImage);
    })));
    const byMicStandKey = new Map(micStandImages.filter(entry => entry && entry.img).map(entry => [entry.item.id, entry.img]));

    const fit = computeFittedSceneTransform(data, cssWidth, cssHeight);
    ctx.save();
    ctx.translate(fit.ox, fit.oy);
    ctx.scale(fit.scale, fit.scale);
    drawReportStageSnapshot(ctx, data, byKey, byAccessoryKey, byMicStandKey);
    ctx.restore();
  } else if(!renderedWithSharedEngine) {
    // Keep this explicit so users can tell when the shared engine fails instead of silently seeing legacy output.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = '#8a1f1f';
    ctx.font = '600 14px Barlow, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Report render failed (shared engine).', cssWidth / 2, Math.max(24, cssHeight * 0.46));
    ctx.font = '500 11px "Share Tech Mono", monospace';
    ctx.fillStyle = '#5c6570';
    ctx.fillText('Enable allowLegacyCanvasFallback only if needed.', cssWidth / 2, Math.max(42, cssHeight * 0.52));
    try {
      console.warn('Report stage: shared-engine SVG snapshot failed. Legacy fallback disabled by default.');
    } catch(_err) {
      // no-op
    }
  }
  if(autoPrint) {
    setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch(_err) {
        // Ignore print failures here; the report window is still usable.
      }
    }, 150);
  }
}

function viewReport() {
  openReportOptionsDialog(false);
}

function exportPDFReport() {
  openReportOptionsDialog(true);
}

// Backward compatibility for older UI references
function exportHTML() {
  viewReport();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EXPORT PNG
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function exportPNG() {
  const wrap=document.getElementById('canvas-wrap');
  const wr=wrap.getBoundingClientRect();
  const dpr=window.devicePixelRatio||1;
  const cv=document.createElement('canvas');
  cv.width=wr.width*dpr; cv.height=wr.height*dpr;
  const ctx=cv.getContext('2d'); ctx.scale(dpr,dpr);
  ctx.fillStyle='#0a0b0d'; ctx.fillRect(0,0,wr.width,wr.height);
  ctx.fillStyle=stageColor; ctx.strokeStyle=getStageBorderColor(stageColor); ctx.lineWidth=2;
  roundRect(ctx,stagePx.left,stagePx.top,stagePx.width,stagePx.height,9); ctx.fill(); ctx.stroke();
  if(showStageStairs) {
    const stairsWidth = Math.min(stagePx.width, 2 * pxPerM);
    const stairsDepth = 0.75 * pxPerM;
    const stairsX = stagePx.left + (stagePx.width - stairsWidth) / 2;
    const stairsY = stagePx.top + stagePx.height - 2;
    ctx.fillStyle = getStageBorderColor(stageColor);
    ctx.strokeStyle = getStageBorderColor(stageColor);
    ctx.beginPath();
    ctx.roundRect(stairsX, stairsY, stairsWidth, stairsDepth, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(10,11,13,.45)';
    const lineH = Math.max(2, stairsDepth * 0.12);
    ctx.fillRect(stairsX, stairsY + stairsDepth * 0.33, stairsWidth, lineH);
    ctx.fillRect(stairsX, stairsY + stairsDepth * 0.66, stairsWidth, lineH);
  }
  ctx.font='9px Share Tech Mono,monospace'; ctx.fillStyle='#2d3340'; ctx.textAlign='center';
  ctx.fillText('STAGE',stagePx.left+stagePx.width/2,stagePx.top+16);
  ctx.fillText(`${stageW}m Ã— ${stageD}m`,stagePx.left+stagePx.width/2,stagePx.top+28);
  ctx.drawImage(document.getElementById('conn-canvas'),0,0,wr.width,wr.height);
  instruments.forEach(instr=>{
    const ex=instr.x;
    const ey=instr.y;
    const bw=instr.size||(instr.wide?82:52);
    const angleRad = ((instr.angle||0) * Math.PI) / 180;
    const cx = ex + 4 + bw / 2;
    const cy = ey + (bw * .85) / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.translate(-cx, -cy);
    ctx.fillStyle=isSnakeBox(instr)?'#120f1a':'#1a1d24';
    ctx.strokeStyle=isSnakeBox(instr)?'#c47fff55':'#2a2e3a';
    ctx.lineWidth=1.5; roundRect(ctx,ex+4,ey,bw,bw*.85,8); ctx.fill(); ctx.stroke();
    ctx.font=Math.round(bw*.35)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(instr.icon,ex+4+bw/2,ey+bw*.4);
    ctx.restore();
    ctx.font='bold 8px Barlow,sans-serif'; ctx.fillStyle='#d4d8e2'; ctx.textBaseline='top'; ctx.textAlign='center';
    ctx.fillText(instr.label,ex+4+bw/2,ey+bw*.88);
  });
  ctx.font='9px Share Tech Mono,monospace'; ctx.fillStyle='rgba(107,114,128,.4)'; ctx.textAlign='center'; ctx.textBaseline='top';
  ctx.fillText('â—€ AUDIENCE â–¶',stagePx.left+stagePx.width/2,stagePx.top+stagePx.height+26);
  cv.toBlob(blob=>{ const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='stage-layout.png'; a.click(); URL.revokeObjectURL(url); });
}

init();

