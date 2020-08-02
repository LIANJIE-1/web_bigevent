$(function() {
    // 1.获取layui.form
    var form = layui.form;

    // 2.自定义form校验规则
    form.verify({
        //密码长度
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //新密码不能与旧密码相同
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val())
                return '新旧密码不相同'
        },
        //新密码二次校验
        rePwd: function(value) {
            if (value != $('[name=newPwd]').val())
                return '两次输入的密码不一致!'
        }
    })

    // 3.修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('恭喜你,密码重置成功!');
                console.log(this);
                //重置表单
                $('.layui-form').get(0).reset()
            }
        })
    })
})