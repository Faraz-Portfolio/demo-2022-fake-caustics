import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -5 + (state.pointer.x * state.viewport.width) / 3,
        (2 + state.pointer.y) / 2,
        5,
      ],
      0.5,
      delta
    );
    state.camera.lookAt(0, 1.2, 0);
  });
}
