package com.vheart.chat.utils;

public class ThreadLocalUtil {
    // 提供ThreadLocal对象
    private static final ThreadLocal<Object> THREAD_LOCAL = new ThreadLocal<>();

    // 根据键获取值
    @SuppressWarnings("unchecked")
    public static <T> T get() {
        return (T) THREAD_LOCAL.get();
    }

    // 存储键值对
    public static <T> void set(T value) {
        THREAD_LOCAL.set(value);
    }

    // 清除ThreadLocal防止内存泄漏
    public static void remove() {
        THREAD_LOCAL.remove();
    }
}
