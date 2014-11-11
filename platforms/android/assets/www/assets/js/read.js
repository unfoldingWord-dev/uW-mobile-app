var READ = [];

READ.lang = 'en';


READ.it = function(lang, i){ // add a third param for frame

	$('#loading').show();

	if(i == localStorage.last_chapter ){
		
	}
	
	else {
		localStorage.setItem('last_page','0');
	}

	localStorage.setItem('last_chapter',i);
	localStorage.setItem('remember','#read/it/'+lang+'/'+i);
	
	$('#read').show();
	$('#contents').hide();
	$('#languages').hide();
	
	READ.lang = lang;
	
	console.log(HASH.array[2]);
	
	$('a#contents_button').attr('href','#content/stories/'+lang)
	
	$('a.true_back').attr('href','#read/it/'+lang+'/'+i);
	
	// see if the needed json is already in local storage
	
	if(localStorage.getItem('json-obs-'+lang)) {
		
		//alert('in local storage!')
		
		var json = localStorage.getItem('json-obs-'+lang);
		
		json = JSON.parse(json);
		
		READ.draw_dom(json, i);
	}
	
	
	// else try to get it form the server
	
	else {
		
/*
			var api_url = isMobileDevice() ? 'http://api.unfoldingword.org/obs/txt/1/'+lang+'/obs-'+lang+'.json' : 'http://unfoldingword.jacobwiley.com/app/api.php?callback=?';
			
			var api_data = isMobileDevice() ? '' : 'path=http://api.unfoldingword.org/obs/txt/1/'+lang+'/obs-'+lang+'.json';
		
		    var jqxhr = $.getJSON(api_url, api_data, function(json){
		    	
		    	// Put the object into storage
				localStorage.setItem('json-obs-'+lang, JSON.stringify(json));
				
				// now that we have the data
				READ.draw_dom(json,i);
			
			});
*/
	
	} // else

	
	resetMyScroll();
	
};



READ.draw_dom = function(json, i){
	
	
    	$('div#read ul').html('');
    	
    	$('body').removeClass('ltr').removeClass('rtl');
    	$('body').addClass(json.direction);
    	
    	translateText( $('div#contents header h1'), json.app_words['chapters'], 'Stories' );
    	translateText( $('div#languages header h1'), json.app_words['languages'], 'Languages' );
    	
    	console.log(json);
    	
    	var title = json.chapters[i].title;
    	
    	$('#read header h1').html(title);
    	
    	$.Mustache.addFromDom('frames-list');
			    
		$('div#read ul').mustache('frames-list', json.chapters[i].frames, { method: 'append' }); 
		
		$('div#read ul').append('<li class="last_frame"><a href="#read/it/'+READ.lang+'/'+((i*1)+1)+'">Next Story</li>');
		$('div#read div#wrapper a#next_story').attr("href", '#read/it/'+READ.lang+'/'+((i*1)+1) );
 
 		setTimeout(	function(){
		
			
			// loadThisImage( $('div#scroller ul li:nth-child('+1+') img') );				
    
			// loadThisImage( $('div#scroller ul li:nth-child('+2+') img') );	// pre-load the next image		
			
			setTimeout(function(){

				resetMyScroll();
			
				var lp = (localStorage.getItem('last_page'))*1;
			//var lc = (localStorage.getItem('last_chapter'))*1;

				myScroll.currentPage.pageX = lp;
				
				console.log(lp);
								
				if(!$('body').hasClass('rtl')){

					myScroll.scrollToElement('div#scroller ul li:nth-child('+(lp+1)+')',100);
				
				}
				
				$('#loading').hide();
				
			}, 1000);
			
			checkScroll(localStorage.getItem('last_page'));
			
		}, 500);
	
};


$(document).ready(function(){

	if ( isMobileDevice() ) {
        document.addEventListener("deviceready", READ.onDeviceReady, false);
    } else {
        READ.onDeviceReady();
    }	
    
});

READ.onDeviceReady = function(){
	
	resetMyScroll();
	
};


