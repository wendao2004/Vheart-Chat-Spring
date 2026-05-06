package com.vheart.chat.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.vheart.chat.pojo.Session;

@Mapper
public interface SessionMapper {

    @Insert("INSERT INTO chat_session(session_id, user_id, target_username, last_message, unread_count) " +
            "VALUES(#{sessionId}, #{userId}, #{targetUsername}, #{lastMessage}, #{unreadCount})")
    void insert(Session session);

    @Select("SELECT * FROM chat_session WHERE user_id = #{userId} ORDER BY update_time DESC")
    List<Session> findByUserId(@Param("userId") String userId);

    @Select("SELECT * FROM chat_session WHERE session_id = #{sessionId}")
    Session findBySessionId(@Param("sessionId") String sessionId);

    @Update("UPDATE chat_session SET last_message = #{lastMessage}, update_time = NOW() WHERE session_id = #{sessionId}")
    void updateLastMessage(@Param("sessionId") String sessionId, @Param("lastMessage") String lastMessage);

    @Update("UPDATE chat_session SET unread_count = #{unreadCount} WHERE session_id = #{sessionId}")
    void updateUnreadCount(@Param("sessionId") String sessionId, @Param("unreadCount") Integer unreadCount);
}
