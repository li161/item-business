# 幕间 MÙJIAN｜窗帘美学展厅

一个轻量的窗帘品牌展示网站，纯 HTML/CSS/JavaScript，无需安装依赖或构建。

## 页面体验

- **窗帘款式展厅**：5 款窗帘，中心款放大，两侧款式带透视、景深与旋转过渡。
- **多种切换方式**：左右箭头、点击两侧款式、底部圆点、触屏滑动、键盘左右方向键。
- **空间应用效果**：客厅、卧室、落地窗、书房四种环境；切换环境时保留当前窗帘款式。
- **预约咨询**：填写称呼与联系方式后复制咨询文本；不会自动上传个人信息。
- **响应式布局**：适配桌面与手机。

## 本地预览

直接打开 `index.html`，或运行：

```bash
python3 -m http.server 8080
```

访问 `http://localhost:8080`。

## GitHub Pages

仓库已加入 GitHub Actions 自动部署工作流：`.github/workflows/deploy-pages.yml`。
首次启用时，在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。之后推送到 `main` 会自动部署。

图片来自 Unsplash，字体来自 Google Fonts；需要联网加载远程资源。
