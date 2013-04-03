var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var WebComponent = (function () {
    function WebComponent(args) {
        this.id = args;
        TagUtils.iteratorNode(this.ele);
        var className = this.className();
        this.ele = $('#' + this.id);
        this.bindEvent();
    }
    WebComponent.gkm = "";
    WebComponent.prototype._init = function () {
    };
    WebComponent.prototype.init = function () {
    };
    WebComponent.prototype.removeDefAttr = function (ele, attr) {
        if(arguments.length == 1) {
            attr = ele;
            ele = this.ele;
        }
        if(typeof attr === 'string') {
            attr = [
                attr
            ];
        }
        for(var i in attr) {
            if('${' + attr[i] + '}' === this.ele.attr(attr[i])) {
                this.ele.removeAttr(attr[i]);
            }
        }
    };
    WebComponent.prototype.replaceAttr = function (key, srcVal, repVal) {
        if(this.ele.attr(key) == srcVal) {
            this.ele.attr(key, repVal);
        }
    };
    WebComponent.prototype.setAttr = function (obj, keys) {
        for(var i = 0; i < keys.length; i++) {
            var value = this.ele.attr(keys[i]);
            if(value != '${' + keys[i] + '}') {
                obj[keys[i]] = value;
            }
        }
    };
    WebComponent.prototype.bindEvent = function () {
        var self = this;
        var elem = document.getElementById(this.id);
        if(elem == null) {
            return;
        }
        ; ;
        for(var i = 0; i < elem.attributes.length; i++) {
            var attrib = elem.attributes[i];
            if(attrib.name.indexOf('data-gk-') == 0) {
                var eventName = attrib.name.substring(8);
                var onXXXEvent = 'on' + eventName;
                $(this.ele).unbind(eventName);
                this.ele.bind(eventName, function (evt) {
                    if(typeof (self[onXXXEvent]) == "function") {
                        self[onXXXEvent](evt);
                    }
                });
            }
        }
    };
    WebComponent.prototype.className = function () {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((this)['constructor'].toString());
        var className = (results && results.length > 1) ? results[1] : "";
        return className.split('(')[0];
    };
    WebComponent.prototype.gkm = function () {
        return window[this.className()].gkm;
    };
    WebComponent.prototype.infoArray = function (info) {
        var replaceHTML = '';
        var _self = this;
        $.each(info, function (idx, obj) {
            var _newHTML = TagLibrary.template(_self.id);
            for(var key in obj) {
                if(obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    var regex = new RegExp('\\${' + key + '}', "g");
                    _newHTML = _newHTML.replace(regex, value);
                }
            }
            replaceHTML += _newHTML;
        });
        replaceHTML = $.gk['toHTML'](replaceHTML);
        return $(replaceHTML).html();
    };
    WebComponent.prototype.infoObject = function (info) {
        var replaceHTML = '';
        var _newHTML = TagLibrary.template(this.id);
        for(var key in info) {
            if(info.hasOwnProperty(key)) {
                var value = info[key];
                var regex = new RegExp('\\${' + key + '}', "g");
                _newHTML = _newHTML.replace(regex, value);
            }
        }
        replaceHTML += _newHTML;
        replaceHTML = $.gk['toHTML'](replaceHTML);
        return $(replaceHTML).html();
    };
    WebComponent.prototype.template = function (html) {
        if(html) {
            TagLibrary.eventStore['template'][this.id] = html;
        } else {
            return TagLibrary.eventStore['template'][this.id];
        }
    };
    return WebComponent;
})();
var TagUtils = (function () {
    function TagUtils() { }
    TagUtils.fragDiv = document.createElement('div');
    TagUtils.safeDocumentFrag = document.createDocumentFragment();
    TagUtils.createElement = function createElement(tag) {
        if(!$.support.leadingWhitespace) {
            document.createElement(tag);
            TagUtils.safeDocumentFrag['createElement'](tag);
        }
    }
    TagUtils.createDIVWrapper = function createDIVWrapper(html) {
        var div;
        TagUtils.fragDiv.innerHTML = "<div>" + html + "</div>";
        TagUtils.fragDiv.removeChild(div = TagUtils.fragDiv.firstChild);
        return div;
    }
    TagUtils.cloneNode = function cloneNode(element) {
        var clone;
        if(!$.support.leadingWhitespace) {
            TagUtils.fragDiv.innerHTML = element.outerHTML;
            TagUtils.fragDiv.removeChild(clone = TagUtils.fragDiv.firstChild);
        } else {
            clone = element.cloneNode(true);
        }
        return clone;
    }
    TagUtils.toElement = function toElement(html) {
        var _div = TagUtils.createDIVWrapper(html);
        return _div.firstChild;
    }
    TagUtils.replaceElement = function replaceElement(originEle, newEle) {
        var originPar = originEle.parentNode;
        while(newEle != null) {
            var tmp = newEle.nextSibling;
            TagLibrary.debug('replace +--' + newEle.nodeName);
            originPar.insertBefore(newEle, originEle);
            newEle = tmp;
        }
        originPar.removeChild(originEle);
    }
    TagUtils.innerHTML = function innerHTML(ele) {
        var text = '';
        var node = ele;
        if(node != null) {
            if(ele.innerHTML != '') {
                return ele.innerHTML;
            }
            while(node.nextSibling) {
                node = node.nextSibling;
                if(node.nodeType == 3) {
                    text += node.nodeValue.trim();
                    node.nodeValue = '';
                } else {
                    if(node.nodeType == 1) {
                        break;
                    }
                }
            }
        }
        return text;
    }
    TagUtils.iteratorNode = function iteratorNode(newNode) {
        var iteratorNewNode = newNode;
        while(iteratorNewNode != null) {
            var comId = this.collectDataAttributes(iteratorNewNode, TagLibrary.eventStore, this.processTagElement);
            if(iteratorNewNode.nextSibling) {
                iteratorNewNode = iteratorNewNode.nextSibling;
            } else {
                break;
            }
        }
        return newNode;
    }
    TagUtils.collectDataAttributes = function collectDataAttributes(node, eventStore, srcElement) {
        if(node.nodeType != 1 || node.attributes.length == 0) {
            return '';
        }
        ; ;
        var eleObj = {
        };
        eleObj['id'] = $(srcElement).attr('id') || TagLibrary.genID;
        var re_dataAttr = /^data\-(.+)$/;
        $.each(node.attributes, function (index, attr) {
            if(re_dataAttr.test(attr.nodeName)) {
                var key = attr.nodeName.match(re_dataAttr)[1];
                key = key.substring(3);
                var attr = key.indexOf('init') == 0 ? key : 'on' + key;
                eleObj[key] = $(srcElement).attr(attr);
            }
        });
        eventStore['keys'].push(eleObj['id']);
        eventStore.push(eleObj);
        return eleObj['id'];
    }
    return TagUtils;
})();
TagUtils.safeDocumentFrag.appendChild(TagUtils.fragDiv);
var CustomTag = (function () {
    function CustomTag() { }
    CustomTag.clazz = "";
    CustomTag.html = "";
    CustomTag.processTagElement = null;
    CustomTag.customTagElement = null;
    CustomTag.CLASS = 'use';
    CustomTag.replaceWith = function replaceWith(element) {
        if(typeof element === 'undefined') {
            return;
        }
        ; ;
        CustomTag.processTagElement = element;
        CustomTag.customTagElement = TagUtils.cloneNode(TagLibrary.customTags[element.nodeName.toUpperCase()]);
        CustomTag.clazz = $(this.customTagElement).attr(CustomTag.CLASS) || 'WebComponent';
        CustomTag.html = $(this.customTagElement).html();
        if(typeof element.id === 'undefined' || element.id == '') {
            element.id = '_gk_' + TagLibrary['serial']++;
        }
        var script = "$.gk.com('" + element.id + "' , new window['" + CustomTag.clazz + "']('" + element.id + "'));";
        TagLibrary.eventStore['script'].push(script);
        var newHTML = CustomTag.html;
        var repHTML = TagUtils.innerHTML(this.processTagElement);
        if(window[CustomTag.clazz]) {
            window[CustomTag.clazz].gkm = repHTML;
        }
        newHTML = newHTML.replace(TagLibrary.gkm, repHTML);
        $.each(this.processTagElement.attributes, function (idx, att) {
            var regex = new RegExp('\\${' + att.nodeName + '}', "g");
            newHTML = newHTML.replace(regex, att.nodeValue);
        });
        var newNode = TagUtils.toElement(newHTML);
        TagUtils.replaceElement(this.processTagElement, newNode);
        return newNode;
    }
    return CustomTag;
})();
var TagLibrary = (function () {
    function TagLibrary(template) {
        template = template || TagLibrary.tmpl;
        TagLibrary.eventStore['keys'] = [];
        TagLibrary.eventStore['script'] = [];
        TagLibrary.eventStore['template'] = {
        };
        var div = TagUtils.createDIVWrapper(template);
        $.each($(div).children(), function (idx, ele) {
            if(ele.innerHTML.indexOf(TagLibrary.gkm) < 0) {
                $(ele).append(TagLibrary.gkm);
            }
            var tagName = $(ele).attr('name').toUpperCase();
            TagLibrary.customTags[tagName] = ele;
        });
    }
    TagLibrary.serial = 0;
    TagLibrary.genID = "";
    TagLibrary.customTags = {
    };
    TagLibrary.gkm = '${content}';
    TagLibrary.DATAKEY = '_gk_';
    TagLibrary.eventStore = [];
    TagLibrary.tmpl = "";
    TagLibrary.debug = function debug(msg) {
    }
    TagLibrary.template = function template(id) {
        return TagLibrary.eventStore['template'][id];
    }
    TagLibrary.isComponent = function isComponent(tagName) {
        return TagLibrary.customTags[tagName.toUpperCase()];
    }
    TagLibrary.process = function process(ele) {
        if(ele == null) {
            return;
        }
        var nodeName = ele.nodeName;
        TagLibrary.debug('process:' + nodeName);
        if(nodeName === 'TEMPLATE') {
            var id = $(ele.parentNode).attr('id');
            TagLibrary.eventStore['template'][id] = ele.innerHTML;
            ele.innerHTML = '';
        }
        if(TagLibrary.isComponent(nodeName)) {
            TagLibrary.process(CustomTag.replaceWith(ele));
        } else {
            if(ele.firstChild) {
                TagLibrary.process(ele.firstChild);
            } else {
                if(ele.nextSibling) {
                    TagLibrary.process(ele.nextSibling);
                } else {
                    if(ele.parentNode && ele.parentNode.parentNode) {
                        ele = ele.parentNode;
                        while(ele.nextSibling == null) {
                            if(ele.parentNode) {
                                ele = ele.parentNode;
                            } else {
                                return;
                            }
                        }
                        TagLibrary.process(ele.nextSibling);
                    }
                }
            }
        }
    }
    return TagLibrary;
})();
var _WebComponent = (function (_super) {
    __extends(_WebComponent, _super);
    function _WebComponent() {
        _super.apply(this, arguments);

    }
    return _WebComponent;
})(WebComponent);
$.gk = function (selector) {
    if(selector.indexOf('#') == 0) {
        return $(selector).data(TagLibrary.DATAKEY);
    }
    return {
        html: function (setHTML) {
            if(setHTML) {
                $(selector).html(setHTML);
                return $(selector);
            } else {
                var gul = $(selector).html();
                var html = $.gk['toHTML'](gul).innerHTML;
                return html;
            }
        },
        toHTML: function () {
            $(selector).each(function (idx, ele) {
                var realHTML = $.gk['toHTML']($(ele).html());
                $(ele).html(realHTML);
            });
        }
    };
};
$.gk['model'] = {
};
$.gk['toHTML'] = function (html) {
    var ele = TagUtils.createDIVWrapper(html);
    TagLibrary.process(ele);
    var str = JSON.stringify(TagLibrary.eventStore['template']);
    var script = "";
    if(str !== "{}") {
        script = '<script>' + 'TagLibrary.eventStore["template"]=' + "eval(" + str + ");" + '</script>';
    }
    if(!$.support.leadingWhitespace && script) {
        var id = '_gk_' + TagLibrary['serial']++;
        script = '<div id="' + id + '" style="display:none">for old IE</div>' + '<script>$("#' + id + '").remove();</script>' + script;
    }
    var newGKObj = (TagLibrary.eventStore['script'] || []).join(' ');
    ele.innerHTML = script + ele.innerHTML + '<script>' + newGKObj + '</script>';
    TagLibrary.eventStore['script'] = [];
    return ele;
};
$.gk['com'] = function (id, obj) {
    TagLibrary.eventStore['script'] = TagLibrary.eventStore['script'] || [];
    if(obj) {
        $('#' + id).data(TagLibrary.DATAKEY, obj);
        var model = $.gk['model'][id];
        if(model) {
            for(var prop in model) {
                if(model.hasOwnProperty(prop)) {
                    obj[prop] = model[prop];
                }
            }
        }
        obj['_init']();
        obj['init']();
    } else {
        return $('#' + id).data(TagLibrary.DATAKEY);
    }
};
$.gk['def'] = function (data) {
    var div = TagUtils.createDIVWrapper(data);
    $.each($(div).children(), function (idx, ele) {
        var clazz = $(ele).attr('name');
        var tagName = $(ele).attr('name').toUpperCase();
        if($(ele).children().length == 2) {
            var scriptHead = "var " + clazz + " = (function (_super) {__extends(" + clazz + ", _super);function " + clazz + "(id) {_super.call(this, id);} ";
            var scriptFooter = "return " + clazz + ";})(WebComponent);";
            var script = ele.children[1].innerText;
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
};
$.gk['load'] = function (url, callback) {
    $.get(url, function (data) {
        $.gk['def'](data);
        callback();
    });
};
$.gk['refresh'] = function () {
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
(function () {
    var tags = $('script[tags]').attr('tags');
    if(typeof tags != 'undefined') {
        $(document).bind('mobileinit', function () {
            $.extend($['mobile'].zoom, {
                locked: true,
                enabled: false
            });
            $['mobile'].buttonMarkup.hoverDelay = 0;
            $['mobile'].touchOverflowEnabled = true;
            $['mobile'].defaultPageTransition = 'slide';
            $['mobile'].page.prototype.options.addBackBtn = true;
            $['mobile'].autoInitializePage = false;
            $['mobile'].hashListeningEnabled = false;

            $.get(tags)['success'](function (data) {
                // Let old IE know TEMPLATE
                TagUtils.createElement('TEMPLATE');

                $.gk['def'](data);
                $('[gk-app]').each(function (idx, ele) {
                    var html = $.gk['toHTML']($(ele).html());
                    $(ele).html(html.innerHTML);
                });
                $['mobile'].initializePage();
            });
        });
    }
})();$.gk.def("<gk:element name='NavBtn'><gk:view use='NavBtn'><li><a id='${id}' theme='${theme}' href='${href}' data-icon=\"${icon}\" data-transition='none' data-gk-click='${onclick}' class='${state}'>${label}</a></li></gk:view><gk:component> NavBtn.prototype._init = function(){ this.removeDefAttr('href'); if('${theme}' === this.ele.attr('theme')){ this.ele.removeAttr('theme'); }else{ this.ele.attr('data-theme',this.ele.attr('theme')); this.ele.removeAttr('theme'); } if('${icon}' === this.ele.attr('data-icon')){ this.ele.removeAttr('data-icon'); } if('${state}' === this.ele.attr('class')){ this.ele.removeAttr('class'); }else{ this.ele.attr('class','ui-btn-active ui-state-persist'); } }; </gk:component></gk:element><gk:element name='NavBar'><gk:view use='NavBar'><div id='${id}' theme='${theme}' data-grid='${columns}' data-role='navbar' data-iconpos='top' class='${class}' style='${style}'><ul>${content}</ul></div></gk:view><gk:component> NavBar.prototype._init = function(){ if('${theme}' === this.ele.attr('theme')){ this.ele.removeAttr('theme'); }else{ this.ele.attr('data-theme',this.ele.attr('theme')); this.ele.removeAttr('theme'); } this.removeDefAttr(['class','style']); if('${columns}' === this.ele.attr('data-grid')){ this.ele.attr('data-grid','c'); }else{ var num = this.ele.attr('data-grid'); this.ele.attr('data-grid',String.fromCharCode(95+parseInt(num))); } }; </gk:component></gk:element><gk:element name='ListView'><gk:view use='ListView'><ul id='${id}' data-inset='${inset}' autodividers='${autodividers}' data-gk-click='${onclick}' data-role='listview' data-divider-theme='d' class='ui-listview'> ${content} </ul></gk:view><gk:component> ListView.prototype._init = function(){ this.data = []; this.autodividers = this.ele.attr('autodividers'); if('${autodividers}'!==this.ele.attr('autodividers')){ this.ele.attr('data-autodividers','true'); } if('${inset}'===this.ele.attr('data-inset')){ this.ele.removeAttr('data-inset'); } if(typeof this.ready !== 'undefined'){ this.ready(); } }; ListView.prototype.onclick = function(e){ var src = $(e.srcElement); var li = (function(ele){return ele[0].tagName!=='LI' ? arguments.callee($(ele).parent()):ele;})(src); if(typeof this.onRow !=='undefined'){ this.onRow(li); } }; ListView.prototype.info = function (infoArray) { if(infoArray) { var self = this; this.data = infoArray; var listItem = _super.prototype.infoArray.call(this, infoArray); $('#' + this.id).html(listItem); try { this.ele.listview({ autodividersSelector: function (li) { return self.autodividers==='${autodividers}' ? null:li.attr(self.autodividers); }}); this.ele.listview('refresh'); } catch (e) { } } else { return this.data; } }; ListView.prototype.add = function (obj) { this.data.push(obj); this.info(this.data); return this; }; ListView.prototype.remove = function (removeObj) { var removeJSONObj = JSON.stringify(removeObj); this.info($.grep(this.data, function (obj) { return removeJSONObj == JSON.stringify(obj); }, true)); return this; }; </gk:component></gk:element><gk:element name='Header'><gk:view use='Header'><div id='${id}' persist='${persist}' data-gk-click='${onclick}' data-position='fixed' data-role='header'><h1>${label}</h1>${content} </div></gk:view><gk:component> Header.prototype._init = function(){ if('${persist}' === this.ele.attr('persist')){ this.ele.attr('data-id','persist'); } this.ele.removeAttr('persist'); }; Header.prototype.label = function(lab) { if(lab) { var ele = this.ele.find('h1')[0]; ele.innerHTML = lab; return this.ele; } else { return this.ele.children(1).html(); } }; </gk:component></gk:element><gk:element name='Footer'><gk:view use='Footer'><div id='${id}' persist='${persist}' data-position='fixed' data-role='footer'><h4>${content}</h4></div></gk:view><gk:component> Footer.prototype._init = function(){ if('${persist}' === this.ele.attr('persist')){ this.ele.attr('data-id','persist'); } this.ele.removeAttr('persist'); }; </gk:component></gk:element><gk:element name='Content'><gk:view use='Content'><div id='${id}' class='${class}' data-role='content'>${content}</div></gk:view><gk:component> Content.prototype._init = function(){ this.removeDefAttr('class'); }; </gk:component></gk:element><gk:element name='collapsibleset'><gk:view use='collapsibleset'><div data-role=\"collapsible-set\" data-content-theme=\"d\" id=\"${id}\"> ${content} </div></gk:view><gk:component> collapsibleset.prototype._init = function(){ }; </gk:component></gk:element><gk:element name='xDate'><gk:view use='xDate'><label for='${name}'>${label}</label><input id='${id}' name='${name}' type='date' data-role='datebox' data-options=\"{'mode': 'calbox'}\" value='${value}' data-gk-blur='${onblur}'/></gk:view><gk:component> xDate.prototype._init = function(){ }; </gk:component></gk:element><gk:element name='camera'><gk:view use='camera'><img id=\"${id}\" width='320px' height='280px' data-gk-click='${onclick}' src=\"data:image/png;base64,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\"></gk:view><gk:component> camera.prototype.onclick = function(e){ var self = this; navigator.camera.getPicture(function (imageURI) { var largeImage = document.getElementById(self.id); largeImage.style.display = 'block'; largeImage.src = imageURI; } , function (message) { alert('Failed because: ' + message); } , { quality: 90, destinationType: navigator.camera.DestinationType.FILE_URI } ); }; </gk:component></gk:element><gk:element name='collapsible'><gk:view use='collapsible'><div data-role=\"collapsible\" id=\"${id}\" data-collapsed=\"true\"> ${content} </div></gk:view><gk:component> collapsible.prototype.expand = function(){ this.ele.trigger( \"expand\" ); }; collapsible.prototype.collapse = function(){ this.ele.trigger( \"collapse\" ); }; </gk:component></gk:element><gk:element name='Text'><gk:view use='Text'><label for='name'>${label}</label><input id='${id}' type='text' name='${name}' value='${value}' _readonly='${readonly}'/></gk:view><gk:component> Text.prototype._init = function(){ if('${readonly}' !== this.ele.attr('_readonly')){ this.ele.attr('readonly','readonly'); } this.removeDefAttr('value'); }; Text.prototype.value = function (v) { if(v) { return $(this.ele).val(v); } else { return $(this.ele).val(); } }; </gk:component></gk:element><gk:element name='TextArea'><gk:view use='TextArea'><div data-role='fieldcontain'><label for='textarea'>${label}</label><textarea cols='40' rows='8' name='${name}' id='${id}'></textarea></div></gk:view><gk:component></gk:component></gk:element><gk:element name='PieChart'><gk:view use='PieChart'><div id=\"${id}\" width='${width}' height='${height}' cx='${cx}' cy='${cy}' direction='${direction}' radius='${radius}'></div></gk:view><gk:component> var cx = 190,cy=190,direction='north'; var r,radius=100; PieChart.prototype._init = function(){ this.ele.parent().css('width','100%'); this.ele.parent().css('height','100%'); var w = this.ele.attr('width'); var h = this.ele.attr('height'); if(this.ele.attr('direction')!='${direction}'){ direction = this.ele.attr('direction'); } if(this.ele.attr('radius')!='${radius}'){ radius = parseInt(this.ele.attr('radius')); } if(this.ele.attr('cx')!='${cx}'){ cx = parseInt(this.ele.attr('cx')); } if(this.ele.attr('cy')!='${cy}'){ cy = parseInt(this.ele.attr('cy')); } this.ele.css('width',w === '${width}' ? '480px':w); this.ele.css('height',h === '${height}' ? '480px':h); var self = this; yepnope({ test : typeof(Raphael) == \"undefined\", yep : ['http://1101.ezoui.com/home/Demo/3rd/g.raphael/raphael.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.raphael.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.pie.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.line.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.bar.js'], complete: function(){ r = Raphael(self.id); self.ready(); } }); }; PieChart.prototype.render = function(){ if(arguments.length==1){ var newData = [],data=arguments[0]; for(var key in data){ newData.push({'label':key,'value':data[key]}); } data = newData; }else{ data = Array.prototype.slice.call(arguments); } var self = this; var itemLabel = [] , itemValue = []; $.each(data,function(idx,obj){ itemLabel.push(obj.label); itemValue.push(obj.value); }); r.clear(); var pie = r.piechart(cx,cy, radius, itemValue, { legend: itemLabel, legendpos: direction}); pie.hover(function () { this.sector.stop(); this.sector.scale(1.1, 1.1, this.cx, this.cy); if (this.label) { this.label[0].stop(); this.label[0].attr({ r: 7.5 }); this.label[1].attr({ \"font-weight\": 800 }); } }, function () { this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, \"bounce\"); if (this.label) { this.label[0].animate({ r: 5 }, 500, \"bounce\"); this.label[1].attr({ \"font-weight\": 400 }); } }); pie.click(function(){ self.onclick(itemLabel[this.value.order]); }); }; </gk:component></gk:element><gk:element name='Row'><gk:view use='Row'><div id='${id}' class='ui-grid-a' columns='${columns}'> ${content}</div></gk:view><gk:component> Row.prototype._init = function (v) { this.colNum = ['ui-grid-a', 'ui-grid-b', 'ui-grid-c', 'ui-grid-d']; var n = parseInt(this.ele.attr('columns')) - 2; $(this.ele).attr('class', this.colNum[n]); }; </gk:component></gk:element><gk:element name='Page'><gk:view use='Page'><div id='${id}' data-gk-click='${onclick}' data-role='page' class='${class}'>${content}</div></gk:view><gk:component> Page.prototype._init = function(){ this.removeDefAttr('class'); if(typeof this.ready !== 'undefined'){ this.ready(); } }; </gk:component></gk:element><gk:element name='Password'><gk:view use='Password'><label for='password'>${label}</label><input id='${id}' type='password' name='${name}' value='${value}'/></gk:view><gk:component> Password.prototype._init = function(){ this.removeDefAttr('value'); }; </gk:component></gk:element><gk:element name='LineChart'><gk:view use='LineChart'><div id=\"${id}\" width='${width}' height='${height}' cx='${cx}' cy='${cy}'></div></gk:view><gk:component> var cx = 0,cy=0,width='240px',height='240px'; LineChart.prototype._init = function(){ this.ele.parent().css('width','100%'); this.ele.parent().css('height','100%'); if(this.ele.attr('cx')!='${cx}'){ cx = parseInt(this.ele.attr('cx')); } if(this.ele.attr('cy')!='${cy}'){ cy = parseInt(this.ele.attr('cy')); } if(this.ele.attr('width')=='${width}'){ this.ele.attr('width',width); }else { width = this.ele.attr('width'); } this.ele.css('width',width); if(this.ele.attr('height')=='${height}'){ this.ele.attr('height',height); }else { height = this.ele.attr('height'); } this.ele.css('height',height); var self = this; yepnope({ test : typeof(Raphael) == \"undefined\", yep : ['http://1101.ezoui.com/home/Demo/3rd/g.raphael/raphael.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.raphael.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.pie.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.line.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.bar.js'], complete: function(){ r = Raphael(self.id); self.ready(); } }); }; LineChart.prototype.render = function(x,y,opts){ var w = parseInt(width.replace('px',''))-50; var h = parseInt(height.replace('px',''))-50; return r.linechart(cx,cy,w,h,x,y,opts); }; </gk:component></gk:element><gk:element name='ListForm'><gk:view use='ListForm'><div id='${id}' href='${href}' class='ui-link-inherit'><h3 class='ui-li-heading'>${heading}</h3>${content}</div></gk:view><gk:component> ListForm.prototype.info = function (infoForm) { if(infoForm) { var listItem = _super.prototype.infoObject.call(this, infoForm); this.ele.html($.gk.toHTML(listItem)); this.ele.trigger( \"create\" ); return this.data; } }; </gk:component></gk:element><gk:element name='Icon'><gk:view use='Icon'><div style='${style}'><span class=\"ui-li-count ui-btn-corner-all\" style=\"display:none;z-index:1;position:relative;float:right;background:#ed1d24;color:#fff;padding:2px;\"></span><a id='${id}' file='${src}' data-gk-click='${onclick}' height='${height}' width='${width}' _href='${href}' data-role='button' data-mini=\"true\" style='margin:5px;'><img style='width:48px;height:48px;position:relative;left:5px'></a><div style='text-align:center'>${content}</div></div></gk:view><gk:component> Icon.prototype._count = 0; Icon.prototype._init = function(){ if('${href}' !== this.ele.attr('_href')){ this.ele.attr('href',this.ele.attr('_href')); this.ele.removeAttr('_href'); } if('${style}' === this.ele.parent().attr('style')){ this.ele.parent().removeAttr('style'); } if('${height}' === this.ele.parent().attr('height')){ this.ele.removeAttr('height'); }else{ $($(this.ele).children()[0]).css('height',this.ele.attr('height')); } if('${width}' === this.ele.parent().attr('width')){ this.ele.removeAttr('width'); }else{ $($(this.ele).children()[0]).css('width',this.ele.attr('width')); } var file = this.ele.attr('file'); $($(this.ele).children()[0]).attr('src', file); }; Icon.prototype.count = function(i){ if(i){ this.ele.prev().css('display',i==0? 'none':''); this._count = i; this.ele.prev().html(''+i); }else { return this._count;}; }; Icon.prototype.text = function(txt){ if(txt){ var text = this.ele[0].nextSibling; text.innerHTML = txt; }else{ return text.innerHTML; } }; </gk:component></gk:element><gk:element name='GKStyle'><gk:view use='GKStyle'><div class='gkStyleTempClass' style='display:none'>aaa</div><style>${content;}</style></gk:view><gk:component> GKStyle.prototype.init = function(){ $('.gkStyleTempClass').remove(); }; </gk:component></gk:element><gk:element name='Btn'><gk:view use='Btn'><a id='${id}' href='#' style='${style}' type='button' value='${value}' data-inline='${inline}' data-gk-click='${onclick}' data-icon='${icon}'>${label}</a></gk:view><gk:component> Btn.prototype._init = function(){ var pos = this.ele.attr('_iconpos'); this.ele.attr('data-iconpos', pos); if(this.ele.attr('data-icon')==='${icon}'){ this.ele.removeAttr('data-icon'); } this.removeDefAttr('style'); if(typeof this.ready !== 'undefined'){ this.ready(); } }; Btn.prototype.enable = function (b) { this.ele.button(b ? 'enable' : 'disable'); }; Btn.prototype.refresh = function () { this.ele.button('refresh'); }; Btn.prototype.label = function (val) { if(val) { $($('#' + this.id + ' span span')[0]).html(val); } else { return $($('#' + this.id + ' span span')[0]).html(); } }; Btn.prototype.visible = function (b) { if(arguments.length == 0) { return this.ele.parent().is(':visible'); } else { b ? this.ele.parent().show() : this.ele.parent().hide(); } }; </gk:component></gk:element><gk:element name='Column'><gk:view use='Column'><div id='${id}' idx='${idx}' style='${style}'> ${content} </div></gk:view><gk:component> Column.prototype._init = function(){ this.removeDefAttr('style'); this.colNum = [ 'ui-block-a', 'ui-block-b', 'ui-block-c', 'ui-block-d', 'ui-block-e' ]; var n = parseInt(this.ele.attr('idx')) - 1; $(this.ele).attr('class', this.colNum[n]); }; </gk:component></gk:element><gk:element name='BackBtn'><gk:view use='BackBtn'><a id='${id}' href='${href}' data-icon='back' data-rel='back' class='ui-btn-${pos}'>${label}</a></gk:view><gk:component> BackBtn.prototype._init=function(){ this.removeDefAttr('href'); if('${label}' === this.ele.html()){ this.ele.html('Back'); } }; </gk:component></gk:element><gk:element name='BarChart'><gk:view use='BarChart'><div id=\"${id}\" width='${width}' height='${height}'></div><table></table></gk:view><gk:component> var r; BarChart.prototype._init = function(){ this.ele.parent().css('width','100%'); this.ele.parent().css('height','100%'); var w=this.ele.attr('width'); var h=this.ele.attr('height'); this.ele.css('width',w === '${width}' ? '480px':w); this.ele.next().css('width',w === '${width}' ? '480px':w); this.ele.next().css('margin','0 0 0 10px'); this.ele.css('height',h === '${height}' ? '480px':h); var self=this; yepnope({ test : typeof(Raphael) == \"undefined\", yep : ['http://1101.ezoui.com/home/Demo/3rd/g.raphael/raphael.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.raphael.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.pie.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.line.js', 'http://1101.ezoui.com/home/Demo/3rd/g.raphael/g.bar.js'], complete: function(){ r=Raphael(self.id); self.ready(); } }); }; BarChart.prototype.render = function(x,y,width,height,values,xray,opts){ var self=this; r.clear(); var table=this.ele.next()[0]; var tr=document.createElement(\"TR\"); for(var i in xray){ tr.innerHTML += '&lt;td>'+xray[i]+'&lt;/td>'; } $(table).append(tr); var barchart = r.barchart(x,y,width,height,values,xray,opts); barchart.hover( function () { this.flag = r.popup(this.bar.x, this.bar.y, this.bar.value || \"0\").insertBefore(this); },function () { this.flag.animate({opacity: 0}, 3000, function () {this.remove();}); } ); return barchart; }; </gk:component></gk:element>");
$(document).bind('mobileinit', function () {
    $.extend($['mobile'].zoom, {locked: true,enabled: false});
    $['mobile'].buttonMarkup.hoverDelay = 0;
    $['mobile'].touchOverflowEnabled = true;
    $['mobile'].defaultPageTransition = 'slide';
    $['mobile'].page.prototype.options.addBackBtn = true;
    $['mobile'].autoInitializePage = false;
    $['mobile'].hashListeningEnabled = false;
  $(document).ready(function(){		 
	$('[gk-app]').each(function (idx, ele) {
	  var html = $.gk['toHTML']($(ele).html());
	  $(ele).html(html.innerHTML);
	  $['mobile'].initializePage();
	});	
  });
});