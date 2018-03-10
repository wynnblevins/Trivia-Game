var timer = (function () {
    'use strict';
    var timerObj;
    var count = 10;

    var myInterval = setInterval(function () {
        console.log(count);
        count--;
    }, 1000);

    return {
        init: function (onTimeUp) {
            timerObj = setTimeout(function () {
                clearInterval(myInterval);
                clearTimeout(timerObj);
                onTimeUp();        
            }, 10000);
        },

        stop: function () {
            clearTimeout(timerObj);
            clearInterval(myInterval);
        }
    };
})();