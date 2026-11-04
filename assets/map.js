import { coordinates,escapeHtml as e,normalize,readableName } from './model.js';

const NATIONAL_BOUNDS=[[13.08,-90.15],[14.47,-87.68]];

export function createBranchMap(container,onSelect) {
  const message=document.getElementById('mapMessage');
  const notify=text=>{message.textContent=text;message.hidden=!text;};
  const L=window.L;
  if(!L){
    container.innerHTML='<div class="empty-state"><h3>Mapa no disponible</h3><p>El directorio sigue disponible. Recarga la página para volver a intentar.</p></div>';
    return {update(){},focus(){},fit(){},refreshTheme(){}};
  }
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map=L.map(container,{scrollWheelZoom:false,zoomControl:false,fadeAnimation:!reduced(),zoomAnimation:!reduced(),markerZoomAnimation:!reduced(),minZoom:7,maxZoom:19});
  L.control.zoom({position:'bottomright',zoomInTitle:'Acercar',zoomOutTitle:'Alejar'}).addTo(map);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',maxZoom:19});
  tiles.on('loading',()=>container.setAttribute('aria-busy','true'));
  tiles.on('load',()=>container.setAttribute('aria-busy','false'));
  tiles.on('tileerror',()=>notify('No se pudo cargar una parte del mapa base. El directorio y las coordenadas registradas siguen disponibles.'));
  tiles.addTo(map);
  const group=L.featureGroup().addTo(map),markers=new Map();
  let selected=null;
  let lastEntries=[];
  const colors=()=>{
    const style=getComputedStyle(document.documentElement);
    return {active:style.getPropertyValue('--map-active').trim(),inactive:style.getPropertyValue('--map-inactive').trim(),border:style.getPropertyValue('--surface').trim()};
  };
  function styleMarker(marker,entry,chosen=false){
    const palette=colors();
    marker.setStyle({radius:chosen?9:5,color:palette.border,weight:chosen?3:1.8,fillColor:normalize(entry.branch.estatus)==='activo'?palette.active:palette.inactive,fillOpacity:chosen?1:.88});
  }
  function fit(){
    const bounds=group.getBounds();
    if(bounds.isValid()) map.fitBounds(bounds,{padding:[35,35],maxZoom:14,animate:false});
    else map.fitBounds(NATIONAL_BOUNDS,{padding:[10,10],animate:false});
  }
  function update(entries){
    lastEntries=entries;
    selected=null;
    group.clearLayers();markers.clear();
    for(const entry of entries){
      const point=coordinates(entry.branch);
      if(!point) continue;
      const marker=L.circleMarker(point).addTo(group);
      styleMarker(marker,entry);
      marker.bindTooltip(e(readableName(entry.branch.nombre)),{direction:'top',offset:[0,-7]});
      const content=document.createElement('div');
      content.innerHTML=`<strong>${e(readableName(entry.branch.nombre))}</strong><small>${e(entry.branch.codigo||'Sin código')} · ${e(entry.branch.distrito||'Sin distrito')}</small>`;
      const button=document.createElement('button');button.type='button';button.className='popup-action';button.textContent='Ver ficha completa';
      button.addEventListener('click',()=>onSelect(entry.index,{showCard:true}));content.append(button);
      marker.bindPopup(content,{maxWidth:255});
      marker.on('click',()=>onSelect(entry.index,{showCard:false}));
      markers.set(entry.index,{marker,entry});
    }
    fit();
  }
  function focus(index,{openPopup=true}={}){
    if(selected!==null && markers.has(selected)) {const old=markers.get(selected);styleMarker(old.marker,old.entry);}
    const item=markers.get(index);
    if(!item) return;
    selected=index;styleMarker(item.marker,item.entry,true);item.marker.bringToFront();
    map.setView(item.marker.getLatLng(),Math.max(map.getZoom(),14),{animate:!reduced(),duration:.24});
    if(openPopup) item.marker.openPopup();
  }
  function refreshTheme(){
    for(const {marker,entry} of markers.values()) styleMarker(marker,entry,entry.index===selected);
    map.invalidateSize({animate:false});
  }
  new ResizeObserver(()=>map.invalidateSize({animate:false,pan:false})).observe(container);
  map.fitBounds(NATIONAL_BOUNDS,{padding:[10,10],animate:false});
  return {update,focus,fit,refreshTheme,get entries(){return lastEntries;}};
}
