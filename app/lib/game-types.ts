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