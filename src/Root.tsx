import React from "react";
import { Composition } from "remotion";
import { CARCKHÉticVideo } from "./CARCKHÉticVideo";
import { GreciaVideo } from "./GreciaVideo";
import { ColaFreshVideo } from "./ColaFreshVideo";
import { ColaCommercial } from "./ColaCommercial";
import { MarvelScene } from "./MarvelScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CARCKHÉticVideo"
        component={CARCKHÉticVideo}
        durationInFrames={375}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GreciaVideo"
        component={GreciaVideo}
        durationInFrames={1425}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ColaFreshVideo"
        component={ColaFreshVideo}
        durationInFrames={612}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ColaCommercial"
        component={ColaCommercial}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MarvelScene"
        component={MarvelScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
