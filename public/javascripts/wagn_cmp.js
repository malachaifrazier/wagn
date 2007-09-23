var Prototype={Version:"1.5.1.1",Browser:{IE:!!(window.attachEvent&&!window.opera),Opera:!!window.opera,WebKit:navigator.userAgent.indexOf("AppleWebKit/")>-1,Gecko:navigator.userAgent.indexOf("Gecko")>-1&&navigator.userAgent.indexOf("KHTML")==-1},BrowserFeatures:{XPath:!!document.evaluate,ElementExtensions:!!window.HTMLElement,SpecificElementExtensions:(document.createElement("div").__proto__!==document.createElement("form").__proto__)},ScriptFragment:"<script[^>]*>([\\S\\s]*?)</script>",JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){
},K:function(x){
return x;
}};
var Class={create:function(){
return function(){
this.initialize.apply(this,arguments);
};
}};
var Abstract=new Object();
Object.extend=function(_2,_3){
for(var _4 in _3){
_2[_4]=_3[_4];
}
return _2;
};
Object.extend(Object,{inspect:function(_5){
try{
if(_5===undefined){
return "undefined";
}
if(_5===null){
return "null";
}
return _5.inspect?_5.inspect():_5.toString();
}
catch(e){
if(e instanceof RangeError){
return "...";
}
throw e;
}
},toJSON:function(_6){
var _7=typeof _6;
switch(_7){
case "undefined":
case "function":
case "unknown":
return;
case "boolean":
return _6.toString();
}
if(_6===null){
return "null";
}
if(_6.toJSON){
return _6.toJSON();
}
if(_6.ownerDocument===document){
return;
}
var _8=[];
for(var _9 in _6){
var _a=Object.toJSON(_6[_9]);
if(_a!==undefined){
_8.push(_9.toJSON()+": "+_a);
}
}
return "{"+_8.join(", ")+"}";
},keys:function(_b){
var _c=[];
for(var _d in _b){
_c.push(_d);
}
return _c;
},values:function(_e){
var _f=[];
for(var _10 in _e){
_f.push(_e[_10]);
}
return _f;
},clone:function(_11){
return Object.extend({},_11);
}});
Function.prototype.bind=function(){
var _12=this,_13=$A(arguments),_14=_13.shift();
return function(){
return _12.apply(_14,_13.concat($A(arguments)));
};
};
Function.prototype.bindAsEventListener=function(_15){
var _16=this,_17=$A(arguments),_15=_17.shift();
return function(_18){
return _16.apply(_15,[_18||window.event].concat(_17));
};
};
Object.extend(Number.prototype,{toColorPart:function(){
return this.toPaddedString(2,16);
},succ:function(){
return this+1;
},times:function(_19){
$R(0,this,true).each(_19);
return this;
},toPaddedString:function(_1a,_1b){
var _1c=this.toString(_1b||10);
return "0".times(_1a-_1c.length)+_1c;
},toJSON:function(){
return isFinite(this)?this.toString():"null";
}});
Date.prototype.toJSON=function(){
return "\""+this.getFullYear()+"-"+(this.getMonth()+1).toPaddedString(2)+"-"+this.getDate().toPaddedString(2)+"T"+this.getHours().toPaddedString(2)+":"+this.getMinutes().toPaddedString(2)+":"+this.getSeconds().toPaddedString(2)+"\"";
};
var Try={these:function(){
var _1d;
for(var i=0,_1f=arguments.length;i<_1f;i++){
var _20=arguments[i];
try{
_1d=_20();
break;
}
catch(e){
}
}
return _1d;
}};
var PeriodicalExecuter=Class.create();
PeriodicalExecuter.prototype={initialize:function(_21,_22){
this.callback=_21;
this.frequency=_22;
this.currentlyExecuting=false;
this.registerCallback();
},registerCallback:function(){
this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000);
},stop:function(){
if(!this.timer){
return;
}
clearInterval(this.timer);
this.timer=null;
},onTimerEvent:function(){
if(!this.currentlyExecuting){
try{
this.currentlyExecuting=true;
this.callback(this);
}
finally{
this.currentlyExecuting=false;
}
}
}};
Object.extend(String,{interpret:function(_23){
return _23==null?"":String(_23);
},specialChar:{"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\\":"\\\\"}});
Object.extend(String.prototype,{gsub:function(_24,_25){
var _26="",_27=this,_28;
_25=arguments.callee.prepareReplacement(_25);
while(_27.length>0){
if(_28=_27.match(_24)){
_26+=_27.slice(0,_28.index);
_26+=String.interpret(_25(_28));
_27=_27.slice(_28.index+_28[0].length);
}else{
_26+=_27,_27="";
}
}
return _26;
},sub:function(_29,_2a,_2b){
_2a=this.gsub.prepareReplacement(_2a);
_2b=_2b===undefined?1:_2b;
return this.gsub(_29,function(_2c){
if(--_2b<0){
return _2c[0];
}
return _2a(_2c);
});
},scan:function(_2d,_2e){
this.gsub(_2d,_2e);
return this;
},truncate:function(_2f,_30){
_2f=_2f||30;
_30=_30===undefined?"...":_30;
return this.length>_2f?this.slice(0,_2f-_30.length)+_30:this;
},strip:function(){
return this.replace(/^\s+/,"").replace(/\s+$/,"");
},stripTags:function(){
return this.replace(/<\/?[^>]+>/gi,"");
},stripScripts:function(){
return this.replace(new RegExp(Prototype.ScriptFragment,"img"),"");
},extractScripts:function(){
var _31=new RegExp(Prototype.ScriptFragment,"img");
var _32=new RegExp(Prototype.ScriptFragment,"im");
return (this.match(_31)||[]).map(function(_33){
return (_33.match(_32)||["",""])[1];
});
},evalScripts:function(){
return this.extractScripts().map(function(_34){
return eval(_34);
});
},escapeHTML:function(){
var _35=arguments.callee;
_35.text.data=this;
return _35.div.innerHTML;
},unescapeHTML:function(){
var div=document.createElement("div");
div.innerHTML=this.stripTags();
return div.childNodes[0]?(div.childNodes.length>1?$A(div.childNodes).inject("",function(_37,_38){
return _37+_38.nodeValue;
}):div.childNodes[0].nodeValue):"";
},toQueryParams:function(_39){
var _3a=this.strip().match(/([^?#]*)(#.*)?$/);
if(!_3a){
return {};
}
return _3a[1].split(_39||"&").inject({},function(_3b,_3c){
if((_3c=_3c.split("="))[0]){
var key=decodeURIComponent(_3c.shift());
var _3e=_3c.length>1?_3c.join("="):_3c[0];
if(_3e!=undefined){
_3e=decodeURIComponent(_3e);
}
if(key in _3b){
if(_3b[key].constructor!=Array){
_3b[key]=[_3b[key]];
}
_3b[key].push(_3e);
}else{
_3b[key]=_3e;
}
}
return _3b;
});
},toArray:function(){
return this.split("");
},succ:function(){
return this.slice(0,this.length-1)+String.fromCharCode(this.charCodeAt(this.length-1)+1);
},times:function(_3f){
var _40="";
for(var i=0;i<_3f;i++){
_40+=this;
}
return _40;
},camelize:function(){
var _42=this.split("-"),len=_42.length;
if(len==1){
return _42[0];
}
var _44=this.charAt(0)=="-"?_42[0].charAt(0).toUpperCase()+_42[0].substring(1):_42[0];
for(var i=1;i<len;i++){
_44+=_42[i].charAt(0).toUpperCase()+_42[i].substring(1);
}
return _44;
},capitalize:function(){
return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase();
},underscore:function(){
return this.gsub(/::/,"/").gsub(/([A-Z]+)([A-Z][a-z])/,"#{1}_#{2}").gsub(/([a-z\d])([A-Z])/,"#{1}_#{2}").gsub(/-/,"_").toLowerCase();
},dasherize:function(){
return this.gsub(/_/,"-");
},inspect:function(_46){
var _47=this.gsub(/[\x00-\x1f\\]/,function(_48){
var _49=String.specialChar[_48[0]];
return _49?_49:"\\u00"+_48[0].charCodeAt().toPaddedString(2,16);
});
if(_46){
return "\""+_47.replace(/"/g,"\\\"")+"\"";
}
return "'"+_47.replace(/'/g,"\\'")+"'";
},toJSON:function(){
return this.inspect(true);
},unfilterJSON:function(_4a){
return this.sub(_4a||Prototype.JSONFilter,"#{1}");
},isJSON:function(){
var str=this.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"/g,"");
return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
},evalJSON:function(_4c){
var _4d=this.unfilterJSON();
try{
if(!_4c||_4d.isJSON()){
return eval("("+_4d+")");
}
}
catch(e){
}
throw new SyntaxError("Badly formed JSON string: "+this.inspect());
},include:function(_4e){
return this.indexOf(_4e)>-1;
},startsWith:function(_4f){
return this.indexOf(_4f)===0;
},endsWith:function(_50){
var d=this.length-_50.length;
return d>=0&&this.lastIndexOf(_50)===d;
},empty:function(){
return this=="";
},blank:function(){
return /^\s*$/.test(this);
}});
if(Prototype.Browser.WebKit||Prototype.Browser.IE){
Object.extend(String.prototype,{escapeHTML:function(){
return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
},unescapeHTML:function(){
return this.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");
}});
}
String.prototype.gsub.prepareReplacement=function(_52){
if(typeof _52=="function"){
return _52;
}
var _53=new Template(_52);
return function(_54){
return _53.evaluate(_54);
};
};
String.prototype.parseQuery=String.prototype.toQueryParams;
Object.extend(String.prototype.escapeHTML,{div:document.createElement("div"),text:document.createTextNode("")});
with(String.prototype.escapeHTML){
div.appendChild(text);
}
var Template=Class.create();
Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;
Template.prototype={initialize:function(_55,_56){
this.template=_55.toString();
this.pattern=_56||Template.Pattern;
},evaluate:function(_57){
return this.template.gsub(this.pattern,function(_58){
var _59=_58[1];
if(_59=="\\"){
return _58[2];
}
return _59+String.interpret(_57[_58[3]]);
});
}};
var $break={},$continue=new Error("\"throw $continue\" is deprecated, use \"return\" instead");
var Enumerable={each:function(_5a){
var _5b=0;
try{
this._each(function(_5c){
_5a(_5c,_5b++);
});
}
catch(e){
if(e!=$break){
throw e;
}
}
return this;
},eachSlice:function(_5d,_5e){
var _5f=-_5d,_60=[],_61=this.toArray();
while((_5f+=_5d)<_61.length){
_60.push(_61.slice(_5f,_5f+_5d));
}
return _60.map(_5e);
},all:function(_62){
var _63=true;
this.each(function(_64,_65){
_63=_63&&!!(_62||Prototype.K)(_64,_65);
if(!_63){
throw $break;
}
});
return _63;
},any:function(_66){
var _67=false;
this.each(function(_68,_69){
if(_67=!!(_66||Prototype.K)(_68,_69)){
throw $break;
}
});
return _67;
},collect:function(_6a){
var _6b=[];
this.each(function(_6c,_6d){
_6b.push((_6a||Prototype.K)(_6c,_6d));
});
return _6b;
},detect:function(_6e){
var _6f;
this.each(function(_70,_71){
if(_6e(_70,_71)){
_6f=_70;
throw $break;
}
});
return _6f;
},findAll:function(_72){
var _73=[];
this.each(function(_74,_75){
if(_72(_74,_75)){
_73.push(_74);
}
});
return _73;
},grep:function(_76,_77){
var _78=[];
this.each(function(_79,_7a){
var _7b=_79.toString();
if(_7b.match(_76)){
_78.push((_77||Prototype.K)(_79,_7a));
}
});
return _78;
},include:function(_7c){
var _7d=false;
this.each(function(_7e){
if(_7e==_7c){
_7d=true;
throw $break;
}
});
return _7d;
},inGroupsOf:function(_7f,_80){
_80=_80===undefined?null:_80;
return this.eachSlice(_7f,function(_81){
while(_81.length<_7f){
_81.push(_80);
}
return _81;
});
},inject:function(_82,_83){
this.each(function(_84,_85){
_82=_83(_82,_84,_85);
});
return _82;
},invoke:function(_86){
var _87=$A(arguments).slice(1);
return this.map(function(_88){
return _88[_86].apply(_88,_87);
});
},max:function(_89){
var _8a;
this.each(function(_8b,_8c){
_8b=(_89||Prototype.K)(_8b,_8c);
if(_8a==undefined||_8b>=_8a){
_8a=_8b;
}
});
return _8a;
},min:function(_8d){
var _8e;
this.each(function(_8f,_90){
_8f=(_8d||Prototype.K)(_8f,_90);
if(_8e==undefined||_8f<_8e){
_8e=_8f;
}
});
return _8e;
},partition:function(_91){
var _92=[],_93=[];
this.each(function(_94,_95){
((_91||Prototype.K)(_94,_95)?_92:_93).push(_94);
});
return [_92,_93];
},pluck:function(_96){
var _97=[];
this.each(function(_98,_99){
_97.push(_98[_96]);
});
return _97;
},reject:function(_9a){
var _9b=[];
this.each(function(_9c,_9d){
if(!_9a(_9c,_9d)){
_9b.push(_9c);
}
});
return _9b;
},sortBy:function(_9e){
return this.map(function(_9f,_a0){
return {value:_9f,criteria:_9e(_9f,_a0)};
}).sort(function(_a1,_a2){
var a=_a1.criteria,b=_a2.criteria;
return a<b?-1:a>b?1:0;
}).pluck("value");
},toArray:function(){
return this.map();
},zip:function(){
var _a5=Prototype.K,_a6=$A(arguments);
if(typeof _a6.last()=="function"){
_a5=_a6.pop();
}
var _a7=[this].concat(_a6).map($A);
return this.map(function(_a8,_a9){
return _a5(_a7.pluck(_a9));
});
},size:function(){
return this.toArray().length;
},inspect:function(){
return "#<Enumerable:"+this.toArray().inspect()+">";
}};
Object.extend(Enumerable,{map:Enumerable.collect,find:Enumerable.detect,select:Enumerable.findAll,member:Enumerable.include,entries:Enumerable.toArray});
var $A=Array.from=function(_aa){
if(!_aa){
return [];
}
if(_aa.toArray){
return _aa.toArray();
}else{
var _ab=[];
for(var i=0,_ad=_aa.length;i<_ad;i++){
_ab.push(_aa[i]);
}
return _ab;
}
};
if(Prototype.Browser.WebKit){
$A=Array.from=function(_ae){
if(!_ae){
return [];
}
if(!(typeof _ae=="function"&&_ae=="[object NodeList]")&&_ae.toArray){
return _ae.toArray();
}else{
var _af=[];
for(var i=0,_b1=_ae.length;i<_b1;i++){
_af.push(_ae[i]);
}
return _af;
}
};
}
Object.extend(Array.prototype,Enumerable);
if(!Array.prototype._reverse){
Array.prototype._reverse=Array.prototype.reverse;
}
Object.extend(Array.prototype,{_each:function(_b2){
for(var i=0,_b4=this.length;i<_b4;i++){
_b2(this[i]);
}
},clear:function(){
this.length=0;
return this;
},first:function(){
return this[0];
},last:function(){
return this[this.length-1];
},compact:function(){
return this.select(function(_b5){
return _b5!=null;
});
},flatten:function(){
return this.inject([],function(_b6,_b7){
return _b6.concat(_b7&&_b7.constructor==Array?_b7.flatten():[_b7]);
});
},without:function(){
var _b8=$A(arguments);
return this.select(function(_b9){
return !_b8.include(_b9);
});
},indexOf:function(_ba){
for(var i=0,_bc=this.length;i<_bc;i++){
if(this[i]==_ba){
return i;
}
}
return -1;
},reverse:function(_bd){
return (_bd!==false?this:this.toArray())._reverse();
},reduce:function(){
return this.length>1?this:this[0];
},uniq:function(_be){
return this.inject([],function(_bf,_c0,_c1){
if(0==_c1||(_be?_bf.last()!=_c0:!_bf.include(_c0))){
_bf.push(_c0);
}
return _bf;
});
},clone:function(){
return [].concat(this);
},size:function(){
return this.length;
},inspect:function(){
return "["+this.map(Object.inspect).join(", ")+"]";
},toJSON:function(){
var _c2=[];
this.each(function(_c3){
var _c4=Object.toJSON(_c3);
if(_c4!==undefined){
_c2.push(_c4);
}
});
return "["+_c2.join(", ")+"]";
}});
Array.prototype.toArray=Array.prototype.clone;
function $w(_c5){
_c5=_c5.strip();
return _c5?_c5.split(/\s+/):[];
}
if(Prototype.Browser.Opera){
Array.prototype.concat=function(){
var _c6=[];
for(var i=0,_c8=this.length;i<_c8;i++){
_c6.push(this[i]);
}
for(var i=0,_c8=arguments.length;i<_c8;i++){
if(arguments[i].constructor==Array){
for(var j=0,_ca=arguments[i].length;j<_ca;j++){
_c6.push(arguments[i][j]);
}
}else{
_c6.push(arguments[i]);
}
}
return _c6;
};
}
var Hash=function(_cb){
if(_cb instanceof Hash){
this.merge(_cb);
}else{
Object.extend(this,_cb||{});
}
};
Object.extend(Hash,{toQueryString:function(obj){
var _cd=[];
_cd.add=arguments.callee.addPair;
this.prototype._each.call(obj,function(_ce){
if(!_ce.key){
return;
}
var _cf=_ce.value;
if(_cf&&typeof _cf=="object"){
if(_cf.constructor==Array){
_cf.each(function(_d0){
_cd.add(_ce.key,_d0);
});
}
return;
}
_cd.add(_ce.key,_cf);
});
return _cd.join("&");
},toJSON:function(_d1){
var _d2=[];
this.prototype._each.call(_d1,function(_d3){
var _d4=Object.toJSON(_d3.value);
if(_d4!==undefined){
_d2.push(_d3.key.toJSON()+": "+_d4);
}
});
return "{"+_d2.join(", ")+"}";
}});
Hash.toQueryString.addPair=function(key,_d6,_d7){
key=encodeURIComponent(key);
if(_d6===undefined){
this.push(key);
}else{
this.push(key+"="+(_d6==null?"":encodeURIComponent(_d6)));
}
};
Object.extend(Hash.prototype,Enumerable);
Object.extend(Hash.prototype,{_each:function(_d8){
for(var key in this){
var _da=this[key];
if(_da&&_da==Hash.prototype[key]){
continue;
}
var _db=[key,_da];
_db.key=key;
_db.value=_da;
_d8(_db);
}
},keys:function(){
return this.pluck("key");
},values:function(){
return this.pluck("value");
},merge:function(_dc){
return $H(_dc).inject(this,function(_dd,_de){
_dd[_de.key]=_de.value;
return _dd;
});
},remove:function(){
var _df;
for(var i=0,_e1=arguments.length;i<_e1;i++){
var _e2=this[arguments[i]];
if(_e2!==undefined){
if(_df===undefined){
_df=_e2;
}else{
if(_df.constructor!=Array){
_df=[_df];
}
_df.push(_e2);
}
}
delete this[arguments[i]];
}
return _df;
},toQueryString:function(){
return Hash.toQueryString(this);
},inspect:function(){
return "#<Hash:{"+this.map(function(_e3){
return _e3.map(Object.inspect).join(": ");
}).join(", ")+"}>";
},toJSON:function(){
return Hash.toJSON(this);
}});
function $H(_e4){
if(_e4 instanceof Hash){
return _e4;
}
return new Hash(_e4);
}
if(function(){
var i=0,_e6=function(_e7){
this.key=_e7;
};
_e6.prototype.key="foo";
for(var _e8 in new _e6("bar")){
i++;
}
return i>1;
}()){
Hash.prototype._each=function(_e9){
var _ea=[];
for(var key in this){
var _ec=this[key];
if((_ec&&_ec==Hash.prototype[key])||_ea.include(key)){
continue;
}
_ea.push(key);
var _ed=[key,_ec];
_ed.key=key;
_ed.value=_ec;
_e9(_ed);
}
};
}
ObjectRange=Class.create();
Object.extend(ObjectRange.prototype,Enumerable);
Object.extend(ObjectRange.prototype,{initialize:function(_ee,end,_f0){
this.start=_ee;
this.end=end;
this.exclusive=_f0;
},_each:function(_f1){
var _f2=this.start;
while(this.include(_f2)){
_f1(_f2);
_f2=_f2.succ();
}
},include:function(_f3){
if(_f3<this.start){
return false;
}
if(this.exclusive){
return _f3<this.end;
}
return _f3<=this.end;
}});
var $R=function(_f4,end,_f6){
return new ObjectRange(_f4,end,_f6);
};
var Ajax={getTransport:function(){
return Try.these(function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
})||false;
},activeRequestCount:0};
Ajax.Responders={responders:[],_each:function(_f7){
this.responders._each(_f7);
},register:function(_f8){
if(!this.include(_f8)){
this.responders.push(_f8);
}
},unregister:function(_f9){
this.responders=this.responders.without(_f9);
},dispatch:function(_fa,_fb,_fc,_fd){
this.each(function(_fe){
if(typeof _fe[_fa]=="function"){
try{
_fe[_fa].apply(_fe,[_fb,_fc,_fd]);
}
catch(e){
}
}
});
}};
Object.extend(Ajax.Responders,Enumerable);
Ajax.Responders.register({onCreate:function(){
Ajax.activeRequestCount++;
},onComplete:function(){
Ajax.activeRequestCount--;
}});
Ajax.Base=function(){
};
Ajax.Base.prototype={setOptions:function(_ff){
this.options={method:"post",asynchronous:true,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:""};
Object.extend(this.options,_ff||{});
this.options.method=this.options.method.toLowerCase();
if(typeof this.options.parameters=="string"){
this.options.parameters=this.options.parameters.toQueryParams();
}
}};
Ajax.Request=Class.create();
Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
Ajax.Request.prototype=Object.extend(new Ajax.Base(),{_complete:false,initialize:function(url,_101){
this.transport=Ajax.getTransport();
this.setOptions(_101);
this.request(url);
},request:function(url){
this.url=url;
this.method=this.options.method;
var _103=Object.clone(this.options.parameters);
if(!["get","post"].include(this.method)){
_103["_method"]=this.method;
this.method="post";
}
this.parameters=_103;
if(_103=Hash.toQueryString(_103)){
if(this.method=="get"){
this.url+=(this.url.include("?")?"&":"?")+_103;
}else{
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
_103+="&_=";
}
}
}
try{
if(this.options.onCreate){
this.options.onCreate(this.transport);
}
Ajax.Responders.dispatch("onCreate",this,this.transport);
this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);
if(this.options.asynchronous){
setTimeout(function(){
this.respondToReadyState(1);
}.bind(this),10);
}
this.transport.onreadystatechange=this.onStateChange.bind(this);
this.setRequestHeaders();
this.body=this.method=="post"?(this.options.postBody||_103):null;
this.transport.send(this.body);
if(!this.options.asynchronous&&this.transport.overrideMimeType){
this.onStateChange();
}
}
catch(e){
this.dispatchException(e);
}
},onStateChange:function(){
var _104=this.transport.readyState;
if(_104>1&&!((_104==4)&&this._complete)){
this.respondToReadyState(this.transport.readyState);
}
},setRequestHeaders:function(){
var _105={"X-Requested-With":"XMLHttpRequest","X-Prototype-Version":Prototype.Version,"Accept":"text/javascript, text/html, application/xml, text/xml, */*"};
if(this.method=="post"){
_105["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:"");
if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005){
_105["Connection"]="close";
}
}
if(typeof this.options.requestHeaders=="object"){
var _106=this.options.requestHeaders;
if(typeof _106.push=="function"){
for(var i=0,_108=_106.length;i<_108;i+=2){
_105[_106[i]]=_106[i+1];
}
}else{
$H(_106).each(function(pair){
_105[pair.key]=pair.value;
});
}
}
for(var name in _105){
this.transport.setRequestHeader(name,_105[name]);
}
},success:function(){
return !this.transport.status||(this.transport.status>=200&&this.transport.status<300);
},respondToReadyState:function(_10b){
var _10c=Ajax.Request.Events[_10b];
var _10d=this.transport,json=this.evalJSON();
if(_10c=="Complete"){
try{
this._complete=true;
(this.options["on"+this.transport.status]||this.options["on"+(this.success()?"Success":"Failure")]||Prototype.emptyFunction)(_10d,json);
}
catch(e){
this.dispatchException(e);
}
var _10f=this.getHeader("Content-type");
if(_10f&&_10f.strip().match(/^(text|application)\/(x-)?(java|ecma)script(;.*)?$/i)){
this.evalResponse();
}
}
try{
(this.options["on"+_10c]||Prototype.emptyFunction)(_10d,json);
Ajax.Responders.dispatch("on"+_10c,this,_10d,json);
}
catch(e){
this.dispatchException(e);
}
if(_10c=="Complete"){
this.transport.onreadystatechange=Prototype.emptyFunction;
}
},getHeader:function(name){
try{
return this.transport.getResponseHeader(name);
}
catch(e){
return null;
}
},evalJSON:function(){
try{
var json=this.getHeader("X-JSON");
return json?json.evalJSON():null;
}
catch(e){
return null;
}
},evalResponse:function(){
try{
return eval((this.transport.responseText||"").unfilterJSON());
}
catch(e){
this.dispatchException(e);
}
},dispatchException:function(_112){
(this.options.onException||Prototype.emptyFunction)(this,_112);
Ajax.Responders.dispatch("onException",this,_112);
}});
Ajax.Updater=Class.create();
Object.extend(Object.extend(Ajax.Updater.prototype,Ajax.Request.prototype),{initialize:function(_113,url,_115){
this.container={success:(_113.success||_113),failure:(_113.failure||(_113.success?null:_113))};
this.transport=Ajax.getTransport();
this.setOptions(_115);
var _116=this.options.onComplete||Prototype.emptyFunction;
this.options.onComplete=(function(_117,_118){
this.updateContent();
_116(_117,_118);
}).bind(this);
this.request(url);
},updateContent:function(){
var _119=this.container[this.success()?"success":"failure"];
var _11a=this.transport.responseText;
if(!this.options.evalScripts){
_11a=_11a.stripScripts();
}
if(_119=$(_119)){
if(this.options.insertion){
new this.options.insertion(_119,_11a);
}else{
_119.update(_11a);
}
}
if(this.success()){
if(this.onComplete){
setTimeout(this.onComplete.bind(this),10);
}
}
}});
Ajax.PeriodicalUpdater=Class.create();
Ajax.PeriodicalUpdater.prototype=Object.extend(new Ajax.Base(),{initialize:function(_11b,url,_11d){
this.setOptions(_11d);
this.onComplete=this.options.onComplete;
this.frequency=(this.options.frequency||2);
this.decay=(this.options.decay||1);
this.updater={};
this.container=_11b;
this.url=url;
this.start();
},start:function(){
this.options.onComplete=this.updateComplete.bind(this);
this.onTimerEvent();
},stop:function(){
this.updater.options.onComplete=undefined;
clearTimeout(this.timer);
(this.onComplete||Prototype.emptyFunction).apply(this,arguments);
},updateComplete:function(_11e){
if(this.options.decay){
this.decay=(_11e.responseText==this.lastText?this.decay*this.options.decay:1);
this.lastText=_11e.responseText;
}
this.timer=setTimeout(this.onTimerEvent.bind(this),this.decay*this.frequency*1000);
},onTimerEvent:function(){
this.updater=new Ajax.Updater(this.container,this.url,this.options);
}});
function $(_11f){
if(arguments.length>1){
for(var i=0,_121=[],_122=arguments.length;i<_122;i++){
_121.push($(arguments[i]));
}
return _121;
}
if(typeof _11f=="string"){
_11f=document.getElementById(_11f);
}
return Element.extend(_11f);
}
if(Prototype.BrowserFeatures.XPath){
document._getElementsByXPath=function(_123,_124){
var _125=[];
var _126=document.evaluate(_123,$(_124)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
for(var i=0,_128=_126.snapshotLength;i<_128;i++){
_125.push(_126.snapshotItem(i));
}
return _125;
};
document.getElementsByClassName=function(_129,_12a){
var q=".//*[contains(concat(' ', @class, ' '), ' "+_129+" ')]";
return document._getElementsByXPath(q,_12a);
};
}else{
document.getElementsByClassName=function(_12c,_12d){
var _12e=($(_12d)||document.body).getElementsByTagName("*");
var _12f=[],_130,_131=new RegExp("(^|\\s)"+_12c+"(\\s|$)");
for(var i=0,_133=_12e.length;i<_133;i++){
_130=_12e[i];
var _134=_130.className;
if(_134.length==0){
continue;
}
if(_134==_12c||_134.match(_131)){
_12f.push(Element.extend(_130));
}
}
return _12f;
};
}
if(!window.Element){
var Element={};
}
Element.extend=function(_135){
var F=Prototype.BrowserFeatures;
if(!_135||!_135.tagName||_135.nodeType==3||_135._extended||F.SpecificElementExtensions||_135==window){
return _135;
}
var _137={},_138=_135.tagName,_139=Element.extend.cache,T=Element.Methods.ByTag;
if(!F.ElementExtensions){
Object.extend(_137,Element.Methods),Object.extend(_137,Element.Methods.Simulated);
}
if(T[_138]){
Object.extend(_137,T[_138]);
}
for(var _13b in _137){
var _13c=_137[_13b];
if(typeof _13c=="function"&&!(_13b in _135)){
_135[_13b]=_139.findOrStore(_13c);
}
}
_135._extended=Prototype.emptyFunction;
return _135;
};
Element.extend.cache={findOrStore:function(_13d){
return this[_13d]=this[_13d]||function(){
return _13d.apply(null,[this].concat($A(arguments)));
};
}};
Element.Methods={visible:function(_13e){
return $(_13e).style.display!="none";
},toggle:function(_13f){
_13f=$(_13f);
Element[Element.visible(_13f)?"hide":"show"](_13f);
return _13f;
},hide:function(_140){
$(_140).style.display="none";
return _140;
},show:function(_141){
$(_141).style.display="";
return _141;
},remove:function(_142){
_142=$(_142);
_142.parentNode.removeChild(_142);
return _142;
},update:function(_143,html){
html=typeof html=="undefined"?"":html.toString();
$(_143).innerHTML=html.stripScripts();
setTimeout(function(){
html.evalScripts();
},10);
return _143;
},replace:function(_145,html){
_145=$(_145);
html=typeof html=="undefined"?"":html.toString();
if(_145.outerHTML){
_145.outerHTML=html.stripScripts();
}else{
var _147=_145.ownerDocument.createRange();
_147.selectNodeContents(_145);
_145.parentNode.replaceChild(_147.createContextualFragment(html.stripScripts()),_145);
}
setTimeout(function(){
html.evalScripts();
},10);
return _145;
},inspect:function(_148){
_148=$(_148);
var _149="<"+_148.tagName.toLowerCase();
$H({"id":"id","className":"class"}).each(function(pair){
var _14b=pair.first(),_14c=pair.last();
var _14d=(_148[_14b]||"").toString();
if(_14d){
_149+=" "+_14c+"="+_14d.inspect(true);
}
});
return _149+">";
},recursivelyCollect:function(_14e,_14f){
_14e=$(_14e);
var _150=[];
while(_14e=_14e[_14f]){
if(_14e.nodeType==1){
_150.push(Element.extend(_14e));
}
}
return _150;
},ancestors:function(_151){
return $(_151).recursivelyCollect("parentNode");
},descendants:function(_152){
return $A($(_152).getElementsByTagName("*")).each(Element.extend);
},firstDescendant:function(_153){
_153=$(_153).firstChild;
while(_153&&_153.nodeType!=1){
_153=_153.nextSibling;
}
return $(_153);
},immediateDescendants:function(_154){
if(!(_154=$(_154).firstChild)){
return [];
}
while(_154&&_154.nodeType!=1){
_154=_154.nextSibling;
}
if(_154){
return [_154].concat($(_154).nextSiblings());
}
return [];
},previousSiblings:function(_155){
return $(_155).recursivelyCollect("previousSibling");
},nextSiblings:function(_156){
return $(_156).recursivelyCollect("nextSibling");
},siblings:function(_157){
_157=$(_157);
return _157.previousSiblings().reverse().concat(_157.nextSiblings());
},match:function(_158,_159){
if(typeof _159=="string"){
_159=new Selector(_159);
}
return _159.match($(_158));
},up:function(_15a,_15b,_15c){
_15a=$(_15a);
if(arguments.length==1){
return $(_15a.parentNode);
}
var _15d=_15a.ancestors();
return _15b?Selector.findElement(_15d,_15b,_15c):_15d[_15c||0];
},down:function(_15e,_15f,_160){
_15e=$(_15e);
if(arguments.length==1){
return _15e.firstDescendant();
}
var _161=_15e.descendants();
return _15f?Selector.findElement(_161,_15f,_160):_161[_160||0];
},previous:function(_162,_163,_164){
_162=$(_162);
if(arguments.length==1){
return $(Selector.handlers.previousElementSibling(_162));
}
var _165=_162.previousSiblings();
return _163?Selector.findElement(_165,_163,_164):_165[_164||0];
},next:function(_166,_167,_168){
_166=$(_166);
if(arguments.length==1){
return $(Selector.handlers.nextElementSibling(_166));
}
var _169=_166.nextSiblings();
return _167?Selector.findElement(_169,_167,_168):_169[_168||0];
},getElementsBySelector:function(){
var args=$A(arguments),_16b=$(args.shift());
return Selector.findChildElements(_16b,args);
},getElementsByClassName:function(_16c,_16d){
return document.getElementsByClassName(_16d,_16c);
},readAttribute:function(_16e,name){
_16e=$(_16e);
if(Prototype.Browser.IE){
if(!_16e.attributes){
return null;
}
var t=Element._attributeTranslations;
if(t.values[name]){
return t.values[name](_16e,name);
}
if(t.names[name]){
name=t.names[name];
}
var _171=_16e.attributes[name];
return _171?_171.nodeValue:null;
}
return _16e.getAttribute(name);
},getHeight:function(_172){
return $(_172).getDimensions().height;
},getWidth:function(_173){
return $(_173).getDimensions().width;
},classNames:function(_174){
return new Element.ClassNames(_174);
},hasClassName:function(_175,_176){
if(!(_175=$(_175))){
return;
}
var _177=_175.className;
if(_177.length==0){
return false;
}
if(_177==_176||_177.match(new RegExp("(^|\\s)"+_176+"(\\s|$)"))){
return true;
}
return false;
},addClassName:function(_178,_179){
if(!(_178=$(_178))){
return;
}
Element.classNames(_178).add(_179);
return _178;
},removeClassName:function(_17a,_17b){
if(!(_17a=$(_17a))){
return;
}
Element.classNames(_17a).remove(_17b);
return _17a;
},toggleClassName:function(_17c,_17d){
if(!(_17c=$(_17c))){
return;
}
Element.classNames(_17c)[_17c.hasClassName(_17d)?"remove":"add"](_17d);
return _17c;
},observe:function(){
Event.observe.apply(Event,arguments);
return $A(arguments).first();
},stopObserving:function(){
Event.stopObserving.apply(Event,arguments);
return $A(arguments).first();
},cleanWhitespace:function(_17e){
_17e=$(_17e);
var node=_17e.firstChild;
while(node){
var _180=node.nextSibling;
if(node.nodeType==3&&!/\S/.test(node.nodeValue)){
_17e.removeChild(node);
}
node=_180;
}
return _17e;
},empty:function(_181){
return $(_181).innerHTML.blank();
},descendantOf:function(_182,_183){
_182=$(_182),_183=$(_183);
while(_182=_182.parentNode){
if(_182==_183){
return true;
}
}
return false;
},scrollTo:function(_184){
_184=$(_184);
var pos=Position.cumulativeOffset(_184);
window.scrollTo(pos[0],pos[1]);
return _184;
},getStyle:function(_186,_187){
_186=$(_186);
_187=_187=="float"?"cssFloat":_187.camelize();
var _188=_186.style[_187];
if(!_188){
var css=document.defaultView.getComputedStyle(_186,null);
_188=css?css[_187]:null;
}
if(_187=="opacity"){
return _188?parseFloat(_188):1;
}
return _188=="auto"?null:_188;
},getOpacity:function(_18a){
return $(_18a).getStyle("opacity");
},setStyle:function(_18b,_18c,_18d){
_18b=$(_18b);
var _18e=_18b.style;
for(var _18f in _18c){
if(_18f=="opacity"){
_18b.setOpacity(_18c[_18f]);
}else{
_18e[(_18f=="float"||_18f=="cssFloat")?(_18e.styleFloat===undefined?"cssFloat":"styleFloat"):(_18d?_18f:_18f.camelize())]=_18c[_18f];
}
}
return _18b;
},setOpacity:function(_190,_191){
_190=$(_190);
_190.style.opacity=(_191==1||_191==="")?"":(_191<0.00001)?0:_191;
return _190;
},getDimensions:function(_192){
_192=$(_192);
var _193=$(_192).getStyle("display");
if(_193!="none"&&_193!=null){
return {width:_192.offsetWidth,height:_192.offsetHeight};
}
var els=_192.style;
var _195=els.visibility;
var _196=els.position;
var _197=els.display;
els.visibility="hidden";
els.position="absolute";
els.display="block";
var _198=_192.clientWidth;
var _199=_192.clientHeight;
els.display=_197;
els.position=_196;
els.visibility=_195;
return {width:_198,height:_199};
},makePositioned:function(_19a){
_19a=$(_19a);
var pos=Element.getStyle(_19a,"position");
if(pos=="static"||!pos){
_19a._madePositioned=true;
_19a.style.position="relative";
if(window.opera){
_19a.style.top=0;
_19a.style.left=0;
}
}
return _19a;
},undoPositioned:function(_19c){
_19c=$(_19c);
if(_19c._madePositioned){
_19c._madePositioned=undefined;
_19c.style.position=_19c.style.top=_19c.style.left=_19c.style.bottom=_19c.style.right="";
}
return _19c;
},makeClipping:function(_19d){
_19d=$(_19d);
if(_19d._overflow){
return _19d;
}
_19d._overflow=_19d.style.overflow||"auto";
if((Element.getStyle(_19d,"overflow")||"visible")!="hidden"){
_19d.style.overflow="hidden";
}
return _19d;
},undoClipping:function(_19e){
_19e=$(_19e);
if(!_19e._overflow){
return _19e;
}
_19e.style.overflow=_19e._overflow=="auto"?"":_19e._overflow;
_19e._overflow=null;
return _19e;
}};
Object.extend(Element.Methods,{childOf:Element.Methods.descendantOf,childElements:Element.Methods.immediateDescendants});
if(Prototype.Browser.Opera){
Element.Methods._getStyle=Element.Methods.getStyle;
Element.Methods.getStyle=function(_19f,_1a0){
switch(_1a0){
case "left":
case "top":
case "right":
case "bottom":
if(Element._getStyle(_19f,"position")=="static"){
return null;
}
default:
return Element._getStyle(_19f,_1a0);
}
};
}else{
if(Prototype.Browser.IE){
Element.Methods.getStyle=function(_1a1,_1a2){
_1a1=$(_1a1);
_1a2=(_1a2=="float"||_1a2=="cssFloat")?"styleFloat":_1a2.camelize();
var _1a3=_1a1.style[_1a2];
if(!_1a3&&_1a1.currentStyle){
_1a3=_1a1.currentStyle[_1a2];
}
if(_1a2=="opacity"){
if(_1a3=(_1a1.getStyle("filter")||"").match(/alpha\(opacity=(.*)\)/)){
if(_1a3[1]){
return parseFloat(_1a3[1])/100;
}
}
return 1;
}
if(_1a3=="auto"){
if((_1a2=="width"||_1a2=="height")&&(_1a1.getStyle("display")!="none")){
return _1a1["offset"+_1a2.capitalize()]+"px";
}
return null;
}
return _1a3;
};
Element.Methods.setOpacity=function(_1a4,_1a5){
_1a4=$(_1a4);
var _1a6=_1a4.getStyle("filter"),_1a7=_1a4.style;
if(_1a5==1||_1a5===""){
_1a7.filter=_1a6.replace(/alpha\([^\)]*\)/gi,"");
return _1a4;
}else{
if(_1a5<0.00001){
_1a5=0;
}
}
_1a7.filter=_1a6.replace(/alpha\([^\)]*\)/gi,"")+"alpha(opacity="+(_1a5*100)+")";
return _1a4;
};
Element.Methods.update=function(_1a8,html){
_1a8=$(_1a8);
html=typeof html=="undefined"?"":html.toString();
var _1aa=_1a8.tagName.toUpperCase();
if(["THEAD","TBODY","TR","TD"].include(_1aa)){
var div=document.createElement("div");
switch(_1aa){
case "THEAD":
case "TBODY":
div.innerHTML="<table><tbody>"+html.stripScripts()+"</tbody></table>";
depth=2;
break;
case "TR":
div.innerHTML="<table><tbody><tr>"+html.stripScripts()+"</tr></tbody></table>";
depth=3;
break;
case "TD":
div.innerHTML="<table><tbody><tr><td>"+html.stripScripts()+"</td></tr></tbody></table>";
depth=4;
}
$A(_1a8.childNodes).each(function(node){
_1a8.removeChild(node);
});
depth.times(function(){
div=div.firstChild;
});
$A(div.childNodes).each(function(node){
_1a8.appendChild(node);
});
}else{
_1a8.innerHTML=html.stripScripts();
}
setTimeout(function(){
html.evalScripts();
},10);
return _1a8;
};
}else{
if(Prototype.Browser.Gecko){
Element.Methods.setOpacity=function(_1ae,_1af){
_1ae=$(_1ae);
_1ae.style.opacity=(_1af==1)?0.999999:(_1af==="")?"":(_1af<0.00001)?0:_1af;
return _1ae;
};
}
}
}
Element._attributeTranslations={names:{colspan:"colSpan",rowspan:"rowSpan",valign:"vAlign",datetime:"dateTime",accesskey:"accessKey",tabindex:"tabIndex",enctype:"encType",maxlength:"maxLength",readonly:"readOnly",longdesc:"longDesc"},values:{_getAttr:function(_1b0,_1b1){
return _1b0.getAttribute(_1b1,2);
},_flag:function(_1b2,_1b3){
return $(_1b2).hasAttribute(_1b3)?_1b3:null;
},style:function(_1b4){
return _1b4.style.cssText.toLowerCase();
},title:function(_1b5){
var node=_1b5.getAttributeNode("title");
return node.specified?node.nodeValue:null;
}}};
(function(){
Object.extend(this,{href:this._getAttr,src:this._getAttr,type:this._getAttr,disabled:this._flag,checked:this._flag,readonly:this._flag,multiple:this._flag});
}).call(Element._attributeTranslations.values);
Element.Methods.Simulated={hasAttribute:function(_1b7,_1b8){
var t=Element._attributeTranslations,node;
_1b8=t.names[_1b8]||_1b8;
node=$(_1b7).getAttributeNode(_1b8);
return node&&node.specified;
}};
Element.Methods.ByTag={};
Object.extend(Element,Element.Methods);
if(!Prototype.BrowserFeatures.ElementExtensions&&document.createElement("div").__proto__){
window.HTMLElement={};
window.HTMLElement.prototype=document.createElement("div").__proto__;
Prototype.BrowserFeatures.ElementExtensions=true;
}
Element.hasAttribute=function(_1bb,_1bc){
if(_1bb.hasAttribute){
return _1bb.hasAttribute(_1bc);
}
return Element.Methods.Simulated.hasAttribute(_1bb,_1bc);
};
Element.addMethods=function(_1bd){
var F=Prototype.BrowserFeatures,T=Element.Methods.ByTag;
if(!_1bd){
Object.extend(Form,Form.Methods);
Object.extend(Form.Element,Form.Element.Methods);
Object.extend(Element.Methods.ByTag,{"FORM":Object.clone(Form.Methods),"INPUT":Object.clone(Form.Element.Methods),"SELECT":Object.clone(Form.Element.Methods),"TEXTAREA":Object.clone(Form.Element.Methods)});
}
if(arguments.length==2){
var _1c0=_1bd;
_1bd=arguments[1];
}
if(!_1c0){
Object.extend(Element.Methods,_1bd||{});
}else{
if(_1c0.constructor==Array){
_1c0.each(extend);
}else{
extend(_1c0);
}
}
function extend(_1c1){
_1c1=_1c1.toUpperCase();
if(!Element.Methods.ByTag[_1c1]){
Element.Methods.ByTag[_1c1]={};
}
Object.extend(Element.Methods.ByTag[_1c1],_1bd);
}
function copy(_1c2,_1c3,_1c4){
_1c4=_1c4||false;
var _1c5=Element.extend.cache;
for(var _1c6 in _1c2){
var _1c7=_1c2[_1c6];
if(!_1c4||!(_1c6 in _1c3)){
_1c3[_1c6]=_1c5.findOrStore(_1c7);
}
}
}
function findDOMClass(_1c8){
var _1c9;
var _1ca={"OPTGROUP":"OptGroup","TEXTAREA":"TextArea","P":"Paragraph","FIELDSET":"FieldSet","UL":"UList","OL":"OList","DL":"DList","DIR":"Directory","H1":"Heading","H2":"Heading","H3":"Heading","H4":"Heading","H5":"Heading","H6":"Heading","Q":"Quote","INS":"Mod","DEL":"Mod","A":"Anchor","IMG":"Image","CAPTION":"TableCaption","COL":"TableCol","COLGROUP":"TableCol","THEAD":"TableSection","TFOOT":"TableSection","TBODY":"TableSection","TR":"TableRow","TH":"TableCell","TD":"TableCell","FRAMESET":"FrameSet","IFRAME":"IFrame"};
if(_1ca[_1c8]){
_1c9="HTML"+_1ca[_1c8]+"Element";
}
if(window[_1c9]){
return window[_1c9];
}
_1c9="HTML"+_1c8+"Element";
if(window[_1c9]){
return window[_1c9];
}
_1c9="HTML"+_1c8.capitalize()+"Element";
if(window[_1c9]){
return window[_1c9];
}
window[_1c9]={};
window[_1c9].prototype=document.createElement(_1c8).__proto__;
return window[_1c9];
}
if(F.ElementExtensions){
copy(Element.Methods,HTMLElement.prototype);
copy(Element.Methods.Simulated,HTMLElement.prototype,true);
}
if(F.SpecificElementExtensions){
for(var tag in Element.Methods.ByTag){
var _1cc=findDOMClass(tag);
if(typeof _1cc=="undefined"){
continue;
}
copy(T[tag],_1cc.prototype);
}
}
Object.extend(Element,Element.Methods);
delete Element.ByTag;
};
var Toggle={display:Element.toggle};
Abstract.Insertion=function(_1cd){
this.adjacency=_1cd;
};
Abstract.Insertion.prototype={initialize:function(_1ce,_1cf){
this.element=$(_1ce);
this.content=_1cf.stripScripts();
if(this.adjacency&&this.element.insertAdjacentHTML){
try{
this.element.insertAdjacentHTML(this.adjacency,this.content);
}
catch(e){
var _1d0=this.element.tagName.toUpperCase();
if(["TBODY","TR"].include(_1d0)){
this.insertContent(this.contentFromAnonymousTable());
}else{
throw e;
}
}
}else{
this.range=this.element.ownerDocument.createRange();
if(this.initializeRange){
this.initializeRange();
}
this.insertContent([this.range.createContextualFragment(this.content)]);
}
setTimeout(function(){
_1cf.evalScripts();
},10);
},contentFromAnonymousTable:function(){
var div=document.createElement("div");
div.innerHTML="<table><tbody>"+this.content+"</tbody></table>";
return $A(div.childNodes[0].childNodes[0].childNodes);
}};
var Insertion=new Object();
Insertion.Before=Class.create();
Insertion.Before.prototype=Object.extend(new Abstract.Insertion("beforeBegin"),{initializeRange:function(){
this.range.setStartBefore(this.element);
},insertContent:function(_1d2){
_1d2.each((function(_1d3){
this.element.parentNode.insertBefore(_1d3,this.element);
}).bind(this));
}});
Insertion.Top=Class.create();
Insertion.Top.prototype=Object.extend(new Abstract.Insertion("afterBegin"),{initializeRange:function(){
this.range.selectNodeContents(this.element);
this.range.collapse(true);
},insertContent:function(_1d4){
_1d4.reverse(false).each((function(_1d5){
this.element.insertBefore(_1d5,this.element.firstChild);
}).bind(this));
}});
Insertion.Bottom=Class.create();
Insertion.Bottom.prototype=Object.extend(new Abstract.Insertion("beforeEnd"),{initializeRange:function(){
this.range.selectNodeContents(this.element);
this.range.collapse(this.element);
},insertContent:function(_1d6){
_1d6.each((function(_1d7){
this.element.appendChild(_1d7);
}).bind(this));
}});
Insertion.After=Class.create();
Insertion.After.prototype=Object.extend(new Abstract.Insertion("afterEnd"),{initializeRange:function(){
this.range.setStartAfter(this.element);
},insertContent:function(_1d8){
_1d8.each((function(_1d9){
this.element.parentNode.insertBefore(_1d9,this.element.nextSibling);
}).bind(this));
}});
Element.ClassNames=Class.create();
Element.ClassNames.prototype={initialize:function(_1da){
this.element=$(_1da);
},_each:function(_1db){
this.element.className.split(/\s+/).select(function(name){
return name.length>0;
})._each(_1db);
},set:function(_1dd){
this.element.className=_1dd;
},add:function(_1de){
if(this.include(_1de)){
return;
}
this.set($A(this).concat(_1de).join(" "));
},remove:function(_1df){
if(!this.include(_1df)){
return;
}
this.set($A(this).without(_1df).join(" "));
},toString:function(){
return $A(this).join(" ");
}};
Object.extend(Element.ClassNames.prototype,Enumerable);
var Selector=Class.create();
Selector.prototype={initialize:function(_1e0){
this.expression=_1e0.strip();
this.compileMatcher();
},compileMatcher:function(){
if(Prototype.BrowserFeatures.XPath&&!(/\[[\w-]*?:/).test(this.expression)){
return this.compileXPathMatcher();
}
var e=this.expression,ps=Selector.patterns,h=Selector.handlers,c=Selector.criteria,le,p,m;
if(Selector._cache[e]){
this.matcher=Selector._cache[e];
return;
}
this.matcher=["this.matcher = function(root) {","var r = root, h = Selector.handlers, c = false, n;"];
while(e&&le!=e&&(/\S/).test(e)){
le=e;
for(var i in ps){
p=ps[i];
if(m=e.match(p)){
this.matcher.push(typeof c[i]=="function"?c[i](m):new Template(c[i]).evaluate(m));
e=e.replace(m[0],"");
break;
}
}
}
this.matcher.push("return h.unique(n);\n}");
eval(this.matcher.join("\n"));
Selector._cache[this.expression]=this.matcher;
},compileXPathMatcher:function(){
var e=this.expression,ps=Selector.patterns,x=Selector.xpath,le,m;
if(Selector._cache[e]){
this.xpath=Selector._cache[e];
return;
}
this.matcher=[".//*"];
while(e&&le!=e&&(/\S/).test(e)){
le=e;
for(var i in ps){
if(m=e.match(ps[i])){
this.matcher.push(typeof x[i]=="function"?x[i](m):new Template(x[i]).evaluate(m));
e=e.replace(m[0],"");
break;
}
}
}
this.xpath=this.matcher.join("");
Selector._cache[this.expression]=this.xpath;
},findElements:function(root){
root=root||document;
if(this.xpath){
return document._getElementsByXPath(this.xpath,root);
}
return this.matcher(root);
},match:function(_1f0){
return this.findElements(document).include(_1f0);
},toString:function(){
return this.expression;
},inspect:function(){
return "#<Selector:"+this.expression.inspect()+">";
}};
Object.extend(Selector,{_cache:{},xpath:{descendant:"//*",child:"/*",adjacent:"/following-sibling::*[1]",laterSibling:"/following-sibling::*",tagName:function(m){
if(m[1]=="*"){
return "";
}
return "[local-name()='"+m[1].toLowerCase()+"' or local-name()='"+m[1].toUpperCase()+"']";
},className:"[contains(concat(' ', @class, ' '), ' #{1} ')]",id:"[@id='#{1}']",attrPresence:"[@#{1}]",attr:function(m){
m[3]=m[5]||m[6];
return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
},pseudo:function(m){
var h=Selector.xpath.pseudos[m[1]];
if(!h){
return "";
}
if(typeof h==="function"){
return h(m);
}
return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
},operators:{"=":"[@#{1}='#{3}']","!=":"[@#{1}!='#{3}']","^=":"[starts-with(@#{1}, '#{3}')]","$=":"[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']","*=":"[contains(@#{1}, '#{3}')]","~=":"[contains(concat(' ', @#{1}, ' '), ' #{3} ')]","|=":"[contains(concat('-', @#{1}, '-'), '-#{3}-')]"},pseudos:{"first-child":"[not(preceding-sibling::*)]","last-child":"[not(following-sibling::*)]","only-child":"[not(preceding-sibling::* or following-sibling::*)]","empty":"[count(*) = 0 and (count(text()) = 0 or translate(text(), ' \t\r\n', '') = '')]","checked":"[@checked]","disabled":"[@disabled]","enabled":"[not(@disabled)]","not":function(m){
var e=m[6],p=Selector.patterns,x=Selector.xpath,le,m,v;
var _1fb=[];
while(e&&le!=e&&(/\S/).test(e)){
le=e;
for(var i in p){
if(m=e.match(p[i])){
v=typeof x[i]=="function"?x[i](m):new Template(x[i]).evaluate(m);
_1fb.push("("+v.substring(1,v.length-1)+")");
e=e.replace(m[0],"");
break;
}
}
}
return "[not("+_1fb.join(" and ")+")]";
},"nth-child":function(m){
return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ",m);
},"nth-last-child":function(m){
return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ",m);
},"nth-of-type":function(m){
return Selector.xpath.pseudos.nth("position() ",m);
},"nth-last-of-type":function(m){
return Selector.xpath.pseudos.nth("(last() + 1 - position()) ",m);
},"first-of-type":function(m){
m[6]="1";
return Selector.xpath.pseudos["nth-of-type"](m);
},"last-of-type":function(m){
m[6]="1";
return Selector.xpath.pseudos["nth-last-of-type"](m);
},"only-of-type":function(m){
var p=Selector.xpath.pseudos;
return p["first-of-type"](m)+p["last-of-type"](m);
},nth:function(_205,m){
var mm,_208=m[6],_209;
if(_208=="even"){
_208="2n+0";
}
if(_208=="odd"){
_208="2n+1";
}
if(mm=_208.match(/^(\d+)$/)){
return "["+_205+"= "+mm[1]+"]";
}
if(mm=_208.match(/^(-?\d*)?n(([+-])(\d+))?/)){
if(mm[1]=="-"){
mm[1]=-1;
}
var a=mm[1]?Number(mm[1]):1;
var b=mm[2]?Number(mm[2]):0;
_209="[((#{fragment} - #{b}) mod #{a} = 0) and "+"((#{fragment} - #{b}) div #{a} >= 0)]";
return new Template(_209).evaluate({fragment:_205,a:a,b:b});
}
}}},criteria:{tagName:"n = h.tagName(n, r, \"#{1}\", c);   c = false;",className:"n = h.className(n, r, \"#{1}\", c); c = false;",id:"n = h.id(n, r, \"#{1}\", c);        c = false;",attrPresence:"n = h.attrPresence(n, r, \"#{1}\"); c = false;",attr:function(m){
m[3]=(m[5]||m[6]);
return new Template("n = h.attr(n, r, \"#{1}\", \"#{3}\", \"#{2}\"); c = false;").evaluate(m);
},pseudo:function(m){
if(m[6]){
m[6]=m[6].replace(/"/g,"\\\"");
}
return new Template("n = h.pseudo(n, \"#{1}\", \"#{6}\", r, c); c = false;").evaluate(m);
},descendant:"c = \"descendant\";",child:"c = \"child\";",adjacent:"c = \"adjacent\";",laterSibling:"c = \"laterSibling\";"},patterns:{laterSibling:/^\s*~\s*/,child:/^\s*>\s*/,adjacent:/^\s*\+\s*/,descendant:/^\s/,tagName:/^\s*(\*|[\w\-]+)(\b|$)?/,id:/^#([\w\-\*]+)(\b|$)/,className:/^\.([\w\-\*]+)(\b|$)/,pseudo:/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|\s|(?=:))/,attrPresence:/^\[([\w]+)\]/,attr:/\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\]]*?)\4|([^'"][^\]]*?)))?\]/},handlers:{concat:function(a,b){
for(var i=0,node;node=b[i];i++){
a.push(node);
}
return a;
},mark:function(_212){
for(var i=0,node;node=_212[i];i++){
node._counted=true;
}
return _212;
},unmark:function(_215){
for(var i=0,node;node=_215[i];i++){
node._counted=undefined;
}
return _215;
},index:function(_218,_219,_21a){
_218._counted=true;
if(_219){
for(var _21b=_218.childNodes,i=_21b.length-1,j=1;i>=0;i--){
node=_21b[i];
if(node.nodeType==1&&(!_21a||node._counted)){
node.nodeIndex=j++;
}
}
}else{
for(var i=0,j=1,_21b=_218.childNodes;node=_21b[i];i++){
if(node.nodeType==1&&(!_21a||node._counted)){
node.nodeIndex=j++;
}
}
}
},unique:function(_21e){
if(_21e.length==0){
return _21e;
}
var _21f=[],n;
for(var i=0,l=_21e.length;i<l;i++){
if(!(n=_21e[i])._counted){
n._counted=true;
_21f.push(Element.extend(n));
}
}
return Selector.handlers.unmark(_21f);
},descendant:function(_223){
var h=Selector.handlers;
for(var i=0,_226=[],node;node=_223[i];i++){
h.concat(_226,node.getElementsByTagName("*"));
}
return _226;
},child:function(_228){
var h=Selector.handlers;
for(var i=0,_22b=[],node;node=_228[i];i++){
for(var j=0,_22e=[],_22f;_22f=node.childNodes[j];j++){
if(_22f.nodeType==1&&_22f.tagName!="!"){
_22b.push(_22f);
}
}
}
return _22b;
},adjacent:function(_230){
for(var i=0,_232=[],node;node=_230[i];i++){
var next=this.nextElementSibling(node);
if(next){
_232.push(next);
}
}
return _232;
},laterSibling:function(_235){
var h=Selector.handlers;
for(var i=0,_238=[],node;node=_235[i];i++){
h.concat(_238,Element.nextSiblings(node));
}
return _238;
},nextElementSibling:function(node){
while(node=node.nextSibling){
if(node.nodeType==1){
return node;
}
}
return null;
},previousElementSibling:function(node){
while(node=node.previousSibling){
if(node.nodeType==1){
return node;
}
}
return null;
},tagName:function(_23c,root,_23e,_23f){
_23e=_23e.toUpperCase();
var _240=[],h=Selector.handlers;
if(_23c){
if(_23f){
if(_23f=="descendant"){
for(var i=0,node;node=_23c[i];i++){
h.concat(_240,node.getElementsByTagName(_23e));
}
return _240;
}else{
_23c=this[_23f](_23c);
}
if(_23e=="*"){
return _23c;
}
}
for(var i=0,node;node=_23c[i];i++){
if(node.tagName.toUpperCase()==_23e){
_240.push(node);
}
}
return _240;
}else{
return root.getElementsByTagName(_23e);
}
},id:function(_244,root,id,_247){
var _248=$(id),h=Selector.handlers;
if(!_244&&root==document){
return _248?[_248]:[];
}
if(_244){
if(_247){
if(_247=="child"){
for(var i=0,node;node=_244[i];i++){
if(_248.parentNode==node){
return [_248];
}
}
}else{
if(_247=="descendant"){
for(var i=0,node;node=_244[i];i++){
if(Element.descendantOf(_248,node)){
return [_248];
}
}
}else{
if(_247=="adjacent"){
for(var i=0,node;node=_244[i];i++){
if(Selector.handlers.previousElementSibling(_248)==node){
return [_248];
}
}
}else{
_244=h[_247](_244);
}
}
}
}
for(var i=0,node;node=_244[i];i++){
if(node==_248){
return [_248];
}
}
return [];
}
return (_248&&Element.descendantOf(_248,root))?[_248]:[];
},className:function(_24c,root,_24e,_24f){
if(_24c&&_24f){
_24c=this[_24f](_24c);
}
return Selector.handlers.byClassName(_24c,root,_24e);
},byClassName:function(_250,root,_252){
if(!_250){
_250=Selector.handlers.descendant([root]);
}
var _253=" "+_252+" ";
for(var i=0,_255=[],node,_257;node=_250[i];i++){
_257=node.className;
if(_257.length==0){
continue;
}
if(_257==_252||(" "+_257+" ").include(_253)){
_255.push(node);
}
}
return _255;
},attrPresence:function(_258,root,attr){
var _25b=[];
for(var i=0,node;node=_258[i];i++){
if(Element.hasAttribute(node,attr)){
_25b.push(node);
}
}
return _25b;
},attr:function(_25e,root,attr,_261,_262){
if(!_25e){
_25e=root.getElementsByTagName("*");
}
var _263=Selector.operators[_262],_264=[];
for(var i=0,node;node=_25e[i];i++){
var _267=Element.readAttribute(node,attr);
if(_267===null){
continue;
}
if(_263(_267,_261)){
_264.push(node);
}
}
return _264;
},pseudo:function(_268,name,_26a,root,_26c){
if(_268&&_26c){
_268=this[_26c](_268);
}
if(!_268){
_268=root.getElementsByTagName("*");
}
return Selector.pseudos[name](_268,_26a,root);
}},pseudos:{"first-child":function(_26d,_26e,root){
for(var i=0,_271=[],node;node=_26d[i];i++){
if(Selector.handlers.previousElementSibling(node)){
continue;
}
_271.push(node);
}
return _271;
},"last-child":function(_273,_274,root){
for(var i=0,_277=[],node;node=_273[i];i++){
if(Selector.handlers.nextElementSibling(node)){
continue;
}
_277.push(node);
}
return _277;
},"only-child":function(_279,_27a,root){
var h=Selector.handlers;
for(var i=0,_27e=[],node;node=_279[i];i++){
if(!h.previousElementSibling(node)&&!h.nextElementSibling(node)){
_27e.push(node);
}
}
return _27e;
},"nth-child":function(_280,_281,root){
return Selector.pseudos.nth(_280,_281,root);
},"nth-last-child":function(_283,_284,root){
return Selector.pseudos.nth(_283,_284,root,true);
},"nth-of-type":function(_286,_287,root){
return Selector.pseudos.nth(_286,_287,root,false,true);
},"nth-last-of-type":function(_289,_28a,root){
return Selector.pseudos.nth(_289,_28a,root,true,true);
},"first-of-type":function(_28c,_28d,root){
return Selector.pseudos.nth(_28c,"1",root,false,true);
},"last-of-type":function(_28f,_290,root){
return Selector.pseudos.nth(_28f,"1",root,true,true);
},"only-of-type":function(_292,_293,root){
var p=Selector.pseudos;
return p["last-of-type"](p["first-of-type"](_292,_293,root),_293,root);
},getIndices:function(a,b,_298){
if(a==0){
return b>0?[b]:[];
}
return $R(1,_298).inject([],function(memo,i){
if(0==(i-b)%a&&(i-b)/a>=0){
memo.push(i);
}
return memo;
});
},nth:function(_29b,_29c,root,_29e,_29f){
if(_29b.length==0){
return [];
}
if(_29c=="even"){
_29c="2n+0";
}
if(_29c=="odd"){
_29c="2n+1";
}
var h=Selector.handlers,_2a1=[],_2a2=[],m;
h.mark(_29b);
for(var i=0,node;node=_29b[i];i++){
if(!node.parentNode._counted){
h.index(node.parentNode,_29e,_29f);
_2a2.push(node.parentNode);
}
}
if(_29c.match(/^\d+$/)){
_29c=Number(_29c);
for(var i=0,node;node=_29b[i];i++){
if(node.nodeIndex==_29c){
_2a1.push(node);
}
}
}else{
if(m=_29c.match(/^(-?\d*)?n(([+-])(\d+))?/)){
if(m[1]=="-"){
m[1]=-1;
}
var a=m[1]?Number(m[1]):1;
var b=m[2]?Number(m[2]):0;
var _2a8=Selector.pseudos.getIndices(a,b,_29b.length);
for(var i=0,node,l=_2a8.length;node=_29b[i];i++){
for(var j=0;j<l;j++){
if(node.nodeIndex==_2a8[j]){
_2a1.push(node);
}
}
}
}
}
h.unmark(_29b);
h.unmark(_2a2);
return _2a1;
},"empty":function(_2ab,_2ac,root){
for(var i=0,_2af=[],node;node=_2ab[i];i++){
if(node.tagName=="!"||(node.firstChild&&!node.innerHTML.match(/^\s*$/))){
continue;
}
_2af.push(node);
}
return _2af;
},"not":function(_2b1,_2b2,root){
var h=Selector.handlers,_2b5,m;
var _2b7=new Selector(_2b2).findElements(root);
h.mark(_2b7);
for(var i=0,_2b9=[],node;node=_2b1[i];i++){
if(!node._counted){
_2b9.push(node);
}
}
h.unmark(_2b7);
return _2b9;
},"enabled":function(_2bb,_2bc,root){
for(var i=0,_2bf=[],node;node=_2bb[i];i++){
if(!node.disabled){
_2bf.push(node);
}
}
return _2bf;
},"disabled":function(_2c1,_2c2,root){
for(var i=0,_2c5=[],node;node=_2c1[i];i++){
if(node.disabled){
_2c5.push(node);
}
}
return _2c5;
},"checked":function(_2c7,_2c8,root){
for(var i=0,_2cb=[],node;node=_2c7[i];i++){
if(node.checked){
_2cb.push(node);
}
}
return _2cb;
}},operators:{"=":function(nv,v){
return nv==v;
},"!=":function(nv,v){
return nv!=v;
},"^=":function(nv,v){
return nv.startsWith(v);
},"$=":function(nv,v){
return nv.endsWith(v);
},"*=":function(nv,v){
return nv.include(v);
},"~=":function(nv,v){
return (" "+nv+" ").include(" "+v+" ");
},"|=":function(nv,v){
return ("-"+nv.toUpperCase()+"-").include("-"+v.toUpperCase()+"-");
}},matchElements:function(_2db,_2dc){
var _2dd=new Selector(_2dc).findElements(),h=Selector.handlers;
h.mark(_2dd);
for(var i=0,_2e0=[],_2e1;_2e1=_2db[i];i++){
if(_2e1._counted){
_2e0.push(_2e1);
}
}
h.unmark(_2dd);
return _2e0;
},findElement:function(_2e2,_2e3,_2e4){
if(typeof _2e3=="number"){
_2e4=_2e3;
_2e3=false;
}
return Selector.matchElements(_2e2,_2e3||"*")[_2e4||0];
},findChildElements:function(_2e5,_2e6){
var _2e7=_2e6.join(","),_2e6=[];
_2e7.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/,function(m){
_2e6.push(m[1].strip());
});
var _2e9=[],h=Selector.handlers;
for(var i=0,l=_2e6.length,_2ed;i<l;i++){
_2ed=new Selector(_2e6[i].strip());
h.concat(_2e9,_2ed.findElements(_2e5));
}
return (l>1)?h.unique(_2e9):_2e9;
}});
function $$(){
return Selector.findChildElements(document,$A(arguments));
}
var Form={reset:function(form){
$(form).reset();
return form;
},serializeElements:function(_2ef,_2f0){
var data=_2ef.inject({},function(_2f2,_2f3){
if(!_2f3.disabled&&_2f3.name){
var key=_2f3.name,_2f5=$(_2f3).getValue();
if(_2f5!=null){
if(key in _2f2){
if(_2f2[key].constructor!=Array){
_2f2[key]=[_2f2[key]];
}
_2f2[key].push(_2f5);
}else{
_2f2[key]=_2f5;
}
}
}
return _2f2;
});
return _2f0?data:Hash.toQueryString(data);
}};
Form.Methods={serialize:function(form,_2f7){
return Form.serializeElements(Form.getElements(form),_2f7);
},getElements:function(form){
return $A($(form).getElementsByTagName("*")).inject([],function(_2f9,_2fa){
if(Form.Element.Serializers[_2fa.tagName.toLowerCase()]){
_2f9.push(Element.extend(_2fa));
}
return _2f9;
});
},getInputs:function(form,_2fc,name){
form=$(form);
var _2fe=form.getElementsByTagName("input");
if(!_2fc&&!name){
return $A(_2fe).map(Element.extend);
}
for(var i=0,_300=[],_301=_2fe.length;i<_301;i++){
var _302=_2fe[i];
if((_2fc&&_302.type!=_2fc)||(name&&_302.name!=name)){
continue;
}
_300.push(Element.extend(_302));
}
return _300;
},disable:function(form){
form=$(form);
Form.getElements(form).invoke("disable");
return form;
},enable:function(form){
form=$(form);
Form.getElements(form).invoke("enable");
return form;
},findFirstElement:function(form){
return $(form).getElements().find(function(_306){
return _306.type!="hidden"&&!_306.disabled&&["input","select","textarea"].include(_306.tagName.toLowerCase());
});
},focusFirstElement:function(form){
form=$(form);
form.findFirstElement().activate();
return form;
},request:function(form,_309){
form=$(form),_309=Object.clone(_309||{});
var _30a=_309.parameters;
_309.parameters=form.serialize(true);
if(_30a){
if(typeof _30a=="string"){
_30a=_30a.toQueryParams();
}
Object.extend(_309.parameters,_30a);
}
if(form.hasAttribute("method")&&!_309.method){
_309.method=form.method;
}
return new Ajax.Request(form.readAttribute("action"),_309);
}};
Form.Element={focus:function(_30b){
$(_30b).focus();
return _30b;
},select:function(_30c){
$(_30c).select();
return _30c;
}};
Form.Element.Methods={serialize:function(_30d){
_30d=$(_30d);
if(!_30d.disabled&&_30d.name){
var _30e=_30d.getValue();
if(_30e!=undefined){
var pair={};
pair[_30d.name]=_30e;
return Hash.toQueryString(pair);
}
}
return "";
},getValue:function(_310){
_310=$(_310);
var _311=_310.tagName.toLowerCase();
return Form.Element.Serializers[_311](_310);
},clear:function(_312){
$(_312).value="";
return _312;
},present:function(_313){
return $(_313).value!="";
},activate:function(_314){
_314=$(_314);
try{
_314.focus();
if(_314.select&&(_314.tagName.toLowerCase()!="input"||!["button","reset","submit"].include(_314.type))){
_314.select();
}
}
catch(e){
}
return _314;
},disable:function(_315){
_315=$(_315);
_315.blur();
_315.disabled=true;
return _315;
},enable:function(_316){
_316=$(_316);
_316.disabled=false;
return _316;
}};
var Field=Form.Element;
var $F=Form.Element.Methods.getValue;
Form.Element.Serializers={input:function(_317){
switch(_317.type.toLowerCase()){
case "checkbox":
case "radio":
return Form.Element.Serializers.inputSelector(_317);
default:
return Form.Element.Serializers.textarea(_317);
}
},inputSelector:function(_318){
return _318.checked?_318.value:null;
},textarea:function(_319){
return _319.value;
},select:function(_31a){
return this[_31a.type=="select-one"?"selectOne":"selectMany"](_31a);
},selectOne:function(_31b){
var _31c=_31b.selectedIndex;
return _31c>=0?this.optionValue(_31b.options[_31c]):null;
},selectMany:function(_31d){
var _31e,_31f=_31d.length;
if(!_31f){
return null;
}
for(var i=0,_31e=[];i<_31f;i++){
var opt=_31d.options[i];
if(opt.selected){
_31e.push(this.optionValue(opt));
}
}
return _31e;
},optionValue:function(opt){
return Element.extend(opt).hasAttribute("value")?opt.value:opt.text;
}};
Abstract.TimedObserver=function(){
};
Abstract.TimedObserver.prototype={initialize:function(_323,_324,_325){
this.frequency=_324;
this.element=$(_323);
this.callback=_325;
this.lastValue=this.getValue();
this.registerCallback();
},registerCallback:function(){
setInterval(this.onTimerEvent.bind(this),this.frequency*1000);
},onTimerEvent:function(){
var _326=this.getValue();
var _327=("string"==typeof this.lastValue&&"string"==typeof _326?this.lastValue!=_326:String(this.lastValue)!=String(_326));
if(_327){
this.callback(this.element,_326);
this.lastValue=_326;
}
}};
Form.Element.Observer=Class.create();
Form.Element.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){
return Form.Element.getValue(this.element);
}});
Form.Observer=Class.create();
Form.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){
return Form.serialize(this.element);
}});
Abstract.EventObserver=function(){
};
Abstract.EventObserver.prototype={initialize:function(_328,_329){
this.element=$(_328);
this.callback=_329;
this.lastValue=this.getValue();
if(this.element.tagName.toLowerCase()=="form"){
this.registerFormCallbacks();
}else{
this.registerCallback(this.element);
}
},onElementEvent:function(){
var _32a=this.getValue();
if(this.lastValue!=_32a){
this.callback(this.element,_32a);
this.lastValue=_32a;
}
},registerFormCallbacks:function(){
Form.getElements(this.element).each(this.registerCallback.bind(this));
},registerCallback:function(_32b){
if(_32b.type){
switch(_32b.type.toLowerCase()){
case "checkbox":
case "radio":
Event.observe(_32b,"click",this.onElementEvent.bind(this));
break;
default:
Event.observe(_32b,"change",this.onElementEvent.bind(this));
break;
}
}
}};
Form.Element.EventObserver=Class.create();
Form.Element.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){
return Form.Element.getValue(this.element);
}});
Form.EventObserver=Class.create();
Form.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){
return Form.serialize(this.element);
}});
if(!window.Event){
var Event=new Object();
}
Object.extend(Event,{KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,element:function(_32c){
return $(_32c.target||_32c.srcElement);
},isLeftClick:function(_32d){
return (((_32d.which)&&(_32d.which==1))||((_32d.button)&&(_32d.button==1)));
},pointerX:function(_32e){
return _32e.pageX||(_32e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
},pointerY:function(_32f){
return _32f.pageY||(_32f.clientY+(document.documentElement.scrollTop||document.body.scrollTop));
},stop:function(_330){
if(_330.preventDefault){
_330.preventDefault();
_330.stopPropagation();
}else{
_330.returnValue=false;
_330.cancelBubble=true;
}
},findElement:function(_331,_332){
var _333=Event.element(_331);
while(_333.parentNode&&(!_333.tagName||(_333.tagName.toUpperCase()!=_332.toUpperCase()))){
_333=_333.parentNode;
}
return _333;
},observers:false,_observeAndCache:function(_334,name,_336,_337){
if(!this.observers){
this.observers=[];
}
if(_334.addEventListener){
this.observers.push([_334,name,_336,_337]);
_334.addEventListener(name,_336,_337);
}else{
if(_334.attachEvent){
this.observers.push([_334,name,_336,_337]);
_334.attachEvent("on"+name,_336);
}
}
},unloadCache:function(){
if(!Event.observers){
return;
}
for(var i=0,_339=Event.observers.length;i<_339;i++){
Event.stopObserving.apply(this,Event.observers[i]);
Event.observers[i][0]=null;
}
Event.observers=false;
},observe:function(_33a,name,_33c,_33d){
_33a=$(_33a);
_33d=_33d||false;
if(name=="keypress"&&(Prototype.Browser.WebKit||_33a.attachEvent)){
name="keydown";
}
Event._observeAndCache(_33a,name,_33c,_33d);
},stopObserving:function(_33e,name,_340,_341){
_33e=$(_33e);
_341=_341||false;
if(name=="keypress"&&(Prototype.Browser.WebKit||_33e.attachEvent)){
name="keydown";
}
if(_33e.removeEventListener){
_33e.removeEventListener(name,_340,_341);
}else{
if(_33e.detachEvent){
try{
_33e.detachEvent("on"+name,_340);
}
catch(e){
}
}
}
}});
if(Prototype.Browser.IE){
Event.observe(window,"unload",Event.unloadCache,false);
}
var Position={includeScrollOffsets:false,prepare:function(){
this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;
this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
},realOffset:function(_342){
var _343=0,_344=0;
do{
_343+=_342.scrollTop||0;
_344+=_342.scrollLeft||0;
_342=_342.parentNode;
}while(_342);
return [_344,_343];
},cumulativeOffset:function(_345){
var _346=0,_347=0;
do{
_346+=_345.offsetTop||0;
_347+=_345.offsetLeft||0;
_345=_345.offsetParent;
}while(_345);
return [_347,_346];
},positionedOffset:function(_348){
var _349=0,_34a=0;
do{
_349+=_348.offsetTop||0;
_34a+=_348.offsetLeft||0;
_348=_348.offsetParent;
if(_348){
if(_348.tagName=="BODY"){
break;
}
var p=Element.getStyle(_348,"position");
if(p=="relative"||p=="absolute"){
break;
}
}
}while(_348);
return [_34a,_349];
},offsetParent:function(_34c){
if(_34c.offsetParent){
return _34c.offsetParent;
}
if(_34c==document.body){
return _34c;
}
while((_34c=_34c.parentNode)&&_34c!=document.body){
if(Element.getStyle(_34c,"position")!="static"){
return _34c;
}
}
return document.body;
},within:function(_34d,x,y){
if(this.includeScrollOffsets){
return this.withinIncludingScrolloffsets(_34d,x,y);
}
this.xcomp=x;
this.ycomp=y;
this.offset=this.cumulativeOffset(_34d);
return (y>=this.offset[1]&&y<this.offset[1]+_34d.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+_34d.offsetWidth);
},withinIncludingScrolloffsets:function(_350,x,y){
var _353=this.realOffset(_350);
this.xcomp=x+_353[0]-this.deltaX;
this.ycomp=y+_353[1]-this.deltaY;
this.offset=this.cumulativeOffset(_350);
return (this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+_350.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+_350.offsetWidth);
},overlap:function(mode,_355){
if(!mode){
return 0;
}
if(mode=="vertical"){
return ((this.offset[1]+_355.offsetHeight)-this.ycomp)/_355.offsetHeight;
}
if(mode=="horizontal"){
return ((this.offset[0]+_355.offsetWidth)-this.xcomp)/_355.offsetWidth;
}
},page:function(_356){
var _357=0,_358=0;
var _359=_356;
do{
_357+=_359.offsetTop||0;
_358+=_359.offsetLeft||0;
if(_359.offsetParent==document.body){
if(Element.getStyle(_359,"position")=="absolute"){
break;
}
}
}while(_359=_359.offsetParent);
_359=_356;
do{
if(!window.opera||_359.tagName=="BODY"){
_357-=_359.scrollTop||0;
_358-=_359.scrollLeft||0;
}
}while(_359=_359.parentNode);
return [_358,_357];
},clone:function(_35a,_35b){
var _35c=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});
_35a=$(_35a);
var p=Position.page(_35a);
_35b=$(_35b);
var _35e=[0,0];
var _35f=null;
if(Element.getStyle(_35b,"position")=="absolute"){
_35f=Position.offsetParent(_35b);
_35e=Position.page(_35f);
}
if(_35f==document.body){
_35e[0]-=document.body.offsetLeft;
_35e[1]-=document.body.offsetTop;
}
if(_35c.setLeft){
_35b.style.left=(p[0]-_35e[0]+_35c.offsetLeft)+"px";
}
if(_35c.setTop){
_35b.style.top=(p[1]-_35e[1]+_35c.offsetTop)+"px";
}
if(_35c.setWidth){
_35b.style.width=_35a.offsetWidth+"px";
}
if(_35c.setHeight){
_35b.style.height=_35a.offsetHeight+"px";
}
},absolutize:function(_360){
_360=$(_360);
if(_360.style.position=="absolute"){
return;
}
Position.prepare();
var _361=Position.positionedOffset(_360);
var top=_361[1];
var left=_361[0];
var _364=_360.clientWidth;
var _365=_360.clientHeight;
_360._originalLeft=left-parseFloat(_360.style.left||0);
_360._originalTop=top-parseFloat(_360.style.top||0);
_360._originalWidth=_360.style.width;
_360._originalHeight=_360.style.height;
_360.style.position="absolute";
_360.style.top=top+"px";
_360.style.left=left+"px";
_360.style.width=_364+"px";
_360.style.height=_365+"px";
},relativize:function(_366){
_366=$(_366);
if(_366.style.position=="relative"){
return;
}
Position.prepare();
_366.style.position="relative";
var top=parseFloat(_366.style.top||0)-(_366._originalTop||0);
var left=parseFloat(_366.style.left||0)-(_366._originalLeft||0);
_366.style.top=top+"px";
_366.style.left=left+"px";
_366.style.height=_366._originalHeight;
_366.style.width=_366._originalWidth;
}};
if(Prototype.Browser.WebKit){
Position.cumulativeOffset=function(_369){
var _36a=0,_36b=0;
do{
_36a+=_369.offsetTop||0;
_36b+=_369.offsetLeft||0;
if(_369.offsetParent==document.body){
if(Element.getStyle(_369,"position")=="absolute"){
break;
}
}
_369=_369.offsetParent;
}while(_369);
return [_36b,_36a];
};
}
Element.addMethods();
String.prototype.parseColor=function(){
var _36c="#";
if(this.slice(0,4)=="rgb("){
var cols=this.slice(4,this.length-1).split(",");
var i=0;
do{
_36c+=parseInt(cols[i]).toColorPart();
}while(++i<3);
}else{
if(this.slice(0,1)=="#"){
if(this.length==4){
for(var i=1;i<4;i++){
_36c+=(this.charAt(i)+this.charAt(i)).toLowerCase();
}
}
if(this.length==7){
_36c=this.toLowerCase();
}
}
}
return (_36c.length==7?_36c:(arguments[0]||this));
};
Element.collectTextNodes=function(_36f){
return $A($(_36f).childNodes).collect(function(node){
return (node.nodeType==3?node.nodeValue:(node.hasChildNodes()?Element.collectTextNodes(node):""));
}).flatten().join("");
};
Element.collectTextNodesIgnoreClass=function(_371,_372){
return $A($(_371).childNodes).collect(function(node){
return (node.nodeType==3?node.nodeValue:((node.hasChildNodes()&&!Element.hasClassName(node,_372))?Element.collectTextNodesIgnoreClass(node,_372):""));
}).flatten().join("");
};
Element.setContentZoom=function(_374,_375){
_374=$(_374);
_374.setStyle({fontSize:(_375/100)+"em"});
if(navigator.appVersion.indexOf("AppleWebKit")>0){
window.scrollBy(0,0);
}
return _374;
};
Element.getOpacity=function(_376){
_376=$(_376);
var _377;
if(_377=_376.getStyle("opacity")){
return parseFloat(_377);
}
if(_377=(_376.getStyle("filter")||"").match(/alpha\(opacity=(.*)\)/)){
if(_377[1]){
return parseFloat(_377[1])/100;
}
}
return 1;
};
Element.setOpacity=function(_378,_379){
_378=$(_378);
if(_379==1){
_378.setStyle({opacity:(/Gecko/.test(navigator.userAgent)&&!/Konqueror|Safari|KHTML/.test(navigator.userAgent))?0.999999:1});
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_378.setStyle({filter:Element.getStyle(_378,"filter").replace(/alpha\([^\)]*\)/gi,"")});
}
}else{
if(_379<0.00001){
_379=0;
}
_378.setStyle({opacity:_379});
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_378.setStyle({filter:_378.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"")+"alpha(opacity="+_379*100+")"});
}
}
return _378;
};
Element.getInlineOpacity=function(_37a){
return $(_37a).style.opacity||"";
};
Element.forceRerendering=function(_37b){
try{
_37b=$(_37b);
var n=document.createTextNode(" ");
_37b.appendChild(n);
_37b.removeChild(n);
}
catch(e){
}
};
Array.prototype.call=function(){
var args=arguments;
this.each(function(f){
f.apply(this,args);
});
};
var Effect={_elementDoesNotExistError:{name:"ElementDoesNotExistError",message:"The specified DOM element does not exist, but is required for this effect to operate"},tagifyText:function(_37f){
if(typeof Builder=="undefined"){
throw ("Effect.tagifyText requires including script.aculo.us' builder.js library");
}
var _380="position:relative";
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_380+=";zoom:1";
}
_37f=$(_37f);
$A(_37f.childNodes).each(function(_381){
if(_381.nodeType==3){
_381.nodeValue.toArray().each(function(_382){
_37f.insertBefore(Builder.node("span",{style:_380},_382==" "?String.fromCharCode(160):_382),_381);
});
Element.remove(_381);
}
});
},multiple:function(_383,_384){
var _385;
if(((typeof _383=="object")||(typeof _383=="function"))&&(_383.length)){
_385=_383;
}else{
_385=$(_383).childNodes;
}
var _386=Object.extend({speed:0.1,delay:0},arguments[2]||{});
var _387=_386.delay;
$A(_385).each(function(_388,_389){
new _384(_388,Object.extend(_386,{delay:_389*_386.speed+_387}));
});
},PAIRS:{"slide":["SlideDown","SlideUp"],"blind":["BlindDown","BlindUp"],"appear":["Appear","Fade"]},toggle:function(_38a,_38b){
_38a=$(_38a);
_38b=(_38b||"appear").toLowerCase();
var _38c=Object.extend({queue:{position:"end",scope:(_38a.id||"global"),limit:1}},arguments[2]||{});
Effect[_38a.visible()?Effect.PAIRS[_38b][1]:Effect.PAIRS[_38b][0]](_38a,_38c);
}};
var Effect2=Effect;
Effect.Transitions={linear:Prototype.K,sinoidal:function(pos){
return (-Math.cos(pos*Math.PI)/2)+0.5;
},reverse:function(pos){
return 1-pos;
},flicker:function(pos){
return ((-Math.cos(pos*Math.PI)/4)+0.75)+Math.random()/4;
},wobble:function(pos){
return (-Math.cos(pos*Math.PI*(9*pos))/2)+0.5;
},pulse:function(pos,_392){
_392=_392||5;
return (Math.round((pos%(1/_392))*_392)==0?((pos*_392*2)-Math.floor(pos*_392*2)):1-((pos*_392*2)-Math.floor(pos*_392*2)));
},none:function(pos){
return 0;
},full:function(pos){
return 1;
}};
Effect.ScopedQueue=Class.create();
Object.extend(Object.extend(Effect.ScopedQueue.prototype,Enumerable),{initialize:function(){
this.effects=[];
this.interval=null;
},_each:function(_395){
this.effects._each(_395);
},add:function(_396){
var _397=new Date().getTime();
var _398=(typeof _396.options.queue=="string")?_396.options.queue:_396.options.queue.position;
switch(_398){
case "front":
this.effects.findAll(function(e){
return e.state=="idle";
}).each(function(e){
e.startOn+=_396.finishOn;
e.finishOn+=_396.finishOn;
});
break;
case "with-last":
_397=this.effects.pluck("startOn").max()||_397;
break;
case "end":
_397=this.effects.pluck("finishOn").max()||_397;
break;
}
_396.startOn+=_397;
_396.finishOn+=_397;
if(!_396.options.queue.limit||(this.effects.length<_396.options.queue.limit)){
this.effects.push(_396);
}
if(!this.interval){
this.interval=setInterval(this.loop.bind(this),40);
}
},remove:function(_39b){
this.effects=this.effects.reject(function(e){
return e==_39b;
});
if(this.effects.length==0){
clearInterval(this.interval);
this.interval=null;
}
},loop:function(){
var _39d=new Date().getTime();
this.effects.invoke("loop",_39d);
}});
Effect.Queues={instances:$H(),get:function(_39e){
if(typeof _39e!="string"){
return _39e;
}
if(!this.instances[_39e]){
this.instances[_39e]=new Effect.ScopedQueue();
}
return this.instances[_39e];
}};
Effect.Queue=Effect.Queues.get("global");
Effect.DefaultOptions={transition:Effect.Transitions.sinoidal,duration:1,fps:25,sync:false,from:0,to:1,delay:0,queue:"parallel"};
Effect.Base=function(){
};
Effect.Base.prototype={position:null,start:function(_39f){
this.options=Object.extend(Object.extend({},Effect.DefaultOptions),_39f||{});
this.currentFrame=0;
this.state="idle";
this.startOn=this.options.delay*1000;
this.finishOn=this.startOn+(this.options.duration*1000);
this.event("beforeStart");
if(!this.options.sync){
Effect.Queues.get(typeof this.options.queue=="string"?"global":this.options.queue.scope).add(this);
}
},loop:function(_3a0){
if(_3a0>=this.startOn){
if(_3a0>=this.finishOn){
this.render(1);
this.cancel();
this.event("beforeFinish");
if(this.finish){
this.finish();
}
this.event("afterFinish");
return;
}
var pos=(_3a0-this.startOn)/(this.finishOn-this.startOn);
var _3a2=Math.round(pos*this.options.fps*this.options.duration);
if(_3a2>this.currentFrame){
this.render(pos);
this.currentFrame=_3a2;
}
}
},render:function(pos){
if(this.state=="idle"){
this.state="running";
this.event("beforeSetup");
if(this.setup){
this.setup();
}
this.event("afterSetup");
}
if(this.state=="running"){
if(this.options.transition){
pos=this.options.transition(pos);
}
pos*=(this.options.to-this.options.from);
pos+=this.options.from;
this.position=pos;
this.event("beforeUpdate");
if(this.update){
this.update(pos);
}
this.event("afterUpdate");
}
},cancel:function(){
if(!this.options.sync){
Effect.Queues.get(typeof this.options.queue=="string"?"global":this.options.queue.scope).remove(this);
}
this.state="finished";
},event:function(_3a4){
if(this.options[_3a4+"Internal"]){
this.options[_3a4+"Internal"](this);
}
if(this.options[_3a4]){
this.options[_3a4](this);
}
},inspect:function(){
return "#<Effect:"+$H(this).inspect()+",options:"+$H(this.options).inspect()+">";
}};
Effect.Parallel=Class.create();
Object.extend(Object.extend(Effect.Parallel.prototype,Effect.Base.prototype),{initialize:function(_3a5){
this.effects=_3a5||[];
this.start(arguments[1]);
},update:function(_3a6){
this.effects.invoke("render",_3a6);
},finish:function(_3a7){
this.effects.each(function(_3a8){
_3a8.render(1);
_3a8.cancel();
_3a8.event("beforeFinish");
if(_3a8.finish){
_3a8.finish(_3a7);
}
_3a8.event("afterFinish");
});
}});
Effect.Event=Class.create();
Object.extend(Object.extend(Effect.Event.prototype,Effect.Base.prototype),{initialize:function(){
var _3a9=Object.extend({duration:0},arguments[0]||{});
this.start(_3a9);
},update:Prototype.emptyFunction});
Effect.Opacity=Class.create();
Object.extend(Object.extend(Effect.Opacity.prototype,Effect.Base.prototype),{initialize:function(_3aa){
this.element=$(_3aa);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
if(/MSIE/.test(navigator.userAgent)&&!window.opera&&(!this.element.currentStyle.hasLayout)){
this.element.setStyle({zoom:1});
}
var _3ab=Object.extend({from:this.element.getOpacity()||0,to:1},arguments[1]||{});
this.start(_3ab);
},update:function(_3ac){
this.element.setOpacity(_3ac);
}});
Effect.Move=Class.create();
Object.extend(Object.extend(Effect.Move.prototype,Effect.Base.prototype),{initialize:function(_3ad){
this.element=$(_3ad);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _3ae=Object.extend({x:0,y:0,mode:"relative"},arguments[1]||{});
this.start(_3ae);
},setup:function(){
this.element.makePositioned();
this.originalLeft=parseFloat(this.element.getStyle("left")||"0");
this.originalTop=parseFloat(this.element.getStyle("top")||"0");
if(this.options.mode=="absolute"){
this.options.x=this.options.x-this.originalLeft;
this.options.y=this.options.y-this.originalTop;
}
},update:function(_3af){
this.element.setStyle({left:Math.round(this.options.x*_3af+this.originalLeft)+"px",top:Math.round(this.options.y*_3af+this.originalTop)+"px"});
}});
Effect.MoveBy=function(_3b0,_3b1,_3b2){
return new Effect.Move(_3b0,Object.extend({x:_3b2,y:_3b1},arguments[3]||{}));
};
Effect.Scale=Class.create();
Object.extend(Object.extend(Effect.Scale.prototype,Effect.Base.prototype),{initialize:function(_3b3,_3b4){
this.element=$(_3b3);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _3b5=Object.extend({scaleX:true,scaleY:true,scaleContent:true,scaleFromCenter:false,scaleMode:"box",scaleFrom:100,scaleTo:_3b4},arguments[2]||{});
this.start(_3b5);
},setup:function(){
this.restoreAfterFinish=this.options.restoreAfterFinish||false;
this.elementPositioning=this.element.getStyle("position");
this.originalStyle={};
["top","left","width","height","fontSize"].each(function(k){
this.originalStyle[k]=this.element.style[k];
}.bind(this));
this.originalTop=this.element.offsetTop;
this.originalLeft=this.element.offsetLeft;
var _3b7=this.element.getStyle("font-size")||"100%";
["em","px","%","pt"].each(function(_3b8){
if(_3b7.indexOf(_3b8)>0){
this.fontSize=parseFloat(_3b7);
this.fontSizeType=_3b8;
}
}.bind(this));
this.factor=(this.options.scaleTo-this.options.scaleFrom)/100;
this.dims=null;
if(this.options.scaleMode=="box"){
this.dims=[this.element.offsetHeight,this.element.offsetWidth];
}
if(/^content/.test(this.options.scaleMode)){
this.dims=[this.element.scrollHeight,this.element.scrollWidth];
}
if(!this.dims){
this.dims=[this.options.scaleMode.originalHeight,this.options.scaleMode.originalWidth];
}
},update:function(_3b9){
var _3ba=(this.options.scaleFrom/100)+(this.factor*_3b9);
if(this.options.scaleContent&&this.fontSize){
this.element.setStyle({fontSize:this.fontSize*_3ba+this.fontSizeType});
}
this.setDimensions(this.dims[0]*_3ba,this.dims[1]*_3ba);
},finish:function(_3bb){
if(this.restoreAfterFinish){
this.element.setStyle(this.originalStyle);
}
},setDimensions:function(_3bc,_3bd){
var d={};
if(this.options.scaleX){
d.width=Math.round(_3bd)+"px";
}
if(this.options.scaleY){
d.height=Math.round(_3bc)+"px";
}
if(this.options.scaleFromCenter){
var topd=(_3bc-this.dims[0])/2;
var _3c0=(_3bd-this.dims[1])/2;
if(this.elementPositioning=="absolute"){
if(this.options.scaleY){
d.top=this.originalTop-topd+"px";
}
if(this.options.scaleX){
d.left=this.originalLeft-_3c0+"px";
}
}else{
if(this.options.scaleY){
d.top=-topd+"px";
}
if(this.options.scaleX){
d.left=-_3c0+"px";
}
}
}
this.element.setStyle(d);
}});
Effect.Highlight=Class.create();
Object.extend(Object.extend(Effect.Highlight.prototype,Effect.Base.prototype),{initialize:function(_3c1){
this.element=$(_3c1);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _3c2=Object.extend({startcolor:"#ffff99"},arguments[1]||{});
this.start(_3c2);
},setup:function(){
if(this.element.getStyle("display")=="none"){
this.cancel();
return;
}
this.oldStyle={backgroundImage:this.element.getStyle("background-image")};
this.element.setStyle({backgroundImage:"none"});
if(!this.options.endcolor){
this.options.endcolor=this.element.getStyle("background-color").parseColor("#ffffff");
}
if(!this.options.restorecolor){
this.options.restorecolor=this.element.getStyle("background-color");
}
this._base=$R(0,2).map(function(i){
return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16);
}.bind(this));
this._delta=$R(0,2).map(function(i){
return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i];
}.bind(this));
},update:function(_3c5){
this.element.setStyle({backgroundColor:$R(0,2).inject("#",function(m,v,i){
return m+(Math.round(this._base[i]+(this._delta[i]*_3c5)).toColorPart());
}.bind(this))});
},finish:function(){
this.element.setStyle(Object.extend(this.oldStyle,{backgroundColor:this.options.restorecolor}));
}});
Effect.ScrollTo=Class.create();
Object.extend(Object.extend(Effect.ScrollTo.prototype,Effect.Base.prototype),{initialize:function(_3c9){
this.element=$(_3c9);
this.start(arguments[1]||{});
},setup:function(){
Position.prepare();
var _3ca=Position.cumulativeOffset(this.element);
if(this.options.offset){
_3ca[1]+=this.options.offset;
}
var max=window.innerHeight?window.height-window.innerHeight:document.body.scrollHeight-(document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight);
this.scrollStart=Position.deltaY;
this.delta=(_3ca[1]>max?max:_3ca[1])-this.scrollStart;
},update:function(_3cc){
Position.prepare();
window.scrollTo(Position.deltaX,this.scrollStart+(_3cc*this.delta));
}});
Effect.Fade=function(_3cd){
_3cd=$(_3cd);
var _3ce=_3cd.getInlineOpacity();
var _3cf=Object.extend({from:_3cd.getOpacity()||1,to:0,afterFinishInternal:function(_3d0){
if(_3d0.options.to!=0){
return;
}
_3d0.element.hide().setStyle({opacity:_3ce});
}},arguments[1]||{});
return new Effect.Opacity(_3cd,_3cf);
};
Effect.Appear=function(_3d1){
_3d1=$(_3d1);
var _3d2=Object.extend({from:(_3d1.getStyle("display")=="none"?0:_3d1.getOpacity()||0),to:1,afterFinishInternal:function(_3d3){
_3d3.element.forceRerendering();
},beforeSetup:function(_3d4){
_3d4.element.setOpacity(_3d4.options.from).show();
}},arguments[1]||{});
return new Effect.Opacity(_3d1,_3d2);
};
Effect.Puff=function(_3d5){
_3d5=$(_3d5);
var _3d6={opacity:_3d5.getInlineOpacity(),position:_3d5.getStyle("position"),top:_3d5.style.top,left:_3d5.style.left,width:_3d5.style.width,height:_3d5.style.height};
return new Effect.Parallel([new Effect.Scale(_3d5,200,{sync:true,scaleFromCenter:true,scaleContent:true,restoreAfterFinish:true}),new Effect.Opacity(_3d5,{sync:true,to:0})],Object.extend({duration:1,beforeSetupInternal:function(_3d7){
Position.absolutize(_3d7.effects[0].element);
},afterFinishInternal:function(_3d8){
_3d8.effects[0].element.hide().setStyle(_3d6);
}},arguments[1]||{}));
};
Effect.BlindUp=function(_3d9){
_3d9=$(_3d9);
_3d9.makeClipping();
return new Effect.Scale(_3d9,0,Object.extend({scaleContent:false,scaleX:false,restoreAfterFinish:true,afterFinishInternal:function(_3da){
_3da.element.hide().undoClipping();
}},arguments[1]||{}));
};
Effect.BlindDown=function(_3db){
_3db=$(_3db);
var _3dc=_3db.getDimensions();
return new Effect.Scale(_3db,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:0,scaleMode:{originalHeight:_3dc.height,originalWidth:_3dc.width},restoreAfterFinish:true,afterSetup:function(_3dd){
_3dd.element.makeClipping().setStyle({height:"0px"}).show();
},afterFinishInternal:function(_3de){
_3de.element.undoClipping();
}},arguments[1]||{}));
};
Effect.SwitchOff=function(_3df){
_3df=$(_3df);
var _3e0=_3df.getInlineOpacity();
return new Effect.Appear(_3df,Object.extend({duration:0.4,from:0,transition:Effect.Transitions.flicker,afterFinishInternal:function(_3e1){
new Effect.Scale(_3e1.element,1,{duration:0.3,scaleFromCenter:true,scaleX:false,scaleContent:false,restoreAfterFinish:true,beforeSetup:function(_3e2){
_3e2.element.makePositioned().makeClipping();
},afterFinishInternal:function(_3e3){
_3e3.element.hide().undoClipping().undoPositioned().setStyle({opacity:_3e0});
}});
}},arguments[1]||{}));
};
Effect.DropOut=function(_3e4){
_3e4=$(_3e4);
var _3e5={top:_3e4.getStyle("top"),left:_3e4.getStyle("left"),opacity:_3e4.getInlineOpacity()};
return new Effect.Parallel([new Effect.Move(_3e4,{x:0,y:100,sync:true}),new Effect.Opacity(_3e4,{sync:true,to:0})],Object.extend({duration:0.5,beforeSetup:function(_3e6){
_3e6.effects[0].element.makePositioned();
},afterFinishInternal:function(_3e7){
_3e7.effects[0].element.hide().undoPositioned().setStyle(_3e5);
}},arguments[1]||{}));
};
Effect.Shake=function(_3e8){
_3e8=$(_3e8);
var _3e9={top:_3e8.getStyle("top"),left:_3e8.getStyle("left")};
return new Effect.Move(_3e8,{x:20,y:0,duration:0.05,afterFinishInternal:function(_3ea){
new Effect.Move(_3ea.element,{x:-40,y:0,duration:0.1,afterFinishInternal:function(_3eb){
new Effect.Move(_3eb.element,{x:40,y:0,duration:0.1,afterFinishInternal:function(_3ec){
new Effect.Move(_3ec.element,{x:-40,y:0,duration:0.1,afterFinishInternal:function(_3ed){
new Effect.Move(_3ed.element,{x:40,y:0,duration:0.1,afterFinishInternal:function(_3ee){
new Effect.Move(_3ee.element,{x:-20,y:0,duration:0.05,afterFinishInternal:function(_3ef){
_3ef.element.undoPositioned().setStyle(_3e9);
}});
}});
}});
}});
}});
}});
};
Effect.SlideDown=function(_3f0){
_3f0=$(_3f0).cleanWhitespace();
var _3f1=_3f0.down().getStyle("bottom");
var _3f2=_3f0.getDimensions();
return new Effect.Scale(_3f0,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:window.opera?0:1,scaleMode:{originalHeight:_3f2.height,originalWidth:_3f2.width},restoreAfterFinish:true,afterSetup:function(_3f3){
_3f3.element.makePositioned();
_3f3.element.down().makePositioned();
if(window.opera){
_3f3.element.setStyle({top:""});
}
_3f3.element.makeClipping().setStyle({height:"0px"}).show();
},afterUpdateInternal:function(_3f4){
_3f4.element.down().setStyle({bottom:(_3f4.dims[0]-_3f4.element.clientHeight)+"px"});
},afterFinishInternal:function(_3f5){
_3f5.element.undoClipping().undoPositioned();
_3f5.element.down().undoPositioned().setStyle({bottom:_3f1});
}},arguments[1]||{}));
};
Effect.SlideUp=function(_3f6){
_3f6=$(_3f6).cleanWhitespace();
var _3f7=_3f6.down().getStyle("bottom");
return new Effect.Scale(_3f6,window.opera?0:1,Object.extend({scaleContent:false,scaleX:false,scaleMode:"box",scaleFrom:100,restoreAfterFinish:true,beforeStartInternal:function(_3f8){
_3f8.element.makePositioned();
_3f8.element.down().makePositioned();
if(window.opera){
_3f8.element.setStyle({top:""});
}
_3f8.element.makeClipping().show();
},afterUpdateInternal:function(_3f9){
_3f9.element.down().setStyle({bottom:(_3f9.dims[0]-_3f9.element.clientHeight)+"px"});
},afterFinishInternal:function(_3fa){
_3fa.element.hide().undoClipping().undoPositioned().setStyle({bottom:_3f7});
_3fa.element.down().undoPositioned();
}},arguments[1]||{}));
};
Effect.Squish=function(_3fb){
return new Effect.Scale(_3fb,window.opera?1:0,{restoreAfterFinish:true,beforeSetup:function(_3fc){
_3fc.element.makeClipping();
},afterFinishInternal:function(_3fd){
_3fd.element.hide().undoClipping();
}});
};
Effect.Grow=function(_3fe){
_3fe=$(_3fe);
var _3ff=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.full},arguments[1]||{});
var _400={top:_3fe.style.top,left:_3fe.style.left,height:_3fe.style.height,width:_3fe.style.width,opacity:_3fe.getInlineOpacity()};
var dims=_3fe.getDimensions();
var _402,_403;
var _404,_405;
switch(_3ff.direction){
case "top-left":
_402=_403=_404=_405=0;
break;
case "top-right":
_402=dims.width;
_403=_405=0;
_404=-dims.width;
break;
case "bottom-left":
_402=_404=0;
_403=dims.height;
_405=-dims.height;
break;
case "bottom-right":
_402=dims.width;
_403=dims.height;
_404=-dims.width;
_405=-dims.height;
break;
case "center":
_402=dims.width/2;
_403=dims.height/2;
_404=-dims.width/2;
_405=-dims.height/2;
break;
}
return new Effect.Move(_3fe,{x:_402,y:_403,duration:0.01,beforeSetup:function(_406){
_406.element.hide().makeClipping().makePositioned();
},afterFinishInternal:function(_407){
new Effect.Parallel([new Effect.Opacity(_407.element,{sync:true,to:1,from:0,transition:_3ff.opacityTransition}),new Effect.Move(_407.element,{x:_404,y:_405,sync:true,transition:_3ff.moveTransition}),new Effect.Scale(_407.element,100,{scaleMode:{originalHeight:dims.height,originalWidth:dims.width},sync:true,scaleFrom:window.opera?1:0,transition:_3ff.scaleTransition,restoreAfterFinish:true})],Object.extend({beforeSetup:function(_408){
_408.effects[0].element.setStyle({height:"0px"}).show();
},afterFinishInternal:function(_409){
_409.effects[0].element.undoClipping().undoPositioned().setStyle(_400);
}},_3ff));
}});
};
Effect.Shrink=function(_40a){
_40a=$(_40a);
var _40b=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.none},arguments[1]||{});
var _40c={top:_40a.style.top,left:_40a.style.left,height:_40a.style.height,width:_40a.style.width,opacity:_40a.getInlineOpacity()};
var dims=_40a.getDimensions();
var _40e,_40f;
switch(_40b.direction){
case "top-left":
_40e=_40f=0;
break;
case "top-right":
_40e=dims.width;
_40f=0;
break;
case "bottom-left":
_40e=0;
_40f=dims.height;
break;
case "bottom-right":
_40e=dims.width;
_40f=dims.height;
break;
case "center":
_40e=dims.width/2;
_40f=dims.height/2;
break;
}
return new Effect.Parallel([new Effect.Opacity(_40a,{sync:true,to:0,from:1,transition:_40b.opacityTransition}),new Effect.Scale(_40a,window.opera?1:0,{sync:true,transition:_40b.scaleTransition,restoreAfterFinish:true}),new Effect.Move(_40a,{x:_40e,y:_40f,sync:true,transition:_40b.moveTransition})],Object.extend({beforeStartInternal:function(_410){
_410.effects[0].element.makePositioned().makeClipping();
},afterFinishInternal:function(_411){
_411.effects[0].element.hide().undoClipping().undoPositioned().setStyle(_40c);
}},_40b));
};
Effect.Pulsate=function(_412){
_412=$(_412);
var _413=arguments[1]||{};
var _414=_412.getInlineOpacity();
var _415=_413.transition||Effect.Transitions.sinoidal;
var _416=function(pos){
return _415(1-Effect.Transitions.pulse(pos,_413.pulses));
};
_416.bind(_415);
return new Effect.Opacity(_412,Object.extend(Object.extend({duration:2,from:0,afterFinishInternal:function(_418){
_418.element.setStyle({opacity:_414});
}},_413),{transition:_416}));
};
Effect.Fold=function(_419){
_419=$(_419);
var _41a={top:_419.style.top,left:_419.style.left,width:_419.style.width,height:_419.style.height};
_419.makeClipping();
return new Effect.Scale(_419,5,Object.extend({scaleContent:false,scaleX:false,afterFinishInternal:function(_41b){
new Effect.Scale(_419,1,{scaleContent:false,scaleY:false,afterFinishInternal:function(_41c){
_41c.element.hide().undoClipping().setStyle(_41a);
}});
}},arguments[1]||{}));
};
Effect.Morph=Class.create();
Object.extend(Object.extend(Effect.Morph.prototype,Effect.Base.prototype),{initialize:function(_41d){
this.element=$(_41d);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _41e=Object.extend({style:""},arguments[1]||{});
this.start(_41e);
},setup:function(){
function parseColor(_41f){
if(!_41f||["rgba(0, 0, 0, 0)","transparent"].include(_41f)){
_41f="#ffffff";
}
_41f=_41f.parseColor();
return $R(0,2).map(function(i){
return parseInt(_41f.slice(i*2+1,i*2+3),16);
});
}
this.transforms=this.options.style.parseStyle().map(function(_421){
var _422=this.element.getStyle(_421[0]);
return $H({style:_421[0],originalValue:_421[1].unit=="color"?parseColor(_422):parseFloat(_422||0),targetValue:_421[1].unit=="color"?parseColor(_421[1].value):_421[1].value,unit:_421[1].unit});
}.bind(this)).reject(function(_423){
return ((_423.originalValue==_423.targetValue)||(_423.unit!="color"&&(isNaN(_423.originalValue)||isNaN(_423.targetValue))));
});
},update:function(_424){
var _425=$H(),_426=null;
this.transforms.each(function(_427){
_426=_427.unit=="color"?$R(0,2).inject("#",function(m,v,i){
return m+(Math.round(_427.originalValue[i]+(_427.targetValue[i]-_427.originalValue[i])*_424)).toColorPart();
}):_427.originalValue+Math.round(((_427.targetValue-_427.originalValue)*_424)*1000)/1000+_427.unit;
_425[_427.style]=_426;
});
this.element.setStyle(_425);
}});
Effect.Transform=Class.create();
Object.extend(Effect.Transform.prototype,{initialize:function(_42b){
this.tracks=[];
this.options=arguments[1]||{};
this.addTracks(_42b);
},addTracks:function(_42c){
_42c.each(function(_42d){
var data=$H(_42d).values().first();
this.tracks.push($H({ids:$H(_42d).keys().first(),effect:Effect.Morph,options:{style:data}}));
}.bind(this));
return this;
},play:function(){
return new Effect.Parallel(this.tracks.map(function(_42f){
var _430=[$(_42f.ids)||$$(_42f.ids)].flatten();
return _430.map(function(e){
return new _42f.effect(e,Object.extend({sync:true},_42f.options));
});
}).flatten(),this.options);
}});
Element.CSS_PROPERTIES=["azimuth","backgroundAttachment","backgroundColor","backgroundImage","backgroundPosition","backgroundRepeat","borderBottomColor","borderBottomStyle","borderBottomWidth","borderCollapse","borderLeftColor","borderLeftStyle","borderLeftWidth","borderRightColor","borderRightStyle","borderRightWidth","borderSpacing","borderTopColor","borderTopStyle","borderTopWidth","bottom","captionSide","clear","clip","color","content","counterIncrement","counterReset","cssFloat","cueAfter","cueBefore","cursor","direction","display","elevation","emptyCells","fontFamily","fontSize","fontSizeAdjust","fontStretch","fontStyle","fontVariant","fontWeight","height","left","letterSpacing","lineHeight","listStyleImage","listStylePosition","listStyleType","marginBottom","marginLeft","marginRight","marginTop","markerOffset","marks","maxHeight","maxWidth","minHeight","minWidth","opacity","orphans","outlineColor","outlineOffset","outlineStyle","outlineWidth","overflowX","overflowY","paddingBottom","paddingLeft","paddingRight","paddingTop","page","pageBreakAfter","pageBreakBefore","pageBreakInside","pauseAfter","pauseBefore","pitch","pitchRange","position","quotes","richness","right","size","speakHeader","speakNumeral","speakPunctuation","speechRate","stress","tableLayout","textAlign","textDecoration","textIndent","textShadow","textTransform","top","unicodeBidi","verticalAlign","visibility","voiceFamily","volume","whiteSpace","widows","width","wordSpacing","zIndex"];
Element.CSS_LENGTH=/^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;
String.prototype.parseStyle=function(){
var _432=Element.extend(document.createElement("div"));
_432.innerHTML="<div style=\""+this+"\"></div>";
var _433=_432.down().style,_434=$H();
Element.CSS_PROPERTIES.each(function(_435){
if(_433[_435]){
_434[_435]=_433[_435];
}
});
var _436=$H();
_434.each(function(pair){
var _438=pair[0],_439=pair[1],unit=null;
if(_439.parseColor("#zzzzzz")!="#zzzzzz"){
_439=_439.parseColor();
unit="color";
}else{
if(Element.CSS_LENGTH.test(_439)){
var _43b=_439.match(/^([\+\-]?[0-9\.]+)(.*)$/),_439=parseFloat(_43b[1]),unit=(_43b.length==3)?_43b[2]:null;
}
}
_436[_438.underscore().dasherize()]=$H({value:_439,unit:unit});
}.bind(this));
return _436;
};
Element.morph=function(_43c,_43d){
new Effect.Morph(_43c,Object.extend({style:_43d},arguments[2]||{}));
return _43c;
};
["setOpacity","getOpacity","getInlineOpacity","forceRerendering","setContentZoom","collectTextNodes","collectTextNodesIgnoreClass","morph"].each(function(f){
Element.Methods[f]=Element[f];
});
Element.Methods.visualEffect=function(_43f,_440,_441){
s=_440.gsub(/_/,"-").camelize();
effect_class=s.charAt(0).toUpperCase()+s.substring(1);
new Effect[effect_class](_43f,_441);
return $(_43f);
};
Element.addMethods();
if(typeof Effect=="undefined"){
throw ("controls.js requires including script.aculo.us' effects.js library");
}
var Autocompleter={};
Autocompleter.Base=function(){
};
Autocompleter.Base.prototype={baseInitialize:function(_442,_443,_444){
this.element=$(_442);
this.update=$(_443);
this.hasFocus=false;
this.changed=false;
this.active=false;
this.index=0;
this.entryCount=0;
if(this.setOptions){
this.setOptions(_444);
}else{
this.options=_444||{};
}
this.options.paramName=this.options.paramName||this.element.name;
this.options.tokens=this.options.tokens||[];
this.options.frequency=this.options.frequency||0.4;
this.options.minChars=this.options.minChars||1;
this.options.onShow=this.options.onShow||function(_445,_446){
if(!_446.style.position||_446.style.position=="absolute"){
_446.style.position="absolute";
Position.clone(_445,_446,{setHeight:false,offsetTop:_445.offsetHeight});
}
Effect.Appear(_446,{duration:0.15});
};
this.options.onHide=this.options.onHide||function(_447,_448){
new Effect.Fade(_448,{duration:0.15});
};
if(typeof (this.options.tokens)=="string"){
this.options.tokens=new Array(this.options.tokens);
}
this.observer=null;
this.element.setAttribute("autocomplete","off");
Element.hide(this.update);
Event.observe(this.element,"blur",this.onBlur.bindAsEventListener(this));
Event.observe(this.element,"keypress",this.onKeyPress.bindAsEventListener(this));
},show:function(){
if(Element.getStyle(this.update,"display")=="none"){
this.options.onShow(this.element,this.update);
}
if(!this.iefix&&(navigator.appVersion.indexOf("MSIE")>0)&&(navigator.userAgent.indexOf("Opera")<0)&&(Element.getStyle(this.update,"position")=="absolute")){
new Insertion.After(this.update,"<iframe id=\""+this.update.id+"_iefix\" "+"style=\"display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);\" "+"src=\"javascript:false;\" frameborder=\"0\" scrolling=\"no\"></iframe>");
this.iefix=$(this.update.id+"_iefix");
}
if(this.iefix){
setTimeout(this.fixIEOverlapping.bind(this),50);
}
},fixIEOverlapping:function(){
Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});
this.iefix.style.zIndex=1;
this.update.style.zIndex=2;
Element.show(this.iefix);
},hide:function(){
this.stopIndicator();
if(Element.getStyle(this.update,"display")!="none"){
this.options.onHide(this.element,this.update);
}
if(this.iefix){
Element.hide(this.iefix);
}
},startIndicator:function(){
if(this.options.indicator){
Element.show(this.options.indicator);
}
},stopIndicator:function(){
if(this.options.indicator){
Element.hide(this.options.indicator);
}
},onKeyPress:function(_449){
if(this.active){
switch(_449.keyCode){
case Event.KEY_TAB:
case Event.KEY_RETURN:
this.selectEntry();
Event.stop(_449);
case Event.KEY_ESC:
this.hide();
this.active=false;
Event.stop(_449);
return;
case Event.KEY_LEFT:
case Event.KEY_RIGHT:
return;
case Event.KEY_UP:
this.markPrevious();
this.render();
if(navigator.appVersion.indexOf("AppleWebKit")>0){
Event.stop(_449);
}
return;
case Event.KEY_DOWN:
this.markNext();
this.render();
if(navigator.appVersion.indexOf("AppleWebKit")>0){
Event.stop(_449);
}
return;
}
}else{
if(_449.keyCode==Event.KEY_TAB||_449.keyCode==Event.KEY_RETURN||(navigator.appVersion.indexOf("AppleWebKit")>0&&_449.keyCode==0)){
return;
}
}
this.changed=true;
this.hasFocus=true;
if(this.observer){
clearTimeout(this.observer);
}
this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000);
},activate:function(){
this.changed=false;
this.hasFocus=true;
this.getUpdatedChoices();
},onHover:function(_44a){
var _44b=Event.findElement(_44a,"LI");
if(this.index!=_44b.autocompleteIndex){
this.index=_44b.autocompleteIndex;
this.render();
}
Event.stop(_44a);
},onClick:function(_44c){
var _44d=Event.findElement(_44c,"LI");
this.index=_44d.autocompleteIndex;
this.selectEntry();
this.hide();
},onBlur:function(_44e){
setTimeout(this.hide.bind(this),250);
this.hasFocus=false;
this.active=false;
},render:function(){
if(this.entryCount>0){
for(var i=0;i<this.entryCount;i++){
this.index==i?Element.addClassName(this.getEntry(i),"selected"):Element.removeClassName(this.getEntry(i),"selected");
}
if(this.hasFocus){
this.show();
this.active=true;
}
}else{
this.active=false;
this.hide();
}
},markPrevious:function(){
if(this.index>0){
this.index--;
}else{
this.index=this.entryCount-1;
}
this.getEntry(this.index).scrollIntoView(true);
},markNext:function(){
if(this.index<this.entryCount-1){
this.index++;
}else{
this.index=0;
}
this.getEntry(this.index).scrollIntoView(false);
},getEntry:function(_450){
return this.update.firstChild.childNodes[_450];
},getCurrentEntry:function(){
return this.getEntry(this.index);
},selectEntry:function(){
this.active=false;
this.updateElement(this.getCurrentEntry());
},updateElement:function(_451){
if(this.options.updateElement){
this.options.updateElement(_451);
return;
}
var _452="";
if(this.options.select){
var _453=document.getElementsByClassName(this.options.select,_451)||[];
if(_453.length>0){
_452=Element.collectTextNodes(_453[0],this.options.select);
}
}else{
_452=Element.collectTextNodesIgnoreClass(_451,"informal");
}
var _454=this.findLastToken();
if(_454!=-1){
var _455=this.element.value.substr(0,_454+1);
var _456=this.element.value.substr(_454+1).match(/^\s+/);
if(_456){
_455+=_456[0];
}
this.element.value=_455+_452;
}else{
this.element.value=_452;
}
this.element.focus();
if(this.options.afterUpdateElement){
this.options.afterUpdateElement(this.element,_451);
}
},updateChoices:function(_457){
if(!this.changed&&this.hasFocus){
this.update.innerHTML=_457;
Element.cleanWhitespace(this.update);
Element.cleanWhitespace(this.update.down());
if(this.update.firstChild&&this.update.down().childNodes){
this.entryCount=this.update.down().childNodes.length;
for(var i=0;i<this.entryCount;i++){
var _459=this.getEntry(i);
_459.autocompleteIndex=i;
this.addObservers(_459);
}
}else{
this.entryCount=0;
}
this.stopIndicator();
this.index=0;
if(this.entryCount==1&&this.options.autoSelect){
this.selectEntry();
this.hide();
}else{
this.render();
}
}
},addObservers:function(_45a){
Event.observe(_45a,"mouseover",this.onHover.bindAsEventListener(this));
Event.observe(_45a,"click",this.onClick.bindAsEventListener(this));
},onObserverEvent:function(){
this.changed=false;
if(this.getToken().length>=this.options.minChars){
this.startIndicator();
this.getUpdatedChoices();
}else{
this.active=false;
this.hide();
}
},getToken:function(){
var _45b=this.findLastToken();
if(_45b!=-1){
var ret=this.element.value.substr(_45b+1).replace(/^\s+/,"").replace(/\s+$/,"");
}else{
var ret=this.element.value;
}
return /\n/.test(ret)?"":ret;
},findLastToken:function(){
var _45d=-1;
for(var i=0;i<this.options.tokens.length;i++){
var _45f=this.element.value.lastIndexOf(this.options.tokens[i]);
if(_45f>_45d){
_45d=_45f;
}
}
return _45d;
}};
Ajax.Autocompleter=Class.create();
Object.extend(Object.extend(Ajax.Autocompleter.prototype,Autocompleter.Base.prototype),{initialize:function(_460,_461,url,_463){
this.baseInitialize(_460,_461,_463);
this.options.asynchronous=true;
this.options.onComplete=this.onComplete.bind(this);
this.options.defaultParams=this.options.parameters||null;
this.url=url;
},getUpdatedChoices:function(){
entry=encodeURIComponent(this.options.paramName)+"="+encodeURIComponent(this.getToken());
this.options.parameters=this.options.callback?this.options.callback(this.element,entry):entry;
if(this.options.defaultParams){
this.options.parameters+="&"+this.options.defaultParams;
}
new Ajax.Request(this.url,this.options);
},onComplete:function(_464){
this.updateChoices(_464.responseText);
}});
Autocompleter.Local=Class.create();
Autocompleter.Local.prototype=Object.extend(new Autocompleter.Base(),{initialize:function(_465,_466,_467,_468){
this.baseInitialize(_465,_466,_468);
this.options.array=_467;
},getUpdatedChoices:function(){
this.updateChoices(this.options.selector(this));
},setOptions:function(_469){
this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(_46a){
var ret=[];
var _46c=[];
var _46d=_46a.getToken();
var _46e=0;
for(var i=0;i<_46a.options.array.length&&ret.length<_46a.options.choices;i++){
var elem=_46a.options.array[i];
var _471=_46a.options.ignoreCase?elem.toLowerCase().indexOf(_46d.toLowerCase()):elem.indexOf(_46d);
while(_471!=-1){
if(_471==0&&elem.length!=_46d.length){
ret.push("<li><strong>"+elem.substr(0,_46d.length)+"</strong>"+elem.substr(_46d.length)+"</li>");
break;
}else{
if(_46d.length>=_46a.options.partialChars&&_46a.options.partialSearch&&_471!=-1){
if(_46a.options.fullSearch||/\s/.test(elem.substr(_471-1,1))){
_46c.push("<li>"+elem.substr(0,_471)+"<strong>"+elem.substr(_471,_46d.length)+"</strong>"+elem.substr(_471+_46d.length)+"</li>");
break;
}
}
}
_471=_46a.options.ignoreCase?elem.toLowerCase().indexOf(_46d.toLowerCase(),_471+1):elem.indexOf(_46d,_471+1);
}
}
if(_46c.length){
ret=ret.concat(_46c.slice(0,_46a.options.choices-ret.length));
}
return "<ul>"+ret.join("")+"</ul>";
}},_469||{});
}});
Field.scrollFreeActivate=function(_472){
setTimeout(function(){
Field.activate(_472);
},1);
};
Ajax.InPlaceEditor=Class.create();
Ajax.InPlaceEditor.defaultHighlightColor="#FFFF99";
Ajax.InPlaceEditor.prototype={initialize:function(_473,url,_475){
this.url=url;
this.element=$(_473);
this.options=Object.extend({paramName:"value",okButton:true,okText:"ok",cancelLink:true,cancelText:"cancel",savingText:"Saving...",clickToEditText:"Click to edit",okText:"ok",rows:1,onComplete:function(_476,_477){
new Effect.Highlight(_477,{startcolor:this.options.highlightcolor});
},onFailure:function(_478){
alert("Error communicating with the server: "+_478.responseText.stripTags());
},callback:function(form){
return Form.serialize(form);
},handleLineBreaks:true,loadingText:"Loading...",savingClassName:"inplaceeditor-saving",loadingClassName:"inplaceeditor-loading",formClassName:"inplaceeditor-form",highlightcolor:Ajax.InPlaceEditor.defaultHighlightColor,highlightendcolor:"#FFFFFF",externalControl:null,submitOnBlur:false,ajaxOptions:{},evalScripts:false},_475||{});
if(!this.options.formId&&this.element.id){
this.options.formId=this.element.id+"-inplaceeditor";
if($(this.options.formId)){
this.options.formId=null;
}
}
if(this.options.externalControl){
this.options.externalControl=$(this.options.externalControl);
}
this.originalBackground=Element.getStyle(this.element,"background-color");
if(!this.originalBackground){
this.originalBackground="transparent";
}
this.element.title=this.options.clickToEditText;
this.onclickListener=this.enterEditMode.bindAsEventListener(this);
this.mouseoverListener=this.enterHover.bindAsEventListener(this);
this.mouseoutListener=this.leaveHover.bindAsEventListener(this);
Event.observe(this.element,"click",this.onclickListener);
Event.observe(this.element,"mouseover",this.mouseoverListener);
Event.observe(this.element,"mouseout",this.mouseoutListener);
if(this.options.externalControl){
Event.observe(this.options.externalControl,"click",this.onclickListener);
Event.observe(this.options.externalControl,"mouseover",this.mouseoverListener);
Event.observe(this.options.externalControl,"mouseout",this.mouseoutListener);
}
},enterEditMode:function(evt){
if(this.saving){
return;
}
if(this.editing){
return;
}
this.editing=true;
this.onEnterEditMode();
if(this.options.externalControl){
Element.hide(this.options.externalControl);
}
Element.hide(this.element);
this.createForm();
this.element.parentNode.insertBefore(this.form,this.element);
if(!this.options.loadTextURL){
Field.scrollFreeActivate(this.editField);
}
if(evt){
Event.stop(evt);
}
return false;
},createForm:function(){
this.form=document.createElement("form");
this.form.id=this.options.formId;
Element.addClassName(this.form,this.options.formClassName);
this.form.onsubmit=this.onSubmit.bind(this);
this.createEditField();
if(this.options.textarea){
var br=document.createElement("br");
this.form.appendChild(br);
}
if(this.options.okButton){
okButton=document.createElement("input");
okButton.type="submit";
okButton.value=this.options.okText;
okButton.className="editor_ok_button";
this.form.appendChild(okButton);
}
if(this.options.cancelLink){
cancelLink=document.createElement("a");
cancelLink.href="#";
cancelLink.appendChild(document.createTextNode(this.options.cancelText));
cancelLink.onclick=this.onclickCancel.bind(this);
cancelLink.className="editor_cancel";
this.form.appendChild(cancelLink);
}
},hasHTMLLineBreaks:function(_47c){
if(!this.options.handleLineBreaks){
return false;
}
return _47c.match(/<br/i)||_47c.match(/<p>/i);
},convertHTMLLineBreaks:function(_47d){
return _47d.replace(/<br>/gi,"\n").replace(/<br\/>/gi,"\n").replace(/<\/p>/gi,"\n").replace(/<p>/gi,"");
},createEditField:function(){
var text;
if(this.options.loadTextURL){
text=this.options.loadingText;
}else{
text=this.getText();
}
var obj=this;
if(this.options.rows==1&&!this.hasHTMLLineBreaks(text)){
this.options.textarea=false;
var _480=document.createElement("input");
_480.obj=this;
_480.type="text";
_480.name=this.options.paramName;
_480.value=text;
_480.style.backgroundColor=this.options.highlightcolor;
_480.className="editor_field";
var size=this.options.size||this.options.cols||0;
if(size!=0){
_480.size=size;
}
if(this.options.submitOnBlur){
_480.onblur=this.onSubmit.bind(this);
}
this.editField=_480;
}else{
this.options.textarea=true;
var _482=document.createElement("textarea");
_482.obj=this;
_482.name=this.options.paramName;
_482.value=this.convertHTMLLineBreaks(text);
_482.rows=this.options.rows;
_482.cols=this.options.cols||40;
_482.className="editor_field";
if(this.options.submitOnBlur){
_482.onblur=this.onSubmit.bind(this);
}
this.editField=_482;
}
if(this.options.loadTextURL){
this.loadExternalText();
}
this.form.appendChild(this.editField);
},getText:function(){
return this.element.innerHTML;
},loadExternalText:function(){
Element.addClassName(this.form,this.options.loadingClassName);
this.editField.disabled=true;
new Ajax.Request(this.options.loadTextURL,Object.extend({asynchronous:true,onComplete:this.onLoadedExternalText.bind(this)},this.options.ajaxOptions));
},onLoadedExternalText:function(_483){
Element.removeClassName(this.form,this.options.loadingClassName);
this.editField.disabled=false;
this.editField.value=_483.responseText.stripTags();
Field.scrollFreeActivate(this.editField);
},onclickCancel:function(){
this.onComplete();
this.leaveEditMode();
return false;
},onFailure:function(_484){
this.options.onFailure(_484);
if(this.oldInnerHTML){
this.element.innerHTML=this.oldInnerHTML;
this.oldInnerHTML=null;
}
return false;
},onSubmit:function(){
var form=this.form;
var _486=this.editField.value;
this.onLoading();
if(this.options.evalScripts){
new Ajax.Request(this.url,Object.extend({parameters:this.options.callback(form,_486),onComplete:this.onComplete.bind(this),onFailure:this.onFailure.bind(this),asynchronous:true,evalScripts:true},this.options.ajaxOptions));
}else{
new Ajax.Updater({success:this.element,failure:null},this.url,Object.extend({parameters:this.options.callback(form,_486),onComplete:this.onComplete.bind(this),onFailure:this.onFailure.bind(this)},this.options.ajaxOptions));
}
if(arguments.length>1){
Event.stop(arguments[0]);
}
return false;
},onLoading:function(){
this.saving=true;
this.removeForm();
this.leaveHover();
this.showSaving();
},showSaving:function(){
this.oldInnerHTML=this.element.innerHTML;
this.element.innerHTML=this.options.savingText;
Element.addClassName(this.element,this.options.savingClassName);
this.element.style.backgroundColor=this.originalBackground;
Element.show(this.element);
},removeForm:function(){
if(this.form){
if(this.form.parentNode){
Element.remove(this.form);
}
this.form=null;
}
},enterHover:function(){
if(this.saving){
return;
}
this.element.style.backgroundColor=this.options.highlightcolor;
if(this.effect){
this.effect.cancel();
}
Element.addClassName(this.element,this.options.hoverClassName);
},leaveHover:function(){
if(this.options.backgroundColor){
this.element.style.backgroundColor=this.oldBackground;
}
Element.removeClassName(this.element,this.options.hoverClassName);
if(this.saving){
return;
}
this.effect=new Effect.Highlight(this.element,{startcolor:this.options.highlightcolor,endcolor:this.options.highlightendcolor,restorecolor:this.originalBackground});
},leaveEditMode:function(){
Element.removeClassName(this.element,this.options.savingClassName);
this.removeForm();
this.leaveHover();
this.element.style.backgroundColor=this.originalBackground;
Element.show(this.element);
if(this.options.externalControl){
Element.show(this.options.externalControl);
}
this.editing=false;
this.saving=false;
this.oldInnerHTML=null;
this.onLeaveEditMode();
},onComplete:function(_487){
this.leaveEditMode();
this.options.onComplete.bind(this)(_487,this.element);
},onEnterEditMode:function(){
},onLeaveEditMode:function(){
},dispose:function(){
if(this.oldInnerHTML){
this.element.innerHTML=this.oldInnerHTML;
}
this.leaveEditMode();
Event.stopObserving(this.element,"click",this.onclickListener);
Event.stopObserving(this.element,"mouseover",this.mouseoverListener);
Event.stopObserving(this.element,"mouseout",this.mouseoutListener);
if(this.options.externalControl){
Event.stopObserving(this.options.externalControl,"click",this.onclickListener);
Event.stopObserving(this.options.externalControl,"mouseover",this.mouseoverListener);
Event.stopObserving(this.options.externalControl,"mouseout",this.mouseoutListener);
}
}};
Ajax.InPlaceCollectionEditor=Class.create();
Object.extend(Ajax.InPlaceCollectionEditor.prototype,Ajax.InPlaceEditor.prototype);
Object.extend(Ajax.InPlaceCollectionEditor.prototype,{createEditField:function(){
if(!this.cached_selectTag){
var _488=document.createElement("select");
var _489=this.options.collection||[];
var _48a;
_489.each(function(e,i){
_48a=document.createElement("option");
_48a.value=(e instanceof Array)?e[0]:e;
if((typeof this.options.value=="undefined")&&((e instanceof Array)?this.element.innerHTML==e[1]:e==_48a.value)){
_48a.selected=true;
}
if(this.options.value==_48a.value){
_48a.selected=true;
}
_48a.appendChild(document.createTextNode((e instanceof Array)?e[1]:e));
_488.appendChild(_48a);
}.bind(this));
this.cached_selectTag=_488;
}
this.editField=this.cached_selectTag;
if(this.options.loadTextURL){
this.loadExternalText();
}
this.form.appendChild(this.editField);
this.options.callback=function(form,_48e){
return "value="+encodeURIComponent(_48e);
};
}});
Form.Element.DelayedObserver=Class.create();
Form.Element.DelayedObserver.prototype={initialize:function(_48f,_490,_491){
this.delay=_490||0.5;
this.element=$(_48f);
this.callback=_491;
this.timer=null;
this.lastValue=$F(this.element);
Event.observe(this.element,"keyup",this.delayedListener.bindAsEventListener(this));
},delayedListener:function(_492){
if(this.lastValue==$F(this.element)){
return;
}
if(this.timer){
clearTimeout(this.timer);
}
this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);
this.lastValue=$F(this.element);
},onTimerEvent:function(){
this.timer=null;
this.callback(this.element,$F(this.element));
}};
Wagn=new Object();
function warn(_493){
if(typeof (console)!="undefined"){
console.log(_493);
}
}
Wagn.CardTable=$H({});
Object.extend(Wagn.CardTable,{get:function(key){
return this[key];
}});
Wagn.Dummy=Class.create();
Wagn.Dummy.prototype={initialize:function(num){
this.number=num;
}};
var Cookie={set:function(name,_497,_498){
var _499="";
if(_498!=undefined){
var d=new Date();
d.setTime(d.getTime()+(86400000*parseFloat(_498)));
_499="; expires="+d.toGMTString();
}
return (document.cookie=escape(name)+"="+escape(_497||"")+_499);
},get:function(name){
var _49c=document.cookie.match(new RegExp("(^|;)\\s*"+escape(name)+"=([^;\\s]*)"));
return (_49c?unescape(_49c[2]):null);
},erase:function(name){
var _49e=Cookie.get(name)||true;
Cookie.set(name,"",-1);
return _49e;
},accept:function(){
if(typeof navigator.cookieEnabled=="boolean"){
return navigator.cookieEnabled;
}
Cookie.set("_test","1");
return (Cookie.erase("_test")==="1");
}};
Wagn.Messenger={element:function(){
return $("alerts");
},alert:function(_49f){
this.element().innerHTML="<span style=\"color:red; font-weight: bold\">"+_49f+"</span>";
new Effect.Highlight(this.element(),{startcolor:"#ffff00",endcolor:"#ffffaa",restorecolor:"#ffffaa",duration:1});
},note:function(_4a0){
this.element().innerHTML=_4a0;
new Effect.Highlight(this.element(),{startcolor:"#ffff00",endcolor:"#ffffaa",restorecolor:"#ffffaa",duration:1});
},log:function(_4a1){
this.element().innerHTML=_4a1;
new Effect.Highlight(this.element(),{startcolor:"#dddddd",endcolor:"#ffffaa",restorecolor:"#ffffaa",duration:1});
},flash:function(){
flash=$("notice").innerHTML+$("error").innerHTML;
if(flash!=""){
this.alert(flash);
}
}};
function openInNewWindow(){
var _4a2=window.open(this.getAttribute("href"),"_blank");
_4a2.focus();
return false;
}
function getNewWindowLinks(){
if(document.getElementById&&document.createElement&&document.appendChild){
var link;
var _4a4=document.getElementsByTagName("a");
for(var i=0;i<_4a4.length;i++){
link=_4a4[i];
if(/\bexternal\b/.exec(link.className)){
link.onclick=openInNewWindow;
}
}
objWarningText=null;
}
}
var DEBUGGING=false;
function copy_with_classes(_4a6){
copy=document.createElement("span");
copy.innerHTML=_4a6.innerHTML;
Element.classNames(_4a6).each(function(_4a7){
Element.addClassName(copy,_4a7);
});
copy.hide();
_4a6.parentNode.insertBefore(copy,_4a6);
return copy;
}
Object.extend(Wagn,{user:function(){
return $("user");
},card:function(){
return Wagn.Card;
},lister:function(){
return Wagn._lister;
},messenger:function(){
return Wagn.Messenger;
},cardTable:function(){
return Wagn.CardTable;
},title_mouseover:function(_4a8){
document.getElementsByClassName(_4a8).each(function(elem){
Element.addClassName(elem,"card-highlight");
Element.removeClassName(elem,"card");
});
},title_mouseout:function(_4aa){
document.getElementsByClassName(_4aa).each(function(elem){
Element.removeClassName(elem,"card-highlight");
Element.addClassName(elem,"card");
});
},grow_line:function(_4ac){
var _4ad=Element.getDimensions(_4ac);
new Effect.BlindDown(_4ac,{duration:0.5,scaleFrom:100,scaleMode:{originalHeight:_4ad.height*2,originalWidth:_4ad.width}});
},line_to_paragraph:function(_4ae){
if(!Prototype.Browser.WebKit){
var _4af=Element.getDimensions(_4ae);
copy=copy_with_classes(_4ae);
copy.removeClassName("line");
copy.addClassName("paragraph");
var _4b0=Element.getDimensions(copy);
copy.viewHeight=_4b0.height;
copy.remove();
var _4b1=100*_4af.height/_4b0.height;
var _4b2=_4b0;
new Effect.BlindDown(_4ae,{duration:0.3,scaleFrom:_4b1,scaleMode:{originalHeight:_4b2.height,originalWidth:_4b2.width},afterSetup:function(_4b3){
_4b3.element.makeClipping();
_4b3.element.setStyle({height:"0px"});
_4b3.element.show();
_4b3.element.removeClassName("line");
_4b3.element.addClassName("paragraph");
}});
}else{
Element.removeClassName(_4ae,"line");
Element.addClassName(_4ae,"paragraph");
}
},paragraph_to_line:function(_4b4){
if(!Prototype.Browser.WebKit){
var _4b5=Element.getDimensions(_4b4);
copy=copy_with_classes(_4b4);
copy.removeClassName("paragraph");
copy.addClassName("line");
var _4b6=Element.getDimensions(copy);
copy.remove();
var _4b7=100*_4b6.height/_4b5.height;
return new Effect.Scale(_4b4,_4b7,{duration:0.3,scaleContent:false,scaleX:false,scaleFrom:100,scaleMode:{originalHeight:_4b5.height,originalWidth:_4b5.width},restoreAfterFinish:true,afterSetup:function(_4b8){
_4b8.element.makeClipping();
_4b8.element.setStyle({height:"0px"});
_4b8.element.show();
},afterFinishInternal:function(_4b9){
_4b9.element.undoClipping();
_4b9.element.removeClassName("paragraph");
_4b9.element.addClassName("line");
}});
}else{
Element.removeClassName(_4b4,"paragraph");
Element.addClassName(_4b4,"line");
}
}});
Wagn.highlight=function(_4ba,id){
document.getElementsByClassName(_4ba).each(function(elem){
Element.removeClassName(elem.id,"current");
});
Element.addClassName(_4ba+"-"+id,"current");
};
Wagn.runQueue=function(_4bd){
if(typeof (_4bd)=="undefined"){
return true;
}
result=true;
while(fn=_4bd.shift()){
if(!fn.call()){
result=false;
}
}
return result;
};
Wagn.onLoadQueue=$A([]);
Wagn.onSaveQueue=$H({});
Wagn.onCancelQueue=$H({});
Wagn.editors=$H({});
onload=function(){
Wagn.Messenger.flash();
Wagn.runQueue(Wagn.onLoadQueue);
setupCardViewStuff();
getNewWindowLinks();
setupDoubleClickToEdit();
if(typeof (init_lister)!="undefined"){
Wagn._lister=init_lister();
Wagn._lister.update();
}
};
setupCardViewStuff=function(){
getNewWindowLinks();
setupDoubleClickToEdit();
};
setupDoubleClickToEdit=function(_4be){
Element.getElementsByClassName(document,"createOnClick").each(function(el){
el.onclick=function(_4c0){
element=Event.element(_4c0);
card_name=getSlotSpan(element).attributes["cardname"].value;
new Ajax.Request("/transclusion/create?context="+getSlotContext(element),{asynchronous:true,evalScripts:true,parameters:"card[name]="+encodeURIComponent(card_name)});
Event.stop(_4c0);
};
});
Element.getElementsByClassName(document,"editOnDoubleClick").each(function(el){
el.ondblclick=function(_4c2){
element=Event.element(_4c2);
span=getSlotSpan(element);
card_id=span.attributes["cardid"].value;
if(span.hasClassName("line")){
new Ajax.Request("/card/to_edit/"+card_id+"?context="+getSlotContext(element),{asynchronous:true,evalScripts:true});
}else{
if(span.hasClassName("paragraph")){
new Ajax.Updater({success:span,failure:getNextElement(span,"notice")},"/card/edit/"+card_id+"?context="+getSlotContext(element),{asynchronous:true,evalScripts:true});
}else{
new Ajax.Updater({success:span,failure:getNextElement(span,"notice")},"/transclusion/edit/"+card_id+"?context="+getSlotContext(element),{asynchronous:true,evalScripts:true});
}
}
Event.stop(_4c2);
};
});
};
getOuterSlot=function(_4c3){
var span=getSlotSpan(_4c3);
if(span){
outer=getOuterSlot(span.parentNode);
if(outer){
return outer;
}else{
return span;
}
}else{
return null;
}
};
getSlotElement=function(_4c5,name){
var span=getSlotSpan(_4c5);
return $A(document.getElementsByClassName(name,span)).reject(function(x){
return getSlotSpan(x)!=span;
})[0];
};
getNextElement=function(_4c9,name){
var span=null;
if(span=getSlotSpan(_4c9)){
if(e=$A(document.getElementsByClassName(name,span))[0]){
return e;
}else{
return getNextElement(span.parentNode,name);
}
}else{
return null;
}
};
getSlotContext=function(_4cc){
var span=null;
if(span=getSlotSpan(_4cc)){
var _4ce=span.attributes["position"].value;
parentContext=getSlotContext(span.parentNode);
return parentContext+":"+_4ce;
}else{
return getOuterContext(_4cc);
}
};
getOuterContext=function(_4cf){
if(typeof (_4cf["attributes"])!="undefined"&&_4cf.attributes!=null&&typeof (_4cf.attributes["context"])!="undefined"){
return _4cf.attributes["context"].value;
}else{
if(_4cf.parentNode){
return getOuterContext(_4cf.parentNode);
}else{
warn("Failed to get Outer Context");
return "page";
}
}
};
getSlotSpan=function(_4d0){
if(typeof (_4d0["attributes"])!="undefined"&&_4d0.attributes!=null&&typeof (_4d0.attributes["position"])!="undefined"){
return _4d0;
}else{
if(_4d0.parentNode){
return getSlotSpan(_4d0.parentNode);
}else{
return false;
}
}
};
Subclass=function(_4d1,_4d2){
if(!_4d1){
throw ("Can't create a subclass without a name");
}
var _4d3=_4d1.split(".");
var _4d4=window;
for(var i=0;i<_4d3.length;i++){
if(!_4d4[_4d3[i]]){
_4d4[_4d3[i]]=function(){
};
}
_4d4=_4d4[_4d3[i]];
}
if(_4d2){
var _4d6=eval("new "+_4d2+"()");
_4d4.prototype=_4d6;
_4d4.prototype.baseclass=_4d6;
}
_4d4.prototype.classname=_4d1;
return _4d4.prototype;
};
proto=new Subclass("Wikiwyg");
Wikiwyg.VERSION="0.13";
Wikiwyg.ua=navigator.userAgent.toLowerCase();
Wikiwyg.is_ie=(Wikiwyg.ua.indexOf("msie")!=-1&&Wikiwyg.ua.indexOf("opera")==-1&&Wikiwyg.ua.indexOf("webtv")==-1);
Wikiwyg.is_gecko=(Wikiwyg.ua.indexOf("gecko")!=-1&&Wikiwyg.ua.indexOf("safari")==-1&&Wikiwyg.ua.indexOf("konqueror")==-1);
Wikiwyg.is_safari=(Wikiwyg.ua.indexOf("safari")!=-1);
Wikiwyg.is_opera=(Wikiwyg.ua.indexOf("opera")!=-1);
Wikiwyg.is_konqueror=(Wikiwyg.ua.indexOf("konqueror")!=-1);
Wikiwyg.browserIsSupported=(Wikiwyg.is_gecko||Wikiwyg.is_ie);
proto.createWikiwygArea=function(div,_4d8){
this.set_config(_4d8);
this.initializeObject(div,_4d8);
};
proto.default_config={javascriptLocation:"lib/",doubleClickToEdit:false,toolbarClass:"Wikiwyg.Toolbar",firstMode:null,modeClasses:["Wikiwyg.Wysiwyg","Wikiwyg.Wikitext","Wikiwyg.Preview"]};
proto.initializeObject=function(div,_4da){
if(!Wikiwyg.browserIsSupported){
return;
}
if(this.enabled){
return;
}
this.enabled=true;
this.div=div;
this.divHeight=this.div.offsetHeight;
if(!_4da){
_4da={};
}
this.set_config(_4da);
this.mode_objects={};
for(var i=0;i<this.config.modeClasses.length;i++){
var _4dc=this.config.modeClasses[i];
var _4dd=eval("new "+_4dc+"()");
_4dd.wikiwyg=this;
_4dd.set_config(_4da[_4dd.classtype]);
_4dd.initializeObject();
this.mode_objects[_4dc]=_4dd;
}
var _4de=this.config.firstMode?this.config.firstMode:this.config.modeClasses[0];
this.setFirstModeByName(_4de);
if(this.config.toolbarClass){
var _4dc=this.config.toolbarClass;
this.toolbarObject=eval("new "+_4dc+"()");
this.toolbarObject.wikiwyg=this;
this.toolbarObject.set_config(_4da.toolbar);
this.toolbarObject.initializeObject();
this.placeToolbar(this.toolbarObject.div);
}
for(var i=0;i<this.config.modeClasses.length;i++){
var _4df=this.config.modeClasses[i];
var _4dd=this.modeByName(_4df);
this.insert_div_before(_4dd.div);
}
if(this.config.doubleClickToEdit){
var self=this;
this.div.ondblclick=function(){
self.editMode();
};
}
};
proto.set_config=function(_4e1){
var _4e2={};
var keys=[];
for(var key in this.default_config){
keys.push(key);
}
if(_4e1!=null){
for(var key in _4e1){
keys.push(key);
}
}
for(var ii=0;ii<keys.length;ii++){
var key=keys[ii];
if(_4e1!=null&&_4e1[key]!=null){
_4e2[key]=_4e1[key];
}else{
if(this.default_config[key]!=null){
_4e2[key]=this.default_config[key];
}else{
if(this[key]!=null){
_4e2[key]=this[key];
}
}
}
}
this.config=_4e2;
};
proto.insert_div_before=function(div){
div.style.display="none";
if(!div.iframe_hack){
this.div.parentNode.insertBefore(div,this.div);
}
};
proto.saveChanges=function(){
alert("Wikiwyg.prototype.saveChanges not subclassed");
};
proto.editMode=function(){
this.current_mode=this.first_mode;
this.current_mode.fromHtml(this.div.innerHTML);
this.toolbarObject.resetModeSelector();
this.current_mode.enableThis();
};
proto.displayMode=function(){
for(var i=0;i<this.config.modeClasses.length;i++){
var _4e8=this.config.modeClasses[i];
var _4e9=this.modeByName(_4e8);
_4e9.disableThis();
}
this.toolbarObject.disableThis();
this.div.style.display="block";
this.divHeight=this.div.offsetHeight;
};
proto.switchMode=function(_4ea){
var _4eb=this.modeByName(_4ea);
var _4ec=this.current_mode;
var self=this;
_4eb.enableStarted();
_4ec.disableStarted();
_4ec.toHtml(function(html){
self.previous_mode=_4ec;
_4eb.fromHtml(html);
_4ec.disableThis();
_4eb.enableThis();
_4eb.enableFinished();
_4ec.disableFinished();
self.current_mode=_4eb;
});
};
proto.modeByName=function(_4ef){
return this.mode_objects[_4ef];
};
proto.cancelEdit=function(){
this.displayMode();
};
proto.fromHtml=function(html){
this.div.innerHTML=html;
};
proto.placeToolbar=function(div){
this.insert_div_before(div);
};
proto.setFirstModeByName=function(_4f2){
if(!this.modeByName(_4f2)){
die("No mode named "+_4f2);
}
this.first_mode=this.modeByName(_4f2);
};
Wikiwyg.unique_id_base=0;
Wikiwyg.createUniqueId=function(){
return "wikiwyg_"+Wikiwyg.unique_id_base++;
};
Wikiwyg.liveUpdate=function(_4f3,url,_4f5,_4f6){
if(_4f3=="GET"){
return Ajax.get(url+"?"+_4f5,_4f6);
}
if(_4f3=="POST"){
return Ajax.post(url,_4f5,_4f6);
}
throw ("Bad method: "+_4f3+" passed to Wikiwyg.liveUpdate");
};
Wikiwyg.htmlUnescape=function(_4f7){
return _4f7.replace(/&(.*?);/g,function(_4f8,s){
return s.match(/^amp$/i)?"&":s.match(/^quot$/i)?"\"":s.match(/^gt$/i)?">":s.match(/^lt$/i)?"<":s.match(/^#(\d+)$/)?String.fromCharCode(s.replace(/#/,"")):s.match(/^#x([0-9a-f]+)$/i)?String.fromCharCode(s.replace(/#/,"0")):s;
});
};
Wikiwyg.showById=function(id){
document.getElementById(id).style.visibility="inherit";
};
Wikiwyg.hideById=function(id){
document.getElementById(id).style.visibility="hidden";
};
Wikiwyg.changeLinksMatching=function(_4fc,_4fd,func){
var _4ff=document.getElementsByTagName("a");
for(var i=0;i<_4ff.length;i++){
var link=_4ff[i];
var _502=link.getAttribute(_4fc);
if(_502&&_502.match(_4fd)){
link.setAttribute("href","#");
link.onclick=func;
}
}
};
Wikiwyg.createElementWithAttrs=function(_503,_504,doc){
if(doc==null){
doc=document;
}
return Wikiwyg.create_element_with_attrs(_503,_504,doc);
};
Wikiwyg.create_element_with_attrs=function(_506,_507,doc){
var elem=doc.createElement(_506);
for(name in _507){
elem.setAttribute(name,_507[name]);
}
return elem;
};
die=function(e){
throw (e);
};
String.prototype.times=function(n){
return n?this+this.times(n-1):"";
};
String.prototype.ucFirst=function(){
return this.substr(0,1).toUpperCase()+this.substr(1,this.length);
};
proto=new Subclass("Wikiwyg.Base");
proto.set_config=function(_50c){
for(var key in this.config){
if(_50c!=null&&_50c[key]!=null){
this.merge_config(key,_50c[key]);
}else{
if(this[key]!=null){
this.merge_config(key,this[key]);
}else{
if(this.wikiwyg.config[key]!=null){
this.merge_config(key,this.wikiwyg.config[key]);
}
}
}
}
};
proto.merge_config=function(key,_50f){
if(_50f instanceof Array){
this.config[key]=_50f;
}else{
if(typeof _50f.test=="function"){
this.config[key]=_50f;
}else{
if(_50f instanceof Object){
if(!this.config[key]){
this.config[key]={};
}
for(var _510 in _50f){
this.config[key][_510]=_50f[_510];
}
}else{
this.config[key]=_50f;
}
}
}
};
proto=new Subclass("Wikiwyg.Mode","Wikiwyg.Base");
proto.enableThis=function(){
this.div.style.display="block";
this.display_unsupported_toolbar_buttons("none");
this.wikiwyg.toolbarObject.enableThis();
this.wikiwyg.div.style.display="none";
};
proto.display_unsupported_toolbar_buttons=function(_511){
if(!this.config){
return;
}
var _512=this.config.disabledToolbarButtons;
if(!_512||_512.length<1){
return;
}
var _513=this.wikiwyg.toolbarObject.div;
var _514=_513.childNodes;
for(var i in _512){
var _516=_512[i];
for(var i in _514){
var _517=_514[i];
var src=_517.src;
if(!src){
continue;
}
if(src.match(_516)){
_517.style.display=_511;
break;
}
}
}
};
proto.enableStarted=function(){
};
proto.enableFinished=function(){
};
proto.disableStarted=function(){
};
proto.disableFinished=function(){
};
proto.disableThis=function(){
this.display_unsupported_toolbar_buttons("inline");
this.div.style.display="none";
};
proto.process_command=function(_519){
if(this["do_"+_519]){
this["do_"+_519](_519);
}
};
proto.enable_keybindings=function(){
if(!this.key_press_function){
this.key_press_function=this.get_key_press_function();
this.get_keybinding_area().addEventListener("keypress",this.key_press_function,true);
}
};
proto.get_key_press_function=function(){
var self=this;
return function(e){
if(!e.ctrlKey){
return;
}
var key=String.fromCharCode(e.charCode).toLowerCase();
var _51d="";
switch(key){
case "b":
_51d="bold";
break;
case "i":
_51d="italic";
break;
case "u":
_51d="underline";
break;
case "d":
_51d="strike";
break;
case "l":
_51d="link";
break;
}
if(_51d){
e.preventDefault();
e.stopPropagation();
self.process_command(_51d);
}
};
};
proto.get_edit_height=function(){
var _51e=parseInt(this.wikiwyg.divHeight*this.config.editHeightAdjustment);
var min=this.config.editHeightMinimum;
return _51e<min?min:_51e;
};
proto.setHeightOf=function(elem){
elem.height=this.get_edit_height()+"px";
};
proto.sanitize_dom=function(dom){
this.element_transforms(dom,{del:{name:"strike",attr:{}},strong:{name:"span",attr:{style:"font-weight: bold;"}},em:{name:"span",attr:{style:"font-style: italic;"}}});
};
proto.element_transforms=function(dom,_523){
for(var orig in _523){
var _525=dom.getElementsByTagName(orig);
if(_525.length==0){
continue;
}
for(var i=0;i<_525.length;i++){
var elem=_525[i];
var _528=_523[orig];
var _529=Wikiwyg.createElementWithAttrs(_528.name,_528.attr);
_529.innerHTML=elem.innerHTML;
elem.parentNode.replaceChild(_529,elem);
}
}
};
if(Wikiwyg.is_ie){
Wikiwyg.create_element_with_attrs=function(_52a,_52b,doc){
var str="";
for(name in _52b){
str+=" "+name+"=\""+_52b[name]+"\"";
}
return doc.createElement("<"+_52a+str+">");
};
die=function(e){
alert(e);
throw (e);
};
proto=Wikiwyg.Mode.prototype;
proto.enable_keybindings=function(){
};
proto.sanitize_dom=function(dom){
this.element_transforms(dom,{del:{name:"strike",attr:{}}});
};
}
proto=new Subclass("Wikiwyg.Toolbar","Wikiwyg.Base");
proto.classtype="toolbar";
proto.config={divId:null,imagesLocation:"images/",imagesExtension:".gif",selectorWidth:"100px",controlLayout:["save","cancel","mode_selector","/","h1","h2","h3","h4","p","pre","|","bold","italic","underline","strike","|","link","hr","|","ordered","unordered","|","indent","outdent","|","table","|","help"],styleSelector:["label","p","h1","h2","h3","h4","h5","h6","pre"],controlLabels:{save:"Save",cancel:"Cancel",bold:"Bold (Ctrl+b)",italic:"Italic (Ctrl+i)",underline:"Underline (Ctrl+u)",strike:"Strike Through (Ctrl+d)",hr:"Horizontal Rule",ordered:"Numbered List",unordered:"Bulleted List",indent:"More Indented",outdent:"Less Indented",help:"About Wikiwyg",label:"[Style]",p:"Normal Text",pre:"Preformatted",h1:"Heading 1",h2:"Heading 2",h3:"Heading 3",h4:"Heading 4",h5:"Heading 5",h6:"Heading 6",link:"Create Link",unlink:"Remove Linkedness",table:"Create Table"}};
proto.initializeObject=function(){
if(this.config.divId){
this.div=document.getElementById(this.config.divId);
}else{
this.div=Wikiwyg.createElementWithAttrs("div",{"class":"wikiwyg_toolbar",id:"wikiwyg_toolbar"});
}
var _530=this.config;
for(var i=0;i<_530.controlLayout.length;i++){
var _532=_530.controlLayout[i];
var _533=_530.controlLabels[_532];
if(_532=="save"){
this.addControlItem(_533,"saveChanges");
}else{
if(_532=="cancel"){
this.addControlItem(_533,"cancelEdit");
}else{
if(_532=="mode_selector"){
this.addModeSelector();
}else{
if(_532=="selector"){
this.add_styles();
}else{
if(_532=="help"){
this.add_help_button(_532,_533);
}else{
if(_532=="|"){
this.add_separator();
}else{
if(_532=="/"){
this.add_break();
}else{
this.add_button(_532,_533);
}
}
}
}
}
}
}
}
};
proto.enableThis=function(){
this.div.style.display="block";
};
proto.disableThis=function(){
this.div.style.display="none";
};
proto.make_button=function(type,_535){
var base=this.config.imagesLocation;
var ext=this.config.imagesExtension;
return Wikiwyg.createElementWithAttrs("img",{"class":"wikiwyg_button",onmouseup:"this.style.border='1px outset';",onmouseover:"this.style.border='1px outset';",onmouseout:"this.style.borderColor=this.style.backgroundColor;"+"this.style.borderStyle='solid';",onmousedown:"this.style.border='1px inset';",alt:_535,title:_535,src:base+type+ext});
};
proto.add_button=function(type,_539){
var img=this.make_button(type,_539);
var self=this;
img.onclick=function(){
self.wikiwyg.current_mode.process_command(type);
};
this.div.appendChild(img);
};
proto.add_help_button=function(type,_53d){
var img=this.make_button(type,_53d);
var a=Wikiwyg.createElementWithAttrs("a",{target:"wikiwyg_button",href:"http://www.wikiwyg.net/about/"});
a.appendChild(img);
this.div.appendChild(a);
};
proto.add_separator=function(){
var base=this.config.imagesLocation;
var ext=this.config.imagesExtension;
this.div.appendChild(Wikiwyg.createElementWithAttrs("img",{"class":"wikiwyg_separator",alt:" | ",title:"",src:base+"separator"+ext}));
};
proto.addControlItem=function(text,_543){
var span=Wikiwyg.createElementWithAttrs("span",{"class":"wikiwyg_control_link"});
var link=Wikiwyg.createElementWithAttrs("a",{href:"#"});
link.appendChild(document.createTextNode(text));
span.appendChild(link);
var self=this;
link.onclick=function(){
eval("self.wikiwyg."+_543+"()");
return false;
};
this.div.appendChild(span);
};
proto.resetModeSelector=function(){
if(this.firstModeRadio){
var temp=this.firstModeRadio.onclick;
this.firstModeRadio.onclick=null;
this.firstModeRadio.click();
this.firstModeRadio.onclick=temp;
}
};
proto.addModeSelector=function(){
var span=document.createElement("span");
var _549=Wikiwyg.createUniqueId();
for(var i=0;i<this.wikiwyg.config.modeClasses.length;i++){
var _54b=this.wikiwyg.config.modeClasses[i];
var _54c=this.wikiwyg.mode_objects[_54b];
var _54d=Wikiwyg.createUniqueId();
var _54e=i==0?"checked":"";
var _54f=Wikiwyg.createElementWithAttrs("input",{type:"radio",name:_549,id:_54d,value:_54c.classname,"checked":_54e});
if(!this.firstModeRadio){
this.firstModeRadio=_54f;
}
var self=this;
_54f.onclick=function(){
self.wikiwyg.switchMode(this.value);
};
var _551=Wikiwyg.createElementWithAttrs("label",{"for":_54d});
_551.appendChild(document.createTextNode(_54c.modeDescription));
span.appendChild(_54f);
span.appendChild(_551);
}
this.div.appendChild(span);
};
proto.add_break=function(){
this.div.appendChild(document.createElement("br"));
};
proto.add_styles=function(){
var _552=this.config.styleSelector;
var _553=this.config.controlLabels;
this.styleSelect=document.createElement("select");
this.styleSelect.className="wikiwyg_selector";
if(this.config.selectorWidth){
this.styleSelect.style.width=this.config.selectorWidth;
}
for(var i=0;i<_552.length;i++){
value=_552[i];
var _555=Wikiwyg.createElementWithAttrs("option",{"value":value});
_555.appendChild(document.createTextNode(_553[value]||value));
this.styleSelect.appendChild(_555);
}
var self=this;
this.styleSelect.onchange=function(){
self.set_style(this.value);
};
this.div.appendChild(this.styleSelect);
};
proto.set_style=function(_557){
var idx=this.styleSelect.selectedIndex;
if(idx!=0){
this.wikiwyg.current_mode.process_command(_557);
}
this.styleSelect.selectedIndex=0;
};
proto=new Subclass("Wikiwyg.Wysiwyg","Wikiwyg.Mode");
proto.classtype="wysiwyg";
proto.modeDescription="Wysiwyg";
proto.config={useParentStyles:true,useStyleMedia:"wikiwyg",iframeId:null,iframeObject:null,disabledToolbarButtons:[],editHeightMinimum:70,editHeightAdjustment:1.3,clearRegex:null};
proto.initializeObject=function(){
this.edit_iframe=this.get_edit_iframe();
this.div=this.edit_iframe;
this.set_design_mode_early();
};
proto.set_design_mode_early=function(){
};
proto.fromHtml=function(html){
var dom=document.createElement("div");
dom.innerHTML=html;
this.sanitize_dom(dom);
this.set_inner_html(dom.innerHTML);
};
proto.toHtml=function(func){
func(this.get_inner_html());
};
proto.fix_up_relative_imgs=function(){
var base=location.href.replace(/(.*?:\/\/.*?\/).*/,"$1");
var imgs=this.get_edit_document().getElementsByTagName("img");
for(var ii=0;ii<imgs.length;++ii){
imgs[ii].src=imgs[ii].src.replace(/^\//,base);
}
};
proto.enableThis=function(){
Wikiwyg.Mode.prototype.enableThis.call(this);
this.edit_iframe.style.border="1px black solid";
this.edit_iframe.width="100%";
this.setHeightOf(this.edit_iframe);
this.fix_up_relative_imgs();
this.get_edit_document().designMode="on";
this.apply_stylesheets();
this.enable_keybindings();
this.clear_inner_html();
};
proto.clear_inner_html=function(){
var _55f=this.get_inner_html();
var _560=this.config.clearRegex;
if(_560&&_55f.match(_560)){
this.set_inner_html("");
}
};
proto.get_keybinding_area=function(){
return this.get_edit_document();
};
proto.get_edit_iframe=function(){
var _561;
if(this.config.iframeId){
_561=document.getElementById(this.config.iframeId);
_561.iframe_hack=true;
}else{
if(this.config.iframeObject){
_561=this.config.iframeObject;
_561.iframe_hack=true;
}else{
_561=document.createElement("iframe");
}
}
return _561;
};
proto.get_edit_window=function(){
return this.edit_iframe.contentWindow;
};
proto.get_edit_document=function(){
return this.get_edit_window().document;
};
proto.get_inner_html=function(){
return this.get_edit_document().body.innerHTML;
};
proto.set_inner_html=function(html){
this.get_edit_document().body.innerHTML=html;
};
proto.apply_stylesheets=function(){
var _563=document.styleSheets;
var head=this.get_edit_document().getElementsByTagName("head")[0];
for(var i=0;i<_563.length;i++){
var _566=_563[i];
if(_566.href==location.href){
this.apply_inline_stylesheet(_566,head);
}else{
if(this.should_link_stylesheet(_566)){
this.apply_linked_stylesheet(_566,head);
}
}
}
};
proto.apply_inline_stylesheet=function(_567,head){
var _569="";
for(var i=0;i<_567.cssRules.length;i++){
if(_567.cssRules[i].type==3){
_569+=Ajax.get(_567.cssRules[i].href);
}else{
_569+=_567.cssRules[i].cssText+"\n";
}
}
if(_569.length>0){
_569+="\nbody { padding: 5px; }\n";
this.append_inline_style_element(_569,head);
}
};
proto.append_inline_style_element=function(_56b,head){
var _56d=document.createElement("style");
_56d.setAttribute("type","text/css");
if(_56d.styleSheet){
_56d.styleSheet.cssText=_56b;
}else{
var _56e=document.createTextNode(_56b);
_56d.appendChild(_56e);
head.appendChild(_56d);
}
};
proto.should_link_stylesheet=function(_56f,head){
return false;
var _571=_56f.media;
var _572=this.config;
var _573=_571.mediaText?_571.mediaText:_571;
var _574=((!_573||_573=="screen")&&_572.useParentStyles);
var _575=(_573&&(_573==_572.useStyleMedia));
if(!_574&&!_575){
return false;
}else{
return true;
}
};
proto.apply_linked_stylesheet=function(_576,head){
var link=Wikiwyg.createElementWithAttrs("link",{href:_576.href,type:_576.type,media:"screen",rel:"STYLESHEET"},this.get_edit_document());
head.appendChild(link);
};
proto.process_command=function(_579){
if(this["do_"+_579]){
this["do_"+_579](_579);
}
if(!Wikiwyg.is_ie){
this.get_edit_window().focus();
}
};
proto.exec_command=function(_57a,_57b){
this.get_edit_document().execCommand(_57a,false,_57b);
};
proto.format_command=function(_57c){
this.exec_command("formatblock","<"+_57c+">");
};
proto.do_bold=proto.exec_command;
proto.do_italic=proto.exec_command;
proto.do_underline=proto.exec_command;
proto.do_strike=function(){
this.exec_command("strikethrough");
};
proto.do_hr=function(){
this.exec_command("inserthorizontalrule");
};
proto.do_ordered=function(){
this.exec_command("insertorderedlist");
};
proto.do_unordered=function(){
this.exec_command("insertunorderedlist");
};
proto.do_indent=proto.exec_command;
proto.do_outdent=proto.exec_command;
proto.do_h1=proto.format_command;
proto.do_h2=proto.format_command;
proto.do_h3=proto.format_command;
proto.do_h4=proto.format_command;
proto.do_h5=proto.format_command;
proto.do_h6=proto.format_command;
proto.do_pre=proto.format_command;
proto.do_p=proto.format_command;
proto.do_table=function(){
var html="<table><tbody>"+"<tr><td>A</td>"+"<td>B</td>"+"<td>C</td></tr>"+"<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"+"<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"+"</tbody></table>";
this.insert_html(html);
};
proto.insert_html=function(html){
this.get_edit_window().focus();
this.exec_command("inserthtml",html);
};
proto.do_unlink=proto.exec_command;
proto.do_link=function(){
var _57f=this.get_link_selection_text();
if(!_57f){
return;
}
var url;
var _581=_57f.match(/(.*?)\b((?:http|https|ftp|irc|file):\/\/\S+)(.*)/);
if(_581){
if(_581[1]||_581[3]){
return null;
}
url=_581[2];
}else{
url=escape(_57f);
}
this.exec_command("createlink",url);
};
proto.do_www=function(){
var _582=this.get_link_selection_text();
if(_582!=null){
var url=prompt("Please enter a link","Type in your link here");
this.exec_command("createlink",url);
}
};
proto.get_selection_text=function(){
return this.get_edit_window().getSelection().toString();
};
proto.get_link_selection_text=function(){
var _584=this.get_selection_text();
if(!_584){
alert("Please select the text you would like to turn into a link.");
return;
}
return _584;
};
if(Wikiwyg.is_ie){
proto.set_design_mode_early=function(_585){
this.get_edit_document().designMode="on";
};
proto.get_edit_window=function(){
return this.edit_iframe;
};
proto.get_edit_document=function(){
return this.edit_iframe.contentWindow.document;
};
proto.get_selection_text=function(){
var _586=this.get_edit_document().selection;
if(_586!=null){
return _586.createRange().htmlText;
}
return "";
};
proto.insert_html=function(html){
var doc=this.get_edit_document();
var _589=this.get_edit_document().selection.createRange();
if(_589.boundingTop==2&&_589.boundingLeft==2){
return;
}
_589.pasteHTML(html);
_589.collapse(false);
_589.select();
};
proto.enable_keybindings=function(){
};
}
proto=new Subclass("Wikiwyg.Wikitext","Wikiwyg.Mode");
klass=Wikiwyg.Wikitext;
proto.classtype="wikitext";
proto.modeDescription="Wikitext";
proto.config={textareaId:null,supportCamelCaseLinks:false,javascriptLocation:null,clearRegex:null,editHeightMinimum:10,editHeightAdjustment:1.3,markupRules:{link:["bound_phrase","[","]"],bold:["bound_phrase","*","*"],code:["bound_phrase","`","`"],italic:["bound_phrase","/","/"],underline:["bound_phrase","_","_"],strike:["bound_phrase","-","-"],p:["start_lines",""],pre:["start_lines","    "],h1:["start_line","= "],h2:["start_line","== "],h3:["start_line","=== "],h4:["start_line","==== "],h5:["start_line","===== "],h6:["start_line","====== "],ordered:["start_lines","#"],unordered:["start_lines","*"],indent:["start_lines",">"],hr:["line_alone","----"],table:["line_alone","| A | B | C |\n|   |   |   |\n|   |   |   |"],www:["bound_phrase","[","]"]}};
proto.initializeObject=function(){
this.initialize_object();
};
proto.initialize_object=function(){
this.div=document.createElement("div");
if(this.config.textareaId){
this.textarea=document.getElementById(this.config.textareaId);
}else{
this.textarea=document.createElement("textarea");
}
this.textarea.setAttribute("id","wikiwyg_wikitext_textarea");
this.div.appendChild(this.textarea);
this.area=this.textarea;
this.clear_inner_text();
};
proto.clear_inner_text=function(){
if(Wikiwyg.is_safari){
return;
}
var self=this;
this.area.onclick=function(){
var _58b=self.area.value;
var _58c=self.config.clearRegex;
if(_58c&&_58b.match(_58c)){
self.area.value="";
}
};
};
proto.enableThis=function(){
Wikiwyg.Mode.prototype.enableThis.call(this);
this.textarea.style.width="100%";
this.setHeightOfEditor();
this.enable_keybindings();
};
proto.setHeightOfEditor=function(){
var _58d=this.config;
var _58e=_58d.editHeightAdjustment;
var area=this.textarea;
if(Wikiwyg.is_safari){
return area.setAttribute("rows",25);
}
var text=this.getTextArea();
var rows=text.split(/\n/).length;
var _592=parseInt(rows*_58e);
if(_592<_58d.editHeightMinimum){
_592=_58d.editHeightMinimum;
}
area.setAttribute("rows",_592);
};
proto.toWikitext=function(){
return this.getTextArea();
};
proto.toHtml=function(func){
var _594=this.canonicalText();
this.convertWikitextToHtml(_594,func);
};
proto.canonicalText=function(){
var _595=this.getTextArea();
if(_595[_595.length-1]!="\n"){
_595+="\n";
}
return _595;
};
proto.fromHtml=function(html){
this.setTextArea("Loading...");
var self=this;
this.convertHtmlToWikitext(html,function(_598){
self.setTextArea(_598);
});
};
proto.getTextArea=function(){
return this.textarea.value;
};
proto.setTextArea=function(text){
this.textarea.value=text;
};
proto.convertWikitextToHtml=function(_59a,func){
alert("Wikitext changes cannot be converted to HTML\nWikiwyg.Wikitext.convertWikitextToHtml is not implemented here");
func(this.copyhtml);
};
proto.convertHtmlToWikitext=function(html,func){
func(this.convert_html_to_wikitext(html));
};
proto.get_keybinding_area=function(){
return this.textarea;
};
Wikiwyg.Wikitext.phrase_end_re=/[\s\.\:\;\,\!\?\(\)]/;
proto.find_left=function(t,_59f,_5a0){
var _5a1=t.substr(_59f-1,1);
var _5a2=t.substr(_59f-2,1);
if(_59f==0){
return _59f;
}
if(_5a1.match(_5a0)){
if((_5a1!=".")||(_5a2.match(/\s/))){
return _59f;
}
}
return this.find_left(t,_59f-1,_5a0);
};
proto.find_right=function(t,_5a4,_5a5){
var _5a6=t.substr(_5a4,1);
var _5a7=t.substr(_5a4+1,1);
if(_5a4>=t.length){
return _5a4;
}
if(_5a6.match(_5a5)){
if((_5a6!=".")||(_5a7.match(/\s/))){
return _5a4;
}
}
return this.find_right(t,_5a4+1,_5a5);
};
proto.get_lines=function(){
t=this.area;
var _5a8=t.selectionStart;
var _5a9=t.selectionEnd;
if(_5a8==null){
_5a8=_5a9;
if(_5a8==null){
return false;
}
_5a8=_5a9=t.value.substr(0,_5a8).replace(/\r/g,"").length;
}
var _5aa=t.value.replace(/\r/g,"");
selection=_5aa.substr(_5a8,_5a9-_5a8);
_5a8=this.find_right(_5aa,_5a8,/[^\r\n]/);
_5a9=this.find_left(_5aa,_5a9,/[^\r\n]/);
this.selection_start=this.find_left(_5aa,_5a8,/[\r\n]/);
this.selection_end=this.find_right(_5aa,_5a9,/[\r\n]/);
t.setSelectionRange(_5a8,_5a9);
t.focus();
this.start=_5aa.substr(0,this.selection_start);
this.sel=_5aa.substr(this.selection_start,this.selection_end-this.selection_start);
this.finish=_5aa.substr(this.selection_end,_5aa.length);
return true;
};
proto.alarm_on=function(){
var area=this.area;
var _5ac=area.style.background;
area.style.background="#f88";
function alarm_off(){
area.style.background=_5ac;
}
window.setTimeout(alarm_off,250);
area.focus();
};
proto.get_words=function(){
function is_insane(_5ad){
return _5ad.match(/\r?\n(\r?\n|\*+ |\#+ |\=+ )/);
}
t=this.area;
var _5ae=t.selectionStart;
var _5af=t.selectionEnd;
if(_5ae==null){
_5ae=_5af;
if(_5ae==null){
return false;
}
_5ae=_5af=t.value.substr(0,_5ae).replace(/\r/g,"").length;
}
var _5b0=t.value.replace(/\r/g,"");
selection=_5b0.substr(_5ae,_5af-_5ae);
_5ae=this.find_right(_5b0,_5ae,/(\S|\r?\n)/);
if(_5ae>_5af){
_5ae=_5af;
}
_5af=this.find_left(_5b0,_5af,/(\S|\r?\n)/);
if(_5af<_5ae){
_5af=_5ae;
}
if(is_insane(selection)){
this.alarm_on();
return false;
}
this.selection_start=this.find_left(_5b0,_5ae,Wikiwyg.Wikitext.phrase_end_re);
this.selection_end=this.find_right(_5b0,_5af,Wikiwyg.Wikitext.phrase_end_re);
t.setSelectionRange(this.selection_start,this.selection_end);
t.focus();
this.start=_5b0.substr(0,this.selection_start);
this.sel=_5b0.substr(this.selection_start,this.selection_end-this.selection_start);
this.finish=_5b0.substr(this.selection_end,_5b0.length);
return true;
};
proto.markup_is_on=function(_5b1,_5b2){
return (this.sel.match(_5b1)&&this.sel.match(_5b2));
};
proto.clean_selection=function(_5b3,_5b4){
this.sel=this.sel.replace(_5b3,"");
this.sel=this.sel.replace(_5b4,"");
};
proto.toggle_same_format=function(_5b5,_5b6){
_5b5=this.clean_regexp(_5b5);
_5b6=this.clean_regexp(_5b6);
var _5b7=new RegExp("^"+_5b5);
var _5b8=new RegExp(_5b6+"$");
if(this.markup_is_on(_5b7,_5b8)){
this.clean_selection(_5b7,_5b8);
return true;
}
return false;
};
proto.clean_regexp=function(_5b9){
_5b9=_5b9.replace(/([\^\$\*\+\.\?\[\]\{\}])/g,"\\$1");
return _5b9;
};
proto.insert_text_at_cursor=function(text){
var t=this.area;
var _5bc=t.selectionStart;
var _5bd=t.selectionEnd;
if(_5bc==null){
_5bc=_5bd;
if(_5bc==null){
return false;
}
}
var _5be=t.value.substr(0,_5bc);
var _5bf=t.value.substr(_5bd,t.value.length);
t.value=_5be+text+_5bf;
};
proto.set_text_and_selection=function(text,_5c1,end){
this.area.value=text;
this.area.setSelectionRange(_5c1,end);
};
proto.add_markup_words=function(_5c3,_5c4,_5c5){
if(this.toggle_same_format(_5c3,_5c4)){
this.selection_end=this.selection_end-(_5c3.length+_5c4.length);
_5c3="";
_5c4="";
}
if(this.sel.length==0){
if(_5c5){
this.sel=_5c5;
}
var text=this.start+_5c3+this.sel+_5c4+this.finish;
var _5c7=this.selection_start+_5c3.length;
var end=this.selection_end+_5c3.length+this.sel.length;
this.set_text_and_selection(text,_5c7,end);
}else{
var text=this.start+_5c3+this.sel+_5c4+this.finish;
var _5c7=this.selection_start;
var end=this.selection_end+_5c3.length+_5c4.length;
this.set_text_and_selection(text,_5c7,end);
}
this.area.focus();
};
proto.add_markup_lines=function(_5c9){
var _5ca=new RegExp("^"+this.clean_regexp(_5c9),"gm");
var _5cb=/^(\^+|\=+|\*+|#+|>+|    )/gm;
var _5cc;
if(!_5c9.length){
this.sel=this.sel.replace(_5cb,"");
this.sel=this.sel.replace(/^\ +/gm,"");
}else{
if((_5c9=="    ")&&this.sel.match(/^\S/m)){
this.sel=this.sel.replace(/^/gm,_5c9);
}else{
if((!_5c9.match(/[\=\^]/))&&this.sel.match(_5ca)){
this.sel=this.sel.replace(_5ca,"");
if(_5c9!="    "){
this.sel=this.sel.replace(/^ */gm,"");
}
}else{
if(_5cc=this.sel.match(_5cb)){
if(_5c9=="    "){
this.sel=this.sel.replace(/^/gm,_5c9);
}else{
if(_5c9.match(/[\=\^]/)){
this.sel=this.sel.replace(_5cb,_5c9);
}else{
this.sel=this.sel.replace(_5cb,function(_5cd){
return _5c9.times(_5cd.length);
});
}
}
}else{
if(this.sel.length>0){
this.sel=this.sel.replace(/^(.*\S+)/gm,_5c9+" $1");
}else{
this.sel=_5c9+" ";
}
}
}
}
}
var text=this.start+this.sel+this.finish;
var _5cf=this.selection_start;
var end=this.selection_start+this.sel.length;
this.set_text_and_selection(text,_5cf,end);
this.area.focus();
};
proto.bound_markup_lines=function(_5d1){
var _5d2=_5d1[1];
var _5d3=_5d1[2];
var _5d4=new RegExp("^"+this.clean_regexp(_5d2),"gm");
var _5d5=new RegExp(this.clean_regexp(_5d3)+"$","gm");
var _5d6=/^(\^+|\=+|\*+|#+|>+) */gm;
var _5d7=/( +(\^+|\=+))?$/gm;
var _5d8;
if(this.sel.match(_5d4)){
this.sel=this.sel.replace(_5d4,"");
this.sel=this.sel.replace(_5d5,"");
}else{
if(_5d8=this.sel.match(_5d6)){
this.sel=this.sel.replace(_5d6,_5d2);
this.sel=this.sel.replace(_5d7,_5d3);
}else{
if(this.sel.length>0){
this.sel=this.sel.replace(/^(.*\S+)/gm,_5d2+"$1"+_5d3);
}else{
this.sel=_5d2+_5d3;
}
}
}
var text=this.start+this.sel+this.finish;
var _5da=this.selection_start;
var end=this.selection_start+this.sel.length;
this.set_text_and_selection(text,_5da,end);
this.area.focus();
};
proto.markup_bound_line=function(_5dc){
var _5dd=this.area.scrollTop;
if(this.get_lines()){
this.bound_markup_lines(_5dc);
}
this.area.scrollTop=_5dd;
};
proto.markup_start_line=function(_5de){
var _5df=_5de[1];
_5df=_5df.replace(/ +/,"");
var _5e0=this.area.scrollTop;
if(this.get_lines()){
this.add_markup_lines(_5df);
}
this.area.scrollTop=_5e0;
};
proto.markup_start_lines=function(_5e1){
var _5e2=_5e1[1];
var _5e3=this.area.scrollTop;
if(this.get_lines()){
this.add_markup_lines(_5e2);
}
this.area.scrollTop=_5e3;
};
proto.markup_bound_phrase=function(_5e4){
var _5e5=_5e4[1];
var _5e6=_5e4[2];
var _5e7=this.area.scrollTop;
if(_5e6=="undefined"){
_5e6=_5e5;
}
if(this.get_words()){
this.add_markup_words(_5e5,_5e6,null);
}
this.area.scrollTop=_5e7;
};
klass.make_do=function(_5e8){
return function(){
var _5e9=this.config.markupRules[_5e8];
var _5ea=_5e9[0];
if(!this["markup_"+_5ea]){
die("No handler for markup: \""+_5ea+"\"");
}
this["markup_"+_5ea](_5e9);
};
};
proto.do_link=klass.make_do("link");
proto.do_bold=klass.make_do("bold");
proto.do_code=klass.make_do("code");
proto.do_italic=klass.make_do("italic");
proto.do_underline=klass.make_do("underline");
proto.do_strike=klass.make_do("strike");
proto.do_p=klass.make_do("p");
proto.do_pre=klass.make_do("pre");
proto.do_h1=klass.make_do("h1");
proto.do_h2=klass.make_do("h2");
proto.do_h3=klass.make_do("h3");
proto.do_h4=klass.make_do("h4");
proto.do_h5=klass.make_do("h5");
proto.do_h6=klass.make_do("h6");
proto.do_ordered=klass.make_do("ordered");
proto.do_unordered=klass.make_do("unordered");
proto.do_hr=klass.make_do("hr");
proto.do_table=klass.make_do("table");
proto.do_www=function(){
var url=prompt("Please enter a link","Type in your link here");
var old=this.config.markupRules.www[1];
this.config.markupRules.www[1]+=url+" ";
var _5ed=this.config.markupRules["www"];
var _5ee=_5ed[0];
if(!this["markup_"+_5ee]){
die("No handler for markup: \""+_5ee+"\"");
}
this["markup_"+_5ee](_5ed);
this.config.markupRules.www[1]=old;
};
proto.selection_mangle=function(_5ef){
var _5f0=this.area.scrollTop;
if(!this.get_lines()){
this.area.scrollTop=_5f0;
return;
}
if(_5ef(this)){
var text=this.start+this.sel+this.finish;
var _5f2=this.selection_start;
var end=this.selection_start+this.sel.length;
this.set_text_and_selection(text,_5f2,end);
}
this.area.focus();
};
proto.do_indent=function(){
this.selection_mangle(function(that){
if(that.sel==""){
return false;
}
that.sel=that.sel.replace(/^(([\*\-\#])+(?=\s))/gm,"$2$1");
that.sel=that.sel.replace(/^([\>\=])/gm,"$1$1");
that.sel=that.sel.replace(/^([^\>\*\-\#\=\r\n])/gm,"> $1");
that.sel=that.sel.replace(/^\={7,}/gm,"======");
return true;
});
};
proto.do_outdent=function(){
this.selection_mangle(function(that){
if(that.sel==""){
return false;
}
that.sel=that.sel.replace(/^([\>\*\-\#\=] ?)/gm,"");
return true;
});
};
proto.do_unlink=function(){
this.selection_mangle(function(that){
that.sel=that.kill_linkedness(that.sel);
return true;
});
};
proto.kill_linkedness=function(str){
while(str.match(/\[.*\]/)){
str=str.replace(/\[(.*?)\]/,"$1");
}
str=str.replace(/^(.*)\]/,"] $1");
str=str.replace(/\[(.*)$/,"$1 [");
return str;
};
proto.markup_line_alone=function(_5f8){
var t=this.area;
var _5fa=t.scrollTop;
var _5fb=t.selectionStart;
var _5fc=t.selectionEnd;
if(_5fb==null){
_5fb=_5fc;
}
var text=t.value;
this.selection_start=this.find_right(text,_5fb,/\r?\n/);
this.selection_end=this.selection_start;
t.setSelectionRange(this.selection_start,this.selection_start);
t.focus();
var _5fe=_5f8[1];
this.start=t.value.substr(0,this.selection_start);
this.finish=t.value.substr(this.selection_end,t.value.length);
var text=this.start+"\n"+_5fe+this.finish;
var _5ff=this.selection_start+_5fe.length+1;
var end=this.selection_end+_5fe.length+1;
this.set_text_and_selection(text,_5ff,end);
t.scrollTop=_5fa;
};
proto.convert_html_to_wikitext=function(html){
this.copyhtml=html;
var dom=document.createElement("div");
dom.innerHTML=html;
this.output=[];
this.list_type=[];
this.indent_level=0;
this.no_collapse_text=false;
this.normalizeDomWhitespace(dom);
this.normalizeDomStructure(dom);
this.walk(dom);
this.assert_new_line();
return this.join_output(this.output);
};
proto.normalizeDomStructure=function(dom){
this.normalize_styled_blocks(dom,"p");
this.normalize_styled_lists(dom,"ol");
this.normalize_styled_lists(dom,"ul");
this.normalize_styled_blocks(dom,"li");
this.normalize_span_whitespace(dom,"span");
};
proto.normalize_span_whitespace=function(dom,tag){
var grep=function(_607){
return Boolean(_607.getAttribute("style"));
};
var _608=this.array_elements_by_tag_name(dom,tag,grep);
for(var i=0;i<_608.length;i++){
var _60a=_608[i];
var node=_60a.firstChild;
while(node){
if(node.nodeType==3){
node.nodeValue=node.nodeValue.replace(/^\n+/,"");
break;
}
node=node.nextSibling;
}
var node=_60a.lastChild;
while(node){
if(node.nodeType==3){
node.nodeValue=node.nodeValue.replace(/\n+$/,"");
break;
}
node=node.previousSibling;
}
}
};
proto.normalize_styled_blocks=function(dom,tag){
var _60e=this.array_elements_by_tag_name(dom,tag);
for(var i=0;i<_60e.length;i++){
var _610=_60e[i];
var _611=_610.getAttribute("style");
if(!_611){
continue;
}
_610.removeAttribute("style");
_610.innerHTML="<span style=\""+_611+"\">"+_610.innerHTML+"</span>";
}
};
proto.normalize_styled_lists=function(dom,tag){
var _614=this.array_elements_by_tag_name(dom,tag);
for(var i=0;i<_614.length;i++){
var _616=_614[i];
var _617=_616.getAttribute("style");
if(!_617){
continue;
}
_616.removeAttribute("style");
var _618=_616.getElementsByTagName("li");
for(var j=0;j<_618.length;j++){
_618[j].innerHTML="<span style=\""+_617+"\">"+_618[j].innerHTML+"</span>";
}
}
};
proto.array_elements_by_tag_name=function(dom,tag,grep){
var _61d=dom.getElementsByTagName(tag);
var _61e=[];
for(var i=0;i<_61d.length;i++){
if(grep&&!grep(_61d[i])){
continue;
}
_61e.push(_61d[i]);
}
return _61e;
};
proto.normalizeDomWhitespace=function(dom){
var tags=["span","strong","em","strike","del","tt"];
for(var ii=0;ii<tags.length;ii++){
var _623=dom.getElementsByTagName(tags[ii]);
for(var i=0;i<_623.length;i++){
this.normalizePhraseWhitespace(_623[i]);
}
}
this.normalizeNewlines(dom,["br","blockquote"],"nextSibling");
this.normalizeNewlines(dom,["p","div","blockquote"],"firstChild");
};
proto.normalizeNewlines=function(dom,tags,_627){
for(var ii=0;ii<tags.length;ii++){
var _629=dom.getElementsByTagName(tags[ii]);
for(var jj=0;jj<_629.length;jj++){
var _62b=_629[jj][_627];
if(_62b&&_62b.nodeType=="3"){
_62b.nodeValue=_62b.nodeValue.replace(/^\n/,"");
}
}
}
};
proto.normalizePhraseWhitespace=function(_62c){
if(this.elementHasComment(_62c)){
return;
}
var _62d=this.getFirstTextNode(_62c);
var _62e=this.getPreviousTextNode(_62c);
var _62f=this.getLastTextNode(_62c);
var _630=this.getNextTextNode(_62c);
if(this.destroyPhraseMarkup(_62c)){
return;
}
if(_62d&&_62d.nodeValue.match(/^ /)){
_62d.nodeValue=_62d.nodeValue.replace(/^ +/,"");
if(_62e&&!_62e.nodeValue.match(/ $/)){
_62e.nodeValue=_62e.nodeValue+" ";
}
}
if(_62f&&_62f.nodeValue.match(/ $/)){
_62f.nodeValue=_62f.nodeValue.replace(/ $/,"");
if(_630&&!_630.nodeValue.match(/^ /)){
_630.nodeValue=" "+_630.nodeValue;
}
}
};
proto.elementHasComment=function(_631){
var node=_631.lastChild;
return node&&(node.nodeType==8);
};
proto.destroyPhraseMarkup=function(_633){
if(this.start_is_no_good(_633)||this.end_is_no_good(_633)){
return this.destroyElement(_633);
}
return false;
};
proto.start_is_no_good=function(_634){
var _635=this.getFirstTextNode(_634);
var _636=this.getPreviousTextNode(_634);
if(!_635){
return true;
}
if(_635.nodeValue.match(/^ /)){
return false;
}
if(!_636||_636.nodeValue=="\n"){
return false;
}
return !_636.nodeValue.match(/[ "]$/);
};
proto.end_is_no_good=function(_637){
var _638=this.getLastTextNode(_637);
var _639=this.getNextTextNode(_637);
for(var n=_637;n&&n.nodeType!=3;n=n.lastChild){
if(n.nodeType==8){
return false;
}
}
if(!_638){
return true;
}
if(_638.nodeValue.match(/ $/)){
return false;
}
if(!_639||_639.nodeValue=="\n"){
return false;
}
return !_639.nodeValue.match(/^[ ."\n]/);
};
proto.destroyElement=function(_63b){
var span=document.createElement("font");
span.innerHTML=_63b.innerHTML;
_63b.parentNode.replaceChild(span,_63b);
return true;
};
proto.getFirstTextNode=function(_63d){
for(node=_63d;node&&node.nodeType!=3;node=node.firstChild){
}
return node;
};
proto.getLastTextNode=function(_63e){
for(node=_63e;node&&node.nodeType!=3;node=node.lastChild){
}
return node;
};
proto.getPreviousTextNode=function(_63f){
var node=_63f.previousSibling;
if(node&&node.nodeType!=3){
node=null;
}
return node;
};
proto.getNextTextNode=function(_641){
var node=_641.nextSibling;
if(node&&node.nodeType!=3){
node=null;
}
return node;
};
proto.appendOutput=function(_643){
this.output.push(_643);
};
proto.join_output=function(_644){
var list=this.remove_stops(_644);
list=this.cleanup_output(list);
return list.join("");
};
proto.cleanup_output=function(list){
return list;
};
proto.remove_stops=function(list){
var _648=[];
for(var i=0;i<list.length;i++){
if(typeof (list[i])!="string"){
continue;
}
_648.push(list[i]);
}
return _648;
};
proto.walk=function(_64a){
if(!_64a){
return;
}
for(var part=_64a.firstChild;part;part=part.nextSibling){
if(part.nodeType==1){
this.dispatch_formatter(part);
}else{
if(part.nodeType==3){
if(part.nodeValue.match(/[^\n]/)&&!part.nodeValue.match(/^\n[\ \t]*$/)){
if(this.no_collapse_text){
this.appendOutput(part.nodeValue);
}else{
this.appendOutput(this.collapse(part.nodeValue));
}
}
}
}
}
this.no_collapse_text=false;
};
proto.dispatch_formatter=function(_64c){
var _64d="format_"+_64c.nodeName.toLowerCase();
if(!this[_64d]){
_64d="handle_undefined";
}
this[_64d](_64c);
};
proto.skip=function(){
};
proto.pass=function(_64e){
this.walk(_64e);
};
proto.handle_undefined=function(_64f){
this.appendOutput("<"+_64f.nodeName+">");
this.walk(_64f);
this.appendOutput("</"+_64f.nodeName+">");
};
proto.handle_undefined=proto.skip;
proto.format_abbr=proto.pass;
proto.format_acronym=proto.pass;
proto.format_address=proto.pass;
proto.format_applet=proto.skip;
proto.format_area=proto.skip;
proto.format_basefont=proto.skip;
proto.format_base=proto.skip;
proto.format_bgsound=proto.skip;
proto.format_big=proto.pass;
proto.format_blink=proto.pass;
proto.format_body=proto.pass;
proto.format_br=proto.skip;
proto.format_button=proto.skip;
proto.format_caption=proto.pass;
proto.format_center=proto.pass;
proto.format_cite=proto.pass;
proto.format_col=proto.pass;
proto.format_colgroup=proto.pass;
proto.format_dd=proto.pass;
proto.format_dfn=proto.pass;
proto.format_dl=proto.pass;
proto.format_dt=proto.pass;
proto.format_embed=proto.skip;
proto.format_field=proto.skip;
proto.format_fieldset=proto.skip;
proto.format_font=proto.pass;
proto.format_form=proto.skip;
proto.format_frame=proto.skip;
proto.format_frameset=proto.skip;
proto.format_head=proto.skip;
proto.format_html=proto.pass;
proto.format_iframe=proto.pass;
proto.format_input=proto.skip;
proto.format_ins=proto.pass;
proto.format_isindex=proto.skip;
proto.format_label=proto.skip;
proto.format_legend=proto.skip;
proto.format_link=proto.skip;
proto.format_map=proto.skip;
proto.format_marquee=proto.skip;
proto.format_meta=proto.skip;
proto.format_multicol=proto.pass;
proto.format_nobr=proto.skip;
proto.format_noembed=proto.skip;
proto.format_noframes=proto.skip;
proto.format_nolayer=proto.skip;
proto.format_noscript=proto.skip;
proto.format_nowrap=proto.skip;
proto.format_object=proto.skip;
proto.format_optgroup=proto.skip;
proto.format_option=proto.skip;
proto.format_param=proto.skip;
proto.format_select=proto.skip;
proto.format_small=proto.pass;
proto.format_spacer=proto.skip;
proto.format_style=proto.skip;
proto.format_sub=proto.pass;
proto.format_submit=proto.skip;
proto.format_sup=proto.pass;
proto.format_tbody=proto.pass;
proto.format_textarea=proto.skip;
proto.format_tfoot=proto.pass;
proto.format_thead=proto.pass;
proto.format_wiki=proto.pass;
proto.format_www=proto.skip;
proto.format_img=function(_650){
var uri=_650.getAttribute("src");
if(uri){
this.assert_space_or_newline();
this.appendOutput(uri);
}
};
proto.format_blockquote=function(_652){
var _653=parseInt(_652.style.marginLeft);
var _654=0;
if(_653){
_654+=parseInt(_653/40);
}
if(_652.tagName.toLowerCase()=="blockquote"){
_654+=1;
}
if(!this.indent_level){
this.first_indent_line=true;
}
this.indent_level+=_654;
this.output=defang_last_string(this.output);
this.assert_new_line();
this.walk(_652);
this.indent_level-=_654;
if(!this.indent_level){
this.assert_blank_line();
}else{
this.assert_new_line();
}
function defang_last_string(_655){
function non_string(a){
return typeof (a)!="string";
}
var rev=_655.slice().reverse();
var _658=takeWhile(non_string,rev);
var _659=dropWhile(non_string,rev);
if(_659.length){
_659[0].replace(/^>+/,"");
}
return _658.concat(_659).reverse();
}
};
proto.format_div=function(_65a){
if(this.is_opaque(_65a)){
this.handle_opaque_block(_65a);
return;
}
if(this.is_indented(_65a)){
this.format_blockquote(_65a);
return;
}
this.walk(_65a);
};
proto.format_span=function(_65b){
if(this.is_opaque(_65b)){
this.handle_opaque_phrase(_65b);
return;
}
var _65c=_65b.getAttribute("style");
if(!_65c){
this.pass(_65b);
return;
}
if(!this.element_has_text_content(_65b)&&!this.element_has_only_image_content(_65b)){
return;
}
var _65d=["line-through","bold","italic","underline"];
for(var i=0;i<_65d.length;i++){
this.check_style_and_maybe_mark_up(_65c,_65d[i],1);
}
this.no_following_whitespace();
this.walk(_65b);
for(var i=_65d.length;i>=0;i--){
this.check_style_and_maybe_mark_up(_65c,_65d[i],2);
}
};
proto.element_has_text_content=function(_65f){
return _65f.innerHTML.replace(/<.*?>/g,"").replace(/&nbsp;/g,"").match(/\S/);
};
proto.element_has_only_image_content=function(_660){
return _660.childNodes.length==1&&_660.firstChild.nodeType==1&&_660.firstChild.tagName.toLowerCase()=="img";
};
proto.check_style_and_maybe_mark_up=function(_661,_662,_663){
var _664=_662;
if(_664=="line-through"){
_664="strike";
}
if(this.check_style_for_attribute(_661,_662)){
this.appendOutput(this.config.markupRules[_664][_663]);
}
};
proto.check_style_for_attribute=function(_665,_666){
var _667=this.squish_style_object_into_string(_665);
return _667.match("\\b"+_666+"\\b");
};
proto.squish_style_object_into_string=function(_668){
if((_668.constructor+"").match("String")){
return _668;
}
var _669=[["font","weight"],["font","style"],["text","decoration"]];
var _66a="";
for(var i=0;i<_669.length;i++){
var pair=_669[i];
var css=pair[0]+"-"+pair[1];
var js=pair[0]+pair[1].ucFirst();
_66a+=css+": "+_668[js]+"; ";
}
return _66a;
};
proto.basic_formatter=function(_66f,_670){
var _671=this.config.markupRules[_670];
var _672=_671[0];
this["handle_"+_672](_66f,_671);
};
klass.make_empty_formatter=function(_673){
return function(_674){
this.basic_formatter(_674,_673);
};
};
klass.make_formatter=function(_675){
return function(_676){
if(this.element_has_text_content(_676)){
this.basic_formatter(_676,_675);
}
};
};
proto.format_b=klass.make_formatter("bold");
proto.format_strong=proto.format_b;
proto.format_code=klass.make_formatter("code");
proto.format_kbd=proto.format_code;
proto.format_samp=proto.format_code;
proto.format_tt=proto.format_code;
proto.format_var=proto.format_code;
proto.format_i=klass.make_formatter("italic");
proto.format_em=proto.format_i;
proto.format_u=klass.make_formatter("underline");
proto.format_strike=klass.make_formatter("strike");
proto.format_del=proto.format_strike;
proto.format_s=proto.format_strike;
proto.format_hr=klass.make_empty_formatter("hr");
proto.format_h1=klass.make_formatter("h1");
proto.format_h2=klass.make_formatter("h2");
proto.format_h3=klass.make_formatter("h3");
proto.format_h4=klass.make_formatter("h4");
proto.format_h5=klass.make_formatter("h5");
proto.format_h6=klass.make_formatter("h6");
proto.format_pre=klass.make_formatter("pre");
proto.format_p=function(_677){
if(this.is_indented(_677)){
this.format_blockquote(_677);
return;
}
this.assert_blank_line();
this.walk(_677);
this.assert_blank_line();
};
proto.format_a=function(_678){
var _679=Wikiwyg.htmlUnescape(_678.innerHTML);
_679=_679.replace(/<[^>]*?>/g," ");
_679=_679.replace(/\s+/g," ");
_679=_679.replace(/^\s+/,"");
_679=_679.replace(/\s+$/,"");
var href=_678.getAttribute("href");
if(!href){
href="";
}
this.make_wikitext_link(_679,href,_678);
};
proto.format_table=function(_67b){
this.assert_blank_line();
this.walk(_67b);
this.assert_blank_line();
};
proto.format_tr=function(_67c){
this.walk(_67c);
this.appendOutput("|");
this.insert_new_line();
};
proto.format_td=function(_67d){
this.appendOutput("| ");
this.no_following_whitespace();
this.walk(_67d);
this.chomp();
this.appendOutput(" ");
};
proto.format_th=proto.format_td;
function takeWhile(f,a){
for(var i=0;i<a.length;++i){
if(!f(a[i])){
break;
}
}
return a.slice(0,i);
}
function dropWhile(f,a){
for(var i=0;i<a.length;++i){
if(!f(a[i])){
break;
}
}
return a.slice(i);
}
proto.previous_line=function(){
function newline(s){
return s["match"]&&s.match(/\n/);
}
function non_newline(s){
return !newline(s);
}
return this.join_output(takeWhile(non_newline,dropWhile(newline,this.output.slice().reverse())).reverse());
};
proto.make_list=function(_686,_687){
if(!this.previous_was_newline_or_start()){
this.insert_new_line();
}
this.list_type.push(_687);
this.walk(_686);
this.list_type.pop();
if(this.list_type.length==0){
this.assert_blank_line();
}
};
proto.format_ol=function(_688){
this.make_list(_688,"ordered");
};
proto.format_ul=function(_689){
this.make_list(_689,"unordered");
};
proto.format_li=function(_68a){
var _68b=this.list_type.length;
if(!_68b){
die("Wikiwyg list error");
}
var type=this.list_type[_68b-1];
var _68d=this.config.markupRules[type];
this.appendOutput(_68d[1].times(_68b)+" ");
if(Wikiwyg.is_ie&&_68a.firstChild&&_68a.firstChild.nextSibling&&_68a.firstChild.nextSibling.nodeName.match(/^[uo]l$/i)){
try{
_68a.firstChild.nodeValue=_68a.firstChild.nodeValue.replace(/ $/,"");
}
catch(e){
}
}
this.walk(_68a);
this.chomp();
this.insert_new_line();
};
proto.chomp=function(){
var _68e;
while(this.output.length){
_68e=this.output.pop();
if(typeof (_68e)!="string"){
this.appendOutput(_68e);
return;
}
if(!_68e.match(/^\n+>+ $/)&&_68e.match(/\S/)){
break;
}
}
if(_68e){
_68e=_68e.replace(/[\r\n\s]+$/,"");
this.appendOutput(_68e);
}
};
proto.collapse=function(_68f){
return _68f.replace(/[ \u00a0\r\n]+/g," ");
};
proto.trim=function(_690){
return _690.replace(/^\s+/,"");
};
proto.insert_new_line=function(){
var fang="";
var _692=this.config.markupRules.indent[1];
var _693="\n";
if(this.indent_level>0){
fang=_692.times(this.indent_level);
if(fang.length){
fang+=" ";
}
}
if(fang.length&&this.first_indent_line){
this.first_indent_line=false;
_693=_693+_693;
}
if(this.output.length){
this.appendOutput(_693+fang);
}else{
if(fang.length){
this.appendOutput(fang);
}
}
};
proto.previous_was_newline_or_start=function(){
for(var ii=this.output.length-1;ii>=0;ii--){
var _695=this.output[ii];
if(typeof (_695)!="string"){
continue;
}
return _695.match(/\n$/);
}
return true;
};
proto.assert_new_line=function(){
this.chomp();
this.insert_new_line();
};
proto.assert_blank_line=function(){
if(!this.should_whitespace()){
return;
}
this.chomp();
this.insert_new_line();
this.insert_new_line();
};
proto.assert_space_or_newline=function(){
if(!this.output.length||!this.should_whitespace()){
return;
}
if(!this.previous_output().match(/(\s+|[\(])$/)){
this.appendOutput(" ");
}
};
proto.no_following_whitespace=function(){
this.appendOutput({whitespace:"stop"});
};
proto.should_whitespace=function(){
return !this.previous_output().whitespace;
};
proto.previous_output=function(_696){
if(!_696){
_696=1;
}
var _697=this.output.length;
return _697&&_696<=_697?this.output[_697-_696]:"";
};
proto.handle_bound_phrase=function(_698,_699){
if(!this.element_has_text_content(_698)){
return;
}
if(_698.innerHTML.match(/^\s*<br\s*\/?\s*>/)){
this.appendOutput("\n");
_698.innerHTML=_698.innerHTML.replace(/^\s*<br\s*\/?\s*>/,"");
}
this.appendOutput(_699[1]);
this.no_following_whitespace();
this.walk(_698);
this.appendOutput(_699[2]);
};
proto.handle_bound_line=function(_69a,_69b){
this.assert_blank_line();
this.appendOutput(_69b[1]);
this.walk(_69a);
this.appendOutput(_69b[2]);
this.assert_blank_line();
};
proto.handle_start_line=function(_69c,_69d){
this.assert_blank_line();
this.appendOutput(_69d[1]);
this.walk(_69c);
this.assert_blank_line();
};
proto.handle_start_lines=function(_69e,_69f){
var text=_69e.firstChild.nodeValue;
if(!text){
return;
}
this.assert_blank_line();
text=text.replace(/^/mg,_69f[1]);
this.appendOutput(text);
this.assert_blank_line();
};
proto.handle_line_alone=function(_6a1,_6a2){
this.assert_blank_line();
this.appendOutput(_6a2[1]);
this.assert_blank_line();
};
proto.COMMENT_NODE_TYPE=8;
proto.get_wiki_comment=function(_6a3){
for(var node=_6a3.firstChild;node;node=node.nextSibling){
if(node.nodeType==this.COMMENT_NODE_TYPE&&node.data.match(/^\s*wagn/)){
return node;
}
}
return null;
};
proto.is_indented=function(_6a5){
var _6a6=parseInt(_6a5.style.marginLeft);
return _6a6>0;
};
proto.is_opaque=function(_6a7){
var _6a8=this.get_wiki_comment(_6a7);
if(!_6a8){
return false;
}
var text=_6a8.data;
if(text.match(/^\s*wiki:/)){
return true;
}
return false;
};
proto.handle_opaque_phrase=function(_6aa){
var _6ab=this.get_wiki_comment(_6aa);
if(_6ab){
var text=_6ab.data;
text=text.replace(/^ wiki:\s+/,"").replace(/-=/g,"-").replace(/==/g,"=").replace(/\s$/,"").replace(/\{(\w+):\s*\}/,"{$1}");
this.appendOutput(Wikiwyg.htmlUnescape(text));
this.smart_trailing_space(_6aa);
}
};
proto.smart_trailing_space=function(_6ad){
var next=_6ad.nextSibling;
if(!next){
}else{
if(next.nodeType==1){
if(next.nodeName=="BR"){
var nn=next.nextSibling;
if(!(nn&&nn.nodeType==1&&nn.nodeName=="SPAN")){
this.appendOutput("\n");
}
}else{
this.appendOutput(" ");
}
}else{
if(next.nodeType==3){
if(!next.nodeValue.match(/^\s/)){
this.no_following_whitespace();
}
}
}
}
};
proto.handle_opaque_block=function(_6b0){
var _6b1=this.get_wiki_comment(_6b0);
if(!_6b1){
return;
}
var text=_6b1.data;
text=text.replace(/^\s*wiki:\s+/,"");
this.appendOutput(text);
};
proto.make_wikitext_link=function(_6b3,href,_6b5){
var _6b6=this.config.markupRules.link[1];
var _6b7=this.config.markupRules.link[2];
if(this.looks_like_a_url(href)){
_6b6=this.config.markupRules.www[1];
_6b7=this.config.markupRules.www[2];
}
this.assert_space_or_newline();
if(!href){
this.appendOutput(_6b3);
}else{
if(href==_6b3){
this.appendOutput(href);
}else{
if(this.href_is_wiki_link(href)){
if(this.camel_case_link(_6b3)){
this.appendOutput(_6b3);
}else{
this.appendOutput(_6b6+_6b3+_6b7);
}
}else{
this.appendOutput(_6b6+href+" "+_6b3+_6b7);
}
}
}
};
proto.camel_case_link=function(_6b8){
if(!this.config.supportCamelCaseLinks){
return false;
}
return _6b8.match(/[a-z][A-Z]/);
};
proto.href_is_wiki_link=function(href){
if(!this.looks_like_a_url(href)){
return true;
}
if(!href.match(/\?/)){
return false;
}
if(href.match(/\/static\/\d+\.\d+\.\d+\.\d+\//)){
href=location.href;
}
var _6ba=href.split("?")[0];
var _6bb=location.href.split("?")[0];
if(_6bb==location.href){
_6bb=location.href.replace(new RegExp(location.hash),"");
}
return _6ba==_6bb;
};
proto.looks_like_a_url=function(_6bc){
return _6bc.match(/^(http|https|ftp|irc|mailto|file):/);
};
if(Wikiwyg.is_ie){
proto.setHeightOf=function(){
this.textarea.style.height="200px";
};
proto.initializeObject=function(){
this.initialize_object();
this.area.addBehavior(this.config.javascriptLocation+"Selection.htc");
};
}
proto=new Subclass("Wikiwyg.Preview","Wikiwyg.Mode");
proto.classtype="preview";
proto.modeDescription="Preview";
proto.config={divId:null};
proto.initializeObject=function(){
if(this.config.divId){
this.div=document.getElementById(this.config.divId);
}else{
this.div=document.createElement("div");
}
this.div.style.backgroundColor="lightyellow";
};
proto.fromHtml=function(html){
this.div.innerHTML=html;
};
proto.toHtml=function(func){
func(this.div.innerHTML);
};
proto.disableStarted=function(){
this.wikiwyg.divHeight=this.div.offsetHeight;
};
function addEvent(name,func){
if(window.addEventListener){
name=name.replace(/^on/,"");
window.addEventListener(name,func,false);
}else{
if(window.attachEvent){
window.attachEvent(name,func);
}
}
}
function grepElementsByTag(tag,func){
var _6c3=document.getElementsByTagName(tag);
var list=[];
for(var i=0;i<_6c3.length;i++){
var _6c6=_6c3[i];
if(func(_6c6)){
list.push(_6c6);
}
}
return list;
}
function getStyle(oElm,_6c8){
var _6c9="";
if(document.defaultView&&document.defaultView.getComputedStyle){
_6c9=document.defaultView.getComputedStyle(oElm,"").getPropertyValue(_6c8);
}else{
if(oElm.currentStyle){
_6c8=_6c8.replace(/\-(\w)/g,function(_6ca,p1){
return p1.toUpperCase();
});
_6c9=oElm.currentStyle[_6c8];
}
}
return _6c9;
}
Cookie={};
Cookie.get=function(name){
var _6cd=document.cookie.indexOf(name+"=");
if(_6cd==-1){
return null;
}
var _6ce=document.cookie.indexOf("=",_6cd)+1;
var _6cf=document.cookie.indexOf(";",_6ce);
if(_6cf==-1){
_6cf=document.cookie.length;
}
var val=document.cookie.substring(_6ce,_6cf);
return val==null?null:unescape(document.cookie.substring(_6ce,_6cf));
};
Cookie.set=function(name,val,_6d3){
if(typeof (_6d3)=="undefined"){
_6d3=new Date(new Date().getTime()+25*365*24*60*60*1000);
}
var str=name+"="+escape(val)+"; expires="+_6d3.toGMTString();
document.cookie=str;
};
Cookie.del=function(name){
Cookie.set(name,"",new Date(new Date().getTime()-1));
};
if(typeof Wait=="undefined"){
Wait={};
}
Wait.VERSION=0.01;
Wait.EXPORT=["wait"];
Wait.EXPORT_TAGS={":all":Wait.EXPORT};
Wait.interval=100;
Wait.wait=function(arg1,arg2,arg3,arg4){
if(typeof arg1=="function"&&typeof arg2=="function"&&typeof arg3=="function"){
return Wait._wait3(arg1,arg2,arg3,arg4);
}
if(typeof arg1=="function"&&typeof arg2=="function"){
return Wait._wait2(arg1,arg2,arg3);
}
};
Wait._wait2=function(test,_6db,max){
Wait._wait3(test,_6db,function(){
},max);
};
Wait._wait3=function(test,_6de,_6df,max){
var func=function(){
var _6e2=Wait.interval;
var _6e3=0;
var _6e4;
var _6e5=function(){
if(test()){
_6de();
clearInterval(_6e4);
}
_6e3+=_6e2;
if(typeof max=="number"){
if(_6e3>=max){
if(typeof _6df=="function"){
_6df();
}
clearInterval(_6e4);
}
}
};
_6e4=setInterval(_6e5,_6e2);
};
func();
};
window.wait=Wait.wait;
if(!this.Ajax){
Ajax={};
}
Ajax.get=function(url,_6e7){
var req=new XMLHttpRequest();
req.open("GET",url,Boolean(_6e7));
return Ajax._send(req,null,_6e7);
};
Ajax.post=function(url,data,_6eb){
var req=new XMLHttpRequest();
req.open("POST",url,Boolean(_6eb));
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
return Ajax._send(req,data,_6eb);
};
Ajax._send=function(req,data,_6ef){
if(_6ef){
req.onreadystatechange=function(){
if(req.readyState==4){
if(req.status==200){
_6ef(req.responseText);
}
}
};
}
req.send(data);
if(!_6ef){
if(req.status!=200){
throw ("Request for \""+url+"\" failed with status: "+req.status);
}
return req.responseText;
}
};
if(window.ActiveXObject&&!window.XMLHttpRequest){
window.XMLHttpRequest=function(){
return new ActiveXObject((navigator.userAgent.toLowerCase().indexOf("msie 5")!=-1)?"Microsoft.XMLHTTP":"Msxml2.XMLHTTP");
};
}
if(window.opera&&!window.XMLHttpRequest){
window.XMLHttpRequest=function(){
this.readyState=0;
this.status=0;
this.statusText="";
this._headers=[];
this._aborted=false;
this._async=true;
this.abort=function(){
this._aborted=true;
};
this.getAllResponseHeaders=function(){
return this.getAllResponseHeader("*");
};
this.getAllResponseHeader=function(_6f0){
var ret="";
for(var i=0;i<this._headers.length;i++){
if(_6f0=="*"||this._headers[i].h==_6f0){
ret+=this._headers[i].h+": "+this._headers[i].v+"\n";
}
}
return ret;
};
this.setRequestHeader=function(_6f3,_6f4){
this._headers[this._headers.length]={h:_6f3,v:_6f4};
};
this.open=function(_6f5,url,_6f7,user,_6f9){
this.method=_6f5;
this.url=url;
this._async=true;
this._aborted=false;
if(arguments.length>=3){
this._async=_6f7;
}
if(arguments.length>3){
opera.postError("XMLHttpRequest.open() - user/password not supported");
}
this._headers=[];
this.readyState=1;
if(this.onreadystatechange){
this.onreadystatechange();
}
};
this.send=function(data){
if(!navigator.javaEnabled()){
alert("XMLHttpRequest.send() - Java must be installed and enabled.");
return;
}
if(this._async){
setTimeout(this._sendasync,0,this,data);
}else{
this._sendsync(data);
}
};
this._sendasync=function(req,data){
if(!req._aborted){
req._sendsync(data);
}
};
this._sendsync=function(data){
this.readyState=2;
if(this.onreadystatechange){
this.onreadystatechange();
}
var url=new java.net.URL(new java.net.URL(window.location.href),this.url);
var conn=url.openConnection();
for(var i=0;i<this._headers.length;i++){
conn.setRequestProperty(this._headers[i].h,this._headers[i].v);
}
this._headers=[];
if(this.method=="POST"){
conn.setDoOutput(true);
var wr=new java.io.OutputStreamWriter(conn.getOutputStream());
wr.write(data);
wr.flush();
wr.close();
}
var _702=false;
var _703=false;
var _704=false;
var _705=false;
var _706=false;
var _707=false;
for(var i=0;;i++){
var _708=conn.getHeaderFieldKey(i);
var _709=conn.getHeaderField(i);
if(_708==null&&_709==null){
break;
}
if(_708!=null){
this._headers[this._headers.length]={h:_708,v:_709};
switch(_708.toLowerCase()){
case "content-encoding":
_702=true;
break;
case "content-length":
_703=true;
break;
case "content-type":
_704=true;
break;
case "date":
_705=true;
break;
case "expires":
_706=true;
break;
case "last-modified":
_707=true;
break;
}
}
}
var val;
val=conn.getContentEncoding();
if(val!=null&&!_702){
this._headers[this._headers.length]={h:"Content-encoding",v:val};
}
val=conn.getContentLength();
if(val!=-1&&!_703){
this._headers[this._headers.length]={h:"Content-length",v:val};
}
val=conn.getContentType();
if(val!=null&&!_704){
this._headers[this._headers.length]={h:"Content-type",v:val};
}
val=conn.getDate();
if(val!=0&&!_705){
this._headers[this._headers.length]={h:"Date",v:(new Date(val)).toUTCString()};
}
val=conn.getExpiration();
if(val!=0&&!_706){
this._headers[this._headers.length]={h:"Expires",v:(new Date(val)).toUTCString()};
}
val=conn.getLastModified();
if(val!=0&&!_707){
this._headers[this._headers.length]={h:"Last-modified",v:(new Date(val)).toUTCString()};
}
var _70b="";
var _70c=conn.getInputStream();
if(_70c){
var _70d=new java.io.BufferedReader(new java.io.InputStreamReader(_70c));
var line;
while((line=_70d.readLine())!=null){
if(this.readyState==2){
this.readyState=3;
if(this.onreadystatechange){
this.onreadystatechange();
}
}
_70b+=line+"\n";
}
_70d.close();
this.status=200;
this.statusText="OK";
this.responseText=_70b;
this.readyState=4;
if(this.onreadystatechange){
this.onreadystatechange();
}
if(this.onload){
this.onload();
}
}else{
this.status=404;
this.statusText="Not Found";
this.responseText="";
this.readyState=4;
if(this.onreadystatechange){
this.onreadystatechange();
}
if(this.onerror){
this.onerror();
}
}
};
};
}
if(!window.ActiveXObject&&window.XMLHttpRequest){
window.ActiveXObject=function(type){
switch(type.toLowerCase()){
case "microsoft.xmlhttp":
case "msxml2.xmlhttp":
return new XMLHttpRequest();
}
return null;
};
}
var JSON=function(){
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},s={"boolean":function(x){
return String(x);
},number:function(x){
return isFinite(x)?String(x):"null";
},string:function(x){
if(/["\\\x00-\x1f]/.test(x)){
x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
});
}
return "\""+x+"\"";
},object:function(x){
if(x){
var a=[],b,f,i,l,v;
if(x instanceof Array){
a[0]="[";
l=x.length;
for(i=0;i<l;i+=1){
v=x[i];
f=s[typeof v];
if(f){
v=f(v);
if(typeof v=="string"){
if(b){
a[a.length]=",";
}
a[a.length]=v;
b=true;
}
}
}
a[a.length]="]";
}else{
if(x instanceof Object){
a[0]="{";
for(i in x){
v=x[i];
f=s[typeof v];
if(f){
v=f(v);
if(typeof v=="string"){
if(b){
a[a.length]=",";
}
a.push(s.string(i),":",v);
b=true;
}
}
}
a[a.length]="}";
}else{
return;
}
}
return a.join("");
}
return "null";
}};
return {copyright:"(c)2005 JSON.org",license:"http://www.crockford.com/JSON/license.html",stringify:function(v){
var f=s[typeof v];
if(f){
v=f(v);
if(typeof v=="string"){
return v;
}
}
return null;
},parse:function(text){
try{
return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g,"")))&&eval("("+text+")");
}
catch(e){
return false;
}
}};
}();
proto=new Subclass("Wikiwyg.HTML","Wikiwyg.Mode");
proto.classtype="html";
proto.modeDescription="HTML";
proto.config={textareaId:null};
proto.initializeObject=function(){
this.div=document.createElement("div");
if(this.config.textareaId){
this.textarea=document.getElementById(this.config.textareaId);
}else{
this.textarea=document.createElement("textarea");
}
this.div.appendChild(this.textarea);
};
proto.enableThis=function(){
Wikiwyg.Mode.prototype.enableThis.call(this);
this.textarea.style.width="100%";
this.textarea.style.height="200px";
};
proto.fromHtml=function(html){
this.textarea.value=this.sanitize_html(html);
};
proto.toHtml=function(func){
func(this.textarea.value);
};
proto.sanitize_html=function(html){
return html;
};
proto.process_command=function(_725){
};
function XXX(msg){
if(!confirm(msg)){
throw ("terminated...");
}
return msg;
}
function JJJ(obj){
XXX(JSON.stringify(obj));
return obj;
}
var klass=Debug=function(){
};
klass.sort_object_keys=function(o){
var a=[];
for(p in o){
a.push(p);
}
return a.sort();
};
klass.dump_keys=function(o){
var a=klass.sort_object_keys(o);
var str="";
for(p in a){
str+=a[p]+"\t";
}
XXX(str);
};
klass.dump_object_into_screen=function(o){
var a=klass.sort_object_keys(o);
var str="";
for(p in a){
var i=a[p];
try{
str+=a[p]+": "+o[i]+"\n";
}
catch(e){
}
}
document.write("<xmp>"+str+"</xmp>");
};
proto=new Subclass("Wagn.Wikiwyg","Wikiwyg");
Object.extend(Wagn.Wikiwyg.prototype,{setup:function(_731,_732,_733){
var conf=this.initial_config();
this._slot_id=_731;
this._card_name=_733;
this._raw_id=this._slot_id+"-raw-content";
this._card_id=_732;
if(!conf.wysiwyg){
conf.wysiwyg={};
}
conf.wysiwyg.iframeId=_731+"-iframe";
conf.iframeId=_731+"-iframe";
this.createWikiwygArea($(this._raw_id),conf);
Wagn.Wikiwyg.wikiwyg_divs.push(this);
this._autosave_interval=20*1000;
return this;
},getContent:function(){
var self=this;
this.clean_spans();
this.current_mode.toHtml(function(html){
self.fromHtml(html);
});
return this.div.innerHTML;
},start_timer:function(){
this._interval=0;
this._timer_running=true;
var self=this;
setTimeout("Wagn.wikiwygs['"+this._slot_id+"'].run_timer();",this._autosave_interval);
},stop_timer:function(){
this._timer_running=false;
},run_timer:function(){
if(this._timer_running){
this.on_interval();
setTimeout("Wagn.wikiwygs['"+this._slot_id+"'].run_timer();",this._autosave_interval);
}
},on_interval:function(){
if(!this._timer_running){
return;
}
this._interval+=1;
original_content=$(this._raw_id).innerHTML;
new_content=Wagn.LinkEditor.editable_to_raw(this.getContent(),$(this._raw_id));
if(this._card_id&&new_content!=original_content){
Wagn.Messenger.log("saving draft of "+this._card_name+"...");
new Ajax.Request("/card/save_draft/"+this._card_id,{method:"post",parameters:"card[content]="+encodeURIComponent(new_content)});
}
},get_draft:function(){
return this.wikiwyg.innerSave("draft");
},clean_spans:function(){
dom=this.current_mode.get_edit_document();
$A(dom.getElementsByTagName("span")).reverse().each(function(elem){
warn("  SPAN "+elem);
var _739=(elem.style["fontWeight"]=="bold");
var em=(elem.style["fontStyle"]=="italic");
if(em||_739){
var _73b="";
if(em&&_739){
_73b=Wikiwyg.createElementWithAttrs("strong",{});
_73b.innerHTML="<em>"+elem.innerHTML+"</em>";
}else{
_73b=Wikiwyg.createElementWithAttrs((em?"em":"strong"),{});
_73b.innerHTML=elem.innerHTML;
}
elem.parentNode.replaceChild(_73b,elem);
}
});
},initial_config:function(){
var conf={imagesLocation:"../../images/wikiwyg/",doubleClickToEdit:false,modeClasses:["Wikiwyg.Wysiwyg"],controlLayout:["selector","bold","italic","ordered","unordered","indent","outdent"],styleSelector:["label","h1","h2","p"],controlLabels:Object.extend(Wikiwyg.Toolbar.prototype.config,{spotlight:"Spotlight",highlight:"Highlight",h1:"Header",h2:"Subheader"})};
if(!Wikiwyg.is_ie){
conf.controlLayout.push("link");
}
if($("edit_html").innerHTML.match(/true/)){
conf.modeClasses.push("Wikiwyg.HTML");
conf.controlLayout.push("mode_selector");
}
return conf;
}});
Object.extend(Wagn.Wikiwyg,{wikiwyg_divs:[],addEventToWindow:function(_73d,name,func){
if(_73d.addEventListener){
name=name.replace(/^on/,"");
_73d.addEventListener(name,func,false);
}else{
if(_73d.attachEvent){
_73d.attachEvent(name,func);
}
}
},getClipboardHTML:function(){
var _740=document.getElementById("___WWHiddenFrame");
if(!_740){
_740=document.createElement("iframe");
_740.id="___WWHiddenFrame";
document.body.appendChild(_740);
_740.contentDocument.designMode="on";
}
pdoc=_740.contentDocument;
pdoc.innerHTML="";
pdoc.execCommand("paste",false,null);
var _741=pdoc.innerHTML;
pdoc.innerHTML="";
return _741;
}});
Object.extend(Wikiwyg.Wysiwyg.prototype,{get_selection:function(){
return this.edit_iframe.contentWindow.getSelection();
},superEnableThis:Wikiwyg.Wysiwyg.prototype.enableThis,enableThis:function(){
this.superEnableThis();
},do_link:function(){
l=new Wagn.LinkEditor(this);
l.edit();
return;
},do_bold:function(){
this.exec_command("bold");
},do_italic:function(){
this.exec_command("italic");
},do_spotlight:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("bold");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_highlight:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("italic");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_indent:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("indent");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_outdent:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("outdent");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_norm:function(){
this.exec_command("removeformat");
},fromHtml:function(html){
var dom=document.createElement("div");
dom.innerHTML=html;
this.sanitize_dom(dom);
this.set_inner_html(dom.innerHTML);
},pasteWithFilter:function(){
html=Wagn.Wikiwyg.getClipboardHTML();
},createKeyPressHandler:function(){
var self=this;
return function(e){
var _746=false;
if(e.ctrlKey&&!e.shiftKey&&!e.altKey){
switch(e.which){
case 86:
case 118:
_746=true;
self.pasteWithFilter();
break;
}
}
if(_746){
e.preventDefault();
e.stopPropagation();
}
};
}});
Wikiwyg.Wysiwyg.prototype.config["editHeightAdjustment"]=1.1;
Object.extend(Wikiwyg.Mode.prototype,{get_edit_height:function(){
var _747=this.wikiwyg.divHeight;
if(_747=="0"){
_747=this.wikiwyg.div.parentNode.parentNode.viewHeight-40;
}
var _748=parseInt(_747*this.config.editHeightAdjustment);
var min=this.config.editHeightMinimum;
h=_748<min?min:_748;
max=window.innerHeight-100;
h=h>max?max:h;
return h;
}});
Wagn.Lister=Class.create();
Object.extend(Wagn.Lister.prototype,{initialize:function(_74a,args){
per_card=true;
this._arguments=$H(args);
this.user_id=this.make_accessor("user_id");
this.page=this.make_accessor("page");
this.cardtype=this.make_accessor("cardtype",{reset_paging:true});
this.keyword=this.make_accessor("keyword",{reset_paging:true});
this.sort_by=this.make_accessor("sort_by",{reset_paging:true});
this.sortdir=this.make_accessor("sortdir",{reset_paging:true});
this.hide_duplicates=this.make_cookie_accessor("hide_duplicates","");
this.pagesize=this.make_cookie_accessor("pagesize","25");
this.div_id=_74a;
Object.extend(this._arguments,{query:this.query(),pagesize:this.pagesize(),cardtype:this.cardtype(),keyword:this.keyword(),sort_by:this.sort_by(),sortdir:this.sortdir()});
Wagn.highlight("sortdir",this.sortdir());
Wagn.highlight("sort_by",this.sort_by());
Wagn.highlight("pagesize",this.pagesize());
Wagn.highlight("hide_duplicates",this.hide_duplicates());
},open_all:function(){
$A(document.getElementsByClassName("open-link",$(this.div_id))).each(function(a){
a.onclick();
});
},close_all:function(){
$A(document.getElementsByClassName("line-link",$(this.div_id))).each(function(a){
a.onclick();
});
},cards_per_page:function(){
if(arguments[0]){
Cookie.set("cards_per_page");
}
return Cookie.get("cards_per_page");
},_cards:function(){
return this._card_slots().collect(function(slot){
return slot.card();
});
},_card_slots:function(){
return document.getElementsByClassName("card-slot",$(this.div_id));
},card_id:function(){
return (typeof (Wagn.main_card)=="undefined"?"":Wagn.main_card.id);
},display_type:function(){
if(arguments[0]!=null){
this._display_type=arguments[0];
}
return (this._display_type?this._display_type:"connection_list");
},query:function(){
field="query";
if(arguments[0]!=null){
this.page("1");
this._arguments[field]=arguments[0];
return this;
}else{
if(this._arguments.keys().include(field)){
return this._arguments[field];
}else{
return null;
}
}
},make_cookie_accessor:function(_74f,_750){
var self=this;
var _752=arguments[1]?this.card_id():"";
var _750=_750;
return function(){
if(arguments[0]!=null){
Cookie.set(_752+_74f,arguments[0]);
self._arguments[_74f]=arguments[0];
return self;
}else{
if(self._arguments.keys().include(_74f)){
return self._arguments[_74f];
}else{
if(val=Cookie.get(_752+_74f)){
return val;
}else{
return _750;
}
}
}
};
},make_accessor:function(_753){
options=Object.extend($H({reset_paging:false}),arguments[1]);
var self=this;
var _755=options["reset_paging"];
return function(){
if(arguments[0]!=null){
self._arguments[_753]=arguments[0];
if(_755){
self.page("1");
}
return self;
}else{
return self._arguments[_753];
}
};
},update:function(){
$("paging-links-copy").innerHTML="<img src=\"/images/wait.gif\">";
$(this.div_id).innerHTML="";
card_part=(this.card_id()=="")?"":"/"+this.card_id();
new Ajax.Updater(this.div_id,"/block/"+this.display_type()+card_part+".html",this._ajax_parameters(this._arguments));
this.set_button();
},new_connection:function(){
new Ajax.Updater("connections-workspace","/connection/new/"+this.card_id()+"?query=plussed_cards");
},set_button:function(){
if(!($("related-button"))){
return false;
}
button="&nbsp;";
query=this.query();
if(($("button-permission"))&&($("button-permission").innerHTML=="true")){
if((query=="plus_cards")||(query=="plussed_cards")){
button="<input type=\"button\" id=\"new-connection-button\" value=\"join it to another card\" onClick=\"Wagn.lister().new_connection ()\">";
}else{
if(query=="cardtype_cards"){
cardtype=Wagn.main_card.codename;
button="<input type=\"button\" value=\"create new one\" onClick=\"document.location.href='/card/new?card[type]="+cardtype+"'\">";
}
}
}
$("related-button").innerHTML=button;
},after_update:function(){
$("paging-links-copy").innerHTML=$("paging-links").innerHTML;
setupDoubleClickToEdit();
},_ajax_parameters:function(){
param_hash=arguments[0]?arguments[0]:{};
param_list=$A([]);
$H(param_hash).each(function(pair){
if(pair.value&&pair.value!=""){
param_list.push(pair.key+"="+encodeURIComponent(pair.value));
}
});
return {asynchronous:false,evalScripts:true,method:"get",onComplete:function(_757){
Wagn.lister().after_update();
},parameters:param_list.join("&")};
}});
var scwDateNow=new Date(Date.parse(new Date().toDateString()));
var scwBaseYear=scwDateNow.getFullYear()-10;
var scwDropDownYears=20;
var scwLanguage;
function scwSetDefaultLanguage(){
try{
scwSetLanguage();
}
catch(exception){
scwToday="Today:";
scwDrag="click here to drag";
scwArrMonthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
scwArrWeekInits=["S","M","T","W","T","F","S"];
scwInvalidDateMsg="The entered date is invalid.\n";
scwOutOfRangeMsg="The entered date is out of range.";
scwDoesNotExistMsg="The entered date does not exist.";
scwInvalidAlert=["Invalid date (",") ignored."];
scwDateDisablingError=["Error "," is not a Date object."];
scwRangeDisablingError=["Error "," should consist of two elements."];
}
}
var scwWeekStart=1;
var scwWeekNumberDisplay=false;
var scwWeekNumberBaseDay=4;
var scwShowInvalidDateMsg=true,scwShowOutOfRangeMsg=true,scwShowDoesNotExistMsg=true,scwShowInvalidAlert=true,scwShowDateDisablingError=true,scwShowRangeDisablingError=true;
var scwArrDelimiters=["/","-",".",","," "];
var scwDateDisplayFormat="YYYY-MM-DD";
var scwDateOutputFormat="YYYY-MM-DD";
var scwDateInputSequence="YMD";
var scwZindex=1;
var scwBlnStrict=false;
var scwEnabledDay=[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
var scwDisabledDates=new Array();
var scwActiveToday=true;
var scwOutOfMonthDisable=false;
var scwOutOfMonthHide=false;
var scwOutOfRangeDisable=true;
var scwAllowDrag=false;
var scwClickToHide=false;
document.writeln("<style type=\"text/css\">"+".scw           {padding:1px;vertical-align:middle;}"+"iframe.scw     {position:absolute;z-index:"+scwZindex+";top:0px;left:0px;visibility:hidden;"+"width:1px;height:1px;}"+"table.scw      {padding:0px;visibility:hidden;"+"position:absolute;cursor:default;"+"width:200px;top:0px;left:0px;"+"z-index:"+(scwZindex+1)+";text-align:center;}"+"</style>");
document.writeln("<style type=\"text/css\">"+"/* IMPORTANT:  The SCW calendar script requires all "+"               the classes defined here."+"*/"+"table.scw      {padding:       1px;"+"vertical-align:middle;"+"border:        ridge 2px;"+"font-size:     10pt;"+"font-family:   Arial,Helvetica,Sans-Serif;"+"font-weight:   bold;}"+"td.scwDrag,"+"td.scwHead                 {padding:       0px 0px;"+"text-align:    center;}"+"td.scwDrag                 {font-size:     8pt;}"+"select.scwHead             {margin:        3px 1px;"+"text-align:    center;}"+"input.scwHead              {height:        22px;"+"width:         22px;"+"vertical-align:middle;"+"text-align:    center;"+"margin:        2px 1px;"+"font-weight:   bold;"+"font-size:     10pt;"+"font-family:   fixedSys;}"+"td.scwWeekNumberHead,"+"td.scwWeek                 {padding:       0px;"+"text-align:    center;"+"font-weight:   bold;}"+"td.scwFoot,"+"td.scwFootHover,"+"td.scwFoot:hover,"+"td.scwFootDisabled         {padding:       0px;"+"text-align:    center;"+"font-weight:   normal;}"+"table.scwCells             {text-align:    right;"+"font-size:     8pt;"+"width:         96%;}"+"td.scwCells,"+"td.scwCellsHover,"+"td.scwCells:hover,"+"td.scwCellsDisabled,"+"td.scwCellsExMonth,"+"td.scwCellsExMonthHover,"+"td.scwCellsExMonth:hover,"+"td.scwCellsExMonthDisabled,"+"td.scwCellsWeekend,"+"td.scwCellsWeekendHover,"+"td.scwCellsWeekend:hover,"+"td.scwCellsWeekendDisabled,"+"td.scwInputDate,"+"td.scwInputDateHover,"+"td.scwInputDate:hover,"+"td.scwInputDateDisabled,"+"td.scwWeekNo,"+"td.scwWeeks                {padding:           3px;"+"width:             16px;"+"height:            16px;"+"font-weight:       bold;"+"vertical-align:    middle;}"+"/* Blend the colours into your page here...    */"+"/* Calendar background */"+"table.scw                  {background-color:  #6666CC;}"+"/* Drag Handle */"+"td.scwDrag                 {background-color:  #9999CC;"+"color:             #CCCCFF;}"+"/* Week number heading */"+"td.scwWeekNumberHead       {color:             #6666CC;}"+"/* Week day headings */"+"td.scwWeek                 {color:             #CCCCCC;}"+"/* Week numbers */"+"td.scwWeekNo               {background-color:  #776677;"+"color:             #CCCCCC;}"+"/* Enabled Days */"+"/* Week Day */"+"td.scwCells                {background-color:  #CCCCCC;"+"color:             #000000;}"+"/* Day matching the input date */"+"td.scwInputDate            {background-color:  #CC9999;"+"color:             #FF0000;}"+"/* Weekend Day */"+"td.scwCellsWeekend         {background-color:  #CCCCCC;"+"color:             #CC6666;}"+"/* Day outside the current month */"+"td.scwCellsExMonth         {background-color:  #CCCCCC;"+"color:             #666666;}"+"/* Today selector */"+"td.scwFoot                 {background-color:  #6666CC;"+"color:             #FFFFFF;}"+"/* MouseOver/Hover formatting "+"       If you want to \"turn off\" any of the formatting "+"       then just set to the same as the standard format"+"       above."+" "+"       Note: The reason that the following are"+"       implemented using both a class and a :hover"+"       pseudoclass is because Opera handles the rendering"+"       involved in the class swap very poorly and IE6 "+"       (and below) only implements pseudoclasses on the"+"       anchor tag."+"*/"+"/* Active cells */"+"td.scwCells:hover,"+"td.scwCellsHover           {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Day matching the input date */"+"td.scwInputDate:hover,"+"td.scwInputDateHover       {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Weekend cells */"+"td.scwCellsWeekend:hover,"+"td.scwCellsWeekendHover    {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Day outside the current month */"+"td.scwCellsExMonth:hover,"+"td.scwCellsExMonthHover    {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Today selector */"+"td.scwFoot:hover,"+"td.scwFootHover            {color:             #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"font-weight:       bold;}"+"/* Disabled cells */"+"/* Week Day */"+"/* Day matching the input date */"+"td.scwInputDateDisabled    {background-color:  #999999;"+"color:             #000000;}"+"td.scwCellsDisabled        {background-color:  #999999;"+"color:             #000000;}"+"/* Weekend Day */"+"td.scwCellsWeekendDisabled {background-color:  #999999;"+"color:             #CC6666;}"+"/* Day outside the current month */"+"td.scwCellsExMonthDisabled {background-color:  #999999;"+"color:             #666666;}"+"td.scwFootDisabled         {background-color:  #6666CC;"+"color:             #FFFFFF;}"+"</style>");
var scwTargetEle,scwTriggerEle,scwMonthSum=0,scwBlnFullInputDate=false,scwPassEnabledDay=new Array(),scwSeedDate=new Date(),scwParmActiveToday=true,scwWeekStart=scwWeekStart%7,scwToday,scwDrag,scwArrMonthNames,scwArrWeekInits,scwInvalidDateMsg,scwOutOfRangeMsg,scwDoesNotExistMsg,scwInvalidAlert,scwDateDisablingError,scwRangeDisablingError;
Date.prototype.scwFormat=function(_758){
var _759=0,_75a="",_75b="";
for(var i=0;i<=_758.length;i++){
if(i<_758.length&&_758.charAt(i)==_75a){
_759++;
}else{
switch(_75a){
case "y":
case "Y":
_75b+=(this.getFullYear()%Math.pow(10,_759)).toString().scwPadLeft(_759);
break;
case "m":
case "M":
_75b+=(_759<3)?(this.getMonth()+1).toString().scwPadLeft(_759):scwArrMonthNames[this.getMonth()];
break;
case "d":
case "D":
_75b+=this.getDate().toString().scwPadLeft(_759);
break;
default:
while(_759-->0){
_75b+=_75a;
}
}
if(i<_758.length){
_75a=_758.charAt(i);
_759=1;
}
}
}
return _75b;
};
String.prototype.scwPadLeft=function(_75d){
var _75e="";
for(var i=0;i<(_75d-this.length);i++){
_75e+="0";
}
return (_75e+this);
};
Function.prototype.runsAfterSCW=function(){
var func=this,args=new Array(arguments.length);
for(var i=0;i<args.length;++i){
args[i]=arguments[i];
}
return function(){
for(var i=0;i<arguments.length;++i){
args[args.length]=arguments[i];
}
return (args.shift()==scwTriggerEle)?func.apply(this,args):null;
};
};
function scwID(id){
return document.getElementById(id);
}
var scwNextActionReturn,scwNextAction;
function showCal(_765,_766){
scwShow(_765,_766);
}
function scwShow(_767,_768){
scwTriggerEle=_768;
scwParmActiveToday=true;
for(var i=0;i<7;i++){
scwPassEnabledDay[(i+7-scwWeekStart)%7]=true;
for(var j=2;j<arguments.length;j++){
if(arguments[j]==i){
scwPassEnabledDay[(i+7-scwWeekStart)%7]=false;
if(scwDateNow.getDay()==i){
scwParmActiveToday=false;
}
}
}
}
scwSeedDate=scwDateNow;
if(typeof _767.value=="undefined"){
var _76b=_767.childNodes;
for(var i=0;i<_76b.length;i++){
if(_76b[i].nodeType==3){
var _76c=_76b[i].nodeValue.replace(/^\s+/,"").replace(/\s+$/,"");
if(_76c.length>0){
scwTriggerEle.scwTextNode=_76b[i];
scwTriggerEle.scwLength=_76b[i].nodeValue.length;
break;
}
}
}
}else{
var _76c=_767.value.replace(/^\s+/,"").replace(/\s+$/,"");
}
scwSetDefaultLanguage();
scwID("scwDragText").innerHTML=scwDrag;
scwID("scwMonths").options.length=0;
for(var i=0;i<scwArrMonthNames.length;i++){
scwID("scwMonths").options[i]=new Option(scwArrMonthNames[i],scwArrMonthNames[i]);
}
scwID("scwYears").options.length=0;
for(var i=0;i<scwDropDownYears;i++){
scwID("scwYears").options[i]=new Option((scwBaseYear+i),(scwBaseYear+i));
}
for(var i=0;i<scwArrWeekInits.length;i++){
scwID("scwWeekInit"+i).innerHTML=scwArrWeekInits[(i+scwWeekStart)%scwArrWeekInits.length];
}
if(scwID("scwFoot")){
scwID("scwFoot").innerHTML=scwToday+" "+scwDateNow.scwFormat(scwDateDisplayFormat);
}
if(_76c.length==0){
scwBlnFullInputDate=false;
if((new Date(scwBaseYear+scwDropDownYears,0,0))<scwSeedDate||(new Date(scwBaseYear,0,1))>scwSeedDate){
scwSeedDate=new Date(scwBaseYear+Math.floor(scwDropDownYears/2),5,1);
}
}else{
function scwInputFormat(){
var _76d=new Array(),_76e=_76c.split(new RegExp("[\\"+scwArrDelimiters.join("\\")+"]+","g"));
if(_76e[0]!=null){
if(_76e[0].length==0){
_76e.splice(0,1);
}
if(_76e[_76e.length-1].length==0){
_76e.splice(_76e.length-1,1);
}
}
scwBlnFullInputDate=false;
switch(_76e.length){
case 1:
_76d[0]=parseInt(_76e[0],10);
_76d[1]="6";
_76d[2]=1;
break;
case 2:
_76d[0]=parseInt(_76e[scwDateInputSequence.replace(/D/i,"").search(/Y/i)],10);
_76d[1]=_76e[scwDateInputSequence.replace(/D/i,"").search(/M/i)];
_76d[2]=1;
break;
case 3:
_76d[0]=parseInt(_76e[scwDateInputSequence.search(/Y/i)],10);
_76d[1]=_76e[scwDateInputSequence.search(/M/i)];
_76d[2]=parseInt(_76e[scwDateInputSequence.search(/D/i)],10);
scwBlnFullInputDate=true;
break;
default:
_76d[0]=0;
_76d[1]=0;
_76d[2]=0;
}
var _76f=/^(0?[1-9]|[1-2]\d|3[0-1])$/,_770=new RegExp("^(0?[1-9]|1[0-2]|"+scwArrMonthNames.join("|")+")$","i"),_771=/^(\d{1,2}|\d{4})$/;
if(_771.exec(_76d[0])==null||_770.exec(_76d[1])==null||_76f.exec(_76d[2])==null){
if(scwShowInvalidDateMsg){
alert(scwInvalidDateMsg+scwInvalidAlert[0]+_76c+scwInvalidAlert[1]);
}
scwBlnFullInputDate=false;
_76d[0]=scwBaseYear+Math.floor(scwDropDownYears/2);
_76d[1]="6";
_76d[2]=1;
}
return _76d;
}
scwArrSeedDate=scwInputFormat();
if(scwArrSeedDate[0]<100){
scwArrSeedDate[0]+=(scwArrSeedDate[0]>50)?1900:2000;
}
if(scwArrSeedDate[1].search(/\d+/)!=0){
month=scwArrMonthNames.join("|").toUpperCase().search(scwArrSeedDate[1].substr(0,3).toUpperCase());
scwArrSeedDate[1]=Math.floor(month/4)+1;
}
scwSeedDate=new Date(scwArrSeedDate[0],scwArrSeedDate[1]-1,scwArrSeedDate[2]);
}
if(isNaN(scwSeedDate)){
if(scwShowInvalidDateMsg){
alert(scwInvalidDateMsg+scwInvalidAlert[0]+_76c+scwInvalidAlert[1]);
}
scwSeedDate=new Date(scwBaseYear+Math.floor(scwDropDownYears/2),5,1);
scwBlnFullInputDate=false;
}else{
if((new Date(scwBaseYear,0,1))>scwSeedDate){
if(scwBlnStrict&&scwShowOutOfRangeMsg){
alert(scwOutOfRangeMsg);
}
scwSeedDate=new Date(scwBaseYear,0,1);
scwBlnFullInputDate=false;
}else{
if((new Date(scwBaseYear+scwDropDownYears,0,0))<scwSeedDate){
if(scwBlnStrict&&scwShowOutOfRangeMsg){
alert(scwOutOfRangeMsg);
}
scwSeedDate=new Date(scwBaseYear+Math.floor(scwDropDownYears)-1,11,1);
scwBlnFullInputDate=false;
}else{
if(scwBlnStrict&&scwBlnFullInputDate&&(scwSeedDate.getDate()!=scwArrSeedDate[2]||(scwSeedDate.getMonth()+1)!=scwArrSeedDate[1]||scwSeedDate.getFullYear()!=scwArrSeedDate[0])){
if(scwShowDoesNotExistMsg){
alert(scwDoesNotExistMsg);
}
scwSeedDate=new Date(scwSeedDate.getFullYear(),scwSeedDate.getMonth()-1,1);
scwBlnFullInputDate=false;
}
}
}
}
for(var i=0;i<scwDisabledDates.length;i++){
if(!((typeof scwDisabledDates[i]=="object")&&(scwDisabledDates[i].constructor==Date))){
if((typeof scwDisabledDates[i]=="object")&&(scwDisabledDates[i].constructor==Array)){
var _772=true;
if(scwDisabledDates[i].length!=2){
if(scwShowRangeDisablingError){
alert(scwRangeDisablingError[0]+scwDisabledDates[i]+scwRangeDisablingError[1]);
}
_772=false;
}else{
for(var j=0;j<scwDisabledDates[i].length;j++){
if(!((typeof scwDisabledDates[i][j]=="object")&&(scwDisabledDates[i][j].constructor==Date))){
if(scwShowRangeDisablingError){
alert(scwDateDisablingError[0]+scwDisabledDates[i][j]+scwDateDisablingError[1]);
}
_772=false;
}
}
}
if(_772&&(scwDisabledDates[i][0]>scwDisabledDates[i][1])){
scwDisabledDates[i].reverse();
}
}else{
if(scwShowRangeDisablingError){
alert(scwDateDisablingError[0]+scwDisabledDates[i]+scwDateDisablingError[1]);
}
}
}
}
scwMonthSum=12*(scwSeedDate.getFullYear()-scwBaseYear)+scwSeedDate.getMonth();
scwID("scwYears").options.selectedIndex=Math.floor(scwMonthSum/12);
scwID("scwMonths").options.selectedIndex=(scwMonthSum%12);
if(window.opera){
scwID("scwMonths").style.display="none";
scwID("scwMonths").style.display="block";
scwID("scwYears").style.display="none";
scwID("scwYears").style.display="block";
}
scwID("scwDrag").style.display=(scwAllowDrag)?((scwID("scwIFrame"))?"block":"table-row"):"none";
scwShowMonth(0);
scwTargetEle=_767;
var _773=parseInt(_767.offsetTop,10)+parseInt(_767.offsetHeight,10),_774=parseInt(_767.offsetLeft,10);
if(!window.opera){
while(_767.tagName!="BODY"&&_767.tagName!="HTML"){
_773-=parseInt(_767.scrollTop,10);
_774-=parseInt(_767.scrollLeft,10);
_767=_767.parentNode;
}
_767=scwTargetEle;
}
do{
_767=_767.offsetParent;
_773+=parseInt(_767.offsetTop,10);
_774+=parseInt(_767.offsetLeft,10);
}while(_767.tagName!="BODY"&&_767.tagName!="HTML");
scwID("scw").style.top=_773+"px";
scwID("scw").style.left=_774+"px";
if(scwID("scwIframe")){
scwID("scwIframe").style.top=_773+"px";
scwID("scwIframe").style.left=_774+"px";
scwID("scwIframe").style.width=(scwID("scw").offsetWidth-2)+"px";
scwID("scwIframe").style.height=(scwID("scw").offsetHeight-2)+"px";
scwID("scwIframe").style.visibility="visible";
}
scwID("scw").style.visibility="visible";
scwID("scwYears").options.selectedIndex=scwID("scwYears").options.selectedIndex;
scwID("scwMonths").options.selectedIndex=scwID("scwMonths").options.selectedIndex;
var el=(_768.parentNode)?_768.parentNode:_768;
if(typeof event=="undefined"){
el.addEventListener("click",scwStopPropagation,false);
}else{
if(el.attachEvent){
el.attachEvent("onclick",scwStopPropagation);
}else{
event.cancelBubble=true;
}
}
}
function scwHide(){
scwID("scw").style.visibility="hidden";
if(scwID("scwIframe")){
scwID("scwIframe").style.visibility="hidden";
}
if(typeof scwNextAction!="undefined"&&scwNextAction!=null){
scwNextActionReturn=scwNextAction();
scwNextAction=null;
}
}
function scwCancel(_776){
if(scwClickToHide){
scwHide();
}
scwStopPropagation(_776);
}
function scwStopPropagation(_777){
if(_777.stopPropagation){
_777.stopPropagation();
}else{
_777.cancelBubble=true;
}
}
function scwBeginDrag(_778){
var _779=scwID("scw");
var _77a=_778.clientX,_77b=_778.clientY,_77c=_779;
do{
_77a-=parseInt(_77c.offsetLeft,10);
_77b-=parseInt(_77c.offsetTop,10);
_77c=_77c.offsetParent;
}while(_77c.tagName!="BODY"&&_77c.tagName!="HTML");
if(document.addEventListener){
document.addEventListener("mousemove",moveHandler,true);
document.addEventListener("mouseup",upHandler,true);
}else{
_779.attachEvent("onmousemove",moveHandler);
_779.attachEvent("onmouseup",upHandler);
_779.setCapture();
}
scwStopPropagation(_778);
function moveHandler(_77d){
if(!_77d){
_77d=window.event;
}
_779.style.left=(_77d.clientX-_77a)+"px";
_779.style.top=(_77d.clientY-_77b)+"px";
if(scwID("scwIframe")){
scwID("scwIframe").style.left=(_77d.clientX-_77a)+"px";
scwID("scwIframe").style.top=(_77d.clientY-_77b)+"px";
}
scwStopPropagation(_77d);
}
function upHandler(_77e){
if(!_77e){
_77e=window.event;
}
if(document.removeEventListener){
document.removeEventListener("mousemove",moveHandler,true);
document.removeEventListener("mouseup",upHandler,true);
}else{
_779.detachEvent("onmouseup",upHandler);
_779.detachEvent("onmousemove",moveHandler);
_779.releaseCapture();
}
scwStopPropagation(_77e);
}
}
function scwShowMonth(_77f){
var _780=new Date(Date.parse(new Date().toDateString())),_781=new Date();
_780.setHours(12);
scwSelYears=scwID("scwYears");
scwSelMonths=scwID("scwMonths");
if(scwSelYears.options.selectedIndex>-1){
scwMonthSum=12*(scwSelYears.options.selectedIndex)+_77f;
if(scwSelMonths.options.selectedIndex>-1){
scwMonthSum+=scwSelMonths.options.selectedIndex;
}
}else{
if(scwSelMonths.options.selectedIndex>-1){
scwMonthSum+=scwSelMonths.options.selectedIndex;
}
}
_780.setFullYear(scwBaseYear+Math.floor(scwMonthSum/12),(scwMonthSum%12),1);
scwID("scwWeek_").style.display=(scwWeekNumberDisplay)?((scwID("scwIFrame"))?"block":"table-cell"):"none";
if((12*parseInt((_780.getFullYear()-scwBaseYear),10))+parseInt(_780.getMonth(),10)<(12*scwDropDownYears)&&(12*parseInt((_780.getFullYear()-scwBaseYear),10))+parseInt(_780.getMonth(),10)>-1){
scwSelYears.options.selectedIndex=Math.floor(scwMonthSum/12);
scwSelMonths.options.selectedIndex=(scwMonthSum%12);
scwCurMonth=_780.getMonth();
_780.setDate((((_780.getDay()-scwWeekStart)<0)?-6:1)+scwWeekStart-_780.getDay());
var _782=new Date(_780.getFullYear(),_780.getMonth(),_780.getDate()).valueOf();
_781=new Date(_780);
var _783=scwID("scwFoot");
function scwFootOutput(){
scwSetOutput(scwDateNow);
}
if(scwDisabledDates.length==0){
if(scwActiveToday&&scwParmActiveToday){
_783.onclick=scwFootOutput;
_783.className="scwFoot";
if(scwID("scwIFrame")){
_783.onmouseover=scwChangeClass;
_783.onmouseout=scwChangeClass;
}
}else{
_783.onclick=null;
_783.className="scwFootDisabled";
if(scwID("scwIFrame")){
_783.onmouseover=null;
_783.onmouseout=null;
}
if(document.addEventListener){
_783.addEventListener("click",scwStopPropagation,false);
}else{
_783.attachEvent("onclick",scwStopPropagation);
}
}
}else{
for(var k=0;k<scwDisabledDates.length;k++){
if(!scwActiveToday||!scwParmActiveToday||((typeof scwDisabledDates[k]=="object")&&(((scwDisabledDates[k].constructor==Date)&&scwDateNow.valueOf()==scwDisabledDates[k].valueOf())||((scwDisabledDates[k].constructor==Array)&&scwDateNow.valueOf()>=scwDisabledDates[k][0].valueOf()&&scwDateNow.valueOf()<=scwDisabledDates[k][1].valueOf())))){
_783.onclick=null;
_783.className="scwFootDisabled";
if(scwID("scwIFrame")){
_783.onmouseover=null;
_783.onmouseout=null;
}
if(document.addEventListener){
_783.addEventListener("click",scwStopPropagation,false);
}else{
_783.attachEvent("onclick",scwStopPropagation);
}
break;
}else{
_783.onclick=scwFootOutput;
_783.className="scwFoot";
if(scwID("scwIFrame")){
_783.onmouseover=scwChangeClass;
_783.onmouseout=scwChangeClass;
}
}
}
}
function scwSetOutput(_785){
if(typeof scwTargetEle.value=="undefined"){
scwTriggerEle.scwTextNode.replaceData(0,scwTriggerEle.scwLength,_785.scwFormat(scwDateOutputFormat));
}else{
scwTargetEle.value=_785.scwFormat(scwDateOutputFormat);
}
scwHide();
}
function scwCellOutput(_786){
var _787=scwEventTrigger(_786),_788=new Date(_781);
if(_787.nodeType==3){
_787=_787.parentNode;
}
_788.setDate(_781.getDate()+parseInt(_787.id.substr(8),10));
scwSetOutput(_788);
}
function scwChangeClass(_789){
var _78a=scwEventTrigger(_789);
if(_78a.nodeType==3){
_78a=_78a.parentNode;
}
switch(_78a.className){
case "scwCells":
_78a.className="scwCellsHover";
break;
case "scwCellsHover":
_78a.className="scwCells";
break;
case "scwCellsExMonth":
_78a.className="scwCellsExMonthHover";
break;
case "scwCellsExMonthHover":
_78a.className="scwCellsExMonth";
break;
case "scwCellsWeekend":
_78a.className="scwCellsWeekendHover";
break;
case "scwCellsWeekendHover":
_78a.className="scwCellsWeekend";
break;
case "scwFoot":
_78a.className="scwFootHover";
break;
case "scwFootHover":
_78a.className="scwFoot";
break;
case "scwInputDate":
_78a.className="scwInputDateHover";
break;
case "scwInputDateHover":
_78a.className="scwInputDate";
}
return true;
}
function scwEventTrigger(_78b){
if(!_78b){
_78b=event;
}
return _78b.target||_78b.srcElement;
}
function scwWeekNumber(_78c){
var _78d=new Date(_78c);
_78d.setDate(_78d.getDate()-_78d.getDay()+scwWeekNumberBaseDay+((_78c.getDay()>scwWeekNumberBaseDay)?7:0));
var _78e=new Date(_78d.getFullYear(),0,1);
_78e.setDate(_78e.getDate()-_78e.getDay()+scwWeekNumberBaseDay);
if(_78e<new Date(_78d.getFullYear(),0,1)){
_78e.setDate(_78e.getDate()+7);
}
var _78f=new Date(_78e-scwWeekNumberBaseDay+_78c.getDay());
if(_78f>_78e){
_78f.setDate(_78f.getDate()-7);
}
var _790="0"+(Math.round((_78d-_78e)/604800000,0)+1);
return _790.substring(_790.length-2,_790.length);
}
var _791=scwID("scwCells");
for(i=0;i<_791.childNodes.length;i++){
var _792=_791.childNodes[i];
if(_792.nodeType==1&&_792.tagName=="TR"){
if(scwWeekNumberDisplay){
_792.childNodes[0].innerHTML=scwWeekNumber(_780);
_792.childNodes[0].style.display=(scwID("scwIFrame"))?"block":"table-cell";
}else{
_792.childNodes[0].style.display="none";
}
for(j=1;j<_792.childNodes.length;j++){
var _793=_792.childNodes[j];
if(_793.nodeType==1&&_793.tagName=="TD"){
_792.childNodes[j].innerHTML=_780.getDate();
var _794=_792.childNodes[j],_795=((scwOutOfRangeDisable&&(_780<(new Date(scwBaseYear,0,1,_780.getHours()))||_780>(new Date(scwBaseYear+scwDropDownYears,0,0,_780.getHours()))))||(scwOutOfMonthDisable&&(_780<(new Date(_780.getFullYear(),scwCurMonth,1,_780.getHours()))||_780>(new Date(_780.getFullYear(),scwCurMonth+1,0,_780.getHours())))))?true:false;
_794.style.visibility=(scwOutOfMonthHide&&(_780<(new Date(_780.getFullYear(),scwCurMonth,1,_780.getHours()))||_780>(new Date(_780.getFullYear(),scwCurMonth+1,0,_780.getHours()))))?"hidden":"";
for(var k=0;k<scwDisabledDates.length;k++){
if((typeof scwDisabledDates[k]=="object")&&(scwDisabledDates[k].constructor==Date)&&_782==scwDisabledDates[k].valueOf()){
_795=true;
}else{
if((typeof scwDisabledDates[k]=="object")&&(scwDisabledDates[k].constructor==Array)&&_782>=scwDisabledDates[k][0].valueOf()&&_782<=scwDisabledDates[k][1].valueOf()){
_795=true;
}
}
}
if(_795||!scwEnabledDay[j-1+(7*((i*_791.childNodes.length)/6))]||!scwPassEnabledDay[(j-1+(7*(i*_791.childNodes.length/6)))%7]){
_792.childNodes[j].onclick=null;
if(scwID("scwIFrame")){
_792.childNodes[j].onmouseover=null;
_792.childNodes[j].onmouseout=null;
}
_794.className=(_780.getMonth()!=scwCurMonth)?"scwCellsExMonthDisabled":(scwBlnFullInputDate&&_780.toDateString()==scwSeedDate.toDateString())?"scwInputDateDisabled":(_780.getDay()%6==0)?"scwCellsWeekendDisabled":"scwCellsDisabled";
}else{
_792.childNodes[j].onclick=scwCellOutput;
if(scwID("scwIFrame")){
_792.childNodes[j].onmouseover=scwChangeClass;
_792.childNodes[j].onmouseout=scwChangeClass;
}
_794.className=(_780.getMonth()!=scwCurMonth)?"scwCellsExMonth":(scwBlnFullInputDate&&_780.toDateString()==scwSeedDate.toDateString())?"scwInputDate":(_780.getDay()%6==0)?"scwCellsWeekend":"scwCells";
}
_780.setDate(_780.getDate()+1);
_782=new Date(_780.getFullYear(),_780.getMonth(),_780.getDate()).valueOf();
}
}
}
}
}
scwID("scw").style.visibility="hidden";
scwID("scw").style.visibility="visible";
}
document.write("<!--[if IE]>"+"<iframe class='scw' src='/scwblank.html' "+"id='scwIframe' name='scwIframe' "+"frameborder='0'>"+"</iframe>"+"<![endif]-->"+"<table id='scw' class='scw'>"+"<tr class='scw'>"+"<td class='scw'>"+"<table class='scwHead' id='scwHead' width='100%' "+"cellspacing='0' cellpadding='0'>"+"<tr id='scwDrag' style='display:none;'>"+"<td colspan='4' class='scwDrag' "+"onmousedown='scwBeginDrag(event);'>"+"<div id='scwDragText'></div>"+"</td>"+"</tr>"+"<tr class='scwHead' >"+"<td class='scwHead'>"+"<input class='scwHead' id='scwHeadLeft' type='button' value='<' "+"onclick='scwShowMonth(-1);'  /></td>"+"<td class='scwHead'>"+"<select id='scwMonths' class='scwHead' "+"onchange='scwShowMonth(0);'>"+"</select>"+"</td>"+"<td class='scwHead'>"+"<select id='scwYears' class='scwHead' "+"onchange='scwShowMonth(0);'>"+"</select>"+"</td>"+"<td class='scwHead'>"+"<input class='scwHead' id='scwHeadRight' type='button' value='>' "+"onclick='scwShowMonth(1);' /></td>"+"</tr>"+"</table>"+"</td>"+"</tr>"+"<tr class='scw'>"+"<td class='scw'>"+"<table class='scwCells' align='center'>"+"<thead>"+"<tr><td class='scwWeekNumberHead' id='scwWeek_' ></td>");
for(i=0;i<7;i++){
document.write("<td class='scwWeek' id='scwWeekInit"+i+"'></td>");
}
document.write("</tr>"+"</thead>"+"<tbody id='scwCells' "+"onClick='scwStopPropagation(event);'>");
for(i=0;i<6;i++){
document.write("<tr>"+"<td class='scwWeekNo' id='scwWeek_"+i+"'></td>");
for(j=0;j<7;j++){
document.write("<td class='scwCells' id='scwCell_"+(j+(i*7))+"'></td>");
}
document.write("</tr>");
}
document.write("</tbody>");
if((new Date(scwBaseYear+scwDropDownYears,11,32))>scwDateNow&&(new Date(scwBaseYear,0,0))<scwDateNow){
document.write("<tfoot class='scwFoot'>"+"<tr class='scwFoot'>"+"<td class='scwFoot' id='scwFoot' colspan='8'>"+"</td>"+"</tr>"+"</tfoot>");
}
document.write("</table>"+"</td>"+"</tr>"+"</table>");
if(document.addEventListener){
scwID("scw").addEventListener("click",scwCancel,false);
scwID("scwHeadLeft").addEventListener("click",scwStopPropagation,false);
scwID("scwMonths").addEventListener("click",scwStopPropagation,false);
scwID("scwMonths").addEventListener("change",scwStopPropagation,false);
scwID("scwYears").addEventListener("click",scwStopPropagation,false);
scwID("scwYears").addEventListener("change",scwStopPropagation,false);
scwID("scwHeadRight").addEventListener("click",scwStopPropagation,false);
}else{
scwID("scw").attachEvent("onclick",scwCancel);
scwID("scwHeadLeft").attachEvent("onclick",scwStopPropagation);
scwID("scwMonths").attachEvent("onclick",scwStopPropagation);
scwID("scwMonths").attachEvent("onchange",scwStopPropagation);
scwID("scwYears").attachEvent("onclick",scwStopPropagation);
scwID("scwYears").attachEvent("onchange",scwStopPropagation);
scwID("scwHeadRight").attachEvent("onclick",scwStopPropagation);
}
if(document.addEventListener){
document.addEventListener("click",scwHide,false);
}else{
document.attachEvent("onclick",scwHide);
}
Wagn.Link=Class.create();
Object.extend(Wagn.Link,{new_from_link:function(link){
return Object.extend(link,{is_bound:function(){
return this.attributes["bound"]&&this.attributes["bound"].value=="true";
},links_to:function(){
return this.attributes["href"].value;
},reads_as:function(){
return this.innerHTML;
},update_bound:function(){
if(this.is_bound()){
this.attributes["href"].value=this.reads_as().linkify();
}
}});
},new_from_text:function(text){
link=Builder.node("a",{bound:true,href:text.linkify()},[text]);
return this.new_from_link(link);
}});
Object.extend(String.prototype,{linkify:function(){
return this.gsub(/\s/,"_").gsub(/\%20/,"_");
},unlinkify:function(){
return this.gsub(/_/," ").gsub(/\/wiki\//,"");
}});
Wagn.LinkEditor=Class.create();
Object.extend(Wagn.LinkEditor,{raw_to_editable:function(_798){
generate_anchor=function(_799){
reads_as=_799[1];
links_to=(_799[2]?_799[2]:reads_as).linkify();
bound=reads_as.linkify()==links_to?true:false;
t="<a bound=\"#{bound}\" href=\"#{links_to}\">#{reads_as}</a>";
return new Template(t).evaluate({bound:bound,reads_as:reads_as,links_to:links_to});
};
_798=_798.gsub(/\[\[([^\]]+)\]\]/,generate_anchor);
_798=_798.gsub(/\[([^\]]+)\]\[([^\]]+)\]/,generate_anchor);
return _798;
},editable_to_raw:function(_79a,_79b){
_79b.innerHTML=_79a;
$A(_79b.getElementsByTagName("a")).each(function(e){
if(e.attributes["href"]){
link=Wagn.Link.new_from_link(e);
link.update_bound();
if(e.innerHTML==""){
Element.replace(e,"");
}else{
if(link.is_bound()){
Element.replace(e,"[["+e.innerHTML+"]]");
}else{
Element.replace(e,"["+e.innerHTML+"]["+e.attributes["href"].value+"]");
}
}
}
});
return _79b.innerHTML;
}});
Object.extend(Wagn.LinkEditor.prototype,{initialize:function(_79d){
this.wysiwyg=_79d;
this.selection=this.get_selection();
Wagn.linkEditor=this;
},get_selection:function(){
if(Wikiwyg.is_ie){
return this.wysiwyg.get_edit_document().selection;
}else{
return this.wysiwyg.get_edit_window().getSelection();
}
},get_selection_text:function(){
return this.get_selection().toString();
},get_selection_ancestor:function(){
return this.get_selection().getRangeAt(0).commonAncestorContainer;
},edit:function(){
node=this.get_selection_ancestor();
if(link=this.inside_link_node(node)){
this.link=Wagn.Link.new_from_link(link);
this.new_link=false;
}else{
if(this.node_contains_link(node)){
alert("Oops, can't link this text because there's a link inside it");
return false;
}else{
this.link=Wagn.Link.new_from_text(this.get_selection_text());
this.new_link=true;
}
}
this.open_popup();
},inside_link_node:function(node){
if(node&&node.tagName=="A"){
return node;
}else{
if(node.parentNode){
return this.inside_link_node(node.parentNode);
}else{
return false;
}
}
},node_contains_link:function(node){
if(node.getElementsByTagName&&$A(node.getElementsByTagName("a")).length>0){
return true;
}else{
return false;
}
},replace_selection_with:function(node){
r=this.get_selection().getRangeAt(0);
r.deleteContents();
r.insertNode(node);
},save:function(_7a1,_7a2){
if(_7a1.linkify()==_7a2.linkify()){
this.link.setAttribute("bound",true);
}else{
this.link.setAttribute("bound",false);
}
this.link.attributes["href"].value=_7a2.linkify();
this.link.innerHTML=_7a1;
if(this.new_link){
this.replace_selection_with(link);
}
Windows.close("linkwin");
},unlink:function(_7a3){
if(!this.new_link){
Element.replace(this.link,_7a3);
}
Windows.close("linkwin");
},cancel:function(){
Windows.close("linkwin");
},update_bounded:function(){
if(this.link.is_bound()){
}
},open_popup:function(){
if(Wagn.linkwin){
Wagn.linkwin.setLocation(30+window.scrollY,30);
}else{
Wagn.linkwin=new Window("linkwin",{className:"mac_os_x",title:"Link Editor",top:30+window.scrollY,left:30,width:550,height:108,showEffectOptions:{duration:0.2},hideEffectOptions:{duration:0.2}});
}
$("linkwin_content").innerHTML="<div id=\"link-editor\">"+"<div><label>reads&nbsp;as:&nbsp;</label><input type=\"text\" size=\"30\" id=\"reads_as\" /></div>"+"<div><label>links&nbsp;to:&nbsp;</label><input type=\"text\" size=\"45\" id=\"links_to\" /></div>"+"<div class=\"buttons\">"+"<input type=\"button\" onclick=\"Wagn.linkEditor.save($F('reads_as'), $F('links_to'))\" value=\"Update Link\"/>"+"<input type=\"button\" onclick=\"Wagn.linkEditor.unlink($F('reads_as'))\" value=\"Delete Link\"/>"+"<input type=\"button\" onclick=\"Wagn.linkEditor.cancel()\" value=\"Cancel\"/>"+"</div></div>";
Wagn.Link.new_from_link(this.link).update_bound();
$("reads_as").value=this.link.reads_as();
$("links_to").value=this.link.links_to().unlinkify();
Wagn.linkwin.show();
}});
var Builder={NODEMAP:{AREA:"map",CAPTION:"table",COL:"table",COLGROUP:"table",LEGEND:"fieldset",OPTGROUP:"select",OPTION:"select",PARAM:"object",TBODY:"table",TD:"table",TFOOT:"table",TH:"table",THEAD:"table",TR:"table"},node:function(_7a4){
_7a4=_7a4.toUpperCase();
var _7a5=this.NODEMAP[_7a4]||"div";
var _7a6=document.createElement(_7a5);
try{
_7a6.innerHTML="<"+_7a4+"></"+_7a4+">";
}
catch(e){
}
var _7a7=_7a6.firstChild||null;
if(_7a7&&(_7a7.tagName!=_7a4)){
_7a7=_7a7.getElementsByTagName(_7a4)[0];
}
if(!_7a7){
_7a7=document.createElement(_7a4);
}
if(!_7a7){
return;
}
if(arguments[1]){
if(this._isStringOrNumber(arguments[1])||(arguments[1] instanceof Array)){
this._children(_7a7,arguments[1]);
}else{
var _7a8=this._attributes(arguments[1]);
if(_7a8.length){
try{
_7a6.innerHTML="<"+_7a4+" "+_7a8+"></"+_7a4+">";
}
catch(e){
}
_7a7=_7a6.firstChild||null;
if(!_7a7){
_7a7=document.createElement(_7a4);
for(attr in arguments[1]){
_7a7[attr=="class"?"className":attr]=arguments[1][attr];
}
}
if(_7a7.tagName!=_7a4){
_7a7=_7a6.getElementsByTagName(_7a4)[0];
}
}
}
}
if(arguments[2]){
this._children(_7a7,arguments[2]);
}
return _7a7;
},_text:function(text){
return document.createTextNode(text);
},ATTR_MAP:{"className":"class","htmlFor":"for"},_attributes:function(_7aa){
var _7ab=[];
for(attribute in _7aa){
_7ab.push((attribute in this.ATTR_MAP?this.ATTR_MAP[attribute]:attribute)+"=\""+_7aa[attribute].toString().escapeHTML()+"\"");
}
return _7ab.join(" ");
},_children:function(_7ac,_7ad){
if(typeof _7ad=="object"){
_7ad.flatten().each(function(e){
if(typeof e=="object"){
_7ac.appendChild(e);
}else{
if(Builder._isStringOrNumber(e)){
_7ac.appendChild(Builder._text(e));
}
}
});
}else{
if(Builder._isStringOrNumber(_7ad)){
_7ac.appendChild(Builder._text(_7ad));
}
}
},_isStringOrNumber:function(_7af){
return (typeof _7af=="string"||typeof _7af=="number");
},build:function(html){
var _7b1=this.node("div");
$(_7b1).update(html.strip());
return _7b1.down();
},dump:function(_7b2){
if(typeof _7b2!="object"&&typeof _7b2!="function"){
_7b2=window;
}
var tags=("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY "+"BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET "+"FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+"KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+"PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+"TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
tags.each(function(tag){
_7b2[tag]=function(){
return Builder.node.apply(Builder,[tag].concat($A(arguments)));
};
});
}};
var Window=Class.create();
Window.prototype={initialize:function(id){
this.hasEffectLib=String.prototype.parseColor!=null;
this.options=Object.extend({className:"dialog",minWidth:100,minHeight:20,resizable:true,closable:true,minimizable:true,maximizable:true,draggable:true,userData:null,showEffect:(this.hasEffectLib?Effect.Appear:Element.show),hideEffect:(this.hasEffectLib?Effect.Fade:Element.hide),showEffectOptions:{},hideEffectOptions:{},effectOptions:null,parent:document.getElementsByTagName("body").item(0),title:"&nbsp;",url:null,onload:Prototype.emptyFunction,width:200,height:300,opacity:1},arguments[1]||{});
if(this.options.effectOptions){
Object.extend(this.options.hideEffectOptions,this.options.effectOptions);
Object.extend(this.options.showEffectOptions,this.options.effectOptions);
}
if(this.options.hideEffect==Element.hide){
this.options.hideEffect=function(){
Element.hide(this.element);
if(this.destroyOnClose){
this.destroy();
}
}.bind(this);
}
this.element=this._createWindow(id);
this.eventMouseDown=this._initDrag.bindAsEventListener(this);
this.eventMouseUp=this._endDrag.bindAsEventListener(this);
this.eventMouseMove=this._updateDrag.bindAsEventListener(this);
this.eventKeyPress=this._keyPress.bindAsEventListener(this);
this.eventOnLoad=this._getWindowBorderSize.bindAsEventListener(this);
this.topbar=$(this.element.id+"_top");
this.bottombar=$(this.element.id+"_bottom");
Event.observe(this.topbar,"mousedown",this.eventMouseDown);
Event.observe(this.bottombar,"mousedown",this.eventMouseDown);
Event.observe(window,"load",this.eventOnLoad);
if(this.options.draggable){
this.bottombar.addClassName("bottom_draggable");
this.topbar.addClassName("top_draggable");
}
if(this.options.resizable){
this.sizer=$(this.element.id+"_sizer");
Event.observe(this.sizer,"mousedown",this.eventMouseDown);
}
this.useLeft=null;
this.useTop=null;
if(arguments[1].left!=null){
this.element.setStyle({left:parseFloat(arguments[1].left)+"px"});
this.useLeft=true;
}
if(arguments[1].right!=null){
this.element.setStyle({right:parseFloat(arguments[1].right)+"px"});
this.useLeft=false;
}
if(this.useLeft==null){
this.element.setStyle({left:"0px"});
this.useLeft=true;
}
if(arguments[1].top!=null){
this.element.setStyle({top:parseFloat(arguments[1].top)+"px"});
this.useTop=true;
}
if(arguments[1].bottom!=null){
this.element.setStyle({bottom:parseFloat(arguments[1].bottom)+"px"});
this.useTop=false;
}
if(this.useTop==null){
this.element.setStyle({top:"0px"});
this.useTop=true;
}
this.storedLocation=null;
this.setOpacity(this.options.opacity);
if(arguments[1].zIndex){
this.setZIndex(arguments[1].zIndex);
}
this.destroyOnClose=false;
this._getWindowBorderSize();
this.setSize(this.options.width,this.options.height);
this.setTitle(this.options.title);
Windows.register(this);
},destroy:function(){
Windows.notify("onDestroy",this);
Event.stopObserving(this.topbar,"mousedown",this.eventMouseDown);
Event.stopObserving(this.bottombar,"mousedown",this.eventMouseDown);
Event.stopObserving(window,"load",this.eventOnLoad);
Event.stopObserving($(this.element.id+"_content"),"load",this.options.onload);
if(this.sizer){
Event.stopObserving(this.sizer,"mousedown",this.eventMouseDown);
}
if(this.iefix){
Element.remove(this.iefix);
}
Element.remove(this.element);
Windows.unregister(this);
},setDelegate:function(_7b6){
this.delegate=_7b6;
},getDelegate:function(){
return this.delegate;
},getContent:function(){
return $(this.element.id+"_content");
},setContent:function(id,_7b8,_7b9){
var d=null;
var p=null;
if(_7b8){
d=Element.getDimensions(id);
}
if(_7b9){
p=Position.cumulativeOffset($(id));
}
var _7bc=this.getContent();
_7bc.appendChild($(id));
$(id).show();
if(_7b8){
this.setSize(d.width,d.height);
}
if(_7b9){
this.setLocation(p[1]-this.heightN,p[0]-this.widthW);
}
},setCookie:function(name,_7be,path,_7c0,_7c1){
name=name||this.element.id;
this.cookie=[name,_7be,path,_7c0,_7c1];
var _7c2=WindowUtilities.getCookie(name);
if(_7c2){
var _7c3=_7c2.split(",");
var x=_7c3[0].split(":");
var y=_7c3[1].split(":");
var w=parseFloat(_7c3[2]),h=parseFloat(_7c3[3]);
var mini=_7c3[4];
var maxi=_7c3[5];
this.setSize(w,h);
if(mini=="true"){
this.doMinimize=true;
}else{
if(maxi=="true"){
this.doMaximize=true;
}
}
this.useLeft=x[0]=="l";
this.useTop=y[0]=="t";
this.element.setStyle(this.useLeft?{left:x[1]}:{right:x[1]});
this.element.setStyle(this.useTop?{top:y[1]}:{bottom:y[1]});
}
},getId:function(){
return this.element.id;
},setDestroyOnClose:function(){
Object.extend(this.options.hideEffectOptions,{afterFinish:this.destroy.bind(this)});
this.destroyOnClose=true;
},_initDrag:function(_7ca){
this.pointer=[Event.pointerX(_7ca),Event.pointerY(_7ca)];
if(Event.element(_7ca)==this.sizer){
this.doResize=true;
this.widthOrg=this.width;
this.heightOrg=this.height;
this.bottomOrg=parseFloat(this.element.getStyle("bottom"));
this.rightOrg=parseFloat(this.element.getStyle("right"));
Windows.notify("onStartResize",this);
}else{
this.doResize=false;
var _7cb=$(this.getId()+"_close");
if(_7cb&&Position.within(_7cb,this.pointer[0],this.pointer[1])){
return;
}
this.toFront();
if(!this.options.draggable){
return;
}
Windows.notify("onStartMove",this);
}
Event.observe(document,"mouseup",this.eventMouseUp,false);
Event.observe(document,"mousemove",this.eventMouseMove,false);
WindowUtilities.disableScreen("__invisible__","__invisible__",false);
document.body.ondrag=function(){
return false;
};
document.body.onselectstart=function(){
return false;
};
Event.stop(_7ca);
},_updateDrag:function(_7cc){
var _7cd=[Event.pointerX(_7cc),Event.pointerY(_7cc)];
var dx=_7cd[0]-this.pointer[0];
var dy=_7cd[1]-this.pointer[1];
if(this.doResize){
this.setSize(this.widthOrg+dx,this.heightOrg+dy);
dx=this.width-this.widthOrg;
dy=this.height-this.heightOrg;
if(!this.useLeft){
this.element.setStyle({right:(this.rightOrg-dx)+"px"});
}
if(!this.useTop){
this.element.setStyle({bottom:(this.bottomOrg-dy)+"px"});
}
}else{
this.pointer=_7cd;
if(this.useLeft){
this.element.setStyle({left:parseFloat(this.element.getStyle("left"))+dx+"px"});
}else{
this.element.setStyle({right:parseFloat(this.element.getStyle("right"))-dx+"px"});
}
if(this.useTop){
this.element.setStyle({top:parseFloat(this.element.getStyle("top"))+dy+"px"});
}else{
this.element.setStyle({bottom:parseFloat(this.element.getStyle("bottom"))-dy+"px"});
}
}
if(this.iefix){
this._fixIEOverlapping();
}
this._removeStoreLocation();
Event.stop(_7cc);
},_endDrag:function(_7d0){
WindowUtilities.enableScreen("__invisible__");
if(this.doResize){
Windows.notify("onEndResize",this);
}else{
Windows.notify("onEndMove",this);
}
Event.stopObserving(document,"mouseup",this.eventMouseUp,false);
Event.stopObserving(document,"mousemove",this.eventMouseMove,false);
this._saveCookie();
Event.stop(_7d0);
document.body.ondrag=null;
document.body.onselectstart=null;
},_keyPress:function(_7d1){
},_createWindow:function(id){
var _7d3=this.options.className;
win=document.createElement("div");
win.setAttribute("id",id);
win.className="dialog";
var _7d4;
if(this.options.url){
_7d4="<IFRAME name=\""+id+"_content\"  id=\""+id+"_content\" SRC=\""+this.options.url+"\"> </IFRAME>";
}else{
_7d4="<DIV id=\""+id+"_content\" class=\""+_7d3+"_content\"> </DIV>";
}
var _7d5=this.options.closable?"<div class='"+_7d3+"_close' id='"+id+"_close' onclick='Windows.close(\""+id+"\")'> </div>":"";
var _7d6=this.options.minimizable?"<div class='"+_7d3+"_minimize' id='"+id+"_minimize' onclick='Windows.minimize(\""+id+"\")'> </div>":"";
var _7d7=this.options.maximizable?"<div class='"+_7d3+"_maximize' id='"+id+"_maximize' onclick='Windows.maximize(\""+id+"\")'> </div>":"";
var _7d8=this.options.resizable?"class='"+_7d3+"_sizer' id='"+id+"_sizer'":"class='"+_7d3+"_se'";
win.innerHTML=_7d5+_7d6+_7d7+"      <table id='"+id+"_row1' class=\"top table_window\">        <tr>          <td class='"+_7d3+"_nw'>&nbsp;</td>          <td class='"+_7d3+"_n'><div id='"+id+"_top' class='"+_7d3+"_title title_window'>"+this.options.title+"</div></td>          <td class='"+_7d3+"_ne'>&nbsp;</td>        </tr>      </table>      <table id='"+id+"_row2' class=\"mid table_window\">        <tr>          <td class='"+_7d3+"_w'></td>            <td id='"+id+"_table_content' class='"+_7d3+"_content' valign='top'>"+_7d4+"</td>          <td class='"+_7d3+"_e'></td>        </tr>      </table>        <table id='"+id+"_row3' class=\"bot table_window\">        <tr>          <td class='"+_7d3+"_sw'>&nbsp;</td>            <td class='"+_7d3+"_s'><div id='"+id+"_bottom' class='status_bar'>&nbsp;</div></td>            <td "+_7d8+">&nbsp;</td>        </tr>      </table>    ";
Element.hide(win);
this.options.parent.insertBefore(win,this.options.parent.firstChild);
Event.observe($(id+"_content"),"load",this.options.onload);
return win;
},setLocation:function(top,left){
if(top<0){
top=0;
}
if(left<0){
left=0;
}
this.element.setStyle({top:top+"px"});
this.element.setStyle({left:left+"px"});
this.useLeft=true;
this.useTop=true;
},getSize:function(){
return {width:width,height:height};
},setSize:function(_7db,_7dc){
_7db=parseFloat(_7db);
_7dc=parseFloat(_7dc);
if(_7db<this.options.minWidth){
_7db=this.options.minWidth;
}
if(_7dc<this.options.minHeight){
_7dc=this.options.minHeight;
}
if(this.options.maxHeight&&_7dc>this.options.maxHeight){
_7dc=this.options.maxHeight;
}
if(this.options.maxWidth&&_7db>this.options.maxWidth){
_7db=this.options.maxWidth;
}
this.width=_7db;
this.height=_7dc;
this.element.setStyle({width:_7db+this.widthW+this.widthE+"px"});
this.element.setStyle({height:_7dc+this.heightN+this.heightS+"px"});
var _7dd=$(this.element.id+"_content");
_7dd.setStyle({height:_7dc+"px"});
_7dd.setStyle({width:_7db+"px"});
},toFront:function(){
this.setZIndex(Windows.maxZIndex+20);
},show:function(_7de){
if(_7de){
WindowUtilities.disableScreen(this.options.className);
this.modal=true;
this.setZIndex(Windows.maxZIndex+20);
Windows.unsetOverflow(this);
Event.observe(document,"keypress",this.eventKeyPress);
}
if(this.oldStyle){
this.getContent().setStyle({overflow:this.oldStyle});
}
this.setSize(this.width,this.height);
if(this.options.showEffect!=Element.show&&this.options.showEffectOptions){
this.options.showEffect(this.element,this.options.showEffectOptions);
}else{
this.options.showEffect(this.element);
}
this._checkIEOverlapping();
},showCenter:function(_7df){
this.setSize(this.width,this.height);
this._center();
this.show(_7df);
},_center:function(){
var _7e0=WindowUtilities.getWindowScroll();
var _7e1=WindowUtilities.getPageSize();
this.setLocation(_7e0.top+(_7e1.windowHeight-(this.height+this.heightN+this.heightS))/2,_7e0.left+(_7e1.windowWidth-(this.width+this.widthW+this.widthE))/2);
this.toFront();
},hide:function(){
if(this.modal){
WindowUtilities.enableScreen();
Windows.resetOverflow();
Event.stopObserving(document,"keypress",this.eventKeyPress);
}
this.getContent().setStyle({overflow:"hidden"});
this.oldStyle=this.getContent().getStyle("overflow");
this.options.hideEffect(this.element,this.options.hideEffectOptions);
if(this.iefix){
this.iefix.hide();
}
},minimize:function(){
var r2=$(this.getId()+"_row2");
var dh=r2.getDimensions().height;
if(r2.visible()){
var h=this.element.getHeight()-dh;
r2.hide();
this.element.setStyle({height:h+"px"});
if(!this.useTop){
var _7e5=parseFloat(this.element.getStyle("bottom"));
this.element.setStyle({bottom:(_7e5+dh)+"px"});
}
}else{
var h=this.element.getHeight()+dh;
this.element.setStyle({height:h+"px"});
if(!this.useTop){
var _7e5=parseFloat(this.element.getStyle("bottom"));
this.element.setStyle({bottom:(_7e5-dh)+"px"});
}
r2.show();
this.toFront();
}
Windows.notify("onMinimize",this);
this._saveCookie();
},maximize:function(){
if(this.storedLocation!=null){
this._restoreLocation();
if(this.iefix){
this.iefix.hide();
}
}else{
this._storeLocation();
Windows.unsetOverflow(this);
var _7e6=WindowUtilities.getWindowScroll();
var _7e7=WindowUtilities.getPageSize();
this.element.setStyle(this.useLeft?{left:_7e6.left}:{right:_7e6.left});
this.element.setStyle(this.useTop?{top:_7e6.top}:{bottom:_7e6.top});
this.setSize(_7e7.windowWidth-this.widthW-this.widthE,_7e7.windowHeight-this.heightN-this.heightS);
this.toFront();
if(this.iefix){
this._fixIEOverlapping();
}
}
Windows.notify("onMaximize",this);
this._saveCookie();
},isMinimized:function(){
var r2=$(this.getId()+"_row2");
return !r2.visible();
},isMaximized:function(){
return (this.storedLocation!=null);
},setOpacity:function(_7e9){
if(Element.setOpacity){
Element.setOpacity(this.element,_7e9);
}
},setZIndex:function(_7ea){
this.element.setStyle({zIndex:_7ea});
Windows.updateZindex(_7ea,this);
},setTitle:function(_7eb){
if(!_7eb||_7eb==""){
_7eb="&nbsp;";
}
Element.update(this.element.id+"_top",_7eb);
},setStatusBar:function(_7ec){
var _7ed=$(this.getId()+"_bottom");
if(typeof (_7ec)=="object"){
if(this.bottombar.firstChild){
this.bottombar.replaceChild(_7ec,this.bottombar.firstChild);
}else{
this.bottombar.appendChild(_7ec);
}
}else{
this.bottombar.innerHTML=_7ec;
}
},_checkIEOverlapping:function(){
if(!this.iefix&&(navigator.appVersion.indexOf("MSIE")>0)&&(navigator.userAgent.indexOf("Opera")<0)&&(this.element.getStyle("position")=="absolute")){
new Insertion.After(this.element.id,"<iframe id=\""+this.element.id+"_iefix\" "+"style=\"display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);\" "+"src=\"javascript:false;\" frameborder=\"0\" scrolling=\"no\"></iframe>");
this.iefix=$(this.element.id+"_iefix");
}
if(this.iefix){
setTimeout(this._fixIEOverlapping.bind(this),50);
}
},_fixIEOverlapping:function(){
Position.clone(this.element,this.iefix);
this.iefix.style.zIndex=this.element.style.zIndex-1;
this.iefix.show();
},_getWindowBorderSize:function(_7ee){
var div=this._createHiddenDiv(this.options.className+"_n");
this.heightN=Element.getDimensions(div).height;
div.parentNode.removeChild(div);
var div=this._createHiddenDiv(this.options.className+"_s");
this.heightS=Element.getDimensions(div).height;
div.parentNode.removeChild(div);
var div=this._createHiddenDiv(this.options.className+"_e");
this.widthE=Element.getDimensions(div).width;
div.parentNode.removeChild(div);
var div=this._createHiddenDiv(this.options.className+"_w");
this.widthW=Element.getDimensions(div).width;
div.parentNode.removeChild(div);
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
this.setSize(this.width,this.height);
}
if(this.doMaximize){
this.maximize();
}
if(this.doMinimize){
this.minimize();
}
},_createHiddenDiv:function(_7f0){
var _7f1=document.getElementsByTagName("body").item(0);
var win=document.createElement("div");
win.setAttribute("id",this.element.id+"_tmp");
win.className=_7f0;
win.style.display="none";
win.innerHTML="";
_7f1.insertBefore(win,_7f1.firstChild);
return win;
},_storeLocation:function(){
if(this.storedLocation==null){
this.storedLocation={useTop:this.useTop,useLeft:this.useLeft,top:this.element.getStyle("top"),bottom:this.element.getStyle("bottom"),left:this.element.getStyle("left"),right:this.element.getStyle("right"),width:this.width,height:this.height};
}
},_restoreLocation:function(){
if(this.storedLocation!=null){
this.useLeft=this.storedLocation.useLeft;
this.useTop=this.storedLocation.useTop;
this.element.setStyle(this.useLeft?{left:this.storedLocation.left}:{right:this.storedLocation.right});
this.element.setStyle(this.useTop?{top:this.storedLocation.top}:{bottom:this.storedLocation.bottom});
this.setSize(this.storedLocation.width,this.storedLocation.height);
Windows.resetOverflow();
this._removeStoreLocation();
}
},_removeStoreLocation:function(){
this.storedLocation=null;
},_saveCookie:function(){
if(this.cookie){
var _7f3="";
if(this.useLeft){
_7f3+="l:"+(this.storedLocation?this.storedLocation.left:this.element.getStyle("left"));
}else{
_7f3+="r:"+(this.storedLocation?this.storedLocation.right:this.element.getStyle("right"));
}
if(this.useTop){
_7f3+=",t:"+(this.storedLocation?this.storedLocation.top:this.element.getStyle("top"));
}else{
_7f3+=",b:"+(this.storedLocation?this.storedLocation.bottom:this.element.getStyle("bottom"));
}
_7f3+=","+(this.storedLocation?this.storedLocation.width:this.width);
_7f3+=","+(this.storedLocation?this.storedLocation.height:this.height);
_7f3+=","+this.isMinimized();
_7f3+=","+this.isMaximized();
WindowUtilities.setCookie(_7f3,this.cookie);
}
}};
var Windows={windows:[],observers:[],focusedWindow:null,maxZIndex:0,addObserver:function(_7f4){
this.removeObserver(_7f4);
this.observers.push(_7f4);
},removeObserver:function(_7f5){
this.observers=this.observers.reject(function(o){
return o==_7f5;
});
},notify:function(_7f7,win){
this.observers.each(function(o){
if(o[_7f7]){
o[_7f7](_7f7,win);
}
});
},getWindow:function(id){
return this.windows.detect(function(d){
return d.getId()==id;
});
},register:function(win){
this.windows.push(win);
},unregister:function(win){
this.windows=this.windows.reject(function(d){
return d==win;
});
},close:function(id){
var win=this.getWindow(id);
if(win){
if(win.getDelegate()&&!win.getDelegate().canClose(win)){
return;
}
this.notify("onClose",win);
win.hide();
}
},closeAll:function(){
this.windows.each(function(w){
Windows.close(w.getId());
});
},minimize:function(id){
var win=this.getWindow(id);
if(win){
win.minimize();
}
},maximize:function(id){
var win=this.getWindow(id);
if(win){
win.maximize();
}
},unsetOverflow:function(_806){
this.windows.each(function(d){
d.oldOverflow=d.getContent().getStyle("overflow")||"auto";
d.getContent().setStyle({overflow:"hidden"});
});
if(_806&&_806.oldOverflow){
_806.getContent().setStyle({overflow:_806.oldOverflow});
}
},resetOverflow:function(){
this.windows.each(function(d){
if(d.oldOverflow){
d.getContent().setStyle({overflow:d.oldOverflow});
}
});
},updateZindex:function(_809,win){
if(_809>this.maxZIndex){
this.maxZIndex=_809;
}
this.focusedWindow=win;
}};
var Dialog={win:null,confirm:function(_80b,_80c){
_80c=_80c||{};
var _80d=_80c.okLabel?_80c.okLabel:"Ok";
var _80e=_80c.cancelLabel?_80c.cancelLabel:"Cancel";
var _80f=_80c.windowParameters||{};
_80f.className=_80f.className||"alert";
buttonClass=_80c.buttonClass?"class="+_80c.buttonClass:"";
var _810="\t\t\t<div class='"+_80f.className+"_message'>"+_80b+"</div>\t\t\t\t<div class='"+_80f.className+"_buttons'>\t\t\t\t\t<input type='button' value='"+_80d+"' onclick='Dialog.okCallback()'"+buttonClass+"/>\t\t\t\t\t<input type='button' value='"+_80e+"' onclick='Dialog.cancelCallback()"+buttonClass+"'/>\t\t\t\t</div>\t\t";
this._openDialog(_810,_80c);
return this.win;
},alert:function(_811,_812){
_812=_812||{};
var _813=_812.okLabel?_812.okLabel:"Ok";
var _814=_812.windowParameters||{};
_814.className=_814.className||"alert";
buttonClass=_812.buttonClass?"class="+_812.buttonClass:"";
var _815="\t\t\t<div class='"+_814.className+"_message'>"+_811+"</div>\t\t\t\t<div class='"+_814.className+"_buttons'>\t\t\t\t\t<input type='button' value='"+_813+"' onclick='Dialog.okCallback()"+buttonClass+"'/>\t\t\t\t</div>";
return this._openDialog(_815,_812);
},info:function(_816,_817){
_817=_817||{};
_817.windowParameters=_817.windowParameters||{};
var _818=_817.windowParameters.className||"alert";
var _819="<div id='modal_dialog_message' class='"+_818+"_message'>"+_816+"</div>";
if(_817.showProgress){
_819+="<div id='modal_dialog_progress' class='"+_818+"_progress'>\t</div>";
}
_817.windowParameters.ok=null;
_817.windowParameters.cancel=null;
_817.windowParameters.className=_818;
return this._openDialog(_819,_817);
},setInfoMessage:function(_81a){
$("modal_dialog_message").update(_81a);
},closeInfo:function(){
Windows.close("modal_dialog");
},_openDialog:function(_81b,_81c){
if(this.win){
this.win.destroy();
}
if(!_81c.windowParameters.height&&!_81c.windowParameters.width){
_81c.windowParameters.width=WindowUtilities.getPageSize().pageWidth/2;
}
if(!_81c.windowParameters.height||!_81c.windowParameters.width){
var _81d=document.getElementsByTagName("body").item(0);
var _81e=document.createElement("div");
if(_81c.windowParameters.height){
_81e.style.height=_81c.windowParameters.height+"px";
}else{
_81e.style.width=_81c.windowParameters.width+"px";
}
_81e.style.position="absolute";
_81e.style.top="0";
_81e.style.left="0";
_81e.style.display="none";
_81e.setAttribute("id","_dummy_dialog_");
_81e.innerHTML=_81b;
_81d.insertBefore(_81e,_81d.firstChild);
if(_81c.windowParameters.height){
_81c.windowParameters.width=$("_dummy_dialog_").getDimensions().width+5;
}else{
_81c.windowParameters.height=$("_dummy_dialog_").getDimensions().height+5;
}
_81d.removeChild(_81e);
}
var _81f=_81c&&_81c.windowParameters?_81c.windowParameters:{};
_81f.resizable=_81f.resizable||false;
_81f.effectOptions=_81f.effectOptions||{duration:1};
_81f.minimizable=false;
_81f.maximizable=false;
_81f.closable=false;
this.win=new Window("modal_dialog",_81f);
this.win.getContent().innerHTML=_81b;
this.win.showCenter(true);
this.win.cancelCallback=_81c.cancel;
this.win.okCallback=_81c.ok;
if(!this.eventResize){
this.eventResize=this.recenter.bindAsEventListener(this);
}
Event.observe(window,"resize",this.eventResize);
Event.observe(window,"scroll",this.eventResize);
return this.win;
},okCallback:function(){
Event.stopObserving(window,"resize",this.eventResize);
Event.stopObserving(window,"scroll",this.eventResize);
if(!this.win.okCallback||this.win.okCallback(this.win)){
this.win.hide();
}
},cancelCallback:function(){
this.win.hide();
Event.stopObserving(window,"resize",this.eventResize);
Event.stopObserving(window,"scroll",this.eventResize);
if(this.win.cancelCallback){
this.win.cancelCallback(this.win);
}
},recenter:function(_820){
var _821=WindowUtilities.getPageSize();
if($("overlay_modal")){
$("overlay_modal").style.height=(_821.pageHeight+"px");
}
this.win._center();
}};
var isIE=navigator.appVersion.match(/MSIE/)=="MSIE";
var WindowUtilities={getWindowScroll:function(){
var w=window;
var T,L,W,H;
with(w.document){
if(w.document.documentElement&&documentElement.scrollTop){
T=documentElement.scrollTop;
L=documentElement.scrollLeft;
}else{
if(w.document.body){
T=body.scrollTop;
L=body.scrollLeft;
}
}
if(w.innerWidth){
W=w.innerWidth;
H=w.innerHeight;
}else{
if(w.document.documentElement&&documentElement.clientWidth){
W=documentElement.clientWidth;
H=documentElement.clientHeight;
}else{
W=body.offsetWidth;
H=body.offsetHeight;
}
}
}
return {top:T,left:L,width:W,height:H};
},getPageSize:function(){
var _827,_828;
if(window.innerHeight&&window.scrollMaxY){
_827=document.body.scrollWidth;
_828=window.innerHeight+window.scrollMaxY;
}else{
if(document.body.scrollHeight>document.body.offsetHeight){
_827=document.body.scrollWidth;
_828=document.body.scrollHeight;
}else{
_827=document.body.offsetWidth;
_828=document.body.offsetHeight;
}
}
var _829,_82a;
if(self.innerHeight){
_829=self.innerWidth;
_82a=self.innerHeight;
}else{
if(document.documentElement&&document.documentElement.clientHeight){
_829=document.documentElement.clientWidth;
_82a=document.documentElement.clientHeight;
}else{
if(document.body){
_829=document.body.clientWidth;
_82a=document.body.clientHeight;
}
}
}
var _82b,_82c;
if(_828<_82a){
_82b=_82a;
}else{
_82b=_828;
}
if(_827<_829){
_82c=_829;
}else{
_82c=_827;
}
return {pageWidth:_82c,pageHeight:_82b,windowWidth:_829,windowHeight:_82a};
},disableScreen:function(_82d,id,_82f){
id=id||"overlay_modal";
_82f=_82f||true;
WindowUtilities.initLightbox(id,_82d);
var _830=document.getElementsByTagName("body").item(0);
var _831=$(id);
var _832=WindowUtilities.getPageSize();
if(_82f&&isIE){
$$("select").each(function(_833){
_833.style.visibility="hidden";
});
$$("#"+id+" select").each(function(_834){
_834.style.visibility="visible";
});
}
_831.style.height=(_832.pageHeight+"px");
_831.style.display="block";
},enableScreen:function(id){
id=id||"overlay_modal";
var _836=$(id);
if(_836){
_836.style.display="none";
if(isIE){
$$("select").each(function(_837){
_837.style.visibility="visible";
});
}
_836.parentNode.removeChild(_836);
}
},initLightbox:function(id,_839){
if($(id)){
Element.setStyle(id,{zIndex:Windows.maxZIndex+10});
}else{
var _83a=document.getElementsByTagName("body").item(0);
var _83b=document.createElement("div");
_83b.setAttribute("id",id);
_83b.className="overlay_"+_839;
_83b.style.display="none";
_83b.style.position="absolute";
_83b.style.top="0";
_83b.style.left="0";
_83b.style.zIndex=Windows.maxZIndex+10;
_83b.style.width="100%";
_83a.insertBefore(_83b,_83a.firstChild);
}
},setCookie:function(_83c,_83d){
document.cookie=_83d[0]+"="+escape(_83c)+((_83d[1])?"; expires="+_83d[1].toGMTString():"")+((_83d[2])?"; path="+_83d[2]:"")+((_83d[3])?"; domain="+_83d[3]:"")+((_83d[4])?"; secure":"");
},getCookie:function(name){
var dc=document.cookie;
var _840=name+"=";
var _841=dc.indexOf("; "+_840);
if(_841==-1){
_841=dc.indexOf(_840);
if(_841!=0){
return null;
}
}else{
_841+=2;
}
var end=document.cookie.indexOf(";",_841);
if(end==-1){
end=dc.length;
}
return unescape(dc.substring(_841+_840.length,end));
}};

