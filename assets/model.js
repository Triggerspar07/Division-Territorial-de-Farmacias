export function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
}

export function doctorSVUrl(branch){
  const code=String(branch.codigo??'').trim();
  if(!/^[A-Za-z0-9_-]{1,80}$/.test(code))return null;
  const url=new URL('https://triggerspar07.github.io/Mapa-de-DoctorSV/');
  url.searchParams.set('centro','farmacia:'+code);
  if(branch.nombre)url.searchParams.set('nombre',branch.nombre);
  return url.href;
}

export function selectBranches(rows, filters = {}) {
  const same = (a,b) => normalize(a) === normalize(b);
  return rows.filter(row =>
    (!filters.department || same(row.departamento, filters.department)) &&
    (!filters.district || same(row.distrito, filters.district)) &&
    (!filters.districts || filters.districts.some(d=>same(d,row.distrito))) &&
    (!filters.chain || same(row.cadena, filters.chain)) &&
    (!filters.status || same(row.estatus, filters.status)) &&
    (!filters.service || serviceLabel(row[filters.service]) === 'Sí')
  );
}

export function searchIndex(territories, rows) {
  const index=[];
  for(const zone of territories) for(const dept of zone.departamentos) {
    index.push({ kind:'department',label:dept.nombre,sub:zone.zona,department:dept.nombre,norm:normalize(dept.nombre) });
    for(const municipality of dept.municipios) {
      index.push({ kind:'municipality',label:municipality.nombre,sub:dept.nombre,department:dept.nombre,municipality:municipality.nombre,norm:normalize(municipality.nombre) });
      for(const district of municipality.distritos) index.push({kind:'district',label:district,sub:municipality.nombre+' · '+dept.nombre,department:dept.nombre,municipality:municipality.nombre,district,norm:normalize(district+' '+municipality.nombre+' '+dept.nombre)});
    }
  }
  rows.forEach((branch,branchIndex)=>index.push({kind:'branch',label:branch.nombre,sub:branch.cadena+' · '+(branch.distrito||branch.municipio||'Sin distrito'),branch,branchIndex,norm:normalize([branch.nombre,branch.codigo,branch.cadena,branch.departamento,branch.municipio,branch.distrito,branch.direccion,branch.telefono].join(' '))}));
  return index;
}

export function searchEntries(index,query) {
  const tokens=normalize(query).split(/\s+/).filter(Boolean);
  if(!tokens.length) return [];
  return index.filter(item=>tokens.every(token=>item.norm.includes(token))).slice(0,30);
}

export function serviceLabel(value) {
  if(value===true || value===1 || ['si','true','1'].includes(normalize(value))) return 'Sí';
  if(value===false || value===0 || ['no','false','0'].includes(normalize(value))) return 'No';
  return 'Sin dato';
}

export function coordinates(row) {
  if(row.lat==null || row.lon==null || String(row.lat).trim()==='' || String(row.lon).trim()==='') return null;
  const lat=Number(row.lat),lon=Number(row.lon);
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat)<=90 && Math.abs(lon)<=180 ? [lat,lon] : null;
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

export function readableName(value) {
  if(!value) return 'Sin dato';
  if(value !== value.toLocaleUpperCase('es')) return value;
  return value.toLocaleLowerCase('es').replace(/(^|[\s.\-])(\p{L})/gu,(_,space,letter)=>space+letter.toLocaleUpperCase('es'));
}

export function statusName(value) {
  const key=normalize(value);
  return ({activo:'Activo',inactivo:'Inactivo','inactivo temporal':'Inactivo temporal'})[key] || readableName(value);
}

export function sourceInfo(branch) {
  const source=branch.fuente;
  if(source==='estimado_ia') {
    const confidence=({alta:'Confianza alta',media:'Verificar ubicación',estimado_referencia:'Por referencia'})[branch.confianza_estimado]||'Sin confianza indicada';
    return {tone:'estimated',label:'Ubicación estimada',detail:confidence+'. Estimación heredada; requiere confirmación.'};
  }
  if(source==='usuario') return {tone:'recorded',label:'Confirmación manual registrada',detail:'Fuente de ubicación registrada en los datos existentes.'};
  if(source==='confirmado_fuente_externa') return {tone:'recorded',label:'Fuente externa registrada',detail:'Verificación histórica registrada en los datos existentes.'};
  if(source==='direccion_confirmada') return {tone:'recorded',label:'Dirección confirmada en la fuente',detail:'Estado heredado de la fuente; sin nueva verificación física.'};
  return {tone:'unknown',label:'Sin fuente de ubicación',detail:'La fuente de las coordenadas no está registrada.'};
}

export function formatSchedule(value) {
  if(!value || !String(value).trim()) return 'Sin dato';
  return String(value).replace(/\bA\.?\s*M\b\.?/gi,'a. m.').replace(/\bP\.?\s*M\b\.?/gi,'p. m.').replace(/\bMD\b/gi,'m.').replace(/\s+A\s+/g,' – ').replace(/\s+Y\s+/g,' / ');
}

export function phoneLink(value) {
  const digits=String(value??'').replace(/\D/g,'');
  if(digits.length===8) return 'tel:+503'+digits;
  if(digits.length===11 && digits.startsWith('503')) return 'tel:+'+digits;
  return null;
}
