var LANGUAGES = [];




LANGUAGES.index = function(){
	
	$('#loading').show();
	
	$('#read').hide();
	$('#contents').hide();
	$('#languages').show();
	
/*
	var api_url = isMobileDevice() ? 'http://api.unfoldingword.org/obs/txt/1/obs-catalog.json' : 'http://unfoldingword.jacobwiley.com/app/api.php?callback=?';
	var api_data = isMobileDevice() ? '' : 'path=http://api.unfoldingword.org/obs/txt/1/obs-catalog.json';


	// we are online
	if(navigator.onLine){
		
	    $.getJSON(api_url, api_data, function(json){
	    			    
	    	// Put the object into storage
			localStorage.setItem('json-obs-catalog', JSON.stringify(json));
			
	    	LANGUAGES.draw_dom(json);
		
		});
	
	} // if online
	
	else { // we are offline
*/
						
			// Retrieve the object from storage
			var json = localStorage.getItem('json-obs-catalog');
			
			json = JSON.parse(json);
							
	    	LANGUAGES.draw_dom(json);
	
	// } //	
	
	
};






LANGUAGES.draw_dom = function(json){
	
	
    	$('div#languages ul').html('');
    	
    	
    	console.log(json);
    	
    	// sort languages by language code
		json.sort(function(a, b){
			var langA = a.language.toLowerCase(), langB = b.language.toLowerCase();
			if (langA < langB){ //sort string ascending
				return -1; 
			} 
			if (langA > langB){
				return 1;
			}
			return 0; //default return value (no sorting)
		}); 
			
    	$.Mustache.addFromDom('language-list');
			    
		$('div#languages ul').mustache('language-list', json, { method: 'append' }); 
				
		$('#loading').hide();

		$('div#languages ul li [data-lang="'+localStorage.lang+'"]').closest('li').addClass('active');
	
};




$(document).on('click', 'a.info', function(e){
	
	e.preventDefault();
	
	$(this).closest('li').find('dl').slideToggle();
	
	
});


$(document).on('click', 'a#check_for_updates', function(e){
	
	e.preventDefault();
	
	$('#loading').show();

	var randomNum = Math.round((Math.random() * 10000)+1); // prevent a cached result from being returned
	var api_url = isMobileDevice() ? 'https://api.unfoldingword.org/obs/txt/1/obs-catalog.json?rand=' + randomNum : 'http://unfoldingword.jacobwiley.com/app/api.php?callback=?';
	var api_data = isMobileDevice() ? '' : 'path=https://api.unfoldingword.org/obs/txt/1/obs-catalog.json';
	var downloadFails = [];
	
	console.log("api_url: "+api_url);

	// we are online
	if(doesConnectionExist(api_url)){
		console.log('doesConnectionExist? '+doesConnectionExist(api_url));
		// download catalog
	    $.getJSON(api_url, api_data, function(json){
	    	// Put the new catalog into localStorage
			localStorage.setItem('json-obs-catalog', JSON.stringify(json));
			console.log('Catalog successfully updated.');
			// loop through each entry in catalog object
	    	for(var i = 0; i < json.length; i++){
	    		var catalog = json[i];
	    		var lang = catalog.language;
	    		var update_language = false;
	    		var content;
	    		
	    		// check if this language is in localStorage
	    		if(localStorage.getItem('json-obs-'+lang) === null){
	    			update_language = true;
	    			console.log('language not in localStorage: '+lang);
	    		}
	    		// check if language is outdated
	    		else{
	    			content = JSON.parse(localStorage.getItem('json-obs-'+lang));
	    			if(parseInt(catalog.date_modified) > parseInt(content.date_modified)){
	    				console.log('language: '+catalog.language+' -- catalog date_modified: '+catalog.date_modified +' > localStorage date_modified: '+content.date_modified);
	    				update_language = true;
	    			};
	    		}
	    		// if language is not in localStorage or is outdated 
	    		if(update_language){
	    			// download language
	    			console.log("downloading: "+lang);
	    			
					var api_url = isMobileDevice() ? 'https://api.unfoldingword.org/obs/txt/1/'+lang+'/obs-'+lang+'.json?rand=' + randomNum : 'http://unfoldingword.jacobwiley.com/app/api.php?callback=?';
					var api_data = isMobileDevice() ? '' : 'path=https://api.unfoldingword.org/obs/txt/1/'+lang+'/obs-'+lang+'.json';

					$.ajax({
						dataType: "json",
						url: api_url,
						data: api_data,
						async: false,
						success: function(msg){
							// add to localStorage
							localStorage.setItem("json-obs-"+lang, JSON.stringify(msg));
						} // success
					}).error(function(){
						console.log('Failed to update language: '+lang);
						downloadFails.push(lang);
					}); //ajax

	    		} // if(update_language)

	    	} // for
			
			// turn off loader and refresh languages page
			$('#loading').hide();
			if(downloadFails.length){ // if any of the downloads failed, alert them
				alert('Failed to update language(s): '+downloadFails.join(', '));
			}
			$(window).trigger("hashchange");
			
		}) // getJSON callback
		.error(function(){
			alert('Failed to update the catalog.');
			// turn off loader and refresh languages page
			$('#loading').hide();
			$(window).trigger("hashchange");
		}); 
	
	} // if online
	
	else { // we are offline
		$('#loading').hide();
		alert('Unable to perform update at this time.');
	}

});