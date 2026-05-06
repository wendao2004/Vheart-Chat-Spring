/**
 * @Description:
 * 消息数据处理
 * 负责消息的发送、接收、历史记录查询等操作
 * @author liuzhiheng
 * @createTime 2026-03-06 09:54:40
 * @Copyright by 文刀
 */

import { NetApi } from '../net/net-api';
import type { ChatMessage } from '../bean/index';

export const MessageData = {
	MESSAGE_CACHE_PERIOD: 30 * 60 * 1000,
	MAX_CACHE_MESSAGES: 100,

	formatMessageTime: (timestamp : number) : string => {
		try {
			if (!timestamp || timestamp <= 0) {
				return '';
			}
			const now = Date.now();
			const diff = now - timestamp;
			const oneDay = 24 * 60 * 60 * 1000;

			if (diff < 60 * 1000) return '刚刚';
			if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}分钟前`;
			if (diff < oneDay) {
				const date = new Date(timestamp);
				return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
			}
			if (diff < oneDay * 2) return '昨天';
			const date = new Date(timestamp);
			return `${date.getMonth() + 1}-${date.getDate()}`;
		} catch (error) {
			console.error('格式化消息时间失败', error);
			return '';
		}
	},

	sendMessage: async (params : { fromUserId: string; toUserId: string; content: string; type?: string }) => {
		try {
			const res = await NetApi.message.send({
				fromUsername: params.fromUserId,
				toUsername: params.toUserId,
				content: params.content,
				type: params.type || 'text'
			});

			const createTime = res.data.createTime 
				? new Date(res.data.createTime).getTime() 
				: Date.now();

			const message: ChatMessage = {
				_id: String(res.data.id),
				fromUserId: res.data.fromUsername,
				toUserId: res.data.toUsername,
				content: res.data.content,
				type: res.data.type as 'text' | 'image' | 'voice',
				createTime: createTime,
				isRead: res.data.isRead || false
			};

			return message;
		} catch (error) {
			console.error('发送消息失败', error);
			throw error;
		}
	},

	addMessageToLocalCache: (sessionId : string, message : ChatMessage) => {
		try {
			const cacheKey = `chat_message_cache_${sessionId}`;
			const cachedData = uni.getStorageSync(cacheKey);

			if (cachedData) {
				const { data, timestamp } = JSON.parse(cachedData);
				const exists = data.some((m : ChatMessage) => m._id === message._id);
				if (!exists) {
					data.push(message);
					data.sort((a : ChatMessage, b : ChatMessage) => a.createTime - b.createTime);
					if (data.length > MessageData.MAX_CACHE_MESSAGES) {
						data.splice(0, data.length - MessageData.MAX_CACHE_MESSAGES);
					}
					uni.setStorageSync(cacheKey, JSON.stringify({
						data,
						timestamp
					}));
				}
			} else {
				uni.setStorageSync(cacheKey, JSON.stringify({
					data: [message],
					timestamp: Date.now()
				}));
			}
		} catch (error) {
			console.error('添加本地消息缓存失败', error);
		}
	},

	getHistoryMessage: async (userId1 : string, userId2 : string, page : number = 1, pageSize : number = 50) => {
		try {
			const res = await NetApi.message.history({
				username1: userId1,
				username2: userId2,
				page: page,
				pageSize: pageSize
			});

			const messages: ChatMessage[] = res.data.map((m: any) => {
				const createTime = m.createTime 
					? new Date(m.createTime).getTime() 
					: Date.now();
				
				return {
					_id: String(m.id),
					fromUserId: m.fromUsername,
					toUserId: m.toUsername,
					content: m.content,
					type: (m.type || 'text') as 'text' | 'image' | 'voice',
					createTime: createTime,
					isRead: m.isRead || false
				};
			});

			return messages;
		} catch (error) {
			console.error('获取历史消息失败', error);
			throw error;
		}
	},

	markMessageRead: async (fromUsername : string, toUsername : string) => {
		try {
			await NetApi.message.markRead({
				fromUsername: fromUsername,
				toUsername: toUsername
			});
		} catch (error) {
			console.error('标记消息已读失败', error);
		}
	},

	clearMessageCache: (userId1 : string, userId2 : string) => {
		try {
			const sessionId = [userId1, userId2].sort().join('_');
			const cacheKey = `chat_message_cache_${sessionId}`;
			uni.removeStorageSync(cacheKey);
		} catch (error) {
			console.error('清除消息缓存失败', error);
		}
	}
};