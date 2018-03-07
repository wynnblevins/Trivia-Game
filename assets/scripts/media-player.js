var mediaPlayer = (function () {
    'use strict';

    var audio = null;

    return {
        init: function (filePath) {
            audio = new Audio(filePath);
            audio.pause();
            audio.currentTime = 0;
        },

        play: function () {
            if (audio) {
                audio.play();
            }
        },

        stop: function () {
            if (audio) {
                audio.pause();
            }
        }
    };
})();