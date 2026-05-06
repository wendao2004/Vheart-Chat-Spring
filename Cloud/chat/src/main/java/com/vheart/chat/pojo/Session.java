package com.vheart.chat.pojo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Session {
    private Long id;
    private String sessionId;
    private String userId;
    private String targetUsername;
    private String lastMessage;
    private Integer unreadCount;
    private LocalDateTime updateTime;
}
