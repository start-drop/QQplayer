(function(){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor : Lyric,
        init : function(path){
            this.path = path;
        },
        lyricList : [],
        timeList : [],
        lyricIndex : -1,
        getLyric : function(callback){
            var $this = this;
            $.ajax({
                url : $this.path,
                dataType : 'text',
                success : function(data){
                    $this.formatLyric(data);
                    callback();
                },
            })
        },
        formatLyric : function(data){
            var $this = this;
            $this.lyricList = [];
            $this.timeList = [];
            $this.index = -1;
            var list = data.split('\n');
            var reg = /\[(\d*:\d*\.\d*)\]/;
            $.each(list,function(index,ele){
                var str = ele.split(']')[1];
                if(str.length == 1)return true;
                $this.lyricList.push(str);
                var arr = reg.exec(ele)[1].split(':');
                var time = parseFloat((parseInt(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2));
                $this.timeList.push(time);
            })
        },
        jumpLyric : function(cur){
            if(cur >= this.timeList[this.index + 1]){
                this.index++;
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);