/**
 * @Description:
 * 聊天核心业务
 * @author liuzhiheng
 * @createTime 2026-03-06 09:57:38
 * @Copyright by 文刀
 */

import { ref, computed, type Ref } from 'vue';
import { MessageData } from '../data/message-data';
import { globalUser } from './use-user-model';
import type { ChatMessage } from '../bean/index';

export const useChatModel = (targetUserId: Ref<string>) => {
	const messageList = ref<ChatMessage[]>([]);
	const inputContent = ref('');
	const loading = ref(false);
	const sending = ref(false);

	let lastMessageId: string | null = null;

	const currentUserId = computed(() => {
		return globalUser.currentUser?.userId || '';
	});

	const sessionId = computed(() => {
		if (!currentUserId.value || !targetUserId.value) return '';
		return [currentUserId.value, targetUserId.value].sort().join('_');
	});

	const loadHistoryMessage = async (forceRefresh: boolean = false): Promise<void> => {
		if (!currentUserId.value || !targetUserId.value) return;
		console.log('加载历史消息:', {
			currentUserId: currentUserId.value,
			targetUserId: targetUserId.value,
			forceRefresh
		});

		const cacheKey = `chat_message_cache_${sessionId.value}`;
		const cachedData = uni.getStorageSync(cacheKey);
		const CACHE_EXPIRY = 5 * 60 * 1000;

		if (!forceRefresh && cachedData) {
			try {
				const { data, timestamp } = JSON.parse(cachedData);
				if (data && data.length > 0) {
					console.log('先显示缓存消息:', data.length);
					messageList.value = data;
					lastMessageId = data[data.length - 1]._id || null;
					scrollToBottom();

					if (Date.now() - timestamp < CACHE_EXPIRY) {
						console.log('缓存未过期，不调用接口');
						loading.value = false;
						return;
					}
				}
			} catch (error) {
				console.error('解析缓存失败', error);
			}
		}

		if (forceRefresh || !cachedData) {
			loading.value = true;
		}

		try {
			console.log('从服务器获取最新消息...');
			const serverMessages = await MessageData.getHistoryMessage(
				currentUserId.value,
				targetUserId.value
			);
			console.log('服务器返回消息:', serverMessages.length);

			if (serverMessages.length > 0) {
				const mergedMessages = mergeMessages(messageList.value, serverMessages);
				messageList.value = mergedMessages;
				lastMessageId = mergedMessages[mergedMessages.length - 1]?._id || null;

				const cachedMessages = mergedMessages.slice(-MessageData.MAX_CACHE_MESSAGES);
				uni.setStorageSync(cacheKey, JSON.stringify({
					data: cachedMessages,
					timestamp: Date.now()
				}));

				if (serverMessages.length > messageList.value.length) {
					scrollToBottom();
				}
			}
		} catch (error) {
			console.error('加载历史消息失败', error);
			if (!cachedData) {
				startPolling(true);
			}
		} finally {
			loading.value = false;
		}
	};

	const mergeMessages = (localMessages: ChatMessage[], serverMessages: ChatMessage[]): ChatMessage[] => {
		const messageMap = new Map<string, ChatMessage>();

		localMessages.forEach(msg => {
			if (msg._id) {
				messageMap.set(msg._id, msg);
			}
		});

		serverMessages.forEach(msg => {
			if (msg._id) {
				messageMap.set(msg._id, msg);
			}
		});

		const merged = Array.from(messageMap.values());
		merged.sort((a, b) => a.createTime - b.createTime);

		console.log('合并后消息数:', merged.length, '本地:', localMessages.length, '服务器:', serverMessages.length);
		return merged;
	};

	const sendMessage = async (): Promise<void> => {
		if (!inputContent.value.trim() || !currentUserId.value || !targetUserId.value || sending.value) return;

		const sendContent = inputContent.value.trim();
		const messageTimestamp = Date.now();

		const tempMessage: ChatMessage = {
			fromUserId: currentUserId.value,
			toUserId: targetUserId.value,
			content: sendContent,
			type: 'text',
			createTime: messageTimestamp,
			isRead: false
		};

		const tempMessageWithStatus = { ...tempMessage, sending: true } as any;
		messageList.value.push(tempMessageWithStatus);
		inputContent.value = '';

		scrollToBottom();

		sending.value = true;
		try {
			if (targetUserId.value === currentUserId.value) {
				const localMessage: any = {
					...tempMessage,
					_id: `local_${messageTimestamp}`,
					sending: false,
					sendFailed: false
				};
				const index = messageList.value.findIndex(msg =>
					msg.fromUserId === currentUserId.value &&
					msg.createTime === messageTimestamp
				);
				if (index !== -1) {
					messageList.value[index] = localMessage;
				}
				MessageData.addMessageToLocalCache(sessionId.value, localMessage);
				updateLocalRecentChat(targetUserId.value, sendContent);
			} else {
				console.log('发送消息:', tempMessage);
				const sentMessage = await MessageData.sendMessage({
					fromUserId: currentUserId.value,
					toUserId: targetUserId.value,
					content: sendContent
				});
				console.log('发送成功:', sentMessage);

				const index = messageList.value.findIndex(msg =>
					msg.fromUserId === currentUserId.value &&
					msg.createTime === messageTimestamp
				);
				if (index !== -1) {
					messageList.value[index] = sentMessage;
				} else {
					messageList.value.push(sentMessage);
				}
				MessageData.addMessageToLocalCache(sessionId.value, sentMessage);
				updateLocalRecentChat(targetUserId.value, sendContent);
				scrollToBottom();
			}
		} catch (error) {
			console.error('发送消息失败', error);
			uni.showToast({ title: '发送失败', icon: 'none' });
			const index = messageList.value.findIndex(msg =>
				msg.fromUserId === currentUserId.value &&
				msg.createTime === messageTimestamp
			);
			if (index !== -1) {
				(messageList.value[index] as any).sending = false;
				(messageList.value[index] as any).sendFailed = true;
			}
		} finally {
			sending.value = false;
		}
	};

	const scrollToBottom = (): void => {
		if (typeof requestAnimationFrame === 'function') {
			requestAnimationFrame(() => {
				uni.pageScrollTo({
					scrollTop: 999999,
					duration: 100
				});
			});
		} else {
			uni.pageScrollTo({
				scrollTop: 999999,
				duration: 100
			});
		}
	};

	let pollingInterval: number | null = null;
	let lastPollTime = 0;
	const MIN_POLL_INTERVAL = 5000;
	const NORMAL_POLL_INTERVAL = 15000;

	const startPolling = (immediate: boolean = false) => {
		if (pollingInterval) {
			const now = Date.now();
			if (immediate && now - lastPollTime > MIN_POLL_INTERVAL) {
				pollOnce();
			}
			return;
		}

		console.log('启动消息轮询');

		if (immediate) {
			pollOnce();
		}

		pollingInterval = setInterval(() => {
			pollOnce();
		}, NORMAL_POLL_INTERVAL);
	};

	const pollOnce = async () => {
		if (!currentUserId.value || !targetUserId.value) return;

		lastPollTime = Date.now();

		try {
			const messages = await MessageData.getHistoryMessage(
				currentUserId.value,
				targetUserId.value
			);

			if (messages.length > 0) {
				const mergedMessages = mergeMessages(messageList.value, messages);

				if (mergedMessages.length > messageList.value.length) {
					console.log('轮询发现新消息:', mergedMessages.length - messageList.value.length);
					messageList.value = mergedMessages;

					const cacheKey = `chat_message_cache_${sessionId.value}`;
					const cachedMessages = mergedMessages.slice(-MessageData.MAX_CACHE_MESSAGES);
					uni.setStorageSync(cacheKey, JSON.stringify({
						data: cachedMessages,
						timestamp: Date.now()
					}));

					scrollToBottom();
				}
			}
		} catch (error) {
			console.error('轮询更新消息失败', error);
		}
	};

	const stopPolling = () => {
		if (pollingInterval) {
			clearInterval(pollingInterval);
			pollingInterval = null;
			console.log('停止消息轮询');
		}
	};

	const updateLocalRecentChat = (targetUserId: string, lastMessage: string): void => {
		try {
			const currentUserId = globalUser.currentUser?.userId;
			if (!currentUserId) return;

			const key = `chat_recent_chats_${currentUserId}`;
			let chats = uni.getStorageSync(key);
			chats = chats ? JSON.parse(chats) : [];

			const sessionId = [currentUserId, targetUserId].sort().join('_');

			const existingIndex = chats.findIndex((chat: any) => chat.targetUserId === targetUserId);
			const chatData = {
				sessionId,
				userId: currentUserId,
				targetUserId,
				lastMessage,
				updateTime: Date.now(),
				unreadCount: 0
			};

			if (existingIndex > -1) {
				chats[existingIndex] = { ...chats[existingIndex], ...chatData };
			} else {
				chats.push(chatData);
			}

			chats.sort((a: any, b: any) => b.updateTime - a.updateTime);

			if (chats.length > 20) {
				chats = chats.slice(0, 20);
			}

			uni.setStorageSync(key, JSON.stringify(chats));
			console.log('更新本地最近聊天成功');
		} catch (error) {
			console.error('更新本地最近聊天失败', error);
		}
	};

	const cleanup = (): void => {
		stopPolling();
	};

	return {
		messageList,
		inputContent,
		loading,
		sending,
		sessionId,
		loadHistoryMessage,
		sendMessage,
		watchNewMessage: () => { startPolling(); },
		closeWatcher: () => { stopPolling(); },
		cleanup
	};
};