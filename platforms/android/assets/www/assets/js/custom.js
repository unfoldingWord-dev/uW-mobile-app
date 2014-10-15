var myScroll;

function isMobileDevice() {
	//return (document.location.protocol == "file:");
	return (window.cordova);
	// return (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1);
};





function translateText($selector, $lookup, $fallback){
	
	//alert(')))))');
	
	////console.log('BIBLE.active_language_json.app_words["' + $lookup + '"]');
	////console.log(BIBLE.active_language_json.app_words[$lookup]);
	
	if( $lookup ){
	
		$selector.html( $lookup );
	
	}
	
	else {
		
		$selector.html('( '+$fallback+ ' )');
		
	}
	
}






function doesConnectionExist(file) {

    var xhr = new XMLHttpRequest();
    // var file = "http://www.yoursite.com/somefile.png";
    var randomNum = Math.round(Math.random() * 10000); // prevent a cached result from being returned
     
    // params: The type of HTTP method to use, The URL to send the request to, Whether the request will be made asynchronously 
    xhr.open('HEAD', file + "?rand=" + randomNum, false);
     
    try {
        xhr.send();
         
        if (xhr.status >= 200 && xhr.status < 304) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}




function loadThisImage($selector){

	var src = $selector.attr('data-src');
	var isOnline = isMobileDevice() ? doesConnectionExist(src) : true; // only run doesConnectionExist from an app (xss)
	
	
	if(isOnline){
		$selector.attr('src', src);
	}
	
	else {
	
		//var src = $selector.attr('data-offline-src');
	}
	
}


function checkScroll(p){
	if(p == 0){
		// turn off left scroll link because we are on the first frame
		$('a#tap_to_scroll_left').hide();
		$('a#tap_to_scroll_right').show();
		$('a#next_story').hide();
	}
	else if(p == $('#scroller li').length-1){
		$('a#tap_to_scroll_left').show();
		// turn off right scroll link because we are on the last frame
		$('a#tap_to_scroll_right').hide();
		// turn on the anchor tag for clicking 'next story' button (fix for z-index issue)
		$('a#next_story').show();
	}
	else{
		$('a.tap_to_scroll').show();
		$('a#next_story').hide();
	} 
	
}

//resetMyScroll
function resetMyScroll(){
	
	//console.log('resetMyScroll');
	var w = $(window).width();
	//alert(w);
	var l = $('#wrapper li').length;
	//$('#viewport').width(w);
	$('#wrapper').width(w);
	$('#wrapper li').width(w);
	$('#scroller').width(w*l);
	
	
	var width = $("#wrapper ul").width()-$('body').width();




	if(!$('body').hasClass('rtl')){
	
		width = 0;
	
	}
	

	//alert(typeof myScroll);

	if (typeof myScroll == 'object'){
		myScroll.destroy();
		myScroll = null;
	}

	//myScroll = null;
	
	myScroll = new IScroll("#wrapper", {
		scrollX:true,
		scrollY:false,
		snap: true,
		momentum: false,
		snapSpeed: 600, //400,
		eventPassthrough: true,
		startX:-width});
		
		
	//myScroll.scrollToElement('div#scroller ul li:first-child',1000);
	if($('body').hasClass('rtl')) {
	
		myScroll.currentPage.pageX = $('#scroller li').length-1;
		myScroll.currentPage.x = width*-1;
		
	}
		
	myScroll.on('scrollEnd', function () {
	    console.log('scrollEnd');
	    var p = this.currentPage.pageX;

		checkScroll(p);
	
		
		localStorage.setItem('last_page',p);
		
		//$('header h1').html(p);	
		
		// loadThisImage( $('div#scroller ul li:nth-child('+(p+1)+') img') );				
    
			console.log('myScroll.currentPage');
			console.log(myScroll.currentPage);
			//$('header h1').html(myScroll.currentPage.pageX);
	    
	});
	
	console.log('myScroll.currentPage');
	console.log(myScroll.currentPage);
	checkScroll(myScroll.currentPage.pageX); 
	//$('header h1').html(myScroll.currentPage.pageX);

	$(document).off('click', 'a#tap_to_scroll_right');
	$(document).on('click', 'a#tap_to_scroll_right', function(e){
		
		e.preventDefault();
		var lp = (localStorage.getItem('last_page'))*1;
		console.log('**********scroll right**********');
		// myScroll.scrollBy(-w,0);
		myScroll.scrollToElement('div#scroller ul li:nth-child('+(lp+2)+')',100);
		myScroll.currentPage.x-=w;
		myScroll.currentPage.pageX+=1;
		localStorage.setItem('last_page',myScroll.currentPage.pageX);
	});
	
	$(document).off('click', 'a#tap_to_scroll_left');
	$(document).on('click', 'a#tap_to_scroll_left', function(e){
		
		e.preventDefault();
		var lp = (localStorage.getItem('last_page'))*1;
		console.log('**********scroll left**********');
		// myScroll.scrollBy(w,0);
		myScroll.scrollToElement('div#scroller ul li:nth-child('+(lp)+')',100);
		myScroll.currentPage.x+=w;
		myScroll.currentPage.pageX-=1;
		localStorage.setItem('last_page',myScroll.currentPage.pageX);
	});
		
}

var inte = 0;



$(document).ready(function(){
	
	var ios_7 = navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i);

	
	if(ios_7){
		$('body').addClass('ios_7');
	}

	
});



$(window).resize(function(){
	
	clearTimeout(inte);
	clearTimeout(inte);
	
	inte = setTimeout(function(){
	
		resetMyScroll();
	
		var lp = (localStorage.getItem('last_page'))*1;

		myScroll.currentPage.pageX = lp;
		
		//alert(lp);
						
		myScroll.scrollToElement('div#scroller ul li:nth-child('+(lp+1)+')',100);

	
	}, 500);
	
});
