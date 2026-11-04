# Abrir una sucursal en DoctorSV — 4 de noviembre de 2026

Se agregó **Ver en DoctorSV** al panel de sucursal seleccionada, conservando el mapa local, Ver ficha completa y Abrir ubicación. El enlace abre otra pestaña con el código y nombre de la farmacia. No transfiere coordenadas ni altera los registros.

DoctorSV valida la identidad, usa su selección existente para abrir la ficha y centrar el marcador y activa la visibilidad de inactivas cuando corresponde. Los registros pendientes de ubicación abren su ficha sin crear un punto. El encuadre evita que el marcador quede debajo del panel; en móvil la ficha inicial ocupa como máximo la mitad del área del mapa y recupera su altura habitual al cerrarse.

Verificación: 14 pruebas territoriales y 8 pruebas de DoctorSV. Comparación íntegra de los 443 registros territoriales y del bloque de datos original de DoctorSV. Pruebas de navegador con Farmacia El Carmen (E10F1506), una farmacia inactiva (E10F1519), encuadre de escritorio/móvil y aviso de identidad contradictoria.

La conciliación de enlaces encuentra 442 coincidencias de 443 sucursales. E10F2252 figura como Farmacias Económicas Puma Santa María en el territorial y como Paseo Venecia en DoctorSV; se muestra un aviso en lugar de abrir una farmacia distinta. Este trabajo no corrige esa diferencia de datos ni sustituye el JSON pendiente.
