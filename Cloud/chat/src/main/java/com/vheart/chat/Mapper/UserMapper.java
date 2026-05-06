package com.vheart.chat.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.vheart.chat.pojo.User;

@Mapper
public interface UserMapper {

    // 根据用户名查询用户
    @Select("select * from user where username=#{username}")
    User findByUserName(String username);

    @Select("select * from user where username like CONCAT('%',#{keyword},'%') and username != #{excludeUsername} limit 10")
    List<User> searchUsersLike(String keyword, String excludeUsername);

    // 添加用户
    @Insert("insert into user(id,username,password,create_time,update_time) values(#{username},#{username},#{password},NOW(),NOW())")
    void add(@Param("username") String username, @Param("password") String password);

}
