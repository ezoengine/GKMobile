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
        return replaceHTML;
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
        return replaceHTML;
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
                var html = $.gk['toHTML'](gul);
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
    var val = script + ele.innerHTML + '<script>' + newGKObj + '</script>';
    TagLibrary.eventStore['script'] = [];
    return val;
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
        var $ele = $(ele);
        var $eleChilds = $ele.children();
        var clazz = $ele.attr('name');
        var tagName = $ele.attr('name').toUpperCase();
        if($eleChilds.length == 2) {
            var scriptHead = "var " + clazz + " = (function (_super) {__extends(" + clazz + ", _super);function " + clazz + "(id) {_super.call(this, id);} ";
            var scriptFooter = "return " + clazz + ";})(WebComponent);";
            var script = $($eleChilds[1]).text();
            script = scriptHead + script + scriptFooter;
            var headID = document.getElementsByTagName("head")[0];
            var newScript = document.createElement('script');
            newScript['type'] = 'text/javascript';
            newScript['text'] = script;
            headID.appendChild(newScript);
        }
        var view = $eleChilds[0];
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
                TagUtils.createElement('TEMPLATE');
                $.gk['def'](data);
                $('[gk-app]').each(function (idx, ele) {
                    var html = $.gk['toHTML']($(ele).html());
                    $(ele).html(html);
                });
                $['mobile'].initializePage();
            });
        });
    }
})();