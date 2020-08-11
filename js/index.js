
var $audio = $('audio');
var player = new Player($audio);
var progress;
var voiceProgress;
var lyric;
getMusicList();
eventListener();
progressListener();

//歌词初始化
function initLyric(music){
    lyric = new Lyric(music.link_lrc);
    var $contain = $('.lyric ul');
    $contain.html('');
    lyric.getLyric(function(){
        $.each(lyric.lyricList,function(index ,val){
            var $item = $(`<li>${val}</li>`);
            $item.get(0).number = index;
            $contain.append($item);
        })
    });
}

//进度条事件
function progressListener(){
    var $bar = $('.progressbar .bar');
    var $line = $('.progressbar .bar .line');
    var $dot = $('.progressbar .bar .line .dot');
    progress = new Progress($bar,$line,$dot);
    //音乐进度条点击
    progress.progressClick(function(val){
        player.musicJump(val);
    });
    progress.progressMove(function(val){
        player.musicJump(val);
    });

    //声音进度条
    var $voicebar = $('.voice .bar');
    var $voiceline = $('.voice .bar .line');
    var $voicedot = $('.voice .bar .line .dot');
    voiceProgress = new Progress($voicebar,$voiceline,$voicedot);
    //声音进度条点击
    voiceProgress.progressClick(function(num){
        player.withoutMusic(num);
    });
    voiceProgress.progressMove(function(num){
        player.withoutMusic(num);
    });
}
//获取歌曲数据
function getMusicList(){
    $.ajax({
        url:'./source/musiclist.json',
        dataType:'json',
        success:function(data){
            player.musicList = data;
            $.each(data,function(index,ele){
                $item = createMusicItem(index,ele);
                $('.list_music ul').append($item);
                initMusicInfo(data[0]);
                initLyric(data[0])
            })
        }
    })
} 

//页面显示当前播放的歌曲信息
function initMusicInfo(item){
    var $headImg = $('.songimg img');
    var $songName = $('.songName a');
    var $singer = $('.singer a');
    var $ablum = $('.ablum a');
    var $name = $('.top .name');
    var $time = $('.time');
    var $maskbg = $('.maskbg');
    $headImg.attr('src',item.cover);
    $songName.text(item.name);
    $singer.text(item.singer);
    $ablum.text(item.album);
    $name.text(item.name + ' / ' + item.singer);
    $time.text('00:00 / ' + item.time);
    $maskbg.css('background',"url('"+ item.cover +"')");
    
}

function eventListener(){
    //监听工具栏按钮
    $('.bar-deleteAll').click(function(){
        var title = $('.left .list_music li').eq(0);
        $('.left .list_music ul').html(title);
        
    })
    //
    $('.list_music ul').delegate('li','mouseenter',function(){
        $(this).find('.list_menu').fadeIn(100);
        $(this).find('.list_time span').fadeIn(100);
        $(this).find('.list_time i').fadeOut(100);
    })
    $('.list_music ul').delegate('li','mouseleave',function(){
        $(this).find('.list_menu').fadeOut(100);
        $(this).find('.list_time span').fadeOut(100);
        $(this).find('.list_time i').fadeIn(100);
    })
    //监听方框是否被选中
    $('.list_music ul').delegate('.list_select','click',function(){
        $(this).toggleClass('list_selected');
    })
    //监听子菜单播放按钮
    $('.list_music ul').delegate('.list_play','click',function(){
        $(this).toggleClass('list_play2');
        $(this).parents('li').siblings().find('.list_play').removeClass('list_play2');
        if($(this).hasClass('list_play2')){
            //当前为播放状态
            $('.footcenter .first .play_on').addClass('play_on2');
            //文字高亮显示
            $(this).parents('li').find('div').css('color','#fff');
            $(this).parents('li').siblings().find('div').css('color','rgba(255,255,255,0.5')
            //序号变成播放状态
            $(this).parents('li').find('.list_number').addClass('list_number2');
            $(this).parents('li').siblings().find('.list_number').removeClass('list_number2')
        }
        else{
            $('.footcenter .first .play_on').removeClass('play_on2');
            $(this).parents('li').find('div').css('color','rgba(255,255,255,0.5');
            $(this).parents('li').find('.list_number').removeClass('list_number2')
        }
        //播放音乐
        var $musicItem = $(this).parents('li');
        player.playMusic($musicItem.get(0).index,$musicItem.get(0).music);
        initMusicInfo($musicItem.get(0).music);
        //初始化右边栏歌词信息
        initLyric($musicItem.get(0).music);
    })

    //监听上一首播放插件
    $('.play_pre').click(function(){
        $('.list_music li').eq(player.preIndex()+1).find('.list_play').trigger('click');
    })
    //监听当前播放插件
    $('.play_on').click(function(){
        if(player.curIndex == -1){
            $('.list_music li').eq(1).find('.list_play').trigger('click');
        }
        else $('.list_music li').eq(player.curIndex + 1).find('.list_play').trigger('click');
    })
    //监听下一首播放插件
    $('.play_next').click(function(){
        $('.list_music li').eq(player.nextIndex()+1).find('.list_play').trigger('click');
    })
    //监听删除按钮
    $('.list_music').delegate('li .list_time span','click',function(){
        var $li = $(this).parents('li');
        if($li.get(0).index === player.curIndex){
            $('.play_next').trigger('click');
        }
        $li.remove();
        player.changeIndex($li.get(0).index);
        $.each(player.musicList,function(index,ele){
            $('.list_music li').eq(index+1).find('.list_number').text(index+1);
            $('.list_music li').eq(index+1).get(0).index = index;
        })
    })
    //音乐播放时间
    player.getDuration(function(cur,all,time){
        $('.top .time').text(time);
        //同步进度条
        var percent = cur / all * 100 + '%';
        progress.setProgress(percent);
        //同步当前歌词信息高亮
        var index = lyric.jumpLyric(cur);
        var $item = $('.lyric_contain li');
        if(index == -1)return;
        $item.eq(index).addClass('cur');
        $item.eq(index).siblings().removeClass('cur');
        //歌词滚动
        if(index >= 2){
            $('.lyric_contain .lyric').css('marginTop',(-index + 2) * 30);
        }
    });
    //监听是否禁音
    $('.voice .voiceIcon').click(function(){
        $(this).toggleClass('voiceIcon2');
        if($(this).hasClass('voiceIcon2')){
            player.withoutMusic(0);
        }
        else{
            player.withoutMusic(1);
        }
    })
    $('.lyric_contain .lyric ul').delegate('li','click',function(){
        var getCurPos = $(this).get(0).number;
        player.playClickMusic(lyric.timeList[getCurPos]);
        
    })
    
}


//创建歌曲li元素
function createMusicItem(index,ele){
    var $item = $(`<li>
    <div class="list_select"><i></i></div>
    <div class="list_number">${index + 1}</div>
    <div class="list_name">${ele.name}
        <div class="list_menu">
            <span title="播放" class="list_play"></span>
            <span title="添加"></span>
            <span title="下载"></span>
            <span title="分享"></span>
        </div>
    </div>
    <div class="list_singer">${ele.singer}</div>
    <div class="list_time"><span></span><i>${ele.time}</i></div>
</li>`);
    $item.get(0).index = index;
    $item.get(0).music = ele;
    return $item;
}