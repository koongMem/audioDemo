/**
 * 
 * 项目共用的JS
 * 主要有API、一些常用的针对本项目的方法
 **/
window._PROJECT = {
    // domain: 'http://' + window.location.host + '/olcourses',
    domain: 'http://' + window.location.host,
    baseHost: window.location.host
};

//API
var API = {
    indexCourse: "/Course/index.action" //主页 banner + 课程包
    ,getMyCourses: "/Course/getMyCourses.action" //我的课程列表
    ,myCouponList: "/CJ/V1/Coupon/myList.action" //我的优惠券
    ,getAllCourse: "/Course/getAllCourse.action" //获取全部课程
    ,getCourseByCategoryId: "/Course/getCourseByCategoryId.action" //根据分类获课程列表
    ,getCourseDetail: "/Course/getCourseDetail.action" //获取课程详情
    ,getListByCourseIdPage: "/Evaluate/getCommentByCourseIdPage.action" //获取课程评价列表
    ,getDetailByCourseId: "/Sectioin/getDetailByCourseId.action" //获取章节详情
    ,getByCourseId: "/Sectioin/getByCourseId.action" //获取课程章节列表
    ,addLike: "/Like/addLike.action" //增加喜欢数
    ,preCreateOrder: "/CJ/V1/Order/preCreate.action" //预订单生成
    ,createOrder: "/CJ/V1/Order/create.action" //订单生成
    ,checkPayStatus: "/CJ/V1/Order/checkPayStatus.action" //检查订单
    ,isEvaluateOfComment: "/Evaluate/isEvaluateOfComment.action" ///章节是否评价
    ,getDiscussByCourseIdPage: "/Evaluate/getDiscussByCourseIdPage.action" //获取课程章节评价列表
    ,addEvaluate: "/Evaluate/addEvaluate.action" //增加评价
    ,getCoursesByRecommend: "/Course/getCoursesByRecommend.action" //获取在线课程推荐列表
    ,finshCourse: "/Course/finshCourse.action" //课程结束
    ,getSellPriceX: "/CJ/V1/Order/getSellPriceX.action" //优惠券价格
};

for (var apiKey in API) {
    API[apiKey] = window._PROJECT.domain + API[apiKey];
}

// (function(){
//     window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
//         var info = "错误信息：" + errorMessage + "</br>" +
//                 "出错文件：" + scriptURI + "</br> " +
//                 "出错行号：" + lineNumber + "</br>" +
//                 "出错列号：" + columnNumber + "</br>" +
//                 "错误详情：" + errorObj + "</br></br>";
//         alert(info)
//     }
// })();
/**
 * ga统计
 * @return {[type]} [description]
 */
(function() {
    sunny.helper.ggTongJi('UA-69656880-8');
})();

/**
 * 全局template
 */
(function() {
    window.template = sunny.view.template;
})();

sunny.helper.extend(sunny.helper, {
    googleGA: function(eventCategory, eventAction, eventLabel) {
        if (eventCategory == '分享渠道进入') {
            eventAction = (sunny.helper.browser.bb ? '表表' : Super.helper.browser.weixin ? '微信' : Super.helper.browser.weibo ? '微博' : '其他');
        }
        if ("function" == typeof ga) {
            ga('send', 'event', {
                eventCategory: eventCategory, //通常是用户与之互动的对象（例如 'Video'）
                eventAction: eventAction, //    互动类型（例如 'play'）
                eventLabel: eventLabel, //用于对事件进行分类（例如 'Fall Campaign'）
                transport: 'beacon' //如果用户点击了链接或向域外提交了表单，则除非您将所发生的情况明确告知 Google Analytics（分析），否则该操作不会被捕获。
            });
        }

    },
    setIssueTime: function(issueTime, format) {
        var format = format || 'yyyy/mm/dd';
        var date = new Date(issueTime * 1),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        month = (month < 10 ? '0' + month : month);
        day = (day < 10 ? '0' + day : day);
        minute = (minute < 10 ? '0' + minute : minute);
        hour = (hour < 10 ? '0' + hour : hour);
        second = (second < 10 ? '0' + second : second);
        //  timestampLong[timestampLong.length] = issueTime;
        // return (month + '/' + day);
        return format.replace('yyyy', year).replace('mm', month).replace('dd', day).replace('hh', hour).replace('MM', minute).replace('ss', second);
    },
    getDataFromJson: function(json) {
        var result;
        if (!json) {
            return {};
        }
        //          json = json.replace(new RegExp("\"","gm"),"'");
        if (typeof(json) == "string") {
            if (json == "") {
                return {};
            }
            try {
                try {
                    return eval("(" + json + ")");
                } catch (err) {
                    return JSON.parse(json);
                }
            } catch (err) {

                if (json.indexOf('<form name="f" action="/login" method="POST">') != '-1') {
                    top.location.href = "/index.jsp";
                } else {
                    txt = "此页面存在一个错误。\n\n"
                    txt += "错误描述: " + err.message + "\n\n"
                    txt += "点击OK继续。\n\n"
                        // commonJS.consoleTip(txt);
                    result = eval("[" + json + "]");
                    return result[0];
                }
            }
        } else {
            return json;
        }
    },
    /**
     * 去除数据提交的空格
     */
    trim: function(value) {
        return value.replace(/(^\s*)|(\s*$)/g, '');
    },
});
sunny.$.ajaxSettings.timeout = 15000;

