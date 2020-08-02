$(function() {
    //1.定义校验规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.trim().length > 6) {
                return '昵称应该输入 1~6 位之间!'
            }
        }
    })

    // 2.初始化用户信息
    initUserInfo();

    function initUserInfo() {
        //发送ajax
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                //展示用户信息
                form.val("formUserInfo", res.data)
            }
        })

    }


    // 3.重置(只接受click事件绑定)
    $('#btnReset').on('click', function(e) {
        //取消浏览器默认重置操作行为(取消清空表单功能)
        e.preventDefault();
        //初始化用户信息
        initUserInfo()
    })


    // 4.提交用户修改
    $('.layui-form').on('submit', function(e) {
        //取消form表单的默认行为
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //刷新父框架里面的用户信息
                window.parent.getUserInfo()
            }
        })
    })
})