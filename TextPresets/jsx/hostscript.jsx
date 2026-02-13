/**
 * TextPresets - CEP Host Script
 * @version 3.0.0
 */

/**
 * TextPresets v3.0
 * Professional text animation toolkit for After Effects
 * @version 3.0.0
 * Features: Combined animations, custom easing, preview system, preset management
 */


// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

var CONFIG = {
    SCRIPT_NAME: "TextPresets",
    VERSION: "3.0.0",
    PANEL_WIDTH: 320,

    // Easing functions as strings for expressions
    EASING: {
        linear: "linear",
        easeIn: "easeIn",
        easeOut: "easeOut",
        easeInOut: "easeInOut",
        bounce: "bounce",
        elastic: "elastic"
    },

    // Animation presets library
    PRESETS: {
        // ENTRANCE ANIMATIONS
        fade_in: {
            name: "Fade In",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.5, from: 0, to: 100 }
            }
        },
        slide_up: {
            name: "Slide Up",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.5, from: 0, to: 100 },
                position: { enabled: true, easing: "easeOutQuad", duration: 0.5, axis: "y", distance: 50 },
            }
        },
        slide_right: {
            name: "Slide Right",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.5, from: 0, to: 100 },
                position: { enabled: true, easing: "easeOutQuad", duration: 0.5, axis: "x", distance: -50 }
            }
        },
        bounce_in: {
            name: "Bounce In",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.8, from: 0, to: 100 },
                position: { enabled: true, easing: "bounce", duration: 1.0, axis: "y", distance: 60 }
            }
        },
        expand: {
            name: "Expand",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.6, from: 0, to: 100 }
            }
        },
        zoom_blur: {
            name: "Zoom Blur",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.4, from: 0, to: 100 }
            }
        },
        glitch: {
            name: "Glitch",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "linear", duration: 0.3, from: 0, to: 100 }
            }
        },
        rotate_3d: {
            name: "Rotate 3D",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.8, from: 0, to: 100 },
                rotation: { enabled: true, easing: "easeOutBack", duration: 0.8, axis: "y", from: 90, to: 0 }
            }
        },
        pop_in: {
            name: "Pop In",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutBack", duration: 0.4, from: 0, to: 100 }
            }
        },
        tiktok_style: {
            name: "TikTok Style",
            type: "entrance",
            background: {
                enabled: true,
                color: [0.99, 0.3, 0.01],
                opacity: 100,
                padding: [20, 10],
                rounded: 10
            },
            textStyle: {
                fontSize: 80,
                fillColor: [1, 1, 1]
            },
            properties: {
                opacity: { enabled: true, easing: "easeOutQuad", duration: 0.3, from: 0, to: 100 },
                position: { enabled: true, easing: "bounce", duration: 0.6, axis: "y", distance: 100 }
            }
        },
        double_shadow: {
            name: "Doble",
            icon: "👥",
            type: "entrance",
            textStyle: {
                fontSize: 80
            },
            properties: {
                opacity: { enabled: true, easing: "easeOut", duration: 0.3, from: 0, to: 100 }
            },
            shadow: {
                enabled: true,
                color: [252 / 255, 76 / 255, 2 / 255],
                offset: [5, 5],
                opacity: 70
            }
        },

        // EXIT ANIMATIONS
        fade_out: {
            name: "Fade Out",
            icon: "●",
            type: "exit",
            properties: {
                opacity: { enabled: true, easing: "easeIn", duration: 0.4, from: 100, to: 0 }
            }
        },
        slide_down: {
            name: "Slide Down",
            icon: "â†“",
            type: "exit",
            properties: {
                opacity: { enabled: true, easing: "easeIn", duration: 0.4, from: 100, to: 0 },
                position: { enabled: true, easing: "easeIn", duration: 0.4, axis: "y", distance: 40 }
            }
        },
        zoom_out: {
            name: "Zoom Out",
            icon: "â—‰",
            type: "exit",
            properties: {
                opacity: { enabled: true, easing: "easeIn", duration: 0.5, from: 100, to: 0 }
            }
        },
        shrink: {
            name: "Shrink",
            icon: "â—Ž",
            type: "exit",
            properties: {
                opacity: { enabled: true, easing: "easeIn", duration: 0.5, from: 100, to: 0 }
            }
        }
    }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

var State = {
    selectedEntrancePreset: "slide_up",
    selectedExitPreset: "fade_out",
    customPresets: {},
    batchMode: false,

    save: function () {
        $.global.subtitleAnimatorState = {
            selectedEntrancePreset: this.selectedEntrancePreset,
            selectedExitPreset: this.selectedExitPreset,
            customPresets: this.customPresets
        };
    },

    load: function () {
        if ($.global.subtitleAnimatorState) {
            this.selectedEntrancePreset = $.global.subtitleAnimatorState.selectedEntrancePreset || "slide_up";
            this.selectedExitPreset = $.global.subtitleAnimatorState.selectedExitPreset || "fade_out";
            this.customPresets = $.global.subtitleAnimatorState.customPresets || {};
        }
    }
};

// ============================================================================
// EXPRESSION BUILDER - Core system for combined animations
// ============================================================================

