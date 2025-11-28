# QuizziBrain

Aplicación de quizzes educativos para alumnos, pensada como prototipo de escritorio y base para futura app Android.

## Estructura del proyecto

- `desktop/`  
  Versión de escritorio en **Tkinter** (Windows/Linux). Incluye:
  - `QuizInteractivo.py` — código principal
  - `background.png`, `header.png`, `splash.png` — recursos gráficos
  - `preguntas.json` — banco de preguntas por categoría
  - `iniciar_quizzibrain.bat` — script para ejecutar fácilmente en Windows
  - `requirements.txt` — dependencias (Pillow)

- `kivy_android/`  
  Versión base en **Kivy**, pensada para empaquetar como app Android con **buildozer**. Incluye:
  - `main.py` — app principal en Kivy
  - `preguntas.json` — mismo banco de preguntas
  - `assets/` — recursos gráficos reutilizables

## Cómo ejecutar la versión de escritorio (desktop)

1. Instala Python 3.x.
2. Abre una terminal/cmd dentro de la carpeta `desktop`.
3. Instala dependencias:

   ```bash
   pip install -r requirements.txt
   ```

4. Ejecuta la app:

   ```bash
   python QuizInteractivo.py
   ```

   O en Windows simplemente doble clic en `iniciar_quizzibrain.bat`.

## Cómo ejecutar la versión Kivy (PC)

1. Instala Kivy en tu entorno:

   ```bash
   pip install kivy
   ```

2. Desde la carpeta `kivy_android` ejecuta:

   ```bash
   python main.py
   ```

## Idea para empaquetar como app Android (futuro)

- Usar la carpeta `kivy_android` como base.
- En una máquina Linux:
  - Instalar `buildozer`.
  - Crear el archivo `buildozer.spec` (`buildozer init`).
  - Configurar el título, paquete (`package.name = QuizziBrain`) y archivos de recursos.
  - Ejecutar:

    ```bash
    buildozer -v android debug
    ```

  - El APK generado se puede instalar en un teléfono Android.

Este repositorio está pensado como base educativa para seguir ampliando el banco de preguntas y la interfaz gráfica de QuizziBrain.
