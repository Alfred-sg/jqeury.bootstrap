(function(window,$){

if (!String.prototype.format) {
  	String.prototype.format = function(args) {
	    var str=this,
	        argus=[];
	    if ( $.isPlainObject(args) ){
	        $.each(args,function(key,val){
	            var reg=new RegExp("({"+key+"})", "g");
	            str=str.replace(reg,args[key]);
	        });
	        return str;
	    };
	    if ( !$.isArray(args) ){
	        argus=arguments;
	    };
	    if ( $.isArray(args) ){
	        argus=args;
	    };
	    str=str.replace(/{(\d+)}/g, function(match, number){
	        return typeof argus[number]!='undefined'?argus[number]:match;
	    });
	    return str;
  	};
  	/*var strTestObject="<input value='{paramName}'>";
  	console.log(strTestObject.format({paramName:"hello world"}));
  	var strTestArray="<input value='{0}'>";
  	console.log(strTestArray.format(["hello world"]));
  	var strTestString="<input value='{0}'>";
  	console.log(strTestString.format("hello world","hey"));*/
};

});


(function(window,$){

function DialogRender(trigger,options){
	this.$trigger=trigger;
	this.options=options;

    this.init();
};

DialogRender.prototype.init=function(){
	this.initDialog();
	this.initButtons();
	this.place();
};

DialogRender.DEFAULTS={
	show:false,
	keyboard:false,
	backdrop:true,
	unshown:[],
	buttons:[],
	class:{
		background:"",
		dialog:"",
		content:"",
		header:"",
		close:"",
		title:"",
		body:"",
		footer:""
	},
	style:{
		background:{},
		dialog:{},
		content:{},
		header:{},
		close:{},
		title:{},
		body:{},
		footer:{}
	}
};

DialogRender.prototype.initDialog=function(){
	var that=this;

	this.$parentNode=that.$trigger.parent();

	that.$dialog=$('<div class="dialog modal fade">'+'<div class="modal-dialog">'+
		'<div class="modal-content">'+'</div></div></div>').appendTo(document.body);

	that.$modal=that.$dialog.find(".modal-content");

	if ( that.options.unshown.indexOf("header")==-1 ){
		that.$modalHeader=$('<div class="modal-header"></div>').appendTo(that.$modal);
		that.$modalHeader.append('<span class="close">&times;</span>');
		that.$modalHeader.append('<h4 class="modal-title">'+that.options.title+'</h4>');

		that.$dialog.find(".modal-header").addClass(that.options.class.header);
		that.$dialog.find(".close").addClass(that.options.class.close);
		that.$dialog.find(".modal-title").addClass(that.options.class.title);

		that.$dialog.find(".modal-header").css(that.options.style.header);
		that.$dialog.find(".close").css(that.options.style.close);
		that.$dialog.find(".modal-title").css(that.options.style.title);

		that.$modalHeader.find(".close").off("click").on("click",function(){
			that.close();
		});
	};
	

	that.$modalBody=$('<div class="modal-body"></div>').appendTo(that.$modal);
	that.$modalBody.append(that.$trigger);

	if ( that.options.unshown.indexOf("footer")==-1 ){
		that.$modalFoot=$('<div class="modal-footer"></div>').appendTo(that.$modal);
		that.$dialog.find(".modal-footer").addClass(that.options.class.footer);
	};

	that.$dialog.addClass(that.options.class.background);
	that.$dialog.find(".modal-dialog").addClass(that.options.class.dialog);
	that.$dialog.find(".modal-content").addClass(that.options.class.content);
	that.$dialog.find(".modal-body").addClass(that.options.class.body);

	that.$dialog.css(that.options.style.background);
	that.$dialog.find(".modal-dialog").css(that.options.style.dialog);
	that.$dialog.find(".modal-content").css(that.options.style.content);
	that.$dialog.find(".modal-body").css(that.options.style.body);

	(function initModal(){
		var modalOptions={
			show:that.options.show,
			keyboard:that.options.keyboard,
			backdrop:that.options.backdrop
		};
		that.$dialog.modal(modalOptions);
	})();
};

DialogRender.prototype.initButtons=function(){
	var that=this;

	if ( that.options.unshown.indexOf("footer")==-1 ){
		that.$modalFoot.append("<div class='btn-wrapper' type='button'></div>")
		$.each(that.options.buttons,function(index,btn){
			var html=[
				'<button class="btn ',
				btn.class?btn.class:'btn-default',
				'"',
				btn.id?'id="'+btn.id+'"':'',
				'>'+btn.text+'</button>'
			];
			$(html.join("")).appendTo(that.$modalFoot.find(".btn-wrapper"))
				.on("click",btn.data?btn.data:undefined,function(event){
					btn.fn && btn.fn.call(that.$trigger,event);
				});
		});
	}else{
		that.$modalBody.append("<div class='btn-wrapper'></div>")
		$.each(that.options.buttons,function(index,btn){
			var html=[
				'<button class="btn ',
				btn.class?btn.class:'btn-default',
				'"',
				btn.id?'id="'+btn.id+'"':'',
				'>'+btn.text+'</button>'
			];
			$(html.join("")).appendTo(that.$modalBody.find(".btn-wrapper"))
				.on("click",btn.data?btn.data:undefined,function(event){
					btn.fn.call(that.$trigger,event);
				});
		});
	}
};

DialogRender.prototype.place=function(){
	var that=this;

	that.options.width && that.$dialog.find(".modal-content").width(that.options.width);
	that.options.height && that.$dialog.find(".modal-content").height(that.options.height);

	that.$dialog.find(".modal-dialog").css({
		"position":"absolute",
		"marginBottom":0,
		"marginTop":0,
		"width":"100%"
	});

	that.$dialog.find(".modal-content").css({
		"margin":"0 auto"
	});

	that.$dialog.off("shown.bs.modal").on("shown.bs.modal",function(){
		var self=this;

		$(self).find(".modal-dialog").css({
			"top":"50%",
			"marginTop":-that.$dialog.find(".modal-dialog").height()/2
		});
	});
};

DialogRender.prototype.open=function(){
	var that=this;

	that.$trigger.trigger("show.dialog");
	that.$dialog.modal("show");
	that.$trigger.trigger("shown.dialog");
};

DialogRender.prototype.close=function(){
	var that=this;

	that.$trigger.trigger("hide.dialog");
	that.$dialog.modal("hide");
	that.$trigger.trigger("hidden.dialog");
};

DialogRender.prototype.toggle=function(){
	var that=this;

	if ( that.$dialog.is(":visible") ){
		that.close();
	}else{
		that.open();
	};
};

DialogRender.prototype.destroy=function(){
	var that=this;

	that.$dialog.modal("hide");
	that.$parentNode.append(that.$trigger);
	that.$dialog.modal("removeBackdrop");
	that.$dialog.remove();
};

DialogRender.allowedMethods=["open","close","toggle","destroy"];

$.fn.dialog=function(option){

	var that=this,
		args=Array.prototype.slice.call(arguments,1),
		data=$(this).data("dialog"),
		value,
		htmlOptions;

	// Get Html options.
	$.each(DialogRender.DEFAULTS,function(key){
		if ( $(that).data()[key] ) htmlOptions[key]=$(that).data()[key];
	});

	options=$.extend(true,{},DialogRender.DEFAULTS,htmlOptions,typeof option==='object' && option);

	if ( typeof option=="string" ){
			if ( $.inArray(option,DialogRender.allowedMethods)<0 ) {
      		throw new Error("Unknown method: "+option);
    	};

	    if ( !data ){
	      	return;
	    };

    	value=data[option].apply(data, args);

	    if (option==='destroy') {
	      	$(this).removeData('dialog');
	    };
	};

	if ( $.type(option)=="object" ){
		$(this).data("dialog",new DialogRender(this,options));
	};

	return value==undefined ? $(this) : value;
};

})(window,jQuery);


