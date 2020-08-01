$(function() {
    // 1.获取用户信息
    getUserInfo();
    // 3.退出登录
    // 引入layer
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        // 3.1提示
        layer.confirm('确认是否退出?', { icon: 3, title: '提示' }, function(index) {
            //关闭提示框,layui自带
            layer.close(index);
            //3.2删除本地token
            localStorage.removeItem('token')
                //3.3页面跳转
            location.href = '/login.html'
        });
    })

})


//封装获取用户信息函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //jq中的ajax,专门用于设置请求头信息的属性
        //注意:headers属性区分大小写
        // headers: {
        //     Authorization: localStorage.getItem('token')||""
        // },
        success: function(res) {
            // console.log(res);
            // 1.判断用户是否查询成功
            if (res.status) {
                return layui.layer.msg(res.message)
            }
            // 2.调用用户渲染函数
            renderUser(res.data)
        }
    })
}

//2.封装用户渲染函数
function renderUser(user) {
    // 1.渲染用户名
    var uname = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;', +uname);
    // 2.渲染用户头像
    //判断用户头像信息
    if (user.user_pic) {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').show().html(uname[0].toUpperCase())
    }
}