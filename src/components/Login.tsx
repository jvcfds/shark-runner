import { useState } from 'react'
import { saveUsername } from '../utils/storage'

export default function Login({ onLogged }: { onLogged: (user: string) => void }) {
  const [name, setName] = useState('')

  function handleLogin() {
    if (!name.trim()) return
    saveUsername(name.trim())
    onLogged(name.trim())
  }

  return (
    <div className="glass p-6 text-center space-y-4">
      <h2 className="text-xl font-semibold text-[#00bfff] drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]">
        Digite seu nome para jogar
      </h2>
      <div className="flex gap-3 justify-center">
        <input
          className="input max-w-xs"
          placeholder="Seu nome..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <button className="btn-primary" onClick={handleLogin} disabled={!name.trim()}>
          Entrar
        </button>
      </div>
    </div>
  )
}
