var settings = {};

//test
(function(window, undefined){
	var $ = jQuery,
		blocked_websites,
		quizzes,
		currentSet;
	
	settings.init = function(){
		settings.initScroll();
		settings.getWebsites();
		settings.updateWebsites();
		settings.getQuizzes();
		settings.updateQuizzes();
		
		$('#slider input').on('change', settings.updateScroll);
		$('#websites a.add').on('click', settings.addWebsite);
		$('#websites').on('click', 'span.switch', settings.toggleWebsite);
		$('#websites').on('click', 'span.remove', settings.removeWebsite);
		$('#questions a.search').on('click', settings.searchQuizzes);
		$('#questions').on('click', 'span.switch', settings.toggleQuiz);
		$('#questions').on('click', 'span.remove', settings.removeQuiz);
		$('#questions').on('click', 'span.add', settings.addQuiz);
		$('#questions').on('click', 'li.see-more', settings.seeMore);
	};
	
	
	settings.initScroll = function(){
		var numOfQuestions = localStorage.getItem('num_of_questions');
		$('#slider input').val(numOfQuestions ? numOfQuestions : 5);
	};
	
	settings.updateScroll = function(){
		localStorage.setItem('num_of_questions', $('#slider input').val());
	};
	
	settings.getWebsites = function(){
		blocked_websites = localStorage.getItem('blocked_websites');
		blocked_websites = ((!blocked_websites) ? [] : JSON.parse(blocked_websites));
	};
	
	settings.updateWebsites = function(){
		var list = $('#websites ul');
		
		localStorage.setItem('blocked_websites', JSON.stringify(blocked_websites));
		
		list.empty();
		for(var i=0; i<blocked_websites.length; i++){
			list.append('<li>' + blocked_websites[i].url + (blocked_websites[i].on ? '<span class="switch">on' : '<span class="switch off">off') + '</span><span class="remove"></span></li>');
		}
	};
	
	settings.addWebsite = function(){
		var website = $('#websites input').val(), regex;
		
		website = website.replace('http://', '').replace('https://', '');
		regex = new RegExp('^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU)$');
		if(regex.test(website)){
			blocked_websites.push({url: website, on: true});
			$('#websites input').val('')
			settings.updateWebsites();
		}
		else{
			alert('NOT VALID!!!!!!!');
		}
		
		return false;
	};
	
	settings.toggleWebsite = function(){
		var index = $(this).parent().index();
		blocked_websites[index].on = !blocked_websites[index].on;
		settings.updateWebsites();
	};
	
	settings.removeWebsite = function(){
		var index = $(this).parent().index();
		blocked_websites.splice(index, 1);
		settings.updateWebsites();
	};
	
	settings.getQuizzes = function(){
		quizzes = localStorage.getItem('quizzes');
		quizzes = ((!quizzes) ? [] : JSON.parse(quizzes));
	};
	
	settings.updateQuizzes = function(){
		var list = $('#questions ul').eq(0);
		localStorage.setItem('quizzes', JSON.stringify(quizzes));
		
		list.empty();
		for(var i=0; i<quizzes.length; i++){
			list.append('<li>' + quizzes[i].title + '<span class="switch">' + (quizzes[i].on ? 'off' : 'on') + '</span><span class="remove"></span></li>');
		}
	};
	
	settings.searchQuizzes = function(){
		var term = $('#questions input').val(), list = $('#questions ul').eq(1);
		
		if(term.length >= 3){
			$.get('https://api.quizlet.com/2.0/search/sets?q='+term+'&client_id=DvyRJVGqjG', {}, function(response){
				currentSet = response.sets;
				if(currentSet){
					list.empty();
					for(var i=0; i<10; i++){
						if(currentSet[0]){
							list.append('<li data-id="' + currentSet[0].id + '">' + currentSet[0].title + '<span class="add">add</span></li>');
							currentSet.splice(0, 1);
						}
					}
					
					if(currentSet[0]){
						list.append('<li class="see-more">See More</li>');
					}
				}
			});
		}
		else{
			alert('SEARCH TERM MUST BE 3 CHARACTERS OR MORE!');
		}
		
		return false;
	};
	
	settings.seeMore = function(){
		console.log('see more');
		var list = $('#questions ul').eq(1);
		
		list.find('li.see-more').remove();
		
		for(var i=0; i<10; i++){
			if(currentSet[0]){
				list.append('<li data-id="' + currentSet[0].id + '">' + currentSet[0].title + '<span class="add">add</span></li>');
				currentSet.splice(0, 1);
			}
		}
		
		if(currentSet[0]){
			list.append('<li class="see-more">See More</li>');
		}
	};
	
	settings.addQuiz = function(){
		var parent = $(this).parent();
		$(this).remove();
		
		quizzes.push({id: parent.attr('data-id'), title: parent.html(), on: true});
		parent.remove();
		settings.updateQuizzes();
	};
	
	settings.toggleQuiz = function(){
		var index = $(this).parent().index();
		quizzes[index].on = !quizzes[index].on;
		settings.updateQuizzes();
	};
	
	settings.removeQuiz = function(){
		var index = $(this).parent().index();
		quizzes.splice(index, 1);
		settings.updateQuizzes();
	};
	
	
	
	$(function(){
		settings.init();
		$('span.remove').hide();

	
	$('ul li').hover(function(){
	
	var liremove = $(this).find('span.remove');
		liremove.toggle('slow');
			stop();
	});
	
	
	
	});
	
	
	
}(window));