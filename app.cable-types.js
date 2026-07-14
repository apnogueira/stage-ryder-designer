// Cable metadata extracted from app.js for lightweight modularization.

const CABLE_TYPES = [
  {id:'xlr',      label:'XLR',       color:'#47c4ff'},
  {id:'ts',       label:'Jack TS',   color:'#5a3a22'},
  {id:'trs',      label:'Jack TRS',  color:'#6a4528'},
  {id:'speakon',  label:'Speakon',   color:'#ff6b47'},
  {id:'ethernet', label:'Ethernet',  color:'#6a6f73'},
  {id:'usb',      label:'USB',       color:'#7c8aa5'},
  {id:'midi',     label:'MIDI',      color:'#c47fff'},
  {id:'digital',  label:'Digital',   color:'#47ffa0'},
];

function isKnownCableType(typeId) {
  return CABLE_TYPES.some(c => c.id === typeId);
}

function normalizeCableType(typeId, fallback = 'xlr') {
  return isKnownCableType(typeId) ? typeId : fallback;
}
