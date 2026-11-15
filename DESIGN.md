# Atlas · División Territorial

La marca aprobada es Atlas, con el descriptor División Territorial y el símbolo Los Pilares. El usuario corrigió expresamente la elección anterior de El Firmamento. La aplicación conserva la organización territorial y permite alternar entre Atlas — modo claro y Nyx — modo oscuro. El botón muestra el nombre del modo de destino; el texto accesible y la ayuda también indican claro u oscuro.

## Composición

Cabecera con búsqueda global, selector de tema y ajustes de apariencia; navegación lateral por departamento en escritorio; selectores territoriales en móvil. El contenido combina fichas completas y mapa de sucursales. Los municipios y distritos también pueden explorarse en un bloque desplegable. No ocultar datos de inactivos por defecto.

## Apariencia

- Manrope para títulos y DM Sans para lectura, servidas localmente.
- Azul profundo en la cabecera; fondo claro azulado y superficies blancas en Atlas.
- Fondo azul oscuro, superficies azul petróleo y selección verde agua en Territorio nocturno.
- Variables de color en assets/styles.css; estados de actividad acompañados de texto.
- Iconografía Lucide local y coherente; información en bloques ordenados, sin adornos que compitan con el mapa.
- Marca Los Pilares: dos columnas clásicas, bóveda celeste verde agua y tres estrellas. SVG nítido en assets/atlas-pilares.svg, con versión de favicon sobre fondo azul. Marfil y dorado discreto complementan el verde agua de la marca. Cormorant Garamond para Atlas; DM Sans para su descriptor. Todas las fuentes se sirven localmente.

## Material y movimiento

El ajuste Liquid Glass se aplica al instante y se guarda en el navegador. Las fichas y el panel del mapa conservan un tinte más denso para facilitar la lectura. Con transparencia reducida o contraste alto, las superficies son sólidas.

Un resorte reversible mueve el selector de tema y el indicador territorial. La paleta cambia en 220 ms. Con movimiento reducido, el cambio de color dura 100 ms y se eliminan las partículas y el deslizamiento.

## Alcance actual

La acción Ver en DoctorSV del panel de sucursal seleccionada abre en otra pestaña el mapa DoctorSV mediante código y nombre. Se conserva el botón Ver en el mapa que selecciona el punto aquí, la ficha local y el enlace a Google Maps. DoctorSV resuelve la identidad antes de centrar su punto; un cambio de nombre o código ambiguo muestra un aviso en lugar de abrir una sucursal diferente.
