// src/game/Physics.ts
// Física ajustada para pulo mais alto e suave

export const FLOOR_Y = 220

// Gravidade reduzida um pouco pra dar mais tempo de ar
const GRAVITY = 1000 // antes era 1200

// Força do pulo aumentada
const JUMP_FORCE = -520 // antes era -420

export function applyGravity(y: number, vy: number, dt: number) {
  vy += GRAVITY * dt
  y += vy * dt

  // Mantém o shark no chão
  if (y > FLOOR_Y) {
    y = FLOOR_Y
    vy = 0
  }

  return { y, vy }
}

export function jump(vy: number) {
  if (vy === 0) {
    vy = JUMP_FORCE
  }
  return vy
}