(function(window,$){

function ConfirmRender(options){
	this.options=options;

	this.init();
	this.bindEvent();
};

ConfirmRender.prototype.init=function(){
	var that=this;

	this.$dialog=$("<div>"+that.options.message+"</div>").dialog({
		title:that.options.title,
		width:that.options.width,
		buttons:[{
			text:that.options.ok,
			class:that.options.class.ok,
			data:that.options.data,
			fn:function(event){
				that.options.callback && that.options.callback.call(that.$dialog,event);
				that.$dialog.dialog("close");
			}
		},{
			text:that.options.cancel,
			class:that.options.class.cancel,
			fn:function(){
				that.$dialog.dialog("close");
			}
		}]
	}).dialog("open");
};

ConfirmRender.DEFAULTS={
	width:600,
	ok:"确认",
	cancel:"取消",
	class:{
		ok:"",
		cancel:""
	},
	data:{},
	callback:function(e){
	}
};

ConfirmRender.prototype.bindEvent=function(){
	var that=this;

	this.$dialog.off("hidden.dialog").on("hidden.dialog",function(){
		delete that;
	});
};

$.confirm=function(option){
	if ( $.type(option)!="object" ) return;

	var that=this,
		args=Array.prototype.slice.call(arguments,1),
		instance;

	options=$.extend(true,{},ConfirmRender.DEFAULTS,option);
	instance=new ConfirmRender(options);

	return instance;
};

})(window,jQuery);


