(function(window){
    function Progress($bar,$line,$dot){
        return new Progress.prototype.init($bar,$line,$dot);
    };
    Progress.prototype = {
        constructor: Progress,
        init: function($bar,$line,$dot){
            this.$bar = $bar;
            this.$line = $line;
            this.$dot = $dot;
            this.radiu = parseInt(this.$dot.css('width')) / 2 ; 
            this.ismove = false;
        },
        progressClick : function(callback){
            var $this = this;
            var val;
            this.$bar.click(function(event){
                var x = $(this).offset().left;
                var xx = event.pageX;
                $this.$line.css('width',xx - x - $this.radiu);
                $this.$dot.css('left',xx - x - $this.radiu);
                val = (xx - x) / parseInt($this.$bar.css('width'));
                callback(val);
            })
            
        },
        progressMove : function(callback){
            var $this = this;
            var x = $this.$bar.offset().left;
            var xx;
            this.$dot.mousedown(function(){
                $this.ismove = true;
                $(document).mousemove(function(event){
                    xx = event.pageX;
                    var width = xx - x;
                    if(width <= parseInt($this.$bar.css('width')) && width >= 0){
                        $this.$line.css('width',width);
                        $this.$dot.css('left',width);
                    }
                });
                $(document).mouseup(function(){
                    $(document).off('mousemove');
                    this.ismove = false;
                    callback((xx - x) / parseInt($this.$bar.css('width')))
                })
            });
            
        },
        setProgress : function(per){
            if(this.ismove)return;
            this.$line.css('width', per);
            this.$dot.css('left',per);
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);