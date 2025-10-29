import { useEffect, useState } from 'react'

export default function Menu({ onPlay }: { onPlay: () => void }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="glass p-6 text-center space-y-4 relative">
      <h2 className="text-xl font-semibold text-[#00bfff]">Pronto para correr?</h2>
      <div className="flex items-center justify-center gap-3">
        <button className="btn-primary" onClick={onPlay}>
          Jogar
        </button>
      </div>
      <p className="text-white/60 text-sm">
        Use <span className="badge">Espaço</span> ou <span className="badge">↑</span> para pular.
      </p>

      {/* Botão de pular só no mobile */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <button
            onClick={() => {
              const e = new KeyboardEvent('keydown', { code: 'Space' })
              window.dispatchEvent(e)
            }}
          >
            <img
              src="/jump.png"
              alt="Pular"
              className="w-16 h-16 opacity-80 active:opacity-100 transition"
            />
          </button>
        </div>
      )}
    </div>
  )
}
