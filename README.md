# Craft Station 官网

官网可部署到 Vercel，并包含动态版本公告与下载统计 API。

## 动态功能

- `GET /api/releases`：读取 `kriswu-dev/craft-station-site` 的 GitHub Releases，返回最新版本、公告正文，以及所有安装包 Release 资产的累计下载数。
- `GET /api/download`：跳转到最新稳定 Release 中的 `Craft-Station-Setup.exe`。GitHub 自动记录 Release 资产的下载次数。
- API 缓存 5 分钟，发布新版本后官网通常在 5 分钟内更新。

如果还没有 GitHub Release，版本卡片会显示等待首个版本；下载接口暂时回退到仓库现有安装包。要启用准确下载统计，请创建 GitHub Release 并把安装程序作为 Release 资产上传。

## 部署

将本文件夹导入 Vercel，项目根目录设为 `outputs/Craft-Station-官网`，框架选择 Other。GitHub Pages 不能运行 `api/` 中的 Node.js 函数，因此迁移到 Vercel 后，官网使用 Vercel 提供的域名；需要自定义域名时再在 Vercel 配置 DNS。

直接打开 `index.html` 只能预览静态页面；动态版本与下载统计需在 Vercel 部署后使用。
