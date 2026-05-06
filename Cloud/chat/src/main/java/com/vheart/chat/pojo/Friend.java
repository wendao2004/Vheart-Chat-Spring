package com.vheart.chat.pojo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Friend {
    private Long id;
    private String userId;
    private String friendUsername;
    private String friendNickname;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
