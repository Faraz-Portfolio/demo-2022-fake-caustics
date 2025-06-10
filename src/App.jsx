import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
} from "@react-three/postprocessing";
import { Scene } from "./Scene";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Canvas
        dpr={1}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        shadows
        style={{
          filter: "contrast(1.5)",
        }}
      >
        <Scene />

        <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0.7} mipmapBlur />
          <BrightnessContrast brightness={-0.15} />
        </EffectComposer>
      </Canvas>

      {/* Grading gradients */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(to top, rgba(0, 1, 31, 0.8) 1%, transparent 50%)",
        }}
      />
    </div>
  );
}

export default App;
