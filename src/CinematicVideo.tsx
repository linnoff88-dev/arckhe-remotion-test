import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const MountainSunrise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom in over 3 seconds using easing for smooth motion
  const scale = interpolate(frame, [0, 3 * fps], [1, 1.15], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Sun rising with easing
  const sunY = interpolate(frame, [0, 3 * fps], [80, 40], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Light rays opacity
  const raysOpacity = interpolate(frame, [0.5 * fps, 2.5 * fps], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        overflow: "hidden",
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `linear-gradient(
            180deg,
            #1a0a2e 0%,
            #2d1b69 15%,
            #e85d04 40%,
            #f48c06 55%,
            #ffba08 70%,
            #ffd60a 85%
          )`,
        }}
      />

      {/* Sun */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${sunY}%`,
          transform: "translate(-50%, -50%)",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #fff9c4 0%, #ffb703 40%, #fb8500 100%)",
          boxShadow:
            "0 0 120px 60px rgba(255, 183, 3, 0.5), 0 0 200px 100px rgba(251, 133, 0, 0.3)",
        }}
      />

      {/* Light rays */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${sunY}%`,
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          opacity: raysOpacity,
          background: `conic-gradient(
            from 0deg,
            transparent 0deg, rgba(255,215,0,0.15) 10deg, transparent 20deg,
            transparent 40deg, rgba(255,215,0,0.1) 50deg, transparent 60deg,
            transparent 80deg, rgba(255,215,0,0.15) 90deg, transparent 100deg,
            transparent 120deg, rgba(255,215,0,0.1) 130deg, transparent 140deg,
            transparent 160deg, rgba(255,215,0,0.15) 170deg, transparent 180deg,
            transparent 200deg, rgba(255,215,0,0.1) 210deg, transparent 220deg,
            transparent 240deg, rgba(255,215,0,0.15) 250deg, transparent 260deg,
            transparent 280deg, rgba(255,215,0,0.1) 290deg, transparent 300deg,
            transparent 320deg, rgba(255,215,0,0.15) 330deg, transparent 340deg,
            transparent 360deg
          )`,
        }}
      />

      {/* Mountains back */}
      <svg
        viewBox="0 0 1920 400"
        style={{ position: "absolute", bottom: 0, width: "100%" }}
      >
        <polygon
          points="0,400 200,120 400,250 600,80 850,200 1000,100 1200,220 1400,60 1600,180 1920,110 1920,400"
          fill="#2d1b69"
          opacity="0.7"
        />
        <polygon
          points="0,400 150,200 350,280 550,160 750,260 950,140 1150,240 1350,130 1550,230 1750,150 1920,200 1920,400"
          fill="#1a0a2e"
          opacity="0.9"
        />
      </svg>

      {/* Fog/mist */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          width: "100%",
          height: "15%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,186,8,0.15) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Particles: React.FC<{ count: number }> = ({ count }) => {
  const frame = useCurrentFrame();

  return (
    <>
      {[...Array(count)].map((_, i) => {
        const x = (i * 137.5) % 100;
        const y = (i * 73.1) % 100;
        const delay = i * 4;
        const particleOpacity = interpolate(
          (frame + delay) % 60,
          [0, 30, 60],
          [0, 0.5, 0]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#ffba08",
              opacity: particleOpacity,
            }}
          />
        );
      })}
    </>
  );
};

const TextScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth spring entrance - no bounce (recommended by skill)
  const scaleAnim = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const glowOpacity = interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle float using frame
  const floatY = Math.sin(frame / 15) * 3;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #1a0a2e 0%, #0d0221 50%, #1a0a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Particles count={20} />

      {/* Text with glow */}
      <div
        style={{
          transform: `scale(${scaleAnim}) translateY(${floatY}px)`,
          opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#ffffff",
            textShadow: `
              0 0 40px rgba(255, 186, 8, ${glowOpacity * 0.8}),
              0 0 80px rgba(251, 133, 0, ${glowOpacity * 0.4}),
              0 4px 8px rgba(0,0,0,0.5)
            `,
            letterSpacing: "4px",
            lineHeight: 1.2,
          }}
        >
          {text}
        </div>

        {/* Underline accent */}
        <div
          style={{
            width: interpolate(frame, [0.5 * fps, 1.2 * fps], [0, 300], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            }),
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #ffba08, transparent)",
            margin: "20px auto 0",
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const TextTransition: React.FC<{
  textOut: string;
  textIn: string;
}> = ({ textOut, textIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text out: fade out + slide up with easing
  const outOpacity = interpolate(frame, [0, 0.7 * fps], [1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const outY = interpolate(frame, [0, 0.7 * fps], [0, -60], {
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Text in: smooth spring entrance (no bounce)
  const inSpring = spring({
    frame: Math.max(0, frame - Math.floor(0.5 * fps)),
    fps,
    config: { damping: 200 },
  });
  const inOpacity = interpolate(frame, [0.5 * fps, 1.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const inY = interpolate(inSpring, [0, 1], [60, 0]);

  const glowOpacity = interpolate(frame, [0.8 * fps, 1.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle float for final text
  const floatY =
    frame > 1.2 * fps ? Math.sin((frame - 1.2 * fps) / 15) * 3 : 0;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #1a0a2e 0%, #0d0221 50%, #1a0a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Particles count={25} />

      {/* Outgoing text */}
      <div
        style={{
          position: "absolute",
          transform: `translateY(${outY}px)`,
          opacity: outOpacity,
          fontSize: 90,
          fontWeight: 900,
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#ffffff",
          textShadow:
            "0 0 40px rgba(255,186,8,0.6), 0 4px 8px rgba(0,0,0,0.5)",
          letterSpacing: "4px",
        }}
      >
        {textOut}
      </div>

      {/* Incoming text */}
      <div
        style={{
          position: "absolute",
          textAlign: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${inSpring}) translateY(${inY + floatY}px)`,
            opacity: inOpacity,
            fontSize: 90,
            fontWeight: 900,
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#ffffff",
            textShadow: `
              0 0 40px rgba(255,186,8,${glowOpacity * 0.8}),
              0 0 80px rgba(251,133,0,${glowOpacity * 0.4}),
              0 4px 8px rgba(0,0,0,0.5)
            `,
            letterSpacing: "4px",
          }}
        >
          {textIn}
        </div>

        {/* Underline accent */}
        <div
          style={{
            width: interpolate(frame, [1 * fps, 1.7 * fps], [0, 350], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            }),
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #ffba08, transparent)",
            margin: "20px auto 0",
            borderRadius: 2,
            opacity: inOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const FinalHold: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade out with easing
  const fadeOut = interpolate(frame, [1 * fps, 2 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const floatY = Math.sin(frame / 15) * 3;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #1a0a2e 0%, #0d0221 50%, #1a0a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <Particles count={25} />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            transform: `translateY(${floatY}px)`,
            fontSize: 90,
            fontWeight: 900,
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#ffffff",
            textShadow:
              "0 0 40px rgba(255,186,8,0.8), 0 0 80px rgba(251,133,0,0.4), 0 4px 8px rgba(0,0,0,0.5)",
            letterSpacing: "4px",
          }}
        >
          Keep Moving Forward
        </div>
        <div
          style={{
            width: 350,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #ffba08, transparent)",
            margin: "20px auto 0",
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const CARCKHÉticVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Using TransitionSeries with fade transitions between scenes (best practice)
  const fadeDuration = Math.floor(0.5 * fps); // 0.5s fade transitions

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {/* Scene 1: Mountain Sunrise (0-3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps + fadeDuration}>
          <MountainSunrise />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: fadeDuration })}
        />

        {/* Scene 2: "Success Takes Time" (3-6s) */}
        <TransitionSeries.Sequence
          durationInFrames={3 * fps + fadeDuration}
        >
          <TextScene text="Success Takes Time" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: fadeDuration })}
        />

        {/* Scene 3: Transition to "Keep Moving Forward" (6-10s) */}
        <TransitionSeries.Sequence
          durationInFrames={4 * fps + fadeDuration}
        >
          <TextTransition
            textOut="Success Takes Time"
            textIn="Keep Moving Forward"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: fadeDuration })}
        />

        {/* Scene 4: Hold final text with fade out (10-12s) */}
        <TransitionSeries.Sequence durationInFrames={2 * fps + fadeDuration}>
          <FinalHold />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
