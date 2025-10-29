import { getLeaderboard } from '../utils/storage'

export default function Leaderboard({ className = '' }: { className?: string }) {
  const top = getLeaderboard().slice(0, 5)

  return (
    <div className={`glass p-4 ${className}`}>
      <div className="text-sm uppercase tracking-wider text-white/60 mb-2">Leaderboard</div>
      <ul className="space-y-1">
        {top.length === 0 && <li className="text-white/50">Sem registros ainda</li>}
        {top.map((row, i) => (
          <li key={row.user} className="flex justify-between items-center">
            <span className="text-white/80">
              {i + 1}. {row.user}
            </span>
            <span className="text-white/60 text-sm">
              🦈 {row.score} | 💰 {row.coins}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
