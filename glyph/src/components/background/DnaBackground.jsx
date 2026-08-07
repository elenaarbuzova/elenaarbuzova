import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createDnaGeometry, lerp } from './dnaMath';
import './DnaBackground.css';

gsap.registerPlugin(ScrollTrigger);

const POINT_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScrollVel;
  uniform float uOrbitAngle;

  void main() {
    vColor = color;
    vec3 pos = position;

    // Soft scroll twist — no thinning squash/stretch
    float speed = clamp(abs(uScrollVel) * 0.001, 0.0, 1.2);
    float twist = (uOrbitAngle * 0.22 + uScrollVel * 0.00028) * (0.4 + aPhase * 0.06);
    float cy = cos(pos.y * 0.28 * twist);
    float sy = sin(pos.y * 0.28 * twist);
    float tx = pos.x * cy - pos.z * sy;
    float tz = pos.x * sy + pos.z * cy;
    pos.x = tx;
    pos.z = tz;

    float twinkle = 0.92 + 0.08 * sin(uTime * 1.0 + aPhase);
    vAlpha = twinkle;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // Stable attenuation — avoid particles looking skinny when they move deeper
    float distAtten = clamp(14.0 / max(-mvPosition.z, 4.0), 0.85, 2.8);
    gl_PointSize = aSize * uPixelRatio * distAtten * twinkle;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const POINT_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.1, d);
    float soft = smoothstep(0.5, 0.0, d) * 0.35;
    float alpha = (core + soft) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp01(v) {
  return Math.min(Math.max(v, 0), 1);
}

function damp(current, target, lambda, dt) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

/** Remap cyan/purple palette → charcoal + coral accents for light landing */
function applyLightPalette(helixColors, starColors, helixPhases, count) {
  const charcoal = { r: 0.12, g: 0.12, b: 0.14 };
  const mid = { r: 0.28, g: 0.28, b: 0.3 };
  const coral = { r: 1, g: 0.32, b: 0.18 };
  const orange = { r: 1, g: 0.55, b: 0.22 };

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const accent = (helixPhases[i] / (Math.PI * 2)) % 1 > 0.9;
    if (accent) {
      const a = helixPhases[i] > Math.PI ? coral : orange;
      helixColors[i3] = a.r;
      helixColors[i3 + 1] = a.g;
      helixColors[i3 + 2] = a.b;
    } else {
      const u = (i % 200) / 200;
      helixColors[i3] = lerp(charcoal.r, mid.r, u);
      helixColors[i3 + 1] = lerp(charcoal.g, mid.g, u);
      helixColors[i3 + 2] = lerp(charcoal.b, mid.b, u);
    }
    const g = 0.9 + (i % 40) / 400;
    starColors[i3] = g;
    starColors[i3 + 1] = g;
    starColors[i3 + 2] = g + 0.015;
  }
}

/** Shared scroll / pointer / morph state (mutated, read in useFrame). */
function createScrollState() {
  return {
    progress: 0,
    velocity: 0,
    orbitY: 0,
    orbitX: 0,
    orbitZ: 0,
    camAngle: 0,
    dissolveTarget: 0,
    gatherTarget: 0,
    networkTarget: 0,
    networkMode: 'testimonials',
    mouse: { x: 0, y: 0 },
  };
}

/**
 * GSAP ScrollTrigger scrub → orbital rotation + dissolve/gather phases.
 */
