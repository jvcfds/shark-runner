import type { AABB } from '../Collision'

export class Coin {
  x: number
  y: number
  r: number
  speed: number
  t: number
  rotSpeed: number

  constructor(x: number, y: number, speed: number) {
    this.x = x
    this.y = y
    this.r = 8
    this.speed = speed
    this.t = Math.random() * 100 // fase aleatória pra animação
    this.rotSpeed = 4 + Math.random() * 2 // velocidade de rotação variável
  }

  update(dt: number) {
    this.x -= this.speed * dt
    this.t += dt * this.rotSpeed
  }

  offscreen() {
    return this.x + this.r < 0
  }

  bounds(): AABB {
    return { x: this.x - this.r, y: this.y - this.r, w: this.r * 2, h: this.r * 2 }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)

    // Pulso de brilho (0.7–1.0)
    const pulse = 0.7 + Math.sin(this.t * 2) * 0.3

    // Simula rotação 3D lateral (escala X)
    const flip = Math.abs(Math.sin(this.t * 2))
    const width = this.r * 2 * flip
    const height = this.r * 2

    // Gradiente dourado com brilho
    const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0)
    grad.addColorStop(0, `rgba(255, 230, 150, ${0.9 * pulse})`)
    grad.addColorStop(0.5, `rgba(255, 210, 80, ${0.95 * pulse})`)
    grad.addColorStop(1, `rgba(255, 180, 50, ${0.8 * pulse})`)

    // Glow neon azul ao redor
    ctx.shadowBlur = 15
    ctx.shadowColor = `rgba(0, 191, 255, ${0.8 * pulse})`

    // Desenha elipse simulando rotação 3D
    ctx.beginPath()
    ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    // Borda luminosa
    ctx.strokeStyle = `rgba(255, 255, 200, ${0.4 * pulse})`
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.restore()
  }
}
