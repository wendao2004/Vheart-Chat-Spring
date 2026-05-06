package com.vheart.chat.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.vheart.chat.pojo.Friend;

@Mapper
public interface FriendMapper {

    @Insert("INSERT INTO chat_friend(user_id, friend_username, friend_nickname) " +
            "VALUES(#{userId}, #{friendUsername}, #{friendNickname})")
    void insert(Friend friend);

    @Select("SELECT * FROM chat_friend WHERE user_id = #{userId}")
    List<Friend> findByUserId(@Param("userId") String userId);

    @Select("SELECT * FROM chat_friend WHERE user_id = #{userId} AND friend_username = #{friendUsername}")
    Friend findByUserIdAndFriendUsername(@Param("userId") String userId, @Param("friendUsername") String friendUsername);

    @Update("UPDATE chat_friend SET friend_nickname = #{friendNickname} WHERE id = #{id}")
    void updateNickname(@Param("id") Long id, @Param("friendNickname") String friendNickname);

    @Update("UPDATE chat_friend SET friend_nickname = #{friendNickname} WHERE user_id = #{userId} AND friend_username = #{friendUsername}")
    void updateNicknameByUsername(@Param("userId") String userId, @Param("friendUsername") String friendUsername, @Param("friendNickname") String friendNickname);

    @Select("SELECT COUNT(*) FROM chat_friend WHERE user_id = #{userId} AND friend_username = #{friendUsername}")
    int countByUserIdAndFriendUsername(@Param("userId") String userId, @Param("friendUsername") String friendUsername);
}
