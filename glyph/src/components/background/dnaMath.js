/**
 * DNA helix math — particle positions, colors, and star-field targets.
 */

const CYAN = { r: 0, g: 0.95, b: 1 };
const PURPLE = { r: 0.541, g: 0.169, b: 0.886 };
const WHITE = { r: 0.92, g: 0.94, b: 1 };

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return {
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t),
  };
}

function hash(n) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * @param {object} opts
 * @param {number} [opts.turns]
 * @param {number} [opts.pointsPerStrand]
 * @param {number} [opts.radius]
 * @param {number} [opts.height]
 * @param {number} [opts.bridgeEvery]
 * @param {number} [opts.auraCount]
 */
export function createDnaGeometry({
  turns = 4.2,
  pointsPerStrand = 1400,
  radius = 1.15,
  height = 7.5,
  bridgeEvery = 7,
  auraCount = 2200,
} = {}) {
  const helixPositions = [];
  const helixColors = [];
  const helixSizes = [];
  const helixPhases = [];
  const starTargets = [];
  const starColors = [];
  const starSizes = [];
  const starPhases = [];

  const totalAngle = turns * Math.PI * 2;

  // Two intertwined strands
  for (let strand = 0; strand < 2; strand++) {
    const phase = strand * Math.PI;
    for (let i = 0; i < pointsPerStrand; i++) {
      const t = i / (pointsPerStrand - 1);
      const angle = t * totalAngle + phase;
      const y = (t - 0.5) * height;

      // Slight radius variation for organic feel
      const rJitter = radius * (0.92 + hash(i * 17 + strand * 91) * 0.16);
      const x = Math.cos(angle) * rJitter;
      const z = Math.sin(angle) * rJitter;

      helixPositions.push(x, y, z);

      // Cyan at bottom → purple at top
      const col = lerpColor(CYAN, PURPLE, t);
      const bright = 0.75 + hash(i + strand * 50) * 0.35;
      helixColors.push(col.r * bright, col.g * bright, col.b * bright);

      helixSizes.push(2.2 + hash(i * 3.1 + strand) * 2.4);
      helixPhases.push(hash(i * 9.7 + strand * 3) * Math.PI * 2);

      // Star-field target — scatter into a calm scientific field
      const theta = hash(i * 2.3 + strand) * Math.PI * 2;
      const phi = Math.acos(2 * hash(i * 5.1 + strand * 7) - 1);
      const dist = 4 + hash(i * 11 + strand) * 14;
      starTargets.push(
        Math.sin(phi) * Math.cos(theta) * dist,
        (hash(i * 13 + strand) - 0.5) * 16,
        Math.sin(phi) * Math.sin(theta) * dist,
      );
      const starMix = hash(i * 19 + strand);
      const sc =
        starMix < 0.35
          ? CYAN
          : starMix < 0.7
            ? PURPLE
            : WHITE;
      const dim = 0.35 + hash(i * 23) * 0.55;
      starColors.push(sc.r * dim, sc.g * dim, sc.b * dim);
      // Keep soft/large like helix — continuous particle weight
      starSizes.push(2.4 + hash(i * 29) * 2.6);
      starPhases.push(hash(i * 31 + strand) * Math.PI * 2);
    }
  }

  // Bridge rungs between strands
  const bridgePositions = [];
  const bridgeColors = [];
  const steps = Math.floor(pointsPerStrand / bridgeEvery);

  for (let s = 0; s < steps; s++) {
    const i = s * bridgeEvery;
    if (i >= pointsPerStrand) break;
    const t = i / (pointsPerStrand - 1);
    const angle = t * totalAngle;
    const y = (t - 0.5) * height;
    const r = radius * 0.95;

    const ax = Math.cos(angle) * r;
    const az = Math.sin(angle) * r;
    const bx = Math.cos(angle + Math.PI) * r;
    const bz = Math.sin(angle + Math.PI) * r;

    // Subdivide bridge into glowing points
    const segs = 6;
    for (let k = 0; k <= segs; k++) {
      const u = k / segs;
      const x = lerp(ax, bx, u);
      const z = lerp(az, bz, u);
      helixPositions.push(x, y, z);

      const col = lerpColor(CYAN, PURPLE, t);
      const midBoost = 1 - Math.abs(u - 0.5) * 0.5;
      helixColors.push(col.r * midBoost, col.g * midBoost, col.b * midBoost);
      helixSizes.push(1.8 + hash(s * 7 + k) * 2.0);
      helixPhases.push(hash(s * 11 + k) * Math.PI * 2);

      const theta = hash(s * 41 + k) * Math.PI * 2;
      const phi = Math.acos(2 * hash(s * 43 + k) - 1);
      const dist = 5 + hash(s * 47 + k) * 12;
      starTargets.push(
        Math.sin(phi) * Math.cos(theta) * dist,
        (hash(s * 53 + k) - 0.5) * 14,
        Math.sin(phi) * Math.sin(theta) * dist,
      );
      const sm = hash(s * 59 + k);
      const sc = sm < 0.5 ? CYAN : PURPLE;
      starColors.push(sc.r * 0.5, sc.g * 0.5, sc.b * 0.5);
      starSizes.push(2.2 + hash(s * 61 + k) * 2.0);
      starPhases.push(hash(s * 67 + k) * Math.PI * 2);
    }

    // Line segments for structural bridges
    bridgePositions.push(ax, y, az, bx, y, bz);
    const bc = lerpColor(CYAN, PURPLE, t);
    bridgeColors.push(bc.r, bc.g, bc.b, bc.r, bc.g, bc.b);
  }

  // Soft aura / vapor cloud around the helix
  for (let i = 0; i < auraCount; i++) {
    const t = hash(i * 3.7);
    const angle = t * totalAngle + hash(i * 2.1) * Math.PI * 2;
    const y = (t - 0.5) * height * (0.7 + hash(i) * 0.4);
    const spread = radius * (1.3 + hash(i * 4.2) * 2.8);
    const x = Math.cos(angle) * spread * (0.4 + hash(i * 6));
    const z = Math.sin(angle) * spread * (0.4 + hash(i * 8));

    helixPositions.push(x, y, z);
    const col = lerpColor(CYAN, PURPLE, t);
    const a = 0.25 + hash(i * 9) * 0.45;
    helixColors.push(col.r * a, col.g * a, col.b * a);
    helixSizes.push(1.8 + hash(i * 11) * 2.2);
    helixPhases.push(hash(i * 13) * Math.PI * 2);

    const theta = hash(i * 71) * Math.PI * 2;
    const phi = Math.acos(2 * hash(i * 73) - 1);
    const dist = 6 + hash(i * 79) * 18;
    starTargets.push(
      Math.sin(phi) * Math.cos(theta) * dist,
      (hash(i * 83) - 0.5) * 18,
      Math.sin(phi) * Math.sin(theta) * dist,
    );
    const sm = hash(i * 89);
    const sc = sm < 0.4 ? CYAN : sm < 0.75 ? PURPLE : WHITE;
    const dim = 0.2 + hash(i * 97) * 0.5;
    starColors.push(sc.r * dim, sc.g * dim, sc.b * dim);
    starSizes.push(2.2 + hash(i * 101) * 2.4);
    starPhases.push(hash(i * 103) * Math.PI * 2);
  }

  const count = helixPositions.length / 3;

  // Organic sphere / cell — denser core, soft outer shell
  const sphereTargets = new Float32Array(count * 3);
  const sphereColors = new Float32Array(count * 3);
  const sphereSizes = new Float32Array(count);
  const sphereRadius = 2.65;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Fibonacci sphere + radial depth for fuzzy cell look
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    const coreBias = hash(i * 17.3);
    // ~40% pulled toward center for dense nucleus
    const depth =
      coreBias < 0.38
        ? 0.08 + hash(i * 19.1) * 0.45
        : 0.72 + hash(i * 23.7) * 0.28;
    const jitter = 0.92 + hash(i * 29) * 0.16;
    const r = sphereRadius * depth * jitter * (0.85 + radiusAtY * 0.15);

    sphereTargets[i3] = Math.cos(theta) * radiusAtY * r;
    sphereTargets[i3 + 1] = y * sphereRadius * depth * jitter;
    sphereTargets[i3 + 2] = Math.sin(theta) * radiusAtY * r;

    // Darker core → mid grey shell (readable on white)
    const shade = 0.05 + depth * 0.28;
    sphereColors[i3] = shade;
    sphereColors[i3 + 1] = shade;
    sphereColors[i3 + 2] = shade + 0.015;
    // Same visual weight as star field — only position morphs (usta-smooth)
    sphereSizes[i] = starSizes[i];
  }

  return {
    count,
    helixPositions: new Float32Array(helixPositions),
    helixColors: new Float32Array(helixColors),
    helixSizes: new Float32Array(helixSizes),
    helixPhases: new Float32Array(helixPhases),
    starTargets: new Float32Array(starTargets),
    starColors: new Float32Array(starColors),
    starSizes: new Float32Array(starSizes),
    starPhases: new Float32Array(starPhases),
    sphereTargets,
    sphereColors,
    sphereSizes,
    bridgePositions: new Float32Array(bridgePositions),
    bridgeColors: new Float32Array(bridgeColors),
  };
}

export { lerp, lerpColor, CYAN, PURPLE };
