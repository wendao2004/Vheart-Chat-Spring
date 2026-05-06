# Vheart-Chat

> 📄 **[中文版说明文档](./README_zh.md)**

A full-stack cross-platform mobile application imitating WeChat, built with uni-app + Vue 3 + TypeScript (Frontend) and Spring Boot + MyBatis + MySQL (Backend).

![Version](https://img.shields.io/badge/version-1.2.6-blue)
![Platform](https://img.shields.io/badge/platform-H5%7CAndroid%7CiOS-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## Features

- **Chat System** - Real-time messaging with contacts, supporting text and media messages
- **Contact Management** - Add friends, friend requests, and contact organization
- **Discover Feed** - Music player, anime browsing, and more entertainment features
- **User Profile** - Personal information management and settings
- **Music Player** - Built-in music playback with playlist support
- **Game Emulator** - Built-in retro game emulator supporting various ROM formats (NES, GB/GBC, GBA, SNES, etc.), powered by [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS)
- **AI Shopping Assistant** - Intelligent product diagnosis tool that helps users make informed purchase decisions through weighted analysis
- **Cross-Platform** - Runs on H5, Android, iOS, and other platforms

## Tech Stack

### Frontend
- **Framework**: [uni-app](https://uniapp.dcloud.io/) (Vue 3)
- **Language**: TypeScript
- **State Management**: Composition API with reactive models
- **Styling**: SCSS/uni.scss

### Backend
- **Framework**: Spring Boot 4.0.6
- **ORM**: MyBatis
- **Database**: MySQL
- **Authentication**: JWT-based auth system
- **Utils**: Lombok, Validation

## Project Structure

```
Vheart-Chat-Spring/
├── Cloud/                    # Backend (Spring Boot)
│   └── chat/                 # Chat service
│       ├── src/main/java/    # Java source code
│       │   └── com/vheart/chat/
│       │       ├── Controller/   # REST controllers
│       │       ├── Service/      # Business logic
│       │       ├── Mapper/       # MyBatis mappers
│       │       ├── pojo/         # Data models
│       │       └── utils/        # Utility classes
│       ├── src/main/resources/   # Configuration
│       └── pom.xml              # Maven dependencies
├── common/                   # Common components and utilities
│   ├── tabbar/              # Tab bar component
│   └── utils/               # Helper functions
├── core/                    # Core business logic
│   ├── bean/               # Data models
│   ├── data/               # Data definitions
│   ├── model/              # Business models (use-xxx-model.ts)
│   ├── net/                # Network API
│   └── services/           # Services
├── pages/                   # Page components
│   ├── chat/               # Chat list page
│   ├── chat-detail/        # Chat detail page
│   ├── contact/            # Contacts page
│   ├── discover/           # Discover page
│   ├── me/                 # Profile page
│   ├── music-index/        # Music player
│   ├── player/             # Full-screen player
│   ├── emulatorJs/         # Retro game emulator
│   ├── DoNotBuy-AnAssistant/  # AI shopping assistant
│   └── ...
├── static/                 # Static resources
├── uni_modules/            # Uni-app plugins
├── unpackage/              # Build outputs
├── App.vue                 # Root component
├── main.js                 # Entry point
├── manifest.json           # App configuration
├── pages.json              # Page routing
└── uni.scss                # Global styles
```

## Getting Started

### Prerequisites

- **Frontend**: Node.js 16+, HBuilderX (recommended) or VS Code with uni-app extension
- **Backend**: JDK 17+, Maven 3.6+, MySQL 8.0+

### Backend Setup

1. **Create database**
```sql
CREATE DATABASE vheart_chat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Configure database connection**
   - Edit `Cloud/chat/src/main/resources/application.yml`
   - Update database username and password as needed

3. **Run backend**
```bash
cd Cloud/chat
mvn spring-boot:run
```

The backend service will start at `http://localhost:8888`

### Frontend Setup

```bash
# Install dependencies
npm install
```

### Development

Open the project in HBuilderX and run it on your desired platform:

```bash
# H5
npm run dev:h5

# Android
npm run dev:app-android

# iOS
npm run dev:app-ios
```

### Build

```bash
# Build for Android
npm run build:app-android

# Build for iOS
npm run build:app-ios

# Build for H5
npm run build:h5
```

## Configuration

### Backend Configuration (`application.yml`)

Key configurations:
- `spring.datasource`: MySQL connection settings
- `server.port`: Backend service port (default: 8888)
- `mybatis.configuration.map-underscore-to-camel-case`: Enable camelCase mapping

### Frontend Configuration

- `manifest.json`: App ID, version info, native modules
- `pages.json`: Page routing and tab bar configuration
- `core/net/net-api.ts`: API base URL configuration

## API Endpoints

| Module | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| Auth | `/api/user/login` | POST | User login |
| Auth | `/api/user/register` | POST | User registration |
| Chat | `/api/message/list` | GET | Get message list |
| Chat | `/api/message/send` | POST | Send message |
| Contact | `/api/friend/list` | GET | Get friend list |
| Contact | `/api/friend/add` | POST | Send friend request |

## Screenshots

| Chat | Contacts | Discover | Profile |
|------|----------|----------|---------|
| ![Chat](./static/Chat.png) | ![Contacts](./static/Contacts.png) | ![Discover](./static/Discover.png) | ![Profile](./static/Profile.png) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [uni-app](https://uniapp.dcloud.io/) - Cross-platform framework
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Spring Boot](https://spring.io/projects/spring-boot) - Java backend framework
- [MyBatis](https://mybatis.org/mybatis-3/) - SQL mapping framework
- [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS) - Retro game emulator