const USER_KEY = 'sr_username'
const LB_KEY = 'sr_leaderboard'

export type Row = { user: string; score: number; coins: number }

export function getUsername() {
  return localStorage.getItem(USER_KEY)
}
export function saveUsername(u: string) {
  localStorage.setItem(USER_KEY, u)
}

export function getLeaderboard(): Row[] {
  const raw = localStorage.getItem(LB_KEY)
  const arr: Row[] = raw ? JSON.parse(raw) : []
  // ordena por score desc, depois por coins desc
  return arr.sort((a, b) => (b.score - a.score) || (b.coins - a.coins))
}

export function recordScoreAndCoins(score: number, coins: number) {
  const user = getUsername()
  if (!user) return
  const lb = getLeaderboard()
  const i = lb.findIndex(r => r.user === user)
  if (i >= 0) {
    // mantém o melhor score; se empatar, guarda o maior número de moedas
    const prev = lb[i]
    const bestScore = Math.max(prev.score, score)
    const bestCoins = bestScore === prev.score ? Math.max(prev.coins, coins) : coins
    lb[i] = { user, score: bestScore, coins: bestCoins }
  } else {
    lb.push({ user, score, coins })
  }
  localStorage.setItem(LB_KEY, JSON.stringify(lb))
}
