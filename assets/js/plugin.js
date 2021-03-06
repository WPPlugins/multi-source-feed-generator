(function(){
	tinymce.PluginManager.add( 'cronycle_collection_plugin', function( editor, url ){

        editor.addButton( 'cronycle_collection', {
        	tooltip: 'Cronycle Collections',
            icon: 'cronycle',
            onclick: function(){
            	
            	var style = "inline-slideshow";
            	jQuery(function(){
            		jQuery(document).on("click",".cronycle-checkbox",function(){
            			style = jQuery(this).data("id");
                		jQuery(this).addClass("active").siblings().removeClass("active");
                	});
            	});
            	
            	var width = "100%";
            	jQuery(document).on("change","#cronycle-collection-width",function(){
            		width = jQuery(this).val();
            	});

            	var height = "550px";
            	jQuery(document).on("change","#cronycle-collection-height",function(){
            		height = jQuery(this).val();
            	});
            	
            	var options;
        		jQuery.ajax({
			        url: ajaxurl,
			        data: {action:'getCollections'},
			        dataType: "json",
			        async: false,
			        cache: false,
			        timeout: 10000,
			        success: function(data){ 
			            for ( var i = 0; i < data.length; i++ )
			            	options += "<option value='"+data[i].value+"'>"+data[i].text+"</option>";
			        }
			    });
			    
                editor.windowManager.open( {
                    title: 'Add a Cronycle Collection',
                    buttons: [{
                    	text: 'Insert',
                    	onclick: 'submit',
                    	classes: 'widget btn primary first abs-layout-item'
                    },
                    {  
                    	text: 'Close',
                        onclick: 'close'
                    }],
                    body: [
                       {
                    	   type: 'container',
                    	   html: '<section class="cronycle-collection-options">\
                    		   <p>Choose which collection to embed from your Cronycle<br>\
                    		   to engage your readers with real-time content from your feeds:</p>\
                    		   <p class="smaller">Can’t see any collections? Go to settings in the Wordpress menu<br>\
                    		   and link this plugin to your Cronycle account. You’ll find the token in your<br>\
                    		   profile page. Sign up for Cronycle at <a href="https://cronycle.com/signup" target="_blank">cronycle.com/signup</a>.</p>\
                    		   <select name="cronycle-collection" id="cronycle-collection">'+options+'</select>\
                    		   	<div class="cronycle-style-section">\
                        		   	<b>Choose your style:</b>\
	                       		    <span class="cronycle-checkbox inline-slideshow active" data-id="inline-slideshow">Inline<br />Slideshow</span>\
	                       		    <span class="cronycle-checkbox sidebar-portrait" data-id="sidebar-portrait">Sidebar<br />Portrait</span>\
	                       		    <span class="cronycle-checkbox inline-portrait" data-id="inline-portrait">Inline<br />Portrait</span><br />\
                       		    </div>\
			            		<b>Size:</b> <span class="smaller lighter">(leave blank for default width and height)</span><br />\
			            		<p class="smaller">Specify unit (px or %)</p>\
			            		<div class="cronycle-size-section">\
			            			<label for="cronycle-collection-height">Width:</label>\
                    		   		<input type="text" name="cronycle-collection-width" id="cronycle-collection-width" placeholder="100%" />\
			            			<label for="cronycle-collection-height">Height:</label>\
			            			<input type="text" name="cronycle-collection-height" id="cronycle-collection-height" placeholder="550px" />\
			            		</div>\
                    		   </section>'
	                    }
                    ],
                    onsubmit: function( e ){
                        editor.insertContent( '[cronycle collection="'+jQuery("#cronycle-collection").val()+'" name="'+jQuery("#cronycle-collection option:selected").text()+'" style="'+style+'" width="'+width+'" height="'+height+'" instance="'+( new Date().getTime() )+'"]' );
                    }
                
                } );
                
            }
        
        } );
        
    } );
	
} )();