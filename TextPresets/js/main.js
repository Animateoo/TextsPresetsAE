/**
 * TextPresets - Complete Application Logic
 * Includes: Quick Animator + Full Preset Manager
 */

// Initialize CSInterface
const csInterface = new CSInterface();

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let state = {
    // Quick Animator
    currentPresets: { entrance: [], exit: [] },
    selectedEffects: { entrance: null, exit: null },

    // Preset Manager
    currentTab: 'quick',
    currentPresetTab: 'custom',
    currentCategory: 'favorites',
    aePresets: { animateIn: [], animateOut: [] },
    customPresets: [],
    selectedPreset: null,
    editingPreset: null,
    searchQuery: '',

    // Favorites (stored as preset IDs for AE presets, effect keys for quick effects)
    favoritePresets: new Set(),
    favoriteEffects: new Set(),

    // Favorites filter toggle
    showOnlyFavorites: false,

    // Last clicked AE preset for deletion/management
    lastClickedAEPreset: null
};

// Category mapping for quick animator + AE presets
const categoryMapping = {
    'entrance-basic': ['fade_in', 'slide_up', 'slide_right'],
    'entrance-dynamic': ['bounce_in', 'pop_in', 'expand'],
    'entrance-advanced': ['zoom_blur', 'rotate_3d', 'glitch'],
    'entrance-special': ['tiktok_style', 'double_shadow'],
    'exit': ['fade_out', 'slide_down', 'zoom_out', 'shrink']
};

// Keyword-based animation mapping for AE presets
// This maps keywords in preset names to animation classes
function getAnimationForPreset(presetName) {
    const name = presetName.toLowerCase();

    // Fade animations
    if (name.includes('fade') && (name.includes('up') || name.includes('in') || name.includes('on'))) {
        return 'fade-in';
    }
    if (name.includes('fade') && (name.includes('down') || name.includes('out') || name.includes('off'))) {
        return 'fade-out';
    }
    if (name.includes('opacity') || name.includes('decoder')) {
        return 'fade-in';
    }

    // Slide animations
    if (name.includes('slide') && name.includes('up')) {
        return 'slide-up';
    }
    if (name.includes('slide') && (name.includes('down') || name.includes('out'))) {
        return 'slide-down';
    }
    if (name.includes('slide') && (name.includes('in') || name.includes('right') || name.includes('edge'))) {
        return 'slide-right';
    }

    // Drop/Fall animations
    if (name.includes('drop') || name.includes('rain')) {
        return 'slide-down';
    }

    // Fly animations
    if (name.includes('fly') && (name.includes('bottom') || name.includes('in'))) {
        return 'slide-up';
    }
    if (name.includes('fly') && (name.includes('top') || name.includes('out'))) {
        return 'slide-up';
    }

    // Pop/Bounce animations
    if (name.includes('pop') || name.includes('buzz')) {
        return 'pop-in';
    }
    if (name.includes('bounce')) {
        return 'bounce-in';
    }

    // Spin/Rotate/Twirl animations
    if (name.includes('spin') || name.includes('twirl') || name.includes('twist')) {
        return 'rotate-3d';
    }
    if (name.includes('spiral')) {
        return 'rotate-3d';
    }

    // Shuffle/Glitch/Random animations
    if (name.includes('shuffle') || name.includes('random') || name.includes('alternating')) {
        return 'glitch';
    }
    if (name.includes('decode')) {
        return 'glitch';
    }

    // Typewriter
    if (name.includes('typewriter') || name.includes('cursor')) {
        return 'fade-in';
    }

    // Straight/Wipe animations
    if (name.includes('straight') || name.includes('wipe')) {
        return 'slide-right';
    }

    // Smooth/Move
    if (name.includes('smooth') || name.includes('move')) {
        return 'slide-up';
    }

    // Stretch/Expand
    if (name.includes('stretch') || name.includes('expand')) {
        return 'expand';
    }

    // Shrink/Zoom
    if (name.includes('shrink')) {
        return 'shrink';
    }
    if (name.includes('zoom') && name.includes('out')) {
        return 'zoom-out';
    }
    if (name.includes('zoom') || name.includes('eye chart')) {
        return 'zoom-blur';
    }

    // Default fallback based on type
    if (name.includes('out') || name.includes('off')) {
        return 'fade-out';
    }

    // Default for entrance
    return 'fade-in';
}

// Animation mapping
const animationMap = {
    'fade_in': 'fade-in', 'slide_up': 'slide-up', 'slide_right': 'slide-right',
    'bounce_in': 'bounce-in', 'expand': 'expand', 'zoom_blur': 'zoom-blur',
    'glitch': 'glitch', 'rotate_3d': 'rotate-3d', 'pop_in': 'pop-in',
    'tiktok_style': 'tiktok-style', 'double_shadow': 'double-shadow',
    'fade_out': 'fade-out', 'slide_down': 'slide-down', 'zoom_out': 'zoom-out',
    'shrink': 'shrink'
};

// Icons mapping
const ICON_MAP = {
    'fade_in': '🌫️', 'slide_up': '⬆️', 'slide_right': '➡️', 'bounce_in': '🏀',
    'expand': '💥', 'zoom_blur': '🔭', 'glitch': '📺', 'rotate_3d': '🔄',
    'pop_in': '🎈', 'tiktok_style': '🎵', 'double_shadow': '👥',
    'fade_out': '🌫️', 'slide_down': '⬇️', 'zoom_out': '🔭', 'shrink': '🤏'
};

