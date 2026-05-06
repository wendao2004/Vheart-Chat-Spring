package com.vheart.chat.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vheart.chat.pojo.Friend;
import com.vheart.chat.pojo.FriendRequest;
import com.vheart.chat.pojo.Result;
import com.vheart.chat.pojo.User;
import com.vheart.chat.Service.FriendService;

@RestController
@RequestMapping("/friend")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @PostMapping("/search")
    public Result<List<User>> search(@RequestBody java.util.Map<String, String> params) {
        try {
            String keyword = params.get("keyword");
            String excludeUsername = params.get("excludeUsername");
            List<User> users = friendService.searchUsers(keyword, excludeUsername);
            return Result.success(users);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/apply")
    public Result<Void> apply(@RequestBody java.util.Map<String, String> params) {
        try {
            String fromUsername = params.get("fromUsername");
            String toUsername = params.get("toUsername");
            String message = params.get("message");
            friendService.sendFriendRequest(fromUsername, toUsername, message);
            return Result.success();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/applyList")
    public Result<List<FriendRequest>> applyList(@RequestBody java.util.Map<String, String> params) {
        try {
            String toUsername = params.get("toUsername");
            List<FriendRequest> requests = friendService.getFriendRequestList(toUsername);
            return Result.success(requests);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/agree")
    public Result<Void> agree(@RequestBody java.util.Map<String, Object> params) {
        try {
            Long requestId = Long.valueOf(params.get("requestId").toString());
            friendService.handleFriendRequest(requestId, "accepted");
            return Result.success();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/refuse")
    public Result<Void> refuse(@RequestBody java.util.Map<String, Object> params) {
        try {
            Long requestId = Long.valueOf(params.get("requestId").toString());
            friendService.handleFriendRequest(requestId, "rejected");
            return Result.success();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/list")
    public Result<List<Friend>> list(@RequestBody java.util.Map<String, String> params) {
        try {
            String userId = params.get("userId");
            List<Friend> friends = friendService.getFriendList(userId);
            return Result.success(friends);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/updateRemark")
    public Result<Void> updateRemark(@RequestBody java.util.Map<String, String> params) {
        try {
            Long friendId = Long.valueOf(params.get("friendId"));
            String remark = params.get("remark");
            friendService.updateFriendRemark(friendId, remark);
            return Result.success();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/updateRemarkByUsername")
    public Result<Void> updateRemarkByUsername(@RequestBody java.util.Map<String, String> params) {
        try {
            String userId = params.get("userId");
            String friendUsername = params.get("friendUsername");
            String remark = params.get("remark");
            friendService.updateFriendRemarkByUsername(userId, friendUsername, remark);
            return Result.success();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @PostMapping("/findFriend")
    public Result<Friend> findFriend(@RequestBody java.util.Map<String, String> params) {
        try {
            String userId = params.get("userId");
            String friendUsername = params.get("friendUsername");
            Friend friend = friendService.findFriendByUsername(userId, friendUsername);
            return Result.success(friend);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}
