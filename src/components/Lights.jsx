import { forwardRef, memo } from "react";

export const Lights = memo(
  forwardRef((_, ref) => {
    return (
      <>
        <spotLight
          position={[-5.0, 10.0, 3.0]}
          intensity={600}
          angle={Math.PI / 4}
          penumbra={0.5}
          castShadow
        />

        <ambientLight intensity={2} color="blue" />
        <ambientLight intensity={0.5} />
      </>
    );
  })
);