sunny.helper.extend(sunny.helper, {
    login: (function() { //pc端口
        var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        if (sunny.helper.browser.bb) { //表表
            return function(callback) {
                var userInfo;
                if (jsuper && jsuper.bbVersion !== "0") {
                    setTimeout(function(){
                        jsuper.store({
                            success: function(data) {
                                if (!data.superClass) { //首页无数据
                                    window.location.href = 'guide.html';
                                }
                            }
                        });
                    }, 500);
                    jsuper.config({
                        ciphertext: '95f1a701018006747e4e5734311cfa3c',
                        //64b138b606dc199e16e48480fb326947
                        //192.168.0.36--2f234e371fba2bb3acd3681c99600950 
                        //http://a.super.cn/olcourses/--8e1586fcae9fb7a3c0488ca57a8bd611
                        //http://112.124.57.135/ 85f3559e72c36ce503aa1b86adcdda3a
                        success: function() {
                            jsuper.userInfo({
                                success: function(data) {
                                    // 针对索引 1 设置自定义维度值。
                                    // alert(JSON.stringify(data));
                                    ga('set', {
                                        'dimension1': (data.gender == 0 ? '女' : '男'),
                                        'dimension2': data.schoolName,
                                        'dimension3': '20' + data.grade,
                                        'dimension4': data.academyName,
                                        'dimension5': '表表'
                                    });
                                    // 将自定义维度值与网页浏览匹配一起发送。
                                    ga('send', 'pageview');

                                    userInfo = data;
                                    identity = data.identity;
                                    callback(identity, 1, userInfo); //1超表，2微信，3微博，4其他  getVoteUserType
                                }
                            });
                        },
                        fail: function() {
                            alert('登录失败，请稍后再试。');
                        }
                    });
                } else {
                    alert('表表WebView:无法登录');
                }
            }
        } else { //不在表表内
            setTimeout(function() {
                ga('set', {
                    // 'dimension1': (data.gender == 0 ? '女' : '男'),
                    // 'dimension2': data.schoolName,
                    // 'dimension3': '20' + data.grade,
                    // 'dimension4': data.academyName,
                    'dimension5': (sunny.helper.browser.bb ? '表表' : Super.helper.browser.weixin ? '微信' : Super.helper.browser.weibo ? '微博' : '其他')
                });
                // 将自定义维度值与网页浏览匹配一起发送。
                ga('send', 'pageview');
            }, 500);

            if (window.isIndex) {//首页
                sunny.$('#class-tab').addClass('no-footer');
                sunny.$('#footer').remove();
            }
            return function(callback) {

                callback('', 1) //测试用 //38D98D45BF5FD7408CFF368AA4088595 //7FAB3FEA266A73CB2E8BAB7B03EC57E7
            }
        }
    })()
});

(function(G, $) {
    $('body').on('touchstart', '[class*="btn"][data-modal="btn"]', function() {
        var $self = $(this);

        $self.addClass('btn-active');
    }).on('touchend', '[class*="btn"][data-modal="btn"]', function() {
        var $self = $(this);

        $self.removeClass('btn-active');
    });

})(window, sunny.$);