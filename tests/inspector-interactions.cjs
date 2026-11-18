const pw=require('playwright'),assert=require('assert'),fs=require('fs');
(async()=>{const report={};for(const engine of ['chromium','webkit','firefox']){const b=await pw[engine].launch(),p=await b.newPage({viewport:{width:1280,height:900}});await p.goto((process.env.DASHLINE_URL||'http://127.0.0.1:8864'));
await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedSvg=text;}}}));
const open=async n=>p.evaluate(n=>{clearMorph();finishLens();select(n);stopLens();lensState='open';},n);
await open('general/swap');assert.equal(await p.locator('#relation-label').textContent(),'Parts');assert.equal(await p.locator('#part-links button').count(),2);
for(const [index,title] of [[0,'Right arrow'],[1,'Left arrow']]){await p.locator('#part-links button').nth(index).hover();await p.waitForTimeout(350);assert.equal(await p.locator('#big .hl[data-instance]').count(),1);await p.locator('#part-links button').nth(index).click();await p.waitForTimeout(330);assert.equal(await p.locator('#iname').textContent(),title);assert.equal(await p.locator('#part-links').getAttribute('data-kind'),'uses');assert.equal(await p.locator('#relation-label').textContent(),'Used in');assert.ok(await p.locator('#part-links button').count()>0);await p.locator('#cSvg').click();await p.waitForFunction(()=>window.__copiedSvg?.startsWith('<svg'));assert.equal(await p.evaluate(()=>new DOMParser().parseFromString(window.__copiedSvg,'image/svg+xml').querySelectorAll('parsererror').length),0);if(index===1)assert.match(await p.evaluate(()=>window.__copiedSvg),/rotate\(180 24 24\)/);await p.locator('#back').click();await p.waitForTimeout(330);assert.equal(await p.locator('#iname').textContent(),'Swap');}
// Interrupt entry with back, then enter the other occurrence.
await p.locator('#part-links button').first().click();await p.waitForTimeout(45);await p.locator('#back').click();await p.waitForTimeout(40);await p.locator('#part-links button').nth(1).click();await p.waitForTimeout(350);assert.equal(await p.locator('#iname').textContent(),'Left arrow');assert.equal(await p.locator('.ghost').count(),0);await p.locator('#back').click();await p.waitForTimeout(330);
await p.locator('#part-links button').nth(0).focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#iname').textContent(),'Right arrow');await p.locator('#back').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#iname').textContent(),'Swap');
await p.keyboard.press('Escape');
await p.locator('.it[data-c="drive"]').click();
await p.locator('.t[data-n="nav/lb_3branch_left"]').click();
assert.equal(await p.locator('#relation-label').textContent(),'Parts');
const arrowhead=p.getByRole('button',{name:'Maneuver arrowhead',exact:true});
await arrowhead.hover();
assert.equal(await p.locator('#big [data-part="part/maneuver_arrowhead"].hl').count(),1);
await arrowhead.press('Enter');
assert.equal(await p.locator('#relation-label').textContent(),'Used in');
assert.equal(await p.locator('#part-links [data-inspect="nav/lb_3branch_left"]').count(),1);
await p.locator('#back').press('Enter');
assert.equal(await p.locator('#iname').textContent(),'Left-back 3-way left');
await open('general/bluetooth');assert.equal(await p.locator('#part-links button').count(),0);assert.equal(await p.locator('#relation-label').isVisible(),false);
await open('general/mic_off');const slash=await p.evaluate(()=>inspection(sel).entries.find(n=>by[n].originPart==='part/off_slash'));await p.locator(`[data-inspect="${slash}"]`).click();await p.waitForTimeout(330);assert.equal(await p.locator('#part-links').getAttribute('data-kind'),'uses');assert.equal(await p.locator('#part-links [data-inspect="general/mic_off"]').count(),1);
await open('vehicle/fast_charge');const bolt=await p.evaluate(()=>inspection(sel).entries.find(n=>by[n].originPart==='part/bolt'));assert.ok(bolt);await p.locator(`[data-inspect="${bolt}"]`).click();await p.waitForTimeout(330);
for(const n of ['status/battery_full_charging','status/battery_mid_charging','vehicle/fast_charge'])assert.equal(await p.locator(`#part-links [data-inspect="${n}"]`).count(),1);
const usage=p.locator('#part-links [data-inspect="status/battery_full_charging"]');
const partState=await p.evaluate(()=>({sel,trail:[...trail],svg:svgOut(by[sel],24)}));
await usage.hover();await p.waitForTimeout(220);assert.equal(await p.locator('#big').getAttribute('data-n'),'status/battery_full_charging');
await usage.click();await usage.press('Enter');await usage.press('Space');
assert.deepEqual(await p.evaluate(()=>({sel,trail:[...trail]})),{sel:partState.sel,trail:partState.trail});assert.equal(await p.locator('#iname').textContent(),'Bolt');assert.equal(await p.locator('#relation-label').textContent(),'Used in');
// Copy during a preview still copies the selected part, never the preview icon.
await p.locator('#cSvg').click();assert.equal(await p.evaluate(()=>window.__copiedSvg),partState.svg);
await p.waitForTimeout(300);assert.equal(await p.locator('#big').getAttribute('data-n'),bolt);
await usage.focus();await p.waitForTimeout(220);assert.equal(await p.locator('#big').getAttribute('data-n'),'status/battery_full_charging');
await p.locator('#back').focus();await p.waitForTimeout(300);assert.equal(await p.locator('#big').getAttribute('data-n'),bolt);
await usage.hover();await p.waitForTimeout(220);await p.locator('#back').click();await p.waitForTimeout(330);assert.equal(await p.locator('#iname').textContent(),'Fast charge');assert.equal(await p.evaluate(()=>trail.length),0);
// Tapping a usage card on a touch device previews without navigation.
const touch=await b.newPage({viewport:{width:390,height:844},hasTouch:true});await touch.goto(process.env.DASHLINE_URL||'http://127.0.0.1:8864');
await touch.evaluate(()=>{select('vehicle/fast_charge');stopLens();lensState='open';go(inspection(sel).entries[0],{instant:true});});
await touch.locator('#part-links [data-inspect="status/battery_full_charging"]').tap();await touch.waitForTimeout(220);assert.equal(await touch.locator('#big').getAttribute('data-n'),'status/battery_full_charging');assert.equal(await touch.locator('#iname').textContent(),'Bolt');assert.equal(await touch.evaluate(()=>trail.length),1);await touch.close();
await p.emulateMedia({reducedMotion:'reduce'});await open('general/download');await p.locator('#part-links button').nth(1).click();assert.equal(await p.locator('#iname').textContent(),'Transfer tray');assert.equal(await p.evaluate(()=>morphs.length),0);
report[engine]={repeatedOccurrences:true,quickBack:true,keyboard:true,terminal:true,componentUses:true,batteryUses:true,previewOnly:true,touchPreview:true,reducedMotion:true,copySvg:true};await b.close();}console.log(report);})();
