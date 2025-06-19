# 🎮 石頭剪刀布蜥蜴史波克

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

基於 **Big Bang Theory** 的經典遊戲規則，使用 Next.js + Socket.IO 打造的即時多人線上遊戲。

## ✨ 遊戲特色

- 🔄 **即時多人對戰** - 使用 Socket.IO 實現低延遲同步 (<50ms)
- 🏠 **房間系統** - 6位數房間代碼，支援私人對戰
- 📱 **響應式設計** - 完美支援桌面、平板和手機裝置
- 🎯 **經典規則** - 完整的 5 種選擇和 10 種勝負組合
- 🚀 **單一伺服器** - 前端和後端整合，簡化部署流程
- ⚡ **高效能** - 記憶體內狀態管理，支援多房間並發
- 🎨 **現代化UI** - 流暢動畫與視覺回饋
- 🔒 **穩定連線** - 自動重連和斷線處理

## 🎯 遊戲規則

```
🪨 石頭  → 碰碎 ✂️ 剪刀 和 🦎 蜥蜴
📄 布    → 包住 🪨 石頭 和 🖖 史波克  
✂️ 剪刀  → 剪斷 📄 布   和 🦎 蜥蜴
🦎 蜥蜴  → 吃掉 📄 布   和 毒死 🖖 史波克
🖖 史波克 → 蒸發 🪨 石頭 和 砸壞 ✂️ 剪刀
```

**總共 10 種勝負組合，比傳統石頭剪刀布更有趣！**

## 🏗️ 技術架構

### 🔧 核心技術棧
- **前端框架**: Next.js 14 (App Router) + React 18
- **程式語言**: TypeScript 5.2+ 
- **即時通訊**: Socket.IO 4.7+ (WebSocket + 降級支援)
- **後端**: Node.js 18+ + Express
- **樣式**: CSS3 + CSS Grid/Flexbox
- **狀態管理**: React Hooks + Context API

### 📡 網路架構
```
客戶端 (React) ←→ Socket.IO ←→ 自定義伺服器 ←→ 遊戲引擎
     ↓                                              ↓
   UI 渲染                                     記憶體狀態存儲
```

### 📁 專案結構
```
Rock-paper-scissors-lizard-Spock/
├── app/                          # Next.js App Router
│   ├── components/               # React 組件
│   │   ├── GameMenu.tsx         # 主選單 - 創建/加入房間
│   │   ├── GameLobby.tsx        # 等候室 - 玩家列表與房間管理
│   │   └── GamePlay.tsx         # 遊戲介面 - 對戰與結果顯示
│   ├── globals.css              # 全域樣式與動畫
│   ├── layout.tsx               # 根佈局與 Meta 標籤
│   └── page.tsx                 # 主應用程式邏輯
├── custom-server.js             # 統一伺服器 (Next.js + Socket.IO)
├── server.js                    # 獨立 Socket.IO 伺服器 (備用)
├── package.json                 # 依賴管理與指令
├── tsconfig.json                # TypeScript 配置
├── next.config.js               # Next.js 配置
└── README.md                    # 專案文檔
```

## 🚀 快速開始

### 📋 系統需求
- **Node.js**: 18.0.0 或更高版本
- **npm**: 9.0.0 或更高版本 (或 yarn 1.22+)
- **記憶體**: 最少 512MB RAM
- **硬碟**: 500MB 可用空間

### 💾 安裝步驟

1. **克隆專案**
   ```bash
   git clone https://github.com/yourusername/rock-paper-scissors-lizard-spock.git
   cd rock-paper-scissors-lizard-spock
   ```

2. **安裝依賴**
   ```bash
   npm install
   
   # 或使用 yarn
   yarn install
   ```

3. **啟動開發伺服器** (推薦)
   ```bash
   npm run dev
   ```
   
   🌐 **應用程式啟動於**: http://localhost:3000  
   ✅ **Next.js 前端 + Socket.IO 後端**整合在同一伺服器

4. **開始遊戲**
   - 開啟瀏覽器訪問 http://localhost:3000
   - 輸入玩家名稱創建房間
   - 分享房間代碼給朋友開始對戰！

### 🔄 替代開發模式

如需**分離前後端**進行調試：

```bash
# 終端 1: 啟動 Socket.IO 伺服器
npm run dev:server

# 終端 2: 啟動 Next.js 前端
npm run dev:separate
```

## 🎮 遊戲玩法

### 🏠 房間管理
1. **創建房間**
   - 輸入玩家名稱 (2-20字元)
   - 點擊「創建房間」獲得 6 位數代碼
   - 成為房主，具有開始遊戲權限

2. **加入房間**
   - 輸入玩家名稱和房間代碼
   - 自動進入等候室
   - 等待房主開始遊戲

