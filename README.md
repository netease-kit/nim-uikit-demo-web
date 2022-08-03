## 环境要求

- Node 版本：v14.17.0 以上
- 浏览器版本：Chrome v103.0.5060.134 以上

## 安装依赖

```bash
$ npm install 
```

## 快速启动
项目使用 umi.js 搭建，目前项目没有内置登录，需要您在 `src/config/index.ts` 中配置 `appKey`、`imAccid`、`imToken` 三个字段后即可启动

```ts
export default {
  appKey: '', // IM appKey
  imAccid: '', // IM accountId
  imToken: '', // IM Token
  imVersion: 2,
  lbsUrls: ['https://lbs.netease.im/lbs/webconf.jsp'],
  linkUrl: 'weblink.netease.im',
};
```

启动：

```bash
$ npm run start
```

## 构建项目

```bash
$ npm run build
```

## 目录说明

```
.
├── .editorconfig
├── .gitignore
├── .prettierignore
├── .prettierrc
├── .umirc.ts // umi 配置文件，包含路由等
├── .vscode
│   ├── launch.json
│   └── settings.json
├── LICENSE
├── README.md
├── mock
│   └── .gitkeep
├── package.json
├── src // 项目目录
│   ├── app.tsx
│   ├── assets // 资料目录
│   │   └── Index
│   │       ├── add.png
│   │       ├── addressBook_activated.png
│   │       ├── addressBook_inactivated.png
│   │       ├── avatar.png
│   │       ├── chat_activated.png
│   │       ├── chat_inactivated.png
│   │       ├── quit.png
│   │       └── quit_hover.png
│   ├── components
│   │   ├── AddressBookInfo // 好友列表、黑名单列表、群组列表
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── MyUserInfo // 个人信息
│   │       └── index.tsx
│   ├── config
│   │   └── index.ts // 项目启动配置文件
│   ├── global.less
│   ├── locales // 国际化配置文件
│   │   ├── en-US.ts
│   │   └── zh-CN.ts
│   ├── pages
│   │   ├── AddressBook // 通讯录
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── Chat // 会话及聊天
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── Login // 登录
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── index.less
│   │   └── index.tsx
│   ├── routers
│   │   └── index.ts
│   └── store // 全局 store
│       └── index.ts
├── tsconfig.json
└── typings.d.ts
```