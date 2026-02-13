# Instrucciones para Agregar Presets de After Effects

## 📋 Ubicación de los Presets

Los presets de After Effects (.ffx) deben copiarse a estas carpetas dentro de la extensión:

```
Subtitles Preset Tool/
└── presets/
    ├── Animate In/     ← Copiar aquí los presets de entrada
    └── Animate Out/    ← Copiar aquí los presets de salida
```

## 📂 Dónde Encontrar los Presets Originales de AE

Los presets originales de After Effects están en:

**Windows:**
```
C:\Program Files\Adobe\Adobe After Effects [VERSIÓN]\Support Files\Presets\Text\
├── Animate In\
└── Animate Out\
```

**Mac:**
```
/Applications/Adobe After Effects [VERSIÓN]/Presets/Text/
├── Animate In/
└── Animate Out/
```

## 🔄 Cómo Copiar los Presets

### Opción 1: Copiar Manualmente

1. Navega a la carpeta de presets de After Effects
2. Abre las carpetas `Animate In` y `Animate Out`
3. Copia todos los archivos `.ffx` que quieras incluir
4. Pégalos en las carpetas correspondientes de la extensión

### Opción 2: Script de PowerShell (Windows)

Ejecuta este comando en PowerShell (ajusta la versión de AE):

```powershell
# Definir rutas
$aeVersion = "2025"  # Cambia según tu versión
$aePresetsPath = "C:\Program Files\Adobe\Adobe After Effects $aeVersion\Support Files\Presets\Text"
$extensionPath = "c:\Users\feder\.gemini\antigravity\scratch\subtitle_animator_pro\Subtitles Preset Tool\presets"

# Copiar Animate In
Copy-Item "$aePresetsPath\Animate In\*.ffx" -Destination "$extensionPath\Animate In\" -Force

# Copiar Animate Out
Copy-Item "$aePresetsPath\Animate Out\*.ffx" -Destination "$extensionPath\Animate Out\" -Force

Write-Host "✓ Presets copiados exitosamente!"
```

## 📝 Presets Recomendados

### Animate In (Entrada) - ~40 presets
- Fade Up Characters
- Slide Up By Character
- Typewriter
- Spin In By Character
- Random Shuffle In
- Y muchos más...

### Animate Out (Salida) - ~20 presets
- Fade Down Characters
- Slide Out By Character
- Spin Out By Character
- Shrink Out
- Y más...

## ✅ Verificación

Después de copiar los presets:

1. Abre After Effects
2. Abre el panel (Window → Extensions → Subtitles Preset Tool)
3. Ve al tab "⚡ Rápido"
4. Expande las categorías "🎬 PRESETS DE AE - ENTRADA" y "SALIDA"
5. Deberías ver todos los presets con previews animados

## 🎨 Previews Visuales

La extensión mapea automáticamente los nombres de los presets a animaciones visuales:

- **Fade** → Animación de desvanecimiento
- **Slide** → Animación de deslizamiento
- **Spin/Rotate** → Animación de rotación 3D
- **Shuffle** → Animación de glitch
- **Typewriter** → Animación de fade-in
- Y más...

## ⚠️ Notas Importantes

1. **Solo archivos .ffx**: La extensión solo lee archivos con extensión `.ffx`
2. **Nombres originales**: Mantén los nombres originales de los archivos para que el mapeo de previews funcione correctamente
3. **Portable**: Una vez copiados, la extensión es completamente portable y no depende de la instalación de AE
4. **Licencia**: Asegúrate de tener una licencia válida de After Effects para usar estos presets

## 🚀 Resultado

Una vez configurado, tendrás:
- ✅ 60+ presets de AE disponibles directamente en el panel
- ✅ Previews animados para cada preset
- ✅ Aplicación con un solo click
- ✅ Compatibilidad total con modo batch
- ✅ Extensión portable y autocontenida
