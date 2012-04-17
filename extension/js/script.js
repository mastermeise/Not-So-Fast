$('document').ready(function(){

	var correctbtn = $('a.button[rel="correct"]');
	var incorrectbtn = $('a.button[rel="incorrect"]');
	var startbtn = $('a.button[rel="start"]');
	
	// Start Button Click
	$(startbtn).mouseup(function(){
		$('div.show').removeClass('show')		
		$('div.question:first').addClass('show');
	}); //End Start Button Click
	
	
	// Button Click
	$(correctbtn).add(incorrectbtn).mouseup(function(){
		var $btnwidth = $(this).outerWidth() + 10 + 'px';
		var firstquestion = $('div.question:first'); //first question
		var show = $('div.show'); //current question(div) shown
		var nextquestion = $('div.show').next(); //the next question
		var $questionloop = function(){
			$(show).removeClass('show'); //hide current question
			
			if ($(nextquestion).is(':last')) { //loop back to first question
				$(firstquestion).addClass('show'); //show the first question
			}
			else {	
				$(nextquestion).addClass('show'); //show the next question
			}
			
			$('a.correct').removeClass('correct'); //remove feedback state
			$('a.incorrect').removeClass('incorrect'); //remove feedback state
			$('img.feedback').remove(); //remove feedback image
		};
		
		// If Correct
		if ($(this).is(correctbtn)) {
			var $feedbackimg = $('<img src="img/check.png" alt="check" width="23" height="17" class="feedback" />').css('left', $btnwidth);
			var n = $('#progress li.progress-correct').length; //get amount of progress
			var $progressloop = function(){
				if ( n == 4 ) { //if last correct answer 
					$('#progress li.progress-correct:last').next().addClass('progress-correct');
					
					var url = location.search.split("=")[1];
					if(url) {
						window.location = url + '?passed=true';
					}
					else{
						alert('You Made It!');
					}
				}
				else if ( n > 0 ) { // if already progress
					$('#progress li.progress-correct:last').next().addClass('progress-correct');
				}
				else { //if first question correct	
					$('#progress').find('li:first').addClass('progress-correct');
				}
			} //End Progress Loop
		
			$(this).addClass('correct');
			$(incorrectbtn).addClass('incorrect');
		} //End if correct button
		// If incorrect
		else {		
			var $feedbackimg = $('<img src="img/x.png" alt="x" width="16" height="15" class="feedback" />').css('left', $btnwidth);
			$(incorrectbtn).addClass('incorrect');
			$(correctbtn).addClass('correct');
		} // End Incorrect
		
		$(this).append($feedbackimg); //Add feedback Image to HTML
		$feedbackimg.fadeIn(500); //Fadein Img 
		setTimeout($progressloop, 500);
		setTimeout($questionloop, 1500);
		
		return false;
	}); //End Button Click
	
	var current_quiz = JSON.parse(localStorage.getItem('current_quiz'));
	if(current_quiz){
		$.get('https://api.quizlet.com/2.0/sets/' + current_quiz.id + '?client_id=DvyRJVGqjG', {}, function(response){
			var terms = response.terms, length, rand, question, incorrects, rand2;
			if(terms){
				length = terms.length;
				rand = Math.floor(Math.random()*(length-5));
				
				for(var i=rand; i<rand+5; i++){
					question = $('#question' + (i-rand+1));
					question.find('h1').html(terms[i].term);
					question.find('a.button[rel="correct"]').html(terms[i].definition);
					incorrects = question.find('a.button[rel="incorrect"]');
					
					for(var j=0; j<3; j++){
						rand2 = Math.floor(Math.random()*(length));
						while(rand2 == i){
							rand2 = Math.floor(Math.random()*(length));
						}
						incorrects.eq(j).html(terms[rand2].definition);
					}
				}
				
				$('.page').addClass('animated fadeInLeft').eq(0).addClass('show');
			}
		});
	}
	else{
		alert('NO QUIZ SET');
	}
	
}); // End Doc Ready