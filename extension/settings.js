var settings = {};

(function(window, undefined){
	var $ = jQuery,
		blocked_websites;
	
	settings.init = function(){
		settings.getWebsites();
		settings.updateWebsites();
		
		var current_quiz = JSON.parse(localStorage.getItem('current_quiz'));
		if(current_quiz){
			$('.quiz-current').html('Current: ' + current_quiz.title);
		}
		else{
			$('.quiz-current').html('Current: No Quiz');
		}
		
		$('.website-button').on('click', settings.storeWebsite);
		$('.quiz-button').on('click', settings.searchQuizzes);
		$('.quiz-list a').live('click', settings.setQuiz);
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
	
	settings.searchQuizzes = function(){
		var term = $('.quiz-input').val(), list = $('.quiz-list');
		
		if(term.length >= 3){
			$.get('https://api.quizlet.com/2.0/search/sets?q='+term+'&client_id=DvyRJVGqjG', {}, function(response){
				var sets = response.sets;
				if(sets){
					list.empty();
					for(var i=0; i<sets.length; i++){
						list.append('<li><a data-id="' + sets[i].id + '" href="#">' + sets[i].title + '</a></li>');
					}
				}
			});
		}
		else{
			alert('SEARCH TERM MUST BE 3 CHARACTERS OR MORE!');
		}
		
		return false;
	};
	
	settings.setQuiz = function(){
		var _this = $(this), id, title;
		id = _this.attr('data-id');
		title = _this.html();
		
		$('.quiz-current').html('Current: ' + title);
		
		localStorage.setItem('current_quiz', JSON.stringify({id: id, title: title}));
		
		return false;
	};
	
	$(function(){
		settings.init();
	});
}(window));