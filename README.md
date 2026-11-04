# División Territorial de Farmacias

Explorador de los departamentos, municipios y distritos de El Salvador y sus sucursales de farmacia. Rediseño Atlas con apariencia clara y Territorio nocturno, selección territorial, búsqueda, filtros y mapa interactivo.

[Sitio del proyecto](https://triggerspar07.github.io/Division-Territorial-de-Farmacias/) · [Repositorio Mapa DoctorSV](https://github.com/Triggerspar07/Mapa-de-DoctorSV)

## Vista previa local

Con Node.js 20 o posterior, sin instalar dependencias:

```sh
node scripts/serve.js
```

Abre la dirección local que imprime el servidor, normalmente `http://127.0.0.1:8766`. Para cambiar el puerto, establece la variable `PORT`. Los módulos requieren un servidor HTTP; no abrir index.html mediante file://.

## Comprobaciones

```sh
node --test
node scripts/verify-data.js
git diff --check
```

`verify-data.js` compara todos los valores de los datos extraídos con el commit original `83b6e371d42c59a9358603e7a2fd0b0e58f67e25`; requiere el historial Git de ese commit.

## Datos y alcance

- 443 sucursales preservadas: 407 activas, 32 inactivas y 4 inactivas temporales. Todas se incluyen por defecto.
- 14 departamentos, 44 municipios y 262 distritos. Los filtros territoriales distinguen departamentos para no mezclar distritos homónimos.
- Cada ficha conserva código, nombre, cadena, dirección, teléfono, coordenadas, estado, fuente de ubicación, horarios y servicios.
- Los estados de coordenadas y estimaciones proceden de los registros existentes. Este rediseño no certifica nuevas ubicaciones ni modifica los datos.
- La actualización mediante un nuevo JSON está pendiente de su entrega.
- El botón **Ver en el mapa** conserva el mapa local y su detalle. La integración por sucursal con Mapa DoctorSV fue aplazada.

## Archivos

`index.html` contiene la estructura. `assets/data.js` conserva los datos; `model.js` las consultas; `cards.js` las fichas; `map.js` el mapa; `app.js` la coordinación; `styles.css` los temas y estilos adaptables.

El proyecto sigue siendo estático y compatible con GitHub Pages, sin compilación ni servicios de backend. Para publicarlo, deben incluirse `index.html` y todo el directorio `assets/`; las rutas son relativas.

## Recursos

Leaflet 1.9.4, un sprite de Lucide 0.468.0 y las fuentes Manrope y DM Sans se sirven localmente. Sus licencias están en `assets/vendor/` y `assets/fonts/`. `scripts/prepare-assets.js` permite volver a preparar el sprite y las fuentes desde sus fuentes públicas; no es necesario ejecutarlo para abrir la aplicación.

El mapa base solicita teselas a OpenStreetMap y mantiene su atribución. Necesita conexión; si falla, las fichas y los filtros continúan disponibles. La apariencia se guarda únicamente en el almacenamiento local del navegador, cuando está disponible. El movimiento se reduce según la preferencia del dispositivo.
