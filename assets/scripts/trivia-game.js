(function ($, shuffleService) {
    $(document).ready(function () {
        'use strict';
    
        var currentGame = {
            questions: 0,
            correct: 0,
            incorrect: 0
        }
        var $questionArea = $('#questionArea');
        var $answersArea = $('#answersArea');

        // represents current question object
        var questionData = null;

        $(document).on('keydown', function (event) {
            var keys = {
                A: 65,
                B: 66,
                C: 67,
                D: 68,
                E: 69,
                F: 70,
                G: 71
            };
            var mp3 = null;

            if (isCorrectAnswer(event.keyCode)) {
                // play correct answer sound
                mp3 = 'assets/audio/correct.mp3';
                mediaPlayer.init(mp3);
                mediaPlayer.play();

                // add one to tally of correct answers
                currentGame.correct++;

                var chosenAnswerNdx = getChosenAnswerNdx(event.keyCode); 
                $($('#answersArea').children('h2').index(chosenAnswerNdx)).addClass('chosen-answer');
            } else {  // user guessed wrong answer...
                // play wrong answer sound
                mp3 = 'assets/audio/wrong.wav';
                mediaPlayer.init(mp3);
                mediaPlayer.play();

                // count against wrong answers 
                currentGame.incorrect++;

                // highlight chosen answer
                var chosenAnswerNdx = getChosenAnswerNdx(event.keyCode); 
                $($('#answersArea').children('h2').index(chosenAnswerNdx)).addClass('chosen-answer');
                
                // display correct answer
                var correctAnswerNdx = getCorrectAnswerNdx(event.keyCode);
                var ndx = $('#answersArea').children('h2').index(correctAnswerNdx);
                $(ndx).addClass('correct-answer');
            }
        });

        function getCorrectAnswerNdx(answerKeyCode) {
            var answerText = $('#answer' + String.fromCharCode(answerKeyCode)).text();
            answerText = answerText.trim().slice();
            $answersArea = $('#answersArea');
            
            var $h2 = $('h2');
            for (var i = 0; i < $h2.length; i++) {

            }
        }

        function getChosenAnswerNdx(answerKeyCode) {
            var $answerTextH2 = $('#answer' + String.fromCharCode(answerKeyCode));
            return $answersArea.index($answerTextH2);
        }

        function isCorrectAnswer(answerKeyCode) {
            var answerText = $('#answer' + String.fromCharCode(answerKeyCode)).text();
            var answerKeyStrLength = 3;
            answerText = answerText.trim().slice(answerKeyStrLength);
            
            if (questionData.correct_answer === answerText) {
                return true;
            } 

            return false;
        }

        function displayPossibleAnswers(possibleAnswers) {
            // I'm assuming that we'll never have more than 7 possible choices
            var choiceLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];  
            
            $.each(possibleAnswers, function (index, value) {
                var $answer = $(`<h3 id="answer${choiceLetters[index]}">
                    ${choiceLetters[index]}) ${value}<h3>`) 
                $answersArea.append($answer);
            });
        }

        function displayQuestion() {
            var answers = questionData.incorrect_answers.concat(questionData.correct_answer);
            answers = shuffleService.shuffle(answers);
            $questionArea.html('<h2>' + questionData.question + '</h2>');
            
            displayPossibleAnswers(answers);    
        }
    
        function retrieveQuestion(sessionToken) {    
            $.ajax({
                url: 'https://opentdb.com/api.php?amount=1&token=' + sessionToken,
                type: 'GET'
            }).done(function (response) {
                questionData = response.results[0];
                displayQuestion(questionData);
            });
        }
        
        function retrieveSessionToken() {
            return $.ajax({
                url: 'https://opentdb.com/api_token.php?command=request',
                type: 'GET'
            });
        }
    
        function initializeGame() {
            retrieveSessionToken().then(function (tokenData) {
                retrieveQuestion(tokenData.token);
            });
        }
    
        initializeGame();
    });
})($, shuffleService);