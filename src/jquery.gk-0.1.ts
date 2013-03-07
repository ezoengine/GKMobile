/// <reference path="jquery.d.ts" />
class WebComponent {
    ele;
    id:string;
    static gkm:string;
    init(){}
    constructor(args?:string) {
        this.id = args;
        TagUtils.iteratorNode(this.ele);
        var className = this.className();
        this.ele = $('#'+this.id);
        this.bindEvent();
    }
    replaceAttr(key:string,srcVal:string,repVal:string){
        if(this.ele.attr(key)==srcVal){
            this.ele.attr(key,repVal);
        }
    }
    setAttr(obj:Object,keys:Array){
        for(var i=0;i<keys.length;i++){
            var value = this.ele.attr(keys[i]);
            if(value!='${'+keys[i]+'}') {
                obj[keys[i]] = value;
            }
        }
    }
    bindEvent(){
        var self = this;
        var elem = document.getElementById(this.id);
        if(elem==null){return};
        for (var i = 0; i < elem.attributes.length; i++) {
            var attrib = elem.attributes[i];
            if(attrib.name.indexOf('data-gk-')==0){
                var eventName = attrib.name.substring(8); //'data-gk-'
                //process onXXXEvent
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
    className(){
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((this)['constructor'].toString());
        var className = (results && results.length > 1) ? results[1] : "";
        return className.split('(')[0];
    }
    gkm():any{
        return window[this.className()].gkm;
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
}

class TagUtils {
    private static fragDiv = document.createElement('div');
    private static safeDocumentFrag = 
    document.createDocumentFragment().appendChild(TagUtils.fragDiv);

    static createElement(tag:string):any {
        if(!$.support.leadingWhitespace) {
            document.createElement(tag);
            safeDocumentFrag['createElement'](tag);
        }
    }

    static createDIVWrapper(html:string):any {
        var div;
        fragDiv.innerHTML = "<div>" + html + "</div>";
        fragDiv.removeChild(div = fragDiv.firstChild);
        return div;
    }

    static cloneNode(element:HTMLElement):any {
        var clone;
        if (!$.support.leadingWhitespace) {
            fragDiv.innerHTML = element.outerHTML;
            fragDiv.removeChild(clone = fragDiv.firstChild);
        } else {
            clone = element.cloneNode(true);
        }
        return clone;
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

    static iteratorNode(newNode){
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
        CustomTag.customTagElement = TagUtils.cloneNode(TagLibrary.customTags[element.nodeName.toUpperCase()]);
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
    private static gkm:string = '${content}';
    static DATAKEY:string = '_gk_';
    static eventStore:any = [];
    static tmpl = "";

    static debug(msg:string){
        //console.log(msg);
    }

    constructor(template?:string){
        template = template || TagLibrary.tmpl;
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
        return customTags[tagName.toUpperCase()];
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
class _WebComponent extends WebComponent {}
///////////////////////////////////////////////////////////////////////////////
$.gk = function(selector?) {
    if(selector.indexOf('#')==0){
        return $(selector).data(TagLibrary.DATAKEY);
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
        toHTML:function(){
            $(selector).each(function(idx,ele){
                var realHTML = $.gk['toHTML']($(ele).html());
                $(ele).html(realHTML);
            });
        }
    }
};

$.gk['model'] = {};

$.gk['toHTML'] = function(html){
    var ele = TagUtils.createDIVWrapper(html);
    TagLibrary.process(ele);
    var str = JSON.stringify(TagLibrary.eventStore['template']);
    var script = "";
    
    if (str !== "{}") {
        script = '<script>' + 'TagLibrary.eventStore["template"]=' + "eval(" + str + ");" + '</script>';
    }
    if (!$.support.leadingWhitespace && script) {
        var id = '_gk_' + TagLibrary['serial']++;
        script = '<div id="' + id + '" style="display:none">for old IE</div>' + '<script>$("#' + id + '").remove();</script>' + script;
    }
    var newGKObj = (TagLibrary.eventStore['script'] || []).join(' ');
    ele.innerHTML = script + ele.innerHTML + '<script>' + newGKObj + '</script>';
    TagLibrary.eventStore['script'] = [];
    return ele;
}
/*
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
*/

$.gk['com'] = function(id,obj){
    TagLibrary.eventStore['script'] = TagLibrary.eventStore['script'] || [];
    if(obj){
        $('#'+id).data(TagLibrary.DATAKEY,obj);
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
        return $('#'+id).data(TagLibrary.DATAKEY);       
    }
}

$.gk['def'] = function(data){
    var div = TagUtils.createDIVWrapper(data);
    $.each($(div).children(), function (idx, ele) {
    var clazz = $(ele).attr('name');
    var tagName = $(ele).attr('name').toUpperCase();
    if($(ele).children().length == 2) {
        var scriptHead = "var " + clazz + " = (function (_super) {__extends(" + clazz + ", _super);function " + clazz + "(id) {_super.call(this, id);} ";
        var scriptFooter = "return " + clazz + ";})(WebComponent);";
        var script = $($(ele).children()[1]).text();
        script = scriptHead + script + scriptFooter;
        var headID = document.getElementsByTagName("head")[0];
        var newScript = document.createElement('script');
        newScript['type'] = 'text/javascript';
        newScript['text'] = script;
        headID.appendChild(newScript);
    }
    var view = $(ele).children()[0];
    if(view.innerHTML.indexOf(TagLibrary.gkm) < 0) {
        $(view).append(TagLibrary.gkm);
    }
    TagLibrary.customTags[tagName] = view;
    TagUtils.createElement(tagName);
    });
    $.gk['taglib'] = $.gk['taglib'] || new TagLibrary();
}

$.gk['load'] = function (url, callback) {
    $.get(url, function (data) {
        $.gk['def'](data);
        callback();
    });
};

(function ($) {
    $.fn.gk = function (method) {
        if(arguments.length == 0) {
            return $(this).data(TagLibrary.DATAKEY);
        }
        var firstResult;
        var options = Array.prototype.slice.call(arguments, 1);
        this.each(function (idx, ele) {
            var gkObj = $(ele).data(TagLibrary.DATAKEY);
            if(typeof gkObj != 'undefined' && gkObj[method] != 'undefined') {
                var result = gkObj[method].apply(gkObj, options);
                if(idx == 0) {
                    firstResult = result;
                }
            }
        });
        return firstResult;
    };
})(jQuery);
$(document).ready(function(){
    $('[gk-app]').each(function(idx,ele){
        $(ele).html($.gk['toHTML']($(ele).html()));
    });
});