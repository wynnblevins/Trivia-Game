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
        var token = null;
        var $score = $('#score');
        var $timer = $('#timer');
        var requestWasMade = false;

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

        var keyWasPressed = function (event) {
            timer.stop();
            timer.resetCount();

            var mp3 = null;
            var correctAnswer = isCorrectAnswer(event.keyCode);
            ++currentGame.questions;

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

            emptyGameBoard();
            
            $('#scoreWrapper').html(`<h3>Current Game Stats:</h3> 
                \n<h4>correct guesses: ${currentGame.correct}</h4>
                \n<h4>incorrect guesses: ${currentGame.incorrect}</h4>
                \n<h4>total questions: ${currentGame.questions}</h4>`);
            retrieveQuestion(token.token);
        }

        $(document).on('click', '#nextButton', function (event) {
            emptyGameBoard();
            retrieveQuestion(token.token);
            $('#buttonsArea').empty();
            attachKeyEvent();
        });
        
        function attachKeyEvent() {
            $(document).on('keydown', function (event) {
                keyWasPressed(event)
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
            var answerText = $('#answer' + String.fromCharCode(answerKeyCode)).text();
            var answerKeyStrLength = 3;
            
            return answerText.trim().slice(answerKeyStrLength);
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
            var choiceLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];  
            
            $.each(possibleAnswers, function (index, value) {
                var $answer = $(`<h3 id="answer${choiceLetters[index]}">
                    ${choiceLetters[index]}) ${value}<h3>`) 
                $answersArea.append($answer);
            });
        }

        function addNextButton() {
            var buttonMarkup = `<button id="nextButton" class="btn btn-default">
                Next <span class="glyphicon glyphicon-arrow-right"></span></button>`;
            $('#buttonsArea').append(buttonMarkup);
        }
        
        function disableKeyPresses() {
            $(document).off('keydown');
        }

        function displayQuestion() {
            var answers = questionData.incorrect_answers.concat(questionData.correct_answer);
            answers = shuffleService.shuffle(answers);
            $questionArea.html('<h2>' + questionData.question + '</h2>');
            $timer.text('Ready... Set...');
            displayPossibleAnswers(answers);  
            
            timer.init(function () {
                alert('Times up!!');
                disableKeyPresses();
                addNextButton();
                timer.resetCount();
            }, function (count) {
                $timer.text(count + ' Seconds Remaining!');        
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