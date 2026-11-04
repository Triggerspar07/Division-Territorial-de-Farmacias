# Verificación del rediseño territorial — 3 de noviembre de 2026

## Alcance entregado

Atlas claro y Territorio nocturno con apariencia recordada localmente; navegación por departamento, municipio y distrito; búsqueda de territorios y sucursales por nombre, código, dirección y teléfono; filtros de cadena, estado y servicio; fichas completas y mapa interactivo sincronizado.

Incluye todas las sucursales de la fuente existente: 407 activas, 32 inactivas y 4 inactivas temporales. No se recibió todavía el nuevo JSON. La conexión por sucursal al otro proyecto DoctorSV queda aplazada por instrucción del usuario y ese repositorio no contiene modificaciones.

## Comprobaciones ejecutadas

- `node --test`: 10 pruebas de consultas, distritos homónimos, servicios, datos ausentes, coordenadas, escape HTML, horarios y fichas.
- `node scripts/verify-data.js`: igualdad de todos los valores con el commit original; 443 sucursales, 14 departamentos, 44 municipios y 262 distritos.
- Comprobación sintáctica de módulos y `git diff --check`.
- Navegador: vista nacional con las 443 sucursales y 443 marcadores; filtro de inactivas con 32 resultados y 32 marcadores; temporales con 4 resultados y 4 marcadores; limpiar filtros recupera 443.
- Buscar E10F2870 abre San Juan Opico con sus 6 sucursales y señala Farmacias La Vida. Se verificaron dirección, teléfono, código, coordenadas, dos franjas horarias entre semana y sábado, domingo cerrado y los cuatro servicios.
- Distrito San Matías sin sucursales: estado vacío claro, contexto territorial conservado y acción para ampliar al departamento.
- Temas claro y nocturno; ausencia de errores JavaScript en las comprobaciones del navegador.
- Escritorio y vista móvil: distribución adaptable y ausencia de desbordamiento horizontal en las vistas comprobadas.
- Teclado: retención de foco al seleccionar departamento y última opción correcta con Flecha arriba en búsqueda. La revisión independiente detectó ambos detalles y se corrigieron.

## Movimiento y recursos

Transiciones breves de apariencia y selección, entrada breve del detalle y desplazamiento del mapa hacia la sucursal. No hay bucles decorativos. CSS, Web Animations API y mapa consultan la preferencia de movimiento reducido. Fuentes, iconos y Leaflet están incluidos localmente; las teselas de OpenStreetMap requieren red. El directorio permanece disponible cuando falla el mapa base.

## Límites

No se actualizó ni verificó físicamente la información de las sucursales. Se preservan las fuentes históricas y las estimaciones. Este trabajo no se publicó todavía en GitHub Pages.
