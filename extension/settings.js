var settings = {};

(function(window, undefined){
	var $ = jQuery,
		blocked_websites;
	
	settings.init = function(){
		settings.getWebsites();
		settings.updateWebsites();
		
		$('.website-button').on('click', settings.storeWebsite);
	};
	
	settings.getWebsites = function(){
		blocked_websites = localStorage.getItem('blocked_websites');
		blocked_websites = ((!blocked_websites) ? [] : JSON.parse(blocked_websites));
	};
	
	settings.updateWebsites = function(){
		var list = $('.website-list');
		
		list.empty();
		for(var i=0; i<blocked_websites.length; i++){
			list.append('<li>' + blocked_websites[i] + '</li>');
		}
	};
	
	settings.storeWebsite = function(){
		var website = $('.website-input').val(), regex;
		
		website = website.replace('http://', '').replace('https://', '');
		regex = new RegExp('^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$');
		if(regex.test(website)){
			blocked_websites.push(website);
			$('.website-input').val('')
			localStorage.setItem('blocked_websites', JSON.stringify(blocked_websites));
			settings.updateWebsites();
		}
		else{
			alert('NOT VALID!!!!!!!');
		}
		
		return false;
	};
	
	$(function(){
		settings.init();
	});
}(window));