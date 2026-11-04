# Atlas y Territorio nocturno

Reconstrucción de la consulta territorial de farmacias en HTML, CSS y JavaScript estáticos, compatible con GitHub Pages. El usuario eligió Atlas y Territorio nocturno y pidió animaciones. Decisión de implementación: organización Atlas y selector de tema claro/nocturno, recordado localmente.

Conservar sin alterar los 443 registros actuales y los 14 departamentos, 44 municipios y 262 distritos. Cada ficha mantiene cadena, nombre, código, dirección, teléfono, coordenadas, estado, fuente/confianza, tres horarios y los cuatro servicios. Los valores desconocidos se distinguen de No. La actualización con un nuevo JSON queda pendiente de su entrega.

Navegación lateral por departamento, selección de municipio y distrito, búsqueda global y filtros de cadena, estado y servicio. El mapa interactivo muestra sucursales según el territorio y los filtros, admite acercamiento y enlaza cada punto con su ficha. No presenta las coordenadas heredadas como verificadas nuevamente ni inventa límites administrativos. Un territorio sin sucursales tiene una salida clara y conserva su contexto territorial.

Tipografía Manrope/DM Sans, azul institucional en claro, azul profundo y verde agua en nocturno. Fichas legibles y completas, botones para llamar y ver ubicación. En celular, los controles territoriales se adaptan y las fichas ocupan el ancho disponible. Navegación con teclado y estados visibles de foco, carga, vacío y fallo del mapa.

Animaciones con propósito: transiciones de apariencia y selección, entrada corta del detalle de sucursal y desplazamiento hacia el punto elegido. Sin bucles decorativos, sin retrasar la búsqueda, respetando prefers-reduced-motion.

Entrega: código local completo, pruebas de datos y lógica, revisión visual en escritorio/móvil y vista previa. No reemplazar la publicación pública durante la elección/revisión del usuario.
