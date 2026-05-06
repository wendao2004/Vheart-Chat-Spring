# Vheart-Chat

> 📄 **[English Documentation](./README.md)**

一款基于 **uni-app + Vue 3 + TypeScript**（前端）和 **Spring Boot + MyBatis + MySQL**（后端）构建的全栈式跨平台仿微信移动应用。

![版本](https://img.shields.io/badge/version-1.2.6-blue)
![平台](https://img.shields.io/badge/platform-H5%7CAndroid%7CiOS-green)
![许可证](https://img.shields.io/badge/license-MIT-orange)

## 功能特点

- **聊天系统** - 与好友进行实时消息交流，支持文本和媒体消息
- **联系人管理** - 添加好友、好友请求管理、联系人组织
- **发现页面** - 音乐播放器、动漫浏览等娱乐功能
- **个人主页** - 个人信息管理与设置
- **音乐播放器** - 内置音乐播放功能及播放列表支持
- **游戏模拟器** - 内置复古游戏模拟器，支持 NES、GB/GBC、GBA、SNES 等多种 ROM 格式，基于 [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS)
- **AI 购物助手** - 智能商品诊断工具，通过权重分析帮助用户做出购买决策
- **跨平台支持** - 支持 H5、Android、iOS 等多平台运行

## 技术栈

### 前端
- **框架**: [uni-app](https://uniapp.dcloud.io/) (Vue 3)
- **语言**: TypeScript
- **状态管理**: Composition API + 响应式模型
- **样式**: SCSS/uni.scss

### 后端
- **框架**: Spring Boot 4.0.6
- **ORM**: MyBatis
- **数据库**: MySQL
- **认证系统**: JWT 身份验证
- **工具**: Lombok、Validation

## 项目结构

```
Vheart-Chat-Spring/
├── Cloud/                    # 后端 (Spring Boot)
│   └── chat/                 # 聊天服务
│       ├── src/main/java/    # Java 源代码
│       │   └── com/vheart/chat/
│       │       ├── Controller/   # REST 控制器
│       │       ├── Service/      # 业务逻辑层
│       │       ├── Mapper/       # MyBatis 映射器
│       │       ├── pojo/         # 数据模型
│       │       └── utils/        # 工具类
│       ├── src/main/resources/   # 配置文件
│       └── pom.xml              # Maven 依赖
├── common/                   # 公共组件和工具
│   ├── tabbar/              # 底部导航栏组件
│   └── utils/               # 辅助函数
├── core/                    # 核心业务逻辑
│   ├── bean/               # 数据模型
│   ├── data/               # 数据定义
│   ├── model/              # 业务模型 (use-xxx-model.ts)
│   ├── net/                # 网络 API
│   └── services/           # 服务层
├── pages/                   # 页面组件
│   ├── chat/               # 聊天列表页面
│   ├── chat-detail/        # 聊天详情页面
│   ├── contact/            # 联系人页面
│   ├── discover/           # 发现页面
│   ├── me/                 # 个人主页
│   ├── music-index/        # 音乐播放器
│   ├── player/             # 全屏播放器
│   ├── emulatorJs/         # 复古游戏模拟器
│   ├── DoNotBuy-AnAssistant/  # AI 购物助手
│   └── ...
├── static/                 # 静态资源
├── uni_modules/            # uni-app 插件
├── unpackage/              # 构建输出
├── App.vue                 # 根组件
├── main.js                 # 入口文件
├── manifest.json           # 应用配置
├── pages.json              # 页面路由
└── uni.scss                # 全局样式
```

## 快速开始

### 环境要求

- **前端**: Node.js 16+，HBuilderX（推荐）或 VS Code 配合 uni-app 插件
- **后端**: JDK 17+，Maven 3.6+，MySQL 8.0+

### 后端配置

1. **创建数据库**
```sql
CREATE DATABASE vheart_chat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **配置数据库连接**
   - 编辑 `Cloud/chat/src/main/resources/application.yml`
   - 根据需要更新数据库用户名和密码

3. **启动后端服务**
```bash
cd Cloud/chat
mvn spring-boot:run
```

后端服务将在 `http://localhost:8888` 启动

### 前端配置

```bash
# 安装依赖
npm install
```

### 开发运行

在 HBuilderX 中打开项目，选择目标平台运行：

```bash
# H5
npm run dev:h5

# Android
npm run dev:app-android

# iOS
npm run dev:app-ios
```

### 构建

```bash
# 构建 Android
npm run build:app-android

# 构建 iOS
npm run build:app-ios

# 构建 H5
npm run build:h5
```

## 配置说明

### 后端配置 (`application.yml`)

关键配置项：
- `spring.datasource`: MySQL 连接设置
- `server.port`: 后端服务端口（默认：8888）
- `mybatis.configuration.map-underscore-to-camel-case`: 启用驼峰命名映射

### 前端配置

- `manifest.json`: 应用 ID、版本信息、原生模块
- `pages.json`: 页面路由和 Tab 栏配置
- `core/net/net-api.ts`: API 基础 URL 配置

## API 接口

| 模块 | 接口 | 方法 | 描述 |
|------|------|------|------|
| 认证 | `/api/user/login` | POST | 用户登录 |
| 认证 | `/api/user/register` | POST | 用户注册 |
| 聊天 | `/api/message/list` | GET | 获取消息列表 |
| 聊天 | `/api/message/send` | POST | 发送消息 |
| 联系人 | `/api/friend/list` | GET | 获取好友列表 |
| 联系人 | `/api/friend/add` | POST | 发送好友请求 |

## 截图预览

| 聊天 | 联系人 | 发现 | 我的 |
|------|--------|------|------|
| ![聊天](./static/Chat.png) | ![联系人](./static/Contacts.png) | ![发现](./static/Discover.png) | ![我的](./static/Profile.png) |

## 贡献代码

欢迎提交 Pull Request！

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m '添加某个很棒的功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 开源许可

本项目基于 MIT 许可证开源 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- [uni-app](https://uniapp.dcloud.io/) - 跨平台开发框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Spring Boot](https://spring.io/projects/spring-boot) - Java 后端框架
- [MyBatis](https://mybatis.org/mybatis-3/) - SQL 映射框架
- [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS) - 复古游戏模拟器