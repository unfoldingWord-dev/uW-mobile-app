var CONTENT = [];




CONTENT.stories = function(lang){
	
	$('#read').hide();
	$('#contents').show();
	$('#languages').hide();
	
	$('#loading').show();
	
	localStorage.lang = lang;
	
		// we are online
/*
		if(navigator.onLine){
			
			var api_url = isMobileDevice() ? 'http://api.unfoldingword.org/obs/txt/1/'+lang+'/obs-'+lang+'.json' : 'http://unfoldingword.jacobwiley.com/app/api.php?callback=?';
			
			var api_data = isMobileDevice() ? '' : 'path=http://api.unfoldingword.org/obs/txt/1/'+lang+'/obs-'+lang+'.json';
		
		    var jqxhr = $.getJSON(api_url, api_data, function(json){
		    	
		    	// Put the object into storage
				localStorage.setItem('json-obs-'+lang, JSON.stringify(json));
				
				// now that we have the data
				CONTENT.draw_dom(json);
			
			});
			
			
			jqxhr.error(function(){
				
				//console.log('jqxhr error');
				$('div.loader').remove();
				$('#header a#languages').trigger('click');
				
				init_dialog(
					'JSON ERROR', 
					"The file you requested cannot be found.", 
					'OK', 
					function(){
						//alert('OK');
					}, 
					false, 
					false
				);
				
			});
			
		} //if online
		
		
		else { // we are offline
*/
			
			// Retrieve the object from storage
			//alert();
			
			var json = localStorage.getItem('json-obs-'+lang);

			json = JSON.parse(json);
			
			CONTENT.draw_dom(json);
			
		// }
	    
	    

	
	
	
	
};










CONTENT.draw_dom = function(json){
	
	
    	$('div#contents ul').html('');
    	
    	
    	translateText( $('div#contents header h1'), json.app_words['chapters'], 'Stories' );
    	translateText( $('div#languages header h1'), json.app_words['languages'], 'Languages' );
    	
    	var lang = json.language;
    	
    	$('body').removeClass('ltr').removeClass('rtl');
    	$('body').addClass(json.direction);
    	
    	$.each(json.chapters, function(i){
	    	
	    	json.chapters[i].index = i;
	    	json.chapters[i].lang = lang;
	    	
    	});
    	
    	console.log(json);
    	
    	$.Mustache.addFromDom('stories-list');
			    
		$('div#contents ul').mustache('stories-list', json.chapters, { method: 'append' }); 
		
		$('#loading').hide();
		
		$('div#contents ul li [href="'+localStorage.remember+'"]').closest('li').addClass('active');

    	
	
};
