import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

// ── Image paths ──
const IMAGES = {
  apresentacao: staticFile("cola/cena1-apresentacao.png"),
  abertura: staticFile("cola/cena2-abertura.png"),
  experiencia: staticFile("cola/cena3-experiencia.png"),
  destaque: staticFile("cola/cena4-destaque.png"),
  slogan: staticFile("cola/cena5-slogan.png"),
  final: staticFile("cola/cena6-final.png"),
};

// ── Ken Burns wrapper ──
const KenBurns: React.FC<{
  src: string;
  startScale?: number;
  endScale?: number;
  startX?: number;
  endX?: number;
  startY?: number;
  endY?: number;
  children?: React.ReactNode;
}> = ({
  src,
  startScale = 1.05,
  endScale = 1.15,
  startX = 0,
  endX = 0,
  startY = 0,
  endY = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const x = interpolate(frame, [0, durationInFrames], [startX, endX], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const y = interpolate(frame, [0, durationInFrames], [startY, endY], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

// ── Animated Text ──
const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  fontWeight?: 400 | 700 | 900;
  color?: string;
  y?: number;
  shadow?: string;
  letterSpacing?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  fontSize = 48,
  fontWeight = 700,
  color = "#fff",
  y = 0,
  shadow = "0 4px 20px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5)",
  letterSpacing = 2,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(delay * fps),
  });

  const opacity = interpolate(frame, [delay * fps, delay * fps + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(s, [0, 1], [30, 0]);

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        textShadow: shadow,
        letterSpacing,
        transform: `translateY(${translateY + y}px)`,
        opacity,
        textAlign: "center",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ── Vignette overlay ──
const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.6 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ── Dark gradient overlay from bottom ──
const BottomGradient: React.FC<{ height?: string; opacity?: number }> = ({
  height = "50%",
  opacity = 0.85,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height,
      background: `linear-gradient(to top, rgba(0,0,0,${opacity}) 0%, transparent 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ══════════════════════════════════
// CENA 1 - Apresentação do Produto
// ══════════════════════════════════
const Cena1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Shimmer effect
  const shimmerX = interpolate(frame, [0, 3 * fps], [-200, 1200], {
    extrapolateRight: "clamp",
  });

  return (
    <KenBurns
      src={IMAGES.apresentacao}
      startScale={1.0}
      endScale={1.12}
      startY={10}
      endY={-10}
    >
      <Vignette intensity={0.5} />
      <BottomGradient height="35%" opacity={0.6} />

      {/* Shimmer sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: shimmerX,
            width: 150,
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            transform: "skewX(-15deg)",
          }}
        />
      </div>

      {/* Frost particles */}
      {[...Array(15)].map((_, i) => {
        const px = 10 + (i * 137) % 80;
        const py = 20 + (i * 97) % 60;
        const pDelay = i * 0.1;
        const pOpacity = interpolate(
          frame,
          [pDelay * fps, (pDelay + 0.5) * fps, (pDelay + 2) * fps],
          [0, 0.6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${px}%`,
              top: `${py}%`,
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              borderRadius: "50%",
              background: "rgba(200,230,255,0.8)",
              opacity: pOpacity,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </KenBurns>
  );
};

// ══════════════════════════════════
// CENA 2 - Abertura da Garrafa
// ══════════════════════════════════
const Cena2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash on "open" moment
  const flashOpacity = interpolate(
    frame,
    [0.5 * fps, 0.6 * fps, 1.2 * fps],
    [0, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "Tsssss" text
  const tssOpacity = interpolate(
    frame,
    [0.6 * fps, 0.9 * fps, 3 * fps, 3.5 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tssScale = interpolate(frame, [0.6 * fps, 1.2 * fps], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  // Bubble particles from opening
  const bubbles = [...Array(20)].map((_, i) => {
    const angle = ((i / 20) * Math.PI * 0.8) + Math.PI * 0.6;
    const speed = 40 + (i % 5) * 20;
    const startFrame = 0.5 * fps + i * 1.5;
    const progress = Math.max(0, (frame - startFrame) / (2 * fps));
    const dist = progress * speed;
    const bx = 50 + Math.cos(angle) * dist;
    const by = 30 + Math.sin(angle) * dist - progress * 20;
    const bOpacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.7, 0.3, 0], {
      extrapolateRight: "clamp",
    });
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${bx}%`,
          top: `${by}%`,
          width: 4 + (i % 4) * 2,
          height: 4 + (i % 4) * 2,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.6)",
          opacity: bOpacity,
          filter: "blur(1px)",
        }}
      />
    );
  });

  return (
    <KenBurns
      src={IMAGES.abertura}
      startScale={1.05}
      endScale={1.15}
      startX={-5}
      endX={5}
      startY={-5}
      endY={5}
    >
      <Vignette intensity={0.5} />
      {bubbles}

      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,1)",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* "Tsssss!" */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          right: "8%",
          fontFamily,
          fontSize: 56,
          fontWeight: 900,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 0 30px rgba(100,200,255,0.6), 0 0 60px rgba(0,0,0,0.8)",
          letterSpacing: 8,
          opacity: tssOpacity,
          transform: `scale(${tssScale})`,
        }}
      >
        Tsssss!
      </div>
    </KenBurns>
  );
};

// ══════════════════════════════════
// CENA 3 - Experiência (bebendo)
// ══════════════════════════════════
const Cena3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulse glow around face area
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.15, 0.3]
  );

  // Text "Refrescância Real"
  const textOpacity = interpolate(
    frame,
    [1.2 * fps, 1.8 * fps, 3.5 * fps, 4 * fps],
    [0, 1, 1, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textY = interpolate(frame, [1.2 * fps, 2 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <KenBurns
      src={IMAGES.experiencia}
      startScale={1.08}
      endScale={1.18}
      startX={5}
      endX={-5}
    >
      <Vignette intensity={0.55} />
      <BottomGradient height="40%" opacity={0.8} />

      {/* Warm glow */}
      <div
        style={{
          position: "absolute",
          width: "60%",
          height: "60%",
          left: "20%",
          top: "10%",
          background: `radial-gradient(ellipse, rgba(255,150,50,${glowPulse}) 0%, transparent 70%)`,
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 52,
            fontWeight: 900,
            color: "#fff",
            textShadow:
              "0 4px 20px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6)",
            letterSpacing: 3,
          }}
        >
          Refrescância Real
        </div>
      </div>
    </KenBurns>
  );
};

// ══════════════════════════════════
// CENA 4 - Destaque do Produto
// ══════════════════════════════════
const Cena4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spotlight sweep
  const spotAngle = interpolate(frame, [0, 4 * fps], [-30, 30], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.2, 0.5]
  );

  // Brand text
  const brandOpacity = interpolate(
    frame,
    [1 * fps, 1.6 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const brandScale = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(1 * fps),
  });

  return (
    <KenBurns
      src={IMAGES.destaque}
      startScale={1.0}
      endScale={1.1}
      startY={5}
      endY={-5}
    >
      <Vignette intensity={0.6} />

      {/* Spotlight effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${spotAngle}deg, transparent 30%, rgba(255,200,100,${glowIntensity * 0.15}) 50%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "20%",
          width: "60%",
          height: "30%",
          background: `radial-gradient(ellipse at center bottom, rgba(255,100,0,${glowIntensity * 0.25}) 0%, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Brand name overlay */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: brandOpacity,
          transform: `scale(${brandScale})`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 700,
            color: "#cc0000",
            letterSpacing: 6,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          Agua Mineral
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 72,
            fontWeight: 900,
            color: "#fff",
            textShadow:
              "0 0 40px rgba(255,50,50,0.4), 0 4px 20px rgba(0,0,0,0.9)",
            letterSpacing: 4,
          }}
        >
          ColaFresh
        </div>
      </div>
    </KenBurns>
  );
};

// ══════════════════════════════════
// CENA 5 - Slogan
// ══════════════════════════════════
const Cena5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow dramatic zoom
  const scale = interpolate(frame, [0, 5 * fps], [1.0, 1.06], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // Pulsing red accent
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.0, 0.08]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={IMAGES.slogan}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Vignette intensity={0.3} />

      {/* Red accent pulse */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(200,0,0,${pulse})`,
          pointerEvents: "none",
          mixBlendMode: "soft-light",
        }}
      />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════
// CENA 6 - Final
// ══════════════════════════════════
const Cena6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Zoom into product
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // Red flash accent on entry
  const flashOpacity = interpolate(
    frame,
    [0, 0.15 * fps, 0.6 * fps],
    [0.15, 0.15, 0],
    { extrapolateRight: "clamp" }
  );

  // Fade to black at end
  const fadeToBlack = interpolate(
    frame,
    [durationInFrames - 1.5 * fps, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Final tagline
  const tagOpacity = interpolate(
    frame,
    [durationInFrames - 3 * fps, durationInFrames - 2.5 * fps, durationInFrames - 0.5 * fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={IMAGES.final}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Vignette intensity={0.35} />

      {/* Red flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(200,0,0,1)",
          opacity: flashOpacity,
          pointerEvents: "none",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Watermark / final tagline over black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `rgba(0,0,0,${fadeToBlack})`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: "#fff",
            opacity: tagOpacity,
            letterSpacing: 4,
            textShadow: "0 0 30px rgba(200,0,0,0.5)",
          }}
        >
          O sabor da cola, a pureza da agua.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════
// COMPOSICAO PRINCIPAL - Comercial 30s
// ══════════════════════════════════════════
export const ColaCommercial: React.FC = () => {
  const { fps } = useVideoConfig();

  const FADE = Math.floor(0.5 * fps); // 0.5s transition

  // Scene durations (in frames)
  const S1 = 5 * fps;   // Apresentacao - 5s
  const S2 = 4 * fps;   // Abertura - 4s
  const S3 = 4 * fps;   // Experiencia - 4s
  const S4 = 5 * fps;   // Destaque - 5s
  const S5 = 5 * fps;   // Slogan - 5s
  const S6 = 7 * fps;   // Final - 7s (inclui fade to black)

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {/* Cena 1: Apresentacao */}
        <TransitionSeries.Sequence durationInFrames={S1 + FADE}>
          <Cena1 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        {/* Cena 2: Abertura */}
        <TransitionSeries.Sequence durationInFrames={S2 + FADE}>
          <Cena2 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        {/* Cena 3: Experiencia */}
        <TransitionSeries.Sequence durationInFrames={S3 + FADE}>
          <Cena3 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        {/* Cena 4: Destaque */}
        <TransitionSeries.Sequence durationInFrames={S4 + FADE}>
          <Cena4 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        {/* Cena 5: Slogan */}
        <TransitionSeries.Sequence durationInFrames={S5 + FADE}>
          <Cena5 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        {/* Cena 6: Final */}
        <TransitionSeries.Sequence durationInFrames={S6}>
          <Cena6 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
