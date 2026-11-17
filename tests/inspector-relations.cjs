const pw=require('playwright'),assert=require('assert');
(async()=>{for(const engine of ['chromium','webkit','firefox']){
  const browser=await pw[engine].launch(),page=await browser.newPage();
  await page.goto(process.env.DASHLINE_URL||'http://127.0.0.1:8864');
  const result=await page.evaluate(async()=>{
    const failures=[],icons=ICONS.filter(o=>o.c!=='part'),parts=ICONS.filter(o=>o.c==='part');
    const refs=new Map(icons.map(o=>[o.n,new Set([...tagged(o.n).matchAll(/data-part="([^"]+)"/g)].map(m=>m[1]))]));
    let cards=0;
    for(const part of parts){
      const expected=icons.filter(o=>refs.get(o.n).has(part.n)).map(o=>o.n).sort();
      const links=inspectorLinks(part),actual=links.names.slice().sort();
      if(JSON.stringify(actual)!==JSON.stringify(expected))failures.push([part.n,'usage mismatch',actual,expected]);
      for(const n of actual){
        const host=document.createElement('div');host.innerHTML=focusSvg(n,part.n);
        const markup=new XMLSerializer().serializeToString(host.firstElementChild);
        const xml=new DOMParser().parseFromString(markup,'image/svg+xml');
        if(xml.querySelector('parsererror')){failures.push([part.n,n,'invalid SVG']);continue;}
        const img=new Image();img.src='data:image/svg+xml;base64,'+btoa(markup);
        try{await img.decode();const c=document.createElement('canvas');c.width=c.height=96;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,96,96);if(!ctx.getImageData(0,0,96,96).data.some((v,i)=>i%4===3&&v))failures.push([part.n,n,'empty card']);}catch(e){failures.push([part.n,n,e.message]);}
        cards++;
      }
    }
    return {icons:icons.length,parts:parts.length,cards,failures};
  });
  assert.deepEqual(result.failures,[]);console.log(engine,JSON.stringify(result));await browser.close();
}})();