// DOM Elements
const elements = {
    // Quick Animator
    // batchModeCheckbox removed - always batch mode now
    applyEntranceBtn: document.getElementById('applyEntranceBtn'),
    applyExitBtn: document.getElementById('applyExitBtn'),
    applyBothBtn: document.getElementById('applyBothBtn'),
    resetBtn: document.getElementById('resetBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    importSRTBtn: document.getElementById('importSRTBtn'),
    srtFileInput: document.getElementById('srtFileInput'),
    status: document.getElementById('status'),
    compName: document.getElementById('compName'),
    compResolution: document.getElementById('compResolution'),
    textLayers: document.getElementById('textLayers'),
    entranceSpeed: document.getElementById('entranceSpeed'), // Optional - may not exist
    exitSpeed: document.getElementById('exitSpeed'), // Optional - may not exist
    entranceSpeedValue: document.getElementById('entranceSpeedValue'), // Optional
    exitSpeedValue: document.getElementById('exitSpeedValue'), // Optional
    saveSelectionBtn: document.getElementById('saveSelectionBtn'), // New button
    renamePresetBtn: document.getElementById('renamePresetBtn'), // New button
    deleteSelectedPresetBtn: document.getElementById('deleteSelectedPresetBtn'), // New button

    // Preset Manager
    presetSearch: document.getElementById('presetSearch'),
    presetGrid: document.getElementById('presetGrid'),
    createPresetBtn: document.getElementById('createPresetBtn'),
    importPresetsBtn: document.getElementById('importPresetsBtn'),
    exportPresetsBtn: document.getElementById('exportPresetsBtn'),
    applyPresetBtn: document.getElementById('applyPresetBtn'),
    presetImportInput: document.getElementById('presetImportInput'),

    // Modal
    presetModal: document.getElementById('presetModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalClose: document.getElementById('modalClose'),
    presetName: document.getElementById('presetName'),
    presetType: document.getElementById('presetType'),
    baseEntranceAnim: document.getElementById('baseEntranceAnim'),
    baseExitAnim: document.getElementById('baseExitAnim'),
    modalEntranceSpeed: document.getElementById('modalEntranceSpeed'),
    modalExitSpeed: document.getElementById('modalExitSpeed'),
    modalEntranceSpeedValue: document.getElementById('modalEntranceSpeedValue'),
    modalExitSpeedValue: document.getElementById('modalExitSpeedValue'),
    presetFavorite: document.getElementById('presetFavorite'),
    cancelPresetBtn: document.getElementById('cancelPresetBtn'),
    savePresetBtn: document.getElementById('savePresetBtn')
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    console.log('Initializing TextPresets...');

    // Load saved state first so it's available for populate functions
    loadState();

    // Load quick animator presets
    loadPresets();

    // Update comp info
    updateCompInfo();

    // Setup event listeners
    setupEventListeners();

    // Load AE presets
    loadAEPresets();

    // Load custom presets
    loadCustomPresets();

    setStatus('Listo', 'success');

    // Welcome message in debug log
    setTimeout(() => {
        debugLog('🎬 TextPresets iniciado correctamente', 'success');
        debugLog('Click en el botón 🐛 para mostrar/ocultar este panel', 'info');
    }, 100);
}

// ============================================================================
// DEBUG LOGGING (Visible in UI)
// ============================================================================

function debugLog(message, type = 'info') {
    const debugLogEl = document.getElementById('debugLog');
    const debugContent = document.getElementById('debugLogContent');

    if (!debugLogEl || !debugContent) return;

    // Show debug log
    // debugLogEl.style.display = 'block';

    // Create log entry
    const entry = document.createElement('div');
    entry.style.marginBottom = '2px';
    entry.style.fontSize = '10px';

    const timestamp = new Date().toLocaleTimeString();

    // Color based on type
    let color = '#0f0'; // green for info
    let icon = 'ℹ️';
    if (type === 'error') {
        color = '#f00';
        icon = '❌';
    } else if (type === 'success') {
        color = '#0f0';
        icon = '✅';
    } else if (type === 'warning') {
        color = '#ff0';
        icon = '⚠️';
    }

    entry.style.color = color;
    entry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> ${icon} ${message}`;

    debugContent.appendChild(entry);

    // Auto-scroll to bottom
    debugContent.scrollTop = debugContent.scrollHeight;

    // Keep only last 50 entries
    while (debugContent.children.length > 50) {
        debugContent.removeChild(debugContent.firstChild);
    }

    // Also log to console
    console.log(`[${timestamp}] ${message}`);
}

function clearDebugLog() {
    const debugContent = document.getElementById('debugLogContent');
    if (debugContent) {
        debugContent.innerHTML = '';
    }
}


function loadPresets() {
    evalScript('$.global.getPresets()', function (result) {
        try {
            const data = JSON.parse(result);
            if (data.error) {
                console.error('Error loading presets:', data.error);
                setStatus('Error cargando presets', 'error');
                return;
            }
            state.currentPresets = data;
            populateEffectGrid();
        } catch (e) {
            console.error('Error parsing presets:', e);
            setStatus('Error: ' + e.message, 'error');
        }
    });
}

function loadAEPresets() {
    // Get extension path and use local presets folder
    const extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    const aePresetsPath = extensionPath + "/presets";

    console.log('Loading AE presets from extension:', aePresetsPath);

    evalScript(`$.global.scanAEPresets("${aePresetsPath.replace(/\\/g, '\\\\')}")`, function (result) {
        console.log('AE Presets scan result:', result);

        try {
            const data = JSON.parse(result);
            if (data.error) {
                console.log('AE Presets not available:', data.error);
                setStatus('Presets de AE no disponibles: ' + data.error, 'error');
                return;
            }

            console.log('AE Presets loaded:', data);
            state.aePresets = data;

            // Always populate the grids in the quick tab
            populateAEPresetGrids();

            updateCategoryCounts();

            // Also render grid if we're on AE presets tab
            if (state.currentPresetTab === 'ae') {
                renderPresetGrid();
            }

            const totalPresets = (data.animateIn?.length || 0) + (data.animateOut?.length || 0);
            console.log(`Loaded ${totalPresets} AE presets (${data.animateIn?.length || 0} entrance, ${data.animateOut?.length || 0} exit)`);

            if (totalPresets > 0) {
                setStatus(`✓ ${totalPresets} presets de AE cargados`, 'success');
            }

        } catch (e) {
            console.error('Could not load AE presets:', e);
            setStatus('Error cargando presets de AE', 'error');
        }
    });
}

function loadCustomPresets() {
    evalScript('$.global.loadCustomPresets()', function (result) {
        try {
            const data = JSON.parse(result);
            if (!data.error) {
                state.customPresets = data;
                updateCategoryCounts();
                if (state.currentPresetTab === 'custom') {
                    renderPresetGrid();
                }
            }
        } catch (e) {
            console.log('Could not load custom presets:', e);
        }
    });
}

// ============================================================================
// QUICK ANIMATOR FUNCTIONS
// ============================================================================

function populateEffectGrid() {
    const showOnlyFavorites = state.showOnlyFavorites || false;

    // Populate built-in presets
    Object.keys(categoryMapping).forEach(categoryId => {
        const gridElement = document.getElementById(`grid-${categoryId}`);
        if (!gridElement) return;

        gridElement.innerHTML = '';
        const effectKeys = categoryMapping[categoryId];
        const isExit = categoryId === 'exit';
        const presetList = isExit ? state.currentPresets.exit : state.currentPresets.entrance;

        effectKeys.forEach(effectKey => {
            const preset = presetList.find(p => p.key === effectKey);
            if (!preset) return;

            // Filter by favorites if toggle is active
            if (showOnlyFavorites && !state.favoriteEffects.has(effectKey)) {
                return;
            }

            const effectBtn = createEffectButton(preset, isExit);
            gridElement.appendChild(effectBtn);
        });
    });

    // Populate AE presets
    populateAEPresetGrids();
}

function populateFlatFavorites() {
    const flatGrid = document.getElementById('favoritesFlatGrid');
    if (!flatGrid) return;

    flatGrid.innerHTML = '';

    const allFavorites = [];

    // Collect all favorite quick effects
    state.favoriteEffects.forEach(effectKey => {
        const preset = [...state.currentPresets.entrance, ...state.currentPresets.exit]
            .find(p => p.key === effectKey);
        if (preset) {
            const isExit = state.currentPresets.exit.some(p => p.key === effectKey);
            allFavorites.push({ preset, isExit, isQuick: true });
        }
    });

    // Collect all favorite AE presets
    const favAEEntrance = (state.aePresets.animateIn || [])
        .filter(p => state.favoritePresets.has(p.id));
    const favAEExit = (state.aePresets.animateOut || [])
        .filter(p => state.favoritePresets.has(p.id));

    favAEEntrance.forEach(preset => {
        allFavorites.push({ preset, isExit: false, isQuick: false });
    });

    favAEExit.forEach(preset => {
        allFavorites.push({ preset, isExit: true, isQuick: false });
    });

    // Show message if no favorites
    if (allFavorites.length === 0) {
        flatGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No hay favoritos<br>Haz click en ☆ para agregar</div>';
        return;
    }

    // Create buttons for all favorites
    allFavorites.forEach(({ preset, isExit, isQuick }) => {
        const effectBtn = isQuick
            ? createEffectButton(preset, isExit)
            : createAEPresetButton(preset, isExit);
        flatGrid.appendChild(effectBtn);
    });
}


function populateAEPresetGrids() {
    const showOnlyFavorites = state.showOnlyFavorites || false;

    // Populate AE Entrance presets (ONLY official ones, NOT custom)
    const aeEntranceGrid = document.getElementById('grid-ae-entrance');
    if (aeEntranceGrid) {
        aeEntranceGrid.innerHTML = '';

        let entrancePresets = (state.aePresets.animateIn || []).filter(p => !p.isCustom);

        // Filter by favorites if toggle is active
        if (showOnlyFavorites) {
            entrancePresets = entrancePresets.filter(p => state.favoritePresets.has(p.id));
        }

        if (entrancePresets.length > 0) {
            entrancePresets.forEach(preset => {
                const effectBtn = createAEPresetButton(preset, false);
                aeEntranceGrid.appendChild(effectBtn);
            });
            console.log(`Populated ${entrancePresets.length} AE entrance presets`);
        } else {
            aeEntranceGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #666; font-size: 11px;">No se encontraron presets de entrada</div>';
        }
    }

    // Populate Custom Presets from animate folder (NEW!)
    const aeCustomGrid = document.getElementById('grid-ae-custom');
    if (aeCustomGrid) {
        aeCustomGrid.innerHTML = '';

        // Get custom presets from animateIn (they're duplicated in both arrays)
        let customPresets = (state.aePresets.animateIn || []).filter(p => p.isCustom);

        // Filter by favorites if toggle is active
        if (showOnlyFavorites) {
            customPresets = customPresets.filter(p => state.favoritePresets.has(p.id));
        }

        if (customPresets.length > 0) {
            customPresets.forEach(preset => {
                // Show as entrance by default (can be used for both)
                const effectBtn = createAEPresetButton(preset, false);
                aeCustomGrid.appendChild(effectBtn);
            });
            console.log(`Populated ${customPresets.length} custom presets from animate folder`);
        } else {
            aeCustomGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #666; font-size: 11px;">📂 No hay presets personalizados<br>Importa archivos .ffx a la carpeta "animate"</div>';
        }
    }

    // Populate AE Exit presets (ONLY official ones, NOT custom)
    const aeExitGrid = document.getElementById('grid-ae-exit');
    if (aeExitGrid) {
        aeExitGrid.innerHTML = '';

        let exitPresets = (state.aePresets.animateOut || []).filter(p => !p.isCustom);

        // Filter by favorites if toggle is active
        if (showOnlyFavorites) {
            exitPresets = exitPresets.filter(p => state.favoritePresets.has(p.id));
        }

        if (exitPresets.length > 0) {
            exitPresets.forEach(preset => {
                const effectBtn = createAEPresetButton(preset, true);
                aeExitGrid.appendChild(effectBtn);
            });
            console.log(`Populated ${exitPresets.length} AE exit presets`);
        } else {
            aeExitGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #666; font-size: 11px;">No se encontraron presets de salida</div>';
        }
    }
}
function createAEPresetButton(preset, isExit) {
    const btn = document.createElement('div');
    btn.className = 'effect-btn';
    btn.dataset.presetPath = preset.path;
    btn.dataset.presetName = preset.name;
    btn.dataset.presetId = preset.id;
    btn.dataset.effectType = isExit ? 'exit' : 'entrance';
    btn.dataset.isAEPreset = 'true';

    // Nombre del preset
    const nameDiv = document.createElement('div');
    nameDiv.className = 'effect-name';
    nameDiv.textContent = `🎬 ${preset.name}`;

    // ⭐ BOTÓN DE FAVORITO
    const starBtn = document.createElement('button');
    starBtn.className = 'favorite-star';
    starBtn.innerHTML = state.favoritePresets.has(preset.id) ? '⭐' : '☆';
    starBtn.title = 'Agregar a favoritos';
    starBtn.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(preset.id, starBtn);
    };

    btn.appendChild(nameDiv);
    btn.appendChild(starBtn);

    // Click handler para seleccionar
    btn.addEventListener('click', () => handleAEPresetClick(btn, preset, isExit));

    return btn;
}

function handleAEPresetClick(btn, preset, isExit) {
    const effectType = isExit ? 'exit' : 'entrance';

    // Deselect all AE presets of this type
    document.querySelectorAll(`.effect-btn[data-is-ae-preset="true"][data-effect-type="${effectType}"]`).forEach(b => {
        b.classList.remove('selected', 'selected-entrance', 'selected-exit');
    });

    // Also deselect built-in presets of this type
    document.querySelectorAll(`.effect-btn[data-effect-type="${effectType}"]:not([data-is-ae-preset])`).forEach(b => {
        b.classList.remove('selected', 'selected-entrance', 'selected-exit');
    });

    // Select this preset
    btn.classList.add('selected', `selected-${effectType}`);

    // Store AE preset info in state
    state.selectedEffects[effectType] = {
        isAEPreset: true,
        path: preset.path,
        name: preset.name
    };

    // Track last clicked for single-item deletion
    state.lastClickedAEPreset = state.selectedEffects[effectType];

    saveState();
}

function createEffectButton(preset, isExit) {
    const btn = document.createElement('div');
    btn.className = 'effect-btn';
    btn.dataset.effectKey = preset.key;
    btn.dataset.effectType = isExit ? 'exit' : 'entrance';

    // Nombre del efecto
    const nameDiv = document.createElement('div');
    nameDiv.className = 'effect-name';
    const icon = ICON_MAP[preset.key] || '🎬';
    nameDiv.textContent = `${icon} ${preset.name}`;

    // ⭐ BOTÓN DE FAVORITO
    const starBtn = document.createElement('button');
    starBtn.className = 'favorite-star';
    starBtn.innerHTML = state.favoriteEffects.has(preset.key) ? '⭐' : '☆';
    starBtn.title = 'Agregar a favoritos';
    starBtn.onclick = (e) => {
        e.stopPropagation();
        toggleEffectFavorite(preset.key, starBtn);
    };

    btn.appendChild(nameDiv);
    btn.appendChild(starBtn);

    btn.addEventListener('click', () => {
        handleEffectClick(btn, preset.key, isExit);
        updatePreview(preset.key, preset.name, isExit);
    });

    return btn;
}

function handleEffectHover(btn, effectKey, previewText) {
    const animClass = animationMap[effectKey];
    if (animClass) {
        previewText.classList.add('animate-' + animClass);
    }
}

function handleEffectLeave(previewText, effectKey) {
    const animClass = animationMap[effectKey];
    if (animClass) {
        previewText.classList.remove('animate-' + animClass);
    }
}

function updatePreview(effectKey, effectName, isExit) {
    const previewText = document.getElementById('previewText');
    const previewName = document.getElementById('previewName');
    const previewDisplay = document.querySelector('.preview-display');

    if (!previewText || !previewName) return;

    // Store current effect for replay
    previewDisplay.dataset.currentEffect = effectKey;
    previewDisplay.dataset.currentName = effectName;

    // Remove all animation classes
    previewText.className = 'preview-text';

    // Update name
    previewName.textContent = effectName;

    // Add animation class
    const animClass = animationMap[effectKey];
    if (animClass) {
        // Small delay to restart animation
        setTimeout(() => {
            previewText.classList.add('animate-' + animClass);
        }, 50);
    }
}

// Add click handler to preview display (only once)
if (!window.previewClickHandlerAdded) {
    const previewDisplay = document.querySelector('.preview-display');
    if (previewDisplay) {
        previewDisplay.addEventListener('click', () => {
            const effectKey = previewDisplay.dataset.currentEffect;
            const effectName = previewDisplay.dataset.currentName;
            if (effectKey) {
                updatePreview(effectKey, effectName, false);
            }
        });
        window.previewClickHandlerAdded = true;
    }
}



function handleEffectClick(btn, effectKey, isExit) {
    const effectType = isExit ? 'exit' : 'entrance';

    if (state.selectedEffects[effectType] === effectKey) {
        state.selectedEffects[effectType] = null;
        btn.classList.remove('selected', 'selected-entrance', 'selected-exit');
    } else {
        const previousBtn = document.querySelector(`.effect-btn.selected-${effectType}`);
        if (previousBtn) {
            previousBtn.classList.remove('selected', 'selected-entrance', 'selected-exit');
        }

        state.selectedEffects[effectType] = effectKey;
        btn.classList.add('selected', `selected-${effectType}`);
    }

    saveState();
}

function handleApply(mode) {
    const batchMode = false; // Apply only to selected text layers
    let entranceKey = 'null';
    let exitKey = 'null';
    let entranceAEPreset = null;
    let exitAEPreset = null;

    if (mode === 'entrance' || mode === 'both') {
        const entrance = state.selectedEffects.entrance;
        if (entrance) {
            if (typeof entrance === 'object' && entrance.isAEPreset) {
                entranceAEPreset = entrance;
            } else {
                entranceKey = entrance;
            }
        }
    }

    if (mode === 'exit' || mode === 'both') {
        const exit = state.selectedEffects.exit;
        if (exit) {
            if (typeof exit === 'object' && exit.isAEPreset) {
                exitAEPreset = exit;
            } else {
                exitKey = exit;
            }
        }
    }

    if (entranceKey === 'null' && exitKey === 'null' && !entranceAEPreset && !exitAEPreset) {
        setStatus('Selecciona al menos un efecto', 'error');
        return;
    }

    elements.applyEntranceBtn.disabled = true;
    elements.applyExitBtn.disabled = true;
    elements.applyBothBtn.disabled = true;

    const modeText = mode === 'entrance' ? 'entrada' : mode === 'exit' ? 'salida' : 'ambas';
    setStatus(`Aplicando animación de ${modeText}...`, 'loading');

    // If using AE presets, apply them directly
    if (entranceAEPreset || exitAEPreset) {
        applyAEPresetsSequentially(entranceAEPreset, exitAEPreset, batchMode, () => {
            elements.applyEntranceBtn.disabled = false;
            elements.applyExitBtn.disabled = false;
            elements.applyBothBtn.disabled = false;
        });
    } else {
        // Use built-in presets
        const entSpeed = elements.entranceSpeed.value;
        const exSpeed = elements.exitSpeed.value;

        const script = `$.global.applyAnimations('${entranceKey}', '${exitKey}', ${batchMode}, ${entSpeed}, ${exSpeed})`;

        evalScript(script, function (result) {
            elements.applyEntranceBtn.disabled = false;
            elements.applyExitBtn.disabled = false;
            elements.applyBothBtn.disabled = false;

            try {
                const data = JSON.parse(result);

                if (data.error) {
                    setStatus(`Error: ${data.error}`, 'error');
                    return;
                }

                if (data.success) {
                    const message = `✓ ${data.layersAnimated} capas animadas`;
                    setStatus(message, 'success');
                    updateCompInfo();
                }

            } catch (e) {
                setStatus(`Error: ${e.message}`, 'error');
            }
            elements.applyEntranceBtn.disabled = false;
            elements.applyExitBtn.disabled = false;
            elements.applyBothBtn.disabled = false;
        });
    }
}

function applyAEPresetsSequentially(entrancePreset, exitPreset, batchMode, callback) {
    let totalLayers = 0;
    let hasError = false;
    // Apply entrance first, then exit (sequential, not parallel)
    if (entrancePreset && exitPreset) {
        // Both presets: apply entrance first
        const escapedPath1 = entrancePreset.path.replace(/\\/g, '\\\\');
        const script1 = `$.global.applyFFXPreset("${escapedPath1}", ${batchMode}, "entrance")`;

        console.log('Applying entrance preset:', entrancePreset.name);

        evalScript(script1, function (result1) {
            console.log('Entrance result:', result1);
            try {
                const data1 = JSON.parse(result1);
                if (data1.success) {
                    totalLayers = data1.layersAnimated;

                    // Now apply exit preset
                    const escapedPath2 = exitPreset.path.replace(/\\/g, '\\\\');
                    const script2 = `$.global.applyFFXPreset("${escapedPath2}", ${batchMode}, "exit")`;

                    console.log('Applying exit preset:', exitPreset.name);

                    evalScript(script2, function (result2) {
                        console.log('Exit result:', result2);
                        try {
                            const data2 = JSON.parse(result2);
                            if (data2.success) {
                                setStatus(`✓ ${totalLayers} capas animadas (entrada + salida)`, 'success');
                                updateCompInfo();
                            } else if (data2.error) {
                                setStatus('Error aplicando salida: ' + data2.error, 'error');
                            }
                        } catch (e) {
                            console.error('Error parsing exit result:', e);
                            setStatus('Error aplicando salida', 'error');
                        }
                        if (callback) callback();
                    });
                } else if (data1.error) {
                    setStatus('Error aplicando entrada: ' + data1.error, 'error');
                    if (callback) callback();
                }
            } catch (e) {
                console.error('Error parsing entrance result:', e);
                setStatus('Error aplicando entrada', 'error');
                if (callback) callback();
            }
        });
    } else if (entrancePreset) {
        // Only entrance
        const escapedPath = entrancePreset.path.replace(/\\/g, '\\\\');
        const script = `$.global.applyFFXPreset("${escapedPath}", ${batchMode}, "entrance")`;

        console.log('Applying entrance preset:', entrancePreset.name);

        evalScript(script, function (result) {
            console.log('Entrance result:', result);
            try {
                const data = JSON.parse(result);
                if (data.success) {
                    totalLayers = data.layersAnimated;
                    setStatus(`✓ ${totalLayers} capas animadas (entrada)`, 'success');
                    updateCompInfo();
                } else if (data.error) {
                    setStatus('Error: ' + data.error, 'error');
                }
            } catch (e) {
                console.error('Error:', e);
                setStatus('Error aplicando preset', 'error');
            }
            if (callback) callback();
        });
    } else if (exitPreset) {
        // Only exit
        const escapedPath = exitPreset.path.replace(/\\/g, '\\\\');
        const script = `$.global.applyFFXPreset("${escapedPath}", ${batchMode}, "exit")`;

        console.log('Applying exit preset:', exitPreset.name);

        evalScript(script, function (result) {
            console.log('Exit result:', result);
            try {
                const data = JSON.parse(result);
                if (data.success) {
                    totalLayers = data.layersAnimated;
                    setStatus(`✓ ${totalLayers} capas animadas (salida)`, 'success');
                    updateCompInfo();
                } else if (data.error) {
                    setStatus('Error: ' + data.error, 'error');
                }
            } catch (e) {
                console.error('Error:', e);
                setStatus('Error aplicando preset', 'error');
            }
            if (callback) callback();
        });
    }
}

// ============================================================================
// PRESET MANAGER FUNCTIONS
// ============================================================================

function renderPresetGrid() {
    const grid = document.getElementById('presetGrid');
    if (!grid) return;

    grid.innerHTML = '';

    let presets = [];

    // Get presets based on current tab and category
    if (state.currentPresetTab === 'custom') {
        if (state.currentCategory === 'favorites') {
            // Show favorited AE presets AND quick effects in favorites view
            const favEntrance = (state.aePresets.animateIn || []).filter(p => state.favoritePresets.has(p.id));
            const favExit = (state.aePresets.animateOut || []).filter(p => state.favoritePresets.has(p.id));

            // Add favorite quick effects
            const favoriteQuickEffects = [];
            state.favoriteEffects.forEach(effectKey => {
                const preset = [...state.currentPresets.entrance, ...state.currentPresets.exit]
                    .find(p => p.key === effectKey);
                if (preset) {
                    favoriteQuickEffects.push({
                        ...preset,
                        id: effectKey,
                        isQuickEffect: true
                    });
                }
            });

            presets = [...favEntrance, ...favExit, ...favoriteQuickEffects];
        } else {
            presets = state.customPresets;
        }
    } else if (state.currentPresetTab === 'ae') {
        if (state.currentCategory === 'animate-in') {
            presets = state.aePresets.animateIn || [];
        } else if (state.currentCategory === 'animate-out') {
            presets = state.aePresets.animateOut || [];
        }
    }

    // Apply search filter
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        presets = presets.filter(p => p.name.toLowerCase().includes(query));
    }

    if (presets.length === 0) {
        const message = state.currentCategory === 'favorites'
            ? 'No hay presets favoritos<br>Haz click en ☆ en el tab Rápido para agregar'
            : 'No hay presets disponibles';
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">${message}</div>`;
        return;
    }

    presets.forEach(preset => {
        const card = createPresetCard(preset);
        grid.appendChild(card);
    });
}

function createPresetCard(preset) {
    const card = document.createElement('div');
    card.className = 'preset-card';
    if (state.selectedPreset && state.selectedPreset.id === preset.id) {
        card.classList.add('selected');
    }

    const thumbnail = document.createElement('div');
    thumbnail.className = 'preset-thumbnail';

    const thumbnailText = document.createElement('div');
    thumbnailText.className = 'preset-thumbnail-text';
    thumbnailText.textContent = 'ABC';

    // Add animation class if it's a quick effect or has baseEntrance
    let animClass = null;
    if (preset.isQuickEffect && preset.key) {
        animClass = animationMap[preset.key];
    } else if (preset.baseEntrance && animationMap[preset.baseEntrance]) {
        animClass = animationMap[preset.baseEntrance];
    } else if (preset.name) {
        // For AE presets, use keyword mapping
        animClass = getAnimationForPreset(preset.name);
    }

    if (animClass) {
        thumbnailText.dataset.animation = animClass;
    }

    thumbnail.appendChild(thumbnailText);

    // Add hover animation
    card.addEventListener('mouseenter', () => {
        if (animClass) {
            thumbnailText.classList.add('animate-' + animClass);
        }
    });

    card.addEventListener('mouseleave', () => {
        if (animClass) {
            thumbnailText.classList.remove('animate-' + animClass);
        }
    });

    const info = document.createElement('div');
    info.className = 'preset-info';

    const name = document.createElement('div');
    name.className = 'preset-name';
    name.textContent = preset.name;

    const meta = document.createElement('div');
    meta.className = 'preset-meta';

    const badge = document.createElement('span');
    badge.className = `preset-badge ${preset.type || 'both'}`;
    badge.textContent = preset.type === 'entrance' ? 'Entrada' : preset.type === 'exit' ? 'Salida' : 'Ambos';

    const actionsBtn = document.createElement('button');
    actionsBtn.className = 'preset-actions-btn';
    actionsBtn.textContent = '⋮';
    actionsBtn.onclick = (e) => {
        e.stopPropagation();
        showPresetContextMenu(preset, e);
    };

    meta.appendChild(badge);
    if (preset.isCustom !== false) {
        meta.appendChild(actionsBtn);
    }

    info.appendChild(name);
    info.appendChild(meta);

    card.appendChild(thumbnail);
    card.appendChild(info);

    card.onclick = () => selectPreset(preset);

    return card;
}

function selectPreset(preset) {
    state.selectedPreset = preset;
    renderPresetGrid();
}

function showPresetContextMenu(preset, event) {
    // Simple implementation: show options
    const options = ['Editar', 'Duplicar', 'Eliminar'];
    const choice = prompt(`Preset: ${preset.name}\n\n1. Editar\n2. Duplicar\n3. Eliminar\n\nElige opción (1-3):`);

    if (choice === '1') {
        editPreset(preset);
    } else if (choice === '2') {
        duplicatePreset(preset);
    } else if (choice === '3') {
        deletePreset(preset);
    }
}

function openPresetCreator() {
    state.editingPreset = null;
    elements.modalTitle.textContent = 'Crear Nuevo Preset';
    elements.presetName.value = '';
    elements.presetType.value = 'entrance';
    elements.baseEntranceAnim.value = 'fade_in';
    elements.baseExitAnim.value = 'fade_out';
    elements.modalEntranceSpeed.value = '1.0';
    elements.modalExitSpeed.value = '1.0';
    elements.modalEntranceSpeedValue.textContent = '1.0x';
    elements.modalExitSpeedValue.textContent = '1.0x';
    elements.presetFavorite.checked = false;

    elements.presetModal.classList.add('active');
}

function editPreset(preset) {
    state.editingPreset = preset;
    elements.modalTitle.textContent = 'Editar Preset';
    elements.presetName.value = preset.name;
    elements.presetType.value = preset.type || 'both';
    elements.baseEntranceAnim.value = preset.baseEntrance || 'fade_in';
    elements.baseExitAnim.value = preset.baseExit || 'fade_out';
    elements.modalEntranceSpeed.value = preset.entranceSpeed || '1.0';
    elements.modalExitSpeed.value = preset.exitSpeed || '1.0';
    elements.modalEntranceSpeedValue.textContent = (preset.entranceSpeed || '1.0') + 'x';
    elements.modalExitSpeedValue.textContent = (preset.exitSpeed || '1.0') + 'x';
    elements.presetFavorite.checked = preset.favorite || false;

    elements.presetModal.classList.add('active');
}

function savePreset() {
    const presetData = {
        id: state.editingPreset ? state.editingPreset.id : 'custom_' + Date.now(),
        name: elements.presetName.value || 'Nuevo Preset',
        type: elements.presetType.value,
        baseEntrance: elements.baseEntranceAnim.value,
        baseExit: elements.baseExitAnim.value,
        entranceSpeed: parseFloat(elements.modalEntranceSpeed.value),
        exitSpeed: parseFloat(elements.modalExitSpeed.value),
        favorite: elements.presetFavorite.checked,
        isCustom: true,
        created: state.editingPreset ? state.editingPreset.created : new Date().toISOString()
    };

    const script = `$.global.saveCustomPreset(${JSON.stringify(JSON.stringify(presetData))})`;

    evalScript(script, function (result) {
        try {
            const data = JSON.parse(result);
            if (data.success) {
                setStatus('✓ Preset guardado', 'success');
                loadCustomPresets();
                closeModal();
            } else {
                setStatus('Error guardando preset', 'error');
            }
        } catch (e) {
            setStatus('Error: ' + e.message, 'error');
        }
    });
}

function duplicatePreset(preset) {
    const newPreset = {
        ...preset,
        id: 'custom_' + Date.now(),
        name: preset.name + ' (Copia)',
        created: new Date().toISOString()
    };

    const script = `$.global.saveCustomPreset(${JSON.stringify(JSON.stringify(newPreset))})`;

    evalScript(script, function (result) {
        try {
            const data = JSON.parse(result);
            if (data.success) {
                setStatus('✓ Preset duplicado', 'success');
                loadCustomPresets();
            }
        } catch (e) {
            setStatus('Error: ' + e.message, 'error');
        }
    });
}

function deletePreset(preset) {
    if (!confirm(`¿Eliminar preset "${preset.name}"?`)) return;

    const script = `$.global.deleteCustomPreset("${preset.id}")`;

    evalScript(script, function (result) {
        try {
            const data = JSON.parse(result);
            if (data.success) {
                setStatus('✓ Preset eliminado', 'success');
                state.selectedPreset = null;
                loadCustomPresets();
            }
        } catch (e) {
            setStatus('Error: ' + e.message, 'error');
        }
    });
}

function applySelectedPreset() {
    if (!state.selectedPreset) {
        setStatus('Selecciona un preset primero', 'error');
        return;
    }

    const preset = state.selectedPreset;
    const batchMode = false; // Apply only to selected text layers

    // If it's an AE preset (.ffx file)
    if (preset.path) {
        const script = `$.global.applyFFXPreset("${preset.path}", ${batchMode})`;

        setStatus('Aplicando preset de AE...', 'loading');

        evalScript(script, function (result) {
            try {
                const data = JSON.parse(result);
                if (data.success) {
                    setStatus(`✓ ${data.layersAnimated} capas animadas`, 'success');
                    updateCompInfo();
                } else {
                    setStatus('Error: ' + data.error, 'error');
                }
            } catch (e) {
                setStatus('Error: ' + e.message, 'error');
            }
        });
    } else {
        // Custom preset - apply using built-in animations
        const entranceKey = preset.baseEntrance || 'null';
        const exitKey = preset.baseExit || 'null';
        const entSpeed = preset.entranceSpeed || 1.0;
        const exSpeed = preset.exitSpeed || 1.0;

        const script = `$.global.applyAnimations('${entranceKey}', '${exitKey}', ${batchMode}, ${entSpeed}, ${exSpeed})`;

        setStatus('Aplicando preset...', 'loading');

        evalScript(script, function (result) {
            try {
                const data = JSON.parse(result);
                if (data.success) {
                    setStatus(`✓ ${data.layersAnimated} capas animadas`, 'success');
                    updateCompInfo();
                } else {
                    setStatus('Error: ' + data.error, 'error');
                }
            } catch (e) {
                setStatus('Error: ' + e.message, 'error');
            }
        });
    }
}

function closeModal() {
    elements.presetModal.classList.remove('active');
}

function updateCategoryCounts() {
    // Update custom presets count
    const customCount = document.getElementById('count-custom');
    if (customCount) {
        customCount.textContent = state.customPresets.length;
    }

    // Update favorites count (AE presets + built-in effects)
    const favoritesCount = document.getElementById('count-favorites');
    if (favoritesCount) {
        const total = state.favoritePresets.size + state.favoriteEffects.size;
        favoritesCount.textContent = total;
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // IMPORTAR PRESET .FFX - Configuración corregida
    const importPresetBtn = document.getElementById('importPresetBtn');
    const presetImportInput = document.getElementById('presetImportInput');

    if (importPresetBtn && presetImportInput) {
        importPresetBtn.addEventListener('click', function () {
            debugLog('📂 Botón de importar clickeado - Abriendo explorador...', 'info');
            presetImportInput.click();
        });
        presetImportInput.addEventListener('change', handlePresetFilesSelected);
        debugLog('✅ Botón de importar preset configurado correctamente', 'success');
    } else {
        debugLog('❌ ERROR: No se encontró importPresetBtn o presetImportInput', 'error');
    }

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            e.target.classList.add('active');
            const tabId = e.target.dataset.tab;
            document.getElementById(`tab-${tabId}`).classList.add('active');
            state.currentTab = tabId;
        });
    });

    // Preset sub-tabs
    document.querySelectorAll('.preset-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.preset-tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            state.currentPresetTab = e.target.dataset.presetTab;
            state.currentCategory = state.currentPresetTab === 'custom' ? 'custom' : 'animate-in';

            // Update active category
            document.querySelectorAll('.preset-category').forEach(c => c.classList.remove('active'));
            const activeCategory = document.querySelector(`[data-category="${state.currentCategory}"]`);
            if (activeCategory) activeCategory.classList.add('active');

            renderPresetGrid();
        });
    });

    // Category selection
    document.querySelectorAll('.preset-category').forEach(cat => {
        cat.addEventListener('click', (e) => {
            document.querySelectorAll('.preset-category').forEach(c => c.classList.remove('active'));
            cat.classList.add('active');

            state.currentCategory = cat.dataset.category;
            renderPresetGrid();
        });
    });

    // Search
    if (elements.presetSearch) {
        elements.presetSearch.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderPresetGrid();
        });
    }

    // Favorites toggle button
    const favoritesToggleBtn = document.getElementById('favoritesToggleBtn');
    if (favoritesToggleBtn) {
        favoritesToggleBtn.addEventListener('click', () => {
            state.showOnlyFavorites = !state.showOnlyFavorites;
            favoritesToggleBtn.classList.toggle('active');

            // Update star icon
            const starIcon = favoritesToggleBtn.querySelector('.star-icon');
            if (starIcon) {
                starIcon.textContent = state.showOnlyFavorites ? '⭐' : '☆';
            }

            // Toggle between flat favorites and categorized view
            const flatContainer = document.getElementById('favoritesFlatContainer');
            const categorizedContainer = document.getElementById('categorizedEffects');

            if (state.showOnlyFavorites) {
                // Show flat favorites list
                flatContainer.style.display = 'block';
                categorizedContainer.style.display = 'none';
                populateFlatFavorites();
            } else {
                // Show categorized view
                flatContainer.style.display = 'none';
                categorizedContainer.style.display = 'block';
                populateEffectGrid();
            }
        });
    }

    // Debug toggle button
    const debugToggleBtn = document.getElementById('debugToggleBtn');
    if (debugToggleBtn) {
        debugToggleBtn.addEventListener('click', () => {
            const debugLog = document.getElementById('debugLog');
            if (debugLog) {
                if (debugLog.style.display === 'none') {
                    debugLog.style.display = 'block';
                    debugToggleBtn.classList.add('active');
                    debugLog.scrollTop = debugLog.scrollHeight;
                } else {
                    debugLog.style.display = 'none';
                    debugToggleBtn.classList.remove('active');
                }
            }
        });
    }

    // Category headers (accordion)
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', toggleCategory);
    });

    // Quick    // Apply buttons - Quick Animator
    elements.applyEntranceBtn.addEventListener('click', () => handleApply('entrance'));
    elements.applyExitBtn.addEventListener('click', () => handleApply('exit'));
    elements.applyBothBtn.addEventListener('click', () => handleApply('both'));

    // Apply buttons - Preset Manager (same functionality)
    const applyPresetEntranceBtn = document.getElementById('applyPresetEntranceBtn');
    const applyPresetExitBtn = document.getElementById('applyPresetExitBtn');
    const applyPresetBothBtn = document.getElementById('applyPresetBothBtn');

    if (applyPresetEntranceBtn) applyPresetEntranceBtn.addEventListener('click', () => handleApply('entrance'));
    if (applyPresetExitBtn) applyPresetExitBtn.addEventListener('click', () => handleApply('exit'));
    if (applyPresetBothBtn) applyPresetBothBtn.addEventListener('click', () => handleApply('both'));
    if (elements.saveSelectionBtn) {
        elements.saveSelectionBtn.addEventListener('click', handleSaveSelection);
    }

    if (elements.deleteSelectedPresetBtn) {
        elements.deleteSelectedPresetBtn.addEventListener('click', handleDeleteSelectedPreset);
    }
    if (elements.renamePresetBtn) {
        elements.renamePresetBtn.addEventListener('click', handleRenamePreset);
    }

    elements.resetBtn.addEventListener('click', handleReset);
    elements.refreshBtn.addEventListener('click', handleRefresh);
    elements.importSRTBtn.addEventListener('click', handleImportSRT);
    elements.srtFileInput.addEventListener('change', handleSRTFileSelected);

    // Speed sliders (optional - only if they exist)
    if (elements.entranceSpeed) {
        elements.entranceSpeed.addEventListener('input', function () {
            if (elements.entranceSpeedValue) {
                elements.entranceSpeedValue.textContent = this.value + 'x';
            }
            saveState();
        });
    }

    if (elements.exitSpeed) {
        elements.exitSpeed.addEventListener('input', function () {
            if (elements.exitSpeedValue) {
                elements.exitSpeedValue.textContent = this.value + 'x';
            }
            saveState();
        });
    }

    // batchModeCheckbox removed - no event listener needed

    // Preset Manager buttons
    elements.createPresetBtn.addEventListener('click', openPresetCreator);
    elements.applyPresetBtn.addEventListener('click', applySelectedPreset);
    elements.importPresetsBtn.addEventListener('click', handleImportPresets);
    elements.exportPresetsBtn.addEventListener('click', handleExportPresets);
    // elements.presetImportInput.addEventListener('change', handlePresetFilesSelected); // Comentado - ahora se configura al inicio de setupEventListeners()

    // Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.cancelPresetBtn.addEventListener('click', closeModal);
    elements.savePresetBtn.addEventListener('click', savePreset);

    // Modal speed sliders
    elements.modalEntranceSpeed.addEventListener('input', function () {
        elements.modalEntranceSpeedValue.textContent = this.value + 'x';
    });

    elements.modalExitSpeed.addEventListener('input', function () {
        elements.modalExitSpeedValue.textContent = this.value + 'x';
    });

    // Close modal on background click
    elements.presetModal.addEventListener('click', (e) => {
        if (e.target === elements.presetModal) {
            closeModal();
        }
    });
}

