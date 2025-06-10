import {
  Float,
  PerspectiveCamera,
  RoundedBox,
  useGLTF,
} from "@react-three/drei";
import { Suspense } from "react";
import { MathUtils } from "three";
import Caustics from "./caustics/Caustics";
import { CameraRig } from "./components/CameraRig";
import { Floor } from "./components/Floor";
import { Lights } from "./components/Lights";

function Thing() {
  const size = 10;
  const { nodes } = useGLTF(
    "/demo-2022-fake-caustics/bronze_monkey_statue.glb"
  );

  return (
    <>
      <Lights />

      <Caustics>
        <Floor sizeX={size} sizeY={size} rotation-x={-Math.PI / 2} />
        <Floor sizeX={size} sizeY={size} position={[0, size / 2, -size / 2]} />
        <Floor
          sizeX={size}
          sizeY={size}
          position={[size / 2, size / 2, 0]}
          rotation-y={-Math.PI / 2}
        />

        <Float floatIntensity={5} rotationIntensity={2}>
          <group position-y={1.5} rotation-y={-Math.PI / 4}>
            <mesh
              castShadow
              rotation={[MathUtils.degToRad(-35), 0, 0]}
              geometry={nodes.Object_4.geometry}
            >
              <meshPhysicalMaterial color="tomato" roughness={0.1} />
            </mesh>
          </group>
        </Float>

        <Float floatIntensity={5} rotationIntensity={2}>
          <RoundedBox
            position={[2, 1.5, 0]}
            args={[1, 1, 1]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial color="cyan" roughness={0.1} />
          </RoundedBox>
        </Float>

        <Float floatIntensity={5} rotationIntensity={2}>
          <RoundedBox
            position={[-2.5, 1.5, 0.5]}
            args={[0.7, 0.7, 0.7]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial color="red" roughness={0.1} />
          </RoundedBox>
        </Float>
      </Caustics>
    </>
  );
}

export function Scene() {
  return (
    <>
      <fog attach="fog" args={["#3b9ed1", 0.1, 25]} />
      <color attach="background" args={["#3b9ed1"]} />

      <PerspectiveCamera fov={40} position={[-7, 4, 7]} makeDefault />
      <CameraRig />

      <Suspense>
        <Thing />
      </Suspense>
    </>
  );
}
