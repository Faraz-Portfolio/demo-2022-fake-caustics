import { useTexture } from "@react-three/drei";

export function Floor({ size = 30, ...props }) {
  const [Albedo, AO, Normal, Roughness] = useTexture([
    "/pooltiles/tlfmffydy_4K_Albedo.jpg",
    "/pooltiles/tlfmffydy_4K_AO.jpg",
    "/pooltiles/tlfmffydy_4K_Normal.jpg",
    "/pooltiles/tlfmffydy_4K_Roughness.jpg",
  ]);

  return (
    <mesh castShadow receiveShadow {...props}>
      <planeGeometry args={[size, size, 256, 256]} />
      <meshPhysicalMaterial
        map={Albedo}
        aoMap={AO}
        normalMap={Normal}
        roughness={0.0}
        roughnessMap={Roughness}
      />
    </mesh>
  );
}
