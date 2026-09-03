import gsap from 'gsap'

document.addEventListener('DOMContentLoaded', () => {
  const CORRECT_PIN = "2182024"
  const lockScreen = document.getElementById('lockScreen')
  const lockPinInput = document.getElementById('lockPinInput')
  const lockSubmitBtn = document.getElementById('lockSubmitBtn')
  const lockError = document.getElementById('lockError')
  const mainAppWrapper = document.getElementById('mainAppWrapper')
  const lockCard = document.querySelector('.lock-screen-card')
  const lockIcon = document.querySelector('.lock-icon svg')

  // Auto focus on input
  setTimeout(() => {
    if(lockPinInput) lockPinInput.focus()
  }, 500)

  // Enforce numbers only
  lockPinInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '')
    // Hide error when typing
    if (lockError.style.opacity === '1') {
      gsap.to(lockError, { opacity: 0, duration: 0.3 })
    }
  })

  // Submit on enter
  lockPinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      verifyPin()
    }
  })

  // Submit on click
  lockSubmitBtn.addEventListener('click', verifyPin)

  function verifyPin() {
    const entered = lockPinInput.value

    if (entered === CORRECT_PIN) {
      unlockApp()
    } else {
      showError()
    }
  }

  function showError() {
    // Shake animation
    gsap.timeline()
      .to(lockCard, { x: -10, duration: 0.05 })
      .to(lockCard, { x: 10, duration: 0.05 })
      .to(lockCard, { x: -8, duration: 0.05 })
      .to(lockCard, { x: 8, duration: 0.05 })
      .to(lockCard, { x: -5, duration: 0.05 })
      .to(lockCard, { x: 5, duration: 0.05 })
      .to(lockCard, { x: 0, duration: 0.05 })

    // Red flash
    gsap.to(lockPinInput, { 
      borderColor: '#ff4455', 
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 68, 85, 0.4)',
      duration: 0.1,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        gsap.to(lockPinInput, { clearProps: 'all', duration: 0.3 })
      }
    })

    gsap.to(lockError, { opacity: 1, duration: 0.3 })
    lockPinInput.value = ''
    lockPinInput.focus()
  }

  function unlockApp() {
    // Unlock Animation Sequence
    const tl = gsap.timeline({
      onComplete: () => {
        lockScreen.remove() // completely remove from DOM
        document.body.classList.remove('locked')
        mainAppWrapper.classList.add('unlocked')
        
        // Remove wrapper classes entirely after transition so it doesn't break fixed elements
        setTimeout(() => {
          mainAppWrapper.classList.remove('locked-blur', 'unlocked')
        }, 1200)

        // Trigger ambient music if it exists and wasn't blocked by autoplay policy
        const ambient = document.getElementById('ambientMusic')
        if (ambient && ambient.paused) {
          ambient.play().catch(e => console.log('Audio play blocked:', e))
        }
      }
    })

    // Animate icon unlocking
    tl.to(lockIcon, { 
      rotation: 15, 
      scale: 1.2, 
      color: '#4ade80', 
      duration: 0.4, 
      ease: 'back.out(1.7)' 
    })
    
    // Scale up and fade out the whole card
    tl.to(lockCard, {
      scale: 1.1,
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: 'power3.in'
    }, '+=0.2')
    
    // Fade out overlay background
    tl.to(lockScreen, {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.4')
  }
})
