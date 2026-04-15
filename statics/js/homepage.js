const hover = document.querySelector(".hover");

const NUM_POINTS = 10;
const points = Array.from({ length: NUM_POINTS }, () => ({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  size: 0,
}));

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastMouseX = mouseX;
let lastMouseY = mouseY;
let currentVelocity = 0;
let isActive = false;
let isResting = true;
let restTimeout = null;

document.addEventListener("mousemove", (e) => {
  if (!isActive && isResting) {
    points.forEach((pt) => {
      pt.x = e.clientX;
      pt.y = e.clientY;
    });
  }

  mouseX = e.clientX;
  mouseY = e.clientY;
  isActive = true;
  isResting = false;

  clearTimeout(restTimeout);
  restTimeout = setTimeout(() => {
    isResting = true;
  }, 100);
});

document.addEventListener("mouseleave", () => {
  isActive = false;
});

function animate() {
  let maskList = [];
  let isAnyVisible = false;
  const dx = mouseX - lastMouseX;
  const dy = mouseY - lastMouseY;
  const dist = Math.hypot(dx, dy);
  
  currentVelocity += (dist - currentVelocity) * 0.15;
  
  lastMouseX = mouseX;
  lastMouseY = mouseY;

  const velocityScale = 1 + Math.min(currentVelocity * 0.05, 1.5);

  for (let i = 0; i < NUM_POINTS; i++) {
    const pt = points[i];
    
    const targetX = i === 0 ? mouseX : points[i - 1].x;
    const targetY = i === 0 ? mouseY : points[i - 1].y;
    
    const ease = 0.35 + (i * 0.05);
    pt.x += (targetX - pt.x) * ease;
    pt.y += (targetY - pt.y) * ease;
    
    const targetSize = (isActive && !isResting) ? (140 - (i * 12)) * velocityScale : 0;
    
    const sizeEase = i === 0 ? 0.15 : 0.2;
    pt.size += (targetSize - pt.size) * sizeEase;

    if (pt.size > 2) {
      isAnyVisible = true;
      const alpha = Math.min((pt.size / (140 * 2.5)) * 1.5, 1).toFixed(2);
      maskList.push(`radial-gradient(circle ${pt.size.toFixed(1)}px at ${pt.x.toFixed(1)}px ${pt.y.toFixed(1)}px, rgba(0,0,0,${alpha}) 0%, transparent 80%)`);
    }
  }

  if (isAnyVisible) {
    const maskStr = maskList.join(", ");
    hover.style.maskImage = maskStr;
    hover.style.webkitMaskImage = maskStr;
  } else {
    hover.style.maskImage = "radial-gradient(circle 0px at 0 0, transparent 100%, transparent 100%)";
    hover.style.webkitMaskImage = "radial-gradient(circle 0px at 0 0, transparent 100%, transparent 100%)";
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);