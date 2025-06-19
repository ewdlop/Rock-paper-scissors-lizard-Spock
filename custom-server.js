const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

// 初始化 Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// 遊戲狀態管理
const gameRooms = new Map()
const playerSockets = new Map()

// 遊戲選項和規則
const choices = {
  rock: { name: '石頭', emoji: '🪨', beats: ['scissors', 'lizard'] },
  paper: { name: '布', emoji: '📄', beats: ['rock', 'spock'] },
  scissors: { name: '剪刀', emoji: '✂️', beats: ['paper', 'lizard'] },
  lizard: { name: '蜥蜴', emoji: '🦎', beats: ['paper', 'spock'] },
  spock: { name: '史波克', emoji: '🖖', beats: ['rock', 'scissors'] }
}

const winExplanations = {
  'rock-scissors': '石頭碰碎剪刀',
  'rock-lizard': '石頭碰碎蜥蜴',
  'paper-rock': '布包住石頭',
  'paper-spock': '布反駁史波克',
  'scissors-paper': '剪刀剪斷布',
  'scissors-lizard': '剪刀砍斷蜥蜴',
  'lizard-paper': '蜥蜴吃掉布',
  'lizard-spock': '蜥蜴毒死史波克',
  'spock-rock': '史波克蒸發石頭',
  'spock-scissors': '史波克砸壞剪刀'
}

// 輔助函數
function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase()
}

function createRoom(hostSocketId, hostName) {
  const roomCode = generateRoomCode()
  const room = {
    id: roomCode,
    host: hostSocketId,
    players: new Map(),
    gameState: 'waiting',
    currentRound: null,
    maxPlayers: 2,
    createdAt: Date.now()
  }
  
  room.players.set(hostSocketId, {
    id: hostSocketId,
    name: hostName,
    isHost: true,
    score: 0,
    currentChoice: null,
    ready: true
  })
  
  gameRooms.set(roomCode, room)
  playerSockets.set(hostSocketId, roomCode)
  
  return room
}

function joinRoom(roomCode, socketId, playerName) {
  const room = gameRooms.get(roomCode)
  if (!room) return { success: false, error: '房間不存在' }
  
  if (room.players.size >= room.maxPlayers) {
    return { success: false, error: '房間已滿' }
  }
  
  room.players.set(socketId, {
    id: socketId,
    name: playerName,
    isHost: false,
    score: 0,
    currentChoice: null,
    ready: true
  })
  
  playerSockets.set(socketId, roomCode)
  return { success: true, room }
}

function startNewRound(room) {
  room.currentRound = {
    choices: new Map(),
    result: null,
    explanation: '',
    roundNumber: (room.currentRound?.roundNumber || 0) + 1
  }
  
  for (const player of room.players.values()) {
    player.currentChoice = null
  }
}

function processRoundResult(room) {
  const players = Array.from(room.players.values())
  const [player1, player2] = players
  const choice1 = room.currentRound.choices.get(player1.id)
  const choice2 = room.currentRound.choices.get(player2.id)
  
  const winner = determineWinner(choice1, choice2)
  const explanation = getExplanation(choice1, choice2, winner)
  
  if (winner === 'player1') {
    player1.score++
  } else if (winner === 'player2') {
    player2.score++
  }
  
  room.currentRound.result = {
    winner,
    explanation,
    choices: {
      [player1.id]: { choice: choice1, name: player1.name },
      [player2.id]: { choice: choice2, name: player2.name }
    }
  }
  
  return room.currentRound.result
}

function determineWinner(choice1, choice2) {
  if (choice1 === choice2) return 'tie'
  if (choices[choice1].beats.includes(choice2)) return 'player1'
  return 'player2'
}

function getExplanation(choice1, choice2, winner) {
  if (winner === 'tie') return '平手！'
  
  const winningChoice = winner === 'player1' ? choice1 : choice2
  const losingChoice = winner === 'player1' ? choice2 : choice1
  const key = `${winningChoice}-${losingChoice}`
  
  return winExplanations[key] || ''
}

