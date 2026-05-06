package com.vheart.chat.Service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vheart.chat.Mapper.SessionMapper;
import com.vheart.chat.pojo.Session;
import com.vheart.chat.Service.SessionService;

@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionMapper sessionMapper;

    @Override
    public List<Session> getSessionList(String userId) {
        return sessionMapper.findByUserId(userId);
    }

    @Override
    public void updateSession(String sessionId, String lastMessage) {
        sessionMapper.updateLastMessage(sessionId, lastMessage);
    }
}
