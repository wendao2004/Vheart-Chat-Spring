package com.vheart.chat.Service;

import java.util.List;

import com.vheart.chat.pojo.Friend;
import com.vheart.chat.pojo.FriendRequest;
import com.vheart.chat.pojo.User;

public interface FriendService {
    List<User> searchUsers(String keyword, String excludeUsername);
    void sendFriendRequest(String fromUsername, String toUsername, String message);
    List<FriendRequest> getFriendRequestList(String toUsername);
    void handleFriendRequest(Long requestId, String status);
    List<Friend> getFriendList(String userId);
    void updateFriendRemark(Long friendId, String remark);
    void updateFriendRemarkByUsername(String userId, String friendUsername, String remark);
    Friend findFriendByUsername(String userId, String friendUsername);
}
