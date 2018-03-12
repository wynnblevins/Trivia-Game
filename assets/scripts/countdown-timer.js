var timer = (function () {
    'use strict';
    
    var timerObj;
    var count = 11;
    var myInterval = null;
    
    var timer = {
        init: function (onTimeUp, onTick) {        
            // 11 because the first number to be displayed will be 10
            count = 11;  
            myInterval = setInterval(function () {
                count--;
                onTick(count);
            }, 1000);

            timerObj = setTimeout(function () {
                clearInterval(myInterval);
                clearTimeout(timerObj);
                onTimeUp();        
            }, 11000);
        },

        resetCount() {
            count = 11;
        },

        stop: function () {
            clearTimeout(timerObj);
            clearInterval(myInterval);
        }
    };

    return timer; 
})();