/// <reference path="jquery.d.ts" />
/// <reference path="jquerymobile-1.2.d.ts" />
/// <reference path="google.maps.d.ts" />
//////////////////////
class WebComponent {
    ele;
    id:string;
    static gkm:string;
    static list:Object = {};
    
    init(){}

    constructor(args?:string) {
        this.id = args;
        TagUtils.iteratorNewNode(this.ele);
        var className = this.className();
        if(!WebComponent.list.hasOwnProperty(className)){
            WebComponent.list[className] = [];
        }
        if(this.id!=null){
            WebComponent.list[className].push(this.id);
            this.ele = $('#'+this.id);
        }
        this.bindEvent();
    }

    static updateAll(className,callback){
        $.each(WebComponent.list[className], 
        function(idx,id){
            var webObj = $.gk('#'+id);
            callback(webObj);
        });
    }

    //屬性存取
    get(name:string):string {
        return this.ele.attr(name);
    }
    //屬性存取
    set(name:string,value:string) {
        this.ele.attr(name,value);
    }
    //取代參數值
    replaceAttr(key:string,srcVal:string,repVal:string){
        if(this.get(key)==srcVal){
            this.set(key,repVal);
        }
    }
    //事件綁定
    bindEvent(){
        var self = this;
        var elem = document.getElementById(this.id);
        if(elem==null){return};
        for (var i = 0; i < elem.attributes.length; i++) {
            var attrib = elem.attributes[i];
            if(attrib.name.indexOf('data-gk-')==0){
                var eventName = attrib.name.substring(8); //'data-gk-'
                //process onXXXEvent ,except init attribute
                if(eventName!='init'){
                    var onXXXEvent = 'on'+eventName;
                    $(this.ele).unbind(eventName);
                    this.ele.bind(eventName,function(evt){
                        if(typeof (self[onXXXEvent]) == "function" ){
                            self[onXXXEvent](evt);
                        }
                    });
                }
            }
        }
    }

    onclick(evt){
        console.log('WebComponent onclick....'+this.id);
        var on = this.get('data-gk-click');
    }

    onkeyup(evt){
        console.log('WebComponent onkeyup....'+this.id);
        var on = this.get('data-gk-keyup');
    }

    className(){
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((this)['constructor'].toString());
        return (results && results.length > 1) ? results[1] : "";
    }

    gkm():any{
        try{
        return window[this.className()].gkm;
        }catch(e){
            console.log(this.className+" not found!"+e);
        }
    }

    infoArray(info:Array):any{
        var replaceHTML = '';
        var _self = this;
        $.each(info,function(idx,obj){
            var _newHTML = TagLibrary.template(_self.id);
            for(var key in obj) {
                if(obj.hasOwnProperty(key)){
                    var value = obj[key];
                    var regex = new RegExp('\\${'+key+'}', "g");
                    _newHTML = _newHTML.replace(regex,value);
                }
            }
            replaceHTML += _newHTML;
        });
        replaceHTML = $.gk['toHTML'](replaceHTML);
        return $(replaceHTML).html();       
    }

    infoObject(info:Object):any{
        var replaceHTML = '';
        var _newHTML = TagLibrary.template(this.id);
        for(var key in info) {
            if(info.hasOwnProperty(key)){
                var value = info[key];
                var regex = new RegExp('\\${'+key+'}', "g");
                _newHTML = _newHTML.replace(regex,value);
            }
        }
        replaceHTML += _newHTML;
        replaceHTML = $.gk['toHTML'](replaceHTML);
        return $(replaceHTML).html();       
    }
    template(html?:string):string{
        if(html){
            TagLibrary.eventStore['template'][this.id] = html;
        }else {
            return TagLibrary.eventStore['template'][this.id];
        }
    }

