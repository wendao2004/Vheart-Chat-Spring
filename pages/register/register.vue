<template>
	<view class="register-container" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="register-header">
			<image src="../../static/logo.png" class="logo" mode="aspectFit"></image>
			<text class="app-name">Vheart-Chat</text>
		</view>
		<view class="register-form">
			<view class="form-item">
				<input v-model="formData.username" type="text" placeholder="请输入用户名" class="form-input" />
			</view>
			<view class="form-item">
				<input v-model="formData.password" type="password" placeholder="请设置密码" class="form-input" />
			</view>
			<view class="form-item">
				<input v-model="formData.confirmPassword" type="password" placeholder="请确认密码" class="form-input" />
			</view>
			<view class="form-button">
				<button @click="handleRegister" class="register-button" :disabled="loading">
					<text v-if="!loading">注册</text>
					<text v-else>注册中...</text>
				</button>
			</view>
		</view>
		<view class="register-footer">
			<text class="footer-text">已有账号？</text>
			<text class="footer-link" @click="handleLogin">登录</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		globalUser
	} from '../../core/model/use-user-model';

	const loading = ref(false);
	const formData = ref({
		username: '',
		password: '',
		confirmPassword: ''
	});

	const statusBarHeight = ref(20);

	onLoad((query) => {
		if (query.username) {
			formData.value.username = decodeURIComponent(query.username);
		}
	});

	onMounted(() => {
		initSystemInfo();
	});

	const initSystemInfo = () => {
		statusBarHeight.value = uni.getStorageSync('statusBarHeight') || 20;
	};

	const handleRegister = async () => {
		if (!formData.value.username.trim()) {
			uni.showToast({
				title: '请输入用户名',
				icon: 'none'
			});
			return;
		}
		if (!formData.value.password.trim()) {
			uni.showToast({
				title: '请设置密码',
				icon: 'none'
			});
			return;
		}
		if (formData.value.password !== formData.value.confirmPassword) {
			uni.showToast({
				title: '两次输入的密码不一致',
				icon: 'none'
			});
			return;
		}

		loading.value = true;
		try {
			await globalUser.register({
				username: formData.value.username,
				password: formData.value.password,
			});

			console.log('注册成功');
			await globalUser.login({
				username: formData.value.username,
				password: formData.value.password,
			});

			uni.showToast({
				title: '注册成功',
				icon: 'success'
			});
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/chat/chat'
				});
			}, 1000);
		} catch (error) {
			console.error('注册失败', error);
			const errorMsg = error?.message || '';
			if (errorMsg.includes('已存在')) {
				uni.showToast({
					title: '该用户名已注册',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: '注册失败，请重试',
					icon: 'none'
				});
			}
		} finally {
			loading.value = false;
		}
	};

	const handleLogin = () => {
		uni.navigateBack();
	};
</script>

<style scoped>
	.register-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #FFFFFF;
		padding: 0 32px;
	}

	.register-header {
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

	.register-form {
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

	.register-button {
		width: 100%;
		height: 48px;
		background-color: #07C160;
		color: #FFFFFF;
		font-size: 18px;
		font-weight: 600;
		border-radius: 6px;
		border: none;
	}

	.register-button:disabled {
		background-color: #CCCCCC;
	}

	.register-footer {
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