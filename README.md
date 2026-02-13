# 🔤 TextPresets: Automatiza tu flujo de trabajo tipográfico en After Effects

**TextPresets** es una potente extensión para Adobe After Effects diseñada para editores y motion designers que buscan velocidad y precisión sin complicaciones.

Esta herramienta te permite gestionar y aplicar toda tu librería de presets (.ffx) con un solo clic, automatizando la alineación perfecta de las animaciones tanto al inicio (**Entrada**) como al final (**Salida**) de tus capas de texto.

Además, incluye funciones para importar nuevos efectos, organizar tus favoritos y guardar tus propias creaciones como nuevos presets directamente desde el panel. Es la herramienta definitiva para mantener la consistencia en tus proyectos y ahorrar horas de trabajo repetitivo.

---

## ✨ Características Principales

*   🚀 **Aplicación Instantánea**: Aplica animaciones profesionales de entrada y salida con un solo botón.
*   ⏱️ **Timing Automático**: Alineación inteligente de keyframes al *InPoint* y *OutPoint* de la capa seleccionada.
*   📂 **Librería Personalizable**: Organiza tus propios archivos `.ffx` y expándelos fácilmente con el botón de importación.
*   💾 **Exportación Rápida**: Guarda tus combinaciones de efectos actuales como nuevos presets `.ffx` directamente desde el panel.
*   🗿 **Gestión de Subtítulos (SRT)**: Importación nativa de archivos `.srt` para flujos de subtitulado rápidos.
*   🛠️ **Administración Total**: Botones dedicados para borrar, reiniciar e importar presets en segundos.

---

## 🚀 Instalación

1.  Descarga el contenido de este repositorio.
2.  Mueve la carpeta a la ruta de extensiones de Adobe:
    *   **Windows**: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
    *   **macOS**: `/Library/Application Support/Adobe/CEP/extensions/`
3.  Abre After Effects y ve a: **Window > Extensions > TextPresets**.

---
## ⚠️ Configuración Necesaria (Solo la primera vez)
Como esta es una extensión de código abierto (firmada por desarrollador), debes habilitar el modo de depuración de Adobe para que After Effects la cargue:
### Para Windows:
Abre el **Símbolo del sistema (CMD)** como administrador y pega este comando:
```cmd
reg add "HKCU\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f
reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f

Para macOS:
Abre la Terminal y pega estos comandos:

defaults write com.adobe.CSXS.10 PlayerDebugMode 1
defaults write com.adobe.CSXS.11 PlayerDebugMode 1

---
## 🤝 Contribución

¡Si encuentras un bug o tienes una idea para mejorar el flujo de subtitulado, abre un **Issue**!


Desarrollado con ❤️ para la comunidad por [Animateoo](https://github.com/Animateoo).