var ExpressionBuilder = {

    /**
     * Get easing function code for expressions
     */
    getEasingCode: function (easingType) {
        switch (easingType) {
            case "linear":
                return "function easeCustom(t, tMin, tMax, value1, value2) {\n" +
                    "  if (t <= tMin) return value1;\n" +
                    "  if (t >= tMax) return value2;\n" +
                    "  var p = (t - tMin) / (tMax - tMin);\n" +
                    "  return value1 + (value2 - value1) * p;\n" +
                    "}";

            case "easeIn":
                return "function easeCustom(t, tMin, tMax, value1, value2) {\n" +
                    "  if (t <= tMin) return value1;\n" +
                    "  if (t >= tMax) return value2;\n" +
                    "  var p = (t - tMin) / (tMax - tMin);\n" +
                    "  p = p * p * p;\n" +
                    "  return value1 + (value2 - value1) * p;\n" +
                    "}";

            case "easeOut":
                return "function easeCustom(t, tMin, tMax, value1, value2) {\n" +
                    "  if (t <= tMin) return value1;\n" +
                    "  if (t >= tMax) return value2;\n" +
                    "  var p = (t - tMin) / (tMax - tMin);\n" +
                    "  p = 1 - Math.pow(1 - p, 3);\n" +
                    "  return value1 + (value2 - value1) * p;\n" +
                    "}";

            case "easeInOut":
                return "function easeCustom(t, tMin, tMax, value1, value2) {\n" +
                    "  if (t <= tMin) return value1;\n" +
                    "  if (t >= tMax) return value2;\n" +
                    "  var p = (t - tMin) / (tMax - tMin);\n" +
                    "  p = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;\n" +
                    "  return value1 + (value2 - value1) * p;\n" +
                    "}";

            case "bounce":
                return "function easeCustom(t, tMin, tMax, value1, value2) {\n" +
                    "  if (t <= tMin) return value1;\n" +
                    "  if (t >= tMax) return value2;\n" +
                    "  var p = (t - tMin) / (tMax - tMin);\n" +
                    "  var n1 = 7.5625, d1 = 2.75;\n" +
                    "  if (p < 1 / d1) { p = n1 * p * p; }\n" +
                    "  else if (p < 2 / d1) { p = n1 * (p -= 1.5 / d1) * p + 0.75; }\n" +
                    "  else if (p < 2.5 / d1) { p = n1 * (p -= 2.25 / d1) * p + 0.9375; }\n" +
                    "  else { p = n1 * (p -= 2.625 / d1) * p + 0.984375; }\n" +
                    "  return value1 + (value2 - value1) * p;\n" +
                    "}";

            case "elastic":
                return "function easeCustom(t, tMin, tMax, value1, value2) {\n" +
                    "  if (t <= tMin) return value1;\n" +
                    "  if (t >= tMax) return value2;\n" +
                    "  var p = (t - tMin) / (tMax - tMin);\n" +
                    "  var c4 = (2 * Math.PI) / 3;\n" +
                    "  p = p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;\n" +
                    "  return value1 + (value2 - value1) * p;\n" +
                    "}";

            default:
                return "function easeCustom(t, tMin, tMax, value1, value2) {\n" +
                    "  return ease(t, tMin, tMax, value1, value2);\n" +
                    "}";
        }
    },

    /**
     * Build combined opacity expression - WITH FROZEN VALUES
     */
    buildOpacityExpression: function (entranceProp, exitProp, speedOpts, layerInPoint, layerOutPoint) {
        var expr = "";
        var hasEntrance = entranceProp && entranceProp.enabled;
        var hasExit = exitProp && exitProp.enabled;
        var entSpeed = (speedOpts && speedOpts.entrance) || 1.0;
        var exSpeed = (speedOpts && speedOpts.exit) || 1.0;

        if (!hasEntrance && !hasExit) return "";

        if (hasEntrance) {
            expr += this.getEasingCode(entranceProp.easing) + "\n\n";
        } else if (hasExit) {
            expr += this.getEasingCode(exitProp.easing) + "\n\n";
        }

        // Use dynamic values so animation follows layer
        expr += "var layerStart = inPoint;\n";
        expr += "var layerEnd = outPoint;\n";
        expr += "var t = time - layerStart;\n";
        expr += "var layerDuration = layerEnd - layerStart;\n";

        if (hasEntrance && hasExit) {
            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n\n";
            expr += "if (t < entranceDur) {\n";
            expr += "  easeCustom(t, 0, entranceDur, " + entranceProp.from + ", " + entranceProp.to + ");\n";
            expr += "} else if (t > exitStart) {\n";
            expr += "  easeCustom(t, exitStart, exitStart + exitDur, " + exitProp.from + ", " + exitProp.to + ");\n";
            expr += "} else {\n";
            expr += "  " + entranceProp.to + ";\n";
            expr += "}";
        } else if (hasEntrance) {
            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "easeCustom(t, 0, entranceDur, " + entranceProp.from + ", " + entranceProp.to + ");";
        } else {
            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n";
            expr += "if (t > exitStart) {\n";
            expr += "  easeCustom(t, exitStart, exitStart + exitDur, " + exitProp.from + ", " + exitProp.to + ");\n";
            expr += "} else {\n";
            expr += "  " + exitProp.from + ";\n";
            expr += "}";
        }

        return expr;
    },

    /**
     * Build combined position expression - WITH FROZEN VALUES
     */
    buildPositionExpression: function (entranceProp, exitProp, speedOpts, layerInPoint, layerOutPoint) {
        var expr = "";
        var hasEntrance = entranceProp && entranceProp.enabled;
        var hasExit = exitProp && exitProp.enabled;
        var entSpeed = (speedOpts && speedOpts.entrance) || 1.0;
        var exSpeed = (speedOpts && speedOpts.exit) || 1.0;

        if (!hasEntrance && !hasExit) return "";

        // Determine which easing to use
        var easingType = hasEntrance ? entranceProp.easing : exitProp.easing;
        expr += this.getEasingCode(easingType) + "\n\n";

        // Use dynamic values so animation follows layer
        expr += "var layerStart = inPoint;\n";
        expr += "var layerEnd = outPoint;\n";
        expr += "var t = time - layerStart;\n";
        expr += "var layerDuration = layerEnd - layerStart;\n";
        expr += "var basePos = value;\n\n";

        if (hasEntrance && hasExit) {
            var entranceAxis = entranceProp.axis || "y";
            var exitAxis = exitProp.axis || "y";
            var entranceIdx = entranceAxis === "x" ? 0 : 1;
            var exitIdx = exitAxis === "x" ? 0 : 1;

            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n\n";

            expr += "var pos = [basePos[0], basePos[1]];\n\n";

            expr += "if (t < entranceDur) {\n";
            expr += "  var offset = " + entranceProp.distance + ";\n";
            expr += "  var startPos = basePos[" + entranceIdx + "] " + (entranceProp.distance > 0 ? "+" : "-") + " Math.abs(offset);\n";
            expr += "  pos[" + entranceIdx + "] = easeCustom(t, 0, entranceDur, startPos, basePos[" + entranceIdx + "]);\n";
            expr += "} else if (t > exitStart) {\n";
            expr += "  var offset = " + exitProp.distance + ";\n";
            expr += "  var endPos = basePos[" + exitIdx + "] + offset;\n";
            expr += "  pos[" + exitIdx + "] = easeCustom(t, exitStart, exitStart + exitDur, basePos[" + exitIdx + "], endPos);\n";
            expr += "}\n\n";
            expr += "pos;";

        } else if (hasEntrance) {
            var axis = entranceProp.axis || "y";
            var idx = axis === "x" ? 0 : 1;

            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "var offset = " + entranceProp.distance + ";\n";
            expr += "var startPos = [basePos[0], basePos[1]];\n";
            expr += "startPos[" + idx + "] " + (entranceProp.distance > 0 ? "+" : "-") + "= Math.abs(offset);\n\n";
            expr += "if (t < entranceDur) {\n";
            expr += "  var pos = [basePos[0], basePos[1]];\n";
            expr += "  pos[" + idx + "] = easeCustom(t, 0, entranceDur, startPos[" + idx + "], basePos[" + idx + "]);\n";
            expr += "  pos;\n";
            expr += "} else {\n";
            expr += "  basePos;\n";
            expr += "}";

        } else {
            var axis = exitProp.axis || "y";
            var idx = axis === "x" ? 0 : 1;

            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n";
            expr += "var offset = " + exitProp.distance + ";\n\n";
            expr += "if (t > exitStart) {\n";
            expr += "  var pos = [basePos[0], basePos[1]];\n";
            expr += "  var endPos = basePos[" + idx + "] + offset;\n";
            expr += "  pos[" + idx + "] = easeCustom(t, exitStart, exitStart + exitDur, basePos[" + idx + "], endPos);\n";
            expr += "  pos;\n";
            expr += "} else {\n";
            expr += "  basePos;\n";
            expr += "}";
        }

        return expr;
    },

    /**
     * Build combined scale expression - WITH FROZEN VALUES
     */
    buildScaleExpression: function (entranceProp, exitProp, speedOpts, layerInPoint, layerOutPoint) {
        var expr = "";
        var hasEntrance = entranceProp && entranceProp.enabled;
        var hasExit = exitProp && exitProp.enabled;
        var entSpeed = (speedOpts && speedOpts.entrance) || 1.0;
        var exSpeed = (speedOpts && speedOpts.exit) || 1.0;

        if (!hasEntrance && !hasExit) return "";

        var easingType = hasEntrance ? entranceProp.easing : exitProp.easing;
        expr += this.getEasingCode(easingType) + "\n\n";

        // Use dynamic values so animation follows layer
        expr += "var layerStart = inPoint;\n";
        expr += "var layerEnd = outPoint;\n";
        expr += "var t = time - layerStart;\n";
        expr += "var layerDuration = layerEnd - layerStart;\n";

        if (hasEntrance && hasExit) {
            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n\n";
            expr += "var s;\n";
            expr += "if (t < entranceDur) {\n";
            expr += "  s = easeCustom(t, 0, entranceDur, " + entranceProp.from + ", " + entranceProp.to + ");\n";
            expr += "} else if (t > exitStart) {\n";
            expr += "  s = easeCustom(t, exitStart, exitStart + exitDur, " + exitProp.from + ", " + exitProp.to + ");\n";
            expr += "} else {\n";
            expr += "  s = " + entranceProp.to + ";\n";
            expr += "}\n";
            expr += "[s, s];";
        } else if (hasEntrance) {
            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "var s = easeCustom(t, 0, entranceDur, " + entranceProp.from + ", " + entranceProp.to + ");\n";
            expr += "[s, s];";
        } else {
            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n";
            expr += "var s;\n";
            expr += "if (t > exitStart) {\n";
            expr += "  s = easeCustom(t, exitStart, exitStart + exitDur, " + exitProp.from + ", " + exitProp.to + ");\n";
            expr += "} else {\n";
            expr += "  s = " + exitProp.from + ";\n";
            expr += "}\n";
            expr += "[s, s];";
        }

        return expr;
    },

    /**
     * Build combined rotation expression - WITH FROZEN VALUES
     */
    buildRotationExpression: function (entranceProp, exitProp, speedOpts, layerInPoint, layerOutPoint) {
        var expr = "";
        var hasEntrance = entranceProp && entranceProp.enabled;
        var hasExit = exitProp && exitProp.enabled;
        var entSpeed = (speedOpts && speedOpts.entrance) || 1.0;
        var exSpeed = (speedOpts && speedOpts.exit) || 1.0;

        if (!hasEntrance && !hasExit) return "";

        var easingType = hasEntrance ? entranceProp.easing : exitProp.easing;
        expr += this.getEasingCode(easingType) + "\n\n";

        // Use dynamic values so animation follows layer
        expr += "var layerStart = inPoint;\n";
        expr += "var layerEnd = outPoint;\n";
        expr += "var t = time - layerStart;\n";
        expr += "var layerDuration = layerEnd - layerStart;\n";

        if (hasEntrance && hasExit) {
            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n\n";
            expr += "if (t < entranceDur) {\n";
            expr += "  easeCustom(t, 0, entranceDur, " + entranceProp.from + ", " + entranceProp.to + ");\n";
            expr += "} else if (t > exitStart) {\n";
            expr += "  easeCustom(t, exitStart, exitStart + exitDur, " + exitProp.from + ", " + exitProp.to + ");\n";
            expr += "} else {\n";
            expr += "  " + entranceProp.to + ";\n";
            expr += "}";
        } else if (hasEntrance) {
            expr += "var entranceDur = " + (entranceProp.duration / entSpeed) + ";\n";
            expr += "easeCustom(t, 0, entranceDur, " + entranceProp.from + ", " + entranceProp.to + ");";
        } else {
            expr += "var exitDur = " + (exitProp.duration / exSpeed) + ";\n";
            expr += "var exitStart = layerDuration - exitDur;\n";
            expr += "if (t > exitStart) {\n";
            expr += "  easeCustom(t, exitStart, exitStart + exitDur, " + exitProp.from + ", " + exitProp.to + ");\n";
            expr += "} else {\n";
            expr += "  " + exitProp.from + ";\n";
            expr += "}";
        }

        return expr;
    },
};

