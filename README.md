# Nuclear Energy Physics Digital Project | 核能物理数字化项目

Frontend for the **Physics in Society (PinS)** digital project — an Apple-style landing page for nuclear energy education.

**核能物理数字化项目** 前端：面向学校物理教育的核能主题 Apple 风格落地页。

---

## English

### Overview

This repository is the **frontend** for the **Physics in Society (PinS)** digital project. It provides an Apple-style landing page focused on nuclear energy education and outreach.

### Tech Stack

- **HTML5** — semantic markup
- **Tailwind CSS** — styling and responsive layout; custom palette (navy `#0A1628`, accent cyan `#22D3EE`) and Inter font
- **Vanilla JavaScript** — no framework; handles scroll animations, pill tabs, accordions, and simulated AI chat

### Features

- **Landing page (`index.html`)**
  - Sticky nav, full-screen Hero (gradient, video placeholder, large typography)
  - Highlights: horizontal scrolling pill tags (efficiency, zero-carbon, etc.)
  - Parallax sections: Safety, Sustainability, Innovation (including SMR visual placeholder)
  - Closer Look: accordion-style feature list
  - AI Chat: glassmorphism container with simulated chat (user/AI bubbles, "typing" state)
  - Footer with multi-column links


### Project Structure

```
├── index.html          # Main landing page
├── admin.html          # Admin dashboard
├── material.json       # Copy/assets (for admin or scripts)
├── css/
│   ├── input.css       # Tailwind entry
│   └── styles.css      # Built output
├── js/
│   ├── main.js         # Main page logic (tabs, accordion)
│   ├── ai-chat.js      # AI chat simulation
│   ├── material.js     # Material/copy loading (if used)
│   └── scroll-animations.js  # Scroll-in animations
├── Document/           # Log, Bugs, Function docs
├── tailwind.config.js
└── package.json
```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build CSS (watch mode for development):
   ```bash
   npm run build:css
   ```
   This watches `css/input.css` and outputs to `css/styles.css`.

3. Serve the site locally (e.g. with `npx serve .`) and open `index.html` or `admin.html` in the browser.


### Documentation

- **Logs**: `Document/Log/` — version and development notes
- **Function**: `Document/Function/` — feature implementation and reproduction
- **Bugs**: `Document/Bugs/` — issues and solutions

---

## 中文版

### 项目简介

本项目为「Physics in Society (PinS)」数字化项目的官方网站前端，以核能为主题，采用 Apple 风格视觉与交互，用于科普展示与教学场景。

### 技术栈

- **HTML5**：语义化结构
- **Tailwind CSS**：样式与响应式布局，自定义色板（深海军蓝 `#0A1628`、强调青 `#22D3EE`）及 Inter 字体
- **原生 JavaScript**：无框架，负责滚动动效、标签切换、手风琴、AI 对话模拟等交互

### 功能概览

- **落地页 (`index.html`)**
  - 粘顶导航、全屏 Hero（渐变背景、视频占位、大号排版）
  - 亮点区块：横向滚动药丸标签（效率、零碳等）
  - 视差区块：安全、可持续、创新（含 SMR 可视化占位）
  - 深入了解：手风琴式特性列表
  - AI 对话：毛玻璃容器内的模拟聊天（用户/AI 气泡、输入中提示）
  - 页脚多列导航


### 项目结构

```
├── index.html          # 主落地页
├── admin.html          # 管理后台
├── material.json       # 文案/素材数据（可被管理端或脚本引用）
├── css/
│   ├── input.css       # Tailwind 入口
│   └── styles.css      # 构建输出
├── js/
│   ├── main.js         # 主页面逻辑（标签、手风琴等）
│   ├── ai-chat.js      # AI 对话模拟
│   ├── material.js     # 素材/文案加载（若使用）
│   └── scroll-animations.js  # 滚动进入动效
├── Document/           # 项目文档（Log / Bugs / Function）
├── tailwind.config.js
└── package.json
```

### 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 开发时实时编译 CSS：
   ```bash
   npm run build:css
   ```
   会监听 `css/input.css` 并输出到 `css/styles.css`。

3. 用本地服务器打开 `index.html` 或 `admin.html`（推荐避免部分 API 限制），例如：
   ```bash
   npx serve .
   ```


### 文档

- **日志**：`Document/Log/` — 版本与开发记录
- **功能说明**：`Document/Function/` — 功能实现与复现说明
- **问题记录**：`Document/Bugs/` — Bug 与解决方案
