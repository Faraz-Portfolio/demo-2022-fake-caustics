import { useFrame, useThree } from "@react-three/fiber";
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useMemo } from "react";
import { AdditiveBlending } from "three";

export default function CausticLight() {
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);

  const vertexShader = useMemo(
    () => /* glsl */ `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    []
  );

  const fragmentShader = useMemo(
    () =>
      patchShaders(/* glsl */ `
        uniform vec2 uResolution;
        uniform float uTime;
        
        void main() {
          vec2 uv = gl_FragCoord.xy / uResolution;
          float mask = uv.y;
          mask = smoothstep(0.5, 2.0, mask);

          float n = gln_simplex(vec3(uv, uTime) * vec3(10.0, 1.0, 1.0));
          n = gln_normalize(n);
          n = smoothstep(0.0, 2.0, n);
          n = clamp(n, 0.0, 1.0);

          // Blueish
          gl_FragColor = vec4(vec3(n * 1.5), mask);
        }
      `),
    []
  );

  const uniforms = useMemo(
    () => ({
      uResolution: { value: [size.width * dpr, size.height * dpr] },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ scene, camera, gl }, dt) => {
    uniforms.uTime.value += dt;
  });

  return (
    <>
      <mesh position={[0, 5, 0]} renderOrder={2} frustumCulled={false}>
        <planeGeometry args={[2, 2, 1, 1]} />
        <shaderMaterial
          key={vertexShader + fragmentShader}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </>
  );
}
