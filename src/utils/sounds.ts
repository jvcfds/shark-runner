// src/utils/sounds.ts
// Sistema de áudio otimizado com Web Audio API + fade-in suave

let audioCtx: AudioContext | null = null
let buffers: Record<string, AudioBuffer> = {}

// Pré-carrega os sons e decodifica
async function loadSound(url: string) {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  const buffer = await audioCtx.decodeAudioData(arrayBuffer)
  buffers[url] = buffer
}

export async function initSounds() {
  await Promise.all([
    loadSound('/sfx/jump.mp3'),
    loadSound('/sfx/coin.mp3'),
  ])
}

// Fade-in rápido pra suavizar sons curtos
function fadeInGain(gainNode: GainNode, target: number, duration = 0.1) {
  if (!audioCtx) return
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
  gainNode.gain.linearRampToValueAtTime(target, audioCtx.currentTime + duration)
}

// Toca um som instantaneamente com fade suave
export function playSound(name: 'jump' | 'coin', volume = 0.6) {
  if (!audioCtx || !buffers[`/sfx/${name}.mp3`]) return
  const source = audioCtx.createBufferSource()
  const gain = audioCtx.createGain()

  source.buffer = buffers[`/sfx/${name}.mp3`]
  source.connect(gain).connect(audioCtx.destination)

  // aplica fade-in para evitar cliques ou estalos
  fadeInGain(gain, volume, 0.08)
  source.start(0)
}