function ScrollOrbitDriver({ scrollTarget, reasonsTarget, state }) {
  const { gl } = useThree();

  useEffect(() => {
    const triggerEl =
      scrollTarget?.current ?? document.documentElement;

    const proxy = {
      progress: 0,
      rotY: 0,
      rotX: 0,
      rotZ: 0,
      camAngle: 0,
    };

    let lastProgress = 0;
    let lastTime = performance.now();

    const syncPhases = () => {
      const y = window.scrollY || 0;
      const heroH = Math.max(window.innerHeight * 0.85, 1);
      const vh = window.innerHeight;
      state.dissolveTarget = clamp01(y / (heroH * 1.15));

      // Never gather into a sphere — keep free stars that explode/scatter on scroll
      state.gatherTarget = 0;

      // At #how, push into a fully scattered free star field
      let release = 0;
      const how = document.getElementById('how');
      if (how) {
        const rect = how.getBoundingClientRect();
        const start = vh * 0.92;
        const end = vh * 0.38;
        release = clamp01((start - rect.top) / (start - end));
      }

      // No heart / network morph — free light stars
      state.networkTarget = 0;
      state.networkMode = 'testimonials';

      // Stay as exploding/scattered stars (not helix) once past hero or into #how
      if (release > 0.02 || state.dissolveTarget > 0.55) {
        state.dissolveTarget = Math.max(state.dissolveTarget, 0.98);
      }
    };

    const tween = gsap.to(proxy, {
      progress: 1,
      rotY: Math.PI * 2.15,
      rotX: 0.55,
      rotZ: 0.32,
      camAngle: Math.PI * 1.65,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const now = performance.now();
          const dt = Math.max((now - lastTime) / 1000, 0.001);
          const p = proxy.progress;
          // Blend ScrollTrigger velocity with progress delta for stable shader input
          const stVel = self.getVelocity();
          const progVel = ((p - lastProgress) / dt) * 900;
          state.velocity = THREE.MathUtils.clamp(
            stVel * 0.55 + progVel * 0.45,
            -2400,
            2400,
          );
          lastProgress = p;
          lastTime = now;

          state.progress = p;
          state.orbitY = proxy.rotY;
          // Dynamic arc: not flat horizontal — sin-shaped pitch + roll
          state.orbitX = Math.sin(p * Math.PI) * proxy.rotX * 0.85;
          state.orbitZ =
            Math.sin(p * Math.PI * 2) * proxy.rotZ * 0.55 +
            Math.cos(p * Math.PI) * 0.08;
          state.camAngle = proxy.camAngle;
          syncPhases();
        },
      },
    });

    const onPointerMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      state.mouse.x = (e.clientX / w) * 2 - 1;
      state.mouse.y = -(e.clientY / h) * 2 + 1;
    };

    const onScrollFallback = () => syncPhases();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScrollFallback, { passive: true });
    syncPhases();
    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScrollFallback);
    };
  }, [scrollTarget, reasonsTarget, state, gl]);

  return null;
}

function DustField({ light, gatherRef, blend }) {
  const pointsRef = useRef(null);
  const dustCount = light ? 180 : 400;

  const { positions, colors } = useMemo(() => {
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 40;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      if (light) {
        const g = 0.72 + Math.random() * 0.12;
        dustCol[i * 3] = g;
        dustCol[i * 3 + 1] = g;
        dustCol[i * 3 + 2] = g;
      } else {
        const c = Math.random();
        if (c < 0.4) {
          dustCol[i * 3] = 0;
          dustCol[i * 3 + 1] = 0.85;
          dustCol[i * 3 + 2] = 1;
        } else if (c < 0.75) {
          dustCol[i * 3] = 0.54;
          dustCol[i * 3 + 1] = 0.17;
          dustCol[i * 3 + 2] = 0.89;
        } else {
          dustCol[i * 3] = 1;
          dustCol[i * 3 + 1] = 0.72;
          dustCol[i * 3 + 2] = 0.35;
        }
      }
    }
    return { positions: dustPos, colors: dustCol };
  }, [dustCount, light]);

  useFrame((frameState, dt) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const gather = gatherRef.current;
    pts.material.opacity = (light ? 0.35 : 0.55) * (1 - gather * 0.92);
    pts.visible = pts.material.opacity > 0.02;
    pts.rotation.y += dt * 0.006;
    const attr = pts.geometry.getAttribute('position');
    const now = frameState.clock.elapsedTime * 1000;
    for (let i = 0; i < dustCount; i++) {
      attr.array[i * 3 + 1] += Math.sin(now * 0.00015 + i) * 0.001;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={light ? 0.03 : 0.04}
        vertexColors
        transparent
        opacity={light ? 0.35 : 0.55}
        depthWrite={false}
        blending={blend}
        sizeAttenuation
      />
    </points>
  );
}