// ============================================================================
// UTILITIES
// ============================================================================

var Utils = {
    getActiveComp: function () {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            throw new Error("No hay una composiciÃ³n activa.");
        }
        return comp;
    },

    getSelectedTextLayers: function (comp) {
        var layers = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            if (layer instanceof TextLayer && layer.selected) {
                layers.push(layer);
            }
        }
        if (layers.length === 0) {
            throw new Error("No hay capas de texto seleccionadas.");
        }
        return layers;
    },

    getAllTextLayers: function (comp) {
        var layers = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            if (layer instanceof TextLayer) {
                layers.push(layer);
            }
        }
        if (layers.length === 0) {
            throw new Error("No hay capas de texto en la composiciÃ³n.");
        }
        return layers;
    },

    getResponsiveSize: function (comp, baseSize) {
        var width = comp.width;
        var scale = 1.0;

        // Escala basada en resoluciÃ³n
        if (width >= 3840) {        // 4K
            scale = 2.0;
        } else if (width >= 1920) { // Full HD
            scale = 1.0;
        } else if (width >= 1280) { // HD
            scale = 0.75;
        } else {                     // SD
            scale = 0.5;
        }

        return Math.round(baseSize * scale);
    },

    showSuccess: function (message, count) {
        alert("âœ“ " + message + "\n\nCapas animadas: " + count);
    },

    executeScript: function (scriptName) {
        var scriptFolder = File($.fileName).parent.fsName;
        var scriptPath = scriptFolder + "/" + scriptName;
        var scriptFile = new File(scriptPath);

        if (scriptFile.exists) {
            $.evalFile(scriptFile);
            return true;
        } else {
            alert("No se encontrÃ³: " + scriptPath);
            return false;
        }
    }
};

// ============================================================================
// ANIMATION ENGINE
// ============================================================================

