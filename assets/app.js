import { TERRITORIES,BRANCHES } from './data.js';
import { selectBranches,searchIndex,searchEntries,normalize,readableName,escapeHtml as e,coordinates,statusName,branchTerritory } from './model.js?v=atlas-territorio-20261105';
import { branchCard,icon,selectedBranchActions } from './cards.js';
import { createBranchMap } from './map.js';

const $=id=>document.getElementById(id);
const departments=TERRITORIES.flatMap(z=>z.departamentos.map(d=>({...d,zone:z.zona})));
const branchIds=new Map(BRANCHES.map((row,index)=>[row,index]));
const index=searchIndex(TERRITORIES,BRANCHES);
const state={department:'',municipality:'',district:'',chain:'',status:'',service:'',limit:12,selected:null};
let results=[],searchResults=[],activeSearch=-1;
let themeTimer;
let renderedDepartment=null;
const map=createBranchMap($('branchMap'),(id,options)=>selectBranch(id,{...options,scrollMap:false}));
const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const currentDepartment=()=>departments.find(d=>d.nombre===state.department);
const currentMunicipality=()=>currentDepartment()?.municipios.find(m=>m.nombre===state.municipality);
const option=(value,label)=>`<option value="${e(value)}">${e(label)}</option>`;
const announce=text=>$('announcements').textContent=text;
const formatCount=(n,one,many)=>`${n} ${n===1?one:many}`;

