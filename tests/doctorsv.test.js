import {test} from 'node:test';
import assert from 'node:assert/strict';
import {doctorSVUrl} from '../assets/model.js';
import {selectedBranchActions} from '../assets/cards.js';

const branch={codigo:'E10F1506',nombre:'FARMACIA EL CARMEN',lat:13.776007,lon:-90.032407};
test('el enlace a DoctorSV conserva código y nombre de la farmacia seleccionada',()=>{
  const link=new URL(doctorSVUrl(branch));
  assert.equal(link.origin,'https://triggerspar07.github.io');
  assert.equal(link.pathname,'/Mapa-de-DoctorSV/');
  assert.equal(link.searchParams.get('centro'),'farmacia:E10F1506');
  assert.equal(link.searchParams.get('nombre'),'FARMACIA EL CARMEN');
});
test('la acción DoctorSV se agrega sin quitar la ficha local ni Google Maps',()=>{
  const html=selectedBranchActions(branch);
  for(const text of ['Ver en DoctorSV','showSelectedCard','Ver ficha completa','google.com/maps','Abrir ubicación'])assert.ok(html.includes(text),text);
  assert.ok(html.includes('target="_blank"'));
  assert.ok(html.includes('rel="noopener noreferrer"'));
});
test('un registro sin coordenadas conserva el enlace por código y uno sin código no genera un destino ambiguo',()=>{
  assert.ok(selectedBranchActions({...branch,lat:null}).includes('Ver en DoctorSV'));
  assert.equal(doctorSVUrl({...branch,codigo:''}),null);
  assert.ok(!selectedBranchActions({...branch,codigo:''}).includes('Ver en DoctorSV'));
});
test('los caracteres de un nombre no pueden convertirse en parámetros adicionales o HTML',()=>{
  const url=new URL(doctorSVUrl({...branch,nombre:'Nombre & centro=otro <local>'}));
  assert.equal(url.searchParams.get('centro'),'farmacia:E10F1506');
  assert.equal(url.searchParams.get('nombre'),'Nombre & centro=otro <local>');
  assert.equal(url.searchParams.getAll('centro').length,1);
});
