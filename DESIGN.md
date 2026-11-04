# Atlas · División Territorial

La marca aprobada es Atlas, con el descriptor División Territorial y el símbolo Los Pilares. El usuario corrigió expresamente la elección anterior de El Firmamento. La aplicación conserva la organización territorial y permite alternar entre Atlas — modo claro y Nyx — modo oscuro. El botón muestra el nombre del modo de destino; el texto accesible y la ayuda también indican claro u oscuro.

## Composición

Cabecera con búsqueda global y selector de tema; navegación lateral por departamento en escritorio; selectores territoriales en móvil. El contenido combina fichas completas y mapa de sucursales. Los municipios y distritos también pueden explorarse en un bloque desplegable. No ocultar datos de inactivos por defecto.

## Apariencia

- Manrope para títulos y DM Sans para lectura, servidas localmente.
- Azul profundo en la cabecera; fondo claro azulado y superficies blancas en Atlas.
- Fondo azul oscuro, superficies azul petróleo y selección verde agua en Territorio nocturno.
- Variables de color en assets/styles.css; estados de actividad acompañados de texto.
- Iconografía Lucide local y coherente; información en bloques ordenados, sin adornos que compitan con el mapa.
- Marca Los Pilares: dos columnas clásicas, bóveda celeste verde agua y tres estrellas. SVG nítido en assets/atlas-pilares.svg, con versión de favicon sobre fondo azul. Marfil y dorado discreto complementan el verde agua de la marca. Cormorant Garamond para Atlas; DM Sans para su descriptor. Todas las fuentes se sirven localmente.

## Movimiento

Cambios de tema con transiciones CSS de 240 ms; realce de selección y entrada breve del detalle con Web Animations API de 180 ms. Sin movimiento continuo. La búsqueda de teclado es inmediata. Se respeta prefers-reduced-motion.

## Alcance actual

La acción Ver en DoctorSV del panel de sucursal seleccionada abre en otra pestaña el mapa DoctorSV mediante código y nombre. Se conserva el botón Ver en el mapa que selecciona el punto aquí, la ficha local y el enlace a Google Maps. DoctorSV resuelve la identidad antes de centrar su punto; un cambio de nombre o código ambiguo muestra un aviso en lugar de abrir una sucursal diferente.
