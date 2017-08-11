(function( $, params, factory ){'use strict';
    $(function(){factory.call(this, $, params);}.bind(this));
}).call(this, this.jQuery, this.FUNGIFSPARAMS, function( $, params ){'use strict';

var _ = this;

var Fungif = (function(params){
	
	var fungif = {
		api_url_home: params.api_url_home,
		panel_url: params.panel_url,
		viewer_url: params.viewer_url,
		image_width: params.image_width,
		branding: params.branding,
		site_url: params.site_url,
		plugin_version: params.plugin_version,
		should_clean_cookie: true
	};
	
	fungif.commentform = $('#commentform.comment-form');
	fungif.form_submit = $('.form-submit', fungif.commentform);
	fungif.commentform_comment = $('.comment-form-comment', fungif.commentform);
	
	var self = bind(fungif);
	
	if (fungif.form_submit.length > 0){
		var url = fungif.panel_url + '?parent=' + encodeURIComponent(fungif.site_url) + '&site_type=wordpress&version=' + fungif.plugin_version;
		fungif.button = $('<a href="'+url+'" class="fungif-button"><div class="fungif_btn fungif_wysiwyg"></div></a>');
		fungif.form_submit.append(fungif.button);
	}
	
	fungif.remove_from_commentform = (function(){
	
		$('#temp-fungif-view').remove();
		$('#fungif-id-field').remove();
		$('#fungif-name-field').remove();
		$.removeCookie('fungifid');
		$.removeCookie('fungifsrc');
		$.removeCookie('fungifname');
		
	});
	
	fungif.attach_to_commentform = (function(data){
		
		$('#temp-fungif-view', fungif.commentform_comment).remove();
		$('#fungif-id-field', fungif.form_submit).remove();
		$('#fungif-name-field', fungif.form_submit).remove();

		var GIF = data.image;
        var template = $('#fungif-item-dispay-template');
        var imgWrapper = $('.fungif_image_view', template).clone();
        var img = $('.fungif-img', imgWrapper);  
        var href = $('.fungif-viewer-link', imgWrapper); 
        var close = $('.fungif-remove-button', imgWrapper);     
        imgWrapper.attr('id', 'temp-fungif-view');
        img.attr('src', GIF.src);
        img.width(fungif.image_width);        
        href.attr('href', fungif.viewer_url + '?picture=' + GIF.id);
        href.colorbox({iframe:true, width:"480", height:"560"});
        close.on('click', fungif.remove_from_commentform);
        fungif.commentform_comment.append(imgWrapper);

		var imageIdField = $('<input/>', {type: 'hidden', value: GIF.id, name: 'fungif_id',  id: 'fungif-id-field'});
		var imageSrcField = $('<input/>', {type: 'hidden', value: GIF.name, name: 'fungif_name', id: 'fungif-name-field'});
		
		fungif.form_submit.append(imageIdField);
		fungif.form_submit.append(imageSrcField);
	
		$.cookie('fungifid', GIF.id);
		$.cookie('fungifsrc', GIF.src);
		$.cookie('fungifname', GIF.name);
		
	});
	
	
	
	if ($.cookie().cleanfungifcookie && $.cookie().cleanfungifcookie === "1"){
		$.removeCookie('fungifid');
		$.removeCookie('fungifsrc');
		$.cookie('cleanfungifcookie', '0', { expires: 0, path: '/' });
	}

	if ($.cookie().fungifid && $.cookie().fungifsrc){
		var data = {image: {id: $.cookie().fungifid, src: $.cookie().fungifsrc, name: $.cookie().fungifname}};
		fungif.attach_to_commentform(data);
	}
	
	window.addEventListener("message", function(e){

    	if (e.origin + '/' !== this.FUNGIFSPARAMS.api_url_home)
    	{
        	return;
    	}
    	
    	if (e.data.mode && e.data.mode === 'on_panel_loaded')
    	{
    		return;
    	}
    	
    	fungif.attach_to_commentform(e.data);
    	$('.fungif-button').colorbox.close();
    
	}, false);
	
	$('form').on('submit', function() { 
		fungif.should_clean_cookie = false; 
	});
	
	$(window).on("beforeunload", function() { 
		
		if (fungif.should_clean_cookie === true){
			$.removeCookie('fungifid');
			$.removeCookie('fungifsrc');
			$.removeCookie('fungifname');
		}
		
		fungif.should_clean_cookie = true;
    	
	});
	
	$(".fungif-button").colorbox({iframe:true, width:"600", height:"640"});
    $(".fungif-viewer-link").colorbox({iframe:true, width:"480", height:"560"});
	
	return fungif;

})(_.FUNGIFSPARAMS);	
	



});





function fluent( f )
{
    return function()
    {
        f.apply(this, arguments);

        return this;
    };
}

function bind( context )
{
    return function( f )
    {
        return function()
        {
            return f.apply(this, arguments);
        }.bind(context);
    };
}