# TextPresets

## ðŸŽ¬ ExtensiÃ³n Profesional para After Effects

### âœ¨ CaracterÃ­sticas Principales

#### ðŸŽ­ 11 Animaciones de Entrada
1. **Fade In** - ApariciÃ³n suave
2. **Slide Up** - Desliza desde abajo
3. **Slide Right** - Desliza desde la izquierda
4. **Bounce In** - Rebote elÃ¡stico con movimiento
5. **Expand** - ExpansiÃ³n desde 200%
6. **Zoom Blur** - Zoom rÃ¡pido
7. **Glitch** - Efecto de falla tÃ©cnica
8. **Rotate 3D** - RotaciÃ³n tridimensional
9. **Pop In** - ApariciÃ³n explosiva
10. **TikTok Style** - Fondo naranja + bounce + slide
11. **Doble** - Sombra duplicada sincronizada

#### ðŸŽ¯ 4 Animaciones de Salida
1. **Fade Out** - DesapariciÃ³n suave
2. **Slide Down** - Desliza hacia abajo
3. **Zoom Out** - Alejamiento
4. **Shrink** - ContracciÃ³n al centro

#### âš¡ Funciones Avanzadas
- âœ… **TamaÃ±o de texto adaptativo** - Se ajusta automÃ¡ticamente segÃºn la resoluciÃ³n
- âœ… **Control de velocidad** - 0.5x a 3.0x para entrada y salida
- âœ… **Modo Batch** - Aplica a todas las capas de texto
- âœ… **ImportaciÃ³n SRT** - Crea capas con timing exacto
- âœ… **Animaciones combinadas** - Entrada + salida sin conflictos
- âœ… **Iconos visuales** - Emojis en todos los dropdowns

---

## ðŸ“¦ InstalaciÃ³n

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
**Ventana > Extensiones > TextPresets**

---

## ðŸŽ¯ Uso RÃ¡pido

1. Selecciona una capa de texto
2. Elige preset de entrada y salida
3. Ajusta velocidad (opcional)
4. Click "Aplicar AnimaciÃ³n"

### Importar SRT
1. Click "Importar SRT"
2. Selecciona tu archivo .srt
3. Se crearÃ¡n capas con timing exacto

---

## ðŸ“ TamaÃ±o de Texto Adaptativo

El texto se ajusta automÃ¡ticamente segÃºn la resoluciÃ³n:

| ResoluciÃ³n | Multiplicador | TamaÃ±o Final |
|------------|---------------|--------------|
| 4K (3840+) | 2.0x | 160px |
| Full HD (1920+) | 1.0x | 80px |
| HD (1280+) | 0.75x | 60px |
| SD (menor) | 0.5x | 40px |

---

## ðŸ”§ Correcciones Aplicadas

### v3.0 - Enero 2026
- âœ… Estructura de presets corregida
- âœ… Efecto "Doble" con sombra sincronizada
- âœ… TikTok con bounce completo
- âœ… SRT import con parser inline (sin doble prompt)
- âœ… Shape layers con timing exacto (inPoint)
- âœ… Bounce animations funcionando
- âœ… Shadow offset reducido (5px)
- âœ… TamaÃ±o de texto adaptativo en todos los presets
- âœ… Shadow layer con mismo tamaÃ±o que original

---

## ðŸ“ Estructura

```
SubtitleAnimatorPro_FINAL_v3.0/
â”œâ”€â”€ CSXS/
â”‚   â””â”€â”€ manifest.xml
â”œâ”€â”€ css/
â”‚   â””â”€â”€ style.css
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ CSInterface.js
â”‚   â””â”€â”€ main.js
â”œâ”€â”€ jsx/
â”‚   â”œâ”€â”€ hostscript.jsx (57 KB)
â”‚   â””â”€â”€ sub_srt.jsx (2 KB)
â”œâ”€â”€ index.html
â”œâ”€â”€ .debug
â””â”€â”€ README.md
```

---

## ðŸ’¡ Notas Importantes

- **Requisitos**: After Effects 2020 o superior
- **Sistema**: Windows/Mac compatible
- **TamaÃ±o**: ~60 KB total
- **Dependencias**: Ninguna (todo incluido)

---

## ðŸ†˜ SoluciÃ³n de Problemas

**Panel no aparece:**
- Verifica PlayerDebugMode en registro
- Reinicia After Effects completamente

**Presets no funcionan:**
- Selecciona una capa de texto primero
- Verifica que la composiciÃ³n estÃ© activa

**SRT no importa:**
- Verifica formato del archivo .srt
- AsegÃºrate que sub_srt.jsx estÃ© en jsx/

---

**VersiÃ³n**: 3.0.0 FINAL  
**Fecha**: Enero 2026  
**Estado**: âœ… PRODUCTION READY

---


## Uso y Contribuciones

Este plugin es gratuito y ha sido desarrollado por Mateo Crespo (Animateo).

Puedes:

* Utilizar el plugin en proyectos personales y comerciales.
* Revisar y aprender del código fuente.
* Reportar errores y sugerir mejoras.
* Compartir optimizaciones, correcciones o nuevas funciones con el autor.

No está permitido:

* Vender este plugin o versiones derivadas del mismo.
* Redistribuir versiones modificadas como un producto independiente.
* Eliminar los créditos del autor original.
* Publicar versiones modificadas sin autorización previa.

Si realizas mejoras o correcciones, te agradecería que las compartieras para evaluarlas e incorporarlas a la versión oficial, beneficiando a toda la comunidad.

Autor: Mateo Crespo (Animateo)
