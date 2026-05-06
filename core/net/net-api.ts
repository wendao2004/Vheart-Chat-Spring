/**
 * @Description:
 * 网络层
 * 封装SpringBoot后端调用，统一处理网络请求和错误
 * 对应后端接口
 * @author liuzhiheng
 * @createTime 2026-03-06 09:38:43
 * @Copyright by 文刀
 */

import type {
	ChatMessage,
	ChatSession,
	ChatUser,
	CloudResult,
	SendMessageParams,
	GetHistoryMessageParams,
	MarkReadParams,
	IMusic
} from '../bean/index';

const callCloud = async <T>(name: string, data?: any): Promise<CloudResult<T>> => {
	try {
		console.log(`callCloud - calling ${name} with data:`, data);
		const res = await uni.request({
			url: `http://localhost:8888/${name}`,
			method: 'POST',
			data: data,
			header: {
				'Content-Type': 'application/json;charset=UTF-8'
			}
		});
		console.log(`callCloud - ${name} response:`, res);

		if (!res.data) {
			throw new Error('后端请求失败');
		}

		const result = res.data as CloudResult<T>;
		console.log(`callCloud - ${name} result:`, result);

		if (result.code !== 200) {
			throw new Error(result.message || result.msg || '业务处理失败');
		}

		return result;
	} catch (error) {
		console.error(`【后端请求失败】[${name}]:`, error);
		throw error;
	}
};

