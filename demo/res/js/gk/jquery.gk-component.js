
/* -=-=-=-=-=-=-=-=-=-=-=-=-

        NavBtn

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var NavBtn = (function (_super) {__extends(NavBtn, _super);function NavBtn(id) {_super.call(this, id);}
NavBtn.prototype._init = function(){
  this.removeDefAttr('href');
  if('${theme}' === this.ele.attr('theme')){
	  this.ele.removeAttr('theme');
  }else{
	  this.ele.attr('data-theme',this.ele.attr('theme'));
	  this.ele.removeAttr('theme');
  }
  if('${icon}' === this.ele.attr('data-icon')){
	  this.ele.removeAttr('data-icon');
  }
  if('${state}' === this.ele.attr('class')){
	  this.ele.removeAttr('class');
  }else{
	  this.ele.attr('class','ui-btn-active ui-state-persist');
  }
};
return NavBtn;})(WebComponent);
TagLibrary.customTags['NAVBTN'] = $("  <gk:view use='NavBtn'><li>  <a id='${id}' theme='${theme}'  href='${href}' data-icon=\"${icon}\" data-transition='none' data-gk-click='${onclick}' class='${state}'>${label}</a></li>${content}  </gk:view>")[0];
TagUtils.createElement('NAVBTN');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        NavBar

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var NavBar = (function (_super) {__extends(NavBar, _super);function NavBar(id) {_super.call(this, id);}
NavBar.prototype._init = function(){
  if('${theme}' === this.ele.attr('theme')){
	  this.ele.removeAttr('theme');
  }else{
	  this.ele.attr('data-theme',this.ele.attr('theme'));
	  this.ele.removeAttr('theme');
  }
  this.removeDefAttr(['class','style']);
  if('${columns}' === this.ele.attr('data-grid')){
	this.ele.attr('data-grid','c');
	}else{
	var num = this.ele.attr('data-grid');
	this.ele.attr('data-grid',String.fromCharCode(95+parseInt(num)));
  }
};
return NavBar;})(WebComponent);
TagLibrary.customTags['NAVBAR'] = $("  <gk:view use='NavBar'><div id='${id}' theme='${theme}' data-grid='${columns}' data-role='navbar' data-iconpos='top' class='${class}' style='${style}'><ul>${content}</ul></div>  </gk:view>")[0];
TagUtils.createElement('NAVBAR');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        ListView

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var ListView = (function (_super) {__extends(ListView, _super);function ListView(id) {_super.call(this, id);}
ListView.prototype._init = function(){
  this.data = [];
  this.autodividers = this.ele.attr('autodividers');
  if('${autodividers}'!==this.ele.attr('autodividers')){
	  this.ele.attr('data-autodividers','true');
  }
  if('${inset}'===this.ele.attr('data-inset')){
	  this.ele.removeAttr('data-inset');
  }
  if(typeof this.ready !== 'undefined'){
	  this.ready();
  }
};
ListView.prototype.onclick = function(e){
  var src = $(e.srcElement);
  var li = (function(ele){return ele[0].tagName!=='LI' ? arguments.callee($(ele).parent()):ele;})(src);
  if(typeof this.onRow !=='undefined'){
	  this.onRow(li);	
  }
};
ListView.prototype.info = function (infoArray) {
  if(infoArray) {
	var self = this;
	this.data = infoArray;
	var listItem = _super.prototype.infoArray.call(this, infoArray);
	$('#' + this.id).html(listItem);
	try  {
	  this.ele.listview({
		autodividersSelector: function (li) {
		  return  self.autodividers==='${autodividers}' ?
			null:li.attr(self.autodividers);
		}});
	  this.ele.listview('refresh');
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
return ListView;})(WebComponent);
TagLibrary.customTags['LISTVIEW'] = $("  <gk:view use='ListView'><ul id='${id}' data-inset='${inset}' autodividers='${autodividers}' data-gk-click='${onclick}' data-role='listview' data-divider-theme='d' class='ui-listview' >${content}</ul>  </gk:view>")[0];
TagUtils.createElement('LISTVIEW');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Header

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Header = (function (_super) {__extends(Header, _super);function Header(id) {_super.call(this, id);}
Header.prototype._init = function(){
  if('${persist}' === this.ele.attr('persist')){
	  this.ele.attr('data-id','persist');
	}
	this.ele.removeAttr('persist');
};

Header.prototype.label = function(lab) {
  if(lab) {
	var ele = this.ele.find('h1')[0];
	ele.innerHTML = lab;
	return this.ele;
  } else {
	return this.ele.children(1).html();
  }
};
return Header;})(WebComponent);
TagLibrary.customTags['HEADER'] = $("  <gk:view use='Header'><div id='${id}' persist='${persist}' data-gk-click='${onclick}' data-position='fixed' data-role='header' >  <h1>${label}</h1>${content}</div>  </gk:view>")[0];
TagUtils.createElement('HEADER');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Footer

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Footer = (function (_super) {__extends(Footer, _super);function Footer(id) {_super.call(this, id);}
Footer.prototype._init = function(){
  if('${persist}' === this.ele.attr('persist')){
	  this.ele.attr('data-id','persist');
	}
	this.ele.removeAttr('persist');
};

return Footer;})(WebComponent);
TagLibrary.customTags['FOOTER'] = $("  <gk:view use='Footer'><div id='${id}' persist='${persist}' data-position='fixed' data-role='footer' ><h4>${content}</h4></div>  </gk:view>")[0];
TagUtils.createElement('FOOTER');




/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Field

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Field = (function (_super) {__extends(Field, _super);function Field(id) {_super.call(this, id);}
Field.prototype._init = function(){
  var width = this.ele.attr('width');
  if('${width}' === width){
	$(this.ele).children(":first").css({'width':'120px'});
  }else{
	$(this.ele).children(":first").css({'width':width+'px'});
  }
  this.ele.removeAttr('width');
};
return Field;})(WebComponent);
TagLibrary.customTags['FIELD'] = $("  <gk:view use='Field'><div id='${id}' width='${width}' style='${style};border-style:dotted;float:left'>  <label style='line-height:24px;float:left;font-weight: bold;' for='${id}_label'>${name}</label>  <input style='float:left;margin-bottom: 5px;' type='${type}' name='${id}_label' value='${value}' /></div>${content}  </gk:view>")[0];
TagUtils.createElement('FIELD');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Content

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Content = (function (_super) {__extends(Content, _super);function Content(id) {_super.call(this, id);}
Content.prototype._init = function(){
  this.removeDefAttr('class');
};
return Content;})(WebComponent);
TagLibrary.customTags['CONTENT'] = $("  <gk:view use='Content'><div id='${id}' class='${class}' data-role='content'>${content}</div>  </gk:view>")[0];
TagUtils.createElement('CONTENT');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        xDate

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var xDate = (function (_super) {__extends(xDate, _super);function xDate(id) {_super.call(this, id);}
xDate.prototype._init = function(){
};
return xDate;})(WebComponent);
TagLibrary.customTags['XDATE'] = $("  <gk:view use='xDate'><label for='${name}'>${label}</label><input id='${id}' name='${name}' type='date' data-role='datebox' data-options=\"{'mode': 'calbox'}\"value='${value}' data-gk-blur='${onblur}' />${content}  </gk:view>")[0];
TagUtils.createElement('XDATE');



/* -=-=-=-=-=-=-=-=-=-=-=-=-

        collapsibleset

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var collapsibleset = (function (_super) {__extends(collapsibleset, _super);function collapsibleset(id) {_super.call(this, id);}
collapsibleset.prototype._init = function(){
	
};
return collapsibleset;})(WebComponent);
TagLibrary.customTags['COLLAPSIBLESET'] = $("  <gk:view use='collapsibleset'><div data-role=\"collapsible-set\" data-content-theme=\"d\" id=\"${id}\">  ${content}</div>  </gk:view>")[0];
TagUtils.createElement('COLLAPSIBLESET');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        collapsible

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var collapsible = (function (_super) {__extends(collapsible, _super);function collapsible(id) {_super.call(this, id);}
collapsible.prototype.expand = function(){
	this.ele.trigger( "expand" );
};
collapsible.prototype.collapse = function(){
	this.ele.trigger( "collapse" );
};

return collapsible;})(WebComponent);
TagLibrary.customTags['COLLAPSIBLE'] = $("  <gk:view use='collapsible'><div data-role=\"collapsible\" id=\"${id}\" data-collapsed=\"true\">	${content}</div>  </gk:view>")[0];
TagUtils.createElement('COLLAPSIBLE');



/* -=-=-=-=-=-=-=-=-=-=-=-=-

        TextArea

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var TextArea = (function (_super) {__extends(TextArea, _super);function TextArea(id) {_super.call(this, id);}

return TextArea;})(WebComponent);
TagLibrary.customTags['TEXTAREA'] = $("  <gk:view use='TextArea'><div data-role='fieldcontain'><label for='textarea'>${label}</label><textarea cols='40' rows='8' name='${name}' id='${id}'></textarea></div> ${content}  </gk:view>")[0];
TagUtils.createElement('TEXTAREA');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Text

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Text = (function (_super) {__extends(Text, _super);function Text(id) {_super.call(this, id);}
Text.prototype._init = function(){
  if('${readonly}' !== this.ele.attr('_readonly')){
	  this.ele.attr('readonly','readonly');
  }
  this.removeDefAttr('value');
};
Text.prototype.value = function (v) {
	if(v) {
		return $(this.ele).val(v);
	} else {
		return $(this.ele).val();
	}
};

return Text;})(WebComponent);
TagLibrary.customTags['TEXT'] = $("  <gk:view use='Text'><label for='name'>${label}</label><input id='${id}' type='text' name='${name}' value='${value}' _readonly='${readonly}' />${content}  </gk:view>")[0];
TagUtils.createElement('TEXT');




/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Password

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Password = (function (_super) {__extends(Password, _super);function Password(id) {_super.call(this, id);}
Password.prototype._init = function(){
  this.removeDefAttr('value');
};
return Password;})(WebComponent);
TagLibrary.customTags['PASSWORD'] = $("  <gk:view use='Password'><label for='password'>${label}</label><input id='${id}' type='password' name='${name}' value='${value}' />${content}  </gk:view>")[0];
TagUtils.createElement('PASSWORD');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Page

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Page = (function (_super) {__extends(Page, _super);function Page(id) {_super.call(this, id);}
Page.prototype._init = function(){
  this.removeDefAttr('class');
  if(typeof this.ready !== 'undefined'){
	  this.ready();
  }
};
return Page;})(WebComponent);
TagLibrary.customTags['PAGE'] = $("  <gk:view use='Page'><div id='${id}' data-gk-click='${onclick}' data-role='page' class='${class}'>${content}</div>  </gk:view>")[0];
TagUtils.createElement('PAGE');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        ListForm

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var ListForm = (function (_super) {__extends(ListForm, _super);function ListForm(id) {_super.call(this, id);}
ListForm.prototype.info = function (infoForm) {
  if(infoForm) {
	var listItem = _super.prototype.infoObject.call(this, infoForm);
	this.ele.html($.gk.toHTML(listItem));
	this.ele.trigger( "create" );
	return this.data;
  }
};

return ListForm;})(WebComponent);
TagLibrary.customTags['LISTFORM'] = $("  <gk:view use='ListForm'><div id='${id}' href='${href}' class='ui-link-inherit'><h3 class='ui-li-heading'>${heading}</h3>${content}</div>  </gk:view>")[0];
TagUtils.createElement('LISTFORM');



/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Icon

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Icon = (function (_super) {__extends(Icon, _super);function Icon(id) {_super.call(this, id);}
Icon.prototype._count = 0;
Icon.prototype._init = function(){
if('${href}' !== this.ele.attr('_href')){
	this.ele.attr('href',this.ele.attr('_href'));
	this.ele.removeAttr('_href');
}
if('${style}' === this.ele.parent().attr('style')){
	this.ele.parent().removeAttr('style');
}
if('${height}' === this.ele.parent().attr('height')){
	this.ele.removeAttr('height');
}else{
	$($(this.ele).children()[0]).css('height',this.ele.attr('height'));
}
if('${width}' === this.ele.parent().attr('width')){
	this.ele.removeAttr('width');
}else{
	$($(this.ele).children()[0]).css('width',this.ele.attr('width'));
}
	var file = this.ele.attr('file');
	$($(this.ele).children()[0]).attr('src', file);
};
Icon.prototype.count = function(i){
if(i){
  this.ele.prev().css('display',i==0? 'none':'');
  this._count = i;
  this.ele.prev().html(i<10 ? '&nbsp;'+i+'&nbsp;':i);
}else { return this._count;};
};
Icon.prototype.text = function(txt){
  if(txt){
	var text = this.ele[0].nextSibling;
	text.innerHTML = txt;
  }else{
	return text.innerHTML;
  }
};
return Icon;})(WebComponent);
TagLibrary.customTags['ICON'] = $("  <gk:view use='Icon'><div style='${style}'><span class=\"ui-li-count ui-btn-corner-all\" style=\"display:none;z-index:1;position:relative;float:right;background:#ed1d24;color:#fff;padding:2px;\"></span><a id='${id}' file='${src}' data-gk-click='${onclick}'   height='${height}' width='${width}' _href='${href}'  data-role='button' data-mini=\"true\" style='margin:5px;'>  <img style='width:48px;height:48px;position:relative;left:5px'></a><div style='text-align:center'>${content}</div></div>  </gk:view>")[0];
TagUtils.createElement('ICON');

/* -=-=-=-=-=-=-=-=-=-=-=-=-

		Row

-=-=-=-=-=-=-=-=-=-=-=-=-*/
var Row = (function (_super) {__extends(Row, _super);function Row(id) {_super.call(this, id);}
Row.prototype._init = function (v) {
this.colNum = ['ui-grid-a', 'ui-grid-b', 'ui-grid-c', 'ui-grid-d'];
var n = parseInt(this.ele.attr('columns')) - 2;
$(this.ele).attr('class', this.colNum[n]);
};
return Row;})(WebComponent);
TagLibrary.customTags['ROW'] = $("  <gk:view use='Row'><div id='${id}' class='ui-grid-a' columns='${columns}'>${content}</div>  </gk:view>")[0];
TagUtils.createElement('ROW');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Column

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Column = (function (_super) {__extends(Column, _super);function Column(id) {_super.call(this, id);}
Column.prototype._init = function(){
  this.removeDefAttr('style');
	this.colNum = [
		'ui-block-a', 
		'ui-block-b', 
		'ui-block-c', 
		'ui-block-d', 
		'ui-block-e'
	];
	var n = parseInt(this.ele.attr('idx')) - 1;
	$(this.ele).attr('class', this.colNum[n]);
};
return Column;})(WebComponent);
TagLibrary.customTags['COLUMN'] = $("  <gk:view use='Column'><div id='${id}' idx='${idx}' style='${style}'>  ${content}</div>  </gk:view>")[0];
TagUtils.createElement('COLUMN');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        Btn

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var Btn = (function (_super) {__extends(Btn, _super);function Btn(id) {_super.call(this, id);}
Btn.prototype._init = function(){
	var pos = this.ele.attr('_iconpos');
	this.ele.attr('data-iconpos', pos);
	if(this.ele.attr('data-icon')==='${icon}'){
		this.ele.removeAttr('data-icon');
	}
  this.removeDefAttr('style');
  if(typeof this.ready !== 'undefined'){
	  this.ready();
  }
};
Btn.prototype.enable = function (b) {
	this.ele.button(b ? 'enable' : 'disable');
};
Btn.prototype.refresh = function () {
	this.ele.button('refresh');
};
Btn.prototype.label = function (val) {
	if(val) {
		$($('#' + this.id + '    span span')[0]).html(val);
	} else {
		return $($('#' + this.id + ' span span')[0]).html();
	}
};
Btn.prototype.visible = function (b) {
	if(arguments.length == 0) {
		return this.ele.parent().is(':visible');
	} else {
		b ? this.ele.parent().show() : this.ele.parent().hide();
	}
};
return Btn;})(WebComponent);
TagLibrary.customTags['BTN'] = $("  <gk:view use='Btn'><a id='${id}' href='#' style='${style}' type='button' value='${value}' data-inline='${inline}' data-gk-click='${onclick}' data-icon='${icon}'>${label}</a>${content}  </gk:view>")[0];
TagUtils.createElement('BTN');


/* -=-=-=-=-=-=-=-=-=-=-=-=-

        BackBtn

 -=-=-=-=-=-=-=-=-=-=-=-=-*/
var BackBtn = (function (_super) {__extends(BackBtn, _super);function BackBtn(id) {_super.call(this, id);}
BackBtn.prototype._init=function(){
  this.removeDefAttr('href');
  if('${label}' === this.ele.html()){
	this.ele.html('Back');
  }
};
return BackBtn;})(WebComponent);
TagLibrary.customTags['BACKBTN'] = $("  <gk:view use='BackBtn'><a id='${id}' href='${href}' data-icon='back' data-rel='back' class='ui-btn-${pos}'>${label}</a>${content}  </gk:view>")[0];
TagUtils.createElement('BACKBTN');


