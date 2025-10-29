import { applyGravity, jump, FLOOR_Y } from '../Physics'
import type { AABB } from '../Collision'

export class Shark {
  x = 80
  y = FLOOR_Y
  w = 60
  h = 30
  vy = 0
  image: HTMLImageElement | null = null

  constructor() {
    const img = new Image()
    img.src = '/shark.png'
    this.image = img
  }

  update(dt: number) {
    const r = applyGravity(this.y, this.vy, dt)
    this.y = r.y
    this.vy = r.vy
  }

  /**
   * Tenta pular.
   * Retorna true se o pulo realmente começou (ou seja, estava no chão).
   */
  tryJump(): boolean {
    // só pode pular se estiver no chão
    if (this.y >= FLOOR_Y - 0.1) {
      this.vy = jump(this.vy)
      return true
    }
    return false
  }

  bounds(): AABB {
    return {
      x: this.x - this.w / 2,
      y: this.y - this.h / 2,
      w: this.w,
      h: this.h,
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)

    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, -this.w / 2, -this.h / 2, this.w, this.h)
    } else {
      // fallback: formato triangular azul neon
      ctx.fillStyle = '#00bfff'
      ctx.beginPath()
      ctx.moveTo(-this.w / 2, 0)
      ctx.lineTo(this.w / 2, -this.h / 3)
      ctx.lineTo(this.w / 2, this.h / 3)
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()
  }
}
