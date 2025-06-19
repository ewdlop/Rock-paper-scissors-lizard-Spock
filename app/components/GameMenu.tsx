'use client'

import React, { useState } from 'react'

interface GameMenuProps {
  onCreateRoom: (name: string) => void
  onJoinRoom: (code: string, name: string) => void
  isConnected: boolean
}

export default function GameMenu({ onCreateRoom, onJoinRoom, isConnected }: GameMenuProps) {
  const [playerName, setPlayerName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [showJoinForm, setShowJoinForm] = useState(false)

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('請輸入您的名字')
      return
    }
    if (!isConnected) {
      alert('未連接到伺服器')
      return
    }
    onCreateRoom(playerName.trim())
  }

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      alert('請輸入您的名字')
      return
    }
    if (!roomCode.trim()) {
      alert('請輸入房間代碼')
      return
    }
    if (!isConnected) {
      alert('未連接到伺服器')
      return
    }
    onJoinRoom(roomCode.trim(), playerName.trim())
  }

  return (
    <div>
      <div className="rules">
        <h3>🎯 遊戲規則</h3>
        <p>每個選項都能打敗其他兩個選項：</p>
        <ul style={{ textAlign: 'left', margin: '1rem 0', lineHeight: '1.6' }}>
          <li><strong>石頭</strong> 碰碎 剪刀和蜥蜴</li>
          <li><strong>布</strong> 包住 石頭和反駁史波克</li>
          <li><strong>剪刀</strong> 剪斷 布和砍斷蜥蜴</li>
          <li><strong>蜥蜴</strong> 吃掉 布和毒死史波克</li>
          <li><strong>史波克</strong> 蒸發 石頭和砸壞剪刀</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          className="input"
          placeholder="輸入您的名字"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
          disabled={!isConnected}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
        <button
          className="btn btn-success"
          onClick={handleCreateRoom}
          disabled={!isConnected || !playerName.trim()}
        >
          🏠 創建房間
        </button>

        <button
          className="btn btn-warning"
          onClick={() => setShowJoinForm(!showJoinForm)}
          disabled={!isConnected}
        >
          🚪 加入房間
        </button>

        {showJoinForm && (
          <div style={{ marginTop: '1rem' }}>
            <input
              type="text"
              className="input"
              placeholder="輸入6位房間代碼"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              style={{ marginBottom: '1rem' }}
              disabled={!isConnected}
            />
            <button
              className="btn btn-primary"
              onClick={handleJoinRoom}
              disabled={!isConnected || !playerName.trim() || !roomCode.trim()}
            >
              加入遊戲
            </button>
          </div>
        )}
      </div>

      {!isConnected && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
          ⚠️ 正在連接伺服器...
        </div>
      )}
    </div>
  )
} 