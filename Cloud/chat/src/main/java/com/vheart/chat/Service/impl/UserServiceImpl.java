package com.vheart.chat.Service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vheart.chat.Mapper.UserMapper;
import com.vheart.chat.Service.UserService;
import com.vheart.chat.pojo.User;
import com.vheart.chat.utils.JwtUtil;
import com.vheart.chat.utils.Md5Util;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    // 实现根据用户名查找用户接口
    @Override
    public User findByUsername(String username) {
        User u = userMapper.findByUserName(username);
        return u;
    }

    // 实现注册用户接口
    @Override
    public void register(String username, String password) {
        // 加密
        String md5String = Md5Util.encrypt(password);
        // 添加用户
        userMapper.add(username, md5String);
    }

    // 实现登录接口
    @Override
    public String login(String username, String password) {
        User existUser = findByUsername(username);
        if (existUser == null) {
            return "用户名不存在";
        }
        // 密码校验
        String inputPasswordEncoded = Md5Util.encrypt(password);
        if (!existUser.getPassword().equals(inputPasswordEncoded)) {
            return "密码错误";
        } else if (existUser.getPassword().equals(inputPasswordEncoded)) {
            Map<String, Object> claims = new HashMap<>(); // 创建一个HashMap来存储JWT的声明（claims）
            claims.put("id", existUser.getId()); // 向claims中添加用户ID信息
            claims.put("username", existUser.getUsername()); // 向claims中添加用户名信息
            String token = JwtUtil.genToken(claims); // 使用JwtUtil工具类生成token，传入claims作为参数
            return token; // 返回成功生成的token信息
        }
        return inputPasswordEncoded;
    }

}
