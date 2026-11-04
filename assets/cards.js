import { coordinates,escapeHtml as e,formatSchedule,phoneLink,readableName,serviceLabel,sourceInfo,statusName,normalize,doctorSVUrl } from './model.js';

export function icon(name, className='') {
  return `<svg class="icon ${className}" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
}

export function selectedBranchActions(branch){
  const point=coordinates(branch),doctorSV=doctorSVUrl(branch);
  return `<div class="selected-branch-actions"><button class="button button-primary" type="button" id="showSelectedCard">Ver ficha completa${icon('arrow-right')}</button>${point?`<a class="button button-secondary" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&amp;query=${point.join(',')}">Abrir ubicación${icon('arrow-up-right')}</a>`:''}${doctorSV?`<a class="button button-secondary doctorsv-link" target="_blank" rel="noopener noreferrer" href="${e(doctorSV)}" aria-label="Ver ${e(readableName(branch.nombre))} en DoctorSV, abre en otra pestaña">Ver en DoctorSV${icon('arrow-up-right')}</a>`:''}</div>`;
}

export function branchCard(branch,index) {
  const point=coordinates(branch),phone=phoneLink(branch.telefono),source=sourceInfo(branch);
  const status=normalize(branch.estatus)==='activo'?'active':normalize(branch.estatus)==='inactivo temporal'?'temporary':'inactive';
  const services=[['24 horas','abierto24','clock3'],['Inyectología','inyectologia','syringe'],['Controlados','controlados','shield-check'],['Biológicos','biologicos','thermometer']];
  const detail=(name,iconName,value)=>`<div class="branch-detail">${icon(iconName)}<div><span class="detail-label">${name}</span><span class="detail-value">${value}</span></div></div>`;
  return `<article class="branch-card" id="branch-${index}" aria-labelledby="branch-title-${index}">
    <div class="branch-top"><span class="chain-name">${e(readableName(branch.cadena))}</span><span class="status status-${status}">${e(statusName(branch.estatus))}</span></div>
    <h3 id="branch-title-${index}">${e(readableName(branch.nombre))}</h3>
    <div class="branch-identification"><span class="branch-code">${e(branch.codigo||'Sin código')}</span><span>${e(branch.distrito||'Sin distrito')}</span></div>
    <div class="branch-information">
      ${detail('Dirección','map-pin',e(branch.direccion||'Sin dato'))}
      ${detail('Teléfono','phone',phone?`<a class="phone-link" href="${phone}">${e(String(branch.telefono))}</a>`:e(branch.telefono||'Sin dato'))}
      ${detail('Coordenadas','navigation',point?`<span class="coordinates">${point.map(n=>n.toFixed(6)).join(', ')}</span>`:'Sin coordenadas')}
    </div>
    <section class="branch-schedule" aria-label="Horarios de atención"><h4>${icon('clock3')} Horarios de atención</h4><dl>
      <dt>Lunes a viernes</dt><dd>${e(formatSchedule(branch.horario_lv)).replaceAll(' / ','<br>')}</dd>
      <dt>Sábado</dt><dd>${e(formatSchedule(branch.horario_sab)).replaceAll(' / ','<br>')}</dd>
      <dt>Domingo</dt><dd>${e(formatSchedule(branch.horario_dom)).replaceAll(' / ','<br>')}</dd>
    </dl></section>
    <dl class="branch-services">${services.map(([label,key,iconName])=>{const value=serviceLabel(branch[key]);return `<div><dt>${icon(iconName)}${label}</dt><dd class="service-${value==='Sí'?'yes':value==='No'?'no':'unknown'}">${value==='Sí'?icon('check'):''}${value}</dd></div>`;}).join('')}</dl>
    <details class="location-source"><summary>${icon(source.tone==='estimated'?'triangle-alert':'shield-check')}<span>${e(source.label)}</span>${icon('chevron-down')}</summary><p>${e(source.detail)}</p><p class="record-location">Ubicación registrada: ${e([branch.distrito,branch.municipio,branch.departamento].filter(Boolean).join(' · '))}</p></details>
    <div class="branch-actions">${point?`<button class="button button-primary" type="button" data-locate="${index}">${icon('locate-fixed')}Ver en el mapa</button>`:''}${phone?`<a class="button button-secondary" href="${phone}" aria-label="Llamar a ${e(readableName(branch.nombre))}">${icon('phone')}Llamar</a>`:''}${!point&&!phone?'<span class="unavailable-actions">Ubicación y teléfono no disponibles</span>':''}</div>
  </article>`;
}
