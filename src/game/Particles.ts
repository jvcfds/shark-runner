// src/game/Particles.ts
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  alpha: number
}

export class ParticleSystem {
  particles: Particle[] = []

  // gera partículas no ponto da moeda coletada
  emit(x: number, y: number, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 60 + Math.random() * 80
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        size: 2 + Math.random() * 2,
        alpha: 1,
      })
    }
  }

  update(dt: number) {
    for (const p of this.particles) {
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += 200 * dt // gravidade leve nas partículas
      p.life += dt
      p.alpha = 1 - p.life / p.maxLife
    }
    this.particles = this.particles.filter(p => p.life < p.maxLife)
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = '#00bfff'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#00bfff'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
}
