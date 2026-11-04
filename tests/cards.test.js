import { test } from 'node:test';
import assert from 'node:assert/strict';
import { branchCard } from '../assets/cards.js';
const branch={nombre:'LA VIDA OPICO',cadena:'LA VIDA',codigo:'E10F2870',direccion:'Avenida Guerrero <local 1>',telefono:23180112,departamento:'La Libertad',municipio:'La Libertad Centro',distrito:'San Juan Opico',estatus:'INACTIVO TEMPORAL',lat:13.876805,lon:-89.358616,horario_lv:'7:00 AM A 12:00 MD Y 2:00 PM A 5:45 PM',horario_sab:'7:00 AM A 5:00 PM',horario_dom:'Cerrado',abierto24:false,inyectologia:true,controlados:null,biologicos:false,fuente:'estimado_ia',confianza_estimado:'media'};
test('la ficha conserva identidad, ubicación, tres horarios y cuatro servicios',()=>{
  const html=branchCard(branch,4);
  for(const text of ['E10F2870','23180112','13.876805','-89.358616','Lunes a viernes','Sábado','Domingo','Cerrado','24 horas','Inyectología','Controlados','Biológicos','Sin dato','Inactivo temporal','Ubicación estimada']) assert.ok(html.includes(text),text);
  assert.ok(html.includes('Avenida Guerrero &lt;local 1&gt;'));
  assert.ok(html.includes('tel:+50323180112'));
  assert.ok(html.includes('data-locate="4"'));
});
test('la ficha sin ubicación ni teléfono no ofrece acciones que lleven a puntos falsos',()=>{
  const html=branchCard({...branch,lat:null,telefono:''},0);
  assert.ok(!html.includes('tel:'));
  assert.ok(!html.includes('data-locate='));
  assert.ok(html.includes('Sin coordenadas'));
});
