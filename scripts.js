(() => {
  "use strict";

  if (window.location.pathname.endsWith("/index.html")) {
    const normalizedPath = window.location.pathname.replace(/index\.html$/, "");
    const targetPath = normalizedPath || "/";
    window.history.replaceState({}, "", `${targetPath}${window.location.search}${window.location.hash}`);
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const canvas = document.getElementById("fern-canvas");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    start: performance.now(),
    pointer: null,
    rachis: [],
    branches: []
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    state.width = Math.max(1, Math.floor(rect.width));
    state.height = Math.max(1, Math.floor(rect.height));
    state.dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildMotif();
  };

  const unit = (x, y) => {
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  };

  const quadraticPoint = (start, control, end, t) => {
    const inverse = 1 - t;
    return {
      x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
      y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y
    };
  };

  const pointOnRachis = (t) => {
    const w = state.width;
    const h = state.height;
    const base = { x: w * 0.27, y: h * 0.84 };
    const tip = { x: w * 0.66, y: h * 0.17 };
    const arc = Math.sin(t * Math.PI);
    const lean = t * t * w * 0.035;

    return {
      x: lerp(base.x, tip.x, t) - arc * w * 0.16 + lean,
      y: lerp(base.y, tip.y, t) + arc * h * 0.075
    };
  };

  const buildMotif = () => {
    const w = state.width;
    const h = state.height;
    state.rachis = [];
    state.branches = [];

    for (let i = 0; i <= 144; i += 1) {
      const t = i / 144;
      state.rachis.push({ ...pointOnRachis(t), t });
    }

    const tip = pointOnRachis(1);
    const curlR = Math.min(w, h) * 0.072;
    const curlCx = tip.x + w * 0.022;
    const curlCy = tip.y + h * 0.028;

    for (let i = 1; i <= 34; i += 1) {
      const t = i / 34;
      const angle = Math.PI * 0.2 + t * Math.PI * 1.72;
      const radius = curlR * (1 - t * 0.64);
      state.rachis.push({
        x: curlCx + Math.cos(angle) * radius,
        y: curlCy + Math.sin(angle) * radius,
        t: 1 + t * 0.16
      });
    }

    for (let index = 0; index < 17; index += 1) {
      const t = 0.14 + index * 0.043;
      const fullness = Math.sin(clamp((t - 0.08) / 0.82, 0, 1) * Math.PI);
      const side = index % 2 === 0 ? -1 : 1;
      const root = pointOnRachis(t);
      const length = w * (0.12 + fullness * 0.17) * (1 - t * 0.18);
      const tilt = lerp(0.26, -0.42, t);
      const angle = side === 1 ? tilt : Math.PI - tilt;
      const direction = unit(Math.cos(angle), Math.sin(angle));
      const curve = unit(direction.x * 0.88 + side * 0.18, direction.y - 0.24 * t);
      const control = {
        x: root.x + direction.x * length * 0.48 + side * w * 0.018,
        y: root.y + direction.y * length * 0.48 - h * 0.025 * fullness
      };
      const end = {
        x: root.x + curve.x * length,
        y: root.y + curve.y * length
      };
      const axis = [];
      const pinnules = [];
      const pinnuleCount = Math.round(5 + fullness * 5);

      for (let axisIndex = 0; axisIndex <= 34; axisIndex += 1) {
        const axisT = axisIndex / 34;
        axis.push({ ...quadraticPoint(root, control, end, axisT), t: axisT });
      }

      for (let childIndex = 0; childIndex < pinnuleCount; childIndex += 1) {
        const branchT = 0.2 + childIndex * (0.62 / Math.max(pinnuleCount - 1, 1));
        const base = quadraticPoint(root, control, end, branchT);
        const next = quadraticPoint(root, control, end, clamp(branchT + 0.03, 0, 1));
        const tangent = unit(next.x - base.x, next.y - base.y);
        const veinSide = childIndex % 2 === 0 ? -1 : 1;
        const normal = unit(-tangent.y * veinSide, tangent.x * veinSide);
        const taper = Math.sin(branchT * Math.PI);
        const leafletDirection = unit(tangent.x * 0.46 + normal.x, tangent.y * 0.46 + normal.y);

        pinnules.push({
          base,
          direction: leafletDirection,
          phase: index * 0.62 + childIndex * 0.47,
          t: branchT,
          width: Math.max(2.1, Math.min(w, h) * (0.005 + taper * 0.004)),
          length: Math.min(w, h) * (0.022 + taper * 0.018) * (0.9 + fullness * 0.12)
        });
      }

      state.branches.push({
        axis,
        end,
        phase: index * 0.54,
        pinnules,
        root,
        t
      });
    }
  };

  const pointWithMotion = (point, phase, amount, timestamp) => {
    const ambient = prefersReducedMotion ? 0 : Math.sin(timestamp / 2400 + phase) * amount;
    let pointerShiftX = 0;
    let pointerShiftY = 0;
    if (state.pointer) {
      const dx = point.x - state.pointer.x;
      const dy = point.y - state.pointer.y;
      const dist = Math.hypot(dx, dy);
      const influence = clamp(1 - dist / 150, 0, 1);
      pointerShiftX = (dx / Math.max(dist, 1)) * influence * 8;
      pointerShiftY = (dy / Math.max(dist, 1)) * influence * 5;
    }
    return {
      x: point.x + ambient + pointerShiftX,
      y: point.y + Math.sin(timestamp / 3100 + phase) * amount * 0.35 + pointerShiftY
    };
  };

  const drawPathSegment = (points, progress) => {
    const count = Math.floor(points.length * clamp(progress, 0, 1));
    if (count < 2) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < count; i += 1) {
      const previous = points[i - 1];
      const current = points[i];
      ctx.quadraticCurveTo(previous.x, previous.y, (previous.x + current.x) / 2, (previous.y + current.y) / 2);
    }
    ctx.stroke();
  };

  const drawLeaflet = (leaflet, progress, timestamp) => {
    const reveal = clamp(progress, 0, 1);
    if (reveal <= 0) {
      return;
    }
    const base = pointWithMotion(leaflet.base, leaflet.phase, 1.8, timestamp);
    const tip = {
      x: base.x + leaflet.direction.x * leaflet.length * reveal,
      y: base.y + leaflet.direction.y * leaflet.length * reveal
    };
    const side = unit(-leaflet.direction.y, leaflet.direction.x);
    const width = leaflet.width * Math.sin(reveal * Math.PI * 0.5);
    const shoulder = {
      x: base.x + leaflet.direction.x * leaflet.length * 0.42 * reveal,
      y: base.y + leaflet.direction.y * leaflet.length * 0.42 * reveal
    };

    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.quadraticCurveTo(
      shoulder.x + side.x * width,
      shoulder.y + side.y * width,
      tip.x,
      tip.y
    );
    ctx.quadraticCurveTo(
      shoulder.x - side.x * width * 0.72,
      shoulder.y - side.y * width * 0.72,
      base.x,
      base.y
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawBranch = (branch, progress, timestamp) => {
    const localProgress = clamp((progress - branch.t * 0.62) / 0.3, 0, 1);
    if (localProgress <= 0) {
      return;
    }
    const axis = branch.axis.map((point, index) => {
      const amount = 1.4 + point.t * 3.2;
      return pointWithMotion(point, branch.phase + index * 0.08, amount, timestamp);
    });
    axis[0] = branch.root;

    ctx.lineWidth = 1.35;
    drawPathSegment(axis, localProgress);

    ctx.lineWidth = 0.85;
    branch.pinnules.forEach((leaflet) => {
      const leafletProgress = clamp((localProgress - leaflet.t * 0.72) / 0.22, 0, 1);
      drawLeaflet(leaflet, leafletProgress, timestamp);
    });

    if (localProgress > 0.94) {
      const end = pointWithMotion(branch.end, branch.phase + 1.2, 4.2, timestamp);
      const pulse = prefersReducedMotion ? 0.55 : 0.55 + Math.sin(timestamp / 1300 + branch.phase) * 0.18;
      ctx.globalAlpha = clamp(pulse, 0.25, 0.85);
      ctx.beginPath();
      ctx.arc(end.x, end.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  };

  const draw = (timestamp) => {
    const elapsed = timestamp - state.start;
    const progress = prefersReducedMotion ? 1 : clamp(elapsed / 3200, 0, 1);

    ctx.clearRect(0, 0, state.width, state.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2f4a35";
    ctx.fillStyle = "rgba(47, 74, 53, 0.16)";
    ctx.lineWidth = 2.1;

    drawPathSegment(state.rachis, progress);

    ctx.strokeStyle = "rgba(47, 74, 53, 0.82)";
    ctx.fillStyle = "rgba(47, 74, 53, 0.18)";
    state.branches.forEach((branch) => drawBranch(branch, progress, timestamp));

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    state.pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  });

  canvas.addEventListener("pointerleave", () => {
    state.pointer = null;
  });

  window.addEventListener("resize", resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();
