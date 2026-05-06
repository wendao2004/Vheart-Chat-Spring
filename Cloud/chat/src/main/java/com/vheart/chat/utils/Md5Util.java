package com.vheart.chat.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MD5加密工具类（单向加密，用于密码存储）
 */
public final class Md5Util {

    // 私有化构造方法，禁止实例化
    private Md5Util() {
    }

    /**
     * MD5加密字符串（32位小写）
     * 
     * @param data 待加密的明文
     * @return 加密后的密文
     */
    public static String encrypt(String data) {
        try {
            // 获取MD5加密对象
            MessageDigest md = MessageDigest.getInstance("MD5");
            // 加密
            byte[] bytes = md.digest(data.getBytes());
            // 将字节数组转换为32位小写十六进制字符串
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                String hex = Integer.toHexString(b & 0xFF);
                if (hex.length() == 1) {
                    sb.append("0");
                }
                sb.append(hex);
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            throw new RuntimeException("MD5加密失败");
        }
    }
}