import type { Config } from 'tailwindcss'


export default {
content: [
'./index.html',
'./src/**/*.{ts,tsx}',
],
theme: {
extend: {
colors: {
neon: {
bg: '#0b0f17',
cyan: '#00fff0',
pink: '#ff00e6',
lime: '#a8ff00',
purple: '#8a2be2'
}
},
boxShadow: {
glow: '0 0 20px rgba(0,255,240,0.6), 0 0 40px rgba(255,0,230,0.25)'
},
fontFamily: {
display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
}
},
},
plugins: [],
} satisfies Config