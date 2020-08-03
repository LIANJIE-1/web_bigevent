$(function() {
    // 1.渲染文章分类
    initCate();

    // 2.初始化富文本编辑器
    initEditor()


    //渲染文章类别函数
    var form = layui.form;

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取分类数据失败!')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                //通过layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }




    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //4.1为选择封面的按钮,绑定点击事件处理函数
    $('#btnChooseImg').on('click', function() {
        $('#coverFile').click()
    })

    //4.2监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        //获取文件的数组
        var file = e.target.files[0];
        // console.log(files);s
        //判断用户是否选择了文件

        if (!file) return;

        //根据文件,创建对应的url地址
        var newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 5.1确定发布状态
    var state = '已发布';
    $('#btnSave2').on('click', function(e) {
        state = '草稿'
    });

    // 5.2 添加文章
    $('#form-add').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append("state", state)
            // console.log(...fd);
            //base64是字符串
            //生成二进制图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                //6.ajax一定要写到回调函数里面,因为异步
                publishArticle(fd)
            })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //注意,如果向服务器提交FormData格式的数据,必须要加两个配置项
            contentType: false,
            processData: false,

            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                //发布文章后跳转到文章列表页面
                // location.herf = '/article/art_list.html'
                window.parent.document.getElementById('a2').click()
            }
        })
    }
})