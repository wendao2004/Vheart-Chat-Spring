package com.vheart.chat.pojo;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

// 用户实体类
@Data
public class User {
    // ID（与username相同）
    @NotNull
    private String id;

    // 用户名
    private String username;

    // 密码
    private String password;

    // 呢称
    @NotEmpty
    @Pattern(regexp = "^\\S{1,10}$", message = "昵称必须是1-10个非空字符")
    private String nickname;

    // 邮箱
    @NotEmpty
    @Email
    private String email;

    // 头像
    private String userPic;

    // 创建时间
    private LocalDateTime createTime;

    // 更新时间
    private LocalDateTime updateTime;
}
