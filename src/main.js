import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initAnniversaryCanvas } from './anniversary.js'

gsap.registerPlugin(ScrollTrigger)
window.gsap = gsap  // expose globally for level3.js

// ═══════════════════════════════════════════════════════════
//  MINECRAFT TORCH CURSOR
//  Draws a pixelated 3D torch at the cursor position.
//  Creates flickering warm-light darkness effect.
// ═══════════════════════════════════════════════════════════
class MinecraftTorch {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'torchCanvas'
    this.canvas.style.position = 'fixed'
    this.canvas.style.inset    = '0'
    this.canvas.style.width    = '100vw'
    this.canvas.style.height   = '100vh'
    this.canvas.style.zIndex   = '10000'
    this.canvas.style.pointerEvents = 'none'
    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')

    this.mx = window.innerWidth / 2   // mouse x
    this.my = window.innerHeight / 2  // mouse y
    this.tx = this.mx                  // smoothed x
    this.ty = this.my                  // smoothed y
    this.phase = 0

    this.PIXEL = 9   // base unit — each "Minecraft pixel" = 9 real pixels

    this.resize()
    window.addEventListener('resize', () => this.resize())
    window.addEventListener('mousemove', e => { this.mx = e.clientX; this.my = e.clientY })
    window.addEventListener('touchmove', e => { 
      if(e.touches.length > 0) {
        this.mx = e.touches[0].clientX; 
        this.my = e.touches[0].clientY;
      }
    }, { passive: true })
    window.addEventListener('touchstart', e => {
      if(e.touches.length > 0) {
        this.mx = e.touches[0].clientX; 
        this.my = e.touches[0].clientY;
      }
    }, { passive: true })
    this.animate()
  }

  resize() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  /** Draw the dark cave overlay with a warm circular hole at torch position */
  drawDarkness(x, y, phase) {
    const ctx = this.ctx
    const W = this.canvas.width
    const H = this.canvas.height

    // Flicker the radius naturally
    const r = 230 + Math.sin(phase * 1.7) * 18 + Math.cos(phase * 2.9) * 10

    // ── Cave darkness gradient ──────────────────────────
    const dark = ctx.createRadialGradient(x, y, r * 0.12, x, y, r)
    dark.addColorStop(0.00, 'rgba(0,0,0,0)')
    dark.addColorStop(0.35, 'rgba(0,0,0,0.02)')
    dark.addColorStop(0.60, 'rgba(0,0,0,0.40)')
    dark.addColorStop(0.80, 'rgba(0,0,0,0.55)')
    dark.addColorStop(1.00, 'rgba(0,0,0,0.65)')
    ctx.fillStyle = dark
    ctx.fillRect(0, 0, W, H)

    // ── Warm orange torch glow ──────────────────────────
    const warmR  = 160 + Math.sin(phase * 1.1) * 14
    const warmA  = 0.14 + Math.sin(phase * 2.1) * 0.025
    const warm = ctx.createRadialGradient(x, y - 10, 0, x, y - 10, warmR)
    warm.addColorStop(0.00, `rgba(255,160,30,${warmA})`)
    warm.addColorStop(0.40, `rgba(255,100,10,${warmA * 0.45})`)
    warm.addColorStop(0.75, `rgba(200,60,0,${warmA * 0.1})`)
    warm.addColorStop(1.00, 'rgba(0,0,0,0)')
    ctx.fillStyle = warm
    ctx.fillRect(0, 0, W, H)

    // ── Secondary ambient flicker highlight ────────────
    const flareX = x + Math.sin(phase * 3.3) * 15
    const flareY = y + Math.cos(phase * 2.7) * 10 - 20
    const flare  = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 55)
    flare.addColorStop(0, `rgba(255,220,100,${0.06 + Math.sin(phase * 4) * 0.02})`)
    flare.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = flare
    ctx.fillRect(0, 0, W, H)
  }

  /**
   * Draw a solid 3D rectangular prism — Minecraft-style.
   * bx,by = top-left of the FRONT face.  W×H = front face dimensions.
   * DX/DY = isometric depth offsets.
   * opts: { front, frontAlt, top, side, textured }
   */
  draw3DBox(ctx, bx, by, W, H, DX, DY, opts, alpha) {
    const P = this.PIXEL
    ctx.save()
    ctx.globalAlpha = alpha

    // ── Front face ────────────────────────────────────────────
    if (opts.textured) {
      // Alternating row bands for wood-grain pixel texture
      for (let r = 0; r < H; r += P) {
        const even = Math.floor(r / P) % 2 === 0
        ctx.fillStyle = even ? opts.front : opts.frontAlt
        ctx.fillRect(bx, by + r, W, Math.min(P, H - r))
      }
      // Vertical pixel division line down centre of stick
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(bx + Math.floor(W / 2) - 1, by, 1, H)
    } else {
      // Flame head — gradient from bright top to ember bottom
      const grad = ctx.createLinearGradient(bx, by, bx, by + H)
      grad.addColorStop(0.0, opts.frontAlt)   // top — brightest
      grad.addColorStop(0.5, opts.front)      // mid — orange
      grad.addColorStop(1.0, '#cc4400')       // bottom — ember
      ctx.fillStyle = grad
      ctx.fillRect(bx, by, W, H)
    }

    // ── Top face (bright lit parallelogram) ───────────────────
    ctx.fillStyle = opts.top
    ctx.beginPath()
    ctx.moveTo(bx,          by)         // front-left
    ctx.lineTo(bx + DX,     by - DY)    // back-left
    ctx.lineTo(bx + DX + W, by - DY)    // back-right
    ctx.lineTo(bx + W,      by)         // front-right
    ctx.closePath()
    ctx.fill()

    // ── Right side face (dark shadow parallelogram) ───────────
    ctx.fillStyle = opts.side
    ctx.beginPath()
    ctx.moveTo(bx + W,        by)
    ctx.lineTo(bx + W + DX,   by - DY)
    ctx.lineTo(bx + W + DX,   by - DY + H)
    ctx.lineTo(bx + W,        by + H)
    ctx.closePath()
    ctx.fill()

    // ── Pixel grid lines on textured wood ────────────────────
    if (opts.textured) {
      ctx.strokeStyle = 'rgba(0,0,0,0.20)'
      ctx.lineWidth = 0.8
      for (let r = P; r < H; r += P) {
        ctx.beginPath(); ctx.moveTo(bx, by + r); ctx.lineTo(bx + W, by + r); ctx.stroke()
      }
    }

    // ── Block outline ─────────────────────────────────────────
    ctx.strokeStyle = 'rgba(0,0,0,0.75)'
    ctx.lineWidth   = 1.5
    ctx.strokeRect(bx + 0.75, by + 0.75, W - 1.5, H - 1.5)

    ctx.restore()
  }

  /**
   * Draw the full Minecraft torch as two stacked 3D rectangular prisms.
   * Flame HEAD (wide square) sits atop a tall thin STICK.
   */
  drawTorch(x, y, phase) {
    const ctx = this.ctx
    const P   = this.PIXEL          // 9px base unit
    const DX  = Math.round(P * 0.6) // isometric depth — X
    const DY  = Math.round(P * 0.3) // isometric depth — Y

    // Subtle flicker wobble on flame
    const fx = Math.sin(phase * 3.1) * 1.4
    const fy = Math.cos(phase * 2.8) * 0.9

    // ── Proportions ──────────
    const headW  = P * 3   // flame head: 3 units wide
    const headH  = P * 2   // flame head: 2 units tall
    const stickW = P * 2   // stick: 2 units wide
    const stickH = P * 10  // stick: 10 units tall

    ctx.save()
    // Move to cursor, rotate so stick points down-right (held at an angle)
    ctx.translate(x, y)
    ctx.rotate(-Math.PI / 7) // ~25 degrees counter-clockwise

    // Head top-left — center the head around (0,0) so the cursor is exactly at the flame
    const headX  = -headW / 2 - DX / 2 + fx
    const headY  = -headH / 2 + fy
    
    // Stick horizontally centred under head
    const stickX = headX + (headW - stickW) / 2
    const stickY = headY + headH

    // ── 1. Stick — draw first (behind the head) ─────────────
    this.draw3DBox(ctx, stickX, stickY, stickW, stickH, DX, DY, {
      front:    '#D4AF37',  // Premium gold
      frontAlt: '#AA8529',  // Deep gold/bronze
      top:      '#FFF0B3',  // Bright lit gold top
      side:     '#5A3B00',  // Rich dark shadow
      textured: true,
    }, 1.0)

    // ── 2. Flame head — draw on top ──────────────────────────
    const fA = 0.90 + Math.sin(phase * 6.3) * 0.10  // flicker alpha
    this.draw3DBox(ctx, headX, headY, headW, headH, DX, DY, {
      front:    '#ff9900',   // mid orange
      frontAlt: '#ffe555',   // bright yellow-white
      top:      '#ffffff',   // top face — pure white glow
      side:     '#bb4400',   // right side — dark ember
      textured: false,
    }, fA)

    // ── 3. Bright glow bead dancing above flame ───────────────
    const gx = DX * 0.3 + Math.sin(phase * 5.3) * 3
    const gy = headY - DY + Math.cos(phase * 4.1) * 2 + fy
    const gA = 0.88 + Math.sin(phase * 7.5) * 0.12
    const gG = ctx.createRadialGradient(gx, gy, 0, gx, gy, P * 3.5)
    gG.addColorStop(0,    `rgba(255,255,210,${gA})`)
    gG.addColorStop(0.35, `rgba(255,200,50,${gA * 0.5})`)
    gG.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = gG
    ctx.fillRect(gx - P * 3.5, gy - P * 3.5, P * 7, P * 7)

    ctx.restore()
  }


  animate() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Smooth mouse follow (lerp)
    this.tx += (this.mx - this.tx) * 0.12
    this.ty += (this.my - this.ty) * 0.12
    this.phase += 0.055

    this.drawDarkness(this.tx, this.ty, this.phase)
    this.drawTorch(this.tx, this.ty, this.phase)

    requestAnimationFrame(this.animate.bind(this))
  }
}

// ═══════════════════════════════════════════════════════════
//  FALLING PETALS — Continuous cherry blossom wind
// ═══════════════════════════════════════════════════════════
class FallingPetals {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'petalsCanvas'
    this.canvas.style.position = 'fixed'
    this.canvas.style.inset = '0'
    this.canvas.style.zIndex = '1' // behind torch/UI, above background
    this.canvas.style.pointerEvents = 'none'
    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.petals = []
    
    this.resize()
    window.addEventListener('resize', () => this.resize())
    
    // Spawn initial petals across the screen
    for (let i = 0; i < 45; i++) {
      this.petals.push(this.createPetal(true))
    }
    this.animate()
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.canvas.width * 1.2 - (this.canvas.width * 0.1),
      y: randomY ? Math.random() * this.canvas.height : -30,
      size: Math.random() * 4 + 4,
      speedY: Math.random() * 1.2 + 0.5,
      speedX: Math.random() * 1.5 + 0.5, // Drift right (wind)
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      opacity: Math.random() * 0.5 + 0.3,
      // Minecraft pixel colors (pinks/whites)
      color: Math.random() > 0.3 ? '#ff99cc' : '#ffd9e6',
      shade: '#d95c99'
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.petals.forEach(p => {
      p.y += p.speedY
      p.x += p.speedX
      p.rotation += p.rotationSpeed
      
      // Draw pixel petal
      this.ctx.save()
      this.ctx.translate(p.x, p.y)
      this.ctx.rotate(p.rotation * Math.PI / 180)
      this.ctx.globalAlpha = p.opacity
      
      // Main block
      this.ctx.fillStyle = p.color
      this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.8)
      
      // Shadow/detail block for Minecraft feel
      this.ctx.fillStyle = p.shade
      this.ctx.fillRect(-p.size/2, -p.size/2, p.size/2.5, p.size/2.5)
      
      this.ctx.restore()
      
      // Reset if off screen
      if (p.y > this.canvas.height + 30 || p.x > this.canvas.width + 30) {
        Object.assign(p, this.createPetal())
      }
    })
    
    requestAnimationFrame(this.animate.bind(this))
  }
}

// ═══════════════════════════════════════════════════════════
//  HEART CANVAS — Minecraft Pixel Heart / Star Particles
// ═══════════════════════════════════════════════════════════
class HeartCanvas {
  constructor() {
    this.canvas = document.getElementById('heartCanvas')
    this.ctx    = this.canvas.getContext('2d')
    this.particles = []
    this.mouse  = { x: -9999, y: -9999 }
    this.resize()
    this.createParticles()
    window.addEventListener('resize', () => { this.resize(); this.createParticles() })
    window.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY })
    window.addEventListener('touchmove', e => { 
      if(e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX; 
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true })
    this.animate()
  }

  resize() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    this.particles = []
    const count = Math.min(Math.floor(window.innerWidth / 10), 120)
    for (let i = 0; i < count; i++) this.particles.push(new Particle(this.canvas))
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.particles.forEach(p => { p.update(this.mouse); p.draw(this.ctx) })
    requestAnimationFrame(this.animate.bind(this))
  }
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    // Start with random opacity so they don't all pop in at once
    this.opacity = Math.random() 
  }

  reset(mouse) {
    // Default to center if mouse is off-screen
    const mx = mouse.x > 0 ? mouse.x : window.innerWidth / 2
    const my = mouse.y > 0 ? mouse.y : window.innerHeight / 2
    
    // Spawn within a small radius around the torch tip
    const angle = Math.random() * Math.PI * 2
    const dist  = Math.random() * 55
    this.x      = mx + Math.cos(angle) * dist
    this.y      = my + Math.sin(angle) * dist
    
    // Float upwards like flame sparks
    this.speedX = (Math.random() - 0.5) * 0.8
    this.speedY = -Math.random() * 1.5 - 0.5
    
    this.opacity = 1.0
    this.decay   = Math.random() * 0.015 + 0.005
    
    this.type   = Math.random() < 0.7 ? 'heart' : 'star'
    this.pixelSize = Math.floor(Math.random() * 2) + 1
    
    // Pink and warm orange colors
    const isRose = Math.random() < 0.6
    this.color  = isRose
      ? `hsl(${338 + Math.random() * 25}, 80%, ${65 + Math.random() * 20}%)`
      : `hsl(${25  + Math.random() * 20}, 90%, ${65 + Math.random() * 15}%)`
  }

  update(mouse) {
    this.x += this.speedX
    this.y += this.speedY
    this.opacity -= this.decay

    // Respawn at the torch when completely faded out
    if (this.opacity <= 0) {
      this.reset(mouse)
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle   = this.color
    if (this.type === 'heart') this.drawPixelHeart(ctx)
    else this.drawPixelStar(ctx)
    ctx.restore()
  }

  // 7×6 Minecraft pixel heart
  drawPixelHeart(ctx) {
    const P = this.pixelSize
    const g = [
      [0,1,1,0,1,1,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
      [0,0,0,1,0,0,0],
    ]
    const ox = this.x - 3.5 * P, oy = this.y - 3 * P
    g.forEach((row, ri) => row.forEach((c, ci) => {
      if (c) ctx.fillRect(ox + ci * P, oy + ri * P, P, P)
    }))
  }

  // 5×5 Minecraft pixel diamond/star
  drawPixelStar(ctx) {
    const P = this.pixelSize
    const g = [
      [0,0,1,0,0],
      [0,1,1,1,0],
      [1,1,1,1,1],
      [0,1,1,1,0],
      [0,0,1,0,0],
    ]
    const ox = this.x - 2.5 * P, oy = this.y - 2.5 * P
    g.forEach((row, ri) => row.forEach((c, ci) => {
      if (c) ctx.fillRect(ox + ci * P, oy + ri * P, P, P)
    }))
  }
}

// ═══════════════════════════════════════════════════════════
//  MINECRAFT FIREWORKS — Square block particles
// ═══════════════════════════════════════════════════════════
class Fireworks {
  constructor() {
    this.canvas = document.getElementById('fireworksCanvas')
    this.ctx    = this.canvas.getContext('2d')
    this.particles = []
    this.active = false
    this.resize()
    window.addEventListener('resize', () => this.resize())
  }

  resize() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  launch() {
    this.active = true
    this.canvas.style.opacity = '1'
    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        const x = 0.1 * window.innerWidth  + Math.random() * 0.8 * window.innerWidth
        const y = 0.08 * window.innerHeight + Math.random() * 0.55 * window.innerHeight
        this.burst(x, y)
      }, i * 240)
    }
    setTimeout(() => { this.canvas.style.opacity = '0'; this.active = false }, 14 * 240 + 1800)
    this.loop()
  }

  burst(x, y) {
    const colors = ['#F2A7C3','#E8C97E','#B8A4F0','#FF85B3','#ffffff','#FFD700','#ff9500']
    const count  = 60 + Math.floor(Math.random() * 40)
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i
      const speed = 2 + Math.random() * 6
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        // Minecraft-style: square particles
        size: 2 + Math.floor(Math.random() * 5),
        gravity: 0.07,
        fade: 0.01 + Math.random() * 0.01
      })
    }
  }

  loop() {
    if (!this.active && this.particles.length === 0) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.particles = this.particles.filter(p => p.alpha > 0)
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      p.vy += p.gravity; p.vx *= 0.99
      p.alpha -= p.fade
      this.ctx.save()
      this.ctx.globalAlpha = Math.max(0, p.alpha)
      this.ctx.fillStyle   = p.color
      this.ctx.shadowColor = p.color
      this.ctx.shadowBlur  = 6
      // Square "block" particles for Minecraft feel
      this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      this.ctx.restore()
    })
    if (this.active || this.particles.length > 0) requestAnimationFrame(this.loop.bind(this))
  }
}
// ═══════════════════════════════════════════════════════════
//  HEART CURSOR FOR FINAL SLIDE
// ═══════════════════════════════════════════════════════════
class HeartCursor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:10000;';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.particles = [];
    this.active = true;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      if (Math.random() > 0.2) {
        this.particles.push(this.createParticle());
      }
    });
    window.addEventListener('touchmove', (e) => {
      if(e.touches.length > 0) {
        this.x = e.touches[0].clientX;
        this.y = e.touches[0].clientY;
        if (Math.random() > 0.2) {
          this.particles.push(this.createParticle());
        }
      }
    }, { passive: true });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    this.loop();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticle() {
    return {
      x: this.x + (Math.random() - 0.5) * 30,
      y: this.y + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 1, // Drift upwards slightly
      life: 1,
      size: Math.random() * 10 + 6,
      color: '#FFFFF0' // Ivory
    };
  }
  
  drawHeart(ctx, x, y, size, color, glow) {
    ctx.save();
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    // Adjust so x,y is roughly the top-left/center for pointing
    const topX = x;
    const topY = y;
    ctx.moveTo(topX, topY + size / 4);
    ctx.bezierCurveTo(topX, topY, topX - size / 2, topY, topX - size / 2, topY + size / 4);
    ctx.bezierCurveTo(topX - size / 2, topY + size / 2, topX, topY + size * 0.8, topX, topY + size);
    ctx.bezierCurveTo(topX, topY + size * 0.8, topX + size / 2, topY + size / 2, topX + size / 2, topY + size / 4);
    ctx.bezierCurveTo(topX + size / 2, topY, topX, topY, topX, topY + size / 4);
    ctx.fill();
    ctx.restore();
  }
  
  loop() {
    if (!this.active) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw trail
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02; // Fade out speed
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      this.ctx.globalAlpha = p.life;
      this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, true);
    }
    
    // Draw main cursor heart
    this.ctx.globalAlpha = 1;
    // The hot spot of the cursor is the mouse coords (this.x, this.y).
    // Let's offset the heart so its top left bump or center is right at the cursor hot spot.
    this.drawHeart(this.ctx, this.x, this.y - 4, 24, '#800020', true); // Deep Burgundy
    
    requestAnimationFrame(() => this.loop());
  }
}

// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
//  FINAL SLIDE
// ═══════════════════════════════════════════════════════════
window.initFinalSlide = () => {
  initAnniversaryCanvas();
  
  if (window.playMusicTrack) {
    window.playMusicTrack('final');
  }

  // Disable torch on final slide
  const torchBtn = document.getElementById('torchToggleBtn');
  if (torchBtn) torchBtn.style.display = 'none';
  if (window.torch && window.torch.canvas) {
    window.torch.canvas.style.display = 'none';
  }
  
  // Start heart cursor
  if (!window.heartCursor) {
    window.heartCursor = new HeartCursor();
  }

  const midLamp = document.querySelector('.lamp-mid');
  if (midLamp) {
    let isPulled = false;
    midLamp.addEventListener('click', () => {
      if (isPulled) return;
      isPulled = true;
      midLamp.style.transition = 'margin-top 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      midLamp.style.marginTop = '25px';
      setTimeout(() => {
        midLamp.style.transition = 'margin-top 0.4s cubic-bezier(0.5, 0, 0.75, 0)';
        midLamp.style.marginTop = '0px';
        document.body.classList.add('lit-up');
      }, 450);
    });
  }

  // Flower curtain transition
  const finalLetter = document.getElementById('finalLetter');
  const flowerCurtain = document.getElementById('flowerCurtain');
  const finalSlide = document.getElementById('final-slide');
  const letterSlide = document.getElementById('letter-content-slide');

  if (finalLetter && flowerCurtain && finalSlide && letterSlide) {
    let curtainDropped = false;
    finalLetter.addEventListener('click', () => {
      if (curtainDropped) return;
      curtainDropped = true;
      
      // 1. Generate flowers (Optimized for performance)
      flowerCurtain.innerHTML = '';
      const flowerImages = ['/flower_new_1.png', '/flower_new_2.png', '/flower_new_3.png'];
      
      // Create a dense curtain of flowers (Optimized for CSS animation)
      const count = 150;
      for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        img.src = flowerImages[Math.floor(Math.random() * flowerImages.length)];
        img.className = 'curtain-flower';
        
        // Make flowers much bigger to cover the slide (120px to 350px)
        const size = Math.random() * 230 + 120; 
        const x = Math.random() * 120 - 10; // -10vw to 110vw
        const y = Math.random() * 120 - 10; // -10vh to 110vh
        const rot = Math.random() * 360;
        
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.left = `${x}vw`;
        img.style.top = `${y}vh`;
        img.style.transform = `rotate(${rot}deg)`;
        
        // Spin the flower infinitely clockwise (with 150 count, this won't lag)
        const duration = Math.random() * 6000 + 4000; // 4s to 10s per rotation
        img.animate([
          { transform: `rotate(${rot}deg)` },
          { transform: `rotate(${rot + 360}deg)` }
        ], {
          duration: duration,
          iterations: Infinity
        });
        
        flowerCurtain.appendChild(img);
      }
      
      // 2. Drop the curtain
      flowerCurtain.style.display = 'block';
      // Force reflow
      void flowerCurtain.offsetWidth;
      flowerCurtain.classList.add('drop');
      
      // 3. Switch slides and fall away
      setTimeout(() => {
        finalSlide.style.display = 'none';
        letterSlide.style.display = 'block';
        letterSlide.style.opacity = '1';
        document.body.classList.remove('lit-up'); // Clean up old states if needed
        
        setTimeout(() => {
          flowerCurtain.classList.remove('drop');
          flowerCurtain.classList.add('fall-away');
          
          setTimeout(() => {
            flowerCurtain.style.display = 'none';
            flowerCurtain.innerHTML = '';
          }, 1500);
        }, 800);
      }, 1500);
    });
  }

  // Achievement popup
  const ach = document.getElementById('fsAchievement');
  if (ach) {
    setTimeout(() => { ach.classList.add('show'); }, 700);
    setTimeout(() => { ach.classList.remove('show'); }, 4200);
  }

  // Populate the final user answer
  const answerEl = document.getElementById('finalUserAnswer');
  if (answerEl && window.loveAnswer) {
    answerEl.innerText = window.loveAnswer;
  }

  // Set up 3D Scroll Gallery
  const finalScrollArea = document.querySelector('.final-scroll-area');
  const items = gsap.utils.toArray('.gallery-item');
  
  if (finalScrollArea && items.length > 0) {
    // Initial states
    gsap.set(items, { 
      z: -2500, 
      opacity: 0, 
      rotationX: () => Math.random() * 40 - 20,
      rotationY: () => Math.random() * 40 - 20 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: finalScrollArea,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    // Hide the scroll hint once scrolling starts
    tl.to('.scroll-hint-down', { opacity: 0, duration: 0.1 }, 0);

    // Animate each item
    items.forEach((item, i) => {
      // Bring forward
      tl.to(item, {
        z: 0,
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        ease: 'power2.inOut',
        duration: 2
      }, i * 1.5); 

      // Fade out and move past the camera, except for the last item (note)
      if (i < items.length - 1) {
        tl.to(item, {
          z: 1000,
          opacity: 0,
          ease: 'power2.in',
          duration: 1
        }, i * 1.5 + 1.5);
      } else {
        // Last item (love note) floats slowly
        tl.to(item, {
          y: -20,
          rotationZ: Math.random() * 4 - 2,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        }, i * 1.5 + 1.8);
      }
    });
  }

};



window.playClickSound = () => {
  if (!window.audioCtx) {
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  
  const osc = window.audioCtx.createOscillator();
  const gain = window.audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, window.audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, window.audioCtx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.3, window.audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, window.audioCtx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(window.audioCtx.destination);
  
  osc.start();
  osc.stop(window.audioCtx.currentTime + 0.05);
};

document.addEventListener('click', (e) => {
  if (e.target.closest('button, .char-card, .mc-btn-pink, .mc-btn-primary')) {
    window.playClickSound();
  }
});

function typewriterEffect(el, text, speed = 24) {
  return new Promise(resolve => {
    el.textContent = ''
    let i = 0
    const cursor = document.createElement('span')
    cursor.className = 'typewriter-cursor'
    el.appendChild(cursor)

    const iv = setInterval(() => {
      if (i < text.length) { cursor.insertAdjacentText('beforebegin', text[i++]) }
      else { 
        clearInterval(iv);
        setTimeout(() => { cursor.remove(); resolve() }, 600) 
      }
    }, speed)
  })
}

function initTypewriter() {
  const paras = document.querySelectorAll('.letter-body p')
  if (paras.length === 0) return
  const originals = Array.from(paras).map(p => {
    const text = p.textContent
    p.textContent = ''
    return { el: p, text }
  })
  
  let triggered = false
  ScrollTrigger.create({
    trigger: '.letter-card', start: 'top 70%',
    onEnter: async () => {
      if (triggered) return
      triggered = true
      for (const item of originals) {
        await typewriterEffect(item.el, item.text, 22)
      }
      gsap.to('.signature', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
      setTimeout(() => {
        const sa = document.querySelector('.start-action')
        if(sa) { sa.style.opacity = '1'; sa.style.transform = 'translateY(0)'; }
      }, 600)
    },
    once: true
  })
}



// Modules are deferred, so DOM is already parsed
gsap.registerPlugin(ScrollTrigger);
  
  // Start the Minecraft torch (replaces cursor + rose trail)
  window.torch = new MinecraftTorch();

  // Background particles
  window.petals = new FallingPetals();

  // Initialize canvases
  const hCanvas = document.getElementById('heartCanvas');
  const fCanvas = document.getElementById('fireworksCanvas');
  window.hearts = hCanvas ? new HeartCanvas() : null;
  window.fireworks = fCanvas ? new Fireworks() : null;
  
  // Initialize Features
  initLoader();
  initScrollReveal();
  initGSAP();
  initLetterReveal();
  initTypewriter();
  initButtons(window.fireworks);
  initParallax();
  initTorchToggle();
  initTorchHint();
  initMusic();
// ═══════════════════════════════════════════════════════════
//  HEART RAIN & PETAL RAIN
// ═══════════════════════════════════════════════════════════
function petalRain(count = 30) {
  if (window.petals) {
    for (let i = 0; i < count; i++) {
      window.petals.petals.push(window.petals.createPetal(false));
    }
  }
}

function heartRain() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const el = document.createElement('div')
      el.textContent = Math.random() < 0.5 ? '♡' : '♥'
      el.style.cssText = `
        position:fixed; left:${5+Math.random()*90}vw; top:-70px;
        font-size:${1+Math.random()*2.5}rem;
        color:hsl(${330+Math.random()*40},80%,${65+Math.random()*20}%);
        pointer-events:none; z-index:300; opacity:0.9;
        text-shadow:0 0 12px currentColor;
      `
      document.body.appendChild(el)
      gsap.to(el, {
        y: window.innerHeight + 120, x: (Math.random()-0.5)*250,
        rotation: (Math.random()-0.5)*720, opacity: 0,
        duration: 2.5 + Math.random() * 2, ease: 'power1.in',
        onComplete: () => el.remove()
      })
    }, i * 70)
  }
}



// ═══════════════════════════════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════════════════════════════
let revealObserver = null;
function initScrollReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const delay = parseInt(e.target.dataset.delay || 0)
        setTimeout(() => e.target.classList.add('revealed'), delay)
        revealObserver.unobserve(e.target)
      })
    }, { threshold: 0.15 })
  }
  document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => revealObserver.observe(el))
}

// ═══════════════════════════════════════════════════════════
//  GSAP ANIMATIONS
// ═══════════════════════════════════════════════════════════
function initGSAP() {
  if (document.querySelector('.infinity-symbol')) {
    gsap.to('.infinity-symbol', {
      textShadow: '0 0 60px rgba(242,167,195,0.8)',
      duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut'
    })
  }
}

// ═══════════════════════════════════════════════════════════
//  LETTER GLOW REVEAL
// ═══════════════════════════════════════════════════════════
function initLetterReveal() {
  // Reveal is now handled entirely within initTypewriter
}

// ═══════════════════════════════════════════════════════════
//  PARALLAX
// ═══════════════════════════════════════════════════════════
function initParallax() {
  window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content')
    const sy = window.scrollY
    if (heroContent && sy < window.innerHeight) {
      heroContent.style.transform = `translateY(${sy * 0.25}px)`
      heroContent.style.opacity = Math.max(0, 1 - sy / (window.innerHeight * 0.75))
    }
  })
}

// ═══════════════════════════════════════════════════════════
//  BUTTONS
// ═══════════════════════════════════════════════════════════
function initButtons(fireworks) {
  document.getElementById('enterBtn')?.addEventListener('click', () => {
    document.getElementById('letter')?.scrollIntoView({ behavior: 'smooth' })
  })

  // ── START GAME button ──────────────────────────────────────
  const startBtn = document.getElementById('startGameBtn')
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // 1. Button press animation
      gsap.to(startBtn, {
        scale: 0.88, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut',
        onComplete: () => launchGame(fireworks)
      })
    })
  }
}

function launchGame(fireworks) {
  const app    = document.getElementById('app')
  const hero   = document.getElementById('hero')
  const letter = document.getElementById('letter')

  // Disable smooth scroll to avoid sticking at previous scroll offset
  document.documentElement.style.scrollBehavior = 'auto'
  document.documentElement.style.scrollSnapType = 'none'

  // 1. Fade out hero + letter, then remove them completely
  gsap.to([hero, letter], {
    opacity: 0,
    y: -30,
    duration: 0.5,
    ease: 'power2.in',
    stagger: 0.08,
    onComplete: () => {
      hero?.remove()
      letter?.remove()

      // Reset scroll position immediately
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // 2. Inject ONLY Slide 3 (Character Select)
      const charTemplate = document.getElementById('charSelectTemplate')
      if (charTemplate && app) {
        const clone = charTemplate.content.cloneNode(true)
        app.appendChild(clone)

        // Initialize character selection events
        initCharSelect()
        initScrollReveal()

        // Ensure scroll stays at top
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

        // Entrance animation for Slide 3
        const charSec = document.getElementById('reasons')
        if (charSec) {
          gsap.fromTo(charSec,
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }
          )
        }

        // Petal celebration burst
        petalRain(25)
      }
    }
  })
}

// ═══════════════════════════════════════════════════════════
//  CHARACTER SELECT LOGIC
// ═══════════════════════════════════════════════════════════
function initCharSelect() {
  const cards      = document.querySelectorAll('.char-card')
  const confirmBtn = document.getElementById('charConfirmBtn')
  const chosenIcon = document.getElementById('chosenIcon')
  const chosenName = document.getElementById('chosenName')
  const app        = document.getElementById('app')

  const charMeta = {
    pink: { icon: '🐰', name: 'BUNNY GIRL', color: '#ff85b3' },
    red:  { icon: '☠',  name: 'DARK SOUL',  color: '#ff2244' },
    frog: { icon: '🐸', name: 'FROG WITCH', color: '#55cc33' },
  }

  function removeSpriteBackground(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const cvs = document.createElement('canvas');
        cvs.width = img.naturalWidth;
        cvs.height = img.naturalHeight;
        const ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
        const data = imgData.data;
        
        // Sample top-left pixel for background color
        const bgR = data[0], bgG = data[1], bgB = data[2];
        const tolerance = 25;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2];
          if (Math.abs(r - bgR) <= tolerance && 
              Math.abs(g - bgG) <= tolerance && 
              Math.abs(b - bgB) <= tolerance) {
            data[i+3] = 0; // Make transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(cvs.toDataURL('image/png'));
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }

  // Process all sprites and apply them to the character select UI
  const rawSprites = { pink: '/sprite_pink.png', red: '/sprite_red.png', frog: '/sprite_frog.png' }
  const processed = {}
  
  // Set fallback first
  window.processedSprites = rawSprites;

  Promise.all(Object.entries(rawSprites).map(async ([key, url]) => {
    processed[key] = await removeSpriteBackground(url);
  })).then(() => {
    window.processedSprites = processed;
    // Apply to char-sprite elements
    document.querySelectorAll('.char-sprite-pink').forEach(el => el.style.backgroundImage = `url('${processed.pink}')`)
    document.querySelectorAll('.char-sprite-red').forEach(el  => el.style.backgroundImage = `url('${processed.red}')`)
    document.querySelectorAll('.char-sprite-frog').forEach(el  => el.style.backgroundImage = `url('${processed.frog}')`)
  });

  function selectChar(charId) {
    // Deselect all
    cards.forEach(c => c.classList.remove('selected'))

    // Select clicked
    const card = document.querySelector(`.char-card[data-char="${charId}"]`)
    if (!card) return
    card.classList.add('selected')

    // Update confirm bar
    const meta = charMeta[charId]
    chosenIcon.textContent = meta.icon
    chosenName.textContent = meta.name
    chosenName.style.color = meta.color
    confirmBtn.removeAttribute('disabled')

    // Store globally for the rest of the game
    window.selectedCharacter = charId

    // Card bounce
    gsap.fromTo(card,
      { scale: 0.96 },
      { scale: 1, duration: 0.4, ease: 'back.out(2.5)' }
    )
  }

  // Click on card or its SELECT button
  cards.forEach(card => {
    const charId = card.dataset.char
    card.addEventListener('click', () => selectChar(charId))
  })

  // CONFIRM button → remove Slide 3, then mount Slide 4 (Level 1)
  confirmBtn?.addEventListener('click', () => {
    if (!window.selectedCharacter) return

    gsap.to(confirmBtn, {
      scale: 0.9, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut',
      onComplete: () => {
        const charSelectSec = document.getElementById('reasons')

        // 1. Fade out & remove Slide 3
        if (charSelectSec) {
          gsap.to(charSelectSec, {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
              charSelectSec.remove()

              // Reset scroll to top
              window.scrollTo(0, 0)
              document.documentElement.scrollTop = 0
              document.body.scrollTop = 0

              // 2. Inject ONLY Slide 4 (Loading Screen)
              const slide4Template = document.getElementById('slide4Template')
              if (slide4Template && app) {
                const clone = slide4Template.content.cloneNode(true)
                app.appendChild(clone)

                const meta = charMeta[window.selectedCharacter]
                const skinImgMap = {
                  pink: window.processedSprites?.pink || '/sprite_pink.png',
                  red:  window.processedSprites?.red  || '/sprite_red.png',
                  frog: window.processedSprites?.frog || '/sprite_frog.png'
                }

                // Update avatar + name in loading screen
                const activeImg   = document.getElementById('activePlayerImg')
                const activeTitle = document.getElementById('activePlayerTitle')
                if (activeImg)   activeImg.src = skinImgMap[window.selectedCharacter] || '/skin_pink.jpg'
                if (activeTitle && meta) {
                  activeTitle.textContent = meta.name
                  activeTitle.style.color = meta.color
                }

                // Entrance animation for loading screen
                const slide4Sec = document.getElementById('promise')
                if (slide4Sec) {
                  window.scrollTo(0, 0)
                  document.documentElement.scrollTop = 0
                  document.body.scrollTop = 0
                  gsap.fromTo(slide4Sec,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                  )
                }

                // ── 3-second Minecraft loading bar ──────────────────
                const fill    = document.getElementById('mcLoadingFill')
                const pct     = document.getElementById('mcLoadingPercent')
                const tipEl   = document.getElementById('loadingTip')

                const tips = [
                  'Generating terrain blocks…',
                  'Spawning cave monsters…',
                  'Enchanting your sword…',
                  'Loading cherry biome…',
                  'Preparing your quest…',
                ]
                let tipIdx = 0
                const tipInterval = setInterval(() => {
                  tipIdx = (tipIdx + 1) % tips.length
                  if (tipEl) tipEl.textContent = tips[tipIdx]
                }, 700)

                // Animate fill from 0 → 100% over 3 seconds
                // Animate fill from 0 → 100% over 1 second
                let progress = 0
                const DURATION = 1000  // ms
                const START    = performance.now()

                function tickBar(now) {
                  const elapsed = now - START
                  progress = Math.min(elapsed / DURATION, 1)
                  const pctVal = Math.floor(progress * 100)
                  if (fill) fill.style.width = pctVal + '%'
                  if (pct)  pct.textContent  = pctVal + '%'

                  if (progress < 1) {
                    requestAnimationFrame(tickBar)
                  } else {
                    // Loading done — transition to Slide 5
                    clearInterval(tipInterval)
                    if (fill) fill.style.width = '100%'
                    if (pct)  pct.textContent  = '100%'

                    setTimeout(() => {
                      if (slide4Sec) {
                        gsap.to(slide4Sec, {
                          opacity: 0, y: -30, duration: 0.5, ease: 'power2.in',
                          onComplete: () => {
                            slide4Sec.remove()
                            window.scrollTo(0, 0)
                            document.documentElement.scrollTop = 0
                            document.body.scrollTop = 0
                            launchSlide5(app, charMeta)
                          }
                        })
                      }
                    }, 350)
                  }
                }
                requestAnimationFrame(tickBar)
              }
            }
          })
        }
      }
    })
  })
}

