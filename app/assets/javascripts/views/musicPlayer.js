window.musicPlayer = {
    init: function() {
        var self = this;
    },
    playURL: function(url) {
        console.log("music: " + url);
        var self = this;
        console.log(this);

        //$('audio').remove();
        if(self.$audio) self.stop();

        self.$audio = $('<audio>');
        self.$audio.prop('autoplay', true);
        self.$audio.prop('loop', true);
        self.$audio.prop('controls', false);
        self.$audio[0].volume = 0.2;
        $(document.body).append(self.$audio);
        self.$audio.attr('src', url);
    },
    stop: function() {
        var self = this;
        console.log('stop music');
        if (self.$audio) {
            self.$audio.remove();
        }
        self.$audio = null;
    },
    $audio: null,
};

window.musicPlayer.init();
