$(function() {

    // 3.1初始化富文本编辑器
    initEditor()

    // 3.2 初始化图片裁剪器
    var $image = $('#image')

    // 3.3 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.4 初始化裁剪区域
    $image.cropper(options);



    // 4.根据id获取文章的详细信息;
    var Id = location.search.split('=')[1]

    $.ajax({
        method: 'get',
        url: '/my/article/' + Id,
        success: function(res) {
            if (res.status != 0) {
                return layer.msg(res.message)
            }
            console.log(res);
            // 5.根据文章信息渲染页面;
            // 文章标题
            $('[name=title]').val(res.data.title);
            // 文章内容
            setTimeout(() => {
                tinyMCE.activeEditor.setContent(res.data.content)
            }, 1000);
            // 文章封面
            $('#image').attr('src', baseURL + res.data.cover_img);
            // 文章分类
            initCate(res.data.cate_id)

            //6.把文章Id隐藏渲染;
            $("[name=Id]").val(res.data.Id);
        }
    })




    // 5.1确定发布状态
    var state = '已发布';
    $('#btnSave2').on('click', function(e) {
        state = '草稿'
    });

    // 7.修改文章
    $('#form-edit').on('submit', function(e) {
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
                editArticle(fd)
            })
    })

    //定义一个发布文章的方法
    function editArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/edit',
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


    //渲染文章类别函数
    var form = layui.form;

    function initCate(cate_id) {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取分类数据失败!')
                }
                // 模板引擎，传递对象，使用的是属性；
                res.cate_id = cate_id;
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                //通过layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }
})