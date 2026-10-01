export function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotSpeed: number;
    alpha: number;
  }> = [];

  const colors = ['#00f0ff', '#8b5cf6', '#ec4899', '#38bdf8', '#34d399', '#facc15'];

  for (let i = 0; i < 75; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 300,
      y: canvas.height * 0.45,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 14,
      speedY: (Math.random() - 0.7) * 16,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      alpha: 1,
    });
  }

  let animationFrame: number;
  const startTime = Date.now();

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = Date.now() - startTime;
    let alive = false;

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.4; // gravity
      p.rotation += p.rotSpeed;
      p.alpha = Math.max(0, 1 - elapsed / 2500);

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive && elapsed < 2800) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  animate();
}
