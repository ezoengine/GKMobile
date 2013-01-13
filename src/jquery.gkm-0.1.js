var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var WebComponent = (function () {
    function WebComponent(args) {
        this.id = args;
        TagUtils.iteratorNewNode(this.ele);
        var className = this.className();
        if(!WebComponent.list.hasOwnProperty(className)) {
            WebComponent.list[className] = [];
        }
        if(this.id != null) {
            WebComponent.list[className].push(this.id);
            this.ele = $('#' + this.id);
        }
        this.bindEvent();
    }
    WebComponent.gkm = "";
    WebComponent.list = {
    };
    WebComponent.prototype.init = function () {
    };
    WebComponent.updateAll = function updateAll(className, callback) {
        $.each(WebComponent.list[className], function (idx, id) {
            var webObj = $.gk('#' + id);
            callback(webObj);
        });
    }
    WebComponent.prototype.get = function (name) {
        return this.ele.attr(name);
    };
    WebComponent.prototype.set = function (name, value) {
        this.ele.attr(name, value);
    };
    WebComponent.prototype.replaceAttr = function (key, srcVal, repVal) {
        if(this.get(key) == srcVal) {
            this.set(key, repVal);
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
                if(eventName != 'init') {
                    var onXXXEvent = 'on' + eventName;
                    $(this.ele).unbind(eventName);
                    this.ele.bind(eventName, function (evt) {
                        if(typeof (self[onXXXEvent]) == "function") {
                            self[onXXXEvent](evt);
                        }
                    });
                }
            }
        }
    };
    WebComponent.prototype.onclick = function (evt) {
        console.log('WebComponent onclick....' + this.id);
        var on = this.get('data-gk-click');
    };
    WebComponent.prototype.onkeyup = function (evt) {
        console.log('WebComponent onkeyup....' + this.id);
        var on = this.get('data-gk-keyup');
    };
    WebComponent.prototype.className = function () {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((this)['constructor'].toString());
        return (results && results.length > 1) ? results[1] : "";
    };
    WebComponent.prototype.gkm = function () {
        try  {
            return window[this.className()].gkm;
        } catch (e) {
            console.log(this.className + " not found!" + e);
        }
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
    WebComponent.prototype.defineProperty = function (a1, a2, a3) {
    };
    WebComponent.prototype.watch = function (prop, handler) {
        var obj = WebComponent.prototype;
        if(WebComponent.prototype['__proto__']) {
            obj = WebComponent.prototype['__proto__'];
        }
        var oldval = this[prop];
        var newval = oldval;
        var getter = function () {
            return newval;
        };
        var setter = function (val) {
            oldval = newval;
            return newval = handler.call(this, prop, oldval, val);
        };

        if(delete this[prop]) {
            if(obj.defineProperty) {
                obj.defineProperty(this, prop, {
                    get: getter,
                    set: setter
                });
            } else {
                if(obj['__defineGetter__'] && obj['__defineSetter__']) {
                    obj['__defineGetter__'].call(this, prop, getter);
                    obj['__defineSetter__'].call(this, prop, setter);
                } else {
                    console.log('failure');
                }
            }
        }
    };
    return WebComponent;
})();
var Btn = (function (_super) {
    __extends(Btn, _super);
    function Btn(id) {
        _super.call(this, id);
        var pos = this.get('_iconpos');
        this.set('data-iconpos', pos);
    }
    Btn.prototype.enable = function (b) {
        this.ele.button(b ? 'enable' : 'disable');
    };
    Btn.prototype.refresh = function () {
        this.ele.button("refresh");
    };
    Btn.prototype.visible = function (b) {
        if(arguments.length > 0) {
            b ? this.ele.parent().show() : this.ele.parent().hide();
        } else {
            return this.ele.parent().is(":visible");
        }
    };
    Btn.prototype.label = function (val) {
        if(val) {
            $($('#' + this.id + '    span span')[0]).html(val);
        } else {
            return $($('#' + this.id + ' span span')[0]).html();
        }
    };
    return Btn;
})(WebComponent);
var Column = (function (_super) {
    __extends(Column, _super);
    function Column(id) {
        _super.call(this, id);
        this.colNum = [
            'ui-block-a', 
            'ui-block-b', 
            'ui-block-c', 
            'ui-block-d', 
            'ui-block-e'
        ];
        var n = parseInt(this.get('idx')) - 1;
        $(this.ele).attr('class', this.colNum[n]);
    }
    return Column;
})(WebComponent);
var Header = (function (_super) {
    __extends(Header, _super);
    function Header(id) {
        _super.call(this, id);
    }
    Header.prototype.label = function (lab) {
        if(lab) {
            this.ele.children(1).html(lab);
            return this.ele;
        } else {
            return this.ele.children(1).html();
        }
    };
    return Header;
})(WebComponent);
var Icon = (function (_super) {
    __extends(Icon, _super);
    function Icon(id) {
        _super.call(this, id);
        var file = this.get('file');
        $($(this.ele).children()[0]).attr('src', file);
    }
    return Icon;
})(WebComponent);
var Radio = (function (_super) {
    __extends(Radio, _super);
    function Radio(id) {
        _super.call(this, id);
        var checked = this.get('_checked');
        if(checked == 'true') {
            this.set('checked', '');
        }
    }
    return Radio;
})(WebComponent);
var Link = (function (_super) {
    __extends(Link, _super);
    function Link(id) {
        _super.call(this, id);
    }
    return Link;
})(WebComponent);
var NavButton = (function (_super) {
    __extends(NavButton, _super);
    function NavButton(id) {
        _super.call(this, id);
        this.replaceAttr('class', 'on', 'ui-btn-active ui-state-persist');
    }
    return NavButton;
})(WebComponent);
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(id) {
        _super.call(this, id);
        this.colNum = [
            'ui-grid-a', 
            'ui-grid-b', 
            'ui-grid-c', 
            'ui-grid-d'
        ];
        var n = parseInt(this.get('columns')) - 2;
        $(this.ele).attr('class', this.colNum[n]);
    }
    return Row;
})(WebComponent);
var txt = (function (_super) {
    __extends(txt, _super);
    function txt(id) {
        _super.call(this, id);
    }
    txt.prototype.value = function (v) {
        if(v) {
            return $(this.ele).val(v);
        } else {
            return $(this.ele).val();
        }
    };
    return txt;
})(WebComponent);
var Divider = (function (_super) {
    __extends(Divider, _super);
    function Divider(id) {
        _super.call(this, id);
    }
    Divider.prototype.label = function (y) {
        if(y) {
            this._label = y;
            this.ele.get(0).firstChild.nodeValue = y;
        } else {
            return $(this.ele).get(0).firstChild.nodeValue;
        }
    };
    Divider.prototype.tip = function (s) {
        if(s) {
            this._tip = s;
            $(this.ele).children(1).html(s);
        } else {
            $(this.ele).children(1).html();
        }
    };
    return Divider;
})(WebComponent);
var Password = (function (_super) {
    __extends(Password, _super);
    function Password(id) {
        _super.call(this, id);
    }
    return Password;
})(txt);
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView(id) {
        _super.call(this, id);
        this.data = [];
    }
    ListView.prototype.info = function (infoArray) {
        if(infoArray) {
            this.data = infoArray;
            var listItem = _super.prototype.infoArray.call(this, infoArray);
            $("#" + this.id).html(listItem);
            try  {
                var el = $("#" + this.id);
                el.listview('refresh');
            } catch (e) {
            }
        } else {
            return this.data;
        }
    };
    ListView.prototype.add = function (obj) {
        this.data.push(obj);
        this.info(this.data);
        return this;
    };
    ListView.prototype.remove = function (removeObj) {
        var removeJSONObj = JSON.stringify(removeObj);
        this.info($.grep(this.data, function (obj) {
            return removeJSONObj == JSON.stringify(obj);
        }, true));
        return this;
    };
    return ListView;
})(WebComponent);
var Form = (function (_super) {
    __extends(Form, _super);
    function Form(id) {
        _super.call(this, id);
    }
    Form.prototype.info = function (infoObject) {
        if(infoObject) {
            var form = _super.prototype.infoObject.call(this, infoObject);
            $("#" + this.id).html(form);
        } else {
            return '><';
        }
    };
    return Form;
})(WebComponent);
var List = (function (_super) {
    __extends(List, _super);
    function List(id) {
        _super.call(this, id);
    }
    return List;
})(WebComponent);
var SelectBar = (function (_super) {
    __extends(SelectBar, _super);
    function SelectBar(id) {
        _super.call(this, id);
        this.date = 'none';
    }
    return SelectBar;
})(WebComponent);
var PopupPanel = (function (_super) {
    __extends(PopupPanel, _super);
    function PopupPanel(id) {
        _super.call(this, id);
        var popId = "#" + id + "_popupPanel";
        $(popId).on({
            popupbeforeposition: function () {
                var h = $(window).height();
                $(popId).css("height", h - 20);
            }
        });
    }
    PopupPanel.prototype.info = function (infoArray) {
        if(infoArray) {
            var listItem = _super.prototype.infoArray.call(this, infoArray);
            $("#" + this.id).html(listItem);
        } else {
            return '><';
        }
    };
    return PopupPanel;
})(WebComponent);
var GMap = (function (_super) {
    __extends(GMap, _super);
    function GMap(id) {
        _super.call(this, id);
        this.options = {
        };
        var h = document.documentElement.clientHeight - 24;
        var w = document.documentElement.clientWidth;
        this.replaceAttr('style', '${style}', 'width:' + w + 'px;height:' + h + 'px');
        this.replaceAttr('zoom', '${zoom}', '12');
        this.replaceAttr('type', '${type}', GMap.ROADMAP);
        $(this.ele).parent().attr('style', $(this.ele).attr('style'));
        this.options['zoom'] = parseInt(this.get('zoom'));
        this.options['mapTypeId'] = this.get('type');
        this._address = this.ele[0].nextSibling.nextSibling.innerHTML.trim();
        this.initMap();
    }
    GMap.initGoogleMapScript = 'stop';
    GMap.CallbackFunc = 'GK_GMap';
    GMap.waitQueue = [];
    GMap.HYBRID = "hybrid";
    GMap.ROADMAP = "roadmap";
    GMap.SATELLITE = "satellite";
    GMap.TERRAIN = "terrain";
    GMap.initScript = function initScript() {
        $.each(GMap.waitQueue, function (idx, obj) {
            obj.initialize();
        });
    }
    GMap.prototype.height = function (h) {
        if(h) {
            $(this.ele).css('height', h);
            this._height = h;
            google.maps.event.trigger(this.map, "resize");
        } else {
            return this._height;
        }
    };
    GMap.prototype.width = function (w) {
        if(w) {
            $(this.ele).css('width', w);
            this._width = w;
            google.maps.event.trigger(this.map, "resize");
        } else {
            return this._width;
        }
    };
    GMap.prototype.initMap = function () {
        if(GMap.initGoogleMapScript === 'stop') {
            GMap.initGoogleMapScript = 'running';
            GMap.waitQueue.push(this);
            window[GMap.CallbackFunc] = function () {
                GMap.initScript();
            };
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://maps.google.com/maps/api/js?sensor=false&callback=" + GMap.CallbackFunc;
            document.body.appendChild(script);
        } else {
            if(GMap.initGoogleMapScript === 'running') {
                GMap.waitQueue.push(this);
            } else {
                this.initialize();
            }
        }
    };
    GMap.prototype.initialize = function () {
        GMap.initGoogleMapScript = 'done.';
        if(this._address) {
            this.address(this._address);
        } else {
            this.options['center'] = new google.maps.LatLng(22.604943497851177, 120.30919253826141);
            this.map = new google.maps.Map(document.getElementById(this.id), this.options);
            this.init();
        }
    };
    GMap.prototype.nowPos = function (address) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
        });
    };
    GMap.prototype.location = function (lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        if(this.marker) {
            this.marker.setMap(null);
        }
        this.marker = new google.maps.Marker({
            position: latlng,
            map: this.map,
            title: this.options['title']
        });
        this.marker.setMap(this.map);
        this.map.setZoom(this.options['zoom']);
        this.map['setCenter'](latlng);
    };
    GMap.prototype.address = function (addr) {
        var self = this;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: addr
        }, function (result, status) {
            if(status == google.maps.GeocoderStatus.OK) {
                var location = result[0].geometry.location;
                if(!self.map) {
                    self.map = new google.maps.Map(document.getElementById(self.id), self.options);
                    self.init();
                }
                if(self.marker) {
                    self.marker.setMap(null);
                }
                self.marker = new google.maps.Marker({
                    position: location,
                    map: self.map,
                    title: addr
                });
                self.marker.setMap(self.map);
                self.map.setZoom(self.options['zoom']);
                self.map['setCenter'](location);
            } else {
            }
        });
    };
    return GMap;
})(WebComponent);
var TagUtils = (function () {
    function TagUtils() { }
    TagUtils.createDIVWrapper = function createDIVWrapper(html) {
        var fragment = document.createDocumentFragment();
        var div = document.createElement('div');
        fragment.appendChild(div);
        div.innerHTML = html;
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
    TagUtils.iteratorNewNode = function iteratorNewNode(newNode) {
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
        CustomTag.customTagElement = TagLibrary.customTags[element.nodeName].cloneNode(true);
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
        this.tmpl = "<element name='gmap' use='GMap'><div style='${style}'><div id='${id}' style='${style}' zoom='${zoom}' type='${type}' data-gk-click='${onclick}'></div><div >${gkm}</div></div></element><element name='page'><div id='${id}' data-role='page' data-gk-init='${init}' class='${class}'>${gkm}</div></element><element name='header' use='Header'> <div id='${id}' data-position='fixed' data-theme='a' data-role='header' data-gk-init='${init}' style='font-size:16px;text-align:center;'> <div style='margin:13px 0 0 0'>${label}</div>&nbsp;${gkm} </div></element><element name='content'><div id='${id}' style='padding:15px' data-role='content'>${gkm}</div></element><element name='footer'> <div id='${id}' data-position='fixed' data-theme='a' data-role='footer' data-gk-init='${init}'>${gkm}</div></element><element name='group'><fieldset data-role='controlgroup' data-type='horizontal' >${gkm}</fieldset></element><element name='radio' use='Radio'><input id='${id}' _checked='${checked}' data-gk-click='${onclick}' type='radio' name='${name}' value='${value}'/><label for='${id}' >${gkm}</label></element><element name='text' use='txt'><div data-role='fieldcontain'> <label for='name'>${label}</label> <input id='${id}' type='text' name='${name}' value='${value}' readonly/></div></element><element name='date' ><label for='${name}'>${label}</label><input id='${id}' name='${name}' type='date' data-role='datebox' data-options='{'mode': 'calbox'}' value='${value}' data-gk-blur='${onblur}'></element><element name='password' use='Password'><div data-role='fieldcontain'> <label for='password'>${label}</label> <input id='${id}' type='password' name='${name}' value='${value}' /></div></element><element name='textarea' ><div data-role='fieldcontain'><label for='textarea'>${label}</label><textarea cols='40' rows='8' name='${name}' id='${id}'></textarea></div></element><element name='row' use='Row'><div id='${id}' class='ui-grid-a' columns='${columns}'>${gkm}</div></element><element name='icon' use='Icon'><a id='${id}' file='${src}' data-gk-click='${onclick}' data-role='button' style='text-decoration:none;color:#000000;margin:3px'> <img style='width:48px;height:48px;' ></a><div style='text-align:center'>${gkm}</div></element><element name='column' use='Column'><div id='${id}' idx='${idx}' >${gkm}</div></element><element name='backBtn'><a data-icon='back' data-rel='back' href='#home' class='ui-btn-${pos}'>${label}</a></element><element name='backBtn2'><a data-icon='back' data-transition='slide' data-direction='reverse' class='ui-btn-${pos}' href='${href}'><div style='height:28px;line-height:28px;'>${label}</div></a></element><element name='btn2' use='Btn'><a id='${id}' data-icon='${icon}' _iconpos='${iconpos}' class='ui-btn-${pos}' href='${href}' data-gk-click='${onclick}'>${label}</a></element><element name='btn' use='Btn'><a id='${id}' href='#' type='button' value='${value}' data-inline='${inline}' data-gk-click='${onclick}' data-gk-init='${init}' data-icon='${icon}'>${label}</a></element><element name='link' use='Link'> <div> <a id='${id}' href='${href}' data-gk-click='${onclick}' data-gk-init='${init}'>${text}</a> </div></element><element name='navbar'><div id='${id}' data-role='navbar' data-iconpos='top' data-gk-init='${init}'><ul>${gkm}</ul></div></element><element name='navbtn' use='NavButton'><li><a id='${id}' href='${href}' data-transition='none' data-theme='' data-gk-click='${onclick}' data-gk-init='${init}' data-icon='${icon}' class='${state}'>${label}</a></li></element><element name='listview' use='ListView'><style>.ui-li-desc {font-size:16px}.ui-li {font-size:18px}</style><ul id='${id}' data-role='listview' data-inset='${inset}' data-divider-theme='d' class='ui-listview'>${gkm}</ul></element><element name='form' use='Form'><div id='${id}'>${gkm}</div></element><element name='list' use='List'><li id='${id}' data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='d' data-gk-click='${onclick}' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d'><a href='${href}' class='ui-link-inherit' > <h3 class='ui-li-heading'>${heading}</h3> ${gkm}</a></li></element><element name='listForm'><li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='d' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d'><div href='${href}' class='ui-link-inherit'> <h3 class='ui-li-heading'>${heading}</h3> ${gkm}</div></li></element><element name='divider' use='Divider'> <li id='${id}' data-role='list-divider' role='heading' class='ui-li ui-li-divider ui-bar-d ui-li-has-count ui-first-child' >${label}<span class='ui-li-count ui-btn-up-c ui-btn-corner-all' onclick='alert(123)'>${tip}</span></li></element><element name='selectBar' use='SelectBar'><div data-role='navbar' data-grid='d' class='ui-navbar ui-mini' role='navigation'><ul id='${id}' class='ui-grid-d' data-gk-click='${onclick}'>${gkm}</ul></div></element><element name='popup' use='PopupPanel'><style>#${id}-popup { right: 0 !important; left: auto !important;}#${id} {width: 100px;border: 1px solid #000;border-right: none;background: rgba(0,0,0,.5);margin: -1px 0;}#${id} .ui-btn {margin: 8px 2px;}</style><a href='#${id}' data-icon='' class='ui-btn-right' data-rel='popup' data-transition='slide' data-position-to='window' data-role='button'> <div id='${id}_popupPanel' style='height:28px;line-height:28px;'>${label}</div></a><div data-role='popup' id='${id}' data-corners='false' data-theme='none' data-shadow='false' data-tolerance='0,0'> ${gkm} </div></element>";
        template = template || this.tmpl;
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
    TagLibrary.gkm = '${gkm}';
    TagLibrary.eventStore = [];
    TagLibrary.debug = function debug(msg) {
    }
    TagLibrary.template = function template(id) {
        return TagLibrary.eventStore['template'][id];
    }
    TagLibrary.isComponent = function isComponent(tagName) {
        return TagLibrary.customTags[tagName];
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
$.gk = function (selector) {
    if(selector.indexOf('#') == 0) {
        return $(selector).data('obj');
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
        replaceWith: function (targetTag) {
            var realHTML = this.toHTML(selector).innerHTML;
            $(targetTag).replaceWith(realHTML);
        },
        appendTo: function (targetTag) {
            var ele = this.toHTML(selector);
            $(targetTag).append(ele.innerHTML);
            for(var idx = 0; idx < TagLibrary.eventStore.length; idx++) {
                var obj = $.gk['com'](TagLibrary.eventStore[idx].id);
                if(obj != null) {
                    obj.init();
                }
            }
        }
    };
};
$.gk['model'] = {
};
$.gk['toHTML'] = function (html) {
    $.gk['taglib'] = $.gk['taglib'] || new TagLibrary();
    var ele = TagUtils.createDIVWrapper(html);
    TagLibrary.process(ele);
    var str = JSON.stringify(TagLibrary.eventStore['template']);
    var script = '<script>' + 'TagLibrary.eventStore["template"]=' + "eval(" + str + ");" + '</script>';
    var newGKObj = (TagLibrary.eventStore['script'] || []).join(' ');
    ele.innerHTML = script + ele.innerHTML + '<script>' + newGKObj + '</script>';
    TagLibrary.eventStore['script'] = [];
    return ele;
};
$.gk['tmpl'] = function (arg0, arg1) {
    if(arguments.length == 1) {
        $.gk['taglib'] = new TagLibrary(arg0);
    } else {
        $.get(arg0, function (template) {
            $.gk['taglib'] = new TagLibrary(template);
            arg1();
        });
    }
    ; ;
};
$.gk['com'] = function (id, obj) {
    TagLibrary.eventStore['script'] = TagLibrary.eventStore['script'] || [];
    if(obj) {
        $('#' + id).data('obj', obj);
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
        return $('#' + id).data('obj');
    }
};
