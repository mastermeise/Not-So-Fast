var quiz = {};

(function(window, undefined){
	var $ = jQuery,
		questions,
		numOfQuestions,
		currentQuestion,
		currentQuestionNum,
		redirectUrl,
		started = false;
	
	quiz.init = function(){
		quiz.initWelcome();
		
		$('#question').on('click', 'li a', quiz.pickQuestion);
	};
	
	quiz.initWelcome = function(){
		var quizzes = JSON.parse(localStorage.getItem('quizzes')),
			chosenQuiz;
		
		if(quizzes){
			for(var i=quizzes.length-1; i>=0; i--){
				if(!quizzes[i].on){
					quizzes.splice(i, 1);
				}
			}
			chosenQuiz = quizzes[Math.floor(Math.random()*quizzes.length)];
		}
		
		if(chosenQuiz){
			$.get('https://api.quizlet.com/2.0/sets/' + chosenQuiz.id + '?client_id=DvyRJVGqjG', {}, function(response){
				questions = response.terms;
			});
			
			numOfQuestions = localStorage.getItem('num_of_questions');
			numOfQuestions = (numOfQuestions ? numOfQuestions : 5);
			redirectUrl = window.location.search.split('=');
			redirectUrl = (redirectUrl.length > 0 ? redirectUrl[1] : 'www.google.com');
			
			$('#welcome p').html('Answer ' + numOfQuestions + ' questions to get to ' + redirectUrl.replace('http://', '').replace('https://', ''));
			$('#welcome a').on('click', quiz.start);
		}
		else{
			$('#welcome p').html('You have no quizzes chosen. Please go to the settings page.');
			$('#welcome a').html('Settings').on('click', function(){
				window.location = 'settings.html';
			});
		}
	};
	
	quiz.start = function(){
		if(!started){
			started = true;
			currentQuestionNum = 1;
			
			if(questions){
				$('#welcome .single').animate({left:-82, opacity:0}, 600, 'easeInQuad', function(){
					$(this).parent().hide();
				});
				$('#question').show();
				
				quiz.nextQuestion();
			}
			else{
				setTimeout(quiz.start, 1000);
			}
		}
	};
	
	quiz.nextQuestion = function(){
		var newQuestion = $('<div class="single"></div>'),
			list = $('<ul class="answers"></ul>'),
			choices = [],
			image,
			rand,
			found;
		
		rand = Math.floor(Math.random()*questions.length);
		currentQuestion = questions.splice(rand, 1)[0];
		image = currentQuestion.image;
		
		newQuestion.append('<span class="progress">' + currentQuestionNum + ' of ' + numOfQuestions + '</span>');
		newQuestion.append('<h1>' + currentQuestion.term + (image ? ' <img src="' + image.url + '" />' : '') + '</h1>');
		
		for(var i=0; i<3; i++){
			found = false;
			rand = Math.floor(Math.random()*(questions.length-i));
			do{
				for(var j=0; j<choices.length; j++){
					if(choices[j] == rand){
						rand = (rand+1 < questions.length ? rand+1 : 0);
						found = true;
					}
				}
			}while(found);
			
			choices.push(questions[rand]);
		}
		
		choices.splice(Math.floor(Math.random()*4), 0, currentQuestion);
		
		list.empty();
		for(i=0; i<choices.length; i++){
			image = choices[i].image;
			list.append('<li><a href="#">' + choices[i].definition + (image ? ' <img src="' + image.url + '" />' : '') + '</a></li>');
		}
		
		newQuestion.append(list);
		$('#question div.single').addClass('fade').css('left', 12).animate({left:-70, opacity:0}, 600, 'easeInQuad', function(){
			$(this).remove();
		});
		$('#question').append(newQuestion);
		newQuestion.delay(200).animate({left:0, opacity:1}, 500, 'easeOutQuad');
		
		currentQuestionNum += 1;
	};
	
	quiz.pickQuestion = function(){
		if(currentQuestion.definition == $(this).html()){
			$(this).append('<img src="img/choice_check.png" />');
		}
		else{
			$(this).append('<img src="img/choice_x.png" />');
			$(this).parent().siblings().each(function(i, choice){
				choice = $(choice).children('a:first');
				if(choice.html() == currentQuestion.definition){
					choice.append('<img src="img/choice_check.png" />');
				}
			});
		}
		
		if(currentQuestionNum <= numOfQuestions){
			setTimeout(quiz.nextQuestion, 1000);
		}
		else{
			setTimeout(function(){
				window.location = redirectUrl + '?passed=true';
			}, 1000);
		}
		
		return false;
	};
	
	$(function(){
		quiz.init();
	});
}(window));