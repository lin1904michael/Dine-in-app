import { useState, useEffect } from 'react'
import v1Logo from '../assets/v1.png'
import v2Logo from '../assets/v2.png'
import v3Logo from '../assets/v3.png'

function LogoEvolution() {
  const [logoPhase, setLogoPhase] = useState('v1')

  useEffect(() => {
    const t1 = setTimeout(() => setLogoPhase('v2'), 1500)
    const t2 = setTimeout(() => setLogoPhase('v3'), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const currentLogo = logoPhase === 'v1' ? v1Logo : logoPhase === 'v2' ? v2Logo : v3Logo

  return (
    <div className="flex justify-center py-4">
      <img
        src={currentLogo}
        alt="FoodservAI"
        className={`h-16 w-auto mx-auto mb-4 transition-opacity duration-1000 ${logoPhase === 'v3' ? 'animate-pulse' : ''}`}
      />
    </div>
  )
}

export default LogoEvolution
