import { useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";
import { RepeatWrapping } from "three";

export function Floor({ sizeX = 15, sizeY = 15, ...props }) {
  const textures = useTexture([
    "/demo-2022-fake-caustics/pooltiles/tlfmffydy_4K_Albedo.jpg",
    "/demo-2022-fake-caustics/pooltiles/tlfmffydy_4K_AO.jpg",
    "/demo-2022-fake-caustics/pooltiles/tlfmffydy_4K_Normal.jpg",
    "/demo-2022-fake-caustics/pooltiles/tlfmffydy_4K_Roughness.jpg",
  ]);
  const [Albedo, AO, Normal, Roughness] = textures;

  useLayoutEffect(() => {
    for (const texture of textures) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(sizeX / 4, sizeY / 4);
    }
  }, [textures]);

  return (
    <mesh castShadow receiveShadow {...props}>
      <planeGeometry args={[sizeX, sizeY, 1, 1]} />
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