var AnimationEngine = {

    /**
     * Apply combined entrance and exit animations
     */
    applyCombinedAnimation: function (layers, entrancePreset, exitPreset, comp, speedOpts) {
        app.beginUndoGroup("Aplicar Animaciones");
        try {
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];

                // Define shadow layer variable outside to capture it 
                var shadowLayer = null;

                // Create shadow layer if configured (BEFORE main layer animations)
                if (entrancePreset && entrancePreset.shadow && entrancePreset.shadow.enabled) {
                    // Duplicate layer first to match properties
                    shadowLayer = this.createShadowLayer(comp, layer, entrancePreset.shadow);
                }

                // Apply Custom Effects first (if any)
                if (entrancePreset && entrancePreset.effects) {
                    this.applyLayerEffects(layer, entrancePreset.effects);
                    if (shadowLayer) this.applyLayerEffects(shadowLayer, entrancePreset.effects);
                }

                var entranceProps = entrancePreset ? entrancePreset.properties : null;
                var exitProps = exitPreset ? exitPreset.properties : null;

                // Apply text styling if configured
                if (entrancePreset && entrancePreset.textStyle) {
                    this.applyTextStyle(layer, entrancePreset.textStyle, comp);
                    // Apply same text style to shadow layer
                    if (shadowLayer) {
                        this.applyTextStyle(shadowLayer, entrancePreset.textStyle, comp);
                    }
                }

                // Apply posterize time for stop motion effect
                if (entrancePreset && entrancePreset.posterizeTime) {
                    this.applyPosterizeTime(layer, entrancePreset.posterizeTime);
                    if (shadowLayer) this.applyPosterizeTime(shadowLayer, entrancePreset.posterizeTime);
                }

                // Apply text reveal for typewriter effect
                if (entrancePreset && entrancePreset.textReveal && entrancePreset.textReveal.enabled) {
                    this.applyTextReveal(layer, entrancePreset.textReveal);
                    if (shadowLayer) this.applyTextReveal(shadowLayer, entrancePreset.textReveal);
                }

                // Apply glow
                if (entrancePreset && entrancePreset.glow && entrancePreset.glow.enabled) {
                    this.applyGlow(layer, entrancePreset.glow);
                    if (shadowLayer) this.applyGlow(shadowLayer, entrancePreset.glow);
                }

                // Apply wiggle
                if (entrancePreset && entrancePreset.wiggle && entrancePreset.wiggle.enabled) {
                    this.applyWiggle(layer, entrancePreset.wiggle);
                    if (shadowLayer) this.applyWiggle(shadowLayer, entrancePreset.wiggle);
                }

                // Build all expressions
                var opacityExpr = ExpressionBuilder.buildOpacityExpression(
                    entranceProps ? entranceProps.opacity : null,
                    exitProps ? exitProps.opacity : null,
                    speedOpts,
                    layer.inPoint,
                    layer.outPoint
                );

                var positionExpr = ExpressionBuilder.buildPositionExpression(
                    entranceProps ? entranceProps.position : null,
                    exitProps ? exitProps.position : null,
                    speedOpts,
                    layer.inPoint,
                    layer.outPoint
                );

                var scaleExpr = ExpressionBuilder.buildScaleExpression(
                    entranceProps ? entranceProps.scale : null,
                    exitProps ? exitProps.scale : null,
                    speedOpts,
                    layer.inPoint,
                    layer.outPoint
                );

                var rotationExpr = ExpressionBuilder.buildRotationExpression(
                    entranceProps ? entranceProps.rotation : null,
                    exitProps ? exitProps.rotation : null,
                    speedOpts,
                    layer.inPoint,
                    layer.outPoint
                );

                // Apply animations to MAIN layer
                if (opacityExpr) layer.opacity.expression = opacityExpr;
                if (positionExpr) layer.property("Position").expression = positionExpr;
                if (scaleExpr) layer.property("Scale").expression = scaleExpr;
                if (rotationExpr) layer.property("Rotation").expression = rotationExpr;

                // Apply animations to SHADOW layer
                if (shadowLayer) {
                    if (opacityExpr) shadowLayer.opacity.expression = opacityExpr;
                    if (positionExpr) shadowLayer.property("Position").expression = positionExpr;
                    if (scaleExpr) shadowLayer.property("Scale").expression = scaleExpr;
                    if (rotationExpr) shadowLayer.property("Rotation").expression = rotationExpr;
                }

                // Create background if configured
                if (entrancePreset && entrancePreset.background && entrancePreset.background.enabled) {
                    var bgLayer = this.createBackground(comp, layer, entrancePreset.background);

                    // Apply same animations to background
                    if (bgLayer) {
                        if (opacityExpr) bgLayer.opacity.expression = opacityExpr;
                        if (scaleExpr) bgLayer.property("Scale").expression = scaleExpr;
                    }
                }

                // Save metadata to layer
                this.saveLayerMetadata(layer, entrancePreset, exitPreset);
            }
        } catch (e) {
            app.endUndoGroup();
            throw e;
        }
        app.endUndoGroup();
    },

    /**
     * Save animation metadata to layer comment
     */
    saveLayerMetadata: function (layer, entrancePreset, exitPreset) {
        var metadata = {
            subtitleAnimator: {
                version: CONFIG.VERSION,
                entrance: entrancePreset ? entrancePreset.name : null,
                exit: exitPreset ? exitPreset.name : null
            }
        };
        layer.comment = JSON.stringify(metadata);
    },

    /**
     * Create background shape for text layer
     */
    createBackground: function (comp, textLayer, bgConfig) {
        if (!bgConfig || !bgConfig.enabled) return null;

        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = textLayer.name + "_BG";

        // Move shape layer BELOW text layer (moveAfter puts it below in stack)
        shapeLayer.moveAfter(textLayer);

        // Get text bounding box
        var sourceRectAtTime = textLayer.sourceRectAtTime(0, false);
        var width = sourceRectAtTime.width + (bgConfig.padding[0] * 2);
        var height = sourceRectAtTime.height + (bgConfig.padding[1] * 2);

        // Create rounded rectangle
        var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
        shapeGroup.name = "Background";

        var rect = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rect.property("Size").setValue([width, height]);
        rect.property("Roundness").setValue(bgConfig.rounded || 0);

        var fill = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue(bgConfig.color);

        // Calculate text center position from sourceRect
        var textPos = textLayer.transform.position.value;
        var textAnchor = textLayer.transform.anchorPoint.value;
        var textCenterOffset = [
            sourceRectAtTime.left + sourceRectAtTime.width / 2,
            sourceRectAtTime.top + sourceRectAtTime.height / 2
        ];
        var shapePos = [
            textPos[0] + textCenterOffset[0] - textAnchor[0],
            textPos[1] + textCenterOffset[1] - textAnchor[1]
        ];
        shapeLayer.transform.position.setValue(shapePos);

        // Expression to follow text center dynamically
        shapeLayer.property("Position").expression =
            "var txt = thisComp.layer(\"" + textLayer.name + "\");\n" +
            "var rect = txt.sourceRectAtTime(time, false);\n" +
            "var pos = txt.transform.position;\n" +
            "var anchor = txt.transform.anchorPoint;\n" +
            "var offset = [rect.left + rect.width/2, rect.top + rect.height/2];\n" +
            "[pos[0] + offset[0] - anchor[0], pos[1] + offset[1] - anchor[1]];";

        // Match text layer timing EXACTLY
        shapeLayer.inPoint = textLayer.inPoint;
        shapeLayer.outPoint = textLayer.outPoint;

        return shapeLayer;
    },

    /**
     * Apply text styling with responsive sizing
     */
    applyTextStyle: function (textLayer, styleConfig, comp) {
        if (!styleConfig) return;

        var textProp = textLayer.property("Source Text");
        var textDocument = textProp.value;

        if (styleConfig.font) {
            textDocument.font = styleConfig.font;
        }
        // DISABLED: Preserve original text size instead of forcing fontSize
        // if (styleConfig.fontSize) {
        //     // Aplicar tamaño responsivo basado en la composición
        //     var responsiveSize = Utils.getResponsiveSize(comp, styleConfig.fontSize);
        //     textDocument.fontSize = responsiveSize;
        // }
        if (styleConfig.fillColor) {
            textDocument.fillColor = styleConfig.fillColor;
        }
        if (styleConfig.strokeColor) {
            textDocument.strokeColor = styleConfig.strokeColor;
            textDocument.applyStroke = true;
        }
        if (styleConfig.strokeWidth) {
            textDocument.strokeWidth = styleConfig.strokeWidth;
        }

        textProp.setValue(textDocument);
    },

    /**
     * Apply posterize time for stop motion effect
     */
    applyPosterizeTime: function (layer, fps) {
        layer.timeRemapEnabled = false;
        layer.property("Time Remap").expression = "";
        // Note: Posterize Time is a layer property, not animatable via script
        // Users need to manually add Effect > Time > Posterize Time
        // Or we add it programmatically:
        try {
            var posterize = layer.property("Effects").addProperty("ADBE Posterize Time");
            posterize.property("Frame Rate").setValue(fps);
        } catch (e) {
            // Effect might not be available
        }
    },

    /**
     * Create shadow layer (duplicate with offset)
     */
    createShadowLayer: function (comp, textLayer, shadowConfig) {
        if (!shadowConfig || !shadowConfig.enabled) return null;

        var shadowLayer = textLayer.duplicate();
        shadowLayer.name = textLayer.name + "_Shadow";
        shadowLayer.moveAfter(textLayer);

        // Apply color
        var textProp = shadowLayer.property("Source Text");
        var textDoc = textProp.value;
        textDoc.fillColor = shadowConfig.color;
        textProp.setValue(textDoc);

        // Apply offset
        var currentPos = shadowLayer.property("Position").value;
        shadowLayer.property("Position").setValue([
            currentPos[0] + shadowConfig.offset[0],
            currentPos[1] + shadowConfig.offset[1]
        ]);

        // Apply opacity
        shadowLayer.opacity.setValue(shadowConfig.opacity);

        return shadowLayer;
    },

    /**
     * Apply text reveal (typewriter effect)
     */
    applyTextReveal: function (layer, revealConfig) {
        if (!revealConfig || !revealConfig.enabled) return;

        var textProp = layer.property("Source Text");
        var duration = revealConfig.duration;

        // Add expression for character reveal
        var expr = "var t = time - inPoint;\\n" +
            "var duration = " + duration + ";\\n" +
            "var fullText = text.sourceText;\\n" +
            "var numChars = fullText.length;\\n" +
            "var charsToShow = Math.floor(linear(t, 0, duration, 0, numChars));\\n" +
            "fullText.substr(0, charsToShow);";

        textProp.expression = expr;
    },

    /**
     * Apply glow effect
     */
    applyGlow: function (layer, glowConfig) {
        if (!glowConfig || !glowConfig.enabled) return;

        try {
            var glow = layer.property("Effects").addProperty("ADBE Glo2");
            glow.property("Glow Threshold").setValue(glowConfig.threshold);
            glow.property("Glow Radius").setValue(glowConfig.radius);
            glow.property("Glow Intensity").setValue(glowConfig.intensity / 100);

            // Add pulsing animation if configured
            if (glowConfig.pulse) {
                glow.property("Glow Intensity").expression =
                    "var base = " + (glowConfig.intensity / 100) + ";\\n" +
                    "base + Math.sin(time * 3) * 0.3;";
            }
        } catch (e) {
            // Glow effect might not be available
        }
    },

    /**
     * Apply wiggle effect
     */
    applyWiggle: function (layer, wiggleConfig) {
        if (!wiggleConfig || !wiggleConfig.enabled) return;

        var freq = wiggleConfig.frequency;
        var amp = wiggleConfig.amplitude;
        var axis = wiggleConfig.axis || "both";
        var duration = wiggleConfig.duration || 999;

        var expr = "var t = time - inPoint;\\n" +
            "if (t < " + duration + ") {\\n";

        if (axis === "both") {
            expr += "  wiggle(" + freq + ", " + amp + ");\\n";
        } else if (axis === "x") {
            expr += "  var w = wiggle(" + freq + ", " + amp + ");\\n" +
                "  [w[0], value[1]];\\n";
        } else if (axis === "y") {
            expr += "  var w = wiggle(" + freq + ", " + amp + ");\\n" +
                "  [value[0], w[1]];\\n";
        }

        expr += "} else {\\n" +
            "  value;\\n" +
            "}";

        layer.property("Position").expression = expr;
    },

    /**
     * Reset all animations
     */
    resetAnimations: function (layers) {
        app.beginUndoGroup("Reset Animations");
        try {
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];

                // Remove expressions
                if (layer.property("Position").canSetExpression) {
                    layer.property("Position").expression = "";
                }
                if (layer.property("Scale").canSetExpression) {
                    layer.property("Scale").expression = "";
                }
                if (layer.opacity.canSetExpression) {
                    layer.opacity.expression = "";
                }
                if (layer.property("Rotation").canSetExpression) {
                    layer.property("Rotation").expression = "";
                }

                // Remove text animators (added by FFX presets)
                try {
                    var textProp = layer.property("ADBE Text Properties");
                    if (textProp) {
                        var animatorsGroup = textProp.property("ADBE Text Animators");
                        if (animatorsGroup) {
                            // Remove all animators
                            while (animatorsGroup.numProperties > 0) {
                                animatorsGroup.property(1).remove();
                            }
                        }
                    }
                } catch (e) {
                    // Layer might not have text properties
                }

                // Remove all effects (added by FFX presets)
                try {
                    var effectsGroup = layer.property("ADBE Effect Parade");
                    if (effectsGroup) {
                        // Remove all effects
                        while (effectsGroup.numProperties > 0) {
                            effectsGroup.property(1).remove();
                        }
                    }
                } catch (e) {
                    // Error removing effects
                }

                layer.comment = "";
            }
        } catch (e) {
            app.endUndoGroup();
            throw e;
        }
        app.endUndoGroup();
    },

    /**
     * Apply captured effects to layer
     */
    applyLayerEffects: function (layer, effectsList) {
        if (!effectsList || !effectsList.length) return;

        var effectsGroup = layer.property("Effects");

        for (var i = 0; i < effectsList.length; i++) {
            var effectData = effectsList[i];

            try {
                // Add effect
                var newEffect = effectsGroup.addProperty(effectData.matchName);
                newEffect.name = effectData.name; // Restore original name

                // Apply parameters
                if (effectData.params) {
                    for (var paramName in effectData.params) {
                        try {
                            if (newEffect.property(paramName).canSetExpression === false) {
                                // Static property
                                newEffect.property(paramName).setValue(effectData.params[paramName]);
                            } else {
                                // Animatable property
                                newEffect.property(paramName).setValue(effectData.params[paramName]);
                            }
                        } catch (e) {
                            // Param might not exist or be different
                        }
                    }
                }
            } catch (e) {
                // Effect might not be installed
            }
        }
    }
};

