/**
 * @Description:
 * 用户全局业务
 * @author liuzhiheng
 * @createTime 2026-03-06 09:56:41
 * @Copyright by 文刀
 */

import { ref } from 'vue';
import { UserData } from '../data/user-data';
import { NetApi } from '../net/net-api';
import { PushService } from '../services/push-service';
import type { ChatUser } from '../bean/index';

class UserModel {
  private static instance: UserModel;
  
  private _currentUser = ref<ChatUser | null>(UserData.getLocalUser());
  private _userList = ref<ChatUser[]>([]);
  private _friendList = ref<ChatUser[]>([]);

  private constructor() {}

  static getInstance(): UserModel {
    if (!UserModel.instance) {
      UserModel.instance = new UserModel();
    }
    return UserModel.instance;
  }

  get currentUser(): ChatUser | null {
    return this._currentUser.value;
  }

  get isLogin(): boolean {
    return !!this._currentUser.value && !!this._currentUser.value.userId;
  }

  get userList(): ChatUser[] {
    return this._userList.value;
  }

  get friendList(): ChatUser[] {
    return this._friendList.value;
  }

  async login(userInfo: { username: string; password: string }): Promise<ChatUser> {
    const user = await UserData.userLogin(userInfo);
    this._currentUser.value = user;
    await this.savePushToken();
    return user;
  }

  async savePushToken(): Promise<void> {
    try {
      if (this.isLogin) {
        const token = await PushService.getClientToken();
        if (token) {
          console.log('保存推送 token:', token);
          await NetApi.VheartChat.savePushToken({
            userId: this._currentUser.value!.userId,
            token: token
          });
        }
      }
    } catch (error) {
      console.error('保存推送 token 失败:', error);
    }
  }

  async register(userInfo: { username: string; password: string }): Promise<ChatUser> {
    const user = await UserData.userRegister(userInfo);
    return user;
  }

  logout(): void {
    UserData.clearLocalUser();
    this._currentUser.value = null;
    this._userList.value = [];
    this._friendList.value = [];
    uni.showToast({ title: '退出登录成功', icon: 'none' });
    uni.reLaunch({
      url: '/pages/login/login'
    });
  }

  async loadUserList(): Promise<void> {
    const excludeUserId = this._currentUser.value?.userId;
    this._userList.value = await UserData.getUserList(excludeUserId);
  }

  async searchUser(keyword: string): Promise<ChatUser[]> {
    const excludeUserId = this._currentUser.value?.userId;
    return await UserData.searchUser(keyword, excludeUserId);
  }

  async sendFriendRequest(toUserId: string, message: string = ''): Promise<any> {
    if (!this._currentUser.value) {
      throw new Error('用户未登录');
    }
    return await UserData.sendFriendRequest(this._currentUser.value.userId, toUserId, message);
  }

  async getFriendRequests(): Promise<any[]> {
    if (!this._currentUser.value) {
      throw new Error('用户未登录');
    }
    return await UserData.getFriendRequests(this._currentUser.value.userId);
  }

  async handleFriendRequest(requestId: number, status: 'accepted' | 'rejected'): Promise<void> {
    if (!this._currentUser.value || !this._currentUser.value.userId) {
      throw new Error('用户未登录');
    }
    console.log('use-user-model - handleFriendRequest - userId:', this._currentUser.value.userId);
    await UserData.handleFriendRequest(requestId, status);
    if (status === 'accepted') {
      await this.loadFriendList();
      uni.$emit('friendListUpdated');
    }
  }

  async loadFriendList(): Promise<void> {
    if (!this._currentUser.value) {
      throw new Error('用户未登录');
    }
    this._friendList.value = await UserData.getFriendList(this._currentUser.value.userId);
    UserData.cacheAvatarsFromUserList(this._friendList.value);
  }

  getFriendList(): Promise<ChatUser[]> {
    if (!this._currentUser.value) {
      throw new Error('用户未登录');
    }
    return UserData.getFriendList(this._currentUser.value.userId);
  }

  getUserAvatar(userId: string): string {
		if (userId === this._currentUser.value?.userId) {
			const avatarUrl = this._currentUser.value?.avatarUrl || UserData.getUserAvatar(userId);
			if (avatarUrl && avatarUrl !== UserData.getUserAvatar(userId)) {
				UserData.cacheUserAvatar(userId, avatarUrl);
			}
			return avatarUrl;
		}
		const cachedAvatar = UserData.getCachedAvatar(userId);
		if (cachedAvatar) {
			return cachedAvatar;
		}
		const friend = this._friendList.value.find(f => f.userId === userId);
		if (friend?.avatarUrl) {
			UserData.cacheUserAvatar(userId, friend.avatarUrl);
			return friend.avatarUrl;
		}
		return UserData.getUserAvatar(userId);
  }

  validatePhoneNumber(phoneNumber: string): boolean {
		return UserData.validatePhoneNumber(phoneNumber);
  }

  async updateFriendRemark(friendUsername: string, remark: string): Promise<void> {
    if (!this._currentUser.value) {
      throw new Error('用户未登录');
    }
    await UserData.updateFriendRemarkByUsername(this._currentUser.value.userId, friendUsername, remark);
    uni.$emit('userRemarkUpdated', { userId: friendUsername, remark });
  }

  getFriendRemark(friendUserId: string): string | null {
    if (!this._currentUser.value) {
      return null;
    }
    const key = `chat_user_remark_${this._currentUser.value.userId}_${friendUserId}`;
    return uni.getStorageSync(key) || null;
  }
  
};

export const globalUser = UserModel.getInstance();