    defineProperty(a1?,a2?,a3?){}
    watch(prop, handler){
        var obj = WebComponent.prototype;
        if(WebComponent.prototype['__proto__']){
            obj = WebComponent.prototype['__proto__'];
        }
        var oldval = this[prop], newval = oldval,
        getter = function () {
            return newval;
        },
        setter = function (val) {
            oldval = newval;
            return newval = handler.call(this, prop, oldval,val);
        };
        if (delete this[prop]) { // can't watch constants
            if (obj.defineProperty) {// ECMAScript 5
                obj.defineProperty(this, prop, {
                    get: getter,
                    set: setter
                });
            }
            else if (obj['__defineGetter__'] && obj['__defineSetter__']) { // legacy
                obj['__defineGetter__'].call(this, prop, getter);
                obj['__defineSetter__'].call(this, prop, setter);
            }else {
                console.log('failure');
            }
        }       
    }
}
///////////////////////////////////////////////////////////////////////////////
//// JQuery Mobile Component
///////////////////////////////////////////////////////////////////////////////
class Btn extends WebComponent {
    constructor(id?:string){
        super(id); 
        var pos = this.get('_iconpos');
        this.set('data-iconpos',pos);
    }   
    enable(b){
        this.ele.button(b?'enable':'disable');
    }

    refresh(){
        this.ele.button("refresh");
    }
    visible(b){
        if(arguments.length>0){
            b? this.ele.parent().show():this.ele.parent().hide();
        }else{
            return this.ele.parent().is(":visible");
        }
    } 
    label(val){
        if(val){
                $($('#'+this.id+'    span span')[0]).html(val);
            }else{
                return $($('#'+this.id+' span span')[0]).html();
            }
    }
}

