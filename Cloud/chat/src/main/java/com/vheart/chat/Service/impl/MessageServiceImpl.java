package com.vheart.chat.Service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vheart.chat.Mapper.MessageMapper;
import com.vheart.chat.Mapper.SessionMapper;
import com.vheart.chat.pojo.Message;
import com.vheart.chat.pojo.Session;
import com.vheart.chat.Service.MessageService;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private SessionMapper sessionMapper;

    @Override
    public Message sendMessage(String fromUsername, String toUsername, String content, String type) {
        Message message = new Message();
        message.setFromUsername(fromUsername);
        message.setToUsername(toUsername);
        message.setContent(content);
        message.setType(type != null ? type : "text");
        message.setIsRead(false);
        messageMapper.insert(message);

        String sessionId = generateSessionId(fromUsername, toUsername);

        updateSession(fromUsername, toUsername, sessionId, content);
        updateSession(toUsername, fromUsername, sessionId, content);

        return message;
    }

    private void updateSession(String userId, String targetUsername, String sessionId, String lastMessage) {
        Session session = sessionMapper.findBySessionId(sessionId);
        if (session != null) {
            if (session.getUserId().equals(userId)) {
                sessionMapper.updateLastMessage(sessionId, lastMessage);
            }
        } else {
            Session newSession = new Session();
            newSession.setSessionId(sessionId);
            newSession.setUserId(userId);
            newSession.setTargetUsername(targetUsername);
            newSession.setLastMessage(lastMessage);
            newSession.setUnreadCount(0);
            sessionMapper.insert(newSession);
        }
    }

    @Override
    public List<Message> getHistory(String username1, String username2, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        return messageMapper.findHistory(username1, username2, offset, pageSize);
    }

    @Override
    public void markRead(String fromUsername, String toUsername) {
        messageMapper.markRead(fromUsername, toUsername);
    }

    private String generateSessionId(String username1, String username2) {
        if (username1.compareTo(username2) < 0) {
            return username1 + "_" + username2;
        } else {
            return username2 + "_" + username1;
        }
    }
}
