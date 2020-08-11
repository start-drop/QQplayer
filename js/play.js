(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor : Player,
        musicList : [],
        init : function($audio){
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        curIndex : -1,
        playMusic : function(index,music){
            if(this.curIndex === index){
                if(this.audio.paused){
                    this.audio.play();
                }
                else this.audio.pause();
            }
            else {
                this.curIndex = index;
                this.$audio.attr('src',music.link_url);
                this.audio.play();
            }
        },
        preIndex : function(){
            return this.curIndex - 1 < 0 ? this.musicList.length - 1 : this.curIndex - 1; 
        },
        nextIndex : function(){
            return (this.curIndex + 1) % this.musicList.length;
        },
        changeIndex : function(index){
            this.musicList.splice(index,1);
            if(index < this.curIndex){
                this.curIndex += 1;
            }
        },
        getDuration : function(callback){
            var $this = this;
            $this.$audio.on('timeupdate',function(){
                var all = $this.audio.duration;
                var cur = $this.audio.currentTime;
                var time = $this.formatTime(cur) + ' / ' + $this.formatTime(all);
                callback(cur,all,time);
            })
        },
        //格式化时间
        formatTime : function(time){
            var min = Math.floor(time / 60);
            var sec = Math.floor(time % 60);
            return ('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2);
        },
        //音乐跳转
        musicJump : function(val){
            if(isNaN(val))return;
            this.audio.currentTime = val * this.audio.duration;
        },
        //音量
        withoutMusic : function(num){
            if(num < 0 || num > 1)return;
            this.audio.volume = num;
            // if(num == 0)this.$bar.parents('.voice').find('.voiceIcon').addClass('voiceIcon2');
        },
        //点击歌词，修改当前音乐的进度
        playClickMusic : function(clicktime){
            this.audio.currentTime = clicktime;
        }
        
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);