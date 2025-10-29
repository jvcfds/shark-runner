import type { AABB } from '../Collision'

export class Obstacle {
  x: number
  y: number
  w: number
  h: number
  kind: 'pillar' | 'drone'
  speed: number

  constructor(x: number, kind: 'pillar' | 'drone', baseSpeed: number) {
    this.kind = kind
    this.x = x
    this.speed = baseSpeed

    if (kind === 'pillar') {
      this.y = 210
      this.w = 20
      this.h = 50 + Math.random() * 20
    } else {
      this.y = 160 + Math.random() * 40
      this.w = 36
      this.h = 24
    }
  }

  update(dt: number) {
    this.x -= this.speed * dt
  }

  offscreen() {
    return this.x + this.w < 0
  }

  bounds(): AABB {
    return { x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.shadowBlur = 12
    ctx.shadowColor = '#00bfff'

    if (this.kind === 'pillar') {
      // Pilar de energia azul neon
      ctx.fillStyle = '#00bfff'
      const grad = ctx.createLinearGradient(0, -this.h / 2, 0, this.h / 2)
      grad.addColorStop(0, '#00bfff')
      grad.addColorStop(1, '#0088cc')
      ctx.fillStyle = grad
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
      ctx.strokeStyle = 'rgba(0,191,255,0.6)'
      ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h)
    } else {
      // Drone — obstáculo aéreo neon
      ctx.fillStyle = '#00bfff'
      ctx.beginPath()
      ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,191,255,0.6)'
      ctx.stroke()

      // antenas / propulsão
      ctx.strokeStyle = '#00bfff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-this.w / 2, 0)
      ctx.lineTo(-this.w / 2 - 6, 0)
      ctx.stroke()
    }

    ctx.restore()
  }
}
