import { useEffect, useRef, useState } from 'react'
import { Engine } from '../game/Engine'
import { recordScoreAndCoins } from '../utils/storage'

export default function Game({
  onExit,
  onGameOver,
}: {
  onExit: () => void
  onGameOver: (score: number) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const engine = new Engine(canvas, {
      onScore: (s) => setScore(s),
      onCoins: (c) => setCoins(c),
      onGameOver: (s, c) => {
        recordScoreAndCoins(s, c)
        onGameOver(s)
      },
    })
    engine.start()

    const handleTap = () => {
      if (isMobile) {
        const e = new KeyboardEvent('keydown', { code: 'Space' })
        window.dispatchEvent(e)
      }
    }
    if (isMobile) canvas.addEventListener('touchstart', handleTap)

    return () => {
      engine.destroy()
      canvas.removeEventListener('touchstart', handleTap)
    }
  }, [isMobile])

  return (
    <div className="glass p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="text-white/70">
          🦈 <span className="badge">{score}</span> | 💰{' '}
          <span className="badge">{coins}</span>
        </div>
        <button className="btn" onClick={onExit}>
          Sair
        </button>
      </div>

      <div className="relative flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={1100}
          height={340}
          className="w-full max-w-[1100px] rounded-2xl border border-white/10"
        />

        {/* botão de pular abaixo do jogo - visível só no mobile */}
        {isMobile && (
          <button
            onClick={() => {
              const e = new KeyboardEvent('keydown', { code: 'Space' })
              window.dispatchEvent(e)
            }}
            className="mt-4 md:hidden"
          >
            <img
              src="/jump.png"
              alt="Pular"
              className="w-16 h-16 opacity-80 active:opacity-100 transition"
            />
          </button>
        )}
      </div>
    </div>
  )
}
