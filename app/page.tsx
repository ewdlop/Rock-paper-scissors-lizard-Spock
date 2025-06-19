'use client'

import React, { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import GameMenu from './components/GameMenu'
import GameLobby from './components/GameLobby'
import GamePlay from './components/GamePlay'

// 遊戲狀態類型
export type GameState = 'menu' | 'lobby' | 'playing'

export interface Player {
  id: string
  name: string
  isHost: boolean
  score: number
  currentChoice: string | null
  ready: boolean
}

export interface GameChoice {
  name: string
  emoji: string
  beats: string[]
}

export interface RoundResult {
  winner: 'player1' | 'player2' | 'tie'
  explanation: string
  choices: {
    [playerId: string]: {
      choice: string
      name: string
    }
  }
}

// 遊戲選項
export const choices: { [key: string]: GameChoice } = {
  rock: { name: '石頭', emoji: '🪨', beats: ['scissors', 'lizard'] },
  paper: { name: '布', emoji: '📄', beats: ['rock', 'spock'] },
  scissors: { name: '剪刀', emoji: '✂️', beats: ['paper', 'lizard'] },
  lizard: { name: '蜥蜴', emoji: '🦎', beats: ['paper', 'spock'] },
  spock: { name: '史波克', emoji: '🖖', beats: ['rock', 'scissors'] }
}

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [gameState, setGameState] = useState<GameState>('menu')
  const [roomCode, setRoomCode] = useState<string>('')
  const [playerName, setPlayerName] = useState<string>('')
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [canStart, setCanStart] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [roundNumber, setRoundNumber] = useState<number>(0)
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null)
  const [waitingForOpponent, setWaitingForOpponent] = useState<boolean>(false)
  const [opponentChoiceMade, setOpponentChoiceMade] = useState<boolean>(false)

  // 初始化 Socket.IO 連接
  useEffect(() => {
    // 連接到同一個伺服器的 Socket.IO
    const newSocket = io({
      transports: ['websocket'],
      upgrade: true
    })

    setSocket(newSocket)

    // 連接事件
    newSocket.on('connect', () => {
      console.log('已連接到伺服器')
      setIsConnected(true)
      setError('')
    })

    newSocket.on('disconnect', () => {
      console.log('與伺服器斷開連接')
      setIsConnected(false)
      setError('與伺服器斷開連接')
    })

    newSocket.on('connect_error', (err) => {
      console.error('連接錯誤:', err)
      setIsConnected(false)
      setError('無法連接到伺服器')
    })

    // 錯誤處理
    newSocket.on('error', (data) => {
      setError(data.message)
    })

    // 房間事件
    newSocket.on('room-created', (data) => {
      setRoomCode(data.roomCode)
      setCurrentPlayer(data.player)
      setGameState('lobby')
      setError('')
    })

    newSocket.on('room-joined', (data) => {
      setRoomCode(data.roomCode)
      setCurrentPlayer(data.player)
      setGameState('lobby')
      setError('')
    })

    newSocket.on('room-updated', (data) => {
      setPlayers(data.players)
      setCanStart(data.canStart)
    })

    newSocket.on('player-disconnected', (data) => {
      setPlayers(data.players)
      setCanStart(data.canStart)
      if (data.playerName) {
        setError(`${data.playerName} 離開了遊戲`)
      }
    })

    // 遊戲事件
    newSocket.on('game-started', (data) => {
      setGameState('playing')
      setRoundNumber(data.roundNumber)
      setRoundResult(null)
      setWaitingForOpponent(false)
      setOpponentChoiceMade(false)
      setError('')
    })

    newSocket.on('game-paused', (data) => {
      setGameState('lobby')
      setError(data.message)
    })

    newSocket.on('player-choice-made', (data) => {
      setOpponentChoiceMade(true)
    })

    newSocket.on('choice-confirmed', (data) => {
      setWaitingForOpponent(true)
    })

    newSocket.on('round-result', (data) => {
      setRoundResult(data.result)
      setPlayers(data.players)
      setWaitingForOpponent(false)
      setOpponentChoiceMade(false)
    })

    newSocket.on('new-round', (data) => {
      setRoundNumber(data.roundNumber)
      setRoundResult(null)
      setWaitingForOpponent(false)
      setOpponentChoiceMade(false)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  // 創建房間
  const createRoom = (name: string) => {
    if (!socket || !isConnected) {
      setError('未連接到伺服器')
      return
    }
    
    setPlayerName(name)
    socket.emit('create-room', name)
  }

  // 加入房間
  const joinRoom = (code: string, name: string) => {
    if (!socket || !isConnected) {
      setError('未連接到伺服器')
      return
    }
    
    setPlayerName(name)
    socket.emit('join-room', { roomCode: code.toUpperCase(), playerName: name })
  }

  // 開始遊戲
  const startGame = () => {
    if (!socket || !isConnected) {
      setError('未連接到伺服器')
      return
    }
    
    socket.emit('start-game')
  }

  // 做出選擇
  const makeChoice = (choice: string) => {
    if (!socket || !isConnected) {
      setError('未連接到伺服器')
      return
    }
    
    socket.emit('make-choice', choice)
  }

  // 離開房間
  const leaveRoom = () => {
    if (socket) {
      socket.emit('leave-room')
    }
    
    // 重置狀態
    setGameState('menu')
    setRoomCode('')
    setPlayerName('')
    setCurrentPlayer(null)
    setPlayers([])
    setCanStart(false)
    setRoundNumber(0)
    setRoundResult(null)
    setWaitingForOpponent(false)
    setOpponentChoiceMade(false)
    setError('')
  }

  // 複製房間代碼
  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      alert('房間代碼已複製到剪貼板！')
    } catch (err) {
      console.error('複製失敗:', err)
      // 備用方法
      const textArea = document.createElement('textarea')
      textArea.value = roomCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('房間代碼已複製到剪貼板！')
    }
  }

  return (
    <div className="game-container">
      <h1 className="game-title">剪刀石頭布蜥蜴史波克</h1>
      <p className="game-subtitle">Next.js + Socket.IO 即時對戰版本</p>
      
      <div className="online-badge">
        {isConnected ? '🟢 已連線' : '🔴 離線'}
      </div>

      {error && (
        <div className="status waiting">
          ⚠️ {error}
        </div>
      )}

      {gameState === 'menu' && (
        <GameMenu
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          isConnected={isConnected}
        />
      )}

      {gameState === 'lobby' && (
        <GameLobby
          roomCode={roomCode}
          players={players}
          currentPlayer={currentPlayer}
          canStart={canStart}
          onStartGame={startGame}
          onLeaveRoom={leaveRoom}
          onCopyRoomCode={copyRoomCode}
        />
      )}

      {gameState === 'playing' && (
        <GamePlay
          players={players}
          currentPlayer={currentPlayer}
          roundNumber={roundNumber}
          roundResult={roundResult}
          waitingForOpponent={waitingForOpponent}
          opponentChoiceMade={opponentChoiceMade}
          onMakeChoice={makeChoice}
          onLeaveRoom={leaveRoom}
        />
      )}
    </div>
  )
} 