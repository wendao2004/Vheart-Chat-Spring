package com.vheart.chat.Service;

import java.util.List;

import com.vheart.chat.pojo.Message;

public interface MessageService {
    Message sendMessage(String fromUsername, String toUsername, String content, String type);
    List<Message> getHistory(String username1, String username2, int page, int pageSize);
    void markRead(String fromUsername, String toUsername);
}
