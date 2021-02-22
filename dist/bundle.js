(()=>{"use strict";function t(t,e){return Math.random()*(e-t)+t}function e(e,n){return Math.floor(t(e,n))}function n(t){return t[e(0,t.length)]}function o(t,e,n){return n>=t?n%e:e- -n%e}function r(t,e,n){return(n-t)/(e-t)}function i(t,e,n){return Math.max(Math.min(n,e),t)}function a(t,e,n){return t+(e-t)*n}var c,s=(c=function(t,e){return(c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}c(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),h=function(){function n(t,e,n,o){this.red=t,this.green=e,this.blue=n,this.alpha=o}return n.randRgb=function(){return new n(e(0,256),e(0,256),e(0,256),255)},n.prototype.interpolate=function(t,e){return new n(a(this.red,t.red,e),a(this.green,t.green,e),a(this.blue,t.blue,e),a(this.alpha,t.alpha,e))},n.prototype.normalise=function(){return new n(i(0,255,this.red),i(0,255,this.green),i(0,255,this.blue),i(0,255,this.alpha))},n.prototype.mutateRgb=function(e){return new n(this.red+t(-e,e),this.green+t(-e,e),this.blue+t(-e,e),this.alpha).normalise()},n.prototype.difference=function(t){return(Math.abs(this.red-t.red)+Math.abs(this.green-t.green)+Math.abs(this.blue-t.blue)+Math.abs(this.alpha-t.alpha))/n.MAX_DIF},n.MAX_DIF=1020,n}(),u=function(t,e,n){this.node=n||document.createElement("canvas"),this.node.width=t,this.node.height=e,this.ctx=this.node.getContext("2d")},l=function(t){function e(e,n,o){var r=t.call(this,e,n,o)||this;return r.data=r.ctx.getImageData(0,0,r.node.width,r.node.height),r}return s(e,t),e.prototype.setPixel=function(t,e,n){var o=4*(e*this.data.width+t);this.data.data[o]=n.red,this.data.data[o+1]=n.green,this.data.data[o+2]=n.blue,this.data.data[o+3]=n.alpha},e.prototype.update=function(){return this.ctx.putImageData(this.data,0,0),this},e}(u);const p=function(){function t(t,e){this.width=t,this.height=e,this.cells=[];for(var n=0;n<t;n++)this.cells[n]=[]}return t.prototype.get=function(t,e){return this.cells[t][e]},t.prototype.set=function(t,e,n){this.cells[t][e]=n},t.prototype.remove=function(t,e){delete this.cells[t][e]},t.prototype.swap=function(t,e,n,o){var r=this.get(t,e),i=this.get(n,o);this.set(t,e,i),this.set(n,o,r)},t.prototype.fixCoords=function(t,e){return[o(0,this.width,t),o(0,this.height,e)]},t.prototype.randCoords=function(){return[e(0,this.width),e(0,this.height)]},t.prototype.randEmpty=function(){var t;do{t=this.randCoords()}while(this.get.apply(this,t));return t},t}();var f=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),d=function(t,e,n,o){this.world=t,this.x=e,this.y=n,this.color=o,t.set(e,n,this)},y=function(t){function e(e,n,o,r){var i=t.call(this,e,n,o,r)||this;return e.assign(i),i.alive=!0,i}return f(e,t),e.prototype.onStep=function(){},e.prototype.onDie=function(){},e}(d),g=function(t){function n(e,n,o,r){var i=t.call(this,e,n)||this;return i.width=e,i.height=n,i.img=new u(e*o,n*o,r),i.img.ctx.imageSmoothingEnabled=!1,i.dynamic={a:{},b:{}},i}return f(n,t),n.prototype.set=function(e,n,o){t.prototype.set.call(this,e,n,o),o&&(o.x=e,o.y=n)},n.prototype.drawLayer=function(t){this.img.ctx.drawImage(t,0,0,this.img.node.width,this.img.node.height)},n.prototype.clearImage=function(){this.img.ctx.clearRect(0,0,this.img.node.width,this.img.node.height)},n.prototype.visualize=function(t){for(var e=new l(this.width,this.height),n=0;n<this.width;n++)for(var o=0;o<this.height;o++){var r=t(this.get(n,o),n,o);r&&e.setPixel(n,o,r)}this.drawLayer(e.update().node)},n.prototype.assign=function(t){var n;do{n=e(0,this.width*this.height*1e3)}while(this.dynamic.a[n]);this.dynamic.a[n]=t},n.prototype.init=function(){this.dynamic.b=this.dynamic.a},n.prototype.step=function(){for(var t in this.dynamic.a={},this.dynamic.b){var e=this.dynamic.b[t];e.alive?(e.onStep(),this.assign(e)):(this.set(e.x,e.y,void 0),e.onDie())}this.dynamic.b=this.dynamic.a},n}(p),m=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),v=function(){return(v=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)},b=function(t){function n(o,r,i,a,c,s,h,u){var l=t.call(this,o,r,i,a)||this;return l.energy=c,l.genome=s,l.family=h,l.abilities=u,n.amount++,l._narrow=e(0,8),l.age=0,l}return m(n,t),Object.defineProperty(n.prototype,"narrow",{get:function(){return this._narrow},set:function(t){this._narrow=o(0,8,t)},enumerable:!1,configurable:!0}),n.prototype.narrowToCoords=function(){var t=[[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];return[this.x+t[this.narrow][0],this.y+t[this.narrow][1]]},n.prototype.getForvard=function(){var t,e,n=(t=this.world).fixCoords.apply(t,this.narrowToCoords());return{block:(e=this.world).get.apply(e,n),coords:n}},n.prototype.moveTo=function(t,e){this.world.swap(this.x,this.y,t,e)},n.prototype.multiplyTo=function(t,e){new n(this.world,t,e,this.color.interpolate(new h(255,255,255,255),.25),this.energy/3,this.genome.replication(),this.family.mutateRgb(10),v({},this.abilities)),this.energy/=3},n.prototype.randMove=function(){var t=this.world.fixCoords(this.x+e(-1,2),this.y+e(-1,2));this.moveTo.apply(this,t)},n.prototype.onStep=function(){this.energy<1||this.energy>100||this.age>2e3?this.alive=!1:(this.genome.doAction(this),this.energy-=.1,this.age+=1)},n.prototype.onDie=function(){n.amount--,new k(this)},n.amount=0,n}(y);const w=b;var _,k=function(t){function e(e){return t.call(this,e.world,e.x,e.y,e.color.interpolate(new h(0,0,0,255),.5))||this}return m(e,t),e.prototype.onStep=function(){this.color=this.color.interpolate(new h(10,10,50,255),.001)},e}(y),M=function(){function r(t){this.length=t,this.genes=[],this._pointer=0}return Object.defineProperty(r.prototype,"pointer",{get:function(){return this._pointer},set:function(t){this._pointer=o(0,this.length,t)},enumerable:!1,configurable:!0}),r.prototype.randGene=function(){return{action:n(x),property:Math.random(),branches:[e(0,this.length),e(0,this.length),e(0,this.length),e(0,this.length)]}},r.prototype.mutateGene=function(o){var r=this;return{action:Math.random()>.9?n(x):o.action,property:i(0,1,o.property+t(-.01,.01)),branches:o.branches.map((function(t){return Math.random()>.9?e(0,r.length):t}))}},r.prototype.fillRandom=function(){for(var t=0;t<this.length;t++)this.genes[t]=this.randGene();return this},r.prototype.fillPlant=function(){for(var t=0;t<this.length;t++)this.genes[t]={action:x[e(0,3)],property:Math.random(),branches:[e(0,this.length),e(0,this.length),e(0,this.length),e(0,this.length)]};return this},r.prototype.replication=function(){for(var t=new r(this.length),e=0;e<this.length;e++)t.genes[e]=Math.random()>.995?this.mutateGene(this.genes[e]):this.genes[e];return t},r.prototype.doAction=function(t){for(var e=0;e<20;e++){var n=this.genes[this.pointer],o=n.action(t,n.property,n.branches);if(o.goto?this.pointer=o.goto:this.pointer++,o.completed)return}t.color=t.color.interpolate(new h(100,100,100,255),.1)},r}(),x=[function(t,e,n){return t.energy+=.5*Math.pow(t.abilities.photo,2),t.abilities.photo=Math.min(1,t.abilities.photo+.01),t.abilities.attack=Math.max(0,t.abilities.attack-.01),t.color=t.color.interpolate(new h(0,255,0,255),.01),{completed:!0}},function(t,e,n){return e>.5?t.narrow++:t.narrow--,{completed:!1}},function(t,e,n){var o=t.getForvard();return!o.block&&t.age>2&&t.multiplyTo.apply(t,o.coords),{completed:!0}},function(t,e,n){t.color=t.color.interpolate(new h(0,0,255,255),.005);var o=t.getForvard();if(o.block instanceof b&&o.block.energy<t.energy){var r=(o.block.energy+t.energy)/2;t.energy=r,o.block.energy=r}return{completed:!0}},function(t,e,n){var o=t.getForvard();return o.block instanceof b?o.block.family.difference(t.color)<e?{completed:!1,goto:n[0]}:{completed:!1,goto:n[1]}:o.block instanceof k?{completed:!1,goto:n[2]}:{completed:!1,goto:n[3]}},function(t,e,n){return t.energy/100<e?{completed:!1,goto:n[0]}:{completed:!1,goto:n[1]}},function(t,e,n){var o=t.getForvard();return o.block instanceof k&&(o.block.alive=!1),{completed:!0}},function(t,e,n){var o=t.getForvard();return o.block||t.moveTo.apply(t,o.coords),{completed:!0}},function(t,e,n){t.energy-=.1,t.color=t.color.interpolate(new h(255,0,0,255),.01),t.abilities.attack=Math.min(1,t.abilities.attack+.01),t.abilities.photo=Math.max(0,t.abilities.photo-.01);var o=t.getForvard();if(o.block instanceof b){var r=o.block.energy/3*Math.pow(t.abilities.attack,2);o.block.energy-=r,t.energy+=r}return{completed:!0}}],O=function(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var o=Array(t),r=0;for(e=0;e<n;e++)for(var i=arguments[e],a=0,c=i.length;a<c;a++,r++)o[r]=i[a];return o};function I(){w.amount=0,_=new g(parseInt(document.querySelector("#input-width").value),parseInt(document.querySelector("#input-height").value),parseInt(document.querySelector("#input-pixel").value),document.querySelector("#img"));for(var t=parseInt(document.querySelector("#input-bots").value),e=0;e<Math.min(_.width*_.height,t);e++)(new(w.bind.apply(w,O([void 0,_],_.randEmpty(),[new h(100,100,100,255),100,new M(64).fillRandom(),h.randRgb(),{photo:.5,attack:.5}])))).narrow=0;_.init()}function S(t){return t instanceof d?t.color:null}function j(t){return t instanceof w?new h(0,0,255,255).interpolate(new h(255,255,0,255),t.energy/100):null}function P(t){return t instanceof w?new h(255*r(.5,1,t.abilities.attack),255*r(.5,1,t.abilities.photo),50,255):null}function F(t){return t instanceof w?t.family:null}window.addEventListener("load",(function(){var t,e=document.querySelector("#amount"),n=document.querySelector("#fps"),o=document.querySelector("#view-mode");null===(t=document.querySelector("#btn-start"))||void 0===t||t.addEventListener("click",I),I();var r=0,i=performance.now(),a=0,c=new Array(5).fill(0);setInterval((function(){var t=performance.now();if(a=1e3/(t-i),c.pop(),c.unshift(a),i=t,_.step(),r%1==0)switch(o.value){case"normal":_.clearImage(),_.visualize(S);break;case"energy":_.clearImage(),_.visualize(j);break;case"families":_.clearImage(),_.visualize(F);break;case"abilities":_.clearImage(),_.visualize(P)}e.innerHTML=w.amount.toString(),n.innerHTML=(c.reduce((function(t,e){return t+e}))/c.length).toFixed(1),r++}))}))})();
//# sourceMappingURL=bundle.js.map