function DnaCloud({ light, state, onGatherChange }) {
  const groupRef = useRef(null);
  const pointsRef = useRef(null);
  const bridgesRef = useRef(null);
  const gatherRef = useRef(0);
  const gatherCb = useRef(onGatherChange);
  gatherCb.current = onGatherChange;

  const { camera, gl } = useThree();

  const geo = useMemo(() => {
    const g = createDnaGeometry();
    if (light) {
      applyLightPalette(g.helixColors, g.starColors, g.helixPhases, g.count);
      for (let i = 0; i < g.bridgeColors.length; i += 3) {
        const accent = (i / 3) % 5 === 0;
        if (accent) {
          g.bridgeColors[i] = 1;
          g.bridgeColors[i + 1] = 0.35;
          g.bridgeColors[i + 2] = 0.18;
        } else {
          g.bridgeColors[i] = 0.2;
          g.bridgeColors[i + 1] = 0.2;
          g.bridgeColors[i + 2] = 0.22;
        }
      }
    }
    return g;
  }, [light]);

  const buffers = useMemo(() => {
    const count = geo.count;
    return {
      currentPos: new Float32Array(geo.helixPositions),
      currentCol: new Float32Array(geo.helixColors),
      currentSize: new Float32Array(geo.helixSizes),
      bridgePos: geo.bridgePositions.slice(),
      bridgeOrig: geo.bridgePositions.slice(),
      count,
    };
  }, [geo]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
      uScrollVel: { value: 0 },
      uOrbitAngle: { value: 0 },
    }),
    [],
  );

  const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
  const spinSpeed = light ? 0.045 : 0.18;

  const smooth = useRef({
    mouse: new THREE.Vector2(0, 0),
    dissolve: 0,
    gather: 0,
    network: 0,
    rotX: 0,
    rotY: 0,
    orbitY: 0,
    orbitX: 0,
    orbitZ: 0,
    velocity: 0,
    lastGatherEmit: -1,
    idleY: 0,
  });

  const mouseNdc = useMemo(() => new THREE.Vector2(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const dnaWorld = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);
  const groupQuat = useMemo(() => new THREE.Quaternion(), []);
  useEffect(() => {
    const onResize = () => {
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [uniforms]);

  useFrame((frameState, dt) => {
    const group = groupRef.current;
    const points = pointsRef.current;
    const bridges = bridgesRef.current;
    if (!group || !points) return;

    const s = smooth.current;
    const clampedDt = Math.min(dt, 0.05);

    s.mouse.x = damp(s.mouse.x, state.mouse.x, 3.2, clampedDt);
    s.mouse.y = damp(s.mouse.y, state.mouse.y, 3.2, clampedDt);
    s.dissolve = damp(s.dissolve, state.dissolveTarget, 1.8, clampedDt);
    // Slightly softer release so the sphere blooms into drifting stars
    const gatherLambda = state.gatherTarget < s.gather ? 1.05 : 1.2;
    s.gather = damp(s.gather, state.gatherTarget, gatherLambda, clampedDt);
    s.network = damp(s.network, state.networkTarget, 1.35, clampedDt);
    s.orbitY = damp(s.orbitY, state.orbitY, 2.4, clampedDt);
    s.orbitX = damp(s.orbitX, state.orbitX, 2.4, clampedDt);
    s.orbitZ = damp(s.orbitZ, state.orbitZ, 2.4, clampedDt);
    s.velocity = damp(s.velocity, state.velocity, 4.5, clampedDt);

    const dissolve = easeInOutCubic(s.dissolve);
    const gather = easeInOutCubic(s.gather);
    const network = easeInOutCubic(s.network);
    gatherRef.current = gather;
    const helixStrength = 1 - dissolve;

    if (gatherCb.current && Math.abs(gather - s.lastGatherEmit) > 0.01) {
      s.lastGatherEmit = gather;
      gatherCb.current(gather);
    }

    // Mouse tilt (local) — fades as we gather into sphere
    const mouseTiltX = -s.mouse.y * 0.22 * helixStrength * (1 - gather * 0.85);
    const mouseTiltY = s.mouse.x * 0.28 * helixStrength * (1 - gather);

    s.idleY +=
      clampedDt * spinSpeed * helixStrength +
      clampedDt * 0.12 * gather +
      clampedDt * 0.065 * dissolve * (1 - network * 0.85);

    // Orbit from ScrollTrigger + idle spin + mouse parallax
    const netStill = 1 - network * 0.95;
    group.rotation.y = s.idleY + s.orbitY * netStill + mouseTiltY * (1 - network);
    group.rotation.x = s.orbitX * netStill + mouseTiltX * (1 - network);
    group.rotation.z = -0.08 + s.orbitZ * netStill;

    group.position.x = 0;
    group.position.y = lerp(0.05, 0, gather);
    group.position.z = lerp(0, lerp(-0.4, 0.15, gather), dissolve);
    group.scale.setScalar(lerp(1.25, lerp(1.3, 1.42, gather), dissolve));

    // Camera flies an arc while looking at origin (parallax depth)
    const camAngle = damp(
      camera.userData.camAngle ?? 0,
      state.camAngle,
      2.2,
      clampedDt,
    );
    camera.userData.camAngle = camAngle;
    const camR = lerp(12.5, 11.6, gather);
    const arc = 1.35 * (1 - gather * 0.55);
    const camAmp = 0.25 * (1 - gather * 0.7);
    camera.position.x = Math.sin(camAngle) * arc + s.mouse.x * camAmp;
    camera.position.z = Math.cos(camAngle * 0.35) * arc * 0.25 + camR;
    camera.position.y =
      0.1 +
      Math.sin(camAngle * 0.85) * 0.72 * (1 - gather * 0.5) +
      s.mouse.y * 0.15 * (1 - gather * 0.5);
    camera.lookAt(0, 0, 0);

    // Mouse interaction in local particle space (works while group orbits)
    mouseNdc.set(s.mouse.x, s.mouse.y);
    raycaster.setFromCamera(mouseNdc, camera);
    group.getWorldPosition(dnaWorld);
    group.getWorldQuaternion(groupQuat);
    camera.getWorldDirection(camDir);
    plane.setFromNormalAndCoplanarPoint(camDir.negate(), dnaWorld);

    if (raycaster.ray.intersectPlane(plane, hit)) {
      mouseWorld.copy(hit);
      group.worldToLocal(mouseWorld);
    }

    // Helix/star bulge fades into sphere; sphere keeps its own convex hover bump
    const helixBulge = 1.85 * helixStrength * (1 - gather) * (1 - network);
    const sphereBulge = 1.65 * gather * (1 - network);
    const helixBulgeRadius = 2.8;
    const sphereBulgeRadius = 3.4;
    const now = frameState.clock.elapsedTime * 1000;
    const { currentPos, currentCol, currentSize, count } = buffers;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const hx = geo.helixPositions[i3];
      const hy = geo.helixPositions[i3 + 1];
      const hz = geo.helixPositions[i3 + 2];
      const sx = geo.starTargets[i3];
      const sy = geo.starTargets[i3 + 1];
      const sz = geo.starTargets[i3 + 2];
      const cx = geo.sphereTargets[i3];
      const cy = geo.sphereTargets[i3 + 1];
      const cz = geo.sphereTargets[i3 + 2];

      let bx = lerp(hx, sx, dissolve);
      let by = lerp(hy, sy, dissolve);
      let bz = lerp(hz, sz, dissolve);
      bx = lerp(bx, cx, gather);
      by = lerp(by, cy, gather);
      bz = lerp(bz, cz, gather);

      if (helixBulge > 0.01) {
        const dx = bx - mouseWorld.x;
        const dy = by - mouseWorld.y;
        const dz = bz - mouseWorld.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001;
        if (dist < helixBulgeRadius) {
          const influence = Math.pow(1 - dist / helixBulgeRadius, 2);
          const pull = influence * helixBulge * 0.75;
          const push = influence * helixBulge * 1.25;
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;
          bx += (mouseWorld.x - bx) * pull + nx * push * 0.45;
          by += (mouseWorld.y - by) * pull + ny * push * 0.45;
          bz += (mouseWorld.z - bz) * pull + nz * push * 0.3;
        }
      }

      // Soft convex bump on the gathered sphere under the cursor
      let sphereInfluence = 0;
      if (sphereBulge > 0.01) {
        const dx = bx - mouseWorld.x;
        const dy = by - mouseWorld.y;
        const dz = bz - mouseWorld.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001;
        if (dist < sphereBulgeRadius) {
          sphereInfluence = Math.pow(1 - dist / sphereBulgeRadius, 2);
          const radialLen =
            Math.sqrt(bx * bx + by * by + bz * bz) + 0.0001;
          // Push outward along sphere normal → visible 3D bulge
          const bump = sphereInfluence * sphereBulge * 0.72;
          bx += (bx / radialLen) * bump;
          by += (by / radialLen) * bump;
          bz += (bz / radialLen) * bump;
          // Mild pull toward cursor for depth / “press into the ball”
          const pull = sphereInfluence * sphereBulge * 0.28;
          bx += (mouseWorld.x - bx) * pull;
          by += (mouseWorld.y - by) * pull;
          bz += (mouseWorld.z - bz) * pull * 0.65;
        }
      }

      const starDrift = dissolve * (1 - gather) * (1 - network * 0.85);
      if (starDrift > 0.05) {
        const ph = geo.starPhases[i];
        // Freer, wider wander once the sphere has scattered
        const drift = starDrift * (0.1 + 0.14 * starDrift);
        bx += Math.sin(now * 0.00042 + ph) * drift;
        by += Math.cos(now * 0.00032 + ph * 1.3) * drift * 0.85;
        bz += Math.sin(now * 0.00026 + ph * 0.7) * drift * 0.7;
        bx += Math.sin(now * 0.00011 + ph * 2.1) * drift * 0.55;
        by += Math.cos(now * 0.00009 + ph * 1.7) * drift * 0.4;
      }

      if (gather > 0.2 && network < 0.45) {
        const ph = geo.helixPhases[i];
        const breathe = 1 + Math.sin(now * 0.0009 + ph) * 0.018 * gather;
        bx *= breathe;
        by *= breathe;
        bz *= breathe;
      }

      currentPos[i3] = bx;
      currentPos[i3 + 1] = by;
      currentPos[i3 + 2] = bz;

      let cr = lerp(geo.helixColors[i3], geo.starColors[i3], dissolve);
      let cg = lerp(geo.helixColors[i3 + 1], geo.starColors[i3 + 1], dissolve);
      let cb = lerp(geo.helixColors[i3 + 2], geo.starColors[i3 + 2], dissolve);

      // Dark charcoal sphere while gathered — then light again on release
      // Slightly lifted from pure charcoal so the ball reads softer on white
      cr = lerp(cr, Math.min(1, geo.sphereColors[i3] + 0.14), gather);
      cg = lerp(cg, Math.min(1, geo.sphereColors[i3 + 1] + 0.14), gather);
      cb = lerp(cb, Math.min(1, geo.sphereColors[i3 + 2] + 0.14), gather);

      // Light silver free stars after the sphere explodes
      if (dissolve > 0.05) {
        const lift = dissolve * 0.92 * (1 - gather) * (1 - network * 0.85);
        cr = lerp(cr, 0.93, lift);
        cg = lerp(cg, 0.93, lift);
        cb = lerp(cb, 0.94, lift);
      }

      currentCol[i3] = cr;
      currentCol[i3 + 1] = cg;
      currentCol[i3 + 2] = cb;

      // Keep DNA weight stable — no fat→thin pop on dissolve / scroll
      let sz0 = geo.helixSizes[i];
      const starSz = Math.max(geo.starSizes[i], geo.helixSizes[i]);
      const sphereSz = Math.max(geo.sphereSizes[i], starSz);
      sz0 = lerp(sz0, starSz, dissolve * 0.2);
      sz0 = lerp(sz0, sphereSz, gather * 0.1);
      // Compensate when particles scatter farther from camera
      sz0 *= 1 + dissolve * 0.45 * (1 - gather * 0.5);
      if (helixBulge > 0.01) {
        const dx = bx - mouseWorld.x;
        const dy = by - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        if (dist < helixBulgeRadius) {
          const influence = Math.pow(1 - dist / helixBulgeRadius, 2);
          sz0 *= 1 + influence * 1.8;
        }
      }
      if (sphereInfluence > 0.01) {
        sz0 *= 1 + sphereInfluence * 1.35;
      }
      currentSize[i] = sz0;
    }

    const posAttr = points.geometry.getAttribute('position');
    const colAttr = points.geometry.getAttribute('color');
    const sizeAttr = points.geometry.getAttribute('aSize');
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    const mat = points.material;
    mat.uniforms.uTime.value = frameState.clock.elapsedTime;
    mat.uniforms.uScrollVel.value = s.velocity;
    mat.uniforms.uOrbitAngle.value = s.orbitY;
    mat.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);

    if (bridges) {
      bridges.material.opacity = (light ? 0.35 : 0.22) * helixStrength;
      bridges.visible = helixStrength > 0.02;
      if (helixStrength > 0.02) {
        const bridgePosAttr = bridges.geometry.getAttribute('position');
        const orig = buffers.bridgeOrig;
        for (let i = 0; i < orig.length; i += 3) {
          const breathe =
            1 + Math.sin(now * 0.0008 + i * 0.01) * 0.012 * helixStrength;
          bridgePosAttr.array[i] = orig[i] * breathe;
          bridgePosAttr.array[i + 1] = orig[i + 1];
          bridgePosAttr.array[i + 2] = orig[i + 2] * breathe;
        }
        bridgePosAttr.needsUpdate = true;
      }
    }
  });

  return (
    <>
      <group ref={groupRef} position={[0, 0.05, 0]} scale={1.25}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[buffers.currentPos, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[buffers.currentCol, 3]}
            />
            <bufferAttribute
              attach="attributes-aSize"
              args={[buffers.currentSize, 1]}
            />
            <bufferAttribute
              attach="attributes-aPhase"
              args={[geo.helixPhases, 1]}
            />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={POINT_VERT}
            fragmentShader={POINT_FRAG}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={blend}
            vertexColors
          />
        </points>

        <lineSegments ref={bridgesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[buffers.bridgePos, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[geo.bridgeColors, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={light ? 0.35 : 0.22}
            blending={blend}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      <DustField light={light} gatherRef={gatherRef} blend={blend} />
    </>
  );
}

function Scene({
  light,
  scrollTarget,
  reasonsTarget,
  onGatherChange,
  state,
}) {
  return (
    <>
      <ScrollOrbitDriver
        scrollTarget={scrollTarget}
        reasonsTarget={reasonsTarget}
        state={state}
      />
      <DnaCloud
        light={light}
        state={state}
        onGatherChange={onGatherChange}
      />
    </>
  );
}

/**
 * @param {{
 *   scrollTarget?: import('react').RefObject<HTMLElement | null>,
 *   reasonsTarget?: import('react').RefObject<HTMLElement | null>,
 *   theme?: 'light' | 'dark',
 *   onGatherChange?: (t: number) => void,
 * }} props
 */
export function DnaBackground({
  scrollTarget,
  reasonsTarget,
  theme = 'light',
  onGatherChange,
}) {
  const light = theme === 'light';
  const state = useMemo(() => createScrollState(), []);

  return (
    <div
      className={`dna-background ${light ? 'dna-background--light' : ''}`}
      aria-hidden="true"
    >
      {light ? <div className="dna-background__dots" /> : null}
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0.1, 12.5] }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(light ? '#ffffff' : '#05070f', light ? 0 : 1);
        }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Scene
            light={light}
            scrollTarget={scrollTarget}
            reasonsTarget={reasonsTarget}
            onGatherChange={onGatherChange}
            state={state}
          />
        </Suspense>
      </Canvas>
      <div className="dna-background__vignette" />
    </div>
  );
}
