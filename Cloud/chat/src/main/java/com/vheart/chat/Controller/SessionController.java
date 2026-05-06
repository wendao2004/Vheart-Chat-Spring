package com.vheart.chat.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vheart.chat.pojo.Result;
import com.vheart.chat.pojo.Session;
import com.vheart.chat.Service.SessionService;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping("/list")
    public Result<List<Session>> getSessionList(@RequestBody java.util.Map<String, String> params) {
        try {
            String userId = params.get("userId");
            if (userId == null) {
                return Result.fail("用户ID不能为空");
            }
            List<Session> sessions = sessionService.getSessionList(userId);
            return Result.success(sessions);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/update")
    public Result<Void> updateSession(@RequestBody java.util.Map<String, String> params) {
        try {
            String sessionId = params.get("sessionId");
            String lastMessage = params.get("lastMessage");
            if (sessionId == null) {
                return Result.fail("会话ID不能为空");
            }
            sessionService.updateSession(sessionId, lastMessage);
            return Result.success();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}
