$(function () {
    var form = layui.form
    var layer = layui.layer

    // 自定义验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6之间'
            }
        }
    })

    initUserInfo()
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败")
                }
                // console.log(res)
                form.val("formUserInfo", res.data)
            }
        })
    }

    // 用户信息充值按钮
    $('#btnReset').on('click', function(e){
        // 阻止表单默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 表单提交请求
    $('.layui-form').on('submit', function(e){
        // 阻止表单默认提交事件
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url:'/my/userinfo',
            data: $(this).serialize(), //快速提取表单内容
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新信息失败')
                }
                layer.msg('更新信息成功')
                //调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})