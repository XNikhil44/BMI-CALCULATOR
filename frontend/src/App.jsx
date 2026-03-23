import React, { useState, useRef } from 'react'
import './App.css'

const getCategory = (bmi) => {
  if (bmi < 18.5) return {
    label: 'Underweight', color: '#60a5fa',
    glow: 'rgba(96,165,250,0.12)', colorGlow: 'rgba(96,165,250,0.25)',
    pillBg: 'rgba(96,165,250,0.1)', colorBorder: 'rgba(96,165,250,0.25)',
    emoji: '🥗',
    tip: 'Your BMI suggests you may be underweight. Focus on nutrient-dense foods — lean proteins, healthy fats, whole grains, and nuts. Consider consulting a nutritionist for a personalized plan.',
    needlePct: Math.min(bmi / 40 * 100, 20)
  }
  if (bmi < 24.9) return {
    label: 'Healthy Weight', color: '#34d399',
    glow: 'rgba(52,211,153,0.1)', colorGlow: 'rgba(52,211,153,0.25)',
    pillBg: 'rgba(52,211,153,0.1)', colorBorder: 'rgba(52,211,153,0.25)',
    emoji: '✨',
    tip: 'Excellent! You\'re in the healthy range. Keep it up with a balanced diet, regular cardio, and strength training. Consistency is your best friend.',
    needlePct: 18 + ((bmi - 18.5) / 6.4) * 32
  }
  if (bmi < 29.9) return {
    label: 'Overweight', color: '#fbbf24',
    glow: 'rgba(251,191,36,0.08)', colorGlow: 'rgba(251,191,36,0.25)',
    pillBg: 'rgba(251,191,36,0.1)', colorBorder: 'rgba(251,191,36,0.25)',
    emoji: '🏃',
    tip: 'You\'re slightly above the healthy range. Small consistent changes go a long way — try 30 minutes of daily activity, reduce processed foods, and increase vegetable intake.',
    needlePct: 50 + ((bmi - 24.9) / 5) * 22
  }
  return {
    label: 'Obese', color: '#f87171',
    glow: 'rgba(248,113,113,0.08)', colorGlow: 'rgba(248,113,113,0.25)',
    pillBg: 'rgba(248,113,113,0.1)', colorBorder: 'rgba(248,113,113,0.25)',
    emoji: '🩺',
    tip: 'Your BMI is in the obese range. Please consult a healthcare professional for a tailored plan. Small sustainable changes in diet and activity level can make a significant difference over time.',
    needlePct: Math.min(72 + ((bmi - 30) / 10) * 28, 97)
  }
}

const idealBMIWeight = (heightCm) => {
  const h = heightCm / 100
  const minW = (18.5 * h * h).toFixed(1)
  const maxW = (24.9 * h * h).toFixed(1)
  return `${minW}–${maxW} kg`
}

export default function App() {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const resultRef = useRef(null)

  const validate = () => {
    if (!name.trim()) return 'Please enter your name.'
    const w = Number(weight), h = Number(height)
    if (!weight || isNaN(w) || w <= 0) return 'Weight must be a positive number.'
    if (!height || isNaN(h) || h <= 0) return 'Height must be a positive number.'
    if (h < 50 || h > 250) return 'Height should be between 50 and 250 cm.'
    if (w < 10 || w > 500) return 'Weight seems unrealistic. Enter a value in kg.'
    return ''
  }

  const handleCalc = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); setResult(null); return }
    setError('')
    const w = Number(weight), h = Number(height) / 100
    const bmi = (w / (h * h)).toFixed(1)
    setResult({ bmi, name: name.trim(), weight, height })
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
  }

  const handleReset = () => {
    setName(''); setWeight(''); setHeight(''); setResult(null); setError('')
  }

  const cat = result ? getCategory(Number(result.bmi)) : null

  return (
    <div className="bmi-root">
      <div className="grid-bg" />
      <div className="card">
        <div className="header">
          <div className="badge"><span className="badge-dot" />Health Tool</div>
          <h1 className="title">BMI <span>Calculator</span></h1>
          <p className="subtitle">Understand your body composition in seconds.</p>
        </div>

        <form className="form" onSubmit={handleCalc} noValidate>
          <div className="field">
            <label className="field-label"><span className="field-icon">👤</span> Your Name</label>
            <div className="input-wrap">
              <input className="input" type="text" placeholder="Enter your name" value={name}
                onChange={e => setName(e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label"><span className="field-icon">⚖️</span> Weight</label>
              <div className="input-wrap">
                <input className="input has-unit" type="number" placeholder="70" min="1" step="0.1"
                  value={weight} onChange={e => setWeight(e.target.value)} />
                <span className="input-unit">kg</span>
              </div>
            </div>
            <div className="field">
              <label className="field-label"><span className="field-icon">📏</span> Height</label>
              <div className="input-wrap">
                <input className="input has-unit" type="number" placeholder="175" min="50" max="250" step="1"
                  value={height} onChange={e => setHeight(e.target.value)} />
                <span className="input-unit">cm</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-msg">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="btn-row">
            <button type="submit" className="btn-calc">Calculate BMI →</button>
            <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
          </div>
        </form>

        {result && cat && (
          <div
            className="result"
            ref={resultRef}
            style={{
              '--result-color': cat.color,
              '--result-glow': cat.glow,
              '--result-color-glow': cat.colorGlow,
              '--result-pill-bg': cat.pillBg,
              '--result-color-border': cat.colorBorder,
            }}
          >
            <div className="divider">Your Result</div>

            <div className="result-hero">
              <div className="bmi-circle">
                <span className="bmi-number">{result.bmi}</span>
                <span className="bmi-label">BMI</span>
              </div>
              <div className="result-info">
                <div className="result-name">Result for <strong>{result.name}</strong></div>
                <div className="result-meta">{result.weight} kg · {result.height} cm</div>
                <div className="result-status-pill">
                  <span>{cat.emoji}</span> {cat.label}
                </div>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-val">{(Number(result.weight) / ((Number(result.height) / 100) ** 2)).toFixed(2)}</div>
                <div className="stat-label">BMI Score</div>
              </div>
              <div className="stat-box">
                <div className="stat-val stat-val--sm">{idealBMIWeight(Number(result.height))}</div>
                <div className="stat-label">Ideal Weight</div>
              </div>
            </div>

            <div className="scale-wrap">
              <div className="scale-title">BMI Scale</div>
              <div className="scale-bar-outer">
                <div className="scale-needle" style={{ left: `${cat.needlePct}%` }} />
              </div>
              <div className="scale-labels">
                <span>Underweight<br />&lt;18.5</span>
                <span>Healthy<br />18.5–24.9</span>
                <span>Overweight<br />25–29.9</span>
                <span>Obese<br />&gt;30</span>
              </div>
            </div>

            <div className="tip-card">
              <span className="tip-icon">{cat.emoji}</span>
              <div className="tip-content">
                <div className="tip-heading">Health Tip</div>
                <div className="tip-text">{cat.tip}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}