$('document').ready(function(){

	var correctbtn = $('a.button[rel="correct"]');
	var incorrectbtn = $('a.button[rel="incorrect"]');
	var startbtn = $('a.button[rel="start"]');
	
	$('.page').addClass('animated fadeInLeft');
	
	
	
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
		alert('You Made It!');
		//window.location = "http://facebook.com";
	
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





}); // End Doc Ready