function handlePlayerDisconnect(io, socketId) {
  const roomCode = playerSockets.get(socketId)
  if (!roomCode) return
  
  const room = gameRooms.get(roomCode)
  if (!room) return
  
  const disconnectedPlayer = room.players.get(socketId)
  room.players.delete(socketId)
  playerSockets.delete(socketId)
  
  if (room.players.size === 0) {
    gameRooms.delete(roomCode)
    return
  }
  
  if (disconnectedPlayer?.isHost && room.players.size > 0) {
    const newHost = room.players.values().next().value
    newHost.isHost = true
    room.host = newHost.id
  }
  
  io.to(roomCode).emit('player-disconnected', {
    playerId: socketId,
    playerName: disconnectedPlayer?.name,
    players: Array.from(room.players.values()),
    canStart: room.players.size === 2
  })
  
  if (room.gameState === 'playing') {
    room.gameState = 'waiting'
    io.to(roomCode).emit('game-paused', {
      message: '玩家離開，遊戲暫停'
    })
  }
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('處理請求錯誤:', err)
      res.statusCode = 500
      res.end('內部伺服器錯誤')
    }
  })

  // 設定 Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  // Socket.IO 事件處理
  io.on('connection', (socket) => {
    console.log(`玩家連接: ${socket.id}`)
    
    // 創建房間
    socket.on('create-room', (playerName) => {
      try {
        const room = createRoom(socket.id, playerName)
        socket.join(room.id)
        
        socket.emit('room-created', {
          roomCode: room.id,
          player: room.players.get(socket.id)
        })
        
        io.to(room.id).emit('room-updated', {
          players: Array.from(room.players.values()),
          gameState: room.gameState,
          canStart: room.players.size === 2
        })
      } catch (error) {
        socket.emit('error', { message: '創建房間失敗' })
      }
    })
    
    // 加入房間
    socket.on('join-room', ({ roomCode, playerName }) => {
      try {
        const result = joinRoom(roomCode, socket.id, playerName)
        
        if (!result.success) {
          socket.emit('error', { message: result.error })
          return
        }
        
        socket.join(roomCode)
        
        socket.emit('room-joined', {
          roomCode,
          player: result.room.players.get(socket.id)
        })
        
        io.to(roomCode).emit('room-updated', {
          players: Array.from(result.room.players.values()),
          gameState: result.room.gameState,
          canStart: result.room.players.size === 2
        })
      } catch (error) {
        socket.emit('error', { message: '加入房間失敗' })
      }
    })
    
    // 開始遊戲
    socket.on('start-game', () => {
      try {
        const roomCode = playerSockets.get(socket.id)
        const room = gameRooms.get(roomCode)
        
        if (!room || !room.players.get(socket.id)?.isHost) {
          socket.emit('error', { message: '無權限開始遊戲' })
          return
        }
        
        room.gameState = 'playing'
        startNewRound(room)
        
        io.to(roomCode).emit('game-started', {
          gameState: room.gameState,
          roundNumber: room.currentRound.roundNumber
        })
      } catch (error) {
        socket.emit('error', { message: '開始遊戲失敗' })
      }
    })
    
    // 玩家選擇
    socket.on('make-choice', (choice) => {
      try {
        const roomCode = playerSockets.get(socket.id)
        const room = gameRooms.get(roomCode)
        
        if (!room || room.gameState !== 'playing') {
          socket.emit('error', { message: '遊戲狀態錯誤' })
          return
        }
        
        room.currentRound.choices.set(socket.id, choice)
        const player = room.players.get(socket.id)
        player.currentChoice = choice
        
        socket.to(roomCode).emit('player-choice-made', {
          playerId: socket.id,
          playerName: player.name
        })
        
        socket.emit('choice-confirmed', { choice })
        
        if (room.currentRound.choices.size === room.players.size) {
          const result = processRoundResult(room)
          
          io.to(roomCode).emit('round-result', {
            result,
            players: Array.from(room.players.values()),
            roundNumber: room.currentRound.roundNumber
          })
          
          setTimeout(() => {
            if (room.gameState === 'playing') {
              startNewRound(room)
              io.to(roomCode).emit('new-round', {
                roundNumber: room.currentRound.roundNumber
              })
            }
          }, 3000)
        }
      } catch (error) {
        socket.emit('error', { message: '處理選擇失敗' })
      }
    })
    
    // 離開房間
    socket.on('leave-room', () => {
      const roomCode = playerSockets.get(socket.id)
      if (roomCode) {
        socket.leave(roomCode)
        handlePlayerDisconnect(io, socket.id)
      }
    })
    
    // 斷線處理
    socket.on('disconnect', () => {
      console.log(`玩家斷線: ${socket.id}`)
      handlePlayerDisconnect(io, socket.id)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`🚀 伺服器運行在 http://${hostname}:${port}`)
      console.log('✅ 前端 + Socket.IO 已整合到同一個伺服器')
    })
}) 