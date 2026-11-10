const traits = [
  ['Superior',29.97,'Common','Superior.png','Increased Damage'],['Nimble',24.98,'Common','Nimble.png','Decreased SPA'],['Range',24.98,'Common','Range.png','Increased Range'],['Adept',9.99,'Rare','Adept.png','+50% XP'],['Culling',5,'Legendary','Culling.png','20% damage to low HP'],['Sniper',2.5,'Legendary','Sniper.png','+25% Range'],['Godspeed',1,'Mythical','Godspeed.png','-20% SPA'],['Reaper',.8,'Mythical','Reaper.png','+15% Damage'],['Celestial',.36,'Mythical','Celestial.png','+10% DMG / Range'],['Divine',.2,'Mythical','Divine.png','+20% Damage'],['Golden',.15,'Mythical','Golden.png','+30% Damage'],['Unique',.1,'Secret','Unique.png','4x Damage']
];
const variants={Superior:[['I','+10% Damage'],['II','+12.5% Damage'],['III','+15% Damage']],Nimble:[['I','-5% SPA'],['II','-7.5% SPA'],['III','-12% SPA']],Range:[['I','+10% Range'],['II','+12.5% Range'],['III','+15% Range']]};
const details={
  Superior:'เพิ่ม Damage ให้ยูนิต: I +10%, II +12.5%, III +15% และเพิ่ม DPS ตามระดับเดียวกัน',
  Nimble:'ลด SPA ทำให้โจมตีเร็วขึ้น: I ลด 5%, II ลด 7.5%, III ลด 12%',
  Range:'เพิ่มระยะโจมตี: I +10%, II +12.5%, III +15%',
  Adept:'ได้รับ XP เพิ่มขึ้น 50% เหมาะสำหรับการอัปเลเวลยูนิต และไม่เพิ่ม DPS',
  Culling:'เพิ่ม Damage 20% ต่อศัตรูที่มี HP เหลือ 30% หรือน้อยกว่า',
  Sniper:'เพิ่ม Range 25% เหมาะกับยูนิตที่ใช้ความสามารถโจมตีหลายเป้าหมาย',
  Godspeed:'ลด SPA 20% ทำให้โจมตีเร็วขึ้น และเพิ่ม DPS โดยเฉลี่ยประมาณ 25%',
  Reaper:'เพิ่ม Damage 15% และเพิ่ม Damage ต่อบอสอีก 25%',
  Celestial:'เพิ่ม Damage 10%, Range 10%, True Damage 20% และเพิ่ม DoT 20%',
  Divine:'เพิ่ม Damage 20%, ลด SPA 10% และเพิ่ม Range 20%',
  Golden:'เพิ่ม Damage 30% และได้รับ Yen เพิ่ม 20% เมื่อทำเงิน',
  Unique:'เพิ่ม Damage 4 เท่า, ลด SPA 10%, เพิ่ม Range 10% และวางยูนิตนี้ได้สูงสุด 1 ตัว'
};
const totalWeight=traits.reduce((a,t)=>a+t[1],0),rarityRank={Common:1,Rare:2,Legendary:3,Mythical:4,Secret:5};
let rolls=0,history=[],best=0,rare=0,autoRunning=false,autoTimer=null;
const $=id=>document.getElementById(id);
const imagePath=name=>'Image/'+name;
function pick(){let n=Math.random()*totalWeight;for(const trait of traits){n-=trait[1];if(n<=0)return trait}return traits[0]}
function withVariant(trait){const list=variants[trait[0]];return{trait,variant:list?list[Math.floor(Math.random()*list.length)]:null}}
function label(item){return item.variant?item.trait[0]+' '+item.variant[0]:item.trait[0]}
function effect(item){return item.variant?item.variant[1]:item.trait[4]}
function color(r){return{Common:'#b2b8d0',Rare:'#5dd6ff',Legendary:'#be78ff',Mythical:'#ff9b50',Secret:'#ffd166'}[r]}
function renderResult(item){const t=item.trait;$('resultCard').innerHTML=`<div class="result-content"><img class="result-icon" src="${imagePath(t[3])}" alt="${label(item)}"><h3 style="color:${color(t[2])}">${label(item)}</h3></div>`;$('resultTitle').textContent=label(item);$('rollNumber').textContent='#'+String(rolls).padStart(4,'0')}
function addHistory(item){history.unshift(item);$('history').innerHTML=history.map(x=>`<div class="history-item"><img src="${imagePath(x.trait[3])}" alt="${label(x)}"><div>${label(x)}</div><small>${x.trait[1]}%</small></div>`).join('');$('historyCount').textContent=history.length.toLocaleString()+' results'}
function updateStats(){$('totalRolls').textContent=rolls.toLocaleString();$('bestRarity').textContent=best?traits.find(t=>rarityRank[t[2]]===best)?.[2]:'—';$('remnants').textContent=rolls.toLocaleString();$('rareCount').textContent=rare+' rolls';$('rareMeter').style.width=Math.min(100,rare/Math.max(1,rolls)*500)+'%'}
function roll(amount=1){let last=null;for(let i=0;i<amount;i++){last=withVariant(pick());rolls++;if(rarityRank[last.trait[2]]>best)best=rarityRank[last.trait[2]];if(rarityRank[last.trait[2]]>=4)rare++;addHistory(last)}if(last)renderResult(last);updateStats();return last}
function matches(item,target){return target==='any'||label(item)===target}
function populateTargets(){$('autoTarget').innerHTML='<option value="any">Any trait</option>'+traits.flatMap(t=>variants[t[0]]?variants[t[0]].map(v=>`<option value="${t[0]} ${v[0]}">${t[0]} ${v[0]}</option>`):[`<option value="${t[0]}">${t[0]}</option>`]).join('')}
function autoStep(){if(!autoRunning)return;const item=roll();if(matches(item,$('autoTarget').value)){autoRunning=false;clearTimeout(autoTimer);$('autoStatus').textContent='Found: '+label(item);$('autoStart').disabled=false;$('autoStop').disabled=true;return}autoTimer=setTimeout(autoStep,35)}
function startAuto(){if(autoRunning)return;autoRunning=true;$('autoStatus').textContent='Rolling...';$('autoStart').disabled=true;$('autoStop').disabled=false;autoStep()}
function stopAuto(){autoRunning=false;clearTimeout(autoTimer);$('autoStatus').textContent='Stopped';$('autoStart').disabled=false;$('autoStop').disabled=true}
function renderOdds(){$('oddsGrid').innerHTML=traits.map(t=>`<button class="odds-item" type="button" data-trait="${t[0]}" style="--rarity:${color(t[2])};--width:${Math.max(8,t[1]/30*100)}%"><img src="${imagePath(t[3])}" alt="${t[0]}"><div class="name">${variants[t[0]]?t[0]+' I-III':t[0]}</div><div class="pct">${t[1]}%</div><div class="bar"></div></button>`).join('');document.querySelectorAll('.odds-item').forEach(card=>card.onclick=()=>{const trait=traits.find(t=>t[0]===card.dataset.trait);$('modalIcon').src=imagePath(trait[3]);$('modalIcon').alt=trait[0];$('modalTitle').textContent=trait[0];$('modalChance').textContent=trait[1]+'% chance';$('modalDescription').textContent=details[trait[0]];$('traitModal').hidden=false})}
 $('rollBtn').onclick=()=>roll();document.querySelectorAll('[data-rolls]').forEach(b=>b.onclick=()=>roll(+b.dataset.rolls));$('autoStart').onclick=startAuto;$('autoStop').onclick=stopAuto;$('modalClose').onclick=()=>{$('traitModal').hidden=true};$('traitModal').onclick=e=>{if(e.target.id==='traitModal')$('traitModal').hidden=true};$('resetBtn').onclick=()=>{stopAuto();rolls=0;history=[];best=0;rare=0;$('history').innerHTML='<div class="empty-history">Your full roll history will appear here.</div>';$('historyCount').textContent='0 results';$('resultTitle').textContent='Ready to reroll?';$('rollNumber').textContent='#0000';$('resultCard').innerHTML='<div class="result-placeholder"><div class="dice">*</div><p>Choose your luck.<br>Click <b>REROLL TRAIT</b> to begin.</p></div>';updateStats()};populateTargets();renderOdds();