function toggleEffectFavorite(effectKey, buttonElement) {
    if (state.favoriteEffects.has(effectKey)) {
        state.favoriteEffects.delete(effectKey);
        buttonElement.innerHTML = '☆';
    } else {
        state.favoriteEffects.add(effectKey);
        buttonElement.innerHTML = '⭐';
    }

    saveState();
    updateCategoryCounts();

    // Update preset grid if we're viewing favorites
    if (state.currentTab === 'presets' && state.currentCategory === 'favorites') {
        renderPresetGrid();
    }

    // Update flat favorites if showing
    if (state.showOnlyFavorites) {
        populateFlatFavorites();
    }
}

function toggleCategory(event) {
    const header = event.currentTarget;
    const categoryId = header.dataset.category;
    const content = document.getElementById(categoryId);

    header.classList.toggle('collapsed');
    content.classList.toggle('collapsed');

    saveCategoryState();
}

function handleReset() {
    const batchMode = false; // Apply only to selected text layers

    elements.resetBtn.disabled = true;
    setStatus('Reseteando animaciones...', 'loading');

    const script = `$.global.resetAnimations(${batchMode})`;

    evalScript(script, function (result) {
        elements.resetBtn.disabled = false;

        try {
            const data = JSON.parse(result);

            if (data.error) {
                setStatus(`Error: ${data.error}`, 'error');
                return;
            }

            if (data.success) {
                setStatus(`✓ ${data.layersReset} capas reseteadas`, 'success');
                updateCompInfo();
            }

        } catch (e) {
            setStatus(`Error: ${e.message}`, 'error');
        }
    });
}

