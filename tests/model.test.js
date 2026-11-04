import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectBranches, searchEntries, searchIndex, serviceLabel, coordinates, escapeHtml, formatSchedule } from '../assets/model.js';

const rows = [
  { nombre: 'Farmacia San José', codigo: 'SV001', cadena: 'La Vida', departamento: 'Morazán', municipio: 'Morazán Norte', distrito: 'San Fernando', estatus: 'ACTIVO', direccion: 'Avenida Central', telefono: 23180112, biologicos: true },
  { nombre: 'Farmacia San José', codigo: 'SV002', cadena: 'La Vida', departamento: 'Chalatenango', distrito: 'San Fernando', estatus: 'INACTIVO', biologicos: false },
  { nombre: 'Farmacia B', codigo: 'SV003', cadena: 'Otra', departamento: 'Morazán', distrito: 'San Fernando', estatus: 'INACTIVO TEMPORAL', biologicos: 'SÍ' }
];

test('distritos homónimos no mezclan sucursales de diferentes departamentos', () => {
  assert.deepEqual(selectBranches(rows, { department: 'Morazan', district: 'San Fernando' }).map(f=>f.codigo), ['SV001','SV003']);
});
test('cadena, estado y servicio se combinan sin ocultar inactivos por defecto', () => {
  assert.equal(selectBranches(rows, {}).length, 3);
  assert.deepEqual(selectBranches(rows, { chain: 'La Vida', status: 'ACTIVO', service: 'biologicos' }).map(f=>f.codigo), ['SV001']);
  assert.deepEqual(selectBranches(rows, { service: 'biologicos' }).map(f=>f.codigo), ['SV001','SV003']);
});
test('municipio limita su consulta al conjunto de distritos territoriales', () => {
  assert.deepEqual(selectBranches(rows, { department: 'Morazán', districts: [] }), []);
  assert.equal(selectBranches(rows, { department: 'Morazán', districts: ['San Fernando'] }).length, 2);
});
test('búsqueda encuentra códigos, teléfonos y dirección sin acentos', () => {
  const index=searchIndex([], rows);
  for (const query of ['san jose sv001','avenida central','23180112']) {
    assert.deepEqual(searchEntries(index,query).map(e=>e.branch.codigo), ['SV001']);
  }
  assert.deepEqual(searchEntries(index,'  '), []);
});
test('los servicios distinguen No de Sin dato y reconocen Sí explícitos', () => {
  for(const value of [true,'SI','SÍ',1]) assert.equal(serviceLabel(value),'Sí');
  for(const value of [false,'NO',0]) assert.equal(serviceLabel(value),'No');
  for(const value of [null,undefined,'','—','sin dato']) assert.equal(serviceLabel(value),'Sin dato');
});
test('no se convierten coordenadas ausentes o inválidas en ubicaciones', () => {
  assert.deepEqual(coordinates({lat:'13.876805',lon:-89.358616}),[13.876805,-89.358616]);
  for(const row of [{lat:null,lon:0},{lat:'',lon:0},{lat:Infinity,lon:0},{lat:91,lon:0},{lat:12,lon:-181}]) assert.equal(coordinates(row),null);
});
test('el contenido del directorio se escapa antes de convertirse en HTML', () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)"> &'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp;');
});

test('los horarios normalizan a.m. y p.m. sin duplicar puntuación',()=>{
  assert.equal(formatSchedule('7:00 a.m. – 5:00 p.m.'),'7:00 a. m. – 5:00 p. m.');
  assert.equal(formatSchedule('07:00 Am A 12:00 Md Y 02:00 Pm A 5:45 Pm'),'07:00 a. m. – 12:00 m. / 02:00 p. m. – 5:45 p. m.');
  assert.equal(formatSchedule('Cerrado'),'Cerrado');
});
