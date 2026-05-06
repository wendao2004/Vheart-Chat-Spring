package com.vheart.chat.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vheart.chat.pojo.Message;
import com.vheart.chat.pojo.Result;
import com.vheart.chat.Service.MessageService;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public Result<Message> send(@RequestBody Map<String, String> params) {
        try {
            String fromUsername = params.get("fromUsername");
            String toUsername = params.get("toUsername");
            String content = params.get("content");
            String type = params.get("type");

            if (fromUsername == null || toUsername == null || content == null) {
                return Result.fail("参数不完整");
            }

            Message message = messageService.sendMessage(fromUsername, toUsername, content, type);
            return Result.success(message);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/history")
    public Result<List<Message>> history(@RequestBody Map<String, Object> params) {
        try {
            String username1 = (String) params.get("username1");
            String username2 = (String) params.get("username2");
            int page = params.get("page") != null ? (Integer) params.get("page") : 1;
            int pageSize = params.get("pageSize") != null ? (Integer) params.get("pageSize") : 50;

            List<Message> messages = messageService.getHistory(username1, username2, page, pageSize);
            return Result.success(messages);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/read")
    public Result<Void> markRead(@RequestBody Map<String, String> params) {
        try {
            String fromUsername = params.get("fromUsername");
            String toUsername = params.get("toUsername");
            messageService.markRead(fromUsername, toUsername);
            return Result.success();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}
