import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

// ── Bottle SVG Component ──
const Bottle: React.FC<{
  scale?: number;
  glowIntensity?: number;
  showDrops?: boolean;
  showFrost?: boolean;
}> = ({ scale = 1, glowIntensity = 0.5, showDrops = true, showFrost = false }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 500,
        transform: `scale(${scale})`,
      }}
    >
      {/* Bottle glow */}
      <div
        style={{
          position: "absolute",
          width: 240,
          height: 540,
          left: -20,
          top: -20,
          borderRadius: 30,
          background: `radial-gradient(ellipse, rgba(0,180,255,${glowIntensity * 0.3}) 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      <svg viewBox="0 0 200 500" width={200} height={500}>
        {/* Bottle body */}
        <defs>
          <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a3a4a" />
            <stop offset="30%" stopColor="#2a6a7a" />
            <stop offset="50%" stopColor="#3a8a9a" />
            <stop offset="70%" stopColor="#2a6a7a" />
            <stop offset="100%" stopColor="#1a3a4a" />
          </linearGradient>
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a1a0a" />
            <stop offset="50%" stopColor="#5a2a0a" />
            <stop offset="100%" stopColor="#2a0a00" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cc0000" />
            <stop offset="100%" stopColor="#880000" />
          </linearGradient>
          <linearGradient id="labelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cc0000" />
            <stop offset="50%" stopColor="#aa0000" />
            <stop offset="100%" stopColor="#880000" />
          </linearGradient>
          {showFrost && (
            <filter id="frost">
              <feTurbulence baseFrequency="0.05" numOctaves="3" result="noise" />
              <feComposite in="SourceGraphic" in2="noise" operator="in" />
            </filter>
          )}
        </defs>

        {/* Bottle neck */}
        <rect x="80" y="20" width="40" height="60" rx="3" fill="url(#bottleGrad)" />
        {/* Neck ring */}
        <rect x="75" y="75" width="50" height="8" rx="4" fill="#2a6a7a" />

        {/* Bottle shoulder */}
        <path d="M75,83 Q60,120 55,160 L145,160 Q140,120 125,83 Z" fill="url(#bottleGrad)" />

        {/* Bottle body */}
        <rect x="55" y="160" width="90" height="280" rx="8" fill="url(#bottleGrad)" />

        {/* Liquid inside */}
        <rect x="60" y="170" width="80" height="260" rx="5" fill="url(#liquidGrad)" opacity="0.8" />

        {/* Bubbles inside */}
        {[...Array(8)].map((_, i) => {
          const bx = 75 + (i * 7) % 50;
          const by = 200 + ((frame * 0.5 + i * 30) % 220);
          const br = 2 + (i % 3);
          return (
            <circle
              key={i}
              cx={bx}
              cy={430 - (by - 200)}
              r={br}
              fill="rgba(255,255,255,0.3)"
            />
          );
        })}

        {/* Label */}
        <rect x="60" y="240" width="80" height="100" rx="4" fill="url(#labelGrad)" />
        {/* Label text */}
        <text x="100" y="275" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">
          ColaFresh
        </text>
        <text x="100" y="295" textAnchor="middle" fill="#ffd700" fontSize="8" fontFamily="Arial">
          ÁGUA MINERAL
        </text>
        <text x="100" y="310" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="Arial">
          Sabor Cola
        </text>
        {/* Label decorative lines */}
        <line x1="70" y1="320" x2="130" y2="320" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <line x1="70" y1="260" x2="130" y2="260" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

        {/* Cap */}
        <rect x="82" y="10" width="36" height="15" rx="4" fill="url(#capGrad)" />
        <rect x="84" y="8" width="32" height="5" rx="2" fill="#dd2222" />

        {/* Bottle bottom */}
        <ellipse cx="100" cy="440" rx="45" ry="6" fill="#1a3a4a" />

        {/* Glass reflection */}
        <rect x="65" y="170" width="8" height="200" rx="4" fill="rgba(255,255,255,0.08)" />
        <rect x="75" y="90" width="4" height="60" rx="2" fill="rgba(255,255,255,0.1)" />
      </svg>

      {/* Condensation drops */}
      {showDrops &&
        [...Array(12)].map((_, i) => {
          const dx = 30 + (i * 17) % 140;
          const baseY = 180 + (i * 31) % 250;
          const dropY = baseY + interpolate((frame + i * 10) % 120, [0, 120], [0, 30], {
            extrapolateRight: "clamp",
          });
          const dropOpacity = interpolate((frame + i * 10) % 120, [0, 80, 120], [0.7, 0.5, 0], {
            extrapolateRight: "clamp",
          });
          const dropSize = 3 + (i % 4) * 1.5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: dx,
                top: dropY,
                width: dropSize,
                height: dropSize * 1.4,
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                background: "radial-gradient(circle at 30% 30%, rgba(200,230,255,0.9), rgba(100,180,220,0.4))",
                opacity: dropOpacity,
              }}
            />
          );
        })}
    </div>
  );
};

// ── Scene 1: Icy Bottle on Table ──
const IcyBottleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Slow zoom in
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // Bottle entrance from below
  const bottleY = interpolate(frame, [0, 1 * fps], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const bottleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Mist/cold air
  const mistOpacity = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 40%, #1b2838 100%)",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
        overflow: "hidden",
      }}
    >
      {/* Spotlight from above */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 800,
          left: "50%",
          top: "-10%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 0%, rgba(100,180,255,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Ice cubes on surface */}
      <svg
        viewBox="0 0 800 200"
        style={{ position: "absolute", bottom: "15%", width: 800, opacity: 0.6 }}
      >
        {[...Array(6)].map((_, i) => {
          const ix = 100 + i * 110;
          const iy = 80 + (i % 2) * 30;
          const irot = i * 15 - 30;
          return (
            <g key={i} transform={`translate(${ix},${iy}) rotate(${irot})`}>
              <rect x="-20" y="-20" width="40" height="40" rx="6"
                fill="rgba(180,220,255,0.2)" stroke="rgba(200,230,255,0.3)" strokeWidth="1" />
              <rect x="-15" y="-15" width="12" height="12" rx="2"
                fill="rgba(255,255,255,0.08)" />
            </g>
          );
        })}
      </svg>

      {/* Table surface reflection */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          width: "80%",
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(100,180,255,0.2), transparent)",
        }}
      />

      {/* Bottle */}
      <div
        style={{
          transform: `translateY(${bottleY}px)`,
          opacity: bottleOpacity,
        }}
      >
        <Bottle scale={1.4} glowIntensity={0.6} showDrops showFrost />
      </div>

      {/* Cold mist at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          width: "100%",
          height: "20%",
          opacity: mistOpacity,
          background: "radial-gradient(ellipse at 50% 100%, rgba(180,220,255,0.15) 0%, transparent 70%)",
          filter: "blur(15px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ── Scene 2: Bottle Opening with Gas/Foam ──
const BottleOpenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cap flying off
  const capOffFrame = 0.8 * fps;
  const capY = interpolate(frame, [capOffFrame, capOffFrame + 0.5 * fps], [0, -200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const capRotation = interpolate(frame, [capOffFrame, capOffFrame + 0.5 * fps], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const capOpacity = interpolate(frame, [capOffFrame, capOffFrame + 0.8 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gas burst
  const gasOpacity = interpolate(frame, [capOffFrame, capOffFrame + 0.3 * fps, capOffFrame + 1.5 * fps], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gasScale = interpolate(frame, [capOffFrame, capOffFrame + 1.5 * fps], [0.5, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Foam overflow
  const foamHeight = interpolate(frame, [capOffFrame + 0.2 * fps, capOffFrame + 1.2 * fps, capOffFrame + 2.5 * fps], [0, 60, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shake before opening
  const shakeX = frame < capOffFrame
    ? Math.sin(frame * 1.5) * interpolate(frame, [0, capOffFrame], [0, 4], { extrapolateRight: "clamp" })
    : 0;

  // Flash on open
  const flashOpacity = interpolate(
    frame,
    [capOffFrame, capOffFrame + 0.1 * fps, capOffFrame + 0.5 * fps],
    [0, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 40%, #1b2838 100%)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Spotlight */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 700,
          left: "50%",
          top: "-5%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 0%, rgba(100,180,255,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Bottle with shake */}
      <div style={{ transform: `translateX(${shakeX}px)`, position: "relative" }}>
        <Bottle scale={1.4} glowIntensity={0.5} showDrops />

        {/* Flying cap */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: `translateX(-50%) translateY(${capY}px) rotate(${capRotation}deg)`,
            opacity: capOpacity,
            width: 50,
            height: 20,
            zIndex: 10,
          }}
        >
          <svg viewBox="0 0 50 20" width={50} height={20}>
            <rect x="5" y="2" width="40" height="16" rx="4" fill="#cc0000" />
            <rect x="8" y="0" width="34" height="6" rx="2" fill="#dd2222" />
          </svg>
        </div>

        {/* Gas burst */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: `translateX(-50%) scale(${gasScale})`,
            opacity: gasOpacity,
            width: 120,
            height: 120,
          }}
        >
          {[...Array(15)].map((_, i) => {
            const angle = (i / 15) * Math.PI * 2;
            const dist = 20 + (i % 3) * 15;
            const px = 60 + Math.cos(angle) * dist;
            const py = 60 + Math.sin(angle) * dist * 0.6;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: px,
                  top: py,
                  width: 8 + (i % 4) * 3,
                  height: 8 + (i % 4) * 3,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.4)",
                  filter: "blur(3px)",
                }}
              />
            );
          })}
        </div>

        {/* Foam overflow */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 70,
            height: foamHeight,
            background: "linear-gradient(180deg, rgba(255,235,200,0.8) 0%, rgba(200,160,100,0.4) 100%)",
            borderRadius: "0 0 20px 20px",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Flash */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "white",
          opacity: flashOpacity,
        }}
      />

      {/* "Tsssss" text */}
      {frame > capOffFrame && (
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "15%",
            fontFamily,
            fontSize: 48,
            fontWeight: 900,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.6)",
            opacity: interpolate(
              frame,
              [capOffFrame, capOffFrame + 0.3 * fps, capOffFrame + 2 * fps],
              [0, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            textShadow: "0 0 20px rgba(100,180,255,0.5)",
            letterSpacing: "8px",
          }}
        >
          Tsssss!
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 3: Main Text ──
const TextScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Spring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(0.3 * fps),
  });

  const line1Opacity = interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line2Spring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(1 * fps),
  });

  const line2Opacity = interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = interpolate(frame, [0.8 * fps, 1.5 * fps], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Animated bubbles in background
  const bubbles = [...Array(20)].map((_, i) => {
    const bx = (i * 137.5) % 100;
    const speed = 0.3 + (i % 5) * 0.15;
    const by = 100 - ((frame * speed + i * 20) % 120);
    const bOpacity = interpolate(by, [-10, 10, 80, 100], [0, 0.3, 0.3, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const bSize = 4 + (i % 5) * 2;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${bx}%`,
          top: `${by}%`,
          width: bSize,
          height: bSize,
          borderRadius: "50%",
          background: "rgba(200,160,100,0.5)",
          opacity: bOpacity,
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a0505 0%, #2a0a0a 40%, #0d0505 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {bubbles}

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Line 1 */}
        <div
          style={{
            fontFamily,
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            opacity: line1Opacity,
            transform: `scale(${line1Spring})`,
            textShadow: "0 0 30px rgba(200,50,50,0.4), 0 4px 8px rgba(0,0,0,0.5)",
            letterSpacing: "3px",
          }}
        >
          Refrescância da água.
        </div>

        {/* Decorative bar */}
        <div
          style={{
            width: barWidth,
            height: 3,
            background: "linear-gradient(90deg, transparent, #cc0000, #ff4444, #cc0000, transparent)",
            margin: "16px auto",
            borderRadius: 2,
          }}
        />

        {/* Line 2 */}
        <div
          style={{
            fontFamily,
            fontSize: 64,
            fontWeight: 900,
            color: "#ff4444",
            opacity: line2Opacity,
            transform: `scale(${line2Spring})`,
            textShadow: "0 0 40px rgba(255,68,68,0.5), 0 4px 8px rgba(0,0,0,0.5)",
            letterSpacing: "3px",
          }}
        >
          Sabor que você ama.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Close-up + Slogan ──
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Bottle entrance
  const bottleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const bottleX = interpolate(bottleSpring, [0, 1], [-200, 0]);

  // Slogan entrance
  const sloganSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(0.8 * fps),
  });

  const sloganOpacity = interpolate(frame, [0.8 * fps, 1.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brand bar
  const brandBarWidth = interpolate(frame, [1.2 * fps, 2 * fps], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
  );

  // Spotlight sweep
  const spotlightX = interpolate(frame, [0, 2 * fps], [30, 55], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0505 40%, #0a0a0a 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        overflow: "hidden",
      }}
    >
      {/* Moving spotlight */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 700,
          left: `${spotlightX}%`,
          top: "5%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at 50% 20%, rgba(255,50,50,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Layout: bottle left, text right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 100,
        }}
      >
        {/* Bottle */}
        <div style={{ transform: `translateX(${bottleX}px)` }}>
          <Bottle scale={1.6} glowIntensity={0.8} showDrops />
        </div>

        {/* Text block */}
        <div
          style={{
            textAlign: "left",
            transform: `scale(${sloganSpring})`,
            opacity: sloganOpacity,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontFamily,
              fontSize: 28,
              fontWeight: 700,
              color: "#cc0000",
              letterSpacing: "6px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Água Mineral
          </div>

          <div
            style={{
              fontFamily,
              fontSize: 72,
              fontWeight: 900,
              color: "#ffffff",
              textShadow: "0 0 40px rgba(255,50,50,0.4), 0 4px 8px rgba(0,0,0,0.6)",
              letterSpacing: "4px",
              lineHeight: 1.1,
            }}
          >
            ColaFresh
          </div>

          {/* Red bar */}
          <div
            style={{
              width: brandBarWidth,
              height: 4,
              background: "linear-gradient(90deg, #cc0000, #ff4444, #cc0000)",
              margin: "16px 0",
              borderRadius: 2,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontFamily,
              fontSize: 30,
              fontWeight: 400,
              color: "rgba(255,255,255,0.8)",
              opacity: taglineOpacity,
              letterSpacing: "1px",
              lineHeight: 1.5,
              maxWidth: 500,
            }}
          >
            O sabor da cola,
            <br />
            a pureza da água.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ──
export const ColaFreshVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const SCENE_DURATION = 5 * fps; // 5s per scene
  const FADE_DURATION = Math.floor(0.4 * fps); // 0.4s transitions

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {/* Scene 1: Icy bottle (0-5s) */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION + FADE_DURATION}>
          <IcyBottleScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 2: Bottle opening (5-10s) */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION + FADE_DURATION}>
          <BottleOpenScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 3: Text (10-15s) */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION + FADE_DURATION}>
          <TextScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 4: Final slogan (15-20s) */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATION + FADE_DURATION}>
          <FinalScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
