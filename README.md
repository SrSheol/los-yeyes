# Karún Travel Group — demo site

Landing pública de muestra (demo) para **Karún Travel Group**, traslados turísticos
en Punta Cana / República Dominicana. Sitio estático en GitHub Pages, en proceso de
rebranding desde "Transportes Los Yeyes".

Live: https://srsheol.github.io/los-yeyes/

## Vista previa local

No requiere build. Basta con servir la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

Abrir `index.html` directamente con doble clic (`file://`) también funciona para
la sección de demo de reservas (flota, tarifario, wizard), pero **la landing
principal (hero, servicios, precios, mapa, etc.) necesita conexión a internet**:
carga React desde `unpkg.com` en tiempo de ejecución (ver `support.js`). Sin
esa carga, la landing principal no se renderiza — esto ya ocurría antes del
rebranding y no es un cambio introducido aquí.

## Qué es demo y qué es producción

- **Landing principal** (hero, servicios, precios genéricos, mapa, destinos,
  FAQ): contenido de marketing ya existente, solo rebrandeado a Karún.
- **Sección "Demo interactiva"** (al final de la página — Flota, Tarifario
  buscable, Reserva multi-tramo): es una demostración funcional, sin backend:
  - Los precios salen del tarifario real (`assets/tarifario.json`, extraído del
    PDF oficial de Karún) — no son inventados.
  - El pago (tarjeta / PayPal / efectivo) es **simulado**: no se hace ningún
    cargo real, no hay integración con ninguna pasarela de pago.
  - La confirmación y el letrero de pickup se generan localmente en el
    navegador (canvas); no se envía ningún correo o WhatsApp real.
  - El recordatorio de 24 h antes del pickup es solo texto informativo — no hay
    cron ni backend disparando nada.
  - El progreso del formulario se guarda en `localStorage` del navegador del
    visitante (nadie más lo ve).
- Cuando este proyecto pase a producción (Hostinger), esta sección se conecta a
  backend real, WhatsApp Business API y una pasarela de pago real.

## Estructura

```
index.html             → toda la landing (rebrandeada) + sección de demo interactiva
karun-wizard.js         → lógica de la demo: tarifario, flota, wizard multi-tramo,
                          pago simulado, confirmación y letrero de pickup
support.js              → motor de la landing principal (no tocar sin necesidad)
image-slot.js            → utilidades de imágenes de la landing principal
media/hero-starex-loop.mp4 → video hero (conservado del repo original)
assets/rd-map.png        → mapa de zonas RD (conservado)
assets/tarifario.json    → tarifario oficial (115 hoteles / 10 zonas)
assets/fleet/            → fotos referenciales de las 5 unidades
assets/CREDITS.md        → créditos de imágenes / gráficos usados en la demo
```

## Nota técnica sobre la sección de demo

Por razones técnicas (la landing principal se compila y remonta con React desde
cero en cada cambio de estado, lo que borraría contenido inyectado dinámicamente
si viviera dentro de ese árbol), la sección de demo interactiva vive **fuera**
del árbol que gestiona React, justo debajo de la landing principal, con su
propio selector de idioma ES/EN. Esto la hace robusta e independiente de si
React llega a cargar o no.
