// 入口函数
$(function() {
    //1.点击按钮切换登录和注册部分页面
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 2.定义layui,表单验证规则
    var form = layui.form;
    // 利用form这对象,创建规则
    form.verify({
        //属性的值可以是数组,也可以是函数
        //密码校验规则
        pwd: [/^\S{6,12}$/, '密码为6-12位,不能包含空格!'],
        //确认密码校验规则
        repwd: function(value) {
            if ($('#reg-pwd').val() != value) {
                return '两次密码不一致'
            }
        }
    });


    // 3.注册功能
    // 引入layui里的layer提示框对象
    var layer = layui.layer;
    $('#form_reg').on('submit', function(e) {
        //阻止默认行为
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            // data: $('#form_reg').serialize(),
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function(res) {
                //注册失败校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //注册成功,提示
                layer.msg(res.message);
                //触动切换到登录页面的a链接
                $('#link_login').click();
                // 重置表单内容
                $('#form_reg')[0].reset()
            }
        })
    })


    // 4.登录
    $('#form_login').on('submit', function(e) {
        //阻止表单默认行为
        e.preventDefault();
        // console.log($("#form_login").serialize());
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                //登录失败校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //登录成功,提示
                layer.msg(res.message);
                //保存token
                localStorage.setItem('token', res.token);
                //页面跳转
                location.href = '/index.html'
            }
        })
    })
})