function handleRefresh() {
    setStatus('Actualizando...', 'loading');
    loadPresets();
    loadAEPresets();
    loadCustomPresets();
    updateCompInfo();
    setTimeout(() => {
        setStatus('Actualizado', 'success');
    }, 500);
}

function handleImportSRT() {
    elements.srtFileInput.click();
}

function handleImportPresets() {
    elements.presetImportInput.click();
}

function handlePresetFilesSelected(event) {
    debugLog('🔥 handlePresetFilesSelected EJECUTADA', 'warning');

    const files = event.target.files;
    if (!files || files.length === 0) {
        debugLog('❌ No hay archivos seleccionados', 'error');
        return;
    }

    debugLog(`Archivos seleccionados: ${Array.from(files).map(f => f.name).join(', ')}`, 'info');

    setStatus('Importando presets...', 'loading');

    // Disable the correct button (importPresetBtn, not importPresetsBtn)
    const importBtn = document.getElementById('importPresetBtn');
    if (importBtn) importBtn.disabled = true;

    // Get extension presets path - save to /presets/animate/ folder
    const extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    const presetsPath = extensionPath + "/presets/animate";

    debugLog(`Ruta de destino: ${presetsPath}`, 'info');

    let importedCount = 0;
    let errorCount = 0;
    let processedCount = 0;
    const totalFiles = files.length;

    // Validate all files first
    const validFiles = Array.from(files).filter(file => {
        if (!file.name.toLowerCase().endsWith('.ffx')) {
            errorCount++;
            processedCount++;
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) {
        finishImport();
        return;
    }

    // Process each valid file
    validFiles.forEach((file, index) => {

        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                // Convert ArrayBuffer to base64
                const bytes = new Uint8Array(e.target.result);
                let binary = '';
                for (let i = 0; i < bytes.length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64Data = btoa(binary);
                const fileName = file.name;

                debugLog(`Enviando archivo: ${fileName} (${bytes.length} bytes)`, 'info');

                // Call JSX to save file
                const script = `$.global.saveFFXFile("${presetsPath.replace(/\\/g, '\\\\')}", "${fileName}", "${base64Data}")`;

                evalScript(script, function (result) {
                    try {
                        const data = JSON.parse(result);
                        if (data.success) {
                            importedCount++;
                            debugLog(`✓ Preset importado: ${fileName}`, 'success');
                        } else {
                            errorCount++;
                            debugLog(`✗ Error importando: ${fileName} - ${data.error}`, 'error');
                        }
                    } catch (e) {
                        errorCount++;
                        debugLog(`✗ Error parseando resultado: ${fileName} - ${e.message}`, 'error');
                    }

                    processedCount++;
                    checkIfFinished();
                });
            } catch (e) {
                errorCount++;
                processedCount++;
                debugLog(`✗ Error procesando: ${file.name} - ${e.message}`, 'error');
                checkIfFinished();
            }
        };

        reader.onerror = function () {
            errorCount++;
            processedCount++;
            debugLog(`✗ Error leyendo archivo: ${file.name}`, 'error');
            checkIfFinished();
        };

        // Use ArrayBuffer for binary files (NOT BinaryString)
        reader.readAsArrayBuffer(file);
    });

    function checkIfFinished() {
        debugLog(`Progreso: ${processedCount}/${totalFiles} procesados, ${importedCount} importados, ${errorCount} errores`, 'info');

        if (processedCount >= totalFiles) {
            finishImport();
        }
    }

    function finishImport() {
        // Re-enable button
        if (importBtn) importBtn.disabled = false;

        if (importedCount > 0) {
            setStatus(`✓ ${importedCount} preset(s) importado(s)`, 'success');
            // Reload AE presets to show new files
            setTimeout(() => {
                loadAEPresets();
            }, 500);
        } else if (errorCount > 0) {
            setStatus(`Error: Solo se aceptan archivos .ffx`, 'error');
        } else {
            setStatus('No se importaron archivos', 'error');
            debugLog('No se importaron archivos válidos', 'warning');
        }

        // Clear input to allow re-importing the same file
        event.target.value = '';

        debugLog('=== Importación finalizada ===', 'info');

        console.log('✅ Importación finalizada');
    }
}

function handleSaveSelection() {
    debugLog('💾 Botón de guardar selección clickeado', 'info');

    // Ask for preset name
    const presetName = prompt('Nombre del Preset:', 'Mi Preset');
    if (!presetName) return;

    setStatus('Guardando preset...', 'loading');

    // Get extension animate presets path
    const extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    const presetsPath = extensionPath + "/presets/animate";

    debugLog(`Guardando preset "${presetName}" en: ${presetsPath}`, 'info');

    const script = `$.global.saveSelectionAsPreset("${presetsPath.replace(/\\/g, '\\\\')}", "${presetName}")`;

    evalScript(script, function (result) {
        try {
            const data = JSON.parse(result);
            if (data.success) {
                setStatus(`✓ Preset "${presetName}" guardado`, 'success');
                debugLog(`✓ Preset guardado exitosamente: ${data.fileName}`, 'success');
                // Reload presets
                loadAEPresets();
            } else {
                setStatus(`Error: ${data.error}`, 'error');
                debugLog(`✗ Error guardando preset: ${data.error}`, 'error');
            }
        } catch (e) {
            setStatus(`Error: ${e.message}`, 'error');
            debugLog(`✗ Error parseando resultado: ${e.message}`, 'error');
        }
    });
}

function handleRenamePreset() {
    debugLog('📝 Botón de renombrar preset clickeado', 'info');

    // Use target from last clicked for single-item rename
    const targetPreset = state.lastClickedAEPreset;

    if (!targetPreset || !targetPreset.isAEPreset) {
        setStatus('Selecciona un preset de AE (.ffx) para renombrar', 'error');
        return;
    }

    // Ask for new name
    const oldName = targetPreset.name;
    const newName = prompt(`Renombrar preset "${oldName}" a:`, oldName);

    if (!newName || newName === oldName) {
        return;
    }

    setStatus('Renombrando preset...', 'loading');

    const script = `$.global.renameFFXFile("${targetPreset.path.replace(/\\/g, '\\\\')}", "${newName}")`;

    evalScript(script, function (result) {
        try {
            const data = JSON.parse(result);
            if (data.success) {
                const finalNewName = data.newName.replace('.ffx', '');
                debugLog(`✓ Renombrado: ${oldName} -> ${finalNewName}`, 'success');

                // Update paths in state if it matches
                // We need to reload everything anyway, but let's clear current selection to avoid issues
                if (state.selectedEffects.entrance && state.selectedEffects.entrance.path === targetPreset.path) {
                    state.selectedEffects.entrance = null;
                }
                if (state.selectedEffects.exit && state.selectedEffects.exit.path === targetPreset.path) {
                    state.selectedEffects.exit = null;
                }

                state.lastClickedAEPreset = null;

                setStatus(`✓ Preset renombrado a "${finalNewName}"`, 'success');
                saveState();
                loadAEPresets();
            } else {
                setStatus(`Error: ${data.error}`, 'error');
                debugLog(`✗ Error renombrando ${oldName}: ${data.error}`, 'error');
            }
        } catch (e) {
            setStatus('Error de sistema', 'error');
            debugLog(`✗ Error de sistema al renombrar ${oldName}`, 'error');
        }
    });
}

function handleDeleteSelectedPreset() {
    debugLog('🗑️ Botón de borrar selección clickeado', 'info');

    // Use target from last clicked for single-item deletion
    const targetPreset = state.lastClickedAEPreset;

    if (!targetPreset || !targetPreset.isAEPreset) {
        setStatus('Selecciona un preset de AE (.ffx) para borrar', 'error');
        return;
    }

    if (!confirm(`¿Borrar permanentemente: ${targetPreset.name}?\nEsta acción no se puede deshacer.`)) {
        return;
    }

    setStatus('Borrando preset...', 'loading');

    const script = `$.global.deleteFFXFile("${targetPreset.path.replace(/\\/g, '\\\\')}")`;

    evalScript(script, function (result) {
        try {
            const data = JSON.parse(result);
            if (data.success) {
                debugLog(`✓ Borrado físicamente: ${targetPreset.name}`, 'success');

                // Clear from state if it was selected in either slot
                if (state.selectedEffects.entrance && state.selectedEffects.entrance.path === targetPreset.path) {
                    state.selectedEffects.entrance = null;
                }
                if (state.selectedEffects.exit && state.selectedEffects.exit.path === targetPreset.path) {
                    state.selectedEffects.exit = null;
                }

                state.lastClickedAEPreset = null;

                setStatus('✓ Preset eliminado', 'success');
                saveState();
                loadAEPresets();
            } else {
                setStatus(`Error: ${data.error}`, 'error');
                debugLog(`✗ Error borrando ${targetPreset.name}: ${data.error}`, 'error');
            }
        } catch (e) {
            setStatus('Error de sistema', 'error');
            debugLog(`✗ Error de sistema al borrar ${targetPreset.name}`, 'error');
        }
    });
}

// Handle .ffx preset import
function handlePresetImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check if it's a .ffx file
    if (!file.name.match(/\.ffx$/i)) {
        setStatus('Error: Solo se pueden importar archivos .ffx', 'error');
        event.target.value = '';
        return;
    }

    setStatus('Importando preset...', 'loading');

    // Get the file path
    const filePath = file.path || file.webkitRelativePath || file.name;

    // Get presets path
    const aePresetsPath = csInterface.getSystemPath(SystemPath.EXTENSION) + '/presets';

    // Call importPresetFile function
    const script = `$.global.importPresetFile("${filePath.replace(/\\/g, '\\\\')}", "${aePresetsPath.replace(/\\/g, '\\\\')}")`;

    evalScript(script, function (result) {
        try {
            const data = JSON.parse(result);

            if (data.error) {
                setStatus(`Error: ${data.error}`, 'error');
            } else if (data.success) {
                setStatus(`✓ Preset "${data.name}" importado correctamente`, 'success');
                // Reload AE presets to show the new preset
                setTimeout(() => {
                    loadAEPresets();
                }, 500);
            }
        } catch (e) {
            setStatus(`Error: ${e.message}`, 'error');
        }

        // Clear input
        event.target.value = '';
    });
}

function handleSRTFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const srtContent = e.target.result;
        importSRTContent(srtContent);
    };
    reader.readAsText(file);

    event.target.value = '';
}

function importSRTContent(srtContent) {
    setStatus('Importando subtítulos...', 'loading');
    elements.importSRTBtn.disabled = true;

    const extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    const escapedPath = extensionPath.replace(/\\/g, "\\\\");

    const script = `$.global.importSRT(` + JSON.stringify(srtContent) + `, "${escapedPath}")`;

    evalScript(script, function (result) {
        elements.importSRTBtn.disabled = false;

        try {
            const data = JSON.parse(result);

            if (data.error) {
                setStatus(`Error: ${data.error}`, 'error');
                return;
            }

            if (data.success) {
                const message = `✓ ${data.layersCreated} capas creadas`;
                setStatus(message, 'success');
                updateCompInfo();
            }

        } catch (e) {
            setStatus(`Error: ${e.message}`, 'error');
        }
    });
}

function updateCompInfo() {
    evalScript('$.global.getCompInfo()', function (result) {
        try {
            const data = JSON.parse(result);

            if (data.error) {
                elements.compName.textContent = 'No activa';
                elements.compResolution.textContent = '-';
                elements.textLayers.textContent = '-';
                return;
            }

            elements.compName.textContent = data.name;
            elements.compResolution.textContent = `${data.width}x${data.height}`;
            elements.textLayers.textContent = `${data.numTextLayers} (${data.numSelectedTextLayers} seleccionadas)`;

        } catch (e) {
            console.error('Error updating comp info:', e);
        }
    });
}

