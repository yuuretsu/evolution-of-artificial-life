if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const c=e=>n(e,t),f={module:{uri:t},exports:o,require:c};i[t]=Promise.all(s.map((e=>f[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-2c3633c1.css",revision:null},{url:"assets/index-c3ab54f9.js",revision:null},{url:"index.html",revision:"55348b081553f61243b66f3673361778"},{url:"registerSW.js",revision:"fe2742e6e6aebe004fa04b8ce8cee6b1"},{url:"512x512@2x.png",revision:"6737ae75b37ad12212362127e11acb5e"},{url:"icon.png",revision:"3b886e6fbffaedd141f09d6fd67a01c1"},{url:"manifest.webmanifest",revision:"bd532c3d66dcb7efacfd2225637c07e0"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
