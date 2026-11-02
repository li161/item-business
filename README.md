# 幕间 MÙJIAN｜窗帘品牌展示页

一个轻量、响应式的窗帘品牌营销落地页，纯 HTML/CSS/JavaScript，无需安装依赖或构建。

## 本地预览

直接用浏览器打开 `index.html`，或运行：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 发布到 GitHub Pages

在仓库 Settings → Pages → Build and deployment 中选择 Deploy from a branch，分支选 `main`，目录选 `/ (root)`，保存后等待 Pages 发布。

## 页面交互

- 首页窗帘开合体验：滑块控制，也支持直接拖动场景
- 面料卡片切换：亚麻、绒感遮光、轻透柔纱
- 预约咨询弹窗：填写信息后复制咨询文本；不会将个人信息发送到服务器
- 移动端响应式布局与减少动态效果偏好支持

图片使用 Unsplash 远程图片，Google Fonts 用于字体呈现；离线访问时将回退到系统字体，远程图片可能无法显示。
