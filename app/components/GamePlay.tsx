'use client'

import React from 'react'
import { Player, RoundResult, choices } from '../page'

interface GamePlayProps {
  players: Player[]
  currentPlayer: Player | null
  roundNumber: number
  roundResult: RoundResult | null
  waitingForOpponent: boolean
  opponentChoiceMade: boolean
  onMakeChoice: (choice: string) => void
  onLeaveRoom: () => void
}

export default function GamePlay({
  players,
  currentPlayer,
  roundNumber,
  roundResult,
  waitingForOpponent,
  opponentChoiceMade,
  onMakeChoice,
  onLeaveRoom
}: GamePlayProps) {
  const opponent = players.find(p => p.id !== currentPlayer?.id)

  const getResultForPlayer = () => {
    if (!roundResult || !currentPlayer || !opponent) return null

    const playerChoiceData = roundResult.choices[currentPlayer.id]
    const opponentChoiceData = roundResult.choices[opponent.id]

    if (roundResult.winner === 'tie') {
      return { type: 'tie', text: '平手！' }
    }

    // 判斷當前玩家是否獲勝
    const isWinner = (roundResult.winner === 'player1' && Object.keys(roundResult.choices)[0] === currentPlayer.id) ||
                     (roundResult.winner === 'player2' && Object.keys(roundResult.choices)[1] === currentPlayer.id)

    return {
      type: isWinner ? 'win' : 'lose',
      text: isWinner ? '你贏了！' : '你輸了！'
    }
  }

  const result = getResultForPlayer()

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={onLeaveRoom}
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        ← 返回等候室
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', margin: '1rem 0' }}>
          回合 {roundNumber}
        </h2>
      </div>

      <div className="player-info">
        <div className="player-card you">
          <h3>{currentPlayer?.name}</h3>
          <div className="score-number">{currentPlayer?.score || 0}</div>
          <small>你的分數</small>
        </div>

        <div className="player-card opponent">
          <h3>{opponent?.name || '對手'}</h3>
          <div className="score-number">{opponent?.score || 0}</div>
          <small>對手分數</small>
        </div>
      </div>

      {!roundResult && (
        <>
          <div className="status playing">
            {waitingForOpponent 
              ? `等待${opponent?.name || '對手'}選擇...` 
              : '選擇你的武器！'
            }
            {opponentChoiceMade && !waitingForOpponent && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {opponent?.name || '對手'} 已做出選擇
              </div>
            )}
          </div>

          <div className="choices">
            {Object.entries(choices).map(([key, choice]) => (
              <button
                key={key}
                className="choice-btn"
                onClick={() => onMakeChoice(key)}
                disabled={waitingForOpponent}
              >
                <span className="choice-emoji">{choice.emoji}</span>
                <span className="choice-name">{choice.name}</span>
              </button>
            ))}
          </div>

          {waitingForOpponent && (
            <div className="loading-indicator" style={{ marginTop: '2rem' }}>
              <div className="loading"></div>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                等待對手做出選擇...
              </p>
            </div>
          )}
        </>
      )}

      {roundResult && currentPlayer && opponent && (
        <div style={{ margin: '2rem 0' }}>
          <div className="round-display">
            <div className="player-choice">
              <div className="choice-label">{currentPlayer.name}</div>
              <div className="choice-display">
                {choices[roundResult.choices[currentPlayer.id]?.choice]?.emoji}
              </div>
              <div>{choices[roundResult.choices[currentPlayer.id]?.choice]?.name}</div>
            </div>

            <div className="vs">VS</div>

            <div className="opponent-choice">
              <div className="choice-label">{opponent.name}</div>
              <div className="choice-display">
                {choices[roundResult.choices[opponent.id]?.choice]?.emoji}
              </div>
              <div>{choices[roundResult.choices[opponent.id]?.choice]?.name}</div>
            </div>
          </div>

          {result && (
            <>
              <div className={`result-text ${result.type}`}>
                {result.text}
              </div>
              <div className="explanation">
                {roundResult.explanation}
              </div>
            </>
          )}

          <div className="status playing" style={{ marginTop: '2rem' }}>
            下一回合將在3秒後開始...
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '3rem', 
        padding: '1rem', 
        background: 'rgba(0, 0, 0, 0.05)', 
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        💡 遊戲會自動進行下一回合，沒有回合限制
      </div>
    </div>
  )
} 