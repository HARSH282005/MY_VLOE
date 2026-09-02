export function initAnniversaryCanvas() {
  const canvas = document.getElementById('anniversaryCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null };
  let time = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(x, y, isHeart = false) {
      this.x = x;
      this.y = y;
      this.isHeart = isHeart;
      this.size = isHeart ? Math.random() * 5 + 5 : Math.random() * 3 + 2;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = isHeart ? Math.random() * -2 - 1 : Math.random() * 2 + 1;
      this.color = `hsla(${330 + Math.random() * 30}, 100%, 70%, ${Math.random() * 0.5 + 0.5})`;
      this.life = 1;
      this.decay = Math.random() * 0.01 + 0.005;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.1;
    }
    update() {
      // Global wind effect
      const wind = Math.sin(time * 0.5) * 1.5;
      
      this.x += this.speedX + wind + Math.sin(this.angle) * 0.5;
      this.y += this.speedY;
      this.angle += this.spin;
      
      if (!this.isHeart) {
         // Blossom petals fall down
         if (this.y > height + 20) {
             this.y = -20;
             this.x = Math.random() * width;
         }
         
         // Repel from mouse if scene is lit up
         if (document.body.classList.contains('lit-up') && mouse.x !== null && mouse.y !== null) {
           const dx = this.x - mouse.x;
           const dy = this.y - mouse.y;
           const dist = Math.sqrt(dx*dx + dy*dy);
           if (dist < 120) {
             this.x += (dx / dist) * 4;
             this.y += (dy / dist) * 4;
           }
         }
      } else {
         // Hearts float up and decay
         this.life -= this.decay;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      if (this.isHeart) {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, s/4);
        ctx.bezierCurveTo(0, 0, -s/2, 0, -s/2, s/4);
        ctx.bezierCurveTo(-s/2, s/2, 0, s*0.8, 0, s);
        ctx.bezierCurveTo(0, s*0.8, s/2, s/2, s/2, s/4);
        ctx.bezierCurveTo(s/2, 0, 0, 0, 0, s/4);
        ctx.fill();
      } else {
        // Cherry blossom petal
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#ffb7c5';
        
        // 3D spin effect by scaling based on angle
        ctx.scale(Math.abs(Math.sin(this.angle)), 1);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Create initial blossoms
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height, false));
  }

  let lastMove = 0;
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    const now = performance.now();
    // Throttle heart creation to avoid massive lag
    if (now - lastMove > 50 && Math.random() > 0.3) {
      particles.push(new Particle(mouse.x, mouse.y, true));
      lastMove = now;
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      const now = performance.now();
      if (now - lastMove > 50 && Math.random() > 0.3) {
        particles.push(new Particle(mouse.x, mouse.y, true));
        lastMove = now;
      }
    }
  }, { passive: true });

  canvas.addEventListener('click', (e) => {
    // Limit burst to 10 particles instead of 20 to reduce lag
    for (let i = 0; i < 10; i++) {
      let p = new Particle(e.clientX, e.clientY, true);
      p.speedX = (Math.random() - 0.5) * 8;
      p.speedY = (Math.random() - 0.5) * 8;
      p.decay = Math.random() * 0.02 + 0.01;
      particles.push(p);
    }
  });

  function animate() {
    time += 0.01;
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.draw();
      if (p.isHeart && p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}
