import {test} from 'node:test';
import assert from 'node:assert/strict';
import {branchTerritory} from '../assets/model.js';
import {BRANCHES,TERRITORIES} from '../assets/data.js';

test('la farmacia de la captura muestra departamento, municipio y distrito propios',()=>{
  assert.deepEqual(branchTerritory(TERRITORIES,BRANCHES.find(b=>b.codigo==='E10F1245')),{department:'Usulután',municipality:'Usulután Este',district:'Usulután'});
});
test('el municipio se obtiene del catálogo territorial incluso si el registro contiene otro',()=>{
  const branch={departamento:'La Libertad',municipio:'La Libertad Este',distrito:'Santa Tecla'};
  assert.deepEqual(branchTerritory(TERRITORIES,branch),{department:'La Libertad',municipality:'La Libertad Sur',district:'Santa Tecla'});
});
test('los distritos homónimos se resuelven dentro de su departamento',()=>{
  assert.equal(branchTerritory(TERRITORIES,{departamento:'Morazán',distrito:'San Fernando'}).municipality,'Morazán Norte');
  assert.equal(branchTerritory(TERRITORIES,{departamento:'Chalatenango',distrito:'San Fernando'}).municipality,'Chalatenango Norte');
});
