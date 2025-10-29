import { useEffect, useState } from 'react'
import Login from './components/Login'
import Menu from './components/Menu'
import Leaderboard from './components/Leaderboard'
import Game from './components/Game'
import { getUsername } from './utils/storage'

export type Screen = 'login' | 'menu' | 'game' | 'gameover'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [score, setScore] = useState(0)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const user = getUsername()
    if (user) setUsername(user)
  }, [])

  useEffect(() => {
    if (username) setScreen('menu')
  }, [username])

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-neon-bg text-white font-display">
      <div className="max-w-5xl w-full"> {/* maior largura */}
        <header className="text-center mb-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#00bfff] drop-shadow-[0_0_18px_rgba(0,191,255,0.8)]">
            SHARK RUNNER
          </h1>
        </header>

        {screen === 'login' && <Login onLogged={setUsername} />}
        {screen === 'menu' && <Menu onPlay={() => setScreen('game')} />}
        {screen === 'game' && (
          <Game
            onExit={() => setScreen('menu')}
            onGameOver={(finalScore) => {
              setScore(finalScore)
              setScreen('gameover')
            }}
          />
        )}
        {screen === 'gameover' && (
          <div className="glass p-6 text-center space-y-4">
            <div className="text-2xl font-semibold">Fim de jogo!</div>
            <div>
              Pontuação: <span className="badge">{score}</span>
            </div>
            <div className="flex justify-center gap-3">
              <button className="btn" onClick={() => setScreen('menu')}>
                Menu
              </button>
              <button
                className="btn-primary"
                onClick={() => setScreen('game')}
              >
                Jogar Novamente
              </button>
            </div>
            <Leaderboard className="mt-4" />
          </div>
        )}
      </div>
    </div>
  )
}
