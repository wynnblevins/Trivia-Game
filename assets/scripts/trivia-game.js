$(document).ready(function () {
    'use strict';

    function displayQuestion(questionData) {
        // printing question data to prove function is working
        console.log(questionData);
    }

    function retrieveQuestion(sessionToken) {
        $.ajax({
            url: 'https://opentdb.com/api.php?amount=1&token=' + sessionToken,
            type: 'GET'
        }).done(function (response) {
            displayQuestion(response);
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