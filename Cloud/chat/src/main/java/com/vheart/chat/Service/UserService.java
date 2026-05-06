package com.vheart.chat.Service;

import com.vheart.chat.pojo.User;

public interface UserService {

    // 根据用户名查询用户
    User findByUsername(String username);

    // 注册
    void register(String username, String password);

    // 登录
    String login(String username, String password);

}