// ═══════════════════════════════════════════════════════════
//  LAUNCH SLIDE 5 — Game Start Screen
// ═══════════════════════════════════════════════════════════
function launchSlide5(app, charMeta) {
  const finalTemplate = document.getElementById('finalTemplate')
  if (!finalTemplate || !app) return

  const clone = finalTemplate.content.cloneNode(true)
  app.appendChild(clone)

  // Update player avatar + name
  const meta = charMeta ? charMeta[window.selectedCharacter] : null
  const gsSprite = document.getElementById('gsPlayerSprite')
  const gsName = document.getElementById('gsPlayerName')
  
  if (gsSprite && window.selectedCharacter) {
    // Remove old sprite classes
    gsSprite.classList.remove('char-sprite-pink', 'char-sprite-red', 'char-sprite-frog')
    // Add new sprite class
    gsSprite.classList.add(`char-sprite-${window.selectedCharacter}`)
  }
  
  if (gsName && meta) {
    gsName.textContent = meta.name
    gsName.style.color = meta.color
  }

  // Entrance animation
  const finalSec = document.getElementById('final')
  if (finalSec) {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    gsap.fromTo(finalSec,
      { opacity: 0, scale: 0.93, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.5)' }
    )

    // Stagger animate the inner elements
    gsap.fromTo('.gs-level-badge, .gs-player-banner, .gs-objective-box, .gs-stats-row, .gs-start-btn',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.4 }
    )
  }

  // Fireworks + petals
  if (window.fireworks) window.fireworks.launch()
  petalRain(30)

  // ── PLAY button → Slide 6 game ──────────────────────────
  const playBtn = document.getElementById('gsStartBtn')
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      gsap.to(playBtn, {
        scale: 0.88, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut',
        onComplete: () => {
          const finalSec2 = document.getElementById('final')
          if (finalSec2) {
            gsap.to(finalSec2, {
              opacity: 0, y: -30, duration: 0.5, ease: 'power2.in',
              onComplete: () => {
                finalSec2.remove()
                window.scrollTo(0, 0)
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0
                launchSlide6(app, charMeta)
              }
            })
          }
        }
      })
    })
  }
}

