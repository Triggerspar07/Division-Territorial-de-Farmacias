import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { BRANCHES,TERRITORIES } from '../assets/data.js';

const original=execFileSync('git',['show','83b6e371d42c59a9358603e7a2fd0b0e58f67e25:index.html'],{encoding:'utf8',maxBuffer:8_000_000});
const context={};vm.createContext(context);
vm.runInContext(original.slice(original.indexOf('const DATA ='),original.indexOf('let currentDeptoIdx'))+';this.snapshot={branches:FARMACIAS,territories:DATA};',context);
assert.deepEqual(BRANCHES,JSON.parse(JSON.stringify(context.snapshot.branches)));
assert.deepEqual(TERRITORIES,JSON.parse(JSON.stringify(context.snapshot.territories)));
const departments=TERRITORIES.flatMap(z=>z.departamentos),municipalities=departments.flatMap(d=>d.municipios);
console.log(JSON.stringify({preservedBranches:BRANCHES.length,departments:departments.length,municipalities:municipalities.length,districts:municipalities.flatMap(m=>m.distritos).length,states:BRANCHES.reduce((totals,row)=>(totals[row.estatus]=(totals[row.estatus]||0)+1,totals),{})},null,2));