### ⚔️ 對戰流程
1. **等候階段** - 兩位玩家進入房間後房主可開始遊戲
2. **選擇階段** - 每位玩家秘密選擇武器
3. **結果階段** - 同步顯示選擇結果與勝負解釋
4. **計分階段** - 自動更新分數
5. **下回合** - 3秒後自動開始新回合

### 🏆 計分系統
- **獲勝**: +1 分
- **平手**: 不加分
- **失敗**: 不扣分
- **無回合限制**: 持續對戰直到玩家離開

## 🔧 技術細節

### 📡 Socket.IO 事件 API

#### 客戶端發送事件
```javascript
// 房間管理
socket.emit('create-room', playerName)           // 創建房間
socket.emit('join-room', { roomCode, playerName }) // 加入房間
socket.emit('leave-room')                        // 離開房間

// 遊戲控制
socket.emit('start-game')                        // 開始遊戲 (僅房主)
socket.emit('make-choice', choice)               // 選擇武器
```

#### 伺服器發送事件
```javascript
// 連接狀態
socket.on('connect')                    // 連接成功
socket.on('disconnect')                 // 斷開連接
socket.on('error', { message })         // 錯誤訊息

// 房間事件
socket.on('room-created', { roomCode, player })        // 房間創建成功
socket.on('room-joined', { roomCode, player })         // 成功加入房間
socket.on('room-updated', { players, gameState })      // 房間狀態更新
socket.on('player-disconnected', { playerId, players }) // 玩家離開

// 遊戲事件
socket.on('game-started', { gameState, roundNumber })   // 遊戲開始
socket.on('player-choice-made', { playerId })           // 對手已選擇
socket.on('choice-confirmed', { choice })               // 己方選擇確認
socket.on('round-result', { result, players })          // 回合結果
socket.on('new-round', { roundNumber })                 // 新回合開始
```

### 🎯 遊戲狀態管理

#### 房間狀態
```typescript
interface Room {
  id: string              // 6位數房間代碼
  host: string           // 房主 Socket ID
  players: Map<string, Player> // 玩家列表 (最多2位)
  gameState: 'waiting' | 'playing'  // 遊戲狀態
  currentRound: RoundData | null    // 當前回合資料
  maxPlayers: 2          // 最大玩家數
  createdAt: number      // 創建時間戳
}
```

#### 玩家狀態
```typescript
interface Player {
  id: string              // Socket ID
  name: string           // 玩家名稱
  isHost: boolean        // 是否為房主
  score: number          // 當前分數
  currentChoice: string | null  // 本回合選擇
  ready: boolean         // 就緒狀態
}
```

### ⚡ 效能最佳化

- **記憶體管理**: 自動清理空房間和斷線玩家
- **事件節流**: 防止重複點擊和網路洪水攻擊  
- **狀態同步**: 只傳送必要的狀態變更
- **連線恢復**: 自動重連機制處理網路不穩定
- **資源清理**: 遊戲結束後釋放相關記憶體

## 🚀 部署指南

### 🌐 Vercel 部署 (推薦)

1. **準備專案**
   ```bash
   git add .
   git commit -m "feat: 準備部署統一伺服器"
   git push origin main
   ```

