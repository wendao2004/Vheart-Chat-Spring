/**
 * @Description:
 * 用户数据处理
 * 负责用户的登录、注册、信息管理等操作
 * @author liuzhiheng
 * @createTime 2026-03-06 09:53:44
 * @Copyright by 文刀
 */

import { NetApi } from '../net/net-api';
import type { ChatUser } from '../bean/index';

export const UserData = {
	LOGIN_VALIDITY_PERIOD: 7 * 24 * 60 * 60 * 1000,
	USER_LIST_CACHE_PERIOD: 30 * 60 * 1000,
	FRIEND_LIST_CACHE_PERIOD: 30 * 60 * 1000,
	FRIEND_REQUEST_CACHE_PERIOD: 10 * 60 * 1000,

	saveLocalUser: (user : ChatUser) => {
		try {
			const userData = {
				...user,
				loginTime: Date.now()
			};
			uni.setStorageSync('chat_current_user', JSON.stringify(userData));
		} catch (error) {
			console.error('保存用户信息失败', error);
		}
	},

	getLocalUser: () : ChatUser | null => {
		try {
			const userStr = uni.getStorageSync('chat_current_user');
			if (!userStr) return null;

			const userData = JSON.parse(userStr);
			const now = Date.now();

			if (userData.loginTime && (now - userData.loginTime) > UserData.LOGIN_VALIDITY_PERIOD) {
				console.log('登录已过期，需要重新登录');
				UserData.clearLocalUser();
				return null;
			}

			return userData;
		} catch (error) {
			console.error('获取用户信息失败', error);
			return null;
		}
	},

	clearLocalUser: () => {
		try {
			uni.removeStorageSync('chat_current_user');
			uni.removeStorageSync('chat_user_list_cache');
			uni.removeStorageSync('chat_friend_list_cache');
			uni.removeStorageSync('chat_friend_request_cache');
			uni.removeStorageSync('chat_session_list_cache');
		} catch (error) {
			console.error('清空用户信息失败', error);
		}
	},

	userLogin: async (userInfo : { username: string; password: string }) => {
		try {
			const res = await NetApi.auth.login(userInfo);
			const token = res.data;
			const userData = {
				userId: userInfo.username,
				nickname: `用户${userInfo.username}`,
				avatarUrl: 'https://img.icons8.com/ios-filled/50/000000/user.png',
				createTime: Date.now(),
				phoneNumber: userInfo.username,
				token: token
			};
			UserData.saveLocalUser(userData);
			return userData;
		} catch (error) {
			console.error('登录失败', error);
			throw error;
		}
	},

	userRegister: async (userInfo : { username: string; password: string }) => {
		try {
			const res = await NetApi.auth.register(userInfo);
			return res.data;
		} catch (error) {
			console.error('注册失败', error);
			throw error;
		}
	},

	searchUser: async (keyword : string, excludeUserId ?: string) => {
		try {
			const res = await NetApi.friend.search(keyword, excludeUserId || '');
			const users: ChatUser[] = res.data.map((u: any) => ({
				token: undefined,
				userId: u.username,
				nickname: u.nickname || u.username,
				avatarUrl: u.userPic || 'https://img.icons8.com/ios-filled/50/000000/user.png',
				createTime: u.createTime ? new Date(u.createTime).getTime() : Date.now()
			}));
			return users;
		} catch (error) {
			console.error('搜索用户失败', error);
			throw error;
		}
	},

	sendFriendRequest: async (fromUserId : string, toUserId : string, message : string = '') => {
		try {
			await NetApi.friend.apply(fromUserId, toUserId, message);
		} catch (error) {
			console.error('发送好友请求失败', error);
			throw error;
		}
	},

	getFriendRequests: async (userId : string) => {
		try {
			const cacheKey = `chat_friend_request_cache_${userId}`;

			const cachedData = uni.getStorageSync(cacheKey);
			if (cachedData) {
				const { data, timestamp } = JSON.parse(cachedData);
				if (Date.now() - timestamp < UserData.FRIEND_REQUEST_CACHE_PERIOD) {
					console.log('从缓存获取好友请求');
					return data;
				}
			}

			const res = await NetApi.friend.applyList(userId);
			const requests = res.data.map((r: any) => ({
				id: r.id,
				fromUsername: r.fromUsername,
				toUsername: r.toUsername,
				message: r.message,
				status: r.status,
				createTime: r.createTime ? new Date(r.createTime).getTime() : Date.now()
			}));

			uni.setStorageSync(cacheKey, JSON.stringify({
				data: requests,
				timestamp: Date.now()
			}));

			return requests;
		} catch (error) {
			console.error('获取好友请求列表失败', error);
			throw error;
		}
	},

	handleFriendRequest: async (requestId : number, status : 'accepted' | 'rejected') => {
		try {
			if (status === 'accepted') {
				await NetApi.friend.agree(requestId);
			} else {
				await NetApi.friend.refuse(requestId);
			}
		} catch (error) {
			console.error('处理好友请求失败', error);
			throw error;
		}
	},

	getFriendList: async (userId : string) => {
		try {
			const cacheKey = `chat_friend_list_cache_${userId}`;

			const cachedData = uni.getStorageSync(cacheKey);
			if (cachedData) {
				const { data, timestamp } = JSON.parse(cachedData);
				if (Date.now() - timestamp < UserData.FRIEND_LIST_CACHE_PERIOD) {
					console.log('从缓存获取好友列表');
					return data;
				}
			}

			const res = await NetApi.friend.list(userId);
			const friends: ChatUser[] = res.data.map((f: any) => ({
				token: undefined,
				userId: f.friendUsername,
				nickname: f.friendNickname || f.friendUsername,
				avatarUrl: 'https://img.icons8.com/ios-filled/50/000000/user.png',
				createTime: f.createTime ? new Date(f.createTime).getTime() : Date.now()
			}));

			uni.setStorageSync(cacheKey, JSON.stringify({
				data: friends,
				timestamp: Date.now()
			}));

			return friends;
		} catch (error) {
			console.error('获取好友列表失败', error);
			throw error;
		}
	},

	updateFriendRemark: async (friendId : number, remark : string) => {
		try {
			await NetApi.friend.updateRemark(friendId, remark);
		} catch (error) {
			console.error('更新好友备注失败', error);
			throw error;
		}
	},

	updateFriendRemarkByUsername: async (userId : string, friendUsername : string, remark : string) => {
		try {
			await NetApi.friend.updateRemarkByUsername(userId, friendUsername, remark);
			const key = `chat_user_remark_${userId}_${friendUsername}`;
			uni.setStorageSync(key, remark);
		} catch (error) {
			console.error('更新好友备注失败', error);
			throw error;
		}
	},

	findFriend: async (userId : string, friendUsername : string) => {
		try {
			const res = await NetApi.friend.findFriend(userId, friendUsername);
			return res.data;
		} catch (error) {
			console.error('查找好友失败', error);
			throw error;
		}
	},

	clearUserCache: (userId : string) => {
		try {
			uni.removeStorageSync(`chat_user_list_cache_${userId}`);
			uni.removeStorageSync(`chat_friend_list_cache_${userId}`);
			uni.removeStorageSync(`chat_friend_request_cache_${userId}`);
		} catch (error) {
			console.error('清除用户缓存失败', error);
		}
	},

	cacheUserAvatar: (userId : string, avatarUrl : string) => {
		try {
			uni.setStorageSync(`chat_avatar_cache_${userId}`, avatarUrl);
		} catch (error) {
			console.error('缓存用户头像失败', error);
		}
	},

	getCachedAvatar: (userId : string) : string | null => {
		try {
			return uni.getStorageSync(`chat_avatar_cache_${userId}`) || null;
		} catch (error) {
			console.error('获取缓存头像失败', error);
			return null;
		}
	},

	cacheAvatarsFromUserList: (users : ChatUser[]) => {
		try {
			users.forEach(user => {
				if (user.userId && user.avatarUrl) {
					uni.setStorageSync(`chat_avatar_cache_${user.userId}`, user.avatarUrl);
				}
			});
		} catch (error) {
			console.error('批量缓存头像失败', error);
		}
	},

	getUserAvatar: (userId : string, defaultAvatar ?: string) : string => {
		const cachedAvatar = UserData.getCachedAvatar(userId);
		if (cachedAvatar) {
			return cachedAvatar;
		}
		return defaultAvatar || 'https://img.icons8.com/ios-filled/50/000000/user.png';
	},

	validatePhoneNumber: (phoneNumber : string) : boolean => {
		const phoneRegex = /^1[3-9]\d{9}$/;
		return phoneRegex.test(phoneNumber);
	}
};