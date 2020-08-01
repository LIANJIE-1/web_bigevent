//设置路径(测试)
var baseURL = 'http://ajax.frontend.itheima.net';
// 设置路径(生产)
// var baseURL = 'http://ajax.frontend.itheima.net'
// /拦截/过滤 每一次ajax的请求,配置需要的根路径
$.ajaxPrefilter(function(options) {
    options.url = baseURL + options.url;

    // 判断以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function(res) {
        console.log(res);
        var data = res.responseJSON;
        console.log(data);
        if (data.status == 1 && data.message == "身份认证失败！") {
            // 1.删除token
            localStorage.removeItem('token');
            // 2. 页面跳转
            location.href = '/login.html'
        }
    }

})