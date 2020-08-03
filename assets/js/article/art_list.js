$(function() {
    //为art-template 定义时间过滤器
    template.defaults.imports.deteFormat = function(date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padzero(dt.getMonth() + 1)
        var d = padzero(dt.getDate())
        var hh = padzero(dt.getHours())
        var mm = padzero(dt.getMinutes())
        var ss = padzero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ":" + mm + ":" + ss
    }

    //补零函数
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }



    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义一个变量,存储分页参数
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的状态， 可选值有： 已发布、 草稿
    }


    // 1.渲染文章列表
    initTable();
    // 2.渲染文章类别
    initCate()

    //3.为筛选表单绑定sumbit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val();
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件,重新渲染表格的数据
        initTable()
    })

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                // layer.msg(res.message);
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                //渲染分页
                renderPage(res.total)

            }
        })

    }

    //渲染文章类别函数
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
    //定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // theme: '#155841',
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }


    //通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取到文章的id
        var id = $(this).attr('data-id');
        //询问用户是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message);

                    //1.当数据删除完成后,需要盘点当前这一页中,是否还有剩余的数据,通过获取当前页面删除按钮的数量是否为1,因为当为1的时候删除了,当前页面就没有数据了
                    //2.如果没有剩余数据,则让页码值-1,还需要判断是否只有第一页

                    $('.btn-delete').length === 1 && q.pagenum > 1 && q.pagenum--;

                    //再重新渲染文章列表
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})