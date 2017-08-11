(function( $, params, factory ){'use strict';
    $(function(){factory.call(this, $, params);}.bind(this));
}).call(this, this.jQuery, this.FUNGIFSPARAMS, function( $, params ){'use strict';

	var _ = this;

    var FungifTinyMceExtension = {

        init : function(ed, url) {

            ed.addButton('fungif_tinymce_btn', {
                title: 'Insert Funny GIFs',
                onclick : function(ev) {
                  var modalw = 480;
                  var modalh = 560;

                  ed.windowManager.open({
                      title : "Funpica.com",
                      file: 'https://www.funpica.com/api/oxwall/expanded_panel.php?parent=' + _.FUNGIFSPARAMS.site_url + '&site_type=wordpress&version=' + _.FUNGIFSPARAMS.plugin_version,
                      width : modalw,
                      height : modalh,
                      inline : true,
                      resizable: true,
                      scrollbars: true
                  });
                }
            });

            ed.on('show init', function(event) {
            });
            ed.on('ExecCommand', function(event) {
            	if ( (event.command === "mceInsertRawHTML") && (event.value.indexOf('//giphy.com/embed') > -1)) {
                    FungifTinyMceExtension.revertIframes(content);
                }
            });

        },
		revertIframes : function() {
            // TINYMCE MEDIA PLUGIN REPLACES IFRAMES WTF
            // GOTTA BRING EM BACK
            var rawContent = tinymce.editors[0].getContent({format : 'raw'});
            var updatedContent = rawContent;
            $content = jQuery(rawContent);
            $content.find("img.mce-object-iframe").each(function(idx, element) {
                var img = jQuery(element);
                var iframe = jQuery("<iframe>", {
                    "src": img.attr('data-mce-p-src'),
                });

                iframe.attr('frameBorder','0');
                iframe.attr('webkitAllowFullScreen');
                iframe.attr('mozallowfullscreen');
                iframe.attr('allowFullScreen');
                updatedContent = updatedContent.replace(img.prop('outerHTML'), iframe.prop('outerHTML'));
            });
            // clear up any old iframes
            if (updatedContent.indexOf("[iframe") > -1) {
                console.log('got old iframes');
                var re = /\[iframe(.*?)\]/ig;
                var re2 = '[/iframe]';
                while(updatedContent.search(re) !== -1)  {
                    updatedContent = updatedContent.replace(re, '<iframe $1pt"></iframe>');
                }
                while (updatedContent.indexOf(re2) !== -1) {
                    updatedContent = updatedContent.replace(re2, '');
                }
            }
            
            tinymce.editors[0].setContent(updatedContent,{format : 'raw'});
            
        },
        getInfo : function() {

            return {
                longname : "Fungif GIF",
                author : 'funpica.com',
                authorurl : 'https://www.funpica.com',
                infourl : 'https://www.funpica.com',
                version : _.FUNGIFSPARAMS.plugin_version
            };
        },
        
        compileImage: function(image){
        	var width = (parseInt(image.width) > 390) ? 390 : parseInt(image.width);
        	if (width < 270){
        		width = 270;
        	}
        	var height = width / 13 * 10;

        	if (image.width){
        		height = image.height * (width / image.width); 
        	}
        	
        	var html = '<iframe frameborder="0" width="' + width + '" height="' + height + '" src = "https://www.funpica.com/api/oxwall/viewer.php?picture=' + image.id + '&view=plain&site_type=wordpress"></iframe>';

        	return html;
        }
    }

    tinymce.create('tinymce.plugins.fungif_tinymce_btn', FungifTinyMceExtension);
    tinymce.PluginManager.add('fungif_tinymce_btn', tinymce.plugins.fungif_tinymce_btn);
    
    window.addEventListener("message", function(e){

    	if (e.origin + '/' !== _.FUNGIFSPARAMS.api_url_home)
    	{
        	return;
    	}
    	
    	if (e.data.mode && e.data.mode === 'on_panel_loaded')
    	{
    		return;
    	}
    	
    	var html = FungifTinyMceExtension.compileImage(e.data.image);
    	parent.tinyMCE.activeEditor.execCommand("mceInsertRawHTML", false, html);
    	parent.tinyMCE.activeEditor.windowManager.close(window);
    	

    
	}, false);

});


