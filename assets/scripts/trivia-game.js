var triviaGame = (function ($, shuffleService, timer) {
    'use strict';
    
    $(document).ready(function () {
        var currentGame = {
            questions: 0,
            correct: 0,
            incorrect: 0
        };
        var $questionArea = $('#questionArea');
        var $answersArea = $('#answersArea');
        var $innerButtonsArea = $('#innerButtonArea');
        var $buttonsArea = $('#buttonsArea');
        var token = null;
        var $score = $('#score');
        var $timer = $('#timer');
        var requestWasMade = false;
        var answerButtonIds = ['button-a', 'button-b', 'button-c', 'button-d'];
        var keys = {
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71
        };

        // represents current question object
        var questionData = null;

        function resetClock() {
            timer.stop();
            timer.resetCount();
        }

        function keepScore(correctAnswer) {
            var mp3 = null;
             
            if (correctAnswer) {
                // play correct answer sound
                mp3 = 'assets/audio/correct.mp3';
                mediaPlayer.init(mp3);
                mediaPlayer.play();

                // add one to tally of correct answers
                currentGame.correct++;
                
            } else {  // user guessed wrong answer...
                
                // play wrong answer sound
                mp3 = 'assets/audio/wrong.wav';
                mediaPlayer.init(mp3);
                mediaPlayer.play();

                // count against wrong answers 
                currentGame.incorrect++;

                // highlight chosen answer
                
                // display correct answer
            }
        }

        var keyWasPressed = function (event) {
            resetClock();

            var mp3 = null;
            var correctAnswer = isCorrectAnswer(event.keyCode);
            ++currentGame.questions;

            keepScore(correctAnswer);
            
            emptyGameBoard();
            
            $('#scoreWrapper').html(`<h3 class="jeopardy-text">Current Game Stats:</h3> 
                \n<h4>correct guesses: ${currentGame.correct}</h4>
                \n<h4>incorrect guesses: ${currentGame.incorrect}</h4>
                \n<h4>total questions: ${currentGame.questions}</h4>`);
            retrieveQuestion(token.token);
        };

        $(document).on('click', '#nextButton', function (event) {
            emptyGameBoard();
            retrieveQuestion(token.token);
            attachKeyEvent();
            resetClock();
            enableButtons();
        });
        
        $(document).on('click', '#button-A', aclick); 
        function aclick () {
            resetClock();
            var correctAnswer = isCorrectAnswer(keys.A);
            keepScore(correctAnswer);
            
            emptyGameBoard();
            
            $('#scoreWrapper').html(`<h3 class="jeopardy-text">Current Game Stats:</h3> 
                \n<h4>correct guesses: ${currentGame.correct}</h4>
                \n<h4>incorrect guesses: ${currentGame.incorrect}</h4>
                \n<h4>total questions: ${currentGame.questions}</h4>`);
            retrieveQuestion(token.token);
        }

        $(document).on('click', '#button-B', bclick);
        function bclick() {
            resetClock();
            var correctAnswer = isCorrectAnswer(keys.B);
            keepScore(correctAnswer);
            
            emptyGameBoard();
            
            $('#scoreWrapper').html(`<h3 class="jeopardy-text">Current Game Stats:</h3> 
                \n<h4>correct guesses: ${currentGame.correct}</h4>
                \n<h4>incorrect guesses: ${currentGame.incorrect}</h4>
                \n<h4>total questions: ${currentGame.questions}</h4>`);
            retrieveQuestion(token.token);
        }

        $(document).on('click', '#button-C', cclick);
        function cclick() {
            resetClock();
            var correctAnswer = isCorrectAnswer(keys.C);
            keepScore(correctAnswer);
            
            emptyGameBoard();
            
            $('#scoreWrapper').html(`<h3 class="jeopardy-text">Current Game Stats:</h3> 
                \n<h4>correct guesses: ${currentGame.correct}</h4>
                \n<h4>incorrect guesses: ${currentGame.incorrect}</h4>
                \n<h4>total questions: ${currentGame.questions}</h4>`);
            retrieveQuestion(token.token);
        }

        $(document).on('click', '#button-D', dclick)
        function dclick () {
            resetClock();
            var correctAnswer = isCorrectAnswer(keys.D);
            keepScore(correctAnswer);
            
            emptyGameBoard();
            
            $('#scoreWrapper').html(`<h3 class="jeopardy-text">Current Game Stats:</h3> 
                \n<h4>correct guesses: ${currentGame.correct}</h4>
                \n<h4>incorrect guesses: ${currentGame.incorrect}</h4>
                \n<h4>total questions: ${currentGame.questions}</h4>`);
            retrieveQuestion(token.token);
        }

        function attachKeyEvent() {
            $(document).on('keydown', function (event) {
                keyWasPressed(event);
            });


        }
        
        function emptyGameBoard() {
            $('#score').empty();
            $('#answersArea').empty();
        }

        function getChosenAnswerNdx(answerKeyCode) {
            var $answerTextH2 = $('#answer' + String.fromCharCode(answerKeyCode));
            return $answersArea.index($answerTextH2);
        }

        // removes answer's letter from answer so we're just left with the answer text
        function getAnswerText(answerKeyCode) {
            return $('#answer' + String.fromCharCode(answerKeyCode)).text();
        }

        // answer is "incorrect" if it is a valid guess key but not the correct answer
        function isCorrectAnswer(answerKeyCode) {
            var answerText = getAnswerText(answerKeyCode);
            
            if (questionData.correct_answer === answerText) {
                return true;
            } 

            return false;
        }

        function isInvalidAnswer(answerKeyCode) {
            var allAnswers = questionData.incorrect_answers.concat(questionData.correct_answer);
            var userAnswer = String.fromCharCode(answerKeyCode);
            
            if (allAnswers.indexOf(userAnswer) === -1) {
                return true;
            }

            return false;
        }

        function displayPossibleAnswers(possibleAnswers) {
            // I'm assuming that we'll never have more than 7 possible choices
            var choiceLetters = [
                {letter: 'A'}, 
                {letter: 'B'}, 
                {letter: 'C'}, 
                {letter: 'D'}, 
                {letter: 'E'}, 
                {letter: 'F'}, 
                {letter: 'G'}
            ];  
            var $innerButtonArea = $('div#innerButtonArea');
            
            $.each(possibleAnswers, function (index, value) {
                var $answer = $(`<div class="block-wrapper"><button type='button' class='btn btn-default' 
                    id='button-${choiceLetters[index].letter}'>${choiceLetters[index].letter}
                    </button><h3 class="answer-text" id="answer${choiceLetters[index].letter}">${value}</h3></div>`); 
                $answersArea.append($answer);
            });
        }

        function addNextButton() {
            // remove timer text
            
            // add next button where timer was
            var buttonMarkup = `<button id="nextButton" class="btn btn-default inline-btn">
                Next <span class="glyphicon glyphicon-arrow-right"></span></button>`;
            $('#timerArea').append(buttonMarkup);
        }

        function disableKeyPresses() {
            $(document).off('keydown');
        }

        function disableButtons() {
            var $answerButtons = $('.answer-button');
            $(document).off('click', '#button-A', aclick);
            $(document).off('click', '#button-B', bclick);
            $(document).off('click', '#button-C', cclick);
            $(document).off('click', '#button-D', dclick);    
        }

        function enableButtons() {
            var $answerButtons = $('.answer-button');
            $(document).on('click', '#button-A', aclick);
            $(document).on('click', '#button-B', bclick);
            $(document).on('click', '#button-C', cclick);
            $(document).on('click', '#button-D', dclick);    
        }

        function displayQuestion() {
            $('#nextButton').remove();
            $('#buttonsArea').remove();

            var answers = questionData.incorrect_answers.concat(questionData.correct_answer);
            answers = shuffleService.shuffle(answers);
            $questionArea.html('<h2>' + questionData.question + '</h2>');
            $timer.text('Ready... Set...');
            

            displayPossibleAnswers(answers); 

            handleTimer();
        }
    
        function handleTimer() {
            var secondsRemaingTxt = ' Seconds Remaining';

            timer.init(function () {
                mediaPlayer.init('assets/audio/timesup.mp3');
                mediaPlayer.play();

                disableKeyPresses();
                disableButtons();
                addNextButton();
                timer.resetCount();
            }, function (count) {
                $timer.text(count + secondsRemaingTxt);        
            });
        }

        function retrieveQuestion(sessionToken) {    
            if (!requestWasMade) {
                requestWasMade = true;
                $.ajax({
                    url: 'https://opentdb.com/api.php?amount=1&token=' + sessionToken,
                    type: 'GET'
                }).done(function (response) {
                    questionData = response.results[0];
                    console.log(questionData.correct_answer);
                    displayQuestion(questionData);
                    requestWasMade = false;
                });
            }
        }
        
        function retrieveSessionToken() {
            return $.ajax({
                url: 'https://opentdb.com/api_token.php?command=request',
                type: 'GET'
            });
        }
    
        function initializeGame() {
            retrieveSessionToken().then(function (tokenData) {
                token = tokenData;
                retrieveQuestion(tokenData.token);
            });
        }

        attachKeyEvent();
        initializeGame();
    });
})($, shuffleService, timer);