import React, { useRef, useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// ═══════════════════════════════════
// ENERGY ORB - Hero object
// ═══════════════════════════════════
const EnergyOrb: React.FC<{
  chargeProgress: number;
  glowIntensity: number;
  distort: number;
}> = ({ chargeProgress, glowIntensity, distort }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const frame = useCurrentFrame();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x += 0.008;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.025;
      innerRef.current.rotation.z += 0.012;
    }
  });

  const scale = 0.3 + chargeProgress * 0.7;
  const pulse = 1 + Math.sin(frame * 0.15) * 0.05 * chargeProgress;

  return (
    <group scale={[scale * pulse, scale * pulse, scale * pulse]}>
      {/* Outer shell */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 3]} />
        <MeshDistortMaterial
          color="#1a3366"
          emissive="#22aaff"
          emissiveIntensity={glowIntensity * 2}
          metalness={0.3}
          roughness={0.2}
          distort={distort}
          speed={2}
          wireframe
        />
      </mesh>

      {/* Inner core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.7, 2]} />
        <MeshDistortMaterial
          color="#0044aa"
          emissive="#44ddff"
          emissiveIntensity={glowIntensity * 4}
          metalness={0.1}
          roughness={0.1}
          distort={distort * 0.5}
          speed={3}
        />
      </mesh>

      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial
          color="#88eeff"
          transparent
          opacity={0.6 * chargeProgress}
        />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════
// PORTAL RINGS
// ═══════════════════════════════════
const PortalRings: React.FC<{
  visible: number;
  intensity: number;
}> = ({ visible, intensity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frame = useCurrentFrame();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.008;
    }
  });

  const rings = useMemo(() => {
    return [
      { radius: 1.8, tube: 0.02, color: "#ff6633", speed: 1, tiltX: 0.3, tiltY: 0.1 },
      { radius: 2.1, tube: 0.015, color: "#ff9944", speed: -0.7, tiltX: -0.2, tiltY: 0.4 },
      { radius: 2.5, tube: 0.025, color: "#ffbb33", speed: 0.5, tiltX: 0.1, tiltY: -0.3 },
      { radius: 1.5, tube: 0.01, color: "#44ccff", speed: -1.2, tiltX: -0.4, tiltY: 0.2 },
    ];
  }, []);

  return (
    <group ref={groupRef} scale={[visible, visible, visible]}>
      {rings.map((ring, i) => {
        const rot = frame * ring.speed * 0.03;
        return (
          <mesh
            key={i}
            rotation={[ring.tiltX + rot * 0.3, ring.tiltY + rot, rot * 0.5]}
          >
            <torusGeometry args={[ring.radius, ring.tube, 16, 100]} />
            <meshStandardMaterial
              color={ring.color}
              emissive={ring.color}
              emissiveIntensity={intensity * 3}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ═══════════════════════════════════
// ORBITING PARTICLES
// ═══════════════════════════════════
const Particles: React.FC<{
  count: number;
  spread: number;
  intensity: number;
  color: string;
}> = ({ count, spread, intensity, color }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const frame = useCurrentFrame();

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * spread;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions: pos, velocities: vel };
  }, [count, spread]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Orbit around Y axis
      const x = arr[i * 3];
      const z = arr[i * 3 + 2];
      const angle = 0.008;
      arr[i * 3] = x * Math.cos(angle) - z * Math.sin(angle);
      arr[i * 3 + 2] = x * Math.sin(angle) + z * Math.cos(angle);

      // Slight drift
      arr[i * 3 + 1] += velocities[i * 3 + 1];
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.003;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={intensity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// ═══════════════════════════════════
// SPARK BURST (explosion moment)
// ═══════════════════════════════════
const SparkBurst: React.FC<{
  progress: number;
  intensity: number;
}> = ({ progress, intensity }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = Math.cos(phi);
    }
    return pos;
  }, []);

  const scale = progress * 5;
  const opacity = Math.max(0, 1 - progress * 1.5) * intensity;

  return (
    <points ref={pointsRef} scale={[scale, scale, scale]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffaa44"
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// ═══════════════════════════════════
// GROUND PLANE (reflection)
// ═══════════════════════════════════
const Ground: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
    <planeGeometry args={[20, 20]} />
    <meshStandardMaterial
      color="#050810"
      metalness={0.9}
      roughness={0.3}
      transparent
      opacity={0.8}
    />
  </mesh>
);

// ═══════════════════════════════════
// CAMERA RIG - CARCKHÉtic movement
// ═══════════════════════════════════
const CameraRig: React.FC<{
  phase: "reveal" | "charge" | "blast" | "hero";
  phaseProgress: number;
}> = ({ phase, phaseProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useFrame(({ camera }) => {
    let x = 0, y = 0, z = 8;
    const lookY = 0;

    if (phase === "reveal") {
      // Start far, slowly approach, slight orbit
      z = interpolate(phaseProgress, [0, 1], [12, 6], { extrapolateRight: "clamp" });
      y = interpolate(phaseProgress, [0, 1], [1.5, 0.8], { extrapolateRight: "clamp" });
      x = Math.sin(phaseProgress * 0.5) * 0.5;
    } else if (phase === "charge") {
      // Orbit around, get closer
      const angle = phaseProgress * Math.PI * 0.6;
      const radius = interpolate(phaseProgress, [0, 1], [5.5, 4], { extrapolateRight: "clamp" });
      x = Math.sin(angle) * radius;
      z = Math.cos(angle) * radius;
      y = interpolate(phaseProgress, [0, 1], [0.8, 0.3], { extrapolateRight: "clamp" });
    } else if (phase === "blast") {
      // Push back from explosion, then recover
      const pushBack = interpolate(phaseProgress, [0, 0.3, 1], [4, 6, 4.5], { extrapolateRight: "clamp" });
      z = pushBack;
      y = 0.3 + Math.sin(phaseProgress * 3) * 0.1;
      x = Math.sin(phaseProgress * 2) * 0.3;
    } else if (phase === "hero") {
      // Slow orbit hero shot
      const angle = phaseProgress * Math.PI * 0.4 + Math.PI * 0.3;
      x = Math.sin(angle) * 4.5;
      z = Math.cos(angle) * 4.5;
      y = interpolate(phaseProgress, [0, 1], [0.2, -0.1], { extrapolateRight: "clamp" });
    }

    // Micro shake
    const shakeIntensity = phase === "blast" ? 0.08 : 0.015;
    const sx = Math.sin(frame * 0.8) * shakeIntensity;
    const sy = Math.cos(frame * 0.6) * shakeIntensity * 0.7;

    camera.position.set(x + sx, y + sy, z);
    camera.lookAt(0, lookY, 0);
  });

  return null;
};

// ═══════════════════════════════════
// LIGHT RIG
// ═══════════════════════════════════
const LightRig: React.FC<{
  intensity: number;
  blastFlash: number;
}> = ({ intensity, blastFlash }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.1) * 0.15;

  return (
    <>
      <ambientLight intensity={0.08 * intensity} />

      {/* Key light - cool blue from top-right */}
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.5 * intensity * pulse}
        color="#aaccff"
      />

      {/* Rim light - warm from behind */}
      <pointLight
        position={[-3, 2, -3]}
        intensity={8 * intensity}
        color="#ff6633"
        distance={12}
      />

      {/* Fill - blue from left */}
      <pointLight
        position={[-2, 0, 3]}
        intensity={12 * intensity * pulse}
        color="#2288ff"
        distance={10}
      />

      {/* Red accent from below */}
      <pointLight
        position={[1, -2, 1]}
        intensity={6 * intensity}
        color="#ff2244"
        distance={8}
      />

      {/* Blast flash light */}
      {blastFlash > 0 && (
        <pointLight
          position={[0, 0, 0]}
          intensity={50 * blastFlash}
          color="#ffffff"
          distance={20}
        />
      )}
    </>
  );
};

