(function(G, $) {
    $().ready(function() {;

        var u = window.navigator.userAgent,
            isAndroid4 = false;
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            //android
            num = u.substr(u.indexOf('Android') + 8, 3) * 1;
            // alert(num);

            if (num >= 4 && num <= 4.4) {
                isAndroid4 = true;
            }
        }

        var bodyWidth = $('body')[0].clientWidth,
            bodyHeight = $('body')[0].clientHeight,
            audioList = [];


        function formatSeconds(value, format) {
            // console.log('value  ' + value);
            var parameter = 60;
            var minute = parseInt(value / parameter);
            var second = Math.round(value % parameter);

            if (!format) {
                return second == 60 ? '01:00' : (minute ? (minute >= 10 ? minute : ('0' + minute + ':')) : '00:') + (second >= 10 ? second : '0' + second);
            } else {
                return format.replace('MM', minute).replace('ss', second);
            }
            // return (minute ? minute + ":" : '00:') + second;
        }
        var AUDIO = (function() {
            var _setCount = function(self) {
                    var config = self.config,
                        audio = config.audio,
                        $curtime = config.curtime,
                        $container = config.container,
                        $progresser = config.progresser, //进度按钮
                        $duration = config.duration,
                        $progressBar = $container.find('.progress-bar'), //进度条
                        $progressBox = $container.find('.progress-box'),
                        progressBoxW = $progressBox.width();
                    var _cancelCount = function() {
                            window.clearInterval(self.config._setInterVal);
                        },
                        countDown = function() {
                            // self.config.duration = config.container.find('.duration');

                            if (config.status != 'end') {
                                var duration = audio.duration, //总长度
                                    currentTime = audio.currentTime, //当前进度
                                    timeLength = config.timeLength;


                                if (duration != timeLength && timeLength != 0) {
                                    duration = timeLength;
                                }
                                // console.log(duration)

                                // $('#test').html(duration);
                                var widthline = (Math.round(currentTime) / Math.round(duration)) * 100; //进度条

                                $duration.text(formatSeconds(duration)); //总时间

                                $curtime.text(formatSeconds(currentTime)); //当前时间

                                $progresser.css({
                                    left: widthline + '%'
                                })
                                $progressBar.css({
                                    width: widthline + '%'
                                });


                                if (audio.paused) { ///检测播放是否已暂停.audio.paused 在播放器播放时返回false.
                                    _cancelCount(self); //取消计时
                                    if (parseInt($progressBar.width()) >= progressBoxW) {
                                        _end(self);
                                    }
                                }
                            } else {
                                _cancelCount(self); //取消计时
                            }
                        };

                    // progressBar.removeClass('full');

                    if (self.config._setInterVal) {
                        _cancelCount();
                        self.config._setInterVal = null;
                        self.config._setInterVal = window.setInterval(countDown, 1000);
                        // console.log(1)
                    } else {
                        self.config._setInterVal = window.setInterval(countDown, 1000);
                        // console.log(2)
                    }
                    // $('.voice.ready:not(.playing) .progress-bar').css({
                    //     width: 0 + 'px'
                    // });
                },
                _end = function(self, status) {
                    var config = self.config,
                        audio = config.audio,
                        $container = config.container,
                        $curtime = config.curtime, //时间计时
                        duration = audio.duration,
                        $progresser = config.progresser, //进度按钮
                        $progressBar = $container.find('.progress-bar'), //进度条
                        $progressBox = $container.find('.progress-box'),
                        progressBoxW = $progressBox.width();

                    $progresser.css({
                        left: 0
                    })
                    $progressBar.css({
                        width: 0
                    });

                    self.config.status = status || 'ready'; //恢复就绪状态

                    $container[0].className = 'audio-box ready'; //初始化类

                    $curtime.text('00:00'); //写下时间
                },
                _play = function(self) {
                    var config = self.config,
                        audio = config.audio,
                        $container = config.container,
                        $progresser = config.progresser; //进度条

                    audio.play();
                    _setCount(self);

                    self.config.status = 'playing'; //正在播放

                    $container.removeClass('pause loading ready').addClass('playing');

                },
                _loading = function(self) { //加载audio元素
                    var audio,
                        config = self.config,
                        $container = config.container,
                        $progresser = config.progresser,
                        $curtime = config.curtime,
                        $duration = config.duration,
                        id = 'audio-' + config.container.attr('id'),
                        src = self.config.audioSrc;

                    if (!self.config.audio) { //已经没有audio节点
                        audio = document.createElement("audio");
                        audio.id = id;
                        audio.src = src;
                        $container.append(audio);
                        self.config.audio = audio;

                        audio.addEventListener("canplay", function() { //当浏览器已加载音频/视频的元数据时
                            self.config.status = 'ready'; //准备就绪
                            // $duration.text(formatSeconds(audio.duration));
                            _play(self); //开始播放
                        }, false);

                    } else {
                        audio = self.config.audio;
                    }


                    self.config.status = 'loading'; //正在加载

                    //开始下载 录音
                    audio.load();
                    $container.removeClass('pending').addClass('loading');

                    (function(_self, _audio) {
                        setTimeout(function() {
                            if (_self.config.status == 'loading') {

                                self.config.status = null; //取消加载状态
                                $container.removeClass('loading');
                                sunny.ui.toast('加载失败，请确认网络状态~');
                            }
                        }, 5000);
                    })(self, audio)

                },
                _pause = function(self) {
                    var config = self.config,
                        audio = config.audio,
                        $container = config.container;

                    audio.pause(); //暂停
                    self.config.status = 'pause'; //正在播放
                    $container.removeClass('loading playing').addClass('pause');
                };

            var audioFn = function(config) {}
            audioFn.prototype.config = {
                container: '',
                progresser: '',
                controler: '',
                status: null, //ready playing pause
                id: 0,
                _setInterVal: null
            };
            audioFn.prototype.end = function() {
                var self = this,
                    audio = self.config.audio;

                if (audio) {

                    // audio.currentTime = 0;
                    audio.pause();

                    self.config.status = 'end'; //恢复就绪状态
                    _end(self, 'end');

                } else {
                    return;
                }

            };
            // audioFn.prototype.reInit = function() {
            //      self.config.status = 'ready'; //恢复就绪状态

            //     // _pause(this);
            // };
            audioFn.prototype.pause = function() {
                _pause(this);
            };
            audioFn.prototype.init = function(config) {
                var self = this;

                self.config = config;
                // self.config.duration = config.container.data('timelength'); //存储时间
                self.config.audioSrc = config.container.data('url'); //存储播放地址
                self.config.curtime = config.container.find('.curtime'); //存放当前时间显示
                self.config.duration = config.container.find('.duration'); //存放总时间
                self.config.controler = config.container.find('.control-btn'); //获取激活播放按钮
                self.config.progresser = config.container.find('.progress-btn'); //获取进度按钮
                self.config.timeLength = config.container.data('timelength'); //存储播放时长


                var $progressBox = config.container.find('.progress-box'),
                    $progressBar = config.container.find('.progress-bar'),
                    move = {
                        startX: 0,
                        startY: 0,
                        x: 0,
                        y: 0,
                        curX: 0,
                        offsetLeft: 0
                    };

                $progressBox.on('touchstart', progressFn);
                $progressBox.on('touchmove', progressFn);
                $progressBox.on('touchend', progressFn);

                function progressFn(event) {

                    if (event.preventDefault) {
                        event.preventDefault();
                    } else {
                        event.returnValue = false;
                    }
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else {
                        event.cancelBubble = true;
                    }

                    var event = event || window.event;

                    switch (event.type) {
                        case "touchstart":

                            if (event.preventDefault) {
                                event.preventDefault();
                            } else {
                                event.returnValue = false;
                            }

                            var audio = config.audio;

                            move.offsetLeft = $progressBox.offset().left;
                            move.curLeft = self.config.progresser.offset().left;

                            move.startX = event.touches[0].pageX;
                            move.startY = event.touches[0].pageY;

                            if (audio) {
                                _pause(self);
                            }

                            break;
                        case "touchend":

                            var moveX = move.x * -1;
                            var progressW = $progressBox.width();
                            var audio = config.audio;
                            if (audio) {
                                var duration = audio.duration; //当前进度
                                audio.currentTime = Math.round((move.curX / progressW) * duration);
                                _play(self);
                            } else {
                                self.config.progresser.css('left', (0) + 'px');
                            }
                            break;
                        case "touchmove":
                            var audio = config.audio;
                            move.x = move.startX - event.touches[0].pageX;
                            move.y = move.startY - event.touches[0].pageY;
                            if (audio) {
                                var duration = audio.duration; //当前进度
                                var progressW = $progressBox.width();
                                move.curX = move.curLeft - move.offsetLeft + move.x * -1;

                                if (move.curX >= 0 && move.curX <= progressW) { //相对移动大于0 的时候
                                    self.config.progresser.css('left', (move.curX) + 'px');
                                    $progressBar.css('width', (move.curX) + 'px');

                                    self.config.curtime.text(formatSeconds((duration * (move.curX / progressW))));
                                }
                            }
                            break;
                    }
                };


                config.container.find('.status-btn').on('touchstart', function() { //暂停，播放
                    if (event.preventDefault) {
                        event.preventDefault();
                    } else {
                        event.returnValue = false;
                    }

                    if ($('.audio-box.playing')[0] != self.config.container[0]) {
                        var audioIndex = $('.audio-box').index($('.audio-box.playing'));
                        if (audioIndex >= 0) {
                            audioList[audioIndex].end();
                        }
                    }
                    if ($('.audio-box.pause')[0] != self.config.container[0]) {
                        var audioIndex = $('.audio-box').index($('.audio-box.pause'));
                        if (audioIndex >= 0) {
                            audioList[audioIndex].end();
                        }
                    }

                    var status = self.config.status;
                    if (status == 'playing') {
                        _pause(self)
                    } else if (status == 'ready' || status == 'pause') {
                        _play(self);
                    } else if (status == 'end') { //结束正在播放的另一个录音
                        self.config.audio.currentTime = 0;
                        _play(self);
                    }

                });

                self.config.controler.on('touchstart', function(event) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    } else {
                        event.returnValue = false;
                    }

                    if (self.config.audioSrc) {

                        var status = self.config.status;
                        if (!status) { //无任何状态，进行加载loading                                
                            _loading(self);
                        }
                    } else {

                    }
                });

                return this;
            };
            return audioFn;
        })();


        setTimeout(function() {
            $('.audio-box').each(function() {
                var $self = $(this);
                audioList[$('.audio-box').index($(this))] =
                    new AUDIO().init({ //初始化
                        container: $self
                    });
            });
        }, 500);

    });
})(window, sunny.$);