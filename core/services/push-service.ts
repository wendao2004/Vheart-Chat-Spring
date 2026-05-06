/**
 * @Description:
 * 推送服务
 * 处理 UniApp 推送消息的接收和展示
 * @author liuzhiheng
 * @createTime 2026-05-06
 * @Copyright by 文刀
 */

import { onShow, onHide, onLaunch } from '@dcloudio/uni-app';

export const PushService = {
    // 初始化推送服务
    init(): void {
        console.log('PushService - 初始化推送服务');
        
        // 监听应用启动
        onLaunch(() => {
            console.log('PushService - 应用启动');
            PushService.setupPushListener();
        });

        // 监听应用显示
        onShow(() => {
            console.log('PushService - 应用显示');
        });

        // 监听应用隐藏
        onHide(() => {
            console.log('PushService - 应用隐藏');
        });
    },

    // 设置推送监听器
    setupPushListener(): void {
        // #ifdef APP-PLUS
        const push = uni.requireNativePlugin('JG-JPush');
        if (push) {
            // 接收推送消息
            plus.push.addEventListener('receive', (msg: any) => {
                console.log('PushService - 收到推送消息:', msg);
                PushService.handlePushMessage(msg);
            }, false);

            // 点击推送消息
            plus.push.addEventListener('click', (msg: any) => {
                console.log('PushService - 点击推送消息:', msg);
                PushService.handlePushClick(msg);
            }, false);
        }
        // #endif

        // #ifndef APP-PLUS
        // 非 APP 端使用简单的模拟推送
        console.log('PushService - 非 APP 环境，使用模拟推送');
        // #endif
    },

    // 获取客户端推送 token
    async getClientToken(): Promise<string | null> {
        return new Promise((resolve) => {
            // #ifdef APP-PLUS
            const push = uni.requireNativePlugin('JG-JPush');
            if (push) {
                push.getRegistrationID((result: any) => {
                    console.log('PushService - 获取 RegistrationID:', result);
                    resolve(result.registrationID || null);
                });
            } else {
                resolve(null);
            }
            // #endif

            // #ifndef APP-PLUS
            // 非 APP 端返回模拟 token
            resolve('mock_token_' + Date.now());
            // #endif
        });
    },

    // 处理推送消息
    handlePushMessage(msg: any): void {
        try {
            console.log('PushService - 处理推送消息:', msg);
            
            const messageData = PushService.parseMessage(msg);
            if (!messageData) return;

            // 在应用内显示消息提示
            PushService.showMessageNotification(messageData);
        } catch (error) {
            console.error('PushService - 处理推送消息失败:', error);
        }
    },

    // 处理点击推送
    handlePushClick(msg: any): void {
        try {
            console.log('PushService - 处理点击推送:', msg);
            
            const messageData = PushService.parseMessage(msg);
            if (!messageData) return;

            // 导航到聊天页面
            if (messageData.targetUserId) {
                uni.navigateTo({
                    url: `/pages/chat-detail/chat-detail?targetUserId=${messageData.targetUserId}&nickname=${encodeURIComponent(messageData.nickname || '')}`
                });
            }
        } catch (error) {
            console.error('PushService - 处理点击推送失败:', error);
        }
    },

    // 解析推送消息
    parseMessage(msg: any): any {
        try {
            // 尝试从消息中解析数据
            let data = msg;
            
            // 如果是字符串，尝试解析为 JSON
            if (typeof msg === 'string') {
                try {
                    data = JSON.parse(msg);
                } catch {
                    data = { content: msg };
                }
            }

            // 尝试从不同字段获取数据
            const payload = data.payload || data.extra || data;
            
            return {
                targetUserId: payload.targetUserId || payload.toUserId || payload.fromUserId,
                nickname: payload.nickname || payload.fromNickname,
                content: payload.content || data.content || data.title || data.text,
                type: payload.type || 'text'
            };
        } catch (error) {
            console.error('PushService - 解析消息失败:', error);
            return null;
        }
    },

    // 显示消息通知
    showMessageNotification(data: any): void {
        try {
            console.log('PushService - 显示消息通知:', data);
            
            // 在应用内显示消息提示
            uni.showToast({
                title: data.content || '收到新消息',
                icon: 'none',
                duration: 3000
            });

            // 发送全局事件，通知聊天页面更新
            uni.$emit('newMessageReceived', data);

            // 显示弹窗提示
            PushService.showMessagePopup(data);
        } catch (error) {
            console.error('PushService - 显示通知失败:', error);
        }
    },

    // 显示消息弹窗
    showMessagePopup(data: any): void {
        try {
            const nickname = data.nickname || data.targetUserId || '未知用户';
            const content = data.content || '收到新消息';

            uni.showModal({
                title: `来自 ${nickname} 的消息`,
                content: content,
                confirmText: '查看',
                cancelText: '稍后',
                success: (res) => {
                    if (res.confirm && data.targetUserId) {
                        uni.navigateTo({
                            url: `/pages/chat-detail/chat-detail?targetUserId=${data.targetUserId}&nickname=${encodeURIComponent(nickname)}`
                        });
                    }
                }
            });
        } catch (error) {
            console.error('PushService - 显示弹窗失败:', error);
        }
    },

    // 发送推送消息（后端调用）
    async sendPushMessage(toUserId: string, title: string, content: string): Promise<void> {
        try {
            console.log('PushService - 发送推送消息:', toUserId, title, content);
            // 实际应用中，这里应该调用后端接口发送推送
            // 后端会根据用户的推送 token 发送到对应的客户端
            console.log('PushService - 推送消息已发送（模拟）');
        } catch (error) {
            console.error('PushService - 发送推送失败:', error);
        }
    }
};

// 初始化推送服务
PushService.init();