(function(window,$){

function AlertRender(trigger,options){
	this.options=options;

	this.init();
	this.bindEvent();
};

AlertRender.prototype.init=function(){
	var that=this;

	this.$dialog=$("<div>"+that.options.message+"</div>").dialog({
		unshown:["header"],
		buttons:[{
			text:that.options.ok,
			class:that.options.class,
			data:that.options.data,
			fn:function(event){
				that.options.callback && that.options.callback.call(that.$dialog,event);
				that.$dialog.dialog("close");
			}
		}]
	}).dialog("show");
};

AlertRender.DEFAULTS={
	ok:"确认",
	class:""
};

AlertRender.prototype.bindEvent=function(){
	var that=this;

	this.$dialog.off("hidden.dialog").on("hidden.dialog",function(){
		delete that;
	});
};

$.fn.alert=function(option){
	if ( $.type(option)!="object" ) return;

	var that=this,
		args=Array.prototype.slice.call(arguments,1),
		instance;

	options=$.extend(true,{},AlertRender.DEFAULTS,option);
	instance=new AlertRender(this,options);

	return value==undefined ? $(this) : value;
};

})(window,jQuery);



(function(window,$){

function NotifyRender(options){
	this.options=options;

	this.init();
	this.bindEvent();
};

NotifyRender.DEFAULTS={
	unshown:["title","close"],
	type:"info",
	success:"成功",
	danger:"失败",
	info:"注意",
	delay:2000,
	width:600,
	theme:"default"
};

NotifyRender.prototype.init=function(){
	var that=this,
		html;

	switch(that.options.theme){
		case "default":
			html=[
				"<div class='alert alert-"+that.options.type+"' style='margin-bottom:0'>",
				that.options.unshown.indexOf("close")!=-1?"":"<span class='close'>&times;</span>",
				that.options.unshown.indexOf("title")!=-1?"":"<h4>"+(that.options.title?that.options.title:that.options[that.options.type])+"</h4>",
				"<p>"+that.options.message+"</p>"
			];
			break;
		case "sweet.alert":
			var subhtml=[];
			switch(that.options.type){
				case "info":
					subhtml=[
						'<div class="icon warning pulseWarning" style="display: block;">',
						'<span class="body pulseWarningIns"></span>',
						'<span class="dot pulseWarningIns"></span>',
    					'</div>'
					];
					break;
				case "success":
					subhtml=[
						'<div class="icon success animate" style="display: block;">',
						'<span class="line tip animateSuccessTip"></span>',
						'<span class="line long animateSuccessLong"></span>',
						'<div class="placeholder"></div>',
						'<div class="fix"></div>',
						'</div>'
					];
					break;
				case "danger":
					subhtml=[
						'<div class="icon error animateErrorIcon" style="display: block;">',
						'<span class="x-mark animateXMark">',
						'<span class="line left"></span>',
						'<span class="line right"></span>',
						'</span>',
						'</div>'
					];
					break;

			}
			html=[
				'<div class="sweet-alert" style="margin-bottom:20px">',
				subhtml.join(""),
    			that.options.unshown.indexOf("title")!=-1?"":"<h2>"+(that.options.title?that.options.title:that.options[that.options.type])+"</h2>",
    			'<p style="display: block;">'+that.options.message+'</p>',
    			'</div>'
    		];
    		break;
	};

	this.$dialog=$(html.join("")).dialog({
		unshown:["header","footer"],
		width:that.options.width,
		style:{
			body:{"padding":0}
		}
	});

	this.$dialog.dialog("open");

	/*setTimeout(function(){
		that.$dialog.dialog("close");
		that.options.callback && that.options.callback();
	},that.options.delay);*/
};

NotifyRender.prototype.bindEvent=function(){
	var that=this;

	this.$dialog.find("span.close").off("click").on("click",function(){
		that.$dialog.dialog("close");
	});

	this.$dialog.off("hidden.dialog").on("hidden.dialog",function(){
		delete that;
	});
};

$.notify=function(option){
	if ( $.type(option)!="object" ) return;

	var that=this,
		args=Array.prototype.slice.call(arguments,1);

	options=$.extend(true,{},NotifyRender.DEFAULTS,option);

	return new NotifyRender(options);
};

})(window,jQuery);