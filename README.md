# Emergencias Pro

PWA de apoyo para emergencias extrahospitalarias. Instalable en Android e iOS y **100 % offline** tras la primera carga.

## Desarrollo

```bash
npm install
npm run dev        # desarrollo
npm run build      # genera dist/ (incluye service worker)
npm run preview    # sirve dist/ para probar PWA/offline
npm run icons      # regenera los iconos (requiere Python + Pillow)
```

Se despliega como sitio estático con HTTPS (obligatorio para el service worker): GitHub Pages, Netlify, etc. Usa rutas relativas (`base: './'`) y navegación por hash, así que funciona en cualquier subruta.

## Instalación
- **Android (Chrome):** botón «Instalar» en la pantalla de inicio de la app, o menú ⋮ → Instalar aplicación.
- **iOS (Safari):** Compartir → «Añadir a pantalla de inicio». En iOS solo Safari instala PWAs.

**Antes de usarla en operativa:** ábrela una vez con conexión y espera el aviso «Lista para usar sin conexión». Las actualizaciones nunca se aplican solas (podrían interrumpir una RCP): aparece un aviso para actualizar cuando decidas.

## Limitaciones de plataforma
- iOS: sin vibración (`navigator.vibrate` no existe) y el sonido del metrónomo se silencia con el interruptor de silencio. El aviso visual funciona siempre.
- iOS puede purgar datos de sitios sin uso durante semanas si la app no está instalada en pantalla de inicio.
- El bloqueo de pantalla activa (Wake Lock) requiere Android Chrome o iOS 16.4+.

Ver [CLINICAL_CHANGES.md](CLINICAL_CHANGES.md) para el contenido clínico revisado y lo que debe validar un responsable clínico.