// ============================================================================
// PRESET MANAGER
// ============================================================================

var PresetManager = {
    presetsFile: File(File($.fileName).parent.fsName + "/presets.json"),

    /**
     * Initialize: Load saved presets
     */
    init: function () {
        this.loadPresetsFromFile();
    },

    /**
     * Load presets from JSON file
     */
    loadPresetsFromFile: function () {
        if (!this.presetsFile.exists) return;

        try {
            this.presetsFile.open("r");
            var content = this.presetsFile.read();
            this.presetsFile.close();

            if (!content) return;

            var savedPresets = JSON.parse(content);
            for (var key in savedPresets) {
                if (savedPresets.hasOwnProperty(key)) {
                    CONFIG.PRESETS[key] = savedPresets[key];
                    State.customPresets[key] = savedPresets[key];
                }
            }
        } catch (e) {
            // Ignore errors on load
        }
    },

    /**
     * Save custom presets to JSON file
     */
    savePresetsToFile: function () {
        try {
            this.presetsFile.open("w");
            this.presetsFile.write(JSON.stringify(State.customPresets, null, 2));
            this.presetsFile.close();
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Create preset from selected layer
     */
    createFromSelection: function (name) {
        try {
            var comp = Utils.getActiveComp();
            var layers = Utils.getSelectedTextLayers(comp);
            var layer = layers[0]; // Use first selected layer

            // Capture Effects
            var effects = this.captureEffects(layer);

            // Capture Transform (optional, for now just effects)
            // We could also capture current scale/opacity/rotation expressions if we wanted

            var key = "custom_" + name.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Math.floor(Math.random() * 1000);

            var newPreset = {
                name: name,
                icon: "⭐", // Custom icon
                type: "entrance", // Default to entrance type for visibility
                properties: {
                    // Default dummy anim to make it valid
                    opacity: { enabled: true, easing: "linear", duration: 0.5, from: 0, to: 100 }
                },
                effects: effects,
                isCustom: true
            };

            // Save to State and CONFIG
            CONFIG.PRESETS[key] = newPreset;
            State.customPresets[key] = newPreset;

            // Persist
            this.savePresetsToFile();

            return JSON.stringify({ success: true, key: key, name: name });

        } catch (e) {
            return JSON.stringify({ error: e.toString() });
        }
    },

    /**
     * Capture effects from layer
     */
    captureEffects: function (layer) {
        var effectsProp = layer.property("Effects");
        var capturedEffects = [];

        for (var i = 1; i <= effectsProp.numProperties; i++) {
            var effect = effectsProp.property(i);
            if (!effect.enabled) continue;

            var effectData = {
                matchName: effect.matchName,
                name: effect.name,
                enabled: true,
                params: {}
            };

            // Capture parameters (simplified: top level values)
            this.captureEffectParams(effect, effectData.params);

            capturedEffects.push(effectData);
        }

        return capturedEffects;
    },

    /**
     * Helper to capture effect parameters recursively
     */
    captureEffectParams: function (propGroup, paramsObj) {
        for (var i = 1; i <= propGroup.numProperties; i++) {
            var prop = propGroup.property(i);

            try {
                if (prop.propertyType === PropertyType.PROPERTY) {
                    // Only capture value if not hidden and has value
                    if (prop.hasMin) { // Heuristic check for value properties
                        paramsObj[prop.name] = prop.value;
                    }
                } else if (prop.propertyType === PropertyType.NAMED_GROUP) {
                    // Skip "Compositing Options" and generic groups often
                    if (prop.name !== "Compositing Options") {
                        // Recurse? For MVP flat might be safer, but let's try 1 level deep naming
                        // paramsObj[prop.name] = {};
                        // this.captureEffectParams(prop, paramsObj[prop.name]);
                        // Flat naming for simplicity in reconstruction: "Group/Param"
                    }
                }
            } catch (e) { }
        }
    },

    /**
     * Delete custom preset
     */
    deletePreset: function (key) {
        if (CONFIG.PRESETS[key] && State.customPresets[key]) {
            delete CONFIG.PRESETS[key];
            delete State.customPresets[key];
            this.savePresetsToFile();
            return JSON.stringify({ success: true });
        }
        return JSON.stringify({ error: "Preset not found" });
    },

    /**
     * Export preset to JSON file
     */
    exportPreset: function (presetKey) {
        var preset = CONFIG.PRESETS[presetKey];
        if (!preset) {
            alert("Preset no encontrado: " + presetKey);
            return;
        }

        var file = File.saveDialog("Guardar preset como JSON", "*.json");
        if (!file) return;

        file.open("w");
        file.write(JSON.stringify(preset, null, 2));
        file.close();

        alert("✓ Preset exportado:\n" + file.fsName);
    },

    /**
     * Import preset from JSON file
     */
    importPreset: function () {
        var file = File.openDialog("Seleccionar preset JSON", "*.json");
        if (!file) return null;

        file.open("r");
        var content = file.read();
        file.close();

        try {
            var preset = JSON.parse(content);

            // Validate preset structure
            if (!preset.name || !preset.type) {
                throw new Error("Formato de preset inválido");
            }

            // Generate unique key
            var key = "custom_" + preset.name.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Math.floor(Math.random() * 1000);

            // Add to custom presets
            State.customPresets[key] = preset;
            CONFIG.PRESETS[key] = preset;
            this.savePresetsToFile();

            alert("✓ Preset importado:\n" + preset.name);
            return key;

        } catch (e) {
            alert("Error al importar preset:\n" + e.message);
            return null;
        }
    }
};

// Auto-load presets on script load if possible (needs context)
PresetManager.init();

// ============================================================================
// UI BUILDER
// ============================================================================


// ============================================================================
// CEP INTERFACE
// ============================================================================

$.global.getPresets = function () {
    try {
        var presets = { entrance: [], exit: [] };
        for (var key in CONFIG.PRESETS) {
            var preset = CONFIG.PRESETS[key];
            var item = { key: key, name: preset.name, icon: preset.icon, type: preset.type };
            if (preset.type === 'entrance') {
                presets.entrance.push(item);
            } else if (preset.type === 'exit') {
                presets.exit.push(item);
            }
        }
        return JSON.stringify(presets);
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

$.global.getCompInfo = function () {
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return JSON.stringify({ error: 'No active composition' });
        }
        var info = {
            name: comp.name,
            width: comp.width,
            height: comp.height,
            duration: comp.duration,
            frameRate: comp.frameRate,
            numLayers: comp.numLayers,
            numTextLayers: 0,
            numSelectedTextLayers: 0
        };
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            if (layer instanceof TextLayer) {
                info.numTextLayers++;
                if (layer.selected) info.numSelectedTextLayers++;
            }
        }
        return JSON.stringify(info);
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

$.global.applyAnimations = function (entranceKey, exitKey, batchMode, entranceSpeed, exitSpeed) {
    try {
        var comp = Utils.getActiveComp();
        var layers = (batchMode === true || batchMode === 'true') ?
            Utils.getAllTextLayers(comp) : Utils.getSelectedTextLayers(comp);
        var entrancePreset = entranceKey && entranceKey !== 'null' ? CONFIG.PRESETS[entranceKey] : null;
        var exitPreset = exitKey && exitKey !== 'null' ? CONFIG.PRESETS[exitKey] : null;

        var speedOpts = {
            entrance: entranceSpeed || 1.0,
            exit: exitSpeed || 1.0
        };

        AnimationEngine.applyCombinedAnimation(layers, entrancePreset, exitPreset, comp, speedOpts);

        return JSON.stringify({
            success: true,
            layersAnimated: layers.length,
            entrance: entrancePreset ? entrancePreset.name : 'None',
            exit: exitPreset ? exitPreset.name : 'None'
        });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

$.global.resetAnimations = function (batchMode) {
    try {
        var comp = Utils.getActiveComp();
        var layers = (batchMode === true || batchMode === 'true') ?
            Utils.getAllTextLayers(comp) : Utils.getSelectedTextLayers(comp);
        AnimationEngine.resetAnimations(layers);
        return JSON.stringify({ success: true, layersReset: layers.length });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

$.global.importSRT = function (srtContent, extensionPath) {
    try {
        app.beginUndoGroup('Import SRT Subtitles');


        // Inline SRT parser (replaces sub_srt.jsx to avoid double prompt)
        function parseSRT(content) {
            var subtitles = [];

            // Normalize line endings to \n
            content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

            // Split by double newline to get blocks
            var blocks = content.split('\n\n');

            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i].replace(/^\s+|\s+$/g, '');
                if (!block || block.length === 0) continue;

                var lines = block.split('\n');
                if (lines.length < 3) continue;

                // Line 0: index number
                // Line 1: timing (00:00:01,000 --> 00:00:03,500)
                // Line 2+: text

                var timingLine = lines[1];
                if (!timingLine || timingLine.indexOf('-->') === -1) continue;

                var timeParts = timingLine.split('-->');
                if (timeParts.length !== 2) continue;

                var startTime = parseTime(timeParts[0].replace(/^\s+|\s+$/g, ''));
                var endTime = parseTime(timeParts[1].replace(/^\s+|\s+$/g, ''));

                // Get text (everything from line 2 onwards)
                var textLines = [];
                for (var j = 2; j < lines.length; j++) {
                    var line = lines[j].replace(/^\s+|\s+$/g, '');
                    if (line && line.length > 0) {
                        textLines.push(line);
                    }
                }
                var text = textLines.join('\n');

                if (text && text.length > 0) {
                    subtitles.push({
                        text: text,
                        startTime: startTime,
                        endTime: endTime
                    });
                }
            }

            return subtitles;
        }

        // Parse time string (00:00:01,000) to seconds
        function parseTime(timeStr) {
            // Replace comma with dot for decimal
            timeStr = timeStr.replace(',', '.');

            // Split by colon
            var parts = timeStr.split(':');
            if (parts.length !== 3) return 0;

            var hours = parseInt(parts[0], 10);
            var minutes = parseInt(parts[1], 10);
            var seconds = parseFloat(parts[2]);

            return hours * 3600 + minutes * 60 + seconds;
        }

        // Get active composition
        var comp = Utils.getActiveComp();

        // Parse SRT content
        var subtitles = parseSRT(srtContent);

        if (!subtitles || subtitles.length === 0) {
            throw new Error("No subtitles found in SRT file");
        }

        // Create text layers for each subtitle
        var layersCreated = 0;
        for (var i = 0; i < subtitles.length; i++) {
            var sub = subtitles[i];

            // Create empty text layer
            var textLayer = comp.layers.addText();
            textLayer.name = "Subtitle " + (i + 1);

            // Set layer timing
            textLayer.inPoint = sub.startTime;
            textLayer.outPoint = sub.endTime;

            // Set text content and formatting
            var textProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document");
            var textDocument = textProp.value;
            textDocument.text = sub.text;
            textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
            textDocument.fontSize = 60;
            textProp.setValue(textDocument);

            // Position text at bottom center
            var position = textLayer.property("ADBE Transform Group").property("ADBE Position");
            position.setValue([comp.width / 2, comp.height * 0.85]);

            layersCreated++;
        }

        app.endUndoGroup();
        return JSON.stringify({
            success: true,
            layersCreated: layersCreated,
            totalSubtitles: subtitles.length
        });
    } catch (e) {
        app.endUndoGroup();
        return JSON.stringify({ error: e.toString() });
    }
};

$.global.createPresetFromSelection = function (name) {
    return PresetManager.createFromSelection(name);
};

$.global.deletePreset = function (key) {
    return PresetManager.deletePreset(key);
};

// ============================================================================
// NEW PRESET MANAGER FUNCTIONS
// ============================================================================

/**
 * Scan After Effects preset folders for .ffx files
 */
$.global.scanAEPresets = function (presetsPath) {
    try {
        var folder = new Folder(presetsPath);
        var result = { animateIn: [], animateOut: [] };

        if (!folder.exists) {
            return JSON.stringify({ error: "Presets folder not found" });
        }

        // Helper function to clean preset name
        function cleanPresetName(fileName) {
            var name = fileName.replace(".ffx", "");
            // Decode URI components (e.g., %20 -> space)
            try {
                name = decodeURI(name);
            } catch (e) {
                // If decode fails, just use the name as-is
            }
            return name;
        }

        // Scan Animate In folder
        var animateInFolder = new Folder(presetsPath + "/Animate In");
        if (animateInFolder.exists) {
            var ffxFiles = animateInFolder.getFiles("*.ffx");
            for (var i = 0; i < ffxFiles.length; i++) {
                result.animateIn.push({
                    id: "ae_in_" + ffxFiles[i].name,
                    name: cleanPresetName(ffxFiles[i].name),
                    path: ffxFiles[i].fsName,
                    type: "entrance",
                    isCustom: false
                });
            }
        }

        // Scan Animate Out folder
        var animateOutFolder = new Folder(presetsPath + "/Animate Out");
        if (animateOutFolder.exists) {
            var ffxFiles = animateOutFolder.getFiles("*.ffx");
            for (var i = 0; i < ffxFiles.length; i++) {
                result.animateOut.push({
                    id: "ae_out_" + ffxFiles[i].name,
                    name: cleanPresetName(ffxFiles[i].name),
                    path: ffxFiles[i].fsName,
                    type: "exit",
                    isCustom: false
                });
            }
        }

        // Scan animate folder (imported custom presets) - add to BOTH lists
        var animateFolder = new Folder(presetsPath + "/animate");
        if (animateFolder.exists) {
            var customFiles = animateFolder.getFiles("*.ffx");
            for (var i = 0; i < customFiles.length; i++) {
                var presetName = cleanPresetName(customFiles[i].name);
                var presetPath = customFiles[i].fsName;

                // Add to animateIn list (for entrance)
                result.animateIn.push({
                    id: "ae_custom_" + customFiles[i].name,
                    name: presetName,
                    path: presetPath,
                    type: "entrance",
                    isCustom: true,
                    category: "Mis Animaciones"
                });

                // Add to animateOut list (for exit)
                result.animateOut.push({
                    id: "ae_custom_" + customFiles[i].name,
                    name: presetName,
                    path: presetPath,
                    type: "exit",
                    isCustom: true,
                    category: "Mis Animaciones"
                });
            }
        }

        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Import preset file to animate folder
 */
$.global.importPresetFile = function (sourcePath, presetsPath) {
    try {
        var sourceFile = new File(sourcePath);

        if (!sourceFile.exists) {
            return JSON.stringify({ error: "Archivo de preset no encontrado" });
        }

        // Check if it's a .ffx file
        if (!sourceFile.name.match(/\.ffx$/i)) {
            return JSON.stringify({ error: "Solo se pueden importar archivos .ffx" });
        }

        // Create animate folder if it doesn't exist
        var animateFolder = new Folder(presetsPath + "/animate");
        if (!animateFolder.exists) {
            animateFolder.create();
        }

        // Copy file to animate folder
        var destFile = new File(animateFolder.fsName + "/" + sourceFile.name);

        // Check if file already exists
        if (destFile.exists) {
            return JSON.stringify({ error: "Ya existe un preset con este nombre" });
        }

        // Copy the file
        var success = sourceFile.copy(destFile);

        if (!success) {
            return JSON.stringify({ error: "Error al copiar el archivo" });
        }

        return JSON.stringify({
            success: true,
            name: cleanPresetName(sourceFile.name),
            path: destFile.fsName
        });
    } catch (e) {
        // Check for specific error messages
        var errorMsg = e.toString();
        if (errorMsg.indexOf("chunk in file too big") !== -1 || errorMsg.indexOf("unsupported file version") !== -1) {
            return JSON.stringify({ error: "Error: Archivo de preset no compatible o corrupto. Asegúrate de que sea un archivo .ffx válido de After Effects." });
        }
        return JSON.stringify({ error: errorMsg });
    }

    // Helper function to clean preset name
    function cleanPresetName(fileName) {
        var name = fileName.replace(".ffx", "");
        try {
            name = decodeURI(name);
        } catch (e) {
            // If decode fails, just use the name as-is
        }
        return name;
    }
};

/**
 * Save FFX file to presets folder
 */
$.global.saveFFXFile = function (presetsPath, fileName, base64Data) {
    try {
        // Create animate folder if it doesn't exist
        var folder = new Folder(presetsPath);
        if (!folder.exists) {
            folder.create();
        }

        // Decode base64 manually (ExtendScript doesn't have atob)
        function base64Decode(base64) {
            var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            // Remove non-base64 characters
            base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < base64.length) {
                enc1 = base64chars.indexOf(base64.charAt(i++));
                enc2 = base64chars.indexOf(base64.charAt(i++));
                enc3 = base64chars.indexOf(base64.charAt(i++));
                enc4 = base64chars.indexOf(base64.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }

            return output;
        }

        // Decode base64
        var binaryString = base64Decode(base64Data);

        // Create file
        var filePath = presetsPath + "/" + fileName;
        var file = new File(filePath);

        // Open for writing in binary mode
        file.encoding = "BINARY";
        if (!file.open("w")) {
            return JSON.stringify({ error: "No se pudo crear el archivo" });
        }

        // Write binary data
        file.write(binaryString);
        file.close();

        return JSON.stringify({
            success: true,
            path: filePath,
            fileName: fileName
        });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Save current selection as an .ffx preset
 */
$.global.saveSelectionAsPreset = function (presetsPath, presetName) {
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            throw new Error("No hay una composición activa");
        }

        var layers = comp.selectedLayers;
        if (layers.length === 0) {
            throw new Error("Selecciona una capa primero");
        }

        var layer = layers[0];

        // Create animate folder if it doesn't exist
        var folder = new Folder(presetsPath);
        if (!folder.exists) {
            folder.create();
        }

        // Clean filename
        var fileName = presetName.replace(/[<>:"\/\\|?*]/g, '_') + ".ffx";
        var presetFile = new File(presetsPath + "/" + fileName);

        // Save selection as preset
        // Note: savePreset() is a method of Layer object that saves selected properties
        // If no properties are selected, it usually saves everything on the layer
        layer.savePreset(presetFile);

        if (!presetFile.exists) {
            throw new Error("No se pudo crear el archivo del preset");
        }

        return JSON.stringify({ success: true, fileName: fileName, path: presetFile.fsName });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Delete a physical .ffx file
 */
$.global.deleteFFXFile = function (filePath) {
    try {
        var file = new File(filePath);
        if (!file.exists) {
            return JSON.stringify({ error: "El archivo no existe" });
        }

        var deleted = file.remove();
        if (deleted) {
            return JSON.stringify({ success: true });
        } else {
            return JSON.stringify({ error: "No se pudo borrar el archivo (puede estar en uso)" });
        }
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Rename a physical .ffx file
 */
$.global.renameFFXFile = function (filePath, newName) {
    try {
        var file = new File(filePath);
        if (!file.exists) {
            return JSON.stringify({ error: "El archivo no existe" });
        }

        // Clean new name
        var cleanName = newName.replace(/[<>:"\/\\|?*]/g, '_');
        if (!cleanName.match(/\.ffx$/i)) {
            cleanName += ".ffx";
        }

        var success = file.rename(cleanName);
        if (success) {
            return JSON.stringify({ success: true, newName: cleanName });
        } else {
            return JSON.stringify({ error: "No se pudo renombrar el archivo (puede estar en uso o ya existir)" });
        }
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};


/**
 * Apply FFX preset file to layers - COPY EXACT LOGIC FROM WORKING VERSION
 */
/**
 * Apply FFX preset file to layers - ROBUST TIMING & INTERPOLATION PRESERVATION
 */
$.global.applyFFXPreset = function (presetPath, batchMode, presetType) {
    app.beginUndoGroup('Apply FFX Preset');
    try {
        var comp = Utils.getActiveComp();
        if (!comp) throw new Error("No active composition");

        var layers;
        if (batchMode === true || batchMode === 'true') {
            layers = Utils.getAllTextLayers(comp);
        } else {
            layers = Utils.getSelectedTextLayers(comp);
        }

        if (layers.length === 0) throw new Error("No text layers selected");

        var presetFile = new File(presetPath);
        if (!presetFile.exists) throw new Error("Preset file not found");

        var originalTime = comp.time;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            try {
                // Focus composition on the layer's timing
                if (presetType === 'entrance') {
                    comp.time = layer.inPoint;
                } else if (presetType === 'exit') {
                    // Restored working timing for Exit: 0.5s before end
                    comp.time = Math.max(layer.inPoint, layer.outPoint - 0.5);
                } else {
                    comp.time = layer.inPoint;
                }

                // Ensure ONLY the target layer is selected in the entire composition
                for (var s = 1; s <= comp.numLayers; s++) {
                    comp.layer(s).selected = (comp.layer(s) === layer);
                }

                // Apply the preset
                layer.applyPreset(presetFile);

                // CRITICAL: Only force shift for ENTRANCE. 
                // Exit presets work better with AE's native behavior at outPoint - 1.0
                if (presetType === 'entrance') {
                    shiftKeyframesWithFullData(layer, presetType);
                }

            } catch (err) {
                // Continue with other layers
            }
        }

        comp.time = originalTime;
        app.endUndoGroup();
        return JSON.stringify({ success: true, layersAnimated: layers.length });
    } catch (e) {
        app.endUndoGroup();
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Deep-scans all properties and shifts keyframes while preserving easing, tangents, and interpolation.
 */
function shiftKeyframesWithFullData(layer, presetType) {
    var layerStart = layer.inPoint;
    var layerEnd = layer.outPoint;
    var allKeyedProps = [];

    // Exhaustive scan of every possible property group
    for (var i = 1; i <= layer.numProperties; i++) {
        recursiveCollectKeyedProps(layer.property(i), allKeyedProps);
    }

    for (var i = 0; i < allKeyedProps.length; i++) {
        var prop = allKeyedProps[i];
        if (!prop || !prop.numKeys) continue;

        var isSpatial = false;
        try {
            isSpatial = (prop.propertyValueType === PropertyValueType.TwoD_SPATIAL ||
                prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL);
        } catch (e) { }

        // 1. Snapshot all metadata
        var keyData = [];
        for (var k = 1; k <= prop.numKeys; k++) {
            var kData = {
                time: prop.keyTime(k),
                value: prop.keyValue(k),
                inType: prop.keyInInterpolationType(k),
                outType: prop.keyOutInterpolationType(k),
                cont: prop.keyTemporalContinuous(k),
                autoB: prop.keyTemporalAutoBezier(k)
            };
            try {
                kData.inEase = prop.keyInTemporalEase(k); // Returns array of KeyframeEase
                kData.outEase = prop.keyOutTemporalEase(k);
            } catch (e) { }
            if (isSpatial) {
                try {
                    kData.inS = prop.keyInSpatialTangent(k);
                    kData.outS = prop.keyOutSpatialTangent(k);
                } catch (e) { }
            }
            keyData.push(kData);
        }

        // 2. Calculate correct offset
        var offset = 0;
        if (presetType === 'exit') {
            // Align the last keyframe to a point relative to the end (e.g., 0.5s before end)
            // If we applied at outPoint - 0.5, and the preset ends there, offset will be small.
            // Using 1.0s buffer as suggested in successful logic
            offset = (layerEnd - 1.0) - keyData[keyData.length - 1].time;
        } else {
            // Entrance: align the first keyframe exactly to layer start
            offset = layerStart - keyData[0].time;
        }

        if (Math.abs(offset) < 0.001) continue;

        // 3. Re-apply shifted keys
        while (prop.numKeys > 0) prop.removeKey(1);

        for (var k = 0; k < keyData.length; k++) {
            var newT = keyData[k].time + offset;
            if (newT < 0) newT = 0;

            var newIdx = prop.setValueAtTime(newT, keyData[k].value);

            // Restore everything
            prop.setInterpolationTypeAtKey(newIdx, keyData[k].inType, keyData[k].outType);
            prop.setTemporalContinuousAtKey(newIdx, keyData[k].cont);
            prop.setTemporalAutoBezierAtKey(newIdx, keyData[k].autoB);

            if (keyData[k].inEase && keyData[k].outEase) {
                prop.setTemporalEaseAtKey(newIdx, keyData[k].inEase, keyData[k].outEase);
            }
            if (isSpatial && keyData[k].inS && keyData[k].outS) {
                prop.setSpatialTangentsAtKey(newIdx, keyData[k].inS, keyData[k].outS);
            }
        }
    }
}

function recursiveCollectKeyedProps(group, results) {
    if (!group) return;
    try {
        if (group.propertyType === PropertyType.PROPERTY) {
            if (group.numKeys > 0) results.push(group);
        } else {
            for (var i = 1; i <= group.numProperties; i++) {
                recursiveCollectKeyedProps(group.property(i), results);
            }
        }
    } catch (e) { }
}


/**
 * Save custom preset to user folder
 */
$.global.saveCustomPreset = function (presetDataJSON) {
    try {
        var presetData = JSON.parse(presetDataJSON);

        // Get or create custom presets folder
        var userFolder = new Folder(Folder.userData + "/SubtitlesTool");
        if (!userFolder.exists) {
            userFolder.create();
        }

        var presetsFolder = new Folder(userFolder.fsName + "/CustomPresets");
        if (!presetsFolder.exists) {
            presetsFolder.create();
        }

        // Save preset as JSON file
        var fileName = presetData.id + ".json";
        var file = new File(presetsFolder.fsName + "/" + fileName);

        file.open("w");
        file.write(JSON.stringify(presetData, null, 2));
        file.close();

        return JSON.stringify({
            success: true,
            path: file.fsName
        });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Load all custom presets from user folder
 */
$.global.loadCustomPresets = function () {
    try {
        var presetsFolder = new Folder(Folder.userData + "/SubtitlesTool/CustomPresets");

        if (!presetsFolder.exists) {
            return JSON.stringify([]);
        }

        var presetFiles = presetsFolder.getFiles("*.json");
        var presets = [];

        for (var i = 0; i < presetFiles.length; i++) {
            try {
                presetFiles[i].open("r");
                var content = presetFiles[i].read();
                presetFiles[i].close();

                var preset = JSON.parse(content);
                presets.push(preset);
            } catch (e) {
                // Skip invalid files
            }
        }

        return JSON.stringify(presets);
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Delete custom preset
 */
$.global.deleteCustomPreset = function (presetId) {
    try {
        var presetsFolder = new Folder(Folder.userData + "/SubtitlesTool/CustomPresets");

        if (!presetsFolder.exists) {
            return JSON.stringify({ error: "Presets folder not found" });
        }

        var fileName = presetId + ".json";
        var file = new File(presetsFolder.fsName + "/" + fileName);

        if (file.exists) {
            file.remove();
            return JSON.stringify({ success: true });
        } else {
            return JSON.stringify({ error: "Preset file not found" });
        }
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Export custom presets as ZIP (simplified: just copy to desktop)
 */
$.global.exportCustomPresets = function () {
    try {
        var presetsFolder = new Folder(Folder.userData + "/SubtitlesTool/CustomPresets");

        if (!presetsFolder.exists) {
            return JSON.stringify({ error: "No custom presets found" });
        }

        var desktopFolder = new Folder(Folder.desktop);
        var exportFolder = new Folder(desktopFolder.fsName + "/SubtitlesTool_Presets_Export");

        if (!exportFolder.exists) {
            exportFolder.create();
        }

        // Copy all preset files
        var presetFiles = presetsFolder.getFiles("*.json");
        var copiedCount = 0;

        for (var i = 0; i < presetFiles.length; i++) {
            var sourceFile = presetFiles[i];
            var destFile = new File(exportFolder.fsName + "/" + sourceFile.name);

            sourceFile.copy(destFile);
            copiedCount++;
        }

        return JSON.stringify({
            success: true,
            exportPath: exportFolder.fsName,
            presetsExported: copiedCount
        });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};

/**
 * Import custom presets from folder
 */
$.global.importCustomPresetsFromFolder = function (folderPath) {
    try {
        var sourceFolder = new Folder(folderPath);

        if (!sourceFolder.exists) {
            return JSON.stringify({ error: "Source folder not found" });
        }

        var presetsFolder = new Folder(Folder.userData + "/SubtitlesTool/CustomPresets");
        if (!presetsFolder.exists) {
            presetsFolder.create();
        }

        var presetFiles = sourceFolder.getFiles("*.json");
        var importedCount = 0;

        for (var i = 0; i < presetFiles.length; i++) {
            var sourceFile = presetFiles[i];
            var destFile = new File(presetsFolder.fsName + "/" + sourceFile.name);

            sourceFile.copy(destFile);
            importedCount++;
        }

        return JSON.stringify({
            success: true,
            presetsImported: importedCount
        });
    } catch (e) {
        return JSON.stringify({ error: e.toString() });
    }
};
