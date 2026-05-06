package com.vheart.chat.Service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vheart.chat.Mapper.FriendMapper;
import com.vheart.chat.Mapper.FriendRequestMapper;
import com.vheart.chat.Mapper.UserMapper;
import com.vheart.chat.pojo.Friend;
import com.vheart.chat.pojo.FriendRequest;
import com.vheart.chat.pojo.User;
import com.vheart.chat.Service.FriendService;

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private FriendMapper friendMapper;

    @Autowired
    private FriendRequestMapper friendRequestMapper;

    @Override
    public List<User> searchUsers(String keyword, String excludeUsername) {
        List<User> allUsers = new ArrayList<>();
        User exactUser = userMapper.findByUserName(keyword);
        if (exactUser != null && !exactUser.getUsername().equals(excludeUsername)) {
            allUsers.add(exactUser);
        }
        List<User> likeUsers = userMapper.searchUsersLike(keyword, excludeUsername);
        if (likeUsers != null) {
            for (User user : likeUsers) {
                if (!user.getUsername().equals(excludeUsername)) {
                    boolean exists = allUsers.stream().anyMatch(u -> u.getUsername().equals(user.getUsername()));
                    if (!exists) {
                        allUsers.add(user);
                    }
                }
            }
        }
        return allUsers;
    }

    @Override
    @Transactional
    public void sendFriendRequest(String fromUsername, String toUsername, String message) {
        if (friendMapper.countByUserIdAndFriendUsername(fromUsername, toUsername) > 0) {
            throw new RuntimeException("已经是好友关系");
        }
        if (friendMapper.countByUserIdAndFriendUsername(toUsername, fromUsername) > 0) {
            throw new RuntimeException("已经是好友关系");
        }
        if (friendRequestMapper.countPending(fromUsername, toUsername) > 0) {
            throw new RuntimeException("已发送过好友申请");
        }

        FriendRequest request = new FriendRequest();
        request.setFromUsername(fromUsername);
        request.setToUsername(toUsername);
        request.setMessage(message);
        request.setStatus("pending");
        friendRequestMapper.insert(request);
    }

    @Override
    public List<FriendRequest> getFriendRequestList(String toUsername) {
        return friendRequestMapper.findByToUsernameAndStatus(toUsername, "pending");
    }

    @Override
    @Transactional
    public void handleFriendRequest(Long requestId, String status) {
        FriendRequest request = friendRequestMapper.findById(requestId);
        if (request == null) {
            throw new RuntimeException("申请不存在");
        }

        friendRequestMapper.updateStatus(requestId, status);

        if ("accepted".equals(status)) {
            Friend friend1 = new Friend();
            friend1.setUserId(request.getFromUsername());
            friend1.setFriendUsername(request.getToUsername());
            friend1.setFriendNickname(request.getToUsername());
            friendMapper.insert(friend1);

            Friend friend2 = new Friend();
            friend2.setUserId(request.getToUsername());
            friend2.setFriendUsername(request.getFromUsername());
            friend2.setFriendNickname(request.getFromUsername());
            friendMapper.insert(friend2);
        }
    }

    @Override
    public List<Friend> getFriendList(String userId) {
        return friendMapper.findByUserId(userId);
    }

    @Override
    public void updateFriendRemark(Long friendId, String remark) {
        friendMapper.updateNickname(friendId, remark);
    }

    @Override
    public void updateFriendRemarkByUsername(String userId, String friendUsername, String remark) {
        friendMapper.updateNicknameByUsername(userId, friendUsername, remark);
    }

    @Override
    public Friend findFriendByUsername(String userId, String friendUsername) {
        return friendMapper.findByUserIdAndFriendUsername(userId, friendUsername);
    }
}