export const NetApi = {
	auth: {
		login: async (userInfo: { username: string; password: string }): Promise<CloudResult<string>> => {
			return callCloud<string>('user/login', {
				username: userInfo.username,
				password: userInfo.password
			});
		},

		register: async (userInfo: { username: string; password: string }): Promise<CloudResult<any>> => {
			return callCloud<any>('user/register', {
				username: userInfo.username,
				password: userInfo.password
			});
		}
	},

	message: {
		send: async (params: { fromUsername: string; toUsername: string; content: string; type?: string }): Promise<CloudResult<ChatMessage>> => {
			return callCloud<ChatMessage>('message/send', {
				fromUsername: params.fromUsername,
				toUsername: params.toUsername,
				content: params.content,
				type: params.type || 'text'
			});
		},

		history: async (params: { username1: string; username2: string; page?: number; pageSize?: number }): Promise<CloudResult<ChatMessage[]>> => {
			return callCloud<ChatMessage[]>('message/history', {
				username1: params.username1,
				username2: params.username2,
				page: params.page || 1,
				pageSize: params.pageSize || 50
			});
		},

		markRead: async (params: { fromUsername: string; toUsername: string }): Promise<CloudResult<null>> => {
			return callCloud<null>('message/read', {
				fromUsername: params.fromUsername,
				toUsername: params.toUsername
			});
		}
	},

	session: {
		list: async (userId: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('session/list', {
				userId: userId
			});
		},

		update: async (params: { sessionId: string; lastMessage: string }): Promise<CloudResult<any>> => {
			return callCloud<any>('session/update', {
				sessionId: params.sessionId,
				lastMessage: params.lastMessage
			});
		}
	},

	friend: {
		search: async (keyword: string, excludeUsername: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('friend/search', {
				keyword: keyword,
				excludeUsername: excludeUsername
			});
		},

		apply: async (fromUsername: string, toUsername: string, message: string = ''): Promise<CloudResult<null>> => {
			return callCloud<null>('friend/apply', {
				fromUsername: fromUsername,
				toUsername: toUsername,
				message: message
			});
		},

		applyList: async (toUsername: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('friend/applyList', {
				toUsername: toUsername
			});
		},

		agree: async (requestId: number): Promise<CloudResult<null>> => {
			return callCloud<null>('friend/agree', {
				requestId: requestId
			});
		},

		refuse: async (requestId: number): Promise<CloudResult<null>> => {
			return callCloud<null>('friend/refuse', {
				requestId: requestId
			});
		},

		list: async (userId: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('friend/list', {
				userId: userId
			});
		},

		updateRemark: async (friendId: number, remark: string): Promise<CloudResult<null>> => {
			return callCloud<null>('friend/updateRemark', {
				friendId: friendId,
				remark: remark
			});
		},

		updateRemarkByUsername: async (userId: string, friendUsername: string, remark: string): Promise<CloudResult<null>> => {
			return callCloud<null>('friend/updateRemarkByUsername', {
				userId: userId,
				friendUsername: friendUsername,
				remark: remark
			});
		},

		findFriend: async (userId: string, friendUsername: string): Promise<CloudResult<any>> => {
			return callCloud<any>('friend/findFriend', {
				userId: userId,
				friendUsername: friendUsername
			});
		}
	},

	VheartChat: {
		getUserList: async (excludeUserId?: string): Promise<CloudResult<ChatUser[]>> => {
			return callCloud<ChatUser[]>('user/list', {
				excludeUserId: excludeUserId
			});
		},

		sendMessage: async (params: SendMessageParams): Promise<CloudResult<ChatMessage>> => {
			return callCloud<ChatMessage>('message/send', {
				fromUsername: params.fromUserId,
				toUsername: params.toUserId,
				content: params.content,
				type: params.type || 'text'
			});
		},

		getHistoryMessage: async (params: GetHistoryMessageParams): Promise<CloudResult<ChatMessage[]>> => {
			return callCloud<ChatMessage[]>('message/history', {
				username1: params.userId1,
				username2: params.userId2,
				page: params.page || 1,
				pageSize: params.pageSize || 50
			});
		},

		markMessageRead: async (params: MarkReadParams): Promise<CloudResult<null>> => {
			return callCloud<null>('message/read', {
				fromUsername: params.targetUserId,
				toUsername: params.userId
			});
		},

		getSessionList: async (userId: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('session/list', {
				userId: userId
			});
		},

		updateSession: async (session: Partial<ChatSession>): Promise<CloudResult<any>> => {
			return callCloud<any>('session/update', {
				sessionId: session.sessionId,
				lastMessage: session.lastMessage
			});
		},

		savePushToken: async (params: { userId: string; token: string }): Promise<CloudResult<null>> => {
			return callCloud<null>('user/savePushToken', {
				userId: params.userId,
				token: params.token
			});
		},

		searchUser: async (keyword: string, uid?: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('friend/search', {
				keyword: keyword,
				excludeUsername: uid
			});
		},

		sendFriendRequest: async (fromUserId: string, toUserId: string, message: string = ''): Promise<CloudResult<null>> => {
			return callCloud<null>('friend/apply', {
				fromUsername: fromUserId,
				toUsername: toUserId,
				message: message
			});
		},

		getFriendRequests: async (userId: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('friend/applyList', {
				toUsername: userId
			});
		},

		handleFriendRequest: async (requestId: string, status: 'accepted' | 'rejected', userId?: string): Promise<CloudResult<null>> => {
			const method = status === 'accepted' ? 'friend/agree' : 'friend/refuse';
			return callCloud<null>(method, {
				requestId: parseInt(requestId)
			});
		},

		getFriendList: async (userId: string): Promise<CloudResult<any[]>> => {
			return callCloud<any[]>('friend/list', {
				userId: userId
			});
		}
	},

	upload: {
		image: async (filePath: string, userId: string): Promise<CloudResult<string>> => {
			return callCloud<string>('upload/image', {
				filePath: filePath,
				userId: userId
			});
		}
	},

	VheartMusic: {
		getLyrics: async (params: { mid: string; type: string }): Promise<CloudResult<any>> => {
			return callCloud<any>('music/getLyrics', params);
		},
		searchAnime: async (params: { msg: string; page: number }): Promise<CloudResult<any>> => {
			return callCloud<any>('anime/search', params);
		}
	}
};