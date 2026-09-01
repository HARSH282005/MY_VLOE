// ============================================================
//  LEVEL 3 - ENDER DRAGON BOSS FIGHT
// ============================================================
class Level3DragonGame {
  constructor(container, skinSrc) {
    this.container = container
    this.skinSrc   = skinSrc
    this.playerImg = new Image()
    this.playerImg.src = skinSrc
    this.canvas = document.createElement('canvas')
    this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;'
    container.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.frame    = 0
    this.running  = false
    this.over     = false
    this.keys     = {}
    this.particles= []
    this.flames   = []
    this.hits     = []
    this._shake   = 0
    this.resize()
    window.addEventListener('resize', () => this.resize())
    this._setupInput()
    this._initEntities()
    this._initHUD()
    this._showIntro()
  }
  resize() {
    this.W = this.canvas.width  = window.innerWidth
    this.H = this.canvas.height = window.innerHeight
  }
  _setupInput() {
    this._kd = e => { this.keys[e.code] = true }
    this._ku = e => { this.keys[e.code] = false }
    window.addEventListener('keydown', this._kd)
    window.addEventListener('keyup',   this._ku)
    this.canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      const tx = e.touches[0].clientX, ty = e.touches[0].clientY
      if (tx < this.W * 0.35)      this.keys['ArrowLeft']  = true
      else if (tx > this.W * 0.65) this.keys['ArrowRight'] = true
      else if (ty < this.H * 0.5)  this.keys['ArrowUp']    = true
      else                          this.keys['Space']       = true
    }, { passive: false })
    this.canvas.addEventListener('touchend', () => {
      this.keys['ArrowLeft'] = this.keys['ArrowRight'] = this.keys['ArrowUp'] = this.keys['Space'] = false
    })
  }
  _initEntities() {
    const W = this.W||800, H = this.H||600
    this.player = {
      x:W/2, y:H*0.80, w:40, h:60,
      vx:0, vy:0, speed:5.5, flyPower:-7.5, gravity:0.32,
      minY:H*0.30, maxY:H*0.92,
      hearts:4, maxHearts:4,
      invincible:false, invTimer:0,
      swordSwing:0, attackCooldown:0,
      facing:1, wingPhase:0
    }
    this.dragon = {
      x:W/2, y:H*0.16, baseY:H*0.16,
      w:160, h:90, hp:10, maxHp:10,
      phase:0, speed:1.6,
      swoopTimer:220, swoopDuration:0, swoopTarget:null, swoopPhase:'idle',
      breathTimer:70, breathInterval:88,
      hitFlash:0, deathTimer:-1, wingPhase:0, eyeGlow:0
    }
  }
  _initHUD() {
    const hud = document.createElement('div')
    hud.id = 'lvl3hud'
    hud.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:20;font-family:Minecrafter,monospace;'
    hud.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:flex-start;padding:14px 20px;background:linear-gradient(to bottom,rgba(0,0,0,0.78),transparent);">
        <div>
          <div style="font-size:0.55rem;letter-spacing:0.15em;color:#aaa;margin-bottom:4px;">YOU</div>
          <div id="l3playerHearts" style="font-size:1.3rem;letter-spacing:3px;"></div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:0.5rem;letter-spacing:0.2em;color:#cc88ff;text-shadow:0 0 8px #aa44ff;">FINAL BOSS</div>
          <div style="font-size:0.65rem;color:#fff;letter-spacing:0.1em;margin-top:2px;">ENDER DRAGON</div>
          <div style="width:min(220px,45vw);height:10px;background:#111;border:2px solid #440066;border-radius:2px;margin:5px auto 0;overflow:hidden;">
            <div id="l3dragonBar" style="height:100%;width:100%;background:linear-gradient(90deg,#7700aa,#cc44ff);transition:width 0.25s;"></div>
          </div>
          <div id="l3dragonHp" style="font-size:0.5rem;color:#cc88ff;margin-top:3px;letter-spacing:0.1em;"></div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.55rem;letter-spacing:0.15em;color:#cc44ff;margin-bottom:4px;">DRAGON</div>
          <div id="l3dragonHearts" style="font-size:0.9rem;letter-spacing:2px;color:#9900cc;"></div>
        </div>
      </div>
      <div style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font-size:0.5rem;letter-spacing:0.1em;color:rgba(255,255,255,0.4);text-align:center;white-space:nowrap;">
        LEFT/RIGHT MOVE &nbsp;|&nbsp; UP/SPACE FLY &nbsp;|&nbsp; GET CLOSE TO SLASH!
      </div>
    `
    this.container.appendChild(hud)
    this._updateHUD()
  }
  _updateHUD() {
    const ph = document.getElementById('l3playerHearts')
    const dh = document.getElementById('l3dragonHearts')
    const db = document.getElementById('l3dragonBar')
    const dp = document.getElementById('l3dragonHp')
    if(ph) ph.textContent = 'heart'.repeat(0)+'❤'.repeat(this.player.hearts)+'🖤'.repeat(this.player.maxHearts-this.player.hearts)
    if(dh){const f=Math.ceil((this.dragon.hp/this.dragon.maxHp)*5);dh.textContent='💜'.repeat(Math.max(0,f))+'🖤'.repeat(5-Math.max(0,f))}
    if(db) db.style.width=Math.max(0,(this.dragon.hp/this.dragon.maxHp)*100)+'%'
    if(dp) dp.textContent=this.dragon.hp+' / '+this.dragon.maxHp+' HP'
  }
  _showIntro() {
    const intro = document.createElement('div')
    intro.id = 'l3intro'
    intro.style.cssText = 'position:absolute;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.9);'
    intro.innerHTML = `
      <div style="font-family:Minecrafter,monospace;text-align:center;padding:20px;">
        <div style="font-size:0.55rem;letter-spacing:0.35em;color:#cc44ff;margin-bottom:14px;">FINAL BOSS</div>
        <h1 style="font-size:clamp(1.8rem,5vw,3.2rem);color:#fff;margin:0 0 8px;text-shadow:0 0 30px rgba(150,0,255,0.9);">THE ENDER DRAGON</h1>
        <p style="font-size:clamp(0.6rem,2vw,0.85rem);color:#cc88ff;letter-spacing:0.1em;margin:0 0 30px;line-height:1.9;">
          USE YOUR WINGS TO FLY AND DODGE THE FIRE.<br>GET CLOSE TO AUTO-SLASH WITH YOUR SWORD!
        </p>
        <button id="l3startBtn" style="font-family:Minecrafter,monospace;font-size:clamp(0.6rem,2.5vw,0.85rem);letter-spacing:0.18em;padding:14px 44px;background:linear-gradient(135deg,#1a0035,#33006b);border:2px solid #9900cc;border-top-color:#cc44ff;border-bottom:4px solid #110022;border-radius:4px;color:#cc88ff;cursor:pointer;box-shadow:0 0 28px rgba(150,0,255,0.5);">FIGHT THE DRAGON!</button>
      </div>
    `
    this.container.appendChild(intro)
    document.getElementById('l3startBtn').addEventListener('click', () => {
      if (window.playMusicTrack) window.playMusicTrack('battle');
      gsap.to(intro,{opacity:0,duration:0.5,onComplete:()=>{intro.remove();this.running=true;this._loop()}})
    })
  }
  _loop() {
    if(!this.running) return
    this.frame++
    this._update()
    this._draw()
    requestAnimationFrame(()=>this._loop())
  }
  _update() {
    if(this.over) return
    const p=this.player, d=this.dragon, W=this.W, H=this.H
    const goLeft=this.keys['ArrowLeft']||this.keys['KeyA']
    const goRight=this.keys['ArrowRight']||this.keys['KeyD']
    const fly=this.keys['ArrowUp']||this.keys['KeyW']||this.keys['Space']
    p.vx=0
    if(goLeft){p.vx=-p.speed;p.facing=-1}
    if(goRight){p.vx=p.speed;p.facing=1}
    if(fly) p.vy=Math.max(p.vy-0.85,p.flyPower)
    p.vy+=p.gravity; p.x+=p.vx; p.y+=p.vy
    p.x=Math.max(p.w/2,Math.min(W-p.w/2,p.x))
    p.y=Math.max(p.minY,Math.min(p.maxY,p.y))
    if(p.y>=p.maxY) p.vy=0
    p.wingPhase+=0.16
    if(p.invincible){p.invTimer--;if(p.invTimer<=0)p.invincible=false}
    if(p.swordSwing>0) p.swordSwing--
    if(p.attackCooldown>0) p.attackCooldown--
    // Auto attack
    if(d.hp>0){
      const dd=Math.hypot(p.x-d.x,p.y-(d.y+110))
      if(dd<140&&p.attackCooldown<=0){
        p.swordSwing=18; p.attackCooldown=30
        d.hp=Math.max(0,d.hp-1); d.hitFlash=14
        this._spawnHitSparks(d.x,d.y+110); this._shake=7
        this._updateHUD()
        if(d.hp<=0){d.deathTimer=130;setTimeout(()=>this._showVictory(),3200)}
      }
    }
    // Dragon AI
    d.wingPhase+=0.09; d.eyeGlow=0.55+Math.sin(this.frame*0.07)*0.45
    if(d.hitFlash>0) d.hitFlash--
    if(d.hp>0){
      if(d.swoopPhase==='idle'){
        d.phase+=d.speed*0.013
        d.x+=Math.cos(d.phase*0.65)*d.speed*0.9
        d.y=d.baseY+Math.sin(d.phase)*38
        if(d.x<d.w/2+20){d.x=d.w/2+20;d.phase=Math.PI-d.phase}
        if(d.x>W-d.w/2-20){d.x=W-d.w/2-20;d.phase=Math.PI-d.phase}
        d.swoopTimer--
        if(d.swoopTimer<=0){
          d.swoopPhase='swooping'
          d.swoopTarget={x:p.x+(Math.random()*70-35),y:p.y-30}
          d.swoopDuration=52; d.swoopTimer=190+Math.random()*80
        }
        d.breathTimer--
        if(d.breathTimer<=0){d.breathTimer=d.breathInterval;this._spawnFlames(d.x,d.y+150,p.x,p.y)}
      } else if(d.swoopPhase==='swooping'){
        d.x+=(d.swoopTarget.x-d.x)*0.065
        d.y+=(d.swoopTarget.y-d.y)*0.065
        d.swoopDuration--
        if(d.swoopDuration<=0) d.swoopPhase='returning'
      } else {
        d.y+=(d.baseY-d.y)*0.055
        if(Math.abs(d.y-d.baseY)<4) d.swoopPhase='idle'
      }
    } else if(d.deathTimer>0){
      d.deathTimer--; d.y+=1.2; d.phase+=0.06
      if(this.frame%3===0){
        const a=Math.random()*Math.PI*2,spd=1+Math.random()*4
        this.particles.push({x:d.x+(Math.random()-0.5)*80,y:d.y+(Math.random()-0.5)*60,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-1,life:40+Math.random()*40,maxLife:80,alpha:1,r:2+Math.random()*4,col:['#9900cc','#cc44ff','#ffffff','#ff44ff'][Math.floor(Math.random()*4)]})
      }
    }
    // Flames
    for(let i=this.flames.length-1;i>=0;i--){
      const f=this.flames[i]
      f.x+=f.vx;f.y+=f.vy;f.vy+=0.1;f.life--
      if(f.life<=0){this.flames.splice(i,1);continue}
      if(!p.invincible&&Math.hypot(f.x-p.x,f.y-p.y)<20){
        p.hearts=Math.max(0,p.hearts-1);p.invincible=true;p.invTimer=80
        this.flames.splice(i,1);this._updateHUD()
        if(p.hearts<=0){this._showGameOver();return}
        continue
      }
    }
    for(let i=this.particles.length-1;i>=0;i--){const pt=this.particles[i];pt.x+=pt.vx;pt.y+=pt.vy;pt.vy+=0.09;pt.life--;pt.alpha=pt.life/pt.maxLife;if(pt.life<=0)this.particles.splice(i,1)}
    for(let i=this.hits.length-1;i>=0;i--){const h=this.hits[i];h.x+=h.vx;h.y+=h.vy;h.life--;h.alpha=h.life/h.maxLife;if(h.life<=0)this.hits.splice(i,1)}
  }
  _spawnFlames(sx,sy,tx,ty){
    const angle=Math.atan2(ty-sy,tx-sx)
    for(let i=0;i<6;i++){
      const spread=(Math.random()-0.5)*0.55,spd=3.2+Math.random()*2
      this.flames.push({x:sx,y:sy,vx:Math.cos(angle+spread)*spd,vy:Math.sin(angle+spread)*spd,r:7+Math.random()*6,life:50+Math.random()*20,hue:Math.random()>0.5?'#ff5500':'#ffaa00'})
    }
  }
  _spawnHitSparks(x,y){
    for(let i=0;i<16;i++){
      const a=Math.random()*Math.PI*2,spd=2+Math.random()*5
      this.hits.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:18+Math.random()*12,maxLife:30,alpha:1,col:Math.random()>0.4?'#cc44ff':'#ffffff'})
    }
  }
  _draw(){
    const ctx=this.ctx,W=this.W,H=this.H,t=this.frame
    const shk=this._shake||0
    if(shk>0){ctx.save();ctx.translate((Math.random()-0.5)*shk,(Math.random()-0.5)*shk);this._shake=Math.max(0,shk-1.2)}
    this._drawBg(ctx,W,H,t)
    for(const f of this.flames){
      ctx.globalAlpha=(f.life/(f.life+20))*0.85
      const gr=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r)
      gr.addColorStop(0,'#ffffff');gr.addColorStop(0.3,f.hue);gr.addColorStop(1,'rgba(255,60,0,0)')
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fill()
    }
    ctx.globalAlpha=1
    for(const h of this.hits){ctx.globalAlpha=h.alpha;ctx.fillStyle=h.col;ctx.beginPath();ctx.arc(h.x,h.y,2.5,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=1
    for(const pt of this.particles){ctx.globalAlpha=pt.alpha;ctx.fillStyle=pt.col;ctx.beginPath();ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=1
    if(this.dragon.hp>0||this.dragon.deathTimer>0) this._drawDragon(ctx,t)
    this._drawPlayer3(ctx,t)
    if(shk>0) ctx.restore()
  }
  _drawBg(ctx,W,H,t){
    const sky=ctx.createLinearGradient(0,0,0,H)
    sky.addColorStop(0,'#000');sky.addColorStop(0.45,'#040012');sky.addColorStop(0.85,'#080020');sky.addColorStop(1,'#000')
    ctx.fillStyle=sky;ctx.fillRect(0,0,W,H)
    for(let i=0;i<90;i++){
      const sx=((i*137+42)%W),sy=((i*97+17)%(H*0.88)),pulse=Math.sin(t*0.035+i*0.8)*0.5+0.5
      ctx.globalAlpha=pulse*(i%4===0?0.8:0.45);ctx.fillStyle=i%5===0?'#aa55ff':'#ffffff'
      ctx.fillRect(sx,sy,i%3===0?2:1,i%3===0?2:1)
    }
    ctx.globalAlpha=1
    const vg=ctx.createRadialGradient(W/2,H/2,H*0.18,W/2,H/2,H*0.95)
    vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(90,0,160,0.2)')
    ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)
    for(let bx=0;bx*34<W;bx++){
      ctx.fillStyle=bx%2===0?'#0b0b1a':'#090912';ctx.fillRect(bx*34,H-28,34,28)
      ctx.strokeStyle='rgba(70,0,110,0.35)';ctx.lineWidth=1;ctx.strokeRect(bx*34,H-28,34,28)
    }
    const fg=ctx.createLinearGradient(0,H-55,0,H)
    fg.addColorStop(0,'rgba(90,0,160,0)');fg.addColorStop(1,'rgba(90,0,160,0.3)')
    ctx.fillStyle=fg;ctx.fillRect(0,H-55,W,55)
  }
  _drawDragon(ctx,t){
    const d=this.dragon,W=this.W,H=this.H
    const flash=d.hitFlash>0,dead=d.hp<=0
    // Responsive scale: dragon fills ~40% of screen width
    const S=Math.min(W/700,H/480)*1.1
    let alpha=1
    if(dead&&d.deathTimer>=0) alpha=Math.max(0,d.deathTimer/130)
    ctx.globalAlpha=alpha
    ctx.save()
    const swayX=dead?Math.sin(d.phase*2)*30:0
    const swayR=dead?Math.sin(d.phase*1.4)*0.25:0
    ctx.translate(d.x+swayX,d.y)
    ctx.rotate(swayR)
    ctx.scale(S,S)

    const wf=Math.sin(d.wingPhase)

    // ==== VOID AURA GLOW ====
    const aura=ctx.createRadialGradient(0,60,30,0,60,230)
    aura.addColorStop(0,'rgba(90,0,160,0.18)')
    aura.addColorStop(0.5,'rgba(50,0,110,0.09)')
    aura.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle=aura
    ctx.beginPath();ctx.ellipse(0,60,230,180,0,0,Math.PI*2);ctx.fill()

    // ==== TAIL (curves upward, away from head) ====
    ctx.save()
    let txA=0,tyA=-38
    for(let i=0;i<10;i++){
      const p=1-i/10
      const tw=Math.round(Math.max(4,22*p))
      const th=Math.round(Math.max(4,18*p))
      const ang=Math.sin(t*0.045+i*0.6)*0.32
      txA+=Math.cos(-0.45+ang)*17+i
      tyA-=Math.sin(0.5+ang)*9+i*1.2
      const c0=flash?'#9922cc':(i%2===0?'#0d0d1e':'#171730')
      const c1=flash?'rgba(180,80,255,0.3)':'rgba(50,50,90,0.25)'
      ctx.fillStyle=c0
      ctx.fillRect(txA-tw/2,tyA-th/2,tw,th)
      ctx.fillStyle=c1
      ctx.fillRect(txA-tw/2,tyA-th/2,tw,Math.ceil(th*0.35))
      ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=0.8
      ctx.strokeRect(txA-tw/2,tyA-th/2,tw,th)
    }
    ctx.restore()

    // ==== WINGS (drawn behind body) ====
    this._drawDragonWing(ctx,-1,wf,flash,t)
    this._drawDragonWing(ctx, 1,wf,flash,t)

    // ==== BODY ====
    const bW=110,bH=68,bx=-bW/2,by=-bH/2
    const bG=ctx.createLinearGradient(bx,by,bx+bW,by+bH)
    bG.addColorStop(0,flash?'#550088':'#0d0d1e')
    bG.addColorStop(0.45,flash?'#7700aa':'#141428')
    bG.addColorStop(1,flash?'#330055':'#080815')
    ctx.fillStyle=bG;ctx.strokeStyle=flash?'#cc55ff':'#222240';ctx.lineWidth=2.5
    ctx.fillRect(bx,by,bW,bH);ctx.strokeRect(bx,by,bW,bH)
    // Pixel highlight band (top)
    ctx.fillStyle=flash?'rgba(180,80,255,0.18)':'rgba(55,55,100,0.22)'
    ctx.fillRect(bx+3,by+3,bW-6,10)
    // Pixel shadow band (bottom)
    ctx.fillStyle='rgba(0,0,0,0.25)'
    ctx.fillRect(bx+3,by+bH-8,bW-6,6)
    // SPINE BUMPS (7 spikes along top of body)
    const spC=flash?['#cc55ff','#aa33dd','#bb44ee','#dd77ff','#bb44ee','#aa33dd','#cc55ff']:['#1e1e3a','#252548','#1a1a35','#2a2a50','#1a1a35','#252548','#1e1e3a']
    for(let i=0;i<7;i++){
      const spx=bx+8+i*14
      const sph=10+(i===3?9:i===2||i===4?6:i===1||i===5?3:0)
      ctx.fillStyle=spC[i]
      ctx.beginPath();ctx.moveTo(spx,by);ctx.lineTo(spx+10,by);ctx.lineTo(spx+7,by-sph);ctx.lineTo(spx+3,by-sph);ctx.closePath();ctx.fill()
      ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=0.8;ctx.stroke()
      ctx.fillStyle=flash?'rgba(220,160,255,0.4)':'rgba(70,70,115,0.3)'
      ctx.fillRect(spx+1,by-sph+2,3,sph-4)
    }

    // ==== NECK (extends downward from body) ====
    const nW=36,nH=48
    ctx.fillStyle=flash?'#660099':'#0e0e22'
    ctx.strokeStyle=flash?'#bb55ff':'#1e1e3e';ctx.lineWidth=2
    ctx.fillRect(-nW/2,by+bH,nW,nH);ctx.strokeRect(-nW/2,by+bH,nW,nH)
    ctx.fillStyle=flash?'rgba(180,80,255,0.18)':'rgba(48,48,90,0.25)'
    ctx.fillRect(-nW/2+2,by+bH+2,8,nH-4)
    ctx.strokeStyle=flash?'#9922cc':'#181838';ctx.lineWidth=1
    for(let ni=1;ni<4;ni++){ctx.beginPath();ctx.moveTo(-nW/2,by+bH+ni*11);ctx.lineTo(nW/2,by+bH+ni*11);ctx.stroke()}

    // ==== HEAD (faces DOWNWARD toward player) ====
    const hW=68,hH=56
    const hx=-hW/2,hy=by+bH+nH
    const hG=ctx.createLinearGradient(hx,hy,hx+hW,hy+hH)
    hG.addColorStop(0,flash?'#7700bb':'#0f0f24')
    hG.addColorStop(0.5,flash?'#9911dd':'#161633')
    hG.addColorStop(1,flash?'#550088':'#0a0a18')
    ctx.fillStyle=hG;ctx.strokeStyle=flash?'#dd77ff':'#282850';ctx.lineWidth=2.5
    ctx.fillRect(hx,hy,hW,hH);ctx.strokeRect(hx,hy,hW,hH)
    ctx.fillStyle=flash?'rgba(200,100,255,0.16)':'rgba(55,55,100,0.22)'
    ctx.fillRect(hx+3,hy+3,hW-6,10)
    ctx.fillStyle='rgba(0,0,0,0.2)'
    ctx.fillRect(hx+3,hy+hH-7,hW-6,5)

    // HEAD HORNS (3 tapered horns on top of head)
    const hrnC=flash?['#bb44ff','#9933ee','#dd66ff']:['#1c1c38','#141430','#222248']
    ;[-20,0,20].forEach((ox,i)=>{
      const hrnH=18+(i===1?12:i===0||i===2?0:0)
      const hrnX=hx+hW/2+ox-5
      ctx.fillStyle=hrnC[i]
      ctx.beginPath();ctx.moveTo(hrnX,hy);ctx.lineTo(hrnX+10,hy);ctx.lineTo(hrnX+7,hy-hrnH);ctx.lineTo(hrnX+3,hy-hrnH);ctx.closePath();ctx.fill()
      ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=0.8;ctx.stroke()
      ctx.fillStyle=flash?'rgba(210,150,255,0.4)':'rgba(65,65,110,0.3)'
      ctx.fillRect(hrnX+1,hy-hrnH+2,3,hrnH-4)
    })

    // ==== GLOWING EYES (large, dramatic) ====
    const eg=d.eyeGlow
    const eyeY=hy+16
    ;[hx+9,hx+hW-23].forEach(ex=>{
      // Massive outer glow
      const gg=ctx.createRadialGradient(ex+7,eyeY+6,0,ex+7,eyeY+6,32)
      gg.addColorStop(0,'rgba(255,50,255,'+eg*0.95+')')
      gg.addColorStop(0.25,'rgba(200,0,255,'+eg*0.65+')')
      gg.addColorStop(0.55,'rgba(130,0,220,'+eg*0.3+')')
      gg.addColorStop(1,'rgba(60,0,130,0)')
      ctx.fillStyle=gg;ctx.beginPath();ctx.arc(ex+7,eyeY+6,32,0,Math.PI*2);ctx.fill()
      // Socket
      ctx.fillStyle='#060010';ctx.fillRect(ex,eyeY,15,14)
      // Iris gradient
      const ir=ctx.createLinearGradient(ex+2,eyeY+2,ex+13,eyeY+12)
      ir.addColorStop(0,'rgba(255,90,255,'+eg+')')
      ir.addColorStop(1,'rgba(160,0,230,'+eg+')')
      ctx.fillStyle=ir;ctx.fillRect(ex+2,eyeY+2,11,10)
      // Vertical pupil slit
      ctx.fillStyle='rgba(0,0,0,0.75)';ctx.fillRect(ex+6,eyeY+2,3,10)
      // Specular
      ctx.fillStyle='rgba(255,255,255,'+Math.min(1,eg*0.85)+')';ctx.fillRect(ex+3,eyeY+3,3,3)
    })

    // ==== SNOUT (points downward, below head) ====
    const snW=38,snH=26
    const snX=hx+(hW-snW)/2
    ctx.fillStyle=flash?'#5500aa':'#0b0b1e'
    ctx.strokeStyle=flash?'#bb55ff':'#1a1a38';ctx.lineWidth=2
    ctx.fillRect(snX,hy+hH,snW,snH);ctx.strokeRect(snX,hy+hH,snW,snH)
    ctx.fillStyle=flash?'rgba(160,80,255,0.2)':'rgba(40,40,80,0.2)'
    ctx.fillRect(snX+2,hy+hH+2,snW-4,7)
    // Nostrils
    ctx.fillStyle=flash?'#440066':'#06060e'
    ctx.fillRect(snX+6,hy+hH+10,5,4);ctx.fillRect(snX+snW-11,hy+hH+10,5,4)
    // OPEN MOUTH pointing downward at player!
    ctx.fillStyle=flash?'#220044':'#000000'
    ctx.fillRect(snX+2,hy+hH+snH,snW-4,14)
    // Lower jaw lip
    ctx.fillStyle=flash?'#440088':'#080815'
    ctx.fillRect(snX+2,hy+hH+snH+11,snW-4,4)

    ctx.restore()
    ctx.globalAlpha=1
  }
  _drawDragonWing(ctx,side,wf,flash,t){
    ctx.save()
    ctx.scale(side,1)

    // Pivot: shoulder on body side
    const shX=52,shY=-15
    ctx.translate(shX,shY)

    // Wing flap offset
    const flap=wf*side*0.3
    ctx.rotate(flap)

    // ---- BONE GEOMETRY ----
    // Upper arm
    const uaLen=95,uaAng=-0.38+flap*0.2
    const uaEx=uaLen*Math.cos(uaAng)
    const uaEy=uaLen*Math.sin(uaAng)

    // Forearm (from upper arm tip)
    const faLen=72,faAng=uaAng+0.62
    const faEx=uaEx+faLen*Math.cos(faAng)
    const faEy=uaEy+faLen*Math.sin(faAng)

    // 3 finger bones from forearm tip
    const fAngles=[-0.4,0.1,0.62]
    const fLens=[55,44,34]
    const ftx=fAngles.map((a,i)=>faEx+fLens[i]*Math.cos(faAng+a))
    const fty=fAngles.map((a,i)=>faEy+fLens[i]*Math.sin(faAng+a))

    // ---- MEMBRANE (drawn first, behind bones) ----
    ctx.fillStyle=flash?'rgba(100,20,200,0.50)':'rgba(5,5,18,0.80)'
    ctx.strokeStyle=flash?'rgba(160,60,255,0.45)':'rgba(20,20,55,0.65)'
    ctx.lineWidth=1.5
    ctx.beginPath()
    ctx.moveTo(0,-10)            // upper shoulder
    ctx.lineTo(uaEx,uaEy-6)     // upper arm tip
    ctx.lineTo(faEx,faEy)       // forearm tip
    ctx.lineTo(ftx[0],fty[0])   // finger 1 tip
    ctx.lineTo(ftx[1],fty[1])   // finger 2 tip
    ctx.lineTo(ftx[2],fty[2])   // finger 3 tip
    ctx.quadraticCurveTo(faEx*0.38,fty[2]*0.55+55,0,18)  // sweep back lower
    ctx.closePath()
    ctx.fill();ctx.stroke()

    // Membrane veins
    ctx.strokeStyle=flash?'rgba(130,50,210,0.28)':'rgba(18,18,45,0.45)'
    ctx.lineWidth=0.7
    ;[0,1,2].forEach(i=>{
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(faEx*0.6,faEy*0.6+i*8);ctx.lineTo(ftx[i],fty[i]);ctx.stroke()
    })

    // ---- UPPER ARM BONE ----
    ctx.save();ctx.rotate(uaAng)
    const bC=flash?'#8844cc':'#3e3e55'
    const bH2=flash?'#aa66ee':'#565670'
    const bS=flash?'#330055':'#1c1c2e'
    ctx.fillStyle=bC;ctx.fillRect(0,-9,uaLen,18)
    ctx.fillStyle=bH2;ctx.fillRect(0,-9,uaLen,4)       // top highlight
    ctx.fillStyle=bS;ctx.fillRect(0,11,uaLen,5)        // bottom shadow
    // Block pixel seams
    ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=1
    for(let s=18;s<uaLen;s+=18){ctx.beginPath();ctx.moveTo(s,-9);ctx.lineTo(s,9);ctx.stroke()}
    ctx.strokeStyle='rgba(0,0,0,0.6)';ctx.lineWidth=1.5;ctx.strokeRect(0,-9,uaLen,18)
    ctx.restore()

    // ---- FOREARM BONE ----
    ctx.save();ctx.translate(uaEx,uaEy);ctx.rotate(faAng)
    ctx.fillStyle=flash?'#7733bb':'#363650'
    ctx.fillRect(0,-7,faLen,14)
    ctx.fillStyle=flash?'#9955dd':'#4a4a68';ctx.fillRect(0,-7,faLen,3)
    ctx.fillStyle=flash?'#220044':'#181828';ctx.fillRect(0,9,faLen,5)
    ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=1
    for(let s=16;s<faLen;s+=16){ctx.beginPath();ctx.moveTo(s,-7);ctx.lineTo(s,7);ctx.stroke()}
    ctx.strokeStyle='rgba(0,0,0,0.6)';ctx.lineWidth=1.5;ctx.strokeRect(0,-7,faLen,14)
    ctx.restore()

    // ---- FINGER BONES ----
    fAngles.forEach((fa,i)=>{
      ctx.save();ctx.translate(faEx,faEy);ctx.rotate(faAng+fa)
      const fw=fLens[i],fh=7-i
      ctx.fillStyle=flash?'#6622aa':'#2e2e42'
      ctx.fillRect(0,-fh/2,fw,fh)
      ctx.fillStyle=flash?'#8844cc':'#3c3c55';ctx.fillRect(0,-fh/2,fw,2)
      ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=1;ctx.strokeRect(0,-fh/2,fw,fh)
      // Claw
      ctx.fillStyle=flash?'#9944ff':'#232335'
      ctx.beginPath();ctx.moveTo(fw,-fh/2-2);ctx.lineTo(fw+12,0);ctx.lineTo(fw,-fh/2+fh+2);ctx.closePath();ctx.fill()
      ctx.restore()
    })

    // ---- SHOULDER JOINT ----
    ctx.fillStyle=flash?'#9933cc':'#32324e'
    ctx.fillRect(-13,-13,26,26)
    ctx.fillStyle=flash?'#bb55ff':'#484868';ctx.fillRect(-10,-10,10,9)
    ctx.strokeStyle='rgba(0,0,0,0.6)';ctx.lineWidth=1.5;ctx.strokeRect(-13,-13,26,26)

    ctx.restore()
  }
  _drawPlayer3(ctx,t){
    const p=this.player
    if(p.invincible&&Math.floor(t/4)%2===0) return
    ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.facing,1)
    // Wings
    const wf=Math.sin(p.wingPhase)*0.38
    ;[-1,1].forEach(side=>{
      ctx.save();ctx.scale(side,1)
      const fCols=['rgba(255,255,255,0.92)','rgba(230,230,255,0.68)','rgba(200,200,255,0.42)']
      for(let layer=0;layer<3;layer++){
        const spread=0.58+wf*0.32+layer*0.14,len=65-layer*14
        ctx.save();ctx.rotate(-spread)
        ctx.fillStyle=fCols[layer];ctx.shadowColor='rgba(210,210,255,0.7)';ctx.shadowBlur=12-layer*3
        ctx.beginPath();ctx.moveTo(0,-p.h*0.7);ctx.lineTo(len,-p.h*0.38-layer*7);ctx.lineTo(len*0.82,-p.h*0.08);ctx.lineTo(0,-p.h*0.22);ctx.closePath();ctx.fill()
        for(let f=0;f<4;f++){const fx2=len*0.5+f*len*0.13,fy2=-p.h*0.38+f*7-layer*3;ctx.beginPath();ctx.ellipse(fx2,fy2,4-layer,11-layer*2,-spread*0.28,0,Math.PI*2);ctx.fill()}
        ctx.shadowBlur=0;ctx.restore()
      }
      ctx.restore()
    })
    // Body
    if(this.playerImg.complete&&this.playerImg.naturalWidth){
      ctx.save();ctx.beginPath();ctx.rect(-p.w/2,-p.h,p.w,p.h);ctx.clip()
      ctx.drawImage(this.playerImg,-p.w/2,-p.h,p.w,p.h);ctx.restore()
      ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1.5;ctx.strokeRect(-p.w/2,-p.h,p.w,p.h)
    } else {ctx.fillStyle='#ff85b3';ctx.fillRect(-p.w/2,-p.h,p.w,p.h)}
    // Sword
    ctx.save();ctx.translate(16,-34)
    let sAng=Math.PI/4
    if(p.swordSwing>0) sAng+=Math.PI*1.5*(p.swordSwing/18)
    ctx.rotate(sAng)
    const PX=4,sg=[[0,0,0,0,0,1,2],[0,0,0,0,1,2,1],[0,0,0,1,2,1,0],[0,0,1,2,1,0,0],[0,1,2,1,0,0,0],[3,1,1,0,0,0,0],[4,3,0,0,0,0,0]]
    const sc={1:'#189898',2:'#38f0f0',3:'#503020',4:'#201000'}
    ctx.translate(-PX*1.5,-PX*5.5)
    if(p.swordSwing>0){ctx.shadowColor='#38f0f0';ctx.shadowBlur=14}
    for(let r=0;r<7;r++) for(let c=0;c<7;c++) if(sg[r][c]){ctx.fillStyle=sc[sg[r][c]];ctx.fillRect(c*PX,r*PX,PX,PX)}
    ctx.shadowBlur=0;ctx.restore()
    ctx.restore()
  }
  _showGameOver(){
    this.over=true;this.running=false
    const ov=document.createElement('div')
    ov.style.cssText='position:absolute;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.87);font-family:Minecrafter,monospace;text-align:center;padding:20px;'
    ov.innerHTML=`
      <div style="font-size:0.5rem;letter-spacing:0.3em;color:#ff4444;margin-bottom:10px;">DEFEATED</div>
      <h2 style="font-size:clamp(1.4rem,4vw,2.6rem);color:#ff4444;text-shadow:0 0 28px rgba(255,0,0,0.8);margin:0 0 14px;">YOU FELL, SHONA!</h2>
      <p style="font-size:clamp(0.55rem,1.8vw,0.75rem);color:rgba(255,255,255,0.55);margin:0 0 30px;letter-spacing:0.1em;line-height:1.8;">DON'T GIVE UP!<br>GET UP AND FIGHT AGAIN!</p>
      <button id="l3retryBtn" style="font-family:Minecrafter,monospace;font-size:0.7rem;letter-spacing:0.18em;padding:13px 38px;background:linear-gradient(135deg,#200000,#500000);border:2px solid #ff4444;border-bottom:4px solid #110000;border-radius:4px;color:#ff8888;cursor:pointer;box-shadow:0 0 18px rgba(255,0,0,0.35);">TRY AGAIN</button>
    `
    this.container.appendChild(ov)
    document.getElementById('l3retryBtn').addEventListener('click',()=>{
      ov.remove();this._initEntities();this._updateHUD();this.over=false;this.running=true;this._loop()
    })
  }
  _showVictory(){
    if (window.playMusicTrack) window.playMusicTrack('ambient');
    this.over=true;this.running=false
    window.removeEventListener('keydown',this._kd);window.removeEventListener('keyup',this._ku)
    if(window.fireworks) window.fireworks.launch()
    const ov=document.createElement('div')
    ov.style.cssText='position:absolute;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Minecrafter,monospace;text-align:center;padding:24px;'
    ov.innerHTML=`
      <div id="l3vp" style="opacity:0;transform:scale(0.8);">
        <div style="font-size:0.5rem;letter-spacing:0.35em;color:#cc88ff;margin-bottom:10px;">DRAGON DEFEATED</div>
        <h1 style="font-size:clamp(1.8rem,5vw,3.2rem);margin:0 0 10px;line-height:1.2;background:linear-gradient(135deg,#ffffff,#cc88ff,#ff88cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">YOU DID IT, SHONA!</h1>
        <p style="font-size:clamp(0.6rem,2vw,0.85rem);color:rgba(255,255,255,0.8);letter-spacing:0.08em;line-height:1.9;margin:0 0 28px;max-width:480px;">
          THE DRAGON IS DEFEATED!<br>THE SPELL IS BROKEN...<br><br>
          <span style="color:#ff88cc;">NOW THE HEART CAN FINALLY BE WHOLE AGAIN. 💕</span>
        </p>
        <button id="l3vicBtn" style="font-family:Minecrafter,monospace;font-size:0.72rem;letter-spacing:0.18em;padding:15px 44px;background:linear-gradient(135deg,#1a0035,#33006b);border:2px solid #cc44ff;border-top-color:#ee88ff;border-bottom:4px solid #110022;border-radius:4px;color:#ee88ff;cursor:pointer;box-shadow:0 0 28px rgba(180,50,255,0.5);">COLLECT REWARD</button>
      </div>
    `
    this.container.appendChild(ov)
    gsap.to('#l3vp',{opacity:1,scale:1,duration:0.9,ease:'back.out(1.5)',delay:0.4})
    document.getElementById('l3vicBtn').addEventListener('click',()=>{
      gsap.to(ov,{opacity:0,duration:0.6,onComplete:()=>{ov.remove();this._showFinalReward()}})
    })
  }
  _showFinalReward(){
    const P=20
    const c=(bg)=>`<div style="width:${P}px;height:${P}px;background:${bg};${bg==='transparent'?'':'box-shadow:inset -2px -2px 0 #880000,inset 2px 2px 0 rgba(255,150,160,0.5);'}"></div>`
    const LR=[['transparent','#330000','#330000','transparent'],['#330000','#ff5566','#ff5566','#330000'],['#330000','#ff5566','#ff5566','#ff5566'],['#330000','#ff5566','#cc0000','#cc0000'],['transparent','#330000','#cc0000','#cc0000'],['transparent','transparent','#330000','#cc0000'],['transparent','transparent','transparent','#330000']]
    const RR=[['transparent','#330000','#330000','transparent'],['#330000','#cc0000','#cc0000','#330000'],['#cc0000','#cc0000','#cc0000','#330000'],['#cc0000','#cc0000','#cc0000','#330000'],['#cc0000','#cc0000','#330000','transparent'],['#cc0000','#330000','transparent','transparent'],['#330000','transparent','transparent','transparent']]
    const grid=(rows)=>`<div style="display:grid;grid-template-columns:repeat(4,${P}px);gap:0px;">${rows.map(r=>r.map(bg=>c(bg)).join('')).join('')}</div>`
    
    const reward=document.createElement('div')
    reward.id = 'l3rewardOverlay'
    reward.style.cssText='position:absolute;inset:0;z-index:70;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,#08001a,#000);font-family:Minecrafter,monospace;text-align:center;padding:24px;'
    
    reward.innerHTML=`
      <div id="l3flash" style="position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:100;"></div>
      <div id="l3rc" style="opacity:0; display:flex; flex-direction:column; align-items:center; position:relative; z-index:10;">
        <div id="l3title" style="font-size:0.5rem;letter-spacing:0.35em;color:#ffcc44;margin-bottom:24px;">THE FINAL PIECES</div>
        
        <div id="l3hj" style="display:flex;align-items:center;justify-content:center;margin-bottom:30px;position:relative;">
          <div id="l3lh" style="transform:translateX(-100px); filter:drop-shadow(0 0 16px rgba(220,0,0,0.9));">${grid(LR)}</div>
          <div id="l3rh" style="transform:translateX(100px); filter:drop-shadow(0 0 16px rgba(220,0,0,0.9));">${grid(RR)}</div>
        </div>

        <div id="l3fh" style="position:absolute;top:30px;font-size:6.5rem;display:none;opacity:0;filter:drop-shadow(0 0 28px rgba(255,50,80,1)) drop-shadow(0 0 55px rgba(255,0,50,0.55));animation:l3hb 0.9s ease-in-out infinite;">❤</div>

        <div id="l3q-container" style="display:flex;flex-direction:column;align-items:center;max-width:500px;width:100%;">
          <p style="font-size:clamp(0.65rem,2vw,0.85rem);color:#fff;line-height:2;text-shadow:0 0 10px #ff88cc;margin-bottom:15px;text-transform:uppercase;">
            WILL YOU MARRY ME BABE ? 💕<br>
            <span style="font-size:0.55rem;color:#ffccaa;">SO WRITE IT DOWN HOW MUCH YOU LOVE ME</span>
          </p>
          <textarea id="l3loveText" rows="3" placeholder="Type here..." style="width:100%;max-width:400px;background:rgba(20,0,20,0.6);border:2px solid #cc44ff;border-radius:6px;color:#fff;padding:12px;font-family:inherit;font-size:0.75rem;resize:none;margin-bottom:15px;outline:none;box-shadow:inset 0 0 10px rgba(0,0,0,0.8), 0 0 15px rgba(200,50,255,0.4);"></textarea>
          <button id="l3submitLove" style="font-family:Minecrafter,monospace;font-size:0.7rem;letter-spacing:0.18em;padding:12px 36px;background:linear-gradient(135deg,#1a0035,#33006b);border:2px solid #cc44ff;border-top-color:#ee88ff;border-bottom:4px solid #110022;border-radius:4px;color:#ee88ff;cursor:pointer;box-shadow:0 0 28px rgba(180,50,255,0.5);">ENTER</button>
        </div>
      </div>
    `
    this.container.appendChild(reward)
    
    if(!document.getElementById('l3hbStyle')){
      const st=document.createElement('style');
      st.id='l3hbStyle';
      st.textContent='@keyframes l3hb{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}';
      document.head.appendChild(st)
    }

    gsap.to('#l3rc',{opacity:1,duration:0.8})

    const loveText = document.getElementById('l3loveText')
    
    // Prevent game's global keydown listeners from eating the Spacebar press
    loveText.addEventListener('keydown', (e) => {
      e.stopPropagation()
    })

    document.getElementById('l3submitLove').addEventListener('click', () => {
      const txt = document.getElementById('l3loveText').value.trim()
      if (!txt) return // Require input
      
      // Save answer globally or just proceed
      window.loveAnswer = txt;

      const blasterSound = new Audio('/gaster_blaster_sound_effect_1.mp3');
      blasterSound.play().catch(()=>{});

      gsap.to('#l3q-container', {opacity: 0, duration: 0.4, onComplete: () => {
        document.getElementById('l3q-container').style.display = 'none'
        
        // Shaking boom light animation
        gsap.to(reward, {
          x: () => (Math.random() - 0.5) * 25,
          y: () => (Math.random() - 0.5) * 25,
          duration: 0.05,
          repeat: 40, // 2 seconds of shaking
          yoyo: true,
          onComplete: () => gsap.set(reward, {x:0, y:0})
        })
        
        gsap.to('#l3flash', {
          opacity: 0.8,
          duration: 0.08,
          repeat: 24, // Rapid flashing
          yoyo: true
        })

        // Move halves together
        gsap.to('#l3lh', {x: 0, duration: 2, ease: 'power2.inOut'})
        gsap.to('#l3rh', {x: 0, duration: 2, ease: 'power2.inOut', onComplete: () => {
          // Stop the blaster sound
          blasterSound.pause();
          
          // Stop all background music
          const am = document.getElementById('ambientMusic');
          const bm = document.getElementById('battleMusic');
          if (am) am.pause();
          if (bm) bm.pause();

          // Final huge flash
          gsap.to('#l3flash', {opacity: 1, duration: 0.1, yoyo: true, repeat: 1, onComplete: () => {
            // Trigger transition immediately after the final flash finishes
            gsap.to(this.container, {opacity: 0, duration: 0.5, onComplete: () => {
              this.container.style.display = 'none';
              
              const finalSlide = document.getElementById('final-slide');
              finalSlide.style.display = 'flex';
              
              document.getElementById('finalUserAnswer')?.innerText || '';
              
              gsap.to(finalSlide, {opacity: 1, duration: 0.5, onComplete: async () => {
                if (window.initFinalSlide) window.initFinalSlide();
              }});
            }});
          }})
          
          if(window.fireworks) window.fireworks.launch()
          
          document.getElementById('l3hj').style.display = 'none'
          
          const fh = document.getElementById('l3fh')
          fh.style.display = 'block'
          gsap.fromTo(fh, {scale:0, opacity:0}, {scale:1, opacity:1, duration: 1, ease:'elastic.out(1, 0.5)'})

          document.getElementById('l3title').textContent = "HEART REUNITED"
        }})
      }})
    })
  }
}
