let ctx = null

function getCtx() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function playPop() {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'sine'
  osc.frequency.value = 660
  gain.gain.setValueAtTime(0.12, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + 0.06)
}

export function playTick() {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'square'
  osc.frequency.value = 440
  gain.gain.setValueAtTime(0.12, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.03)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + 0.03)
}

export function playChime() {
  const ac = getCtx()
  const t = ac.currentTime

  const osc1 = ac.createOscillator()
  const gain1 = ac.createGain()
  osc1.type = 'sine'
  osc1.frequency.value = 523
  gain1.gain.setValueAtTime(0.12, t)
  gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  osc1.connect(gain1)
  gain1.connect(ac.destination)
  osc1.start(t)
  osc1.stop(t + 0.08)

  const osc2 = ac.createOscillator()
  const gain2 = ac.createGain()
  osc2.type = 'sine'
  osc2.frequency.value = 659
  gain2.gain.setValueAtTime(0.12, t + 0.08)
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
  osc2.connect(gain2)
  gain2.connect(ac.destination)
  osc2.start(t + 0.08)
  osc2.stop(t + 0.15)
}

export function playLevelUp() {
  const ac = getCtx()
  const t = ac.currentTime
  const notes = [523, 659, 784]

  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    const start = t + i * 0.1
    gain.gain.setValueAtTime(0.12, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1)
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.start(start)
    osc.stop(start + 0.1)
  })
}
