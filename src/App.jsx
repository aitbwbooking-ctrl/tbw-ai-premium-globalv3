import React, { useEffect, useState, useRef } from 'react'

const HERO_IMAGES = {
  Paris: '/hero-paris-desktop.jpg',
  Zadar: '/hero-zadar.jpg',
  Split: '/hero-split.jpg',
  Zagreb: '/hero-zagreb.jpg',
  Karlovac: '/hero-karlovac.jpg'
}

const CITY_PRESETS = ['Zadar', 'Split', 'Zagreb', 'Karlovac', 'Paris']

const tickerMessages = [
  'TBW AI LIVE · demo sample feed · APIs are mocked in this version.',
  'Trial mode uses only free public examples — upgrade to Premium for real-time data.',
  'Navigation, booking & safety copilots – all in one TBW AI Premium app.',
  'Child mode & safety alerts are available only in Premium / Founder modes.'
]

const supportsSpeech =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)

export default function App () {
  const [city, setCity] = useState('Paris')
  const [mode, setMode] = useState('demo') // trial | demo | premium
  const [searchText, setSearchText] = useState('')
  const [tickerIndex, setTickerIndex] = useState(0)
  const [navFrom, setNavFrom] = useState('Zadar')
  const [navTo, setNavTo] = useState('')
  const [showNavModal, setShowNavModal] = useState(false)
  const [navSummary, setNavSummary] = useState('')
  const [showInfo, setShowInfo] = useState(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const [showIntro, setShowIntro] = useState(true)

  // ticker rotate text (content is already animated in CSS)
  useEffect(() => {
    const id = setInterval(() => {
      setTickerIndex(i => (i + 1) % tickerMessages.length)
    }, 10000)
    return () => clearInterval(id)
  }, [])

  // intro auto-hide after 6 seconds
  useEffect(() => {
    const id = setTimeout(() => setShowIntro(false), 6000)
    return () => clearTimeout(id)
  }, [])

  // basic speech recognition init
  useEffect(() => {
    if (!supportsSpeech) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'hr-HR'
    rec.continuous = false
    rec.interimResults = false

    rec.onresult = event => {
      const phrase = event.results[0][0].transcript
      handleVoiceCommand(phrase)
    }
    rec.onend = () => {
      setListening(false)
    }
    recognitionRef.current = rec
  }, [])

  const toggleMode = newMode => {
    setMode(newMode)
  }

  const handleSearch = value => {
    const text = (value ?? searchText).trim()
    if (!text) return

    // extremely simple intent parsing just so user sees reaction
    const lower = text.toLowerCase()
    let targetCity = city

    for (const name of CITY_PRESETS) {
      if (lower.includes(name.toLowerCase())) {
        targetCity = name
        break
      }
    }
    setCity(targetCity)
    setNavFrom(targetCity)
  }

  const handleVoiceCommand = phrase => {
    const text = phrase.trim()
    setSearchText(text)
    handleSearch(text)
    // we can also show a small modal with what was heard
    setShowInfo({
      title: 'TBW AI premium engine – synced search',
      body: `Heard: “${text}”. Frontend cockpit updated city & search.

Real live navigation and booking logic will run in your Premium backend.`
    })
  }

  const handleMicClick = () => {
    if (!supportsSpeech || !recognitionRef.current) {
      alert('Microphone search is not supported in this browser – try Chrome on Android.')
      return
    }
    try {
      if (!listening) {
        setListening(true)
        recognitionRef.current.start()
      } else {
        recognitionRef.current.stop()
      }
    } catch (e) {
      console.error(e)
      setListening(false)
    }
  }

  const openNav = () => {
    if (!navFrom || !navTo) return
    setNavSummary(`${navFrom} → ${navTo}`)
    setShowNavModal(true)
  }

  const currentHero = HERO_IMAGES[city] || HERO_IMAGES.Paris

  return (
    <div className='app-shell'>
      {showIntro && (
        <div className='intro-overlay'>
          <div className='intro-video-wrapper'>
            <video
              src='/intro.mp4'
              autoPlay
              muted
              playsInline
            />
            <button className='intro-skip' onClick={() => setShowIntro(false)}>
              Skip intro
            </button>
          </div>
        </div>
      )}

      <main className='app-inner'>
        <header className='app-header'>
          <div className='brand'>
            <div className='brand-logo'>
              <span>TBW</span>
            </div>
            <div className='brand-text'>
              <span className='brand-line-1'>TBW AI PREMIUM</span>
              <span className='brand-line-2'>Navigator · Travel · Safety</span>
            </div>
          </div>

          <div className='badges'>
            <div className='badge live'>
              <span className='pill-dot' />
              <span>LIVE cockpit</span>
            </div>
            <div className='badge'>
              <span>Trial</span>
            </div>
            <div className='badge'>
              <span>Demo</span>
            </div>
            <div className='badge'>
              <span>Premium</span>
            </div>
          </div>
        </header>

        <div className='ticker-bar'>
          <span className='ticker-label'>TBW AI LIVE</span>
          <span className='ticker-dot' />
          <div className='ticker-track'>
            <span className='ticker-item'>{tickerMessages[tickerIndex]}</span>
            <span className='ticker-item'>{tickerMessages[(tickerIndex + 1) % tickerMessages.length]}</span>
          </div>
        </div>

        <section className='main-grid'>
          {/* LEFT – HERO + SEARCH + NAV */}
          <div>
            <article className='hero-card'>
              <div className='hero-media'>
                <img src={currentHero} alt={city} className='hero-img' />
                <div className='hero-gradient' />
                <div className='hero-overlay'>
                  <div className='hero-city'>{city}</div>
                  <div className='hero-sub'>
                    Eiffel Tower demo card. Real TBW engine will use your GPS, cameras and APIs.
                  </div>
                  <div className='hero-meta-row'>
                    <span className='hero-chip'>GPS · OK</span>
                    <span className='hero-chip'>TBW AI · cockpit</span>
                    <span className='hero-chip'>Profile · driver</span>
                  </div>
                </div>
              </div>

              <div className='hero-actions'>
                <button
                  className='hero-btn primary'
                  onClick={() =>
                    setShowInfo({
                      title: 'Navigate (demo)',
                      body:
                        'This is the TBW AI navigation cockpit. In Demo mode we only simulate the TBW engine – no real routing yet.'
                    })
                  }
                >
                  NAVIGATE
                </button>
                <button
                  className='hero-btn secondary'
                  onClick={() =>
                    setShowInfo({
                      title: 'Street View (demo)',
                      body:
                        'Street View window will open here in the Premium version, synced with your TBW route.'
                    })
                  }
                >
                  STREET VIEW
                </button>
              </div>
            </article>

            {/* GLOBAL SEARCH BAR */}
            <div className='search-shell' style={{ marginTop: 14 }}>
              <div className='search-pill'>
                <div>
                  <div className='search-label'>TBW global search</div>
                  <input
                    className='search-input'
                    placeholder='Reci npr. “apartmani u Zadru za vikend”'
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <button
                className={listening ? 'search-mic-btn active' : 'search-mic-btn'}
                onClick={handleMicClick}
                aria-label='TBW voice search'
              >
                🎙
              </button>
            </div>

            {/* NAVIGATION COCKPIT */}
            <section className='nav-screen'>
              <div className='nav-title-row'>
                <div className='nav-title'>TBW AI Premium Navigacija (frontend demo)</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  Mode:&nbsp;
                  <strong style={{ textTransform: 'uppercase' }}>{mode}</strong>
                </div>
              </div>

              <div className='nav-fields'>
                <div className='nav-field'>
                  <span className='nav-field-label'>Polazište</span>
                  <input
                    className='nav-field-input'
                    value={navFrom}
                    onChange={e => setNavFrom(e.target.value)}
                    placeholder='npr. Zadar'
                  />
                </div>
                <div className='nav-field'>
                  <span className='nav-field-label'>Odredište</span>
                  <input
                    className='nav-field-input'
                    value={navTo}
                    onChange={e => setNavTo(e.target.value)}
                    placeholder='npr. Split aerodrom'
                  />
                </div>
              </div>

              <button className='nav-start-btn' onClick={openNav}>
                Pokreni rutu
              </button>

              <p style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
                TBW AI Navigacija (umor, alkohol, nasilje, child mode, senzori) radi u Premium modu preko backenda.
                Ovaj ekran je frontend cockpit, spreman za spajanje na tvoj engine.
              </p>
            </section>
          </div>

          {/* RIGHT – CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <section className='card'>
              <div className='card-title'>Grad</div>
              <div className='chips-row'>
                {CITY_PRESETS.map(name => (
                  <button
                    key={name}
                    className={name === city ? 'chip-pill active' : 'chip-pill'}
                    onClick={() => {
                      setCity(name)
                      setNavFrom(name)
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>

            <section className='card'>
              <div className='card-title'>Smještaj</div>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>
                TBW filtrira smještaj prema cijeni, lokaciji, recenzijama i tvom profilu (obitelj, par, solo, business).
                U Demo modu otvaramo samo booking.com demo link.
              </p>
              <button
                style={{
                  marginTop: 8,
                  borderRadius: 999,
                  padding: '7px 10px',
                  border: '1px solid rgba(34, 197, 94, 0.9)',
                  background: 'rgba(22, 163, 74, 0.2)',
                  color: '#bbf7d0',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
                onClick={() =>
                  window.open('https://www.booking.com', '_blank', 'noopener,noreferrer')
                }
              >
                Otvori ponude (Booking demo)
              </button>
            </section>

            <section className='card'>
              <div className='card-title'>Promet & sigurnost</div>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>
                U ovoj frontend verziji prikazujemo samo primjer teksta. Pravi TBW motor će koristiti tvoje API ključeve
                za radare, kamere, radove, nesreće, child mode i hitne pozive.
              </p>
            </section>
          </div>
        </section>

        <footer style={{ marginTop: 18, fontSize: 10, opacity: 0.7, textAlign: 'center' }}>
          TBW AI PREMIUM NAVIGATOR is an informational tool only. It does not replace official traffic, weather,
          maritime or aviation sources. Always follow road signs, police instructions and official emergency services.
          All rights reserved. Dražen Halar – Founder & IP Owner TBW.
        </footer>
      </main>

      {showNavModal && (
        <div className='backdrop' onClick={() => setShowNavModal(false)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <h2>TBW AI premium engine – route preview</h2>
            <p>Demo prikaz rute (frontend):</p>
            <p style={{ fontWeight: 600 }}>{navSummary}</p>
            <p style={{ marginTop: 8 }}>
              U pravoj Premium verziji ovdje se spaja tvoj TBW backend: live senzori, kamere, umor, alkohol, child mode,
              SOS i sve ostalo što smo definirali.
            </p>
            <button onClick={() => setShowNavModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showInfo && (
        <div className='backdrop' onClick={() => setShowInfo(null)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <h2>{showInfo.title}</h2>
            {showInfo.body.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
            <button onClick={() => setShowInfo(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