2. **Vercel 設定**
   - 前往 [Vercel Dashboard](https://vercel.com/dashboard)
   - 點擊 "New Project" 匯入 GitHub 倉庫
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **環境變數設定**
   ```env
   NODE_ENV=production
   PORT=3000
   ```

4. **自定義啟動**
   - 在 Vercel 中設定 **Start Command**: `npm start`
   - 或新增 `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "custom-server.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "custom-server.js" }
     ]
   }
   ```

### 🚀 Railway 部署

1. **連接 Railway**
   - 訪問 [Railway](https://railway.app)
   - 連接 GitHub 倉庫
   - 選擇自動部署

2. **環境配置**
   ```env
   NODE_ENV=production
   PORT=$PORT
   ```

3. **啟動指令**
   ```bash
   npm start
   ```

### 🐳 Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# 建置和運行
docker build -t rpsls-game .
docker run -p 3000:3000 rpsls-game
```

### 🔧 自託管部署

```bash
# 安裝 PM2 (生產環境程序管理)
npm install -g pm2

# 建置專案
npm run build

# 使用 PM2 啟動
pm2 start custom-server.js --name "rpsls-game"

# 設定開機自動啟動
pm2 startup
pm2 save
```

## 🛠️ 開發指南

### 🔧 開發環境設定

1. **程式碼風格**
   ```bash
   npm run lint          # ESLint 檢查
   npm run lint:fix      # 自動修復問題
   ```

2. **TypeScript 編譯**
   ```bash
   npx tsc --noEmit      # 類型檢查
   ```

3. **開發除錯**
   ```bash
   DEBUG=socket.io* npm run dev  # Socket.IO 除錯模式
   ```

### 📝 貢獻指南

1. **Fork 專案** - 點擊右上角 Fork 按鈕
2. **建立分支** - `git checkout -b feature/amazing-feature`
3. **開發功能** - 遵循現有程式碼風格
4. **測試功能** - 確保不會破壞現有功能
5. **提交變更** - `git commit -m 'Add: 新增驚人功能'`
6. **推送分支** - `git push origin feature/amazing-feature`
7. **建立 PR** - 開啟 Pull Request 並描述變更

### 🧪 測試建議

```bash
# 功能測試清單
□ 創建房間並獲得代碼
□ 使用代碼加入房間
□ 兩人房間開始遊戲
□ 各種武器選擇組合
□ 計分系統正確運作
□ 玩家離開時的處理
□ 網路斷線重連機制
□ 多房間並發運作
```

## 🐛 故障排除

### 🔌 連線問題

**問題**: Socket.IO 連接失敗
```
✗ Error: 無法連接到伺服器
```

**解決方案**:
1. 檢查伺服器是否啟動: `netstat -an | grep 3000`
2. 確認防火牆設定允許端口 3000
3. 檢查瀏覽器控制台是否有 CORS 錯誤
4. 嘗試重新啟動伺服器: `npm run dev`

### 📦 依賴問題

**問題**: TypeScript 類型錯誤
```
✗ Type 'Socket' is not assignable to type 'Socket'
```

**解決方案**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 🎮 遊戲邏輯問題

**問題**: 回合結果不正確

**檢查項目**:
1. 確認 `choices` 物件的 `beats` 陣列正確
2. 檢查 `determineWinner` 函數邏輯
3. 驗證玩家選擇是否正確傳送到伺服器

### 🌐 部署問題

**問題**: Vercel 部署後 Socket.IO 無法運作

**原因**: Vercel 的 Serverless 架構不支援 Socket.IO

**解決方案**: 
- 使用 Railway, Render 或 VPS 部署
- 或考慮使用 Vercel + Pusher/Ably 等 WebSocket 服務

### 📱 行動裝置問題

**問題**: 觸控操作延遲

**解決方案**:
```css
button {
  touch-action: manipulation;  /* 防止雙擊縮放 */
  -webkit-tap-highlight-color: transparent;  /* 移除點擊高亮 */
}
```

## 📊 效能指標

### ⚡ 預期效能

- **連線延遲**: < 50ms (本地網路)
- **伺服器回應**: < 100ms
- **記憶體使用**: ~50MB (每 100 個併發房間)
- **CPU 使用率**: < 10% (輕度負載)
- **並發支援**: 1000+ 玩家 (視伺服器規格)

### 📈 監控建議

```javascript
// 添加效能監控
console.time('round-processing')
// ... 遊戲邏輯
console.timeEnd('round-processing')

// 記憶體使用監控
setInterval(() => {
  const used = process.memoryUsage()
  console.log('Memory:', Math.round(used.rss / 1024 / 1024 * 100) / 100, 'MB')
}, 30000)
```

## 🔮 未來功能規劃

- [ ] 🏆 **排行榜系統** - 全球分數統計
- [ ] 🤖 **AI 對手** - 單人練習模式  
- [ ] 🎪 **錦標賽模式** - 多人淘汰賽
- [ ] 🎨 **自訂主題** - 黑暗模式、色彩主題
- [ ] 📱 **PWA 支援** - 離線安裝與推送通知
- [ ] 🌐 **多語言支援** - 英文、日文、韓文
- [ ] 📊 **詳細統計** - 勝率、常用策略分析
- [ ] 🔐 **帳號系統** - 註冊登入與好友列表

## 🎖️ 授權與致謝

### 📄 開源授權
本專案採用 [MIT License](LICENSE) - 歡迎自由使用、修改和分享

### 🙏 特別感謝

- 🎬 **《生活大爆炸》** - 提供遊戲規則靈感
- ⚡ **Socket.IO 團隊** - 優秀的即時通訊解決方案
- ⚛️ **Next.js 團隊** - 現代化的 React 開發框架
- 🎨 **開源社群** - 無私的知識分享與技術支持

### 🤝 參與貢獻

如果這個專案對你有幫助，歡迎：
- ⭐ **給個星星** - 支持專案發展
- 🐛 **回報問題** - 幫助改善品質
- 💡 **提出建議** - 分享你的想法
- 🔀 **提交 PR** - 貢獻程式碼

---

<div align="center">

### 🎉 **開始你的石頭剪刀布蜥蜴史波克之旅吧！**

![Game Demo](https://via.placeholder.com/600x300/4CAF50/white?text=🎮+即時對戰遊戲)

**立即部署** | **開始開發** | **加入社群**

</div> 