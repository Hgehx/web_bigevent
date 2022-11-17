$(function () {
    // 点击注册文字
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击登录文字
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 lay里获取对象
    var form = layui.form
    var layer = layui.layer

    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 获取首次密码的值和确认密码的值
            // 不相等时提示信息
            //获取首次密码元素的值
            const pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不相同'
            }
        }
    });

    
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录');
                // 模拟人点击的行为
                $('#link_login').click()
            }
        )
    })

    // 监听注册表单的提交事件
    $('#form_login').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // 登录成功后把token值保存在localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到主页
                location.href = '/index.html'
            }
        })
    })
})