// ═══════════════════════════════════════════════════════════
//  LAUNCH SLIDE 6 — Nether Ghast Battle
// ═══════════════════════════════════════════════════════════
function launchSlide6(app, charMeta) {
  const tmpl = document.getElementById('slide6Template')
  if (!tmpl || !app) return

  const clone = tmpl.content.cloneNode(true)
  app.appendChild(clone)

  // Disable scroll on document while game runs
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'

  const canvas = document.getElementById('gameCanvas')
  if (!canvas) return

  const skinKey = window.selectedCharacter || 'pink'
  const spriteSheetMap = { pink: '/sprite_pink.png', red: '/sprite_red.png', frog: '/sprite_frog.png' }

  const game = new Level1Game(canvas, window.processedSprites?.[skinKey] || spriteSheetMap[skinKey], skinKey)
  window.currentGame = game
  
  // Play battle music when level 1 starts
  if (window.playMusicTrack) {
    window.playMusicTrack('battle');
  }
  
  game.start()

  // Entrance animation on the game section
  const gameSec = document.getElementById('level1Game')
  if (gameSec) {
    gsap.fromTo(gameSec, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
  }
}

// ═══════════════════════════════════════════════════════════
//  LEVEL 1 GAME — Pixel-Art 3D Ghast Battle
// ═══════════════════════════════════════════════════════════
class Level1Game {
  constructor(canvas, skinSrc, skinKey) {
    this.canvas = canvas
    this.ctx    = canvas.getContext('2d')
    this.skinSrc = skinSrc
    this.skinKey = skinKey || 'pink'
    this.playerImg = new Image()
    this.playerImg.src = skinSrc

    // Sprite sheet walk animation: 2064×512, 4 frames, each 516×512
    // Display size: 56×78 (player hitbox), sprite frame ~56px wide
    this.SPRITE_FRAMES   = 4
    this.SPRITE_W        = 2064  // natural image width
    this.SPRITE_H        = 512   // natural image height
    this.SPRITE_FRAME_W  = this.SPRITE_W / this.SPRITE_FRAMES  // 516px per frame
    this.spriteFrameIdx  = 0
    this.spriteFrameTick = 0
    this.spriteFrameRate = 8  // advance frame every 8 game ticks

    this.frame = 0
    this.running = false
    this.gameOver = false
    this.victory  = false
    this.screenShake = 0

    this.keys = {}
    this.throwCooldown = 0

    // Running animation
    this.runPhase = 0
    this.isMoving = false
    this.playerFacing = 1

    // Portal sequence
    this.showPortal = false
    this.portalState = null // 'appear' | 'idle' | 'runTo' | 'enter' | 'done'
    this.portalTimer = 0
    this.portalX = 0
    this.portalY = 0
    this.portalScale = 0
    this.playerEntering = false
    this.playerEnterScale = 1

    this.resize()
    window.addEventListener('resize', () => this.resize())
    this._setupInput()

    this.initEntities()
    this.initHUD()
  }

  resize() {
    this.W = this.canvas.width  = window.innerWidth
    this.H = this.canvas.height = window.innerHeight
    if (this.player) {
      this.player.x = this.W / 2
      this.player.groundY = this.H - 90
      this.player.y = this.player.groundY
    }
  }

  initEntities() {
    this.player = {
      x: this.W / 2,
      groundY: this.H - 90,
      y: this.H - 90,
      w: 56, h: 78,
      hearts: 3, maxHearts: 3,
      invincible: false, invTimer: 0,
      speed: 7,
    }
    this.ghast = {
      x: this.W / 2, y: 170,
      w: 110, h: 100,
      hearts: 3, maxHearts: 3,
      vx: 1.4,
      phase: 0,
      shootTimer: 0, shootInterval: 145,
      hit: false, hitTimer: 0,
      dead: false, deadTimer: 0,
    }
    this.fireballs = []
    this.tridents  = []
    this.particles = []
  }

  initHUD() {
    this._updateHUD()
  }

  _setupInput() {
    this._onKeyDown = e => {
      this.keys[e.code] = true
      if (['Space','ArrowLeft','ArrowRight','KeyA','KeyD'].includes(e.code)) e.preventDefault()
      if (e.code === 'Space') this._throwTrident()
    }
    this._onKeyUp = e => { this.keys[e.code] = false }
    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup',   this._onKeyUp)

    // Mobile
    const safe = (id, down, up) => {
      const el = document.getElementById(id)
      if (!el) return
      el.addEventListener('touchstart', e => { e.preventDefault(); down() }, { passive: false })
      el.addEventListener('touchend',   e => { e.preventDefault(); if(up) up() }, { passive: false })
      el.addEventListener('mousedown',  down)
      el.addEventListener('mouseup',    up || (() => {}))
    }
    safe('ctrlLeft',  () => this.keys['ArrowLeft']  = true, () => this.keys['ArrowLeft']  = false)
    safe('ctrlRight', () => this.keys['ArrowRight'] = true, () => this.keys['ArrowRight'] = false)
    document.getElementById('ctrlThrow')?.addEventListener('click', () => this._throwTrident())
  }

  start() {
    this.running = true
    this._loop()
  }

  stop() {
    this.running = false
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup',   this._onKeyUp)
  }

  _loop() {
    if (!this.running) return
    this._update()
    this._draw()
    requestAnimationFrame(() => this._loop())
  }

  // ── UPDATE ─────────────────────────────────────────────────
  _update() {
    this.frame++

    // Portal state machine runs even during victory
    if (this.showPortal) this._updatePortal()

    if (this.gameOver || this.victory) return

    // Player move
    const p = this.player
    const movingL = this.keys['ArrowLeft']  || this.keys['KeyA']
    const movingR = this.keys['ArrowRight'] || this.keys['KeyD']
    if (movingL) { p.x = Math.max(p.w/2 + 10, p.x - p.speed); this.playerFacing = -1; }
    if (movingR) { p.x = Math.min(this.W - p.w/2 - 10, p.x + p.speed); this.playerFacing = 1; }
    this.isMoving = movingL || movingR
    if (this.isMoving) this.runPhase += 0.28
    else this.runPhase *= 0.85  // ease to rest

    // Player invincibility
    if (p.invincible) { p.invTimer--; if (p.invTimer <= 0) p.invincible = false }

    // Throw cooldown
    if (this.throwCooldown > 0) this.throwCooldown--

    // Ghast float + move
    const g = this.ghast
    g.phase += 0.018
    g.x += g.vx
    g.y = 160 + Math.sin(g.phase) * 50
    if (g.x > this.W - 110 || g.x < 110) g.vx *= -1

    // Ghast hit flash
    if (g.hit) { g.hitTimer--; if (g.hitTimer <= 0) g.hit = false }

    // Ghast death animation
    if (g.dead) {
      g.deadTimer++
      if (g.deadTimer > 80 && !this.victory) {
        this.victory = true
        setTimeout(() => this.showRewardScreen(), 500)
      }
      return
    }

    // Ghast shoot
    g.shootTimer++
    if (g.shootTimer >= g.shootInterval) {
      g.shootTimer = 0
      this._shootFireball()
    }

    // Update fireballs
    this.fireballs = this.fireballs.filter(fb => {
      fb.x += fb.vx; fb.y += fb.vy; fb.rot += 0.08
      // Trail particles
      if (Math.random() < 0.5) this._spawnParticle(fb.x, fb.y, 'fire')
      // Hit player
      if (!p.invincible && Math.abs(fb.x - p.x) < 38 && Math.abs(fb.y - p.y) < 50) {
        this._hitPlayer()
        this._explode(fb.x, fb.y, 'fire', 20)
        return false
      }
      return fb.y < this.H + 60
    })

    // Update tridents
    this.tridents = this.tridents.filter(t => {
      t.x += t.vx; t.y += t.vy; t.rot += 0.25
      // Hit ghast
      if (!g.dead && Math.abs(t.x - g.x) < g.w * 0.6 && Math.abs(t.y - g.y) < g.h * 0.6) {
        this._hitGhast()
        this._explode(t.x, t.y, 'hit', 18)
        return false
      }
      return t.y > -80
    })

    // Particles
    this.particles = this.particles.filter(pp => {
      pp.x += pp.vx; pp.y += pp.vy
      pp.vy += 0.06
      pp.life -= pp.decay
      return pp.life > 0
    })

    // Ghast dies
    if (g.hearts <= 0 && !g.dead) {
      g.dead = true
      g.deadTimer = 0
      this._explode(g.x, g.y, 'big', 80)
      this.screenShake = 18
    }

    // Player dies
    if (p.hearts <= 0 && !this.gameOver) this.gameOver = true
  }

  _throwTrident() {
    if (this.gameOver || this.victory || this.throwCooldown > 0) return
    this.throwCooldown = 22
    this.tridents.push({
      x: this.player.x + (Math.random()-0.5)*10,
      y: this.player.y - 50,
      vx: (Math.random()-0.5) * 1.5,
      vy: -14,
      rot: -Math.PI / 2,
    })
  }

  _shootFireball() {
    const g = this.ghast
    const angle = Math.atan2(this.player.y - g.y, this.player.x - g.x)
    const spd = 3.8 + Math.random() * 1.2
    this.fireballs.push({
      x: g.x, y: g.y + 55,
      vx: Math.cos(angle) * spd + (Math.random()-0.5) * 0.8,
      vy: Math.sin(angle) * spd,
      size: 26, rot: 0,
    })
  }

  _hitPlayer() {
    if (this.player.invincible) return
    this.player.hearts = Math.max(0, this.player.hearts - 1)
    this.player.invincible = true
    this.player.invTimer = 95
    this.screenShake = 10
    this._updateHUD()
  }

  _hitGhast() {
    const g = this.ghast
    g.hearts = Math.max(0, g.hearts - 1)
    g.hit = true; g.hitTimer = 28
    this.screenShake = 6
    this._updateHUD()
  }

  _spawnParticle(x, y, type) {
    this.particles.push({
      x, y,
      vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3 - 1,
      life: 0.9, decay: 0.04 + Math.random()*0.04,
      size: 4 + Math.random()*6,
      color: type === 'fire'
        ? `hsl(${15+Math.random()*30},100%,${45+Math.random()*25}%)`
        : `hsl(${175+Math.random()*30},80%,${55+Math.random()*20}%)`,
      type,
    })
  }

  _explode(x, y, type, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd   = 1.5 + Math.random() * (type === 'big' ? 10 : 5)
      let color
      if (type === 'fire') color = `hsl(${15+Math.random()*30},100%,${50+Math.random()*20}%)`
      else if (type === 'hit') color = `hsl(${170+Math.random()*40},80%,${60+Math.random()*20}%)`
      else color = `hsl(${Math.random()*360},85%,65%)`
      this.particles.push({
        x, y,
        vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd - 2,
        life: 1, decay: 0.012 + Math.random()*0.025,
        size: 3 + Math.random()*10, color, type,
      })
    }
  }

  // ── DRAW ───────────────────────────────────────────────────
  _draw() {
    const ctx = this.ctx, W = this.W, H = this.H

    ctx.save()
    if (this.screenShake > 0) {
      ctx.translate((Math.random()-0.5)*this.screenShake, (Math.random()-0.5)*this.screenShake)
      this.screenShake *= 0.78
      if (this.screenShake < 0.4) this.screenShake = 0
    }

    this._drawNether(ctx, W, H)

    // Back particles (fire)
    this.particles.filter(p => p.type === 'fire' || p.type === 'big').forEach(p => {
      ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.color
      ctx.shadowColor = p.color; ctx.shadowBlur = 12
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size); ctx.restore()
    })

    this.fireballs.forEach(fb => this._drawFireball(ctx, fb))
    this._drawGhast(ctx)
    this.tridents.forEach(t => this._drawTrident(ctx, t))

    // Front particles (hit)
    this.particles.filter(p => p.type === 'hit').forEach(p => {
      ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.color
      ctx.shadowColor = p.color; ctx.shadowBlur = 8
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size); ctx.restore()
    })

    this._drawPlayer(ctx)

    // End Portal overlay
    if (this.showPortal) this._drawEndPortal(ctx, W, H)

    // victory is handled by HTML overlay (showRewardScreen)
    if (this.gameOver) this._drawGameOver(ctx, W, H)

    ctx.restore()
  }

  // ── REWARD SCREEN (HTML overlay) ──────────────────────────
  showRewardScreen() {
    // Switch music back to ambient when text appears
    if (window.playMusicTrack) {
      window.playMusicTrack('ambient');
    }
    // Stop game entities but keep canvas background loop
    if (window.fireworks) window.fireworks.launch()
    petalRain(40)

    const overlay = document.createElement('div')
    overlay.id = 'victoryOverlay'
    overlay.className = 'vr-overlay'
    overlay.innerHTML = `
      <div class="vr-backdrop"></div>
      <div class="vr-panel" id="vrPanel">

        <!-- Header -->
        <div class="vr-header">
          <div class="vr-cleared-tag">⚔ LEVEL 1 CLEARED ⚔</div>
          <h2 class="vr-main-title">GHAST DEFEATED!</h2>
        </div>

        <!-- Heart Reward -->
        <div class="vr-reward-box">
          <div class="vr-reward-label">✦ REWARD UNLOCKED ✦</div>
          <div class="vr-heart-row">
            <div class="vr-half-heart" id="vrHalfHeart">${this._buildPixelHeartHtml()}</div>
            <div class="vr-heart-meta">
              <div class="vr-heart-title">PIECE OF HEART</div>
              <div class="vr-heart-sub">1 / 2 COLLECTED</div>
              <div class="vr-heart-bar-wrap">
                <div class="vr-heart-bar-fill"></div>
              </div>
              <div class="vr-heart-note">Collect the other half in Level 2!</div>
            </div>
          </div>
        </div>

        <!-- Message box -->
        <div class="vr-msg-box">
          <div class="vr-msg-header">💌 MESSAGE FOR YOU</div>
          <p class="vr-msg-text" id="vrMsgText"></p>
        </div>

        <!-- Next level button -->
        <button class="vr-next-btn" id="vrNextBtn">▶ LET'S GO TO LEVEL 2 →</button>
      </div>
    `

    const gameSec = document.getElementById('level1Game')
    if (gameSec) gameSec.appendChild(overlay)

    // Slide panel in from right
    gsap.fromTo('#vrPanel',
      { x: '110%', opacity: 0 },
      { x: '0%', opacity: 1, duration: 0.85, ease: 'back.out(1.3)', delay: 0.2 }
    )

    // Heart pop-in
    gsap.fromTo('#vrHalfHeart',
      { scale: 0, rotate: -20 },
      { scale: 1, rotate: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', delay: 0.9 }
    )

    // Progress bar fill
    gsap.fromTo('.vr-heart-bar-fill',
      { width: '0%' },
      { width: '50%', duration: 1.2, ease: 'power2.out', delay: 1.1 }
    )

    // Typewriter message
    const MSG = [
      'oyyy hoyyyy mere pyare bache ne mardiya!!! 🎉',
      '',
      'you are so strong bachaa,',
      'well done — i am proud of you!!! 💕',
      '',
      'abhi lets go on 2nd lvl mera babu,',
      '',
      'ALL THE BEST BABU 💖✨',
    ].join('\n')
    const msgEl = document.getElementById('vrMsgText')
    let ci = 0
    const typer = setInterval(() => {
      if (!msgEl) { clearInterval(typer); return }
      msgEl.innerHTML = MSG.slice(0, ++ci).replace(/\n/g, '<br>')
      if (ci >= MSG.length) clearInterval(typer)
    }, 28)

    // Next-level button — triggers End Portal sequence
    document.getElementById('vrNextBtn')?.addEventListener('click', () => {
      if (window.playMusicTrack) {
        window.playMusicTrack('battle');
      }
      gsap.to('#vrPanel', {
        x: '-110%', opacity: 0, duration: 0.5, ease: 'power3.in',
        onComplete: () => {
          overlay.remove()
          // Spawn End Portal on ground and run character into it
          this.showPortal = true
          this.portalState = 'appear'
          this.portalTimer = 0
          this.portalX = this.W / 2
          this.portalY = this.H - 90
          this.portalScale = 0
          this.playerEntering = false
          this.playerEnterScale = 1
        }
      })
    })
  }

  _buildPixelHeartHtml() {
    // Left half of a pixel Minecraft heart (ragged right edge = broken side)
    // 0=transparent, 1=dark border, 2=mid-red, 3=bright highlight
    const grid = [
      [0,1,2,3],
      [1,3,3,2],
      [1,3,3,2],
      [1,2,2,2],
      [0,1,2,2],
      [0,0,1,2],
      [0,0,0,1],
      [0,0,0,0],
    ]
    const clr = { 0: 'transparent', 1: '#220000', 2: '#cc0000', 3: '#ff4455' }
    const P = 18
    let h = `<div style="display:grid;grid-template-columns:repeat(4,${P}px);gap:1px;">`
    grid.forEach(row => row.forEach(v => {
      const bg = clr[v]
      const shadow = v > 1 ? `box-shadow:inset -2px -2px 0 #880000, inset 2px 2px 0 rgba(255,150,160,0.5);` : ''
      h += `<div style="width:${P}px;height:${P}px;background:${bg};${shadow}image-rendering:pixelated;"></div>`
    }))
    h += '</div>'
    return h
  }

  _drawNether(ctx, W, H) {
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0,   '#0d0000')
    sky.addColorStop(0.35,'#220500')
    sky.addColorStop(0.65,'#440800')
    sky.addColorStop(1,   '#110000')
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H)

    // Ambient glowing cracks
    const t = this.frame * 0.025
    for (let i = 0; i < 6; i++) {
      const cx = W * (i + 0.5) / 6
      const g = ctx.createRadialGradient(cx, H, 5, cx, H, 110)
      g.addColorStop(0, `rgba(255,90,0,${0.18 + Math.sin(t + i*1.1)*0.06})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    }

    // Red fog layers
    for (let i = 0; i < 3; i++) {
      const fy = H*0.3 + i*H*0.15
      const fg = ctx.createLinearGradient(0, fy, 0, fy+80)
      fg.addColorStop(0, 'rgba(180,20,0,0)')
      fg.addColorStop(0.5, `rgba(180,20,0,${0.04 + Math.sin(t*0.7 + i)*0.02})`)
      fg.addColorStop(1, 'rgba(180,20,0,0)')
      ctx.fillStyle = fg; ctx.fillRect(0, fy, W, 80)
    }

    // Netherrack floor
    const floorY = H - 68
    for (let bx = 0; bx * 38 < W; bx++) {
      const c = bx % 2 === 0 ? '#2a0a00' : '#220800'
      ctx.fillStyle = c
      ctx.fillRect(bx*38, floorY, 38, H - floorY)
      ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1
      ctx.strokeRect(bx*38, floorY, 38, H - floorY)
    }

    // Lava glow seeping from floor
    const lavaG = ctx.createLinearGradient(0, floorY - 40, 0, floorY)
    lavaG.addColorStop(0, 'rgba(255,70,0,0)')
    lavaG.addColorStop(1, 'rgba(255,70,0,0.45)')
    ctx.fillStyle = lavaG; ctx.fillRect(0, floorY - 40, W, 40)

    // Ground fire wisps
    for (let i = 0; i < 9; i++) {
      const fx = (W / 9) * i + 20
      const fh = 16 + Math.sin(t*3.2 + i * 0.9) * 9
      const wispG = ctx.createLinearGradient(fx, floorY - fh, fx, floorY)
      wispG.addColorStop(0, 'rgba(255,180,0,0)')
      wispG.addColorStop(0.5, 'rgba(255,100,0,0.65)')
      wispG.addColorStop(1, 'rgba(255,40,0,0.9)')
      ctx.fillStyle = wispG
      ctx.fillRect(fx - 5, floorY - fh, 10, fh)
    }

    // Dark Nether pillars (background columns)
    [0.08, 0.22, 0.78, 0.92].forEach(xp => {
      ctx.fillStyle = 'rgba(6,0,0,0.75)'
      ctx.fillRect(W*xp - 14, 0, 28, floorY)
      ctx.fillStyle = 'rgba(80,10,0,0.25)'
      ctx.fillRect(W*xp - 14, 0, 5, floorY)
    })
  }

  _drawGhast(ctx) {
    const g = this.ghast
    ctx.save()
    ctx.translate(g.x, g.y)

    // Death scale-down
    if (g.dead) {
      const s = Math.max(0, 1 - g.deadTimer / 60)
      ctx.scale(s, s)
      ctx.globalAlpha = Math.max(0, 1 - g.deadTimer / 80)
    }

    const t = g.phase
    const bob = Math.sin(t * 2.2) * 8
    ctx.translate(0, bob)

    const bw = 118, bh = 100
    const DX = 24, DY = 14
    const hit = g.hit

    // ── OUTER DANGER AURA (pulsing red glow) ──
    const auraR = 165 + Math.sin(t * 3.5) * 22
    const aG = ctx.createRadialGradient(0, 0, 30, 0, 0, auraR)
    aG.addColorStop(0, hit ? 'rgba(255,50,0,0.55)' : 'rgba(200,0,0,0.3)')
    aG.addColorStop(0.5, hit ? 'rgba(255,100,0,0.2)' : 'rgba(120,0,0,0.12)')
    aG.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = aG
    ctx.fillRect(-auraR, -auraR, auraR * 2, auraR * 2)

    // ── NETHER CRACK LINES ──
    const crackAlpha = 0.55 + Math.sin(t * 4) * 0.25
    ctx.save()
    ctx.globalAlpha = crackAlpha
    ctx.strokeStyle = '#ff4400'
    ctx.lineWidth = 1.5
    ctx.shadowColor = '#ff8800'
    ctx.shadowBlur = 6
    const cracks = [
      [[-bw/2+10, -bh/2+15], [-bw/2+35, -bh/2+45]],
      [[-bw/2+40, -bh/2+5],  [-bw/2+60, -bh/2+30]],
      [[bw/2-20, -bh/2+20],  [bw/2-45, -bh/2+55]],
      [[-10, -bh/2+10],       [10, -bh/2+50]],
    ]
    cracks.forEach(pts => {
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      ctx.lineTo(pts[1][0], pts[1][1])
      ctx.stroke()
    })
    ctx.restore()

    // ── GROUND SHADOW ──
    const shG = ctx.createRadialGradient(0, 60, 10, 0, 60, 100)
    shG.addColorStop(0, 'rgba(180,0,0,0.5)')
    shG.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = shG
    ctx.fillRect(-100, 35, 200, 60)

    // ── 3D ISOMETRIC BODY — Top face ──
    ctx.fillStyle = hit ? '#ff8888' : '#c4c4c4'
    ctx.beginPath()
    ctx.moveTo(-bw/2, -bh/2)
    ctx.lineTo(-bw/2 + DX, -bh/2 - DY)
    ctx.lineTo(bw/2 + DX, -bh/2 - DY)
    ctx.lineTo(bw/2, -bh/2)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = hit ? '#ffcccc' : '#e8e8e8'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Right face (shadow side)
    const rightGrad = ctx.createLinearGradient(bw/2, -bh/2, bw/2 + DX, bh/2)
    rightGrad.addColorStop(0, hit ? '#ff7777' : '#8a8a8a')
    rightGrad.addColorStop(1, hit ? '#cc4444' : '#606060')
    ctx.fillStyle = rightGrad
    ctx.beginPath()
    ctx.moveTo(bw/2, -bh/2)
    ctx.lineTo(bw/2 + DX, -bh/2 - DY)
    ctx.lineTo(bw/2 + DX, bh/2 - DY)
    ctx.lineTo(bw/2, bh/2)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#555'
    ctx.lineWidth = 1
    ctx.stroke()

    // Front face gradient
    const frontGrad = ctx.createLinearGradient(0, -bh/2, 0, bh/2)
    frontGrad.addColorStop(0, hit ? '#ffdddd' : '#f0f0f0')
    frontGrad.addColorStop(1, hit ? '#ffaaaa' : '#c8c8c8')
    ctx.fillStyle = frontGrad
    ctx.fillRect(-bw/2, -bh/2, bw, bh)
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1.5
    ctx.strokeRect(-bw/2, -bh/2, bw, bh)

    // Scar / texture marks
    ctx.fillStyle = hit ? 'rgba(150,50,50,0.7)' : 'rgba(80,80,80,0.65)'
    ;[[-35,-30,22,5],[14,-28,18,5],[-12,8,28,4],[28,18,12,4],[-38,28,8,4],[10,-10,20,4]].forEach(([mx,my,mw,mh]) =>
      ctx.fillRect(mx, my, mw, mh))

    // ── FURROWED BROW (angry V) ──
    ctx.save()
    ctx.strokeStyle = hit ? '#cc0000' : '#333'
    ctx.lineWidth = 3.5
    ctx.lineCap = 'round'
    ctx.shadowColor = '#ff0000'
    ctx.shadowBlur = hit ? 12 : 5
    ctx.beginPath(); ctx.moveTo(-38, -28); ctx.lineTo(-14, -18); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(14, -18);  ctx.lineTo(38, -28);  ctx.stroke()
    ctx.restore()

    // ── EYES (animated pulsing demon eyes) ──
    const eyePulse = Math.sin(t * 5) * 0.15 + 0.85
    const eyePositions = [-26, 12]
    eyePositions.forEach(ex => {
      const ey = -5
      ctx.fillStyle = '#1a0000'; ctx.fillRect(ex - 11, ey - 11, 22, 22)
      ctx.fillStyle = hit ? '#ffeeee' : '#e0d0d0'; ctx.fillRect(ex - 8, ey - 8, 16, 16)
      ctx.fillStyle = hit ? '#ff4444' : '#cc0000'; ctx.fillRect(ex - 6, ey - 6, 12, 12)
      const eyeOffY = Math.sin(t * 2.2) * 1.5
      ctx.fillStyle = '#0a0000'; ctx.fillRect(ex - 3, ey - 3 + eyeOffY, 6, 6)
      ctx.fillStyle = '#ff8800'; ctx.fillRect(ex - 1, ey - 1 + eyeOffY, 2, 2)
      const eG1 = ctx.createRadialGradient(ex, ey, 0, ex, ey, 22 * eyePulse)
      eG1.addColorStop(0, hit ? 'rgba(255,50,0,0.9)' : 'rgba(255,0,0,0.75)')
      eG1.addColorStop(0.5, 'rgba(200,0,0,0.3)')
      eG1.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = eG1; ctx.fillRect(ex - 25, ey - 25, 50, 50)
      const eG2 = ctx.createRadialGradient(ex, ey, 0, ex, ey, 45 * eyePulse)
      eG2.addColorStop(0, 'rgba(255,0,0,0.15)')
      eG2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = eG2; ctx.fillRect(ex - 50, ey - 50, 100, 100)
    })

    // ── MOUTH (no teeth — open void + fire glow) ──
    ctx.fillStyle = '#1a0000'; ctx.fillRect(-20, 20, 40, 28)
    ctx.fillStyle = '#000000'; ctx.fillRect(-17, 23, 34, 22)
    const mouthGlow = t * 4
    const mG = ctx.createRadialGradient(0, 32, 2, 0, 32, 28)
    mG.addColorStop(0, `rgba(255,${120 + Math.sin(mouthGlow) * 60},0,0.95)`)
    mG.addColorStop(0.4, 'rgba(255,50,0,0.6)')
    mG.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = mG; ctx.fillRect(-28, 10, 56, 50)
    for (let fi = 0; fi < 3; fi++) {
      const flicker = Math.sin(t * 8 + fi * 2.1) * 4
      const fh = 12 + Math.abs(Math.sin(t * 6 + fi)) * 8
      ctx.fillStyle = fi % 2 === 0 ? 'rgba(255,180,0,0.9)' : 'rgba(255,80,0,0.85)'
      ctx.fillRect(-10 + fi * 10 - 3, 26 + flicker, 6, fh)
    }

    // ── TENTACLES (9 curling, animated) ──
    const tentDefs = [
      {dx:-52, len:60, p:0.0, w:9}, {dx:-36, len:80, p:0.5, w:10},
      {dx:-18, len:72, p:1.0, w:11}, {dx:0,   len:88, p:1.5, w:12},
      {dx: 18, len:74, p:2.0, w:11}, {dx:36,  len:82, p:2.5, w:10},
      {dx: 52, len:62, p:3.0, w:9},
      {dx:-64, len:44, p:3.5, w:8}, {dx:64,   len:48, p:4.0, w:8},
    ]
    tentDefs.forEach(td => {
      const sw  = Math.sin(t * 1.8 + td.p) * 9
      const segH = td.len / 3
      for (let seg = 0; seg < 3; seg++) {
        const yOff = bh/2 + seg * segH
        const xOff = td.dx + sw * (seg + 1) * 0.4
        const segW = Math.max(4, td.w - seg * 2.5)
        const tGrad = ctx.createLinearGradient(xOff - segW/2, 0, xOff + segW/2, 0)
        tGrad.addColorStop(0, hit ? '#cc6666' : '#9a9a9a')
        tGrad.addColorStop(0.35, hit ? '#ffbbbb' : '#d4d4d4')
        tGrad.addColorStop(0.7, hit ? '#ffaaaa' : '#b8b8b8')
        tGrad.addColorStop(1, hit ? '#884444' : '#707070')
        ctx.fillStyle = tGrad; ctx.fillRect(xOff - segW/2, yOff, segW, segH + 2)
        ctx.strokeStyle = hit ? '#883333' : '#666'; ctx.lineWidth = 0.8
        ctx.strokeRect(xOff - segW/2, yOff, segW, segH + 2)
      }
      const tipX = td.dx + sw * 1.2
      ctx.fillStyle = hit ? '#882222' : '#555'
      ctx.fillRect(tipX - 4, bh/2 + td.len, 8, 7)
    })

    // ── AMBIENT DANGER GLOW ──
    const gPulse = 0.08 + Math.sin(t * 3) * 0.04
    const gG = ctx.createRadialGradient(0, 0, 0, 0, 0, 140)
    gG.addColorStop(0, hit ? 'rgba(255,80,0,0.35)' : `rgba(255,0,0,${gPulse})`)
    gG.addColorStop(0.6, hit ? 'rgba(255,30,0,0.1)' : `rgba(100,0,0,${gPulse * 0.5})`)
    gG.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gG; ctx.fillRect(-140, -140, 280, 280)

    this._drawGhastHearts(ctx, bh)
    ctx.restore()
  }


  _drawGhastHearts(ctx, bh) {
    const P = 3.5, spacing = 30
    const aliveH = this.ghast.hearts, totalH = this.ghast.maxHearts
    const startX = -(totalH * spacing) / 2 + spacing / 2
    const oy = -bh/2 - 42

    for (let i = 0; i < totalH; i++) {
      const hx = startX + i * spacing
      const full = i < aliveH
      ctx.save()
      ctx.globalAlpha = full ? 1 : 0.25
      ctx.fillStyle = full ? '#ff3344' : '#333'
      if (full) { ctx.shadowColor = '#ff3344'; ctx.shadowBlur = 10 }
      const g = [[0,1,1,0,1,1,0],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[0,1,1,1,1,1,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0]]
      g.forEach((row, ri) => row.forEach((c, ci) => { if (c) ctx.fillRect(hx - 3.5*P + ci*P, oy - 3*P + ri*P, P, P) }))
      // Animate beat on full hearts
      if (full) {
        const scale = 1 + Math.sin(this.frame * 0.12 + i * 1.2) * 0.12
        ctx.save(); ctx.translate(hx, oy); ctx.scale(scale, scale); ctx.translate(-hx, -oy)
        g.forEach((row, ri) => row.forEach((c, ci) => { if (c) ctx.fillRect(hx - 3.5*P + ci*P, oy - 3*P + ri*P, P, P) }))
        ctx.restore()
      }
      ctx.restore()
    }
  }

  _drawFireball(ctx, fb) {
    ctx.save(); ctx.translate(fb.x, fb.y); ctx.rotate(fb.rot)
    const s = fb.size

    // Outer glow
    const og = ctx.createRadialGradient(0,0,0,0,0,s*2)
    og.addColorStop(0, 'rgba(255,200,0,0.55)'); og.addColorStop(0.5, 'rgba(255,80,0,0.25)'); og.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = og; ctx.fillRect(-s*2,-s*2,s*4,s*4)

    // Pixel blocks
    ;[[0,0,s,s,'#ff8800'],[-s*.55,-s*.3,s*.5,s*.5,'#ffcc00'],[s*.3,-s*.4,s*.45,s*.45,'#ff4400'],
      [-s*.3,s*.3,s*.4,s*.4,'#ff6600'],[s*.1,s*.1,s*.65,s*.65,'#ffaa00'],
      [-s*.5,s*.1,s*.4,s*.35,'#ff2200']].forEach(([px,py,pw,ph,clr]) => {
      ctx.fillStyle = clr; ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 6
      ctx.fillRect(px, py, pw, ph)
    })

    // Bright core
    ctx.fillStyle = '#fffaaa'; ctx.shadowColor = '#ffff00'; ctx.shadowBlur = 14
    ctx.fillRect(-s*.22,-s*.22,s*.44,s*.44)
    ctx.restore()
  }

  _drawTrident(ctx, t) {
    ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.rot)
    const P = 6

    // Glow
    const tG = ctx.createRadialGradient(0,0,0,0,0,P*5)
    tG.addColorStop(0,'rgba(80,220,210,0.45)'); tG.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle = tG; ctx.fillRect(-P*5,-P*5,P*10,P*10)

    // Shaft
    ctx.fillStyle = '#3abcb0'; ctx.fillRect(-P/2, P*1.5, P, P*8)
    ctx.fillStyle = '#1e8a80'; ctx.fillRect(P/2, P*1.5, P*0.5, P*8)

    // 3 prongs
    ;[[-P*1.5,0],[0,P*1.2],[P*1.5,0]].forEach(([px, extra]) => {
      const plen = P*3.2 + extra
      ctx.fillStyle = '#5de0d4'; ctx.fillRect(px-P/2, -plen, P, plen + P*1.5)
      ctx.fillStyle = '#3abcb0'; ctx.fillRect(px, -plen, P/2, plen + P*1.5)
      ctx.fillStyle = '#aaf5f0'; ctx.fillRect(px-P/2, -plen-P*.6, P, P*.6)
    })
    ctx.restore()
  }

  _drawPlayer(ctx) {
    const p = this.player
    // Invincibility blink
    if (p.invincible && Math.floor(this.frame / 5) % 2 === 0) return

    // Running bob — vertical oscillation when moving
    const bob = this.isMoving ? Math.sin(this.runPhase * 2) * 3.5 : 0
    // Entry scale when entering portal
    const entryScale = this.playerEntering ? this.playerEnterScale : 1
    // Full body tilt when running
    const bodyTilt = this.isMoving ? Math.sin(this.runPhase) * 0.15 * this.playerFacing : 0

    // Advance sprite walk frame
    this.spriteFrameTick++
    const rate = this.isMoving ? this.spriteFrameRate : 20  // slower idle rate
    if (this.spriteFrameTick >= rate) {
      this.spriteFrameTick = 0
      this.spriteFrameIdx = (this.spriteFrameIdx + 1) % this.SPRITE_FRAMES
    }

    ctx.save()
    ctx.translate(p.x, p.y + bob)
    ctx.scale(entryScale, entryScale)
    
    // Shadow
    const shadowR = 44 * entryScale
    const shG = ctx.createRadialGradient(0, 42, 2, 0, 42, shadowR)
    shG.addColorStop(0,'rgba(0,0,0,0.55)'); shG.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle = shG; ctx.fillRect(-shadowR, 20, shadowR*2, 32)

    ctx.rotate(bodyTilt)

    // Flip sprite when facing left
    if (this.playerFacing === -1) {
      ctx.scale(-1, 1)
    }

    // Draw character sprite (one frame from sprite sheet)
    if (this.playerImg.complete && this.playerImg.naturalWidth) {
      const fw = this.SPRITE_FRAME_W  // source frame width (516px)
      const fh = this.SPRITE_H        // source frame height (512px)
      const sx = this.spriteFrameIdx * fw  // source X
      const dw = p.w + 20  // display width (a bit wider for character)
      const dh = p.h + 10  // display height
      ctx.drawImage(
        this.playerImg,
        sx, 0, fw, fh,         // source: one frame
        -dw/2, -dh, dw, dh    // dest: centered on player position
      )
    } else {
      // Fallback block
      const clr = this.skinKey === 'red' ? '#cc2244' : this.skinKey === 'frog' ? '#55cc33' : '#ff85b3'
      ctx.fillStyle = clr
      ctx.fillRect(-22, -72, 44, 72)
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(-22, -72, 44, 72)
    }

    // Holding trident indicator
    if (this.throwCooldown === 0 && !this.playerEntering) {
      ctx.fillStyle = 'rgba(90,220,210,0.8)'
      ctx.shadowColor = '#5de0d4'; ctx.shadowBlur = 12
      ctx.fillRect(p.w/2 + 2, -p.h + 10, 5, 35)
      ctx.shadowBlur = 0
    }

    ctx.restore()
  }

  // ── END PORTAL ──────────────────────────────────────────────
  _updatePortal() {
    this.portalTimer++
    const p = this.player

    if (this.portalState === 'appear') {
      // Portal materializes over ~90 frames
      this.portalScale = Math.min(1, this.portalScale + 0.018)
      if (this.portalTimer > 100) {
        this.portalState = 'idle'
        this.portalTimer = 0
      }
    }

    if (this.portalState === 'idle') {
      if (this.portalTimer > 60) {
        this.portalState = 'runTo'
        this.portalTimer = 0
        this.isMoving = true // force run anim
      }
    }

    if (this.portalState === 'runTo') {
      // Auto-run player toward portal
      this.runPhase += 0.3
      const dir = this.portalX > p.x ? 1 : -1
      this.playerFacing = dir
      p.x += dir * 6
      const dist = Math.abs(p.x - this.portalX)
      if (dist < 30) {
        this.portalState = 'enter'
        this.portalTimer = 0
        this.playerEntering = true
      }
    }

    if (this.portalState === 'enter') {
      // Shrink player into portal
      this.playerEnterScale = Math.max(0, this.playerEnterScale - 0.025)
      this.runPhase += 0.2
      if (this.playerEnterScale <= 0) {
        this.portalState = 'done'
        this.portalTimer = 0
      }
    }

    if (this.portalState === 'done' && this.portalTimer > 50) {
      const gameSec = document.getElementById('level1Game')
      if (gameSec) {
        gsap.to(gameSec, { opacity: 0, duration: 1.0, ease: 'power2.in', onComplete: () => {
          // Clear the Level 1 canvas
          this.running = false
          this.canvas.style.display = 'none'
          // Remove all HUD elements
          const hud = gameSec.querySelector('.game-hud')
          if (hud) hud.remove()
          const ui = gameSec.querySelector('.game-ui')
          if (ui) ui.remove()
          const ctrl = gameSec.querySelector('.mobile-controls')
          if (ctrl) ctrl.remove()
          // Start Level 2
          window._level2 = new Level2Game(gameSec, this.skinSrc)
          window._level2.start()
          gsap.fromTo(gameSec, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
        }})
      }
      this.showPortal = false
      this.running = false
    }
  }

  _drawEndPortal(ctx, W, H) {
    const px = this.portalX
    const py = this.portalY
    const sc = this.portalScale
    const t  = this.frame * 0.02

    const PW = 60, PH = 90    // portal width and height
    const FW = 20             // frame block size

    ctx.save()
    // Move up so the bottom of the portal rests on the ground
    ctx.translate(px, py - PH - FW/2 + 20)
    ctx.scale(sc, sc)

    // === 2D INNER VOID ===
    const voidG = ctx.createLinearGradient(0, -PH, 0, PH)
    voidG.addColorStop(0,   'rgba(50,0,120,0.95)')
    voidG.addColorStop(0.5, 'rgba(20,0,60,0.98)')
    voidG.addColorStop(1,   'rgba(5,0,20,1)')
    ctx.fillStyle = voidG
    ctx.fillRect(-PW, -PH, PW*2, PH*2)

    // === STARS in void ===
    ctx.save()
    ctx.beginPath(); ctx.rect(-PW, -PH, PW*2, PH*2); ctx.clip()
    for (let s = 0; s < 45; s++) {
      const sx = Math.cos(s * 2.5 + t * 0.4) * PW * 0.85
      const sy = Math.sin(s * 1.7 + t * 0.3) * PH * 0.85
      const sr = 0.8 + Math.sin(s * 3.1 + t * 2) * 0.8
      const bright = 0.5 + Math.sin(s * 1.3 + t * 1.5) * 0.5
      ctx.fillStyle = s % 4 === 0
        ? `rgba(180,120,255,${bright})`
        : `rgba(255,255,255,${bright * 0.8})`
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill()
    }
    
    // Shimmer effect
    const shimG = ctx.createRadialGradient(0, 0, 0, 0, 0, PW * 1.5)
    shimG.addColorStop(0, `rgba(140,60,255,${0.25 + Math.sin(t*3)*0.15})`)
    shimG.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = shimG; ctx.fillRect(-PW, -PH, PW*2, PH*2)
    ctx.restore()

    // === 2D FRAME BLOCKS ===
    const framePositions = []
    // Top & Bottom rows (including corners)
    for (let x = -PW - FW/2; x <= PW + FW/2 + 1; x += FW) {
      framePositions.push({ x, y: -PH - FW/2 })
      framePositions.push({ x, y:  PH + FW/2 })
    }
    // Left & Right columns
    for (let y = -PH + FW/2; y <= PH - FW/2 + 1; y += FW) {
      framePositions.push({ x: -PW - FW/2, y })
      framePositions.push({ x:  PW + FW/2, y })
    }

    framePositions.forEach(fp => {
      const bx = fp.x - FW/2, by = fp.y - FW/2
      
      // Base endstone block
      ctx.fillStyle = '#b5c97e'
      ctx.fillRect(bx, by, FW, FW)
      
      // Pixel texture details
      ctx.fillStyle = '#8fa35a'
      ctx.fillRect(bx + FW*0.2, by + FW*0.2, FW*0.6, FW*0.6)
      ctx.fillStyle = '#dbf09e'
      ctx.fillRect(bx, by, FW, FW*0.15)
      
      // Border
      ctx.strokeStyle = '#3a4a1a'; ctx.lineWidth = 1.5
      ctx.strokeRect(bx, by, FW, FW)

      // Eye of Ender (glow on top of blocks)
      const ex = fp.x, ey = fp.y
      ctx.save()
      const eyeG = ctx.createRadialGradient(ex, ey, 0, ex, ey, FW * 0.45)
      eyeG.addColorStop(0, '#00ffcc')
      eyeG.addColorStop(0.3, '#00cc99')
      eyeG.addColorStop(1, 'rgba(0,80,60,0)')
      ctx.fillStyle = eyeG
      ctx.shadowColor = '#00ffcc'; ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(ex, ey, FW * 0.4, 0, Math.PI*2); ctx.fill()
      
      // Eye pupil
      ctx.fillStyle = '#003322'
      ctx.beginPath(); ctx.arc(ex, ey, FW * 0.15, 0, Math.PI*2); ctx.fill()
      ctx.restore()
    })

    // === OVERALL GLOW ===
    const glowG = ctx.createRadialGradient(0, 0, PW * 0.5, 0, 0, PH * 1.4)
    glowG.addColorStop(0, `rgba(120,0,255,${0.2 + Math.sin(t*2)*0.08})`)
    glowG.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = glowG; ctx.fillRect(-PW*2, -PH*2, PW*4, PH*4)

    ctx.restore()
  }

  _updateHUD() {
    const ph = document.getElementById('playerHearts')
    const gh = document.getElementById('ghastHearts')
    if (ph) {
      ph.innerHTML = ''
      for (let i = 0; i < this.player.maxHearts; i++) {
        const s = document.createElement('span')
        s.className = 'hud-heart' + (i < this.player.hearts ? '' : ' empty')
        s.textContent = i < this.player.hearts ? '❤' : '♡'
        ph.appendChild(s)
      }
    }
    if (gh) {
      gh.innerHTML = ''
      for (let i = 0; i < this.ghast.maxHearts; i++) {
        const s = document.createElement('span')
        s.className = 'hud-heart' + (i < this.ghast.hearts ? '' : ' empty')
        s.textContent = i < this.ghast.hearts ? '❤' : '♡'
        gh.appendChild(s)
      }
    }
  }

  _drawVictory(ctx, W, H) {
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0,0,W,H)

    // Golden glow behind text
    const g = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,260)
    g.addColorStop(0,'rgba(255,200,0,0.2)'); g.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H)

    ctx.textAlign = 'center'; ctx.font = `bold 3.5rem 'Minecrafter', monospace`
    ctx.fillStyle = '#ffcc00'; ctx.shadowColor = '#ffcc00'; ctx.shadowBlur = 40
    ctx.fillText('GHAST DEFEATED!', W/2, H/2 - 50)

    ctx.font = `bold 1.4rem 'Minecrafter', monospace`
    ctx.fillStyle = '#ff85b3'; ctx.shadowColor = '#ff85b3'; ctx.shadowBlur = 20
    ctx.fillText('YOU WIN, SHONA! 💖', W/2, H/2 + 10)

    ctx.font = `0.8rem 'Minecrafter', monospace`
    ctx.fillStyle = '#e8c97e'; ctx.shadowBlur = 10
    ctx.fillText('✦ ENCHANTED BOOK OBTAINED ✦', W/2, H/2 + 55)
    ctx.restore()
  }

  _drawGameOver(ctx, W, H) {
    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0,0,W,H)

    ctx.textAlign = 'center'; ctx.font = `bold 4rem 'Minecrafter', monospace`
    ctx.fillStyle = '#ff3333'; ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 35
    ctx.fillText('YOU DIED', W/2, H/2 - 30)

    ctx.font = `0.9rem 'Minecrafter', monospace`
    ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.shadowBlur = 5
    ctx.fillText('Click or tap to try again', W/2, H/2 + 28)
    ctx.restore()

    this.canvas.onclick = () => { this._restart(); this.canvas.onclick = null }
  }

  _restart() {
    this.player.hearts = 3; this.player.invincible = false
    this.ghast.hearts = 3; this.ghast.hit = false; this.ghast.dead = false; this.ghast.deadTimer = 0
    this.ghast.shootTimer = 0; this.ghast.x = this.W/2; this.ghast.y = 170
    this.fireballs = []; this.tridents = []; this.particles = []
    this.gameOver = false; this.victory = false; this.frame = 0
    this._updateHUD()
  }
}

// ═══════════════════════════════════════════════════════════
function initLoader() {
  const loader = document.getElementById('loader')
  const app    = document.getElementById('app')
  setTimeout(() => {
    loader.classList.add('hidden')
    if (app) app.classList.add('visible')
    // Play background music if enabled
    const bgm = document.getElementById('ambientMusic');
    if (bgm && !window.musicMuted) {
      bgm.play().catch(e => console.log('Audio autoplay blocked', e));
    }
  }, 500)
}

// ═══════════════════════════════════════════════════════════
//  TORCH HINT FADE
// ═══════════════════════════════════════════════════════════
function initTorchHint() {
  const hint = document.getElementById('torchHint')
  if (!hint) return
  // Auto-hide after first mouse move or touch
  const hideHint = () => {
    gsap.to(hint, { opacity: 0, duration: 1, delay: 0.5, onComplete: () => hint.remove() })
    window.removeEventListener('mousemove', hideHint)
    window.removeEventListener('touchstart', hideHint)
  }
  window.addEventListener('mousemove', hideHint, { once: true })
  window.addEventListener('touchstart', hideHint, { once: true })
}

// ═══════════════════════════════════════════════════════════
//  MUSIC INITIALIZATION
// ═══════════════════════════════════════════════════════════
function initMusic() {
  const ambient = document.getElementById('ambientMusic')
  const battle = document.getElementById('battleMusic')
  const finalM = document.getElementById('finalMusic')
  const btn = document.getElementById('musicToggleBtn')
  const icon = document.getElementById('musicBtnIcon')
  const label = document.getElementById('musicBtnLabel')
  
  if (ambient) ambient.volume = 0.4
  if (battle) battle.volume = 0.4
  if (finalM) finalM.volume = 0.6
  
  let hasStarted = false
  window.isMusicMuted = false
  window.currentMusic = 'ambient' // 'ambient', 'battle', or 'final'
  
  window.playMusicTrack = (track) => {
    window.currentMusic = track;
    if (window.isMusicMuted) return;
    
    if (track === 'ambient') {
      if (battle) battle.pause();
      if (finalM) finalM.pause();
      if (ambient) ambient.play().catch(() => {});
    } else if (track === 'battle') {
      if (ambient) ambient.pause();
      if (finalM) finalM.pause();
      if (battle) battle.play().catch(() => {});
    } else if (track === 'final') {
      if (ambient) ambient.pause();
      if (battle) battle.pause();
      if (finalM) finalM.play().catch(() => {});
    }
  }

  const playMusic = () => {
    if (hasStarted) return
    hasStarted = true
    if (!window.isMusicMuted) window.playMusicTrack(window.currentMusic)
    document.removeEventListener('click', playMusic)
    document.removeEventListener('touchstart', playMusic)
    document.removeEventListener('keydown', playMusic)
  }
  
  document.addEventListener('click', playMusic)
  document.addEventListener('touchstart', playMusic)
  document.addEventListener('keydown', playMusic)
  
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      hasStarted = true
      window.isMusicMuted = !window.isMusicMuted
      
      if (window.isMusicMuted) {
        if (ambient) ambient.pause()
        if (battle) battle.pause()
        if (finalM) finalM.pause()
        btn.classList.add('torch-off')
        if (label) label.textContent = 'MUSIC OFF'
        if (icon) icon.textContent = '🔇'
      } else {
        window.playMusicTrack(window.currentMusic)
        btn.classList.remove('torch-off')
        if (label) label.textContent = 'MUSIC ON'
        if (icon) icon.textContent = '🔊'
      }
      
      gsap.fromTo(btn,
        { scale: 0.88 },
        { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }
      )
    })
  }
}

// ═══════════════════════════════════════════════════════════
//  TORCH TOGGLE — ON / OFF button (top-left)
// ═══════════════════════════════════════════════════════════
function initTorchToggle() {
  const btn   = document.getElementById('torchToggleBtn')
  const label = document.getElementById('torchBtnLabel')
  if (!btn) return

  let torchOn = true

  btn.addEventListener('click', () => {
    torchOn = !torchOn

    if (torchOn) {
      // Turn torch ON
      btn.classList.remove('torch-off')
      label.textContent = 'TORCH ON'

      // Show torch canvas
      if (window.torch) {
        window.torch.canvas.style.display = 'block'
      }
      // Hide normal cursor again
      document.body.style.cursor = 'none'

    } else {
      // Turn torch OFF
      btn.classList.add('torch-off')
      label.textContent = 'TORCH OFF'

      // Hide torch canvas (darkness + torch drawing)
      if (window.torch) {
        window.torch.canvas.style.display = 'none'
      }
      // Restore cursor so user can navigate normally
      document.body.style.cursor = 'auto'
    }

    // Little bounce animation on the button
    gsap.fromTo(btn,
      { scale: 0.88 },
      { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }
    )
  })
}

// Initialization merged into the first DOMContentLoaded block.

// Removed image processing helper as requested

// ═══════════════════════════════════════════════════════════════════════
//  LEVEL 2 — END CITY TOWER CLIMB
// ═══════════════════════════════════════════════════════════════════════
class Level2Game {
  constructor(container, skinSrc) {
    this.container = container
    this.skinSrc   = skinSrc

    this.playerImg = new Image()
    this.playerImg.src = skinSrc

    this.canvas = document.createElement('canvas')
    this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:5'
    container.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')

    this.frame       = 0
    this.running     = false
    this.gameOver    = false
    this.victory     = false
    this.screenShake = 0
    this.keys        = {}

    this.WORLD_H   = 2800
    this.cameraY   = 0
    this.camTarget = 0

    this.player      = null
    this.platforms   = []
    this.enemies     = []
    this.projectiles = []
    this.particles   = []

    this.resize()
    window.addEventListener('resize', () => this.resize())
    this._setupInput()
    this.initWorld()
    this.initHUD()
  }

  resize() {
    this.W = this.canvas.width  = window.innerWidth
    this.H = this.canvas.height = window.innerHeight
  }

  _setupInput() {
    window.addEventListener('keydown', e => { this.keys[e.code] = true  })
    window.addEventListener('keyup',   e => { this.keys[e.code] = false })
    this.canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      const tx = e.touches[0].clientX
      if (tx < this.W/2 - 50)      this.keys['ArrowLeft']  = true
      else if (tx > this.W/2 + 50) this.keys['ArrowRight'] = true
      else                         this.keys['Space'] = true
    }, { passive: false })
    this.canvas.addEventListener('touchend', () => {
      this.keys['ArrowLeft'] = this.keys['ArrowRight'] = this.keys['Space'] = false
    })
  }

  initWorld() {
    const cx    = (this.W || 800) / 2
    const GROUND = this.WORLD_H - 120
    this.GROUND  = GROUND
    this.cx      = cx

    const FLOOR_Y = [
      GROUND,
      GROUND - 180,
      GROUND - 360,
      GROUND - 540
    ]
    this.FLOOR_Y = FLOOR_Y

    const TW = [340, 312, 288, 264]

    this.platforms = FLOOR_Y.map((y, i) => ({
      x: cx - TW[i]/2, y, w: TW[i], h: 22,
      type: i === 0 ? 'endstone' : 'purpur',
      isTop: i === 3
    }))

    ;[
      { x: cx + TW[1]/2 + 4,   y: FLOOR_Y[1] - 90, w: 110, h: 18 },
      { x: cx - TW[2]/2 - 114, y: FLOOR_Y[2] - 90, w: 110, h: 18 },
      { x: cx + TW[3]/2 + 4,   y: FLOOR_Y[3] - 90, w: 110, h: 18 },
    ].forEach(l => this.platforms.push({ ...l, type: 'purpur', isLedge: true }))

    this.player = {
      x: cx, y: GROUND - 5,
      w: 42, h: 68,
      vx: 0, vy: 0,
      speed: 5.5, jumpPower: -17,
      onGround: false,
      hearts: 3, maxHearts: 3,
      invincible: false, invTimer: 0,
      facing: 1, runPhase: 0, isMoving: false,
      entering: true, enterTimer: 70, swordSwing: 0
    }

    this.enemies = [
      { type:'shulker',  x:cx+70,  y:FLOOR_Y[1]-32, hp:1, maxHp:1, openTimer:0, openAmount:0, phase:0,   state:'closed', justShot:false, projCol:'#cc88ff' },
      { type:'enderman', x:cx-40,  y:FLOOR_Y[2]-85, hp:1, maxHp:1, vx:2.2, chargePhase:0,
        minX:cx-TW[2]/2+10, maxX:cx+TW[2]/2-30 },
      { type:'shulker',  x:cx+75,  y:FLOOR_Y[3]-32, hp:1, maxHp:1, openTimer:0, openAmount:0, phase:80,  state:'closed', justShot:false, projCol:'#ff55cc' },
    ]

    this.cameraY   = GROUND - this.H * 0.75
    this.camTarget = this.cameraY
  }

  initHUD() {
    const hud = document.createElement('div')
    hud.className = 'game-hud'; hud.id = 'lvl2hud'
    hud.innerHTML = `
      <div class="hud-top">
        <div class="hud-block">
          <div class="hud-label">HERO</div>
          <div class="hud-hearts" id="l2PlayerHearts"></div>
        </div>
        <div class="hud-center-block">
          <div class="hud-label" style="color:var(--color-gold)">END CITY — CLIMB TO THE TOP</div>
          <div style="font-family:var(--font-pixel);font-size:.5rem;color:rgba(255,255,255,.45);letter-spacing:.1em;margin-top:4px">FLOOR <span id="l2Floor">1</span> / 3</div>
        </div>
        <div class="hud-tip" style="font-family:var(--font-pixel);font-size:.4rem;color:rgba(242,167,195,.7);letter-spacing:.08em">SPACE = JUMP</div>
      </div>`
    this.container.appendChild(hud)
    this._updateHUD()
  }

  start() { this.running = true; this._raf = requestAnimationFrame(() => this._loop()) }
  stop()  { this.running = false; if (this._raf) cancelAnimationFrame(this._raf) }
  _loop() { if (!this.running) return; this._update(); this._draw(); this._raf = requestAnimationFrame(() => this._loop()) }

  // ── UPDATE ──────────────────────────────────────────────────
  _update() {
    this.frame++
    if (this.gameOver || this.victory) return
    const p = this.player

    if (p.swordSwing > 0) p.swordSwing--
    if (p.entering) { p.enterTimer--; if (p.enterTimer <= 0) p.entering = false; return }

    const mL = this.keys['ArrowLeft']  || this.keys['KeyA']
    const mR = this.keys['ArrowRight'] || this.keys['KeyD']
    if (mL) { p.vx = -p.speed; p.facing = -1 }
    else if (mR) { p.vx =  p.speed; p.facing =  1 }
    else p.vx *= 0.75
    p.isMoving = !!(mL || mR)
    if (p.isMoving) p.runPhase += 0.26
    else p.runPhase *= 0.82

    if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']) && p.onGround) {
      p.vy = p.jumpPower; p.onGround = false
      this._spawnParticles(p.x, p.y, '#9060c8', 6)
    }

    p.vy += 0.7; p.x += p.vx; p.y += p.vy
    p.x = Math.max(p.w/2, Math.min(this.W - p.w/2, p.x))

    p.onGround = false
    this.platforms.forEach(pl => {
      if (p.vy >= 0 && p.x + p.w/2 - 6 > pl.x && p.x - p.w/2 + 6 < pl.x + pl.w &&
          p.y > pl.y - 10 && p.y <= pl.y + pl.h) {
        p.y = pl.y; p.vy = 0; p.onGround = true
      }
    })

    // Door collision (door is on top floor, at center)
    if (!this.victory && p.onGround && p.y <= this.FLOOR_Y[3] && Math.abs(p.x - this.cx) < 25) {
      this._triggerVictory()
    }

    if (p.y > this.GROUND + 300) {
      p.hearts--; this._updateHUD()
      if (p.hearts <= 0) { this.gameOver = true; this._showGameOverOverlay(); return }
      p.x = this.cx; p.y = this.GROUND - 5; p.vy = 0; p.vx = 0
      p.invincible = true; p.invTimer = 120
    }
    if (p.invincible) { p.invTimer--; if (p.invTimer <= 0) p.invincible = false }

    const DZONE = this.H * 0.38
    const screenY = p.y - this.cameraY
    if (screenY < DZONE)       this.camTarget = p.y - DZONE
    if (screenY > this.H*0.72) this.camTarget = p.y - this.H * 0.72
    this.cameraY += (this.camTarget - this.cameraY) * 0.1
    this.cameraY = Math.max(0, Math.min(this.WORLD_H - this.H, this.cameraY))

    this._updateEnemies()
    this._updateProjectiles()
    this._updateParticles()
    this._updateHUD()
    if (this.screenShake > 0) this.screenShake -= 1.5
  }

  _updateEnemies() {
    const p = this.player
    this.enemies.forEach(e => {
      if (e.dead) return
      
      const ex = e.x, ey = e.y + (e.type === 'enderman' ? -35 : 0) // rough center Y
      const dx = Math.abs(p.x - ex), dy = Math.abs(p.y - 34 - ey)
      
      // Auto-kill logic: if player is near enemy and facing it (or very close), slash!
      if (dx < 70 && dy < 60 && Math.sign(ex - p.x) === p.facing) {
        e.dead = true
        p.swordSwing = 15
        this._spawnParticles(ex, ey, e.type === 'enderman' ? '#bb44ff' : '#ffccff', 20)
        return
      }

      if (e.type === 'enderman') {
        e.x += e.vx
        if (e.x < e.minX || e.x > e.maxX) e.vx *= -1
        const aggroDy = Math.abs(p.y - (e.y + 80)), aggroDx = Math.abs(p.x - e.x)
        if (aggroDy < 180 && aggroDx < 360) {
          e.chargePhase++
          if (e.chargePhase > 40) { e.vx = Math.sign(p.x - e.x) * 5.5; e.chargePhase = 0 }
        }
        if (!p.invincible && dx < 36 && dy < 60) {
          p.hearts--; p.invincible = true; p.invTimer = 90
          this.screenShake = 14; this._spawnParticles(p.x, p.y-30, '#ff3344', 12)
          this._updateHUD(); if (p.hearts <= 0) { this.gameOver = true; this._showGameOverOverlay() }
        }
      }
      if (e.type === 'shulker') {
        e.openTimer++
        const period = 160, t = (e.openTimer + e.phase) % period
        e.openAmount = t < period/2 ? t/(period/2) : 1-(t-period/2)/(period/2)
        if (e.openAmount > 0.92 && !e.justShot) {
          const dy = p.y - e.y, dx = p.x - e.x, len = Math.sqrt(dx*dx+dy*dy)||1
          this.projectiles.push({ x:e.x, y:e.y-16, vx:(dx/len)*3.8, vy:(dy/len)*3.8, r:7, col:e.projCol, life:220 })
          e.justShot = true
        }
        if (e.openAmount < 0.6) e.justShot = false
      }
    })
  }

  _updateProjectiles() {
    const p = this.player
    this.projectiles = this.projectiles.filter(pr => {
      pr.x += pr.vx; pr.y += pr.vy; pr.life--
      if (pr.x < pr.r || pr.x > this.W - pr.r) pr.vx *= -1
      const dx = Math.abs(p.x - pr.x), dy = Math.abs((p.y - p.h/2) - pr.y)
      if (!p.invincible && dx < 28 && dy < 34) {
        p.hearts--; p.invincible = true; p.invTimer = 80
        this.screenShake = 10; this._spawnParticles(pr.x, pr.y, pr.col, 8)
        this._updateHUD(); if (p.hearts <= 0) { this.gameOver = true; this._showGameOverOverlay() }
        return false
      }
      return pr.life > 0
    })
  }

  _updateParticles() {
    this.particles = this.particles.filter(pt => {
      pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.18; pt.life--; pt.alpha = pt.life / pt.maxLife
      return pt.life > 0
    })
  }

  _spawnParticles(x, y, col, n=8) {
    for (let i = 0; i < n; i++) {
      const ang = Math.random()*Math.PI*2, spd = 1.5+Math.random()*3
      this.particles.push({ x, y, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd-1.5, col, life:40+Math.random()*30|0, maxLife:70, alpha:1, r:2+Math.random()*3 })
    }
  }

  _triggerVictory() {
    this.victory = true
    this._spawnParticles(this.player.x, this.player.y-40, '#ffd700', 30)

    setTimeout(() => {
      this._showElytraRewardSlide()
    }, 1400)
  }

  _showElytraRewardSlide() {
    if (window.playMusicTrack) window.playMusicTrack('ambient');
    // Fade out canvas
    gsap.to(this.canvas, { opacity: 0, duration: 0.8 })
    const hud = this.container.querySelector('.l2-hud')
    if (hud) gsap.to(hud, { opacity: 0, duration: 0.5 })

    const slide = document.createElement('div')
    slide.id = 'elytraRewardSlide'
    slide.style.cssText = `
      position:absolute;inset:0;z-index:200;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:radial-gradient(ellipse at center, #0d0620 0%, #050210 60%, #000 100%);
      opacity:0;
    `

    // Falling stars canvas
    const starCvs = document.createElement('canvas')
    starCvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    slide.appendChild(starCvs)

    // Character with wings preview
    const charWrap = document.createElement('div')
    charWrap.style.cssText = 'position:relative;width:200px;height:220px;margin-bottom:2rem;'

    const wingCanvas = document.createElement('canvas')
    wingCanvas.width = 300; wingCanvas.height = 220
    wingCanvas.style.cssText = 'position:absolute;left:50%;top:0;transform:translateX(-50%);'
    charWrap.appendChild(wingCanvas)

    // Draw character + wings
    const drawCharWithWings = (phase) => {
      const wCtx = wingCanvas.getContext('2d')
      wCtx.clearRect(0, 0, 300, 220)
      const cx = 150, cy = 150
      const wingSpan = 90 + Math.sin(phase)*8
      const wingFlap = Math.sin(phase*2)*12

      // Glow behind wings
      const grd = wCtx.createRadialGradient(cx,cy,10,cx,cy,120)
      grd.addColorStop(0,'rgba(200,230,255,0.18)')
      grd.addColorStop(1,'rgba(200,230,255,0)')
      wCtx.fillStyle = grd; wCtx.fillRect(0,0,300,220)

      // Draw angel wings (white, feathery pixel art)
      const drawWing = (side) => {
        const sx = side // +1 for right, -1 for left
        wCtx.save()
        wCtx.translate(cx, cy - 30)
        wCtx.scale(sx, 1)

        // Wing shadow/glow
        wCtx.shadowColor = 'rgba(180,220,255,0.8)'
        wCtx.shadowBlur = 18

        // Primary feathers
        const feathers = [
          [10, -wingFlap,    wingSpan,     18, -30],
          [10, -wingFlap+5,  wingSpan*0.85,14, -15],
          [10, -wingFlap+10, wingSpan*0.65,12,   0],
          [10, -wingFlap+8,  wingSpan*0.45,10,  15],
          [10, -wingFlap+4,  wingSpan*0.25, 8,  28],
        ]
        feathers.forEach(([ox,oy,len,h,angle]) => {
          wCtx.save()
          wCtx.translate(ox, oy)
          wCtx.rotate(angle * Math.PI/180)
          // Feather gradient
          const fg = wCtx.createLinearGradient(0,0,len,0)
          fg.addColorStop(0, 'rgba(255,255,255,0.95)')
          fg.addColorStop(0.5, 'rgba(220,235,255,0.85)')
          fg.addColorStop(1, 'rgba(180,210,255,0.4)')
          wCtx.fillStyle = fg
          wCtx.beginPath()
          wCtx.ellipse(len/2, 0, len/2, h/2, 0, 0, Math.PI*2)
          wCtx.fill()
          // Feather vein
          wCtx.strokeStyle = 'rgba(255,255,255,0.3)'
          wCtx.lineWidth = 1
          wCtx.beginPath(); wCtx.moveTo(0,0); wCtx.lineTo(len,0)
          wCtx.stroke()
          wCtx.restore()
        })

        wCtx.shadowBlur = 0
        wCtx.restore()
      }

      drawWing(-1) // left wing
      drawWing(1)  // right wing

      // Draw character sprite
      if (this.playerImg.complete && this.playerImg.naturalWidth) {
        const totalFrames = 4
        const fw = this.playerImg.naturalWidth / totalFrames
        const fh = this.playerImg.naturalHeight
        const sx = Math.floor(animPhase * 5) % totalFrames * fw
        const dw = 48 + 16
        const dh = 70 + 8
        wCtx.save()
        wCtx.drawImage(this.playerImg, sx, 0, fw, fh, cx - dw/2, cy - dh + 2, dw, dh)
        wCtx.restore()
      } else {
        wCtx.fillStyle='#ff85b3'; wCtx.fillRect(cx-24, cy-68, 48, 70)
      }
    }

    let animPhase = 0
    let animId = null
    const animate = () => {
      animPhase += 0.04
      drawCharWithWings(animPhase)
      animId = requestAnimationFrame(animate)
    }
    animate()

    slide.appendChild(charWrap)

    slide.innerHTML += `
      <div style="text-align:center;padding:0 2rem;max-width:680px;">
        <div style="font-family:var(--font-pixel);font-size:clamp(0.6rem,2.5vw,0.9rem);
          letter-spacing:0.25em;color:#b8eaff;margin-bottom:1.2rem;
          text-shadow:0 0 20px rgba(150,220,255,0.8);">
          ✦ LEVEL 2 COMPLETE ✦
        </div>
        <h2 style="font-family:var(--font-display);font-size:clamp(1.6rem,4.5vw,3rem);
          color:#fff;line-height:1.3;margin-bottom:2rem;
          text-shadow:0 0 30px rgba(180,220,255,0.6), 3px 3px 0 rgba(0,0,0,0.8);">
          DO YOU WANNA FLY<br>ABOVE THE SKY<br>
          <span style="color:#b8eaff;">DARLING?</span> 🌙
        </h2>
        <div style="display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;">
          <button id="elytraYesBtn" style="
            font-family:var(--font-pixel);font-size:clamp(0.7rem,3vw,1rem);
            letter-spacing:0.15em;padding:16px 44px;
            background:linear-gradient(135deg,#0a2040,#0d3060);
            border:2px solid rgba(150,220,255,0.6);border-top-color:rgba(200,240,255,0.9);
            border-bottom:4px solid rgba(0,0,0,0.7);border-radius:4px;
            color:#b8eaff;text-shadow:0 0 12px rgba(150,220,255,0.8);
            cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,0.6),0 0 28px rgba(150,220,255,0.4);
            transition:transform 0.15s;">
            ✦ YES ✦
          </button>
          <button id="elytraNoBtn" style="
            font-family:var(--font-pixel);font-size:clamp(0.7rem,3vw,1rem);
            letter-spacing:0.15em;padding:16px 44px;
            background:linear-gradient(135deg,#1a0a20,#2a1030);
            border:2px solid rgba(242,167,195,0.4);border-top-color:rgba(242,167,195,0.7);
            border-bottom:4px solid rgba(0,0,0,0.7);border-radius:4px;
            color:rgba(255,255,255,0.5);cursor:pointer;
            box-shadow:0 8px 20px rgba(0,0,0,0.5);transition:transform 0.15s;">
            NO...
          </button>
        </div>
      </div>
    `
    // Re-attach character wrap (innerHTML nuked it)
    slide.insertBefore(charWrap, slide.querySelector('div:not(canvas)') || slide.children[1])

    this.container.appendChild(slide)
    gsap.to(slide, { opacity: 1, duration: 0.8 })

    // Stars animation
    const sCtx = starCvs.getContext('2d')
    const resizeStar = () => { starCvs.width = slide.offsetWidth; starCvs.height = slide.offsetHeight }
    resizeStar()
    const stars = Array.from({length:120}, () => ({
      x: Math.random()*starCvs.width, y: Math.random()*starCvs.height,
      r: Math.random()*1.5+0.3, v: Math.random()*0.4+0.1, twinkle: Math.random()*Math.PI*2
    }))
    const drawStars = () => {
      if (!slide.parentNode) return
      sCtx.clearRect(0,0,starCvs.width,starCvs.height)
      stars.forEach(s => {
        s.twinkle += 0.04
        const a = 0.4 + Math.sin(s.twinkle)*0.4
        sCtx.beginPath(); sCtx.arc(s.x,s.y,s.r,0,Math.PI*2)
        sCtx.fillStyle=`rgba(200,230,255,${a})`; sCtx.fill()
      })
      requestAnimationFrame(drawStars)
    }
    drawStars()

    // Button hover effects
    const yesBtn = document.getElementById('elytraYesBtn')
    const noBtn  = document.getElementById('elytraNoBtn')
    yesBtn.onmouseover = () => { yesBtn.style.transform='translateY(-3px) scale(1.05)' }
    yesBtn.onmouseout  = () => { yesBtn.style.transform='' }
    noBtn.onmouseover  = () => { noBtn.style.transform='scale(0.97)'; noBtn.style.color='#fff' }
    noBtn.onmouseout   = () => { noBtn.style.transform=''; noBtn.style.color='' }

    yesBtn.addEventListener('click', () => {
      cancelAnimationFrame(animId)
      gsap.to(slide, { opacity: 0, scale: 0.9, duration: 0.6, onComplete: () => {
        slide.remove()
        this.hasElytra = true
        window.playerHasElytra = true
        gsap.set(this.canvas, { opacity: 1 })
        this._showElytraAttachAnimation()
      }})
    })

    noBtn.addEventListener('click', () => {
      // Shake the NO button as if teasing, then auto-proceed
      gsap.to(noBtn, { x: -8, duration: 0.08, repeat: 5, yoyo: true, onComplete: () => {
        gsap.set(noBtn, { x:0 })
        noBtn.style.opacity='0.3'; noBtn.style.pointerEvents='none'
        gsap.to(yesBtn, { boxShadow:'0 0 60px rgba(150,220,255,0.9)', scale: 1.08,
          duration:0.4, ease:'back.out(2)', yoyo:true, repeat:3 })
      }})
    })
  }

  _showElytraAttachAnimation() {
    this.hasElytra = true
    window.playerHasElytra = true

    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:absolute;inset:0;z-index:150;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:rgba(0,0,5,0.85);pointer-events:none;
    `
    this.container.appendChild(overlay)

    const txt = document.createElement('div')
    txt.style.cssText = `
      font-family:var(--font-pixel);font-size:clamp(0.9rem,3vw,1.3rem);
      letter-spacing:0.2em;color:#b8eaff;text-align:center;margin-top:1rem;
      text-shadow:0 0 30px rgba(150,220,255,0.9);opacity:0;
    `
    txt.textContent = '✦ ELYTRA EQUIPPED ✦'
    overlay.appendChild(txt)

    gsap.to(overlay, { opacity: 1, duration: 0.5 })
    gsap.to(txt, { opacity: 1, duration: 0.6, delay: 0.5 })

    // Just wait a moment and fade out without flashing
    gsap.to(overlay, { opacity:0, duration:0.8, delay:2.0, onComplete: () => {
      overlay.remove()
      setTimeout(() => this._showHalfHeartSlide(), 400)
    }})
  }

  _showHalfHeartSlide() {
    gsap.to(this.canvas, { opacity: 0, duration: 0.6 })
    const hud = this.container.querySelector('.l2-hud')
    if (hud) gsap.to(hud, { opacity: 0, duration: 0.3 })

    const slide = document.createElement('div')
    slide.id = 'halfHeartSlide'
    slide.style.cssText = `
      position:absolute;inset:0;z-index:200;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:radial-gradient(ellipse at 50% 40%, #1a0520 0%, #080010 50%, #000 100%);
      opacity:0;overflow:hidden;
    `

    // Floating particles
    const pCvs = document.createElement('canvas')
    pCvs.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    slide.appendChild(pCvs)

    slide.insertAdjacentHTML('beforeend', `
      <div style="text-align:center;padding:2rem;max-width:720px;position:relative;z-index:2;">

        <div style="font-family:var(--font-pixel);font-size:clamp(0.55rem,2vw,0.8rem);
          letter-spacing:0.3em;color:var(--color-primary);margin-bottom:1.5rem;
          text-shadow:0 0 20px rgba(242,167,195,0.8);">
          ✦ REWARD UNLOCKED ✦
        </div>

        <!-- Right Heart Piece (matches Level 1 pixel style, mirrored) -->
        <div id="halfHeartAnim" style="margin-bottom:2rem;transform:scale(1);">
          <div style="
            display:inline-block;
            filter:drop-shadow(0 0 18px rgba(220,0,0,0.9)) drop-shadow(0 0 6px rgba(255,60,60,0.6));
          ">
            <div style="display:grid;grid-template-columns:repeat(4,18px);gap:1px;">
              <div style="width:18px;height:18px;background:#ff4455;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#220000;image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>

              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#ff4455;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#ff4455;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#220000;image-rendering:pixelated;"></div>

              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#ff4455;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#ff4455;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#220000;image-rendering:pixelated;"></div>

              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#220000;image-rendering:pixelated;"></div>

              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#220000;image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>

              <div style="width:18px;height:18px;background:#cc0000;box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:#220000;image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>

              <div style="width:18px;height:18px;background:#220000;image-rendering:pixelated;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>

              <div style="width:18px;height:18px;background:transparent;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>
              <div style="width:18px;height:18px;background:transparent;"></div>
            </div>
          </div>
          <div style="font-family:var(--font-pixel);font-size:clamp(0.5rem,1.8vw,0.75rem);
            letter-spacing:0.15em;color:rgba(255,80,80,0.9);margin-top:0.5rem;
            text-shadow:0 0 10px rgba(255,60,60,0.7);">
            ❤ RIGHT HEART PIECE
          </div>
        </div>

        <h2 style="font-family:var(--font-display);font-size:clamp(1.4rem,3.5vw,2.5rem);
          color:#fff;line-height:1.4;margin-bottom:1.5rem;
          text-shadow:0 0 30px rgba(242,167,195,0.5), 3px 3px 0 rgba(0,0,0,0.8);"
          id="halfHeartTitle">
          YOU'RE INCREDIBLE,<br>
          <span style="color:var(--color-primary);">MY SHONA</span> 💫
        </h2>

        <div style="font-family:var(--font-pixel);font-size:clamp(0.75rem,2vw,1rem);
          color:rgba(255,255,255,0.75);line-height:1.9;letter-spacing:0.06em;
          text-shadow:2px 2px 0 rgba(0,0,0,0.8);max-width:560px;margin:0 auto 2rem;"
          id="halfHeartDesc">
          YOU DID REALY GREAT JOB FINNY YOU HAVHE REACHED THE FINAL BOSS NOW YOU HAVE TO KILL THE DRAGON FOR THE SPELL TO JOIN THE HEART, ALL THE BEST BACHA
        </div>

        <button id="halfHeartContinueBtn" style="
          font-family:var(--font-pixel);font-size:clamp(0.65rem,2.5vw,0.9rem);
          letter-spacing:0.18em;padding:14px 40px;
          background:linear-gradient(135deg,#1a0035,#2a005a);
          border:2px solid rgba(242,167,195,.55);border-top-color:rgba(242,167,195,.85);
          border-bottom:4px solid rgba(0,0,0,.6);border-radius:4px;
          color:var(--color-primary);text-shadow:0 0 12px rgba(242,167,195,.8);
          cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.6),0 0 28px rgba(242,167,195,.35);">
          FINAL LVL ➜
        </button>
      </div>
    `)
    this.container.appendChild(slide)
    gsap.to(slide, { opacity: 1, duration: 0.9 })

    // Floating hearts particles
    const pCtx = pCvs.getContext('2d')
    pCvs.width = window.innerWidth; pCvs.height = window.innerHeight
    const hearts = Array.from({length:25}, () => ({
      x: Math.random()*pCvs.width, y: pCvs.height + 20,
      s: Math.random()*22+8, v: Math.random()*1.2+0.4,
      drift: (Math.random()-0.5)*0.8, alpha: Math.random()*0.5+0.3,
      twinkle: Math.random()*Math.PI*2
    }))
    const animHearts = () => {
      if (!slide.parentNode) return
      pCtx.clearRect(0,0,pCvs.width,pCvs.height)
      hearts.forEach(h => {
        h.y -= h.v; h.x += h.drift; h.twinkle += 0.03
        if (h.y < -30) { h.y = pCvs.height+20; h.x = Math.random()*pCvs.width }
        const a = h.alpha * (0.7+Math.sin(h.twinkle)*0.3)
        pCtx.font = `${h.s}px serif`
        pCtx.globalAlpha = a
        pCtx.fillText('💕', h.x, h.y)
      })
      pCtx.globalAlpha = 1
      requestAnimationFrame(animHearts)
    }
    animHearts()

    // Staggered reveal using gsap.from
    const heartEl = slide.querySelector('#halfHeartAnim')
    if (heartEl) gsap.from(heartEl, { opacity:0, scale:0.5, duration:0.8, ease:'back.out(1.5)', delay: 0.6 })
    
    const titleEl = slide.querySelector('#halfHeartTitle')
    if (titleEl) gsap.from(titleEl, { opacity:0, y:-20, duration:0.7, delay: 1.2 })
    
    const descEl = slide.querySelector('#halfHeartDesc')
    if (descEl) gsap.from(descEl, { opacity:0, duration:0.7, delay: 1.7 })
    
    const btn = slide.querySelector('#halfHeartContinueBtn')
    if (btn) {
      gsap.from(btn, { opacity:0, duration:0.5, delay: 2.2 })
      btn.addEventListener('click', () => {
        gsap.to(slide, { opacity:0, duration:0.6, onComplete: () => {
          slide.remove()
          // Launch the Final Dragon Boss Level!
          const lvl3Container = document.createElement('div')
          lvl3Container.id = 'level3Container'
          lvl3Container.style.cssText = 'position:fixed;inset:0;z-index:200;background:#000;'
          document.body.appendChild(lvl3Container)
          new Level3DragonGame(lvl3Container, this.skinSrc)
        }})
      })
    }
  }


  _showGameOverOverlay() {
    // Remove any existing overlay
    const old = document.getElementById('l2gameOverOverlay')
    if (old) old.remove()

    const overlay = document.createElement('div')
    overlay.id = 'l2gameOverOverlay'
    overlay.style.cssText = `
      position:absolute;inset:0;z-index:80;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.78);backdrop-filter:blur(4px);
    `
    overlay.innerHTML = `
      <div style="text-align:center;">
        <div style="font-family:var(--font-pixel);font-size:clamp(.7rem,4vw,1.1rem);letter-spacing:.25em;color:#ff3344;text-shadow:0 0 30px rgba(255,51,68,.8);margin-bottom:1rem;">YOU FELL...</div>
        <div style="font-family:var(--font-pixel);font-size:clamp(.45rem,2.5vw,.65rem);letter-spacing:.12em;color:rgba(255,255,255,.55);margin-bottom:2.4rem;">don't give up, try again!</div>
        <button id="l2retryBtn" style="
          font-family:var(--font-pixel);font-size:clamp(.5rem,3vw,.72rem);
          letter-spacing:.18em;padding:14px 36px;
          background:linear-gradient(135deg,#1a0035,#2a005a);
          border:2px solid rgba(242,167,195,.55);border-top-color:rgba(242,167,195,.85);
          border-bottom:4px solid rgba(0,0,0,.6);border-radius:4px;
          color:var(--color-primary);text-shadow:0 0 12px rgba(242,167,195,.8);
          cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.6),0 0 28px rgba(242,167,195,.35);
        ">↺ TRY AGAIN</button>
      </div>
    `
    this.container.appendChild(overlay)

    // Animate in
    gsap.fromTo(overlay.querySelector('div'), { opacity:0, y:30, scale:0.9 }, { opacity:1, y:0, scale:1, duration:0.5, ease:'back.out(1.4)' })
    gsap.fromTo('#l2retryBtn', { opacity:0 }, { opacity:1, duration:0.4, delay:0.25 })

    document.getElementById('l2retryBtn')?.addEventListener('click', () => {
      gsap.to(overlay, { opacity:0, duration:0.35, onComplete: () => {
        overlay.remove()
        this._restart()
      }})
    })
  }

  _restart() {
    // Reset all game state without rebuilding the DOM
    this.frame       = 0
    this.gameOver    = false
    this.victory     = false
    this.screenShake = 0
    this.projectiles = []
    this.particles   = []
    this.keys        = {}

    // Re-init world (resets player, enemies, platforms)
    this.initWorld()
    this._updateHUD()
  }

  // Removed Elytra Room completely as requested

  _buildBothHalves() {
    const P = 16
    const L = [[0,1,2,3],[1,3,3,2],[1,3,3,2],[1,2,2,2],[0,1,2,2],[0,0,1,2],[0,0,0,1],[0,0,0,0]]
    const R = [[3,2,1,0],[2,3,3,1],[2,3,3,1],[2,2,2,1],[2,2,1,0],[2,1,0,0],[1,0,0,0],[0,0,0,0]]
    const clr = { 0:'transparent', 1:'#220000', 2:'#cc0000', 3:'#ff4455' }
    const half = g => {
      let h = `<div style="display:grid;grid-template-columns:repeat(4,${P}px);gap:1px;">`
      g.forEach(row => row.forEach(v => {
        const s = v>1 ? `box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,.5);` : ''
        h += `<div style="width:${P}px;height:${P}px;background:${clr[v]};${s}image-rendering:pixelated;"></div>`
      }))
      return h + '</div>'
    }
    return half(L) + half(R)
  }

  _updateHUD() {
    const ph = document.getElementById('l2PlayerHearts')
    if (ph) {
      ph.innerHTML = ''
      for (let i = 0; i < this.player.maxHearts; i++) {
        const s = document.createElement('span')
        s.className = 'hud-heart' + (i < this.player.hearts ? '' : ' empty')
        s.textContent = i < this.player.hearts ? '❤' : '♡'
        ph.appendChild(s)
      }
    }
    const fl = document.getElementById('l2Floor')
    if (fl) {
      let f = 0
      for (let i = this.FLOOR_Y.length-1; i >= 0; i--) {
        if (this.player.y <= this.FLOOR_Y[i] + 60) { f = i; break }
      }
      fl.textContent = Math.max(1, f)
    }
  }

  // ── DRAW ────────────────────────────────────────────────────
  _draw() {
    const ctx = this.ctx, W = this.W, H = this.H, camY = this.cameraY
    let sx = 0, sy2 = 0
    if (this.screenShake > 0) { sx = (Math.random()-.5)*this.screenShake; sy2 = (Math.random()-.5)*this.screenShake }
    ctx.save(); ctx.translate(sx, sy2)

    this._drawEndSky(ctx, W, H)
    this._drawTower(ctx, W, camY)

    this.platforms.filter(p => p.isLedge).forEach(pl => {
      const sy = pl.y - camY
      if (sy < -40 || sy > H+40) return
      this._drawLedge(ctx, pl.x, sy, pl.w, pl.h)
    })

    this.particles.forEach(pt => {
      ctx.save(); ctx.globalAlpha = pt.alpha
      ctx.fillStyle = pt.col; ctx.shadowColor = pt.col; ctx.shadowBlur = 6
      ctx.beginPath(); ctx.arc(pt.x, pt.y - camY, pt.r, 0, Math.PI*2); ctx.fill()
      ctx.restore()
    })

    this.projectiles.forEach(pr => {
      const py = pr.y - camY
      if (py < -20 || py > H+20) return
      ctx.save()
      const g = ctx.createRadialGradient(pr.x, py, 0, pr.x, py, pr.r*2.5)
      g.addColorStop(0,'#fff'); g.addColorStop(0.3, pr.col); g.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle = g; ctx.shadowColor = pr.col; ctx.shadowBlur = 14
      ctx.beginPath(); ctx.arc(pr.x, py, pr.r, 0, Math.PI*2); ctx.fill()
      ctx.restore()
    })

    this.enemies.forEach(e => {
      if (e.dead) return
      const ey = e.y - camY
      if (ey < -200 || ey > H+200) return
      if (e.type === 'enderman') this._drawEnderman(ctx, e, ey)
      else                       this._drawShulker(ctx, e, ey)
    })

    this._drawPlayer(ctx, camY)

    ctx.restore()
  }

  _drawEndSky(ctx, W, H) {
    const t = this.frame * 0.008
    const bg = ctx.createLinearGradient(0,0,0,H)
    bg.addColorStop(0,'#050010'); bg.addColorStop(.5,'#0c0025'); bg.addColorStop(1,'#160038')
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H)

    for (let i = 0; i < 60; i++) {
      const px = ((i*137.5 + t*30) % W)
      const py = ((i*83.7  + t*20) % H)
      const br = 0.25 + Math.sin(i*1.3 + t*2) * 0.25
      const r  = 0.6 + Math.sin(i*2.7) * 0.4
      ctx.fillStyle = i%5===0 ? `rgba(200,140,255,${br})` : `rgba(255,255,255,${br*0.65})`
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI*2); ctx.fill()
    }
    const fog = ctx.createLinearGradient(0,H*.7,0,H)
    fog.addColorStop(0,'rgba(60,0,120,0)'); fog.addColorStop(1,'rgba(60,0,120,.35)')
    ctx.fillStyle = fog; ctx.fillRect(0,H*.7,W,H*.3)
  }

  _drawTower(ctx, W, camY) {
    const cx = this.cx, DEPTH = 26, t = this.frame * 0.015

    const sections = [
      { wy: this.GROUND - 180,  h: 180, tw: 340 },
      { wy: this.GROUND - 360,  h: 180, tw: 312 },
      { wy: this.GROUND - 540,  h: 180, tw: 288 },
      { wy: this.GROUND - 720,  h: 180, tw: 264 },
    ]

    // End stone base
    const baseY = this.GROUND - camY
    this._drawEndstone(ctx, cx - 210 - DEPTH, baseY, 420+DEPTH, 120, DEPTH)

    sections.forEach((sec, i) => {
      const sy = sec.wy - camY, sh = sec.h, sw = sec.tw, sx = cx - sw/2
      if (sy > this.H+50 || sy+sh < -50) return

      // 3D right side
      ctx.fillStyle = `hsl(275,50%,${18-i}%)`
      ctx.beginPath()
      ctx.moveTo(sx+sw, sy); ctx.lineTo(sx+sw+DEPTH, sy-DEPTH*.45)
      ctx.lineTo(sx+sw+DEPTH, sy+sh-DEPTH*.45); ctx.lineTo(sx+sw, sy+sh)
      ctx.closePath(); ctx.fill()

      // 3D top face
      ctx.fillStyle = `hsl(278,42%,36%)`
      ctx.beginPath()
      ctx.moveTo(sx, sy); ctx.lineTo(sx+sw, sy)
      ctx.lineTo(sx+sw+DEPTH, sy-DEPTH*.45); ctx.lineTo(sx+DEPTH, sy-DEPTH*.45)
      ctx.closePath(); ctx.fill()

      // Front face
      const grad = ctx.createLinearGradient(sx,sy,sx+sw,sy)
      grad.addColorStop(0,   `hsl(280,45%,${25+i*.5}%)`)
      grad.addColorStop(0.5, `hsl(280,52%,${29+i*.5}%)`)
      grad.addColorStop(1,   `hsl(280,45%,${25+i*.5}%)`)
      ctx.fillStyle = grad; ctx.fillRect(sx, sy, sw, sh)

      // Purpur block texture
      const BK = 22
      ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1
      for (let bx = sx; bx < sx+sw; bx += BK) {
        for (let by = sy; by < sy+sh; by += BK) {
          ctx.strokeRect(bx, by, BK, BK)
          ctx.fillStyle = 'rgba(200,155,240,.06)'
          ctx.fillRect(bx+1, by+1, BK*.4, BK*.4)
        }
      }

      // Windows
      const winH = sh*.28, winW = sw*.11, winY = sy+sh*.38
      ;[.2, .7].forEach(xf => {
        const wx = sx + sw*xf
        ctx.fillStyle = '#0d0022'; ctx.fillRect(wx, winY, winW, winH)
        const wg = ctx.createLinearGradient(wx, winY, wx, winY+winH)
        wg.addColorStop(0,'rgba(160,80,255,.45)'); wg.addColorStop(1,'rgba(80,0,160,.1)')
        ctx.fillStyle = wg; ctx.fillRect(wx, winY, winW, winH*.5)
        ctx.strokeStyle = '#5828a0'; ctx.lineWidth = 1.5; ctx.strokeRect(wx, winY, winW, winH)
        // Window glow
        ctx.save(); ctx.shadowColor = '#9040ff'; ctx.shadowBlur = 8+Math.sin(t*2+i)*4
        ctx.strokeStyle = '#7030d0'; ctx.strokeRect(wx, winY, winW, winH)
        ctx.restore()
      })

      // Corner pillars
      const PW = 16
      ctx.fillStyle = `hsl(275,55%,${22-i}%)`
      ctx.fillRect(sx-PW/2, sy-8, PW, sh+16)
      ctx.fillRect(sx+sw-PW/2, sy-8, PW, sh+16)
      ctx.fillStyle = `hsl(275,40%,14%)`
      ctx.fillRect(sx+sw+PW/2, sy-8, DEPTH*.55, sh+16)

      // Buttresses
      const bH=50, bOff=20, bW=14, midBut = sy + sh*.5
      ctx.fillStyle = `hsl(280,48%,${25-i}%)`
      ctx.fillRect(sx-bOff, midBut-bH/2, bOff, bH)
      ctx.fillRect(sx+sw,   midBut-bH/2, bOff, bH)

      // Floor ledge
      const ledgeY = sy+sh

      // Top Door (only on top floor)
      if (i === 3) {
        const dW = 44, dH = 64
        const dx = cx - dW/2, dy = ledgeY - dH
        // Door hole / frame
        ctx.fillStyle = '#10001a'; ctx.fillRect(dx, dy, dW, dH)
        ctx.strokeStyle = '#9040ff'; ctx.lineWidth = 2; ctx.strokeRect(dx, dy, dW, dH)
        ctx.fillStyle = '#3a005c'; ctx.fillRect(dx + 2, dy + 2, dW/2 - 2, dH - 2) // left door open
        // Glow inside
        ctx.save(); ctx.globalAlpha = 0.6 + Math.sin(t*4)*0.2
        ctx.fillStyle = '#ff44ff'; ctx.shadowColor = '#ff44ff'; ctx.shadowBlur = 20
        ctx.fillRect(dx + dW/2 - 4, dy + dH/2 - 10, 8, 20)
        ctx.restore()
      }

      ctx.fillStyle = `hsl(280,52%,38%)`
      ctx.fillRect(sx-22, ledgeY-6, sw+44, 18)
      ctx.fillStyle = `hsl(280,58%,50%)`; ctx.fillRect(sx-22, ledgeY-6, sw+44, 5)
      ctx.fillStyle = `hsl(280,38%,18%)`; ctx.fillRect(sx+sw+22, ledgeY-6, DEPTH*.8, 18)
    })

    // Spire
    const top = sections[sections.length-1]
    const spireBase = top.wy - camY
    ctx.fillStyle = '#6e3a9e'; ctx.fillRect(cx-14, spireBase-92, 28, 92)
    ctx.fillStyle = '#502878'; ctx.fillRect(cx+14, spireBase-92, DEPTH*.45, 92)
    ctx.fillStyle = '#8850b8'
    ctx.beginPath(); ctx.moveTo(cx-20,spireBase-92); ctx.lineTo(cx+20,spireBase-92); ctx.lineTo(cx,spireBase-136); ctx.closePath(); ctx.fill()
    ctx.save()
    ctx.shadowColor = '#ff44ff'; ctx.shadowBlur = 22+Math.sin(t*3)*10
    ctx.fillStyle = `hsl(300,100%,${58+Math.sin(t*3)*14}%)`
    ctx.beginPath(); ctx.moveTo(cx-7,spireBase-136); ctx.lineTo(cx+7,spireBase-136); ctx.lineTo(cx,spireBase-158); ctx.closePath(); ctx.fill()
    ctx.restore()
  }

  _drawEndstone(ctx, x, y, w, h, depth) {
    ctx.fillStyle = '#b8bc66'; ctx.fillRect(x, y, w-depth, 10)
    const g = ctx.createLinearGradient(x, y+10, x, y+h)
    g.addColorStop(0,'#b0b460'); g.addColorStop(1,'#909450')
    ctx.fillStyle = g; ctx.fillRect(x, y+10, w-depth, h-10)
    ctx.fillStyle = '#80844a'; ctx.fillRect(x+w-depth, y, depth, h)
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 1
    const BK = 20
    for (let bx = x; bx < x+w; bx += BK) for (let by = y; by < y+h; by += BK) ctx.strokeRect(bx, by, BK, BK)
  }

  _drawLedge(ctx, x, y, w, h) {
    ctx.fillStyle = '#7848a8'; ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#9868c4'; ctx.fillRect(x, y, w, 4)
    ctx.fillStyle = '#50288a'; ctx.fillRect(x+w, y, 14, h)
    ctx.strokeStyle = '#5a2898'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h)
  }

  _drawEnderman(ctx, e, sy) {
    const t = this.frame * 0.07, rage = e.chargePhase > 20
    ctx.save(); ctx.globalAlpha = 0.92
    // Particle aura
    ctx.save(); ctx.shadowColor = rage?'#ff3300':'#8800ff'; ctx.shadowBlur = rage?22:14
    for (let i = 0; i < 5; i++) {
      const ang = t*2+i*(Math.PI*2/5), r = 22+Math.sin(t*4+i)*6
      ctx.fillStyle = rage?`rgba(255,80,0,.6)`:`rgba(140,0,255,.4)`
      ctx.beginPath(); ctx.arc(e.x+Math.cos(ang)*r, sy-40+Math.sin(ang)*r, 3, 0, Math.PI*2); ctx.fill()
    }
    ctx.restore()
    // Body
    const bH=70, bW=14, lH=30, lW=7, aH=50, aW=7
    const ls = Math.sin(t*(rage?5:3))*8
    ctx.fillStyle = '#111122'
    ctx.fillRect(e.x-lW-1, sy-lH, lW, lH+ls); ctx.fillRect(e.x+1, sy-lH, lW, lH-ls)
    ctx.fillStyle = '#0f0f20'
    ctx.fillRect(e.x-bW/2-aW-2, sy-bH-10, aW, aH+(rage?ls:0))
    ctx.fillRect(e.x+bW/2+2,    sy-bH-10, aW, aH-(rage?ls:0))
    ctx.fillStyle = '#0d0d1e'; ctx.fillRect(e.x-bW/2, sy-bH-lH, bW, bH)
    const HW=22; ctx.fillStyle = '#111130'; ctx.fillRect(e.x-HW/2, sy-bH-lH-HW, HW, HW)
    ctx.fillStyle = rage?'#ff2200':'#bb44ff'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = rage?14:8
    ctx.fillRect(e.x-8, sy-bH-lH-HW+8, 5, 4); ctx.fillRect(e.x+3, sy-bH-lH-HW+8, 5, 4)
    ctx.shadowBlur = 0
    const bw=50; ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(e.x-bw/2, sy-bH-lH-HW-14, bw, 5)
    ctx.fillStyle='#ff2222'; ctx.fillRect(e.x-bw/2, sy-bH-lH-HW-14, bw*(e.hp/e.maxHp), 5)
    ctx.restore()
  }

  _drawShulker(ctx, e, sy) {
    const S=28, open=e.openAmount||0, off=open*S*.9
    ctx.save()
    ctx.fillStyle='#8850b8'; ctx.fillRect(e.x-S, sy-S, S*2, S)
    ctx.fillStyle='#6e3ea0'; ctx.fillRect(e.x+S-4, sy-S, 4, S)
    if (open > 0.05) {
      ctx.save(); ctx.globalAlpha = open
      ctx.fillStyle='#eed8ff'; ctx.fillRect(e.x-S+4, sy-S+4, (S-4)*2, S-8)
      const eyeR=10*open; ctx.fillStyle='#cc44ff'; ctx.shadowColor='#cc44ff'; ctx.shadowBlur=12
      ctx.beginPath(); ctx.arc(e.x, sy-S/2, eyeR, 0, Math.PI*2); ctx.fill()
      ctx.fillStyle='#440066'; ctx.beginPath(); ctx.arc(e.x, sy-S/2, eyeR*.4, 0, Math.PI*2); ctx.fill()
      ctx.restore()
    }
    ctx.fillStyle='#9860c8'; ctx.fillRect(e.x-S, sy-S*2-off, S*2, S)
    ctx.fillStyle='#7848a8'; ctx.fillRect(e.x+S-4, sy-S*2-off, 4, S)
    ctx.fillStyle='rgba(220,175,255,.18)'; ctx.fillRect(e.x-S, sy-S*2-off, S*2, 4)
    const bw=50
    ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(e.x-bw/2, sy-S*2-off-12, bw, 4)
    ctx.fillStyle='#aa44ff'; ctx.fillRect(e.x-bw/2, sy-S*2-off-12, bw*(e.hp/e.maxHp), 4)
    ctx.restore()
  }

  _drawPlayer(ctx, camY) {
    const p = this.player, sy = p.y - camY
    if (p.entering) {
      const prog = 1 - p.enterTimer/70
      ctx.save(); ctx.globalAlpha = prog
      ctx.fillStyle = `rgba(120,0,255,${.45*(1-prog)})`; ctx.fillRect(p.x-32, sy, 64, 22)
      ctx.restore()
      if (prog < 0.35) return
    }
    if (p.invincible && Math.floor(this.frame/5)%2===0) return

    const bob  = p.isMoving ? Math.sin(p.runPhase*2)*3 : 0
    const tilt = p.isMoving ? Math.sin(p.runPhase)*.13*p.facing : 0

    ctx.save(); ctx.translate(p.x, sy+bob); ctx.rotate(tilt)
    const shG = ctx.createRadialGradient(0,42,2,0,42,44)
    shG.addColorStop(0,'rgba(0,0,0,.5)'); shG.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle = shG; ctx.fillRect(-44, 20, 88, 32)

    // ── Angel wings (if Elytra equipped) ──────────────────
    if (this.hasElytra || window.playerHasElytra) {
      const wPhase = this.frame * 0.04
      const wFlap  = Math.sin(wPhase * 2) * 10
      const wSpan  = 55

      const drawWingSide = (side) => {
        ctx.save()
        ctx.scale(side, 1)
        ctx.shadowColor = 'rgba(200,230,255,0.9)'
        ctx.shadowBlur  = 14
        const feathers = [
          [8, -p.h*0.55 - wFlap,    wSpan,     14, -35],
          [8, -p.h*0.55 - wFlap+4,  wSpan*0.8, 11, -18],
          [8, -p.h*0.55 - wFlap+8,  wSpan*0.6,  9,   0],
          [8, -p.h*0.55 - wFlap+6,  wSpan*0.4,  7,  16],
          [8, -p.h*0.55 - wFlap+2,  wSpan*0.2,  5,  28],
        ]
        feathers.forEach(([ox,oy,len,h,angle]) => {
          ctx.save()
          ctx.translate(ox, oy)
          ctx.rotate(angle * Math.PI/180)
          const fg = ctx.createLinearGradient(0,0,len,0)
          fg.addColorStop(0,   'rgba(255,255,255,0.95)')
          fg.addColorStop(0.5, 'rgba(220,235,255,0.85)')
          fg.addColorStop(1,   'rgba(180,210,255,0.3)')
          ctx.fillStyle = fg
          ctx.beginPath()
          ctx.ellipse(len/2, 0, len/2, h/2, 0, 0, Math.PI*2)
          ctx.fill()
          ctx.strokeStyle = 'rgba(255,255,255,0.25)'
          ctx.lineWidth = 0.8
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(len,0); ctx.stroke()
          ctx.restore()
        })
        ctx.shadowBlur = 0
        ctx.restore()
      }

      drawWingSide(-1) // left
      drawWingSide(1)  // right
    }


    // Draw body
    if (this.playerImg.complete && this.playerImg.naturalWidth) {
      const totalFrames = 4
      const fw = this.playerImg.naturalWidth / totalFrames
      const fh = this.playerImg.naturalHeight
      let frameIdx = 0
      if (Math.abs(p.vx) > 0.1) {
        frameIdx = Math.floor(Date.now() / 150) % totalFrames
      }
      const sx = frameIdx * fw
      const dw = p.w + 16
      const dh = p.h + 8
      ctx.save()
      ctx.drawImage(this.playerImg, sx, 0, fw, fh, -dw/2, -dh + 2, dw, dh)
      ctx.restore()
    } else {
      ctx.fillStyle='#ff85b3'; ctx.fillRect(-20,-68,40,68)
    }

    // Draw Diamond Sword
    ctx.save()
    // Position at hand (right side if facing right, left if facing left)
    const handX = 14 * p.facing
    const handY = -28
    ctx.translate(handX, handY)
    
    // Sword swing animation
    let sAng = p.facing > 0 ? Math.PI/4 : -Math.PI/4
    if (p.swordSwing > 0) {
      const sp = p.swordSwing / 15 // 1 to 0
      sAng += p.facing > 0 ? (Math.PI*1.5 * sp) : (-Math.PI*1.5 * sp)
    }
    ctx.rotate(sAng)
    
    // Draw pixel sword
    const PX = 3
    const grid = [
      [0,0,0,0,0,1,2],
      [0,0,0,0,1,2,1],
      [0,0,0,1,2,1,0],
      [0,0,1,2,1,0,0],
      [0,1,2,1,0,0,0],
      [3,1,1,0,0,0,0],
      [4,3,0,0,0,0,0]
    ]
    const sCol = { 1:'#189898', 2:'#38f0f0', 3:'#503020', 4:'#201000' }
    // Offset so handle is at 0,0
    ctx.translate(-PX*1.5, -PX*5.5)
    for (let r=0; r<7; r++) {
      for (let c=0; c<7; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = sCol[grid[r][c]]
          ctx.fillRect(c*PX, r*PX, PX, PX)
        }
      }
    }
    ctx.restore()

    ctx.restore()
  }
}


