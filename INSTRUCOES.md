# Remotion Video - Instruções e Processo

## Setup do Projeto

```bash
mkdir remotion-test && cd remotion-test
npm init -y
npm install remotion @remotion/cli @remotion/transitions @remotion/google-fonts react react-dom typescript @types/react
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

### Estrutura de arquivos
```
remotion-test/
├── src/
│   ├── index.ts              # registerRoot (entry point)
│   ├── Root.tsx               # Compositions registradas
│   ├── CARCKHÉticVideo.tsx     # Video 1: cARCKHÉtic motivacional
│   └── GreciaVideo.tsx        # Video 2: livro Grecia Antiga
├── public/
│   └── livro11/               # Imagens do livro (PNG)
├── books/
│   └── livro11/               # Fonte: imagens + story.md
├── out/                       # Videos renderizados
│   ├── cARCKHÉtic.mp4          # v1 sem skill
│   ├── cARCKHÉtic-v2.mp4       # v2 com skill
│   └── grecia-antiga.mp4      # Video do livro
├── package.json
└── tsconfig.json
```

## Arquivos base (sempre necessarios)

### src/index.ts
```tsx
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

### src/Root.tsx
Registra cada video como `<Composition>` com id, component, fps, dimensoes e duracao em frames.
```tsx
import { Composition } from "remotion";
import { MeuVideo } from "./MeuVideo";

export const RemotionRoot = () => (
  <Composition
    id="MeuVideo"
    component={MeuVideo}
    durationInFrames={300}  // 10s a 30fps
    fps={30}
    width={1920}
    height={1080}
  />
);
```

## Comandos

```bash
# Preview no browser
npx remotion studio

# Renderizar video
npx remotion render MeuVideo out/meu-video.mp4

# Renderizar com qualidade especifica
npx remotion render MeuVideo out/meu-video.mp4 --crf 18
```

---

## Video 1: CARCKHÉtic Motivacional (cARCKHÉtic-v2.mp4)

**Spec**: 12s, 1920x1080, 30fps, 4 cenas

### Conceitos usados
- `TransitionSeries` + `fade()` para transicoes suaves entre cenas (0.5s)
- `spring({ config: { damping: 200 } })` para entrada suave sem bounce
- `Easing.inOut(Easing.quad)` para curvas de animacao naturais
- `interpolate()` para todas animacoes (NUNCA usar CSS transitions)
- SVG para montanhas + gradientes CSS para ceu/sol
- Particulas via array + Math.sin para flutuacao

### Cenas
1. **MountainSunrise (0-3s)**: Gradiente de ceu + sol subindo + raios conic-gradient + montanhas SVG + neblina. Zoom lento via `scale` com easing.
2. **TextScene (3-6s)**: "Success Takes Time" com spring entrance + glow animado + underline bar animada + particulas flutuantes.
3. **TextTransition (6-10s)**: Texto anterior sai (fade+slide up) + novo texto entra com spring. Cross-fade entre os dois.
4. **FinalHold (10-12s)**: Segura "Keep Moving Forward" flutuando + fade out com easing.

### Calculo de duracao
Com TransitionSeries, transicoes sobrepõem cenas:
- Total = soma das duracoes das sequences - soma das transicoes
- Cada sequence recebe `durationInFrames + fadeDuration` para compensar

---

## Video 2: Grecia Antiga (grecia-antiga.mp4)

**Spec**: ~47s, 1920x1080, 30fps, 10 cenas de imagens + intro + outro

### Conceitos usados
- `<Img>` do remotion (NUNCA `<img>` nativo) para garantir carregamento antes do render
- `staticFile()` para referenciar imagens em `public/`
- `@remotion/google-fonts/Montserrat` para tipografia
- `TransitionSeries` com `fade()` e `slide()` alternados
- Ken Burns effect customizado (zoom + pan com Easing)

### Como criar video a partir de imagens

1. **Colocar imagens em `public/`**:
```bash
mkdir -p public/livro11
cp books/livro11/*.png public/livro11/
```

2. **Usar `<Img>` + `staticFile()`**:
```tsx
import { Img, staticFile } from "remotion";
<Img src={staticFile("livro11/Cena_01.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
```

3. **Ken Burns Effect** (zoom + pan suave):
```tsx
const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.sin),
});
const translateX = interpolate(frame, [0, durationInFrames], [0, panX], {
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.sin),
});
// Aplicar no style da Img:
style={{ transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)` }}
```

4. **Overlay de texto na base da imagem**:
- Gradiente escuro (`linear-gradient transparent -> rgba(0,0,0,0.85)`) na metade inferior
- Titulo com `spring({ damping: 200 })` + delay
- Subtitulo com delay maior
- Barra decorativa animada com `interpolate` + `Easing.out`

5. **Alternar direcoes** para variedade visual:
```tsx
const variations = [
  { direction: "in", panX: 10, panY: -5 },
  { direction: "out", panX: -8, panY: 3 },
  // ...alternando para cada cena
];
```

### Estrutura do componente
```
GreciaVideo
├── IntroCard          # Titulo do episodio com particulas
├── Scene x10          # Cada cena do livro
│   ├── KenBurnsImage  # Imagem com zoom/pan animado
│   └── SceneTitle     # Titulo + subtitulo + barra
└── OutroCard          # Citacao final com fade out
```

### Calculo de duracao
```
Intro: 3s (90 frames) + 15 extra = 105
10 cenas: 4s (120 frames) + 15 extra = 135 cada = 1350
Outro: 4s (120 frames) + 15 extra = 135
11 transicoes: 15 frames cada = 165
Total: 105 + 1350 + 135 - 165 = 1425 frames (47.5s)
```

---

## Best Practices do Skill Remotion

1. **TODAS animacoes via `useCurrentFrame()`** — NUNCA CSS transitions/animations
2. **Timing em segundos**: `2 * fps` em vez de `60` frames
3. **`<Img>` do remotion** — NUNCA `<img>` HTML nativo
4. **`staticFile()`** para assets em `public/`
5. **`spring({ damping: 200 })`** para movimento suave sem bounce
6. **`spring({ damping: 8 })`** para bounce playful
7. **`Easing.inOut(Easing.quad)`** para transicoes naturais
8. **`extrapolateRight: "clamp"`** em todo `interpolate()` para evitar overflow
9. **`TransitionSeries`** com `fade()`/`slide()` para transicoes entre cenas
10. **`@remotion/google-fonts`** para fontes type-safe que bloqueiam render ate carregar
11. **`premountFor`** em `<Sequence>` para pre-carregar componentes
12. **Componentes extraidos** (Particles, KenBurnsImage) para reutilizacao
