(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"8cDG":function(l,n,e){"use strict";e.r(n);var t=e("8Y7J");class o{}var i=e("pMnS"),u=e("oBZk"),r=e("ZZ/e"),a=e("s7LF"),c=e("SVse"),d=e("mrSG"),s=e("UnBL"),g=e("oZWX"),f=e("Iab2");class h{constructor(l,n,e,t,o){this.storage=l,this.alertController=n,this.evManager=e,this.apiService=t,this.loadingController=o,this.options={depth:0},this.toggleCtrl={},this.searchCtrl={},this.scraped=[],this.scrapedDisplay=[],this.evManager.eventManager.on("SourcesLoaded",()=>{this.storage.get("SOURCES").then(l=>{l&&(this.scraped=l,this.scrapedDisplay=this.scraped)})})}ngOnInit(){this.defaultFeatures()}defaultFeatures(){this.storage.get("SOURCES").then(l=>{l&&(this.scraped=l,this.scrapedDisplay=JSON.parse(JSON.stringify(this.scraped)))})}saveData(){return d.__awaiter(this,void 0,void 0,function*(){const l=yield this.loadingController.create(this.generateLoadingOptions());yield l.present(),this.scrapePDF([],n=>d.__awaiter(this,void 0,void 0,function*(){yield l.dismiss(),this.alertDownload()}))})}scrapePDF(l,n){return d.__awaiter(this,void 0,void 0,function*(){let e,t;for(let n=0;n<this.scraped.length;n++)for(let o=0;o<this.scraped[n].links.length;o++)this.scraped[n].links[o].isDownloadable&&([e,t]=yield this.to(this.downloadLinkFromUrl(this.scraped[n].links[o].uri)),e?l.push({status:"failure",data:e}):t&&l.push({status:"success",data:t}));n(l)})}generateLoadingOptions(){return{spinner:null,message:"Descargando...",translucent:!0,cssClass:"custom-class custom-loading"}}downloadLinkFromUrl(l){return new Promise((n,e)=>{setTimeout(()=>{this.apiService.request(l.replace(/[?]/g,"$")).subscribe(e=>{Object(f.saveAs)(e,this.createNameForFile(l)),n(l)},l=>{console.log("error found",l),e(l)})},200)})}createNameForFile(l){let n,e=l.substring(0,l.indexOf(".co"));return(e=e.substring(e.indexOf(".")+1))+"_"+(-1!=l.indexOf(".pdf")?(n=l.substring(l.indexOf("/"),l.lastIndexOf(".pdf")+4)).substring(n.lastIndexOf("/")+1):-1!=(n=l.substring(l.lastIndexOf("/")+1)).indexOf("?")?n.substring(0,n.indexOf("?")+1)+".pdf":n+".pdf")}setFilteredItems(l){this.scrapedDisplay[this.scrapedDisplay.findIndex(n=>n.url==l)].links=""!=this.searchCtrl[l]&&null!=this.searchCtrl[l]&&null!=this.searchCtrl[l]?this.filterItems(this.searchCtrl[l],l):this.scraped[this.scraped.findIndex(n=>n.url==l)].links}filterItems(l,n){let e=JSON.parse(JSON.stringify(this.scraped));return e[e.findIndex(l=>l.url==n)].links.filter(n=>n.uri.toLowerCase().indexOf(l.toLowerCase())>-1)}alertDownload(){return d.__awaiter(this,void 0,void 0,function*(){const l=yield this.alertController.create({header:"Listo!",subHeader:"Se han descargado todos los pdfs seleccionados",message:"Por favor revise su carpeta de descargas",buttons:["OK"]});yield l.present()})}getFeatures(){return JSON.stringify(this.options,null,4)}getScraped(){return JSON.stringify(this.scraped)}unCheckAllForScraped(l){for(let n=0;n<this.scraped.length;n++)this.scraped[n].url==l&&this.toggleSelector(this.scraped[n].links,!1);this.scrapedDisplay=JSON.parse(JSON.stringify(this.scraped))}toggleSelector(l,n){l.forEach(l=>{l.isDownloadable=n})}checkAllForScraped(l){for(let n=0;n<this.scraped.length;n++)this.scraped[n].url==l&&this.toggleSelector(this.scraped[n].links,!0);this.scrapedDisplay=JSON.parse(JSON.stringify(this.scraped))}deleteItem(l){this.scraped=this.scraped.filter(function(n){return n.url!==l}),this.scrapedDisplay=JSON.parse(JSON.stringify(this.scraped))}RemoveAll(){this.scraped=[],this.scrapedDisplay=JSON.parse(JSON.stringify(this.scraped)),this.evManager.eventManager.emit("DeletedSources")}orderLinks(l,n){return l.filter(l=>l.isDownloadable==n)}updateScraped(l,n){let e=this.scraped.findIndex(l=>l.url==n),t=this.scraped[e].links.findIndex(n=>n.uri==l.uri);this.scraped[e].links[t].isDownloadable=l.isDownloadable}countSelectedLinks(l){let n=0;return this.scraped[this.scraped.findIndex(n=>n.url==l)].links.forEach(l=>{l.isDownloadable&&(n+=1)}),n}countAllSelected(){let l=0;return this.scraped.forEach(n=>{n.links.forEach(n=>{n.isDownloadable&&(l+=1)})}),l}getSmollName(l){let n=3;for(;null==l[n]&&n>-1;)n-=1;return l[n]}presentAlertConfirm(){return d.__awaiter(this,void 0,void 0,function*(){const l=yield this.alertController.create({header:"Alto!",message:"\xbfEst\xe1 seguro de haber configurado correctamente su carpeta de descargas?",buttons:[{text:"Cancelar",role:"cancel",cssClass:"secondary",handler:()=>{}},{text:"De acuerdo",handler:()=>{this.saveData()}}]});yield l.present()})}getSmallName(l){return-1!=this.nth_occurrence(l,"/",3)?l.substring(this.nth_occurrence(l,"/",3),l.length):l.substring(this.nth_occurrence(l,"/",1),l.length)}nth_occurrence(l,n,e){var t=l.indexOf(n),o=t+1;if(1==e)return t;var i=l.slice(o),u=this.nth_occurrence(i,n,e-1);return-1===u?-1:o+u}to(l){return l.then(l=>[null,l]).catch(l=>[l])}}var p=e("xgBC"),m=t["\u0275crt"]({encapsulation:0,styles:[[".iconSel[_ngcontent-%COMP%]{width:25px;height:25px}.title[_ngcontent-%COMP%]:hover{background:var(--ion-color-light-shade)}.iconSel[_ngcontent-%COMP%]:hover{width:30px;height:30px;color:var(--ion-color-success)}.iconUnSel[_ngcontent-%COMP%]{width:25px;height:25px}.iconUnSel[_ngcontent-%COMP%]:hover{width:30px;height:30px;color:var(--ion-color-danger)}.iconTrSel[_ngcontent-%COMP%]{width:25px;height:25px}.iconTrSel[_ngcontent-%COMP%]:hover{width:30px;height:30px;color:var(--ion-color-warning)}"]],data:{}});function C(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,11,"ion-item",[["class","item"]],null,null,null,u.Y,u.s)),t["\u0275did"](1,49152,null,0,r.G,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](2,0,null,0,2,"ion-label",[["class","content"]],null,null,null,u.Z,u.t)),t["\u0275did"](3,49152,null,0,r.M,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275ted"](4,0,["",""])),(l()(),t["\u0275eld"](5,0,null,0,6,"ion-checkbox",[["class","checkbox"],["slot","end"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionChange"],[null,"ionBlur"]],function(l,n,e){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==t["\u0275nov"](l,7)._handleBlurEvent(e.target)&&o),"ionChange"===n&&(o=!1!==t["\u0275nov"](l,7)._handleIonChange(e.target)&&o),"ngModelChange"===n&&(o=!1!==(l.context.$implicit.isDownloadable=e)&&o),"ionChange"===n&&(o=!1!==i.updateScraped(l.context.$implicit,l.parent.parent.context.$implicit.url)&&o),o},u.Q,u.k)),t["\u0275did"](6,49152,null,0,r.q,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),t["\u0275did"](7,16384,null,0,r.c,[t.ElementRef],null,null),t["\u0275prd"](1024,null,a.b,function(l){return[l]},[r.c]),t["\u0275did"](9,671744,null,0,a.e,[[8,null],[8,null],[8,null],[6,a.b]],{model:[0,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,a.c,null,[a.e]),t["\u0275did"](11,16384,null,0,a.d,[[4,a.c]],null,null)],function(l,n){l(n,9,0,n.context.$implicit.isDownloadable)},function(l,n){l(n,4,0,n.component.getSmallName(n.context.$implicit.uri)),l(n,5,0,t["\u0275nov"](n,11).ngClassUntouched,t["\u0275nov"](n,11).ngClassTouched,t["\u0275nov"](n,11).ngClassPristine,t["\u0275nov"](n,11).ngClassDirty,t["\u0275nov"](n,11).ngClassValid,t["\u0275nov"](n,11).ngClassInvalid,t["\u0275nov"](n,11).ngClassPending)})}function v(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,11,"ion-item",[["class","item"]],null,null,null,u.Y,u.s)),t["\u0275did"](1,49152,null,0,r.G,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](2,0,null,0,2,"ion-label",[["class","content"]],null,null,null,u.Z,u.t)),t["\u0275did"](3,49152,null,0,r.M,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275ted"](4,0,["",""])),(l()(),t["\u0275eld"](5,0,null,0,6,"ion-checkbox",[["class","checkbox"],["slot","end"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionChange"],[null,"ionBlur"]],function(l,n,e){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==t["\u0275nov"](l,7)._handleBlurEvent(e.target)&&o),"ionChange"===n&&(o=!1!==t["\u0275nov"](l,7)._handleIonChange(e.target)&&o),"ngModelChange"===n&&(o=!1!==(l.context.$implicit.isDownloadable=e)&&o),"ionChange"===n&&(o=!1!==i.updateScraped(l.context.$implicit,l.parent.parent.context.$implicit.url)&&o),o},u.Q,u.k)),t["\u0275did"](6,49152,null,0,r.q,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),t["\u0275did"](7,16384,null,0,r.c,[t.ElementRef],null,null),t["\u0275prd"](1024,null,a.b,function(l){return[l]},[r.c]),t["\u0275did"](9,671744,null,0,a.e,[[8,null],[8,null],[8,null],[6,a.b]],{model:[0,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,a.c,null,[a.e]),t["\u0275did"](11,16384,null,0,a.d,[[4,a.c]],null,null)],function(l,n){l(n,9,0,n.context.$implicit.isDownloadable)},function(l,n){l(n,4,0,n.component.getSmallName(n.context.$implicit.uri)),l(n,5,0,t["\u0275nov"](n,11).ngClassUntouched,t["\u0275nov"](n,11).ngClassTouched,t["\u0275nov"](n,11).ngClassPristine,t["\u0275nov"](n,11).ngClassDirty,t["\u0275nov"](n,11).ngClassValid,t["\u0275nov"](n,11).ngClassInvalid,t["\u0275nov"](n,11).ngClassPending)})}function R(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,20,"ion-card-content",[["style","margin-top: 10px"]],null,null,null,u.L,u.g)),t["\u0275did"](1,49152,null,0,r.m,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](2,0,null,0,6,"ion-searchbar",[["showCancelButton","focus"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionChange"],[null,"ionBlur"]],function(l,n,e){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==t["\u0275nov"](l,4)._handleBlurEvent(e.target)&&o),"ionChange"===n&&(o=!1!==t["\u0275nov"](l,4)._handleInputEvent(e.target)&&o),"ngModelChange"===n&&(o=!1!==(i.searchCtrl[l.parent.context.$implicit.url]=e)&&o),"ionChange"===n&&(o=!1!==i.setFilteredItems(l.parent.context.$implicit.url)&&o),o},u.fb,u.z)),t["\u0275did"](3,49152,null,0,r.ib,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{showCancelButton:[0,"showCancelButton"]},null),t["\u0275did"](4,16384,null,0,r.Jb,[t.ElementRef],null,null),t["\u0275prd"](1024,null,a.b,function(l){return[l]},[r.Jb]),t["\u0275did"](6,671744,null,0,a.e,[[8,null],[8,null],[8,null],[6,a.b]],{model:[0,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,a.c,null,[a.e]),t["\u0275did"](8,16384,null,0,a.d,[[4,a.c]],null,null),(l()(),t["\u0275eld"](9,0,null,0,11,"ion-grid",[],null,null,null,u.T,u.n)),t["\u0275did"](10,49152,null,0,r.z,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](11,0,null,0,9,"ion-row",[],null,null,null,u.eb,u.y)),t["\u0275did"](12,49152,null,0,r.hb,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](13,0,null,0,3,"ion-col",[["size","6"],["style","height: 20vh; overflow-y: scroll;"]],null,null,null,u.R,u.l)),t["\u0275did"](14,49152,null,0,r.s,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{size:[0,"size"]},null),(l()(),t["\u0275and"](16777216,null,0,1,null,C)),t["\u0275did"](16,278528,null,0,c.NgForOf,[t.ViewContainerRef,t.TemplateRef,t.IterableDiffers],{ngForOf:[0,"ngForOf"]},null),(l()(),t["\u0275eld"](17,0,null,0,3,"ion-col",[["size","6"],["style","height: 20vh; overflow-y: scroll;"]],null,null,null,u.R,u.l)),t["\u0275did"](18,49152,null,0,r.s,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{size:[0,"size"]},null),(l()(),t["\u0275and"](16777216,null,0,1,null,v)),t["\u0275did"](20,278528,null,0,c.NgForOf,[t.ViewContainerRef,t.TemplateRef,t.IterableDiffers],{ngForOf:[0,"ngForOf"]},null)],function(l,n){var e=n.component;l(n,3,0,"focus"),l(n,6,0,e.searchCtrl[n.parent.context.$implicit.url]),l(n,14,0,"6"),l(n,16,0,e.orderLinks(n.parent.context.$implicit.links,!1)),l(n,18,0,"6"),l(n,20,0,e.orderLinks(n.parent.context.$implicit.links,!0))},function(l,n){l(n,2,0,t["\u0275nov"](n,8).ngClassUntouched,t["\u0275nov"](n,8).ngClassTouched,t["\u0275nov"](n,8).ngClassPristine,t["\u0275nov"](n,8).ngClassDirty,t["\u0275nov"](n,8).ngClassValid,t["\u0275nov"](n,8).ngClassInvalid,t["\u0275nov"](n,8).ngClassPending)})}function b(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,28,"ion-card",[["class","item-card"]],null,null,null,u.P,u.f)),t["\u0275did"](1,49152,null,0,r.l,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](2,0,null,0,24,"ion-card-header",[],null,null,null,u.M,u.h)),t["\u0275did"](3,49152,null,0,r.n,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](4,0,null,0,22,"ion-item",[],null,null,null,u.Y,u.s)),t["\u0275did"](5,49152,null,0,r.G,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](6,0,null,0,2,"ion-label",[["class","title"]],null,[[null,"click"]],function(l,n,e){var t=!0,o=l.component;return"click"===n&&(t=0!=(o.toggleCtrl[l.context.$implicit.url]=!o.toggleCtrl[l.context.$implicit.url])&&t),t},u.Z,u.t)),t["\u0275did"](7,49152,null,0,r.M,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275ted"](8,0,["",". "," "])),(l()(),t["\u0275eld"](9,0,null,0,2,"ion-badge",[["color","tertiary"],["style","font-size: 15px"]],null,null,null,u.I,u.c)),t["\u0275did"](10,49152,null,0,r.i,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{color:[0,"color"]},null),(l()(),t["\u0275ted"](11,0,["Seleccionados en este item: ",""])),(l()(),t["\u0275eld"](12,0,null,0,14,"ion-buttons",[["slot","end"]],null,null,null,u.K,u.e)),t["\u0275did"](13,49152,null,0,r.k,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](14,0,null,0,6,"ion-toggle",[],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],function(l,n,e){var o=!0,i=l.component;return"ionBlur"===n&&(o=!1!==t["\u0275nov"](l,16)._handleBlurEvent(e.target)&&o),"ionChange"===n&&(o=!1!==t["\u0275nov"](l,16)._handleIonChange(e.target)&&o),"ngModelChange"===n&&(o=!1!==(i.toggleCtrl[l.context.$implicit.url]=e)&&o),o},u.kb,u.E)),t["\u0275did"](15,49152,null,0,r.zb,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),t["\u0275did"](16,16384,null,0,r.c,[t.ElementRef],null,null),t["\u0275prd"](1024,null,a.b,function(l){return[l]},[r.c]),t["\u0275did"](18,671744,null,0,a.e,[[8,null],[8,null],[8,null],[6,a.b]],{model:[0,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,a.c,null,[a.e]),t["\u0275did"](20,16384,null,0,a.d,[[4,a.c]],null,null),(l()(),t["\u0275eld"](21,0,null,0,1,"ion-icon",[["class","iconSel"],["name","checkmark-circle-outline"],["style","margin: 10px;"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.checkAllForScraped(l.context.$implicit.url)&&t),t},u.V,u.p)),t["\u0275did"](22,49152,null,0,r.B,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{name:[0,"name"]},null),(l()(),t["\u0275eld"](23,0,null,0,1,"ion-icon",[["class","iconUnSel"],["name","close-circle-outline"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.unCheckAllForScraped(l.context.$implicit.url)&&t),t},u.V,u.p)),t["\u0275did"](24,49152,null,0,r.B,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{name:[0,"name"]},null),(l()(),t["\u0275eld"](25,0,null,0,1,"ion-icon",[["class","iconTrSel"],["name","trash"],["style","margin-left: 10px;"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.deleteItem(l.context.$implicit.url)&&t),t},u.V,u.p)),t["\u0275did"](26,49152,null,0,r.B,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{name:[0,"name"]},null),(l()(),t["\u0275and"](16777216,null,0,1,null,R)),t["\u0275did"](28,16384,null,0,c.NgIf,[t.ViewContainerRef,t.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(l,n){var e=n.component;l(n,10,0,"tertiary"),l(n,18,0,e.toggleCtrl[n.context.$implicit.url]),l(n,22,0,"checkmark-circle-outline"),l(n,24,0,"close-circle-outline"),l(n,26,0,"trash"),l(n,28,0,e.toggleCtrl[n.context.$implicit.url])},function(l,n){var e=n.component;l(n,8,0,n.context.index+1,n.context.$implicit.url),l(n,11,0,e.countSelectedLinks(n.context.$implicit.url)),l(n,14,0,t["\u0275nov"](n,20).ngClassUntouched,t["\u0275nov"](n,20).ngClassTouched,t["\u0275nov"](n,20).ngClassPristine,t["\u0275nov"](n,20).ngClassDirty,t["\u0275nov"](n,20).ngClassValid,t["\u0275nov"](n,20).ngClassInvalid,t["\u0275nov"](n,20).ngClassPending)})}function D(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,6,"ion-header",[],null,null,null,u.U,u.o)),t["\u0275did"](1,49152,null,0,r.A,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](2,0,null,0,4,"ion-toolbar",[],null,null,null,u.lb,u.F)),t["\u0275did"](3,49152,null,0,r.Ab,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](4,0,null,0,2,"ion-title",[["class","ion-text-center"]],null,null,null,u.jb,u.D)),t["\u0275did"](5,49152,null,0,r.yb,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275ted"](-1,0,[" Descarga de links encontrados "])),(l()(),t["\u0275eld"](7,0,null,null,50,"ion-content",[],null,null,null,u.S,u.m)),t["\u0275did"](8,49152,null,0,r.t,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](9,0,null,0,33,"ion-card",[["class","welcome-card"]],null,null,null,u.P,u.f)),t["\u0275did"](10,49152,null,0,r.l,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](11,0,null,0,23,"ion-card-header",[],null,null,null,u.M,u.h)),t["\u0275did"](12,49152,null,0,r.n,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](13,0,null,0,21,"ion-grid",[],null,null,null,u.T,u.n)),t["\u0275did"](14,49152,null,0,r.z,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](15,0,null,0,19,"ion-row",[],null,null,null,u.eb,u.y)),t["\u0275did"](16,49152,null,0,r.hb,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](17,0,null,0,7,"ion-col",[["size","6"]],null,null,null,u.R,u.l)),t["\u0275did"](18,49152,null,0,r.s,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{size:[0,"size"]},null),(l()(),t["\u0275eld"](19,0,null,0,2,"ion-card-title",[],null,null,null,u.O,u.j)),t["\u0275did"](20,49152,null,0,r.p,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275ted"](-1,0,["Seleccione los archivos a descargar"])),(l()(),t["\u0275eld"](22,0,null,0,2,"ion-card-subtitle",[],null,null,null,u.N,u.i)),t["\u0275did"](23,49152,null,0,r.o,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275ted"](-1,0,["Por favor no olvide configurar su carpeta de descargas."])),(l()(),t["\u0275eld"](25,0,null,0,9,"ion-col",[["offset","2"],["size","3"]],null,null,null,u.R,u.l)),t["\u0275did"](26,49152,null,0,r.s,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{offset:[0,"offset"],size:[1,"size"]},null),(l()(),t["\u0275eld"](27,0,null,0,7,"ion-item",[],null,null,null,u.Y,u.s)),t["\u0275did"](28,49152,null,0,r.G,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](29,0,null,0,2,"ion-label",[],null,null,null,u.Z,u.t)),t["\u0275did"](30,49152,null,0,r.M,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275ted"](-1,0,["Total seleccionados:"])),(l()(),t["\u0275eld"](32,0,null,0,2,"ion-badge",[["color","success"],["style","font-size: 20px"]],null,null,null,u.I,u.c)),t["\u0275did"](33,49152,null,0,r.i,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{color:[0,"color"]},null),(l()(),t["\u0275ted"](34,0,["",""])),(l()(),t["\u0275eld"](35,0,null,0,7,"ion-card-content",[],null,null,null,u.L,u.g)),t["\u0275did"](36,49152,null,0,r.m,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](37,0,null,0,5,"ion-card",[["class","scrollable-div"]],null,null,null,u.P,u.f)),t["\u0275did"](38,49152,null,0,r.l,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](39,0,null,0,3,"ion-card-content",[],null,null,null,u.L,u.g)),t["\u0275did"](40,49152,null,0,r.m,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275and"](16777216,null,0,1,null,b)),t["\u0275did"](42,278528,null,0,c.NgForOf,[t.ViewContainerRef,t.TemplateRef,t.IterableDiffers],{ngForOf:[0,"ngForOf"]},null),(l()(),t["\u0275eld"](43,0,null,0,13,"ion-grid",[],null,null,null,u.T,u.n)),t["\u0275did"](44,49152,null,0,r.z,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](45,0,null,0,11,"ion-row",[],null,null,null,u.eb,u.y)),t["\u0275did"](46,49152,null,0,r.hb,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],null,null),(l()(),t["\u0275eld"](47,0,null,0,4,"ion-col",[["offset","3"],["size","3"]],null,null,null,u.R,u.l)),t["\u0275did"](48,49152,null,0,r.s,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{offset:[0,"offset"],size:[1,"size"]},null),(l()(),t["\u0275eld"](49,0,null,0,2,"ion-button",[["expand","block"],["shape","round"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.presentAlertConfirm()&&t),t},u.J,u.d)),t["\u0275did"](50,49152,null,0,r.j,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{expand:[0,"expand"],shape:[1,"shape"]},null),(l()(),t["\u0275ted"](-1,0,["Guardar"])),(l()(),t["\u0275eld"](52,0,null,0,4,"ion-col",[["size","3"]],null,null,null,u.R,u.l)),t["\u0275did"](53,49152,null,0,r.s,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{size:[0,"size"]},null),(l()(),t["\u0275eld"](54,0,null,0,2,"ion-button",[["expand","block"],["shape","round"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.RemoveAll()&&t),t},u.J,u.d)),t["\u0275did"](55,49152,null,0,r.j,[t.ChangeDetectorRef,t.ElementRef,t.NgZone],{expand:[0,"expand"],shape:[1,"shape"]},null),(l()(),t["\u0275ted"](-1,0,["Clear All"])),(l()(),t["\u0275eld"](57,0,null,0,0,"iframe",[["id","my_iframe"],["style","display:none;"]],null,null,null,null,null))],function(l,n){var e=n.component;l(n,18,0,"6"),l(n,26,0,"2","3"),l(n,33,0,"success"),l(n,42,0,e.scrapedDisplay),l(n,48,0,"3","3"),l(n,50,0,"block","round"),l(n,53,0,"3"),l(n,55,0,"block","round")},function(l,n){l(n,34,0,n.component.countAllSelected())})}function x(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,1,"app-tab2",[],null,null,null,D,m)),t["\u0275did"](1,114688,null,0,h,[p.b,r.a,s.a,g.a,r.Eb],null,null)],function(l,n){l(n,1,0)},null)}var y=t["\u0275ccf"]("app-tab2",h,x,{},{},[]),w=e("iInd");e.d(n,"Tab2PageModuleNgFactory",function(){return E});var E=t["\u0275cmf"](o,[],function(l){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[i.a,y]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,c.NgLocalization,c.NgLocaleLocalization,[t.LOCALE_ID,[2,c["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,r.b,r.b,[t.NgZone,t.ApplicationRef]),t["\u0275mpd"](4608,r.Fb,r.Fb,[r.b,t.ComponentFactoryResolver,t.Injector]),t["\u0275mpd"](4608,r.Ib,r.Ib,[r.b,t.ComponentFactoryResolver,t.Injector]),t["\u0275mpd"](4608,a.g,a.g,[]),t["\u0275mpd"](1073742336,c.CommonModule,c.CommonModule,[]),t["\u0275mpd"](1073742336,r.Cb,r.Cb,[]),t["\u0275mpd"](1073742336,a.f,a.f,[]),t["\u0275mpd"](1073742336,a.a,a.a,[]),t["\u0275mpd"](1073742336,w.n,w.n,[[2,w.s],[2,w.m]]),t["\u0275mpd"](1073742336,o,o,[]),t["\u0275mpd"](1024,w.k,function(){return[[{path:"",component:h}]]},[])])})},Iab2:function(l,n,e){var t,o;void 0===(o="function"==typeof(t=function(){"use strict";function n(l,n,e){var t=new XMLHttpRequest;t.open("GET",l),t.responseType="blob",t.onload=function(){i(t.response,n,e)},t.onerror=function(){console.error("could not download file")},t.send()}function e(l){var n=new XMLHttpRequest;n.open("HEAD",l,!1);try{n.send()}catch(l){}return 200<=n.status&&299>=n.status}function t(l){try{l.dispatchEvent(new MouseEvent("click"))}catch(n){var e=document.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),l.dispatchEvent(e)}}var o="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,i=o.saveAs||("object"!=typeof window||window!==o?function(){}:"download"in HTMLAnchorElement.prototype?function(l,i,u){var r=o.URL||o.webkitURL,a=document.createElement("a");a.download=i=i||l.name||"download",a.rel="noopener","string"==typeof l?(a.href=l,a.origin===location.origin?t(a):e(a.href)?n(l,i,u):t(a,a.target="_blank")):(a.href=r.createObjectURL(l),setTimeout(function(){r.revokeObjectURL(a.href)},4e4),setTimeout(function(){t(a)},0))}:"msSaveOrOpenBlob"in navigator?function(l,o,i){if(o=o||l.name||"download","string"!=typeof l)navigator.msSaveOrOpenBlob(function(l,n){return void 0===n?n={autoBom:!1}:"object"!=typeof n&&(console.warn("Deprecated: Expected third argument to be a object"),n={autoBom:!n}),n.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(l.type)?new Blob(["\ufeff",l],{type:l.type}):l}(l,i),o);else if(e(l))n(l,o,i);else{var u=document.createElement("a");u.href=l,u.target="_blank",setTimeout(function(){t(u)})}}:function(l,e,t,i){if((i=i||open("","_blank"))&&(i.document.title=i.document.body.innerText="downloading..."),"string"==typeof l)return n(l,e,t);var u="application/octet-stream"===l.type,r=/constructor/i.test(o.HTMLElement)||o.safari,a=/CriOS\/[\d]+/.test(navigator.userAgent);if((a||u&&r)&&"object"==typeof FileReader){var c=new FileReader;c.onloadend=function(){var l=c.result;l=a?l:l.replace(/^data:[^;]*;/,"data:attachment/file;"),i?i.location.href=l:location=l,i=null},c.readAsDataURL(l)}else{var d=o.URL||o.webkitURL,s=d.createObjectURL(l);i?i.location=s:location.href=s,i=null,setTimeout(function(){d.revokeObjectURL(s)},4e4)}});o.saveAs=i.saveAs=i,l.exports=i})?t.apply(n,[]):t)||(l.exports=o)}}]);