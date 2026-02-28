/*  Keys -> IN/OUT (Rebuild version, no moveKey)
    - Works even when moveKey / setKeyTime are unavailable
*/

(function (thisObj) {

    function buildUI(thisObj) {
        var pal = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Keys -> IN/OUT", undefined, { resizeable: true });

        pal.orientation = "column";
        pal.alignChildren = ["fill", "top"];

        var btn = pal.add("button", undefined, "Alinear a IN/OUT");

        btn.onClick = function () {
            app.beginUndoGroup("Alinear keyframes a IN/OUT (rebuild)");
            try {
                alignSelectedLayersKeys_Rebuild();
            } catch (e) {
                alert("Error: " + e.toString());
            } finally {
                app.endUndoGroup();
            }
        };

        pal.layout.layout(true);
        return pal;
    }

    function alignSelectedLayersKeys_Rebuild() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            throw "Abre una composición activa.";
        }

        var layers = comp.selectedLayers;
        if (!layers || layers.length === 0) {
            throw "Selecciona al menos una capa.";
        }

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var props = getAllKeyframedProperties(layer);

            for (var p = 0; p < props.length; p++) {
                var prop = props[p];

                // Seguridad: algunos props especiales pueden fallar
                try {
                    remapPropertyKeys_Rebuild(prop, layer.inPoint, layer.outPoint);
                } catch (errProp) {
                    // Silencioso para no interrumpir todo
                    // Puedes descomentar para debug:
                    // $.writeln("Skip prop: " + prop.name + " -> " + errProp.toString());
                }
            }
        }
    }

    function remapPropertyKeys_Rebuild(prop, inPoint, outPoint) {
        if (!prop.isTimeVarying || prop.numKeys < 1) return;

        var allKeys = [];
        var selected = (prop.selectedKeys && prop.selectedKeys.length > 0) ? prop.selectedKeys : null;

        // Construir set de selected indices para check rápido
        var selectedMap = {};
        if (selected) {
            for (var s = 0; s < selected.length; s++) selectedMap[selected[s]] = true;
        }

        // Determinar qué keys se remapean
        var remapIndices = [];
        if (selected) {
            for (var ss = 0; ss < selected.length; ss++) remapIndices.push(selected[ss]);
        } else {
            for (var k = 1; k <= prop.numKeys; k++) remapIndices.push(k);
        }

        if (remapIndices.length === 0) return;

        // Min/Max de las keys a remapear
        var minT = prop.keyTime(remapIndices[0]);
        var maxT = minT;

        for (var r = 1; r < remapIndices.length; r++) {
            var t = prop.keyTime(remapIndices[r]);
            if (t < minT) minT = t;
            if (t > maxT) maxT = t;
        }

        var oldSpan = maxT - minT;
        var newSpan = outPoint - inPoint;

        // Guardar TODOS los keys (para reconstruir la propiedad completa)
        for (var idx = 1; idx <= prop.numKeys; idx++) {
            var kt = prop.keyTime(idx);
            var kv = prop.keyValue(idx);

            var obj = {
                oldIndex: idx,
                oldTime: kt,
                newTime: kt, // default: igual
                value: kv,
                // Interpolación/atributos (si existen)
                inInterp: safeGet(function () { return prop.keyInInterpolationType(idx); }),
                outInterp: safeGet(function () { return prop.keyOutInterpolationType(idx); }),
                inEase: safeGet(function () { return prop.keyInTemporalEase(idx); }),
                outEase: safeGet(function () { return prop.keyOutTemporalEase(idx); }),
                temporalAutoBezier: safeGet(function () { return prop.keyTemporalAutoBezier(idx); }),
                temporalContinuous: safeGet(function () { return prop.keyTemporalContinuous(idx); }),
                spatialAutoBezier: safeGet(function () { return prop.keySpatialAutoBezier(idx); }),
                spatialContinuous: safeGet(function () { return prop.keySpatialContinuous(idx); }),
                roving: safeGet(function () { return prop.keyRoving(idx); }),
                inSpatialTan: safeGet(function () { return prop.keyInSpatialTangent(idx); }),
                outSpatialTan: safeGet(function () { return prop.keyOutSpatialTangent(idx); }),
                isRemap: selected ? !!selectedMap[idx] : true
            };

            allKeys.push(obj);
        }

        // Calcular nuevos tiempos para los keys remapeados
        if (remapIndices.length === 1) {
            // 1 key -> al IN
            for (var a = 0; a < allKeys.length; a++) {
                if (allKeys[a].isRemap) allKeys[a].newTime = inPoint;
            }
        } else if (oldSpan === 0) {
            // Todos apilados -> repartir uniformemente SOLO los remapeados
            // Para mantener orden estable: ordenar remapeados por oldIndex
            var remapped = [];
            for (var b = 0; b < allKeys.length; b++) if (allKeys[b].isRemap) remapped.push(allKeys[b]);
            remapped.sort(function (x, y) { return x.oldIndex - y.oldIndex; });

            var n = remapped.length;
            for (var rr = 0; rr < n; rr++) {
                var normU = (n === 1) ? 0 : (rr / (n - 1));
                remapped[rr].newTime = inPoint + normU * newSpan;
            }
        } else {
            // Reescalado proporcional
            for (var c = 0; c < allKeys.length; c++) {
                if (!allKeys[c].isRemap) continue;
                var norm = (allKeys[c].oldTime - minT) / oldSpan; // 0..1
                allKeys[c].newTime = inPoint + norm * newSpan;
            }
        }

        // Borrar todos los keys (de atrás hacia adelante)
        for (var del = prop.numKeys; del >= 1; del--) {
            prop.removeKey(del);
        }

        // Re-crear en orden por newTime (si empate, por oldIndex)
        allKeys.sort(function (a1, a2) {
            if (a1.newTime === a2.newTime) return a1.oldIndex - a2.oldIndex;
            return a1.newTime - a2.newTime;
        });

        for (var nki = 0; nki < allKeys.length; nki++) {
            var K = allKeys[nki];

            // Insertar key
            prop.setValueAtTime(K.newTime, K.value);

            // Como vamos en orden ascendente, el último key insertado es el numKeys actual
            var newIndex = prop.numKeys;

            // Restaurar interpolación / eases (si aplica)
            safeCall(function () {
                if (K.inInterp != null && K.outInterp != null) {
                    prop.setInterpolationTypeAtKey(newIndex, K.inInterp, K.outInterp);
                }
            });

            safeCall(function () {
                if (K.inEase != null && K.outEase != null) {
                    prop.setTemporalEaseAtKey(newIndex, K.inEase, K.outEase);
                }
            });

            safeCall(function () { if (K.temporalAutoBezier != null) prop.setTemporalAutoBezierAtKey(newIndex, K.temporalAutoBezier); });
            safeCall(function () { if (K.temporalContinuous != null) prop.setTemporalContinuousAtKey(newIndex, K.temporalContinuous); });

            // Spatial (solo si la propiedad es espacial: Position, etc.)
            safeCall(function () { if (K.spatialAutoBezier != null) prop.setSpatialAutoBezierAtKey(newIndex, K.spatialAutoBezier); });
            safeCall(function () { if (K.spatialContinuous != null) prop.setSpatialContinuousAtKey(newIndex, K.spatialContinuous); });
            safeCall(function () { if (K.roving != null) prop.setRovingAtKey(newIndex, K.roving); });

            safeCall(function () {
                if (K.inSpatialTan != null && K.outSpatialTan != null) {
                    prop.setSpatialTangentsAtKey(newIndex, K.inSpatialTan, K.outSpatialTan);
                }
            });
        }
    }

    function safeGet(fn) {
        try { return fn(); } catch (e) { return null; }
    }

    function safeCall(fn) {
        try { fn(); } catch (e) { }
    }

    function getAllKeyframedProperties(layer) {
        var results = [];

        function scan(group) {
            for (var i = 1; i <= group.numProperties; i++) {
                var pr = group.property(i);
                if (!pr) continue;

                if (pr.propertyType === PropertyType.PROPERTY) {
                    if (pr.isTimeVarying && pr.numKeys > 0) results.push(pr);
                } else {
                    scan(pr);
                }
            }
        }

        scan(layer);
        return results;
    }

    var ui = buildUI(thisObj);
    if (ui instanceof Window) {
        ui.center();
        ui.show();
    }

})(this);
