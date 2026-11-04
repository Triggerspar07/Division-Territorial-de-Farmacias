# Atlas / Territorio nocturno

El usuario eligió las propuestas Atlas y Territorio nocturno. La aplicación utiliza la organización territorial de Atlas y permite alternar entre la apariencia clara institucional y la nocturna con acento verde agua.

## Composición

Cabecera con búsqueda global y selector de tema; navegación lateral por departamento en escritorio; selectores territoriales en móvil. El contenido combina fichas completas y mapa de sucursales. Los municipios y distritos también pueden explorarse en un bloque desplegable. No ocultar datos de inactivos por defecto.

## Apariencia

- Manrope para títulos y DM Sans para lectura, servidas localmente.
- Azul profundo en la cabecera; fondo claro azulado y superficies blancas en Atlas.
- Fondo azul oscuro, superficies azul petróleo y selección verde agua en Territorio nocturno.
- Variables de color en assets/styles.css; estados de actividad acompañados de texto.
- Iconografía Lucide local y coherente; información en bloques ordenados, sin adornos que compitan con el mapa.

## Movimiento

Cambios de tema con transiciones CSS de 240 ms; realce de selección y entrada breve del detalle con Web Animations API de 180 ms. Sin movimiento continuo. La búsqueda de teclado es inmediata. Se respeta prefers-reduced-motion.

## Alcance actual

La acción Ver en DoctorSV del panel de sucursal seleccionada abre en otra pestaña el mapa DoctorSV mediante código y nombre. Se conserva el botón Ver en el mapa que selecciona el punto aquí, la ficha local y el enlace a Google Maps. DoctorSV resuelve la identidad antes de centrar su punto; un cambio de nombre o código ambiguo muestra un aviso en lugar de abrir una sucursal diferente.
