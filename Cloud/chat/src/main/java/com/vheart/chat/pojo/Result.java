package com.vheart.chat.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一响应结果封装类
 * 
 * @param <T> 响应数据类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    // ========== 常量定义（规范状态码） ==========
    private static final int CODE_SUCCESS = 200;
    private static final int CODE_FAIL = 401;
    private static final String MSG_SUCCESS = "操作成功";
    private static final String MSG_FAIL = "操作失败";

    // ========== 核心字段（只保留必要字段，删除冗余） ==========
    private Integer code;
    private String message;
    private T data;

    // ========== 成功响应方法（全场景覆盖） ==========
    /**
     * 成功响应（无数据）
     */
    public static <T> Result<T> success() {
        return new Result<>(CODE_SUCCESS, MSG_SUCCESS, null);
    }

    /**
     * 成功响应（带数据）
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(CODE_SUCCESS, MSG_SUCCESS, data);
    }

    /**
     * 成功响应（自定义消息+带数据）
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(CODE_SUCCESS, message, data);
    }

    // ========== 失败响应方法（全场景覆盖） ==========
    /**
     * 失败响应（默认消息）
     */
    public static <T> Result<T> fail() {
        return new Result<>(CODE_FAIL, MSG_FAIL, null);
    }

    /**
     * 失败响应（自定义消息）
     */
    public static <T> Result<T> fail(String message) {
        return new Result<>(CODE_FAIL, message, null);
    }

    /**
     * 失败响应（自定义状态码+自定义消息）
     */
    public static <T> Result<T> fail(int code, String message) {
        return new Result<>(code, message, null);
    }

    // ========== 兼容旧代码的方法（保留你原有的方法名） ==========
    /**
     * 兼容旧代码的error方法（等同于fail）
     */
    public static <T> Result<T> error(String message) {
        return fail(message);
    }
}