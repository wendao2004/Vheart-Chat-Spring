package com.vheart.chat.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.vheart.chat.pojo.FriendRequest;

@Mapper
public interface FriendRequestMapper {

    @Insert("INSERT INTO chat_friend_request(from_username, to_username, message, status) " +
            "VALUES(#{fromUsername}, #{toUsername}, #{message}, #{status})")
    void insert(FriendRequest request);

    @Select("SELECT * FROM chat_friend_request WHERE to_username = #{toUsername} AND status = #{status} ORDER BY create_time DESC")
    List<FriendRequest> findByToUsernameAndStatus(@Param("toUsername") String toUsername, @Param("status") String status);

    @Select("SELECT * FROM chat_friend_request WHERE id = #{id}")
    FriendRequest findById(@Param("id") Long id);

    @Update("UPDATE chat_friend_request SET status = #{status} WHERE id = #{id}")
    void updateStatus(@Param("id") Long id, @Param("status") String status);

    @Select("SELECT COUNT(*) FROM chat_friend_request WHERE from_username = #{fromUsername} AND to_username = #{toUsername} AND status = 'pending'")
    int countPending(@Param("fromUsername") String fromUsername, @Param("toUsername") String toUsername);
}