function animateChange(element,event){
  if(reduceMotion() || !(event instanceof MouseEvent) || event.detail===0 || !element.animate) return;
  element.getAnimations().forEach(animation=>animation.cancel());
  element.animate([{opacity:.7,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.23,1,.32,1)'});
}

function renderNavigation(){
  if($('departmentNav').childElementCount){
    $('departmentNav').querySelectorAll('[data-department]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.department===state.department)));
    $('departmentSelect').value=state.department;
    return;
  }
  const count=department=>selectBranches(BRANCHES,{department}).length;
  $('departmentNav').innerHTML=`<button type="button" class="department-button all-departments" data-department="" aria-current="${!state.department}"><span>${icon('globe2')} Todo El Salvador</span><span class="dept-count">${BRANCHES.length}</span></button>`+TERRITORIES.map(zone=>`<div class="zone-group"><h2 class="zone-title">${e(zone.zona)}</h2>${zone.departamentos.map(dept=>`<button type="button" class="department-button" data-department="${e(dept.nombre)}" aria-current="${state.department===dept.nombre}"><span>${e(dept.nombre)}</span><span class="dept-count">${count(dept.nombre)}</span></button>`).join('')}</div>`).join('');
  $('departmentSelect').innerHTML=option('','Todo El Salvador')+departments.map(d=>option(d.nombre,d.nombre)).join('');
  $('departmentSelect').value=state.department;
}

function setTerritory({department='',municipality='',district=''},event){
  const previousDepartment=state.department;
  const focused=document.activeElement;
  const focusedCrumb=focused?.dataset.crumb;
  const preserveDistrictFocus=focused?.hasAttribute('data-district') && previousDepartment===department;
  Object.assign(state,{department,municipality,district,chain:'',status:'',service:'',limit:12,selected:null});
  render();
  const browser=$('territoryBrowser');
  browser.open=preserveDistrictFocus || Boolean(department && !district && !municipality);
  if(focusedCrumb){
    const replacement=$('breadcrumbs').querySelector(`[data-crumb="${focusedCrumb}"]`);
    if(replacement)replacement.focus({preventScroll:true});
    else{$('pageTitle').tabIndex=-1;$('pageTitle').focus({preventScroll:true});}
  }
  animateChange($('pageTitle'),event);
}

function renderTerritory(){
  const dept=currentDepartment(),mun=currentMunicipality();
  const districts=mun?mun.distritos:dept?.municipios.flatMap(m=>m.distritos)||[];
  $('municipalitySelect').innerHTML=option('','Todos los municipios')+(dept?.municipios||[]).map(m=>option(m.nombre,m.nombre)).join('');
  $('municipalitySelect').value=state.municipality;$('municipalitySelect').disabled=!dept;
  $('districtSelect').innerHTML=option('','Todos los distritos')+districts.map(d=>option(d,d)).join('');
  $('districtSelect').value=state.district;$('districtSelect').disabled=!dept;
  $('resetTerritory').hidden=!dept;
  const crumbs=[`<button type="button" data-crumb="country">El Salvador</button>`];
  if(dept) crumbs.push(`${icon('chevron-right')}<button type="button" data-crumb="department">${e(dept.nombre)}</button>`);
  if(state.municipality) crumbs.push(`${icon('chevron-right')}<button type="button" data-crumb="municipality">${e(state.municipality)}</button>`);
  if(state.district) crumbs.push(`${icon('chevron-right')}<span aria-current="page">${e(state.district)}</span>`);
  if(!dept) crumbs[0]='<span aria-current="page">Explorador territorial</span>';
  $('breadcrumbs').innerHTML=crumbs.join('');
  $('pageTitle').textContent=state.district||state.municipality||state.department||'El Salvador';
  $('pageDescription').textContent=state.district?`Consulta las farmacias de ${state.district}, sus horarios y servicios.`:state.municipality?`Explora sus ${districts.length} distritos y las sucursales registradas.`:dept?`${formatCount(dept.municipios.length,'municipio','municipios')} · ${formatCount(districts.length,'distrito','distritos')} para explorar.`:'Encuentra una farmacia y explora su territorio.';
  $('pageContext').textContent=dept?dept.zone:'Vista nacional';
  $('territoryBrowser').hidden=!dept;
  if(dept){
    $('territoryBrowserTitle').textContent=`${formatCount(dept.municipios.length,'municipio','municipios')} y ${formatCount(dept.municipios.flatMap(m=>m.distritos).length,'distrito','distritos')}`;
    if(renderedDepartment!==dept.nombre){
      $('territoryGroups').innerHTML=dept.municipios.map(m=>`<section class="municipality-group"><h3>${e(m.nombre)}</h3><div class="district-chips">${m.distritos.map(d=>`<button class="district-chip" type="button" data-district="${e(d)}" data-municipality="${e(m.nombre)}" aria-pressed="${state.district===d}">${e(d)}</button>`).join('')}</div></section>`).join('');
      renderedDepartment=dept.nombre;
    }else $('territoryGroups').querySelectorAll('[data-district]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.district===state.district)));
  }
  renderTerritoryContext();
}

function renderTerritoryContext(){
  const branch=state.selected===null?null:BRANCHES[state.selected];
  const territory=branch?branchTerritory(TERRITORIES,branch):null;
  const department=territory?territory.department:state.department||'Todos los departamentos';
  const municipality=territory?territory.municipality:state.municipality||'Todos los municipios';
  const district=territory?territory.district:state.district||'Todos los distritos';
  $('territoryContext').innerHTML=`<div>Departamento<strong>${e(department)}</strong></div><div>Municipio<strong>${e(municipality)}</strong></div><div class="wide">Distrito<strong>${e(district)}</strong></div>`;
}

function scopeFilters(){
  return {department:state.department,district:state.district,districts:state.municipality?currentMunicipality()?.distritos||[]:undefined};
}

function renderFilters(){
  const scoped=selectBranches(BRANCHES,scopeFilters());
  const chains=[...new Set(scoped.map(row=>row.cadena))].sort((a,b)=>a.localeCompare(b,'es'));
  $('chainFilter').innerHTML=option('','Todas las cadenas')+chains.map(chain=>option(chain,readableName(chain))).join('');
  $('chainFilter').value=state.chain;$('statusFilter').value=state.status;$('serviceFilter').value=state.service;
  const active=Boolean(state.chain||state.status||state.service);
  $('activeFilters').hidden=!active;
  $('activeFilters').innerHTML=active?`<span>Filtros aplicados</span><button class="clear-filters" id="clearFilters" type="button">${icon('x')}Limpiar filtros</button>`:'';
  $('clearFilters')?.addEventListener('click',clearFilters);
}

function renderCards(){
  const shown=results.slice(0,state.limit);
  $('branchGrid').innerHTML=shown.length?shown.map(branch=>branchCard(branch,branchIds.get(branch))).join(''):emptyState();
  $('loadMore').hidden=results.length<=state.limit;
  $('paginationSummary').textContent=results.length?`${Math.min(state.limit,results.length)} de ${results.length} sucursales`:'';
  if(state.selected!==null) $('branch-'+state.selected)?.classList.add('is-selected');
}

function emptyState(){
  const filtered=state.chain||state.status||state.service;
  return `<div class="empty-state">${icon(filtered?'search-x':'map-pin')}<h3>${filtered?'Sin coincidencias':'Sin sucursales registradas'}</h3><p>${filtered?'No hay sucursales con esta combinación. Prueba con otros filtros.':'No hay farmacias registradas en este territorio en los datos actuales. Puedes consultar otro distrito o ampliar la selección.'}</p><button class="button button-secondary" type="button" data-empty-action="${filtered?'filters':'territory'}">${filtered?'Limpiar filtros':state.district?'Ver todo el departamento':'Explorar El Salvador'}${icon('arrow-right')}</button></div>`;
}

function render(){
  renderNavigation();renderTerritory();renderFilters();
  updateResults();
}

function updateResults(){
  results=selectBranches(BRANCHES,{...scopeFilters(),chain:state.chain,status:state.status,service:state.service}).sort((a,b)=>a.cadena.localeCompare(b.cadena,'es')||a.nombre.localeCompare(b.nombre,'es'));
  state.selected=null;$('selectedBranch').hidden=true;renderTerritoryContext();
  const active=results.filter(row=>normalize(row.estatus)==='activo').length;
  $('resultSummary').textContent=`${formatCount(results.length,'sucursal','sucursales')} · ${formatCount(active,'activa','activas')} · ${results.length-active} inactivas o temporales`;
  renderCards();
  const located=results.filter(row=>coordinates(row));
  $('mappedCount').textContent=`${located.length} en mapa`;
  map.update(results.map(branch=>({branch,index:branchIds.get(branch)})));
  if(!located.length){
    $('mapMessage').textContent=results.length?'Las sucursales de esta selección no tienen coordenadas registradas. Se muestra una vista nacional de referencia.':'No hay sucursales para representar en esta selección. Se muestra una vista nacional de referencia.';
    $('mapMessage').hidden=false;
  }else if($('mapMessage').textContent.startsWith('No hay sucursales')||$('mapMessage').textContent.startsWith('Las sucursales')) $('mapMessage').hidden=true;
}

function clearFilters(){
  Object.assign(state,{chain:'',status:'',service:'',limit:12,selected:null});renderFilters();updateResults();
}

function selectBranch(id,{showCard=false,scrollMap=true,event}={}){
  const branch=BRANCHES[id];if(!branch)return;
  if(!results.includes(branch)){
    const dept=departments.find(d=>normalize(d.nombre)===normalize(branch.departamento));
    const mun=dept?.municipios.find(m=>m.distritos.some(d=>normalize(d)===normalize(branch.distrito)));
    setTerritory({department:dept?.nombre||'',municipality:mun?.nombre||'',district:mun?.distritos.find(d=>normalize(d)===normalize(branch.distrito))||''},event);
    // A record without a valid territorial match remains findable in the national view.
    if(!results.includes(branch)) setTerritory({},event);
  }
  state.selected=id;
  renderTerritoryContext();
  const position=results.indexOf(branch);
  if(showCard && position>=state.limit){state.limit=Math.ceil((position+1)/12)*12;renderCards();}
  document.querySelectorAll('.branch-card.is-selected').forEach(card=>card.classList.remove('is-selected'));
  const card=$('branch-'+id);card?.classList.add('is-selected');
  $('selectedBranch').innerHTML=`<div class="selected-branch-top"><span>Sucursal seleccionada</span><span>${e(statusName(branch.estatus))}</span></div><h3>${e(readableName(branch.nombre))}</h3><p>${e(branch.codigo||'Sin código')} · ${e(branch.distrito||'Sin distrito')}</p>${selectedBranchActions(branch)}`;
  $('selectedBranch').hidden=false;
  $('showSelectedCard').addEventListener('click',ev=>selectBranch(id,{showCard:true,scrollMap:false,event:ev}));
  map.focus(id,{openPopup:!showCard});
  animateChange($('selectedBranch'),event);
  if(showCard){
    card?.scrollIntoView({behavior:reduceMotion()?'instant':'smooth',block:'center'});
    const action=card?.querySelector('[data-locate]');action?.focus({preventScroll:true});
  }else if(scrollMap && matchMedia('(max-width: 990px)').matches){
    $('branchMap').scrollIntoView({behavior:reduceMotion()?'instant':'smooth',block:'center'});
  }
  announce(`Seleccionada: ${readableName(branch.nombre)}. ${branch.codigo||''}`);
}

function closeSearch(){
  $('globalSearchResults').hidden=true;$('globalSearchInput').setAttribute('aria-expanded','false');$('globalSearchInput').removeAttribute('aria-activedescendant');activeSearch=-1;
}

function chooseSearch(entry,event){
  closeSearch();$('globalSearchInput').value=readableName(entry.label);
  if(entry.kind==='branch') {
    const branch=entry.branch;
    const department=departments.find(d=>normalize(d.nombre)===normalize(branch.departamento));
    const municipality=department?.municipios.find(m=>m.distritos.some(d=>normalize(d)===normalize(branch.distrito)));
    setTerritory({department:department?.nombre||'',municipality:municipality?.nombre||'',district:municipality?.distritos.find(d=>normalize(d)===normalize(branch.distrito))||''},event);
    selectBranch(entry.branchIndex,{showCard:true,scrollMap:false,event});
  } else setTerritory({department:entry.department,municipality:entry.municipality,district:entry.district},event);
  if(entry.kind!=='branch') { $('pageTitle').scrollIntoView({behavior:'instant',block:'nearest'});$('districtSelect').focus({preventScroll:true}); }
}

function renderSearch(){
  const query=$('globalSearchInput').value;
  searchResults=searchEntries(index,query);activeSearch=-1;
  if(!query.trim()){closeSearch();return;}
  const typeLabels={department:'Departamento',municipality:'Municipio',district:'Distrito',branch:'Farmacia'};
  $('globalSearchResults').innerHTML=searchResults.length?searchResults.map((entry,n)=>`<button id="search-option-${n}" type="button" class="search-result" role="option" aria-selected="false" data-search-result="${n}">${icon(entry.kind==='branch'?'building2':'map-pin')}<span><strong>${e(readableName(entry.label))}</strong><small>${e(readableName(entry.sub))}</small></span><span class="result-kind">${typeLabels[entry.kind]}</span></button>`).join(''):'<p class="search-empty" role="status">Sin resultados. Prueba con otro nombre, código o dirección.</p>';
  $('globalSearchResults').hidden=false;$('globalSearchInput').setAttribute('aria-expanded','true');
}

function updateSearchSelection(){
  $('globalSearchResults').querySelectorAll('[data-search-result]').forEach((button,n)=>button.setAttribute('aria-selected',String(n===activeSearch)));
  const target=$('search-option-'+activeSearch);
  if(target){$('globalSearchInput').setAttribute('aria-activedescendant',target.id);target.scrollIntoView({block:'nearest',behavior:'instant'});}
}

function setTheme(theme,event){
  clearTimeout(themeTimer);document.documentElement.classList.add('theme-transition');document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('farmacias-theme',theme);}catch{}
  const dark=theme==='dark',action=dark?'Activar Atlas, modo claro':'Activar Nyx, modo oscuro';$('themeToggle').setAttribute('aria-pressed',String(dark));$('themeToggle').setAttribute('aria-label',action);$('themeToggle').title=action;$('themeLabel').textContent=dark?'Atlas — modo claro':'Nyx — modo oscuro';
  map.refreshTheme();
  themeTimer=setTimeout(()=>document.documentElement.classList.remove('theme-transition'),300);
  if(event)announce(dark?'Nyx, modo oscuro, activado':'Atlas, modo claro, activado');
}

$('departmentNav').addEventListener('click',event=>{const button=event.target.closest('[data-department]');if(button)setTerritory({department:button.dataset.department},event);});
$('departmentSelect').addEventListener('change',event=>setTerritory({department:event.target.value},event));
$('municipalitySelect').addEventListener('change',event=>setTerritory({department:state.department,municipality:event.target.value},event));
$('districtSelect').addEventListener('change',event=>{
  const district=event.target.value;
  const municipality=district?currentDepartment()?.municipios.find(m=>m.distritos.includes(district))?.nombre||'':state.municipality;
  setTerritory({department:state.department,municipality,district},event);
});
$('resetTerritory').addEventListener('click',event=>setTerritory({},event));
$('territoryGroups').addEventListener('click',event=>{const button=event.target.closest('[data-district]');if(button)setTerritory({department:state.department,municipality:button.dataset.municipality,district:button.dataset.district},event);});
$('breadcrumbs').addEventListener('click',event=>{const crumb=event.target.closest('[data-crumb]');if(!crumb)return;setTerritory({department:crumb.dataset.crumb==='country'?'':state.department,municipality:crumb.dataset.crumb==='municipality'?state.municipality:''},event);});
for(const [id,key] of [['chainFilter','chain'],['statusFilter','status'],['serviceFilter','service']]) $(id).addEventListener('change',event=>{state[key]=event.target.value;state.limit=12;renderFilters();updateResults();});
$('branchGrid').addEventListener('click',event=>{
  const locate=event.target.closest('[data-locate]');if(locate){selectBranch(Number(locate.dataset.locate),{event});return;}
  const empty=event.target.closest('[data-empty-action]');if(empty)empty.dataset.emptyAction==='filters'?clearFilters():setTerritory({department:state.district?state.department:''},event);
});
$('loadMore').addEventListener('click',()=>{
  const firstNew=state.limit;state.limit+=12;renderCards();const next=results[firstNew];
  if(next){const target=$('branch-'+branchIds.get(next));target?.querySelector('button,a')?.focus({preventScroll:true});target?.scrollIntoView({behavior:'instant',block:'nearest'});}
});
$('fitMap').addEventListener('click',()=>map.fit());
$('themeToggle').addEventListener('click',event=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark',event));
$('globalSearchInput').addEventListener('input',renderSearch);
$('globalSearchInput').addEventListener('focus',()=>{if($('globalSearchInput').value)renderSearch();});
$('globalSearchInput').addEventListener('keydown',event=>{
  if(event.key==='Escape'){closeSearch();return;}
  if(['ArrowDown','ArrowUp'].includes(event.key)){
    event.preventDefault();if($('globalSearchResults').hidden)renderSearch();
    if(!searchResults.length)return;
    activeSearch=activeSearch<0?(event.key==='ArrowDown'?0:searchResults.length-1):(activeSearch+(event.key==='ArrowDown'?1:-1)+searchResults.length)%searchResults.length;updateSearchSelection();
  }
  if(event.key==='Enter'&&!$('globalSearchResults').hidden&&searchResults.length){event.preventDefault();chooseSearch(searchResults[Math.max(activeSearch,0)],event);}
});
$('globalSearchResults').addEventListener('click',event=>{const button=event.target.closest('[data-search-result]');if(button)chooseSearch(searchResults[Number(button.dataset.searchResult)],event);});
$('globalSearch').addEventListener('focusout',event=>{if(!event.currentTarget.contains(event.relatedTarget))closeSearch();});
document.addEventListener('click',event=>{if(!$('globalSearch').contains(event.target))closeSearch();});

setTheme(document.documentElement.dataset.theme);
render();
