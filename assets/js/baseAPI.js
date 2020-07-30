//设置路径(测试)
var baseURL = 'http://ajax.frontend.itheima.net';
// 设置路径(生产)
// var baseURL = 'http://ajax.frontend.itheima.net'
// /拦截/过滤 每一次ajax的请求,配置需要的根路径
$.ajaxPrefilter(function(options) {
    options.url = baseURL + options.url;
})