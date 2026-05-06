package com.vheart.chat.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vheart.chat.Service.UserService;
import com.vheart.chat.pojo.Result;
import com.vheart.chat.pojo.User;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 注册
    @PostMapping("/register")
    public Result<Void> register(@RequestBody User user) {
        User u = userService.findByUsername(user.getUsername());
        if (u == null) {
            userService.register(user.getUsername(), user.getPassword());
            return Result.success();
        } else {
            return Result.fail("用户名已存在");
        }
    }

    // 登录
    @PostMapping("/login")
    public Result<String> login(@RequestBody User user) {
        // 调用登录方法：成功=Token，失败=错误提示
        String result = userService.login(user.getUsername(), user.getPassword());
        if (result.equals("用户名不存在") || result.equals("密码错误")) {
            return Result.fail(result);
        } else {
            // 成功：把Token返回给前端
            return Result.success(result);
        }
    }
}