// ═══════════════════════════════════
// POST PROCESSING
// ═══════════════════════════════════
const PostFX: React.FC<{
  bloomIntensity: number;
}> = ({ bloomIntensity }) => (
  <EffectComposer>
    <Bloom
      intensity={bloomIntensity}
      luminanceThreshold={0.15}
      luminanceSmoothing={0.9}
      mipmapBlur
    />
    <Vignette darkness={0.6} offset={0.3} />
  </EffectComposer>
);

// ═══════════════════════════════════
// HUD TEXT OVERLAY (2D over 3D)
// ═══════════════════════════════════
const HudOverlay: React.FC<{
  title: string;
  subtitle: string;
  titleOpacity: number;
  subtitleOpacity: number;
  titleScale: number;
  subtitleY: number;
}> = ({ title, subtitle, titleOpacity, subtitleOpacity, titleScale, subtitleY }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 10,
    }}
  >
    <div
      style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: 72,
        fontWeight: 900,
        color: "#ffffff",
        textShadow: "0 0 40px rgba(34,170,255,0.6), 0 0 80px rgba(34,170,255,0.3), 0 4px 12px rgba(0,0,0,0.8)",
        letterSpacing: 6,
        opacity: titleOpacity,
        transform: `scale(${titleScale})`,
        textAlign: "center",
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: "Montserrat, sans-serif",
        fontSize: 28,
        fontWeight: 400,
        color: "rgba(150,200,255,0.9)",
        textShadow: "0 0 20px rgba(34,170,255,0.4), 0 2px 8px rgba(0,0,0,0.6)",
        letterSpacing: 8,
        textTransform: "uppercase",
        opacity: subtitleOpacity,
        transform: `translateY(${subtitleY}px)`,
        marginTop: 16,
      }}
    >
      {subtitle}
    </div>
  </div>
);

