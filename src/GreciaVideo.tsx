import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

// Scene data from story.md
const SCENES = [
  {
    image: "livro11/Cena_01_A_Aula_Comeca_Viagem_a_Grecia.png",
    title: "A Aula Começa",
    subtitle: "Viagem à Grécia",
  },
  {
    image: "livro11/Cena_02_Democracia_O_Poder_do_Povo.png",
    title: "Democracia",
    subtitle: "O Poder do Povo",
  },
  {
    image: "livro11/Cena_03_Filosofia_Socrates_Platao_e_.png",
    title: "Filosofia",
    subtitle: "Sócrates, Platêo e Aristóteles",
  },
  {
    image: "livro11/Cena_04_Os_Jogos_Olimpicos.png",
    title: "Os Jogos Olímpicos",
    subtitle: "776 a.C.",
  },
  {
    image: "livro11/Cena_05_Teatro_A_Arte_de_Contar_Histo.png",
    title: "Teatro",
    subtitle: "A Arte de Contar Histórias",
  },
  {
    image: "livro11/Cena_06_Matematica_e_Ciencia_Tales_P.png",
    title: "Matemática e Ciência",
    subtitle: "Tales, Pitágoras e Arquimedes",
  },
  {
    image: "livro11/Cena_07_Medicina_Hipocrates_o_Pai_da.png",
    title: "Medicina",
    subtitle: "Hipócrates, o Pai da Medicina",
  },
  {
    image: "livro11/Cena_08_Arquitetura_Colunas_que_Suste.png",
    title: "Arquitetura",
    subtitle: "Colunas que Sustentam o Mundo",
  },
  {
    image: "livro11/Cena_09_Mitologia_e_Literatura_Deuses.png",
    title: "Mitologia e Literatura",
    subtitle: "Deuses e Heróis",
  },
  {
    image: "livro11/Cena_10_O_Legado_Vivo_A_Grecia_em_Nos.png",
    title: "O Legado Vivo",
    subtitle: "A Grécia em Nós",
  },
];

// Ken Burns effect: slow zoom + slight pan on image
const KenBurnsImage: React.FC<{
  src: string;
  direction?: "in" | "out";
  panX?: number;
  panY?: number;
}> = ({ src, direction = "in", panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale =
    direction === "in"
      ? interpolate(frame, [0, durationInFrames], [1, 1.15], {
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.sin),
        })
      : interpolate(frame, [0, durationInFrames], [1.15, 1], {
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.sin),
        });

  const translateX = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  const translateY = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Text overlay with animated entrance
