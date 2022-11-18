$(function () {
    getUserInfo()

    // 引入layui对象
    var layer = layui.layer

    // 实现后台页面退出功能
    $('#btnLogout').on('click', function () {
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something

            // 删除localStorage的token值
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = './login.html'
            // 关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // baseAPI统一编辑请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用renderAvater渲染头像
            renderAvater(res.data)
        },

        // // 不管成功还是失败，都调用complete回调函数
        // complete: function (res) {
        //     // console.log("执行了complete函数")
        //     // console.log(res)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 删除token值
        //         localStorage.removeItem('token')
        //         // 跳转到登录界面
        //         location.href = './login.html'
        //     }
        // }
    })
}

// 获取用户头像
function renderAvater(user) {
    var name = user.username || user.nickname
    // 设置文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染头像
    if (user.user_pic !== null) {
        // 图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 文本头像
        $('.layui-nav-img').hide()
        // 获取名字第一个字符
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}