// src/utils/music.ts
let bgAudio: HTMLAudioElement | null = null
let fadeInterval: number | null = null

function fade(volumeTarget: number, duration: number) {
  if (!bgAudio) return
  if (fadeInterval) clearInterval(fadeInterval)

  const steps = 30
  const stepTime = duration / steps
  const diff = volumeTarget - bgAudio.volume
  let currentStep = 0

  fadeInterval = window.setInterval(() => {
    if (!bgAudio) return
    currentStep++
    bgAudio.volume += diff / steps
    if (currentStep >= steps) {
      bgAudio.volume = volumeTarget
      clearInterval(fadeInterval!)
      fadeInterval = null
    }
  }, stepTime)
}

/** Inicia a música de fundo com fade-in */
export function playBackgroundMusic() {
  if (!bgAudio) {
    bgAudio = new Audio('/music/bg_synthwave.mp3')
    bgAudio.loop = true
    bgAudio.volume = 0
  }
  bgAudio.play().catch(() => {})
  fade(0.4, 3000) // sobe até volume 0.4 em 3 segundos
}

/** Para a música de fundo com fade-out */
export function stopBackgroundMusic() {
  if (!bgAudio) return
  fade(0, 1500) // baixa o volume em 1.5s
  setTimeout(() => {
    if (!bgAudio) return
    bgAudio.pause()
    bgAudio.currentTime = 0
  }, 1600)
}