// ═══════════════════════════════════
// FLASH OVERLAY
// ═══════════════════════════════════
const FlashOverlay: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle, rgba(100,200,255,1) 0%, rgba(255,255,255,0.8) 40%, transparent 70%)",
      opacity,
      pointerEvents: "none",
      zIndex: 5,
    }}
  />
);

// ═══════════════════════════════════
// 3D SCENE CONTENT
// ═══════════════════════════════════
const SceneContent: React.FC<{
  phase: "reveal" | "charge" | "blast" | "hero";
  phaseProgress: number;
  chargeProgress: number;
  portalVisible: number;
  portalIntensity: number;
  particleIntensity: number;
  orbGlow: number;
  orbDistort: number;
  blastProgress: number;
  blastFlash: number;
  bloomIntensity: number;
}> = (props) => (
  <>
    <color attach="background" args={["#030508"]} />
    <fog attach="fog" args={["#030508", 8, 18]} />

    <CameraRig phase={props.phase} phaseProgress={props.phaseProgress} />
    <LightRig intensity={1} blastFlash={props.blastFlash} />

    <EnergyOrb
      chargeProgress={props.chargeProgress}
      glowIntensity={props.orbGlow}
      distort={props.orbDistort}
    />

    <PortalRings
      visible={props.portalVisible}
      intensity={props.portalIntensity}
    />

    <Particles
      count={300}
      spread={3}
      intensity={props.particleIntensity}
      color="#44bbff"
    />
    <Particles
      count={150}
      spread={2}
      intensity={props.particleIntensity * 0.6}
      color="#ff8844"
    />

    {props.blastProgress > 0 && (
      <SparkBurst
        progress={props.blastProgress}
        intensity={1}
      />
    )}

    <Ground />
    <PostFX bloomIntensity={props.bloomIntensity} />
  </>
);

