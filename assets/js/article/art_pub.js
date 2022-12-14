$(function () {

    var layer = layui.layer
    var form = layui.form
    // 请求获取文章类别

    // 初始化富文本编辑器
    initEditor()

    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败')
                }

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
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

    // 选择封面按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile改变事件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        //将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                
                // ajax数据请求
                publishArticle(fd)
            })

            
    })

    // 发布文章方法
    function publishArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果想服务器提交ForData格式的数据必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})