// ============================================================================
// UTILITIES
// ============================================================================

function evalScript(script, callback) {
    csInterface.evalScript(script, callback);
}

function setStatus(message, type = '') {
    // Use the status message at the top
    const statusElement = document.getElementById('statusMessage');
    if (!statusElement) return;

    statusElement.textContent = message;
}

function saveState() {
    try {
        const stateToSave = {
            selectedEffects: state.selectedEffects,
            currentTab: state.currentTab,
            favoritePresets: Array.from(state.favoritePresets),
            favoriteEffects: Array.from(state.favoriteEffects),
            showOnlyFavorites: state.showOnlyFavorites
        };

        const json = JSON.stringify(stateToSave);

        // Save to localStorage (legacy/backup)
        localStorage.setItem('subtitlesToolState', json);

        // Robust persistence using Node.js filesystem if available
        if (typeof window.require !== 'undefined') {
            try {
                const fs = window.require('fs');
                const path = window.require('path');
                // Use a standard location in user app data
                const userDataPath = csInterface.getSystemPath(SystemPath.USER_DATA);
                const stateFolder = path.join(userDataPath, 'TextPresetsTool');

                if (!fs.existsSync(stateFolder)) {
                    fs.mkdirSync(stateFolder, { recursive: true });
                }

                fs.writeFileSync(path.join(stateFolder, 'state.json'), json, 'utf8');
                console.log('State saved to file system');
            } catch (fsErr) {
                console.error('File system save failed:', fsErr);
            }
        }
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function loadState() {
    try {
        // Default to localStorage
        let saved = localStorage.getItem('subtitlesToolState');

        // Try to load from file system for better persistence
        if (typeof window.require !== 'undefined') {
            try {
                const fs = window.require('fs');
                const path = window.require('path');
                const userDataPath = csInterface.getSystemPath(SystemPath.USER_DATA);
                const stateFile = path.join(userDataPath, 'TextPresetsTool', 'state.json');

                if (fs.existsSync(stateFile)) {
                    saved = fs.readFileSync(stateFile, 'utf8');
                    console.log('State loaded from file system');
                }
            } catch (fsErr) {
                console.error('File system load failed:', fsErr);
            }
        }

        if (saved) {
            const savedState = JSON.parse(saved);
            state.selectedEffects = savedState.selectedEffects || { entrance: null, exit: null };
            state.currentTab = savedState.currentTab || 'quick';
            state.favoritePresets = new Set(savedState.favoritePresets || []);
            state.favoriteEffects = new Set(savedState.favoriteEffects || []);
            state.showOnlyFavorites = savedState.showOnlyFavorites || false;

            // Sync UI toggle button state
            const favoritesToggleBtn = document.getElementById('favoritesToggleBtn');
            if (favoritesToggleBtn) {
                if (state.showOnlyFavorites) {
                    favoritesToggleBtn.classList.add('active');
                    const starIcon = favoritesToggleBtn.querySelector('.star-icon');
                    if (starIcon) starIcon.textContent = '⭐';
                }
            }
        }
    } catch (e) {
        console.error('Error loading state:', e);
        // Ensure defaults on error
        state.favoritePresets = new Set();
        state.favoriteEffects = new Set();
    }
}

function toggleFavorite(presetId, buttonElement) {
    if (state.favoritePresets.has(presetId)) {
        state.favoritePresets.delete(presetId);
        buttonElement.innerHTML = '☆';
    } else {
        state.favoritePresets.add(presetId);
        buttonElement.innerHTML = '⭐';
    }

    saveState();
    updateCategoryCounts();

    // Update preset grid if we're viewing favorites
    if (state.currentTab === 'presets' && state.currentCategory === 'favorites') {
        renderPresetGrid();
    }

    // Update flat favorites if showing
    if (state.showOnlyFavorites) {
        populateFlatFavorites();
    }
}

function saveCategoryState() {
    const categoryStates = {};
    document.querySelectorAll('.category-header').forEach(header => {
        const categoryId = header.dataset.category;
        categoryStates[categoryId] = header.classList.contains('collapsed');
    });

    localStorage.setItem('subtitlesPresetToolCategories', JSON.stringify(categoryStates));
}

function loadCategoryState() {
    const saved = localStorage.getItem('subtitlesPresetToolCategories');

    if (saved) {
        try {
            const categoryStates = JSON.parse(saved);

            Object.keys(categoryStates).forEach(categoryId => {
                if (categoryStates[categoryId]) {
                    const header = document.querySelector(`[data-category="${categoryId}"]`);
                    const content = document.getElementById(categoryId);

                    if (header && content) {
                        header.classList.add('collapsed');
                        content.classList.add('collapsed');
                    }
                }
            });

        } catch (e) {
            console.error('Error loading category state:', e);
        }
    }
}

// ============================================================================
// IMPORT/EXPORT FUNCTIONS
// ============================================================================

function handleImportPresets() {
    elements.presetImportInput.click();
}

// Función handlePresetFilesSelected duplicada ELIMINADA
// La función correcta está en la línea ~1518

function handleExportPresets() {
    if (state.customPresets.length === 0) {
        setStatus('No hay presets personalizados para exportar', 'error');
        return;
    }

    setStatus('Exportando presets...', 'loading');

    evalScript('$.global.exportCustomPresets()', function (result) {
        try {
            const data = JSON.parse(result);

            if (data.error) {
                setStatus('Error: ' + data.error, 'error');
                return;
            }

            if (data.success) {
                const message = `✓ ${data.presetsExported} presets exportados a:\n${data.exportPath}`;
                setStatus(`✓ ${data.presetsExported} presets exportados`, 'success');

                // Show alert with full path
                setTimeout(() => {
                    alert(message);
                }, 100);
            }

        } catch (e) {
            setStatus('Error: ' + e.message, 'error');
        }
    });
}

// ============================================================================
// START
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
