import { useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useMemo, useRef } from "react";
import { BackSide } from "three";
import CausticLight from "./CausticLight";
import { NormalMaterial } from "./NormalMaterial";
import { PositionMaterial } from "./PositionMaterial";
import Voronoi from "./Voronoi";

export default function Caustics({ children }) {
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);

  const fbo = useFBO(size.width * dpr, size.height * dpr);
  const normalFbo = useFBO(size.width * dpr, size.height * dpr);
  const positionFbo = useFBO(size.width * dpr, size.height * dpr);

  const normalMaterial = useMemo(() => new NormalMaterial(), []);
  const positionMaterial = useMemo(() => new PositionMaterial(), []);

  const boundsRef = useRef(null);
  const groupRef = useRef(null);

  const vertexShader = useMemo(
    () => /* glsl */ `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    []
  );

  const fragmentShader = useMemo(
    () =>
      patchShaders(/* glsl */ `
        uniform sampler2D uSceneColorTexture;
        uniform sampler2D uSceneNormalTexture;
        uniform sampler2D uPositionTexture;
        uniform vec2 uResolution;
        uniform float uTime;

        ${Voronoi}

        vec3 getNoise(vec3 pos) {
          gln_tWorleyOpts opts = gln_tWorleyOpts(1., -2., 1., false);
                  
          float scale = 1.5;
          vec3 noiseScale = vec3(scale, 0.6, scale);
          float t =  (uTime * 0.5);
          float offset = 0.09;

          vec3 coords = pos + vec3(t * 0.5, t, 0.0);
          vec3 n1 = vec3(
            voronoi3d((coords + vec3(offset, 0.0, 0.0)) * noiseScale).x,
            voronoi3d((coords + vec3(0.0, offset, 0.0)) * noiseScale).x,
            voronoi3d((coords + vec3(0.0, 0.0, offset)) * noiseScale).x
          );

          vec3 n = n1;
          n = pow(n, vec3(3.));
          return clamp(n, 0.0, 1.0);

        }
  

        float getLuma(vec3 color) {
          return dot(color, vec3(0.2126, 0.7152, 0.0722));
        }
        
        void main() {
          vec2 _uv = gl_FragCoord.xy / uResolution;
          float distortion = gln_simplex(_uv + (uTime * 0.5));
          distortion = gln_normalize(distortion);

          vec2 uv = _uv + vec2(distortion * 0.006);
          vec4 sceneColor = texture2D(uSceneColorTexture, uv);


          vec3 normal = texture2D(uSceneNormalTexture, uv).xyz;
          vec3 position = texture2D(uPositionTexture, uv).xyz;
          vec3 lightPos = vec3(-5.0, 10.0, 3.0);

          vec3 projectorDirection = normalize(lightPos);
          float shadow = dot(normal, projectorDirection);
          float dotProduct = clamp(shadow, 0.0, 1.0);

          vec3 n = getNoise(position);
          n *= dotProduct;

          float distFromCamera = length(cameraPosition - position);
          distFromCamera = distFromCamera / 20.0;
          distFromCamera = 1.0 - clamp(distFromCamera, 0.0, 1.0);
          distFromCamera = smoothstep(0.0, 0.4, distFromCamera);
          n *= distFromCamera;

          float luma = getLuma(sceneColor.rgb);
          luma = smoothstep(0.15, 0.3, luma);
          luma = clamp(luma, 0.0, 1.0);

          gl_FragColor = vec4(vec3(sceneColor.rgb + (n * luma)), sceneColor.a); 

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
  `),
    []
  );

  const uniforms = useMemo(
    () => ({
      uSceneColorTexture: { value: fbo.texture },
      uSceneNormalTexture: { value: normalFbo.texture },
      uPositionTexture: { value: positionFbo.texture },
      uResolution: { value: [size.width * dpr, size.height * dpr] },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ scene, camera, gl }, dt) => {
    groupRef.current.visible = true;
    boundsRef.current.visible = false;
    gl.setRenderTarget(fbo);
    gl.clear();
    gl.render(scene, camera);

    gl.setRenderTarget(normalFbo);
    gl.clear();
    groupRef.current.overrideMaterial = normalMaterial;
    gl.render(groupRef.current, camera);
    groupRef.current.overrideMaterial = null;

    gl.setRenderTarget(positionFbo);
    gl.clear();
    groupRef.current.overrideMaterial = positionMaterial;
    gl.render(groupRef.current, camera);
    groupRef.current.overrideMaterial = null;
    gl.setRenderTarget(null);

    boundsRef.current.visible = true;
    groupRef.current.visible = false;

    uniforms.uTime.value += dt;
  });

  return (
    <>
      <scene ref={groupRef}>{children}</scene>
      <mesh ref={boundsRef} renderOrder={1} position={[0, 5, 0]}>
        <boxGeometry args={[10, 10, 10]} />
        <shaderMaterial
          key={fragmentShader + vertexShader}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          depthWrite={false}
          depthTest={false}
          side={BackSide}
        />
      </mesh>
      <CausticLight />
    </>
  );
}
