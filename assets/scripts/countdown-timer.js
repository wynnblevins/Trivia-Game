var timer = (function () {
    'use strict';
    var timerObj;
    var count = 10;

    var myInterval = null;
    
    var timer = {
        init: function (onTimeUp, onTick) {        
            count = 10;
            myInterval = setInterval(function () {
                count--;
                onTick(count);
            }, 1000);

            timerObj = setTimeout(function () {
                clearInterval(myInterval);
                clearTimeout(timerObj);
                onTimeUp();        
            }, 10000);
        },

        resetCount() {
            count = 10;
        },

        stop: function () {
            clearTimeout(timerObj);
            clearInterval(myInterval);
        }
    };

    return timer; 
})();