////////////////////////////////////////////////////////////////////////////////
class Column extends WebComponent {
    colNum = ['ui-block-a','ui-block-b','ui-block-c','ui-block-d','ui-block-e'];
    constructor(id?:string){
        super(id);
        var n = parseInt(this.get('idx'))-1;
        $(this.ele).attr('class', this.colNum[n]);
    }
}
////////////////////////////////////////////////////////////////////////////////
class Header extends WebComponent {
    constructor(id?:string){
        super(id);
    }
    label(lab){
        if(lab){
            this.ele.children(1).html(lab);
            return this.ele;
        }else{
            return this.ele.children(1).html();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
class Icon extends WebComponent {
    constructor(id?:string){
        super(id);
        var file = this.get('file');
        $($(this.ele).children()[0]).attr('src',file);
    }
}

////////////////////////////////////////////////////////////////////////////////
class Radio extends WebComponent {
    constructor(id?:string){
        super(id);
        var checked = this.get('_checked');
        if(checked=='true'){
            this.set('checked','');
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
class Link extends WebComponent {
    constructor(id?:string){
        super(id);
    }
}

////////////////////////////////////////////////////////////////////////////////
class NavButton extends WebComponent {
    constructor(id?:string){
        super(id);
        this.replaceAttr('class','on','ui-btn-active ui-state-persist');
    }

}

////////////////////////////////////////////////////////////////////////////////
class Row extends WebComponent {
    colNum = ['ui-grid-a','ui-grid-b','ui-grid-c','ui-grid-d'];
    constructor(id?:string){
        super(id);
        var n = parseInt(this.get('columns'))-2;
        $(this.ele).attr('class', this.colNum[n]);
    }
}

////////////////////////////////////////////////////////////////////////////////
class txt extends WebComponent {
    constructor(id?:string){
        super(id);
    }
    value(v){
      if(v){
        return $(this.ele).val(v);
      }else{
        return $(this.ele).val();
      }
    }
}
////////////////////////////////////////////////////////////////////////////////
class Divider extends WebComponent {
    _label:string;
    _tip:string;
    constructor(id?:string){
        super(id);
    }

    label(y){
        if(y){
            this._label = y;
            this.ele.get(0).firstChild.nodeValue = y;
        }else{
            return $(this.ele).get(0).firstChild.nodeValue;
        }
    }

    tip(s){
        if(s){
            this._tip = s;
            $(this.ele).children(1).html(s);
        }else{
            $(this.ele).children(1).html();
        }
    }   
}

////////////////////////////////////////////////////////////////////////////////
class Password extends txt {
    constructor(id?:string){
        super(id);
    }
}

////////////////////////////////////////////////////////////////////////////////
class ListView extends WebComponent{
  private data:any = [];
    constructor(id?:string){
      super(id);
    }
    info(infoArray:any):any{
      if(infoArray){
          this.data = infoArray;
          var listItem = super.infoArray(infoArray);
          $("#"+this.id).html(listItem);
          try{
              var el:any = $("#"+this.id);
              el.listview('refresh');
          }catch(e){}
      }
      else {
          return this.data;
      }
    }

    add(obj):any {
      this.data.push(obj);
      this.info(this.data);
      return this;
    }
    //$.gk('#itemList').remove({'item':$(x).text()});
    remove(removeObj):any {
      var removeJSONObj = JSON.stringify(removeObj);
      this.info($.grep( this.data, function(obj){
         return  removeJSONObj == JSON.stringify(obj);
        },true));
      return this;
    }

}
////////////////////////////////////////////////////////////////////////////////
class Form extends WebComponent {
    constructor(id?:string){
        super(id);
    }
    info(infoObject:Object):any{
        if(infoObject){
            var form = super.infoObject(infoObject);
            $("#"+this.id).html(form);
        }
        else {
            return '><';
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
class List extends WebComponent {
    constructor(id?:string){
        super(id);
    }

}

/////// Custom Component /////////
////////////////////////////////////////////////////////////////////////////////
class SelectBar extends WebComponent {
    date:string = 'none';
    constructor(id?:string){
        super(id);
    }
}
////////////////////////////////////////////////////////////////////////////////
class PopupPanel extends WebComponent {
    constructor(id?:string){
        super(id);
        var popId =  "#"+id+"_popupPanel";
        $(popId).on({
            popupbeforeposition: function() {
                var h = $( window ).height();
                $(popId).css( "height", h-20);
            }
        });     
    }
    info(infoArray:Array):any{
        if(infoArray){
            var listItem = super.infoArray(infoArray);
            $("#"+this.id).html(listItem);
        }
        else {
            return '><';
        }
    }   
}
///////////////////////////////////////////////////////////////////////////////
//// Custom Component
///////////////////////////////////////////////////////////////////////////////
class GMap extends WebComponent {
    static initGoogleMapScript:string = 'stop';
    static CallbackFunc='GK_GMap';
    static waitQueue = [];
    map:google.maps.Map;
    options:Object = {};
    _width:string;
    _height:string;
    _address:string;
    marker:google.maps.Marker;
    static HYBRID:string =  "hybrid";
    static ROADMAP:string = "roadmap";
    static SATELLITE:string = "satellite";
    static TERRAIN:string = "terrain";

    constructor(id?:string){
        super(id);
        var h = document.documentElement.clientHeight-24;
        var w = document.documentElement.clientWidth;
        this.replaceAttr('style','${style}','width:'+w+'px;height:'+h+'px');
        this.replaceAttr('zoom','${zoom}','12');
        this.replaceAttr('type','${type}',GMap.ROADMAP);
        $(this.ele).parent().attr('style',$(this.ele).attr('style'));
        this.options['zoom'] = parseInt(this.get('zoom'));
        this.options['mapTypeId']= this.get('type');
        this._address = this.ele[0].nextSibling.nextSibling.innerHTML.trim();
        this.initMap();
    }
  
    static initScript(){
        $.each(waitQueue,function(idx,obj){
            obj.initialize();
        });
    }

    height(h){
        if(h){
            $(this.ele).css('height',h);
            this._height = h;
            google.maps.event.trigger(this.map, "resize");
        }else{
            return this._height;
        }
    }

    width(w){
        if(w){
            $(this.ele).css('width',w);
            this._width = w;
            google.maps.event.trigger(this.map, "resize");
        }else{
            return this._width;
        }
    }

    initMap() {
        if(GMap.initGoogleMapScript==='stop') {
            GMap.initGoogleMapScript = 'running';
            GMap.waitQueue.push(this);
            window[GMap.CallbackFunc] = function(){GMap.initScript();}
            var script = <HTMLScriptElement>document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://maps.google.com/maps/api/js?sensor=false&callback="+GMap.CallbackFunc;
            document.body.appendChild(script);
        }else if(GMap.initGoogleMapScript==='running'){
            GMap.waitQueue.push(this);
        }else {
            this.initialize();
        }
    }

    initialize() {
        GMap.initGoogleMapScript = 'done.';
        //
        if(this._address){
            this.address(this._address);
        }else{
            this.options['center'] = new google.maps.LatLng(22.604943497851178, 120.30919253826141);
            this.map = new google.maps.Map(document.getElementById(this.id), this.options);
            this.init(); //create map,provider hookPoint
        }
    }

    nowPos(address){
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
            });
    }

    location(lat,lng){
        var latlng = new google.maps.LatLng(lat, lng);
       if(this.marker){
            this.marker.setMap(null);
        }
        this.marker = new google.maps.Marker(
          {position: latlng, map: this.map, title:this.options['title']});
        this.marker.setMap(this.map);
        this.map.setZoom(this.options['zoom']);
        this.map['setCenter'](latlng);
    }

    address(addr){
        var self = this;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: addr },
            function (result, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var location = result[0].geometry.location;
                    if(!self.map){
                        self.map = new google.maps.Map(document.getElementById(self.id), self.options);
                        self.init(); //create map,provider hookPoint
                    }
                    if(self.marker){
                        self.marker.setMap(null);
                    }
                    self.marker = new google.maps.Marker(
                      {position: location, map: self.map, title:addr});
                    self.marker.setMap(self.map);
                    self.map.setZoom(self.options['zoom']);
                    self.map['setCenter'](location);
                } else {
                        //alert('解析失敗!回傳狀態為：' + status);
                }
            });
    }   
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
class TagUtils {

    static createDIVWrapper(html:string):any {
        var fragment:DocumentFragment = document.createDocumentFragment();
        var div = document.createElement('div');
        fragment.appendChild(div);
        div.innerHTML =  html;
        return div;
    }

    static toElement(html:string):any{
        var _div = TagUtils.createDIVWrapper(html);
        return _div.firstChild;
    }

    static replaceElement(originEle,newEle){
        var originPar = originEle.parentNode;
        while(newEle!=null){
            var tmp = newEle.nextSibling;
            TagLibrary.debug('replace +--'+newEle.nodeName);
            originPar.insertBefore(newEle, originEle);
            newEle = tmp;
        }
        originPar.removeChild(originEle);
    }

    static innerHTML(ele:HTMLElement):string {
        var text = '';
        var node:any = ele;
        if(node!=null) {
            if(ele.innerHTML!='') return ele.innerHTML;
            while(node.nextSibling){
                node = node.nextSibling;
                if(node.nodeType==3){
                    text += node.nodeValue.trim();
                    node.nodeValue = '';
                }else if(node.nodeType==1){
                    break;
                }
            }
        }
        return text;
    }

    static iteratorNewNode(newNode){
        var iteratorNewNode = newNode;
        while(iteratorNewNode!=null){
            var comId = this.collectDataAttributes(
                iteratorNewNode,TagLibrary.eventStore,this.processTagElement);
            if(iteratorNewNode.nextSibling){
                iteratorNewNode = iteratorNewNode.nextSibling;
            }else{
                break;
            }
        }
        return newNode; 
    }

    static collectDataAttributes(node,eventStore,srcElement) {
        if(node.nodeType!=1 || node.attributes.length==0){return ''};
        var eleObj = {};
        eleObj['id'] = $(srcElement).attr('id') || TagLibrary.genID;
        var re_dataAttr = /^data\-(.+)$/;
        $.each(node.attributes, function(index, attr:any) {
            if (re_dataAttr.test(attr.nodeName)) {
                var key = attr.nodeName.match(re_dataAttr)[1];
                key = key.substring(3);
                var attr = key.indexOf('init')==0 ? key: 'on'+key;
                eleObj[key] = $(srcElement).attr(attr);
            }
        });
        eventStore['keys'].push(eleObj['id']);
            eventStore.push(eleObj);
        return eleObj['id'];
    }

}
///////////////////////////////////////////////////////////////////////////////

class CustomTag {
    private static clazz:string;
    private static html:string;
    private static processTagElement:HTMLElement;
    private static customTagElement:HTMLElement;
    private static CLASS:string = 'use';
    
    static replaceWith(element:HTMLElement):HTMLElement{
        if(typeof element ==='undefined') {return;};
        processTagElement = element;
        //
        customTagElement = TagLibrary.customTags[element.nodeName].cloneNode(true);
        clazz = $(this.customTagElement).attr(CLASS) || 'WebComponent';
        html = $(this.customTagElement).html();
        //prepare script 
        if(typeof element.id ==='undefined' || element.id==''){
            element.id = '_gk_'+ TagLibrary['serial']++;
        }
        var script = "$.gk.com('"+element.id+"' , new window['"+clazz+"']('"+element.id+"'));";
        TagLibrary.eventStore['script'].push(script);
        //
        var newHTML = html;
        var repHTML = TagUtils.innerHTML(this.processTagElement);
        window[clazz].gkm = repHTML;
        //replace ${gkm} 
        newHTML = newHTML.replace(TagLibrary.gkm,repHTML);
        //replace ele attributes
        $.each(this.processTagElement.attributes ,function(idx,att){
            var regex = new RegExp('\\${'+att.nodeName+'}', "g");
            newHTML = newHTML.replace(regex,att.nodeValue);
        });
        //replcae ${.*} to '' , if necessary
        //newHTML = newHTML.replace(/\${\w+}/g,'');
        var newNode = TagUtils.toElement(newHTML);
        //replce Element
        TagUtils.replaceElement(this.processTagElement,newNode);
        return newNode;
    }

}

///////////////////////////////////////////////////////////////////////////////

class TagLibrary  {
    static serial:number;
    static genID:string;
    static customTags:Object = {};
    private static gkm:string = '${gkm}';
    static eventStore:any = [];
    private tmpl = "<element name='gmap' use='GMap'><div style='${style}'><div id='${id}' style='${style}' zoom='${zoom}' type='${type}' data-gk-click='${onclick}'></div><div >${gkm}</div></div></element><element name='page'><div id='${id}' data-role='page' data-gk-init='${init}' class='${class}'>${gkm}</div></element><element name='header' use='Header'> <div id='${id}' data-position='fixed' data-theme='a' data-role='header' data-gk-init='${init}' style='font-size:16px;text-align:center;'> <div style='margin:13px 0 0 0'>${label}</div>&nbsp;${gkm} </div></element><element name='content'><div id='${id}' style='padding:15px' data-role='content'>${gkm}</div></element><element name='footer'> <div id='${id}' data-position='fixed' data-theme='a' data-role='footer' data-gk-init='${init}'>${gkm}</div></element><element name='group'><fieldset data-role='controlgroup' data-type='horizontal' >${gkm}</fieldset></element><element name='radio' use='Radio'><input id='${id}' _checked='${checked}' data-gk-click='${onclick}' type='radio' name='${name}' value='${value}'/><label for='${id}' >${gkm}</label></element><element name='text' use='txt'><div data-role='fieldcontain'> <label for='name'>${label}</label> <input id='${id}' type='text' name='${name}' value='${value}' readonly/></div></element><element name='date' ><label for='${name}'>${label}</label><input id='${id}' name='${name}' type='date' data-role='datebox' data-options='{'mode': 'calbox'}' value='${value}' data-gk-blur='${onblur}'></element><element name='password' use='Password'><div data-role='fieldcontain'> <label for='password'>${label}</label> <input id='${id}' type='password' name='${name}' value='${value}' /></div></element><element name='textarea' ><div data-role='fieldcontain'><label for='textarea'>${label}</label><textarea cols='40' rows='8' name='${name}' id='${id}'></textarea></div></element><element name='row' use='Row'><div id='${id}' class='ui-grid-a' columns='${columns}'>${gkm}</div></element><element name='icon' use='Icon'><a id='${id}' file='${src}' data-gk-click='${onclick}' data-role='button' style='text-decoration:none;color:#000000;margin:3px'> <img style='width:48px;height:48px;' ></a><div style='text-align:center'>${gkm}</div></element><element name='column' use='Column'><div id='${id}' idx='${idx}' >${gkm}</div></element><element name='backBtn'><a data-icon='back' data-rel='back' href='#home' class='ui-btn-${pos}'>${label}</a></element><element name='backBtn2'><a data-icon='back' data-transition='slide' data-direction='reverse' class='ui-btn-${pos}' href='${href}'><div style='height:28px;line-height:28px;'>${label}</div></a></element><element name='btn2' use='Btn'><a id='${id}' data-icon='${icon}' _iconpos='${iconpos}' class='ui-btn-${pos}' href='${href}' data-gk-click='${onclick}'>${label}</a></element><element name='btn' use='Btn'><a id='${id}' href='#' type='button' value='${value}' data-inline='${inline}' data-gk-click='${onclick}' data-gk-init='${init}' data-icon='${icon}'>${label}</a></element><element name='link' use='Link'> <div> <a id='${id}' href='${href}' data-gk-click='${onclick}' data-gk-init='${init}'>${text}</a> </div></element><element name='navbar'><div id='${id}' data-role='navbar' data-iconpos='top' data-gk-init='${init}'><ul>${gkm}</ul></div></element><element name='navbtn' use='NavButton'><li><a id='${id}' href='${href}' data-transition='none' data-theme='' data-gk-click='${onclick}' data-gk-init='${init}' data-icon='${icon}' class='${state}'>${label}</a></li></element><element name='listview' use='ListView'><style>.ui-li-desc {font-size:16px}.ui-li {font-size:18px}</style><ul id='${id}' data-role='listview' data-inset='${inset}' data-divider-theme='d' class='ui-listview'>${gkm}</ul></element><element name='form' use='Form'><div id='${id}'>${gkm}</div></element><element name='list' use='List'><li id='${id}' data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='d' data-gk-click='${onclick}' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d'><a href='${href}' class='ui-link-inherit' > <h3 class='ui-li-heading'>${heading}</h3> ${gkm}</a></li></element><element name='listForm'><li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='d' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d'><div href='${href}' class='ui-link-inherit'> <h3 class='ui-li-heading'>${heading}</h3> ${gkm}</div></li></element><element name='divider' use='Divider'> <li id='${id}' data-role='list-divider' role='heading' class='ui-li ui-li-divider ui-bar-d ui-li-has-count ui-first-child' >${label}<span class='ui-li-count ui-btn-up-c ui-btn-corner-all' onclick='alert(123)'>${tip}</span></li></element><element name='selectBar' use='SelectBar'><div data-role='navbar' data-grid='d' class='ui-navbar ui-mini' role='navigation'><ul id='${id}' class='ui-grid-d' data-gk-click='${onclick}'>${gkm}</ul></div></element><element name='popup' use='PopupPanel'><style>#${id}-popup { right: 0 !important; left: auto !important;}#${id} {width: 100px;border: 1px solid #000;border-right: none;background: rgba(0,0,0,.5);margin: -1px 0;}#${id} .ui-btn {margin: 8px 2px;}</style><a href='#${id}' data-icon='' class='ui-btn-right' data-rel='popup' data-transition='slide' data-position-to='window' data-role='button'> <div id='${id}_popupPanel' style='height:28px;line-height:28px;'>${label}</div></a><div data-role='popup' id='${id}' data-corners='false' data-theme='none' data-shadow='false' data-tolerance='0,0'> ${gkm} </div></element>";

    static debug(msg:string){
        //console.log(msg);
    }

    constructor(template?:string){
        template = template || this.tmpl;
        TagLibrary.eventStore['keys'] = [];
        TagLibrary.eventStore['script'] = [];
        TagLibrary.eventStore['template'] = {};
        var div = TagUtils.createDIVWrapper(template);
        $.each($(div).children(),
            function(idx,ele:HTMLElement){
                if(ele.innerHTML.indexOf(TagLibrary.gkm)<0){
                    $(ele).append(TagLibrary.gkm);              
                }
                var tagName = $(ele).attr('name').toUpperCase();
                TagLibrary.customTags[tagName] = ele;
            }
        );
    }

    static template(id:string):string{
        return TagLibrary.eventStore['template'][id];
    }

    static isComponent(tagName:string):bool {
        return customTags[tagName];
    }

    static process(ele){
        if(ele==null) return;
        var nodeName = ele.nodeName;
        TagLibrary.debug('process:'+nodeName);
        //處理自訂模版,自訂模板會和指定元件綁定
        if(nodeName==='TEMPLATE'){
            //這樣會限制template只能在自訂標籤的第一層
            var id = $(ele.parentNode).attr('id');
            TagLibrary.eventStore['template'][id] = ele.innerHTML;
            ele.innerHTML = '';
        }
        //如果該節點是元件就進行置換動作
        if(isComponent(nodeName)){
            process(CustomTag.replaceWith(ele));
        }
        else if(ele.firstChild){
            process(ele.firstChild);
        }
        else if(ele.nextSibling){
            process(ele.nextSibling);
        }
        else if(ele.parentNode && ele.parentNode.parentNode){
            ele = ele.parentNode;
            while(ele.nextSibling==null){
                if(ele.parentNode){
                    ele = ele.parentNode;
                }else{
                    return;
                }
            }
            process(ele.nextSibling);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
$.gk = function(selector?) {
    if(selector.indexOf('#')==0){
        return $(selector).data('obj');
    }
    return {
        html:function(setHTML){
            if(setHTML){
                $(selector).html(setHTML);
                return $(selector);
            }else{
                var gul = $(selector).html();
                var html = $.gk['toHTML'](gul).innerHTML;
                return html;
          }
        },
        replaceWith:function(targetTag){
            var realHTML = this.toHTML(selector).innerHTML;
            $(targetTag).replaceWith(realHTML);
        },
        appendTo:function(targetTag){
        var ele = this.toHTML(selector);
        $(targetTag).append(ele.innerHTML);
            for(var idx=0;idx<TagLibrary.eventStore.length;idx++){
                var obj = $.gk['com'](TagLibrary.eventStore[idx].id);
                if(obj!=null){
                    obj.init();
                }
            }
        }
    }
};

$.gk['model'] = {};

$.gk['toHTML'] = function(html){
    $.gk['taglib'] = $.gk['taglib'] || new TagLibrary();
    var ele = TagUtils.createDIVWrapper(html);
    TagLibrary.process(ele);
    var str = JSON.stringify(TagLibrary.eventStore['template']);
    var script = '<script>' + 
        'TagLibrary.eventStore["template"]=' + 
        "eval(" + str + ");"+ '</script>';
    var newGKObj = (TagLibrary.eventStore['script']||[]).join(' ');
    // output HTML
    ele.innerHTML = 
        script + ele.innerHTML+'<script>'+newGKObj+'</script>';
    TagLibrary.eventStore['script'] = [];
    return ele;
}

$.gk['tmpl'] = function(arg0,arg1){
    if(arguments.length==1){
        $.gk['taglib'] = new TagLibrary(arg0);
    }else{
        $.get(arg0, function(template) {
            $.gk['taglib'] = new TagLibrary(template);
            arg1();
        })
    };
};

$.gk['com'] = function(id,obj){
    TagLibrary.eventStore['script'] = TagLibrary.eventStore['script'] || [];
    if(obj){
        $('#'+id).data('obj',obj);
        var model = $.gk['model'][id];
        if(model){
            for(var prop in model) {
                if(model.hasOwnProperty(prop)){
                    obj[prop] = model[prop];
                }
            }
        }
        obj['init']();
    }else{
        return $('#'+id).data('obj');       
    }
}
///////////////////////////////////////////////////////////////////////////////