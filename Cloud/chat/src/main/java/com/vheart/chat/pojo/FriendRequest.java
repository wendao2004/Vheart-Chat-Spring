package com.vheart.chat.pojo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FriendRequest {
    private Long id;
    private String fromUsername;
    private String toUsername;
    private String message;
    private String status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
