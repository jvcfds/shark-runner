import { Shark } from './entities/Shark'
import { Obstacle } from './entities/Obstacle'
import { Coin } from './entities/Coin'
import { intersects } from './Collision'
import { playSound, initSounds } from '../utils/sounds'
import { playBackgroundMusic, stopBackgroundMusic } from '../utils/music'
import { ParticleSystem } from './Particles'

export type EngineHooks = {
  onScore?: (score: number) => void
  onCoins?: (coins: number) => void
  onGameOver?: (score: number, coins: number) => void
}

export class Engine {
  private ctx: CanvasRenderingContext2D
  private raf = 0
  private running = false
  private lastTime = 0

  private shark = new Shark()
  private obstacles: Obstacle[] = []
  private coins: Coin[] = []
  private particles = new ParticleSystem()

  private score = 0
  private coinsCollected = 0
  private speed = 250
  private spawnTimer = 0
  private soundsReady = false
  private lastSpeedMilestone = 0

  constructor(private canvas: HTMLCanvasElement, private hooks: EngineHooks) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D não suportado')
    this.ctx = ctx
    this.handleInput = this.handleInput.bind(this)
  }

  async start() {
    this.running = true
    this.lastTime = performance.now()
    window.addEventListener('keydown', this.handleInput)

    // Inicializa áudio e música
    await initSounds().catch(() => {})
    this.soundsReady = true
    playBackgroundMusic()
    this.loop()
  }

  destroy() {
    this.running = false
    cancelAnimationFrame(this.raf)
    window.removeEventListener('keydown', this.handleInput)
    stopBackgroundMusic()
  }

  private handleInput(e: KeyboardEvent) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      const jumped = this.shark.tryJump()
      if (jumped && this.soundsReady) playSound('jump', 0.7)
    }
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const now = performance.now()
    const dt = Math.min(0.033, (now - this.lastTime) / 1000)
    this.lastTime = now
    if (!this.running) return
    this.update(dt)
    this.draw()
  }

  private update(dt: number) {
    this.shark.update(dt)

    // === Obstáculos ===
    this.spawnTimer -= dt
    if (this.spawnTimer <= 0) {
      const kind = Math.random() < 0.7 ? 'pillar' : 'drone'
      const gap = 1.2 + Math.random() * 0.8
      const x = this.canvas.width + 40
      this.obstacles.push(new Obstacle(x, kind as any, this.speed))
      this.spawnTimer = gap
    }
    for (const o of this.obstacles) o.update(dt)
    this.obstacles = this.obstacles.filter(o => !o.offscreen())

    // === Moedas organizadas ===
    if (Math.random() < 0.006) {
      const groupSize = 3 + Math.floor(Math.random() * 2) // 3 a 4 moedas
      const baseY = 180 - Math.random() * 40
      const spacingX = 32
      const spacingY = 12

      for (let i = 0; i < groupSize; i++) {
        const x = this.canvas.width + 20 + i * spacingX
        const y = baseY + Math.sin(i) * spacingY
        this.coins.push(new Coin(x, y, this.speed))
      }
    }

    for (const c of this.coins) c.update(dt)
    this.coins = this.coins.filter(c => !c.offscreen())

    // === Pontuação e velocidade ===
    this.score += Math.floor(dt * 100)
    this.hooks.onScore?.(this.score)

    // aumenta a velocidade a cada 500 pontos até 3500
    const milestone = Math.floor(this.score / 500)
    if (milestone > this.lastSpeedMilestone && this.score < 3500) {
      this.speed += 10
      this.lastSpeedMilestone = milestone
    }

    // === Colisão com moedas ===
    for (const c of [...this.coins]) {
      if (intersects(this.shark.bounds(), c.bounds())) {
        this.coinsCollected++
        if (this.soundsReady) playSound('coin', 0.5)
        this.particles.emit(c.x, c.y, 12) // 💥 partículas neon
        this.hooks.onCoins?.(this.coinsCollected)
        this.coins = this.coins.filter(x => x !== c)
      }
    }

    // === Atualiza partículas ===
    this.particles.update(dt)

    // === Colisão com obstáculos ===
    for (const o of this.obstacles) {
      if (intersects(this.shark.bounds(), o.bounds())) {
        this.gameOver()
        return
      }
    }
  }

  private draw() {
    const ctx = this.ctx
    const { width: w, height: h } = this.canvas

    // fundo neon
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0b0f17'
    ctx.fillRect(0, 0, w, h)

    // linhas do chão
    ctx.save()
    ctx.strokeStyle = 'rgba(0,191,255,0.15)'
    ctx.lineWidth = 1
    for (let y = 200; y < h; y += 12) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    ctx.restore()

    // chão principal
    ctx.save()
    ctx.strokeStyle = '#00bfff'
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.moveTo(0, 220)
    ctx.lineTo(w, 220)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.restore()

    // entidades
    this.shark.draw(ctx)
    for (const o of this.obstacles) o.draw(ctx)
    for (const c of this.coins) c.draw(ctx)
    this.particles.draw(ctx)

    // HUD
    ctx.save()
    ctx.fillStyle = '#00bfff'
    ctx.font = '600 16px Inter, sans-serif'
    ctx.fillText(`🦈 ${String(this.score).padStart(5, '0')}`, w - 150, 24)
    ctx.fillText(`💰 ${this.coinsCollected}`, w - 70, 24)
    ctx.restore()
  }

  private gameOver() {
    this.running = false
    stopBackgroundMusic()
    this.hooks.onGameOver?.(this.score, this.coinsCollected)
  }
}
