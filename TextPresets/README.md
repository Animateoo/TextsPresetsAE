# Subtitle Animator Pro v3.0 - FINAL

## 🎬 Extensión Profesional para After Effects

### ✨ Características Principales

#### 🎭 11 Animaciones de Entrada
1. **Fade In** - Aparición suave
2. **Slide Up** - Desliza desde abajo
3. **Slide Right** - Desliza desde la izquierda
4. **Bounce In** - Rebote elástico con movimiento
5. **Expand** - Expansión desde 200%
6. **Zoom Blur** - Zoom rápido
7. **Glitch** - Efecto de falla técnica
8. **Rotate 3D** - Rotación tridimensional
9. **Pop In** - Aparición explosiva
10. **TikTok Style** - Fondo naranja + bounce + slide
11. **Doble** - Sombra duplicada sincronizada

#### 🎯 4 Animaciones de Salida
1. **Fade Out** - Desaparición suave
2. **Slide Down** - Desliza hacia abajo
3. **Zoom Out** - Alejamiento
4. **Shrink** - Contracción al centro

#### ⚡ Funciones Avanzadas
- ✅ **Tamaño de texto adaptativo** - Se ajusta automáticamente según la resolución
- ✅ **Control de velocidad** - 0.5x a 3.0x para entrada y salida
- ✅ **Modo Batch** - Aplica a todas las capas de texto
- ✅ **Importación SRT** - Crea capas con timing exacto
- ✅ **Animaciones combinadas** - Entrada + salida sin conflictos
- ✅ **Iconos visuales** - Emojis en todos los dropdowns

---

## 📦 Instalación

### Paso 1: Copiar la Carpeta
Copia **toda esta carpeta** a:
```
C:\Program Files\Common Files\Adobe\CEP\extensions\
```

### Paso 2: Habilitar Modo Debug
1. Presiona **Win + R**
2. Escribe `regedit` y Enter
3. Ve a: `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`
   - Para AE 2024: `CSXS.12`
   - Para AE 2025: `CSXS.13`
4. Crea valor String: `PlayerDebugMode` = `1`

### Paso 3: Reiniciar After Effects
Cierra y vuelve a abrir After Effects.

### Paso 4: Abrir Panel
**Ventana > Extensiones > Subtitle Animator Pro**

---

## 🎯 Uso Rápido

1. Selecciona una capa de texto
2. Elige preset de entrada y salida
3. Ajusta velocidad (opcional)
4. Click "Aplicar Animación"

### Importar SRT
1. Click "Importar SRT"
2. Selecciona tu archivo .srt
3. Se crearán capas con timing exacto

---

## 📐 Tamaño de Texto Adaptativo

El texto se ajusta automáticamente según la resolución:

| Resolución | Multiplicador | Tamaño Final |
|------------|---------------|--------------|
| 4K (3840+) | 2.0x | 160px |
| Full HD (1920+) | 1.0x | 80px |
| HD (1280+) | 0.75x | 60px |
| SD (menor) | 0.5x | 40px |

---

## 🔧 Correcciones Aplicadas

### v3.0 - Enero 2026
- ✅ Estructura de presets corregida
- ✅ Efecto "Doble" con sombra sincronizada
- ✅ TikTok con bounce completo
- ✅ SRT import con parser inline (sin doble prompt)
- ✅ Shape layers con timing exacto (inPoint)
- ✅ Bounce animations funcionando
- ✅ Shadow offset reducido (5px)
- ✅ Tamaño de texto adaptativo en todos los presets
- ✅ Shadow layer con mismo tamaño que original

---

## 📁 Estructura

```
SubtitleAnimatorPro_FINAL_v3.0/
├── CSXS/
│   └── manifest.xml
├── css/
│   └── style.css
├── js/
│   ├── CSInterface.js
│   └── main.js
├── jsx/
│   ├── hostscript.jsx (57 KB)
│   └── sub_srt.jsx (2 KB)
├── index.html
├── .debug
└── README.md
```

---

## 💡 Notas Importantes

- **Requisitos**: After Effects 2020 o superior
- **Sistema**: Windows/Mac compatible
- **Tamaño**: ~60 KB total
- **Dependencias**: Ninguna (todo incluido)

---

## 🆘 Solución de Problemas

**Panel no aparece:**
- Verifica PlayerDebugMode en registro
- Reinicia After Effects completamente

**Presets no funcionan:**
- Selecciona una capa de texto primero
- Verifica que la composición esté activa

**SRT no importa:**
- Verifica formato del archivo .srt
- Asegúrate que sub_srt.jsx esté en jsx/

---

**Versión**: 3.0.0 FINAL  
**Fecha**: Enero 2026  
**Estado**: ✅ PRODUCTION READY
