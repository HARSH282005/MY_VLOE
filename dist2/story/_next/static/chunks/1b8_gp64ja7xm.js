(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,96497,e=>{"use strict";var t=e.i(68921),n=e.i(10849);e.s(["default",0,function(){let e=(0,n.useRef)(null);return(0,n.useEffect)(()=>{let t=e.current;if(!t)return;let n=[];for(let e=0;e<18;e++){let e=document.createElement("div"),a=8+16*Math.random(),i=100*Math.random(),r=12*Math.random(),o=8+10*Math.random(),l=20+40*Math.random();e.style.cssText=`
        position: fixed;
        left: ${i}vw;
        top: -30px;
        width: ${a}px;
        height: ${1.2*a}px;
        background: radial-gradient(ellipse at 30% 30%, #f0d6da, #c4637a88);
        border-radius: 50% 0 50% 0;
        transform-origin: center;
        animation: petalFall ${o}s ${r}s linear infinite,
                   petalSway ${.4*o}s ${r}s ease-in-out infinite alternate;
        pointer-events: none;
        z-index: 9990;
        opacity: 0.7;
      `,t.appendChild(e),n.push({el:e,x:i,speed:o,delay:r,size:a,sway:l})}return()=>{n.forEach(e=>e.el.remove())}},[]),(0,t.jsx)("div",{ref:e,className:"petal-container","aria-hidden":"true"})}])},57260,function(e){e.n(e.i(96497))}]);