const SceneTitle: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance - smooth spring (no bounce)
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(0.3 * fps),
  });

  const titleOpacity = interpolate(
    frame,
    [0.3 * fps, 0.8 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);

  // Subtitle entrance - slightly delayed
  const subtitleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(0.6 * fps),
  });

  const subtitleOpacity = interpolate(
    frame,
    [0.6 * fps, 1.1 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const subtitleY = interpolate(subtitleSpring, [0, 1], [20, 0]);

  // Underline bar
  const barWidth = interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
      }}
    >
      {/* Dark gradient overlay at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "50%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
        {/* Title */}
        <div
          style={{
            fontFamily,
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textShadow:
              "0 0 30px rgba(218, 165, 32, 0.7), 0 4px 8px rgba(0,0,0,0.8)",
            letterSpacing: "3px",
          }}
        >
          {title}
        </div>

        {/* Decorative bar */}
        <div
          style={{
            width: barWidth,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #daa520, #ffd700, #daa520, transparent)",
            margin: "12px auto",
            borderRadius: 2,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: "#e0d5b0",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            letterSpacing: "2px",
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Intro title card
const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(0.3 * fps),
  });

  const titleOpacity = interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [0.8 * fps, 1.5 * fps], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Ambient particles
  const particles = [...Array(30)].map((_, i) => {
    const x = (i * 137.5) % 100;
    const y = (i * 73.1) % 100;
    const delay = i * 3;
    const particleOpacity = interpolate(
      (frame + delay) % 90,
      [0, 45, 90],
      [0, 0.4, 0]
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
          background: "#daa520",
          opacity: particleOpacity * titleOpacity,
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #1a0a2e 0%, #0d0221 40%, #1a0a2e 70%, #2d1b69 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {particles}

      <div style={{ textAlign: "center", position: "relative" }}>
        <div
          style={{
            fontFamily,
            fontSize: 42,
            fontWeight: 700,
            color: "#daa520",
            opacity: subtitleOpacity,
            letterSpacing: "6px",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Episódio 11
        </div>

        <div
          style={{
            fontFamily,
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            textShadow:
              "0 0 40px rgba(218, 165, 32, 0.6), 0 0 80px rgba(218, 165, 32, 0.3), 0 4px 8px rgba(0,0,0,0.5)",
            letterSpacing: "4px",
            lineHeight: 1.2,
          }}
        >
          A Grécia Antiga
        </div>

        <div
          style={{
            width: lineWidth,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #daa520, #ffd700, #daa520, transparent)",
            margin: "20px auto",
            borderRadius: 2,
          }}
        />

        <div
          style={{
            fontFamily,
            fontSize: 38,
            fontWeight: 700,
            color: "#e0d5b0",
            opacity: subtitleOpacity,
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
            letterSpacing: "3px",
          }}
        >
          O Berço da Civilizaçêo
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Outro card
const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );

  const quoteSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: Math.floor(0.3 * fps),
  });

  const floatY = Math.sin(frame / 20) * 3;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #1a0a2e 0%, #0d0221 40%, #1a0a2e 70%, #2d1b69 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: enterOpacity * fadeOut,
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${quoteSpring}) translateY(${floatY}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 56,
            fontWeight: 900,
            color: "#ffffff",
            textShadow:
              "0 0 40px rgba(218, 165, 32, 0.6), 0 4px 8px rgba(0,0,0,0.5)",
            letterSpacing: "3px",
            lineHeight: 1.3,
            maxWidth: 1200,
            padding: "0 60px",
          }}
        >
          "A Grécia pode ser antiga,
          <br />
          mas as ideias dela sêo do futuro."
        </div>

        <div
          style={{
            width: 400,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #daa520, #ffd700, #daa520, transparent)",
            margin: "24px auto",
            borderRadius: 2,
          }}
        />

        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 700,
            color: "#daa520",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          — Lumi
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Single scene: image with Ken Burns + text overlay
const Scene: React.FC<{
  image: string;
  title: string;
  subtitle: string;
  kenBurnsDirection: "in" | "out";
  panX: number;
  panY: number;
}> = ({ image, title, subtitle, kenBurnsDirection, panX, panY }) => {
  return (
    <AbsoluteFill>
      <KenBurnsImage
        src={image}
        direction={kenBurnsDirection}
        panX={panX}
        panY={panY}
      />
      <SceneTitle title={title} subtitle={subtitle} />
    </AbsoluteFill>
  );
};

export const GreciaVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const SCENE_DURATION = 4 * fps; // 4s per scene
  const INTRO_DURATION = 3 * fps; // 3s intro
  const OUTRO_DURATION = 4 * fps; // 4s outro
  const FADE_DURATION = Math.floor(0.5 * fps); // 0.5s transitions

  // Alternate Ken Burns directions and pan for variety
  const kenBurnsVariations = [
    { direction: "in" as const, panX: 10, panY: -5 },
    { direction: "out" as const, panX: -8, panY: 3 },
    { direction: "in" as const, panX: -10, panY: -3 },
    { direction: "out" as const, panX: 6, panY: 5 },
    { direction: "in" as const, panX: 8, panY: -6 },
    { direction: "out" as const, panX: -6, panY: 4 },
    { direction: "in" as const, panX: -8, panY: -4 },
    { direction: "out" as const, panX: 10, panY: 3 },
    { direction: "in" as const, panX: 6, panY: -5 },
    { direction: "out" as const, panX: -10, panY: 5 },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {/* Intro */}
        <TransitionSeries.Sequence
          durationInFrames={INTRO_DURATION + FADE_DURATION}
        >
          <IntroCard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* 10 Scenes */}
        {SCENES.map((scene, i) => {
          const variation = kenBurnsVariations[i];
          const isLast = i === SCENES.length - 1;

          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence
                durationInFrames={SCENE_DURATION + FADE_DURATION}
              >
                <Scene
                  image={scene.image}
                  title={scene.title}
                  subtitle={scene.subtitle}
                  kenBurnsDirection={variation.direction}
                  panX={variation.panX}
                  panY={variation.panY}
                />
              </TransitionSeries.Sequence>

              {!isLast ? (
                <TransitionSeries.Transition
                  presentation={
                    i % 3 === 0
                      ? fade()
                      : i % 3 === 1
                        ? slide({ direction: "from-left" })
                        : fade()
                  }
                  timing={linearTiming({ durationInFrames: FADE_DURATION })}
                />
              ) : (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: FADE_DURATION })}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Outro */}
        <TransitionSeries.Sequence
          durationInFrames={OUTRO_DURATION + FADE_DURATION}
        >
          <OutroCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
