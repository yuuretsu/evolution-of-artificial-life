if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const d=e=>n(e,t),f={module:{uri:t},exports:o,require:d};i[t]=Promise.all(r.map((e=>f[e]||d(e)))).then((e=>(s(...e),o)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-6b312d81.js",revision:null},{url:"index.html",revision:"efed57d048751b00359d2d4b406709be"},{url:"registerSW.js",revision:"fe2742e6e6aebe004fa04b8ce8cee6b1"},{url:"512x512@2x.png",revision:"6737ae75b37ad12212362127e11acb5e"},{url:"icon.png",revision:"3b886e6fbffaedd141f09d6fd67a01c1"},{url:"manifest.webmanifest",revision:"bd532c3d66dcb7efacfd2225637c07e0"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
