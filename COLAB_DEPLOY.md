# 🌐 PonyTown 云端一键部署

**5分钟内在Google Colab部署PonyTown多人在线游戏！**

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Ritori2022/pony-town-ready/blob/main/PonyTown_Colab_Deploy.ipynb)

## 🚀 特色

- 🌐 **无需本地安装** - 直接在Google Colab运行
- 🔗 **公网访问** - 使用ngrok映射，任何人都可访问
- ⚡ **5分钟部署** - 点击运行即可
- 🎯 **零配置** - 所有依赖自动安装
- 🎮 **完整游戏** - 2D像素多人在线RPG
- 📱 **跨平台** - 支持手机和电脑浏览器

## 🎯 快速开始

### 方法1: 直接使用Colab (推荐)
1. 点击上方的 **"Open in Colab"** 按钮
2. 按顺序运行代码块
3. 等待ngrok公网链接生成
4. 点击链接开始游戏！

### 方法2: 从GitHub启动
1. 访问 [pony-town-ready](https://github.com/Ritori2022/pony-town-ready)
2. 点击 `PonyTown_Colab_Deploy.ipynb`
3. 点击 "Open in Colab"

## 🔧 部署流程

```mermaid
graph LR
    A[点击Colab按钮] --> B[安装Node.js]
    B --> C[下载游戏]
    C --> D[安装依赖]
    D --> E[启动服务器]
    E --> F[创建ngrok隧道]
    F --> G[🎮 开始游戏]
```

## 🎮 游戏访问

部署成功后，你会得到：

- 🌐 **公网游戏地址**: `https://xxxxx.ngrok.io`
- 🚀 **TestPony一键登录**: `https://xxxxx.ngrok.io/auth/local/68acdc3543a9ff7ce48a3daa`
- 📋 **标准登录页面**: `https://xxxxx.ngrok.io/mock-login.html`

### 🔐 测试账户
- **账户ID**: `68acdc3543a9ff7ce48a3daa`
- **角色名**: `TestPony`
- **密码**: `test`

## ⚠️ 限制和注意事项

### Colab限制
- **会话时长**: 免费用户最多12小时
- **计算资源**: 有内存和CPU限制
- **网络带宽**: 可能影响多人游戏体验

### ngrok限制
- **免费版连接数**: 有限制
- **带宽**: 免费版有流量限制
- **隧道数量**: 最多4个同时隧道

### 游戏数据
- **临时性**: 会话结束后数据丢失
- **不持久**: 无法保存游戏进度
- **测试用途**: 主要用于体验和演示

## 🚨 故障排除

### 常见问题

1. **服务启动失败**
   ```python
   # 重新运行服务器启动代码块
   ```

2. **ngrok连接超时**
   ```python
   # 等待更长时间或注册ngrok账户获取authtoken
   ```

3. **游戏加载缓慢**
   ```python
   # Colab网络环境导致，属于正常现象
   ```

4. **多人连接问题**
   ```python
   # 免费ngrok有连接限制，考虑升级账户
   ```

### 解决方案

| 问题 | 解决方案 |
|------|----------|
| 服务器无响应 | 重新运行"步骤5" |
| ngrok隧道断开 | 重新运行ngrok代码块 |
| 游戏白屏 | 刷新浏览器页面 |
| 连接被拒绝 | 检查防火墙设置 |

## 🌟 使用场景

### 适合用途
- ✅ **快速体验** - 试玩PonyTown游戏
- ✅ **演示展示** - 向朋友展示游戏
- ✅ **开发测试** - 测试修改和功能
- ✅ **教学用途** - 演示软件修复过程

### 不适合用途
- ❌ **长期游戏** - 会话有时间限制
- ❌ **大量用户** - 免费服务有连接限制
- ❌ **数据保存** - 无法持久化存储
- ❌ **生产环境** - 仅供测试和体验

## 📊 性能预期

| 指标 | 预期值 |
|------|--------|
| 启动时间 | 3-5分钟 |
| 响应延迟 | 100-500ms |
| 并发用户 | 5-20人 |
| 会话时长 | 最多12小时 |

## 🔗 相关资源

- [pony-town-ready 仓库](https://github.com/Ritori2022/pony-town-ready) - 即开即用版本
- [pony-town-reboot](https://github.com/Ritori2022/pony-town-reboot) - 修复过程文档
- [Google Colab](https://colab.research.google.com/) - 云端Jupyter环境
- [ngrok](https://ngrok.com/) - 内网穿透工具

## 🎉 成就解锁

**从本地部署到云端一键启动！**

这个Colab部署方案实现了：
- 🏛️ **软件考古学** - 6年前游戏的现代云端部署
- 🌐 **无服务器游戏** - 无需购买服务器即可在线游玩
- 📱 **跨平台访问** - 支持任何设备的浏览器
- ⚡ **即开即用** - 真正的一键部署体验

---

**🚀 立即体验：点击上方的 "Open in Colab" 按钮开始你的PonyTown之旅！**

*这个项目展示了如何将经典游戏带到现代云端环境中，让任何人都能轻松体验6年前的多人在线游戏！* 🌟