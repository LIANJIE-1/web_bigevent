$(function() {
    // 1.文章分类列表渲染
    initArticleList()


    // 2.添加文章分类
    $('#btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    // 3.文章分类添加
    var indexAdd = null;
    $('body').on('submit', '#boxAddCate', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) { return layer.msg(res.message); }
                //重新渲染文章分类列表
                initArticleList();
                layer.msg(res.message);
                //关闭添加区域
                layer.close(indexAdd)
            }
        })
    })

    // 4.通过代理的形式,为btn-edit按钮绑定点击事件
    var indexEdit = null;
    var form = layui.form
    $('tbody').on('click', '#btn-edit', function() {
        //弹出一个修改文章分类信息的层 4.1展示
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        // 4.2渲染 根据按钮 Id 获取文章分类数据
        var id = $(this).attr('data-id');
        // alert(id)
        //发起ajax根据 Id 获取文章分类数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-deit', res.data)
            }
        })

    })

    // 5.通过代理的形式,为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //提示修改成功
                layer.msg(res.message);
                //关闭提示框
                layer.close(indexEdit);
                // 重新渲染列表
                initArticleList()
            }
        })
    })

    // 6.通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            //提示用户是否要删除
        layer.confirm('确定要删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    layer.close(index);
                    initArticleList()
                }
            })
        });
    });
    //文章分类列表渲染函数封装
    function initArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                //模板引擎(传对象,用数组)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


})