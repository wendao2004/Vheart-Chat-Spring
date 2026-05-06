<template>
	<view class="login-container" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="login-header">
			<image src="/static/logo.png" class="logo" mode="aspectFit"></image>
			<text class="app-name">Vheart-Chat</text>
		</view>
		<view class="login-form">
			<view class="form-item">
				<input v-model="formData.username" type="text" placeholder="请输入用户名" class="form-input" />
			</view>
			<view class="form-item">
				<input v-model="formData.password" type="password" placeholder="请输入密码" class="form-input" />
			</view>
			<view class="form-button">
				<button @click="handleLogin" class="login-button" :disabled="loading">
					<text v-if="!loading">登录</text>
					<text v-else>登录中...</text>
				</button>
			</view>
		</view>
		<view class="login-footer">
			<text class="footer-text">还没有账号？</text>
			<text class="footer-link" @click="handleRegister">注册</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		globalUser
	} from '../../core/model/use-user-model';

	const loading = ref(false);
	const formData = ref({
		username: '',
		password: ''
	});

	const statusBarHeight = ref(20);

	onMounted(() => {
		initSystemInfo();
		checkAutoLogin();
	});

	const initSystemInfo = () => {
		statusBarHeight.value = uni.getStorageSync('statusBarHeight') || 20;
	};

	const checkAutoLogin = () => {
		if (globalUser.isLogin) {
			console.log('检测到已登录，自动跳转');
			uni.switchTab({
				url: '/pages/chat/chat'
			});
		}
	};

	const handleLogin = async () => {
		if (!formData.value.username.trim()) {
			uni.showToast({
				title: '请输入用户名',
				icon: 'none'
			});
			return;
		}
		if (!formData.value.password.trim()) {
			uni.showToast({
				title: '请输入密码',
				icon: 'none'
			});
			return;
		}

		loading.value = true;
		try {
			const user = await globalUser.login({
				username: formData.value.username,
				password: formData.value.password
			});
			console.log('登录成功，用户信息：', user);
			uni.showToast({
				title: '登录成功',
				icon: 'success'
			});
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/chat/chat'
				});
			}, 1000);
		} catch (error) {
			console.error('登录失败', error);
			const errorMsg = error?.message || error?.errMsg || '';
			if (errorMsg.includes('用户不存在')) {
				uni.showModal({
					title: '提示',
					content: '该用户名未注册，是否前往注册？',
					confirmText: '去注册',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages/register/register?username=${formData.value.username}`
							});
						}
					}
				});
			} else if (errorMsg.includes('密码错误')) {
				uni.showToast({
					title: '密码错误',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				});
			}
		} finally {
			loading.value = false;
		}
	};

	const handleRegister = () => {
		uni.navigateTo({
			url: '/pages/register/register'
		});
	};
</script>

<style scoped>
	.login-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #FFFFFF;
		padding: 0 32px;
		height: 100%;
	}

	.login-header {
		margin-top: 80px;
		margin-bottom: 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.logo {
		width: 80px;
		height: 80px;
		margin-bottom: 16px;
	}

	.app-name {
		font-size: 24px;
		font-weight: 600;
		color: #07C160;
	}

	.login-form {
		width: 100%;
	}

	.form-item {
		margin-bottom: 16px;
	}

	.form-input {
		width: 100%;
		height: 48px;
		border-bottom: 1px solid #E5E5E5;
		font-size: 16px;
		padding: 0 8px;
		color: #000000;
	}

	.form-button {
		margin-top: 40px;
	}

	.login-button {
		width: 100%;
		height: 48px;
		background-color: #07C160;
		color: #FFFFFF;
		font-size: 18px;
		font-weight: 600;
		border-radius: 6px;
		border: none;
	}

	.login-button:disabled {
		background-color: #CCCCCC;
	}

	.login-footer {
		margin-top: 80px;
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #999999;
	}

	.footer-text {
		margin: 0 4px;
	}

	.footer-link {
		color: #07C160;
	}
</style>