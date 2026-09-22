/* ==========================================================================
   DYNAMIC HTML5 CANVAS CYBER CIRCUIT BACKGROUND
   Simulates glowing microchip tracks, pulsing data nodes, and ambient energy
   ========================================================================== */

(function () {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  let tracks = [];
  let packets = [];
  let mouse = { x: -1000, y: -1000, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initCircuit();
  }

  function initCircuit() {
    nodes = [];
    tracks = [];
    packets = [];

    const nodeCount = Math.floor((width * height) / 45000);
    const cols = Math.floor(width / 140);
    const rows = Math.floor(height / 140);

    // Create grid-aligned circuit nodes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.45) {
          const isAmber = Math.random() > 0.75;
          nodes.push({
            x: c * 140 + 70 + (Math.random() * 40 - 20),
            y: r * 140 + 70 + (Math.random() * 40 - 20),
            radius: isAmber ? 2.5 + Math.random() * 2 : 2 + Math.random() * 1.5,
            isAmber: isAmber,
            pulse: Math.random() * Math.PI,
            pulseSpeed: 0.02 + Math.random() * 0.03
          });
        }
      }
    }

    // Connect nodes with orthogonal / 45-degree circuit tracks
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 190 && Math.random() > 0.4) {
          tracks.push({
            from: nodes[i],
            to: nodes[j],
            isAmber: nodes[i].isAmber && nodes[j].isAmber,
            alpha: 0.12 + Math.random() * 0.15
          });

          // Create animated data packets on tracks
          if (Math.random() > 0.6) {
            packets.push({
              from: nodes[i],
              to: nodes[j],
              progress: Math.random(),
              speed: 0.003 + Math.random() * 0.005,
              isAmber: nodes[i].isAmber || nodes[j].isAmber,
              size: 2.5 + Math.random() * 1.5
            });
          }
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw circuit traces
    for (let i = 0; i < tracks.length; i++) {
      const t = tracks[i];
      ctx.beginPath();
      
      // Cyber orthogonal route
      const midX = t.from.x + (t.to.x - t.from.x) * 0.5;
      ctx.moveTo(t.from.x, t.from.y);
      ctx.lineTo(midX, t.from.y);
      ctx.lineTo(midX, t.to.y);
      ctx.lineTo(t.to.x, t.to.y);

      ctx.strokeStyle = t.isAmber ? `rgba(255, 158, 0, ${t.alpha})` : `rgba(0, 240, 255, ${t.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 2. Draw animated glowing data packets
    for (let i = 0; i < packets.length; i++) {
      const p = packets[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        p.progress = 0;
      }

      // Calculate path position
      const midX = p.from.x + (p.to.x - p.from.x) * 0.5;
      let px, py;

      if (p.progress < 0.33) {
        const segT = p.progress / 0.33;
        px = p.from.x + (midX - p.from.x) * segT;
        py = p.from.y;
      } else if (p.progress < 0.66) {
        const segT = (p.progress - 0.33) / 0.33;
        px = midX;
        py = p.from.y + (p.to.y - p.from.y) * segT;
      } else {
        const segT = (p.progress - 0.66) / 0.34;
        px = midX + (p.to.x - midX) * segT;
        py = p.to.y;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.isAmber ? '#ff9e00' : '#00f0ff';
      ctx.shadowColor = p.isAmber ? '#ff9e00' : '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw circuit nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.pulse += n.pulseSpeed;
      const glowScale = Math.sin(n.pulse) * 0.4 + 0.8;

      ctx.save();
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.isAmber ? `rgba(255, 158, 0, ${glowScale})` : `rgba(0, 240, 255, ${glowScale})`;
      ctx.shadowColor = n.isAmber ? '#ff9e00' : '#00f0ff';
      ctx.shadowBlur = 6 * glowScale;
      ctx.fill();

      // Outer ring for certain nodes
      if (n.radius > 2.8) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = n.isAmber ? 'rgba(255, 158, 0, 0.3)' : 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  resize();
  draw();
})();