// ═══════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════
export const MarvelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Phase boundaries (in frames)
  const REVEAL_END = Math.floor(2.5 * fps);   // 0-2.5s: dark reveal
  const CHARGE_END = Math.floor(5 * fps);     // 2.5-5s: energy charging
  const BLAST_START = Math.floor(5.2 * fps);  // 5.2s: explosion begins
  const BLAST_END = Math.floor(7 * fps);      // 5.2-7s: explosion
  const HERO_START = Math.floor(7 * fps);     // 7-10s: hero shot + text

  // Determine current phase
  let phase: "reveal" | "charge" | "blast" | "hero" = "reveal";
  let phaseProgress = 0;

  if (frame < REVEAL_END) {
    phase = "reveal";
    phaseProgress = frame / REVEAL_END;
  } else if (frame < CHARGE_END) {
    phase = "charge";
    phaseProgress = (frame - REVEAL_END) / (CHARGE_END - REVEAL_END);
  } else if (frame < BLAST_END) {
    phase = "blast";
    phaseProgress = (frame - BLAST_START) / (BLAST_END - BLAST_START);
  } else {
    phase = "hero";
    phaseProgress = Math.min(1, (frame - HERO_START) / (durationInFrames - HERO_START));
  }

  // ── Orb animations ──
  const chargeProgress = interpolate(frame, [0, CHARGE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const orbGlow = interpolate(frame, [0, REVEAL_END, CHARGE_END, BLAST_END], [0.2, 0.5, 5, 1.5], {
    extrapolateRight: "clamp",
  });

  const orbDistort = interpolate(frame, [0, CHARGE_END * 0.5, CHARGE_END, BLAST_END], [0.1, 0.2, 0.5, 0.15], {
    extrapolateRight: "clamp",
  });

  // ── Portal animations ──
  const portalVisible = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const portalIntensity = interpolate(
    frame,
    [1 * fps, CHARGE_END, BLAST_END],
    [0.3, 3, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Particles ──
  const particleIntensity = interpolate(
    frame,
    [0.5 * fps, 2 * fps, BLAST_END],
    [0, 1, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Blast ──
  const blastProgress = frame >= BLAST_START
    ? interpolate(frame, [BLAST_START, BLAST_END], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  const blastFlash = frame >= BLAST_START
    ? interpolate(frame, [BLAST_START, BLAST_START + 0.15 * fps, BLAST_START + 0.6 * fps], [0, 1, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  // ── Bloom ──
  const bloomIntensity = interpolate(
    frame,
    [0, REVEAL_END, CHARGE_END, BLAST_END, durationInFrames],
    [0.8, 1.2, 2.5, 1.5, 1.2],
    { extrapolateRight: "clamp" }
  );

  // ── Flash overlay ──
  const flashOpacity = frame >= BLAST_START
    ? interpolate(frame, [BLAST_START, BLAST_START + 0.1 * fps, BLAST_START + 0.5 * fps], [0, 0.7, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  // ── Text animations ──
  const titleDelay = HERO_START + 0.5 * fps;
  const titleSpring = spring({
    frame: Math.max(0, frame - titleDelay),
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const titleOpacity = interpolate(frame, [titleDelay, titleDelay + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleScale = interpolate(titleSpring, [0, 1], [1.3, 1]);

  const subtitleDelay = titleDelay + 0.8 * fps;
  const subtitleOpacity = interpolate(frame, [subtitleDelay, subtitleDelay + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [subtitleDelay, subtitleDelay + 0.6 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Fade in / fade out ──
  const fadeIn = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 1 * fps, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeIn * fadeOut }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 45, position: [0, 0, 8], near: 0.1, far: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <SceneContent
          phase={phase}
          phaseProgress={phaseProgress}
          chargeProgress={chargeProgress}
          portalVisible={portalVisible}
          portalIntensity={portalIntensity}
          particleIntensity={particleIntensity}
          orbGlow={orbGlow}
          orbDistort={orbDistort}
          blastProgress={blastProgress}
          blastFlash={blastFlash}
          bloomIntensity={bloomIntensity}
        />
      </ThreeCanvas>

      <FlashOverlay opacity={flashOpacity} />

      <HudOverlay
        title="INFINITE POWER"
        subtitle="Beyond the limits"
        titleOpacity={titleOpacity}
        subtitleOpacity={subtitleOpacity}
        titleScale={titleScale}
        subtitleY={subtitleY}
      />

      {/* CARCKHÉtic bars */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "6%", background: "#000", zIndex: 20,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "6%", background: "#000", zIndex: 20,
      }} />
    </AbsoluteFill>
  );
};
