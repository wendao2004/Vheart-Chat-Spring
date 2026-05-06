package com.vheart.chat.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.util.Date;
import java.util.Map;

/**
 * JWT 工具类：生成Token、解析Token
 */
public class JwtUtil {

    // 密钥（实际项目建议配置在配置文件中）
    private static final String KEY = "wendao";

    /**
     * 生成JWT Token
     * 
     * @param claims 业务数据（要存入Token的信息）
     * @return 生成的Token字符串
     */
    public static String genToken(Map<String, Object> claims) {
        return JWT.create()
                // 存入业务数据
                .withClaim("claims", claims)
                // 设置过期时间：7天
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                // 签名
                .sign(Algorithm.HMAC256(KEY));
    }

    /**
     * 解析并验证Token
     * 
     * @param token 前端传来的Token
     * @return 解析出的业务数据
     */
    public static Map<String, Object> parseToken(String token) {
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(KEY))
                .build()
                .verify(token); // 验证Token是否有效（签名、过期时间）

        // 获取存入的业务数据
        return decodedJWT.getClaim("claims").asMap();
    }
}