<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>肉肉机</title>
<meta name="apple-mobile-web-app-title" content="肉肉机">
<link rel="apple-touch-icon" href="https://api.dicebear.com/7.x/bottts/svg?seed=rourou&backgroundColor=07C160" id="appIcon">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  :root {
    --wallpaper: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%);
    --safe-top: env(safe-area-inset-top, 44px);
    --safe-bottom: env(safe-area-inset-bottom, 20px);
  }
  html, body {
    width: 100%; height: 100%;
    overflow: hidden;
    font-family: -apple-system, 'SF Pro Display', 'PingFang SC', sans-serif;
  }
  body {
    background: var(--wallpaper);
    position: fixed; inset: 0;
  }

  /* Wallpaper layers */
  #wallpaperBg {
    position: fixed; inset: 0; z-index: 0;
    background: var(--wallpaper);
    transition: background 0.5s;
  }
  #wallpaperImg {
    position: fixed; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
    opacity: 0; transition: opacity 0.5s;
  }

  /* ===== STATUS BAR ===== */
  .status-bar {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--safe-top) 26px 0;
    height: calc(var(--safe-top) + 20px);
    padding-bottom: 0;
  }
  .status-bar.hidden { opacity: 0; pointer-events: none; }
  .status-time {
    font-size: 15px; font-weight: 600;
    color: #fff; letter-spacing: -0.3px;
    padding-top: 6px;
  }
  .dynamic-island {
    position: fixed; top: 10px;
    left: 50%; transform: translateX(-50%);
    width: 120px; height: 34px;
    background: #000; border-radius: 20px;
    z-index: 200;
  }
  .status-right {
    display: flex; align-items: center;
    gap: 6px; padding-top: 6px;
  }
  .signal-bars { display: flex; align-items: flex-end; gap: 1.5px; height: 12px; }
  .signal-bars span { background: #fff; border-radius: 1px; width: 3px; }
  .signal-bars span:nth-child(1) { height: 4px; }
  .signal-bars span:nth-child(2) { height: 6px; }
  .signal-bars span:nth-child(3) { height: 8px; }
  .signal-bars span:nth-child(4) { height: 11px; }
  .wifi-icon { width: 16px; height: 12px; display: flex; align-items: flex-end; justify-content: center; }
  .wifi-icon svg { width: 15px; height: 11px; }
  .battery-icon { display: flex; align-items: center; gap: 1px; }
  .battery-body { width: 25px; height: 12px; border: 1.5px solid rgba(255,255,255,0.9); border-radius: 3.5px; padding: 1.5px; }
  .battery-fill { width: 100%; height: 100%; background: #fff; border-radius: 1.5px; }
  .battery-tip { width: 2px; height: 5px; background: rgba(255,255,255,0.7); border-radius: 0 1px 1px 0; }

  /* ===== HOME SCREEN ===== */
  #homeScreen {
    position: fixed; inset: 0; z-index: 10;
    display: flex; flex-direction: column;
    padding-top: calc(var(--safe-top) + 24px);
  }
  .app-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 16px 20px 10px;
    align-content: start;
    z-index: 20;
  }
  .app-icon {
    display: flex; flex-direction: column;
    align-items: center; gap: 6px; cursor: pointer;
  }
  .app-icon-img {
    width: 64px; height: 64px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; position: relative; overflow: hidden;
    transition: transform 0.1s;
    backdrop-filter: blur(10px);
  }
  .app-icon-img:active { transform: scale(0.88); }
  .app-icon-label {
    font-size: 11px; color: #fff;
    text-shadow: 0 1px 3px rgba(0,0,0,0.6);
    text-align: center; max-width: 72px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .wechat-icon-bg { background: #07C160; }

  /* Dock */
  .dock {
    z-index: 20;
    margin: 0 16px;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius: 28px;
    padding: 12px 16px;
    display: flex; justify-content: space-around; align-items: center;
    border: 1px solid rgba(255,255,255,0.25);
  }
  /* Home bar */
  .home-indicator {
    height: calc(var(--safe-bottom) + 10px);
    display: flex; align-items: center; justify-content: center;
    z-index: 20;
  }
  .home-bar {
    width: 134px; height: 5px;
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
  }

  /* ===== PANELS ===== */
  .panel {
    position: fixed; inset: 0;
    z-index: 50;
    background: #f2f2f7;
    overflow: hidden;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.32,0.72,0,1);
    display: flex; flex-direction: column;
  }
  .panel.open { transform: translateY(0); }
  .panel-header {
    background: rgba(242,242,247,0.95);
    backdrop-filter: blur(10px);
    padding-top: calc(var(--safe-top) + 16px);
    padding-left: 20px; padding-right: 20px; padding-bottom: 14px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    display: flex; align-items: center; gap: 12px;
    flex-shrink: 0;
  }
  .panel-back {
    background: none; border: none;
    color: #007AFF; font-size: 17px;
    cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;
  }
  .panel-title { font-size: 17px; font-weight: 600; color: #000; flex: 1; text-align: center; }
  .panel-spacer { width: 60px; }
  .panel-body { flex: 1; overflow-y: auto; padding: 20px 16px; }
  .settings-section { background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
  .settings-row {
    display: flex; align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06); gap: 12px;
  }
  .settings-row:last-child { border-bottom: none; }
  .settings-row-label { flex: 1; font-size: 15px; color: #000; }
  .settings-row-value { font-size: 15px; color: #8e8e93; }
  .settings-input {
    flex: 1; border: none; outline: none;
    font-size: 15px; color: #000; text-align: right;
    background: transparent; font-family: inherit;
  }
  .toggle {
    width: 51px; height: 31px; background: #e5e5ea;
    border-radius: 16px; position: relative;
    cursor: pointer; transition: background 0.3s; flex-shrink: 0;
  }
  .toggle.on { background: #34C759; }
  .toggle::after {
    content: ''; position: absolute;
    width: 27px; height: 27px; background: #fff;
    border-radius: 50%; top: 2px; left: 2px;
    transition: left 0.3s; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  .toggle.on::after { left: 22px; }
  .section-title { font-size: 13px; color: #8e8e93; font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ===== WECHAT ===== */
  #wechatPanel { background: #ededed; }
  .wechat-header {
    background: rgba(237,237,237,0.95);
    backdrop-filter: blur(10px);
    padding-top: calc(var(--safe-top) + 10px);
    padding-left: 16px; padding-right: 16px; padding-bottom: 10px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center;
    position: relative; flex-shrink: 0;
  }
  .wechat-header-title { font-size: 17px; font-weight: 600; color: #000; }
  .wechat-back-btn {
    position: absolute; left: 12px;
    background: none; border: none; color: #07C160;
    font-size: 15px; cursor: pointer;
    display: flex; align-items: center; gap: 2px; padding: 8px;
  }
  .wechat-content { flex: 1; overflow: hidden; position: relative; }
  .wechat-tab {
    position: absolute; inset: 0; overflow-y: auto;
    display: none; flex-direction: column;
  }
  .wechat-tab.active { display: flex; }
  .chat-list-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.5);
    backdrop-filter: blur(10px);
    margin: 4px 12px; border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.7); cursor: pointer;
  }
  .chat-list-item:active { background: rgba(255,255,255,0.3); }
  .chat-avatar {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 600; color: #fff;
  }
  .chat-info { flex: 1; overflow: hidden; }
  .chat-name { font-size: 16px; font-weight: 500; color: #000; }
  .chat-preview { font-size: 13px; color: #888; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .contact-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(10px);
    margin: 4px 12px; border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.7);
  }
  .contact-avatar {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .contact-name { font-size: 16px; color: #000; font-weight: 500; }
  .discover-section {
    background: rgba(255,255,255,0.5); backdrop-filter: blur(10px);
    border-radius: 14px; margin: 8px 12px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.7);
  }
  .discover-item {
    display: flex; align-items: center; padding: 14px 16px;
    gap: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); cursor: pointer;
  }
  .discover-item:last-child { border-bottom: none; }
  .discover-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .discover-label { flex: 1; font-size: 15px; color: #000; }
  .discover-arrow { color: #c7c7cc; font-size: 14px; }
  .me-profile {
    background: rgba(255,255,255,0.5); backdrop-filter: blur(10px);
    border-radius: 14px; margin: 8px 12px; padding: 20px 16px;
    display: flex; align-items: center; gap: 16px;
    border: 1px solid rgba(255,255,255,0.7);
  }
  .me-avatar {
    width: 64px; height: 64px; border-radius: 14px;
    background: linear-gradient(135deg,#07C160,#0aad5a);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; color: #fff; font-weight: 700;
  }
  .me-name { font-size: 20px; font-weight: 600; color: #000; }
  .me-id { font-size: 13px; color: #888; margin-top: 4px; }
  .wechat-tabs {
    display: flex;
    background: rgba(237,237,237,0.96); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0,0,0,0.08);
    padding: 8px 0;
    padding-bottom: calc(var(--safe-bottom) + 8px);
    flex-shrink: 0;
  }
  .wechat-tab-btn {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 3px;
    background: none; border: none; cursor: pointer; padding: 4px 0;
  }
  .wechat-tab-icon { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; }
  .wechat-tab-icon svg { width: 26px; height: 26px; }
  .wechat-tab-label { font-size: 10px; color: #8e8e93; font-weight: 500; }
  .wechat-tab-btn.active .wechat-tab-label { color: #07C160; }
  .wechat-tab-btn.active .wechat-tab-icon svg path,
  .wechat-tab-btn.active .wechat-tab-icon svg rect,
  .wechat-tab-btn.active .wechat-tab-icon svg circle { fill: #07C160; }

  /* Chat Conversation */
  #chatConversation {
    position: absolute; inset: 0;
    background: #f2f2f7; z-index: 200;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.32,0.72,0,1);
  }
  #chatConversation.open { transform: translateX(0); }
  .conv-header {
    background: rgba(242,242,247,0.95); backdrop-filter: blur(10px);
    padding-top: calc(var(--safe-top) + 10px);
    padding-left: 16px; padding-right: 16px; padding-bottom: 10px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    display: flex; align-items: center; flex-shrink: 0; gap: 10px;
  }
  .conv-back { background: none; border: none; color: #07C160; font-size: 15px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
  .conv-name { flex: 1; text-align: center; font-size: 17px; font-weight: 600; color: #000; }
  .conv-spacer { width: 60px; }
  .conv-messages { flex: 1; overflow-y: auto; padding: 16px 12px; display: flex; flex-direction: column; gap: 10px; }
  .msg-row { display: flex; align-items: flex-end; gap: 8px; }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-avatar { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; }
  .msg-bubble { max-width: 65%; padding: 10px 14px; border-radius: 18px; font-size: 15px; line-height: 1.4; word-break: break-word; }
  .msg-row.theirs .msg-bubble { background: #fff; color: #000; border-radius: 4px 18px 18px 18px; }
  .msg-row.mine .msg-bubble { background: #07C160; color: #fff; border-radius: 18px 4px 18px 18px; }
  .conv-input-area {
    background: rgba(242,242,247,0.95); backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0,0,0,0.08);
    padding: 10px 12px;
    padding-bottom: calc(var(--safe-bottom) + 10px);
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }
  .conv-input {
    flex: 1; background: #fff; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px; padding: 9px 16px;
    font-size: 15px; color: #000; outline: none; font-family: inherit;
    max-height: 120px; resize: none;
  }
  .conv-send {
    width: 36px; height: 36px; background: #07C160;
    border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
  }
  .conv-send svg { width: 18px; height: 18px; }

  /* AI Chat */
  #aiChatPanel { background: #f2f2f7; }
  .ai-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .ai-msg { display: flex; gap: 10px; align-items: flex-end; }
  .ai-msg.user { flex-direction: row-reverse; }
  .ai-avatar { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg,#5856D6,#AF52DE); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ai-bubble { max-width: 72%; padding: 10px 14px; font-size: 15px; line-height: 1.5; word-break: break-word; }
  .ai-msg.bot .ai-bubble { background: #fff; color: #000; border-radius: 4px 18px 18px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .ai-msg.user .ai-bubble { background: #007AFF; color: #fff; border-radius: 18px 4px 18px 18px; }
  .ai-input-area {
    background: rgba(242,242,247,0.95); backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0,0,0,0.1);
    padding: 10px 12px;
    padding-bottom: calc(var(--safe-bottom) + 10px);
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }
  .ai-input {
    flex: 1; background: #fff; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 20px; padding: 9px 16px;
    font-size: 15px; color: #000; outline: none; font-family: inherit;
    max-height: 120px; resize: none;
  }
  .ai-send { width: 36px; height: 36px; background: #007AFF; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
  .ai-send svg { width: 18px; height: 18px; }
  .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 10px 14px; background: #fff; border-radius: 4px 18px 18px 18px; }
  .typing-dot { width: 7px; height: 7px; background: #8e8e93; border-radius: 50%; animation: typing 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing { 0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)} }

  /* Beautify */
  .preview-box { width: 100%; height: 140px; border-radius: 16px; margin-bottom: 8px; overflow: hidden; }
  .preview-box-bg { width: 100%; height: 100%; background: var(--wallpaper); background-size: cover; background-position: center; }
  .url-input { width: 100%; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.12); border-radius: 10px; font-size: 15px; color: #000; outline: none; font-family: inherit; background: #fff; margin-top: 8px; }
  .apply-btn { width: 100%; padding: 14px; background: #007AFF; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; color: #fff; cursor: pointer; margin-top: 10px; font-family: inherit; }
  .apply-btn:active { opacity: 0.8; }
  .color-presets { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
  .color-preset { width: 48px; height: 48px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: transform 0.15s, border-color 0.15s; }
  .color-preset:active { transform: scale(0.9); }
  .color-preset.selected { border-color: #007AFF; }

  /* Preset */
  .preset-item { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; }
  .preset-item.selected { border-color: #5856D6; }
  .preset-name { font-size: 16px; font-weight: 600; color: #000; }
  .preset-desc { font-size: 13px; color: #8e8e93; margin-top: 4px; }

  #wallpaperFileInput, #iconFileInput { display: none; }
  ::-webkit-scrollbar { display: none; }
  .wechat-tab { padding-bottom: 8px; padding-top: 8px; }
</style>
</head>
<body>

<div id="wallpaperBg"></div>
<div id="wallpaperImg"></div>

<!-- Dynamic Island -->
<div class="dynamic-island"></div>

<!-- Status Bar -->
<div class="status-bar" id="statusBar">
  <div class="status-time" id="statusTime">00:00</div>
  <div class="status-right">
    <div class="signal-bars"><span></span><span></span><span></span><span></span></div>
    <div class="wifi-icon">
      <svg viewBox="0 0 16 12" fill="none">
        <path d="M8 9.5C8.83 9.5 9.5 10.17 9.5 11S8.83 12.5 8 12.5 6.5 11.83 6.5 11 7.17 9.5 8 9.5Z" fill="white"/>
        <path d="M8 6.5C9.8 6.5 11.4 7.3 12.5 8.55L13.9 7.15C12.4 5.53 10.31 4.5 8 4.5C5.69 4.5 3.6 5.53 2.1 7.15L3.5 8.55C4.6 7.3 6.2 6.5 8 6.5Z" fill="white"/>
        <path d="M8 2.5C11.18 2.5 14.02 3.88 16 6.07L17.5 4.57C15.12 2.04 11.74 0.5 8 0.5C4.26 0.5 0.88 2.04-1.5 4.57L0 6.07C1.98 3.88 4.82 2.5 8 2.5Z" fill="white"/>
      </svg>
    </div>
    <div class="battery-icon">
      <div class="battery-body"><div class="battery-fill"></div></div>
      <div class="battery-tip"></div>
    </div>
  </div>
</div>

<!-- Home Screen -->
<div id="homeScreen">
  <div class="app-grid">
    <div class="app-icon" onclick="openWechat()">
      <div class="app-icon-img wechat-icon-bg" id="iconWechat">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <ellipse cx="15" cy="18" rx="10" ry="8" fill="white" fill-opacity="0.95"/>
          <circle cx="12" cy="18" r="1.5" fill="#07C160"/>
          <circle cx="16" cy="18" r="1.5" fill="#07C160"/>
          <circle cx="20" cy="18" r="1.5" fill="#07C160"/>
          <ellipse cx="25" cy="24" rx="8" ry="6" fill="white" fill-opacity="0.7"/>
          <circle cx="23" cy="24" r="1.2" fill="#07C160"/>
          <circle cx="26.5" cy="24" r="1.2" fill="#07C160"/>
        </svg>
      </div>
      <span class="app-icon-label">微信</span>
    </div>
    <div class="app-icon" onclick="openPanel('aiChatPanel')">
      <div class="app-icon-img" id="iconAI" style="background:linear-gradient(135deg,#5856D6,#AF52DE)">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="6" width="22" height="16" rx="5" fill="white" fill-opacity="0.9"/>
          <polygon points="8,22 6,28 13,23" fill="white" fill-opacity="0.9"/>
          <circle cx="27" cy="22" r="7" fill="white" fill-opacity="0.8"/>
          <path d="M24 22h6M27 19v6" stroke="#AF52DE" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="app-icon-label">AI 助手</span>
    </div>
    <div class="app-icon">
      <div class="app-icon-img" style="background:linear-gradient(135deg,#1C1C1E,#3A3A3C)">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <rect x="3" y="9" width="30" height="22" rx="5" fill="white" fill-opacity="0.9"/>
          <circle cx="18" cy="20" r="7" fill="#1C1C1E" stroke="white" stroke-width="2"/>
          <circle cx="18" cy="20" r="4" fill="#3A3A3C"/>
          <rect x="13" y="6" width="10" height="5" rx="2" fill="white" fill-opacity="0.9"/>
        </svg>
      </div>
      <span class="app-icon-label">相机</span>
    </div>
    <div class="app-icon">
      <div class="app-icon-img" style="background:linear-gradient(135deg,#34C759,#30B853)">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <path d="M18 5C13.58 5 10 8.58 10 13c0 7 8 18 8 18s8-11 8-18c0-4.42-3.58-8-8-8z" fill="white" fill-opacity="0.95"/>
          <circle cx="18" cy="13" r="3.5" fill="#34C759"/>
        </svg>
      </div>
      <span class="app-icon-label">地图</span>
    </div>
    <div class="app-icon">
      <div class="app-icon-img" style="background:linear-gradient(135deg,#FF2D55,#FF6B6B)">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <circle cx="14" cy="25" r="4" fill="white" fill-opacity="0.9"/>
          <circle cx="25" cy="22" r="3.5" fill="white" fill-opacity="0.9"/>
          <path d="M18 21V10l11-3v11" stroke="white" stroke-opacity="0.9" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        </svg>
      </div>
      <span class="app-icon-label">音乐</span>
    </div>
    <div class="app-icon">
      <div class="app-icon-img" style="background:linear-gradient(135deg,#007AFF,#0056CC)">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="13" stroke="white" stroke-opacity="0.9" stroke-width="2" fill="none"/>
          <polygon points="18,8 22,22 18,19 14,22" fill="white" fill-opacity="0.95"/>
          <line x1="6" y1="18" x2="30" y2="18" stroke="white" stroke-opacity="0.4" stroke-width="1"/>
          <line x1="18" y1="6" x2="18" y2="30" stroke="white" stroke-opacity="0.4" stroke-width="1"/>
        </svg>
      </div>
      <span class="app-icon-label">Safari</span>
    </div>
    <div class="app-icon">
      <div class="app-icon-img" style="background:#fff">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="6" width="28" height="26" rx="6" fill="white"/>
          <rect x="4" y="6" width="28" height="10" rx="6" fill="#FF3B30"/>
          <rect x="4" y="12" width="28" height="4" fill="#FF3B30"/>
          <text x="18" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="#FF3B30" font-family="sans-serif" id="calDateIcon">20</text>
          <rect x="11" y="3" width="3" height="7" rx="1.5" fill="#ccc"/>
          <rect x="22" y="3" width="3" height="7" rx="1.5" fill="#ccc"/>
        </svg>
      </div>
      <span class="app-icon-label">日历</span>
    </div>
    <div class="app-icon">
      <div class="app-icon-img" style="background:#fff">
        <svg width="34" height="34" viewBox="0 0 36 36">
          <path d="M18 7 L20.5 12 L26.2 10.5 L25 16.3 L30.2 19 L25 21.7 L26.2 27.5 L20.5 26 L18 31 L15.5 26 L9.8 27.5 L11 21.7 L5.8 19 L11 16.3 L9.8 10.5 L15.5 12 Z" fill="url(#photoGrad)"/>
          <defs>
            <radialGradient id="photoGrad" cx="50%" cy="50%">
              <stop offset="0%" stop-color="#FFD60A"/>
              <stop offset="25%" stop-color="#FF9500"/>
              <stop offset="50%" stop-color="#FF2D55"/>
              <stop offset="75%" stop-color="#AF52DE"/>
              <stop offset="100%" stop-color="#007AFF"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
      <span class="app-icon-label">照片</span>
    </div>
  </div>

  <div style="flex:1"></div>

  <!-- Dock -->
  <div class="dock">
    <div class="app-icon" onclick="openWechat()">
      <div class="app-icon-img wechat-icon-bg" style="width:54px;height:54px">
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
          <ellipse cx="15" cy="18" rx="10" ry="8" fill="white" fill-opacity="0.95"/>
          <circle cx="12" cy="18" r="1.5" fill="#07C160"/>
          <circle cx="16" cy="18" r="1.5" fill="#07C160"/>
          <circle cx="20" cy="18" r="1.5" fill="#07C160"/>
          <ellipse cx="25" cy="24" rx="8" ry="6" fill="white" fill-opacity="0.7"/>
          <circle cx="23" cy="24" r="1.2" fill="#07C160"/>
          <circle cx="26.5" cy="24" r="1.2" fill="#07C160"/>
        </svg>
      </div>
    </div>
    <div class="app-icon" onclick="openPanel('aiChatPanel')">
      <div class="app-icon-img" style="background:linear-gradient(135deg,#5856D6,#AF52DE);width:54px;height:54px">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="6" width="22" height="16" rx="5" fill="white" fill-opacity="0.9"/>
          <polygon points="8,22 6,28 13,23" fill="white" fill-opacity="0.9"/>
        </svg>
      </div>
    </div>
    <div class="app-icon" onclick="openPanel('settingsPanel')">
      <div class="app-icon-img" style="background:linear-gradient(135deg,#636366,#8e8e93);width:54px;height:54px">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="5" fill="white" fill-opacity="0.95"/>
          <path d="M18 4v4M18 28v4M4 18h4M28 18h4M7.76 7.76l2.83 2.83M25.41 25.41l2.83 2.83M7.76 28.24l2.83-2.83M25.41 10.59l2.83-2.83" stroke="white" stroke-opacity="0.9" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <div class="app-icon" onclick="openPanel('beautifyPanel')">
      <div class="app-icon-img" style="background:linear-gradient(135deg,#FF2D55,#FF6B6B);width:54px;height:54px">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="9" stroke="white" stroke-opacity="0.95" stroke-width="2.5" fill="none"/>
          <circle cx="18" cy="12" r="2" fill="white" fill-opacity="0.95"/>
          <circle cx="23.2" cy="15" r="2" fill="white" fill-opacity="0.95"/>
          <circle cx="23.2" cy="21" r="2" fill="white" fill-opacity="0.95"/>
          <circle cx="18" cy="24" r="2" fill="white" fill-opacity="0.95"/>
          <circle cx="12.8" cy="21" r="2" fill="white" fill-opacity="0.95"/>
          <circle cx="12.8" cy="15" r="2" fill="white" fill-opacity="0.95"/>
        </svg>
      </div>
    </div>
  </div>
  <div class="home-indicator"><div class="home-bar"></div></div>
</div>

<!-- ===== SETTINGS PANEL ===== -->
<div class="panel" id="settingsPanel">
  <div class="panel-header">
    <button class="panel-back" onclick="closePanel('settingsPanel')">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      返回
    </button>
    <div class="panel-title">设置</div>
    <div class="panel-spacer"></div>
  </div>
  <div class="panel-body">
    <div class="section-title">AI 设置</div>
    <div class="settings-section">
      <div class="settings-row">
        <div class="settings-row-label">API 地址</div>
        <input class="settings-input" id="apiBaseInput" placeholder="https://api.openai.com/v1" value="https://api.openai.com/v1">
      </div>
      <div class="settings-row">
        <div class="settings-row-label">API Key</div>
        <input class="settings-input" id="apiKeyInput" type="password" placeholder="sk-...">
      </div>
      <div class="settings-row">
        <div class="settings-row-label">模型</div>
        <input class="settings-input" id="modelInput" placeholder="gpt-4o" value="gpt-4o">
      </div>
    </div>
    <div class="section-title">关于</div>
    <div class="settings-section">
      <div class="settings-row">
        <div class="settings-row-label">版本</div>
        <div class="settings-row-value">1.0.0</div>
      </div>
    </div>
  </div>
</div>

<!-- ===== BEAUTIFY PANEL ===== -->
<div class="panel" id="beautifyPanel">
  <div class="panel-header">
    <button class="panel-back" onclick="closePanel('beautifyPanel')">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      返回
    </button>
    <div class="panel-title">美化</div>
    <div class="panel-spacer"></div>
  </div>
  <div class="panel-body">
    <div class="section-title">壁纸预览</div>
    <div class="preview-box"><div class="preview-box-bg" id="wallpaperPreview"></div></div>
    <div class="section-title" style="margin-top:16px">预设壁纸</div>
    <div class="color-presets">
      <div class="color-preset selected" style="background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460,#533483)" onclick="setWallpaperGradient('linear-gradient(135deg,#1a1a2e 0%,#16213e 30%,#0f3460 60%,#533483 100%)',this)"></div>
      <div class="color-preset" style="background:linear-gradient(135deg,#0f2027,#203a43,#2c5364)" onclick="setWallpaperGradient('linear-gradient(135deg,#0f2027,#203a43,#2c5364)',this)"></div>
      <div class="color-preset" style="background:linear-gradient(135deg,#e96c4c,#f7c59f,#fde8d8)" onclick="setWallpaperGradient('linear-gradient(135deg,#e96c4c,#f7c59f,#fde8d8)',this)"></div>
      <div class="color-preset" style="background:linear-gradient(135deg,#000,#1a1a1a,#333)" onclick="setWallpaperGradient('linear-gradient(135deg,#000,#1a1a1a,#333)',this)"></div>
      <div class="color-preset" style="background:linear-gradient(135deg,#06beb6,#48b1bf)" onclick="setWallpaperGradient('linear-gradient(135deg,#06beb6,#48b1bf)',this)"></div>
      <div class="color-preset" style="background:linear-gradient(135deg,#fc466b,#3f5efb)" onclick="setWallpaperGradient('linear-gradient(135deg,#fc466b,#3f5efb)',this)"></div>
    </div>
    <div class="section-title" style="margin-top:16px">自定义壁纸 URL</div>
    <input class="url-input" id="wallpaperUrlInput" placeholder="输入图片 URL..." oninput="previewWallpaperUrl(this.value)">
    <button class="apply-btn" onclick="applyWallpaperUrl()">应用 URL 壁纸</button>
    <div style="margin-top:10px">
      <button class="apply-btn" style="background:#34C759" onclick="document.getElementById('wallpaperFileInput').click()">从相册选择壁纸</button>
      <input type="file" id="wallpaperFileInput" accept="image/*" onchange="applyWallpaperFile(this)">
    </div>
    <div class="section-title" style="margin-top:24px">软件图标</div>
    <div class="settings-section">
      <div class="settings-row">
        <div class="settings-row-label">选择图标</div>
        <select id="iconSelect" style="border:none;background:transparent;color:#8e8e93;font-size:15px;font-family:inherit;outline:none">
          <option value="iconWechat">微信</option>
          <option value="iconAI">AI 助手</option>
        </select>
      </div>
    </div>
    <input class="url-input" id="iconUrlInput" placeholder="输入图标图片 URL...">
    <button class="apply-btn" onclick="applyIconUrl()">应用图标 URL</button>
    <div style="margin-top:10px">
      <button class="apply-btn" style="background:#34C759" onclick="document.getElementById('iconFileInput').click()">从相册选择图标</button>
      <input type="file" id="iconFileInput" accept="image/*" onchange="applyIconFile(this)">
    </div>
  </div>
</div>

<!-- ===== PRESET PANEL ===== -->
<div class="panel" id="presetPanel">
  <div class="panel-header">
    <button class="panel-back" onclick="closePanel('presetPanel')">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      返回
    </button>
    <div class="panel-title">预设</div>
    <div class="panel-spacer"></div>
  </div>
  <div class="panel-body">
    <div class="section-title">AI 人设预设</div>
    <div class="preset-item selected" onclick="selectPreset(this,'你是一位智能AI助手，友善、专业、乐于助人。')">
      <div class="preset-name">🤖 默认助手</div>
      <div class="preset-desc">友善专业的通用AI助手</div>
    </div>
    <div class="preset-item" onclick="selectPreset(this,'你是一位温柔体贴的女朋友，说话可爱，关心对方，语气亲密。')">
      <div class="preset-name">💕 虚拟女友</div>
      <div class="preset-desc">温柔体贴、甜蜜陪伴</div>
    </div>
    <div class="preset-item" onclick="selectPreset(this,'你是一位专业的编程专家，擅长多种编程语言，给出清晰的代码和解释。')">
      <div class="preset-name">💻 编程专家</div>
      <div class="preset-desc">代码讲解、技术支持</div>
    </div>
    <div class="preset-item" onclick="selectPreset(this,'你是一位知识渊博的历史学家，专注中国历史，讲故事生动有趣。')">
      <div class="preset-name">📚 历史学者</div>
      <div class="preset-desc">历史故事、文化解读</div>
    </div>
    <div class="preset-item" onclick="selectPreset(this,'你是一位专业的心理咨询师，善于倾听，给出温暖的建议。')">
      <div class="preset-name">🧠 心理顾问</div>
      <div class="preset-desc">情绪疏导、心理健康</div>
    </div>
    <div class="section-title" style="margin-top:16px">自定义人设</div>
    <div class="settings-section">
      <div class="settings-row" style="flex-direction:column;align-items:flex-start;gap:8px">
        <textarea id="customPresetInput" style="width:100%;height:80px;border:none;outline:none;font-size:14px;font-family:inherit;resize:none;color:#000" placeholder="输入自定义人设描述..."></textarea>
      </div>
    </div>
    <button class="apply-btn" onclick="applyCustomPreset()">应用自定义人设</button>
  </div>
</div>

<!-- ===== AI CHAT PANEL ===== -->
<div class="panel" id="aiChatPanel">
  <div class="panel-header">
    <button class="panel-back" onclick="closePanel('aiChatPanel')">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      返回
    </button>
    <div class="panel-title">AI 助手</div>
    <div class="panel-spacer"></div>
  </div>
  <div class="ai-messages" id="aiMessages">
    <div class="ai-msg bot">
      <div class="ai-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
      <div class="ai-bubble">你好！我是 AI 助手，有什么可以帮你的？😊</div>
    </div>
  </div>
  <div class="ai-input-area">
    <textarea class="ai-input" id="aiInput" rows="1" placeholder="输入消息..." onkeydown="handleAiKeydown(event)"></textarea>
    <button class="ai-send" onclick="sendAiMessage()">
      <svg viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
    </button>
  </div>
</div>

<!-- ===== WECHAT PANEL ===== -->
<div class="panel" id="wechatPanel" style="background:#ededed">
  <div class="wechat-header">
    <button class="wechat-back-btn" onclick="closePanel('wechatPanel')">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="#07C160" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      返回
    </button>
    <div class="wechat-header-title" id="wechatHeaderTitle">微信</div>
  </div>
  <div class="wechat-content">
    <!-- Chats -->
    <div class="wechat-tab active" id="tab-chats">
      <div style="height:8px"></div>
      <div class="chat-list-item" onclick="openConversation('小一','#FF6B6B','小')">
        <div class="chat-avatar" style="background:#FF6B6B">小</div>
        <div class="chat-info">
          <div class="chat-name">小一</div>
          <div class="chat-preview">你好呀，在吗？</div>
        </div>
      </div>
      <div class="chat-list-item" onclick="openConversation('小二','#007AFF','二')">
        <div class="chat-avatar" style="background:#007AFF">二</div>
        <div class="chat-info">
          <div class="chat-name">小二</div>
          <div class="chat-preview">晚上一起吃饭吗？</div>
        </div>
      </div>
      <div class="chat-list-item" onclick="openConversation('小三','#FF9500','三')">
        <div class="chat-avatar" style="background:#FF9500">三</div>
        <div class="chat-info">
          <div class="chat-name">小三</div>
          <div class="chat-preview">作业发我一下</div>
        </div>
      </div>
    </div>
    <!-- Contacts -->
    <div class="wechat-tab" id="tab-contacts">
      <div style="height:8px"></div>
      <div class="contact-item">
        <div class="contact-avatar" style="background:#FF6B6B">小</div>
        <div class="contact-name">小一</div>
      </div>
      <div class="contact-item">
        <div class="contact-avatar" style="background:#007AFF">二</div>
        <div class="contact-name">小二</div>
      </div>
      <div class="contact-item">
        <div class="contact-avatar" style="background:#FF9500">三</div>
        <div class="contact-name">小三</div>
      </div>
    </div>
    <!-- Discover -->
    <div class="wechat-tab" id="tab-discover">
      <div style="height:8px"></div>
      <div class="discover-section">
        <div class="discover-item"><div class="discover-icon" style="background:#FF6B6B">🌍</div><div class="discover-label">朋友圈</div><div class="discover-arrow">›</div></div>
        <div class="discover-item"><div class="discover-icon" style="background:#09C7F7">📷</div><div class="discover-label">视频号</div><div class="discover-arrow">›</div></div>
        <div class="discover-item"><div class="discover-icon" style="background:#FFC300">📖</div><div class="discover-label">扫一扫</div><div class="discover-arrow">›</div></div>
        <div class="discover-item"><div class="discover-icon" style="background:#07C160">🔍</div><div class="discover-label">搜一搜</div><div class="discover-arrow">›</div></div>
      </div>
      <div class="discover-section">
        <div class="discover-item"><div class="discover-icon" style="background:#5856D6">🎮</div><div class="discover-label">游戏</div><div class="discover-arrow">›</div></div>
        <div class="discover-item"><div class="discover-icon" style="background:#FF9500">🛒</div><div class="discover-label">购物</div><div class="discover-arrow">›</div></div>
      </div>
    </div>
    <!-- Me -->
    <div class="wechat-tab" id="tab-me">
      <div style="height:8px"></div>
      <div class="me-profile">
        <div class="me-avatar">我</div>
        <div><div class="me-name">用户昵称</div><div class="me-id">微信号: user_001</div></div>
      </div>
      <div class="discover-section">
        <div class="discover-item"><div class="discover-icon" style="background:#FF9500">💰</div><div class="discover-label">支付</div><div class="discover-arrow">›</div></div>
        <div class="discover-item"><div class="discover-icon" style="background:#07C160">⭐</div><div class="discover-label">收藏</div><div class="discover-arrow">›</div></div>
        <div class="discover-item"><div class="discover-icon" style="background:#007AFF">🖼</div><div class="discover-label">朋友圈</div><div class="discover-arrow">›</div></div>
      </div>
      <div class="discover-section">
        <div class="discover-item"><div class="discover-icon" style="background:#636366">⚙️</div><div class="discover-label">设置</div><div class="discover-arrow">›</div></div>
      </div>
    </div>

    <!-- Chat Conversation -->
    <div id="chatConversation">
      <div class="conv-header">
        <button class="conv-back" onclick="closeConversation()">
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke="#07C160" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          微信
        </button>
        <div class="conv-name" id="convName">小一</div>
        <div class="conv-spacer"></div>
      </div>
      <div class="conv-messages" id="convMessages"></div>
      <div class="conv-input-area">
        <textarea class="conv-input" id="convInput" rows="1" placeholder="发消息..."></textarea>
        <button class="conv-send" onclick="sendConvMessage()">
          <svg viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  </div>
  <div class="wechat-tabs">
    <button class="wechat-tab-btn active" id="wbtn-chats" onclick="switchWechatTab('chats',this)">
      <div class="wechat-tab-icon">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M14 3C8.48 3 4 7.03 4 12c0 2.76 1.36 5.22 3.5 6.92V22l3.5-2c1 .28 2.05.43 3.15.43.35 0 .7-.02 1.04-.05.5-.05.97-.5.97-1a.97.97 0 00-1.04-.9C14.74 18.5 14.37 18.5 14 18.5c-.9 0-1.78-.12-2.6-.34L9 19.5v-2.4l-.5-.38C6.6 15.67 5.5 13.93 5.5 12c0-4.14 3.8-7.5 8.5-7.5s8.5 3.36 8.5 7.5c0 .53.44.97.97.97s.97-.44.97-.97C24 7.03 19.52 3 14 3z" fill="#8e8e93"/>
          <path d="M19 14c-3.86 0-7 2.69-7 6 0 1.73.84 3.27 2.18 4.36L13 27l3.1-1.76c.93.26 1.9.4 2.9.4 3.86 0 7-2.69 7-6s-3.14-6-7-6zm-2.5 6.5a1 1 0 110-2 1 1 0 010 2zm2.5 0a1 1 0 110-2 1 1 0 010 2zm2.5 0a1 1 0 110-2 1 1 0 010 2z" fill="#8e8e93"/>
        </svg>
      </div>
      <span class="wechat-tab-label">微信</span>
    </button>
    <button class="wechat-tab-btn" id="wbtn-contacts" onclick="switchWechatTab('contacts',this)">
      <div class="wechat-tab-icon">
        <svg viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="9" r="5" fill="#8e8e93"/>
          <path d="M4 23c0-5.52 4.48-10 10-10s10 4.48 10 10" fill="#8e8e93"/>
        </svg>
      </div>
      <span class="wechat-tab-label">通讯录</span>
    </button>
    <button class="wechat-tab-btn" id="wbtn-discover" onclick="switchWechatTab('discover',this)">
      <div class="wechat-tab-icon">
        <svg viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="10" stroke="#8e8e93" stroke-width="2" fill="none"/>
          <path d="M9 14a5 5 0 0010 0" stroke="#8e8e93" stroke-width="1.5" fill="none"/>
          <line x1="14" y1="4" x2="14" y2="24" stroke="#8e8e93" stroke-width="1.5"/>
        </svg>
      </div>
      <span class="wechat-tab-label">发现</span>
    </button>
    <button class="wechat-tab-btn" id="wbtn-me" onclick="switchWechatTab('me',this)">
      <div class="wechat-tab-icon">
        <svg viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="10" r="5" fill="#8e8e93"/>
          <path d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9" fill="#8e8e93"/>
        </svg>
      </div>
      <span class="wechat-tab-label">我</span>
    </button>
  </div>
</div

<script>
let currentPreset = '你是一位智能AI助手，友善、专业、乐于助人。';
let aiConversationHistory = [];
let currentConvName = '', currentConvColor = '', currentConvChar = '';
const convHistories = { '小一':[], '小二':[], '小三':[] };
const defaultConvMessages = {
  '小一':[{from:'them',text:'你好呀，在吗？'}],
  '小二':[{from:'them',text:'晚上一起吃饭吗？'}],
  '小三':[{from:'them',text:'作业发我一下'}]
};

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  document.getElementById('statusTime').textContent = `${h}:${m}`;
  document.getElementById('calDateIcon').textContent = now.getDate();
}
updateClock();
setInterval(updateClock, 10000);

function openPanel(id) { document.getElementById(id).classList.add('open'); }
function closePanel(id) { document.getElementById(id).classList.remove('open'); }
function openWechat() { openPanel('wechatPanel'); }

function switchWechatTab(tab, btn) {
  document.querySelectorAll('.wechat-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.wechat-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  btn.classList.add('active');
  const titles = {chats:'微信',contacts:'通讯录',discover:'发现',me:'我'};
  document.getElementById('wechatHeaderTitle').textContent = titles[tab];
}

function openConversation(name, color, char) {
  currentConvName = name; currentConvColor = color; currentConvChar = char;
  document.getElementById('convName').textContent = name;
  const msgs = document.getElementById('convMessages');
  msgs.innerHTML = '';
  if (!convHistories[name].length && defaultConvMessages[name]) {
    convHistories[name] = [...defaultConvMessages[name]];
  }
  convHistories[name].forEach(m => renderConvMsg(m.from, m.text, color, char, false));
  msgs.scrollTop = msgs.scrollHeight;
  document.getElementById('chatConversation').classList.add('open');
}
function closeConversation() { document.getElementById('chatConversation').classList.remove('open'); }
function renderConvMsg(from, text, color, char, scroll=true) {
  const msgs = document.getElementById('convMessages');
  const row = document.createElement('div');
  row.className = 'msg-row ' + (from==='me'?'mine':'theirs');
  row.innerHTML = `<div class="msg-avatar" style="background:${from==='me'?'#07C160':color}">${from==='me'?'我':char}</div><div class="msg-bubble">${text}</div>`;
  msgs.appendChild(row);
  if (scroll) msgs.scrollTop = msgs.scrollHeight;
}
function sendConvMessage() {
  const input = document.getElementById('convInput');
  const text = input.value.trim();
  if (!text) return;
  convHistories[currentConvName].push({from:'me',text});
  renderConvMsg('me', text, currentConvColor, currentConvChar);
  input.value = '';
  document.querySelectorAll('.chat-list-item').forEach(item => {
    if (item.textContent.includes(currentConvName)) item.querySelector('.chat-preview').textContent = text;
  });
}

async function sendAiMessage() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  const apiBase = document.getElementById('apiBaseInput').value.trim() || 'https://api.openai.com/v1';
  const model = document.getElementById('modelInput').value.trim() || 'gpt-4o';
  const now = new Date();
  const timeContext = `当前时间：${now.toLocaleString('zh-CN')}`;
  appendAiMsg('user', text);
  aiConversationHistory.push({role:'user', content: text});
  const typing = appendTyping();
  try {
    if (!apiKey) throw new Error('请先在设置中填写 API Key');
    const res = await fetch(apiBase+'/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
      body: JSON.stringify({
        model,
        messages:[
          {role:'system', content: currentPreset+'\n\n'+timeContext},
          ...aiConversationHistory
        ]
      })
    });
    const data = await res.json();
    typing.remove();
    if (data.error) throw new Error(data.error.message);
    const reply = data.choices[0].message.content;
    aiConversationHistory.push({role:'assistant', content: reply});
    appendAiMsg('bot', reply);
  } catch(e) {
    typing.remove();
    appendAiMsg('bot', '⚠️ '+e.message);
  }
}
function appendAiMsg(role, text) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg '+role;
  if (role==='bot') {
    div.innerHTML = `<div class="ai-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div><div class="ai-bubble">${text}</div>`;
  } else {
    div.innerHTML = `<div class="ai-bubble">${text}</div>`;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}
function appendTyping() {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg bot';
  div.innerHTML = `<div class="ai-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}
function handleAiKeydown(e) {
  if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendAiMessage(); }
}

function setWallpaperGradient(gradient, el) {
  document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('wallpaperBg').style.background = gradient;
  document.getElementById('wallpaperImg').style.opacity = '0';
  document.getElementById('wallpaperPreview').style.background = gradient;
  document.getElementById('wallpaperPreview').style.backgroundImage = '';
  document.body.style.background = gradient;
}
function previewWallpaperUrl(url) {
  if (url) { document.getElementById('wallpaperPreview').style.backgroundImage = `url(${url})`; document.getElementById('wallpaperPreview').style.backgroundSize = 'cover'; }
}
function applyWallpaperUrl() {
  const url = document.getElementById('wallpaperUrlInput').value.trim();
  if (!url) return;
  document.getElementById('wallpaperImg').style.backgroundImage = `url(${url})`;
  document.getElementById('wallpaperImg').style.opacity = '1';
}
function applyWallpaperFile(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const url = e.target.result;
    document.getElementById('wallpaperImg').style.backgroundImage = `url(${url})`;
    document.getElementById('wallpaperImg').style.backgroundSize = 'cover';
    document.getElementById('wallpaperImg').style.backgroundPosition = 'center';
    document.getElementById('wallpaperImg').style.opacity = '1';
    document.getElementById('wallpaperPreview').style.backgroundImage = `url(${url})`;
    document.getElementById('wallpaperPreview').style.backgroundSize = 'cover';
  };
  reader.readAsDataURL(file);
}
function applyIconUrl() {
  const iconId = document.getElementById('iconSelect').value;
  const url = document.getElementById('iconUrlInput').value.trim();
  if (!url||!iconId) return;
  const el = document.getElementById(iconId);
  el.style.backgroundImage = `url(${url})`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
  el.classList.add('has-custom-img'); el.innerHTML = '';
}
function applyIconFile(input) {
  const iconId = document.getElementById('iconSelect').value;
  const file = input.files[0]; if (!file||!iconId) return;
  const reader = new FileReader();
  reader.onload = e => {
    const el = document.getElementById(iconId);
    el.style.backgroundImage = `url(${e.target.result})`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
    el.classList.add('has-custom-img'); el.innerHTML = '';
  };
  reader.readAsDataURL(file);
}
function selectPreset(el, text) {
  document.querySelectorAll('.preset-item').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected'); currentPreset = text; aiConversationHistory = [];
}
function applyCustomPreset() {
  const t = document.getElementById('customPresetInput').value.trim();
  if (!t) return;
  currentPreset = t; aiConversationHistory = [];
  document.querySelectorAll('.preset-item').forEach(p => p.classList.remove('selected'));
  alert('自定义人设已应用，对话已重置');
}
</script>
</body>
</html>
