// Espaço para carregar sprites/sons no futuro.
export function playClick() {
const a = new AudioContext()
const o = a.createOscillator(); const g = a.createGain()
o.type = 'square'; o.frequency.value = 440; o.connect(g); g.connect(a.destination); g.gain.value = 0.06
o.start(); setTimeout(() => { o.stop(); a.close() }, 80)
}