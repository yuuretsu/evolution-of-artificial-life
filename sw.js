if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const f=e=>n(e,t),c={module:{uri:t},exports:o,require:f};i[t]=Promise.all(r.map((e=>c[e]||f(e)))).then((e=>(s(...e),o)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-b334b20f.js",revision:null},{url:"index.html",revision:"8cdf696552f4b15c89001d9bf84f88e8"},{url:"registerSW.js",revision:"fe2742e6e6aebe004fa04b8ce8cee6b1"},{url:"512x512@2x.png",revision:"6737ae75b37ad12212362127e11acb5e"},{url:"icon.png",revision:"3b886e6fbffaedd141f09d6fd67a01c1"},{url:"manifest.webmanifest",revision:"bd532c3d66dcb7efacfd2225637c07e0"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
