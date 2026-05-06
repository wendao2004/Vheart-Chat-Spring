package com.vheart.chat.Service;

import java.util.List;

import com.vheart.chat.pojo.Session;

public interface SessionService {
    List<Session> getSessionList(String userId);
    void updateSession(String sessionId, String lastMessage);
}
