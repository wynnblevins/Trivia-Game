var timer = (function () {
    'use strict';
    var timerObj;
    var count = 10;

    var myInterval = setInterval(function () {
        console.log(count);
        count--;
    }, 1000);

    return {
        init: function () {
            timerObj = setTimeout(function () {
                clearInterval(myInterval);
                clearTimeout(timerObj);
                alert('Times Up!');        
            }, 10000);
        },

        stop: function () {
            clearTimeout(timerObj);
            clearInterval(myInterval);
        }
    };
})();