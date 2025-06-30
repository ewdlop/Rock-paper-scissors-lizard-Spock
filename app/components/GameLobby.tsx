'use client'

import React from 'react'
import { Player } from '../lib/game-types'

interface GameLobbyProps {
  roomCode: string
  players: Player[]
  currentPlayer: Player | null
  canStart: boolean
  onStartGame: () => void
  onLeaveRoom: () => void
  onCopyRoomCode: () => void
}

export default function GameLobby({
  roomCode,
  players,
  currentPlayer,
  canStart,
  onStartGame,
  onLeaveRoom,
  onCopyRoomCode
}: GameLobbyProps) {
  const opponent = players.find(p => p.id !== currentPlayer?.id)

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={onLeaveRoom}
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        ← 返回
      </button>

      <div className="room-code">
        房間代碼: {roomCode}
        <button
          className="btn btn-primary"
          onClick={onCopyRoomCode}
          style={{ marginLeft: '1rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          📋 複製
        </button>
      </div>

      <div className="player-info">
        <div className={`player-card you`}>
          <h3>你</h3>
          <p>{currentPlayer?.name}</p>
          <div className="status ready">準備就緒</div>
          {currentPlayer?.isHost && (
            <span style={{ fontSize: '0.8rem', color: '#666' }}>房主</span>
          )}
        </div>

        <div className={`player-card ${opponent ? 'ready' : 'waiting'}`}>
          <h3>對手</h3>
          {opponent ? (
            <>
              <p>{opponent.name}</p>
              <div className="status ready">準備就緒</div>
            </>
          ) : (
            <>
              <p>等待加入...</p>
              <div className="status waiting">等待玩家</div>
            </>
          )}
        </div>
      </div>

      <div style={{ margin: '2rem 0' }}>
        {players.length < 2 && (
          <div className="status waiting">
            請分享房間代碼邀請朋友加入遊戲
          </div>
        )}

        {canStart && currentPlayer?.isHost && (
          <button
            className="btn btn-success"
            onClick={onStartGame}
            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            🎮 開始遊戲！
          </button>
        )}

        {canStart && !currentPlayer?.isHost && (
          <div className="status playing">
            等待房主開始遊戲...
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h4>💡 溫馨提示</h4>
        <ul style={{ textAlign: 'left', margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>需要2名玩家才能開始遊戲</li>
          <li>房主可以開始遊戲</li>
          <li>每回合同時選擇，比較結果</li>
          <li>沒有回合限制，隨時可以退出</li>
        </ul>
      </div>
    </div>
  )
} 