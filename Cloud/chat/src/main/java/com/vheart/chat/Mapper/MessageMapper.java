package com.vheart.chat.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.vheart.chat.pojo.Message;

@Mapper
public interface MessageMapper {

    @Insert("INSERT INTO chat_message(from_username, to_username, content, type, is_read) " +
            "VALUES(#{fromUsername}, #{toUsername}, #{content}, #{type}, #{isRead})")
    void insert(Message message);

    @Select("SELECT * FROM chat_message WHERE " +
            "(from_username = #{username1} AND to_username = #{username2}) " +
            "OR (from_username = #{username2} AND to_username = #{username1}) " +
            "ORDER BY create_time ASC LIMIT #{limit} OFFSET #{offset}")
    List<Message> findHistory(@Param("username1") String username1,
                              @Param("username2") String username2,
                              @Param("offset") int offset,
                              @Param("limit") int limit);

    @Select("SELECT COUNT(*) FROM chat_message WHERE " +
            "(from_username = #{username1} AND to_username = #{username2}) " +
            "OR (from_username = #{username2} AND to_username = #{username1})")
    int countHistory(@Param("username1") String username1, @Param("username2") String username2);

    @Update("UPDATE chat_message SET is_read = 1 WHERE " +
            "from_username = #{fromUsername} AND to_username = #{toUsername}")
    void markRead(@Param("fromUsername") String fromUsername, @Param("toUsername") String toUsername);

    @Select("SELECT * FROM chat_message WHERE id = #{id}")
    Message findById(@Param("id") Long id);
}
