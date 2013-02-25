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
    WebComponent.prototype.init = function () {
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
    TagUtils.createDIVWrapper = function createDIVWrapper(html) {
        var fragment = document.createDocumentFragment();
        var root = document.documentElement;
        var div = document.createElement('div');
        var tempdiv = document.createElement('div');
        fragment.appendChild(div);
        tempdiv.style.display = "none";
        root.appendChild(tempdiv);
        tempdiv.innerHTML = html;
        while(tempdiv.firstChild) {
            div.appendChild(tempdiv.firstChild);
        }
        root.removeChild(tempdiv);
        return div;
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
        CustomTag.customTagElement = TagLibrary.customTags[element.nodeName.toUpperCase()].cloneNode(true);
        CustomTag.clazz = $(this.customTagElement).attr(CustomTag.CLASS) || 'WebComponent';
        CustomTag.html = $(this.customTagElement).html();
        if(typeof element.id === 'undefined' || element.id == '') {
            element.id = '_gk_' + TagLibrary['serial']++;
        }
        var script = "$.gk.com('" + element.id + "' , new window['" + CustomTag.clazz + "']('" + element.id + "'));";
        TagLibrary.eventStore['script'].push(script);
        var newHTML = CustomTag.html;
        var repHTML = TagUtils.innerHTML(this.processTagElement);
        window[CustomTag.clazz].gkm = repHTML;
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
    TagLibrary.customTagStyles = {
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
    var script = '<script>' + 'TagLibrary.eventStore["template"]=' + "eval(" + str + ");" + '</script>';
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
        var rg = /<style>(.|\s)*?<\/style>/gi;
        var match = data.match(rg);
        if(match && match.length > 0) {
            var idx = match.length;
            var reg = /<style>|<\/style>/gi;
            while(idx > 0) {
                idx = idx - 1;
                match[idx] = match[idx].replace(reg, '');
            }
            TagLibrary.customTagStyles[tagName] = match;
        }
        if(!$.support.leadingWhitespace) {
            document.createElement(tagName);
        }
    });
    $.gk['taglib'] = $.gk['taglib'] || new TagLibrary();
};
$.gk['tagStyles'] = function (tagName) {
    var styles;
    if(tagName) {
        styles = TagLibrary.customTagStyles[tagName.toUpperCase()] || [];
    } else {
        styles = TagLibrary.customTagStyles;
    }
    return styles;
};
$.gk['load'] = function (url, callback) {
    $.get(url, function (data) {
        $.gk['def'](data);
        callback();
    });
};
(function ($) {
    $.fn.gk = function (method, options) {
        if(arguments.length == 0) {
            return $(this).data(TagLibrary.DATAKEY);
        }
        var firstResult;
        this.each(function (idx, ele) {
            var gkObj = $(ele).data(TagLibrary.DATAKEY);
            if(typeof gkObj != 'undefined' && gkObj[method] != 'undefined') {
                var result = gkObj[method](options);
                if(idx == 0) {
                    firstResult = result;
                }
            }
        });
        return firstResult;
    };
})(jQuery);
$.gk.def("<gk:element name='Nav'><gk:view><div class='navbar navbar-inverse navbar-fixed-top'><div class='navbar-inner'><div class='container' style='font-size:1rem;'><div class='nav-collapse collapse'><ul class='nav'><li class='${home}'><a href='./index.html'> Home</a></li><li class='${getstarted}'><a href='./getstarted.html'> Get Started</a></li><li class='${play}'><a href='./play.html'> Play</a></li><li class='${api}'><a href='./api.html'> API</a></li><li class='${component}'><a href='./jqueryMobileTmpl.html'> Component</a></li><li class='${pattern}'><a href='./pattern.html'> Pattern</a></li></ul></div></div></div></div></gk:view></gk:element><gk:element name='GMap'><gk:view use='GMap'><div style='${style}'><div id='${id}' style='${style}' zoom='${zoom}' type='${type}' data-gk-click='${onclick}'></div><div>${gkm}</div></div></gk:view></gk:element><gk:element name='Page'><gk:view><div id='${id}' data-role='page'>${content}</div></gk:view></gk:element><gk:element name='Header'><gk:view use='Header'><div id='${id}' data-gk-click='${onclick}' data-position='fixed' data-theme='a' data-role='header' style='font-size:16px;text-align:center;'><div style='margin:13px 0 0 0'>${label}</div>${content}</div></gk:view><gk:component> Header.prototype.label = function (lab) { if(lab) { this.ele.children(1).html(lab); return this.ele; } else { return this.ele.children(1).html(); } }; </gk:component></gk:element><gk:element name='Content'><gk:view><div id='${id}' style='padding:15px' data-role='content'>${content}</div></gk:view></gk:element><gk:element name='Footer'><gk:view><div id='${id}' data-position='fixed' data-theme='a' data-role='footer'>${content}</div></gk:view></gk:element><gk:element name='ListForm'><gk:view><li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='d' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d'><div href='${href}' class='ui-link-inherit'><h3 class='ui-li-heading'>${heading}</h3>${content}</div></li></gk:view></gk:element><gk:element name='ListView'><gk:view use='ListView'><style>.ui-li-desc{font-size:16px;}.ui-li{font-size:18px;}</style><ul id='${id}' data-gk-click='${onclick}' data-role='listview' data-inset='${inset}' data-divider-theme='d' class='ui-listview'> ${content} </ul></gk:view><gk:component> ListView.prototype.data = []; ListView.prototype.info = function (infoArray) { if(infoArray) { this.data = infoArray; var listItem = _super.prototype.infoArray.call(this, infoArray); $('#' + this.id).html(listItem); try { var el = $('#' + this.id); el.listview('refresh'); } catch (e) { } } else { return this.data; } }; ListView.prototype.add = function (obj) { this.data.push(obj); this.info(this.data); return this; }; ListView.prototype.remove = function (removeObj) { var removeJSONObj = JSON.stringify(removeObj); this.info($.grep(this.data, function (obj) { return removeJSONObj == JSON.stringify(obj); }, true)); return this; }; </gk:component></gk:element><gk:element name='SelectBar'><gk:view use='SelectBar'><div data-role='navbar' data-grid='d' class='ui-navbar ui-mini' role='navigation'><ul id='${id}' class='ui-grid-d' data-gk-click='${onclick}'> ${content} </ul></div></gk:view><gk:component> this.date = 'none'; </gk:component></gk:element><gk:element name='Text'><gk:view use='Text'><label for='name'>${label}</label><input id='${id}' type='text' name='${name}' value='${value}' readonly/></gk:view><gk:component> Text.prototype.value = function (v) { if(v) { return $(this.ele).val(v); } else { return $(this.ele).val(); } }; </gk:component></gk:element><gk:element name='Date'><gk:view use='Date'><label for='${name}'>${label}</label><input id='${id}' name='${name}' type='date' data-role='datebox' data-options=\"{'mode': 'calbox'}\" value='${value}' data-gk-blur='${onblur}'/></gk:view></gk:element><gk:element name='Password'><gk:view><label for='password'>${label}</label><input id='${id}' type='password' name='${name}' value='${value}'/></gk:view></gk:element><gk:element name='TextArea'><gk:view><div data-role='fieldcontain'><label for='textarea'>${label}</label><textarea cols='40' rows='8' name='${name}' id='${id}'></textarea></div></gk:view></gk:element><gk:element name='Row'><gk:view use='Row'><div id='${id}' class='ui-grid-a' columns='${columns}'> ${content}</div></gk:view><gk:component> Row.prototype.init = function (v) { this.colNum = ['ui-grid-a', 'ui-grid-b', 'ui-grid-c', 'ui-grid-d']; var n = parseInt(this.ele.attr('columns')) - 2; $(this.ele).attr('class', this.colNum[n]); }; </gk:component></gk:element><gk:element name='Column'><gk:view use='Column'><div id='${id}' idx='${idx}'> ${content} </div></gk:view><gk:component> Column.prototype.init = function(){ this.colNum = ['ui-block-a','ui-block-b','ui-block-c', 'ui-block-d','ui-block-e']; var n = parseInt(this.ele.attr('idx')) - 1; $(this.ele).attr('class', this.colNum[n]); }; </gk:component></gk:element><gk:element name='Btn'><gk:view use='Btn'><a id='${id}' href='#' type='button' value='${value}' data-inline='${inline}' data-gk-click='${onclick}' data-icon='${icon}'>${label}</a></gk:view><gk:component> Btn.prototype.init = function(){ var pos=this.ele.attr('_iconpos'); this.ele.attr('data-iconpos', pos); }; Btn.prototype.enable = function (b) { this.ele.button(b ? 'enable' : 'disable'); }; Btn.prototype.refresh = function () { this.ele.button('refresh'); }; Btn.prototype.label = function (val) { if(val) { $($('#' + this.id + ' span span')[0]).html(val); } else { return $($('#' + this.id + ' span span')[0]).html(); } }; Btn.prototype.visible = function (b) { if(arguments.length>0) { b ? this.ele.parent().show() : this.ele.parent().hide(); } else { return this.ele.parent().is(':visible'); } }; </gk:component></gk:element><gk:element name='BackBtn'><gk:view use='BackBtn'><a data-icon='back' data-rel='back' href='#home' class='ui-btn-${pos}'>${label}</a></gk:view></gk:element><gk:element name='NavBar'><gk:view><div id='${id}' data-role='navbar' data-iconpos='top'><ul>${content}</ul></div></gk:view></gk:element><gk:element name='NavBtn'><gk:view use='NavBtn'><li><a id='${id}' href='${href}' data-transition='none' data-theme='' data-gk-click='${onclick}' data-icon='${icon}' class='${state}'>${label}</a></li></gk:view><gk:component> NavBtn.prototype.init = function(){ this.replaceAttr('class', 'on', 'ui-btn-active ui-state-persist'); }; </gk:component></gk:element><gk:element name='Icon'><gk:view use='Icon'><span class=\"ui-li-count ui-btn-corner-all\" style=\"display:none;z-index:1;position:relative;float:right;background:#ed1d24;color:#fff;padding:2px;\"></span><a id='${id}' file='${src}' data-gk-click='${onclick}' data-role='button' data-mini=\"true\" style='margin:5px;'><img style='width:48px;height:48px;position:relative;left:5px'></a><div style='text-align:center'>${content}</div></gk:view><gk:component> Icon.prototype._count = 0; Icon.prototype.init = function(){ var file = this.ele.attr('file'); $($(this.ele).children()[0]).attr('src', file); }; Icon.prototype.count = function(i){ this.ele.prev().css('display',i==0? 'none':''); this.ele.prev().html(''+i); }; </gk:component></gk:element>");