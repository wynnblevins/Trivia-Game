$(document).ready(function () {
    'use strict';

    function retrieveSessionToken() {
        $.ajax({
            url: 'https://opentdb.com/api_token.php?command=request',
            type: 'GET'
        }).done(function (response) {
            console.log(response);
        });
    }

    function initializeGame() {
        retrieveSessionToken();
    }

    initializeGame();
});