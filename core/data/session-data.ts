/**
 * @Description:
 * 会话数据处理
 * 负责会话的创建、更新、列表获取等操作
 * @author liuzhiheng
 * @createTime 2026-03-06 09:55:28
 * @Copyright by 文刀
 */

import { NetApi } from '../net/net-api';
import type { ChatSession, ChatUser } from '../bean/index';

export const SessionData = {
	SESSION_CACHE_PERIOD: 30 * 60 * 1000,

	generateSessionId: (userId1 : string, userId2 : string) : string => {
		try {
			return [userId1, userId2].sort().join('_');
		} catch (error) {
			console.error('生成会话ID失败', error);
			return `${userId1}_${userId2}`;
		}
	},

	getSessionList: async (userId : string) => {
		try {
			const cacheKey = `chat_session_list_cache_${userId}`;

			const cachedData = uni.getStorageSync(cacheKey);
			if (cachedData) {
				const { data, timestamp } = JSON.parse(cachedData);
				if (Date.now() - timestamp < SessionData.SESSION_CACHE_PERIOD) {
					console.log('从缓存获取会话列表');
					return data.sort((a: any, b: any) => b.updateTime - a.updateTime);
				}
			}

			const res = await NetApi.session.list(userId);
			const sessions: ChatSession[] = res.data.map((s: any) => ({
				_id: String(s.id),
				sessionId: s.sessionId,
				userId: s.userId,
				targetUserId: s.targetUsername,
				targetUserInfo: {
					userId: s.targetUsername,
					nickname: s.targetUsername,
					avatarUrl: 'https://img.icons8.com/ios-filled/50/000000/user.png',
					createTime: Date.now()
				} as ChatUser,
				lastMessage: s.lastMessage || '',
				unreadCount: s.unreadCount || 0,
				updateTime: s.updateTime ? new Date(s.updateTime).getTime() : Date.now()
			}));

			const sortedData = sessions.sort((a, b) => b.updateTime - a.updateTime);

			uni.setStorageSync(cacheKey, JSON.stringify({
				data: sortedData,
				timestamp: Date.now()
			}));

			return sortedData;
		} catch (error) {
			console.error('获取会话列表失败', error);
			const cacheKey = `chat_session_list_cache_${userId}`;
			const cachedData = uni.getStorageSync(cacheKey);
			if (cachedData) {
				const { data } = JSON.parse(cachedData);
				console.log('网络失败，使用缓存的会话列表');
				return data.sort((a: any, b: any) => b.updateTime - a.updateTime);
			}
			throw error;
		}
	},

	updateSession: async (sessionId : string, lastMessage : string) => {
		try {
			const res = await NetApi.session.update({
				sessionId: sessionId,
				lastMessage: lastMessage
			});
			return res.data;
		} catch (error) {
			console.error('更新会话失败', error);
			throw error;
		}
	},

	updateLocalSessionCache: (userId : string, session : ChatSession) => {
		try {
			const cacheKey = `chat_session_list_cache_${userId}`;
			const cachedData = uni.getStorageSync(cacheKey);

			if (cachedData) {
				const { data, timestamp } = JSON.parse(cachedData);
				const index = data.findIndex((s: any) => s.sessionId === session.sessionId);

				if (index >= 0) {
					data[index] = { ...data[index], ...session };
				} else {
					data.push(session);
				}

				data.sort((a: any, b: any) => b.updateTime - a.updateTime);

				uni.setStorageSync(cacheKey, JSON.stringify({
					data,
					timestamp
				}));
			}
		} catch (error) {
			console.error('更新本地会话缓存失败', error);
		}
	},

	clearSessionCache: (userId : string) => {
		try {
			uni.removeStorageSync(`chat_session_list_cache_${userId}`);
		} catch (error) {
			console.error('清除会话缓存失败', error);
		}
	}
};