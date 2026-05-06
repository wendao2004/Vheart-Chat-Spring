package com.vheart.chat.pojo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Message {
    private Long id;
    private String fromUsername;
    private String toUsername;
    private String content;
    private String type;
    private Boolean isRead;
    private LocalDateTime createTime;
}
